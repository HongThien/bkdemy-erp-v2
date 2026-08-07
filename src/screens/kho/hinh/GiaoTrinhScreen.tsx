// Giáo trình HÌNH — master (buổi lưu từ builder "Theo mô hình") + GÁN LỚP (snapshot). Độc lập giáo trình Đại.
// In: resolve bài của buổi (chuan/bienthe/y/ghep) → BanIn → HinhPrintView (2 phiếu: Trên lớp / Về nhà).
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import * as gt from '../../../lib/kho/hinhGiaoTrinh'
import type { GiaoTrinh, GtBuoi, GtBai } from '../../../lib/kho/hinhGiaoTrinh'
import type { Luoi } from '../../../lib/kho/hinh'
import { listLop, type Lop } from '../../../lib/nhansu'
import { Btn, Empty, Ma, Panel, Seg, tron, inpCls } from './hinhUi'
import HinhPrintView, { type BanIn, type MucIn } from './HinhPrintView'
import { mucGhep } from './SoanTaiLieu'
import { createPortal } from 'react-dom'
import { useStore, type SoanHinhDraft, type GhepItem } from '../../../store/useStore'
import type { Nhay } from './KhoHinhScreen'

// Dựng lại NHÁP builder "Theo mô hình" từ buổi đã lưu → mở lại để SỬA (không mất cấu trúc).
async function loadBuoiToDraft(L: Luoi, buoi: GtBuoi): Promise<SoanHinhDraft['mh']> {
  const bais = await gt.listGtBai(buoi.id)
  const [btMap, yMap] = await Promise.all([
    gt.getBienTheByIds(bais.filter((b) => b.loai === 'bienthe').map((b) => b.ref_id!).filter(Boolean)),
    gt.getYFull(bais.filter((b) => b.loai === 'y').map((b) => b.ref_id!).filter(Boolean)),
  ])
  const sel: Record<string, Record<string, 'lop' | 'nha'>> = {}
  const ghep: GhepItem[] = []; const anDe: string[] = []; const soDong: Record<string, number> = {}
  const nodeSet = new Set<string>()
  const put = (nodeId: string, key: string, b: GtBai) => {
    (sel[nodeId] ??= {})[key] = b.phan
    if (b.an_de) anDe.push(key)
    if (b.so_dong != null) soDong[key] = b.so_dong
    nodeSet.add(nodeId)
  }
  for (const b of bais) {
    if (b.loai === 'chuan' && b.ref_id) put(b.ref_id, `${b.ref_id}:chuan`, b)
    else if (b.loai === 'bienthe' && b.ref_id) { const v = btMap.get(b.ref_id); if (v) put(v.baitoan_id, `bt:${b.ref_id}`, b) }
    else if (b.loai === 'y' && b.ref_id) { const yb = yMap.get(b.ref_id); if (yb?.y.baitoan_id) put(yb.y.baitoan_id, `y:${b.ref_id}`, b) }
    else if (b.loai === 'ghep') {
      ghep.push({ key: b.id, phan: b.phan, luaId: b.lua_id, nodeIds: b.ghep_node_ids })
      if (b.an_de) anDe.push(b.id)
      if (b.so_dong != null) soDong[b.id] = b.so_dong
      b.ghep_node_ids.forEach((id) => nodeSet.add(id))
    }
  }
  const nodeIds = [...nodeSet]
  const mainId = buoi.mo_hinh_chinh_id ?? (nodeIds.length ? (L.baiToan.find((x) => x.id === nodeIds[0])?.mo_hinh_id ?? '') : '')
  const satIds = [...new Set(nodeIds.map((nid) => L.baiToan.find((x) => x.id === nid)?.mo_hinh_id).filter((m): m is string => !!m && m !== mainId))]
  return { mainId, satIds, nodeIds, sel, ghep, anDe, soDong, editBuoi: buoi.id }
}

