// Nén hình style LO-FI CHILL (design/DON-HANG-STYLE-LOFI.md — đơn L1–L4 + đơn bổ sung) vào public/bk-ui/hs/skin/lofi/ rồi SINH
// src/screens/hocsinh/skin/styles/lofiHocTap.ts (cổng 5 góc + Chinh phục BK) và lofiSong.ts (lớp nền "sống" + mảnh hoạt họa góc học) — đừng sửa tay 2 file đó.
// Ảnh gốc NGOÀI git (326 MB, bản chính trên Drive): mặc định design/bk-ui-src/lofi/ — máy khác chỗ thì đặt LOFI_SRC=<thư mục lofi>.
//   lofi/ (L1) · lofi/hoat-hoa/ (L2) · lofi/hoc-tap/ (L3) · lofi/phieu-luu/ (L4). Hình vẽ lại nằm cạnh bản cũ với tên <tên>_v2.png ⇒ script LUÔN ưu tiên _v2.
// Chạy: node scripts/lofi-hinh.mjs            (LOFI_SRC="C:/…/design/bk-ui-src/lofi" node scripts/lofi-hinh.mjs)
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const SRC = process.env.LOFI_SRC ?? 'design/bk-ui-src/lofi'
const OUT = 'public/bk-ui/hs/skin/lofi'
const REF = 'design/handoff/hs-skin-lofi-v2/reference'
if (!fs.existsSync(`${SRC}/lofi_nv_nam.png`)) { console.error(`Không thấy ảnh gốc ở ${SRC} — đặt LOFI_SRC trỏ tới thư mục lofi/ (tải từ Drive).`); process.exit(1) }
for (const d of ['', 'hoctap', 'chinhphuc', 'phieuluu2d', 'quai', 'dau_truong', 'song', 'song/nam', 'song/nu']) fs.mkdirSync(`${OUT}/${d}`, { recursive: true })
fs.mkdirSync(REF, { recursive: true })

/** đường dẫn ảnh gốc — có bản _v2 (vẽ lại) thì dùng */
const g = (rel) => { const v2 = `${SRC}/${rel}_v2.png`; return fs.existsSync(v2) ? v2 : `${SRC}/${rel}.png` }
const l3 = (so, ten) => g(`hoc-tap/l3_${String(so).padStart(2, '0')}_${ten}`)
const l4 = (so, ten) => g(`phieu-luu/l4_${String(so).padStart(2, '0')}_${ten}`)
let tong = 0
const r4 = (v) => +v.toFixed(4)
const ghi = (file, buf) => { fs.writeFileSync(file, buf); tong += buf.length }
const kep = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

