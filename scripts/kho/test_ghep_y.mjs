// Kiểm fn_hl_ghep_y (mig 202611091738, spec-hinh-cay-nhanh §13.4) trên cây thật MH.126 — LUÔN ROLLBACK, không để lại gì.
// Chạy: node scripts/kho/test_ghep_y.mjs (cần DATABASE_URL role ghi; chỉ để mở transaction).
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')).trim(), l.slice(l.indexOf('=')+1).trim().replace(/^"|"$/g,'')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const kq = []; const kt = (ok, ten) => { kq.push((ok ? '✓ ' : '✗ ') + ten) }
const q1 = async (sql, a) => (await c.query(sql, a)).rows[0]
try {
  await c.query('begin')
  if (!(await q1(`select to_regprocedure('fn_hl_ghep_y(uuid[])') t`)).t) await c.query(fs.readFileSync('supabase/migrations/202611091738_hl_ghep_y_nhom_bai.sql', 'utf8'))
  const id = async (ma) => (await q1(`select id from hinh_mo_hinh where ma=$1`, [ma])).id
  const g = await id('MH.126'), m166 = await id('MH.166'), m168 = await id('MH.168')
  const baiCua = async (mh) => (await c.query(`select id, ma from hinh_baitoan where mo_hinh_id=$1 order by length(ma), ma`, [mh])).rows
  const moi = (r) => r.nhanh_moi
  const ghep = async (ids) => (await q1(`select fn_hl_ghep_y($1::uuid[]) j`, [ids])).j
  const gocBai = await baiCua(g), b166 = await baiCua(m166), b168 = await baiCua(m168)
  kq.push(`gốc ${gocBai.length} bài · MH.166 ${b166.length} · MH.168 ${b168.length}`)

  // 0) Chưa có nhóm bài: phan = fn_hl_gia_thiet_phan y hệt, không cảnh báo, thứ tự = số B
  const ids0 = [b166[0].id, gocBai[0].id]
  const j0 = await ghep(ids0)
  const p0 = (await c.query(`select b.id, fn_hl_gia_thiet_phan(b.id) p from hinh_baitoan b where b.id = any($1)`, [ids0])).rows
  kt(p0.every((r) => JSON.stringify(j0.phan[r.id]) === JSON.stringify(r.p)), 'không nhóm bài ⇒ phần giả thiết y như fn_hl_gia_thiet_phan')
  kt(j0.canh_bao.length === 0, 'gốc → nhánh chính: không cảnh báo')
  kt(j0.thu_tu[0] === gocBai[0].id, 'thứ tự = số B (bài gốc trước)')

  // Dựng nhóm bài: gốc = nhóm, MH.168 = thành viên, thêm thành viên mới có 1 bài
  await c.query(`select fn_hl_nhom_bai_bat($1, array['BD là phân giác của góc B','BE = BA','DE ⊥ BC'])`, [g])
  const sk = (await c.query(`select id from hinh_nhom_bai_su_kien where nhom_id=$1 order by thu_tu`, [g])).rows.map((r) => r.id)
  const tv2 = moi((await q1(`select fn_hl_thanh_vien_them($1, 'TV2', 'Cho ΔABC vuông tại A, BD là phân giác của góc B (D ∈ AC). Kẻ DE ⊥ BC (E ∈ BC).', $2, $3) r`, [g, [sk[0], sk[2]], [sk[1]]])).r)
  await c.query(`select fn_hl_them_bai($1, 'CM BE = BA')`, [tv2]); const btv2 = await baiCua(tv2)
  const GT_TV = 'Cho ΔABC vuông tại A. Trên BC lấy E sao cho BE = BA. Đường vuông góc với BC tại E cắt AC tại D.'
  const tv = moi((await q1(`select fn_hl_thanh_vien_them($1, 'TV3', $2, $3, $4) r`, [g, GT_TV, [sk[1], sk[2]], [sk[0]]])).r)
  await c.query(`select fn_hl_them_bai($1, 'CM BD là phân giác của góc B')`, [tv])
  const btv = await baiCua(tv)

  // 1) Thành viên + ý dưới nhóm: thành viên đứng đầu, đoạn đầu thay bằng giả thiết thành viên, không in lại đầu ra
  const sau = b166[b166.length - 1]
  const j1 = await ghep([sau.id, btv[0].id])
  kt(j1.thu_tu[0] === btv[0].id, 'ý thành viên đứng đầu dù số B lớn hơn')
  kt(j1.phan[sau.id]?.[0] === GT_TV, 'ý dưới nhóm: phần đầu = giả thiết thành viên → ' + JSON.stringify(j1.phan[sau.id]))
  const dauRa = (await q1(`select gia_thiet from hinh_mo_hinh where id=$1`, [g])).gia_thiet
  kt(!j1.phan[sau.id]?.includes(dauRa), 'không in lại đầu ra của nhóm')
  kt(JSON.stringify(j1.phan[btv[0].id]) === JSON.stringify([GT_TV]), 'ý thành viên: chỉ giả thiết thành viên')
  kt(j1.canh_bao.length === 0, 'thành viên → nhánh chính sau nhóm: không cảnh báo')

  // 2) 2 thành viên cùng nhóm ⇒ cảnh báo
  const j2 = await ghep([btv[0].id, btv2[0].id])
  kt(j2.canh_bao.some((x) => x.includes('2 thành viên')), '2 thành viên cùng nhóm ⇒ ' + j2.canh_bao.join(' | '))

  // 3) 2 nhánh anh em ⇒ cảnh báo
  const x1 = moi((await q1(`select fn_hl_them_gia_thiet($1, 'X1', 'Lấy M trung điểm BC', false) r`, [g])).r)
  await c.query(`select fn_hl_them_bai($1, 'thử X1')`, [x1]); const bx1 = await baiCua(x1)
  const j3 = await ghep([b166[0].id, bx1[0].id])
  kt(j3.canh_bao.some((x) => x.includes('anh em')), 'nhánh chính + nhánh phụ anh em ⇒ ' + j3.canh_bao.join(' | '))

  // 4) rẽ phụ 2 lần ⇒ cảnh báo; 1 lần ⇒ không
  const x2 = moi((await q1(`select fn_hl_them_gia_thiet($1, 'X2', 'Lấy N trung điểm AM', false) r`, [x1])).r)
  await c.query(`select fn_hl_them_bai($1, 'thử X2')`, [x2]); const bx2 = await baiCua(x2)
  const j4 = await ghep([gocBai[0].id, bx2[0].id])
  kt(j4.canh_bao.some((x) => x.includes('2 lần')), 'gốc → phụ → phụ ⇒ ' + j4.canh_bao.join(' | '))
  const j5 = await ghep([bx1[0].id, bx2[0].id])
  kt(j5.canh_bao.length === 0, 'bắt đầu ở nhánh phụ, rẽ thêm 1 lần ⇒ không cảnh báo')
  // 5) thành viên + ý nhánh phụ dưới nhóm (1 lần rẽ) ⇒ không cảnh báo, đoạn đầu thay
  const j6 = await ghep([btv[0].id, bx1[0].id])
  kt(j6.canh_bao.length === 0 && j6.phan[bx1[0].id]?.[0] === GT_TV, 'thành viên → nhánh phụ sau nhóm: ' + JSON.stringify(j6.phan[bx1[0].id]))
  // 6) rỗng
  const j7 = await ghep([])
  kt(Array.isArray(j7.thu_tu) && j7.thu_tu.length === 0, 'mảng rỗng ⇒ kết quả rỗng')
} catch (e) { kq.push('LỖI: ' + e.message) }
finally { await c.query('rollback'); await c.end() }
console.log(kq.join('\n'))
