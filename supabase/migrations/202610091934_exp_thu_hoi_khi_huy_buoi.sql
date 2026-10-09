-- ============================================================================
-- 202610091934 — exp_thu_hoi_khi_huy_buoi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Lỗ CEO bắt khi soát top xu 09/10: huỷ buổi SAU khi đã đóng phase thì EXP đã ghi cho buổi đó
--   (attend_floor 250 của buổi bù/bổ trợ; exp_et/exp_btvn/exp_tren_lop của buổi thường) vẫn nằm
--   trong gami_exp_ledger ⇒ vẫn quy ra xu. huyBuoi (src/lib/gami.ts) chỉ đổi trang_thai, không trigger
--   nào trên buoi_hoc đụng ledger; fn_recompute_exp_thang bỏ qua buổi huỷ nên dòng cũ sống mãi.
--
--   INVARIANT (§4, pure-derive): buổi `huy` ⇒ tổng EXP gắn buổi đó = 0; buổi không huỷ ⇒ = tổng dòng gốc.
--   Hiện thực bằng DÒNG BÙ TRỪ (append, bu_tru_buoi_huy = true, amount âm khi huỷ / dương khi mở lại),
--   KHÔNG xoá dòng gốc ⇒ còn nguyên vết "đã từng được cộng rồi bị thu hồi".
--   Vì sao không lọc buổi huỷ trong hàm đọc: có ≥6 chỗ cộng ledger (fn_gami_exp_xu_thang,
--   fn_gami_exp_chi_tiet_thang, fn_hs_vi_xu_cua_toi, view qlht_v_so_du_xu, _troly_cc_xep_hang, gami.ts…)
--   — sót 1 chỗ là lỗ lại; và fn_gami_exp_xu_thang thuộc owner `postgres`, migrate không thay được.
--   Dòng bù trừ cùng source/mon/note/tháng với dòng gốc ⇒ MỌI chỗ cộng tự đúng, không sửa hàm đọc nào.
--
--   Đồng bộ chạy ở 2 cửa: (1) trang_thai đổi sang/khỏi 'huy'; (2) có dòng EXP gốc MỚI ghi vào buổi đang
--   huỷ (vd đóng phase / game trên lớp sau khi huỷ) ⇒ bù trừ ngay. Hàm đồng bộ tính theo ĐÍCH − HIỆN
--   (idempotent, chạy lại bao nhiêu lần cũng vậy; fn_mo_lai_phase xoá dòng gốc + bù trừ cùng source vẫn đúng).
--
--   Xô tháng: dòng bù trừ phải rơi đúng tháng của dòng gốc (exp_* theo note, attend_floor theo created_at).
--   created_at của dòng bù trừ = now() nếu huỷ trong cùng tháng, còn huỷ sang tháng sau thì kẹp về
--   khoảnh khắc cuối tháng gốc (giờ VN) — thời điểm thật của việc huỷ nằm ở buoi_hoc.updated_at.
--   Tháng < 2026-09 KHÔNG đụng (CEO 09/10: tháng 8 đóng băng, dữ liệu dính tháng 8 bỏ qua) — cùng mốc
--   c_tu của _xu_dong_bo.
--
--   exp_btvn_thang (điều chỉnh BTVN cả THÁNG, chỉ "neo" vào buổi cuối) KHÔNG bù trừ theo buổi: huỷ buổi
--   thường ⇒ chạy lại fn_recompute_exp_thang của lớp×tháng để tính lại điều chỉnh không có buổi huỷ.
--   Vá recompute: trước đây dòng điều chỉnh neo vào buổi đã huỷ không bao giờ bị xoá ⇒ cộng ĐÔI với dòng
--   neo mới (đo 09/10: HS0407 tháng 9 có +15 neo 8B2.T2.14092026 [huy] cạnh −90 neo 8B2.T2.28092026).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá dòng nào lúc áp. fn_recompute_exp_thang (khi được gọi về sau) xoá thêm dòng exp_btvn_thang
--   neo vào buổi THƯỜNG đã huỷ của đúng lớp×tháng đó — là dòng điều chỉnh cũ, được ghi lại ngay trong
--   cùng transaction (cùng cơ chế xoá-ghi sẵn có của hàm). Không backfill: dữ liệu cũ chỉ đổi khi có
--   chuyển trạng thái huỷ/mở lại mới hoặc khi recompute lớp×tháng đó chạy lại.
-- ============================================================================