async function ve(src) { const im = await loadImage(src), c = createCanvas(im.width, im.height), x = c.getContext('2d'); x.drawImage(im, 0, 0); return { im, c, x, W: im.width, H: im.height } }
/** vẽ ảnh vào khung w×h (kéo cho vừa khung — chỉ dùng khi nguồn cùng tỉ lệ) */
async function nen(src, w, h, out, kieu = 'jpeg', q = 82) {
  const im = await loadImage(src), c = createCanvas(w, h), x = c.getContext('2d')
  x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, w, h)
  ghi(out, await c.encode(kieu, q)); return x
}
/** phủ kín khung w×h, KHÔNG méo: cắt bớt theo chiều thừa; neoY = điểm (tỉ lệ dọc) giữ nguyên vị trí sau khi cắt (nền dạng: mặt đường ở 0,74) */
async function phu(src, w, h, out, { q = 82, neoY = 0.5 } = {}) {
  const im = await loadImage(src), c = createCanvas(w, h), x = c.getContext('2d')
  const s = Math.max(w / im.width, h / im.height), sw = w / s, sh = h / s
  x.imageSmoothingQuality = 'high'; x.drawImage(im, (im.width - sw) / 2, (im.height - sh) * neoY, sw, sh, 0, 0, w, h)
  ghi(out, await c.encode('jpeg', q))
}
/** hộp alpha > 40 của ảnh (tỉ lệ khung) + kiểm 4 góc trong suốt */
function hopAlpha(x, W, H, ten = '') {
  const d = x.getImageData(0, 0, W, H).data, a = (i, j) => d[(j * W + i) * 4 + 3]
  let x0 = W, y0 = H, x1 = 0, y1 = 0
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (a(i, j) > 40) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j }
  const goc = [a(0, 0), a(W - 1, 0), a(0, H - 1), a(W - 1, H - 1)]
  if (goc.some((v) => v > 10)) console.warn('  ⚠ góc không trong suốt', ten, goc)
  return { x0: r4(x0 / W), y0: r4(y0 / H), x1: r4((x1 + 1) / W), y1: r4((y1 + 1) / H) }
}
/** cắt sát phần nhìn thấy (chừa lề `le`), đặt vào khung tỉ lệ `tl` (rộng/cao; null = giữ tỉ lệ cắt), cạnh dài = `dai` px. day=true ⇒ vật CHẠM ĐÁY khung (tháp) */
async function cat(src, out, dai, { tl = null, le = 0.03, q = 84, day = false, kieu = 'webp' } = {}) {
  const { im, x, W, H } = await ve(src)
  const h = hopAlpha(x, W, H, src)
  let bx = h.x0 * W, by = h.y0 * H, bw = (h.x1 - h.x0) * W, bh = (h.y1 - h.y0) * H
  const m = Math.max(bw, bh) * le; bx -= m; by -= day ? m : m; bw += 2 * m; bh += day ? m : 2 * m
  let cw = bw, ch = bh
  if (tl) { if (cw / ch < tl) cw = ch * tl; else ch = cw / tl }
  const s = dai / Math.max(cw, ch), ow = Math.round(cw * s), oh = Math.round(ch * s)
  const o = createCanvas(ow, oh), y = o.getContext('2d'); y.imageSmoothingQuality = 'high'
  y.drawImage(im, bx, by, bw, bh, (ow - bw * s) / 2, day ? oh - bh * s : (oh - bh * s) / 2, bw * s, bh * s)
  ghi(out, await o.encode(kieu, q)); return { w: ow, h: oh, x: y }
}

