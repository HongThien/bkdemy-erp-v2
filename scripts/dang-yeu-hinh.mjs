// Nén hình style ĐÁNG YÊU (cảm hứng Chiikawa; tên làm việc lúc đặt hình: "Nhỏ xinh" — design/DON-HANG-STYLE-NHO-XINH.md, đơn N1–N4 + đơn bổ sung)
// vào public/bk-ui/hs/skin/dang_yeu/ rồi SINH src/screens/hocsinh/skin/styles/dangYeuHocTap.ts (cổng 5 gò + Chinh phục BK) và dangYeuSong.ts
// (linh vật Home đổi tư thế) — đừng sửa tay 2 file đó.
// Ảnh gốc NGOÀI git (183 MB, bản chính trên Drive): mặc định design/bk-ui-src/nho-xinh/ — máy khác chỗ thì đặt DANG_YEU_SRC=<thư mục nho-xinh>.
//   nho-xinh/ (N1) · hoat-hoa/ (N2) · hoc-tap/ (N3) · phieu-luu/ (N4). Hình vẽ lại nằm cạnh bản cũ với tên <tên>_v2.png ⇒ script LUÔN ưu tiên _v2.
// Chạy: node scripts/dang-yeu-hinh.mjs        (DANG_YEU_SRC="C:/…/design/bk-ui-src/nho-xinh" node scripts/dang-yeu-hinh.mjs)
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const SRC = process.env.DANG_YEU_SRC ?? 'design/bk-ui-src/nho-xinh'
const OUT = 'public/bk-ui/hs/skin/dang_yeu'
const REF = 'design/handoff/hs-skin-nho-xinh-v1/reference'
if (!fs.existsSync(`${SRC}/nx_nv_nam.png`)) { console.error(`Không thấy ảnh gốc ở ${SRC} — đặt DANG_YEU_SRC trỏ tới thư mục nho-xinh/ (tải từ Drive).`); process.exit(1) }
for (const d of ['', 'hoctap', 'chinhphuc', 'phieuluu2d', 'quai', 'dau_truong', 'song', 'song/nam', 'song/nu']) fs.mkdirSync(`${OUT}/${d}`, { recursive: true })
fs.mkdirSync(REF, { recursive: true })

/** đường dẫn ảnh gốc — có bản _v2 (vẽ lại) thì dùng */
const g = (rel) => { const v2 = `${SRC}/${rel}_v2.png`; return fs.existsSync(v2) ? v2 : `${SRC}/${rel}.png` }
const n3 = (so, ten) => g(`hoc-tap/n3_${String(so).padStart(2, '0')}_${ten}`)
const n4 = (so, ten) => g(`phieu-luu/n4_${String(so).padStart(2, '0')}_${ten}`)
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

