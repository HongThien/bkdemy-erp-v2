-- ============================================================================
-- 202609030307 — bo_tro_yeu_ca  (PLAN-botro-yeu-ca.md — Thùy duyệt 03/09/2026)
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Ca bổ trợ yếu chạy trên 2 máy: iPad EM (tài khoản em, app hs) LUYỆN theo cụm + làm TEST cuối ca;
--   máy TA (tài khoản TA, app ta) điểm danh · đóng ca · nhận xét. Chân lý ở Postgres, 2 app chỉ gọi hàm
--   (CLAUDE.md §2.0). Tái dùng NGUYÊN bộ bài cá nhân của tự luyện (bai_test/bai_lam/bai_lam_cau) — chỉ
--   thêm 3 giá trị `loai`, cột `bai_test.buoi_hoc_id` (bài thuộc CA nào) và `bai_test_cau.ma_cum`
--   (snapshot cụm của câu — test cuối ca gồm nhiều cụm nên phải ở tầng câu).
--   Retest 2 tầng (Thùy 03/09): tầng 1 = test cuối ca (`bo_tro_test`, nguồn đo `bt`, KHÔNG đóng dạng);
--   tầng 2 = bài `retest` sinh NGAY LÚC ĐÓNG CA, ngày = buổi thường kế tiếp theo TKB, em làm sau ET
--   buổi đó → trigger ghi retest_diem/dat/dong_at lên từng dạng (nguồn 'rieng').
--   Drift: `bo_tro_yeu_dang.retest_nguon` DB thật CHECK ('et','mt','rieng') còn file 202607241948 ghi
--   ('bt','et','mt') — ghi lại đúng DB ở đây để repo = DB.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất dữ liệu. drop/create lại 2 policy đọc của HS (nới, không siết) · drop/add 2 CHECK (nới
--   bai_test.loai; retest_nguon ghi ĐÚNG giá trị DB đang có) · create or replace 4 hàm cũ (et_de,
--   fn_mastery_cells, hs_dang_evals giữ nguyên hành vi cũ + thêm nhánh nguồn 'bt' cho bài ca).
-- ============================================================================

-- ── 1) bai_test: loại bài mới + bài thuộc ca nào ─────────────────────────────
alter table bai_test drop constraint if exists bai_test_loai_check;
alter table bai_test add constraint bai_test_loai_check
  check (loai in ('et', 'btvn', 'giao_trinh', 'de_thi', 'tu_luyen', 'bo_tro', 'bo_tro_test', 'retest'));

alter table bai_test add column if not exists buoi_hoc_id uuid references buoi_hoc(id);
create index if not exists bai_test_buoi_hoc_idx on bai_test (buoi_hoc_id) where buoi_hoc_id is not null;
comment on column bai_test.buoi_hoc_id is
  'Bài thuộc CA BỔ TRỢ YẾU nào (loai bo_tro/bo_tro_test/retest). ⚠ Với retest: `ngay` = ngày LÀM (buổi thường kế tiếp) còn cột này = ca bổ trợ NGUỒN — cố ý (PLAN-botro-yeu-ca §4). Tự luyện/ET/BTVN: null.';

alter table bai_test_cau add column if not exists ma_cum text;
comment on column bai_test_cau.ma_cum is
  'Snapshot cụm bài của câu lúc sinh (dai/khtn/hgt_cum_bai.ma_cum — text, không FK vì 3 bảng theo môn, cùng lý do ma_dang). null = câu không thuộc cụm nào (dạng chưa gắn cụm = cả dạng là 1 cụm).';

-- ── 2) RLS: HS đọc BÀI CỦA MÌNH (không dựa vào mánh lop_id nữa). Bài THI (et/bo_tro_test/retest)
--    vẫn giấu câu — HS lấy đề qua et_de (đã lọc key).
drop policy if exists bai_test_hs_read on bai_test;
create policy bai_test_hs_read on bai_test for select to authenticated
  using (public.hs_o_lop(lop_id) or hoc_sinh_id = public.my_hoc_sinh_id());

drop policy if exists bai_test_cau_hs_read on bai_test_cau;
create policy bai_test_cau_hs_read on bai_test_cau for select to authenticated
  using (exists (
    select 1 from bai_test bt
    where bt.id = bai_test_id
      and bt.loai not in ('et', 'bo_tro_test', 'retest')
      and (public.hs_o_lop(bt.lop_id) or bt.hoc_sinh_id = public.my_hoc_sinh_id())
  ));

-- ── 3) retest_nguon: repo = DB ────────────────────────────────────────────────
alter table bo_tro_yeu_dang drop constraint if exists bo_tro_yeu_dang_retest_nguon_ck;
alter table bo_tro_yeu_dang add constraint bo_tro_yeu_dang_retest_nguon_ck
  check (retest_nguon is null or retest_nguon in ('et', 'mt', 'rieng'));
