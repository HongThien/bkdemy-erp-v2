-- Gán câu 5T vào dạng bài mới theo đối ứng dạng cũ → dạng bài (nguon = 'doi_ung').
-- VÌ SAO: view bdm_cau_dang (→ bdm_cau_hoi, nguồn câu của MT khi chọn 1 dạng bài lẻ / ↻ Đổi, ôn tập, đề test…) chỉ đọc
--   dai_bdm_gan_cau + dai_bdm_de_xuat, KHÔNG đọc dai_bdm_doi_ung. Mig 202611010003 xoá 160 câu gán cũ của 5T (Thùy gật) và chỉ
--   dựng đối ứng ⇒ MT khối 5T báo "chưa có câu" dù kho có câu. Khối 4/4T chạy được vì có sẵn câu gán từng câu.
-- MẤT GÌ: không xoá gì — chỉ thêm dòng (bỏ qua câu đã có dòng gán). Câu Đúng/Sai không vào kho dạng bài (trigger chặn) nên loại.

do $$
declare n_them int; n_dang int;
begin
  insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
  select c.ma_cau, u.dich_dang_bai, 'doi_ung'
    from dai_cau_hoi c
    join dai_ban_do b on b.ma_dang = c.dang_chinh and b.khoi = '5T'
    join dai_bdm_doi_ung u on u.ma_dang_cu = c.dang_chinh and u.dich_dang_bai is not null
   where c.xoa_at is null and c.loai_cau <> 'dung_sai'
     and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = c.ma_cau)
     and (select count(*) from dai_bdm_doi_ung u2 where u2.ma_dang_cu = c.dang_chinh) = 1;
  get diagnostics n_them = row_count;

  select count(distinct g.dang_bai_id) into n_dang
    from dai_bdm_gan_cau g join dai_bdm_dang_bai d on d.id = g.dang_bai_id
    join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
   where cd.khoi = '5T';
  if n_them = 0 or n_dang < 20 then raise exception 'Gán câu 5T bất thường: thêm % dòng, % dạng bài có câu', n_them, n_dang; end if;
end $$;
