-- ============================================================================
-- giai_thuong_tu_dong_xu_tin_moi — GIẢI THƯỞNG THÁNG: XU TỰ CỘNG + GHI NHẬN + TIN MỚI KHI VÀO APP (Thùy 17/10)
-- ----------------------------------------------------------------------------
-- Thùy chốt 17/10: giải tháng khối 3–7 trị giá 30 xu (khối 8–12 trao tiền mặt ⇒ không xu) · 1 học sinh 1 giải/tháng · phải ghi vào thành tựu/huy hiệu ·
--   xu phải cộng TỰ ĐỘNG (trước đây nhân viên cộng tay, lý do để trống) · học sinh vào app phải được BÁO có gì mới.
-- THIẾT KẾ:
--   · giai_thuong (bảng gốc) thuộc owner postgres + RLS chỉ cho staff ⇒ hàm DEFINER của claude_build KHÔNG đọc được (đã ĐO: fn_hs_thanh_tuu_cua_toi luôn trả [] ⇒
--     màn Thành tựu của học sinh chưa bao giờ hiện giải). Giải pháp độc lập quyền sở hữu: lúc CÔNG BỐ, hàm invoker (nhân viên đọc được) gọi _giai_ghi_nhan
--     ⇒ ghi 1 dòng hs_giai_thuong (sự kiện "giải đã trao", mã gốc = giai_thuong.id, bất biến) + xu + tin mới, CÙNG 1 transaction. fn_hs_thanh_tuu_cua_toi đọc bảng này.
--   · Xu: qlht_xu_ledger loai 'giai_thuong', ref_id = giai_thuong.id (unique ⇒ không bao giờ cộng đôi dù bấm chốt nhiều lần). Giá trị theo giai_thuong_gia_tri (khối 3–7: 30).
--   · xu_ghi: 'tu_dong' (hệ cộng) · 'da_cong_tay' (nhân viên đã cộng trước — chỉ ghi nhận, KHÔNG cộng thêm) · 'khong_xu' (khối 8–12) · 'cho_xac_nhan' (chưa rõ đã trả — Thùy quyết, KHÔNG tự cộng).
--   · Tin mới: bảng riêng hs_tin_moi (thong_bao_hs thuộc owner postgres, không alter được). App bật khung "Tin mới của em" khi mở; tin cũ ở thong_bao_hs vẫn chỉ ở hòm thư.
--   · Nới 3 CHECK của qlht_xu_ledger (loai, ref_loai, nguoi_tao_may) thêm 'giai_thuong' — drop + add bản siêu tập, dòng cũ vẫn hợp lệ.
-- MẤT GÌ: không xoá dữ liệu (thêm bảng hs_tin_moi, hs_giai_thuong, giai_thuong_gia_tri). Thay thân: fn_traogiai_chot_thang, fn_hs_thanh_tuu_cua_toi, fn_hs_vi_xu_cua_toi (thêm 1 nhánh union).
-- ============================================================================
create table if not exists public.giai_thuong_gia_tri (
  khoi_tu integer not null, khoi_den integer not null, xu integer not null check (xu >= 0), ghi_chu text,
  primary key (khoi_tu, khoi_den), check (khoi_tu <= khoi_den)
);
insert into public.giai_thuong_gia_tri (khoi_tu, khoi_den, xu, ghi_chu)
values (3, 7, 30, 'Mỗi giải tháng khối 3–7 = 30 xu (Thùy 17/10). Khối 8–12 trao tiền mặt ⇒ không có dòng = 0 xu.')
on conflict do nothing;
alter table public.giai_thuong_gia_tri enable row level security;
revoke all on public.giai_thuong_gia_tri from anon, authenticated;

create or replace function public._giai_xu(p_khoi text) returns integer
language sql stable security definer set search_path = public as $$
  select coalesce((select g.xu from giai_thuong_gia_tri g
                    where nullif(regexp_replace(coalesce(p_khoi, ''), '\D', '', 'g'), '')::int between g.khoi_tu and g.khoi_den
                    order by g.khoi_tu limit 1), 0)
$$;
revoke all on function public._giai_xu(text) from public;
revoke execute on function public._giai_xu(text) from anon, authenticated;

