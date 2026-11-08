-- ============================================================================
-- quan_ly_mon_xoa_tag_thua — Thùy 29/10:
--  (1) "Xoá hết đi": 21 tag team tay KHÔNG có ghế tương ứng (danh sách đã trình Thùy, Thùy gật). Team suy từ ghế (mig 202610291709).
--  (2) "Thùy, Ngọc, Hoà là quản lý cao nhất của từng bộ môn, phải full quyền của môn đó — kiểu admin."
--      QUẢN LÝ MÔN = người ngồi ghế GỐC của môn ở team Giáo viên (vi_tri: team gv, cap 'truong', cha_id null, mon = môn):
--      Toán — Thùy ("Giám đốc trung tâm") · KHTN — Ngọc ("Trưởng bộ môn KHTN") · Tiếng Anh — Hoà ("Quản lý môn"). Theo GHẾ, không uuid.
--      ⇒ phạm vi = MỌI ô (môn × khối) của môn mình (sửa phân công trưởng khối, gậy, ca Nhẹ, widget, màn Team QLCL của môn đó);
--      ⇒ vai trò mới "Quản lý môn" trên ghế gốc đó = hợp mọi màn chuyên môn (GV · TA · Học thuật · Quản lý chất lượng), đều được sửa.
-- ============================================================================

-- ── (1) Xoá tag tay không có ghế ──
do $$ declare n int; begin
  delete from nhan_su_team nt
   where not exists (select 1 from vi_tri v where v.nhan_su_id = nt.nhan_su_id and v.team_id = nt.team_id);
  get diagnostics n = row_count;
  if n > 21 then raise exception 'Định xoá % tag — nhiều hơn 21 dòng đã trình Thùy, dừng.', n; end if;
  raise notice 'Đã xoá % tag team không có ghế', n;
end $$;

-- ── (2) Quản lý môn ──
create or replace function public._quan_ly_mon_cua(p_ns uuid)
returns text[] language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(distinct v.mon), '{}')
    from vi_tri v join team t on t.id = v.team_id and t.ma = 'gv'
   where v.nhan_su_id = p_ns and v.cap = 'truong' and v.cha_id is null and v.mon is not null
$$;
create or replace function public._quan_ly_mon()
returns text[] language sql stable security definer set search_path = public as $$
  select public._quan_ly_mon_cua(public.current_nhan_su_id())
$$;

-- Phạm vi của tôi: toàn hệ > quản lý môn > ô được phân công (mỗi ô 1 dòng)
create or replace function public.fn_pham_vi_cua_toi()
returns table (mon text, khoi text, vai text)
language sql stable security definer set search_path = public as $$
  select distinct on (x.mon, x.khoi) x.mon, x.khoi, x.vai from (
    select l.mon, l.khoi, 'toan_he'::text as vai, 0 as uu
      from lop l where public._qlcl_toan_he() and l.trang_thai = 'dang_hoc' and l.khoi is not null
    union all
    select l.mon, l.khoi, 'quan_ly_mon', 1
      from lop l where l.trang_thai = 'dang_hoc' and l.khoi is not null and l.mon = any(public._quan_ly_mon())
    union all
    select q.mon, q.khoi, q.cap, 2 from public._khoi_quan_ly() q where q.nhan_su_id = public.current_nhan_su_id()
  ) x order by x.mon, x.khoi, x.uu
$$;

create or replace function public._trong_pham_vi(p_mon text, p_khoi text)
returns boolean language sql stable security definer set search_path = public as $$
  select public._qlcl_toan_he()
      or p_mon = any(public._quan_ly_mon())
      or exists (select 1 from public._khoi_quan_ly() q
                  where q.nhan_su_id = public.current_nhan_su_id() and q.mon = p_mon and q.khoi = p_khoi)
$$;

create or replace function public._btnhe_duoc_tao(p_mon text, p_khoi text)
returns boolean language sql stable security definer set search_path = public as $$
  select public._qlcl_toan_he()
      or p_mon = any(public._quan_ly_mon())
      or exists (select 1 from public._khoi_quan_ly() q
                  where q.nhan_su_id = public.current_nhan_su_id() and q.mon = p_mon and q.khoi = p_khoi and q.cap = 'truong')
