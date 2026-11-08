-- Thùy 26/10 ("B"): bước QUÉT của Chốt tuần (Điểm thấp / Đang theo dõi) phải theo BẢN ĐỒ MỚI như mastery + bổ trợ yếu.
-- Đo: engine TS (`getStatSheetLop`) đọc thẳng gami_grades và gom theo mã dạng CHÉP trên dòng đo (toàn mã cũ T…), chuyên đề bản đồ cũ —
-- không qua bước "đo đi theo câu" (_do_o_bdm / _do_nhom_cua_o) mà mastery SQL dùng; ảnh chụp chốt 26/10: 93% chuyên đề khớp bản đồ cũ, 0% khớp bản đồ mới.
-- Phần PHỤ THUỘC bản đồ của engine chỉ là bước nạp dòng đo (dạng của từng dòng) — phần chấm điểm (pha 1/2, MA-3, kênh) không phụ thuộc bản đồ.
-- ⇒ chuyển bước nạp xuống DB, quy dạng theo công tắc: fn_botro_lan_do_lop(hs[], môn, chế độ).
--   Ngữ nghĩa = ĐÚNG `napLanDo` cũ (gami_grades · phase et/mt/btvn · Đ=1 C=0,5 S=0 · môn theo lớp của buổi, buổi bù lùi về buổi gốc theo từng HS ·
--   t = NGÀY BUỔI · bài Hình mô hình theo hinh_baitoan.ma) CHỈ KHÁC ở mã dạng: chế độ
--     'tho' = mã chép (y hệt bản cũ — để đối chiếu từng dòng) · 'cu' = _do_nhom_cua_o · 'moi' = _do_o_bdm (cấp 1 + Hình giữ cũ bên trong) ·
--     NULL = theo công tắc mastery_ban_do_moi.
--   Dòng không quy được dạng (câu xoá chưa quy…) bị bỏ — cùng luật mastery (§1.5 thà bỏ trống còn hơn đánh sai).
-- Trả jsonb mảng [hs, ma_dang, value, t, src, buoi_hoc_id] (1 giá trị — PostgREST cắt 1000 dòng với hàm trả bảng; 1 lớp ~9k dòng).
create or replace function public.fn_botro_lan_do_lop(p_hs uuid[], p_mon text, p_che_do text default null)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare v_che text; v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  v_che := coalesce(nullif(p_che_do, ''), case when public._mastery_bdm_bat() then 'moi' else 'cu' end);
  if v_che not in ('tho', 'cu', 'moi') then raise exception 'Chế độ phải là tho | cu | moi.'; end if;

  with g as (
    select gg.hoc_sinh_id, gg.result, gg.graded_at, gg.buoi_hoc_id, sp.phase, sp.ma_dang, sp.ma_cau, sp.hinh_baitoan_id,
           b.ngay as ngay_buoi, coalesce(l.mon, lg.mon) as mon_buoi
      from gami_grades gg
      join gami_session_problems sp on sp.id = gg.problem_id
      left join buoi_hoc b on b.id = gg.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join buoi_hoc_hs bh on bh.buoi_hoc_id = gg.buoi_hoc_id and bh.hoc_sinh_id = gg.hoc_sinh_id and b.lop_id is null   -- buổi bù: lùi về buổi gốc của TỪNG HS
      left join buoi_hoc bg on bg.id = bh.bu_cho_buoi_id
      left join lop lg on lg.id = bg.lop_id
     where gg.hoc_sinh_id = any (p_hs) and sp.phase in ('et', 'mt', 'btvn') and gg.result in ('correct', 'partial', 'wrong')
  ),
  gm as (select g.*, hb.ma as ma_hinh from g left join hinh_baitoan hb on hb.id = g.hinh_baitoan_id and hb.mon = p_mon where g.mon_buoi = p_mon),
  cap as materialized (   -- quy dạng 1 lần cho mỗi cặp (câu, mã chép) — không chạy lại cho từng dòng đo
    select d.kc, d.kd,
           case when v_che = 'tho' or public._btyeu_la_hinh_mh(d.kd) then d.kd
                when v_che = 'moi' then public._do_o_bdm(nullif(d.kc, ''), nullif(d.kd, ''))
                else public._do_nhom_cua_o(nullif(d.kc, ''), nullif(d.kd, '')) end as nhom
      from (select distinct coalesce(ma_cau, '') kc, ma_dang kd from gm where ma_dang is not null) d
  ),
  kq as (
    select gm.hoc_sinh_id,
           coalesce(c.nhom, case when gm.ma_dang is null then gm.ma_hinh end) as ma_dang,
           case gm.result when 'correct' then 1.0 when 'partial' then 0.5 else 0.0 end as value,
           coalesce(to_char(gm.ngay_buoi, 'YYYY-MM-DD'), to_char(gm.graded_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as t,
           gm.phase as src, gm.buoi_hoc_id
      from gm left join cap c on c.kc = coalesce(gm.ma_cau, '') and c.kd = gm.ma_dang
     where (gm.ma_dang is not null and c.nhom is not null) or (gm.ma_dang is null and gm.ma_hinh is not null)
  )
  select coalesce(jsonb_agg(jsonb_build_array(k.hoc_sinh_id, k.ma_dang, k.value, k.t, k.src, k.buoi_hoc_id) order by k.t, k.hoc_sinh_id, k.ma_dang, k.src), '[]'::jsonb)
    into v_out from kq k;
  return v_out;
end $$;

revoke execute on function public.fn_botro_lan_do_lop(uuid[], text, text) from public, anon;
grant execute on function public.fn_botro_lan_do_lop(uuid[], text, text) to authenticated;
