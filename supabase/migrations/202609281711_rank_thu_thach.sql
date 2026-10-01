-- ============================================================================
-- 202609281711 — rank_thu_thach
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Gamification HS phase 1 (spec-thanh-tuu-nhiem-vu.md §0.2–0.3, Thùy chốt 28/09): Điểm Rank theo môn
--   từ ĐÚNG 4 nguồn (ET · BTVN · MT · Thử thách), bậc mùa 8 cố định × 3 sao + 2 ghế thần, Bảng đua tháng.
--   Thử thách = kiểu tự luyện thứ 3, 1 lượt y hệt Tổng hợp (cùng tu_luyen_sinh), pass ≥ 80% mới có điểm,
--   vô hạn lượt, CHỈ ĐIỂM có trần ngày/tháng.
--   - Điểm Rank SUY ĐỘNG (fn_rank_su_kien) từ bảng đo có sẵn — không có bảng điểm rank, không dòng chờ.
--   - Dòng DUY NHẤT được ghi: thu_thach_luot (1 dòng / lượt Thử thách ĐÃ NỘP — kết quả thật, kể cả không
--     pass, vì huy hiệu đếm ngày pass / lượt 10/10). Điểm sau trần tính + ghi trong CÙNG transaction nộp
--     (trần phụ thuộc thứ tự lượt nên phải chốt lúc ghi, không suy lại được).
--   - Số câu đúng Thử thách đếm LẠI Ở SERVER cho câu trắc nghiệm (đáp án HS so đáp án kho), không tin
--     verdict client ghi — điểm này vào bảng xếp hạng.
--   - Số liệu (điểm, trần, ngưỡng bậc) nằm ở bảng cấu hình theo môn, không viết cứng trong hàm (A9).
--     Phase 1 chỉ bật Toán (rank_cau_hinh.bat); KHTN có sẵn bộ số, tắt.
--   - MT: fn_mt_hang_thang chỉ xếp em CÓ điểm (fn_bxh_diem_mt_khoi xếp cả em chưa thi = 0 để hiển thị —
--     KHÔNG sửa hàm đó). Cửa sổ MT tháng T = [25/T, 10/T+1) giống hệt fn_bxh_diem_mt_khoi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không. Chỉ thêm bảng/hàm/trigger + 1 cột bai_test.thu_thach (default false).
-- ============================================================================

-- ---------- 1. Mùa (dùng chung rank + huy hiệu) ----------
create table if not exists gami_mua (
  mua           text primary key,
  thang_dau     text not null check (thang_dau ~ '^\d{4}-\d{2}$'),
  thang_cuoi    text not null check (thang_cuoi ~ '^\d{4}-\d{2}$'),
  hh_thang_cuoi text not null check (hh_thang_cuoi ~ '^\d{4}-\d{2}$'),
  check (thang_dau <= hh_thang_cuoi and hh_thang_cuoi <= thang_cuoi)
);
comment on table gami_mua is 'Mùa gamification = 1 năm. Rank tính thang_dau→thang_cuoi (theo tháng quy điểm); huy hiệu đếm thang_dau→hh_thang_cuoi (Thùy 28/09: tháng 7→4, giữa tháng 5 nghỉ hè).';
insert into gami_mua values ('2026-27', '2026-07', '2027-06', '2027-04') on conflict do nothing;

-- ---------- 2. Cấu hình rank theo môn ----------
create table if not exists rank_cau_hinh (
  mon                  text primary key,
  bat                  boolean not null default false,
  diem_et              integer not null,
  diem_btvn_dung_han   integer not null,
  diem_btvn_muon       integer not null,
  mt_he_so             integer not null,             -- × bảng hạng 1–50 (50..100)
  tt_pass              numeric not null,             -- tỉ lệ đúng tối thiểu để pass
  tt_diem              jsonb not null,               -- [[tỉ lệ ≥, điểm], …] xét từ cao xuống
  tt_tran_thang        integer not null,
  tt_tran_ngay         integer not null,
  diem_toi_da_thang    integer not null,             -- ngưỡng bậc = he_so × số này
  god_top_pct          numeric not null,
  god_phong_do         numeric not null,
  supreme_phong_do     numeric not null
);
comment on table rank_cau_hinh is 'Bộ số Điểm Rank mỗi môn (cùng công thức — §1.6). Chốt 28/09 (phan-tich-diem-rank.md vòng 3–4). bat = môn đã mở rank.';
insert into rank_cau_hinh values
  ('Toán', true,  100, 100, 50, 10, 0.8, '[[1.0,30],[0.9,20],[0.8,10]]', 500, 25, 2500, 0.03, 0.84, 0.92),
  ('KHTN', false, 100, 100, 50, 10, 0.8, '[[1.0,30],[0.9,20],[0.8,10]]', 375, 19, 1875, 0.03, 0.84, 0.92)
