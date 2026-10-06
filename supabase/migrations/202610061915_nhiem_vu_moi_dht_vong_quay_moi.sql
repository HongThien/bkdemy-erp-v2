-- ============================================================================
-- 202610061915 — nhiem_vu_moi_dht_vong_quay_moi   (áp bằng `npm run migrate`, owner claude_build)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy chốt 06/10 — spec-kinh-te-nhiem-vu.md §1–§9, DEVLOG 06/10):
--   Làm lại hệ NHIỆM VỤ theo thiết kế mới, bỏ N1–N3 / T1–T4 / M1–M2 / rương / Chặng cũ:
--     · điều kiện duy nhất = lượt LUYỆN DẠNG YẾU "đạt": lượt học thật (≥5 câu · ≥50% · ≥6 giây/câu) VÀ đúng ≥ 70% số câu (7/10);
--     · NGÀY: mỗi lượt đạt = 20 EXP + 20 ĐHT, tối đa 4 lượt/ngày;
--     · TUẦN (4 khối ngày 1–7 · 8–14 · 15–21 · 22–cuối): W1 có lượt đạt ở 5 ngày khác nhau = 100 EXP + 50 ĐHT · W2 tổng 12 lượt đạt = 100 EXP + 50 ĐHT;
--     · THÁNG: M1 có lượt đạt ở 20 ngày = 300 EXP + 200 ĐHT.
--   ĐIỂM HỌC TẬP (ĐHT): đồng tiền riêng để chơi game; kiếm = SUY từ lượt đạt (không lưu), TIÊU = bảng dht_tieu (sự kiện thật);
--     số dư = replay từng ngày (kiếm → trần 6.000 → trừ tiêu); chung mọi môn (ví game, không nhãn môn — CLAUDE §1.6).
--   TRẦN XU THEO NGUỒN (thay trần chung 30): EXP nhiệm vụ ≤ 2.000/tháng/môn (20 xu) · EXP vòng quay ≤ 1.000 (10 xu) · thành tựu không trần · huy hiệu KHÔNG thưởng.
--     Đặt TRONG fn_exp_app_thang (cộng EXP đã cắt trần rồi mới làm tròn xu MỘT lần ở fn_gami_exp_xu_thang) ⇒ KHÔNG cần sửa hàm owner postgres:
--     chỉ nâng nhiem_vu_cau_hinh.tran_xu_app lên giá trị vô hiệu (100000) để trần chung cũ không chặn nữa.
--   VÒNG QUAY: quay được khi hôm nay có ≥1 lượt đạt; 1 lượt/ngày (unique cũ giữ); bảng giải 10/20/30/50/100/200 EXP = 35/30/20/10/4/1% (EV ≈ 26,5).
--   HUY HIỆU: bỏ thưởng EXP các sao (sưu tập thuần) — hiện CHƯA có dòng hs_huy_hieu_dat nào nên không thu hồi gì.
--   Đánh dấu lượt: bai_test.luyen_yeu (true khi sinh bằng fn_tu_luyen_sinh_tu_dong = "Luyện dạng yếu"); lượt cũ không đánh dấu ⇒ không tính nhiệm vụ.
--   Không còn "chờ truyền thông": hệ nhiệm vụ cũ chưa ai dùng thật (Thùy 06/10: "đang chạy không quan tâm; thay luôn được") ⇒ THAY THẾ THÂN HÀM CŨ, không chạy song song.
--
-- MẤT GÌ (Luật xoá — liệt kê CHÍNH XÁC):
--   · Thân (logic) của 5 hàm cũ bị THAY bằng create or replace: fn_nhiem_vu_hoan_thanh · fn_nhiem_vu_chang_thang · fn_exp_app_thang · fn_hs_nhiem_vu_cua_toi ·
--     fn_may_man_hs_du_dieu_kien · fn_may_man_hs_quay (+ fn_tu_luyen_sinh_tu_dong thêm 1 dòng đánh dấu). Logic cũ vẫn còn trong lịch sử git (mig 202609281810, 202610011525).
--   · EXP nhiệm vụ cũ (N/T/M/rương/Chặng) của tháng 10 đã được suy từ hệ cũ ⇒ hết tính; vì xu quy đổi realtime nên xu nhiệm vụ tháng 10 của các em
--     đang có sẽ được máy tự ĐIỀU CHỈNH theo hệ mới (có thể giảm). Dòng stored (may_man_hs_luot, hs_huy_hieu_dat…) KHÔNG xoá/sửa.
--   · huy_hieu_thang_sao.exp → 0 (5 dòng cấu hình; trước: 0/0/100/200/300).
--   · Không drop bảng/cột nào. Cột cũ của nhiem_vu_cau_hinh (n2_cau, n3_*, t3_ngay, m2_ngay, diem_*, ruong_*, cap_*, exp_cap, moc, vq_can) để nguyên, không còn dùng.
-- ============================================================================

