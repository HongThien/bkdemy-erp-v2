# Brief trạm SOẠN — LÝ THUYẾT CẤP DẠNG BÀI cho bản đồ mới K6 (Thùy 14/10, đợt 2)

> `<N>` = số gói (1–8). Gói: `C:\Users\WBPC\bk-kho-lam-viec\ban-do-moi-k6\goi-ld\goi-<N>.json`. Kết quả: `…\ban-do-moi-k6\out-ld\out-<N>.json`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Soạn: Sonnet; soát: Opus (`brief-soat-ld.md`).
> Bối cảnh: đợt 1 đã điền lý thuyết CẤP NHÓM (10 nhóm trống) + VÍ DỤ cho 85 dạng. Thùy: *"sao các dạng lớp 6 m ko điền lý thuyết thế"* — mỗi **dạng bài** cũng phải có phần **lý thuyết riêng** (trường `ly_thuyet` của dạng bài).

---

Với MỖI dạng bài trong gói (trừ dạng có `ly_thuyet_dang_hien_co` không rỗng) viết `ly_thuyet`. KHÔNG ghi DB, KHÔNG sửa tệp nào ngoài `out-<N>.json`, KHÔNG commit.

## 1. Lý thuyết của DẠNG khác lý thuyết của NHÓM thế nào

- **Lý thuyết nhóm** (`ly_thuyet_hien_co` của nhóm, đã có) = kiến thức CHUNG của mọi dạng trong nhóm. **Đừng chép lại.**
- **Lý thuyết dạng** = phần học sinh cần để làm ĐÚNG DẠNG NÀY: (a) kiến thức nền / quy tắc đúng dạng này dùng (chọn lọc từ nhóm + sách, phát biểu lại gọn, đủ điều kiện), (b) **phương pháp giải riêng của dạng**
  (3–5 bước, khớp CÁCH GIẢI trong `vi_du_hien_co` của chính dạng đó), (c) **dấu hiệu nhận biết** và **bẫy hay gặp** của riêng dạng (phân biệt với dạng anh em trong nhóm — đọc danh sách dạng của nhóm).
- Mẫu dạng đã có lý thuyết của CEO: NDB00335 (`##ĐN` ngắn nêu kí hiệu ∈, ∉). Ngắn, đúng trọng tâm. Cỡ 3–8 dòng; dạng nâng cao có thể dài hơn nhưng không quá ~15 dòng.

## 2. Đọc trước

1. `Repo\kho-rules\dai\k6.md` — §1 kiến thức được dùng (cấm chuyển vế, $(a^m)^n$ như quy tắc, hằng đẳng thức, đồng dư…), §2 khuôn lời giải theo nhóm, §3 định dạng.
2. `Repo\spec-format-noidung.md` §1 — kí hiệu khối `##ĐN` · `##ĐL` · `##TC` · `##CY` · `##PP` · `##NX`. Khối = từ dòng kí hiệu tới dòng trống; `##PP` mỗi dòng một bước (tự đánh số, đừng gõ "Bước 1").
3. Gói `goi-<N>.json`: nhóm (`ly_thuyet_hien_co` — chỉ để đọc, không sửa), mỗi dạng: `mo_ta`, **`vi_du_hien_co`** (ví dụ ĐÃ CÓ: lý thuyết dạng phải KHỚP cách giải trong đó), `ly_thuyet_dang_hien_co`.

## 3. Việc phải làm

- Mỗi dạng: một chuỗi `ly_thuyet` gồm **1–4 khối** theo thứ tự hợp lý: `##ĐN`/`##ĐL` (nếu dạng cần định nghĩa) → `##TC` (quy tắc / tính chất / công thức dạng này dùng) → `##PP` (phương pháp, mỗi dòng 1 bước) → `##CY` (bẫy riêng).
  Không nhất thiết đủ cả 4; bỏ khối không có gì riêng để nói. Tuyệt đối KHÔNG đặt `##VD` (ví dụ ở trường khác) và KHÔNG chép nguyên văn lý thuyết nhóm.
- Dạng "cơ bản nhất" của nhóm (vd "Cộng – Trừ", "Tìm UC của các số"): nêu đúng quy tắc / phương pháp của dạng + dấu hiệu, vẫn phải có nội dung riêng.
- Phương pháp phải ĐÚNG và dùng được cho MỌI đề thuộc dạng (không chỉ cho 2 ví dụ). Điều kiện đi kèm khẳng định phải đủ ($n\in\mathbb{N}^*$, "khác 0", "lớn nhất / nhỏ nhất", thứ tự ước…).
- Kiến thức lớp 6 theo k6.md §1; tìm $x$ = tìm thành phần chưa biết; nâng cao cần kết quả ngoài whitelist ⇒ nêu cách lập luận (không viện như đã biết).
- Định dạng: dấu nhân dấu chấm `.` (CẤM `\cdot`, `\times`), chia `:`, `\dfrac`, `\text{Ư}`, `\text{ƯC}`, `\text{ƯCLN}`, `\text{BCNN}`, `\vdots`, `\mathbb{N}`; chữ Việt trong công thức bọc `\text{}`; số lẻ dấu `$` là lỗi.
- Phát hiện mô tả dạng mâu thuẫn tên / dạng không phân biệt được với anh em / ví dụ hiện có sai dạng ⇒ ghi vào `ghi_chu` kèm mã dạng.

## 4. Output — `out-<N>.json`

```json
{ "ly_thuyet_dang": { "NDB00340": "##TC\n…\n\n##PP\n…\n…\n\n##CY\n…" },
  "ghi_chu": ["…"] }
```
Viết bằng Write hoặc script `.cjs` (`String.raw`) — KHÔNG heredoc bash. Mọi dạng chưa có lý thuyết trong gói phải có mặt.

## 5. Tự kiểm

```
node kho-rules/dai/lo/k6/ban-do-moi/kiem-goi.mjs "C:\Users\WBPC\bk-kho-lam-viec\ban-do-moi-k6\goi-ld\goi-<N>.json" "C:\Users\WBPC\bk-kho-lam-viec\ban-do-moi-k6\out-ld\out-<N>.json"
```
Sửa tới khi "✔ đạt cổng". Trả lời cuối: số dạng đã viết · `ghi_chu` quan trọng · cổng đã đạt chưa.
