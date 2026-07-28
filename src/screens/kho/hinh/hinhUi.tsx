// Primitives dùng chung cho nhánh HÌNH. Mã màu spec §4 (mockup-kho-hinh-v4.html):
// mô hình = teal · bài toán nhỏ = xanh dương · dạng = tím · bổ đề = hổ phách.
// Gu staff: clean/modern nhiều màu, KHÔNG sci-fi.
import { useState, type ReactNode } from 'react'
import { MathText, readClipboardImageFile } from '../ui'
import { uploadKhoImage, ocrDeTuAnh } from '../../../lib/kho/api'

export type Ton = 'mh' | 'bt' | 'dg' | 'bd' | 'gh'

const TAG: Record<Ton, string> = {
  mh: 'bg-teal-50 border-teal-300 text-teal-700',
  bt: 'bg-blue-50 border-blue-300 text-blue-700',
  dg: 'bg-violet-50 border-violet-300 text-violet-700',
  bd: 'bg-amber-50 border-amber-300 text-amber-700',
  gh: 'bg-white border-dashed border-slate-300 text-slate-400',
}

export function Tag({ ton = 'bt', children, title, onClick }: { ton?: Ton; children: ReactNode; title?: string; onClick?: () => void }) {
  return (
    <span title={title} onClick={onClick}
      className={`inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2 py-px text-[11px] font-medium ${TAG[ton]} ${onClick ? 'cursor-pointer hover:brightness-95' : ''}`}>
      {children}
    </span>
  )
}

/** Chip cấp — cấp là TOÀN CỤC, không reset theo mô hình. Teal = node của mô hình khác. */
export function Cap({ cap, teal }: { cap: number | null | undefined; teal?: boolean }) {
  if (cap == null) return null
  return <span className={`rounded px-1.5 py-px text-[10px] font-bold text-white ${teal ? 'bg-teal-500' : 'bg-blue-500'}`}>c{cap}</span>
}

export const Ma = ({ children }: { children: ReactNode }) => (
  <span className="font-mono text-[10px] text-slate-400">{children}</span>
)

/** Pill mã PHÂN CẤP (1 / 1.1 / 1.1.1) — đặc màu, chữ trắng, đọc rõ tầng. `ma` trơ để làm phụ đề mờ. */
export function MaPill({ code, ton = 'mh', size = 'md' }: { code: string; ton?: 'mh' | 'bt'; size?: 'sm' | 'md' }) {
  const bg = ton === 'mh' ? 'bg-teal-600' : 'bg-blue-600'
  const s = size === 'sm' ? 'px-1.5 py-0.5 text-[10.5px]' : 'px-2 py-0.5 text-[12px]'
  return <span className={`inline-flex items-center rounded-md font-bold text-white ${bg} ${s}`}>{code}</span>
}

/** Chip số liệu nhỏ — nền xám nhạt bo tròn, thay mấy con số "đậm/nhạt" trôi nổi. */
export const Chip = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{children}</span>
)

/** Card con của MỘT trường thông tin — nền màu nhạt (khác nền trắng của card cha), bo tròn, có nhãn.
 *  Thay kiểu "chữ đậm/nhạt trôi nổi" bằng khối gọn, canh lề nhất quán. */
export function FieldCard({ label, children, ton = 'mh', className = '' }: { label?: string; children: ReactNode; ton?: 'mh' | 'bt' | 'dg' | 'slate'; className?: string }) {
  const tone = ton === 'mh' ? 'bg-teal-50 text-slate-700' : ton === 'bt' ? 'bg-blue-50 text-slate-700' : ton === 'dg' ? 'bg-violet-50 text-slate-700' : 'bg-slate-50 text-slate-700'
  const lblc = ton === 'mh' ? 'text-teal-700' : ton === 'bt' ? 'text-blue-700' : ton === 'dg' ? 'text-violet-700' : 'text-slate-500'
  return (
    <div className={`rounded-lg px-2.5 py-1.5 ${tone} ${className}`}>
      {label && <div className={`mb-0.5 text-[9.5px] font-semibold uppercase tracking-wide ${lblc}`}>{label}</div>}
      <div className="text-[12.5px] leading-relaxed">{children}</div>
    </div>
  )
}

