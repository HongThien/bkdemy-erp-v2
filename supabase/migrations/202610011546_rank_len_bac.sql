-- ============================================================================
-- NHẬT KÝ LÊN BẬC RANK (spec-v1-app-hs.md §1 hạng mục 4 — để có hoạt cảnh "lên bậc" + tin Thế giới BK)
-- Bậc Rank là SUY ĐỘNG từ điểm tích luỹ mùa (fn_rank_mua) nên không có "khoảnh khắc lên bậc". Bảng này là SỰ KIỆN ĐÃ XẢY RA (chỉ thêm,
-- 1 dòng / em / môn / mùa / bậc) với NGÀY chạm bậc suy từ chuỗi điểm theo ngày của fn_rank_su_kien (cộng dồn đến khi vượt ngưỡng) — chính xác kể cả
-- khi phát hiện muộn. Phát hiện: (1) trigger sau mỗi lượt Thử thách của em · (2) mỗi lần em mở Rank/Home (fn_hs_len_bac_moi) quét CẢ môn nếu quá 30 phút
-- chưa quét — vì ET/BTVN/MT không có trigger. Bậc đạt từ lâu (> 2 ngày trước) ghi sẵn xem_at ⇒ không bật hoạt cảnh cho dữ liệu cũ.
-- ============================================================================

create table if not exists public.rank_len_bac (
  hoc_sinh_id  uuid not null references public.hoc_sinh(id),
  mon          text not null,
  mua          text not null,                 -- gami_mua.mua (vd '2026-27')
  bac          smallint not null check (bac between 2 and 10),
  ten_bac      text not null,
  dat_ngay     date not null,                 -- ngày điểm tích luỹ vượt ngưỡng bậc này (giờ VN)
  diem_luc_dat integer not null,              -- điểm tích luỹ ngay sau sự kiện làm vượt ngưỡng
  ghi_at       timestamptz not null default now(),
  xem_at       timestamptz,                   -- em đã xem hoạt cảnh lúc nào (null = chưa)
  primary key (hoc_sinh_id, mon, mua, bac)
);
alter table public.rank_len_bac enable row level security;   -- chỉ đọc qua hàm security definer
create table if not exists public.rank_len_bac_quet (mon text primary key, at timestamptz not null);
alter table public.rank_len_bac_quet enable row level security;

-- ── Ghi các bậc đã chạm (idempotent). p_hs null = cả môn. Trả số dòng mới. ──
create or replace function public._rank_len_bac_ghi(p_mon text, p_hs uuid[] default null)
returns integer language plpgsql volatile as $$
declare
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_mua text; v_tu text; v_den text; v_n int;
begin
  select m.mua, m.thang_dau, least(m.thang_cuoi, to_char(v_nay, 'YYYY-MM')) into v_mua, v_tu, v_den
    from gami_mua m where to_char(v_nay, 'YYYY-MM') between m.thang_dau and m.thang_cuoi limit 1;
  if v_mua is null or not exists (select 1 from rank_cau_hinh where mon = p_mon and bat) then return 0; end if;
  with cfg as (select * from rank_cau_hinh where mon = p_mon),
  bac as (select rb.bac, rb.ten, round(rb.he_so * cfg.diem_toi_da_thang)::int as nguong from rank_bac rb, cfg where rb.mon = p_mon and rb.bac >= 2),
  roster as (select distinct hl.hoc_sinh_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
             where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and (p_hs is null or hl.hoc_sinh_id = any(p_hs))),
  ev as (
    select s.hoc_sinh_id, s.ngay,
           sum(s.diem) over (partition by s.hoc_sinh_id order by s.ngay, s.nguon, s.ref_id rows between unbounded preceding and current row)::int as cum
    from public.fn_rank_su_kien(p_mon, v_tu, v_den, p_hs) s
    where s.ngay <= v_nay and s.hoc_sinh_id in (select hoc_sinh_id from roster)
  ),
  cham as (
    select e.hoc_sinh_id, b.bac, b.ten, min(e.ngay) as dat_ngay, min(e.cum) as diem_luc_dat
    from ev e join bac b on e.cum >= b.nguong
    group by e.hoc_sinh_id, b.bac, b.ten
  )
  insert into rank_len_bac (hoc_sinh_id, mon, mua, bac, ten_bac, dat_ngay, diem_luc_dat, xem_at)
  select c.hoc_sinh_id, p_mon, v_mua, c.bac, c.ten, c.dat_ngay, c.diem_luc_dat,
         case when c.dat_ngay < v_nay - 2 then now() end      -- đạt từ lâu: coi như đã xem
  from cham c
  on conflict do nothing;
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- Trigger sau mỗi lượt Thử thách (cheap: 1 em). Lỗi chỉ cảnh báo — KHÔNG chặn nộp bài.
create or replace function public._trg_rank_len_bac()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  begin perform public._rank_len_bac_ghi(new.mon, array[new.hoc_sinh_id]);
  exception when others then raise warning 'rank_len_bac: không ghi được cho % — %', new.hoc_sinh_id, sqlerrm;
  end;
  return new;
