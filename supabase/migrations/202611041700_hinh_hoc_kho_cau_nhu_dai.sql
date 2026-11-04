-- Hình–Học: kho câu giống Đại (Thùy 04/11 "UI câu trong kho giống bên Đại cho đồng nhất").
--  1) hinh_hoc_kho_ds   — KHO ĐÚNG/SAI cấp CHỦ ĐỀ (như dai_bdm_kho_ds, 18/10): câu Đ/S có 4 ý ⇒ không gán vào bài học.
--  2) fn_hh_kho_cau     — cùng hình dạng trả về fn_bdm_kho_cau để màn "Kho" của Đại (KhoModal) dùng chung:
--                         dang_bai (p_id = ma_bai) · dung_sai / de_xuat / chua_khop (p_id = chủ đề).
--  3) fn_hh_cau_chuyen_dang · fn_hh_cau_xoa — chuyển câu sang bài khác / đưa vào kho rác (soft-delete xoa_at).
-- Gán bài của Hình–Học = hinh_hoc_cau_hoi.dang_chinh (không có bảng gan_cau); đề xuất mức vừa = dang_ai_de_xuat khi còn ở bài chờ HH<khối>000000.

create table if not exists hinh_hoc_kho_ds (
  ma_cau text primary key references hinh_hoc_cau_hoi(ma_cau),
  chu_de_id text not null references dai_bdm_chu_de(id),
  nguon text not null default 'ai' check (nguon in ('nguoi', 'ai')),
  actor uuid,
  at timestamptz not null default now()
);
create index if not exists hinh_hoc_kho_ds_chu_de on hinh_hoc_kho_ds (chu_de_id);
alter table hinh_hoc_kho_ds enable row level security;
drop policy if exists hinh_hoc_kho_ds_member_all on hinh_hoc_kho_ds;
create policy hinh_hoc_kho_ds_member_all on hinh_hoc_kho_ds for all
  using ((select la_thanh_vien())) with check ((select la_thanh_vien()));

create or replace function fn_hh_kho_cau(p_loai text, p_id text, p_loc text default 'tat_ca', p_limit integer default 40, p_offset integer default 0)
returns table(tong bigint, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text,
              anh_de text, anh_dap_an text, da_duyet boolean, kho_chuan boolean, kiem_may text, nguon text, la_goc boolean,
              nguon_gan text, dang_bai_id text, dang_bai text, ly_do text)
language plpgsql stable security definer set search_path to 'public' as $$
declare v_khoi text; v_cho text;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loc not in ('tat_ca', 'da_duyet', 'chua_duyet', 'kho_chuan') then raise exception 'fn_hh_kho_cau: bộ lọc không hợp lệ %', p_loc; end if;
  if p_loai not in ('dang_bai', 'dung_sai', 'de_xuat', 'chua_khop') then raise exception 'fn_hh_kho_cau: p_loai không hợp lệ %', p_loai; end if;

  if p_loai = 'dang_bai' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'hinh_hoc'::text, b.ma_bai, b.ten_bai, null::text
        from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh
       where c.dang_chinh = p_id and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by coalesce(c.parent_ma_cau, c.ma_cau), c.parent_ma_cau is not null, c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  select cd.khoi into v_khoi from dai_bdm_chu_de cd where cd.id = p_id;
  if v_khoi is null then return; end if;
  v_cho := 'HH' || v_khoi || '000000';

  if p_loai = 'dung_sai' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'dung_sai'::text, null::text, null::text, null::text
        from hinh_hoc_kho_ds k join hinh_hoc_cau_hoi c on c.ma_cau = k.ma_cau and c.xoa_at is null
       where k.chu_de_id = p_id
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  if p_loai = 'de_xuat' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'de_xuat:vua'::text, b.ma_bai, b.ten_bai, null::text
        from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_ai_de_xuat and b.chu_de_id = p_id
       where c.dang_chinh = v_cho and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by b.thu_tu, c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  -- chua_khop: còn ở bài chờ, chưa có đề xuất của chủ đề này, không phải Đ/S
  return query
    select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
           c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
           'chua_khop'::text, null::text, null::text, null::text
      from hinh_hoc_cau_hoi c
     where c.dang_chinh = v_cho and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       and not exists (select 1 from hinh_hoc_bai b2 where b2.ma_bai = c.dang_ai_de_xuat and b2.chu_de_id = p_id)
       and not exists (select 1 from hinh_hoc_kho_ds k where k.ma_cau = c.ma_cau)
       and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
     order by c.ma_cau limit p_limit offset p_offset;
end $$;

create or replace function fn_hh_cau_chuyen_dang(p_ma_cau text, p_ma_bai text, p_ca_ban_sao boolean default true)
returns jsonb language plpgsql set search_path to 'public' as $$
declare v jsonb; v_n integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not exists (select 1 from hinh_hoc_bai where ma_bai = p_ma_bai) then raise exception 'Không có bài học %', p_ma_bai; end if;
  update hinh_hoc_cau_hoi set dang_chinh = p_ma_bai
   where xoa_at is null and (ma_cau = p_ma_cau or (p_ca_ban_sao and parent_ma_cau = p_ma_cau));
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'Không thấy câu % ở kho Hình–Học', p_ma_cau; end if;
  select jsonb_build_object('id', b.ma_bai, 'ten', b.ten_bai, 'nhom', b.ten_bai, 'chu_de', coalesce(cd.ten, ''), 'so_cau', v_n) into v
    from hinh_hoc_bai b left join dai_bdm_chu_de cd on cd.id = b.chu_de_id where b.ma_bai = p_ma_bai;
  return v;
end $$;

create or replace function fn_hh_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean default false)
returns integer language plpgsql set search_path to 'public' as $$
declare v integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  update hinh_hoc_cau_hoi set xoa_at = now()
   where xoa_at is null and (ma_cau = p_ma_cau or (p_ca_ban_sao and parent_ma_cau = p_ma_cau));
  get diagnostics v = row_count;
  if v = 0 then raise exception 'Không thấy câu % ở kho Hình–Học', p_ma_cau; end if;
  return v;
end $$;

revoke execute on function fn_hh_kho_cau(text, text, text, integer, integer) from public, anon;
revoke execute on function fn_hh_cau_chuyen_dang(text, text, boolean) from public, anon;
revoke execute on function fn_hh_cau_xoa(text, boolean) from public, anon;
grant execute on function fn_hh_kho_cau(text, text, text, integer, integer) to authenticated;
grant execute on function fn_hh_cau_chuyen_dang(text, text, boolean) to authenticated;
grant execute on function fn_hh_cau_xoa(text, boolean) to authenticated;