alter table public.qlht_xu_ledger drop constraint qlht_xu_ledger_loai_check;
alter table public.qlht_xu_ledger add constraint qlht_xu_ledger_loai_check
  check (loai = any (array['cong_tay','tru_tay','doi_qua','hoan','chot_thang','chot_lai','nong_trai','giai_thuong']::text[]));
alter table public.qlht_xu_ledger drop constraint qlht_xu_ledger_nguoi_tao_may;
alter table public.qlht_xu_ledger add constraint qlht_xu_ledger_nguoi_tao_may
  check (nguoi_tao is not null or loai = any (array['chot_thang','chot_lai','nong_trai','giai_thuong']::text[]));
alter table public.qlht_xu_ledger drop constraint qlht_xu_ledger_ref_loai_check;
alter table public.qlht_xu_ledger add constraint qlht_xu_ledger_ref_loai_check
  check (ref_loai = any (array['doi_qua','order','giai_thuong']::text[]));
create unique index if not exists qlht_xu_ledger_giai_thuong_uq on public.qlht_xu_ledger (ref_id) where loai = 'giai_thuong';

create table if not exists public.hs_giai_thuong (
  giai_thuong_id uuid primary key,   -- mã GỐC = giai_thuong.id (không FK: bảng gốc thuộc owner postgres + RLS)
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  lop_id uuid references public.lop(id),
  thang date not null,
  mon text not null,
  loai_giai text not null check (loai_giai in ('xuat_sac', 'tien_bo', 'cham_chi')),
  khoi text,
  xu integer not null default 0 check (xu >= 0),
  xu_ghi text not null check (xu_ghi in ('tu_dong', 'da_cong_tay', 'khong_xu', 'cho_xac_nhan')),
  cong_bo_at timestamptz not null default now()
);
create index if not exists hs_giai_thuong_hs_idx on public.hs_giai_thuong (hoc_sinh_id, thang desc);
alter table public.hs_giai_thuong enable row level security;
create policy hs_giai_thuong_self on public.hs_giai_thuong for select to authenticated using (hoc_sinh_id = public.my_hoc_sinh_id());
create policy hs_giai_thuong_staff on public.hs_giai_thuong for select to authenticated using (public.la_thanh_vien());
revoke all on public.hs_giai_thuong from anon;
grant select on public.hs_giai_thuong to authenticated;

-- TIN MỚI khi vào app: thong_bao_hs thuộc owner postgres (claude_build chỉ có SELECT, INSERT — không alter được) ⇒ bảng RIÊNG, giàu thông tin hơn:
-- 1 dòng = 1 sự kiện "em vừa đạt/được gì" (giải thưởng, thành tựu, huy hiệu, xu…). ref = khoá sự kiện (idempotent). Dùng chung cho mọi loại tin mới về sau.
create table if not exists public.hs_tin_moi (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  loai text not null,            -- giai_thuong · thanh_tuu · huy_hieu · xu …
  tieu_de text not null,
  noi_dung text not null,
  bieu_tuong text,
  ref text not null,             -- khoá sự kiện, vd 'giai:<giai_thuong.id>'
  created_at timestamptz not null default now(),
  doc_at timestamptz,
  unique (hoc_sinh_id, ref)
);
create index if not exists hs_tin_moi_chua_doc_idx on public.hs_tin_moi (hoc_sinh_id, created_at desc) where doc_at is null;
alter table public.hs_tin_moi enable row level security;
create policy hs_tin_moi_sel on public.hs_tin_moi for select to authenticated using (hoc_sinh_id = public.my_hoc_sinh_id());
create policy hs_tin_moi_upd on public.hs_tin_moi for update to authenticated using (hoc_sinh_id = public.my_hoc_sinh_id()) with check (hoc_sinh_id = public.my_hoc_sinh_id());
create policy hs_tin_moi_staff on public.hs_tin_moi for select to authenticated using (public.la_thanh_vien());
revoke all on public.hs_tin_moi from anon;
grant select on public.hs_tin_moi to authenticated;
grant update (doc_at) on public.hs_tin_moi to authenticated;

