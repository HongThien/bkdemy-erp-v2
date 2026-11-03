-- BÁO CÁO TUẦN — Pha P3 (spec-bao-cao-tuan.md §2.8 · §2.10, Thùy chốt 03/11): trưởng bộ môn DUYỆT / TRẢ LẠI báo cáo khối ·
-- GẬY nộp trễ · ghép BÁO CÁO CHUYÊN MÔN TUẦN theo môn (CEO xem gộp mọi môn).
-- Trưởng bộ môn = chế độ phòng 'tbm' (fn_phong_che_do); môn của họ = _phong_mon_cua_toi() (null = admin ⇒ mọi môn).
-- Gậy trễ: đề xuất vào gay_de_xuat (đường gậy sẵn có — Trang quyết; trưởng khối là cấp dưới của Trang). ref_key 'bctk:<tuần>|<người>'.
--   nguon = 'vanhanh' (CHECK chỉ có vanhanh · giaoviec; thêm giá trị mới = alter bảng ⇒ chờ CEO gật theo Luật xoá). fn_gay_de_xuat_tinh_lai
--   chỉ đụng ref 'vh:' nên không tự rút đề xuất này. Đề xuất sinh khi trưởng bộ môn mở hàng báo cáo sau hạn (lười nhưng idempotent).
-- Báo cáo chuyên môn: phần TỔNG MÔN = fn_bctk_so trên mọi ô của môn (một nguồn với báo cáo khối), snap lúc Chốt; ghép các báo cáo khối
-- ĐÃ DUYỆT + báo cáo trưởng bộ môn tự nộp (ô chưa có trưởng khối — không ai khác duyệt được). Khối thiếu lúc chốt được ghi rõ.

create table public.bao_cao_chuyen_mon_tuan (
  id uuid primary key default gen_random_uuid(),
  tuan date not null check (extract(isodow from tuan) = 1),
  mon text not null,
  trang_thai text not null default 'nhap' check (trang_thai in ('nhap', 'da_chot')),
  tong jsonb,                                       -- SNAP tổng môn lúc chốt; NULL = không áp dụng (còn nháp)
  bao_cao_ids uuid[] not null default '{}',         -- báo cáo khối đã ghép (chốt lúc Chốt)
  nhan_xet text not null default '',
  chot_boi uuid references public.nhan_su(id),
  chot_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tuan, mon),
  check (trang_thai = 'nhap' or (tong is not null and chot_at is not null))
);
alter table public.bao_cao_chuyen_mon_tuan enable row level security;

create table public.bao_cao_chuyen_mon_tuan_log (
  id bigint generated always as identity primary key,
  bao_cao_id uuid not null references public.bao_cao_chuyen_mon_tuan(id),
  tu text, den text not null, nguoi uuid, at timestamptz not null default now()
);
alter table public.bao_cao_chuyen_mon_tuan_log enable row level security;

create or replace function public._bcmt_ghi_log()
 returns trigger language plpgsql security definer set search_path to 'public'
as $$
begin
  if tg_op = 'INSERT' or old.trang_thai is distinct from new.trang_thai then
    insert into bao_cao_chuyen_mon_tuan_log (bao_cao_id, tu, den, nguoi)
    values (new.id, case when tg_op = 'UPDATE' then old.trang_thai end, new.trang_thai, public.current_nhan_su_id());
  end if;
  return new;
end $$;
create trigger bao_cao_chuyen_mon_tuan_log_trg after insert or update of trang_thai on public.bao_cao_chuyen_mon_tuan
  for each row execute function public._bcmt_ghi_log();

-- ── Phạm vi trưởng bộ môn ──
create or replace function public._bctk_cac_mon_toi()
 returns text[] language sql stable security definer set search_path to 'public'
as $$
  select coalesce(public._phong_mon_cua_toi(),
                  array(select distinct l.mon from lop l where l.trang_thai = 'dang_hoc' and l.mon is not null order by 1))
$$;

create or replace function public._bctk_gac_tbm()
 returns void language plpgsql stable security definer set search_path to 'public'
as $$
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ trưởng bộ môn xem / duyệt được' using errcode = '42501'; end if;
end $$;

-- Mọi ô (môn × khối) của một môn = lớp đang học.
create or replace function public._bctk_o_cua_mon(p_mon text)
 returns jsonb language sql stable security definer set search_path to 'public'
