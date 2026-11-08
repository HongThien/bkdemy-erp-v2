// "Chuyên đề Hình Giữa kì 1" (khối 7) — Thùy 21/10: "làm thêm Chuyên đề Hình Giữa kì 1 cũng như Đại số", chuyên đề ÔN TẬP ⇒ đưa HẾT bài vào, không cần duyệt.
// Nguồn = mọi bài kho Hình–Luyện khối 7 chưa bỏ qua (đều từ đề / đề cương giữa kì 1). Ghi qua đúng RPC builder:
//   phần = nhóm mô hình (theo thứ tự bản đồ) → fn_tl_hl_dat_mo_hinh (mô hình có bài) → fn_tl_hl_dat_bai (bài của mô hình, cả trả lời ngắn);
//   bài chưa gán mô hình ⇒ phần cuối "Bài tập khác" → fn_tl_hl_them_khoi_khac + fn_tl_hl_dat_bai.
//   node scripts/_cd_hinh_gk1_7.mjs --thu   → chạy trong ROLLBACK, in kết quả
//   node scripts/_cd_hinh_gk1_7.mjs         → ghi thật (từ chối nếu đã có chuyên đề cùng tên)
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const THU = process.argv.includes('--thu')
// --khoi 8 (mặc định 7) — Thùy 21/10 "tương tự với lớp 8". Tên giống nhau, phân biệt bằng khối.
const KHOI = process.argv.includes('--khoi') ? process.argv[process.argv.indexOf('--khoi') + 1] : '7'
const TEN = 'Chuyên đề Hình Giữa kì 1'
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const [daCo] = await q(`select id from tai_lieu where loai = 'chuyen_de' and ten = $1 and khoi = $2`, [TEN, KHOI])
  if (daCo) throw new Error(`Đã có "${TEN}" (${daCo.id}) — không tạo bản thứ 2.`)

  const bai = await q(`select b.ma_bai, b.loai_cau, m.id mh_id, m.ma mh_ma, nm.id nhom_id, nm.ten nhom, nm.thu_tu nhom_tt, cd.thu_tu cd_tt
                         from hinh_bai b left join hinh_mo_hinh m on m.id = b.mo_hinh_id
                         left join hinh_nhom_mo_hinh nm on nm.id = m.nhom_mh_id left join dai_bdm_chu_de cd on cd.id = m.chu_de_id
                        where b.khoi = $1 and b.bo_qua_at is null order by b.ma_bai`, [KHOI])
  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, nhanh, ban_do) values ('chuyen_de', $1, $2, 'Toán', 'hinh', 'moi') returning id`, [TEN, KHOI])
  const nhom = [...new Map(bai.filter((b) => b.nhom_id).sort((a, b) => a.cd_tt - b.cd_tt || a.nhom_tt - b.nhom_tt).map((b) => [b.nhom_id, b.nhom])).entries()]
  // phần mới đứng SAU mọi dòng đã có (fn_tl_hl_dat_mo_hinh đánh số lại cả tài liệu ⇒ không dùng đếm tay, sẽ trùng số)
  const sau = async () => (await q(`select coalesce(max(thu_tu), -1) + 1 m from tai_lieu_phan where tai_lieu_id = $1`, [tl.id]))[0].m
  for (const [nhomId, nhomTen] of nhom) {
    const [p] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, $2, 'buoi', $3) returning id`, [tl.id, await sau(), nhomTen])
    const cua = bai.filter((b) => b.nhom_id === nhomId)
    const mhs = [...new Map(cua.sort((a, b) => a.mh_ma.localeCompare(b.mh_ma)).map((b) => [b.mh_id, b.mh_ma])).keys()]
    // thứ tự mô hình = thứ tự trên bản đồ (hinh_mo_hinh.thu_tu, rồi mã)
    const thuTu = await q(`select id from hinh_mo_hinh where id = any($1) order by thu_tu nulls last, ma`, [mhs])
    const [{ nd }] = await q(`select fn_tl_hl_dat_mo_hinh($1, $2, $3) nd`, [tl.id, p.id, thuTu.map((r) => r.id)])
    for (const m of nd.buoi[0].mo_hinh) {
      // tự luận trước, trả lời ngắn sau; trong mỗi loại theo mã bài
      const ds = cua.filter((b) => b.mh_id === m.id).sort((a, b) => (a.loai_cau === 'tu_luan' ? 0 : 1) - (b.loai_cau === 'tu_luan' ? 0 : 1) || a.ma_bai.localeCompare(b.ma_bai))
      await q(`select fn_tl_hl_dat_bai($1, $2)`, [m.phan_id, ds.map((b) => b.ma_bai)])
    }
  }
  const chuaMh = bai.filter((b) => !b.mh_id)
  if (chuaMh.length) {
    const [p] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, $2, 'buoi', 'Bài tập khác') returning id`, [tl.id, await sau()])
    const [{ k }] = await q(`select fn_tl_hl_them_khoi_khac($1, $2) k`, [tl.id, p.id])
    await q(`select fn_tl_hl_dat_bai($1, $2)`, [k, chuaMh.sort((a, b) => (a.loai_cau === 'tu_luan' ? 0 : 1) - (b.loai_cau === 'tu_luan' ? 0 : 1) || a.ma_bai.localeCompare(b.ma_bai)).map((b) => b.ma_bai)])
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