export function Panel({ label, children, className = '' }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-3.5 ${className}`}>
      {label && <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>}
      {children}
    </div>
  )
}

export function KV({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="mb-1.5 flex gap-2 text-[12.5px]">
      <span className="w-[76px] shrink-0 text-slate-400">{k}</span>
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  )
}

/** Khối văn bản toán (đề chuẩn / lời giải) — render LaTeX qua MathText dùng chung. */
export function Sol({ children, className = '' }: { children: string | null | undefined; className?: string }) {
  if (!children) return <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-[12.5px] italic text-slate-400">— chưa có —</div>
  return (
    <div className={`rounded-lg border border-slate-200 bg-slate-50/40 p-2.5 text-[12.5px] leading-relaxed text-slate-700 ${className}`}>
      <MathText>{children}</MathText>
    </div>
  )
}

/** Ô hình: có URL thì hiện ảnh, chưa có thì khung gạch — hình là bắt buộc ở kho bài, gợi nhớ chỗ thiếu. */
export function Fig({ src, cap, h = 'h-32' }: { src?: string | null; cap?: string; h?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50">
      {src
        ? <img src={src} alt={cap ?? ''} className={`w-full ${h} bg-white object-contain`} />
        : <div className={`flex ${h} items-center justify-center text-[11px] text-slate-300`}>chưa có hình</div>}
      {cap && <div className="border-t border-slate-100 bg-white px-2 py-1 text-[10.5px] text-slate-400">{cap}</div>}
    </div>
  )
}

export function Btn({ children, onClick, kind = 'ghost', disabled, title, className = '' }: {
  children: ReactNode; onClick?: () => void; kind?: 'ghost' | 'pri' | 'warn'; disabled?: boolean; title?: string; className?: string
}) {
  const k = kind === 'pri'
    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:border-slate-300'
    : kind === 'warn'
      ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className={`inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-[13px] font-medium transition disabled:cursor-not-allowed ${k} ${className}`}>
      {children}
    </button>
  )
}

export function Seg<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { v: T; label: ReactNode }[] }) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-300 bg-white">
      {options.map((o, i) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)}
          className={`px-3.5 py-1.5 text-[13px] font-medium transition ${i ? 'border-l border-slate-200' : ''} ${
            value === o.v ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export const Note = ({ children }: { children: ReactNode }) => (
  <div className="mt-4 max-w-4xl rounded-r-xl border border-l-[3px] border-slate-200 border-l-amber-400 bg-white px-3.5 py-2.5 text-[12.5px] leading-relaxed text-slate-600">
    {children}
  </div>
)

export const Empty = ({ icon = '◇', children }: { icon?: string; children: ReactNode }) => (
  <div className="flex h-full min-h-52 items-center justify-center p-8 text-center">
    <div className="max-w-md">
      <div className="mb-2 text-3xl text-slate-300">{icon}</div>
      <p className="text-[13px] leading-relaxed text-slate-500">{children}</p>
    </div>
  </div>
)

/** Văn bản trơn cho <option>/tooltip — <select> KHÔNG render được KaTeX, để nguyên thì đọc ra
 *  cú pháp thô ("$EF \cap BC$"). Đổi các lệnh hay gặp sang ký tự Unicode rồi vứt phần còn lại. */
const UNI: [RegExp, string][] = [
  [/\\triangle/g, '△'], [/\\angle/g, '∠'], [/\\perp/g, '⊥'], [/\\parallel/g, '∥'],
  [/\\cap/g, '∩'], [/\\cup/g, '∪'], [/\\in/g, '∈'], [/\\cdot/g, '·'],
  [/\\backsim|\\sim/g, '∽'], [/\\circ/g, '°'], [/\\dfrac|\\frac/g, ''], [/\\times/g, '×'],
]
export const tron = (s: string) => {
  let t = s.replace(/\$/g, '')
  for (const [re, u] of UNI) t = t.replace(re, u)
  return t.replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim()
}

export const inpCls = 'w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

const fileToBase64 = (f: File): Promise<string> =>
  new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] ?? ''); r.onerror = rej; r.readAsDataURL(f) })

/** Nút "dán ảnh đề có công thức → AI dịch ra text + LaTeX". Đặt cạnh MỌI ô nhập đề/ý/giả thiết.
 *  `onText` nhận chuỗi AI trả về (caller quyết ghi đè hay chèn). CHỈ bóc CHỮ — hình đề đính riêng. */
export function OcrButton({ onText, nhan = '📋 Ảnh → AI dịch' }: { onText: (t: string) => void; nhan?: string }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const chay = async (f: File | null) => {
    if (!f) { setErr('Clipboard chưa có ảnh — copy ảnh đề trước rồi bấm.'); return }
    setBusy(true); setErr(null)
    try { onText(await ocrDeTuAnh({ mimeType: f.type, dataBase64: await fileToBase64(f) })) }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Btn className="h-7 text-[12px]" disabled={busy} onClick={async () => chay(await readClipboardImageFile())}>
        {busy ? 'AI đang đọc…' : nhan}
      </Btn>
      <label className="inline-flex h-7 cursor-pointer items-center rounded-lg border border-slate-300 bg-white px-2 text-[12px] font-medium text-slate-600 hover:bg-slate-50">
        chọn ảnh
        <input type="file" accept="image/*" className="hidden" onChange={(e) => chay(e.target.files?.[0] ?? null)} />
      </label>
      {err && <span className="text-[11px] text-rose-600">{err}</span>}
    </div>
  )
}

/** Ô ảnh: chọn file HOẶC dán clipboard → bucket `kho-anh`, DB chỉ giữ URL (không base64). */
export function AnhInput({ value, onChange, cap }: { value: string | null | undefined; onChange: (url: string | null) => void; cap?: string }) {
  const [busy, setBusy] = useState(false)
  const nap = async (f: File | null) => {
    if (!f) return
    setBusy(true)
    try { onChange(await uploadKhoImage(f)) } finally { setBusy(false) }
  }
  return (
    <div className="space-y-1.5">
      <Fig src={value} cap={cap} h="h-28" />
      <div className="flex items-center gap-1.5">
        <label className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 hover:bg-slate-50">
          {busy ? 'Đang tải…' : 'Chọn ảnh'}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => nap(e.target.files?.[0] ?? null)} />
        </label>
        <Btn onClick={async () => { const f = await readClipboardImageFile(); if (f) nap(f) }} title="Dán ảnh từ clipboard">📋 Dán</Btn>
        {value && <Btn onClick={() => onChange(null)}>Bỏ</Btn>}
      </div>
    </div>
  )
}
