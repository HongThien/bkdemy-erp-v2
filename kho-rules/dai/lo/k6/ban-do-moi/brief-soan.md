# Brief trạm SOẠN — điền LÝ THUYẾT (nhóm bài) + VÍ DỤ (dạng bài) cho bản đồ mới K6 (Thùy 14/10)

> `<N>` = số gói (1–8). Gói: `C:\Users\WBPC\bk-kho-lam-viec\ban-do-moi-k6\goi\goi-<N>.json`. Kết quả: `…\ban-do-moi-k6\out\out-<N>.json`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy Sonnet; trạm soát (`brief-soat.md`) chạy Opus.
> CEO: *"Bản đồ lớp 6 mới đã xong dạng bài và mô tả. M điền lý thuyết và ví dụ nhé. Tham khảo từ bản đồ cũ và các quyển sách mà t gửi."*

---

Bạn là trạm SOẠN cho MỘT GÓI của bản đồ kiến thức mới Toán 6. Với mỗi **dạng bài** trong gói viết phần **ví dụ**; với mỗi **nhóm bài** có cờ `can_ly_thuyet: true` viết phần **lý thuyết**.
KHÔNG ghi DB, KHÔNG sửa tệp nào ngoài `out-<N>.json` (và tệp tính nháp ở scratchpad), KHÔNG commit.

## 1. Cấu trúc bản đồ (spec-ban-do-4-tang.md Q3)

- **Nhóm bài** chứa **lý thuyết CHUNG** của mọi dạng bài bên trong (định nghĩa · tính chất · công thức · phương pháp · chú ý).
- **Dạng bài** chứa **ví dụ** (đề + hướng dẫn giải) — "lý thuyết của dạng bài chính là ví dụ". In ra = lý thuyết nhóm, rồi ví dụ từng dạng bài theo thứ tự.
- Dạng bài chỉ khác nhau ở **dấu hiệu nhận biết** (`mo_ta`). Ví dụ của dạng nào phải ĐÚNG mô tả dạng đó và KHÔNG trượt sang dạng anh em trong cùng nhóm (đọc cả danh sách dạng của nhóm).

## 2. Đọc trước (bắt buộc)

1. `Repo\kho-rules\dai\k6.md` — luật khối 6: §1 kiến thức được dùng (whitelist, cấm chuyển vế, cấm $(a^m)^n$ như quy tắc…), §2 **khuôn lời giải theo nhóm bài** (bảng), §3 định dạng.
2. `Repo\spec-format-noidung.md` §1 — kí hiệu khối: `##ĐN` · `##ĐL` · `##TC` · `##CY` · `##PP` · `##VD` · `##NX`. Một khối = từ dòng kí hiệu tới dòng trống kế tiếp (`##PP`: mỗi dòng 1 bước).
3. Gói của bạn `goi-<N>.json`: mỗi nhóm → `ly_thuyet_hien_co` (đọc để KHÔNG lặp, KHÔNG mâu thuẫn; có thể chứa ví dụ cũ), danh sách `dang`: `mo_ta`, `vi_du_hien_co`,
   `ung_vien` = câu ĐÃ DUYỆT của cụm cũ cùng tên ở bản đồ cũ (đề + đáp án + lời giải) — **nguồn ví dụ chính** nhưng có thể rác / sai: kiểm lại từ đầu.

## 3. Nguồn sách (tra khi gói thiếu ứng viên hoặc cần lý thuyết)

