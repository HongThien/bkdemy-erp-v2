// Màn "MT" (kỳ thi lớn, "Grand Slam") — soạn nội dung ĐỘC LẬP (nhiều phần/chuyên đề, mỗi phần chọn
// câu theo cơ chế ET: chọn dạng → hệ gợi ý câu ít-dùng-nhất → ✎ Chọn/↻ Đổi — KHÔNG bóc-ảnh như Đề
// thi) rồi GÁN vào buổi (lớp+ngày) khi cần dùng. Khác ET: ET = 1 lớp+ngày cố định lúc tạo; MT tạo
// xong nằm ở Kho tài liệu như 1 MẪU, gán được cho NHIỀU lớp/nhiều lần (giống mô hình Đề thi).
// Phạm vi hiện tại: soạn + gán buổi. Chấm MT trong buổi (Đ/C/S, đóng phase, Elo K=60) = lượt sau.
import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { useMonScope } from '../../lib/mon'
import {
  listMT, createMT, renameMT, deleteMT, addPhanMT, ganMTVaoBuoi, listGanMT,
  type MTGanRow,
} from '../../lib/mt'
import {
  getTaiLieuFull, deletePhan, setCauOfPhan, suggestCauForDang, khoCuaMon, updateTaiLieu,
  ET_FORMS, etFormOf, type PhanResolved, type CauHinh, type ETForm as ETFormKind,
} from '../../lib/tailieu'
import { buildMaDe as buildMaDeLib, oTrongMaDe, usedMoiDe as usedMoiDeLib, setVarInCh, maDeStale, type BaseItem } from '../../lib/made'
import { listLop, listHSCuaLop, type Lop, type HocSinh } from '../../lib/nhansu'
import { listCauByDang, listLopBac, LOAI_CAU, KHOI_OPTIONS, DEFAULT_KHOI, type CauHoi, type LopBac } from '../../lib/kho/api'
import { fetchCausByMa } from '../../lib/ontap'
import { MathText, inp } from '../kho/ui'
import { KhoPicker } from './TaiLieuBuilder'
import DangPickerOne from '../../components/DangPickerOne'
import BuoiNgaySelect from '../../components/BuoiNgaySelect'
import SearchSelect from '../../components/SearchSelect'
import MTPrintView from './MTPrintView'

const MONS = ['Toán', 'KHTN']
const DEFAULT_ROWS_PER_PHAN = 3
type Row = { maDang: string | null; maCau: string | null }
const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v

