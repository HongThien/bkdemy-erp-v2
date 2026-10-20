KẾT LUẬN: ĐẠT

# Biên bản soát — CBQ-GKI-2026 trạm 9 (Phần A, Dạng 8: Bài 15–21, thực tế ƯC/ƯCLN, BC/BCNN) — 20/10

- Số câu: **7** (0 TN · 4 trả lời ngắn: Bài 15, 16, 20, 21 · 3 tự luận: Bài 17, 18, 19).
- Khớp Pha 1 (`CBQ-GKI-2026.p9.kiem.md`) ngay từ đầu: **7/7** — Bài 15: 4 (cách hiểu tính cả 1 tổ; 3 nếu bỏ) · 16: 9 · 17: 12 phần (2 vở, 4 bút, 3 gói) · 18: 6 túi (7 đỏ, 5 vàng) · 19: 12 hàng dọc (25, 23, 21 hàng ngang) · 20: 24 · 21: 36. Kiểm bằng `node -e` (Euclid + vét cạn ước chung).
- Phải sửa: **1 câu** (Bài 16, Phần 1). Bản gốc giữ ở `CBQ-GKI-2026.p9.soan.goc.md`.
- Cổng: `✔ đạt cổng` (1 phần · 7 câu · 4 TLN · 3 tự luận · chưa chắc 2).

## Đã soát

- **Đề:** cả 7 câu chép đúng ảnh `t-3.png` (giữ lỗi dấu "nữ'.", "tổ?.", "bánh?." như in — người gõ đề đã ghi trong `Chưa chắc`).
- **Phân tích TSNT / ƯCLN / BCNN:** đúng hết ($24=2^3.3$, $18=2.3^2$, $54=2.3^3$, $45=3^2.5$, $48=2^4.3$, $36=2^2.3^2$, $42=2.3.7$, $30=2.3.5$, $300=2^2.3.5^2$, $276=2^2.3.23$, $252=2^2.3^2.7$, $6=2.3$, $8=2^3$, $12=2^2.3$).
- **Khuôn Phần 2:** đúng NNB00921 / NNB00925 (gọi ẩn + điều kiện → ƯC/BC → ƯCLN/BCNN → phân tích mỗi số một dòng → `Suy ra … hay $x=…$` → dòng tính phụ có đơn vị → `Vậy …`). Bài 16 lọc ƯC theo điều kiện $x>3$ đúng khuôn "không hỏi lớn nhất ⇒ ƯC = ước của ƯCLN rồi lọc".
- **Kiến thức:** không dùng Euclid, không dùng $\text{ƯCLN}.\text{BCNN}=a.b$; dấu nhân chấm; `\text{ƯC}`, `\text{ƯCLN}`, `\text{BC}`, `\text{BCNN}`.
- **Phần 1:** mỗi câu Mấu chốt + 3–4 bước nghĩ thật + Chú ý, không chép Phần 2. Bài 16 lộ tập ước chung ⇒ đã sửa (bảng dưới).
- **Phân loại:** Bài 17, 18, 19 hỏi nhiều đại lượng ⇒ `tu_luan` (thống nhất với Bài 13, 14 trạm 8); Bài 15, 16, 20, 21 đáp số một số ≤ 4 kí tự ⇒ `tra_loi_ngan`.

## Bảng sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 16 | lập luận (Phần 1 lộ đáp số) | `Chú ý` bỏ danh sách "(1, 3, 9)" → "có nhiều hơn một ước chung thoả mãn … đừng quên lọc" | Liệt kê sẵn $\text{ƯC}(54,45)=\{1;3;9\}$ cạnh điều kiện "nhiều hơn 3" là lộ luôn đáp số 9 |

## Bài 15 — có nên đổi sang tự luận? (đề xuất: KHÔNG đổi, chờ CEO sửa đề)

- Hai cách hiểu là thật: đề không nói số tổ phải > 1. Chính các đề cương khác phải ghi rõ để tránh mơ hồ — vd TC-GKI-2026 Bài 7 viết "(kể cả trường hợp xếp vào một túi)"; GKI-16 viết "số lượng nhóm lớn hơn 1".
- Đổi sang `tu_luan` chỉ để né chấm máy thì mất câu trên app mà vẫn để nguyên đề mơ hồ. Tiền lệ CEO 10/10: **đề gốc mơ hồ ⇒ CEO sửa đề cho rõ rồi nhập**.
- ⇒ Giữ `tra_loi_ngan`, `dap_an=4` (cách hiểu tính cả 1 tổ, Phần 2 đã nêu cả cách hiểu 3), giữ `Chưa chắc`. CEO chọn một trong hai:
  - thêm vào đề "(kể cả trường hợp cả lớp là một tổ)" ⇒ đáp án **4**, giữ nguyên lời giải, bỏ câu ngoặc cuối Phần 2;
  - hoặc thêm "biết số tổ nhiều hơn 1" ⇒ đáp án **3**, sửa `dap_an=3`, lời giải lọc $x>1$.
  - Chỉ khi CEO muốn giữ nguyên chữ đề gốc thì mới đổi sang `tu_luan` (`dap_an=—`), Phần 2 trình bày cả hai cách hiểu.

## Câu còn `Chưa chắc` (gửi CEO)

| Câu | Lí do |
|---|---|
| Bài 15 | Hai cách hiểu "bao nhiêu cách chia tổ": 4 (tính cả 1 tổ) hay 3 (từ 2 tổ trở lên) — đang chọn 4; đề xuất CEO sửa đề như trên. Kèm lỗi dấu "nữ'.", "tổ?." (người gõ đề ghi). |
| Bài 17 | Chỉ lỗi dấu "bánh?." in ở đề gốc (người gõ đề ghi) — không ảnh hưởng lời giải; CEO có thể bỏ dấu thừa rồi gỡ nhãn. |
