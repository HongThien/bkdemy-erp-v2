// Giáo trình HÌNH — độc lập giáo trình Đại (bảng hinh_giao_trinh/hinh_gt_buoi/hinh_gt_bai riêng, KHÔNG
// gộp chung — Thùy chốt 08-08). Chỉ GIỐNG NHAU về khuôn thao tác (TaiLieuBuilder/TrichPanel Đại):
//   Master — cây Buổi TẠI CHỖ: "+ Thêm buổi" → nội dung sửa ngay trong thẻ buổi (BuoiPickEditor, tự
//   động lưu — không còn "dựng ở Soạn tài liệu rồi Lưu popup" như trước 08-08).
//   Gán lớp (TrichPanelHinh) — khuôn TrichPanel: chọn lớp → list buổi + trạng thái đã gán, ngày GỢI Ý
//   theo TKB (buổi trống gần nhất), sổ riêng giáo trình của lớp (đánh số theo NGÀY HỌC, khác số master).
//   Khác Đại: 1 buổi Hình gán = CẢ Trên lớp + Về nhà 1 lượt (không tách GT/BTVN — Hình không có khái
//   niệm "ôn tập tự sinh cần duyệt riêng" như OnTapConfirmScreen của Đại, nội dung buổi tác giả tự chọn
//   đủ ngay lúc soạn) — nên không có bước "+ BTVN / Ôn tập" riêng.
// In: bài buổi (chuan/bienthe/y/ghep) → BanIn → HinhPrintView (2 phiếu: Trên lớp / Về nhà).
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import * as gt from '../../../lib/kho/hinhGiaoTrinh'
import type { GiaoTrinh, GtBuoi, GtBai, TrichStateHinh } from '../../../lib/kho/hinhGiaoTrinh'
import type { Luoi } from '../../../lib/kho/hinh'
import type { PickItem } from '../../../store/useStore'
import { listLop, type Lop } from '../../../lib/nhansu'
import { ngayBuoiHopLeCuaLop } from '../../../lib/gami'
import { homNayVN, congNgay, ddmmVN, thuCuaNgay } from '../../../lib/tuan'
import { Btn, Empty, Ma, Seg, tron, inpCls } from './hinhUi'
import { Shell, Field, inp } from '../ui'
import SearchSelect from '../../../components/SearchSelect'
import BuoiNgaySelect from '../../../components/BuoiNgaySelect'
import HinhPrintView, { type BanIn, type MucIn } from './HinhPrintView'
import { mucGhep, mucGhepLua, mucBienThe, mucY, BuoiPickEditor, banInTheoMoHinh } from './SoanTaiLieu'

