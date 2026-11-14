// MỘT CỬA cho việc "hẹn giờ gọi lại dữ liệu" (spec-kien-truc.md §6, luật K13 — đợt 4, 14/11).
// Mọi chỗ cần hỏi lại DB theo nhịp dùng `batPoll` (ngoài React) hoặc `usePoll` (trong component), KHÔNG tự `setInterval`.
// Khác `setInterval` trần ở 4 điểm — đều để một màn mở quên không tự bắn lượt gọi vô ích:
//   1. Tab / app ẩn ⇒ DỪNG hẳn (không hẹn giờ). Hiện lại ⇒ theo `khiHien`: 'qua_han' (mặc định) gọi ngay nếu đã quá một nhịp,
//      'luon' gọi ngay mọi lần, false chỉ hẹn lại nhịp kế.
//   2. Không gọi chồng: lượt trước chưa xong thì bỏ lượt này (nhịp kế hẹn SAU khi lượt trước xong).
//   3. Lượt gọi lỗi (hàm ném / promise bị từ chối) ⇒ lùi dần ×2, tối đa ×8 nhịp; chạy được lại thì về nhịp gốc.
//   4. Mất mạng ⇒ bỏ lượt, không tính là lỗi.
// Nhịp: số tính sẵn / số đếm ≥ 5 phút. Nhịp ngắn hơn chỉ cho màn "đang trong ca / đang thi" và phải có điều kiện dừng (`bat`).
// `ms` nhận hàm để đổi nhịp theo trạng thái (vd có ca hôm nay ⇒ 15 s, không ⇒ 5 phút).
import { useEffect, useRef } from 'react'

export type TuyChonPoll = {
  /** Gọi ngay một lượt lúc bật (mặc định false — đa số màn đã tự tải lượt đầu). */
  ngay?: boolean
  /** Lúc tab hiện lại: 'qua_han' gọi nếu đã quá một nhịp (mặc định) · 'luon' gọi ngay · false không gọi, chỉ hẹn nhịp kế. */
  khiHien?: 'qua_han' | 'luon' | false
}

const anTab = () => typeof document !== 'undefined' && document.visibilityState !== 'visible'
const matMang = () => typeof navigator !== 'undefined' && navigator.onLine === false

/** Bật một nhịp hỏi lại. Trả về hàm DỪNG (gọi trong cleanup). */
export function batPoll(fn: () => unknown, ms: number | (() => number), o: TuyChonPoll = {}): () => void {
  const khiHien = o.khiHien === undefined ? 'qua_han' : o.khiHien
  let dung = false
  let hen: ReturnType<typeof setTimeout> | undefined
  let dangChay = false
  let loi = 0
  let lanCuoi = Date.now()
  const nhip = () => Math.max(1000, typeof ms === 'function' ? ms() : ms)

  const henLai = (sau?: number) => {
    if (dung) return
    if (hen !== undefined) clearTimeout(hen)
    hen = undefined
    if (anTab()) return   // ẩn ⇒ không hẹn; `khiDoiHien` hẹn lại lúc hiện
    hen = setTimeout(() => { void chay() }, sau ?? nhip() * Math.min(2 ** loi, 8))
  }
  const chay = async () => {
    if (dung) return
    if (dangChay || anTab() || matMang()) { henLai(); return }
    dangChay = true
    try { await fn(); loi = 0 } catch { loi += 1 }
    dangChay = false
    lanCuoi = Date.now()
    henLai()
  }
  const khiDoiHien = () => {
    if (dung) return
    if (anTab()) { if (hen !== undefined) clearTimeout(hen); hen = undefined; return }
    const cho = nhip() - (Date.now() - lanCuoi)
    if (khiHien === 'luon' || (khiHien === 'qua_han' && cho <= 0)) void chay()
    else henLai(Math.max(1000, cho))
  }

  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', khiDoiHien)
  if (o.ngay) void chay(); else henLai()
  return () => {
    dung = true
    if (hen !== undefined) clearTimeout(hen)
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', khiDoiHien)
  }
}

/**
 * Bản hook của `batPoll`. `fn` luôn là bản mới nhất (không cần đưa vào deps).
 * `bat` = điều kiện chạy (false ⇒ dừng hẳn). Nhịp đặt lại khi `bat`, `ms` (dạng số) hoặc một phần tử `deps` đổi.
 */
export function usePoll(fn: () => unknown, ms: number | (() => number), o: TuyChonPoll & { bat?: boolean; deps?: readonly unknown[] } = {}) {
  const fnRef = useRef(fn); fnRef.current = fn
  const msRef = useRef(ms); msRef.current = ms
  const bat = o.bat !== false
  const { ngay, khiHien } = o
  useEffect(() => {
    if (!bat) return
    return batPoll(() => fnRef.current(), () => { const m = msRef.current; return typeof m === 'function' ? m() : m }, { ngay, khiHien })
  }, [bat, typeof ms === 'number' ? ms : 0, ngay, khiHien, ...(o.deps ?? [])]) // eslint-disable-line react-hooks/exhaustive-deps
}
