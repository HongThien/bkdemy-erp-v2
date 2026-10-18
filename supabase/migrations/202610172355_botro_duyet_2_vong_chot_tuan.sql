-- DUYỆT BỔ TRỢ 2 VÒNG + CHỐT TUẦN (Thùy 17/10).
--  · Vòng 1 (Báo động · Điểm thấp) → "Đang theo dõi" (KHÔNG chiếm slot) → Vòng 2 duyệt CHÍNH THỨC (mới chiếm slot, qua đường duyệt cũ).
--  · KHÔNG realtime: mỗi tuần chốt MỘT lần vào thứ 2 (người duyệt bấm). Ảnh chụp tuần lưu ở bo_tro_chot_tuan(_hs); chỉ tab Báo động đọc live.
--  · Máy KHÔNG đề xuất level ở màn duyệt nữa. Dữ liệu mới: ET 4 buổi gần nhất (kèm so lớp + màu) + BTVN 4 buổi (Đ/C/S).
--  · Bổ trợ yếu/Hình: 1 tuần chỉ 1 lần — hoàn tất ca ⇒ case KẾT THÚC dù chưa hết dạng yếu (tuần sau xét lại).

create table public.bo_tro_theo_doi (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  mon text not null,
  vao_at timestamptz not null default now(),
  vao_boi uuid,
  nguon text not null,                      -- bao_dong | diem_thap (tab em được đưa vào theo dõi từ đó)
  ghi_chu text,
  so_lieu_vao jsonb not null default '{}'::jsonb,   -- ảnh chụp số liệu LÚC VÀO theo dõi (so với các tuần sau)
  trang_thai text not null default 'theo_doi',      -- theo_doi | bo_qua | len_chinh_thuc | go
  ket_thuc_at timestamptz,
  ket_thuc_boi uuid,
  ly_do_ket_thuc text,
  constraint bo_tro_theo_doi_nguon_ck check (nguon in ('bao_dong', 'diem_thap')),
  constraint bo_tro_theo_doi_tt_ck check (trang_thai in ('theo_doi', 'bo_qua', 'len_chinh_thuc', 'go')),
  constraint bo_tro_theo_doi_dong_ck check (trang_thai = 'theo_doi' or ket_thuc_at is not null)
);
create unique index bo_tro_theo_doi_mot_dang on public.bo_tro_theo_doi (hoc_sinh_id, mon) where trang_thai = 'theo_doi';
create index bo_tro_theo_doi_hs on public.bo_tro_theo_doi (hoc_sinh_id, mon, vao_at desc);

create table public.bo_tro_chot_tuan (
  id uuid primary key default gen_random_uuid(),
  tuan date not null,                        -- thứ 2 của tuần chốt (giờ VN)
  mon text not null,
  chot_at timestamptz not null default now(),
  chot_boi uuid,
  so_diem_thap int not null default 0,
  so_theo_doi int not null default 0
);
create index bo_tro_chot_tuan_mon on public.bo_tro_chot_tuan (mon, chot_at desc);

create table public.bo_tro_chot_tuan_hs (
  chot_id uuid not null references public.bo_tro_chot_tuan(id),
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  loai text not null,                        -- diem_thap | theo_doi
  lop text,
  khoi text,
  ly_do text[] not null default '{}',
  kenh text[] not null default '{}',
  uu_tien int not null default 0,
  du_lieu jsonb not null default '{}'::jsonb,        -- { chuyen_de: [...], et_btvn: {et:[...], btvn:[...]} }
  primary key (chot_id, hoc_sinh_id, loai),
  constraint bo_tro_chot_tuan_hs_loai_ck check (loai in ('diem_thap', 'theo_doi'))
);