Thư mục `E:\BK ACADEMY\Kho dạng bài\K6\`:
- `sach-giao-khoa-toan-6-tap-1-ket-noi-tri-thuc-voi-cuoc-song.pdf` (SGK KNTT 6 tập 1, 14 MB) và `phan-dang-va-bai-tap-mon-toan-6-tap-1-sach-ket-noi-tri-thuc-voi-cuoc-song.pdf` (phân dạng + bài tập, 4 MB).
  Tìm trang bằng `pdftotext -layout "<file>" -` rồi `grep -n`, hoặc Read PDF theo `pages`. (`pdftotext`, `pdftoppm` có trong PATH.)
- Các tệp `Dạng bài_*.docx|pdf`, `Tìm n để an+b chia hết cho cn+d*.pdf`, thư mục con `UCLN_BCNN`, `SỐ NGUYÊN TỐ`, `Dấu hiệu chia hết`, `Kho đề`… — bài mẫu + lý thuyết CEO đã soạn cho các dạng nâng cao.
  (docx đọc bằng `node` + thư viện có sẵn của repo hoặc chuyển PDF; ưu tiên tệp `.pdf` nếu có.)
Sách chỉ là THAM KHẢO — viết lại bằng cách trình bày của k6.md, không chép nguyên văn dài.

## 4. VÍ DỤ của mỗi dạng bài (`vi_du`)

- **2 ví dụ** (dạng nâng cao khó: 1–2). Ví dụ 1 = điển hình, đúng mô tả; ví dụ 2 = biến thể khó hơn một nấc nhưng vẫn cùng dạng. Số liệu vừa phải (tính được tay).
- Khuôn mỗi ví dụ:
  ```
  ##VD
  <đề — công thức trong $…$>
  **Hướng dẫn giải:**
  <lời giải, mỗi dòng/phép tính một đoạn, theo khuôn §2 của k6.md cho đúng nhóm>
  ```
  Các ví dụ cách nhau một dòng trống. Đề nhiều ý ⇒ `a)`, `b)` trong đề và trong lời giải; bài lời văn kết bằng "Vậy …".
- Ví dụ lấy từ `ung_vien`: chọn câu SẠCH (đề rõ, lời giải đúng, vừa độ khó), **viết lại lời giải** theo khuôn k6.md (dấu chấm nhân, không chuyển vế, không kiến thức ngoài whitelist). Có thể đổi số cho gọn.
  Ứng viên không đủ / sai ⇒ tự soạn ví dụ mới theo sách. Dạng không có ứng viên (vd "Nhân 1 biểu thức", "Nhân 2 biểu thức") ⇒ soạn theo mô tả + sách + `ly_thuyet_hien_co` của nhóm.
- Dạng đã có `vi_du_hien_co`: KHÔNG đè — viết thêm 1 ví dụ KHÁC để bổ sung (hoặc không viết nếu đã đủ 2); đề cập trong `ghi_chu`.

## 5. LÝ THUYẾT của nhóm (`ly_thuyet`) — chỉ nhóm `can_ly_thuyet: true`

- Gồm (thứ tự): `##ĐN`/`##ĐL` (nếu có) → `##TC` (tính chất · công thức · quy tắc) → `##PP` (phương pháp giải: mỗi dòng một bước, 3–6 bước) → `##CY` (bẫy hay gặp). Ngắn gọn, đúng như một "tờ lý thuyết" của học sinh lớp 6.
- Nhóm CÓ dạng bài: KHÔNG đặt `##VD` (ví dụ nằm ở dạng bài). Nhóm KHÔNG có dạng bài (cờ `khong_co_dang: true`): thêm **2 `##VD`** ngay cuối lý thuyết.
- Mọi khẳng định toán phải ĐÚNG và đủ điều kiện (vd "$a\vdots d$ và $b\vdots d$"; điều kiện $n\in\mathbb{N}^*$). Cần kết quả ngoài whitelist ⇒ nêu cách lập luận chứ không viện dẫn như đã biết.

## 6. Kiến thức & định dạng (k6.md §1, §3)

- Dùng kiến thức Chương I–II SGK KNTT 6 + tiểu học. **Cấm**: chuyển vế / đổi dấu · $(a^m)^n$ và $(ab)^n$ như quy tắc có sẵn (viết ra tích các thừa số rồi nhóm) · hằng đẳng thức · đồng dư ·
  dấu hiệu chia hết cho 4, 8, 11, 25 · $\text{ƯCLN}\cdot\text{BCNN}=a.b$ như quy tắc có sẵn (nếu cần, tự lập luận). Tìm $x$ = tìm thành phần chưa biết.
- Dấu nhân là **dấu chấm** `.` (`$25.4$`, `$2^2.3.5$`) — CẤM `\cdot`, `\times` · chia `:` · phân số `\dfrac` · số liền (`125000`) · `\text{Ư}(12)`, `\text{B}(5)`, `\text{ƯC}`, `\text{ƯCLN}`, `\text{BC}`, `\text{BCNN}`,
  `\vdots`, `\not\vdots`, `\in`, `\notin`, `\mathbb{N}`, `\mathbb{N}^*`, `\overline{ab}`, `\Rightarrow` · chữ tiếng Việt trong công thức bọc `\text{…}` · số lẻ dấu `$` là lỗi.
- **Mọi đáp số / kết quả phải tính lại bằng máy** (`node -e`, BigInt cho số lớn, vét cạn cho ước/bội/tìm $x$/số nguyên tố). Không tin lời giải trong `ung_vien`.

## 7. Output — `out-<N>.json`

```json
{ "vi_du": { "NDB00335": "##VD\n…\n**Hướng dẫn giải:**\n…\n\n##VD\n…" },
  "ly_thuyet": { "NNB00910": "##ĐN\n…\n\n##TC\n…\n\n##PP\n…\n…" },
  "ghi_chu": ["điều nghi ngờ: mô tả mâu thuẫn tên dạng / dạng không phân biệt được với anh em / thiếu nguồn / phải dùng kiến thức ngoài lớp 6 …"] }
```
Viết bằng công cụ Write hoặc script `.cjs` (`String.raw`) — KHÔNG dùng heredoc bash (nuốt `\`). Mọi dạng trong gói (trừ dạng đã đủ ví dụ) phải có mặt; mọi nhóm `can_ly_thuyet` phải có mặt.

## 8. Tự kiểm trước khi nộp (bắt buộc)

```
node kho-rules/dai/lo/k6/ban-do-moi/kiem-goi.mjs "C:\Users\WBPC\bk-kho-lam-viec\ban-do-moi-k6\goi\goi-<N>.json" "C:\Users\WBPC\bk-kho-lam-viec\ban-do-moi-k6\out\out-<N>.json"
```
Sửa tới khi in "✔ đạt cổng".

## 9. Trả lời cuối

Vài dòng: số dạng đã viết ví dụ · số nhóm đã viết lý thuyết · các mục `ghi_chu` quan trọng · cổng đã đạt chưa.
