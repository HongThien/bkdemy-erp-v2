# Đề thi (trường/sở) — Feature Spec · BKdemy ERP

**Loại tài liệu thứ 2:** đề thi thử của các trường/sở. Đi **ngược** giáo trình: đề thật → **bóc câu đổ vào kho** + **giữ tổ hợp liên kết** thành đề mềm dùng thẳng.

> **ĐỌC TRƯỚC KHI CODE:** `HANDOFF.md` + `CLAUDE.md`. Đây là feature MỞ RỘNG hệ tài liệu đã có, KHÔNG phải hệ mới. Phải fit vào `tai_lieu`/`tai_lieu_phan`/`tai_lieu_cau`/`dai_cau_hoi`, tái dùng ET/PrintView/import. **Verify schema trước** (`information_schema.columns` + `pg_tables.rowsecurity`), **reuse > đẻ mới**, tôn trọng chiều **môn** (bounded-context: `dai_*` vs `khtn_*`), RLS convention (data DISABLE / staffs ENABLE).

---

## 0. Neo vào cái đã có (đừng phát minh lại)

- **Đã có sẵn khe:** `LAMTAILIEU_CHILDREN` = Giáo trình · ET · **Đề thi** (`de_thi` — hiện là **placeholder**) · Bổ trợ. → Feature này **lấp placeholder `lamtailieu:de_thi`**, không thêm nhánh mới.
- **Mẫu gần nhất để nhái = ET** (`loai='et'`): câu-centric, ordered câu trong phan, `DangPickerOne`/`KhoPicker`/`ETPrintView`, metadata doc ở `cau_hinh`. Đề thi ≈ ET nhưng: có **metadata nguồn**, giữ **thứ tự + phần gốc**, và **sinh câu vào kho** (thay vì chỉ ghép câu sẵn).
- **Import đã có:** `PdfCropper` (cắt ảnh per-câu 300DPI), Gemini parse (Auto), "Nhập chuỗi câu" (Manual), `menh_de` jsonb (Đúng/Sai). → luồng bóc đề **tái dùng nguyên**, không viết lại parser.
- **In đã có:** `ETPrintView`/`PrintView` (paged.js) + `CauItem`/`buildPagedCss`/`CHROME_CSS`/`splitStem`/`OptGrid`/`GvAnswer`/`MathText prefix`. → bản in đề thi **tái dùng engine này**.
- **Kho tài liệu** (`KhoTaiLieuScreen`, `lamtailieu:kho`): đề thi xong **tự hiện ở đây** (nút 🖨 In / Nhân bản / Xoá) — nơi tra & tái dùng.

---

## 1. Ý tưởng cốt lõi — DUAL MEMBERSHIP

Một câu bóc từ đề = **1 dòng `dai_cau_hoi`** (theo môn: `dai_` hoặc `khtn_`), có `ma_dang`. Dòng đó đồng thời:

1. **Thuộc KHO** — qua `ma_dang` → đếm coverage (%chuyên đề), hiện trong `DangHub`, tái dùng ở giáo trình/ET, tính `cauUsage`.
2. **Thuộc ĐỀ THI** — qua liên kết-thứ-tự trong tài liệu `loai='de_thi'` → giữ **thứ tự gốc + phần gốc**.

→ Import 1 đề = **nuôi kho + ra đề dùng ngay**. KHÔNG nhân bản nội dung câu (1 câu = 1 dòng, tham chiếu 2 nơi).

---

## 2. Khác giáo trình & ET

| | Giáo trình | ET | **Đề thi (mới)** |
|---|---|---|---|
| Chiều | kho → ghép | kho → ghép | **đề → sinh câu vào kho** |
| Thứ tự hiển thị | **gom theo dạng/buổi** | thứ tự soạn | **GIỮ thứ tự gốc của đề** |
| Nhóm | Buổi → Dạng | 1 phan custom | **Phần gốc** (Phần I/II…) |
| Câu từ đâu | có sẵn kho | có sẵn kho | **bóc từ đề (import)** |
| Metadata nguồn | không | lớp+ngày | **trường/sở, năm, thời gian, thang điểm** |
| Dùng | ghép/trích buổi | gán buổi | **in/dùng NGUYÊN** |

