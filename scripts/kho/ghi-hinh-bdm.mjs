// ghi-hinh-bdm.mjs — CHÈN hình do máy vẽ (hinh-luong-giac.mjs / hinh-giai-tich.mjs) vào LÝ THUYẾT hoặc VÍ DỤ của bản đồ mới (Đại).
//   node scripts/kho/ghi-hinh-bdm.mjs <spec.mjs> <TÊN_EXPORT> [--ghi]
//   Không --ghi: chạy thử — kiểm khuôn, vẽ hình, in ra chỗ sẽ chèn, KHÔNG upload, KHÔNG ghi DB.
//   --ghi: sao lưu giá trị cũ ra reports/sao-luu-hinh-bdm-<ts>.json → upload SVG lên bucket kho-anh/bdm-hinh/ → UPDATE từng dòng (trigger dai_bdm_log lưu cũ/mới).
// Mục spec:
//   ví dụ:    { dang: 'NDB…', vd: 2, mt }        chèn ngay sau phần đề của ##VD thứ 2, trước "Lời giải." / "Bài giải:"
//   lý thuyết:{ dang|nhom: 'NDB…'|'NNB…', lt: 'đoạn chữ nằm trong dòng cần chèn SAU', mt }   chèn hình thành dòng riêng sau dòng chứa đoạn chữ đó
// Đã có hình trong khối ví dụ đó ⇒ BỎ QUA (không đè hình cũ). Hình cũ trên bucket không bị xoá.
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
const url = process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri
if (!tep || !ten || !url) { console.error('Dùng: node scripts/kho/ghi-hinh-bdm.mjs <spec.mjs> <TÊN_EXPORT> [--ghi]'); process.exit(2) }
const ds = (await import(pathToFileURL(resolve(tep)).href))[ten]
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const sb = GHI ? createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } }) : null
const daUp = new Map()
async function dua(id, mt) {
  const { svg } = veHinh(mt)
  const bam = createHash('sha1').update(svg).digest('hex').slice(0, 12)
  if (daUp.has(bam)) return daUp.get(bam)
  const path = `bdm-hinh/${id}_${bam}_${randomUUID().slice(0, 6)}.svg`
  let u = `dry://kho-anh/${path}`
  if (GHI) {
    const { error } = await sb.storage.from('kho-anh').upload(path, Buffer.from(svg), { contentType: 'image/svg+xml', upsert: false })
    if (error) throw new Error(`upload ${path}: ${error.message}`)
    u = sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
  }
  daUp.set(bam, u); return u
}
const MOC = /^(Lời giải\.|Bài giải:)/

const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
try {
  const ids = [...new Set(ds.map((d) => d.dang ?? d.nhom))]
  const dang = (await c.query('select id, ly_thuyet, vi_du from dai_bdm_dang_bai where id = any($1)', [ids.filter((i) => i.startsWith('NDB'))])).rows
  const nhom = (await c.query('select id, ly_thuyet from dai_bdm_nhom where id = any($1)', [ids.filter((i) => i.startsWith('NNB'))])).rows
  const cur = new Map([...dang, ...nhom].map((r) => [r.id, { ...r, moi_lt: r.ly_thuyet, moi_vd: r.vi_du, dung: false }]))
  const loi = [], bo = []
  for (const d of ds) {
    const id = d.dang ?? d.nhom, r = cur.get(id)
    if (!r) { loi.push(`${id}: không có trong DB`); continue }
    try {
      if (d.vd) {
        const kh = r.moi_vd.split(/(?=##VD)/)   // mỗi phần bắt đầu bằng ##VD
        const idx = kh.findIndex((_, i) => i === d.vd - 1 + (kh[0].startsWith('##VD') ? 0 : 1))
        const k = kh[idx]; if (!k) { loi.push(`${id} vd${d.vd}: không có ví dụ này`); continue }
        if (d.thay) {   // thay URL của hình thứ d.thay (1,2,…) trong khối ví dụ bằng hình mới — hình cũ giữ nguyên trên bucket
          const ms = [...k.matchAll(/!\[\]\(([^)]*)\)/g)], m = ms[d.thay - 1]
          if (!m) { loi.push(`${id} vd${d.vd}: không có hình thứ ${d.thay} để thay`); continue }
          const u = await dua(id, d.mt)
          kh[idx] = k.slice(0, m.index) + `![](${u})` + k.slice(m.index + m[0].length); r.moi_vd = kh.join(''); r.dung = true
          console.log(`✓ ${id} vd${d.vd} → THAY hình ${d.thay}`); continue
        }
        if (/!\[\]\(/.test(k)) { bo.push(`${id} vd${d.vd}: đã có hình`); continue }
        const dong = k.split('\n'), im = dong.findIndex((l) => MOC.test(l.trim()))
        if (im < 1) { loi.push(`${id} vd${d.vd}: không thấy mốc "Lời giải."/"Bài giải:"`); continue }
        const u = await dua(id, d.mt)
        dong.splice(im, 0, `![](${u})`); kh[idx] = dong.join('\n'); r.moi_vd = kh.join(''); r.dung = true
        console.log(`✓ ${id} vd${d.vd} → chèn trước dòng ${im + 1}: ${dong[im - 1].slice(0, 60)}…`)
      } else {
        if (!d.lt) { loi.push(`${id}: thiếu "lt"`); continue }
        const dong = r.moi_lt.split('\n'), im = dong.findIndex((l) => l.includes(d.lt))
        if (im < 0) { loi.push(`${id}: không thấy đoạn "${d.lt}" trong lý thuyết`); continue }
        if (dong.slice(im, im + 3).some((l) => /!\[\]\(/.test(l))) { bo.push(`${id}: đã có hình sau "${d.lt}"`); continue }
        const u = await dua(id, d.mt)
        dong.splice(im + 1, 0, `![](${u})`); r.moi_lt = dong.join('\n'); r.dung = true
        console.log(`✓ ${id} lý thuyết → chèn sau: ${dong[im].slice(0, 70)}…`)
      }
    } catch (e) { loi.push(`${id}${d.vd ? ' vd' + d.vd : ''}: ${e.message}`) }
  }
  for (const b of bo) console.log('· bỏ qua', b)
  if (loi.length) { console.error('❌ LỖI — không ghi gì:\n  ' + loi.join('\n  ')); process.exit(3) }
  const doi = [...cur.values()].filter((r) => r.dung)
  console.log(`\n${doi.length} dòng sẽ đổi.`)
  if (!GHI) { console.log('(chạy thử — thêm --ghi để ghi thật)'); process.exit(0) }
  mkdirSync('reports', { recursive: true })
  const f = `reports/sao-luu-hinh-bdm-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(f, JSON.stringify(doi.map((r) => ({ id: r.id, ly_thuyet: r.ly_thuyet, vi_du: r.vi_du })), null, 1)); console.log('đã sao lưu giá trị cũ →', f)
  await c.query('begin')
  for (const r of doi) {
    if (r.id.startsWith('NDB')) await c.query('update dai_bdm_dang_bai set ly_thuyet=$2, vi_du=$3 where id=$1', [r.id, r.moi_lt, r.moi_vd])
    else await c.query('update dai_bdm_nhom set ly_thuyet=$2 where id=$1', [r.id, r.moi_lt])
  }
  await c.query('commit'); console.log('✅ đã ghi', doi.length, 'dòng')
} finally { await c.end() }
