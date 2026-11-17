-- Sửa đề nốt BT.07.131.17 (cây MH.131 "Tam giác cụng đầu" → MH.228 → MH.229) — Thùy 17/11 "Sửa 131.17".
-- Giả thiết hiệu lực: M trung điểm BC, D đối xứng A qua M; N trung điểm AB; K đối xứng C qua N.
-- Toạ độ: D = B + C − A, K = A + B − C ⇒ BK = A − C, BD = C − A ⇒ K, B, D thẳng hàng (B là trung điểm KD).
-- Đề đang ghi "K, A, D" — sai (AK = B − C không cùng phương AD = B + C − 2A). Bài chưa có lời giải ⇒ chỉ sửa phát biểu.
do $$
declare v_n int;
begin
  update hinh_baitoan
     set phat_bieu = 'Chứng minh ba điểm $K, B, D$ thẳng hàng.', updated_at = now()
   where ma = 'BT.07.131.17' and phat_bieu = 'Chứng minh ba điểm $K, A, D$ thẳng hàng.';
  get diagnostics v_n = row_count;
  if v_n <> 1 then raise exception 'BT.07.131.17: sửa % dòng, cần đúng 1 (đề đã đổi?)', v_n; end if;
  update hinh_mo_hinh set updated_at = now()   -- đổi nội dung con ⇒ bump cha (CLAUDE §2)
   where id = (select mo_hinh_id from hinh_baitoan where ma = 'BT.07.131.17');
end $$;
