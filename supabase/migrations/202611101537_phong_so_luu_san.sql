-- ============================================================================
-- Phòng làm việc (Giám đốc · Trưởng bộ môn · Trưởng khối): SỐ LƯU SẴN, không tính lại mỗi lần mở — Thùy 10/11
--
-- Bệnh: mở phòng Giám đốc = tính hiệu suất tháng của MỌI TA dưới MỌI trưởng khối của MỌI môn ngay trong lượt gọi
-- (đo 10/11: fn_phong_ghe_gd 29,7 s · fn_phong_ghe_tbm 22,8 s · fn_phong_cap_duoi 5,8 s) — vượt trần 8 s ⇒
-- "canceling statement due to statement timeout"; client còn gọi lại mỗi 60 giây.
--
-- Luật (Thùy 10/11): hiển thị cái gì gọi cái đấy · bấm đến đâu gọi đến đấy · số không cần realtime thì không tính realtime.
--   ⇒ Số hiệu suất / việc / gậy của từng GHẾ (trưởng khối · ô chưa có trưởng khối) LƯU SẴN ở phong_so_luu,
--     máy tính lại ngầm (cron 5 phút, mỗi ghế cũ quá 10 phút, ngân sách 25 s/lượt). Màn phòng chỉ ĐỌC.
--   ⇒ Chi tiết 1 TA (fn_phong_cap_duoi_chi_tiet_pv, ~1 s) vẫn tính lúc bấm — đúng "bấm đến đâu gọi đến đấy".
--
-- Công thức KHÔNG đổi: số của 1 ghế = _phong_chi_so_pv(TA của các ô, lớp của các ô) như cũ.
-- Khác duy nhất: tính KHÔNG theo phạm vi người xem (cron không có người xem). Không đổi kết quả vì phạm vi
-- người xem cắt theo Ô, mà mỗi ghế chỉ thuộc 1 môn (đo 10/11: 0 trưởng khối giữ ô ở 2 môn) — phạm vi vẫn
-- chặn ở lúc ĐỌC (ghế/ô ngoài phạm vi không trả về).
-- Khoá cache:  'tk:<ns>'        = ô vai 'truong' của trưởng khối (phòng TBM/GĐ, khớp _phong_ta_cua_tk)
--              'o:<mon>|<khoi>' = ô chưa có trưởng khối (khớp _phong_ta_cua_o)
--              'pv:<ns>'        = MỌI ô người đó quản (truong + pho) — phòng trưởng khối của chính họ (khớp _khoi_quan_ly);
--                                 chỉ lập cho người có ô 'pho', còn lại 'pv' = 'tk'.
-- Không xoá gì: dòng cache của ghế không còn tồn tại nằm im (đọc luôn join danh sách ghế đang sống).
-- Cron: file 202611101538_phong_so_luu_san_cron_sql_editor.sql (chạy ở SQL Editor).
-- ============================================================================

create table if not exists public.phong_so_luu (
  khoa     text primary key,
  o        jsonb not null,              -- [[mon, khoi], ...] các ô đã dùng để tính
  ta       jsonb not null,              -- [{nhan_su_id, khoi[], hieu_suat, hieu_suat_du, viec_tuan, dang_lam, da_xong, tre_han, qua_han, gay_thang}]
  tinh_luc timestamptz not null default now()
);
comment on table public.phong_so_luu is 'Số Phòng làm việc lưu sẵn theo ghế (mig 202611101537). Chỉ _phong_so_lam_moi ghi; màn phòng chỉ đọc.';
alter table public.phong_so_luu enable row level security;
revoke all on public.phong_so_luu from anon, authenticated;

-- Danh sách ghế đang sống + ô của từng ghế (không theo người xem).
create or replace function public._phong_so_khoa()
returns table(khoa text, o jsonb)
language sql stable security definer set search_path = public as $$
  with o_song as (select distinct l.mon, l.khoi from lop l where l.trang_thai = 'dang_hoc' and l.khoi is not null and l.mon is not null),
  q as (select q.nhan_su_id, q.mon, q.khoi, q.vai from phan_cong_quan_ly_khoi q
          join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
          join o_song s on s.mon = q.mon and s.khoi = q.khoi)
  select 'tk:' || q.nhan_su_id, jsonb_agg(jsonb_build_array(q.mon, q.khoi) order by q.mon, q.khoi)
    from q where q.vai = 'truong' group by q.nhan_su_id
  union all
  select 'pv:' || q.nhan_su_id, jsonb_agg(distinct jsonb_build_array(q.mon, q.khoi))
    from q where q.nhan_su_id in (select x.nhan_su_id from q x where x.vai = 'pho') group by q.nhan_su_id
  union all
  select 'o:' || s.mon || '|' || s.khoi, jsonb_build_array(jsonb_build_array(s.mon, s.khoi))
    from o_song s where not exists (select 1 from q where q.mon = s.mon and q.khoi = s.khoi and q.vai = 'truong')
$$;

