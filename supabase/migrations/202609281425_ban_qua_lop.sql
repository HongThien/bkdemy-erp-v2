-- ============================================================================
-- 202609281425 — ban_qua_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 28/09, spec-game-ban-qua.md §7): Bắn Quà bản BUỔI HỌC nối ERP như Mở Rương/Chiếm Đất — "dữ liệu đều phải trên DB".
--   · Sau khi GV chốt xếp hạng buổi, chọn game Bắn Quà: CÁ NHÂN hoặc ĐỘI (chia đội = chức năng riêng: DB chia ngẫu nhiên, hoặc GV tự xếp).
--   · "Bắt đầu ván" (fn_ban_qua_bat_dau): DB snapshot giải + RÚT vòng quay đạn (3 loại/HS, trọng số theo giải — bảng ban_qua_quay)
--     + xáo thứ tự bắn. Bắt đầu lại ván (TV tải lại…) GIỮ NGUYÊN đạn đã quay — không quay lại để đổi đạn.
--   · Chơi trên TV (vật lý chạy ở TV — thứ DUY NHẤT DB phải nhận từ ngoài là điểm thô: điểm từng HS / sát thương từng đội).
--   · "Chốt kết quả" (fn_ban_qua_chot, GV bấm sau khi xem): DB xếp hạng + tính EXP + rương đội + trà sữa + ghi sổ EXP, 1 transaction.
--       cá nhân: hạng theo điểm, EXP tuyến tính Nhất 300 → cuối 100 (TB 200), bằng điểm = cùng hạng, chia TB EXP các hạng đó.
--       đội: xếp theo sát thương gây ra; đội nhất (bằng nhau thì cùng nhất) rương VÀNG, còn lại rương BẠC — rút 1 LẦN/ĐỘI, cả đội chung EXP.
--       trà sữa: rút riêng từng HS theo giải (game_lop_qua_dac_biet) như Mở Rương.
--   · Dòng chỉ ra đời khi có sự kiện thật (§1.5): ván = lúc bắt đầu (đã quay đạn); lượt/EXP/kết quả đội = lúc chốt. chot_at NULL = chưa chốt.
--   · Refactor: rút EXP theo bảng + rút quà đặc biệt thành 2 hàm nội bộ dùng chung (_game_lop_rut_exp · _game_lop_rut_qua);
--     fn_buoi_game_choi (Mở Rương/Chiếm Đất) gọi lại 2 hàm đó — công thức 1 nơi.
--
-- MẤT GÌ (Luật xoá): KHÔNG. Thêm cột buoi_game_luot.diem_game, 4 bảng mới, hàm mới; fn_buoi_game_choi / fn_buoi_giai_mo_lai
--   create or replace cùng chữ ký (thân cũ: mig 202609281021 / 202609272045) — hành vi giữ nguyên + thêm chặn khi đã bắt đầu ván Bắn Quà.
-- ============================================================================

alter table buoi_game_luot add column if not exists diem_game integer;
comment on column buoi_game_luot.diem_game is 'Điểm thô của game KỸ NĂNG (Bắn Quà: điểm bắn cá nhân). NULL = game không có điểm (Mở Rương/Chiếm Đất rút thẳng EXP) — không áp dụng.';

-- ---------- vòng quay đạn theo giải (Nhất dễ ra đạn đặc biệt) ----------
create table if not exists ban_qua_quay (
  giai      smallint not null check (giai in (1, 2, 3)),
  dan       text not null check (dan in ('thuong','bomto','nay','xuyen','chum','cuu','chuoi','saobang','lua','set')),
  trong_so  integer not null check (trong_so > 0),
  primary key (giai, dan)
);
comment on table ban_qua_quay is 'Bắn Quà — trọng số vòng quay đạn theo giải. Điểm TB các đạn đã cân bằng nhau (spec §5e) ⇒ giải cao chỉ dễ ra đạn KỊCH TÍNH hơn.';
insert into ban_qua_quay (giai, dan, trong_so) values
  (1,'thuong',6),(1,'nay',8),(1,'bomto',8),(1,'xuyen',11),(1,'chum',11),(1,'cuu',11),(1,'chuoi',11),(1,'saobang',11),(1,'lua',11),(1,'set',12),
  (2,'thuong',14),(2,'nay',12),(2,'bomto',12),(2,'xuyen',10),(2,'chum',11),(2,'cuu',8),(2,'chuoi',8),(2,'saobang',8),(2,'lua',8),(2,'set',9),
  (3,'thuong',22),(3,'nay',16),(3,'bomto',14),(3,'xuyen',7),(3,'chum',9),(3,'cuu',6),(3,'chuoi',6),(3,'saobang',6),(3,'lua',7),(3,'set',7)
