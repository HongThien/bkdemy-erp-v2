-- ============================================================================
-- qlcl_team_man — Thùy 29/10:
--   "Trưởng khối là trưởng khối ở MỌI team: Trợ giảng, Học thuật, Quản lý chất lượng (Giáo viên KHÔNG có trưởng khối)."
--   + 1 màn "Team Quản lý chất lượng" gom team · chức vụ · phạm vi.
--
-- NGUỒN DUY NHẤT = phan_cong_quan_ly_khoi (vai 'truong'). Ghế "Trưởng khối …" ở 3 team ta · hoc_thuat · qlcl là ghế TỰ SINH
-- (vi_tri.tk_tu_dong = true) do trigger giữ khớp: ai là Trưởng ≥ 1 ô ⇒ có đúng 1 ghế tự sinh ở mỗi team, tên = "Trưởng khối <các khối>",
-- mang vai trò của team đó ⇒ tag team tự có (mig 202610291709). Hết ô ⇒ ghế để TRỐNG (không xoá), người sau dùng lại.
-- Người toàn hệ (ghế Lead/Quản lý chất lượng của qlcl — Thùy, Trang) KHÔNG sinh ghế trưởng khối (họ ở tầng trên).
-- ⇒ Trưởng ô KHÔNG còn phải "thuộc team qlcl trước" (bỏ điều kiện trong fn_qlcl_phan_cong_luu) — chọn ở ô là đủ.
--
-- Sửa cây ghế lệch từ P1 (mig 202610291556 dời ghế trưởng khối ta → qlcl):
--   · team ta: sinh lại ghế Trưởng khối của 6 người; ghế TA / Phó khối đang treo dưới ghế qlcl ⇒ về dưới ghế ta của cùng người.
--   · team hoc_thuat: 3 ghế tay đúng người (Dương 345 · Ngân 4T 5T · Hà Giang 6) ⇒ đánh dấu tự sinh, đổi tên theo phân công;
--     "Trưởng khối 7" (Quỳnh Trang) · "Trưởng khối 8" (Thảo Nguyên) — hai người này là PHÓ khối ⇒ đổi tên "Phó khối 7/8", giữ người.
--   · team qlcl: 6 ghế "Trưởng khối" ⇒ đánh dấu tự sinh.
--   · KHÔNG đụng: "Trưởng khối KHTN" (Anh Ngọc, ô KHTN chưa phân công) · ghế "Trưởng khối THCS/THPT/tiểu học" của team gv.
-- ============================================================================

alter table vi_tri add column if not exists tk_tu_dong boolean not null default false;
comment on column vi_tri.tk_tu_dong is 'Ghế Trưởng khối TỰ SINH từ phan_cong_quan_ly_khoi (spec-truong-khoi.md) — đừng sửa tay người/tên; đổi ở ô Trưởng (màn Phân công / Team QLCL).';

-- Gốc gắn ghế trưởng khối tự sinh của 1 team: ghế gốc cấp cao của team (qlcl: ghế phó = Quản lý chất lượng; còn lại: ghế trưởng không cha), ưu tiên đúng môn.
create or replace function public._tk_goc_team(p_team text, p_mon text)
returns uuid language sql stable security definer set search_path = public as $$
  select v.id from vi_tri v join team t on t.id = v.team_id and t.ma = p_team
   where not v.tk_tu_dong and v.cap = case when p_team = 'qlcl' then 'pho' else 'truong' end
     and (p_team = 'qlcl' or v.cha_id is null)
   order by (v.mon is not distinct from p_mon) desc, (v.nhan_su_id is not null) desc, v.created_at
   limit 1
$$;

