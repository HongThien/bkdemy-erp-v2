-- Lịch bổ trợ khối (Thùy 12/11):
-- (1) "Kết thúc" ⇒ "XOÁ": lịch biến khỏi danh sách + lưới lịch phòng NGAY (kể cả hôm nay). Còn ca đang chạy (hôm nay trở đi) có em đã xếp
--     ⇒ báo ra, người dùng chọn xoá hay không; xoá ⇒ huỷ các ca đó (buổi huỷ, em về hàng chờ — cùng cách fn_ca_bo_tro_huy).
--     Cách xoá: lịch CHƯA từng sinh ca nào ⇒ xoá hẳn dòng · đã sinh ca (ca quá khứ trỏ FK về) ⇒ đóng hiệu lực tới HÔM QUA
--     (mọi hàm đọc lịch trực đều lọc theo hiệu lực ⇒ biến khỏi mọi nơi, lịch sử ca cũ vẫn giải thích được).
-- (2) CHỐT LỊCH TUẦN: mỗi tuần (T2–CN) bấm Chốt 1 lần, kể cả không đổi gì. Chốt = đồng bộ: sinh ca cho mọi ngày còn lại của tuần
--     từ lịch khối · ca chưa có em đi theo lịch hiện tại (phòng/giờ/người) · ca chưa có em của lịch đã xoá thì huỷ · lưu bản chụp.
--     Sửa lịch sau khi chốt ⇒ so NỘI DUNG bản chụp với lịch hiện tại ⇒ màn báo "đã đổi sau chốt — chốt lại".

-- ── (1) Xoá ──
create or replace function public.fn_lich_truc_xoa(p_id uuid, p_xac_nhan boolean default false)
returns jsonb
language plpgsql volatile
set search_path = public
as $$
declare
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_vuong jsonb; v_ca int := 0; v_buoi int := 0; v_han boolean;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not exists (select 1 from lich_truc_bo_tro where id = p_id) then raise exception 'Không thấy lịch này.'; end if;

  -- ca từ hôm nay trở đi đang có em
  select coalesce(jsonb_agg(jsonb_build_object('ngay', c.ngay, 'gio_bat_dau', to_char(c.gio_bat_dau, 'HH24:MI'), 'gio_ket_thuc', to_char(c.gio_ket_thuc, 'HH24:MI'),
           'phong', c.phong, 'so_em', x.n) order by c.ngay, c.gio_bat_dau), '[]'::jsonb)
    into v_vuong
  from ca_bo_tro c
  join lateral (select count(*)::int n from buoi_hoc b join buoi_hoc_hs h on h.buoi_hoc_id = b.id
                where b.ca_bo_tro_id = c.id and b.trang_thai <> 'huy') x on x.n > 0
  where c.lich_truc_id = p_id and c.trang_thai = 'mo' and c.ngay >= v_nay;

  if jsonb_array_length(v_vuong) > 0 and not coalesce(p_xac_nhan, false) then
    return jsonb_build_object('ok', false, 'vuong', v_vuong);
  end if;

  -- huỷ mọi ca từ hôm nay của lịch này (có em thì buổi huỷ theo)
  update buoi_hoc set trang_thai = 'huy', ly_do_huy = 'Ca bổ trợ huỷ: xoá lịch bổ trợ khối', updated_at = now()
   where trang_thai = 'mo' and ca_bo_tro_id in (select id from ca_bo_tro where lich_truc_id = p_id and trang_thai = 'mo' and ngay >= v_nay);
  get diagnostics v_buoi = row_count;
  update ca_bo_tro set trang_thai = 'huy', ly_do_huy = 'Xoá lịch bổ trợ khối', huy_at = now(), huy_boi = public.jwt_uid()
   where lich_truc_id = p_id and trang_thai = 'mo' and ngay >= v_nay;
  get diagnostics v_ca = row_count;

  v_han := not exists (select 1 from ca_bo_tro where lich_truc_id = p_id);
  if v_han then
    delete from lich_truc_bo_tro where id = p_id;
  else
    update lich_truc_bo_tro set hieu_luc_den = v_nay - 1 where id = p_id;
  end if;
  return jsonb_build_object('ok', true, 'xoa_han', v_han, 'ca_huy', v_ca, 'buoi_huy', v_buoi);
end
$$;

-- ── (2) Chốt tuần ──
create table if not exists public.lich_khoi_chot (
  id uuid primary key default gen_random_uuid(),
  tuan date not null check (extract(isodow from tuan) = 1),   -- thứ 2 của tuần
  chot_at timestamptz not null default now(),
  chot_boi uuid,                                                -- nhan_su.id người bấm
  ban_chup jsonb not null,                                      -- nội dung lịch khối của tuần lúc chốt
  ca_sinh int not null default 0, ca_cap_nhat int not null default 0, ca_huy int not null default 0
);
create index if not exists lich_khoi_chot_tuan_idx on public.lich_khoi_chot (tuan, chot_at desc);
alter table public.lich_khoi_chot enable row level security;
drop policy if exists lich_khoi_chot_member on public.lich_khoi_chot;
create policy lich_khoi_chot_member on public.lich_khoi_chot for all to authenticated
  using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));

