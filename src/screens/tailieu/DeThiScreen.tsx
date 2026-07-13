// Đề thi (trường/sở) — spec BKDEMY_DETHI_SPEC.md. Đi NGƯỢC giáo trình: đề thật → bóc câu đổ vào
// kho (dual-membership) + giữ TỔ HỢP LIÊN KẾT (thứ tự + phần gốc) dùng thẳng.
// v1: gán DẠNG do NGƯỜI chọn (DangPickerOne, browse cả khối) — KHÔNG auto-classify AI (spec §9 OUT).
import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import {
  listDeThi, createDeThi, renameDeThi, deThiMeta, updateDeThiMeta, attachPdfGoc,
  addPhanDeThi, getPhanCauList, type DeThi, type DeThiMeta,
} from '../../lib/dethi'
import { getTaiLieuFull, deletePhan, setCauOfPhan, khoCuaMon, type PhanResolved } from '../../lib/tailieu'
import { listLop, type Lop } from '../../lib/nhansu'
import { phatHanhTest } from '../../lib/testonline'
import { fileToCanvases, canvasToJpegBase64, cropCanvasBox } from '../../lib/pdfRender'
import { MathText, inp, readClipboardImageFile } from '../kho/ui'
import { CauEditor, type ReviewItem } from '../kho/DangHub'
import DangPickerOne from '../../components/DangPickerOne'
import SearchSelect from '../../components/SearchSelect'
import {
  KHOI_OPTIONS, DEFAULT_KHOI, uploadKhoImage, uploadKhoFile, saveCauToDang, createCauDungSai,
  searchCau, buildKhoIngestPrompt, INGEST_KHO_SCHEMA, parseKhoIngestJson, callGeminiRich,
  type LoaiCau, type MenhDe, type CauTimThay,
} from '../../lib/kho/api'
import DeThiPrintView from './DeThiPrintView'

const MONS = ['Toán', 'KHTN']
const LOAI_LABEL: Record<string, string> = { trac_nghiem: 'Trắc nghiệm', dung_sai: 'Đúng / sai', tra_loi_ngan: 'Trả lời ngắn', tu_luan: 'Tự luận' }
const readB64 = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f) })