as $$
  select coalesce(jsonb_agg(jsonb_build_object('mon', x.mon, 'khoi', x.khoi)
                  order by coalesce(substring(x.khoi from '^[0-9]+')::int, 0), x.khoi), '[]'::jsonb)
    from (select distinct l.mon, l.khoi from lop l where l.mon = p_mon and l.trang_thai = 'dang_hoc' and l.khoi is not null) x
$$;

-- ── Gậy nộp trễ (§2.10): quá hạn mà chưa nộp / nộp sau hạn ⇒ đề xuất gậy cho TRƯỞNG KHỐI. Idempotent (ref_key duy nhất). ──
create or replace function public._bctk_de_xuat_tre(p_tuan date)
 returns integer language plpgsql security definer set search_path to 'public'
as $$
declare v_han timestamptz := public._bctk_han(p_tuan); n int;
begin
  if now() <= v_han then return 0; end if;
  -- Báo cáo tuần có từ 03/11: kỳ đầu tiên phải nộp = tuần 02/11–08/11 (hạn 17:00 09/11). Kỳ trước đó không ai phải nộp ⇒ không gậy.
  if p_tuan < date '2026-11-02' then return 0; end if;
  insert into gay_de_xuat (nhan_su_id, nguon, ref_key, mo_ta, deadline_at, tre_phut, so_gay)
  select tk.ns, 'vanhanh', 'bctk:' || p_tuan || '|' || tk.ns,
         'Báo cáo tuần ' || to_char(p_tuan, 'DD/MM') || '–' || to_char(p_tuan + 6, 'DD/MM')
           || case when r.trang_thai is null or r.trang_thai = 'nhap' then ' — chưa nộp (hạn ' else ' — nộp trễ (hạn ' end
           || to_char(v_han at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI DD/MM') || ')',
         v_han,
         greatest(1, ceil(extract(epoch from (coalesce(case when r.trang_thai <> 'nhap' then r.nop_at end, now()) - v_han)) / 60))::int,
         1
    from (select distinct q.nhan_su_id as ns from phan_cong_quan_ly_khoi q
            join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
            join lop l on l.mon = q.mon and l.khoi = q.khoi and l.trang_thai = 'dang_hoc'
           where q.vai = 'truong') tk
    left join bao_cao_tuan_khoi r on r.tuan = p_tuan and r.nguoi_bao_cao = tk.ns
   where r.id is null or r.trang_thai = 'nhap' or r.tre
  on conflict (ref_key) do nothing;
  get diagnostics n = row_count;
  return n;
end $$;

-- ── Hàng báo cáo của trưởng bộ môn cho 1 tuần (mặc định tuần trước) ──
create or replace function public.fn_bctk_hang(p_tuan date default null)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
declare
  v_tuan date := coalesce(p_tuan, public._bctk_tuan_truoc());
  v_mon text[];
  v_me uuid := public.current_nhan_su_id();
