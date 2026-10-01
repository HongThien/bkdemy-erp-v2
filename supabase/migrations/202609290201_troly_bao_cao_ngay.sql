-- ============================================================================
-- 202609290201 — troly_bao_cao_ngay
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 29/09 bẻ lái: *"hỏi là phụ, tính năng chính vẫn là BÁO CÁO. Báo cáo đầy đủ dữ liệu
--   cần thì gần như không cần hỏi lại nữa"* + gửi MẪU báo cáo theo ngày (7 mục: BTVN · ET ·
--   Đánh giá trong buổi · Đánh giá sau buổi · Bổ trợ bù · Bổ trợ yếu · Báo cáo bổ trợ tuần).
--   ⇒ Trợ lý = một BẢN BÁO CÁO NGÀY tất định, tính ở Postgres (§2.0), đọc là biết nhắc ai việc
--     gì. Model KHÔNG tham gia tính số nào trong báo cáo này.
--
--   Mỗi mục trả 3 lớp, đúng cách mẫu viết:
--     · tom_tat  — câu đếm "6/8 lớp đã có dữ liệu, 1 lớp trống, 1 lớp có dữ liệu chưa đóng task"
--     · lop      — từng lớp một dòng, để bấm mở xem lớp nào
--     · checklist— danh sách có TÊN học sinh (báo động, bỏ trống, không làm…)
--
--   NHỊP (giữ nguyên chốt 14/08, SPEC-troly-nhansu §2.1): ET + hai loại đánh giá là của buổi
--   NGÀY BÁO CÁO. BTVN là bài giao ở buổi TRƯỚC của lớp, đến hạn nhập vào ngày báo cáo (hạn
--   task = giờ vào ca kế − 2h, `fn_han_viec`). Hạn KHÔNG chép lại ở đây — gọi `fn_han_viec`.
--
--   LUẬT NÓI (CEO 14/08 "có gì hiện đấy, chưa có thì báo chưa có"): dòng nào của mẫu mà hệ
--   CHƯA CÓ NGUỒN dữ liệu thì trả `chua_co_nguon` + lý do, KHÔNG bịa số, KHÔNG im lặng bỏ qua.
--   Đo 29/09 có 3 dòng như vậy: "HS làm bài chậm hơn lớp" (cột `speed` 100% = 'normal', chưa
--   ai từng nhập) · "đã tác động đến đâu" với HS không làm BTVN (không có bảng nào ghi tác
--   động; `hs_level` loại thái độ = 0 dòng) · "danh sách chờ duyệt bổ trợ" (engine phát hiện
--   còn nằm ở client `danhgia.ts`, DB chỉ có lượt ĐÃ duyệt).
--
--   GIẢ ĐỊNH chờ CEO xác nhận (gom 1 chỗ ở `_troly_bc_gia_dinh`, đổi là đổi 1 dòng):
--     A1 "dưới 20% so với trung bình lớp" = điểm < 80% × TB lớp của chính buổi đó (cùng kiểu
--        với luật phát hiện ③ "<90% TB lớp" ở spec-bo-tro §2), lớp phải có ≥3 em có điểm.
--     A2 "Đánh giá trong buổi học" = khâu "Chấm bài trên lớp" (ingame).
--     A3 "báo động qua đánh giá của GV" = GV bấm chuông ở màn đánh giá HOẶC chấm mức ≤ 2.
--     A4 ca bổ trợ "hợp lệ" = đã hoàn tất VÀ em đã nộp bài test cuối ca.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Chỉ thêm hàm đọc. Phụ thuộc mig 202609290143 (cổng + tiện ích `_troly_*`).
-- ============================================================================

create or replace function public._troly_bc_gia_dinh() returns jsonb
language sql immutable as $$
  select jsonb_build_object(
    'ti_le_bao_dong', 0.8,      -- A1: điểm < 80% TB lớp
    'si_so_toi_thieu', 3,       -- A1: lớp dưới 3 em có điểm thì không so với TB
    'muc_bao_dong', 2,          -- A3: mức đánh giá ≤ 2
    'ngay_nhin_lai', 30)        -- cửa sổ đếm "không làm BTVN bao nhiêu lần"
$$;

create or replace function public._troly_thu(p date) returns text
language sql immutable as $$
  select (array['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'])[extract(isodow from p)::int]
$$;

