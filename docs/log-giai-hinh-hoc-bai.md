# Log rule Claude giải bài Hình Học (bảng `hinh_hoc_cau_hoi`)

> File này ghi lại rule học được từ feedback Thùy khi Claude giải các câu trong `hinh_hoc_bai` (phần HỌC — khác `hinh_baitoan` là phần LUYỆN).
>
> **Claude (và mọi subagent được giao soạn đề/lời giải) PHẢI đọc file này trước khi viết bất kỳ câu nào vào `hinh_hoc_cau_hoi`.**

---

## R1 — Sau dấu chấm là XUỐNG DÒNG, không viết tiếp cùng dòng

**Rule (CEO chốt 30/09 sau HHC000846):** Kết thúc 1 câu bằng dấu chấm `.` ⇒ xuống dòng. Không ghép 2 câu vào cùng 1 dòng dù ngắn.

**Why:** Đọc rõ từng bước, dễ theo dõi trên UI/PDF; học sinh không lướt mất bước.

**How to apply:**
- "Xuống dòng" = MỘT ký tự `\n`. KHÔNG phải dòng trống (xem R2).
- Dấu chấm phẩy `;` không bắt buộc xuống dòng, nhưng mỗi điều kiện khi "Xét hai tam giác" nằm 1 dòng riêng cho dễ đọc.
- "Do đó / Suy ra / Vậy" đứng RIÊNG ở dòng của nó, không dính vào câu trước.

---

## R2 — KHÔNG chèn dòng trống thừa (CEO chốt 07/10)

**Rule:** Chỉ dùng một `\n` giữa các dòng. Dòng trống (`\n\n`) CHỈ được phép ở MỘT chỗ: giữa các ý a), b), c)… của **lời giải**.

**Why:** 30/09 Claude hiểu sai R1 thành "mỗi câu cách một dòng trống" → đề và lời giải loãng, mỗi dòng cách nhau một khoảng trắng, Thùy chê "dòng trống vô duyên" (07/10) và bắt sửa 34 câu. Mẫu người soạn (HHC000841, HHC000848…) chưa bao giờ có dòng trống trong cùng một ý.

**How to apply:**
- **Đề (`noi_dung`)**: KHÔNG có dòng trống nào. Câu dẫn, ý a), b), c)… mỗi thứ một dòng, nối nhau bằng `\n` đơn.
- **Lời giải (`loi_giai`)**: trong cùng một ý các dòng nối bằng `\n` đơn; cách đúng một dòng trống `\n\n` trước ý b), c), d)… Không bao giờ có hai dòng trống liền nhau, không có dòng trống giữa "Xét…", các điều kiện, "Do đó…".
- Trước khi ghi DB: chạy kiểm tra — đề không chứa `\n\n`; lời giải chỉ chứa `\n\n` ngay trước chuỗi dạng `b) `, `c) `…

**Ví dụ ĐÚNG (lời giải):**
```
a) Xét $\triangle ABH$ và $\triangle ACH$ có:
$AB=AC$ (giả thiết);
$\widehat{BAH}=\widehat{CAH}$ (giả thiết);
$AH$ chung.
Do đó $\triangle ABH=\triangle ACH$ (c.g.c).

b) Vì $\triangle ABH=\triangle ACH$ (câu a) nên ...
```

**Ví dụ SAI:** mỗi dòng ở trên cách nhau một dòng trống.

**Ca đã sửa:** 34 câu Claude đã ghi (HH00099: 7 câu · HH00101 + HH00102: 27 câu) — đã bỏ dòng trống thừa 07/10, đối chiếu nội dung không đổi chữ nào.

---

## Luồng HÌNH ĐỀ — vẽ bằng code + gắn vào câu (CEO chốt 07/10)

Ảnh hình trong file Word thường mờ/xấu và công thức WMF mất dấu mũ → **vẽ lại hình bằng code** (SVG → PNG 2x), không dùng ảnh AI (nhãn điểm/gạch bằng nhau hay sai). Thùy đã xem và duyệt chất lượng.

