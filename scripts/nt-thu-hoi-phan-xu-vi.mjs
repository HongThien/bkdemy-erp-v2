// Thu hồi phân bón — BƯỚC 3: trừ xu ví thật (Thùy 07/11: "EXP phân bón chắc chắn đã quy ra xu thật trong ví → trừ luôn").
// D = max(0, nt_xu.da_nhan tháng này − thang.ra hiện tại của game): xu đã vào ví mà game không còn đỡ.
// Ghi qlht_xu_ledger loai 'nong_trai' số ÂM, hạ nt_xu.da_nhan đúng D (để lần đồng bộ sau không trả lại), gửi tin cho em bị trừ.
// KHÔNG xử lý xu các tháng trước (state game không cho biết). Mặc định CHẠY THỬ; ghi thật với --ghi.
import pg from 'pg'
import fs from 'fs'

const GHI = process.argv.includes('--ghi')
const REF = 'nt_phan:20261107:vi'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
  .map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()

try {
  await c.query('begin')
  const { ym, k } = (await c.query(`select to_char(now() at time zone 'Asia/Ho_Chi_Minh','YYYY-MM') ym,
    extract(year from now() at time zone 'Asia/Ho_Chi_Minh')::int*12 + extract(month from now() at time zone 'Asia/Ho_Chi_Minh')::int - 1 k`)).rows[0]
  const rows = (await c.query(`select t.hoc_sinh_id id, h.ma_hs, l.state->'thang' thang,
      coalesce((select da_nhan from nt_xu x where x.hoc_sinh_id = t.hoc_sinh_id and x.thang = $1), 0) da_nhan,
      (select coalesce(sum(amount),0)::int from qlht_xu_ledger q where q.hoc_sinh_id = t.hoc_sinh_id) so_du_vi
    from nt_thu_hoi_phan t join hoc_sinh h on h.id = t.hoc_sinh_id join nt_luu l on l.hoc_sinh_id = t.hoc_sinh_id
    where not t.xu_vi_xong order by h.ma_hs for update of t`, [ym])).rows
  const bang = []
  for (const r of rows) {
    const ra = r.thang && Number(r.thang.k) === k ? Number(r.thang.ra || 0) : 0
    const D = Math.max(0, r.da_nhan - ra)
    if (D > 0) {
      await c.query(`insert into qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, thang) values ($1,$2,'nong_trai',$3,$4)`,
        [r.id, -D, 'Thu hồi xu bán phân bón (lỗi game)', ym])
      await c.query(`update nt_xu set da_nhan = greatest(1, da_nhan - $2), cap_nhat = now() where hoc_sinh_id = $1 and thang = $3`, [r.id, D, ym])
      await c.query(`insert into hs_tin_moi (hoc_sinh_id, loai, tieu_de, noi_dung, bieu_tuong, ref) values ($1,'nong_trai',$2,$3,'🌱',$4)`,
        [r.id, 'Nông Trại: trừ xu từ phân bón', `Bổ sung thông báo trước: do EXP bán phân bón (lỗi game) đã đổi ra xu trong ví của em, hệ thống đã trừ ${D} xu khỏi ví để hoàn tất việc thu hồi. Cảm ơn em đã thông cảm!`, REF])
    }
    await c.query(`update nt_thu_hoi_phan set xu_vi_tru = $2, xu_vi_xong = true where hoc_sinh_id = $1`, [r.id, D])
    if (D > 0) bang.push({ ma: r.ma_hs, da_nhan: r.da_nhan, ra_game: ra, tru: D, vi_truoc: r.so_du_vi, vi_sau: r.so_du_vi - D })
  }
  console.table(bang)
  console.log(`Em bị trừ: ${bang.length} · tổng xu: ${bang.reduce((a, x) => a + x.tru, 0)} · em ví âm sau trừ: ${bang.filter(x => x.vi_sau < 0).length}`)
  if (GHI) { await c.query('commit'); console.log('✅ ĐÃ GHI THẬT') } else { await c.query('rollback'); console.log('↩ CHẠY THỬ — đã ROLLBACK') }
} catch (e) {
  await c.query('rollback').catch(() => {})
  console.error('❌', e.message)
  process.exitCode = 1
} finally { await c.end() }
