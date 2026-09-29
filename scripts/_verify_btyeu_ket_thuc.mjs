// Kiểm mig 202609291055 (bổ trợ yếu KẾT THÚC khi hết dạng + TA đóng ca): chạy trong 1 transaction → đo → ROLLBACK.
// Dùng: node scripts/_verify_btyeu_ket_thuc.mjs [--da-ap]  (--da-ap: migration đã áp thật — chỉ đo + giả lập hoàn tất, vẫn ROLLBACK)
import fs from 'fs'
import pg from 'pg'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
c.on('notice', (m) => console.log('NOTICE:', m.message))
const DA_AP = process.argv.includes('--da-ap')
const q = async (sql, p = []) => (await c.query(sql, p)).rows
const admin = (await q(`select tk.id, tk.nhan_su_id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where ns.la_admin_he_thong limit 1`))[0]
const as = () => c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: admin.id, role: 'authenticated' })])
const buocDem = async () => { const tt = (await q(`select public.fn_btyeu_trang_thai_ca(60) v`))[0].v; const m = {}; for (const x of tt) m[x.buoc] = (m[x.buoc] ?? 0) + 1; return m }
const ketQua = async () => Object.fromEntries((await q(`select coalesce(ket_qua, '-') k, count(*)::int n from bo_tro_yeu where trang_thai = 'hoan_thanh' group by 1`)).map((r) => [r.k, r.n]))

try {
  await c.query('begin'); await as()
  console.log('TRƯỚC  buoc:', await buocDem(), '· hoàn thành theo kết quả:', await ketQua())
  if (!DA_AP) await c.query(fs.readFileSync('supabase/migrations/202609291055_btyeu_ket_thuc_khi_het_dang.sql', 'utf8'))
  await as()
  console.log('SAU    buoc:', await buocDem(), '· hoàn thành theo kết quả:', await ketQua())
  const mau = await q(`select y.id, hs.ho_ten, y.hoan_thanh_at, y.ghi_chu_dong, ns.ho_ten as dong_boi,
      (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null) as dang_chua_dong
    from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id left join nhan_su ns on ns.id = y.dong_boi where y.ket_qua = 'day_xong' order by y.hoan_thanh_at desc limit 3`)
  console.log('Mẫu case day_xong:', mau)
  const xl = (await q(`select public.fn_btyeu_case_xep_lich(null) v`))[0].v
  const gd = {}; for (const x of xl) gd[`${x.trang_thai}/${x.giai_doan}`] = (gd[`${x.trang_thai}/${x.giai_doan}`] ?? 0) + 1
  console.log('Xếp giai_doan:', gd)

  // Giả lập TA hoàn tất: (a) ca có mặt, case hết dạng cần dạy ⇒ phải đóng; (b) ca có mặt, case còn dạng, không tick dạng nào ⇒ còn mở.
  const ca = await q(`select b.id buoi, hh.bo_tro_yeu_id cs,
      (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)) can_day,
      (select coalesce(array_agg(d.ma_dang), '{}') from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.dong_at is null) dangs
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
    where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.diem_danh = 'co_mat' order by 3`)
  const a = ca.find((x) => Number(x.can_day) === 0), bb = ca.find((x) => Number(x.can_day) > 0)
  for (const [nhan, x, dangDay] of [['(a) hết dạng', a, null], ['(b) còn dạng, không tick', bb, []]]) {
    if (!x) { console.log(nhan, ': không có ca mẫu'); continue }
    await c.query('savepoint sp')
    try {
      await q(`select public.fn_btyeu_hoan_tat($1, 'thử', null, 'thử (rollback)', $2)`, [x.buoi, dangDay ?? x.dangs])
      const v = (await q(`select public.fn_btyeu_ca_ta($1) v`, [x.buoi]))[0].v
      console.log(nhan, `: can_day trước ${x.can_day} ⇒ case ${v.case_trang_thai}/${v.case_ket_qua ?? '-'} · còn dạy ${v.so_dang_con_day}`)
    } catch (e) { console.log(nhan, ': LỖI', e.message) }
    await c.query('rollback to savepoint sp')
  }
} finally {
  await c.query('rollback'); await c.end()
}
