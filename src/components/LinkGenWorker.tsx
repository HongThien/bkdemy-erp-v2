// Xử lý hàng đợi lấy-link TOÀN CỤC (07-12) — mount 1 LẦN DUY NHẤT ở App.tsx (không riêng
// KhoTaiLieuScreen), vì tài liệu được tạo/sửa xong từ NHIỀU màn khác nhau (ETScreen, TaiLieuBuilder,
// DeThiScreen, MTScreen, BTScreen, KhoTaiLieuScreen…) — dù Thùy đang ở màn nào, hàng đợi vẫn tự chạy.
// TUẦN TỰ (1 job/lúc, so trong `useStore.linkGenQueue`) để không hâm nóng máy dựng nhiều trang cùng
// lúc — bài học 07-12: rasterize hàng trăm tài liệu cùng lúc làm ĐƠ TAB, không phải "treo vô hạn" mà
// watchdog có thể chặn. Vì vậy KHÔNG BAO GIỜ tự backfill hàng loạt — chỉ nhận job khi nơi khác chủ
// động `enqueueLinkGen(id, loai)` NGAY LÚC 1 tài liệu vừa tạo/sửa xong (bounded, luôn ≤ vài job).
// `active` SỐNG Ở STORE (`linkGenActive`, không phải useState cục bộ) — để KhoTaiLieuScreen đọc được
// và hiện "⏳ đang tạo…" đúng lúc, Thùy 07-12: "t muốn khi tài liệu đưa vào kho là phải có link... tại
// sao lại phải có thao tác của người" → PHẢI thấy được hệ thống đang làm, không phải im lặng đoán.
import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import PrintView from '../screens/tailieu/PrintView'
import ETPrintView from '../screens/tailieu/ETPrintView'
import MTPrintView from '../screens/tailieu/MTPrintView'
import DeThiPrintView from '../screens/tailieu/DeThiPrintView'
import BTPrintView from '../screens/tailieu/BTPrintView'

export default function LinkGenWorker() {
  const queueLen = useStore((s) => s.linkGenQueue.length)
  const active = useStore((s) => s.linkGenActive)
  const shiftLinkGen = useStore((s) => s.shiftLinkGen)
  const setLinkGenActive = useStore((s) => s.setLinkGenActive)
  const timeoutLinkGenActive = useStore((s) => s.timeoutLinkGenActive)

  useEffect(() => {
    if (active || queueLen === 0) return
    const next = shiftLinkGen()
    if (next) setLinkGenActive(next)
  }, [active, queueLen, shiftLinkGen, setLinkGenActive])

  // Watchdog TẦNG NGOÀI — bên trong mỗi PrintView-family đã có watchdog 30s riêng cho việc DỰNG TRANG
  // (set dlErr + hiện nút "Đóng" khi paged.js treo), nhưng job NỀN này KHÔNG CÓ AI đứng bấm "Đóng" đó —
  // không có watchdog ở ĐÂY thì 1 doc treo/lỗi sẽ kẹt CẢ HÀNG ĐỢI TOÀN CỤC vĩnh viễn. 45s > 30s bên
  // trong, để watchdog trong có cơ hội set dlErr trước. Gọi `timeoutLinkGenActive` (KHÔNG tự set null
  // thẳng) — store TỰ quyết xếp lại hàng đợi (tối đa MAX_LINKGEN_ATTEMPTS lần) hay bỏ hẳn.
  useEffect(() => {
    if (!active) return
    const id = active.id
    const t = setTimeout(() => timeoutLinkGenActive(id), 45000)
    return () => clearTimeout(t)
  }, [active, timeoutLinkGenActive])

  if (!active) return null
  const onClose = () => setLinkGenActive(null)
  // Lỗi TƯỜNG MINH (vd upload trả 400) không cần đợi hết watchdog 45s mới coi là thất bại — báo ngay
  // qua CÙNG hàm `timeoutLinkGenActive` (đã có sẵn logic thử lại tối đa MAX_LINKGEN_ATTEMPTS lần rồi
  // mới đánh dấu `linkGenFailed`), chỉ khác là gọi NGAY thay vì đợi hết giờ.
  const onFail = () => timeoutLinkGenActive(active.id)
  const props = { id: active.id, headless: true as const, linkOnly: true as const, onClose, onFail }
  if (active.loai === 'et') return <ETPrintView {...props} />
  if (active.loai === 'de_thi') return <DeThiPrintView {...props} />
  if (active.loai === 'mt' || active.loai === 'mt_buoi') return <MTPrintView {...props} />
  if (active.loai === 'bo_tro') return <BTPrintView {...props} />
  return <PrintView {...props} />
}