// ════ 1. MÀN CHÍNH (L1) ══════════════════════════════════════════════════════════════════════════════════════════════
// ── 1a. nền Ngày mưa + Sân thượng: tranh nguyên tấm (ngang về 1504×1046 = tỉ lệ iPad; dọc 941×1672) ─────────────────────
for (const b of ['mua', 'san_thuong']) for (const gio of ['chieu', 'dem']) {
  await nen(g(`lofi_bg_${b}_${gio}_ngang`), 1504, 1046, `${OUT}/bg_${b}_${gio}_ngang.jpg`, 'jpeg', 80)
  await nen(g(`lofi_bg_${b}_${gio}_doc`), 941, 1672, `${OUT}/bg_${b}_${gio}_doc.jpg`, 'jpeg', 80)
}
// ── 1b. nền Góc cửa sổ = lớp PHÒNG (L2, trời tô phông xanh #00FF00) đặt trên dải TRỜI ⇒ 1 tranh tĩnh + 2 lớp rời cho mây trôi ────────
/** khoét phông xanh: alpha theo độ "xanh thuần" (g − max(r, b)); khử ám xanh ở mép. Trả hộp vùng trời (tỉ lệ khung). */
function khoetXanh(x, W, H) {
  const id = x.getImageData(0, 0, W, H), d = id.data
  let x0 = W, y0 = H, x1 = 0, y1 = 0
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const k = (j * W + i) * 4, r = d[k], gg = d[k + 1], b = d[k + 2], xanh = gg - Math.max(r, b)
    if (xanh <= 60) continue
    const a = 1 - kep((xanh - 60) / 90)          // xanh ≥ 150 ⇒ trong suốt hẳn
    d[k + 3] = Math.round(a * 255)
    if (a < 1) d[k + 1] = Math.min(gg, Math.max(r, b) + 8) // khử ám xanh ở điểm ảnh mép
    if (a < 0.5) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j }
  }
  x.putImageData(id, 0, 0)
  return { x0: r4(x0 / W), y0: r4(y0 / H), x1: r4((x1 + 1) / W), y1: r4((y1 + 1) / H) }
}
const nenSong = {}
for (const gio of ['chieu', 'dem']) {
  // dải trời: cao 600px, giữ tỉ lệ; nối 2 mép bằng cách hoà 6% bề ngang cuối vào đầu dải (trời chiều lệch mép ~7/255)
  const t = await loadImage(g(`hoat-hoa/lofi_troi_${gio}`)), th = 600, tw = Math.round(t.width * th / t.height)
  const hoa = Math.round(tw * 0.06), tc = createCanvas(tw - hoa, th), tx = tc.getContext('2d')
  tx.imageSmoothingQuality = 'high'; tx.drawImage(t, 0, 0, tw, th)
  const duoi = createCanvas(hoa, th), dx = duoi.getContext('2d'); dx.drawImage(t, 0, 0, t.width, t.height, -(tw - hoa), 0, tw, th) // phần đuôi bị cắt
  const idD = dx.getImageData(0, 0, hoa, th), idT = tx.getImageData(0, 0, hoa, th)
  for (let j = 0; j < th; j++) for (let i = 0; i < hoa; i++) { const k = (j * hoa + i) * 4, w = 1 - i / hoa; for (let c = 0; c < 3; c++) idT.data[k + c] = Math.round(idD.data[k + c] * w + idT.data[k + c] * (1 - w)) }
  tx.putImageData(idT, 0, 0)
  ghi(`${OUT}/song/troi_${gio}.jpg`, await tc.encode('jpeg', 82))
  for (const [kho, w, h] of [['ngang', 1672, 941], ['doc', 941, 1672]]) {
    const p = createCanvas(w, h), px = p.getContext('2d'); px.imageSmoothingQuality = 'high'
    px.drawImage(await loadImage(g(`hoat-hoa/lofi_lop_cua_so_${gio}_${kho}`)), 0, 0, w, h)
    const troi = khoetXanh(px, w, h)
    ghi(`${OUT}/song/phong_${gio}_${kho}.webp`, await p.encode('webp', 86))
    // tranh tĩnh = trời (đặt đúng hộp cửa sổ, cao bằng hộp) + phòng
    const c = createCanvas(w, h), x = c.getContext('2d'); x.imageSmoothingQuality = 'high'
    const bx = troi.x0 * w, by = troi.y0 * h, bh = (troi.y1 - troi.y0) * h, s = bh / th
    for (let dxv = 0; bx + dxv < troi.x1 * w; dxv += (tw - hoa) * s) x.drawImage(tc, bx + dxv, by, (tw - hoa) * s, bh)
    x.drawImage(p, 0, 0)
    ghi(`${OUT}/bg_cua_so_${gio}_${kho}.jpg`, await c.encode('jpeg', 82))
    nenSong[`${gio}_${kho}`] = { troi, tl: r4(w / h), tlTroi: r4((tw - hoa) / th) }
    console.log('nền cửa sổ', gio, kho, 'hộp trời', JSON.stringify(troi))
  }
}
// ── 1c. góc học (người + bàn + mèo): 640px bề ngang, làm mờ dần mép trái / phải / đáy (bàn bị cắt cụt ở mép khung); bản ĐÊM = phủ chàm + quầng đèn bàn ──
const NV_RONG = 640
const DEN = { nam: [0.72, 0.38], nu: [0.73, 0.40] }   // tâm chụp đèn bàn trong khung (đo trên ảnh gốc)
function moMep(d, W, H) {
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const f = kep(i / (W * 0.05)) * kep((W - 1 - i) / (W * 0.13)) * kep((H - 1 - j) / (H * 0.07))
    if (f < 1) d[(j * W + i) * 4 + 3] = Math.round(d[(j * W + i) * 4 + 3] * f)
  }
}
function banDem(d, W, H, [cx, cy]) {
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const k = (j * W + i) * 4, kc = Math.hypot((i / W - cx) / 0.95, (j / H - cy) / 0.8), t = Math.pow(kep(1 - kc), 1.6)
    d[k] = Math.round(d[k] * (0.46 + 0.56 * t)); d[k + 1] = Math.round(d[k + 1] * (0.44 + 0.5 * t)); d[k + 2] = Math.round(d[k + 2] * (0.7 + 0.1 * t))
  }
}
const khungNv = {}
/** vẽ 1 khung góc học về cỡ chuẩn; trả canvas + ctx */
async function veNv(src, W, H) { const c = createCanvas(W, H), x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(await loadImage(src), 0, 0, W, H); return { c, x } }
for (const gt of ['nam', 'nu']) {
  const goc = await loadImage(g(`lofi_nv_${gt}`)), W = NV_RONG, H = Math.round(NV_RONG * goc.height / goc.width)
  khungNv[gt] = { W, H }
  for (const dem of [false, true]) {
    const { c, x } = await veNv(g(`lofi_nv_${gt}`), W, H), id = x.getImageData(0, 0, W, H)
    if (dem) banDem(id.data, W, H, DEN[gt])
    moMep(id.data, W, H); x.putImageData(id, 0, 0)
    ghi(`${OUT}/nv_${gt}${dem ? '_dem' : ''}.webp`, await c.encode('webp', 88))
  }
}
// ── 1d. icon ô · banner · trang trí ─────────────────────────────────────────────────────────────────────────────────────
const O_HOME = 'tren_lop et btvn tu_luyen nhiem_vu rank thong_tin so_tay thi_thu bai_tap_giao cup xep_hang may_man vi_xu hoc_tu_dau the_gioi thu_vien tro_choi'.split(' ')
for (const o of O_HOME) await nen(g(`lofi_o_${o}`), 192, 192, `${OUT}/o_${o}.png`, 'png')
await nen(g('lofi_b_lich'), 192, 192, `${OUT}/b_lich.png`, 'png')
await nen(g('lofi_b_kiem_tra_lai'), 192, 192, `${OUT}/b_kiem_tra_lai.png`, 'png')
await nen(g('lofi_tt_goc'), 192, 192, `${OUT}/corner.png`, 'png')
await cat(g('lofi_tt_gach'), `${OUT}/divider.png`, 768, { le: 0.01, kieu: 'png' })
// ảnh toàn cảnh chuẩn (không vào app)
for (const [src, ten] of [[g('lofi_man_chinh_ipad'), 'lofi_man_chinh_ipad'], [g('lofi_man_chinh_ipad_dem'), 'lofi_man_chinh_ipad_dem'], [g('lofi_man_chinh_dt'), 'lofi_man_chinh_dt'],
  [g('lofi_lam_bai_ipad'), 'lofi_lam_bai_ipad'], [l3(1, 'lofi_hoc_tap_ipad'), 'lofi_hoc_tap_ipad'], [l3(14, 'lofi_chinh_phuc_ipad'), 'lofi_chinh_phuc_ipad'], [l4(1, 'ban_do_toan_canh'), 'lofi_ban_do_toan_canh']]) {
  const im = await loadImage(src), s = Math.min(1, 1400 / Math.max(im.width, im.height))
  const c = createCanvas(Math.round(im.width * s), Math.round(im.height * s)), x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, c.width, c.height)
  fs.writeFileSync(`${REF}/${ten}.jpg`, await c.encode('jpeg', 85))
}

