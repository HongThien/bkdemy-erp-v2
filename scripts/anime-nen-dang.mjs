// Nén NỀN MÀN DẠNG BÀI (Thùy 03/10 — kit design/bk-ui-src/AppHS/hs-hoc-va-choi-luc-dia-bang-v2/assets/backdrop/backdrop_hoc_va_choi_luc_dia_<biome>.png):
// nền nhìn ngang, CON ĐƯỜNG lát đá thẳng vẽ sẵn ở ≈72–76% chiều cao (đo 03/10: tâm 0,733–0,749 mọi nền) — dạng bài = công trình của lục địa đứng trên đường.
// → public/bk-ui/hs/skin/rpg/phieuluu2d/nen_dang_<biome>.jpg (1672×941) · danh sách biome có nền: hinh2d.ts CO_SAN.nenDang.
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
const SRC = 'design/bk-ui-src/AppHS/hs-hoc-va-choi-luc-dia-bang-v2/assets/backdrop', OUT = 'public/bk-ui/hs/skin/rpg/phieuluu2d'
const ds = []
for (const f of fs.readdirSync(SRC).filter((x) => x.endsWith('.png'))) {
  const biome = f.replace('backdrop_hoc_va_choi_luc_dia_', '').replace('.png', '')
  const im = await loadImage(`${SRC}/${f}`), c = createCanvas(1672, 941), x = c.getContext('2d')
  x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, 1672, 941)
  const b = await c.encode('jpeg', 82); fs.writeFileSync(`${OUT}/nen_dang_${biome}.jpg`, b); ds.push(biome)
  console.log(biome, (b.length / 1024).toFixed(0) + 'KB')
}
console.log('biome có nền:', JSON.stringify(ds))
