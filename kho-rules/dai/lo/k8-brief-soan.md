# Brief giao trạm SOẠN — khối 8, bộ đề giữa kì 1 (40 đề, 10/10)

> Lưu nguyên văn brief (README §4 việc #5). Khuôn chép từ `k6-brief-soan.md` (dây chuyền đề khối 6), đổi các chỗ riêng của khối 8.
> `<MA>` = mã đề (vd `GKI-05`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K8\<MA>`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy model Sonnet; trạm soát (`k8-brief-soat.md`) chạy Opus.

---

Bạn là trạm SOẠN cho MỘT đề kiểm tra giữa học kì 1 Toán 8: **soát lại đề từ ảnh trang** rồi **giải chi tiết mọi câu**. Kết quả là MỘT tệp
`Repo\kho-rules\dai\lo\k8\<MA>.soan.md`. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit. (Được phép ghi thêm ảnh vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. `Repo\kho-rules\dai\k8.md` — luật khối 8: **§1 luật kiến thức theo thứ tự bài** (quan trọng nhất), §1.5–§1.6 hai phần, §2 khuôn Phần 2 Đại, §3 định dạng, **§10 luật riêng cho bộ đề**.
2. `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` — **đề mẫu**. Bắt chước ĐÚNG khuôn tệp, nhịp Phần 1, cách viết Phần 2 (cả câu Đại lẫn câu Hình).

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
6. **Giải** mọi câu theo `k8.md`, lời giải 2 phần (mục 4 dưới). **Mọi đáp số phải thử lại bằng máy** — viết script node trong `<LV>\tam\` (tạo bằng công cụ Write,
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
# ĐỀ | Đề kiểm tra giữa học kì 1 Toán 8 năm 2025-2026 — THCS <tên trường>, <phường / xã / quận, tỉnh nếu đề ghi> (mã đề …)
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
- **⭐ Phần 1 của bài HÌNH CHỨNG MINH — viết theo chiều PHÂN TÍCH ĐI LÊN** (k8.md §1.6): mỗi bước đi từ điều phải chứng minh lùi về điều đã có:
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
- **Kiến thức (luật quan trọng nhất của khối 8 — k8.md §1 và §10):** lời giải chỉ dùng kiến thức **học tới thời điểm giữa học kì 1 theo bộ sách của chính đề đó**.
  Cách xác định: nhìn TOÀN BỘ đề xem đề chạm tới đâu. Đề KNTT thường gồm Chương I (đơn thức, đa thức, phép tính) + một phần Chương II (hằng đẳng thức; có đề
  tới phân tích nhân tử) + Chương III (tứ giác, hình thang cân, hình bình hành; có đề tới hình chữ nhật, thoi, vuông). Đề có định lí Pythagore, hình chóp,
  phân thức ⇒ đề của bộ sách khác (CTST / Cánh Diều) — vẫn giải, dùng đúng các kiến thức ĐỀ ĐÓ kiểm tra.
  **CẤM dùng (dù làm lời giải ngắn hơn) những thứ đề không chạm tới và học sau giữa kì 1:** đường trung bình của tam giác / hình thang, định lí Thalès,
  tam giác đồng dạng, tỉ số lượng giác, phương trình bậc nhất dạng "tập nghiệm $S=\{…\}$", **định lí Pythagore nếu đề không có câu nào về Pythagore**,
  hằng đẳng thức / phân tích nhân tử nếu cả đề không có câu nào về chúng. Hình chữ nhật, thoi, vuông và "trung tuyến ứng với cạnh huyền" chỉ dùng khi đề có
  hỏi tới hình chữ nhật trở lên. Cần một kết quả chưa học ⇒ **tự chứng minh ngay trong lời giải** bằng cái đã học (vd đoạn nối hai trung điểm: chứng minh
  qua hình bình hành / tam giác bằng nhau). Không làm được ⇒ `**Chưa chắc:**` nói rõ, KHÔNG dùng công cụ cấm.
  Tìm $x$: biến đổi từng dòng bằng quy tắc chuyển vế (lớp 7), tích bằng 0 thì một thừa số bằng 0 — được; không viết "phương trình", "tập nghiệm".
  **Ranh giới "phân tích nhân tử":** đặt thừa số chung theo **tính chất phân phối** ($ab+ac=a(b+c)$, vd $9ab+6a+3b=3(3ab+2a+b)$, $-2ax-2bx=-2x(a+b)$)
  là kiến thức lớp 6–7, **luôn được dùng**. Cái bị cấm khi đề chưa chạm tới là các PHƯƠNG PHÁP phân tích nhân tử của Chương II: dùng hằng đẳng thức,
  nhóm hạng tử, tách hạng tử, thêm bớt.

## 5. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k8/<MA>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem
```

## 6. Trả lời cuối

Vài dòng (≤ 120 từ): số câu theo loại · các câu có `Chưa chắc` (nhãn + một câu lí do) · hình giải đã vẽ · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.

## 7. Bẫy đã cắn thật (đọc kĩ)

- Số mũ, dấu âm trước số, dấu gạch ngang, chỉ số nhỏ ở ảnh 150 dpi (nhất là đề scan): không chắc ⇒ phóng to 300 dpi, không đoán.
- Lời giải Hình ngầm dùng **đường trung bình** mà không gọi tên ("$NP\parallel BC$ vì $N$, $P$ là trung điểm") — vẫn là dùng kiến thức cấm. Phải tự chứng minh.
- "Tứ giác có ba góc vuông là hình chữ nhật" KHÔNG phải dấu hiệu trong SGK ⇒ viết: tổng các góc của tứ giác bằng $360^\circ$ nên góc thứ tư cũng vuông,
  tứ giác có bốn góc vuông là hình chữ nhật.
- Đề thiếu điều kiện làm hình suy biến hoặc phép cộng góc sai chiều (vd thiếu $AB<AC$) ⇒ thêm điều kiện tối thiểu vào đề + `**Ghi chú:**`.
- App không hiển thị chữ nghiêng `*…*` — chỉ dùng `**đậm**` cho các nhãn quy định ở trên.