-- ── ET · ĐÁNH GIÁ TRONG BUỔI (ingame) · ĐÁNH GIÁ SAU BUỔI (danhgia) ─────────
-- Ba khâu cùng MỘT khuôn: buổi có "đề" của khâu không → có dữ liệu của ai → đã đóng chưa → hạn.
create or replace function public._troly_bc_khau(p_ngay date, p_khau text) returns jsonb
language plpgsql stable as $$
declare v jsonb;
begin
  perform public._troly_gac();
  with b as (
    select bh.id, bh.lop_id, bh.ngay, l.ten_lop, l.mon,
           case p_khau when 'et' then bh.et_dong_at when 'ingame' then bh.ingame_dong_at else bh.danh_gia_xong_at end as dong_at,
           public.fn_han_viec(bh.lop_id, bh.ngay, bh.gio_bat_dau, p_khau) as han
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay = p_ngay
  ),
  cm as (
    select h.buoi_hoc_id, h.hoc_sinh_id from buoi_hoc_hs h
    where h.buoi_hoc_id in (select id from b) and h.diem_danh = 'co_mat'
  ),
  co as (
    select sp.buoi_hoc_id, g.hoc_sinh_id
      from gami_session_problems sp join gami_grades g on g.problem_id = sp.id
     where p_khau in ('et', 'ingame') and sp.phase = p_khau and sp.buoi_hoc_id in (select id from b)
    union
    select b.id, bl.hoc_sinh_id
      from b join bai_test bt on bt.loai = 'et' and bt.lop_id = b.lop_id and bt.ngay = b.ngay
      join bai_lam bl on bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'
     where p_khau = 'et'
    union
    select d.buoi_hoc_id, d.hoc_sinh_id from buoi_danh_gia d
     where p_khau = 'danhgia' and d.buoi_hoc_id in (select id from b)
  ),
  de as (
    select b.id from b where p_khau = 'danhgia'          -- đánh giá: buổi nào cũng phải có
    union
    select b.id from b where p_khau = 'et' and (
         exists (select 1 from tai_lieu t where t.loai = 'et' and t.lop_id = b.lop_id and t.ngay = b.ngay)
      or exists (select 1 from bai_test bt where bt.loai = 'et' and bt.lop_id = b.lop_id and bt.ngay = b.ngay)
      or exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = b.id and sp.phase = 'et'))
    union
    select b.id from b where p_khau = 'ingame'
      and exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = b.id and sp.phase = 'ingame')
  ),
  r0 as (
    select b.*, (de.id is not null) as co_de,
      (select count(*) from cm where cm.buoi_hoc_id = b.id)::int as so_co_mat,
      (select count(*) from co where co.buoi_hoc_id = b.id)::int as hs_co_du_lieu,
      (select count(*) from buoi_danh_gia d where p_khau = 'danhgia' and d.buoi_hoc_id = b.id
          and nullif(btrim(d.nhan_xet), '') is not null)::int as hs_co_nhan_xet,
      (select coalesce(jsonb_agg(x.ho_ten), '[]'::jsonb) from (
          select hs.ho_ten from cm join hoc_sinh hs on hs.id = cm.hoc_sinh_id
          where cm.buoi_hoc_id = b.id
            and not exists (select 1 from co where co.buoi_hoc_id = b.id and co.hoc_sinh_id = cm.hoc_sinh_id)
          order by hs.ho_ten limit 30) x) as hs_thieu
    from b left join de on de.id = b.id
  ),
  r as (
    select r0.*,
      case when not r0.co_de and r0.hs_co_du_lieu = 0 then 'khong_co_de'
           when r0.hs_co_du_lieu = 0 and r0.dong_at is not null then 'dong_ma_trong'
           when r0.hs_co_du_lieu = 0 then 'trong'
           when r0.dong_at is null then 'co_du_lieu_chua_dong'
           else 'da_dong' end as tinh_trang,
      case when r0.dong_at is not null and r0.han is not null and r0.dong_at > r0.han then 'dong_muon'
           when r0.dong_at is not null then 'dung_han'
           when r0.han is not null and r0.han < now() then 'qua_han'
           else 'con_han' end as han_tt,
      -- có dữ liệu rồi nhưng còn em CÓ MẶT chưa có dòng nào
      (r0.hs_co_du_lieu > 0 and jsonb_array_length(r0.hs_thieu) > 0) as thieu_hs
    from r0
  )
  select jsonb_build_object(
    'khau', p_khau,
    'tom_tat', (select jsonb_build_object(
        'so_lop', count(*),
        'co_de', count(*) filter (where co_de),
        'co_du_lieu', count(*) filter (where hs_co_du_lieu > 0),
        'da_dong_du', count(*) filter (where tinh_trang = 'da_dong' and not thieu_hs),
        'lop_khong_co_de', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where tinh_trang = 'khong_co_de'), '[]'::jsonb),
        'lop_trong', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where tinh_trang = 'trong'), '[]'::jsonb),
        'lop_dong_ma_trong', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where tinh_trang = 'dong_ma_trong'), '[]'::jsonb),
        'lop_co_du_lieu_chua_dong', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where tinh_trang = 'co_du_lieu_chua_dong'), '[]'::jsonb),
        'lop_dong_muon', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where han_tt = 'dong_muon'), '[]'::jsonb),
        'lop_qua_han_chua_dong', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where han_tt = 'qua_han' and tinh_trang <> 'khong_co_de'), '[]'::jsonb),
        'lop_thieu_hoc_sinh', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where thieu_hs), '[]'::jsonb),
        'lop_khong_nhan_xet', coalesce(jsonb_agg(ten_lop order by ten_lop)
             filter (where p_khau = 'danhgia' and hs_co_du_lieu > 0 and hs_co_nhan_xet = 0), '[]'::jsonb)) from r),
    'lop', (select coalesce(jsonb_agg(jsonb_build_object(
        'ten_lop', ten_lop, 'mon', mon, 'co_de', co_de, 'so_co_mat', so_co_mat,
        'hs_co_du_lieu', hs_co_du_lieu, 'hs_co_nhan_xet', hs_co_nhan_xet, 'hs_thieu', hs_thieu,
        'da_dong', dong_at is not null,
        'dong_luc', to_char(dong_at at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
        'han', to_char(han at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
        'tinh_trang', tinh_trang, 'han_tt', han_tt) order by ten_lop), '[]'::jsonb) from r)
  ) into v;
  return v;
end $$;

-- Học sinh BÁO ĐỘNG ở ET của ngày báo cáo: điểm < tỉ lệ × TB lớp (A1). Điểm % gọi `fn_matrix_lop`
-- (đúng số trên app) — hàm đó chỉ trả buổi ĐÃ ĐÓNG khâu, nên buổi chưa đóng ET chưa xét được.
create or replace function public._troly_bc_et_bao_dong(p_ngay date) returns jsonb
language plpgsql stable as $$
declare v jsonb; g jsonb := public._troly_bc_gia_dinh();
begin
  perform public._troly_gac();
  with b as (
    select bh.id, bh.lop_id, bh.ngay, l.ten_lop, bh.et_dong_at
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay = p_ngay
  ),
  mx as (
    select b.id as buoi_id, b.ten_lop, m.hoc_sinh_id, m.pct, m.status
    from b cross join lateral public.fn_matrix_lop(b.lop_id, 'et', to_char(b.ngay, 'YYYY-MM')) m
    where m.buoi_hoc_id = b.id
  ),
  tb as (select buoi_id, avg(pct) as tb, count(*) as n from mx where status = 'done' group by buoi_id)
  select jsonb_build_object(
    'hoc_sinh', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select hs.ho_ten, mx.ten_lop, mx.pct as diem_pct, round(tb.tb)::int as tb_lop_pct
        from mx join tb on tb.buoi_id = mx.buoi_id join hoc_sinh hs on hs.id = mx.hoc_sinh_id
        where mx.status = 'done' and tb.n >= (g->>'si_so_toi_thieu')::int
          and mx.pct < (g->>'ti_le_bao_dong')::numeric * tb.tb
        order by mx.ten_lop, mx.pct, hs.ho_ten limit 80) x),
    'lop_da_xet', (select coalesce(jsonb_agg(distinct ten_lop), '[]'::jsonb) from mx),
    'lop_chua_xet_duoc', (select coalesce(jsonb_agg(b.ten_lop order by b.ten_lop), '[]'::jsonb)
                            from b where not exists (select 1 from mx where mx.buoi_id = b.id)),
    'nguong', format('điểm < %s%% × trung bình lớp của buổi đó (lớp có từ %s em có điểm)',
                     round((g->>'ti_le_bao_dong')::numeric * 100), g->>'si_so_toi_thieu')
  ) into v;
  return v;
