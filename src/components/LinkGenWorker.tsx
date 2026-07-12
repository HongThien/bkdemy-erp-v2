// Xử lý hàng đợi lấy-link TOÀN CỤC (07-12) — mount 1 LẦN DUY NHẤT ở App.tsx (không riêng
// KhoTaiLieuScreen), vì tài liệu được tạo/sửa xong từ NHIỀU màn khác nhau (ETScreen, TaiLieuBuilder,
// DeThiScreen, MTScreen, BTScreen, KhoTaiLieuScreen…) — dù Thùy đang ở màn nào, hàng đợi vẫn tự chạy.
// TUẦN TỰ (1 job/lúc, so trong `useStore.linkGenQueue`) để không hâm nóng máy dựng nhiều trang cùng
// lúc — bài học 07-12: rasterize hàng trăm tài liệu cùng lúc làm ĐƠ TAB, không phải "treo vô hạn" mà
// watchdog có thể chặn. Vì vậy KHÔNG BAO GIỜ tự backfill hàng loạt — chỉ nhận job khi nơi khác chủ
// động `enqueueLinkGen(id, loai)` NGAY LÚC 1 tài liệu vừa tạo/sửa xong (bounded, luôn ≤ vài job).
import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import PrintView from '../screens/tailieu/PrintView'
import ETPrintView from '../screens/tailieu/ETPrintView'
import MTPrintView from '../screens/tailieu/MTPrintView'
import DeThiPrintView from '../screens/tailieu/DeThiPrintView'
import BTPrintView from '../screens/tailieu/BTPrintView'

export default function LinkGenWorker() {
  const queueLen = useStore((s) => s.linkGenQueue.length)
  const shiftLinkGen = useStore((s) => s.shiftLinkGen)
  const [active, setActive] = useState<{ id: string; loai: string } | null>(null)

  useEffect(() => {
    if (active || queueLen === 0) return
    const next = shiftLinkGen()
    if (next) setActive(next)
  }, [active, queueLen, shiftLinkGen])

  // Watchdog TẦNG NGOÀI — bên trong mỗi PrintView-family đã có watchdog 30s riêng cho việc DỰNG TRANG
  // (set dlErr + hiện nút "Đóng" khi paged.js treo), nhưng job NỀN này KHÔNG CÓ AI đứng bấm "Đóng" đó —
  // không có watchdog ở ĐÂY thì 1 doc treo/lỗi sẽ kẹt CẢ HÀNG ĐỢI TOÀN CỤC vĩnh viễn (đúng bug-class đã
  // gặp ở KhoTaiLieuScreen trước khi có worker này). 45s > 30s bên trong, để watchdog trong có cơ hội
  // set dlErr trước; nếu vẫn không ai đóng, tầng này tự bỏ qua, nhường job tiếp theo.
  useEffect(() => {
    if (!active) return
    const cur = active
    const t = setTimeout(() => setActive((now) => (now === cur ? null : now)), 45000)
    return () => clearTimeout(t)
  }, [active])

  if (!active) return null
  const onClose = () => setActive(null)
  const props = { id: active.id, headless: true as const, linkOnly: true as const, onClose }
  if (active.loai === 'et') return <ETPrintView {...props} />
  if (active.loai === 'de_thi') return <DeThiPrintView {...props} />
  if (active.loai === 'mt' || active.loai === 'mt_buoi') return <MTPrintView {...props} />
  if (active.loai === 'bo_tro') return <BTPrintView {...props} />
  return <PrintView {...props} />
}