-- Tính số của 1 tập ô (cùng công thức _phong_chi_so_pv như cũ).
create or replace function public._phong_so_tinh_o(p_o jsonb)
returns jsonb
language sql stable security definer set search_path = public as $$
  with oo as (select e->>0 as mon, e->>1 as khoi from jsonb_array_elements(p_o) e),
  lp as (select l.id, l.khoi from lop l join oo on oo.mon = l.mon and oo.khoi = l.khoi where l.trang_thai = 'dang_hoc'),
  ta as (select pc.nhan_su_id, array_agg(distinct lp.khoi order by lp.khoi) as khoi
           from lp join phan_cong_lop pc on pc.lop_id = lp.id and pc.vai_tro = 'tg'
           join nhan_su n on n.id = pc.nhan_su_id and n.trang_thai = 'dang_lam' and not n.an_xep_hang
          group by pc.nhan_su_id)
  select coalesce(jsonb_agg(jsonb_build_object(
           'nhan_su_id', ta.nhan_su_id, 'khoi', to_jsonb(ta.khoi), 'hieu_suat', c.hieu_suat, 'hieu_suat_du', c.hieu_suat_du,
           'viec_tuan', c.viec_tuan, 'dang_lam', c.dang_lam, 'da_xong', c.da_xong, 'tre_han', c.tre_han,
           'qua_han', c.qua_han, 'gay_thang', c.gay_thang)), '[]'::jsonb)
    from ta
    join public._phong_chi_so_pv(array(select t.nhan_su_id from ta t), array(select lp.id from lp)) c on c.nhan_su_id = ta.nhan_su_id
$$;

-- Làm mới: ghế chưa có số / ô đổi / cũ quá p_cu_phut phút — cũ nhất trước, dừng khi hết ngân sách giây.
create or replace function public._phong_so_lam_moi(p_ngan_giay int default 25, p_cu_phut int default 10)
returns int
language plpgsql volatile security definer set search_path = public as $$
declare
  v_bd timestamptz := clock_timestamp();
  v_n int := 0;
  r record;
begin
  for r in
    select k.khoa, k.o from public._phong_so_khoa() k
      left join phong_so_luu c on c.khoa = k.khoa
     where c.khoa is null or c.o is distinct from k.o or c.tinh_luc < now() - make_interval(mins => p_cu_phut)
     order by c.tinh_luc nulls first
  loop
    exit when clock_timestamp() - v_bd > make_interval(secs => p_ngan_giay);
    insert into phong_so_luu (khoa, o, ta, tinh_luc)
    values (r.khoa, r.o, public._phong_so_tinh_o(r.o), clock_timestamp())
    on conflict (khoa) do update set o = excluded.o, ta = excluded.ta, tinh_luc = excluded.tinh_luc;
    v_n := v_n + 1;
  end loop;
  return v_n;
end $$;

