-- ============================================================================
-- 202608300240 — Phase 1 (đợt 4/5) §2.0: ENGINE ELO + EXP THÁNG → RPC transactional
-- ----------------------------------------------------------------------------
-- VÌ SAO: audit 30/08 — closePhase/recomputeExpThang/reopenPhase (gami.ts) tính Elo/EXP
--   ở client rồi ghi N lệnh RỜI (insert history, update elo từng dòng, delete+insert
--   ledger) — đứt mạng giữa chừng là Elo lệch vĩnh viễn / ledger tháng rỗng. Giờ toàn bộ
--   thành 3 RPC chạy TRONG MỘT TRANSACTION: fn_dong_phase · fn_mo_lai_phase ·
--   fn_recompute_exp_thang (+ fn_dong_btvn, fn_buoi_recompute_hoan_tat).
--
-- CÔNG THỨC (nguyên văn src/gami/elo.js + exp.js + config.js — CEO chốt 07-28/07-29):
--   Elo: E_i = Σ 1/(1+10^((Rj−Ri)/400)) · A_i = #(thắng)+0.5#(hoà)
--        Δ = jsround( clamp(30·(A−E)/(N−1), ±20) + 10 )   [λ=0 đã TẮT 07-29 · P=10 · ET-only]
--   ⚠ jsround(x) = floor(x+0.5) — Math.round của JS làm tròn −0.5 → 0, KHÁC round() SQL
--     (làm tròn xa 0). Phải dùng floor(x+0.5) để parity tuyệt đối với lịch sử đã ghi.
--   EXP ET theo hạng: bands {300,285,270,250,225,200} chia 6 bậc tách đỉnh gộp đáy.
--   EXP BTVN: 300 × timing(đúng hạn 1 · muộn 0.9 · xin phép/không làm 0) × thái độ
--     (nghiêm túc 1 · chưa hết sức 0.9 · chưa nghiêm túc 0.7 · chống đối 0).
--   Điều chỉnh tháng: +5% đủ tháng · ±5% so TB lớp (biên +5%/−10%) · −5%×số bài miss · sàn 0.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất dữ liệu lịch sử. fn_recompute_exp_thang xoá + ghi lại
--   ledger CHI TIẾT của đúng (lớp×tháng) — y hệt hành vi recomputeExpThang cũ, nhưng giờ
--   nguyên tử (transaction) thay vì delete rồi insert rời nhau.
-- ============================================================================

-- jsround: Math.round của JS (half-up cả số âm)
create or replace function public.fn_jsround(x numeric) returns integer
language sql immutable as $$ select floor(x + 0.5)::integer $$;

-- Hạng (1..N) → EXP theo bands 6 bậc (exp.js expForRank): N≤6 dùng thẳng; N>6: 1,2 riêng, 3..N rải 4 bậc cuối.
create or replace function public.fn_exp_for_rank(p_rank integer, p_n integer, p_bands numeric[])
returns numeric language sql immutable as $$
  select case
    when p_n <= 6 then p_bands[p_rank]
    when p_rank = 1 then p_bands[1]
    when p_rank = 2 then p_bands[2]
    else p_bands[least(6, 3 + ((p_rank - 3) * 4 / (p_n - 2)))]
  end
$$;

create or replace function public.fn_exp_et_rank(p_rank integer, p_n integer)
returns numeric language sql immutable as $$
  select public.fn_exp_for_rank(p_rank, p_n, array[300,285,270,250,225,200]::numeric[])
$$;

-- EXP 1 bài BTVN = 300 × timing × thái độ (0 khi không làm/xin phép/trạng thái lạ — exp.js btvnBaiExp).
create or replace function public.fn_exp_btvn_bai(p_trang_thai text, p_thai_do text)
returns numeric language sql immutable as $$
  select case
    when coalesce(case p_trang_thai when 'nop_dung_han' then 1.0 when 'nop_muon' then 0.9 else 0 end, 0) = 0 then 0
    else public.fn_jsround(300
      * case p_trang_thai when 'nop_dung_han' then 1.0 when 'nop_muon' then 0.9 else 0 end
      * coalesce(case p_thai_do when 'nghiem_tuc' then 1.0 when 'chua_het_suc' then 0.9
                                when 'chua_nghiem_tuc' then 0.7 when 'chong_doi' then 0 end, 1.0))
  end
$$;

