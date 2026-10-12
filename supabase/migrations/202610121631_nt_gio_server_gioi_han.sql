-- ============================================================================
-- 202610121631 — nt_gio_server_gioi_han: NÔNG TRẠI BK — GIỜ THEO SERVER + GIỚI HẠN GIỜ CHƠI MỖI NGÀY (bước 2 "hoàn thiện game", Thùy 12/10)
-- ----------------------------------------------------------------------------
-- VÌ SAO: (1) ngày nông trại tính theo ĐỒNG HỒ MÁY ⇒ đổi giờ máy là gian lận (tua ngày, thu hoạch sớm). (2) Chưa có giới hạn giờ chơi.
-- MÔ HÌNH:
--   · Giờ: server là nguồn duy nhất — app đưa `gio_ms` (epoch ms server) cho game; game tính lệch = server − máy và dùng thay Date.now().
--     Tua ngày/tốc độ (bản thử) bị TẮT khi chơi theo tài khoản.
--   · Giờ chơi: game gửi NHỊP ~30 giây/lần (qua app). Server tự đo khoảng cách giữa 2 nhịp liên tiếp: ≤ 90 giây ⇒ cộng đúng khoảng đó
--     (em đang chơi liên tục); > 90 giây ⇒ không cộng (phiên mới). CLIENT KHÔNG KHAI số giây ⇒ không khai khống/khai thiếu được.
--     1 dòng / HS / NGÀY NÔNG TRẠI (đổi lúc `gio_doi_ngay` giờ sáng VN) — chưa chơi ⇒ KHÔNG có dòng (§1.5).
--   · Cấu hình 1 dòng nt_cau_hinh: bat · gio_toi_da_phut (mặc định 30 — đề xuất của CTO, Thùy chưa chốt số) · gio_doi_ngay (5). Đổi: fn_nt_cau_hinh_dat.
-- GHI CHÚ TRUNG THỰC: vẫn là client chơi + server đo giờ; chống gian lận kinh tế (xu/điểm/hái trộm) = bước sau.
-- MẤT GÌ: không xoá/thu hẹp gì — thêm 2 bảng + 2 hàm, thay thân 2 hàm của B1 (chỉ THÊM khoá `gio_ms` vào kết quả).
-- ============================================================================

create table if not exists public.nt_cau_hinh (
  id integer primary key default 1 check (id = 1),
  bat boolean not null default true,
  gio_toi_da_phut integer not null default 30 check (gio_toi_da_phut between 1 and 1440),
  gio_doi_ngay integer not null default 5 check (gio_doi_ngay between 0 and 23),
  updated_at timestamptz not null default now()
);
insert into public.nt_cau_hinh (id) values (1) on conflict (id) do nothing;
alter table public.nt_cau_hinh enable row level security;
revoke all on public.nt_cau_hinh from anon, authenticated;

create table if not exists public.nt_gio_choi (
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  ngay        date not null,
  giay        integer not null default 0 check (giay >= 0),
  nhip_cuoi   timestamptz not null,
  primary key (hoc_sinh_id, ngay)
);
alter table public.nt_gio_choi enable row level security;
revoke all on public.nt_gio_choi from anon, authenticated;

-- Ngày nông trại hiện tại (giờ VN, đổi lúc gio_doi_ngay)
create or replace function public._nt_ngay(p_t timestamptz default clock_timestamp())
returns date
language sql stable set search_path = public as $$
  select ((p_t at time zone 'Asia/Ho_Chi_Minh') - make_interval(hours => (select gio_doi_ngay from nt_cau_hinh where id = 1)))::date
$$;

