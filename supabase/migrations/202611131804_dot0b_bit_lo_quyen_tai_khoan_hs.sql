-- ĐỢT 0b (13/11/2026) — bịt lỗ quyền với TÀI KHOẢN ĐÃ ĐĂNG NHẬP không phải nhân sự (học sinh). Chỉ đổi QUYỀN, không đổi dữ liệu.
-- Spec: spec-kien-truc.md §7, §10. Tiếp theo mig 202611131750 (đợt 0a).
-- Đã dò trước khi viết: app HS (từ src/main-hs.tsx, mức export) không đọc trực tiếp và không gọi hàm invoker nào chạm các view/bảng dưới đây;
-- không trigger invoker, policy, default nào chạy các view này dưới quyền người dùng. Nhân sự đọc/ghi như cũ (policy la_thanh_vien của bảng gốc).

set local lock_timeout = '5s';

-- ───────── A. 20 view: từ "chạy bằng quyền chủ view (bỏ qua RLS)" sang "chạy bằng quyền người gọi" ─────────
-- Trước: mọi tài khoản đăng nhập đọc (và với 2 view cập nhật được: GHI) kho câu + đáp án, bản đồ, số dư xu… qua view.
-- Sau: RLS của bảng gốc áp cho người gọi. Hàm security definer dùng các view này không đổi (chạy bằng chủ hàm).
alter view public.qlht_v_so_du_xu set (security_invoker = on);
alter view public.qlht_v_ton_qua set (security_invoker = on);
alter view public.v_hinh_chua_giai set (security_invoker = on);
alter view public.v_giaibai_nhan set (security_invoker = on);
alter view public.v_giaibai_bai set (security_invoker = on);
alter view public.v_giaibai_hoan_thien set (security_invoker = on);
alter view public.hinh_hoc_ban_do set (security_invoker = on);
alter view public.bdm_ban_do set (security_invoker = on);
alter view public.bdm_cau_dang set (security_invoker = on);
alter view public.bdm_cau_hoi set (security_invoker = on);
alter view public.bdm_cau_form_tn set (security_invoker = on);
alter view public.bdm_cau_menh_de set (security_invoker = on);
alter view public.bdm_dang_ly_thuyet set (security_invoker = on);
alter view public.bdm_ban_do_toan set (security_invoker = on);
alter view public.bdm_ban_do_hgt set (security_invoker = on);
alter view public.tl_bdm_chu_de_v set (security_invoker = on);
alter view public.tl_bdm_chuyen_de_v set (security_invoker = on);
alter view public.tl_bdm_o_v set (security_invoker = on);
alter view public.tl_bdm_nhom_v set (security_invoker = on);
alter view public.tl_bdm_dang_bai_v set (security_invoker = on);

-- ───────── B. 5 bảng đang cho MỌI tài khoản đăng nhập đọc + ghi (policy using(true)) ─────────
drop policy if exists dai_cau_menh_de_authenticated_all on public.dai_cau_menh_de;
drop policy if exists hgt_cau_menh_de_authenticated_all on public.hgt_cau_menh_de;
drop policy if exists nhap_kho_log_authenticated_all on public.nhap_kho_log;
drop policy if exists toan_de_thi_authenticated_all on public.toan_de_thi;
drop policy if exists toan_de_thi_cau_authenticated_all on public.toan_de_thi_cau;
drop policy if exists dai_cau_menh_de_member_all on public.dai_cau_menh_de;
create policy dai_cau_menh_de_member_all on public.dai_cau_menh_de for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
drop policy if exists hgt_cau_menh_de_member_all on public.hgt_cau_menh_de;
create policy hgt_cau_menh_de_member_all on public.hgt_cau_menh_de for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
drop policy if exists toan_de_thi_member_all on public.toan_de_thi;
create policy toan_de_thi_member_all on public.toan_de_thi for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
drop policy if exists toan_de_thi_cau_member_all on public.toan_de_thi_cau;
create policy toan_de_thi_cau_member_all on public.toan_de_thi_cau for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
drop policy if exists nhap_kho_log_member_all on public.nhap_kho_log;
create policy nhap_kho_log_member_all on public.nhap_kho_log for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));

