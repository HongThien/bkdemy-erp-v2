# spec-luong-kho-p0.md — LUỒNG KHO · PHA P0 (nền) — sổ bàn giao để làm tiếp ở máy khác

> **Đọc file này trước khi đụng bất cứ thứ gì trong `scripts/kho/`.**
> Thiết kế tổng + mọi quyết định của CEO nằm ở `spec-luong-kho.md`. File này chỉ nói về P0: **đã có gì, đã kiểm gì,
> chưa kiểm gì, việc kế tiếp là gì**. Viết 28/09 trên máy phụ (ổ Drive streaming), để phiên ở **máy công ty** làm tiếp.

## 1. P0 là gì và để làm gì

P0 dựng nền cho dây chuyền, chưa có trạm AI nào. Bốn thứ phải có trước khi xây trạm:

| Nền | Vì sao phải có trước |
|---|---|
| Cửa vào (T0) | Mọi trạm sau làm việc trên bản chép local, khoá bằng sha256. Không có thì chạy lại là nhân đôi. |
| Đường đọc Word | 1.400 file Word toàn MathType. Không biết đọc bằng cách nào thì không thiết kế được trạm đọc. |
| Cổng ghi | Luồng cũ để AI tự giải, tự "kiểm", tự ghi. Cổng là chỗ cài luật "không có biên bản kiểm thì không ghi". |
| Thước đo (vết người sửa) | CEO chốt "lọt dưới ngưỡng liên tục thì máy tự duyệt". Không ghi được người sửa gì thì không tính được. |

## 2. Trạng thái

| # | Việc | Trạng thái | Còn thiếu |
|---|---|---|---|
| 1 | T0 cửa vào | ✅ chạy trên folder thật | — |
| 2 | Cấu hình theo máy | ✅ | Máy công ty đặt `KHO_LAM_VIEC` nếu không muốn mặc định |
| 3 | Đọc thẳng MathType | ✅ làm được (bản thử) | **2 lỗ chặn** §6 |
| 4 | Cổng ghi | ✅ xét được gói | Nối vào lệnh ghi thật — làm ở P2 |
| 5 | Migration `kho_sua_log` | ✅ **CEO đã áp 28/09** (SQL Editor) | 3 việc sổ sách §4 |
| 6 | Đo `claude -p` | 🟡 script xong, **chưa từng chạy** | Chạy ở máy công ty §5 |
| 7 | Ngừng luồng tự giải bài cũ | ✅ công tắc đã lên `main` | Tắt lịch Task Scheduler ở máy công ty §5 |

## 3. Bản đồ code

```
scripts/kho/
  cau-hinh.mjs           gốc folder nguồn · thư mục làm việc · chuỗi kết nối đọc
  t0-cua-vao.mjs         quét → ghép cặp đề/đáp án → chép local + sha256
  cong-ghi.mjs           xét gói câu + biên bản kiểm → được ghi / từ chối
  do-claude-p.mjs        đo 1 lượt gọi Claude chạy nền            (CHƯA CHẠY)
  kiem-trigger-sua.mjs   thử trigger ghi vết rồi ROLLBACK          (CHƯA CHẠY)
  kho.test.mjs           28 test
  mathtype-thu/          đọc MathType → LaTeX (bản thử) + README
supabase/migrations/202609281225_kho_sua_log.sql
scripts/migrate.mjs      thêm cờ --ghi-so <file>
scripts/auto-giai-scheduler.mjs   công tắc ngừng (trên main)
```

Chạy test: `node --test scripts/kho/kho.test.mjs`

### 3.1 Cấu hình theo máy

| Biến | Nghĩa | Mặc định |
|---|---|---|
| `KHO_NGUON_GOC` | Gốc folder tài liệu, chỉ ĐỌC | dò `E:/BK ACADEMY` rồi `G:/Other computers/My Computer/BK ACADEMY` |
| `KHO_LAM_VIEC` | Thư mục làm việc trên đĩa local | `<thư mục người dùng>/bk-kho-lam-viec` |
| `DATABASE_URL_RO` | Role chỉ đọc | — (máy phụ KHÔNG có; máy công ty nên có) |

Đặt trong `.env.local` hoặc biến môi trường. Biến môi trường thắng file.

### 3.2 T0 — luật ghép cặp

