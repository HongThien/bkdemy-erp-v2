// Nén hình style HALLOWEEN (design/DON-HANG-STYLE-HALLOWEEN.md, đơn H1–H5, hình về đủ 25/10) vào public/bk-ui/hs/skin/halloween/ rồi SINH
// src/screens/hocsinh/skin/styles/halloweenHocTap.ts (cổng 5 đảo + Chinh phục BK) · halloweenSong.ts (bé ma Home đổi tư thế) · halloweenDau.ts
// (bộ đánh 15 tư thế × 2 + 5 hiệu ứng) — đừng sửa tay 3 file đó.
// Ảnh gốc NGOÀI git (195 MB, bản chính trên Drive): mặc định design/bk-ui-src/halloween/ — máy khác chỗ thì đặt HALLOWEEN_SRC=<thư mục halloween>.
//   halloween/ (H1) · hoat-hoa/ (H2) · hoc-tap/ (H3) · phieu-luu/ (H4) · danh/ (H5). Tên file đã đổi đúng tên đơn lúc kiểm hàng (sổ _doi_ten.log.txt).
//   Hình vẽ lại (nếu có) để cạnh bản cũ với tên <tên>_v2.png ⇒ script LUÔN ưu tiên _v2.
// Chạy: node scripts/halloween-hinh.mjs
// Khuôn: scripts/dang-yeu-hinh.mjs. Khác Đáng yêu: đế (lá thu + bí dưới chân) là lớp VẼ RIÊNG (H2 hw_de_*) ⇒ không phải tách cỏ khỏi hình gốc,
// chỉ cần tách THÂN bé ma khỏi đám lá trong hình H1; có thêm bộ đánh (H5).
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const SRC = process.env.HALLOWEEN_SRC ?? 'design/bk-ui-src/halloween'
const OUT = 'public/bk-ui/hs/skin/halloween'
const REF = 'design/handoff/hs-skin-halloween-v1/reference'
if (!fs.existsSync(`${SRC}/hw_nv_nam.png`)) { console.error(`Không thấy ảnh gốc ở ${SRC} — đặt HALLOWEEN_SRC trỏ tới thư mục halloween/ (tải từ Drive).`); process.exit(1) }
for (const d of ['', 'hoctap', 'chinhphuc', 'phieuluu2d', 'quai', 'dau_truong', 'song', 'song/nam', 'song/nu', 'dau', 'dau/nam', 'dau/nu']) fs.mkdirSync(`${OUT}/${d}`, { recursive: true })
fs.mkdirSync(REF, { recursive: true })

/** đường dẫn ảnh gốc — có bản _v2 (vẽ lại) thì dùng */
const g = (rel) => { const v2 = `${SRC}/${rel}_v2.png`; return fs.existsSync(v2) ? v2 : `${SRC}/${rel}.png` }
let tong = 0
const r4 = (v) => +v.toFixed(4)
const ghi = (file, buf) => { fs.writeFileSync(file, buf); tong += buf.length }

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
  const m = Math.max(bw, bh) * le; bx -= m; by -= m; bw += 2 * m; bh += day ? m : 2 * m
  let cw = bw, ch = bh
  if (tl) { if (cw / ch < tl) cw = ch * tl; else ch = cw / tl }
  const s = dai / Math.max(cw, ch), ow = Math.round(cw * s), oh = Math.round(ch * s)
  const o = createCanvas(ow, oh), y = o.getContext('2d'); y.imageSmoothingQuality = 'high'
  y.drawImage(im, bx, by, bw, bh, (ow - bw * s) / 2, day ? oh - bh * s : (oh - bh * s) / 2, bw * s, bh * s)
  ghi(out, await o.encode(kieu, q)); return { w: ow, h: oh, x: y }
}
/** thu nhỏ GIỮ tỉ lệ để cạnh dài = dai (hình trong suốt, giữ nguyên khung — bộ đánh / hiệu ứng: neo tính theo khung gốc) */
async function thu(src, out, dai, q = 86) {
  const im = await loadImage(src), s = dai / Math.max(im.width, im.height), w = Math.round(im.width * s), h = Math.round(im.height * s)
  return nen(src, w, h, out, 'webp', q)
}

