-- ============================================================================
-- 202611171216 — mtt_phan1_la_bai_hoc_trong_tuan
-- VÌ SAO: Thùy 17/11 — "Kiến thức mới phải là bài CHƯA học, và tuần tới là tuần học. Chỉ thế thôi." Tờ 8A1 tuần 16–22/11 đưa
--   "Đường trung bình" (học CN 15/11 = buổi CUỐI TUẦN TRƯỚC) vào Phần 1 vì cửa sổ cũ (spec 13/11) lấy "buổi cuối tuần trước + buổi đầu tuần này".
--   Luật mới: Phần 1 = nhóm của các buổi học DIỄN RA TRONG TUẦN (ngày ∈ [thứ Hai, CN]). Bài của buổi tuần trước đã học xong, không phải kiến thức mới.
--   Số lần đo k GIỮ NGUYÊN công thức (ET buổi trong tuần + BTVN buổi mà buổi kế còn trong tuần) — chỉ đổi buổi nào ĐƯỢC LÀM Phần 1.
--   Việc của con (ET / BTVN nộp trong tuần) KHÔNG đổi: BTVN CN 15/11 hạn T5 19/11 vẫn hiện là việc của em, chỉ không còn tạo mục tiêu Phần 1.
--   Dòng "cuối tuần này con sẽ học thêm … (tính vào tuần sau)" BỎ: buổi cuối tuần giờ thuộc Phần 1 của chính tuần này, không còn gì "tính vào tuần sau".
-- Cách làm: vá đúng 3 đoạn trên thân ĐANG CHẠY (pg_get_functiondef), mỗi đoạn phải khớp đúng 1 chỗ, lệch ⇒ raise (như mig 202611161844).
--   (1) _mtt_tinh   — nhóm Phần 1 lấy cờ 'w' (buổi trong tuần) thay cho 's'.
--   (2) _mtt_tinh   — v_sap luôn rỗng.
--   (3) _mtt_dang_nhom — dạng của buổi 'w' (kể cả buổi cuối tuần, trước đây không có 's' nên mất dạng).
-- MẤT GÌ: không xoá dữ liệu. Tờ NHÁP của lớp chưa công bố đổi nhóm Phần 1 (đúng ý). Lớp ĐÃ công bố: nhóm lấy từ bản khoá mtt_ke_hoach ⇒ KHÔNG đổi
--   (muốn đổi phải mở khoá — quyết định riêng). Bảng đệm tờ tự tính lại ở lượt điều phối kế.
-- ============================================================================
do $do$
declare d text; n text; c int;
  cu1 text := replace($a$        select n.value #>> '{}' as ma,
               (case when (bb.b->>'w')::boolean then 1 else 0 end) + (case when (bb.b->>'s')::boolean then 1 else 0 end) as k,
               (bb.b->>'s')::boolean as s, true as goc, bb.b->'ngay' as ngay$a$, E'\r', '');
  mo1 text := replace($a$        select n.value #>> '{}' as ma,
               (case when (bb.b->>'w')::boolean then 1 else 0 end) + (case when (bb.b->>'s')::boolean then 1 else 0 end) as k,
               (bb.b->>'w')::boolean as s, true as goc, bb.b->'ngay' as ngay   /* 17/11: Phần 1 = bài của buổi DIỄN RA TRONG TUẦN (w), không phải buổi cuối tuần trước */$a$, E'\r', '');
  cu2 text := replace($a$   where (e->>'w')::boolean and not (e->>'s')::boolean
   order by e->>'ngay' limit 1;$a$, E'\r', '');
  mo2 text := replace($a$   where false   /* 17/11: bỏ "sắp học (tính vào tuần sau)" — buổi cuối tuần giờ thuộc Phần 1 của chính tuần này */
   order by e->>'ngay' limit 1;$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_tinh(uuid,text,date,timestamptz)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cu1, ''))) / length(cu1);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn nhóm Phần 1 khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu1, mo1);
  c := (length(d) - length(replace(d, cu2, ''))) / length(cu2);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn sắp học khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu2, mo2);
  execute d;
end $do$;

do $do$
declare d text; c int;
  cu text := replace($a$    select x.o from b cross join lateral unnest(public._mtt_o_buoi(b.lop_id, b.ngay, b.id)) as x(o)$a$, E'\r', '');
  mo text := replace($a$    select x.o from b cross join lateral unnest(public._mtt_o_buoi(b.lop_id, b.ngay, b.id)) as x(o) where b.w   /* 17/11: dạng của buổi trong tuần */$a$, E'\r', '');
  cuB text := replace($a$    select nullif(e->>'id', '')::uuid as id, (e->>'lop_id')::uuid as lop_id, (e->>'ngay')::date as ngay
      from jsonb_array_elements(coalesce(p_buoi, '[]'::jsonb)) e
     where (e->>'s')::boolean$a$, E'\r', '');
  moB text := replace($a$    select nullif(e->>'id', '')::uuid as id, (e->>'lop_id')::uuid as lop_id, (e->>'ngay')::date as ngay, (e->>'w')::boolean as w
      from jsonb_array_elements(coalesce(p_buoi, '[]'::jsonb)) e
     where (e->>'s')::boolean or (e->>'w')::boolean$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_dang_nhom(uuid,text,jsonb,timestamptz,boolean)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cuB, ''))) / length(cuB);
  if c <> 1 then raise exception '_mtt_dang_nhom đã đổi: đoạn b khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cuB, moB);
  c := (length(d) - length(replace(d, cu, ''))) / length(cu);
  if c <> 1 then raise exception '_mtt_dang_nhom đã đổi: đoạn buổi khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu, mo);
  execute d;
end $do$;
