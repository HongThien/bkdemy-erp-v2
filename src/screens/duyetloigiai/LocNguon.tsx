// Bộ lọc NGUỒN TÀI LIỆU dùng chung cho các màn duyệt kho (Thùy 27/10: "t dùng tài liệu của nhiều loại khác nhau — Đề thi · Đề cương ·
// Sách tham khảo, mỗi tác giả 1 nguồn — t duyệt theo từng loại để tránh đụng tài liệu không phù hợp").
// Nguồn của câu tính ở DB (_kho_nguon_cau, mig 202610271607): 'de_thi' | 'de_cuong' | 'sach:<tác giả>' | 'kho_cu'; bản sao theo câu gốc.
//   useLocNguon(rows, ma, coNguon) — màn TẢI ĐỦ hàng (Duyệt câu, Đúng/Sai): nạp nguồn của các câu đang có (1 RPC/400 mã), lọc theo lựa chọn
//   <ChonNguon>                    — ô chọn; màn tải theo TRANG (Bản đồ mới › Duyệt kho) tự lấy danh sách nguồn + số câu từ DB rồi truyền vào
import { useEffect, useState } from 'react'
import { nguonCauDs } from '../../lib/kho/nguonTl'

export type NguonOpt = { nguon: string; n: number }

export function nhanNguon(k: string): string {
  if (k === 'de_thi') return 'Đề thi'
  if (k === 'de_cuong') return 'Đề cương'
  if (k === 'kho_cu') return 'Kho cũ (nhập qua ERP)'
  if (k.startsWith('sach:')) return 'Sách · ' + k.slice(5)
  return k
}
// Đề thi → Đề cương → Sách (theo tên) → Kho cũ
const hang = (k: string) => (k === 'de_thi' ? 0 : k === 'de_cuong' ? 1 : k === 'kho_cu' ? 3 : 2)
export const xepNguon = (a: NguonOpt[]) => [...a].sort((x, y) => hang(x.nguon) - hang(y.nguon) || x.nguon.localeCompare(y.nguon, 'vi'))

// rows: hàng duyệt đã tải đủ; ma(r): mã câu; coNguon(r): câu có thuộc kho có nguồn tài liệu không (Toán Đại / HGT) — kho khác = 'kho_cu'.
export function useLocNguon<T>(rows: T[], ma: (r: T) => string, coNguon: (r: T) => boolean) {
  const [chon, setChon] = useState<string>('all')
  const [map, setMap] = useState<Map<string, string[]>>(new Map())
  const [dangNap, setDangNap] = useState(false)
  const thieu = rows.filter((r) => coNguon(r) && !map.has(ma(r))).map(ma)
  const khoaThieu = thieu.join(',')
  useEffect(() => {
    if (!thieu.length) return
    let song = true
    setDangNap(true)
    void (async () => {
      const moi = new Map<string, string[]>()
      for (let i = 0; i < thieu.length; i += 400) {
        try { for (const [k, v] of await nguonCauDs(thieu.slice(i, i + 400))) moi.set(k, v) } catch { /* lỗi đọc nguồn không chặn màn duyệt */ }
      }
      for (const m of thieu) if (!moi.has(m)) moi.set(m, ['kho_cu'])
      if (song) { setMap((cu) => new Map([...cu, ...moi])); setDangNap(false) }
    })()
    return () => { song = false }
  }, [khoaThieu]) // eslint-disable-line react-hooks/exhaustive-deps
  const nguonCua = (r: T): string[] => (coNguon(r) ? map.get(ma(r)) ?? [] : ['kho_cu'])
  const dem = new Map<string, number>()
  for (const r of rows) for (const k of nguonCua(r)) dem.set(k, (dem.get(k) ?? 0) + 1)
  const opts = xepNguon([...dem].map(([nguon, n]) => ({ nguon, n })))
  const nguonChon = chon !== 'all' && dem.has(chon) ? chon : 'all'
  const loc = nguonChon === 'all' ? rows : rows.filter((r) => nguonCua(r).includes(nguonChon))
  return { opts, loc, nguonChon, setChon, reset: () => setChon('all'), tong: rows.length, dangNap, nguonCua }
}

export function ChonNguon({ opts, value, onChange, tong, dangNap }: { opts: NguonOpt[]; value: string; onChange: (v: string) => void; tong?: number; dangNap?: boolean }) {
  if (!dangNap && opts.length <= 1 && value === 'all') return null // 1 nguồn thì không có gì để lọc
  return (
    <label className="flex items-center gap-1.5 text-[12px] text-slate-500" title="Đề thi · Đề cương · Sách tham khảo (mỗi tác giả 1 nguồn) · Kho cũ — bản sao tính theo câu gốc">
      Nguồn
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="max-w-[300px] rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-700 focus:border-violet-400 focus:outline-none">
        <option value="all">Tất cả nguồn{tong !== undefined ? ` (${tong})` : ''}{dangNap ? ' · đang tải…' : ''}</option>
        {opts.map((o) => <option key={o.nguon} value={o.nguon}>{nhanNguon(o.nguon)} ({o.n})</option>)}
        {value !== 'all' && !opts.some((o) => o.nguon === value) && <option value={value}>{nhanNguon(value)} (0)</option>}
      </select>
    </label>
  )
}
