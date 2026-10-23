// Kiểm hạ tầng chọn / chụp câu theo DẠNG BÀI MỚI (nhánh registry 'bdm') — TRONG ROLLBACK: node scripts/_test_mastery_bdm_b3.mjs
// ⚠ 202610231553: bổ trợ GIỮ mastery cũ ⇒ điền dạng yếu KHÔNG còn ra NDB (xem _test_mastery_bdm_tach.mjs). File này giữ phần
// chi tiết ca + chọn/chụp câu cho mã NDB (dùng cho tự luyện mới); dạng NDB lấy thẳng từ bdm_cau_hoi nếu ca không có.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  await q(`select fn_he_thong_cong_tac_dat('mastery_ban_do_moi', true)`)
  const cases = await q(`select y.id, y.hoc_sinh_id, h.khoi, (select bh.buoi_hoc_id from buoi_hoc_hs bh where bh.bo_tro_yeu_id = y.id order by bh.created_at desc limit 1) buoi
                           from bo_tro_yeu y join hoc_sinh h on h.id = y.hoc_sinh_id
                          where y.trang_thai = 'dang_xu' and y.mon = 'Toán' and h.khoi in ('6','7','8','9','10','11','12') order by y.created_at desc limit 10`)
  let ca = null, ndb = []
  for (const x of cases) {
    const truoc = (await q(`select count(*)::int n from bo_tro_yeu_dang where bo_tro_yeu_id = $1`, [x.id]))[0].n
    await q(`select fn_btyeu_fill_dang_yeu($1)`, [x.id])
    ndb = (await q(`select ma_dang from bo_tro_yeu_dang where bo_tro_yeu_id = $1 and ma_dang like 'NDB%' and dong_at is null`, [x.id])).map((r) => r.ma_dang)
    if (ndb.length && x.buoi) { ca = { ...x, truoc }; break }
  }
  if (!ca) ndb = (await q(`select dang_chinh from bdm_cau_hoi where kho_chuan and loai_cau = 'trac_nghiem' group by 1 order by count(*) desc limit 1`)).map((r) => r.dang_chinh)
  kt(ndb.length > 0, `dạng bài NDB để thử: ${ndb[0]}`)
  if (ndb.length) {
    const ten = (await q(`select _kho_ten_dang('Toán', $1) t`, [ndb[0]]))[0].t
    kt(!!ten, `tra tên dạng NDB: ${ten}`)
    // Sinh bài luyện thật đòi phiên HS + ca mở hôm nay + điểm danh ⇒ thử đúng 2 bước bị bản đồ mới ảnh hưởng:
    // chọn câu (registry nhánh 'bdm' → bdm_cau_hoi) + chụp câu vào bài test (_kho_snapshot_cau qua bộ view bdm_*).
    try {
      const nh = (await q(`select _kho_nhanh_cua_dang('Toán', $1) nh`, [ndb[0]]))[0].nh
      const tbl = (await q(`select _kho_cau_tbl('Toán', $1) t, _kho_lt_tbl('Toán', $1) lt`, [nh]))[0]
      const caus = (await q(`select _btyeu_chon_cau_khac($1, $2, null, '{}', 5, 2) x`, [tbl.t, ndb[0]]))[0].x
      kt(nh === 'bdm' && caus.length > 0, `chọn câu dạng ${ndb[0]} qua ${tbl.t}: ${caus.length} câu`)
      const [bt] = await q(`select id from bai_test order by created_at desc limit 1`)
      for (const [i, m] of caus.entries()) await q(`select _kho_snapshot_cau($1, $2, $3, $4, $5)`, [bt.id, tbl.t, tbl.lt, m, 9000 + i])
      const cau = await q(`select ma_cau, ma_dang, loai_cau, dap_an_key from bai_test_cau where bai_test_id = $1 and thu_tu >= 9000 order by thu_tu`, [bt.id])
      kt(cau.length === caus.length && cau.every((x) => x.ma_dang === ndb[0] && x.dap_an_key != null), `chụp ${cau.length} câu vào bài test: mã dạng = ${ndb[0]}, có đáp án (${cau.map((x) => x.loai_cau).join(', ')})`)
    } catch (e) { kt(false, 'chọn / chụp câu lỗi: ' + e.message) }
  }
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