// ════ 1. MÀN CHÍNH (H1) ══════════════════════════════════════════════════════════════════════════════════════════════
// ── 1a. 3 nền × 2 khổ (ngang về 1505×1045 = tỉ lệ iPad như hình giao; dọc 941×1672) ─────────────────────────────────────
const NEN = ['pho_dem', 'nghia_dia', 'vuon_bi']
for (const b of NEN) {
  await nen(g(`hw_bg_${b}_ngang`), 1505, 1045, `${OUT}/bg_${b}_ngang.jpg`, 'jpeg', 82)
  await nen(g(`hw_bg_${b}_doc`), 941, 1672, `${OUT}/bg_${b}_doc.jpg`, 'jpeg', 82)
}
// ── 1b. icon ô · banner · trang trí ─────────────────────────────────────────────────────────────────────────────────────
const O_HOME = 'tren_lop et btvn tu_luyen nhiem_vu rank thong_tin so_tay thi_thu bai_tap_giao cup xep_hang may_man vi_xu hoc_tu_dau the_gioi thu_vien tro_choi'.split(' ')
for (const o of O_HOME) await nen(g(`hw_o_${o}`), 192, 192, `${OUT}/o_${o}.png`, 'png')
await nen(g('hw_b_lich'), 192, 192, `${OUT}/b_lich.png`, 'png')
await nen(g('hw_b_kiem_tra_lai'), 192, 192, `${OUT}/b_kiem_tra_lai.png`, 'png')
await nen(g('hw_tt_goc'), 192, 192, `${OUT}/corner.png`, 'png')           // ôm góc trên-trái (khác Đáng yêu) ⇒ dùng được làm trangTri.goc
await cat(g('hw_tt_gach'), `${OUT}/divider.png`, 768, { le: 0.01, kieu: 'png' })
// ảnh toàn cảnh chuẩn (không vào app)
for (const ten of ['hw_man_chinh_ipad', 'hw_man_chinh_dt', 'hw_nhiem_vu_ipad', 'hw_lam_bai_ipad', 'hoc-tap/hw_hoc_tap_ipad', 'hoc-tap/hw_chinh_phuc_ipad', 'phieu-luu/hw_ban_do_ipad', 'danh/hw_dau_toan_canh']) {
  const im = await loadImage(g(ten)), s = Math.min(1, 1400 / Math.max(im.width, im.height))
  const c = createCanvas(Math.round(im.width * s), Math.round(im.height * s)), x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, c.width, c.height)
  fs.writeFileSync(`${REF}/${ten.split('/').pop()}.jpg`, await c.encode('jpeg', 85))
}

