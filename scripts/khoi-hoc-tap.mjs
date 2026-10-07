// Nén hình style KHỐI VUÔNG cho khu HỌC TẬP + bản đồ phiêu lưu (Đơn K3 + phần bản đồ của Đơn K2 — design/DON-HANG-STYLE-KHOI.md) vào public/bk-ui/hs/skin/khoi/
// rồi SINH src/screens/hocsinh/skin/styles/khoiHocTap.ts (đừng sửa tay — chạy lại script này): cổng 5 đảo (Skin.hocTap) + màn Chinh phục BK
// (Skin.chinhPhuc), cùng khuôn rpgHocTap.ts / rpgChinhPhuc.ts. Danh sách ảnh bản đồ + quái khai tay ở skin/styles/khoiBanDo2d.ts (không có số đo).
// Ảnh gốc (ngoài git, bản chính trên Drive "kho ảnh hs.app/khoi"): design/bk-ui-src/khoi/hoc-tap/k3_*.png (K3, đã nhận diện bằng mắt — _doi_ten.log.txt)
//   · design/bk-ui-src/khoi/khoi/phieu-luu/*.png (K2). Đo: hộp PHẦN NHÌN THẤY (alpha > 40) như script RPG; 4 góc phải trong suốt.
// Chạy: node scripts/khoi-hoc-tap.mjs
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const K3 = 'design/bk-ui-src/khoi/hoc-tap', K2 = 'design/bk-ui-src/khoi/khoi/phieu-luu', K1 = 'design/bk-ui-src/khoi/khoi'
const OUT = 'public/bk-ui/hs/skin/khoi'
for (const d of ['hoctap', 'chinhphuc', 'phieuluu2d', 'quai', 'dau_truong']) fs.mkdirSync(`${OUT}/${d}`, { recursive: true })
const k3 = (so, ten) => `${K3}/k3_${String(so).padStart(2, '0')}_${ten}.png`
let tong = 0
const r4 = (v) => +v.toFixed(4)
const ghi = (file, buf) => { fs.writeFileSync(file, buf); tong += buf.length }

/** vẽ ảnh vào khung w×h (giữ khung, không cắt) */
async function nen(src, w, h, out, kieu = 'jpeg', q = 82) {
  const im = await loadImage(src), c = createCanvas(w, h), x = c.getContext('2d')
  x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, w, h)
  ghi(out, await c.encode(kieu, q)); return x
}
/** hộp alpha > 40 của ảnh (tỉ lệ khung) + kiểm 4 góc trong suốt */
function hopAlpha(x, W, H) {
  const d = x.getImageData(0, 0, W, H).data, a = (i, j) => d[(j * W + i) * 4 + 3]
  let x0 = W, y0 = H, x1 = 0, y1 = 0
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (a(i, j) > 40) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j }
  const goc = [a(0, 0), a(W - 1, 0), a(0, H - 1), a(W - 1, H - 1)]
  if (goc.some((v) => v > 10)) console.warn('  ⚠ góc không trong suốt', goc)
  return { x0: r4(x0 / W), y0: r4(y0 / H), x1: r4((x1 + 1) / W), y1: r4((y1 + 1) / H) }
}
/** cắt sát phần nhìn thấy (chừa lề `le` theo cạnh dài), đặt vào khung tỉ lệ `tl` (rộng/cao, null = giữ tỉ lệ cắt), cạnh dài = `dai` px */
async function cat(src, out, dai, { tl = null, le = 0.03, q = 84 } = {}) {
  const im = await loadImage(src), W = im.width, H = im.height, c = createCanvas(W, H), x = c.getContext('2d'); x.drawImage(im, 0, 0)
  const h = hopAlpha(x, W, H)
  let bx = h.x0 * W, by = h.y0 * H, bw = (h.x1 - h.x0) * W, bh = (h.y1 - h.y0) * H
  const m = Math.max(bw, bh) * le; bx -= m; by -= m; bw += 2 * m; bh += 2 * m
  let cw = bw, ch = bh
  if (tl) { if (cw / ch < tl) cw = ch * tl; else ch = cw / tl }
  const s = dai / Math.max(cw, ch), ow = Math.round(cw * s), oh = Math.round(ch * s)
  const o = createCanvas(ow, oh), y = o.getContext('2d'); y.imageSmoothingQuality = 'high'
  y.drawImage(im, bx, by, bw, bh, (ow - bw * s) / 2, (oh - bh * s) / 2, bw * s, bh * s) // giữa khung; tl ⇒ chân (đáy) không bắt buộc chạm đáy
  ghi(out, await o.encode('webp', q)); return { w: ow, h: oh }
}

