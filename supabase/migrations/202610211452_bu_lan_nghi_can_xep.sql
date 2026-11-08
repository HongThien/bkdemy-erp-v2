-- Thùy 21/10: "Bổ trợ bù không còn tự động update học sinh nghỉ nữa."
-- Gốc: tab Bù › Cần bù dựng ở TRÌNH DUYỆT (listLanNghiCanXep) từ `buoi_hoc_hs` lọc diem_danh vắng với `.limit(10000)`.
-- PostgREST của Supabase chặn cứng 1000 dòng/lần, `.limit(10000)` KHÔNG vượt được. Tổng lượt vắng vừa qua 1000 (1031) ⇒ server trả 1000 dòng
-- KHÔNG sắp xếp ⇒ các lượt vắng mới nhất (14→20/10, ~28 em) rụng im lặng; màn chỉ còn 3 em nghỉ 04/10, 08/10, 13/10.
-- Sửa theo CLAUDE.md §2.0: phép tính "lần nghỉ nào còn cần xếp bù" chuyển xuống DB, một RPC trả đủ, không phụ thuộc trần dòng.
-- Luật giữ y hệt bản TS cũ: vắng ở buổi THƯỜNG chưa huỷ · loại lần đã có buổi bù còn hiệu lực (buổi bù không huỷ, em không vắng buổi bù; chưa điểm danh vẫn tính
-- còn hiệu lực) · loại lần đã ghi "không bù" · kèm số lần đã xếp + lý do phải xếp lại (buổi bù bị huỷ / em vắng buổi bù, lấy theo lần xếp GẦN NHẤT).
-- security invoker: giữ RLS nhân sự như truy vấn cũ.
create or replace function public.fn_bu_lan_nghi_can_xep()
returns jsonb
language sql
stable
set search_path to 'public'
as $$
  select coalesce(jsonb_agg(x.j order by x.ngay, x.ho_ten), '[]'::jsonb)
  from (
    select b.ngay, hs.ho_ten,
      jsonb_build_object(
        'id', hh.id, 'hoc_sinh_id', hh.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs,
        'buoi_me_id', b.id, 'ngay', to_char(b.ngay, 'YYYY-MM-DD'),
        'lop', l.ten_lop, 'mon', l.mon, 'khoi', l.khoi,
        'soLanDaXep', coalesce(lk.so_lan, 0), 'lyDoQuayLai', lk.ly_do
      ) as j
    from public.buoi_hoc_hs hh
    join public.buoi_hoc b on b.id = hh.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
    join public.hoc_sinh hs on hs.id = hh.hoc_sinh_id
    left join public.lop l on l.id = b.lop_id
    left join lateral (
      select count(*)::int as so_lan,
             bool_or(lb.trang_thai <> 'huy' and coalesce(k.diem_danh, '') not in ('vang', 'vang_phep')) as con_hieu_luc,
             (array_agg(case when lb.trang_thai = 'huy' then 'buoi_bu_huy' else 'vang_buoi_bu' end order by lb.ngay desc, k.created_at desc)
                filter (where lb.trang_thai = 'huy' or k.diem_danh in ('vang', 'vang_phep')))[1] as ly_do
      from public.buoi_hoc_hs k
      join public.buoi_hoc lb on lb.id = k.buoi_hoc_id
      where k.hoc_sinh_id = hh.hoc_sinh_id and k.bu_cho_buoi_id = hh.buoi_hoc_id
    ) lk on true
    where hh.diem_danh in ('vang', 'vang_phep')
      and not coalesce(lk.con_hieu_luc, false)
      and not exists (select 1 from public.bang_khong_bu kb where kb.buoi_hoc_hs_id = hh.id)
  ) x
$$;
revoke all on function public.fn_bu_lan_nghi_can_xep() from public, anon;
grant execute on function public.fn_bu_lan_nghi_can_xep() to authenticated, service_role;
