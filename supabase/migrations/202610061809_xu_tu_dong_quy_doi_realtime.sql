-- ============================================================================
-- 202610061809 — xu_tu_dong_quy_doi_realtime   (áp bằng `npm run migrate`, owner claude_build)
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   Thùy 06/10: "Hệ thống xu của HS: giờ không chốt theo tháng nữa mà tính realtime từng ngày và hiện
--   trên app luôn." Trước đây EXP tích cả tháng, admin bấm "Chốt xu" (ChotXuScreen) thì xu mới vào ví;
--   phần quy đổi chênh lệch còn tính ở CLIENT rồi ghi DB (vi phạm §2.0).
--   Thùy chốt kèm (06/10): (1) tự động TỪ THÁNG 9/2026 — máy chốt nốt ~290 cặp HS×môn tháng 9 còn lại và
--   tự điều chỉnh ± 79 cặp đã chốt tay; tháng 8 giữ nguyên (đóng băng). (2) EXP giảm (phạt BTVN tháng,
--   sửa điểm) ⇒ TRỪ THẬT, ví được âm.
--
-- CÁCH LÀM — sổ xu vẫn là nguồn tiền duy nhất (tủ quà, app Hải, trợ lý đọc qlht_v_so_du_xu không đổi gì):
--   `_xu_dong_bo` = đúng việc của nút "Chốt" cũ nhưng ở DB: với mỗi (HS × môn × tháng) trong cửa sổ,
--   đích = fn_gami_exp_xu_thang (công thức DUY NHẤT, giữ cả trần xu app), đã phát = Σ chot_thang+chot_lai,
--   chênh ≠ 0 ⇒ ghi 1 dòng (chưa có gốc → 'chot_thang', có rồi → 'chot_lai'). Chạy lại khi EXP không đổi = 0 dòng.
--   Cửa sổ mặc định = tháng trước + tháng này (giờ VN), không sớm hơn 2026-09. Tháng cũ hơn chỉ đồng bộ
--   khi nhân sự gọi tường minh fn_xu_dong_bo(…, 'YYYY-MM') từ màn Chốt xu.
--   Gọi ở 3 chỗ: HS mở Ví xu (fn_xu_dong_bo_cua_toi) · tủ quà chọn HS / admin bấm (fn_xu_dong_bo) ·
--   pg_cron mỗi giờ cho mọi HS (file SQL Editor đi kèm: 202610061810_xu_dong_bo_cron_sql_editor.sql).
--   Khoá ví = `hoc_sinh FOR UPDATE`, ĐÚNG quy ước fn_tuqua_doi ⇒ 2 lượt đồng bộ chạy cùng lúc, hoặc đồng bộ
--   chen giữa lúc đổi quà, không thể cùng đọc "đã phát" rồi cùng ghi chênh (cộng đôi). Tính đích TRƯỚC khi
--   khoá (nặng ~3s/tháng toàn trung tâm, chỉ phụ thuộc EXP) nên ví chỉ bị khoá trong tích tắc.
--   nguoi_tao: dòng do MÁY tự quy đổi (HS mở ví / cron) không có người thao tác ⇒ NULL = "không áp dụng"
--   (§1.5); CHECK mới chỉ cho NULL ở 2 loại quy đổi, mọi loại khác vẫn bắt buộc có người.
--   Ví HS: dòng quy đổi gộp 1 dòng / môn / tháng theo cột `thang` (không theo ngày ghi) — đồng bộ nhiều lần
--   trong ngày không làm ví rối, xu tháng 9 ghi vào tháng 10 vẫn hiện ở tháng 9.
--
-- ⚠ CẦN THÙY CHẠY SQL EDITOR (file 202610061810_…): grant execute fn_gami_exp_xu_thang cho claude_build
--   (hàm owner postgres, đã revoke PUBLIC 28/09) + bật pg_cron + lịch mỗi giờ. Chưa chạy thì đồng bộ báo
--   lỗi quyền — client bắt lỗi, ví vẫn hiện số dư sổ như cũ.
--
-- MẤT GÌ (Luật xoá): Không xoá dòng/cột nào. Nới `qlht_xu_ledger.nguoi_tao` NOT NULL → CHECK hẹp hơn
--   (chỉ chot_thang/chot_lai được trống). fn_hs_vi_xu_cua_toi: create or replace cùng chữ ký.
-- ============================================================================

