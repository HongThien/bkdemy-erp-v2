// Nén 3 kit lục địa (design/bk-ui-src/AppHS: rừng · thành cổ · ảo đảo — Đơn 12) vào public/bk-ui/hs/skin/rpg/lucdia/<biome>/ và sinh số đo neo
// (src/screens/hocsinh/phieuluu/ban2d/kitLucDia.anh.ts). Cắt sát hộp alpha (alpha>40 — bỏ quầng mờ), công trình rộng ≤640px WebP, nhân vật cao 420px WebP
// (CẮT CHUNG 1 hộp cho cả 3 tư thế ⇒ cùng đường chân giữa các frame), nền JPG q80. Neo công trình lấy theo DESIGN.md từng kit. Chạy lại được (ghi đè).
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'design/bk-ui-src/AppHS', OUT = 'public/bk-ui/hs/skin/rpg/lucdia'
const M = (n) => Array.from({ length: 8 }, (_, i) => `moc_${i + 1}`).slice(0, n)
const KITS = [
  { biome: 'rung', dir: 'lục địa rừng', nen: 'assets/backdrop/nen_rung_va_duong_mon.png',
    decor: ['01_tup_leu', '02_nha_go', '03_thap_canh', '04_cau_day_leo', '05_den_co', '06_ham_nguc_goc_cay', '07_phao_dai', '08_lau_dai'],
    // neo trong CHÍNH PNG gốc (tỉ lệ 0–1, DESIGN.md §6) — đổi sang hộp đã cắt ở dưới
    neoGoc: [[0.5, 0.9], [0.65, 0.9], [0.5, 0.9], [0.5, 0.9], [0.5, 0.89], [0.5, 0.91], [0.5, 0.88], [0.5, 0.95]],
    nam: ['nam_dung', 'nam_chay_chan_trai', 'nam_chay_chan_phai'], nu: ['nu_dung', 'nu_chay_chan_trai', 'nu_chay_chan_phai'] },
  { biome: 'thanh_co', dir: 'hs-luc-dia-thanh_co-v1', nen: 'assets/backdrop/backdrop_luc_dia_thanh_co.png', decor: M(8), neoCat: [0.5, 1],
    nam: ['chibi_nam_dung', 'chibi_nam_chay_1', 'chibi_nam_chay_2'], nu: ['chibi_nu_dung', 'chibi_nu_chay_1', 'chibi_nu_chay_2'] },
  { biome: 'dam_lay', dir: 'hs-luc-dia-dam_lay-v1', nen: 'assets/backdrop/backdrop_luc_dia_dam_lay.png',
    decor: ['decor_01_nha_san', 'decor_02_leu_da', 'decor_03_thap_canh', 'decor_04_cau_van', 'decor_06_hang_bun', 'decor_05_den_reu', /* ĐỔI chỗ 5↔6 theo ĐƯỜNG THẬT (cầu → hang bùn → đền rêu), xem DEVLOG 02/10 */ 'decor_07_phao_dai_go', 'decor_08_lau_dai_dom_dom'], neoCat: [0.5, 0.97], neoRieng: { 3: [0.5, 0.5] } /* cầu ván: neo ở TÂM mặt cầu */ },
  { biome: 'sa_mac', dir: 'hs-luc-dia-sa-mac-6-v1', nen: 'assets/backdrop/backdrop_luc_dia_sa_mac_6.png', decor: M(6), neoCat: [0.5, 0.995] },
  { biome: 'anh_dao', dir: 'hs-luc-dia-and_dao-v4', nen: 'assets/backdrop/backdrop_luc_dia_and_dao.png', decor: M(8), neoCat: [0.5, 0.94],
    nam: ['chibi_nam_dung', 'chibi_nam_chay_1', 'chibi_nam_chay_2'], nu: ['chibi_nu_dung', 'chibi_nu_chay_1', 'chibi_nu_chay_2'] },
]

