// Phím tắt CÁ NHÂN cho mẫu công thức — người dùng TỰ gán, KHÔNG có bộ mặc định.
// Lưu nhan_su.phim_tat_cong_thuc (jsonb) { [templateId]: 'Ctrl+Alt+F' } — dữ liệu cá nhân, không nhãn môn.
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

export type PhimTatMap = Record<string, string>
export const PHIM_TAT_EMPTY: PhimTatMap = Object.freeze({}) as PhimTatMap

// Tổ hợp DÀNH RIÊNG (không cho gán): mở ô công thức + clipboard/undo của trình duyệt.
export const COMBO_RESERVED: Record<string, string> = {
  'Ctrl+M': 'mở ô công thức', 'Ctrl+C': 'copy', 'Ctrl+V': 'dán', 'Ctrl+X': 'cắt', 'Ctrl+Z': 'hoàn tác', 'Ctrl+Y': 'làm lại', 'Ctrl+A': 'chọn tất cả',
}

type AnyKeyEvent = KeyboardEvent | ReactKeyboardEvent
// Đọc tổ hợp từ sự kiện phím → 'Ctrl+Alt+F' | null (phím lẻ / chỉ modifier → null).
// Chữ & số lấy theo `code` (KeyA/Digit1) để không phụ thuộc layout/IME tiếng Việt; phím khác lấy `key`.
// Bắt buộc có Ctrl / Alt / Meta hoặc là phím F — để không đụng lúc gõ chữ thường.
export function comboFromEvent(e: AnyKeyEvent): string | null {
  const key = e.key
  if (!key || ['Control', 'Alt', 'Shift', 'Meta', 'CapsLock', 'Tab', 'Escape', 'Enter', 'Dead', 'Process', 'Unidentified'].includes(key)) return null
  const mods: string[] = []
  if (e.ctrlKey) mods.push('Ctrl')
  if (e.altKey) mods.push('Alt')
  if (e.shiftKey) mods.push('Shift')
  if (e.metaKey) mods.push('Meta')
  const isF = /^F\d{1,2}$/.test(key)
  if (!isF && !e.ctrlKey && !e.altKey && !e.metaKey) return null
  const code = (e as KeyboardEvent).code ?? ''
  let k: string
  if (/^Key[A-Z]$/.test(code)) k = code.slice(3)
  else if (/^Digit\d$/.test(code)) k = code.slice(5)
  else if (/^Numpad\d$/.test(code)) k = 'Num' + code.slice(6)
  else if (key.length === 1) k = key.toUpperCase()
  else k = key
  return [...mods, k].join('+')
}

// Tìm mẫu theo tổ hợp. Trả templateId hoặc null.
export function findTemplateByCombo(map: PhimTatMap, combo: string): string | null {
  for (const id in map) if (map[id] === combo) return id
  return null
}
