# spec-de-thi.md — ĐỀ THI: 1 input → 2 output (kho theo dạng + đề thi được trên app)

> CEO chốt đích 20/09/2026 (phiên hỏi–đáp 9 câu). Bản này là spec build; paste-ready sang Notion » ERP V2.
> Trạng thái: CEO chốt đích 20–22/09; 27/09 CEO "làm đi thôi" ⇒ build P2 (Duyệt đề) + P3 (thi trên lớp) theo §9. P4 (tự luyện) chưa làm.

---

## 0. Một câu

Nhập 1 đề thi thật (PDF) qua Claude ⇒ **(output 1)** từng câu rơi về kho đúng dạng (`dang_chinh`) như mọi câu
khác, **(output 2)** đề vẫn sống nguyên cấu trúc (phần · thứ tự · điểm · thời gian) và **HS thi được trên app**.
Câu chỉ tồn tại **1 nơi** (kho); đề chỉ **trỏ** tới câu.

*Đứng trên vai (R7):* mô hình **item bank + test form** (chuẩn IMS-QTI: `assessmentTest → section → itemRef`).
Trong repo đã gọi tên là **dual-membership** (`dethi.ts`, spec kho §1).

---

## 1. Đích CEO đã chốt (20/09)

| # | Quyết định |
|---|---|
| 1 | HS thi **cả 2 kiểu**: (a) GV/OPS giao cả lớp theo ca · (b) HS tự vào thư viện đề luyện ở nhà. |
| 2 | Đợt đầu **THPT**, ưu tiên **khối 12**; hạ tầng dùng cho **mọi khối**. Trên app chỉ có **MCQ + Đúng/Sai**. Câu **Trả lời ngắn (Phần III) đổi thành MCQ, GIỮ NGUYÊN VỊ TRÍ trong đề**. |
| 3 | Thi **trên lớp** ⇒ tính mastery **như ET**. **Tự luyện ở nhà ⇒ TẠM CHƯA tính mastery.** |
| 4 | Cửa duyệt = **"Duyệt đề"** (1 cửa, duyệt cả đề ⇒ mọi câu trong đề thành `da_duyet`). |
| 5 | Câu trùng câu đã có trong kho ⇒ **trỏ về câu cũ**, không đẻ bản sao. |
| 6 | Đề **trỏ sống** vào kho; **lượt thi đã mở thì đóng băng**; câu nằm trong đề **cấm xoá cứng**. |
| 7 | Đồng hồ đếm ngược + tự nộp · chấm thang 10 kiểu Bộ · khoá lời giải tới khi GV mở · ca giao không thi lại. Xếp hạng + trộn mã đề **để sau**. |
| 8 | Nhập **từng đề, bán tự động qua Claude** (`/nhap-de-thi`), **KHÔNG qua ERP**. |
| 9 | Hạ tầng thư viện đề cho mọi khối, 12 trước. |

### 1b. Chốt thêm 22/09 (trả lời 3 câu chặn)

| # | Quyết định | Hệ quả kỹ thuật (CTO tự chốt, R2) |
|---|---|---|
| 10 | **Bản đồ kiến thức BK làm TRƯỚC** (khối 10 thiếu Hệ thức lượng · Véc tơ · Hàm số) rồi mới nhập đề. | Canonical đi trước measurement. Bước nhập đề chỉ chạy khi mọi chương của đề đã có dạng trong `dai_ban_do`/`hgt_ban_do`. |
| 11 | **Câu tự luận chuyển về Trả lời ngắn.** | Chỉ ý có **đáp số** mới đổi được (tiền lệ sẵn: `phatHanhTest` đã coi `tu_luan` có `dap_an` là `tra_loi_ngan`). Ý **chứng minh/biểu diễn** không có đáp số ⇒ giữ `tu_luan`, chỉ in, không lên app — không bịa đáp số. Bài nhiều ý: mỗi ý có đáp số = 1 câu TLN riêng, cùng `ma_cum`; TLN sau đó → MCQ như Phần III. |
| 12 | **Điểm mặc định theo khuôn Bộ.** | TN 0,25 · Đ/S 1,0 (bậc 0,1/0,25/0,5/1) · TLN 0,5 · tự luận-đã-đổi-TLN 0,5. Đề lệch khuôn (10 TN + 3 Đ/S + 3 TLN…) ⇒ tính theo đơn giá trên rồi **quy tổng về thang 10** ở `fn_de_thi_diem`. Thời gian mặc định 90 phút khi file không ghi. |


---

## 2. Hiện trạng đo thật (20/09) — vì sao phải chọn 1 đường

Repo đang có **2 bản song song** của cùng ý tưởng, **cả hai gần như chưa có dữ liệu**:

| | **A** — `tai_lieu(loai='de_thi')` + `tai_lieu_phan` + `tai_lieu_cau` | **B** — `toan_de_thi` + `toan_de_thi_cau` |
|---|---|---|
| Nhập | UI `DeThiScreen` | Claude `/nhap-de-thi` (`scripts/nhap_de_thi.mjs`) |
| Nối thi online | **CÓ**: `phatHanhTest` → `bai_test(loai='de_thi')`, in đề, test đầu vào, mastery coi như ET | **KHÔNG** |
| Trộn nhánh Đại + Hình GT trong 1 đề | **CÓ** (`cau_hinh.nhanhByCau`, đang dùng cho MT) | Có (2 cột FK) |
| Đối xứng môn §1.6 | **Đạt** (cột `mon`) | **Trượt** (bảng riêng Toán; môn khác phải nhân bản bảng) |
| Dữ liệu | 1 đề **vỏ rỗng** (0 phần, 0 câu) | **0 dòng** (đọc qua CLI — xem cảnh báo §2.1 CLAUDE.md) |

Số đo phụ (kho khối 12): TLN Đại 328 câu, **chỉ 84 có form MCQ đã duyệt**; TLN Hình GT 261 câu, **0 có form**.
HS app **chưa có đồng hồ đếm ngược**. Thang điểm Đúng/Sai kiểu Bộ **đã có** (`DUNGSAI_DIEM_4Y` trong `testgrade.js`).
`phatHanhTest` đang ghi cứng `diem: 1` mọi câu ⇒ **chưa giữ được điểm theo phần**.

### ⭐ Quyết định kiến trúc (CTO đề, chờ CEO gật)

**Gộp về đường A.** `/nhap-de-thi` đổi đích ghi sang `tai_lieu` / `tai_lieu_phan` / `tai_lieu_cau`.
Lý do: A đã nối sẵn in + phát hành + mastery + test đầu vào, đạt symmetry test; B phải xây lại tất cả từ đầu.
`toan_de_thi*` (0 dòng) **ngừng dùng**; việc DROP bảng là bước riêng, theo **Luật xoá** — hỏi CEO sau, không gộp vào đợt này.

---

## 3. Mô hình dữ liệu (trên đường A)

### 3.1 Đề = `tai_lieu(loai='de_thi')`
- `ten`, `khoi`, `mon`, `file_url` (PDF gốc), `nhanh` = nhánh mặc định của đề.
- `cau_hinh.deThi` (đã có type `DeThiMeta`) **mở rộng**: `nguon` (bgd/so/cum_chuyen_mon/thi_thu/le) · `maDe` · `nam`
  · `thoiGianPhut` · `thangDiem` · `pdfGocUrl` · **`sha256`** (chống nhập trùng file).
- `cau_hinh.nhanhByCau[ma_cau]` — nhánh kho của TỪNG câu khác nhánh mặc định (cơ chế MT, dùng lại nguyên).
- **Trạng thái duyệt đề**: cột MỚI `tai_lieu.duyet_at` + `duyet_boi` (NULL = "không áp dụng" với loại tài liệu khác;
  với `de_thi` chưa duyệt = chưa có dấu duyệt — đúng §1.5 vì đây là *sự kiện chưa xảy ra*, không phải số đo).
  Lịch sử duyệt/bỏ duyệt do **trigger** ghi (§4 CLAUDE.md).

