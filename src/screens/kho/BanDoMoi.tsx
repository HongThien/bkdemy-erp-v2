// BanDoMoi — soạn BẢN ĐỒ MỚI 4 tầng (nháp) cho nhánh Đại. spec-ban-do-4-tang.md §0 + §9.0 (CEO chốt 08/10).
//
// Việc của CEO: ① CHIA TẦNG + THỨ TỰ HỌC · ② dán LÝ THUYẾT (nhóm) / VÍ DỤ (dạng bài) · ③ viết MÔ TẢ nhận biết.
// Bố cục (CEO 08/10):
//   · mỗi màn 1 CHỦ ĐỀ (thanh chủ đề trên cùng) · thanh CHUYÊN ĐỀ trái→phải = thứ tự học, ◀ ▶ / phím ←→ để chuyển
//   · chuyên đề là 1 box; NHÓM BÀI là các box xếp theo SỐ THỨ TỰ (trái→phải, MỘT hàng, hết chỗ thì cuộn ngang — CEO 12/10) — CEO 11/10 bỏ nối
//     tiền đề giữa các nhóm, "thứ tự là đủ"; kéo nhóm thả VÀO TRONG nhóm khác = hạ thành dạng bài (dạng bài con đi theo)
//   · DẠNG BÀI là card trong box nhóm, trên→dưới = thứ tự học
//   · số thứ tự cả 3 tầng do DB tự đánh (fn_bdm_cay / _bdm_so_nhom) và HIỆN trên từng box — sai là nhìn thấy
// ⭐ Vị trí trên màn KHÔNG phải dữ liệu: box xếp theo số thứ tự (DB tính từ thu_tu). CEO đổi thứ tự bằng ◀▶ / ▲▼
//   (ghi thu_tu) — không có ô nào "ngầm" mang nghĩa.
// Kéo thả HTML5 thuần. Sau mỗi lần ghi: tải lại cây NỀN, không xoá màn (CLAUDE §2 React).
import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react'
import {
  getCay, themChuDe, suaChuDe, themChuyenDeVaoChuDe, suaChuyenDe, xoaChuDeTronGoi, xoaChuyenDeKhoiChuDe, xoaNhomTronGoi,
  themNhom, suaNhom, themDangBai, suaDangBai, xoaDangBai, sapXep, chuyenNhom, chuyenDangBai, chuyenO,
  nangDangBai, haNhom, gopChuyenDe, getLyThuyetNhom, getViDuDangBai, getLyThuyetDangBai, lyThuyetNhomApi, viDuDangBaiApi, lyThuyetDangBaiApi,
  getDangCu, ganDangCu, goDoiUng, goDoiUngTheoDich, getCauChuaGan, ganCau, ganCum, getKhoCau, BDM_NHANH, khuonCuaVung, doiVungChuDe, type BdmNhanh,
  type KhoCauRow, type KhoCauLoc,
  type BdmCay, type BdmChuDe, type BdmO, type BdmNhom, type BdmDangBai, type BdmDangCu, type BdmDangCuRef, type BdmDich, type BdmCauChuaGan,
} from '../../lib/kho/banDoMoi'
import KhoHinhHocScreen from './hinh/KhoHinhHocScreen'
import CayNhanh from './hinh/CayNhanh'
import { loadLuoi } from '../../lib/kho/api'
import type { Luoi } from '../../lib/kho/hinh'
import { KHOI_OPTIONS, DEFAULT_KHOI, type LyThuyet } from '../../lib/kho/api'
import { LyThuyetModal } from './BanDo'
import { MathText, inp } from './ui'
import KhopBanDoMoiTab from '../duyetloigiai/KhopBanDoMoiTab'
import HinhLuyenChuaPhanTab from '../duyetloigiai/HinhLuyenChuaPhanTab'
import { demChuaPhanMoHinh } from '../../lib/kho/hinhCay'
import { khopDem } from '../../lib/kho/bdmKhop'

// ⭐ CEO 08/10: dựng bản đồ mới TỪ ĐẦU, không bám bản đồ cũ ⇒ TẮT mọi phần tham chiếu bản đồ cũ trên màn soạn
// (ngăn 📦, nhãn dạng cũ, ⚠ câu chưa gán, dòng "Khớp bản đồ cũ", bảng gán câu). Bảng/hàm DB vẫn giữ: tới bước XẾP BÀI
// (kho-rules/README.md bước 3 — Claude đọc bản đồ mới để gán, học thuật duyệt) thì bật lại bảng gán câu.
const HIEN_KHOP_CU = false

// Bản đồ mới → KHO (Thùy 18/10: "chưa thấy đường đi từ bản đồ mới vào kho"): bấm số câu trên thẻ dạng bài / nút 📚 ở nhóm / ⚠ Chưa khớp ở chủ đề
// ⇒ danh sách câu thật (đề · đáp án · lời giải · cờ duyệt/kho chuẩn/kiểm máy). Cầu nối module-level: màn chỉ có 1 bản, đỡ luồn prop qua 4 tầng.
type KhoMo = { loai: 'dang_bai' | 'nhom' | 'chua_khop' | 'de_xuat' | 'thieu_dang'; id: string; ten: string }
let moKho: (m: KhoMo) => void = () => {}