// ════ 2. BÉ MA HOME (H1 #11–#12 + H2) — ĐỔI CẢ TƯ THẾ ═══════════════════════════════════════════════════════════════════
// 9 tư thế cùng khung 1122×1402, KHÔNG lá dưới chân; đế (bóng + lá thu + bí) vẽ RIÊNG đúng khung (hw_de_*). Hình đứng gốc (H1) khung KHÁC và CÓ lá ⇒
// tách THÂN (thành phần liên thông lớn nhất) khỏi các mảnh lá rời ở đáy, đưa thân về khung tư thế (khớp hộp thân với tư thế chớp mắt — cùng dáng đứng).
const TT_W = 512, TT_H = 640                     // khung tư thế sau nén (1122×1402 × 0,4563)
const TU_THE = ['chop_mat', 'vay_1', 'vay_2', 'vui', 'mung_khoc', 'lo', 'ngu', 'an_1', 'an_2']
/** nhãn thành phần liên thông của mặt nạ alpha > 40 (loang 4 hướng) ⇒ [{ n, x0, y0, x1, y1, id }] + mảng nhãn */
function thanhPhan(d, W, H) {
  const lab = new Int32Array(W * H), ds = [], st = new Int32Array(W * H)
  for (let p0 = 0; p0 < W * H; p0++) {
    if (d[p0 * 4 + 3] <= 40 || lab[p0]) continue
    const id = ds.length + 1; let top = 0, n = 0, x0 = W, y0 = H, x1 = 0, y1 = 0
    st[top++] = p0; lab[p0] = id
    while (top) {
      const p = st[--top], x = p % W, y = (p - x) / W; n++
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
      for (const q of [p + 1, p - 1, p + W, p - W]) {
        if (q < 0 || q >= W * H || lab[q] || d[q * 4 + 3] <= 40) continue
        if ((q === p + 1 && x === W - 1) || (q === p - 1 && x === 0)) continue
        lab[q] = id; st[top++] = q
      }
    }
    ds.push({ id, n, x0, y0, x1, y1 })
  }
  return { ds, lab }
}
const linhVat = {}
for (const gt of ['nam', 'nu']) {
  const goc = await ve(g(`hw_nv_${gt}`)), dG = goc.x.getImageData(0, 0, goc.W, goc.H), tpG = thanhPhan(dG.data, goc.W, goc.H)
  const than = tpG.ds.reduce((a, b) => (b.n > a.n ? b : a))
  // lá / bí = mảnh rời nằm hẳn ở vùng chân (đỉnh mảnh thấp hơn 72% chiều cao thân tính từ trên) ⇒ BỎ (đế vẽ riêng)
  const nguongY = than.y0 + (than.y1 - than.y0) * 0.72
  const laLa = new Set(tpG.ds.filter((t) => t.id !== than.id && t.y0 > nguongY).map((t) => t.id))
  // đáy THÂN thật = đáy tà váy: lá dính vào thân thì hộp thân kéo xuống tận lá ⇒ đo đáy theo cột GIỮA thân (lá rải 2 bên, tà ở giữa)
  const cm = await ve(g(`hoat-hoa/hw_${gt}_chop_mat`)), tpC = thanhPhan(cm.x.getImageData(0, 0, cm.W, cm.H).data, cm.W, cm.H)
  const thanC = tpC.ds.reduce((a, b) => (b.n > a.n ? b : a))
  const s = (thanC.x1 - thanC.x0) / (than.x1 - than.x0)                       // tỉ lệ gốc → khung tư thế (theo BỀ NGANG thân — đỉnh mũ / chân lá khác nhau)
  const dx = (thanC.x0 + thanC.x1) / 2 - s * (than.x0 + than.x1) / 2, dy = thanC.y0 - s * than.y0   // khớp tâm ngang + ĐỈNH (chóp mũ)
  const k = TT_W / cm.W
  const t = createCanvas(goc.W, goc.H), tx = t.getContext('2d'), id = tx.createImageData(goc.W, goc.H)
  for (let p = 0; p < goc.W * goc.H; p++) {
    const l = tpG.lab[p]
    if ((l && !laLa.has(l)) || (!l && dG.data[p * 4 + 3] > 0)) for (let c = 0; c < 4; c++) id.data[p * 4 + c] = dG.data[p * 4 + c]
  }
  tx.putImageData(id, 0, 0)
  const cDung = createCanvas(TT_W, TT_H), ox = cDung.getContext('2d'); ox.imageSmoothingQuality = 'high'
  ox.drawImage(t, dx * k, dy * k, goc.W * s * k, goc.H * s * k)
  // Lá trong hình H1 vẽ ĐÈ lên tà váy (dính liền thân, tách mảnh không được) ⇒ thay phần TÀ dưới vạch CAT bằng tà của tư thế chớp mắt (cùng khung,
  // bóng thân trùng khít — đã chồng thử 25/10), nối mềm 12px. Vạch CAT nằm dưới giỏ kẹo / đèn lồng, trên đám lá.
  const CAT = 0.805, MEM = 12, yCat = Math.round(CAT * TT_H)
  const cCm = createCanvas(TT_W, TT_H), cx = cCm.getContext('2d'); cx.imageSmoothingQuality = 'high'; cx.drawImage(cm.c, 0, 0, TT_W, TT_H)
  const dD = ox.getImageData(0, 0, TT_W, TT_H), dC = cx.getImageData(0, 0, TT_W, TT_H)
  for (let j = yCat - MEM; j < TT_H; j++) {
    const w = Math.min(1, Math.max(0, (j - (yCat - MEM)) / MEM))   // 0 → giữ hình đứng · 1 → lấy tà của tư thế chớp mắt
    for (let i = 0; i < TT_W; i++) { const p = (j * TT_W + i) * 4; for (let c = 0; c < 4; c++) dD.data[p + c] = Math.round(dD.data[p + c] * (1 - w) + dC.data[p + c] * w) }
  }
  ox.putImageData(dD, 0, 0)
  ghi(`${OUT}/song/${gt}/dung.webp`, await cDung.encode('webp', 90))
  const cDe = await nen(g(`hoat-hoa/hw_de_${gt}`), TT_W, TT_H, `${OUT}/song/${gt}/co.webp`, 'webp', 90)
  for (const tt of TU_THE) await nen(g(`hoat-hoa/hw_${gt}_${tt}`), TT_W, TT_H, `${OUT}/song/${gt}/${tt}.webp`, 'webp', 90)
  // hình TĨNH của Home (máy bật giảm chuyển động / lúc chưa nạp xong) = đế + thân, CÙNG khung tư thế ⇒ đổi sang bản động không xê dịch
  const tinh = createCanvas(TT_W, TT_H), sx = tinh.getContext('2d'); sx.drawImage(cDe.canvas, 0, 0); sx.drawImage(cDung, 0, 0)
  ghi(`${OUT}/nv_${gt}.webp`, await tinh.encode('webp', 90))
  linhVat[gt] = { soLa: laLa.size, tiLe: r4(s) }
  console.log('bé ma', gt, `· ${tpG.ds.length} mảnh, bỏ ${laLa.size} mảnh lá · tỉ lệ gốc→tư thế ${r4(s)} · dời`, Math.round(dx), Math.round(dy))
}
for (const fx of ['sao', 'rung', 'mo_hoi', 'bui', 'la', 'doi']) await cat(g(`hoat-hoa/hw_fx_${fx}`), `${OUT}/song/fx_${fx}.webp`, 128, { le: 0.02 })

