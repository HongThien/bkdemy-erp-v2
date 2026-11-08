-- ============================================================================
-- 202611051753_bdm_khop_dem_security_definer
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 "Lỗi: canceling statement due to statement timeout" ở Bản đồ mới (nút ✅ Duyệt kho đếm số câu) và màn Duyệt kho.
--   Đo bằng phiên app thật (authenticated, trần 8s): fn_bdm_khop_dem K6 QUÁ TRẦN · K10 2,7s · K11 2,4s · K12 1,8s · nguon_ds K12 1,5s
--   (danh sách câu đã phân trang 20 câu/trang, chỉ 0,3s — KHÔNG phải do tải nhiều câu). Cùng hàm chạy bằng quyền chủ bảng + giả phiên
--   admin: 0,3–0,4s ⇒ thủ phạm = RLS trên các bảng câu lớn (dai_cau_hoi 58k…) mà _bdm_khop_nguon đọc 4 lần (mỗi hàng chờ một lần).
--   Sửa như fn_bdm_cay (mig 202611021911): helper _bdm_khop_nguon (đếm · danh sách · nguồn · phạm vi đều đi qua nó) + hàm đếm chạy
--   SECURITY DEFINER, kiểm nhân sự MỘT lần (bọc ngoài where la_thanh_vien()); phạm vi duyệt từng người vẫn do _bdm_duyet_duoc (jwt) quyết.
--   KHTN (_khtn_bdm_khop_nguon, fn_khtn_bdm_khop_dem: 0,8–1,9s) làm cùng cho đối xứng (CLAUDE.md §1.6).
--   Thân hàm sinh NGUYÊN từ pg_get_functiondef (scratchpad gen_khop_definer.mjs), chỉ bọc ngoài.
--
-- MẤT GÌ (Luật xoá): Không mất gì — đổi thuộc tính quyền + bọc điều kiện nhân sự cho 4 hàm đọc.
-- ============================================================================