end $$;

-- ── BTVN ĐẾN HẠN NGÀY BÁO CÁO ───────────────────────────────────────────────
create or replace function public._troly_bc_btvn(p_ngay date) returns jsonb
language plpgsql stable as $$
declare v jsonb; g jsonb := public._troly_bc_gia_dinh(); v_nl int := (public._troly_bc_gia_dinh()->>'ngay_nhin_lai')::int;
begin
  perform public._troly_gac();
  with b as (
    select bh.id, bh.lop_id, bh.ngay, l.ten_lop, l.mon
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay = p_ngay
  ),
  p0 as (  -- buổi thường LIỀN TRƯỚC của lớp = buổi GIAO bài đến hạn hôm nay
    select b.ten_lop, b.mon, b.lop_id, q.id, q.ngay, q.gio_bat_dau, q.btvn_dong_at as dong_at
    from b left join lateral (
      select q.id, q.ngay, q.gio_bat_dau, q.btvn_dong_at from buoi_hoc q
      where q.lop_id = b.lop_id and q.loai = 'thuong' and q.trang_thai <> 'huy' and q.ngay < b.ngay
      order by q.ngay desc limit 1) q on true
  ),
  p as (
    select p0.*, public.fn_han_viec(p0.lop_id, p0.ngay, p0.gio_bat_dau, 'btvn') as han,
      (p0.id is not null and (
           exists (select 1 from tai_lieu t where t.loai = 'btvn' and t.lop_id = p0.lop_id and t.ngay = p0.ngay)
        or exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = p0.id and sp.phase = 'btvn')
        or exists (select 1 from bai_test bt where bt.loai = 'btvn' and bt.lop_id = p0.lop_id and bt.ngay = p0.ngay))) as co_giao,
      exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = p0.id and sp.phase = 'btvn') as co_cau_cham
    from p0
  ),
  cm as (  -- em CÓ MẶT ở buổi giao bài = em phải có dòng BTVN
    select h.buoi_hoc_id, h.hoc_sinh_id from buoi_hoc_hs h
    where h.buoi_hoc_id in (select id from p) and h.diem_danh = 'co_mat'
  ),
  kq as (
    select k.buoi_hoc_id, k.hoc_sinh_id, k.trang_thai_nop, k.thai_do, hs.ho_ten
    from btvn_ket_qua k join hoc_sinh hs on hs.id = k.hoc_sinh_id
    where k.buoi_hoc_id in (select id from p)
  ),
  diem as (
    select distinct sp.buoi_hoc_id, g2.hoc_sinh_id
    from gami_session_problems sp join gami_grades g2 on g2.problem_id = sp.id
    where sp.phase = 'btvn' and sp.buoi_hoc_id in (select id from p)
  ),
  r0 as (
    select p.*,
      (select count(*) from cm where cm.buoi_hoc_id = p.id)::int as so_co_mat,
      (select count(*) from kq where kq.buoi_hoc_id = p.id)::int as hs_co_du_lieu,
      (select coalesce(jsonb_agg(x.ho_ten), '[]'::jsonb) from (
          select hs.ho_ten from cm join hoc_sinh hs on hs.id = cm.hoc_sinh_id
          where cm.buoi_hoc_id = p.id
            and not exists (select 1 from kq where kq.buoi_hoc_id = p.id and kq.hoc_sinh_id = cm.hoc_sinh_id)
          order by hs.ho_ten limit 30) x) as hs_bo_trong,
      (select coalesce(jsonb_agg(kq.ho_ten order by kq.ho_ten), '[]'::jsonb) from kq
        where kq.buoi_hoc_id = p.id and kq.trang_thai_nop is null) as hs_thieu_trang_thai_nop,
      (select coalesce(jsonb_agg(kq.ho_ten order by kq.ho_ten), '[]'::jsonb) from kq
        where kq.buoi_hoc_id = p.id and kq.thai_do is null and kq.trang_thai_nop in ('nop_dung_han', 'nop_muon')) as hs_thieu_thai_do,
      (select coalesce(jsonb_agg(kq.ho_ten order by kq.ho_ten), '[]'::jsonb) from kq
        where p.co_cau_cham and kq.buoi_hoc_id = p.id and kq.trang_thai_nop in ('nop_dung_han', 'nop_muon')
          and not exists (select 1 from diem d where d.buoi_hoc_id = p.id and d.hoc_sinh_id = kq.hoc_sinh_id)) as hs_nop_ma_khong_co_diem
    from p
  ),
  r as (
    select r0.*,
      case when r0.id is null then 'khong_co_buoi_truoc'
           when not r0.co_giao and r0.hs_co_du_lieu = 0 then 'khong_gan_btvn'
           when r0.hs_co_du_lieu = 0 and r0.dong_at is not null then 'dong_ma_trong'
           when r0.hs_co_du_lieu = 0 then 'trong'
           when r0.dong_at is null then 'co_du_lieu_chua_dong'
           else 'da_dong' end as tinh_trang,
      case when r0.dong_at is not null and r0.han is not null and r0.dong_at > r0.han then 'dong_muon'
           when r0.dong_at is not null then 'dung_han'
           when r0.han is not null and r0.han < now() then 'qua_han'
           else 'con_han' end as han_tt,
      (r0.dong_at is not null and r0.hs_co_du_lieu > 0 and (
          jsonb_array_length(r0.hs_bo_trong) > 0 or jsonb_array_length(r0.hs_thieu_trang_thai_nop) > 0
       or jsonb_array_length(r0.hs_thieu_thai_do) > 0 or jsonb_array_length(r0.hs_nop_ma_khong_co_diem) > 0)) as khong_hop_le
    from r0
  ),
  -- Điểm % BTVN của buổi giao (chỉ buổi ĐÃ ĐÓNG BTVN mới có — fn_matrix_lop)
  mx as (
    select r.id as buoi_id, r.ten_lop, m.hoc_sinh_id, m.pct, m.status
    from r cross join lateral public.fn_matrix_lop(r.lop_id, 'btvn', to_char(r.ngay, 'YYYY-MM')) m
    where r.id is not null and m.buoi_hoc_id = r.id
  ),
  tb as (select buoi_id, avg(pct) as tb, count(*) as n from mx where status = 'done' group by buoi_id),
  diem_thap as (
    select mx.buoi_id, mx.hoc_sinh_id, mx.pct, round(tb.tb)::int as tb_lop
    from mx join tb on tb.buoi_id = mx.buoi_id
    where mx.status = 'done' and tb.n >= (g->>'si_so_toi_thieu')::int
      and mx.pct < (g->>'ti_le_bao_dong')::numeric * tb.tb
  )
  select jsonb_build_object(
    'tom_tat', (select jsonb_build_object(
        'so_lop', count(*),
        'co_giao_btvn', count(*) filter (where co_giao or hs_co_du_lieu > 0),
        'co_du_lieu', count(*) filter (where hs_co_du_lieu > 0),
        'lop_khong_gan_btvn', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where tinh_trang = 'khong_gan_btvn'), '[]'::jsonb),
        'lop_khong_co_buoi_truoc', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where tinh_trang = 'khong_co_buoi_truoc'), '[]'::jsonb),
        'lop_trong', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where tinh_trang = 'trong'), '[]'::jsonb),
        'lop_dong_ma_trong', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where tinh_trang = 'dong_ma_trong'), '[]'::jsonb),
        'lop_co_du_lieu_chua_dong', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where tinh_trang = 'co_du_lieu_chua_dong'), '[]'::jsonb),
        'lop_dong_muon', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where han_tt = 'dong_muon'), '[]'::jsonb),
        'lop_qua_han_chua_dong', coalesce(jsonb_agg(ten_lop order by ten_lop)
             filter (where han_tt = 'qua_han' and tinh_trang in ('trong', 'co_du_lieu_chua_dong')), '[]'::jsonb),
        'lop_chi_tiet_khong_hop_le', coalesce(jsonb_agg(ten_lop order by ten_lop) filter (where khong_hop_le), '[]'::jsonb)) from r),
    'lop', (select coalesce(jsonb_agg(jsonb_build_object(
        'ten_lop', ten_lop, 'mon', mon, 'buoi_giao', ngay, 'co_giao', co_giao,
        'so_co_mat', so_co_mat, 'hs_co_du_lieu', hs_co_du_lieu,
        'da_dong', dong_at is not null,
        'dong_luc', to_char(dong_at at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
        'han', to_char(han at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
        'tinh_trang', tinh_trang, 'han_tt', han_tt, 'khong_hop_le', khong_hop_le,
        'hs_bo_trong', hs_bo_trong, 'hs_thieu_trang_thai_nop', hs_thieu_trang_thai_nop,
        'hs_thieu_thai_do', hs_thieu_thai_do, 'hs_nop_ma_khong_co_diem', hs_nop_ma_khong_co_diem) order by ten_lop), '[]'::jsonb) from r),
    'khong_lam', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select kq.ho_ten, r.ten_lop, r.ngay as buoi_giao, kq.thai_do,
          (select count(*) from btvn_ket_qua k2 join buoi_hoc b2 on b2.id = k2.buoi_hoc_id join lop l2 on l2.id = b2.lop_id
            where k2.hoc_sinh_id = kq.hoc_sinh_id and l2.mon = r.mon and k2.trang_thai_nop = 'khong_lam'
              and b2.ngay between p_ngay - v_nl and p_ngay)::int as so_lan_khong_lam,
          (select count(*) from btvn_ket_qua k2 join buoi_hoc b2 on b2.id = k2.buoi_hoc_id join lop l2 on l2.id = b2.lop_id
            where k2.hoc_sinh_id = kq.hoc_sinh_id and l2.mon = r.mon
              and b2.ngay between p_ngay - v_nl and p_ngay)::int as so_bai_da_ghi,
          (select count(*) from canh_bao_yeu c where c.hoc_sinh_id = kq.hoc_sinh_id and c.nguon = 'btvn'
              and c.created_at > (p_ngay - v_nl)::timestamp)::int as so_chuong_btvn,
          exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = kq.hoc_sinh_id and y.mon = r.mon and y.trang_thai = 'dang_xu') as dang_bo_tro_yeu
        from kq join r on r.id = kq.buoi_hoc_id
        where kq.trang_thai_nop = 'khong_lam'
        order by 5 desc, r.ten_lop, kq.ho_ten limit 80) x),
    'tac_dong', jsonb_build_object('chua_co_nguon', true, 'ly_do',
        'Hệ chưa có chỗ nào ghi "đã tác động gì" với em không làm BTVN (chưa có bảng nhắc phụ huynh / gặp riêng; mức thái độ chưa từng được chốt cho em nào). Báo cáo chỉ đưa được tín hiệu gián tiếp: số lần không làm, số lần bị bấm chuông, có đang bổ trợ yếu không.'),
    'co_van_de', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select kq.ho_ten, r.ten_lop, kq.trang_thai_nop, kq.thai_do, dt.pct as diem_pct, dt.tb_lop as tb_lop_pct,
               array_remove(array[
                 case when kq.thai_do in ('chua_nghiem_tuc', 'chong_doi') then 'thai_do' end,
                 case when dt.hoc_sinh_id is not null then 'diem_thap' end], null) as vi
        from kq join r on r.id = kq.buoi_hoc_id
        left join diem_thap dt on dt.buoi_id = kq.buoi_hoc_id and dt.hoc_sinh_id = kq.hoc_sinh_id
        where kq.trang_thai_nop is distinct from 'khong_lam'   -- em không làm đã nằm ở checklist trên
          and (kq.thai_do in ('chua_nghiem_tuc', 'chong_doi') or dt.hoc_sinh_id is not null)
        order by r.ten_lop, kq.ho_ten limit 80) x),
    'nguong', format('điểm BTVN < %s%% × trung bình lớp của buổi đó; thái độ "chưa nghiêm túc" hoặc "chống đối"',
                     round((g->>'ti_le_bao_dong')::numeric * 100))
  ) into v;
  return v;