// Nhớ chủ đề / chuyên đề đang xem + ngăn bản đồ cũ — sống tới F5 (CLAUDE §2: rời màn quay lại đúng chỗ cũ)
const NHO: { chuDe: Record<string, string>; chuyenDe: Record<string, string>; nganCu: boolean; duyet: boolean } = { chuDe: {}, chuyenDe: {}, nganCu: false, duyet: false }

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
  const [lt, setLt] = useState<{ loai: LoaiNoiDung; id: string; ten: string; current: LyThuyet; lan: number } | null>(null)
  const [khoMo, setKhoMo] = useState<KhoMo | null>(null)
  useEffect(() => { moKho = setKhoMo; return () => { moKho = () => {} } }, [])
  const [nganCu, setNganCu] = useState(NHO.nganCu)
  // B4 Duyệt khớp (Thùy 16/10): chế độ chia đôi — bản đồ bên trái, hàng đợi duyệt bên phải; số câu cần xem tính ở DB (fn_bdm_khop_dem)
  const [duyet, setDuyetRaw] = useState(NHO.duyet)
  const setDuyet = (v: boolean) => { NHO.duyet = v; setDuyetRaw(v) }
  const [canDuyet, setCanDuyet] = useState<number | null>(null)
  const [soi, setSoi] = useState<string | null>(null)   // dạng bài vừa bấm "Xem trên bản đồ" — sáng lên vài giây
  // Duyệt kho mở TOÀN MÀN (Thùy 16/10). "Xem trên bản đồ" chỉ ẨN màn duyệt (không gỡ) ⇒ quay lại đúng câu đang duyệt.
  const [xemBanDo, setXemBanDo] = useState(false)
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
  const napCanDuyet = useCallback(() => {
    khopDem(khoi).then((d) => setCanDuyet(d.de_xuat + d.trong + d.thieu + d.mau)).catch(() => setCanDuyet(null))
  }, [khoi])
  useEffect(() => { napCanDuyet() }, [napCanDuyet])
  // Hình–Luyện: lối tắt Duyệt kho = bài kho chờ gán mô hình của khối (Thùy 18/10: "giống Đại số — đường tắt ở bản đồ mới")
  const [canDuyetHinh, setCanDuyetHinh] = useState<number | null>(null)
  const napCanDuyetHinh = useCallback(() => {
    demChuaPhanMoHinh().then((ds) => setCanDuyetHinh(ds.find((x) => x.khoi === khoi)?.so_bai ?? 0)).catch(() => setCanDuyetHinh(null))
  }, [khoi])
  useEffect(() => { napCanDuyetHinh() }, [napCanDuyetHinh])
  // "Xem trên bản đồ": nhảy tới chủ đề › chuyên đề chứa dạng bài và làm sáng nó ~4 giây (không mở popup, không đổi dữ liệu)
  const xemDangBai = (id: string) => {
    if (!cay) return
    for (const cd of cay.chu_de) for (const oo of cd.o) for (const n of oo.nhom) if (n.dang_bai.some((d) => d.id === id)) {
      setChuDeId(cd.id); setChuyenDeId(oo.chuyen_de_id); setChon(null); setSoi(`d:${id}`)
      window.setTimeout(() => setSoi((x) => (x === `d:${id}` ? null : x)), 4000)
      return
    }
  }
  // KHUÔN màn theo vùng của chủ đề (registry BDM_NHANH) — Đại/HGT 4 tầng · Hình–Học · Hình–Luyện · 'chon' = chưa tách
  const khuon = chuDe ? khuonCuaVung(chuDe.nhanh) : 'bon_tang'
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
      if (duyet && !xemBanDo) { if (e.key === 'Escape' && !dangGo(e.target)) setDuyet(false); return } // màn duyệt toàn màn đang che bản đồ
      if (e.key === 'Escape' && !lt && !ganMo && chon) { setChon(null); return }
      if (chon?.loai === 'dang_bai' && !lt && !ganMo && !dangGo(e.target) && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault(); denDangBai(viTriDb + (e.key === 'ArrowRight' ? 1 : -1)); return
      }
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
    try { setLt({ loai, id, ten, current: loai === 'nhom' ? await getLyThuyetNhom(id) : loai === 'db_lt' ? await getLyThuyetDangBai(id) : await getViDuDangBai(id), lan: Date.now() }) }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)) }
  }
  // Duyệt nối tiếp LT/VD mọi dạng bài của CHỦ ĐỀ đang mở (CEO 15/10): bước 2i = lý thuyết dạng i, 2i+1 = ví dụ dạng i;
  // thứ tự = thứ tự hiển thị chuyên đề → nhóm → dạng bài. Hết chuyên đề thì sang chuyên đề kế.
  const chuoiDb = useMemo(() => (chuDe ? chuDe.o.flatMap((x) => x.nhom.flatMap((n) => n.dang_bai.map((d) => ({ d, n, o: x })))) : []), [chuDe])
  const buocLt = lt && lt.loai !== 'nhom' ? (() => { const i = chuoiDb.findIndex((c) => c.d.id === lt.id); return i < 0 ? -1 : i * 2 + (lt.loai === 'db_vd' ? 1 : 0) })() : -1
  const diBuoc = (b: number) => {
    const c = chuoiDb[Math.floor(b / 2)]; if (!c) return
    void moLyThuyet(b % 2 ? 'db_vd' : 'db_lt', c.d.id, c.d.ten)
    if (chon?.loai === 'dang_bai') denDangBai(Math.floor(b / 2)) // đóng khung LT/VD là về đúng popup dạng đang xem
  }
  // Popup dạng bài: ‹ › sang dạng trước/sau theo cùng chuỗi (CEO 15/10) — qua chuyên đề khác thì đổi chuyên đề theo
  const viTriDb = chon?.loai === 'dang_bai' ? chuoiDb.findIndex((c) => c.d.id === chon.id) : -1
  const denDangBai = (i: number) => { const c = chuoiDb[i]; if (!c) return; setChuyenDeId(c.o.chuyen_de_id); setChon({ loai: 'dang_bai', id: c.d.id }) }
  const dieuHuongDb = viTriDb < 0 ? undefined : {
    truoc: viTriDb > 0 ? () => denDangBai(viTriDb - 1) : null,
    sau: viTriDb < chuoiDb.length - 1 ? () => denDangBai(viTriDb + 1) : null,
    nhan: `dạng bài ${viTriDb + 1}/${chuoiDb.length}`,
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

  const sang = (k: string) => (hover === k ? 'ring-2 ring-indigo-400 ring-offset-1' : soi === k ? 'ring-4 ring-emerald-400 ring-offset-2' : '')

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Đầu màn: khối · CHỦ ĐỀ (dropdown, mỗi màn 1 chủ đề) · bản đồ cũ · tiến độ */}
      {/* MỘT dòng ở mọi khối (Thùy 17/10: K6 gãy dòng, K7 không): nút giữ cỡ, chỉ chữ tiến độ co lại */}
      <div className="flex flex-nowrap items-center gap-x-3 border-b border-slate-200 bg-white px-4 py-2 [&>*]:shrink-0">
        <span className="text-[14px] font-semibold text-slate-900">🆕 Bản đồ mới</span>
        {/* dãy nút khối: màn hẹp thì cuộn ngang thay vì đẩy cả thanh xuống dòng */}
        <span className="flex min-w-0 !shrink overflow-x-auto [scrollbar-width:thin]">{dauMan}</span>
        <span className="flex items-center gap-1.5">
          <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Chủ đề</span>
          <select value={chuDe?.id ?? ''} onChange={(e) => chonChuDe(e.target.value)} disabled={!cay.chu_de.length}
            title={chuDe?.ten} className={`${inp} !w-[240px] truncate py-1 text-[13px] font-medium`}>
            {!cay.chu_de.length && <option value="">— chưa có chủ đề —</option>}
            {cay.chu_de.map((cd, i) => <option key={cd.id} value={cd.id}>{i + 1}. {cd.ten}{cd.nhanh !== 'toan' ? ` · ${BDM_NHANH.find((n) => n.id === cd.nhanh)?.nhan ?? cd.nhanh}` : ''}</option>)}
          </select>
        </span>
        {chuDe && (
          <label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500" title="Vùng kiến thức của chủ đề này — đổi bất cứ lúc nào">
            Vùng
            <select value={chuDe.nhanh} onChange={(e) => void lam(() => doiVungChuDe(chuDe.id, e.target.value as BdmNhanh), 'Đã đổi vùng kiến thức')}
              className={`${inp} w-auto py-1 text-[13px] font-medium normal-case tracking-normal text-slate-800`}>
              {BDM_NHANH.filter((n) => !n.an || n.id === chuDe.nhanh).map((n) => <option key={n.id} value={n.id}>{n.nhan}</option>)}
            </select>
          </label>
        )}
        {chuDe && (
          <button onClick={() => setChon({ loai: 'chu_de' })} title="Sửa tên / thứ tự / xoá chủ đề"
            className="rounded-md border border-slate-200 px-2 py-1 text-[12.5px] text-slate-600 hover:border-indigo-300 hover:text-indigo-700">⚙ Chủ đề</button>
        )}
        {chuDe && khuon === 'bon_tang' && (
          <>
            <button onClick={() => moKho({ loai: 'de_xuat', id: chuDe.id, ten: chuDe.ten })} title="Câu AI đã đề xuất dạng bài nhưng chưa chắc — chờ người duyệt"
              className="rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-[12.5px] font-medium text-sky-800 hover:border-sky-400">💡 Đề xuất</button>
            <button onClick={() => moKho({ loai: 'thieu_dang', id: chuDe.id, ten: chuDe.ten })} title="Câu thuộc chủ đề này mà AI không xếp được vào dạng bài nào (có thể cần thêm dạng bài)"
              className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[12.5px] font-medium text-amber-800 hover:border-amber-400">⚠ Thiếu dạng</button>
            {chuDe.nhanh === 'toan' && (
              <button onClick={() => moKho({ loai: 'chua_khop', id: chuDe.id, ten: chuDe.ten })} title="Rổ chưa khớp cũ (lượt gán 10/10) — chưa phân loại tiếp"
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[12.5px] font-medium text-slate-600 hover:border-slate-400">Chưa khớp</button>
            )}
          </>
        )}
        <ThemNhanh nhan="+ Chủ đề" goiY="Tên chủ đề…" onThem={(ten) => lam(() => themChuDe(khoi, ten), 'Đã thêm chủ đề')} />
        {HIEN_KHOP_CU && khuon === 'bon_tang' && <button onClick={() => setNganCu(!nganCu)} title="Ngăn dạng cũ — kéo dạng cũ thả vào dạng bài / nhóm / chuyên đề để gắn"
          className={`rounded-lg border px-2.5 py-1 text-[12.5px] font-medium ${nganCu ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-600 hover:border-amber-300'}`}>
          📦 Bản đồ cũ{cay.tong.dang_cu_chua_gan ? <span className="ml-1 rounded-full bg-rose-500 px-1.5 text-[10.5px] font-bold text-white">{cay.tong.dang_cu_chua_gan}</span> : null}
        </button>}
        {(khuon === 'bon_tang' || khuon === 'hinh_luyen') && chuDe && (
          <button onClick={() => { if (duyet && xemBanDo) setXemBanDo(false); else { setDuyet(!duyet); setXemBanDo(false) } }}
            title={khuon === 'hinh_luyen' ? 'Duyệt bài Hình vào kho Luyện (gán mô hình · từ chối kèm lý do) — mở toàn màn' : 'Duyệt câu AI đã xếp vào dạng bài (kho tạm · phạm vi người duyệt · kiểm mẫu) — mở toàn màn'}
            className={`rounded-lg border px-2.5 py-1 text-[12.5px] font-medium ${duyet ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-emerald-400'}`}>
            ✅ Duyệt kho{(khuon === 'hinh_luyen' ? canDuyetHinh : canDuyet) ? <span className="ml-1 rounded-full bg-rose-500 px-1.5 text-[10.5px] font-bold text-white">{khuon === 'hinh_luyen' ? canDuyetHinh : canDuyet}</span> : null}
          </button>
        )}
        <span className={`ml-auto flex min-w-0 !shrink-[1000] flex-col items-end overflow-hidden text-[11px] leading-tight text-slate-500 ${khuon === 'bon_tang' ? '' : 'invisible'}`}>
          <span className="max-w-full truncate">Nhóm <b>{tienDo.nhom}</b> · mô tả {tienDo.nhomMoTa} · lý thuyết {tienDo.nhomLt}</span>
          <span className="max-w-full truncate">Dạng bài <b>{tienDo.db}</b> · mô tả {tienDo.dbMoTa} · lý thuyết {tienDo.dbLt} · ví dụ {tienDo.dbVd}</span>
        </span>
      </div>
      {/* Khớp bản đồ cũ — luật: mọi câu phải thuộc 1 dạng bài. Khối xong khi cả 2 số về 0. */}
      {HIEN_KHOP_CU && khuon === 'bon_tang' && <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-200 bg-slate-50 px-4 py-1 text-[12px] text-slate-600">
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

      {khuon !== 'bon_tang' && chuDe ? (
        // ── HÌNH: khuôn riêng theo vùng (không có chuyên đề / nhóm / dạng bài) ──
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1 overflow-auto">
            {khuon === 'chon' ? (
              <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center">
                <div className="text-[15px] font-semibold text-slate-900">Chủ đề «{chuDe.ten}» là Hình — thuộc phần nào?</div>
                <p className="mt-1 text-[12.5px] text-slate-500">Hai phần độc lập, giao diện khác nhau. Đổi lại được ở ô «Vùng» bất cứ lúc nào.</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-left">
                  <button onClick={() => void lam(() => doiVungChuDe(chuDe.id, 'hinh_hoc'), 'Đã đặt vùng Hình – Học')}
                    className="rounded-xl border-2 border-indigo-200 p-4 hover:border-indigo-400 hover:bg-indigo-50">
                    <b className="text-indigo-700">📖 Hình – Học</b>
                    <div className="mt-1 text-[12px] text-slate-600">Học dần từng bài: chủ đề → bài học → bài tập. Đo ở bài học.</div>
                  </button>
                  <button onClick={() => void lam(() => doiVungChuDe(chuDe.id, 'hinh_luyen'), 'Đã đặt vùng Hình – Luyện')}
                    className="rounded-xl border-2 border-teal-200 p-4 hover:border-teal-400 hover:bg-teal-50">
                    <b className="text-teal-700">🌿 Hình – Luyện</b>
                    <div className="mt-1 text-[12px] text-slate-600">Bài tổng hợp đi thi: chủ đề → mô hình → nhánh → bài (cây nhánh).</div>
                  </button>
                </div>
              </div>
            ) : khuon === 'hinh_hoc' ? (
              <KhoHinhHocScreen key={chuDe.id} khoi={khoi} chuDeId={chuDe.id} tenChuDe={chuDe.ten} />
            ) : (
              <HinhLuyenTrongBanDo key={chuDe.id} khoi={khoi} chuDeId={chuDe.id} />
            )}
          </div>
          {chon?.loai === 'chu_de' && (
            <ChiTiet chon={chon} cay={cay} cd={chuDe} o={o ?? chuDe.o[0]} khoi={khoi} onDong={() => setChon(null)}
              lam={lam} moLyThuyet={moLyThuyet} onDaXoa={() => setChon(null)} moGan={moGan} dieuHuong={dieuHuongDb} />
          )}
        </div>
      ) : (
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
            lam={lam} moLyThuyet={moLyThuyet} onDaXoa={() => setChon(null)} moGan={moGan} dieuHuong={dieuHuongDb} />
        )}
      </div>
      )}

      {/* ── DUYỆT KHO toàn màn (che cả thanh trên + menu trái của ERP) ── */}
      {duyet && chuDe && (khuon === 'bon_tang' || khuon === 'hinh_luyen') && (
        <div className={`fixed inset-0 z-[65] flex flex-col bg-slate-50 ${xemBanDo ? 'hidden' : ''}`}>
          <div className="flex shrink-0 items-center gap-3 border-b border-emerald-700 bg-emerald-600 px-5 py-2.5 text-white">
            <span className="text-[15px] font-semibold">✅ Duyệt kho</span>
            <span className="text-[13px] text-white/80">Khối {khoi} · <MathText>{chuDe.ten}</MathText></span>
            {khuon === 'hinh_luyen'
              ? <span className="text-[13px] text-white/80">· bài Hình chờ vào kho Luyện{canDuyetHinh ? ` (${canDuyetHinh} bài)` : ''}</span>
              : canDuyet ? <span className="rounded-full bg-white/20 px-2 py-0.5 text-[12px] font-medium">{canDuyet} câu cần xử lý</span> : null}
            <button onClick={() => setDuyet(false)} className="ml-auto rounded-md bg-white/15 px-3 py-1.5 text-[13px] font-semibold hover:bg-white/25">✕ Về bản đồ</button>
          </div>
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col bg-white shadow-sm">
            {khuon === 'hinh_luyen'
              ? <HinhLuyenChuaPhanTab key={khoi} khoi={khoi} onChanged={napCanDuyetHinh} />
              : <KhopBanDoMoiTab key={khoi} khoi={khoi} chuDeId={chuDe.id} onChanged={napCanDuyet}
                  onXem={(id) => { setXemBanDo(true); xemDangBai(id) }} />}
          </div>
        </div>
      )}
      {duyet && xemBanDo && (
        <button onClick={() => setXemBanDo(false)}
          className="fixed bottom-6 right-6 z-30 rounded-full bg-emerald-600 px-5 py-3 text-[14px] font-semibold text-white shadow-xl hover:bg-emerald-500">↩ Quay lại Duyệt kho</button>
      )}

      {bao && <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-[13px] font-medium text-white shadow-lg">✓ {bao}</div>}

      {HIEN_KHOP_CU && ganMo && (
        <BangGanCau g={ganMo} onDong={() => setGanMo(null)} onDaGan={(n) => { thongBao(n); void napLai() }} />
      )}

      {khoMo && <KhoModal mo={khoMo} onDong={() => setKhoMo(null)} />}
      {lt && (
        <LyThuyetModal key={`${lt.loai}:${lt.id}:${lt.lan}`} ma={lt.id} ten={`${lt.loai === 'db_vd' ? 'Ví dụ' : 'Lý thuyết'} — ${lt.ten}`} current={lt.current}
          api={lt.loai === 'nhom' ? lyThuyetNhomApi : lt.loai === 'db_lt' ? lyThuyetDangBaiApi : viDuDangBaiApi}
          onClose={() => setLt(null)}
          onSaved={buocLt < 0
            ? () => { setLt(null); thongBao('Đã lưu'); void napLai() }
            // đang duyệt nối tiếp ⇒ ở lại đúng bước, nạp lại nội dung vừa lưu (bấm Sau ▶ khi xong)
            : () => { thongBao('Đã lưu'); void napLai(); void moLyThuyet(lt.loai, lt.id, lt.ten) }}
          dauTrang={buocLt < 0 ? undefined : (roiDuoc) => (
            <ThanhDuyetDangBai chuoi={chuoiDb} buoc={buocLt} roiDuoc={roiDuoc} onDi={diBuoc}
              onLuuMoTa={(id, m) => lam(() => suaDangBai(id, { mo_ta: m }))} />
          )} />
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Sơ đồ 1 chuyên đề: box chuyên đề ở trên, các nhóm bài xếp theo SỐ THỨ TỰ (trái → phải, MỘT hàng ngang — hết chỗ thì cuộn ngang).
// CEO 11/10: bỏ nối tiền đề giữa các nhóm — "thứ tự là đủ". Kéo nhóm thả VÀO TRONG nhóm khác = hạ thành dạng bài.
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
  const dangChon = (c: Chon) => !!chon && JSON.stringify(chon) === JSON.stringify(c)
  return (
    <div className="min-w-0 flex-1 overflow-auto bg-[#fafafb] p-6">
      {/* min-w-max: khung rộng bằng hàng nhóm ⇒ hết chỗ thì KÉO THANH CUỘN NGANG của ô ngoài (không xuống dòng) */}
      <div className="flex min-w-max flex-col items-center gap-6">
        {/* Box CHUYÊN ĐỀ */}
        <div onClick={() => p.onChon({ loai: 'o' })}
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

        {/* Các NHÓM BÀI theo số thứ tự: trái → phải, MỘT HÀNG NGANG (Thùy 12/10: "hết chỗ thì kéo thanh bar") */}
        {o.nhom.length > 0 && (
          <div className="flex flex-nowrap items-start gap-5">
            {o.nhom.map((n) => (
              <div key={n.id} className="w-[280px] shrink-0">
                <BoxNhom n={n} cd={cd} o={o} chon={dangChon({ loai: 'nhom', id: n.id })} chonDangBai={chon?.loai === 'dang_bai' ? chon.id : null}
                  sapHa={p.hover === `n:${n.id}` && p.dangKeo === 'nhom'} sang={sang}
                  batDauKeo={p.batDauKeo} ketThucKeo={p.ketThucKeo} vung={vung} onChon={p.onChon} lam={lam}
                  ganVao={p.ganVao} moGan={() => p.moGan(o, n)} moLyThuyet={() => p.moLyThuyet('nhom', n.id, n.ten)} />
              </div>
            ))}
          </div>
        )}

        <ThemNhanh nhan="+ Nhóm bài" goiY="Tên nhóm bài…" rong onThem={(ten) => lam(() => themNhom(cd.id, o.chuyen_de_id, ten), 'Đã thêm nhóm bài')} />
        {o.nhom.length > 1 && <div className="text-[11px] text-slate-400">Kéo một nhóm thả vào TRONG nhóm khác = hạ nó thành dạng bài của nhóm đó · ◀ ▶ trên đầu box để đổi thứ tự</div>}
      </div>
    </div>
  )
}

function BoxNhom(p: {
  n: BdmNhom; cd: BdmChuDe; o: BdmO; chon: boolean; chonDangBai: string | null; sapHa: boolean
  sang: (k: string) => string
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
  // ◀ ▶: đổi chỗ với nhóm liền trước / liền sau theo số thứ tự (không còn tiền đề ⇒ mọi nhóm trong chuyên đề là anh em)
  const theoSo = [...o.nhom].sort((a, b) => a.so - b.so)
  const viTri = theoSo.findIndex((x) => x.id === n.id)
  const doiCho = (d: -1 | 1, nhan: string) => {
    const ids = theoSo.map((x) => x.id)
    if (viTri < 0 || viTri + d < 0 || viTri + d >= ids.length) return
    ;[ids[viTri], ids[viTri + d]] = [ids[viTri + d], ids[viTri]]
    void lam(() => sapXep('nhom', ids), nhan)
  }
  // Thả 1 nhóm vào TRONG nhóm này = hạ nhóm kia thành dạng bài ở đây (dạng bài con của nó đi theo)
  const haVaoDay = (k: Keo) => {
    if (k.loai !== 'nhom') return
    const a = o.nhom.find((x) => x.id === k.id)
    if (!a) return
    const con = a.dang_bai.length
    if (!window.confirm(`Hạ «${a.ten}» thành dạng bài của «${n.ten}»?${con ? `\n\n${con} dạng bài đang ở trong «${a.ten}» cũng chuyển sang «${n.ten}».` : ''}\n\nLý thuyết của nhóm thành lý thuyết của dạng bài.`)) return
    return lam(() => haNhom(a.id, n.id), `Đã hạ «${a.ten}» thành dạng bài`)
  }
  return (
    <div draggable onDragStart={(e) => p.batDauKeo(e, { loai: 'nhom', id: n.id, chuDeId: cd.id, chuyenDeId: o.chuyen_de_id })} onDragEnd={p.ketThucKeo}
      data-hop
      {...vung(`n:${n.id}`, (k) => cungO(k) || (k.loai === 'dang_bai' && k.nhomId !== n.id) || k.loai === 'dang_cu', (k) => {
        if (k.loai === 'dang_cu') return p.ganVao({ nhom: n.id }, `nhóm «${n.ten}»`)(k)
        if (k.loai === 'nhom') return haVaoDay(k)
        if (k.loai === 'dang_bai') return lam(() => chuyenDangBai(k.id, n.id, null), 'Đã chuyển dạng bài')
      })}
      onClick={() => p.onChon({ loai: 'nhom', id: n.id })}
      className={`group/nhom cursor-grab overflow-hidden rounded-xl border bg-white shadow-sm active:cursor-grabbing ${p.sapHa ? 'ring-2 ring-violet-500 ring-offset-2' : sang(`n:${n.id}`)} ${p.chon ? 'border-amber-400 ring-2 ring-amber-300' : 'border-slate-200 hover:border-indigo-300'}`}>
      <div className="flex items-start gap-2 bg-slate-700 px-3 py-2 text-white">
        <span className="mt-px rounded bg-white/20 px-1.5 text-[11px] font-bold">{n.so}</span>
        <span className="flex-1 text-[13px] font-semibold leading-snug"><MathText>{n.ten}</MathText></span>
        <span className="hidden shrink-0 gap-0.5 group-hover/nhom:flex">
          <button onClick={(e) => { e.stopPropagation(); doiCho(-1, 'Đã đưa lên trước') }} disabled={viTri <= 0}
            title="Đổi chỗ với nhóm liền trước" className="rounded px-1 text-[11px] text-white/80 hover:bg-white/20 disabled:opacity-25">◀</button>
          <button onClick={(e) => { e.stopPropagation(); doiCho(1, 'Đã đưa ra sau') }} disabled={viTri < 0 || viTri >= theoSo.length - 1}
            title="Đổi chỗ với nhóm liền sau" className="rounded px-1 text-[11px] text-white/80 hover:bg-white/20 disabled:opacity-25">▶</button>
        </span>
        <button onClick={(e) => { e.stopPropagation(); p.moLyThuyet() }} draggable={false}
          title={n.co_ly_thuyet ? 'Xem / sửa lý thuyết' : 'Gán lý thuyết cho nhóm này'}
          className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold ${n.co_ly_thuyet ? 'bg-sky-400/30 text-white hover:bg-sky-400/50' : 'bg-white/15 text-white/80 hover:bg-white/30'}`}>
          📖{n.co_ly_thuyet ? '' : ' +LT'}
        </button>
        <button onClick={(e) => { e.stopPropagation(); moKho({ loai: 'nhom', id: n.id, ten: n.ten }) }} draggable={false}
          title="Mở KHO: mọi câu của các dạng bài trong nhóm này" className="shrink-0 rounded bg-white/15 px-1.5 py-0.5 text-[11px] font-semibold text-white/90 hover:bg-white/30">📚</button>
        <DauTienDo moTa={!!n.mo_ta.trim()} noiDung={n.co_ly_thuyet} nhanNoiDung="lý thuyết" />
      </div>
      {p.sapHa && <div className="bg-violet-600 px-3 py-1.5 text-center text-[11.5px] font-semibold text-white">⤵ Thả: hạ thành DẠNG BÀI của nhóm này</div>}
      <div className="flex flex-col gap-1.5 p-2.5">
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
      {d.so_cau > 0 && (
        <button onClick={(e) => { e.stopPropagation(); moKho({ loai: 'dang_bai', id: d.id, ten: d.ten }) }} draggable={false}
          title="Mở KHO: các câu thuộc dạng bài này" className="shrink-0 rounded bg-white px-1.5 text-[10.5px] font-semibold text-violet-700 ring-1 ring-violet-200 hover:bg-violet-100">📚 {d.so_cau}</button>
      )}
      <DauTienDo moTa={!!d.mo_ta.trim()} noiDung={d.co_ly_thuyet} nhanNoiDung="lý thuyết" noiDung2={d.co_vi_du} nhanNoiDung2="ví dụ" />
    </div>
  )
}

// Chấm tiến độ: mô tả · lý thuyết/ví dụ — xám = chưa có
// ════════════════════════════════════════════════════════════════════════════
// Thanh duyệt nối tiếp trong khung soạn LT/VD dạng bài (CEO 15/10): ◀ Trước · [Lý thuyết | Ví dụ] · Sau ▶,
// kèm ô mô tả + 3 chấm của dạng đang xem. Phím ← → chuyển bước khi con trỏ KHÔNG nằm trong ô soạn.
function ThanhDuyetDangBai({ chuoi, buoc, roiDuoc, onDi, onLuuMoTa }: {
  chuoi: { d: BdmDangBai; n: BdmNhom; o: BdmO }[]; buoc: number; roiDuoc: () => boolean
  onDi: (b: number) => void; onLuuMoTa: (id: string, m: string) => void
}) {
  const c = chuoi[Math.floor(buoc / 2)]
  const laVd = buoc % 2 === 1
  const tong = chuoi.length * 2
  const di = (b: number) => { if (b >= 0 && b < tong && b !== buoc && roiDuoc()) onDi(b) }
  const [moTa, setMoTa] = useState(c.d.mo_ta)
  useEffect(() => { setMoTa(c.d.mo_ta) }, [c.d.id, c.d.mo_ta])
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.isContentEditable)) return
      if (e.key === 'ArrowRight') { e.preventDefault(); di(buoc + 1) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); di(buoc - 1) }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  })
  const cham = (co: boolean, nhan: string) => (
    <span className={`flex items-center gap-1 text-[11.5px] ${co ? 'text-emerald-700' : 'text-slate-400'}`}>
      <span className={`h-2 w-2 rounded-full ${co ? 'bg-emerald-500' : 'bg-slate-300'}`} />{nhan}
    </span>
  )
  const nut = 'flex h-9 shrink-0 items-center gap-1 rounded-md border px-3 text-[13px] font-semibold disabled:opacity-30'
  return (
    <div className="border-b border-indigo-200 bg-indigo-50/70 px-6 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => di(buoc - 1)} disabled={buoc === 0} title="Bước trước (phím ←)" className={`${nut} border-slate-300 bg-white text-slate-600 hover:border-indigo-400`}>◀ Trước</button>
        <div className="flex shrink-0 overflow-hidden rounded-md border border-indigo-300 bg-white">
          <button onClick={() => di(buoc - (laVd ? 1 : 0))} className={`h-9 px-4 text-[13px] font-semibold ${!laVd ? 'bg-indigo-600 text-white' : 'text-indigo-700 hover:bg-indigo-50'}`}>📖 Lý thuyết</button>
          <button onClick={() => di(buoc + (laVd ? 0 : 1))} className={`h-9 px-4 text-[13px] font-semibold ${laVd ? 'bg-indigo-600 text-white' : 'text-indigo-700 hover:bg-indigo-50'}`}>📝 Ví dụ</button>
        </div>
        <button onClick={() => di(buoc + 1)} disabled={buoc >= tong - 1} title="Bước sau (phím →)" className={`${nut} border-indigo-400 bg-indigo-600 text-white hover:bg-indigo-500`}>Sau ▶</button>
        <div className="min-w-0 flex-1 truncate pl-2 text-[12.5px] text-slate-600">
          <span className="text-slate-400"><MathText>{c.o.ten}</MathText> › </span><span className="text-slate-500">#{c.n.so} <MathText>{c.n.ten}</MathText> › </span>
          <b className="text-slate-800">{c.n.so}.{c.d.so} <MathText>{c.d.ten}</MathText></b>
        </div>
        <span className="shrink-0 text-[12px] text-slate-500">dạng bài {Math.floor(buoc / 2) + 1}/{chuoi.length}</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="shrink-0 text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">Mô tả</span>
        <input value={moTa} onChange={(e) => setMoTa(e.target.value)} onBlur={() => { if (moTa.trim() !== c.d.mo_ta.trim()) onLuuMoTa(c.d.id, moTa.trim()) }}
          placeholder="— chưa có mô tả nhận biết (gõ để thêm, rời ô là lưu)"
          className={`${inp} h-8 min-w-0 flex-1 text-[13px] ${c.d.mo_ta.trim() ? '' : 'border-amber-300 bg-amber-50'}`} />
        <div className="flex shrink-0 gap-3">{cham(!!c.d.mo_ta.trim(), 'mô tả')}{cham(c.d.co_ly_thuyet, 'lý thuyết')}{cham(c.d.co_vi_du, 'ví dụ')}</div>
      </div>
    </div>
  )
}

// Nút tròn lớn hai bên popup dạng bài (ngoài hộp): sang dạng trước/sau mà không phải đóng–mở lại.
// mouseDown giữ mặc định ⇒ ô mô tả/tên đang gõ blur trước ⇒ lưu cho đúng dạng cũ rồi mới chuyển.
function NutChuyenDang({ huong, onBam }: { huong: 'truoc' | 'sau'; onBam: (() => void) | null }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onBam?.() }} disabled={!onBam}
      title={huong === 'truoc' ? 'Dạng bài trước (phím ←)' : 'Dạng bài sau (phím →)'}
      className="flex shrink-0 flex-col items-center gap-1 text-white disabled:invisible">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl font-bold text-violet-700 shadow-xl ring-4 ring-white/30 hover:bg-violet-50">{huong === 'truoc' ? '‹' : '›'}</span>
      <span className="text-[12px] font-semibold drop-shadow">{huong === 'truoc' ? 'Dạng trước' : 'Dạng sau'}</span>
    </button>
  )
}

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
// Khung chi tiết: tên · mô tả · lý thuyết/ví dụ · chuyển · nâng/hạ · gỡ/xoá
// ════════════════════════════════════════════════════════════════════════════
function ChiTiet(p: {
  chon: Chon; cay: BdmCay; cd: BdmChuDe; o: BdmO | null | undefined; khoi: string; onDong: () => void
  lam: (viec: () => Promise<unknown>, xong?: string) => Promise<void>
  moLyThuyet: (loai: LoaiNoiDung, id: string, ten: string) => void
  onDaXoa: () => void
  moGan: (o: BdmO, n: BdmNhom | null) => void
  dieuHuong?: { truoc: (() => void) | null; sau: (() => void) | null; nhan: string }
}) {
  const { chon, cay, cd, o, lam } = p
  const goCu = (dich: BdmDich) => (ma: string, ten: string) => void lam(() => goDoiUngTheoDich(ma, dich), `Đã gỡ gắn «${ten}»`)
  // Nhóm bài / dạng bài: POPUP GIỮA MÀN (CEO 08/10). Chủ đề / chuyên đề: khung phải như cũ.
  const giuaMan = chon.loai === 'nhom' || chon.loai === 'dang_bai'
  const khung = (tieuDe: string, mau: string, noiDung: ReactNode) => giuaMan ? (
    <div className="fixed inset-0 z-40 flex items-center justify-center gap-5 bg-slate-900/40 p-6" onClick={p.onDong}>
      {chon.loai === 'dang_bai' && p.dieuHuong && <NutChuyenDang huong="truoc" onBam={p.dieuHuong.truoc} />}
      <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className={`flex items-center gap-2 px-5 py-3 text-white ${mau}`}>
          <span className="flex-1 text-[14px] font-semibold">{tieuDe}</span>
          {chon.loai === 'dang_bai' && p.dieuHuong && <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11.5px] font-medium">{p.dieuHuong.nhan}</span>}
          <span className="text-[11px] text-white/60">{chon.loai === 'dang_bai' && p.dieuHuong ? '← → chuyển dạng · Esc để đóng' : 'Esc để đóng'}</span>
          <button onClick={p.onDong} className="text-white/70 hover:text-white">✕</button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">{noiDung}</div>
      </div>
      {chon.loai === 'dang_bai' && p.dieuHuong && <NutChuyenDang huong="sau" onBam={p.dieuHuong.sau} />}
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
          <NutXoa nhan="Xoá chủ đề (kèm mọi thứ bên trong)" moTa={`Xoá luôn ${cd.o.length} chuyên đề · ${soNhom} nhóm · ${soDb} dạng bài bên trong (lý thuyết, ví dụ, mô tả mất theo). Chuyên đề nào đang dùng chung ở chủ đề khác thì vẫn giữ ở đó.`}
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
      <ChonDich nhan="⧉ Gộp vào chuyên đề khác (dùng chung)" moTa="Chuyên đề này biến mất; mọi chủ đề đang dùng nó chuyển sang chuyên đề đích (chủ đề đã có đích thì dồn nhóm vào). Các nhóm bài đi theo."
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
      <ChonDich nhan="⇄ Chuyển sang chuyên đề khác" moTa="Hoặc kéo box thả lên tên chuyên đề ở cột trái."
        lua={moiO.filter((x) => !(x.cd.id === cd.id && x.o.chuyen_de_id === o.chuyen_de_id)).map((x) => ({ id: oKey(x.cd.id, x.o.chuyen_de_id), nhan: `${x.cd.ten} › ${x.o.ten}` }))}
        onChon={(k) => { const [c, ch] = k.split('|'); void lam(() => chuyenNhom(n.id, c, ch, null), 'Đã chuyển nhóm bài').then(p.onDaXoa) }} />
      <HaNhom cay={cay} n={n} onHa={(dich) => void lam(() => haNhom(n.id, dich), 'Đã hạ thành dạng bài').then(p.onDaXoa)} />
      <NutXoa nhan="Xoá nhóm bài (kèm dạng bài bên trong)" moTa={`Xoá luôn ${n.dang_bai.length} dạng bài bên trong. Lý thuyết, ví dụ, mô tả mất theo.`}
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
    <button onClick={() => moKho({ loai: 'dang_bai', id: d.id, ten: d.ten })} disabled={d.so_cau === 0}
      className="flex flex-col items-start rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50">
      <span>📚 Kho câu</span><span className="text-[11.5px] font-normal">{d.so_cau > 0 ? `${d.so_cau} câu (kể cả bản sao) — bấm để xem` : 'chưa có câu nào thuộc dạng bài này'}</span>
    </button>
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

// Chọn 1 đích trong danh sách rồi bấm — dùng cho chuyển / gộp / hạ
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
  const con = n.dang_bai.length
  return <ChonDich nhan="⬇ Hạ thành dạng bài của nhóm khác"
    moTa={`Nhanh hơn: kéo box này thả vào TRONG box nhóm đích. Lý thuyết của nhóm thành lý thuyết của dạng bài.${con ? ` ${con} dạng bài bên trong cũng chuyển sang nhóm đích.` : ''}`}
    lua={lua} onChon={(id) => { if (window.confirm(`Hạ «${n.ten}» thành dạng bài?${con ? `\n\n${con} dạng bài bên trong cũng chuyển sang nhóm đích.` : ''}`)) onHa(id) }} />
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
/** Vùng Hình–Luyện trong Bản đồ mới: nạp lưới Hình của khối rồi mở màn Cây nhánh, lọc theo chủ đề đang chọn. */
function HinhLuyenTrongBanDo({ khoi, chuDeId }: { khoi: string; chuDeId: string }) {
  const [L, setL] = useState<Luoi | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const nap = useCallback(async () => {
    try { setLoi(null); setL(await loadLuoi(khoi)) } catch (e) { setLoi(e instanceof Error ? e.message : String(e)) }
  }, [khoi])
  useEffect(() => { void nap() }, [nap])
  if (loi) return <div className="p-8 text-sm text-rose-600">Không tải được lưới Hình: {loi}</div>
  if (!L) return <div className="flex h-full items-center justify-center text-sm text-slate-400">Đang tải mô hình…</div>
  return <div className="h-full p-5"><CayNhanh L={L} khoi={khoi} reload={nap} chuDeId={chuDeId} /></div>
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

// ════════════════════════════════════════════════════════════════════════════
// KHO CỦA DẠNG BÀI / NHÓM / RỔ CHƯA KHỚP — danh sách câu thật, phân trang 40 (fn_bdm_kho_cau, mig 202610181756).
// Chỉ ĐỌC: duyệt/sửa câu vẫn ở ✅ Duyệt kho và màn Kho; ở đây để THẤY câu nào đang nằm đâu.
// ════════════════════════════════════════════════════════════════════════════
const LOC_KHO: { id: KhoCauLoc; nhan: string }[] = [
  { id: 'tat_ca', nhan: 'Tất cả' }, { id: 'chua_duyet', nhan: 'Chưa duyệt' }, { id: 'da_duyet', nhan: 'Đã duyệt' }, { id: 'kho_chuan', nhan: 'Kho chuẩn' },
]
const NHAN_LOAI: Record<string, string> = { trac_nghiem: 'Trắc nghiệm', dung_sai: 'Đúng/Sai', tra_loi_ngan: 'Trả lời ngắn', tu_luan: 'Tự luận' }
function KhoModal({ mo, onDong }: { mo: KhoMo; onDong: () => void }) {
  const [loc, setLoc] = useState<KhoCauLoc>('tat_ca')
  const [rows, setRows] = useState<KhoCauRow[]>([])
  const [tong, setTong] = useState(0)
  const [dang, setDang] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const req = useRef(0)
  const TRANG = 40
  const tai = (batDau: number) => {
    const my = ++req.current
    setDang(true); setLoi(null)
    getKhoCau(mo.loai, mo.id, loc, TRANG, batDau)
      .then((r) => { if (my !== req.current) return; setRows((a) => (batDau === 0 ? r : [...a, ...r])); if (r.length) setTong(r[0].tong) })
      .catch((e) => { if (my === req.current) setLoi(e instanceof Error ? e.message : String(e)) })
      .finally(() => { if (my === req.current) setDang(false) })
  }
  useEffect(() => { setRows([]); setTong(0); tai(0) }, [mo.loai, mo.id, loc]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong() }
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f)
  }, [onDong])
  const tieuDe = mo.loai === 'chua_khop' ? 'Chưa khớp dạng bài' : mo.loai === 'de_xuat' ? 'AI đề xuất — chờ duyệt' : mo.loai === 'thieu_dang' ? 'Thiếu dạng bài' : mo.loai === 'nhom' ? 'Kho của nhóm' : 'Kho của dạng bài'
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-6" onClick={onDong}>
      <div className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-slate-50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
          <span className="text-[14px] font-semibold text-slate-900">📚 {tieuDe}</span>
          <span className="min-w-0 flex-1 truncate text-[13px] text-slate-600"><MathText>{mo.ten}</MathText></span>
          <span className="text-[12px] text-slate-500"><b>{tong}</b> câu{rows.length < tong ? ` · đang hiện ${rows.length}` : ''}</span>
          <span className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {LOC_KHO.map((x) => (
              <button key={x.id} onClick={() => setLoc(x.id)}
                className={`rounded-md px-2 py-0.5 text-[12px] font-medium ${loc === x.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{x.nhan}</button>
            ))}
          </span>
          <button onClick={onDong} className="rounded-md px-2 py-1 text-[13px] text-slate-500 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {loi && <div className="rounded-md bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
          {!dang && !loi && rows.length === 0 && <div className="py-10 text-center text-[13px] text-slate-400">Không có câu nào{loc !== 'tat_ca' ? ' ở bộ lọc này' : ''}.</div>}
          {rows.map((r) => <CauKho key={r.ma_cau} r={r} nhom={mo.loai === 'nhom'} />)}
          {dang && <div className="py-3 text-center text-[12.5px] text-slate-400">Đang tải…</div>}
          {!dang && rows.length < tong && (
            <button onClick={() => tai(rows.length)} className="mx-auto block rounded-md border border-slate-300 bg-white px-4 py-1.5 text-[12.5px] font-medium text-slate-700 hover:border-indigo-300">Tải thêm {Math.min(TRANG, tong - rows.length)} câu</button>
          )}
        </div>
      </div>
    </div>
  )
}
function CauKho({ r, nhom }: { r: KhoCauRow; nhom: boolean }) {
  const nguonGan = r.nguon_gan === 'chua_khop' || r.nguon_gan === 'thieu_dang' ? null : r.nguon_gan.startsWith('de_xuat') ? 'AI đề xuất (chưa chắc)' : r.nguon_gan.endsWith(':ai') ? 'AI gán' : r.nguon_gan.endsWith(':nguoi') ? 'người gán' : r.nguon_gan.startsWith('gan_cum') ? 'gán theo cụm' : r.nguon_gan.startsWith('doi_ung') ? 'theo dạng cũ' : r.nguon_gan
  const chip = (c: string, t: string) => <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-semibold ${c}`}>{t}</span>
  return (
    <div className={`rounded-lg border bg-white p-3 shadow-sm ${r.la_goc ? 'border-slate-200' : 'ml-6 border-dashed border-slate-300'}`}>
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <code className="text-[11px] text-slate-400">{r.ma_cau}</code>
        {chip('bg-slate-100 text-slate-600', NHAN_LOAI[r.loai_cau] ?? r.loai_cau)}
        {!r.la_goc && chip('bg-slate-100 text-slate-500', 'bản sao')}
        {r.kho_chuan ? chip('bg-emerald-100 text-emerald-700', 'kho chuẩn') : r.da_duyet ? chip('bg-sky-100 text-sky-700', 'đã duyệt') : chip('bg-amber-100 text-amber-700', 'chưa duyệt')}
        {r.kiem_may === 'khop' && chip('bg-emerald-50 text-emerald-700', 'máy kiểm khớp')}
        {r.kiem_may === 'nghi' && chip('bg-rose-100 text-rose-700', 'máy nghi đáp số')}
        {r.kiem_may === 'khong_kiem_duoc' && chip('bg-slate-100 text-slate-500', 'máy không kiểm được')}
        {nguonGan && chip('bg-violet-50 text-violet-700', nguonGan)}
        {(nhom || r.nguon_gan.startsWith('de_xuat')) && r.dang_bai && <span className="text-[11px] text-violet-600">› <MathText>{r.dang_bai}</MathText></span>}
      </div>
      {r.ly_do && <div className="mb-1.5 rounded bg-amber-50 px-2 py-1 text-[12px] text-amber-800">{r.nguon_gan.startsWith('de_xuat') ? 'Lý do đề xuất' : r.nguon_gan === 'thieu_dang' ? 'Vì sao thiếu dạng' : 'Vì sao chưa khớp'}: {r.ly_do}</div>}
      <div className="text-[13.5px] leading-relaxed text-slate-900"><MathText>{r.noi_dung}</MathText></div>
      {r.anh_de && <img src={r.anh_de} alt="" className="mt-2 max-h-56 rounded border border-slate-200" />}
      {r.lua_chon && r.lua_chon.length > 0 && (
        <ul className="mt-1.5 grid grid-cols-1 gap-x-4 gap-y-0.5 text-[13px] text-slate-700 sm:grid-cols-2">
          {r.lua_chon.map((o, i) => <li key={i}><b className="mr-1 text-slate-500">{'ABCD'[i] ?? i + 1}.</b><MathText>{o}</MathText></li>)}
        </ul>
      )}
      {r.menh_de && r.menh_de.length > 0 && (
        <ul className="mt-1.5 space-y-0.5 text-[13px] text-slate-700">
          {r.menh_de.map((m, i) => <li key={i}><b className="mr-1 text-slate-500">{'abcd'[i] ?? i + 1})</b><MathText>{m.noi_dung ?? ''}</MathText> <span className={m.dap_an === 'D' ? 'font-semibold text-emerald-600' : 'font-semibold text-rose-600'}>[{m.dap_an === 'D' ? 'Đúng' : 'Sai'}]</span></li>)}
        </ul>
      )}
      {r.dap_an && <div className="mt-1.5 text-[12.5px] text-slate-600">Đáp án: <b className="text-emerald-700"><MathText>{r.dap_an}</MathText></b></div>}
      {r.loi_giai && (
        <details className="mt-1.5 text-[12.5px] text-slate-600">
          <summary className="cursor-pointer text-indigo-600">Lời giải</summary>
          <div className="mt-1 whitespace-pre-wrap leading-relaxed"><MathText>{r.loi_giai}</MathText></div>
          {r.anh_dap_an && <img src={r.anh_dap_an} alt="" className="mt-2 max-h-56 rounded border border-slate-200" />}
        </details>
      )}
    </div>
  )
}
