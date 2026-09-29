// Kiểm mig 202609291122: hoàn tất ca 📱 app bỏ qua tick gửi lên (dạng đã học = dữ liệu), ca 📄 giấy dùng tick TA. Mọi thứ ROLLBACK.
// Dùng: node scripts/_verify_btyeu_hoan_tat_du_lieu.mjs [--da-ap]
import fs from 'fs'
import pg from 'pg'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (sql, p = []) => (await c.query(sql, p)).rows
const admin = (await q(`select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where ns.la_admin_he_thong limit 1`))[0]
const as = () => c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: admin.id, role: 'authenticated' })])
const trangThai = async (buoi, cs) => ({
  case: (await q(`select trang_thai, ket_qua from bo_tro_yeu where id = $1`, [cs]))[0],
  day_buoi_nay: (await q(`select coalesce(array_agg(ma_dang order by ma_dang), '{}') v from bo_tro_yeu_dang where bo_tro_yeu_id = $1 and day_buoi_id = $2`, [cs, buoi]))[0].v,
  con_day: Number((await q(`select count(*) n from bo_tro_yeu_dang where bo_tro_yeu_id = $1 and dong_at is null and (day_at is null or dat = false)`, [cs]))[0].n),
})
try {
  await c.query('begin'); await as()
  if (!process.argv.includes('--da-ap')) await c.query(fs.readFileSync('supabase/migrations/202609291122_btyeu_hoan_tat_dang_tu_du_lieu.sql', 'utf8'))
  await as()
  // Ca đang mở, có mặt. Lấy: che_do, dạng có làm câu trong ca, mọi dạng còn mở của case.
  const ca = await q(`select b.id buoi, hh.bo_tro_yeu_id cs, hh.btyeu_che_do che_do,
      (select coalesce(array_agg(distinct t.ma_dang), '{}') from public._btyeu_tien_do(b.id) t where t.so_cau > 0) luyen,
      (select coalesce(array_agg(d.ma_dang), '{}') from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.dong_at is null) mo
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
    where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.diem_danh = 'co_mat'`)
  console.log('Ca đang mở có mặt:', ca.map((x) => `${x.che_do ?? 'null'} luyện ${x.luyen.length}/${x.mo.length} dạng mở`).join(' · '))
  // (1) ca KHÔNG phải giấy, còn dạng chưa luyện ⇒ gửi tick HẾT (như app TA cũ) ⇒ DB phải bỏ qua, case còn mở
  const mau1 = ca.find((x) => x.che_do !== 'giay' && x.mo.length > x.luyen.length)
  // (2) giả lập ca 📄 giấy: đổi che_do = 'giay' rồi tick 1 dạng ⇒ DB dùng đúng tick đó
  const mau2 = ca.find((x) => x.mo.length > 1 && x !== mau1) ?? mau1
  for (const [nhan, x, giay, tick] of [['(1) 📱/chưa chọn, app TA cũ tick HẾT', mau1, false, mau1?.mo], ['(2) 📄 giấy, TA tick 1 dạng', mau2, true, mau2?.mo.slice(0, 1)]]) {
    if (!x) { console.log(nhan, ': không có ca mẫu'); continue }
    await c.query('savepoint sp')
    try {
      if (giay) await q(`update buoi_hoc_hs set btyeu_che_do = 'giay' where buoi_hoc_id = $1 and bo_tro_yeu_id is not null`, [x.buoi])
      await q(`select public.fn_btyeu_hoan_tat($1, 'thử', null, 'thử (rollback)', $2)`, [x.buoi, tick])
      console.log(nhan, `: gửi ${tick.length} dạng, luyện thật ${x.luyen.length} ⇒`, JSON.stringify(await trangThai(x.buoi, x.cs)))
    } catch (e) { console.log(nhan, ': LỖI', e.message) }
    await c.query('rollback to savepoint sp')
  }
} finally {
  await c.query('rollback'); await c.end()
}