// ── 1. icon 5 ô khu Học tập (K3 #02–#06) — PNG 192px như các icon ô khác của style ──────────────────────────────
const O = ['hoc_chu_de', 'luyen_yeu', 'dau_truong', 'chinh_phuc', 'giai_vo_dich']
for (const [i, o] of O.entries()) await nen(k3(2 + i, `khoi_o_${o}`), 192, 192, `${OUT}/o_${o}.png`, 'png')

// ── 2. cổng Học tập (K3 #07–#13) ────────────────────────────────────────────────────────────────────────────
await nen(k3(7, 'khoi_ht_nen_ngang'), 1672, 941, `${OUT}/hoctap/nen_ngang.jpg`)
await nen(k3(8, 'khoi_ht_nen_doc'), 941, 1672, `${OUT}/hoctap/nen_doc.jpg`)
const hopDao = {}
for (const [i, o] of O.entries()) {
  const x = await nen(k3(9 + i, `dao_${o}`), 768, 768, `${OUT}/hoctap/dao_${o}.webp`, 'webp', 84)
  hopDao[o] = hopAlpha(x, 768, 768); console.log('đảo', o, JSON.stringify(hopDao[o]))
}

// ── 3. Chinh phục BK (K3 #15–#27) — khung giữ nguyên như RPG (tháp 512×768 · đế tổng 768×512 · đế chủ đề 512² · cầu 1024×512) ────
await nen(k3(15, 'khoi_cp_nen'), 1672, 941, `${OUT}/chinhphuc/nen.jpg`)
await nen(k3(25, 'de_tong'), 768, 512, `${OUT}/chinhphuc/de_tong.webp`, 'webp', 84)
await nen(k3(26, 'de_cd'), 512, 512, `${OUT}/chinhphuc/de_cd.webp`, 'webp', 84)
await nen(k3(27, 'cau'), 1024, 512, `${OUT}/chinhphuc/cau.webp`, 'webp', 84)
const hopThap = {}
for (const [i, ten] of ['thap_tong', ...Array.from({ length: 8 }, (_, k) => `thap_cd_${k + 1}`)].entries()) {
  const x = await nen(k3(16 + i, ten), 512, 768, `${OUT}/chinhphuc/${ten}.webp`, 'webp', 84)
  hopThap[ten] = hopAlpha(x, 512, 768); console.log(ten, JSON.stringify(hopThap[ten]))
}

// ── 4. sân Đấu trường (K3 #49) — 1600×574 như RPG ─────────────────────────────────────────────────────────────
await nen(k3(49, 'nen_san_dau'), 1600, 574, `${OUT}/dau_truong/nen_san_dau.jpg`)

// ── 5. bản đồ phiêu lưu 2D (K2 + K3 #28–#48) ───────────────────────────────────────────────────────────────────
const P = `${OUT}/phieuluu2d`
await nen(`${K2}/nen_the_gioi.png`, 1672, 941, `${P}/the_gioi.jpg`)
// 10 đảo thế giới: cắt sát rồi đặt vào khung VUÔNG 640 (mọi đảo cùng tỉ lệ khung ⇒ TheGioi2D dùng 1 tỉ lệ)
const DAO_TG = { rung: `${K2}/dao_rung.png`, bang: `${K2}/dao_bang.png`, nui_lua: `${K2}/dao_nui_lua.png`, bien_dao: `${K2}/dao_bien.png`, sa_mac: `${K2}/dao_sa_mac.png`,
  dam_lay: `${K2}/dao_dam_lay.png`, thanh_co: `${K2}/dao_thanh_co.png`, troi_sao: `${K2}/dao_troi_sao.png`, anh_dao: k3(28, 'dao_anh_dao'), dong_gio: k3(29, 'dao_dong_gio') }
for (const [b, src] of Object.entries(DAO_TG)) await cat(src, `${P}/dao_${b}.webp`, 640, { tl: 1 })
const VUNG = { rung: `${K2}/nen_vung_rung.png`, bang: `${K2}/nen_vung_bang.png`, nui_lua: `${K2}/nen_vung_nui_lua.png`, bien_dao: `${K2}/nen_vung_bien_dao.png`,
  sa_mac: `${K2}/nen_vung_sa_mac.png`, dam_lay: `${K2}/nen_vung_dam_lay.png`, thanh_co: `${K2}/nen_vung_thanh_co.png`, troi_sao: `${K2}/nen_vung_troi_sao.png`,
  anh_dao: k3(30, 'nen_vung_anh_dao'), dong_gio: k3(31, 'nen_vung_dong_gio') }
