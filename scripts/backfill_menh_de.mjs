// ============================================================================
// backfill_menh_de.mjs — sync jsonb menh_de cũ xuống bảng con dai/hgt_cau_menh_de.
//
// Chạy SAU khi migration 202609121432_dai_hgt_cau_menh_de_bang_con.sql đã áp
// (trigger _sync_cau_menh_de đã tồn tại).
//
// USAGE:
//   node scripts/backfill_menh_de.mjs             # dry-run (default), báo cáo
//   node scripts/backfill_menh_de.mjs --apply     # gọi _sync_cau_menh_de cho từng câu ĐS
//
// Trigger đã handle skip mệnh đề có ma_dang không hợp lệ (renumber phá) — script
// này không fail cứng. Sau backfill, câu nào có mệnh đề bị skip sẽ có gap thu_tu
// trong bảng con — UI phải render "mệnh đề X chưa gán dạng, mời tag lại".
// ============================================================================
import pg from 'pg'
import fs from 'node:fs'
import { readFileSync } from 'node:fs'

function envKey(txt, ten) {
  const m = txt.match(new RegExp(`^\\s*${ten}\\s*=\\s*(.+?)\\s*$`, 'm'))
  return m ? m[1].replace(/^["']|["']$/g, '') : null
}
const envTxt = readFileSync('.env', 'utf8')

const APPLY = process.argv.includes('--apply')
const url = APPLY
  ? (process.env.DATABASE_URL_RW ?? envKey(envTxt, 'DATABASE_URL'))
  : (envKey(envTxt, 'DATABASE_URL_RO') ?? envKey(envTxt, 'DATABASE_URL'))

if (!url) { console.error('❌ Thiếu chuỗi kết nối'); process.exit(2) }
if (APPLY) console.error('⚠ MODE = --apply (ghi thật vào DB)')
else       console.error('MODE = dry-run (chỉ báo cáo, không ghi)')

const c = new pg.Client({ connectionString: url })
await c.connect()

const tables = [
  { cau: 'dai_cau_hoi', bd: 'dai_ban_do', bc: 'dai_cau_menh_de' },
  { cau: 'hgt_cau_hoi', bd: 'hgt_ban_do', bc: 'hgt_cau_menh_de' },
]

let tongSync = 0
let tongSkipMd = 0

for (const t of tables) {
  console.error(`\n─── ${t.cau} → ${t.bc} ───`)
  const rows = await c.query(`
    select ma_cau, menh_de
    from ${t.cau}
    where loai_cau = 'dung_sai' and xoa_at is null
      and menh_de is not null and jsonb_array_length(menh_de) > 0
    order by ma_cau`)
  console.error(`Câu ĐS có mệnh đề: ${rows.rows.length}`)

  // Verify ma_dang hợp lệ, đếm skip
  const allDang = new Set()
  rows.rows.forEach(r => (r.menh_de || []).forEach(m => m.ma_dang && allDang.add(m.ma_dang)))
  const chk = await c.query(`select ma_dang from ${t.bd} where ma_dang = any($1::text[])`, [[...allDang]])
  const bdSet = new Set(chk.rows.map(x => x.ma_dang))

  let nSync = 0
  let nSkipMd = 0
  for (const r of rows.rows) {
    const totalMd = (r.menh_de || []).length
    const validMd = (r.menh_de || []).filter(m => m.ma_dang && bdSet.has(m.ma_dang) && m.noi_dung).length
    nSkipMd += (totalMd - validMd)
    if (APPLY) {
      await c.query(`select _sync_cau_menh_de($1, $2, $3, $4::jsonb)`,
        [t.bc, t.bd, r.ma_cau, JSON.stringify(r.menh_de)])
    }
    nSync++
  }

  // Verify sau backfill
  if (APPLY) {
    const post = await c.query(`select count(*)::int as n from ${t.bc}`)
    console.error(`  Đã gọi _sync cho ${nSync} câu. Bảng ${t.bc} hiện có ${post.rows[0].n} dòng mệnh đề.`)
  } else {
    console.error(`  Sẽ sync ${nSync} câu (dry-run).`)
  }
  console.error(`  Mệnh đề bị skip do ma_dang không hợp lệ hoặc thiếu noi_dung: ${nSkipMd}`)
  tongSync += nSync
  tongSkipMd += nSkipMd
}

console.error(`\n═══ TỔNG: ${tongSync} câu ĐS được sync · ${tongSkipMd} mệnh đề bị skip (gap thu_tu trong bảng con) ═══`)
if (!APPLY) console.error('\nChạy lại với --apply để ghi thật.')

await c.end()
