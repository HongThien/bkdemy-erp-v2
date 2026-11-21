// 5t-ghi-ban-do-chi-tiet.mjs — áp BẢN CHI TIẾT (docs/de-xuat-5T-ban-do-chi-tiet.html, Thùy chốt là bản chuẩn 21/11) lên bản đồ 5T,
// thay phần "bản gọn" đã ghi 09:09 (14 dạng NDB03357–03370, 0 câu gán — TÁI SỬ DỤNG, không xoá gì).
//   · chủ đề thứ 6 «Suy luận và toán điển hình» (H6) · chuyển chuyên đề «Các bài toán logic thường gặp» về đó + đổi tên «Tỉ lệ và công việc» (H7, H9)
//   · 3 nhóm Giả thiết tạm / Hai hiệu số / Tính ngược → chuyên đề mới «Phương pháp giải toán điển hình» (H8)
//   · 5 chuyên đề mới (Tổng – hiệu · Phương pháp giải toán điển hình · Nguyên lí Dirichlet · Bất biến và trò chơi · Hình chữ nhật và hình vuông)
//   · 27 dạng (P01–P28 trừ P25 — HỎI, chưa quyết) có mô tả + LÝ THUYẾT + VÍ DỤ (kho-rules/dai/lo/me5-250/5T-dang-moi-chi-tiet.json)
//   · 18 dòng nới mô tả dạng có sẵn (W01–W18, chỉ NỐI THÊM vào cuối mô tả) · chính tả chuyên đề «phầm».
// Không làm: S01/S02/S06 (viết lại mô tả/lý thuyết cũ), S04 (xoá chuyên đề rỗng), S05, S07, S08, H10, P25 — chờ Thùy.
//   node scripts/kho/5t-ghi-ban-do-chi-tiet.mjs [--ghi]    (mặc định chạy thử rồi ROLLBACK; chạy lại an toàn)
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const D = JSON.parse(readFileSync('kho-rules/dai/lo/me5-250/5T-dang-moi-chi-tiet.json', 'utf8'))
const CD6 = 'Suy luận và toán điển hình'
const BTS = 'NCD00215', CTS = 'NCD00240', CD_HINH = 'NCD00243', CD_CD = 'NCD00242'
const CH_TISO = 'NCH00545', CH_DB = 'NCH00663', CH_LOGIC = 'NCH00547', CH_MINE = 'NCH00686'

