KẾT LUẬN: ĐẠT

# DC-02a — biên bản trạm SOÁT (Opus, 13/10)

Nguồn: Đề cương ôn tập giữa học kì 1 Toán 7 — THCS Tây Mỗ, PDF tr.1–6 (in 22–26; tr.1 không số): Phần 1 TN Câu 1–20, Phần 2 Đúng/Sai Câu 21–25.
Giải mù: `DC-02a.kiem.md` (mọi hình và Câu 4, 11–15, 17, 21–25 phóng 400 dpi; Câu 16 kiểm `node -e`). Bản gốc trạm soạn: `DC-02a.soan.goc.md`.

- Số câu: **25** (20 trắc nghiệm · 5 Đúng/Sai nhập `tu_luan`). Kho: `dai` 14 · `hinh_hoc` 11 (Câu 8–10, 18–20, 23–25 — đúng `k7.md` Q2).
- Khớp đáp án Pha 1 ngay từ đầu: **25/25** (Phần 1: B C A B C D C D C D C A C C B A C C C D · Phần 2: 21 Đ-S-Đ-S · 22 Đ-Đ-S-Đ · 23 Đ-Đ-Đ-Đ · 24 S-Đ-S-S · 25 S-Đ-S-Đ).
- Chép đề: khớp ảnh 25/25; dữ kiện đọc từ hình (trục số, vị trí góc, số đo) đã chép vào đề đúng như hình phóng 400 dpi.
- Câu phải sửa: **6** (Câu 6, 8, 11, 19, 23, 24) — 1 định dạng, 1 lập luận, 1 hình cắt lại, còn lại gọn `Chưa chắc` / `Ghi chú`.
- Cổng: `dung-de-tu-soan.mjs … --khoi 7 --chi-kiem` ⇒ **✔ đạt cổng** (25 câu · 20 TN · 0 TLN · 5 tự luận · hình 12 · chưa chắc 2).
  ⚠ Lệnh trong brief soát thiếu `--khoi 7` ⇒ cổng mặc định khối 6 báo lỗi "kho phải là dai / hgt" cho 9 câu `hinh_hoc`; thêm `--khoi 7` là đạt (đúng Q2).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 6 | hình | Cắt lại `img/a_c6.png` (y 676, cao 136) | Ảnh cũ dính nửa dòng chữ "Câu 7: Trên trục số…" ở đáy |
| Câu 6 | ghi chú | Bỏ `Chưa chắc` (vạch vẽ tay không đều) | Phóng 400 dpi: A, C đặt $-\dfrac23$ bên phải O; B đặt ở vạch thứ hai sau $-1$ (là $-\dfrac13$); chỉ D đặt ở vạch thứ nhất sau $-1$ ⇒ D chắc chắn, độ lệch khoảng O–1 không ảnh hưởng |
| Câu 8 | ghi chú | Bỏ `Chưa chắc` (vị trí nhãn $M_1$) | Phóng 400 dpi: nhãn "1" ở $M$ nằm trên $b$, cách cát tuyến rõ về bên phải ⇒ so le trong với $\widehat{N_1}$, đáp án $75^\circ$ chắc |
| Câu 11 | định dạng | $\dfrac{3}{4}.\dfrac{5}{-3}$ → $\dfrac{3}{4}.\dfrac{-5}{3}$ | Phân số viết mẫu dương (khuôn `NNB00936`) |
| Câu 19 | ghi chú | Bỏ `Chưa chắc` (cung $125^\circ$ ở $E$); bỏ câu "Câu 18 và câu 19 đề in sát nhau…" trong `Ghi chú` | Cung $125^\circ$ nằm dưới $AB$, bên phải cát tuyến, là góc tù ⇒ đối đỉnh với $\widehat{AEF}$, chắc; câu bị bỏ là ghi chú dàn trang, không phải lỗi đề |
| Câu 23 | ghi chú | Bỏ câu "bản giao việc chỉ nhắc hình ở Câu 24, 25 nên hình Câu 23 được bổ sung" | Ghi chú quy trình nội bộ, không phải lỗi đề gốc |
| Câu 23 | lập luận | d) thêm lí do trong ngoặc: "(hai đường thẳng phân biệt cùng vuông góc với một đường thẳng thứ ba)", "(hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba)" | Câu Hình: mỗi khẳng định phải có lí do |
| Câu 24 | ghi chú | Thay `Chưa chắc` "B, A, y thẳng hàng" bằng `Chưa chắc` về số $55^\circ$ / $50^\circ$ | Đo trên ảnh 400 dpi: B, A, y thẳng hàng (hệ số góc BA ≈ Ay), không cần hỏi; nhưng hình in $\widehat{ACB}=55^\circ$ trong khi mệnh đề c) ghi "$ACB=50^\circ$" và hình vẽ $Ax\parallel BC$ ⇒ nghi đề định cho $50^\circ$; c) d) lật Đúng/Sai theo số này |

Đã soát và giữ nguyên: lời giải 25 câu đúng toán từng dòng; Phần 1 đủ 3–6 bước nghĩ thật, không lộ đáp số; dấu nhân chấm, không `\cdot`/`\times`;
Câu 18 dùng tia đối + so le trong (đúng dấu hiệu KNTT, không dùng "trong cùng phía bù nhau" làm dấu hiệu); Đúng/Sai xét từng mệnh đề, không có ghi chú cách nhập;
`kieu: de_cuong`, không `nam`/`thoi_gian_phut` — giữ nguyên. Hình 12 tệp đều đúng câu, đủ nhãn, số đo trên hình có trong phần Đề.

## Câu còn `Chưa chắc` (gửi CEO)

| Câu | Lí do |
|---|---|
| Câu 24 | Hình in $\widehat{ACB}=55^\circ$ ⇒ c) d) Sai (đáp án hiện tại S-Đ-S-S); nếu đề định cho $50^\circ$ (mệnh đề c) ghi $50^\circ$, hình vẽ $Ax\parallel BC$) thì c) d) Đúng |
| Câu 25a | Đẳng thức $\widehat{D_1}=\widehat{DAB}=90^\circ$ đúng nhưng lí do "so le trong" sai (hai góc đồng vị); lời giải chấm Sai theo lí do — nếu chỉ chấm đẳng thức thì Đúng |

## ẢNH CHO CEO

| Câu | Ảnh (tên tệp) | Trang trong PDF gốc (đề cương Tây Mỗ) | Vấn đề |
|---|---|---|---|
| Câu 17 | `can-xem/DC-02_Cau17.png` | PDF tr.4 (in 24) | Đề in thừa dòng "A. Hình 1 B. Hình 2 C. Hình 3 D. Hình 4" dưới phương án — đã bỏ, đáp án C ($35$) không đổi. |
| Câu 24 | `can-xem/DC-02_Cau24_a.png` + `can-xem/DC-02_Cau24_b.png` | PDF tr.5–6 (in 25–26) | Hình ghi $\widehat{C}=55^\circ$ nhưng mệnh đề c) ghi $50^\circ$ — CEO chốt giữ $55^\circ$ (c, d Sai) hay sửa thành $50^\circ$ (c, d Đúng). |
| Câu 25 | `can-xem/DC-02_Cau25.png` | PDF tr.6 (in 26) | Mệnh đề a) đúng số đo nhưng sai tên cặp góc (đồng vị, không phải so le trong) — CEO chốt chấm Sai (hiện tại) hay Đúng. |
