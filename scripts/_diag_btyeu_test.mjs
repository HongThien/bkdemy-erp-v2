// Parity test fn_btyeu_* trong 1 transaction → ROLLBACK (không để lại dòng nào).
import fs from 'fs'
import pg from 'pg'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const HS_TK = '054c0644-1693-4816-8713-d71894950034', TA_TK = '95dde5fa-b41c-47cd-82f8-27dd9a820768'
const BUOI = '873f0d1b-3312-498d-a1af-c6e042baacc7', HH = '67f950d9-dfe3-4dab-9587-e4fcbd76951b', HS = '30a354aa-0c70-4dbb-88c7-4a540d2dd8bb'
const as = (tk) => c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk, role: 'authenticated' })])
const q = async (sql, p = []) => (await c.query(sql, p)).rows
const log = (t, v) => console.log('\n## ' + t + '\n' + JSON.stringify(v, null, 1).slice(0, 1500))
try {
  await c.query('begin')
  await as(HS_TK)
  log('0 HS ca_cua_toi TRƯỚC điểm danh (kỳ vọng null)', await q('select public.fn_btyeu_ca_cua_toi() v'))
  await q(`update buoi_hoc_hs set diem_danh='co_mat', bao_den_at=now() where id=$1`, [HH])
  const ca = (await q('select public.fn_btyeu_ca_cua_toi() v'))[0].v
  log('1 HS ca_cua_toi SAU điểm danh', { buoi_id: ca.buoi_id, mon: ca.mon, ta: ca.ta_ten, dangs: ca.dangs.map((d) => ({ ma: d.ma_dang, ten: d.ten_dang, cums: d.cums.length, so_cau_kho: d.cums.map((x) => x.so_cau_kho) })), test: ca.test })
  const d0 = ca.dangs[0]; const cum0 = d0.cums[0]?.ma_cum ?? null
  const lo1 = (await q('select public.fn_btyeu_luyen_sinh($1,$2,$3,3) v', [BUOI, d0.ma_dang, cum0]))[0].v
  log('2 luyen_sinh lô 1', lo1)
  const caus1 = await q('select id, ma_cau, ma_dang, ma_cum, loai_cau, dap_an_key from bai_test_cau where bai_test_id=$1 order by thu_tu', [lo1.bai_test_id])
  log('2b câu lô 1', caus1.map((x) => ({ ma_cau: x.ma_cau, cum: x.ma_cum, loai: x.loai_cau })))
  const bl1 = (await q(`insert into bai_lam (bai_test_id, hoc_sinh_id) values ($1,$2) returning id`, [lo1.bai_test_id, HS]))[0].id
  for (const [i, cau] of caus1.entries()) await q(`insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi) values ($1,$2,'0'::jsonb,$3,$4,'exact')`, [bl1, cau.id, i === 2 ? 'wrong' : 'correct', i === 2 ? 0 : 1])
  const lo2 = (await q('select public.fn_btyeu_luyen_sinh($1,$2,$3,3) v', [BUOI, d0.ma_dang, cum0]))[0].v
  const caus2 = await q('select ma_cau from bai_test_cau where bai_test_id=$1', [lo2.bai_test_id])
  log('3 lô 2 né lô 1?', { trung: caus2.filter((x) => caus1.some((y) => y.ma_cau === x.ma_cau)).length, so_cau: caus2.length })
  if (ca.dangs[1]) {
    const lo3 = (await q('select public.fn_btyeu_luyen_sinh($1,$2,null,2) v', [BUOI, ca.dangs[1].ma_dang]))[0].v
    const caus3 = await q('select id from bai_test_cau where bai_test_id=$1', [lo3.bai_test_id])
    const bl3 = (await q(`insert into bai_lam (bai_test_id, hoc_sinh_id) values ($1,$2) returning id`, [lo3.bai_test_id, HS]))[0].id
    await q(`insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi) values ($1,$2,'0'::jsonb,'wrong',0,'exact')`, [bl3, caus3[0].id])
  }
  const ca2 = (await q('select public.fn_btyeu_ca_cua_toi() v'))[0].v
  log('4 tiến độ HS', ca2.dangs.map((d) => ({ ma: d.ma_dang, so_cau: d.so_cau, so_dung: d.so_dung, cums: d.cums.filter((x) => x.so_cau > 0).map((x) => x.ma_cum + ':' + x.so_dung + '/' + x.so_cau) })))
  await as(TA_TK)
  const ta1 = (await q('select public.fn_btyeu_ca_ta($1) v', [BUOI]))[0].v
  log('5 TA ca_ta', { hs: ta1.hs, diem_danh: ta1.diem_danh, dangs: ta1.dangs.map((d) => ({ ma: d.ma_dang, so_cau: d.so_cau, so_dung: d.so_dung, cums: d.cums })), test: ta1.test, retest: ta1.retest, so_lan_huy: ta1.so_lan_huy })
  const dong = (await q('select public.fn_btyeu_dong_ca($1) v', [BUOI]))[0].v
  log('6 dong_ca', dong)
  const dong2 = (await q('select public.fn_btyeu_dong_ca($1) v', [BUOI]))[0].v
  log('6b dong_ca lần 2 (idempotent)', dong2)
  log('6c dạng đã chốt day_at', await q(`select ma_dang, day_at is not null as day, day_buoi_id=$1 as buoi_nay from bo_tro_yeu_dang where bo_tro_yeu_id=(select bo_tro_yeu_id from buoi_hoc_hs where id=$2)`, [BUOI, HH]))
  log('6d test câu', await q('select thu_tu, ma_cau, ma_dang, ma_cum from bai_test_cau where bai_test_id=$1 order by thu_tu', [dong.bo_tro_test_id]))
  if (dong.retest_id) log('6e retest câu', await q('select bt.ngay, bt.lop_id is not null lop, count(*) so_cau, array_agg(distinct btc.ma_dang) dangs from bai_test bt join bai_test_cau btc on btc.bai_test_id=bt.id where bt.id=$1 group by bt.ngay, bt.lop_id', [dong.retest_id]))
  await as(HS_TK)
  await c.query('savepoint s7')
  try { await q('select public.fn_btyeu_luyen_sinh($1,$2,null,1)', [BUOI, d0.ma_dang]); console.log('\n## 7 ❌ luyện sau đóng ca KHÔNG bị chặn') } catch (e) { console.log('\n## 7 ✓ chặn luyện sau đóng ca:', e.message); await c.query('rollback to savepoint s7') }
  const de = (await q('select public.et_de($1) v', [dong.bo_tro_test_id]))[0].v
  log('8 et_de test cuối ca (số câu, có key?)', { n: de.length, coKey: de.some((x) => 'dap_an_key' in x) })
  const blT = (await q(`insert into bai_lam (bai_test_id, hoc_sinh_id) values ($1,$2) returning id`, [dong.bo_tro_test_id, HS]))[0].id
  for (const cau of de) await q(`insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs) values ($1,$2,$3)`, [blT, cau.id, JSON.stringify(cau.loai_cau === 'trac_nghiem' ? 0 : cau.loai_cau === 'dung_sai' ? ['D', 'D', 'D', 'D'] : 'x')])
  const rev = (await q('select public.et_nop($1) v', [blT]))[0].v
  log('8b et_nop test cuối ca', { n: rev.length, verdicts: rev.map((r) => r.verdict) })
  log('9 retest_cua_toi hôm nay (kỳ vọng rỗng, ngày tương lai)', (await q('select public.fn_btyeu_retest_cua_toi() v'))[0].v)
  if (dong.retest_id) {
    await q(`update bai_test set ngay = public._btyeu_today() where id=$1`, [dong.retest_id])
    log('9b retest_cua_toi sau khi tới ngày', (await q('select public.fn_btyeu_retest_cua_toi() v'))[0].v)
    const blR = (await q(`insert into bai_lam (bai_test_id, hoc_sinh_id) values ($1,$2) returning id`, [dong.retest_id, HS]))[0].id
    const keys = await q('select id, loai_cau, dap_an_key from bai_test_cau where bai_test_id=$1', [dong.retest_id])
    for (const k of keys) {
      const ans = k.loai_cau === 'trac_nghiem' ? (String(k.dap_an_key).toUpperCase().charCodeAt(0) - 65) : k.dap_an_key
      await q(`insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs) values ($1,$2,$3)`, [blR, k.id, JSON.stringify(ans)])
    }
    const revR = (await q('select public.et_nop($1) v', [blR]))[0].v
    log('9c et_nop retest verdicts', revR.map((r) => r.verdict))
    log('9d bo_tro_yeu_dang sau retest', await q(`select ma_dang, retest_diem, retest_nguon, dat, dong_at is not null as dong from bo_tro_yeu_dang where bo_tro_yeu_id=(select bo_tro_yeu_id from buoi_hoc_hs where id=$1)`, [HH]))
  }
  await as(TA_TK)
  await q(`select public.fn_btyeu_hoan_tat($1, 'Em làm tốt cụm 1, cụm 2 còn chậm', '4a', null)`, [BUOI])
  const ta2 = (await q('select public.fn_btyeu_ca_ta($1) v', [BUOI]))[0].v
  log('10 sau hoàn tất', { danh_gia_xong_at: ta2.danh_gia_xong_at, danh_gia: ta2.danh_gia, test: ta2.test && { da_nop: ta2.test.da_nop, theo_dang: ta2.test.theo_dang } })
  log('11 fn_mastery_cells include_btvn cho dạng đã luyện', await q(`select ma_dang, round(score,2) score, n from public.fn_mastery_cells(array[$1::uuid], true) where ma_dang = any($2)`, [HS, ca.dangs.map((d) => d.ma_dang)]))
} catch (e) { console.error('\n❌ LỖI:', e.message, e.where ?? '') } finally { await c.query('rollback'); await c.end(); console.log('\n(rollback xong — không để lại dòng nào)') }