// ════ 2. KHU HỌC TẬP (L3) ════════════════════════════════════════════════════════════════════════════════════════════
const O = ['hoc_chu_de', 'luyen_yeu', 'dau_truong', 'chinh_phuc', 'giai_vo_dich']
for (const [i, o] of O.entries()) await nen(l3(2 + i, `lofi_o_${o}`), 192, 192, `${OUT}/o_${o}.png`, 'png')
await nen(l3(7, 'lofi_ht_nen_ngang'), 1672, 941, `${OUT}/hoctap/nen_ngang.jpg`)
await nen(l3(8, 'lofi_ht_nen_doc'), 941, 1672, `${OUT}/hoctap/nen_doc.jpg`)
const hopDao = {}
for (const [i, o] of O.entries()) {
  const x = await nen(l3(9 + i, `goc_${o}`), 768, 768, `${OUT}/hoctap/dao_${o}.webp`, 'webp', 84)
  hopDao[o] = hopAlpha(x, 768, 768, o); console.log('góc', o, JSON.stringify(hopDao[o]))
}
// Chinh phục BK: tháp cắt sát rồi đặt CHẠM ĐÁY khung 512×768 (7 tháp vẽ lại về khung vuông 1254² ⇒ không kéo méo)
await nen(l3(15, 'lofi_cp_nen'), 1672, 941, `${OUT}/chinhphuc/nen.jpg`)
const hopThap = {}
for (const [i, ten] of ['thap_tong', ...Array.from({ length: 8 }, (_, k) => `thap_cd_${k + 1}`)].entries()) {
  const { x } = await cat(l3(16 + i, ten), `${OUT}/chinhphuc/${ten}.webp`, 768, { tl: 512 / 768, le: 0.012, day: true })
  hopThap[ten] = hopAlpha(x, 512, 768, ten); console.log(ten, JSON.stringify(hopThap[ten]))
}
/** đế đảo: tâm MẶT CỎ = giữa đỉnh đảo và hàng rộng nhất (mép trước của mặt cỏ nhìn chéo từ trên) */
async function de(src, out, w, h) {
  const x = await nen(src, w, h, out, 'webp', 84), d = x.getImageData(0, 0, w, h).data
  let y0 = -1, rong = 0, yRong = 0
  for (let j = 0; j < h; j++) { let n = 0; for (let i = 0; i < w; i++) if (d[(j * w + i) * 4 + 3] > 40) n++; if (n > w * 0.2 && y0 < 0) y0 = j; if (n > rong) { rong = n; yRong = j } }
  return [0.5, r4((y0 + yRong) / 2 / h)]
}
const matTong = await de(l3(25, 'de_tong'), `${OUT}/chinhphuc/de_tong.webp`, 768, 512)
const matCd = await de(l3(26, 'de_cd'), `${OUT}/chinhphuc/de_cd.webp`, 512, 512)
// cầu: 2 đầu ván = đáy cọc đầu cầu ở 2 mép ảnh
const xc = await nen(l3(27, 'cau'), 1024, 512, `${OUT}/chinhphuc/cau.webp`, 'webp', 84)
const dauCau = (cot) => { const d = xc.getImageData(cot, 0, 1, 512).data; let y1 = 0; for (let j = 0; j < 512; j++) if (d[j * 4 + 3] > 40) y1 = j; return r4((y1 - 10) / 512) }
const cauA = [0.03, dauCau(36)], cauB = [0.97, dauCau(1024 - 36)]
console.log('mặt đế', matTong, matCd, 'đầu cầu', cauA, cauB)
await nen(l3(28, 'nen_san_dau'), 1600, 574, `${OUT}/dau_truong/nen_san_dau.jpg`)