alter table public.qlht_xu_ledger alter column nguoi_tao drop not null;
alter table public.qlht_xu_ledger add constraint qlht_xu_ledger_nguoi_tao_may
  check (nguoi_tao is not null or loai in ('chot_thang', 'chot_lai'));

-- ── LÕI: đồng bộ sổ xu theo EXP (không kiểm quyền — chỉ gọi qua 2 cửa bên dưới hoặc pg_cron) ──
create or replace function public._xu_dong_bo(p_hs uuid default null, p_thang text[] default null, p_nguoi uuid default null)
returns table(so_dong integer, tong_xu integer)
language plpgsql volatile security definer set search_path = public
as $$
declare
  c_tu constant text := '2026-09';   -- tháng đầu quy đổi TỰ ĐỘNG (Thùy 06/10); tháng 8 đã chốt tay, đóng băng
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_cac text[];
  v_dich jsonb;
begin
  v_cac := coalesce(p_thang, array(
    select t from unnest(array[to_char(v_nay - interval '1 month', 'YYYY-MM'), to_char(v_nay, 'YYYY-MM')]) t
    where t >= c_tu));
  if exists (select 1 from unnest(v_cac) t where t !~ '^\d{4}-(0[1-9]|1[0-2])$') then
    raise exception 'Tháng không hợp lệ: %', v_cac;
  end if;
  if cardinality(v_cac) = 0 then so_dong := 0; tong_xu := 0; return next; return; end if;

  -- ① Đích (xu theo EXP tới giờ) — tính TRƯỚC khi khoá ví.
  select coalesce(jsonb_agg(jsonb_build_object('hs', f.hoc_sinh_id, 'mon', f.mon, 'thang', t.ym, 'exp', f.exp, 'xu', f.xu)), '[]'::jsonb)
    into v_dich
  from unnest(v_cac) t(ym)
  cross join lateral public.fn_gami_exp_xu_thang(t.ym, p_hs, null) f
  where f.hoc_sinh_id is not null;

  -- ② Khoá ví (thứ tự id — cùng quy ước fn_tuqua_doi). Gồm cả HS đã được phát mà nay EXP về 0 (trừ thật).
  perform 1 from public.hoc_sinh h
  where h.id in (
    select (e->>'hs')::uuid from jsonb_array_elements(v_dich) e
    union
    select x.hoc_sinh_id from public.qlht_xu_ledger x
    where x.loai in ('chot_thang', 'chot_lai') and x.thang = any(v_cac) and (p_hs is null or x.hoc_sinh_id = p_hs)
  )
  order by h.id
  for update;

  -- ③ Ghi chênh = đích − đã phát (đọc "đã phát" SAU khi khoá). SELECT … INTO (không RETURN QUERY bọc INSERT).
  with d as (
    select * from jsonb_to_recordset(v_dich) as d(hs uuid, mon text, thang text, exp integer, xu integer)
  ), da as (
    select x.hoc_sinh_id as hs, coalesce(x.mon, '') as mon, x.thang,
           sum(x.amount)::integer as xu, bool_or(x.loai = 'chot_thang') as co_goc
    from public.qlht_xu_ledger x
    where x.loai in ('chot_thang', 'chot_lai') and x.thang = any(v_cac) and (p_hs is null or x.hoc_sinh_id = p_hs)
    group by 1, 2, 3
  ), lech as (
    select coalesce(d.hs, da.hs) as hs, coalesce(d.mon, da.mon) as mon, coalesce(d.thang, da.thang) as thang,
           coalesce(d.exp, 0) as exp, coalesce(d.xu, 0) - coalesce(da.xu, 0) as chenh, coalesce(da.co_goc, false) as co_goc
    from d full join da on da.hs = d.hs and da.mon = d.mon and da.thang = d.thang
  ), ghi as (
    insert into public.qlht_xu_ledger (hoc_sinh_id, amount, loai, mon, thang, exp_snapshot, ly_do, nguoi_tao)
    select l.hs, l.chenh, case when l.co_goc then 'chot_lai' else 'chot_thang' end, l.mon, l.thang, l.exp,
           format('Quy đổi xu tháng %s · %s · %s EXP', l.thang, coalesce(nullif(l.mon, ''), '?'), l.exp), p_nguoi
    from lech l
    where l.chenh <> 0
    returning amount
  )
  select count(*)::integer, coalesce(sum(g.amount), 0)::integer into so_dong, tong_xu from ghi g;
  return next;
