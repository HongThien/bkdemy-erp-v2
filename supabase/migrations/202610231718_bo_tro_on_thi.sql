-- BỔ TRỢ ÔN THI (Thùy 23/10): mỗi kỳ thi (giữa kỳ ×2, cuối kỳ ×2 một năm) BK mở ca ôn cho TẤT CẢ học sinh trong 2 tuần quanh kỳ thi.
-- Khác Yếu/Bù/Đuổi/Hình: KHÔNG có case, KHÔNG liên quan mastery, KHÔNG dùng app HS, KHÔNG test/đo — em chỉ đến luyện, TA điểm danh.
-- Luồng: Trang tạo ĐỢT (kỳ thi + khối + khoảng ngày) → tạo CA (ngày, giờ, phòng, TA) → thêm HS đăng ký vào ca (Trang nhập tay; TA thêm tại chỗ được)
-- → ca hiện ở app TA (điểm danh, báo động cuối giờ) → báo động về ERP của Trang → ERP thống kê đã đi / chờ đi / không đi được / chưa đi theo khối.
-- Không đụng ca trực (ca_bo_tro), suất 3 ca/TA, trần 70/20 — ôn thi ngoài hệ case. Công TA = việc PHÁT SINH, mức riêng (ngoai_package, đơn giá gia_bo_tro_on_thi).

-- ============ 1. Bảng ============
create table public.bo_tro_on_thi_dot (
  id uuid primary key default gen_random_uuid(),
  ten text not null,
  loai text not null,
  hoc_ky smallint not null,
  khoi text[] not null,
  tu_ngay date not null,
  den_ngay date not null,
  ghi_chu text,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bo_tro_on_thi_dot_ten_ck check (length(btrim(ten)) > 0),
  constraint bo_tro_on_thi_dot_loai_ck check (loai in ('giua_ky', 'cuoi_ky')),
  constraint bo_tro_on_thi_dot_hoc_ky_ck check (hoc_ky in (1, 2)),
  constraint bo_tro_on_thi_dot_khoi_ck check (cardinality(khoi) > 0),
  constraint bo_tro_on_thi_dot_ngay_ck check (den_ngay >= tu_ngay)
);

create table public.bo_tro_on_thi_bao_dong (
  id uuid primary key default gen_random_uuid(),
  buoi_hoc_id uuid not null references public.buoi_hoc(id) on delete cascade,
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  noi_dung text not null,
  nguoi_bao uuid references public.nhan_su(id),
  trang_thai text not null default 'moi',
  xu_ly_ghi_chu text,
  xu_ly_boi uuid references public.nhan_su(id),
  xu_ly_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (buoi_hoc_id, hoc_sinh_id),
  constraint bo_tro_on_thi_bd_noi_dung_ck check (length(btrim(noi_dung)) > 0),
  constraint bo_tro_on_thi_bd_trang_thai_ck check (trang_thai in ('moi', 'da_xu_ly'))
);
create index bo_tro_on_thi_bao_dong_hs on public.bo_tro_on_thi_bao_dong (hoc_sinh_id);

alter table public.bo_tro_on_thi_dot enable row level security;
alter table public.bo_tro_on_thi_bao_dong enable row level security;
-- Ghi CHỈ qua RPC (security definer); nhân sự đọc được.
create policy bo_tro_on_thi_dot_member_sel on public.bo_tro_on_thi_dot for select to authenticated using (public.la_thanh_vien());
create policy bo_tro_on_thi_bao_dong_member_sel on public.bo_tro_on_thi_bao_dong for select to authenticated using (public.la_thanh_vien());

-- ============ 2. Nối vào buổi ============
alter table public.buoi_hoc drop constraint buoi_hoc_loai_check;
alter table public.buoi_hoc add constraint buoi_hoc_loai_check
  check (loai = any (array['thuong', 'bu', 'bo_tro_yeu', 'bo_tro_duoi', 'mt', 'bo_tro_hinh', 'khao_sat', 'bo_tro_on_thi']));
alter table public.buoi_hoc add column on_thi_dot_id uuid references public.bo_tro_on_thi_dot(id);
alter table public.buoi_hoc add constraint buoi_hoc_on_thi_dot_ck check (loai <> 'bo_tro_on_thi' or on_thi_dot_id is not null);
create index buoi_hoc_on_thi_dot on public.buoi_hoc (on_thi_dot_id) where on_thi_dot_id is not null;
-- Em ĐẾN mà không đăng ký trước (TA thêm tại chỗ).
alter table public.buoi_hoc_hs add column on_thi_khong_dk boolean not null default false;

-- ============ 3. Đợt ============
create or replace function public.fn_onthi_dot_luu(p_id uuid, p_ten text, p_loai text, p_hoc_ky int, p_khoi text[], p_tu date, p_den date, p_ghi_chu text default null)
returns uuid language plpgsql security definer set search_path to 'public' as $$
declare v uuid := p_id; v_khoi text[];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if nullif(btrim(coalesce(p_ten, '')), '') is null then raise exception 'Nhập tên đợt (vd: Ôn thi giữa kỳ I).'; end if;
  if p_loai not in ('giua_ky', 'cuoi_ky') then raise exception 'Loại đợt: giữa kỳ hoặc cuối kỳ.'; end if;
  if p_hoc_ky not in (1, 2) then raise exception 'Học kỳ 1 hoặc 2.'; end if;
  select coalesce(array_agg(distinct btrim(k)) filter (where btrim(k) <> ''), '{}') into v_khoi from unnest(coalesce(p_khoi, '{}')) k;
  if cardinality(v_khoi) = 0 then raise exception 'Chọn ít nhất 1 khối.'; end if;
  if p_tu is null or p_den is null or p_den < p_tu then raise exception 'Khoảng ngày không hợp lệ.'; end if;
  if v is null then
    insert into bo_tro_on_thi_dot (ten, loai, hoc_ky, khoi, tu_ngay, den_ngay, ghi_chu, created_by)
      values (btrim(p_ten), p_loai, p_hoc_ky, v_khoi, p_tu, p_den, nullif(btrim(coalesce(p_ghi_chu, '')), ''), public.jwt_uid()) returning id into v;
  else
    if not exists (select 1 from bo_tro_on_thi_dot where id = v) then raise exception 'Không thấy đợt.'; end if;
    if exists (select 1 from buoi_hoc b where b.on_thi_dot_id = v and b.trang_thai <> 'huy' and (b.ngay < p_tu or b.ngay > p_den)) then
      raise exception 'Đã có ca nằm ngoài khoảng ngày mới — đổi/huỷ ca đó trước.'; end if;
    update bo_tro_on_thi_dot set ten = btrim(p_ten), loai = p_loai, hoc_ky = p_hoc_ky, khoi = v_khoi, tu_ngay = p_tu, den_ngay = p_den,
      ghi_chu = nullif(btrim(coalesce(p_ghi_chu, '')), ''), updated_at = now() where id = v;
  end if;
  return v;
