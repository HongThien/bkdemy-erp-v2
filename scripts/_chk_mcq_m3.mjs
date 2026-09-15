// Kiểm M3 spec-mcq-form: tu_luyen_sinh / _btyeu_chon_cau / _kho_snapshot_cau ưu tiên form TN đã duyệt.
// Giả lập JWT học sinh qua request.jwt.claims; MỌI ghi trong transaction ROLLBACK — DB không đổi.
import pg from 'pg'
import { readFileSync } from 'node:fs'
const url = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1]
const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20000 }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const DANG = 'T107010401'
console.log('dk khtn (chưa có bảng form):', (await q(`select _kho_dk_online_sql('khtn_cau_hoi') s`))[0].s.includes('exists') ? '✖ có exists' : '✓ không có exists')
console.log('dk dai                      :', (await q(`select _kho_dk_online_sql('dai_cau_hoi') s`))[0].s.includes('dai_cau_form_tn') ? '✓ có exists form' : '✖')
console.log('form đã duyệt hiện có       :', (await q(`select count(*)::int n from dai_cau_form_tn where da_duyet and xoa_at is null`))[0].n)
// HS lớp 7 Toán có tài khoản
const hs = (await q(`
  select tk.id tk_id, hs.id hs_id, hs.ho_ten, l.ten_lop lop from tai_khoan tk join hoc_sinh hs on hs.id = tk.hoc_sinh_id
  join hoc_sinh_lop hl on hl.hoc_sinh_id = hs.id and hl.trang_thai = 'dang_hoc' join lop l on l.id = hl.lop_id and l.mon = 'Toán'
  where l.khoi = '7' order by hs.ho_ten limit 1`))[0]
console.log('HS test:', hs?.ho_ten, hs?.lop)
await c.query('begin')
try {
  // Trong transaction: duyệt tạm 5 form (nếu chưa ai duyệt) để có ứng viên
  await q(`update dai_cau_form_tn set da_duyet = true where id in (select id from dai_cau_form_tn where not da_duyet and xoa_at is null order by ma_cau limit 5)`)
  // _btyeu_chon_cau: ứng viên phải gồm câu tu_luan có form
  const ung = (await q(`select unnest(_btyeu_chon_cau('dai_cau_hoi', $1, null, '{}', 40)) m`, [DANG])).map((r) => r.m)
  const tl = (await q(`select ma_cau from dai_cau_hoi where dang_chinh = $1 and loai_cau = 'tu_luan' and ma_cau = any($2)`, [DANG, ung])).map((r) => r.ma_cau)
  const coForm = (await q(`select ma_cau from dai_cau_form_tn where da_duyet and xoa_at is null and ma_cau = any($1)`, [ung])).map((r) => r.ma_cau)
  console.log(`_btyeu_chon_cau: ${ung.length} ứng viên · tu_luan trong đó ${tl.length} (đều phải có form: ${tl.every((m) => coForm.includes(m)) ? '✓' : '✖'})`)
  // tu_luyen_sinh với JWT HS
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: hs.tk_id, role: 'authenticated' })])
  const r = (await q(`select tu_luyen_sinh('Toán', $1::jsonb) j`, [JSON.stringify([DANG, DANG, DANG, 'T107010201'])]))[0].j
  console.log('tu_luyen_sinh:', r)
  const cau = await q(`select thu_tu, ma_cau, loai_cau, dap_an_key, form_tn_id is not null co_form, lua_chon_rule, jsonb_array_length(coalesce(lua_chon,'[]')) n_lc, ma_cum
                       from bai_test_cau where bai_test_id = $1 order by thu_tu`, [r.bai_test_id])
  for (const x of cau) console.log(' ', x.thu_tu, x.ma_cau, x.loai_cau, 'key', JSON.stringify(x.dap_an_key), 'form', x.co_form, 'rule', x.lua_chon_rule, 'lc', x.n_lc)
  const formRows = cau.filter((x) => x.co_form)
  console.log(formRows.length ? `✓ ${formRows.length} câu snapshot từ form (ưu tiên form)` : '✖ không câu nào từ form')
  console.log(formRows.every((x) => x.loai_cau === 'trac_nghiem' && x.n_lc === 4 && x.lua_chon_rule.length === 4 && x.lua_chon_rule.filter((y) => y == null).length === 1 && /^[A-D]$/.test(x.dap_an_key)) ? '✓ cấu trúc snapshot đúng (TN, 4 lc, 4 rule với đúng 1 null, key A-D)' : '✖ cấu trúc snapshot sai')
  // Cột đúng khớp: null ở vị trí dap_an_key
  console.log(formRows.every((x) => x.lua_chon_rule['ABCD'.indexOf(x.dap_an_key)] == null) ? '✓ null của lua_chon_rule đúng vị trí đáp án' : '✖ lệch vị trí')
  // view v_mcq_loi_hs: giả lập HS trả lời sai chọn index khác đáp án
  const f0 = formRows[0]
  const sai = 'ABCD'.indexOf(f0.dap_an_key) === 0 ? 1 : 0
  const btc = (await q(`select id from bai_test_cau where bai_test_id = $1 and thu_tu = $2`, [r.bai_test_id, f0.thu_tu]))[0].id
  const bl = (await q(`insert into bai_lam (bai_test_id, hoc_sinh_id, bien_the) values ($1, $2, 1) returning id`, [r.bai_test_id, hs.hs_id]))[0].id
  await q(`insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi) values ($1, $2, to_jsonb($3::int), 'wrong', 0, 'exact')`, [bl, btc, sai])
  await c.query(`select set_config('request.jwt.claims', '', true)`)
  console.log('v_mcq_loi_hs:', await q(`select ma_cau, rule_ma from v_mcq_loi_hs where hoc_sinh_id = $1`, [hs.hs_id]))
  console.log('fn_mcq_loi_theo_hs:', JSON.stringify((await q(`select fn_mcq_loi_theo_hs($1, 'Toán') j`, [hs.hs_id]))[0].j))
} catch (e) { console.error('✖ LỖI:', e.message) }
await c.query('rollback')
console.log('rollback xong — bai_test tự luyện mới:', (await q(`select count(*)::int n from bai_test where loai='tu_luyen' and created_at > now() - interval '2 minutes'`))[0].n, '(phải 0)')
await c.end()