begin
  perform public._bctk_gac_tbm();
  v_mon := public._bctk_cac_mon_toi();
  perform public._bctk_de_xuat_tre(v_tuan);
  return jsonb_build_object(
    'tuan', v_tuan, 'den', v_tuan + 6, 'han', public._bctk_han(v_tuan), 'qua_han', now() > public._bctk_han(v_tuan),
    'ky_xong', v_tuan + 7 <= (now() at time zone 'Asia/Ho_Chi_Minh')::date,
    'mon', to_jsonb(v_mon),
    -- người phải báo cáo (trưởng khối có ô thuộc môn của tôi) ∪ người đã có báo cáo thuộc môn của tôi
    'bao_cao', (
      with ng as (
        select q.nhan_su_id as ns from phan_cong_quan_ly_khoi q
          join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
          join lop l on l.mon = q.mon and l.khoi = q.khoi and l.trang_thai = 'dang_hoc'
         where q.vai = 'truong' and q.mon = any(v_mon)
        union
        select r.nguoi_bao_cao from bao_cao_tuan_khoi r
         where r.tuan = v_tuan and exists (select 1 from jsonb_array_elements(r.o) x where x->>'mon' = any(v_mon))
      )
      select coalesce(jsonb_agg(jsonb_build_object(
          'nhan_su_id', ng.ns, 'ho_ten', n.ho_ten, 'la_toi', ng.ns = v_me, 'id', r.id,
          'trang_thai', case when r.id is null or r.trang_thai = 'nhap' then 'chua_nop' else r.trang_thai end,
          'dang_soan', r.trang_thai = 'nhap',
          'o', coalesce(case when r.trang_thai <> 'nhap' then r.o end,
                        (select coalesce(jsonb_agg(jsonb_build_object('mon', q.mon, 'khoi', q.khoi)
                                  order by q.mon, coalesce(substring(q.khoi from '^[0-9]+')::int, 0), q.khoi), '[]'::jsonb)
                           from phan_cong_quan_ly_khoi q where q.nhan_su_id = ng.ns and q.vai = 'truong' and q.mon = any(v_mon))),
          'nop_at', r.nop_at, 'tre', r.tre, 'tong', case when r.trang_thai <> 'nhap' then r.so->'tong' end)
          order by n.ho_ten), '[]'::jsonb)
        from ng join nhan_su n on n.id = ng.ns
        left join bao_cao_tuan_khoi r on r.tuan = v_tuan and r.nguoi_bao_cao = ng.ns),
    -- ô chưa có trưởng khối (trưởng bộ môn báo cáo thay) + đã có báo cáo nộp phủ ô đó chưa
    'o_chua_co_tk', (
      select coalesce(jsonb_agg(jsonb_build_object('mon', l.mon, 'khoi', l.khoi,
               'co_bao_cao', exists (select 1 from bao_cao_tuan_khoi r, jsonb_array_elements(r.o) x
                                      where r.tuan = v_tuan and r.trang_thai <> 'nhap' and x->>'mon' = l.mon and x->>'khoi' = l.khoi))
               order by l.mon, coalesce(substring(l.khoi from '^[0-9]+')::int, 0), l.khoi), '[]'::jsonb)
        from (select distinct l.mon, l.khoi from lop l where l.trang_thai = 'dang_hoc' and l.khoi is not null and l.mon = any(v_mon)) l
       where not exists (select 1 from phan_cong_quan_ly_khoi q join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
                          where q.mon = l.mon and q.khoi = l.khoi and q.vai = 'truong')),
    'mon_bc', (select coalesce(jsonb_agg(jsonb_build_object('mon', m.mon, 'id', b.id, 'trang_thai', coalesce(b.trang_thai, 'chua_co'), 'chot_at', b.chot_at)
                                         order by m.mon), '[]'::jsonb)
                 from unnest(v_mon) m(mon) left join bao_cao_chuyen_mon_tuan b on b.tuan = v_tuan and b.mon = m.mon)
  );
end $$;

-- Báo cáo khối này có thuộc môn của tôi không (trưởng bộ môn được xem / duyệt).
create or replace function public._bctk_cua_mon_toi(p_o jsonb)
 returns boolean language sql stable security definer set search_path to 'public'
as $$ select exists (select 1 from jsonb_array_elements(p_o) x where x->>'mon' = any(public._bctk_cac_mon_toi())) $$;

-- ── Xem 1 báo cáo khối ĐÃ NỘP (trưởng bộ môn) — cùng hình dạng fn_bctk_lay ──
create or replace function public.fn_bctk_xem(p_id uuid)
 returns jsonb language plpgsql stable security definer set search_path to 'public'
as $$
declare r bao_cao_tuan_khoi%rowtype;
begin
  perform public._bctk_gac_tbm();
  select * into r from bao_cao_tuan_khoi where id = p_id;
  if not found or r.trang_thai = 'nhap' then raise exception 'Báo cáo chưa nộp'; end if;
  if not public._bctk_cua_mon_toi(r.o) then raise exception 'Báo cáo ngoài môn của bạn' using errcode = '42501'; end if;
  return jsonb_build_object(
    'co_bao_cao', true, 'id', r.id, 'tuan', r.tuan, 'den', r.tuan + 6, 'han', public._bctk_han(r.tuan), 'qua_han', false, 'ky_xong', true,
    'trang_thai', r.trang_thai, 'o', r.o, 'so', r.so, 'ca_nhan', r.ca_nhan, 'tu_viet', r.tu_viet,
    'nop_at', r.nop_at, 'tre', r.tre, 'tra_lai_ly_do', r.tra_lai_ly_do,
    'ho_ten', (select ho_ten from nhan_su where id = r.nguoi_bao_cao), 'la_toi', r.nguoi_bao_cao = public.current_nhan_su_id());
end $$;

