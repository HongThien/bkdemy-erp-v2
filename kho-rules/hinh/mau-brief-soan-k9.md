# BRIEF giao subagent soạn câu — Hình 9 · Đường tròn (phần HỌC, luồng kho kiểu 1)

> Dùng cho 6 bài HH00105–HH00110 (09/10/2026). Người giao việc thay `<BAI>` (mã bài), `<NHOM>` (tên nhóm) và danh sách số thứ tự `[i]`
> ở cuối lời giao. Phần còn lại giữ nguyên. Quy trình chung: `docs/luong-kho-kieu-1-hinh-hoc.md`; luật khối: `kho-rules/hinh/k9.md`.

Mày là một người soạn. Với CÁC BÀI TOÁN ĐƯỢC GIAO: (1) soạn ĐỀ hoàn chỉnh, (2) soạn LỜI GIẢI CHI TIẾT 2 phần chuẩn lớp 9, (3) làm HÌNH,
(4) VERIFY bằng toạ độ. KHÔNG ghi DB, KHÔNG sửa file trong repo — chỉ ghi nháp + ảnh vào thư mục scratchpad của mày. Một khẳng định sai
trong lời giải là lỗi nặng; không chắc ⇒ ghi vào mục nghi vấn, KHÔNG bịa. Câu không giải được trong whitelist ⇒ vẫn soạn đề, ghi rõ nghi vấn.

`K` = `C:\Users\WBPC\AppData\Local\Temp\claude\C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2\0b0aaccd-e68b-45b5-96e4-b914b4d1311c\scratchpad\k9b`
Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`

## 1. Nguồn
- Danh sách bài toán của bài: `K\nguon\<BAI>.md` — mỗi mục `## [i] <mã nguồn>` + dòng "Nguồn:" (trang PDF / ảnh) + văn bản đã trích. Mày làm các `[i]` được giao.
- **Văn bản trích từ PDF mất ký hiệu** (dấu mũ góc `\widehat`, cung `⌢`, căn, phân số nhiều tầng, ∽, phương án trắc nghiệm bị vỡ dòng). LUÔN mở
  ảnh trang để đọc đúng đề: `K\trang\ndt-NN.png` (Ngô Đức Tài, NN = số trang ghi ở "Nguồn"), `K\trang\phl-NN.png` (Phạm Hoàng Long — tìm "Câu n"),
  câu `NT …` (Nguyễn Trãi): văn bản đã có LaTeX đúng; ảnh trong đề ở `K\nt-media\word\media\<tên>`; chỗ `[[EQ-FAILED…]]` hoặc `[[img:imageNNNN.wmf]]`
  ⇒ đọc `E:\BK ACADEMY\Tài liệu tham khảo\K9\Đường tròn\DT2.pdf` bằng Read (tham số pages, trang 1–8 = CĐ7, 9–13 = CĐ8, 14–24 = CĐ9–10).
- Sách KHÔNG có lời giải (chỉ chừa trống "Lời giải") ⇒ mày tự giải toàn bộ. Trắc nghiệm KHÔNG có đáp án ⇒ tự tính; nếu không phương án nào
  đúng ⇒ ghi nghi vấn (đừng chọn bừa), đề xuất sửa phương án.
- Mã nguồn ghi trong mục nghi vấn của từng câu: `Nguồn: NDT B2 TL14` (để truy lại).

## 2. Luật BẮT BUỘC — đọc trước khi viết
1. `Repo\docs\log-giai-hinh-hoc-bai.md` — R1 (sau dấu chấm xuống dòng) · R2 (KHÔNG dòng trống thừa) · luồng hình đề.
2. `Repo\kho-rules\dai\k8.md` mục **§1.6** — khuôn **2 phần cho Hình** (CEO chốt 09/10): ý **Tính** ⇒ Phần 1 viết lời; ý **Chứng minh** ⇒
   Phần 1 là **sơ đồ phân tích đi lên** (`$\Uparrow$`, lý do trong ngoặc thường, giả thiết đánh ✓), Phần 2 trình bày NGƯỢC đúng sơ đồ.
3. `Repo\kho-rules\hinh\k9.md` mục **§1** — ranh giới kiến thức chương trình 2018 (CẤM góc tạo bởi tiếp tuyến và dây, góc đỉnh trong/ngoài,
   DẤU HIỆU tứ giác nội tiếp, phương tích / hệ thức lượng dùng thẳng, công thức khoảng cách toạ độ, sin/cos góc tù…) + mục §2 (cách giải từng dạng).
