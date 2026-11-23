-- ============================================================================
-- 202611232132 — dang_yeu_chup_dau_tuan_theo_khoi   (Thùy 23/11: "trưởng khối nói nhóm yếu các thứ ko tự tổng kết")
-- ----------------------------------------------------------------------------
-- GỐC (đo thật): lịch cron 'tu-dong-sang-t2' đêm 22/11 17:05 UTC chạy _tu_dong_sang_t2() → _dang_yeu_chup_tuan → _nhom_yeu_tai_lo
--   → "canceling statement due to statement timeout" sau đúng 2 phút (trần của lịch). Từ 17/11 ảnh có thêm NHÓM YẾU tại mốc (mig 202611171134)
--   nên một lượt chụp cả hệ (mọi môn, mọi em) không còn vừa 2 phút ⇒ cả lượt bị huỷ ⇒ không có ảnh đầu tuần 23/11
--   ⇒ (a) tuần 16–22/11 không chốt được sổ bctk_so_tuan_o (cần ảnh cuối tuần) · (b) tab tuần đang chạy thiếu số nhóm / dạng yếu đầu tuần
--   · (c) Tổng kết tuần (trợ lý) của tuần 16/11 không cập nhật.
-- SỬA (khuôn bộ điều phối, luật 16/11; spec-kien-truc §12 "lượt làm mới có ngân sách giây"):
--   1. _dang_yeu_chup_tuan_khoi(tuan, môn, khối): chụp MỘT ô (cùng công thức với _dang_yeu_chup_tuan, ảnh tính TẠI MỐC 00:00 thứ Hai).
--   2. _dang_yeu_chup_dau_tuan_lo(ngân sách): mỗi lượt chụp vài ô chưa chụp của tuần này, ghi tiến độ dang_yeu_chup_o; đủ mọi ô ⇒ ghi
--      dang_yeu_chup_xong (ảnh ĐỦ) rồi chạy Tổng kết tuần vừa rồi. Có ảnh đủ rồi ⇒ chỉ một câu exists, không làm gì.
--   3. _bctk_so_tuan_chot chỉ chốt khi ảnh đầu VÀ cuối tuần đều ĐỦ (trước: "có dòng nào là được" ⇒ ảnh dở dang sẽ chốt số sai vĩnh viễn).
--   4. Bộ điều phối: dòng 'chup_dau_tuan' gọi hàm mới, 5 phút/lần, 0–16 h và 22–23 h (né 17–22 h giờ học sinh chơi).
--   Lịch cron cũ 'tu-dong-sang-t2' tắt bằng file 202611232133_..._cron_sql_editor.sql (SQL Editor). Còn chạy thì cũng vô hại: hết giờ ⇒ huỷ, không ghi gì.
-- MẤT GÌ (Luật xoá): không. _dang_yeu_chup_tuan_khoi chỉ xoá-rồi-ghi đúng ô (tuần, môn, khối) nó đang chụp — ô CHƯA có tiến độ, tức chưa có ảnh của máy.
-- ============================================================================

-- ── sổ tiến độ + dấu ảnh đủ ──
create table if not exists public.dang_yeu_chup_o (
  tuan date not null, mon text not null, khoi text not null,
  so_dong int not null, ms int not null, chup_at timestamptz not null default now(),
  primary key (tuan, mon, khoi)
);
create table if not exists public.dang_yeu_chup_xong (
  tuan date primary key, so_o int not null, so_dong int not null,
  xong_at timestamptz not null default now(), tong_ket_at timestamptz
);
alter table public.dang_yeu_chup_o enable row level security;
alter table public.dang_yeu_chup_xong enable row level security;
-- chỉ tác vụ nền ghi / đọc; người đăng nhập không cần (màn đọc qua fn_bctk_*) ⇒ không policy cho authenticated