comment on column bo_tro_yeu_dang.retest_nguon is
  '''rieng'' = bài retest riêng làm ngay sau ET buổi thường kế tiếp (tầng 2, Thùy 03/09) · ''et''/''mt'' = đo lại bằng bài giám sát độc lập. Test CUỐI CA (tầng 1) KHÔNG ghi vào đây — nó là bai_test loai=bo_tro_test.';

-- ── 4) Helper ─────────────────────────────────────────────────────────────────
-- nhan_su.id của người đang gọi (tai_khoan.nhan_su_id). null = không phải nhân sự.
create or replace function public._btyeu_my_ns() returns uuid
language sql stable security definer set search_path = public as $$
  select nhan_su_id from tai_khoan where id = public.jwt_uid() and nhan_su_id is not null;
$$;
revoke all on function public._btyeu_my_ns() from public;
grant execute on function public._btyeu_my_ns() to authenticated;

create or replace function public._kho_cum_tbl(p_cautbl text) returns text
language sql immutable as $$ select replace(p_cautbl, '_cau_hoi', '_cum_bai') $$;

-- Hôm nay giờ VN (dùng thống nhất trong file).
create or replace function public._btyeu_today() returns date
language sql stable as $$ select (now() at time zone 'Asia/Ho_Chi_Minh')::date $$;

-- Snapshot 1 câu kho → bai_test_cau (CÙNG mapping dap_an_key với tu_luyen_sinh — 1 nguồn, tu_luyen_sinh
-- sẽ chuyển sang gọi hàm này ở lượt dọn sau, không đụng trong migration này để không đổi hành vi tự luyện).
create or replace function public._kho_snapshot_cau(
  p_bt_id uuid, p_cautbl text, p_lttbl text, p_ma_cau text, p_thu_tu integer, p_ma_cum text default null)
returns void language plpgsql security definer set search_path = public as $$
declare v_row record; v_ly_thuyet text;
begin
  execute format($q$select * from %1$I where ma_cau = $1$q$, p_cautbl) into v_row using p_ma_cau;
  if v_row.ma_cau is null then raise exception 'Câu % không có trong %', p_ma_cau, p_cautbl; end if;
  execute format($q$select noi_dung from %1$I where ma_dang = $1$q$, p_lttbl) into v_ly_thuyet using v_row.dang_chinh;
  insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
    menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum)
  values (
    p_bt_id, p_thu_tu, 1, v_row.ma_cau, v_row.loai_cau, v_row.noi_dung, v_row.lua_chon, v_row.menh_de,
    case v_row.loai_cau
      when 'trac_nghiem' then to_jsonb(upper(trim(v_row.dap_an)))
      when 'tra_loi_ngan' then to_jsonb(trim(v_row.dap_an))
      when 'dung_sai' then (select jsonb_agg(case when upper(left(trim(m->>'dap_an'), 1)) = 'S' then 'S' else 'D' end)
                             from jsonb_array_elements(coalesce(v_row.menh_de, '[]'::jsonb)) m)
      else to_jsonb(v_row.dap_an)
    end,
    v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
    coalesce(p_ma_cum, v_row.ma_cum)
  );
end $$;

-- Chọn N câu (ma_cau) trong dạng [+ cụm] hỗ trợ chấm online, tránh p_tru; thiếu thì CHẤP NHẬN LẶP
-- (CEO chốt cho tự luyện — chỉ né trùng trong chính lô). Trả mảng, có thể ngắn hơn N nếu kho cạn hẳn.
create or replace function public._btyeu_chon_cau(
  p_cautbl text, p_ma_dang text, p_ma_cum text, p_tru text[], p_n integer)
returns text[] language plpgsql security definer set search_path = public as $$
declare v_out text[] := '{}'; v_more text[];
begin
  execute format($q$
    select coalesce(array_agg(ma_cau), '{}') from (
      select ma_cau from %1$I
      where dang_chinh = $1 and xoa_at is null
        and ($2::text is null or ma_cum = $2)
        and ((loai_cau in ('trac_nghiem','tra_loi_ngan') and dap_an is not null)
             or (loai_cau = 'dung_sai' and jsonb_array_length(coalesce(menh_de,'[]'::jsonb)) >= 2))
        and ma_cau <> all($3)
      order by random() limit $4) s
  $q$, p_cautbl) into v_out using p_ma_dang, p_ma_cum, p_tru, p_n;
  if coalesce(array_length(v_out, 1), 0) < p_n then
    execute format($q$
      select coalesce(array_agg(ma_cau), '{}') from (
        select ma_cau from %1$I
        where dang_chinh = $1 and xoa_at is null
          and ($2::text is null or ma_cum = $2)
          and ((loai_cau in ('trac_nghiem','tra_loi_ngan') and dap_an is not null)
               or (loai_cau = 'dung_sai' and jsonb_array_length(coalesce(menh_de,'[]'::jsonb)) >= 2))
          and ma_cau <> all($3)
        order by random() limit $4) s
    $q$, p_cautbl) into v_more using p_ma_dang, p_ma_cum, v_out, p_n - coalesce(array_length(v_out, 1), 0);
    v_out := v_out || v_more;
  end if;
  return v_out;
end $$;

-- Buổi bổ trợ yếu + em + case — dùng chung cho mọi hàm dưới (1 dòng/buổi vì 1 buổi = 1 HS).
create or replace function public._btyeu_buoi(p_buoi uuid)
returns table (buoi_id uuid, hoc_sinh_id uuid, bo_tro_yeu_id uuid, mon text, ngay date, trang_thai text,
               diem_danh text, nguoi_day_tg uuid, danh_gia_xong_at timestamptz, buoi_hoc_hs_id uuid)
language sql stable security definer set search_path = public as $$
  select b.id, hh.hoc_sinh_id, hh.bo_tro_yeu_id, y.mon, b.ngay, b.trang_thai, hh.diem_danh, b.nguoi_day_tg, b.danh_gia_xong_at, hh.id
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  where b.id = p_buoi and b.loai = 'bo_tro_yeu'
  limit 1
$$;

-- Tiến độ luyện trong ca theo (dạng, cụm) — CHỈ câu đã trả lời (có verdict). 1 nguồn cho cả app HS & TA.
create or replace function public._btyeu_tien_do(p_buoi uuid)
returns table (ma_dang text, ma_cum text, so_cau bigint, so_dung bigint, so_goi_y bigint, cau_cuoi_at timestamptz)
language sql stable security definer set search_path = public as $$
  select btc.ma_dang, btc.ma_cum,
         count(distinct blc.id) filter (where blc.verdict is not null),
         count(distinct blc.id) filter (where blc.verdict = 'correct'),
         count(distinct g.id),
         max(blc.cham_at) filter (where blc.verdict is not null)
  from bai_test bt
  join bai_test_cau btc on btc.bai_test_id = bt.id
  left join bai_lam bl on bl.bai_test_id = bt.id
  left join bai_lam_cau blc on blc.bai_lam_id = bl.id and blc.bai_test_cau_id = btc.id
  left join bai_lam_goi_y g on g.bai_test_cau_id = btc.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro'
  group by btc.ma_dang, btc.ma_cum
$$;

-- ── 5) HS: ca hôm nay của em (null = không có ca / chưa điểm danh có mặt / đã hoàn tất) ───────
create or replace function public.fn_btyeu_ca_cua_toi() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  r record;
  v_bd text; v_cautbl text; v_cumtbl text;
  v_dangs jsonb; v_test jsonb;
begin
  if v_hs is null then return null; end if;
  select b.id, b.gio_bat_dau, b.gio_ket_thuc, b.phong, y.id as case_id, y.mon,
         (select ho_ten from nhan_su where id = b.nguoi_day_tg) as ta_ten
    into r
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = v_hs and hh.bo_tro_yeu_id is not null
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.ngay = public._btyeu_today()
    and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null
  order by b.gio_bat_dau nulls last, b.created_at
  limit 1;
  if r.id is null then return null; end if;

  v_bd := public._kho_ban_do_tbl(r.mon); v_cautbl := public._kho_cau_tbl(r.mon); v_cumtbl := public._kho_cum_tbl(v_cautbl);

  execute format($q$
    with td as (select * from public._btyeu_tien_do($1))
    select coalesce(jsonb_agg(jsonb_build_object(
      'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''),
      'da_day_truoc', (d.day_at is not null and d.day_buoi_id is distinct from $1),
      'diem_luc_mo', d.diem_luc_mo,
      'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
      'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
      'cums', coalesce((
        select jsonb_agg(jsonb_build_object(
          'ma_cum', c.ma_cum, 'ten', coalesce(c.ten, 'Cụm ' || c.thu_tu), 'thu_tu', c.thu_tu,
          'tien_de', coalesce((select jsonb_agg(t.tien_de_ma_cum) from %3$I t where t.ma_cum = c.ma_cum), '[]'::jsonb),
          'so_cau_kho', (select count(*) from %4$I q where q.ma_cum = c.ma_cum and q.xoa_at is null),
          'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang and td.ma_cum = c.ma_cum), 0),
          'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang and td.ma_cum = c.ma_cum), 0)
        ) order by c.thu_tu, c.ma_cum)
        from %2$I c where c.ma_dang = d.ma_dang), '[]'::jsonb)
    ) order by d.diem_luc_mo nulls last, d.created_at), '[]'::jsonb)
    from bo_tro_yeu_dang d
    left join %1$I bd on bd.ma_dang = d.ma_dang
    where d.bo_tro_yeu_id = $2 and d.dong_at is null
  $q$, v_bd, v_cumtbl, replace(v_cumtbl, '_cum_bai', '_cum_tien_de'), v_cautbl)
  into v_dangs using r.id, r.case_id;

  select jsonb_build_object('bai_test_id', bt.id, 'so_cau', bt.so_cau,
           'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'))
    into v_test
  from bai_test bt where bt.buoi_hoc_id = r.id and bt.loai = 'bo_tro_test' limit 1;

  return jsonb_build_object(
    'buoi_id', r.id, 'mon', r.mon, 'gio_bat_dau', r.gio_bat_dau, 'gio_ket_thuc', r.gio_ket_thuc, 'phong', r.phong,
    'ta_ten', r.ta_ten, 'dangs', v_dangs, 'test', v_test);
end $$;
grant execute on function public.fn_btyeu_ca_cua_toi() to authenticated;

-- ── 6) HS: sinh 1 LÔ luyện (3 câu) trong cụm — app tự gọi lô mới khi hết (Thùy: luyện tới khi TA bảo next)
create or replace function public.fn_btyeu_luyen_sinh(p_buoi uuid, p_ma_dang text, p_ma_cum text default null, p_so_cau integer default 3)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  b record; v_lop uuid; v_cautbl text; v_lttbl text;
  v_tru text[]; v_caus text[]; v_bt uuid; i integer := 0; c text;
begin
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or b.hoc_sinh_id <> v_hs then raise exception 'Không phải ca bổ trợ của em.'; end if;
  if b.trang_thai <> 'mo' or b.ngay <> public._btyeu_today() then raise exception 'Ca này không mở hôm nay.'; end if;
  if b.diem_danh is distinct from 'co_mat' then raise exception 'Chưa điểm danh có mặt.'; end if;
  if exists (select 1 from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test') then raise exception 'Ca đã đóng — làm bài kiểm tra cuối buổi nhé.'; end if;
  if not exists (select 1 from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and ma_dang = p_ma_dang) then raise exception 'Dạng không thuộc ca bổ trợ này.'; end if;

  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', b.mon; end if;

  v_cautbl := public._kho_cau_tbl(b.mon); v_lttbl := public._kho_lt_tbl(b.mon);
  -- Câu đã gặp trong CA (mọi bài của buổi) — né trước, cạn thì lặp (trong _btyeu_chon_cau).
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;
  v_caus := public._btyeu_chon_cau(v_cautbl, p_ma_dang, p_ma_cum, v_tru, greatest(1, least(coalesce(p_so_cau, 3), 10)));
  if coalesce(array_length(v_caus, 1), 0) = 0 then raise exception 'Kho chưa có câu chấm online cho dạng này.'; end if;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id)
    values (null, v_lop, v_hs, public._btyeu_today(), 'bo_tro', b.mon, 0, 'mo', p_buoi) returning id into v_bt;
  foreach c in array v_caus loop
    i := i + 1;
    perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, p_ma_cum);
  end loop;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i);
end $$;
grant execute on function public.fn_btyeu_luyen_sinh(uuid, text, text, integer) to authenticated;

-- ── 7) TA: toàn cảnh 1 ca (em · điểm danh · dạng · tiến độ per cụm · test · retest · nhận xét) ───
create or replace function public.fn_btyeu_ca_ta(p_buoi uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare b record; v_bd text; v_cautbl text; v_cumtbl text; v_dangs jsonb; v_test jsonb; v_retest jsonb; v_dg jsonb; v_hs jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then return null; end if;
  v_bd := public._kho_ban_do_tbl(b.mon); v_cautbl := public._kho_cau_tbl(b.mon); v_cumtbl := public._kho_cum_tbl(v_cautbl);

  select jsonb_build_object('id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'khoi', h.khoi,
           'level', (select level from hs_level where hoc_sinh_id = h.id and mon = b.mon and loai = 'kien_thuc'))
    into v_hs from hoc_sinh h where h.id = b.hoc_sinh_id;

  execute format($q$
    with td as (select * from public._btyeu_tien_do($1))
    select coalesce(jsonb_agg(jsonb_build_object(
      'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''),
      'day_at', d.day_at, 'day_buoi_id', d.day_buoi_id, 'dong_at', d.dong_at, 'diem_luc_mo', d.diem_luc_mo,
      'retest_diem', d.retest_diem, 'retest_at', d.retest_at, 'dat', d.dat,
      'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
      'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
      'so_goi_y', coalesce((select sum(so_goi_y) from td where td.ma_dang = d.ma_dang), 0),
      'cau_cuoi_at', (select max(cau_cuoi_at) from td where td.ma_dang = d.ma_dang),
      'cums', coalesce((select jsonb_agg(jsonb_build_object(
          'ma_cum', td.ma_cum, 'ten', coalesce(c.ten, case when td.ma_cum is null then 'Cả dạng' else td.ma_cum end),
          'so_cau', td.so_cau, 'so_dung', td.so_dung, 'so_goi_y', td.so_goi_y, 'cau_cuoi_at', td.cau_cuoi_at) order by c.thu_tu nulls last)
        from td left join %2$I c on c.ma_cum = td.ma_cum where td.ma_dang = d.ma_dang), '[]'::jsonb)
    ) order by d.diem_luc_mo nulls last, d.created_at), '[]'::jsonb)
    from bo_tro_yeu_dang d left join %1$I bd on bd.ma_dang = d.ma_dang
    where d.bo_tro_yeu_id = $2
  $q$, v_bd, v_cumtbl) into v_dangs using p_buoi, b.bo_tro_yeu_id;

  -- Test cuối ca: điểm theo dạng (đã nộp) — chấm ở DB, app chỉ hiện.
  select jsonb_build_object('bai_test_id', bt.id, 'so_cau', bt.so_cau,
           'da_nop', bl.trang_thai = 'da_nop', 'nop_at', bl.nop_at,
           'theo_dang', coalesce((
             select jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'so_cau', x.n, 'so_dung', x.d))
             from (select btc.ma_dang, count(*) n, count(*) filter (where blc.verdict = 'correct') d
                   from bai_test_cau btc left join bai_lam_cau blc on blc.bai_test_cau_id = btc.id and blc.bai_lam_id = bl.id
                   where btc.bai_test_id = bt.id group by btc.ma_dang) x), '[]'::jsonb))
    into v_test
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' limit 1;

  select jsonb_build_object('bai_test_id', bt.id, 'ngay', bt.ngay, 'so_cau', bt.so_cau,
           'da_nop', coalesce(bl.trang_thai = 'da_nop', false), 'nop_at', bl.nop_at)
    into v_retest
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'retest' limit 1;

  select jsonb_build_object('nhan_xet', g.nhan_xet, 'muc_ma', g.muc_ma) into v_dg
    from buoi_danh_gia g where g.buoi_hoc_id = p_buoi and g.hoc_sinh_id = b.hoc_sinh_id;

  return jsonb_build_object(
    'buoi_id', b.buoi_id, 'mon', b.mon, 'ngay', b.ngay, 'trang_thai', b.trang_thai, 'diem_danh', b.diem_danh,
    'buoi_hoc_hs_id', b.buoi_hoc_hs_id, 'nguoi_day_tg', b.nguoi_day_tg, 'danh_gia_xong_at', b.danh_gia_xong_at,
    'bo_tro_yeu_id', b.bo_tro_yeu_id, 'hs', v_hs, 'dangs', v_dangs, 'test', v_test, 'retest', v_retest, 'danh_gia', v_dg,
    'so_lan_huy', (select count(*) from buoi_hoc_hs hh2 join buoi_hoc b2 on b2.id = hh2.buoi_hoc_id
                   where hh2.bo_tro_yeu_id = b.bo_tro_yeu_id and b2.trang_thai = 'huy'));
end $$;
grant execute on function public.fn_btyeu_ca_ta(uuid) to authenticated;

-- ── 8) TA: đóng ca — chốt dạng đã dạy + sinh TEST cuối ca + sinh RETEST tầng 2. 1 transaction, idempotent.
create or replace function public.fn_btyeu_dong_ca(p_buoi uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  b record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean;
  v_cautbl text; v_lttbl text; v_lop uuid;
  v_test uuid; v_retest uuid; v_retest_ngay date;
  v_tru text[]; v_caus text[]; c text; i integer; v_moi_cum integer; v_so_cum integer;
  rc record; rd record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if b.trang_thai <> 'mo' then raise exception 'Buổi đã %.', b.trang_thai; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin) mới đóng ca.'; end if;
  if b.diem_danh is distinct from 'co_mat' then raise exception 'Em chưa điểm danh có mặt.'; end if;

  -- Idempotent: đã đóng (đã có test hoặc đã chốt không-học) → trả lại kết quả cũ.
  select id into v_test from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test';
  select id, ngay into v_retest, v_retest_ngay from bai_test where buoi_hoc_id = p_buoi and loai = 'retest';
  if v_test is not null then
    return jsonb_build_object('bo_tro_test_id', v_test, 'retest_id', v_retest, 'retest_ngay', v_retest_ngay, 'khong_hoc', false, 'da_dong_truoc', true);
  end if;

  -- Dạng ĐÃ LUYỆN = có ≥1 câu đã trả lời trong ca.
  drop table if exists _luyen;
  create temp table _luyen on commit drop as
    select ma_dang, ma_cum, so_cau, so_dung from public._btyeu_tien_do(p_buoi) where so_cau > 0;
  if not exists (select 1 from _luyen) then
    return jsonb_build_object('bo_tro_test_id', null, 'retest_id', null, 'retest_ngay', null, 'khong_hoc', true);
  end if;

  -- Chốt dạng đã dạy (neo lần đầu — day_at là mốc TRƯỚC/SAU của outcome, không đè).
  update bo_tro_yeu_dang set day_at = now(), day_buoi_id = p_buoi
    where bo_tro_yeu_id = b.bo_tro_yeu_id and day_at is null and ma_dang in (select distinct ma_dang from _luyen);

  v_cautbl := public._kho_cau_tbl(b.mon); v_lttbl := public._kho_lt_tbl(b.mon);
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;

  -- TEST CUỐI CA (Thùy 03/09): ≥3 cụm → 1 câu/cụm · 1–2 cụm → 2 câu/cụm · >6 cụm → 6 cụm kém nhất. Sàn 2 · trần 6.
  select count(*) into v_so_cum from _luyen;
  v_moi_cum := case when v_so_cum >= 3 then 1 else 2 end;
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id)
    values (null, v_lop, b.hoc_sinh_id, public._btyeu_today(), 'bo_tro_test', b.mon, 0, 'mo', p_buoi) returning id into v_test;
  i := 0;
  for rc in select * from _luyen order by (so_dung::numeric / nullif(so_cau, 0)) nulls first, so_cau desc limit 6 loop
    v_caus := public._btyeu_chon_cau(v_cautbl, rc.ma_dang, rc.ma_cum, v_tru, v_moi_cum);
    if coalesce(array_length(v_caus, 1), 0) < v_moi_cum then -- cụm cạn → câu cùng dạng khác cụm
      v_caus := v_caus || public._btyeu_chon_cau(v_cautbl, rc.ma_dang, null, v_tru || coalesce(v_caus, '{}'), v_moi_cum - coalesce(array_length(v_caus, 1), 0));
    end if;
    foreach c in array v_caus loop
      i := i + 1; perform public._kho_snapshot_cau(v_test, v_cautbl, v_lttbl, c, i, rc.ma_cum);
      v_tru := v_tru || c;
    end loop;
  end loop;
  update bai_test set so_cau = i where id = v_test;

  -- RETEST tầng 2: ngày = buổi THƯỜNG kế tiếp của lớp em theo TKB (≤28 ngày). Không có → không sinh (cờ cho OPS).
  if v_lop is not null then
    select d into v_retest_ngay
    from generate_series(public._btyeu_today() + 1, public._btyeu_today() + 28, interval '1 day') g(d)
    where exists (select 1 from thoi_khoa_bieu t
                  where t.lop_id = v_lop and t.thu = extract(isodow from g.d)::int + 1
                    and t.hieu_luc_tu <= g.d::date and (t.hieu_luc_den is null or t.hieu_luc_den >= g.d::date))
    order by d limit 1;
  end if;
  if v_retest_ngay is not null then
    insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id)
      values (null, v_lop, b.hoc_sinh_id, v_retest_ngay, 'retest', b.mon, 0, 'mo', p_buoi) returning id into v_retest;
    i := 0;
    -- 3 câu/dạng đã dạy trong ca, trần 9 → ưu tiên dạng em làm kém nhất trong ca.
    for rd in select ma_dang, sum(so_dung)::numeric / nullif(sum(so_cau), 0) as ti_le from _luyen group by ma_dang order by ti_le nulls first limit 3 loop
      v_caus := public._btyeu_chon_cau(v_cautbl, rd.ma_dang, null, v_tru, 3);
      foreach c in array v_caus loop
        i := i + 1; perform public._kho_snapshot_cau(v_retest, v_cautbl, v_lttbl, c, i, null);
        v_tru := v_tru || c;
      end loop;
    end loop;
    if i = 0 then delete from bai_test where id = v_retest; v_retest := null; v_retest_ngay := null;
    else update bai_test set so_cau = i where id = v_retest; end if;
  end if;

  return jsonb_build_object('bo_tro_test_id', v_test, 'retest_id', v_retest, 'retest_ngay', v_retest_ngay, 'khong_hoc', false, 'da_dong_truoc', false);
end $$;
grant execute on function public.fn_btyeu_dong_ca(uuid) to authenticated;

-- ── 9) TA: hoàn tất ca — nhận xét + mức; test chưa nộp thì phải có lý do "không test" (Thùy 03/09 câu 2)
create or replace function public.fn_btyeu_hoan_tat(p_buoi uuid, p_nhan_xet text, p_muc_ma text default null, p_khong_test_ly_do text default null)
returns void language plpgsql security definer set search_path = public as $$
declare b record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_test_da_nop boolean; v_co_test boolean; v_nx text;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if b.danh_gia_xong_at is not null then return; end if; -- idempotent
  select exists (select 1 from bai_test bt where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test'),
         exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop')
    into v_co_test, v_test_da_nop;
  if v_co_test and not v_test_da_nop and nullif(trim(coalesce(p_khong_test_ly_do, '')), '') is null then
    raise exception 'Em chưa làm bài kiểm tra cuối buổi — nhập lý do "không test" nếu em không làm.';
  end if;
  v_nx := nullif(trim(coalesce(p_nhan_xet, '')), '');
  if v_co_test and not v_test_da_nop then v_nx := concat_ws(E'\n', '[Không test: ' || trim(p_khong_test_ly_do) || ']', v_nx); end if;
  if v_nx is null and p_muc_ma is null then raise exception 'Nhập nhận xét hoặc chọn mức.'; end if;
  insert into buoi_danh_gia (buoi_hoc_id, hoc_sinh_id, nhan_xet, muc_ma, graded_by, updated_at)
    values (p_buoi, b.hoc_sinh_id, v_nx, p_muc_ma, public.jwt_uid(), now())
    on conflict (buoi_hoc_id, hoc_sinh_id) do update set nhan_xet = excluded.nhan_xet, muc_ma = excluded.muc_ma, graded_by = excluded.graded_by, updated_at = now();
  update buoi_hoc set danh_gia_xong_at = now(), updated_at = now() where id = p_buoi;
end $$;
grant execute on function public.fn_btyeu_hoan_tat(uuid, text, text, text) to authenticated;

-- ── 10) HS: bài retest đến hạn (ngày ≤ hôm nay, chưa nộp; đã nộp hôm nay vẫn trả để xem lại) ───
create or replace function public.fn_btyeu_retest_cua_toi() returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'bai_test_id', bt.id, 'ngay', bt.ngay, 'mon', bt.mon, 'so_cau', bt.so_cau, 'lop_id', bt.lop_id,
    'da_nop', coalesce(bl.trang_thai = 'da_nop', false), 'nop_at', bl.nop_at,
    'buoi_bo_tro_ngay', (select ngay from buoi_hoc where id = bt.buoi_hoc_id)
  ) order by bt.ngay), '[]'::jsonb)
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = bt.hoc_sinh_id
  where bt.hoc_sinh_id = public.my_hoc_sinh_id() and bt.loai = 'retest' and bt.trang_thai = 'mo'
    and bt.ngay <= public._btyeu_today()
    and (bl.trang_thai is distinct from 'da_nop' or bl.nop_at >= (public._btyeu_today())::timestamp at time zone 'Asia/Ho_Chi_Minh')
$$;
grant execute on function public.fn_btyeu_retest_cua_toi() to authenticated;

-- ── 11) Retest nộp → ghi lên từng dạng của case (nguồn 'rieng', đóng dạng khi > 0.5) ─────────────
-- Recompute idempotent từ bai_lam_cau (et_nop set da_nop TRƯỚC rồi mới chấm từng câu → gọi sau MỖI câu
-- được chấm là kết quả cuối luôn đúng). Câu em không trả lời → không tính (§1.5 anti-NULL).
create or replace function public.fn_btyeu_retest_ghi(p_bai_lam uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_bt record; v_case uuid; r record;
begin
  select bt.id, bt.loai, bt.buoi_hoc_id, bl.trang_thai into v_bt
    from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id where bl.id = p_bai_lam;
  if v_bt.loai is distinct from 'retest' or v_bt.trang_thai <> 'da_nop' then return; end if;
  select hh.bo_tro_yeu_id into v_case from buoi_hoc_hs hh where hh.buoi_hoc_id = v_bt.buoi_hoc_id and hh.bo_tro_yeu_id is not null limit 1;
  if v_case is null then return; end if;
  for r in
    select btc.ma_dang,
           avg(case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end) as diem
    from bai_test_cau btc join bai_lam_cau blc on blc.bai_test_cau_id = btc.id and blc.bai_lam_id = p_bai_lam
    where btc.bai_test_id = v_bt.id and blc.verdict is not null
    group by btc.ma_dang
  loop
    update bo_tro_yeu_dang set
      retest_diem = r.diem, retest_at = now(), retest_nguon = 'rieng', dat = (r.diem > 0.5),
      dong_at = case when r.diem > 0.5 then coalesce(dong_at, now()) else dong_at end
    where bo_tro_yeu_id = v_case and ma_dang = r.ma_dang;
  end loop;
end $$;

create or replace function public._trg_btyeu_retest_cau() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.fn_btyeu_retest_ghi(new.bai_lam_id);
  return new;
end $$;
drop trigger if exists trg_btyeu_retest_cau on bai_lam_cau;
create trigger trg_btyeu_retest_cau after insert or update of verdict on bai_lam_cau
  for each row when (new.verdict is not null) execute function public._trg_btyeu_retest_cau();

create or replace function public._trg_btyeu_retest_lam() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.fn_btyeu_retest_ghi(new.id);
  return new;
end $$;
drop trigger if exists trg_btyeu_retest_lam on bai_lam;
create trigger trg_btyeu_retest_lam after update of trang_thai on bai_lam
  for each row when (new.trang_thai = 'da_nop') execute function public._trg_btyeu_retest_lam();

-- ── 12) et_de: bài THI cá nhân (bo_tro_test/retest) lấy đề cùng đường ET (giấu key) ─────────────
create or replace function public.et_de(p_bai_test uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_bien_the smallint;
begin
  select bl.bien_the into v_bien_the from bai_lam bl
  where bl.bai_test_id = p_bai_test and bl.hoc_sinh_id = public.my_hoc_sinh_id();
  v_bien_the := coalesce(v_bien_the, 1);

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', bc.id, 'thu_tu', bc.thu_tu, 'loai_cau', bc.loai_cau,
      'noi_dung', bc.noi_dung, 'lua_chon', bc.lua_chon, 'anh_de', bc.anh_de,
      'menh_de', (select jsonb_agg(jsonb_build_object('noi_dung', m->>'noi_dung'))
                  from jsonb_array_elements(coalesce(bc.menh_de, '[]'::jsonb)) m),
      'ma_dang', bc.ma_dang, 'ly_thuyet', bc.ly_thuyet, 'diem', bc.diem
    ) order by bc.thu_tu)
    from bai_test_cau bc join bai_test bt on bt.id = bc.bai_test_id
    where bc.bai_test_id = p_bai_test and bc.bien_the = v_bien_the
      and ((bt.loai in ('et', 'de_thi') and public.hs_o_lop(bt.lop_id))
           or (bt.loai in ('bo_tro_test', 'retest') and bt.hoc_sinh_id = public.my_hoc_sinh_id()))
  ), '[]'::jsonb);
end $$;

-- ── 13) Mastery: bài của ca (bo_tro/bo_tro_test/retest) = nguồn 'bt' (trọng số 1 ở mastery; tầng level
--    vẫn 0 theo DANHGIA_CONFIG — không tự nâng level). Trước đây rơi vào nhánh else → 'btvn' (sai nhãn).
create or replace function public.fn_mastery_cells(
  p_hs uuid[], p_include_btvn boolean default false, p_since timestamptz default null,
  p_window integer default 5, p_tin_cao integer default 5, p_tin_tb integer default 3)
returns table (hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
language sql stable as $$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '4T', '5', '5T')) as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           g.graded_at as t, sp.phase as src
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or g.graded_at >= p_since)
    union all
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           blc.cham_at,
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'tu_luyen' then 'tu_luyen'
                when bt.loai in ('bo_tro', 'bo_tro_test', 'retest') then 'bt'
                else 'btvn' end
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and (bt.loai not in ('et', 'de_thi', 'bo_tro_test', 'retest') or bl.trang_thai = 'da_nop')
      and (p_since is null or blc.cham_at >= p_since)
    union all
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt'
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
  ),
  mf as ( -- gate nguồn: et/mt luôn · btvn/bt/tu_luyen theo toggle · tu_luyen cấp 1 luôn
    select m.* from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  rk as (
    select mf.*,
           case mf.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by mf.hoc_sinh_id, mf.ma_dang
                              order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn
    from mf
  )
  select hoc_sinh_id, ma_dang,
         sum(value * w) filter (where rn <= p_window) / nullif(sum(w) filter (where rn <= p_window), 0) as score,
         count(*) as n,
         case when sum(value * w) filter (where rn <= p_window) / nullif(sum(w) filter (where rn <= p_window), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= p_window) / nullif(sum(w) filter (where rn <= p_window), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= p_tin_cao then 'cao' when count(*) >= p_tin_tb then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, ma_dang
$$;

create or replace function public.hs_dang_evals(p_mon text, p_nhanh text default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_bd text := public._kho_ban_do_tbl(p_mon, p_nhanh);
  v_out jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  execute format($q$
    select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join %1$I bd on bd.ma_dang = p.ma_dang
      where g.hoc_sinh_id = $1 and p.phase in ('et','mt','btvn')

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at,
             (case when bt.loai in ('et','de_thi') then 'et'
                   when bt.loai = 'tu_luyen' then 'tu_luyen'
                   when bt.loai in ('bo_tro','bo_tro_test','retest') then 'bt'
                   else 'btvn' end)
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      join %1$I bd2 on bd2.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = $1 and blc.verdict is not null and bt.mon = $2
        and (bt.loai not in ('et','de_thi','bo_tro_test','retest') or bl.trang_thai = 'da_nop')

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt'
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      join %1$I bd3 on bd3.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = $1 and tl.mon = $2
    ) x
  $q$, v_bd)
  into v_out using v_hs, p_mon;
  return v_out;
end $$;