for (const [b, src] of Object.entries(VUNG)) await nen(src, 1672, 941, `${P}/nen_vung_${b}.jpg`)
const DANG = ['rung', 'bang', 'nui_lua', 'bien_dao', 'anh_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao', 'dong_gio']
for (const [i, b] of DANG.entries()) await nen(k3(39 + i, `nen_dang_${b}`), 1672, 941, `${P}/nen_dang_${b}.jpg`)
// mốc (cùng thứ tự LOAI_MOC của RPG: thanh · thap · trai · den · cong · cau) — cổng lấy từ K2 #41
const MOC = { thanh: k3(32, 'moc_thanh'), thap: k3(33, 'moc_thap'), trai: k3(34, 'moc_trai'), den: k3(35, 'moc_den'), cong: `${K2}/cong_khu_vuc.png`, cau: k3(36, 'moc_cau') }
for (const [m, src] of Object.entries(MOC)) await cat(src, `${P}/moc_${m}.webp`, 384)
await cat(k3(37, 'be_da'), `${P}/be_da.webp`, 384)
await cat(k3(38, 'may_suong'), `${P}/may_suong.webp`, 768, { le: 0.01 })
await cat(`${K2}/co_chinh_phuc.png`, `${P}/co_chinh_phuc.webp`, 384)
await cat(`${K1}/khoi_o_the_gioi.png`, `${P}/la_ban.webp`, 256) // la bàn = icon ô Thế giới BK (K1 #23)

// ── 6. quái + boss khối (K2 #06–#15, #25–#34) — cắt sát, cạnh dài 512 ─────────────────────────────────────────
const QUAI = ['slime_la', 'slime_lua', 'meo_bang', 'rua_da', 'cu_dem', 'ca_bong', 'nam_ma', 'chim_set', 'tho_gio', 'be_nham', 'sao_bien', 'ech_doc', 'dom_dom', 'soi_bang', 'bo_giap', 'ma_lua']
const BOSS = ['rong_con', 'golem_pha_le', 'phuong_hoang', 'bach_tuoc']
for (const q of QUAI) await cat(`${K2}/quai_${q}.png`, `${OUT}/quai/${q}.webp`, 512)
for (const q of BOSS) await cat(`${K2}/boss_${q}.png`, `${OUT}/quai/${q}.webp`, 512)

// ── sinh cấu hình ──────────────────────────────────────────────────────────────────────────────────────────────
const DAU = '// SINH TỰ ĐỘNG bởi scripts/khoi-hoc-tap.mjs — đừng sửa tay.'
fs.writeFileSync('src/screens/hocsinh/skin/styles/khoiHocTap.ts', `${DAU} Khu HỌC TẬP + màn CHINH PHỤC BK của style Khối vuông (Đơn K3, 07/10).
// hop = hộp PHẦN NHÌN THẤY (alpha > 40) theo tỉ lệ khung PNG — cùng khuôn rpgHocTap.ts / rpgChinhPhuc.ts. Neo đế/cầu đo trên ảnh gốc
// (mặt đá = hàng rộng nhất của đế: tổng y≈0,337 · chủ đề y≈0,404; cầu: mặt ván y≈0,60, 2 đầu sát mép ảnh).
const G = '/bk-ui/hs/skin/khoi/hoctap', C = '/bk-ui/hs/skin/khoi/chinhphuc'
export const HOC_TAP_KHOI = {
  nen: \`url(\${G}/nen_ngang.jpg) center / cover no-repeat, #f7c6a3\`,
  nenDoc: \`url(\${G}/nen_doc.jpg) center / cover no-repeat, #f7c6a3\`,
  dao: { ${O.map((id) => `${id}: \`\${G}/dao_${id}.webp\``).join(', ')} },
  hop: ${JSON.stringify(hopDao)} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
}
export const CHINH_PHUC_KHOI = {
  nen: \`\${C}/nen.jpg\`,
  thapTong: \`\${C}/thap_tong.webp\`,
  thapCd: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => \`\${C}/thap_cd_\${i}.webp\`),
  hop: ${JSON.stringify(hopThap)} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
  deTong: { src: \`\${C}/de_tong.webp\`, tl: 1536 / 1024, mat: [0.5, 0.337] as [number, number] },
  deCd: { src: \`\${C}/de_cd.webp\`, tl: 1, mat: [0.5, 0.404] as [number, number] },
  cau: { src: \`\${C}/cau.webp\`, tl: 2, a: [0.02, 0.6] as [number, number], b: [0.98, 0.6] as [number, number] },
}
`)
console.log('xong', (tong / 1024 / 1024).toFixed(1), 'MB')
