// Dáng chung của box Trang chính ERP — đọc biến `--sk-*` của style người dùng chọn (lib/erpSkin.ts), không gõ mã màu.
import type { CSSProperties } from 'react'

export const HEAD: CSSProperties = { fontFamily: 'var(--sk-font-head)', textTransform: 'var(--sk-head-case)' as CSSProperties['textTransform'], letterSpacing: 'var(--sk-head-track)' }
// Dáng THẺ của style (nền · viền · bo góc · bóng · mờ sau thẻ) — cùng bộ biến mà thẻ trong app HS dùng.
export const THE: CSSProperties = {
  background: 'var(--sk-surface)', border: 'var(--sk-card-border)', borderRadius: 'var(--sk-radius)', boxShadow: 'var(--sk-card-shadow)',
  backdropFilter: 'var(--sk-blur)', WebkitBackdropFilter: 'var(--sk-blur)',
}