4. `Repo\spec-giai-bai-ai.md` §1 — ý sau dùng lại kết quả ý trước, không chứng minh lại.

### WHITELIST = lý thuyết của CHÍNH BÀI + các bài TRƯỚC (luật kiến thức theo thứ tự bài)
Thứ tự: **HH00105 Đường tròn** (định nghĩa, vị trí điểm, đối xứng, dây – đường kính là dây lớn nhất, góc ở tâm, cung, số đo cung) →
**HH00106 Độ dài cung** → **HH00107 Diện tích quạt, viên phân, vành khuyên** → **HH00108 Vị trí đường thẳng – đường tròn, tiếp tuyến**
(tính chất + dấu hiệu) → **HH00109 Hai tiếp tuyến cắt nhau** → **HH00110 Vị trí hai đường tròn**.
Lý thuyết đầy đủ từng bài: `K\ly-thuyet.mjs` (đối tượng `LT`). Luôn được dùng: kiến thức lớp 6–8 (tam giác bằng nhau, cân, đều, trung trực,
Pythagore, đường trung bình, tứ giác đặc biệt, tam giác đồng dạng, trung tuyến ứng với cạnh huyền) + chương IV lớp 9 (tỉ số lượng giác
góc nhọn, giải tam giác vuông). CHƯA học (cấm ở cả 6 bài): góc nội tiếp, tứ giác nội tiếp, đa giác đều, hình không gian.
Ví dụ: bài HH00105 không được dùng tiếp tuyến; "điểm trên đường tròn đường kính $BC$ ⇒ góc vuông" phải chứng minh qua trung tuyến bằng nửa
cạnh (không có "góc nội tiếp chắn nửa đường tròn"). Bài toán đòi kiến thức của bài SAU ⇒ ghi nghi vấn "nên chuyển sang bài …".

## 3. Định dạng (R1 + R2 + 2 phần)

> **⭐ Phần 1 nhiều bước ⇒ mỗi bước một CARD, mũi tên sang card kế (CEO 09/10, `kho-rules/README.md` §3):** mỗi bước là một đoạn riêng mở bằng `**Bước k.**`; `**Mấu chốt:**` đứng trước chuỗi bước, `**Chú ý:**` đứng sau; **mọi bài 3–6 bước**, mỗi bước một ý trọn vẹn (CEO 09/10 tối). **Tách ý** chỉ cho bài *Tính* và *Tìm $x$*; bài lời văn giữ chung một câu. *Hình:* chuỗi bước của Phần 1 (kể cả từng mắt xích của sơ đồ phân tích đi lên, k8 §1.6) viết thành các đoạn `**Bước k.**` — hiểu của Claude, chờ CEO xác nhận.
- `noi_dung` (đề): KHÔNG dòng trống. Câu dẫn, ý a), b)… mỗi thứ một dòng. Đề **tự đủ dữ kiện không cần nhìn hình**: số đo, điểm nằm giữa,
  cung nhỏ/lớn… chỉ có trên hình ⇒ ghi thẳng vào đề ("biết …"). Giữ nguyên ý đề sách; sửa lỗi gõ rõ ràng (ghi ở nghi vấn).