// ═══════════ LIST (leaf lamtailieu:de_thi) — chọn đề để sửa / tạo mới ═══════════
export default function DeThiScreen() {
  const me = useStore((s) => s.me)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  const allowedMons = laAdmin ? MONS : MONS.filter((m) => (me?.mons ?? []).includes(m))
  const [mon, setMon] = useState(allowedMons[0] ?? 'Toán')
  useEffect(() => { if (allowedMons.length && !allowedMons.includes(mon)) setMon(allowedMons[0]) }, [allowedMons.join(',')]) // eslint-disable-line
  const [list, setList] = useState<DeThi[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  async function reload() { setLoading(true); try { setList(await listDeThi(mon)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [mon]) // eslint-disable-line

  if (openId) return <DeThiEditor id={openId} onClose={() => { setOpenId(null); reload() }} />

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Đề thi</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">trường/sở — bóc câu vào kho + giữ tổ hợp gốc</span>
        {allowedMons.length > 1 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {allowedMons.map((m) => <button key={m} onClick={() => setMon(m)} className={`rounded-md px-3 py-1 text-[13px] font-medium ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{m}</button>)}
          </div>
        )}
        <button onClick={() => setCreating(true)} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo đề thi mới</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : list.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-400">Chưa có đề thi nào ở môn {mon}.</div>
          : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((d) => {
                const m = deThiMeta(d)
                return (
                  <button key={d.id} onClick={() => setOpenId(d.id)} className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                    <div className="font-medium text-slate-800">{d.ten}</div>
                    <div className="mt-1 text-[12px] text-slate-500">{[m.nguon, m.nam, `Khối ${d.khoi}`].filter(Boolean).join(' · ')}</div>
                  </button>
                )
              })}
            </div>
          )}
      </div>
      {creating && <TaoDeThiModal mon={mon} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); setOpenId(id) }} />}
    </div>
  )
}

function TaoDeThiModal({ mon, onClose, onCreated }: { mon: string; onClose: () => void; onCreated: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [busy, setBusy] = useState(false)
  async function tao() {
    if (!ten.trim()) return
    setBusy(true)
    try { const d = await createDeThi({ ten: ten.trim(), khoi, mon }); onCreated(d.id) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[420px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Tạo đề thi mới</p>
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Tên đề</label>
        <input autoFocus value={ten} onChange={(e) => setTen(e.target.value)} placeholder='vd "Đề thi thử vào 10 — THPT Chuyên Sư Phạm 2024"' className={`${inp} mt-1 w-full`} />
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

// ═══════════ EDITOR (builder) — metadata + đính kèm gốc + phần → câu + bóc câu + in + phát hành ═══════════
export function DeThiEditor({ id, onClose }: { id: string; onClose: () => void }) {
  const [d, setD] = useState<DeThi | null>(null)
  const [phans, setPhans] = useState<PhanResolved[]>([])
  const [ten, setTen] = useState('')
  const [meta, setMetaState] = useState<DeThiMeta | null>(null)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [printing, setPrinting] = useState(false)
  const [bocPhan, setBocPhan] = useState<string | null>(null) // id phần đang bóc câu
  const [phatHanh, setPhatHanh] = useState(false)
  const pdfRef = useRef<HTMLInputElement>(null)
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  async function reload() {
    const full = await getTaiLieuFull(id)
    setD(full.taiLieu as DeThi); setTen(full.taiLieu.ten); setMetaState(deThiMeta(full.taiLieu as DeThi))
    setPhans(full.phans.filter((p) => p.loai_phan === 'custom'))
  }
  useEffect(() => { reload().catch((e) => setErr(e.message ?? String(e))) }, [id]) // eslint-disable-line

  async function saveTen() { if (d && ten.trim() && ten.trim() !== d.ten) { await renameDeThi(id, ten.trim()); markSaved() } }
  async function saveMeta(patch: Partial<DeThiMeta>) {
    const next = { ...(meta as DeThiMeta), ...patch }; setMetaState(next)
    await updateDeThiMeta(id, patch); markSaved()
  }
  async function themPhan() {
    const tieuDe = prompt('Tên phần (vd "Phần I. Trắc nghiệm"):', `Phần ${['I', 'II', 'III', 'IV'][phans.length] ?? phans.length + 1}`)?.trim()
    if (!tieuDe) return
    await addPhanDeThi(id, tieuDe); await reload(); markSaved()
  }
  async function xoaPhan(p: PhanResolved) {
    if (!confirm(`Xoá "${p.tieu_de}"? (câu VẪN CÒN trong kho, chỉ bỏ liên kết khỏi đề)`)) return
    await deletePhan(p.id); await reload(); markSaved()
  }
  async function boUnlink(phanId: string, maCau: string) {
    const p = phans.find((x) => x.id === phanId); if (!p) return
    await setCauOfPhan(phanId, p.caus.map((c) => c.ma_cau).filter((m) => m !== maCau))
    await reload(); markSaved()
  }
  async function uploadGoc(f: File) {
    try { const { url } = await uploadKhoFile(f); await attachPdfGoc(id, url); await reload(); markSaved() }
    catch (e: any) { setErr(e.message ?? String(e)) }
  }

  if (err) return <div className="p-8 text-sm text-rose-600">Lỗi: {err}</div>
  if (!d || !meta) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const soCau = phans.reduce((s, p) => s + p.caus.length, 0)
  const cauTbl = khoCuaMon(d.mon).cauTbl

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        {/* ⭐ 07-12: đề thi cũng autosave từng thao tác (không nút Lưu) — enqueue link ở lúc ĐÓNG, giống
            TaiLieuBuilder (đóng = kết thúc 1 lượt sửa). */}
        <button onClick={() => { useStore.getState().enqueueLinkGen(id, 'de_thi'); onClose() }} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Kho tài liệu</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className="min-w-[280px] flex-1 rounded-md border border-transparent px-2 py-1 text-[15px] font-semibold text-slate-900 hover:border-slate-200 focus:border-indigo-400 focus:outline-none" />
        <span className="rounded bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">{d.mon} · Khối {d.khoi}</span>
        {saved && <span className="text-[12px] text-emerald-600">✓ Đã lưu</span>}
        <span className="text-[12px] text-slate-400">{soCau} câu · {phans.length} phần</span>
        <div className="ml-auto flex items-center gap-2">
          <input ref={pdfRef} type="file" accept="application/pdf" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadGoc(f); e.target.value = '' }} />
          {meta.pdfGocUrl
            ? <a href={meta.pdfGocUrl} target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-400">📎 Xem đề gốc</a>
            : <button onClick={() => pdfRef.current?.click()} className="rounded-md border border-dashed border-slate-300 px-2.5 py-1.5 text-[12px] font-medium text-slate-500 hover:border-indigo-400">📎 Đính kèm đề gốc</button>}
          <button onClick={() => setPhatHanh(true)} disabled={!soCau} className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[13px] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40">📱 Phát hành online</button>
          <button onClick={() => setPrinting(true)} disabled={!soCau} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 Xem / In</button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[1100px]">
          {/* Metadata */}
          <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3 lg:grid-cols-5">
            <MetaField label="Nguồn (trường/sở)"><input defaultValue={meta.nguon} onBlur={(e) => saveMeta({ nguon: e.target.value })} className={inp} /></MetaField>
            <MetaField label="Cấp"><input defaultValue={meta.cap} onBlur={(e) => saveMeta({ cap: e.target.value })} placeholder="vào_10 / thpt_qg…" className={inp} /></MetaField>
            <MetaField label="Năm"><input type="number" defaultValue={meta.nam ?? ''} onBlur={(e) => saveMeta({ nam: e.target.value ? +e.target.value : null })} className={inp} /></MetaField>
            <MetaField label="Thời gian (phút)"><input type="number" defaultValue={meta.thoiGianPhut ?? ''} onBlur={(e) => saveMeta({ thoiGianPhut: e.target.value ? +e.target.value : null })} className={inp} /></MetaField>
            <MetaField label="Thang điểm"><input type="number" defaultValue={meta.thangDiem} onBlur={(e) => saveMeta({ thangDiem: +e.target.value || 10 })} className={inp} /></MetaField>
          </div>

          {/* Phần → câu */}
          <div className="space-y-3">
            {phans.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{p.tieu_de}</span>
                  <span className="text-[12px] text-slate-400">{p.caus.length} câu</span>
                  <button onClick={() => xoaPhan(p)} className="ml-auto text-[12px] text-slate-300 hover:text-rose-600">Xoá phần</button>
                </div>
                {p.caus.length > 0 && (
                  <div className="mb-2 space-y-1.5">
                    {p.caus.map((c, i) => (
                      <div key={c.ma_cau} className="flex items-start gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5">
                        <span className="mt-0.5 w-6 shrink-0 text-center text-[12px] font-bold text-slate-400">{i + 1}</span>
                        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">{c.ma_cau}</span>
                        <span className="min-w-0 flex-1 truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></span>
                        <button onClick={() => boUnlink(p.id, c.ma_cau)} title="Bỏ khỏi đề (câu vẫn còn trong kho)" className="shrink-0 text-[12px] text-slate-300 hover:text-rose-600">✕</button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setBocPhan(p.id)} className="w-full rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/40 py-2 text-[13px] font-medium text-indigo-700 hover:bg-indigo-50">+ Bóc câu vào phần này</button>
              </div>
            ))}
            <button onClick={themPhan} className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-3 text-[14px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">+ Thêm phần (vd "Phần II. Tự luận")</button>
          </div>
        </div>
      </div>

      {bocPhan && (
        <BocCauModal phanId={bocPhan} khoi={d.khoi} mon={d.mon} cauTbl={cauTbl}
          onClose={() => setBocPhan(null)}
          onDone={async () => { setBocPhan(null); await reload(); markSaved() }} />
      )}
      {printing && <DeThiPrintView id={id} onClose={() => setPrinting(false)} />}
      {phatHanh && <PhatHanhModal taiLieuId={id} onClose={() => setPhatHanh(false)} />}
    </div>
  )
}

function MetaField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</label>{children}</div>
}

// ── PHÁT HÀNH ONLINE — đề thi không tự bám lớp+ngày như ET/BTVN → chọn lớp + hạn nộp tại đây ──
function PhatHanhModal({ taiLieuId, onClose }: { taiLieuId: string; onClose: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [ngay, setNgay] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null)
  useEffect(() => { listLop().then(setLops) }, [])
  async function xacNhan() {
    if (!lopId || !ngay) return
    setBusy(true)
    try {
      const kq = await phatHanhTest(taiLieuId, { lopId, ngay })
      setRes({ ok: true, msg: `Đã phát hành ${kq.added} câu cho lớp thi online. ${kq.skipped.length ? `${kq.skipped.length} câu bị bỏ qua (chưa hỗ trợ online).` : ''}` })
    } catch (e: any) { setRes({ ok: false, msg: e.message ?? String(e) }) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[440px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Phát hành đề thi online</p>
        {res ? (
          <>
            <p className={`mt-3 text-[13px] ${res.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{res.msg}</p>
            <div className="mt-4 text-right"><button onClick={onClose} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button></div>
          </>
        ) : (
          <>
            <p className="mt-1 text-[12px] text-slate-500">Đề thi = chế độ THI (giấu đáp án tới khi nộp, chấm server, chỉ tính lần nộp đầu — như ET).</p>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Lớp</label>
            <div className="mt-1"><SearchSelect value={lopId} onChange={setLopId} placeholder="Chọn lớp…" options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} /></div>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Ngày thi</label>
            <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className={`${inp} mt-1 w-full`} />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
              <button disabled={!lopId || !ngay || busy} onClick={xacNhan} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang phát hành…' : 'Phát hành'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── BÓC CÂU (tái dùng engine nhập-kho: Gemini flat parse, KHÔNG classify AI — người tự gán dạng) ──
type BItem = {
  loai_cau: LoaiCau
  noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon: string[] | null
  menhDe: { noi_dung: string; dap_an: 'D' | 'S'; loi_giai: string | null; maDang: string | null }[] | null
  anhDe: string | null; anhDapAn: string | null
  maDang: string | null; chuyenDeRep: string | null
  nguonGiai: 'nguoi' | 'ai'
  linkExisting: string | null // đã chọn câu CÓ SẴN trong kho (chống trùng) — bỏ qua tạo mới, chỉ liên kết
  saved: boolean
}
function BocCauModal({ phanId, khoi, mon, cauTbl, onClose, onDone }: { phanId: string; khoi: string; mon: string; cauTbl: string; onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [coHinh, setCoHinh] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [items, setItems] = useState<BItem[]>([])
  const [idx, setIdx] = useState(0)
  const [edit, setEdit] = useState(false)
  const [dangModal, setDangModal] = useState<number | 'chuyenDeRep' | null>(null)
  const [dsDangModal, setDsDangModal] = useState<{ item: number; k: number } | null>(null)
  const [tim, setTim] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  useEffect(() => { setEdit(false) }, [idx])

  async function pasteFile() {
    try { const f = await readClipboardImageFile(); if (f) setFile(f) } catch { /* */ }
  }
  const patch = (p: Partial<BItem>) => setItems((a) => a.map((x, i) => (i === idx ? { ...x, ...p } : x)))

  async function boc() {
    if (!file) return
    setBusy(true); setErr(null); setItems([]); setIdx(0)
    try {
      const b64 = await readB64(file)
      const canvases = await fileToCanvases(file.type, b64)
      const raw: BItem[] = []
      for (let p = 0; p < canvases.length; p++) {
        setMsg(`Đang bóc trang ${p + 1}/${canvases.length}…`)
        const c = canvases[p]
        const files = coHinh ? [{ mimeType: 'image/jpeg', dataBase64: canvasToJpegBase64(c) }] : [{ mimeType: file.type, dataBase64: b64 }]
        const { text } = await callGeminiRich(buildKhoIngestPrompt({}), { schema: INGEST_KHO_SCHEMA, files })
        for (const cau of parseKhoIngestJson(text)) {
          let anhDe: string | null = null
          if (coHinh && cau.coHinh && cau.box) {
            try { const blob = await (await fetch(cropCanvasBox(c, cau.box))).blob(); anhDe = await uploadKhoImage(new File([blob], 'fig.png', { type: 'image/png' })) } catch { /* bỏ hình lỗi */ }
          }
          raw.push({
            loai_cau: cau.loai_cau, noi_dung: cau.noi_dung, dap_an: cau.dap_an, loi_giai: cau.loi_giai, lua_chon: cau.lua_chon,
            menhDe: cau.menh_de ? cau.menh_de.map((m) => ({ ...m, maDang: null })) : null,
            anhDe, anhDapAn: null, maDang: null, chuyenDeRep: null, nguonGiai: cau.loi_giai ? 'nguoi' : 'nguoi',
            linkExisting: null, saved: false,
          })
        }
        if (!coHinh) break
      }
      if (!raw.length) throw new Error('AI không tách được câu nào — thử bật “Có hình” / ảnh nét hơn.')
      setItems(raw); setIdx(0)
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false); setMsg('') }
  }

  async function duyet() {
    const r = items[idx]; if (!r) return
    setBusy(true); setErr(null)
    try {
      let maCau: string
      if (r.linkExisting) {
        maCau = r.linkExisting // chống trùng: dùng câu CÓ SẴN, không tạo mới (dual-membership)
      } else if (r.loai_cau === 'dung_sai') {
        if (!r.chuyenDeRep || !r.menhDe?.every((m) => m.maDang)) throw new Error('Gán đủ dạng cho 4 mệnh đề trước khi lưu.')
        const menhDe: MenhDe[] = r.menhDe.map((m) => ({ noi_dung: m.noi_dung, dap_an: m.dap_an, ma_dang: m.maDang!, loi_giai: m.loi_giai }))
        const c = await createCauDungSai({ dang_chinh: r.chuyenDeRep, noi_dung: r.noi_dung, loi_giai: r.loi_giai, menh_de: menhDe, anh_de: r.anhDe }, cauTbl)
        maCau = c.ma_cau
      } else {
        if (!r.maDang) throw new Error('Chọn dạng trước khi lưu.')
        maCau = await saveCauToDang({ dangChinh: r.maDang, loaiCau: r.loai_cau, noi_dung: r.noi_dung, dap_an: r.dap_an, loi_giai: r.loi_giai, lua_chon: r.lua_chon, anh_de: r.anhDe, anh_dap_an: r.anhDapAn, nguon_giai: r.nguonGiai }, cauTbl)
      }
      // append CUỐI danh sách câu hiện có của phần (giữ thứ tự gốc — bóc câu nào nối câu đó).
      const cur = await getPhanCauList(phanId)
      await setCauOfPhan(phanId, [...cur, maCau])
      setItems((a) => a.map((x, i) => (i === idx ? { ...x, saved: true } : x)))
      const nxt = items.findIndex((x, i) => i > idx && !x.saved)
      if (nxt >= 0) setIdx(nxt)
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }

  if (!items.length) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
        <div className="w-[560px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <p className="text-[15px] font-semibold text-slate-900">Bóc câu từ đề</p>
          <p className="mt-1 text-[12px] text-slate-500">Tải PDF/ảnh trang đề → hệ tách từng câu → bạn gán dạng rồi duyệt từng câu.</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button onClick={() => fileRef.current?.click()} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400">📎 Chọn file</button>
            <button onClick={pasteFile} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400">📋 Dán ảnh (Ctrl+V)</button>
            <input ref={fileRef} type="file" accept="application/pdf,image/*" hidden onChange={(e) => { setFile(e.target.files?.[0] ?? null); e.target.value = '' }} />
            {file && <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[12px] text-slate-600">📄 {file.name || 'ảnh đã dán'}<button onClick={() => setFile(null)} className="text-rose-500">✕</button></span>}
          </div>
          <label className="mt-3 flex items-center gap-2 text-[13px] text-slate-600"><input type="checkbox" checked={coHinh} onChange={(e) => setCoHinh(e.target.checked)} />📐 Có hình (cắt ảnh đề)</label>
          {err && <p className="mt-2 text-[13px] text-red-600">{err}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Đóng</button>
            <button disabled={!file || busy} onClick={boc} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? (msg || 'Đang bóc…') : 'Bóc câu'}</button>
          </div>
        </div>
      </div>
    )
  }

  const r = items[idx]
  const isDS = r.loai_cau === 'dung_sai'
  const soXong = items.filter((x) => x.saved).length
  const flatRI: ReviewItem = { noi_dung: r.noi_dung, dap_an: r.dap_an ?? '', loi_giai: r.loi_giai ?? '', luaChon: r.lua_chon, anhDe: r.anhDe, anhDapAn: r.anhDapAn, nguonGiai: r.nguonGiai, approved: true, isGoc: false }
  const onFlat = (p: Partial<ReviewItem>) => {
    const q: Partial<BItem> = {}
    if (p.noi_dung !== undefined) q.noi_dung = p.noi_dung
    if (p.dap_an !== undefined) q.dap_an = p.dap_an
    if (p.loi_giai !== undefined) { q.loi_giai = p.loi_giai; q.nguonGiai = 'nguoi' }
    if (p.luaChon !== undefined) q.lua_chon = p.luaChon
    if (p.anhDe !== undefined) q.anhDe = p.anhDe
    if (p.anhDapAn !== undefined) q.anhDapAn = p.anhDapAn
    patch(q)
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[6%] inset-y-6 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#f5f5f7] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-none items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
          <span className="text-[14px] font-semibold text-slate-900">Bóc câu · Câu {idx + 1}/{items.length} · xong {soXong}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setTim((v) => !v)} className="rounded-full bg-sky-50 px-3 py-1 text-[12px] font-medium text-sky-700 hover:bg-sky-100">🔍 Câu có sẵn (chống trùng)</button>
            <button onClick={onClose} className="text-[12px] text-slate-400 hover:text-slate-600">Bóc file khác</button>
            <button onClick={onDone} className="rounded-lg bg-slate-800 px-3 py-1.5 text-[12px] font-medium text-white">✓ Xong, đóng</button>
          </div>
        </div>
        <div className="flex flex-none items-center gap-3 px-6 py-2">
          <div className="flex flex-1 gap-1">{items.map((x, i) => <button key={i} onClick={() => setIdx(i)} className={`h-[6px] flex-1 rounded-full ${x.saved ? 'bg-indigo-500' : i === idx ? 'bg-slate-400' : 'bg-slate-200'}`} />)}</div>
        </div>
        {tim && <CauCoSanBox cauTbl={cauTbl} onPick={(ma) => { patch({ linkExisting: ma }); setTim(false) }} />}

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
          <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-none flex-wrap items-center gap-3 border-b border-slate-100 pb-3">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-medium text-slate-600">{LOAI_LABEL[r.loai_cau]}</span>
              {r.saved && <span className="text-[12px] text-emerald-600">✓ đã lưu</span>}
              {r.linkExisting && <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[12px] font-medium text-sky-700">🔗 dùng câu có sẵn: {r.linkExisting}</span>}
              {!isDS && !r.linkExisting && (
                <div className="min-w-[280px] flex-1">
                  <button onClick={() => setDangModal(idx)} disabled={r.saved} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-left text-[13px] hover:border-indigo-400 disabled:opacity-60">
                    {r.maDang ? <span className="font-medium text-indigo-700">Dạng: {r.maDang}</span> : <span className="text-indigo-500">+ Chọn dạng…</span>}
                  </button>
                </div>
              )}
            </div>
            {isDS && !r.linkExisting
              ? <div className="min-h-0 flex-1 overflow-auto"><DungSaiBoc r={r} edit={edit && !r.saved} onPatch={patch} khoi={khoi} mon={mon} onOpenDang={(k) => setDsDangModal({ item: idx, k })} onOpenChuyenDe={() => setDangModal('chuyenDeRep')} /></div>
              : !r.linkExisting ? <div className="min-h-0 flex-1"><CauEditor item={flatRI} fill onChange={onFlat} /></div>
              : <div className="min-h-0 flex-1 overflow-auto rounded-lg bg-slate-50 p-4 text-[14px] text-slate-700"><MathText>{r.noi_dung}</MathText></div>}

            <div className="flex flex-none items-center justify-between border-t border-slate-100 pt-3">
              <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-500 disabled:opacity-40">← Trước</button>
              {err && <span className="px-2 text-[12px] text-red-600">{err}</span>}
              <div className="flex items-center gap-2">
                {busy && msg && <span className="text-[12px] text-slate-400">{msg}</span>}
                <button disabled={idx >= items.length - 1} onClick={() => setIdx(idx + 1)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-500 disabled:opacity-40">Bỏ qua</button>
                {!r.saved && <button disabled={busy} onClick={duyet} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">✓ Duyệt · thêm vào phần</button>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {dangModal !== null && dangModal !== 'chuyenDeRep' && (
        <DangPickerOne khoi={khoi} mon={mon} onClose={() => setDangModal(null)} onPick={(ma) => { const i = dangModal as number; setDangModal(null); setItems((a) => a.map((x, j) => (j === i ? { ...x, maDang: ma } : x))) }} />
      )}
      {dangModal === 'chuyenDeRep' && (
        <DangPickerOne khoi={khoi} mon={mon} onClose={() => setDangModal(null)} onPick={(ma) => { setDangModal(null); patch({ chuyenDeRep: ma }) }} />
      )}
      {dsDangModal && (
        <DangPickerOne khoi={khoi} mon={mon} onClose={() => setDsDangModal(null)} onPick={(ma) => {
          const { k } = dsDangModal; setDsDangModal(null)
          patch({ menhDe: (items[idx].menhDe ?? []).map((m, i) => (i === k ? { ...m, maDang: ma } : m)) })
        }} />
      )}
    </div>
  )
}
// Tìm câu có sẵn trong kho (chống trùng) — search theo mã/nội dung, chọn = liên kết thay vì tạo mới.
function CauCoSanBox({ cauTbl, onPick }: { cauTbl: string; onPick: (maCau: string) => void }) {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<CauTimThay[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const term = q.trim()
    if (!term) { setRows([]); return }
    setLoading(true)
    const t = setTimeout(() => { searchCau(term, cauTbl).then(setRows).finally(() => setLoading(false)) }, 300)
    return () => clearTimeout(t)
  }, [q, cauTbl])
  return (
    <div className="flex-none border-b border-slate-200 bg-sky-50/50 px-6 py-3">
      <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Gõ mã câu hoặc nội dung để tìm câu ĐÃ CÓ trong kho…" className={`${inp} w-full bg-white`} />
      {loading && <p className="mt-1 text-[12px] text-slate-400">Đang tìm…</p>}
      {!!rows.length && (
        <div className="mt-2 max-h-48 space-y-1.5 overflow-auto">
          {rows.map((c) => (
            <button key={c.ma_cau} onClick={() => onPick(c.ma_cau)} className="block w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left hover:border-sky-400">
              <div className="mb-0.5 flex items-center gap-2 text-[11px]"><span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-500">{c.ma_cau}</span><span className="text-slate-400">{c.dangTen}</span></div>
              <div className="truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Đúng/Sai bóc: đề chung + 4 mệnh đề (mỗi mệnh đề gán dạng riêng qua DangPickerOne) — mirror nhapkho DungSaiEditor.
function DungSaiBoc({ r, edit, onPatch, onOpenDang, onOpenChuyenDe }: {
  r: BItem; edit: boolean; onPatch: (p: Partial<BItem>) => void; khoi: string; mon: string
  onOpenDang: (k: number) => void; onOpenChuyenDe: () => void
}) {
  const setMD = (k: number, p: Partial<NonNullable<BItem['menhDe']>[number]>) => onPatch({ menhDe: (r.menhDe ?? []).map((m, i) => (i === k ? { ...m, ...p } : m)) })
  return (
    <div>
      {r.chuyenDeRep && <button onClick={onOpenChuyenDe} className="mb-2 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] text-indigo-700">📁 Cả câu neo dạng: {r.chuyenDeRep} (bấm đổi)</button>}
      <div className="mb-1 text-[12px] text-slate-400">Đề chung</div>
      {edit
        ? <textarea value={r.noi_dung} onChange={(e) => onPatch({ noi_dung: e.target.value })} className={`${inp} min-h-[64px] resize-y font-mono text-[12px]`} />
        : <div className="rounded-lg bg-slate-50 px-3 py-2 text-[14px] leading-relaxed text-slate-800"><MathText>{r.noi_dung}</MathText></div>}
      {r.anhDe && <img src={r.anhDe} alt="hình đề" className="mt-2 max-h-56 rounded-lg border border-slate-200" />}
      <div className="mt-3 text-[12px] text-slate-400">4 mệnh đề — mỗi mệnh đề 1 dạng riêng</div>
      <div className="mt-1.5 space-y-2">
        {(r.menhDe ?? []).map((m, k) => (
          <div key={k} className="rounded-lg border border-slate-200 p-2.5">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-5 w-5 flex-none rounded bg-violet-100 text-center text-[11px] font-medium leading-5 text-violet-700">{'abcd'[k]}</span>
              {edit
                ? <textarea value={m.noi_dung} onChange={(e) => setMD(k, { noi_dung: e.target.value })} className={`${inp} min-h-[40px] resize-y text-[12px]`} />
                : <span className="min-w-0 flex-1 text-[14px] text-slate-800"><MathText>{m.noi_dung}</MathText></span>}
              <div className="flex flex-none gap-1">
                {(['D', 'S'] as const).map((v) => (
                  <button key={v} disabled={!edit} onClick={() => setMD(k, { dap_an: v })} className={`h-6 w-7 rounded text-[11px] font-medium disabled:opacity-100 ${m.dap_an === v ? (v === 'D' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white') : 'bg-slate-100 text-slate-400'}`}>{v === 'D' ? 'Đ' : 'S'}</button>
                ))}
              </div>
            </div>
            <div className="mt-2 pl-7">
              <button onClick={() => onOpenDang(k)} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[12px] hover:border-indigo-400">
                {m.maDang ? <span className="font-medium text-indigo-700">Dạng: {m.maDang}</span> : <span className="text-indigo-500">+ Chọn dạng…</span>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
