// Nén kit CHINH PHỤC BK (Đơn 14 Kit A v4 — design/bk-ui-src/AppHS/hs-chinh-phuc-bk-v4/, DESIGN.md) vào public/bk-ui/hs/skin/rpg/chinhphuc/
// rồi sinh src/screens/hocsinh/skin/styles/rpgChinhPhuc.ts: hộp PHẦN NHÌN THẤY (alpha>40) của 9 tháp — chân tháp = đáy hộp (DESIGN: ≈99–100% alpha-bounds),
// đế/cầu giữ nguyên khung PNG (neo theo DESIGN.md mục 6, tỉ lệ trong ảnh).
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
const SRC = 'design/bk-ui-src/AppHS/hs-chinh-phuc-bk-v4/assets', OUT = 'public/bk-ui/hs/skin/rpg/chinhphuc'
fs.mkdirSync(OUT, { recursive: true })
let tong = 0
async function nen(file, w, h, out, kieu = 'webp', q = 84) {
  const im = await loadImage(`${SRC}/${file}`), c = createCanvas(w, h), x = c.getContext('2d')
  x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, w, h)
  const b = await c.encode(kieu === 'jpg' ? 'jpeg' : 'webp', q); fs.writeFileSync(`${OUT}/${out}`, b); tong += b.length
  return x
}
await nen('backdrop/backdrop_chinh_phuc.png', 1672, 941, 'nen.jpg', 'jpg', 82)
await nen('decor/de_dao_tong.png', 768, 512, 'de_tong.webp')
await nen('decor/de_dao_chu_de.png', 512, 512, 'de_cd.webp')
await nen('decor/cau_anh_sang.png', 1024, 512, 'cau_sang.webp')
const thap = {}
for (const ten of ['thap_tong', ...Array.from({ length: 8 }, (_, i) => `thap_cd_${i + 1}`)]) {
  const W = 512, H = 768, x = await nen(`decor/${ten}.png`, W, H, `${ten}.webp`)
  const d = x.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (d[(j * W + i) * 4 + 3] > 40) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j }
  const r = (v) => +v.toFixed(4)
  thap[ten] = { x0: r(x0 / W), y0: r(y0 / H), x1: r((x1 + 1) / W), y1: r((y1 + 1) / H) }
  console.log(ten, JSON.stringify(thap[ten]))
}
fs.writeFileSync('src/screens/hocsinh/skin/styles/rpgChinhPhuc.ts', `// SINH TỰ ĐỘNG bởi scripts/anime-chinh-phuc.mjs — đừng sửa tay. Màn CHINH PHỤC BK của style Anime RPG (kit hs-chinh-phuc-bk-v4, Đơn 14 Kit A).
// thap: hộp phần nhìn thấy của 9 tháp (tỉ lệ khung 512×768) — chân = đáy hộp. Đế/cầu: neo theo DESIGN.md mục 6 (tỉ lệ trong ảnh, giữ khung).
const G = '/bk-ui/hs/skin/rpg/chinhphuc'
export const CHINH_PHUC_RPG = {
  nen: \`\${G}/nen.jpg\`,
  thapTong: \`\${G}/thap_tong.webp\`,
  thapCd: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => \`\${G}/thap_cd_\${i}.webp\`),
  hop: ${JSON.stringify(thap)} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
  deTong: { src: \`\${G}/de_tong.webp\`, tl: 1536 / 1024, mat: [0.5, 0.35] as [number, number], mep: [[0.1, 0.36], [0.9, 0.36]] as [number, number][] },
  deCd: { src: \`\${G}/de_cd.webp\`, tl: 1, mat: [0.5, 0.4] as [number, number], mep: [[0.12, 0.42], [0.88, 0.42]] as [number, number][] },
  cau: { src: \`\${G}/cau_sang.webp\`, tl: 1774 / 887, a: [0.05, 0.6] as [number, number], b: [0.95, 0.6] as [number, number] },
}
`)
console.log('xong', (tong / 1024 / 1024).toFixed(1), 'MB')
