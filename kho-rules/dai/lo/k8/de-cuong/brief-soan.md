# Brief giao trạm SOẠN — ĐỀ CƯƠNG Toán 8 Ngôi Sao Hoàng Mai (12/10)

> Lưu nguyên văn brief (README §4 việc #5). `<P>` = số phần (1–12). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K8\NSHM-GKI-2026`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soạn chạy Sonnet; trạm soát (`brief-soat.md`) chạy Opus.
> Dựa trên `kho-rules/dai/lo/k8-brief-soan.md` (đề thi K8) + `kho-rules/dai/lo/k6/de-cuong/brief-soan.md` (đề cương K6) — khác ở chỗ: đây là ĐỀ CƯƠNG ôn tập
> (32 bài, đã gõ sẵn + tách ý theo luật khối 8), không có phần trắc nghiệm, có bài hình (kho `hinh_hoc`) và bài số chính phương nâng cao.

---

Bạn là trạm SOẠN cho MỘT PHẦN của đề cương ôn tập giữa kì I Toán 8. Việc: **giải chi tiết mọi câu của phần được giao** theo luật khối 8, viết thẳng vào tệp khung.
Tệp của bạn: `Repo\kho-rules\dai\lo\k8\de-cuong\NSHM-GKI-2026.p<P>.soan.md` (đã có sẵn tiêu đề + đề từng câu). KHÔNG ghi DB, KHÔNG sửa tệp nào khác trong repo,
KHÔNG commit. (Được ghi thêm ảnh vào `<LV>\img\` và script tạm vào `<LV>\tam\`.)

## 1. Đọc trước (bắt buộc, đọc HẾT)

1. `Repo\kho-rules\dai\k8.md` — luật khối 8: **§1 luật kiến thức theo thứ tự bài** (quan trọng nhất), §1.5–§1.6 hai phần (Hình chứng minh = phân tích đi lên),
   §2 khuôn Phần 2 Đại, §3 định dạng (`\cdot`), §10 luật riêng cho đề.
2. `Repo\kho-rules\dai\lo\k8\GKI-01.soan.md` — **đề mẫu đã CEO xem** (khuôn tệp, nhịp Phần 1, cách viết Phần 2 cả câu Đại lẫn câu Hình).
3. `Repo\kho-rules\dai\lo\k8-brief-soan.md` §4 — khuôn tệp + khuôn lời giải (máy kiểm — sai là bị từ chối). Mục 4 dưới đây tóm tắt.

## 2. Nguồn

- `<LV>\anh\1.png`, `2.webp`, `3.webp`, `4.png`, `5.webp` — 5 trang ảnh đề cương (NGUỒN CHÍNH, chỉ ~650–800 px nên chữ nhỏ). Mở HẾT bằng công cụ Read, đối chiếu từng câu của phần
  bạn: chữ, số, số mũ, dấu ngoặc, dấu nhân. Chỗ không chắc ⇒ phóng to: `node "<LV>\crop.mjs" "<LV>\anh\<tệp>" <x> <y> <rộng> <cao> <hệ số> "<LV>\z\<tên>.png"` rồi Read.
- Tệp khung do người gõ — **lệch ảnh thì ảnh đúng** ⇒ sửa dòng `**Đề:**` cho đúng ảnh (sửa tối thiểu, thêm `**Ghi chú:**` nói đã sửa gì). Đề cương đánh ý ở Bài 14 bằng `a.` `b.` `c.`
  — đã nhập thành `a)` `b)` `c)`, đúng.
- Đề cương KHÔNG có đáp án. Đáp số lấy từ lượt giải của bạn rồi trạm soát (Opus) giải mù đối chiếu.

## 3. Việc phải làm

1. Mỗi câu: điền `loai=` và `dap_an=` ở dòng `### …`, viết lời giải 2 phần (mục 4) ngay sau các dòng `**Đề:**` / `**Ghi chú:**` / `**Chưa chắc:**` có sẵn.
   - `loai=tra_loi_ngan` CHỈ khi đáp số là MỘT số nguyên / thập phân viết được trong 4 ô (chữ số, dấu `-` đầu, dấu `,`; ≤ 4 kí tự: `13`, `-1`, `2,5`) theo ĐÚNG dạng đề hỏi
     (vd Bài 5a: $x=13$ ⇒ `tra_loi_ngan`, `dap_an=13`). Hai nghiệm, phân số, biểu thức, tập hợp, chứng minh, bài nhiều ý ⇒ `loai=tu_luan`, `dap_an=—`.
     `dap_an` của TLN chỉ ghi số, không ghi chữ ($x=5$ ⇒ `dap_an=5`).
   - `kho=` (`dai` / `hinh_hoc`) đã điền sẵn — giữ.