-- ───────── C. Hàm ─────────
-- 4 hàm security definer không kiểm người gọi, không client nào gọi, người gọi trong DB đều là security definer ⇒ đóng hẳn với người dùng API.
revoke execute on function _khoi_quan_ly() from public, anon, authenticated;
revoke execute on function _qlcl_dong_bang_tuan(text,date,uuid) from public, anon, authenticated;
revoke execute on function fn_btyeu_dem(uuid) from public, anon, authenticated;
revoke execute on function increment_qaa_hit(uuid) from public, anon, authenticated;

-- 2 hàm nhân sự gọi từ client: thêm cổng.
do $d0g$
begin
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_viec_chup_phu_trach(date)'::regprocedure) is distinct from '7acdb0207004e1657e32b659270557fd' then
    raise exception 'dot 0b: % da doi tu luc sinh migration — sinh lai', 'fn_viec_chup_phu_trach';
  end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_ts_dk_form(integer,integer)'::regprocedure) is distinct from 'aa575b3d7ba6e25fdd93297ac47bd3ca' then
    raise exception 'dot 0b: % da doi tu luc sinh migration — sinh lai', 'fn_ts_dk_form';
  end if;
end
$d0g$;

CREATE OR REPLACE FUNCTION public.fn_viec_chup_phu_trach(p_tu date DEFAULT NULL::date)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_n int;
begin
  -- [dot 0b 13/11] cong: nguoi goi qua API phai la nhan su (tac vu nen / service role khong bi chan)
  if not (coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') or public.la_thanh_vien()) then
    raise exception 'Không có quyền thực hiện thao tác này' using errcode = '42501';
  end if;

  with b as (
    select bh.id, bh.lop_id, bh.ngay, bh.gio_bat_dau, l.mon, l.khoi,
           exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = bh.lop_id and tl.ngay = bh.ngay) as co_mt
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy'
      and bh.ngay >= coalesce(p_tu, v_hom_nay - 10) and bh.ngay <= v_hom_nay
  ),
  t as (   -- khâu của buổi: y hệt fn_viec_buoi_thuong (MT thay hẳn các khâu; ingame bỏ từ 01/10/2026)
    select b.*, x.tab, public.fn_han_viec(b.lop_id, b.ngay, b.gio_bat_dau, x.tab) as han
    from b cross join lateral unnest(
      case when b.co_mt then array['mt']
           when b.ngay >= date '2026-10-01' then array['danhgia', 'et', 'btvn']
           else array['danhgia', 'ingame', 'et', 'btvn'] end) as x(tab)
  ),
  cho as (
    select t.* from t
    where t.han is not null and t.han <= now()
      and not exists (select 1 from viec_phu_trach_snap s where s.buoi_id = t.id and s.tab = t.tab)
  )
  insert into viec_phu_trach_snap (buoi_id, tab, nhan_su_id, han, nguon)
  select c.id, c.tab, o.nhan_su_id, c.han, o.nguon
  from cho c
  cross join lateral public._viec_nguoi_luc_han(c.lop_id, c.mon, c.khoi, c.tab, c.han) o
  on conflict do nothing;
  get diagnostics v_n = row_count;
  return v_n;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ts_dk_form(p_so_ngay integer DEFAULT 14, p_som_phut integer DEFAULT 60)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_now  timestamp := public._ts_gio_vn();
  v_som  timestamp := v_now + greatest(p_som_phut, 0) * interval '1 minute';
  v_tu   date := v_now::date;
  v_den  date := v_now::date + least(greatest(p_so_ngay, 1), 90) - 1;
  v jsonb;
