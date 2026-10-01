-- ============================================================================
-- 202609291251 — troly_tuan_bang_thuong_dat
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 29/09 duyệt vòng 2 của TỔNG KẾT TUẦN:
--     1. "Mỗi cái sẽ có 1 ngưỡng gọi là ngưỡng THƯỜNG ĐẠT — là trung bình toàn bộ các lần đã đo.
--        Dưới thường đạt quá nhiều là vấn đề." + "nhớ LỌC NHIỄU. những lần đo khác xa những lần
--        khác là nhiễu."
--     2. Thêm mảng: kết quả học tập · bổ trợ đuổi · tuyển sinh (học phí KHÔNG cần).
--     3. Xu hướng nhiều tuần. 4. Tự tính sáng thứ Hai + báo cho 3 người.
--     5. "dashboard nên làm theo BẢNG. Mỗi loại chỉ số nên là 1 bảng" — để thẳng trên ERP.
--
--   ⭐ THƯỜNG ĐẠT = biểu đồ kiểm soát (Shewhart) trên chuỗi đo theo tuần:
--      · lọc nhiễu bằng hàng rào Tukey: lần đo nằm ngoài [Q1 − 1,5×IQR ; Q3 + 1,5×IQR] bị loại;
--      · thường đạt = trung bình các lần đo CÒN LẠI của mọi tuần TRƯỚC tuần đang xem;
--      · "quá nhiều" đo bằng ĐỘ LỆCH CHUẨN của chính chỉ số đó (mỗi chỉ số dao động khác nhau,
--        một con số cứng kiểu "10 điểm" sẽ quá chặt với chỉ số này và quá lỏng với chỉ số kia):
--        xấu hơn thường đạt từ 1 độ lệch = "dưới thường đạt", từ 2 độ lệch = "vấn đề".
--      Các hệ số nằm MỘT chỗ: `_troly_bc_gia_dinh()` — CEO đổi thì sửa đúng một dòng.
--
--   ⭐ Muốn có "mọi lần đã đo" thì phải GIỮ số của từng tuần: tính lại 15 tuần mỗi lần mở màn mất
--      ~15 giây, vượt trần 8 giây của người dùng. ⇒ bảng `troly_tuan_so_luu`, mỗi tuần một dòng.
--      Tuần chưa "chín" (chưa qua 14 ngày kể từ Chủ nhật của nó) được tính lại mỗi ngày một lần khi
--      có người mở; tuần đã chín thì thôi. Migration này tự dựng số cho mọi tuần từ 15/06/2026.
--
--   ⭐ DANH MỤC chỉ số nằm ở MỘT hàm (`_troly_tuan_danh_muc`): tên, đơn vị, chiều nào là tốt, lấy
--      số ở đâu trong JSON của tuần. Thêm chỉ số = thêm một dòng; thường đạt / chuỗi tuần / đánh giá
--      tự có, kể cả cho các tuần cũ.
--
--   Kết quả học tập dùng lại ma trận điểm (`_troly_matrix`) và số đếm của chính hàm cảnh báo của
--   báo cáo Sư phạm (`_troly_bc_canh_bao`) — không viết luật báo động thứ hai.
--
--   HỆ TỰ TÍNH (sáng thứ Hai) không có người đăng nhập ⇒ cổng `troly_duoc_dung()` nhận thêm cờ nội
--   bộ `troly.noi_bo`, chỉ đặt được bằng SQL bên trong hàm `fn_troly_tuan_tu_dong` (có khoá bí mật)
--   hoặc phiên nối thẳng DB. Người dùng qua API không đặt được cờ này (PostgREST chỉ đặt `request.*`).
--
--   Danh sách 3 tài khoản được dùng trợ lý trước nằm trong thân `hoi_dap_duoc_dung()`. Cần đúng
--   danh sách đó để biết gửi thông báo cho ai ⇒ tách ra `hoi_dap_ds_tai_khoan()`, hàm cũ đọc từ đó.
--   Hành vi không đổi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Thêm 1 bảng + hàm mới; thay THÂN các hàm `_troly_bc_gia_dinh` (thêm khoá),
--   `troly_duoc_dung`, `hoi_dap_duoc_dung` (hành vi với người dùng không đổi), `fn_troly_tuan`,
--   `fn_troly_tuan_lay` (JSON trả về THÊM khoá `chi_so`, `bang`, `lop_hoc_tap`; bỏ khoá `chenh` —
--   chênh lệch giờ nằm trong từng dòng `chi_so`). Bản lưu cũ của tổng kết tuần thiếu `chi_so` thì
--   hàm tự tính lại, không xoá dòng nào.
-- ============================================================================

create or replace function public._troly_bc_gia_dinh() returns jsonb
language sql immutable as $$
  select jsonb_build_object(
    'ti_le_bao_dong', 0.8,      -- điểm < 80% TB lớp
    'si_so_toi_thieu', 3,       -- lớp dưới 3 em có điểm thì không so với TB
    'muc_bao_dong', 2,          -- mức đánh giá ≤ 2
    'ngay_nhin_lai', 30,
    'ingame_bat_buoc_tu', '2026-10-01',   -- CEO 29/09: chấm bài trên lớp bắt buộc từ tháng 10
    'btvn_ti_le_nop_toi_thieu', 0.7,      -- CEO chốt 29/09: lớp có tỉ lệ nộp đạt chuẩn dưới 70% = "tệ"
    'xep_hang_bo_qua', jsonb_build_array('NS001', 'NS002'),  -- CEO 29/09: xếp hạng GV–TA "ko tính Thùy và Trang Phạm"
    -- ── TỔNG KẾT TUẦN: thường đạt (CEO 29/09) ──
    'tuan_dau', '2026-06-15',             -- tuần đầu tiên có dữ liệu buổi học trên hệ
    'chuoi_so_tuan', 8,                   -- bảng xu hướng bày mấy tuần gần nhất
    'thuong_dat_so_tuan_toi_thieu', 4,    -- dưới 4 lần đo thì chưa đánh giá
    'nhieu_he_so_iqr', 1.5,               -- hàng rào Tukey: ngoài Q1/Q3 ± 1,5 × IQR là nhiễu
    'thuong_dat_sigma_luu_y', 1,          -- xấu hơn thường đạt ≥ 1 độ lệch chuẩn = "dưới thường đạt"
    'thuong_dat_sigma_van_de', 2)         -- ≥ 2 độ lệch chuẩn = "vấn đề"
$$;

-- ── Danh sách tài khoản được dùng trợ lý / hỏi hệ thống: MỘT chỗ ─────────────────────────
create or replace function public.hoi_dap_ds_tai_khoan() returns uuid[]
language sql immutable as $$
  select array[
    '1a531947-5174-449b-9191-615ef6adb4a1',  -- Đào Xuân Thùy
    '31ffe8dc-9310-4ce9-b27e-c6c1c6263d43',  -- Phạm Thị Thùy Trang
    'bdb64e2c-809c-419c-88a8-f0d48683e664'   -- Trần Bảo Lộc
  ]::uuid[]