-- ảnh 09/11 và 16/11 đã chụp đủ (chụp lại tay 17/11, mig 202611171833) ⇒ đánh dấu đủ để sổ chốt đọc được
insert into public.dang_yeu_chup_xong (tuan, so_o, so_dong, xong_at, tong_ket_at)
select z.tuan, count(distinct (z.mon, z.khoi))::int, count(*)::int, max(z.tinh_at), max(z.tinh_at)
  from public.dang_yeu_dau_tuan z where z.tuan in ('2026-11-09', '2026-11-16') group by z.tuan
on conflict (tuan) do nothing;

-- ── 1. chụp MỘT ô (môn × khối) tại mốc ──
create or replace function public._dang_yeu_chup_tuan_khoi(p_tuan date, p_mon text, p_khoi text)
returns integer language plpgsql security definer set search_path = public as $$
declare
  v_moc timestamptz := (p_tuan::timestamp at time zone 'Asia/Ho_Chi_Minh');
  k int;
begin
  delete from dang_yeu_dau_tuan where tuan = p_tuan and mon = p_mon and khoi = p_khoi;
  with hs0 as (     -- HS ở lớp của môn TẠI MỐC (một em một lớp mỗi môn — chọn lớp vào sau cùng, rồi mới lọc khối)
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.khoi
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where l.mon = p_mon and l.khoi is not null
       and hl.ngay_vao < p_tuan and (hl.ngay_roi is null or hl.ngay_roi >= p_tuan - 1)
     order by hl.hoc_sinh_id, hl.ngay_vao desc
  ),
  co_do as (        -- chỉ HS đã từng được đo ở môn trước mốc (chưa đo ≠ 0 dạng yếu)
    select hs0.* from hs0
     where hs0.khoi = p_khoi
       and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                     join buoi_hoc b on b.id = p.buoi_hoc_id join lop l2 on l2.id = b.lop_id
                    where g.hoc_sinh_id = hs0.hoc_sinh_id and l2.mon = p_mon and b.ngay < p_tuan)
  ),
  dy as (select * from public._dang_yeu_tai_lo(array(select c.hoc_sinh_id from co_do c), p_mon, v_moc)),
  ny as materialized (select * from public._nhom_yeu_tai_lo(array(select c.hoc_sinh_id from co_do c), p_mon, v_moc))
  insert into dang_yeu_dau_tuan (tuan, mon, khoi, hoc_sinh_id, so_dang_yeu, dang, tinh_at, chot_id, so_nhom_yeu, nhom)
  select p_tuan, p_mon, c.khoi, c.hoc_sinh_id, count(dy.ma_dang)::int,
         coalesce(jsonb_agg(jsonb_build_object('ma_dang', dy.ma_dang, 'ten_dang', dy.ten_dang, 'score', dy.score, 'n', dy.n))
                  filter (where dy.ma_dang is not null), '[]'::jsonb),
         now(), null,
         (select count(*)::int from ny where ny.hoc_sinh_id = c.hoc_sinh_id),
         (select coalesce(jsonb_agg(jsonb_build_object('nhom', ny.nhom, 'ten_nhom', ny.ten_nhom, 'score', round(ny.score, 2), 'n', ny.n) order by ny.score), '[]'::jsonb)
            from ny where ny.hoc_sinh_id = c.hoc_sinh_id)
    from co_do c left join dy on dy.hoc_sinh_id = c.hoc_sinh_id
   group by c.hoc_sinh_id, c.khoi;
  get diagnostics k = row_count;
  return k;
end $$;
revoke execute on function public._dang_yeu_chup_tuan_khoi(date, text, text) from public, anon, authenticated;

-- ── 2. lượt chụp có ngân sách (bộ điều phối gọi) ──
create or replace function public._dang_yeu_chup_dau_tuan_lo(p_ngan_sach_giay integer default 80)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_bd   timestamptz := clock_timestamp();
  v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date;
  v_xong dang_yeu_chup_xong%rowtype;
  r record; v_t timestamptz; k int; n_o int := 0; v_con int;