create or replace function public._giai_ghi_nhan(p_giai uuid, p_hs uuid, p_lop uuid, p_thang date, p_mon text, p_loai text,
                                                 p_xu_cach text default 'tu_dong', p_bao boolean default true)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_khoi text; v_xu integer; v_ghi text; v_n integer; v_ten text; v_ic text; v_th text; v_body text;
begin
  if not (public.la_thanh_vien() or session_user in ('claude_build', 'postgres')) then
    raise exception 'Chỉ nhân sự được ghi nhận giải thưởng.' using errcode = '42501';
  end if;
  select l.khoi into v_khoi from lop l where l.id = p_lop;
  v_xu := public._giai_xu(v_khoi);
  v_ghi := case when v_xu = 0 then 'khong_xu' else coalesce(p_xu_cach, 'tu_dong') end;
  insert into hs_giai_thuong (giai_thuong_id, hoc_sinh_id, lop_id, thang, mon, loai_giai, khoi, xu, xu_ghi)
  values (p_giai, p_hs, p_lop, p_thang, p_mon, p_loai, v_khoi, v_xu, v_ghi)
  on conflict (giai_thuong_id) do nothing;
  get diagnostics v_n = row_count;
  if v_n = 0 then return jsonb_build_object('moi', false); end if;
  v_ten := case p_loai when 'xuat_sac' then 'Xuất sắc' when 'tien_bo' then 'Tiến bộ' else 'Chăm chỉ' end;
  v_ic := case p_loai when 'xuat_sac' then '🏆' when 'tien_bo' then '🚀' else '🌟' end;
  v_th := 'tháng ' || to_char(p_thang, 'FMMM') || '/' || to_char(p_thang, 'YYYY');
  if v_ghi = 'tu_dong' then
    insert into qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, ref_id, ref_loai)
    values (p_hs, v_xu, 'giai_thuong', 'Giải ' || v_ten || ' ' || v_th, p_giai, 'giai_thuong')
    on conflict (ref_id) where loai = 'giai_thuong' do nothing;
  end if;
  if p_bao and v_ghi <> 'cho_xac_nhan' then
    v_body := 'Môn ' || p_mon || ' · lớp ' || coalesce((select ten_lop from lop where id = p_lop), '') || '. Chúc mừng em!'
              || case when v_ghi in ('tu_dong', 'da_cong_tay') then ' Phần thưởng ' || v_xu || ' xu đã vào ví của em.' else '' end;
    insert into hs_tin_moi (hoc_sinh_id, loai, tieu_de, noi_dung, bieu_tuong, ref)
    values (p_hs, 'giai_thuong', 'Em nhận Giải ' || v_ten || ' ' || v_th || '!', v_body, v_ic, 'giai:' || p_giai)
    on conflict (hoc_sinh_id, ref) do nothing;
  end if;
  return jsonb_build_object('moi', true, 'xu', v_xu, 'xu_ghi', v_ghi);
end $$;
revoke all on function public._giai_ghi_nhan(uuid, uuid, uuid, date, text, text, text, boolean) from public;
revoke execute on function public._giai_ghi_nhan(uuid, uuid, uuid, date, text, text, text, boolean) from anon;
grant execute on function public._giai_ghi_nhan(uuid, uuid, uuid, date, text, text, text, boolean) to authenticated;

-- CÔNG BỐ tháng (nút "Chốt kết quả tháng"): giữ hành vi cũ (đặt cong_bo_at) + ghi nhận/cộng xu/báo cho từng giải VỪA công bố
create or replace function public.fn_traogiai_chot_thang(p_ym text) returns integer
language plpgsql as $$
declare n integer := 0; r record;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  for r in
    with u as (update giai_thuong set cong_bo_at = now() where thang = (p_ym || '-01')::date and cong_bo_at is null
               returning id, hoc_sinh_id, lop_id, thang, mon, loai_giai)
    select * from u
  loop
    perform public._giai_ghi_nhan(r.id, r.hoc_sinh_id, r.lop_id, r.thang, r.mon, r.loai_giai);
    n := n + 1;
  end loop;
  return n;
end $$;

