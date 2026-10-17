// Test bước 1 builder bản đồ mới (spec-builder-ban-do-moi.md B6): áp migration + kiểm hàm trong MỘT transaction rồi ROLLBACK.
// Không để lại gì trên DB. Chạy: node scripts/_test_builder_bdm_b1.mjs
import pg from 'pg'
import fs from 'fs'

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l))
  .map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const MIG = 'supabase/migrations/202610172312_builder_ban_do_moi.sql'
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()

let ok = 0, fail = 0
const kiem = (ten, dk, chiTiet = '') => { if (dk) { ok++; console.log('  ✔', ten) } else { fail++; console.log('  ✘', ten, chiTiet) } }
const q = async (sql, args) => (await c.query(sql, args)).rows
const loiKhi = async (sql, args) => {
  await c.query('savepoint s')
  try { await c.query(sql, args); await c.query('release savepoint s'); return null }
  catch (e) { await c.query('rollback to savepoint s'); return e.message }
}

try {
  await c.query('begin')
  await c.query(fs.readFileSync(MIG, 'utf8'))
  console.log('✔ migration áp được (trong transaction)')

  // ── 1. Cây chọn K7 ──
  let t0 = Date.now()
  const [{ cay }] = await q(`select fn_tl_bdm_cay_chon('7') cay`)
  const ms = Date.now() - t0
  const nhoms = cay.chu_de.flatMap((cd) => cd.chuyen_de.flatMap((ch) => ch.nhom))
  const dbs = nhoms.flatMap((n) => n.dang_bai)
  kiem(`cây K7: ${cay.chu_de.length} chủ đề · ${nhoms.length} nhóm · ${dbs.length} dạng bài · ${ms}ms`, nhoms.length > 0 && dbs.length > 0 && ms < 3000)
  const [{ n: so_cau_that }] = await q(`select count(*)::int n from _tl_bdm_cau_vi_tri('7') x
     join dai_bdm_dang_bai d on d.id = x.dang_bai_id join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
    where cd.khoi = '7' and cd.nhanh = 'toan'`)
  kiem('tổng so_cau trên cây = đếm thẳng', dbs.reduce((s, d) => s + d.so_cau, 0) === so_cau_that, `${dbs.reduce((s, d) => s + d.so_cau, 0)} vs ${so_cau_that}`)
  kiem('không có chuyên đề lọt vào khoá nhóm (bộ chọn vẫn có chuyên đề để tìm)', cay.chu_de.every((cd) => Array.isArray(cd.chuyen_de)))

  // nhóm A: ≥2 dạng bài có câu · nhóm B, C: nhóm khác có ≥1 dạng bài có câu
  const coCau = nhoms.filter((n) => n.dang_bai.filter((d) => d.so_cau >= 6).length >= 2)
  const A = coCau[0]
  const conLai = nhoms.filter((n) => n.id !== A?.id && n.dang_bai.some((d) => d.so_cau >= 3))
  const B = conLai[0], C = conLai[1]
  kiem('có đủ nhóm thử (A ≥2 dạng bài nhiều câu, B, C)', !!A && !!B && !!C)

  // ── 2. Kho câu của nhóm ──
  const [{ ds }] = await q(`select fn_tl_bdm_cau($1) ds`, [A.id])
  const dbA = new Set(A.dang_bai.map((d) => d.id))
  kiem(`fn_tl_bdm_cau(A): ${ds.length} câu, mọi câu thuộc dạng bài của A hoặc chưa phân`, ds.length > 0 && ds.every((x) => x.dang_bai_id === null || dbA.has(x.dang_bai_id)))

  // ── 3. Gợi ý ──
  const d1 = A.dang_bai.find((d) => d.so_cau >= 6)
  const [{ g }] = await q(`select fn_tl_bdm_goi_y($1, array[$2], '{"trac_nghiem":2,"tra_loi_ngan":2,"tu_luan":2}'::jsonb) g`, [A.id, d1.id])
  const loai = await q(`select ma_cau, loai_cau from dai_cau_hoi where ma_cau = any($1)`, [g])
  const demLoai = (l) => loai.filter((x) => x.loai_cau === l).length
  kiem(`gợi ý theo loại không vượt số xin (TN ${demLoai('trac_nghiem')} · TLN ${demLoai('tra_loi_ngan')} · TL ${demLoai('tu_luan')})`,
    demLoai('trac_nghiem') <= 2 && demLoai('tra_loi_ngan') <= 2 && demLoai('tu_luan') <= 2 && g.length > 0)
  kiem('gợi ý không trùng câu', new Set(g).size === g.length)
  const vi = await q(`select ma_cau, dang_bai_id from _tl_bdm_cau_vi_tri('7') where ma_cau = any($1)`, [g])
  kiem('gợi ý chỉ lấy câu của đúng dạng bài', vi.length === g.length && vi.every((x) => x.dang_bai_id === d1.id))
  const [{ g2 }] = await q(`select fn_tl_bdm_goi_y($1, array[$2], '{"trac_nghiem":2,"tra_loi_ngan":2,"tu_luan":2}'::jsonb, $3) g2`, [A.id, d1.id, g])
  kiem('p_tru loại đúng các câu đã đưa', g2.every((m) => !g.includes(m)))
  const [{ g3 }] = await q(`select fn_tl_bdm_goi_y($1, array[$2], '{"loai_khong_co":5,"_tong":3}'::jsonb) g3`, [A.id, d1.id])
  kiem(`_tong lấp đủ khi loại xin không có câu (${g3.length}/3)`, g3.length === Math.min(3, d1.so_cau))
  const dsA = A.dang_bai.filter((d) => d.so_cau > 0).map((d) => d.id)
  const [{ g4 }] = await q(`select fn_tl_bdm_goi_y($1, $2, '{"_tong":${dsA.length}}'::jsonb) g4`, [A.id, dsA])
  const vi4 = await q(`select distinct dang_bai_id from _tl_bdm_cau_vi_tri('7') where ma_cau = any($1)`, [g4])
  kiem(`BTVN rải đều: ${dsA.length} câu trải ${vi4.length}/${dsA.length} dạng bài`, vi4.length === dsA.length)

  // ── 4. Dựng giáo trình thử ──
  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do) values ('giao_trinh', '[TEST] builder bđ mới', '7', 'Toán', 'moi') returning id`)
  const [b1] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, 0, 'buoi', 'Buổi 1') returning id`, [tl.id])
  const [b2] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, 1, 'buoi', 'Buổi 2') returning id`, [tl.id])
  const dsAall = A.dang_bai.map((d) => d.id)
  const dB = B.dang_bai.find((d) => d.so_cau >= 3).id
  const chon1 = [{ nhom: A.id, dang_bai: dsAall }, { nhom: B.id, dang_bai: [dB] }]
  const [{ nd }] = await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb) nd`, [tl.id, b1.id, JSON.stringify(chon1)])
  // buổi 2: 1 nhóm (để kiểm buổi 1 sửa không xô buổi 2)
  await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb)`, [tl.id, b2.id, JSON.stringify([{ nhom: C.id, dang_bai: [C.dang_bai[0].id] }])])
  const bu = nd.buoi[0]
  kiem('trả đúng 1 buổi, 2 nhóm theo thứ tự chọn', nd.buoi.length === 1 && bu.nhom.map((n) => n.id).join() === [A.id, B.id].join())
  kiem('nhóm A đủ dạng bài theo thứ tự chọn, B chỉ 1 dạng bài lẻ', bu.nhom[0].dang_bai.map((d) => d.id).join() === dsAall.join() && bu.nhom[1].dang_bai.length === 1)
  kiem('mỗi nhóm có BTVN', bu.nhom.every((n) => n.btvn && n.btvn.caus.length > 0))
  const tatCa = bu.nhom.flatMap((n) => [...n.dang_bai.flatMap((d) => d.caus), ...(n.btvn?.caus ?? []), ...(n.chua_phan?.caus ?? [])])
  kiem(`không trùng câu trong buổi (${tatCa.length} câu)`, new Set(tatCa).size === tatCa.length)
  kiem('dạng bài có câu ⇒ có câu luyện (mặc định 2)', bu.nhom[0].dang_bai.filter((d) => A.dang_bai.find((x) => x.id === d.id).so_cau >= 2).every((d) => d.caus.length === 2))
  kiem('stt suy ra 1..n', bu.nhom.map((n) => n.stt).join() === '1,2' && bu.nhom[0].dang_bai.map((d) => d.stt).join() === dsAall.map((_, i) => i + 1).join())

  const thuTu = async () => q(`select id, loai_phan, ref_ma, cha_id from tai_lieu_phan where tai_lieu_id = $1 order by thu_tu, id`, [tl.id])
  let tt = await thuTu()
  const idx = (pred) => tt.findIndex(pred)
  const iB2 = idx((p) => p.id === b2.id)
  kiem('thứ tự: buổi 1 → nhóm A → dạng bài A… → nhóm B → dạng bài B → BTVN A → BTVN B → buổi 2',
    tt[0].id === b1.id && tt[1].ref_ma === A.id && tt[2 + dsAall.length].ref_ma === B.id
    && tt[iB2 - 2].loai_phan === 'btvn_nhom' && tt[iB2 - 2].ref_ma === A.id && tt[iB2 - 1].ref_ma === B.id)
  kiem('buổi 2 có phần riêng sau mốc buổi 2', tt.slice(iB2 + 1).every((p) => p.loai_phan !== 'buoi') && tt.length - iB2 - 1 === 3)

  // ── 5. Đổi lựa chọn: bỏ 1 dạng bài của A, bỏ B, thêm C (đảo lên đầu) ──
  const truoc = Object.fromEntries(bu.nhom[0].dang_bai.map((d) => [d.id, d.caus.join()]))
  const btvnATruoc = bu.nhom[0].btvn.caus.join()
  const giuA = dsAall.slice(1)
  const chon2 = [{ nhom: C.id, dang_bai: C.dang_bai.map((d) => d.id) }, { nhom: A.id, dang_bai: giuA }]
  const [{ nd2 }] = await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb) nd2`, [tl.id, b1.id, JSON.stringify(chon2)])
  const bu2 = nd2.buoi[0]
  kiem('sau đổi: thứ tự nhóm C, A', bu2.nhom.map((n) => n.id).join() === [C.id, A.id].join())
  kiem('dạng bài A còn giữ NGUYÊN câu đã có', bu2.nhom[1].dang_bai.every((d) => truoc[d.id] === d.caus.join()))
  kiem('BTVN A giữ nguyên (GV có thể đã chỉnh)', bu2.nhom[1].btvn.caus.join() === btvnATruoc)
  const [{ n: conB }] = await q(`select count(*)::int n from tai_lieu_phan where tai_lieu_id = $1 and cha_id = $2 and ref_ma = $3`, [tl.id, b1.id, B.id])
  kiem('nhóm B bị bỏ ⇒ hết phần của B (kể cả con, câu)', conB === 0)
  const [{ n: mo }] = await q(`select count(*)::int n from tai_lieu_cau tc where not exists (select 1 from tai_lieu_phan p where p.id = tc.phan_id)`)
  kiem('không có câu mồ côi', mo === 0)
  const tatCa2 = bu2.nhom.flatMap((n) => [...n.dang_bai.flatMap((d) => d.caus), ...(n.btvn?.caus ?? [])])
  kiem('vẫn không trùng câu trong buổi', new Set(tatCa2).size === tatCa2.length)
  tt = await thuTu()
  const iB2b = tt.findIndex((p) => p.id === b2.id)
  kiem('buổi 2 không bị xô', tt.slice(iB2b + 1).length === 3 && tt[iB2b + 1].ref_ma === C.id)
  const [{ n: le }] = await q(`select count(*)::int n from (select thu_tu from tai_lieu_phan where tai_lieu_id = $1 group by 1 having count(*) > 1) x`, [tl.id])
  kiem('thu_tu không trùng', le === 0)

  // ── 6. Đặt câu tay ──
  const dPhan = bu2.nhom[1].dang_bai[0]
  const cauKhacPhan = bu2.nhom[0].dang_bai[0].caus[0]
  let e = await loiKhi(`select fn_tl_bdm_dat_cau($1, $2)`, [dPhan.phan_id, [cauKhacPhan]])
  kiem('chặn câu đã dùng ở phần khác cùng buổi', e && e.includes('đã dùng'), e)
  e = await loiKhi(`select fn_tl_bdm_dat_cau($1, $2)`, [dPhan.phan_id, [...dPhan.caus].reverse()])
  const [{ ds3 }] = await q(`select array_agg(ma_cau order by thu_tu) ds3 from tai_lieu_cau where phan_id = $1`, [dPhan.phan_id])
  kiem('đặt lại thứ tự câu của chính phần đó được', !e && (ds3 ?? []).join() === [...dPhan.caus].reverse().join(), e)
  e = await loiKhi(`select fn_tl_bdm_dat_cau($1, $2)`, [dPhan.phan_id, [dPhan.caus[0], dPhan.caus[0]]])
  kiem('chặn danh sách lặp câu', e && e.includes('lặp'), e)
  e = await loiKhi(`select fn_tl_bdm_dat_cau($1, $2)`, [bu2.nhom[1].phan_id, ['X']])
  kiem('phần nhóm không nhận câu', e && e.includes('không nhận'), e)

  // ── 7. Đầu vào sai / sai loại tài liệu ──
  e = await loiKhi(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb)`, [tl.id, b1.id, JSON.stringify([{ nhom: A.id, dang_bai: [B.dang_bai[0].id] }])])
  kiem('chặn dạng bài không thuộc nhóm', e && e.includes('không thuộc'), e)
  e = await loiKhi(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb)`, [tl.id, b1.id, JSON.stringify([{ nhom: A.id, dang_bai: [] }, { nhom: A.id, dang_bai: [] }])])
  kiem('chặn chọn 1 nhóm 2 lần', e && e.includes('2 lần'), e)
  const [tlCu] = await q(`insert into tai_lieu (loai, ten, khoi, mon) values ('giao_trinh', '[TEST] cũ', '7', 'Toán') returning id`)
  const [bCu] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, 0, 'buoi', 'Buổi 1') returning id`, [tlCu.id])
  e = await loiKhi(`select fn_tl_bdm_dat_buoi($1, $2, '[]'::jsonb)`, [tlCu.id, bCu.id])
  kiem('giáo trình ban_do=cu bị từ chối', e && e.includes('bản đồ mới'), e)
  const [{ bd }] = await q(`select ban_do bd from tai_lieu where id = $1`, [tlCu.id])
  kiem('tài liệu cũ mặc định ban_do=cu', bd === 'cu')
  e = await loiKhi(`update tai_lieu set ban_do = 'xyz' where id = $1`, [tlCu.id])
  kiem('CHECK ban_do chặn giá trị lạ', e && e.includes('check'), e)
  await q(`update tai_lieu set luu_tru_tu = $1 where id = $2`, [tlCu.id, tl.id])
  e = await loiKhi(`select fn_tl_bdm_dat_buoi($1, $2, '[]'::jsonb)`, [tl.id, b1.id])
  kiem('bản lưu trữ chỉ xem (không sửa được)', e && e.includes('lưu trữ'), e)
  await q(`update tai_lieu set luu_tru_tu = null where id = $1`, [tl.id])

  // ── 8. Nhóm chưa có dạng bài (khối 4) ──
  const [{ cay4 }] = await q(`select fn_tl_bdm_cay_chon('4') cay4`)
  const N4 = cay4.chu_de.flatMap((cd) => cd.chuyen_de.flatMap((ch) => ch.nhom)).find((n) => n.dang_bai.length === 0 && n.so_cau_chua_phan >= 3)
  if (N4) {
    const [tl4] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do) values ('giao_trinh', '[TEST] k4', '4', 'Toán', 'moi') returning id`)
    const [b4] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, 0, 'buoi', 'Buổi 1') returning id`, [tl4.id])
    const [{ nd4 }] = await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb) nd4`, [tl4.id, b4.id, JSON.stringify([{ nhom: N4.id, dang_bai: [] }])])
    const n4 = nd4.buoi[0].nhom[0]
    kiem(`nhóm không có dạng bài ⇒ câu luyện vào "chưa phân" (${n4.chua_phan?.caus.length ?? 0} câu) + BTVN`, (n4.chua_phan?.caus.length ?? 0) > 0 && n4.btvn.caus.length > 0)
  } else kiem('tìm được nhóm K4 không dạng bài có câu để thử', false)

  // ── 9. Nội dung cả giáo trình + quyền ──
  const [{ nd_all: ndAll }] = await q(`select fn_tl_bdm_noi_dung($1) nd_all`, [tl.id])
  kiem('noi_dung cả giáo trình: 2 buổi đúng thứ tự', ndAll.buoi.map((b) => b.tieu_de).join() === 'Buổi 1,Buổi 2')
  const [{ ly }] = await q(`select (fn_tl_bdm_noi_dung($1)->'buoi'->0->'nhom'->1->'ly_thuyet') is not null ly`, [tl.id])
  kiem('nội dung mang lý thuyết nhóm (để in)', ly)
  const quyen = await q(`select p.proname, has_function_privilege('anon', p.oid, 'execute') anon, has_function_privilege('authenticated', p.oid, 'execute') auth
                           from pg_proc p where p.proname like '%tl_bdm%'`)
  kiem(`anon không gọi được ${quyen.length} hàm; authenticated gọi được`, quyen.length === 12 && quyen.every((r) => !r.anon && r.auth), JSON.stringify(quyen.filter((r) => r.anon || !r.auth)))
} catch (err) {
  fail++
  console.log('✘ LỖI:', err.message, err.where ?? '')
} finally {
  await c.query('rollback')
  await c.end()
  console.log(`\n${ok} đạt · ${fail} hỏng — đã ROLLBACK, DB không đổi`)
  process.exit(fail ? 1 : 0)
}
