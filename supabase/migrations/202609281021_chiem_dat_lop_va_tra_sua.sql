-- ============================================================================
-- 202609281021 — chiem_dat_lop_va_tra_sua
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 28/09, spec-game-buoi-hoc.md §5c):
--   1. CHIẾM ĐẤT bản BUỔI HỌC: 3 loại ô = 3 mức giải (Giải 3 → ô ★ · Nhì → ô ★★ · Nhất → ô ★★★), EXP Y HỆT Mở Rương
--      (cùng bảng game_lop_thuong, game='chiem_dat' chép từ 'mo_ruong'). HS chọn ô bất kì, không giới hạn sát đất — luật đó
--      nằm ở TV (chỉ diễn), DB không cần biết ô nào.
--   2. QUÀ ĐẶC BIỆT "TRÀ SỮA" cho MỌI game bản lớp (Mở Rương + Chiếm Đất): rút THÊM, độc lập với EXP, theo giải:
--      Nhất 0,1% · Nhì 0,05% · Giải 3 0,01%. Trúng thì vẫn nhận EXP như thường + 1 trà sữa (quà THẬT, người trao tay).
--      · Bảng tỉ lệ ở DB (game_lop_qua_dac_biet) — đổi số không sửa code. Tỉ lệ là % (numeric), không phải trọng số.
--      · Trúng = 1 dòng buoi_game_qua (§1.5: không trúng = KHÔNG có dòng, không cột "qua = null" trên lượt).
--        trao_at NULL = chưa trao (cờ vận hành, cùng kiểu giai_chot_at/ingame_dong_at) — GV/OPS bấm "Đã trao" để khép.
--      · Rút trong CÙNG transaction với EXP (fn_buoi_game_choi) — 2 máy bấm lặp vẫn 1 kết quả (unique lượt).
--
-- MẤT GÌ (Luật xoá): KHÔNG. Chỉ thêm dòng thưởng, 2 bảng mới, 1 hàm mới; fn_buoi_game_choi / fn_buoi_giai_tinh_hinh
--   create or replace cùng chữ ký (thân cũ ở mig 202609272045 / 202609272053).
-- ============================================================================

-- ---------- 1. Chiếm Đất = bảng thưởng Mở Rương ----------
insert into game_lop_thuong (game, giai, exp, ti_le)
select 'chiem_dat', giai, exp, ti_le from game_lop_thuong where game = 'mo_ruong'
on conflict (game, giai, exp) do nothing;

-- ---------- 2. Quà đặc biệt ----------
create table if not exists game_lop_qua_dac_biet (
  qua       text not null,
  giai      smallint not null check (giai in (1, 2, 3)),
  ti_le_pt  numeric not null check (ti_le_pt >= 0 and ti_le_pt <= 100),
  primary key (qua, giai)
);
comment on table game_lop_qua_dac_biet is 'Quà đặc biệt bản BUỔI HỌC (mọi game): (quà, giải) → tỉ lệ % trúng mỗi lượt, rút độc lập với EXP. Thùy 28/09: trà sữa Nhất 0,1 · Nhì 0,05 · Giải 3 0,01.';
insert into game_lop_qua_dac_biet (qua, giai, ti_le_pt) values ('tra_sua', 1, 0.1), ('tra_sua', 2, 0.05), ('tra_sua', 3, 0.01)
on conflict (qua, giai) do nothing;

create table if not exists buoi_game_qua (
  luot_id     uuid primary key references buoi_game_luot(id),
  buoi_hoc_id uuid not null references buoi_hoc(id),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  qua         text not null,
  trao_at     timestamptz,
  trao_boi    uuid,
  at          timestamptz not null default now()
);
comment on table buoi_game_qua is 'Lượt game trúng quà đặc biệt (trà sữa…). Dòng chỉ có khi TRÚNG (§1.5). trao_at NULL = chưa trao tay — GV/OPS bấm Đã trao.';
create index if not exists buoi_game_qua_buoi_idx on buoi_game_qua (buoi_hoc_id);
create index if not exists buoi_game_qua_chua_trao_idx on buoi_game_qua (at) where trao_at is null;

do $$ declare t text; begin
  foreach t in array array['game_lop_qua_dac_biet', 'buoi_game_qua'] loop
    execute format('alter table %I enable row level security', t);
    if not exists (select 1 from pg_policies where tablename = t and policyname = t || '_member_all') then
      execute format('create policy %I on %I for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())', t || '_member_all', t);
    end if;
  end loop;
end $$;