- **Khoá** = đường dẫn thư mục + tên file, chuẩn hoá (Unicode NFC, chữ thường, gộp khoảng trắng), **bỏ hậu tố vai**.
- **Hậu tố vai:** `- CH` / `- DA` · `_HS` / `_GV` (kể cả `-GHÉP HS`) · thư mục `Đáp án/` · đuôi ` (1)` của trình duyệt.
- Hai file cùng khoá, khác vai ⇒ 1 cặp.
- File không hậu tố + bản đáp án cùng khoá ⇒ file không hậu tố là ĐỀ.
- Kiểu NBV `X - CH` + `X` ⇒ `X` là bản có lời giải. **Đây là SUY từ tên**, kết quả mang trường `suy_vai`; trạm đọc phải đối chiếu nội dung.
- Cùng khoá, cùng vai, cùng định dạng ⇒ **MƠ HỒ, không ghép**.
- **Không có chỗ nào ghép theo thứ tự hay theo số lượng.**

```
node scripts/kho/t0-cua-vao.mjs quet --thu-muc "Kho đề/Khối 12"                       # chỉ liệt kê + ghép
node scripts/kho/t0-cua-vao.mjs quet --thu-muc "Kho đề/Khối 12" --chep --gioi-han 5   # chép về local
```

Mỗi file chép về nằm ở `<KHO_LAM_VIEC>/<12 ký tự đầu của sha256>/` gồm `goc.<đuôi>` + `ho-so.json` (sha, tên gốc, đường dẫn gốc, khoá, vai).

### 3.3 Cổng ghi — hợp đồng gói

```json
{
  "cau": { "loai_cau": "...", "noi_dung": "...", "dap_an": "...", "loi_giai": "...", "dang_chinh": "...", "nguon_giai": "ai|nguoi" },
  "vet": {
    "lam":  { "tram": "gan-giai", "lan_chay": "L1", "model": "..." },
    "kiem": [ { "tram": "kiem-doc", "lan_chay": "K1", "cach": "code|model_khac|cung_model_ngu_canh_sach",
                "model": "...", "ket_qua": "dat|khong_dat|khong_kiem_duoc", "bam_noi_dung": "<sha256>", "ghi_chu": "..." } ]
  }
}
```

| Câu có gì | Trạm kiểm bắt buộc |
|---|---|
| Mọi câu | `kiem-doc` |
| Đã gán dạng thật (không phải dạng chờ `…000000`) | + `kiem-dang` |
| Đáp số / lời giải do AI viết (`nguon_giai = 'ai'`) | + `kiem-dap-so` |
| Hình do máy vẽ | + `kiem-hinh-a` (**phải là code**) + `kiem-hinh-b` |

Từ chối khi: thiếu biên bản · `bam_noi_dung` ≠ băm của câu sắp ghi · `lan_chay` của người kiểm trùng người làm · khai `model_khac` mà cùng model · `cach` lạ.
Qua cổng: `kiem_may` = `khop` / `nghi` (có trạm không đạt) / `khong_kiem_duoc`; `da_duyet` luôn `false`.

```
node scripts/kho/cong-ghi.mjs xet --goi <goi.json>     # thoát 0 = được ghi · 3 = bị từ chối
```

## 4. Migration `kho_sua_log` — đã áp, còn 3 việc sổ sách

**Đã kiểm trong DB (truy vấn chỉ-đọc, 28/09):** bảng `kho_sua_log` đủ 13 cột, RLS bật · cột `kho_doi_dang_log.actor` có ·
trigger `trg_log_kho_sua` gắn trên cả 3 bảng `dai_` / `hgt_` / `khtn_cau_hoi` · `_trg_log_doi_dang` đã ghi `actor` ·
`anon` KHÔNG chạy được `fn_kho_sua_tk`, `authenticated` chạy được.

**Chưa kiểm được:** trigger có ghi đúng khi có người sửa thật không. Bảng đang 0 dòng — nhưng xem việc (a): con số 0 này không tin được.

Vì áp bằng **SQL Editor** (chủ sở hữu = `postgres`) chứ không qua `npm run migrate`, phát sinh:

### (a) Role CLI không đọc được `kho_sua_log` ⛔

Bảng của `postgres` + RLS + policy chỉ cho `authenticated` ⇒ `claude_ro` / `claude_build` đọc ra **0 dòng, im lặng, không lỗi**
(`npm run schema` đã ghi cảnh báo này vào đầu `schema.md`). Mọi phép đo từ dòng lệnh sẽ sai mà không ai biết.
Chạy trong **Supabase SQL Editor**:

```sql
create policy claude_ro_select    on public.kho_sua_log for select to claude_ro    using (true);
create policy claude_build_select on public.kho_sua_log for select to claude_build using (true);
```

