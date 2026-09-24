// Đóng gói glTF (json + .bin + texture png) của KayKit thành 1 file .glb (texture nhúng vào buffer) —
// đúng dạng mô hình đang nhúng trong co-ti-phu.html / bk-catan-assets.js.
// Chạy: node scripts/pack-gltf-glb.mjs <thư_mục_gltf_nguồn> <tên_model>... → ghi scripts/bk-catan-models/<tên>.glb
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, basename } from 'node:path'

const [src, ...names] = process.argv.slice(2)
if (!src || !names.length) { console.error('dùng: node scripts/pack-gltf-glb.mjs <dir> <model>...'); process.exit(1) }
const OUT = join(process.cwd(), 'scripts', 'bk-catan-models'); mkdirSync(OUT, { recursive: true })
const pad4 = (b, fill) => { const r = b.length % 4; return r ? Buffer.concat([b, Buffer.alloc(4 - r, fill)]) : b }

for (const name of names) {
  const g = JSON.parse(readFileSync(join(src, name + '.gltf'), 'utf8'))
  const parts = []; let off = 0
  const push = b => { const o = off; parts.push(pad4(b, 0)); off += pad4(b, 0).length; return o }
  // buffer gốc (.bin) — mọi bufferView cũ giữ nguyên offset vì bin nằm đầu
  const bin = readFileSync(join(src, basename(g.buffers[0].uri)))
  push(bin)
  // ảnh ngoài → bufferView mới
  for (const im of g.images || []) {
    if (!im.uri) continue
    const img = readFileSync(join(src, decodeURIComponent(im.uri)))
    const o = push(img)
    g.bufferViews.push({ buffer: 0, byteOffset: o, byteLength: img.length })
    im.bufferView = g.bufferViews.length - 1; im.mimeType = im.uri.toLowerCase().endsWith('.jpg') ? 'image/jpeg' : 'image/png'; delete im.uri
  }
  const binAll = Buffer.concat(parts)
  g.buffers = [{ byteLength: binAll.length }]
  const json = pad4(Buffer.from(JSON.stringify(g)), 0x20)
  const head = Buffer.alloc(12); head.write('glTF', 0); head.writeUInt32LE(2, 4); head.writeUInt32LE(12 + 8 + json.length + 8 + binAll.length, 8)
  const jh = Buffer.alloc(8); jh.writeUInt32LE(json.length, 0); jh.write('JSON', 4)
  const bh = Buffer.alloc(8); bh.writeUInt32LE(binAll.length, 0); bh.write('BIN\0', 4)
  const glb = Buffer.concat([head, jh, json, bh, binAll])
  writeFileSync(join(OUT, name + '.glb'), glb)
  console.log(name, Math.round(glb.length / 1024) + 'KB')
}