async function doc(f) {
  const im = await loadImage(f), c = createCanvas(im.width, im.height), g = c.getContext('2d'); g.drawImage(im, 0, 0)
  return { im, W: im.width, H: im.height, d: g.getImageData(0, 0, im.width, im.height).data }
}
function hop(a, ngua = 40) {
  let x0 = a.W, y0 = a.H, x1 = 0, y1 = 0
  for (let y = 0; y < a.H; y++) for (let x = 0; x < a.W; x++) if (a.d[(y * a.W + x) * 4 + 3] > ngua) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
  return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }
}
async function cat(a, b, k, ra) {
  const w = Math.round(b.w * k), h = Math.round(b.h * k), c = createCanvas(w, h), g = c.getContext('2d')
  g.imageSmoothingQuality = 'high'; g.drawImage(a.im, b.x, b.y, b.w, b.h, 0, 0, w, h)
  fs.writeFileSync(ra, await c.encode('webp', 84)); return { w, h }
}

const meta = {}
for (const kit of KITS) {
  const dir = path.join(SRC, kit.dir), out = path.join(OUT, kit.biome); fs.mkdirSync(out, { recursive: true })
  const nen = await loadImage(path.join(dir, kit.nen)), cn = createCanvas(nen.width, nen.height); cn.getContext('2d').drawImage(nen, 0, 0)
  fs.writeFileSync(path.join(out, 'nen.jpg'), cn.toBuffer('image/jpeg', 80))
  const moc = []
  for (let i = 0; i < kit.decor.length; i++) {
    const a = await doc(path.join(dir, 'assets/decor', kit.decor[i] + '.png')), b = hop(a), k = Math.min(1, 640 / b.w)
    const { w, h } = await cat(a, b, k, path.join(out, `moc_${i + 1}.webp`))
    // neo: kit rừng cho theo PNG gốc ⇒ đổi sang toạ độ trong hộp đã cắt; hai kit kia neo ở giữa đáy hộp (bỏ lề alpha)
    const ax = kit.neoGoc ? (kit.neoGoc[i][0] * a.W - b.x) / b.w : (kit.neoRieng?.[i] ?? kit.neoCat)[0]
    const ay = kit.neoGoc ? (kit.neoGoc[i][1] * a.H - b.y) / b.h : (kit.neoRieng?.[i] ?? kit.neoCat)[1]
    moc.push({ w, h, ax: +Math.min(1, Math.max(0, ax)).toFixed(3), ay: +Math.min(1, Math.max(0, ay)).toFixed(3) })
  }
  const nv = {}
  for (const g of kit.nam ? ['nam', 'nu'] : []) { // nhân vật riêng của kit (kit cũ) — bản đồ giờ dùng nhân vật chính chung nên kit mới bỏ qua
    const fr = []; for (const f of kit[g]) fr.push(await doc(path.join(dir, 'assets/characters', f + '.png')))
    // hộp chung = hợp hộp alpha 3 tư thế (cùng đường chân); trục thân x≈0.55 của hộp gốc (DESIGN rừng §6) thay cho tâm bề rộng áo choàng
    const bs = fr.map((a) => hop(a)), x0 = Math.min(...bs.map((b) => b.x)), y0 = Math.min(...bs.map((b) => b.y))
    const x1 = Math.max(...bs.map((b) => b.x + b.w)), y1 = Math.max(...bs.map((b) => b.y + b.h)), B = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }, k = Math.min(1, 420 / B.h)
    let w = 0, h = 0
    for (let i = 0; i < 3; i++) ({ w, h } = await cat(fr[i], B, k, path.join(out, `nv_${g}_${['dung', 'c1', 'c2'][i]}.webp`)))
    nv[g] = { w, h, ax: +Math.min(1, Math.max(0, (0.55 * fr[0].W - B.x) / B.w)).toFixed(3), ay: 1 }
  }
  meta[kit.biome] = nv.nam ? { moc, nv } : { moc }
  console.log(kit.biome, 'ok', moc.map((m) => `${m.w}x${m.h}`).join(' '))
}
fs.writeFileSync('src/screens/hocsinh/phieuluu/ban2d/kitLucDia.anh.ts',
  `// SINH TỰ ĐỘNG bởi scripts/anime-kit-lucdia.mjs — đừng sửa tay. Kích thước (px) + neo (0–1 trong hộp đã cắt) của ảnh công trình / nhân vật từng kit lục địa.\nexport interface AnhKit { w: number; h: number; ax: number; ay: number }\nexport const ANH_KIT: Record<string, { moc: AnhKit[]; nv?: { nam: AnhKit; nu: AnhKit } }> = ${JSON.stringify(meta, null, 2)}\n`)
