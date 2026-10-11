# Brief giao trạm SOẠN — ĐỀ CƯƠNG Toán 6 Ngôi Sao Hoàng Mai (11/10)

> Lưu nguyên văn brief (README §4 việc #5). `<P>` = số phần (1–10). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K6\NSHM-GKI-2026`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy Sonnet; trạm soát (`brief-soat.md`) chạy Opus.
> Dựa trên `kho-rules/dai/lo/k6-brief-soan.md` (đề thi K6) — khác ở chỗ: đây là ĐỀ CƯƠNG ôn tập (20 bài, đã gõ sẵn + tách ý), không có phần trắc nghiệm, có bài nâng cao.

---

Bạn là trạm SOẠN cho MỘT PHẦN của đề cương ôn tập giữa kì I Toán 6. Việc: **giải chi tiết mọi câu của phần được giao** theo luật khối 6, viết thẳng vào tệp khung.
Tệp của bạn: `Repo\kho-rules\dai\lo\k6\de-cuong\NSHM-GKI-2026.p<P>.soan.md` (đã có sẵn tiêu đề + đề từng câu). KHÔNG ghi DB, KHÔNG sửa tệp nào khác, KHÔNG commit.

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. `Repo\kho-rules\dai\k6.md` — luật giải + trình bày khối 6 (§1 kiến thức được dùng, §2 khuôn Phần 2 theo nhóm bài, §3 định dạng).
2. `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` — **mẫu đã CEO duyệt** (tệp khuôn, nhịp Phần 1, cách viết Phần 2; xem kĩ các bài tự luận).
3. `Repo\kho-rules\dai\lo\k6-brief-soan.md` §4 — khuôn tệp + khuôn lời giải (máy kiểm — sai là bị từ chối). Mục 4 dưới đây tóm tắt.

## 2. Nguồn

- `<LV>\trang\p-1.png`, `p-2.png`, `p-3.png` — ảnh 3 trang đề cương (NGUỒN CHÍNH). Mở HẾT bằng công cụ Read, đối chiếu từng câu của phần bạn:
  chữ, số, số mũ, dấu ngoặc, dấu nhân, dấu chia. Tệp khung do máy gõ — **lệch ảnh thì ảnh đúng** ⇒ sửa dòng `**Đề:**` cho đúng ảnh (sửa tối thiểu).
- Trong đề cương, dấu `:` ở các bài tập hợp / chia hết là kí hiệu **chia hết** (⋮ — khung đã gõ `\vdots`); ở các bài Tính / Tìm $x$ là phép **chia**.

## 3. Việc phải làm

1. Mỗi câu: điền `loai=` và `dap_an=` ở dòng `### …`, viết lời giải 2 phần (mục 4) ngay sau các dòng `**Đề:**` / `**Ghi chú:**` / `**Chưa chắc:**` có sẵn.
   - `loai=tra_loi_ngan` CHỈ khi đáp số là MỘT số viết được trong 4 ô (chữ số, dấu `-` đầu, dấu `,` thập phân; ≤ 4 kí tự: `1252`, `-12`, `2,5`); số 5 chữ số trở lên,
     tập hợp, nhiều đáp số, biểu thức, chứng minh ⇒ `loai=tu_luan`, `dap_an=—`. Phần khung đang để `tu_luan` / `—` — đổi nếu đủ điều kiện.
     `dap_an` của TLN chỉ ghi số, không ghi đơn vị / chữ ($x=5$ ⇒ `dap_an=5`).
   - Câu hỏi kiểu "Hỏi … bao nhiêu túi quà? Khi đó mỗi túi có bao nhiêu món" (nhiều đáp số) ⇒ `tu_luan`.
2. **Giữ nguyên** mọi dòng `**Ghi chú:**` / `**Chưa chắc:**` có sẵn (người gõ đề cương đã ghi lỗi in / chỗ trống của đề); chỉ **thêm** dòng mới khi cần.
3. **Mọi đáp số phải thử lại** (thay ngược vào đề / tính lại bằng cách khác; số lớn dùng `node -e`, đừng nhẩm). Câu tính tổng dãy: kiểm bằng `node -e` với số hạng thật.
4. **Kiến thức** (k6.md §1): Chương I–II SGK Kết nối tri thức 6. Đề cương có bài NÂNG CAO (Bài 7, 11, 16–20): cần một kết quả chưa có trong lý thuyết ⇒ **tự lập luận ngay trong lời giải**
   bằng cái đã có (phép nhân phân phối, $a^m.a^n=a^{m+n}$, gom nhóm, ghép cặp, "nhân hai vế rồi trừ", chia hết của tổng/hiệu, số dư khi chia cho 2/3…).
   Không chuyển vế / không hằng đẳng thức / không đồng dư / không công thức tổng $\dfrac{n(n+1)}{2}$ dùng như đã biết (tự suy ra bằng cách ghép cặp rồi mới dùng) /
   không $(a^m)^n$ như quy tắc (viết $(x^{54})^2=x^{54}.x^{54}=x^{108}$). Không làm được trong phạm vi đó ⇒ **không bịa**, ghi `**Chưa chắc:**`.
5. **Đề cương có thể in lỗi** (số / số mũ / đề không giải được / kết luận trong đề sai): phát hiện ⇒ thêm `**Chưa chắc:** …` nói rõ chỗ lỗi, vẫn giải theo cách hiểu hợp lí nhất và nêu cách hiểu đó.
   Ghi `Chưa chắc` khi: ảnh mờ không đọc chắc · đề hai cách hiểu · đề in lỗi · phải dùng kiến thức ngoài SGK KNTT 6 · lời giải theo quy ước bạn đoán. **Đừng ghi tràn lan** — CEO xem kĩ đúng những câu này.
6. **Không tách thêm câu, không gộp câu, không đổi nhãn** (nhãn `Bài 6a` … giữ nguyên, kể cả Bài 9/10 có ý `j) q) k)`).

## 4. Khuôn lời giải (máy kiểm — sai là bị từ chối)

- Mỗi câu: `**Phần 1. Hướng dẫn**` → `**Mấu chốt:** …` (một câu) → **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn `**Chú ý:** …` / `Thử lại: …`
  → `**Phần 2. Trình bày**` → lời giải. Các đoạn cách nhau MỘT dòng trống; trong một bước không có dòng trống.
- Mỗi bước Phần 1 là **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ≥ 5 chữ ngoài công thức, **không ghi đáp số cuối**, không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề".
  Bài ngắn (cộng / trừ thẳng) ⇒ tách đúng thao tác thật thành 3 bước.
- Phần 2 = đúng cái HS viết vào bài, theo khuôn nhóm bài `k6.md` §2. Mỗi dòng / mỗi phép tính một đoạn. Bài tính mở bằng dòng chép lại biểu thức. Tìm $x$ theo cột,
  **tìm thành phần chưa biết — KHÔNG "chuyển vế"**. Bài thực tế ƯC/ƯCLN theo khuôn NNB00921 (gọi ẩn + điều kiện → ƯC → ƯCLN → kết luận).
- **Định dạng:** dấu nhân là dấu chấm (`$25.4$`, `$2^2.3.5$`, `$6.(x+1)$`) — CẤM `\cdot`, `\times` · chia `:` · phân số `\dfrac` · số trong công thức viết liền (`125000`) ·
  `\text{Ư}(12)`, `\text{ƯC}`, `\text{ƯCLN}`, `\text{BCNN}` · `\vdots`, `\not\vdots`, `\in`, `\notin`, `\mathbb{N}`, `\mathbb{N}^*`, `\overline{abc}`, `\Rightarrow` ·
  chữ tiếng Việt trong công thức phải bọc `\text{…}` · số lẻ dấu `$` là lỗi.
- Trích dẫn đáp số cuối cùng bằng một câu kết "Vậy …" (bài Tìm $x$ / thực tế).

## 5. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k6/de-cuong/NSHM-GKI-2026.p<P>.soan.md --lam-viec "<LV>" --chi-kiem
```

## 6. Trả lời cuối

Vài dòng: số câu theo loại (TLN / tự luận) · các câu có `Chưa chắc` (nhãn + một câu lí do) · cổng đã đạt chưa.

## 7. Bẫy đã cắn thật

- Bẫy đọc ảnh: số mũ nhỏ, dấu trừ, dấu ngoặc, "$2023^3$ hay $2023^2$" — không chắc ⇒ nói ra, đừng đoán. Dấu chia hết ⋮ khác dấu chia :.
- Bài Tìm $x$ lũy thừa: kiểm điều kiện $x\in\mathbb{N}$ (loại nghiệm âm / không nguyên) và thử lại bằng cách thay vào.
- Tách "Bài" lời văn: KHÔNG tách ý, Phần 2 ghi `a)` `b)`.
