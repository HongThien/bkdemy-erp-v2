-- ============================================================================
-- 202609131103 — Rule Điền Ô D12–D25 (max ma trước khi seed = D11) — khuôn "an+b ⋮ cn+d" (T106030401, khối 6)
-- ----------------------------------------------------------------------------
-- CEO 12/09 tối: "an+b:cn+d hay sai đặc biệt ở chỗ tách xong thì số bên ngoài bị sai" ⇒ 3 vị trí đo/câu (chọn 1–3 tuỳ câu,
--   scripts/lib/dien-khuon-ancnd.mjs): 'so_ben_ngoai' (hằng số dư sau tách, D12–D16/D24–D25), 'tap_uoc' (tập Ư(r), D17–D19),
--   'tap_n' (tập nghiệm cuối sau khi thử lại, D20–D23). D16/D24/D25 là DỰ PHÒNG (chỉ dùng khi 3 công thức sai "thật" của
--   D12–D15 trùng số với đáp án đúng — xảy ra khi hệ số nhỏ, ví dụ tách "x+2 ⋮ x-1" chỉ có 1 công thức sai cho số khác đáp án).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('D12','Tính hệ số nhân để triệt biến sai','Quên chia (hoặc quên nhân) hệ số mẫu số khi lấy hệ số dùng để tách','$4n+7=2(2n+1)+7-4\cdot1$ (quên chia 4 cho 2, dùng luôn 4 làm hệ số nhân)','khai_niem','{T106030401}',false),
('D13','Cộng thay vì trừ khi tách số dư','Tách $an+b=k(cn+d)+r$ mà cộng nhầm thành $k(cn+d)-r$ hoặc ngược lại (sai dấu)','$x+2=(x-1)-3$ thay vì $(x-1)+3$','khai_niem','{T106030401}',false),
('D14','Đảo vai trò hằng số tử/mẫu khi tính số dư','Tính số dư bằng công thức đảo vị trí b và d cho nhau','nhầm $d-k\cdot b$ thay vì $b-k\cdot d$','khai_niem','{T106030401}',false),
('D15','Nhân chéo nhầm vai trò hệ số và hằng số','Tính số dư bằng $a\cdot b - c\cdot d$ thay vì $a\cdot d - c\cdot b$','nhầm vai trò khi nhân chéo 2 cặp hệ số/hằng số','khai_niem','{T106030401}',false),
('D16','Số dư lệch thêm 1 lần hệ số mẫu số','Tính đúng cách nhưng cộng nhầm thêm 1 lần hệ số $c$ của mẫu số','$r+c$ thay vì $r$','tinh','{T106030401}',true),
('D17','Tập ước thiếu chính số đó','Liệt kê Ư(r) mà bỏ sót r (ước lớn nhất)','$Ư(6)=\{1;2;3\}$ thiếu $6$','khai_niem','{T106030401}',false),
('D18','Tập ước thiếu số 1','Liệt kê Ư(r) mà bỏ sót 1 (ước nhỏ nhất)','$Ư(6)=\{2;3;6\}$ thiếu $1$','khai_niem','{T106030401}',false),
('D19','Tập ước thừa 1 số không phải ước','Liệt kê Ư(r) mà thêm nhầm 1 số không chia hết r','$Ư(6)=\{1;2;3;6;7\}$ thừa $7$','tinh','{T106030401}',false),
('D20','Quên thử lại, giữ nghiệm ngoại lai','Không kiểm lại chia hết thật, giữ luôn nghiệm sinh ra từ bước nhân 2 vế với hệ số mẫu nhưng không thoả mãn đề gốc','n=0 không thử lại nên vẫn giữ dù $3n+5$ không chia hết cho $2n+2$ khi $n=0$','khai_niem','{T106030401}',false),
('D21','Bỏ sót 1 nghiệm hợp lệ','Liệt kê tập nghiệm cuối mà thiếu 1 giá trị đúng','$x\in\{2;4\}$ thiếu mất $4$, chỉ còn $\{2\}$','tinh','{T106030401}',false),
('D22','Tập nghiệm thừa 1 giá trị không phải nghiệm','Liệt kê tập nghiệm cuối mà thêm nhầm 1 số không thoả mãn','$x\in\{2;4;5\}$ thừa $5$','tinh','{T106030401}',false),
('D23','Lệch 1 đơn vị ở một nghiệm','Tính đúng cách nhưng ra sai 1 đơn vị ở một giá trị nghiệm','$x=3$ thay vì $x=2$','tinh','{T106030401}',true),
('D24','Số dư lệch 1 đơn vị (trừ nhầm)','Tính đúng cách nhưng trừ nhầm 1 đơn vị ở số dư cuối','$r-1$ thay vì $r$','tinh','{T106030401}',true),
('D25','Số dư lệch 1 đơn vị (cộng nhầm)','Tính đúng cách nhưng cộng nhầm 1 đơn vị ở số dư cuối','$r+1$ thay vì $r$','tinh','{T106030401}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
