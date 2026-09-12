---
description: Quét folder Drive-sync, trích câu từ đề (có/không lời giải), INSERT vào kho với da_duyet=false
argument-hint: <co_giai|khong_giai>
---

# /nhap-kho — Nhập kho câu từ folder Drive-sync

`$ARGUMENTS` = `co_giai` (luồng A, có lời giải sẵn) hoặc `khong_giai` (luồng B, chỉ có đề).

## Nguyên tắc bất di

1. **KHÔNG tự giải luồng A.** Có lời giải sẵn ⇒ trích nguyên văn, không diễn giải, không "sửa cho gọn".
2. **KHÔNG thả DOCX MathType** (WMF câm). Chỉ Read PDF (`pages=1-N`, max 20 trang/lần).
3. **`ma_cau` do script cấp tự động** theo convention `<dang_chinh> + lpad(STT, 3, '0')`. **KHÔNG truyền trong JSON**.
4. **`dang_ai_de_xuat = dang_chinh`** (script tự set). Người duyệt đổi `dang_chinh` sau nếu Claude gán sai; `dang_ai_de_xuat` giữ vết bản gốc → đo được precision AI.
5. **`da_duyet = false`.** Duyệt do người ở màn "Duyệt câu" (`DuyetCauTab`).
6. **Thà bỏ trống còn hơn đánh sai** (§1.5 CLAUDE.md). Không chắc 100% `dang_chinh` → **`fail`** file với ghi chú, để CEO xem tay. Không đoán bừa.
7. **Batch nhỏ 5–10 câu/insert.** ROLLBACK cả lô nếu 1 câu lỗi — batch nhỏ đau ít.
8. **1 file = 1 lượt done.** Log ma_cau_list đủ, move đúng ngày. Fail giữa chừng ⇒ `fail` để log; file ở nguyên chỗ, chạy lại.

## Flow

### Bước 1: `list`

```bash
node scripts/nhap_kho.mjs list --mode $ARGUMENTS
```

Nhận JSON `{ mode, root, files: [...] }`. Mỗi `files[i]` có: `path, name, khoi_folder, size_bytes, sha256, seen_before, prev_log?`.

Với mỗi file `seen_before=true` **có `prev_log.so_cau_moi > 0`** ⇒ **BỎ QUA** (đã nhập rồi). Nếu `seen_before=true` chỉ có `prev_log.loi` (fail cũ) ⇒ **CÓ THỂ chạy lại** (CEO chắc đã sửa file).

### Bước 2: mỗi file — quyết subject + đọc PDF

Subject dispatch theo tên file + nội dung câu:

| Tín hiệu | Subject | Bảng |
|---|---|---|
| `Ch5` L12 = mặt phẳng, `Hinh`, `HGT`, các bài hình học phẳng/không gian | `hgt` | `hgt_cau_hoi` + `hgt_ban_do` |
| Đại số, phương trình, hàm số, dãy số, thống kê, xác suất | `dai` | `dai_cau_hoi` + `dai_ban_do` |
| Lý, Hoá, Sinh | `khtn` | `khtn_cau_hoi` + `khtn_ban_do` |

**Không rõ ⇒ fail file với `error="chua_ro_subject"`, hỏi CEO.**

Read PDF: `Read` tool với `pages="1-20"` (nếu PDF > 20 trang thì đọc theo range). Vision đọc math trực tiếp, không OCR.

### Bước 3: gán `dang_chinh` — quy trình chống đoán bừa

1. Query bản đồ theo khối để lấy dạng ứng viên (không có psql trên Windows — viết 1 node one-off vào scratchpad):
   ```js
   // scratchpad/_bd.mjs
   import pg from 'pg'; import fs from 'node:fs';
   const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#')&&l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
   const c = new pg.Client({connectionString: env.DATABASE_URL_RO || env.DATABASE_URL});
   await c.connect();
   const r = await c.query(`select ma_dang, ma_chu_de, ten_dang from hgt_ban_do where khoi=$1 order by ma_dang`, ['12']);
   r.rows.forEach(x => console.log(x.ma_dang, '|', x.ma_chu_de, '|', x.ten_dang));
   await c.end();
   ```
   Đặt file trong repo (scripts/ tạm) rồi `node scripts/_bd.mjs`; xoá sau khi xong.

