import { useEffect, useState } from 'react'

// Nhái đúng khuôn useIsMobile.ts — matchMedia theo BỀ RỘNG viewport, phản ứng resize, không phụ thuộc
// zoom:1.15 ở #root. Dùng khi 1 màn cần đổi HẲN cây component theo tầng thiết bị (không phải chỉ đổi
// class Tailwind — cái đó dùng thẳng md:/lg: trong JSX, không cần hook). Chưa có màn nào dùng hook này
// (22/09) — dựng sẵn hạ tầng cho đợt sau khi có ca thật cần rẽ nhánh cấu trúc, xem plan 3-tầng app HS.
function useMatchMedia(query: string): boolean {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

export type DeviceTier = 'phone' | 'tablet' | 'pc'
// Ngưỡng đồng bộ Tailwind mặc định: tablet từ md: (768px, cũng đúng ngưỡng useIsMobile mặc định 767px),
// pc từ lg: (1024px).
export function useDeviceTier(): DeviceTier {
  const isTabletUp = useMatchMedia('(min-width: 768px)')
  const isPcUp = useMatchMedia('(min-width: 1024px)')
  return isPcUp ? 'pc' : isTabletUp ? 'tablet' : 'phone'
}
