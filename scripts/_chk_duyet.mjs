import pg from 'pg'
import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: envf('C:/Users/Admin/Desktop/BKERP/bkdemy-erp-v2/.env').DATABASE_URL }); await c.connect()
const blc = await c.query("select verdict, diem, cham_boi from bai_lam_cau where bai_test_cau_id in (select id from bai_test_cau where ma_cau='ZZTEST02')")
const rep = await c.query("select trang_thai, duyet_boi is not null as co_nguoi_duyet, duyet_at is not null as co_ts from bai_test_report where bai_lam_cau_id in (select id from bai_lam_cau where bai_test_cau_id in (select id from bai_test_cau where ma_cau='ZZTEST02'))")
const qaa = await c.query("select answer_normalized, answer_raw, source from question_accepted_answers where ma_cau='ZZTEST02'")
console.log('bai_lam_cau:', JSON.stringify(blc.rows))
console.log('report:', JSON.stringify(rep.rows))
console.log('cache:', JSON.stringify(qaa.rows))
await c.end()
