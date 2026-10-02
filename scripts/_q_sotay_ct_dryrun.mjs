// Chạy THỬ 2 migration sổ tay công thức trong 1 transaction rồi ROLLBACK — không để lại gì trên DB.
// node scripts/_q_sotay_ct_dryrun.mjs [ma_hs]
import fs from 'node:fs'
import pg from 'pg'; process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const q = async (sql, p = []) => (await c.query(sql, p)).rows
const FILES = ['202610030214_sotay_cong_thuc.sql', '202610030215_sotay_cong_thuc_seed_toan12.sql']
const ma = process.argv[2] ?? 'HS0557'
let loi = 0
const kiem = (nhan, dat, ct = '') => { if (!dat) loi++; console.log(`${dat ? '✔' : '✖'} ${nhan}${ct ? ' — ' + ct : ''}`) }
await c.query('begin')
try {
  for (const f of FILES) await c.query(fs.readFileSync(`supabase/migrations/${f}`, 'utf8'))
  kiem('77 thẻ nạp', (await q('select count(*)::int n from sotay_cong_thuc'))[0].n === 77)
  kiem('77 dòng nhật ký "tao"', (await q(`select count(*)::int n from sotay_ct_lich_su where hanh_dong='tao'`))[0].n === 77)
  await q(`update sotay_cong_thuc set trang_thai='da_duyet' where ma in ('CT12-XS-04','CT12-OX-16','CT12-NH-10','CT12-TK-02')`)
  kiem('duyệt 4 thẻ', (await q(`select count(*)::int n from sotay_cong_thuc where trang_thai='da_duyet'`))[0].n === 4)
  await q(`update sotay_cong_thuc set noi_dung = noi_dung || ' ' where ma='CT12-OX-16'`)
  const [o] = await q(`select trang_thai from sotay_cong_thuc where ma='CT12-OX-16'`)
  kiem('sửa nội dung thẻ đã duyệt ⇒ về chờ duyệt', o.trang_thai === 'cho_duyet', o.trang_thai)
  const ls = await q(`select hanh_dong, ban_cu is not null co_ban_cu from sotay_ct_lich_su where ma_the='CT12-OX-16' order by id`)
  kiem('nhật ký OX-16 = tao, duyet, sua(+bản cũ)', ls.map((r) => r.hanh_dong).join(',') === 'tao,duyet,sua' && ls[2].co_ban_cu, ls.map((r) => r.hanh_dong).join(','))
  await c.query('savepoint s1')
  try { await q(`update sotay_cong_thuc set trang_thai='tra_ve' where ma='CT12-XS-01'`); kiem('trả về thiếu lý do bị chặn', false) }
  catch { await c.query('rollback to savepoint s1'); kiem('trả về thiếu lý do bị chặn', true) }
  const [moi] = await q(`insert into sotay_cong_thuc (ma, mon, khoi, chu_de, ten, noi_dung) values (null,'Toán','12','XS','Thử','$x$') returning ma, thu_tu`)
  kiem('thêm thẻ không mã ⇒ tự cấp', moi.ma === 'CT12-XS-06' && moi.thu_tu === 6, `${moi.ma} #${moi.thu_tu}`)

  // Gọi RPC dưới danh tính 1 HS thật (giả JWT, cùng transaction).
  const [hs] = await q(`select tk.id uid from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id where h.ma_hs = $1`, [ma])
  await q(`select set_config('request.jwt.claims', $1, true), set_config('request.jwt.claim.sub', $2, true)`, [JSON.stringify({ sub: hs.uid, role: 'authenticated' }), hs.uid])
  const tim = async (tu, khoi = '12') => (await q(`select hs_sotay_tim_ct($1, 'Toán', $2, 20) r`, [tu, khoi]))[0].r
  for (const [tu, kv] of [['bayes', ['CT12-XS-04']], ['bai et', ['CT12-XS-04']], ['the tich tron xoay', ['CT12-NH-10']], ['tứ phân vị', ['CT12-TK-02']],
    ['khoang cach', []], ['tron', ['CT12-NH-10']], ['b', []], ['xac suat', ['CT12-XS-04']]]) {
    const r = await tim(tu)
    kiem(`tìm "${tu}"`, JSON.stringify(r.map((x) => x.ma)) === JSON.stringify(kv), r.map((x) => `${x.ma}`).join(',') || '(rỗng)')
  }
  kiem('khối 11 không thấy thẻ khối 12', (await tim('bayes', '11')).length === 0)
  kiem('thẻ trả đủ nội dung', !!(await tim('bayes'))[0].noi_dung)
} catch (e) { loi++; console.log('✖ LỖI', e.message, e.where ?? '') }
finally { await c.query('rollback'); await c.end() }
console.log(loi ? `\n${loi} lỗi` : '\nTất cả đạt — đã rollback, DB không đổi.')
process.exit(loi ? 1 : 0)
