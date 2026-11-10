// ve_vecto_lib.mjs — phần BỔ SUNG cho ve_hinh_lib.mjs: vẽ VECTƠ (mũi tên) trong hình đề HGT. Dùng cùng toạ độ ảnh (gốc trên-trái, y xuống).
//   import { vecto, vectoDash, nhanVecto, dauMuiTen } from '../ve_vecto_lib.mjs'
// Tất cả trả về chuỗi SVG, bỏ vào body của hinh(...) như seg/label.
const f = (n) => Math.round(n * 100) / 100

/** Đầu mũi tên đặc tại điểm b, hướng a→b (cỡ L). */
export function dauMuiTen(a, b, L = 13, W = 5.5) {
  const ang = Math.atan2(b.y - a.y, b.x - a.x), c = Math.cos(ang), s = Math.sin(ang)
  const bx = b.x - L * c, by = b.y - L * s
  return `<path d="M ${f(b.x)} ${f(b.y)} L ${f(bx - W * s)} ${f(by + W * c)} L ${f(bx + W * s)} ${f(by - W * c)} Z" fill="#222" stroke="none"/>`
}
/** Vectơ a→b: đoạn thẳng + đầu mũi tên ở b. */
export function vecto(a, b, sw = 2.2) {
  const ang = Math.atan2(b.y - a.y, b.x - a.x), L = 13
  const e = { x: b.x - (L - 2) * Math.cos(ang), y: b.y - (L - 2) * Math.sin(ang) }
  return `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(e.x)}" y2="${f(e.y)}" stroke-width="${sw}"/>${dauMuiTen(a, b)}`
}
/** Vectơ nét đứt (vectơ phụ/kéo dài). */
export function vectoDash(a, b) {
  const ang = Math.atan2(b.y - a.y, b.x - a.x), L = 13
  const e = { x: b.x - (L - 2) * Math.cos(ang), y: b.y - (L - 2) * Math.sin(ang) }
  return `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(e.x)}" y2="${f(e.y)}" stroke-dasharray="7 6"/>${dauMuiTen(a, b)}`
}
/** Nhãn vectơ có mũi tên trên đầu: nhanVecto(P(x,y), 'AB') hoặc nhanVecto(p, 'a', dx, dy) cho vectơ chữ thường. Chữ nghiêng, mũi tên mảnh phía trên. */
export function nhanVecto(p, t, dx = 0, dy = 0, size = 24) {
  const x = p.x + dx, y = p.y + dy, w = Math.max(14, t.length * size * 0.56), ay = y - size * 0.82
  return `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-style="italic" font-size="${size}">${t}</text>`
    + `<line x1="${f(x - w / 2)}" y1="${f(ay)}" x2="${f(x + w / 2)}" y2="${f(ay)}" stroke-width="1.4"/>`
    + `<path d="M ${f(x + w / 2 + 2)} ${f(ay)} L ${f(x + w / 2 - 5)} ${f(ay - 3.2)} L ${f(x + w / 2 - 5)} ${f(ay + 3.2)} Z" fill="#111" stroke="none"/>`
}
