-- 17/11/2026 · Thùy duyệt scope điểm 5 (spec-mastery.md §5): HS YẾU = em có ≥ 1 NHÓM YẾU (mastery cấp nhóm, mức Yếu). Bước 1 / 2.
-- Ảnh chụp dạng yếu (hiện tại + đầu tuần) có thêm NHÓM yếu: cột so_nhom_yeu + nhom (danh sách nhóm · tên · % · số lần).
-- Một nguồn: _nhom_yeu_tai_lo(HS[], môn, mốc) — môn một vùng (KHTN · Lý · Hoá) đọc _mastery_mon_*, môn còn lại đọc _mastery_lan_cap_nhanh;
-- nhóm phải thuộc môn (registry tl_bdm_nhom_v, Hình–Học bài qua _kho_ten_dang). Mốc null ⇒ bản lưu sẵn; có mốc ⇒ tính tại mốc.
-- 4 hàm ghi ảnh chụp điền thêm 2 cột (sinh từ thân ĐANG CHẠY, chốt md5). Chụp bù: migration kế tiếp (tách riêng để không giữ khoá độc quyền của alter table suốt lượt chụp).
do $$ begin
  if md5(pg_get_functiondef('public._qlcl_lam_moi_nen'::regproc)) <> '23a5befefa65e2a5b5c5f01a728452de' then raise exception 'Hàm _qlcl_lam_moi_nen đã bị đổi sau lúc sinh — sinh lại'; end if;
  if md5(pg_get_functiondef('public.fn_qlcl_lam_moi'::regproc)) <> 'a3765bad7202a4265fde4f1b9b2daf27' then raise exception 'Hàm fn_qlcl_lam_moi đã bị đổi sau lúc sinh — sinh lại'; end if;
  if md5(pg_get_functiondef('public._dang_yeu_chup_tuan'::regproc)) <> 'ab949f59f70c06ebf55f3a23c735cc5d' then raise exception 'Hàm _dang_yeu_chup_tuan đã bị đổi sau lúc sinh — sinh lại'; end if;
  if md5(pg_get_functiondef('public._qlcl_dong_bang_tuan'::regproc)) <> '398ca7680f5aa1f80811da4a03e97bed' then raise exception 'Hàm _qlcl_dong_bang_tuan đã bị đổi sau lúc sinh — sinh lại'; end if;
end $$;

alter table public.dang_yeu_hien_tai add column so_nhom_yeu integer not null default 0, add column nhom jsonb not null default '[]'::jsonb;
alter table public.dang_yeu_dau_tuan add column so_nhom_yeu integer not null default 0, add column nhom jsonb not null default '[]'::jsonb;
comment on column public.dang_yeu_hien_tai.so_nhom_yeu is 'Số nhóm yếu (mastery cấp nhóm, mức Yếu) — HS yếu = so_nhom_yeu > 0 (Thùy 17/11)';
comment on column public.dang_yeu_dau_tuan.so_nhom_yeu is 'Số nhóm yếu tại mốc 00:00 thứ Hai — HS yếu = so_nhom_yeu > 0 (Thùy 17/11)';

CREATE OR REPLACE FUNCTION public._nhom_yeu_tai_lo(p_hs uuid[], p_mon text, p_moc timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, nhom text, ten_nhom text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
-- 17/11: NHÓM YẾU của (HS × môn) tại mốc (null = bây giờ, đọc bản lưu sẵn). Một nguồn cho ảnh chụp hiện tại + đầu tuần (spec-mastery.md §5).
begin
  if cardinality(coalesce(p_hs, '{}')) = 0 then return; end if;
  if p_mon = any(public._mastery_mon_ds()) then
    if p_moc is null then
      return query select x.hoc_sinh_id, x.nut, v.ten::text, x.score, x.n::int
        from public._mastery_mon_doc(p_mon, p_hs, true, array['nhom']) x
        join tl_bdm_nhom_v v on v.mon = p_mon and v.id = x.nut
       where x.cap = 'nhom' and x.muc = 'yeu';
    else
      return query select x.hoc_sinh_id, x.nut, v.ten::text, x.score, x.n::int
        from public._mastery_mon_cap(p_hs, true, null, p_moc, array['nhom'], 5, 5, 3) x
        join tl_bdm_nhom_v v on v.mon = p_mon and v.id = x.nut
       where x.mon = p_mon and x.cap = 'nhom' and x.muc = 'yeu';
    end if;
  else
    return query select x.hoc_sinh_id, x.nut, t.ten, x.score, x.n::int
      from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), p_hs, true, null, p_moc, array['nhom'], 5, 5, 3) x
      cross join lateral (select coalesce((select v.ten::text from tl_bdm_nhom_v v where v.mon = p_mon and v.id = x.nut limit 1),
                                          public._kho_ten_dang(p_mon, x.nut)) as ten) t
     where x.cap = 'nhom' and x.muc = 'yeu' and t.ten is not null;
  end if;
