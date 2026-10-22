// Duyệt hàng loạt đề thi Toán khối 12 chưa duyệt — Thùy 22/10: "auto duyệt toàn bộ đề của lớp 12, mấy đề này giải chi tiết rồi nên chắc chắn ok".
// Mỗi đề 1 transaction, gọi đúng fn_de_thi_duyet (đề còn câu thiếu đáp án / phương án ⇒ hàm chặn ⇒ bỏ qua, liệt kê).
//   node scripts/_duyet_de_k12.mjs          → chỉ đếm (không ghi)
//   node scripts/_duyet_de_k12.mjs --ghi    → duyệt thật (tài khoản admin hệ thống, theo lệnh Thùy)
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const GHI = process.argv.includes('--ghi')
const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
const des = await q(`select id, ten from tai_lieu where loai = 'de_thi' and khoi = '12' and mon = 'Toán' and duyet_at is null order by created_at`)
let ok = 0, cau = 0, choDang = 0; const chan = []
for (const d of des) {
  await q('begin')
  try {
    await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
    const [{ v }] = await q(`select fn_de_thi_thieu($1) v`, [d.id])
    if (Number(v.so_chan) > 0) { chan.push({ ten: d.ten, so_chan: Number(v.so_chan), tong: Number(v.tong) }); await q('rollback'); continue }
    if (GHI) {
      const [{ r }] = await q(`select fn_de_thi_duyet($1) r`, [d.id])
      cau += r.so_cau; choDang += r.so_cau_cho_dang
      await q('commit')
    } else await q('rollback')
    ok++
  } catch (e) { await q('rollback'); chan.push({ ten: d.ten, loi: e.message }) }
}
console.log(`${des.length} đề chưa duyệt · ${GHI ? 'ĐÃ DUYỆT' : 'duyệt được'} ${ok}${GHI ? ` (${cau} câu, ${choDang} câu còn chờ phân dạng)` : ''} · không duyệt được ${chan.length}`)
for (const x of chan) console.log('  ✘', x.ten.slice(0, 90), x.so_chan ? `— ${x.so_chan}/${x.tong} câu thiếu đáp án/phương án` : `— ${x.loi}`)
await c.end()