end $$;

create or replace function public.fn_onthi_dot_ds() returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'id', d.id, 'ten', d.ten, 'loai', d.loai, 'hoc_ky', d.hoc_ky, 'khoi', d.khoi, 'tu_ngay', d.tu_ngay, 'den_ngay', d.den_ngay, 'ghi_chu', d.ghi_chu,
      'so_ca', (select count(*) from buoi_hoc b where b.on_thi_dot_id = d.id and b.trang_thai <> 'huy'),
      'so_hs_dang_ky', (select count(distinct hh.hoc_sinh_id) from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                         where b.on_thi_dot_id = d.id and b.trang_thai <> 'huy')) order by d.tu_ngay desc, d.created_at desc)
    from bo_tro_on_thi_dot d), '[]'::jsonb);
end $$;

-- ============ 4. Ca ============
create or replace function public.fn_onthi_ca_luu(p_id uuid, p_dot uuid, p_ngay date, p_bat_dau time, p_ket_thuc time, p_phong text, p_ta uuid)
returns uuid language plpgsql security definer set search_path to 'public' as $$
declare d record; v uuid := p_id; b record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into d from bo_tro_on_thi_dot where id = p_dot;
  if d.id is null then raise exception 'Không thấy đợt.'; end if;
  if p_ngay is null or p_ngay < d.tu_ngay or p_ngay > d.den_ngay then
    raise exception 'Ngày ca phải nằm trong đợt (% → %).', to_char(d.tu_ngay, 'DD/MM'), to_char(d.den_ngay, 'DD/MM'); end if;
  if p_bat_dau is null or p_ket_thuc is null or p_ket_thuc <= p_bat_dau then raise exception 'Giờ bắt đầu / kết thúc không hợp lệ.'; end if;
  if p_ta is not null and not exists (select 1 from nhan_su where id = p_ta) then raise exception 'Không thấy trợ giảng.'; end if;
  if v is null then
    insert into buoi_hoc (loai, on_thi_dot_id, ngay, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_by)
      values ('bo_tro_on_thi', p_dot, p_ngay, p_bat_dau, p_ket_thuc, nullif(btrim(coalesce(p_phong, '')), ''), p_ta, 'mo', public.jwt_uid()) returning id into v;
  else
    select * into b from buoi_hoc where id = v and loai = 'bo_tro_on_thi';
    if b.id is null then raise exception 'Không phải ca ôn thi.'; end if;
    if b.trang_thai = 'huy' then raise exception 'Ca đã huỷ.'; end if;
    if b.danh_gia_xong_at is not null then raise exception 'Ca đã hoàn tất — không sửa được.'; end if;
    update buoi_hoc set on_thi_dot_id = p_dot, ngay = p_ngay, gio_bat_dau = p_bat_dau, gio_ket_thuc = p_ket_thuc,
      phong = nullif(btrim(coalesce(p_phong, '')), ''), nguoi_day_tg = p_ta, updated_at = now() where id = v;
  end if;
  return v;
end $$;

-- Huỷ ca: giữ dòng đăng ký (vết); em trở về "chưa đi" trong thống kê vì ca huỷ không tính.
create or replace function public.fn_onthi_ca_huy(p_buoi uuid, p_ly_do text default null)
returns void language plpgsql security definer set search_path to 'public' as $$
declare b record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into b from buoi_hoc where id = p_buoi and loai = 'bo_tro_on_thi';
  if b.id is null then raise exception 'Không phải ca ôn thi.'; end if;
  if b.trang_thai = 'huy' then return; end if;
  if exists (select 1 from buoi_hoc_hs where buoi_hoc_id = p_buoi and diem_danh = 'co_mat') then
    raise exception 'Đã có em được điểm danh CÓ MẶT — không huỷ được ca.'; end if;
  update buoi_hoc set trang_thai = 'huy', ly_do_huy = nullif(btrim(coalesce(p_ly_do, '')), ''), updated_at = now() where id = p_buoi;
end $$;

-- Chi tiết ca của đợt kèm danh sách em (ERP).
create or replace function public.fn_onthi_ca_ds(p_dot uuid) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  return coalesce((select jsonb_agg(x.j order by x.ngay, x.gio, x.id) from (
    select b.id, b.ngay, b.gio_bat_dau as gio, jsonb_build_object(
      'buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong,
      'trang_thai', b.trang_thai, 'hoan_tat', b.danh_gia_xong_at is not null, 'ly_do_huy', b.ly_do_huy,
      'ta_id', b.nguoi_day_tg, 'ta_ten', (select n.ho_ten from nhan_su n where n.id = b.nguoi_day_tg),
      'so_dk', (select count(*) from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id),
      'so_co_mat', (select count(*) from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id and hh.diem_danh = 'co_mat'),
      'so_vang', (select count(*) from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id and hh.diem_danh in ('vang', 'vang_phep')),
      'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'hoc_sinh_id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'khoi', h.khoi, 'diem_danh', hh.diem_danh, 'khong_dk', hh.on_thi_khong_dk,
              'bao_dong', exists (select 1 from bo_tro_on_thi_bao_dong bd where bd.buoi_hoc_id = b.id and bd.hoc_sinh_id = h.id)) order by h.ho_ten)
            from buoi_hoc_hs hh join hoc_sinh h on h.id = hh.hoc_sinh_id where hh.buoi_hoc_id = b.id), '[]'::jsonb)) as j
    from buoi_hoc b where b.loai = 'bo_tro_on_thi' and b.on_thi_dot_id = p_dot) x), '[]'::jsonb);
end $$;

-- ============ 5. Học sinh trong ca ============
-- Tìm HS để thêm: mặc định chỉ khối của đợt; p_moi_khoi = true tìm cả khối khác (TA thêm tại chỗ). Chỉ HS đang học.
create or replace function public.fn_onthi_hs_tim(p_dot uuid, p_q text, p_limit int default 30, p_moi_khoi boolean default false) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare v_q text := btrim(coalesce(p_q, '')); d record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if length(v_q) < 2 then return '[]'::jsonb; end if;
  select * into d from bo_tro_on_thi_dot where id = p_dot;
  return coalesce((select jsonb_agg(x.j order by x.ho_ten) from (
    select h.ho_ten, jsonb_build_object('hoc_sinh_id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'khoi', h.khoi,
      'lop', (select string_agg(l.ten_lop, ', ' order by l.ten_lop) from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc'),
      'so_ca_da_dk', (select count(*) from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.hoc_sinh_id = h.id and b.on_thi_dot_id = p_dot and b.trang_thai <> 'huy'),
      'da_di', exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.hoc_sinh_id = h.id and b.on_thi_dot_id = p_dot and b.trang_thai <> 'huy' and hh.diem_danh = 'co_mat')) as j
    from hoc_sinh h
    where h.trang_thai = 'dang_hoc' and (h.ho_ten ilike '%' || v_q || '%' or h.ma_hs ilike '%' || v_q || '%')
      and (coalesce(p_moi_khoi, false) or d.id is null or h.khoi = any (d.khoi))
    order by h.ho_ten limit greatest(1, least(coalesce(p_limit, 30), 100))) x), '[]'::jsonb);