-- ---------- 3. Tình hình buổi: thêm quà đặc biệt từng HS ----------
create or replace function public.fn_buoi_giai_tinh_hinh(p_buoi uuid) returns jsonb
language sql stable as $$
  with b as (select bh.id, bh.giai_chot_at, bh.ngay, lp.mon from buoi_hoc bh left join lop lp on lp.id = bh.lop_id where bh.id = p_buoi),
  cm as (select r.hoc_sinh_id, hs.ho_ten from buoi_hoc_hs r join hoc_sinh hs on hs.id = r.hoc_sinh_id
         where r.buoi_hoc_id = p_buoi and r.diem_danh = 'co_mat'),
  diem as (select g.hoc_sinh_id, sum(g.points)::numeric as diem from gami_grades g
           join gami_session_problems sp on sp.id = g.problem_id
           where sp.buoi_hoc_id = p_buoi and sp.phase = 'ingame' group by 1),
  hs as (select cm.hoc_sinh_id, cm.ho_ten, d.diem,
                case when d.diem is null then null else dense_rank() over (partition by d.diem is null order by d.diem desc) end as hang_goi_y,
                coalesce(gi.giai, 3) as giai, gl.game, gl.exp, q.qua, q.trao_at as qua_trao_at
         from cm left join diem d on d.hoc_sinh_id = cm.hoc_sinh_id
         left join buoi_giai gi on gi.buoi_hoc_id = p_buoi and gi.hoc_sinh_id = cm.hoc_sinh_id
         left join buoi_game_luot gl on gl.buoi_hoc_id = p_buoi and gl.hoc_sinh_id = cm.hoc_sinh_id
         left join buoi_game_qua q on q.luot_id = gl.id)
  select jsonb_build_object(
    'buoi_id', p_buoi,
    'mon', (select mon from b),
    'da_chot', (select giai_chot_at is not null from b),
    'chot_at', (select giai_chot_at from b),
    'so_co_mat', (select count(*) from cm),
    'toi_da_nhi', case when (select count(*) from cm) > 10 then 2 else 1 end,
    'co_du_lieu', exists (select 1 from diem),
    'so_da_choi', (select count(*) from buoi_game_luot where buoi_hoc_id = p_buoi),
    'so_qua_chua_trao', (select count(*) from buoi_game_qua where buoi_hoc_id = p_buoi and trao_at is null),
    -- HS có giải mà nay không còn có mặt (bị sửa điểm danh sau khi chốt) ⇒ GV cần xem lại
    'giai_lech', coalesce((select jsonb_agg(jsonb_build_object('hoc_sinh_id', g.hoc_sinh_id, 'giai', g.giai))
                           from buoi_giai g where g.buoi_hoc_id = p_buoi
                             and not exists (select 1 from cm where cm.hoc_sinh_id = g.hoc_sinh_id)), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object('hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'diem', diem,
                     'hang_goi_y', hang_goi_y, 'giai', giai, 'game', game, 'exp', exp, 'qua', qua, 'qua_trao_at', qua_trao_at)
                     order by hang_goi_y nulls last, ho_ten) from hs), '[]'::jsonb)
  )
$$;

-- ---------- 4. Chơi 1 lượt: rút EXP + rút quà đặc biệt + ghi sổ, 1 transaction ----------
create or replace function public.fn_buoi_game_choi(p_buoi uuid, p_hoc_sinh uuid, p_game text) returns jsonb
language plpgsql as $$
declare v_b record; v_mon text; v_giai smallint; v_tong int; v_r numeric; v_exp int; v_cu record; w record;
        v_luot uuid; v_qua text; v_pt numeric;
begin
  select * into v_b from buoi_hoc where id = p_buoi for update;
  if not found then raise exception 'Không thấy buổi.'; end if;
  -- đã chơi rồi ⇒ trả lại kết quả cũ (TV/2 máy bấm lặp không cộng đúp, không rút lại quà) — kèm khoảng để TV vẽ đúng hình quà
  select * into v_cu from buoi_game_luot where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hoc_sinh;
  if found then
    return jsonb_build_object('da_choi', true, 'game', v_cu.game, 'giai', v_cu.giai, 'exp', v_cu.exp,
      'min', (select min(exp) from game_lop_thuong where game = v_cu.game and giai = v_cu.giai),
      'max', (select max(exp) from game_lop_thuong where game = v_cu.game and giai = v_cu.giai),
      'qua', (select qua from buoi_game_qua where luot_id = v_cu.id),
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
  insert into buoi_game_luot (buoi_hoc_id, hoc_sinh_id, mon, game, giai, exp) values (p_buoi, p_hoc_sinh, v_mon, p_game, v_giai, v_exp)
  returning id into v_luot;
  insert into gami_exp_ledger (hoc_sinh_id, source, amount, ref_buoi_hoc_id, note, mon)
  values (p_hoc_sinh, 'exp_tren_lop', v_exp, p_buoi, to_char(v_b.ngay, 'YYYY-MM'), v_mon);
  -- quà đặc biệt: mỗi loại quà rút riêng theo % của giải (hiện chỉ trà sữa); trúng ⇒ 1 dòng, không trúng ⇒ không dòng
  for w in select qua, ti_le_pt from game_lop_qua_dac_biet where giai = v_giai and ti_le_pt > 0 order by qua loop
    if v_qua is null and random() * 100 < w.ti_le_pt then
      v_qua := w.qua;
      insert into buoi_game_qua (luot_id, buoi_hoc_id, hoc_sinh_id, qua) values (v_luot, p_buoi, p_hoc_sinh, v_qua);
    end if;
  end loop;
  return jsonb_build_object('da_choi', false, 'game', p_game, 'giai', v_giai, 'exp', v_exp,
    'min', (select min(exp) from game_lop_thuong where game = p_game and giai = v_giai),
    'max', (select max(exp) from game_lop_thuong where game = p_game and giai = v_giai),
    'qua', v_qua,
    'ho_ten', (select ho_ten from hoc_sinh where id = p_hoc_sinh));
end $$;

-- ---------- 5. Đã trao quà (khép vận hành) ----------
create or replace function public.fn_buoi_game_qua_trao(p_buoi uuid, p_hoc_sinh uuid) returns jsonb
language plpgsql as $$
declare v_n int;
begin
  update buoi_game_qua q set trao_at = now(), trao_boi = jwt_uid()
    from buoi_game_luot l
   where q.luot_id = l.id and l.buoi_hoc_id = p_buoi and l.hoc_sinh_id = p_hoc_sinh and q.trao_at is null;
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'Bạn này không có quà chưa trao ở buổi này.'; end if;
  return public.fn_buoi_giai_tinh_hinh(p_buoi);
end $$;

revoke all on function public.fn_buoi_game_qua_trao(uuid, uuid) from public, anon;
grant execute on function public.fn_buoi_game_qua_trao(uuid, uuid) to authenticated;