-- Buổi THƯỜNG "hoàn tất" = ingame + ET + đánh giá + BTVN đóng (+ MT nếu buổi có gán) — gami.ts recomputeHoanTat.
create or replace function public.fn_buoi_recompute_hoan_tat(p_buoi_id uuid) returns void
language plpgsql as $$
declare b record; v_has_mt boolean; v_next text;
begin
  select trang_thai, ingame_dong_at, et_dong_at, danh_gia_xong_at, btvn_dong_at, mt_dong_at
    into b from buoi_hoc where id = p_buoi_id;
  if b is null or b.trang_thai = 'huy' then return; end if;
  select exists(select 1 from gami_session_problems where buoi_hoc_id = p_buoi_id and phase = 'mt') into v_has_mt;
  v_next := case when b.ingame_dong_at is not null and b.et_dong_at is not null
                  and b.danh_gia_xong_at is not null and b.btvn_dong_at is not null
                  and (not v_has_mt or b.mt_dong_at is not null)
             then 'hoan_tat' else 'mo' end;
  if b.trang_thai <> v_next then
    update buoi_hoc set trang_thai = v_next, updated_at = now() where id = p_buoi_id;
  end if;
end $$;

-- ── EXP THÁNG cho 1 lớp (idempotent, nguyên tử) — gami.ts recomputeExpThang ──
create or replace function public.fn_recompute_exp_thang(p_lop_id uuid, p_ym text)
returns jsonb language plpgsql as $$
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
  delete from gami_exp_ledger where ref_buoi_hoc_id in (select id from _ret_buoi);
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
end $$;
grant execute on function public.fn_recompute_exp_thang(uuid, text) to authenticated;

-- ── ĐÓNG PHASE (ingame/et/mt): claim + Elo (ET) + hạng + reveal — 1 transaction ──
create or replace function public.fn_dong_phase(p_buoi_id uuid, p_phase text)
returns jsonb language plpgsql as $$
declare
  b record; v_mon text; v_claimed integer; v_co_rank boolean; v_co_elo boolean;
  v_has_mt boolean; v_grades bigint; v_n integer; v_reveal jsonb;
