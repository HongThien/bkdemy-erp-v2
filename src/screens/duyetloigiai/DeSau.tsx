// "⏭ Để sau" — dùng chung cho MỌI màn duyệt kho (Thùy 20/10): mục chưa muốn quyết bây giờ ⇒ xuống CUỐI hàng đợi.
//   useDeSau(doiTuong) — lần "để sau" gần nhất của cả loại đối tượng (1 RPC); `xep(rows, khoa)` đưa mục đã để sau xuống cuối
//                        (mục chưa từng để sau giữ thứ tự gốc của hàng; mục để sau xếp theo lần bấm, cũ trước). Vá tại chỗ khi bấm.
//   <NutDeSau>         — nút bấm; <NhanDeSau> — nhãn nhỏ trên thẻ đang ở cuối hàng vì đã để sau.
// Không đổi trạng thái mục (không duyệt/từ chối/ẩn) — chỉ đổi thứ tự hiện. "Duyệt tất cả batch" bỏ qua mục đã để sau.
import { useCallback, useEffect, useState } from 'react'
import { deSauDs, ghiDeSau, type DoiTuongDS } from '../../lib/kho/deSau'
import { khoaNX, type MonNX } from '../../lib/kho/nhanXet'

/** Đưa mục đã "để sau" xuống cuối (cũ trước), mục khác giữ nguyên thứ tự — dùng thẳng khi 1 màn trộn nhiều loại đối tượng. */
export function xepDeSau<T>(rows: T[], luc: (r: T) => string | null): T[] {
  const truoc: T[] = [], sau: { r: T; at: string }[] = []
  for (const r of rows) { const at = luc(r); if (at) sau.push({ r, at }); else truoc.push(r) }
  if (!sau.length) return rows
  sau.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
  return [...truoc, ...sau.map((x) => x.r)]
}

export function useDeSau(doiTuong: DoiTuongDS, mon?: MonNX) {
  const [ds, setDs] = useState<Map<string, string>>(new Map())
  const [daNap, setDaNap] = useState(false)
  useEffect(() => {
    let song = true
    deSauDs(doiTuong, mon).then((m) => { if (song) { setDs(m); setDaNap(true) } }).catch(() => { if (song) setDaNap(true) /* lỗi đọc không chặn màn duyệt */ })
    return () => { song = false }
  }, [doiTuong, mon])
  const luc = useCallback((m: string, ma: string) => ds.get(khoaNX(m, ma)) ?? null, [ds])
  const xep = useCallback(<T,>(rows: T[], khoa: (r: T) => [string, string]): T[] => (ds.size ? xepDeSau(rows, (r) => ds.get(khoaNX(...khoa(r))) ?? null) : rows), [ds])
  const ghi = useCallback(async (m: MonNX, ma: string, man: string) => {
    const at = await ghiDeSau(doiTuong, m, ma, man)
    setDs((cu) => new Map(cu).set(khoaNX(m, ma), at))
  }, [doiTuong])
  return { luc, xep, ghi, daNap }
}

export function NutDeSau({ onDeSau, nho, disabled }: { onDeSau: () => Promise<void>; nho?: boolean; disabled?: boolean }) {
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  async function bam(e: React.MouseEvent) {
    e.stopPropagation()
    setBusy(true); setLoi(null)
    try { await onDeSau() } catch (x) { setLoi(x instanceof Error ? x.message : String(x)) } finally { setBusy(false) }
  }
  return (
    <>
      <button onClick={bam} disabled={busy || disabled} title="Chưa muốn quyết bây giờ: đưa xuống CUỐI hàng đợi (cả team thấy) — xử lý sau"
        className={`rounded-md border border-slate-300 bg-white font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50 disabled:opacity-40 ${nho ? 'px-2 py-0.5 text-[12px]' : 'px-3 py-1.5 text-[13px]'}`}>
        {busy ? '⏳…' : '⏭ Để sau'}
      </button>
      {loi && <span className="text-[12px] text-rose-600">⚠ {loi}</span>}
    </>
  )
}

const ngay = (s: string) => new Date(s).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
export function NhanDeSau({ at }: { at: string | null }) {
  if (!at) return null
  return <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500" title="Đã bấm Để sau — mục nằm cuối hàng đợi">⏭ để sau · {ngay(at)}</span>
}
