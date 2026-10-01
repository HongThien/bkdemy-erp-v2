import { readFileSync } from 'node:fs'
import pg from 'pg'
const lines = readFileSync('.env', 'utf8').split(/\r?\n/)
const envKey = (t) => { const l = lines.find((x) => x.trim().startsWith(t + '=')); return l ? l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : null }
const c = new pg.Client({ connectionString: envKey('DATABASE_URL_RO') || envKey('DATABASE_URL') })
await c.connect()
const dangs = ['T112030101','T112030102','T112030103','T112030104']
const q = async (t, sql) => { console.log('\n== ' + t); try { console.table((await c.query(sql, [dangs])).rows) } catch (e) { console.log('ERR', e.message.slice(0,120)) } }
await q('tài liệu đang dùng câu của chuyên đề', `select t.id, t.loai, left(t.ten,50) ten, l.ten_lop, t.ngay::date ngay, count(*) so_cau from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id join tai_lieu t on t.id = p.tai_lieu_id left join lop l on l.id = t.lop_id where tc.ma_cau in (select ma_cau from dai_cau_hoi where dang_chinh = any($1)) group by 1,2,3,4,5 order by t.ngay`)
await q('bài test HS đã làm có câu của chuyên đề', `select b.ma_dang, count(*) n, count(distinct b.bai_test_id) so_bai from bai_test_cau b where b.ma_dang = any($1) group by 1`)
await q('ca_test chứa dạng này', `select ct.id, ct.trang_thai, ct.created_at::date, count(*) so_cau from ca_test_cau cc join ca_test ct on ct.id = cc.ca_test_id where cc.ma_dang = any($1) group by 1,2,3 order by 3`)
await c.end()
