-- ============================================================================
-- 202609291026 — troly_btvn_ti_le_nop
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 29/09: mục BTVN của báo cáo Sư phạm có HAI phần —
--     1. HỌC SINH làm BTVN như nào            → đã có (các cảnh báo không làm / thái độ / điểm thấp).
--     2. TRỢ GIẢNG đang chấm BTVN như nào      → CHƯA có. Cần: lớp nào tỉ lệ nộp BTVN tệ
--        ("4/10 nộp là 40%"); bấm Detail thì hiện từng lớp: TA chấm bài, buổi học ngày nào,
--        học sinh nào chưa nộp / thiếu thông tin. "Thiếu thông tin cũng tính là CHƯA ĐẠT
--        CHUẨN dữ liệu."
--
--   ⇒ Phần 2 đo theo (lớp × buổi giao bài × học sinh). Một em tính là ĐẠT khi có ĐỦ cả ba:
--     trạng thái nộp là đã nộp (đúng hạn / muộn) · đã tick thái độ · có điểm chấm câu.
--     Thiếu một trong ba ⇒ không đạt, và ghi rõ thiếu gì để TA biết đi điền gì.
--
--   MẪU SỐ = em CÓ MẶT ở buổi giao bài (em có mặt là em nhận bài) + em vắng mà vẫn có dòng
--   BTVN. Không lấy sĩ số lớp: em vắng buổi giao thì không có bài để nộp, tính vào là kéo tỉ
--   lệ xuống oan.
--
--   CHỈ xét buổi TA đã tới lượt chấm: đã bấm đóng BTVN, hoặc đã quá hạn (hạn = giờ vào ca kế
--   − 2 giờ, `fn_han_viec`). Buổi còn trong hạn mà chưa chấm thì chưa có gì để chê.
--
--   "TA chấm bài" hiện HAI thứ vì chúng có thể khác nhau: người được PHÂN CÔNG (phân công lớp)
--   và người THỰC TẾ chấm (`gami_grades.graded_by`). Lệch nhau là tín hiệu đáng biết.
--
--   Kèm một chỉnh kiến trúc: phần "thêm của từng mục" gom vào `_troly_bc_them` để lần sau bổ
--   sung nội dung cho một mục chỉ phải thay hàm đó, không phải chép lại cả `fn_troly_bao_cao`.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Thêm 2 hàm, thay thân 2 hàm đang có (`_troly_bc_gia_dinh`, `fn_troly_bao_cao`)
--   theo hướng chỉ THÊM khoá vào kết quả.
-- ============================================================================

create or replace function public._troly_bc_gia_dinh() returns jsonb
language sql immutable as $$
  select jsonb_build_object(
    'ti_le_bao_dong', 0.8,      -- điểm < 80% TB lớp
    'si_so_toi_thieu', 3,       -- lớp dưới 3 em có điểm thì không so với TB
    'muc_bao_dong', 2,          -- mức đánh giá ≤ 2
    'ngay_nhin_lai', 30,
    'ingame_bat_buoc_tu', '2026-10-01',   -- CEO 29/09: chấm bài trên lớp bắt buộc từ tháng 10
    'btvn_ti_le_nop_toi_thieu', 0.7)      -- lớp có tỉ lệ nộp đạt chuẩn dưới mức này = "tệ" (CHỜ CEO chốt số)
$$;