// ── Resolve bài của một buổi → BanIn cho 1 phiếu (lop/nha). Fetch biến thể/ý theo id. ──
async function resolveBanIn(L: Luoi, tieuBuoi: string, bais: GtBai[], phan: 'lop' | 'nha'): Promise<BanIn> {
  const list = bais.filter((b) => b.phan === phan).sort((a, b) => a.thu_tu - b.thu_tu)
  const [btMap, yMap] = await Promise.all([
    gt.getBienTheByIds(list.filter((b) => b.loai === 'bienthe').map((b) => b.ref_id!).filter(Boolean)),
    gt.getYFull(list.filter((b) => b.loai === 'y').map((b) => b.ref_id!).filter(Boolean)),
  ])
  const dong = (b: GtBai) => (phan === 'nha' ? (b.so_dong ?? 6) : (b.so_dong ?? 0))   // BTVN mặc định 6; trên lớp không kẻ dòng
  const daGhep = new Set(list.filter((b) => b.loai === 'ghep').flatMap((b) => b.ghep_node_ids))   // node đã ghép → bỏ bài lẻ
  const seenGhep = new Set<string>()   // khử bài ghép trùng (cùng bộ node)
  const mucs: MucIn[] = []
  for (const b of list) {
    if (b.loai === 'chuan') {
      const node = L.baiToan.find((x) => x.id === b.ref_id); if (!node || daGhep.has(node.id)) continue
      const c = api.cachMacDinh(L, node.id); const anh = api.anhCuaBaiToan(L, node.id)
      mucs.push({ kieu: 'de', ma: node.ma, deBai: [api.giaThietDayDu(L, node.mo_hinh_id), `Chứng minh ${node.phat_bieu}`].filter(Boolean).join('. '), anhDe: anh, ys: [{ nhan: '', noiDung: '', loiGiai: c?.loi_giai, anh: c?.anh_loi_giai ?? anh, ma: node.ma, cap: node.cap }], anDe: b.an_de || !anh, soDong: dong(b) })
    } else if (b.loai === 'bienthe') {
      const v = btMap.get(b.ref_id!); if (!v || daGhep.has(v.baitoan_id)) continue
      const node = L.baiToan.find((x) => x.id === v.baitoan_id)
      mucs.push({ kieu: 'de', ma: node?.ma ?? null, deBai: v.de_bai, anhDe: v.anh, ys: [{ nhan: '', noiDung: '', loiGiai: v.loi_giai, anh: v.anh_loi_giai ?? v.anh, ma: node?.ma, cap: node?.cap }], anDe: b.an_de || !v.anh, soDong: dong(b) })
    } else if (b.loai === 'y') {
      const yb = yMap.get(b.ref_id!); if (!yb || (yb.y.baitoan_id && daGhep.has(yb.y.baitoan_id))) continue
      const da = api.dapAnHaiBac(L, yb.y)
      mucs.push({ kieu: 'de', ma: yb.bai.ma_bai, deBai: yb.bai.de_bai, anhDe: yb.bai.anh_de, ys: [{ nhan: yb.y.nhan_hien_thi ?? String.fromCharCode(96 + yb.y.thu_tu), noiDung: yb.y.noi_dung, loiGiai: da.loiGiai, anh: da.anh, bacThamChieu: da.bac === 'tham_chieu', ma: yb.y.ma_y }], anDe: b.an_de || !yb.bai.anh_de, soDong: dong(b) })
    } else if (b.loai === 'ghep') {
      const sig = [...b.ghep_node_ids].sort().join(','); if (seenGhep.has(sig)) continue; seenGhep.add(sig)
      mucs.push(mucGhep(L, { key: b.id, phan: b.phan, luaId: b.lua_id, nodeIds: b.ghep_node_ids }, b.an_de, dong(b)))
    }
  }
  return { tieuDe: `${tieuBuoi} — ${phan === 'lop' ? 'Trên lớp' : 'Về nhà (BTVN)'}`, phuDe: `${mucs.length} mục`, mucs }
}

