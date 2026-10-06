// Chạy thử mig 202610061915 (nhiệm vụ mới + ĐHT + vòng quay mới) trong 1 transaction rồi ROLLBACK — dữ liệu giả, không ghi gì.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const ok = (cond, msg) => console.log((cond ? '  ✔ ' : '  ✖ ') + msg)
const YM = '2026-10'
let em, lop, seq = 0
// 1 lượt Luyện dạng yếu giả: ngày d (YYYY-MM-DD), giờ h, số đúng / 10 câu
async function luot(d, h, dung, { luyen = true, giay = 40 } = {}) {
  const nop = `${d} ${String(h).padStart(2, '0')}:${String(30 + (seq++ % 20)).padStart(2, '0')}:00+07`
  const bt = (await q(`insert into bai_test (lop_id, ngay, loai, mon, hoc_sinh_id, so_cau, luyen_yeu) values ($1,$2,'tu_luyen','Toán',$3,10,$4) returning id`, [lop, d, em, luyen]))[0].id
  const bl = (await q(`insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at, nop_at) values ($1,$2,'da_nop',$3::timestamptz - ($4 * 10) * interval '1 second', $3) returning id`, [bt, em, nop, giay]))[0].id
  for (let i = 0; i < 10; i++) {
    const tc = (await q(`insert into bai_test_cau (bai_test_id, thu_tu, loai_cau) values ($1,$2,'tn') returning id`, [bt, i + 1]))[0].id
    await q(`insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, verdict, cham_at) values ($1,$2,$3,$4::timestamptz - interval '1 second')`, [bl, tc, i < dung ? 'correct' : 'wrong', nop])
  }
}
try {
  await c.query('begin'); await c.query("set local statement_timeout = '600s'")
  await c.query(fs.readFileSync('supabase/migrations/202610061915_nhiem_vu_moi_dht_vong_quay_moi.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const tk = (await q(`select tk.id as uid, tk.hoc_sinh_id, hl.lop_id from tai_khoan tk join hoc_sinh_lop hl on hl.hoc_sinh_id = tk.hoc_sinh_id and hl.trang_thai='dang_hoc'
                       join lop l on l.id = hl.lop_id and l.mon='Toán' where tk.hoc_sinh_id is not null
                       and not exists (select 1 from may_man_hs_luot m where m.hoc_sinh_id = tk.hoc_sinh_id and m.ngay = (now() at time zone 'Asia/Ho_Chi_Minh')::date) limit 1`))[0]
  em = tk.hoc_sinh_id; lop = tk.lop_id
  const hom = (await q(`select (now() at time zone 'Asia/Ho_Chi_Minh')::date::text d`))[0].d
  console.log('HS thử:', em, '· hôm nay', hom)
  // đẩy ngày bắt đầu lùi để thử tuần/tháng; M1 hạ còn 3 ngày
  await c.query(`update nhiem_vu_cau_hinh set bat_dau = '2026-10-01', m1_ngay = 3 where mon = 'Toán'`)

  // ngày 1–3: mỗi ngày 5 lượt đạt (đúng 8/10) → cắt còn 4; ngày 4–5: 1 lượt đạt; ngày 5 thêm 1 lượt 6/10 (học thật nhưng KHÔNG đạt 70%) + 1 lượt không phải luyện yếu
  for (const d of ['2026-10-01', '2026-10-02', '2026-10-03']) for (let i = 0; i < 5; i++) await luot(d, 9 + i, 8)
  await luot('2026-10-04', 9, 7); await luot('2026-10-05', 9, 10)
  await luot('2026-10-05', 10, 6); await luot('2026-10-05', 11, 9, { luyen: false }); await luot('2026-10-05', 12, 9, { giay: 2 })
  const r = await q(`select ma, tang, xong_ngay::text, so from public.fn_nhiem_vu_hoan_thanh('Toán', $1, array[$2::uuid]) order by xong_ngay, ma`, [YM, em])
  console.table(r)
  const N = r.filter(x => x.ma === 'N')
  ok(N.length === 5 && N.slice(0, 3).every(x => x.so === 4) && N[3].so === 1 && N[4].so === 1, 'N: 4/4/4/1/1 lượt (cắt tối đa 4/ngày; 6/10, không-luyện-yếu, quá nhanh bị loại)')
  ok(r.some(x => x.ma === 'W1' && x.xong_ngay === '2026-10-05'), 'W1 (5 ngày khác nhau) xong ngày 05')
  ok(r.some(x => x.ma === 'W2' && x.xong_ngay === '2026-10-03'), 'W2 (12 lượt trong tuần) xong ngày 03')
  ok(r.some(x => x.ma === 'M1' && x.xong_ngay === '2026-10-03'), 'M1 (hạ còn 3 ngày) xong ngày 03')
  const ch = (await q(`select * from public.fn_nhiem_vu_chang_thang('Toán', $1, array[$2::uuid])`, [YM, em]))[0]
  console.log('chang_thang:', ch)
  ok(ch.exp === 14 * 20 + 100 + 100 + 300 && ch.diem_chang === 14 * 20 + 50 + 50 + 200, `EXP = 280+100+100+300 = 780 và ĐHT = 280+50+50+200 = 580 (có ${ch.exp} / ${ch.diem_chang})`)
  // trần EXP nhiệm vụ
  await c.query(`update nhiem_vu_cau_hinh set tran_exp_nhiem_vu = 500 where mon = 'Toán'`)
  const ch2 = (await q(`select exp from public.fn_nhiem_vu_chang_thang('Toán', $1, array[$2::uuid])`, [YM, em]))[0]
  ok(ch2.exp === 500, `trần EXP nhiệm vụ cắt đúng (500 — có ${ch2.exp})`)
  await c.query(`update nhiem_vu_cau_hinh set tran_exp_nhiem_vu = 2000 where mon = 'Toán'`)

  const ea = (await q(`select * from public.fn_exp_app_thang($1, $2, 'Toán')`, [YM, em]))[0]
  console.log('exp_app:', ea)
  const xu = (await q(`select public.fn_xu_tu_exp(780) x`))[0].x
  ok(Number(xu) === 8, `780 EXP → ${xu} xu (ceil 1 lần)`)

  // ---- phía HS (JWT) ----
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.uid, role: 'authenticated' })])
  const nv = (await q(`select public.fn_hs_nhiem_vu_cua_toi('Toán') j`))[0].j
  console.log(JSON.stringify(nv))
  ok(nv && nv.mo === true && nv.dht.so_du === 580 && nv.tuan_so === 1 && nv.ym === YM, 'fn_hs_nhiem_vu_cua_toi trả JSON đủ (ĐHT 580)')
  const dk = (await q(`select public.fn_may_man_hs_du_dieu_kien() j`))[0].j
  console.log('điều kiện quay:', dk)
  // hôm nay chưa có lượt đạt (dữ liệu giả nằm ngày 1–5) ⇒ KHÔNG được quay
  ok(dk.du === false && dk.che_do === 'nhiem_vu', 'hôm nay chưa có lượt đạt ⇒ chưa được quay')
  let loi = null; try { await c.query('savepoint a'); await q(`select public.fn_may_man_hs_quay()`) } catch (e) { loi = e.message; await c.query('rollback to savepoint a') }
  ok(!!loi, 'quay khi chưa đủ điều kiện bị chặn: ' + loi)
  await luot(hom, 9, 8)
  const dk2 = (await q(`select public.fn_may_man_hs_du_dieu_kien() j`))[0].j
  ok(dk2.du === true && dk2.so_nv === 1, 'có 1 lượt đạt hôm nay ⇒ được quay')
  const kq = (await q(`select public.fn_may_man_hs_quay() j`))[0].j
  console.log('quay:', kq)
  ok([10, 20, 30, 50, 100, 200].includes(kq.exp), 'giải trong bảng mới: ' + kq.exp)
  let loi2 = null; try { await c.query('savepoint b'); await q(`select public.fn_may_man_hs_quay()`) } catch (e) { loi2 = e.message; await c.query('rollback to savepoint b') }
  ok(!!loi2, 'quay lần 2 trong ngày bị chặn')
  // thống kê 2000 lượt quay giả để xem phân phối (chỉ đọc cấu hình)
  const ph = await q(`select gia_tri, ma from may_man_hs_cau_hinh where ma like 'nv_ti_le_%' order by ma`)
  console.log('bảng giải:', ph.map(x => x.ma.replace('nv_ti_le_', '') + '=' + x.gia_tri).join(' · '), '· tổng', ph.reduce((a, x) => a + Number(x.gia_tri), 0))

  // ---- ĐHT tiêu ----
  const d0 = (await q(`select public.fn_dht_cua_toi() j`))[0].j
  const d1 = (await q(`select public.fn_dht_tieu(100, 'nong_trai', 'thu') j`))[0].j
  ok(d1.so_du === d0.so_du - 100, `tiêu 100 ĐHT: ${d0.so_du} → ${d1.so_du}`)
  let loi3 = null; try { await c.query('savepoint c'); await q(`select public.fn_dht_tieu(999999, 'nong_trai')`) } catch (e) { loi3 = e.message; await c.query('rollback to savepoint c') }
  ok(!!loi3, 'tiêu quá số dư bị chặn: ' + loi3)
  // trần số dư 6.000: hạ trần còn 600 để thấy phần vượt bị mất
  await c.query(`update nhiem_vu_cau_hinh set dht_so_du_max = 400`)
  const d2 = (await q(`select public.fn_dht_cua_toi() j`))[0].j
  console.log('trần 400:', d2)
  ok(d2.so_du <= 400 && d2.mat_do_vuot_tran > 0, 'trần số dư kẹp đúng, báo phần mất do vượt trần')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
