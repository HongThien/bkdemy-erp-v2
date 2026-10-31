-- Xoá bộ bản đồ 5T bị TRÙNG (Thùy gật 01/11): mig 202611010003 bị chạy 2 lần (npm run migrate rồi SQL Editor);
-- lần 2 không xoá được gì (mã cứng NCD00145/146 đã mất) nên dựng thêm bộ thứ hai NCD00216.
-- Giữ NCD00215 (bộ sinh trước). Bộ NCD00216 chưa có câu gán/ giáo trình nào trỏ vào — chỉ 28 dòng đối ứng.

do $$
declare
  v_x   text := 'NCD00216';
  v_giu text := 'NCD00215';
  n_db  int;
  n_nhom int;
begin
  if not exists (select 1 from dai_bdm_chu_de where id = v_x and khoi = '5T' and ten = 'Bài toán tỉ số')
     or not exists (select 1 from dai_bdm_chu_de where id = v_giu and khoi = '5T') then
    return;  -- đã xoá rồi / không đúng hiện trạng → không làm gì
  end if;

  select count(*) into n_db from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = v_x;
  if n_db <> 28 then raise exception 'NCD00216 có % dạng bài, kỳ vọng 28', n_db; end if;
  if exists (select 1 from dai_bdm_gan_cau g join dai_bdm_dang_bai d on d.id = g.dang_bai_id join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = v_x)
     or exists (select 1 from dai_cau_lop g join dai_bdm_dang_bai d on d.id = g.dang_bai_id join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = v_x) then
    raise exception 'NCD00216 đã có dữ liệu dùng — dừng';
  end if;

  create temp table _ch_x on commit drop as select chuyen_de_id from dai_bdm_o where chu_de_id = v_x;
  delete from dai_bdm_doi_ung where dich_dang_bai in (select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = v_x);
  delete from dai_bdm_dang_bai where nhom_id in (select id from dai_bdm_nhom where chu_de_id = v_x);
  delete from dai_bdm_nhom where chu_de_id = v_x;
  delete from dai_bdm_o where chu_de_id = v_x;
  delete from dai_bdm_chu_de where id = v_x;
  delete from dai_bdm_chuyen_de where id in (select chuyen_de_id from _ch_x)
    and not exists (select 1 from dai_bdm_o o where o.chuyen_de_id = dai_bdm_chuyen_de.id);

  select count(*) into n_db from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de c on c.id = n.chu_de_id where c.khoi = '5T';
  select count(*) into n_nhom from dai_bdm_nhom n join dai_bdm_chu_de c on c.id = n.chu_de_id where c.khoi = '5T';
  if n_db <> 28 or n_nhom <> 8 then raise exception 'Sau xoá 5T còn % dạng bài / % nhóm, kỳ vọng 28 / 8', n_db, n_nhom; end if;
end $$;
