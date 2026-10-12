// ghi-doan-thang-trung-diem.mjs — đẩy các câu "đoạn thẳng dài N cm, xác định trung điểm" (hình vẽ đúng cỡ thước) vào kho K3.
//   node --env-file=.env scripts/kho/ghi-doan-thang-trung-diem.mjs [--ghi]   (không --ghi = chạy thử, ROLLBACK, không upload)
// Hình sinh bằng scripts/kho/hinh-doan-thang-thuoc.mjs → out/doan-thang/. Dạng: T103040101 · da_duyet=false (chờ duyệt).
import pg from 'pg'
import { readFileSync, existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { insertCauBatch } from '../_kho_insert.mjs'

const GHI = process.argv.includes('--ghi')
const DANG = 'T103040101'
const DS = [[6, 'AB'], [10, 'CD'], [14, 'EF'], [8, 'MN'], [12, 'PQ']]
const dir = 'out/doan-thang'
const so = (n) => String(n).replace('.', ',')

const env = {}
for (const l of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!l.includes('=') || l.trim().startsWith('#')) continue
  const i = l.indexOf('='); env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '')
}
const sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } })

async function up(file) {
  const path = `doan-thang/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.png`
  if (!GHI) return `dry://kho-anh/${path}`
  const { error } = await sb.storage.from('kho-anh').upload(path, readFileSync(file), { contentType: 'image/png', upsert: false })
  if (error) throw new Error(`upload ${file}: ${error.message}`)
  return sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}

const cauList = []
for (const [d, t] of DS) {
  const td = t.includes('M') ? 'I' : 'M'
  const [A, B] = [t[0], t[1]]
  const h = so(d / 2)
  const de = `${dir}/doan-${t}-${so(d)}cm.png`, da = `${dir}/doan-${t}-${so(d)}cm-dap-an.png`
  if (!existsSync(de) || !existsSync(da)) throw new Error(`thiếu ảnh ${de} / ${da}`)
  cauList.push({
    dang_chinh: DANG, loai_cau: 'tra_loi_ngan',
    noi_dung: `Cho đoạn thẳng ${t} dài ${d} cm, hãy dùng thước xác định điểm ${td} là trung điểm của đoạn thẳng ${t}.`,
    dap_an: `${A}${td} = ${td}${B} = ${h} cm`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      `**Mấu chốt:** Trung điểm ${td} nằm giữa ${A} và ${B} và cách đều hai đầu đoạn thẳng, nên ${A}${td} = ${td}${B} bằng một nửa độ dài ${t}.`,
      `**Bước 1.** Tính nửa độ dài đoạn thẳng ${t}: $${d} : 2 = ${h}$ (cm).`,
      `**Bước 2.** Đặt vạch $0$ của thước trùng với điểm ${A}, thước nằm dọc theo đoạn thẳng ${t}.`,
      `**Bước 3.** Chấm điểm ${td} ở đúng vạch $${h}$ cm trên thước, rồi kiểm tra lại bằng cách đo ${td}${B}.`,
      '',
      '**Phần 2. Trình bày**',
      `Nửa độ dài đoạn thẳng ${t} là:`,
      `$${d} : 2 = ${h}$ (cm)`,
      `Trên đoạn thẳng ${t}, lấy điểm ${td} cách ${A} một đoạn $${h}$ cm. Khi đó ${A}${td} = ${td}${B} = $${h}$ cm.`,
      `Vậy ${td} là trung điểm của đoạn thẳng ${t}.`,
    ].join('\n\n').replace('\n\n\n\n', '\n\n'),
    anh_de: await up(de), anh_dap_an: await up(da),
    nguon: 'le', nguon_giai: 'nguoi', ten_de_goc: `Trung điểm đoạn thẳng · ${t} ${so(d)} cm`,
  })
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 })
await c.connect()
await c.query('begin')
try {
  const { maCauList, trung } = await insertCauBatch({ client: c, subject: 'dai', cauList })
  console.log(maCauList.join('\n'), trung.length ? `\ntrùng: ${JSON.stringify(trung)}` : '')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✅ ĐÃ GHI' : '↩ chạy thử, ROLLBACK')
} catch (e) { await c.query('rollback'); console.error('❌', e.message); process.exitCode = 1 }
await c.end()