end $$;

-- ── HỌC SINH BỊ BÁO ĐỘNG QUA ĐÁNH GIÁ SAU BUỔI (A3) ─────────────────────────
create or replace function public._troly_bc_danh_gia_bao_dong(p_ngay date) returns jsonb
language plpgsql stable as $$
declare v jsonb; g jsonb := public._troly_bc_gia_dinh();
begin
  perform public._troly_gac();
  with b as (
    select bh.id, l.ten_lop from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay = p_ngay
  ),
  t as (
    select b.ten_lop, d.hoc_sinh_id, d.muc_ma, left(d.nhan_xet, 300) as nhan_xet, false as chuong
    from buoi_danh_gia d join b on b.id = d.buoi_hoc_id
    where d.muc is not null and d.muc <= (g->>'muc_bao_dong')::int
    union all
    select b.ten_lop, c.hoc_sinh_id, null, left(c.ghi_chu, 300), true
    from canh_bao_yeu c join b on b.id = c.buoi_hoc_id where c.nguon = 'danhgia'
  )
  select jsonb_build_object(
    'hoc_sinh', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select hs.ho_ten, t.ten_lop, max(t.muc_ma) as muc, bool_or(t.chuong) as gv_bam_chuong,
               (array_agg(t.nhan_xet order by t.chuong) filter (where t.nhan_xet is not null))[1] as nhan_xet
        from t join hoc_sinh hs on hs.id = t.hoc_sinh_id
        group by hs.id, hs.ho_ten, t.ten_lop order by t.ten_lop, hs.ho_ten limit 80) x),
    'nguong', format('GV bấm chuông ở màn đánh giá, hoặc chấm mức ≤ %s', g->>'muc_bao_dong')
  ) into v;
  return v;