2. **Giữ nguyên** nhãn, không tách thêm / gộp câu. Các dòng `**Ghi chú:**` / `**Chưa chắc:**` có sẵn giữ; chỉ **thêm** khi cần.
3. **Mọi đáp số phải thử lại bằng máy** — viết script node trong `<LV>\tam\` (tạo bằng công cụ Write, KHÔNG heredoc, KHÔNG `node -e` chứa `\` hay dấu huyền): đa thức / hằng đẳng thức ⇒
   thay ≥ 3 bộ số hai vế; tìm $x$ ⇒ thay ngược vào đề; tìm số nguyên $x,y$ ⇒ vét cạn trong khoảng đủ rộng; thực tế ⇒ tính lại; hình ⇒ dựng toạ độ số, kiểm từng khẳng định
   (song song, bằng nhau, vuông góc, thẳng hàng, đồng quy, số đo, dạng tứ giác); số chính phương ⇒ vét cạn bằng BigInt. Đừng nhẩm.
4. **Kiến thức — luật quan trọng nhất (k8.md §1, §10).** Phạm vi của đề cương này: **Chương I (đa thức) + Chương II (hằng đẳng thức, phân tích đa thức thành nhân tử) + Chương III
   (tứ giác → hình thang cân → hình bình hành → hình chữ nhật → thoi, vuông)** của KNTT 8, tức tới giữa học kì I. Lớp 6–7 là nền (ước / bội số nguyên, số chính phương,
   căn bậc hai số học, quan hệ đường vuông góc – đường xiên, tam giác bằng nhau, tam giác cân, tổng ba góc, đường trung tuyến…).
   **CẤM (dù lời giải ngắn hơn): đường trung bình của tam giác / hình thang · định lí Thalès · tam giác đồng dạng · định lí Pythagore · tỉ số lượng giác · phân thức đại số ·
   "phương trình bậc nhất / tập nghiệm $S=\{…\}$"** (kể cả dùng NGẦM không gọi tên: "$NP\parallel BC$ vì $N,\ P$ là trung điểm" vẫn là dùng đường trung bình).
   Cần một kết quả chưa học ⇒ **tự chứng minh ngay trong lời giải** bằng cái đã học (đoạn nối hai trung điểm: lấy điểm đối xứng, dùng hình bình hành / tam giác bằng nhau).
   "Trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền" CÓ trong Chương III (bài Hình chữ nhật) — được dùng. "Tứ giác có ba góc vuông là hình chữ nhật" KHÔNG phải dấu hiệu
   trong SGK ⇒ viết: tổng các góc tứ giác $=360^\circ$ nên góc thứ tư cũng vuông, tứ giác có bốn góc vuông là hình chữ nhật.
   Tìm $x$: biến đổi từng dòng; "tích bằng 0 thì một thừa số bằng 0" được dùng (đã học ở bài phân tích nhân tử); nghiệm vô tỉ viết dạng $\pm\sqrt{k}$ (căn bậc hai lớp 7) — không dùng công thức nghiệm.
   **Bài mà dữ kiện đúng là bài đường trung bình** (vd $OI=\dfrac{1}{2}AN$ qua hai trung điểm; hai trung điểm của hai cạnh tam giác): vẫn tự chứng minh bằng hình bình hành
   (lấy điểm đối xứng…) và thêm `**Chưa chắc:** dữ kiện đúng là bài đường trung bình, lời giải tự chứng minh — CEO quyết có cho dùng đường trung bình ở đề cương này không`.
5. **Bài hình (Phần IV, Bài 13–22): TUYỆT ĐỐI không tách ý**; mỗi ý theo khuôn của loại mình (Phần 1 chứng minh = phân tích đi lên "muốn có X, cần Y"; ý tính / ý "tìm điều kiện /
   hình gì" như bài Đại). Phần 2 ghi `a)` `b)` `c)`… Đề KHÔNG cho hình ⇒ **vẽ hình cho lời giải bằng code** rồi thêm dòng `**Hình giải:** giai_bai<N>.png` (một tệp / bài, đủ mọi điểm
   của mọi ý). Cách vẽ: viết `<LV>\tam\ve_p<P>.mjs`, import
   `import { P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`,
   chạy `node "<LV>/tam/ve_p<P>.mjs"` với thư mục hiện hành là Repo; mỗi hình `await luu('<LV>/img', 'giai_bai13', w, h, svgDoc(w, h, T(dx, dy, body)))`.
   Mẫu: `Repo\scripts\anh\ve_hinh_hh101_102.mjs` và các `ve.mjs` của đề mẫu GKI-01 / các đề `lo/k8/GKI-*` (cùng cách). Hình phải **dựng đúng dữ kiện bằng toạ độ** (trung điểm, song song,
   vuông góc tính bằng phép tính), đủ mọi điểm, đánh dấu GIẢ THIẾT (gạch bằng nhau, góc vuông cho trước), **không đánh dấu điều phải chứng minh**; canvas cao ≤ 450 px, chừa ≥ 35 px dưới nhãn đáy,
   nhãn không đè đường. **Vẽ xong mở ảnh bằng Read để kiểm, sai thì sửa.** Bài có điều kiện nâng ($AB>AC$, $AD<AB$…) thì dựng đúng thứ tự độ dài.
6. **Không chắc 100% thì NÓI RA** — dòng `**Chưa chắc:** <điều chưa chắc>` ngay trong câu đó. CEO xem kĩ đúng những câu này, nên đừng giấu và đừng ghi tràn lan. Ghi khi: ảnh mờ không đọc chắc ·
   đề hai cách hiểu · đề in lỗi (số / số mũ / kết luận không đúng — chứng minh bằng máy khi có thể, nêu "nếu sửa thành … thì …") · cần kiến thức ngoài phạm vi mục 4 · lời giải theo quy ước bạn đoán.
7. Cuối tệp thêm mục `## GHI CHÚ CHO NGƯỜI DUYỆT` (câu nào cần CEO xem + nhận xét chung). Không có gì thì ghi "Không".

## 4. Khuôn lời giải (máy kiểm — sai là bị từ chối)

- Mỗi câu: `**Phần 1. Hướng dẫn**` → `**Mấu chốt:** …` (một câu) → **3 đến 6** đoạn `**Bước k.** …` (k liên tục từ 1) → tuỳ chọn `**Chú ý:** …` / `Thử lại: …`
  → `**Phần 2. Trình bày**` → lời giải. Các đoạn cách nhau MỘT dòng trống; trong một bước không có dòng trống.
- Mỗi bước Phần 1 là **bước nghĩ trọn vẹn** (làm gì + dựa vào đâu), ≥ 5 chữ ngoài công thức, **không ghi đáp số cuối**, không chép lại từng dòng tính của Phần 2, không bịa bước "Đọc kĩ đề".
  Bài nhiều ý (Bài 1–4, 8–22): các bước ghi rõ "Ý a: …", "Ý b: …"; tổng vẫn 3–6 bước ⇒ gộp ý ngắn lại, đừng dàn mỗi ý một bước nếu vượt 6.
- Phần 2 = đúng cái học sinh viết vào bài, theo khuôn k8.md §2 (Đại) / §1.6 (Hình). Mỗi dòng / mỗi phép tính một đoạn. Bài tính mở bằng dòng chép lại biểu thức, mỗi bước biến đổi một dòng.
  Tìm $x$: mỗi phép biến đổi một dòng, kết `Vậy $x=\dots$`. Chứng minh hình: mỗi khẳng định kèm lí do ("Vì … nên …", "(dấu hiệu nhận biết)", "(câu a)"); hai tam giác bằng nhau viết khuôn
  "Xét $\triangle…$ và $\triangle…$ có:" → mỗi điều kiện một dòng → "Do đó … (c.g.c)". Bài thực tế: gọi ẩn / điều kiện → lập biểu thức → tính → "Vậy …".
- **Định dạng (khối 8):** dấu nhân tường minh là **`\cdot`** (`$3xyz \cdot y$`, `$A \cdot B$`) — **CẤM `\times` và CẤM dấu chấm làm dấu nhân**; hệ số với biến, biến với biến, ngoặc với ngoặc
  viết liền (`$3x$`, `$(x+1)(x-2)$`) · chia `:` · phân số `\dfrac` · số thập phân dấu phẩy `2{,}5` · số trong công thức viết liền (`500000`; ngoài công thức viết "500 000 đồng") ·
  `\widehat{ABC}`, `\triangle ABC`, `\parallel`, `\perp`, `^\circ`, `\Rightarrow`, `\in`, `\mathbb{Z}`, `\mathbb{N}` · chữ tiếng Việt trong công thức phải bọc `\text{…}` · đơn vị `\text{m}^2`.
  App không hiển thị chữ nghiêng `*…*` — chỉ dùng `**đậm**` cho các nhãn quy định.
- Trích đáp số cuối bằng một câu kết "Vậy …".

## 5. Tự kiểm trước khi nộp (bắt buộc)

Chạy từ thư mục Repo, sửa tới khi in "✔ đạt cổng":

```
node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k8/de-cuong/NSHM-GKI-2026.p<P>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem
```

## 6. Trả lời cuối

Vài dòng (≤ 120 từ): số câu theo loại (TLN / tự luận) · các câu có `Chưa chắc` (nhãn + một câu lí do) · hình giải đã vẽ · cổng đã đạt chưa. KHÔNG báo "đã thử lại" nếu chưa chạy script.

## 7. Bẫy đã cắn thật

- Bẫy đọc ảnh: số mũ nhỏ, dấu trừ, dấu ngoặc, $2x\left(x-\dfrac{5}{2}\right)$, $\dfrac{4}{5}x(5x-1)$ — không chắc ⇒ phóng to, đừng đoán.
- Lời giải Hình ngầm dùng đường trung bình mà không gọi tên — vẫn là kiến thức cấm. Phải tự chứng minh.
- Đề cương có thể in lỗi: nhiều bài Tìm $x$ cho nghiệm đẹp, một vài bài cho nghiệm vô tỉ — nghiệm vô tỉ KHÔNG tự nó là lỗi (chỉ nghi lỗi khi các ý anh em đều nghiệm đẹp mà ý này không).
- Bài nhiều ý Đại (Bài 1–4): ý b) dùng biểu thức đã rút gọn ở ý a); ý c) Tìm số nguyên $x,\ y$ phải xét ĐỦ mọi cặp (đưa về tích bằng một số nguyên rồi liệt kê ước) và thử lại.
- Bài thực tế "nhiều nhất / ít nhất": nêu rõ điều kiện (số tự nhiên, "đủ cả hai loại" ⇒ mỗi loại ≥ 1) và kiểm lại từng khả năng biên bằng máy.
- Bài số chính phương: ghi rõ số chính phương gồm cả $0$; kiểm kết quả bằng vét cạn BigInt; bất kì bước "kẹp giữa hai bình phương liên tiếp" phải kiểm đủ khoảng giá trị của biến.
  Nếu một bài KHÔNG có lời giải đầy đủ trong phạm vi kiến thức (vd bài chỉ vét cạn được nghiệm nhưng không chứng minh được hết) ⇒ KHÔNG bịa chứng minh: nêu phần đã chứng minh được,
  nghiệm tìm được kèm cách kiểm, và ghi `**Chưa chắc:**` nói rõ chỗ hở.