export default function GiaoTrinhScreen({ L, khoi, di }: { L: Luoi; khoi: string; di: (n: Nhay) => void }) {
  const [tab, setTab] = useState<'master' | 'lop'>('master')
  const [inBan, setInBan] = useState<BanIn | null>(null)
  const setSoanHinh = useStore((s) => s.setSoanHinh)
  const inBuoi = useCallback(async (tieu: string, buoiId: string, phan: 'lop' | 'nha') => {
    try { setInBan(await resolveBanIn(L, tieu, await gt.listGtBai(buoiId), phan)) } catch (e: any) { alert(e.message ?? String(e)) }
  }, [L])
  // Sửa: dựng lại nháp builder từ buổi → mở màn Soạn tài liệu (Theo mô hình), đánh dấu editBuoi.
  const sua = useCallback(async (buoi: GtBuoi) => {
    try { const mh = await loadBuoiToDraft(L, buoi); setSoanHinh(khoi, (cur) => ({ ...cur, che: 'mh', mh })); di({ man: 'soan' }) }
    catch (e: any) { alert(e.message ?? String(e)) }
  }, [L, khoi, setSoanHinh, di])
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Giáo trình <span className="text-slate-400">· Khối {khoi}</span></h1>
        <Seg value={tab} onChange={setTab} options={[{ v: 'master', label: '▤ Master — soạn' }, { v: 'lop', label: '◷ Theo lớp — đã gán' }]} />
      </div>
      {tab === 'master' ? <Master L={L} khoi={khoi} onIn={inBuoi} onSua={sua} /> : <TheoLop khoi={khoi} onIn={inBuoi} />}
      {inBan && <HinhPrintView ban={inBan} onClose={() => setInBan(null)} />}
    </>
  )
}

