// "Chuyên đề Hình Giữa kì 1" (khối 9) — Thùy 04/11: "Làm 1 file chuyên đề giống khối 7, 8, tuyển tập các bài hình giữa kì 1 lớp 9".
// Khuôn = scripts/_cd_hinh_gk1_7.mjs (K7, K8): tai_lieu loai 'chuyen_de' ban_do 'moi' nhanh 'hinh', ghi qua RPC builder fn_tl_hl_*.
// Khác K7/K8 ở hai chỗ:
//  (1) Nguồn = bài kho Hình–Luyện K9 mà câu nguồn nằm trong đề / đề cương GIỮA học kì (kho K9 còn có cả bài CUỐI kì — không lấy).
//  (2) Thùy 04/11 (lần 2): CHỈ bài hình 3–4 ý (chuẩn 2,5 điểm). Bỏ bài biểu thức lượng giác, giải tam giác thuần số, bài thực tế
//      (nhận bằng từ khoá trên chữ có dấu — chỉ để lọc tài liệu ôn tập, không ghi gì lên bài kho) và bài 1–2 ý.
//      Bài chưa gán mô hình (gần hết) vào một phần "Bài hình 3–4 ý"; bản đầu (167 bài, 5 phần) đã xoá bằng _xoa_cd_hinh_gk1_9.mjs.
//   node scripts/_cd_hinh_gk1_9.mjs --thu   → ROLLBACK, in kết quả
//   node scripts/_cd_hinh_gk1_9.mjs         → ghi thật (từ chối nếu đã có chuyên đề cùng tên + khối)
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const THU = process.argv.includes('--thu')
const KHOI = '9'
const TEN = 'Chuyên đề Hình Giữa kì 1'

const dau = (s) => String(s ?? '').replace(/\\(sin|cos|tan|cot)/g, ' $1 ').replace(/\$/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, ' ').toLowerCase()
// 4 chủ đề (thứ tự mục lục)
const CHU_DE = [
  ['A', 'Tính giá trị biểu thức lượng giác'],
  ['B', 'Giải tam giác vuông · hệ thức cạnh và góc'],
  ['C', 'Bài toán thực tế (tháp, thang, dốc, bóng nắng…)'],
  ['D', 'Bài toán hình tổng hợp (chứng minh · tính)'],
]
const chuDe = (t) => {
  const thucTe = /tháp|thang|bóng|tia nắng|máy bay|tàu|dốc|đồi|núi|toà|tòa|cột|cây|quan sát|xích đu|diều|cầu|thuyền|ca nô|sông|biển|hải đăng|nóc|đèn|mái|người ta|chiếc/.test(t)
  const bieuThuc = /rút gọn|so sánh|sắp xếp|tính giá trị|biểu thức|không dùng máy/.test(t) && !/tam giác|hình/.test(t.slice(0, 120))
  const chungMinh = /chứng minh|chứng tỏ/.test(t)
  if (bieuThuc) return 'A'
  if (thucTe && !chungMinh) return 'C'
  if (chungMinh) return 'D'
  return 'B'
}
const GK_SQL = `and exists (select 1 from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id join tai_lieu t on t.id = p.tai_lieu_id
                              where tc.ma_cau = b.nguon_ma_cau and t.loai = 'de_thi' and t.ten ilike '%giữa học kì%')`
const theoLoai = (a, b) => (a.loai_cau === 'tu_luan' ? 0 : 1) - (b.loai_cau === 'tu_luan' ? 0 : 1) || a.ma_bai.localeCompare(b.ma_bai)

