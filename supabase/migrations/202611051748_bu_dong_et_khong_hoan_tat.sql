-- Ca bù biến mất khỏi màn chính TA sau khi bấm "Xác nhận ET" (Thùy 05/11, Hoàng An 3A1).
-- GỐC: fn_dong_phase đặt MỌI buổi không-"thường" thành trang_thai='hoan_tat' ngay khi đóng 1 phase. Buổi bù có 2 mốc (ET + đánh giá); ô "Bổ trợ bù" của TA
-- (fn_bu_ca_cua_toi) chỉ lấy trang_thai='mo' ⇒ đóng ET (kể cả bấm nhầm) là ca biến mất, TA không còn lối vào để đánh giá / mở lại ET.
-- Trạng thái bù vốn lộn xộn theo THỨ TỰ đóng: đóng đánh giá RỒI ET ⇒ hoan_tat; ET RỒI đánh giá ⇒ recompute (gami.ts) kéo về 'mo' (đo 05/11: 142 buổi bù đã đủ ET+đánh giá vẫn 'mo', 23 'hoan_tat').
-- SỬA: loai='bu' đóng phase KHÔNG đổi trang_thai (ô TA/danh sách bù đọc cờ et_dong_at / danh_gia_xong_at). Các loại khác giữ nguyên.
CREATE OR REPLACE FUNCTION public.fn_dong_phase(p_buoi_id uuid, p_phase text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  b record; v_mon text; v_claimed integer; v_co_rank boolean; v_co_elo boolean;
  v_grades bigint; v_n integer; v_reveal jsonb; v_probs integer; v_thieu integer; v_online_et boolean;
begin
  if p_phase not in ('ingame', 'et', 'mt') then raise exception 'phase không hợp lệ: %', p_phase; end if;
  select * into b from buoi_hoc where id = p_buoi_id;
  if b is null then raise exception 'Không thấy buổi %', p_buoi_id; end if;

  if p_phase = 'et' and b.loai = 'thuong' then
    perform 1 from buoi_hoc bh where bh.lop_id = b.lop_id and bh.loai = 'thuong' and bh.trang_thai <> 'huy'
      and bh.ngay < b.ngay and bh.et_dong_at is null
      and not exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = bh.lop_id and tl.ngay = bh.ngay)
      limit 1;
    if found then raise exception 'Chưa đóng ET buổi trước đó — phải đóng theo đúng thứ tự ngày (Elo tính tuần tự).'; end if;
  end if;

  select count(*) into v_n from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi_id and r.diem_danh = 'co_mat';
  select count(*) into v_probs from gami_session_problems sp where sp.buoi_hoc_id = p_buoi_id and sp.phase = p_phase;
  v_online_et := p_phase = 'et' and exists (
    select 1 from bai_test bt where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'et');
  if p_phase in ('et', 'mt') and b.loai in ('thuong', 'mt') and v_n > 0 and v_probs > 0 and not v_online_et then
    select count(*) into v_grades from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id
      where sp.buoi_hoc_id = p_buoi_id and sp.phase = p_phase;
    if v_grades = 0 then
      raise exception 'Chưa chấm ô nào — chấm rồi mới xác nhận được (chặn đóng thiếu dữ liệu).';
    end if;
    select count(*) into v_thieu
    from buoi_hoc_hs r
    cross join gami_session_problems sp
    where r.buoi_hoc_id = p_buoi_id and r.diem_danh = 'co_mat'
      and sp.buoi_hoc_id = p_buoi_id and sp.phase = p_phase
      and not exists (select 1 from gami_grades g where g.problem_id = sp.id and g.hoc_sinh_id = r.hoc_sinh_id);
    if v_thieu > 0 then
      raise exception 'Còn % ô chưa chấm — chấm đủ mọi HS có mặt × mọi câu rồi mới xác nhận.', v_thieu;
    end if;
  end if;

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
  v_co_elo := v_co_rank and p_phase = 'et';

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
    if b.loai = 'bu' then null; -- 05/11: buổi BÙ không "hoàn tất" chỉ vì đóng ET (hoàn tất bù = ET + đánh giá, ô TA đọc cờ) — xem mig bu_dong_et_khong_hoan_tat
    elsif b.loai <> 'thuong' then update buoi_hoc set trang_thai = 'hoan_tat', updated_at = now() where id = p_buoi_id;
    else perform public.fn_buoi_recompute_hoan_tat(p_buoi_id); end if;
    drop table _dp_raw;
    return jsonb_build_object('reveal', '[]'::jsonb, 'khongCoDuLieu', (v_n > 0));
  end if;

  if v_co_rank then
    if v_co_elo then
      insert into gami_elo (hoc_sinh_id, mon)
      select r.hoc_sinh_id, v_mon from _dp_raw r
      where not exists (select 1 from gami_elo e where e.hoc_sinh_id = r.hoc_sinh_id and e.mon = v_mon);

      create temp table _dp_st on commit drop as
        select r.hoc_sinh_id, r.points,
               e.elo - coalesce((select sum(h.delta) from gami_elo_history h
                                 where h.buoi_hoc_id = p_buoi_id and h.hoc_sinh_id = r.hoc_sinh_id), 0) as elo_pre
        from _dp_raw r join gami_elo e on e.hoc_sinh_id = r.hoc_sinh_id and e.mon = v_mon;

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

      insert into gami_elo_history (hoc_sinh_id, buoi_hoc_id, phase, mon, elo_before, expected, actual, delta, elo_after, rank, rank_total)
      select e.hoc_sinh_id, p_buoi_id, p_phase, v_mon, e.elo_pre, e.expected, e.actual, e.delta, e.elo_pre + e.delta,
             row_number() over (order by e.points desc, e.delta desc, e.hoc_sinh_id), v_n
      from _dp_elo e;
      update gami_elo ge set elo = ge.elo + e.delta, updated_at = now()
      from _dp_elo e where ge.hoc_sinh_id = e.hoc_sinh_id and ge.mon = v_mon;

      select jsonb_agg(jsonb_build_object(
               'hoc_sinh_id', h.hoc_sinh_id, 'rawPoints', e.points, 'rank', h.rank,
               'exp', public.fn_exp_et_rank(h.rank, v_n),
               'eloBefore', h.elo_before, 'eloAfter', h.elo_after, 'delta', h.delta) order by h.rank)
        into v_reveal
      from gami_elo_history h join _dp_elo e on e.hoc_sinh_id = h.hoc_sinh_id
      where h.buoi_hoc_id = p_buoi_id and h.phase = p_phase;
      drop table _dp_st, _dp_elo;
    else
      select jsonb_agg(jsonb_build_object(
               'hoc_sinh_id', r.hoc_sinh_id, 'rawPoints', r.points, 'rank', r.rk, 'exp', 0)
             order by r.rk)
        into v_reveal
      from (select hoc_sinh_id, points,
                   row_number() over (order by points desc, hoc_sinh_id) as rk
            from _dp_raw) r;
    end if;
  else
    insert into gami_exp_ledger (hoc_sinh_id, source, amount, ref_buoi_hoc_id, mon)
    select hoc_sinh_id, 'attend_floor', 250, p_buoi_id, v_mon from _dp_raw;
    select jsonb_agg(jsonb_build_object('hoc_sinh_id', hoc_sinh_id, 'rawPoints', points, 'rank', 0, 'exp', 250))
      into v_reveal from _dp_raw;
  end if;

  if b.loai = 'bu' then null; -- 05/11: buổi BÙ không "hoàn tất" chỉ vì đóng ET (hoàn tất bù = ET + đánh giá, ô TA đọc cờ) — xem mig bu_dong_et_khong_hoan_tat
    elsif b.loai <> 'thuong' then update buoi_hoc set trang_thai = 'hoan_tat', updated_at = now() where id = p_buoi_id;
  else perform public.fn_buoi_recompute_hoan_tat(p_buoi_id); end if;

  if p_phase = 'et' and b.loai = 'thuong' and b.lop_id is not null then
    perform public.fn_recompute_exp_thang(b.lop_id, to_char(b.ngay, 'YYYY-MM'));
  end if;
  drop table _dp_raw;
  return jsonb_build_object('reveal', coalesce(v_reveal, '[]'::jsonb));
end $function$;
