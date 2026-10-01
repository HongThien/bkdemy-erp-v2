-- ============================================================================
-- 202609261247 — chuan_hoa_nhan_bai_giai
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO chốt 26/09 (spec-format-noidung.md): mọi nhãn lời giải chuẩn hoá thành "Bài giải:".
--   Trong kho, nhãn này luôn đứng 1 mình 1 dòng ("Giải:" / "**Giải:**" / "Giải :" / "Giải"), nên chỉ
--   thay ĐÚNG những dòng mà CẢ DÒNG chỉ có chữ "Giải" (+ dấu :/. + ** đậm) — câu văn kiểu
--   "Giải phương trình…" hay "Lời giải" KHÔNG khớp (case-sensitive, bắt buộc hết dòng).
--   Bọc ** bị bỏ: renderer (lythuyetBlocks.ts → nhan_giai) tự in đậm + căn giữa + gạch chân.
--   Dry run 26/09 (role claude_build): 94 bản ghi / 146 dòng — dai_dang 78/123, khtn_dang 13/20,
--   hgt_dang 2/2, dai_chuyen_de 1/1; 6 bảng còn lại 0.
--   ⚠ hinh_bo_de_ly_thuyet / hinh_dang_ly_thuyet đọc ra 0 dòng từ claude_build — có thể là điểm mù RLS
--   (bảng tạo tay bởi postgres, CLAUDE.md §2.1), UPDATE ở đó có thể không chạm được. Renderer vẫn
--   hiện "Bài giải:" cho dòng "Giải" chưa thay, nên sót ở đó chỉ lệch chữ trong DB, không lệch khi in.
--   Chỉ ghi dòng thật sự đổi (WHERE ~) ⇒ không bump cap_nhat_at vô cớ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Chữ "Giải"/dấu **…** gốc trên các dòng nhãn bị thay bằng "Bài giải:" (không lưu bản cũ).
-- ============================================================================

do $$
declare
  t text;
  n int;
  tong int := 0;
  -- (?n) = newline-sensitive: ^/$ khớp đầu/cuối TỪNG DÒNG. Nhóm 3 giữ \r nếu nội dung là CRLF.
  re constant text := '(?n)^[ \t]*(\*\*)?[ \t]*Giải[ \t]*[:.]?[ \t]*(\*\*)?[ \t]*(\r?)$';
begin
  foreach t in array array[
    'dai_chuyen_de_ly_thuyet', 'dai_dang_ly_thuyet',
    'hgt_chuyen_de_ly_thuyet', 'hgt_dang_ly_thuyet',
    'hinh_bo_de_ly_thuyet', 'hinh_dang_ly_thuyet', 'hinh_hoc_bai_ly_thuyet', 'hinh_mo_hinh_ly_thuyet',
    'khtn_chuyen_de_ly_thuyet', 'khtn_dang_ly_thuyet'
  ] loop
    execute format(
      'update %I set noi_dung = regexp_replace(noi_dung, $1, %L, %L), cap_nhat_at = now() where noi_dung ~ $1',
      t, 'Bài giải:\3', 'g')
      using re;
    get diagnostics n = row_count;
    tong := tong + n;
    raise notice '% : % bản ghi', t, n;
    -- Hậu kiểm: không còn dòng "Giải" đứng riêng nào trong bảng này (trong phạm vi role nhìn thấy).
    execute format('select count(*) from %I where noi_dung ~ $1', t) into n using re;
    if n > 0 then raise exception 'Còn % bản ghi chưa thay ở %', n, t; end if;
  end loop;
  raise notice 'TỔNG: % bản ghi đã chuẩn hoá', tong;
end $$;
