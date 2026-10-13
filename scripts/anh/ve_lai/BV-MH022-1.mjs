// Vẽ lại hình — gói BV-MH022-1 (MH.022 Hình thang cân, Hình 8 · Luyện · 7 biến thể của BT.08.022.01).
//   node scripts/anh/ve_lai/BV-MH022-1.mjs [<thu_muc_ra>]
// Mỗi biến thể: giải điều kiện góc của đề → góc nhọn ở D = Ĉ, dựng đúng. KHÔNG ghi số đo góc lên hình (đề hỏi tính).
import { P, seg, ray, dot, label, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH022-1/moi'

function thang(dd, gocDay, leg) {
  const D = P(0, 0), C = P(dd, 0)
  const A = ray(D, gocDay, leg), B = ray(C, 180 - gocDay, leg)
  console.assert(Math.abs(A.y - B.y) < 1e-6 && Math.abs(dist(A, D) - dist(B, C)) < 1e-6, 'không cân')
  console.assert(Math.abs(goc(D, A, C) - gocDay) < 0.01 && Math.abs(goc(C, B, D) - gocDay) < 0.01)
  console.assert(Math.abs(goc(A, B, D) - (180 - gocDay)) < 0.01 && B.x - A.x > 0, 'AB>0, A=B=180-D')
  return { A, B, C, D }
}
const tenDinh = ({ A, B, C, D }) => [label(A, 'A', -16, -10), label(B, 'B', 16, -10), label(C, 'C', 16, 28), label(D, 'D', -16, 28)]

// [tên tệp, góc nhọn Ĉ = D̂ (giải ra từ đề), cạnh bên vẽ]
const CAC = [
  ['76e72f38-9868-4f1e-9ed1-5a32d196d71e', 45, 160], // Â = 3D̂ ⇒ D̂ = 45°
  ['724e0ce8-19d0-4e00-b114-ebdad9831a53', 45, 160], // Â = 3Ĉ ⇒ Ĉ = 45°
  ['ae6cdc22-8be8-49f1-b7c5-7c2fce4fc5ad', 60, 150], // (lời giải) Â = 2Ĉ ⇒ Ĉ = 60°
  ['6f327c97-631e-4ac7-80ed-535589081895', 36, 160], // B̂ = 4D̂ ⇒ D̂ = 36°
  ['1112d007-3fe9-484d-98a2-0afecc0bfb95', 70, 170], // Â − Ĉ = 40° ⇒ Â = 110°, Ĉ = 70°
  ['c14831ed-555e-4343-91cb-9795201f69a8', 30, 130], // Â = 5D̂ ⇒ D̂ = 30°
  ['ad3291dd-5e4f-47a4-8e11-a5ccab675803', 60, 150], // B̂ − D̂ = 60° ⇒ Â = 120°, D̂ = 60°
]
for (const [ten, g, leg] of CAC) {
  const t = thang(340, g, leg), { A, B, C, D } = t
  hinh(ten, [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), dot(A), dot(B), dot(C), dot(D), ...tenDinh(t)])
}

await xuatTat(RA)
