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
3. **Tự xem lại trước khi gắn:** render ra PNG, đọc bằng Read (gom thành 1 bảng ảnh cho nhanh). Dữ kiện chỉ có trên hình đã ghi vào đề ("biết …") nên đề không phụ thuộc hình.
4. **Gắn:** `node --env-file=.env scripts/anh/gan_hinh.mjs <thu_muc>` (chạy thử, kiểm mã + câu đã có hình chưa) rồi thêm `--ghi`. Upload bucket `kho-anh/hinh_hoc/<YYYY-MM>/<ma_cau>-<uuid>.png` bằng `SUPABASE_SERVICE_ROLE` trong `.env.local` (key không in ra), UPDATE `anh_de` trong 1 transaction; không đè hình có sẵn trừ khi `--thay`. Tiền tố mã → bảng khai ở `BANG` (hiện chỉ `HHC` → `hinh_hoc_cau_hoi`; thêm dòng khi cần).
5. **Đã gắn 07/10:** 12 câu HH00101/HH00102 (1A, 2A, 3A, 3B, 8A, 8B, 9A, 9B, 10A, 10B, 11a, 11b). Câu đề dựng bằng lời không cần hình.

---

## Ghi chú typo trong đề (không phải rule, chỉ log)

- **`HHC000850` câu c)** ghi "$\triangle MNP$ và $\triangle QPN$" nhưng hình không có tam giác $MNP$ (không có đường $MP$). Đọc là "$\triangle MNQ$ và $\triangle QPN$" (giống câu a) — CEO đã confirm 30/09.
- **HH00101/HH00102 (nhập 07/10 từ `C4. Bài 3` Word):**
  - Ảnh công thức WMF mất dấu mũ góc → đã suy từ ngữ cảnh.
  - 7B ý c) ảnh ghi "AC = MP" (sai đỉnh) → đọc là $AC=A'C'$.
  - Dữ kiện chỉ có trên hình (gạch bằng nhau, cung đánh dấu góc) đã ghi thẳng vào đề ("biết …") cho 2A, 3A, 3B, 8A, 9A, 9B vì ảnh chưa gắn vào DB. Ký hiệu đánh dấu góc bằng nhau trên hình là **góc**, không phải "cung" (cung lớp 9).
