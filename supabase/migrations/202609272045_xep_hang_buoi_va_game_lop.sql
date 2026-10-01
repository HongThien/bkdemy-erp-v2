-- ============================================================================
-- 202609272045 — xep_hang_buoi_va_game_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO (spec-game-buoi-hoc.md §5b, Thùy chốt 27/09):
--   Trong phần chấm bài trên lớp có XẾP HẠNG BUỔI: hệ thống gợi ý từ điểm bài trên lớp (phase ingame) của chính
--   buổi, GV chọn Nhất + Nhì (lớp có mặt >10 được tối đa 2 Nhì), các bạn có mặt còn lại = Giải 3 → CHỐT (khoá).
--   Sau chốt mỗi HS có mặt có 1 LƯỢT GAME mang mức giải của mình; GV chọn game. Kết quả RÚT Ở POSTGRES và ghi EXP
--   nguồn mới 'exp_tren_lop' trong CÙNG transaction (§2.0) — TV chỉ diễn. Đã có HS chơi (EXP đã ghi) ⇒ không mở lại.
--   · Chỉ lưu dòng Nhất/Nhì (buoi_giai); Giải 3 SUY ĐỘNG = có mặt − Nhất − Nhì (không đẻ dòng chờ — §1.5).
--   · Khoá = buoi_hoc.giai_chot_at (NULL = chưa chốt, cùng kiểu ingame_dong_at/et_dong_at). Trigger đẻ lịch sử chốt/mở lại (§4).
--   · Bảng thưởng ở DB (game_lop_thuong) — đổi số không phải sửa code. Hiện chỉ có Mở Rương (Chiếm Đất/Đoán Số chờ luật).
--   · EXP ghi note = tháng của NGÀY BUỔI (các hàm chốt xu lọc theo note). Đưa 'exp_tren_lop' vào danh sách nguồn:
--     2 hàm do claude_build sở hữu sửa ở đây; fn_gami_exp_xu_thang (owner postgres) ở file 202609272045_exp_tren_lop_vao_chot_xu_thang.sql (SQL Editor).
--     Sửa danh sách bằng cách ĐỌC định nghĩa đang chạy rồi CHÈN — không chép đè thân hàm (phiên khác đang sửa các hàm này hôm nay).
--
-- MẤT GÌ (Luật xoá): KHÔNG. Chỉ thêm bảng/cột/hàm; 2 hàm cũ chỉ được chèn thêm 'exp_tren_lop' vào danh sách nguồn.
-- ============================================================================

alter table buoi_hoc add column if not exists giai_chot_at timestamptz;
comment on column buoi_hoc.giai_chot_at is 'Lúc GV chốt xếp hạng buổi (Nhất/Nhì/Giải 3). NULL = chưa chốt hoặc đã mở lại. spec-game-buoi-hoc §5b';

create table if not exists buoi_giai (
  buoi_hoc_id uuid not null references buoi_hoc(id),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  giai        smallint not null check (giai in (1, 2)),
  mon         text not null,
  nguoi       uuid default jwt_uid(),
  created_at  timestamptz not null default now(),
  primary key (buoi_hoc_id, hoc_sinh_id)
);
comment on table buoi_giai is 'Xếp hạng buổi: CHỈ Nhất (1) / Nhì (2). Giải 3 = HS có mặt còn lại (suy động, không có dòng). spec-game-buoi-hoc §5b';

create table if not exists buoi_giai_log (
  id          bigserial primary key,
  buoi_hoc_id uuid not null references buoi_hoc(id),
  hanh_dong   text not null check (hanh_dong in ('chot', 'mo_lai')),
  chi_tiet    jsonb,
  nguoi       uuid default jwt_uid(),
  at          timestamptz not null default now()
);
comment on table buoi_giai_log is 'Lịch sử chốt / mở lại xếp hạng buổi — trigger trên buoi_hoc.giai_chot_at tự ghi (app không tự ghi).';
create index if not exists buoi_giai_log_buoi_idx on buoi_giai_log (buoi_hoc_id);