-- ── Duyệt / Trả lại (chỉ báo cáo đã nộp, không tự duyệt báo cáo của mình) ──
create or replace function public.fn_bctk_xu_ly(p_id uuid, p_duyet boolean, p_ly_do text default null)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
declare r bao_cao_tuan_khoi%rowtype; v_me uuid := public.current_nhan_su_id();
begin
  perform public._bctk_gac_tbm();
  select * into r from bao_cao_tuan_khoi where id = p_id for update;
  if not found then raise exception 'Không thấy báo cáo'; end if;
  if not public._bctk_cua_mon_toi(r.o) then raise exception 'Báo cáo ngoài môn của bạn' using errcode = '42501'; end if;
  if r.nguoi_bao_cao = v_me then raise exception 'Không tự duyệt / trả lại báo cáo của chính mình'; end if;
  if r.trang_thai <> 'da_nop' then raise exception 'Chỉ duyệt / trả lại báo cáo đang chờ duyệt'; end if;
  if not p_duyet and coalesce(trim(p_ly_do), '') = '' then raise exception 'Trả lại phải ghi lý do'; end if;
  update bao_cao_tuan_khoi set trang_thai = case when p_duyet then 'da_duyet' else 'tra_lai' end,
         tra_lai_ly_do = case when p_duyet then null else trim(p_ly_do) end,
         xu_ly_boi = v_me, xu_ly_at = now(), updated_at = now()
   where id = p_id;
  return jsonb_build_object('id', p_id, 'trang_thai', case when p_duyet then 'da_duyet' else 'tra_lai' end);
end $$;

-- Báo cáo khối được GHÉP vào báo cáo môn: đã duyệt, hoặc trưởng bộ môn tự nộp (ô chưa có trưởng khối — không ai khác duyệt).
create or replace function public._bcmt_duoc_ghep(p_tuan date, p_mon text)
 returns uuid[] language sql stable security definer set search_path to 'public'
as $$
  select coalesce(array_agg(r.id), '{}') from bao_cao_tuan_khoi r
   where r.tuan = p_tuan and exists (select 1 from jsonb_array_elements(r.o) x where x->>'mon' = p_mon)
     and (r.trang_thai = 'da_duyet' or (r.trang_thai = 'da_nop' and r.nguoi_bao_cao = public.current_nhan_su_id()))
$$;

-- ── Báo cáo Chuyên môn tuần của 1 môn ──
create or replace function public.fn_bcmt_lay(p_tuan date, p_mon text)
 returns jsonb language plpgsql stable security definer set search_path to 'public'
as $$
declare b bao_cao_chuyen_mon_tuan%rowtype; v_ids uuid[]; v_chot boolean; v_o jsonb;
begin
  perform public._bctk_gac_tbm();
  if not (p_mon = any(public._bctk_cac_mon_toi())) then raise exception 'Môn ngoài phạm vi của bạn' using errcode = '42501'; end if;
  select * into b from bao_cao_chuyen_mon_tuan where tuan = p_tuan and mon = p_mon;
  v_chot := found and b.trang_thai = 'da_chot';
  v_ids := case when v_chot then b.bao_cao_ids else public._bcmt_duoc_ghep(p_tuan, p_mon) end;
  v_o := public._bctk_o_cua_mon(p_mon);
  return jsonb_build_object(
    'tuan', p_tuan, 'den', p_tuan + 6, 'mon', p_mon, 'id', b.id,
    'trang_thai', coalesce(b.trang_thai, 'nhap'), 'nhan_xet', coalesce(b.nhan_xet, ''), 'chot_at', b.chot_at,
    'chot_boi', (select ho_ten from nhan_su where id = b.chot_boi),
    'ky_xong', p_tuan + 7 <= (now() at time zone 'Asia/Ho_Chi_Minh')::date,
    'tong', case when v_chot then b.tong else public.fn_bctk_so(v_o, p_tuan) || jsonb_build_object('trend', public.fn_bctk_trend(v_o, p_tuan)) end,
    'cac_khoi', (select coalesce(jsonb_agg(jsonb_build_object(
                    'id', r.id, 'ho_ten', n.ho_ten, 'o', r.o, 'trang_thai', r.trang_thai, 'tre', r.tre,
                    'so', r.so, 'tu_viet', r.tu_viet) order by r.o->0->>'khoi', n.ho_ten), '[]'::jsonb)
                   from bao_cao_tuan_khoi r join nhan_su n on n.id = r.nguoi_bao_cao where r.id = any(v_ids)),
    -- ô của môn chưa có báo cáo được ghép (khối thiếu — không im lặng)
    'o_thieu', (select coalesce(jsonb_agg(x order by coalesce(substring(x->>'khoi' from '^[0-9]+')::int, 0), x->>'khoi'), '[]'::jsonb)
                  from jsonb_array_elements(v_o) x
                 where not exists (select 1 from bao_cao_tuan_khoi r, jsonb_array_elements(r.o) y
                                    where r.id = any(v_ids) and y->>'mon' = x->>'mon' and y->>'khoi' = x->>'khoi')));