-- NHỊP: cộng giờ chơi (server tự đo) + trả giờ server & số giây còn lại.
create or replace function public.fn_nt_nhip()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id(); c nt_cau_hinh; v_now timestamptz := clock_timestamp(); v_ngay date;
  v_gioi integer; v_row nt_gio_choi; v_them integer := 0;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  select * into c from nt_cau_hinh where id = 1;
  v_ngay := public._nt_ngay(v_now);
  v_gioi := c.gio_toi_da_phut * 60;
  select * into v_row from nt_gio_choi where hoc_sinh_id = v_hs and ngay = v_ngay for update;
  if not found then
    insert into nt_gio_choi (hoc_sinh_id, ngay, giay, nhip_cuoi) values (v_hs, v_ngay, 0, v_now) returning * into v_row;
  else
    if extract(epoch from (v_now - v_row.nhip_cuoi)) <= 90 then v_them := floor(extract(epoch from (v_now - v_row.nhip_cuoi)))::int; end if;
    if c.bat then v_them := least(v_them, greatest(0, v_gioi - v_row.giay)); end if;   -- không cộng quá trần
    update nt_gio_choi set giay = giay + v_them, nhip_cuoi = v_now where hoc_sinh_id = v_hs and ngay = v_ngay returning * into v_row;
  end if;
  return jsonb_build_object(
    'gio_ms', floor(extract(epoch from v_now) * 1000)::bigint,
    'ngay', v_ngay,
    'bat', c.bat,
    'da_choi_giay', v_row.giay,
    'gioi_han_giay', case when c.bat then v_gioi end,
    'con_lai_giay', case when c.bat then greatest(0, v_gioi - v_row.giay) end,
    'het', c.bat and v_row.giay >= v_gioi
  );
end $$;
revoke all on function public.fn_nt_nhip() from public;
revoke execute on function public.fn_nt_nhip() from anon;
grant execute on function public.fn_nt_nhip() to authenticated;

-- Admin đổi cấu hình (null = giữ nguyên)
create or replace function public.fn_nt_cau_hinh_dat(p_bat boolean default null, p_gio_toi_da_phut integer default null, p_gio_doi_ngay integer default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare r nt_cau_hinh;
begin
  if not public.co_quyen_ghi('tinh_nang') then raise exception 'Không có quyền đổi cấu hình Nông trại' using errcode = '42501'; end if;
  update nt_cau_hinh set bat = coalesce(p_bat, bat), gio_toi_da_phut = coalesce(p_gio_toi_da_phut, gio_toi_da_phut),
         gio_doi_ngay = coalesce(p_gio_doi_ngay, gio_doi_ngay), updated_at = now() where id = 1 returning * into r;
  return to_jsonb(r);
end $$;
revoke all on function public.fn_nt_cau_hinh_dat(boolean, integer, integer) from public;
revoke execute on function public.fn_nt_cau_hinh_dat(boolean, integer, integer) from anon;
grant execute on function public.fn_nt_cau_hinh_dat(boolean, integer, integer) to authenticated;

-- B1 + giờ server: đọc/ghi bản lưu kèm `gio_ms` (game đồng bộ lại đồng hồ mỗi lần lưu)
create or replace function public.fn_nt_luu_doc()
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('state', l.state, 'cap_nhat', l.cap_nhat, 'gio_ms', floor(extract(epoch from clock_timestamp()) * 1000)::bigint)
  from nt_luu l where l.hoc_sinh_id = public.my_hoc_sinh_id()
$$;

create or replace function public.fn_nt_luu_ghi(p_state jsonb, p_cap_nhat timestamptz default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_cu nt_luu; v_moi timestamptz;
        v_gio bigint := floor(extract(epoch from clock_timestamp()) * 1000)::bigint;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if p_state is null or jsonb_typeof(p_state) <> 'object' or (p_state->>'v') is distinct from '2' then raise exception 'Bản lưu không hợp lệ.' using errcode = '22023'; end if;
  if octet_length(p_state::text) > 262144 then raise exception 'Bản lưu quá lớn.' using errcode = '22023'; end if;

  select * into v_cu from nt_luu where hoc_sinh_id = v_hs for update;
  if not found then
    if p_cap_nhat is not null then
      return jsonb_build_object('ok', false, 'state', null, 'cap_nhat', null, 'gio_ms', v_gio);
    end if;
    insert into nt_luu (hoc_sinh_id, state) values (v_hs, p_state) returning cap_nhat into v_moi;
    return jsonb_build_object('ok', true, 'cap_nhat', v_moi, 'gio_ms', v_gio);
  end if;
  if p_cap_nhat is distinct from v_cu.cap_nhat then
    return jsonb_build_object('ok', false, 'state', v_cu.state, 'cap_nhat', v_cu.cap_nhat, 'gio_ms', v_gio);
  end if;
  update nt_luu set state = p_state, cap_nhat = clock_timestamp() where hoc_sinh_id = v_hs returning cap_nhat into v_moi;
  return jsonb_build_object('ok', true, 'cap_nhat', v_moi, 'gio_ms', v_gio);
end $$;