$$;

-- Gậy: quản lý môn duyệt như Trưởng mọi khối của môn mình
create or replace function public.fn_gay_pham_vi_khoi()
returns jsonb language sql stable security definer set search_path = public as $$
  with me as (select public.current_nhan_su_id() as id, public._qlcl_toan_he() as toan),
  o as (select p.mon, p.khoi from public.fn_pham_vi_cua_toi() p where p.vai in ('truong', 'quan_ly_mon')),
  lop_toi as (select l.id from lop l join o on o.mon = l.mon and o.khoi = l.khoi)
  select jsonb_build_object(
    'toan_quyen', me.toan,
    'khoi', coalesce((select jsonb_agg(distinct o.khoi) from o), '[]'::jsonb),
    'mon',  coalesce((select jsonb_agg(distinct o.mon) from o), '[]'::jsonb),
    'ns_ids', coalesce((
      select jsonb_agg(distinct pc.nhan_su_id) from phan_cong_lop pc join lop_toi l on l.id = pc.lop_id
       where pc.nhan_su_id <> me.id), '[]'::jsonb),
    'de_xuat_ids', coalesce((
      select jsonb_agg(d.id) from gay_de_xuat d
        join buoi_hoc b on b.id::text = substring(d.ref_key from '^vh:([0-9a-f-]{36})[|]')
        join lop_toi l on l.id = b.lop_id
       where d.trang_thai = 'cho' and d.nhan_su_id <> me.id), '[]'::jsonb))
  from me
$$;

