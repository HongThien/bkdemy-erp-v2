// Nén kit KHU HỌC TẬP (Đơn 14 Kit B — design/bk-ui-src/AppHS/hs-hoc-tap-v2/, Thùy duyệt 03/10) vào public/bk-ui/hs/skin/rpg/hoctap/:
//   nen_ngang.jpg (1672×941) · nen_doc.jpg (941×1672) · dao_<id>.webp (giữ NGUYÊN khung vuông + lề alpha cho hào quang/sét — DESIGN.md: không cắt sprite)
// rồi đo HỘP ALPHA (phần ảnh rõ, alpha > 40 — bỏ nhiễu mờ) của từng đảo ⇒ sinh src/screens/hocsinh/skin/styles/rpgHocTap.ts:
//   vị trí đặt theo TÂM + BỀ RỘNG phần nhìn thấy (DESIGN.md mục 3), không theo khung PNG. Kiểm luôn: alpha thật + 4 góc trong suốt.
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
import path from 'node:path'
const J = (...a) => path.join(...a).split(path.sep).join('/')

const SRC = 'design/bk-ui-src/AppHS/hs-hoc-tap-v2/assets', OUT = 'public/bk-ui/hs/skin/rpg/hoctap'
fs.mkdirSync(OUT, { recursive: true })
const DAO = ['hoc_chu_de', 'luyen_yeu', 'dau_truong', 'chinh_phuc', 'giai_vo_dich']
const CO_DAO = 768 // cạnh khung vuông sau nén — đảo to nhất ~33% của 1180px ≈ 390px CSS, ×2 màn retina

let tong = 0
async function nen(file, w, h, out, q = 82) {
  const im = await loadImage(J(SRC, file)), c = createCanvas(w, h), x = c.getContext('2d')
  x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, w, h)
  const b = await c.encode('jpeg', q); fs.writeFileSync(J(OUT, out), b); tong += b.length
  return { goc: [im.width, im.height] }
}
console.log('nền ngang', await nen('backdrop/troi_sao_hoc_tap.png', 1672, 941, 'nen_ngang.jpg'))
console.log('nền dọc', await nen('backdrop/troi_sao_hoc_tap_doc.png', 941, 1672, 'nen_doc.jpg'))

const hop = {}
for (const id of DAO) {
  const im = await loadImage(J(SRC, 'decor', `dao_${id}.png`))
  const W = im.width, H = im.height, c = createCanvas(W, H), x = c.getContext('2d'); x.drawImage(im, 0, 0)
  const d = x.getImageData(0, 0, W, H).data
  const a = (i, j) => d[(j * W + i) * 4 + 3]
  const goc = [a(0, 0), a(W - 1, 0), a(0, H - 1), a(W - 1, H - 1)]
  let x0 = W, y0 = H, x1 = 0, y1 = 0, dac = 0
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = a(i, j); if (v > 40) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j } if (v === 255) dac++ }
  const r = (v) => +v.toFixed(4)
  hop[id] = { x0: r(x0 / W), y0: r(y0 / H), x1: r((x1 + 1) / W), y1: r((y1 + 1) / H) }
  const s = createCanvas(CO_DAO, CO_DAO), y = s.getContext('2d'); y.imageSmoothingQuality = 'high'; y.drawImage(im, 0, 0, CO_DAO, CO_DAO)
  const b = await s.encode('webp', 84); fs.writeFileSync(J(OUT, `dao_${id}.webp`), b); tong += b.length
  console.log(id, `${W}×${H}`, 'góc alpha', goc.join('/'), 'hộp', JSON.stringify(hop[id]), 'điểm đặc', (dac / (W * H) * 100).toFixed(1) + '%', (b.length / 1024).toFixed(0) + 'KB')
}

fs.writeFileSync('src/screens/hocsinh/skin/styles/rpgHocTap.ts', `// SINH TỰ ĐỘNG bởi scripts/anime-hoc-tap.mjs — đừng sửa tay. Khu HỌC TẬP của style Anime RPG (kit hs-hoc-tap-v2, Đơn 14 Kit B, Thùy duyệt 03/10).
// hop = hộp PHẦN NHÌN THẤY của đảo (alpha > 40) theo tỉ lệ khung PNG vuông — đặt đảo theo tâm + bề rộng phần này (DESIGN.md mục 3), khung PNG giữ nguyên lề.
const G = '/bk-ui/hs/skin/rpg/hoctap'
export const HOC_TAP_RPG = {
  nen: \`url(\${G}/nen_ngang.jpg) center / cover no-repeat, #080e37\`,
  nenDoc: \`url(\${G}/nen_doc.jpg) center / cover no-repeat, #080e37\`,
  dao: { ${DAO.map((id) => `${id}: \`\${G}/dao_${id}.webp\``).join(', ')} },
  hop: ${JSON.stringify(hop)} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
}
`)
console.log('xong, tổng', (tong / 1024).toFixed(0), 'KB')
