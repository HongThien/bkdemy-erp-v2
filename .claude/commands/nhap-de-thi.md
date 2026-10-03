---
description: Nhập 1 đề thi TOÁN khuôn Bộ 3 phần vào ERP — bóc câu vào kho + lưu cấu trúc đề (đường A), chờ duyệt ở màn Duyệt đề
argument-hint: <10|11|12>
---

# /nhap-de-thi — Nhập đề thi vào ERP (v2, 01/10/2026)

`$ARGUMENTS` = khối `10` | `11` | `12`. Spec: `spec-de-thi.md` §10 (ĐỌC TRƯỚC). Phân vai: **Claude xử lý, người duyệt trên ERP.**

> v1 của lệnh này ghi vào `toan_de_thi` (đường B, ĐÃ NGỪNG — đề nhập kiểu đó không hiện trên ERP). `scripts/nhap_de_thi.mjs` là của v1, **không dùng nữa**.

Kết quả của lệnh: câu nằm trong kho (`dai_cau_hoi` / `hgt_cau_hoi`, `da_duyet=false`, `nguon='de_thi'`) **và** đề nằm ở
`tai_lieu(loai='de_thi')` + `tai_lieu_phan` + `tai_lieu_cau` ⇒ hiện ngay ở Nhập kho › 📝 Đề thi › tab Chờ duyệt (mở đề = sửa + duyệt một màn).

## Nguyên tắc bất di

1. **1 file = 1 đề.** Bản đầu chỉ đề **khuôn Bộ 3 phần** (TN + Đúng/Sai + Trả lời ngắn). Đề khác ⇒ dừng, báo.
2. **Không tự giải.** Đáp án lấy từ file: gạch chân / "Chọn X" / "a) Đúng." / dòng "Đáp án:" / dòng KẾT LUẬN của lời giải. File không có ⇒ để trống.
3. **Hai nguồn đáp án lệch nhau ⇒ không tự chọn im lặng**: ghi cảnh báo vào câu (người duyệt thấy), nêu bằng chứng nếu soi được.
   (Đo 28/09 + 01/10: gạch chân đúng, "Chọn X" của tác giả hay sai.)
