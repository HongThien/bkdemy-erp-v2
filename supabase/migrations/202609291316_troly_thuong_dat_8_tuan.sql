-- ============================================================================
-- 202609291316 — troly_thuong_dat_8_tuan
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 29/09, sau khi xem bản đầu: "lấy 8 tuần gần nhất đi".
--   Bản trước tính thường đạt trên TOÀN BỘ các tuần từ 15/06. Khâu đang cải thiện theo thời gian
--   (BTVN đúng chuẩn 0% → 36%) thì thường đạt toàn lịch sử rất thấp (12%) ⇒ tuần nào cũng "trên
--   thường đạt", và tuần tốt gần đây bị hàng rào Tukey coi là nhiễu. Cửa sổ 8 tuần trượt theo tuần
--   đang xem: thường đạt bám mức GẦN ĐÂY của trung tâm, không bị các tuần đầu còn lộn xộn kéo xuống.
--   (Tên gọi: trung bình trượt — moving average — trên biểu đồ kiểm soát.)
--   Số tuần nằm MỘT chỗ: `_troly_bc_gia_dinh().thuong_dat_so_tuan`.
--
--   Bản lưu tổng kết tuần tính theo luật cũ phải bị coi là CŨ. Bản trước nhận biết khuôn bằng
--   "có khoá chi_so", không phân biệt được luật cũ/mới ⇒ thêm SỐ PHIÊN BẢN của cách tính
--   (`_troly_tuan_phien_ban()`): bản lưu khác phiên bản thì tự tính lại. Lần sau đổi luật chỉ cần
--   tăng số này.
--
--   Thân 3 hàm lấy từ bản ĐANG CHẠY (pg_get_functiondef) rồi thay đúng các chỗ cần đổi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Thêm 1 hàm; thay thân 3 hàm. Số từng tuần trong `troly_tuan_so_luu` giữ nguyên
--   (vẫn đủ từ 15/06 — cửa sổ chỉ quyết định LẤY những tuần nào ra tính). Bản lưu tổng kết cũ
--   không bị xoá, chỉ bị ghi đè khi có người mở lại tuần đó.
-- ============================================================================

-- Phiên bản của CÁCH TÍNH tổng kết tuần. 1 = thường đạt toàn lịch sử · 2 = thường đạt 8 tuần gần nhất.
create or replace function public._troly_tuan_phien_ban() returns integer
language sql immutable as $$ select 2 $$;
revoke all on function public._troly_tuan_phien_ban() from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public._troly_bc_gia_dinh()
 RETURNS jsonb
 LANGUAGE sql
 IMMUTABLE
AS $function$
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
    'thuong_dat_so_tuan', 8,              -- CEO 29/09 "lấy 8 tuần gần nhất đi": thường đạt tính trên 8 tuần liền trước
    'thuong_dat_so_tuan_toi_thieu', 4,    -- dưới 4 lần đo thì chưa đánh giá
    'nhieu_he_so_iqr', 1.5,               -- hàng rào Tukey: ngoài Q1/Q3 ± 1,5 × IQR là nhiễu
    'thuong_dat_sigma_luu_y', 1,          -- xấu hơn thường đạt ≥ 1 độ lệch chuẩn = "dưới thường đạt"
    'thuong_dat_sigma_van_de', 2)         -- ≥ 2 độ lệch chuẩn = "vấn đề"
$function$;

CREATE OR REPLACE FUNCTION public._troly_tuan_doc(p_tu date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
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
  v_tdn int := (g->>'thuong_dat_so_tuan')::int;
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
  cu as (  -- ⟵ ĐỔI: chỉ các tuần trong CỬA SỔ v_tdn tuần liền trước tuần đang xem
    select ls.* from ls where ls.tuan < p_tu and ls.tuan >= p_tu - 7 * v_tdn and ls.v is not null
  ),
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
    'phien_ban', public._troly_tuan_phien_ban(),
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
      'tu_tuan', v_dau, 'so_tuan', v_tdn, 'so_tuan_toi_thieu', v_min, 'he_so_nhieu', v_hr,
      'sigma_luu_y', v_s1, 'sigma_van_de', v_s2, 'so_tuan_chua_co_so', v_thieu),
    'cach_tinh', jsonb_build_array(
      format('THƯỜNG ĐẠT = trung bình các lần đo của %s tuần liền trước tuần đang xem, sau khi đã bỏ các lần đo nhiễu. Mảng mới chạy chưa đủ %s tuần thì lấy các tuần đã có.', v_tdn, v_tdn),
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
end $function$;

CREATE OR REPLACE FUNCTION public.fn_troly_tuan_lay(p_tuan date DEFAULT NULL::date, p_tinh_lai boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
         coalesce((r.ket_qua->>'phien_ban')::int, 0) = public._troly_tuan_phien_ban()
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
end $function$;
