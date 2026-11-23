-- DANH SÁCH BỔ TRỢ — lịch sử bổ trợ THEO NHÓM của em (Thùy 23/11: "lịch sử bổ trợ của nhóm ấy: nhóm đó đã từng được bổ trợ chưa").
-- Với từng nhóm trong đề xuất: so_ca = số ca bổ trợ (sau giờ + ca khối, chưa huỷ) em CÓ MẶT và được dạy ít nhất một dạng thuộc nhóm đó (mọi thời gian) ·
-- lan_cuoi = ngày ca gần nhất · duyet_truoc = số đề xuất ĐÃ DUYỆT khác (của em, cùng môn) có nhóm này — để thấy "đã duyệt mà chưa dạy".
-- Dạng → nhóm tra theo khoá chính ở bản đồ của đúng môn: Toán Đại (dai_bdm_dang_bai) · môn một vùng (tl_bdm_dang_bai_v có cột mon) · Hình–Học (bài = nhóm).
-- Chi phí: các case của MỘT em × môn (index bo_tro_yeu_hs_mon_idx) + dạng của case đó; không quét lịch sử đo. Hàm nội bộ, chỉ fn_btk_ds (có cổng) gọi.

create or replace function public._btk_nhom_lich_su(p_hs uuid, p_mon text, p_nhom jsonb, p_bo_qua uuid)
returns jsonb
language sql stable
set search_path to 'public'
as $fn$
  with n as (select e->>'ma' as ma from jsonb_array_elements(coalesce(p_nhom, '[]'::jsonb)) e),
  day as (   -- (nhóm, buổi) em có mặt và được dạy
    select distinct coalesce(
             (select db.nhom_id from dai_bdm_dang_bai db where db.id = d.ma_dang),
             (select v.nhom_id from tl_bdm_dang_bai_v v where v.mon = p_mon and v.id = d.ma_dang),
             (select hb.ma_bai from hinh_hoc_bai hb where hb.ma_bai = d.ma_dang)) as nhom,
           b.id as buoi, b.ngay
      from bo_tro_yeu y
      join bo_tro_yeu_dang d on d.bo_tro_yeu_id = y.id and d.day_buoi_id is not null
      join buoi_hoc b on b.id = d.day_buoi_id and b.trang_thai <> 'huy'
      join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = p_hs and hh.diem_danh = 'co_mat'
     where y.hoc_sinh_id = p_hs and y.mon = p_mon
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma', n.ma,
           'so_ca', (select count(*) from day where day.nhom = n.ma),
           'lan_cuoi', (select max(day.ngay) from day where day.nhom = n.ma),
           'duyet_truoc', (select count(*) from bo_tro_de_xuat x
                            where x.hoc_sinh_id = p_hs and x.mon = p_mon and x.trang_thai = 'da_duyet' and x.id is distinct from p_bo_qua
                              and exists (select 1 from jsonb_array_elements(x.nhom) e where e->>'ma' = n.ma)))), '[]'::jsonb)
    from n;
$fn$;
revoke all on function public._btk_nhom_lich_su(uuid, text, jsonb, uuid) from public, anon, authenticated;

-- fn_btk_ds: thêm khoá nhom_ls (phần còn lại giữ nguyên bản đang chạy)
CREATE OR REPLACE FUNCTION public.fn_btk_ds(p_mon text, p_khoi text DEFAULT NULL::text, p_so_ngay integer DEFAULT 14)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v jsonb;
begin
  if p_khoi is not null and not (public._btk_la_tk(p_mon, p_khoi) or public._btk_la_tbm(p_mon, p_khoi)) then
    raise exception 'Không có quyền với khối % môn %', p_khoi, p_mon using errcode = '42501';
  end if;
  if p_khoi is null and public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ trưởng bộ môn xem mọi khối.' using errcode = '42501'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', dx.id, 'hoc_sinh_id', dx.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'lop', l.ten_lop, 'khoi', dx.khoi,
           'nhom', dx.nhom, 'muc', dx.muc, 'uu_tien', dx.uu_tien, 'ghi_chu', dx.ghi_chu, 'trang_thai', dx.trang_thai,
           'ly_do_tra', dx.ly_do_tra, 'so_dang', dx.so_dang, 'case_id', dx.case_id,
           'case_tt', y.trang_thai, 'case_ket_qua', y.ket_qua,
           'tao_at', dx.tao_at, 'tao_ten', nt.ho_ten, 'gui_at', dx.gui_at, 'gui_ten', ng.ho_ten, 'duyet_at', dx.duyet_at, 'duyet_ten', nd.ho_ten,
           'dang_yeu', dy.so_dang_yeu,
           'bao_dong', public._btk_bao_dong_tuan(dx.hoc_sinh_id, dx.mon, dx.tao_at),   /* 18/11: chuông trong tuần của đề xuất */
           'lich_su', public._btk_lich_su_hs(dx.hoc_sinh_id, dx.mon),
           'nhom_ls', public._btk_nhom_lich_su(dx.hoc_sinh_id, dx.mon, dx.nhom, dx.id))   /* 23/11: từng nhóm đã được bổ trợ chưa */                     /* 18/11: ca bổ trợ 2 tuần gần đây + kết quả */
         order by dx.khoi, case dx.trang_thai when 'tra_lai' then 0 when 'nhap' then 1 when 'cho_duyet' then 2 else 3 end, dx.uu_tien desc, hs.ho_ten), '[]'::jsonb)
    into v
    from bo_tro_de_xuat dx
    join hoc_sinh hs on hs.id = dx.hoc_sinh_id
    left join lop l on l.id = dx.lop_id
    left join bo_tro_yeu y on y.id = dx.case_id
    left join nhan_su nt on nt.id = dx.tao_boi left join nhan_su ng on ng.id = dx.gui_boi left join nhan_su nd on nd.id = dx.duyet_boi
    left join dang_yeu_hien_tai dy on dy.hoc_sinh_id = dx.hoc_sinh_id and dy.mon = dx.mon
   where dx.mon = p_mon and (p_khoi is null or dx.khoi = p_khoi)
     and (p_khoi is not null or public._btk_la_tbm(dx.mon, dx.khoi))
     and (dx.trang_thai in ('nhap', 'cho_duyet', 'tra_lai')
          or (dx.trang_thai = 'da_duyet' and dx.duyet_at >= now() - make_interval(days => greatest(1, least(coalesce(p_so_ngay, 14), 90)))));
  return v;
end $function$;