alter table public.bo_tro_theo_doi enable row level security;
alter table public.bo_tro_chot_tuan enable row level security;
alter table public.bo_tro_chot_tuan_hs enable row level security;
create policy bo_tro_theo_doi_member_all on public.bo_tro_theo_doi for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy bo_tro_chot_tuan_member_all on public.bo_tro_chot_tuan for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy bo_tro_chot_tuan_hs_member_all on public.bo_tro_chot_tuan_hs for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ET + BTVN 4 buổi gần nhất của 1 em. TÍNH Ở DB (§2.0).
--  ET: điểm em = TB các câu ET buổi đó ×100 (Đ=1 · C=0,5 · S=0); so với CẢ LỚP cùng buổi. Màu:
--   do_dam  = < 85% TB lớp (15% CỦA TB lớp, không phải 15 điểm) HOẶC thuộc 2 cuối lớp
--   do_nhat = từ 85% TB tới TB · xanh_nhat = trên TB · xanh = > 115% TB HOẶC thuộc 2 đầu lớp
--  "2 cuối / 2 đầu" ĐẾM THEO SỐ NGƯỜI: ngưỡng = điểm của người thứ 2 từ cuối/đầu; ai bằng hoặc kém/hơn ngưỡng đều vào nhóm
--  (4 bạn cùng điểm thấp nhất ⇒ cả 4 đỏ đậm). Nhóm cuối chỉ áp cho người dưới TB, nhóm đầu chỉ cho người trên TB.
--  BTVN: Đ/C/S (đúng/chưa trọn/sai) từng buổi + % đúng. Nguồn: gami_grades (phase et/btvn).
create or replace function public.fn_botro_et_btvn(p_hs uuid, p_n int default 4)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_et jsonb; v_bt jsonb;
begin
  if not public.la_thanh_vien() then return '{}'::jsonb; end if;
  with b as (  -- 4 buổi ET gần nhất em có điểm
    select sp.buoi_hoc_id, bh.ngay, bh.lop_id
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = p_hs and sp.phase = 'et' and bh.trang_thai <> 'huy'
    group by sp.buoi_hoc_id, bh.ngay, bh.lop_id order by bh.ngay desc limit greatest(1, least(coalesce(p_n, 4), 12))
  ),
  diem as (  -- điểm từng bạn mỗi buổi đó
    select sp.buoi_hoc_id, g.hoc_sinh_id, 100.0 * avg(case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end) as d
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
    where sp.phase = 'et' and sp.buoi_hoc_id in (select buoi_hoc_id from b)
    group by sp.buoi_hoc_id, g.hoc_sinh_id
  ),
  th as (
    select d.buoi_hoc_id, avg(d.d) as tb, count(*) as n,
           (array_agg(d.d order by d.d asc))[least(2, count(*))] as thap2, (array_agg(d.d order by d.d desc))[least(2, count(*))] as cao2
    from diem d group by d.buoi_hoc_id
  ),
  x as (
    select b.ngay, b.buoi_hoc_id, em.d as diem, th.tb, th.n, th.thap2, th.cao2,
           (select count(*) from diem o where o.buoi_hoc_id = b.buoi_hoc_id and o.d > em.d) + 1 as hang,
           (select count(*) from diem o where o.buoi_hoc_id = b.buoi_hoc_id and o.d = em.d) as so_bang
    from b join diem em on em.buoi_hoc_id = b.buoi_hoc_id and em.hoc_sinh_id = p_hs join th on th.buoi_hoc_id = b.buoi_hoc_id
  ),
  m as (
    select x.*,
      case when x.diem < x.tb * 0.85 or (x.n >= 4 and x.diem < x.tb and x.diem <= x.thap2) then 'do_dam'
           when x.diem < x.tb then 'do_nhat'
           when x.diem > x.tb * 1.15 or (x.n >= 4 and x.diem > x.tb and x.diem >= x.cao2) then 'xanh'
           else 'xanh_nhat' end as mau
    from x
  )
  select coalesce(jsonb_agg(jsonb_build_object('buoi_id', buoi_hoc_id, 'ngay', ngay, 'diem', round(diem::numeric, 1), 'tb_lop', round(tb::numeric, 1), 'n', n,
      'hang', hang, 'so_bang', so_bang, 'mau', mau,
      'ly_do', case mau when 'do_dam' then case when diem < tb * 0.85 then 'dưới 85% TB lớp' else 'thuộc 2 cuối lớp' end
                        when 'do_nhat' then 'từ 85% TB lớp đến TB lớp' when 'xanh' then case when diem > tb * 1.15 then 'trên 115% TB lớp' else 'thuộc 2 đầu lớp' end
                        else 'bằng hoặc trên TB lớp' end) order by ngay desc), '[]'::jsonb) into v_et from m;

  select coalesce(jsonb_agg(jsonb_build_object('buoi_id', t.buoi_hoc_id, 'ngay', t.ngay, 'd', t.d, 'c', t.c, 's', t.s, 'tong', t.d + t.c + t.s,
      'pct', round(100.0 * t.d / nullif(t.d + t.c + t.s, 0))) order by t.ngay desc), '[]'::jsonb) into v_bt
  from (
    select sp.buoi_hoc_id, bh.ngay,
           count(*) filter (where g.result = 'correct') as d, count(*) filter (where g.result = 'partial') as c, count(*) filter (where g.result = 'wrong') as s
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = p_hs and sp.phase = 'btvn' and bh.trang_thai <> 'huy'
    group by sp.buoi_hoc_id, bh.ngay order by bh.ngay desc limit greatest(1, least(coalesce(p_n, 4), 12))
  ) t;
  return jsonb_build_object('et', v_et, 'btvn', v_bt);