end $$;

-- Trang thêm HS vào ca (theo id chọn từ ô tìm, và/hoặc dán danh sách mã HS). Chỉ HS đang học; HS đã có trong ca bỏ qua.
create or replace function public.fn_onthi_them_hs(p_buoi uuid, p_hs uuid[] default '{}', p_ma text[] default null) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare b record; d record; v_ids uuid[]; v_ma text[] := coalesce((select array_agg(distinct upper(btrim(m))) from unnest(coalesce(p_ma, '{}')) m where btrim(m) <> ''), '{}');
        v_them int := 0; v_co int := 0; v_khong_thay text[]; v_ngoai text[];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into b from buoi_hoc where id = p_buoi and loai = 'bo_tro_on_thi';
  if b.id is null then raise exception 'Không phải ca ôn thi.'; end if;
  if b.trang_thai = 'huy' then raise exception 'Ca đã huỷ.'; end if;
  if b.danh_gia_xong_at is not null then raise exception 'Ca đã hoàn tất — không thêm em được.'; end if;
  select * into d from bo_tro_on_thi_dot where id = b.on_thi_dot_id;
  select array_agg(distinct x) into v_ids from (
    select unnest(coalesce(p_hs, '{}')) as x
    union select h.id from hoc_sinh h where upper(h.ma_hs) = any (v_ma)) s
   where exists (select 1 from hoc_sinh h2 where h2.id = s.x and h2.trang_thai = 'dang_hoc');
  -- mã nhập mà không ra HS đang học
  select coalesce(array_agg(m), '{}') into v_khong_thay from unnest(v_ma) m
    where not exists (select 1 from hoc_sinh h where upper(h.ma_hs) = m and h.trang_thai = 'dang_hoc');
  v_ids := coalesce(v_ids, '{}');
  select count(*) into v_co from buoi_hoc_hs where buoi_hoc_id = p_buoi and hoc_sinh_id = any (v_ids);
  insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id)
    select p_buoi, i from unnest(v_ids) i where not exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = p_buoi and hh.hoc_sinh_id = i);
  get diagnostics v_them = row_count;
  select coalesce(array_agg(h.ho_ten || ' (K' || coalesce(h.khoi, '?') || ')' order by h.ho_ten), '{}') into v_ngoai
    from hoc_sinh h where h.id = any (v_ids) and not (h.khoi = any (d.khoi));
  return jsonb_build_object('them', v_them, 'da_co', v_co, 'khong_thay', to_jsonb(v_khong_thay), 'ngoai_khoi', to_jsonb(v_ngoai));
end $$;

-- Gỡ em khỏi ca (chưa điểm danh). Đã có mặt/vắng thì không gỡ — giữ vết.
create or replace function public.fn_onthi_go_hs(p_buoi uuid, p_hs uuid) returns void
language plpgsql security definer set search_path to 'public' as $$
declare hh record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not exists (select 1 from buoi_hoc where id = p_buoi and loai = 'bo_tro_on_thi') then raise exception 'Không phải ca ôn thi.'; end if;
  select * into hh from buoi_hoc_hs where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hs;
  if hh.id is null then return; end if;
  if hh.diem_danh is not null then raise exception 'Em đã được điểm danh — không gỡ khỏi ca được.'; end if;
  delete from buoi_hoc_hs where id = hh.id;
end $$;

-- Đổi ca: chuyển em từ ca này sang ca khác (cùng đợt hoặc khác đợt), chỉ khi chưa điểm danh.
create or replace function public.fn_onthi_doi_ca(p_hs uuid, p_tu_buoi uuid, p_den_buoi uuid) returns void
language plpgsql security definer set search_path to 'public' as $$
declare hh record; b record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into hh from buoi_hoc_hs where buoi_hoc_id = p_tu_buoi and hoc_sinh_id = p_hs;
  if hh.id is null then raise exception 'Em không có trong ca cũ.'; end if;
  if hh.diem_danh is not null then raise exception 'Em đã được điểm danh ở ca cũ — không đổi ca được.'; end if;
  select * into b from buoi_hoc where id = p_den_buoi and loai = 'bo_tro_on_thi';
  if b.id is null or b.trang_thai = 'huy' or b.danh_gia_xong_at is not null then raise exception 'Ca mới không còn nhận em.'; end if;
  delete from buoi_hoc_hs where id = hh.id;
  insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id) values (p_den_buoi, p_hs) on conflict (buoi_hoc_id, hoc_sinh_id) do nothing;
end $$;

-- ============ 6. Phía TA ============
-- Việc của TA: ca ôn thi mình đứng (admin: mọi ca). Hôm nay ± 7 ngày; ca đã hoàn tất chỉ hiện hôm nay.
create or replace function public.fn_onthi_viec_cua_toi() returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_today date := public._btyeu_today();
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen(); v_admin := coalesce(v_admin, false);
  return jsonb_build_object('ca', coalesce((select jsonb_agg(x.j order by x.ngay, x.gio nulls last) from (
    select b.ngay, b.gio_bat_dau as gio, jsonb_build_object(
      'buoi_id', b.id, 'dot_id', d.id, 'dot_ten', d.ten, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong,
      'hoan_tat', b.danh_gia_xong_at is not null,
      'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'hoc_sinh_id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'khoi', h.khoi, 'diem_danh', hh.diem_danh, 'khong_dk', hh.on_thi_khong_dk,
              'bao_dong', (select bd.noi_dung from bo_tro_on_thi_bao_dong bd where bd.buoi_hoc_id = b.id and bd.hoc_sinh_id = h.id)) order by h.ho_ten)
            from buoi_hoc_hs hh join hoc_sinh h on h.id = hh.hoc_sinh_id where hh.buoi_hoc_id = b.id), '[]'::jsonb)) as j
    from buoi_hoc b join bo_tro_on_thi_dot d on d.id = b.on_thi_dot_id
    where b.loai = 'bo_tro_on_thi' and b.trang_thai = 'mo' and (v_admin or b.nguoi_day_tg = v_ns)
      and b.ngay between v_today - 7 and v_today + 7 and (b.danh_gia_xong_at is null or b.ngay = v_today)) x), '[]'::jsonb));
end $$;