Điểm nhấn: đề thi **KHÔNG regroup theo dạng** — giữ đúng "tổ hợp liên kết" gốc. Đây là lý do nó là loại riêng chứ không phải giáo trình.

---

## 3. Data model (REUSE — hạn chế migration)

**Nguyên tắc:** đừng đẻ bảng lõi mới. Verify rồi tái dùng:

- **Header:** `tai_lieu` với **`loai='de_thi'`** + `mon`. (`tai_lieu.loai` là text → thêm giá trị, KHÔNG cần migration cột.)
- **Metadata nguồn → `tai_lieu.cau_hinh` (jsonb)**, KHÔNG thêm cột (đúng pattern ET dùng cau_hinh):
  ```jsonc
  cau_hinh.deThi = {
    nguon: "THPT Chuyên Sư Phạm",   // trường/sở
    cap: "vao_10",                   // dùng lại vocab cấp
    nam: 2024,
    thoi_gian_phut: 120,
    thang_diem: 10,
    co_cau: [ { ten:"Phần I. Trắc nghiệm", tu_cau:1, den_cau:12 },
              { ten:"Phần II. Tự luận", tu_cau:13, den_cau:17 } ],
    pdf_goc_url: "…"                 // ĐÍNH KÈM đề gốc (xem §8)
  }
  ```
- **Phần (section) → `tai_lieu_phan`**: mỗi phần gốc = 1 phan (`tieu_de` = "Phần I…", `kieu` từ registry `BLOCK_KIEU`). Câu trong phan **giữ thứ tự gốc** (STT của đề, KHÔNG sort theo `ma_dang`).
- **Liên kết câu → `tai_lieu_cau`** (như các doc khác; đây là "tổ hợp liên kết"). STT = số câu trong đề gốc.
- **Câu → `dai_cau_hoi`/`khtn_cau_hoi`** theo môn, có `ma_dang`, `menh_de` cho Đúng/Sai.

> ⚠ Trước khi code: `grep` schema thật của `tai_lieu`/`tai_lieu_phan`/`tai_lieu_cau` (cột `loai`, `cau_hinh`, `stt`, `ref_ma`…). Nếu cần cột mới → cân nhắc kỹ, ưu tiên nhét `cau_hinh`. Nếu buộc migration → 2 verify query trước (columns + rowsecurity).

---

## 4. Luồng IMPORT / bóc đề (trái tim của feature)

Mục tiêu 1 lượt: **tạo header đề + bóc từng câu vào kho + xâu chuỗi thứ tự**.

1. **Tạo đề** — form metadata (§3: nguồn/năm/cấp/môn/thời gian/thang điểm) + **đính kèm PDF đề gốc** (bucket `kho-tailieu`).
2. **Khai cấu trúc phần** — thêm Phần I/II… (tên + khoảng câu).
3. **Bóc câu** (per câu, tái dùng import kho):
   - `PdfCropper` cắt ảnh đề/đáp án từ PDF gốc, HOẶC Gemini Auto parse cả trang, HOẶC dán JSON/văn bản.
   - Mỗi câu → **insert `dai_cau_hoi`** (theo môn) + **gán `ma_dang`** (người chọn/AI gợi ý; Đúng/Sai → `menh_de`).
   - Đồng thời **insert `tai_lieu_cau`** (đề_id, câu_id, stt=số-câu-gốc, phan=phần).
   - Câu **chưa map được dạng** → vẫn banked nhưng cắm vào **holding "chưa phân dạng"** để review sau (đừng chặn luồng; đừng vứt câu).
4. **Chống trùng câu:** nếu câu đã tồn tại trong kho (đề dùng lại câu cũ) → cho **liên kết câu sẵn** thay vì tạo mới (KhoPicker), giữ dual-membership.

> Bóc đề = **cùng pipeline import kho hiện có**, chỉ khác đầu ra có thêm `tai_lieu_cau` xâu thứ tự. Đừng viết parser mới.

---

## 5. Builder / UI (`DeThiScreen`, leaf `lamtailieu:de_thi`)

