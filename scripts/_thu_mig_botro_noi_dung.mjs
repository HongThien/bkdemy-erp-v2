// Thử mig 202611101607_botro_noi_dung_theo_nhom trong transaction rồi ROLLBACK.
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  const uid = (await q(`select updated_by u from he_thong_cong_tac where ma='mastery_ban_do_moi'`))[0].u
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })])
  await c.query(fs.readFileSync('supabase/migrations/202611101607_botro_noi_dung_theo_nhom.sql', 'utf8'))
  const cs = await q(`select y.id, y.hoc_sinh_id, y.mon, y.trang_thai, count(d.id) n from bo_tro_yeu y join bo_tro_yeu_dang d on d.bo_tro_yeu_id=y.id where y.mon='Toán' group by 1,2,3,4 order by max(d.created_at) desc limit 3`)
  for (const x of cs) {
    let t = Date.now(); const r = await q(`select * from fn_btyeu_case_dang_nhom($1)`, [x.id])
    console.log(`case ${x.trang_thai} (${x.n} dạng) ${Date.now() - t} ms`)
    for (const d of r.slice(0, 8)) console.log(`   ${d.nhom_id ?? '—'} ${d.ten_nhom ?? ''} [${d.nhom_score == null ? '' : Math.round(d.nhom_score * 100) + '% ' + d.nhom_muc}] | ${d.ma_dang} ${d.ten_dang} ${d.score == null ? 'chưa đo' : Math.round(d.score * 100) + '%'}`)
    t = Date.now(); const g = await q(`select * from fn_btyeu_dang_goi_y_nhom($1, $2)`, [x.hoc_sinh_id, x.mon])
    console.log(`   gợi ý: ${g.length} dạng, ${new Set(g.map((y) => y.nhom_id)).size} nhóm · ${Date.now() - t} ms · đầu: ${g[0] ? g[0].ten_nhom + ' ' + Math.round(g[0].nhom_score * 100) + '%' : ''}`)
  }
} catch (e) { console.log('LỖI', e.message) } finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK') }