### 3.2 Phần = `tai_lieu_phan(loai_phan='custom')`
- `tieu_de` = "PHẦN I…"; **thêm vào `noi_dung`/cấu hình phần**: `diem_moi_cau` (0.25 / 1.0 / 0.5) + `dang_thuc`
  (`trac_nghiem` | `dung_sai` | `tra_loi_ngan`) — *dạng thức GỐC của phần trong đề giấy*.

### 3.3 Câu trong đề = `tai_lieu_cau(phan_id, ma_cau, thu_tu)`
- Danh tính = **`ma_cau`** (khoá tự nhiên). `thu_tu` chỉ để hiển thị (§2 "danh tính bám khoá").
- Thêm cột `diem numeric NULL` — chỉ set khi câu lệch điểm mặc định của phần (NULL = "không áp dụng, theo phần").
- `tai_lieu_cau.ma_cau` là **TEXT không FK** ⇒ áp luật §2: **cấm xoá cứng câu đang nằm trong đề** —
  trigger chặn `DELETE` trên `<kho>_cau_hoi` nếu `ma_cau` còn trong `tai_lieu_cau`; chỉ được `xoa_at`.
  Màn đề hiện cờ "câu X đã vào kho rác".

### 3.4 Câu TLN → MCQ (giữ vị trí)
- **KHÔNG sửa câu gốc** (`loai_cau` vẫn `tra_loi_ngan`, `dap_an` vẫn số) — đúng chốt 08/09: MCQ là **form THÊM**
  ở `<kho>_cau_form_tn`. Bản giấy/in vẫn ra đúng đề Bộ; bản app ra MCQ. Một câu, hai mặt.
- Lúc phát hành: câu Phần III **luôn** snapshot từ `form_tn` đã duyệt (không cần GV bật toggle như ET).
- Điều kiện câu "thi được trên app" = **đúng hàm `_kho_dk_mcq_sql`** + thêm `dung_sai`. Không viết điều kiện riêng.

### 3.5 Invariant "đề sẵn sàng thi app" (pure-derive, KHÔNG cột trạng thái)
```
san_sang(đề) ⇔ đề đã duyệt
             ∧ ∀ câu ∈ đề: câu chưa xoá
             ∧ ∀ câu ∈ đề: (trắc nghiệm gốc) ∨ (đúng/sai) ∨ (có form_tn đã duyệt)
```
Thiếu ⇒ hàm `fn_de_thi_thieu(de_id)` trả đúng danh sách câu thiếu gì. Đó chính là **task** (việc = must-exist − does-exist).
**Không nhánh lùi** (luật 20/09): câu TLN chưa có form ⇒ đề CHƯA mở trên app, việc là SINH form, không phải cho thi TLN tạm.

---

## 4. Luồng NHẬP (Claude, bán tự động) — `/nhap-de-thi` v2

```
PDF ─► [1] parse bìa ─► [2] bóc câu ─► [3] dò trùng ─► [4] gán dạng ─► [5] sinh MCQ cho Phần III
    ─► [6] CEO xem tóm tắt 1 lần ─► [7] INSERT 1 transaction ─► [8] done (log + dời file)
```

1. **Parse bìa**: tên, nguồn, mã đề, năm, khối, thời gian, cấu trúc phần (số câu × điểm). `sha256` file đã có trong
   `nhap_kho_log`/`cau_hinh.deThi.sha256` ⇒ skip.
