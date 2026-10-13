// Test C1 (spec-hinh-cay-nhanh.md): áp migration 202610140048 + kiểm hành vi, TRONG 1 transaction rồi ROLLBACK.
// Chạy: node scripts/_test_hl_cay_nhanh_c1.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m) || [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
const sql = readFileSync(new URL('../supabase/migrations/202610140048_hinh_cay_nhanh_c1.sql', import.meta.url), 'utf8')
let ok = 0, bad = 0
const eq = (ten, got, want) => { const g = JSON.stringify(got), w = JSON.stringify(want); if (g === w) { ok++; console.log('  ✔', ten) } else { bad++; console.log('  ✘', ten, '\n     got ', g, '\n     want', w) } }
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('BEGIN')
try {
  await c.query(sql)
  // --- dữ liệu thử ---
  const [goc] = await q(`insert into hinh_mo_hinh(ten, gia_thiet, khoi, ma) values ('TEST gốc','△ABC vuông tại A','7','MH.9001') returning id`)
  const bai = async (mh, pb, rieng = null) => (await q(
    `insert into hinh_baitoan(mo_hinh_id, phat_bieu, cap, gia_thiet_rieng) values ($1,$2,1,$3) returning id, ma`, [mh, pb, rieng]))[0]
  const b1 = await bai(goc.id, 'b1'), b2 = await bai(goc.id, 'b2'), b3 = await bai(goc.id, 'b3')
  await c.query(`update hinh_baitoan set thu_tu = case id when $1 then 1 when $2 then 2 when $3 then 3 end where id in ($1,$2,$3)`, [b1.id, b2.id, b3.id])
  const [n1] = await q(`insert into hinh_mo_hinh(ten, gia_thiet, gia_thiet_them, la_mo_hinh, neo_baitoan_id, ma) values ('TEST n1','', 'Kẻ DE ⊥ AB', false, $1,'MH.9002') returning id`, [b2.id])
  const a1 = await bai(n1.id, 'a1'), a2 = await bai(n1.id, 'a2', 'AB = 6')
  await c.query(`update hinh_baitoan set thu_tu = case id when $1 then 1 when $2 then 2 end where id in ($1,$2)`, [a1.id, a2.id])
  const [n1a] = await q(`insert into hinh_mo_hinh(ten, gia_thiet, gia_thiet_them, la_mo_hinh, neo_baitoan_id, ma) values ('TEST n1a','', 'Kẻ DF ⊥ AC', false, $1,'MH.9003') returning id`, [a1.id])
  const c1 = await bai(n1a.id, 'c1')
  await c.query(`update hinh_baitoan set thu_tu = 1 where id = $1`, [c1.id])

  console.log('— mã —')
  eq('mã bài thân có tiền tố mô hình GỐC', [b1.ma, b2.ma, b3.ma], ['BT.07.9001.01', 'BT.07.9001.02', 'BT.07.9001.03'])
  eq('bài trong nhánh dùng mã GỐC, STT nối tiếp cả cây', [a1.ma, a2.ma, c1.ma], ['BT.07.9001.04', 'BT.07.9001.05', 'BT.07.9001.06'])
  // chuyển bài sang nhánh khác ⇒ mã KHÔNG đổi
  await c.query(`update hinh_baitoan set mo_hinh_id = $2 where id = $1`, [b3.id, n1.id])
  eq('chuyển b3 sang nhánh n1: mã giữ nguyên', (await q(`select ma from hinh_baitoan where id=$1`, [b3.id]))[0].ma, b3.ma)
  // cố ghi đè mã ⇒ trả về cũ
  await c.query(`update hinh_baitoan set ma = 'BT.99.9.99' where id = $1`, [b1.id])
  eq('UPDATE ma bị đưa về mã cũ', (await q(`select ma from hinh_baitoan where id=$1`, [b1.id]))[0].ma, b1.ma)
  await c.query(`update hinh_baitoan set mo_hinh_id = $2 where id = $1`, [b3.id, goc.id])  // trả lại

  console.log('— số hiển thị —')
  const so = Object.fromEntries((await q(`select ma, so from fn_hl_so_hien_thi($1)`, [goc.id])).map(r => [r.ma, r.so]))
  eq('1.1 1.2 1.3', [so[b1.ma], so[b2.ma], so[b3.ma]], ['1.1', '1.2', '1.3'])
  eq('nhánh rẽ từ 1.2: 1.2.1 · 1.2.2', [so[a1.ma], so[a2.ma]], ['1.2.1', '1.2.2'])
  eq('nhánh con rẽ từ 1.2.1: 1.2.1.1', so[c1.ma], '1.2.1.1')
  // chuyển a2 lên thân (cuối): số đổi, mã không
  await c.query(`update hinh_baitoan set mo_hinh_id = $2, thu_tu = 4 where id = $1`, [a2.id, goc.id])
  const so2 = Object.fromEntries((await q(`select ma, so from fn_hl_so_hien_thi($1)`, [goc.id])).map(r => [r.ma, r.so]))
  eq('a2 lên thân: số = 1.4, mã giữ', [so2[a2.ma], (await q(`select ma from hinh_baitoan where id=$1`, [a2.id]))[0].ma], ['1.4', a2.ma])
  await c.query(`update hinh_baitoan set mo_hinh_id = $2, thu_tu = 2 where id = $1`, [a2.id, n1.id])

  console.log('— giả thiết hiệu lực (luật mới) —')
  eq('c1 = gốc + n1 + n1a', (await q(`select fn_hl_gia_thiet_hieu_luc($1) g`, [c1.id]))[0].g, '△ABC vuông tại A; Kẻ DE ⊥ AB; Kẻ DF ⊥ AC')
  eq('a2 = gốc + n1 + riêng', (await q(`select fn_hl_gia_thiet_hieu_luc($1) g`, [a2.id]))[0].g, '△ABC vuông tại A; Kẻ DE ⊥ AB; AB = 6')
  eq('b1 (thân) = gốc', (await q(`select fn_hl_gia_thiet_hieu_luc($1) g`, [b1.id]))[0].g, '△ABC vuông tại A')

  console.log('— cờ sai nhánh —')
  const [cg] = await q(`insert into hinh_cach_giai(baitoan_id, la_mac_dinh) values ($1, true) returning id`, [b3.id])
  await c.query(`insert into hinh_cach_tien_de(cach_id, tien_de_id) values ($1,$2)`, [cg.id, c1.id])   // b3 (thân) dùng c1 (nhánh sâu)
  eq('b3 thân có tiền đề c1 ở nhánh sâu ⇒ SAI', (await q(`select ma, ma_tien_de from fn_hl_sai_nhanh($1)`, [goc.id])).map(r => [r.ma, r.ma_tien_de]), [[b3.ma, c1.ma]])
  const [cg2] = await q(`insert into hinh_cach_giai(baitoan_id, la_mac_dinh) values ($1, true) returning id`, [c1.id])
  await c.query(`insert into hinh_cach_tien_de(cach_id, tien_de_id) values ($1,$2)`, [cg2.id, b1.id])   // c1 dùng b1 (thân) — hợp lệ
  eq('c1 dùng b1 ở thân ⇒ không cờ thêm', (await q(`select count(*)::int n from fn_hl_sai_nhanh($1)`, [goc.id]))[0].n, 1)

  console.log('— bất biến cây —')
  let loi = null
  try { await c.query('savepoint sp'); await c.query(`update hinh_mo_hinh set neo_baitoan_id = $2 where id = $1`, [n1.id, c1.id]) }
  catch (e) { loi = e.message; await c.query('rollback to savepoint sp') }
  eq('neo vào bài thuộc cây con của chính nó bị chặn', /vòng/.test(loi || ''), true)
  eq('hinh_mo_hinh_cha: mỗi mô hình ≤ 1 cha', (await q(`select count(*)::int n from (select mo_hinh_id from hinh_mo_hinh_cha group by 1 having count(*)>1) x`))[0].n, 0)
} catch (e) {
  bad++; console.log('  ✘ LỖI', e.message)
} finally {
  await c.query('ROLLBACK'); await c.end()
}
console.log(`\n${bad ? '❌' : '✅'} ${ok} đúng · ${bad} sai   (đã ROLLBACK — DB không đổi)`)
process.exit(bad ? 1 : 0)
