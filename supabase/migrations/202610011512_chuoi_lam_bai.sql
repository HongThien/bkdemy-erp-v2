-- ============================================================================
-- CHUỖI LÀM BÀI (spec-v1-app-hs.md §3 + hợp đồng §13.4 — Thùy chốt 01/10/2026)
--
-- • Ngày ĐƯỢC TÍNH = có ≥ 1 "lượt học thật" (public._luot_hoc_that — Tự luyện / Chủ đề / Thử thách; ET, BTVN không tính).
-- • MỘT chuỗi CHUNG mọi môn (Thùy 01/10). Chuỗi đo thói quen (như ví xu); mỗi lượt vẫn mang nhãn môn ở nguồn.
-- • SUY ĐỘNG, không lưu ô "chuỗi" (CLAUDE §1): đi từng ngày từ lượt học thật đầu tiên tới hôm nay (giờ VN):
--     học                → +1 ngày
--     ngày nghỉ (bảng chuoi_ngay_nghi: lễ/Tết/tuần thi theo khối) → không đứt, không cộng
--     lỡ                 → chờ SỬA 48 giờ: lượt THỪA (ngoài lượt giữ chính ngày đó) trong 2 ngày kế tiếp bù được ngày lỡ cũ nhất
--     hết 48 giờ chưa sửa → tự dùng THẺ ĐÓNG BĂNG (2 thẻ / tháng, không dồn) → hết thẻ thì ĐỨT
--     hôm nay chưa học   → "trống", chưa đứt
-- • Mốc: 3 · 7 · 14 · 30 · 50 · 100 · 200 · 365 (hoạt cảnh ở app; tin Thế giới làm ở migration riêng).
-- ============================================================================

-- ── 1. Ngày nghỉ của chuỗi (trung tâm nhập) ──
create table if not exists public.chuoi_ngay_nghi (
  id         uuid primary key default gen_random_uuid(),
  tu         date not null,
  den        date not null,
  khoi       text[] not null default '{}',   -- rỗng = MỌI khối (lễ/Tết); có giá trị = chỉ các khối đó (tuần thi ở trường)
  ly_do      text not null check (length(btrim(ly_do)) > 0),
  tao_boi    uuid default public.jwt_uid(),   -- tài khoản người nhập (jwt_uid — role migrate không đọc được schema auth)
  tao_at     timestamptz not null default now(),
  xoa_at     timestamptz,                    -- kho rác (CLAUDE §2): gỡ nhầm thì đặt xoa_at, không xoá cứng
  check (den >= tu and den - tu <= 60)
);
alter table public.chuoi_ngay_nghi enable row level security;
drop policy if exists chuoi_ngay_nghi_doc on public.chuoi_ngay_nghi;
create policy chuoi_ngay_nghi_doc on public.chuoi_ngay_nghi for select to authenticated using (true);
-- ghi CHỈ qua RPC dưới (security definer + co_quyen_ghi)

