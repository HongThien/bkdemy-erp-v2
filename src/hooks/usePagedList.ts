import { useEffect, useRef, useState } from 'react'

// Chung cho các màn "thư viện tài liệu" (Kho tài liệu, Giáo trình, BT, MT, Đề thi…): mặc định chỉ tải
// `pageSize` dòng MỚI NHẤT — Thùy 09-10 "kho lớn dần tải cực lâu" (mỗi màn từng tự gọi list*() KHÔNG
// limit/offset, full-scan cả bảng mỗi lần mở). `search` có giá trị → coi là hành động CHỦ ĐỘNG của
// người dùng, được phép quét rộng hơn trang mặc định (fetchPage tự quyết định độ rộng đó, hook không
// áp `hasMore`/"Tải thêm" khi đang search — kết quả search trả về bao nhiêu hiện bấy nhiêu).
export function usePagedList<T>(
  fetchPage: (args: { before?: string; search?: string }) => Promise<T[]>,
  cursorOf: (row: T) => string | undefined,
  pageSize: number,
  search: string,
  deps: readonly unknown[],
) {
  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const reqId = useRef(0)

  async function reload() {
    const my = ++reqId.current
    setLoading(true); setErr(null)
    try {
      const page = await fetchPage({ search: search.trim() || undefined })
      if (my !== reqId.current) return
      setRows(page)
      setHasMore(!search.trim() && page.length === pageSize)
    } catch (e: any) { if (my === reqId.current) setErr(e.message ?? String(e)) }
    finally { if (my === reqId.current) setLoading(false) }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reload() }, [search, ...deps])

  async function loadMore() {
    if (loadingMore || !hasMore || !rows.length) return
    setLoadingMore(true)
    try {
      const before = cursorOf(rows[rows.length - 1])
      const page = await fetchPage({ before })
      setRows((r) => [...r, ...page])
      setHasMore(page.length === pageSize)
    } catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setLoadingMore(false) }
  }

  return { rows, setRows, loading, loadingMore, hasMore, err, reload, loadMore }
}
