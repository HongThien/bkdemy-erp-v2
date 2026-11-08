// ghi-anh-cau.mjs — thay anh_de của CÂU bằng hình máy vẽ (spec như bt-NDB00777.mjs: { cau:[ma…], mt }). Chỉ chạy SAU khi Thùy duyệt trang trước/sau.
//   node scripts/kho/ghi-anh-cau.mjs <spec.mjs> <EXPORT> [--ghi]   (không --ghi = chạy thử)
// Sao lưu anh_de cũ ra reports/sao-luu-anh-cau-<ts>.json; ảnh cũ giữ trên bucket.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { bien } from './cau-hinh.mjs'
import { veHinh } from './hinh-luong-giac.mjs'

const args = process.argv.slice(2), GHI = args.includes('--ghi')
const [tep, ten] = args.filter((a) => !a.startsWith('--'))
const ds = (await import(pathToFileURL(resolve(tep)).href))[ten]
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const sb = GHI ? createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } }) : null
const c = new pg.Client({ connectionString: bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } }); await c.connect()
try {
  const ma = ds.flatMap((d) => d.cau)
  const cu = (await c.query('select ma_cau, anh_de from dai_cau_hoi where ma_cau = any($1) and xoa_at is null', [ma])).rows
  const thieu = ma.filter((m) => !cu.some((r) => r.ma_cau === m)); if (thieu.length) throw new Error('không có câu: ' + thieu.join(', '))
  const moi = []
  for (const d of ds) {
    const { svg } = veHinh(d.mt), bam = createHash('sha1').update(svg).digest('hex').slice(0, 12), path = `cau-hinh/${d.cau[0]}_${bam}_${randomUUID().slice(0, 6)}.svg`
    let u = `dry://kho-anh/${path}`
    if (GHI) { const { error } = await sb.storage.from('kho-anh').upload(path, Buffer.from(svg), { contentType: 'image/svg+xml', upsert: false }); if (error) throw new Error(error.message); u = sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl }
    for (const m of d.cau) moi.push({ ma_cau: m, url: u })
  }
  console.log(moi.length, 'câu sẽ đổi anh_de')
  if (!GHI) process.exit(0)
  mkdirSync('reports', { recursive: true })
  const f = `reports/sao-luu-anh-cau-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(f, JSON.stringify(cu, null, 1)); console.log('sao lưu →', f)
  await c.query('begin')
  for (const m of moi) await c.query('update dai_cau_hoi set anh_de=$2 where ma_cau=$1', [m.ma_cau, m.url])
  await c.query('commit'); console.log('✅ đã ghi', moi.length)
} finally { await c.end() }
