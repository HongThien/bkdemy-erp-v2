import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()

// 1) TRÙNG buoi_hoc theo (lop_id, ngay, loai) — mismatch danh tính: đóng 1 dòng, hiện dòng kia
const dup = (await c.query(`
  select b.lop_id, l.ten_lop, b.ngay, b.loai, count(*) n,
         count(*) filter (where b.btvn_dong_at is not null) n_dong
  from buoi_hoc b join lop l on l.id=b.lop_id
  where b.trang_thai<>'huy'
  group by 1,2,3,4 having count(*)>1 order by n desc`)).rows
console.log('== [1] Buổi TRÙNG (lop,ngay,loai) ==', dup.length, 'nhóm')
for (const r of dup.slice(0,15)) console.log(`   ${r.ten_lop} | ${r.ngay?.toISOString?.().slice(0,10)} | ${r.loai} | ${r.n} buổi, ${r.n_dong} đã đóng BTVN`)

// 2) ĐÃ CHẤM BTVN (có trạng thái nộp) nhưng btvn_dong_at NULL → "đã đóng thực tế, hệ thống báo chưa"
const graded = (await c.query(`
  select b.id, l.ten_lop, b.ngay, b.loai,
         count(k.*) n_kq,
         count(k.*) filter (where k.trang_thai_nop is not null) n_nop
  from buoi_hoc b join lop l on l.id=b.lop_id
  join btvn_ket_qua k on k.buoi_hoc_id=b.id
  where b.btvn_dong_at is null and b.trang_thai<>'huy'
  group by 1,2,3,4
  having count(k.*) filter (where k.trang_thai_nop is not null) > 0
  order by b.ngay desc`)).rows
console.log('\n== [2] Có chấm nộp BTVN nhưng btvn_dong_at NULL ==', graded.length, 'buổi')
for (const r of graded.slice(0,20)) console.log(`   ${r.ten_lop} | ${r.ngay?.toISOString?.().slice(0,10)} | ${r.loai} | ${r.n_nop}/${r.n_kq} HS có trạng thái nộp`)

// 3) BTVN doc (tai_lieu) tồn tại cho lop+ngay nhưng buổi tương ứng chưa đóng, và ĐÃ có problems chấm
const orphan = (await c.query(`
  select l.ten_lop, t.ngay, count(distinct b.id) n_buoi,
         count(distinct b.id) filter (where b.btvn_dong_at is not null) n_dong
  from tai_lieu t join lop l on l.id=t.lop_id
  join buoi_hoc b on b.lop_id=t.lop_id and b.ngay=t.ngay and b.trang_thai<>'huy'
  where t.loai='btvn'
  group by 1,2 having count(distinct b.id)>1
  order by t.ngay desc`)).rows
console.log('\n== [3] 1 BTVN doc (lop+ngay) map tới NHIỀU buổi ==', orphan.length)
for (const r of orphan.slice(0,15)) console.log(`   ${r.ten_lop} | ${r.ngay?.toISOString?.().slice(0,10)} | ${r.n_buoi} buổi (${r.n_dong} đã đóng)`)

// 4) BTVN doc TRÙNG cho cùng lop+ngay
const dupdoc = (await c.query(`
  select l.ten_lop, t.ngay, count(*) n from tai_lieu t join lop l on l.id=t.lop_id
  where t.loai='btvn' group by 1,2 having count(*)>1 order by n desc`)).rows
console.log('\n== [4] BTVN doc TRÙNG (lop+ngay) ==', dupdoc.length)
for (const r of dupdoc.slice(0,15)) console.log(`   ${r.ten_lop} | ${r.ngay?.toISOString?.().slice(0,10)} | ${r.n} doc`)

await c.end()