1. **Vẽ:** `scripts/anh/ve_hinh_lib.mjs` (đoạn, gạch bằng nhau `tick`, cung góc `angleMark`, nhãn, Chrome headless) + file định nghĩa hình, mẫu `scripts/anh/ve_hinh_hh101_102.mjs <thu_muc_ra>`. Tên file ra = mã câu (`HHC001914_2A.png`); nhiều câu dùng chung 1 hình nối bằng `+` (`HHC001924+HHC001935_11.png`).
2. **Hình PHẢI khớp dữ kiện đề, dựng đúng chứ không ước mắt:** hình bình hành `D→C = A→B`; đề cho `AB ∥ MN` + `AO = ON` thì hình đối xứng qua O (theo g.c.g); đề cho phân giác thì H chia BC theo tỉ lệ AB/AC; KHÔNG vẽ sẵn dữ kiện là ĐÁP ÁN (câu "cần bổ sung điều kiện gì" thì không đánh dấu `AB = AC`). Hai góc kề nhau đánh dấu bằng 2 cung **bán kính khác nhau** (cùng bán kính sẽ nối liền thành 1 cung). Ký hiệu đánh dấu góc bằng nhau là **góc**, không gọi "cung" (lớp 9).
   - **Tam giác vuông tại A ⇒ cạnh AC NẰM NGANG, cạnh AB THẲNG ĐỨNG (CEO chốt 23/10):** A ở góc dưới bên trái, B ở trên A, C bên phải A, cạnh huyền BC xiên. Áp cho MỌI hình có tam giác ABC vuông tại A (hình đề, hình mô hình/giả thiết, hình lời giải) — luật này THẮNG "giữ hướng như ảnh cũ".
3. **Tự xem lại trước khi gắn:** render ra PNG, đọc bằng Read (gom thành 1 bảng ảnh cho nhanh). Dữ kiện chỉ có trên hình đã ghi vào đề ("biết …") nên đề không phụ thuộc hình.
4. **Gắn:** `node --env-file=.env scripts/anh/gan_hinh.mjs <thu_muc>` (chạy thử, kiểm mã + câu đã có hình chưa) rồi thêm `--ghi`. Upload bucket `kho-anh/hinh_hoc/<YYYY-MM>/<ma_cau>-<uuid>.png` bằng `SUPABASE_SERVICE_ROLE` trong `.env.local` (key không in ra), UPDATE **`anh_de` VÀ `anh_dap_an`** (cùng 1 hình, hiện ở đề và ở lời giải — app HS đọc `anh_dap_an` ở phần lời giải) trong 1 transaction; không đè hình có sẵn trừ khi `--thay`. Tiền tố mã → bảng khai ở `BANG` (hiện chỉ `HHC` → `hinh_hoc_cau_hoi`; thêm dòng khi cần).
5. **MỌI câu có thể vẽ hình thì phải có hình, kể cả câu đề dựng bằng lời** (Thùy 07/10: "nhiều câu đề cần hình") — Word chỉ có hình ở vài câu, còn lại phải dựng từ giả thiết. Chỉ bỏ khi đề thật sự không có gì để vẽ.
6. **Đã gắn 07/10:** cả 27 câu HH00101/HH00102 (26 hình; 1B+7B và 11a+11b dùng chung hình). Hình cũ của 1A (đáy sát mép) còn mồ côi trong bucket `kho-anh/hinh_hoc/2026-10/HHC001912-e7d9…`, chưa xoá.
7. **Cỡ canvas:** app HS giới hạn hình `max-h-72` (288px) nên hình cao thì chữ bị thu nhỏ — giữ canvas ≲ 450px cao; chừa ≥ 35px dưới nhãn đáy (nhãn baseline sát mép sẽ cụt chân chữ).

---

## Luồng VẼ LẠI hình đã có trong kho (CEO giao 13/10)

Thùy 13/10: *"Rất nhiều bài Hình trong kho là hình cắt từ sách ra. Đọc đề và vẽ lại toàn bộ các hình đó."* — mọi ảnh không nằm ở `kho-anh/hinh_hoc/` đều thay bằng hình vẽ bằng code.