on conflict do nothing;

create table if not exists rank_bac (
  mon    text not null references rank_cau_hinh(mon),
  bac    smallint not null check (bac between 1 and 8),
  ten    text not null,
  he_so  numeric not null,
  primary key (mon, bac)
);
comment on table rank_bac is '8 bậc cố định (mỗi bậc 3 sao). Ngưỡng = he_so × diem_toi_da_thang. 2 bậc ghế (God of War, Supreme God) xét trong fn_rank_mua.';
insert into rank_bac
select m.mon, b.bac, b.ten, b.he_so from (values ('Toán'), ('KHTN')) m(mon),
  (values (1::smallint, 'Novice', 0), (2, 'Soldier', 0.6), (3, 'Captain', 1.6), (4, 'General', 3.0),
          (5, 'Hero', 4.6), (6, 'Legend', 7.0), (7, 'King', 8.0), (8, 'Emperor', 9.8)) b(bac, ten, he_so)
on conflict do nothing;

-- ---------- 3. Thử thách ----------
alter table bai_test add column if not exists thu_thach boolean not null default false;
comment on column bai_test.thu_thach is 'Lượt tự luyện kiểu THỬ THÁCH (loai vẫn = tu_luyen ⇒ mastery/EXP/đếm tự luyện tự tính như cũ).';

create table if not exists thu_thach_luot (
  bai_lam_id   uuid primary key references bai_lam(id),
  bai_test_id  uuid not null references bai_test(id),
  hoc_sinh_id  uuid not null references hoc_sinh(id),
  mon          text not null,
  ngay         date not null,
  so_cau       integer not null check (so_cau > 0),
  so_dung      integer not null check (so_dung >= 0),
  pass         boolean not null,
  diem_goc     integer not null,
  diem         integer not null check (diem >= 0 and diem <= diem_goc),
  created_at   timestamptz not null default now()
);
comment on table thu_thach_luot is 'Kết quả 1 lượt Thử thách ĐÃ NỘP (ghi bởi trigger lúc nộp). diem = sau trần ngày/tháng của môn. Lượt không pass cũng ghi (diem 0).';
create index if not exists thu_thach_luot_hs_ngay on thu_thach_luot (hoc_sinh_id, mon, ngay);

do $$ declare t text; begin
  foreach t in array array['gami_mua', 'rank_cau_hinh', 'rank_bac', 'thu_thach_luot'] loop
    execute format('alter table %I enable row level security', t);
    if not exists (select 1 from pg_policies where tablename = t and policyname = t || '_member_all') then
      execute format('create policy %I on %I for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())', t || '_member_all', t);
    end if;
  end loop;
end $$;

-- Trigger: bai_lam chuyển da_nop ⇒ nếu là Thử thách thì chấm lại + áp trần + ghi thu_thach_luot.
create or replace function public.trg_thu_thach_nop() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare
  v_bt record; v_cfg record;
  v_so_dung integer; v_ti_le numeric; v_goc integer := 0; v_diem integer;
  v_ngay date := (coalesce(new.nop_at, now()) at time zone 'Asia/Ho_Chi_Minh')::date;
  v_da_ngay integer; v_da_thang integer; x jsonb;