end $function$;
revoke execute on function public._nhom_yeu_tai_lo(uuid[], text, timestamptz) from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public._qlcl_lam_moi_nen(p_ngan_giay integer DEFAULT 25)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
-- 11/11 (audit timeout): làm mới NỀN số dạng yếu lưu sẵn (dang_yeu_hien_tai) cho MỌI ô (môn × khối đang học) — thay cho việc mỗi lần
-- nhân sự mở widget là client tự gọi fn_qlcl_lam_moi qua mọi ô trong phạm vi. Cùng công thức + cùng luật "em cần tính lại" (_qlcl_hs_can_tinh),
-- em cũ nhất trước, tính xong em nào lưu em đó, hết ngân sách giây thì dừng (lượt sau tính tiếp). Chỉ chạy ở tác vụ nền (pg_cron / SQL Editor).
declare
  v_bd timestamptz := clock_timestamp();
  v_moc date := public._btyeu_moc_2_cua_so();
  v_n int := 0;
  v_dang jsonb;
  v_nhom jsonb;
  r record;
begin
  if not public._la_tac_vu_nen() then raise exception 'Chỉ tác vụ nền.'; end if;
  for r in
    select o.mon, h.hoc_sinh_id, d.tinh_at
      from (select distinct l.mon, l.khoi from lop l where l.trang_thai = 'dang_hoc' and l.khoi is not null and l.mon is not null) o
      cross join lateral public._qlcl_hs_can_tinh(o.mon, o.khoi) h
      left join dang_yeu_hien_tai d on d.mon = o.mon and d.hoc_sinh_id = h.hoc_sinh_id
     group by o.mon, h.hoc_sinh_id, d.tinh_at          -- 1 em học 2 lớp cùng môn khác khối ⇒ tính 1 lần
     order by d.tinh_at nulls first
  loop
    exit when clock_timestamp() - v_bd > make_interval(secs => p_ngan_giay);
    select coalesce(jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'ten_dang', x.ten_dang, 'score', round(x.score, 2), 'n', x.n) order by x.score), '[]'::jsonb)
      into v_dang from public.fn_btyeu_dang_yeu_2_cua_so_moi(r.hoc_sinh_id, r.mon) x;
    select coalesce(jsonb_agg(jsonb_build_object('nhom', y.nhom, 'ten_nhom', y.ten_nhom, 'score', round(y.score, 2), 'n', y.n) order by y.score), '[]'::jsonb)
      into v_nhom from public._nhom_yeu_tai_lo(array[r.hoc_sinh_id], r.mon, null) y;   /* 17/11: nhóm yếu (HS yếu = ≥ 1 nhóm yếu) */
    insert into dang_yeu_hien_tai (mon, hoc_sinh_id, so_dang_yeu, dang, moc, tinh_at, so_nhom_yeu, nhom)
      values (r.mon, r.hoc_sinh_id, jsonb_array_length(v_dang), v_dang, v_moc, now(), jsonb_array_length(v_nhom), v_nhom)
      on conflict (mon, hoc_sinh_id) do update set so_dang_yeu = excluded.so_dang_yeu, dang = excluded.dang, moc = excluded.moc, tinh_at = excluded.tinh_at,
                                                   so_nhom_yeu = excluded.so_nhom_yeu, nhom = excluded.nhom;
    v_n := v_n + 1;
  end loop;
  return v_n;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_qlcl_lam_moi(p_mon text, p_khoi text, p_toi_da integer DEFAULT 10)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid; v_moc date := public._btyeu_moc_2_cua_so(); v_dang jsonb; v_nhom jsonb; v_t0 timestamptz := clock_timestamp();
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not public._trong_pham_vi(p_mon, p_khoi) then raise exception 'Ngoài phạm vi khối của bạn.'; end if;
  for v_hs in select hoc_sinh_id from public._qlcl_hs_can_tinh(p_mon, p_khoi) limit greatest(1, least(coalesce(p_toi_da, 10), 30)) loop
    -- 06/11 HỘP THỜI GIAN: role authenticated có trần 8 s/câu lệnh; quá trần là HUỶ CẢ LÔ (không lưu em nào ⇒ lần sau lặp y hệt). Tính xong em nào lưu em đó,
    -- hết ~4 s thì dừng và trả số em còn cũ — client gọi lại cho tới khi 0. Luôn tính ≥1 em mỗi lần gọi (để chắc chắn tiến).
    exit when clock_timestamp() - v_t0 > interval '4 seconds';
    select coalesce(jsonb_agg(jsonb_build_object('ma_dang', d.ma_dang, 'ten_dang', d.ten_dang, 'score', round(d.score, 2), 'n', d.n) order by d.score), '[]'::jsonb)
      into v_dang from public.fn_btyeu_dang_yeu_2_cua_so_moi(v_hs, p_mon) d;
    select coalesce(jsonb_agg(jsonb_build_object('nhom', y.nhom, 'ten_nhom', y.ten_nhom, 'score', round(y.score, 2), 'n', y.n) order by y.score), '[]'::jsonb)
      into v_nhom from public._nhom_yeu_tai_lo(array[v_hs], p_mon, null) y;   /* 17/11: nhóm yếu (HS yếu = ≥ 1 nhóm yếu) */
    insert into dang_yeu_hien_tai (mon, hoc_sinh_id, so_dang_yeu, dang, moc, tinh_at, so_nhom_yeu, nhom)
      values (p_mon, v_hs, jsonb_array_length(v_dang), v_dang, v_moc, now(), jsonb_array_length(v_nhom), v_nhom)
      on conflict (mon, hoc_sinh_id) do update set so_dang_yeu = excluded.so_dang_yeu, dang = excluded.dang, moc = excluded.moc, tinh_at = excluded.tinh_at,
                                                   so_nhom_yeu = excluded.so_nhom_yeu, nhom = excluded.nhom;
  end loop;
  return (select count(*) from public._qlcl_hs_can_tinh(p_mon, p_khoi));