### (b) Sổ `_migrations` chưa ghi file này

Không ghi sổ thì lần tới ai chạy `npm run migrate` sẽ áp lại file này bằng role `claude_build` và **chết ở `create or replace function`**
(hàm thuộc `postgres`, role khác không thay được), kéo theo cả loạt file sau không áp được.
Đừng dùng `--baseline`: sổ đang có 14 file treo của phiên khác, `--baseline` sẽ đánh dấu luôn cả 14 file đó. Dùng cờ mới, ghi đúng 1 file:

```
node scripts/migrate.mjs --ghi-so 202609281225_kho_sua_log.sql
```

### (c) Thử trigger chạy thật — làm SAU (a)

```
node scripts/kho/kiem-trigger-sua.mjs
```

Script UPDATE thử 1 câu Đại trong 1 giao dịch rồi **ROLLBACK**, kiểm 4 điều: máy sửa đáp số ⇒ 1 dòng `dap_so`/`may` · người sửa lời giải
⇒ `loi_giai`/`nguoi` + đúng `actor` · chỉ khác khoảng trắng hay kiểu xuống dòng ⇒ không log · đổi cột ngoài nội dung ⇒ không log.
Script này **chưa từng chạy**.

### Đọc số đo

```sql
select * from fn_kho_sua_tk('dai', '2026-09-28'::timestamptz);   -- khâu | số câu người duyệt | số câu người phải sửa
```

"Sửa" = người đổi một giá trị ĐÃ CÓ. Điền vào ô trống không tính. Khâu `dang` đọc từ `kho_doi_dang_log`, chỉ tính dòng có `actor`
— dòng trước 28/09 không có `actor` nên không vào phép đo (đúng ý: 2.748/2.861 dòng cũ là đợt đổi mã 18/09, không phải người sửa).

## 5. Việc ở MÁY CÔNG TY — theo thứ tự

| # | Việc | Lệnh | Xong khi |
|---|---|---|---|
| 1 | Kéo code | `git pull origin main` | Có thư mục `scripts/kho/` |
| 2 | Tắt lịch tự giải bài | PowerShell bên dưới | Không còn tác vụ nào trỏ `auto-giai` ở trạng thái Ready |
| 3 | Thêm policy đọc | SQL §4(a) trong SQL Editor | `select count(*) from kho_sua_log` từ CLI không còn bị cảnh báo điểm mù trong `schema.md` |
| 4 | Ghi sổ migration | `node scripts/migrate.mjs --ghi-so 202609281225_kho_sua_log.sql` | `--status` không còn liệt kê file này ở "CÒN TREO" |
| 5 | Thử trigger | `node scripts/kho/kiem-trigger-sua.mjs` | 4 dấu ✔, "dòng thử còn sót: 0" |
| 6 | Chạy test | `node --test scripts/kho/kho.test.mjs` | 28/28 |
| 7 | Đo Claude chạy nền | `node scripts/kho/do-claude-p.mjs` | Có phần `=== PHÁN ===` — dán vào phiên làm việc |
| 8 | Thử T0 trên ổ thật | `node scripts/kho/t0-cua-vao.mjs quet --thu-muc "Kho đề/Khối 12"` | Ra 164 cặp như máy phụ (lệch thì folder 2 máy khác nhau — phải biết vì sao) |

Tắt lịch (PowerShell, chỉ TẮT, không xoá):

```powershell
Get-ScheduledTask | Where-Object { ($_.Actions | ForEach-Object { "$($_.Execute) $($_.Arguments)" }) -match 'auto-giai' } | Format-Table TaskPath, TaskName, State
Get-ScheduledTask | Where-Object { ($_.Actions | ForEach-Object { "$($_.Execute) $($_.Arguments)" }) -match 'auto-giai' } | Disable-ScheduledTask
```

**Đừng tắt** tác vụ `BKdemy HoiDap Luoi Vot` — đó là bot hỏi–đáp.

## 6. Việc code kế tiếp — vá đường đọc MathType

Bộ đọc đổi được 99,69% công thức trên file chưa từng thấy, nhưng **chưa dùng thật được** vì 2 lỗ:

