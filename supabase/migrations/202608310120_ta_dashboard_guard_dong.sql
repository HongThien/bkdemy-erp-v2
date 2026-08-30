-- ============================================================================
-- 202608310120 — DASHBOARD CÔNG VIỆC TA THÁNG + GUARD "KHÔNG ĐỦ DỮ LIỆU KHÔNG ĐÓNG"
-- (CEO chốt 30/08 đêm: ① bar = việc ĐẠT CHUẨN/tổng — chậm = không đạt, chất lượng
--  không đạt = không đạt · ② thiếu dữ liệu thì CHẶN đóng; đóng→mở lại→đóng lại tính
--  LẦN CUỐI (cột *_dong_at vốn đã là lần cuối — reopen set null) · ③ xếp hạng: TA
--  thấy mình + top 3, ngưỡng ≥10 việc · ④ 100% = thưởng tiền)
-- ----------------------------------------------------------------------------
-- NGƯỠNG CHỈNH ĐƯỢC (trong fn_ta_dashboard): chất lượng đạt ≥ 80 · vào bảng xếp hạng
-- khi ≥ 10 việc đã đến hạn. Đạt chuẩn = (đã duyệt: tien_do=100 AND chat_luong≥80) hoặc
-- (chưa duyệt: đóng ≤ hạn — chất lượng mặc định coi như đạt, cùng rule "duyệt mặc định 100").
-- MẤT GÌ (Luật xoá): không mất data — replace 2 fn đóng (thêm guard) + 1 fn mới.
-- ============================================================================

-- ── GUARD fn_dong_phase v4 (nền = bản fix rank 202608302250, thêm khối GUARD ĐỦ DỮ LIỆU) ──
create or replace function public.fn_dong_phase(p_buoi_id uuid, p_phase text)
returns jsonb language plpgsql as $$
declare
  b record; v_mon text; v_claimed integer; v_co_rank boolean; v_co_elo boolean;
  v_grades bigint; v_n integer; v_reveal jsonb; v_probs integer; v_thieu integer; v_online_et boolean;
begin
  if p_phase not in ('ingame', 'et', 'mt') then raise exception 'phase không hợp lệ: %', p_phase; end if;
  select * into b from buoi_hoc where id = p_buoi_id;
  if b is null then raise exception 'Không thấy buổi %', p_buoi_id; end if;

  if p_phase = 'et' and b.loai = 'thuong' then
    perform 1 from buoi_hoc where lop_id = b.lop_id and loai = 'thuong' and trang_thai <> 'huy'
      and ngay < b.ngay and et_dong_at is null limit 1;
    if found then raise exception 'Chưa đóng ET buổi trước đó — phải đóng theo đúng thứ tự ngày (Elo tính tuần tự).'; end if;
  end if;

  -- ⛔ GUARD ĐỦ DỮ LIỆU (CEO 30/08): có HS + có đề mà chấm thiếu → KHÔNG cho đóng.
  -- Miễn: buổi không đề (v_probs=0 — vẫn đóng để khỏi treo task) · ET đã phát hành ONLINE
  -- (máy chấm, không có lưới tay) · buổi bù/bổ trợ (v_co_rank=false, chỉ điểm danh + EXP sàn).
  select count(*) into v_n from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi_id and r.diem_danh = 'co_mat';
  select count(*) into v_probs from gami_session_problems sp where sp.buoi_hoc_id = p_buoi_id and sp.phase = p_phase;
  v_online_et := p_phase = 'et' and exists (
    select 1 from bai_test bt where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'et');
  if b.loai in ('thuong', 'mt') and v_n > 0 and v_probs > 0 and not v_online_et then
    select count(*) into v_grades from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id
      where sp.buoi_hoc_id = p_buoi_id and sp.phase = p_phase;
    if v_grades = 0 then
      raise exception 'Chưa chấm ô nào — chấm rồi mới xác nhận được (chặn đóng thiếu dữ liệu).';
    end if;
    if p_phase in ('et', 'mt') then
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
    if b.loai <> 'thuong' then update buoi_hoc set trang_thai = 'hoan_tat', updated_at = now() where id = p_buoi_id;
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

  if b.loai <> 'thuong' then update buoi_hoc set trang_thai = 'hoan_tat', updated_at = now() where id = p_buoi_id;
  else perform public.fn_buoi_recompute_hoan_tat(p_buoi_id); end if;

  if p_phase = 'et' and b.loai = 'thuong' and b.lop_id is not null then
    perform public.fn_recompute_exp_thang(b.lop_id, to_char(b.ngay, 'YYYY-MM'));
  end if;
  drop table _dp_raw;
  return jsonb_build_object('reveal', coalesce(v_reveal, '[]'::jsonb));
