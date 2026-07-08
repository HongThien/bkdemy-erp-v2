// Màn "MT" (kỳ thi lớn, "Grand Slam") — soạn nội dung ĐỘC LẬP (nhiều phần/chuyên đề, mỗi phần chọn
// câu theo cơ chế ET: chọn dạng → hệ gợi ý câu ít-dùng-nhất → ✎ Chọn/↻ Đổi — KHÔNG bóc-ảnh như Đề
// thi) rồi GÁN vào buổi (lớp+ngày) khi cần dùng. Khác ET: ET = 1 lớp+ngày cố định lúc tạo; MT tạo
// xong nằm ở Kho tài liệu như 1 MẪU, gán được cho NHIỀU lớp/nhiều lần (giống mô hình Đề thi).
// Phạm vi hiện tại: soạn + gán buổi. Chấm MT trong buổi (Đ/C/S, đóng phase, Elo K=60) = lượt sau.
import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import {
  listMT, createMT, renameMT, addPhanMT, ganMTVaoBuoi, listGanMT,
  type MTGanRow,
} from '../../lib/mt'
import {
  getTaiLieuFull, deletePhan, setCauOfPhan, suggestCauForDang, khoCuaMon, updateTaiLieu,
  ET_FORMS, etFormOf, type PhanResolved, type CauHinh, type ETForm as ETFormKind,
} from '../../lib/tailieu'
import { listLop, type Lop } from '../../lib/nhansu'
import { listCauByDang, LOAI_CAU, KHOI_OPTIONS, DEFAULT_KHOI, type CauHoi } from '../../lib/kho/api'
import { MathText, inp } from '../kho/ui'
import { KhoPicker } from './TaiLieuBuilder'
import DangPickerOne from '../../components/DangPickerOne'
import SearchSelect from '../../components/SearchSelect'

const MONS = ['Toán', 'KHTN']
const DEFAULT_ROWS_PER_PHAN = 3
type Row = { maDang: string | null; maCau: string | null }
const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v

