-- ============================================================================
-- 202611112138 — toi_uu_phien_ds
-- ----------------------------------------------------------------------------
-- VÌ SAO (audit timeout 11/11, reports/audit-timeout-11-11.md):
--   fn_phien_ds (màn danh sách phiên Claude, authenticated) 8.730 lần · TB 112 ms · max 6,8 s.
--   Đo 11/11: ~77 ms/lần, 5.979 buffer — gần hết là _truong_khoi_tro_len(mon, khoi) gọi LẠI cho TỪNG PHIÊN
--   (30 phiên ⇒ 30 lần tra quyền, mỗi lần ~2,5 ms), trong khi chỉ có ~11 cặp (môn, khối) khác nhau.
--   Số lần gọi cao vì màn hỏi lại mỗi 15 s kể cả khi tab ẩn (sửa ở PhienClaudeTab.tsx cùng đợt).
-- SỬA (cùng nghĩa): tra quyền MỘT LẦN cho mỗi cặp (môn, khối) có phiên (CTE materialized), rồi lọc.
--   Cùng hàm quyền _truong_khoi_tro_len — không chép công thức quyền ra chỗ thứ hai.
--   Số tin / đang chạy / tin cuối: giữ nguyên (claude_phien_tin_phien_idx đã có).
--
-- ĐO (ROLLBACK, 9 tài khoản thật kể cả không quyền): 91–137 ms / 3.751–7.561 buffer → 20–45 ms / 1.291–3.134 buffer;
--   JSON trả về khớp 9/9.
--
-- MẤT GÌ (Luật xoá): không có. Chỉ thay thân 1 hàm (cùng chữ ký, cùng quyền).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_phien_ds(p_gioi_han integer DEFAULT 100)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with toi as materialized (select public.jwt_uid() as uid),
  quyen as materialized (   -- 11/11: mỗi cặp (môn, khối) tra quyền 1 lần, không phải mỗi phiên 1 lần
    select k.mon, k.khoi, public._truong_khoi_tro_len(k.mon, k.khoi) as ok
      from (select distinct p.mon, p.khoi from claude_phien p) k
  )
  select coalesce(jsonb_agg(x.j order by x.updated_at desc), '[]'::jsonb) from (
    select p.updated_at, jsonb_build_object(
      'id', p.id, 'loai', p.loai, 'mon', p.mon, 'khoi', p.khoi, 'tieu_de', p.tieu_de,
      'trang_thai', p.trang_thai, 'created_at', p.created_at, 'updated_at', p.updated_at,
      'nguoi_mo_ten', ns.ho_ten, 'cua_toi', p.nguoi_mo = toi.uid,
      'so_tin', (select count(*) from claude_phien_tin t where t.phien_id = p.id),
      'dang_chay', exists (select 1 from claude_phien_tin t where t.phien_id = p.id and t.trang_thai in ('cho', 'dang_xu', 'dang_viet')),
      'tin_cuoi', (select jsonb_build_object('vai', t.vai, 'noi_dung', left(t.noi_dung, 160), 'at', t.created_at)
                     from claude_phien_tin t where t.phien_id = p.id order by t.id desc limit 1)
    ) as j
      from claude_phien p
      cross join toi
      join quyen q on q.mon is not distinct from p.mon and q.khoi is not distinct from p.khoi
      left join nhan_su ns on ns.id = p.nhan_su_id
     where p.nguoi_mo = toi.uid or q.ok
     order by p.updated_at desc
     limit greatest(1, least(coalesce(p_gioi_han, 100), 300))
  ) x
$function$;