end $$;

create or replace function public.fn_bcmt_luu(p_tuan date, p_mon text, p_nhan_xet text)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
begin
  perform public._bctk_gac_tbm();
  if not (p_mon = any(public._bctk_cac_mon_toi())) then raise exception 'Môn ngoài phạm vi của bạn' using errcode = '42501'; end if;
  insert into bao_cao_chuyen_mon_tuan as b (tuan, mon, nhan_xet) values (p_tuan, p_mon, coalesce(p_nhan_xet, ''))
  on conflict (tuan, mon) do update set nhan_xet = excluded.nhan_xet, updated_at = now() where b.trang_thai = 'nhap';
  return jsonb_build_object('ok', true);
end $$;

-- CHỐT: snap tổng môn + danh sách báo cáo khối được ghép, trong cùng transaction.
create or replace function public.fn_bcmt_chot(p_tuan date, p_mon text, p_nhan_xet text)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
declare v_o jsonb;
begin
  perform public._bctk_gac_tbm();
  if not (p_mon = any(public._bctk_cac_mon_toi())) then raise exception 'Môn ngoài phạm vi của bạn' using errcode = '42501'; end if;
  if p_tuan + 7 > (now() at time zone 'Asia/Ho_Chi_Minh')::date then raise exception 'Tuần chưa kết thúc'; end if;
  if coalesce(trim(p_nhan_xet), '') = '' then raise exception 'Cần viết nhận xét của trưởng bộ môn trước khi chốt'; end if;
  if exists (select 1 from bao_cao_chuyen_mon_tuan where tuan = p_tuan and mon = p_mon and trang_thai = 'da_chot') then
    raise exception 'Báo cáo môn tuần này đã chốt';
  end if;
  v_o := public._bctk_o_cua_mon(p_mon);
  insert into bao_cao_chuyen_mon_tuan as b (tuan, mon, nhan_xet, trang_thai, tong, bao_cao_ids, chot_boi, chot_at)
  values (p_tuan, p_mon, trim(p_nhan_xet), 'da_chot',
          public.fn_bctk_so(v_o, p_tuan) || jsonb_build_object('trend', public.fn_bctk_trend(v_o, p_tuan)),
          public._bcmt_duoc_ghep(p_tuan, p_mon), public.current_nhan_su_id(), now())
  on conflict (tuan, mon) do update set nhan_xet = excluded.nhan_xet, trang_thai = 'da_chot', tong = excluded.tong,
    bao_cao_ids = excluded.bao_cao_ids, chot_boi = excluded.chot_boi, chot_at = excluded.chot_at, updated_at = now();
  return public.fn_bcmt_lay(p_tuan, p_mon);
end $$;

revoke execute on function public._bcmt_ghi_log() from public, anon, authenticated;
revoke execute on function public._bctk_cac_mon_toi() from public, anon;
revoke execute on function public._bctk_gac_tbm() from public, anon;
revoke execute on function public._bctk_o_cua_mon(text) from public, anon, authenticated;
revoke execute on function public._bctk_de_xuat_tre(date) from public, anon, authenticated;
revoke execute on function public._bctk_cua_mon_toi(jsonb) from public, anon;
revoke execute on function public._bcmt_duoc_ghep(date, text) from public, anon, authenticated;
revoke execute on function public.fn_bctk_hang(date) from public, anon;
revoke execute on function public.fn_bctk_xem(uuid) from public, anon;
revoke execute on function public.fn_bctk_xu_ly(uuid, boolean, text) from public, anon;
revoke execute on function public.fn_bcmt_lay(date, text) from public, anon;
revoke execute on function public.fn_bcmt_luu(date, text, text) from public, anon;
revoke execute on function public.fn_bcmt_chot(date, text, text) from public, anon;
grant execute on function public.fn_bctk_hang(date) to authenticated;
grant execute on function public.fn_bctk_xem(uuid) to authenticated;
grant execute on function public.fn_bctk_xu_ly(uuid, boolean, text) to authenticated;
grant execute on function public.fn_bcmt_lay(date, text) to authenticated;
grant execute on function public.fn_bcmt_luu(date, text, text) to authenticated;
grant execute on function public.fn_bcmt_chot(date, text, text) to authenticated;
