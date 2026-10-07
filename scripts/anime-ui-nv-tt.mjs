// Nén bộ giao diện Nhiệm vụ (hs-nhiem-vu-v1) + Thành tựu (hs-thanh-tuu-v1) — kit ChatGPT 07/10 — cho style RPG.
//  · KHUNG 9-slice: CẮT theo sourceRect trong *.slice.json (bỏ vùng trong suốt quanh khung) rồi thu nhỏ; độ dày góc (left/right/top/bottom) nhân cùng hệ số.
//  · ICON 1254×1254 → 256×256 (hiển thị ≤ 116px ⇒ đủ cho màn retina).
//  · Ghi public/bk-ui/hs/skin/rpg/nv|tt/*.webp và SINH src/screens/hocsinh/skin/styles/rpgGiaoDien.ts (ANH_NV, ANH_TT) — KHÔNG sửa tay file đó.
// Chạy: node scripts/anime-ui-nv-tt.mjs
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const KIT = 'design/bk-ui-src/AppHS'
const OUT = 'public/bk-ui/hs/skin/rpg'
const URL = '/bk-ui/hs/skin/rpg'
let tong = 0

async function luu(canvas, file) {
  const buf = canvas.toBuffer('image/webp', 92)
  fs.mkdirSync(file.slice(0, file.lastIndexOf('/')), { recursive: true })
  fs.writeFileSync(file, buf); tong += buf.length
}

// khung: trả KhungCat { src, w, h, l, r, t, b } (đơn vị px trên ảnh đã cắt + nén)
async function khung(kit, ten, thuMuc, rongDich) {
  const meta = JSON.parse(fs.readFileSync(`${KIT}/${kit}/assets/frames/${ten}.slice.json`, 'utf8'))
  const im = await loadImage(`${KIT}/${kit}/assets/frames/${ten}.png`)
  const { x, y, width, height } = meta.sourceRect
  const f = Math.min(1, rongDich / width)
  const w = Math.round(width * f), h = Math.round(height * f)
  const c = createCanvas(w, h), g = c.getContext('2d'); g.imageSmoothingQuality = 'high'
  g.drawImage(im, x, y, width, height, 0, 0, w, h)
  await luu(c, `${OUT}/${thuMuc}/${ten}.webp`)
  return { src: `${URL}/${thuMuc}/${ten}.webp`, w, h, l: Math.round(meta.left * f), r: Math.round(meta.right * f), t: Math.round(meta.top * f), b: Math.round(meta.bottom * f) }
}
const daCo = new Map()
async function icon(kit, ten, thuMuc, canh = 256) {
  const khoa = `${thuMuc}/${ten}`
  const im = await loadImage(`${KIT}/${kit}/assets/illustrations/${ten}.png`)
  const c = createCanvas(canh, canh), g = c.getContext('2d'); g.imageSmoothingQuality = 'high'
  g.drawImage(im, 0, 0, canh, canh)
  await luu(c, `${OUT}/${khoa}.webp`)
  daCo.set(khoa, true)
  return `${URL}/${khoa}.webp`
}

const NV = {
  khoi: await khung('hs-nhiem-vu-v1', 'khung_khoi', 'nv', 480),
  tieuDe: await khung('hs-nhiem-vu-v1', 'khung_tieu_de', 'nv', 720),
  vi: await khung('hs-nhiem-vu-v1', 'khung_vi', 'nv', 720),
  nhiemVu: await khung('hs-nhiem-vu-v1', 'khung_nhiem_vu', 'nv', 720),
  nut: await khung('hs-nhiem-vu-v1', 'khung_nut', 'nv', 560),
  icon: {
    so: await icon('hs-nhiem-vu-v1', 'so_nhiem_vu', 'nv'), ngay: await icon('hs-nhiem-vu-v1', 'nhiem_vu_ngay', 'nv'),
    tuan: await icon('hs-nhiem-vu-v1', 'nhiem_vu_tuan', 'nv'), thang: await icon('hs-nhiem-vu-v1', 'nhiem_vu_thang', 'nv'),
    luyenYeu: await icon('hs-nhiem-vu-v1', 'luyen_dang_yeu', 'nv'), chamDeu: await icon('hs-nhiem-vu-v1', 'cham_deu', 'nv'),
    luyenNhieu: await icon('hs-nhiem-vu-v1', 'luyen_nhieu', 'nv'), benBi: await icon('hs-nhiem-vu-v1', 'ben_bi', 'nv'),
    quay: await icon('hs-nhiem-vu-v1', 'quay_may_man', 'nv'), ngocDht: await icon('hs-nhiem-vu-v1', 'ngoc_dht', 'nv'),
    tinhTheExp: await icon('hs-nhiem-vu-v1', 'tinh_the_exp', 'nv'),
  },
}
const TT_ICON_MA = { TT04: 'tt04_vao_app', TT05: 'tt05_chuoi_lam_bai', TT06: 'tt06_nhiem_vu_ngay', TT07: 'tt07_luyen_yeu', TT08: 'tt08_tong_cau', TT09: 'tt09_top5', TT10: 'tt10_top1', TT12: 'tt12_mock_test' }
const theoMa = {}
for (const [ma, ten] of Object.entries(TT_ICON_MA)) theoMa[ma] = await icon('hs-thanh-tuu-v1', ten, 'tt')
const TT = {
  thanhTuu: await khung('hs-thanh-tuu-v1', 'khung_thanh_tuu', 'tt', 720),
  tongKet: await khung('hs-thanh-tuu-v1', 'khung_tong_ket', 'tt', 720),
  nutNhan: await khung('hs-thanh-tuu-v1', 'khung_nut_nhan', 'tt', 480),
  nhanQua: await khung('hs-thanh-tuu-v1', 'khung_nhan_qua', 'tt', 480),
  icon: {
    huyHieu: await icon('hs-thanh-tuu-v1', 'huy_hieu_thanh_tuu', 'tt'), album: await icon('hs-thanh-tuu-v1', 'album_huy_hieu', 'tt'),
    tinhTheExp: NV.icon.tinhTheExp, giaiTienBo: await icon('hs-thanh-tuu-v1', 'giai_tien_bo', 'tt'), theoMa,
  },
}

const tsNv = JSON.stringify(NV, null, 2), tsTt = JSON.stringify(TT, null, 2)
fs.writeFileSync('src/screens/hocsinh/skin/styles/rpgGiaoDien.ts', `// SINH TỰ ĐỘNG bởi scripts/anime-ui-nv-tt.mjs (kit hs-nhiem-vu-v1 · hs-thanh-tuu-v1, 07/10) — KHÔNG sửa tay.
// Khung đã CẮT theo sourceRect + nén webp; l/r/t/b = độ dày góc 9-slice (px trên ảnh đã nén). Icon 256×256.
import type { AnhNv, AnhTt } from '../anhGiaoDien'
export const ANH_NV: AnhNv | undefined = ${tsNv}
export const ANH_TT: AnhTt | undefined = ${tsTt}
`)
console.log('xong', Math.round(tong / 1024) + 'KB')