-- ---------- 1. Đánh dấu lượt "Luyện dạng yếu" ----------
alter table bai_test add column if not exists luyen_yeu boolean not null default false;
comment on column bai_test.luyen_yeu is 'true = lượt sinh bằng fn_tu_luyen_sinh_tu_dong (Luyện dạng yếu — server chọn dạng). Nhiệm vụ chỉ tính lượt này (Thùy 06/10). Lượt trước 06/10 = false.';

create or replace function public.fn_tu_luyen_sinh_tu_dong(p_mon text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_dangs jsonb; v_kq jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_dangs := public._tu_luyen_chon_dang(v_hs, p_mon, 10);
  if jsonb_array_length(v_dangs) = 0 then
    raise exception 'Chưa có dữ liệu học tập nào để tự luyện — học vài buổi đã rồi quay lại nhé.';
  end if;
  v_kq := public.tu_luyen_sinh(p_mon, v_dangs);
  update bai_test set luyen_yeu = true where id = (v_kq->>'bai_test_id')::uuid;
  return v_kq;
end $$;

-- ---------- 2. Cấu hình (thêm cột vào bảng cũ) ----------
alter table nhiem_vu_cau_hinh
  add column if not exists dat_ti_le numeric not null default 0.7,
  add column if not exists lan_ngay integer not null default 4,
  add column if not exists exp_luot integer not null default 20,
  add column if not exists dht_luot integer not null default 20,
  add column if not exists w1_ngay integer not null default 5,
  add column if not exists w1_exp integer not null default 100,
  add column if not exists w1_dht integer not null default 50,
  add column if not exists w2_luot integer not null default 12,
  add column if not exists w2_exp integer not null default 100,
  add column if not exists w2_dht integer not null default 50,
  add column if not exists m1_ngay integer not null default 20,
  add column if not exists m1_exp integer not null default 300,
  add column if not exists m1_dht integer not null default 200,
  add column if not exists tran_exp_nhiem_vu integer not null default 2000,
  add column if not exists tran_exp_vong_quay integer not null default 1000,
  add column if not exists dht_so_du_max integer not null default 6000;
comment on column nhiem_vu_cau_hinh.tran_xu_app is 'TRẦN CHUNG CŨ — vô hiệu từ 06/10 (=100000): trần theo nguồn nằm ở tran_exp_nhiem_vu / tran_exp_vong_quay (fn_exp_app_thang).';
update nhiem_vu_cau_hinh set tran_xu_app = 100000;
update nhiem_vu_cau_hinh set bat_dau = date '2026-10-06' where mon = 'Toán';   -- hệ mới tính từ hôm nay (lượt cũ chưa đánh dấu nên không có gì để tính lùi)

-- Bảng giải vòng quay mới
insert into may_man_hs_cau_hinh (ma, gia_tri, mo_ta) values ('nv_ti_le_10', 35, '% trúng 10 EXP (vòng quay mới, 06/10)')
  on conflict (ma) do update set gia_tri = excluded.gia_tri, mo_ta = excluded.mo_ta;
update may_man_hs_cau_hinh set gia_tri = 30 where ma = 'nv_ti_le_20';
update may_man_hs_cau_hinh set gia_tri = 20 where ma = 'nv_ti_le_30';
update may_man_hs_cau_hinh set gia_tri = 10 where ma = 'nv_ti_le_50';
update may_man_hs_cau_hinh set gia_tri = 4  where ma = 'nv_ti_le_100';
update may_man_hs_cau_hinh set gia_tri = 1  where ma = 'nv_ti_le_200';

-- Huy hiệu: sưu tập, không thưởng
update huy_hieu_thang_sao set exp = 0 where exp <> 0;

-- ---------- 3. Lượt "đạt" (nguồn duy nhất của nhiệm vụ) ----------
-- Lượt Luyện dạng yếu: học thật + đúng ≥ dat_ti_le; mỗi HS mỗi ngày chỉ tính tối đa p_lan lượt đầu.
create or replace function public._nv_luot_dat(p_mon text, p_hs uuid[], p_tu date, p_den date, p_ti_le numeric, p_lan integer)
returns table(hoc_sinh_id uuid, ngay date, nop_at timestamptz, stt integer)
language sql stable as $$
  select x.hoc_sinh_id, x.ngay, x.nop_at, x.stt from (
    select t.hoc_sinh_id, (t.nop_at at time zone 'Asia/Ho_Chi_Minh')::date as ngay, t.nop_at,
           (row_number() over (partition by t.hoc_sinh_id, (t.nop_at at time zone 'Asia/Ho_Chi_Minh')::date order by t.nop_at))::int as stt
    from public._luot_tinh(p_hs, p_tu::timestamp at time zone 'Asia/Ho_Chi_Minh', (p_den + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh') t
    join public.bai_lam bl on bl.id = t.bai_lam_id
    join public.bai_test bt on bt.id = bl.bai_test_id
    where t.mon = p_mon and t.tinh and bt.luyen_yeu and not bt.thu_thach
      and t.dung >= ceil(t.so_cau * p_ti_le)
  ) x where x.stt <= p_lan
$$;
revoke all on function public._nv_luot_dat(text, uuid[], date, date, numeric, integer) from public, anon, authenticated;

-- Nhiệm vụ đã xong trong tháng. ma/tang: N·ngay (so = số lượt tính hôm đó) · W1/W2·tuan · M1·thang (so = 1, xong_ngay = ngày đạt điều kiện)
create or replace function public.fn_nhiem_vu_hoan_thanh(p_mon text, p_ym text, p_hs uuid[] default null)
returns table(hoc_sinh_id uuid, ma text, tang text, xong_ngay date, so integer)
language plpgsql stable as $$
declare
  c record;
  v_ms date := (p_ym || '-01')::date;
  v_me date := ((p_ym || '-01')::date + interval '1 month')::date - 1;
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_den date; v_tu date; v_hs uuid[];
begin
  select * into c from nhiem_vu_cau_hinh where mon = p_mon and bat;
  if c.mon is null then return; end if;
  v_den := least(v_me, v_nay);
  if v_den < c.bat_dau or v_den < v_ms then return; end if;
  v_tu := greatest(v_ms, c.bat_dau);
  v_hs := coalesce(p_hs, (select array_agg(distinct hl.hoc_sinh_id) from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                          where hl.trang_thai = 'dang_hoc' and l.mon = p_mon));
  if v_hs is null then return; end if;
  return query
  with luot as (
    select d.hoc_sinh_id, d.ngay, d.nop_at, least(4, (extract(day from d.ngay)::int - 1) / 7 + 1) as w
    from public._nv_luot_dat(p_mon, v_hs, v_tu, v_den, c.dat_ti_le, c.lan_ngay) d
  ),
  theo_ngay as (select l.hoc_sinh_id, l.ngay, count(*)::int as n from luot l group by 1, 2),
  w1 as (   -- có lượt đạt ở w1_ngay ngày khác nhau trong tuần: xong vào ngày thứ w1_ngay
    select z.hoc_sinh_id, z.w, (array_agg(z.ngay order by z.ngay))[c.w1_ngay] as xong
    from (select distinct l.hoc_sinh_id, l.w, l.ngay from luot l) z group by 1, 2 having count(*) >= c.w1_ngay
  ),
  w2 as (   -- tổng w2_luot lượt đạt trong tuần: xong vào ngày của lượt thứ w2_luot
    select l.hoc_sinh_id, l.w, (array_agg(l.ngay order by l.nop_at))[c.w2_luot] as xong
    from luot l group by 1, 2 having count(*) >= c.w2_luot
  ),
  m1 as (
    select z.hoc_sinh_id, (array_agg(z.ngay order by z.ngay))[c.m1_ngay] as xong
    from (select distinct l.hoc_sinh_id, l.ngay from luot l) z group by 1 having count(*) >= c.m1_ngay
  )
  select t.hoc_sinh_id, 'N'::text, 'ngay'::text, t.ngay, t.n from theo_ngay t
  union all select w1.hoc_sinh_id, 'W1', 'tuan', w1.xong, 1 from w1
  union all select w2.hoc_sinh_id, 'W2', 'tuan', w2.xong, 1 from w2
  union all select m1.hoc_sinh_id, 'M1', 'thang', m1.xong, 1 from m1;
end $$;

-- ĐHT + EXP nhiệm vụ trong tháng. GIỮ chữ ký cũ để các hàm gọi nó không đổi: diem_chang = ĐHT kiếm · cap/so_ruong = 0 (bỏ Chặng, rương) · exp = EXP nhiệm vụ đã cắt trần.
create or replace function public.fn_nhiem_vu_chang_thang(p_mon text, p_ym text, p_hs uuid[] default null)
returns table(hoc_sinh_id uuid, diem_chang integer, cap integer, so_ruong integer, exp integer)
language sql stable as $$
  with c as (select * from nhiem_vu_cau_hinh where mon = p_mon and bat),
  x as (
    select h.hoc_sinh_id,
      sum(case h.ma when 'N' then h.so * c.exp_luot when 'W1' then c.w1_exp when 'W2' then c.w2_exp when 'M1' then c.m1_exp else 0 end)::int as e,
      sum(case h.ma when 'N' then h.so * c.dht_luot when 'W1' then c.w1_dht when 'W2' then c.w2_dht when 'M1' then c.m1_dht else 0 end)::int as d
    from public.fn_nhiem_vu_hoan_thanh(p_mon, p_ym, p_hs) h cross join c
    group by h.hoc_sinh_id
  )
  select x.hoc_sinh_id, x.d, 0, 0, least(c.tran_exp_nhiem_vu, x.e)::int from x cross join c
$$;

-- EXP trên app theo nguồn, MỖI NGUỒN CÓ TRẦN RIÊNG (nhiệm vụ 2.000 · vòng quay 1.000 · thành tựu/huy hiệu không trần ở đây)
create or replace function public.fn_exp_app_thang(p_ym text, p_hs uuid default null, p_mon text default null)
returns table(hoc_sinh_id uuid, mon text, exp_nhiem_vu integer, exp_may_man integer, exp_app integer, exp_thanh_tuu integer)
language plpgsql stable as $$
declare c record;
begin
  for c in select n.* from nhiem_vu_cau_hinh n where n.bat and (p_mon is null or n.mon = p_mon) loop
    return query
    with nv as (
      select n.hoc_sinh_id, n.exp from public.fn_nhiem_vu_chang_thang(c.mon, p_ym, case when p_hs is null then null else array[p_hs] end) n
    ), mm as (
      select m.hoc_sinh_id, least(c.tran_exp_vong_quay, sum(m.exp))::int as exp from may_man_hs_luot m
      where m.mon = c.mon and m.ngay >= c.bat_dau and to_char(m.ngay, 'YYYY-MM') = p_ym and (p_hs is null or m.hoc_sinh_id = p_hs)
      group by m.hoc_sinh_id
    ), tt as (   -- EXP sao huy hiệu (từ 06/10 = 0 theo cấu hình; giữ nhánh này cho thành tựu/EXP khác về sau)
      select d.hoc_sinh_id, sum(s.exp)::int as exp from hs_huy_hieu_dat d
      join huy_hieu_thang_sao s on s.mon = d.mon and s.sao = d.sao
      where d.mon = c.mon and to_char(d.dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = p_ym and (p_hs is null or d.hoc_sinh_id = p_hs)
      group by d.hoc_sinh_id
    ), ids as (select nv.hoc_sinh_id from nv union select mm.hoc_sinh_id from mm union select tt.hoc_sinh_id from tt)
    select ids.hoc_sinh_id, c.mon, coalesce(nv.exp, 0), coalesce(mm.exp, 0),
           coalesce(nv.exp, 0) + coalesce(mm.exp, 0) + coalesce(tt.exp, 0), coalesce(tt.exp, 0)
    from ids left join nv on nv.hoc_sinh_id = ids.hoc_sinh_id left join mm on mm.hoc_sinh_id = ids.hoc_sinh_id
    left join tt on tt.hoc_sinh_id = ids.hoc_sinh_id
    where coalesce(nv.exp, 0) + coalesce(mm.exp, 0) + coalesce(tt.exp, 0) > 0;
  end loop;
end $$;

-- ---------- 4. ĐIỂM HỌC TẬP ----------
create table if not exists dht_tieu (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  ngay date not null,                       -- ngày VN
  so integer not null check (so > 0),
  nguon text not null,                      -- game tiêu: 'nong_trai' · 'san_quai_vat' · …
  ma_tham_chieu text,
  tao_at timestamptz not null default now()
);
comment on table dht_tieu is 'ĐHT ĐÃ TIÊU (sự kiện thật, bất biến). ĐHT KIẾM không lưu — suy từ lượt đạt (_dht_kiem_ngay). Số dư = replay (fn_dht_so_du).';
create index if not exists dht_tieu_hs_idx on dht_tieu (hoc_sinh_id, ngay);
alter table dht_tieu enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'dht_tieu' and policyname = 'dht_tieu_member_all') then
    create policy dht_tieu_member_all on dht_tieu for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
  end if;
end $$;

-- ĐHT kiếm theo từng ngày (mọi môn đã bật nhiệm vụ)
create or replace function public._dht_kiem_ngay(p_hs uuid)
returns table(ngay date, so integer)
language plpgsql stable as $$
declare c record; v_ym text; v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  for c in select n.* from nhiem_vu_cau_hinh n where n.bat and n.bat_dau <= v_nay loop
    for v_ym in select to_char(d, 'YYYY-MM') from generate_series(date_trunc('month', c.bat_dau::timestamp), v_nay::timestamp, interval '1 month') d loop
      return query
      select h.xong_ngay, (case h.ma when 'N' then h.so * c.dht_luot when 'W1' then c.w1_dht when 'W2' then c.w2_dht when 'M1' then c.m1_dht else 0 end)::int
      from public.fn_nhiem_vu_hoan_thanh(c.mon, v_ym, array[p_hs]) h where h.hoc_sinh_id = p_hs;
    end loop;
  end loop;
end $$;
revoke all on function public._dht_kiem_ngay(uuid) from public, anon, authenticated;

-- Số dư ĐHT: replay từng ngày (+kiếm → kẹp trần → −tiêu)
create or replace function public._dht_so_du(p_hs uuid)
returns jsonb
language plpgsql stable as $$
declare
  v_max integer := coalesce((select max(dht_so_du_max) from nhiem_vu_cau_hinh where bat), 6000);
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_ym text := to_char((now() at time zone 'Asia/Ho_Chi_Minh')::date, 'YYYY-MM');
  r record; v_so integer := 0; v_tong_kiem integer := 0; v_tong_tieu integer := 0; v_mat integer := 0; v_thang_kiem integer := 0;
begin
  for r in
    with k as (select kn.ngay, sum(kn.so)::int as so from public._dht_kiem_ngay(p_hs) kn group by 1),
         t as (select d.ngay, sum(d.so)::int as so from dht_tieu d where d.hoc_sinh_id = p_hs group by 1),
         b as (select least((select min(k.ngay) from k), (select min(t.ngay) from t)) as d0)
    select g::date as ngay, coalesce(k.so, 0) as kiem, coalesce(t.so, 0) as tieu
    from b cross join lateral generate_series(b.d0::timestamp, v_nay::timestamp, interval '1 day') g
    left join k on k.ngay = g::date left join t on t.ngay = g::date
    order by 1
  loop
    v_tong_kiem := v_tong_kiem + r.kiem; v_tong_tieu := v_tong_tieu + r.tieu;
    if to_char(r.ngay, 'YYYY-MM') = v_ym then v_thang_kiem := v_thang_kiem + r.kiem; end if;
    if v_so + r.kiem > v_max then v_mat := v_mat + (v_so + r.kiem - v_max); end if;
    v_so := least(v_max, v_so + r.kiem) - r.tieu;
  end loop;
  return jsonb_build_object('so_du', v_so, 'tran', v_max, 'tong_kiem', v_tong_kiem, 'tong_tieu', v_tong_tieu, 'mat_do_vuot_tran', v_mat, 'kiem_thang', v_thang_kiem);
end $$;
revoke all on function public._dht_so_du(uuid) from public, anon, authenticated;

create or replace function public.fn_dht_cua_toi() returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then return null; end if;
  return public._dht_so_du(v_hs);
end $$;
revoke all on function public.fn_dht_cua_toi() from public, anon;
grant execute on function public.fn_dht_cua_toi() to authenticated;

-- Game TIÊU ĐHT (máy chủ kiểm số dư; client không tự trừ)
create or replace function public.fn_dht_tieu(p_so integer, p_nguon text, p_tham_chieu text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_j jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  if p_so is null or p_so <= 0 then raise exception 'Số ĐHT không hợp lệ.'; end if;
  perform pg_advisory_xact_lock(hashtext('dht:' || v_hs::text));
  v_j := public._dht_so_du(v_hs);
  if (v_j->>'so_du')::int < p_so then raise exception 'Không đủ điểm học tập (còn %, cần %).', v_j->>'so_du', p_so; end if;
  insert into dht_tieu (hoc_sinh_id, ngay, so, nguon, ma_tham_chieu)
    values (v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_so, p_nguon, p_tham_chieu);
  return public._dht_so_du(v_hs);
end $$;
revoke all on function public.fn_dht_tieu(integer, text, text) from public, anon;
grant execute on function public.fn_dht_tieu(integer, text, text) to authenticated;

-- ---------- 5. App: nhiệm vụ của em ----------
create or replace function public.fn_hs_nhiem_vu_cua_toi(p_mon text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_ym text := to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM');
  c record; ch record; v_w integer; v_j jsonb; v_dht jsonb; v_hom_nay integer;
begin
  if v_hs is null then return null; end if;
  select * into c from nhiem_vu_cau_hinh where mon = p_mon and bat;
  if c.mon is null then return null; end if;
  if v_today < c.bat_dau then return jsonb_build_object('mon', p_mon, 'mo', false, 'bat_dau', c.bat_dau); end if;
  v_w := least(4, (extract(day from v_today)::int - 1) / 7 + 1);
  select * into ch from public.fn_nhiem_vu_chang_thang(p_mon, v_ym, array[v_hs]);
  v_dht := public._dht_so_du(v_hs);
  select jsonb_build_object(
    'mon', p_mon, 'mo', true, 'ym', v_ym, 'tuan_so', v_w,
    'cau_hinh', jsonb_build_object('dat_ti_le', c.dat_ti_le, 'lan_ngay', c.lan_ngay, 'exp_luot', c.exp_luot, 'dht_luot', c.dht_luot,
                 'w1_ngay', c.w1_ngay, 'w1_exp', c.w1_exp, 'w1_dht', c.w1_dht, 'w2_luot', c.w2_luot, 'w2_exp', c.w2_exp, 'w2_dht', c.w2_dht,
                 'm1_ngay', c.m1_ngay, 'm1_exp', c.m1_exp, 'm1_dht', c.m1_dht, 'tran_exp', c.tran_exp_nhiem_vu, 'dht_so_du_max', c.dht_so_du_max),
    'ngay', jsonb_build_object(
        'luot_hom_nay', coalesce(sum(nv.so) filter (where nv.ma = 'N' and nv.xong_ngay = v_today), 0),
        'con_lai', c.lan_ngay - coalesce(sum(nv.so) filter (where nv.ma = 'N' and nv.xong_ngay = v_today), 0),
        'luot_thang', coalesce(sum(nv.so) filter (where nv.ma = 'N'), 0)),
    'tuan', jsonb_build_object(
        'ngay_co_luot', count(*) filter (where nv.ma = 'N' and least(4, (extract(day from nv.xong_ngay)::int - 1) / 7 + 1) = v_w),
        'luot', coalesce(sum(nv.so) filter (where nv.ma = 'N' and least(4, (extract(day from nv.xong_ngay)::int - 1) / 7 + 1) = v_w), 0),
        'w1_xong', coalesce(bool_or(nv.ma = 'W1' and least(4, (extract(day from nv.xong_ngay)::int - 1) / 7 + 1) = v_w), false),
        'w2_xong', coalesce(bool_or(nv.ma = 'W2' and least(4, (extract(day from nv.xong_ngay)::int - 1) / 7 + 1) = v_w), false)),
    'thang', jsonb_build_object(
        'ngay_co_luot', count(*) filter (where nv.ma = 'N'),
        'm1_xong', coalesce(bool_or(nv.ma = 'M1'), false)),
    'exp_thang', coalesce(ch.exp, 0), 'dht_thang', coalesce(ch.diem_chang, 0),
    'dht', v_dht
  ) into v_j
  from public.fn_nhiem_vu_hoan_thanh(p_mon, v_ym, array[v_hs]) nv;
  -- vòng quay hôm nay
  v_hom_nay := coalesce((v_j->'ngay'->>'luot_hom_nay')::int, 0);
  return v_j || jsonb_build_object('vong_quay', jsonb_build_object(
    'du', v_hom_nay >= 1, 'da_quay', exists (select 1 from may_man_hs_luot where hoc_sinh_id = v_hs and ngay = v_today)));
end $$;

-- ---------- 6. Vòng quay ----------
create or replace function public.fn_may_man_hs_du_dieu_kien(p_hs uuid default null) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_me uuid := coalesce(p_hs, public.my_hoc_sinh_id());
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_nguong numeric; v_row record; c record; v_so integer; v_max integer := 0; v_co_nv boolean := false;
begin
  if v_me is null then return jsonb_build_object('du', false); end if;
  -- LUẬT MỚI (06/10): hôm nay có ≥ 1 lượt Luyện dạng yếu đạt (ở môn đã bật nhiệm vụ) ⇒ được quay 1 lượt
  for c in select n.* from nhiem_vu_cau_hinh n
           where n.bat and n.bat_dau <= v_today
             and exists (select 1 from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                         where hl.hoc_sinh_id = v_me and hl.trang_thai = 'dang_hoc' and l.mon = n.mon)
           order by n.mon loop
    v_co_nv := true;
    select coalesce(sum(h.so), 0)::int into v_so from public.fn_nhiem_vu_hoan_thanh(c.mon, to_char(v_today, 'YYYY-MM'), array[v_me]) h
      where h.ma = 'N' and h.xong_ngay = v_today;
    if v_so >= 1 then
      return jsonb_build_object('du', true, 'che_do', 'nhiem_vu', 'mon', c.mon, 'so_nv', v_so, 'can', 1);
    end if;
    v_max := greatest(v_max, v_so);
  end loop;
  if v_co_nv then return jsonb_build_object('du', false, 'che_do', 'nhiem_vu', 'so_nv', v_max, 'can', 1); end if;
  -- LUẬT CŨ (em không học môn nào đã bật nhiệm vụ) — giữ nguyên
  select gia_tri into v_nguong from may_man_hs_cau_hinh where ma = 'nguong_dung_pct';
  v_nguong := coalesce(v_nguong, 70);
  select bl.id as bai_lam_id, bt.mon,
         (select count(*) from bai_lam_cau blc where blc.bai_lam_id = bl.id and blc.verdict = 'correct')::int as so_dung, bt.so_cau
    into v_row
    from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id
    where bl.hoc_sinh_id = v_me and bt.loai = 'tu_luyen' and bl.trang_thai = 'da_nop' and bt.ngay = v_today and bt.so_cau > 0
      and (select count(*) from bai_lam_cau blc2 where blc2.bai_lam_id = bl.id and blc2.verdict = 'correct')::numeric * 100.0 >= v_nguong * bt.so_cau
    order by bl.nop_at asc nulls last, bl.bat_dau_at asc
    limit 1;
  if v_row.bai_lam_id is null then return jsonb_build_object('du', false, 'nguong_pct', v_nguong); end if;
  return jsonb_build_object('du', true, 'nguong_pct', v_nguong, 'bai_lam_id', v_row.bai_lam_id, 'mon', v_row.mon, 'so_dung', v_row.so_dung, 'so_cau', v_row.so_cau);
end $$;

create or replace function public.fn_may_man_hs_quay() returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_active numeric;
  p50 numeric; p100 numeric; p150 numeric; p200 numeric;
  q10 numeric; q20 numeric; q30 numeric; q50 numeric; q100 numeric; q200 numeric;
  v_dk jsonb; v_bl_id uuid; v_mon text; v_rnd numeric; v_exp integer;
  l may_man_hs_luot;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;
  perform pg_advisory_xact_lock(hashtext('maymai_hs:' || v_me::text));
  select gia_tri into v_active from may_man_hs_cau_hinh where ma = 'active';
  if coalesce(v_active, 0) <> 1 then raise exception 'Vòng quay đang tạm đóng.'; end if;
  if exists (select 1 from may_man_hs_luot where hoc_sinh_id = v_me and ngay = v_today) then
    raise exception 'Hôm nay em đã quay rồi — mai quay tiếp nhé!'; end if;
  v_dk := public.fn_may_man_hs_du_dieu_kien(v_me);
  if not coalesce((v_dk->>'du')::boolean, false) then
    if v_dk->>'che_do' = 'nhiem_vu' then
      raise exception 'Hoàn thành 1 lượt Luyện dạng yếu đạt hôm nay để được quay.';
    end if;
    raise exception 'Can lam 1 luot tu luyen 10 cau dung >= % phan tram de quay.', coalesce((v_dk->>'nguong_pct')::int, 70);
  end if;
  v_bl_id := (v_dk->>'bai_lam_id')::uuid;
  v_mon := v_dk->>'mon';
  v_rnd := random() * 100;
  if v_dk->>'che_do' = 'nhiem_vu' then
    select gia_tri into q10  from may_man_hs_cau_hinh where ma = 'nv_ti_le_10';
    select gia_tri into q20  from may_man_hs_cau_hinh where ma = 'nv_ti_le_20';
    select gia_tri into q30  from may_man_hs_cau_hinh where ma = 'nv_ti_le_30';
    select gia_tri into q50  from may_man_hs_cau_hinh where ma = 'nv_ti_le_50';
    select gia_tri into q100 from may_man_hs_cau_hinh where ma = 'nv_ti_le_100';
    select gia_tri into q200 from may_man_hs_cau_hinh where ma = 'nv_ti_le_200';
    -- giải hiếm xét trước; phần còn lại → 10
    v_exp := case
      when v_rnd < q200                                  then 200
      when v_rnd < q200 + q100                           then 100
      when v_rnd < q200 + q100 + q50                     then 50
      when v_rnd < q200 + q100 + q50 + q30               then 30
      when v_rnd < q200 + q100 + q50 + q30 + q20         then 20
      else                                                    10
    end;
  else
    select gia_tri into p50  from may_man_hs_cau_hinh where ma = 'ti_le_50';
    select gia_tri into p100 from may_man_hs_cau_hinh where ma = 'ti_le_100';
    select gia_tri into p150 from may_man_hs_cau_hinh where ma = 'ti_le_150';
    select gia_tri into p200 from may_man_hs_cau_hinh where ma = 'ti_le_200';
    v_exp := case
      when v_rnd < p200                       then 200
      when v_rnd < p200 + p150                then 150
      when v_rnd < p200 + p150 + p100         then 100
      else                                          50
    end;
  end if;
  insert into may_man_hs_luot (hoc_sinh_id, ngay, exp, rnd, mon, bai_lam_id)
    values (v_me, v_today, v_exp, v_rnd, v_mon, v_bl_id)
    returning * into l;
  return jsonb_build_object('id', l.id, 'ngay', l.ngay, 'exp', l.exp, 'mon', l.mon);
end $$;