// Ngày giờ VN (CLAUDE.md §2: không toISOString) — hiển thị "dd/mm/yyyy". Khuôn TaiLieuScreen (Đại).
function fmtNgay(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ── Resolve bài ĐÃ LƯU của một buổi (master hoặc bản lớp) → BanIn cho 1 phiếu (lop/nha). Dùng CHUNG
// resolver với builder sống (mucGhep/mucGhepLua/mucBienThe/mucY) — 1 nguồn, hết lệch preview↔bản lưu. ──
export async function resolveBanIn(L: Luoi, tieuBuoi: string, bais: GtBai[], phan: 'lop' | 'nha'): Promise<BanIn> {
  const list = bais.filter((b) => b.phan === phan).sort((a, b) => a.thu_tu - b.thu_tu)
  const [btMap, yMap] = await Promise.all([
    gt.getBienTheByIds(list.filter((b) => b.loai === 'bienthe').map((b) => b.ref_id!).filter(Boolean)),
    gt.getYFull(list.filter((b) => b.loai === 'y').map((b) => b.ref_id!).filter(Boolean)),
  ])
  const dong = (b: GtBai) => (phan === 'nha' ? (b.so_dong ?? 6) : (b.so_dong ?? 0))   // BTVN mặc định 6; trên lớp không kẻ dòng
  const seenGhep = new Set<string>()   // khử bài ghép trùng (cùng bản + cùng bộ node)
  const mucs: MucIn[] = []
  for (const b of list) {
    if (b.loai === 'chuan') {
      const node = L.baiToan.find((x) => x.id === b.ref_id); if (!node) continue
      mucs.push(mucGhep(L, { key: b.id, phan: b.phan, kind: 'ghep', luaId: null, nodeIds: [node.id] }, b.an_de, dong(b)))
    } else if (b.loai === 'bienthe') {
      const v = btMap.get(b.ref_id!); if (!v) continue
      mucs.push(mucBienThe(L, v, b.an_de, dong(b)))
    } else if (b.loai === 'y') {
      const yb = yMap.get(b.ref_id!); if (!yb) continue
      mucs.push(mucY(L, yb, b.an_de, dong(b)))
    } else if (b.loai === 'ghep') {
      const sig = `${b.lua_id ?? 'chuan'}|${[...b.ghep_node_ids].sort().join(',')}`; if (seenGhep.has(sig)) continue; seenGhep.add(sig)
      if (b.lua_id) { const vs = await api.bienTheCuaLua(b.lua_id); mucs.push(mucGhepLua(L, b.ghep_node_ids, vs, b.an_de, dong(b))) }
      else mucs.push(mucGhep(L, { key: b.id, phan: b.phan, kind: 'ghep', luaId: b.lua_id, nodeIds: b.ghep_node_ids }, b.an_de, dong(b)))
    }
  }
  return { tieuDe: `${tieuBuoi} — ${phan === 'lop' ? 'Trên lớp' : 'Về nhà (BTVN)'}`, phuDe: `${mucs.length} mục`, mucs }
}

export default function GiaoTrinhScreen({ L, khoi }: { L: Luoi; khoi: string }) {
  const [tab, setTab] = useState<'master' | 'lop'>('master')
  const [inBan, setInBan] = useState<BanIn | null>(null)
  // Bản ĐÃ LƯU (snapshot lớp / xem nhanh từ id buổi) — TheoLop dùng đường này.
  const inBuoi = useCallback(async (tieu: string, buoiId: string, phan: 'lop' | 'nha') => {
    try { setInBan(await resolveBanIn(L, tieu, await gt.listGtBai(buoiId), phan)) } catch (e: any) { alert(e.message ?? String(e)) }
  }, [L])
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Giáo trình <span className="text-slate-400">· Khối {khoi}</span></h1>
        <Seg value={tab} onChange={setTab} options={[{ v: 'master', label: '▤ Master — soạn' }, { v: 'lop', label: '◷ Theo lớp — đã gán' }]} />
      </div>
      {tab === 'master' ? <Master L={L} khoi={khoi} onPreview={setInBan} /> : <TheoLop khoi={khoi} onIn={inBuoi} />}
      {inBan && <HinhPrintView ban={inBan} onClose={() => setInBan(null)} />}
    </>
  )
}

// ══════════════ MASTER — THƯ VIỆN dạng thẻ + modal Tạo (khuôn TaiLieuScreen Đại, ĐÚNG Y — Thùy chốt
// "sao không làm giống Đại"). Mở 1 giáo trình = ĐIỀU HƯỚNG FULL-SCREEN vào GiaoTrinhBuilderHinh (không
// còn split-pane sidebar+panel như bản trước — khuôn TaiLieuScreen: card "Mở/Xuất" → TaiLieuBuilder). ══
function Master({ L, khoi, onPreview }: { L: Luoi; khoi: string; onPreview: (ban: BanIn) => void }) {
  const [gts, setGts] = useState<GiaoTrinh[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'moi' | 'ten'>('moi')
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)   // giáo trình đang MỞ (builder full-screen)

  const nap = useCallback(async () => { setLoading(true); try { setGts(await gt.listGiaoTrinh(khoi)) } finally { setLoading(false) } }, [khoi])
  useEffect(() => { nap() }, [nap])

  const shown = gts
    .filter((g) => !q.trim() || g.ten.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => sort === 'ten' ? a.ten.localeCompare(b.ten, 'vi') : (b.created_at ?? '').localeCompare(a.created_at ?? ''))

  if (openId) return <GiaoTrinhBuilderHinh L={L} khoi={khoi} giaoTrinhId={openId} onClose={() => setOpenId(null)} onPreview={onPreview} />

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên…" className="h-7 w-44 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
        <button onClick={() => setSort(sort === 'moi' ? 'ten' : 'moi')} className="h-7 rounded-md border border-slate-200 px-2.5 text-[12px] font-medium text-slate-500 hover:bg-slate-100">{sort === 'moi' ? '↓ Mới nhất' : 'A→Z Tên'}</button>
        <button onClick={() => setCreating(true)} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo giáo trình</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : shown.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
              {q.trim() ? <>Không có giáo trình khớp "{q}".</> : <>Chưa có giáo trình Hình khối {khoi}. Bấm <b className="text-slate-600">+ Tạo giáo trình</b>.</>}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {shown.map((g) => (
                <div key={g.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-[16px] font-semibold text-slate-900">{g.ten}</div>
                  <div className="mt-1 text-[12px] text-slate-400">Khối {g.khoi}</div>
                  <div className="mt-1 text-[11px] text-slate-400">Tạo {fmtNgay(g.created_at)}{g.updated_at && g.updated_at !== g.created_at ? ` · sửa ${fmtNgay(g.updated_at)}` : ''}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setOpenId(g.id)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500">Mở / Xuất</button>
                    <button onClick={async () => { if (confirm(`Xoá giáo trình "${g.ten}" và mọi buổi?`)) { await gt.deleteGiaoTrinh(g.id); nap() } }} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      {creating && <CreateGiaoTrinhHinhModal khoi={khoi} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); nap(); setOpenId(id) }} />}
    </div>
  )
}