begin
  select * into v_xong from dang_yeu_chup_xong where tuan = v_tuan;
  if found and v_xong.tong_ket_at is not null then return jsonb_build_object('tuan', v_tuan, 'da_du', true); end if;

  if not found then
    -- các ô cần chụp = (môn đang học) × (khối có em ở lớp của môn TẠI MỐC); ô đã có tiến độ thì bỏ qua
    for r in
      select distinct l.mon, l.khoi
        from lop l join hoc_sinh_lop hl on hl.lop_id = l.id
       where l.mon in (select distinct l0.mon from lop l0 where l0.trang_thai = 'dang_hoc' and l0.mon is not null)
         and l.khoi is not null
         and hl.ngay_vao < v_tuan and (hl.ngay_roi is null or hl.ngay_roi >= v_tuan - 1)
         and not exists (select 1 from dang_yeu_chup_o o where o.tuan = v_tuan and o.mon = l.mon and o.khoi = l.khoi)
       order by l.mon, l.khoi
    loop
      exit when n_o > 0 and clock_timestamp() - v_bd > make_interval(secs => p_ngan_sach_giay / 2);   -- ô kế có thể to bằng ô vừa rồi
      v_t := clock_timestamp();
      k := public._dang_yeu_chup_tuan_khoi(v_tuan, r.mon, r.khoi);
      insert into dang_yeu_chup_o (tuan, mon, khoi, so_dong, ms)
      values (v_tuan, r.mon, r.khoi, k, round(extract(epoch from clock_timestamp() - v_t) * 1000)::int);
      n_o := n_o + 1;
    end loop;
    -- còn ô chưa chụp ⇒ để lượt sau
    select count(*) into v_con
      from (select distinct l.mon, l.khoi
              from lop l join hoc_sinh_lop hl on hl.lop_id = l.id
             where l.mon in (select distinct l0.mon from lop l0 where l0.trang_thai = 'dang_hoc' and l0.mon is not null)
               and l.khoi is not null
               and hl.ngay_vao < v_tuan and (hl.ngay_roi is null or hl.ngay_roi >= v_tuan - 1)) o
     where not exists (select 1 from dang_yeu_chup_o x where x.tuan = v_tuan and x.mon = o.mon and x.khoi = o.khoi);
    if v_con > 0 then return jsonb_build_object('tuan', v_tuan, 'chup_o', n_o, 'con_o', v_con); end if;
    insert into dang_yeu_chup_xong (tuan, so_o, so_dong)
    select v_tuan, count(*)::int, coalesce(sum(so_dong), 0)::int from dang_yeu_chup_o where tuan = v_tuan;
  end if;

  -- ảnh đủ ⇒ Tổng kết tuần vừa rồi (trợ lý) — cùng lệnh _tu_dong_sang_t2 cũ; còn thiếu giờ thì để lượt sau
  if n_o > 0 and clock_timestamp() - v_bd > make_interval(secs => p_ngan_sach_giay / 2) then
    return jsonb_build_object('tuan', v_tuan, 'chup_o', n_o, 'anh_du', true, 'tong_ket', 'luot_sau');
  end if;
  perform set_config('troly.noi_bo', '1', true);
  k := public._troly_tuan_cap_nhat(v_tuan - 7, true, 3);
  perform set_config('troly.noi_bo', '', true);
  update dang_yeu_chup_xong set tong_ket_at = now() where tuan = v_tuan;
  return jsonb_build_object('tuan', v_tuan, 'chup_o', n_o, 'anh_du', true, 'tong_ket_tuan', k);
end $$;
revoke execute on function public._dang_yeu_chup_dau_tuan_lo(integer) from public, anon, authenticated;