create or replace function public.fn_chuoi_ngay_nghi_ghi(p_tu date, p_den date, p_khoi text[], p_ly_do text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  if not public.co_quyen_ghi('huyhieu') then raise exception 'Chỉ quản trị gamification được đặt ngày nghỉ của chuỗi.'; end if;
  insert into chuoi_ngay_nghi (tu, den, khoi, ly_do) values (p_tu, p_den, coalesce(p_khoi, '{}'), p_ly_do) returning id into v;
  return v;
end $$;

create or replace function public.fn_chuoi_ngay_nghi_go(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.co_quyen_ghi('huyhieu') then raise exception 'Chỉ quản trị gamification được gỡ ngày nghỉ của chuỗi.'; end if;
  update chuoi_ngay_nghi set xoa_at = now() where id = p_id and xoa_at is null;
end $$;

-- ── 2. Bộ máy chuỗi của 1 em (nguồn DUY NHẤT — app, tin Thế giới, báo cáo đều đọc đây) ──
create or replace function public._chuoi_cua(p_hs uuid)
returns jsonb language plpgsql stable as $$
declare
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_khoi text;
  v_dem jsonb;            -- {ngay: số lượt học thật}
  v_nghi date[];
  v_start date;
  d date;
  c int;
  v_extra int;
  v_tt jsonb := '{}';     -- {ngay: trạng thái}
  v_cho date[] := '{}';   -- ngày lỡ đang chờ sửa (cũ → mới)
  v_the jsonb := '{}';    -- {yyyy-mm: số thẻ đã dùng}
  v_thang text;
  p date;
  v_so int := 0;
  v_ky_luc int := 0;
  v_chay int := 0;
  s text;
  v_moc int;
  v_bay jsonb := '[]';
  v_luot_hn int;
begin
  select h.khoi into v_khoi from hoc_sinh h where h.id = p_hs;
  select coalesce(jsonb_object_agg(x.ngay::text, x.n), '{}'), min(x.ngay) into v_dem, v_start
    from (select l.ngay, count(*) n from public._luot_hoc_that(p_hs, '-infinity', 'infinity') l where l.tinh group by l.ngay) x;
  select coalesce(array_agg(distinct g::date), '{}') into v_nghi
    from chuoi_ngay_nghi n, generate_series(n.tu, n.den, interval '1 day') g
    where n.xoa_at is null and (n.khoi = '{}' or v_khoi = any(n.khoi));
  v_luot_hn := coalesce((v_dem->>v_today::text)::int, 0);

  if v_start is not null then
    d := v_start;
    while d <= v_today loop
      c := coalesce((v_dem->>d::text)::int, 0);
      -- lượt thừa hôm nay sửa ngày lỡ cũ nhất còn trong cửa sổ 48 giờ
      v_extra := case when d = any(v_nghi) then c else greatest(c - 1, 0) end;
      while v_extra > 0 and cardinality(v_cho) > 0 and d - v_cho[1] <= 2 loop
        v_tt := v_tt || jsonb_build_object(v_cho[1]::text, 'sua');
        v_cho := v_cho[2:];
        v_extra := v_extra - 1;
      end loop;
      -- trạng thái chính ngày d
      if c >= 1 then v_tt := v_tt || jsonb_build_object(d::text, 'hoc');
      elsif d = any(v_nghi) then v_tt := v_tt || jsonb_build_object(d::text, 'nghi');
      elsif d = v_today then v_tt := v_tt || jsonb_build_object(d::text, 'trong');
      else v_tt := v_tt || jsonb_build_object(d::text, 'cho_sua'); v_cho := v_cho || d;
      end if;
      -- ngày lỡ hết cửa sổ (đã qua trọn d = p+2) ⇒ thẻ đóng băng hoặc đứt
      while cardinality(v_cho) > 0 and d - v_cho[1] >= 2 and d < v_today loop
        p := v_cho[1]; v_cho := v_cho[2:];
        v_thang := to_char(p, 'YYYY-MM');
        if coalesce((v_the->>v_thang)::int, 0) < 2 then
          v_the := v_the || jsonb_build_object(v_thang, coalesce((v_the->>v_thang)::int, 0) + 1);
          v_tt := v_tt || jsonb_build_object(p::text, 'dong_bang');
        else
          v_tt := v_tt || jsonb_build_object(p::text, 'dut');
        end if;
      end loop;
      d := d + 1;
    end loop;

    -- kỷ lục: chạy xuôi; chuỗi hiện tại: phần chạy cuối (ngày hoc/sua cộng, nghi/dong_bang/cho_sua/trong giữ, dut cắt)
    d := v_start;
    while d <= v_today loop
      s := v_tt->>d::text;
      if s in ('hoc', 'sua') then v_chay := v_chay + 1; v_ky_luc := greatest(v_ky_luc, v_chay);
      elsif s = 'dut' then v_chay := 0;
      end if;
      d := d + 1;
    end loop;
    v_so := v_chay;
  end if;

  select min(m) into v_moc from unnest(array[3, 7, 14, 30, 50, 100, 200, 365]) m where m > v_so;
  for d in select generate_series(v_today - 6, v_today, interval '1 day')::date loop
    s := coalesce(v_tt->>d::text, case when d = v_today then 'trong' else 'truoc' end);
    v_bay := v_bay || jsonb_build_object('ngay', d, 'trang_thai',
      case s when 'sua' then 'hoc' when 'truoc' then 'trong' else s end);
  end loop;

  return jsonb_build_object(
    'so_ngay', v_so,
    'hom_nay_da_tinh', coalesce(v_tt->>v_today::text, '') = 'hoc',
    'luot_hom_nay', v_luot_hn,
    'ky_luc', v_ky_luc,
    'the_dong_bang', 2 - coalesce((v_the->>to_char(v_today, 'YYYY-MM'))::int, 0),
    'ngay_cho_sua', to_jsonb(v_cho),
    'luot_can_bu', cardinality(v_cho),               -- hôm nay cần thêm bấy nhiêu lượt (ngoài lượt giữ hôm nay) để sửa hết
    'sua_duoc_den', case when cardinality(v_cho) > 0
      then to_jsonb(((v_cho[1] + 3)::timestamp at time zone 'Asia/Ho_Chi_Minh')) end,   -- hết ngày p+2 giờ VN
    'moc_tiep', v_moc,
    'bay_ngay', v_bay
  );
end $$;

-- ── 3. Cho app HS ──
create or replace function public.fn_chuoi_cua_toi()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  return public._chuoi_cua(v_hs);
end $$;

-- ── 4. Quyền ──
revoke all on function public._chuoi_cua(uuid) from public, anon, authenticated;
revoke all on function public.fn_chuoi_cua_toi() from public, anon;
grant execute on function public.fn_chuoi_cua_toi() to authenticated;
revoke all on function public.fn_chuoi_ngay_nghi_ghi(date, date, text[], text) from public, anon;
grant execute on function public.fn_chuoi_ngay_nghi_ghi(date, date, text[], text) to authenticated;
revoke all on function public.fn_chuoi_ngay_nghi_go(uuid) from public, anon;
grant execute on function public.fn_chuoi_ngay_nghi_go(uuid) to authenticated;