create table if not exists game_lop_thuong (
  game   text not null,
  giai   smallint not null check (giai in (1, 2, 3)),
  exp    integer not null check (exp > 0),
  ti_le  integer not null check (ti_le > 0),
  primary key (game, giai, exp)
);
comment on table game_lop_thuong is 'Bảng thưởng EXP bản BUỔI HỌC: (game, giải) → các mức EXP + trọng số. Đổi số ở đây, không sửa code.';

-- Mở Rương bản lớp (Thùy duyệt 27/09): Nhất→Vàng 200–400 TB300 · Nhì→Bạc 200–300 TB250 · Giải 3→Gỗ 100–200 TB175 ⇒ TB lớp 8 bạn ≈ 200
insert into game_lop_thuong (game, giai, exp, ti_le) values
  ('mo_ruong', 1, 200, 2), ('mo_ruong', 1, 220, 4), ('mo_ruong', 1, 240, 7), ('mo_ruong', 1, 260, 10), ('mo_ruong', 1, 280, 14),
  ('mo_ruong', 1, 300, 26), ('mo_ruong', 1, 320, 14), ('mo_ruong', 1, 340, 10), ('mo_ruong', 1, 360, 7), ('mo_ruong', 1, 380, 4),
  ('mo_ruong', 1, 400, 2),
  ('mo_ruong', 2, 200, 10), ('mo_ruong', 2, 220, 15), ('mo_ruong', 2, 240, 25), ('mo_ruong', 2, 260, 25), ('mo_ruong', 2, 280, 15),
  ('mo_ruong', 2, 300, 10),
  ('mo_ruong', 3, 100, 4), ('mo_ruong', 3, 120, 6), ('mo_ruong', 3, 140, 9), ('mo_ruong', 3, 160, 14), ('mo_ruong', 3, 180, 25),
  ('mo_ruong', 3, 200, 42)
on conflict (game, giai, exp) do nothing;

create table if not exists buoi_game_luot (
  id          uuid primary key default gen_random_uuid(),
  buoi_hoc_id uuid not null references buoi_hoc(id),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  mon         text not null,
  game        text not null,
  giai        smallint not null check (giai in (1, 2, 3)),
  exp         integer not null,
  nguoi       uuid default jwt_uid(),
  at          timestamptz not null default now(),
  unique (buoi_hoc_id, hoc_sinh_id)
);
comment on table buoi_game_luot is '1 lượt game / HS / buổi (unique). Dòng chỉ ra đời khi đã rút xong kết quả + ghi EXP (§1.5). spec-game-buoi-hoc §5b';

-- RLS: cùng mẫu gami_* (thành viên nội bộ)
do $$ declare t text; begin
  foreach t in array array['buoi_giai', 'buoi_giai_log', 'game_lop_thuong', 'buoi_game_luot'] loop
    execute format('alter table %I enable row level security', t);
    if not exists (select 1 from pg_policies where tablename = t and policyname = t || '_member_all') then
      execute format('create policy %I on %I for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())', t || '_member_all', t);
    end if;
  end loop;
end $$;

-- ---------- lịch sử chốt / mở lại (trigger) ----------
create or replace function public._buoi_giai_log() returns trigger language plpgsql as $$
begin
  if new.giai_chot_at is distinct from old.giai_chot_at then
    insert into buoi_giai_log (buoi_hoc_id, hanh_dong, chi_tiet)
    values (new.id, case when new.giai_chot_at is null then 'mo_lai' else 'chot' end,
            (select coalesce(jsonb_agg(jsonb_build_object('hoc_sinh_id', g.hoc_sinh_id, 'giai', g.giai) order by g.giai), '[]'::jsonb)
               from buoi_giai g where g.buoi_hoc_id = new.id));
  end if;
  return new;
end $$;
drop trigger if exists trg_buoi_giai_log on buoi_hoc;
create trigger trg_buoi_giai_log after update of giai_chot_at on buoi_hoc for each row execute function public._buoi_giai_log();

