-- MCQ FORM — thêm 2 rule lỗi lộ ra khi máy sinh 462 câu pool 1 (scripts/mcq-auto.mjs, 08/09 đêm). Spec §4.
-- R26: phân số có dấu âm ở mẫu (3/−21) — HS bỏ qua dấu, coi như 3/21. Rất hay gặp ở dạng Cộng trừ số hữu tỉ.
-- R27: hỗn số 2¾ — HS đổi thành 2·¾ thay vì 2 + ¾. Gặp ở Nhân chia / Tính thuận tiện.
-- Đánh số tiếp R26, R27 — CEO đang gom "form tính toán thật trong đề thi" thì ghi tiếp từ R28.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R26','Bỏ qua dấu âm ở mẫu/tử','Phân số có dấu âm ở mẫu (hoặc tử) — bỏ qua dấu, coi như phân số dương','$\dfrac{3}{-21}$ coi như $\dfrac{3}{21}$','khai_niem','{T107010201,T107010202,T107010203,T107010206}',false),
('R27','Đổi hỗn số sai','Coi hỗn số là phần nguyên NHÂN phần phân số thay vì cộng','$2\dfrac{3}{4} = 2\cdot\dfrac{3}{4} = \dfrac{3}{2}$','khai_niem','{T107010202,T107010206,T107010207}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