-- Kiểm quyền TA/admin trên 1 ca ôn thi còn mở (dùng chung cho các hàm TA).
create or replace function public._onthi_ca_cua_ta(p_buoi uuid) returns buoi_hoc
language plpgsql stable security definer set search_path to 'public' as $$
declare b buoi_hoc; v_ns uuid := public._btyeu_my_ns(); v_admin boolean;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from buoi_hoc where id = p_buoi and loai = 'bo_tro_on_thi';
  if b.id is null then raise exception 'Không phải ca ôn thi.'; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ trợ giảng đứng ca (hoặc admin).'; end if;
  if b.trang_thai = 'huy' then raise exception 'Ca đã huỷ.'; end if;
  return b;
end $$;

create or replace function public.fn_onthi_diem_danh(p_buoi uuid, p_hs uuid, p_tt text) returns void
language plpgsql security definer set search_path to 'public' as $$
declare b buoi_hoc;
begin
  b := public._onthi_ca_cua_ta(p_buoi);
  if b.danh_gia_xong_at is not null then raise exception 'Ca đã hoàn tất.'; end if;
  if p_tt is not null and p_tt not in ('co_mat', 'vang') then raise exception 'Điểm danh: có mặt hoặc vắng.'; end if;
  if b.ngay > public._btyeu_today() then raise exception 'Ca chưa tới ngày — chưa điểm danh được.'; end if;
  if p_tt is distinct from 'co_mat' and exists (select 1 from bo_tro_on_thi_bao_dong where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hs) then
    raise exception 'Em đang có báo động — xoá báo động trước khi đổi điểm danh.'; end if;
  update buoi_hoc_hs set diem_danh = p_tt where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hs;
  if not found then raise exception 'Em không có trong ca.'; end if;
end $$;

-- TA thêm em đến mà chưa đăng ký (đánh dấu đến-không-đăng-ký), có mặt luôn.
create or replace function public.fn_onthi_them_tai_cho(p_buoi uuid, p_hs uuid) returns void
language plpgsql security definer set search_path to 'public' as $$
declare b buoi_hoc;
begin
  b := public._onthi_ca_cua_ta(p_buoi);
  if b.danh_gia_xong_at is not null then raise exception 'Ca đã hoàn tất.'; end if;
  if b.ngay > public._btyeu_today() then raise exception 'Ca chưa tới ngày.'; end if;
  if not exists (select 1 from hoc_sinh where id = p_hs and trang_thai = 'dang_hoc') then raise exception 'Học sinh không đang học.'; end if;
  insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, diem_danh, on_thi_khong_dk) values (p_buoi, p_hs, 'co_mat', true)
    on conflict (buoi_hoc_id, hoc_sinh_id) do update set diem_danh = 'co_mat';
end $$;

-- Báo động cuối giờ (TA nhập tay, lời văn). Chỉ em CÓ MẶT. Nội dung rỗng = gỡ báo động. Sửa sau khi Trang xử lý ⇒ mở lại.
create or replace function public.fn_onthi_bao_dong_luu(p_buoi uuid, p_hs uuid, p_noi_dung text) returns void
language plpgsql security definer set search_path to 'public' as $$
declare b buoi_hoc; v_nd text := nullif(btrim(coalesce(p_noi_dung, '')), ''); v_ns uuid := public._btyeu_my_ns();
begin
  b := public._onthi_ca_cua_ta(p_buoi);
  if v_nd is null then delete from bo_tro_on_thi_bao_dong where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hs; return; end if;
  if not exists (select 1 from buoi_hoc_hs where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hs and diem_danh = 'co_mat') then
    raise exception 'Chỉ báo động em đã được điểm danh CÓ MẶT.'; end if;
  insert into bo_tro_on_thi_bao_dong (buoi_hoc_id, hoc_sinh_id, noi_dung, nguoi_bao) values (p_buoi, p_hs, v_nd, v_ns)
    on conflict (buoi_hoc_id, hoc_sinh_id) do update
      set noi_dung = excluded.noi_dung, nguoi_bao = excluded.nguoi_bao, updated_at = now(),
          trang_thai = case when bo_tro_on_thi_bao_dong.noi_dung is distinct from excluded.noi_dung then 'moi' else bo_tro_on_thi_bao_dong.trang_thai end;
end $$;

-- Hoàn tất ca: mọi em phải được điểm danh (có mặt hoặc vắng) — để thống kê "không đi được" đúng.
create or replace function public.fn_onthi_ca_hoan_tat(p_buoi uuid) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare b buoi_hoc; v_chua int;
begin
  b := public._onthi_ca_cua_ta(p_buoi);
  if b.danh_gia_xong_at is not null then return jsonb_build_object('da_xong', true); end if;
  select count(*) into v_chua from buoi_hoc_hs where buoi_hoc_id = p_buoi and diem_danh is null;
  if v_chua > 0 then raise exception 'Còn % em chưa điểm danh — điểm danh hết (có mặt/vắng) rồi mới hoàn tất.', v_chua; end if;
  update buoi_hoc set danh_gia_xong_at = now(), updated_at = now() where id = p_buoi;
  return jsonb_build_object('da_xong', true);
end $$;