// ════ 3. KHU HỌC TẬP (H3) ════════════════════════════════════════════════════════════════════════════════════════════
const O = ['hoc_chu_de', 'luyen_yeu', 'dau_truong', 'chinh_phuc', 'giai_vo_dich']
for (const o of O) await nen(g(`hoc-tap/hw_o_${o}`), 192, 192, `${OUT}/o_${o}.png`, 'png')
await nen(g('hoc-tap/hw_ht_nen_ngang'), 1672, 941, `${OUT}/hoctap/nen_ngang.jpg`)
await nen(g('hoc-tap/hw_ht_nen_doc'), 941, 1672, `${OUT}/hoctap/nen_doc.jpg`)
const hopDao = {}
for (const o of O) {
  const x = await nen(g(`hoc-tap/dao_${o}`), 768, 768, `${OUT}/hoctap/dao_${o}.webp`, 'webp', 86)
  hopDao[o] = hopAlpha(x, 768, 768, o); console.log('đảo', o, JSON.stringify(hopDao[o]))
}
await nen(g('hoc-tap/hw_cp_nen'), 1672, 941, `${OUT}/chinhphuc/nen.jpg`)
const hopThap = {}
for (const ten of ['thap_tong', ...Array.from({ length: 8 }, (_, k) => `thap_cd_${k + 1}`)]) {
  const { x } = await cat(g(`hoc-tap/${ten}`), `${OUT}/chinhphuc/${ten}.webp`, 768, { tl: 512 / 768, le: 0.012, day: true })
  hopThap[ten] = hopAlpha(x, 512, 768, ten); console.log(ten, JSON.stringify(hopThap[ten]))
}
/** đế đảo: tâm MẶT CỎ = giữa đỉnh đảo và hàng rộng nhất (mép trước của mặt cỏ nhìn chéo từ trên) */
async function de(src, out, w, h) {
  const x = await nen(src, w, h, out, 'webp', 86), d = x.getImageData(0, 0, w, h).data
  let y0 = -1, rong = 0, yRong = 0
  for (let j = 0; j < h; j++) { let n = 0; for (let i = 0; i < w; i++) if (d[(j * w + i) * 4 + 3] > 40) n++; if (n > w * 0.2 && y0 < 0) y0 = j; if (n > rong) { rong = n; yRong = j } }
  return [0.5, r4((y0 + yRong) / 2 / h)]
}
const matTong = await de(g('hoc-tap/de_tong'), `${OUT}/chinhphuc/de_tong.webp`, 768, 512)
const matCd = await de(g('hoc-tap/de_cd'), `${OUT}/chinhphuc/de_cd.webp`, 512, 512)
// cầu ván cong: 2 đầu = mặt ván ở 2 mép ảnh (giữa khoảng alpha của cột sát mép)
const xc = await nen(g('hoc-tap/cau'), 1024, 512, `${OUT}/chinhphuc/cau.webp`, 'webp', 86)
const dauCau = (cot) => { const d = xc.getImageData(cot, 0, 1, 512).data; let y0 = -1, y1 = 0; for (let j = 0; j < 512; j++) if (d[j * 4 + 3] > 40) { if (y0 < 0) y0 = j; y1 = j } return r4((y0 + y1) / 2 / 512) }
const cauA = [0.03, dauCau(40)], cauB = [0.97, dauCau(1024 - 40)]
console.log('mặt đế', matTong, matCd, 'đầu cầu', cauA, cauB)
await phu(g('hoc-tap/nen_san_dau'), 1600, 574, `${OUT}/dau_truong/nen_san_dau.jpg`, { neoY: 0.62 })