-- Nội dung lịch khối có hiệu lực ít nhất 1 ngày trong tuần — mảng sắp ổn định để so bằng nhau.
create or replace function public._lich_khoi_ban_chup(p_tuan date)
returns jsonb
language sql stable
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'mon', t.mon, 'khoi', t.khoi, 'thu', t.thu,
           'bd', to_char(t.gio_bat_dau, 'HH24:MI'), 'kt', to_char(t.gio_ket_thuc, 'HH24:MI'), 'phong', t.phong,
           'ns', t.nhan_su_id, 'ns2', t.nhan_su_2_id, 'so_ta', t.so_ta, 'suc_chua', t.suc_chua, 'tu', t.hieu_luc_tu, 'den', t.hieu_luc_den) order by t.id), '[]'::jsonb)
  from lich_truc_bo_tro t
  where t.hieu_luc_tu <= p_tuan + 6 and (t.hieu_luc_den is null or t.hieu_luc_den >= p_tuan)
$$;

create or replace function public.fn_lich_khoi_chot_tuan(p_tuan date)
returns jsonb
language plpgsql volatile
set search_path = public
as $$
declare
  v_tuan date := p_tuan - (extract(isodow from p_tuan)::int - 1);
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  d date; v_sinh int := 0; v_n int; v_cap int := 0; v_huy int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if v_tuan + 6 < v_nay then raise exception 'Tuần đã qua, không chốt lại được.'; end if;

  for d in select g::date from generate_series(greatest(v_tuan, v_nay), v_tuan + 6, interval '1 day') g loop
    -- ca chưa có em mà lịch đã xoá/hết hiệu lực ngày đó ⇒ huỷ
    update ca_bo_tro c set trang_thai = 'huy', ly_do_huy = 'Chốt tuần: lịch khối không còn', huy_at = now(), huy_boi = public.jwt_uid()
     where c.ngay = d and c.trang_thai = 'mo' and c.lich_truc_id is not null
       and not exists (select 1 from buoi_hoc b where b.ca_bo_tro_id = c.id and b.trang_thai <> 'huy')
       and not exists (select 1 from lich_truc_bo_tro t where t.id = c.lich_truc_id and t.hieu_luc_tu <= d and (t.hieu_luc_den is null or t.hieu_luc_den >= d));
    get diagnostics v_n = row_count; v_huy := v_huy + v_n;
    -- ca chưa có em đi theo lịch hiện tại
    update ca_bo_tro c set phong = t.phong, gio_bat_dau = t.gio_bat_dau, gio_ket_thuc = t.gio_ket_thuc,
           nhan_su_id = t.nhan_su_id, nhan_su_2_id = t.nhan_su_2_id, so_ta = t.so_ta
      from lich_truc_bo_tro t
     where t.id = c.lich_truc_id and c.ngay = d and c.trang_thai = 'mo'
       and not exists (select 1 from buoi_hoc b where b.ca_bo_tro_id = c.id and b.trang_thai <> 'huy')
       and (c.phong is distinct from t.phong or c.gio_bat_dau <> t.gio_bat_dau or c.gio_ket_thuc <> t.gio_ket_thuc
            or c.nhan_su_id is distinct from t.nhan_su_id or c.nhan_su_2_id is distinct from t.nhan_su_2_id or c.so_ta <> t.so_ta);
    get diagnostics v_n = row_count; v_cap := v_cap + v_n;
    -- sinh ca còn thiếu (cùng hàm "mở ngày" của Lịch phòng bổ trợ)
    v_sinh := v_sinh + public.fn_ca_bo_tro_sinh_ngay(d);
  end loop;

  insert into lich_khoi_chot (tuan, chot_boi, ban_chup, ca_sinh, ca_cap_nhat, ca_huy)
  values (v_tuan, public.current_nhan_su_id(), public._lich_khoi_ban_chup(v_tuan), v_sinh, v_cap, v_huy);
  return jsonb_build_object('tuan', v_tuan, 'ca_sinh', v_sinh, 'ca_cap_nhat', v_cap, 'ca_huy', v_huy);
end
$$;

-- Trạng thái chốt của 1 tuần: chưa chốt / đã chốt (ai, lúc nào) / đã đổi sau chốt (so NỘI DUNG bản chụp với hiện tại).
create or replace function public.fn_lich_khoi_chot_trang_thai(p_tuan date)
returns jsonb
language sql stable
set search_path = public
as $$
  with t as (select p_tuan - (extract(isodow from p_tuan)::int - 1) as tuan),
  c as (select k.* from lich_khoi_chot k, t where k.tuan = t.tuan order by k.chot_at desc limit 1)
  select case when not public.la_thanh_vien() then null
    when not exists (select 1 from c) then jsonb_build_object('tuan', (select tuan from t), 'da_chot', false)
    else (select jsonb_build_object('tuan', c.tuan, 'da_chot', true, 'chot_at', c.chot_at,
            'chot_boi', (select ho_ten from nhan_su where id = c.chot_boi),
            'doi_sau_chot', c.ban_chup <> public._lich_khoi_ban_chup(c.tuan),
            'ca_sinh', c.ca_sinh, 'ca_cap_nhat', c.ca_cap_nhat, 'ca_huy', c.ca_huy) from c) end
$$;

revoke all on function public.fn_lich_truc_xoa(uuid, boolean) from public, anon;
revoke all on function public._lich_khoi_ban_chup(date) from public, anon;
revoke all on function public.fn_lich_khoi_chot_tuan(date) from public, anon;
revoke all on function public.fn_lich_khoi_chot_trang_thai(date) from public, anon;
grant execute on function public.fn_lich_truc_xoa(uuid, boolean) to authenticated;
grant execute on function public._lich_khoi_ban_chup(date) to authenticated;
grant execute on function public.fn_lich_khoi_chot_tuan(date) to authenticated;
grant execute on function public.fn_lich_khoi_chot_trang_thai(date) to authenticated;
grant select, insert on public.lich_khoi_chot to authenticated;