-- ============ 7. Báo động về ERP của Trang ============
create or replace function public.fn_onthi_bao_dong_ds(p_dot uuid default null, p_trang_thai text default null) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  return coalesce((select jsonb_agg(x.j order by x.tao desc) from (
    select bd.created_at as tao, jsonb_build_object(
      'id', bd.id, 'buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'phong', b.phong, 'dot_id', d.id, 'dot_ten', d.ten,
      'hoc_sinh_id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'khoi', h.khoi,
      'lop', (select string_agg(l.ten_lop, ', ' order by l.ten_lop) from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc'),
      'noi_dung', bd.noi_dung, 'ta_ten', (select n.ho_ten from nhan_su n where n.id = bd.nguoi_bao), 'tao_luc', bd.created_at,
      'trang_thai', bd.trang_thai, 'xu_ly_ghi_chu', bd.xu_ly_ghi_chu, 'xu_ly_ten', (select n.ho_ten from nhan_su n where n.id = bd.xu_ly_boi), 'xu_ly_at', bd.xu_ly_at) as j
    from bo_tro_on_thi_bao_dong bd
    join buoi_hoc b on b.id = bd.buoi_hoc_id join bo_tro_on_thi_dot d on d.id = b.on_thi_dot_id join hoc_sinh h on h.id = bd.hoc_sinh_id
    where (p_dot is null or d.id = p_dot) and (p_trang_thai is null or bd.trang_thai = p_trang_thai)
    order by bd.created_at desc limit 500) x), '[]'::jsonb);
end $$;

create or replace function public.fn_onthi_bao_dong_xu_ly(p_id uuid, p_da_xu_ly boolean, p_ghi_chu text default null) returns void
language plpgsql security definer set search_path to 'public' as $$
declare v_ns uuid := public._btyeu_my_ns();
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  update bo_tro_on_thi_bao_dong set
    trang_thai = case when coalesce(p_da_xu_ly, true) then 'da_xu_ly' else 'moi' end,
    xu_ly_ghi_chu = case when coalesce(p_da_xu_ly, true) then nullif(btrim(coalesce(p_ghi_chu, '')), '') else null end,
    xu_ly_boi = case when coalesce(p_da_xu_ly, true) then v_ns else null end,
    xu_ly_at = case when coalesce(p_da_xu_ly, true) then now() else null end,
    updated_at = now()
   where id = p_id;
  if not found then raise exception 'Không thấy báo động.'; end if;
end $$;

-- ============ 8. Thống kê (ERP) ============
-- Mẫu số = HS ĐANG HỌC thuộc khối của đợt (lọc thêm 1 khối được). Mỗi em vào ĐÚNG 1 nhóm, ưu tiên:
--   đã đi (≥1 lượt có mặt) › chờ đi (có ca chưa diễn ra, chưa điểm danh) › không đi được (đã đăng ký, không có mặt, không còn ca chờ — gồm vắng
--   và ca đã qua mà TA chưa điểm danh) › chưa đi (không đăng ký ca nào). Ca huỷ không tính. `thieu_diem_danh` ⊂ không đi được (để Trang nhắc TA).
create or replace function public._onthi_phan_nhom(p_dot uuid, p_khoi text)
returns table(hoc_sinh_id uuid, ho_ten text, ma_hs text, khoi text, nhom text, thieu_dd boolean)
language sql stable security definer set search_path to 'public' as $$
  with d as (select * from bo_tro_on_thi_dot where id = p_dot),
  hs as (select h.id, h.ho_ten, h.ma_hs, h.khoi from hoc_sinh h, d where h.trang_thai = 'dang_hoc' and h.khoi = any (d.khoi) and (p_khoi is null or h.khoi = p_khoi)),
  reg as (select hh.hoc_sinh_id, hh.diem_danh, b.ngay, b.danh_gia_xong_at from buoi_hoc_hs hh
            join buoi_hoc b on b.id = hh.buoi_hoc_id and b.loai = 'bo_tro_on_thi' and b.on_thi_dot_id = p_dot and b.trang_thai <> 'huy')
  select hs.id, hs.ho_ten, hs.ma_hs, hs.khoi,
    case
      when exists (select 1 from reg r where r.hoc_sinh_id = hs.id and r.diem_danh = 'co_mat') then 'da_di'
      when exists (select 1 from reg r where r.hoc_sinh_id = hs.id and r.diem_danh is null and r.ngay >= public._btyeu_today() and r.danh_gia_xong_at is null) then 'cho_di'
      when exists (select 1 from reg r where r.hoc_sinh_id = hs.id) then 'khong_di_duoc'
      else 'chua_di' end,
    (not exists (select 1 from reg r where r.hoc_sinh_id = hs.id and (r.diem_danh = 'co_mat' or (r.diem_danh is null and r.ngay >= public._btyeu_today() and r.danh_gia_xong_at is null)))
      and exists (select 1 from reg r where r.hoc_sinh_id = hs.id and r.diem_danh is null and r.ngay < public._btyeu_today()))
  from hs
$$;

create or replace function public.fn_onthi_thong_ke(p_dot uuid, p_khoi text default null) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not exists (select 1 from bo_tro_on_thi_dot where id = p_dot) then raise exception 'Không thấy đợt.'; end if;
  with n as (select * from public._onthi_phan_nhom(p_dot, nullif(btrim(coalesce(p_khoi, '')), '')))
  select jsonb_build_object(
    'tong', (select count(*) from n),
    'da_di', (select count(*) from n where nhom = 'da_di'),
    'cho_di', (select count(*) from n where nhom = 'cho_di'),
    'khong_di_duoc', (select count(*) from n where nhom = 'khong_di_duoc'),
    'chua_di', (select count(*) from n where nhom = 'chua_di'),
    'thieu_diem_danh', (select count(*) from n where thieu_dd),
    'theo_khoi', coalesce((select jsonb_agg(jsonb_build_object('khoi', k.khoi, 'tong', k.tong, 'da_di', k.da_di, 'cho_di', k.cho_di, 'khong_di_duoc', k.khong_di_duoc, 'chua_di', k.chua_di)
        order by nullif(regexp_replace(k.khoi, '\D', '', 'g'), '')::int nulls last, k.khoi)
      from (select khoi, count(*) tong, count(*) filter (where nhom = 'da_di') da_di, count(*) filter (where nhom = 'cho_di') cho_di,
                   count(*) filter (where nhom = 'khong_di_duoc') khong_di_duoc, count(*) filter (where nhom = 'chua_di') chua_di from n group by khoi) k), '[]'::jsonb),
    'so_ca', (select count(*) from buoi_hoc b where b.on_thi_dot_id = p_dot and b.trang_thai <> 'huy'),
    'so_luot_co_mat', (select count(*) from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                        where b.on_thi_dot_id = p_dot and b.trang_thai <> 'huy' and hh.diem_danh = 'co_mat'),
    'ngoai_mau_so', case when nullif(btrim(coalesce(p_khoi, '')), '') is null then (select count(distinct hh.hoc_sinh_id) from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                        where b.on_thi_dot_id = p_dot and b.trang_thai <> 'huy' and hh.diem_danh = 'co_mat' and hh.hoc_sinh_id not in (select hoc_sinh_id from n)) else null end
  ) into v;
  return v;
end $$;

-- Danh sách tên của 1 nhóm (bấm vào số để nhắc em).
create or replace function public.fn_onthi_thong_ke_ds(p_dot uuid, p_khoi text default null, p_nhom text default 'chua_di') returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_nhom not in ('da_di', 'cho_di', 'khong_di_duoc', 'chua_di') then raise exception 'Nhóm không hợp lệ.'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'hoc_sinh_id', n.hoc_sinh_id, 'ho_ten', n.ho_ten, 'ma_hs', n.ma_hs, 'khoi', n.khoi, 'thieu_diem_danh', n.thieu_dd,
      'lop', (select string_agg(l.ten_lop, ', ' order by l.ten_lop) from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = n.hoc_sinh_id and hl.trang_thai = 'dang_hoc'),
      'ca', coalesce((select string_agg(to_char(b.ngay, 'DD/MM') || coalesce(' ' || to_char(b.gio_bat_dau, 'HH24:MI'), '') || coalesce(' ' || b.phong, '')
                 || case hh.diem_danh when 'co_mat' then ' ✓' when 'vang' then ' ✗' when 'vang_phep' then ' ✗' else '' end, ' · ' order by b.ngay, b.gio_bat_dau)
               from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
               where hh.hoc_sinh_id = n.hoc_sinh_id and b.on_thi_dot_id = p_dot and b.trang_thai <> 'huy'), '')
    ) order by nullif(regexp_replace(n.khoi, '\D', '', 'g'), '')::int nulls last, n.khoi, n.ho_ten)
    from public._onthi_phan_nhom(p_dot, nullif(btrim(coalesce(p_khoi, '')), '')) n where n.nhom = p_nhom), '[]'::jsonb);