// ═══════════ LIST (leaf lamtailieu:mt) — chọn MT để sửa / tạo mới ═══════════
export default function MTScreen() {
  const me = useStore((s) => s.me)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  const allowedMons = laAdmin ? MONS : MONS.filter((m) => (me?.mons ?? []).includes(m))
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
                <button key={d.id} onClick={() => setOpenId(d.id)} className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                  <div className="font-medium text-slate-800">{d.ten}</div>
                  <div className="mt-1 text-[12px] text-slate-500">Khối {d.khoi}</div>
                </button>
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
  const [dangOpts, setDangOpts] = useState<{ ma_dang: string; ten_dang: string; ten_chuyen_de: string }[]>([])
  const [ch, setCh] = useState<CauHinh>({}) // cấu hình chỉnh dòng (etFormByCau/btvnLinesByCau) — giống ET
  const [ten, setTen] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ganModal, setGanModal] = useState(false)
  const [ganList, setGanList] = useState<MTGanRow[]>([])
  const [picker, setPicker] = useState<{ phanId: string; idx: number; maDang: string } | null>(null)
  const [dangModal, setDangModal] = useState<{ phanId: string; idx: number } | null>(null)
  const cauTbl = d ? khoCuaMon(d.mon).cauTbl : 'dai_cau_hoi'
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  async function reload() {
    setLoading(true)
    try {
      const full = await getTaiLieuFull(id)
      setD(full.taiLieu as any); setTen(full.taiLieu.ten); setCh(full.taiLieu.cau_hinh ?? {})
      const ps = full.phans.filter((p) => p.loai_phan === 'custom')
      setPhans(ps)
      const rb: Record<string, Row[]> = {}
      const c: Record<string, CauHoi> = {}
      for (const p of ps) {
        rb[p.id] = p.caus.map((x) => ({ maDang: x.dang_chinh, maCau: x.ma_cau }))
        for (const x of p.caus) c[x.ma_cau] = x
      }
      setRowsByPhan(rb); setCau((prev) => ({ ...prev, ...c }))
      setGanList(await listGanMT(id))
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [id]) // eslint-disable-line
  useEffect(() => {
    if (!d?.khoi) { setDangOpts([]); return }
    khoCuaMon(d.mon).listMap(d.khoi).then((ds) => setDangOpts(ds.map((x) => ({ ma_dang: x.leafMa, ten_dang: x.leafTen, ten_chuyen_de: x.t2Ten })))).catch(() => { /* */ })
  }, [d?.khoi, d?.mon])

  const tenDang = (md: string | null) => dangOpts.find((x) => x.ma_dang === md)?.ten_dang ?? md ?? ''
  async function saveTen() { if (d && ten.trim() && ten.trim() !== d.ten) { await renameMT(id, ten.trim()); markSaved() } }

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

  if (loading || !d) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const soCau = Object.values(rowsByPhan).reduce((s, rows) => s + rows.filter((r) => r.maCau).length, 0)

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Kho tài liệu</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className="min-w-[260px] flex-1 rounded-md border border-transparent px-2 py-1 text-[15px] font-semibold text-slate-900 hover:border-slate-200 focus:border-indigo-400 focus:outline-none" />
        <span className="rounded bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">{d.mon} · Khối {d.khoi} · mẫu độc lập</span>
        {saved && <span className="text-[12px] text-emerald-600">✓ Đã lưu</span>}
        <span className="text-[12px] text-slate-400">{soCau} câu · {phans.length} phần{ganList.length ? ` · đã gán ${ganList.length} lớp` : ''}</span>
        <button onClick={() => setGanModal(true)} disabled={!soCau} className="ml-auto rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[13px] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40">🎯 Gán vào buổi</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[900px]">
          {ganList.length > 0 && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
              <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Đã gán</p>
              <div className="flex flex-wrap gap-1.5">
                {ganList.map((g) => <span key={g.taiLieuId} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">{g.lopTen} · {g.ngay.split('-').reverse().join('/')}</span>)}
              </div>
            </div>
          )}
          <p className="mb-3 text-[12px] text-slate-400">Mỗi câu chọn 1 dạng → hệ gợi ý câu <b>ít dùng nhất</b> (đổi được). Câu không trùng nhau XUYÊN mọi phần của MT này.</p>
          <div className="space-y-3">
            {phans.map((p) => {
              const rows = rowsByPhan[p.id] ?? []
              return (
                <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{p.tieu_de}</span>
                    <span className="text-[12px] text-slate-400">{rows.filter((r) => r.maCau).length} câu</span>
                    <button onClick={() => xoaPhan(p)} className="ml-auto text-[12px] text-slate-300 hover:text-rose-600">Xoá phần</button>
                  </div>
                  <div className="space-y-2">
                    {rows.map((r, i) => {
                      const c = r.maCau ? cau[r.maCau] : null
                      const form = c ? etFormOf(c, ch) : null
                      const formOpts = ET_FORMS.filter((f) => f.v !== 'trac_nghiem' || !!(c?.lua_chon && c.lua_chon.length))
                      return (
                        <div key={i} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
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
                          <button onClick={() => xoaRow(p.id, i)} title="Xoá hàng" className="shrink-0 px-1 pt-1 text-[13px] text-slate-300 hover:text-rose-600">✕</button>
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
      {ganModal && d && <GanBuoiModal mtId={id} mon={d.mon} onClose={() => setGanModal(false)} onDone={async () => { setGanModal(false); await reload() }} />}
    </div>
  )
}

// ── GÁN VÀO BUỔI: CHỈ chọn lớp (cùng môn với MT) + ngày (Thùy 07-08: "giờ/GV/phòng thuộc về buổi
// học, MT không cần hỏi lại" — buổi mới (nếu chưa có) tự suy giờ/phòng từ TKB, xem tkbSlotCuaLop mt.ts) ──
function GanBuoiModal({ mtId, mon, onClose, onDone }: { mtId: string; mon: string; onClose: () => void; onDone: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [ngay, setNgay] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null)
  useEffect(() => { listLop().then((ls) => setLops(ls.filter((l) => l.mon === mon))) }, [mon])

  async function xacNhan() {
    if (!lopId || !ngay) return
    setBusy(true)
    try {
      const kq = await ganMTVaoBuoi(mtId, { lopId, ngay })
      setRes({ ok: true, msg: kq.buoiMoi ? 'Đã tạo buổi mới + gán nội dung MT. Chấm ở tab "🏆 MT" trong buổi (Buổi học/Việc của tôi).' : 'Đã gán nội dung MT vào buổi có sẵn (lớp+ngày này đã có buổi). Chấm ở tab "🏆 MT" trong buổi đó.' })
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
            <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className={`${inp} mt-1 w-full`} />
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
