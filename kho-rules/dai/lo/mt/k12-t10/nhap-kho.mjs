// nhap-kho.mjs — nhập 44 câu của 2 đề MT khối 12 tháng 10 (12A1 · 12B1) vào kho (dạng chờ K12) + tải hình lên kho-anh.
//   node kho-rules/dai/lo/mt/k12-t10/nhap-kho.mjs [--ghi]     (mặc định: chạy thử — KHÔNG upload ảnh, DB ROLLBACK)
// Ghi `ket-qua-kho.json` = { id → { ma_cau, kho, moi } } (câu trùng kho ⇒ trả mã câu cũ, moi=false).
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { insertCauBatch } from '../../../../../scripts/_kho_insert.mjs'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
import { CAU, TEN_DE } from './cau-mt.mjs'

const GHI = process.argv.includes('--ghi')
const D = 'kho-rules/dai/lo/mt/k12-t10/'
const IMG = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/ba124078-f427-4ed3-9f84-e750417a463f/scratchpad/mt30/'

// 1) ảnh
const envFile = {}
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { if (!l.includes('=') || l.trim().startsWith('#')) continue; const i = l.indexOf('='); envFile[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '') }
const urlAnh = {}
const hinh = [...new Set(CAU.filter((c) => c.hinh).map((c) => c.hinh))]
for (const h of hinh) if (!fs.existsSync(IMG + h)) throw new Error('thiếu file ảnh ' + IMG + h)
console.log('hình cần tải:', hinh.length, hinh.join(', '))
if (GHI) {
  const sb = createClient(envFile.VITE_SUPABASE_URL, envFile.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
  const thang = new Date().toISOString().slice(0, 7)
  for (const h of hinh) {
    const p = `nhap_kho/${thang}/${randomUUID()}_mt30_${path.basename(path.dirname(h))}_${path.basename(h)}`
    const { error } = await sb.storage.from('kho-anh').upload(p, fs.readFileSync(IMG + h), { contentType: 'image/png', upsert: false })
    if (error) throw new Error('upload ' + h + ': ' + error.message)
    urlAnh[h] = sb.storage.from('kho-anh').getPublicUrl(p).data.publicUrl
  }
}

// 2) câu
const dung = (c) => {
  const o = { dang_chinh: 'CHUA', khoi: '12', loai_cau: c.loai_cau, noi_dung: c.noi_dung.trim(), nguon: 'le', nguon_giai: c.nguon_giai, ten_de_goc: TEN_DE[c.de] }
  if (c.lua_chon) o.lua_chon = c.lua_chon
  if (c.menh_de) { o.menh_de = c.menh_de; o.chu_de = c.chu_de }
  if (c.dap_an != null) o.dap_an = c.dap_an
  if (c.loi_giai) o.loi_giai = c.loi_giai
  if (c.hinh) o.anh_de = GHI ? urlAnh[c.hinh] : 'DRY-RUN'
  return o
}
const kq = {}
const cl = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await cl.connect()
await cl.query('begin')
try {
  for (const kho of ['dai', 'hgt']) {
    const ds = CAU.filter((c) => c.kho === kho)
    if (!ds.length) continue
    const r = await insertCauBatch({ client: cl, subject: kho, cauList: ds.map(dung) })
    const trung = new Map(r.trung.map((t) => [t.idx, t]))
    ds.forEach((c, i) => { kq[c.id] = { ma_cau: r.maCauList[i], kho, moi: !trung.has(i), ...(trung.has(i) ? { trung: trung.get(i) } : {}) } })
    console.log(`kho ${kho}: ${ds.length} câu · mới ${ds.length - r.trung.length} · trùng kho/lô ${r.trung.length}`, r.trung.length ? JSON.stringify(r.trung) : '')
  }
  if (GHI) fs.writeFileSync(D + 'ket-qua-kho.json', JSON.stringify(kq, null, 1))
  await cl.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await cl.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await cl.end()