end $$;

-- ============ 9. Công TA: việc PHÁT SINH, mức riêng ============
-- ta_loai_viec 'bo_tro_on_thi' đã có từ mig 202610122210 ở nhóm package/bo_tro (tính vào 8 giờ bổ trợ). Thùy 23/10: "mức riêng, là việc phát sinh"
-- ⇒ chuyển sang ngoai_package: lương = số giờ × ta_don_gia.gia_bo_tro_on_thi. CHƯA có dòng đơn giá ⇒ trả 0 và hiện cờ chua_don_gia (như chấm thi) tới khi CEO thêm.
update public.ta_loai_viec set ten = 'Bổ trợ ôn thi (phát sinh)', nhom = 'ngoai_package', tinh_vao = 'khac', don_vi = 'gio', can_lop = false, can_hs = false
 where ma = 'bo_tro_on_thi';

revoke execute on function public.fn_onthi_dot_luu(uuid, text, text, int, text[], date, date, text), public.fn_onthi_dot_ds(),
  public.fn_onthi_ca_luu(uuid, uuid, date, time, time, text, uuid), public.fn_onthi_ca_huy(uuid, text), public.fn_onthi_ca_ds(uuid),
  public.fn_onthi_hs_tim(uuid, text, int, boolean), public.fn_onthi_them_hs(uuid, uuid[], text[]), public.fn_onthi_go_hs(uuid, uuid),
  public.fn_onthi_doi_ca(uuid, uuid, uuid), public.fn_onthi_viec_cua_toi(), public._onthi_ca_cua_ta(uuid), public.fn_onthi_diem_danh(uuid, uuid, text),
  public.fn_onthi_them_tai_cho(uuid, uuid), public.fn_onthi_bao_dong_luu(uuid, uuid, text), public.fn_onthi_ca_hoan_tat(uuid),
  public.fn_onthi_bao_dong_ds(uuid, text), public.fn_onthi_bao_dong_xu_ly(uuid, boolean, text), public._onthi_phan_nhom(uuid, text),
  public.fn_onthi_thong_ke(uuid, text), public.fn_onthi_thong_ke_ds(uuid, text, text) from public, anon;
grant execute on function public.fn_onthi_dot_luu(uuid, text, text, int, text[], date, date, text), public.fn_onthi_dot_ds(),
  public.fn_onthi_ca_luu(uuid, uuid, date, time, time, text, uuid), public.fn_onthi_ca_huy(uuid, text), public.fn_onthi_ca_ds(uuid),
  public.fn_onthi_hs_tim(uuid, text, int, boolean), public.fn_onthi_them_hs(uuid, uuid[], text[]), public.fn_onthi_go_hs(uuid, uuid),
  public.fn_onthi_doi_ca(uuid, uuid, uuid), public.fn_onthi_viec_cua_toi(), public.fn_onthi_diem_danh(uuid, uuid, text),
  public.fn_onthi_them_tai_cho(uuid, uuid), public.fn_onthi_bao_dong_luu(uuid, uuid, text), public.fn_onthi_ca_hoan_tat(uuid),
  public.fn_onthi_bao_dong_ds(uuid, text), public.fn_onthi_bao_dong_xu_ly(uuid, boolean, text),
  public.fn_onthi_thong_ke(uuid, text), public.fn_onthi_thong_ke_ds(uuid, text, text) to authenticated;

