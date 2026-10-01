-- ============================================================================
-- 202609272053 — game_choi_tra_min_max_khi_choi_lai
-- ----------------------------------------------------------------------------
-- VÌ SAO: fn_buoi_game_choi (mig 202609272045) khi HS ĐÃ chơi thì trả lại kết quả cũ nhưng thiếu `min`/`max` của
--   khoảng thưởng ⇒ GV bấm "chiếu lại lên TV" thì TV không biết số EXP nằm ở đâu trong khoảng để chọn hình quà
--   (hộp to → núi vàng). Thêm min/max vào nhánh đã-chơi (lấy theo giải + game của lượt đã ghi). Thân còn lại giữ nguyên.
-- MẤT GÌ (Luật xoá): KHÔNG. create or replace cùng chữ ký.
-- ============================================================================
create or replace function public.fn_buoi_game_choi(p_buoi uuid, p_hoc_sinh uuid, p_game text) returns jsonb
language plpgsql as $$
declare v_b record; v_mon text; v_giai smallint; v_tong int; v_r numeric; v_exp int; v_cu record; w record;
begin
  select * into v_b from buoi_hoc where id = p_buoi for update;
  if not found then raise exception 'Không thấy buổi.'; end if;
  -- đã chơi rồi ⇒ trả lại kết quả cũ (TV/2 máy bấm lặp không cộng đúp) — kèm khoảng để TV vẽ đúng hình quà
  select * into v_cu from buoi_game_luot where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hoc_sinh;
  if found then
    return jsonb_build_object('da_choi', true, 'game', v_cu.game, 'giai', v_cu.giai, 'exp', v_cu.exp,
      'min', (select min(exp) from game_lop_thuong where game = v_cu.game and giai = v_cu.giai),
      'max', (select max(exp) from game_lop_thuong where game = v_cu.game and giai = v_cu.giai),
      'ho_ten', (select ho_ten from hoc_sinh where id = p_hoc_sinh));
  end if;
  if v_b.giai_chot_at is null then raise exception 'Chưa chốt xếp hạng buổi — chốt Nhất/Nhì trước khi chơi.'; end if;
  if not exists (select 1 from buoi_hoc_hs where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hoc_sinh and diem_danh = 'co_mat') then
    raise exception 'Bạn này không có mặt buổi này.'; end if;
  select mon into v_mon from lop where id = v_b.lop_id;
  if v_mon is null then raise exception 'Lớp của buổi chưa có môn.'; end if;
  select coalesce((select giai from buoi_giai where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hoc_sinh), 3) into v_giai;
  select sum(ti_le) into v_tong from game_lop_thuong where game = p_game and giai = v_giai;
  if v_tong is null then raise exception 'Game % chưa có bảng thưởng bản lớp.', p_game; end if;
  v_r := random() * v_tong;
  for w in select exp, ti_le from game_lop_thuong where game = p_game and giai = v_giai order by exp loop
    v_r := v_r - w.ti_le; v_exp := w.exp;
    exit when v_r < 0;
  end loop;
  insert into buoi_game_luot (buoi_hoc_id, hoc_sinh_id, mon, game, giai, exp) values (p_buoi, p_hoc_sinh, v_mon, p_game, v_giai, v_exp);
  insert into gami_exp_ledger (hoc_sinh_id, source, amount, ref_buoi_hoc_id, note, mon)
  values (p_hoc_sinh, 'exp_tren_lop', v_exp, p_buoi, to_char(v_b.ngay, 'YYYY-MM'), v_mon);
  return jsonb_build_object('da_choi', false, 'game', p_game, 'giai', v_giai, 'exp', v_exp,
    'min', (select min(exp) from game_lop_thuong where game = p_game and giai = v_giai),
    'max', (select max(exp) from game_lop_thuong where game = p_game and giai = v_giai),
    'ho_ten', (select ho_ten from hoc_sinh where id = p_hoc_sinh));
end $$;
