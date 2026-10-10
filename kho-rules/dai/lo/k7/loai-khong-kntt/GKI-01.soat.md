KẾT LUẬN: ĐẠT

# GKI-01 — Biên bản soát (trạm Opus, 10/10, lô thử khối 7)

- **Số câu:** 17 (8 TN · 2 trả lời ngắn · 7 tự luận; HGT 5 · hình 4).
- **Khớp đáp án Pha 1 ngay từ đầu:** 17/17 (bảng giải mù: `GKI-01.kiem.md`).
- **Số câu phải sửa:** 6 (Câu 6, Câu 8, Bài 2b, Bài 2c, Bài 3.1, Bài 4) + mục GHI CHÚ CHO NGƯỜI DUYỆT. Không câu nào sai đáp số.
- **Bản gốc trước khi sửa:** `GKI-01.soan.goc.md`. Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 6 | chép đề | "Góc $\widehat{xAy}$ và góc $\widehat{yAz}$" → "Góc $xAy$ và góc $yAz$" (đúng ảnh) | "góc $\widehat{…}$" đọc thành "góc góc" |
| Câu 6 | định dạng | Xoá `Ghi chú` tả hình | Không phải lỗi đề gốc, không ảnh hưởng gì |
| Câu 8 | lập luận | Phần 2 cũ: "tia $AD$ … nằm trong góc $BAC$ **nên** là tia phân giác" → nêu đủ: nằm giữa hai cạnh **và** chia góc thành hai góc bằng nhau. Phần 1 Bước 2 thêm "hai góc bằng nhau" | "Nằm trong góc" không suy ra phân giác — sai định nghĩa |
| Câu 8 | phân loại (Chưa chắc) | Xoá `Chưa chắc`, viết lại `Ghi chú` về lỗi hình gốc | Đã phóng 400 dpi + đo: hai nửa góc bằng nhau ($\approx40^\circ$, $\approx28^\circ$); B, C, D đều chứa cạnh tam giác ⇒ A chắc chắn. Lỗi chỉ là hình gốc thiếu kí hiệu — giữ ở Ghi chú |
| Bài 2b | định dạng | Dòng Thử lại: số âm $\dfrac{-8}{15}$ đặt trong ngoặc | `k7.md` §3: số âm trong phép tính để trong ngoặc |
| Bài 2c | định dạng | Xoá `Ghi chú` "đề in '3. $2^x$' có dấu chấm" | Dấu chấm là dấu nhân chuẩn SGK, không phải lỗi đề |
| Bài 3.1 | lập luận / kiến thức | Phần 2 ý b thêm dòng nêu lý do chỉ làm 4 mặt (thùng hở mặt nghiêng); đổi "mặt đáy dưới" → "mặt bên hình chữ nhật nằm dưới" (Phần 1 + Phần 2) | Thiếu lý do chọn mặt; "mặt đáy" của lăng trụ là hai tam giác — gọi hình chữ nhật nằm dưới là "mặt đáy" là sai thuật ngữ |
| Bài 3.1 | phân loại (Chưa chắc) | Xoá `Chưa chắc`, gộp cách hiểu vào `Ghi chú` | Cách hiểu "thùng kín" cần cạnh huyền $\sqrt{11125}$ (Pytago, lớp 8) mà đề không cho ⇒ chỉ một cách hiểu làm được ở lớp 7; khớp giải mù (15825 $cm^2$) |
| Bài 3.1 | hình | Cắt lại `p2b31.png` gồm cả ảnh máy cắt cỏ (bản cũ chỉ có hình lăng trụ) | Ảnh máy là căn cứ duy nhất trong đề cho việc thùng hở mặt nghiêng |
| Bài 4 | phân loại (Chưa chắc) | Xoá `Chưa chắc` | Lời giải tự lập luận đủ từng dòng ($n^2>(n-1).n$, tách hiệu) đúng `k7.md` §1 luật 2; đáp số $A<1$ khớp giải mù (máy: $A\approx0,635$) |
| GHI CHÚ | kiến thức | Sửa nhận xét bộ sách: nội dung (hình khối trong GKI) khớp **Chân trời sáng tạo**, không khớp KNTT HK1; trường `bo_sach` vẫn `KNTT` theo luật "đề không ghi" | Ghi chú cũ nói "hợp chương trình KNTT HK1" — sai (KNTT để hình khối ở Chương X, tập 2) |

## Đã soát, không sửa

- Đề 17 câu chép đúng ảnh (số, mũ, dấu âm, hỗn số $1\dfrac13$ đã phóng to xác nhận), đủ 4 phương án, không sót câu; khung đầu đề đã bỏ.
- Tách ý đúng luật: Bài I, II tách từng ý; Bài III tách 3.1 / 3.2 (hai bài toán khác hẳn); 3.1 giữ chung a) b).
- Loại câu: Bài 1b (8), 2c (5) `tra_loi_ngan`; phân số và bài hình để `tu_luan` — đúng.
- Không có `\cdot` / `\times`; không dùng kiến thức lớp 8.
- Hình `p1c6`, `p1c8`, `p2b32` đúng câu, không cụt, không dính chữ.

## Câu còn `Chưa chắc` (gửi CEO)

Không còn. Ba câu trạm soạn nêu (Câu 8, Bài 3.1b, Bài 4) đều đã kiểm chắc — lý do ở bảng trên. CEO có thể lướt hai `Ghi chú` về đề gốc: **Câu 8** (hình gốc không kí hiệu góc bằng nhau) và **Bài 3.1** (hiểu thùng hở mặt nghiêng ⇒ 15825 $cm^2$).