end $$;

-- Chốt tuần (người duyệt bấm vào thứ 2): ghi ảnh chụp "điểm thấp" (client gửi kết quả engine) + làm mới số liệu cho em ĐANG THEO DÕI.
-- p_ung_vien = [{hoc_sinh_id, lop, khoi, ly_do[], kenh[], uu_tien, chuyen_de}] ; p_theo_doi_cd = [{hoc_sinh_id, chuyen_de}] (chuyên đề em đang theo dõi, từ engine).
create or replace function public.fn_botro_chot_tuan(p_mon text, p_ung_vien jsonb, p_theo_doi_cd jsonb default '[]'::jsonb)
returns uuid language plpgsql security definer set search_path to 'public' as $$
declare v_id uuid; v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date; r record; n1 int := 0; n2 int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if nullif(trim(coalesce(p_mon, '')), '') is null then raise exception 'Thiếu môn.'; end if;
  insert into bo_tro_chot_tuan (tuan, mon, chot_boi) values (v_tuan, p_mon, public.jwt_uid()) returning id into v_id;
  for r in select * from jsonb_to_recordset(coalesce(p_ung_vien, '[]'::jsonb)) as x(hoc_sinh_id uuid, lop text, khoi text, ly_do text[], kenh text[], uu_tien int, chuyen_de jsonb) loop
    insert into bo_tro_chot_tuan_hs (chot_id, hoc_sinh_id, loai, lop, khoi, ly_do, kenh, uu_tien, du_lieu)
      values (v_id, r.hoc_sinh_id, 'diem_thap', r.lop, r.khoi, coalesce(r.ly_do, '{}'), coalesce(r.kenh, '{}'), coalesce(r.uu_tien, 0),
              jsonb_build_object('chuyen_de', coalesce(r.chuyen_de, '[]'::jsonb), 'et_btvn', public.fn_botro_et_btvn(r.hoc_sinh_id)))
      on conflict do nothing;
    n1 := n1 + 1;
  end loop;
  for r in select td.hoc_sinh_id, td.id, coalesce(x.cd, '[]'::jsonb) as cd,
                  (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = td.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = td.mon limit 1) as lop,
                  (select hs.khoi from hoc_sinh hs where hs.id = td.hoc_sinh_id) as khoi
           from bo_tro_theo_doi td
           left join (select (e->>'hoc_sinh_id')::uuid as hs, e->'chuyen_de' as cd from jsonb_array_elements(coalesce(p_theo_doi_cd, '[]'::jsonb)) e) x on x.hs = td.hoc_sinh_id
           where td.mon = p_mon and td.trang_thai = 'theo_doi' loop
    insert into bo_tro_chot_tuan_hs (chot_id, hoc_sinh_id, loai, lop, khoi, du_lieu)
      values (v_id, r.hoc_sinh_id, 'theo_doi', r.lop, r.khoi, jsonb_build_object('chuyen_de', r.cd, 'et_btvn', public.fn_botro_et_btvn(r.hoc_sinh_id)))
      on conflict do nothing;
    n2 := n2 + 1;
  end loop;
  update bo_tro_chot_tuan set so_diem_thap = n1, so_theo_doi = n2 where id = v_id;
  return v_id;