begin
  -- [dot 0b 13/11] cong: nguoi goi qua API phai la nhan su (tac vu nen / service role khong bi chan)
  if not (coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') or public.la_thanh_vien()) then
    raise exception 'Không có quyền thực hiện thao tác này' using errcode = '42501';
  end if;

  with mt as (select * from public._ts_mon_theo_lop()),
  tls as (select distinct thoi_luong_phut tl from mt where thoi_luong_phut is not null),
  buoi as (
    select b.*, (select jsonb_object_agg(tls.tl::text, s.gio)
                 from tls cross join lateral (
                   select jsonb_agg(jsonb_build_object('bat_dau', to_char(g.bat_dau, 'HH24:MI'), 'xong', to_char(g.xong, 'HH24:MI')) order by g.bat_dau) gio
                   from public._ts_gio_trong_buoi(b.ngay, b.tu, b.den, tls.tl, v_som) g) s
                 where s.gio is not null) as gio
    from public._ts_buoi_mo(v_tu, v_den) b
  )
  select jsonb_build_object(
    'hom_nay', v_tu,
    'lop', coalesce((select jsonb_agg(jsonb_build_object('lop', x.lop, 'ten', public._ts_ten_lop(x.lop), 'mon', x.mon) order by public._ts_lop_thu_tu(x.lop)) from (
              select lop, jsonb_agg(jsonb_build_object('mon', mon, 'thoi_luong_phut', thoi_luong_phut) order by mon) mon
              from mt where thoi_luong_phut is not null group by lop) x), '[]'::jsonb),
    'thieu_thoi_luong', coalesce((select jsonb_agg(jsonb_build_object('lop', lop, 'mon', mon) order by public._ts_lop_thu_tu(lop), mon)
                                  from mt where thoi_luong_phut is null), '[]'::jsonb),
    'truong', coalesce((select jsonb_agg(jsonb_build_object('ten', ten, 'cap', cap) order by ten)
                        from truong_hoc_dm where xoa_at is null), '[]'::jsonb),
    'lich', coalesce((select jsonb_agg(jsonb_build_object(
                        'khung_id', khung_id, 'ngay', ngay, 'thu', extract(isodow from ngay)::int,
                        'tu', to_char(tu, 'HH24:MI'), 'den', to_char(den, 'HH24:MI'), 'gio', gio) order by ngay, tu)
                      from buoi where gio is not null), '[]'::jsonb)
  ) into v;
  return v;
end $function$;

-- ───────── KIỂM CUỐI ─────────
do $d0k$
declare n int;
begin
  select count(*) into n from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind = 'v'
     and c.relname = any (array['qlht_v_so_du_xu','qlht_v_ton_qua','v_hinh_chua_giai','v_giaibai_nhan','v_giaibai_bai','v_giaibai_hoan_thien','hinh_hoc_ban_do','bdm_ban_do','bdm_cau_dang','bdm_cau_hoi','bdm_cau_form_tn','bdm_cau_menh_de','bdm_dang_ly_thuyet','bdm_ban_do_toan','bdm_ban_do_hgt','tl_bdm_chu_de_v','tl_bdm_chuyen_de_v','tl_bdm_o_v','tl_bdm_nhom_v','tl_bdm_dang_bai_v'])
     and coalesce((select option_value from pg_options_to_table(c.reloptions) where option_name = 'security_invoker'), 'off') not in ('on', 'true');
  if n > 0 then raise exception 'dot 0b: con % view chua security_invoker', n; end if;
  select count(*) into n from pg_policies where schemaname = 'public' and tablename = any (array['dai_cau_menh_de','hgt_cau_menh_de','toan_de_thi','toan_de_thi_cau','nhap_kho_log'])
     and roles::text ~ 'authenticated|public' and coalesce(qual, 'true') = 'true';
  if n > 0 then raise exception 'dot 0b: con % policy mo tren 5 bang', n; end if;
  select count(*) into n from pg_policies where schemaname = 'public' and tablename = any (array['dai_cau_menh_de','hgt_cau_menh_de','toan_de_thi','toan_de_thi_cau','nhap_kho_log']) and policyname like '%_member_all';
  if n <> 5 then raise exception 'dot 0b: thieu policy member_all (% / 5)', n; end if;
end
$d0k$;