// ════ 3. BẢN ĐỒ PHIÊU LƯU 2D + BÉ TINH LINH (L4) ═════════════════════════════════════════════════════════════════════
const P = `${OUT}/phieuluu2d`
const V = ['rung', 'bang', 'nui_lua', 'bien_dao', 'anh_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao', 'dong_gio']
await phu(l4(2, 'nen_the_gioi'), 1672, 941, `${P}/the_gioi.jpg`)
for (const [i, b] of V.entries()) await cat(l4(3 + i, `dao_${b}`), `${P}/dao_${b}.webp`, 640, { tl: 1 })
for (const [i, b] of V.entries()) await phu(l4(13 + i, `nen_vung_${b}`), 1672, 941, `${P}/nen_vung_${b}.jpg`)
for (const [i, b] of V.entries()) await phu(l4(33 + i, `nen_dang_${b}`), 1672, 941, `${P}/nen_dang_${b}.jpg`, { neoY: 0.74 }) // giữ mặt đường ở 74%
for (const [i, m] of ['thanh', 'thap', 'trai', 'den', 'cau', 'cong'].entries()) await cat(l4(43 + i, `moc_${m}`), `${P}/moc_${m}.webp`, 384)
await cat(l4(49, 'be_da'), `${P}/be_da.webp`, 384)
await cat(l4(50, 'may_suong'), `${P}/may_suong.webp`, 768, { le: 0.01 })
await cat(l4(51, 'co_chinh_phuc'), `${P}/co_chinh_phuc.webp`, 384)
await cat(l4(52, 'la_ban'), `${P}/la_ban.webp`, 256)
const QUAI = ['slime_la', 'slime_lua', 'meo_bang', 'rua_da', 'cu_dem', 'ca_bong', 'nam_ma', 'chim_set']
const QUAI2 = ['tho_gio', 'be_nham', 'sao_bien', 'ech_doc', 'dom_dom', 'soi_bang', 'bo_giap', 'ma_lua']
for (const [i, q] of QUAI.entries()) await cat(l4(23 + i, `quai_${q}`), `${OUT}/quai/${q}.webp`, 512)
for (const [i, q] of QUAI2.entries()) await cat(l4(53 + i, `quai_${q}`), `${OUT}/quai/${q}.webp`, 512)
for (const [so, q] of [[31, 'rong_con'], [32, 'golem_pha_le'], [61, 'phuong_hoang'], [62, 'bach_tuoc']]) await cat(l4(so, `boss_${q}`), `${OUT}/quai/${q}.webp`, 512)