-- Phân công trưởng khối: toàn hệ, hoặc quản lý môn cho đúng môn mình
create or replace function public.fn_qlcl_phan_cong_luu(p_mon text, p_khoi text, p_vai text, p_nhan_su_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not (public._qlcl_toan_he() or p_mon = any(public._quan_ly_mon())) then
    raise exception 'Chỉ Lead / Quản lý chất lượng hoặc quản lý môn % được phân công trưởng khối môn này.', p_mon;
  end if;
  if p_vai not in ('truong', 'pho') then raise exception 'Vai không hợp lệ: %', p_vai; end if;
  if nullif(trim(coalesce(p_mon, '')), '') is null or nullif(trim(coalesce(p_khoi, '')), '') is null then raise exception 'Thiếu môn/khối.'; end if;
  if p_nhan_su_id is null then
    delete from phan_cong_quan_ly_khoi where mon = p_mon and khoi = p_khoi and vai = p_vai;
    return;
  end if;
  if not exists (select 1 from nhan_su where id = p_nhan_su_id and trang_thai = 'dang_lam') then raise exception 'Nhân sự không hợp lệ.'; end if;
  insert into phan_cong_quan_ly_khoi (mon, khoi, vai, nhan_su_id, phan_cong_boi, phan_cong_at)
  values (p_mon, p_khoi, p_vai, p_nhan_su_id, public.current_nhan_su_id(), now())
  on conflict (mon, khoi, vai) do update
    set nhan_su_id = excluded.nhan_su_id, phan_cong_boi = excluded.phan_cong_boi, phan_cong_at = excluded.phan_cong_at;
end $$;

-- Màn Phân công / Team QLCL: được sửa = toàn hệ hoặc quản lý ≥ 1 môn (từng ô DB tự chặn đúng môn)
create or replace function public.fn_qlcl_duoc_phan_cong()
returns boolean language sql stable security definer set search_path = public as $$
  select public._qlcl_toan_he() or cardinality(public._quan_ly_mon()) > 0
$$;

-- fn_qlcl_team: thêm mon_sua (null = mọi môn; mảng = chỉ các môn đó)
create or replace function public.fn_qlcl_team()
returns jsonb language sql stable security definer set search_path = public as $$
  with tv as (
    select distinct v.nhan_su_id from vi_tri v join team t on t.id = v.team_id and t.ma = 'qlcl' where v.nhan_su_id is not null
  ),
  o as (
    select l.mon, l.khoi from lop l where l.trang_thai = 'dang_hoc' and l.khoi is not null
    union select p.mon, p.khoi from phan_cong_quan_ly_khoi p
  )
  select case when not public.la_thanh_vien() then null else jsonb_build_object(
    'duoc_sua', public._qlcl_toan_he() or cardinality(public._quan_ly_mon()) > 0,
    'mon_sua', case when public._qlcl_toan_he() then null else to_jsonb(public._quan_ly_mon()) end,
    'thanh_vien', coalesce((
      select jsonb_agg(jsonb_build_object(
        'nhan_su_id', n.id, 'ho_ten', n.ho_ten,
        'ghe', (select coalesce(jsonb_agg(jsonb_build_object('ten', v.ten, 'cap', v.cap, 'team_ma', t.ma, 'team_ten', t.ten, 'vai_tro', vt.ten, 'tu_dong', v.tk_tu_dong)
                                          order by (t.ma = 'qlcl') desc, t.thu_tu), '[]'::jsonb)
                  from vi_tri v join team t on t.id = v.team_id left join vai_tro vt on vt.id = v.vai_tro_id where v.nhan_su_id = n.id),
        'o', (select coalesce(jsonb_agg(jsonb_build_object('mon', p.mon, 'khoi', p.khoi, 'vai', p.vai) order by p.mon, p.khoi), '[]'::jsonb)
                from phan_cong_quan_ly_khoi p where p.nhan_su_id = n.id))
        order by n.ho_ten)
      from tv join nhan_su n on n.id = tv.nhan_su_id), '[]'::jsonb),
    'o', coalesce((
      select jsonb_agg(jsonb_build_object(
        'mon', o.mon, 'khoi', o.khoi,
        'so_lop', (select count(*) from lop l where l.trang_thai = 'dang_hoc' and l.mon = o.mon and l.khoi = o.khoi),
        'so_hs', (select count(*) from public._qlcl_hs_cua_o(o.mon, o.khoi)),
        'truong_id', tr.nhan_su_id, 'truong_ten', ntr.ho_ten, 'pho_id', ph.nhan_su_id, 'pho_ten', nph.ho_ten)
        order by o.mon = 'Toán' desc, o.mon, coalesce(substring(o.khoi from '^[0-9]+')::int, 0), o.khoi)
      from o
      left join phan_cong_quan_ly_khoi tr on tr.mon = o.mon and tr.khoi = o.khoi and tr.vai = 'truong' left join nhan_su ntr on ntr.id = tr.nhan_su_id
      left join phan_cong_quan_ly_khoi ph on ph.mon = o.mon and ph.khoi = o.khoi and ph.vai = 'pho' left join nhan_su nph on nph.id = ph.nhan_su_id), '[]'::jsonb)
  ) end
$$;

-- Vai trò "Quản lý môn": hợp mọi màn chuyên môn, đều được sửa
insert into vai_tro (ten, mo_ta)
select 'Quản lý môn', 'Quản lý cao nhất 1 bộ môn (Thùy 29/10): mọi màn chuyên môn (GV · TA · Học thuật · Quản lý chất lượng), sửa được. Phạm vi = mọi khối của môn mình (_quan_ly_mon).'
where not exists (select 1 from vai_tro where ten = 'Quản lý môn');
insert into vai_tro_chuc_nang (vai_tro_id, chuc_nang, chi_xem)
select (select id from vai_tro where ten = 'Quản lý môn'), x.chuc_nang, false
  from (select distinct vc.chuc_nang from vai_tro_chuc_nang vc join vai_tro r on r.id = vc.vai_tro_id
         where r.ten in ('GV thường', 'Trợ giảng', 'Học thuật', 'Quản lý chất lượng')
        union select unnest(array['phancong', 'qlcl_team', 'botro', 'gay', 'cham_mt', 'duyetcham'])) x
on conflict do nothing;
update vi_tri v set vai_tro_id = (select id from vai_tro where ten = 'Quản lý môn') from team t
 where t.id = v.team_id and t.ma = 'gv' and v.cap = 'truong' and v.cha_id is null and v.mon is not null and v.nhan_su_id is not null;

do $$
declare f text;
begin
  foreach f in array array['public._quan_ly_mon_cua(uuid)', 'public._quan_ly_mon()'] loop
    execute format('revoke execute on function %s from public', f);
    execute format('revoke execute on function %s from anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