// ════ 4. BẢN ĐỒ PHIÊU LƯU 2D + QUÁI (H4) ═════════════════════════════════════════════════════════════════════════════
const P = `${OUT}/phieuluu2d`
const V = ['rung', 'bang', 'nui_lua', 'bien_dao', 'anh_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao', 'dong_gio']
await phu(g('phieu-luu/nen_the_gioi'), 1672, 941, `${P}/the_gioi.jpg`)
for (const b of V) await cat(g(`phieu-luu/dao_${b}`), `${P}/dao_${b}.webp`, 640, { tl: 1, q: 86 })
for (const b of V) await phu(g(`phieu-luu/nen_vung_${b}`), 1672, 941, `${P}/nen_vung_${b}.jpg`)
for (const b of V) await phu(g(`phieu-luu/nen_dang_${b}`), 1672, 941, `${P}/nen_dang_${b}.jpg`, { neoY: 0.74 }) // giữ mặt đường ở 74%
for (const m of ['thanh', 'thap', 'trai', 'den', 'cau', 'cong']) await cat(g(`phieu-luu/moc_${m}`), `${P}/moc_${m}.webp`, 384)
await cat(g('phieu-luu/be_da'), `${P}/be_da.webp`, 384)
await cat(g('phieu-luu/may_suong'), `${P}/may_suong.webp`, 768, { le: 0.01 })
await cat(g('phieu-luu/co_chinh_phuc'), `${P}/co_chinh_phuc.webp`, 384)
await cat(g('phieu-luu/la_ban'), `${P}/la_ban.webp`, 256)
const QUAI = ['slime_la', 'slime_lua', 'meo_bang', 'rua_da', 'cu_dem', 'ca_bong', 'nam_ma', 'chim_set', 'tho_gio', 'be_nham', 'sao_bien', 'ech_doc', 'dom_dom', 'soi_bang', 'bo_giap', 'ma_lua']
for (const q of QUAI) await cat(g(`phieu-luu/quai_${q}`), `${OUT}/quai/${q}.webp`, 512, { q: 86 })
for (const q of ['rong_con', 'golem_pha_le', 'phuong_hoang', 'bach_tuoc']) await cat(g(`phieu-luu/boss_${q}`), `${OUT}/quai/${q}.webp`, 512, { q: 86 })