-- Giữ khớp ghế tự sinh của 1 người với phân công.
create or replace function public._tk_dong_bo(p_ns uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_ten text; v_mon text; v_toan boolean; r record; v_ghe uuid; v_team uuid; v_vt uuid;
begin
  if p_ns is null then return; end if;
  select exists (select 1 from vi_tri v join team t on t.id = v.team_id and t.ma = 'qlcl'
                  where v.nhan_su_id = p_ns and not v.tk_tu_dong and v.cap in ('truong', 'pho')) into v_toan;
  select 'Trưởng khối ' || string_agg(case when x.mon = 'Toán' then x.khoi else x.mon || ' ' || x.khoi end, ' · '
                                      order by x.mon = 'Toán' desc, x.mon, coalesce(substring(x.khoi from '^[0-9]+')::int, 0), x.khoi),
         min(x.mon) filter (where x.mon = 'Toán')
    into v_ten, v_mon
    from phan_cong_quan_ly_khoi x join nhan_su n on n.id = x.nhan_su_id and n.trang_thai = 'dang_lam'
   where x.nhan_su_id = p_ns and x.vai = 'truong';
  v_mon := coalesce(v_mon, (select min(mon) from phan_cong_quan_ly_khoi where nhan_su_id = p_ns and vai = 'truong'));

  for r in select * from (values ('ta', 'Trợ giảng', 'truong'), ('hoc_thuat', 'Học thuật', 'thanh_vien'), ('qlcl', 'Quản lý chất lượng', 'thanh_vien')) t(ma, vai_tro, cap) loop
    v_team := (select id from team where ma = r.ma);
    if v_ten is null or v_toan then
      update vi_tri set nhan_su_id = null where team_id = v_team and tk_tu_dong and nhan_su_id = p_ns;
      continue;
    end if;
    v_vt := (select id from vai_tro where ten = r.vai_tro);
    select id into v_ghe from vi_tri where team_id = v_team and tk_tu_dong and nhan_su_id = p_ns order by created_at limit 1;
    if v_ghe is null then
      select id into v_ghe from vi_tri where team_id = v_team and tk_tu_dong and nhan_su_id is null order by created_at limit 1;
    end if;
    if v_ghe is null then
      insert into vi_tri (team_id, ten, cap, cha_id, nhan_su_id, vai_tro_id, mon, tk_tu_dong)
        values (v_team, v_ten, r.cap, public._tk_goc_team(r.ma, v_mon), p_ns, v_vt, v_mon, true);
    else
      update vi_tri set nhan_su_id = p_ns, ten = v_ten, vai_tro_id = coalesce(vai_tro_id, v_vt), mon = coalesce(mon, v_mon) where id = v_ghe;
    end if;
  end loop;
end $$;

create or replace function public._trg_pcqlk_dong_bo_ghe()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then perform public._tk_dong_bo(old.nhan_su_id); end if;
  if tg_op in ('INSERT', 'UPDATE') then perform public._tk_dong_bo(new.nhan_su_id); end if;
  return null;
end $$;
drop trigger if exists pcqlk_dong_bo_ghe_trg on phan_cong_quan_ly_khoi;
create trigger pcqlk_dong_bo_ghe_trg after insert or update or delete on phan_cong_quan_ly_khoi
  for each row execute function public._trg_pcqlk_dong_bo_ghe();

-- ── Sửa cây lệch (1 lần) ──
-- qlcl: 6 ghế "Trưởng khối" (P1) ⇒ tự sinh
update vi_tri v set tk_tu_dong = true from team t
 where t.id = v.team_id and t.ma = 'qlcl' and v.ten = 'Trưởng khối' and v.cap = 'thanh_vien';
-- hoc_thuat: ghế tay đúng người ⇒ tự sinh; ghế tay sai (là Phó) ⇒ đổi tên
update vi_tri v set tk_tu_dong = true from team t
 where t.id = v.team_id and t.ma = 'hoc_thuat' and v.ten like 'Trưởng khối%' and v.mon = 'Toán'
   and exists (select 1 from phan_cong_quan_ly_khoi p where p.nhan_su_id = v.nhan_su_id and p.vai = 'truong');
update vi_tri v set ten = replace(v.ten, 'Trưởng khối', 'Phó khối') from team t
 where t.id = v.team_id and t.ma = 'hoc_thuat' and v.ten like 'Trưởng khối%' and v.mon = 'Toán' and not v.tk_tu_dong
   and exists (select 1 from phan_cong_quan_ly_khoi p where p.nhan_su_id = v.nhan_su_id and p.vai = 'pho');

-- Chạy đồng bộ cho mọi Trưởng hiện có (sinh ghế ta còn thiếu, đặt tên theo phân công)
do $$ declare r record; begin
  for r in select distinct nhan_su_id from phan_cong_quan_ly_khoi where vai = 'truong' loop perform public._tk_dong_bo(r.nhan_su_id); end loop;
end $$;

-- team ta: ghế (TA / Phó khối) đang treo dưới ghế trưởng khối qlcl ⇒ về dưới ghế trưởng khối ta của CÙNG người
update vi_tri c set cha_id = ta_tk.id
  from vi_tri q join team tq on tq.id = q.team_id and tq.ma = 'qlcl',
       vi_tri ta_tk join team tt on tt.id = ta_tk.team_id and tt.ma = 'ta'
 where c.cha_id = q.id and q.tk_tu_dong and ta_tk.tk_tu_dong and ta_tk.nhan_su_id = q.nhan_su_id
   and c.team_id = tt.id;

-- team hoc_thuat: ghế trưởng khối tự sinh (kể cả 3 ghế tay vừa chuyển) đứng thẳng dưới ghế gốc (Lead học thuật)
update vi_tri v set cha_id = public._tk_goc_team('hoc_thuat', v.mon) from team t
 where t.id = v.team_id and t.ma = 'hoc_thuat' and v.tk_tu_dong;

do $$ declare n int; begin
  select count(*) into n from vi_tri c join vi_tri p on p.id = c.cha_id where c.team_id <> p.team_id;
  if n > 0 then raise exception 'Còn % ghế có cha ở team khác', n; end if;
end $$;

-- ── Trưởng ô: chọn bất kỳ nhân sự đang làm (ghế + team tự sinh theo) ──
create or replace function public.fn_qlcl_phan_cong_luu(p_mon text, p_khoi text, p_vai text, p_nhan_su_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public._qlcl_toan_he() then raise exception 'Chỉ Lead / Quản lý chất lượng được phân công trưởng khối.'; end if;
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

-- ── Màn Team Quản lý chất lượng ──
insert into vai_tro_chuc_nang (vai_tro_id, chuc_nang, chi_xem)
select id, 'qlcl_team', false from vai_tro where ten = 'Core team'
union all
select id, 'qlcl_team', true from vai_tro where ten = 'Quản lý chất lượng'
on conflict do nothing;

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
    'duoc_sua', public._qlcl_toan_he(),
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

do $$
declare f text;
begin
  foreach f in array array['public.fn_qlcl_team()', 'public._tk_dong_bo(uuid)', 'public._tk_goc_team(text, text)', 'public._trg_pcqlk_dong_bo_ghe()'] loop
    execute format('revoke execute on function %s from public', f);
    execute format('revoke execute on function %s from anon', f);
  end loop;
  execute 'grant execute on function public.fn_qlcl_team() to authenticated';
end $$;