-- ---------- tình hình xếp hạng + game của 1 buổi (đọc) ----------
-- Gợi ý = tổng điểm bài trên lớp (ingame) của chính buổi; hạng dense_rank ⇒ BẰNG ĐIỂM hiện là bằng hạng (GV chọn).
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
                coalesce(gi.giai, 3) as giai, gl.game, gl.exp
         from cm left join diem d on d.hoc_sinh_id = cm.hoc_sinh_id
         left join buoi_giai gi on gi.buoi_hoc_id = p_buoi and gi.hoc_sinh_id = cm.hoc_sinh_id
         left join buoi_game_luot gl on gl.buoi_hoc_id = p_buoi and gl.hoc_sinh_id = cm.hoc_sinh_id)
  select jsonb_build_object(
    'buoi_id', p_buoi,
    'mon', (select mon from b),
    'da_chot', (select giai_chot_at is not null from b),
    'chot_at', (select giai_chot_at from b),
    'so_co_mat', (select count(*) from cm),
    'toi_da_nhi', case when (select count(*) from cm) > 10 then 2 else 1 end,
    'co_du_lieu', exists (select 1 from diem),
    'so_da_choi', (select count(*) from buoi_game_luot where buoi_hoc_id = p_buoi),
    -- HS có giải mà nay không còn có mặt (bị sửa điểm danh sau khi chốt) ⇒ GV cần xem lại
    'giai_lech', coalesce((select jsonb_agg(jsonb_build_object('hoc_sinh_id', g.hoc_sinh_id, 'giai', g.giai))
                           from buoi_giai g where g.buoi_hoc_id = p_buoi
                             and not exists (select 1 from cm where cm.hoc_sinh_id = g.hoc_sinh_id)), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object('hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'diem', diem,
                     'hang_goi_y', hang_goi_y, 'giai', giai, 'game', game, 'exp', exp)
                     order by hang_goi_y nulls last, ho_ten) from hs), '[]'::jsonb)
  )
$$;

-- ---------- chốt ----------
create or replace function public.fn_buoi_giai_chot(p_buoi uuid, p_nhat uuid, p_nhi uuid[]) returns jsonb
language plpgsql as $$
declare v_b record; v_mon text; v_n int; v_max int; v_nhi uuid[] := coalesce(p_nhi, '{}'); x uuid;
begin
  select * into v_b from buoi_hoc where id = p_buoi for update;
  if not found then raise exception 'Không thấy buổi.'; end if;
  if v_b.giai_chot_at is not null then raise exception 'Buổi này đã chốt xếp hạng — bấm Mở lại để sửa.'; end if;
  select mon into v_mon from lop where id = v_b.lop_id;
  if v_mon is null then raise exception 'Lớp của buổi chưa có môn — không ghi được xếp hạng.'; end if;
  select count(*) into v_n from buoi_hoc_hs where buoi_hoc_id = p_buoi and diem_danh = 'co_mat';
  if v_n = 0 then raise exception 'Buổi chưa có HS có mặt — điểm danh trước.'; end if;
  v_max := case when v_n > 10 then 2 else 1 end;
  if p_nhat is null then raise exception 'Chưa chọn giải Nhất.'; end if;
  if array_length(v_nhi, 1) is not null and array_length(v_nhi, 1) > v_max then
    raise exception 'Lớp có mặt % bạn chỉ được tối đa % giải Nhì.', v_n, v_max; end if;
  if v_n >= 2 and coalesce(array_length(v_nhi, 1), 0) = 0 then raise exception 'Chưa chọn giải Nhì.'; end if;
  if p_nhat = any(v_nhi) then raise exception 'Một bạn không thể vừa Nhất vừa Nhì.'; end if;
  if (select count(distinct u) from unnest(v_nhi) u) <> coalesce(array_length(v_nhi, 1), 0) then raise exception 'Chọn trùng bạn ở giải Nhì.'; end if;
  foreach x in array array[p_nhat] || v_nhi loop
    if not exists (select 1 from buoi_hoc_hs where buoi_hoc_id = p_buoi and hoc_sinh_id = x and diem_danh = 'co_mat') then
      raise exception 'Có bạn được chọn nhưng không có mặt buổi này.'; end if;
  end loop;
  -- thay lựa chọn cũ (sau Mở lại) bằng lựa chọn mới; lựa chọn cũ đã nằm trong buoi_giai_log lúc chốt trước
  delete from buoi_giai where buoi_hoc_id = p_buoi;
  insert into buoi_giai (buoi_hoc_id, hoc_sinh_id, giai, mon) values (p_buoi, p_nhat, 1, v_mon);
  insert into buoi_giai (buoi_hoc_id, hoc_sinh_id, giai, mon) select p_buoi, u, 2, v_mon from unnest(v_nhi) u;
  update buoi_hoc set giai_chot_at = now(), updated_at = now() where id = p_buoi;
  return public.fn_buoi_giai_tinh_hinh(p_buoi);