-- ============ 10. Nối ôn thi vào hàm công TA + push (dựng từ định nghĩa đang chạy) ============
CREATE OR REPLACE FUNCTION public._ta_buoi_thieu_cong(p_tu date, p_den date)
 RETURNS TABLE(loai text, ngay date, lop_id uuid, ten text, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, buoi_hoc_id uuid, ca_bo_tro_id uuid, nhan_su_id uuid, nguoi_phu_trach text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
        v_gio time := (now() at time zone 'Asia/Ho_Chi_Minh')::time;
        v_tu date := greatest(p_tu, public._ta_moc_cham_cong());
        v_den date := least(coalesce(p_den, p_tu), v_homnay);
begin
  return query
  select 'buoi'::text, b.ngay, b.lop_id, l.ten_lop, b.gio_bat_dau, b.gio_ket_thuc, b.id, null::uuid, ai.id, ai.ho_ten
    from buoi_hoc b join lop l on l.id = b.lop_id
    left join lateral (select n.id, n.ho_ten from public._ta_tg_tai(b.ngay, b.lop_id) t join nhan_su n on n.id = t.nhan_su_id
                        order by t.la_chinh desc, n.ho_ten limit 1) ai on true
   where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
     and (ai.id is null or not public._la_gv_kiem_ta(ai.id))   -- Thùy 15/10: GV kiêm TA không chấm công
     and (b.ngay < v_homnay or b.gio_ket_thuc <= v_gio)
     and not exists (select 1 from ta_cong_viec cv join ta_loai_viec lv on lv.ma = cv.loai_viec
                      where cv.lop_id = b.lop_id and cv.ngay = b.ngay and lv.tinh_vao in ('tg', 'trong_thi') and cv.trang_thai <> 'tu_choi')
  union all
  select 'ca'::text, c.ngay, null::uuid, concat_ws(' ', 'Trực bổ trợ', c.mon, c.khoi), c.gio_bat_dau, c.gio_ket_thuc, null::uuid, c.id,
         c.nhan_su_id, (select n.ho_ten from nhan_su n where n.id = c.nhan_su_id)
    from ca_bo_tro c
   where c.trang_thai = 'mo' and c.ngay between v_tu and v_den and not public._la_gv_kiem_ta(c.nhan_su_id)
     and (c.ngay < v_homnay or c.gio_ket_thuc <= v_gio)
     and not exists (select 1 from ta_cong_viec cv
                      where cv.trang_thai <> 'tu_choi' and cv.ngay = c.ngay
                        and (cv.ca_bo_tro_id = c.id or (cv.loai_viec = 'bo_tro_dinh_ki' and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id))))
  union all
  -- Buổi bổ trợ TA đứng lớp đã diễn ra, có em có mặt, chưa ai ghi công; buổi nằm trong ca trực của chính người đó thì ca trực đã bao.
  select case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' when 'bo_tro_hinh' then 'bo_tro_yeu' when 'bo_tro_on_thi' then 'bo_tro_on_thi' else 'bo_tro_duoi' end,
         b.ngay, l.id, (case b.loai when 'bu' then 'Buổi bù' when 'bo_tro_yeu' then 'Bổ trợ yếu' when 'bo_tro_hinh' then 'Bổ trợ Hình' when 'bo_tro_on_thi' then 'Bổ trợ ôn thi' else 'Bổ trợ đuổi' end) || coalesce(' ' || l.ten_lop, ''),
         b.gio_bat_dau, b.gio_ket_thuc, b.id, null::uuid, n.id, n.ho_ten
    from buoi_hoc b
    join nhan_su n on n.id = coalesce(b.nguoi_day_tg, b.nguoi_day)
    left join lop l on l.id = public._ta_lop_cua_buoi(b.id)
   where b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh', 'bo_tro_on_thi') and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
     and not public._la_gv_kiem_ta(n.id)
     and (b.ngay < v_homnay or b.gio_ket_thuc <= v_gio)
     and exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = b.id and x.diem_danh = 'co_mat')
     and not exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and n.id in (c.nhan_su_id, c.nhan_su_2_id))
     and not exists (select 1 from ta_cong_viec cv where cv.buoi_hoc_id = b.id and cv.trang_thai <> 'tu_choi')
   order by 2, 5 nulls last;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ta_hom_nay(p_at timestamp with time zone DEFAULT now())
 RETURNS TABLE(nguon text, loai_viec text, lop_id uuid, ten_lop text, buoi_hoc_id uuid, ca_bo_tro_id uuid, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, dang_dien_ra boolean, da_khai boolean)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ns uuid := public.current_nhan_su_id();
        v_ngay date := (p_at at time zone 'Asia/Ho_Chi_Minh')::date;
        v_gio time := (p_at at time zone 'Asia/Ho_Chi_Minh')::time;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  return query
  with k1 as (
    -- buổi thường của lớp mình TẠI NGÀY ĐÓ; buổi có kỳ thi ⇒ gợi ý trông thi
    select 'buoi_thuong'::text as nguon,
           case when exists (select 1 from ky_thi kt where kt.buoi_hoc_id = b.id) then 'trong_thi' else 'tro_giang' end::text as loai_viec,
           b.lop_id, l.ten_lop, b.id as buoi_hoc_id, null::uuid as ca_bo_tro_id, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b join lop l on l.id = b.lop_id
      join public._ta_tg_tai(v_ngay, null, v_ns) pc on pc.lop_id = b.lop_id
     where b.ngay = v_ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
    union all
    -- ca trực bổ trợ khối đã xếp cho mình
    select 'ca_bo_tro', 'bo_tro_dinh_ki', null::uuid, concat_ws(' ', c.mon, c.khoi), null::uuid, c.id, c.gio_bat_dau, c.gio_ket_thuc
      from ca_bo_tro c
     where c.ngay = v_ngay and c.trang_thai = 'mo' and v_ns in (c.nhan_su_id, c.nhan_su_2_id)
    union all
    -- buổi bù / yếu / đuổi mình dạy
    select 'buoi_bo_tro',
           case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' when 'bo_tro_hinh' then 'bo_tro_yeu' when 'bo_tro_on_thi' then 'bo_tro_on_thi' else 'bo_tro_duoi' end,
           l.id, l.ten_lop, b.id, null::uuid, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b left join lop l on l.id = public._ta_lop_cua_buoi(b.id)
     where b.ngay = v_ngay and b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh', 'bo_tro_on_thi') and b.trang_thai <> 'huy' and v_ns in (b.nguoi_day, b.nguoi_day_tg)
       and not exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and v_ns in (c.nhan_su_id, c.nhan_su_2_id))   -- ca yếu nằm trong ca trực của mình: ca trực đã bao
  )
  select x.nguon, x.loai_viec, x.lop_id, x.ten_lop, x.buoi_hoc_id, x.ca_bo_tro_id, x.gio_bat_dau, x.gio_ket_thuc,
         (x.gio_bat_dau is not null and x.gio_ket_thuc is not null
            and v_gio between x.gio_bat_dau - interval '30 minutes' and x.gio_ket_thuc + interval '30 minutes'),
         exists (select 1 from ta_cong_viec cv where cv.nhan_su_id = v_ns and cv.trang_thai <> 'tu_choi'
                   and ((x.buoi_hoc_id is not null and cv.buoi_hoc_id = x.buoi_hoc_id and cv.loai_viec = x.loai_viec)
                     or (x.ca_bo_tro_id is not null and cv.ca_bo_tro_id = x.ca_bo_tro_id)))
    from k1 x
   order by x.gio_bat_dau nulls last;
end $function$;

