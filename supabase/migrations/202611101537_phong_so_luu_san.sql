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

-- Điền lần đầu (không ngân sách) để màn có số ngay sau khi áp.
select public._phong_so_lam_moi(600, 0);
