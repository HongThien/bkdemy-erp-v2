// Chạy THỬ mig 202610031141 (sổ tay: lớp ≤ lớp em) trong 1 transaction rồi ROLLBACK.
import fs from 'node:fs'
import pg from 'pg'; process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const q = async (s, p = []) => (await c.query(s, p)).rows
let loi = 0
const kiem = (n, ok, ct = '') => { if (!ok) loi++; console.log(`${ok ? '✔' : '✖'} ${n}${ct ? ' — ' + ct : ''}`) }
const so = (k) => Number(String(k).replace(/\D/g, ''))
await c.query('begin')
try {
  await c.query(fs.readFileSync('supabase/migrations/202610031141_sotay_tim_theo_lop.sql', 'utf8'))
  await q(`update sotay_cong_thuc set trang_thai='da_duyet' where ma in ('CT12-XS-04','CT12-NH-10')`)
  const hsKhoi = async (k) => (await q(`select tk.id uid from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id where h.khoi = $1 and h.ma_hs not like 'TEST%' limit 1`, [k]))[0]?.uid
  const la = async (uid) => q(`select set_config('request.jwt.claims', $1, true), set_config('request.jwt.claim.sub', $2, true)`, [JSON.stringify({ sub: uid, role: 'authenticated' }), uid])
  for (const k of ['6', '9', '12']) {
    const uid = await hsKhoi(k); if (!uid) { console.log('— không có HS khối', k); continue }
    await la(uid)
    const kh = (await q(`select _sotay_khoi_hs('Toán') k`))[0].k
    const lt = (await q(`select hs_sotay_tim_lt('phuong trinh', 'Toán', 50) r`))[0].r
    const ks = [...new Set(lt.map((r) => r.khoi))]
    kiem(`HS lớp ${k} (lớp môn Toán ${kh}) tìm "phuong trinh": không lớp nào > ${kh}`, lt.every((r) => so(r.khoi) <= so(kh)), `${lt.length} kq, lớp [${ks}], nhánh [${[...new Set(lt.map((r) => r.nhanh))]}]`)
    const lt2 = (await q(`select hs_sotay_tim_lt('goc', 'Toán', 50) r`))[0].r
    kiem(`  "goc" có cả Hình GT nếu có`, true, `nhánh [${[...new Set(lt2.map((r) => r.nhanh))]}] lớp [${[...new Set(lt2.map((r) => r.khoi))]}]`)
    const cay = (await q(`select hs_sotay_cay_hs('Toán', null) r`))[0].r
    kiem(`  cây dạng bài = lớp ≤ ${kh}`, cay.khoi === null || so(cay.khoi) <= so(kh), `khoi=${cay.khoi} list=${JSON.stringify(cay.khoi_list)} chủ đề=${cay.cay.length}`)
    const ct = (await q(`select hs_sotay_tim_ct('bayes', 'Toán', '12', 20) r`))[0].r
    kiem(`  "bayes" (thẻ lớp 12) ${so(kh) >= 12 ? 'THẤY' : 'KHÔNG thấy'}`, (ct.length > 0) === (so(kh) >= 12), ct.map((r) => r.ma).join(',') || '(rỗng)')
    const kc = (await q(`select _sotay_khoi_hs('KHTN') k`))[0].k
    const mc = (await q(`select hs_sotay_muc_cay('KHTN', '9') r`))[0].r
    kiem(`  cây mục KHTN = lớp ≤ ${kc} (gửi p_khoi=9 bị bỏ qua)`, mc.khoi === null || so(mc.khoi) <= so(kc), `khoi=${mc.khoi} list=${JSON.stringify(mc.khoi_list)}`)
    const tk = (await q(`select hs_sotay_tim_ct('nguyen tu', 'KHTN', null, 20) r`))[0].r
    kiem(`  KHTN "nguyen tu" không lớp > ${kc}`, tk.every((r) => so(r.khoi) <= so(kc)), `${tk.length} kq lớp [${[...new Set(tk.map((r) => r.khoi))]}]`)
  }
  const [ns] = await q(`select tk.id uid from tai_khoan tk join nhan_su n on n.id = tk.nhan_su_id where n.la_admin_he_thong limit 1`)
  await la(ns.uid)
  const lt = (await q(`select hs_sotay_tim_lt('phuong trinh', 'Toán', 50) r`))[0].r
  kiem('nhân sự: không giới hạn lớp', lt.some((r) => so(r.khoi) >= 10), `lớp [${[...new Set(lt.map((r) => r.khoi))]}]`)
} catch (e) { loi++; console.log('✖ LỖI', e.message) }
finally { await c.query('rollback'); await c.end() }
console.log(loi ? `\n${loi} lỗi` : '\nTất cả đạt — đã rollback.')