function CreateGiaoTrinhHinhModal({ khoi, onClose, onCreated }: { khoi: string; onClose: () => void; onCreated: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function create() {
    if (!ten.trim()) return
    setBusy(true); setError(null)
    try { const g = await gt.createGiaoTrinh({ ten: ten.trim(), khoi }); onCreated(g.id) }
    catch (e: any) { setError(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Shell title={`Tạo giáo trình Hình · Khối ${khoi}`} onClose={onClose}>
      <Field label="Tên giáo trình"><input value={ten} onChange={(e) => setTen(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && create()} className={inp} placeholder="vd: Tam giác đồng dạng" autoFocus /></Field>
      <div className="mb-3 text-[11px] text-slate-400">Tạo xong vào Builder → bấm <b>+ Thêm buổi</b>.</div>
      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button onClick={create} disabled={!ten.trim() || busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo'}</button>
      </div>
    </Shell>
  )
}

// ── Builder FULL-SCREEN của 1 giáo trình (khuôn TaiLieuBuilder: "← Thư viện" + tên sửa tại chỗ + cây
// buổi + "⬇ Trích xuất/Gán lớp"). Vào từ card "Mở/Xuất" ở thư viện — KHÔNG còn split-pane. ──
function GiaoTrinhBuilderHinh({ L, khoi, giaoTrinhId, onClose, onPreview }: {
  L: Luoi; khoi: string; giaoTrinhId: string; onClose: () => void; onPreview: (ban: BanIn) => void
}) {
  const [g, setG] = useState<GiaoTrinh | null>(null)
  const [ten, setTen] = useState('')
  const [buois, setBuois] = useState<GtBuoi[]>([])
  const [trichOpen, setTrichOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1500) }

  const nap = useCallback(async () => {
    const [all, bs] = await Promise.all([gt.listGiaoTrinh(khoi), gt.listBuoiMaster(giaoTrinhId)])
    const found = all.find((x) => x.id === giaoTrinhId) ?? null
    setG(found); if (found) setTen(found.ten); setBuois(bs)
  }, [khoi, giaoTrinhId])
  useEffect(() => { nap() }, [nap])

  async function saveTen() {
    if (!g || !ten.trim() || ten.trim() === g.ten) return
    await gt.updateGiaoTrinh(g.id, { ten: ten.trim() })
    setG({ ...g, ten: ten.trim() }); markSaved()
  }
  async function themBuoi() {
    await gt.createBuoiMaster(giaoTrinhId, { thu_tu: buois.length })
    await nap()
  }

  if (!g) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-3 border-b border-slate-200 pb-3">
        <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Thư viện</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen}
          className="h-9 max-w-[420px] flex-1 rounded-md border border-transparent bg-transparent px-1.5 text-[16px] font-semibold text-slate-900 outline-none hover:border-slate-200 focus:border-indigo-400 focus:bg-white" />
        <span className="text-[12px] text-slate-400">Khối {khoi}</span>
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${saved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{saved ? '✓ Đã lưu' : '↻ Tự động lưu'}</span>
        <Btn className="ml-auto border-violet-300 text-violet-700" onClick={() => setTrichOpen(true)}>⬇ Trích xuất / Gán lớp</Btn>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-[860px] space-y-2 pb-6">
          {buois.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-[13px] text-slate-400">Chưa có buổi nào. Bấm "+ Thêm buổi" để bắt đầu.</div>}
          {buois.map((b, i) => (
            <BuoiCardHinh key={b.id} L={L} buoi={b} no={i + 1} onDeleted={nap} onPreview={onPreview} />
          ))}
          <button onClick={themBuoi} className="w-full rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 py-3 text-[14px] font-medium text-indigo-700 transition hover:bg-indigo-50">+ Thêm buổi</button>
        </div>
      </div>
      {trichOpen && <TrichPanelHinh khoi={khoi} buois={buois} onClose={() => setTrichOpen(false)} />}
    </div>
  )
}

// ── 1 BUỔI master: gấp gọn (tiêu đề + đếm bài + xem/xoá) · mở ra = BuoiPickEditor TẠI CHỖ, tự lưu ──
function BuoiCardHinh({ L, buoi, no, onDeleted, onPreview }: {
  L: Luoi; buoi: GtBuoi; no: number; onDeleted: () => void; onPreview: (ban: BanIn) => void
}) {
  const [open, setOpen] = useState(false)
  const [dem, setDem] = useState<{ lop: number; nha: number } | null>(null)
  const [nhap, setNhap] = useState<{ picks: PickItem[]; anDe: string[]; soDong: Record<string, number> } | null>(null)
  const [tieuDe, setTieuDe] = useState(buoi.tieu_de ?? '')
  const [saved, setSaved] = useState(false)
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1500) }

  const napDem = useCallback(() => { gt.listGtBai(buoi.id).then((bais) => setDem({ lop: bais.filter((b) => b.phan === 'lop').length, nha: bais.filter((b) => b.phan === 'nha').length })) }, [buoi.id])
  useEffect(() => { napDem() }, [napDem])
  useEffect(() => { if (open && !nhap) gt.loadBuoiPicks(buoi.id).then(setNhap) }, [open, buoi.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function saveNow(patch: Partial<{ picks: PickItem[]; anDe: string[]; soDong: Record<string, number> }>) {
    if (!nhap) return
    const next = { ...nhap, ...patch }
    setNhap(next)
    setDem({ lop: next.picks.filter((p) => p.phan === 'lop').length, nha: next.picks.filter((p) => p.phan === 'nha').length })
    await gt.saveBuoiSelection(buoi.id, next)
    markSaved()
  }
  async function saveTen() {
    const v = tieuDe.trim()
    if (v === (buoi.tieu_de ?? '')) return
    await gt.updateBuoi(buoi.id, { tieu_de: v || null })
    buoi.tieu_de = v || null   // đồng bộ local (mảng `buois` ở Master chỉ reload khi xoá/thêm)
    markSaved()
  }
  async function xoa() {
    if (!confirm('Xoá cả buổi này (kể cả bài Trên lớp + Về nhà)?')) return
    await gt.deleteBuoi(buoi.id)
    onDeleted()
  }
  async function xem(phan: 'lop' | 'nha') {
    const n = nhap ?? await gt.loadBuoiPicks(buoi.id)
    if (!nhap) setNhap(n)
    onPreview(await banInTheoMoHinh(tieuDe || `Buổi ${no}`, phan, n.picks, L, n.anDe, n.soDong))
  }

  return (
    <div className="mb-2 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 rounded-t-xl border-b border-slate-100 bg-indigo-50/50 px-4 py-2.5">
        <button onClick={() => setOpen((v) => !v)} className="shrink-0 text-[12px] text-indigo-500">{open ? '▾' : '▸'}</button>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-[11.5px] font-bold text-white">{no}</span>
        <input value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} onBlur={saveTen}
          placeholder={`Buổi ${no}`}
          className="w-[220px] rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[14px] font-bold text-indigo-800 outline-none hover:border-slate-200 focus:border-indigo-400 focus:bg-white" />
        {dem && <span className="text-[11.5px] text-slate-400">📘 {dem.lop} · 📝 {dem.nha}</span>}
        <span className={`rounded-md px-1.5 py-0.5 text-[10.5px] font-medium transition ${saved ? 'bg-emerald-50 text-emerald-700' : 'text-slate-300'}`}>{saved ? '✓ Đã lưu' : '↻ Tự động lưu'}</span>
        <div className="ml-auto flex gap-1.5">
          <Btn className="h-7 px-2 text-[12px]" onClick={() => xem('lop')}>📘 Xem</Btn>
          <Btn className="h-7 px-2 text-[12px]" onClick={() => xem('nha')}>📝 Xem</Btn>
          <button onClick={xoa} title="Xoá buổi" className="rounded border border-slate-200 px-1.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">✕</button>
        </div>
      </div>
      {open && (
        <div className="p-3">
          {!nhap ? <div className="p-4 text-[12.5px] text-slate-400">Đang tải…</div> : (
            <BuoiPickEditor L={L} picks={nhap.picks} anDe={nhap.anDe} soDong={nhap.soDong}
              onChangePicks={(picks) => saveNow({ picks })} onChangeAnDe={(anDe) => saveNow({ anDe })} onChangeSoDong={(soDong) => saveNow({ soDong })} />
          )}
        </div>
      )}
    </div>
  )
}

// ══════════════ GÁN LỚP — khuôn TrichPanel Đại (TKB-gợi-ý ngày + sổ riêng lớp) ══════════════
// Khác Đại: KHÔNG tách GT/BTVN (1 buổi Hình = Trên lớp + Về nhà gán CHUNG 1 lượt, tác giả tự chọn đủ nội
// dung lúc soạn — không có luồng "ôn tập tự sinh cần duyệt riêng" như OnTapConfirmScreen).
function TrichPanelHinh({ khoi, buois, onClose }: { khoi: string; buois: GtBuoi[]; onClose: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [state, setState] = useState<Record<string, TrichStateHinh>>({})
  const [boLop, setBoLop] = useState<GtBuoi[]>([])
  const [tkbDates, setTkbDates] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => { listLop().then(setLops).catch(() => { }) }, [])
  const lop = lops.find((l) => l.id === lopId)
  const buoiIds = useMemo(() => buois.map((b) => b.id), [buois])

  const loadState = useCallback(async (id: string) => {
    setLoading(true)
    const today = homNayVN()
    try {
      const [st, bo, tkb] = await Promise.all([
        gt.listTrichXuatHinh(id, buoiIds), gt.listBuoiLop(id),
        ngayBuoiHopLeCuaLop(id, congNgay(today, -60), congNgay(today, 90)).catch(() => [] as { ngay: string }[]),
      ])
      setState(st); setBoLop(bo); setTkbDates(tkb.map((o) => o.ngay))
    } finally { setLoading(false) }
  }, [buoiIds])
  useEffect(() => { if (lopId) loadState(lopId); else { setState({}); setBoLop([]) } }, [lopId]) // eslint-disable-line

  async function gan(masterBuoiId: string, ngay: string) {
    if (!lop) return
    await gt.ganLopSnapshot(masterBuoiId, lop.id, ngay)
    await loadState(lop.id)
  }
  async function danhSoLai() {
    if (!lop) return
    if (!confirm(`Đánh số lại ${boLop.length} buổi Hình của lớp ${lop.ten_lop} theo thứ tự NGÀY HỌC?`)) return
    setLoading(true)
    try { await gt.renumberBuoiLop(lop.id) } finally { setLoading(false) }
    await loadState(lop.id)
  }

  const soBuoiMaster = new Map(buois.map((b, i) => [b.id, i + 1]))
  // Ngày gán MẶC ĐỊNH = buổi trống gần nhất (khuôn TrichPanel Đại — 1 ngày, mọi dòng chưa-gán hiện CÙNG
  // ngày đó; gán xong 1 buổi → ngày đó vào "đã gán", mặc định tự lùi buổi trống kế tiếp).
  const daGan = new Set(boLop.map((b) => b.ngay).filter((x): x is string => !!x))
  const ngayTrong = tkbDates.filter((d) => !daGan.has(d))
  const today = homNayVN()
  const ngayMacDinh = ngayTrong.find((d) => d >= today) ?? ngayTrong[ngayTrong.length - 1] ?? ''

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Gán giáo trình Hình cho lớp</h3>
          <div className="w-56"><SearchSelect value={lopId} onChange={setLopId} placeholder="chọn lớp…"
            options={lops.filter((l) => !khoi || l.khoi === khoi).map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} /></div>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        {!lop ? <p className="p-8 text-center text-sm text-slate-400">Chọn lớp để xem bộ giáo trình Hình riêng của lớp + gán tiếp buổi mới.</p>
          : loading ? <p className="p-8 text-sm text-slate-400">Đang tải trạng thái…</p>
          : (
            <div className="grid min-h-0 flex-1 grid-cols-[1fr_320px] grid-rows-[minmax(0,1fr)] overflow-hidden">
              <div className="min-h-0 overflow-auto p-5">
                <p className="mb-2 text-[12px] text-slate-400">Mỗi buổi của giáo trình gốc → gán cho 1 ngày của lớp <b>{lop.ten_lop}</b>. Không cần gán đủ, không cần đúng thứ tự.</p>
                <div className="space-y-2">
                  {buois.map((b, i) => <BuoiTrichRowHinh key={b.id} no={i + 1} sttLop={boLop.find((x) => x.nguon_buoi_id === b.id)?.stt_lop ?? undefined}
                    lopId={lopId} buoi={b} st={state[b.id]} defaultNgay={state[b.id] ? undefined : ngayMacDinh}
                    onGan={(ngay) => gan(b.id, ngay)} />)}
                </div>
              </div>
              <BoGiaoTrinhLopHinh tenLop={lop.ten_lop} bo={boLop} soBuoiMaster={soBuoiMaster} onDanhSoLai={danhSoLai} />
            </div>
          )}
      </div>
    </div>
  )
}

function BoGiaoTrinhLopHinh({ tenLop, bo, soBuoiMaster, onDanhSoLai }: { tenLop: string; bo: GtBuoi[]; soBuoiMaster: Map<string, number>; onDanhSoLai: () => void }) {
  return (
    <aside className="min-h-0 overflow-auto border-l border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[13px] font-bold text-slate-800">📚 Giáo trình Hình riêng của {tenLop}</span>
        {bo.length > 0 && <button onClick={onDanhSoLai} title="Đánh số lại các buổi đã gán theo thứ tự ngày học của lớp" className="ml-auto shrink-0 rounded-md border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600">↻ Đánh số lại</button>}
      </div>
      <p className="mb-3 text-[11px] text-slate-400">Số buổi ở đây là số <b>của lớp</b> (theo ngày học), không phải số buổi giáo trình gốc.</p>
      {bo.length === 0
        ? <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-[12px] italic text-slate-400">Lớp chưa được gán buổi Hình nào.</div>
        : (
          <ol className="space-y-1.5">
            {bo.map((b) => {
              const goc = b.nguon_buoi_id ? soBuoiMaster.get(b.nguon_buoi_id) : undefined
              return (
                <li key={b.id} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">{b.stt_lop ?? '?'}</span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-slate-800" title={b.tieu_de ?? ''}>{b.tieu_de || 'Buổi'}</span>
                    <span className="shrink-0 text-[11px] text-slate-400">{b.ngay ? ddmmVN(b.ngay) : ''}</span>
                  </div>
                  <div className="mt-1 pl-8 text-[10px] text-slate-400">{goc ? `từ buổi ${goc} của giáo trình gốc` : ''}</div>
                </li>
              )
            })}
          </ol>
        )}
    </aside>
  )
}

function BuoiTrichRowHinh({ no, sttLop, lopId, buoi, st, defaultNgay, onGan }: {
  no: number; sttLop?: number; lopId: string | null; buoi: GtBuoi; st?: TrichStateHinh; defaultNgay?: string
  onGan: (ngay: string) => Promise<void>
}) {
  const [ngay, setNgay] = useState(defaultNgay ?? '')
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [doiNgay, setDoiNgay] = useState(false)
  useEffect(() => { if (!touched) setNgay(defaultNgay ?? '') }, [defaultNgay, touched])
  const pickNgay = (v: string) => { setTouched(true); setNgay(v) }
  const ganNgay = st?.ngay ? ddmmVN(st.ngay) : null
  async function go() { if (!ngay) return; setBusy(true); try { await onGan(ngay) } finally { setBusy(false) } }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="w-6 shrink-0 text-center text-[13px] font-bold text-indigo-600">{no}</span>
        <div className="min-w-[120px] flex-1 text-[13px] font-semibold text-slate-800">{buoi.tieu_de || `Buổi ${no}`}</div>
        {ganNgay ? (
          <div className="flex flex-wrap items-center gap-2">
            {sttLop && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[12px] font-semibold text-indigo-700">→ Buổi {sttLop} của lớp</span>}
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">✓ Đã gán · {ganNgay}</span>
            <button onClick={go} disabled={busy || !ngay} title="Gán lại sang ngày khác" className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:border-indigo-300">Gán lại</button>
            <BuoiNgaySelect lopId={lopId} value={ngay} onChange={pickNgay} className="h-7 rounded border border-slate-300 px-1.5 text-[12px]" />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {ngay ? (
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[12px] font-medium text-violet-700">Gán vào <b>{thuCuaNgay(ngay)} · {ddmmVN(ngay)}</b></span>
            ) : (
              <span className="text-[12px] text-slate-400">{doiNgay ? 'Chọn ngày…' : 'Lớp chưa có buổi trống trong lịch'}</span>
            )}
            <button onClick={() => setDoiNgay((v) => !v)} className="text-[11px] text-slate-400 underline decoration-dotted underline-offset-2 hover:text-indigo-600">đổi ngày</button>
            {doiNgay && <BuoiNgaySelect lopId={lopId} value={ngay} onChange={pickNgay} className="h-7 rounded border border-slate-300 px-1.5 text-[12px]" />}
            <button onClick={go} disabled={busy || !ngay} className="rounded-md bg-violet-600 px-3 py-1 text-[12px] font-medium text-white hover:bg-violet-500 disabled:opacity-40">{busy ? '…' : 'Gán'}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════ THEO LỚP (đã gán) ══════════════
function TheoLop({ khoi, onIn }: { khoi: string; onIn: (tieu: string, buoiId: string, phan: 'lop' | 'nha') => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState('')
  const [buois, setBuois] = useState<GtBuoi[]>([])
  useEffect(() => { listLop(khoi).then((d) => { const dh = d.filter((l) => l.trang_thai === 'dang_hoc'); setLops(dh); setLopId((x) => x || dh[0]?.id || '') }).catch(() => setLops([])) }, [khoi])
  const nap = useCallback(async () => { if (lopId) setBuois(await gt.listBuoiLop(lopId)); else setBuois([]) }, [lopId])
  useEffect(() => { nap() }, [nap])
  const lop = useMemo(() => lops.find((l) => l.id === lopId), [lops, lopId])

  return (
    <div className="max-w-3xl">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[12px] text-slate-500">Lớp</span>
        <select className={`${inpCls} max-w-xs`} value={lopId} onChange={(e) => setLopId(e.target.value)}>
          {lops.map((l) => <option key={l.id} value={l.id}>{l.ten_lop}</option>)}
          {!lops.length && <option value="">— không có lớp đang học —</option>}
        </select>
      </div>
      {!lop ? <Empty icon="◷">Chọn lớp để xem giáo trình đã gán.</Empty>
        : buois.length === 0 ? <Empty icon="◷">Lớp <b>{tron(lop.ten_lop)}</b> chưa gán buổi nào. Gán ở tab <b>Master</b>.</Empty>
          : buois.map((b) => (
            <div key={b.id} className="mb-2 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[11.5px] font-bold text-white">{b.stt_lop ?? '?'}</span>
              <b className="text-[13px] text-slate-800">{b.tieu_de || `Buổi ${b.stt_lop ?? ''}`}</b>
              <Ma>{b.ngay ?? ''}</Ma>
              <div className="ml-auto flex gap-1.5">
                <Btn className="h-7 px-2 text-[12px]" onClick={() => onIn(b.tieu_de || `Buổi ${b.stt_lop ?? ''}`, b.id, 'lop')}>📘 In Lớp</Btn>
                <Btn className="h-7 px-2 text-[12px]" onClick={() => onIn(b.tieu_de || `Buổi ${b.stt_lop ?? ''}`, b.id, 'nha')}>📝 In Nhà</Btn>
                <Btn className="h-7 px-2 text-[12px]" onClick={async () => { if (confirm('Bỏ gán buổi này khỏi lớp?')) { await gt.goBuoiLop(b.id, lopId); await nap() } }}>🗑</Btn>
              </div>
            </div>
          ))}
    </div>
  )
}