-- Học sinh xem giải của mình: đọc sổ ghi nhận hs_giai_thuong (hàm cũ đọc giai_thuong ⇒ luôn rỗng vì RLS)
create or replace function public.fn_hs_thanh_tuu_cua_toi() returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.giai_thuong_id, 'thang', to_char(g.thang, 'YYYY-MM'), 'loai_giai', g.loai_giai, 'lop_id', g.lop_id, 'ten_lop', l.ten_lop,
    'mon', g.mon, 'cong_bo_at', g.cong_bo_at,
    'xu', case when g.xu_ghi in ('tu_dong', 'da_cong_tay') then g.xu else 0 end
  ) order by g.thang desc, g.loai_giai asc), '[]'::jsonb)
  from hs_giai_thuong g left join lop l on l.id = g.lop_id
  where g.hoc_sinh_id = public.my_hoc_sinh_id()
$$;

CREATE OR REPLACE FUNCTION public.fn_hs_vi_xu_cua_toi(p_ym text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_ym text := coalesce(p_ym, to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'));
  v_so_du integer;
  v_mua jsonb;
  v_hoat_dong jsonb;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;

  select coalesce(sum(amount), 0)::int into v_so_du
  from qlht_xu_ledger where hoc_sinh_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'ten_qua', q.ten, 'anh_url', q.anh_url, 'so_luong', d.so_luong,
    'xu_tru', d.xu_tru, 'trang_thai', d.trang_thai, 'created_at', d.created_at, 'giao_luc', d.giao_luc
  ) order by d.created_at desc), '[]'::jsonb) into v_mua
  from (
    select * from qlht_doi_qua where hoc_sinh_id = v_me order by created_at desc limit 30
  ) d
  join qlht_qua q on q.id = d.qua_id;

  with cua_so as (
    select ((v_ym || '-01')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as tu,
           (((v_ym || '-01')::date + interval '1 month')::timestamp) at time zone 'Asia/Ho_Chi_Minh' as den
  ),
  dong as (
    select jsonb_build_object('loai', 'exp', 'nguon', l.source, 'mon', l.mon, 'so', l.amount,
             'created_at', l.created_at, 'ngay', b.ngay, 'lop', lp.ten_lop) as x, l.created_at as t
    from gami_exp_ledger l
    cross join cua_so w
    left join buoi_hoc b on b.id = l.ref_buoi_hoc_id
    left join lop lp on lp.id = b.lop_id
    where l.hoc_sinh_id = v_me and (
      -- exp_thang = nguồn gộp cũ (trước khi tách ET/BTVN), vẫn có `note` đúng tháng — vá bug 27/09.
      (l.source in ('exp_et', 'exp_btvn', 'exp_btvn_thang', 'exp_tren_lop', 'exp_thang') and l.note = v_ym)
      -- attend_floor + 3 nguồn legacy một-lần (rank_et/rank_ingame/btvn) đều KHÔNG có `note` → lọc theo ngày.
      or (l.source in ('attend_floor', 'rank_et', 'rank_ingame', 'btvn') and l.created_at >= w.tu and l.created_at < w.den)
    )
    union all
    select jsonb_build_object('loai', 'may_man', 'nguon', 'may_man', 'mon', m.mon, 'so', m.exp,
             'created_at', m.created_at, 'ngay', m.ngay, 'lop', null), m.created_at
    from may_man_hs_luot m
    where m.hoc_sinh_id = v_me and to_char(m.ngay, 'YYYY-MM') = v_ym
    union all
    -- Quy đổi EXP→xu (Thùy 06/10: tự động, nhiều lần/ngày): GỘP 1 dòng / môn theo `thang` của EXP.
    select jsonb_build_object('loai', 'xu', 'nguon', 'chot_thang', 'mon', nullif(x.mon, ''), 'so', sum(x.amount)::int,
             'created_at', max(x.created_at), 'ngay', null, 'lop', null), max(x.created_at)
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me and x.loai in ('chot_thang', 'chot_lai') and x.thang = v_ym
    group by x.mon
    having sum(x.amount) <> 0
    union all
    -- Cộng/trừ TAY — doi_qua/hoan là giao dịch mua, đã hiện ở lich_su_mua (Thùy 23/09).
    select jsonb_build_object('loai', 'xu', 'nguon', x.loai, 'mon', x.mon, 'so', x.amount,
             'created_at', x.created_at, 'ngay', null, 'lop', null), x.created_at
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me
      and x.loai in ('cong_tay', 'tru_tay')
      and to_char(x.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
    union all
    -- Nông trại BK (mig 202610121655): xu thật từ game, GỘP 1 dòng/tháng (đã cắt trần xu/ngày + xu/tháng ở fn_nt_xu_dong_bo)
    select jsonb_build_object('loai', 'xu', 'nguon', 'nong_trai', 'mon', null, 'so', sum(x.amount)::int,
             'created_at', max(x.created_at), 'ngay', null, 'lop', null), max(x.created_at)
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me and x.loai = 'nong_trai' and x.thang = v_ym
    group by x.thang
    having sum(x.amount) <> 0
    union all
    -- Giải thưởng tháng (mig giai_thuong_tu_dong_xu): mỗi giải 1 dòng, xu cộng TỰ ĐỘNG lúc công bố
    select jsonb_build_object('loai', 'xu', 'nguon', 'giai_thuong', 'mon', null, 'so', x.amount,
             'created_at', x.created_at, 'ngay', null, 'lop', null, 'ten', x.ly_do), x.created_at
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me and x.loai = 'giai_thuong'
      and to_char(x.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
    union all
    -- EXP nhiệm vụ (luật 06/10: lượt Luyện dạng yếu đạt + việc tuần/tháng; đã cắt trần 2.000): gộp theo THÁNG, mỗi môn đang bật. dht = ĐHT kiếm được cùng tháng. Nguồn số = fn_nhiem_vu_chang_thang (cùng nguồn đổi xu).
    select jsonb_build_object('loai', 'exp', 'nguon', 'exp_nhiem_vu', 'mon', c.mon, 'so', n.exp,
             'created_at', k.t, 'ngay', null, 'lop', null, 'dht', n.diem_chang), k.t
    from nhiem_vu_cau_hinh c
    cross join lateral public.fn_nhiem_vu_chang_thang(c.mon, v_ym, array[v_me]) n
    cross join lateral (select least(now(), (((v_ym || '-01')::date + interval '1 month')::timestamp at time zone 'Asia/Ho_Chi_Minh') - interval '1 second') as t) k
    where c.bat and n.exp > 0
    union all
    -- EXP huy hiệu: mỗi huy hiệu đạt trong tháng (tính vào tháng ĐẠT, giờ VN — như fn_exp_app_thang).
    select jsonb_build_object('loai', 'exp', 'nguon', 'exp_huy_hieu', 'mon', h.mon, 'so', s.exp,
             'created_at', h.dat_at, 'ngay', (h.dat_at at time zone 'Asia/Ho_Chi_Minh')::date, 'lop', null, 'sao', h.sao, 'ten', hh.ten), h.dat_at
    from hs_huy_hieu_dat h
    join huy_hieu_thang_sao s on s.mon = h.mon and s.sao = h.sao
    left join huy_hieu hh on hh.mon = h.mon and hh.key = h.huy_hieu_key
    where h.hoc_sinh_id = v_me and s.exp > 0
      and to_char(h.dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
    union all
    -- EXP THÀNH TỰU (đã BẤM NHẬN QUÀ; tính vào tháng nhận = thanh_tuu_dat.thang — mig 202610071126)
    select jsonb_build_object('loai', 'exp', 'nguon', 'exp_thanh_tuu', 'mon', nullif(t.mon, ''), 'so', t.exp,
             'created_at', t.chot_at, 'ngay', (t.chot_at at time zone 'Asia/Ho_Chi_Minh')::date, 'lop', null, 'bac', t.bac, 'ten', lo.ten), t.chot_at
    from thanh_tuu_dat t
    join thanh_tuu_loai lo on lo.ma = t.ma
    where t.hoc_sinh_id = v_me and t.exp > 0 and t.thang = v_ym
  )
  select coalesce(jsonb_agg(x order by t desc), '[]'::jsonb) into v_hoat_dong from dong;

  return jsonb_build_object('ym', v_ym, 'so_du', v_so_du, 'lich_su_mua', v_mua, 'hoat_dong', v_hoat_dong);
end $function$;