CREATE OR REPLACE FUNCTION public._ta_doi_chieu(p_tu date, p_den date, p_ns uuid)
 RETURNS TABLE(loai_dong text, id uuid, cham_cong_id uuid, nhan_su_id uuid, ho_ten text, ngay date, vao_at timestamp with time zone, ra_at timestamp with time zone, vao_chot timestamp with time zone, ra_chot timestamp with time zone, quen_ra boolean, khai_bu boolean, nguon text, loai_viec text, ten_loai text, lop_id uuid, ten_lop text, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, hoc_sinh text, ghi_chu text, khop boolean, co text[], lam_ho text, duyet text, ly_do_duyet text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare v_den date := coalesce(p_den, p_tu);
        v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  return query
  -- CA CÓ MẶT
  select 'ca'::text, cc.id, cc.id, cc.nhan_su_id, ns.ho_ten, cc.ngay, cc.vao_at, cc.ra_at, cc.vao_chot, cc.ra_chot,
         (cc.ra_at is null and cc.ra_chot is null and cc.ngay < v_homnay),
         cc.khai_bu, cc.nguon, null::text, null::text, null::uuid, null::text, null::time, null::time, null::text, ''::text,
         null::boolean,
         array_remove(array[
           case when cc.ra_at is null and cc.ra_chot is null and cc.ngay < v_homnay then 'quen_ra' end,
           case when cc.khai_bu then 'khai_bu' end,
           case when cc.nguon = 'nhap_ho' then 'nhap_ho' end,
           case when not exists (select 1 from ta_cong_viec v where v.cham_cong_id = cc.id and v.trang_thai <> 'tu_choi') then 'ca_khong_viec' end
         ], null),
         null::text, cc.duyet, cc.ly_do_duyet
    from ta_cham_cong cc join nhan_su ns on ns.id = cc.nhan_su_id
   where cc.ngay between p_tu and v_den and (p_ns is null or cc.nhan_su_id = p_ns)
  union all
  -- VIỆC
  select 'viec'::text, cv.id, cv.cham_cong_id, cv.nhan_su_id, ns.ho_ten, cv.ngay, cc.vao_at, cc.ra_at, cc.vao_chot, cc.ra_chot,
         false, cv.khai_bu, cv.nguon, cv.loai_viec, lv.ten, cv.lop_id, l.ten_lop, cv.gio_bat_dau, cv.gio_ket_thuc, cv.hoc_sinh, cv.ghi_chu,
         kq.khop,
         array_remove(array[
           case when lv.tinh_vao = 'tg' and not kq.khop and exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                        and b.loai = 'thuong' and b.trang_thai = 'huy') then 'buoi_huy' end,
           case when lv.tinh_vao = 'tg' and not exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                        and b.loai = 'thuong') then 'khong_co_buoi' end,
           case when lv.tinh_vao = 'tg' and exists (select 1 from ta_cong_viec o join ta_loai_viec lo on lo.ma = o.loai_viec
                        where o.lop_id = cv.lop_id and o.ngay = cv.ngay and lo.tinh_vao = 'tg' and o.trang_thai <> 'tu_choi'
                          and o.nhan_su_id <> cv.nhan_su_id) then 'hai_ta_cung_buoi' end,
           case when cc.id is not null and cv.gio_bat_dau is not null
                     and cv.gio_bat_dau < (coalesce(cc.vao_chot, cc.vao_at) at time zone 'Asia/Ho_Chi_Minh')::time - interval '15 minutes' then 'truoc_gio_vao' end,
           case when cc.id is not null and cv.gio_ket_thuc is not null and coalesce(cc.ra_chot, cc.ra_at) is not null
                     and cv.gio_ket_thuc > (coalesce(cc.ra_chot, cc.ra_at) at time zone 'Asia/Ho_Chi_Minh')::time + interval '15 minutes' then 'sau_gio_ra' end,
           case when cv.gio_bat_dau is not null and cv.gio_ket_thuc is not null and exists (select 1 from ta_cong_viec o
                        where o.nhan_su_id = cv.nhan_su_id and o.ngay = cv.ngay and o.id <> cv.id and o.trang_thai <> 'tu_choi'
                          and o.gio_bat_dau < cv.gio_ket_thuc and o.gio_ket_thuc > cv.gio_bat_dau) then 'trung_gio' end,
           case when cv.gio_bat_dau < time '07:00' or cv.gio_ket_thuc > time '22:30' then 'ngoai_gio' end,
           case when lv.don_vi = 'gio' and (cv.gio_bat_dau is null or cv.gio_ket_thuc is null) then 'thieu_gio' end,
           case when lv.nhom = 'ngoai_package' and not exists (select 1 from ta_don_gia d where d.ma = 'gia_' || lv.ma and d.hieu_luc_tu <= cv.ngay) then 'chua_don_gia' end,
           case when cv.khai_bu then 'khai_bu' end,
           case when cv.nguon = 'nhap_ho' then 'nhap_ho' end,
           case when cc.id is not null and cc.duyet = 'tu_choi' then 'ca_bi_tu_choi' end,
           -- trợ giảng ở lớp mà NGÀY ĐÓ chưa có TA nào được phân công
           case when lv.tinh_vao = 'tg' and cv.lop_id is not null
                     and not exists (select 1 from public._ta_tg_tai(cv.ngay, cv.lop_id)) then 'lop_chua_co_ta' end
         ], null),
         case when lv.tinh_vao = 'tg' and cv.lop_id is not null
                   and not exists (select 1 from public._ta_tg_tai(cv.ngay, cv.lop_id, cv.nhan_su_id))
                then (select n2.ho_ten from public._ta_tg_tai(cv.ngay, cv.lop_id) t join nhan_su n2 on n2.id = t.nhan_su_id
                       order by t.la_chinh desc, n2.ho_ten limit 1)
              when cv.ca_bo_tro_id is not null and not exists (select 1 from ca_bo_tro c where c.id = cv.ca_bo_tro_id and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id))
                then (select n2.ho_ten from ca_bo_tro c join nhan_su n2 on n2.id = c.nhan_su_id where c.id = cv.ca_bo_tro_id)
         end,
         cv.trang_thai, cv.ly_do_duyet
    from ta_cong_viec cv
    join ta_loai_viec lv on lv.ma = cv.loai_viec
    join nhan_su ns on ns.id = cv.nhan_su_id
    left join lop l on l.id = cv.lop_id
    left join ta_cham_cong cc on cc.id = cv.cham_cong_id
    cross join lateral (select case
        when lv.tinh_vao = 'tg' then exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                                              and b.loai = 'thuong' and b.trang_thai <> 'huy')
        when cv.loai_viec = 'bo_tro_dinh_ki' then exists (select 1 from ca_bo_tro c where c.ngay = cv.ngay and c.trang_thai = 'mo'
                                              and (c.id = cv.ca_bo_tro_id or cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)))
        when cv.loai_viec in ('bo_tro_bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_on_thi') then exists (
              select 1 from buoi_hoc b
               where b.ngay = cv.ngay and b.trang_thai <> 'huy'
                 and b.loai = any (case cv.loai_viec when 'bo_tro_bu' then array['bu'] when 'bo_tro_on_thi' then array['bo_tro_on_thi'] when 'bo_tro_yeu' then array['bo_tro_yeu', 'bo_tro_hinh'] else array['bo_tro_duoi'] end)
                 and (b.id = cv.buoi_hoc_id or b.nguoi_day = cv.nhan_su_id
                      or exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)))
                 and exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat'))
        when lv.tinh_vao = 'trong_thi' then exists (select 1 from buoi_hoc b join ky_thi kt on kt.buoi_hoc_id = b.id
                                              where b.lop_id = cv.lop_id and b.ngay = cv.ngay)
        else false end as khop) kq
   where cv.ngay between p_tu and v_den and (p_ns is null or cv.nhan_su_id = p_ns)
   order by 6, 5, 1, 18 nulls first;
end $function$;

CREATE OR REPLACE FUNCTION public._trg_ta_buoi_hoc_push()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare r record;
begin
  if NEW.loai = 'thuong' then
    if TG_OP = 'INSERT' or (TG_OP = 'UPDATE' and (
         NEW.ingame_dong_at is distinct from OLD.ingame_dong_at
         or NEW.et_dong_at is distinct from OLD.et_dong_at
         or NEW.btvn_dong_at is distinct from OLD.btvn_dong_at
       )) then
      for r in select nhan_su_id from phan_cong_lop where lop_id = NEW.lop_id and vai_tro = 'tg' loop
        perform public._push_bao_cap_nhat(r.nhan_su_id, 'ta');
      end loop;
    end if;
  elsif NEW.loai = 'bo_tro_yeu' then
    if TG_OP = 'INSERT' or (TG_OP = 'UPDATE' and NEW.danh_gia_xong_at is distinct from OLD.danh_gia_xong_at) then
      perform public._push_bao_cap_nhat(NEW.nguoi_day_tg, 'ta');
    end if;
  elsif NEW.loai = 'bo_tro_on_thi' then
    if NEW.nguoi_day_tg is not null and (TG_OP = 'INSERT' or NEW.nguoi_day_tg is distinct from OLD.nguoi_day_tg or NEW.trang_thai is distinct from OLD.trang_thai) then
      perform public._push_bao_cap_nhat(NEW.nguoi_day_tg, 'ta');
    end if;
  end if;
  return NEW;
end $function$;