// ════ 4. HOẠT HỌA GÓC HỌC (L2) — GHÉP VÙNG: mỗi khung vẽ lại chỉ lấy đúng MẢNH thay đổi (tay / đầu / đuôi mèo / đầu mèo), mép mảnh mờ dần ═══════════
// Khung vẽ lại lệch 8–27% điểm ảnh so với hình gốc (đo 11/10) ⇒ KHÔNG thay cả hình. Trước khi cắt mảnh: dò độ lệch tịnh tiến của khung so với gốc
// (trên viền quanh mảnh) rồi bù lại. Hộp mảnh (tỉ lệ khung) chọn bằng mắt trên ảnh gốc.
// Lúc chạy (skin/GocHocSong.tsx) ghép kiểu THAY chứ không ĐÈ: xoá hộp trên hình gốc theo độ mờ mép f rồi CỘNG mảnh (màu khung × f) ⇒ chỗ khung mới
// trong suốt (đầu quay đi) không còn lộ đầu cũ. Công thức f (mờ dần 12% cạnh ngắn, cạnh sát mép khung thì giữ đặc) phải KHỚP hàm doMoManh ở đó.
const MANH = {
  nam: { tay: [0.40, 0.45, 0.62, 0.66], dau: [0.24, 0.0, 0.78, 0.40], duoi: [0.0, 0.33, 0.22, 0.60], meo: [0.22, 0.44, 0.40, 0.64] },
  nu:  { tay: [0.38, 0.44, 0.60, 0.66], dau: [0.10, 0.02, 0.70, 0.48], duoi: [0.0, 0.52, 0.24, 0.92], meo: [0.22, 0.50, 0.38, 0.70] },
}
const KHUNG = [['viet_2', 'tay', 'nv'], ['viet_3', 'tay', 'nv'], ['viet_4', 'tay', 'nv'], ['ngang_len', 'dau', 'nv'], ['gat_gu', 'dau', 'nv'], ['duoi_2', 'duoi', 'meo'], ['duoi_3', 'duoi', 'meo'], ['ngap', 'meo', 'meo']]
const xam = (d, W, x0, y0, w, h) => { const o = new Float32Array(w * h); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const k = ((y0 + j) * W + x0 + i) * 4; o[j * w + i] = d[k + 3] < 40 ? -1 : (d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11) } return o }
/** độ lệch (dx, dy) của khung so với gốc: thử ±8px trên VIỀN quanh mảnh (phần không đổi), chọn chỗ sai khác nhỏ nhất */
function doLech(dG, dK, W, H, [x0, y0, x1, y1]) {
  const le = 0.06, ax = Math.max(8, Math.round((x0 - le) * W)), ay = Math.max(8, Math.round((y0 - le) * H)), bx = Math.min(W - 8, Math.round((x1 + le) * W)), by = Math.min(H - 8, Math.round((y1 + le) * H))
  const w = bx - ax, h = by - ay, G = xam(dG, W, ax, ay, w, h)
  const trong = (i, j) => i + ax > x0 * W && i + ax < x1 * W && j + ay > y0 * H && j + ay < y1 * H
  let tot = [0, 0], nho = Infinity
  for (let dy = -8; dy <= 8; dy++) for (let dx = -8; dx <= 8; dx++) {
    const K = xam(dK, W, ax + dx, ay + dy, w, h); let s = 0, n = 0
    for (let j = 0; j < h; j += 2) for (let i = 0; i < w; i += 2) { if (trong(i, j)) continue; const a = G[j * w + i], b = K[j * w + i]; if (a < 0 || b < 0) continue; s += Math.abs(a - b); n++ }
    if (n && s / n < nho) { nho = s / n; tot = [dx, dy] }
  }
  return { lech: tot, sai: r4(nho) }
}
const song = { nam: {}, nu: {} }
for (const gt of ['nam', 'nu']) {
  const { W, H } = khungNv[gt]
  const gocC = await veNv(g(`lofi_nv_${gt}`), W, H), dG = gocC.x.getImageData(0, 0, W, H).data
  for (const [ten, vung, loai] of KHUNG) {
    const src = g(`hoat-hoa/lofi_${loai === 'nv' ? 'nv' : 'meo'}_${gt}_${ten}`)
    const kh = await veNv(src, W, H), dK = kh.x.getImageData(0, 0, W, H).data, hop = MANH[gt][vung]
    const { lech: [dx, dy], sai } = doLech(dG, dK, W, H, hop)
    const x0 = Math.round(hop[0] * W), y0 = Math.round(hop[1] * H), w = Math.round((hop[2] - hop[0]) * W), h = Math.round((hop[3] - hop[1]) * H)
    // khung dịch về đúng chỗ gốc + mờ mép khung y như hình gốc (moMep) rồi mới cắt mảnh
    const kd = createCanvas(W, H), kx = kd.getContext('2d'); kx.drawImage(kh.c, -dx, -dy)
    const idK = kx.getImageData(0, 0, W, H); moMep(idK.data, W, H); kx.putImageData(idK, 0, 0)
    const c = createCanvas(w, h), x = c.getContext('2d'); x.drawImage(kd, x0, y0, w, h, 0, 0, w, h)
    const id = x.getImageData(0, 0, w, h), m = Math.max(6, Math.round(Math.min(w, h) * 0.12))
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const f = (x0 > 2 ? kep(i / m) : 1) * (x0 + w < W - 2 ? kep((w - 1 - i) / m) : 1) * (y0 > 2 ? kep(j / m) : 1) * (y0 + h < H - 2 ? kep((h - 1 - j) / m) : 1)
      if (f < 1) id.data[(j * w + i) * 4 + 3] = Math.round(id.data[(j * w + i) * 4 + 3] * f)
    }
    x.putImageData(id, 0, 0)
    ghi(`${OUT}/song/${gt}/${ten}.webp`, await c.encode('webp', 88))
    song[gt][ten] = { hop: hop.map(r4), lech: [dx, dy], sai }
    console.log('mảnh', gt, ten, 'lệch', dx, dy, 'sai khác viền', sai)
  }
}
for (const [fx, w, h] of [['la', 128, 128], ['not_nhac', 128, 128], ['sao_giay', 128, 128], ['hoi_nuoc', 128, 256], ['cuon_len', 256, 256]]) {
  await cat(g(`hoat-hoa/lofi_fx_${fx}`), `${OUT}/song/fx_${fx}.webp`, Math.max(w, h), { le: 0.02 })
}