2. **Bóc câu**: nguyên văn, KHÔNG tự giải khi đề có đáp án (giữ rule cũ). Câu chung dữ kiện ⇒ `ma_cum`.
3. **Dò trùng** (chốt #5): chuẩn hoá `noi_dung` (bỏ khoảng trắng/dấu câu/LaTeX spacing) → so khớp trong kho cùng khối.
   - Khớp **chính xác sau chuẩn hoá** ⇒ dùng `ma_cau` cũ, không insert.
   - **Gần giống** (khác số liệu, khác 1 phương án) ⇒ **KHÔNG tự gộp** — liệt kê cho CEO quyết ở bước 6
     (§2 "số lượng khớp không phải bằng chứng" — gộp nhầm là ghi đè dữ liệu thật bằng phỏng đoán).
4. **Gán `dang_chinh`** theo bản đồ khối đó. **Đổi so với v1 của skill:** không chắc ⇒ **để trống dạng cho câu đó, vẫn nhập đề**
   (v1 fail cả file). Câu trống dạng vẫn thi được, chỉ không đổ mastery (§1.5). Màn Duyệt đề nêu rõ câu nào trống dạng.
5. **Sinh form MCQ cho câu TLN**: 4 phương án, distractor **theo lỗi** đúng `spec-mcq-quy-trinh-sinh.md`
   (dạng RÕ RÀNG tự sinh; dạng MƠ HỒ ⇒ để trống form, đề chờ — không bịa distractor). Ghi `<kho>_cau_form_tn`, `da_duyet=false`.
6. **CEO xem 1 lần**: bảng tóm tắt (meta · số câu/phần · câu trùng trỏ về đâu · câu gần-giống cần quyết · câu trống dạng · câu chưa có form).
7. **INSERT atomic**: câu mới → kho (`nguon='de_thi'`, `da_duyet=false`) · form_tn · `tai_lieu` + `tai_lieu_phan` + `tai_lieu_cau`
   + `nhanhByCau`. Fail ⇒ ROLLBACK cả đề. Chạy bằng chuỗi kết nối GHI truyền lúc gọi (§2.1).
8. **done**: ghi `nhap_kho_log`, dời file sang `DaXuLy/`.

---

## 4b. Nguồn DOCX có cấu trúc + bản phân dạng kèm theo (đo thật 21/09 — bộ Noctorium Toán 10, 1182 câu)

**Đo:** 53 file đề ↔ 41 file dạng (~28 dạng thật, file chia `_Phần n` mỗi 50 câu) là **CÙNG 1182 câu, khớp 100% hai chiều**
bằng script (so nội dung chuẩn hoá). Công thức là **Word Equation (OMML)** — script đọc được; **KHÔNG tải bản MathType**
(OLE/WMF = mù). Bố cục máy sinh, đều tăm tắp: `Phần n: …` · `Câu k.` · `A. B. C. D.` · `Lời giải` · hình PNG.
Cơ cấu: 738 TN · 172 Đ/S · 204 TLN · 68 tự luận.

**Cách dùng (tối ưu token):** AI **không đọc file nào** để lấy nội dung.
1. **Script (0 token):** bóc bản ĐỀ → câu/phần/thứ tự/phương án/lời giải/hình, OMML→LaTeX. Bóc bản DẠNG → chỉ lấy bảng tra
   `câu → (chương, bài, dạng của họ)`. Nhãn của họ **chỉ là gợi ý lúc nhập, không lưu DB**.
2. **AI chỉ làm việc cần phán đoán**, theo LÔ gom theo dạng của họ (mỗi lô nạp 1 lần danh sách 3–7 dạng BK ứng viên):
   (a) gán `dang_chinh` · (b) rút đáp án TN từ lời giải (file **không đánh dấu** đáp án đúng; Đ/S thì có sẵn "a) Đúng." → script)
   · (c) sinh form MCQ cho TLN · (d) soát LaTeX câu script nghi lỗi.
3. Dạng của họ **thô hơn BK** (vd 1 dạng "Tính GTLG góc 0–180°" 124 câu ↔ BK 7 dạng) ⇒ vai trò = **thu hẹp ứng viên**, không map 1-1.

**⚠️ Chặn trước:** bản đồ BK khối 10 mới có 24 dạng / 5 chuyên đề (tới GTLG). **Chưa có dạng** cho Hệ thức lượng trong tam giác ·
Véc tơ · Hàm số ⇒ **~339/1182 câu (29%) không có dạng BK để rơi vào**. Canonical phải đi trước measurement (§5 CLAUDE.md).

---

## 5. Cửa DUYỆT ĐỀ (ERP — màn mới, đối xứng "Duyệt câu")

- Hiện cả đề đúng bố cục giấy, cạnh mỗi câu: dạng đã gán · đáp án · (Phần III) 4 phương án MCQ + rule của từng distractor.
- Sửa tại chỗ: đổi dạng, sửa đáp án, sửa/loại 1 phương án MCQ, gỡ câu khỏi đề.
- Nút **"Duyệt đề"** = 1 RPC transactional `fn_de_thi_duyet(de_id)`: set `duyet_at/duyet_boi` trên đề **+** `da_duyet=true`
  cho mọi câu mới của đề **+** mọi form_tn của đề. Câu cũ đã duyệt: không đụng.
- Sau mutation **vá tại chỗ**, không reload list (§2 React).
- Sửa câu con ⇒ bump `tai_lieu.updated_at` (§2).

---

## 6. Luồng THI

### 6.1 Snapshot — chuyển xuống Postgres
Hiện `phatHanhTest` snapshot **ở client** (TS). HS tự luyện thì client HS không được đọc kho/key ⇒ **bắt buộc RPC**.
Làm 1 hàm dùng chung cho cả 2 kiểu: **`fn_de_thi_mo(p_de, p_lop, p_ngay, p_hs default null)`** (security definer, tính + ghi
cùng transaction), bên trong gọi `_kho_snapshot_cau` sẵn có (đã tự hiện form_tn thành 4 đáp án) theo nhánh từng câu.
Khác `phatHanhTest` hiện tại: **`diem` lấy từ phần/câu**, không ghi cứng 1.

### 6.2 (a) Thi trên lớp — GV/OPS giao
- `bai_test.loai='de_thi'`, `lop_id` + `ngay` do người giao chọn, `khoa_reveal=true`, **1 lượt/HS**, deadline staff đặt.
- Mastery: **như ET** (code hiện tại đã đúng — `de_thi` ∈ nhóm thi).

### 6.3 (b) Tự luyện ở nhà — thư viện đề
- Loại MỚI **`bai_test.loai='de_thi_luyen'`** (+ migration nới CHECK `bai_test_loai_check` — §2.1), `hoc_sinh_id` = HS, theo mẫu `tu_luyen`.
- HS thấy đề **đã duyệt + sẵn sàng** của khối + môn mình. Thi lại được (mỗi lần 1 `bai_test` mới).
- **KHÔNG vào mastery**: `fn_mastery_cells*` đang có nhánh `else 'btvn'` ⇒ loại lạ sẽ **lọt vào** khi `p_include_btvn=true`.
  Phải **loại tường minh** `de_thi_luyen` trong các hàm mastery/Elo/xếp hạng. *(Khi CEO mở lại quyết định #3 thì chỉ sửa 1 chỗ này.)*
- Nộp xong xem đáp án + lời giải ngay (tự luyện thì không có GV để mở khoá).

### 6.4 Đồng hồ (mới)
- Thêm `bai_test.thoi_gian_phut` (snapshot từ đề lúc mở). Hết giờ của 1 HS = `bai_lam.bat_dau_at + thoi_gian_phut` — **suy, không job**
  (đúng tinh thần `daHetHan`). Client hiện đếm ngược + tự gọi nộp; **server là trọng tài**: RPC nộp/ghi đáp án từ chối sau hạn + ân hạn ngắn.

### 6.5 Chấm điểm — ở Postgres
- `fn_de_thi_diem(bai_lam_id)`: thang 10, Phần I/III(MCQ) = đúng × điểm câu; Phần II = bậc thang Bộ (0.1/0.25/0.5/1 theo số ý đúng).
- Bảng bậc thang hiện nằm ở JS (`DUNGSAI_DIEM_4Y`) ⇒ **chuyển nguồn công thức về SQL**, JS chỉ hiển thị (§2.0: 1 công thức 1 nơi).
- Màn kết quả: điểm tổng + điểm theo phần + theo dạng (câu trống dạng gom nhóm "chưa gán dạng").

---

## 7. Lộ trình cắt lát

| Pha | Nội dung | Xong khi |
|---|---|---|
| **P1 — Nhập** | Migration (cột duyệt đề, `tai_lieu_cau.diem`, trigger chặn xoá cứng) · `/nhap-de-thi` v2 ghi vào đường A · dò trùng · sinh form MCQ Phần III | Nhập 1 đề TN THPT thật: câu nằm đúng dạng trong kho, đề in ra đúng bố cục |
| **P2 — Duyệt** | Màn Duyệt đề + `fn_de_thi_duyet` + `fn_de_thi_thieu` | CEO duyệt 1 đề end-to-end, thấy danh sách thiếu |
| **P3 — Thi trên lớp** | `fn_de_thi_mo` · điểm theo phần · đồng hồ · `fn_de_thi_diem` | 1 lớp 12 thi 1 đề trên app, điểm khớp chấm tay |
| **P4 — Thư viện đề** | `de_thi_luyen` · màn HS (card Kiểu 2 ở Home → danh sách đề) · loại khỏi mastery | HS tự thi ở nhà, mastery không đổi (verify bằng query trước/sau) |
| Sau | Xếp hạng · trộn mã đề · đề tự luận (chỉ in) · môn khác · DROP `toan_de_thi*` (theo Luật xoá) | — |

---

## 8. Rủi ro & câu còn mở

1. **Nút cổ chai = form MCQ cho Phần III.** Khối 12: Hình GT 0/261 câu TLN có form, Đại 84/328. Mỗi đề Bộ có 6 câu TLN ⇒
   đề nào cũng phải sinh form mới; dạng MƠ HỒ sẽ **treo cả đề** (vì không nhánh lùi). *CEO cần biết trước: tốc độ mở đề
   trên app phụ thuộc tốc độ duyệt form, không phụ thuộc tốc độ nhập.*
2. **MCQ hoá TLN làm câu DỄ hơn đề thật** (đoán 25%, dò ngược đáp án). Điểm thi app ≠ điểm dự báo thi thật ở Phần III.
   Chấp nhận cho đợt đầu; ghi chú trên màn kết quả.
3. **Dò trùng gần-giống** tốn công CEO ở bước 6 nếu kho có nhiều câu na ná. Đo sau 5 đề đầu rồi mới tinh chỉnh ngưỡng.
4. `toan_de_thi` "0 dòng" là số đọc qua CLI — trước khi ngừng dùng, đối chiếu dashboard 1 lần (§2.1).
5. **Còn mở (đích, chờ CEO):** thi trên lớp có cần **giám sát chống rời tab** không? · HS khối 11 có được thấy đề 12 trong thư viện không?
6. **Đã đóng 22/09:** bản đồ trước · tự luận→TLN (chỉ ý có đáp số) · điểm theo khuôn Bộ quy về 10 · 90 phút mặc định (§1b).

---

## 9. Thiết kế BUILD P2 + P3 (27/09 — bám hạ tầng thật, đã đo)

### 9.0 Đo hạ tầng trước khi thiết kế (27/09)

| Đo được | Hệ quả |
|---|---|
| Chế độ THI đã có: `et_de` (trả đề KHÔNG key) + `et_nop` (chấm server, chỉ lần nộp đầu) + màn HS `LamET`; cả 2 hàm đã nhận `loai='de_thi'` | **Không xây luồng thi mới** — mở rộng cái đang chạy cho ET |
| ⚠️ RLS `bai_test_cau_hs_read` (mig 202609030307) **rơi mất `de_thi`** khỏi danh sách loại trừ ⇒ HS SELECT thẳng được `dap_an_key` + `loi_giai` của đề thi | Vá NGAY trong mig P2/P3 (lỗ bảo mật, hồi quy từ 03/09) |
| `bai_test.khoa_reveal` là cột chết — không hàm/policy/UI nào đọc | `et_nop` phải đọc nó |
| Không có đồng hồ; `bai_lam.bat_dau_at` có sẵn nhưng không ai dùng | Hạn cá nhân = `bat_dau_at + thoi_gian_phut`, server chặn |
| `diem` câu cứng = 1 (cả client lẫn `_kho_snapshot_cau`); không có hàm tổng điểm | Điểm theo phần + hàm điểm ở SQL |
| HS ghi thẳng được `verdict/diem` vào `bai_lam_cau` qua PostgREST, và sửa `dap_an_hs` sau khi đã nộp | Trigger chặn cho các loại THI |
| App HS: ô "Làm đề thi thử" đang `sapCo`, không lọc `loai` ⇒ đề thi đã phát hành **HS không thấy** | Mở ô cho cấp 3 |
| ERP đã có quy ước ĐS trong đề thi: chọn 1 chuyên đề, stamp dạng đại diện vào cả 4 mệnh đề (`DungSaiBoc`) | Duyệt đề dùng lại đúng quy ước này |

### 9.1 Dữ liệu (1 migration)

| Thay đổi | Vì sao |
|---|---|
| `tai_lieu.duyet_at`, `tai_lieu.duyet_boi` (NULL = không áp dụng cho loại khác / đề chưa có dấu duyệt) + bảng `tai_lieu_duyet_log` do **trigger** ghi | §4 CLAUDE.md: đổi state phải có vết do DB tự ghi |
| `tai_lieu_phan.diem_moi_cau numeric null`, `tai_lieu_cau.diem numeric null` — ghi đè khuôn Bộ khi đề lệch | NULL = theo khuôn Bộ theo **loại câu gốc**: TN 0,25 · ĐS 1 · TLN 0,5 (TLN chuyển MCQ vẫn 0,5 — giữ vị trí + giữ điểm) |
| `bai_test.thoi_gian_phut int null` (NULL = không giới hạn) | Đồng hồ |
| `bai_test_cau.phan text null` (tiêu đề phần; NULL = test không chia phần) | App HS hiện "Phần I/II/III" |

### 9.2 Hàm Postgres (nguồn công thức DUY NHẤT — §2.0)

| Hàm | Việc |
|---|---|
| `fn_de_thi_cau(de)` | Danh sách câu của đề theo thứ tự phần→câu, **resolve kho từng câu** (`nhanhByCau` → `tai_lieu.nhanh` → môn), điểm hiệu lực. MỌI hàm dưới đọc qua đây — 1 chỗ resolve |
| `fn_de_thi_thieu(de)` | Invariant "đề sẵn sàng" — trả từng câu thiếu gì. **Chặn:** dạng chờ · thiếu đáp án · mệnh đề thiếu Đ/S · mệnh đề dạng chờ · TLN chưa có phương án MCQ · câu đã vào kho rác. **Không chặn:** tự luận (chỉ in, app bỏ qua) |
| `fn_de_thi_duyet(de)` | 1 cửa: `thieu` rỗng ⇒ trong 1 transaction duyệt mọi câu + mệnh đề + form MCQ của đề, đóng dấu `tai_lieu.duyet_at` |
| `fn_de_thi_mo(de, lop, ngay, phut, khoa)` | Phát hành: bắt buộc đã duyệt; tạo `bai_test` + snapshot từng câu qua `_kho_snapshot_cau` (TLN tự hiện thành 4 phương án), gắn điểm + phần. Thay `phatHanhTest` client cho đề thi (tính+ghi cùng transaction) |
| `_et_cham(bai_lam)` | Tách vòng chấm của `et_nop` ra (logic giữ nguyên byte-for-byte) để staff "thu bài" dùng chung |
| `et_nop` (sửa) | Chấm như cũ; **nếu `khoa_reveal` ⇒ không trả key/lời giải/đúng-sai**, chỉ trả cờ khoá |
| `fn_de_thi_thu_bai(bai_test)` | Staff thu bài: bài đang làm ⇒ nộp + chấm (HS tắt app giữa chừng vẫn có điểm) |
| `fn_de_thi_ket_qua(bai_test)` | Staff: từng HS trong lớp — chưa làm / đang làm / đã nộp · điểm thang 10 · điểm từng phần |
| `fn_de_thi_diem_cua_toi(bai_test)` | HS: điểm của mình — chỉ khi đã nộp **và** đáp án đã mở |
| Trigger `bai_lam` / `bai_lam_cau` | Khi client ghi thẳng (role `authenticated`) vào bài loại THI: cấm ghi sau khi nộp · cấm tự ghi `verdict/diem` · cấm ghi quá `bat_dau_at + phut + 2'` · cấm sửa `bat_dau_at/bien_the/trang_thai` (nộp phải qua `et_nop`) |

Điểm thang 10 = `Σ điểm đạt / Σ điểm tối đa × 10` (đề lệch khuôn vẫn quy đúng về 10). ĐS bậc thang 0 · 0,1 · 0,25 · 0,5 · 1 giữ nguyên như `et_nop` đang chấm.

### 9.3 Màn staff (ERP — trong `DeThiEditor`)

1. **Duyệt đề** — đề hiện nguyên bố cục giấy; mỗi câu sửa tại chỗ, lưu ngay, **vá tại chỗ không tải lại danh sách**:
   - Dạng: chọn trong bản đồ đúng kho + khối của câu. ĐS: 1 lựa chọn chuyên đề/dạng cho cả câu, stamp vào 4 mệnh đề (quy ước `DungSaiBoc`).
   - TN: bấm A/B/C/D để đặt đáp án. ĐS: Đ/S từng ý. TLN: ô đáp số.
   - TLN → MCQ: 4 phương án, đáp án đúng = đáp số (khoá); **3 phương án nhiễu máy gợi ý rẻ** (đổi dấu, ×2, lệch ±1…), người duyệt sửa/xác nhận ⇒ lưu `<kho>_cau_form_tn` (`nguon='nguoi'`).
   - Thanh trên: "còn N câu thiếu" (đọc `fn_de_thi_thieu`) · nút **Duyệt đề** chỉ tắt khi còn thiếu dữ liệu.
2. **Phát hành online** — lớp · ngày · thời gian (mặc định meta hoặc 90') · "Khoá đáp án tới khi mở" (mặc định bật). Chưa duyệt ⇒ nói rõ lý do, không cho phát hành.
3. **Các lượt thi** — mỗi lượt: bảng kết quả (tên HS, trạng thái, điểm /10, điểm từng phần) · **Thu bài** · **Mở đáp án**.

### 9.4 App HS

- Cấp 3: ô **"Làm đề thi thử"** mở ra, liệt kê `loai='de_thi'` (dùng chung khung danh sách của ET/BTVN).
- `LamET` khi `loai='de_thi'`: **giữ thứ tự câu + thứ tự ý Đ/S của đề gốc** (không xáo), tiêu đề phần, **ẩn nút 💡 Gợi ý** (đang thi), **đồng hồ đếm ngược** từ `bat_dau_at + thoi_gian_phut` — hết giờ tự nộp; đã nộp mà đáp án còn khoá ⇒ màn "Đã nộp — chờ thầy/cô mở đáp án"; mở rồi ⇒ điểm /10 + từng câu như ET.

### 9.5 Quyết định CTO trong §9 (đổi được, nói nếu lệch ý)

1. Đáp án đang khoá thì **ẩn cả đúng/sai lẫn điểm**, không chỉ ẩn lời giải — tránh HS nộp trước báo đáp án cho bạn còn đang làm.
2. Phương án nhiễu cho TLN: máy gợi ý kiểu **số gần đúng**, không phải "theo lỗi" như `spec-mcq-form.md` — người duyệt là lớp chặn. Muốn nhiễu theo lỗi thì là việc riêng của pipeline MCQ.
3. Ân hạn **2 phút** sau hết giờ cho lưu đáp án (mạng chậm), rồi server khoá.
4. Thang điểm cố định 10 (đúng khuôn Bộ).

---

## 10. CHỐT 01/10 — tính năng NHẬP ĐỀ hoàn chỉnh: Claude xử lý, ERP duyệt hàng loạt + sử dụng

> CEO 01/10: *"cần ngay nghiệp vụ chuyển 1 đề thi PDF thành 1 đề thi trên ERP, câu bóc ra và gán vào kho"* · *"cần 1 tính năng hoàn chỉnh chứ không
> phải chỉ cần m đọc — 1 luồng đầy đủ với UI để sau này tái sử dụng"* · *"m là công cụ xử lý chính, nhưng phải có công cụ UI để duyệt hàng loạt
> và sử dụng"* · *"không phải việc chạy số lượng quá lớn; ngoài bóc đề còn phải phân tích, gán dạng nữa"* · *"phân ra các bước để xây riêng,
> không chồng lên nhau; bản đồ kiến thức t vẫn tự làm được, sau này mới cần m"*.

### 10.1 Phân vai (giữ quyết định #8 ngày 20/09, làm rõ thêm)

| Vai | Ai | Việc |
|---|---|---|
| **Xử lý** | **Claude** (Claude Code trên máy công ty, lệnh `/nhap-de-thi`) | Đọc file → bóc câu / phần / thứ tự / hình / đáp án → **phân tích + gán dạng** (chắc thì gán, không chắc ⇒ dạng chờ) → ghi vào ERP ở trạng thái **chưa duyệt** |
| **Duyệt** | Người (CEO + học thuật) trên **ERP** | Hàng đợi đề chờ duyệt → rà từng đề đối chiếu bản gốc → sửa tại chỗ → **Duyệt đề** (1 nút duyệt cả đề) |
| **Sử dụng** | Người trên ERP / HS trên app | In · phát hành cho lớp · thi · xem kết quả (đã build 27/09) |

KHÔNG dùng Gemini-trong-trình-duyệt làm đường chính (màn `NhapDeThiWizard` cũ giữ nguyên, không phát triển tiếp; gỡ hay không hỏi sau — Luật xoá).
Số lượng không lớn ⇒ chạy **có người ngồi cùng** là đủ; chưa cần hàng đợi tự động / cron.

### 10.2 Phạm vi bản đầu (CEO 01/10)

- Đề **khuôn Bộ 3 phần** (TN + Đúng/Sai + Trả lời ngắn), khối 10–12, có hoặc không có lời giải. Đề tự luận / lớp dưới: lát sau.
- Người dùng màn duyệt: **CEO + học thuật** (vài người quen việc) ⇒ ưu tiên nhanh, đủ thông tin; không cần hướng dẫn từng bước.
- **Dạng:** Claude đề xuất lúc nhập (ghi `dang_chinh` + `dang_ai_de_xuat`), **người chốt ở màn Duyệt đề**. Bản đồ do CEO tự xây; dạng chưa có ⇒ dạng chờ, đề vẫn vào.
- **Đáp án:** lấy từ file (gạch chân / "Chọn X" / "a) Đúng." / bảng đáp án / file đáp án riêng). Hai dấu hiệu lệch nhau ⇒ nêu cờ cho người duyệt
  (đo 28/09: 4/253 câu file gốc tự mâu thuẫn, gạch chân đúng — `scripts/kho/mathtype-thu/README.md`). File không có đáp án ⇒ để trống, người đánh. **Không tự giải.**
- **Hình:** lấy ảnh từ file gốc (Word: ảnh nhúng; PDF: cắt trang). Vẽ lại để sau.

### 10.3 Luồng

```
Thả file vào  E:\BK ACADEMY\Tài liệu Claude nhập kho\DE_THI\L<khối>\      (đề .pdf / .docx; có cả 2 thì Word là nguồn chữ, PDF là bản đối chiếu)
   └─► /nhap-de-thi <khối>   (Claude)
        1. Đọc: Word ⇒ bộ đọc thẳng `scripts/kho/mathtype-thu` (công thức chính xác, đáp án gạch chân) · chỉ có PDF ⇒ Claude đọc ảnh trang
        2. Dựng cấu trúc: meta · phần · câu (ĐỀ và LỜI GIẢI lặp lại ⇒ ghép theo phần + số câu, so nội dung làm nhân chứng) · mệnh đề Đ/S · hình
        3. Kiểm máy: đủ số câu theo khuôn · TN đủ 4 phương án · mỗi câu ≤1 đáp án · đáp án 2 nguồn có khớp · công thức render được
        4. Gán dạng (kho Đại / Hình giải tích theo từng câu), không chắc ⇒ dạng chờ
        5. In TÓM TẮT 1 trang cho người ngồi cùng (số câu/phần · câu trùng trỏ về đâu · câu nghi · câu dạng chờ) ⇒ gật thì ghi
        6. Ghi 1 transaction: câu → kho (`da_duyet=false`, `nguon='de_thi'`) · `tai_lieu` + `tai_lieu_phan` + `tai_lieu_cau` · PDF gốc lên storage
           (`tai_lieu.file_url`) · `nhap_kho_log` (sha256 ⇒ chạy lại không nhân đôi) · dời file sang `DaXuLy/`
   └─► ERP · Hàng đợi "Đề chờ duyệt"  ─►  Duyệt đề (đối chiếu bản gốc, sửa, 1 nút duyệt)  ─►  In / Phát hành / Thi
```

### 10.4 Việc phải làm — tách LÁT, lát nào xong dùng được lát đó

| Lát | Claude (xử lý) | ERP (UI) | Xong khi |
|---|---|---|---|
| **A. Nhập 1 đề** | `/nhap-de-thi` v2: ghi đường A (hiện còn ghi `toan_de_thi` đã ngừng); nguồn Word qua bộ đọc thẳng; ghép ĐỀ ↔ LỜI GIẢI; kiểm máy; tóm tắt; ghi + log | — (dùng màn có sẵn để xem) | `DE SO 3` (NBV, 12-CD23) hiện đủ 22 câu đúng bố cục trong Kho tài liệu, mở Duyệt đề được |
| **B. Duyệt hàng loạt** | — | **Hàng đợi "Đề chờ duyệt"**: bảng đề (tên · khối · số câu · còn thiếu gì từ `fn_de_thi_thieu` · ngày nhập), lọc, mở đề, quay lại đúng chỗ. **Duyệt đề** bổ sung: bản gốc cạnh bên · dạng Claude đề xuất hiện sẵn · cờ "đáp án 2 nguồn lệch" | CEO duyệt xong 1 đề thật từ hàng đợi; 345 đề cũ cũng hiện trong hàng đợi |
| **C. Sử dụng** | — | Bấm thử thật: in · phát hành cho 1 lớp · HS thi · kết quả (đã build 27/09, chưa ai dùng) — sửa lỗi lộ ra | 1 lớp thi 1 đề, điểm khớp chấm tay |
| **D. Đề chỉ có PDF** | Đường đọc ảnh trang cho đề không có Word (2 lượt: lập mục lục câu ↔ trang, rồi đọc từng câu) + cắt hình | — | 1 đề PDF scan của Sở vào được như lát A |
| Sau | Tự động hoá (chạy nền, kiểm độc lập, gợi ý dạng theo hồ sơ dạng — `spec-luong-kho.md`) · tải file ngay trên ERP · đề tự luận / lớp dưới | | |

Lát A–C không phụ thuộc bản đồ kiến thức, không phụ thuộc skill gán dạng / gán mẫu (đã GÁC 01/10).

### 10.5 Chốt thêm 01/10 (vòng 2) — nơi lưu + cách dùng đề

| # | Quyết định CEO | Hệ quả |
|---|---|---|
| K1 | **Màn riêng "Kho đề thi"**, 3 tab: **Chờ duyệt** (đề vừa nhập, còn thiếu gì → mở Duyệt đề) · **Sẵn sàng** (đã duyệt: xem · in · Giao) · **Đã giao** (từng lượt: lớp · ngày · chế độ · số em nộp → kết quả · thu bài · mở đáp án) | Kho tài liệu vẫn liệt kê đề như cũ; Kho đề thi là chỗ làm việc chính |
| K2 | Câu của đề **duyệt 1 cửa = Duyệt đề** (duyệt đề ⇒ mọi câu của đề `da_duyet`). Vẫn hiện ở màn Duyệt câu của kho cho ai duyệt lẻ | Hàng đợi theo ĐỀ, không theo câu (đang có 5.655 câu Đại + 719 câu HGT nguồn đề thi chưa duyệt) |
| K3 | **1 đề, 3 cách giao** — chọn lúc bấm Giao: **Kiểm tra** (đồng hồ, khoá đáp án tới khi GV mở, ẩn gợi ý, mastery như ET, HS thấy ở "Làm đề thi thử") · **Luyện tập trên lớp** (không đồng hồ, đáp án hiện sau khi nộp, có gợi ý, mastery như bài trên lớp) · **BTVN** (hạn nộp, đáp án sau khi nộp, mastery như BTVN, HS thấy ở ô BTVN) | KHÔNG thêm loại bài: map sang `bai_test.loai` sẵn có `de_thi` / `giao_trinh` / `btvn` ⇒ app HS, chấm, mastery không viết lại. Kiểm tra đã build 27/09; 2 chế độ kia = thêm lựa chọn ở `fn_de_thi_mo` |
| K4 | Bản đầu **chỉ giao CẢ ĐỀ**. Dùng câu lẻ ⇒ nhặt từ kho qua Làm tài liệu như mọi câu | |
| K5 | **Trả lời ngắn GIỮ FORM ĐỀ GỐC: 4 ô, chỉ điền số / ký tự / dấu — đúng luật phiếu trả lời thi THPT** (CEO: "đọc kĩ luật thi thpt") | **Thay quyết định #2 (20/09) và §3.4 cho ĐỀ THI:** Phần III không đổi sang MCQ nữa ⇒ gỡ nút cổ chai §8.1 (đề không còn phải chờ sinh form MCQ); `fn_de_thi_thieu` bỏ điều kiện "TLN chưa có phương án MCQ". Phải đọc quy định phiếu TLTN của Bộ trước khi làm ô nhập + luật so đáp án (lát C). Luật "bổ trợ chỉ MCQ" (19/09) KHÔNG đổi — đó là luồng khác |

Thứ tự lát sau khi chốt: **A** nhập `DE SO 3` → **B** màn Kho đề thi (tab Chờ duyệt + Duyệt đề) → **C** nút Giao 3 chế độ + ô TLN 4 ô + tab Đã giao → **D** đề chỉ có PDF.
| K6 | **Đề LUÔN dùng được kể cả khi chưa gán đủ dạng — chỉ CẢNH BÁO, không chặn.** Câu chưa có dạng vẫn lưu kết quả làm bài; sau này gán dạng thì **mastery của HS cập nhật theo** (CEO 01/10) | (a) `fn_de_thi_thieu`: "dạng chờ" / "mệnh đề dạng chờ" chuyển từ CHẶN sang CẢNH BÁO; chỉ còn chặn thứ làm bài không chấm được (thiếu đáp án, câu đã vào kho rác). (b) Hiện DB **chặn `da_duyet` khi câu còn dạng chờ** (`trg_chan_duyet_dang_cho`) ⇒ "Duyệt đề" và "Giao" phải tách khỏi việc duyệt DẠNG: duyệt đề = xác nhận nội dung + đáp án; câu dạng chờ vẫn giao được, chưa vào `kho_chuan` cho tới khi có dạng. (c) Mastery phải lấy dạng theo **`ma_cau` → dạng HIỆN TẠI của câu trong kho**, không theo `ma_dang` chụp lúc phát hành ⇒ gán dạng sau là kết quả cũ tự rơi vào đúng ô (HS × dạng), không cần chạy lại. Thiết kế chi tiết ở lát C — phải đo `bai_test_cau.ma_dang` đang được dùng ở những hàm mastery nào trước khi sửa |

### 10.6 Chốt 01/10 (vòng 3) — Kho đề thi nằm ở "Nhập kho › Đề thi", THAY đường cũ · ĐÃ BUILD lát B

> **⭐ 09/10 (Thùy): "Đề thi cần có riêng 1 lá, tên là Kho đề thi, ở dưới Kho tài liệu."** ⇒ lá `khodethi` (Học thuật, ngay dưới Kho tài liệu)
> mở thẳng `KhoDeThi.tsx`; tab 📝 Đề thi trong Nhập kho đã gỡ. Quyền: lá riêng ở Phân quyền; mig `202610091655` cấp `khodethi` cho mọi vai trò
> đang có `nhapkho` (cùng mức chỉ-xem) để không ai mất màn đang dùng.

CEO: *"Tính năng này giống 'Nhập kho từ tài liệu — Chuyên đề và Đề thi'. Đọc 2 cái giống khác nhau thế nào để tối ưu rồi thay thế. Kết quả t muốn đề
lưu ở đây và sửa ở đây là chính. Ra Kho tài liệu chỉ để in thôi."* · *"Xoá luôn [nút Nhập đề thi từ PDF]. T định bỏ luồng nhập thẳng PDF ở đấy mà đưa
vào folder chỉ định và Claude chạy. Claude vẫn gọi Gemini để OCR nhưng Claude có kiểm tra lại, thay vì ở ERP lỗi là lỗi luôn."*

| So sánh | Tab cũ "Nhập đề thi" (Gemini trong trình duyệt) | Luồng mới |
|---|---|---|
| Máy đọc | Gemini từng trang, trong tab; lỗi bịa câu khi lời giải tràn trang, cắt hình sai, mất đáp án | Claude ở máy công ty: Word đọc thẳng; PDF = Gemini OCR + Claude kiểm lại (lát D) |
| Người rà | TRƯỚC khi lưu, trạng thái nằm trong tab (đóng là mất) | SAU khi lưu: đề đã ở ERP, chưa duyệt; bỏ dở quay lại được |
| Câu chưa có dạng | bị BỎ khỏi đề | vào dạng chờ, đề đủ câu |
| Đúng/Sai | 1 chuyên đề cho cả câu, đóng cùng 1 dạng vào 4 ý | mỗi mệnh đề 1 dạng |
| Sửa đề | 3 nơi (danh sách thẻ · màn sửa 1 dòng/câu · màn Duyệt không sửa được nội dung) | 1 màn |

| Quyết định | Đã làm (01/10) |
|---|---|
| **Kho đề thi = tab "Đề thi" của màn Nhập kho** — nơi lưu + sửa chính | `KhoDeThi.tsx`: 3 tab Chờ duyệt / Sẵn sàng / Đã giao (đếm + danh sách ở `fn_de_thi_dem` / `fn_de_thi_ds`), lọc khối, tìm tên, cột tình trạng (thiếu đáp án · chưa đủ dạng · ghi chú lúc nhập), nhớ vị trí khi quay lại |
| **Gộp Sửa đề + Duyệt đề thành MỘT màn** | `DeThiSoan`: bố cục giấy; sửa tại chỗ nội dung / phương án / đáp án / lời giải / hình (dùng lại `CauEditor` của kho) · dạng của câu · **dạng từng mệnh đề Đ/S** · ghi chú của máy lúc nhập (`cau_hinh.deThi.canhBaoCau`) · đề gốc PDF cạnh bên · ↑ ↓ đổi thứ tự · ✕ bỏ câu · thêm câu có sẵn trong kho · thêm/xoá phần · thông tin đề · Duyệt · Giao · In · các lượt đã giao |
| **Xoá đường nhập PDF bằng Gemini trong ERP** | Gỡ `NhapDeThiWizard`, `BocCauModal`, `bocDeTuFile`, `DungSaiBoc`, màn sửa cũ (DeThiScreen.tsx 799 → 9 dòng) và `DuyetDeView`/`TLNDuyet` (đã gộp). Giữ prompt/schema bóc đề ở `lib/kho/api.ts` (script test còn dùng; lát D có thể dùng lại) |
| **Kho tài liệu chỉ để in đề** | Dòng đề thi chỉ còn In / In nhanh / Copy link; bỏ Sửa · Nhân bản · Xoá |
| **K5 + K6 vào luật DB** (mig `202610011501`) | `fn_de_thi_thieu`: chưa có dạng = cảnh báo, bỏ điều kiện "TLN chưa có 4 phương án"; `fn_de_thi_duyet`: câu/ý còn dạng chờ không đóng dấu `da_duyet` nhưng không làm hỏng việc duyệt đề. TLN trên màn = ô đáp số + kiểm "tô được trên phiếu 4 ô" |
| Tab Nhập chuyên đề | Để nguyên, thay theo cùng khuôn sau |

Còn lại: **C** — Giao 3 chế độ (kiểm tra / luyện tập / BTVN), ô trả lời ngắn 4 ô trên app HS + luật so đáp số, mastery lấy dạng theo `ma_cau` (K6c) ·
**D** — đề chỉ có PDF (Gemini OCR + Claude kiểm) · xoá đề trong Kho đề thi (chưa có nút; theo Luật xoá) · soạn câu MỚI bằng tay ngay trong đề.

### 10.7 Lát C — GÁN đề vào buổi của lớp (CEO 01/10, vòng 4) · ĐÃ BUILD

CEO: *"Cần có chức năng gán giống tài liệu. Mỗi lớp có 3 loại tài liệu: Giáo trình, ET, BTVN. Khi gán đề thi kiểu này thì nó sẽ là giáo trình
hoặc BTVN. Phải khớp với hệ thống hiện tại."* ⇒ K3 đổi cách hiện thực: "luyện tập trên lớp" và "BTVN" KHÔNG phải hai chế độ riêng của đề,
mà là **đề được gán thành tài liệu của buổi** — đúng hai loại tài liệu lớp vốn có.

| Bấm 📱 Giao, chọn | Chuyện gì xảy ra | Sau đó đi đường nào |
|---|---|---|
| **📘 Bài trên lớp** | `fn_de_thi_gan(đề, lớp, ngày, 'giao_trinh_buoi')` đẻ 1 tài liệu **Giáo trình buổi** bám (lớp + ngày) | Y như giáo trình trích xuất: Kho tài liệu · in phiếu (`PrintView`) · 📱 mở app (`phatHanhTest` → `bai_test.loai='giao_trinh'`) · xem live · chuông báo yếu |
| **📝 BTVN** | như trên, loại `'btvn'` | Y như BTVN của buổi: in phiếu có tên HS · chấm BTVN buổi sau · hạn nộp `han_nop_bai_test` · mở app (`loai='btvn'`) |
| **⏱ Kiểm tra** | `fn_de_thi_mo` — lượt thi tính giờ, giấu đáp án (không tạo tài liệu của buổi) | "Làm đề thi thử" trên app · bảng kết quả từng lượt |

- **Khuôn tài liệu gán** (để mọi chỗ đang đọc Giáo trình/BTVN đọc được ngay, không dạy lại): mốc `buoi` (tiêu đề = tên đề, số buổi của lớp do
  `renumberBuoiLop` đánh) + **mỗi PHẦN của đề = một phần** `dang` (bài trên lớp) / `btvn` (về nhà), `ref_ma` TRỐNG (phần của đề không trỏ một
  dạng — dạng nằm ở từng câu), `nguon_id` = đề, `cau_hinh` chép từ đề (`nhanhByCau`, `deThi`) + `etFormByCau[câu trả lời ngắn]='tra_loi_ngan'`.
  Chỗ phải dạy thêm chỉ có 3: đầu card bản in lấy tên phần khi không có mã dạng · chuông "báo yếu" lấy dạng theo câu · Kho tài liệu không mở
  builder theo-dạng cho tài liệu gán từ đề (sửa ở Kho đề thi rồi gán lại).
- **Bản gán là BẢN CHÉP** (như MT gán buổi, như trích xuất giáo trình): sửa đề sau đó không đổi bản đã gán. 1 buổi chỉ 1 Giáo trình + 1 BTVN
  (`uq_tai_lieu_van_hanh`) ⇒ buổi đã có thì hàm TỪ CHỐI và nêu tên bản đang có — không tự thay.
- **Điều kiện gán / mở kiểm tra:** đề đã duyệt + không còn câu thiếu đáp án. Lớp phải CÙNG MÔN với đề (§1.6). Câu chưa có dạng không cản (K6).
- **K5 trên app:** cột `bai_test_cau.kieu_nhap='phieu_4o'` cho câu trả lời ngắn có đáp số tô được trên phiếu (`_de_thi_hop_le_4o`); app HS hiện
  4 ô + bàn phím riêng (0–9, −, phẩy) ở cả chế độ làm-chấm-ngay lẫn chế độ thi. `fn_de_thi_mo` thôi đổi trả lời ngắn sang 4 phương án, thôi chặn.
  Chấm chế độ thi so thêm theo `fn_tln_normalize` (23,9 = 23.9).
- **K6 trên phép đo:** câu còn dạng chờ ⇒ `bai_test_cau.ma_dang` để TRỐNG (không áp dụng — không tính cho dạng nào, không phải điểm 0; dạng chờ
  mà lọt vào mastery sẽ thành một "dạng yếu" giả, kéo cả bổ trợ). Gán dạng thật cho câu ⇒ trigger `trg_de_thi_dien_dang` điền vào mọi bài đã
  phát hành từ đề ⇒ mastery (suy động) tự có thêm lần đo. Chỉ điền chỗ trống, không đổi dạng đã có.
- **Bài trên lớp từ đề mở sẵn CẢ ĐỀ** trên app (giáo trình thường mở từng dạng theo nhịp dạy; đề luyện là làm cả đề) — GV vẫn đóng/mở lẻ từng câu
  ở màn live như cũ.
- **Kho đề thi:** tab "Đã giao" + cột "đã giao" tính cả buổi đã gán; màn đề có bảng **"Đã gán vào buổi của lớp"** (lớp · ngày · loại · đã mở app
  chưa · mấy em đã làm · 🖨 In phiếu · 📱 Mở trên app).
- Một hàm cho việc "hoàn thiện bài test phát hành từ đề": `fn_de_thi_hoan_thien_bai_test` (ô 4 ký tự · bỏ dạng chờ khỏi phép đo · tên phần ·
  mở sẵn câu) — lượt thi gọi trong `fn_de_thi_mo`, tài liệu gán gọi sau `phatHanhTest`.

Chưa làm / biết trước: mastery theo TỪNG MỆNH ĐỀ của câu Đúng/Sai (hiện câu Đ/S tính cho dạng của câu, đúng một phần = 0,5) · đổi ngày / xoá bản
gán ngay trong Kho đề thi (đang làm ở Kho tài liệu) · gán một PHẦN của đề (K4: bản đầu chỉ cả đề).

### 10.8 Lát D — đề CHỈ CÓ PDF: Gemini gõ, Claude kiểm (CEO 01/10) · ĐÃ BUILD script, đã đo trên 1 đề

CEO: *"Đưa vào folder chỉ định và Claude chạy. Claude vẫn gọi Gemini để OCR nhưng Claude có kiểm tra lại, thay vì ở ERP lỗi là lỗi luôn."*

`node scripts/kho/de-thi/boc-pdf.mjs "<file.pdf>" --ra <work> --khoi 12` → `de.json` CÙNG KHUÔN bản Word ⇒ từ đó đi tiếp y hệt lát A
(`quyet.mjs` → `ghi.mjs` chạy thử → `--ghi` → Kho đề thi tab Chờ duyệt). Thư mục thả đề: `…\Tài liệu Claude nhập kho\DE_THI\L<khối>\`.

| Lượt | Đầu vào | Việc | Vì sao tách riêng |
|---|---|---|---|
| 1 BÓC | cả file PDF | chép từng câu: đề, phương án / mệnh đề, đáp án NẾU file thể hiện, lời giải | — |
| 2 MỤC LỤC | cả file PDF | chỉ đếm: phần, số câu, trang, đáp án theo 2 nguồn (đánh dấu · chữ lời giải) | nhân chứng độc lập về SỐ CÂU + ĐÁP ÁN |
| 3a HÌNH | ảnh từng trang 150 dpi | khung từng hình + toạ độ nhãn "Câu N" + toạ độ tiêu đề phần lời giải | đọc cả file thì BỊA vị trí hình; "hình của câu nào" máy TÍNH theo vị trí, không hỏi Gemini |
| 3b ĐÁNH DẤU | ảnh từng trang 250 dpi | một việc duy nhất: chữ cái phương án nào bị gạch chân / khoanh / tô | đọc cả file không thấy nét gạch chân |
| máy kiểm | — | số câu liên tục · đủ 4 phương án / 4 ý · `$` cân · đáp số tô được 4 ô · các lượt lệch nhau · chữ từng câu so với LỚP CHỮ PDF | nhân chứng không-AI (chỉ khi PDF có lớp chữ) |
| **Claude kiểm** | ảnh trang | so từng câu bằng mắt, tự soi gạch chân từng câu trắc nghiệm, mở từng hình đã cắt; sửa bằng `quyet.mjs` | **bắt buộc** — xem số đo dưới |

**Đo 01/10 trên `DE SO 3` (PDF xuất từ Word, 15 trang, có bản Word làm chuẩn so):** ~4 phút, ≈ 0,17 USD.
- Chữ: 22/22 câu, đúng 12 + 4 + 6, tổng 10 điểm; nội dung khớp bản Word (khác nhau chỉ ở kiểu viết LaTeX: `(S)` ↔ `\left( S \right)`,
  `\vec{i}` ↔ `\overrightarrow{i}`); 0 câu lệch lớp chữ.
- Đáp án: 21/22 đúng ngay. Câu sai = P1 câu 6: chữ **B gạch chân**, lời giải ghi "Chọn C" (tác giả gõ nhầm) — lượt 1 và lượt 2 đều chép "C"
  dù đã dặn tách 2 nguồn. Lượt 3b bắt được ("gạch chân B") ⇒ máy nêu cờ lệch nguồn; nhưng 3b **bắt sót** (thấy 7/12 câu, chạy khác lần
  thì khác) ⇒ không thay được mắt Claude; script in danh sách câu máy CHƯA soi được để Claude soi nốt.
- Hình: bản đầu (lấy khung từ lượt 1) sai nặng — báo 3 hình ở trang chỉ có 1, khung ăn 2 dòng chữ / cụt đáy. Sau khi chuyển sang 3a +
  gắn câu theo vị trí: 5/5 hình của đề đúng câu, khung sát. 6 ô "phiếu trả lời" in cuối đề suýt bị gắn vào câu cuối ⇒ luật: trang sau câu
  cuối mà hình không đứng dưới nhãn câu nào thì KHÔNG tự gắn.
- `ghi.mjs` chạy thử (ROLLBACK) nhận `de.json` này bình thường: 22 câu, 10 điểm.

**Chưa giải quyết (biết rõ):**
1. **Trùng câu khác nguồn:** chạy thử ghi bản PDF của đề đã nhập từ Word ⇒ chỉ 1/22 câu được nhận là "trùng câu cũ" (LaTeX hai nguồn viết
   khác) ⇒ nhập cùng một đề từ hai nguồn sẽ đẻ 21 bản sao. Việc cần làm: chuẩn hoá LaTeX trước khi so trùng trong `_kho_insert.mjs`.
2. Chưa đo trên **PDF scan** (không lớp chữ) và trên đề của Sở chỉ có bảng đáp án cuối đề — hai loại đề lát này sinh ra để phục vụ.
3. Đề có câu Đúng/Sai mà file KHÔNG có đáp án: `ghi.mjs` hiện chặn ("mệnh đề thiếu đáp án") ⇒ đề không vào được để người điền sau.
4. Hình trong phần lời giải không cắt. Đề + lời giải quá dài làm lượt 1 bị cắt (script dừng, báo tách file).

### 10.9 Phát hành 2 CHẾ ĐỘ cho bài trên lớp (CEO 02/10) · ĐÃ BUILD

CEO: *"Phát hành nên có 2 chế độ: phát hành TOÀN BỘ — giống buổi hôm qua, thường là thi và luyện tập; và phát hành TỪNG PHẦN — dành cho buổi học."*

| Chế độ | Dùng khi | Lúc phát hành | Sau đó |
|---|---|---|---|
| **Từng phần** (mặc định) | buổi học | chỉ PHẦN ĐẦU mở | GV bấm **▶ Phát hành** ở đầu từng phần trong tab **Live** của buổi; bấm lại = thu hồi; **▶▶ Mở toàn bộ** nếu muốn mở hết |
| **Toàn bộ** | luyện tập | mở sẵn mọi câu | học sinh làm theo nhịp của mình |

- Chỉ **bài trên lớp** (`bai_test.loai='giao_trinh'`) có khái niệm mở dần. **Kiểm tra, ET, BTVN luôn mở cả bài** — không đổi.
- **"Phần" là gì:** bài gán từ ĐỀ THI → Phần I / II / III của đề (mở theo CÂU; không mở theo dạng vì một dạng rải ở nhiều phần của đề, mở theo dạng là
  lộ câu phần sau). Giáo trình thường → DẠNG, y như từ 13/09 (thêm nút "Mở toàn bộ" ở tab Live).
- **Chọn chế độ ở đâu:** hộp 📱 Giao › Bài trên lớp › tick "Mở cho học sinh làm trên app" (2 lựa chọn) · bảng "Đã gán vào buổi của lớp"
  (📱 Mở từng phần / 📱 Mở toàn bộ; bài đã mở từng phần có ▶▶ Mở toàn bộ).
  **Chỗ chọn CHÍNH = nút 📱 ở Kho tài liệu** (CEO 02/10: "chọn chế độ phát hành là phải chọn từ kho tài liệu"): bấm 📱 trên dòng Giáo trình buổi ⇒ hộp 2 lựa chọn
  Từng phần / Toàn bộ, áp cho CẢ giáo trình thường lẫn bài gán từ đề. BTVN · ET bấm 📱 là phát hành cả bài như cũ.
- **Không có cột "chế độ":** chế độ chỉ quyết định lúc phát hành mở những gì; trạng thái thật luôn là 2 bảng `bai_test_cau_phat_hanh` /
  `bai_test_dang_phat_hanh` (suy động). DB: mig `202610021201` — `fn_bt_mo_toan_bo`, `fn_bt_mo_phan_dau`; mở / thu hồi một phần dùng
  `fn_bt_mo_cau` / `fn_bt_dong_cau` có sẵn (của luồng Học online). Thu hồi = câu ẩn khỏi bài của HS và thôi nhận câu trả lời; bài đã làm giữ nguyên.
- **⚠ Cần deploy cả ERP lẫn app HS:** bản app HS cũ chỉ hiểu mở theo DẠNG ⇒ với bài từ đề mở từng phần nó KHÔNG thấy câu nào. (Bài mở toàn bộ thì bản cũ
  vẫn thấy mọi câu đã có dạng.)
- Đụng tới luồng **Học online** (nhánh `worktree-hoc-online`, chưa merge — có màn `CaOnlinePanel` phát hành từng câu): hai bên dùng chung 2 bảng phát hành
  và `fn_bt_mo_cau` / `fn_bt_dong_cau`; trigger `fn_bt_tu_phat_hanh_dang1` của luồng đó được thêm một điều kiện bỏ qua bài từ đề. Khi merge nhánh đó phải
  ghép với `LiveTab` đã sửa ở đây.
