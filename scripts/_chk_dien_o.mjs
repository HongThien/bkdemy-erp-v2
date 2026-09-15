// Kiểm vòng ĐIỀN Ô D2 (spec-dien-o.md): form trong DB · duyệt/từ chối · tu_luyen_dien_sinh (JWT HS giả lập) · bản HS không lộ key ·
// hs_dien_tra_loi chấm Đ/C/S · view lỗi · trigger thu hồi khi lời giải đổi. MỌI ghi trong transaction ROLLBACK.
import pg from 'pg'
import { readFileSync } from 'node:fs'
const url = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1]
const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20000 }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const ok = (cond, msg) => console.log((cond ? '✓ ' : '✖ ') + msg)
console.log('form:', (await q(`select count(*)::int n, count(*) filter (where da_duyet)::int duyet from hinh_form_dien where xoa_at is null`))[0])
console.log('danh mục:', (await q(`select (select count(*) from hinh_ly_do) ly_do, (select count(*) from hinh_loi_cm) loi`))[0])
const cho = await q(`select id, ma, khoi, jsonb_array_length(o) so_o from fn_dien_form_cho_duyet('7', false) limit 3`)
ok(cho.length === 3, `fn_dien_form_cho_duyet khối 7 → ${cho.map((r) => r.ma + '(' + r.so_o + 'ô)').join(', ')}`)
// chấm thuần
const ch = await q(`select * from fn_dien_cham('["A","B","C"]'::jsonb, '[0,1,2]'::jsonb) union all select * from fn_dien_cham('["A","B","C"]'::jsonb, '[0,1,0]'::jsonb) union all select * from fn_dien_cham('["A","B","C"]'::jsonb, '[1,0,0]'::jsonb) union all select * from fn_dien_cham('["A","B","C","D","A"]'::jsonb, '[0,0,0,0,0]'::jsonb)`)
// "sai QUÁ 60%" = đúng < 40% ⇒ S; đúng đúng 40% (2/5) vẫn là C
ok(ch.map((r) => r.verdict).join(',') === 'correct,partial,wrong,partial', `fn_dien_cham: ${ch.map((r) => r.verdict + '@' + r.ti_le).join(' ')}  (3/3 Đ · 2/3 C · 0/3 S · 2/5=40% → ${ch[3].verdict})`)
const ns = (await q(`select id from nhan_su order by created_at limit 1`))[0].id
const hs = (await q(`select tk.id tk_id, hs.id hs_id, hs.ho_ten from tai_khoan tk join hoc_sinh hs on hs.id = tk.hoc_sinh_id join hoc_sinh_lop hl on hl.hoc_sinh_id = hs.id and hl.trang_thai='dang_hoc' join lop l on l.id = hl.lop_id and l.mon='Toán' and l.khoi='7' limit 1`))[0]
await c.query('begin')
try {
  // duyệt 3 form
  for (const r of cho) await q(`select fn_dien_form_duyet($1, $2, null)`, [r.id, ns])
  ok((await q(`select count(*)::int n from hinh_form_dien where da_duyet`))[0].n === 3, 'duyệt 3 form')
  await c.query('savepoint s1')
  try { await q(`select fn_dien_form_duyet($1, $2, null)`, [cho[0].id, ns]); ok(false, 'duyệt lần 2 phải bị chặn') } catch (e) { ok(true, 'chặn duyệt lần 2: ' + e.message.slice(0, 40)); await c.query('rollback to savepoint s1') }
  // từ chối 1 form khác
  const kh = (await q(`select id from hinh_form_dien where not da_duyet and xoa_at is null limit 1`))[0].id
  await q(`select fn_dien_form_tu_choi($1, $2, 'ô 2 chọn sai bước')`, [kh, ns])
  ok((await q(`select xoa_at is not null x from hinh_form_dien where id = $1`, [kh]))[0].x, 'từ chối → kho rác')
  // HS sinh lượt
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: hs.tk_id, role: 'authenticated' })])
  const s = (await q(`select tu_luyen_dien_sinh('Toán', 3) j`))[0].j
  ok(s.so_cau === 3, `tu_luyen_dien_sinh → ${s.so_cau} bài (HS ${hs.ho_ten})`)
  const caus = await q(`select id, ma_cau, loai_cau, dap_an_key, dien, o_rule from bai_test_cau where bai_test_id = $1 order by thu_tu`, [s.bai_test_id])
  const c0 = caus[0]
  ok(caus.every((x) => x.loai_cau === 'dien_o' && x.dien?.buoc && x.dien?.o), 'snapshot loai_cau=dien_o có dien.buoc/o')
  const keyLo = caus.some((x) => x.dien.o.some((o) => o.dap_an || o.key || o.phuong_an.some((p) => typeof p === 'object')))
  ok(!keyLo, 'bản HS không có dap_an/key/dung trong dien.o')
  const boxed = caus.every((x) => x.dien.o.every((o) => x.dien.buoc[o.buoc - 1].text.includes('⟦' + o.id + '⟧')))
  ok(boxed, 'mỗi ô có ⟦oN⟧ trong đúng bước (key đã cắt)')
  console.log('   ví dụ bước có ô:', c0.dien.buoc.find((b) => b.text.includes('⟦'))?.text.slice(0, 110))
  console.log('   phương án ô 1:', JSON.stringify(c0.dien.o[0].phuong_an).slice(0, 160), '| key:', JSON.stringify(c0.dap_an_key))
  // bài làm + trả lời: đúng hết / sai hết / 1 đúng
  const bl = (await q(`insert into bai_lam (bai_test_id, hoc_sinh_id, bien_the) values ($1, $2, 1) returning id`, [s.bai_test_id, hs.hs_id]))[0].id
  const dungHet = c0.dap_an_key.map((k) => 'ABCD'.indexOf(k))
  const r1 = (await q(`select hs_dien_tra_loi($1, $2, $3::jsonb) j`, [bl, c0.id, JSON.stringify(dungHet)]))[0].j
  ok(r1.verdict === 'correct', `trả lời đúng hết → ${r1.verdict} (${r1.ti_le})`)
  const saiHet = c0.dap_an_key.map((k) => ('ABCD'.indexOf(k) + 1) % 4)
  const r2 = (await q(`select hs_dien_tra_loi($1, $2, $3::jsonb) j`, [bl, c0.id, JSON.stringify(saiHet)]))[0].j
  ok(r2.verdict === 'wrong', `trả lời sai hết → ${r2.verdict}`)
  const blc = (await q(`select verdict, diem, dap_an_hs from bai_lam_cau where bai_lam_id = $1 and bai_test_cau_id = $2`, [bl, c0.id]))[0]
  ok(blc.verdict === 'wrong' && Number(blc.diem) === 0, `bai_lam_cau upsert: verdict=${blc.verdict} diem=${blc.diem}`)
  await c.query(`select set_config('request.jwt.claims', '', true)`)
  const loi = await q(`select o_thu, loi_ma from v_dien_loi_hs where hoc_sinh_id = $1 order by o_thu`, [hs.hs_id])
  ok(loi.length === c0.dap_an_key.length && loi.every((l) => /^E0\d$/.test(l.loi_ma)), `v_dien_loi_hs: ${loi.map((l) => l.o_thu + ':' + l.loi_ma).join(' ')}`)
  // thu hồi khi lời giải đổi
  const f = (await q(`select id, cach_giai_id, bien_the_id from hinh_form_dien where da_duyet limit 1`))[0]
  if (f.cach_giai_id) await q(`update hinh_cach_giai set loi_giai = loi_giai || ' ' where id = $1`, [f.cach_giai_id])
  else await q(`update hinh_baitoan_bien_the set loi_giai = loi_giai || ' ' where id = $1`, [f.bien_the_id])
  ok((await q(`select xoa_at is not null x, tu_choi_ly_do from hinh_form_dien where id = $1`, [f.id]))[0].x, 'lời giải đổi → form tự thu hồi')
} catch (e) { console.error('✖ LỖI:', e.message) }
await c.query('rollback')
console.log('rollback — form đã duyệt thật:', (await q(`select count(*)::int n from hinh_form_dien where da_duyet`))[0].n, '(phải 0)')
await c.end()