| # | Lỗ | Bằng chứng | Hướng vá |
|---|---|---|---|
| 1 | **Số thứ tự tự động của Word bị mất** | File PNL, Từ Tâm đọc ra **0 dòng "Câu N"**; đoạn đánh số chỉ còn dấu `[[#]]` (28–78 chỗ/file) | Đọc `word/numbering.xml` + `w:numPr` của từng đoạn, dựng lại nhãn theo định dạng và bộ đếm từng cấp |
| 2 | **Định dạng chữ bị bỏ** | Đề trắc nghiệm đánh dấu đáp án đúng bằng gạch chân / tô màu / in đậm | Giữ `w:u`, `w:color`, `w:highlight`, `w:b` ở mức đoạn chữ; xuất dấu đánh dấu quanh phương án |

Sau 2 lỗ chặn: `w:sym` → ký tự thật · gạch en `–` trong công thức → dấu trừ (luật chuẩn hoá, ghi vết đã đổi) · bảng · thứ tự hộp chữ · ký tự riêng chưa có trong bảng (`U+F700`, `↷`, tab).

**Xong khi:** chọn 10 file (3 NBV · 3 PNL · 3 Từ Tâm · 1 khác), với mỗi file đếm được số câu, và số câu khớp với số câu nhìn bằng mắt
trong bản PDF/Word; với file trắc nghiệm, đáp án đọc ra khớp bảng đáp án cuối file nếu có. **Làm theo phương pháp §9.6 của
`spec-luong-kho.md`: dựng bài thi trước, sửa sau.**

Nhân chứng độc lập có sẵn: một số file Word có **bản PDF cùng tên nằm cạnh** (NBV, PNL) — T0 gom chúng vào cùng cặp.

## 7. Số đo gốc — để biết về sau có tụt không

| Đo | Giá trị 28/09 |
|---|---|
| T0 · Kho đề/Khối 12 | 358 tệp → 164 cặp · 30 đơn lẻ (24 đề không đáp án, 6 đáp án không thấy đề) · 0 mơ hồ |
| T0 · NBV K12 | 118 → 44 cặp (20 suy từ tên) · 28 đơn lẻ |
| T0 · PNL K12 | 105 → 48 cặp · 0 đơn lẻ |
| T0 · Từ Tâm K12 | 57 → 0 cặp (chỉ có bản học sinh) |
| Chép từ ổ Drive streaming | 1–2,4 giây/file; chạy lại 6–14 ms/file |
| MathType · 3 file mẫu | 2.174 / 2.177 |
| MathType · file đối chứng | 2.056 / 2.056 |
| MathType · 6 file chưa từng thấy | **4.212 / 4.225 = 99,69%** · hỏng: tab trong công thức 6, ký hiệu `↷` 7 |
| MathType · tốc độ | 0,2–0,3 giây/file |
| PDF đề K12 có lớp chữ | 3/4 file thử: 0 ký tự ⇒ PDF chỉ đọc bằng nhìn ảnh |
| Gán dạng (luồng cũ, câu đã duyệt) | 242 / 326 = 74% |

## 8. Bẫy đã dính khi làm P0

| Bẫy | Cách tránh |
|---|---|
| Heredoc Git Bash nuốt dấu `\` ⇒ regex `\s` thành `s`, chuỗi kết nối bị cắt đuôi | Viết script ra file `.mjs` rồi `node file`. Không `node -e`, không heredoc |
| `grep -c` ra 0 ⇒ mã thoát 1 ⇒ cả chuỗi `&&` phía sau (kể cả `git commit`) không chạy, không báo gì | Lệnh kiểm không đứng giữa chuỗi `&&` |
| Test tự viết qua hết nhưng luật ghép cặp vẫn sót 2 kiểu có thật | Chạy trên folder thật trước khi tin |
| Kết quả tra cứu / kết quả của agent phụ sai 2 lần trong ngày | Tự mở nguồn gốc đối chiếu; tự đếm lại bằng code của mình |
| KaTeX render được = đúng cú pháp, không phải đúng nội dung | Nhân chứng nội dung: bản PDF, TeX gốc tác giả để lại trong file |
| "0 dòng" đọc từ CLI trên bảng do `postgres` tạo | Không phải bằng chứng bảng rỗng — xem đầu `schema.md` |
| Áp migration bằng SQL Editor | Chủ sở hữu thành `postgres` ⇒ phải thêm policy đọc + ghi sổ tay (§4) |
| Đưa người lệnh chạy bằng đường dẫn tương đối | Ghi rõ đứng ở thư mục nào, nhánh nào |
| Phiên cô lập trong worktree chặn lệnh bash có `export` / biến tính lúc chạy | Truyền biến môi trường qua `spawnSync(..., { env })` trong script |