-- hàm cũ (cron cũ + chụp lại tay) đi qua đường mới: chụp lần lượt mọi ô, KHÔNG ngân sách — chỉ dùng tay từ SQL Editor / claude_build
create or replace function public._dang_yeu_chup_tuan(p_tuan date)
returns integer language plpgsql security definer set search_path = public as $$
declare r record; n int := 0;
begin
  for r in
    select distinct l.mon, l.khoi
      from lop l join hoc_sinh_lop hl on hl.lop_id = l.id
     where l.mon in (select distinct l0.mon from lop l0 where l0.trang_thai = 'dang_hoc' and l0.mon is not null)
       and l.khoi is not null
       and hl.ngay_vao < p_tuan and (hl.ngay_roi is null or hl.ngay_roi >= p_tuan - 1)
  loop
    n := n + public._dang_yeu_chup_tuan_khoi(p_tuan, r.mon, r.khoi);
  end loop;
  return n;
end $$;

-- ── 3. sổ chốt tuần chỉ đọc ảnh ĐỦ ──
create or replace function public._bctk_so_tuan_chot(p_ngan_sach_giay integer default 40)
returns integer language plpgsql security definer set search_path = public as $$
declare
  v_bd timestamptz := clock_timestamp();
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  r record; v_so jsonb; n int := 0;
begin
  for r in
    select t.tuan, o.mon, o.khoi
      from (select x.tuan from dang_yeu_chup_xong x
             where x.tuan >= v_nay - 70 and x.tuan + 7 <= v_nay
               and exists (select 1 from dang_yeu_chup_xong c where c.tuan = x.tuan + 7)) t   -- ảnh đầu VÀ cuối tuần đều đủ
      cross join lateral (select distinct z.mon, z.khoi from dang_yeu_dau_tuan z where z.tuan = t.tuan and z.khoi is not null) o
     where not exists (select 1 from bctk_so_tuan_o s where s.tuan = t.tuan and s.mon = o.mon and s.khoi = o.khoi)
     order by t.tuan desc, o.mon, o.khoi
  loop
    exit when clock_timestamp() - v_bd > make_interval(secs => p_ngan_sach_giay);
    v_so := public.fn_bctk_so(jsonb_build_array(jsonb_build_object('mon', r.mon, 'khoi', r.khoi)), r.tuan);
    insert into bctk_so_tuan_o (tuan, mon, khoi, tong, phien_ban)
    values (r.tuan, r.mon, r.khoi, v_so->'tong', coalesce((v_so->>'phien_ban')::int, 0))
    on conflict (tuan, mon, khoi) do nothing;
    n := n + 1;
  end loop;
  return n;
end $$;

-- ── 4. bộ điều phối ──
update public.tinh_san_dang_ky
   set lenh = 'public._dang_yeu_chup_dau_tuan_lo(80)', chu_ky_phut = 5,
       gio_chay = array[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 22, 23], uu_tien = 1, ngan_sach_giay = 90,
       ghi_chu = 'Thùy 23/11 · thay cron tu-dong-sang-t2 (đêm 22/11 hết giờ 2 phút) · chụp từng ô môn×khối tại mốc 00:00 thứ Hai, đủ ⇒ dang_yeu_chup_xong + Tổng kết tuần · đủ rồi ⇒ một câu exists'
 where ma = 'chup_dau_tuan';
-- hàm tạm ở mig 202611232126 (một lượt chụp cả hệ — chính là cái hết giờ) ⇒ đi qua đường mới, không xoá
create or replace function public._tu_dong_sang_t2_neu_thieu()
returns jsonb language sql security definer set search_path = public as $$ select public._dang_yeu_chup_dau_tuan_lo(80) $$;

-- ── 5. hai hàm đọc cũ: người gọi ⇒ invoker (cổng nằm ở fn_bctk_tuan / fn_bctk_tuan_o) ──
alter function public.fn_bctk_hien_tai() security invoker;
alter function public.fn_bctk_hien_tai_o(text, text) security invoker;
