// Kiểm NHÓM BÀI + TRỌNG ĐIỂM (mig 202611091539, spec-hinh-cay-nhanh §13) trên cây thật MH.126 — LUÔN ROLLBACK, không để lại gì.
// Chạy: node scripts/kho/test_nhom_bai.mjs (cần DATABASE_URL role ghi; chỉ để mở transaction).
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')).trim(), l.slice(l.indexOf('=')+1).trim().replace(/^"|"$/g,'')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const kq = []; const kt = (ok, ten) => { kq.push((ok ? '✓ ' : '✗ ') + ten) }
const loi = async (sql, args, mau, ten) => { await c.query('savepoint s'); try { await c.query(sql, args); kt(false, ten + ' (không bị chặn!)') } catch (e) { kt(e.message.includes(mau), ten + ' → ' + e.message) } await c.query('rollback to savepoint s') }
try {
  await c.query('begin')
  if (!(await c.query(`select to_regclass('hinh_nhom_bai_su_kien') t`)).rows[0].t) await c.query(fs.readFileSync('supabase/migrations/202611091539_hinh_nhom_bai_trong_diem.sql', 'utf8'))
  const id = async (ma) => (await c.query(`select id from hinh_mo_hinh where ma=$1`, [ma])).rows[0].id
  const g = await id('MH.126'), m166 = await id('MH.166'), m168 = await id('MH.168')
  const con166 = (await c.query(`select count(*)::int n from hinh_mo_hinh_cha where cha_id=$1`, [m166])).rows[0].n
  const con168 = (await c.query(`select count(*)::int n from hinh_mo_hinh_cha where cha_id=$1`, [m168])).rows[0].n
  kq.push(`MH.166 có ${con166} nhánh con · MH.168 có ${con168} nhánh con`)
  const gtCu = (await c.query(`select b.ma, fn_hl_gia_thiet_hieu_luc(b.id) gt from hinh_baitoan b where fn_hl_goc_mo_hinh(b.mo_hinh_id)=$1 order by b.ma`, [g])).rows
  await c.query(`select fn_hl_nhom_bai_bat($1, array['BD là phân giác của góc B','BE = BA','DE ⊥ BC'])`, [g])
  const sk = (await c.query(`select id, thu_tu from hinh_nhom_bai_su_kien where nhom_id=$1 order by thu_tu`, [g])).rows.map(r => r.id)
  kt(sk.length === 3, 'bật nhóm bài: 3 sự kiện')
  await loi(`select fn_hl_nhom_bai_bat($1, array['x','y'])`, [g], 'đã là nhóm bài', 'bật lần 2')
  if (con168 === 0) {
    await c.query(`select fn_hl_thanh_vien_chuyen($1, 'Cho ΔABC vuông tại A, BD là phân giác của góc B (D ∈ AC). Kẻ DE ⊥ BC (E ∈ BC).', $2, $3)`, [m168, [sk[0], sk[2]], [sk[1]]])
    kt(true, 'chuyển MH.168 thành thành viên (cho A,C hỏi B)')
    await loi(`select fn_hl_them_gia_thiet($1, 'con', 'thử thêm nhánh con')`, [m168], 'không có nhánh con', 'thêm nhánh con dưới thành viên')
    await loi(`select fn_hl_doi_cha_gia_thiet($1, $2, false)`, [m168, m166], 'chỉ treo được dưới một nút nhóm bài', 'dời thành viên sang nhánh thường')
    await loi(`update hinh_mo_hinh set vai='thuong' where id=$1`, [g], 'còn thành viên', 'tắt vai nhóm khi còn thành viên')
  }
  const tv = (await c.query(`select fn_hl_thanh_vien_them($1, 'Thành viên 3', 'Cho ΔABC vuông tại A. Trên BC lấy E sao cho BE = BA. Đường vuông góc với BC tại E cắt AC tại D.', $2, $3) r`, [g, [sk[1], sk[2]], [sk[0]]])).rows[0].r.nhanh_moi
  kt(!!tv, 'thêm thành viên mới (cho B,C hỏi A)')
  await loi(`select fn_hl_thanh_vien_them($1, 'x', 'gt', $2, $2)`, [g, [sk[0]]], 'vừa cho vừa hỏi', 'cho ∩ hỏi')
  await loi(`select fn_hl_thanh_vien_them($1, 'x', 'gt', $2, '{}')`, [g, [sk[0]]], 'HỎI ít nhất 1', 'không hỏi gì')
  // sự kiện của nhóm khác
  const khac = (await c.query(`select id from hinh_mo_hinh where ma='MH.072'`)).rows[0].id
  await c.query(`select fn_hl_nhom_bai_bat($1, array['p','q'])`, [khac])
  const skKhac = (await c.query(`select id from hinh_nhom_bai_su_kien where nhom_id=$1 limit 1`, [khac])).rows[0].id
  await loi(`select fn_hl_thanh_vien_cho_hoi($1, '{}', $2)`, [tv, [skKhac]], 'không thuộc nhóm bài', 'cho/hỏi sự kiện nhóm khác')
  // giả thiết hiệu lực: nốt trong thành viên mới = nguyên văn thành viên; nốt cũ không đổi
  await c.query(`select fn_hl_them_bai($1, 'CM BD là phân giác')`, [tv]); await loi(`select fn_hl_them_gia_thiet($1, 'con', 'thử nhánh con')`, [tv], 'không có nhánh con', 'thêm nhánh con dưới thành viên mới'); await loi(`select fn_hl_thanh_vien_chuyen($1, 'gt', $2, $3)`, [m168, [sk[0]], [sk[1]]], 'còn nhánh con', 'chuyển MH.168 (còn nhánh con) thành thành viên')
  const gtTv = (await c.query(`select fn_hl_gia_thiet_hieu_luc(b.id) gt from hinh_baitoan b where b.mo_hinh_id=$1`, [tv])).rows[0].gt
  kt(gtTv?.startsWith('Cho ΔABC vuông tại A. Trên BC lấy E'), 'giả thiết hiệu lực nốt thành viên = nguyên văn: ' + gtTv)
  const gtMoi = (await c.query(`select b.ma, fn_hl_gia_thiet_hieu_luc(b.id) gt from hinh_baitoan b where fn_hl_goc_mo_hinh(b.mo_hinh_id)=$1 and b.mo_hinh_id<>$2 order by b.ma`, [g, tv])).rows
  const doi = gtCu.filter((r, i) => gtMoi.find(x => x.ma === r.ma)?.gt !== r.gt && !(con168 === 0)).length
  kq.push(`nốt cũ của cây: ${gtCu.length}; giả thiết đổi (ngoài nhánh vừa chuyển): ${gtCu.filter(r => { const x = gtMoi.find(y => y.ma === r.ma); return x && x.gt !== r.gt }).map(r => r.ma).join(',') || 'không'}`)
  const doc = (await c.query(`select fn_hl_nhom_bai_cua_cay($1) j`, [g])).rows[0].j
  kq.push('fn_hl_nhom_bai_cua_cay: ' + JSON.stringify(doc.map(n => ({ sk: n.su_kien.map(s => s.ky_hieu + ':' + s.noi_dung), tv: n.thanh_vien.map(t => `${t.ten} cho ${t.cho.length} hỏi ${t.hoi.length}`) }))))
  kt((await c.query(`select count(*)::int n from fn_hl_sai_nhanh($1)`, [g]).catch(() => ({ rows: [{ n: -1 }] }))).rows[0].n >= 0, 'fn_hl_sai_nhanh vẫn chạy')
  kt((await c.query(`select count(*)::int n from fn_hl_so_hien_thi($1)`, [g])).rows[0].n > 0, 'fn_hl_so_hien_thi vẫn đánh số')
  await loi(`select fn_hl_trong_diem_dat((select id from hinh_baitoan where mo_hinh_id=$1 limit 1), true)`, [tv], 'trưởng khối', 'trọng điểm khi không đăng nhập')
  kt((await c.query(`select count(*)::int n from dai_bdm_log where bang in ('hinh_nhom_bai_su_kien','hinh_thanh_vien_su_kien') and at > now() - interval '1 minute'`).catch(() => ({ rows: [{ n: -1 }] }))).rows[0].n !== 0, 'nhật ký dai_bdm_log ghi')
} catch (e) { kq.push('LỖI: ' + e.message) }
finally { await c.query('rollback'); await c.end() }
console.log(kq.join('\n'))