// ══════════════ MASTER ══════════════
function Master({ L, khoi, onIn, onSua }: { L: Luoi; khoi: string; onIn: (tieu: string, buoiId: string, phan: 'lop' | 'nha') => void; onSua: (buoi: GtBuoi) => void }) {
  const [gts, setGts] = useState<GiaoTrinh[]>([])
  const [chon, setChon] = useState<string | null>(null)
  const [buois, setBuois] = useState<GtBuoi[]>([])
  const [demBai, setDemBai] = useState<Record<string, number>>({})
  const [ganBuoi, setGanBuoi] = useState<GtBuoi | null>(null)

  const napGt = useCallback(async () => { const d = await gt.listGiaoTrinh(khoi); setGts(d); setChon((c) => c ?? d[0]?.id ?? null) }, [khoi])
  useEffect(() => { napGt() }, [napGt])
  const napBuoi = useCallback(async (gtId: string | null) => {
    if (!gtId) { setBuois([]); return }
    const bs = await gt.listBuoiMaster(gtId); setBuois(bs)
    const dem: Record<string, number> = {}
    await Promise.all(bs.map(async (b) => { dem[b.id] = (await gt.listGtBai(b.id)).length }))
    setDemBai(dem)
  }, [])
  useEffect(() => { napBuoi(chon) }, [chon, napBuoi])

  const gtChon = gts.find((g) => g.id === chon) ?? null
  const tieuBuoi = (b: GtBuoi, i: number) => b.tieu_de || `Buổi ${i + 1}`

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[260px_1fr]">
      <Panel label="Giáo trình">
        {gts.length === 0
          ? <div className="text-[12.5px] text-slate-400">Chưa có giáo trình. Vào <b>Soạn tài liệu → Theo mô hình</b> → soạn buổi → <b>💾 Lưu vào giáo trình</b>.</div>
          : gts.map((g) => (
            <button key={g.id} onClick={() => setChon(g.id)} className={`mb-1 block w-full truncate rounded-lg border px-2.5 py-2 text-left text-[13px] ${chon === g.id ? 'border-blue-300 bg-blue-50/60 font-medium text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>{g.ten}</button>
          ))}
      </Panel>

      <div className="min-w-0">
        {!gtChon ? <Empty icon="▤">Chọn một giáo trình để xem các buổi.</Empty> : (
          <>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[14px] font-semibold text-slate-900">{gtChon.ten}</span>
              <span className="text-[12px] text-slate-400">· {buois.length} buổi</span>
              <Btn className="ml-auto h-7 px-2 text-[12px] border-rose-300 text-rose-600" onClick={async () => { if (confirm(`Xoá giáo trình "${gtChon.ten}" và mọi buổi?`)) { await gt.deleteGiaoTrinh(gtChon.id); setChon(null); await napGt() } }}>🗑 Xoá giáo trình</Btn>
            </div>
            {buois.length === 0
              ? <Empty icon="＋">Giáo trình chưa có buổi. Soạn ở <b>Theo mô hình</b> rồi <b>Lưu vào giáo trình</b> này.</Empty>
              : buois.map((b, i) => (
                <div key={b.id} className="mb-2 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-[11.5px] font-bold text-white">{i + 1}</span>
                  <b className="text-[13px] text-slate-800">{tieuBuoi(b, i)}</b>
                  {b.mo_hinh_chinh_id && <span className="text-[11px] text-teal-600">◇ {L.moHinh.find((m) => m.id === b.mo_hinh_chinh_id)?.ma}</span>}
                  <span className="text-[11.5px] text-slate-400">{demBai[b.id] ?? '…'} bài</span>
                  <div className="ml-auto flex gap-1.5">
                    <Btn className="h-7 px-2 text-[12px]" onClick={() => onSua(b)}>✎ Sửa</Btn>
                    <Btn className="h-7 px-2 text-[12px]" onClick={() => onIn(tieuBuoi(b, i), b.id, 'lop')}>📘 In Lớp</Btn>
                    <Btn className="h-7 px-2 text-[12px]" onClick={() => onIn(tieuBuoi(b, i), b.id, 'nha')}>📝 In Nhà</Btn>
                    <Btn className="h-7 px-2 text-[12px] border-violet-300 text-violet-700" onClick={() => setGanBuoi(b)}>＋ Gán lớp</Btn>
                    <Btn className="h-7 px-2 text-[12px]" onClick={async () => { if (confirm('Xoá buổi này?')) { await gt.deleteBuoi(b.id); await napBuoi(chon) } }}>🗑</Btn>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
      {ganBuoi && <GanLopPopup khoi={khoi} buoi={ganBuoi} onClose={() => setGanBuoi(null)} onDone={() => setGanBuoi(null)} />}
    </div>
  )
}

// ══════════════ GÁN LỚP (snapshot) ══════════════
function GanLopPopup({ khoi, buoi, onClose, onDone }: { khoi: string; buoi: GtBuoi; onClose: () => void; onDone: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState('')
  const [ngay, setNgay] = useState('')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { listLop(khoi).then((d) => { const dh = d.filter((l) => l.trang_thai === 'dang_hoc'); setLops(dh); setLopId(dh[0]?.id ?? '') }).catch(() => setLops([])) }, [khoi])
  const gan = async () => {
    if (!lopId || !ngay) { setLoi('Chọn lớp và ngày.'); return }
    setBusy(true); setLoi(null)
    try { await gt.ganLopSnapshot(buoi.id, lopId, ngay); alert('Đã gán buổi cho lớp (bản đóng băng).'); onDone() }
    catch (e: any) { setLoi(e.message ?? String(e)); setBusy(false) }
  }
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-3 sm:p-6" onClick={onClose}>
      <div className="w-[92vw] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">＋ Gán buổi cho lớp</h3>
          <span className="text-[12px] text-slate-400">{buoi.tieu_de || 'buổi'}</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>
        <div className="space-y-3 p-5">
          <p className="text-[12px] leading-snug text-slate-500">Tạo <b>bản đóng băng</b> nội dung buổi cho (lớp, ngày). Sửa master sau <b>không</b> đụng bản đã gán.</p>
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Lớp</div>
            <select className={inpCls} value={lopId} onChange={(e) => setLopId(e.target.value)}>
              {lops.map((l) => <option key={l.id} value={l.id}>{l.ten_lop}</option>)}
              {!lops.length && <option value="">— không có lớp đang học ở khối này —</option>}
            </select>
          </div>
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Ngày buổi</div>
            <input type="date" className={inpCls} value={ngay} onChange={(e) => setNgay(e.target.value)} />
          </div>
          {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
        </div>
        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            <Btn kind="pri" disabled={busy} onClick={gan}>{busy ? 'Đang gán…' : 'Gán lớp'}</Btn>
          </div>
        </div>
      </div>
    </div>,
    document.body,
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