begin
  select id, mon, so_cau, hoc_sinh_id, thu_thach into v_bt from bai_test where id = new.bai_test_id;
  if not coalesce(v_bt.thu_thach, false) or v_bt.hoc_sinh_id is distinct from new.hoc_sinh_id or v_bt.so_cau <= 0 then
    return new;
  end if;
  select * into v_cfg from rank_cau_hinh where mon = v_bt.mon;

  -- Đếm đúng Ở SERVER: trắc nghiệm so đáp án HS (chỉ số gốc 0..3) với chữ đáp án kho; loại khác dùng verdict.
  select count(*) filter (where case when btc.loai_cau = 'trac_nghiem'
                                     then (blc.dap_an_hs #>> '{}') ~ '^\d+$'
                                          and chr(65 + (blc.dap_an_hs #>> '{}')::int) = upper(trim(btc.dap_an_key #>> '{}'))
                                     else blc.verdict = 'correct' end)
    into v_so_dung
  from bai_lam_cau blc join bai_test_cau btc on btc.id = blc.bai_test_cau_id
  where blc.bai_lam_id = new.id;
  v_ti_le := v_so_dung::numeric / v_bt.so_cau;

  if v_cfg.mon is not null and v_ti_le >= v_cfg.tt_pass then
    for x in select * from jsonb_array_elements(v_cfg.tt_diem) loop
      if v_ti_le >= (x->>0)::numeric then v_goc := greatest(v_goc, (x->>1)::int); end if;
    end loop;
  end if;

  -- Trần: khoá theo (HS × môn) để 2 lượt nộp song song không cùng thấy "còn trần".
  perform pg_advisory_xact_lock(hashtext('thu_thach:' || new.hoc_sinh_id || ':' || v_bt.mon));
  select coalesce(sum(diem) filter (where ngay = v_ngay), 0),
         coalesce(sum(diem) filter (where date_trunc('month', ngay) = date_trunc('month', v_ngay)), 0)
    into v_da_ngay, v_da_thang
  from thu_thach_luot where hoc_sinh_id = new.hoc_sinh_id and mon = v_bt.mon;
  v_diem := case when v_goc = 0 then 0
                 else greatest(0, least(v_goc, v_cfg.tt_tran_ngay - v_da_ngay, v_cfg.tt_tran_thang - v_da_thang)) end;

  insert into thu_thach_luot (bai_lam_id, bai_test_id, hoc_sinh_id, mon, ngay, so_cau, so_dung, pass, diem_goc, diem)
  values (new.id, v_bt.id, new.hoc_sinh_id, v_bt.mon, v_ngay, v_bt.so_cau, v_so_dung,
          v_cfg.mon is not null and v_ti_le >= v_cfg.tt_pass, v_goc, v_diem)
  on conflict (bai_lam_id) do nothing;
  return new;
end $$;

drop trigger if exists trg_thu_thach_nop on bai_lam;
create trigger trg_thu_thach_nop after update of trang_thai on bai_lam
  for each row when (new.trang_thai = 'da_nop' and old.trang_thai is distinct from 'da_nop')
  execute function public.trg_thu_thach_nop();

-- Sinh 1 lượt Thử thách = đúng tu_luyen_sinh (y hệt Tổng hợp, L4) + đánh dấu.
create or replace function public.thu_thach_sinh(p_mon text, p_dangs jsonb) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare v jsonb;
begin
  if not exists (select 1 from rank_cau_hinh where mon = p_mon and bat) then
    raise exception 'Thử thách chưa mở cho môn %.', p_mon;
  end if;
  v := public.tu_luyen_sinh(p_mon, p_dangs);
  update bai_test set thu_thach = true where id = (v->>'bai_test_id')::uuid;
  return v;
end $$;

-- Lượt Thử thách hôm nay đang DỞ (để làm tiếp, không sinh đè) — cùng ý luotTuLuyenHomNay.
create or replace function public.thu_thach_luot_do(p_mon text) returns uuid
language sql stable security definer set search_path to 'public' as $$
  select bt.id from bai_test bt
  where bt.hoc_sinh_id = public.my_hoc_sinh_id() and bt.mon = p_mon and bt.loai = 'tu_luyen' and bt.thu_thach
    and bt.ngay = (now() at time zone 'Asia/Ho_Chi_Minh')::date
    and not exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop')
  order by bt.created_at desc limit 1
$$;

-- Kết quả lượt (màn xong bài). Làm đủ câu mà chưa nộp ⇒ nộp luôn ở đây (trigger chấm) — idempotent,
-- tránh đua với nopBai() nền của LamBai. Chưa làm đủ câu ⇒ null.
create or replace function public.fn_hs_thu_thach_ket_qua(p_bai_test uuid) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id(); v_bt record; v_bl record; v_l record; v_cfg record; v_ngay date;
begin
  select id, mon, so_cau, thu_thach into v_bt from bai_test where id = p_bai_test and hoc_sinh_id = v_hs;
  if v_bt.id is null or not v_bt.thu_thach then return null; end if;
  select id, trang_thai into v_bl from bai_lam where bai_test_id = p_bai_test and hoc_sinh_id = v_hs;
  if v_bl.id is null then return null; end if;
  if v_bl.trang_thai <> 'da_nop' then
    if (select count(*) from bai_lam_cau where bai_lam_id = v_bl.id) < v_bt.so_cau then return null; end if;
    update bai_lam set trang_thai = 'da_nop', nop_at = now() where id = v_bl.id and trang_thai = 'dang_lam';
  end if;
  select * into v_l from thu_thach_luot where bai_lam_id = v_bl.id;
  if v_l.bai_lam_id is null then return null; end if;
  select * into v_cfg from rank_cau_hinh where mon = v_bt.mon;
  v_ngay := v_l.ngay;
  return jsonb_build_object(
    'so_cau', v_l.so_cau, 'so_dung', v_l.so_dung, 'pass', v_l.pass, 'diem_goc', v_l.diem_goc, 'diem', v_l.diem,
    'pass_can', ceil(v_cfg.tt_pass * v_l.so_cau),
    'hom_nay', (select coalesce(sum(diem), 0) from thu_thach_luot where hoc_sinh_id = v_hs and mon = v_bt.mon and ngay = v_ngay),
    'tran_ngay', v_cfg.tt_tran_ngay,
    'thang', (select coalesce(sum(diem), 0) from thu_thach_luot where hoc_sinh_id = v_hs and mon = v_bt.mon
                and date_trunc('month', ngay) = date_trunc('month', v_ngay)),
    'tran_thang', v_cfg.tt_tran_thang);
end $$;

-- ---------- 4. MT: hạng tháng chỉ trong em CÓ điểm ----------
create or replace function public.fn_mt_hang_thang(p_mon text, p_ym text)
returns table(hoc_sinh_id uuid, khoi text, tb numeric, hang integer, so_em integer, hang_quy integer, diem_bang integer, ngay date)
language sql stable as $$
  with d as (
    select dt.hoc_sinh_id, kt.khoi, avg(coalesce(dt.diem, dt.diem_thi_lai)) as tb, max(b.ngay) as ngay
    from diem_thi dt
    join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'mt_sat_hach' and kt.mon = p_mon
    join buoi_hoc b on b.id = kt.buoi_hoc_id
    where coalesce(dt.diem, dt.diem_thi_lai) is not null and kt.khoi is not null
      and b.ngay >= (p_ym || '-25')::date
      and b.ngay < ((p_ym || '-01')::date + interval '1 month' + interval '10 days')::date
    group by dt.hoc_sinh_id, kt.khoi
  ), r as (
    select d.*, rank() over (partition by d.khoi order by d.tb desc)::int as hang,
           count(*) over (partition by d.khoi)::int as so_em
    from d
  ), q as (
    select r.*, ceil(r.hang * 50.0 / r.so_em)::int as hq from r
  )
  select q.hoc_sinh_id, q.khoi, round(q.tb, 2), q.hang, q.so_em, q.hq,
         round(50 + 50 * power((51 - q.hq) / 50.0, 1.5))::int, q.ngay
  from q
$$;
comment on function public.fn_mt_hang_thang(text, text) is 'MT tháng p_ym (cửa sổ 25/T→10/T+1) xếp trong khối × môn, CHỈ em có điểm (lỡ thi dùng điểm thi lại). hang_quy = ceil(hạng×50/số em) (D4), diem_bang = bảng hạng 1–50 (50..100).';

-- ---------- 5. Điểm Rank: sự kiện suy động (4 nguồn) ----------
create or replace function public.fn_rank_su_kien(p_mon text, p_thang_tu text, p_thang_den text, p_hs uuid[] default null)
returns table(hoc_sinh_id uuid, nguon text, thang text, ngay date, diem integer, ref_id uuid)
language sql stable as $$
  with cfg as (select * from rank_cau_hinh where mon = p_mon),
  buoi as (
    select b.id, b.ngay, to_char(b.ngay, 'YYYY-MM') as thang from buoi_hoc b join lop l on l.id = b.lop_id
    where l.mon = p_mon and b.loai in ('thuong', 'bu') and b.trang_thai <> 'huy'
      and b.ngay >= (p_thang_tu || '-01')::date and b.ngay < ((p_thang_den || '-01')::date + interval '1 month')::date
  ),
  et as (   -- 1 bài ET = (em × buổi) có dòng chấm ET. ET online đã mirror vào gami_grades (bai_lam_cau_id) từ 09/2026.
    select distinct g.hoc_sinh_id, g.buoi_hoc_id from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id and sp.phase = 'et'
    where g.buoi_hoc_id in (select id from buoi)
  )
  select et.hoc_sinh_id, 'et', b.thang, b.ngay, cfg.diem_et, b.id
  from et join buoi b on b.id = et.buoi_hoc_id cross join cfg
  where p_hs is null or et.hoc_sinh_id = any(p_hs)
  union all
  select k.hoc_sinh_id, 'btvn', b.thang, b.ngay,
         case k.trang_thai_nop when 'nop_dung_han' then cfg.diem_btvn_dung_han else cfg.diem_btvn_muon end, b.id
  from btvn_ket_qua k join buoi b on b.id = k.buoi_hoc_id cross join cfg
  where k.trang_thai_nop in ('nop_dung_han', 'nop_muon') and (p_hs is null or k.hoc_sinh_id = any(p_hs))
  union all
  select m.hoc_sinh_id, 'mt', t.ym, m.ngay, m.diem_bang * cfg.mt_he_so, null::uuid
  from generate_series((p_thang_tu || '-01')::date, (p_thang_den || '-01')::date, interval '1 month') g(d)
  cross join lateral (select to_char(g.d, 'YYYY-MM') as ym) t
  cross join lateral public.fn_mt_hang_thang(p_mon, t.ym) m
  cross join cfg
  where p_hs is null or m.hoc_sinh_id = any(p_hs)
  union all
  select tl.hoc_sinh_id, 'thu_thach', to_char(tl.ngay, 'YYYY-MM'), tl.ngay, tl.diem, tl.bai_lam_id
  from thu_thach_luot tl
  where tl.mon = p_mon and tl.diem > 0
    and to_char(tl.ngay, 'YYYY-MM') between p_thang_tu and p_thang_den
    and (p_hs is null or tl.hoc_sinh_id = any(p_hs))
$$;
comment on function public.fn_rank_su_kien(text, text, text, uuid[]) is 'Mọi sự kiện cộng Điểm Rank (ET · BTVN · MT · Thử thách) của môn trong khoảng THÁNG QUY ĐIỂM. MT của tháng T thi đầu tháng T+1 nhưng thang = T. Nguồn công thức DUY NHẤT của Điểm Rank.';

-- ---------- 6. Rank mùa (bậc + sao + ghế thần) ----------
create or replace function public.fn_rank_mua(p_mon text, p_khoi text default null, p_ngay date default null)
returns table(hoc_sinh_id uuid, ho_ten text, ma_hs text, lop_id uuid, ten_lop text, khoi text,
              diem_mua integer, bac smallint, ten_bac text, sao smallint, nguong_bac integer, nguong_sau integer,
              ghe text, hang_khoi integer, so_em_khoi integer, phong_do numeric)
language plpgsql stable as $$
-- plpgsql để tính mùa / tháng TRƯỚC rồi gọi fn_rank_su_kien bằng hằng: truyền cột CTE vào hàm SQL làm planner
-- mất inline ⇒ 35 s thay vì ~0,2 s (đo 28/09).
declare
  v_d date := coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date);
  v_tu text; v_den text;
begin
  select m.thang_dau, least(m.thang_cuoi, to_char(v_d, 'YYYY-MM')) into v_tu, v_den
  from gami_mua m where to_char(v_d, 'YYYY-MM') between m.thang_dau and m.thang_cuoi limit 1;
  if v_tu is null then return; end if;
  return query
  with nay as (select v_d as d),
  mua as (select v_tu as thang_dau),
  cfg as (select * from rank_cau_hinh where mon = p_mon),
  bac as (select rb.bac, rb.ten, round(rb.he_so * cfg.diem_toi_da_thang)::int as nguong from rank_bac rb, cfg where rb.mon = p_mon),
  roster as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop, l.khoi
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and (p_khoi is null or l.khoi = p_khoi)
    order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  diem as (
    select s.hoc_sinh_id, sum(s.diem)::int as d
    from public.fn_rank_su_kien(p_mon, v_tu, v_den) s
    where s.ngay <= v_d
    group by s.hoc_sinh_id
  ),
  -- Mẫu số phong độ: điểm tối đa CÓ THỂ kiếm tới hôm nay. Tháng đã qua: đủ phần ET+BTVN+Thử thách;
  -- tháng đang chạy: theo tỉ lệ ngày. Phần MT (100 × hệ số) chỉ cộng khi cửa sổ MT tháng đó đã đóng (10/T+1).
  mau as (
    select sum(
             (cfg.diem_toi_da_thang - 100 * cfg.mt_he_so)
               * case when (g.d + interval '1 month')::date <= nay.d then 1.0
                      else (nay.d - g.d + 1)::numeric / extract(day from (g.d + interval '1 month' - interval '1 day'))::numeric end
             + case when nay.d >= (g.d + interval '1 month' + interval '9 days')::date then 100 * cfg.mt_he_so else 0 end
           ) as toi_da
    from mua, nay, cfg,
         generate_series((mua.thang_dau || '-01')::date, date_trunc('month', nay.d)::date, interval '1 month') g0(x)
         cross join lateral (select g0.x::date as d) g
  ),
  r as (
    select ro.*, coalesce(di.d, 0) as dm,
           rank() over (partition by ro.khoi order by coalesce(di.d, 0) desc)::int as hk,
           count(*) over (partition by ro.khoi)::int as sk
    from roster ro left join diem di on di.hoc_sinh_id = ro.hoc_sinh_id
  )
  select r.hoc_sinh_id, hs.ho_ten, hs.ma_hs, r.lop_id, r.ten_lop, r.khoi, r.dm,
         b.bac, b.ten,
         least(3, 1 + floor(3.0 * (r.dm - b.nguong) / nullif(coalesce(bs.nguong, b.nguong + (b.nguong - bt.nguong)) - b.nguong, 0)))::smallint,
         b.nguong, bs.nguong,
         case when r.hk = 1 and r.dm >= cfg.supreme_phong_do * mau.toi_da and mau.toi_da > 0 then 'Supreme God'
              when r.hk <= greatest(1, round(cfg.god_top_pct * r.sk)) and r.dm >= cfg.god_phong_do * mau.toi_da and mau.toi_da > 0 then 'God of War'
         end,
         r.hk, r.sk, round(r.dm / nullif(mau.toi_da, 0), 3)
  from r
  join hoc_sinh hs on hs.id = r.hoc_sinh_id
  cross join cfg cross join mau
  cross join lateral (select * from bac where bac.nguong <= r.dm order by bac.bac desc limit 1) b
  left join bac bs on bs.bac = b.bac + 1
  left join bac bt on bt.bac = b.bac - 1
  order by r.khoi, r.hk, hs.ho_ten;
end $$;
comment on function public.fn_rank_mua(text, text, date) is 'Rank mùa theo khối × môn tại ngày p_ngay (mặc định hôm nay VN): Điểm Rank cộng dồn, bậc 1–8 + sao, ghế thần (God of War: top % & phong độ; Supreme God: hạng 1 & phong độ, xét lại mỗi lần gọi).';

-- ---------- 7. Bảng đua tháng ----------
create or replace function public.fn_rank_dua_thang(p_mon text, p_khoi text, p_ym text)
returns table(hoc_sinh_id uuid, ho_ten text, ma_hs text, ten_lop text, diem_thang integer, hang integer, so_em_co_diem integer,
              et integer, btvn integer, mt integer, thu_thach integer)
language sql stable as $$
  with roster as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.ten_lop
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
    order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  s as (
    select s.hoc_sinh_id, sum(s.diem)::int as d,
           sum(s.diem) filter (where s.nguon = 'et')::int as et, sum(s.diem) filter (where s.nguon = 'btvn')::int as btvn,
           sum(s.diem) filter (where s.nguon = 'mt')::int as mt, sum(s.diem) filter (where s.nguon = 'thu_thach')::int as tt
    from public.fn_rank_su_kien(p_mon, p_ym, p_ym) s
    group by s.hoc_sinh_id
  )
  select ro.hoc_sinh_id, hs.ho_ten, hs.ma_hs, ro.ten_lop, s.d,
         (rank() over (order by s.d desc))::int, (count(*) over ())::int,
         coalesce(s.et, 0), coalesce(s.btvn, 0), coalesce(s.mt, 0), coalesce(s.tt, 0)
  from roster ro join s on s.hoc_sinh_id = ro.hoc_sinh_id and s.d > 0
  join hoc_sinh hs on hs.id = ro.hoc_sinh_id
  order by s.d desc, hs.ho_ten
$$;
comment on function public.fn_rank_dua_thang(text, text, text) is 'Bảng đua tháng: Điểm Rank kiếm được trong tháng quy điểm p_ym, khối × môn, chỉ em có điểm > 0. Không đổi bậc.';

-- ---------- 8. App HS ----------
create or replace function public.fn_hs_rank_cua_toi(p_mon text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id(); v_khoi text; v_ym text := to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM');
  v_toi jsonb; v_top jsonb; v_dua jsonb; v_dua_top jsonb; v_cfg record; v_ngay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  if v_hs is null then return null; end if;
  select * into v_cfg from rank_cau_hinh where mon = p_mon and bat;
  if v_cfg.mon is null then return null; end if;
  select l.khoi into v_khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon order by hl.ngay_vao desc nulls last limit 1;
  if v_khoi is null then return null; end if;

  create temp table _rk on commit drop as select * from public.fn_rank_mua(p_mon, v_khoi);
  select to_jsonb(r) - 'hoc_sinh_id' - 'ma_hs' - 'lop_id' into v_toi from _rk r where r.hoc_sinh_id = v_hs;
  select jsonb_agg(jsonb_build_object('ho_ten', r.ho_ten, 'ten_lop', r.ten_lop, 'diem_mua', r.diem_mua, 'ten_bac', coalesce(r.ghe, r.ten_bac),
                                      'sao', r.sao, 'hang', r.hang_khoi, 'la_toi', r.hoc_sinh_id = v_hs) order by r.hang_khoi, r.ho_ten)
    into v_top from (select * from _rk order by hang_khoi, ho_ten limit 10) r;
  drop table _rk;

  create temp table _dt on commit drop as select * from public.fn_rank_dua_thang(p_mon, v_khoi, v_ym);
  select to_jsonb(d) - 'hoc_sinh_id' - 'ma_hs' into v_dua from _dt d where d.hoc_sinh_id = v_hs;
  select jsonb_agg(jsonb_build_object('ho_ten', d.ho_ten, 'ten_lop', d.ten_lop, 'diem', d.diem_thang, 'hang', d.hang,
                                      'la_toi', d.hoc_sinh_id = v_hs) order by d.hang, d.ho_ten)
    into v_dua_top from (select * from _dt order by hang, ho_ten limit 10) d;
  drop table _dt;

  return jsonb_build_object(
    'mon', p_mon, 'khoi', v_khoi, 'thang', v_ym,
    'toi', v_toi, 'top_mua', coalesce(v_top, '[]'::jsonb),
    'dua_thang', v_dua, 'top_dua_thang', coalesce(v_dua_top, '[]'::jsonb),
    'bac', (select jsonb_agg(jsonb_build_object('bac', rb.bac, 'ten', rb.ten, 'nguong', round(rb.he_so * v_cfg.diem_toi_da_thang)) order by rb.bac)
            from rank_bac rb where rb.mon = p_mon),
    'thu_thach', jsonb_build_object(
      'hom_nay', (select coalesce(sum(diem), 0) from thu_thach_luot where hoc_sinh_id = v_hs and mon = p_mon and ngay = v_ngay),
      'tran_ngay', v_cfg.tt_tran_ngay,
      'thang', (select coalesce(sum(diem), 0) from thu_thach_luot where hoc_sinh_id = v_hs and mon = p_mon
                  and date_trunc('month', ngay) = date_trunc('month', v_ngay)),
      'tran_thang', v_cfg.tt_tran_thang));
end $$;


-- ---------- 9. Quyền ----------
revoke all on function public.trg_thu_thach_nop(), public.thu_thach_sinh(text, jsonb), public.thu_thach_luot_do(text),
  public.fn_hs_thu_thach_ket_qua(uuid), public.fn_mt_hang_thang(text, text), public.fn_rank_su_kien(text, text, text, uuid[]),
  public.fn_rank_mua(text, text, date), public.fn_rank_dua_thang(text, text, text), public.fn_hs_rank_cua_toi(text) from public, anon;
grant execute on function public.thu_thach_sinh(text, jsonb), public.thu_thach_luot_do(text),
  public.fn_hs_thu_thach_ket_qua(uuid), public.fn_mt_hang_thang(text, text), public.fn_rank_su_kien(text, text, text, uuid[]),
  public.fn_rank_mua(text, text, date), public.fn_rank_dua_thang(text, text, text), public.fn_hs_rank_cua_toi(text) to authenticated;