end $$;

-- ── BỔ TRỢ BÙ ───────────────────────────────────────────────────────────────
create or replace function public._troly_bc_bu(p_ngay date) returns jsonb
language plpgsql stable as $$
declare v jsonb;
begin
  perform public._troly_gac();
  with vang as (  -- lượt vắng buổi thường 14 ngày tính tới ngày báo cáo, kèm đã xử tới đâu
    select b.ngay, l.ten_lop, hs.ho_ten, h.diem_danh,
      case when kb.id is not null then 'khong_bu'
           when exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                         where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id
                           and bb.trang_thai = 'hoan_tat' and x.diem_danh = 'co_mat') then 'da_hoc_bu'
           when exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                         where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id and bb.trang_thai = 'mo') then 'da_xep_chua_hoc'
           when exists (select 1 from buoi_hoc_hs x where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id) then 'da_xep_nhung_truot'
           else 'chua_xep' end as tinh_trang
    from buoi_hoc_hs h
    join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
    join lop l on l.id = b.lop_id
    join hoc_sinh hs on hs.id = h.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
    left join bang_khong_bu kb on kb.buoi_hoc_hs_id = h.id
    where h.diem_danh in ('vang', 'vang_phep') and b.ngay between p_ngay - 14 and p_ngay
  ),
  bu as (  -- buổi bù DIỄN RA đúng ngày báo cáo
    select b.id, b.trang_thai, b.gio_bat_dau, hs.ho_ten, h.diem_danh, g.ngay as bu_cho_ngay, lg.ten_lop as bu_cho_lop,
           b.et_dong_at, b.danh_gia_xong_at
    from buoi_hoc b join buoi_hoc_hs h on h.buoi_hoc_id = b.id
    join hoc_sinh hs on hs.id = h.hoc_sinh_id
    left join buoi_hoc g on g.id = h.bu_cho_buoi_id left join lop lg on lg.id = g.lop_id
    where b.loai = 'bu' and b.ngay = p_ngay
  )
  select jsonb_build_object(
    'vang_trong_ngay', (select jsonb_build_object(
        'so_luot', count(*),
        'theo_tinh_trang', coalesce((select jsonb_object_agg(g.tinh_trang, g.n) from (
             select tinh_trang, count(*)::int as n from vang where ngay = p_ngay group by 1) g), '{}'::jsonb),
        'hoc_sinh', coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'ten_lop', ten_lop,
             'loai', diem_danh, 'tinh_trang', tinh_trang) order by ten_lop, ho_ten), '[]'::jsonb))
      from vang where ngay = p_ngay),
    'ton_14_ngay', (select jsonb_build_object(
        'so_luot_vang', count(*),
        'chua_xep', count(*) filter (where tinh_trang = 'chua_xep'),
        'chua_xep_qua_48h', count(*) filter (where tinh_trang = 'chua_xep' and ngay < p_ngay - 1),
        'da_xep_nhung_truot', count(*) filter (where tinh_trang = 'da_xep_nhung_truot'),
        'da_xep_chua_hoc', count(*) filter (where tinh_trang = 'da_xep_chua_hoc'),
        'da_hoc_bu', count(*) filter (where tinh_trang = 'da_hoc_bu'),
        'khong_bu', count(*) filter (where tinh_trang = 'khong_bu'),
        'can_xu_ly', coalesce((select jsonb_agg(to_jsonb(x)) from (
             select ho_ten, ten_lop, ngay as ngay_vang, tinh_trang, p_ngay - ngay as so_ngay
             from vang where tinh_trang in ('chua_xep', 'da_xep_nhung_truot')
             order by ngay, ten_lop, ho_ten limit 60) x), '[]'::jsonb))
      from vang),
    'buoi_bu_trong_ngay', (select jsonb_build_object(
        'so_luot', count(*),
        'co_mat', count(*) filter (where trang_thai <> 'huy' and diem_danh = 'co_mat'),
        'vang', count(*) filter (where trang_thai <> 'huy' and diem_danh in ('vang', 'vang_phep')),
        'chua_diem_danh', count(*) filter (where trang_thai <> 'huy' and diem_danh is null),
        'bi_huy', count(*) filter (where trang_thai = 'huy'),
        'co_mat_chua_dong_ho_so', count(*) filter (where trang_thai <> 'huy' and diem_danh = 'co_mat'
                                                   and (et_dong_at is null or danh_gia_xong_at is null)),
        'hoc_sinh', coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'gio', to_char(gio_bat_dau, 'HH24:MI'),
             'bu_cho', bu_cho_lop || ' ngày ' || to_char(bu_cho_ngay, 'DD/MM'),
             'diem_danh', diem_danh, 'bi_huy', trang_thai = 'huy') order by gio_bat_dau, ho_ten), '[]'::jsonb))
      from bu),
    'ghi_chu', 'Mẫu báo cáo để trống mục Bổ trợ bù nên phần này là ĐỀ XUẤT: lượt vắng trong ngày đã xếp bù tới đâu · tồn 14 ngày · buổi bù diễn ra trong ngày.'
  ) into v;
  return v;
