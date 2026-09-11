-- MCQ FORM — thêm R70/R71 cho nhóm ƯCLN/BCNN. Chạy thật T106040102 (mig 202609112336, chỉ R62-64) chỉ sinh
-- được 20/40 (50%) — 20 câu bỏ vì ƯCLN chỉ có ĐÚNG 1 thừa số nguyên tố chung, R64 (bỏ sót thừa số) cần ≥2 thừa
-- số nên không áp dụng được, còn lại R62+R63 < 3 cần thiết. Thêm R70 (tính nhầm bằng hiệu 2 số — luôn tính
-- được với câu 2 số, không phụ thuộc số lượng thừa số) + R71 (rule dự phòng: lấy nhầm ước/bội chung nhỏ
-- nhất/đầu tiên — 1 hoặc 0, luôn tính được).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R70','Tính nhầm bằng hiệu 2 số','Lấy hiệu (a−b) làm ƯCLN/BCNN thay vì phân tích thừa số nguyên tố — chỉ áp dụng câu 2 số','ƯCLN(35;50) nhầm ra 50−35=15 (đúng: 5)','tinh','{T106040102,T106040202,T106040104,T106040204}',false),
('R71','Lấy nhầm ước/bội chung nhỏ nhất/đầu tiên','ƯCLN: lấy nhầm ước chung NHỎ NHẤT (luôn bằng 1) thay vì lớn nhất. BCNN: lấy nhầm bội chung ĐẦU TIÊN khi liệt kê (0, theo định nghĩa B(a) luôn bắt đầu từ 0) thay vì bội chung nhỏ nhất khác 0. Rule dự phòng — luôn tính được, không phụ thuộc số thừa số','ƯCLN(20;30) nhầm ra 1. BCNN(4;6) nhầm ra 0','khai_niem','{T106040102,T106040202,T106040104,T106040204}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
