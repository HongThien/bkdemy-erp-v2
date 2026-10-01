// CHỈ ĐỌC. Mọi thứ đang trỏ vào 4 dạng + 99 câu của chuyên đề T1120301 (Luật xoá: liệt kê chính xác cái sẽ mất).
import { readFileSync } from 'node:fs'
import pg from 'pg'
const lines = readFileSync('.env', 'utf8').split(/\r?\n/)
const envKey = (t) => { const l = lines.find((x) => x.trim().startsWith(t + '=')); return l ? l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : null }
const c = new pg.Client({ connectionString: envKey('DATABASE_URL_RO') || envKey('DATABASE_URL') })
await c.connect(); await c.query('begin read only')
const CD = 'T1120301'
console.log('== Cột xoa_at có ở:', (await c.query(`select table_name from information_schema.columns where table_schema='public' and column_name='xoa_at' and table_name in ('dai_ban_do','dai_cau_hoi')`)).rows.map(r=>r.table_name))
console.log('\n== FK trỏ vào dai_ban_do / dai_cau_hoi:')
console.table((await c.query(`select conrelid::regclass::text bang, conname, pg_get_constraintdef(oid) dn from pg_constraint where contype='f' and confrelid in ('dai_ban_do'::regclass,'dai_cau_hoi'::regclass) order by 1`)).rows)
console.log('\n== Cột TEXT tên ma_dang/dang_chinh/ma_cau ở các bảng khác (tham chiếu không FK):')
const cols = (await c.query(`select table_name, column_name from information_schema.columns where table_schema='public' and column_name in ('ma_dang','dang_chinh','ma_cau','dang_phu') and table_name not in ('dai_ban_do','dai_cau_hoi') and table_name in (select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE') order by 1,2`)).rows
const dangs = (await c.query(`select ma_dang from dai_ban_do where ma_chuyen_de=$1`, [CD])).rows.map(r=>r.ma_dang)
const caus = (await c.query(`select ma_cau from dai_cau_hoi where dang_chinh = any($1)`, [dangs])).rows.map(r=>r.ma_cau)
console.log('dạng:', dangs, '· số câu:', caus.length)
const out = []
for (const {table_name, column_name} of cols) {
  const isDang = column_name !== 'ma_cau'
  const vals = isDang ? dangs : caus
  try {
    const typ = (await c.query(`select data_type from information_schema.columns where table_schema='public' and table_name=$1 and column_name=$2`, [table_name, column_name])).rows[0].data_type
    const sql = typ === 'ARRAY' ? `select count(*) n from "${table_name}" where "${column_name}" && $1::text[]` : `select count(*) n from "${table_name}" where "${column_name}" = any($1::text[])`
    const n = Number((await c.query(sql, [vals])).rows[0].n)
    if (n) out.push({ bang: table_name, cot: column_name, so_dong: n })
  } catch (e) { out.push({ bang: table_name, cot: column_name, so_dong: 'ERR ' + e.message.slice(0, 60) }) }
}
console.table(out)
console.log('\n== dai_cau_hoi: dang_phu chứa dạng này (câu thuộc dạng KHÁC nhưng phụ trỏ vào đây):')
try { console.table((await c.query(`select count(*) n from dai_cau_hoi where dang_chinh <> all($1) and dang_phu && $1`, [dangs])).rows) } catch (e) { console.log('  (không có dang_phu array):', e.message.slice(0,80)) }
console.log('\n== 99 câu: trạng thái duyệt / có lời giải / nguồn:')
console.table((await c.query(`select dang_chinh, count(*) n, count(*) filter (where da_duyet) da_duyet, count(*) filter (where loi_giai is not null and loi_giai<>'') co_loi_giai, min(created_at)::date tu, max(created_at)::date den from dai_cau_hoi where dang_chinh = any($1) group by 1 order by 1`, [dangs])).rows)
await c.query('rollback'); await c.end()