-- ── BTVN phần 2: TRỢ GIẢNG chấm BTVN — tỉ lệ nộp đạt chuẩn theo lớp ───────────
create or replace function public._troly_bc_btvn_ti_le(p_tu date, p_den date) returns jsonb
language plpgsql stable as $$
declare v jsonb; v_ng numeric := (public._troly_bc_gia_dinh()->>'btvn_ti_le_nop_toi_thieu')::numeric;
begin
  perform public._troly_gac();
  with b0 as (
    select bh.id, bh.lop_id, bh.ngay, bh.btvn_dong_at, l.ten_lop, l.mon,
           public.fn_han_viec(bh.lop_id, bh.ngay, bh.gio_bat_dau, 'btvn') as han
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay between p_tu and p_den
      and (exists (select 1 from tai_lieu t where t.loai = 'btvn' and t.lop_id = bh.lop_id and t.ngay = bh.ngay)
        or exists (select 1 from bai_test x where x.loai = 'btvn' and x.lop_id = bh.lop_id and x.ngay = bh.ngay)
        or exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = bh.id and sp.phase = 'btvn'))
  ),
  b as (select * from b0 where b0.btvn_dong_at is not null or (b0.han is not null and b0.han < now())),
  kq as (
    select k.buoi_hoc_id, k.hoc_sinh_id, k.trang_thai_nop, k.thai_do
    from btvn_ket_qua k where k.buoi_hoc_id in (select id from b)
  ),
  diem as (  -- (buổi, em) có ít nhất 1 câu BTVN được chấm, kèm người chấm
    select sp.buoi_hoc_id, g.hoc_sinh_id, g.graded_by
    from gami_session_problems sp join gami_grades g on g.problem_id = sp.id
    where sp.phase = 'btvn' and sp.buoi_hoc_id in (select id from b)
  ),
  can as (  -- mẫu số: em có mặt buổi giao ∪ em có dòng BTVN
    select h.buoi_hoc_id, h.hoc_sinh_id from buoi_hoc_hs h
     where h.buoi_hoc_id in (select id from b) and h.diem_danh = 'co_mat'
    union
    select kq.buoi_hoc_id, kq.hoc_sinh_id from kq
  ),
  e as (  -- phán từng em
    select c.buoi_hoc_id, c.hoc_sinh_id, hs.ho_ten,
      case
        when kq.hoc_sinh_id is null then 'Chưa có dòng BTVN nào'
        when kq.trang_thai_nop is null then 'Chưa tick trạng thái nộp'
        when kq.trang_thai_nop = 'khong_lam' then 'Chưa nộp — không làm'
        when kq.trang_thai_nop = 'xin_phep' then 'Chưa nộp — xin phép'
        when concat_ws(' + ',
               case when kq.thai_do is null then 'thái độ' end,
               case when not exists (select 1 from diem d where d.buoi_hoc_id = c.buoi_hoc_id and d.hoc_sinh_id = c.hoc_sinh_id) then 'điểm chấm' end) <> ''
          then 'Đã nộp nhưng thiếu thông tin: ' || concat_ws(' + ',
               case when kq.thai_do is null then 'thái độ' end,
               case when not exists (select 1 from diem d where d.buoi_hoc_id = c.buoi_hoc_id and d.hoc_sinh_id = c.hoc_sinh_id) then 'điểm chấm' end)
      end as ly_do,   -- NULL = đạt chuẩn
      case when kq.hoc_sinh_id is null or kq.trang_thai_nop is null then 'thieu'
           when kq.trang_thai_nop in ('khong_lam', 'xin_phep') then 'chua_nop'
           else 'thieu' end as nhom
    from can c
    join hoc_sinh hs on hs.id = c.hoc_sinh_id
    left join kq on kq.buoi_hoc_id = c.buoi_hoc_id and kq.hoc_sinh_id = c.hoc_sinh_id
  ),
  bb as (  -- từng buổi
    select b.id, b.lop_id, b.ten_lop, b.mon, b.ngay, b.btvn_dong_at, b.han,
      (select count(*) from e where e.buoi_hoc_id = b.id)::int as can_co,
      (select count(*) from e where e.buoi_hoc_id = b.id and e.ly_do is null)::int as dat,
      (select count(*) from e where e.buoi_hoc_id = b.id and e.ly_do is not null and e.nhom = 'chua_nop')::int as chua_nop,
      (select count(*) from e where e.buoi_hoc_id = b.id and e.ly_do is not null and e.nhom = 'thieu')::int as thieu_thong_tin,
      (select coalesce(jsonb_agg(jsonb_build_object('ho_ten', e.ho_ten, 'ly_do', e.ly_do, 'nhom', e.nhom)
                order by e.nhom desc, e.ho_ten), '[]'::jsonb)
         from e where e.buoi_hoc_id = b.id and e.ly_do is not null) as hs,
      (select string_agg(distinct ns.ho_ten, ', ') from diem d
         join tai_khoan tk on tk.id = d.graded_by join nhan_su ns on ns.id = tk.nhan_su_id
        where d.buoi_hoc_id = b.id) as nguoi_cham
    from b
  ),
  ll as (  -- từng lớp
    select bb.lop_id, max(bb.ten_lop) as ten_lop, max(bb.mon) as mon,
      count(*)::int as so_buoi, sum(bb.can_co)::int as can_co, sum(bb.dat)::int as dat,
      sum(bb.chua_nop)::int as chua_nop, sum(bb.thieu_thong_tin)::int as thieu_thong_tin,
      (select string_agg(ns.ho_ten, ', ' order by pc.la_chinh desc nulls last, ns.ho_ten)
         from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
        where pc.lop_id = bb.lop_id and pc.vai_tro = 'tg') as ta_phan_cong,
      jsonb_agg(jsonb_build_object(
        'ngay', bb.ngay,
        'han', to_char(bb.han at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
        'da_dong', bb.btvn_dong_at is not null,
        'dong_luc', to_char(bb.btvn_dong_at at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
        'nguoi_cham', bb.nguoi_cham,
        'can_co', bb.can_co, 'dat', bb.dat, 'chua_nop', bb.chua_nop, 'thieu_thong_tin', bb.thieu_thong_tin,
        'ti_le_pct', case when bb.can_co > 0 then round(bb.dat * 100.0 / bb.can_co)::int end,
        'hs', bb.hs) order by bb.ngay desc) as buoi
    from bb group by bb.lop_id
  ),
  lx as (
    select ll.*, case when ll.can_co > 0 then round(ll.dat * 100.0 / ll.can_co)::int end as ti_le_pct,
           (ll.can_co > 0 and ll.dat::numeric / ll.can_co < v_ng) as duoi_nguong
    from ll
  )
  select jsonb_build_object(
    'nguong_pct', round(v_ng * 100)::int,
    'so_lop', (select count(*) from lx),
    'so_lop_duoi_nguong', (select count(*) from lx where duoi_nguong),
    'so_buoi', (select coalesce(sum(so_buoi), 0) from lx),
    'can_co', (select coalesce(sum(can_co), 0) from lx),
    'dat', (select coalesce(sum(dat), 0) from lx),
    'chua_nop', (select coalesce(sum(chua_nop), 0) from lx),
    'thieu_thong_tin', (select coalesce(sum(thieu_thong_tin), 0) from lx),
    'ti_le_pct', (select case when sum(can_co) > 0 then round(sum(dat) * 100.0 / sum(can_co))::int end from lx),
    'lop', (select coalesce(jsonb_agg(jsonb_build_object(
        'ten_lop', lx.ten_lop, 'mon', lx.mon, 'ta_phan_cong', lx.ta_phan_cong,
        'so_buoi', lx.so_buoi, 'can_co', lx.can_co, 'dat', lx.dat,
        'chua_nop', lx.chua_nop, 'thieu_thong_tin', lx.thieu_thong_tin,
        'ti_le_pct', lx.ti_le_pct, 'duoi_nguong', lx.duoi_nguong, 'buoi', lx.buoi)
        order by lx.ti_le_pct nulls last, lx.ten_lop), '[]'::jsonb) from lx),
    'cach_tinh', jsonb_build_array(
      'Một em ĐẠT CHUẨN khi đủ cả ba: đã nộp (đúng hạn hoặc muộn) · đã tick thái độ · có điểm chấm câu. Thiếu một trong ba là không đạt.',
      'Mẫu số = em có mặt ở buổi giao bài, cộng em vắng mà vẫn có dòng BTVN.',
      'Chỉ tính buổi đã bấm đóng BTVN hoặc đã quá hạn chấm (giờ vào ca kế − 2 giờ). Buổi còn trong hạn chưa tính.',
      format('Lớp "tệ" = tỉ lệ dưới %s%% — con số này em tạm đặt, chờ chốt.', round(v_ng * 100)))
  ) into v;
  return v;
end $$;

-- Phần THÊM của từng mục: { <mã mục>: { <khoá>: … } } — được trộn thẳng vào JSON của mục.
create or replace function public._troly_bc_them(p_tu date, p_den date) returns jsonb
language plpgsql stable as $$
begin
  perform public._troly_gac();
  return jsonb_build_object(
    'btvn', jsonb_build_object('ti_le_nop', public._troly_bc_btvn_ti_le(p_tu, p_den)));
end $$;

create or replace function public.fn_troly_bao_cao(p_den date default null, p_so_ngay integer default 14) returns jsonb
language plpgsql stable as $$
declare
  v_nay date := public._troly_hom_nay();
  v_den date := least(coalesce(p_den, public._troly_hom_nay()), public._troly_hom_nay());
  v_n int := least(greatest(coalesce(p_so_ngay, 14), 1), 60);
  v_tu date; v_cb jsonb; v_ts jsonb; v_them jsonb; v jsonb;
  c_tran constant int := 200;
begin
  perform public._troly_gac();
  v_tu := v_den - (v_n - 1);
  v_cb := public._troly_bc_canh_bao(v_tu, v_den);
  v_ts := public._troly_bc_thong_so(v_tu, v_den);
  v_them := public._troly_bc_them(v_tu, v_den);

  with t as (
    select * from public._troly_bc_viec_buoi(v_tu, v_den)
    union all select * from public._troly_bc_viec_bu(v_tu, v_den)
    union all select * from public._troly_bc_viec_yeu(v_tu, v_den)
  ),
  m(ma, ten, thu_tu) as (values
    ('btvn', 'BTVN', 1), ('et', 'ET', 2), ('trong_buoi', 'Đánh giá trong buổi học', 3),
    ('sau_buoi', 'Đánh giá sau buổi học', 4), ('mt', 'MT', 5),
    ('bo_tro_bu', 'Bổ trợ bù', 6), ('bo_tro_yeu', 'Bổ trợ yếu', 7)),
  mm as (
    select m.*,
      (select count(*) from t where t.muc = m.ma and t.loai = 'cham')::int as cham,
      (select count(*) from t where t.muc = m.ma and t.loai = 'miss')::int as miss,
      (select count(*) from t where t.muc = m.ma and t.loai = 'xong_muon')::int as xong_muon,
      (select count(*) from t where t.muc = m.ma and t.loai = 'hs_khong_den')::int as hs_khong_den,
      coalesce(v_cb->m.ma, '[]'::jsonb) as canh_bao,
      coalesce(v_ts->m.ma, '[]'::jsonb) as thong_so,
      coalesce(v_them->m.ma, '{}'::jsonb) as them
    from m
  )
  select jsonb_build_object(
    'bo', 'su_pham', 'ten', 'Báo cáo Sư phạm',
    'ghi_chu_bo', 'Dựng theo mẫu của Trang (quản Sư phạm). Báo cáo Vận hành của Lộc — gồm bổ trợ đuổi và mọi việc không thuộc sư phạm — là báo cáo khác, chưa xây.',
    'tu', v_tu, 'den', v_den, 'so_ngay', v_n,
    'tao_luc', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI'),
    'tong', jsonb_build_object(
      'cham', (select count(*) from t where loai = 'cham'),
      'miss', (select count(*) from t where loai = 'miss'),
      'xong_muon', (select count(*) from t where loai = 'xong_muon'),
      'hs_khong_den', (select count(*) from t where loai = 'hs_khong_den'),
      'canh_bao', (select count(*) from jsonb_each(v_cb) e, jsonb_array_elements(e.value) c where c->>'muc_do' in ('cao', 'vua'))),
    'muc', (select jsonb_agg(jsonb_build_object(
        'ma', mm.ma, 'ten', mm.ten, 'cham', mm.cham, 'miss', mm.miss, 'xong_muon', mm.xong_muon,
        'hs_khong_den', mm.hs_khong_den,
        'canh_bao', mm.canh_bao, 'thong_so', mm.thong_so,
        'da_cat', mm.cham + mm.miss + mm.xong_muon + mm.hs_khong_den > c_tran,
        'viec', (select coalesce(jsonb_agg(jsonb_build_object(
                     'loai', y.loai, 'ngay', y.ngay, 'doi_tuong', y.doi_tuong, 'viec', y.viec, 'phu_trach', y.phu_trach,
                     'han', to_char(y.han at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
                     'xong_luc', to_char(y.xong_luc at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
                     'tinh_trang', y.tinh_trang)), '[]'::jsonb)
                 from (select * from t where t.muc = mm.ma
                       order by array_position(array['cham', 'miss', 'hs_khong_den', 'xong_muon'], t.loai), t.ngay, t.doi_tuong
                       limit c_tran) y)
      ) || mm.them order by mm.thu_tu)
      from mm
      -- MT chỉ hiện khi khoảng báo cáo có việc MT (đa số tuần không có)
      where mm.ma <> 'mt' or mm.cham + mm.miss + mm.xong_muon > 0),
    'canh_bao_chung', coalesce(v_cb->'chung', '[]'::jsonb),
    'theo_nguoi', (select coalesce(jsonb_agg(to_jsonb(g) order by g.cham + g.miss desc, g.phu_trach), '[]'::jsonb) from (
        -- gom theo NGƯỜI, bỏ nhãn vai "(GV)/(TA)/(TA đứng ca)…": một người hai vai vẫn là một người
        select regexp_replace(p.nguoi, '\s*\(.*\)$', '') as phu_trach,
               count(*) filter (where t.loai = 'cham')::int as cham,
               count(*) filter (where t.loai = 'miss')::int as miss,
               count(*) filter (where t.loai = 'xong_muon')::int as xong_muon
        from t cross join lateral regexp_split_to_table(t.phu_trach, ', ') p(nguoi)
        group by 1) g
      where g.cham + g.miss > 0),
    'cach_hieu', jsonb_build_array(
      'CHẬM = quá hạn mà chưa đóng. MISS = hỏng về nội dung: buổi không có đề / không gán bài, bấm đóng mà trống dữ liệu, đã đóng nhưng còn em có mặt thiếu dữ liệu, ca bổ trợ hoàn tất mà không test.',
      '"Học sinh không đến" (ca bổ trợ bị huỷ vì em vắng) là thông số RIÊNG, không tính vào chậm hay miss.',
      '"Đóng muộn" (đã xong, đủ dữ liệu, nhưng sau hạn) đếm riêng, không tính vào đang chậm.',
      format('Chấm bài trên lớp chỉ bắt buộc từ %s; buổi trước ngày đó không tính.', to_char((public._troly_bc_gia_dinh()->>'ingame_bat_buoc_tu')::date, 'DD/MM/YYYY')),
      'Người phụ trách + hạn lấy từ phân công lớp, cùng nguồn với màn Việc của tôi. Hạn: ET / chấm bài trên lớp / đánh giá = giờ vào ca + 36 giờ · BTVN = giờ vào ca kế − 2 giờ · MT = + 72 giờ.',
      '"Không có đề" chỉ tính miss với lớp thật sự chạy khâu đó (từ 60% buổi trong 60 ngày có đề).',
      format('Xếp bù và xếp lịch bổ trợ yếu: người phụ trách là người giữ ghế trưởng team Vận hành (hiện là %s).', public._troly_truong_van_hanh()))
  ) into v;
  return v;
end $$;

do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('_troly_bc_gia_dinh', '_troly_bc_btvn_ti_le', '_troly_bc_them', 'fn_troly_bao_cao')
  loop
    execute format('revoke all on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated', r.sig);
  end loop;
end $$;
