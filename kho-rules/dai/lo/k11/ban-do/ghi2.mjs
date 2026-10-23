// ghi2.mjs — SỬA lý thuyết / ví dụ đã có (CEO 16/10: "Sửa lại lý thuyết") của bản đồ mới khối 11. Khác ghi.mjs (chỉ ghi ô TRỐNG): file này GHI ĐÈ.
//   node kho-rules/dai/lo/k11/ban-do/ghi2.mjs <tệp.txt…>          # chạy thử: kiểm khuôn + vẽ hình + ghi trong transaction rồi ROLLBACK
//   node kho-rules/dai/lo/k11/ban-do/ghi2.mjs <tệp.txt…> --ghi    # sao lưu giá trị CŨ ra file → upload hình → ghi thật
// Khuôn tệp như ghi.mjs: `=== NDB…` (dạng) hoặc `=== NNB…` (nhóm), @ly_thuyet: / @vi_du: — chỉ phần nào CÓ trong tệp mới bị ghi đè.
// Dòng [[HINH:{json}]] (một dòng riêng) = hình do máy vẽ (scripts/kho/hinh-luong-giac.mjs) → upload bucket kho-anh → thay bằng ![](url).
// Mỗi dòng một UPDATE (trigger dai_bdm_log lưu actor + giá trị cũ/mới). Chỉ chạm dạng / nhóm của khối 11.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
import { veHinh } from '../../../../../scripts/kho/hinh-luong-giac.mjs'
import { docTep, kiemKhoi } from './kiem.mjs'

const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const teps = args.filter((a) => !a.startsWith('--'))
const url = process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri
if (!teps.length || !url) { console.error('Dùng: node …/ghi2.mjs <tệp.txt…> [--ghi]'); process.exit(2) }
const LV = 'C:/Users/WBPC/bk-kho-lam-viec/bdm/k11'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const sb = GHI ? createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } }) : null
const daUp = new Map()
async function nhungHinh(id, text) {
  if (!text) return text
  const re = /^\[\[HINH:(.*)\]\][ \t]*$/gm
  let kq = '', cuoi = 0
  for (const m of text.matchAll(re)) {
    const mt = JSON.parse(m[1]); const { svg } = veHinh(mt)
    const bam = createHash('sha1').update(svg).digest('hex').slice(0, 12)
    let u = daUp.get(bam)
    if (!u) {
      const path = `bdm-k11/${id}_${bam}_${randomUUID().slice(0, 6)}.svg`
      if (!GHI) u = `dry://kho-anh/${path}`
      else {
        const { error } = await sb.storage.from('kho-anh').upload(path, Buffer.from(svg), { contentType: 'image/svg+xml', upsert: false })
        if (error) throw new Error(`upload ${path}: ${error.message}`)
        u = sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
      }
      daUp.set(bam, u)
    }
    kq += text.slice(cuoi, m.index) + `![](${u})`; cuoi = m.index + m[0].length
  }
  return kq + text.slice(cuoi)
}

const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
try {
  const khoi = teps.flatMap((t) => docTep(readFileSync(t, 'utf8')).map((k) => ({ ...k, tep: t })))
  const idD = khoi.filter((k) => k.id.startsWith('NDB')).map((k) => k.id), idN = khoi.filter((k) => k.id.startsWith('NNB')).map((k) => k.id)
  const hienD = (await c.query(`select d.id, d.ly_thuyet, d.vi_du from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=n.chu_de_id where cd.khoi='11' and d.id=any($1)`, [idD])).rows
  const hienN = (await c.query(`select n.id, n.ly_thuyet from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id=n.chu_de_id where cd.khoi='11' and n.id=any($1)`, [idN])).rows
  const loi = []
  for (const k of khoi) {
    const la = k.id.startsWith('NNB'), h = (la ? hienN : hienD).find((x) => x.id === k.id)
    if (!h) { loi.push(`${k.id}: không phải ${la ? 'nhóm' : 'dạng'} của bản đồ mới khối 11`); continue }
    if (!k.lt && !k.vd) { loi.push(`${k.id}: tệp không có @ly_thuyet / @vi_du nào`); continue }
    if (la && k.vd) { loi.push(`${k.id}: nhóm không có ví dụ`); continue }
    for (const l of kiemKhoi(k, { canLt: !!k.lt })) {
      if (!k.vd && /thiếu @vi_du/.test(l)) continue
      if (!k.lt && /thiếu @ly_thuyet/.test(l)) continue
      if (la && /thiếu khung ##PP|##PP có/.test(l)) continue
      loi.push(`${k.id}: ${l}`)
    }
  }
  if (loi.length) { console.error('❌ còn lỗi khuôn — không ghi gì:\n  ' + loi.join('\n  ')); process.exit(3) }
  if (GHI) {
    mkdirSync(`${LV}/sao-luu`, { recursive: true })
    const f = `${LV}/sao-luu/truoc-ghi2-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    writeFileSync(f, JSON.stringify({ dang: hienD, nhom: hienN }, null, 1)); console.log('đã sao lưu giá trị cũ →', f)
  }
  await c.query('begin')
  let nLt = 0, nVd = 0
  for (const k of khoi) {
    const la = k.id.startsWith('NNB')
    const lt = k.lt ? await nhungHinh(k.id, k.lt) : null, vd = k.vd ? await nhungHinh(k.id, k.vd) : null
    if (la) { if (lt) nLt += (await c.query(`update dai_bdm_nhom set ly_thuyet=$2, updated_at=now() where id=$1`, [k.id, lt])).rowCount }
    else {
      if (lt) nLt += (await c.query(`update dai_bdm_dang_bai set ly_thuyet=$2, updated_at=now() where id=$1`, [k.id, lt])).rowCount
      if (vd) nVd += (await c.query(`update dai_bdm_dang_bai set vi_du=$2, updated_at=now() where id=$1`, [k.id, vd])).rowCount
    }
  }
  console.log(`${GHI ? 'GHI THẬT' : 'CHẠY THỬ (sẽ ROLLBACK)'} — ${khoi.length} mục · ghi đè lý thuyết ${nLt} · ghi đè ví dụ ${nVd} · hình ${daUp.size}`)
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ Đã ghi.' : 'Đã ROLLBACK — DB không đổi. Thêm --ghi để ghi thật.')
} catch (e) { await c.query('rollback').catch(() => {}); console.error('LỖI:', e.message); process.exitCode = 1 } finally { await c.end() }
