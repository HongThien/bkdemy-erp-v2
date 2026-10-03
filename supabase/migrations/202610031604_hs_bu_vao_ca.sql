-- Thùy 03/10 (Bùi Duy Khoa, bù 16:00 P101, TA Nguyễn Hà Giang): "TA bấm mở ca và có mặt nhưng app học sinh không vào ca luyện được".
-- Gốc: buổi BÙ chưa từng có "Vào ca" trên app HS (chỉ yếu/đuổi) — em đến bù mà không có gì để học trên máy.
-- Sửa: (1) fn_hs_lich_bo_tro: vao_ca bật cho cả 'bu' (hôm nay · em có mặt · ca chưa hoàn tất) — dựng từ bản ĐANG CHẠY.
--      (2) fn_hs_bu_dang(p_buoi): các DẠNG của buổi em đã nghỉ (lưới bài trên lớp · ET · BTVN của buổi mẹ + lưới đã chép riêng cho em ở ca bù),
--          kèm tên dạng + môn. App HS mở từng dạng bằng đúng các màn "Học từ đầu" đang chạy (Lý thuyết · Luyện · Test, MCQ theo luật kho).
CREATE OR REPLACE FUNCTION public.fn_hs_lich_bo_tro()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'buoi_id', b.id, 'loai', b.loai, 'ngay', b.ngay,
    'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong,
    'mon', case b.loai when 'bo_tro_yeu' then y.mon else l.mon end,
    'nguoi', coalesce(ns.ho_ten, ns2.ho_ten),
    'diem_danh', hh.diem_danh,
    'hom_nay', b.ngay = public._btyeu_today(),
    'vao_ca', coalesce(b.loai in ('bo_tro_yeu', 'bo_tro_duoi', 'bu') and b.ngay = public._btyeu_today()
                       and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null, false)
  ) order by b.ngay, b.gio_bat_dau nulls last), '[]'::jsonb)
  from buoi_hoc_hs hh
  join buoi_hoc b on b.id = hh.buoi_hoc_id
  left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  left join buoi_hoc bg on bg.id = hh.bu_cho_buoi_id
  left join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id
  left join lop l on l.id = coalesce(bg.lop_id, d.lop_id)
  left join nhan_su ns on ns.id = b.nguoi_day_tg
  left join nhan_su ns2 on ns2.id = b.nguoi_day
  where hh.hoc_sinh_id = public.my_hoc_sinh_id()
    and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi')
    and b.trang_thai = 'mo'
    and b.ngay >= public._btyeu_today()
$function$;

create or replace function public.fn_hs_bu_dang(p_buoi uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); r record; v_out jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select b.id as bu, b.ngay, hh.bu_cho_buoi_id as me, bm.ngay as ngay_me, l.mon, l.ten_lop into r
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = v_hs
    left join buoi_hoc bm on bm.id = hh.bu_cho_buoi_id left join lop l on l.id = bm.lop_id
    where b.id = p_buoi and b.loai = 'bu' limit 1;
  if r.bu is null then raise exception 'Không thấy buổi bù của em.'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(r.mon, x.ma_dang), x.ma_dang)) order by x.thu_tu), '[]'::jsonb)
    into v_out
    from (select p.ma_dang, min(case p.phase when 'ingame' then 0 when 'et' then 1000 else 2000 end + p.problem_no) as thu_tu
          from gami_session_problems p
          where p.ma_dang is not null and not p.hidden
            and ((p.buoi_hoc_id = r.me and p.hoc_sinh_id is null and p.phase in ('ingame', 'et', 'btvn'))
              or (p.buoi_hoc_id = r.bu and p.hoc_sinh_id = v_hs))
          group by p.ma_dang) x;
  return jsonb_build_object('mon', r.mon, 'ten_lop', r.ten_lop, 'ngay_me', r.ngay_me, 'ngay_bu', r.ngay, 'dangs', v_out);
end $$;
revoke all on function public.fn_hs_bu_dang(uuid) from public;
revoke execute on function public.fn_hs_bu_dang(uuid) from anon;
grant execute on function public.fn_hs_bu_dang(uuid) to authenticated;