end $$;
drop trigger if exists trg_rank_len_bac on public.thu_thach_luot;
create trigger trg_rank_len_bac after insert on public.thu_thach_luot for each row execute function public._trg_rank_len_bac();

-- ── App HS: mở Home/Rank gọi hàm này ⇒ bậc mới chưa xem (hoạt cảnh). Quét cả môn nếu quá 30 phút. ──
create or replace function public.fn_hs_len_bac_moi(p_mon text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  if pg_try_advisory_xact_lock(hashtext('rank_len_bac_quet:' || p_mon))
     and coalesce((select q.at from rank_len_bac_quet q where q.mon = p_mon), '-infinity') < now() - interval '30 minutes' then
    perform public._rank_len_bac_ghi(p_mon, null);
    insert into rank_len_bac_quet (mon, at) values (p_mon, now()) on conflict (mon) do update set at = excluded.at;
  end if;
  perform public._rank_len_bac_ghi(p_mon, array[v_hs]);
  return coalesce((select jsonb_agg(jsonb_build_object('bac', r.bac, 'ten_bac', r.ten_bac, 'dat_ngay', r.dat_ngay, 'mon', r.mon) order by r.bac)
                   from rank_len_bac r where r.hoc_sinh_id = v_hs and r.mon = p_mon and r.xem_at is null), '[]'::jsonb);
end $$;

create or replace function public.fn_hs_len_bac_da_xem(p_mon text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update rank_len_bac set xem_at = now() where hoc_sinh_id = public.my_hoc_sinh_id() and mon = p_mon and xem_at is null;
end $$;

-- ── Tin Thế giới BK: thân NGUYÊN bản đang chạy (pg_get_functiondef) + nhánh 'len_bac' ──
CREATE OR REPLACE FUNCTION public._the_gioi_tin(p_tu timestamp with time zone)
 RETURNS TABLE(khoa text, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text, at timestamp with time zone, chi_tiet jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Nhất buổi (giải 1 xếp hạng buổi)
  select 'nhat_buoi:' || g.buoi_hoc_id || ':' || g.hoc_sinh_id, 'A', 'hoc', 'nhat_buoi', g.hoc_sinh_id, array[g.hoc_sinh_id], b.lop_id, g.mon,
         coalesce(b.giai_chot_at, g.created_at), jsonb_build_object('ngay', b.ngay)
  from buoi_giai g join buoi_hoc b on b.id = g.buoi_hoc_id
  where g.giai = 1 and coalesce(b.giai_chot_at, g.created_at) >= p_tu
  union all
  -- Nhất game buổi (cá nhân) — Bắn Quà chế độ đội thì tin theo ĐỘI ở dưới
  select 'game:' || l.id, 'A', 'game', 'game_nhat', l.hoc_sinh_id, array[l.hoc_sinh_id], b.lop_id, l.mon, l.at,
         jsonb_build_object('game', l.game, 'ngay', b.ngay)
  from buoi_game_luot l join buoi_hoc b on b.id = l.buoi_hoc_id
  where l.giai = 1 and l.at >= p_tu
    and not exists (select 1 from buoi_ban_qua q where q.buoi_hoc_id = l.buoi_hoc_id and q.che_do = 'doi' and l.game = 'ban_qua')
  union all
  -- 🧋 trúng trà sữa — tầng S
  select 'tra_sua:' || q.luot_id, 'S', 'mayman', 'tra_sua', q.hoc_sinh_id, array[q.hoc_sinh_id], b.lop_id, l.mon, q.at,
         jsonb_build_object('game', l.game, 'ngay', b.ngay)
  from buoi_game_qua q join buoi_game_luot l on l.id = q.luot_id join buoi_hoc b on b.id = q.buoi_hoc_id
  where q.qua = 'tra_sua' and q.at >= p_tu
  union all
  -- Đội thắng Bắn Quà (chế độ đội)
  select 'ban_qua:' || q.buoi_hoc_id || ':' || d.doi, 'A', 'game', 'doi_thang', null::uuid,
         array(select h.hoc_sinh_id from buoi_ban_qua_hs h where h.buoi_hoc_id = q.buoi_hoc_id and h.doi = d.doi),
         b.lop_id, q.mon, q.chot_at, jsonb_build_object('doi', d.doi, 'game', 'ban_qua', 'ngay', b.ngay)
  from buoi_ban_qua q join buoi_ban_qua_doi d on d.buoi_hoc_id = q.buoi_hoc_id and d.hang = 1 join buoi_hoc b on b.id = q.buoi_hoc_id
  where q.che_do = 'doi' and q.chot_at >= p_tu
  union all
  -- Huy hiệu: ★4–5 = S, ★1–3 = A
  select 'huy_hieu:' || x.id, case when x.sao >= 4 then 'S' else 'A' end, 'hoc', 'huy_hieu', x.hoc_sinh_id, array[x.hoc_sinh_id], null::uuid, x.mon, x.dat_at,
         jsonb_build_object('key', x.huy_hieu_key, 'ten', hh.ten, 'sao', x.sao)
  from hs_huy_hieu_dat x left join huy_hieu hh on hh.mon = x.mon and hh.key = x.huy_hieu_key
  where x.dat_at >= p_tu
  union all
  -- Giải tháng đã công bố — tầng S
  select 'giai_thang:' || g.id, 'S', 'hoc', 'giai_thang', g.hoc_sinh_id, array[g.hoc_sinh_id], g.lop_id, g.mon, g.cong_bo_at,
         jsonb_build_object('loai_giai', g.loai_giai, 'thang', g.thang)
  from giai_thuong g where g.cong_bo_at >= p_tu
  union all
  -- ET điểm cao (Thùy 29/09: tin phải là THÀNH TÍCH có số, tích cực — bỏ tin "xong N bài"). Chỉ ET từ 5 câu (đo 28 ngày: 41% lượt ET
  -- được 10 điểm nhưng phần lớn là ET 1–3 câu ⇒ không đáng khoe). ET 10 điểm = A (~5/ngày toàn trung tâm) · ET 9–9,5 = B.
  select 'et:' || e.buoi_hoc_id || ':' || e.hoc_sinh_id, case when e.ti_le = 1 then 'A' else 'B' end, 'hoc', 'et_cao',
         e.hoc_sinh_id, array[e.hoc_sinh_id], e.lop_id, e.mon, e.cham_at,
         jsonb_build_object('ngay', e.ngay, 'diem', round(e.ti_le * 10, 1), 'so_cau', e.so_cau)
  from public._et_diem_buoi((p_tu at time zone 'Asia/Ho_Chi_Minh')::date, (now() at time zone 'Asia/Ho_Chi_Minh')::date) e
  where e.so_cau >= 5 and e.ti_le >= 0.9 and e.cham_at >= p_tu
  union all
  -- Tự luyện chăm (tầng B): ≥ 50 câu ĐÚNG trong 1 ngày / môn (đo 28 ngày: trung vị 12, top 10% ≈ 59) — 1 tin / em / ngày / môn
  select 'tu_luyen:' || bl.hoc_sinh_id || ':' || (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date || ':' || bt.mon, 'B', 'noluc', 'tu_luyen',
         bl.hoc_sinh_id, array[bl.hoc_sinh_id], null::uuid, bt.mon, max(blc.cham_at),
         jsonb_build_object('ngay', (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date, 'so_dung', count(*))
  from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
  where bt.loai = 'tu_luyen' and blc.verdict = 'correct' and blc.cham_at >= p_tu
  group by bl.hoc_sinh_id, (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date, bt.mon
  having count(*) >= 50
  union all
  -- 🔥 Chuỗi làm bài (mig 202610011515): mốc 7 = A (Lớp + Bạn bè) · 30/100/200/365 = S (lên Thế giới). Mỗi chuỗi chỉ tin MỐC CAO NHẤT trong cửa sổ.
  select * from (
  select distinct on (m.hoc_sinh_id, m.bat_dau)
         'chuoi:' || m.hoc_sinh_id || ':' || m.bat_dau || ':' || m.moc, case when m.moc >= 30 then 'S' else 'A' end, 'noluc', 'chuoi',
         m.hoc_sinh_id, array[m.hoc_sinh_id], null::uuid, m.mon, m.dat_at, jsonb_build_object('so_ngay', m.moc)
  from chuoi_moc_dat m
  where m.dat_at >= p_tu
  order by m.hoc_sinh_id, m.bat_dau, m.moc desc
  ) chuoi_tin
  union all
  -- ⬆ Lên bậc Rank (mig rank_len_bac): bậc 3–4 = B · 5–6 = A · ≥7 = S (lên Thế giới). Soldier (bậc 2) và Novice không có tin.
  select 'len_bac:' || r.hoc_sinh_id || ':' || r.mua || ':' || r.mon || ':' || r.bac,
         case when r.bac >= 7 then 'S' when r.bac >= 5 then 'A' else 'B' end, 'hoc', 'len_bac',
         r.hoc_sinh_id, array[r.hoc_sinh_id], null::uuid, r.mon, (r.dat_ngay::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '12 hours',
         jsonb_build_object('bac', r.bac, 'ten_bac', r.ten_bac)
  from rank_len_bac r
  where r.bac >= 3 and (r.dat_ngay::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '12 hours' >= p_tu
$function$;

revoke all on function public._rank_len_bac_ghi(text, uuid[]) from public, anon, authenticated;
revoke all on function public._trg_rank_len_bac() from public, anon, authenticated;
revoke all on function public.fn_hs_len_bac_moi(text) from public, anon;
grant execute on function public.fn_hs_len_bac_moi(text) to authenticated;
revoke all on function public.fn_hs_len_bac_da_xem(text) from public, anon;
grant execute on function public.fn_hs_len_bac_da_xem(text) to authenticated;
