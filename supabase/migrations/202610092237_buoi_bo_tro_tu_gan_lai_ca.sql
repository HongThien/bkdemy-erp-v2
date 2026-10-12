-- Thùy 09/10 (Lộc xếp Ngô Trí Tuấn Kiệt vào ca trực 10/10 17:00 của TA Hoàng Thị Quỳnh Trang — hệ không đưa vào ca trực mà ra "Lịch riêng"):
-- Gốc: buổi 19ea46c6 ngày 10/10 nhưng gắn ca_bo_tro_id = ca 12/10 17:00 (cùng TA, cùng giờ). Buổi được xếp vào ca 12/10 rồi SỬA NGÀY sang
-- 10/10 (Sửa buổi / form sửa lịch) — sửa ngày/giờ/TA KHÔNG gắn lại ca ⇒ buổi treo ở ca ngày khác: ca 10/10 không thấy em, ngày 10/10 coi là
-- buổi riêng. Đo 09/10: thêm 2 buổi bù cùng bệnh (Bảo Nhi 11/10 gắn ca 18/10 · Bùi Ngọc Diệp 28/09 gắn ca 04/10).
-- Sửa tận gốc ở DB: trigger trước khi ghi buổi bổ trợ — đổi ngày/giờ/TA ⇒ còn khớp ca cũ thì giữ, không thì gắn lại ca trực khớp NGÀY + TA + giờ
-- (cùng luật ghép của fn_ca_bo_tro_sinh_ngay), không có ca khớp thì để trống (= lịch riêng, đúng nghĩa). Vá 2 buổi đang lệch theo đúng luật đó.

create or replace function public._ca_bo_tro_khop(p_ngay date, p_tu time, p_den time, p_ta uuid) returns uuid
language sql stable set search_path = public as $$
  select c.id from ca_bo_tro c
  where c.ngay = p_ngay and c.trang_thai = 'mo' and p_ta in (c.nhan_su_id, c.nhan_su_2_id)
    and c.gio_bat_dau < coalesce(p_den, p_tu + interval '1 hour') and c.gio_ket_thuc > p_tu
  order by abs(extract(epoch from (c.gio_bat_dau - p_tu))), c.gio_bat_dau
  limit 1
$$;

create or replace function public._trg_buoi_bo_tro_gan_ca() returns trigger
language plpgsql set search_path = public as $$
declare v_ca record;
begin
  if new.loai not in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') or new.gio_bat_dau is null or new.nguoi_day_tg is null then return new; end if;
  if new.ngay is not distinct from old.ngay and new.gio_bat_dau is not distinct from old.gio_bat_dau
     and new.gio_ket_thuc is not distinct from old.gio_ket_thuc and new.nguoi_day_tg is not distinct from old.nguoi_day_tg then return new; end if;
  if new.ca_bo_tro_id is not null then
    select * into v_ca from ca_bo_tro where id = new.ca_bo_tro_id;
    if v_ca.ngay = new.ngay and v_ca.trang_thai = 'mo' and new.nguoi_day_tg in (v_ca.nhan_su_id, v_ca.nhan_su_2_id)
       and v_ca.gio_bat_dau < coalesce(new.gio_ket_thuc, new.gio_bat_dau + interval '1 hour') and v_ca.gio_ket_thuc > new.gio_bat_dau then
      return new; -- vẫn khớp ca cũ
    end if;
  end if;
  new.ca_bo_tro_id := public._ca_bo_tro_khop(new.ngay, new.gio_bat_dau, new.gio_ket_thuc, new.nguoi_day_tg);
  return new;
end $$;

drop trigger if exists trg_buoi_bo_tro_gan_ca on public.buoi_hoc;
create trigger trg_buoi_bo_tro_gan_ca before update of ngay, gio_bat_dau, gio_ket_thuc, nguoi_day_tg on public.buoi_hoc
  for each row execute function public._trg_buoi_bo_tro_gan_ca();

-- Vá buổi đang lệch ngày với ca (chưa huỷ): gắn lại ca khớp ngày + TA + giờ, không có thì để trống.
do $$
declare n int;
begin
  update buoi_hoc b set ca_bo_tro_id = public._ca_bo_tro_khop(b.ngay, b.gio_bat_dau, b.gio_ket_thuc, b.nguoi_day_tg)
    from ca_bo_tro c where c.id = b.ca_bo_tro_id and b.ngay <> c.ngay and b.trang_thai <> 'huy';
  get diagnostics n = row_count;
  if n > 2 then raise exception 'Số buổi lệch ngày khác lúc đo (2): %', n; end if;
  raise notice 'Đã gắn lại % buổi lệch ngày.', n;
end $$;
