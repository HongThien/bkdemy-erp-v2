-- TỰ LUYỆN CHỌN CHỦ ĐỀ: SỐ CÂU THEO DẠNG TÍNH SẴN (Thùy 10/11 — màn app HS 4–5 s, lần nguội tới 21 s).
-- Đo (K9, 21:2x): trong tu_luyen_chu_de_ds_dang, bước ĐẾM CÂU KHO theo dạng (view bdm_cau_hoi + điều kiện câu dùng được online)
-- chiếm gần hết thời gian: ấm ~1 s, NGUỘI 21 s — và chạy lại cho MỖI em MỖI lần mở, dù số câu chỉ đổi khi nhập kho.
-- Theo CLAUDE §2.0 (số không realtime ⇒ bảng tính sẵn): lưu (dạng → số câu) theo khối, màn chỉ đọc.
--   · Làm mới: fn_tu_luyen_so_cau_lam_moi() — cron mỗi sáng (file *_cron_sql_editor.sql đi kèm); kho nhập thêm câu
--     ⇒ dạng mới có câu hiện ra ở lượt làm mới kế tiếp (chậm tối đa 1 ngày).
--   · Khối CHƯA có bản tính ⇒ tính ngay lần đầu (như cũ), sau đó mọi em cùng khối đọc bảng.
-- Chỉ nhánh BẢN ĐỒ MỚI Toán (K6–12, đường đang dùng); nhánh bản đồ cũ / môn khác giữ nguyên.
-- MẤT GÌ: không. Thêm 1 bảng + 2 hàm; thay đúng khối đếm câu trong tu_luyen_chu_de_ds_dang (sửa trên định nghĩa đang chạy).

create table if not exists public.tu_luyen_so_cau (
  ban_do text not null,                 -- 'bdm' (bản đồ mới Toán)
  ma_dang text not null,
  khoi text not null,
  tong_cau integer not null,
  tinh_at timestamptz not null default now(),
  primary key (ban_do, ma_dang)
);
create index if not exists tu_luyen_so_cau_khoi_idx on public.tu_luyen_so_cau (ban_do, khoi);
alter table public.tu_luyen_so_cau enable row level security;

-- Tính lại số câu cho MỘT khối (cùng điều kiện câu với bản cũ: _kho_dk_online_hs_sql)
create or replace function public._tu_luyen_so_cau_tinh(p_khoi text)
returns integer language plpgsql volatile security definer set search_path = public as $$
declare v_dk text := public._kho_dk_online_hs_sql('bdm_cau_hoi'); n integer;
begin
  delete from tu_luyen_so_cau where ban_do = 'bdm' and khoi = p_khoi;
  execute format($q$
    insert into tu_luyen_so_cau (ban_do, ma_dang, khoi, tong_cau, tinh_at)
    select 'bdm', c.dang_chinh, $1, count(*), now()
      from bdm_cau_hoi c
     where c.xoa_at is null and c.dang_chinh = any($2) and %s
     group by c.dang_chinh
    on conflict (ban_do, ma_dang) do update set khoi = excluded.khoi, tong_cau = excluded.tong_cau, tinh_at = excluded.tinh_at
  $q$, v_dk) using p_khoi, array(select b.ma_dang from bdm_ban_do b where b.khoi = p_khoi);
  get diagnostics n = row_count;
  return n;
end $$;

-- Làm mới mọi khối của bản đồ mới (cron mỗi sáng)
create or replace function public.fn_tu_luyen_so_cau_lam_moi()
returns integer language plpgsql volatile security definer set search_path = public as $$
declare k text; n integer := 0;
begin
  for k in select distinct b.khoi from bdm_ban_do b where b.khoi is not null loop
    n := n + public._tu_luyen_so_cau_tinh(k);
  end loop;
  return n;
end $$;

revoke all on function public._tu_luyen_so_cau_tinh(text) from public, anon, authenticated;
revoke all on function public.fn_tu_luyen_so_cau_lam_moi() from public, anon, authenticated;
grant execute on function public.fn_tu_luyen_so_cau_lam_moi() to service_role;

-- tu_luyen_chu_de_ds_dang: khối đếm câu (bản đồ mới) ⇒ đọc bảng tính sẵn
do $mig$
declare d text; i int; j int; cu text; moi text;
begin
  select pg_get_functiondef('public.tu_luyen_chu_de_ds_dang(text)'::regprocedure) into d;
  i := position($a$    v_dk := public._kho_dk_online_hs_sql('bdm_cau_hoi');$a$ in d);
  j := position($a$    v_out := v_out || v_part;$a$ in substr(d, i));
  if i = 0 or j = 0 then raise exception 'tu_luyen_chu_de_ds_dang đã đổi so với lúc viết mig (không thấy khối đếm câu bản đồ mới)'; end if;
  cu := substr(d, i, j - 1);
  if position('bdm_cau_hoi' in cu) = 0 or position('bdm_ban_do bd' in cu) = 0 then raise exception 'khối tìm được không phải khối đếm câu bản đồ mới'; end if;
  moi := $a$    -- 10/11: số câu theo dạng đọc BẢNG TÍNH SẴN (mig 202611102121); khối chưa có bản tính ⇒ tính 1 lần ngay
    if not exists (select 1 from tu_luyen_so_cau s where s.ban_do = 'bdm' and s.khoi = v_khoi) then
      perform public._tu_luyen_so_cau_tinh(v_khoi);
    end if;
    select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', s.tong_cau
      )), '[]'::jsonb)
      into v_part
      from bdm_ban_do bd
      join tu_luyen_so_cau s on s.ban_do = 'bdm' and s.ma_dang = bd.ma_dang
     where bd.khoi = v_khoi and s.tong_cau > 0;
$a$;
  execute replace(d, cu, moi);
end $mig$;