end $$;

-- Đọc ảnh chụp tuần MỚI NHẤT của môn. p_loai = 'diem_thap' | 'theo_doi'.
--  diem_thap: loại em đã có case/đang theo dõi/đã quyết (đưa theo dõi · bỏ qua · lên chính thức) SAU lúc chốt.
--  theo_doi: em đang ở bo_tro_theo_doi (trang_thai theo_doi) — số liệu = ảnh chụp tuần mới nhất (nếu chưa có thì tính ngay để không trống).
create or replace function public.fn_botro_danh_sach_tuan(p_mon text, p_loai text)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_chot record; v_ds jsonb;
begin
  if not public.la_thanh_vien() then return '{}'::jsonb; end if;
  if p_loai not in ('diem_thap', 'theo_doi') then raise exception 'Loại phải là diem_thap | theo_doi.'; end if;
  select c.*, (select n.ho_ten from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where t.id = c.chot_boi) as chot_ten into v_chot
    from bo_tro_chot_tuan c where c.mon = p_mon order by c.chot_at desc limit 1;
  if p_loai = 'diem_thap' then
    select coalesce(jsonb_agg(jsonb_build_object('hoc_sinh_id', h.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', coalesce(h.khoi, hs.khoi), 'lop', h.lop,
        'ly_do', h.ly_do, 'kenh', h.kenh, 'uu_tien', h.uu_tien, 'du_lieu', h.du_lieu,
        'cung_bao_dong', exists (select 1 from canh_bao_yeu cb where cb.hoc_sinh_id = h.hoc_sinh_id and cb.created_at >= now() - interval '30 days')) order by h.uu_tien desc, hs.ho_ten), '[]'::jsonb) into v_ds
    from bo_tro_chot_tuan_hs h join hoc_sinh hs on hs.id = h.hoc_sinh_id
    where v_chot.id is not null and h.chot_id = v_chot.id and h.loai = 'diem_thap'
      and not exists (select 1 from hs_level lv where lv.hoc_sinh_id = h.hoc_sinh_id and lv.mon = p_mon and lv.loai = 'kien_thuc' and lv.level >= 1)
      and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = h.hoc_sinh_id and y.mon = p_mon and y.trang_thai = 'dang_xu')
      and not exists (select 1 from bo_tro_theo_doi td where td.hoc_sinh_id = h.hoc_sinh_id and td.mon = p_mon and (td.trang_thai = 'theo_doi' or td.vao_at >= v_chot.chot_at));
  else
    select coalesce(jsonb_agg(jsonb_build_object('id', td.id, 'hoc_sinh_id', td.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi,
        'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = td.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = td.mon limit 1),
        'vao_at', td.vao_at, 'nguon', td.nguon, 'ghi_chu', td.ghi_chu, 'so_lieu_vao', td.so_lieu_vao,
        'vao_ten', (select n.ho_ten from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where t.id = td.vao_boi),
        'du_lieu', coalesce(ct.du_lieu, jsonb_build_object('chuyen_de', '[]'::jsonb, 'et_btvn', public.fn_botro_et_btvn(td.hoc_sinh_id))),
        'co_anh_chup', ct.du_lieu is not null) order by td.vao_at), '[]'::jsonb) into v_ds
    from bo_tro_theo_doi td join hoc_sinh hs on hs.id = td.hoc_sinh_id
    left join lateral (select h.du_lieu from bo_tro_chot_tuan_hs h where h.chot_id = v_chot.id and h.hoc_sinh_id = td.hoc_sinh_id and h.loai = 'theo_doi' limit 1) ct on v_chot.id is not null
    where td.mon = p_mon and td.trang_thai = 'theo_doi'
      and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = td.hoc_sinh_id and y.mon = p_mon and y.trang_thai = 'dang_xu');
  end if;
  return jsonb_build_object('chot', case when v_chot.id is null then null else jsonb_build_object('id', v_chot.id, 'tuan', v_chot.tuan, 'chot_at', v_chot.chot_at, 'chot_ten', v_chot.chot_ten,
                                                      'so_diem_thap', v_chot.so_diem_thap, 'so_theo_doi', v_chot.so_theo_doi) end, 'ds', v_ds);
