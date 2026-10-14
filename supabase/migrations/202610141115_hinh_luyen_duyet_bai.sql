-- ============================================================================
-- 202610141115 — hinh_luyen_duyet_bai
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   CEO 14/10: duyệt Hình phải nhìn đủ ĐỀ + ĐÁP ÁN CHI TIẾT + HÌNH của MỘT bài rồi mới sang bài khác
--   ("duyệt xong 1 câu mới qua câu khác, vì số lượng bài hình ít"). Màn chuyển sang mỗi lần 1 bài, nút
--   "Duyệt bài → bài kế" ⇒ duyệt mọi ý của bài trong MỘT lần ghi (không để client update từng ý rời — §2.0),
--   kèm ghi vết ai duyệt / lúc nào trên bài.
--
-- MẤT GÌ: không.
-- ============================================================================
create or replace function fn_hl_duyet_bai(p_bai uuid, p_duyet boolean default true)
returns void language plpgsql set search_path = public as $$
begin
  if not exists (select 1 from hinh_bai where id = p_bai) then raise exception 'Bài không tồn tại'; end if;
  update hinh_y set da_duyet = coalesce(p_duyet, true), updated_at = now()
   where bai_id = p_bai and da_duyet is distinct from coalesce(p_duyet, true);
  update hinh_bai
     set da_duyet = coalesce(p_duyet, true),
         duyet_boi = case when coalesce(p_duyet, true) then current_nhan_su_id() else null end,
         duyet_at  = case when coalesce(p_duyet, true) then now() else null end,
         updated_at = now()
   where id = p_bai;
end $$;

revoke execute on function fn_hl_duyet_bai(uuid, boolean) from public, anon;
grant execute on function fn_hl_duyet_bai(uuid, boolean) to authenticated;