begin
  if p_phase not in ('ingame', 'et', 'mt') then raise exception 'phase không hợp lệ: %', p_phase; end if;
  select * into b from buoi_hoc where id = p_buoi_id;
  if b is null then raise exception 'Không thấy buổi %', p_buoi_id; end if;

  -- KHÓA THỨ TỰ ET (Elo tuần tự theo ngày — gami.ts 07-29)
  if p_phase = 'et' and b.loai = 'thuong' then
    perform 1 from buoi_hoc where lop_id = b.lop_id and loai = 'thuong' and trang_thai <> 'huy'
      and ngay < b.ngay and et_dong_at is null limit 1;
    if found then raise exception 'Chưa đóng ET buổi trước đó — phải đóng theo đúng thứ tự ngày (Elo tính tuần tự).'; end if;
  end if;

  -- CLAIM nguyên tử cờ đóng
  if p_phase = 'et' then
    update buoi_hoc set et_dong_at = now(), updated_at = now() where id = p_buoi_id and et_dong_at is null;
  elsif p_phase = 'mt' then
    update buoi_hoc set mt_dong_at = now(), updated_at = now() where id = p_buoi_id and mt_dong_at is null;
  else
    update buoi_hoc set ingame_dong_at = now(), updated_at = now() where id = p_buoi_id and ingame_dong_at is null;
  end if;
  get diagnostics v_claimed = row_count;
  if v_claimed = 0 then return jsonb_build_object('already', true); end if;

  select mon into v_mon from lop where id = b.lop_id;
  v_mon := coalesce(v_mon, 'Toán');
  v_co_rank := b.loai in ('thuong', 'mt');
  v_co_elo := v_co_rank and p_phase = 'et';   -- Elo tạm CHỈ ET (MT chờ điểm thang 10 — gami.ts)

  -- HS có mặt + điểm thô của phase
  create temp table _dp_raw on commit drop as
    select r.hoc_sinh_id, coalesce(sum(g.points), 0)::numeric as points
    from buoi_hoc_hs r
    left join gami_session_problems sp on sp.buoi_hoc_id = p_buoi_id and sp.phase = p_phase
    left join gami_grades g on g.problem_id = sp.id and g.hoc_sinh_id = r.hoc_sinh_id
    where r.buoi_hoc_id = p_buoi_id and r.diem_danh = 'co_mat'
    group by r.hoc_sinh_id;
  select count(*) into v_n from _dp_raw;
  select count(*) into v_grades from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    where sp.buoi_hoc_id = p_buoi_id and sp.phase = p_phase;

  if v_n = 0 or (v_co_elo and v_grades = 0) then
    -- vận hành vẫn đóng, KHÔNG sinh phép đo (bug 07-21: 0 dữ liệu ≠ cả lớp hoà)
    if b.loai <> 'thuong' then update buoi_hoc set trang_thai = 'hoan_tat', updated_at = now() where id = p_buoi_id;
    else perform public.fn_buoi_recompute_hoan_tat(p_buoi_id); end if;
    drop table _dp_raw;
    return jsonb_build_object('reveal', '[]'::jsonb, 'khongCoDuLieu', (v_n > 0));
  end if;

  if v_co_rank then
    if v_co_elo then
      -- đảm bảo dòng elo (mặc định 1000)
      insert into gami_elo (hoc_sinh_id, mon)
      select r.hoc_sinh_id, v_mon from _dp_raw r
      where not exists (select 1 from gami_elo e where e.hoc_sinh_id = r.hoc_sinh_id and e.mon = v_mon);

      -- pre-elo = elo hiện tại − delta phase KHÁC của CHÍNH buổi này (model cộng dồn)
      create temp table _dp_st on commit drop as
        select r.hoc_sinh_id, r.points,
               e.elo - coalesce((select sum(h.delta) from gami_elo_history h
                                 where h.buoi_hoc_id = p_buoi_id and h.hoc_sinh_id = r.hoc_sinh_id), 0) as elo_pre
        from _dp_raw r join gami_elo e on e.hoc_sinh_id = r.hoc_sinh_id and e.mon = v_mon;

      -- expected/actual pairwise + delta (K=30 · cap 20 · P=10 · λ=0 · jsround)
      create temp table _dp_elo on commit drop as
        with pair as (
          select s.hoc_sinh_id,
                 sum(1.0 / (1.0 + power(10::numeric, (o.elo_pre - s.elo_pre) / 400.0))) as expected,
                 sum(case when s.points > o.points then 1.0 when s.points = o.points then 0.5 else 0 end) as actual
          from _dp_st s join _dp_st o on o.hoc_sinh_id <> s.hoc_sinh_id
          group by s.hoc_sinh_id
        )
        select s.hoc_sinh_id, s.elo_pre, s.points, p.expected, p.actual,
               public.fn_jsround(
                 greatest(-20::numeric, least(20::numeric, 30.0 * (p.actual - p.expected) / greatest(1, v_n - 1)))
                 + 10) as delta
        from _dp_st s join pair p on p.hoc_sinh_id = s.hoc_sinh_id;

      -- hạng: điểm thô giảm dần, hoà thì Δ elo lớn xếp trên; ghi history + cộng dồn elo
      insert into gami_elo_history (hoc_sinh_id, buoi_hoc_id, phase, mon, elo_before, expected, actual, delta, elo_after, rank, rank_total)
      select e.hoc_sinh_id, p_buoi_id, p_phase, v_mon, e.elo_pre, e.expected, e.actual, e.delta, e.elo_pre + e.delta,
             row_number() over (order by e.points desc, e.delta desc), v_n
      from _dp_elo e;
      update gami_elo ge set elo = ge.elo + e.delta, updated_at = now()
      from _dp_elo e where ge.hoc_sinh_id = e.hoc_sinh_id and ge.mon = v_mon;

      select jsonb_agg(jsonb_build_object(
               'hoc_sinh_id', e.hoc_sinh_id, 'rawPoints', e.points, 'rank', rk.rank,
               'exp', public.fn_exp_et_rank(rk.rank::int, v_n),
               'eloBefore', e.elo_pre, 'eloAfter', e.elo_pre + e.delta, 'delta', e.delta) order by rk.rank)
        into v_reveal
      from _dp_elo e join lateral (
        select row_number() over (order by x.points desc, x.delta desc) as rank, x.hoc_sinh_id
        from _dp_elo x) rk on rk.hoc_sinh_id = e.hoc_sinh_id;
      drop table _dp_st, _dp_elo;
    else
      -- phase xếp hạng KHÔNG Elo (ingame/mt): chỉ reveal hạng, exp hiển thị = 0
      select jsonb_agg(jsonb_build_object(
               'hoc_sinh_id', r.hoc_sinh_id, 'rawPoints', r.points,
               'rank', row_number() over (order by r.points desc), 'exp', 0) order by r.points desc)
        into v_reveal
      from _dp_raw r;
    end if;
  else
    -- bù / bổ trợ: EXP sàn 250 per HS có mặt (attend_floor, per-buổi)
    insert into gami_exp_ledger (hoc_sinh_id, source, amount, ref_buoi_hoc_id, mon)
    select hoc_sinh_id, 'attend_floor', 250, p_buoi_id, v_mon from _dp_raw;
    select jsonb_agg(jsonb_build_object('hoc_sinh_id', hoc_sinh_id, 'rawPoints', points, 'rank', 0, 'exp', 250))
      into v_reveal from _dp_raw;
  end if;

  if b.loai <> 'thuong' then update buoi_hoc set trang_thai = 'hoan_tat', updated_at = now() where id = p_buoi_id;
  else perform public.fn_buoi_recompute_hoan_tat(p_buoi_id); end if;

  if p_phase = 'et' and b.loai = 'thuong' and b.lop_id is not null then
    perform public.fn_recompute_exp_thang(b.lop_id, to_char(b.ngay, 'YYYY-MM'));
  end if;
  drop table _dp_raw;
  return jsonb_build_object('reveal', coalesce(v_reveal, '[]'::jsonb));
