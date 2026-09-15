-- ============================================================================
-- 202609112330 — may_man_hs (Vòng may mắn dành cho HỌC SINH cấp 2, lớp 6-9)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 11/09): app HS cấp 2 giờ có ô "May mắn" giống vòng quay TA, nhưng
--   luật KHÁC HẲN — mục đích khuyến khích HS làm TỰ LUYỆN cho nhiều:
--     · Điều kiện đủ 1 lượt quay = trong ngày có ≥1 BATCH 10 câu tự luyện với
--       ≥70% câu ĐÚNG (mỗi lượt tự luyện là 1 bai_test loai='tu_luyen' 10 câu).
--       HS có thể làm nhiều lượt — CHỈ CẦN 1 lượt đạt là được quay.
--     · Tối đa 1 lượt quay/ngày (unique HS×ngày).
--     · Phần thưởng: 50 EXP (40%), 100 EXP (40%), 150 EXP (15%), 200 EXP (5%).
--       (§2.0: tỉ lệ + trần đọc từ config, admin sửa được, không hard-code.)
--   EXP thưởng lưu Ở BẢNG RIÊNG (may_man_hs_luot.exp), CHƯA cộng vào EXP tháng
--   lương (fn_gami_exp_xu_thang). Sau này Thùy chốt muốn gộp thì thêm source
--   'exp_may_man' vào fn_gami_exp_xu_thang — 1 migration nhỏ, không đụng gì.
--
-- KIẾN TRÚC: mirror bảng+RPC nhân sự (mig 202609070421) — RNG + quyết định giải
--   Ở SERVER (fn_may_man_hs_quay), client chỉ chạy animation tới ô server trả.
--
-- MẤT GÌ: không mất gì. Chỉ tạo bảng+function mới. Không drop/delete.
-- ============================================================================

-- ── Config ──────────────────────────────────────────────────────────────────
create table if not exists may_man_hs_cau_hinh (
  ma text primary key,
  gia_tri numeric not null,
  mo_ta text
);
comment on table may_man_hs_cau_hinh is 'Cấu hình vòng quay may mắn HS: ti_le_50/100/150/200 (%), nguong_dung_pct (%), active (1/0).';
alter table may_man_hs_cau_hinh enable row level security;
drop policy if exists may_man_hs_cau_hinh_read on may_man_hs_cau_hinh;
-- HS đọc được để hiển thị bảng tỉ lệ ở màn May mắn. Ghi: staff (fallback: không policy write → RLS chặn).
create policy may_man_hs_cau_hinh_read on may_man_hs_cau_hinh for select to authenticated using (true);

insert into may_man_hs_cau_hinh (ma, gia_tri, mo_ta) values
  ('ti_le_50',        40,  '% trúng 50 EXP'),
  ('ti_le_100',       40,  '% trúng 100 EXP'),
  ('ti_le_150',       15,  '% trúng 150 EXP'),
  ('ti_le_200',        5,  '% trúng 200 EXP'),
  ('nguong_dung_pct', 70,  '% câu đúng tối thiểu trong 1 batch 10 câu tự luyện để đủ điều kiện quay'),
  ('active',           1,  '1 = mở vòng quay, 0 = tạm đóng')
on conflict (ma) do nothing;

-- ── Sổ lượt quay ────────────────────────────────────────────────────────────
create table if not exists may_man_hs_luot (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  ngay date not null,                                   -- ngày VN của lượt quay
  exp integer not null check (exp >= 0),                -- 100% có thưởng (ít nhất 50 EXP)
  rnd numeric not null,                                 -- số ngẫu nhiên 0..100 server rút (audit)
  mon text,                                             -- môn của batch tự luyện đủ điều kiện
  bai_lam_id uuid,                                      -- bai_lam TỰ LUYỆN đủ điều kiện (audit — không FK vì bai_lam có thể xoá thí nghiệm)
  created_at timestamptz not null default now(),
  unique (hoc_sinh_id, ngay)
);
comment on table may_man_hs_luot is 'Sổ lượt quay may mắn HS: 1 dòng/HS/ngày, exp = giải server quyết. EXP lưu riêng (không đụng gami_exp_ledger).';
create index if not exists may_man_hs_luot_hs_idx on may_man_hs_luot (hoc_sinh_id, ngay desc);

alter table may_man_hs_luot enable row level security;
-- HS chỉ đọc dòng của MÌNH (my_hoc_sinh_id là RPC security definer đã có sẵn).
drop policy if exists may_man_hs_luot_self on may_man_hs_luot;
create policy may_man_hs_luot_self on may_man_hs_luot for select to authenticated
  using (hoc_sinh_id = public.my_hoc_sinh_id());
