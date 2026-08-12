// ============================================================================
// check-troly.mjs — ORACLE KIỂM CHỨNG cho src/lib/troly.ts (doc §9 "sai đọc = 0%":
// test tự động, so output với query thô).
//
// ⚠ ĐÂY LÀ BẢN HIỆN THỰC THỨ HAI, CỐ Ý. Bình thường viết hai bản cho cùng khái niệm là
//   sai (hai nguồn sự thật rồi lệch nhau). Ở đây thì ngược lại: nó phải ĐỘC LẬP với
//   `troly.ts` mới có giá trị làm chứng — tính thẳng bằng SQL, không import gì của app.
//   ⇒ KHÔNG dùng file này làm dữ liệu cho bất cứ màn hình nào. Chỉ để SO.
//
// Chạy: node scripts/check-troly.mjs        (chỉ SELECT, an toàn)
// Đối chiếu: mở màn trợ lý → từng dòng phải khớp bảng in ra đây. Lệch 1 dòng = dừng,
//   đừng chỉnh prompt: sai đọc không bao giờ sửa được bằng cách nói lại cho khéo.
// ============================================================================
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
function envKey(txt, ten) {
  const m = txt.match(new RegExp(`^\\s*${ten}\\s*=\\s*(.+?)\\s*$`, 'm'))
  return m ? m[1].replace(/^["']|["']$/g, '') : null
}
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = envKey(txt, 'DATABASE_URL_RO') ?? envKey(txt, 'DATABASE_URL')
if (!url) { console.error('❌ Thiếu DATABASE_URL_RO / DATABASE_URL trong .env'); process.exit(1) }

const c = new pg.Client({ connectionString: url })
await c.connect()
try {
  // ── Ngưỡng từ cohort đã hoàn thành ──────────────────────────────────────────
  // percentile_disc = ĐÚNG công thức troly.ts dùng (ceil(p*n)-1). Lệch công thức
  // percentile là lệch ngưỡng, mà ngưỡng sai thì mọi mức cảnh báo sai theo.
  const { rows: [ng] } = await c.query(`
    with x as (
      select ((hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date
            - (created_at    at time zone 'Asia/Ho_Chi_Minh')::date)::int n
      from bo_tro_duoi where trang_thai='hoan_thanh' and hoan_thanh_at is not null)
    select count(*)::int so_ca_mau,
           coalesce(percentile_disc(0.5)  within group (order by n), 0)::int p50,
           coalesce(percentile_disc(0.75) within group (order by n), 0)::int p75,
           coalesce(percentile_disc(0.9)  within group (order by n), 0)::int p90,
           coalesce(max(n), 0)::int toi_da
    from x where n >= 0`)
  console.log('── NGƯỠNG (rút từ đợt đã hoàn thành) ──')
  console.log(`mẫu=${ng.so_ca_mau} · p50=${ng.p50} · p75=${ng.p75} · p90=${ng.p90} · lâu nhất=${ng.toi_da}`
    + (ng.so_ca_mau >= 20 ? '' : '   ⚠ mẫu < 20, chỉ tham khảo'))

  // ── Đợt đang mở: tuổi + trạm kẹt + mức ─────────────────────────────────────
  const { rows } = await c.query(`
    with x as (
      select b.id, h.ho_ten, coalesce(l.ten_lop,'—') lop, coalesce(l.mon,'') mon,
        b.so_buoi_du_kien, (b.dang_duyet_at is not null) da_duyet, b.ly_do, b.lop_id,
        ((now() at time zone 'Asia/Ho_Chi_Minh')::date
       - (b.created_at at time zone 'Asia/Ho_Chi_Minh')::date)::int tuoi,
        (select count(*)::int from bo_tro_duoi_dang d where d.bo_tro_duoi_id=b.id) so_dang,
        -- daHoc = buổi ĐÃ đóng đánh giá VÀ HS có mặt (vắng = huỷ suất, theo botro_duoi.ts)
        (select count(*)::int from buoi_hoc_hs k join buoi_hoc v on v.id=k.buoi_hoc_id
           where k.bo_tro_duoi_id=b.id and v.trang_thai<>'huy'
             and v.danh_gia_xong_at is not null and k.diem_danh='co_mat') da_hoc,
        -- daXep = daHoc + buổi chưa đóng đánh giá
        (select count(*)::int from buoi_hoc_hs k join buoi_hoc v on v.id=k.buoi_hoc_id
           where k.bo_tro_duoi_id=b.id and v.trang_thai<>'huy'
             and (v.danh_gia_xong_at is null or k.diem_danh='co_mat')) da_xep
      from bo_tro_duoi b join hoc_sinh h on h.id=b.hoc_sinh_id
      left join lop l on l.id=b.lop_id where b.trang_thai='can_duoi')
    select ho_ten, lop, tuoi, so_buoi_du_kien, da_xep, da_hoc, so_dang, da_duyet,
      case when so_buoi_du_kien is null            then 'chua_chot_ke_hoach'
           when da_hoc >= so_buoi_du_kien          then 'du_buoi_cho_dong'
           when da_xep <  so_buoi_du_kien          then 'chua_xep_du_buoi'
           else 'dang_hoc' end tram_ket,
      case when tuoi > $1 then 'chua_tung_thay'
           when tuoi > $2 then 'rat_cham'
           when tuoi > $3 then 'cham'
           else 'binh_thuong' end muc,
      (ly_do is null) thieu_ly_do, (lop_id is null) thieu_lop
    from x
    order by array_position(array['chua_tung_thay','rat_cham','cham','binh_thuong'],
      case when tuoi > $1 then 'chua_tung_thay' when tuoi > $2 then 'rat_cham'
           when tuoi > $3 then 'cham' else 'binh_thuong' end), tuoi desc`,
    [ng.toi_da, ng.p90, ng.p75])

  console.log(`\n── ${rows.length} ĐỢT ĐANG MỞ (thứ tự y hệt anhChupChuoiDuoi().ca) ──`)
  console.table(rows.map((r) => ({
    ho_ten: r.ho_ten, lop: r.lop, tuoi: r.tuoi, muc: r.muc, tram_ket: r.tram_ket,
    'kế hoạch': r.so_buoi_du_kien ?? '—', xếp: r.da_xep, học: r.da_hoc, dạng: r.so_dang,
  })))
  const dangKe = rows.filter((r) => r.muc !== 'binh_thuong')
  console.log(`\n⇒ ĐÁNG NHẮC: ${dangKe.length}/${rows.length} — ${dangKe.map((r) => `${r.ho_ten} (${r.tuoi}n)`).join(' · ') || 'không có'}`)
  console.log(`⇒ Bình thường (trong ngưỡng, ĐỪNG nhắc): ${rows.length - dangKe.length}`)
  const thieu = rows.filter((r) => r.thieu_ly_do || r.thieu_lop).length
  if (thieu) console.log(`⚠ ${thieu} đợt thiếu lý do/lớp — troly.ts phải khai "không biết", model KHÔNG được tự lấp.`)
  // ══════════════════════════════════════════════════════════════════════════
  // LƯỢT 1 — BỘ HIỆU CHUẨN: việc của MỘT người, cửa sổ 3–14 ngày, 2 khâu.
  // Mirror của `anhChupViecCuaToi()`. Nguồn task = cột đóng trên `buoi_hoc` ghép
  // `phan_cong_lop`, ĐÚNG invariant `getMyTasks`:
  //   · vai 'gv' → 'danhgia' + 'ingame'      · vai 'tg' → 'ingame' (+ et/btvn/mt, ngoài phạm vi)
  //   · 1 người giữ NHIỀU vai trên cùng lớp ⇒ 'ingame' vẫn CHỈ TÍNH 1 LẦN (dedup theo tab, như `seen`)
  //   ⇒ danhgia chỉ đến từ vai gv; ingame đến từ gv HOẶC tg.
  // Chỉ buổi loai='thuong', bỏ 'huy'. Buổi bù/đuổi có luồng task riêng — ngoài lượt này.
  // ══════════════════════════════════════════════════════════════════════════
  // slice(2) = bỏ đường dẫn node + đường dẫn script. (Bản đầu dùng "chuỗi có dấu cách"
  // để đoán tên người → nhặt trúng "C:\Program Files\nodejs\node.exe".)
  // Đổi người khác: node scripts/check-troly.mjs "Trần Hoàng Đạt"
  const AI = process.argv.slice(2).find((a) => !a.startsWith('-')) ?? 'Đào Xuân Thùy'
  const { rows: [ns] } = await c.query('select id, ho_ten from nhan_su where ho_ten = $1 limit 1', [AI])
  if (!ns) { console.log(`\n(không tìm thấy nhân sự "${AI}" — bỏ qua phần hiệu chuẩn)`); }
  else {
    const { rows: buckets } = await c.query(`
      with b as (
        select v.id, v.ngay, l.ten_lop, v.danh_gia_xong_at, v.ingame_dong_at,
               ((now() at time zone 'Asia/Ho_Chi_Minh')::date - v.ngay)::int tuoi,
               bool_or(pc.vai_tro = 'gv') la_gv
        from buoi_hoc v join lop l on l.id = v.lop_id
        join phan_cong_lop pc on pc.lop_id = v.lop_id and pc.nhan_su_id = $1
        where v.loai = 'thuong' and v.trang_thai <> 'huy'
        group by v.id, v.ngay, l.ten_lop, v.danh_gia_xong_at, v.ingame_dong_at),
      m as (
        select ngay, ten_lop, tuoi, 'danhgia' tab from b where la_gv and danh_gia_xong_at is null
        union all
        select ngay, ten_lop, tuoi, 'ingame'  from b where ingame_dong_at is null)
      select case when tuoi < 0 then 'z. buổi CHƯA diễn ra'
                  when tuoi < 3 then 'a. < 3 ngày (dưới cửa sổ)'
                  when tuoi <= 14 then 'b. 3–14 ngày  ⇐ BỘ HIỆU CHUẨN'
                  else 'c. > 14 ngày (trên cửa sổ)' end nhom,
             count(*) filter (where tab='danhgia')::int danh_gia,
             count(*) filter (where tab='ingame')::int cham_lop,
             count(*)::int tong
      from m group by 1 order by 1`, [ns.id])
    console.log(`\n── BỘ HIỆU CHUẨN LƯỢT 1 · ${ns.ho_ten} ──`)
    console.table(buckets)
    const trong = buckets.find((r) => r.nhom.startsWith('b.'))
    console.log(trong
      ? `⇒ Tab "🔍 Rà soát" phải hiện ĐÚNG ${trong.tong} mục (${trong.danh_gia} đánh giá + ${trong.cham_lop} chấm lớp).`
      : '⇒ Không có mục nào trong cửa sổ 3–14 ngày.')
    console.log('   Lệch dù 1 mục = DỪNG, soi lại tầng đọc. Đừng chỉnh prompt — sai đọc không sửa được bằng cách nói khéo.')
  }
} catch (e) {
  console.error('❌', e.message); process.exitCode = 1
} finally { await c.end() }
