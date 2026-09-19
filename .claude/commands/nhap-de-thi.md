---
description: Nhập 1 đề thi TOÁN nguyên vẹn (BGD/Sở/Cụm/thi thử) — bóc câu + lưu cấu trúc đề
argument-hint: <10|11|12>
---

# /nhap-de-thi — Nhập đề thi TOÁN (pha 1)

`$ARGUMENTS` = khối `10` | `11` | `12`. Chỉ Toán đợt này (Đại + Hình cùng đề). KHTN/Văn/Anh hold.

Khác `/nhap-kho co_giai` chỗ nào: ngoài bóc câu vào `<mon>_cau_hoi`, phải **lưu CẤU TRÚC đề** (thứ tự câu, phần I/II/III/IV, timing, mã đề, năm, nguồn) vào `toan_de_thi` + `toan_de_thi_cau`. Sau HS luyện tập trên app đúng cấu trúc đề thật (pha 2 tách riêng, chưa làm đợt này).

## Nguyên tắc bất di

1. **1 file PDF = 1 đề.** Đừng bóc gộp 2 đề trong 1 file.
2. **Không tự giải.** Đề thi thật có đáp án (đôi khi có lời giải chi tiết) — trích nguyên văn.
3. **Đọc CẤU TRÚC từ trang bìa/đề bài** (Claude tự parse — CEO đã chốt 12/09). CEO xác nhận 1 lần trước insert. Không tag tay 5-7 field.
4. **`da_duyet = false`** — chờ CEO duyệt ở màn "Duyệt đề" (pha sau).
5. **Không chắc `dang_chinh` câu nào ⇒ `fail` file với ghi chú.** Không insert từng phần rồi treo.
6. **`cau_truc` là declarative** — thứ tự phần + số câu + điểm mặc định phần. Data thực (câu nào ở phần nào) ở `toan_de_thi_cau`.

## Flow

### Bước 1: `list`

```bash
node scripts/nhap_de_thi.mjs list --khoi $ARGUMENTS
```

Script tự tạo folder `E:\BK ACADEMY\Tài liệu Claude nhập kho\DE_THI\L$ARGUMENTS\` nếu chưa có. Trả JSON `{ khoi, root, files: [...] }`. Skip file có `seen_before=true && prev_log.ghi_chu = "de_thi:TDxxxxx"`.

### Bước 2: mỗi file — đọc PDF, parse metadata

Read PDF trang 1-2 (`pages="1-2"`) → parse:
- **Tên đề**: tiêu đề trên trang bìa (VD "ĐỀ THAM KHẢO KỲ THI TỐT NGHIỆP THPT NĂM 2025 — MÔN TOÁN — MÃ ĐỀ 0104")
- **Nguồn**: `bgd` (Bộ) | `so` (Sở) | `cum_chuyen_mon` | `thi_thu` (trường tự tổ chức) | `le` (không rõ)
- **Mã đề**: nếu có (VD "0104")
- **Năm**: 2025
- **Khối**: `$ARGUMENTS`
- **Thời gian làm bài**: (VD "90 phút")
- **Cấu trúc phần**: từ đề bài, VD:
  ```
  PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn... (12 câu × 0.25 điểm)
  PHẦN II. Câu trắc nghiệm đúng sai... (4 câu × 1.0 điểm)
  PHẦN III. Câu trắc nghiệm trả lời ngắn... (6 câu × 0.5 điểm)
  ```

Ghi metadata ra `<scratchpad>/de_<sha8>_meta.json`. Nhắc CEO nhìn 1 lần trước insert.

### Bước 3: đọc toàn bộ đề, bóc câu

Read PDF full (pages theo trang). Với mỗi câu:
- **`thu_tu`**: 1..N (theo thứ tự trong đề — KHÔNG reset theo phần).
- **`phan`**: `I` | `II` | `III` | `IV`.
- **`mon_con`**: `dai` (đại số/giải tích) | `hgt` (hình học không gian tọa độ). Xem câu: có `\vec{}`, mặt phẳng, mặt cầu, đường thẳng trong KG ⇒ `hgt`; hàm số, đạo hàm, tích phân, cực trị, tiệm cận, xác suất ⇒ `dai`.
- **`diem`**: null nếu = `diem_moi_cau` của phần (mặc định). Chỉ set khác khi đề ghi khác.
- **`cau`**: payload câu **y hệt format `nhap_kho.mjs insert`** — {dang_chinh, loai_cau, noi_dung, lua_chon, dap_an, loi_giai, ten_de_goc,...}. `nguon="de_thi"`, `nguon_giai="nguoi"` mặc định. `ten_de_goc` = basename file bỏ đuôi.

Gán `dang_chinh` theo bản đồ (`dai_ban_do` hoặc `hgt_ban_do`, khối = `$ARGUMENTS`) — cùng quy trình chống đoán bừa như `/nhap-kho`. Không chắc câu nào ⇒ dừng, `fail` file, hỏi CEO.

Ghi mảng câu ra `<scratchpad>/de_<sha8>_cau.json`.

### Bước 4: `insert` (atomic 1 tx cho cả đề)

```bash
node scripts/nhap_de_thi.mjs insert \
  --meta <scratchpad>/de_<sha8>_meta.json \
  --cau  <scratchpad>/de_<sha8>_cau.json
