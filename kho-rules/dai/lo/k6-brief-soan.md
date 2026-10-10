# Brief giao trạm SOẠN — khối 6, bộ đề GKI + CKI (bước 2, 10/10)

> Lưu nguyên văn brief (README §4 việc #5). `<MA>` = mã đề (vd `GKI-05`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K6\<MA>`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy model Sonnet; trạm soát (`k6-brief-soat.md`) chạy Opus.

---

Bạn là trạm SOẠN cho MỘT đề kiểm tra Toán 6: **soát lại đề từ ảnh trang** rồi **giải chi tiết mọi câu**. Kết quả là MỘT tệp
`Repo\kho-rules\dai\lo\k6\<MA>.soan.md`. KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo, KHÔNG commit. (Được phép ghi thêm ảnh cắt lại vào `<LV>\img\`.)

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. `Repo\kho-rules\dai\k6.md` — luật giải + trình bày khối 6 (kiến thức được dùng, khuôn Phần 2 theo nhóm bài §2, định dạng §3).
2. `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` — **mẫu đã CEO duyệt**. Bắt chước ĐÚNG khuôn tệp, nhịp Phần 1, cách viết Phần 2.

## 2. Nguồn của đề

- `<LV>\trang\p-1.png`, `p-2.png`… — **ảnh từng trang, NGUỒN CHÍNH**. Mở HẾT mọi trang bằng công cụ Read (ảnh 150 dpi).
- `<LV>\de.boc.json` (nếu có) hoặc `<LV>\de.json` — bản máy gõ lại, CHỈ để đỡ công gõ. Máy hay sai: số mũ, gạch ngang $\overline{abc}$, nhãn
  tập hợp, dấu ngoặc, sót câu. **Lệch nhau thì ảnh đúng.**
- `<LV>\img\*.png` — hình máy đã cắt. Mở xem TỪNG hình: đúng hình của câu, không cụt, không dính chữ của câu khác.

## 3. Việc phải làm

1. **Soát đề** từng câu so với ảnh: chữ, số, công thức, đủ 4 phương án, đủ các ý, không sót không thừa câu.
2. **Bỏ** phần riêng bằng tiếng Anh ("Hệ T", Exercise…). Mọi phần khác của đề đều làm (kể cả "phần riêng hệ chuẩn / hệ A").
3. **Lỗi in của đề** (sai chính tả, lệch tên, thiếu dấu) ⇒ sửa tối thiểu cho đề đúng nghĩa + ghi dòng `**Ghi chú:** …` nói đã sửa gì.
4. **Phân kho** từng câu: `kho=hgt` = hình học (nhận biết hình, cạnh / góc / đường chéo, chu vi, diện tích, vẽ hình, trục / tâm đối xứng);
   `kho=dai` = còn lại (tập hợp, số tự nhiên, luỹ thừa, chia hết, số nguyên tố, ƯC – BC, số nguyên, toán thực tế về số).
5. **Tách ý — CHỈ bài "Thực hiện phép tính / Tính" và "Tìm $x$"**: mỗi ý một câu, nhãn `Bài 1a`, `Bài 1b`…; đề của câu = lời dẫn của bài +
   biểu thức của ý (vd `Thực hiện phép tính (tính hợp lí nếu có thể): $…$`, `Tìm số tự nhiên $x$, biết: $…$`).
   **Mọi bài khác GIỮ CHUNG một câu** (bài lời văn, hình, chia hết, chứng minh — kể cả khi có ý a) b)); Phần 2 ghi `a)` `b)`.
6. **Loại câu:** `trac_nghiem` (đủ 4 dòng `A. ` `B. ` `C. ` `D. `) · `tra_loi_ngan` CHỈ khi đáp số là MỘT số viết được trong 4 ô (chữ số, dấu `-`
   đầu, dấu `,` thập phân; vd `3000`, `-12`, `2,5`; số 5 chữ số trở lên thì KHÔNG) · còn lại `tu_luan` (`dap_an=—`).
   Câu Đúng/Sai nhiều mệnh đề ⇒ nhập `tu_luan`, đề giữ đủ các mệnh đề a) b) c) d), lời giải xét từng mệnh đề, thêm `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`.
7. **Giải** mọi câu theo `k6.md`, lời giải 2 phần (mục 4 dưới). **Mọi đáp số phải thử lại** (thay ngược vào đề / tính lại bằng cách khác;
   số lớn thì dùng `node -e` để tính, đừng nhẩm).
8. **Hình:** câu nào đề có hình thì thêm dòng `**Hình:** <tên tệp trong img>` (một tệp; nhiều hình nhỏ a) b) c) d) của cùng một câu ⇒ một ảnh chung).
   Hình máy cắt hỏng / thiếu ⇒ tự cắt lại từ PDF (toạ độ pixel đo trên ảnh trang 150 dpi):
   `pdftoppm -r 150 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/img/<tên-không-đuôi>"`
   rồi mở ảnh vừa cắt để kiểm. Đặt tên mới kiểu `p1c5_lai` (đừng đè tệp cũ).
   Bài yêu cầu VẼ hình (vd "Vẽ hình chữ nhật dài 6 cm, rộng 4 cm") ⇒ vẫn nhập, lời giải tả từng bước vẽ bằng thước và êke, thêm `**Ghi chú:** lời giải chưa có hình vẽ`.
