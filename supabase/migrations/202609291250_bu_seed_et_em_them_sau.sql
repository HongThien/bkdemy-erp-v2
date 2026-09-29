-- Buổi bù: bù ô ET cho em được thêm vào buổi bù CÓ SẴN mà bị bỏ sót (Thùy 29/09: "Tuệ Anh, Tuệ Nhi cùng bù 6A1 hôm qua mà Tuệ Anh không hiện Đ/C/S").
-- Gốc: ensureBuoiBuETProblems (src/lib/botro.ts) idempotent theo BUỔI (`if (cur.length) return`) ⇒ em thêm SAU khi buổi đã seed em khác
-- không bao giờ có ô ET. Client đã sửa thành idempotent THEO EM (cùng commit). Migration này vá dữ liệu cho buổi CÒN CHẤM ĐƯỢC:
--   buổi bù chưa huỷ + ET CHƯA xác nhận (et_dong_at null) + buổi đã có ô ET của em khác (dấu vết đúng bug) + em chưa có ô nào
--   ⇒ chép lưới ET của CHÍNH buổi mẹ (ô không ẩn, giữ thứ tự, kèm ma_cau/ma_dang), problem_no nối tiếp.
-- Buổi đã xác nhận ET thì KHÔNG đụng (đo 29/09: 10 lượt em cũ, đã đóng — chỉ báo, không vá; muốn chấm phải mở lại ET).
-- Đo 29/09 trước khi áp: đúng 1 em khớp — Lê Tuệ Anh (HS0678), buổi bù 28/09, bù 6A1 24/09; lưới mẹ 3 ô T106020206 · T106020501 · T106030403
-- khớp THỨ TỰ với 3 ô đã seed cho Tuệ Nhi cùng buổi mẹ (nhân chứng thứ hai).
do $$
declare r record; v_no integer; v_n integer := 0;
begin
  for r in
    select b.id as bu, hh.hoc_sinh_id, hh.bu_cho_buoi_id as me
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id
    where b.loai = 'bu' and b.trang_thai <> 'huy' and b.et_dong_at is null and hh.bu_cho_buoi_id is not null
      and exists (select 1 from gami_session_problems p where p.buoi_hoc_id = b.id and p.phase = 'et' and p.hoc_sinh_id is not null)
      and not exists (select 1 from gami_session_problems p where p.buoi_hoc_id = b.id and p.phase = 'et' and p.hoc_sinh_id = hh.hoc_sinh_id)
      and exists (select 1 from gami_session_problems m where m.buoi_hoc_id = hh.bu_cho_buoi_id and m.phase = 'et' and not m.hidden)
    order by b.id, hh.hoc_sinh_id
  loop
    select coalesce(max(problem_no), 0) into v_no from gami_session_problems where buoi_hoc_id = r.bu and phase = 'et';
    insert into gami_session_problems (buoi_hoc_id, phase, problem_no, ma_dang, ma_cau, hoc_sinh_id)
      select r.bu, 'et', v_no + row_number() over (order by m.problem_no), m.ma_dang, m.ma_cau, r.hoc_sinh_id
      from gami_session_problems m where m.buoi_hoc_id = r.me and m.phase = 'et' and not m.hidden;
    v_n := v_n + 1;
  end loop;
  raise notice 'Bù ô ET cho % em (buổi bù chưa xác nhận ET).', v_n;
end $$;