// ════ 1. MÀN CHÍNH (N1) ══════════════════════════════════════════════════════════════════════════════════════════════
// ── 1a. 3 nền × 2 khổ (ngang về 1505×1045 = tỉ lệ iPad; dọc 941×1672) ─────────────────────────────────────────────────
for (const b of ['dong_co', 'pho_nho', 'hoang_hon']) {
  await nen(g(`nx_bg_${b}_ngang`), 1505, 1045, `${OUT}/bg_${b}_ngang.jpg`, 'jpeg', 82)
  await nen(g(`nx_bg_${b}_doc`), 941, 1672, `${OUT}/bg_${b}_doc.jpg`, 'jpeg', 82)
}
// ── 1b. icon ô · banner · trang trí · khung viền tay ───────────────────────────────────────────────────────────────────
const O_HOME = 'tren_lop et btvn tu_luyen nhiem_vu rank thong_tin so_tay thi_thu bai_tap_giao cup xep_hang may_man vi_xu hoc_tu_dau the_gioi thu_vien tro_choi'.split(' ')
for (const o of O_HOME) await nen(g(`nx_o_${o}`), 192, 192, `${OUT}/o_${o}.png`, 'png')
await nen(g('nx_b_lich'), 192, 192, `${OUT}/b_lich.png`, 'png')
await nen(g('nx_b_kiem_tra_lai'), 192, 192, `${OUT}/b_kiem_tra_lai.png`, 'png')
await cat(g('nx_tt_goc'), `${OUT}/bui_cay.png`, 256, { le: 0.02, kieu: 'png' })   // bụi cây đứng (không ôm góc) — chưa màn nào dùng
await cat(g('nx_tt_gach'), `${OUT}/divider.png`, 768, { le: 0.01, kieu: 'png' })
await cat(g('nx_khung_the'), `${OUT}/khung_the.png`, 640, { le: 0, kieu: 'png' }) // khung viền tay (chưa dùng — thẻ đang viền CSS)
await cat(g('nx_khung_nut'), `${OUT}/khung_nut.png`, 640, { le: 0, kieu: 'png' })
// ảnh toàn cảnh chuẩn (không vào app)
for (const [src, ten] of [[g('nx_man_chinh_ipad'), 'nx_man_chinh_ipad'], [g('nx_man_chinh_dt'), 'nx_man_chinh_dt'], [g('nx_nhiem_vu_ipad'), 'nx_nhiem_vu_ipad'], [g('nx_lam_bai_ipad'), 'nx_lam_bai_ipad'],
  [n3(1, 'nx_hoc_tap_ipad'), 'nx_hoc_tap_ipad'], [n3(14, 'nx_chinh_phuc_ipad'), 'nx_chinh_phuc_ipad'], [n4(1, 'ban_do_toan_canh'), 'nx_ban_do_toan_canh']]) {
  const im = await loadImage(src), s = Math.min(1, 1400 / Math.max(im.width, im.height))
  const c = createCanvas(Math.round(im.width * s), Math.round(im.height * s)), x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, c.width, c.height)
  fs.writeFileSync(`${REF}/${ten}.jpg`, await c.encode('jpeg', 85))
}