on conflict (giai, dan) do nothing;

-- rương đội: Vàng = bảng giải 1 của Mở Rương (TB 300), Bạc = bảng giải 2 (TB 250)
insert into game_lop_thuong (game, giai, exp, ti_le)
select 'ban_qua_doi', giai, exp, ti_le from game_lop_thuong where game = 'mo_ruong' and giai in (1, 2)
on conflict (game, giai, exp) do nothing;

-- ---------- ván ----------
create table if not exists buoi_ban_qua (
  buoi_hoc_id uuid primary key references buoi_hoc(id),
  mon         text not null,
  che_do      text not null check (che_do in ('canhan', 'doi')),
  so_doi      smallint check (so_doi between 2 and 4),
  phut        smallint check (phut between 1 and 10),
  chot_at     timestamptz,
  nguoi       uuid default jwt_uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check ((che_do = 'canhan') = (so_doi is null) and (che_do = 'canhan') = (phut is null))
);
comment on table buoi_ban_qua is 'Ván Bắn Quà của 1 buổi — ra đời lúc GV bấm Bắt đầu (đã quay đạn). so_doi/phut NULL = chế độ cá nhân (không áp dụng). chot_at NULL = chưa chốt.';

create table if not exists buoi_ban_qua_hs (
  buoi_hoc_id uuid not null references buoi_ban_qua(buoi_hoc_id),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  giai        smallint not null check (giai in (1, 2, 3)),
  doi         smallint check (doi between 1 and 4),
  dan         text[] not null check (cardinality(dan) = 3),
  thu_tu      smallint not null,
  primary key (buoi_hoc_id, hoc_sinh_id)
);
comment on table buoi_ban_qua_hs is 'HS trong ván Bắn Quà: giải (snapshot lúc bắt đầu), đội (NULL = cá nhân), 3 đạn DB đã quay, thứ tự bắn.';

create table if not exists buoi_ban_qua_doi (
  buoi_hoc_id uuid not null references buoi_ban_qua(buoi_hoc_id),
  doi         smallint not null check (doi between 1 and 4),
  sat_thuong  integer not null check (sat_thuong >= 0),
  hang        smallint not null,
  ruong       text not null check (ruong in ('vang', 'bac')),
  exp         integer not null,
  primary key (buoi_hoc_id, doi)
);
comment on table buoi_ban_qua_doi is 'Kết quả ĐỘI của ván Bắn Quà — chỉ ra đời lúc CHỐT: sát thương gây ra, hạng, rương, EXP (rút 1 lần/đội, cả đội chung).';

do $$ declare t text; begin
  foreach t in array array['ban_qua_quay', 'buoi_ban_qua', 'buoi_ban_qua_hs', 'buoi_ban_qua_doi'] loop
    execute format('alter table %I enable row level security', t);
    if not exists (select 1 from pg_policies where tablename = t and policyname = t || '_member_all') then
      execute format('create policy %I on %I for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())', t || '_member_all', t);
    end if;
  end loop;
end $$;

-- ---------- 2 hàm nội bộ dùng chung (Mở Rương · Chiếm Đất · Bắn Quà) ----------
create or replace function public._game_lop_rut_exp(p_game text, p_giai smallint) returns integer
language plpgsql as $$
declare v_tong int; v_r numeric; w record; v_exp int;
begin
  select sum(ti_le) into v_tong from game_lop_thuong where game = p_game and giai = p_giai;
  if v_tong is null then raise exception 'Game % chưa có bảng thưởng giải %.', p_game, p_giai; end if;
  v_r := random() * v_tong;
  for w in select exp, ti_le from game_lop_thuong where game = p_game and giai = p_giai order by exp loop
    v_r := v_r - w.ti_le; v_exp := w.exp; exit when v_r < 0;
  end loop;
  return v_exp;
