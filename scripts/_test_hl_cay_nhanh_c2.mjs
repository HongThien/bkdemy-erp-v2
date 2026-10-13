// Test C2: áp migration 202610140054 (RPC sửa cây) + kiểm hành vi, TRONG 1 transaction rồi ROLLBACK.
// Chạy: node scripts/_test_hl_cay_nhanh_c2.mjs        (C1 đã áp trên DB)
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m) || [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
const sql = readFileSync(new URL('../supabase/migrations/202610140054_hinh_cay_nhanh_c2_rpc.sql', import.meta.url), 'utf8')
let ok = 0, bad = 0
const eq = (ten, got, want) => { const g = JSON.stringify(got), w = JSON.stringify(want); if (g === w) { ok++; console.log('  ✔', ten) } else { bad++; console.log('  ✘', ten, '\n     got ', g, '\n     want', w) } }
const q = async (s, p) => (await c.query(s, p)).rows
const loi = async (s, p) => { await c.query('savepoint s'); try { await c.query(s, p); await c.query('release savepoint s'); return null } catch (e) { await c.query('rollback to savepoint s'); return e.message } }
const so = async goc => Object.fromEntries((await q(`select ma, so from fn_hl_so_hien_thi($1)`, [goc])).map(r => [r.ma, r.so]))

await c.query('BEGIN')
try {
  await c.query(sql)
  const [goc] = await q(`insert into hinh_mo_hinh(ten, gia_thiet, khoi, ma) values ('TEST gốc','GT','7','MH.9101') returning id`)
  const bai = async (mh, n) => { const [r] = await q(`insert into hinh_baitoan(mo_hinh_id, phat_bieu, cap, thu_tu) values ($1,$2,1,$3) returning id, ma`, [mh, 'b' + n, n]); return r }
  const t = []; for (let i = 1; i <= 7; i++) t.push(await bai(goc.id, i))          // thân 1.1..1.7

  console.log('— rẽ nhánh —')
  let e = await loi(`select fn_hl_re_nhanh($1::uuid[], 'x', null)`, [[t[0].id]])
  eq('bài đầu làn bị từ chối', /Bài đầu làn/.test(e || ''), true)
  const r1 = (await q(`select fn_hl_re_nhanh($1::uuid[], 'Kẻ DE ⊥ AB', 'Kẻ DE ⊥ AB tại E') r`, [[t[5].id, t[6].id]]))[0].r   // 1.6, 1.7 → nhánh neo vào 1.5
  const s1 = Object.fromEntries(r1.bai.map(b => [b.ma, b.so]))
  eq('thân còn 1.1..1.5', t.slice(0, 5).map(b => s1[b.ma]), ['1.1', '1.2', '1.3', '1.4', '1.5'])
  eq('1.6, 1.7 thành 1.5.1, 1.5.2', [s1[t[5].ma], s1[t[6].ma]], ['1.5.1', '1.5.2'])
  eq('mã không đổi sau rẽ nhánh', (await q(`select ma from hinh_baitoan where id=$1`, [t[5].id]))[0].ma, t[5].ma)
  eq('trả nhanh_moi', !!r1.nhanh_moi, true)
  const n1 = r1.nhanh_moi
  eq('nhánh mới la_mo_hinh=false, neo=1.5', (await q(`select la_mo_hinh, neo_baitoan_id = $2 as ok from hinh_mo_hinh where id=$1`, [n1, t[4].id]))[0], { la_mo_hinh: false, ok: true })
  e = await loi(`select fn_hl_re_nhanh($1::uuid[], 'x', null)`, [[t[1].id, t[5].id]])
  eq('khác làn bị từ chối', /cùng một làn/.test(e || ''), true)

  console.log('— rẽ nhánh con (từ 1.5.1) —')
  const r2 = (await q(`select fn_hl_re_nhanh($1::uuid[], 'Kẻ DF', null) r`, [[t[6].id]]))[0].r   // 1.5.2 → nhánh neo vào 1.5.1
  const s2 = Object.fromEntries(r2.bai.map(b => [b.ma, b.so]))
  eq('1.7 thành 1.5.1.1', s2[t[6].ma], '1.5.1.1')

  console.log('— chuyển bài —')
  const r3 = (await q(`select fn_hl_chuyen_bai($1,$2) r`, [t[0].id, n1]))[0].r        // 1.1 → cuối nhánh n1
  const s3 = Object.fromEntries(r3.bai.map(b => [b.ma, b.so]))
  eq('bài chuyển cuối nhánh (thân dồn lại ⇒ nhánh rẽ từ 1.4 ⇒ 1.4.2); thân 1.1, 1.2', [s3[t[0].ma], s3[t[1].ma], s3[t[2].ma]], ['1.4.2', '1.1', '1.2'])
  eq('mã giữ', (await q(`select ma from hinh_baitoan where id=$1`, [t[0].id]))[0].ma, t[0].ma)
  e = await loi(`select fn_hl_chuyen_bai($1,$2)`, [t[5].id, r2.nhanh_moi])               // 1.5.1 vào nhánh rẽ từ chính nó
  eq('chuyển vào cây con của chính nó ⇒ vòng bị chặn', /vòng/.test(e || ''), true)
  const [goc2] = await q(`insert into hinh_mo_hinh(ten, gia_thiet, khoi, ma) values ('TEST cây khác','GT','7','MH.9102') returning id`)
  e = await loi(`select fn_hl_chuyen_bai($1,$2)`, [t[1].id, goc2.id])
  eq('khác cây bị từ chối', /CÙNG một cây/.test(e || ''), true)

  console.log('— đổi thứ tự —')
  // thân hiện: t[1],t[2],t[3],t[4]  (1.1..1.4)
  const r4 = (await q(`select fn_hl_doi_thu_tu($1, 1) r`, [t[3].id]))[0].r             // t[3] lên đầu
  const s4 = Object.fromEntries(r4.bai.map(b => [b.ma, b.so]))
  eq('t[3] lên đầu: 1.1; t[1]→1.2, t[2]→1.3, t[4]→1.4', [s4[t[3].ma], s4[t[1].ma], s4[t[2].ma], s4[t[4].ma]], ['1.1', '1.2', '1.3', '1.4'])
  const r5 = (await q(`select fn_hl_doi_thu_tu($1, 99) r`, [t[3].id]))[0].r            // xuống cuối (kẹp)
  const s5 = Object.fromEntries(r5.bai.map(b => [b.ma, b.so]))
  eq('vị trí vượt ⇒ kẹp cuối: 1.4', s5[t[3].ma], '1.4')

  console.log('— đổi bài mẹ —')
  const r6 = (await q(`select fn_hl_doi_neo($1,$2) r`, [n1, t[1].id]))[0].r             // nhánh n1 rẽ từ t[1] thay vì 1.5
  const s6 = Object.fromEntries(r6.bai.map(b => [b.ma, b.so]))
  eq('nhánh n1 giờ rẽ từ bài t[1] (số t[1] + .k)', s6[t[5].ma]?.startsWith(s6[t[1].ma] + '.'), true)
  e = await loi(`select fn_hl_doi_neo($1,$2)`, [n1, t[6].id])                              // t[6] nằm trong cây con của n1
  eq('đổi neo vào cây con của chính nó ⇒ chặn', /vòng/.test(e || ''), true)
  e = await loi(`select fn_hl_doi_neo($1,$2)`, [goc.id, t[1].id])
  eq('gốc cây không có neo ⇒ từ chối', /Chỉ đổi bài mẹ cho NHÁNH/.test(e || ''), true)

  console.log('— bất biến mã sau toàn bộ thao tác —')
  eq('mã 7 bài không đổi', (await q(`select ma from hinh_baitoan where mo_hinh_id in (select id from hinh_mo_hinh) and phat_bieu like 'b%' order by ma`)).filter(r => t.some(b => b.ma === r.ma)).length, 7)
} catch (e) {
  bad++; console.log('  ✘ LỖI', e.message)
} finally {
  await c.query('ROLLBACK'); await c.end()
}
console.log(`\n${bad ? '❌' : '✅'} ${ok} đúng · ${bad} sai   (đã ROLLBACK — DB không đổi)`)
process.exit(bad ? 1 : 0)
