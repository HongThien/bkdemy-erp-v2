-- ============================================================================
-- 202609290015 — hs_ho_so_huy_hieu_khoe
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Màn HỒ SƠ app HS (design/DON-HANG-GAMI-HS.md Đơn 4, Thùy 29/09 "dọn đường sẵn, design xong chỉ đổi vỏ"): em chọn 3 HUY HIỆU
--   KHOE. Lựa chọn của em phải sống ở DB (đổi máy vẫn còn, TV lớp đọc được) ⇒ bảng mới. KHÔNG dùng hoc_sinh_thanh_tich_ghim
--   (0043): bảng đó FK sang catalog thanh_tich_loai cũ, khác hệ huy hiệu — đụng vào là trộn 2 hệ.
--   Dòng khoe chỉ ra đời khi em THẬT SỰ chọn (§1.5: không đẻ 3 dòng trống sẵn). Em chỉ khoe được huy hiệu đã từng đạt ≥ ★1.
--   fn_hs_ho_so gom số cho màn Hồ sơ (sao từng huy hiệu mùa này, tổng sao, bản cứng đã nhận, 3 khoe) — rẻ, chỉ đọc hs_huy_hieu_dat,
--   KHÔNG gọi fn_hs_album (album đo thành tựu tháng này ⇒ nặng, Hồ sơ không cần).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất dữ liệu có sẵn. fn_hs_khoe_dat thay bộ khoe CỦA CHÍNH EM (xoá dòng khoe cũ của em × môn rồi ghi bộ mới) — đó là
--   hành vi app khi em bấm "Lưu", không đụng dữ liệu nào khác.
-- ============================================================================

create table if not exists hs_huy_hieu_khoe (
  hoc_sinh_id   uuid not null references hoc_sinh(id),
  mon           text not null,
  vi_tri        smallint not null check (vi_tri between 1 and 3),
  huy_hieu_key  text not null,
  chon_at       timestamptz not null default now(),
  primary key (hoc_sinh_id, mon, vi_tri),
  unique (hoc_sinh_id, mon, huy_hieu_key),
  foreign key (mon, huy_hieu_key) references huy_hieu(mon, key)
);
comment on table hs_huy_hieu_khoe is '3 huy hiệu em chọn KHOE ở Hồ sơ (theo môn). Chỉ ghi qua fn_hs_khoe_dat (kiểm em đã đạt ≥ ★1).';

alter table hs_huy_hieu_khoe enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'hs_huy_hieu_khoe' and policyname = 'hs_huy_hieu_khoe_member_all') then
    create policy hs_huy_hieu_khoe_member_all on hs_huy_hieu_khoe for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
  end if;
end $$;

-- Khoe của 1 em × môn: sao = sao CAO NHẤT em từng đạt (mọi mùa) — khoe thứ em đã làm được.
create or replace function public._hs_khoe_json(p_hs uuid, p_mon text) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('vi_tri', k.vi_tri, 'key', k.huy_hieu_key, 'ten', hh.ten,
           'sao', (select max(d.sao) from hs_huy_hieu_dat d where d.hoc_sinh_id = p_hs and d.mon = p_mon and d.huy_hieu_key = k.huy_hieu_key))
         order by k.vi_tri), '[]'::jsonb)
  from hs_huy_hieu_khoe k join huy_hieu hh on hh.mon = k.mon and hh.key = k.huy_hieu_key
  where k.hoc_sinh_id = p_hs and k.mon = p_mon;
$$;

