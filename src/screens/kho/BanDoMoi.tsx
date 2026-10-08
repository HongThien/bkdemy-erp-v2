// BanDoMoi — soạn BẢN ĐỒ MỚI 4 tầng (nháp) cho nhánh Đại. spec-ban-do-4-tang.md §0 + §9.0 (CEO chốt 08/10).
//
// Việc của CEO: ① CHIA TẦNG + THỨ TỰ HỌC · ② dán LÝ THUYẾT (nhóm) / VÍ DỤ (dạng bài) · ③ viết MÔ TẢ nhận biết.
// Bố cục (CEO 08/10):
//   · mỗi màn 1 CHỦ ĐỀ (thanh chủ đề trên cùng) · thanh CHUYÊN ĐỀ trái→phải = thứ tự học, ◀ ▶ / phím ←→ để chuyển
//   · chuyên đề là 1 box; NHÓM BÀI là box rẽ nhánh từ chuyên đề: học trước ở TRÊN, học sau ở DƯỚI, có mũi tên;
//     nhóm độc lập = nhánh khác · DẠNG BÀI là card trong box nhóm, trên→dưới = thứ tự học
//   · số thứ tự cả 3 tầng do DB tự đánh (fn_bdm_cay / _bdm_so_nhom) và HIỆN trên từng box — sai là nhìn thấy
// ⭐ Vị trí trên màn KHÔNG phải dữ liệu: tầng (trên/dưới) suy từ mũi tên tiền đề, cột suy từ số thứ tự. CEO đổi thứ
//   tự bằng cách kéo (ghi thu_tu) và nối/gỡ mũi tên (ghi tiền đề) — không có ô nào "ngầm" mang nghĩa.
// Kéo thả HTML5 thuần. Sau mỗi lần ghi: tải lại cây NỀN, không xoá màn (CLAUDE §2 React).
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react'
import {
  getCay, themChuDe, suaChuDe, themChuyenDeVaoChuDe, suaChuyenDe, xoaChuDeTronGoi, xoaChuyenDeKhoiChuDe, xoaNhomTronGoi,
  themNhom, suaNhom, themDangBai, suaDangBai, xoaDangBai, sapXep, chuyenNhom, chuyenDangBai, chuyenO,
  nangDangBai, haNhom, themTienDe, goTienDe, gopChuyenDe, getLyThuyetNhom, getViDuDangBai, getLyThuyetDangBai, lyThuyetNhomApi, viDuDangBaiApi, lyThuyetDangBaiApi,
  getDangCu, ganDangCu, goDoiUng, goDoiUngTheoDich, getCauChuaGan, ganCau, ganCum,
  type BdmCay, type BdmChuDe, type BdmO, type BdmNhom, type BdmDangBai, type BdmDangCu, type BdmDangCuRef, type BdmDich, type BdmCauChuaGan,
} from '../../lib/kho/banDoMoi'
import { KHOI_OPTIONS, DEFAULT_KHOI, type LyThuyet } from '../../lib/kho/api'
import { LyThuyetModal } from './BanDo'
import { MathText, inp } from './ui'

// ⭐ CEO 08/10: dựng bản đồ mới TỪ ĐẦU, không bám bản đồ cũ ⇒ TẮT mọi phần tham chiếu bản đồ cũ trên màn soạn
// (ngăn 📦, nhãn dạng cũ, ⚠ câu chưa gán, dòng "Khớp bản đồ cũ", bảng gán câu). Bảng/hàm DB vẫn giữ: tới bước XẾP BÀI
// (kho-rules/README.md bước 3 — Claude đọc bản đồ mới để gán, học thuật duyệt) thì bật lại bảng gán câu.
const HIEN_KHOP_CU = false

// Nhớ chủ đề / chuyên đề đang xem + ngăn bản đồ cũ — sống tới F5 (CLAUDE §2: rời màn quay lại đúng chỗ cũ)
const NHO: { chuDe: Record<string, string>; chuyenDe: Record<string, string>; nganCu: boolean } = { chuDe: {}, chuyenDe: {}, nganCu: false }

// Đích của bảng gán câu: câu chưa gán của 1 nhóm (②) hoặc 1 chuyên đề trong chủ đề (③)
type GanMo = { nhan: string; dich: { nhom: string } | { chuDe: string; chuyenDe: string }; lua: { id: string; nhan: string }[] }

type Keo =
  | { loai: 'dang_cu'; ma: string; ten: string }
  | { loai: 'chu_de'; id: string }
  | { loai: 'o'; chuDeId: string; chuyenDeId: string }
  | { loai: 'nhom'; id: string; chuDeId: string; chuyenDeId: string }
  | { loai: 'dang_bai'; id: string; nhomId: string }
type LoaiNoiDung = 'nhom' | 'db_lt' | 'db_vd' // lý thuyết nhóm · lý thuyết dạng bài · ví dụ dạng bài
type Chon = { loai: 'chu_de' } | { loai: 'o' } | { loai: 'nhom'; id: string } | { loai: 'dang_bai'; id: string }
type VungProps = { onDragOver: (e: DragEvent) => void; onDragLeave: (e: DragEvent) => void; onDrop: (e: DragEvent) => void }

const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
const oKey = (chuDeId: string, chuyenDeId: string) => `${chuDeId}|${chuyenDeId}`
const chenTruoc = (ids: string[], id: string, truoc: string | null) => {
  const bo = ids.filter((x) => x !== id)
  const i = truoc ? bo.indexOf(truoc) : -1
  if (i < 0) bo.push(id); else bo.splice(i, 0, id)
  return bo
}
const dangGo = (t: EventTarget | null) => !!t && ['INPUT', 'TEXTAREA', 'SELECT'].includes((t as HTMLElement).tagName)

// Xếp box nhóm lên lưới để VẼ (chỉ hiển thị): hàng = tầng (DB tính), cột = nhánh.
// Duyệt theo số thứ tự: con đầu tiên của 1 nhóm đứng thẳng dưới nhóm đó; con khác / nhóm gốc mở cột mới bên phải.
function xepLuoi(nhom: BdmNhom[]) {
  const theoSo = [...nhom].sort((a, b) => a.so - b.so)
  const so = new Map(nhom.map((n) => [n.id, n.so]))
  const cot = new Map<string, number>()
  const daNhuongCot = new Set<string>()
  const chiem = new Set<string>()
  let maxCot = -1
  for (const n of theoSo) {
    let c = -1
    for (const p of [...n.tien_de].sort((a, b) => (so.get(a) ?? 0) - (so.get(b) ?? 0))) {
      const cp = cot.get(p)
      if (cp !== undefined && !daNhuongCot.has(p) && !chiem.has(`${n.tang}:${cp}`)) { c = cp; daNhuongCot.add(p); break }
    }
    if (c < 0) { c = maxCot + 1; while (chiem.has(`${n.tang}:${c}`)) c++ }
    cot.set(n.id, c); chiem.add(`${n.tang}:${c}`); maxCot = Math.max(maxCot, c)
  }
  return { cot, soCot: maxCot + 1, soHang: Math.max(0, ...nhom.map((n) => n.tang)) + 1 }
}