9. **Không chắc 100% thì NÓI RA** — thêm dòng `**Chưa chắc:** <điều chưa chắc>` ngay trong câu đó. CEO sẽ xem kĩ đúng những câu này, nên đừng
   giấu và đừng ghi tràn lan. Ghi khi: ảnh mờ không đọc chắc một số / kí hiệu · đề có hai cách hiểu · đề in lỗi làm không có / có hai phương án
   đúng (vẫn chọn phương án hợp lí nhất và nói rõ) · phải dùng kiến thức ngoài SGK Kết nối tri thức 6 · lời giải theo một quy ước mà bạn đoán.
10. Cuối tệp thêm mục `## GHI CHÚ CHO NGƯỜI DUYỆT`: câu đã bỏ (vì sao), nhận xét chung về đề (bộ sách khác KNTT, phần riêng…). Không có gì thì ghi "Không".

## 4. Khuôn tệp và khuôn lời giải (máy kiểm — sai là bị từ chối)

Đầu tệp:

```
# ĐỀ | Đề kiểm tra giữa học kì 1 Toán 6 năm 2025-2026 — THCS <tên trường>, <quận / phường / xã> (mã đề …)
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

- `nam` = năm đầu của năm học. `bo_sach` = `KNTT` / `Cánh Diều` / `CTST` (đề không ghi ⇒ `KNTT`). Tên đề: giữa kì ⇒ "giữa học kì 1", cuối kì ⇒ "cuối học kì 1".
- `## PHẦN <n> | <tên> | <trac_nghiem|tu_luan|tra_loi_ngan>` — theo các phần của đề, đánh số từ 1.
- `### <nhãn gốc của đề: Câu 3 / Bài 2a> | kho=… | loai=… | dap_an=…`. Các dòng `**Hình:**`, `**Ghi chú:**`, `**Chưa chắc:**` là tuỳ chọn, mỗi loại
  một dòng, đứng SAU đề và phương án, TRƯỚC `**Phần 1. Hướng dẫn**`.
- **Đề** chép nguyên văn đề (đã sửa lỗi in), mọi công thức trong `$…$`. Đề nhiều dòng thì xuống dòng đơn.
- **Phần 1 — khuôn CARD, bắt buộc đúng từng chữ:** đoạn `**Phần 1. Hướng dẫn**` → đoạn `**Mấu chốt:** …` (một câu: điều phải nhận ra) →
  **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn đoạn `**Chú ý:** …` và / hoặc `Thử lại: …`. Các đoạn cách nhau MỘT dòng trống;
  trong một bước không có dòng trống. Mỗi bước là một **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ít nhất 5 chữ ngoài công thức, **không ghi
  đáp số cuối**, không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề". Bài ngắn ⇒ tách đúng thao tác thật thành 3 bước (xem Câu 1, Câu 7 của mẫu).
- **Phần 2** = đúng cái học sinh viết vào bài kiểm tra, theo khuôn nhóm bài ở `k6.md` §2. Mỗi dòng viết / mỗi phép tính một đoạn (cách nhau dòng trống).
  Bài tính mở bằng dòng chép lại biểu thức. Tìm $x$ theo cột, **tìm thành phần chưa biết — KHÔNG "chuyển vế"**. Câu trắc nghiệm: dòng cuối cùng
  của lời giải phải đúng là `Chọn X.` (X trùng `dap_an`).
- **Định dạng:** dấu nhân là dấu chấm như SGK (`$25.4$`, `$2^2.3.5$`, `$6.(x+1)$`) — CẤM `\cdot`, `\times` · chia `:` · phân số `\dfrac` · số trong công thức
  viết liền (`125000`) · `\text{Ư}(12)`, `\text{B}(17)`, `\text{ƯC}`, `\text{ƯCLN}`, `\text{BC}`, `\text{BCNN}` · `\vdots`, `\not\vdots`, `\in`, `\notin`, `\mathbb{N}`, `\mathbb{N}^*`,
  `\mathbb{Z}`, `\overline{abc}`, `\Rightarrow` · chữ tiếng Việt trong công thức phải bọc `\text{…}` · đơn vị `$cm^2$`, `(m)`.
- **Kiến thức:** đề giữa kì 1 = Chương I–II (số tự nhiên, chia hết, số nguyên tố, ƯC – BC) + hình phẳng trong thực tiễn; đề cuối kì 1 thêm số nguyên
  và tính đối xứng. Không dùng kiến thức học sau (phân số âm, chuyển vế, giá trị tuyệt đối trừ khi đề thuộc bộ sách có dạy, luỹ thừa của luỹ thừa,
  dấu hiệu chia hết cho 4 / 8 / 11…). Số âm trong phép tính viết trong ngoặc `$(-4)$`.

## 5. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k6/<MA>.soan.md --lam-viec "<LV>" --chi-kiem
```

## 6. Trả lời cuối

Vài dòng: số câu theo loại · các câu có `Chưa chắc` (nhãn + một câu lí do) · câu đã bỏ · cổng đã đạt chưa.
