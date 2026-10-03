// Kiểm bộ vẽ đã chép (src/lib/sotayHinh/hinhVe.js): vẽ MỌI mã hình đang có trong DB (sotay_ct_hinh.ve) — mã nào không ra <svg> là lỗi.
// Chạy: node scripts/sotay-khtn/kiem-hinh-ve.mjs   (cần .env DATABASE_URL; không ghi gì)
import pg from 'pg'
process.loadEnvFile('.env')
globalThis.document = { addEventListener() {} } // module gắn tương tác vào document lúc nạp — Node không có
const { veHinh } = await import('../../src/lib/sotayHinh/hinhVe.js')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const rows = (await c.query('select mon, ma, ve from sotay_ct_hinh where ve is not null')).rows
await c.end()
let ok = 0; const hong = []
for (const r of rows) { const h = veHinh(r.ve); if (h.includes('<svg')) ok++; else hong.push(`${r.mon} ${r.ma} ${r.ve}`) }
console.log(`vẽ được ${ok}/${rows.length}`)
if (hong.length) { console.log(hong.join('\n')); process.exit(1) }