end $$;

create or replace function public._game_lop_rut_qua(p_luot uuid, p_buoi uuid, p_hs uuid, p_giai smallint) returns text
language plpgsql as $$
declare w record;
begin
  for w in select qua, ti_le_pt from game_lop_qua_dac_biet where giai = p_giai and ti_le_pt > 0 order by qua loop
    if random() * 100 < w.ti_le_pt then
      insert into buoi_game_qua (luot_id, buoi_hoc_id, hoc_sinh_id, qua) values (p_luot, p_buoi, p_hs, w.qua);
      return w.qua;
    end if;
  end loop;
  return null;
end $$;

-- ---------- Mở Rương / Chiếm Đất: gọi lại 2 hàm chung (hành vi giữ nguyên) ----------
create or replace function public.fn_buoi_game_choi(p_buoi uuid, p_hoc_sinh uuid, p_game text) returns jsonb
language plpgsql as $$
declare v_b record; v_mon text; v_giai smallint; v_exp int; v_cu record; v_luot uuid; v_qua text;
begin
  select * into v_b from buoi_hoc where id = p_buoi for update;
  if not found then raise exception 'Không thấy buổi.'; end if;
  select * into v_cu from buoi_game_luot where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hoc_sinh;
  if found then
    return jsonb_build_object('da_choi', true, 'game', v_cu.game, 'giai', v_cu.giai, 'exp', v_cu.exp,
      'min', (select min(exp) from game_lop_thuong where game = v_cu.game and giai = v_cu.giai),
      'max', (select max(exp) from game_lop_thuong where game = v_cu.game and giai = v_cu.giai),
      'qua', (select qua from buoi_game_qua where luot_id = v_cu.id),
      'ho_ten', (select ho_ten from hoc_sinh where id = p_hoc_sinh));
  end if;
  if v_b.giai_chot_at is null then raise exception 'Chưa chốt xếp hạng buổi — chốt Nhất/Nhì trước khi chơi.'; end if;
  if exists (select 1 from buoi_ban_qua where buoi_hoc_id = p_buoi) then raise exception 'Buổi này đang chơi Bắn Quà — mỗi buổi 1 game.'; end if;
  if not exists (select 1 from buoi_hoc_hs where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hoc_sinh and diem_danh = 'co_mat') then
    raise exception 'Bạn này không có mặt buổi này.'; end if;
  select mon into v_mon from lop where id = v_b.lop_id;
  if v_mon is null then raise exception 'Lớp của buổi chưa có môn.'; end if;
  select coalesce((select giai from buoi_giai where buoi_hoc_id = p_buoi and hoc_sinh_id = p_hoc_sinh), 3) into v_giai;
  v_exp := public._game_lop_rut_exp(p_game, v_giai);
  insert into buoi_game_luot (buoi_hoc_id, hoc_sinh_id, mon, game, giai, exp) values (p_buoi, p_hoc_sinh, v_mon, p_game, v_giai, v_exp)
  returning id into v_luot;
  insert into gami_exp_ledger (hoc_sinh_id, source, amount, ref_buoi_hoc_id, note, mon)
  values (p_hoc_sinh, 'exp_tren_lop', v_exp, p_buoi, to_char(v_b.ngay, 'YYYY-MM'), v_mon);
  v_qua := public._game_lop_rut_qua(v_luot, p_buoi, p_hoc_sinh, v_giai);
  return jsonb_build_object('da_choi', false, 'game', p_game, 'giai', v_giai, 'exp', v_exp,
    'min', (select min(exp) from game_lop_thuong where game = p_game and giai = v_giai),
    'max', (select max(exp) from game_lop_thuong where game = p_game and giai = v_giai),
    'qua', v_qua, 'ho_ten', (select ho_ten from hoc_sinh where id = p_hoc_sinh));
end $$;