- Nhái `ETScreen` câu-centric nhưng **theo phần + thứ tự gốc**:
  - Header: metadata đề + nút **đính kèm PDF gốc** + chọn **môn** (dispatch kho đúng môn qua `khoCuaMon`).
  - Cây trái: **Phần → Câu (STT)**; "+ Thêm phần", "+ Thêm câu" trong phần.
  - Mỗi câu: khối bóc (Cropper/Gemini/JSON) → chọn **dạng** (`DangPickerOne`) → preview đề+đáp án | lời giải (như DangHub review 1-câu) → ✎ sửa.
  - **Tự động lưu** ("↻ Tự động lưu / ✓ Đã lưu"), KHÔNG nút Lưu (đúng pattern builder hiện tại).
- lib `src/lib/dethi.ts` (seam data, nhái `tailieu.ts`/ET funcs): `createDeThi/listDeThi/getDeThiFull/setPhanCua/setCauOfPhan/attachPdfGoc/…` — **theo môn**.

---

## 6. In (`DeThiPrintView` — tái dùng engine ET)

Tái dùng `ETPrintView`/`buildPagedCss`/`CauItem`/`splitStem`/`OptGrid`/`GvAnswer`/`MathText prefix`:

- **Header đề:** dải sóng + **Nguồn · Môn · Thời gian · Thang điểm**; ô **Họ tên / Lớp / SBD / Điểm** (như đề thi thật).
- **Thân:** render **theo PHẦN, theo THỨ TỰ GỐC** (KHÔNG gom theo dạng, KHÔNG đánh số lại theo giáo trình). "Câu N." = STT gốc (`MathText prefix`).
- Trắc nghiệm → lưới cột (`optCols` 14/30); tự luận → dòng kẻ; câu có hình → đề→hình→đáp án.
- **Bản HS** (ẩn đáp án/lời giải) / **bản GV** (đủ đáp án; `GvAnswer` phủ cả `menh_de` Đúng/Sai + trả-lời-ngắn).
- Xuất PDF: theo path in hiện có (vector `window.print` + raster tải nếu cần) — **không dựng lại**.

---

## 7. Hai chế độ song song: đề mềm (live-ref) + bản phát hành (snapshot)

Đề thi có **HAI đời sống, đừng lẫn:**

**(A) Đề mềm staff = live-reference** (như giáo trình/ET). 1 câu = 1 dòng, sửa 1 chỗ → mọi nơi đúng theo; không nhân bản nội dung; dual-membership sạch. Trung thực với bản gốc đảm bảo bằng **đính kèm PDF đề gốc** (`cau_hinh.deThi.pdf_goc_url`) làm archive.

**(B) Bản phát hành online = SNAPSHOT** (khi cho HS thi trên điện thoại — §8, IN v1). Lúc bấm **Phát hành**, hệ **đông cứng 1 bản** (đề + key + lời giải + lý thuyết, self-contained) đi qua **path test-online đã có** — HS đọc qua RPC security-definer, **KHÔNG đọc kho**; chấm server-side, chỉ lần nộp đầu; RLS 2 cõi (staff/HS). Kho sửa sau **không** ảnh hưởng bản đang thi (đúng anti-cheat + công bằng).

> Doc staff (live) ≠ bản phát hành (frozen). Đây KHÔNG mâu thuẫn: (A) để soạn/in, (B) để thi. Snapshot chỉ sinh lúc phát hành, không phải cách lưu đề.

---

## 8. Tích hợp

- **Coverage/DangHub:** câu bóc từ đề tự đếm vào %chuyên đề + hiện DangHub (miễn phí — lợi ích chính của việc "đổ vào kho").
- **cauUsage/least-used:** `tai_lieu_cau` của đề tính vào usage → gợi ý least-used vẫn đúng.

### 8.1 Phát hành online — HS thi trên điện thoại (IN v1)

Tái dùng **path test-online đã có** (spec test online: migration+RLS HS+`my_hoc_sinh_id()` → phát hành+chấm → dung_sai → ET online). Đề thi CHỈ thêm nút **"Phát hành"** sinh instance, KHÔNG dựng engine thi mới.

