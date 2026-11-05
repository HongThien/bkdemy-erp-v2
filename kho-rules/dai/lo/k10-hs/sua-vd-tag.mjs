// Sửa ##VD của 30 dạng K10 Hàm số: đề nằm CÙNG dòng với tag (`##VD Ví dụ 1. đề…`) ⇒ parser lythuyetBlocks.ts coi đó là TIÊU ĐỀ
// rồi ghi đè bằng "Ví dụ N" ⇒ đề bài MẤT. Đúng format: `##VD` đứng riêng dòng, đề ở dòng kế, "Bài giải:" đứng riêng dòng.
// Chạy: node kho-rules/dai/lo/k10-hs/sua-vd-tag.mjs [--ghi]   (không --ghi = thử ROLLBACK). Sửa luôn ra/cd1..4.json cho đồng bộ khi --ghi.
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')

export function suaVD(text) {
  return text.split(/(\n[ \t]*\n)/).map((doan) => {
    if (!/^##VD/i.test(doan)) return doan
    const lines = doan.split('\n')
    const rest = lines[0].replace(/^##VD[ \t]*/i, '').replace(/^Ví dụ\s*\d*\s*[.:]?\s*/i, '').trim()
    const out = ['##VD']
    if (rest) out.push(rest)
    for (const l of lines.slice(1)) {
      const m = l.match(/^\s*(Bài giải|Lời giải|Giải)\s*[.:]\s*(\S.*)$/)
      if (m) { out.push('Bài giải:'); out.push(m[2]) } else out.push(l)
    }
    return out.join('\n')
  }).join('')
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  const rows = (await c.query(`select d.id, d.ten, d.vi_du from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=n.chu_de_id where cd.khoi='10' and cd.ten='Hàm số, đồ thị và ứng dụng'`)).rows
  let n = 0
  for (const r of rows) {
    const moi = suaVD(r.vi_du)
    if (moi === r.vi_du) continue
    await c.query(`update dai_bdm_dang_bai set vi_du=$2, updated_at=now() where id=$1`, [r.id, moi]); n++
  }
  // kiểm: không còn ##VD cùng dòng
  const sot = (await c.query(`select count(*) n from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=n.chu_de_id where cd.ten='Hàm số, đồ thị và ứng dụng' and d.vi_du ~ '(^|\\n)##VD[ \\t]*[^ \\t\\n]'`)).rows[0].n
  if (+sot) throw new Error('còn sót ' + sot)
  console.log(`DB: sửa ${n}/${rows.length} dạng`)
  const ex = (await c.query(`select vi_du from dai_bdm_dang_bai where id=$1`, [rows[0].id])).rows
  if (GHI) {
    await c.query('commit')
    for (let i = 1; i <= 4; i++) {
      const f = new URL(`./ra/cd${i}.json`, import.meta.url)
      const a = JSON.parse(fs.readFileSync(f, 'utf8')); a.forEach((x) => { x.vi_du = suaVD(x.vi_du) })
      fs.writeFileSync(f, JSON.stringify(a, null, 2) + '\n')
    }
    console.log('ĐÃ GHI (DB + ra/cd1..4.json)')
  } else { await c.query('rollback'); console.log('Thử xong — ROLLBACK'); console.log(JSON.stringify(suaVD(rows[0].vi_du)).slice(0, 500)) }
} catch (e) { await c.query('rollback'); console.error('LỖI, ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