// ═══════════ LIST (leaf lamtailieu:mt) — chọn MT để sửa / tạo mới ═══════════
export default function MTScreen() {
  const { allowedMons: monScope, isAll } = useMonScope()  // scope④ (admin/Ops/Media/Marketing = tất cả)
  const allowedMons = isAll ? MONS : MONS.filter((m) => monScope.includes(m))
  const [mon, setMon] = useState(allowedMons[0] ?? 'Toán')
  useEffect(() => { if (allowedMons.length && !allowedMons.includes(mon)) setMon(allowedMons[0]) }, [allowedMons.join(',')]) // eslint-disable-line
  const [list, setList] = useState<Awaited<ReturnType<typeof listMT>>>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  async function reload() { setLoading(true); try { setList(await listMT(mon)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [mon]) // eslint-disable-line

  if (openId) return <MTEditor id={openId} onClose={() => { setOpenId(null); reload() }} />

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">MT</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">kỳ thi lớn — soạn 1 lần, gán được nhiều lớp/nhiều lần</span>
        {allowedMons.length > 1 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {allowedMons.map((m) => <button key={m} onClick={() => setMon(m)} className={`rounded-md px-3 py-1 text-[13px] font-medium ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{m}</button>)}
          </div>
        )}
        <button onClick={() => setCreating(true)} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo MT mới</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : list.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-400">Chưa có MT nào ở môn {mon}.</div>
          : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((d) => (
                <div key={d.id} className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                  <button onClick={() => setOpenId(d.id)} className="block w-full text-left">
                    <div className="font-medium text-slate-800 pr-6">{d.ten}</div>
                    <div className="mt-1 text-[12px] text-slate-500">Khối {d.khoi}</div>
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation()
                      if (!confirm(`Xoá MT "${d.ten}"? Toàn bộ phần/câu trong mẫu này sẽ mất (câu vẫn còn trong kho). Các buổi đã gán từ mẫu này trước đó KHÔNG bị xoá theo.`)) return
                      await deleteMT(d.id); reload()
                    }}
                    title="Xoá MT"
                    className="absolute right-2 top-2 rounded-md px-1.5 py-1 text-[13px] text-slate-300 opacity-0 hover:text-rose-600 group-hover:opacity-100"
                  >🗑</button>
                </div>
              ))}
            </div>
          )}
      </div>
      {creating && <TaoMTModal mon={mon} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); setOpenId(id) }} />}
    </div>
  )
}

function TaoMTModal({ mon, onClose, onCreated }: { mon: string; onClose: () => void; onCreated: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [busy, setBusy] = useState(false)
  async function tao() {
    if (!ten.trim()) return
    setBusy(true)
    try { const d = await createMT({ ten: ten.trim(), khoi, mon }); onCreated(d.id) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[420px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Tạo MT mới</p>
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Tên MT</label>
        <input autoFocus value={ten} onChange={(e) => setTen(e.target.value)} placeholder='vd "MT Học kỳ 1 — Toán 9"' className={`${inp} mt-1 w-full`} />
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Khối</label>
        <div className="mt-1 flex flex-wrap gap-1.5">{KHOI_OPTIONS.map((k) => <button key={k} onClick={() => setKhoi(k)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium ${khoi === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{k}</button>)}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
          <button disabled={!ten.trim() || busy} onClick={tao} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo'}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════ EDITOR — nhiều phần, mỗi phần chọn câu kiểu ET + nút Gán vào buổi ═══════════
export function MTEditor({ id, onClose }: { id: string; onClose: () => void }) {
  const [d, setD] = useState<{ id: string; ten: string; khoi: string; mon: string } | null>(null)
  const [phans, setPhans] = useState<PhanResolved[]>([])
  const [rowsByPhan, setRowsByPhan] = useState<Record<string, Row[]>>({})
  const [cau, setCau] = useState<Record<string, CauHoi>>({}) // cache để preview
  const [dangOpts, setDangOpts] = useState<{ ma_dang: string; ten_dang: string; ten_chuyen_de: string; bac: string }[]>([])
  const [lopBacs, setLopBacs] = useState<LopBac[]>([]) // S>A>B>C (thu_tu desc) — suy hệ nào thấy được 1 phần, xem ganMTVaoBuoi
  const [ch, setCh] = useState<CauHinh>({}) // cấu hình chỉnh dòng (etFormByCau/btvnLinesByCau) — giống ET
  const [ten, setTen] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ganModal, setGanModal] = useState(false)
  const [ganList, setGanList] = useState<MTGanRow[]>([])
  const [printing, setPrinting] = useState(false)
  const [picker, setPicker] = useState<{ phanId: string; idx: number; maDang: string } | null>(null)
  const [varPicker, setVarPicker] = useState<{ baseMaCau: string; v: number; maDang: string; form: ETFormKind } | null>(null)
  const [dangModal, setDangModal] = useState<{ phanId: string; idx: number } | null>(null)
  const [chiaDe, setChiaDe] = useState<{ taiLieuId: string; lopId: string; lopTen: string } | null>(null)
  const cauTbl = d ? khoCuaMon(d.mon).cauTbl : 'dai_cau_hoi'
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  async function reload() {
    setLoading(true)
    try {
      const full = await getTaiLieuFull(id)
      const ch0 = full.taiLieu.cau_hinh ?? {}
      setD(full.taiLieu as any); setTen(full.taiLieu.ten); setCh(ch0)
      const ps = full.phans.filter((p) => p.loai_phan === 'custom')
      setPhans(ps)
      const rb: Record<string, Row[]> = {}
      const c: Record<string, CauHoi> = {}
      for (const p of ps) {
        rb[p.id] = p.caus.map((x) => ({ maDang: x.dang_chinh, maCau: x.ma_cau }))
        for (const x of p.caus) c[x.ma_cau] = x
      }
      // Nạp thêm nội dung câu MÃ ĐỀ 2/3 (etMaDe) — trên chỉ nạp câu GỐC (phan.caus) nên mở lại MT cũ,
      // cột Mã đề 2/3 chỉ thấy MÃ câu, không thấy đề (chỉ "…") dù dữ liệu vẫn còn nguyên trong cau_hinh.
      const need = new Set<string>()
      for (const arr of Object.values(ch0.etMaDe ?? {})) for (const m of arr) if (m && !c[m]) need.add(m)
      if (need.size) { const vs = await fetchCausByMa([...need], khoCuaMon(full.taiLieu.mon).cauTbl); for (const v of vs) c[v.ma_cau] = v }
      setRowsByPhan(rb); setCau((prev) => ({ ...prev, ...c }))
      setGanList(await listGanMT(id))
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [id]) // eslint-disable-line
  useEffect(() => { listLopBac().then(setLopBacs) }, [])
  useEffect(() => {
    if (!d?.khoi) { setDangOpts([]); return }
    khoCuaMon(d.mon).listMap(d.khoi).then((ds) => setDangOpts(ds.map((x) => ({ ma_dang: x.leafMa, ten_dang: x.leafTen, ten_chuyen_de: x.t2Ten, bac: x.bac })))).catch(() => { /* */ })
  }, [d?.khoi, d?.mon])

  const tenDang = (md: string | null) => dangOpts.find((x) => x.ma_dang === md)?.ten_dang ?? md ?? ''
  // ⭐ Hệ nào thấy được 1 phần — MẶC ĐỊNH suy từ bac_toi_thieu của dạng các câu trong phần (bản đồ
  // kiến thức đã gán sẵn, khắt khe nhất thắng); GV ÉP TAY được (dropdown cạnh badge, `ch.phanBac[phanId]`)
  // khi muốn khác — ép tay LUÔN THẮNG, "gán vào buổi" (mt.ts) đọc y hệt ưu tiên này.
  const thuTuBac = (ma: string) => lopBacs.find((b) => b.ma === ma)?.thu_tu ?? 0
  function bacTuDongCuaPhan(phanId: string): string {
    const bacs = (rowsByPhan[phanId] ?? []).map((r) => r.maDang ? dangOpts.find((x) => x.ma_dang === r.maDang)?.bac : null).filter(Boolean) as string[]
    return bacs.reduce((worst, b) => (thuTuBac(b) > thuTuBac(worst) ? b : worst), 'C')
  }
  const bacEpCuaPhan = (phanId: string): string | null => ch.phanBac?.[phanId] ?? null
  const bacHieuLucCuaPhan = (phanId: string): string => bacEpCuaPhan(phanId) ?? bacTuDongCuaPhan(phanId)
  async function setPhanBac(phanId: string, bac: string | null) {
    const next: CauHinh = { ...ch, phanBac: { ...(ch.phanBac ?? {}) } }
    if (bac) next.phanBac![phanId] = bac; else delete next.phanBac![phanId]
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  function nhanHe(bacMa: string): string {
    const qualifying = lopBacs.filter((b) => b.thu_tu >= thuTuBac(bacMa)).map((b) => b.ma)
    return qualifying.length >= lopBacs.length ? 'Mọi hệ' : `Hệ ${qualifying.join(', ')}`
  }
  async function saveTen() { if (d && ten.trim() && ten.trim() !== d.ten) { await renameMT(id, ten.trim()); markSaved() } }
  async function xoaMT() {
    const canhBao = ganList.length ? ` Đã gán cho ${ganList.length} lượt lớp+ngày trước đó — các buổi đó KHÔNG bị xoá theo, chỉ mất liên kết về mẫu gốc.` : ''
    if (!confirm(`Xoá MT "${d?.ten}"? Toàn bộ phần/câu trong mẫu này sẽ mất (câu vẫn còn trong kho).${canhBao}`)) return
    await deleteMT(id); onClose()
  }

  // Câu ĐANG DÙNG xuyên MỌI PHẦN (không riêng phần đang sửa) — chống trùng câu trong 1 MT.
  const usedGlobal = (exceptPhan: string, exceptIdx: number) => {
    const s = new Set<string>()
    for (const [pid, rows] of Object.entries(rowsByPhan)) rows.forEach((r, i) => { if (!(pid === exceptPhan && i === exceptIdx) && r.maCau) s.add(r.maCau) })
    return s
  }
  async function ensureCache(maDang: string) {
    if (Object.values(cau).some((c) => c.dang_chinh === maDang)) return
    const list = await listCauByDang(maDang, cauTbl)
    setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) }))
  }
  async function luuPhan(phanId: string, rows: Row[]) {
    setRowsByPhan((rb) => ({ ...rb, [phanId]: rows }))
    const maCaus = rows.map((r) => r.maCau).filter(Boolean) as string[]
    await setCauOfPhan(phanId, maCaus)
    markSaved()
  }
  async function pickDang(phanId: string, idx: number, maDang: string) {
    await ensureCache(maDang)
    const sug = await suggestCauForDang(maDang, usedGlobal(phanId, idx), cauTbl)
    if (sug && !cau[sug]) { const list = await listCauByDang(maDang, cauTbl); setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) })) }
    const rows = (rowsByPhan[phanId] ?? []).map((r, i) => (i === idx ? { maDang, maCau: sug } : r))
    await luuPhan(phanId, rows)
  }
  async function doiCau(phanId: string, idx: number) {
    const r = (rowsByPhan[phanId] ?? [])[idx]; if (!r?.maDang) return
    const sug = await suggestCauForDang(r.maDang, new Set([...usedGlobal(phanId, idx), r.maCau].filter(Boolean) as string[]), cauTbl)
    if (!sug) { alert('Hết câu khác cho dạng này (đã dùng hết trong MT).'); return }
    const rows = (rowsByPhan[phanId] ?? []).map((x, i) => (i === idx ? { ...x, maCau: sug } : x))
    await luuPhan(phanId, rows)
  }
  const themCau = (phanId: string) => setRowsByPhan((rb) => ({ ...rb, [phanId]: [...(rb[phanId] ?? []), { maDang: null, maCau: null }] }))
  async function xoaRow(phanId: string, idx: number) {
    const rows = (rowsByPhan[phanId] ?? []).filter((_, i) => i !== idx)
    await luuPhan(phanId, rows)
  }
  async function themPhan() {
    const tieuDe = prompt('Tên phần (vd "Phần I. Đại số", "Phần II. Hình học"):', `Phần ${['I', 'II', 'III', 'IV', 'V'][phans.length] ?? phans.length + 1}`)?.trim()
    if (!tieuDe) return
    const p = await addPhanMT(id, tieuDe)
    setRowsByPhan((rb) => ({ ...rb, [p.id]: Array.from({ length: DEFAULT_ROWS_PER_PHAN }, () => ({ maDang: null, maCau: null })) }))
    await reload(); markSaved()
  }
  async function xoaPhan(p: PhanResolved) {
    if (!confirm(`Xoá phần "${p.tieu_de}"? (câu vẫn còn trong kho, chỉ bỏ khỏi MT này)`)) return
    await deletePhan(p.id); await reload(); markSaved()
  }
  // Cấu hình chỉnh dòng (số dòng kẻ tự luận + đổi form hiển thị) — GIỐNG ET, autosave ngay (MT không có nút Lưu riêng).
  async function setLines(maCau: string, n: number) {
    const next: CauHinh = { ...ch, btvnLinesByCau: { ...(ch.btvnLinesByCau ?? {}), [maCau]: n } }
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  async function setForm(maCau: string, f: ETFormKind) {
    const next: CauHinh = { ...ch, etFormByCau: { ...(ch.etFormByCau ?? {}), [maCau]: f } }
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  // Số cột khi in — RIÊNG TỪNG CÂU (cau_hinh.colByCau, autosave). Câu tag cột liền nhau tự xếp cạnh nhau.
  const setColCau = (maCau: string, n: number) => saveCh({ ...ch, colByCau: { ...(ch.colByCau ?? {}), [maCau]: n } })

  // ── 3 MÃ ĐỀ (như ET) — base = MỌI câu XUYÊN mọi phần (đúng thứ tự phần → hàng). Đề 2/3 tự sinh khác
  //    câu (cùng dạng + form), neo theo ma_cau gốc; lưu NGAY vào cau_hinh (MT autosave). Dùng lib/made. ──
  const baseAll = (): BaseItem[] => phans.flatMap((p) => (rowsByPhan[p.id] ?? []).filter((r) => r.maCau && r.maDang).map((r) => ({ maDang: r.maDang!, maCau: r.maCau! })))
  async function saveCh(next: CauHinh) { setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved() }
  async function sinhMaDe() {
    const base = baseAll()
    if (!base.length) return
    const { ch: chNew, caus } = await buildMaDeLib(base, ch, cauTbl, cau)
    setCau((p) => { const n = { ...p }; for (const c of caus) n[c.ma_cau] = c; return n })
    await saveCh(chNew)
  }
  const setVar = (baseMaCau: string, v: number, maCau: string, form: ETFormKind) => saveCh(setVarInCh(ch, baseMaCau, v, maCau, form))
  const usedMoiDe = (): Set<string> => usedMoiDeLib(baseAll(), ch)
  const oTrong = (): { maCau: string; v: number }[] => oTrongMaDe(baseAll(), ch)

  if (loading || !d) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const soCau = Object.values(rowsByPhan).reduce((s, rows) => s + rows.filter((r) => r.maCau).length, 0)

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        {/* ⭐ 07-12: MT master cũng autosave (không nút Lưu) — enqueue link ở lúc ĐÓNG. Bản thân master
            hiếm khi tự gửi PH (thường gửi bản mt_buoi đã gán lớp), nhưng vẫn có link sẵn nếu cần. */}
        <button onClick={() => { useStore.getState().enqueueLinkGen(id, 'mt'); onClose() }} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Kho tài liệu</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className="min-w-[260px] flex-1 rounded-md border border-transparent px-2 py-1 text-[15px] font-semibold text-slate-900 hover:border-slate-200 focus:border-indigo-400 focus:outline-none" />
        <span className="rounded bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">{d.mon} · Khối {d.khoi} · mẫu độc lập</span>
        {saved && <span className="text-[12px] text-emerald-600">✓ Đã lưu</span>}
        <span className="text-[12px] text-slate-400">{soCau} câu · {phans.length} phần{ganList.length ? ` · đã gán ${ganList.length} lớp` : ''}</span>
        <button onClick={() => setPrinting(true)} disabled={!soCau} className="ml-auto rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400 disabled:opacity-40">🖨 Xem / In</button>
        <button onClick={() => setGanModal(true)} disabled={!soCau} className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[13px] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40">🎯 Gán vào buổi</button>
        <button onClick={xoaMT} title="Xoá MT" className="rounded-md border border-rose-200 px-3 py-1.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50">🗑 Xoá</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[900px]">
          {ganList.length > 0 && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
              <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Đã gán</p>
              <div className="flex flex-wrap gap-1.5">
                {ganList.map((g) => (
                  <span key={g.taiLieuId} className="flex items-center gap-1.5 rounded-full bg-emerald-50 py-1 pl-2.5 pr-1 text-[12px] font-medium text-emerald-700">
                    {g.lopTen} · {g.ngay.split('-').reverse().join('/')}
                    <button onClick={() => setChiaDe({ taiLieuId: g.taiLieuId, lopId: g.lopId, lopTen: g.lopTen })}
                      title="Chia mã đề theo TỪNG HS trong lớp (in cho cả lớp, trước khi vào buổi) + in"
                      className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100">🎯 Chia đề &amp; In</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="mb-3 text-[12px] text-slate-400">Mỗi câu chọn 1 dạng → hệ gợi ý câu <b>ít dùng nhất</b> (đổi được). Câu không trùng nhau XUYÊN mọi phần của MT này.</p>
          {soCau > 0 && (() => { const base = baseAll(); const t = oTrong().length
            const gen = !!(ch.etMaDe && Object.keys(ch.etMaDe).length); const stale = gen && maDeStale(base, ch)
            return (
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2">
                <span className="text-[12px] font-semibold text-violet-700">🧩 3 mã đề</span>
                <span className="text-[11px] text-slate-500">Đề gốc = các câu dưới; đề 2 &amp; 3 tự sinh — cùng dạng + form, khác câu (xuyên mọi phần).</span>
                <button onClick={sinhMaDe} className="ml-auto rounded-md border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">🎲 {gen ? 'Sinh lại' : 'Sinh'} đề 2 &amp; 3</button>
                {stale ? <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">đã đổi câu — bấm Sinh lại</span>
                  : t ? <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600">{t} ô trống — chọn tay trước khi in</span>
                  : gen ? <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">✓ đủ 3 mã đề</span> : null}
              </div>
            ) })()}
          <div className="space-y-3">
            {phans.map((p) => {
              const rows = rowsByPhan[p.id] ?? []
              return (
                <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{p.tieu_de}</span>
                    <span className="text-[12px] text-slate-400">{rows.filter((r) => r.maCau).length} câu</span>
                    <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-600" title="Hệ đang thấy được phần này (gán vào buổi tự lọc/loại nếu lớp không đủ tư cách)">{nhanHe(bacHieuLucCuaPhan(p.id))}</span>
                    <select value={bacEpCuaPhan(p.id) ?? ''} onChange={(e) => setPhanBac(p.id, e.target.value || null)}
                      title="Ép tay hệ tối thiểu cho CẢ PHẦN (đè lên tự tính theo dạng) — để trống = tự động"
                      className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-500 hover:border-violet-300">
                      <option value="">Tự động</option>
                      {[...lopBacs].sort((a, b) => a.thu_tu - b.thu_tu).map((b) => <option key={b.ma} value={b.ma}>Ép: từ {b.ma} trở lên</option>)}
                    </select>
                    <button onClick={() => xoaPhan(p)} className="ml-auto text-[12px] text-slate-300 hover:text-rose-600">Xoá phần</button>
                  </div>
                  <div className="space-y-2">
                    {rows.map((r, i) => {
                      const c = r.maCau ? cau[r.maCau] : null
                      const form = c ? etFormOf(c, ch) : null
                      const formOpts = ET_FORMS.filter((f) => f.v !== 'trac_nghiem' || !!(c?.lua_chon && c.lua_chon.length))
                      return (
                        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
                          <div className="flex items-start gap-2">
                          <span className="mt-1.5 w-6 shrink-0 text-center text-[13px] font-bold text-violet-600">{i + 1}</span>
                          <button onClick={() => setDangModal({ phanId: p.id, idx: i })} className="w-56 shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-left text-[13px] hover:border-indigo-400">
                            {r.maDang ? <span className="text-slate-700">{tenDang(r.maDang)}</span> : <span className="text-indigo-500">+ chọn dạng…</span>}
                          </button>
                          <div className="min-w-0 flex-1 pt-1">
                            {c ? <div className="truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></div>
                              : r.maDang ? <span className="text-[12px] italic text-slate-400">chưa có câu</span>
                              : <span className="text-[12px] italic text-slate-300">chọn dạng để hệ gợi ý câu</span>}
                            {c && (
                              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500" title="Mã câu">{c.ma_cau}</span>
                                <span className="text-[10px] text-slate-300">kho: {loaiLabel(c.loai_cau)} · in dạng:</span>
                                <div className="flex gap-0.5">
                                  {formOpts.map((f) => (
                                    <button key={f.v} onClick={() => setForm(c.ma_cau, f.v)} title="Form hiển thị trong đề (khác loại kho)"
                                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${form === f.v ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{f.lbl}</button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {c && form === 'tu_luan' && (
                            <label className="flex shrink-0 items-center gap-1 pt-1.5 text-[11px] text-slate-400" title="Số dòng kẻ cho HS viết (bản in)">dòng
                              <input type="number" min={0} max={30} value={ch.btvnLinesByCau?.[c.ma_cau] ?? 4} onChange={(e) => setLines(c.ma_cau, Math.max(0, Math.min(30, +e.target.value || 0)))} className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
                            </label>
                          )}
                          {r.maDang && (
                            <div className="flex shrink-0 gap-1 pt-0.5">
                              <button onClick={() => doiCau(p.id, i)} title="Đổi câu khác (ít dùng kế tiếp)" className="rounded-md bg-indigo-50 px-2 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-100">↻ Đổi</button>
                              <button onClick={() => setPicker({ phanId: p.id, idx: i, maDang: r.maDang! })} className="rounded-md border border-slate-300 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">✎ Chọn</button>
                            </div>
                          )}
                          {c && (
                            <label className="flex shrink-0 items-center gap-1 self-start pt-1.5 text-[11px] text-slate-500" title="Tích = in 2 cột — các câu 2 cột LIỀN NHAU tự xếp cạnh nhau">
                              <input type="checkbox" checked={(ch.colByCau?.[c.ma_cau] ?? 1) === 2} onChange={(e) => setColCau(c.ma_cau, e.target.checked ? 2 : 1)} className="h-3.5 w-3.5 accent-sky-600" />
                              2 cột
                            </label>
                          )}
                          <button onClick={() => xoaRow(p.id, i)} title="Xoá hàng" className="shrink-0 px-1 pt-1 text-[13px] text-slate-300 hover:text-rose-600">✕</button>
                          </div>
                          {/* Mã đề 2 & 3 — câu khác cùng dạng + form với câu gốc; TRỐNG thì chọn tay (giống ET). */}
                          {c && ch.etMaDe?.[c.ma_cau] && (
                            <div className="mt-2 ml-8 space-y-1 border-t border-dashed border-slate-200 pt-2">
                              {[0, 1].map((v) => {
                                const vm = ch.etMaDe?.[c.ma_cau]?.[v] ?? null
                                const vc = vm ? cau[vm] : null
                                const f = etFormOf(c, ch)
                                return (
                                  <div key={v} className="flex items-center gap-2 text-[12px]">
                                    <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">Mã đề {v + 2}</span>
                                    {vm ? (
                                      <>
                                        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">{vm}</span>
                                        <span className="min-w-0 flex-1 truncate text-slate-600">{vc ? <MathText>{vc.noi_dung}</MathText> : '…'}</span>
                                      </>
                                    ) : (
                                      <span className="min-w-0 flex-1 font-medium text-rose-500">⚠ TRỐNG — chưa có câu cùng dạng + form khác</span>
                                    )}
                                    <button onClick={() => setVarPicker({ baseMaCau: c.ma_cau, v, maDang: r.maDang ?? c.dang_chinh, form: f })}
                                      className="shrink-0 rounded-md border border-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-violet-400">✎ {vm ? 'Đổi' : 'Chọn'}</button>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={() => themCau(p.id)} className="mt-2.5 w-full rounded-lg border-2 border-dashed border-violet-200 bg-violet-50/40 py-2 text-[13px] font-medium text-violet-700 hover:bg-violet-50">+ Thêm câu</button>
                </div>
              )
            })}
            <button onClick={themPhan} className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-3 text-[14px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">+ Thêm phần (vd "Phần II. Hình học")</button>
          </div>
        </div>
      </div>

      {dangModal && d && (
        <DangPickerOne khoi={d.khoi} mon={d.mon} onClose={() => setDangModal(null)}
          onPick={(ma) => { const { phanId, idx } = dangModal; setDangModal(null); pickDang(phanId, idx, ma) }} />
      )}
      {picker && (
        <KhoPicker maDangs={[picker.maDang]} cauTbl={cauTbl} selected={rowsByPhan[picker.phanId]?.[picker.idx]?.maCau ? [rowsByPhan[picker.phanId][picker.idx].maCau!] : []} onClose={() => setPicker(null)}
          onConfirm={async (m) => {
            const used = usedGlobal(picker.phanId, picker.idx)
            const pick = m.find((x) => !used.has(x)) ?? m[0] ?? null
            if (pick) await ensureCache(picker.maDang)
            const rows = (rowsByPhan[picker.phanId] ?? []).map((x, i) => (i === picker.idx ? { ...x, maCau: pick } : x))
            await luuPhan(picker.phanId, rows)
            setPicker(null)
          }} />
      )}
      {varPicker && (
        <KhoPicker maDangs={[varPicker.maDang]} cauTbl={cauTbl}
          selected={ch.etMaDe?.[varPicker.baseMaCau]?.[varPicker.v] ? [ch.etMaDe[varPicker.baseMaCau][varPicker.v]!] : []}
          disabled={[...usedMoiDe()]} onClose={() => setVarPicker(null)}
          onConfirm={async (m) => {
            const used = usedMoiDe()
            const pick = m.find((x) => !used.has(x)) ?? m[0] ?? null
            if (pick) {
              const list = await listCauByDang(varPicker.maDang, cauTbl)
              setCau((prev) => ({ ...prev, ...Object.fromEntries(list.map((cc) => [cc.ma_cau, cc])) }))
              await setVar(varPicker.baseMaCau, varPicker.v, pick, varPicker.form)
            }
            setVarPicker(null)
          }} />
      )}
      {ganModal && d && <GanBuoiModal mtId={id} mon={d.mon} ganList={ganList} onClose={() => setGanModal(false)} onDone={async () => { setGanModal(false); await reload() }} />}
      {printing && <MTPrintView id={id} onClose={() => setPrinting(false)} />}
      {chiaDe && <ChiaDeMTModal {...chiaDe} onClose={() => setChiaDe(null)} />}
    </div>
  )
}

// ── GÁN VÀO BUỔI: CHỈ chọn lớp (cùng môn với MT) + ngày (Thùy 07-08: "giờ/GV/phòng thuộc về buổi
// học, MT không cần hỏi lại" — buổi mới (nếu chưa có) tự suy giờ/phòng từ TKB, xem tkbSlotCuaLop mt.ts) ──
function GanBuoiModal({ mtId, mon, ganList, onClose, onDone }: { mtId: string; mon: string; ganList: MTGanRow[]; onClose: () => void; onDone: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [ngay, setNgay] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null)
  useEffect(() => { listLop().then((ls) => setLops(ls.filter((l) => l.mon === mon))) }, [mon])

  // Lớp này đã có 1 lượt gán (từ đúng MT này) rồi — gán ngày khác sẽ THAY THẾ (đè), cảnh báo trước.
  const daGan = lopId ? ganList.find((g) => g.lopId === lopId) : null
  const daySo = (s: string) => s.split('-').reverse().join('/')

  async function xacNhan() {
    if (!lopId || !ngay) return
    if (daGan && daGan.ngay !== ngay) {
      if (!confirm(`Lớp này đã gán MT vào ngày ${daySo(daGan.ngay)}. Gán ngày ${daySo(ngay)} sẽ THAY THẾ — bản gán ngày ${daySo(daGan.ngay)} bị xoá (buổi học ngày đó vẫn còn, chỉ mất nội dung MT). Tiếp tục?`)) return
    }
    setBusy(true)
    try {
      const kq = await ganMTVaoBuoi(mtId, { lopId, ngay })
      // ⭐ 07-12: doc mt_buoi vừa gán ĐỦ NỘI DUNG ngay (copy từ master) — enqueue link luôn.
      useStore.getState().enqueueLinkGen(kq.taiLieuId, 'mt_buoi')
      const loaiMsg = kq.soCauLoai > 0 ? ` (đã tự loại ${kq.soCauLoai} câu nâng cao — lớp này không đủ tư cách theo bậc dạng ở bản đồ kiến thức)` : ''
      setRes({ ok: true, msg: (kq.buoiMoi ? 'Đã tạo buổi mới + gán nội dung MT.' : 'Đã gán nội dung MT vào buổi có sẵn (lớp+ngày này đã có buổi).') + loaiMsg + ' Chấm ở tab "🏆 MT" trong buổi (Buổi học/Việc của tôi).' })
    } catch (e: any) { setRes({ ok: false, msg: e.message ?? String(e) }) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[460px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Gán MT vào buổi</p>
        {res ? (
          <>
            <p className={`mt-3 text-[13px] ${res.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{res.msg}</p>
            <div className="mt-4 flex justify-end gap-2">
              {res.ok && <button onClick={() => setRes(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Gán tiếp lớp khác</button>}
              <button onClick={onDone} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-[12px] text-slate-500">Chọn buổi học (lớp + ngày) để gán nội dung MT vào — MT là 1 tab của buổi đó (giống ET), không tách buổi riêng. Giờ/phòng/GV thuộc về buổi học, sửa ở đó nếu cần.</p>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Lớp ({mon})</label>
            <div className="mt-1"><SearchSelect value={lopId} onChange={setLopId} placeholder="Chọn lớp…" options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `Khối ${l.khoi}` : '' }))} /></div>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Ngày *</label>
            <BuoiNgaySelect lopId={lopId} value={ngay} onChange={setNgay} className={`${inp} mt-1 w-full`} defaultToday />
            {daGan && (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-700">
                ⚠ Lớp này đã gán MT này vào <b>{daySo(daGan.ngay)}</b>{daGan.ngay !== ngay ? ' — chọn "Gán" sẽ THAY THẾ bản gán đó.' : '.'}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
              <button disabled={!lopId || !ngay || busy} onClick={xacNhan} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang gán…' : 'Gán'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════ CHIA ĐỀ THEO HS + IN CẢ LỚP ═══════════
// Thùy: "MT in TRƯỚC khi vào lớp — phải in theo DANH SÁCH LỚP" (khác ET in theo HS CÓ MẶT, vì ET in NGAY
// TRONG buổi, sau điểm danh — hsCoMatCuaBuoi đọc điểm danh CHƯA có lúc phát đề MT). Roster = TOÀN BỘ HS
// đang học của lớp (listHSCuaLop), không phụ thuộc điểm danh. Gán mã đề lưu vào cau_hinh.hsMaDe của BẢN
// mt_buoi (doc đã gán riêng cho lớp này), KHÔNG phải master (master dùng chung cho nhiều lớp khác nhau).
function ChiaDeMTModal({ taiLieuId, lopId, lopTen, onClose }: { taiLieuId: string; lopId: string; lopTen: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true)
  const [phans, setPhans] = useState<PhanResolved[] | null>(null) // giữ để tính base (đủ 3 mã đề?)
  const [ch, setCh] = useState<CauHinh>({})
  const [roster, setRoster] = useState<{ id: string; ho_ten: string; ma_hs: string | null }[]>([])
  const [saved, setSaved] = useState(false)
  const [printing, setPrinting] = useState<{ id: string; ho_ten: string; maDe: number }[] | null>(null)
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  useEffect(() => {
    let alive = true
    setLoading(true)
    Promise.all([getTaiLieuFull(taiLieuId), listHSCuaLop(lopId)]).then(([f, hsl]) => {
      if (!alive) return
      setPhans(f.phans.filter((p) => p.loai_phan === 'custom'))
      setCh(f.taiLieu.cau_hinh ?? {})
      setRoster(
        hsl.map((x) => x.hoc_sinh).filter((h): h is HocSinh => !!h)
          .map((h) => ({ id: h.id, ho_ten: h.ho_ten, ma_hs: h.ma_hs }))
          .sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi')),
      )
    }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [taiLieuId, lopId])

  const base: BaseItem[] = (phans ?? []).flatMap((p) => p.caus.filter((c) => c.ma_cau && c.dang_chinh).map((c) => ({ maDang: c.dang_chinh, maCau: c.ma_cau })))
  // ⭐ KHÔNG dùng maDeReady/maDeStale ở đây (Thùy báo "mỗi lần vào lại mất đề 2/3"): những hàm đó so
  // KHỚP TUYỆT ĐỐI base ↔ etMaDe, đúng cho MTEditor (base = TOÀN BỘ câu của MT master) nhưng SAI ở đây —
  // base của 1 lớp là TẬP CON (ganMTVaoBuoi LỌC BỚT câu nâng cao lớp không đủ bậc, xem mt.ts) trong khi
  // etMaDe copy NGUYÊN từ master nên còn THỪA key của câu đã bị lọc. maDeStale thấy "thừa key" tưởng lệch
  // → báo "chưa đủ 3 mã đề" dù dữ liệu vẫn nguyên ở MT gốc. Ở đây chỉ cần: mọi câu CÒN LẠI (sau lọc) có
  // đủ cặp đề 2/3 — không quan tâm etMaDe dư key của câu đã lọc.
  const deReady = phans != null && !!ch.etMaDe && base.length > 0 && oTrongMaDe(base, ch).length === 0

  async function save(next: CauHinh) { setCh(next); await updateTaiLieu(taiLieuId, { cau_hinh: next }); markSaved() }
  const setHsMa = (hsId: string, maDe: number) => save({ ...ch, hsMaDe: { ...(ch.hsMaDe ?? {}), [hsId]: maDe } })
  const raiTuDong = () => { const m: Record<string, number> = {}; roster.forEach((hs, i) => { m[hs.id] = (i % 3) + 1 }); save({ ...ch, hsMaDe: m }) }
  const inCaLop = () => setPrinting(roster.map((hs) => ({ id: hs.id, ho_ten: hs.ho_ten, maDe: ch.hsMaDe?.[hs.id] ?? 1 })))

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="flex max-h-[85vh] w-[520px] max-w-full flex-col rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center gap-2">
          <p className="text-[15px] font-semibold text-slate-900">Chia đề — {lopTen}</p>
          {saved && <span className="text-[12px] text-emerald-600">✓ Đã lưu</span>}
        </div>
        <p className="mb-3 text-[12px] text-slate-500">In <b>TRƯỚC khi vào buổi</b>, theo danh sách CẢ LỚP (khác ET in theo HS điểm danh có mặt) — chưa điểm danh cũng chia đề được.</p>
        {loading ? <p className="text-[12px] italic text-slate-400">Đang tải…</p>
          : !deReady ? (
            <p className="text-[12px] italic text-amber-600">MT này chưa đủ 3 mã đề (còn ô trống hoặc chưa sinh) — mở MT, bấm "🎲 Sinh đề 2 &amp; 3" cho đủ trước khi chia đề.</p>
          ) : roster.length === 0 ? (
            <p className="text-[12px] italic text-slate-400">Lớp {lopTen} chưa có HS đang học.</p>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2">
                <button onClick={raiTuDong} className="rounded-md border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">🎲 Rải tự động</button>
                <button onClick={inCaLop} className="ml-auto rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-indigo-500">🖨 Xem &amp; In cả lớp</button>
              </div>
              <ol className="min-h-0 flex-1 space-y-1 overflow-auto">
                {roster.map((hs) => { const cur = ch.hsMaDe?.[hs.id]
                  return (
                    <li key={hs.id} className="flex items-center gap-2 rounded-md border border-slate-100 px-2 py-1.5">
                      <span className="min-w-0 flex-1 truncate text-[12px] text-slate-700" title={hs.ma_hs ?? ''}>{hs.ho_ten}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((n) => (
                          <button key={n} onClick={() => setHsMa(hs.id, n)} title={`Mã đề ${n}`}
                            className={`h-6 w-6 rounded text-[12px] font-bold ${cur === n ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{n}</button>
                        ))}
                      </div>
                      <button onClick={() => setPrinting([{ id: hs.id, ho_ten: hs.ho_ten, maDe: ch.hsMaDe?.[hs.id] ?? 1 }])} title="In riêng phiếu HS này" className="shrink-0 text-[13px] text-slate-400 hover:text-indigo-600">🖨</button>
                    </li>
                  )
                })}
              </ol>
              <p className="mt-2 text-[11px] text-slate-400">Rải tự động = xoay vòng 1·2·3 theo thứ tự (HS cạnh nhau khác mã). Chưa gán tay HS nào → mặc định mã đề 1 lúc in.</p>
            </>
          )}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Đóng</button>
        </div>
      </div>
      {printing && <MTPrintView id={taiLieuId} perHS={printing} lopTen={lopTen} onClose={() => setPrinting(null)} />}
    </div>
  )
}