1. `node scripts/anh/ve_lai_xuat.mjs --khoi <k>` (hoặc `--bai HH00023,…`) → gói việc ở `C:\Users\WBPC\bk-kho-lam-viec\ve-lai-hinh\<bài>-<n>\`: `viec.md` (đề, lời giải, **tên tệp ra**) + `cu/` (ảnh cũ).
2. Trạm vẽ (subagent Sonnet) theo `docs/mau-brief-ve-lai-hinh.md` → `scripts/anh/ve_lai/<gói>.mjs` (dựng điểm bằng `mid/foot/inter/rot/bisector…`, `hinh()` + `xuatTat()`), PNG ra `<gói>/moi/`.
3. `node scripts/anh/ve_lai_bang.mjs <gói>` → `bang-N.png` (trái = cũ, phải = mới). **Người soát mở từng bảng**, không tin báo cáo của trạm; lỗi hay gặp: khung quá rộng làm chữ bé, hình con xếp sát nhau làm nhãn chạm nhau, số đo đặt xa đỉnh.
4. `node --env-file=.env scripts/anh/gan_hinh.mjs <gói>/moi --thay --ghi` — tên tệp không đuôi = gắn cả đề lẫn lời giải, `_de` = chỉ đề, `_lg` = chỉ lời giải. URL cũ ghi vào `scripts/anh/bien_ban/gan-hinh-<lúc>.json` trước khi UPDATE; ảnh cũ không bị xoá.
5. Luật phân xử: hình theo **ĐỀ**; ảnh cũ vênh đề thì theo đề và ghi lại; không phân xử được thì KHÔNG vẽ (giữ ảnh cũ, báo CEO). Tranh minh hoạ → sơ đồ tối giản; câu hỏi cần chính bức ảnh (vd "mặt bàn này hình gì") thì giữ ảnh.

6. **Phần LUYỆN** (`hinh_baitoan.anh_chuan`, `hinh_baitoan_bien_the.anh` / `anh_loi_giai`): `ve_lai_xuat.mjs --bang baitoan|bienthe` (gói gom theo MÔ HÌNH: `BT-MH045-1`, `BV-MH045-1`; đề đầy đủ ghép như app: giả thiết bài cha / mô hình + giả thiết riêng + câu hỏi; biến thể mỗi dòng một hình, tên tệp = uuid) → trạm theo brief mục 3b → `gan_hinh.mjs <gói>/moi --bang baitoan|bienthe --thay --ghi` (bảng, cột khoá, cột ảnh khai trong `LUYEN`; đuôi `_lg` của biến thể = `anh_loi_giai`).
7. **Luật soát chốt 13/10 (sau khi lượt trạm đầu mỗi trạm xử một kiểu):** ẢNH CŨ CÓ GÌ GIỮ NẤY — kể cả đường phụ của lời giải, điểm của bài sau trong chuỗi, nét đứt/cung của điều phải chứng minh — chỉ dựng lại cho đúng đề. Chỉ THÊM khi đề của chính bài nêu tên mà ảnh thiếu, và ô vuông góc cho góc vuông đề cho. Tên điểm/số đo vênh ⇒ theo đề. Ảnh cũ chỉ có cung thì không tô. Khi soát bằng lệnh, đừng nối `| head` sau tệp vẽ (script chết giữa chừng vì EPIPE, chỉ vài hình đầu được dựng lại).

Đã chạy 13/10: khối 7, 8, 8T, 9 của phần Học (330 câu, 295 hình) · phần Luyện (127 hình bài toán + 82 hình biến thể, 0 hình giữ ảnh cũ). Cũng 13/10: `hinh_mo_hinh.anh_cau_hinh` (33) + `hinh_cach_giai.anh_loi_giai` (6) — 39 hình, 0 giữ ảnh cũ (`ve_lai_xuat.mjs --bang mohinh|cachgiai`, `gan_hinh.mjs --bang mohinh|cachgiai`, gói `MH-1…5` / `CG-1`, brief mục 3c). Chưa chạy: khối 11, `hgt_cau_hoi`.

---

## Ghi chú typo trong đề (không phải rule, chỉ log)

- **`HHC000850` câu c)** ghi "$\triangle MNP$ và $\triangle QPN$" nhưng hình không có tam giác $MNP$ (không có đường $MP$). Đọc là "$\triangle MNQ$ và $\triangle QPN$" (giống câu a) — CEO đã confirm 30/09.
- **HH00101/HH00102 (nhập 07/10 từ `C4. Bài 3` Word):**
  - Ảnh công thức WMF mất dấu mũ góc → đã suy từ ngữ cảnh.
  - 7B ý c) ảnh ghi "AC = MP" (sai đỉnh) → đọc là $AC=A'C'$.
  - Dữ kiện chỉ có trên hình (gạch bằng nhau, cung đánh dấu góc) đã ghi thẳng vào đề ("biết …") cho 2A, 3A, 3B, 8A, 9A, 9B vì ảnh chưa gắn vào DB. Ký hiệu đánh dấu góc bằng nhau trên hình là **góc**, không phải "cung" (cung lớp 9).
