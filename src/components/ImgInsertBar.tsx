// Toolbar CHÈN ẢNH INLINE dùng CHUNG cho mọi ô soạn nội dung có MathText: lời giải câu, lý thuyết
// chuyên đề/dạng, lời giải Đúng/Sai… Upload lên Supabase Storage (bucket kho-anh) → chèn markdown
// ![](url) NGAY TẠI con trỏ của textarea được trỏ tới. DB chỉ lưu LINK (giống ô Ảnh đề/Ảnh giải).
import { useRef, useState } from 'react'
import { uploadKhoImage } from '../lib/kho/api'
import { readClipboardImageFile } from '../screens/kho/ui'
import PdfCropper from './PdfCropper'

// Upload 1 file ảnh → chèn ![](url) vào con trỏ của textarea (dùng cho onPaste thẳng trong ô).
export async function insertImageAtCursor(
  file: File | null | undefined,
  taRef: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  onChange: (v: string) => void,
): Promise<void> {
  if (!file || !file.type.startsWith('image/')) return
  const u = await uploadKhoImage(file)
  const ta = taRef.current
  const a = ta?.selectionStart ?? value.length, b = ta?.selectionEnd ?? value.length
  onChange(value.slice(0, a) + `\n![](${u})\n` + value.slice(b))
}

export function ImgInsertBar({ taRef, value, onChange, className }: {
  taRef: React.RefObject<HTMLTextAreaElement | null>; value: string; onChange: (v: string) => void; className?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [crop, setCrop] = useState(false)
  const run = async (f: File | null | undefined) => {
    if (!f || !f.type.startsWith('image/')) return
    setBusy(true)
    try { await insertImageAtCursor(f, taRef, value, onChange) }
    catch (e: any) { alert('Upload ảnh lỗi: ' + (e?.message ?? e)) }
    finally { setBusy(false); setCrop(false) }
  }
  const pasteClip = async () => {
    try { const f = await readClipboardImageFile(); if (f) void run(f); else alert('Clipboard không có ảnh — copy ảnh trước.') }
    catch (e: any) { alert(e?.message ?? String(e)) }
  }
  const btn = 'inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-dashed border-slate-300 px-2 py-0.5 text-[12px] font-medium text-slate-400 transition hover:border-indigo-400 hover:text-indigo-500 disabled:opacity-60'
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className ?? ''}`}>
      <button type="button" onClick={() => !busy && fileRef.current?.click()} disabled={busy} title="Upload ảnh → chèn ![](url) tại con trỏ" className={btn}>{busy ? '⏳ Đang chèn…' : '🖼 Chèn ảnh'}</button>
      <button type="button" onClick={() => !busy && pasteClip()} disabled={busy} title="Dán ảnh từ clipboard (Ctrl+V)" className={btn}>📋 Dán</button>
      <button type="button" onClick={() => !busy && setCrop(true)} disabled={busy} title="Cắt hình từ PDF/ảnh (render DPI cao)" className={btn}>✂️ Cắt PDF</button>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { void run(e.target.files?.[0]); e.target.value = '' }} />
      {crop && <PdfCropper title="Cắt hình chèn" onClose={() => setCrop(false)} onCrop={async (f) => { await run(f) }} />}
    </div>
  )
}