end $$;
grant execute on function public.fn_dong_phase(uuid, text) to authenticated;

-- ── GUARD fn_dong_btvn v3: buổi có nghĩa vụ BTVN → mọi HS có mặt phải có trạng thái nộp ──
create or replace function public.fn_dong_btvn(p_buoi_id uuid)
returns jsonb language plpgsql as $$
declare b record; v_claimed integer; v_ret jsonb; v_tra integer; v_thieu integer;
begin
  select lop_id, ngay into b from buoi_hoc where id = p_buoi_id;
  if exists (select 1 from tai_lieu t where t.lop_id = b.lop_id and t.ngay = b.ngay and t.loai = 'btvn')
     or exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = p_buoi_id and sp.phase = 'btvn')
     or exists (select 1 from btvn_nop n where n.buoi_hoc_id = p_buoi_id) then
    select count(*) into v_thieu
    from buoi_hoc_hs r
    where r.buoi_hoc_id = p_buoi_id and r.diem_danh = 'co_mat'
      and not exists (select 1 from btvn_ket_qua k
                      where k.hoc_sinh_id = r.hoc_sinh_id and k.buoi_hoc_id = p_buoi_id
                        and k.trang_thai_nop is not null);
    if v_thieu > 0 then
      raise exception 'Còn % HS chưa tick trạng thái nộp — tick đủ rồi mới đóng BTVN (chặn đóng thiếu dữ liệu).', v_thieu;
    end if;
  end if;
  update buoi_hoc set btvn_dong_at = now(), updated_at = now() where id = p_buoi_id and btvn_dong_at is null;
  get diagnostics v_claimed = row_count;
  if v_claimed = 0 then return jsonb_build_object('already', true, 'thuong', 0); end if;
  v_ret := public.fn_recompute_exp_thang(b.lop_id, to_char(b.ngay, 'YYYY-MM'));
  perform public.fn_buoi_recompute_hoan_tat(p_buoi_id);
  v_tra := public.fn_btvn_tra_bai_buoi(p_buoi_id);
  return jsonb_build_object('thuong', v_ret->'hs', 'tra', v_tra);
end $$;
grant execute on function public.fn_dong_btvn(uuid) to authenticated;

