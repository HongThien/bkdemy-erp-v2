-- ============================================================================
-- 202610030228 — TSA = MỤC RIÊNG trên app HS khối 12 (Thùy 03/10: "Đưa phần tự luyện TSA thành 1 mục riêng trên app của 12";
--   chọn "mọi em khối 12, không cần ghi danh lớp TSA")
-- ----------------------------------------------------------------------------
-- VÌ SAO: mọi hàm tự luyện tìm "lớp em ĐANG HỌC của môn" (để biết khối + gắn bai_test.lop_id NOT NULL). Đang có 0 lớp TSA, 15 em
--   khối 12 chỉ học lớp Toán ⇒ TSA không mở được cho ai. Ghi danh hàng loạt vào lớp TSA thì dính học phí / sĩ số / điểm danh.
--   ⇒ REGISTRY `mon_mo_ca_khoi` (môn, khối, lớp neo): môn mở cho CẢ KHỐI, không cần ghi danh. Bài tự luyện của em không có lớp
--   môn đó neo vào 1 LỚP CHUNG trạng thái `dong` (không ai ghi danh ⇒ không học phí, không sĩ số; `dong` ⇒ không hiện ở danh sách
--   lớp đang học). Thêm môn/khối kiểu này = thêm 1 dòng registry, không rải `if mon = 'TSA'` (§1.6).
--   `_hs_lop_tu_luyen(hs, mon)` = 1 chỗ trả lời "bài tự luyện môn này của em gắn lớp nào": lớp đang học của môn (như cũ) ⇒ không có
--   thì lớp neo của môn mở cả khối ⇒ không có nữa thì null (hàm gọi báo "chưa ghi danh" như cũ).
--   App: môn mở cả khối KHÔNG vào thanh chọn môn (`hs_mon_hoc_cua_toi` loại ra), mà thành 1 ô riêng (`hs_mon_rieng_cua_toi`).
--   Thân 6 hàm ở phần (5) lấy từ pg_get_functiondef bản đang chạy (scripts/_gen_mig_tsa_muc_rieng.mjs), chỉ thay đoạn tìm lớp.
--
-- MẤT GÌ (Luật xoá): không mất gì — thêm 1 bảng, 1 lớp (trạng thái dong), 2 hàm; sửa 7 hàm bằng create or replace (giữ chữ ký, ACL).
--   Hành vi đổi: em có lớp của môn ⇒ y như cũ. Em không có lớp TSA mà ở khối 12 ⇒ giờ tự luyện TSA được.
-- ============================================================================

-- (1) Registry môn mở cho cả khối
create table public.mon_mo_ca_khoi (
  mon text not null,
  khoi text not null,
  lop_id uuid not null references public.lop(id),
  ghi_chu text,
  primary key (mon, khoi)
);
alter table public.mon_mo_ca_khoi enable row level security; -- chỉ hàm security definer đọc

-- (2) Lớp neo TSA khối 12 (trạng thái dong: không ai ghi danh, không hiện ở danh sách lớp đang học) + dòng registry
with l as (
  insert into public.lop (ten_lop, mon, khoi, trang_thai)
  values ('12 TSA · Tự luyện chung', 'TSA', '12', 'dong')
  returning id
)
insert into public.mon_mo_ca_khoi (mon, khoi, lop_id, ghi_chu)
select 'TSA', '12', id, 'Thùy 03/10: mọi em khối 12 tự luyện TSA, không cần ghi danh' from l;

-- (3) Bài tự luyện môn p_mon của em gắn lớp nào
create or replace function public._hs_lop_tu_luyen(p_hs uuid, p_mon text)
returns uuid language sql stable security definer set search_path = public as $$
  select coalesce(
    (select hl.lop_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
      where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
      order by hl.ngay_vao desc limit 1),
    (select m.lop_id from mon_mo_ca_khoi m join hoc_sinh h on h.khoi = m.khoi
      where h.id = p_hs and m.mon = p_mon))
$$;
revoke all on function public._hs_lop_tu_luyen(uuid, text) from public;
revoke execute on function public._hs_lop_tu_luyen(uuid, text) from anon;

