-- ════════════════════════════════════════════════════════════════════════════
-- BẢN ĐỒ MỚI — CEO 11/10: (1) BỎ thao tác nối tiền đề giữa các nhóm bài, "thứ tự là đủ";
--                          (2) kéo nhóm A thả VÀO TRONG nhóm B ⇒ A tự HẠ thành dạng bài của B ("rất nhiều nhóm sẽ bị hạ").
--
-- (1) Số thứ tự nhóm = thuần vị trí (thu_tu). Bảng dai_bdm_nhom_tien_de GIỮ NGUYÊN, không xoá dòng nào (đang có 5 mũi tên
--     K7 "Số hữu tỉ" CEO nối 10/10 — cả 5 trùng thứ tự thu_tu nên số thứ tự KHÔNG đổi); chỉ không còn tham gia tính số.
-- (2) fn_bdm_ha_nhom chạy được cả khi nhóm đang có dạng bài: A thành 1 dạng bài của B (mang tên · mô tả · lý thuyết của A),
--     các dạng bài con của A chuyển sang B xếp NGAY SAU, giữ thứ tự — KHÔNG mất gì. Mã dạng bài con không đổi ⇒ câu đã gán
--     (dai_bdm_gan_cau) + gán cụm cũ đi theo nguyên vẹn. Không còn chặn vì mũi tên tiền đề (tính năng đã bỏ; mũi tên của
--     nhóm bị hạ mất theo nhóm qua ON DELETE CASCADE).
-- ════════════════════════════════════════════════════════════════════════════

create or replace function _bdm_so_nhom(p_chu_de text, p_chuyen_de text)
returns table (id text, so integer, tang integer)
language sql stable as $$
  select n.id, (row_number() over (order by n.thu_tu, n.id))::integer, 0
    from dai_bdm_nhom n
   where n.chu_de_id = p_chu_de and n.chuyen_de_id = p_chuyen_de
$$;

create or replace function fn_bdm_ha_nhom(p_id text, p_nhom_dich text)
returns text language plpgsql as $$
declare
  n dai_bdm_nhom;
  v_db text;
  v_tt integer;
begin
  if p_id = p_nhom_dich then raise exception 'Không thể hạ nhóm vào chính nó'; end if;
  select * into n from dai_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if not exists (select 1 from dai_bdm_nhom where id = p_nhom_dich) then raise exception 'Không tìm thấy nhóm đích %', p_nhom_dich; end if;

  select coalesce(max(thu_tu), 0) into v_tt from dai_bdm_dang_bai where nhom_id = p_nhom_dich;
  insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, thu_tu)
  values (p_nhom_dich, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.ly_thuyet_ten_file, v_tt + 1)
  returning id into v_db;
  -- dạng bài con của nhóm bị hạ → sang nhóm đích, ngay sau dạng bài vừa tạo, giữ thứ tự tương đối
  update dai_bdm_dang_bai d
     set nhom_id = p_nhom_dich, thu_tu = v_tt + 1 + x.i
    from (select c.id, row_number() over (order by c.thu_tu, c.id) as i from dai_bdm_dang_bai c where c.nhom_id = p_id) x
   where d.id = x.id;
  update dai_bdm_doi_ung set dich_nhom = null, dich_dang_bai = v_db where dich_nhom = p_id;
  delete from dai_bdm_nhom where id = p_id;
  return v_db;
end $$;
