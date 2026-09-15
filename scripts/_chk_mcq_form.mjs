// Kiểm sau M1 spec-mcq-form: đếm form, xem 1 mẫu, thử trigger CHẶN dòng sai (trong transaction rollback).
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 20000 })
await c.connect()
console.log((await c.query(`select count(*)::int n, count(*) filter (where da_duyet)::int duyet, jsonb_object_agg(dap_an, n) pb
  from (select dap_an, da_duyet, count(*) over (partition by dap_an) n from dai_cau_form_tn where xoa_at is null) s`)).rows[0])
const m = (await c.query(`select f.ma_cau, q.noi_dung, f.dap_an, f.key_gia_tri, f.lua_chon from dai_cau_form_tn f join dai_cau_hoi q using (ma_cau) where f.ma_cau = 'T107010401015'`)).rows[0]
console.log(m.ma_cau, m.noi_dung, '| key', m.key_gia_tri, '| đúng', m.dap_an)
for (const [i, o] of m.lua_chon.entries()) console.log(' ', 'ABCD'[i], o.text, o.dung ? '✓' : `✗ ${o.rule}: ${o.duong_sai}`)
console.log((await c.query(`select count(*)::int rules, count(*) filter (where du_phong)::int du_phong from dai_mcq_rule`)).rows[0])
// Trigger phải CHẶN: 3 phương án / dap_an lệch / rule không tồn tại / trùng form hiệu lực
const bad = [
  ['3 phương án', `'[{"text":"1","dung":true},{"text":"2","dung":false,"rule":"R01"},{"text":"3","dung":false,"rule":"R02"}]'`, 'A'],
  ['dap_an lệch', `'[{"text":"1","dung":true},{"text":"2","dung":false,"rule":"R01"},{"text":"3","dung":false,"rule":"R02"},{"text":"4","dung":false,"rule":"R03"}]'`, 'B'],
  ['rule không tồn tại', `'[{"text":"1","dung":true},{"text":"2","dung":false,"rule":"R99"},{"text":"3","dung":false,"rule":"R02"},{"text":"4","dung":false,"rule":"R03"}]'`, 'A'],
  ['trùng form hiệu lực (unique)', `'[{"text":"1","dung":true},{"text":"2","dung":false,"rule":"R01"},{"text":"3","dung":false,"rule":"R02"},{"text":"4","dung":false,"rule":"R03"}]'`, 'A'],
]
for (const [ten, lc, da] of bad) {
  await c.query('begin')
  try { await c.query(`insert into dai_cau_form_tn (ma_cau, lua_chon, dap_an, key_gia_tri) values ('T107010401015', ${lc}::jsonb, '${da}', '1')`); console.log(`✖ KHÔNG chặn: ${ten}`) }
  catch (e) { console.log(`✓ chặn "${ten}": ${e.message.slice(0, 80)}`) }
  await c.query('rollback')
}
console.log('fn_mcq_loi_theo_dang:', JSON.stringify((await c.query(`select fn_mcq_loi_theo_dang('T107010401') j`)).rows[0].j))
await c.end()
