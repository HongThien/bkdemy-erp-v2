// Nén 4 NHÂN VẬT CHÍNH mới (Thùy 03/10 — kit design/bk-ui-src/AppHS/Animation/nhan_vat_moi_v1/, README: "đang sinh, chưa xác nhận hoàn tất")
// vào public/bk-ui/hs/skin/rpg/nhanvat/<id>/ rồi sinh src/screens/hocsinh/skin/nhanVatChinh.ts. Chạy lại khi kit có thêm khung — script tự nhận khung mới.
//  · CHIẾN ĐẤU: 15 tư thế chien_dau/chinh_<id>_<tư thế>.png → <tư thế>.webp 512×768 (GIỮ khổ canvas: neo/điểm tay theo % canvas) · neo + tay lấy manifest.json
//  · DI CHUYỂN: di_chuyen/<id>_NN_*.png — 00 = đứng, 01.. = khung chạy/bay (có bao nhiêu dùng bấy nhiêu) → dung.webp, f1.. .webp 360×540
//    neo ĐẤT mỗi khung = ĐÁY hộp alpha (>40) đo trên chính ảnh (manifest mới có neo vài khung đầu) · đỉnh tóc (tỉ lệ) để quy ra cỡ thân
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
import path from 'node:path'
const J = (...a) => path.join(...a).split(path.sep).join('/')

const SRC = 'design/bk-ui-src/AppHS/Animation/nhan_vat_moi_v1', OUT = 'public/bk-ui/hs/skin/rpg/nhanvat'
const man = JSON.parse(fs.readFileSync(J(SRC, 'manifest.json'), 'utf8'))
const NV = man.characters.map((c) => c.id) // su_tu · cao · ninja · elf
const TEN = { su_tu: 'Chiến binh Sư tử', cao: 'Pháp sư Cáo', ninja: 'Ninja', elf: 'Tinh linh Elf' }
const MO_TA = { su_tu: 'Dũng mãnh, kiếm và khiên', cao: 'Tinh thông phép thuật', ninja: 'Nhanh như gió, ra đòn bất ngờ', elf: 'Bay lượn giữa ánh sáng' }
let tong = 0

async function veVao(file, W, H) {
  const im = await loadImage(J(SRC, file)), c = createCanvas(W, H), x = c.getContext('2d')
  x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, W, H)
  return { c, x }
}
const ghi = async (c, out, q = 84) => { const b = await c.encode('webp', q); fs.writeFileSync(J(OUT, out), b); tong += b.length }

const meta = {}
for (const id of NV) {
  fs.mkdirSync(J(OUT, id), { recursive: true })
  // ── chiến đấu
  const dau = {}
  for (const p of man.poses) {
    const f = `${id}/chien_dau/chinh_${id}_${p}.png`
    if (!fs.existsSync(J(SRC, f))) { console.log('THIẾU', f); continue }
    const { c } = await veVao(f, 512, 768); await ghi(c, `${id}/${p}.webp`)
    const m = man.meta[id]?.[p]
    dau[p] = { ax: +(m?.anchor?.[0] ?? 0.55).toFixed(3), ay: +(m?.anchor?.[1] ?? 0.96).toFixed(4), tay: (m?.hands ?? [[0.75, 0.5]]).map(([a, b]) => [+a.toFixed(3), +b.toFixed(3)]) }
  }
  // ── di chuyển: dò mọi khung có trong thư mục
  const W = 360, H = 540
  const ds = fs.readdirSync(J(SRC, id, 'di_chuyen')).filter((f) => /\.png$/.test(f)).sort()
  let top = 1, ayDung = 0.97; const ay = []; let so = 0
  for (const f of ds) {
    const nn = Number(f.match(/_(\d\d)_/)?.[1] ?? -1)
    const { c, x } = await veVao(`${id}/di_chuyen/${f}`, W, H)
    const d = x.getImageData(0, 0, W, H).data; let y0 = H, y1 = 0
    for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) if (d[(y * W + xx) * 4 + 3] > 40) { if (y < y0) y0 = y; if (y > y1) y1 = y }
    top = Math.min(top, y0 / H)
    if (nn === 0) { ayDung = +((y1 + 1) / H).toFixed(3); await ghi(c, `${id}/dung.webp`) }
    else { so++; ay.push(+((y1 + 1) / H).toFixed(3)); await ghi(c, `${id}/f${so}.webp`) }
  }
  const ax = +(man.meta[id]?.['00_nghi']?.anchor?.[0] ?? (id === 'elf' ? 0.5 : 0.55)).toFixed(3)
  meta[id] = { ten: TEN[id] ?? id, moTa: MO_TA[id] ?? '', bay: id === 'elf', chay: { w: W, h: H, ax, ay, ayDung, top: +top.toFixed(3) }, thanDung: +((man.standingHeight?.[id] ?? 1400) / 1536).toFixed(4), dau }
  console.log(id, '| chạy', so, 'khung | chiến đấu', Object.keys(dau).length, 'tư thế')
}

fs.writeFileSync('src/screens/hocsinh/skin/nhanVatChinh.ts', `// SINH TỰ ĐỘNG bởi scripts/anime-nhan-vat-chinh.mjs — đừng sửa tay. 4 NHÂN VẬT CHÍNH mới (kit nhan_vat_moi_v1, Thùy 03/10); ảnh ở public/bk-ui/hs/skin/rpg/nhanvat/<id>/.
// chay: khung CHẠY/BAY (f1..fN, N = số khung kit đang có) + đứng — ax trục thân, ay[i] neo đất khung i+1, top đỉnh đầu (tỉ lệ canvas 360×540)
// dau: 15 tư thế chiến đấu (512×768) — ax/ay neo, tay điểm tay (tỉ lệ canvas) · thanDung = cao thân đứng / cao canvas (cỡ chung cả chuỗi)
export type NvMoi = ${NV.map((i) => `'${i}'`).join(' | ')}
export interface NvChinh { ten: string; moTa: string; bay: boolean; chay: { w: number; h: number; ax: number; ay: number[]; ayDung: number; top: number }; thanDung: number; dau: Record<string, { ax: number; ay: number; tay: number[][] }> }
export const NV_MOI: NvMoi[] = ${JSON.stringify(NV)}
export const NHAN_VAT_CHINH: Record<NvMoi, NvChinh> = ${JSON.stringify(meta, null, 2)}
`)
console.log('xong, tổng', (tong / 1024 / 1024).toFixed(1), 'MB')
