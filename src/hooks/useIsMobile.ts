import { useEffect, useState } from 'react'

// True khi viewport hẹp (điện thoại). Dùng cho view chấm bài 1-bài-mỗi-màn.
// matchMedia đọc bề rộng viewport (CSS px) — KHÔNG bị ảnh hưởng bởi zoom:1.15 ở #root.
export function useIsMobile(maxWidth = 767) {
  const q = `(max-width: ${maxWidth}px)`
  const [is, setIs] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setIs(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return is
}