end $$;

-- ── CỬA NHÂN SỰ: tủ quà chọn HS · màn Chốt xu (đồng bộ ngay / tháng cũ tường minh) ──
create or replace function public.fn_xu_dong_bo(p_hoc_sinh_id uuid default null, p_thang text default null)
returns table(so_dong integer, tong_xu integer)
language plpgsql volatile security definer set search_path = public
as $$
declare v_ns uuid := public.current_nhan_su_id();
begin
  if v_ns is null then raise exception 'Chỉ nhân sự được đồng bộ xu.'; end if;
  select k.so_dong, k.tong_xu into so_dong, tong_xu
  from public._xu_dong_bo(p_hoc_sinh_id, case when p_thang is null then null else array[p_thang] end, v_ns) k;
  return next;
end $$;

-- ── CỬA HỌC SINH: mở Ví xu ⇒ xu của chính em cập nhật ngay ──
create or replace function public.fn_xu_dong_bo_cua_toi()
returns table(so_dong integer, tong_xu integer)
language plpgsql volatile security definer set search_path = public
as $$
declare v_me uuid := public.my_hoc_sinh_id();
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;
  select k.so_dong, k.tong_xu into so_dong, tong_xu from public._xu_dong_bo(v_me, null, null) k;
  return next;
end $$;

revoke all on function public._xu_dong_bo(uuid, text[], uuid) from public, anon, authenticated;
grant execute on function public._xu_dong_bo(uuid, text[], uuid) to postgres;   -- pg_cron chạy dưới postgres
revoke all on function public.fn_xu_dong_bo(uuid, text) from public, anon;
grant execute on function public.fn_xu_dong_bo(uuid, text) to authenticated;
revoke all on function public.fn_xu_dong_bo_cua_toi() from public, anon;
grant execute on function public.fn_xu_dong_bo_cua_toi() to authenticated;

