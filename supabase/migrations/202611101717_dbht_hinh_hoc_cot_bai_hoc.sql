-- DASHBOARD HỌC TẬP — HÌNH–HỌC THEO CẤU TRÚC RIÊNG 3 TẦNG (Thùy 10/11).
-- Hình–Học: Chủ đề (dai_bdm_chu_de qua hinh_hoc_bai.chu_de_id) → BÀI HỌC, mà bài học = chuyên đề = nhóm = dạng (Thùy 28/10, cùng 1 đối tượng).
-- Trước: câu Hình–Học không có mô hình ⇒ tầng chuyên đề / nhóm bài dồn hết vào 1 cột "Hình". Nay:
--   · chủ đề   → 'H:<chu_de_id>' (như cũ; bài chưa xếp chủ đề vẫn ở cột "Hình")
--   · chuyên đề → 'HH:<ma_bai>'  (mỗi bài học 1 cột)
--   · nhóm bài  → 'HH:<ma_bai>'  (cùng bài học)
-- Hình–Luyện (mô hình / trọng điểm / nhóm bài) GIỮ NGUYÊN. Cùng cách quy với Đánh giá cuối cấp (_dgcc_nut: bài học = chuyên đề = nhóm).
-- Sửa thẳng trên định nghĩa ĐANG CHẠY (không chép tay) — đoạn cần thay không còn đúng nguyên văn ⇒ dừng, không áp nửa vời.
do $mig$
declare d text; n text;
begin
  -- 1. _dbht_cau: câu Hình–Học ⇒ cột bài học ở tầng chuyên đề + nhóm
  select pg_get_functiondef('public._dbht_cau(uuid[], date, text)'::regprocedure) into d;
  n := replace(d, $a$'H:' || g.id::text, 'HINH') as nhom_id,$a$,
                  $a$'H:' || g.id::text, 'HH:' || hhb.ma_bai, 'HINH') as nhom_id,$a$);
  n := replace(n, $a$coalesce('H:' || g.id::text, 'HINH') as chuyen_de_id,$a$,
                  $a$coalesce('H:' || g.id::text, 'HH:' || hhb.ma_bai, 'HINH') as chuyen_de_id,$a$);
  if n = d or (length(n) - length(d)) <> 2 * length($a$'HH:' || hhb.ma_bai, $a$) then
    raise exception '_dbht_cau đã đổi so với lúc viết mig (không thấy đúng 2 chỗ cần thay)';
  end if;
  execute n;

  -- 2. fn_dbht_bang: cột 'HH:<bài>' không thuộc khuôn Đại; tên cột = "Hình · <bài học>", cha (tầng nhóm) = chủ đề
  select pg_get_functiondef('public.fn_dbht_bang(text, text, integer, text)'::regprocedure) into d;
  n := replace(d, $a$where cot.cot not like 'H:%' and cot.cot <> 'HINH'$a$,
                  $a$where cot.cot not like 'H:%' and cot.cot not like 'HH:%' and cot.cot <> 'HINH'$a$);
  n := replace(n, $a$    select 'HINH', 'Hình', null, 2, 0, 0, 0 from cot where cot.cot = 'HINH'$a$,
                  $a$    select cot.cot, 'Hình–Học · ' || hb.ten_bai, case when p_cap = 'nhom' then coalesce(cdh.ten, 'Hình – Học') end,
           1, coalesce(cdh.thu_tu, 0), coalesce(hb.thu_tu, 0), 3
      from cot join hinh_hoc_bai hb on hb.ma_bai = substr(cot.cot, 4)
      left join dai_bdm_chu_de cdh on cdh.id = hb.chu_de_id
     where cot.cot like 'HH:%'
    union all
    select 'HINH', 'Hình', null, 2, 0, 0, 0 from cot where cot.cot = 'HINH'$a$);
  if n = d or position($a$cot.cot not like 'HH:%'$a$ in n) = 0 or position($a$where cot.cot like 'HH:%'$a$ in n) = 0 then
    raise exception 'fn_dbht_bang đã đổi so với lúc viết mig (không thấy đoạn cần thay)';
  end if;
  execute n;
end $mig$;
