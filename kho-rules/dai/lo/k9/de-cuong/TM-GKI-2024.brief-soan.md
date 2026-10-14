# ⚠️ BẢN ÁP DỤNG CHO ĐỀ CƯƠNG TÂY MỖ (TM-GKI-2024) — ĐỌC TRƯỚC, ĐÈ LÊN CÁC DÒNG NS BÊN DƯỚI

Brief gốc viết cho đề cương Nguyễn Siêu; bản này đã thay tên mã / thư mục. Các điểm KHÁC phải theo đây:
- Mã đề `TM-GKI-2024`; `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\TM-GKII`; số phần `<P>` = 1–9 (tệp `TM-GKI-2024.p<P>.soan.md`). Ảnh đề cương: `<LV>\trang\t-1.png … t-6.png` (6 trang scan 130 dpi; chỗ không chắc phóng to bằng `pdftoppm` như mô tả). Hình đề đã cắt ở `<LV>\img\de_P4B15…19.png`, `de_P6B4_1.png`, `de_P6B5.png`.
- Bản đồ tệp → trang ảnh: p1, p2 = Bài 1–4 (t-1) · p3 = Bài 5–6 (t-1) · p4 = Bài 7–14 (t-2) · p5 = Bài 15–19 (t-2, t-3, đầu t-4) · p6 = Bài 20–22 (t-4) · p7 = Bài 23–25 (t-4) · p8 = Bài 26–29 (t-5) · p9 = Đề minh hoạ (t-5, t-6).
- Đề cương đánh số: Bài 1–29 LIÊN TỤC qua 5 dạng (các "phần" trong tệp = các dạng); riêng "Đề minh hoạ" đánh số lại từ 1 (Bài 4.1 / 4.2 = hai bài con 1), 2) của Bài 4; "Bài 5" = "Bài V"). Nhãn trong `### …` giữ NGUYÊN như khung.
- Nguồn nhãn "PHẦN <n>": 1 = Dạng 1 (PT quy về bậc nhất) · 2 = Dạng 2 (hệ) · 3 = Dạng 3 (lập hệ) · 4 = Dạng 4 (hình học, kho=hgt) · 5 = Dạng 5 (khác, kho=dai) · 6 = Đề minh hoạ.
- Câu `kho=hgt` mà KHÔNG có `**Hình:**` (Bài 20, 21, 22, 23, 24, 25, 4.2) ⇒ vẽ hình giải bằng code, tên tệp `giai_P<phần>B<bài>.png` (vd `giai_P4B22.png`, `giai_P6B4_2.png`). Bài 21 (tính giá trị biểu thức) không cần hình. Bài 28 (hộp quà, kho=dai, đề nhắc hình nhưng không in) ⇒ vẽ hình giải hình hộp chữ nhật (khối 3D đơn giản) hoặc bỏ nếu lời giải rõ không cần — không bắt buộc.
- Đề nâng cao (Bài 26–29, và Bài 5 đề minh hoạ) là các bài cực trị / bất đẳng thức / bài toán thực tế dạng hàm bậc hai. **Cấm** công thức nghiệm / Δ / Viète vẫn giữ; GTLN–GTNN và bất đẳng thức giải bằng đưa về dạng tổng các bình phương, hằng đẳng thức, điều kiện của biến (như luật khối 9 §1 `dai/k9.md`; ví dụ Cô-si phải tự chứng minh từ $(a-b)^2\ge0$). Bài 29 (lợi nhuận) và Bài 5 (diện tích tối đa) là hàm bậc hai: dùng hoàn thành bình phương $-(x-a)^2+k\le k$. Bài 28: hai biến $x$ (cạnh đáy), $h$ (chiều cao), $x^2h=4$; diện tích mạ $x^2+4xh=x^2+\dfrac{16}{x}$ ⇒ cực trị cần $x=2$: chứng minh bằng đưa $x^2+\dfrac{16}{x}-12=\dfrac{(x-2)(x^2+2x-8)}{x}\cdot$… hay cách tương đương không dùng Cô-si/đạo hàm — nếu KHÔNG làm được trong phạm vi lớp 9 thì ghi `**Chưa chắc:**`.
- Bài 19 (hai góc hạ 30°, 60°, h = 100 m, 6 phút): đáp số là số phút từ vị trí thứ hai đến chân tháp. Bài 16: làm tròn đến độ. Bài 15, 17, 18: nêu `**Chưa chắc:**` nếu làm tròn đề không nêu.
- Bài 24c / Bài 25c có công thức cần chứng minh — kiểm bằng toạ độ số trước khi viết; nếu công thức ĐỀ in có vẻ không đúng (bản scan in sai) thì chứng minh bằng máy rồi ghi `**Chưa chắc:** … nếu sửa thành … thì …`. KHÔNG tự sửa đề.
- Mã chạy cổng: thay `NS-GKI-2026` bằng `TM-GKI-2024` và `--lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/TM-GKII"`. Lưu ý: cổng báo "Phần n: không có câu nào" trên tệp CHƯA có lời giải là bình thường; trạm soạn phải chạy cho tới "✔ đạt cổng".
- Ghi chú đã có trong khung (vd Bài 1b vết mực, Bài 28 không có hình) giữ nguyên.