// ════ 2. LINH VẬT HOME (N1 #11–#12 + N2) — ĐỔI CẢ TƯ THẾ (linh vật đơn giản nên không cần ghép vùng như Lo-fi) ═══════════════
// 9 tư thế cùng khung 1122×1402, KHÔNG có cỏ dưới chân; hình đứng gốc (N1) khung khác và CÓ cỏ + hoa. Để cỏ không "nháy" khi đổi tư thế:
// tách hình gốc thành THÂN (thành phần liên thông lớn nhất + vạch rung phía trên) và CỎ/HOA (các mảnh rời ở đáy), đưa cả hai về khung tư thế
// (khớp hộp thân với tư thế chớp mắt — cùng dáng đứng) ⇒ lúc chạy: lớp cỏ đứng yên, lớp thân đổi hình.
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
  const goc = await ve(g(`nx_nv_${gt}`)), dG = goc.x.getImageData(0, 0, goc.W, goc.H), tpG = thanhPhan(dG.data, goc.W, goc.H)
  const than = tpG.ds.reduce((a, b) => (b.n > a.n ? b : a))
  // cỏ / hoa = mảnh rời nằm hẳn ở vùng chân (đỉnh mảnh thấp hơn 72% chiều cao thân tính từ trên)
  const nguongY = than.y0 + (than.y1 - than.y0) * 0.72
  const laCo = new Set(tpG.ds.filter((t) => t.id !== than.id && t.y0 > nguongY).map((t) => t.id))
  // hộp thân của tư thế chớp mắt (cùng dáng đứng) ⇒ tỉ lệ + độ dời đưa hình gốc về khung tư thế
  const cm = await ve(g(`hoat-hoa/nx_${gt}_chop_mat`)), tpC = thanhPhan(cm.x.getImageData(0, 0, cm.W, cm.H).data, cm.W, cm.H)
  const thanC = tpC.ds.reduce((a, b) => (b.n > a.n ? b : a))
  const s = ((thanC.x1 - thanC.x0) / (than.x1 - than.x0) + (thanC.y1 - thanC.y0) / (than.y1 - than.y0)) / 2   // tỉ lệ gốc → khung tư thế
  const dx = (thanC.x0 + thanC.x1) / 2 - s * (than.x0 + than.x1) / 2, dy = thanC.y1 - s * than.y1          // khớp tâm ngang + ĐÁY thân (chân)
  const k = TT_W / cm.W
  const lop = (giu) => {   // vẽ 1 lớp của hình gốc (chỉ giữ thành phần `giu(id)`) vào khung tư thế đã nén
    const t = createCanvas(goc.W, goc.H), tx = t.getContext('2d'), id = tx.createImageData(goc.W, goc.H)
    for (let p = 0; p < goc.W * goc.H; p++) if (tpG.lab[p] && giu(tpG.lab[p])) { id.data[p * 4] = dG.data[p * 4]; id.data[p * 4 + 1] = dG.data[p * 4 + 1]; id.data[p * 4 + 2] = dG.data[p * 4 + 2]; id.data[p * 4 + 3] = dG.data[p * 4 + 3] }
    else if (!tpG.lab[p] && dG.data[p * 4 + 3] > 0 && giu(-1)) { for (let c = 0; c < 4; c++) id.data[p * 4 + c] = dG.data[p * 4 + c] }  // viền mờ (alpha ≤ 40) đi theo lớp thân
    tx.putImageData(id, 0, 0)
    const o = createCanvas(TT_W, TT_H), ox = o.getContext('2d'); ox.imageSmoothingQuality = 'high'
    ox.drawImage(t, dx * k, dy * k, goc.W * s * k, goc.H * s * k); return o
  }
  const cDung = lop((id) => id === -1 || !laCo.has(id)), cCo = lop((id) => id !== -1 && laCo.has(id))
  ghi(`${OUT}/song/${gt}/dung.webp`, await cDung.encode('webp', 90))
  ghi(`${OUT}/song/${gt}/co.webp`, await cCo.encode('webp', 90))
  for (const t of TU_THE) await nen(g(`hoat-hoa/nx_${gt}_${t}`), TT_W, TT_H, `${OUT}/song/${gt}/${t}.webp`, 'webp', 90)
  // hình TĨNH của Home (máy bật giảm chuyển động / lúc chưa nạp xong) = cỏ + thân, CÙNG khung tư thế ⇒ đổi sang bản động không xê dịch
  const tinh = createCanvas(TT_W, TT_H), sx = tinh.getContext('2d'); sx.drawImage(cCo, 0, 0); sx.drawImage(cDung, 0, 0)
  ghi(`${OUT}/nv_${gt}.webp`, await tinh.encode('webp', 90))
  linhVat[gt] = { soCo: laCo.size, tiLe: r4(s) }
  console.log('linh vật', gt, `· ${tpG.ds.length} mảnh, ${laCo.size} mảnh cỏ/hoa · tỉ lệ gốc→tư thế ${r4(s)} · dời`, Math.round(dx), Math.round(dy))
}
for (const fx of ['hoa', 'sao', 'rung', 'mo_hoi', 'bui', 'co']) await cat(g(`hoat-hoa/nx_fx_${fx}`), `${OUT}/song/fx_${fx}.webp`, 128, { le: 0.02 })