-- Staff (nhân sự) đọc được tất (báo cáo/audit). Không có policy write cho authenticated —
-- ghi qua fn_may_man_hs_quay (security definer, kiểm điều kiện + khoá HS).
drop policy if exists may_man_hs_luot_staff_read on may_man_hs_luot;
create policy may_man_hs_luot_staff_read on may_man_hs_luot for select to authenticated
  using (public.la_thanh_vien());

-- ── HS cấp 2 (khối 6-9) — mirror hs_cap1_cua_toi ────────────────────────────
create or replace function public.hs_cap2_cua_toi()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(khoi in ('6', '7', '8', '9'), false)
  from hoc_sinh where id = public.my_hoc_sinh_id()
$$;
grant execute on function public.hs_cap2_cua_toi() to authenticated;

-- ── Điều kiện đủ để quay hôm nay ────────────────────────────────────────────
-- HS có ≥1 bai_lam tự luyện `da_nop` hôm nay (giờ VN), với ≥nguong_dung_pct% câu correct
-- trên tổng câu của bai_test. Trả bai_lam_id + môn của batch cũ nhất đạt để audit.
create or replace function public.fn_may_man_hs_du_dieu_kien(p_hs uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_me uuid := coalesce(p_hs, public.my_hoc_sinh_id());
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_nguong numeric;
  v_row record;
begin
  if v_me is null then return jsonb_build_object('du', false); end if;
  select gia_tri into v_nguong from may_man_hs_cau_hinh where ma = 'nguong_dung_pct';
  v_nguong := coalesce(v_nguong, 70);
  select bl.id as bai_lam_id, bt.mon,
         (select count(*) from bai_lam_cau blc where blc.bai_lam_id = bl.id and blc.verdict = 'correct')::int as so_dung,
         bt.so_cau
    into v_row
    from bai_lam bl
    join bai_test bt on bt.id = bl.bai_test_id
    where bl.hoc_sinh_id = v_me
      and bt.loai = 'tu_luyen'
      and bl.trang_thai = 'da_nop'
      and bt.ngay = v_today
      and bt.so_cau > 0
      and (select count(*) from bai_lam_cau blc2 where blc2.bai_lam_id = bl.id and blc2.verdict = 'correct')::numeric * 100.0
          >= v_nguong * bt.so_cau
    order by bl.nop_at asc nulls last, bl.bat_dau_at asc
    limit 1;
  if v_row.bai_lam_id is null then
    return jsonb_build_object('du', false, 'nguong_pct', v_nguong);
  end if;
  return jsonb_build_object(
    'du', true, 'nguong_pct', v_nguong,
    'bai_lam_id', v_row.bai_lam_id, 'mon', v_row.mon,
    'so_dung', v_row.so_dung, 'so_cau', v_row.so_cau
  );
end $$;
grant execute on function public.fn_may_man_hs_du_dieu_kien(uuid) to authenticated;
revoke execute on function public.fn_may_man_hs_du_dieu_kien(uuid) from anon;

-- ── Quay: khoá theo HS (chặn bấm đúp/2 tab), 1 lượt/ngày, kiểm điều kiện, rút số, ghi sổ ──
-- Tỉ lệ tính từ hiếm → phổ biến (giống fn_may_man_quay): 200 EXP < 150 < 100 < 50.
create or replace function public.fn_may_man_hs_quay()
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_active numeric;
  p50 numeric; p100 numeric; p150 numeric; p200 numeric;
  v_dk jsonb; v_bl_id uuid; v_mon text;
  v_rnd numeric; v_exp integer;
  l may_man_hs_luot;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;
  perform pg_advisory_xact_lock(hashtext('maymai_hs:' || v_me::text));
  select gia_tri into v_active from may_man_hs_cau_hinh where ma = 'active';
  if coalesce(v_active, 0) <> 1 then raise exception 'Vòng quay đang tạm đóng.'; end if;
  if exists (select 1 from may_man_hs_luot where hoc_sinh_id = v_me and ngay = v_today) then
    raise exception 'Hôm nay em đã quay rồi — mai quay tiếp nhé!'; end if;
  v_dk := public.fn_may_man_hs_du_dieu_kien(v_me);
  if not coalesce((v_dk->>'du')::boolean, false) then
    raise exception 'Can lam 1 luot tu luyen 10 cau dung >= % phan tram de quay.', coalesce((v_dk->>'nguong_pct')::int, 70);
  end if;
  v_bl_id := (v_dk->>'bai_lam_id')::uuid;
  v_mon := v_dk->>'mon';
  select gia_tri into p50  from may_man_hs_cau_hinh where ma = 'ti_le_50';
  select gia_tri into p100 from may_man_hs_cau_hinh where ma = 'ti_le_100';
  select gia_tri into p150 from may_man_hs_cau_hinh where ma = 'ti_le_150';
  select gia_tri into p200 from may_man_hs_cau_hinh where ma = 'ti_le_200';
  v_rnd := random() * 100;
  -- Ưu tiên xét giải hiếm trước: [0,p200) → 200 · [p200, p200+p150) → 150 · … · phần còn lại → 50.
  v_exp := case
    when v_rnd < p200                       then 200
    when v_rnd < p200 + p150                then 150
    when v_rnd < p200 + p150 + p100         then 100
    else                                          50
  end;
  insert into may_man_hs_luot (hoc_sinh_id, ngay, exp, rnd, mon, bai_lam_id)
    values (v_me, v_today, v_exp, v_rnd, v_mon, v_bl_id)
    returning * into l;
  return jsonb_build_object('id', l.id, 'ngay', l.ngay, 'exp', l.exp, 'mon', l.mon);
end $$;
grant execute on function public.fn_may_man_hs_quay() to authenticated;
revoke execute on function public.fn_may_man_hs_quay() from anon;

-- ── Trạng thái màn May mắn của TÔI: hôm nay quay chưa · đủ điều kiện chưa · tỉ lệ · lịch sử ──
-- Lịch sử: 10 lượt gần nhất CỦA CHÍNH TÔI (không hiện toàn trung tâm — HS đông, lộ thông tin bạn khác không cần thiết).
create or replace function public.fn_may_man_hs_cua_toi()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_dau date; v_cuoi date;
  v_hom_nay jsonb; v_thang integer; v_ls jsonb; v_dk jsonb; v_active numeric;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;
  v_dau := date_trunc('month', v_today)::date;
  v_cuoi := (v_dau + interval '1 month')::date;
  select to_jsonb(x) into v_hom_nay from (
    select exp, mon, created_at from may_man_hs_luot where hoc_sinh_id = v_me and ngay = v_today
  ) x;
  select coalesce(sum(exp), 0)::int into v_thang
    from may_man_hs_luot where hoc_sinh_id = v_me and ngay >= v_dau and ngay < v_cuoi;
  select coalesce(jsonb_agg(jsonb_build_object('ngay', ngay, 'exp', exp, 'mon', mon, 'created_at', created_at) order by created_at desc), '[]'::jsonb)
    into v_ls
    from (select * from may_man_hs_luot where hoc_sinh_id = v_me order by created_at desc limit 10) t;
  v_dk := public.fn_may_man_hs_du_dieu_kien(v_me);
  select gia_tri into v_active from may_man_hs_cau_hinh where ma = 'active';
  return jsonb_build_object(
    'ngay', v_today,
    'active', coalesce(v_active, 0) = 1,
    'hom_nay', v_hom_nay,
    'exp_thang', v_thang,
    'du_dieu_kien', v_dk,
    'ti_le', (select jsonb_object_agg(ma, gia_tri) from may_man_hs_cau_hinh where ma like 'ti_le_%'),
    'lich_su', v_ls
  );
end $$;
grant execute on function public.fn_may_man_hs_cua_toi() to authenticated;
revoke execute on function public.fn_may_man_hs_cua_toi() from anon;

-- ── THÀNH TỰU của HS: giải thưởng đã CÔNG BỐ (cong_bo_at not null) — Thùy 11/09 ──
-- Giai_thuong RLS staff-only (schema.md §quyền), HS SELECT trả 0 dòng → cần RPC security definer.
-- Trả về mỗi giải: tháng, loại giải, lớp (nếu HS đã đổi lớp thì vẫn giữ tên lớp lúc trao — join hiện tại).
create or replace function public.fn_hs_thanh_tuu_cua_toi()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id,
    'thang', to_char(g.thang, 'YYYY-MM'),
    'loai_giai', g.loai_giai,
    'lop_id', g.lop_id,
    'ten_lop', l.ten_lop,
    'mon', g.mon,
    'cong_bo_at', g.cong_bo_at
  ) order by g.thang desc, g.loai_giai asc), '[]'::jsonb)
  from giai_thuong g
  left join lop l on l.id = g.lop_id
  where g.hoc_sinh_id = public.my_hoc_sinh_id()
    and g.cong_bo_at is not null
$$;
grant execute on function public.fn_hs_thanh_tuu_cua_toi() to authenticated;
revoke execute on function public.fn_hs_thanh_tuu_cua_toi() from anon;
