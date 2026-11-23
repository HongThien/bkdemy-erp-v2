-- DANH SÁCH BỔ TRỢ — thống kê dạng yếu chỉ tính dạng yếu NẰM TRONG các nhóm đã chọn của đề xuất; dạng yếu lẻ (ngoài các nhóm đó) đếm RIÊNG
-- (Thùy 23/11: "chỉ thống kê các dạng yếu bên trong các nhóm yếu được chọn thôi. Còn các dạng yếu lẻ xử lý riêng").
-- Dạng yếu = mức 'yeu' của mastery theo lần (bảng lưu sẵn mastery_luu_san, cấp dạng) — cùng luật với nhóm yếu và với popup Bổ trợ (fn_btk_goi_y, 13/11);
-- KHÔNG lấy dang_yeu_hien_tai (luật hai cửa sổ) như con số cũ trên màn. Dạng → nhóm tra bản đồ của đúng môn. Tra theo khoá chính của MỘT em; không quét lịch sử đo.
-- Trả: trong = số dạng yếu thuộc các nhóm đã chọn · le = số dạng yếu ngoài các nhóm đó · theo_nhom = { mã nhóm: số dạng yếu }.

create or replace function public._btk_dang_yeu_chon(p_hs uuid, p_mon text, p_nhom jsonb)
returns jsonb
language sql stable
set search_path to 'public'
as $fn$
  with chon as (select e->>'ma' as ma from jsonb_array_elements(coalesce(p_nhom, '[]'::jsonb)) e),
  dy as (   -- dạng đang yếu của em, kèm nhóm của nó trong bản đồ MÔN này (dạng của môn khác ⇒ nhóm null ⇒ bỏ)
    select m.nut,
           case when public._kho_ban_do_tbl(p_mon) = 'dai_ban_do'
                then coalesce((select db.nhom_id from dai_bdm_dang_bai db where db.id = m.nut), (select hb.ma_bai from hinh_hoc_bai hb where hb.ma_bai = m.nut))
                else (select v.nhom_id from tl_bdm_dang_bai_v v where v.mon = p_mon and v.id = m.nut) end as nhom
      from mastery_luu_san m
     where m.hoc_sinh_id = p_hs and m.btvn and m.cap = 'dang' and m.muc = 'yeu'
  )
  select jsonb_build_object(
    'trong', (select count(*) from dy where dy.nhom in (select ma from chon)),
    'le', (select count(*) from dy where dy.nhom is not null and dy.nhom not in (select ma from chon)),
    'theo_nhom', coalesce((select jsonb_object_agg(x.nhom, x.n) from (select dy.nhom, count(*) as n from dy where dy.nhom in (select ma from chon) group by 1) x), '{}'::jsonb));
$fn$;
revoke all on function public._btk_dang_yeu_chon(uuid, text, jsonb) from public, anon, authenticated;

-- fn_btk_ds: thêm khoá dy_chon (phần còn lại giữ nguyên bản đang chạy)
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
           'dy_chon', public._btk_dang_yeu_chon(dx.hoc_sinh_id, dx.mon, dx.nhom),   /* 23/11: dạng yếu TRONG các nhóm đã chọn · dạng yếu lẻ tách riêng */
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
