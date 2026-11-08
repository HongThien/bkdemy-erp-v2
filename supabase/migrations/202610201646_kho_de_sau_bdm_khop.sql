-- "⏭ Để sau" ở Bản đồ mới › Duyệt kho (khớp câu ↔ dạng bài) là HÀNG ĐỢI KHÁC với Duyệt kho › câu (duyệt nội dung):
-- cùng mã câu nhưng hai quyết định khác nhau ⇒ thêm loại 'bdm_khop' để "để sau" ở hàng này không đẩy câu xuống cuối hàng kia.
alter table kho_de_sau drop constraint if exists kho_de_sau_doi_tuong_check;
alter table kho_de_sau add constraint kho_de_sau_doi_tuong_check
  check (doi_tuong in ('cau','form_tn','form_dien','hinh_bai','hinh_bien_the','hinh_cach_giai','clone','de_thi','bdm_khop'));
