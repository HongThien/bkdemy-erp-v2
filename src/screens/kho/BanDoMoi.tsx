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
  getCay, themChuDe, suaChuDe, xoaChuDe, themChuyenDeVaoChuDe, suaChuyenDe, goO, xoaChuyenDe,
  themNhom, suaNhom, xoaNhom, themDangBai, suaDangBai, xoaDangBai, sapXep, chuyenNhom, chuyenDangBai, chuyenO,
  nangDangBai, haNhom, themTienDe, goTienDe, getLyThuyetNhom, getViDuDangBai, lyThuyetNhomApi, viDuDangBaiApi,
  type BdmCay, type BdmChuDe, type BdmO, type BdmNhom, type BdmDangBai,
} from '../../lib/kho/banDoMoi'
import type { LyThuyet } from '../../lib/kho/api'
import { LyThuyetModal } from './BanDo'
import { MathText, inp } from './ui'

// Nhớ chủ đề / chuyên đề đang xem — sống tới F5 (CLAUDE §2: rời màn quay lại đúng chỗ cũ)
const NHO: { chuDe: Record<string, string>; chuyenDe: Record<string, string> } = { chuDe: {}, chuyenDe: {} }

type Keo =
  | { loai: 'chu_de'; id: string }
  | { loai: 'o'; chuDeId: string; chuyenDeId: string }
  | { loai: 'nhom'; id: string; chuDeId: string; chuyenDeId: string }
  | { loai: 'dang_bai'; id: string; nhomId: string }
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