- **Phát hành = snapshot** đề (đề+key+lời giải+lý thuyết, self-contained) → instance online gắn **lớp + hạn**.
- **Anti-cheat 3 lớp (bắt buộc, THIẾU 1 là thủng):** (1) HS **không SELECT** bảng chứa key (RLS loại); (2) đề qua **RPC security-definer LỌC key/lời giải**; (3) **chấm server-side, claim lần nộp ĐẦU** (`get diagnostics row_count`).
- **Mobile HS-realm** đã có (login HS xong, `h-screen`, wrapper `zoom 1/1.15`) → thi được trên điện thoại.
- **Chấm tự động phần khách quan:** trắc nghiệm / Đúng-Sai / trả-lời-ngắn (`smartCheckTLN`, tách list theo `;` KHÔNG theo `,` — "0,5" là thập phân). Kết quả có thể vào mastery/tham khảo như ET.
- **Tự luận → hiển thị & chấm như TRẢ LỜI NGẮN khi online (v1):** tái dùng **form-override per-câu** (`cau_hinh.etFormByCau`/`etFormOf` — form hiển thị KHÁC `loai_cau` kho, ĐÃ CÓ ở ET). Bản phát hành set form=`tra_loi_ngan` cho câu tự luận → HS nhập **đáp án cuối**, auto-chấm `smartCheckTLN` + **`dung_sai`** (số). Câu **vẫn là tự luận trong kho + bản in giấy** (lời giải đầy đủ) — chỉ *bản online* rút gọn. **⚠ Điều kiện: mỗi câu tự-luận-lên-online phải có ĐÁP ÁN NGẮN + dung sai** (bắt lúc bóc đề hoặc lúc phát hành; thiếu → không auto-chấm được). Đánh đổi tạm thời: **chỉ chấm đáp án cuối, KHÔNG chấm bước.**

### 8.2 Móc tương lai (KHÔNG làm v1)
- Nối đề thi ↔ `ky_thi` (`loai='truong'`, mig 0043) để tổ chức kỳ thi có điểm/band.
- **Chấm BƯỚC tự luận:** HS **chụp ảnh bài làm** → GV chấm tay (sau: AI hỗ trợ) — thay cho rút-gọn-TLN khi cần chấm quá trình. Auto phân dạng AI vượt mức import hiện có. Đa cơ sở.

---

## 9. Phạm vi v1

**IN:** lấp leaf `de_thi`; `DeThiScreen` (metadata + phần + bóc câu theo thứ tự); import tái dùng (Cropper/Gemini/JSON/menh_de) đổ câu vào kho + `tai_lieu_cau` xâu thứ tự; đính kèm PDF gốc; `DeThiPrintView` (HS/GV) tái dùng engine ET; hiện ở Kho tài liệu; theo môn; live-reference. **+ Phát hành online (§8.1):** snapshot → HS thi trên điện thoại, anti-cheat 3 lớp, auto-chấm phần khách quan + **tự luận rút gọn thành trả-lời-ngắn** (đáp án cuối + dung sai).

**OUT (chờ trigger):** nối `ky_thi`; tự luận online (nộp ảnh/chấm tay); auto phân dạng AI vượt mức import hiện có; đa cơ sở.

---

## 10. Các bước build (cho Claude Code)

1. Đọc `HANDOFF.md`+`CLAUDE.md`. **Audit**: schema `tai_lieu`/`tai_lieu_phan`/`tai_lieu_cau`/`dai_cau_hoi` (columns) + xem `de_thi` placeholder nối ở đâu trong `LAMTAILIEU_CHILDREN`. Xác nhận `loai` text, `cau_hinh` jsonb tồn tại.
2. `src/lib/dethi.ts` — seam data theo môn (nhái ET/tailieu). CRUD đề + phần + `tai_lieu_cau` (STT gốc). `attachPdfGoc` (bucket `kho-tailieu`).
3. Luồng import: tái dùng `PdfCropper`/Gemini/JSON/`menh_de`; đầu ra = insert `dai_cau_hoi`(+`ma_dang`) **và** `tai_lieu_cau`(stt,phan). Holding "chưa phân dạng". Liên kết câu sẵn qua `KhoPicker` (chống trùng).
4. `DeThiScreen` (leaf `de_thi`): header metadata + cây Phần→Câu + bóc/preview/sửa per-câu + auto-save.
5. `DeThiPrintView`: tái dùng `ETPrintView` engine; render theo phần/thứ-tự-gốc; HS/GV; header đề chuẩn (nguồn/thời gian/thang điểm/ô điểm).
6. Hiện đề ở `KhoTaiLieuScreen` (In/Nhân bản/Xoá) + thư viện scope môn.
7. **Phát hành online** (tái dùng path test-online): nút "Phát hành" → snapshot self-contained + gắn lớp/hạn; đề qua **RPC security-definer** (lọc key/lời giải); HS-realm mobile làm bài; **chấm server-side first-submit-only**; câu **tự luận set form=`tra_loi_ngan`** (`etFormByCau`) + đáp án cuối + `dung_sai`. Verify anti-cheat 3 lớp bằng test `set role`/HS thật.
8. RLS bảng mới (nếu có) theo convention (staff `la_thanh_vien()` + HS `my_hoc_sinh_id()`/`hs_o_lop()`); test `tsc` + luồng thật 1 đề mẫu (bóc → in → phát hành → thi trên điện thoại → chấm).

