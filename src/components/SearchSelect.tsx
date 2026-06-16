import { useEffect, useMemo, useRef, useState } from 'react'

// Combobox dùng chung: gõ → lọc realtime → chọn. THAY cho <select> ở mọi list dài (HS/lớp/nhân sự).
// Quy tắc dự án: cấm dropdown cho list dài (300 HS dropdown = vô dụng).
export type Opt = { id: string; label: string; sub?: string; img?: string | null }

// Avatar tròn nhỏ: ảnh nếu có, không thì chữ cái đầu.
function Ava({ img, label }: { img?: string | null; label: string }) {
  return img
    ? <img src={img} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
    : <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-600">{label.trim().charAt(0).toUpperCase()}</span>
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase() // bỏ dấu tiếng Việt

export default function SearchSelect({ value, onChange, options, placeholder = 'Tìm…', allowClear = true, autoFocus, className, invalid, avatars }: {
  value: string | null
  onChange: (id: string | null) => void
  options: Opt[]
  placeholder?: string
  allowClear?: boolean
  autoFocus?: boolean
  className?: string
  invalid?: boolean   // true → viền đỏ (vd slot bắt buộc chưa chọn)
  avatars?: boolean   // true → hiện avatar (ảnh/chữ cái) trước tên (cho list người)
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.id === value) ?? null

  // click ngoài → đóng
  useEffect(() => {
    const h = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  const matches = useMemo(() => {
    const nq = norm(q.trim())
    const pool = nq ? options.filter((o) => norm(o.label + ' ' + (o.sub ?? '')).includes(nq)) : options
    return pool.slice(0, 50) // cap hiển thị
  }, [q, options])

  return (
    <div ref={boxRef} className={`relative ${className ?? ''}`}>
      {open ? (
        <input
          autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder}
          className="w-full rounded-md border border-indigo-400 px-2.5 py-1.5 text-[13px] outline-none ring-2 ring-indigo-500/20"
        />
      ) : (
        <button type="button" autoFocus={autoFocus} onClick={() => { setOpen(true); setQ('') }}
          className={`flex w-full items-center justify-between rounded-md border px-2.5 py-1.5 text-left text-[13px] hover:border-indigo-400 ${invalid && !selected ? 'border-rose-300 bg-rose-50' : 'border-slate-300'}`}>
          <span className={`flex min-w-0 items-center gap-1.5 ${selected ? 'text-slate-800' : 'text-slate-400'}`}>
            {avatars && selected && <Ava img={selected.img} label={selected.label} />}
            {selected ? <span className="truncate">{selected.label}{selected.sub && <span className="ml-1 text-slate-400">· {selected.sub}</span>}</span> : placeholder}
          </span>
          <span className="flex items-center gap-1">
            {allowClear && selected && <span onClick={(e) => { e.stopPropagation(); onChange(null) }} className="text-slate-300 hover:text-rose-500">✕</span>}
            <span className="text-slate-300">▾</span>
          </span>
        </button>
      )}
      {open && (
        <div className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {allowClear && (
            <button type="button" onClick={() => { onChange(null); setOpen(false) }} className="block w-full px-2.5 py-1 text-left text-[12px] text-slate-400 hover:bg-slate-50">— (bỏ chọn) —</button>
          )}
          {matches.map((o) => (
            <button key={o.id} type="button" onClick={() => { onChange(o.id); setOpen(false) }}
              className={`flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left text-[13px] hover:bg-indigo-50 ${o.id === value ? 'bg-indigo-50/60' : ''}`}>
              {avatars && <Ava img={o.img} label={o.label} />}
              <span className="font-medium text-slate-800">{o.label}</span>
              {o.sub && <span className="text-[11px] text-slate-400">{o.sub}</span>}
            </button>
          ))}
          {matches.length === 0 && <p className="px-2.5 py-2 text-[12px] text-slate-400">Không khớp “{q}”.</p>}
          {options.length > 50 && <p className="px-2.5 py-1 text-[11px] text-slate-300">…gõ để lọc trong {options.length}</p>}
        </div>
      )}
    </div>
  )
}