CREATE OR REPLACE FUNCTION public._bdm_khop_nguon(p_khoi text, p_hang text)
 RETURNS TABLE(ma_cau text, dang_bai_id text, chu_de_id text, ly_do text, chac text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select * from (
select * from (
    select dx.ma_cau, dx.dang_bai_id, cd.id as chu_de_id, dx.ly_do, dx.chac
      from dai_bdm_de_xuat dx
      join dai_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_dang_bai d on d.id = dx.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, null::text, t.ly_do, null::text
      from dai_bdm_cau_thieu_dang t
      join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'thieu' and b.khoi = p_khoi
       and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    select cg.ma_cau, null::text, null::text, ''::text, null::text
      from _bdm_cau_giai((select coalesce(array_agg(ma_dang), '{}') from dai_ban_do where khoi = p_khoi)) cg
      join dai_cau_hoi q on q.ma_cau = cg.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
     where p_hang = 'trong' and cg.la_goc and cg.dang_bai_id is null
       and not exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = cg.ma_cau)
       and not exists (select 1 from dai_bdm_cau_thieu_dang t where t.ma_cau = cg.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from dai_bdm_gan_cau g
      join dai_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_dang_bai d on d.id = g.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from dai_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0          -- ~10% cố định theo mã câu (không nhảy giữa các lần mở)

    -- ═════ HÌNH GIẢI TÍCH (hgt) — cùng luật, bảng hgt_* ═════
    union all
    select dx.ma_cau, dx.dang_bai_id, cd.id, dx.ly_do, dx.chac
      from hgt_bdm_de_xuat dx
      join hgt_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_dang_bai d on d.id = dx.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from hgt_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, cd.id, t.ly_do, null::text
      from hgt_bdm_cau_thieu_dang t
      join hgt_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_chu_de cd on cd.id = t.chu_de_id
     where p_hang = 'thieu' and cd.khoi = p_khoi
       and not exists (select 1 from hgt_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    select q.ma_cau, null::text, null::text, ''::text, null::text
      from hgt_cau_hoi q
      join hgt_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'trong' and b.khoi = p_khoi and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
       and exists (select 1 from dai_bdm_chu_de c2 where c2.khoi = p_khoi and c2.nhanh = 'hgt')
       and not exists (select 1 from hgt_bdm_gan_cau g where g.ma_cau = q.ma_cau)
       and not exists (select 1 from hgt_bdm_de_xuat x where x.ma_cau = q.ma_cau)
       and not exists (select 1 from hgt_bdm_cau_thieu_dang t where t.ma_cau = q.ma_cau)
       and not exists (select 1 from hgt_bdm_kho_ds k where k.ma_cau = q.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from hgt_bdm_gan_cau g
      join hgt_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_dang_bai d on d.id = g.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from hgt_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0
  ) s
  where _bdm_duyet_duoc(p_khoi, s.chu_de_id)
  ) z
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$;
revoke execute on function _bdm_khop_nguon(text,text) from public, anon;
grant execute on function _bdm_khop_nguon(text,text) to authenticated;

CREATE OR REPLACE FUNCTION public._khtn_bdm_khop_nguon(p_khoi text, p_hang text)
 RETURNS TABLE(ma_cau text, dang_bai_id text, chu_de_id text, ly_do text, chac text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select * from (
select * from (
    select dx.ma_cau, dx.dang_bai_id, cd.id as chu_de_id, dx.ly_do, dx.chac
      from khtn_bdm_de_xuat dx
      join khtn_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join khtn_bdm_dang_bai d on d.id = dx.dang_bai_id
      join khtn_bdm_nhom n on n.id = d.nhom_id
      join khtn_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, t.chu_de_id, t.ly_do, null::text
      from khtn_bdm_cau_thieu_dang t
      join khtn_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join khtn_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'thieu' and b.khoi = p_khoi
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    -- chưa có dạng: câu gốc của khối, chưa gán / chưa đề xuất / chưa báo thiếu. Chủ đề gợi ý = nhóm bản đồ mới dựng từ dạng cũ (ma_cu).
    select q.ma_cau, null::text, (select min(n.chu_de_id) from khtn_bdm_nhom n where n.ma_cu = q.dang_chinh), ''::text, null::text
      from khtn_cau_hoi q
      join khtn_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'trong' and b.khoi = p_khoi and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
       and exists (select 1 from khtn_bdm_chu_de c2 where c2.khoi = p_khoi)
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = q.ma_cau)
       and not exists (select 1 from khtn_bdm_de_xuat x where x.ma_cau = q.ma_cau)
       and not exists (select 1 from khtn_bdm_cau_thieu_dang t where t.ma_cau = q.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from khtn_bdm_gan_cau g
      join khtn_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai' and q.parent_ma_cau is null
      join khtn_bdm_dang_bai d on d.id = g.dang_bai_id
      join khtn_bdm_nhom n on n.id = d.nhom_id
      join khtn_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from khtn_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0          -- ~10% cố định theo mã câu (như Toán)
  ) s
  where public._khtn_bdm_duyet_duoc(p_khoi)
  ) z
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$;
revoke execute on function _khtn_bdm_khop_nguon(text,text) from public, anon;
grant execute on function _khtn_bdm_khop_nguon(text,text) to authenticated;

CREATE OR REPLACE FUNCTION public.fn_bdm_khop_dem(p_khoi text, p_chu_de text DEFAULT NULL::text, p_nguon text DEFAULT NULL::text, p_loc text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select z.x from (
with h as (select * from unnest(array['de_xuat', 'thieu', 'trong', 'mau']) h),
  s as (
    select h.h, count(s.*) n
      from h left join lateral (
        select x.* from _bdm_khop_nguon(p_khoi, h.h) x
         where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
           and (p_nguon is null or p_nguon = any(_kho_nguon_cau(x.ma_cau)))
           and _bdm_khop_trong_loc(p_loc, x.dang_bai_id, x.chu_de_id)) s on true
     group by h.h
  )
  select jsonb_build_object(
    'de_xuat', (select n from s where h = 'de_xuat'),
    'thieu',   (select n from s where h = 'thieu'),
    'trong',   (select n from s where h = 'trong'),
    'mau',     (select n from s where h = 'mau'),
    'kiem_n',   (select count(*) from (
                   select k.ma_cau, k.dang_bai_ai_id from dai_bdm_kiem_mau k union all select k.ma_cau, k.dang_bai_ai_id from hgt_bdm_kiem_mau k) k
                   join dai_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi),
    'kiem_giu', (select count(*) from (
                   select k.ma_cau, k.dang_bai_ai_id, k.ket_qua from dai_bdm_kiem_mau k union all select k.ma_cau, k.dang_bai_ai_id, k.ket_qua from hgt_bdm_kiem_mau k) k
                   join dai_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
                  where cd.khoi = p_khoi and k.ket_qua = 'giu')
  )
  ) z(x)
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$;
revoke execute on function fn_bdm_khop_dem(text,text,text,text) from public, anon;
grant execute on function fn_bdm_khop_dem(text,text,text,text) to authenticated;

CREATE OR REPLACE FUNCTION public.fn_khtn_bdm_khop_dem(p_khoi text, p_chu_de text DEFAULT NULL::text, p_nguon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select z.x from (
with s as materialized (select x.ma_cau, x.chu_de_id, h.hang from unnest(array['de_xuat', 'thieu', 'trong', 'mau']) h(hang)
                           cross join lateral public._khtn_bdm_khop_nguon(p_khoi, h.hang) x
                          where (p_chu_de is null or x.chu_de_id is null or x.chu_de_id = p_chu_de)
                            and (p_nguon is null or p_nguon = any(public._kho_nguon_cau(x.ma_cau))))
  select jsonb_build_object(
    'de_xuat', (select count(*) from s where hang = 'de_xuat'),
    'thieu',   (select count(*) from s where hang = 'thieu'),
    'trong',   (select count(*) from s where hang = 'trong'),
    'mau',     (select count(*) from s where hang = 'mau'),
    'kiem_n',   (select count(*) from khtn_bdm_kiem_mau k join khtn_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi),
    'kiem_giu', (select count(*) from khtn_bdm_kiem_mau k join khtn_bdm_dang_bai d on d.id = k.dang_bai_ai_id
                   join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi and k.ket_qua = 'giu')
  )
  ) z(x)
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$;
revoke execute on function fn_khtn_bdm_khop_dem(text,text,text) from public, anon;
grant execute on function fn_khtn_bdm_khop_dem(text,text,text) to authenticated;