end $$;

-- Tab BÁO ĐỘNG: ĐỌC LIVE (không chờ chốt tuần). Chuông 🚨 của GV/TA trong 30 ngày qua, em chưa có case/chưa theo dõi/chưa bị bỏ qua SAU chuông mới nhất.
create or replace function public.fn_botro_bao_dong(p_mon text)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then return '[]'::jsonb; end if;
  select coalesce(jsonb_agg(x order by x.moi_nhat desc), '[]'::jsonb) into v from (
    select hs.id as hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi,
           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = hs.id and hl.trang_thai = 'dang_hoc' and l.mon = p_mon limit 1) as lop,
           max(cb.created_at) as moi_nhat,
           jsonb_agg(jsonb_build_object('nguon', cb.nguon, 'ghi_chu', cb.ghi_chu, 'at', cb.created_at,
                     'ai', (select n.ho_ten from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where t.id = cb.created_by)) order by cb.created_at desc) as bao_dong,
           public.fn_botro_et_btvn(hs.id) as et_btvn,
           (select h.du_lieu->'chuyen_de' from bo_tro_chot_tuan_hs h join bo_tro_chot_tuan c on c.id = h.chot_id
              where c.mon = p_mon and h.hoc_sinh_id = hs.id order by c.chot_at desc limit 1) as chuyen_de,
           exists (select 1 from bo_tro_chot_tuan_hs h join bo_tro_chot_tuan c on c.id = h.chot_id
                    where c.mon = p_mon and h.hoc_sinh_id = hs.id and h.loai = 'diem_thap' and c.chot_at = (select max(c2.chot_at) from bo_tro_chot_tuan c2 where c2.mon = p_mon)) as cung_diem_thap
    from canh_bao_yeu cb
    join hoc_sinh hs on hs.id = cb.hoc_sinh_id
    left join buoi_hoc b on b.id = cb.buoi_hoc_id left join lop bl on bl.id = b.lop_id
    where cb.created_at >= now() - interval '30 days'
      and exists (select 1 from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = hs.id and hl.trang_thai = 'dang_hoc' and l.mon = p_mon)
      and (bl.mon is null or bl.mon = p_mon)
      and not exists (select 1 from hs_level lv where lv.hoc_sinh_id = hs.id and lv.mon = p_mon and lv.loai = 'kien_thuc' and lv.level >= 1)
      and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = hs.id and y.mon = p_mon and y.trang_thai = 'dang_xu')
      and not exists (select 1 from bo_tro_theo_doi td where td.hoc_sinh_id = hs.id and td.mon = p_mon and (td.trang_thai = 'theo_doi' or td.vao_at >= cb.created_at))
    group by hs.id, hs.ho_ten, hs.ma_hs, hs.khoi
  ) x;
  return v;
end $$;