-- Số đọc từ cache cho 1 khoá, dạng hàng TA (cùng hình dạng fn_phong_cap_duoi).
create or replace function public._phong_so_ta(p_khoa text)
returns table(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[], hieu_suat numeric, hieu_suat_du boolean,
              viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
language sql stable security definer set search_path = public as $$
  select n.id, n.ho_ten, n.anh_url, array(select jsonb_array_elements_text(t->'khoi')),
         (t->>'hieu_suat')::numeric, coalesce((t->>'hieu_suat_du')::boolean, false),
         (t->>'viec_tuan')::int, (t->>'dang_lam')::int, (t->>'da_xong')::int, (t->>'tre_han')::int, (t->>'qua_han')::int, (t->>'gay_thang')::int
    from phong_so_luu c cross join lateral jsonb_array_elements(c.ta) t
    join nhan_su n on n.id = (t->>'nhan_su_id')::uuid
   where c.khoa = p_khoa
$$;

-- ── Đọc: cùng chữ ký, cùng phạm vi, số lấy từ cache ─────────────────────────
create or replace function public._phong_ghe_tbm_core(p_mon text[])
returns table(khoa text, nhan_su_id uuid, ho_ten text, anh_url text, o text[], mon text, khoi text, so_ta integer, so_ta_co_hs integer,
              hieu_suat numeric, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
begin
  return query
  with o_ds as (   -- ô của phòng = lớp đang học, đúng môn của phòng (và đúng môn được hỏi) — như cũ
    select distinct l.mon, l.khoi from lop l
     where l.trang_thai = 'dang_hoc' and l.khoi is not null and public._phong_trong_pham_vi(l.mon, l.khoi)
       and (p_mon is null or l.mon = any(p_mon))
  ),
  ghe as (
    select 'tk:' || q.nhan_su_id as khoa, q.nhan_su_id, null::text as mon, null::text as khoi,
           array_agg((case when q.mon = 'Toán' then '' else q.mon || ' ' end) || q.khoi
                     order by q.mon, coalesce(substring(q.khoi from '^[0-9]+')::int, 0), q.khoi) as o,
           min(q.mon) as m_sx, min(coalesce(substring(q.khoi from '^[0-9]+')::int, 0)) as k_sx
      from phan_cong_quan_ly_khoi q
      join o_ds on o_ds.mon = q.mon and o_ds.khoi = q.khoi
      join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
     where q.vai = 'truong'
     group by q.nhan_su_id
    union all
    select 'o:' || o_ds.mon || '|' || o_ds.khoi, null, o_ds.mon, o_ds.khoi,
           array[(case when o_ds.mon = 'Toán' then '' else o_ds.mon || ' ' end) || o_ds.khoi],
           o_ds.mon, coalesce(substring(o_ds.khoi from '^[0-9]+')::int, 0)
      from o_ds
     where not exists (select 1 from phan_cong_quan_ly_khoi q
                        join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
                       where q.mon = o_ds.mon and q.khoi = o_ds.khoi and q.vai = 'truong')
  )
  select g.khoa, g.nhan_su_id, n.ho_ten, n.anh_url, g.o, g.mon, g.khoi,
         coalesce(s.so_ta, 0), coalesce(s.so_ta_co_hs, 0), s.hs,
         coalesce(s.vt, 0), coalesce(s.dl, 0), coalesce(s.dx, 0), coalesce(s.tr, 0), coalesce(s.qh, 0), coalesce(s.gy, 0)
    from ghe g
    left join nhan_su n on n.id = g.nhan_su_id
    left join phong_so_luu c on c.khoa = g.khoa
    left join lateral (
      select count(*)::int as so_ta, count(t->>'hieu_suat')::int as so_ta_co_hs, round(avg((t->>'hieu_suat')::numeric), 1) as hs,
             sum((t->>'viec_tuan')::int)::int as vt, sum((t->>'dang_lam')::int)::int as dl, sum((t->>'da_xong')::int)::int as dx,
             sum((t->>'tre_han')::int)::int as tr, sum((t->>'qua_han')::int)::int as qh, sum((t->>'gay_thang')::int)::int as gy
        from jsonb_array_elements(c.ta) t) s on true
   order by g.m_sx, g.k_sx, g.khoa;
end $$;

-- Phòng của 1 trưởng khối (TBM/GĐ bấm vào ghế): chỉ khi ít nhất 1 ô của ghế trong phạm vi người xem (như cũ).
create or replace function public.fn_phong_cap_duoi_cua(p_tk uuid)
returns table(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[], hieu_suat numeric, hieu_suat_du boolean,
              viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
language plpgsql stable security definer set search_path = public as $$
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn xem được phòng của trưởng khối khác'; end if;
  return query
  select t.* from public._phong_so_ta('tk:' || p_tk) t
   where exists (select 1 from phong_so_luu c cross join lateral jsonb_array_elements(c.o) e
                  where c.khoa = 'tk:' || p_tk and public._phong_trong_pham_vi(e->>0, e->>1))
   order by t.ho_ten;
end $$;

create or replace function public.fn_phong_cap_duoi_o(p_mon text, p_khoi text)
returns table(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[], hieu_suat numeric, hieu_suat_du boolean,
              viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
language plpgsql stable security definer set search_path = public as $$
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn xem được'; end if;
  return query
  select t.* from public._phong_so_ta('o:' || p_mon || '|' || p_khoi) t
   where public._phong_trong_pham_vi(p_mon, p_khoi)
   order by t.ho_ten;
end $$;

-- Phòng trưởng khối của chính mình: ô = mọi ô mình quản (truong + pho), bỏ chính mình khỏi danh sách (như cũ).
create or replace function public.fn_phong_cap_duoi()
returns table(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[], hieu_suat numeric, hieu_suat_du boolean,
              viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
language sql stable security definer set search_path = public as $$
  select t.* from public._phong_so_ta(
           case when exists (select 1 from phong_so_luu c where c.khoa = 'pv:' || public.current_nhan_su_id())
                then 'pv:' else 'tk:' end || public.current_nhan_su_id()) t
   where t.nhan_su_id is distinct from public.current_nhan_su_id()
   order by t.ho_ten
$$;

-- Số đang hiện tính lúc nào (ghế cũ nhất) — màn ghi "Số tính lúc HH:MM".
create or replace function public.fn_phong_so_luc()
returns timestamptz
language sql stable security definer set search_path = public as $$
  select min(c.tinh_luc) from phong_so_luu c join public._phong_so_khoa() k on k.khoa = c.khoa
$$;

revoke execute on function public._phong_so_khoa(), public._phong_so_tinh_o(jsonb), public._phong_so_lam_moi(int, int),
  public._phong_so_ta(text) from public, anon, authenticated;
revoke execute on function public.fn_phong_so_luc() from public, anon;
grant execute on function public.fn_phong_so_luc() to authenticated;

-- Tính ngầm (cron / migrate) không có người gọi ⇒ _hsta_thang_core từ chối "Không có quyền xem hiệu suất".
-- Nhận diện tác vụ phía DB bằng session_user: app/PostgREST luôn vào bằng 'authenticator' (rồi đổi role anon/authenticated),
-- nên người dùng app KHÔNG BAO GIỜ lọt qua đây. Danh sách CHO PHÉP (không phải danh sách cấm — còn fdw_bkdemy_web, supabase_admin…): chỉ cron + SQL Editor (postgres) · migrate (claude_build).
create or replace function public._la_tac_vu_nen()
returns boolean language sql stable as $$
  select session_user::text in ('postgres', 'claude_build')
$$;
revoke execute on function public._la_tac_vu_nen() from anon;

-- _hsta_thang_core(date,uuid,uuid[]): nguyên văn bản đang chạy, chỉ thêm "_la_tac_vu_nen() or" vào dòng kiểm quyền.
CREATE OR REPLACE FUNCTION public._hsta_thang_core(p_ky date, p_ns uuid, p_lop uuid[])
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, btvn_so_task integer, btvn_so_tinh integer, btvn_de_xuat numeric, btvn_so_co integer, et_so_task integer, et_so_tinh integer, et_de_xuat numeric, et_so_co integer, bt_so_ca integer, bt_gio_he_thong numeric, bt_gio_ghi_them numeric, bt_chi_tieu_gio numeric, bt_so_co integer, tong_de_xuat numeric, tong_du_3_dau_viec boolean, chot jsonb, so_ghi_them integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
declare
  v_tu  date := date_trunc('month', p_ky)::date;
  v_den date := (date_trunc('month', p_ky) + interval '1 month - 1 day')::date;
begin
  if not (public._la_tac_vu_nen() or public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with tk_all as materialized (
    select x.*, coalesce(b.lop_id = any(p_lop), false) as trong
    from public.fn_hsta_task(v_tu, v_den, p_ns) x left join buoi_hoc b on b.id = x.buoi_id
  ),
  -- TA còn việc ngoài phạm vi ⇒ số cả-người (chốt, bổ trợ, ghi thêm) không chia được theo khối ⇒ không dùng
  ngoai as (select distinct a.nhan_su_id from tk_all a where p_lop is not null and not a.trong),
  tk as (select * from tk_all a where p_lop is null or a.trong),
  bt as (select * from public.fn_hsta_bo_tro(v_tu, v_den, p_ns) b where b.nhan_su_id not in (select n.nhan_su_id from ngoai n)),
  -- giờ bổ trợ tạm tính: HỢP các khoảng giờ hợp lệ có HS (gộp ca trùng khung — nhiều em chung 1 ca)
  bt_gio as (
    select r.nhan_su_id, sum(extract(epoch from (upper(m) - lower(m))) / 3600) as gio
    from (select bt.nhan_su_id, range_agg(tsrange(bt.ngay + bt.gio_bat_dau, bt.ngay + bt.gio_ket_thuc)) as mr
          from bt where bt.so_co_mat > 0 and bt.gio_ket_thuc > bt.gio_bat_dau
          group by bt.nhan_su_id) r
    cross join lateral unnest(r.mr) m
    group by r.nhan_su_id
  ),
  gt as (
    select g.nhan_su_id, count(*)::int as n, sum(g.so_gio) filter (where g.dau_viec = 'bo_tro') as gio
    from hsta_ghi_them g where g.ky = v_tu and g.xoa_at is null and (p_ns is null or g.nhan_su_id = p_ns)
      and g.nhan_su_id not in (select n.nhan_su_id from ngoai n)
    group by g.nhan_su_id
  ),
  ch as (
    select c.nhan_su_id, jsonb_object_agg(c.dau_viec, jsonb_build_object(
      'diem_chot', c.diem_chot, 'diem_he_thong', c.diem_he_thong, 'ghi_chu', c.ghi_chu,
      'nguoi_chot', n.ho_ten, 'chot_at', c.chot_at)) as j
    from hsta_chot c left join nhan_su n on n.id = c.nguoi_chot
    where c.ky = v_tu and (p_ns is null or c.nhan_su_id = p_ns)
      and c.nhan_su_id not in (select n2.nhan_su_id from ngoai n2)
    group by c.nhan_su_id
  ),
  ds as (
    select tk.nhan_su_id, tk.ho_ten from tk
    union select bt.nhan_su_id, bt.ho_ten from bt
    union select g.nhan_su_id, n.ho_ten from hsta_ghi_them g join nhan_su n on n.id = g.nhan_su_id
      where g.ky = v_tu and g.xoa_at is null and not n.an_xep_hang and (p_ns is null or g.nhan_su_id = p_ns)
        and g.nhan_su_id not in (select n3.nhan_su_id from ngoai n3)
  ),
  agg as (
    select ds.nhan_su_id, ds.ho_ten,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn')::int as b_n,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn' and tk.tinh)::int as b_t,
      (select round(avg(tk.diem), 1) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn' and tk.tinh) as b_d,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn' and (cardinality(tk.co) > 0 or not tk.tinh))::int as b_c,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et')::int as e_n,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et' and tk.tinh)::int as e_t,
      (select round(avg(tk.diem), 1) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et' and tk.tinh) as e_d,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et' and (cardinality(tk.co) > 0 or not tk.tinh))::int as e_c,
      (select count(*) from bt where bt.nhan_su_id = ds.nhan_su_id and bt.so_co_mat > 0)::int as t_n,
      (select round(g.gio::numeric, 1) from bt_gio g where g.nhan_su_id = ds.nhan_su_id) as t_gio,
      (select count(*) from bt where bt.nhan_su_id = ds.nhan_su_id and cardinality(bt.co) > 0)::int as t_c
    from (select distinct * from ds) ds
  ),
  mix as (
    -- tổng đề xuất: mỗi đầu việc lấy số ĐÃ CHỐT nếu có, không thì số hệ thống; bổ trợ chỉ có khi đã chốt
    select a.*, ch.j, gt.n as gt_n, gt.gio as gt_gio,
      coalesce((ch.j -> 'btvn' ->> 'diem_chot')::numeric, a.b_d) as b_x,
      coalesce((ch.j -> 'et' ->> 'diem_chot')::numeric, a.e_d) as e_x,
      (ch.j -> 'bo_tro' ->> 'diem_chot')::numeric as t_x
    from agg a left join ch on ch.nhan_su_id = a.nhan_su_id left join gt on gt.nhan_su_id = a.nhan_su_id
  )
  select m.nhan_su_id, m.ho_ten,
    m.b_n, m.b_t, m.b_d, m.b_c,
    m.e_n, m.e_t, m.e_d, m.e_c,
    m.t_n, coalesce(m.t_gio, 0), coalesce(m.gt_gio, 0), public._hsta_chi_tieu_gio_bo_tro(), m.t_c,
    round((coalesce(m.b_x * public._hsta_ti_trong('btvn'), 0) + coalesce(m.e_x * public._hsta_ti_trong('et'), 0) + coalesce(m.t_x * public._hsta_ti_trong('bo_tro'), 0))
      / nullif((case when m.b_x is not null then public._hsta_ti_trong('btvn') else 0 end)
             + (case when m.e_x is not null then public._hsta_ti_trong('et') else 0 end)
             + (case when m.t_x is not null then public._hsta_ti_trong('bo_tro') else 0 end), 0), 1),
    (m.b_x is not null and m.e_x is not null and m.t_x is not null),
    coalesce(m.j, '{}'::jsonb), coalesce(m.gt_n, 0)
  from mix m
  order by m.ho_ten;
end $function$;

-- fn_hsta_bo_tro(date,date,uuid): nguyên văn bản đang chạy, chỉ thêm "_la_tac_vu_nen() or" vào dòng kiểm quyền.
CREATE OR REPLACE FUNCTION public.fn_hsta_bo_tro(p_tu date, p_den date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, buoi_id uuid, loai text, ngay date, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, so_phut integer, khung text, hoc_sinh text[], so_co_mat integer, so_vang integer, lop_goc text, danh_gia_xong_at timestamp with time zone, bai_dau_at timestamp with time zone, so_gay integer, co text[])
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
begin
  if not (public._la_tac_vu_nen() or public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with b as (
    select bh.id, coalesce(bh.nguoi_day_tg, bh.nguoi_day) as ns, bh.loai, bh.ngay,
      coalesce(bh.gio_bat_dau, c.gio_bat_dau) as gbd, coalesce(bh.gio_ket_thuc, c.gio_ket_thuc) as gkt,
      bh.danh_gia_xong_at
    from buoi_hoc bh left join ca_bo_tro c on c.id = bh.ca_bo_tro_id
    where bh.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') and bh.trang_thai <> 'huy'
      and bh.ngay between p_tu and p_den
      and coalesce(bh.nguoi_day_tg, bh.nguoi_day) is not null
      and (p_ns is null or coalesce(bh.nguoi_day_tg, bh.nguoi_day) = p_ns)
  ),
  x as (
    select b.*, ns.ho_ten as ten_ns,
      (select coalesce(array_agg(hs.ho_ten order by hs.ho_ten), '{}') from buoi_hoc_hs h join hoc_sinh hs on hs.id = h.hoc_sinh_id
        where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat') as ds_hs,
      (select count(*) from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat')::int as co_mat,
      (select count(*) from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh in ('vang', 'vang_phep'))::int as vang,
      (select string_agg(distinct l.ten_lop, ', ') from buoi_hoc_hs h join buoi_hoc g on g.id = h.bu_cho_buoi_id join lop l on l.id = g.lop_id
        where h.buoi_hoc_id = b.id) as lop_goc,
      (select min(least(t.mo_at, coalesce(t.in_giay_at, t.mo_at))) from bai_test t where t.buoi_hoc_id = b.id) as bai_dau,
      (select coalesce(sum(g.so_gay), 0) from gay_ledger g where g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
        and g.ref_id like 'vh:' || b.id::text || '|%')::int as gay
    from b join nhan_su ns on ns.id = b.ns
    where not ns.an_xep_hang
  )
  select x.ns, x.ten_ns, x.id, x.loai, x.ngay, x.gbd, x.gkt,
    case when x.gkt > x.gbd then (extract(epoch from (x.gkt - x.gbd)) / 60)::int end,
    x.ngay::text || ' ' || coalesce(x.gbd::text, '?') || '-' || coalesce(x.gkt::text, '?'),
    x.ds_hs, x.co_mat, x.vang, x.lop_goc, x.danh_gia_xong_at, x.bai_dau, x.gay,
    array_remove(array[
      case when x.co_mat = 0 then 'khong_hs' end,
      case when x.gbd is null or x.gkt is null then 'thieu_gio' end,
      case when x.gkt <= x.gbd then 'ket_thuc_le' end,
      case when x.gbd < time '07:00' or x.gkt > time '22:30' then 'gio_bat_thuong' end,
      case when x.co_mat > 0 and exists (select 1 from x x2 where x2.ns = x.ns and x2.id <> x.id and x2.co_mat > 0 and x2.ngay = x.ngay
                                          and x2.gbd < x.gkt and x.gbd < x2.gkt
                                          and (x2.gbd, x2.gkt) is distinct from (x.gbd, x.gkt)) then 'trung_khung' end,  -- cùng khung y hệt = 1 ca nhiều em (bình thường)
      case when x.co_mat > 0 and x.danh_gia_xong_at is null then 'chua_danh_gia' end
    ], null)
  from x
  order by x.ten_ns, x.ngay, x.gbd nulls last;
end $function$;

-- fn_hsta_gay(date,date,uuid): nguyên văn bản đang chạy, chỉ thêm "_la_tac_vu_nen() or" vào dòng kiểm quyền.
CREATE OR REPLACE FUNCTION public.fn_hsta_gay(p_tu date, p_den date, p_ns uuid)
 RETURNS TABLE(nguon text, id uuid, trang_thai text, ma_loi text, ten_loi text, so_gay integer, tre_phut integer, ly_do text, ref_key text, nguoi text, tao_at timestamp with time zone, thu_hoi_at timestamp with time zone, gan_voi text, buoi_id uuid, ngay_task date, ten_lop text, tinh_vao text, ly_do_khong_tinh text)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
begin
  if not (public._la_tac_vu_nen() or public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with g as (
    select 'so'::text as nguon, l.id, case when l.thu_hoi_at is null then 'da_vao_so' else 'da_thu_hoi' end as tt,
      lo.ma, lo.ten, l.so_gay, d.tre_phut, coalesce(l.ly_do, l.ref_mo_ta) as ly_do, l.ref_id, n.ho_ten as nguoi,
      l.created_at, l.thu_hoi_at, l.ky
    from gay_ledger l left join gay_loi lo on lo.id = l.loi_id left join gay_de_xuat d on d.ledger_id = l.id
    left join nhan_su n on n.id = l.nguoi_tao
    where l.nhan_su_id = p_ns and l.loai <> 'go' and l.so_gay > 0
    union all
    select 'de_xuat', d.id, 'cho_chot', 'cham_deadline', 'Chậm deadline trên ERP (đề xuất)', d.so_gay, d.tre_phut, d.mo_ta, d.ref_key,
      null, d.created_at, null, date_trunc('month', coalesce(d.deadline_at, d.created_at) at time zone 'Asia/Ho_Chi_Minh')::date
    from gay_de_xuat d where d.nhan_su_id = p_ns and d.trang_thai = 'cho'
  ),
  x as (
    select g.*, split_part(g.ref_id, '|', 2) as tab, b.id as bid, b.ngay as bngay, b.loai as bloai, (select lp.ten_lop from lop lp where lp.id = b.lop_id) as tlop,
      -- TA chính LÚC HẠN (bản chụp, Thùy 04/11); chưa có bản chụp (chưa tới hạn) ⇒ phân công hiện tại như cũ
      case when exists (select 1 from viec_phu_trach_snap s where s.buoi_id = b.id and s.tab = split_part(g.ref_id, '|', 2))
           then exists (select 1 from viec_phu_trach_snap s where s.buoi_id = b.id and s.tab = split_part(g.ref_id, '|', 2) and s.nhan_su_id = p_ns)
           else exists (select 1 from phan_cong_lop pc where pc.lop_id = b.lop_id and pc.nhan_su_id = p_ns and pc.vai_tro = 'tg' and pc.la_chinh) end as ta_chinh
    from g left join buoi_hoc b
      on b.id = case when g.ref_id ~ '^vh:[0-9a-f-]{36}[|]' then substring(g.ref_id from 4 for 36)::uuid end
  )
  select x.nguon, x.id, x.tt, x.ma, x.ten, x.so_gay, coalesce(td.tre_phut, x.tre_phut), x.ly_do, x.ref_id, x.nguoi, x.created_at, x.thu_hoi_at,
    case when x.bid is null then 'ngoai_task'
         when x.bloai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') then 'bo_tro'
         when x.tab in ('btvn', 'et') then x.tab
         else 'khac_' || x.tab end,
    x.bid, x.bngay, x.tlop,
    case when x.tt <> 'da_vao_so' then null
         when x.bid is null or x.bloai <> 'thuong' or x.tab not in ('btvn', 'et') or not x.ta_chinh then null
         when x.ma = 'cham_deadline' then 'tien_do' else 'chat_luong' end,
    case when x.tt = 'cho_chot' then 'Đề xuất chưa được xác nhận'
         when x.tt = 'da_thu_hoi' then 'Đã thu hồi'
         when x.bid is null then 'Không gắn buổi học nào'
         when x.bloai <> 'thuong' then 'Gậy của ca bổ trợ — bổ trợ chấm tay'
         when x.tab not in ('btvn', 'et') then 'Không thuộc Chấm BTVN / Chấm ET'
         when not x.ta_chinh then 'Không phải lớp TA chính của người này'
    end
  from x
  left join lateral public.fn_viec_tien_do(array[x.ref_id]) td on x.ma = 'cham_deadline'
  where (x.bid is not null and x.bngay between p_tu and p_den)
     or (x.bid is null and x.ky between date_trunc('month', p_tu)::date and p_den)
  order by coalesce(x.bngay, x.ky), x.created_at;
end $function$;

-- fn_hsta_task(date,date,uuid): nguyên văn bản đang chạy, chỉ thêm "_la_tac_vu_nen() or" vào dòng kiểm quyền.
CREATE OR REPLACE FUNCTION public.fn_hsta_task(p_tu date, p_den date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, dau_viec text, buoi_id uuid, ten_lop text, ngay date, han timestamp with time zone, dong_dau timestamp with time zone, dong_cuoi timestamp with time zone, so_mo_lai integer, tre_gio numeric, tru_tien_do integer, gay_chat_luong integer, gay_tre integer, tru_chat_luong integer, diem numeric, tinh boolean, ly_do_khong_tinh text, co text[], so_co_mat integer, so_kq integer, nop_dung_han integer, nop_muon integer, khong_lam integer, xin_phep integer, pct_dung_han numeric, pct_dung_han_lop_khac numeric, so_cau integer, o_can integer, o_cham integer, pct_o_cham numeric, so_hs_vang_co_diem integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
begin
  if not (public._la_tac_vu_nen() or public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with v as (
    select v.*, ns.ho_ten
    from public.fn_viec_buoi_thuong_lh(p_tu, p_den) v
    join nhan_su ns on ns.id = v.nhan_su_id
    where v.vai = 'tg' and v.tab in ('btvn', 'et') and not (v.tab = 'et' and v.et_online)
      and not ns.an_xep_hang
      -- CHỈ lớp được phân công TRỰC TIẾP (TA chính) — CEO 08/10; khớp cách Gậy chọn người chịu (la_chinh).
      -- Việc ĐÃ tới hạn: fn_viec_buoi_thuong_lh đã chọn đúng 1 TA (duy nhất / chính) LÚC HẠN — không xét lại theo
      -- phân công hiện tại (Thùy 04/11). Việc đóng sớm, chưa tới hạn: TA chính hiện tại như cũ.
      and (v.han <= now() or exists (select 1 from phan_cong_lop pc where pc.lop_id = v.lop_id and pc.nhan_su_id = v.nhan_su_id
                    and pc.vai_tro = 'tg' and pc.la_chinh))
      and (p_ns is null or v.nhan_su_id = p_ns)
      and (v.dong_at is not null or v.han <= now())   -- chưa tới hạn mà chưa đóng = chưa phải việc để đo
  ),
  t as materialized (
    select v.*,
      -- lần đóng ĐẦU TIÊN: lịch sử phase (từ 23/09) + giá trị cũ khi mở lại/đổi mốc; trước đó chỉ còn dong_at
      public._viec_dong_dau(v.buoi_id, v.tab, v.dong_at) as dd,
      (select count(*) from buoi_hoc_phase_log l where l.buoi_hoc_id = v.buoi_id and l.phase = v.tab and l.su_kien = 'mo_lai')::int as mo_lai,
      exists (select 1 from ta_vang tv where tv.buoi_hoc_id = v.buoi_id and tv.nhan_su_id = v.nhan_su_id) as vang,
      (select count(*) from gami_session_problems p where p.buoi_hoc_id = v.buoi_id and p.phase = v.tab and not p.hidden)::int as n_cau,
      (select coalesce(sum(g.so_gay), 0) from gay_ledger g left join gay_loi lo on lo.id = g.loi_id
        where g.ref_id = v.ref_key and g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
          and coalesce(lo.ma, '') <> 'cham_deadline')::int as g_cl,
      (select coalesce(sum(g.so_gay), 0) from gay_ledger g join gay_loi lo on lo.id = g.loi_id
        where g.ref_id = v.ref_key and g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
          and lo.ma = 'cham_deadline')::int as g_tre,
      exists (select 1 from gay_de_xuat d where d.ref_key = v.ref_key and d.trang_thai = 'cho') as g_cho,
      (select count(*) from buoi_hoc_hs h where h.buoi_hoc_id = v.buoi_id and h.diem_danh = 'co_mat')::int as n_co_mat
    from v
  ),
  -- materialized: ước lượng 1 dòng từ hàm set-returning ⇒ planner lặp lại cả CTE cho MỖI task (đo: 474 × 50ms = 25s)
  btvn as materialized (
    select t.buoi_id, t.nhan_su_id,
      count(k.*)::int as kq,
      count(*) filter (where k.trang_thai_nop = 'nop_dung_han')::int as dung,
      count(*) filter (where k.trang_thai_nop = 'nop_muon')::int as muon,
      count(*) filter (where k.trang_thai_nop = 'khong_lam')::int as khong,
      count(*) filter (where k.trang_thai_nop = 'xin_phep')::int as phep
    from t join btvn_ket_qua k on k.buoi_hoc_id = t.buoi_id
    where t.tab = 'btvn' group by t.buoi_id, t.nhan_su_id
  ),
  -- nhân chứng độc lập: CHÍNH các em đó nộp đúng hạn bao nhiêu ở LỚP KHÁC (TA khác chấm), ±90 ngày
  btvn_lop_khac as materialized (
    select t.buoi_id, t.nhan_su_id,
      count(*) as n,
      count(*) filter (where k2.trang_thai_nop = 'nop_dung_han') as dung
    from t
    join btvn_ket_qua k on k.buoi_hoc_id = t.buoi_id
    join btvn_ket_qua k2 on k2.hoc_sinh_id = k.hoc_sinh_id and k2.trang_thai_nop is not null and k2.trang_thai_nop <> 'xin_phep'
    join buoi_hoc b2 on b2.id = k2.buoi_hoc_id and b2.lop_id <> t.lop_id and b2.ngay between t.ngay - 90 and t.ngay + 30
    where t.tab = 'btvn' group by t.buoi_id, t.nhan_su_id
  ),
  et as materialized (
    select t.buoi_id, t.nhan_su_id,
      (select count(*) from buoi_hoc_hs h join gami_session_problems p on p.buoi_hoc_id = t.buoi_id and p.phase = 'et' and not p.hidden
                                                                      and (p.hoc_sinh_id is null or p.hoc_sinh_id = h.hoc_sinh_id)
        where h.buoi_hoc_id = t.buoi_id and h.diem_danh = 'co_mat')::int as can,
      -- đi qua câu của buổi (index buoi_hoc_id, phase) → điểm theo problem_id; gami_grades không có index buoi_hoc_id
      (select count(*) from gami_session_problems p join gami_grades g on g.problem_id = p.id
                                         join buoi_hoc_hs h on h.buoi_hoc_id = t.buoi_id and h.hoc_sinh_id = g.hoc_sinh_id and h.diem_danh = 'co_mat'
        where p.buoi_hoc_id = t.buoi_id and p.phase = 'et' and not p.hidden)::int as cham,
      (select count(distinct g.hoc_sinh_id) from gami_session_problems p join gami_grades g on g.problem_id = p.id
        where p.buoi_hoc_id = t.buoi_id and p.phase = 'et'
          and not exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = t.buoi_id and h.hoc_sinh_id = g.hoc_sinh_id and h.diem_danh = 'co_mat'))::int as hs_vang_co_diem
    from t where t.tab = 'et'
  ),
  s as (
    select t.*,
      extract(epoch from (coalesce(t.dd, now()) - t.han)) / 3600 as tre,   -- trễ theo LẦN ĐÓNG ĐẦU (cùng cách hệ Gậy đo)
      -- TIẾN ĐỘ theo GẬY (CEO 08/10): CHỈ trừ khi có gậy Chậm deadline đã vào sổ; mức theo trễ lần đóng đầu.
      -- Gậy đã vào sổ mà lần đóng đầu đúng hạn (chốt trước khi sửa máy quét) ⇒ vẫn trừ mức thấp nhất + cờ để người chốt xem lại.
      t.g_tre * public._hsta_tru_moi_gay() as td,   -- Thùy 05/11: mỗi gậy Chậm deadline −50 như gậy khác
      case when t.vang then 'TA vắng buổi này'
           when t.n_cau = 0 and t.g_tre + t.g_cl = 0 then case t.tab when 'btvn' then 'Buổi không có câu BTVN trên hệ thống' else 'Buổi không có câu ET trên hệ thống' end
           when t.han is null then 'Chưa xác định được hạn (không tìm thấy buổi kế tiếp)'
      end as khong_tinh
    from t
  )
  select s.nhan_su_id, s.ho_ten, s.tab, s.buoi_id, s.ten_lop, s.ngay,
    s.han, s.dd, s.dong_at, s.mo_lai,
    round(greatest(s.tre, 0)::numeric, 1),
    s.td,
    s.g_cl, s.g_tre,
    s.g_cl * public._hsta_tru_moi_gay(),
    case when s.khong_tinh is null
         then greatest(0, 100 - s.td - s.g_cl * public._hsta_tru_moi_gay())::numeric end,
    s.khong_tinh is null,
    s.khong_tinh,
    array_remove(array[
      case when s.dd is null then 'chua_dong' end,
      case when s.g_cho then 'gay_cho_chot' end,
      case when s.n_cau = 0 and s.g_tre + s.g_cl > 0 then 'khong_cau_co_gay' end,
      case when s.g_tre > 0 and s.dd is not null and s.dd <= s.han then 'gay_dau_dung_han' end,
      case when s.mo_lai > 0 then 'mo_lai' end,
      case when s.tab = 'btvn' and b.kq >= 3 and (b.muon + b.khong) * 1.0 / b.kq >= 0.4 then 'nop_muon_cao' end,
      case when s.tab = 'btvn' and b.kq >= 3 and lk.n >= 5
                and b.dung * 100.0 / b.kq < lk.dung * 100.0 / lk.n - 30 then 'lech_lop_khac' end,
      case when s.tab = 'btvn' and s.dd is not null and s.n_cau > 0 and coalesce(b.kq, 0) = 0 then 'dong_khong_du_lieu' end,
      case when s.tab = 'et' and s.dd is not null and s.n_cau > 0 and e.can > 0 and e.cham < e.can then 'et_thieu_o' end,
      case when s.tab = 'et' and s.dd is not null and s.n_cau = 0 then 'dong_khong_du_lieu' end,
      case when s.tab = 'et' and e.hs_vang_co_diem > 0 then 'hs_vang_co_diem' end
    ], null),
    s.n_co_mat,
    case when s.tab = 'btvn' then coalesce(b.kq, 0) end,
    b.dung, b.muon, b.khong, b.phep,
    case when b.kq > 0 then round(b.dung * 100.0 / b.kq, 0) end,
    case when lk.n >= 5 then round(lk.dung * 100.0 / lk.n, 0) end,
    s.n_cau,
    e.can, e.cham,
    case when e.can > 0 then round(e.cham * 100.0 / e.can, 0) end,
    e.hs_vang_co_diem
  from s
  left join btvn b on b.buoi_id = s.buoi_id and b.nhan_su_id = s.nhan_su_id
  left join btvn_lop_khac lk on lk.buoi_id = s.buoi_id and lk.nhan_su_id = s.nhan_su_id
  left join et e on e.buoi_id = s.buoi_id and e.nhan_su_id = s.nhan_su_id
  order by s.ho_ten, s.tab, s.ngay;
end $function$;

-- fn_hsta_thang(date,uuid): nguyên văn bản đang chạy, chỉ thêm "_la_tac_vu_nen() or" vào dòng kiểm quyền.
CREATE OR REPLACE FUNCTION public.fn_hsta_thang(p_ky date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, btvn_so_task integer, btvn_so_tinh integer, btvn_de_xuat numeric, btvn_so_co integer, et_so_task integer, et_so_tinh integer, et_de_xuat numeric, et_so_co integer, bt_so_ca integer, bt_gio_he_thong numeric, bt_gio_ghi_them numeric, bt_chi_tieu_gio numeric, bt_so_co integer, tong_de_xuat numeric, tong_du_3_dau_viec boolean, chot jsonb, so_ghi_them integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
begin
  if not (public._la_tac_vu_nen() or public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query select * from public._hsta_thang_core(p_ky, p_ns, null);
end $function$;

-- Điền lần đầu (không ngân sách) để màn có số ngay sau khi áp.
select public._phong_so_lam_moi(600, 0);
select count(*) as so_ghe_da_tinh from public.phong_so_luu;