---

## 11. Definition of Done

- Bóc 1 đề mẫu → mỗi câu **có mặt trong kho** (DangHub thấy, đếm coverage) **và** đề in ra **đúng thứ tự/phần gốc**.
- Đề in được **ngay** từ Kho tài liệu, KHÔNG cần ghép từ kho; bản HS ẩn đáp án, bản GV đủ (kể cả Đúng/Sai `menh_de`).
- PDF đề gốc đính kèm mở được.
- Sửa 1 câu ở kho → đề phản ánh (live-reference); nội dung câu KHÔNG bị nhân bản.
- Không đẻ bảng/parser trùng; tái dùng ET/PrintView/import; đúng chiều môn; `tsc` sạch.
- Câu chưa map dạng KHÔNG bị mất — nằm ở holding chờ phân.
- **Phát hành online chạy được:** bấm Phát hành → HS **thi được trên điện thoại**, đề qua RPC (HS không đọc được key), chấm tự động phần khách quan ngay khi nộp, chỉ tính lần nộp đầu. Sửa kho sau khi phát hành KHÔNG đổi bản HS đang thi.

---

## Goal / Kickoff

> Kick bằng 1 câu trong phiên Claude Code (auto mode): *"Đọc BKDEMY_DETHI_SPEC.md, làm theo Goal cuối file."*

**NHIỆM VỤ:** Build feature Đề thi theo spec này, tới khi đạt HẾT "Definition of Done".

**ĐỌC TRƯỚC (bắt buộc):** HANDOFF.md + CLAUDE.md + toàn bộ spec này. Không code trước khi đọc xong.

**KỶ LUẬT:**
- Verify schema TRƯỚC mọi migration: `information_schema.columns` + `pg_tables.rowsecurity`.
- Reuse > đẻ mới: `tai_lieu(loai='de_thi')`/`tai_lieu_phan`/`tai_lieu_cau`/`dai_cau_hoi` + ETScreen/ETPrintView/PdfCropper/`menh_de`. Grep repo tìm chỗ dùng cũ TRƯỚC khi đổi.
- Đúng chiều MÔN (`dai_` vs `khtn_`). RLS: data DISABLE / `staffs` ENABLE. Không over-engineer.
- Phát hành online = tái dùng path test-online đã có (snapshot + anti-cheat 3 lớp). Nếu core online chưa khép → DỪNG báo tao trước khi tự dựng.

**VÒNG LÀM** (theo mục "Các bước build", từng bước, tự lặp tới hết): implement → `tsc` sạch → tự review có trôi spec không → commit rõ → append `DEVLOG.md` → bước tiếp.

**DỪNG & HỎI khi:** fork kiến trúc spec không cover · cần xoá/drop/migration phá dữ liệu (giải thích trước, chờ tao gật) · spec mâu thuẫn code thật. Chưa chắc thì hỏi, đừng đoán.

**XONG khi:** mọi Definition of Done đạt + `tsc` sạch + luồng thật 1 đề mẫu chạy end-to-end (bóc→in→phát hành→thi điện thoại→chấm). Báo tao khi xong hoặc kẹt.