-- Vòng 1 → theo dõi / bỏ qua. Ảnh chụp số liệu lúc vào = ảnh chụp tuần mới nhất của em (nếu có) hoặc tính ngay.
create or replace function public.fn_botro_theo_doi_vao(p_hs uuid, p_mon text, p_nguon text, p_ghi_chu text default null, p_bo_qua boolean default false)
returns uuid language plpgsql security definer set search_path to 'public' as $$
declare v_id uuid; v_sl jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_nguon not in ('bao_dong', 'diem_thap') then raise exception 'Nguồn phải là bao_dong | diem_thap.'; end if;
  if exists (select 1 from bo_tro_yeu where hoc_sinh_id = p_hs and mon = p_mon and trang_thai = 'dang_xu') then raise exception 'Em đã đang bổ trợ chính thức.'; end if;
  if exists (select 1 from bo_tro_theo_doi where hoc_sinh_id = p_hs and mon = p_mon and trang_thai = 'theo_doi') then raise exception 'Em đã ở danh sách theo dõi.'; end if;
  select h.du_lieu into v_sl from bo_tro_chot_tuan_hs h join bo_tro_chot_tuan c on c.id = h.chot_id
    where c.mon = p_mon and h.hoc_sinh_id = p_hs order by c.chot_at desc limit 1;
  v_sl := coalesce(v_sl, jsonb_build_object('chuyen_de', '[]'::jsonb, 'et_btvn', public.fn_botro_et_btvn(p_hs)));
  insert into bo_tro_theo_doi (hoc_sinh_id, mon, vao_boi, nguon, ghi_chu, so_lieu_vao, trang_thai, ket_thuc_at, ket_thuc_boi, ly_do_ket_thuc)
    values (p_hs, p_mon, public.jwt_uid(), p_nguon, nullif(trim(coalesce(p_ghi_chu, '')), ''), v_sl,
            case when p_bo_qua then 'bo_qua' else 'theo_doi' end, case when p_bo_qua then now() end, case when p_bo_qua then public.jwt_uid() end, case when p_bo_qua then 'Bỏ qua vòng 1' end)
    returning id into v_id;
  return v_id;
end $$;

-- Gỡ tay (em hết tín hiệu vẫn nằm trong theo dõi tới khi người duyệt gỡ) / đánh dấu đã lên chính thức (sau khi duyệt qua đường cũ).
create or replace function public.fn_botro_theo_doi_ket_thuc(p_id uuid, p_trang_thai text, p_ly_do text default null)
returns void language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_trang_thai not in ('go', 'len_chinh_thuc') then raise exception 'Trạng thái phải là go | len_chinh_thuc.'; end if;
  update bo_tro_theo_doi set trang_thai = p_trang_thai, ket_thuc_at = now(), ket_thuc_boi = public.jwt_uid(), ly_do_ket_thuc = nullif(trim(coalesce(p_ly_do, '')), '')
    where id = p_id and trang_thai = 'theo_doi';
end $$;

revoke execute on function public.fn_botro_et_btvn(uuid, int), public.fn_botro_chot_tuan(text, jsonb, jsonb), public.fn_botro_danh_sach_tuan(text, text), public.fn_botro_bao_dong(text),
  public.fn_botro_theo_doi_vao(uuid, text, text, text, boolean), public.fn_botro_theo_doi_ket_thuc(uuid, text, text) from public, anon;
grant execute on function public.fn_botro_et_btvn(uuid, int), public.fn_botro_chot_tuan(text, jsonb, jsonb), public.fn_botro_danh_sach_tuan(text, text), public.fn_botro_bao_dong(text),
  public.fn_botro_theo_doi_vao(uuid, text, text, text, boolean), public.fn_botro_theo_doi_ket_thuc(uuid, text, text) to authenticated;