- `loi_giai`: `**Phần 1. Hướng dẫn**` rồi xuống dòng nội dung; `**Phần 2. Trình bày**` rồi nội dung. Xuống dòng ĐƠN; dòng trống CHỈ trước
  `**Phần 2. Trình bày**` và trước ý b), c)… (công cụ nhập tự chuẩn hoá, nhưng viết đúng ngay).
  - Ý **Tính**: Phần 1 = các dòng `**Mấu chốt:** …` · `**Các bước:** … → …` · (`**Chú ý:** …` nếu có bẫy). Phần 2 = các dòng tính, mỗi dòng kèm lý do.
  - ⭐ **`Các bước` = 3–6 bước, mỗi bước một ý trọn vẹn** (Thùy 09/10: *"các bước ko nên nhỏ quá — 1 bài nên có từ 3–6 bước thôi"*). App hiện MỖI bước thành một card đánh số ⇒ mỗi bước là một câu ngắn có động từ + việc làm + công cụ/lý do, vd `Tính $MO$ bằng định lí Pythagore trong $\triangle OAM$` — KHÔNG viết bước cụt chỉ còn ký hiệu (`$MO$`, `$\widehat{AMO}$`, "đối chiếu"). Bài nhiều ý: mỗi ý một dòng, cũng 3–6 bước.
  - Ý **Chứng minh**: Phần 1 = sơ đồ: dòng trên cùng là điều phải chứng minh, mỗi dòng dưới là điều cần có, giữa hai dòng là một dòng
    `$\Uparrow$ (lý do)`, dòng cuối là giả thiết/điều đã có kèm ✓. Không câu văn. Phần 2 = đi ngược sơ đồ, mỗi mũi tên đúng một bước.
  - Bài nhiều ý: trong mỗi phần, mở từng ý bằng `a)`, `b)`… ; không tách ý thành câu riêng (Hình 100% không tách).
  - Trắc nghiệm: Phần 1 ngắn (mấu chốt), Phần 2 lập luận ngắn nhất rồi dòng cuối `Chọn X.`
  - Bài có cả ý tính lẫn ý chứng minh: trong Phần 1, mỗi ý mở bằng `a)` rồi theo khuôn của loại mình (sơ đồ ⇑ hoặc các dòng **Mấu chốt / Các bước**);
    giữa các ý một dòng trống. Mẫu đã duyệt nội bộ: `K\draft_HH00109_p1.md` (c002 ý a sơ đồ + ý b lời; c005 hai sơ đồ có nhánh ①②).
  - Được thêm vào đề điều kiện chỉ có trên hình (điểm nằm giữa, điểm nằm ngoài, tiếp điểm…) để đề tự đủ — ghi rõ ở nghi vấn "đã thêm …".
