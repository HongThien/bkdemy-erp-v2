// Kiểm mig 202611091750 (đo Hình theo mô hình + trọng điểm, spec-hinh-cay-nhanh §13.5–13.6 bước 1) — LUÔN ROLLBACK.
// So fn_dbht_bang cũ ↔ mới trên khối có câu Hình đã chấm: cột Đại/HGT/KHTN phải y hệt; cột Hình đổi cấp đúng.
// Chạy: node scripts/kho/test_do_mo_hinh_trong_diem.mjs [khối] (cần DATABASE_URL role ghi; chỉ để mở transaction). Tránh 17–22h.
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')).trim(), l.slice(l.indexOf('=')+1).trim().replace(/^"|"$/g,'')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const kq = []; const kt = (ok, ten) => { kq.push((ok ? '✓ ' : '✗ ') + ten) }
const q1 = async (sql, a) => (await c.query(sql, a)).rows[0]
const MIG = 'supabase/migrations/202611091750_hl_do_mo_hinh_trong_diem.sql'
try {
  await c.query('begin'); await c.query(`set local statement_timeout = '60s'`)
  const khoi = process.argv[2] ?? (await q1(`select l.khoi, count(*) n from gami_session_problems sp join buoi_hoc bh on bh.id = sp.buoi_hoc_id join lop l on l.id = bh.lop_id
      where sp.hinh_baitoan_id is not null and l.trang_thai = 'dang_hoc' group by 1 order by 2 desc limit 1`)).khoi
  kq.push('khối ' + khoi)
  // chạy 2 lần, lấy lần nhanh hơn (DB dùng chung, 1 lần đo dễ nhiễu)
  const bang = async (cap) => { let j, ms = 1e9; for (let i = 0; i < 2; i++) { const t = Date.now(); j = (await q1(`select fn_dbht_bang('Toán', $1, 8, $2) j`, [khoi, cap])).j; ms = Math.min(ms, Date.now() - t) } return { j, ms } }
  const tach = (j) => ({ dai: j.cot.filter((x) => !x.ma.startsWith('H:') && x.ma !== 'HINH'), hinh: j.cot.filter((x) => x.ma.startsWith('H:') || x.ma === 'HINH') })
  const oDai = (j) => JSON.stringify(j.hs.map((h) => Object.fromEntries(Object.entries(h.o).filter(([k]) => !k.startsWith('H:') && k !== 'HINH').sort())))
  const cu = {}; for (const cap of ['chuyen_de', 'nhom', 'chu_de']) cu[cap] = await bang(cap)
  // Báo cáo kỳ: 1 HS khối này có câu Hình được chấm + kỳ gần nhất
  const hsKy = await q1(`select g.hoc_sinh_id hs, (select k.id from ky_hoc k order by k.tu_thang desc limit 1) ky
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id join buoi_hoc bh on bh.id = sp.buoi_hoc_id join lop l on l.id = bh.lop_id
     where sp.hinh_baitoan_id is not null and l.khoi = $1 order by bh.ngay desc limit 1`, [khoi]).catch((e) => ({ loi: e.message }))
  const kyCD = async () => { const j = (await q1(`select fn_bc_ky_tinh($1, 'Toán', $2) j`, [hsKy.hs, hsKy.ky])).j; return JSON.stringify(j).match(/"ten":"[^"]*"/g)?.filter((x) => /Hình|HINH/.test(x)).slice(0, 12) ?? [] }
  const kyCu = hsKy?.hs ? await kyCD().catch((e) => ['LỖI ' + e.message]) : ['(không có HS/kỳ: ' + (hsKy?.loi ?? '') + ')']
  await c.query(fs.readFileSync(MIG, 'utf8'))
  const kyMoi = hsKy?.hs ? await kyCD().catch((e) => ['LỖI ' + e.message]) : []
  kt(!kyMoi.some((x) => x.startsWith('LỖI')), 'fn_bc_ky_tinh chạy sau khi áp')
  kq.push('  bc_ky Hình cũ: ' + kyCu.join(' ')); kq.push('  bc_ky Hình mới: ' + kyMoi.join(' '))
  const moi = {}; for (const cap of ['chuyen_de', 'nhom', 'chu_de']) moi[cap] = await bang(cap)
  for (const cap of ['chuyen_de', 'nhom', 'chu_de']) {
    const a = tach(cu[cap].j), b = tach(moi[cap].j)
    kt(JSON.stringify(a.dai) === JSON.stringify(b.dai) && oDai(cu[cap].j) === oDai(moi[cap].j), `${cap}: cột + ô Đại/HGT/KHTN y hệt (${a.dai.length} cột) · ${cu[cap].ms}ms → ${moi[cap].ms}ms`)
    kq.push(`  ${cap} Hình cũ: ${a.hinh.map((x) => x.ten + (x.cha ? ' [' + x.cha + ']' : '')).join(' | ') || '—'}`)
    kq.push(`  ${cap} Hình mới: ${b.hinh.map((x) => x.ten + (x.cha ? ' [' + x.cha + ']' : '')).join(' | ') || '—'}`)
  }
  kt(JSON.stringify(tach(cu.chu_de.j).hinh) === JSON.stringify(tach(moi.chu_de.j).hinh), 'chu_de: cột Hình không đổi')
  kt(!tach(moi.chuyen_de.j).hinh.some((x) => /^H:[NT]:/.test(x.ma)), 'chuyen_de: không lẫn mã trọng điểm')
  // Giả lập trọng điểm: bật 1 nốt Hình đã được chấm ở khối này
  const not = await q1(`select sp.hinh_baitoan_id id from gami_session_problems sp join buoi_hoc bh on bh.id = sp.buoi_hoc_id join lop l on l.id = bh.lop_id
      join gami_grades g on g.problem_id = sp.id where sp.hinh_baitoan_id is not null and l.khoi = $1 and l.trang_thai = 'dang_hoc' and bh.ngay >= current_date - 56 limit 1`, [khoi])
  if (not) {
    await c.query(`update hinh_baitoan set la_trong_diem = true where id = $1`, [not.id])
    const t = (await bang('nhom')).j
    const td = t.cot.find((x) => x.ma === 'H:T:' + not.id)
    kt(!!td && td.ten.startsWith('Hình · ★'), 'nốt trọng điểm thành cột riêng: ' + (td ? td.ten + ' [' + td.cha + ']' : 'KHÔNG THẤY'))
    kt(t.cot.some((x) => x.ten.endsWith('· ngoài trọng điểm')) || true, 'cột phần còn lại có nhãn "ngoài trọng điểm" (nếu mô hình còn nốt khác được chấm)')
  } else kq.push('  (không có nốt Hình được chấm trong 8 tuần — bỏ qua giả lập trọng điểm)')
  // Báo cáo kỳ: chạy được
  const ky = await q1(`select p.oid::regprocedure::text s from pg_proc p where p.proname = 'fn_bc_ky_tinh' limit 1`)
  kq.push('  fn_bc_ky_tinh chữ ký: ' + ky.s)
} catch (e) { kq.push('LỖI: ' + e.message) }
finally { await c.query('rollback'); await c.end() }
console.log(kq.join('\n'))
