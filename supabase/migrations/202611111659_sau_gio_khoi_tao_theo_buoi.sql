-- ============================================================================
-- 202611111659 — sau_gio_khoi_tao_theo_buoi
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 11/11, qua phiên "Hoàn thiện phòng làm việc"): form khởi tạo ca bổ trợ sau giờ:
--   "Chọn lớp · hiện tất cả học sinh lớp đó đã được duyệt bổ trợ (không duyệt không cần hiện) ·
--    bổ trợ sau giờ đi theo buổi học nên hệ thống đưa ra list các buổi học kèm ngày để chọn · khởi tạo xong có nút tạo thông báo PH dạng ảnh".
-- Hai hàm ĐỌC mới (form chỉ gọi, không tính ở client — §2.0):
--   fn_btnhe_lop_cho()          — lớp (trong phạm vi tạo ca) có em đã duyệt L1 sau giờ + số em.
--   fn_btnhe_hs_duyet(p_lop)    — em CỦA LỚP đó mà đề xuất bổ trợ MỚI NHẤT (môn lớp) là đã duyệt mức L1; cờ cho = chưa có ca sau giờ nào
--                                 từ lúc duyệt (= hàng chờ, tick sẵn), số ca sau giờ tuần này, số dạng sau giờ.
--   fn_btnhe_buoi_lop(p_lop, p_so_ngay) — các BUỔI HỌC sắp tới của lớp (hôm nay → +N ngày) kèm ngày · giờ · phòng, theo buổi đã có
--                                 hoặc TKB (cùng nguồn _btnhe_gio_lop với form cũ) + TA lớp + số ca sau giờ đã tạo ở buổi đó.
-- Ca vẫn tạo bằng fn_btnhe_tao (kiểu 'sau_buoi', giờ bắt đầu = giờ tan buổi, phòng buổi) — không đổi luật ca.
--
-- MẤT GÌ (Luật xoá): không mất gì — chỉ thêm 3 hàm đọc.
-- ============================================================================

create or replace function public.fn_btnhe_lop_cho()
returns table(lop_id uuid, ten_lop text, mon text, khoi text, so_em integer, so_cho integer)
language sql stable security definer set search_path to 'public' as $$
  with dx as (
    select distinct on (d.hoc_sinh_id, d.mon) d.*
      from bo_tro_de_xuat d order by d.hoc_sinh_id, d.mon, d.tao_at desc
  ),
  em as (
    select l.id as lop_id, l.ten_lop, l.mon, l.khoi, dx.hoc_sinh_id,
           not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = dx.hoc_sinh_id and y.mon = dx.mon and y.nguon = 'nhe' and y.created_at >= dx.duyet_at) as cho
      from dx join hoc_sinh_lop hl on hl.hoc_sinh_id = dx.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
      join lop l on l.id = hl.lop_id and l.mon = dx.mon and l.trang_thai = 'dang_hoc'
     where dx.trang_thai = 'da_duyet' and dx.muc = 1 and public.la_thanh_vien() and public._btnhe_duoc_tao(l.mon, l.khoi)
  )
  select lop_id, ten_lop, mon, khoi, count(*)::int, count(*) filter (where cho)::int
    from em group by lop_id, ten_lop, mon, khoi
   order by mon, khoi, ten_lop
$$;
revoke execute on function public.fn_btnhe_lop_cho() from public, anon;
grant execute on function public.fn_btnhe_lop_cho() to authenticated;

create or replace function public.fn_btnhe_hs_duyet(p_lop uuid)
returns table(hoc_sinh_id uuid, ho_ten text, ma_hs text, cho boolean, duyet_at timestamptz, so_ca_tuan integer, so_dang integer, nhom jsonb, ghi_chu text)
language plpgsql stable security definer set search_path to 'public' as $$
#variable_conflict use_column
declare l record; v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh')::date)::date;
begin
  select * into l from lop where id = p_lop;
  if l.id is null then raise exception 'Không thấy lớp.'; end if;
  if not public.la_thanh_vien() or not public._btnhe_duoc_tao(l.mon, l.khoi) then raise exception 'Lớp ngoài phạm vi khối của bạn.'; end if;
  return query
  with dx as (
    select distinct on (d.hoc_sinh_id) d.*
      from bo_tro_de_xuat d
      join hoc_sinh_lop hl on hl.hoc_sinh_id = d.hoc_sinh_id and hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'
     where d.mon = l.mon
     order by d.hoc_sinh_id, d.tao_at desc
  )
  select h.id, h.ho_ten, h.ma_hs,
         not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = h.id and y.mon = l.mon and y.nguon = 'nhe' and y.created_at >= dx.duyet_at),
         dx.duyet_at,
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7),
         (select count(*)::int from public._sau_gio_dang(h.id, l.mon)),
         dx.nhom, dx.ghi_chu
    from dx join hoc_sinh h on h.id = dx.hoc_sinh_id
   where dx.trang_thai = 'da_duyet' and dx.muc = 1
   order by h.ho_ten;
end $$;
revoke execute on function public.fn_btnhe_hs_duyet(uuid) from public, anon;
grant execute on function public.fn_btnhe_hs_duyet(uuid) to authenticated;

create or replace function public.fn_btnhe_buoi_lop(p_lop uuid, p_so_ngay integer default 14)
returns table(ngay date, gio_bat_dau time, gio_ket_thuc time, phong text, ta_id uuid, ta_ten text, so_ca_sau_gio integer)
language plpgsql stable security definer set search_path to 'public' as $$
declare l record; v_hom date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  select * into l from lop where id = p_lop;
  if l.id is null then raise exception 'Không thấy lớp.'; end if;
  if not public.la_thanh_vien() or not public._btnhe_duoc_tao(l.mon, l.khoi) then raise exception 'Lớp ngoài phạm vi khối của bạn.'; end if;
  return query
  select g.d::date, x.gio_bat_dau, x.gio_ket_thuc, x.phong, public._ta_cua_lop(p_lop),
         (select n.ho_ten from nhan_su n where n.id = public._ta_cua_lop(p_lop)),
         (select count(*)::int from ca_bo_tro_nhe c where c.lop_id = p_lop and c.ngay = g.d::date and c.trang_thai <> 'huy')
    from generate_series(v_hom, v_hom + greatest(1, least(coalesce(p_so_ngay, 14), 60)), interval '1 day') g(d)
    cross join lateral public._btnhe_gio_lop(p_lop, g.d::date) x
   where x.gio_ket_thuc is not null
   order by 1;
end $$;
revoke execute on function public.fn_btnhe_buoi_lop(uuid, integer) from public, anon;
grant execute on function public.fn_btnhe_buoi_lop(uuid, integer) to authenticated;
