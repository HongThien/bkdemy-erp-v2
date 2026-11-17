-- ============================================================================
-- 202611171222 — mtt_viec_btvn_chi_buoi_trong_tuan
-- VÌ SAO: Thùy 17/11 — sau luật "Phần 1 = bài học TRONG tuần" (mig 202611171216), bài về nhà của buổi CUỐI TUẦN TRƯỚC (vd CN 15/11, hạn T5 19/11)
--   vẫn hiện ở "Việc của con" tuần mới dù nhóm của nó không còn trong tờ: "bỏ đi". Việc BTVN chỉ còn của buổi DIỄN RA TRONG TUẦN
--   (và có buổi kế còn trong tuần — giữ điều kiện cũ 's'). BTVN buổi cuối tuần trước thuộc tờ tuần trước.
-- Cách làm: vá 1 đoạn trên thân ĐANG CHẠY của _mtt_tinh (khớp đúng 1 chỗ). MẤT GÌ: không xoá dữ liệu; tờ nháp đổi, lớp đã công bố giữ bản khoá.
-- ============================================================================
do $do$
declare d text; c int;
  cu text := replace($a$      from bb where (bb.b->>'s')::boolean and bb.b->>'id' is not null$a$, E'\r', '');
  mo text := replace($a$      from bb where (bb.b->>'s')::boolean and (bb.b->>'w')::boolean and bb.b->>'id' is not null   /* 17/11: BTVN chỉ của buổi trong tuần */$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_tinh(uuid,text,date,timestamptz)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cu, ''))) / length(cu);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: đoạn BTVN khớp % chỗ, cần đúng 1', c; end if;
  execute replace(d, cu, mo);
end $do$;