2. Đọc `ten_dang` + so với đề: match ≥ 80% ⇒ gán. Match mập mờ ⇒ **để trống câu đó, insert các câu chắc trước; câu mập mờ → log riêng ở stderr, KHÔNG INSERT**.

### Bước 4: build JSON câu

Format 1 câu (theo memory `nhap-cau-hgt-tu-pdf.md`):

```json
{
  "dang_chinh": "T312010107",
  "loai_cau": "trac_nghiem",       // trac_nghiem | dung_sai | tra_loi_ngan
  "noi_dung": "Cho ... $\\vec{a}=(1,2,3)$ ...",
  "lua_chon": ["$A. ...$.", "$B. ...$.", "$C. ...$.", "$D. ...$."],   // trac_nghiem
  "dap_an": "A",                    // trac_nghiem: 'A'/'B'/'C'/'D'; tra_loi_ngan: '12,5'
  "loi_giai": "Ta có $\\vec{a} \\cdot \\vec{b} = ...$ ...",
  "anh_de": null,
  "anh_dap_an": null,
  "ma_cum": null,
  "ten_de_goc": "NBV_L12_Ch5_F",
  "nguon": "de_thi",
  "nguon_giai": "nguoi"
}
```

### Câu ĐÚNG-SAI (loai_cau='dung_sai') — format KHÁC

**Model:** 1 câu ĐS có N mệnh đề (thường 4), MỖI mệnh đề là 1 DẠNG bài RIÊNG. Bảng con
`<mon>_cau_menh_de` (mig 202609121432) capture điều này qua trigger tự sync từ jsonb.
Câu ĐS có **`dang_chinh` = dạng đại diện của chuyên đề nhà** (giữ convention hiện tại
của `createCauDungSai` — [src/lib/kho/api.ts:415](src/lib/kho/api.ts:415)), KHÔNG null.

**KHTN chưa hỗ trợ câu ĐS** — script `_kho_insert.mjs` sẽ refuse. Chờ tách Lý/Hoá/Sinh
(memory `[doi-xung-cap-mon-vs-nhanh]`).

```json
{
  "dang_chinh": "T312010101",       // dạng đại diện chuyên đề nhà (câu cha)
  "loai_cau": "dung_sai",
  "noi_dung": "Cho hàm số $f(x)=x^3-3x+1$. Xét các mệnh đề sau:",
  "menh_de": [
    {"ma_dang": "T112010502", "noi_dung": "$f'(x)=3x^2-3$.", "dap_an": "D", "loi_giai": "..."},
    {"ma_dang": "T112010101", "noi_dung": "$f$ đồng biến trên $(-\\infty;-1)$.", "dap_an": "D", "loi_giai": "..."},
    {"ma_dang": "T112010401", "noi_dung": "GTLN của $f$ trên $[-2;2]$ bằng $3$.", "dap_an": "S", "loi_giai": "..."},
    {"ma_dang": "T112020104", "noi_dung": "PT $f(x)=0$ có $3$ nghiệm phân biệt.", "dap_an": "D", "loi_giai": "..."}
  ],
  "loi_giai": null,                 // câu cha thường không cần (giải nằm ở mỗi mệnh đề)
  "ten_de_goc": "NBV_L12_Ch5_F",
  "nguon": "de_thi"
}
```

**KHÔNG có `dap_an`, `lua_chon` cho câu ĐS** (mỗi mệnh đề có `dap_an` D/S riêng).

**Trigger DB tự động:** sau INSERT câu cha, `trg_sync_menh_de` đọc jsonb `menh_de` → insert
bảng con `<mon>_cau_menh_de` với FK cứng tới bản đồ. Mệnh đề có `ma_dang` không hợp lệ
(sau renumber) sẽ bị **skip silently** — bảng con có gap thu_tu, UI Duyệt sẽ hiển thị
"mệnh đề X chưa gán dạng". Đây là behavior mong muốn (không fail cứng INSERT câu cha).