// ════ 3. KHU HỌC TẬP (N3) ════════════════════════════════════════════════════════════════════════════════════════════
const O = ['hoc_chu_de', 'luyen_yeu', 'dau_truong', 'chinh_phuc', 'giai_vo_dich']
for (const [i, o] of O.entries()) await nen(n3(2 + i, `nx_o_${o}`), 192, 192, `${OUT}/o_${o}.png`, 'png')
await nen(n3(7, 'nx_ht_nen_ngang'), 1672, 941, `${OUT}/hoctap/nen_ngang.jpg`)
await nen(n3(8, 'nx_ht_nen_doc'), 941, 1672, `${OUT}/hoctap/nen_doc.jpg`)
const hopDao = {}
for (const [i, o] of O.entries()) {
  const x = await nen(n3(9 + i, `dao_${o}`), 768, 768, `${OUT}/hoctap/dao_${o}.webp`, 'webp', 86)
  hopDao[o] = hopAlpha(x, 768, 768, o); console.log('gò', o, JSON.stringify(hopDao[o]))
}
await nen(n3(15, 'nx_cp_nen'), 1672, 941, `${OUT}/chinhphuc/nen.jpg`)
const hopThap = {}
for (const [i, ten] of ['thap_tong', ...Array.from({ length: 8 }, (_, k) => `thap_cd_${k + 1}`)].entries()) {
  const { x } = await cat(n3(16 + i, ten), `${OUT}/chinhphuc/${ten}.webp`, 768, { tl: 512 / 768, le: 0.012, day: true })
  hopThap[ten] = hopAlpha(x, 512, 768, ten); console.log(ten, JSON.stringify(hopThap[ten]))
}
/** đế gò: tâm MẶT CỎ = giữa đỉnh gò và hàng rộng nhất (mép trước của mặt cỏ nhìn chéo từ trên) */
async function de(src, out, w, h) {
  const x = await nen(src, w, h, out, 'webp', 86), d = x.getImageData(0, 0, w, h).data
  let y0 = -1, rong = 0, yRong = 0
  for (let j = 0; j < h; j++) { let n = 0; for (let i = 0; i < w; i++) if (d[(j * w + i) * 4 + 3] > 40) n++; if (n > w * 0.2 && y0 < 0) y0 = j; if (n > rong) { rong = n; yRong = j } }
  return [0.5, r4((y0 + yRong) / 2 / h)]
}
const matTong = await de(n3(25, 'de_tong'), `${OUT}/chinhphuc/de_tong.webp`, 768, 512)
const matCd = await de(n3(26, 'de_cd'), `${OUT}/chinhphuc/de_cd.webp`, 512, 512)
// cầu ván cong: 2 đầu = mặt ván ở 2 mép ảnh (giữa khoảng alpha của cột sát mép)
const xc = await nen(n3(27, 'cau'), 1024, 512, `${OUT}/chinhphuc/cau.webp`, 'webp', 86)
const dauCau = (cot) => { const d = xc.getImageData(cot, 0, 1, 512).data; let y0 = -1, y1 = 0; for (let j = 0; j < 512; j++) if (d[j * 4 + 3] > 40) { if (y0 < 0) y0 = j; y1 = j } return r4((y0 + y1) / 2 / 512) }
const cauA = [0.03, dauCau(40)], cauB = [0.97, dauCau(1024 - 40)]
console.log('mặt đế', matTong, matCd, 'đầu cầu', cauA, cauB)
await nen(n3(28, 'nen_san_dau'), 1600, 574, `${OUT}/dau_truong/nen_san_dau.jpg`)

// ════ 4. BẢN ĐỒ PHIÊU LƯU 2D + QUÁI (N4) ═════════════════════════════════════════════════════════════════════════════
const P = `${OUT}/phieuluu2d`
const V = ['rung', 'bang', 'nui_lua', 'bien_dao', 'anh_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao', 'dong_gio']
await phu(n4(2, 'nen_the_gioi'), 1672, 941, `${P}/the_gioi.jpg`)
for (const [i, b] of V.entries()) await cat(n4(3 + i, `dao_${b}`), `${P}/dao_${b}.webp`, 640, { tl: 1, q: 86 })
for (const [i, b] of V.entries()) await phu(n4(13 + i, `nen_vung_${b}`), 1672, 941, `${P}/nen_vung_${b}.jpg`)
for (const [i, b] of V.entries()) await phu(n4(33 + i, `nen_dang_${b}`), 1672, 941, `${P}/nen_dang_${b}.jpg`, { neoY: 0.74 }) // giữ mặt đường ở 74%
for (const [i, m] of ['thanh', 'thap', 'trai', 'den', 'cau', 'cong'].entries()) await cat(n4(43 + i, `moc_${m}`), `${P}/moc_${m}.webp`, 384)
await cat(n4(49, 'be_da'), `${P}/be_da.webp`, 384)
await cat(n4(50, 'may_suong'), `${P}/may_suong.webp`, 768, { le: 0.01 })
await cat(n4(51, 'co_chinh_phuc'), `${P}/co_chinh_phuc.webp`, 384)
await cat(n4(52, 'la_ban'), `${P}/la_ban.webp`, 256)
const QUAI = ['slime_la', 'slime_lua', 'meo_bang', 'rua_da', 'cu_dem', 'ca_bong', 'nam_ma', 'chim_set']
const QUAI2 = ['tho_gio', 'be_nham', 'sao_bien', 'ech_doc', 'dom_dom', 'soi_bang', 'bo_giap', 'ma_lua']
for (const [i, q] of QUAI.entries()) await cat(n4(23 + i, `quai_${q}`), `${OUT}/quai/${q}.webp`, 512, { q: 86 })
for (const [i, q] of QUAI2.entries()) await cat(n4(53 + i, `quai_${q}`), `${OUT}/quai/${q}.webp`, 512, { q: 86 })
for (const [so, q] of [[31, 'rong_con'], [32, 'golem_pha_le'], [61, 'phuong_hoang'], [62, 'bach_tuoc']]) await cat(n4(so, `boss_${q}`), `${OUT}/quai/${q}.webp`, 512, { q: 86 })