-- ── VÍ HS: dòng quy đổi gộp theo (môn × tháng của EXP), phần còn lại giữ nguyên bản 202610011601 ──
create or replace function public.fn_hs_vi_xu_cua_toi(p_ym text default null)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_ym text := coalesce(p_ym, to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'));
  v_so_du integer;
  v_mua jsonb;
  v_hoat_dong jsonb;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;

  select coalesce(sum(amount), 0)::int into v_so_du
  from qlht_xu_ledger where hoc_sinh_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'ten_qua', q.ten, 'anh_url', q.anh_url, 'so_luong', d.so_luong,
    'xu_tru', d.xu_tru, 'trang_thai', d.trang_thai, 'created_at', d.created_at, 'giao_luc', d.giao_luc
  ) order by d.created_at desc), '[]'::jsonb) into v_mua
  from (
    select * from qlht_doi_qua where hoc_sinh_id = v_me order by created_at desc limit 30
  ) d
  join qlht_qua q on q.id = d.qua_id;

  with cua_so as (
    select ((v_ym || '-01')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as tu,
           (((v_ym || '-01')::date + interval '1 month')::timestamp) at time zone 'Asia/Ho_Chi_Minh' as den
  ),
  dong as (
    select jsonb_build_object('loai', 'exp', 'nguon', l.source, 'mon', l.mon, 'so', l.amount,
             'created_at', l.created_at, 'ngay', b.ngay, 'lop', lp.ten_lop) as x, l.created_at as t
    from gami_exp_ledger l
    cross join cua_so w
    left join buoi_hoc b on b.id = l.ref_buoi_hoc_id
    left join lop lp on lp.id = b.lop_id
    where l.hoc_sinh_id = v_me and (
      -- exp_thang = nguồn gộp cũ (trước khi tách ET/BTVN), vẫn có `note` đúng tháng — vá bug 27/09.
      (l.source in ('exp_et', 'exp_btvn', 'exp_btvn_thang', 'exp_tren_lop', 'exp_thang') and l.note = v_ym)
      -- attend_floor + 3 nguồn legacy một-lần (rank_et/rank_ingame/btvn) đều KHÔNG có `note` → lọc theo ngày.
      or (l.source in ('attend_floor', 'rank_et', 'rank_ingame', 'btvn') and l.created_at >= w.tu and l.created_at < w.den)
    )
    union all
    select jsonb_build_object('loai', 'may_man', 'nguon', 'may_man', 'mon', m.mon, 'so', m.exp,
             'created_at', m.created_at, 'ngay', m.ngay, 'lop', null), m.created_at
    from may_man_hs_luot m
    where m.hoc_sinh_id = v_me and to_char(m.ngay, 'YYYY-MM') = v_ym
    union all
    -- Quy đổi EXP→xu (Thùy 06/10: tự động, nhiều lần/ngày): GỘP 1 dòng / môn theo `thang` của EXP.
    select jsonb_build_object('loai', 'xu', 'nguon', 'chot_thang', 'mon', nullif(x.mon, ''), 'so', sum(x.amount)::int,
             'created_at', max(x.created_at), 'ngay', null, 'lop', null), max(x.created_at)
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me and x.loai in ('chot_thang', 'chot_lai') and x.thang = v_ym
    group by x.mon
    having sum(x.amount) <> 0
    union all
    -- Cộng/trừ TAY — doi_qua/hoan là giao dịch mua, đã hiện ở lich_su_mua (Thùy 23/09).
    select jsonb_build_object('loai', 'xu', 'nguon', x.loai, 'mon', x.mon, 'so', x.amount,
             'created_at', x.created_at, 'ngay', null, 'lop', null), x.created_at
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me
      and x.loai in ('cong_tay', 'tru_tay')
      and to_char(x.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
    union all
    -- EXP nhiệm vụ (Chặng + mốc + rương tuần): gộp theo THÁNG, mỗi môn đang bật. Nguồn số = fn_nhiem_vu_chang_thang (cùng nguồn đổi xu).
    select jsonb_build_object('loai', 'exp', 'nguon', 'exp_nhiem_vu', 'mon', c.mon, 'so', n.exp,
             'created_at', k.t, 'ngay', null, 'lop', null, 'cap', n.cap, 'so_ruong', n.so_ruong), k.t
    from nhiem_vu_cau_hinh c
    cross join lateral public.fn_nhiem_vu_chang_thang(c.mon, v_ym, array[v_me]) n
    cross join lateral (select least(now(), (((v_ym || '-01')::date + interval '1 month')::timestamp at time zone 'Asia/Ho_Chi_Minh') - interval '1 second') as t) k
    where c.bat and n.exp > 0
    union all
    -- EXP huy hiệu: mỗi huy hiệu đạt trong tháng (tính vào tháng ĐẠT, giờ VN — như fn_exp_app_thang).
    select jsonb_build_object('loai', 'exp', 'nguon', 'exp_huy_hieu', 'mon', h.mon, 'so', s.exp,
             'created_at', h.dat_at, 'ngay', (h.dat_at at time zone 'Asia/Ho_Chi_Minh')::date, 'lop', null, 'sao', h.sao, 'ten', hh.ten), h.dat_at
    from hs_huy_hieu_dat h
    join huy_hieu_thang_sao s on s.mon = h.mon and s.sao = h.sao
    left join huy_hieu hh on hh.mon = h.mon and hh.key = h.huy_hieu_key
    where h.hoc_sinh_id = v_me and s.exp > 0
      and to_char(h.dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
  )
  select coalesce(jsonb_agg(x order by t desc), '[]'::jsonb) into v_hoat_dong from dong;

  return jsonb_build_object('ym', v_ym, 'so_du', v_so_du, 'lich_su_mua', v_mua, 'hoat_dong', v_hoat_dong);
end $$;