-- ---------- mở lại xếp hạng: chặn thêm khi đã bắt đầu ván Bắn Quà (giải đã snapshot + đạn đã quay theo giải) ----------
create or replace function public.fn_buoi_giai_mo_lai(p_buoi uuid) returns jsonb
language plpgsql as $$
declare v_b record;
begin
  select * into v_b from buoi_hoc where id = p_buoi for update;
  if not found then raise exception 'Không thấy buổi.'; end if;
  if v_b.giai_chot_at is null then raise exception 'Buổi này chưa chốt xếp hạng.'; end if;
  if exists (select 1 from buoi_game_luot where buoi_hoc_id = p_buoi) then
    raise exception 'Đã có HS chơi game (EXP đã ghi) — không mở lại được nữa.'; end if;
  if exists (select 1 from buoi_ban_qua where buoi_hoc_id = p_buoi) then
    raise exception 'Đã bắt đầu ván Bắn Quà (đạn đã quay theo giải) — không mở lại xếp hạng được nữa.'; end if;
  update buoi_hoc set giai_chot_at = null, updated_at = now() where id = p_buoi;
  return public.fn_buoi_giai_tinh_hinh(p_buoi);
end $$;

-- ---------- Bắn Quà: tình hình ván (đọc) ----------
create or replace function public.fn_ban_qua_tinh_hinh(p_buoi uuid) returns jsonb
language sql stable as $$
  select jsonb_build_object(
    'buoi_id', p_buoi,
    'van', (select jsonb_build_object('che_do', v.che_do, 'so_doi', v.so_doi, 'phut', v.phut, 'chot_at', v.chot_at, 'created_at', v.created_at)
            from buoi_ban_qua v where v.buoi_hoc_id = p_buoi),
    'hs', coalesce((select jsonb_agg(jsonb_build_object('hoc_sinh_id', h.hoc_sinh_id, 'ho_ten', s.ho_ten, 'giai', h.giai, 'doi', h.doi, 'dan', to_jsonb(h.dan),
             'thu_tu', h.thu_tu, 'co_mat', exists (select 1 from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi and r.hoc_sinh_id = h.hoc_sinh_id and r.diem_danh = 'co_mat'),
             'diem', l.diem_game, 'exp', l.exp, 'qua', q.qua) order by h.thu_tu)
           from buoi_ban_qua_hs h join hoc_sinh s on s.id = h.hoc_sinh_id
           left join buoi_game_luot l on l.buoi_hoc_id = p_buoi and l.hoc_sinh_id = h.hoc_sinh_id and l.game = 'ban_qua'
           left join buoi_game_qua q on q.luot_id = l.id
           where h.buoi_hoc_id = p_buoi), '[]'::jsonb),
    'doi', coalesce((select jsonb_agg(jsonb_build_object('doi', d.doi, 'sat_thuong', d.sat_thuong, 'hang', d.hang, 'ruong', d.ruong, 'exp', d.exp) order by d.hang, d.doi)
            from buoi_ban_qua_doi d where d.buoi_hoc_id = p_buoi), '[]'::jsonb))
$$;

-- ---------- Bắn Quà: chia đội NGẪU NHIÊN (đề xuất — chưa ghi; GV sửa được rồi mới Bắt đầu) ----------
create or replace function public.fn_ban_qua_chia_doi(p_buoi uuid, p_so_doi smallint) returns jsonb
language sql volatile as $$
  with cm as (select r.hoc_sinh_id, row_number() over (order by random()) rn
              from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi and r.diem_danh = 'co_mat')
  select coalesce(jsonb_object_agg(hoc_sinh_id, ((rn - 1) % greatest(2, least(4, p_so_doi))) + 1), '{}'::jsonb) from cm
$$;

