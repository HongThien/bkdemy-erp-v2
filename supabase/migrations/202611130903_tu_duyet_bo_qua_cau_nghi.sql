-- ============================================================================
-- 202611130903 — tu_duyet_bo_qua_cau_nghi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   LUẬT DUYỆT 13/11 (Thùy, HUỶ mọi luật duyệt trước): câu AI tự tin phân dạng ⇒ tự duyệt, NHƯNG chỉ khi lúc giải đã chắc
--   chắn đúng theo luật giải. Câu chưa chắc ⇒ vào danh sách cho người kiểm.
--   Trigger tự duyệt (mig 202611051930, mở rộng KHTN/Lý/Hoá sau đó) chỉ xét "gán mức cao + đủ đáp án", KHÔNG xét lời giải
--   có chắc không ⇒ câu trạm soạn ghi **Chưa chắc:** (nay ghi.mjs đánh kiem_may='nghi') và câu máy kiểm báo nghi vẫn tự duyệt.
--   Đo 13/11: 74 câu dai_cau_hoi đang kiem_may='nghi' mà đã duyet_nguon='ai' (lọt từ trước — mig này KHÔNG đụng, chờ Thùy quyết).
--   Thân hàm dựng từ pg_get_functiondef bản ĐANG CHẠY (đã có nhánh khtn/vatly/hoahoc), chỉ thêm 1 điều kiện. Hàm dùng chung
--   mọi môn ⇒ luật áp đối xứng mọi môn (CLAUDE.md §1.6), không viết nhánh riêng Toán.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Thu hẹp hành vi: câu kiem_may='nghi' thôi tự duyệt khi được gán mức cao / vào kho Đ/S (người duyệt tay vẫn được).
-- ============================================================================

create or replace function public._bdm_tu_duyet_sau_gan()
 returns trigger
 language plpgsql
as $function$
declare v_bang text := case when tg_table_name like 'hgt%' then 'hgt_cau_hoi'
                            when tg_table_name like 'khtn%' then 'khtn_cau_hoi'
                            when tg_table_name like 'vatly%' then 'vatly_cau_hoi'
                            when tg_table_name like 'hoahoc%' then 'hoahoc_cau_hoi'
                            else 'dai_cau_hoi' end;
begin
  if new.nguon = 'ai' then
    execute format($q$update public.%I q set da_duyet = true, duyet_nguon = 'ai', duyet_at = now()
      where q.ma_cau = $1 and q.da_duyet = false and q.xoa_at is null
        and q.kiem_may is distinct from 'nghi'
        and public._bdm_du_dap_an(q.loai_cau, q.dap_an, q.menh_de, q.loi_giai)$q$, v_bang) using new.ma_cau;
  end if;
  return null;
end $function$;

revoke execute on function public._bdm_tu_duyet_sau_gan() from public, anon;
