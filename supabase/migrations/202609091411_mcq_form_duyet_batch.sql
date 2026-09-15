-- MCQ FORM — DUYỆT HÀNG LOẠT (Thùy 09/09: "duyệt theo batch 20 câu, loại câu sai rồi duyệt tất cả 1 lượt, không
-- bấm từng câu"). Đảo lại quyết định 08/09 trong spec-mcq-form.md §6 ("KHÔNG có duyệt tất cả — CEO chốt duyệt
-- 100% pool 1 để đo precision") — vẫn đo được precision (mỗi form duyệt-hàng-loạt vẫn tính vào tk.duyet ở
-- fn_mcq_metric như duyệt tay, không sửa gì ⇒ duyet_khong_sua vẫn đúng), chỉ đổi CÁCH BẤM, không đổi công thức.
--
-- KHÔNG hỗ trợ "sửa rồi duyệt" hàng loạt (đó vẫn là luồng 1-câu qua fn_mcq_form_duyet có p_lua_chon) — hàng loạt
-- chỉ duyệt NGUYÊN VẸN các form còn lại sau khi Thùy đã loại (bỏ chọn) những câu sai trên màn.
-- Bỏ qua (không lỗi) form đã bị người khác duyệt/từ chối giữa chừng — trả về đếm để UI báo, không nổ giữa batch.
create or replace function public.fn_mcq_form_duyet_batch(p_kho text, p_ids uuid[], p_nguoi uuid)
returns jsonb language plpgsql as $$
declare v_n int;
begin
  perform public._mcq_kiem_kho(p_kho);
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  if p_ids is null or array_length(p_ids, 1) is null then raise exception 'Thiếu danh sách câu cần duyệt'; end if;
  execute format($q$
    update %I set da_duyet = true, duyet_boi = $2, duyet_at = now(), sua_truoc_duyet = false
    where id = any($1) and xoa_at is null and not da_duyet
  $q$, p_kho || '_cau_form_tn') using p_ids, p_nguoi;
  get diagnostics v_n = row_count;
  return jsonb_build_object('duyet', v_n, 'yeu_cau', array_length(p_ids, 1), 'bo_qua', array_length(p_ids, 1) - v_n);
end $$;
grant execute on function public.fn_mcq_form_duyet_batch(text, uuid[], uuid) to authenticated;
