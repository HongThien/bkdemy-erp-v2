-- ============================================================================
-- 202611032041 — VÁ nhanhByCau cho ET bản đồ mới lưu thiếu nhánh kho câu Hình (lượt 2 — Thùy 03/11 "ET hình của 8S1 sao chưa lên")
-- ----------------------------------------------------------------------------
-- VÌ SAO: cùng lỗi mig 202611021909. ET 8S1 · 02/11 lưu 21:19 bằng bản app CHƯA có commit 94294a26 (19:09 02/11, deploy tay)
--   ⇒ cau_hinh.nhanhByCau thiếu ⇒ chấm/in tra câu trong kho Đại ⇒ 2 câu Hình rụng ⇒ buổi 0 ô ET, không chấm được.
-- QUÉT 03/11 20:40: đúng 1 ET — 8S1 · 02/11: HHC004381, HHC004384 (gốc) + HHC004376/377/378/379 (đề 2/3), cả 6 chỉ có ở hinh_hoc_cau_hoi.
-- NHÂN CHỨNG (y 202611021909): chỉ ghi khi mã KHÔNG ở dai_cau_hoi, KHÔNG ở khtn_cau_hoi (KHTN có ET bản đồ mới từ mig 202611031655,
--   kho KHTN không cần nhanhByCau) và ở ĐÚNG MỘT kho trong (hinh_hoc_cau_hoi ⇒ 'hinh_hoc' · hgt_cau_hoi ⇒ 'hinh_gt'). Mơ hồ ⇒ rollback cả lượt.
-- MẤT GÌ: không. Chỉ THÊM khoá vào cau_hinh.nhanhByCau; không đụng câu, mã đề, gán HS, ô chấm.
-- ============================================================================

do $$
declare v_n int;
begin
  create temp table _va on commit drop as
  with et as (select t.id, t.cau_hinh from tai_lieu t where t.loai = 'et' and t.ban_do = 'moi'),
  ma as (
    select et.id, tc.ma_cau from et join tai_lieu_phan p on p.tai_lieu_id = et.id join tai_lieu_cau tc on tc.phan_id = p.id
    union
    select et.id, v.ma from et, jsonb_each(coalesce(et.cau_hinh -> 'etMaDe', '{}'::jsonb)) e, jsonb_array_elements_text(e.value) v(ma)
  ),
  ung as (
    select ma.id, ma.ma_cau,
           exists (select 1 from hinh_hoc_cau_hoi h where h.ma_cau = ma.ma_cau) as o_hh,
           exists (select 1 from hgt_cau_hoi h where h.ma_cau = ma.ma_cau) as o_hgt
      from ma join et on et.id = ma.id
     where not exists (select 1 from dai_cau_hoi d where d.ma_cau = ma.ma_cau)
       and not exists (select 1 from khtn_cau_hoi d where d.ma_cau = ma.ma_cau)
       and et.cau_hinh -> 'nhanhByCau' ->> ma.ma_cau is null
  )
  select id, ma_cau, o_hh, o_hgt, case when o_hh then 'hinh_hoc' else 'hinh_gt' end as nhanh from ung;

  select count(*) into v_n from _va where o_hh = o_hgt;
  if v_n > 0 then raise exception '% mã không xác định được đúng 1 kho (cả hai / không kho nào) — dừng, xem lại', v_n; end if;
  select count(*) into v_n from _va;
  raise notice 'Vá nhanhByCau cho % (ET, mã câu)', v_n;

  update tai_lieu t
     set cau_hinh = jsonb_set(coalesce(t.cau_hinh, '{}'::jsonb), '{nhanhByCau}',
                              coalesce(t.cau_hinh -> 'nhanhByCau', '{}'::jsonb) || x.m),
         updated_at = now()
    from (select id, jsonb_object_agg(ma_cau, nhanh) as m from _va group by id) x
   where t.id = x.id;
end $$;