end $$;
grant execute on function public.fn_dong_phase(uuid, text) to authenticated;

-- ── MỞ LẠI PHASE: trừ delta cộng dồn, xoá history + exp của phase, về 'mo' — 1 transaction ──
create or replace function public.fn_mo_lai_phase(p_buoi_id uuid, p_phase text)
returns void language plpgsql as $$
declare b record;
begin
  if p_phase not in ('ingame', 'et', 'mt') then raise exception 'phase không hợp lệ: %', p_phase; end if;
  update gami_elo ge
    set elo = ge.elo - h.d,
        sessions_played = greatest(0, ge.sessions_played - case when p_phase <> 'et' then 1 else 0 end),
        updated_at = now()
  from (select hoc_sinh_id, coalesce(mon, 'Toán') as mon, sum(delta) as d
        from gami_elo_history where buoi_hoc_id = p_buoi_id and phase = p_phase
        group by hoc_sinh_id, coalesce(mon, 'Toán')) h
  where ge.hoc_sinh_id = h.hoc_sinh_id and ge.mon = h.mon;
  delete from gami_elo_history where buoi_hoc_id = p_buoi_id and phase = p_phase;
  delete from gami_exp_ledger where ref_buoi_hoc_id = p_buoi_id
    and source in ('rank_' || p_phase, 'exp_' || p_phase, 'attend_floor');
  if p_phase = 'et' then
    update buoi_hoc set et_dong_at = null, trang_thai = 'mo', updated_at = now() where id = p_buoi_id;
  elsif p_phase = 'mt' then
    update buoi_hoc set mt_dong_at = null, trang_thai = 'mo', updated_at = now() where id = p_buoi_id;
  else
    update buoi_hoc set ingame_dong_at = null, trang_thai = 'mo', updated_at = now() where id = p_buoi_id;
  end if;
  select lop_id, ngay, loai into b from buoi_hoc where id = p_buoi_id;
  if p_phase = 'et' and b.loai = 'thuong' and b.lop_id is not null then
    perform public.fn_recompute_exp_thang(b.lop_id, to_char(b.ngay, 'YYYY-MM'));
  end if;
end $$;
grant execute on function public.fn_mo_lai_phase(uuid, text) to authenticated;

-- ── ĐÓNG BTVN: claim + recompute EXP tháng + hoàn tất — 1 transaction ──
create or replace function public.fn_dong_btvn(p_buoi_id uuid)
returns jsonb language plpgsql as $$
declare b record; v_claimed integer; v_ret jsonb;
begin
  select lop_id, ngay into b from buoi_hoc where id = p_buoi_id;
  update buoi_hoc set btvn_dong_at = now(), updated_at = now() where id = p_buoi_id and btvn_dong_at is null;
  get diagnostics v_claimed = row_count;
  if v_claimed = 0 then return jsonb_build_object('already', true, 'thuong', 0); end if;
  v_ret := public.fn_recompute_exp_thang(b.lop_id, to_char(b.ngay, 'YYYY-MM'));
  perform public.fn_buoi_recompute_hoan_tat(p_buoi_id);
  return jsonb_build_object('thuong', v_ret->'hs');
end $$;
grant execute on function public.fn_dong_btvn(uuid) to authenticated;
