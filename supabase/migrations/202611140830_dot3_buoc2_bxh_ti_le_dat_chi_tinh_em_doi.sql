-- Đợt 3 bước 2 (spec-kien-truc.md §4) — bảng xếp hạng "Tỉ lệ đạt" (A3): CHỈ TÍNH LẠI EM VỪA CÓ ĐIỂM MỚI. Thùy gật 14/11.
-- Đo 14/11: A3 Toán 21,5 s / lượt (tính lại cả 307 em trên toàn bộ lịch sử, mỗi 10 phút) trong khi 10 phút chỉ ~3 em đổi.
-- A3 không có cửa sổ thời gian ⇒ giá trị của một em chỉ đổi khi bài làm của em đổi. Dấu hiệu "em đổi" = mốc của cache mastery
-- (mastery_luu_san_tinh.tinh_at): mọi thêm/sửa/xoá bai_lam_cau · bai_lam · bai_test_cau đều đánh dấu em bẩn cho mastery,
-- và mastery chạy TRƯỚC bxh trong cùng lượt điều phối. 02:00 mỗi đêm mastery đánh dấu mọi em ⇒ A3 tự tính lại toàn bộ (lưới an toàn).
-- Em cần tính = (chưa từng tính khoá này) | (mốc mastery ≥ lần tính trước − 2 phút) | (em chưa có dòng: em mới vào lớp / chưa có mốc).
-- Ghi đè từng em (upsert), bỏ dòng của em rời danh sách hoặc hết dữ liệu. 20 khoá khác GIỮ NGUYÊN cách cũ. Chữ ký hàm không đổi.

create or replace function public._bxh_lam_moi(p_ngan_sach_giay integer default 40, p_cu_phut integer default 10)
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare k record; v_bd timestamptz := clock_timestamp(); v_t timestamptz; v_n integer := 0; v_hs uuid[]; v_can uuid[]; v_tu date; v_den date;
begin
  if not public._la_tac_vu_nen() then raise exception 'Chỉ tác vụ nền được làm mới bảng xếp hạng.'; end if;
  for k in
    with lo as (
      select l.ma, l.gan_mon, unnest(l.ky_cho_phep) as ky from bxh_loai l
      where l.active and l.san_sang and l.ma in ('A1', 'A2', 'A3', 'A5')
    ), mon as (
      select distinct lp.mon from hoc_sinh_lop hl join lop lp on lp.id = hl.lop_id where hl.trang_thai = 'dang_hoc' and lp.mon is not null
    ), viec as (
      select lo.ma, lo.ky, m.mon as mon_k, lo.gan_mon from lo join mon m on lo.gan_mon
      union all
      select lo.ma, lo.ky, '*', lo.gan_mon from lo where not lo.gan_mon
    )
    select v.*, t.tinh_at from viec v
    left join bxh_luu_tinh t on t.loai = v.ma and t.mon = v.mon_k and t.ky = v.ky
    order by t.tinh_at asc nulls first
  loop
    exit when clock_timestamp() - v_bd > make_interval(secs => p_ngan_sach_giay);
    select b.tu, b.den into v_tu, v_den from public._bxh_ky(k.ky) b;
    continue when k.tinh_at is not null and k.tinh_at > now() - make_interval(mins => p_cu_phut)
                  and exists (select 1 from bxh_luu_tinh t where t.loai = k.ma and t.mon = k.mon_k and t.ky = k.ky and t.tu = v_tu and t.den = v_den);
    select array_agg(h.id) into v_hs from hoc_sinh h
    where h.trang_thai in ('dang_hoc', 'test')
      and (not k.gan_mon or exists (select 1 from hoc_sinh_lop hl join lop lp on lp.id = hl.lop_id
                                    where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' and lp.mon = k.mon_k));
    v_hs := coalesce(v_hs, '{}');
    v_t := clock_timestamp();
    if k.ma = 'A3' then
      -- [14/11] chỉ em vừa đổi (xem đầu file)
      select coalesce(array_agg(u), '{}') into v_can
        from unnest(v_hs) u
       where k.tinh_at is null
          or exists (select 1 from mastery_luu_san_tinh m where m.hoc_sinh_id = u and m.tinh_at >= k.tinh_at - interval '2 minutes')
          or not exists (select 1 from bxh_luu x where x.loai = k.ma and x.mon = k.mon_k and x.ky = k.ky and x.hs = u);
      with g as materialized (
        select r.hs, r.gia_tri, r.phu, r.dat_luc
          from unnest(v_can) u cross join lateral public._bxh_gia_tri(k.ma, k.mon_k, k.ky, array[u]) r
      ), ghi as (
        insert into bxh_luu (loai, mon, ky, hs, gia_tri, phu, dat_luc)
        select k.ma, k.mon_k, k.ky, g.hs, g.gia_tri, g.phu, g.dat_luc from g
        on conflict (loai, mon, ky, hs) do update set gia_tri = excluded.gia_tri, phu = excluded.phu, dat_luc = excluded.dat_luc
      )
      delete from bxh_luu x
       where x.loai = k.ma and x.mon = k.mon_k and x.ky = k.ky
         and (x.hs <> all(v_hs)                                                       -- em rời danh sách
              or (x.hs = any(v_can) and not exists (select 1 from g where g.hs = x.hs)));   -- em tính lại mà hết dữ liệu
    else
      delete from bxh_luu where loai = k.ma and mon = k.mon_k and ky = k.ky;
      insert into bxh_luu (loai, mon, ky, hs, gia_tri, phu, dat_luc)
      select k.ma, k.mon_k, k.ky, g.hs, g.gia_tri, g.phu, g.dat_luc
      -- từng em một (giá trị mỗi em độc lập): gọi 1 lần cho cả ~300 em ra kế hoạch tồi (A2 mùa 76 s đo 11/11), từng em ~ vài ms
      from unnest(v_hs) u cross join lateral public._bxh_gia_tri(k.ma, k.mon_k, k.ky, array[u]) g;
    end if;
    insert into bxh_luu_tinh (loai, mon, ky, tu, den, tinh_at, giay)
    values (k.ma, k.mon_k, k.ky, v_tu, v_den, v_t, round(extract(epoch from clock_timestamp() - v_t)::numeric, 2))
    on conflict (loai, mon, ky) do update set tu = excluded.tu, den = excluded.den, tinh_at = excluded.tinh_at, giay = excluded.giay;
    v_n := v_n + 1;
  end loop;
  return v_n;
end $function$;