end $$;

-- ---------- mở lại ----------
create or replace function public.fn_buoi_giai_mo_lai(p_buoi uuid) returns jsonb
language plpgsql as $$
declare v_b record;
begin
  select * into v_b from buoi_hoc where id = p_buoi for update;
  if not found then raise exception 'Không thấy buổi.'; end if;
  if v_b.giai_chot_at is null then raise exception 'Buổi này chưa chốt xếp hạng.'; end if;
  if exists (select 1 from buoi_game_luot where buoi_hoc_id = p_buoi) then
    raise exception 'Đã có HS chơi game (EXP đã ghi) — không mở lại được nữa.'; end if;
  update buoi_hoc set giai_chot_at = null, updated_at = now() where id = p_buoi;
  return public.fn_buoi_giai_tinh_hinh(p_buoi);
end $$;

-- ---------- chơi 1 lượt: RÚT ở DB + ghi EXP, 1 transaction ----------
create or replace function public.fn_buoi_game_choi(p_buoi uuid, p_hoc_sinh uuid, p_game text) returns jsonb
language plpgsql as $$
declare v_b record; v_mon text; v_giai smallint; v_tong int; v_r numeric; v_exp int; v_cu record; w record;
begin
  select * into v_b from buoi_hoc where id = p_buoi for update;
  if not found then raise exception 'Không thấy buổi.'; end if;
  -- đã chơi rồi ⇒ trả lại kết quả cũ (TV/2 máy bấm lặp không cộng đúp)
  select * into v_cu from buoi_game_luot where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hoc_sinh;
  if found then
    return jsonb_build_object('da_choi', true, 'game', v_cu.game, 'giai', v_cu.giai, 'exp', v_cu.exp,
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

revoke all on function public.fn_buoi_giai_tinh_hinh(uuid), public.fn_buoi_giai_chot(uuid, uuid, uuid[]),
  public.fn_buoi_giai_mo_lai(uuid), public.fn_buoi_game_choi(uuid, uuid, text) from public, anon;
grant execute on function public.fn_buoi_giai_tinh_hinh(uuid), public.fn_buoi_giai_chot(uuid, uuid, uuid[]),
  public.fn_buoi_giai_mo_lai(uuid), public.fn_buoi_game_choi(uuid, uuid, text) to authenticated;

-- ---------- đưa 'exp_tren_lop' vào danh sách nguồn của 2 hàm (owner claude_build) — chèn vào định nghĩa ĐANG CHẠY ----------
do $$
declare f text; d text; n int;
begin
  foreach f in array array['fn_gami_exp_chi_tiet_thang', 'fn_hs_vi_xu_cua_toi'] loop
    select pg_get_functiondef(p.oid) into d from pg_proc p join pg_namespace s on s.oid = p.pronamespace
      where s.nspname = 'public' and p.proname = f;
    if d is null then raise exception 'Không thấy hàm %', f; end if;
    if position('exp_tren_lop' in d) > 0 then continue; end if; -- đã có (chạy lại vô hại)
    n := (length(d) - length(replace(d, '''exp_btvn_thang''', ''))) / length('''exp_btvn_thang''');
    if n <> 1 then raise exception 'Hàm %: mong đúng 1 chỗ liệt kê nguồn có exp_btvn_thang, thấy % — sửa tay.', f, n; end if;
    execute replace(d, '''exp_btvn_thang''', '''exp_btvn_thang'', ''exp_tren_lop''');
  end loop;
end $$;
