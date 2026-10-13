// Test mig 202610140141 (tạo mô hình / thêm bài / sửa bài) trong 1 transaction rồi ROLLBACK.
// Chạy: node scripts/_test_hl_cay_nhanh_tao_sua.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect()
const sql = readFileSync(new URL('../supabase/migrations/202610140141_hinh_cay_nhanh_tao_sua.sql', import.meta.url), 'utf8')
let ok = 0, bad = 0
const eq = (ten, got, want) => { const g = JSON.stringify(got), w = JSON.stringify(want); if (g === w) { ok++; console.log('  ✔', ten) } else { bad++; console.log('  ✘', ten, '\n     got ', g, '\n     want', w) } }
const q = async (s, p) => (await c.query(s, p)).rows
const loi = async (s, p) => { await c.query('savepoint s'); try { await c.query(s, p); await c.query('release savepoint s'); return null } catch (e) { await c.query('rollback to savepoint s'); return e.message } }
await c.query('BEGIN')
try {
  await c.query(sql)
  const goc = (await q(`select fn_hl_tao_mo_hinh('7', 'TEST mô hình', 'Cho tam giác ABC', null) id`))[0].id
  eq('mô hình mới: phan=luyen, là gốc, có mã MH', (await q(`select phan, la_goc_ho, la_mo_hinh, khoi, ma ~ '^MH\.' as ma_ok from hinh_mo_hinh where id=$1`, [goc]))[0],
    { phan: 'luyen', la_goc_ho: true, la_mo_hinh: true, khoi: '7', ma_ok: true })
  eq('thiếu tên ⇒ từ chối', /Chưa đặt tên/.test(await loi(`select fn_hl_tao_mo_hinh('7', ' ', 'x')`) || ''), true)

  const r1 = (await q(`select fn_hl_them_bai($1, 'Chứng minh A', null, 'Lời giải A') r`, [goc]))[0].r
  const r2 = (await q(`select fn_hl_them_bai($1, 'Chứng minh B', 'AB = 3', 'Lời giải B', null, $2::uuid[]) r`, [goc, [r1.bai_moi]]))[0].r
  const so = Object.fromEntries(r2.bai.map(b => [b.id, b.so]))
  eq('2 bài thân: 1.1, 1.2', [so[r1.bai_moi], so[r2.bai_moi]], ['1.1', '1.2'])
  const ma2 = r2.bai.find(b => b.id === r2.bai_moi).ma
  eq('mã bám mô hình gốc', /^BT\.07\.\d+\.02$/.test(ma2), true)
  eq('có cách giải mặc định + lời giải', (await q(`select la_mac_dinh, loi_giai from hinh_cach_giai where baitoan_id=$1`, [r2.bai_moi]))[0], { la_mac_dinh: true, loi_giai: 'Lời giải B' })
  eq('tiền đề 1.2 ← 1.1; cấp = 2', [(await q(`select count(*)::int n from hinh_cach_tien_de t join hinh_cach_giai g on g.id=t.cach_id where g.baitoan_id=$1 and t.tien_de_id=$2`, [r2.bai_moi, r1.bai_moi]))[0].n,
    (await q(`select cap from hinh_baitoan where id=$1`, [r2.bai_moi]))[0].cap], [1, 2])
  eq('giả thiết hiệu lực = gốc + riêng', (await q(`select fn_hl_gia_thiet_hieu_luc($1) g`, [r2.bai_moi]))[0].g, 'Cho tam giác ABC; AB = 3')
  eq('thiếu câu hỏi ⇒ từ chối', /Chưa nhập câu hỏi/.test(await loi(`select fn_hl_them_bai($1, '  ')`, [goc]) || ''), true)

  const r3 = (await q(`select fn_hl_sua_bai($1, 'Chứng minh B (sửa)', null, 'Lời giải B2', 'http://x/y.png', '{}'::uuid[]) r`, [r2.bai_moi]))[0].r
  const b2 = (await q(`select phat_bieu, gia_thiet_rieng, anh_chuan, ma from hinh_baitoan where id=$1`, [r2.bai_moi]))[0]
  eq('sửa: nội dung đổi, mã GIỮ', b2, { phat_bieu: 'Chứng minh B (sửa)', gia_thiet_rieng: null, anh_chuan: 'http://x/y.png', ma: ma2 })
  eq('sửa: lời giải đổi, tiền đề bị gỡ', [(await q(`select loi_giai from hinh_cach_giai where baitoan_id=$1`, [r2.bai_moi]))[0].loi_giai,
    (await q(`select count(*)::int n from hinh_cach_tien_de t join hinh_cach_giai g on g.id=t.cach_id where g.baitoan_id=$1`, [r2.bai_moi]))[0].n], ['Lời giải B2', 0])
  eq('sửa: không đẻ thêm cách giải', (await q(`select count(*)::int n from hinh_cach_giai where baitoan_id=$1`, [r2.bai_moi]))[0].n, 1)
  eq('tự làm tiền đề của mình ⇒ từ chối', /chính nó/.test(await loi(`select fn_hl_sua_bai($1, 'x', null, null, null, $2::uuid[])`, [r2.bai_moi, [r2.bai_moi]]) || ''), true)
  const goc2 = (await q(`select fn_hl_tao_mo_hinh('7', 'TEST cây khác', 'GT') id`))[0].id
  const o = (await q(`select fn_hl_them_bai($1, 'bài cây khác') r`, [goc2]))[0].r
  eq('tiền đề ở cây khác ⇒ từ chối', /CÙNG mô hình/.test(await loi(`select fn_hl_sua_bai($1, 'x', null, null, null, $2::uuid[])`, [r2.bai_moi, [o.bai_moi]]) || ''), true)
  eq('sửa bài trả đủ cây', r3.bai.length, 2)
  // rẽ nhánh từ bài vừa tạo vẫn chạy
  const r4 = (await q(`select fn_hl_re_nhanh($1::uuid[], 'Nhánh', 'Kẻ DE') r`, [[r2.bai_moi]]))[0].r
  eq('rẽ 1.2 ⇒ 1.1.1', r4.bai.find(b => b.id === r2.bai_moi).so, '1.1.1')
  const r5 = (await q(`select fn_hl_them_bai($1, 'bài trong nhánh') r`, [r4.nhanh_moi]))[0].r
  eq('thêm bài vào nhánh ⇒ 1.1.2, mã nối tiếp cây', [r5.bai.find(b => b.id === r5.bai_moi).so, /\.03$/.test(r5.bai.find(b => b.id === r5.bai_moi).ma)], ['1.1.2', true])
} catch (e) { bad++; console.log('  ✘ LỖI', e.message) }
finally { await c.query('ROLLBACK'); await c.end() }
console.log(`\n${bad ? '❌' : '✅'} ${ok} đúng · ${bad} sai   (đã ROLLBACK — DB không đổi)`)
process.exit(bad ? 1 : 0)