$$;

create or replace function public.hoi_dap_duoc_dung() returns boolean
language sql stable as $$
  select public.jwt_uid() = any(public.hoi_dap_ds_tai_khoan())
$$;

create or replace function public.troly_duoc_dung() returns boolean
language sql stable as $$
  select coalesce(public.hoi_dap_duoc_dung(), false)
      or coalesce(current_setting('troly.noi_bo', true), '') = '1'   -- hệ tự tính, không có người đăng nhập
$$;

-- ── Bảng giữ số của TỪNG TUẦN (mỗi lần đo một dòng) ───────────────────────────────────
create table if not exists troly_tuan_so_luu (
  tuan        date primary key,                 -- thứ Hai của tuần
  so          jsonb not null,
  tinh_luc    timestamptz not null default now(),
  tinh_mat_ms integer not null
);
alter table troly_tuan_so_luu enable row level security;
drop policy if exists troly_tuan_so_luu_doc on troly_tuan_so_luu;
create policy troly_tuan_so_luu_doc on troly_tuan_so_luu for select to authenticated using (public.troly_duoc_dung());
comment on table troly_tuan_so_luu is
  'Số của từng tuần cho Tổng kết tuần của trợ lý — nguồn để tính THƯỜNG ĐẠT và xu hướng. Dữ liệu SUY RA, tính lại được bằng _troly_tuan_cap_nhat. Chỉ hàm SECURITY DEFINER ghi.';

-- Lấy số đếm `so` của một cảnh báo theo mã, từ JSON của _troly_bc_canh_bao. Không có = 0.
create or replace function public._troly_cb_so(p_cb jsonb, p_ma text) returns integer
language sql immutable as $$
  select coalesce((select (e->>'so')::int
                     from jsonb_each(coalesce(p_cb, '{}'::jsonb)) j(k, v), jsonb_array_elements(j.v) e
                    where e->>'ma' = p_ma limit 1), 0)
$$;

-- ── KẾT QUẢ HỌC TẬP của một tuần ─────────────────────────────────────────────────────
create or replace function public._troly_tuan_hoc_tap(p_tu date, p_den date) returns jsonb
language plpgsql stable as $$
declare v jsonb; cb jsonb;
begin
  perform public._troly_gac();
  cb := public._troly_bc_canh_bao(p_tu, p_den);
  with lop_cs as (
    select distinct b.lop_id, l.ten_lop, l.mon from buoi_hoc b join lop l on l.id = b.lop_id
    where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between p_tu and p_den
  ),
  mx as (
    select lc.lop_id, lc.ten_lop, lc.mon, p.pha, m.pct
    from lop_cs lc cross join (values ('et'), ('btvn')) p(pha)
    cross join lateral public._troly_matrix(lc.lop_id, p.pha, p_tu, p_den) m
    where m.status = 'done' and m.pct is not null
  ),
  ll as (
    select mx.lop_id, max(mx.ten_lop) as ten_lop, max(mx.mon) as mon,
      count(*) filter (where mx.pha = 'et')::int as et_so_luot, round(avg(mx.pct) filter (where mx.pha = 'et'), 1) as et_tb,
      count(*) filter (where mx.pha = 'btvn')::int as btvn_so_luot, round(avg(mx.pct) filter (where mx.pha = 'btvn'), 1) as btvn_tb
    from mx group by mx.lop_id
  )
  select jsonb_build_object(
    'et', jsonb_build_object('so_luot', count(*) filter (where mx.pha = 'et'),
                             'diem_tb', round(avg(mx.pct) filter (where mx.pha = 'et'), 1)),
    'btvn', jsonb_build_object('so_luot', count(*) filter (where mx.pha = 'btvn'),
                               'diem_tb', round(avg(mx.pct) filter (where mx.pha = 'btvn'), 1)),
    'hs_et_thap', public._troly_cb_so(cb, 'et_diem_thap'),
    'hs_btvn_thap', public._troly_cb_so(cb, 'btvn_diem_thap'),
    'hs_dg_bao_dong', public._troly_cb_so(cb, 'dg_bao_dong'),
    'hs_btvn_khong_lam', public._troly_cb_so(cb, 'btvn_khong_lam'),
    'lop', (select coalesce(jsonb_agg(to_jsonb(ll) order by ll.ten_lop), '[]'::jsonb) from ll)
  ) into v from mx;
  return v;
end $$;

