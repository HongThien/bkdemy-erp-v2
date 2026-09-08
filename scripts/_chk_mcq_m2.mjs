// Kiểm M2 spec-mcq-form: RPC list / rule / metric / duyệt / từ chối — ghi trong transaction ROLLBACK, DB không đổi.
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 20000 })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
console.log('list dai/7      :', (await q(`select count(*)::int n from fn_mcq_form_cho_duyet('dai','7')`))[0].n, 'chờ duyệt')
console.log('list dai/8      :', (await q(`select count(*)::int n from fn_mcq_form_cho_duyet('dai','8')`))[0].n)
console.log('list khtn (chưa có bảng):', (await q(`select count(*)::int n from fn_mcq_form_cho_duyet('khtn','7')`))[0].n, '(phải 0, không nổ)')
console.log('rule dai        :', (await q(`select count(*)::int n from fn_mcq_rule('dai')`))[0].n, '· rule khtn:', (await q(`select count(*)::int n from fn_mcq_rule('khtn')`))[0].n)
console.log('metric trước    :', JSON.stringify((await q(`select fn_mcq_metric('dai') j`))[0].j))
try { await q(`select fn_mcq_form_cho_duyet('xxx','7')`); console.log('✖ p_kho lạ KHÔNG bị chặn') } catch (e) { console.log('✓ chặn p_kho lạ:', e.message.slice(0, 60)) }
const ns = (await q(`select id from nhan_su order by created_at limit 1`))[0]?.id
const f = (await q(`select id, ma_cau, lua_chon from fn_mcq_form_cho_duyet('dai','7') limit 2`))
// 1) duyệt KHÔNG sửa
await c.query('begin')
await q(`select fn_mcq_form_duyet('dai', $1, $2, null)`, [f[0].id, ns])
let r = (await q(`select da_duyet, sua_truoc_duyet, duyet_boi is not null nb from dai_cau_form_tn where id = $1`, [f[0].id]))[0]
console.log('duyệt không sửa :', r, r.da_duyet && !r.sua_truoc_duyet && r.nb ? '✓' : '✖')
console.log('metric sau duyệt:', JSON.stringify((await q(`select fn_mcq_metric('dai') j`))[0].j).slice(0, 160))
try { await q(`select fn_mcq_form_duyet('dai', $1, $2, null)`, [f[0].id, ns]); console.log('✖ duyệt lần 2 KHÔNG bị chặn') } catch (e) { console.log('✓ chặn duyệt lần 2:', e.message.slice(0, 60)) }
await c.query('rollback')
// 2) duyệt CÓ sửa (đổi đường sai của phương án sai đầu tiên)
await c.query('begin')
const sua = f[1].lua_chon.map((o) => (o.dung ? o : { ...o, duong_sai: (o.duong_sai ?? '') + ' (TA sửa)' }))
await q(`select fn_mcq_form_duyet('dai', $1, $2, $3::jsonb)`, [f[1].id, ns, JSON.stringify(sua)])
r = (await q(`select da_duyet, sua_truoc_duyet, lua_chon->1->>'duong_sai' ds from dai_cau_form_tn where id = $1`, [f[1].id]))[0]
console.log('duyệt có sửa    :', r.da_duyet, r.sua_truoc_duyet, r.ds?.slice(-9), r.da_duyet && r.sua_truoc_duyet ? '✓' : '✖')
// sửa thành cấu trúc SAI (rule không tồn tại) → trigger phải chặn
try { await q(`select fn_mcq_form_duyet('dai', $1, $2, $3::jsonb)`, [f[0].id, ns, JSON.stringify(f[0].lua_chon.map((o) => (o.dung ? o : { ...o, rule: 'R99' })))]); console.log('✖ rule R99 KHÔNG bị chặn') } catch (e) { console.log('✓ trigger chặn rule R99 khi sửa:', e.message.slice(0, 60)) }
await c.query('rollback')
// 3) từ chối
await c.query('begin')
try { await q(`select fn_mcq_form_tu_choi('dai', $1, $2, '')`, [f[0].id, ns]); console.log('✖ từ chối rỗng lý do KHÔNG bị chặn') } catch (e) { console.log('✓ chặn từ chối không lý do:', e.message.slice(0, 50)) }
await c.query('rollback'); await c.query('begin')
await q(`select fn_mcq_form_tu_choi('dai', $1, $2, 'phương án B trùng giá trị đáp án')`, [f[0].id, ns])
r = (await q(`select xoa_at is not null xoa, tu_choi_ly_do, tu_choi_boi is not null nb from dai_cau_form_tn where id = $1`, [f[0].id]))[0]
console.log('từ chối         :', r, r.xoa && r.nb ? '✓' : '✖')
console.log('list sau từ chối:', (await q(`select count(*)::int n from fn_mcq_form_cho_duyet('dai','7')`))[0].n, '(phải 34)')
console.log('metric sau từ chối:', JSON.stringify((await q(`select fn_mcq_metric('dai') j`))[0].j).slice(0, 200))
await c.query('rollback')
console.log('sau rollback    :', (await q(`select count(*)::int n from fn_mcq_form_cho_duyet('dai','7')`))[0].n, '(phải 35)')
await c.end()