### ⭐ LUẬT TRÌNH BÀY HÌNH 7·8·9 (CEO 27/10) — áp cho MỌI lời giải bài Hình, cả Học lẫn Luyện lẫn Kho đề thi

1. **Dòng ngắn — một dòng chỉ viết khoảng 50% bề ngang.** Bài Hình dày đặc ký hiệu nên dòng dài rất khó nhìn. Mỗi dòng một điều kiện / một mệnh đề / một lý do; khẳng định dài (nhiều điều nối bằng "và", "mà", dấu phẩy) phải **tách thành nhiều dòng**. Mốc tay: ≲ 60 ký tự hiển thị mỗi dòng (công thức tính theo chữ nó hiện ra). Khối "Xét … có:" vẫn mỗi điều kiện một dòng.
2. **Giãn dòng cho thoáng mắt = tăng khoảng cách dòng thêm 20% so với hiện tại — KHÔNG bằng dòng trống (cách một dòng trống là quá xa, CEO 27/10).** Đây là việc HIỂN THỊ (line-height khối lời giải bài Hình, làm ở app một chỗ), không phải việc của người soạn. Trong DỮ LIỆU giữ nguyên luật R2 cũ: các dòng nối bằng `\n` đơn, **không thêm dòng trống** giữa các bước; dòng trống chỉ trước ý b) c) d) và trước `**Phần 2. Trình bày**`.
3. **Mọi kiến thức dùng phải có chú thích trong ngoặc** ngay sau mệnh đề:
   - Dữ kiện đề cho → **(gt)** (giả thiết). Vd: `$AB=AC$ (gt)`.
   - Dùng định lý / tính chất / dấu hiệu → ghi **đúng tên** (theo whitelist của khối). Vd: `(định lý trung tuyến ứng với cạnh huyền)`, `(tính chất hai đường chéo hình chữ nhật)`, `(dấu hiệu nhận biết hình bình hành)`, `(trường hợp c.g.c)`.
   - Kết quả đã chứng minh ở bước trên (cùng ý hay ý trước) → **(cmt)** (chứng minh trên). Vd: `$AKCI$ là hình bình hành (cmt)`.
   - Thiếu chú thích = lời giải CHƯA đạt; trạm soát phải bắt. Không dùng lý do nào ngoài whitelist.

*Ví dụ đúng (các dòng liền nhau, không dòng trống):*
```
Vì $AB=AC$ (gt)
nên $\triangle ABC$ cân tại $A$ (định nghĩa tam giác cân).
Do đó $\widehat{B}=\widehat{C}$ (tính chất tam giác cân).
Xét $\triangle ABM$ và $\triangle ACM$ có:
$AB=AC$ (gt);
$\widehat{B}=\widehat{C}$ (cmt);
$BM=CM$ (gt)
nên $\triangle ABM=\triangle ACM$ (c.g.c).
```

