-- ============================================================================
-- CÂY HÌNH = GIẢ THIẾT NỐI GIẢ THIẾT · BÀI NỐI BÀI (Thùy 22/10, duyệt mockup docs/mockup-hinh-gia-thiet-mh072.html)
-- Thay cho "nhánh rẽ ra từ bài mẹ" (neo_baitoan_id, mig 202610140048) — Thùy: "chia nhánh là từ giả thiết; KHÔNG bao giờ
-- bài toán nối vào giả thiết; bài toán chỉ nối với bài toán theo quan hệ trước sau".
--   · Giả thiết mô hình (gốc) và mỗi giả thiết thêm (nhánh, la_mo_hinh = false) là cùng một kiểu nút.
--     Nhánh nối với giả thiết CHA bằng cạnh hinh_mo_hinh_cha (bảng của hệ cũ, unique(mo_hinh_id) ⇒ đúng 1 cha).
--   · Cạnh thêm cột `chinh`: nhánh CHÍNH đi thẳng tiếp giả thiết cha (mỗi cha tối đa 1), còn lại là nhánh PHỤ (rẽ).
--   · Bài thuộc 1 giả thiết (hinh_baitoan.mo_hinh_id); quan hệ bài → bài = tiền đề (hinh_cach_tien_de), không đổi.
--   · Số hiển thị bài = B1, B2… theo thứ tự tạo trong cả cây (như file của Thùy); mã bài không đổi.
-- Dữ liệu: 7 nhánh đang neo vào bài (đều của MH.072, tạo 22/10) ⇒ chuyển sang cạnh cha (cha = giả thiết chứa bài neo),
-- đánh dấu 4 nhánh chính theo file; B7 thêm tiền đề B1 ("từ B1 tạo ra 2, 3, 4, 7"). Hàm rẽ-từ-bài khoá lại (báo lỗi rõ).
-- ============================================================================

alter table public.hinh_mo_hinh_cha add column if not exists chinh boolean not null default false;
create unique index if not exists hinh_mo_hinh_cha_mot_chinh on public.hinh_mo_hinh_cha (cha_id) where chinh;