function BanDoMoi({ khoi, dauMan }: { khoi: string; dauMan?: ReactNode }) {
  const [cay, setCay] = useState<BdmCay | null>(null)
  const [loiTai, setLoiTai] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [bao, setBao] = useState<string | null>(null)
  const [chuDeId, setChuDeId] = useState<string | null>(NHO.chuDe[khoi] ?? null)
  const [chuyenDeId, setChuyenDeId] = useState<string | null>(null)
  const [chon, setChon] = useState<Chon | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [dangKeo, setDangKeo] = useState<Keo['loai'] | null>(null)
  const [lt, setLt] = useState<{ loai: LoaiNoiDung; id: string; ten: string; current: LyThuyet } | null>(null)
  const [nganCu, setNganCu] = useState(NHO.nganCu)
  const [dangCu, setDangCu] = useState<BdmDangCu[] | null>(null)
  const [ganMo, setGanMo] = useState<GanMo | null>(null)
  const keoRef = useRef<Keo | null>(null)
  const baoTimer = useRef<number | undefined>(undefined)

  // Đổi KHỐI = đổi ngữ cảnh ⇒ reset + tải lại
  useEffect(() => {
    let song = true
    setCay(null); setLoiTai(null); setChon(null); setChuDeId(NHO.chuDe[khoi] ?? null); setDangCu(null)
    getCay(khoi).then((c) => { if (song) setCay(c) }).catch((e) => { if (song) setLoiTai(String(e.message ?? e)) })
    return () => { song = false }
  }, [khoi])
  // Ngăn bản đồ cũ: tải khi mở (và khi đổi khối lúc đang mở)
  useEffect(() => {
    NHO.nganCu = nganCu
    if (!nganCu || dangCu) return
    let song = true
    getDangCu(khoi).then((d) => { if (song) setDangCu(d) }).catch((e) => { if (song) setLoi(String(e.message ?? e)) })
    return () => { song = false }
  }, [nganCu, khoi, dangCu])

  const chuDe = cay?.chu_de.find((c) => c.id === chuDeId) ?? cay?.chu_de[0] ?? null
  const o = chuDe ? (chuDe.o.find((x) => x.chuyen_de_id === (chuyenDeId ?? NHO.chuyenDe[chuDe.id])) ?? chuDe.o[0] ?? null) : null
  useEffect(() => { if (chuDe) NHO.chuDe[khoi] = chuDe.id }, [chuDe?.id, khoi]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (chuDe && o) NHO.chuyenDe[chuDe.id] = o.chuyen_de_id }, [chuDe?.id, o?.chuyen_de_id]) // eslint-disable-line react-hooks/exhaustive-deps
  const chonChuDe = (id: string) => { setChuDeId(id); setChuyenDeId(null); setChon(null) }
  const chonChuyenDe = (id: string) => { setChuyenDeId(id); setChon(null) }
  // Đổi thứ tự chuyên đề 1 bậc (▲▼ / Alt+↑↓) — không phải kéo, không lẫn với chuyển nhóm
  const doiThuTuCD = (chuyenDeId: string, d: -1 | 1) => {
    if (!chuDe) return
    const ids = chuDe.o.map((x) => x.chuyen_de_id)
    const i = ids.indexOf(chuyenDeId)
    if (i < 0 || i + d < 0 || i + d >= ids.length) return
    ;[ids[i], ids[i + d]] = [ids[i + d], ids[i]]
    void lam(() => sapXep('o', ids.map((c) => oKey(chuDe.id, c))), d < 0 ? 'Đã đưa lên' : 'Đã đưa xuống')
  }
  const buocChuyenDe = (d: -1 | 1) => {
    if (!chuDe || !o) return
    const i = chuDe.o.findIndex((x) => x.chuyen_de_id === o.chuyen_de_id) + d
    if (i >= 0 && i < chuDe.o.length) chonChuyenDe(chuDe.o[i].chuyen_de_id)
  }
  // Phím ← → chuyển chuyên đề (trừ khi đang gõ)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !lt && !ganMo && chon) { setChon(null); return }
      if (dangGo(e.target) || lt || ganMo || chon?.loai === 'nhom' || chon?.loai === 'dang_bai') return
      if (e.key === 'ArrowUp') { e.preventDefault(); if (e.altKey && o) doiThuTuCD(o.chuyen_de_id, -1); else buocChuyenDe(-1) }
      if (e.key === 'ArrowDown') { e.preventDefault(); if (e.altKey && o) doiThuTuCD(o.chuyen_de_id, 1); else buocChuyenDe(1) }
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  })

  // Tải lại NỀN (không xoá màn): cây + ngăn bản đồ cũ nếu đang mở
  const napLai = () => Promise.all([
    getCay(khoi).then(setCay),
    nganCu ? getDangCu(khoi).then(setDangCu) : Promise.resolve(),
  ]).catch((e) => setLoi(String(e.message ?? e)))
  // Thả dạng cũ vào đích ① dạng bài · ② nhóm · ③ chuyên đề
  const ganVao = (dich: BdmDich, nhan: string) => (k: Keo) =>
    k.loai === 'dang_cu' ? lam(() => ganDangCu(k.ma, dich), `Đã gắn «${k.ten}» vào ${nhan}`) : undefined
  // Mở bảng gán câu cho 1 đích — lựa chọn = các dạng bài dưới đích
  const moGan = (o: BdmO, n: BdmNhom | null) => {
    if (!chuDe) return
    const ds = n ? [n] : o.nhom
    setGanMo({
      nhan: n ? `nhóm #${n.so} ${n.ten}` : `chuyên đề ${o.ten}`,
      dich: n ? { nhom: n.id } : { chuDe: chuDe.id, chuyenDe: o.chuyen_de_id },
      lua: ds.flatMap((x) => x.dang_bai.map((d) => ({ id: d.id, nhan: `${x.so}.${d.so} ${d.ten}${n ? '' : ` (nhóm ${x.ten})`}` }))),
    })
  }
  const thongBao = (s: string) => { setBao(s); window.clearTimeout(baoTimer.current); baoTimer.current = window.setTimeout(() => setBao(null), 2000) }
  async function lam(viec: () => Promise<unknown>, xong = 'Đã lưu') {
    setLoi(null)
    try { await viec(); thongBao(xong); await napLai() }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)); await napLai() }
  }

  // ── Kéo thả ──
  function batDauKeo(e: DragEvent, k: Keo) {
    e.stopPropagation()
    keoRef.current = k; setDangKeo(k.loai)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', 'bdm')
  }
  function ketThucKeo() { keoRef.current = null; setHover(null); setDangKeo(null) }
  function vung(key: string, nhan: (k: Keo) => boolean, tha: (k: Keo) => Promise<void> | void): VungProps {
    return {
      onDragOver: (e) => {
        const k = keoRef.current
        if (!k || !nhan(k)) return
        e.preventDefault(); e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'
        if (hover !== key) setHover(key)
      },
      onDragLeave: (e) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setHover((h) => (h === key ? null : h)) },
      onDrop: (e) => {
        const k = keoRef.current
        if (!k || !nhan(k)) return
        e.preventDefault(); e.stopPropagation()
        ketThucKeo()
        void tha(k)
      },
    }
  }

  async function moLyThuyet(loai: LoaiNoiDung, id: string, ten: string) {
    setLoi(null)
    try { setLt({ loai, id, ten, current: loai === 'nhom' ? await getLyThuyetNhom(id) : loai === 'db_lt' ? await getLyThuyetDangBai(id) : await getViDuDangBai(id) }) }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)) }
  }

  // Tiến độ soạn của khối — đếm thứ đang hiển thị (badge)
  const tienDo = useMemo(() => {
    let nhom = 0, nhomMoTa = 0, nhomLt = 0, db = 0, dbMoTa = 0, dbLt = 0, dbVd = 0
    for (const cd of cay?.chu_de ?? []) for (const x of cd.o) for (const n of x.nhom) {
      nhom++; if (n.mo_ta.trim()) nhomMoTa++; if (n.co_ly_thuyet) nhomLt++
      for (const d of n.dang_bai) { db++; if (d.mo_ta.trim()) dbMoTa++; if (d.co_ly_thuyet) dbLt++; if (d.co_vi_du) dbVd++ }
    }
    return { nhom, nhomMoTa, nhomLt, db, dbMoTa, dbLt, dbVd }
  }, [cay])

  if (loiTai) return <div className="p-8 text-sm text-rose-600">Không tải được bản đồ mới: {loiTai}</div>
  if (!cay) return <div className="flex h-full items-center justify-center text-sm text-slate-400">Đang tải bản đồ mới…</div>

  const sang = (k: string) => (hover === k ? 'ring-2 ring-indigo-400 ring-offset-1' : '')

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Đầu màn: khối · CHỦ ĐỀ (dropdown, mỗi màn 1 chủ đề) · bản đồ cũ · tiến độ */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-slate-200 bg-white px-4 py-2">
        <span className="text-[14px] font-semibold text-slate-900">🆕 Bản đồ mới</span>
        <span className="rounded bg-amber-100 px-1.5 text-[11px] font-medium text-amber-800">nháp · Đại · chưa ảnh hưởng bản đồ đang chạy</span>
        {dauMan}
        <span className="flex items-center gap-1.5">
          <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Chủ đề</span>
          <select value={chuDe?.id ?? ''} onChange={(e) => chonChuDe(e.target.value)} disabled={!cay.chu_de.length}
            className={`${inp} w-auto max-w-[420px] py-1 text-[13px] font-medium`}>
            {!cay.chu_de.length && <option value="">— chưa có chủ đề —</option>}
            {cay.chu_de.map((cd, i) => <option key={cd.id} value={cd.id}>{i + 1}. {cd.ten}</option>)}
          </select>
        </span>
        {chuDe && (
          <button onClick={() => setChon({ loai: 'chu_de' })} title="Sửa tên / thứ tự / xoá chủ đề"
            className="rounded-md border border-slate-200 px-2 py-1 text-[12.5px] text-slate-600 hover:border-indigo-300 hover:text-indigo-700">⚙ Chủ đề</button>
        )}
        <ThemNhanh nhan="+ Chủ đề" goiY="Tên chủ đề…" onThem={(ten) => lam(() => themChuDe(khoi, ten), 'Đã thêm chủ đề')} />
        {HIEN_KHOP_CU && <button onClick={() => setNganCu(!nganCu)} title="Ngăn dạng cũ — kéo dạng cũ thả vào dạng bài / nhóm / chuyên đề để gắn"
          className={`rounded-lg border px-2.5 py-1 text-[12.5px] font-medium ${nganCu ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-600 hover:border-amber-300'}`}>
          📦 Bản đồ cũ{cay.tong.dang_cu_chua_gan ? <span className="ml-1 rounded-full bg-rose-500 px-1.5 text-[10.5px] font-bold text-white">{cay.tong.dang_cu_chua_gan}</span> : null}
        </button>}
        <span className="ml-auto flex gap-3 text-[11.5px] text-slate-500">
          <span>Nhóm <b>{tienDo.nhom}</b> · mô tả {tienDo.nhomMoTa} · lý thuyết {tienDo.nhomLt}</span>
          <span>Dạng bài <b>{tienDo.db}</b> · mô tả {tienDo.dbMoTa} · lý thuyết {tienDo.dbLt} · ví dụ {tienDo.dbVd}</span>
        </span>
      </div>
      {/* Khớp bản đồ cũ — luật: mọi câu phải thuộc 1 dạng bài. Khối xong khi cả 2 số về 0. */}
      {HIEN_KHOP_CU && <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-200 bg-slate-50 px-4 py-1 text-[12px] text-slate-600">
        <span className="font-semibold text-slate-700">Khớp bản đồ cũ:</span>
        <span className={cay.tong.dang_cu_chua_gan ? 'text-rose-600' : 'text-emerald-600'}>
          Dạng cũ chưa gắn <b>{cay.tong.dang_cu_chua_gan}</b>/{cay.tong.dang_cu}{cay.tong.dang_cu_chua_gan ? ` (${cay.tong.cau_dang_cu_chua_gan} câu)` : ' ✓'}
        </span>
        <span className={cay.tong.cau_chua_gan ? 'text-rose-600' : 'text-emerald-600'}>
          Câu chưa gán dạng bài <b>{cay.tong.cau_chua_gan}</b>/{cay.tong.cau}{cay.tong.cau_chua_gan ? '' : ' ✓'}
        </span>
        <span className="text-slate-400">(dạng cũ của khối {khoi}; bản sao đi theo câu gốc)</span>
      </div>}
      {loi && (
        <div className="flex items-start gap-2 border-b border-rose-200 bg-rose-50 px-4 py-2 text-[13px] text-rose-700">
          <span className="flex-1">⚠ {loi}</span>
          <button onClick={() => setLoi(null)} className="text-rose-400 hover:text-rose-700">✕</button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Cột CHUYÊN ĐỀ — trên→dưới = thứ tự học; kéo để sắp; thả nhóm vào để chuyển */}
        {chuDe && (
          <div className="flex w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
              <span className="flex-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Chuyên đề ({chuDe.o.length})</span>
              <ThemChuyenDe cay={cay} cd={chuDe} onThem={(a) => lam(() => themChuyenDeVaoChuDe(chuDe.id, a), 'Đã thêm chuyên đề')} />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
              {!chuDe.o.length && <div className="p-2 text-[12px] text-slate-400">Chưa có — bấm «+ Chuyên đề».</div>}
              {chuDe.o.map((x) => {
                const conChuaGan = HIEN_KHOP_CU && (x.chua_gan > 0 || x.nhom.some((n) => n.chua_gan > 0))
                const dangChonCD = o?.chuyen_de_id === x.chuyen_de_id
                const k = `o:${x.chuyen_de_id}`
                // Kéo CHUYÊN ĐỀ ⇒ vạch chèn (đặt TRƯỚC chuyên đề này) · kéo NHÓM ⇒ khung + nhãn "chuyển nhóm vào đây" — 2 việc nhìn khác hẳn nhau
                const vachChen = hover === k && dangKeo === 'o'
                const nhanNhom = hover === k && dangKeo === 'nhom'
                return (
                  <div key={x.chuyen_de_id} draggable onDragStart={(e) => batDauKeo(e, { loai: 'o', chuDeId: chuDe.id, chuyenDeId: x.chuyen_de_id })} onDragEnd={ketThucKeo}
                    {...vung(k, (kk) => (kk.loai === 'o' && kk.chuDeId === chuDe.id && kk.chuyenDeId !== x.chuyen_de_id) || (kk.loai === 'nhom' && kk.chuyenDeId !== x.chuyen_de_id), (kk) => {
                      if (kk.loai === 'o') return lam(() => sapXep('o', chenTruoc(chuDe.o.map((y) => y.chuyen_de_id), kk.chuyenDeId, x.chuyen_de_id).map((c) => oKey(chuDe.id, c))), 'Đã sắp lại chuyên đề')
                      if (kk.loai === 'nhom') return lam(() => chuyenNhom(kk.id, chuDe.id, x.chuyen_de_id, null), `Đã chuyển nhóm sang «${x.ten}»`)
                    })}
                    onClick={() => chonChuyenDe(x.chuyen_de_id)}
                    className={`group relative mb-0.5 flex w-full cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] transition ${
                      vachChen ? 'before:absolute before:-top-1 before:left-0 before:right-0 before:h-1 before:rounded before:bg-indigo-500' : ''} ${
                      nhanNhom ? 'ring-2 ring-emerald-500 ring-offset-1' : ''} ${
                      dangChonCD ? 'bg-sky-600 font-semibold text-white' : 'text-slate-700 hover:bg-sky-50'}`}>
                    <span className="mt-px w-5 shrink-0 text-right text-[11px] opacity-70">{x.so}</span>
                    <span className="flex-1 leading-snug">
                      <MathText>{x.ten}</MathText>
                      {nhanNhom && <span className="mt-0.5 block text-[10.5px] font-semibold text-emerald-700">⤵ thả: chuyển nhóm vào đây</span>}
                    </span>
                    {x.so_chu_de > 1 && <span title="Chuyên đề dùng chung nhiều chủ đề" className="mt-px shrink-0 text-[10px] opacity-70">⇆{x.so_chu_de}</span>}
                    {conChuaGan && <span title="Còn câu chưa gán dạng bài" className="mt-px shrink-0 text-[10px]">⚠</span>}
                    {/* ▲▼ đổi thứ tự — hiện khi rê chuột hoặc đang chọn; không cần kéo */}
                    <span className={`flex shrink-0 flex-col ${dangChonCD ? 'flex' : 'hidden group-hover:flex'}`}>
                      <button onClick={(e) => { e.stopPropagation(); doiThuTuCD(x.chuyen_de_id, -1) }} disabled={x.so <= 1} title="Lên trên (Alt+↑)"
                        className={`rounded px-1.5 text-[11px] leading-[13px] disabled:opacity-20 ${dangChonCD ? 'hover:bg-white/25' : 'hover:bg-slate-200'}`}>▲</button>
                      <button onClick={(e) => { e.stopPropagation(); doiThuTuCD(x.chuyen_de_id, 1) }} disabled={x.so >= chuDe.o.length} title="Xuống dưới (Alt+↓)"
                        className={`rounded px-1.5 text-[11px] leading-[13px] disabled:opacity-20 ${dangChonCD ? 'hover:bg-white/25' : 'hover:bg-slate-200'}`}>▼</button>
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-100 px-3 py-1.5 text-[10.5px] leading-relaxed text-slate-400">↑ ↓ chọn chuyên đề · ▲▼ hoặc Alt+↑ ↓ đổi thứ tự · thả box nhóm vào tên chuyên đề = chuyển nhóm</div>
          </div>
        )}

        {HIEN_KHOP_CU && nganCu && (
          <NganCu ds={dangCu} batDauKeo={batDauKeo} ketThucKeo={ketThucKeo}
            onGo={(id, ten) => void lam(() => goDoiUng(id), `Đã gỡ gắn «${ten}»`)} onDong={() => setNganCu(false)} />
        )}

        {!chuDe ? (
          <div className="flex flex-1 items-center justify-center text-[13px] text-slate-400">Khối {khoi} chưa có chủ đề nào — bấm «+ Chủ đề» để bắt đầu.</div>
        ) : !o ? (
          <div className="flex flex-1 items-center justify-center text-[13px] text-slate-400">Chủ đề chưa có chuyên đề — bấm «+ Chuyên đề» ở cột trái.</div>
        ) : (
          <SoDoChuyenDe key={`${chuDe.id}|${o.chuyen_de_id}`} cd={chuDe} o={o} chon={chon} hover={hover} dangKeo={dangKeo} sang={sang}
            batDauKeo={batDauKeo} ketThucKeo={ketThucKeo} vung={vung} onChon={setChon} onChonChuDe={chonChuDe} lam={lam}
            ganVao={ganVao} moGan={moGan} moLyThuyet={moLyThuyet} />
        )}

        {chon && chuDe && (chon.loai === 'chu_de' || o) && (
          <ChiTiet chon={chon} cay={cay} cd={chuDe} o={o ?? chuDe.o[0]} khoi={khoi} onDong={() => setChon(null)}
            lam={lam} moLyThuyet={moLyThuyet} onDaXoa={() => setChon(null)} moGan={moGan} />
        )}
      </div>

      {bao && <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-[13px] font-medium text-white shadow-lg">✓ {bao}</div>}

      {HIEN_KHOP_CU && ganMo && (
        <BangGanCau g={ganMo} onDong={() => setGanMo(null)} onDaGan={(n) => { thongBao(n); void napLai() }} />
      )}

      {lt && (
        <LyThuyetModal ma={lt.id} ten={`${lt.loai === 'db_vd' ? 'Ví dụ' : 'Lý thuyết'} — ${lt.ten}`} current={lt.current}
          api={lt.loai === 'nhom' ? lyThuyetNhomApi : lt.loai === 'db_lt' ? lyThuyetDangBaiApi : viDuDangBaiApi}
          onClose={() => setLt(null)}
          onSaved={() => { setLt(null); thongBao('Đã lưu'); void napLai() }} />
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Sơ đồ 1 chuyên đề: box chuyên đề ở trên, nhóm bài rẽ nhánh xuống, mũi tên = tiền đề
// ════════════════════════════════════════════════════════════════════════════
function SoDoChuyenDe(p: {
  cd: BdmChuDe; o: BdmO; chon: Chon | null; hover: string | null; dangKeo: Keo['loai'] | null; sang: (k: string) => string
  batDauKeo: (e: DragEvent, k: Keo) => void; ketThucKeo: () => void
  vung: (key: string, nhan: (k: Keo) => boolean, tha: (k: Keo) => Promise<void> | void) => VungProps
  onChon: (c: Chon) => void; onChonChuDe: (id: string) => void
  lam: (viec: () => Promise<unknown>, xong?: string) => Promise<void>
  ganVao: (dich: BdmDich, nhan: string) => (k: Keo) => Promise<void> | undefined
  moGan: (o: BdmO, n: BdmNhom | null) => void
  moLyThuyet: (loai: LoaiNoiDung, id: string, ten: string) => void
}) {
  const { cd, o, chon, sang, vung, lam } = p
  const khung = useRef<HTMLDivElement>(null)
  const goc = useRef<HTMLDivElement>(null)
  const hop = useRef(new Map<string, HTMLDivElement>())
  const [duong, setDuong] = useState<{ d: string; key: string }[]>([])
  const [co, setCo] = useState({ w: 0, h: 0 })
  const luoi = useMemo(() => xepLuoi(o.nhom), [o.nhom])
  const soCuaNhom = new Map(o.nhom.map((n) => [n.id, n.so]))

  // Vẽ mũi tên: đo vị trí box sau khi bố cục xong (chỉ hiển thị)
  useLayoutEffect(() => {
    const ve = () => {
      const k = khung.current
      if (!k) return
      const kr = k.getBoundingClientRect()
      const pos = (el: HTMLElement) => { const r = el.getBoundingClientRect(); return { x: r.left - kr.left + k.scrollLeft, y: r.top - kr.top + k.scrollTop, w: r.width, h: r.height } }
      const cong = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number }) => {
        const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y - 6
        const m = (y1 + y2) / 2
        return `M ${x1} ${y1} C ${x1} ${m}, ${x2} ${m}, ${x2} ${y2}`
      }
      const ds: { d: string; key: string }[] = []
      const g = goc.current
      for (const n of o.nhom) {
        const b = hop.current.get(n.id)
        if (!b) continue
        if (n.tien_de.length === 0 && g) ds.push({ key: `goc>${n.id}`, d: cong(pos(g), pos(b)) })
        for (const t of n.tien_de) { const a = hop.current.get(t); if (a) ds.push({ key: `${t}>${n.id}`, d: cong(pos(a), pos(b)) }) }
      }
      setDuong(ds)
      setCo({ w: k.scrollWidth, h: k.scrollHeight })
    }
    ve()
    const ro = new ResizeObserver(ve)
    if (khung.current) { ro.observe(khung.current); for (const el of khung.current.querySelectorAll('[data-hop]')) ro.observe(el) }
    return () => ro.disconnect()
  }, [o])

  const dangChon = (c: Chon) => !!chon && JSON.stringify(chon) === JSON.stringify(c)
  return (
    <div ref={khung} className="relative min-w-0 flex-1 overflow-auto bg-[#fafafb] p-8">
      <svg className="pointer-events-none absolute left-0 top-0" width={co.w} height={co.h}>
        <defs>
          <marker id="bdm-mui" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>
        {duong.map((x) => <path key={x.key} d={x.d} fill="none" stroke="#94a3b8" strokeWidth={1.6} markerEnd="url(#bdm-mui)" />)}
      </svg>

      <div className="relative flex min-w-max flex-col items-center gap-14">
        {/* Box CHUYÊN ĐỀ */}
        <div ref={goc} data-hop onClick={() => p.onChon({ loai: 'o' })}
          {...vung(`goc:${o.chuyen_de_id}`, (k) => k.loai === 'dang_cu', p.ganVao({ chuDe: cd.id, chuyenDe: o.chuyen_de_id }, `chuyên đề «${o.ten}»`))}
          className={`w-[360px] cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm ${sang(`goc:${o.chuyen_de_id}`)} ${dangChon({ loai: 'o' }) ? 'border-amber-400 ring-2 ring-amber-300' : 'border-sky-200 hover:border-sky-400'}`}>
          <div className="flex items-center gap-2 bg-sky-600 px-4 py-2 text-white">
            <span className="rounded bg-white/25 px-1.5 text-[11px] font-bold">{o.so}</span>
            <span className="flex-1 text-[14px] font-semibold"><MathText>{o.ten}</MathText></span>
            <span className="text-[11px] opacity-80">{o.nhom.length} nhóm</span>
          </div>
          {HIEN_KHOP_CU && o.chua_gan > 0 && (
            <button onClick={(e) => { e.stopPropagation(); p.moGan(o, null) }} title="Câu của dạng cũ gắn vào chuyên đề này mà chưa thuộc dạng bài nào — bấm để gán"
              className="flex w-full items-center gap-1.5 bg-rose-50 px-4 py-1.5 text-left text-[12px] font-semibold text-rose-700 hover:bg-rose-100">
              ⚠ {o.chua_gan} câu chưa gán dạng bài <span className="ml-auto font-normal">gán →</span>
            </button>
          )}
          {HIEN_KHOP_CU && o.dang_cu.length > 0 && <DangCuGan ds={o.dang_cu} />}
          {(o.mo_ta.trim() || o.cung_co_o.length > 0) && (
            <div className="space-y-1 px-4 py-2 text-[12px] text-slate-600">
              {o.mo_ta.trim() && <div className="line-clamp-2">{o.mo_ta}</div>}
              {o.cung_co_o.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-slate-400">Cũng có ở:</span>
                  {o.cung_co_o.map((c) => (
                    <span key={c.chu_de_id} className="rounded bg-sky-50 px-1.5 text-[11px] text-sky-800">K{c.khoi} · {c.ten}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lưới NHÓM BÀI: hàng = tầng (trên học trước), cột = nhánh */}
        {o.nhom.length > 0 && (
          <div className="grid gap-x-10 gap-y-14" style={{ gridTemplateColumns: `repeat(${luoi.soCot}, 280px)` }}>
            {o.nhom.map((n) => (
              <div key={n.id} style={{ gridRow: n.tang + 1, gridColumn: (luoi.cot.get(n.id) ?? 0) + 1 }}>
                <BoxNhom n={n} cd={cd} o={o} chon={dangChon({ loai: 'nhom', id: n.id })} chonDangBai={chon?.loai === 'dang_bai' ? chon.id : null}
                  dangKeo={p.dangKeo} sang={sang} soCuaNhom={soCuaNhom}
                  refHop={(el) => { if (el) hop.current.set(n.id, el); else hop.current.delete(n.id) }}
                  batDauKeo={p.batDauKeo} ketThucKeo={p.ketThucKeo} vung={vung} onChon={p.onChon} lam={lam}
                  ganVao={p.ganVao} moGan={() => p.moGan(o, n)} moLyThuyet={() => p.moLyThuyet('nhom', n.id, n.ten)} />
              </div>
            ))}
          </div>
        )}

        <ThemNhanh nhan="+ Nhóm bài (nhánh mới)" goiY="Tên nhóm bài…" rong onThem={(ten) => lam(() => themNhom(cd.id, o.chuyen_de_id, ten), 'Đã thêm nhóm bài')} />
      </div>
    </div>
  )
}

function BoxNhom(p: {
  n: BdmNhom; cd: BdmChuDe; o: BdmO; chon: boolean; chonDangBai: string | null; dangKeo: Keo['loai'] | null
  sang: (k: string) => string; soCuaNhom: Map<string, number>
  refHop: (el: HTMLDivElement | null) => void
  batDauKeo: (e: DragEvent, k: Keo) => void; ketThucKeo: () => void
  vung: (key: string, nhan: (k: Keo) => boolean, tha: (k: Keo) => Promise<void> | void) => VungProps
  onChon: (c: Chon) => void
  lam: (viec: () => Promise<unknown>, xong?: string) => Promise<void>
  ganVao: (dich: BdmDich, nhan: string) => (k: Keo) => Promise<void> | undefined
  moGan: () => void
  moLyThuyet: () => void
}) {
  const { n, cd, o, sang, vung, lam } = p
  const cungO = (k: Keo) => k.loai === 'nhom' && k.chuDeId === cd.id && k.chuyenDeId === o.chuyen_de_id && k.id !== n.id
  // Anh em = nhóm có CÙNG tập tiền đề (cùng rẽ ra từ 1 chỗ). Đổi thu_tu với anh em liền trước/sau ⇒ đổi trái/phải
  // và đổi số thứ tự. Nhóm nối thẳng (không có anh em) ⇒ thứ tự do mũi tên quyết định, nút khoá.
  const khoaTd = (x: BdmNhom) => [...x.tien_de].sort().join(',')
  const anhEm = o.nhom.filter((x) => khoaTd(x) === khoaTd(n)).sort((a, b) => a.so - b.so)
  const viTri = anhEm.findIndex((x) => x.id === n.id)
  const doiCho = (khac: BdmNhom | undefined, nhan: string) => {
    if (!khac) return
    const ids = [...o.nhom].sort((a, b) => a.thu_tu - b.thu_tu || a.id.localeCompare(b.id)).map((x) => x.id)
    const i = ids.indexOf(n.id), j = ids.indexOf(khac.id)
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    void lam(() => sapXep('nhom', ids), nhan)
  }
  const goiYKhoa = anhEm.length <= 1 ? 'Nhóm này không có nhóm cùng nhánh rẽ để đổi chỗ — thứ tự do mũi tên tiền đề quyết định' : ''
  return (
    <div ref={p.refHop} data-hop draggable onDragStart={(e) => p.batDauKeo(e, { loai: 'nhom', id: n.id, chuDeId: cd.id, chuyenDeId: o.chuyen_de_id })} onDragEnd={p.ketThucKeo}
      {...vung(`n:${n.id}`, (k) => cungO(k) || (k.loai === 'dang_bai' && k.nhomId !== n.id) || k.loai === 'dang_cu', (k) => {
        if (k.loai === 'dang_cu') return p.ganVao({ nhom: n.id }, `nhóm «${n.ten}»`)(k)
        if (k.loai === 'nhom') return lam(() => sapXep('nhom', chenTruoc(o.nhom.map((x) => x.id).sort((a, b) => (o.nhom.find((y) => y.id === a)!.thu_tu - o.nhom.find((y) => y.id === b)!.thu_tu)), k.id, n.id)), 'Đã đổi thứ tự (đặt bên trái)')
        if (k.loai === 'dang_bai') return lam(() => chuyenDangBai(k.id, n.id, null), 'Đã chuyển dạng bài')
      })}
      onClick={() => p.onChon({ loai: 'nhom', id: n.id })}
      className={`group/nhom cursor-grab overflow-hidden rounded-xl border bg-white shadow-sm active:cursor-grabbing ${sang(`n:${n.id}`)} ${p.chon ? 'border-amber-400 ring-2 ring-amber-300' : 'border-slate-200 hover:border-indigo-300'}`}>
      <div className="flex items-start gap-2 bg-slate-700 px-3 py-2 text-white">
        <span className="mt-px rounded bg-white/20 px-1.5 text-[11px] font-bold">{n.so}</span>
        <span className="flex-1 text-[13px] font-semibold leading-snug"><MathText>{n.ten}</MathText></span>
        <span className="hidden shrink-0 gap-0.5 group-hover/nhom:flex">
          <button onClick={(e) => { e.stopPropagation(); doiCho(anhEm[viTri - 1], 'Đã đưa lên trước') }} disabled={viTri <= 0}
            title={goiYKhoa || 'Đổi chỗ với nhóm cùng nhánh bên trái (học trước)'} className="rounded px-1 text-[11px] text-white/80 hover:bg-white/20 disabled:opacity-25">◀</button>
          <button onClick={(e) => { e.stopPropagation(); doiCho(anhEm[viTri + 1], 'Đã đưa ra sau') }} disabled={viTri < 0 || viTri >= anhEm.length - 1}
            title={goiYKhoa || 'Đổi chỗ với nhóm cùng nhánh bên phải (học sau)'} className="rounded px-1 text-[11px] text-white/80 hover:bg-white/20 disabled:opacity-25">▶</button>
        </span>
        <button onClick={(e) => { e.stopPropagation(); p.moLyThuyet() }} draggable={false}
          title={n.co_ly_thuyet ? 'Xem / sửa lý thuyết' : 'Gán lý thuyết cho nhóm này'}
          className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold ${n.co_ly_thuyet ? 'bg-sky-400/30 text-white hover:bg-sky-400/50' : 'bg-white/15 text-white/80 hover:bg-white/30'}`}>
          📖{n.co_ly_thuyet ? '' : ' +LT'}
        </button>
        <DauTienDo moTa={!!n.mo_ta.trim()} noiDung={n.co_ly_thuyet} nhanNoiDung="lý thuyết" />
      </div>
      <div className="flex flex-col gap-1.5 p-2.5">
        {n.tien_de.length > 0 && (
          <div className="text-[10.5px] text-slate-400">Học sau: {n.tien_de.map((t) => `#${p.soCuaNhom.get(t) ?? '?'}`).join(', ')}</div>
        )}
        {HIEN_KHOP_CU && n.chua_gan > 0 && (
          <button onClick={(e) => { e.stopPropagation(); p.moGan() }} title="Câu của dạng cũ gắn vào nhóm này mà chưa thuộc dạng bài nào — bấm để gán"
            className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-left text-[11.5px] font-semibold text-rose-700 hover:bg-rose-100">
            ⚠ {n.chua_gan} câu chưa gán dạng bài <span className="ml-auto font-normal">gán →</span>
          </button>
        )}
        {HIEN_KHOP_CU && n.dang_cu.length > 0 && <DangCuGan ds={n.dang_cu} gon />}
        {n.dang_bai.map((d) => (
          <CardDangBai key={d.id} n={n} d={d} chon={p.chonDangBai === d.id} sang={sang}
            batDauKeo={p.batDauKeo} ketThucKeo={p.ketThucKeo} vung={vung} onChon={p.onChon} lam={lam} ganVao={p.ganVao} />
        ))}
        <ThemNhanh nhan="+ dạng bài" goiY="Tên dạng bài…" onThem={(ten) => lam(() => themDangBai(n.id, ten), 'Đã thêm dạng bài')} />
      </div>
      {/* Vùng thả "học sau nhóm này" — chỉ hiện khi đang kéo 1 nhóm cùng chuyên đề */}
      {p.dangKeo === 'nhom' && (
        <div {...vung(`sau:${n.id}`, cungO, (k) => (k.loai === 'nhom' ? lam(() => themTienDe(k.id, n.id), 'Đã nối: học sau') : undefined))}
          className={`border-t border-dashed border-indigo-300 bg-indigo-50 px-3 py-2 text-center text-[11.5px] font-medium text-indigo-700 ${sang(`sau:${n.id}`)}`}>
          ⤓ Thả vào đây: học SAU nhóm này
        </div>
      )}
    </div>
  )
}

function CardDangBai(p: {
  n: BdmNhom; d: BdmDangBai; chon: boolean; sang: (k: string) => string
  batDauKeo: (e: DragEvent, k: Keo) => void; ketThucKeo: () => void
  vung: (key: string, nhan: (k: Keo) => boolean, tha: (k: Keo) => Promise<void> | void) => VungProps
  onChon: (c: Chon) => void
  lam: (viec: () => Promise<unknown>, xong?: string) => Promise<void>
  ganVao: (dich: BdmDich, nhan: string) => (k: Keo) => Promise<void> | undefined
}) {
  const { n, d, sang, vung, lam } = p
  return (
    <div draggable onDragStart={(e) => p.batDauKeo(e, { loai: 'dang_bai', id: d.id, nhomId: n.id })} onDragEnd={p.ketThucKeo}
      {...vung(`d:${d.id}`, (k) => (k.loai === 'dang_bai' && k.id !== d.id) || k.loai === 'dang_cu', (k) => {
        if (k.loai === 'dang_cu') return p.ganVao({ dangBai: d.id }, `dạng bài «${d.ten}»`)(k)
        if (k.loai !== 'dang_bai') return
        const ids = chenTruoc(n.dang_bai.map((x) => x.id), k.id, d.id)
        return lam(() => (k.nhomId === n.id ? sapXep('dang_bai', ids) : chuyenDangBai(k.id, n.id, ids)), k.nhomId === n.id ? 'Đã đổi thứ tự' : 'Đã chuyển dạng bài')
      })}
      onClick={(e) => { e.stopPropagation(); p.onChon({ loai: 'dang_bai', id: d.id }) }}
      className={`flex cursor-grab items-start gap-1.5 rounded-lg border px-2 py-1.5 text-[12px] active:cursor-grabbing ${sang(`d:${d.id}`)} ${
        p.chon ? 'border-amber-400 bg-amber-50' : 'border-violet-200 bg-violet-50 hover:border-violet-400'}`}>
      <span className="mt-px shrink-0 text-[10.5px] font-bold text-violet-500">{n.so}.{d.so}</span>
      <span className="flex-1 leading-snug text-violet-950">
        <MathText>{d.ten}</MathText>
        {HIEN_KHOP_CU && d.dang_cu.length > 0 && <span title={'Dạng cũ gắn thẳng vào đây (câu tự về): ' + d.dang_cu.map((x) => x.ten).join(' · ')} className="ml-1 text-[10px] text-amber-600">📦{d.dang_cu.length}</span>}
      </span>
      {HIEN_KHOP_CU && d.so_cau > 0 && <span title="Số câu đang thuộc dạng bài này" className="shrink-0 rounded bg-white px-1 text-[10.5px] text-violet-600">{d.so_cau} câu</span>}
      <DauTienDo moTa={!!d.mo_ta.trim()} noiDung={d.co_ly_thuyet} nhanNoiDung="lý thuyết" noiDung2={d.co_vi_du} nhanNoiDung2="ví dụ" />
    </div>
  )
}

// Chấm tiến độ: mô tả · lý thuyết/ví dụ — xám = chưa có
function DauTienDo({ moTa, noiDung, nhanNoiDung, noiDung2, nhanNoiDung2 }: { moTa: boolean; noiDung: boolean; nhanNoiDung: string; noiDung2?: boolean; nhanNoiDung2?: string }) {
  return (
    <span className="flex shrink-0 gap-0.5 pt-1">
      <span title={moTa ? 'Đã có mô tả' : 'Chưa có mô tả'} className={`h-2 w-2 rounded-full ${moTa ? 'bg-emerald-400' : 'bg-slate-300'}`} />
      <span title={noiDung ? `Đã có ${nhanNoiDung}` : `Chưa có ${nhanNoiDung}`} className={`h-2 w-2 rounded-full ${noiDung ? 'bg-sky-400' : 'bg-slate-300'}`} />
      {nhanNoiDung2 && <span title={noiDung2 ? `Đã có ${nhanNoiDung2}` : `Chưa có ${nhanNoiDung2}`} className={`h-2 w-2 rounded-full ${noiDung2 ? 'bg-violet-400' : 'bg-slate-300'}`} />}
    </span>
  )
}

function ThemNhanh({ nhan, goiY, onThem, rong }: { nhan: string; goiY: string; onThem: (ten: string) => void; rong?: boolean }) {
  const [mo, setMo] = useState(false)
  const [ten, setTen] = useState('')
  const xong = () => { if (ten.trim()) onThem(ten.trim()); setTen(''); setMo(false) }
  if (!mo) return (
    <button onClick={(e) => { e.stopPropagation(); setMo(true) }}
      className={`shrink-0 self-start rounded-md px-2 py-1 text-left text-[12px] font-medium text-slate-400 hover:bg-slate-100 hover:text-indigo-600 ${rong ? 'self-center border border-dashed border-slate-300' : ''}`}>{nhan}</button>
  )
  return (
    <input autoFocus value={ten} placeholder={goiY} onClick={(e) => e.stopPropagation()}
      onChange={(e) => setTen(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') xong(); if (e.key === 'Escape') { setTen(''); setMo(false) } }}
      onBlur={xong} className={`${inp} ${rong ? 'w-64 shrink-0 self-center' : 'py-1 text-[12px]'}`} />
  )
}

// Thêm chuyên đề vào chủ đề: chọn chuyên đề DÙNG CHUNG có sẵn, hoặc tạo mới
function ThemChuyenDe({ cay, cd, onThem }: { cay: BdmCay; cd: BdmChuDe; onThem: (a: { chuyenDeId?: string; tenMoi?: string }) => void }) {
  const [mo, setMo] = useState(false)
  const [q, setQ] = useState('')
  const daCo = new Set(cd.o.map((x) => x.chuyen_de_id))
  const goiY = cay.chuyen_de.filter((c) => !daCo.has(c.id) && (!q.trim() || boDau(c.ten).includes(boDau(q.trim())))).slice(0, 12)
  const trungTen = cay.chuyen_de.some((c) => boDau(c.ten) === boDau(q.trim()))
  const dong = () => { setMo(false); setQ('') }
  return (
    <div className="relative shrink-0">
      <button onClick={() => setMo(!mo)} className="rounded-md border border-dashed border-slate-300 px-2.5 py-1 text-[12.5px] font-medium text-slate-500 hover:border-sky-400 hover:text-sky-700">+ Chuyên đề</button>
      {mo && (
        <div className="absolute left-0 top-full z-30 mt-1 w-80 rounded-lg border border-sky-300 bg-white p-2 shadow-lg">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm chuyên đề có sẵn hoặc gõ tên mới…"
            onKeyDown={(e) => { if (e.key === 'Escape') dong() }} className={inp} />
          <div className="mt-1.5 max-h-64 overflow-y-auto">
            {goiY.map((c) => (
              <button key={c.id} onClick={() => { onThem({ chuyenDeId: c.id }); dong() }}
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-[12.5px] hover:bg-sky-50">
                <span className="flex-1"><MathText>{c.ten}</MathText></span>
                <span className="text-[10.5px] text-slate-400">{c.so_chu_de ? `ở ${c.so_chu_de} chủ đề · K${c.khoi.join(',')}` : 'chưa dùng'}</span>
              </button>
            ))}
            {q.trim() && !trungTen && (
              <button onClick={() => { onThem({ tenMoi: q.trim() }); dong() }}
                className="flex w-full items-center gap-1 rounded px-2 py-1 text-left text-[12.5px] font-semibold text-sky-700 hover:bg-sky-50">＋ Tạo chuyên đề mới «{q.trim()}»</button>
            )}
            {!goiY.length && !q.trim() && <div className="px-2 py-1 text-[12px] text-slate-400">Chưa có chuyên đề nào — gõ tên để tạo mới.</div>}
          </div>
          <button onClick={dong} className="mt-1 text-[11.5px] text-slate-400 hover:text-slate-600">Đóng</button>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Khung chi tiết (phải): tên · mô tả · lý thuyết/ví dụ · tiền đề · chuyển · nâng/hạ · gỡ/xoá
// ════════════════════════════════════════════════════════════════════════════
function ChiTiet(p: {
  chon: Chon; cay: BdmCay; cd: BdmChuDe; o: BdmO | null | undefined; khoi: string; onDong: () => void
  lam: (viec: () => Promise<unknown>, xong?: string) => Promise<void>
  moLyThuyet: (loai: LoaiNoiDung, id: string, ten: string) => void
  onDaXoa: () => void
  moGan: (o: BdmO, n: BdmNhom | null) => void
}) {
  const { chon, cay, cd, o, lam } = p
  const goCu = (dich: BdmDich) => (ma: string, ten: string) => void lam(() => goDoiUngTheoDich(ma, dich), `Đã gỡ gắn «${ten}»`)
  // Nhóm bài / dạng bài: POPUP GIỮA MÀN (CEO 08/10). Chủ đề / chuyên đề: khung phải như cũ.
  const giuaMan = chon.loai === 'nhom' || chon.loai === 'dang_bai'
  const khung = (tieuDe: string, mau: string, noiDung: ReactNode) => giuaMan ? (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-6" onClick={p.onDong}>
      <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className={`flex items-center gap-2 px-5 py-3 text-white ${mau}`}>
          <span className="flex-1 text-[14px] font-semibold">{tieuDe}</span>
          <span className="text-[11px] text-white/60">Esc để đóng</span>
          <button onClick={p.onDong} className="text-white/70 hover:text-white">✕</button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">{noiDung}</div>
      </div>
    </div>
  ) : (
    <div className="flex w-[380px] shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className={`flex items-center gap-2 px-4 py-2.5 text-white ${mau}`}>
        <span className="flex-1 text-[13px] font-semibold">{tieuDe}</span>
        <button onClick={p.onDong} className="text-white/70 hover:text-white">✕</button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">{noiDung}</div>
    </div>
  )
  // Mọi ô (chủ đề › chuyên đề) trong khối — đích để chuyển
  const moiO = cay.chu_de.flatMap((c) => c.o.map((x) => ({ cd: c, o: x })))

  if (chon.loai === 'chu_de') {
    return khung('Chủ đề', 'bg-indigo-600', <>
      <TruongTen key={cd.id} gt={cd.ten} onLuu={(t) => lam(() => suaChuDe(cd.id, t))} />
      <div className="text-[12px] text-slate-500">Khối <b>{p.khoi}</b> · {cd.o.length} chuyên đề · mã nháp <code>{cd.id}</code></div>
      <ThuTuChuDe cay={cay} cd={cd} lam={lam} />
      {(() => {
        const soNhom = cd.o.reduce((t, x) => t + x.nhom.length, 0) // đếm thứ đang hiển thị — chỉ để hỏi xác nhận
        const soDb = cd.o.reduce((t, x) => t + x.nhom.reduce((u, n) => u + n.dang_bai.length, 0), 0)
        return (
          <NutXoa nhan="Xoá chủ đề (kèm mọi thứ bên trong)" moTa={`Xoá luôn ${cd.o.length} chuyên đề · ${soNhom} nhóm · ${soDb} dạng bài bên trong (lý thuyết, ví dụ, mô tả, mũi tên mất theo). Chuyên đề nào đang dùng chung ở chủ đề khác thì vẫn giữ ở đó.`}
            onXoa={() => { if (window.confirm(`Xoá chủ đề «${cd.ten}» cùng ${cd.o.length} chuyên đề, ${soNhom} nhóm, ${soDb} dạng bài bên trong?\n\nKhông hoàn tác được.`)) void lam(() => xoaChuDeTronGoi(cd.id), `Đã xoá chủ đề «${cd.ten}»`).then(p.onDaXoa) }} />
        )
      })()}
    </>)
  }

  if (!o) return null
  if (chon.loai === 'o') {
    return khung('Chuyên đề (dùng chung)', 'bg-sky-600', <>
      <TruongTen key={o.chuyen_de_id} gt={o.ten} onLuu={(t2) => lam(() => suaChuyenDe(o.chuyen_de_id, { ten: t2 }))} />
      {o.so_chu_de > 1 && <div className="rounded-md bg-sky-50 px-2.5 py-1.5 text-[12px] text-sky-800">Chuyên đề này có mặt ở <b>{o.so_chu_de} chủ đề</b> — đổi tên/mô tả áp cho tất cả.</div>}
      <TruongMoTa key={`mt-${o.chuyen_de_id}`} gt={o.mo_ta} goiY="Mô tả chuyên đề (tuỳ chọn)…" onLuu={(m) => lam(() => suaChuyenDe(o.chuyen_de_id, { mo_ta: m }))} />
      <div className="text-[12px] text-slate-500">Trong chủ đề <b><MathText>{cd.ten}</MathText></b>: thứ {o.so} · {o.nhom.length} nhóm bài · mã nháp <code>{o.chuyen_de_id}</code></div>
      {HIEN_KHOP_CU && <DangCuChiTiet ds={o.dang_cu} chuaGan={o.chua_gan} truongHop="③ câu phải gán vào 1 dạng bài thuộc chuyên đề này"
        onGo={goCu({ chuDe: cd.id, chuyenDe: o.chuyen_de_id })} onGan={() => p.moGan(o, null)} />}
      <ChonDich nhan="⇄ Chuyển sang chủ đề khác" moTa="Chuyển cả chuyên đề cùng các nhóm bài. Chủ đề đích đã có chuyên đề này thì dồn vào."
        lua={cay.chu_de.filter((c) => c.id !== cd.id).map((c) => ({ id: c.id, nhan: c.ten }))}
        onChon={(id) => void lam(() => chuyenO(cd.id, o.chuyen_de_id, id), 'Đã chuyển chuyên đề').then(p.onDaXoa)} />
      <ChonDich nhan="⧉ Gộp vào chuyên đề khác (dùng chung)" moTa="Chuyên đề này biến mất; mọi chủ đề đang dùng nó chuyển sang chuyên đề đích (chủ đề đã có đích thì dồn nhóm vào). Nhóm, mũi tên, dạng cũ gắn vào đi theo."
        lua={cay.chuyen_de.filter((x) => x.id !== o.chuyen_de_id).map((x) => ({ id: x.id, nhan: `${x.ten}${x.so_chu_de ? ` · ở ${x.so_chu_de} chủ đề · K${x.khoi.join(',')}` : ''}` }))}
        onChon={(id) => { const ten = cay.chuyen_de.find((x) => x.id === id)?.ten ?? id; if (window.confirm(`Gộp «${o.ten}» vào «${ten}»? «${o.ten}» sẽ biến mất.`)) void lam(() => gopChuyenDe(o.chuyen_de_id, id), `Đã gộp vào «${ten}»`).then(p.onDaXoa) }} />
      {(() => {
        const soDb = o.nhom.reduce((t, n) => t + n.dang_bai.length, 0) // đếm thứ đang hiển thị — chỉ để hỏi xác nhận
        const conNoiKhac = o.so_chu_de > 1
        return (
          <NutXoa nhan={conNoiKhac ? 'Gỡ khỏi chủ đề này (kèm nhóm bên trong)' : 'Xoá chuyên đề (kèm nhóm bên trong)'}
            moTa={`Xoá luôn ${o.nhom.length} nhóm · ${soDb} dạng bài của chuyên đề này trong chủ đề «${cd.ten}».${conNoiKhac ? ` Chuyên đề vẫn còn ở ${o.so_chu_de - 1} chủ đề khác.` : ''}`}
            onXoa={() => { if (window.confirm(`${conNoiKhac ? 'Gỡ' : 'Xoá'} chuyên đề «${o.ten}» khỏi chủ đề «${cd.ten}» cùng ${o.nhom.length} nhóm, ${soDb} dạng bài bên trong?\n\nKhông hoàn tác được.`)) void lam(() => xoaChuyenDeKhoiChuDe(cd.id, o.chuyen_de_id), conNoiKhac ? 'Đã gỡ khỏi chủ đề' : 'Đã xoá chuyên đề').then(p.onDaXoa) }} />
        )
      })()}
    </>)
  }

  if (chon.loai === 'nhom') {
    const n = o.nhom.find((x) => x.id === chon.id)
    if (!n) return null
    const ten = (id: string) => { const x = o.nhom.find((y) => y.id === id); return x ? `#${x.so} ${x.ten}` : id }
    const coTheNoi = o.nhom.filter((x) => x.id !== n.id && !n.tien_de.includes(x.id))
    return khung('Nhóm bài (tầng 3)', 'bg-slate-700', <>
      <TruongTen key={n.id} gt={n.ten} onLuu={(t2) => lam(() => suaNhom(n.id, { ten: t2 }))} />
      <div className="text-[12px] text-slate-500"><MathText>{cd.ten}</MathText> › <MathText>{o.ten}</MathText> · thứ <b>{n.so}</b> · mã nháp <code>{n.id}</code></div>
      <TruongMoTa key={`mt-${n.id}`} gt={n.mo_ta} goiY="Dấu hiệu nhận biết: bài thuộc nhóm này trông thế nào, dùng kiến thức/phương pháp gì…"
        nhan="Mô tả nhận biết" chuThich="Claude dựa vào mô tả này để khớp câu cũ vào bản đồ mới." onLuu={(m) => lam(() => suaNhom(n.id, { mo_ta: m }))} />
      <button onClick={() => p.moLyThuyet('nhom', n.id, n.ten)}
        className="flex items-center justify-between rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-[13px] font-semibold text-indigo-700 hover:bg-indigo-100">
        <span>📖 Lý thuyết</span><span className="text-[11.5px] font-normal">{n.co_ly_thuyet ? 'đã có — bấm để sửa' : 'chưa có — bấm để dán'}</span>
      </button>

      {HIEN_KHOP_CU && <DangCuChiTiet ds={n.dang_cu} chuaGan={n.chua_gan} truongHop="② câu phải gán vào 1 dạng bài của nhóm này"
        onGo={goCu({ nhom: n.id })} onGan={() => p.moGan(o, n)} />}
      <div className="rounded-md border border-slate-200 p-2.5">
        <div className="text-[12.5px] font-medium text-slate-700">↧ Học sau (tiền đề)</div>
        {n.tien_de.length === 0 && <div className="mt-1 text-[11.5px] text-slate-400">Không có — nhóm này nối thẳng từ chuyên đề (đầu nhánh).</div>}
        {n.tien_de.map((t) => (
          <div key={t} className="mt-1 flex items-center gap-2 text-[12.5px]">
            <span className="flex-1"><MathText>{ten(t)}</MathText></span>
            <button onClick={() => void lam(() => goTienDe(n.id, t), 'Đã gỡ mũi tên')} className="text-[11.5px] text-rose-500 hover:text-rose-700">gỡ</button>
          </div>
        ))}
        {coTheNoi.length > 0 && (
          <ChonDich nhan="" moTa="" goiY="+ thêm: học sau nhóm…" lua={coTheNoi.map((x) => ({ id: x.id, nhan: `#${x.so} ${x.ten}` }))}
            onChon={(id) => void lam(() => themTienDe(n.id, id), 'Đã nối: học sau')} gon />
        )}
        <div className="mt-1.5 text-[11px] text-slate-400">Hoặc kéo box này thả vào dải «học SAU nhóm này» dưới đáy box khác. Kéo box thả lên box khác = đặt sang bên trái.</div>
      </div>

      <ChonDich nhan="⇄ Chuyển sang chuyên đề khác" moTa="Phải gỡ hết mũi tên trước. Hoặc kéo box thả lên nút chuyên đề ở thanh trên."
        lua={moiO.filter((x) => !(x.cd.id === cd.id && x.o.chuyen_de_id === o.chuyen_de_id)).map((x) => ({ id: oKey(x.cd.id, x.o.chuyen_de_id), nhan: `${x.cd.ten} › ${x.o.ten}` }))}
        onChon={(k) => { const [c, ch] = k.split('|'); void lam(() => chuyenNhom(n.id, c, ch, null), 'Đã chuyển nhóm bài').then(p.onDaXoa) }} />
      <HaNhom cay={cay} n={n} onHa={(dich) => void lam(() => haNhom(n.id, dich), 'Đã hạ thành dạng bài').then(p.onDaXoa)} />
      <NutXoa nhan="Xoá nhóm bài (kèm dạng bài bên trong)" moTa={`Xoá luôn ${n.dang_bai.length} dạng bài bên trong. Lý thuyết, ví dụ, mô tả, mũi tên mất theo.`}
        onXoa={() => { if (window.confirm(`Xoá nhóm bài «${n.ten}»${n.dang_bai.length ? ` cùng ${n.dang_bai.length} dạng bài bên trong` : ''}?\n\nKhông hoàn tác được.`)) void lam(() => xoaNhomTronGoi(n.id), 'Đã xoá nhóm bài').then(p.onDaXoa) }} />
    </>)
  }

  const n = o.nhom.find((x) => x.dang_bai.some((d) => d.id === chon.id))
  const d = n?.dang_bai.find((x) => x.id === chon.id)
  if (!n || !d) return null
  return khung('Dạng bài (tầng 4)', 'bg-violet-600', <>
    <TruongTen key={d.id} gt={d.ten} onLuu={(t2) => lam(() => suaDangBai(d.id, { ten: t2 }))} />
    <div className="text-[12px] text-slate-500"><MathText>{o.ten}</MathText> › <MathText>{n.ten}</MathText> · thứ <b>{n.so}.{d.so}</b> · mã nháp <code>{d.id}</code></div>
    <TruongMoTa key={`mt-${d.id}`} gt={d.mo_ta} goiY="Khuôn đề của dạng bài này: đề cho gì, hỏi gì, khác các dạng bài cùng nhóm ở đâu…"
      nhan="Mô tả nhận biết" chuThich="Claude dựa vào mô tả này để khớp câu cũ vào đúng dạng bài." onLuu={(m) => lam(() => suaDangBai(d.id, { mo_ta: m }))} />
    <div className="grid grid-cols-2 gap-2">
      <button onClick={() => p.moLyThuyet('db_lt', d.id, d.ten)}
        className="flex flex-col items-start rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-[13px] font-semibold text-indigo-700 hover:bg-indigo-100">
        <span>📖 Lý thuyết</span><span className="text-[11.5px] font-normal">{d.co_ly_thuyet ? 'đã có — bấm để sửa' : 'chưa có — bấm để dán'}</span>
      </button>
      <button onClick={() => p.moLyThuyet('db_vd', d.id, d.ten)}
        className="flex flex-col items-start rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-[13px] font-semibold text-violet-700 hover:bg-violet-100">
        <span>📝 Ví dụ</span><span className="text-[11.5px] font-normal">{d.co_vi_du ? 'đã có — bấm để sửa' : 'chưa có — bấm để dán'}</span>
      </button>
    </div>
    {HIEN_KHOP_CU && <div className="text-[12px] text-slate-500">Đang có <b>{d.so_cau}</b> câu (kể cả bản sao).</div>}
    {HIEN_KHOP_CU && <DangCuChiTiet ds={d.dang_cu} chuaGan={0} truongHop="① mọi câu tự về dạng bài này (nếu dạng cũ chỉ gắn đúng chỗ này)"
      onGo={goCu({ dangBai: d.id })} />}
    <ChonDich nhan="⇄ Chuyển sang nhóm khác" moTa="Hoặc kéo card thả vào box nhóm khác (cùng chuyên đề)."
      lua={moiO.flatMap((x) => x.o.nhom.filter((y) => y.id !== n.id).map((y) => ({ id: y.id, nhan: `${x.cd.ten} › ${x.o.ten} › #${y.so} ${y.ten}` })))}
      onChon={(id) => void lam(() => chuyenDangBai(d.id, id, null), 'Đã chuyển dạng bài').then(p.onDaXoa)} />
    <button onClick={() => { if (window.confirm(`Nâng «${d.ten}» thành nhóm bài (cùng chuyên đề «${o.ten}», thành nhánh mới)? Lý thuyết + ví dụ gộp thành lý thuyết của nhóm mới.`)) void lam(() => nangDangBai(d.id, cd.id, o.chuyen_de_id), 'Đã nâng thành nhóm bài').then(p.onDaXoa) }}
      className="rounded-md border border-slate-200 px-3 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-700">
      ⬆ Nâng thành nhóm bài <span className="font-normal text-slate-400">(nhánh mới trong cùng chuyên đề)</span>
    </button>
    <NutXoa nhan="Xoá dạng bài" moTa="Lý thuyết, ví dụ và mô tả mất theo."
      onXoa={() => { if (window.confirm(`Xoá dạng bài «${d.ten}»?`)) void lam(() => xoaDangBai(d.id), 'Đã xoá').then(p.onDaXoa) }} />
  </>)
}

function TruongTen({ gt, onLuu }: { gt: string; onLuu: (t: string) => void }) {
  const [v, setV] = useState(gt)
  const luu = () => { if (v.trim() && v.trim() !== gt) onLuu(v.trim()); else setV(gt) }
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">Tên</span>
      <input value={v} onChange={(e) => setV(e.target.value)} onBlur={luu} onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }} className={inp} />
    </label>
  )
}

function TruongMoTa({ gt, goiY, onLuu, nhan = 'Mô tả', chuThich }: { gt: string; goiY: string; onLuu: (m: string) => void; nhan?: string; chuThich?: string }) {
  const [v, setV] = useState(gt)
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">{nhan}</span>
      <textarea value={v} onChange={(e) => setV(e.target.value)} onBlur={() => { if (v.trim() !== gt.trim()) onLuu(v.trim()) }}
        rows={6} placeholder={goiY} className={`${inp} resize-y leading-relaxed`} />
      {chuThich && <span className="text-[11px] text-slate-400">{chuThich} Lưu khi rời ô.</span>}
    </label>
  )
}

// Chọn 1 đích trong danh sách rồi bấm — dùng cho chuyển / nối tiền đề
function ChonDich({ nhan, moTa, lua, onChon, goiY = '— chọn —', gon }: { nhan: string; moTa: string; lua: { id: string; nhan: string }[]; onChon: (id: string) => void; goiY?: string; gon?: boolean }) {
  const [v, setV] = useState('')
  if (!lua.length && !gon) return null
  const nut = (
    <div className="mt-1.5 flex gap-1.5">
      <select value={v} onChange={(e) => setV(e.target.value)} className={`${inp} text-[12.5px]`}>
        <option value="">{goiY}</option>
        {lua.map((x) => <option key={x.id} value={x.id}>{x.nhan}</option>)}
      </select>
      <button disabled={!v} onClick={() => { onChon(v); setV('') }} className="shrink-0 rounded-md bg-slate-700 px-3 text-[12.5px] font-semibold text-white disabled:opacity-40">OK</button>
    </div>
  )
  if (gon) return nut
  return (
    <div className="rounded-md border border-slate-200 p-2.5">
      <div className="text-[12.5px] font-medium text-slate-700">{nhan}</div>
      {moTa && <div className="text-[11px] text-slate-400">{moTa}</div>}
      {nut}
    </div>
  )
}

function HaNhom({ cay, n, onHa }: { cay: BdmCay; n: BdmNhom; onHa: (dich: string) => void }) {
  const lua = cay.chu_de.flatMap((cd) => cd.o.flatMap((x) => x.nhom.filter((y) => y.id !== n.id).map((y) => ({ id: y.id, nhan: `${cd.ten} › ${x.ten} › #${y.so} ${y.ten}` }))))
  if (n.dang_bai.length > 0 || n.tien_de.length > 0) return (
    <div className="rounded-md border border-slate-200 p-2.5">
      <div className="text-[12.5px] font-medium text-slate-700">⬇ Hạ thành dạng bài của nhóm khác</div>
      <div className="mt-1 text-[11.5px] text-slate-400">
        {n.dang_bai.length > 0 ? `Nhóm còn ${n.dang_bai.length} dạng bài — chuyển các dạng bài đi trước. ` : ''}
        {n.tien_de.length > 0 ? 'Nhóm còn mũi tên tiền đề — gỡ trước.' : ''}
      </div>
    </div>
  )
  return <ChonDich nhan="⬇ Hạ thành dạng bài của nhóm khác" moTa="Lý thuyết của nhóm sẽ thành lý thuyết của dạng bài. (Nhóm khác đang trỏ mũi tên vào nhóm này thì DB chặn — gỡ trước.)"
    lua={lua} onChon={(id) => { if (window.confirm(`Hạ «${n.ten}» thành dạng bài?`)) onHa(id) }} />
}

function NutXoa({ nhan, moTa, onXoa }: { nhan: string; moTa: string; onXoa: () => void }) {
  return (
    <div className="mt-2 border-t border-slate-100 pt-3">
      <button onClick={onXoa} className="text-[12.5px] font-semibold text-rose-600 hover:text-rose-700">🗑 {nhan}</button>
      <div className="text-[11px] text-slate-400">{moTa}</div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Khớp bản đồ cũ: ngăn dạng cũ · nhãn dạng cũ trên box · bảng gán câu
// ════════════════════════════════════════════════════════════════════════════

// Nhãn nhỏ trên box: các dạng cũ đang gắn vào đây
function DangCuGan({ ds, gon }: { ds: BdmDangCuRef[]; gon?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-1 ${gon ? '' : 'border-b border-slate-100 px-4 py-1.5'}`} title="Dạng cũ (bản đồ đang chạy) đã gắn vào đây">
      {ds.map((x) => <span key={x.ma} className="max-w-full truncate rounded bg-amber-50 px-1.5 text-[10.5px] text-amber-800">📦 {x.ten}</span>)}
    </div>
  )
}

function DangCuChiTiet({ ds, chuaGan, truongHop, onGo, onGan }: {
  ds: BdmDangCuRef[]; chuaGan: number; truongHop: string; onGo: (ma: string, ten: string) => void; onGan?: () => void
}) {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50/40 p-2.5">
      <div className="text-[12.5px] font-medium text-slate-700">📦 Dạng cũ gắn vào đây</div>
      <div className="text-[11px] text-slate-400">Trường hợp {truongHop}. Kéo dạng cũ từ ngăn «Bản đồ cũ» thả vào box để gắn thêm.</div>
      {ds.length === 0 && <div className="mt-1 text-[11.5px] text-slate-400">Chưa có.</div>}
      {ds.map((x) => (
        <div key={x.ma} className="mt-1 flex items-center gap-2 text-[12.5px]">
          <span className="flex-1"><MathText>{x.ten}</MathText> <span className="text-[10.5px] text-slate-400">{x.ma}</span></span>
          <button onClick={() => onGo(x.ma, x.ten)} className="text-[11.5px] text-rose-500 hover:text-rose-700">gỡ</button>
        </div>
      ))}
      {onGan && chuaGan > 0 && (
        <button onClick={onGan} className="mt-2 w-full rounded-md bg-rose-600 py-1.5 text-[12.5px] font-semibold text-white hover:bg-rose-700">⚠ Gán {chuaGan} câu chưa có dạng bài →</button>
      )}
    </div>
  )
}

// Ngăn trái: dạng cũ của khối — kéo thả vào dạng bài (①) / nhóm (②) / chuyên đề (③)
function NganCu({ ds, batDauKeo, ketThucKeo, onGo, onDong }: {
  ds: BdmDangCu[] | null
  batDauKeo: (e: DragEvent, k: Keo) => void; ketThucKeo: () => void
  onGo: (id: number, ten: string) => void; onDong: () => void
}) {
  const [chiChuaGan, setChiChuaGan] = useState(true)
  const [q, setQ] = useState('')
  const loc = (ds ?? []).filter((x) => (!chiChuaGan || x.dich.length === 0) && (!q.trim() || boDau(x.ten).includes(boDau(q.trim()))))
  // nhóm theo chủ đề › chuyên đề cũ (chỉ để hiển thị)
  const nhom: { khoa: string; ds: BdmDangCu[] }[] = []
  for (const x of loc) {
    const k = `${x.chu_de} › ${x.chuyen_de}`
    const cuoi = nhom[nhom.length - 1]
    if (cuoi && cuoi.khoa === k) cuoi.ds.push(x); else nhom.push({ khoa: k, ds: [x] })
  }
  return (
    <div className="flex w-[300px] shrink-0 flex-col border-r border-amber-200 bg-amber-50/40">
      <div className="flex items-center gap-2 border-b border-amber-200 px-3 py-2">
        <span className="flex-1 text-[13px] font-semibold text-amber-900">📦 Bản đồ cũ</span>
        <button onClick={onDong} className="text-amber-600 hover:text-amber-900">✕</button>
      </div>
      <div className="space-y-1.5 border-b border-amber-200 px-3 py-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm dạng cũ…" className={`${inp} py-1 text-[12.5px]`} />
        <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
          <input type="checkbox" checked={chiChuaGan} onChange={(e) => setChiChuaGan(e.target.checked)} /> Chỉ hiện dạng cũ chưa gắn
        </label>
        <div className="text-[11px] text-slate-400">Kéo thả vào: card dạng bài ① · box nhóm ② · box chuyên đề ③</div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {!ds && <div className="p-2 text-[12px] text-slate-400">Đang tải…</div>}
        {ds && !loc.length && <div className="p-2 text-[12px] text-emerald-600">{chiChuaGan ? '✓ Mọi dạng cũ của khối đã gắn.' : 'Không có.'}</div>}
        {nhom.map((g) => (
          <div key={g.khoa} className="mb-2">
            <div className="px-1 pb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400"><MathText>{g.khoa}</MathText></div>
            {g.ds.map((x) => (
              <div key={x.ma} draggable onDragStart={(e) => batDauKeo(e, { loai: 'dang_cu', ma: x.ma, ten: x.ten })} onDragEnd={ketThucKeo}
                className={`mb-1 cursor-grab rounded-md border bg-white px-2 py-1.5 active:cursor-grabbing ${x.dich.length ? 'border-slate-200' : 'border-rose-300'}`}>
                <div className="text-[12px] font-medium leading-snug text-slate-800"><MathText>{x.ten}</MathText></div>
                <div className="mt-0.5 flex flex-wrap gap-x-2 text-[10.5px] text-slate-400">
                  <span>{x.ma}</span><span>{x.so_cau} câu</span>{x.so_cum > 0 && <span>{x.so_cum} cụm</span>}
                  {x.dich.length > 0 && x.chua_gan > 0 && <span className="text-rose-600">{x.chua_gan} chưa gán</span>}
                </div>
                {x.dich.map((d) => (
                  <div key={d.id} className="mt-0.5 flex items-center gap-1 text-[10.5px] text-emerald-700">
                    <span className="flex-1 truncate">→ {d.nhan}</span>
                    <button onClick={() => onGo(d.id, x.ten)} className="text-rose-400 hover:text-rose-600">gỡ</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Bảng gán câu chưa có dạng bài (② ③): gán cả CỤM CŨ hoặc tích chọn từng CÂU GỐC — bản sao đi theo gốc.
// Sau khi gán: vá danh sách TẠI CHỖ (bỏ câu/cụm vừa gán), không tải lại cả bảng (CLAUDE §2 React).
// Tổng "còn N câu" sau khi gán lấy lại từ DB (không tự trừ ở client — §2.0).
function BangGanCau({ g, onDong, onDaGan }: { g: GanMo; onDong: () => void; onDaGan: (thongBao: string) => void }) {
  const [du, setDu] = useState<BdmCauChuaGan | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [chon, setChon] = useState<Set<string>>(new Set())
  const [dich, setDich] = useState('')
  const [dichCum, setDichCum] = useState<Record<string, string>>({})
  const [ban, setBan] = useState(false)
  const TRANG = 200
  useEffect(() => {
    let song = true
    getCauChuaGan(g.dich, TRANG, 0).then((d) => { if (song) setDu(d) }).catch((e) => { if (song) setLoi(String(e.message ?? e)) })
    return () => { song = false }
  }, [g])
  const taiThem = async () => {
    if (!du) return
    try { const d = await getCauChuaGan(g.dich, TRANG, du.cau.length); setDu({ ...du, cau: [...du.cau, ...d.cau] }) }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)) }
  }
  // Ghi → vá danh sách tại chỗ → lấy lại 2 con số tổng từ DB (nền)
  async function gan(viec: () => Promise<void>, bo: (d: BdmCauChuaGan) => BdmCauChuaGan, tb: string) {
    setBan(true); setLoi(null)
    try {
      await viec()
      setDu((d) => (d ? bo(d) : d)); setChon(new Set()); onDaGan(tb)
      const moi = await getCauChuaGan(g.dich, 1, 0)
      setDu((d) => (d ? { ...d, tong_cau: moi.tong_cau, tong_goc: moi.tong_goc } : d))
    }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)) }
    finally { setBan(false) }
  }
  const tenDb = (id: string) => g.lua.find((x) => x.id === id)?.nhan ?? id
  const ganChon = () => {
    const ids = [...chon]
    return gan(() => ganCau(ids, dich), (d) => ({ ...d, cau: d.cau.filter((c) => !chon.has(c.ma_cau)) }),
      `Đã gán ${ids.length} câu gốc vào ${tenDb(dich)}`)
  }
  const ganCaCum = (ma: string) => gan(() => ganCum(ma, dichCum[ma]),
    (d) => ({ ...d, cum: d.cum.filter((c) => c.ma_cum !== ma), cau: d.cau.filter((c) => c.ma_cum !== ma) }),
    `Đã gán cả cụm vào ${tenDb(dichCum[ma])}`)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6" onClick={onDong}>
      <div className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 bg-rose-600 px-4 py-2.5 text-white">
          <span className="flex-1 text-[14px] font-semibold">Gán câu chưa có dạng bài — <MathText>{g.nhan}</MathText></span>
          {du && <span className="text-[12px] opacity-90">còn {du.tong_cau} câu ({du.tong_goc} câu gốc)</span>}
          <button onClick={onDong} className="ml-2 text-white/80 hover:text-white">✕</button>
        </div>
        {loi && <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-[13px] text-rose-700">⚠ {loi}</div>}
        {!g.lua.length && <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-[13px] text-amber-800">Chưa có dạng bài nào ở đích này — tạo dạng bài trước rồi mới gán.</div>}
        {!du ? <div className="p-8 text-center text-[13px] text-slate-400">Đang tải câu…</div> : (
          <div className="min-h-0 flex-1 overflow-y-auto">
            {du.cum.length > 0 && (
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Gán cả cụm cũ (cả cụm vào 1 dạng bài)</div>
                {du.cum.map((c) => (
                  <div key={c.ma_cum} className="mb-1 flex items-center gap-2 text-[12.5px]">
                    <span className="w-56 truncate font-medium text-slate-700">{c.ten || `Cụm ${c.thu_tu}`} <span className="font-normal text-slate-400">{c.ma_cum} · {c.so_cau} câu</span></span>
                    <select value={dichCum[c.ma_cum] ?? ''} onChange={(e) => setDichCum({ ...dichCum, [c.ma_cum]: e.target.value })} className={`${inp} flex-1 py-1 text-[12.5px]`}>
                      <option value="">— chọn dạng bài —</option>
                      {g.lua.map((x) => <option key={x.id} value={x.id}>{x.nhan}</option>)}
                    </select>
                    <button disabled={!dichCum[c.ma_cum] || ban} onClick={() => void ganCaCum(c.ma_cum)}
                      className="shrink-0 rounded-md bg-slate-700 px-3 py-1 text-[12.5px] font-semibold text-white disabled:opacity-40">Gán cụm</button>
                  </div>
                ))}
              </div>
            )}
            <div className="divide-y divide-slate-100">
              {du.cau.map((c) => (
                <label key={c.ma_cau} className={`flex cursor-pointer items-start gap-3 px-4 py-2 hover:bg-slate-50 ${chon.has(c.ma_cau) ? 'bg-indigo-50' : ''}`}>
                  <input type="checkbox" className="mt-1" checked={chon.has(c.ma_cau)}
                    onChange={(e) => { const s = new Set(chon); if (e.target.checked) s.add(c.ma_cau); else s.delete(c.ma_cau); setChon(s) }} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex flex-wrap gap-x-2 text-[10.5px] text-slate-400">
                      <span>{c.ma_cau}</span><span>{c.loai_cau}</span><span>dạng cũ {c.ma_dang_cu}</span>
                      {c.ma_cum && <span>cụm {c.ma_cum}</span>}
                      {c.so_ban_sao > 0 && <span className="text-indigo-500">+{c.so_ban_sao} bản sao đi theo</span>}
                    </div>
                    <div className="line-clamp-4 text-[13px] leading-relaxed text-slate-800"><MathText>{c.noi_dung}</MathText></div>
                    {c.anh_de && <img src={c.anh_de} alt="" className="mt-1 max-h-28 rounded border border-slate-200" />}
                  </div>
                </label>
              ))}
            </div>
            {du.cau.length < du.tong_goc && (
              <div className="p-3 text-center"><button onClick={() => void taiThem()} className="text-[12.5px] font-medium text-indigo-600 hover:underline">Tải thêm câu ({du.cau.length}/{du.tong_goc} câu gốc)</button></div>
            )}
            {du.tong_cau === 0 && <div className="p-8 text-center text-[13px] text-emerald-600">✓ Mọi câu ở đây đã có dạng bài.</div>}
          </div>
        )}
        <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-2.5">
          <span className="text-[12.5px] text-slate-600">Đã chọn <b>{chon.size}</b> câu gốc</span>
          <button onClick={() => setChon(new Set(du?.cau.map((c) => c.ma_cau) ?? []))} className="text-[12px] text-indigo-600 hover:underline">chọn hết đang hiện</button>
          <button onClick={() => setChon(new Set())} className="text-[12px] text-slate-400 hover:underline">bỏ chọn</button>
          <select value={dich} onChange={(e) => setDich(e.target.value)} className={`${inp} ml-auto w-80 py-1 text-[12.5px]`}>
            <option value="">— gán vào dạng bài —</option>
            {g.lua.map((x) => <option key={x.id} value={x.id}>{x.nhan}</option>)}
          </select>
          <button disabled={!chon.size || !dich || ban} onClick={() => void ganChon()}
            className="rounded-md bg-rose-600 px-4 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40">Gán</button>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Màn bọc — mục riêng «Bản đồ mới» trên cây ERP (CEO 08/10). Chọn khối ở đầu màn; nhớ khối gần nhất (sở thích cá nhân).
// ════════════════════════════════════════════════════════════════════════════
const docKhoi = () => {
  try { const k = localStorage.getItem('bdm.khoi'); return k && (KHOI_OPTIONS as readonly string[]).includes(k) ? k : DEFAULT_KHOI } catch { return DEFAULT_KHOI }
}
export default function BanDoMoiScreen() {
  const [khoi, setKhoi] = useState<string>(docKhoi)
  useEffect(() => { try { localStorage.setItem('bdm.khoi', khoi) } catch { /* trình duyệt chặn lưu — bỏ qua */ } }, [khoi])
  const chonKhoi = (
    <span className="flex items-center gap-0.5">
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Khối</span>
      {KHOI_OPTIONS.map((k) => (
        <button key={k} onClick={() => setKhoi(k)}
          className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${khoi === k
            ? (k.endsWith('T') ? 'bg-violet-600 text-white' : 'bg-indigo-600 text-white')
            : (k.endsWith('T') ? 'text-violet-600 hover:bg-violet-50' : 'text-slate-500 hover:bg-slate-100')}`}>{k}</button>
      ))}
    </span>
  )
  return <div className="h-full min-h-0 bg-[#fafafb]"><BanDoMoi key={khoi} khoi={khoi} dauMan={chonKhoi} /></div>
}

function ThuTuChuDe({ cay, cd, lam }: { cay: BdmCay; cd: BdmChuDe; lam: (viec: () => Promise<unknown>, xong?: string) => Promise<void> }) {
  const ids = cay.chu_de.map((c) => c.id)
  const i = ids.indexOf(cd.id)
  const doi = (d: -1 | 1) => {
    const moi = [...ids]; [moi[i], moi[i + d]] = [moi[i + d], moi[i]]
    void lam(() => sapXep('chu_de', moi), 'Đã đổi thứ tự chủ đề')
  }
  return (
    <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
      <span>Thứ tự trong khối: <b>{i + 1}</b>/{ids.length}</span>
      <button disabled={i <= 0} onClick={() => doi(-1)} className="rounded border border-slate-200 px-2 py-0.5 disabled:opacity-30">▲ lên</button>
      <button disabled={i >= ids.length - 1} onClick={() => doi(1)} className="rounded border border-slate-200 px-2 py-0.5 disabled:opacity-30">▼ xuống</button>
    </div>
  )
}
