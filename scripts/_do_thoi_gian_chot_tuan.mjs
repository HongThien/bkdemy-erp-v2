// ĐO THỜI GIAN "Chốt tuần" — kịch bản XẤU NHẤT: cache dạng yếu hết hạn, làm mới từng khối y như app (lô 10 em/lệnh), mỗi lệnh chịu TRẦN 8 s
// của role authenticated (PostgREST). Mỗi KHỐI là 1 transaction riêng rồi ROLLBACK (không để lại dòng nào, giữ khoá hàng dang_yeu_hien_tai chỉ vài giây —
// bản đầu giữ cả ~70 s có thể chặn người dùng thật đang làm mới/chốt, chính nó gây "statement timeout"). Lỗi "statement timeout" khi Chốt tuần (Thùy 06/11)
// từng sinh từ _do_o_bdm quét 9.566 câu anh em — chạy lại sau mỗi lần đụng mastery/_do_o_bdm/fn_qlcl_lam_moi hoặc khi dữ liệu lớn lên:
//   node scripts/_do_thoi_gian_chot_tuan.mjs [Toán]
// Thoát mã 1 nếu có lệnh vượt trần hoặc chậm hơn NGUONG_MS (mặc định 6000 — chừa biên so với 8 s). Nên chạy ngoài giờ cao điểm.
import fs from 'fs'
import pg from 'pg'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).trim()] }))
const MON = process.argv[2] || 'Toán'
const NGUONG_MS = Number(process.env.NGUONG_MS || 6000)
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (sql, p = []) => (await c.query(sql, p)).rows
let xau = 0, tong = 0
try {
  const adm = (await q("select tk.id, tk.email from tai_khoan tk where tk.nhan_su_id is not null and tk.email ilike '%admin%' limit 1"))[0]
  const khois = (await q("select distinct khoi from lop where mon = $1 and trang_thai = 'dang_hoc' order by 1", [MON])).map((r) => r.khoi)
  for (const k of khois) {
    await c.query('begin')
    let con = 1, v = 0, max = 0, truoc = Infinity, dung = 0
    try {
      await c.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: adm.id, email: adm.email, role: 'authenticated' })])
      await c.query("set local lock_timeout = '3s'")
      await c.query('delete from dang_yeu_hien_tai d using public._qlcl_hs_cua_o($1, $2) h where d.mon = $1 and d.hoc_sinh_id = h.hoc_sinh_id', [MON, k])
      while (con > 0 && v < 100 && dung < 3) {
        await c.query('savepoint sp'); await c.query("set local statement_timeout = '8s'")
        const t0 = Date.now()
        try { con = Number((await q('select public.fn_qlcl_lam_moi($1,$2,10) n', [MON, k]))[0].n) }
        catch (e) { console.log(`  ✗ khối ${k}: ${e.message} (sau ${Date.now() - t0} ms)`); xau++; await c.query('rollback to sp'); break }
        const ms = Date.now() - t0; max = Math.max(max, ms); tong += ms; v++
        dung = con >= truoc ? dung + 1 : 0; truoc = con // lượt chấm mới đổ vào giữa chừng thì 1 em luôn "cũ" — không phải lỗi hệ thống
      }
    } catch (e) { console.log(`  ✗ khối ${k}: ${e.message}`); xau++ }
    finally { await c.query('rollback').catch(() => {}) }
    const co = max > NGUONG_MS ? '✗ CHẬM' : '✓'
    if (max > NGUONG_MS) xau++
    console.log(`  ${co} khối ${String(k).padEnd(3)} ${String(v).padStart(2)} lệnh · chậm nhất ${String(max).padStart(5)} ms${con > 0 ? ` · còn cũ ${con} (không giảm — có lượt chấm mới đổ vào lúc đo, bỏ qua)` : ''}`)
  }
  console.log(`\n${MON}: ${khois.length} khối · tổng ${(tong / 1000).toFixed(1)} s · ${xau ? `${xau} VẤN ĐỀ (trần 8 s, ngưỡng ${NGUONG_MS} ms)` : 'ổn — mọi lệnh dưới ngưỡng'}`)
} finally {
  await c.end()
}
process.exit(xau ? 1 : 0)