end $$;

-- ── BỔ TRỢ YẾU: các ca (lượt HS) của MỘT ngày, đã phân loại kết quả ──────────
create or replace function public._troly_bc_ca_yeu(p_tu date, p_den date)
returns table(ngay date, gio time, mon text, nguoi_day text, ho_ten text, ten_lop text, ket_qua text, ly_do_huy text, khoa_ca text)
language sql stable as $$
  select b.ngay, b.gio_bat_dau, y.mon, ns.ho_ten, hs.ho_ten,
    (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
      where hl.hoc_sinh_id = hs.id and l.mon = y.mon and hl.trang_thai = 'dang_hoc' limit 1),
    case
      when b.trang_thai = 'huy' and (b.ly_do_huy ilike '%vắng%' or b.ly_do_huy ilike 'Không diễn ra%') then 'huy_hs_khong_den'
      when b.trang_thai = 'huy' then 'huy_khac'
      when b.danh_gia_xong_at is not null and exists (
             select 1 from bai_test t join bai_lam bl on bl.bai_test_id = t.id
              where t.buoi_hoc_id = b.id and t.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop') then 'hop_le'
      when b.danh_gia_xong_at is not null then 'khong_hop_le_khong_test'
      when hh.diem_danh = 'co_mat' then 'co_mat_chua_dong_ca'
      when hh.diem_danh in ('vang', 'vang_phep') then 'vang_chua_huy'
      when b.ngay < public._troly_hom_nay() then 'qua_ngay_khong_dien_ra'
      else 'cho_hoc' end,
    b.ly_do_huy,
    b.ngay::text || '|' || coalesce(b.gio_bat_dau::text, '') || '|' || y.mon || '|' || coalesce(b.nguoi_day_tg::text, '')
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  join hoc_sinh hs on hs.id = hh.hoc_sinh_id
  left join nhan_su ns on ns.id = b.nguoi_day_tg
  where b.loai = 'bo_tro_yeu' and b.ngay between p_tu and p_den
    and public.troly_duoc_dung()   -- hàm sql không raise được: ngoài nhóm thì ra 0 dòng
$$;

create or replace function public._troly_bc_ca_yeu_gom(p_tu date, p_den date) returns jsonb
language sql stable as $$
  with t as (select * from public._troly_bc_ca_yeu(p_tu, p_den))
  select jsonb_build_object(
    'tu', p_tu, 'den', p_den,
    'so_luot_da_xep', count(*),
    'so_ca', count(distinct khoa_ca) filter (where ket_qua not in ('huy_hs_khong_den', 'huy_khac')),
    'da_chay', count(*) filter (where ket_qua in ('hop_le', 'khong_hop_le_khong_test', 'co_mat_chua_dong_ca')),
    'hop_le', count(*) filter (where ket_qua = 'hop_le'),
    'khong_hop_le_khong_test', count(*) filter (where ket_qua = 'khong_hop_le_khong_test'),
    'co_mat_chua_dong_ca', count(*) filter (where ket_qua = 'co_mat_chua_dong_ca'),
    'huy_hs_khong_den', count(*) filter (where ket_qua = 'huy_hs_khong_den'),
    'huy_khac', count(*) filter (where ket_qua = 'huy_khac'),
    'vang_chua_huy', count(*) filter (where ket_qua = 'vang_chua_huy'),
    'qua_ngay_khong_dien_ra', count(*) filter (where ket_qua = 'qua_ngay_khong_dien_ra'),
    'cho_hoc', count(*) filter (where ket_qua = 'cho_hoc'),
    'luot', coalesce((select jsonb_agg(to_jsonb(x)) from (
        select ngay, to_char(gio, 'HH24:MI') as gio, mon, nguoi_day, ho_ten, ten_lop, ket_qua, left(ly_do_huy, 120) as ly_do_huy
        from t order by ngay, gio, nguoi_day, ho_ten limit 80) x), '[]'::jsonb))
  from t
$$;

create or replace function public._troly_bc_bo_tro_yeu(p_ngay date) returns jsonb
language plpgsql stable as $$
declare v jsonb;
begin
  perform public._troly_gac();
  select jsonb_build_object(
    'ca_trong_ngay', public._troly_bc_ca_yeu_gom(p_ngay, p_ngay),
    'ca_ngay_truoc', public._troly_bc_ca_yeu_gom(p_ngay - 1, p_ngay - 1),
    'retest_trong_ngay', (select jsonb_build_object(
        'so_bai', count(*),
        'da_nop', count(*) filter (where exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop')),
        'hoc_sinh', coalesce(jsonb_agg(jsonb_build_object('ho_ten', hs.ho_ten, 'ten_lop', l.ten_lop,
            'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'))
            order by l.ten_lop, hs.ho_ten), '[]'::jsonb))
      from bai_test bt join hoc_sinh hs on hs.id = bt.hoc_sinh_id left join lop l on l.id = bt.lop_id
      where bt.loai = 'retest' and bt.ngay = p_ngay),
    'retest_qua_han', (select jsonb_build_object(
        'so_bai', count(*),
        'hoc_sinh', coalesce(jsonb_agg(jsonb_build_object('ho_ten', hs.ho_ten, 'ten_lop', l.ten_lop,
            'ngay_hen', bt.ngay, 'tre_ngay', p_ngay - bt.ngay) order by bt.ngay, hs.ho_ten), '[]'::jsonb))
      from bai_test bt join hoc_sinh hs on hs.id = bt.hoc_sinh_id left join lop l on l.id = bt.lop_id
      where bt.loai = 'retest' and bt.trang_thai = 'mo' and bt.ngay < p_ngay and bt.ngay >= p_ngay - 30
        and not exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop')),
    -- "Duyệt danh sách HS cần bổ trợ 3 ngày gần nhất": DB chỉ có lượt ĐÃ duyệt.
    'duyet_3_ngay', (select jsonb_build_object(
        'tu', p_ngay - 2, 'den', p_ngay,
        'so_luot_duyet', count(*),
        'may_de_xuat_bo_tro', count(*) filter (where lg.level_may_de_xuat >= 1),
        'chot_bo_tro', count(*) filter (where lg.level_chot >= 1),
        'chot_khong_bo_tro', count(*) filter (where lg.level_chot = 0),
        'theo_ngay', coalesce((select jsonb_agg(to_jsonb(x) order by x.ngay) from (
            select (l2.created_at at time zone 'Asia/Ho_Chi_Minh')::date as ngay, count(*)::int as so_luot,
                   count(*) filter (where l2.level_chot >= 1)::int as chot_bo_tro
            from hs_level_log l2 where l2.loai = 'kien_thuc'
              and (l2.created_at at time zone 'Asia/Ho_Chi_Minh')::date between p_ngay - 2 and p_ngay group by 1) x), '[]'::jsonb))
      from hs_level_log lg where lg.loai = 'kien_thuc'
        and (lg.created_at at time zone 'Asia/Ho_Chi_Minh')::date between p_ngay - 2 and p_ngay),
    'hang_doi_cho_duyet', jsonb_build_object('chua_co_nguon', true, 'ly_do',
        'Danh sách em ĐANG CHỜ duyệt do engine phát hiện ở phía màn hình tính (4 kênh, danhgia.ts) — chưa có ở Postgres nên báo cáo chưa đếm được. Xem ở Bổ trợ › Yếu › Duyệt.'),
    -- Trạng thái mọi case đang mở: gọi hàm của màn "Trạng thái ca", không tự phân loại lại.
    'trang_thai_case', (select coalesce(jsonb_object_agg(g.buoc, g.n), '{}'::jsonb) from (
        select x->>'buoc' as buoc, count(*)::int as n
        from jsonb_array_elements(public.fn_btyeu_trang_thai_ca(1)) x
        where x->>'buoc' <> 'hoan_thanh' group by 1) g)
  ) into v;
  return v;
end $$;

-- ── BÁO CÁO BỔ TRỢ TUẦN (tuần T2→CN liền trước tuần chứa ngày báo cáo) ───────
create or replace function public._troly_bc_bo_tro_tuan(p_ngay date) returns jsonb
language plpgsql stable as $$
declare v jsonb; v_tu date := public._troly_dau_tuan(p_ngay) - 7; v_den date := public._troly_dau_tuan(p_ngay) - 1;
begin
  perform public._troly_gac();
  with lg as (
    select (l.created_at at time zone 'Asia/Ho_Chi_Minh')::date as ngay, l.level_may_de_xuat, l.level_chot
    from hs_level_log l where l.loai = 'kien_thuc'
      and (l.created_at at time zone 'Asia/Ho_Chi_Minh')::date between v_tu and v_den
  ),
  cs as (  -- case MỞ trong tuần + lần xếp buổi đầu tiên
    select y.id, y.created_at, f.xep_at, f.ngay_hoc
    from bo_tro_yeu y left join lateral (
      select min(hh.created_at) as xep_at, min(b.ngay) as ngay_hoc
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu') f on true
    where (y.created_at at time zone 'Asia/Ho_Chi_Minh')::date between v_tu and v_den
  )
  select jsonb_build_object(
    'tu', v_tu, 'den', v_den,
    'duyet', (select jsonb_build_object(
        'so_luot_duyet', count(*),
        'may_de_xuat_bo_tro', count(*) filter (where level_may_de_xuat >= 1),
        'chot_bo_tro', count(*) filter (where level_chot >= 1),
        'chot_khong_bo_tro', count(*) filter (where level_chot = 0),
        'dot', coalesce((select jsonb_agg(to_jsonb(x) order by x.ngay) from (
            select ngay, public._troly_thu(ngay) as thu, count(*)::int as so_luot,
                   count(*) filter (where level_may_de_xuat >= 1)::int as may_de_xuat_bo_tro,
                   count(*) filter (where level_chot >= 1)::int as chot_bo_tro
            from lg group by ngay) x), '[]'::jsonb)) from lg),
    'case_mo_trong_tuan', (select jsonb_build_object(
        'so_case', count(*),
        'da_xep_buoi', count(xep_at),
        'chua_xep_buoi', count(*) filter (where xep_at is null),
        'do_tre_xep_tb_ngay', round(avg(extract(epoch from (xep_at - created_at)) / 86400.0)::numeric, 1),
        'tu_mo_toi_ngay_hoc_tb_ngay', round(avg(ngay_hoc - (created_at at time zone 'Asia/Ho_Chi_Minh')::date)::numeric, 1)) from cs),
    'ca_trong_tuan', public._troly_bc_ca_yeu_gom(v_tu, v_den) - 'luot'
  ) into v;
  return v;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- CỬA CHÍNH
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.fn_troly_bao_cao_ngay(p_ngay date default null) returns jsonb
language plpgsql stable as $$
declare v_d date := coalesce(p_ngay, public._troly_hom_nay() - 1); v_nay date := public._troly_hom_nay();
begin
  perform public._troly_gac();
  if v_d > v_nay then raise exception 'Ngày báo cáo không được ở tương lai.'; end if;
  return jsonb_build_object(
    'ngay', v_d, 'thu', public._troly_thu(v_d),
    'da_dien_ra', v_d < v_nay,
    'tao_luc', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI'),
    'buoi', (select jsonb_build_object(
        'so_lop_co_buoi', count(*),
        'lop', coalesce(jsonb_agg(l.ten_lop order by l.ten_lop), '[]'::jsonb))
      from buoi_hoc bh join lop l on l.id = bh.lop_id
      where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay = v_d),
    'lop_co_lich_khong_co_buoi', (select coalesce(jsonb_agg(jsonb_build_object('ten_lop', l.ten_lop,
        'gio', to_char(t.gio_bat_dau, 'HH24:MI'),
        'bi_huy', exists (select 1 from buoi_hoc bh where bh.lop_id = t.lop_id and bh.ngay = v_d and bh.loai = 'thuong' and bh.trang_thai = 'huy'))
        order by l.ten_lop), '[]'::jsonb)
      from thoi_khoa_bieu t join lop l on l.id = t.lop_id and l.trang_thai = 'dang_hoc'
      where t.thu = extract(isodow from v_d)::int + 1
        and t.hieu_luc_tu <= v_d and (t.hieu_luc_den is null or t.hieu_luc_den >= v_d)
        and not exists (select 1 from buoi_hoc bh where bh.lop_id = t.lop_id and bh.ngay = v_d
                          and bh.loai = 'thuong' and bh.trang_thai <> 'huy')),
    'btvn', public._troly_bc_btvn(v_d),
    'et', public._troly_bc_khau(v_d, 'et') || jsonb_build_object('bao_dong', public._troly_bc_et_bao_dong(v_d)),
    'trong_buoi', public._troly_bc_khau(v_d, 'ingame') || jsonb_build_object('hs_lam_cham',
        jsonb_build_object('chua_co_nguon', true, 'ly_do',
          'Hệ có cột tốc độ làm bài nhưng chưa ai từng nhập: 100% dòng chấm đang để mặc định "bình thường". Muốn có checklist này thì người chấm phải chọn nhanh/chậm lúc chấm bài trên lớp.')),
    'sau_buoi', public._troly_bc_khau(v_d, 'danhgia') || jsonb_build_object('bao_dong', public._troly_bc_danh_gia_bao_dong(v_d)),
    'bo_tro_bu', public._troly_bc_bu(v_d),
    'bo_tro_yeu', public._troly_bc_bo_tro_yeu(v_d),
    'bo_tro_tuan', public._troly_bc_bo_tro_tuan(v_d),
    'gia_dinh', jsonb_build_array(
      'BTVN trong báo cáo = bài giao ở buổi TRƯỚC của lớp, đến hạn nhập vào ngày báo cáo. ET và hai loại đánh giá = của buổi ngày báo cáo.',
      'Hạn task: ET / chấm bài trên lớp / đánh giá = giờ vào ca + 36 giờ; BTVN = giờ vào ca kế − 2 giờ. Báo cáo xem sớm thì nhiều task còn trong hạn.',
      '"Đánh giá trong buổi học" đang hiểu là khâu Chấm bài trên lớp.',
      '"Báo động" ET/BTVN = điểm dưới 80% trung bình lớp của buổi đó; qua đánh giá = GV bấm chuông hoặc chấm mức ≤ 2.',
      'Ca bổ trợ yếu "hợp lệ" = đã hoàn tất VÀ em đã nộp bài test cuối ca. Đếm theo LƯỢT học sinh; "số ca" = số nhóm cùng giờ + cùng người đứng ca.')
  );
end $$;

do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and (p.proname like '\_troly\_bc\_%' or p.proname in ('_troly_thu', 'fn_troly_bao_cao_ngay'))
  loop
    execute format('revoke all on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated', r.sig);
  end loop;
end $$;

comment on function public.fn_troly_bao_cao_ngay(date) is
  'Báo cáo ngày của trợ lý theo mẫu CEO 29/09 (BTVN · ET · đánh giá trong/sau buổi · bổ trợ bù · bổ trợ yếu · bổ trợ tuần). Tất định, không qua model. Chỉ nhóm troly_duoc_dung().';
