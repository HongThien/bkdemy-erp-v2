// "Chuyên đề Hình Cuối kì 1" (khối 8) — Thùy 13/11: "làm thành chuyên đề hình cuối kì 1 như giữa kì", CHỈ bài hình nhiều ý (bài 4), không lấy câu Thalès dễ.
// Khuôn = scripts/_cd_hinh_gk1_9.mjs: tai_lieu loai 'chuyen_de' ban_do 'moi' nhanh 'hinh', ghi qua RPC builder fn_tl_hl_*.
// Nguồn = bài Hình–Luyện K8 (hinh_bai) có câu nguồn nằm trong đề / đề cương CUỐI học kì, đã tách ≥3 ý. Bài chưa gán mô hình ⇒ phần "Bài hình nhiều ý".
//   node scripts/_cd_hinh_ck1_8.mjs --thu   → ROLLBACK, in kết quả
//   node scripts/_cd_hinh_ck1_8.mjs         → ghi thật (từ chối nếu đã có chuyên đề cùng tên + khối)
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const THU = process.argv.includes('--thu')
const KHOI = '8'
const TEN = 'Chuyên đề Hình Cuối kì 1'
const CK_SQL = `and exists (select 1 from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id join tai_lieu t on t.id = p.tai_lieu_id
                              where tc.ma_cau = b.nguon_ma_cau and t.loai = 'de_thi' and t.ten ilike '%cuối%')`