// ════ 5. BỘ ĐÁNH (H5) ════════════════════════════════════════════════════════════════════════════════════════════════
// 15 tư thế × 2, khung VUÔNG 1254² ⇒ nén 512² GIỮ NGUYÊN khung (ChatGPT vẽ mọi tư thế cùng khung, cùng vạch đất) — neo tính trên ảnh gốc:
//   ax = tâm ngang thân ở tư thế dung_1 (chung mọi tư thế: tư thế lao tới / ngả ra sau giữ đúng độ dời đã vẽ) ·
//   ay = vạch đất = đáy hình dung_1 (chung — tư thế bay / văng nằm cao hơn đúng như vẽ) · thanDung = cao hình dung_1 / cạnh khung ·
//   tay = điểm phát đòn: niem_troi_2 = đỉnh vật giơ cao; còn lại = mép PHẢI nhất của hình (miệng giỏ / cửa đèn chĩa phải).
// ⚠ H5 dùng TẠM (kiểm hàng 25/10): mọi tư thế vẽ lá thu + bí tí hon dưới tà váy (đơn cấm) — lúc bay / văng đám lá đi theo người.
const TT_DAU = ['dung_1', 'dung_2', 'suy_nghi', 'tich_nang_1', 'tich_nang_2', 'niem_troi_1', 'niem_troi_2', 'nem_truoc_1', 'nem_truoc_2', 'phat_nho', 'bi_danh_1', 'bi_danh_2', 'guc', 'thang_1', 'thang_2']
const KHO_DAU = 512
const dau = {}
for (const gt of ['nam', 'nu']) {
  const goc = {}
  for (const p of TT_DAU) {
    const src = g(`danh/hw_dau_${gt}_${p}`), { x, W, H } = await ve(src), hop = hopAlpha(x, W, H, src), d = x.getImageData(0, 0, W, H).data
    let tay
    if (p === 'niem_troi_2') {   // đỉnh vật giơ cao: tâm ngang các điểm alpha trong 4% trên cùng của hình
      const y0 = Math.round(hop.y0 * H), y1 = y0 + Math.round(0.04 * H); let sx = 0, n = 0
      for (let j = y0; j < y1; j++) for (let i = 0; i < W; i++) if (d[(j * W + i) * 4 + 3] > 40) { sx += i; n++ }
      tay = [r4(sx / n / W), r4(hop.y0 + 0.03)]
    } else {                     // mép phải: tâm dọc các điểm alpha trong 4% bên phải nhất của hình
      const x1 = Math.round(hop.x1 * W), x0 = x1 - Math.round(0.04 * W); let sy = 0, n = 0
      for (let i = x0; i < x1; i++) for (let j = 0; j < H; j++) if (d[(j * W + i) * 4 + 3] > 40) { sy += j; n++ }
      tay = [r4(hop.x1 - 0.03), r4(sy / n / H)]
    }
    goc[p] = { hop, tay }
    await nen(src, KHO_DAU, KHO_DAU, `${OUT}/dau/${gt}/${p}.webp`, 'webp', 86)
  }
  const dg = goc.dung_1.hop, ax = r4((dg.x0 + dg.x1) / 2), ay = dg.y1
  dau[gt] = { thanDung: r4(dg.y1 - dg.y0), tu: Object.fromEntries(TT_DAU.map((p) => [p, { ax, ay, tay: [goc[p].tay] }])) }
  // lệch cỡ thân so với tư thế đứng (chỉ các tư thế ĐỨNG thẳng — để ghi kiểm hàng): bề NGANG thân
  const rong = (p) => goc[p].hop.x1 - goc[p].hop.x0
  console.log('bộ đánh', gt, '· thân đứng', dau[gt].thanDung, '· ax/ay', ax, ay, '· lệch ngang dung_2/thang_2',
    r4(rong('dung_2') / rong('dung_1') - 1), r4(rong('thang_2') / rong('dung_1') - 1))
}
for (const [f, dai] of [['cau_lua', 640], ['cau_bang', 640], ['dan_ma', 512], ['thien_thach', 400], ['bang_boc', 500]]) await thu(g(`danh/hw_fx_${f}`), `${OUT}/dau/fx_${f}.webp`, dai)

