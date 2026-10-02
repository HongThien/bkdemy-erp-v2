// Câu hỏi GIẢ cho trang xem thử Đấu trường (không DB). 15 câu: 6 dễ · 6 vừa · 3 khó ⇒ mỗi trận 2-2-1 (spec §2). Không xáo thứ tự đáp án.
import type { CauTT, DoKho } from './kieu'

const C = (id: string, doKho: DoKho, de: string, dapAn: string[], dung: number): CauTT => ({ id, doKho, de, dapAn, dung })
const THAP = [
  C('t1', 'thap', 'Giá trị của √81 là:', ['3', '9', '81', '±9'], 1),
  C('t2', 'thap', 'Nghiệm của phương trình 2x − 6 = 0 là:', ['x = −3', 'x = 3', 'x = 6', 'x = 12'], 1),
  C('t3', 'thap', 'Hệ số góc của đường thẳng y = 3x − 5 là:', ['−5', '5', '3', '−3'], 2),
  C('t4', 'thap', 'Biểu thức (x + 1)² bằng:', ['x² + 1', 'x² + 2x + 1', 'x² + x + 1', 'x² − 2x + 1'], 1),
  C('t5', 'thap', 'Điểm nào thuộc đồ thị hàm số y = 2x?', ['(1; 1)', '(2; 4)', '(3; 5)', '(0; 2)'], 1),
  C('t6', 'thap', 'Tính 5² − 3²:', ['4', '8', '16', '34'], 2),
]
const VUA = [
  C('v1', 'vua', 'Phương trình x² − 5x + 6 = 0 có hai nghiệm là:', ['1 và 6', '2 và 3', '−2 và −3', '2 và −3'], 1),
  C('v2', 'vua', 'Rút gọn √12 + √27 ta được:', ['√39', '5√3', '6√3', '5√6'], 1),
  C('v3', 'vua', 'Hệ x + y = 5 ; x − y = 1 có nghiệm (x ; y) là:', ['(3 ; 2)', '(2 ; 3)', '(4 ; 1)', '(1 ; 4)'], 0),
  C('v4', 'vua', 'Hàm số y = (m − 1)x + 2 đồng biến khi:', ['m < 1', 'm > 1', 'm = 1', 'm > 2'], 1),
  C('v5', 'vua', 'Phương trình x² − 4x + m = 0 có nghiệm kép khi m bằng:', ['2', '4', '−4', '8'], 1),
  C('v6', 'vua', 'Giá trị của (√5 − 2)(√5 + 2) là:', ['1', '3', '9', '√5'], 0),
]
const CAO = [
  C('c1', 'cao', 'Phương trình x² − 2(m + 1)x + m² = 0 có hai nghiệm phân biệt khi:', ['m > −1/2', 'm < −1/2', 'm > 1/2', 'm ≥ −1/2'], 0),
  C('c2', 'cao', 'Cho x + y = 4 và xy = 3. Giá trị của x² + y² là:', ['7', '10', '16', '12'], 1),
  C('c3', 'cao', 'Giá trị nhỏ nhất của A = x² − 4x + 7 là:', ['3', '4', '7', '−3'], 0),
]

/** Xáo có hạt giống (xorshift) — cùng seed ra cùng thứ tự, mỗi lượt demo đổi seed. */
function xao<T>(a: T[], seed: number): T[] {
  const r = [...a]; let s = (seed * 2654435761) >>> 0 || 1
  const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296 }
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [r[i], r[j]] = [r[j], r[i]] }
  return r
}

/** 3 trận × 5 câu (2 dễ · 2 vừa · 1 khó), không câu nào trùng trong lượt. */
export function sinhBoCauGia(seed: number): CauTT[][] {
  const t = xao(THAP, seed), v = xao(VUA, seed + 1), c = xao(CAO, seed + 2)
  return [0, 1, 2].map((i) => [t[i * 2], v[i * 2], t[i * 2 + 1], v[i * 2 + 1], c[i]])
}
