-- MAY MẮN — vòng quay mỗi ngày (CEO 07/09): mỗi nhân sự 1 lượt/ngày KHÔNG điều kiện; giải 10.000đ 5% ·
-- 20.000đ 1% · 50.000đ 0.1% · còn lại "Chúc bạn may mắn lần sau"; trần ngân sách ~500.000đ/tháng (lượt nào
-- làm vượt trần thì về 0, ghi cờ vuot_tran). RNG và quyết định giải Ở SERVER (fn_may_man_quay) — client chỉ
-- chạy animation tới ô server trả. Tiền thưởng = "tiền mới" (xây dựng văn hoá BK), trả cùng đợt chốt tháng —
-- ở đây chỉ GHI SỔ (may_man_luot), không chạm lương/điểm tích lũy. Tỉ lệ/trần đọc từ may_man_cau_hinh (admin
-- sửa được, không hard-code).

create table if not exists may_man_cau_hinh (
  ma text primary key,
  gia_tri numeric not null,
  mo_ta text
);
comment on table may_man_cau_hinh is 'Cấu hình vòng quay may mắn: ti_le_10k/20k/50k (%), tran_thang (đ), active (1/0).';
alter table may_man_cau_hinh enable row level security;
drop policy if exists may_man_cau_hinh_member_all on may_man_cau_hinh;
create policy may_man_cau_hinh_member_all on may_man_cau_hinh for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
insert into may_man_cau_hinh (ma, gia_tri, mo_ta) values
  ('ti_le_10k', 5,      '% trúng 10.000đ'),
  ('ti_le_20k', 1,      '% trúng 20.000đ'),
  ('ti_le_50k', 0.1,    '% trúng 50.000đ'),
  ('tran_thang', 500000, 'Trần tổng thưởng mỗi tháng (đ) — vượt thì lượt đó về 0'),
  ('active', 1,         '1 = mở vòng quay, 0 = tạm đóng')
on conflict (ma) do nothing;

create table if not exists may_man_luot (
  id uuid primary key default gen_random_uuid(),
  nhan_su_id uuid not null references nhan_su(id),
  ngay date not null,                                   -- ngày VN của lượt quay
  tien integer not null check (tien >= 0),              -- 0 = chúc may mắn lần sau
  rnd numeric not null,                                 -- số ngẫu nhiên 0..100 server rút (kiểm tra sau)
  vuot_tran boolean not null default false,             -- trúng nhưng vượt trần tháng → về 0
  created_at timestamptz not null default now(),
  unique (nhan_su_id, ngay)
);
comment on table may_man_luot is 'Sổ lượt quay may mắn: 1 dòng/người/ngày, tien = giải server quyết. Trả thưởng theo đợt chốt tháng.';
create index if not exists may_man_luot_ngay_idx on may_man_luot (ngay desc);
alter table may_man_luot enable row level security;
drop policy if exists may_man_luot_member_all on may_man_luot;
create policy may_man_luot_member_all on may_man_luot for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- Quay: khoá theo người (chặn bấm đúp/2 tab), 1 lượt/ngày VN, rút số, áp trần tháng, ghi sổ, trả kết quả.
create or replace function public.fn_may_man_quay()
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  p10 numeric; p20 numeric; p50 numeric; v_tran numeric; v_active numeric;
  v_rnd numeric; v_tien integer; v_da integer; v_vuot boolean := false; l may_man_luot;
begin
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  perform pg_advisory_xact_lock(hashtext('maymai:' || v_me::text));
  select gia_tri into v_active from may_man_cau_hinh where ma = 'active';
  if coalesce(v_active, 0) <> 1 then raise exception 'Vòng quay đang tạm đóng.'; end if;
  if exists (select 1 from may_man_luot where nhan_su_id = v_me and ngay = v_today) then
    raise exception 'Hôm nay bạn đã quay rồi — mai quay tiếp nhé!'; end if;
  select gia_tri into p10 from may_man_cau_hinh where ma = 'ti_le_10k';
  select gia_tri into p20 from may_man_cau_hinh where ma = 'ti_le_20k';
  select gia_tri into p50 from may_man_cau_hinh where ma = 'ti_le_50k';
  select gia_tri into v_tran from may_man_cau_hinh where ma = 'tran_thang';
  v_rnd := random() * 100;
  -- giải hiếm xét trước: [0,p50) → 50k · [p50, p50+p20) → 20k · [p50+p20, p50+p20+p10) → 10k · còn lại 0
  v_tien := case when v_rnd < p50 then 50000 when v_rnd < p50 + p20 then 20000 when v_rnd < p50 + p20 + p10 then 10000 else 0 end;
  select coalesce(sum(tien), 0) into v_da from may_man_luot
    where ngay >= date_trunc('month', v_today)::date and ngay < (date_trunc('month', v_today) + interval '1 month')::date;
  if v_tien > 0 and v_da + v_tien > v_tran then v_vuot := true; v_tien := 0; end if;
  insert into may_man_luot (nhan_su_id, ngay, tien, rnd, vuot_tran) values (v_me, v_today, v_tien, v_rnd, v_vuot) returning * into l;
  return jsonb_build_object('id', l.id, 'ngay', l.ngay, 'tien', l.tien, 'vuot_tran', l.vuot_tran);
end $$;
grant execute on function public.fn_may_man_quay() to authenticated;
revoke execute on function public.fn_may_man_quay() from anon;

-- Trạng thái màn May mắn: hôm nay đã quay chưa · tổng tháng (của tôi / toàn BK / trần) · tỉ lệ · lịch sử gần đây
-- toàn BK (10 lượt mới nhất, có tên + avatar — màn design hiện lịch sử chung để lan toả).
create or replace function public.fn_may_man_cua_toi()
returns jsonb language plpgsql stable as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_dau date; v_cuoi date; v_hom_nay jsonb; v_toi integer; v_bk integer; v_tran numeric; v_active numeric; v_ls jsonb;
begin
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_dau := date_trunc('month', v_today)::date; v_cuoi := (v_dau + interval '1 month')::date;
  select to_jsonb(x) into v_hom_nay from (select tien, vuot_tran, created_at from may_man_luot where nhan_su_id = v_me and ngay = v_today) x;
  select coalesce(sum(tien), 0) into v_toi from may_man_luot where nhan_su_id = v_me and ngay >= v_dau and ngay < v_cuoi;
  select coalesce(sum(tien), 0) into v_bk from may_man_luot where ngay >= v_dau and ngay < v_cuoi;
  select gia_tri into v_tran from may_man_cau_hinh where ma = 'tran_thang';
  select gia_tri into v_active from may_man_cau_hinh where ma = 'active';
  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ns.ho_ten, 'anh_url', ns.anh_url, 'tien', l.tien, 'created_at', l.created_at, 'la_toi', l.nhan_su_id = v_me) order by l.created_at desc), '[]'::jsonb)
    into v_ls
  from (select * from may_man_luot order by created_at desc limit 10) l join nhan_su ns on ns.id = l.nhan_su_id;
  return jsonb_build_object(
    'ngay', v_today, 'active', coalesce(v_active, 0) = 1, 'hom_nay', v_hom_nay,
    'thang', jsonb_build_object('toi', v_toi, 'bk', v_bk, 'tran', v_tran),
    'ti_le', (select jsonb_object_agg(ma, gia_tri) from may_man_cau_hinh where ma like 'ti_le_%'),
    'lich_su', v_ls);
end $$;
grant execute on function public.fn_may_man_cua_toi() to authenticated;
revoke execute on function public.fn_may_man_cua_toi() from anon;
