// Kiểm migration hold retest: chạy trong 1 transaction → so TRƯỚC/SAU → ROLLBACK (không để lại gì).
// Dùng: node scripts/_verify_hold_retest.mjs [--da-ap]  (--da-ap: migration đã áp thật, chỉ đo SAU, không chạy file)
import fs from 'fs'
import pg from 'pg'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const DA_AP = process.argv.includes('--da-ap')
const q = async (sql, p = []) => (await c.query(sql, p)).rows
const admin = (await q(`select tk.id, tk.nhan_su_id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where ns.la_admin_he_thong limit 1`))[0]
const as = (tk) => c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk, role: 'authenticated' })])

async function do_(nhan) {
  await as(admin.id)
  const tt = (await q(`select public.fn_btyeu_trang_thai_ca(60) v`))[0].v
  const buoc = {}; for (const x of tt) buoc[x.buoc] = (buoc[x.buoc] ?? 0) + 1
  const xl = (await q(`select public.fn_btyeu_case_xep_lich(null) v`))[0].v
  const gd = {}; for (const x of xl) gd[`${x.trang_thai}/${x.giai_doan}`] = (gd[`${x.trang_thai}/${x.giai_doan}`] ?? 0) + 1
  const coRtNgay = xl.filter((x) => x.retest_ngay).length
  const viec = (await q(`select public.fn_btyeu_viec_cua_toi() v`))[0].v
  const dem = (await q(`select public.fn_btyeu_dem($1) v`, [admin.nhan_su_id]))[0].v
  const bttn = [] // 5 ngày tới có retest
  for (let i = 0; i < 5; i++) { const r = (await q(`select public.fn_bo_tro_trong_ngay((now() at time zone 'Asia/Ho_Chi_Minh')::date + $1::int) v`, [i]))[0].v; bttn.push((r.retest ?? []).length) }
  const mot = tt.find((x) => x.so_dang_cho_retest > 0)
  const ct = mot ? (await q(`select public.fn_btyeu_chi_tiet_case($1) v`, [mot.id]))[0].v : null
  const ttDang = {}; for (const d of ct?.dang ?? []) ttDang[d.tt] = (ttDang[d.tt] ?? 0) + 1
  console.log(`\n## ${nhan}`)
  console.log(' trang_thai_ca buoc:', buoc, '· case_truoc_id có trong output:', tt.length ? 'case_truoc_id' in tt[0] : '-')
  console.log(' case_xep_lich giai_doan:', gd, '· số case có retest_ngay:', coRtNgay)
  console.log(' viec_cua_toi(admin): ca', viec.ca.length, '· retest', viec.retest.length, '· fn_btyeu_dem', dem)
  console.log(' bo_tro_trong_ngay retest (hôm nay..+4):', bttn)
  console.log(' chi_tiet_case 1 case có dạng đã dạy: tt dạng', ttDang, '· retest', (ct?.retest ?? []).length)
  // _troly_*: có cổng _troly_gac (nhóm được cấp quyền) — thử trong savepoint; bị chặn thì soi thẳng thân hàm có công tắc chưa.
  for (const [ten, sql, doc] of [
    ['_troly_bc_viec_yeu', `select * from public._troly_bc_viec_yeu((now() at time zone 'Asia/Ho_Chi_Minh')::date - 14, (now() at time zone 'Asia/Ho_Chi_Minh')::date)`, (rows) => rows.filter((r) => JSON.stringify(r).includes('Retest')).length + ' dòng retest'],
    ['_troly_bc_thong_so', `select public._troly_bc_thong_so((now() at time zone 'Asia/Ho_Chi_Minh')::date - 14, (now() at time zone 'Asia/Ho_Chi_Minh')::date) v`, (rows) => JSON.stringify(rows[0].v.bo_tro_yeu.find((x) => x.nhan.startsWith('Retest')))],
  ]) {
    await c.query('savepoint sp_troly')
    try { console.log(` ${ten}:`, doc(await q(sql))); await c.query('release savepoint sp_troly') }
    catch (e) {
      await c.query('rollback to savepoint sp_troly')
      const coCongTac = (await q(`select prosrc like '%_btyeu_retest_bat()%' v from pg_proc where proname = $1`, [ten]))[0].v
      console.log(` ${ten}: bị cổng chặn (${e.message.slice(0, 40)}…) · thân hàm có công tắc: ${coCongTac}`)
    }
  }
}

try {
  await c.query('begin')
  if (!DA_AP) {
    await do_('TRƯỚC')
    await c.query(fs.readFileSync('supabase/migrations/202609291037_hold_retest_bo_tro_yeu.sql', 'utf8'))
  }
  await do_(DA_AP ? 'SAU (đã áp thật)' : 'SAU (trong transaction)')
  const bu = (await q(`select public.fn_btyeu_bu_retest_ton() v`))[0].v
  console.log(' fn_btyeu_bu_retest_ton() =', bu, '(hold ⇒ 0)')
} finally {
  await c.query('rollback'); await c.end()
}