create or replace function public.fn_hs_ho_so(p_mon text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_ym text := to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM');
  v_mua text;
begin
  if v_hs is null then return null; end if;
  if not exists (select 1 from huy_hieu where mon = p_mon and active) then return null; end if;
  select mua into v_mua from gami_mua where v_ym between thang_dau and thang_cuoi limit 1;
  return (
    with hh as (
      select h.key, h.ten, h.thu_tu,
             coalesce((select max(d.sao) from hs_huy_hieu_dat d where d.hoc_sinh_id = v_hs and d.mon = p_mon and d.huy_hieu_key = h.key and d.mua = v_mua), 0) as sao,
             coalesce((select max(d.sao) from hs_huy_hieu_dat d where d.hoc_sinh_id = v_hs and d.mon = p_mon and d.huy_hieu_key = h.key), 0) as sao_cao_nhat
      from huy_hieu h where h.mon = p_mon and h.active
    )
    select jsonb_build_object(
      'mon', p_mon, 'mua', v_mua,
      'huy_hieu', (select jsonb_agg(jsonb_build_object('key', hh.key, 'ten', hh.ten, 'sao', hh.sao, 'sao_cao_nhat', hh.sao_cao_nhat) order by hh.thu_tu) from hh),
      'tong_sao', (select coalesce(sum(hh.sao), 0) from hh),
      'tong_sao_toi_da', (select count(*) * 5 from hh),
      'ban_cung_da_nhan', (select count(*) from hs_huy_hieu_trao t join hs_huy_hieu_dat d on d.id = t.dat_id where d.hoc_sinh_id = v_hs and d.mon = p_mon),
      'khoe', public._hs_khoe_json(v_hs, p_mon)
    )
  );
end $$;
comment on function public.fn_hs_ho_so(text) is 'Màn Hồ sơ app HS (Đơn 4): sao 8 huy hiệu mùa này + cao nhất mọi mùa, tổng sao, bản cứng đã nhận, 3 khoe. Rank/Chặng lấy từ fn_hs_rank_cua_toi / fn_hs_nhiem_vu_cua_toi.';

-- Em thay bộ khoe (0–3 huy hiệu, thứ tự = vị trí). Trả bộ khoe mới để app vá tại chỗ.
create or replace function public.fn_hs_khoe_dat(p_mon text, p_keys text[]) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_keys text[] := coalesce(p_keys, '{}');
  k text; i int := 0;
begin
  if v_hs is null then raise exception 'Chỉ học sinh được chọn huy hiệu khoe.'; end if;
  if cardinality(v_keys) > 3 then raise exception 'Chỉ khoe tối đa 3 huy hiệu.'; end if;
  if cardinality(v_keys) <> (select count(distinct x) from unnest(v_keys) x) then raise exception 'Mỗi huy hiệu chỉ khoe 1 lần.'; end if;
  foreach k in array v_keys loop
    if not exists (select 1 from hs_huy_hieu_dat d where d.hoc_sinh_id = v_hs and d.mon = p_mon and d.huy_hieu_key = k) then
      raise exception 'Em chưa đạt huy hiệu này nên chưa khoe được.';
    end if;
  end loop;
  delete from hs_huy_hieu_khoe where hoc_sinh_id = v_hs and mon = p_mon;
  foreach k in array v_keys loop
    i := i + 1;
    insert into hs_huy_hieu_khoe (hoc_sinh_id, mon, vi_tri, huy_hieu_key) values (v_hs, p_mon, i, k);
  end loop;
  return public._hs_khoe_json(v_hs, p_mon);
end $$;

-- Quyền (bài học 18/09: revoke anon TƯỜNG MINH, kiểm 2 chiều)
revoke all on function public._hs_khoe_json(uuid, text), public.fn_hs_ho_so(text), public.fn_hs_khoe_dat(text, text[]) from public, anon;
grant execute on function public.fn_hs_ho_so(text), public.fn_hs_khoe_dat(text, text[]) to authenticated;

do $$ begin
  if has_function_privilege('anon', 'public.fn_hs_ho_so(text)', 'EXECUTE') or has_function_privilege('anon', 'public.fn_hs_khoe_dat(text,text[])', 'EXECUTE') then
    raise exception 'Tự kiểm: anon còn gọi được hàm Hồ sơ';
  end if;
  if not has_function_privilege('authenticated', 'public.fn_hs_khoe_dat(text,text[])', 'EXECUTE') then
    raise exception 'Tự kiểm: authenticated không gọi được fn_hs_khoe_dat';
  end if;
  if has_function_privilege('authenticated', 'public._hs_khoe_json(uuid,text)', 'EXECUTE') then
    raise exception 'Tự kiểm: _hs_khoe_json (nhận hoc_sinh_id tuỳ ý) không được mở cho authenticated';
  end if;
end $$;