end $function$;

CREATE OR REPLACE FUNCTION public._dang_yeu_chup_tuan(p_tuan date)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_moc timestamptz := (p_tuan::timestamp at time zone 'Asia/Ho_Chi_Minh');
  r record; n int := 0; k int;
begin
  for r in select distinct l.mon from lop l where l.trang_thai = 'dang_hoc' and l.mon is not null loop
    delete from dang_yeu_dau_tuan where tuan = p_tuan and mon = r.mon;
    with hs as (     -- HS ở lớp của môn TẠI MỐC
      select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.khoi
        from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
       where l.mon = r.mon and l.khoi is not null
         and hl.ngay_vao < p_tuan and (hl.ngay_roi is null or hl.ngay_roi >= p_tuan - 1)
       order by hl.hoc_sinh_id, hl.ngay_vao desc
    ),
    co_do as (       -- chỉ HS đã từng được đo ở môn trước mốc (chưa đo ≠ 0 dạng yếu)
      select hs.* from hs
       where exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                       join buoi_hoc b on b.id = p.buoi_hoc_id join lop l2 on l2.id = b.lop_id
                      where g.hoc_sinh_id = hs.hoc_sinh_id and l2.mon = r.mon and b.ngay < p_tuan)
    ),
    dy as (select * from public._dang_yeu_tai_lo(array(select c.hoc_sinh_id from co_do c), r.mon, v_moc)),
    ny as materialized (select * from public._nhom_yeu_tai_lo(array(select c.hoc_sinh_id from co_do c), r.mon, v_moc))   /* 17/11: nhóm yếu tại mốc */
    insert into dang_yeu_dau_tuan (tuan, mon, khoi, hoc_sinh_id, so_dang_yeu, dang, tinh_at, chot_id, so_nhom_yeu, nhom)
    select p_tuan, r.mon, c.khoi, c.hoc_sinh_id, count(dy.ma_dang)::int,
           coalesce(jsonb_agg(jsonb_build_object('ma_dang', dy.ma_dang, 'ten_dang', dy.ten_dang, 'score', dy.score, 'n', dy.n))
                    filter (where dy.ma_dang is not null), '[]'::jsonb),
           now(), null,
           (select count(*)::int from ny where ny.hoc_sinh_id = c.hoc_sinh_id),
           (select coalesce(jsonb_agg(jsonb_build_object('nhom', ny.nhom, 'ten_nhom', ny.ten_nhom, 'score', round(ny.score, 2), 'n', ny.n) order by ny.score), '[]'::jsonb)
              from ny where ny.hoc_sinh_id = c.hoc_sinh_id)
      from co_do c left join dy on dy.hoc_sinh_id = c.hoc_sinh_id
     group by c.hoc_sinh_id, c.khoi;
    get diagnostics k = row_count; n := n + k;
  end loop;
  return n;
end $function$;

CREATE OR REPLACE FUNCTION public._qlcl_dong_bang_tuan(p_mon text, p_tuan date, p_chot uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n int;
begin
  delete from dang_yeu_dau_tuan where tuan = p_tuan and mon = p_mon;   -- chốt lại trong tuần ⇒ thay ảnh tuần đó
  insert into dang_yeu_dau_tuan (tuan, mon, khoi, hoc_sinh_id, so_dang_yeu, dang, tinh_at, chot_id, so_nhom_yeu, nhom)
  select p_tuan, p_mon, o.khoi, d.hoc_sinh_id, d.so_dang_yeu, d.dang, d.tinh_at, p_chot, d.so_nhom_yeu, d.nhom
    from dang_yeu_hien_tai d
    join lateral (select l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                   where hl.hoc_sinh_id = d.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc'
                     and l.mon = p_mon and l.khoi is not null
                   order by hl.ngay_vao desc limit 1) o on true
   where d.mon = p_mon;
  get diagnostics n = row_count;
  return n;
end $function$;

