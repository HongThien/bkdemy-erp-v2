import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
await c.query('begin')
const a = await c.query(`update hinh_hoc_cau_form_tn set xoa_at=now(), tu_choi_ly_do='Hình học không làm MCQ (bổ trợ Hình: in giấy, TA chấm ĐCS)' where ai_model='claude-sonnet-5-5' and xoa_at is null and not da_duyet and ma_cau like 'HHC%'`)
const b = await c.query(`delete from hinh_hoc_mcq_rule where ma >= 'R600' and ma < 'R700'`)
console.log('xoá mềm form', a.rowCount, '· xoá rule', b.rowCount)
if (a.rowCount !== 11 || b.rowCount !== 36) { await c.query('rollback'); console.log('LỆCH số dự kiến → rollback') } else await c.query('commit')
await c.end()