-- ---------- Bắn Quà: bắt đầu ván (snapshot giải + RÚT đạn + xáo thứ tự; bắt đầu lại GIỮ đạn cũ) ----------
create or replace function public.fn_ban_qua_bat_dau(p_buoi uuid, p_che_do text, p_so_doi smallint, p_phut smallint, p_doi jsonb) returns jsonb
language plpgsql as $$
declare v_b record; v_mon text; v_van record; x record; v_dan text[]; v_d text; k int; v_doi smallint; v_n int;
begin
  select * into v_b from buoi_hoc where id = p_buoi for update;
  if not found then raise exception 'Không thấy buổi.'; end if;
  if v_b.giai_chot_at is null then raise exception 'Chưa chốt xếp hạng buổi — chốt Nhất/Nhì trước.'; end if;
  if exists (select 1 from buoi_game_luot where buoi_hoc_id = p_buoi) then raise exception 'Buổi này đã chơi game (EXP đã ghi) — mỗi buổi 1 game.'; end if;
  if p_che_do not in ('canhan', 'doi') then raise exception 'Chế độ không hợp lệ.'; end if;
  select mon into v_mon from lop where id = v_b.lop_id;
  if v_mon is null then raise exception 'Lớp của buổi chưa có môn.'; end if;
  select count(*) into v_n from buoi_hoc_hs where buoi_hoc_id = p_buoi and diem_danh = 'co_mat';
  if v_n = 0 then raise exception 'Buổi chưa có HS có mặt.'; end if;
  if p_che_do = 'doi' then
    if p_so_doi is null or p_so_doi not between 2 and 4 then raise exception 'Số đội phải 2–4.'; end if;
    if p_phut is null or p_phut not between 1 and 10 then raise exception 'Giờ chơi 1–10 phút.'; end if;
    if v_n < p_so_doi then raise exception 'Có mặt % bạn — không chia được % đội.', v_n, p_so_doi; end if;
    for x in select r.hoc_sinh_id from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi and r.diem_danh = 'co_mat' loop
      v_doi := (p_doi ->> x.hoc_sinh_id::text)::smallint;
      if v_doi is null or v_doi not between 1 and p_so_doi then raise exception 'Còn bạn chưa được xếp đội (hoặc đội ngoài 1–%).', p_so_doi; end if;
    end loop;
    for k in 1..p_so_doi loop
      if not exists (select 1 from jsonb_each_text(p_doi) e join buoi_hoc_hs r on r.hoc_sinh_id::text = e.key and r.buoi_hoc_id = p_buoi and r.diem_danh = 'co_mat'
                     where e.value::int = k) then raise exception 'Đội % chưa có ai.', k; end if;
    end loop;
  end if;
  select * into v_van from buoi_ban_qua where buoi_hoc_id = p_buoi for update;
  if found and v_van.chot_at is not null then raise exception 'Ván Bắn Quà đã chốt kết quả.'; end if;
  if found then
    update buoi_ban_qua set che_do = p_che_do, so_doi = case when p_che_do = 'doi' then p_so_doi end,
      phut = case when p_che_do = 'doi' then p_phut end, updated_at = now() where buoi_hoc_id = p_buoi;
  else
    insert into buoi_ban_qua (buoi_hoc_id, mon, che_do, so_doi, phut)
    values (p_buoi, v_mon, p_che_do, case when p_che_do = 'doi' then p_so_doi end, case when p_che_do = 'doi' then p_phut end);
  end if;
  -- HS có mặt: đã có dòng (bắt đầu lại) ⇒ GIỮ đạn + thứ tự, chỉ cập nhật đội; mới (điểm danh muộn) ⇒ quay đạn mới, xếp cuối
  for x in select r.hoc_sinh_id, coalesce(g.giai, 3)::smallint giai, h.hoc_sinh_id da_co
           from buoi_hoc_hs r left join buoi_giai g on g.buoi_hoc_id = p_buoi and g.hoc_sinh_id = r.hoc_sinh_id
           left join buoi_ban_qua_hs h on h.buoi_hoc_id = p_buoi and h.hoc_sinh_id = r.hoc_sinh_id
           where r.buoi_hoc_id = p_buoi and r.diem_danh = 'co_mat' order by random() loop
    v_doi := case when p_che_do = 'doi' then (p_doi ->> x.hoc_sinh_id::text)::smallint end;
    if x.da_co is not null then
      update buoi_ban_qua_hs set doi = v_doi where buoi_hoc_id = p_buoi and hoc_sinh_id = x.hoc_sinh_id;
    else
      v_dan := '{}';
      for k in 1..3 loop -- rút có trọng số, không trùng (Efraimidis–Spirakis: khoá = random^(1/w), lấy lớn nhất)
        select dan into v_d from ban_qua_quay where giai = x.giai and dan <> all (v_dan) order by power(random(), 1.0 / trong_so) desc limit 1;
        v_dan := v_dan || v_d;
      end loop;
      insert into buoi_ban_qua_hs (buoi_hoc_id, hoc_sinh_id, giai, doi, dan, thu_tu)
      values (p_buoi, x.hoc_sinh_id, x.giai, v_doi, v_dan, coalesce((select max(thu_tu) from buoi_ban_qua_hs where buoi_hoc_id = p_buoi), 0) + 1);
    end if;
  end loop;
  return public.fn_ban_qua_tinh_hinh(p_buoi);