// P → nhóm đích. id có sẵn (NNBxxxxx) hoặc khoá nhóm mới
const P_NHOM = { P01: 'NNB02146', P02: 'NNB02157', P28: 'NNB02152', P03: 'NNB02160', P04: 'NNB02160', P05: 'NNB02161', P06: 'TH', P07: 'TH', P08: 'TH', P09: 'BD', P10: 'BD', P11: 'NNB01806', P12: 'NNB01803', P13: 'NNB01803', P14: 'NNB02088', P15: 'TK', P16: 'DV', P17: 'DV', P18: 'DV', P19: 'HCN', P20: 'HCN', P21: 'NNB02179', P22: 'NNB02178', P23: 'DIR', P24: 'DIR', P26: 'LG', P27: 'BB' }
// dòng cũ của bản gọn dùng lại (0 câu): P → NDB
const REUSE = { P06: 'NDB03357', P08: 'NDB03358', P09: 'NDB03359', P16: 'NDB03360', P17: 'NDB03361', P22: 'NDB03362', P01: 'NDB03363', P03: 'NDB03364', P26: 'NDB03365', P23: 'NDB03366', P27: 'NDB03367', P02: 'NDB03368', P15: 'NDB03369', P24: 'NDB03370' }
// nhóm mới: khoá → { tên mới, tên cũ của bản gọn (dùng lại), chuyên đề đích: khoá }
const NHOM_MOI = {
  TH: { ten: 'Bài toán tổng – hiệu hai số', cu: 'Tổng – hiệu hai số (nền, chưa có tỉ số)', cd: BTS, ch: 'TONGHIEU', mo_ta: 'Bài tìm hai (hoặc ba) số khi biết tổng và hiệu, chưa có tỉ số; nền cho mọi bài tổng–tỉ, hiệu–tỉ phía sau.' },
  BD: { ten: 'Tỉ lệ bản đồ', cu: 'Lịch và đồng hồ', cd: BTS, ch: CH_TISO, mo_ta: 'Đổi độ dài, diện tích giữa bản đồ tỉ lệ 1 : n và thực tế.' },
  TK: { ten: 'Thống kê sơ cấp', cu: 'Thống kê – xác suất – đếm theo nhóm', cd: BTS, ch: CH_TISO, mo_ta: 'Tỉ số số lần xuất hiện khi tung đồng xu, xúc xắc, đọc bảng số liệu.' },
  DV: { ten: 'Đổi vận tốc / đổi hướng giữa chừng', cu: 'Cực trị – xếp, ghép', cd: CD_CD, ch: CH_DB, mo_ta: 'Chuyển động có đổi vận tốc, đổi hướng, quay về giữa đường: tỉ lệ nghịch trên đoạn còn lại, dốc lên – dốc xuống.' },
  HCN: { ten: 'Chu vi – diện tích', cu: null, cd: CD_HINH, ch: 'HCN', mo_ta: 'Chu vi, diện tích hình chữ nhật, hình vuông trong bài thực tế và bài có nửa chu vi.' },
  DIR: { ten: 'Nguyên lí Dirichlet', cu: 'Nguyên lí Dirichlet', cd: 'CD6', ch: 'DIR', mo_ta: 'Bài "lấy ít nhất bao nhiêu để chắc chắn có…": xét trường hợp xấu nhất rồi cộng thêm 1.' },
  LG: { ten: 'Suy luận lô-gic', cu: 'Lô-gic – suy luận', cd: 'CD6', ch: CH_MINE, mo_ta: 'Bài suy luận chặt chẽ từ các dữ kiện: nói thật – nói dối, bảng loại trừ, xếp hạng.' },
  BB: { ten: 'Bất biến và trò chơi', cu: 'Trò chơi – thao tác lặp – bất biến', cd: 'CD6', ch: 'BB', mo_ta: 'Bài thực hiện lặp một thao tác hoặc trò chơi: tìm đại lượng không đổi (chẵn lẻ, số dư, tổng).' },
}
const CHUYEN_MOI = { TONGHIEU: 'Tổng – hiệu', PP: 'Phương pháp giải toán điển hình', DIR: 'Nguyên lí Dirichlet', BB: 'Bất biến và trò chơi', HCN: 'Hình chữ nhật và hình vuông' }

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const q = async (s, p = []) => (await c.query(s, p)).rows
const one = async (s, p = []) => { const r = await q(s, p); if (r.length !== 1) throw new Error(`mong 1 dòng, được ${r.length}: ${s.slice(0, 90)} ${JSON.stringify(p)}`); return r[0] }
const dem = async () => (await q(`select
  (select count(*) from dai_bdm_chu_de where khoi='5T')::int chu_de,
  (select count(distinct nh.chuyen_de_id) from dai_bdm_nhom nh join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T')::int chuyen_de,
  (select count(*) from dai_bdm_nhom nh join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T')::int nhom,
  (select count(*) from dai_bdm_dang_bai d join dai_bdm_nhom nh on nh.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T')::int dang,
  (select count(*) from bdm_cau_dang x join dai_bdm_dang_bai d on d.id=x.dang_bai_id join dai_bdm_nhom nh on nh.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T')::int cau_gan`))[0]