---

# Brief giao trạm SOẠN — ĐỀ CƯƠNG Toán 9 Nguyễn Siêu (TM-GKI-2024) (13/10)

> Lưu nguyên văn brief (README §4 việc #5). `<P>` = số phần (1–9). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\TM-GKI-2024`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy Sonnet; trạm soát (`brief-soat.md`) chạy Opus.
> Cùng dây chuyền đề cương khối 8 (`kho-rules/dai/k8.md` §12, `lo/k8/de-cuong/brief-soan.md`) — khác ở LUẬT KIẾN THỨC (khối 9) và kho hình (hệ thức lượng ⇒ `hgt`).

---

Bạn là trạm SOẠN cho MỘT PHẦN của đề cương ôn tập giữa học kì I Toán 9. Việc: **giải chi tiết mọi câu của phần được giao** theo luật khối 9, viết thẳng vào tệp khung.
Tệp của bạn: `Repo\kho-rules\dai\lo\k9\de-cuong\TM-GKI-2024.p<P>.soan.md` (đã có sẵn tiêu đề + đề từng câu). KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo,
KHÔNG commit. (Được ghi thêm ảnh vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. Luật khối 9: câu `kho=dai` ⇒ `Repo\kho-rules\dai\k9.md` (§1 luật kiến thức theo thứ tự bài, §1.5 hai phần, §2 khuôn Phần 2 theo dạng, §3 định dạng);
   câu `kho=hgt` ⇒ thêm `Repo\kho-rules\hgt\k9.md` (được dùng / cấm, thứ tự bài, làm tròn mặc định, hình).
2. `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` — **khuôn TỆP** đã CEO xem (cách đặt dòng `### …`, `**Đề:**`, `**Phần 1. Hướng dẫn**`, `**Mấu chốt:**`, `**Bước k.**`, `**Phần 2. Trình bày**`).
   Chỉ lấy KHUÔN TỆP ở đó — kiến thức và cách trình bày theo luật khối 9.

## 2. Nguồn

- `<LV>\trang\t-1.png … t-6.png` — 6 trang ảnh đề cương (130 dpi, BẢN SCAN, không có lớp chữ) — NGUỒN CHÍNH. Mở HẾT bằng công cụ Read, đối chiếu từng câu của phần bạn: chữ, số, số mũ, dấu, dấu ngoặc.
  Chỗ không chắc ⇒ phóng to: `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"` (toạ độ ở 260 dpi = 2 × toạ độ trên ảnh `t-N.png`) rồi Read.
- Tệp khung do người gõ — **lệch ảnh thì ảnh đúng** ⇒ sửa dòng `**Đề:**` cho đúng ảnh (sửa tối thiểu, thêm `**Ghi chú:**` nói đã sửa gì).
  NGOẠI LỆ: các chỗ đề cương in thiếu / in sai mà người gõ đã xử lí và ghi rõ ở dòng `**Ghi chú:**` / `**Chưa chắc:**` có sẵn (thêm "$=0$", sửa bất đẳng thức in sai…) — giữ nguyên như khung, đừng trả về bản in.
- Đề cương đánh số bài lại từ 1 ở mỗi phần (A. Đại số · B. Hình học · C. Nâng cao) — tệp của bạn chỉ thuộc MỘT phần (xem dòng `## PHẦN`), tìm đúng mục đó trên ảnh.
- Hình có sẵn trong đề đã cắt vào `<LV>\img\de_*.png` và khai bằng dòng `**Hình:**` (giữ nguyên; mở xem đúng hình của câu).
- Đề cương KHÔNG có đáp án. Đáp số lấy từ lượt giải của bạn rồi trạm soát (Opus) giải mù đối chiếu.

## 3. Việc phải làm

1. Mỗi câu: điền `loai=` và `dap_an=` ở dòng `### …`, viết lời giải 2 phần (mục 4) ngay sau các dòng `**Đề:**` / `**Hình:**` / `**Ghi chú:**` / `**Chưa chắc:**` có sẵn.
   - `loai=tra_loi_ngan` CHỈ khi đáp số là MỘT số nguyên / thập phân viết được trong 4 ô (chữ số, dấu `-` đầu, dấu `,`; ≤ 4 kí tự: `13`, `-1`, `2,5`) theo ĐÚNG dạng đề hỏi
     (vd "Tìm số nguyên lớn nhất…" ra $1$ ⇒ `tra_loi_ngan`, `dap_an=1`; phương trình có MỘT nghiệm $x=-4$ ⇒ `dap_an=-4`). Hai nghiệm, cặp $(x;y)$, phân số, khoảng nghiệm của bất phương trình,
     vô nghiệm, chứng minh, bài nhiều ý, bài hỏi hai đại lượng ⇒ `loai=tu_luan`, `dap_an=—`. `dap_an` của TLN chỉ ghi số.
   - `kho=` (`dai` / `hgt`) đã điền sẵn — giữ.
2. **Giữ nguyên** nhãn, không tách thêm / gộp câu. Các dòng `**Ghi chú:**` / `**Chưa chắc:**` có sẵn giữ; chỉ **thêm** khi cần.
3. **Mọi đáp số phải thử lại bằng máy** — viết script node trong `<LV>\tam\` (tạo bằng công cụ Write, KHÔNG heredoc, KHÔNG `node -e` chứa `\` hay dấu huyền): hệ / phương trình ⇒ thay nghiệm vào ĐỀ
   (dùng phân số chính xác hoặc sai số $10^{-9}$) và quét lưới xem có sót nghiệm; bất phương trình ⇒ thử hai phía của biên + chính biên; tham số $m$ ⇒ quét lưới $m$; lời văn ⇒ thay đáp số vào từng dữ kiện;
   lượng giác ⇒ `Math.sin(x*Math.PI/180)`; hình ⇒ dựng toạ độ số, kiểm từng khẳng định; bất đẳng thức ⇒ thử ≥ 2000 bộ số ngẫu nhiên (cả biên, cả số âm nếu đề cho số thực). Đừng nhẩm.
4. **Kiến thức — luật quan trọng nhất.** Phạm vi của đề cương (đề tự ghi "Chương I; chương II; chương IV"):
   **Chương I** (phương trình quy về bậc nhất: phương trình tích, phương trình chứa ẩn ở mẫu; phương trình và hệ hai phương trình bậc nhất hai ẩn — phương pháp thế, cộng đại số; giải toán bằng cách lập phương trình / hệ phương trình),
   **Chương II** (bất đẳng thức và tính chất; bất phương trình bậc nhất một ẩn), **Chương IV** (tỉ số lượng giác của góc nhọn; hệ thức giữa cạnh và góc trong tam giác vuông). Lớp 6–8 là nền
   (hằng đẳng thức, phân tích đa thức thành nhân tử, phân thức, hàm số bậc nhất và đồ thị, tam giác đồng dạng, định lí Pythagore, tính chất đường phân giác của tam giác, căn bậc hai số học của lớp 7…).
   **CẤM (dù lời giải ngắn hơn):** công thức nghiệm / $\Delta$ / định lí Viète (chương sau) · các phép biến đổi căn thức của Chương III (đưa thừa số ra ngoài dấu căn, trục căn thức…) ·
   kiến thức đường tròn · bất đẳng thức Cô-si dùng thẳng (phải tự chứng minh từ $(a-b)^2\ge0$) · hệ thức đường cao $h^2=b'c'$, $b^2=ab'$, $\dfrac{1}{h^2}=\dfrac{1}{b^2}+\dfrac{1}{c^2}$ dùng thẳng,
   định lí sin / côsin (xem `hgt\k9.md`) · dấu `⇔` · "tập nghiệm $S=\{…\}$" (kết luận bằng LỜI: "Vậy phương trình có nghiệm $x=…$", "Vậy hệ phương trình có nghiệm duy nhất $(x;y)=(…;…)$").
   Phương trình bậc hai, bậc cao: đưa về PHƯƠNG TRÌNH TÍCH bằng phân tích nhân tử (tách hạng tử, nhóm, hằng đẳng thức). Nhân tử bậc hai vô nghiệm ⇒ chứng minh nó luôn dương bằng hoàn thành bình phương.
   Nghiệm vô tỉ (chỉ ở bài không phân tích được trên số hữu tỉ) ⇒ hoàn thành bình phương rồi dùng căn bậc hai số học lớp 7 ($X^2=k$ với $k>0$ thì $X=\sqrt{k}$ hoặc $X=-\sqrt{k}$), và thêm `**Chưa chắc:**` nếu khung chưa có.
   Hệ có ẩn ở mẫu ⇒ điều kiện xác định, đặt ẩn phụ, giải, trả lại ẩn, đối chiếu điều kiện. Hệ vô nghiệm / vô số nghiệm ⇒ nêu rõ và viết nghiệm tổng quát.
5. **Câu `kho=hgt`** (phần B và Bài 3–4 phần C): theo `hgt\k9.md`. Bài có tam giác **không tách ý**; Phần 2 ghi `a)` `b)` `c)`. Nêu rõ tam giác vuông nào, vuông tại đâu trước khi viết tỉ số lượng giác.
   **Làm tròn:** theo đúng yêu cầu của đề; đề không nêu ⇒ theo mặc định của `hgt\k9.md` và thêm `**Chưa chắc:** đề không nêu cách làm tròn — …`. Tính tiếp bằng giá trị ĐÚNG (không tính tiếp từ số đã làm tròn), chỉ làm tròn ở kết quả cuối của từng đại lượng.
   Bài KHÔNG có dòng `**Hình:**` mà có tam giác / hình thang (B Bài 3, 4, 5, 9, 10 · C Bài 3, 4) ⇒ **vẽ hình cho lời giải bằng code** rồi thêm dòng `**Hình giải:** giai_<B|C><số bài>.png`
   (vd `giai_B3.png`; một tệp / bài, đủ mọi điểm của mọi ý). Cách vẽ: viết `<LV>\tam\ve_p<P>.mjs`, import
   `import { P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`,
   chạy `node "<LV>/tam/ve_p<P>.mjs"` với thư mục hiện hành là Repo; mỗi hình `await luu('<LV>/img', 'giai_B3', w, h, svgDoc(w, h, T(dx, dy, body)))`. Mẫu dùng thư viện: `Repo\scripts\anh\ve_hinh_hh101_102.mjs`.
   Hình **dựng đúng dữ kiện bằng toạ độ** (đúng tỉ lệ cạnh, góc vuông, chân đường cao, chân phân giác tính bằng phép tính), đủ mọi điểm, ghi số đo ĐỀ CHO, đánh dấu góc vuông cho trước, **không ghi kết quả phải tìm**;
   canvas cao ≤ 450 px, chừa ≥ 35 px dưới nhãn đáy, nhãn không đè đường. **Vẽ xong mở ảnh bằng Read để kiểm, sai thì sửa.**
6. **Bài lời văn (A Bài 12–22):** mỗi bài MỘT câu. Khuôn: gọi ẩn + đơn vị + điều kiện → biểu diễn các đại lượng theo ẩn → lập phương trình / hệ → giải (trình bày đủ) → đối chiếu điều kiện → trả lời bằng lời đủ MỌI đại lượng đề hỏi.
7. **Bất đẳng thức (C Bài 1, 2):** chứng minh bằng biến đổi tương đương về tổng các bình phương / xét hiệu, mỗi bước một dòng có lí do; nêu khi nào dấu "=" xảy ra (nếu có). Bất đẳng thức kép ⇒ chứng minh từng vế.
8. **Không chắc 100% thì NÓI RA** — dòng `**Chưa chắc:** <điều chưa chắc>` ngay trong câu đó (sau đề, trước `**Phần 1. Hướng dẫn**`). CEO xem kĩ đúng những câu này, nên đừng giấu và đừng ghi tràn lan. Ghi khi:
   ảnh mờ không đọc chắc · đề hai cách hiểu · đề in lỗi (chứng minh bằng máy, nêu "nếu sửa thành … thì …") · cần kiến thức ngoài phạm vi mục 4 · làm tròn tự chọn · kết quả "xấu" bất thường so với các ý anh em.
   KHÔNG tự sửa dữ kiện đề để ra số đẹp.
9. Cuối tệp thêm mục `## GHI CHÚ CHO NGƯỜI DUYỆT` (câu nào cần CEO xem + nhận xét chung). Không có gì thì ghi "Không".

## 4. Khuôn lời giải (máy kiểm — sai là bị từ chối)

- Mỗi câu: `**Phần 1. Hướng dẫn**` → `**Mấu chốt:** …` (một câu) → **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn `**Chú ý:** …`
  → `**Phần 2. Trình bày**` → lời giải. Các đoạn cách nhau MỘT dòng trống; trong một bước không có dòng trống.
- Mỗi bước Phần 1 là **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ≥ 5 chữ ngoài công thức, **không ghi đáp số cuối** (kể cả ở Chú ý), không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề".
  Bài nhiều ý: các bước ghi rõ "Ý a: …", "Ý b: …"; tổng vẫn 3–6 bước ⇒ gộp ý ngắn lại.
- Phần 2 = đúng cái học sinh viết vào bài kiểm tra, theo khuôn của dạng (`dai\k9.md` §2 / `hgt\k9.md` §2). Mỗi dòng biến đổi / mỗi câu một đoạn riêng (cách nhau một dòng trống). Kết bằng một câu "Vậy …".
- **Định dạng:** mỗi công thức một cặp `$…$` (không `$$`, không `\(`) · dấu nhân tường minh là **`\cdot`** — **CẤM `\times` và CẤM dấu chấm làm dấu nhân**; số với chữ, chữ với chữ, ngoặc với ngoặc viết liền ·
  chia `:` · phân số `\dfrac` · hệ `$\begin{cases} … \\ … \end{cases}$` (cả hệ trên MỘT dòng) · số thập phân dấu phẩy `2{,}5` · độ `^\circ`, phút `'` (`$67^\circ23'$`) · `\widehat{ABC}`, `\triangle ABC`, `\perp`, `\parallel`,
  `\approx`, `\ge`, `\le` · chữ tiếng Việt trong công thức phải bọc `\text{…}` · đơn vị `$10\ \text{cm}$`, `\text{m}^2`, `\text{km/h}` · số lớn ngoài công thức viết "12 600 000 đồng".
  App không hiển thị chữ nghiêng `*…*` — chỉ dùng `**đậm**` cho các nhãn quy định. Không dùng bảng Markdown.

## 5. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/de-cuong/TM-GKI-2024.p<P>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/TM-GKII" --khoi 9 --chi-kiem
```

## 6. Trả lời cuối

Vài dòng (≤ 120 từ): số câu theo loại (TLN / tự luận) · các câu có `Chưa chắc` (nhãn + một câu lí do) · hình giải đã vẽ · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.

## 7. Bẫy đã cắn thật (rút từ đề cương khối 8 và kho khối 9)

- Bẫy đọc ảnh scan: số mũ nhỏ, dấu trừ, dấu ngoặc, phân số — không chắc ⇒ phóng to, đừng đoán.
- Phần 1 lộ đáp số ở dòng Chú ý ("phương trình vô nghiệm", "loại $x=2$") — bị trạm soát bắt lại nhiều lần.
- Dồn 3–4 phép biến đổi vào một dòng nối "suy ra" — mỗi phép một dòng.
- Phương trình chứa ẩn ở mẫu: quên điều kiện xác định / quên đối chiếu ⇒ nhận nghiệm ngoại lai.
- Bất phương trình: nhân / chia hai vế với số ÂM phải đổi chiều và nói rõ.
- Lượng giác: tính tiếp từ số đã làm tròn; viện dẫn `\tan\cdot\cot=1`, `\sin^2+\cos^2=1` mà không ghi căn cứ như `hgt\k9.md` yêu cầu; bài hai kết quả ghi `tra_loi_ngan`.
- Bài tham số ("hệ có nghiệm thoả mãn…"): phải xét điều kiện để hệ có nghiệm duy nhất TRƯỚC, rồi đối chiếu $m$ tìm được với điều kiện (và với mẫu số của điều kiện đề cho).