end $$;

-- ---------- Bắn Quà: CHỐT kết quả (xếp hạng + EXP + rương đội + trà sữa + sổ EXP, 1 transaction) ----------
-- p_kq = {"hs": {"<hoc_sinh_id>": điểm_bắn, ...}, "doi": {"1": sát_thương, ...}} — do TV gửi về ERP, GV xem rồi bấm Chốt.
create or replace function public.fn_ban_qua_chot(p_buoi uuid, p_kq jsonb) returns jsonb
language plpgsql as $$
declare v_b record; v_van record; x record; v_luot uuid; v_n int; v_exp int; v_top int; v_ruong text;
begin
  select * into v_b from buoi_hoc where id = p_buoi for update;
  if not found then raise exception 'Không thấy buổi.'; end if;
  select * into v_van from buoi_ban_qua where buoi_hoc_id = p_buoi for update;
  if not found then raise exception 'Buổi này chưa bắt đầu ván Bắn Quà.'; end if;
  if v_van.chot_at is not null then raise exception 'Ván này đã chốt rồi.'; end if;
  if exists (select 1 from buoi_game_luot where buoi_hoc_id = p_buoi) then raise exception 'Buổi này đã ghi EXP game — không chốt lại được.'; end if;

  -- người được tính = HS trong ván VÀ còn có mặt; điểm thiếu = 0 (hết giờ/mất lượt); kẹp 0…5000 (trần chống số bậy từ TV).
  -- (CTE, KHÔNG temp table: temp "on commit drop" sống tới hết transaction ⇒ gọi 2 lần trong 1 transaction là trùng tên.)
  select count(*) into v_n from buoi_ban_qua_hs h where h.buoi_hoc_id = p_buoi
    and exists (select 1 from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi and r.hoc_sinh_id = h.hoc_sinh_id and r.diem_danh = 'co_mat');
  if v_n = 0 then raise exception 'Không còn bạn nào có mặt trong ván.'; end if;

  if v_van.che_do = 'canhan' then
    -- hạng theo điểm; EXP vị trí = Nhất 300 → cuối 100 (bước 10); bằng điểm = TB EXP các vị trí đó
    for x in
      with bq as (select h.hoc_sinh_id, h.giai, least(5000, greatest(0, coalesce((p_kq -> 'hs' ->> h.hoc_sinh_id::text)::numeric, 0)))::int as diem
                  from buoi_ban_qua_hs h where h.buoi_hoc_id = p_buoi
                    and exists (select 1 from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi and r.hoc_sinh_id = h.hoc_sinh_id and r.diem_danh = 'co_mat')),
           xh as (select *, row_number() over (order by diem desc, hoc_sinh_id) rn from bq),
           e as (select *, case when v_n = 1 then 200 else round((300 - 200.0 * (rn - 1) / (v_n - 1)) / 10) * 10 end ev from xh)
      select hoc_sinh_id, giai, diem, (round(avg(ev) over (partition by diem) / 10) * 10)::int as exp from e
    loop
      insert into buoi_game_luot (buoi_hoc_id, hoc_sinh_id, mon, game, giai, exp, diem_game)
      values (p_buoi, x.hoc_sinh_id, v_van.mon, 'ban_qua', x.giai, x.exp, x.diem) returning id into v_luot;
      insert into gami_exp_ledger (hoc_sinh_id, source, amount, ref_buoi_hoc_id, note, mon)
      values (x.hoc_sinh_id, 'exp_tren_lop', x.exp, p_buoi, to_char(v_b.ngay, 'YYYY-MM'), v_van.mon);
      perform public._game_lop_rut_qua(v_luot, p_buoi, x.hoc_sinh_id, x.giai);
    end loop;
  else
    -- đội: sát thương gây ra; nhất (bằng nhau cùng nhất, phải > 0) ⇒ Vàng, còn lại Bạc; rút 1 lần/đội
    select max(least(100000, greatest(0, coalesce((p_kq -> 'doi' ->> d.doi::text)::numeric, 0)))::int) into v_top
      from (select distinct doi from buoi_ban_qua_hs where buoi_hoc_id = p_buoi) d;
    for x in
      with dd as (select d.doi, least(100000, greatest(0, coalesce((p_kq -> 'doi' ->> d.doi::text)::numeric, 0)))::int as st
                  from (select distinct doi from buoi_ban_qua_hs where buoi_hoc_id = p_buoi) d)
      select doi, st, rank() over (order by st desc) hang from dd order by st desc
    loop
      v_ruong := case when x.st = v_top and v_top > 0 then 'vang' else 'bac' end;
      v_exp := public._game_lop_rut_exp('ban_qua_doi', case when v_ruong = 'vang' then 1 else 2 end::smallint);
      insert into buoi_ban_qua_doi (buoi_hoc_id, doi, sat_thuong, hang, ruong, exp) values (p_buoi, x.doi, x.st, x.hang, v_ruong, v_exp);
    end loop;
    for x in select h.hoc_sinh_id, h.giai, least(5000, greatest(0, coalesce((p_kq -> 'hs' ->> h.hoc_sinh_id::text)::numeric, 0)))::int as diem, d.exp
             from buoi_ban_qua_hs h join buoi_ban_qua_doi d on d.buoi_hoc_id = p_buoi and d.doi = h.doi
             where h.buoi_hoc_id = p_buoi
               and exists (select 1 from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi and r.hoc_sinh_id = h.hoc_sinh_id and r.diem_danh = 'co_mat')
    loop
      insert into buoi_game_luot (buoi_hoc_id, hoc_sinh_id, mon, game, giai, exp, diem_game)
      values (p_buoi, x.hoc_sinh_id, v_van.mon, 'ban_qua', x.giai, x.exp, x.diem) returning id into v_luot;
      insert into gami_exp_ledger (hoc_sinh_id, source, amount, ref_buoi_hoc_id, note, mon)
      values (x.hoc_sinh_id, 'exp_tren_lop', x.exp, p_buoi, to_char(v_b.ngay, 'YYYY-MM'), v_van.mon);
      perform public._game_lop_rut_qua(v_luot, p_buoi, x.hoc_sinh_id, x.giai);
    end loop;
  end if;
  update buoi_ban_qua set chot_at = now(), updated_at = now() where buoi_hoc_id = p_buoi;
  return public.fn_ban_qua_tinh_hinh(p_buoi);
end $$;

revoke all on function public._game_lop_rut_exp(text, smallint), public._game_lop_rut_qua(uuid, uuid, uuid, smallint),
  public.fn_ban_qua_tinh_hinh(uuid), public.fn_ban_qua_chia_doi(uuid, smallint),
  public.fn_ban_qua_bat_dau(uuid, text, smallint, smallint, jsonb), public.fn_ban_qua_chot(uuid, jsonb) from public, anon;
grant execute on function public.fn_ban_qua_tinh_hinh(uuid), public.fn_ban_qua_chia_doi(uuid, smallint),
  public.fn_ban_qua_bat_dau(uuid, text, smallint, smallint, jsonb), public.fn_ban_qua_chot(uuid, jsonb) to authenticated;
-- 2 hàm nội bộ: chỉ gọi từ trong các fn_* (invoker ⇒ người gọi fn_* cần quyền execute trên hàm con)
grant execute on function public._game_lop_rut_exp(text, smallint), public._game_lop_rut_qua(uuid, uuid, uuid, smallint) to authenticated;
