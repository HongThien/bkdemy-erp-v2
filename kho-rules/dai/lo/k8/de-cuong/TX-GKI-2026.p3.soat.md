KẾT LUẬN: ĐẠT

# TX-GKI-2026 — phần 3 (Dạng tìm x) — biên bản trạm SOÁT (Opus, 24/10)

- Số câu: **11** (4 trả lời ngắn · 7 tự luận). Pha 1: `TX-GKI-2026.p3.kiem.md`; máy kiểm `<LV>\tam\kiem_soat_p3.mjs` (phân số BigInt).
- Khớp Pha 1 ngay từ đầu: **11/11 đáp số** (1a $-\dfrac{10}{3}$ · 1b $5$ · 1c $4$ · 2a $-2$ · 2b $-\dfrac{77}{13}$ · 2c $-11$ · 3a $-3;2$ · 3b không có $x$ · 3c $2;\dfrac{3}{5}$ · 3d $\pm3;-2$ · 3e $0;3;-7$).
- Số câu phải sửa: **3** (1 kiến thức · 2 định dạng lời / chữ). Không đổi đáp số, không đổi phân loại, đề chép đúng ảnh.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt.

## Kiểm ngoặc Dạng 3 Bài 3 (ảnh 260 dpi `<LV>\z\soat_p3_b3ad-3.png`)

Bản scan mất dấu ngoặc thật ở 3a–3d (3e không có ngoặc). Khoảng trắng đứng đúng chỗ mở / đóng ngoặc, chữ "2" mũ ở 3b nằm sau khoảng trắng sau "1" ⇒ đọc được duy nhất:
a) $x(x+3)-2(x+3)=0$ · b) $\dfrac{5}{4}(2x+1)^2+2(x^2-4)-5(x-2)=0$ · c) $5x(x-2)-3(x-2)=0$ · d) $x^3(x^2-9)-8(9-x^2)=0$ · e) $x^3+4x^2-21x=0$.
**Khớp hoàn toàn khôi phục của người gõ / đối chiếu**, không có khác biệt. 3b: máy kiểm vế trái $\equiv 7x^2+\dfrac{13}{4}$ ⇒ không có $x$ (Đề sai, đúng như trạm soạn xử).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Dạng 3 Bài 3e | kiến thức | Viết lại Phần 1 (Mấu chốt + Bước 1–3) và Phần 2: bỏ tách hạng tử $x^2-3x+7x-21$, thay bằng $x^2+4x+4-25=(x+2)^2-5^2=(x-3)(x+7)$ | Phạm vi TX (phụ lục §4) chỉ có đặt nhân tử chung / nhóm / hằng đẳng thức / ẩn phụ + hoàn thành bình phương; "tách hạng tử" được ghi riêng cho NTL ⇒ không thuộc TX |
| Dạng 3 Bài 3a | lời (định dạng) | Bước 2: "hiệu của hai hệ số đứng trước $(x+3)$" → "hiệu của hai thừa số đứng trước $(x+3)$ ở hai hạng tử" | $x$ không phải hệ số |
| Dạng 3 Bài 3b | lời (định dạng) | Bước 4 sửa câu "bình phương của một số không âm" → "bình phương của mọi số đều không âm"; Ghi chú bỏ chữ "phương trình vô nghiệm", thêm "trạm soát phóng to 260 dpi, khôi phục là duy nhất"; mục người duyệt bỏ chữ "phương trình" | Câu cũ sai nghĩa; tránh thuật ngữ "phương trình / vô nghiệm" (cấm ở đề cương) |

Cũng sửa dòng tương ứng của 3e trong `## GHI CHÚ CHO NGƯỜI DUYỆT`.

## Đề sai

- **Dạng 3 Bài 3b** — vế trái $=7x^2+\dfrac{13}{4}>0$ với mọi $x$ ⇒ không có $x$ thoả. Đã có `**Ghi chú:** Đề sai: …` + dòng `Lưu ý:` đầu Phần 2, không có `Chưa chắc` (đúng luật 24/10).

## Chưa chắc

Không có.