-- ── gốc cây: leo cạnh cha khi còn là NHÁNH (la_mo_hinh = false); mô hình / mô hình con kiểu cũ là gốc riêng ──
create or replace function public.fn_hl_goc_mo_hinh(p_mh uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
declare v_cur uuid := p_mh; v_up uuid; v_la boolean; v_n int := 0;
begin
  loop
    select la_mo_hinh into v_la from hinh_mo_hinh where id = v_cur;
    exit when v_la is distinct from false or v_n >= 64;
    v_up := public._hl_cha_mo_hinh(v_cur);
    exit when v_up is null;
    v_cur := v_up; v_n := v_n + 1;
  end loop;
  return v_cur;
end $function$;

-- ── số hiển thị: B1, B2… theo thứ tự tạo (mã) của mọi bài trong cây ──
create or replace function public.fn_hl_so_hien_thi(p_goc uuid)
 RETURNS TABLE(baitoan_id uuid, mo_hinh_id uuid, so text, ma text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with recursive cay(id) as (
    select p_goc
    union all
    select c.mo_hinh_id from hinh_mo_hinh_cha c join cay on c.cha_id = cay.id
      join hinh_mo_hinh m on m.id = c.mo_hinh_id and m.la_mo_hinh = false
  )
  select b.id, b.mo_hinh_id, 'B' || row_number() over (order by length(b.ma), b.ma), b.ma
    from hinh_baitoan b join cay on cay.id = b.mo_hinh_id
$function$;

-- ── thêm giả thiết (nhánh chính / phụ) vào một giả thiết cha ──
create or replace function public.fn_hl_them_gia_thiet(p_cha uuid, p_ten text, p_gia_thiet_them text, p_chinh boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v_goc uuid; v_phan text; v_khoi text; v_n uuid;
begin
  if not exists (select 1 from hinh_mo_hinh where id = p_cha) then raise exception 'Giả thiết cha không tồn tại'; end if;
  if coalesce(btrim(p_gia_thiet_them), '') = '' then raise exception 'Chưa nhập giả thiết thêm'; end if;
  if p_chinh and exists (select 1 from hinh_mo_hinh_cha where cha_id = p_cha and chinh) then
    raise exception 'Giả thiết này đã có nhánh CHÍNH — thêm nhánh phụ, hoặc đổi nhánh chính cũ thành phụ trước';
  end if;
  v_goc := public.fn_hl_goc_mo_hinh(p_cha);
  select phan, khoi into v_phan, v_khoi from hinh_mo_hinh where id = v_goc;
  insert into hinh_mo_hinh(ten, gia_thiet, gia_thiet_them, la_mo_hinh, phan, khoi, thu_tu)
  values (coalesce(nullif(btrim(p_ten), ''), btrim(p_gia_thiet_them)), '', btrim(p_gia_thiet_them), false, v_phan, v_khoi,
          coalesce((select count(*) from hinh_mo_hinh_cha where cha_id = p_cha), 0) + 1)
  returning id into v_n;
  insert into hinh_mo_hinh_cha(mo_hinh_id, cha_id, chinh) values (v_n, p_cha, coalesce(p_chinh, false));
  update hinh_mo_hinh set updated_at = now() where id = p_cha;
  return public._hl_ket_qua(v_goc, v_n);
end $function$;
revoke all on function public.fn_hl_them_gia_thiet(uuid, text, text, boolean) from public;
grant execute on function public.fn_hl_them_gia_thiet(uuid, text, text, boolean) to authenticated;

-- ── dời giả thiết sang cha khác và/hoặc đổi chính ↔ phụ (cùng cây, cấm vòng) ──
create or replace function public.fn_hl_doi_cha_gia_thiet(p_nhanh uuid, p_cha uuid, p_chinh boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v_goc uuid;
begin
  if not exists (select 1 from hinh_mo_hinh where id = p_nhanh and la_mo_hinh = false) then raise exception 'Chỉ dời được nhánh giả thiết'; end if;
  v_goc := public.fn_hl_goc_mo_hinh(p_nhanh);
  if public.fn_hl_goc_mo_hinh(p_cha) <> v_goc then raise exception 'Chỉ dời trong cùng một cây'; end if;
  if p_nhanh = any(public._hl_duong_mo_hinh(p_cha)) then raise exception 'Không dời được: giả thiết cha mới nằm trong chính nhánh này (vòng)'; end if;
  if p_chinh and exists (select 1 from hinh_mo_hinh_cha where cha_id = p_cha and chinh and mo_hinh_id <> p_nhanh) then
    raise exception 'Giả thiết cha đã có nhánh CHÍNH khác';
  end if;
  update hinh_mo_hinh_cha set cha_id = p_cha, chinh = coalesce(p_chinh, false) where mo_hinh_id = p_nhanh;
  update hinh_mo_hinh set updated_at = now() where id in (p_nhanh, p_cha);
  return public._hl_ket_qua(v_goc);
end $function$;
revoke all on function public.fn_hl_doi_cha_gia_thiet(uuid, uuid, boolean) from public;
grant execute on function public.fn_hl_doi_cha_gia_thiet(uuid, uuid, boolean) to authenticated;

-- ── khoá các thao tác kiểu cũ "rẽ nhánh từ bài" ──
create or replace function public.fn_hl_re_nhanh(p_bai_ids uuid[], p_ten text DEFAULT NULL::text, p_gia_thiet_them text DEFAULT NULL::text)
 RETURNS jsonb LANGUAGE plpgsql SET search_path TO 'public'
AS $function$ begin raise exception 'Đã đổi (22/10): nhánh rẽ từ GIẢ THIẾT, không rẽ từ bài — dùng "＋ Nhánh" ở giả thiết'; end $function$;
create or replace function public.fn_hl_re_nhanh_tu_bai(p_bai_me uuid, p_ten text, p_gia_thiet_them text, p_phat_bieu text,
    p_gia_thiet_rieng text DEFAULT NULL::text, p_loi_giai text DEFAULT NULL::text, p_anh text DEFAULT NULL::text, p_tien_de uuid[] DEFAULT '{}'::uuid[])
 RETURNS jsonb LANGUAGE plpgsql SET search_path TO 'public'
AS $function$ begin raise exception 'Đã đổi (22/10): nhánh rẽ từ GIẢ THIẾT, không rẽ từ bài — dùng "＋ Nhánh" ở giả thiết'; end $function$;
create or replace function public.fn_hl_doi_neo(p_nhanh uuid, p_bai_moi uuid)
 RETURNS jsonb LANGUAGE plpgsql SET search_path TO 'public'
AS $function$ begin raise exception 'Đã đổi (22/10): nhánh gắn vào GIẢ THIẾT cha — dùng "dời sang giả thiết khác"'; end $function$;

-- ── 4 hàm đọc: "mô hình gốc" phải là mô hình thật, không phải nhánh giả thiết (nhánh mới có neo NULL) ──
-- fn_hl_mo_hinh_luyen: gốc cây = mô hình (la_mo_hinh), không phải nhánh giả thiết
CREATE OR REPLACE FUNCTION public.fn_hl_mo_hinh_luyen(p_khoi text)
 RETURNS TABLE(id uuid, ma text, ten text, chu_de_id text, so_bai bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select g.id, g.ma, g.ten, g.chu_de_id,
         (select count(*) from fn_hl_so_hien_thi(g.id))
    from hinh_mo_hinh g
   where g.phan = 'luyen' and g.neo_baitoan_id is null and g.la_mo_hinh and (p_khoi is null or g.khoi = p_khoi)
   order by g.ma
$function$;

-- fn_hl_dem_kho_mo_hinh: gốc cây = mô hình (la_mo_hinh), không phải nhánh giả thiết
CREATE OR REPLACE FUNCTION public.fn_hl_dem_kho_mo_hinh(p_khoi text)
 RETURNS TABLE(mo_hinh_id uuid, so_chuoi bigint, so_y bigint, so_y_da_gan bigint)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select g.id,
         count(distinct hb.id),
         count(y.id),
         count(y.id) filter (where y.baitoan_id in (select s.baitoan_id from fn_hl_so_hien_thi(g.id) s))
    from hinh_mo_hinh g
    left join lateral (
      select hb.id from hinh_bai hb
       where hb.mo_hinh_id = g.id
          or exists (select 1 from hinh_y y2 where y2.bai_id = hb.id
                       and y2.baitoan_id in (select s.baitoan_id from fn_hl_so_hien_thi(g.id) s))
    ) hb on true
    left join hinh_y y on y.bai_id = hb.id
   where g.phan = 'luyen' and g.neo_baitoan_id is null and g.la_mo_hinh and (p_khoi is null or g.khoi = p_khoi)
   group by g.id
$function$;

-- fn_hl_bai_mo_hinh_luyen: gốc cây = mô hình (la_mo_hinh), không phải nhánh giả thiết
CREATE OR REPLACE FUNCTION public.fn_hl_bai_mo_hinh_luyen(p_khoi text)
 RETURNS TABLE(baitoan_id uuid, ma text, so text, phat_bieu text, goc_id uuid, goc_ma text, goc_ten text, nhanh_id uuid, nhanh_ten text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select s.baitoan_id, s.ma, s.so, b.phat_bieu, g.id, g.ma, g.ten, n.id, n.ten
    from hinh_mo_hinh g
    cross join lateral fn_hl_so_hien_thi(g.id) s
    join hinh_baitoan b on b.id = s.baitoan_id
    join hinh_mo_hinh n on n.id = s.mo_hinh_id
   where g.phan = 'luyen' and g.neo_baitoan_id is null and g.la_mo_hinh and (p_khoi is null or g.khoi = p_khoi)
   order by g.ma, s.so
$function$;

-- fn_hl_gan_bai_mo_hinh: gốc cây = mô hình (la_mo_hinh), không phải nhánh giả thiết
CREATE OR REPLACE FUNCTION public.fn_hl_gan_bai_mo_hinh(p_bai uuid, p_mo_hinh uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  if not exists (select 1 from hinh_bai where id = p_bai) then raise exception 'Bài kho không tồn tại'; end if;
  if p_mo_hinh is not null and not exists (
       select 1 from hinh_mo_hinh where id = p_mo_hinh and phan = 'luyen' and neo_baitoan_id is null and la_mo_hinh) then
    raise exception 'Chỉ gán được vào mô hình LUYỆN (mô hình gốc, không phải nhánh)';
  end if;
  update hinh_bai set mo_hinh_id = p_mo_hinh, updated_at = now() where id = p_bai;
end $function$;

-- ── DỮ LIỆU: 7 nhánh MH.072 neo vào bài ⇒ cạnh cha = giả thiết chứa bài neo; nhánh chính theo file ──
insert into hinh_mo_hinh_cha (mo_hinh_id, cha_id, chinh)
select m.id, b.mo_hinh_id, false
  from hinh_mo_hinh m join hinh_baitoan b on b.id = m.neo_baitoan_id
 where m.la_mo_hinh = false
on conflict (mo_hinh_id, cha_id) do nothing;
update hinh_mo_hinh set neo_baitoan_id = null, updated_at = now() where la_mo_hinh = false and neo_baitoan_id is not null;
update hinh_mo_hinh_cha c set chinh = true
  from hinh_mo_hinh m
 where m.id = c.mo_hinh_id and m.la_mo_hinh = false
   and m.ten in ('Kẻ AH ⊥ BC', 'K đối xứng với M qua E', 'I đối xứng với M qua D', 'Kẻ MF ⊥ AK')
   and public.fn_hl_goc_mo_hinh(m.id) = (select id from hinh_mo_hinh where ma = 'MH.072');
-- B7 "đi từ B6 hoặc từ B1": thêm B1 (B6 đã có)
insert into hinh_cach_tien_de (cach_id, tien_de_id, keo_gt_phu)
select cg.id, b1.id, false
  from hinh_baitoan b7 join hinh_baitoan b1 on b1.ma = 'BT.08.072.01'
  join lateral (select g.id from hinh_cach_giai g where g.baitoan_id = b7.id order by g.la_mac_dinh desc, g.thu_tu limit 1) cg on true
 where b7.ma = 'BT.08.072.07'
   and not exists (select 1 from hinh_cach_tien_de t where t.cach_id = cg.id and t.tien_de_id = b1.id);