try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const [daCo] = await q(`select id from tai_lieu where loai = 'chuyen_de' and ten = $1 and khoi = $2`, [TEN, KHOI])
  if (daCo) throw new Error(`Đã có "${TEN}" khối ${KHOI} (${daCo.id}) — không tạo bản thứ 2.`)

  const bai = await q(`select b.ma_bai, b.loai_cau, m.id mh_id, m.ma mh_ma, nm.id nhom_id, nm.ten nhom, nm.thu_tu nhom_tt, cd.thu_tu cd_tt,
                              (select count(*) from hinh_y y2 where y2.bai_id = b.id) ny,
                              coalesce(b.gia_thiet_chung, '') || ' ' || coalesce(b.de_bai, '') || ' ' || coalesce((select string_agg(y.noi_dung, ' ¦ ' order by y.thu_tu) from hinh_y y where y.bai_id = b.id), '') txt
                         from hinh_bai b left join hinh_mo_hinh m on m.id = b.mo_hinh_id
                         left join hinh_nhom_mo_hinh nm on nm.id = m.nhom_mh_id left join dai_bdm_chu_de cd on cd.id = m.chu_de_id
                        where b.khoi = $1 and b.bo_qua_at is null ${GK_SQL} order by b.ma_bai`, [KHOI])
  // Thùy 04/11: CHỈ bài hình 3–4 ý (chuẩn 2,5 điểm); bỏ biểu thức lượng giác (A), giải tam giác thuần số (B) và bài thực tế (C).
  const ban = []
  for (let i = bai.length - 1; i >= 0; i--) {
    const b = bai[i]
    const cd = chuDe(dau(b.txt))
    if (cd === 'A' || cd === 'C' || Number(b.ny) < 3 || Number(b.ny) > 4) { ban.push(b); bai.splice(i, 1) }
  }
  console.log(`Bỏ ${ban.length} bài (biểu thức / thực tế / không phải 3–4 ý) · giữ ${bai.length}`)
  if (!bai.length) throw new Error('Không có bài giữa kì nào ở Hình–Luyện K9.')
  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, nhanh, ban_do) values ('chuyen_de', $1, $2, 'Toán', 'hinh', 'moi') returning id`, [TEN, KHOI])
  const nhom = [...new Map(bai.filter((b) => b.nhom_id).sort((a, b) => a.cd_tt - b.cd_tt || a.nhom_tt - b.nhom_tt).map((b) => [b.nhom_id, b.nhom])).entries()]
  // phần mới đứng SAU mọi dòng đã có (fn_tl_hl_dat_mo_hinh đánh số lại cả tài liệu ⇒ không dùng đếm tay, sẽ trùng số)
  const sau = async () => (await q(`select coalesce(max(thu_tu), -1) + 1 m from tai_lieu_phan where tai_lieu_id = $1`, [tl.id]))[0].m
  for (const [nhomId, nhomTen] of nhom) {
    const [p] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, $2, 'buoi', $3) returning id`, [tl.id, await sau(), nhomTen])
    const cua = bai.filter((b) => b.nhom_id === nhomId)
    const mhs = [...new Map(cua.sort((a, b) => a.mh_ma.localeCompare(b.mh_ma)).map((b) => [b.mh_id, b.mh_ma])).keys()]
    const thuTu = await q(`select id from hinh_mo_hinh where id = any($1) order by thu_tu nulls last, ma`, [mhs])
    const [{ nd }] = await q(`select fn_tl_hl_dat_mo_hinh($1, $2, $3) nd`, [tl.id, p.id, thuTu.map((r) => r.id)])
    for (const m of nd.buoi[0].mo_hinh) {
      const ds = cua.filter((b) => b.mh_id === m.id).sort(theoLoai)
      await q(`select fn_tl_hl_dat_bai($1, $2)`, [m.phan_id, ds.map((b) => b.ma_bai)])
    }
  }
  const chuaMh = bai.filter((b) => !b.mh_id)
  if (chuaMh.length) {
    const [p] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, $2, 'buoi', $3) returning id`, [tl.id, await sau(), 'Bài hình 3–4 ý'])
    const [{ k }] = await q(`select fn_tl_hl_them_khoi_khac($1, $2) k`, [tl.id, p.id])
    await q(`select fn_tl_hl_dat_bai($1, $2)`, [k, chuaMh.sort(theoLoai).map((b) => b.ma_bai)])
  }

  const [{ kq }] = await q(`select fn_tl_hl_noi_dung($1) kq`, [tl.id])
  let tong = 0
  for (const p of kq.buoi) {
    const n = p.mo_hinh.reduce((s, m) => s + m.bai.length, 0) + (p.khac?.bai.length ?? 0); tong += n
    console.log(`• ${p.tieu_de} — ${n} bài: ${p.mo_hinh.map((m) => `${m.ma} ${m.ten} (${m.bai.length})`).join(' · ')}${p.khac ? `${p.mo_hinh.length ? ' · ' : ''}khác (${p.khac.bai.length})` : ''}`)
  }
  console.log(`Tổng ${tong}/${bai.length} bài · tai_lieu ${tl.id}`)
  if (tong !== bai.length) throw new Error('Số bài trong chuyên đề khác số bài kho — dừng, không ghi.')
  if (THU) { await q('rollback'); console.log('--thu ⇒ ROLLBACK, không ghi gì') } else { await q('commit'); console.log('ĐÃ GHI.') }
} catch (e) { await q('rollback'); console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