// ════ 6. TIỀN CẢNH BÍ NGÔ (hoạt cảnh 30/10 — skin/HoatCanhNen.tsx) ══════════════════════════════════════════════════════
// Bí ngô vẽ sẵn trong tranh nền thì ở màn rộng bị XÉN (tranh phủ theo bề ngang, đáy rơi ra ngoài) còn màn hẹp bị nhân vật che ⇒ cắt chính cụm bí ngô
// trong tranh (đúng nét, đúng màu) thành lớp tiền cảnh đặt ở góc dưới màn. Mép trên + 2 bên MỜ DẦN (elip làm mờ), đáy để liền vì chạm đáy màn.
// box = vùng cắt (% ảnh nền: x0, y0, x1, y1). Điểm sáng của tiền cảnh khai trong halloween.ts theo % ảnh cắt.
fs.mkdirSync(`${OUT}/tien_canh`, { recursive: true })
for (const [ten, nenGoc, box] of [['bi_trai', 'hw_bg_pho_dem_ngang', [0, 55, 23, 84]], ['bi_phai', 'hw_bg_vuon_bi_ngang', [76, 78, 100, 100]]]) {
  const im = await loadImage(g(nenGoc)), W = im.width, H = im.height
  const [x0, y0, x1, y1] = [box[0] * W / 100, box[1] * H / 100, box[2] * W / 100, box[3] * H / 100], w = Math.round(x1 - x0), h = Math.round(y1 - y0)
  const c = createCanvas(w, h), x = c.getContext('2d'); x.drawImage(im, x0, y0, w, h, 0, 0, w, h)
  const fe = 0.16, m = createCanvas(w, h), mx = m.getContext('2d')
  mx.filter = `blur(${Math.round(Math.min(w, h) * fe * 0.5)}px)`; mx.fillStyle = '#fff'
  mx.beginPath(); mx.ellipse(w / 2, h * (fe + 1.55) / 2, w * (1 - fe) / 2, h * (1.55 - fe) / 2, 0, 0, Math.PI * 2); mx.fill()
  x.globalCompositeOperation = 'destination-in'; x.drawImage(m, 0, 0)
  ghi(`${OUT}/tien_canh/${ten}.webp`, await c.encode('webp', 88))
  console.log('tiền cảnh', ten, w, h, 'tl', r4(w / h))
}

// ════ sinh cấu hình ══════════════════════════════════════════════════════════════════════════════════════════════════
const DAU = '// SINH TỰ ĐỘNG bởi scripts/halloween-hinh.mjs — đừng sửa tay.'
const HOP = 'Record<string, { x0: number; y0: number; x1: number; y1: number }>'
fs.writeFileSync('src/screens/hocsinh/skin/styles/halloweenHocTap.ts', `${DAU} Khu HỌC TẬP + màn CHINH PHỤC BK của style Halloween (Đơn H3, 25/10).
// hop = hộp PHẦN NHÌN THẤY (alpha > 40) theo tỉ lệ khung — cùng khuôn dangYeuHocTap.ts. mat = tâm mặt cỏ của đế (giữa đỉnh đảo và hàng rộng nhất);
// cầu: a/b = mặt ván ở 2 mép ảnh. Tháp đã cắt sát + đặt chạm đáy khung 512×768.
const G = '/bk-ui/hs/skin/halloween/hoctap', C = '/bk-ui/hs/skin/halloween/chinhphuc'
export const HOC_TAP_HALLOWEEN = {
  nen: \`url(\${G}/nen_ngang.jpg) center / cover no-repeat, #251836\`,
  nenDoc: \`url(\${G}/nen_doc.jpg) center / cover no-repeat, #251836\`,
  dao: { ${O.map((id) => `${id}: \`\${G}/dao_${id}.webp\``).join(', ')} },
  hop: ${JSON.stringify(hopDao)} as ${HOP},
}
export const CHINH_PHUC_HALLOWEEN = {
  nen: \`\${C}/nen.jpg\`,
  thapTong: \`\${C}/thap_tong.webp\`,
  thapCd: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => \`\${C}/thap_cd_\${i}.webp\`),
  hop: ${JSON.stringify(hopThap)} as ${HOP},
  deTong: { src: \`\${C}/de_tong.webp\`, tl: 1536 / 1024, mat: ${JSON.stringify(matTong)} as [number, number] },
  deCd: { src: \`\${C}/de_cd.webp\`, tl: 1, mat: ${JSON.stringify(matCd)} as [number, number] },
  cau: { src: \`\${C}/cau.webp\`, tl: 2, a: ${JSON.stringify(cauA)} as [number, number], b: ${JSON.stringify(cauB)} as [number, number] },
}
`)
const lv = (gt) => `{
    rong: ${TT_W}, cao: ${TT_H}, soi: true,
    co: \`\${S}/${gt}/co.webp\`, dung: \`\${S}/${gt}/dung.webp\`, chopMat: \`\${S}/${gt}/chop_mat.webp\`,
    vay: [\`\${S}/${gt}/vay_1.webp\`, \`\${S}/${gt}/vay_2.webp\`], vui: \`\${S}/${gt}/vui.webp\`, lo: \`\${S}/${gt}/lo.webp\`, ngu: \`\${S}/${gt}/ngu.webp\`,
    an: [\`\${S}/${gt}/an_1.webp\`, \`\${S}/${gt}/an_2.webp\`], mungKhoc: \`\${S}/${gt}/mung_khoc.webp\`,
  }`