**LaTeX convention** (KaTeX renderer): inline `$…$`, `\dfrac`, `\vec{...}`, `\sqrt{...}`, `\begin{cases}...\end{cases}`, `\Rightarrow`, `\Leftrightarrow`. **KHÔNG** dùng `\(...\)`. Kết thúc mỗi phương án `A/B/C/D` bằng `.` cuối, **KHÔNG** tiền tố `A.`/`B.` (đã có KaTeX render trong `$…$`, xem sample: `"$A. \\dfrac{1}{2}.$"` — dấu `A.` NẰM TRONG `$…$`).

Ghi ra file tạm scratchpad: `<scratchpad>/nhap_kho_<sha8>.json`.

### Bước 5: `insert`

```bash
node scripts/nhap_kho.mjs insert --subject <hgt|dai|khtn> --json <scratchpad>/nhap_kho_<sha8>.json
```

Nhận JSON `{ ok: true, ma_cau_list: [...], inserted: N }`. Ghi `ma_cau_list` ra `<scratchpad>/nhap_kho_<sha8>_ids.json`.

Nếu `ok:false` ⇒ đọc `error`, sửa (thường là dạng sai hoặc thiếu cột), chạy lại. **Đừng move file cho tới khi insert OK.**

### Bước 6: `done`

```bash
node scripts/nhap_kho.mjs done \
  --file "<path>" \
  --mode $ARGUMENTS \
  --sha <sha256> \
  --subject <hgt|dai|khtn> \
  --ma_cau_json <scratchpad>/nhap_kho_<sha8>_ids.json
```

Script sẽ:
1. Verify sha256 file khớp (chống có ai sửa file giữa chừng).
2. INSERT `nhap_kho_log`.
3. Move file → `<root>/DaXuLy/<YYYY-MM-DD>/<name>`.

### Bước 7: báo cáo

Sau khi quét hết:
- N file đã xử lý — mỗi file: subject, số câu, list `ma_cau` (5 đầu + `... và K câu nữa`).
- Q file skip (đã có trong log).
- F file fail — kèm lý do.
- Nhắc CEO mở màn **"Duyệt câu"** (`DuyetCauTab`) để duyệt lô mới.

## Nếu `$ARGUMENTS = khong_giai` (luồng B)

Bước 4 khác: KHÔNG có lời giải sẵn. Claude phải tự giải + verify (spec `spec-giai-bai-ai.md`).

Set:
- `loi_giai` = lời giải Claude tự viết
- `nguon_giai` = `"ai"`
- `giai_method` = `"ai_extract_solve"` (thêm vào JSON)
- `ai_model` = `"claude-opus-4-7"` (thêm vào JSON)
- Câu nhiều ý: dùng lại kết quả ý trước, không chứng minh lại từ đầu.

**Verify trước khi INSERT** — 1 câu mà sai sẽ nhân lên nhiều HS ⇒ luồng B nếu chưa chắc chắn 100% ⇒ fail file, để worktree `builder-hgt` / worker `hangdoi-giai` xử.

## Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Xử |
|---|---|---|
| `dang_chinh không có trong <mon>_ban_do` | Gán sai code dạng | Query lại bản đồ, sửa JSON, chạy lại |
| `duplicate key value violates unique constraint "*_pkey"` | STT collision (race) | Chạy lại — advisory lock trong script sẽ chờ |
| `sha256 file hiện tại (...) khác sha truyền vào` | Ai đó sửa file giữa `list` và `done` | Chạy lại từ `list` để lấy sha mới |
| Read PDF trả về "cannot read encrypted" | PDF khoá | `fail` với `error="pdf_encrypted"` |
| Insert OK nhưng `done` fail | Log ghi rồi mà chưa move? | Script làm log + move trong 1 tx; nếu fail thì file còn ở chỗ cũ, chỉ log rơi. Chạy `done` lại. |

## Chạy thử tay 1 file trước khi bulk

Đợt đầu (chưa quen): CEO thả 1 file mẫu vào `L7/`, gõ `/nhap-kho co_giai`. Xong đọc log stderr + query `select * from hgt_cau_hoi where ten_de_goc='<basename>' limit 3` để soi format. OK rồi mới thả bulk.