4. **Dạng: chắc thì gán, không chắc thì để trống** (⇒ dạng chờ). Đề VẪN vào — đề luôn dùng được, chỉ cảnh báo (K6).
5. **Trùng câu đã có trong kho ⇒ trỏ về câu cũ** (script tự làm), không đẻ bản sao.
6. **Chạy thử trước, ghi sau.** `ghi.mjs` không có `--ghi` = ghi trong transaction rồi ROLLBACK + in tóm tắt.
7. Sửa chuỗi có LaTeX (`\left`, `\right`…) bằng **Write/Edit tool**, KHÔNG heredoc/`node -e` (shell nuốt dấu `\` ⇒ `$left( P ight)$`).

## Flow

Thư mục thả đề: `E:\BK ACADEMY\Tài liệu Claude nhập kho\DE_THI\L$ARGUMENTS\` (hoặc CEO đưa đường dẫn). Thư mục làm việc:
`<KHO_LAM_VIEC>/de-thi/<TEN_NGAN>/` (mặc định `C:\Users\<user>\bk-kho-lam-viec\de-thi\…`).

### Bước 1 — Chép file về thư mục làm việc

`goc.docx` (nếu có bản Word) và `goc.pdf` (nếu có). **Có Word ⇒ Word là nguồn chữ** (bộ đọc thẳng: công thức MathType chính xác,
đọc được gạch chân); PDF là bản đối chiếu + được đính kèm làm "đề gốc". **Chỉ có PDF ⇒ đi Bước 2-PDF** (Gemini gõ, Claude kiểm).

### Bước 2 — Bóc (máy, 0 AI)

```bash
node scripts/kho/de-thi/boc-word.mjs "<work>/goc.docx" --ra "<work>" --khoi $ARGUMENTS
```

Ra `<work>/de.json` + `<work>/img/` và in tóm tắt: số câu / phần, bao nhiêu câu có đáp án, **danh sách cảnh báo**.
Máy đã: tách phần + câu · tách 4 phương án / 4 mệnh đề · lấy đáp án · ghép phần ĐỀ ↔ phần LỜI GIẢI và so nội dung làm nhân chứng.
Số câu không đúng khuôn (12 + 4 + 6 hoặc theo tiêu đề phần) ⇒ dừng, tìm nguyên nhân trước khi đi tiếp.

### Bước 2-PDF — Đề CHỈ CÓ PDF (spec §10.8): Gemini là máy gõ, Claude là người kiểm

```bash
node scripts/kho/de-thi/boc-pdf.mjs "<file.pdf>" --ra "<work>" --khoi $ARGUMENTS
```

~3–5 phút / đề 15 trang, khoảng 4–5 nghìn đồng tiền Gemini (key `VITE_GEMINI_KEY` trong `.env.local`). Máy làm: ảnh từng trang (`trang/`, và
`trang-dd/` 250 dpi) · lớp chữ PDF (`lop-chu.txt`) · **lượt 1 BÓC** (chép câu) · **lượt 2 MỤC LỤC** (đếm câu + đáp án, độc lập) ·
**lượt 3a** hình + vị trí nhãn câu trên ảnh từng trang (hình thuộc câu nào do máy TÍNH theo vị trí) · **lượt 3b** chữ cái bị gạch chân /
khoanh trên ảnh 250 dpi · so chéo các lượt + so chữ với lớp chữ PDF · cắt hình thẳng từ PDF. Ra `de.json` cùng khuôn bản Word, cảnh báo ghi
vào từng câu, tóm tắt ở `boc-pdf.bao-cao.json`.

**Sau đó Claude PHẢI kiểm bằng mắt — đây là lý do bỏ đường "Gemini trong ERP" (đọc sai là sai luôn):**

1. Mở **từng** `trang/p-NN.png` (Read tool), so **từng câu** với `de.json`: chữ, công thức (dấu âm, mũ, chỉ số, phân số, hệ phương trình),
   đủ 4 phương án / đủ ý a–d, không sót không thừa câu. PDF scan (không lớp chữ) thì đây là nhân chứng DUY NHẤT.
2. **Đáp án** — mỗi câu trắc nghiệm tự nhìn chữ cái bị GẠCH CHÂN / khoanh (ảnh `trang-dd/`), kể cả câu máy không báo gì: lượt 3b bắt sót
   (đo 01/10: thấy 7/12), và cả hai lượt đọc file đều chép "Chọn X" của lời giải. Gạch chân ≠ "Chọn X" ⇒ không tự chọn im lặng: soi được thì
   ghi lý do, không thì để cảnh báo cho người duyệt. File không thể hiện đáp án ⇒ để trống (không tự giải).
3. Mở từng ảnh trong `img/`: đúng hình của câu, không cụt, không dính chữ. Sai ⇒ sửa `box` (hoặc `nhan_cau`) trong `gemini-trang.json` rồi
   chạy lại `boc-pdf.mjs … --dung-lai` (cắt lại, **không** gọi lại Gemini). Hình trong phần lời giải không cắt.
4. Xử lý hết dòng `⚠` máy in ra. Mọi sửa ghi vào `quyet.mjs` như bước 3 (chạy lại được: `boc-pdf --dung-lai` → `quyet`).

Giới hạn đã biết: PDF > 18 MB hoặc câu trả lời bị cắt (đề + lời giải quá dài) ⇒ tách file. Câu đã có trong kho từ nguồn khác (vd bản Word)
thường KHÔNG được nhận là trùng vì LaTeX hai nguồn viết khác nhau (`(S)` ↔ `\left( S \right)`) ⇒ đừng nhập cùng một đề từ cả hai nguồn.

### Bước 3 — Claude xử lý phần cần phán đoán (viết thành `<work>/quyet.mjs`, mỗi sửa 1 dòng lý do)

Viết bằng **Write tool** một script nhỏ sửa `de.json` (mẫu: `bk-kho-lam-viec/de-thi/DE_SO_3/quyet.mjs`). Chạy lại được: `boc-word` → `quyet`.

| Việc | Cách |
|---|---|
| `ten` đề | Đặt tên đủ ngữ cảnh để tìm trong Kho đề thi (nguồn · chương · số đề) |
| Cảnh báo "hình WMF/EMF" | Mẩu công thức lưu dạng ảnh: đọc từ lớp chữ PDF (`pdftotext -layout`) hoặc ảnh trang, thay bằng LaTeX; ghi lại trong `canh_bao` là đã thay |
| TLN chưa có đáp số | Rút từ dòng kết luận của lời giải (`dap_an_nguon='ket_luan_loi_giai'`, ghi trích dẫn vào `canh_bao`). Không có lời giải ⇒ để trống |
| Đáp án 2 nguồn lệch | Giữ cảnh báo; soi được thì ghi lý do chọn |
| `kho` từng câu | `hgt` = mặt phẳng / đường thẳng / mặt cầu / góc / khoảng cách trong Oxyz · `dai` = còn lại (kể cả vectơ + hệ trục toạ độ lớp 12) |
| `dang` từng câu + từng mệnh đề Đ/S | Theo bản đồ khối đó (`<kho>_ban_do`); mệnh đề phải cùng kho với câu cha. Không khớp rõ ⇒ `null` |

Đọc bản đồ: query `select ma_dang, ten_chuyen_de, ten_dang from <kho>_ban_do where khoi='$ARGUMENTS' order by 1` (chỉ đọc).

### Bước 4 — Chạy thử + cho người ngồi cùng xem tóm tắt

```bash
node scripts/kho/de-thi/ghi.mjs "<work>"
```

In bảng 1 dòng/câu: kho · mã câu sẽ cấp · dạng · đáp án · điểm · ghi chú (TRÙNG câu cũ / cảnh báo). Kiểm: tổng điểm = 10 với đề đúng khuôn;
số câu trùng có hợp lý không. **Dừng ở đây cho CEO/học thuật xem khi có điều bất thường.**

### Bước 5 — Ghi thật

```bash
node scripts/kho/de-thi/ghi.mjs "<work>" --ghi
```

1 transaction: câu → kho · đề + phần + câu · `nhap_kho_log` (sha256 ⇒ chạy lại báo "đã có", không nhân đôi). Ảnh → bucket `kho-anh`, PDF gốc → `kho-tailieu`.

### Bước 6 — Kiểm trên ERP rồi báo cáo

Mở Nhập kho › 📝 Đề thi › tab Chờ duyệt › tìm tên đề › mở: đủ câu, công thức render, hình hiện (KHÔNG tự bấm ✅ Duyệt đề — việc của người duyệt). Báo CEO: tên đề · số câu theo kho ·
số câu / mệnh đề còn dạng chờ · các cảnh báo cần người duyệt xem · `tai_lieu.id`.

## Khuôn `de.json` (để tự dựng khi nguồn không phải Word)

```
{ file, sha256, ten, khoi, mon:"Toán", nguon, nam, thoi_gian_phut:90, thang_diem:10,
  phan: [{ thu_tu:1, ten, dang_thuc:"trac_nghiem"|"dung_sai"|"tra_loi_ngan", diem_moi_cau }],
  cau:  [{ phan, so, loai_cau, noi_dung, lua_chon:[4 chuỗi]|null, dap_an, dap_an_nguon,
           menh_de:[{chu, noi_dung, dap_an:"D"|"S", loi_giai, dang}]|null, loi_giai,
           anh:[tên file trong img/], anh_giai:[…], kho:"dai"|"hgt", dang:"T3…"|null, canh_bao:[…] }] }
```

## Chưa có (spec §10.4)

Đã có: lát B (Kho đề thi ở Nhập kho › Đề thi) · lát C (gán đề vào buổi thành Giáo trình / BTVN, kiểm tra, ô trả lời ngắn 4 ô) · lát D (`boc-pdf.mjs`).
Chưa có: đề tự luận / đề không theo khuôn 3 phần · hình trong lời giải của đề PDF · nhận trùng câu giữa nguồn Word và nguồn PDF.