-- (4a) Ô riêng trên app: môn mở cho khối của em
create or replace function public.hs_mon_rieng_cua_toi()
returns table (mon text, co_kho boolean)
language sql stable security definer set search_path = public as $$
  select m.mon, public._kho_co_mon(m.mon)
  from mon_mo_ca_khoi m join hoc_sinh h on h.khoi = m.khoi
  where h.id = public.my_hoc_sinh_id()
  order by m.mon
$$;
revoke all on function public.hs_mon_rieng_cua_toi() from public;
revoke execute on function public.hs_mon_rieng_cua_toi() from anon;
grant execute on function public.hs_mon_rieng_cua_toi() to authenticated;

-- (4b) Thanh chọn môn: bỏ môn đã là ô riêng của khối em (dựng từ bản đang chạy, thêm 1 điều kiện)
create or replace function public.hs_mon_hoc_cua_toi()
 returns table(mon text, ten_lop text, co_kho boolean)
 language sql stable security definer
 set search_path to 'public'
as $function$
  select l.mon, string_agg(l.ten_lop, ', ' order by hl.ngay_vao, l.ten_lop) as ten_lop, public._kho_co_mon(l.mon) as co_kho
  from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
  where hl.hoc_sinh_id = public.my_hoc_sinh_id() and hl.trang_thai = 'dang_hoc'
    and public._mon_khoi_hop_le(l.mon, (select hs.khoi from hoc_sinh hs where hs.id = public.my_hoc_sinh_id()))
    and not exists (select 1 from mon_mo_ca_khoi m join hoc_sinh hs on hs.khoi = m.khoi
                    where hs.id = public.my_hoc_sinh_id() and m.mon = l.mon) -- mig 202610030228: môn là ô riêng
  group by l.mon
  order by min(hl.ngay_vao), l.mon
$function$;

-- (5) Các hàm tự luyện tìm lớp qua _hs_lop_tu_luyen
-- tu_luyen_sinh(p_mon text, p_dangs jsonb, p_nhanh text) — thân lấy từ bản đang chạy, chỉ thay đoạn tìm lớp
CREATE OR REPLACE FUNCTION public.tu_luyen_sinh(p_mon text, p_dangs jsonb, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_them integer := jsonb_array_length(p_dangs);
  v_cautbl text := public._kho_cau_tbl(p_mon, p_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);   -- ⭐ ĐỔI Ở ĐÂY: dùng hàm HS-only (bỏ TLN)
  v_ftbl text := public._kho_form_tn_cua(v_cautbl);
  v_uu_tien text;
  v_thu_tu integer := 0;
  v_ma_dang text;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_ma_cau text;
  v_ok_count integer := 0;
  v_nh text;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  if v_them is null or v_them = 0 then raise exception 'Không có dạng nào để sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  v_uu_tien := case when v_ftbl is null then '' else format('(exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)) desc, ', v_ftbl) end;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for v_ma_dang in select jsonb_array_elements_text(p_dangs) loop
    v_thu_tu := v_thu_tu + 1;
    -- 29/09: client (tuluyen.ts / thu_thach_sinh) KHÔNG truyền p_nhanh mà rút dạng từ MỌI nhánh ⇒ bảng câu theo
    -- nhánh của CHÍNH dạng này (Đại/KHTN: null ⇒ bảng gốc như cũ). Trước đây dạng Hình/HGT tra dai_cau_hoi ⇒ bị bỏ qua.
    if p_nhanh is null then
      v_nh := public._kho_nhanh_cua_dang(p_mon, v_ma_dang);
      v_cautbl := public._kho_cau_tbl(p_mon, v_nh);
      v_lttbl := public._kho_lt_tbl(p_mon, v_nh);
      v_dk := public._kho_dk_online_hs_sql(v_cautbl);
      v_ftbl := public._kho_form_tn_cua(v_cautbl);
      v_uu_tien := case when v_ftbl is null then '' else format('(exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)) desc, ', v_ftbl) end;
    end if;
    select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
      from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = v_ma_dang;
    v_ma_cau := null;
    execute format($q$
      select c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null
        and %2$s
        and c.ma_cau <> all($2)
        and not exists (select 1 from public._hs_cau_lan_gap($3) g where g.ma_cau = c.ma_cau)
      order by %3$s random() limit 1
    $q$, v_cautbl, v_dk, v_uu_tien)
    into v_ma_cau using v_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    if v_ma_cau is null then
      -- Hết câu chưa gặp ⇒ câu gặp LÂU NHẤT trước (không bốc ngẫu nhiên câu vừa làm).
      execute format($q$
        select c.ma_cau from %1$I c
        left join public._hs_cau_lan_gap($3) g on g.ma_cau = c.ma_cau
        where c.dang_chinh = $1 and c.xoa_at is null
          and %2$s
          and c.ma_cau <> all($2)
        order by g.lan_cuoi nulls first, %3$s random() limit 1
      $q$, v_cautbl, v_dk, v_uu_tien)
      into v_ma_cau using v_ma_dang, v_used_batch, v_hs;
    end if;
    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      continue;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, v_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho các dạng của em — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

-- tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text) — thân lấy từ bản đang chạy, chỉ thay đoạn tìm lớp
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end); -- suy nhánh từ tiền tố mã dạng (DG/GT/KG)
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..10 loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    -- Tier 1: ưu tiên cụm CHƯA dùng trong lượt này + tránh 9 lần gần nhất của dạng.
    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1 and lan_thu > $6 - 10)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn tránh lặp gần đây.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select ma_cau from tu_luyen_dang_lan
            where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    end if;

    -- Tier 3: kho ít câu — chấp nhận lặp (CEO chốt cùng luật tự luyện tổng hợp), chỉ né trùng NGAY trong lượt này.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch;
    end if;

    -- Dạng hết sạch câu (kho cạn hẳn) → dừng lượt sớm, giữ số câu đã có (không lặp vô ích 10 lần).
    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

-- tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_chi_cau_moi boolean) — thân lấy từ bản đang chạy, chỉ thay đoạn tìm lớp
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_chi_cau_moi boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end);
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_cutoff timestamptz := public._tu_luyen_dau_cua_so_truoc();
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..10 loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    -- Tier 1: ưu tiên cụm CHƯA dùng trong lượt này + câu em CHƯA GẶP ở bất kỳ bài nào (01/10, spec-v1-app-hs §2).
    -- Tier 2: bỏ ràng buộc cụm, vẫn chỉ câu chưa gặp. Tier 3 (chỉ khi tắt "Chỉ câu mới"): câu gặp LÂU NHẤT trước.
    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select g.ma_cau from public._hs_cau_lan_gap($4) g)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn giữ cửa sổ loại trừ như Tier 1.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select g.ma_cau from public._hs_cau_lan_gap($3) g)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;
    end if;

    -- Tier 3: kho ít câu, chấp nhận lặp — CHỈ khi KHÔNG bật "chỉ câu mới" (bật thì lặp lại
    -- đúng thứ toggle đang cố tránh — dừng lượt sớm thay vì âm thầm phá nghĩa của toggle).
    if v_ma_cau is null and not p_chi_cau_moi then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        left join public._hs_cau_lan_gap($3) g on g.ma_cau = c.ma_cau
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by g.lan_cuoi nulls first, random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs;
    end if;

    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  if v_ok_count = 0 and p_chi_cau_moi then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác (không tạo tu_luyen_dang_lan nên xoá an toàn)
    raise exception 'Em đã làm hết câu MỚI của dạng này — tắt "Chỉ câu mới" để luyện lại các câu cũ nhé.';
  end if;
  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

-- tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_loai text) — thân lấy từ bản đang chạy, chỉ thay đoạn tìm lớp
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_loai text DEFAULT 'tu_luyen'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end);
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  v_n integer := 10; -- so cau can sinh: 10 mac dinh (tu_luyen, htd_luyen); htd_test doi theo do kho ben duoi
  v_muc_do smallint;
  v_fallback text[];
  v_c text;
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if p_loai not in ('tu_luyen', 'htd_luyen', 'htd_test') then
    raise exception 'tu_luyen_chu_de_sinh: loai % không hợp lệ', p_loai;
  end if;
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  -- Thùy 21-22/09: số câu bài TEST "Học từ đầu" theo ĐỘ KHÓ CỦA DẠNG (không đụng tu_luyen/htd_luyen).
  if p_loai = 'htd_test' then
    v_muc_do := public._kho_muc_do_dang(p_mon, p_ma_dang);
    v_n := case when coalesce(v_muc_do, 3) >= 4 then 3 else 5 end;
  end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_loai, p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..v_n loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select g.ma_cau from public._hs_cau_lan_gap($4) g)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select g.ma_cau from public._hs_cau_lan_gap($3) g)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    end if;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        left join public._hs_cau_lan_gap($3) g on g.ma_cau = c.ma_cau
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by g.lan_cuoi nulls first, random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs;
    end if;

    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  -- Thùy 21-22/09: dạng KHÔNG có MCQ (v_ok_count=0) + đang ở Học từ đầu → hiện đề THẬT (bất kỳ loại
  -- câu), KHÔNG chặn cứng nữa. App HS render read-only khi câu không phải trắc nghiệm; TA chấm ĐCS.
  -- Tự luyện thường (p_loai='tu_luyen') KHÔNG rơi vào đây — vẫn báo lỗi như cũ (ngoài phạm vi).
  if v_ok_count = 0 and p_loai in ('htd_luyen', 'htd_test') then
    v_fallback := public._htd_chon_cau_bat_ky(v_cautbl, p_ma_dang, '{}', v_n);
    v_thu_tu := 0;
    foreach v_c in array v_fallback loop
      v_thu_tu := v_thu_tu + 1;
      perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_c, v_thu_tu, null);
      v_ok_count := v_ok_count + 1;
    end loop;
  end if;

  if v_ok_count = 0 then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

-- tu_luyen_dien_sinh(p_mon text, p_n integer) — thân lấy từ bản đang chạy, chỉ thay đoạn tìm lớp
CREATE OR REPLACE FUNCTION public.tu_luyen_dien_sinh(p_mon text DEFAULT 'Toán'::text, p_n integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid := public.my_hoc_sinh_id(); v_lop uuid; v_khoi text; v_bt uuid; v_thu_tu int := 0; r record;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  -- bài chứng minh (điền ô) lấy từ hinh_form_dien = nhánh HÌNH HỌC ⇒ môn không có nhánh này không được sinh (trước đây KHTN ra bài hình Toán)
  if not coalesce('hinh_hoc' = any(public._kho_ds_nhanh(p_mon)), false) then raise exception 'Môn % chưa có bài chứng minh trên app.', p_mon; end if;
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  select l.khoi into v_khoi from lop l where l.id = v_lop;
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo') returning id into v_bt;
  for r in
    select f.*, d.ma, d.de, d.gia_thiet, d.anh, d.khoi
    from hinh_form_dien f join lateral (select * from fn_dien_form_cho_duyet(null, true) x where x.id = f.id) d on true
    where f.da_duyet and f.xoa_at is null and (v_khoi is null or d.khoi = v_khoi)
      and f.id not in (select btc.form_dien_id from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id
                       where bt.hoc_sinh_id = v_hs and btc.form_dien_id is not null order by bt.created_at desc limit 30)
    order by random() limit greatest(1, least(p_n, 6))
  loop
    v_thu_tu := v_thu_tu + 1;
    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, anh_de, dap_an_key, diem, form_dien_id, dien, o_rule)
    values (v_bt, v_thu_tu, 1, r.ma, 'dien_o',
      r.de || case when r.gia_thiet is not null then E'\n' || r.gia_thiet else '' end, r.anh,
      (select jsonb_agg(o->>'dap_an' order by i) from jsonb_array_elements(r.o) with ordinality t(o, i)), 1, r.id,
      jsonb_build_object('buoc', public._dien_buoc_hs(r.buoc, r.o), 'o', public._dien_hs_view(r.o)),
      (select jsonb_agg((select jsonb_agg(case when (p->>'dung')::boolean then null else to_jsonb(p->>'loi') end order by j)
                         from jsonb_array_elements(o->'phuong_an') with ordinality q(p, j)) order by i)
         from jsonb_array_elements(r.o) with ordinality t(o, i)));
  end loop;
  if v_thu_tu = 0 then
    -- rollback bài rỗng: raise huỷ cả insert bai_test
    raise exception 'Chưa có bài chứng minh nào để luyện — thầy cô đang duyệt, quay lại sau nhé.';
  end if;
  update bai_test set so_cau = v_thu_tu where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', v_thu_tu);
