// Ô soạn lời giải của tool giải bài: MathTextarea (Ctrl+M công thức · phím tắt cá nhân · nút ⤢ mở trình soạn thảo
// full màn SoanModal) + thanh chèn ảnh vào giữa lời giải + ô ảnh lời giải riêng + đáp án (câu kho chưa có).
// KHÔNG import DangHub (kéo cả CumBai/PdfRender/Gemini vào bundle) — chỉ lấy đúng 2 mảnh nhỏ dùng chung.
import { useRef, useState } from 'react'
import { MathTextarea } from '../../components/math/MathTextarea'
import { ImgInsertBar, insertImageAtCursor } from '../../components/ImgInsertBar'
import { uploadKhoImage } from '../../lib/kho/api'
import type { NoiDungGiai } from '../../lib/giaibai'

export function AnhSlot({ url, onChange }: { url: string | null; onChange: (v: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const load = async (f: File | null | undefined) => {
    if (!f || !f.type.startsWith('image/')) return
    setBusy(true)
    try { onChange(await uploadKhoImage(f)) } catch (e: any) { alert('Upload ảnh lỗi: ' + (e?.message ?? e)) } finally { setBusy(false) }
  }
  if (url) return (
    <div className="relative inline-block max-w-full">
      <img src={url} alt="ảnh lời giải" className="max-h-56 w-auto max-w-full rounded-lg border border-slate-200 bg-white" />
      <button onClick={() => onChange(null)} title="Gỡ ảnh" className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-[12px] text-rose-500 shadow hover:bg-rose-50">✕</button>
    </div>
  )
  return (
    <div tabIndex={0} onPaste={(e) => { const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith('image/')); if (f) { e.preventDefault(); void load(f) } }}
      className="flex min-h-[96px] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-center text-[12px] text-slate-500 hover:border-indigo-400 focus:border-indigo-400 focus:outline-none"
      onClick={() => ref.current?.click()}>
      <span>{busy ? '⏳ Đang tải…' : '🖼 Chọn ảnh lời giải'}</span>
      <span className="text-[11px] text-slate-400">hoặc bấm vào ô rồi Ctrl+V dán ảnh</span>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { void load(e.target.files?.[0]); e.target.value = '' }} />
    </div>
  )
}

export default function GiaiEditor({ initial, hoiDapAn, tieuDe, busy, onLuuNhap, onNop, onClose }: {
  initial: NoiDungGiai; hoiDapAn: boolean; tieuDe: string; busy: boolean
  onLuuNhap: (a: NoiDungGiai) => Promise<void>; onNop: (a: NoiDungGiai) => Promise<void>; onClose: () => void
}) {
  const [loiGiai, setLoiGiai] = useState(initial.loiGiai ?? '')
  const [anh, setAnh] = useState<string | null>(initial.anh)
  const [dapAn, setDapAn] = useState(initial.dapAn ?? '')
  const [err, setErr] = useState<string | null>(null)
  const [daLuu, setDaLuu] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const ok = !!loiGiai.trim() || !!anh
  const gom = (): NoiDungGiai => ({ loiGiai: loiGiai.trim() || null, anh, dapAn: hoiDapAn ? dapAn.trim() || null : null })
  async function luu() {
    setErr(null)
    try { await onLuuNhap(gom()); setDaLuu(true); setTimeout(() => setDaLuu(false), 2000) } catch (e: any) { setErr(e.message ?? String(e)) }
  }
  async function nop() {
    if (!ok || !confirm('Nộp lời giải để học thuật duyệt? Sau khi nộp không sửa được cho tới khi có kết quả duyệt.')) return
    setErr(null)
    try { await onNop(gom()) } catch (e: any) { setErr(e.message ?? String(e)) }
  }
  return (
    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
      <div className="grid grid-cols-[1fr_280px] gap-3">
        <div className="flex min-h-0 flex-col">
          <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Lời giải <span className="font-normal normal-case text-slate-400">— gõ LaTeX trong $…$, Ctrl+M mở ô công thức, nút ⤢ mở trình soạn thảo, dán ảnh vào giữa được</span>
          </div>
          <ImgInsertBar taRef={taRef} value={loiGiai} onChange={setLoiGiai} className="mb-1" />
          <MathTextarea ref={taRef} value={loiGiai} onChange={setLoiGiai} soanTitle={tieuDe} wrapClassName="flex min-h-0 flex-1 flex-col"
            onPaste={(e) => { const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith('image/')); if (f) { e.preventDefault(); e.stopPropagation(); void insertImageAtCursor(f, taRef, loiGiai, setLoiGiai).catch((err: any) => alert('Upload ảnh lỗi: ' + (err?.message ?? err))) } }}
            className="min-h-[180px] w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[13px] leading-relaxed focus:border-emerald-400 focus:outline-none" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Ảnh lời giải (tuỳ chọn)</div>
          <AnhSlot url={anh} onChange={setAnh} />
          {hoiDapAn && (
            <>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Đáp án ngắn (tuỳ chọn)</div>
              <input value={dapAn} onChange={(e) => setDapAn(e.target.value)} placeholder="vd: x = 3"
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] focus:border-emerald-400 focus:outline-none" />
            </>
          )}
        </div>
      </div>
      {err && <p className="mt-2 text-xs text-rose-600">{err}</p>}
      <div className="mt-3 flex items-center gap-2">
        <span className="mr-auto text-[12px] text-slate-400">Cần lời giải text HOẶC ảnh. Nháp tự giữ trên hệ thống — đóng rồi mở lại vẫn còn.</span>
        <button onClick={onClose} disabled={busy} className="rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Đóng</button>
        <button onClick={luu} disabled={busy} className="rounded-md border border-slate-300 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40">
          {daLuu ? '✓ Đã lưu nháp' : '💾 Lưu nháp'}
        </button>
        <button onClick={nop} disabled={!ok || busy} className="rounded-md bg-emerald-600 px-4 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
          {busy ? '⏳…' : '📤 Nộp duyệt'}
        </button>
      </div>
    </div>
  )
}