```

Script làm 3 việc trong 1 transaction:
1. INSERT `toan_de_thi` → nhận `de_id` (VD `TD00042`).
2. Group câu theo `mon_con` → INSERT từng nhóm vào `<mon_con>_cau_hoi` (reuse `_kho_insert.mjs`).
3. INSERT `toan_de_thi_cau` (de_id, thu_tu, phan, ma_cau_dai/ma_cau_hgt, diem).

Trả `{ ok, de_id, so_cau, ma_cau_list }`. Fail giữa chừng ⇒ **ROLLBACK cả** (đề chưa tạo, câu chưa insert vào kho, không có rác nửa vời).

Ghi `de_id` ra `<scratchpad>/de_<sha8>_id.txt`.

### Bước 5: `done`

```bash
node scripts/nhap_de_thi.mjs done \
  --file "<path>" \
  --sha <sha256> \
  --de-id <de_id>
```

Script:
1. Verify sha256 file khớp.
2. Đếm câu đã link (`toan_de_thi_cau` where `de_id`) → ghi `nhap_kho_log(so_cau_moi, ma_cau_list, ghi_chu="de_thi:TDxxxxx")`.
3. Move file → `<root>/DE_THI/DaXuLy/<YYYY-MM-DD>/<name>`.

### Bước 6: báo cáo

Sau khi quét hết:
- N đề đã nhập — mỗi đề: `de_id`, tên, năm, khối, nguồn, số câu (X đại + Y hình).
- Q file skip (đã có trong log).
- F file fail — kèm lý do.
- Nhắc CEO: pha sau sẽ có màn "Duyệt đề" (chưa làm đợt này). Đợt này chỉ nhập kho.

## Xử lý lỗi

| Lỗi | Xử |
|---|---|
| `check constraint "toan_de_thi_khoi_check"` | `meta.khoi` phải là '10'/'11'/'12' (text, không phải số) |
| `check constraint "toan_de_thi_nguon_check"` | `meta.nguon` phải ∈ bgd/so/cum_chuyen_mon/thi_thu/le |
| `check "toan_de_thi_cau_1_of_2_check"` | Câu phải trỏ ĐÚNG 1 trong 2 (dai hoặc hgt). Xem lại `mon_con` |
| `duplicate key "toan_de_thi_cau_thu_tu_uniq"` | 2 câu cùng `thu_tu` trong cùng đề — sửa JSON |
| `insert or update ... violates foreign key "..._ma_cau_dai_fkey"` | Câu chưa insert vào `dai_cau_hoi` nhưng đã link — bug script, báo tôi |

## Chưa làm trong pha này (nhắc CEO)

- **Màn "Duyệt đề"** (đối xứng "Duyệt câu"): CEO xem đề, đổi tag, publish. Pha 2.
- **HS thi trên app**: `luot_thi`, `luot_thi_dap_an`, chấm auto, xếp hạng. Pha 2.
- **Đề tự soạn của GV** (mini quiz từ kho câu): CEO đã chốt chưa làm đợt này.
- **KHTN/Văn/Anh**: hold. Khi mở lại, template đối xứng — thêm `khtn_de_thi` / `van_de_thi` / `anh_de_thi` bằng migration mới.