// ════ sinh cấu hình ══════════════════════════════════════════════════════════════════════════════════════════════════
const DAU = '// SINH TỰ ĐỘNG bởi scripts/lofi-hinh.mjs — đừng sửa tay.'
const HOP = 'Record<string, { x0: number; y0: number; x1: number; y1: number }>'
fs.writeFileSync('src/screens/hocsinh/skin/styles/lofiHocTap.ts', `${DAU} Khu HỌC TẬP + màn CHINH PHỤC BK của style Lo-fi chill (Đơn L3 + bổ sung, 12/10).
// hop = hộp PHẦN NHÌN THẤY (alpha > 40) theo tỉ lệ khung — cùng khuôn khoiHocTap.ts. mat = tâm mặt cỏ của đế (giữa đỉnh đảo và hàng rộng nhất);
// cầu: a/b = đáy cọc 2 đầu cầu. Tháp đã cắt sát + đặt chạm đáy khung 512×768.
const G = '/bk-ui/hs/skin/lofi/hoctap', C = '/bk-ui/hs/skin/lofi/chinhphuc'
export const HOC_TAP_LOFI = {
  nen: \`url(\${G}/nen_ngang.jpg) center / cover no-repeat, #f3b38a\`,
  nenDoc: \`url(\${G}/nen_doc.jpg) center / cover no-repeat, #f3b38a\`,
  dao: { ${O.map((id) => `${id}: \`\${G}/dao_${id}.webp\``).join(', ')} },
  hop: ${JSON.stringify(hopDao)} as ${HOP},
}
export const CHINH_PHUC_LOFI = {
  nen: \`\${C}/nen.jpg\`,
  thapTong: \`\${C}/thap_tong.webp\`,
  thapCd: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => \`\${C}/thap_cd_\${i}.webp\`),
  hop: ${JSON.stringify(hopThap)} as ${HOP},
  deTong: { src: \`\${C}/de_tong.webp\`, tl: 1536 / 1024, mat: ${JSON.stringify(matTong)} as [number, number] },
  deCd: { src: \`\${C}/de_cd.webp\`, tl: 1, mat: ${JSON.stringify(matCd)} as [number, number] },
  cau: { src: \`\${C}/cau.webp\`, tl: 2, a: ${JSON.stringify(cauA)} as [number, number], b: ${JSON.stringify(cauB)} as [number, number] },
}
`)
const m1 = (gt, ten) => `{ src: \`\${S}/${gt}/${ten}.webp\`, hop: ${JSON.stringify(song[gt][ten].hop)} as Hop4 }`
const nvSong = (gt) => `{
    rong: ${khungNv[gt].W}, cao: ${khungNv[gt].H}, den: ${JSON.stringify(DEN[gt])} as [number, number],
    viet: [${['viet_2', 'viet_3', 'viet_4'].map((t) => m1(gt, t)).join(', ')}],
    nghi: [${['ngang_len', 'gat_gu'].map((t) => m1(gt, t)).join(', ')}],
    duoi: [${['duoi_2', 'duoi_3'].map((t) => m1(gt, t)).join(', ')}],
    ngap: ${m1(gt, 'ngap')},
  }`