const o = async (cd, ch) => c.query(`insert into dai_bdm_o (chu_de_id, chuyen_de_id) values ($1,$2) on conflict do nothing`, [cd, ch])
try {
  await c.query('begin')
  const truoc = await dem()
  // ---- chủ đề 6
  let cd6 = (await q(`select id from dai_bdm_chu_de where khoi='5T' and ten=$1`, [CD6]))[0]
  if (!cd6) cd6 = (await q(`insert into dai_bdm_chu_de (khoi, ten) values ('5T', $1) returning id`, [CD6]))[0]
  const CD = { CD6: cd6.id }
  const cdId = (k) => CD[k] ?? k
  // ---- chuyên đề
  const CH = { [CH_TISO]: CH_TISO, [CH_DB]: CH_DB, [CH_LOGIC]: CH_LOGIC, [CH_MINE]: CH_MINE }
  // dùng lại chuyên đề của bản gọn làm «Suy luận lô-gic»: đổi tên + chuyển ô sang chủ đề 6 (nhóm đi theo)
  await c.query(`update dai_bdm_chuyen_de set ten='Suy luận lô-gic' where id=$1`, [CH_MINE])
  await c.query(`update dai_bdm_o set chu_de_id=$1 where chu_de_id=$2 and chuyen_de_id=$3`, [cd6.id, CTS, CH_MINE])
  // H7 + H9: chuyên đề cũ «Các bài toán logic thường gặp» → chủ đề 6, đổi tên «Tỉ lệ và công việc»
  await c.query(`update dai_bdm_o set chu_de_id=$1 where chu_de_id=$2 and chuyen_de_id=$3`, [cd6.id, BTS, CH_LOGIC])
  await c.query(`update dai_bdm_chuyen_de set ten='Tỉ lệ và công việc' where id=$1`, [CH_LOGIC])
  // chuyên đề mới
  const chuDeCua = { TONGHIEU: BTS, PP: cd6.id, DIR: cd6.id, BB: cd6.id, HCN: CD_HINH }
  for (const [k, ten] of Object.entries(CHUYEN_MOI)) {
    const cdk = chuDeCua[k]
    let ch = (await q(`select ch.id from dai_bdm_chuyen_de ch join dai_bdm_o o on o.chuyen_de_id=ch.id where ch.ten=$1 and o.chu_de_id=$2`, [ten, cdk]))[0]
    if (!ch) ch = (await q(`insert into dai_bdm_chuyen_de (ten, mo_ta) values ($1,'') returning id`, [ten]))[0]
    await o(cdk, ch.id); CH[k] = ch.id
  }
  // chính tả chuyên đề (S03)
  await c.query(`update dai_bdm_chuyen_de set ten='Tỉ số phần trăm' where id='NCH00638' and ten='Tỉ số phầm trăm'`)
  // H8: 3 nhóm → «Phương pháp giải toán điển hình»
  for (const id of ['NNB02166', 'NNB02165', 'NNB02169']) await c.query(`update dai_bdm_nhom set chu_de_id=$2, chuyen_de_id=$3 where id=$1`, [id, cd6.id, CH.PP])
  // ---- nhóm mới (dùng lại nhóm của bản gọn theo tên cũ)
  const NH = {}
  for (const [k, v] of Object.entries(NHOM_MOI)) {
    const cdk = cdId(v.cd), chk = CH[v.ch] ?? v.ch
    let nh = (await q(`select id from dai_bdm_nhom where ten=$1 and chu_de_id=$2 and chuyen_de_id=$3`, [v.ten, cdk, chk]))[0]
    if (!nh && v.cu) {
      const cu = (await q(`select id from dai_bdm_nhom where ten=$1 and chu_de_id in ($2,$3,$4)`, [v.cu, CTS, cd6.id, BTS]))[0]
      if (cu) { await o(cdk, chk); await c.query(`update dai_bdm_nhom set chu_de_id=$2, chuyen_de_id=$3, ten=$4, mo_ta=$5 where id=$1`, [cu.id, cdk, chk, v.ten, v.mo_ta]); nh = cu }
    }
    if (!nh) { await o(cdk, chk); nh = (await q(`insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta) values ($1,$2,$3,$4) returning id`, [cdk, chk, v.ten, v.mo_ta]))[0] }
    NH[k] = nh.id
  }
  // ---- dạng: P → dòng cũ dùng lại hoặc thêm mới
  let nDangMoi = 0, nTaiDung = 0, nCapNhat = 0
  const dangId = {}
  for (const [pk, nk] of Object.entries(P_NHOM)) {
    const P = D.p[pk]; if (!P || !P.lt || !P.vd || !P.mo_ta) throw new Error('thiếu dữ liệu ' + pk)
    const nhomId = NH[nk] ?? nk
    const theoTen = (await q(`select id from dai_bdm_dang_bai where nhom_id=$1 and ten=$2`, [nhomId, P.ten]))[0]
    const cu = REUSE[pk] && (await q(`select id, nhom_id from dai_bdm_dang_bai where id=$1`, [REUSE[pk]]))[0]
    if (theoTen) { await c.query(`update dai_bdm_dang_bai set mo_ta=$2, ly_thuyet=$3, vi_du=$4 where id=$1`, [theoTen.id, P.mo_ta, P.lt, P.vd]); dangId[pk] = theoTen.id; nCapNhat++ }
    else if (cu) { await c.query(`update dai_bdm_dang_bai set nhom_id=$2, ten=$3, mo_ta=$4, ly_thuyet=$5, vi_du=$6 where id=$1`, [cu.id, nhomId, P.ten, P.mo_ta, P.lt, P.vd]); dangId[pk] = cu.id; nTaiDung++ }
    else { dangId[pk] = (await q(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, vi_du) values ($1,$2,$3,$4,$5) returning id`, [nhomId, P.ten, P.mo_ta, P.lt, P.vd]))[0].id; nDangMoi++ }
  }
  // ---- W01–W18: nối thêm vào cuối mô tả dạng có sẵn
  let nW = 0
  for (const w of D.w) for (const id of w.ids) {
    const r = await c.query(`update dai_bdm_dang_bai set mo_ta = rtrim(mo_ta) || ' Gồm cả: ' || $2 || '.' where id=$1 and position($2 in mo_ta) = 0 returning id`, [id, w.them])
    nW += r.rowCount
  }
  const sau = await dem()
  // ---- kiểm
  const thieu = await q(`select d.id, d.ten from dai_bdm_dang_bai d where d.id = any($1) and (coalesce(mo_ta,'')='' or coalesce(ly_thuyet,'')='' or coalesce(vi_du,'')='')`, [Object.values(dangId)])
  const nhomRong = await q(`select nh.id, nh.ten from dai_bdm_nhom nh join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T' and not exists (select 1 from dai_bdm_dang_bai d where d.nhom_id=nh.id)`)
  const chRong = await q(`select ch.id, ch.ten from dai_bdm_chuyen_de ch join dai_bdm_o o on o.chuyen_de_id=ch.id join dai_bdm_chu_de cd on cd.id=o.chu_de_id where cd.khoi='5T' and not exists (select 1 from dai_bdm_nhom n where n.chuyen_de_id=ch.id and n.chu_de_id=o.chu_de_id)`)
  const sai_o = await q(`select nh.id from dai_bdm_nhom nh join dai_bdm_chu_de cd on cd.id=nh.chu_de_id where cd.khoi='5T' and not exists (select 1 from dai_bdm_o o where o.chu_de_id=nh.chu_de_id and o.chuyen_de_id=nh.chuyen_de_id)`)
  console.log({ truoc, sau, dang: { moi: nDangMoi, dung_lai_dong_ban_gon: nTaiDung, cap_nhat_lan_2: nCapNhat }, nhom_noi_mo_ta_W: nW, dang_thieu_mo_ta_lt_vd: thieu.length, nhom_rong: nhomRong, chuyen_de_rong_trong_5T: chRong })
  if (thieu.length) throw new Error('dạng mới thiếu mô tả/lý thuyết/ví dụ')
  if (sai_o.length) throw new Error('nhóm lệch ô')
  if (sau.cau_gan !== truoc.cau_gan) throw new Error('số câu gán đổi — ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
