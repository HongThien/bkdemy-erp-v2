---
description: Quét folder Drive-sync, trích câu từ tài liệu, giải theo spec-giai-bai.md, INSERT vào kho
argument-hint: <co_giai|khong_giai>
---

# /nhap-kho — Nhập kho câu từ folder Drive-sync

`$ARGUMENTS` = `co_giai` (tài liệu có lời giải) hoặc `khong_giai` (chỉ có đề).

**LUẬT: `spec-giai-bai.md` — đọc Phần A + mục khối ở Phần B + Phần C TRƯỚC khi làm.** File này chỉ là THAO TÁC MÁY. Lệch nhau ⇒ spec đúng.
Hai luồng giống nhau ở mọi trạm (phân dạng trước · Sonnet giải · Opus kiểm · điều kiện vào kho §C6); khác duy nhất: `co_giai` thì lời giải in kèm là
nhân chứng (spec §A4 — vẫn tự giải trước). Sách tham khảo: ví dụ → kho trên lớp, bài tập → kho về nhà (spec §A9).
Đề thi / đề cương ⇒ dùng `/nhap-de-thi` (lưu cả cấu trúc đề).

## Bước 1 — `list`

```bash
node scripts/nhap_kho.mjs list --mode $ARGUMENTS
```

JSON `{ mode, root, files:[{ path, name, khoi_folder, size_bytes, sha256, seen_before, prev_log? }] }`.
`seen_before=true` có `prev_log.so_cau_moi > 0` ⇒ bỏ qua. Chỉ có `prev_log.loi` ⇒ chạy lại được.

## Bước 2 — Đọc

- Kho theo nội dung: `dai` (đại số, giải tích, xác suất…) · `hgt` (lượng giác, vectơ, toạ độ) · `hinh_hoc` (hình phẳng THCS, hình không gian) · `khtn`. Không rõ ⇒ `fail` file `error="chua_ro_subject"`, hỏi.
- Word MathType: `scripts/kho/mathtype-thu/doc-docx.mjs` · Word OMML: `scripts/docx-doc.mjs` · PDF: Read tool `pages=…` (≤ 20 trang/lần) hoặc `scripts/kho/de-thi/boc-pdf.mjs`.
- Hình cần để giải: `node scripts/kho_anh.mjs cat --pdf "<file>" --page <N> --bbox x0,y0,x1,y1 --out <png>` → Read PNG kiểm → `node scripts/kho_anh.mjs up --png <png> --ten <tên>` ⇒ `anh_de` (hình lời giải ⇒ `anh_dap_an`).

## Bước 3 — Phân dạng + giải + kiểm theo spec Phần C

Đọc bản đồ của khối ngay đầu lượt (khối chạy bản đồ mới: `select public._bdm_ds_khoi_chay()`):

```sql
select ma_dang, ten_chu_de, ten_chuyen_de, ten_nhom, ten_dang from bdm_ban_do
where khoi='<khối>' and nhanh_bdm='toan' order by thu_tu_chu_de, thu_tu_chuyen_de, thu_tu_nhom, thu_tu_dang;   -- 'hgt' cho kho HGT
```

## Bước 4 — JSON câu

```json
{
  "khoi": "8", "loai_cau": "trac_nghiem",
  "noi_dung": "…", "lua_chon": ["$A. …$.", "$B. …$.", "$C. …$.", "$D. …$."], "dap_an": "A",
  "loi_giai": "…", "anh_de": null, "anh_dap_an": null,
  "dang_bai": "NDB…", "dang_bai_chac": "cao", "dang_bai_ly_do": "…",
  "ten_de_goc": "…", "nguon": "…", "nguon_giai": "ai", "giai_method": "claude_code", "ai_model": "claude-sonnet-5-5"
}
```

- Không truyền `ma_cau` (script cấp) và không truyền mã dạng cũ `dang_chinh` với khối bản đồ mới. Không chắc dạng ⇒ bỏ `dang_bai` (câu vào dạng chờ của khối).
- `dap_an` trắc nghiệm: `A`–`D`, không bọc `$`. Trả lời ngắn là biểu thức ⇒ bọc `$…$`.
- Câu Đúng/Sai: không `dap_an`, `lua_chon`; có `menh_de: [{noi_dung, dap_an:"D"|"S", loi_giai}]` + `chu_de: "NCD…"`; mệnh đề không mang dạng.
- Câu có cờ chưa chắc: thêm `"kiem_may_nghi": "<lý do>"` ⇒ vào hàng duyệt trưởng khối.
- Ghi JSON ra scratchpad `nhap_kho_<sha8>.json` bằng Write tool.

## Bước 5 — `insert` (chạy thử trước)

```bash
node scripts/nhap_kho.mjs insert --subject <dai|hgt|khtn> --json <f> --thu     # ROLLBACK
node scripts/nhap_kho.mjs insert --subject <dai|hgt|khtn> --json <f>
```

Lô 5–10 câu/lần (một câu lỗi ⇒ rollback cả lô). Trùng kho ⇒ không insert, `ma_cau_list[idx]` = mã câu cũ (`--cho-trung` chỉ khi cố ý nhập bản thứ hai).
Ghi `ma_cau_list` ra `nhap_kho_<sha8>_ids.json`. `ok:false` ⇒ đọc `error`, sửa, chạy lại; chưa insert OK thì chưa `done`.

## Bước 6 — `done`

```bash
node scripts/nhap_kho.mjs done --file "<path>" --mode $ARGUMENTS --sha <sha256> --subject <…> --ma_cau_json <ids.json>
```

Kiểm sha256 · ghi `nhap_kho_log` · dời file sang `<root>/DaXuLy/<YYYY-MM-DD>/`.

## Lỗi thường gặp

| Lỗi | Xử |
|---|---|
| `thiếu dang_chinh — … phải ghi "khoi"` | Thêm `"khoi"` |
| `duplicate key … _pkey` | Chạy lại (advisory lock chờ) |
| `sha256 file hiện tại khác sha truyền vào` | Chạy lại từ `list` |
| PDF khoá | `fail` với `error="pdf_encrypted"` |
| `done` trả `moved:false` + EBUSY | Log đã ghi (kèm `CHUA_MOVE`); báo người kéo tay file sang `DaXuLy/<ngày>/`, **không** chạy `done` lại |
| Insert OK nhưng `done` lỗi DB | Kiểm `moved_to`; chạy `done` lại với đường dẫn mới nếu đã dời |
