// Tách thư viện 3D + mô hình từ games-site/co-ti-phu.html cho BK Catan (TV 3D).
// Chạy: node scripts/build-bk-catan-3d.mjs
// Ra: games-site/lib/three-r128.min.js · games-site/lib/GLTFLoader-r128.js · games-site/bk-catan-assets.js
// Nguồn mô hình: KayKit Medieval Hexagon + KayKit Adventurers (CC0) đang nhúng sẵn trong Cờ Tỷ Phú,
// CỘNG các .glb trong scripts/bk-catan-models/ (đóng gói từ zip KayKit bằng scripts/pack-gltf-glb.mjs — 24/09,
// đợt sửa "3D tài nguyên bé đi, đặc trưng hơn": ruộng lúa, đất gạch, núi đá thấp, cây bé).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIR = join(process.cwd(), 'games-site')
const src = readFileSync(join(DIR, 'co-ti-phu.html'), 'utf8')

// --- thư viện: khối <script> chứa "Three.js Authors" và khối chứa "class GLTFLoader"
const blocks = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1])
const three = blocks.find(b => b.includes('Three.js Authors') && b.includes('THREE={}'))
const gltf = blocks.find(b => b.includes('class GLTFLoader extends THREE.Loader'))
if (!three || !gltf) throw new Error('Không tìm thấy three.js / GLTFLoader trong co-ti-phu.html')
writeFileSync(join(DIR, 'lib', 'three-r128.min.js'), three.trim() + '\n')
writeFileSync(join(DIR, 'lib', 'GLTFLoader-r128.js'), gltf.trim() + '\n')

// --- mô hình cần dùng
const COLORS = ['red', 'blue', 'green', 'yellow']
const WANT = [
  'hex_grass', 'hex_water',
  'tree_single_A', 'tree_single_B', 'rock_single_A', 'rock_single_C',
  'barrel', 'building_bridge_A',
  'coin_gold', 'cloud_big', 'cloud_small',
  ...COLORS.flatMap(c => [`building_home_A_${c}`, `building_home_B_${c}`, `building_tavern_${c}`, `building_church_${c}`, `building_castle_${c}`, `flag_${c}`]),
  'Rig_General', 'Barbarian', 'Rogue', 'Druid',
]
const models = {}
const EXTRA = join(process.cwd(), 'scripts', 'bk-catan-models')
for (const f of readdirSync(EXTRA)) if (f.endsWith('.glb')) models[f.slice(0, -4)] = readFileSync(join(EXTRA, f)).toString('base64')
for (const k of WANT) {
  const m = src.match(new RegExp(`"${k}":"([A-Za-z0-9+/=]+)"`))
  if (!m) throw new Error('Thiếu mô hình ' + k)
  models[k] = m[1]
}
const out = `/* BK Catan — mô hình 3D (KayKit, CC0), sinh bởi scripts/build-bk-catan-3d.mjs. KHÔNG sửa tay. */\nwindow.BKC_ASSETS=${JSON.stringify({ models })};\n`
writeFileSync(join(DIR, 'bk-catan-assets.js'), out)
const kb = s => Math.round(s.length / 1024)
console.log(`three ${kb(three)}KB · GLTFLoader ${kb(gltf)}KB · assets ${kb(out)}KB (${Object.keys(models).length} mô hình, ${Object.keys(models).length - WANT.length} từ bk-catan-models/)`)