const lopNen = (gio, k) => `${k}: lop('${gio}', '${k}', ${JSON.stringify(nenSong[`${gio}_${k}`].troi)}, ${nenSong[`${gio}_${k}`].tl}, ${nenSong[`${gio}_${k}`].tlTroi})`
fs.writeFileSync('src/screens/hocsinh/skin/styles/lofiSong.ts', `${DAU} Màn chính "SỐNG" của style Lo-fi chill (Đơn L2, 12/10) — hợp đồng HomeSong ở skin/kieu.ts.
// nen: lớp PHÒNG đã khoét trời (phông xanh) + dải TRỜI trôi sau cửa sổ; hopTroi = hộp vùng trời trong khung phòng (tỉ lệ), tl = rộng/cao khung phòng, tlTroi = rộng/cao dải trời.
// nv: MẢNH hoạt họa cắt từ khung vẽ lại (đã bù lệch so với hình gốc, mép mờ dần) — hop = [x0, y0, x1, y1] tỉ lệ khung góc học; den = tâm ánh đèn bàn.
// Hình hiệu ứng rời (lá · nốt nhạc · sao giấy · hơi nước · cuộn len) đã nén sẵn ở public/bk-ui/hs/skin/lofi/song/fx_*.webp — chưa màn nào dùng.
import type { HomeSong, LopNenSong } from '../kieu'
type Hop4 = [number, number, number, number]
const S = '/bk-ui/hs/skin/lofi/song'
const lop = (gio: 'chieu' | 'dem', kho: 'ngang' | 'doc', hopTroi: LopNenSong['hopTroi'], tl: number, tlTroi: number): LopNenSong =>
  ({ phong: \`\${S}/phong_\${gio}_\${kho}.webp\`, troi: \`\${S}/troi_\${gio}.jpg\`, hopTroi, tl, tlTroi })
export const SONG_LOFI: Required<Pick<HomeSong, 'nen' | 'nv'>> = {
  nen: {
    cua_so: {
      sang: { ${lopNen('chieu', 'ngang')}, ${lopNen('chieu', 'doc')} },
      toi: { ${lopNen('dem', 'ngang')}, ${lopNen('dem', 'doc')} },
    },
  },
  nv: {
    nam: ${nvSong('nam')},
    nu: ${nvSong('nu')},
  },
}
`)
console.log('xong', (tong / 1024 / 1024).toFixed(1), 'MB')
