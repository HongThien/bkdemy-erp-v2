-- MCQ FORM — 4 rule cho "Tổng các phần tử của {x∈N|x<K}" (T106010103, sub-shape nhỏ — 4 câu tự luận còn lại
-- trong dạng, phần lớn câu khác của T106010103 đã là trắc nghiệm gốc trong kho, ngoài phạm vi pipeline này).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R81','Quên x<K nghiêm ngặt, cộng luôn cả K','A={x∈N|x<K} không chứa K nhưng HS cộng nhầm luôn cả K vào tổng','A={x<5}={0;1;2;3;4}, tổng=10 → nhầm cộng thêm 5 ra 15','tinh','{T106010103}',false),
('R82','Dùng công thức Gauss nhưng quên chia đôi','Nhớ mẹo cộng cặp số đầu-cuối nhân số lượng phần tử nhưng quên chia đôi kết quả','A={x<5} tổng=10 → nhầm (0+4)×5=20 (quên ÷2)','tinh','{T106010103}',false),
('R83','Cộng thiếu phần tử lớn nhất','Liệt kê và cộng nhưng bỏ sót phần tử lớn nhất (K−1)','A={x<5}={0;1;2;3;4}, tổng=10 → cộng thiếu 4, ra 6','tinh','{T106010103}',false),
('R84','Nhầm đếm số phần tử với tính tổng','Đọc nhầm đề, trả lời SỐ LƯỢNG phần tử (K) thay vì TỔNG các phần tử','A={x<5} có 5 phần tử, tổng đúng=10 → nhầm trả lời 5','khai_niem','{T106010103}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