- Ghi file có LaTeX bằng **Write tool**, không dùng heredoc bash (heredoc dài bị cắt, `\` bị nuốt).
- LaTeX: `$\triangle ABC$`, `$\widehat{ABC}$`, cung `sđ$\overset{\frown}{AB}$`, `$\backsim$`, `$^\circ$`, `$\perp$`, `$\parallel$`, nhân `$\cdot$`, `\dfrac`,
  thập phân `$3{,}6$`, `$\Rightarrow$`; mỗi công thức một cặp `$…$`; đơn vị `(cm)` sau phép tính, `$\text{cm}^2$` trong công thức. Lý do quen dùng:
  "(bán kính)", "(giả thiết)", "(hai cạnh tương ứng)", "(định lí Pythagore)", "(tính chất hai tiếp tuyến cắt nhau)", "(chứng minh trên)", "(câu a)".
- Mẫu đã đúng nhịp: `Repo\kho-rules\hinh\k9-mau-thu.md` (lô thử — phần 2 ở đó đúng; Phần 1 bài chứng minh PHẢI đổi sang sơ đồ như §1.6 k8).

## 4. Hình
- **Hình gốc tốt thì dùng luôn, xấu thì vẽ lại** (CEO 09/10):
  - Ngô Đức Tài / Phạm Hoàng Long là PDF vector — nét đẹp ⇒ **cắt hình gốc**: đo toạ độ khung trên ảnh trang 100 dpi rồi
    `node K\cat-hinh.mjs <ndt|phl> <trang> <x> <y> <w> <h> <ra.png>` (xuất 300 dpi). Xem lại ảnh cắt: không dính chữ đề, không cụt nhãn,
    không chứa số đo là ĐÁP ÁN. Khung chữ "Hình 5.12" cắt bỏ.
  - Nguyễn Trãi: ảnh trong Word — xem `K\nt-media\word\media\…`; rõ nét, đúng đề ⇒ chép dùng (`.png/.jpg`); mờ / vỡ / `.emf` / `.wmf` / lệch đề ⇒ vẽ lại.
  - Hình gốc sai dữ kiện hoặc lộ đáp án ⇒ vẽ lại.
- **Bài không có hình gốc nhưng vẽ được** (đề dựng bằng lời) ⇒ VẼ bằng code (luật 07/10 "mọi câu có thể vẽ hình thì phải có hình"). Bài thuần
  lý thuyết / thuần số (vd xếp vị trí theo số liệu, công thức) ⇒ không hình.
- Vẽ bằng `Repo\scripts\kho\hinh-toado.mjs` (đọc phần đầu file) — toạ độ TOÁN, dựng đúng giả thiết (giao điểm, tiếp điểm, chân vuông góc
  TÍNH ra), máy tự co khung + đặt nhãn; mẫu đầy đủ 22 hình: `Repo\kho-rules\hinh\lo\k9-lo1.mjs`. Viết một file `K\ve_<BAI>_<NHOM>.mjs`:
  `import { P, mid, kc, tren, chieu, giaoDT, giaoDTvaTron, giaoHaiTron, tiepDiem, goc, kiem, veNhieu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/kho/hinh-toado.mjs'`
  rồi `await veNhieu([{ file: 'K/hinh_<BAI>_<NHOM>/c012', spec }, …])` (ra `c012.png`). Chạy `node` từ thư mục `Repo` (để tìm được puppeteer-core).
  Hình ĐỀ: không vẽ kết luận cần chứng minh, không vẽ đường phụ của lời giải (dùng `phu:true` thì nó KHÔNG hiện — đừng gọi `phu:true` cho hình đề).
- Soát hình: `node Repo\scripts\anh\bang_hinh.mjs K\hinh_<BAI>_<NHOM> K\hinh_<BAI>_<NHOM>\_bang.png` rồi Read `_bang.png`. Sửa nhãn đè nét,
  điểm dính chùm, hình sai dữ kiện, cắt cụt — vẽ lại tới khi sạch.

## 5. Verify (bắt buộc với mọi ý tính / chứng minh)
Dựng toạ độ số đúng giả thiết (dùng chính các hàm của `hinh-toado.mjs`) và kiểm TỪNG khẳng định của lời giải bằng `kiem([...])` (bằng nhau,
vuông góc, song song, thẳng hàng, số đo, đáp số, đáp án trắc nghiệm). Điểm "bất kì" thử ≥2 vị trí. Chỉ chốt khi PASS. Đặt các hàm kiểm trong
cùng file `ve_<BAI>_<NHOM>.mjs` và in kết quả ✓/✗ từng câu.

## 6. Đầu ra
File `K\draft_<BAI>_<NHOM>.md`, mỗi bài toán một khối, ĐÚNG thứ tự `[i]`, nhãn = `c` + số thứ tự 3 chữ số (`[12]` ⇒ `c012`):
```
### c012 → <BAI>
**loai_cau:** trac_nghiem            ← chỉ ghi khi không phải tu_luan (trac_nghiem | tra_loi_ngan)
**lua_chon:** ["$280^\\circ$.", "$100^\\circ$.", "$80^\\circ$.", "$60^\\circ$."]   ← trắc nghiệm: JSON MỘT dòng, 4 phương án, không kèm "A."
**dap_an:** A                         ← trắc nghiệm: chữ cái; trả lời ngắn: kết quả ngắn
**noi_dung:**
<đề>
**loi_giai:**
**Phần 1. Hướng dẫn**
…
**Phần 2. Trình bày**
…
**cấu hình hình / nghi vấn:**
Nguồn: NDT B2 TL14. Hình: cắt gốc ndt-23 | vẽ lại (lý do) | vẽ mới | không hình. Verify: ✓ (n mệnh đề, cấu hình …). Nghi vấn: …
**hinh:** c012.png
```
`loai_cau`: `trac_nghiem` cho câu 4 phương án; `tra_loi_ngan` cho câu chỉ hỏi một kết quả số / kết luận ngắn (ghi `dap_an`); còn lại `tu_luan`
(không ghi dòng `loai_cau`, không ghi `dap_an`). Trong JSON `lua_chon`, dấu `\` của LaTeX phải nhân đôi (`\\circ`). Câu không hình: bỏ dòng `**hinh:**`.
**Câu hỏi "xác định vị trí tương đối / điểm nằm trên–trong–ngoài / số điểm chung"**: hình vẽ đúng tỉ lệ sẽ LỘ đáp án ⇒ hình đó là `hinh_lg`.
**Câu mà hình chính là ĐÁP ÁN** ("vẽ hình và cho biết…", "nêu cách tìm / cách dựng", tia, điểm cần tìm…): ghi `**hinh_lg:** c007.png`
thay cho `**hinh:**` — hình chỉ gắn vào lời giải. Câu vừa cần hình đề vừa cần hình đáp án: ghi cả hai dòng (hai file khác nhau).
Câu "nêu cách" (không phải chứng minh, không phải tính): Phần 1 viết lời (Mấu chốt / Các bước), Phần 2 các bước làm kèm lý do (mẫu: `K\draft_HH00105_p1.md` c005, c008).

Cuối cùng báo lại ≤150 từ: số câu xong · câu còn nghi vấn (nhãn + 1 dòng) · câu đề xuất chuyển bài · số hình cắt gốc / vẽ.
