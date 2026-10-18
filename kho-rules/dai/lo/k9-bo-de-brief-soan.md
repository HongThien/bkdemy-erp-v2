# ⚠️ BẢN ÁP DỤNG KHỐI 9 — BỘ ĐỀ GIỮA KÌ 1 TOÁN 9 (58 đề, 18/10/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG KHỐI 8 BÊN DƯỚI

Brief gốc viết cho bộ đề khối 8 (đã đổi tên khối / đường dẫn). Các điểm KHÁC khối 8 — phải theo đây:

- `<MA>` = `GKI-NN` (01–58; danh sách + tên trường + trang gốc: `Repo\kho-rules\dai\lo\k9\bo-de\ds-de.json`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K9\<MA>` (đã có `goc.pdf`, ảnh trang `trang\p-N.png` 150 dpi, thư mục `img\`, `tam\`; KHÔNG có `de.json` gõ sẵn — bạn tự gõ lại đề từ ảnh trang).
  Tệp soạn: `Repo\kho-rules\dai\lo\k9\bo-de\<MA>.soan.md`. Mẫu khuôn TỆP: `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` (chỉ lấy khuôn tệp; kiến thức và cách trình bày theo khối 9).
- Đề là ảnh SCAN (không có lớp chữ). Chữ nhỏ / số mũ / dấu ⇒ phóng to 300 dpi từ `<LV>\goc.pdf` trước khi gõ, không đoán. Đề có thể 2 trang (`p-2.png`). Đề bị cụt / có câu không đọc nổi ⇒ ghi `**Chưa chắc:**` hoặc mục GHI CHÚ, đừng bịa.
- Tên đề (dòng `# ĐỀ |`): "Đề kiểm tra giữa học kì 1 Toán 9 năm <năm học> — <trường (phường/quận)> (<ghi chú: mã đề / Đề 2…>)" lấy từ `ds-de.json` + đối chiếu tiêu đề ảnh. Dòng `nam:` = năm đầu của năm học (2024 hoặc 2025); `bo_sach: KNTT` (đề rõ bộ khác thì ghi đúng).
- **Phân kho:** `kho=hinh_hoc` cho MỌI câu hình học (chứng minh hình, tính độ dài / góc / diện tích trên hình, **hệ thức lượng & tỉ số lượng giác trong tam giác vuông, kể cả bài thực tế tháp / hải đăng / cột cờ / tàu ngầm / thang**, đường tròn). Máy tự đưa các câu này vào dạng "Ôn thi giữa kì I" của phần Hình học lớp 9 (Thùy 18/10) — KHÔNG dùng `kho=hgt`. `kho=dai` cho phần còn lại (phương trình, hệ, bất phương trình, căn thức, bài lập phương trình / hệ, thống kê – xác suất nếu có, và **bài cực trị / tối ưu thực tế dù bối cảnh là hình hộp, máng nước, hàng rào…** nếu lời giải thuần đại số).
- **Tách ý** (theo `kho-rules/dai/k9.md` §10 / đề cương NS): bài giải nhiều phương trình / hệ / bất phương trình ĐỘC LẬP (a, b, c…) ⇒ tách ý (nhãn `Bài 1a`…); bài lời văn, bài hình, bài cực trị, bài cho chung dữ kiện ⇒ giữ MỘT câu. Bài hình ghi `a)` `b)` `c)` trong Phần 2. "Bài" gom hai bài toán khác nhau hẳn ("1)" "2)" mỗi cái dữ kiện riêng) ⇒ `Bài 4.1`, `Bài 4.2`, `kho` theo từng bài.
- **Đề có phần trắc nghiệm:** làm như khối 8 (TN đủ 4 phương án, dòng cuối lời giải `Chọn X.`).
- **Dấu nhân `\cdot`** (cổng `--khoi 9` chặn `\times` và dấu chấm làm dấu nhân).
- **⭐ KIẾN THỨC khối 9 giữa học kì 1 (thay hoàn toàn mục Kiến thức khối 8):**
  1. Đọc `Repo\kho-rules\dai\k9.md` (§1 luật kiến thức theo thứ tự bài, §1.5, §2, §3, §10) và `Repo\kho-rules\hgt\k9.md` (luật bài hình / lượng giác: được dùng — cấm — làm tròn mặc định — khuôn hình) trước khi giải.
  2. Whitelist = những gì **chính đề đó** kiểm tra tới theo bộ sách (KNTT lớp 9 HK1: Chương I phương trình & hệ phương trình bậc nhất hai ẩn, phương trình quy về bậc nhất (tích, chứa ẩn ở mẫu) · Chương II bất đẳng thức, bất phương trình bậc nhất một ẩn · Chương III căn bậc hai & căn thức (chỉ nếu đề chạm tới) · Chương IV tỉ số lượng giác, hệ thức giữa cạnh và góc; lớp 6–8 là nền: hằng đẳng thức, phân tích nhân tử, tam giác đồng dạng, Pythagore, tính chất đường phân giác, hình chữ nhật…). Nhiều đề có thêm tính chất đường tròn mức nhẹ (tâm đường tròn ngoại tiếp tam giác vuông là trung điểm cạnh huyền, bốn điểm cùng thuộc một đường tròn) — chỉ dùng khi chính đề hỏi tới.
  3. **CẤM:** công thức nghiệm / $\Delta$ / định lí Viète (bậc hai ⇒ phân tích nhân tử; nghiệm vô tỉ ⇒ hoàn thành bình phương) · biến đổi căn thức của Chương III khi đề không chạm tới · bất đẳng thức Cô-si dùng thẳng (tự chứng minh từ $(a-b)^2\ge 0$ hoặc hoàn thành bình phương; không làm được ⇒ `**Chưa chắc:**`) · hệ thức đường cao $h^2=b'c'$, $b^2=ab'$, $\dfrac{1}{h^2}=\dfrac{1}{b^2}+\dfrac{1}{c^2}$ dùng thẳng (dùng đồng dạng hoặc tỉ số lượng giác thay) · định lí sin / côsin · đạo hàm · dấu `⇔` · "tập nghiệm $S=\{…\}$" (kết luận bằng LỜI). Dùng ngầm cũng là vi phạm.
  4. Cần một kết quả chưa học ⇒ tự chứng minh bằng cái đã học; không làm được ⇒ `**Chưa chắc:**`. Làm tròn: theo đúng yêu cầu của đề; đề không nêu ⇒ mặc định của `hgt/k9.md` + `**Chưa chắc:**`; không tính tiếp từ số đã làm tròn.
- **Mã chạy cổng:** `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/bo-de/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/K9/<MA>" --khoi 9 --chi-kiem`.
- Hình trong đề: máy chưa cắt sẵn — bạn tự cắt từ `<LV>\goc.pdf` bằng `pdftoppm -r 150 -x -y -W -H` vào `<LV>\img\` (đặt tên `p1c4.png`…), mở ảnh kiểm tra rồi khai `**Hình:**`. Đề có IN SẴN đáp án (hiếm): vẫn giải độc lập trước.

---

# Brief giao trạm SOẠN — khối 9, bộ đề giữa kì 1 (40 đề, 10/10)

> Lưu nguyên văn brief (README §4 việc #5). Khuôn chép từ `k6-brief-soan.md` (dây chuyền đề khối 6), đổi các chỗ riêng của khối 9.
> `<MA>` = mã đề (vd `GKI-05`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K9\<MA>`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy model Sonnet; trạm soát (`k9-bo-de-brief-soat.md`) chạy Opus.

---

Bạn là trạm SOẠN cho MỘT đề kiểm tra giữa học kì 1 Toán 9: **soát lại đề từ ảnh trang** rồi **giải chi tiết mọi câu**. Kết quả là MỘT tệp
`Repo\kho-rules\dai\lo\k9\bo-de\<MA>.soan.md`. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit. (Được phép ghi thêm ảnh vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. `Repo\kho-rules\dai\k9.md` — luật khối 9: **§1 luật kiến thức theo thứ tự bài** (quan trọng nhất), §1.5–§1.6 hai phần, §2 khuôn Phần 2 Đại, §3 định dạng, **§10 luật riêng cho bộ đề**.
2. `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` — **đề mẫu** (khuôn tệp của khối 8). Bắt chước ĐÚNG khuôn tệp, nhịp Phần 1, cách viết Phần 2 (cả câu Đại lẫn câu Hình).

## 2. Nguồn của đề

- `<LV>\trang\p-1.png`, `p-2.png`… — **ảnh từng trang, NGUỒN CHÍNH**. Mở HẾT mọi trang bằng công cụ Read (ảnh 150 dpi). Một số đề là ảnh SCAN, chữ nhỏ:
  chỗ nào không đọc chắc (số mũ, dấu âm, chỉ số, tên điểm) ⇒ cắt phóng to từ PDF rồi đọc lại, không đoán:
  `pdftoppm -r 300 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/tam/<tên>"` (toạ độ tính theo 300 dpi = gấp đôi toạ độ ảnh 150 dpi).
- `<LV>\de.json` — bản máy gõ lại, CHỈ để đỡ công gõ. Máy hay sai: số mũ, dấu, phân số, sót câu, gộp câu. **Lệch nhau thì ảnh đúng.**
- `<LV>\img\*.png` — hình máy đã cắt. Mở xem TỪNG hình: đúng hình của câu, không cụt, không dính chữ của câu khác.

## 3. Việc phải làm

1. **Soát đề** từng câu so với ảnh: chữ, số, công thức, đủ 4 phương án, đủ các ý, không sót không thừa câu.
2. **Lỗi in của đề** (sai chính tả, lệch tên điểm, thiếu dấu) ⇒ sửa tối thiểu cho đề đúng nghĩa + ghi dòng `**Ghi chú:** …` nói đã sửa gì.
   `Ghi chú` chỉ dành cho lỗi của ĐỀ GỐC và điều người duyệt cần biết — **không** ghi "bản máy gõ nhầm …".
3. **Phân kho** từng câu: `kho=hinh_hoc` = hình học (tứ giác, hình thang, hình bình hành, hình chữ nhật, thoi, vuông, góc, định lí Pythagore, hình chóp,
   bài hình có vẽ / chứng minh / tính góc – cạnh trên hình); `kho=dai` = còn lại (đơn thức, đa thức, hằng đẳng thức, phân tích nhân tử, phân thức,
   tìm $x$, chia hết, giá trị lớn nhất – nhỏ nhất, bài thực tế viết / tính biểu thức đại số — kể cả khi bối cảnh là mảnh vườn hình chữ nhật).
4. **Tách ý — CHỈ bài "Thực hiện phép tính / Tính / Rút gọn / Tính giá trị / Phân tích đa thức thành nhân tử" và "Tìm $x$"** có nhiều ý a) b) c) độc lập:
   mỗi ý một câu, nhãn `Câu 9a` / `Bài 1b`… (giữ đúng chữ "Câu" hay "Bài" của đề); đề của câu = lời dẫn của bài + biểu thức của ý.
   **Mọi bài khác GIỮ CHUNG một câu** (bài cho sẵn đa thức rồi hỏi nhiều ý, bài lời văn, bài hình, chứng minh — kể cả khi có a) b) c)); Phần 2 ghi `a)` `b)`.
   **Bài hình: TUYỆT ĐỐI không tách ý.** "Bài" chỉ là cái vỏ gom 2 BÀI TOÁN KHÁC HẲN NHAU (đánh số 1) 2), mỗi bài toán một bộ dữ kiện riêng) ⇒ mỗi bài
   toán MỘT câu, nhãn `Bài 4.1`, `Bài 4.2`, `kho` theo từng bài toán.
