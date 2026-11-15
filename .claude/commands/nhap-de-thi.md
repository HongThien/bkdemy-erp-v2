---
description: Nhập 1 đề thi / đề cương TOÁN vào ERP — bóc câu, giải theo spec-giai-bai.md, ghi câu vào kho + lưu cấu trúc đề
argument-hint: <khối>
---

# /nhap-de-thi — Nhập đề thi vào ERP

`$ARGUMENTS` = khối.

**LUẬT: `spec-giai-bai.md` — đọc Phần A + mục khối $ARGUMENTS ở Phần B + Phần C TRƯỚC khi làm.** File này chỉ là THAO TÁC MÁY;
mọi luật phân dạng / giải / trình bày / kiểm / điều kiện vào kho nằm ở spec, không nằm ở đây. Lệch nhau ⇒ spec đúng.
Nhiều đề cùng loại (bộ đề toanmath…) ⇒ chạy theo batch, sổ `kho-rules/dai/lo/toanmath/TINH-TRANG.md` (spec §C8).

Kết quả: câu trong kho (`dai_cau_hoi` / `hgt_cau_hoi` / `hinh_hoc_cau_hoi`) **và** đề ở `tai_lieu(loai='de_thi')` + `tai_lieu_phan` + `tai_lieu_cau`
⇒ hiện ở Học thuật › Kho đề thi. Cấu trúc đề: `spec-de-thi.md`.

## Thư mục

Thả đề: `E:\BK ACADEMY\Tài liệu Claude nhập kho\DE_THI\L$ARGUMENTS\` (hoặc đường dẫn người giao). Làm việc: `<KHO_LAM_VIEC>/de-thi/<TEN_NGAN>/`
(mặc định `C:\Users\<user>\bk-kho-lam-viec\de-thi\…`). Chép `goc.docx` (nếu có) và `goc.pdf` (nếu có). Có Word ⇒ Word là nguồn chữ, PDF là bản đối chiếu.

## Bước 1 — Bóc (máy)

```bash
node scripts/kho/de-thi/boc-word.mjs "<work>/goc.docx" --ra "<work>" --khoi $ARGUMENTS
node scripts/kho/de-thi/boc-pdf.mjs "<file.pdf>" --ra "<work>" --khoi $ARGUMENTS      # chỉ có PDF (Gemini gõ, ~3–5 phút/đề)
```

Ra `<work>/de.json` + `img/` (+ `trang/`, `trang-dd/` với PDF) và danh sách cảnh báo. Đề PDF: Claude **phải mở từng ảnh trang** so từng câu với `de.json`
(chữ, công thức, đủ phương án / đủ ý, không sót thừa câu), xem từng hình trong `img/` (sai khung ⇒ sửa `box` trong `gemini-trang.json` rồi `--dung-lai`, không gọi lại Gemini),
xử lý hết dòng `⚠`. Mọi sửa ghi vào `<work>/quyet.mjs` (mỗi sửa một dòng lý do) để chạy lại được: bóc → `quyet`.
Giới hạn: PDF > 18 MB hoặc câu trả lời bị cắt ⇒ tách file.

## Bước 2 — Phân dạng + giải + kiểm (theo spec Phần C)

Dựng tệp soạn `<MA>.soan.md` theo khuôn spec (Sonnet soạn, Opus kiểm), chạy cổng:

```bash
node scripts/kho/de-thi/dung-de-tu-soan.mjs <MA>.soan.md --lam-viec "<work>" --khoi $ARGUMENTS --chi-kiem
```

tới khi "✔ đạt cổng"; bỏ `--chi-kiem` để dựng `de.json`. Hình vẽ xong ⇒ đẩy lên kho ngay (`anh-batch.mjs day` với batch toanmath).

## Bước 3 — Chạy thử rồi ghi

```bash
node --env-file=.env scripts/kho/de-thi/ghi.mjs "<work>"          # transaction ROLLBACK + in bảng 1 dòng/câu
node --env-file=.env scripts/kho/de-thi/ghi.mjs "<work>" --ghi    # ghi thật
```

Kiểm bảng chạy thử: số câu theo khuôn, tổng điểm, câu trùng trỏ về câu cũ hợp lý. Ghi = 1 transaction: câu → kho · đề + phần + câu · `nhap_kho_log`
(sha256 ⇒ chạy lại báo "đã có") · ảnh → `kho-anh`, PDF gốc → `kho-tailieu`. **Không chạy hai lượt `--ghi` song song.**

## Bước 4 — Kiểm trên ERP rồi báo

Mở Kho đề thi, tìm tên đề: đủ câu, công thức render, hình hiện. Báo: tên đề · số câu theo kho · số câu vào kho / vào hàng duyệt trưởng khối · `tai_lieu.id`.

## Khuôn `de.json` (khi phải tự dựng)

```
{ file, sha256, ten, khoi, mon:"Toán", nguon, nam, thoi_gian_phut, thang_diem:10,
  phan: [{ thu_tu, ten, dang_thuc:"trac_nghiem"|"dung_sai"|"tra_loi_ngan"|"tu_luan", diem_moi_cau }],
  cau:  [{ phan, so, loai_cau, noi_dung, lua_chon:[4 chuỗi]|null, dap_an, dap_an_nguon,
           menh_de:[{chu, noi_dung, dap_an:"D"|"S", loi_giai}]|null, loi_giai,
           anh:[…], anh_giai:[…], kho:"dai"|"hgt"|"hinh_hoc", canh_bao:[…],
           dang_bai:"NDB…"|null, dang_bai_chac:"cao"|"vua", dang_bai_ly_do, dang_bai_chot?,   // câu thường (bản đồ mới)
           chu_de:"NCD…"|null }] }                                                           // câu Đúng/Sai
```

Khối chạy bản đồ mới: `select public._bdm_ds_khoi_chay()`. Không điền mã dạng cũ `dang` (lỡ điền ⇒ `ghi.mjs` đổi sang dạng chờ + cảnh báo).
Sửa chuỗi có LaTeX bằng Write/Edit, không heredoc / `node -e`.
