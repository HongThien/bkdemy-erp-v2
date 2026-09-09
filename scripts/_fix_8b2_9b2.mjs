// FIX (WRITE) — 8B2 mở lại lớp · 9B2 đóng 3 slot chiều cũ tại 02/08 (hết nhân đôi hôm nay).
// Chạy: node scripts/_fix_8b2_9b2.mjs        (chỉ in, KHÔNG ghi)
//        node scripts/_fix_8b2_9b2.mjs apply  (ghi thật)
import { readFileSync } from 'node:fs'
import pg from 'pg'
const APPLY = process.argv[2] === 'apply'
const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()

const LOP_8B2 = '2e09a4b3-f48b-4f69-a08c-4c204c4ec4fc'
const OLD_9B2_SLOTS = [ // 3 slot chiều 15:00 cũ
  '0f1813e2-fac2-4ad2-9f01-af27f04846c7', // T2
  '92cc1ce2-3801-4066-8a64-8ff8cc8fe0dc', // T4
  'f13d5734-7e0f-49de-913e-a59ed27a2032', // T6
]

console.log(`Mode: ${APPLY ? 'APPLY (ghi)' : 'DRY-RUN (chỉ in)'}\n`)

// --- trước ---
const before8 = (await c.query(`select ten_lop,trang_thai from lop where id=$1`, [LOP_8B2])).rows[0]
console.log(`8B2 trước: trang_thai=${before8.trang_thai}`)
const before9 = (await c.query(`select id,thu,gio_bat_dau,hieu_luc_den from thoi_khoa_bieu where id=any($1) order by thu`, [OLD_9B2_SLOTS])).rows
for (const s of before9) console.log(`  9B2 slot T${s.thu} ${String(s.gio_bat_dau).slice(0,5)} hieu_luc_den=${s.hieu_luc_den?String(s.hieu_luc_den).slice(0,10):'∞'}`)

if (APPLY) {
  await c.query('begin')
  const r8 = await c.query(`update lop set trang_thai='dang_hoc', updated_at=now() where id=$1 and trang_thai='dong'`, [LOP_8B2])
  const r9 = await c.query(`update thoi_khoa_bieu set hieu_luc_den='2026-08-02' where id=any($1)`, [OLD_9B2_SLOTS])
  await c.query('commit')
  console.log(`\nGHI XONG: 8B2 rows=${r8.rowCount} · 9B2 slots rows=${r9.rowCount}`)
  // --- sau ---
  const after8 = (await c.query(`select trang_thai from lop where id=$1`, [LOP_8B2])).rows[0]
  console.log(`8B2 sau: trang_thai=${after8.trang_thai}`)
  const after9 = (await c.query(`select thu,hieu_luc_den from thoi_khoa_bieu where id=any($1) order by thu`, [OLD_9B2_SLOTS])).rows
  for (const s of after9) console.log(`  9B2 slot T${s.thu} hieu_luc_den=${String(s.hieu_luc_den).slice(0,10)}`)
} else {
  console.log('\n(DRY-RUN — thêm "apply" để ghi)')
}
await c.end()