alter table public.gami_exp_ledger
  add column bu_tru_buoi_huy boolean not null default false;
comment on column public.gami_exp_ledger.bu_tru_buoi_huy is
  'true = dòng bù trừ do huỷ/mở lại buổi (mig 202610091934), ghi bởi _gami_exp_buoi_huy_dong_bo — không phải EXP gốc.';

-- ── Hàm đồng bộ: đưa tổng EXP gắn 1 buổi về đích (huỷ ⇒ 0, không huỷ ⇒ tổng dòng gốc) ─────────────
create or replace function public._gami_exp_buoi_huy_dong_bo(p_buoi uuid)
returns integer
language plpgsql
security definer   -- người huỷ buổi (OPS/TA) chưa chắc có quyền ghi ledger; bù trừ là sổ sách hệ thống, không được fail
set search_path = public
as $$
declare
  c_tu constant text := '2026-09';   -- = c_tu của _xu_dong_bo: tháng 8 đóng băng, không đụng
  v_huy boolean;
  v_n integer;
begin
  select b.trang_thai = 'huy' into v_huy from public.buoi_hoc b where b.id = p_buoi;
  if v_huy is null then return 0; end if;

  with g as (
    select l.hoc_sinh_id, l.source, l.mon, l.note,
           to_char(l.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') as thang,
           coalesce(sum(l.amount) filter (where not l.bu_tru_buoi_huy), 0) as goc,
           sum(l.amount) as hien
    from public.gami_exp_ledger l
    where l.ref_buoi_hoc_id = p_buoi
      and l.source <> 'exp_btvn_thang'   -- điều chỉnh cả tháng, do fn_recompute_exp_thang quản
    group by 1, 2, 3, 4, 5
  ), ghi as (
    insert into public.gami_exp_ledger (hoc_sinh_id, source, amount, ref_buoi_hoc_id, note, mon, created_at, bu_tru_buoi_huy)
    select g.hoc_sinh_id, g.source, (case when v_huy then 0 else g.goc end) - g.hien, p_buoi, g.note, g.mon,
           least(now(), (((g.thang || '-01')::date + interval '1 month')::timestamp at time zone 'Asia/Ho_Chi_Minh')
                        - interval '1 millisecond'),
           true
    from g
    where g.thang >= c_tu
      and (case when v_huy then 0 else g.goc end) <> g.hien
    returning 1
  )
  select count(*)::integer into v_n from ghi;
  return v_n;
end $$;
revoke execute on function public._gami_exp_buoi_huy_dong_bo(uuid) from public, anon, authenticated;

-- ── Cửa 1: buổi đổi sang/khỏi 'huy' ─────────────────────────────────────────────────────────────
create or replace function public._trg_buoi_hoc_huy_exp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public._gami_exp_buoi_huy_dong_bo(new.id);
  -- Buổi thường: điều chỉnh BTVN cả tháng + EXP ET/BTVN tính lại trên tập buổi không huỷ.
  if new.loai = 'thuong' and new.lop_id is not null and to_char(new.ngay, 'YYYY-MM') >= '2026-09' then
    perform public.fn_recompute_exp_thang(new.lop_id, to_char(new.ngay, 'YYYY-MM'));
  end if;
  return null;
end $$;
revoke execute on function public._trg_buoi_hoc_huy_exp() from public, anon, authenticated;

create trigger trg_buoi_hoc_huy_exp
  after update of trang_thai on public.buoi_hoc
  for each row
  when ((old.trang_thai = 'huy') is distinct from (new.trang_thai = 'huy'))
  execute function public._trg_buoi_hoc_huy_exp();

-- ── Cửa 2: dòng EXP gốc mới ghi vào buổi đang huỷ ⇒ bù trừ ngay ──────────────────────────────────
-- Statement-level: 1 lần dò cho cả lô (đóng phase ghi cả lớp 1 câu INSERT). Dòng bù trừ tự ghi
-- (bu_tru_buoi_huy = true) bị lọc ⇒ không đệ quy.
create or replace function public._trg_gami_exp_ledger_buoi_huy()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare r record;
begin
  for r in
    select distinct m.ref_buoi_hoc_id as id
    from moi m join public.buoi_hoc b on b.id = m.ref_buoi_hoc_id
    where not m.bu_tru_buoi_huy and b.trang_thai = 'huy'
  loop
    perform public._gami_exp_buoi_huy_dong_bo(r.id);
  end loop;
  return null;
end $$;
revoke execute on function public._trg_gami_exp_ledger_buoi_huy() from public, anon, authenticated;

create trigger trg_gami_exp_ledger_buoi_huy
  after insert on public.gami_exp_ledger
  referencing new table as moi
  for each statement
  execute function public._trg_gami_exp_ledger_buoi_huy();

-- ── Vá fn_recompute_exp_thang: xoá cả điều chỉnh tháng neo vào buổi đã huỷ (chống cộng đôi) ──────
-- Nguyên văn bản live (09/10), chỉ thêm 1 câu delete có đánh dấu "mig 202610091934".
create or replace function public.fn_recompute_exp_thang(p_lop_id uuid, p_ym text)
 returns jsonb
 language plpgsql
as $function$
declare
  v_mon text; v_tu date; v_den date; v_buoi_cuoi uuid;
  v_hs integer; v_tong numeric;
begin
  select mon into v_mon from lop where id = p_lop_id;
  v_mon := coalesce(v_mon, 'Toán');
  v_tu := (p_ym || '-01')::date;
  v_den := v_tu + interval '1 month';

  create temp table _ret_buoi on commit drop as
    select id, ngay from buoi_hoc
    where lop_id = p_lop_id and loai = 'thuong' and trang_thai <> 'huy' and ngay >= v_tu and ngay < v_den;
  select id into v_buoi_cuoi from _ret_buoi order by ngay desc limit 1;

  -- ET events (từ history đã có hạng)
  create temp table _ret_et on commit drop as
    select h.hoc_sinh_id, h.buoi_hoc_id, public.fn_exp_et_rank(h.rank, h.rank_total) as amount
    from gami_elo_history h join _ret_buoi b on b.id = h.buoi_hoc_id
    where h.phase = 'et' and h.rank is not null and h.rank_total is not null;

  -- BTVN per bài + độ đúng per (hs×buổi)
  create temp table _ret_btvn on commit drop as
    select k.hoc_sinh_id, k.buoi_hoc_id, k.trang_thai_nop, k.thai_do,
           public.fn_exp_btvn_bai(k.trang_thai_nop, k.thai_do) as amount,
           (case when coalesce(case k.trang_thai_nop when 'nop_dung_han' then 1.0 when 'nop_muon' then 0.9 else 0 end, 0) = 0
                 then 1 else 0 end) as miss
    from btvn_ket_qua k join _ret_buoi b on b.id = k.buoi_hoc_id;

  create temp table _ret_acc on commit drop as
    select g.hoc_sinh_id, sp.buoi_hoc_id, sum(g.points) / (count(*) * 100.0) as acc
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id and sp.phase = 'btvn'
    join _ret_buoi b on b.id = sp.buoi_hoc_id
    group by g.hoc_sinh_id, sp.buoi_hoc_id;

  -- tổng hợp per HS (studentAcc = TB acc các buổi; classMean = TB studentAcc của HS có acc)
  create temp table _ret_hs on commit drop as
    with hs_all as (
      select hoc_sinh_id from _ret_et union select hoc_sinh_id from _ret_btvn union select hoc_sinh_id from _ret_acc
    ), acc_hs as (select hoc_sinh_id, avg(acc) as student_acc from _ret_acc group by hoc_sinh_id),
    cm as (select avg(student_acc) as class_mean from acc_hs)
    select a.hoc_sinh_id,
           coalesce((select sum(amount) from _ret_btvn t where t.hoc_sinh_id = a.hoc_sinh_id), 0) as subtotal,
           coalesce((select sum(miss) from _ret_btvn t where t.hoc_sinh_id = a.hoc_sinh_id), 0) as miss_count,
           (select count(*) from _ret_btvn t where t.hoc_sinh_id = a.hoc_sinh_id) as so_bai,
           ah.student_acc, (select class_mean from cm) as class_mean
    from hs_all a left join acc_hs ah on ah.hoc_sinh_id = a.hoc_sinh_id;

  -- điều chỉnh tháng (đúng thứ tự + jsround như exp.js monthlyBtvnExp)
  create temp table _ret_adj on commit drop as
    select hoc_sinh_id, subtotal,
      (case when so_bai > 0 and miss_count = 0 then public.fn_jsround(subtotal * 0.05) else 0 end)
      + (case when student_acc is not null and class_mean is not null and student_acc - class_mean > 0.05
              then public.fn_jsround(subtotal * 0.05) else 0 end)
      + (case when student_acc is not null and class_mean is not null and student_acc - class_mean < -0.10
              then -public.fn_jsround(subtotal * 0.05) else 0 end)
      + (-public.fn_jsround(subtotal * 0.05 * miss_count)) as adj
    from _ret_hs;

  -- XOÁ ledger chi tiết cũ của (lớp×tháng) + dòng gộp legacy, rồi GHI MỚI — cùng transaction.
  delete from gami_exp_ledger where ref_buoi_hoc_id in (select id from _ret_buoi) and source <> 'exp_tren_lop'; -- mig 202609272048: EXP game trong buổi không thuộc recompute
  delete from gami_exp_ledger where source = 'exp_btvn_thang' and note = p_ym   -- mig 202610091934: điều chỉnh tháng neo vào buổi ĐÃ HUỶ (trước đây sống mãi ⇒ cộng đôi)
    and ref_buoi_hoc_id in (select id from buoi_hoc where lop_id = p_lop_id and loai = 'thuong' and trang_thai = 'huy'
                            and ngay >= v_tu and ngay < v_den);
  delete from gami_exp_ledger where source = 'exp_thang' and mon = v_mon and note = p_ym
    and hoc_sinh_id in (select hoc_sinh_id from _ret_hs);

  insert into gami_exp_ledger (hoc_sinh_id, source, amount, mon, note, ref_buoi_hoc_id)
  select hoc_sinh_id, 'exp_et', amount, v_mon, p_ym, buoi_hoc_id from _ret_et
  union all
  select hoc_sinh_id, 'exp_btvn', amount, v_mon, p_ym, buoi_hoc_id from _ret_btvn where amount > 0
  union all
  select a.hoc_sinh_id, 'exp_btvn_thang',
         greatest(0, a.subtotal + a.adj) - a.subtotal, v_mon, p_ym, v_buoi_cuoi
  from _ret_adj a where greatest(0, a.subtotal + a.adj) - a.subtotal <> 0 and v_buoi_cuoi is not null;

  select count(*), coalesce(sum(t), 0) into v_hs, v_tong from (
    select h.hoc_sinh_id,
           coalesce((select sum(amount) from _ret_et e where e.hoc_sinh_id = h.hoc_sinh_id), 0)
           + greatest(0, h.subtotal + a.adj) as t
    from _ret_hs h join _ret_adj a on a.hoc_sinh_id = h.hoc_sinh_id
  ) x where x.t > 0;
  drop table _ret_buoi, _ret_et, _ret_btvn, _ret_acc, _ret_hs, _ret_adj;
  return jsonb_build_object('hs', v_hs, 'tong', v_tong);
end $function$;