const theoLoai = (a, b) => (a.loai_cau === 'tu_luan' ? 0 : 1) - (b.loai_cau === 'tu_luan' ? 0 : 1) || a.ma_bai.localeCompare(b.ma_bai)
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const [daCo] = await q(`select id from tai_lieu where loai = 'chuyen_de' and ten = $1 and khoi = $2`, [TEN, KHOI])
  if (daCo && !process.argv.includes('--lam-lai')) throw new Error(`Đã có "${TEN}" khối ${KHOI} (${daCo.id}) — không tạo bản thứ 2 (thêm --lam-lai để dựng lại: xoá chỉ các dòng tham chiếu của chuyên đề này).`)
  if (daCo) {   // dựng lại: chuyên đề chỉ gồm dòng tham chiếu (tai_lieu_phan/tai_lieu_cau → mã bài kho) — bài kho Hình–Luyện KHÔNG bị đụng
    await q(`delete from tai_lieu_cau where phan_id in (select id from tai_lieu_phan where tai_lieu_id = $1)`, [daCo.id])
    await q(`update tai_lieu_phan set cha_id = null where tai_lieu_id = $1`, [daCo.id])
    await q(`delete from tai_lieu_phan where tai_lieu_id = $1`, [daCo.id])
    await q(`delete from tai_lieu where id = $1`, [daCo.id])
  }
  const bai = await q(`select b.ma_bai, b.loai_cau, m.id mh_id, m.ma mh_ma, nm.id nhom_id, nm.ten nhom, nm.thu_tu nhom_tt, cd.thu_tu cd_tt,
                              (select count(*) from hinh_y y2 where y2.bai_id = b.id) ny
                         from hinh_bai b left join hinh_mo_hinh m on m.id = b.mo_hinh_id
                         left join hinh_nhom_mo_hinh nm on nm.id = m.nhom_mh_id left join dai_bdm_chu_de cd on cd.id = m.chu_de_id
                        where b.khoi = $1 and b.bo_qua_at is null ${CK_SQL} order by b.ma_bai`, [KHOI])
  for (let i = bai.length - 1; i >= 0; i--) if (Number(bai[i].ny) < 3) bai.splice(i, 1)
  console.log(`Bài cuối kì ≥3 ý: ${bai.length}`)
  if (!bai.length) throw new Error('Không có bài cuối kì nào ở Hình–Luyện K8.')
  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, nhanh, ban_do) values ('chuyen_de', $1, $2, 'Toán', 'hinh', 'moi') returning id`, [TEN, KHOI])
  const nhom = [...new Map(bai.filter((b) => b.nhom_id).sort((a, b) => a.cd_tt - b.cd_tt || a.nhom_tt - b.nhom_tt).map((b) => [b.nhom_id, b.nhom])).entries()]
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
  // Chia phần NHỎ (≤ MAX bài) để mỗi phần dựng/in được riêng bằng "👁 Xem phần" — gộp cả 116 bài vào một phần thì paged.js quá 30 s.
  const MAX = 9
  const chuaMh = bai.filter((b) => !b.mh_id)
  const txtOf = Object.fromEntries((await q(`select b.ma_bai, lower(coalesce(b.gia_thiet_chung,'') || ' ' || coalesce(b.de_bai,'') || ' ' || coalesce((select string_agg(y.noi_dung, ' ¦ ' order by y.thu_tu) from hinh_y y where y.bai_id = b.id), '')) t from hinh_bai b where b.ma_bai = any($1)`, [chuaMh.map((b) => b.ma_bai)])).map((r) => [r.ma_bai, r.t]))
  const nhomHinh = (m) => { const t = txtOf[m]; const d = t.slice(0, 300)
    if (/hình thang/.test(t) && !/hình bình hành/.test(t.slice(0, 150))) return 'Hình thang'
    if (/hình thoi|hình vuông/.test(d)) return 'Hình thoi · hình vuông'
    if (/hình chữ nhật/.test(d)) return 'Hình chữ nhật'
    if (/hình bình hành/.test(d)) return 'Hình bình hành'
    if (/đường trung bình|thales|thalès|phân giác/.test(t)) return 'Thalès · đường trung bình · phân giác'
    if (/vuông tại/.test(t.slice(0, 200))) return 'Tam giác vuông'
    if (/tam giác/.test(t.slice(0, 120))) return 'Tam giác (cân · đều · thường)'
    return 'Tứ giác khác' }
  const THU_TU_NHOM = ['Hình bình hành', 'Hình chữ nhật', 'Hình thoi · hình vuông', 'Hình thang', 'Tứ giác khác', 'Tam giác vuông', 'Tam giác (cân · đều · thường)', 'Thalès · đường trung bình · phân giác']
  const theoNhom = new Map(THU_TU_NHOM.map((n) => [n, []]))
  for (const b of chuaMh.sort(theoLoai)) theoNhom.get(nhomHinh(b.ma_bai)).push(b)
  for (const [ten, ds] of theoNhom) {
    const soPhan = Math.ceil(ds.length / MAX) || 0
    for (let k = 0; k < soPhan; k++) {
      const lat = ds.slice(Math.floor((k * ds.length) / soPhan), Math.floor(((k + 1) * ds.length) / soPhan))
      const [p] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, $2, 'buoi', $3) returning id`, [tl.id, await sau(), soPhan > 1 ? `${ten} (${k + 1}/${soPhan})` : ten])
      const [{ k: kh }] = await q(`select fn_tl_hl_them_khoi_khac($1, $2) k`, [tl.id, p.id])
      await q(`select fn_tl_hl_dat_bai($1, $2)`, [kh, lat.map((b) => b.ma_bai)])
    }
  }
  const [{ kq }] = await q(`select fn_tl_hl_noi_dung($1) kq`, [tl.id])
  let tong = 0
  for (const p of kq.buoi) {
    const n = p.mo_hinh.reduce((s, m) => s + m.bai.length, 0) + (p.khac?.bai.length ?? 0); tong += n
    console.log(`• ${p.tieu_de} — ${n} bài`)
  }
  console.log(`Tổng ${tong}/${bai.length} bài · tai_lieu ${tl.id}`)
  if (tong !== bai.length) throw new Error('Số bài trong chuyên đề khác số bài kho — dừng, không ghi.')
  if (THU) { await q('rollback'); console.log('--thu ⇒ ROLLBACK, không ghi gì') } else { await q('commit'); console.log('ĐÃ GHI.') }
} catch (e) { await q('rollback'); console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