-- ── BỔ TRỢ ĐUỔI của một tuần — cùng khung với bổ trợ yếu ─────────────────────────────
create or replace function public._troly_tuan_duoi(p_tu date, p_den date) returns jsonb
language plpgsql stable as $$
declare v jsonb;
begin
  perform public._troly_gac();
  with ca as (
    select hh.bo_tro_duoi_id as case_id, hh.created_at as xep_luc, b.ngay, b.ly_do_huy,
      case when b.trang_thai = 'huy' then 'huy'
           when hh.diem_danh = 'co_mat' then 'da_hoc'
           when hh.diem_danh in ('vang', 'vang_phep') then 'hs_vang'
           when b.ngay < public._troly_hom_nay() then 'khong_diem_danh'
           else 'cho_hoc' end as kq
    from buoi_hoc b
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_duoi_id is not null
    where b.loai = 'bo_tro_duoi' and b.ngay between p_tu and p_den
  ),
  can as (
    select d.id from bo_tro_duoi d
    where (d.created_at at time zone 'Asia/Ho_Chi_Minh')::date <= p_den
      and (d.hoan_thanh_at is null or (d.hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date >= p_tu)
    union
    select ca.case_id from ca
  ),
  xep1 as (
    select hh.bo_tro_duoi_id as case_id, min(hh.created_at) as xep_luc
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
    where hh.bo_tro_duoi_id is not null and b.loai = 'bo_tro_duoi'
    group by hh.bo_tro_duoi_id
  ),
  t1 as (
    select extract(epoch from (x.xep_luc - d.created_at)) / 86400.0 as ngay
    from xep1 x join bo_tro_duoi d on d.id = x.case_id
    where (x.xep_luc at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den
      and x.xep_luc >= d.created_at
  )
  select jsonb_build_object(
    'can_duoi', (select count(*) from can),
    'da_len_lich', count(distinct ca.case_id),
    'da_hoc', count(distinct ca.case_id) filter (where ca.kq = 'da_hoc'),
    'pct_len_lich', round(count(distinct ca.case_id) * 100.0 / nullif((select count(*) from can), 0), 1),
    'pct_da_hoc', round(count(distinct ca.case_id) filter (where ca.kq = 'da_hoc') * 100.0 / nullif((select count(*) from can), 0), 1),
    'hoan_thanh_trong_tuan', (select count(*) from bo_tro_duoi d
                               where (d.hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den),
    'luot_xep', count(*),
    'luot_da_hoc', count(*) filter (where ca.kq = 'da_hoc'),
    'luot_cho_hoc', count(*) filter (where ca.kq = 'cho_hoc'),
    'su_co', count(*) filter (where ca.kq in ('huy', 'hs_vang', 'khong_diem_danh')),
    'pct_su_co', round(count(*) filter (where ca.kq in ('huy', 'hs_vang', 'khong_diem_danh')) * 100.0 / nullif(count(*), 0), 1),
    'su_co_chi_tiet', jsonb_build_object(
      'hs_khong_den', count(*) filter (where ca.kq = 'hs_vang'),
      'khong_diem_danh', count(*) filter (where ca.kq = 'khong_diem_danh'),
      'huy', count(*) filter (where ca.kq = 'huy')),
    'tao_den_xep', (select jsonb_build_object('so_mau', count(*),
        'tb_ngay', round(avg(ngay)::numeric, 1),
        'trung_vi_ngay', round((percentile_cont(0.5) within group (order by ngay))::numeric, 1),
        'lau_nhat_ngay', round(max(ngay)::numeric, 1)) from t1)
  ) into v from ca;
  return v;
end $$;

-- ── TUYỂN SINH của một tuần ─────────────────────────────────────────────────────────
create or replace function public._troly_tuan_tuyen_sinh(p_tu date, p_den date) returns jsonb
language plpgsql stable as $$
declare v jsonb;
begin
  perform public._troly_gac();
  with ca as (select c.* from ca_test c where c.ngay between p_tu and p_den),
  lg as (
    select l.hanh_dong, count(distinct l.ung_vien_id)::int as n
    from ung_vien_log l
    where (l.ts at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den and l.hanh_dong in ('convert', 'loai')
    group by l.hanh_dong
  ),
  tra as (  -- ca TRẢ KẾT QUẢ trong tuần (test ngày nào cũng tính): mất bao lâu từ lúc test xong
    select extract(epoch from (c.tra_bai_xong_at - c.hoan_thanh_at)) / 86400.0 as ngay
    from ca_test c
    where c.trang_thai <> 'huy' and c.hoan_thanh_at is not null and c.tra_bai_xong_at >= c.hoan_thanh_at
      and (c.tra_bai_xong_at at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den
  )
  select jsonb_build_object(
    'ung_vien_moi', (select count(*) from ung_vien u
                      where (u.created_at at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den),
    'convert', coalesce((select n from lg where hanh_dong = 'convert'), 0),
    'loai', coalesce((select n from lg where hanh_dong = 'loai'), 0),
    'ca_test', count(*) filter (where ca.trang_thai <> 'huy'),
    'ca_huy', count(*) filter (where ca.trang_thai = 'huy'),
    'da_test_xong', count(*) filter (where ca.trang_thai <> 'huy' and ca.hoan_thanh_at is not null),
    'da_cham', count(*) filter (where ca.trang_thai <> 'huy' and ca.cham_xong_at is not null),
    'da_tra_ket_qua', count(*) filter (where ca.trang_thai <> 'huy' and ca.tra_bai_xong_at is not null),
    'pct_tra_ket_qua', round(count(*) filter (where ca.trang_thai <> 'huy' and ca.tra_bai_xong_at is not null) * 100.0
                         / nullif(count(*) filter (where ca.trang_thai <> 'huy' and ca.hoan_thanh_at is not null), 0), 1),
    -- tồn đọng TÍNH TỚI CUỐI TUẦN: đã test xong mà tới Chủ nhật vẫn chưa trả kết quả
    'ton_dong', (select count(*) from ca_test c
                  where c.trang_thai <> 'huy' and c.hoan_thanh_at is not null
                    and (c.hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date <= p_den
                    and (c.tra_bai_xong_at is null or (c.tra_bai_xong_at at time zone 'Asia/Ho_Chi_Minh')::date > p_den)),
    'test_den_tra', (select jsonb_build_object('so_mau', count(*),
        'tb_ngay', round(avg(ngay)::numeric, 1),
        'trung_vi_ngay', round((percentile_cont(0.5) within group (order by ngay))::numeric, 1),
        'lau_nhat_ngay', round(max(ngay)::numeric, 1)) from tra)
  ) into v from ca;
  return v;
end $$;

-- ── Số ĐẦY ĐỦ của một tuần = số cũ + các mảng mới + bản tra theo mã khâu ───────────────
create or replace function public._troly_tuan_so_day_du(p_tu date, p_den date) returns jsonb
language plpgsql stable as $$
declare s jsonb;
begin
  perform public._troly_gac();
  s := public._troly_tuan_so(p_tu, p_den);
  return s || jsonb_build_object(
    'tong_khau', public._troly_tuan_tong_khau(s->'khau'),
    -- tra khâu theo MÃ, không theo vị trí trong mảng
    'khau_ma', (select coalesce(jsonb_object_agg(k->>'ma', k), '{}'::jsonb) from jsonb_array_elements(s->'khau') k),
    'hoc_tap', public._troly_tuan_hoc_tap(p_tu, p_den),
    'bo_tro_duoi', public._troly_tuan_duoi(p_tu, p_den),
    'tuyen_sinh', public._troly_tuan_tuyen_sinh(p_tu, p_den));
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- DANH MỤC CHỈ SỐ — nguồn duy nhất: tên, đơn vị, chiều tốt, chỗ lấy số trong JSON của tuần.
--   chieu_tot : len = càng cao càng tốt · xuong = càng thấp càng tốt · khong = không đánh giá
--   san_lech  : độ lệch chuẩn tối thiểu đem ra so (chuỗi quá phẳng thì 0,1 điểm cũng thành "vấn đề")
--   can_chin  : số của tuần còn đổi nhiều sau khi tuần kết thúc ⇒ 7 ngày đầu chưa đánh giá
--   neo       : số "neo" của mảng. Một mảng chỉ được coi là ĐÃ CHẠY TRÊN HỆ kể từ tuần đầu tiên số neo
--               lớn hơn 0; các tuần trước đó KHÔNG phải lần đo (không có dòng, chứ không phải đo ra 0 —
--               CLAUDE.md §1.5). Vd ca test đầu vào chỉ có trên hệ từ 31/08: tính cả các tuần trước thì
--               thường đạt bị kéo về 0 và mọi tuần có ca test thật đều thành "nhiễu".
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public._troly_tuan_danh_muc()
returns table(thu_tu int, bang text, ma text, ten text, duong_dan text[], tu_so text[], mau_so text[],
              don_vi text, chieu_tot text, san_lech numeric, can_chin boolean, neo text[])
language sql immutable as $$
  select z.*,
    case when z.bang = 'yeu' then array['bo_tro_yeu', 'can_bo_tro']
         when z.bang = 'bu' then array['bo_tro_bu', 'luot_vang']
         when z.bang = 'duoi' then array['bo_tro_duoi', 'can_duoi']
         when z.ma in ('ts.ca_test', 'ts.tra', 'ts.test_tra', 'ts.ton') then array['tuyen_sinh', 'ca_test']
         when z.bang = 'tuyen_sinh' then array['tuyen_sinh', 'ung_vien_moi']
         when z.ma like 'khau.%' and z.ma not like 'khau.tong.%' then array['khau_ma', split_part(z.ma, '.', 2), 'tong']
    end
  from (
  select 100 + k.tt * 10 + r.tt, 'viec', 'khau.' || k.ma || '.' || r.ma, k.ten || ' — ' || r.ten,
         array['khau_ma', k.ma, 'pct_' || r.ma], array['khau_ma', k.ma, r.ma], array['khau_ma', k.ma, 'da_toi_han'],
         '%', r.chieu, 2::numeric, false
  from (values (1, 'btvn', 'BTVN'), (2, 'et', 'ET'), (3, 'danhgia', 'Đánh giá sau buổi'),
               (4, 'ingame', 'Đánh giá trong buổi'), (5, 'mt', 'MT')) k(tt, ma, ten)
  cross join (values (1, 'dung_chuan', 'đúng chuẩn', 'len'), (2, 'cham', 'chậm', 'xuong'), (3, 'thieu', 'thiếu', 'xuong')) r(tt, ma, ten, chieu)
  union all
  select 190 + r.tt, 'viec', 'khau.tong.' || r.ma, 'Cả trung tâm — ' || r.ten,
         array['tong_khau', 'pct_' || r.ma], array['tong_khau', r.ma], array['tong_khau', 'da_toi_han'],
         '%', r.chieu, 2::numeric, false
  from (values (1, 'dung_chuan', 'đúng chuẩn', 'len'), (2, 'cham', 'chậm', 'xuong'), (3, 'thieu', 'thiếu', 'xuong')) r(tt, ma, ten, chieu)
  union all
  select x.* from (values
    -- ── Quy mô & chuyên cần
    (200, 'quy_mo', 'qm.so_buoi', 'Số buổi học', array['quy_mo','so_buoi'], null::text[], null::text[], 'buổi', 'khong', 1::numeric, false),
    (201, 'quy_mo', 'qm.so_lop', 'Số lớp có buổi học', array['quy_mo','so_lop'], null, null, 'lớp', 'khong', 1, false),
    (202, 'quy_mo', 'qm.chuyen_can', 'Chuyên cần', array['quy_mo','chuyen_can_pct'], array['quy_mo','luot_co_mat'], null, '%', 'len', 2, false),
    (203, 'quy_mo', 'qm.luot_vang', 'Lượt vắng', array['quy_mo','luot_vang'], null, null, 'lượt', 'xuong', 1, false),
    -- ── Kết quả học tập
    (300, 'hoc_tap', 'ht.et_diem', 'Điểm ET trung bình', array['hoc_tap','et','diem_tb'], array['hoc_tap','et','so_luot'], null, '%', 'len', 2, false),
    (301, 'hoc_tap', 'ht.btvn_diem', 'Điểm BTVN trung bình', array['hoc_tap','btvn','diem_tb'], array['hoc_tap','btvn','so_luot'], null, '%', 'len', 2, true),
    (302, 'hoc_tap', 'ht.btvn_nop', 'Học sinh nộp BTVN đạt chuẩn', array['btvn_hs','ti_le_pct'], array['btvn_hs','dat'], array['btvn_hs','can_co'], '%', 'len', 2, false),
    (303, 'hoc_tap', 'ht.lop_nop_kem', 'Lớp có tỉ lệ nộp BTVN dưới ngưỡng', array['btvn_hs','so_lop_duoi_nguong'], null, array['btvn_hs','so_lop'], 'lớp', 'xuong', 1, false),
    (304, 'hoc_tap', 'ht.hs_et_thap', 'Học sinh có điểm ET thấp hơn hẳn lớp (từ 2 buổi)', array['hoc_tap','hs_et_thap'], null, null, 'học sinh', 'xuong', 1, false),
    (305, 'hoc_tap', 'ht.hs_dg', 'Học sinh bị giáo viên báo động qua đánh giá', array['hoc_tap','hs_dg_bao_dong'], null, null, 'học sinh', 'xuong', 1, false),
    (306, 'hoc_tap', 'ht.hs_khong_lam', 'Học sinh không làm BTVN từ 2 lần', array['hoc_tap','hs_btvn_khong_lam'], null, null, 'học sinh', 'xuong', 1, false),
    -- ── Bổ trợ yếu
    (400, 'yeu', 'yeu.can', 'Số case cần bổ trợ', array['bo_tro_yeu','can_bo_tro'], null, null, 'case', 'khong', 1, false),
    (401, 'yeu', 'yeu.len_lich', 'Đã lên lịch', array['bo_tro_yeu','pct_len_lich'], array['bo_tro_yeu','da_len_lich'], array['bo_tro_yeu','can_bo_tro'], '%', 'len', 2, false),
    (402, 'yeu', 'yeu.da_bo_tro', 'Đã bổ trợ', array['bo_tro_yeu','pct_da_bo_tro'], array['bo_tro_yeu','da_bo_tro'], array['bo_tro_yeu','can_bo_tro'], '%', 'len', 2, false),
    (403, 'yeu', 'yeu.su_co', 'Lượt có sự cố (huỷ, không diễn ra…)', array['bo_tro_yeu','pct_su_co'], array['bo_tro_yeu','su_co'], array['bo_tro_yeu','luot_xep'], '%', 'xuong', 2, false),
    (404, 'yeu', 'yeu.duyet_xep', 'Từ duyệt đến xếp lịch', array['thoi_gian','duyet_den_xep','tb_ngay'], null, array['thoi_gian','duyet_den_xep','so_mau'], 'ngày', 'xuong', 0.5, false),
    (405, 'yeu', 'yeu.xep_dien_ra', 'Từ xếp lịch đến diễn ra', array['thoi_gian','xep_den_dien_ra','tb_ngay'], null, array['thoi_gian','xep_den_dien_ra','so_mau'], 'ngày', 'xuong', 0.5, false),
    -- ── Bổ trợ bù
    (500, 'bu', 'bu.luot_vang', 'Lượt vắng phải xử lý', array['bo_tro_bu','luot_vang'], null, null, 'lượt', 'khong', 1, false),
    (501, 'bu', 'bu.da_xep', 'Đã xếp bù', array['bo_tro_bu','pct_da_xep'], array['bo_tro_bu','da_xep'], null, '%', 'len', 2, true),
    (502, 'bu', 'bu.da_hoc', 'Đã học bù', array['bo_tro_bu','pct_da_hoc_bu'], array['bo_tro_bu','da_hoc_bu'], null, '%', 'len', 2, true),
    (503, 'bu', 'bu.chua_xep', 'Lượt vắng chưa xếp bù', array['bo_tro_bu','chua_xep'], null, null, 'lượt', 'xuong', 1, true),
    -- ── Bổ trợ đuổi
    (600, 'duoi', 'duoi.can', 'Số case cần đuổi', array['bo_tro_duoi','can_duoi'], null, null, 'case', 'khong', 1, false),
    (601, 'duoi', 'duoi.len_lich', 'Đã lên lịch', array['bo_tro_duoi','pct_len_lich'], array['bo_tro_duoi','da_len_lich'], array['bo_tro_duoi','can_duoi'], '%', 'len', 2, false),
    (602, 'duoi', 'duoi.da_hoc', 'Đã học', array['bo_tro_duoi','pct_da_hoc'], array['bo_tro_duoi','da_hoc'], array['bo_tro_duoi','can_duoi'], '%', 'len', 2, false),
    (603, 'duoi', 'duoi.su_co', 'Lượt có sự cố (huỷ, vắng, không điểm danh)', array['bo_tro_duoi','pct_su_co'], array['bo_tro_duoi','su_co'], array['bo_tro_duoi','luot_xep'], '%', 'xuong', 2, false),
    (604, 'duoi', 'duoi.hoan_thanh', 'Case hoàn thành trong tuần', array['bo_tro_duoi','hoan_thanh_trong_tuan'], null, null, 'case', 'len', 1, false),
    (605, 'duoi', 'duoi.tao_xep', 'Từ mở case đến xếp lịch', array['bo_tro_duoi','tao_den_xep','tb_ngay'], null, array['bo_tro_duoi','tao_den_xep','so_mau'], 'ngày', 'xuong', 0.5, false),
    -- ── Tuyển sinh
    (700, 'tuyen_sinh', 'ts.moi', 'Ứng viên mới', array['tuyen_sinh','ung_vien_moi'], null, null, 'ứng viên', 'len', 1, false),
    (701, 'tuyen_sinh', 'ts.ca_test', 'Ca test đầu vào', array['tuyen_sinh','ca_test'], null, null, 'ca', 'khong', 1, false),
    (702, 'tuyen_sinh', 'ts.tra', 'Ca test đã trả kết quả', array['tuyen_sinh','pct_tra_ket_qua'], array['tuyen_sinh','da_tra_ket_qua'], array['tuyen_sinh','da_test_xong'], '%', 'len', 2, true),
    (703, 'tuyen_sinh', 'ts.test_tra', 'Từ test xong đến trả kết quả', array['tuyen_sinh','test_den_tra','tb_ngay'], null, array['tuyen_sinh','test_den_tra','so_mau'], 'ngày', 'xuong', 0.5, false),
    (704, 'tuyen_sinh', 'ts.ton', 'Ca test tồn đọng chưa trả kết quả (tới cuối tuần)', array['tuyen_sinh','ton_dong'], null, null, 'ca', 'xuong', 1, false),
    (705, 'tuyen_sinh', 'ts.convert', 'Ứng viên thành học sinh', array['tuyen_sinh','convert'], null, null, 'ứng viên', 'len', 1, false),
    (706, 'tuyen_sinh', 'ts.loai', 'Ứng viên bị loại', array['tuyen_sinh','loai'], null, null, 'ứng viên', 'khong', 1, false)
  ) x(thu_tu, bang, ma, ten, duong_dan, tu_so, mau_so, don_vi, chieu_tot, san_lech, can_chin)
  ) z(thu_tu, bang, ma, ten, duong_dan, tu_so, mau_so, don_vi, chieu_tot, san_lech, can_chin)
$$;

-- ── Giữ cho bảng số tuần ĐỦ và MỚI tới tuần p_tuan ───────────────────────────────────
-- Tính lại: tuần chưa có dòng · tuần đích khi p_ep · tuần chưa chín mà bản lưu không phải của hôm nay.
-- Mỗi lần gọi tính tối đa p_toi_da tuần (tuần gần nhất trước) để không vượt trần thời gian.
create or replace function public._troly_tuan_cap_nhat(p_tuan date, p_ep boolean default false, p_toi_da integer default 3)
returns integer
language plpgsql volatile as $$
declare
  v_nay date := public._troly_hom_nay();
  v_dau date := (public._troly_bc_gia_dinh()->>'tuan_dau')::date;
  r record; n int := 0; t0 timestamptz; s jsonb;
begin
  perform public._troly_gac();
  for r in
    select d::date as tu
    from generate_series(v_dau::timestamp, public._troly_dau_tuan(p_tuan)::timestamp, interval '7 day') d
    left join troly_tuan_so_luu l on l.tuan = d::date
    where l.tuan is null
       or (d::date = public._troly_dau_tuan(p_tuan) and coalesce(p_ep, false))
       or ((l.tinh_luc at time zone 'Asia/Ho_Chi_Minh')::date <= d::date + 6 + 14
           and (l.tinh_luc at time zone 'Asia/Ho_Chi_Minh')::date <> v_nay)
    order by d desc
  loop
    exit when n >= p_toi_da;
    t0 := clock_timestamp();
    s := public._troly_tuan_so_day_du(r.tu, least(r.tu + 6, v_nay));
    insert into troly_tuan_so_luu as l (tuan, so, tinh_luc, tinh_mat_ms)
      values (r.tu, s, now(), (extract(epoch from clock_timestamp() - t0) * 1000)::int)
    on conflict (tuan) do update
      set so = excluded.so, tinh_luc = excluded.tinh_luc, tinh_mat_ms = excluded.tinh_mat_ms;
    n := n + 1;
  end loop;
  return n;
end $$;

-- ── DỰNG dashboard của một tuần TỪ BẢNG SỐ ĐÃ LƯU (không tính lại số gốc) ──────────────
create or replace function public._troly_tuan_doc(p_tu date) returns jsonb
language plpgsql stable as $$
declare
  g jsonb := public._troly_bc_gia_dinh();
  v_nay date := public._troly_hom_nay();
  v_den date := p_tu + 6;
  v_dau date := (g->>'tuan_dau')::date;
  v_min int := (g->>'thuong_dat_so_tuan_toi_thieu')::int;
  v_s1 numeric := (g->>'thuong_dat_sigma_luu_y')::numeric;
  v_s2 numeric := (g->>'thuong_dat_sigma_van_de')::numeric;
  v_nt int := (g->>'chuoi_so_tuan')::int;
  v_hr numeric := (g->>'nhieu_he_so_iqr')::numeric;
  s jsonb; t jsonb; v_cs jsonb; v_lop jsonb; v_thieu int;
begin
  perform public._troly_gac();
  select l.so into s from troly_tuan_so_luu l where l.tuan = p_tu;
  if s is null then raise exception 'Chưa có số của tuần bắt đầu %.', to_char(p_tu, 'DD/MM/YYYY'); end if;
  select l.so into t from troly_tuan_so_luu l where l.tuan = p_tu - 7;
  select count(*)::int into v_thieu
    from generate_series(v_dau::timestamp, (p_tu - 7)::timestamp, interval '7 day') d
    where not exists (select 1 from troly_tuan_so_luu l where l.tuan = d::date);

  with dm as (select * from public._troly_tuan_danh_muc()),
  bd as (  -- tuần đầu tiên mảng của chỉ số đó CÓ CHẠY trên hệ (số neo > 0)
    select dm.ma, min(l.tuan) as tu
    from troly_tuan_so_luu l cross join dm
    where dm.neo is not null and coalesce((l.so #>> dm.neo)::numeric, 0) > 0
    group by dm.ma
  ),
  ls as (  -- mọi lần đo đã lưu tới tuần đang xem; tuần trước khi mảng chạy thì KHÔNG phải lần đo
    select l.tuan, dm.ma,
           case when dm.neo is null or l.tuan >= bd.tu then (l.so #>> dm.duong_dan)::numeric end as v
    from troly_tuan_so_luu l cross join dm
    left join bd on bd.ma = dm.ma
    where l.tuan between v_dau and p_tu
  ),
  cu as (select ls.* from ls where ls.tuan < p_tu and ls.v is not null),
  q as (
    select cu.ma, percentile_cont(0.25) within group (order by cu.v) as q1,
           percentile_cont(0.75) within group (order by cu.v) as q3, count(*) as n
    from cu group by cu.ma
  ),
  loc as (  -- hàng rào Tukey: ngoài khoảng là NHIỄU
    select cu.tuan, cu.ma, cu.v,
           (q.n >= v_min and (cu.v < q.q1 - greatest(v_hr * (q.q3 - q.q1), dm.san_lech)
                           or cu.v > q.q3 + greatest(v_hr * (q.q3 - q.q1), dm.san_lech))) as nhieu
    from cu join q on q.ma = cu.ma join dm on dm.ma = cu.ma
  ),
  td as (
    select loc.ma, avg(loc.v) filter (where not loc.nhieu) as tb,
           stddev_samp(loc.v) filter (where not loc.nhieu) as sd,
           count(*) filter (where not loc.nhieu)::int as n,
           count(*) filter (where loc.nhieu)::int as n_nhieu
    from loc group by loc.ma
  ),
  ch as (
    select ls.ma, jsonb_agg(jsonb_build_object('tuan', ls.tuan, 'gia_tri', ls.v, 'nhieu', coalesce(loc.nhieu, false))
                            order by ls.tuan) as chuoi
    from ls left join loc on loc.ma = ls.ma and loc.tuan = ls.tuan
    where ls.tuan > p_tu - 7 * v_nt
    group by ls.ma
  ),
  x as (
    select dm.*,
           (s #>> dm.duong_dan)::numeric as v,
           (s #>> dm.tu_so)::numeric as tu, (s #>> dm.mau_so)::numeric as mau,
           (t #>> dm.duong_dan)::numeric as vt,
           td.tb, greatest(coalesce(td.sd, 0), dm.san_lech) as sd,
           coalesce(td.n, 0) as n, coalesce(td.n_nhieu, 0) as n_nhieu, ch.chuoi
    from dm left join td on td.ma = dm.ma left join ch on ch.ma = dm.ma
  ),
  y as (
    select x.*, (x.v - x.tb) * (case x.chieu_tot when 'xuong' then -1 else 1 end) / x.sd as ls_sigma   -- dương = tốt hơn
    from x
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'ma', y.ma, 'bang', y.bang, 'ten', y.ten, 'don_vi', y.don_vi, 'chieu_tot', y.chieu_tot, 'can_chin', y.can_chin,
      'gia_tri', y.v, 'tu_so', y.tu, 'mau_so', y.mau,
      'truoc', y.vt, 'chenh', y.v - y.vt,
      'thuong_dat', round(y.tb, 1), 'lech', round(y.v - y.tb, 1),
      'so_lan_do', y.n, 'so_lan_nhieu', y.n_nhieu,
      'danh_gia', case
          when y.v is null then null
          when y.chieu_tot = 'khong' then 'khong_xet'
          when y.n < v_min or y.tb is null then 'chua_du'
          when y.can_chin and v_den + 7 > v_nay then 'chua_chot'
          when y.ls_sigma <= -v_s2 then 'van_de'
          when y.ls_sigma <= -v_s1 then 'duoi'
          when y.ls_sigma >= v_s1 then 'tren'
          else 'binh_thuong' end,
      'chuoi', coalesce(y.chuoi, '[]'::jsonb)) order by y.thu_tu), '[]'::jsonb)
    into v_cs
  from y
  where y.v is not null or y.vt is not null;   -- khâu không có việc ở cả tuần này lẫn tuần trước (MT, chấm trên lớp trước 01/10) thì không bày

  -- Lớp theo điểm ET: tuần này so với tuần trước, lớp TỤT nhiều nhất đứng đầu
  select coalesce(jsonb_agg(jsonb_build_object(
      'ten_lop', a->>'ten_lop', 'mon', a->>'mon',
      'et_so_luot', a->'et_so_luot', 'et_tb', a->'et_tb', 'et_tb_truoc', b->'et_tb',
      'et_chenh', (a->>'et_tb')::numeric - (b->>'et_tb')::numeric,
      'btvn_tb', a->'btvn_tb', 'btvn_tb_truoc', b->'btvn_tb')
      order by ((a->>'et_tb')::numeric - (b->>'et_tb')::numeric) nulls last, a->>'ten_lop'), '[]'::jsonb)
    into v_lop
  from jsonb_array_elements(coalesce(s->'hoc_tap'->'lop', '[]'::jsonb)) a
  left join jsonb_array_elements(coalesce(t->'hoc_tap'->'lop', '[]'::jsonb)) b on b->>'lop_id' = a->>'lop_id'
  where a->'et_tb' is not null and a->>'et_tb' is not null;

  return jsonb_build_object(
    'bo', 'tuan', 'ten', 'Tổng kết tuần',
    'tu', p_tu, 'den', v_den,
    'da_ket_thuc', v_den < v_nay,
    'da_chin', v_den + 7 <= v_nay,
    'tao_luc', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI'),
    'so', s - 'khau_ma',
    'bang', jsonb_build_array(
      jsonb_build_object('ma', 'viec', 'ten', 'Việc sau buổi học'),
      jsonb_build_object('ma', 'quy_mo', 'ten', 'Quy mô & chuyên cần'),
      jsonb_build_object('ma', 'hoc_tap', 'ten', 'Kết quả học tập'),
      jsonb_build_object('ma', 'yeu', 'ten', 'Bổ trợ yếu'),
      jsonb_build_object('ma', 'bu', 'ten', 'Bổ trợ bù'),
      jsonb_build_object('ma', 'duoi', 'ten', 'Bổ trợ đuổi'),
      jsonb_build_object('ma', 'tuyen_sinh', 'ten', 'Tuyển sinh')),
    'chi_so', v_cs,
    'lop_hoc_tap', v_lop,
    'xep_hang', public._troly_tuan_xep_hang(p_tu, least(v_den, v_nay)),
    'xep_hang_bo_qua', (select coalesce(jsonb_agg(ns.ho_ten order by ns.ma_ns), '[]'::jsonb) from nhan_su ns
                         where (g->'xep_hang_bo_qua') ? coalesce(ns.ma_ns, '')),
    'thuong_dat', jsonb_build_object(
      'tu_tuan', v_dau, 'so_tuan_toi_thieu', v_min, 'he_so_nhieu', v_hr,
      'sigma_luu_y', v_s1, 'sigma_van_de', v_s2, 'so_tuan_chua_co_so', v_thieu),
    'cach_tinh', jsonb_build_array(
      format('THƯỜNG ĐẠT = trung bình các lần đo theo tuần, từ tuần %s tới tuần liền trước tuần đang xem, sau khi đã bỏ các lần đo nhiễu.', to_char(v_dau, 'DD/MM/YYYY')),
      format('LỌC NHIỄU: lần đo nằm ngoài khoảng [Q1 − %s × IQR ; Q3 + %s × IQR] của chính chỉ số đó bị coi là nhiễu và không tính vào thường đạt (Q1, Q3 = mốc 25%% và 75%% của các lần đo; IQR = Q3 − Q1).', v_hr, v_hr),
      format('ĐÁNH GIÁ: xấu hơn thường đạt từ %s độ lệch chuẩn của chính chỉ số đó = "dưới thường đạt"; từ %s độ lệch chuẩn = "vấn đề"; tốt hơn từ %s độ lệch chuẩn = "trên thường đạt". Chưa đủ %s lần đo thì chưa đánh giá.', v_s1, v_s2, v_s1, v_min),
      'Chỉ số ghi "chưa chốt": số của tuần còn đổi nhiều trong 7 ngày sau khi tuần kết thúc (bù, trả kết quả test, điểm BTVN) nên chưa đem so với thường đạt.',
      'Việc sau buổi — mẫu số = việc đã tới hạn hoặc đã đóng; việc còn trong hạn để riêng. ĐÚNG CHUẨN = đóng đúng hạn và đủ dữ liệu. CHẬM = đóng sau hạn, hoặc quá hạn chưa đóng. THIẾU = buổi không có đề / không gán bài, bấm đóng mà trống, hoặc đóng mà còn em có mặt thiếu dữ liệu.',
      'Một việc có nhiều người phụ trách thì tính cho từng người ở bảng xếp hạng, nhưng chỉ tính MỘT lần ở con số của trung tâm.',
      'Bổ trợ yếu / đuổi — "cần" = case còn mở trong tuần. "Đã lên lịch" / "đã bổ trợ" đếm theo CASE; "sự cố" đếm theo LƯỢT xếp (1 học sinh × 1 buổi).',
      '"Chuyển lịch" chưa đo được chính xác vì hệ không ghi vết đổi ngày/giờ buổi bổ trợ; con số gần nhất là lượt bị "OPS gỡ khỏi lịch phòng".',
      'Bổ trợ bù tính theo LƯỢT VẮNG của tuần: tới lúc tính thì lượt vắng đó đã được xếp bù / đã học bù chưa.',
      'Kết quả học tập — điểm trung bình lấy trên các lượt đã có điểm; "thấp hơn hẳn lớp" = dưới 80% trung bình lớp của chính buổi đó, từ 2 buổi trong tuần.',
      'Tuyển sinh — ứng viên thành học sinh / bị loại đếm theo ngày đổi trạng thái; "tồn đọng" = ca đã test xong mà tới Chủ nhật của tuần vẫn chưa trả kết quả.',
      'Chấm bài trên lớp chỉ bắt buộc từ 01/10/2026 nên trước đó không có trong tổng kết.'));
end $$;

-- Phần TÍNH của tổng kết tuần: làm mới bảng số rồi dựng dashboard. p_tuan = ngày bất kỳ trong tuần.
-- Giữ nguyên chữ ký (date) → jsonb; chỉ đổi stable thành volatile vì giờ có ghi bảng số tuần.
create or replace function public.fn_troly_tuan(p_tuan date) returns jsonb
language plpgsql volatile as $$
declare v_tu date := public._troly_dau_tuan(p_tuan);
begin
  perform public._troly_gac();
  if v_tu > public._troly_hom_nay() then raise exception 'Tuần này chưa bắt đầu.'; end if;
  perform public._troly_tuan_cap_nhat(v_tu, true, 3);
  return public._troly_tuan_doc(v_tu);
end $$;

-- Tính + ghi bản lưu của một tuần. p_ns = người bấm; NULL = hệ tự tính.
create or replace function public._troly_tuan_tinh_luu(p_tu date, p_ns uuid) returns troly_bao_cao_luu
language plpgsql volatile as $$
declare r troly_bao_cao_luu%rowtype; v jsonb; t0 timestamptz := clock_timestamp();
begin
  perform public._troly_gac();
  v := public.fn_troly_tuan(p_tu);
  insert into troly_bao_cao_luu as l (bo, ngay, so_ngay, ket_qua, tinh_luc, tinh_boi, tinh_mat_ms, so_lan_tinh)
    values ('tuan', p_tu, 7, v, now(), p_ns, (extract(epoch from clock_timestamp() - t0) * 1000)::int, 1)
  on conflict (bo, ngay, so_ngay) do update
    set ket_qua = excluded.ket_qua, tinh_luc = excluded.tinh_luc, tinh_boi = excluded.tinh_boi,
        tinh_mat_ms = excluded.tinh_mat_ms, so_lan_tinh = l.so_lan_tinh + 1
  returning l.* into r;
  return r;
end $$;

-- CỬA màn hình gọi. Bản lưu dùng lại khi: có khoá `chi_so` (đúng khuôn mới) VÀ (tính trong hôm nay,
-- hoặc tuần đã chín và bản lưu được tính sau khi chín).
create or replace function public.fn_troly_tuan_lay(p_tuan date default null, p_tinh_lai boolean default false)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  v_nay date := public._troly_hom_nay();
  v_tu date := public._troly_dau_tuan(coalesce(p_tuan, public._troly_hom_nay() - 7));   -- mặc định: tuần vừa rồi
  r troly_bao_cao_luu%rowtype;
  v_moi boolean := false;
begin
  perform public._troly_gac();
  if v_tu > v_nay then raise exception 'Tuần này chưa bắt đầu.'; end if;

  if not coalesce(p_tinh_lai, false) then
    select * into r from troly_bao_cao_luu l where l.bo = 'tuan' and l.ngay = v_tu and l.so_ngay = 7;
    if r.bo is not null and not (
         r.ket_qua ? 'chi_so'
         and ((r.tinh_luc at time zone 'Asia/Ho_Chi_Minh')::date = v_nay
              or (v_tu + 6 + 14 < v_nay and (r.tinh_luc at time zone 'Asia/Ho_Chi_Minh')::date > v_tu + 6 + 14))) then
      r := null;
    end if;
  end if;

  if r.bo is null then
    r := public._troly_tuan_tinh_luu(v_tu, public.current_nhan_su_id());
    v_moi := true;
  end if;

  return r.ket_qua || jsonb_build_object('luu', jsonb_build_object(
    'vua_tinh', v_moi,
    'tinh_luc', to_char(r.tinh_luc at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI DD/MM'),
    'tinh_boi', coalesce((select ns.ho_ten from nhan_su ns where ns.id = r.tinh_boi), 'hệ thống tự tính'),
    'tinh_mat_ms', r.tinh_mat_ms,
    'so_lan_tinh', r.so_lan_tinh));
end $$;

-- ── HỆ TỰ TÍNH sáng thứ Hai (api/troly-tuan.mjs gọi, có khoá bí mật) ──────────────────
-- Tính + lưu tổng kết của tuần vừa rồi, trả câu tóm tắt và danh sách máy nhận thông báo của
-- ĐÚNG những người được dùng trợ lý.
create or replace function public.fn_troly_tuan_tu_dong(p_secret text, p_app text default 'pt')
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  v_tu date := public._troly_dau_tuan(public._troly_hom_nay() - 7);
  r troly_bao_cao_luu%rowtype;
  v_dc numeric; v_vd int; v_duoi int; v_ten text;
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  perform set_config('troly.noi_bo', '1', true);   -- chỉ sống trong transaction này
  r := public._troly_tuan_tinh_luu(v_tu, null);
  perform set_config('troly.noi_bo', '', true);    -- tính xong là hạ cờ

  select (c->>'gia_tri')::numeric into v_dc
    from jsonb_array_elements(r.ket_qua->'chi_so') c where c->>'ma' = 'khau.tong.dung_chuan';
  select count(*) filter (where c->>'danh_gia' = 'van_de'), count(*) filter (where c->>'danh_gia' = 'duoi'),
         string_agg(c->>'ten', ' · ') filter (where c->>'danh_gia' = 'van_de')
    into v_vd, v_duoi, v_ten
    from jsonb_array_elements(r.ket_qua->'chi_so') c;

  return jsonb_build_object(
    'tu', v_tu, 'den', v_tu + 6,
    'tieu_de', format('Tổng kết tuần %s – %s', to_char(v_tu, 'DD/MM'), to_char(v_tu + 6, 'DD/MM')),
    'noi_dung', format('Việc sau buổi đúng chuẩn %s%%. %s chỉ số có vấn đề, %s chỉ số dưới thường đạt.%s',
                       coalesce(v_dc::text, '—'), v_vd, v_duoi,
                       case when v_vd > 0 then ' Vấn đề: ' || left(v_ten, 120) else '' end),
    'so_van_de', v_vd, 'so_duoi_thuong_dat', v_duoi,
    'nguoi_nhan', (select coalesce(jsonb_agg(jsonb_build_object(
                      'id', d.id, 'endpoint', d.endpoint, 'p256dh', d.p256dh, 'auth', d.auth, 'nhan_su_id', d.nhan_su_id)), '[]'::jsonb)
                     from push_dang_ky d
                     join tai_khoan tk on tk.nhan_su_id = d.nhan_su_id
                     join nhan_su ns on ns.id = d.nhan_su_id and ns.trang_thai = 'dang_lam'
                    where tk.id = any(public.hoi_dap_ds_tai_khoan())
                      and d.app = coalesce(p_app, 'pt') and d.loi_ma is distinct from 410),
    'chua_dang_ky_nhan', (select coalesce(jsonb_agg(ns.ho_ten order by ns.ho_ten), '[]'::jsonb)
                            from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id
                           where tk.id = any(public.hoi_dap_ds_tai_khoan())
                             and not exists (select 1 from push_dang_ky d where d.nhan_su_id = ns.id
                                               and d.app = coalesce(p_app, 'pt') and d.loi_ma is distinct from 410)));
end $$;

-- ── Quyền: chỉ 2 cửa mở ra ngoài; mọi hàm tính bên trong thì thu ─────────────────────
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig, p.proname
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('_troly_cb_so', '_troly_tuan_hoc_tap', '_troly_tuan_duoi', '_troly_tuan_tuyen_sinh',
                        '_troly_tuan_so_day_du', '_troly_tuan_danh_muc', '_troly_tuan_cap_nhat', '_troly_tuan_doc',
                        '_troly_tuan_tinh_luu', '_troly_bc_gia_dinh', 'fn_troly_tuan', 'fn_troly_tuan_lay', 'fn_troly_tuan_tu_dong')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', r.sig);
    if r.proname = 'fn_troly_tuan_lay' then
      execute format('grant execute on function %s to authenticated', r.sig);
    elsif r.proname = 'fn_troly_tuan_tu_dong' then
      execute format('grant execute on function %s to anon, authenticated', r.sig);   -- có khoá bí mật bên trong
    end if;
  end loop;
end $$;

comment on function public.fn_troly_tuan_tu_dong(text, text) is
  'Cron sáng thứ Hai (api/troly-tuan.mjs): tính + lưu Tổng kết tuần của tuần vừa rồi, trả câu tóm tắt + máy nhận thông báo của nhóm được dùng trợ lý. Khoá = he_thong_bi_mat.push_cron.';

-- ── Dựng số cho MỌI tuần đã qua (một lần) để thường đạt có đủ lịch sử ─────────────────
select set_config('troly.noi_bo', '1', true);
select public._troly_tuan_cap_nhat(public._troly_hom_nay(), false, 1000);
select set_config('troly.noi_bo', '', true);   -- hạ cờ ngay, không để sống tới hết transaction