5. **Loại câu:** `trac_nghiem` (đủ 4 dòng `A. ` `B. ` `C. ` `D. `) · `tra_loi_ngan` CHỈ khi đáp số là MỘT số nguyên hoặc số thập phân viết được trong 4 ô
   (chữ số, dấu `-` đầu, dấu `,`; vd `31`, `-12`, `2,5`) **theo đúng dạng đề hỏi** — đáp số là biểu thức, phân số, nhiều giá trị ($x=1$ hoặc $x=-2$), số có đơn vị
   phải đổi ⇒ KHÔNG · còn lại `tu_luan` (`dap_an=—`).
   Câu Đúng/Sai nhiều mệnh đề ⇒ nhập `tu_luan`, đề giữ đủ các mệnh đề a) b) c) d), lời giải xét từng mệnh đề, thêm `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`.
   Câu "trả lời ngắn" của đề mà đáp số không vừa 4 ô ⇒ `tu_luan`.
6. **Giải** mọi câu theo `k9.md`, lời giải 2 phần (mục 4 dưới). **Mọi đáp số phải thử lại bằng máy** — viết script node trong `<LV>\tam\` (tạo bằng công cụ Write,
   KHÔNG heredoc): đa thức / hằng đẳng thức / phân tích nhân tử ⇒ thay ≥ 3 bộ số ngẫu nhiên vào hai vế; tìm $x$ ⇒ thay ngược vào đề; hình ⇒ dựng toạ độ số,
   kiểm từng khẳng định (song song, bằng nhau, vuông góc, thẳng hàng, số đo). Đừng nhẩm.
7. **Hình có sẵn trong đề:** thêm dòng `**Hình:** <tên tệp trong img>` (một tệp). Hình máy cắt hỏng / thiếu ⇒ tự cắt lại từ PDF (lệnh `pdftoppm` ở mục 2, `-r 150`),
   đặt tên mới kiểu `p1c5_lai`, mở ảnh vừa cắt để kiểm.
8. **Bài hình tự luận mà đề KHÔNG cho hình** (học sinh tự vẽ): **vẽ hình cho lời giải bằng code** rồi thêm dòng `**Hình giải:** giai_<nhãn>.png`
   (hình này chỉ hiện ở lời giải, không hiện ở đề). Viết `<LV>\tam\ve.mjs`, import
   `import { P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`,
   chạy `node "<LV>/tam/ve.mjs"` với thư mục hiện hành là Repo; mỗi hình `await luu('<LV>/img', 'giai_cau12', w, h, svgDoc(w, h, T(dx, dy, body)))`.
   Mẫu cách vẽ: `Repo\scripts\anh\ve_hinh_hh101_102.mjs`. Hình phải **dựng đúng dữ kiện bằng toạ độ** (trung điểm, song song, vuông góc tính bằng phép tính),
   đủ mọi điểm của mọi ý, đánh dấu GIẢ THIẾT (gạch bằng nhau, góc vuông cho trước), **không đánh dấu điều phải chứng minh**; canvas cao ≤ 450px, chừa ≥ 35px
   dưới nhãn đáy, nhãn không đè đường. Vẽ xong mở ảnh bằng Read để kiểm, sai thì sửa.
   Bài yêu cầu VẼ hình (vd "Vẽ hình thang cân…") cũng làm như vậy.
   **Đề có IN SẴN bảng đáp án / hướng dẫn chấm** (vài đề có, vd Quế Thuận in bảng đáp án trắc nghiệm ở trang 2): vẫn tự giải trước, rồi đối chiếu;
   lệch ⇒ tính lại bằng máy, bảng in sai thì giữ đáp án đúng + `**Ghi chú:**`. Không chép bảng đáp án vào đề; nói trong trả lời cuối là đề có bảng đáp án.
9. **Không chắc 100% thì NÓI RA** — thêm dòng `**Chưa chắc:** <điều chưa chắc>` ngay trong câu đó. CEO sẽ xem kĩ đúng những câu này, nên đừng giấu và đừng
   ghi tràn lan. Ghi khi: ảnh mờ không đọc chắc · đề có hai cách hiểu · đề in lỗi làm không có / có hai phương án đúng (vẫn chọn phương án hợp lí nhất và
   nói rõ) · không giải được trong phạm vi kiến thức của đề (xem mục 4 "Kiến thức") · đề thiếu điều kiện làm hình suy biến.
10. Cuối tệp thêm mục `## GHI CHÚ CHO NGƯỜI DUYỆT`: câu đã bỏ (vì sao), nhận xét chung về đề (bộ sách, phạm vi kiến thức đề chạm tới). Không có gì thì ghi "Không".

## 4. Khuôn tệp và khuôn lời giải (máy kiểm — sai là bị từ chối)

Đầu tệp:

```
# ĐỀ | Đề kiểm tra giữa học kì 1 Toán 9 năm 2025-2026 — THCS <tên trường>, <phường / xã / quận, tỉnh nếu đề ghi> (mã đề …)
nam: 2025
bo_sach: KNTT

## PHẦN 1 | Trắc nghiệm | trac_nghiem

### Câu 1 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** …
A. …
B. …
C. …
D. …
**Hình:** p1c5_1.png
**Hình giải:** giai_cau12.png
**Ghi chú:** …
**Chưa chắc:** …

**Phần 1. Hướng dẫn**

**Mấu chốt:** …

**Bước 1.** …

**Bước 2.** …

**Bước 3.** …

**Chú ý:** …

**Phần 2. Trình bày**

…

Chọn A.
```

- `nam` = năm đầu của năm học. `bo_sach` = `KNTT` / `Cánh Diều` / `CTST` — đoán theo nội dung đề (mục "Kiến thức" dưới); không đoán được ⇒ `KNTT`.
  Đề không ghi tên trường ⇒ ghi theo phòng / huyện đề ghi (vd "Phòng GD&ĐT huyện Xuân Trường"). Tên đề: "giữa học kì 1".
- `## PHẦN <n> | <tên> | <trac_nghiem|tu_luan|tra_loi_ngan>` — theo các phần của đề, đánh số từ 1.
- `### <nhãn gốc của đề: Câu 3 / Bài 2a> | kho=dai|hinh_hoc | loai=… | dap_an=…`. Các dòng `**Hình:**`, `**Hình giải:**`, `**Ghi chú:**`, `**Chưa chắc:**`
  là tuỳ chọn, mỗi loại một dòng, đứng SAU đề và phương án, TRƯỚC `**Phần 1. Hướng dẫn**`.
- **Đề** chép nguyên văn đề (đã sửa lỗi in), mọi công thức trong `$…$`. Đề nhiều dòng thì xuống dòng đơn. Bỏ phần "(1,0 điểm)".
- **Phần 1 — khuôn CARD, bắt buộc đúng từng chữ:** đoạn `**Phần 1. Hướng dẫn**` → đoạn `**Mấu chốt:** …` (một câu: điều phải nhận ra) →
  **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn đoạn `**Chú ý:** …` và / hoặc `Thử lại: …`. Các đoạn cách nhau MỘT dòng trống;
  trong một bước không có dòng trống. Mỗi bước là một **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ít nhất 5 chữ ngoài công thức, **không ghi
  đáp số cuối**, không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề". Bài nhiều ý: các bước ghi rõ "Ý a: …", "Ý b: …", tổng vẫn 3–6 bước.
- **⭐ Phần 1 của bài HÌNH CHỨNG MINH — viết theo chiều PHÂN TÍCH ĐI LÊN** (k9.md §1.6): mỗi bước đi từ điều phải chứng minh lùi về điều đã có:
  "Muốn có X, cần Y (vì dấu hiệu / tính chất nào)" → "Y có được từ Z (giả thiết / câu a)". Phần 2 trình bày **ngược lại**, từ giả thiết tới kết luận,
  mỗi mắt xích của Phần 1 ứng với một bước trình bày. Xem Câu 11, Câu 12 của đề mẫu. Bài hình TÍNH (góc, độ dài) thì Phần 1 viết như bài Đại.
- **Phần 2** = đúng cái học sinh viết vào bài kiểm tra. Mỗi dòng viết / mỗi phép tính một đoạn (cách nhau dòng trống). Bài tính / rút gọn mở bằng dòng
  chép lại biểu thức, mỗi bước biến đổi một dòng `$=\dots$`. Tìm $x$: mỗi phép biến đổi một dòng, kết `Vậy $x=\dots$`. Chứng minh hình: mỗi khẳng định kèm lí do
  ("Vì … nên …", "(dấu hiệu nhận biết)", "(câu a)"); hai tam giác bằng nhau viết khuôn "Xét $\triangle…$ và $\triangle…$ có:" → mỗi điều kiện một dòng → "Do đó … (c.g.c)".
  Câu trắc nghiệm: dòng cuối cùng của lời giải phải đúng là `Chọn X.` (X trùng `dap_an`).
- **Định dạng (khác khối 6):** dấu nhân tường minh là **`\cdot`** (`$4 \cdot 90^\circ$`, `$3xyz \cdot y$`, `$A \cdot B$`) — **CẤM `\times` và CẤM dấu chấm làm dấu nhân**;
  hệ số với biến, biến với biến, ngoặc với ngoặc viết liền (`$3x$`, `$(x+1)(x-2)$`) · chia `:` · phân số `\dfrac` · số thập phân dấu phẩy `2{,}5`
  · luỹ thừa của số âm / phân số có ngoặc · `\widehat{ABC}`, `\triangle ABC`, `\parallel` (không `//`), `\perp`, `^\circ`, `\Rightarrow` · chữ tiếng Việt trong
  công thức phải bọc `\text{…}` · đơn vị `(cm)`, `($cm^2$)`.
- **Kiến thức:** xem khối "BẢN ÁP DỤNG KHỐI 9" ở đầu tệp (thay hoàn toàn luật khối 9).

## 5. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/bo-de/<MA>.soan.md --lam-viec "<LV>" --khoi 9 --chi-kiem
```

## 6. Trả lời cuối

Vài dòng (≤ 120 từ): số câu theo loại · các câu có `Chưa chắc` (nhãn + một câu lí do) · hình giải đã vẽ · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.

## 7. Bẫy đã cắn thật (đọc kĩ)

- Số mũ, dấu âm trước số, dấu gạch ngang, chỉ số nhỏ ở ảnh 150 dpi (nhất là đề scan): không chắc ⇒ phóng to 300 dpi, không đoán.
- Lời giải Hình ngầm dùng **đường trung bình** mà không gọi tên ("$NP\parallel BC$ vì $N$, $P$ là trung điểm") — vẫn là dùng kiến thức cấm. Phải tự chứng minh.
- **Bài mà dữ kiện đúng là bài đường trung bình** (đo khoảng cách qua hai trung điểm $D$, $E$; đã gặp ở GKI-17, GKI-21): đường trung bình vẫn CẤM ở mọi đề
  giữa kì 1 ⇒ tự chứng minh bằng hình bình hành (lấy điểm $F$ sao cho $E$ là trung điểm $DF$…), và thêm `**Chưa chắc:**` nói rõ "dữ kiện đúng là bài đường
  trung bình, lời giải tự chứng minh — CEO quyết có cho dùng đường trung bình ở đề này không".
- "Tứ giác có ba góc vuông là hình chữ nhật" KHÔNG phải dấu hiệu trong SGK ⇒ viết: tổng các góc của tứ giác bằng $360^\circ$ nên góc thứ tư cũng vuông,
  tứ giác có bốn góc vuông là hình chữ nhật.
- Đề thiếu điều kiện làm hình suy biến hoặc phép cộng góc sai chiều (vd thiếu $AB<AC$) ⇒ thêm điều kiện tối thiểu vào đề + `**Ghi chú:**`.
- App không hiển thị chữ nghiêng `*…*` — chỉ dùng `**đậm**` cho các nhãn quy định ở trên.