export default function BanDoMoi({ khoi }: { khoi: string }) {
  const [cay, setCay] = useState<BdmCay | null>(null)
  const [loiTai, setLoiTai] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [bao, setBao] = useState<string | null>(null)
  const [chuDeId, setChuDeId] = useState<string | null>(NHO.chuDe[khoi] ?? null)
  const [chuyenDeId, setChuyenDeId] = useState<string | null>(null)
  const [chon, setChon] = useState<Chon | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [dangKeo, setDangKeo] = useState<Keo['loai'] | null>(null)
  const [lt, setLt] = useState<{ loai: 'nhom' | 'dang_bai'; id: string; ten: string; current: LyThuyet } | null>(null)
  const keoRef = useRef<Keo | null>(null)
  const baoTimer = useRef<number | undefined>(undefined)

  // Đổi KHỐI = đổi ngữ cảnh ⇒ reset + tải lại
  useEffect(() => {
    let song = true
    setCay(null); setLoiTai(null); setChon(null); setChuDeId(NHO.chuDe[khoi] ?? null)
    getCay(khoi).then((c) => { if (song) setCay(c) }).catch((e) => { if (song) setLoiTai(String(e.message ?? e)) })
    return () => { song = false }
  }, [khoi])

  const chuDe = cay?.chu_de.find((c) => c.id === chuDeId) ?? cay?.chu_de[0] ?? null
  const o = chuDe ? (chuDe.o.find((x) => x.chuyen_de_id === (chuyenDeId ?? NHO.chuyenDe[chuDe.id])) ?? chuDe.o[0] ?? null) : null
  useEffect(() => { if (chuDe) NHO.chuDe[khoi] = chuDe.id }, [chuDe?.id, khoi]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (chuDe && o) NHO.chuyenDe[chuDe.id] = o.chuyen_de_id }, [chuDe?.id, o?.chuyen_de_id]) // eslint-disable-line react-hooks/exhaustive-deps
  const chonChuDe = (id: string) => { setChuDeId(id); setChuyenDeId(null); setChon(null) }
  const chonChuyenDe = (id: string) => { setChuyenDeId(id); setChon(null) }
  const buocChuyenDe = (d: -1 | 1) => {
    if (!chuDe || !o) return
    const i = chuDe.o.findIndex((x) => x.chuyen_de_id === o.chuyen_de_id) + d
    if (i >= 0 && i < chuDe.o.length) chonChuyenDe(chuDe.o[i].chuyen_de_id)
  }
  // Phím ← → chuyển chuyên đề (trừ khi đang gõ)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (dangGo(e.target) || lt) return
      if (e.key === 'ArrowLeft') buocChuyenDe(-1)
      if (e.key === 'ArrowRight') buocChuyenDe(1)
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  })

  const napLai = () => getCay(khoi).then(setCay).catch((e) => setLoi(String(e.message ?? e)))
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

  async function moLyThuyet(loai: 'nhom' | 'dang_bai', id: string, ten: string) {
    setLoi(null)
    try { setLt({ loai, id, ten, current: loai === 'nhom' ? await getLyThuyetNhom(id) : await getViDuDangBai(id) }) }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)) }
  }

  // Tiến độ soạn của khối — đếm thứ đang hiển thị (badge)
  const tienDo = useMemo(() => {
    let nhom = 0, nhomMoTa = 0, nhomLt = 0, db = 0, dbMoTa = 0, dbVd = 0
    for (const cd of cay?.chu_de ?? []) for (const x of cd.o) for (const n of x.nhom) {
      nhom++; if (n.mo_ta.trim()) nhomMoTa++; if (n.co_ly_thuyet) nhomLt++
      for (const d of n.dang_bai) { db++; if (d.mo_ta.trim()) dbMoTa++; if (d.co_vi_du) dbVd++ }
    }
    return { nhom, nhomMoTa, nhomLt, db, dbMoTa, dbVd }
  }, [cay])

  if (loiTai) return <div className="p-8 text-sm text-rose-600">Không tải được bản đồ mới: {loiTai}</div>
  if (!cay) return <div className="flex h-full items-center justify-center text-sm text-slate-400">Đang tải bản đồ mới…</div>

  const sang = (k: string) => (hover === k ? 'ring-2 ring-indigo-400 ring-offset-1' : '')

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Giải thích + tiến độ */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-amber-200 bg-amber-50 px-6 py-1.5 text-[12px] text-amber-900">
        <span className="font-semibold">🆕 Bản đồ mới — bản nháp khối {khoi}</span>
        <span className="text-amber-800/80">Chưa ảnh hưởng bản đồ đang chạy.</span>
        <span className="ml-auto flex gap-3">
          <span>Nhóm bài <b>{tienDo.nhom}</b> · mô tả {tienDo.nhomMoTa}/{tienDo.nhom} · lý thuyết {tienDo.nhomLt}/{tienDo.nhom}</span>
          <span>Dạng bài <b>{tienDo.db}</b> · mô tả {tienDo.dbMoTa}/{tienDo.db} · ví dụ {tienDo.dbVd}/{tienDo.db}</span>
        </span>
      </div>

      {/* Thanh CHỦ ĐỀ — mỗi màn 1 chủ đề */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 bg-white px-6 py-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Chủ đề</span>
        {cay.chu_de.map((cd, i) => (
          <button key={cd.id} draggable onDragStart={(e) => batDauKeo(e, { loai: 'chu_de', id: cd.id })} onDragEnd={ketThucKeo}
            {...vung(`cd:${cd.id}`, (k) => (k.loai === 'chu_de' && k.id !== cd.id) || (k.loai === 'o' && k.chuDeId !== cd.id), (k) => {
              if (k.loai === 'chu_de') return lam(() => sapXep('chu_de', chenTruoc(cay.chu_de.map((c) => c.id), k.id, cd.id)), 'Đã sắp lại chủ đề')
              if (k.loai === 'o') {
                const daCo = cd.o.some((x) => x.chuyen_de_id === k.chuyenDeId)
                if (daCo && !window.confirm(`Chủ đề «${cd.ten}» đã có chuyên đề này — dồn các nhóm bài vào chuyên đề sẵn có?`)) return
                return lam(() => chuyenO(k.chuDeId, k.chuyenDeId, cd.id), daCo ? 'Đã dồn vào chuyên đề sẵn có' : `Đã chuyển sang «${cd.ten}»`)
              }
            })}
            onClick={() => (chuDe?.id === cd.id ? setChon({ loai: 'chu_de' }) : chonChuDe(cd.id))}
            title={chuDe?.id === cd.id ? 'Bấm lần nữa để sửa / xoá chủ đề' : 'Mở chủ đề'}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${sang(`cd:${cd.id}`)} ${
              chuDe?.id === cd.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <span className="text-[11px] opacity-70">{i + 1}</span><MathText>{cd.ten}</MathText>
          </button>
        ))}
        <ThemNhanh nhan="+ Chủ đề" goiY="Tên chủ đề…" rong onThem={(ten) => lam(() => themChuDe(khoi, ten), 'Đã thêm chủ đề')} />
      </div>

      {!chuDe ? (
        <div className="flex flex-1 items-center justify-center text-[13px] text-slate-400">Khối {khoi} chưa có chủ đề nào — bấm «+ Chủ đề» để bắt đầu.</div>
      ) : (
        <>
          {/* Thanh CHUYÊN ĐỀ — trái→phải = thứ tự học */}
          <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-6 py-2">
            <button onClick={() => buocChuyenDe(-1)} title="Chuyên đề trước (←)" className="rounded-md px-2 py-1 text-slate-500 hover:bg-white hover:text-indigo-600">◀</button>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
              {chuDe.o.map((x) => (
                <button key={x.chuyen_de_id} draggable onDragStart={(e) => batDauKeo(e, { loai: 'o', chuDeId: chuDe.id, chuyenDeId: x.chuyen_de_id })} onDragEnd={ketThucKeo}
                  {...vung(`o:${x.chuyen_de_id}`, (k) => (k.loai === 'o' && k.chuDeId === chuDe.id && k.chuyenDeId !== x.chuyen_de_id) || (k.loai === 'nhom' && k.chuyenDeId !== x.chuyen_de_id), (k) => {
                    if (k.loai === 'o') return lam(() => sapXep('o', chenTruoc(chuDe.o.map((y) => y.chuyen_de_id), k.chuyenDeId, x.chuyen_de_id).map((c) => oKey(chuDe.id, c))), 'Đã sắp lại chuyên đề')
                    if (k.loai === 'nhom') return lam(() => chuyenNhom(k.id, chuDe.id, x.chuyen_de_id, null), `Đã chuyển nhóm sang «${x.ten}»`)
                  })}
                  onClick={() => chonChuyenDe(x.chuyen_de_id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12.5px] transition ${sang(`o:${x.chuyen_de_id}`)} ${
                    o?.chuyen_de_id === x.chuyen_de_id ? 'border-sky-500 bg-sky-600 font-semibold text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300'}`}>
                  <span className="text-[11px] opacity-70">{x.so}</span><MathText>{x.ten}</MathText>
                  {x.so_chu_de > 1 && <span title="Chuyên đề dùng chung nhiều chủ đề" className="text-[10px] opacity-70">⇆{x.so_chu_de}</span>}
                </button>
              ))}
            </div>
            <button onClick={() => buocChuyenDe(1)} title="Chuyên đề sau (→)" className="rounded-md px-2 py-1 text-slate-500 hover:bg-white hover:text-indigo-600">▶</button>
            <ThemChuyenDe cay={cay} cd={chuDe} onThem={(a) => lam(() => themChuyenDeVaoChuDe(chuDe.id, a), 'Đã thêm chuyên đề')} />
          </div>

          {loi && (
            <div className="flex items-start gap-2 border-b border-rose-200 bg-rose-50 px-6 py-2 text-[13px] text-rose-700">
              <span className="flex-1">⚠ {loi}</span>
              <button onClick={() => setLoi(null)} className="text-rose-400 hover:text-rose-700">✕</button>
            </div>
          )}

          <div className="flex min-h-0 flex-1">
            {!o ? (
              <div className="flex flex-1 items-center justify-center text-[13px] text-slate-400">Chủ đề chưa có chuyên đề — bấm «+ Chuyên đề» ở thanh trên.</div>
            ) : (
              <SoDoChuyenDe key={`${chuDe.id}|${o.chuyen_de_id}`} cd={chuDe} o={o} chon={chon} hover={hover} dangKeo={dangKeo} sang={sang}
                batDauKeo={batDauKeo} ketThucKeo={ketThucKeo} vung={vung} onChon={setChon} onChonChuDe={chonChuDe} lam={lam} />
            )}

            {chon && o && (
              <ChiTiet chon={chon} cay={cay} cd={chuDe} o={o} khoi={khoi} onDong={() => setChon(null)}
                lam={lam} moLyThuyet={moLyThuyet} onDaXoa={() => setChon(null)} />
            )}
          </div>
        </>
      )}

      {bao && <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-[13px] font-medium text-white shadow-lg">✓ {bao}</div>}

      {lt && (
        <LyThuyetModal ma={lt.id} ten={`${lt.loai === 'nhom' ? 'Lý thuyết' : 'Ví dụ'} — ${lt.ten}`} current={lt.current}
          api={lt.loai === 'nhom' ? lyThuyetNhomApi : viDuDangBaiApi}
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
          className={`w-[360px] cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm ${dangChon({ loai: 'o' }) ? 'border-amber-400 ring-2 ring-amber-300' : 'border-sky-200 hover:border-sky-400'}`}>
          <div className="flex items-center gap-2 bg-sky-600 px-4 py-2 text-white">
            <span className="rounded bg-white/25 px-1.5 text-[11px] font-bold">{o.so}</span>
            <span className="flex-1 text-[14px] font-semibold"><MathText>{o.ten}</MathText></span>
            <span className="text-[11px] opacity-80">{o.nhom.length} nhóm</span>
          </div>
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
                  batDauKeo={p.batDauKeo} ketThucKeo={p.ketThucKeo} vung={vung} onChon={p.onChon} lam={lam} />
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
}) {
  const { n, cd, o, sang, vung, lam } = p
  const cungO = (k: Keo) => k.loai === 'nhom' && k.chuDeId === cd.id && k.chuyenDeId === o.chuyen_de_id && k.id !== n.id
  return (
    <div ref={p.refHop} data-hop draggable onDragStart={(e) => p.batDauKeo(e, { loai: 'nhom', id: n.id, chuDeId: cd.id, chuyenDeId: o.chuyen_de_id })} onDragEnd={p.ketThucKeo}
      {...vung(`n:${n.id}`, (k) => cungO(k) || (k.loai === 'dang_bai' && k.nhomId !== n.id), (k) => {
        if (k.loai === 'nhom') return lam(() => sapXep('nhom', chenTruoc(o.nhom.map((x) => x.id).sort((a, b) => (o.nhom.find((y) => y.id === a)!.thu_tu - o.nhom.find((y) => y.id === b)!.thu_tu)), k.id, n.id)), 'Đã đổi thứ tự (đặt bên trái)')
        if (k.loai === 'dang_bai') return lam(() => chuyenDangBai(k.id, n.id, null), 'Đã chuyển dạng bài')
      })}
      onClick={() => p.onChon({ loai: 'nhom', id: n.id })}
      className={`cursor-grab overflow-hidden rounded-xl border bg-white shadow-sm active:cursor-grabbing ${sang(`n:${n.id}`)} ${p.chon ? 'border-amber-400 ring-2 ring-amber-300' : 'border-slate-200 hover:border-indigo-300'}`}>
      <div className="flex items-start gap-2 bg-slate-700 px-3 py-2 text-white">
        <span className="mt-px rounded bg-white/20 px-1.5 text-[11px] font-bold">{n.so}</span>
        <span className="flex-1 text-[13px] font-semibold leading-snug"><MathText>{n.ten}</MathText></span>
        <DauTienDo moTa={!!n.mo_ta.trim()} noiDung={n.co_ly_thuyet} nhanNoiDung="lý thuyết" />
      </div>
      <div className="flex flex-col gap-1.5 p-2.5">
        {n.tien_de.length > 0 && (
          <div className="text-[10.5px] text-slate-400">Học sau: {n.tien_de.map((t) => `#${p.soCuaNhom.get(t) ?? '?'}`).join(', ')}</div>
        )}
        {n.dang_bai.map((d) => (
          <CardDangBai key={d.id} n={n} d={d} chon={p.chonDangBai === d.id} sang={sang}
            batDauKeo={p.batDauKeo} ketThucKeo={p.ketThucKeo} vung={vung} onChon={p.onChon} lam={lam} />
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
}) {
  const { n, d, sang, vung, lam } = p
  return (
    <div draggable onDragStart={(e) => p.batDauKeo(e, { loai: 'dang_bai', id: d.id, nhomId: n.id })} onDragEnd={p.ketThucKeo}
      {...vung(`d:${d.id}`, (k) => k.loai === 'dang_bai' && k.id !== d.id, (k) => {
        if (k.loai !== 'dang_bai') return
        const ids = chenTruoc(n.dang_bai.map((x) => x.id), k.id, d.id)
        return lam(() => (k.nhomId === n.id ? sapXep('dang_bai', ids) : chuyenDangBai(k.id, n.id, ids)), k.nhomId === n.id ? 'Đã đổi thứ tự' : 'Đã chuyển dạng bài')
      })}
      onClick={(e) => { e.stopPropagation(); p.onChon({ loai: 'dang_bai', id: d.id }) }}
      className={`flex cursor-grab items-start gap-1.5 rounded-lg border px-2 py-1.5 text-[12px] active:cursor-grabbing ${sang(`d:${d.id}`)} ${
        p.chon ? 'border-amber-400 bg-amber-50' : 'border-violet-200 bg-violet-50 hover:border-violet-400'}`}>
      <span className="mt-px shrink-0 text-[10.5px] font-bold text-violet-500">{n.so}.{d.so}</span>
      <span className="flex-1 leading-snug text-violet-950"><MathText>{d.ten}</MathText></span>
      <DauTienDo moTa={!!d.mo_ta.trim()} noiDung={d.co_vi_du} nhanNoiDung="ví dụ" />
    </div>
  )
}

// Chấm tiến độ: mô tả · lý thuyết/ví dụ — xám = chưa có
function DauTienDo({ moTa, noiDung, nhanNoiDung }: { moTa: boolean; noiDung: boolean; nhanNoiDung: string }) {
  return (
    <span className="flex shrink-0 gap-0.5 pt-1">
      <span title={moTa ? 'Đã có mô tả' : 'Chưa có mô tả'} className={`h-2 w-2 rounded-full ${moTa ? 'bg-emerald-400' : 'bg-slate-300'}`} />
      <span title={noiDung ? `Đã có ${nhanNoiDung}` : `Chưa có ${nhanNoiDung}`} className={`h-2 w-2 rounded-full ${noiDung ? 'bg-sky-400' : 'bg-slate-300'}`} />
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
        <div className="absolute right-0 top-full z-30 mt-1 w-80 rounded-lg border border-sky-300 bg-white p-2 shadow-lg">
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
  chon: Chon; cay: BdmCay; cd: BdmChuDe; o: BdmO; khoi: string; onDong: () => void
  lam: (viec: () => Promise<unknown>, xong?: string) => Promise<void>
  moLyThuyet: (loai: 'nhom' | 'dang_bai', id: string, ten: string) => void
  onDaXoa: () => void
}) {
  const { chon, cay, cd, o, lam } = p
  const khung = (tieuDe: string, mau: string, noiDung: ReactNode) => (
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
      <div className="text-[11.5px] text-slate-400">Kéo các nút chủ đề trên thanh để đổi thứ tự.</div>
      <NutXoa nhan="Xoá chủ đề" moTa="Chỉ xoá được khi chủ đề không còn chuyên đề nào."
        onXoa={() => { if (window.confirm(`Xoá chủ đề «${cd.ten}»?`)) void lam(() => xoaChuDe(cd.id), 'Đã xoá').then(p.onDaXoa) }} />
    </>)
  }

  if (chon.loai === 'o') {
    return khung('Chuyên đề (dùng chung)', 'bg-sky-600', <>
      <TruongTen key={o.chuyen_de_id} gt={o.ten} onLuu={(t2) => lam(() => suaChuyenDe(o.chuyen_de_id, { ten: t2 }))} />
      {o.so_chu_de > 1 && <div className="rounded-md bg-sky-50 px-2.5 py-1.5 text-[12px] text-sky-800">Chuyên đề này có mặt ở <b>{o.so_chu_de} chủ đề</b> — đổi tên/mô tả áp cho tất cả.</div>}
      <TruongMoTa key={`mt-${o.chuyen_de_id}`} gt={o.mo_ta} goiY="Mô tả chuyên đề (tuỳ chọn)…" onLuu={(m) => lam(() => suaChuyenDe(o.chuyen_de_id, { mo_ta: m }))} />
      <div className="text-[12px] text-slate-500">Trong chủ đề <b><MathText>{cd.ten}</MathText></b>: thứ {o.so} · {o.nhom.length} nhóm bài · mã nháp <code>{o.chuyen_de_id}</code></div>
      <ChonDich nhan="⇄ Chuyển sang chủ đề khác" moTa="Chuyển cả chuyên đề cùng các nhóm bài. Chủ đề đích đã có chuyên đề này thì dồn vào."
        lua={cay.chu_de.filter((c) => c.id !== cd.id).map((c) => ({ id: c.id, nhan: c.ten }))}
        onChon={(id) => void lam(() => chuyenO(cd.id, o.chuyen_de_id, id), 'Đã chuyển chuyên đề').then(p.onDaXoa)} />
      <NutXoa nhan="Gỡ khỏi chủ đề này" moTa="Chỉ gỡ được khi chuyên đề không còn nhóm bài nào trong chủ đề này. Chuyên đề vẫn còn ở các chủ đề khác."
        onXoa={() => void lam(() => goO(cd.id, o.chuyen_de_id), 'Đã gỡ').then(p.onDaXoa)} />
      {o.so_chu_de <= 1 && (
        <NutXoa nhan="Gỡ và xoá hẳn chuyên đề" moTa="Chuyên đề chỉ có ở chủ đề này — gỡ rồi xoá luôn khỏi danh mục."
          onXoa={() => { if (window.confirm(`Xoá chuyên đề «${o.ten}»?`)) void lam(async () => { await goO(cd.id, o.chuyen_de_id); await xoaChuyenDe(o.chuyen_de_id) }, 'Đã xoá').then(p.onDaXoa) }} />
      )}
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
      <NutXoa nhan="Xoá nhóm bài" moTa="Chỉ xoá được khi không còn dạng bài bên trong. Lý thuyết, mô tả và mũi tên của nhóm mất theo."
        onXoa={() => { if (window.confirm(`Xoá nhóm bài «${n.ten}»?`)) void lam(() => xoaNhom(n.id), 'Đã xoá').then(p.onDaXoa) }} />
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
    <button onClick={() => p.moLyThuyet('dang_bai', d.id, d.ten)}
      className="flex items-center justify-between rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-[13px] font-semibold text-violet-700 hover:bg-violet-100">
      <span>📝 Ví dụ</span><span className="text-[11.5px] font-normal">{d.co_vi_du ? 'đã có — bấm để sửa' : 'chưa có — bấm để dán'}</span>
    </button>
    <ChonDich nhan="⇄ Chuyển sang nhóm khác" moTa="Hoặc kéo card thả vào box nhóm khác (cùng chuyên đề)."
      lua={moiO.flatMap((x) => x.o.nhom.filter((y) => y.id !== n.id).map((y) => ({ id: y.id, nhan: `${x.cd.ten} › ${x.o.ten} › #${y.so} ${y.ten}` })))}
      onChon={(id) => void lam(() => chuyenDangBai(d.id, id, null), 'Đã chuyển dạng bài').then(p.onDaXoa)} />
    <button onClick={() => { if (window.confirm(`Nâng «${d.ten}» thành nhóm bài (cùng chuyên đề «${o.ten}», thành nhánh mới)? Ví dụ sẽ thành lý thuyết của nhóm mới.`)) void lam(() => nangDangBai(d.id, cd.id, o.chuyen_de_id), 'Đã nâng thành nhóm bài').then(p.onDaXoa) }}
      className="rounded-md border border-slate-200 px-3 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-700">
      ⬆ Nâng thành nhóm bài <span className="font-normal text-slate-400">(nhánh mới trong cùng chuyên đề)</span>
    </button>
    <NutXoa nhan="Xoá dạng bài" moTa="Ví dụ và mô tả mất theo."
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
  return <ChonDich nhan="⬇ Hạ thành dạng bài của nhóm khác" moTa="Lý thuyết của nhóm sẽ thành ví dụ của dạng bài. (Nhóm khác đang trỏ mũi tên vào nhóm này thì DB chặn — gỡ trước.)"
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