// ════ sinh cấu hình ══════════════════════════════════════════════════════════════════════════════════════════════════
const DAU = '// SINH TỰ ĐỘNG bởi scripts/dang-yeu-hinh.mjs — đừng sửa tay.'
const HOP = 'Record<string, { x0: number; y0: number; x1: number; y1: number }>'
fs.writeFileSync('src/screens/hocsinh/skin/styles/dangYeuHocTap.ts', `${DAU} Khu HỌC TẬP + màn CHINH PHỤC BK của style Đáng yêu (Đơn N3, 13/10).
// hop = hộp PHẦN NHÌN THẤY (alpha > 40) theo tỉ lệ khung — cùng khuôn khoiHocTap.ts. mat = tâm mặt cỏ của đế (giữa đỉnh gò và hàng rộng nhất);
// cầu: a/b = mặt ván ở 2 mép ảnh. Tháp đã cắt sát + đặt chạm đáy khung 512×768.
const G = '/bk-ui/hs/skin/dang_yeu/hoctap', C = '/bk-ui/hs/skin/dang_yeu/chinhphuc'
export const HOC_TAP_DANG_YEU = {
  nen: \`url(\${G}/nen_ngang.jpg) center / cover no-repeat, #bfe3f2\`,
  nenDoc: \`url(\${G}/nen_doc.jpg) center / cover no-repeat, #bfe3f2\`,
  dao: { ${O.map((id) => `${id}: \`\${G}/dao_${id}.webp\``).join(', ')} },
  hop: ${JSON.stringify(hopDao)} as ${HOP},
}
export const CHINH_PHUC_DANG_YEU = {
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
fs.writeFileSync('src/screens/hocsinh/skin/styles/dangYeuSong.ts', `${DAU} LINH VẬT Home của style Đáng yêu (Đơn N1 #11–#12 + N2, 13/10) — hợp đồng LinhVatSong ở skin/kieu.ts.
// Mọi hình cùng khung ${TT_W}×${TT_H}, cùng chỗ đặt chân: co = cỏ + hoa dưới chân (đứng yên) · dung = thân đứng (tách từ hình gốc, đã đưa về khung tư thế) ·
// 9 tư thế vẽ riêng. soi = đường viền "sôi" (line boil) bằng bộ lọc SVG. Hình hiệu ứng rời (hoa · sao · vạch rung · mồ hôi · bụi · cỏ) nén sẵn ở song/fx_*.webp — chưa màn nào dùng.
import type { LinhVatSong } from '../kieu'
const S = '/bk-ui/hs/skin/dang_yeu/song'
export const LINH_VAT_DANG_YEU: { nam: LinhVatSong; nu: LinhVatSong } = {
  nam: ${lv('nam')},
  nu: ${lv('nu')},
}
`)
console.log('xong', (tong / 1024 / 1024).toFixed(1), 'MB')
