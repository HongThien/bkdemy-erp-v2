// Bộ lọc DẠNG dùng chung cho các tab duyệt (Thùy 06/10: "hiện câu cần duyệt theo dạng để duyệt 1 loại cho dễ — áp cho tất cả các môn").
// Lựa chọn = các dạng ĐANG CÓ trong hàng duyệt hiện tại (kèm số câu) — chỉ lọc/đếm phần tử đang render, không phải số liệu nghiệp vụ.
import { useState } from 'react'

export type DangOpt = { ma: string; ten: string; cd: string; n: number }

// rows: hàng duyệt (đã qua các bộ lọc khác như chip nhánh). layDang: lấy (mã, tên dạng, tên chuyên đề) của 1 dòng.
// Trả: danh sách dạng + dòng sau lọc + giá trị đang chọn (dạng vừa duyệt hết ⇒ tự về 'all') + setter + reset.
export function useLocDang<T>(rows: T[], layDang: (r: T) => { ma: string; ten?: string | null; cd?: string | null }) {
  const [chon, setChon] = useState<string>('all')
  const m = new Map<string, DangOpt>()
  for (const r of rows) {
    const d = layDang(r)
    if (!d.ma) continue
    const o = m.get(d.ma) ?? { ma: d.ma, ten: d.ten || d.ma, cd: d.cd || '', n: 0 }
    o.n++; m.set(d.ma, o)
  }
  const opts = [...m.values()].sort((a, b) => a.cd.localeCompare(b.cd, 'vi') || a.ten.localeCompare(b.ten, 'vi'))
  const dangChon = chon !== 'all' && m.has(chon) ? chon : 'all'
  const loc = dangChon === 'all' ? rows : rows.filter((r) => layDang(r).ma === dangChon)
  return { opts, loc, dangChon, setChon, reset: () => setChon('all'), tong: rows.length }
}

export function ChonDang({ opts, value, onChange, tong }: { opts: DangOpt[]; value: string; onChange: (v: string) => void; tong: number }) {
  if (opts.length <= 1) return null // 1 dạng thì không có gì để lọc
  return (
    <label className="flex items-center gap-1.5 text-[12px] text-slate-500">
      Dạng
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="max-w-[420px] rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-700 focus:border-violet-400 focus:outline-none">
        <option value="all">Tất cả dạng ({tong})</option>
        {opts.map((d) => <option key={d.ma} value={d.ma}>{d.cd ? `${d.cd} › ` : ''}{d.ten} ({d.n})</option>)}
      </select>
    </label>
  )
}