fs.writeFileSync('src/screens/hocsinh/skin/styles/halloweenSong.ts', `${DAU} BÉ MA Home của style Halloween (Đơn H1 #11–#12 + H2, 25/10) — hợp đồng LinhVatSong ở skin/kieu.ts.
// Mọi hình cùng khung ${TT_W}×${TT_H}, cùng chỗ tà váy chạm đất: co = ĐẾ (bóng + lá thu + bí, vẽ riêng — đứng yên) · dung = thân đứng (tách khỏi lá của hình gốc,
// đã đưa về khung tư thế) · 9 tư thế vẽ riêng (an = nam ăn kẹo mút / nữ thổi nến). soi = đường viền "sôi" bằng bộ lọc SVG.
// Hình hiệu ứng rời (sao · vạch rung · mồ hôi · khói · lá thu · dơi) nén sẵn ở song/fx_*.webp — chưa màn nào dùng.
import type { LinhVatSong } from '../kieu'
const S = '/bk-ui/hs/skin/halloween/song'
export const LINH_VAT_HALLOWEEN: { nam: LinhVatSong; nu: LinhVatSong } = {
  nam: ${lv('nam')},
  nu: ${lv('nu')},
}
`)
fs.writeFileSync('src/screens/hocsinh/skin/styles/halloweenDau.ts', `${DAU} BỘ ĐÁNH bé ma của style Halloween (Đơn H5, 25/10) — hợp đồng BoDau ở skin/kieu.ts.
// Khung vuông ${KHO_DAU}×${KHO_DAU} (giữ nguyên khung vẽ). ax/ay = tâm ngang thân + vạch đất (tỉ lệ khung, chung mọi tư thế — đo ở dung_1) · thanDung = cao hình
// đứng / cạnh khung · tay = điểm phát đòn (tỉ lệ khung). ⚠ Dùng TẠM: mọi tư thế có lá thu dưới tà váy (đơn cấm) — xem kiểm hàng trong DON-HANG-STYLE-HALLOWEEN.md.
import type { BoDau } from '../kieu'
const D = '/bk-ui/hs/skin/halloween/dau'
export const DAU_HALLOWEEN: BoDau = {
  g: D, w: ${KHO_DAU}, h: ${KHO_DAU},
  nv: ${JSON.stringify(dau)},
  fx: { fx_cau_lua: \`\${D}/fx_cau_lua.webp\`, fx_cau_bang: \`\${D}/fx_cau_bang.webp\`, fx_dan_ma: \`\${D}/fx_dan_ma.webp\`, fx_thien_thach: \`\${D}/fx_thien_thach.webp\`, fx_bang_boc: \`\${D}/fx_bang_boc.webp\` },
}
`)
console.log('xong', (tong / 1024 / 1024).toFixed(1), 'MB')