end $function$;

-- tu_luyen_chu_de_ds_dang(p_mon text) — thân lấy từ bản đang chạy, chỉ thay đoạn tìm lớp
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_ds_dang(p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_khoi text;
  v_dk text;
  v_part jsonb;
  v_out jsonb := '[]'::jsonb;
  v_cutoff timestamptz := public._tu_luyen_dau_cua_so_truoc();
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if; -- mig 202610011120: môn chưa có kho ⇒ rỗng, KHÔNG rơi về kho Toán
  if v_hs is null then return '[]'::jsonb; end if;
  select l.khoi into v_khoi from lop l where l.id = public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228
  if v_khoi is null then return '[]'::jsonb; end if;

  if p_mon = 'Toán' then
    v_dk := public._kho_dk_online_hs_sql('dai_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from dai_ban_do bd
      join lateral (select count(*) as tong_cau from dai_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, v_dk) into v_part using v_khoi;
    v_out := v_out || v_part;

    v_dk := public._kho_dk_online_hs_sql('hgt_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from hgt_ban_do bd
      join lateral (select count(*) as tong_cau from hgt_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, v_dk) into v_part using v_khoi;
    v_out := v_out || v_part;
  else
    -- môn 1 nhánh (KHTN, Tiếng Anh…): bảng lấy qua REGISTRY, không gõ tên bảng (CLAUDE §1.6)
    v_dk := public._kho_dk_online_hs_sql(public._kho_cau_tbl(p_mon, null));
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from %1$I bd
      join lateral (select count(*) as tong_cau from %2$I c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %3$s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, public._kho_ban_do_tbl(p_mon, null), public._kho_cau_tbl(p_mon, null), v_dk) into v_part using v_khoi;
    v_out := v_part;
  end if;

  -- Gắn da_luyen (coverage — vẫn hiện, chỉ KHÔNG còn dùng làm "%") từ sổ tu_luyen_dang_lan.
  select coalesce(jsonb_agg(
    x || jsonb_build_object('da_luyen', least(coalesce(tl.da_luyen, 0), (x->>'tong_cau')::int))
    order by x->>'ten_chuyen_de', x->>'ten_dang'
  ), '[]'::jsonb)
  into v_out
  from jsonb_array_elements(v_out) x
  left join (
    select ma_dang, count(distinct ma_cau) as da_luyen
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon
    group by ma_dang
  ) tl on tl.ma_dang = x->>'ma_dang';

  -- % = MASTERY thật (fn_mastery_cells, KHÔNG bịa công thức riêng — §2.0). Gọi 2 lần:
  --   (a) không giới hạn thời gian → SCORE thật (WINDOW=5 chuẩn, không bị cắt cụt).
  --   (b) p_since = đầu cửa sổ trước → CHỈ để biết dạng có hoạt động GẦN ĐÂY không.
  --   Dạng KHÔNG có ở (b) ⇒ "chưa đánh giá được" (pct=null), dù (a) có thể vẫn ra số
  --   từ dữ liệu CŨ — không hiện số đó ra màn (không chính xác cho ngữ cảnh "luyện gì bây giờ").
  return (
    with full_score as (
      select ma_dang, score, muc from public.fn_mastery_cells(array[v_hs], true, null, 5, 5, 3)
    ),
    recent as (
      select distinct ma_dang from public.fn_mastery_cells(array[v_hs], true, v_cutoff, 5, 5, 3)
    ),
    lst as (
      select x, fs.score, fs.muc, (r.ma_dang is not null) as gan_day
      from jsonb_array_elements(v_out) x
      left join full_score fs on fs.ma_dang = x->>'ma_dang'
      left join recent r on r.ma_dang = x->>'ma_dang'
    )
    select coalesce(jsonb_agg(
      x || jsonb_build_object(
        'pct', case when gan_day and score is not null then round(score * 100) else null end,
        'muc', case when gan_day then muc else null end
      )
      -- Yếu nhất lên đầu; "chưa đánh giá được" (pct null) xuống CUỐI (không phải yếu, là KHÔNG RÕ).
      order by (case when gan_day and score is not null then 0 else 1 end), score asc, x->>'ten_dang'
    ), '[]'::jsonb)
    from lst
  );
end $function$;