-- ── DASHBOARD TA THÁNG (§2.0 — mọi đếm/xếp hạng ở Postgres, app chỉ gọi) ──
-- Việc = 3 khâu (ingame/et/btvn) × buổi THƯỜNG của lớp phân công tg trong tháng.
-- ET đã phát hành online → loại khỏi mẫu số (task thành duyệt-báo-sai, không gắn buổi).
-- kq: dat · khong_dat (đóng muộn / duyệt trễ / chất lượng < 80 / nợ quá hạn) · cho (chưa tới hạn).
-- (volatile vì dùng temp table — Postgres cấm CREATE trong fn stable)
create or replace function public.fn_ta_dashboard(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date; v_now timestamptz := now();
  c_nguong_cl constant numeric := 80;  -- chất lượng đạt ≥ 80 (CHỈNH Ở ĐÂY)
  c_nguong_rank constant integer := 10; -- ≥10 việc đến hạn mới vào bảng xếp hạng (CEO chốt)
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong_ta integer; v_ds jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month')::date;

  create temp table _ta_viec on commit drop as
  with viec as (
    select distinct pc.nhan_su_id, b.id as buoi_id, l.ten_lop, b.ngay, t.tab,
      case t.tab when 'ingame' then b.ingame_dong_at when 'et' then b.et_dong_at else b.btvn_dong_at end as dong_at,
      case t.tab
        when 'ingame' then ((b.ngay + 1)::text || ' 00:00')::timestamp at time zone 'Asia/Ho_Chi_Minh'
        when 'et' then public.han_nop_bai_test(b.lop_id, b.ngay, 'et')
        else coalesce(public.han_nop_bai_test(b.lop_id, b.ngay, 'btvn'),
                      ((b.ngay + 3)::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh')
      end as han
    from buoi_hoc b
    join lop l on l.id = b.lop_id
    join phan_cong_lop pc on pc.lop_id = b.lop_id and pc.vai_tro = 'tg'
    cross join (values ('ingame'), ('et'), ('btvn')) as t(tab)
    where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay >= v_tu and b.ngay < v_den
      and not (t.tab = 'et' and exists (
        select 1 from bai_test bt where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'et'))
  )
  select v.nhan_su_id, v.buoi_id, v.ten_lop, v.ngay, v.tab, v.dong_at, v.han,
    case
      when d.id is not null then case when d.tien_do >= 100 and d.chat_luong >= c_nguong_cl then 'dat' else 'khong_dat' end
      when v.dong_at is not null then case when v.dong_at <= v.han then 'dat' else 'khong_dat' end
      when v.han < v_now then 'khong_dat'   -- nợ quá hạn: đóng sau cũng đã muộn
      else 'cho'
    end as kq,
    case
      when d.id is not null and (d.tien_do < 100 or d.chat_luong < c_nguong_cl) then
        case when d.chat_luong < c_nguong_cl then 'chat_luong' else 'tre' end
      when v.dong_at is not null and v.dong_at > v.han then 'tre'
      when v.dong_at is null and v.han < v_now then 'no_qua_han'
      else null
    end as ly_do
  from viec v
  left join viec_van_hanh_duyet d
    on d.buoi_hoc_id = v.buoi_id and d.tab = v.tab and d.nhan_su_id = v.nhan_su_id;

  create temp table _ta_tk on commit drop as
  select w.nhan_su_id, ns.ho_ten,
    count(*) as tong,
    count(*) filter (where kq = 'cho') as cho,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    count(*) filter (where kq = 'khong_dat') as khong_dat,
    case when count(*) filter (where kq <> 'cho') = 0 then null
         else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end as pct
  from _ta_viec w join nhan_su ns on ns.id = w.nhan_su_id
  group by w.nhan_su_id, ns.ho_ten;

  select to_jsonb(x) into v_me_row from (
    select tong, cho, den_han, dat, khong_dat, pct,
           (pct = 100 and den_han >= c_nguong_rank) as dat_moc_thuong,
           (den_han >= c_nguong_rank) as du_dieu_kien_xep_hang
    from _ta_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong_ta from _ta_tk where den_han >= c_nguong_rank;
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _ta_tk where den_han >= c_nguong_rank) r
  where r.nhan_su_id = v_me;

  -- Top 3 công khai (chốt ③: TA thấy MÌNH + top 3, không thấy full bảng)
  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select ho_ten, pct, dat, den_han from _ta_tk where den_han >= c_nguong_rank
        order by pct desc, dat desc, ho_ten limit 3) t;

  select coalesce(jsonb_agg(jsonb_build_object('ten_lop', ten_lop, 'ngay', ngay, 'tab', tab, 'ly_do', ly_do) order by ngay desc), '[]'::jsonb)
    into v_ds
  from (select ten_lop, ngay, tab, ly_do from _ta_viec
        where nhan_su_id = v_me and kq = 'khong_dat' order by ngay desc limit 30) x;

  drop table _ta_viec, _ta_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongTaXepHang', v_tong_ta,
    'top', v_top, 'khongDat', v_ds, 'nguongChatLuong', c_nguong_cl, 'nguongXepHang', c_nguong_rank);
end $$;
grant execute on function public.fn_ta_dashboard(text) to authenticated;
revoke execute on function public.fn_ta_dashboard(text) from anon;
