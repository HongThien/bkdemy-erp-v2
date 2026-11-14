# Hàng đợi 14/11 — đợt cuối kì I còn lại (K11 đề cương · K10 · K12)

Lệnh trạm: `_lenh-tram.md`. Đánh dấu [x] khi đã giao.

## K11 đề cương — khúc chờ giao soạn (theo trang)
- [ ] B036-01 Xuân Đỉnh (160 câu) — k1 tr 1–11 · k2 tr 12–22
- [ ] B036-07 NBK Gia Lai (149) — k1 tr 1–9 · k2 tr 10–17
- [ ] B037-03 Đức Trọng (154) — k1 tr 9–20 · k2 tr 21–31
- [ ] B037-04 Gia Bình 1 (189) — k1 tr 1–11 · k2 tr 12–21
- [x] B037-08 Vân Nội (357) — k1 tr 1–12 · [ ] k2 tr 13–24 · [ ] k3 tr 25–36
- [ ] B038-01 Linh Trung (199) — k1 tr 1–14 · k2 tr 15–28

## Đã giao soạn (không khúc)
B036-02 · 03 · 04 · 05 · 06 · 08 · B037-01 · 02 · 05 · 06 · 07 · B038-02 · 03

- B036-01 k1, k2 [x] · B036-07 k1 [x]

## K10 đề thi — ĐẠT: B041-02 · B042-01 · B042-02 (hình đã đẩy) · đang soát B041-01
## K12 đề thi (11 đề, `_lenh-tram` + `--khoi 12`) — [x] B050-01 · [ ] B050-02 · [ ] B052-01 … B052-09
## Chờ chuẩn bị: K10 đề cương B044–B047
## Ghi DB: hỏi Thùy trước khi ghi.

## K10 đề cương (B044–B047, 28 đề cương, `--khoi 10`) — chuẩn bị xong 14/11
- Không khúc: B044-01·02·03·04·05·06·08 · B045-01·03·04·05·06·07·08 · B046-02·08·09 · B047-01·02
- Khúc: B044-07 (k1 tr1–7, k2 tr8–14) · B045-02 (k1 tr1–9, k2 tr10–18) · B045-09 Vân Nội (k1 tr1–10, k2 tr11–20, k3 tr21–29)
  · B046-01 (k1 tr2–13, k2 tr14–25) · B046-03 (k1 tr2–17, k2 tr18–33) · B046-04 (k1 tr1–15, k2 tr16–30) · B046-06 scan (k1 tr1–8, k2 tr9–15) · B046-07 (k1 tr1–12, k2 tr13–25)
- ⏸ B046-05 Nguyễn Công Trứ 136 trang ~984 câu — CHỜ THÙY (giống sách hơn đề cương)

## Cập nhật 14/11
- Cổng `dung-de-tu-soan.mjs` sửa: K12 dấu nhân `\cdot`; bỏ qua tên hình `S.ABCD`/`ABC.A'B'C'` khi kiểm dấu chấm (không cần viết `{.}` nữa).
- K12: soạn xong B050-01 (đang soát) · B050-02 (đang soát) · B052-01 (đang soát) · đang soạn B052-02 · chờ soạn B052-03…09
- K11: soát ĐẠT B036-02 (hình đã đẩy) · B036-07 k2 [x] giao
- K11 soạn xong B037-05 — ⏳ CHỜ GIAO SOÁT (Đề 1 P3 C2 bỏ vì không có câu hỏi; Đề 2 P3 C4 sửa x=3→-3)

## Cập nhật 14/11 chiều
- ĐÃ GHI DB: K12 B052-03·04·05·06 · K11 B036-04·05·07(ghép 2 khúc)·08 · B037-07 · B038-02·03
- Khúc ĐẠT chờ ghép: B036-01 k1 (k2 đang soát) · B037-03 k1 (k2 đang soạn) · B037-08 k1 (k2, k3 đang soạn)
- Đang soát: B036-03 · B036-06 · B037-06 · B052-07·08·09 · Đang soạn: B037-04 k1,k2 · B038-01 k1,k2 · K10 B044-01…06
- Còn chờ giao K10: B044-07(khúc) · B044-08 · B045-* · B046-* · B047-*

## ⏸ TẠM DỪNG 14/11 tối (Thùy bảo dừng) — trạng thái để làm tiếp
**Đã ghi DB hôm nay (toàn bộ):** K12 B050-01·02 · B052-01…09 (đủ 11 đề) · K11 B036-01…08 (đủ) · B037-01·02·03·05·06·07 · B038-02·03 · K10 đề thi B041-01·02 · B042-01·02 · K10 đề cương B044-03·04·05 · B045-01·05.

**Soát ĐẠT, CHƯA ghi DB (lượt sau: đẩy hình TRƯỚC rồi mới ghi — `ghi-batch.sh` tự nhặt mọi đề có .soat ĐẠT):**
- B037-04 — đã ghép 2 khúc (`B037-04.soan.md`), CHƯA chạy cổng sau ghép, CHƯA đẩy hình, CHƯA ghi.
- B044-06 — soát ĐẠT, CHƯA đẩy hình, CHƯA ghi.

**Khúc ĐẠT chờ khúc còn lại rồi `ghep-khuc.mjs`:** B037-08 (k1 ✔ · k2 ✔ · k3 đang soát) · B038-01 (k1, k2 đang soát).

**Đang chạy lúc dừng (tệp soạn/soát có thể dở dang — kiểm `.soat.md` có KẾT LUẬN chưa):**
- Soát: B037-08 k3 · B038-01 k1, k2 · B044-01 · B044-02 · B044-08 · B045-03 · B045-04 · B045-06 · B046-02 · B046-08.
- Soạn: B044-07 k1 (tr1–7), k2 (tr8–14) · B046-09 · B047-01.

**Chưa giao:** B045-02 (k1 tr1–9, k2 tr10–18) · B045-07 · B045-08 · B045-09 (3 khúc) · B046-01 · 03 · 04 · 06 · 07 (khúc, xem trên) · B047-02 · ⏸ B046-05 chờ Thùy.

**Lệch cần thống nhất:** câu tự luận có đáp số một số vừa 4 ô — K11 soát chuyển sang `tra_loi_ngan`, K10 (B044-03, B044-04) giữ `tu_luan` vì nằm ở phần tự luận của đề.
**Đính chính K10 phân kho:** chỉ Vectơ là `hgt` (đã ghi vào `_lenh-tram.md`); lệnh giao K10 trước đó ghi sai "hệ thức lượng ⇒ hgt" — các đề K10 đã ghi DB đều được soát xác nhận đúng luật.