-- ============ 1 tuần chỉ 1 lần bổ trợ: hoàn tất ca ⇒ KẾT THÚC case (bản lấy từ DB đang chạy) ============
CREATE OR REPLACE FUNCTION public.fn_btyeu_hoan_tat(p_buoi uuid, p_nhan_xet text, p_muc_ma text DEFAULT NULL::text, p_khong_test_ly_do text DEFAULT NULL::text, p_dang_day text[] DEFAULT NULL::text[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_test_da_nop boolean; v_co_test boolean; v_nx text; v_day text[]; v_muc smallint;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if b.danh_gia_xong_at is not null then return; end if; -- idempotent
  select exists (select 1 from bai_test bt where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test'),
         exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop')
    into v_co_test, v_test_da_nop;
  if v_co_test and not v_test_da_nop and nullif(trim(coalesce(p_khong_test_ly_do, '')), '') is null then
    raise exception 'Em chưa làm bài kiểm tra cuối buổi — nhập lý do "không test" nếu em không làm.';
  end if;
  v_nx := nullif(trim(coalesce(p_nhan_xet, '')), '');
  if v_co_test and not v_test_da_nop then v_nx := concat_ws(E'\n', '[Không test: ' || trim(p_khong_test_ly_do) || ']', v_nx); end if;
  if v_nx is null and p_muc_ma is null then raise exception 'Nhập nhận xét hoặc chọn mức.'; end if;
  -- muc PHẢI khớp chữ số đầu của muc_ma (buoi_danh_gia_muc_ma_khop_muc_chk) — cùng công thức MUC_CATALOG bên client.
  v_muc := case when p_muc_ma is null then null else left(p_muc_ma, 1)::smallint end;

  -- Thùy 29/09: dạng ĐÃ HỌC lấy từ DỮ LIỆU. Ca 📱 app (hoặc chưa chọn chế độ) = dạng em có làm ≥1 câu trong ca (cùng định nghĩa
  -- fn_btyeu_dong_ca) — BỎ QUA tick gửi lên (kể cả app TA bản cũ tick sẵn hết). Chỉ ca 📄 giấy mới dùng tick của TA.
  if (select hh.btyeu_che_do from buoi_hoc_hs hh where hh.id = b.buoi_hoc_hs_id) is distinct from 'giay' then
    select coalesce(array_agg(distinct t.ma_dang), '{}') into p_dang_day from public._btyeu_tien_do(p_buoi) t where t.so_cau > 0 and t.ma_dang is not null;
  end if;
  -- Thùy 24/09: buổi xong ⇒ case phải tiến. p_dang_day = dạng TA xác nhận ĐÃ DẠY buổi này (null = client cũ ⇒ giữ hành vi cũ).
  if p_dang_day is not null then
    update bo_tro_yeu_dang set day_at = null, day_buoi_id = null -- TA bỏ tick dạng máy tự đánh dấu ở buổi này
      where bo_tro_yeu_id = b.bo_tro_yeu_id and day_buoi_id = p_buoi and dong_at is null and dat is null and not (ma_dang = any(p_dang_day));
    update bo_tro_yeu_dang set day_at = now(), day_buoi_id = p_buoi
      where bo_tro_yeu_id = b.bo_tro_yeu_id and day_at is null and dong_at is null and ma_dang = any(p_dang_day);
    update bo_tro_yeu_dang set dat = null -- retest trượt, dạy lại xong ⇒ chờ retest mới
      where bo_tro_yeu_id = b.bo_tro_yeu_id and dat = false and dong_at is null and ma_dang = any(p_dang_day);
    v_day := p_dang_day;
  else
    select coalesce(array_agg(ma_dang), '{}') into v_day from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and day_buoi_id = p_buoi;
  end if;

  insert into buoi_danh_gia (buoi_hoc_id, hoc_sinh_id, nhan_xet, muc, muc_ma, graded_by, updated_at)
    values (p_buoi, b.hoc_sinh_id, v_nx, v_muc, p_muc_ma, public.jwt_uid(), now())
    on conflict (buoi_hoc_id, hoc_sinh_id) do update set nhan_xet = excluded.nhan_xet, muc = excluded.muc, muc_ma = excluded.muc_ma, graded_by = excluded.graded_by, updated_at = now();
  update buoi_hoc set danh_gia_xong_at = now(), updated_at = now() where id = p_buoi;
  perform public._btyeu_bu_retest(p_buoi, v_day); -- mọi dạng vừa dạy đều có câu retest ⇒ không kẹt "Chờ retest"
  -- Thùy 29/09: bổ trợ yếu KẾT THÚC khi em hết dạng yếu + TA đóng ca. "Chờ đánh giá" là việc học thuật, luồng khác.
  -- Thùy 17/10: 1 TUẦN CHỈ BỔ TRỢ 1 LẦN — hoàn tất ca ⇒ case KẾT THÚC, kể cả chưa hết dạng yếu (tuần sau duyệt lại ở thứ 2). Việc khẩn giữa tuần = Bổ trợ Khẩn cấp.
  perform public._btyeu_ket_thuc_case(b.bo_tro_yeu_id, v_ns, 'Bổ trợ 1 lần/tuần — TA đóng ca ' || to_char(b.ngay, 'DD/MM') || case when exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)) then ' (còn dạng chưa dạy, xét lại tuần sau)' else '' end, now());
end $function$
;

CREATE OR REPLACE FUNCTION public.fn_bthinh_hoan_tat(p_buoi uuid, p_nhan_xet text, p_con_tiep boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; hh record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_nx text := nullif(trim(coalesce(p_nhan_xet, '')), ''); v_kt boolean := false;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from buoi_hoc where id = p_buoi and loai = 'bo_tro_hinh';
  if b.id is null then raise exception 'Không phải buổi bổ trợ Hình.'; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if b.danh_gia_xong_at is not null then return jsonb_build_object('da_xong', true); end if; -- idempotent
  select * into hh from buoi_hoc_hs where buoi_hoc_id = p_buoi and bo_tro_hinh_id is not null limit 1;
  if hh.id is null then raise exception 'Buổi chưa có em nào.'; end if;
  if hh.diem_danh is distinct from 'co_mat' then raise exception 'Em chưa được điểm danh CÓ MẶT.'; end if;
  if v_nx is null then raise exception 'Nhập nhận xét cuối buổi.'; end if;
  insert into buoi_danh_gia (buoi_hoc_id, hoc_sinh_id, nhan_xet, graded_by, updated_at) values (p_buoi, hh.hoc_sinh_id, v_nx, public.jwt_uid(), now())
    on conflict (buoi_hoc_id, hoc_sinh_id) do update set nhan_xet = excluded.nhan_xet, graded_by = excluded.graded_by, updated_at = now();
  update buoi_hoc set danh_gia_xong_at = now(), updated_at = now() where id = p_buoi;
  if true then -- Thùy 17/10: xong 1 buổi là xong luôn (p_con_tiep còn nhận cho app cũ nhưng bị bỏ qua)
    perform public._bthinh_ket_thuc(hh.bo_tro_hinh_id, v_ns, 'day_xong', 'Người dạy hoàn tất ca ' || to_char(b.ngay, 'DD/MM'), now());
    v_kt := true;
  end if;
  return jsonb_build_object('da_xong', true, 'ket_thuc_case', v_kt);
end $function$
;

CREATE OR REPLACE FUNCTION public.fn_btyeu_suc_chua()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object('dang', count(*), 'cao', count(*) filter (where uu_tien = 3),
                            'tran', public._btyeu_tran_dang(), 'tran_cao', public._btyeu_tran_cao())
  from (select uu_tien from bo_tro_yeu where trang_thai = 'dang_xu' union all select uu_tien from bo_tro_hinh where trang_thai = 'dang_xu') u
$function$
;

CREATE OR REPLACE FUNCTION public.fn_btyeu_kiem_suc_chua(p_hs uuid, p_mon text, p_uu_tien integer)
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_dang int; v_cao int;
begin
  if exists (select 1 from bo_tro_yeu where hoc_sinh_id = p_hs and mon = p_mon and trang_thai = 'dang_xu') then return null; end if;
  select count(*), count(*) filter (where uu_tien = 3) into v_dang, v_cao from (select uu_tien from bo_tro_yeu where trang_thai = 'dang_xu' union all select uu_tien from bo_tro_hinh where trang_thai = 'dang_xu') u;
  if v_dang >= public._btyeu_tran_dang() then
    return format('Đã đủ %s/%s em đang bổ trợ yếu — muốn thêm em mới phải hạ L0 / huỷ 1 em cũ trước.', v_dang, public._btyeu_tran_dang());
  end if;
  if p_uu_tien = 3 and v_cao >= public._btyeu_tran_cao() then
    return format('Đã đủ %s/%s em ưu tiên Cao — chọn Thường, hoặc hạ ưu tiên 1 em Cao khác trước.', v_cao, public._btyeu_tran_cao());
  end if;
  return null;
end $function$
;
