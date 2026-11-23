# spec-builder.md — BUILDER · ET · MT · GIÁO TRÌNH · ĐỀ TRÊN APP · IN (spec #4 của bộ 20 spec)

> **Trạng thái: THÙY CHỐT 17/11/2026** (trả lời từng câu — bảng "Thùy chốt" đầu §12). Spec này là nguồn đúng; `spec-builder-ban-do-moi.md` + `spec-de-thi.md` đã chuyển `_luu-tru/`.
> **Gộp từ:** `spec-builder-ban-do-moi.md` (trọn) · `spec-de-thi.md` §5–§10.10 (màn đề trên app: Kho đề thi, soạn, duyệt, giao, thi; phần bóc câu §0–§4 đã ở `spec-kho-cau-hoi.md` §11) ·
> `_luu-tru/spec-test-online.md` (luật phát hành / snapshot / reveal còn hiệu lực) · HANDOFF (mục builder · giáo trình per-class · Kho đề thi · ET bản đồ mới) · DEVLOG 02/07 → 16/11 (quyết định có ngày, ghi `(Thùy dd/mm)`).
> `_luu-tru/spec-giao-trinh-tuan.md` chỉ đọc để biết lịch sử — nguồn đúng là `spec-van-hanh-tuan.md` §3.
> **Đối chiếu DB 17/11** (chỉ đọc: `pg_constraint`, `pg_trigger`, `pg_get_functiondef`, đếm dòng). Số ở §1 · §12 là số ngày 17/11. Chỗ DB/code lệch nguồn ⇒ không sửa, ghi §12.
>
> **Ranh giới (chỉ trỏ, không chép):**
> nhịp tuần · ca TKB ⇄ buổi builder 1-1 · duyệt giáo trình tuần · ngày dạy mặc định · BTVN xếp chồng 3 buổi ⇒ `spec-van-hanh-tuan.md` §3, §4.7 (cũ §8.1) ·
> câu nào được vào kho · MCQ / điền ô / clone · bóc câu đề thi · quy chuẩn hiển thị câu (`MathText`) ⇒ `spec-kho-cau-hoi.md` ·
> cấu trúc bản đồ (chủ đề → chuyên đề → nhóm → dạng bài; Hình–Học / Hình–Luyện; thẻ lý thuyết) ⇒ `spec-ban-do-toan.md` ·
> đo / mastery từ bài làm ⇒ `spec-mastery.md` · luật giải, đáp án, gán dạng, duyệt câu của đề ⇒ `spec-giai-bai.md` ·
> chấm ET / BTVN / MT của TA, Đ/C/S, lưới chấm, đóng phase ⇒ spec trợ giảng **#10** (chưa viết) · bổ trợ chọn câu `_btyeu_chon_cau` ⇒ `spec-bo-tro.md` ·
> giao diện app HS ⇒ spec **#12** / `design/STYLE-HS.md` · đề test đầu vào, đăng ký test ⇒ spec **#8**.

---

## 0. Đích

- **Một cửa soạn tài liệu từ kho câu** cho mọi loại: giáo trình · BTVN · ET · MT · chuyên đề · đề thi / đề cương · tài liệu bổ trợ. Tài liệu chỉ **trỏ** tới câu; câu sống một nơi (kho).
- **Danh tính = CÂU** (Thùy 17/10: *"mọi dữ liệu đánh giá trỏ về câu hỏi; mã chủ yếu để tạo ra sự duy nhất"*). Mọi cấu hình, chấm, đo, in bám `ma_cau`; số "Câu 5", "Buổi 7", "Dạng bài 2.3" chỉ suy lúc hiện.
- **Giấy và app giống hệt** (Thùy 29/09): cùng thứ tự câu, cùng thứ tự đáp án. Phân biệt HS bằng **mã đề**, không bằng xáo.
- **Một khuôn dữ liệu** `tai_lieu` → `tai_lieu_phan` → `tai_lieu_cau` cho mọi loại, mọi môn (CLAUDE §1.6): Toán (Đại · Hình giải tích · Hình) · KHTN · Vật lý · Hoá học chạy cùng bộ hàm, khác nhau theo **khuôn** (nhóm › dạng bài | bài học / mô hình), dispatch qua registry.
- Người soạn **đứng nguyên chỗ**: tự lưu, vá tại chỗ, rời màn quay lại đúng chỗ (CLAUDE §2 React).

## 1. Khái niệm

### 1.1 Ba bảng

| Bảng | Là gì | Mã gốc |
|---|---|---|
| `tai_lieu` | một tài liệu (5.682 dòng) | `id` (uuid, bất biến). Tên, số buổi của lớp chỉ hiển thị |
| `tai_lieu_phan` | một nút trong cây tài liệu — buổi · nhóm · dạng bài · phần đề… (36.757). Cây = `cha_id`; thứ tự = `thu_tu` | `id` (uuid). **Buổi = `id` nút `buoi`** — "Buổi 7" suy ra (`spec-van-hanh-tuan` §3.0 câu 2) |
| `tai_lieu_cau` | một câu đặt vào một nút (152.832) — `ma_cau` (TEXT, **không FK**) · `thu_tu` · `diem` (NULL = theo phần) | khoá tự nhiên `(phan_id, ma_cau)`; `thu_tu` chỉ để hiện |

- **`cau_hinh` (jsonb trên `tai_lieu`) — mọi khoá theo `ma_cau`**, không theo vị trí: in (`colByCau` · `btvnLinesByCau` · `hinhCheDoByCau` · `anhMmByCau` · `anhPctByCau` · `anhPhaiByCau` · `mau` · `inLyThuyet`) ·
  nhánh kho từng câu (`nhanhByCau`) · ET (`etMaDe` · `etFormByCau` · `hsMaDe`) · MT (`diemByCau` · `phanBac` · `mtMeta` · `khuonThi` · `hinhByMa` · `hinhMaDe`) · đề (`deThi`) · BTVN (`xepChong`).
- **Hàng Hình trong MT** mang khoá riêng của đề `HINH:<uuid>` (89 dòng) — danh tính của đề, nhân bản đề thì cấp mã mới (Thùy 28/10).
- `tai_lieu_cau.ma_cau` trỏ được: 8 bảng câu `<kho>_cau_hoi` · kho trên lớp (`dai_cau_lop` `LOP…`, `hinh_hoc_cau_lop` `HHL…`) · bài Hình–Luyện (`hinh_bai.ma_bai` `HLB…`) · `HINH:*`. Đo 17/11: **2** tham chiếu chết thật (§12 L2), 2.377 trỏ câu đã vào kho rác (vẫn resolve — đúng luật).

### 1.2 Loại tài liệu (`tai_lieu.loai` — **không có CHECK**, §12 L1)

| Loại | Gốc / bản vận hành | Bám | Số 17/11 (bản đồ cũ · mới) |
|---|---|---|---|
| `giao_trinh` | gốc (mẫu) | **một lớp** (`lop_id`, bắt buộc từ 28/10) | Toán 71 · 90 (63 đang dùng + 27 bản lưu trữ) · KHTN 26 · 6 |
| `giao_trinh_buoi` | bản chép của 1 buổi cho lớp (bài trên lớp) | lớp + ngày, `nguon_id` · `nguon_buoi` | Toán 744 · 196 · KHTN 38 · 15 |
| `btvn` | bản chép BTVN của buổi | lớp + ngày | Toán 776 · 186 · KHTN 46 · 15 |
| `et` | ET của buổi (soạn thẳng, không qua gốc) | lớp + ngày | Toán 786 · 168 · KHTN 52 · 10 |
| `mt` → `mt_buoi` | đề MT mẫu → bản gán buổi | mẫu không lớp; bản gán lớp + ngày | 72 mẫu · 139 bản gán (bản đồ cũ) |
| `chuyen_de` | tài liệu độc lập, đơn vị "Phần" | không lớp | 10 (Toán 7 · KHTN 3), chỉ bản đồ mới |
| `de_thi` | đề thi / đề cương (`cau_hinh.deThi.kieu = 'de_cuong'`) | không lớp | Toán 1.920 đề + 182 đề cương · Anh 74 |
| `bo_tro` | "Tài liệu bổ trợ" (BT) theo **học sinh** | `hoc_sinh_id` | 21 (luồng cũ) |
| `de_test_dau_vao` | sinh từ một MT (trigger chặn nguồn khác) | — | 39 → spec #8 |

- **1 buổi (lớp + ngày) ≤ 1 `giao_trinh_buoi` + 1 `btvn`** (`uq_tai_lieu_van_hanh`). ET không có ràng buộc này (§12 L11).
- **Bản đồ** `ban_do ∈ {cu, moi}` (CHECK). **Bản lưu trữ** = `luu_tru_tu` (giáo trình cũ chuyển sang) + `phase = 0`: chỉ xem / in / nhân bản, RPC ghi từ chối.
- **Nhánh:** `tai_lieu.nhanh` = nhánh mặc định (`hinh` · `hinh_gt` · NULL = Đại/môn); câu khác nhánh ghi `cau_hinh.nhanhByCau[ma_cau]` — **bắt buộc** khi một tài liệu trộn nhánh, thiếu là câu rụng im lặng khi mở lại (§4).

### 1.3 Loại nút (`tai_lieu_phan.loai_phan` — **không có CHECK**, §12 L1)

| `loai_phan` | `ref_ma` | Câu | Dùng ở |
|---|---|---|---|
| `buoi` | — | — | mốc buổi (giáo trình, bản chép); chuyên đề = "Phần" |
| `nhom` | id nhóm (`NNB…` / `KNB…`) | không | bản đồ mới |
| `dang_bai` | id dạng bài (`NDB…`) | câu luyện | bản đồ mới |
| `nhom_chua_phan` | id nhóm | câu luyện chưa có dạng bài | bản đồ mới |
| `btvn_nhom` | id nhóm | câu BTVN | bản đồ mới |
| `ontap_nhom` (+ `lui_bac` 1/2, `lui_buoi`) | id nhóm | câu luyện lại / ôn tập | BTVN xếp chồng → `spec-van-hanh-tuan` §4.7 |
| `chua_khop` | — | câu cũ chưa ra nhóm | chỉ bản lưu trữ (chuyển đổi) |
| `dang` · `btvn` | mã dạng cũ / bài học Hình (`HH…`) | luyện · BTVN | bản đồ cũ · phần Học của giáo trình Hình |
| `ontap` | mã dạng cũ | ôn tập | BTVN bản đồ cũ |
| `hl_mo_hinh` · `hl_khac` · `hl_btvn` | mô hình / bài Hình–Luyện | bài trọn ý | giáo trình Hình (Luyện) · chuyên đề Hình |
| `custom` | — | câu | ET (1 phần) · MT · đề thi (mỗi phần đề) · đề test |

Số hiển thị (Nhóm 2 · Dạng bài 2.3 · Câu 5) **suy lúc in**, không lưu (Thùy 17/10). Ngoại lệ đang có: `tai_lieu.stt_lop` + tiêu đề "Buổi N" của bản chép (§12 L8).

## 2. Luật chung của builder

### 2.1 Danh tính · thứ tự · ghi
- Giáo trình lưu **câu** là chính; id nhóm / dạng bài trong tài liệu chỉ để dựng khung và in (Thùy 17/10). Đo đi theo dạng **hiện tại** của câu (`spec-mastery` §3).
- Mọi ghi có tính toán = **RPC một giao dịch** `fn_tl_*` (CLAUDE §2.0). Đổi nội dung con ⇒ bump `tai_lieu.updated_at` (đo 17/11: 9/13 hàm ghi `tai_lieu_cau` bump; 4 hàm còn lại tạo tài liệu mới hoặc là hàm con của hàm đã bump — đạt).
- Client giữ: CRUD dòng đơn, render, sort/filter theo UI. Phần còn tính ở client là nợ (§12 L5, L6).

### 2.1b Chuẩn CHUNG của mọi builder · chuẩn RIÊNG của từng builder (Thùy 20/11)
- **Mọi builder phải tuân chuẩn chung** (liệt kê ở §2 này: danh tính · chọn câu · không xáo · component dùng chung · và các mục chuẩn thêm dưới đây). **Mỗi builder có thể có chuẩn RIÊNG** (giáo trình Đại ≠ Hình ≠ ET ≠ MT…; ghi ở mục của builder đó: §3–§7). Chuẩn riêng **bổ sung**, không được **vi phạm / bỏ** chuẩn chung. Thêm tính năng mới dùng cho mọi builder ⇒ ghi vào đây như một chuẩn chung; chỉ dùng cho một builder ⇒ ghi ở mục của nó.
- **Chuẩn chung #1 — ĐỔI CHỖ CÂU ĐƯỢC.** Chi tiết:

#### Đổi chỗ câu
- Mọi danh sách câu trong builder (giáo trình trên lớp · về nhà · luyện lại buổi trước · ET · MT · BTVN · chuyên đề · Hình…) **phải đổi chỗ được**, và đổi chỗ chỉ là đổi **thứ tự** — mã gốc câu không đổi (CLAUDE §2).
- **Kéo thả bằng CẢ THẺ câu** (HTML5 drag & drop, không thư viện): chạm chỗ nào của thẻ cũng kéo được, KHÔNG có tay nắm riêng (tay nắm ⠿ đã thử 20/11, khó nhìn, khó bấm). Con trỏ bàn tay (`cursor-grab`), thẻ đang kéo mờ 40%, thẻ đích viền indigo. **Không kéo khi bấm vào ô nhập / nút / ô chọn / liên kết / nhãn** (`input,select,textarea,button,a,label`) — để ô số dòng, ✕, chế độ hình… vẫn dùng bình thường. Chỉ thả trong **cùng một khối câu**.
- **Giữ nút ▲▼** song song với kéo thả (iPad / chạm không kéo được thì bấm).
- **Đơn vị đổi chỗ = một khối**: câu lẻ là một khối; **khúc nhiều ý (Hình-Học bài nhiều ý) là MỘT khối, không tách ý**.
- **Mượt (CLAUDE §2 React):** cập nhật màn NGAY (lạc quan, vá đúng nhóm tại chỗ), ghi DB nền; lỗi ⇒ trả lại thứ tự cũ + báo. Không `setLoading` / tải lại cả buổi sau mỗi lần đổi.
- Ghi bằng RPC một giao dịch (`fn_tl_bdm_dat_cau` / `datCauLui`) nhận **cả danh sách câu theo thứ tự mới**. Dùng chung component `KhoiCau` (`bdm/BuilderBanDoMoi.tsx`, prop `onDoi`) — builder mới **dùng lại**, không tự viết kéo thả riêng (§2.8). - **Đã áp (20/11):** giáo trình Đại (trên lớp · BTVN · luyện lại buổi trước) · giáo trình Hình (Học + BTVN) · `SoanBaiSauGio` (bổ trợ sau giờ) · `BtvnOnTapBdm` (luyện lại + ôn tập) · `OnTapEditor` (cùng khuôn kéo cả hàng + ▲▼, không qua `KhoiCau` vì hàng của nó có layout riêng). Builder/màn mới có danh sách câu mà chưa đổi chỗ được = chưa đạt chuẩn.

### 2.2 Chọn câu
- Nguồn câu = kho chuẩn theo dạng bài (`_tl_bdm_cau_vi_tri(khối, môn)`; Hình: `_tl_hh_cau_chuan`) — điều kiện "câu vào kho" ⇒ `spec-kho-cau-hoi` §2. Câu chưa phân dạng bài **không tự vào** bài luyện, chọn tay được (nhãn "chưa phân") (Thùy 17/10).
- Chọn theo **nhóm là chính**, vẫn chọn **dạng bài lẻ** (kể cả từ nhiều nhóm trong một buổi); chọn nhóm ⇒ mặc định mọi dạng bài theo thứ tự bản đồ, bỏ tick dạng không dạy (A1, Thùy 17/10). Nhóm chưa có dạng bài chọn được, câu lấy cả nhóm.
- Bộ chọn: `BoChonNhom` — popup gần full màn, chủ đề (ô tìm-chọn) → chuyên đề → hộp nhóm có chip dạng bài (số câu, ✓LT / ✓VD); chuyên đề chỉ có trong bộ chọn. Popup kho / chọn câu ~95vw × 95vh (28/10).
- **Bổ trợ không đi đường này** — chỉ MCQ / trả lời ngắn qua `_btyeu_chon_cau` (`spec-bo-tro` §4).

### 2.3 Gợi ý câu — MỘT luật, ở DB (`fn_tl_bdm_goi_y`)
1. Loại câu đã dùng trong **buổi** (`_tl_bdm_cau_da_dung`) và danh sách loại trừ truyền vào.
2. **Ít dùng nhất trước** (số lần câu nằm trong mọi `tai_lieu_cau` toàn hệ — `_tl_bdm_so_lan_dung`), rồi **câu gốc trước clone**.
3. **Rải đều qua họ gốc–clone** (`cum` = `parent_ma_cau ?? ma_cau`; bản đồ mới không còn cụm — Thùy 04/11) và qua các dạng bài đã chọn, theo **số câu mỗi loại** (TN / TLN / TL) + tổng.
4. Số mặc định (chỉnh được): luyện mỗi dạng bài **2** (1 TN + 1 TL) · nhóm không dạng bài **6** · BTVN mỗi nhóm **4** (2 TN + 1 TLN + 1 TL); BTVN rải đều các dạng bài đã chọn của nhóm, né câu đã luyện cùng buổi (A2).
- BTVN luyện lại (5–3–2) ⇒ `spec-van-hanh-tuan` §4.7. Hình–Học: gợi ý **nguyên bài** đủ ý, bài đã có ý nào bị chọn thì không gợi ý lại (`_tl_hh_goi_y_nguyen_bai`, Thùy 16/11).
- Bản đồ cũ: gợi ý còn ở client (`tailieu.ts` — ít dùng + gốc + round-robin theo `cumKey = ma_cum ?? parent_ma_cau ?? ma_cau`, Thùy 07-11 / 13-08) — nợ, gỡ khi bỏ builder cũ.

### 2.4 Chống lặp câu
- **Một câu không xuất hiện 2 lần trong một buổi** — kiểm ở RPC ghi (B1). Đo 17/11: 0 vi phạm ở giáo trình đang dùng (110 cặp chỉ có trong bản lưu trữ chuyển từ giáo trình cũ).
- Câu luyện lại của BTVN **không được có ở bất cứ chỗ nào khác trong giáo trình** (`spec-van-hanh-tuan` §4.7). Câu ôn tập không trùng câu đã có trong phiếu (`fn_tl_bdm_trich_buoi` chặn).
- ET: đề 2 / 3 khác **mọi** câu gốc khi dạng bài còn câu (§2.6).
- Phạm vi "cả giáo trình" của builder cũ (Thùy 02/07: buổi này + buổi trước = cả tài liệu, chặn cứng) **chưa mang sang** builder mới ⇒ §12 L3.

### 2.5 Không xáo
- **Mọi bài trên app (BTVN · giáo trình · ET · đề thi · bổ trợ) hiện đúng thứ tự câu + đáp án như phiếu giấy** (Thùy 29/09: *"tất cả mọi tài liệu phải giống giữa giấy và app"*; thay 05/07 xáo chống liếc và 22/08 chỉ khoá giáo trình). Đo trước khi gỡ: phân bố đáp án TN đều A/B/C/D ⇒ bỏ xáo không lộ đáp án.
- Cần HS cạnh nhau khác đề ⇒ **mã đề** (nội dung khác, in giấy tương ứng). Có mã đề thì càng không xáo (Thùy 18/08).
- Ngoại lệ duy nhất: game **Đấu trường** xáo phương án (03/11 — spec #12).

### 2.6 Mã đề (ET · MT)
- 3 mã: đề 1 = câu gốc; đề 2, 3 = mỗi vị trí một câu khác. Gán từng HS: `cau_hinh.hsMaDe` (HS → mã); `etMaDe[ma_cau gốc] = [câu đề 2, câu đề 3]`.
- **Luật chọn câu đề 2 / 3 — bản đồ mới (`fn_tl_bdm_et_ma_de`, Thùy 04/11):** ứng viên = **cùng dạng bài + in được cùng form** (TN: có phương án / mệnh đề / form TN đã duyệt); ưu tiên **cùng gốc** (clone của câu đề 1, hoặc gốc + anh em) → cùng loại câu → câu gốc khác. Dạng bài hết câu ⇒ cho trùng **trong dạng bài**, rồi câu gốc — **không nhảy dạng bài, không để trống**. Đo 04/11: trùng đề 1 84 → 6 / 140 câu.
- **Bản đồ cũ + MT (`src/lib/made.ts` `buildMaDe`, client):** cùng **cụm** cứng (`cumKey`); thiếu câu khác ⇒ cho trùng (Thùy 03/08). Hai luật ⇒ §12 L4.
- App: mã đề của em **đông cứng lúc mở bài lần đầu** (`bai_lam.bien_the`, `resolve_bien_the` đọc `hsMaDe` bằng `my_hoc_sinh_id()` bên trong — HS không dò được mã của bạn). Mỗi vị trí có tới 3 dòng `bai_test_cau` (`bien_the` 1/2/3); `so_cau` = số câu một đề (Thùy 18/08).

### 2.7 Hình · cột · dòng trong tài liệu (cấu hình theo câu)
- **Theo từng câu**, lưu `cau_hinh` theo `ma_cau` (Thùy 03/08, qua nhiều vòng): **2 cột** (`colByCau`, tối đa 2; chỉ ghép các câu liền nhau cùng số cột, câu lẻ = nửa trang) · **số dòng kẻ** (`btvnLinesByCau`; bài nhiều ý: **theo từng ý**, Thùy 25/10) ·
  **chế độ hình** (`hinhCheDoByCau`: `hien` · `o_trong` (ô trống để HS vẽ) · `khong`) · **cỡ ảnh** (`anhMmByCau` mm / `anhPctByCau` %) · **ảnh bên phải** (`anhPhaiByCau`) · **màu** thẻ (`mau`).
- Bật / tắt in: lý thuyết nhóm · lý thuyết dạng bài · ví dụ — từng mục (`hien_lt`, `hien_vi_du`, A3).
- Gốc → bản chép: sửa cấu hình in ở giáo trình gốc ⇒ trigger `_tl_dong_bo_cau_hinh_in` chép 6 khoá in sang mọi `giao_trinh_buoi` / `btvn` có `nguon_id` = gốc (chỉ cấu hình in — câu của bản chép không đổi).
- Mã đề 2 / 3 kế thừa cấu hình in của câu gốc.

### 2.8 Component dùng chung — BẮT BUỘC (Thùy 28/10: *"có module sẵn hết rồi m tự đẻ ra kiểu mới làm gì"*)
Màn / khối mới có danh sách câu **dùng lại**, không vẽ list mới:
`KhoiCau` + `CfgCau` + `CopyBuoiModal` (`bdm/BuilderBanDoMoi.tsx`) · `CheDoHinhBtn` · `AnhMmCtl` · `AnhXem` · `ColSel` · `ApplyLinesAll` · `MaCau` (`TaiLieuBuilder.tsx`) · bọc `AnhMmEditCtx` / `AnhMmCtx` / `AnhPhaiCtx` (`anhMmCtx.ts`) ·
chọn câu `ChonCauBdm` · `ChonCauHoc` · `ChonBaiHoc` · `ChonMoHinh` · `BoChonNhom` · in `cauItemParts` · `CauFlow` · `CauColumns` · `itemsGomY` · `itemsTheoDe` (`PrintView.tsx`). Đang dùng ở: builder Đại/HGT, builder Hình, ET mới, BTVN ôn tập, Kho đề thi, soạn bài sau giờ, `OnTapEditor`.

### 2.9 Màn
- **Tự lưu**, dấu "✓ Đã lưu"; sau mỗi thao tác **vá đúng thẻ**, không tải lại cả buổi; nhớ buổi đang mở + vị trí cuộn khi rời màn (B5).
- Danh sách tài liệu / thư viện mặc định **20 gần nhất** + tìm, lọc ở server (Thùy 10/09).

### 2.10 Tham chiếu text — kho rác
- Xoá câu = **kho rác** (`xoa_at`), cấm xoá cứng (CLAUDE §2). Chỗ **chọn** câu lọc `xoa_at is null`; chỗ **resolve** (mở tài liệu, in, chấm) không lọc ⇒ tài liệu cũ in đủ.
- Xoá vĩnh viễn chỉ khi **0 tài liệu** dùng câu (`xoaVinhVienCau`, chặn ở client). **DB chưa chặn** ⇒ §12 L2.

## 3. Giáo trình

### 3.1 Lá · tạo
- Lá **Làm tài liệu › Giáo trình (bản đồ mới)** (`lamtailieu:giao_trinh_bdm`, `bdm/GiaoTrinhBdmScreen`); lá trần `lamtailieu` cũng mở màn này. Công tắc môn Toán | KHTN | Vật lý | Hoá học (registry `MON_CO_KHO` / `bdmCuaMon`, không rải `if mon`).
- **Tạo giáo trình bắt buộc chọn lớp** (lớp cùng khối, cùng môn, đang học); **một giáo trình = một lớp**, lớp Đại + Hình = 2 giáo trình; tên khoá theo mẫu `Giáo trình <tên lớp>` + thẻ nhánh (Thùy 28/10, 16/11 — `spec-van-hanh-tuan` §2.8–§2.9). Đo 17/11: 69/69 giáo trình đang dùng có lớp, 0 lớp có 2 giáo trình cùng nhánh.
- **Ba nhánh Toán** (Thùy 27/10, chọn "1 giáo trình Hình chung"): **Đại** + **Hình giải tích** = `BuilderBanDoMoi` · **Hình** = `ChuyenDeHinhBuilder laGiaoTrinh` (§3.5). KHTN · Vật lý · Hoá học = `BuilderBanDoMoi` theo môn (Thùy 03/11, 12/11).
- Phạm vi dùng thật: K6 → K11 + K12 chủ đề NH-TP (Thùy 20/10); khối 3 · 4 · 4T · 5 · 5T đã sang bản đồ mới (28/10, 03/11). Khối nào đủ nội dung tới đâu ⇒ `spec-ban-do-toan`.

### 3.2 Buổi (khuôn nhóm — Đại · HGT · KHTN · Lý · Hoá)
- Buổi = các **nhóm**, mỗi nhóm = tập **dạng bài** được chọn (A1). RPC `fn_tl_bdm_dat_buoi(tài liệu, buổi, chọn, số luyện, số luyện nhóm, số BTVN)`: kiểm nhóm có thật trên bản đồ của môn, không chọn trùng, dạng bài đúng nhóm; nhóm / dạng bài cũ **giữ câu GV đã chỉnh**, chỉ cái mới thêm mới được gợi ý; bỏ chọn ⇒ xoá nút + câu của nó.
- **Bài luyện theo DẠNG BÀI, BTVN theo NHÓM** (A2). Thẻ nhóm: LT nhóm (bật/tắt) → dạng bài (tick, ▲▼, LT/VD bật/tắt, Bài luyện + ↻ Gợi ý / ✎ Chọn câu) → BTVN nhóm.
- Builder có công tắc **📘 Trên lớp / 📝 BTVN**; ở chế độ BTVN mỗi buổi hiện 3 phần ⇒ `spec-van-hanh-tuan` §4.7.
- **＋ Tạo buổi mới** và **📥 Lấy buổi từ lớp khác** nằm trên thanh trên (Thùy 16/11; chuyên đề: "＋ Tạo phần mới"). Lấy buổi = `fn_tl_bdm_copy_buoi`: chép cây phần + câu + cấu hình in của đúng các câu đó; hai lớp sau đó sửa riêng (Thùy 28/10; Hình 16/11). Không chép phần luyện lại.
- Buổi đã lên kế hoạch hiện nhãn **"📅 T5 26/11"** (`spec-van-hanh-tuan` §3.3).

### 3.3 Bản in một buổi — KHÔNG còn chuyên đề (A3, Thùy 17/10)
```
Nhóm bài: LÝ THUYẾT nhóm
  Dạng bài 1: LÝ THUYẾT dạng bài → VÍ DỤ → Bài luyện
  Dạng bài 2: …
BTVN (phiếu riêng): theo nhóm, câu xếp theo dạng bài
```
Không in tên / mô tả / lý thuyết chuyên đề; builder không hiện chuyên đề trong thẻ buổi. Resolver in = `fn_tl_bdm_noi_dung(tài liệu, buổi?)`.

### 3.4 Gán lớp (trích buổi)
- Hộp **Gán lớp** (`bdm/GanLopBdm`) → `fn_tl_bdm_trich_buoi(gốc, buổi, đích, 'gt'|'btvn', tiêu đề, ôn tập)`: **chép** cây buổi (nhóm → dạng bài / chưa phân / chưa khớp) sang `giao_trinh_buoi`, BTVN nhóm sang `btvn`. Đích phải rỗng; chép đúng thứ tự gốc.
- **Bản chép độc lập:** sửa giáo trình gốc sau đó **không** đổi bản đã gán (trừ cấu hình in, §2.7). Đã gắn ngày dạy và kết quả chấm ⇒ không chuyển, không đụng.
- Ngày mặc định = ngày kế hoạch; trigger `_gtt_theo_ngay_day` dời liên kết ca ⇒ `spec-van-hanh-tuan` §3.4.
- **Ôn tập** (`bdm/BtvnOnTapBdm`, `fn_tl_bdm_on_tap_ung_vien`): GV chọn tay nhóm của buổi trước, máy gợi ý câu; câu ôn tập không trùng phiếu. BTVN 3 phần ⇒ `spec-van-hanh-tuan` §4.7 (`fn_tl_bdm_trich_btvn`).
- **Số buổi của lớp:** `tai_lieu.stt_lop` = hạng NGÀY trong lịch đã gán của lớp; `renumberBuoiLop` đánh lại cả lớp sau mọi thao tác đổi tập buổi, thay số trong tiêu đề giữ phần chữ ("Buổi 22: GTLN" → "Buổi 16: GTLN") (Thùy 24/07). GT + BTVN cùng ngày = cùng số.
- Phát hành lên app ⇒ §10.

### 3.5 Giáo trình Hình (khuôn mô hình)
- `ChuyenDeHinhBuilder laGiaoTrinh` (Thùy 27/10): mỗi buổi **📖 HỌC** (bài học `hinh_hoc_bai` → lý thuyết bật/tắt + bài luyện + BTVN; lưu khuôn `dang` / `btvn` ⇒ tài liệu lớp đọc như giáo trình Hình cũ) và/hoặc **🌿 LUYỆN** (mô hình → bài trọn ý, `hl_mo_hinh`, mã bài `ma_bai`). Xếp Học → Luyện → khác → BTVN (`_tl_hl_xep`).
- Thẻ Học = `KhoiCau` (số câu theo loại · Gợi ý · Chọn câu · dòng · 2 cột · chế độ hình · cỡ ảnh) (Thùy 28/10). Gợi ý nguyên bài (§2.3).
- Gán lớp `fn_tl_hinh_trich_buoi` (BTVN tạo thẳng). **Chưa có:** ôn tập · BTVN xếp chồng cho Hình (phiếu chỉ 3–6 câu). In = `PrintView` khuôn cũ + thẻ Luyện (`bdm/HinhLuyenIn`).
- Giáo trình Hình đời cũ (`hinh_giao_trinh` · `hinh_gt_bai` · `hinh_gt_buoi`, màn `kho/hinh/GiaoTrinhScreen`) do `postgres` sở hữu ⇒ CLI đọc 0 dòng (điểm mù CLAUDE §2.1) — không kết luận "rỗng".

### 3.6 Giáo trình cũ · bản lưu trữ
- Builder cũ (`TaiLieuBuilder` + `DangPicker`, lá `lamtailieu:giao_trinh`) và ET cũ (`lamtailieu:et`) **gỡ khỏi menu** (Thùy 04/11, sau khi mở lại riêng tiểu học 28/10); màn + route còn, Kho tài liệu vẫn mở tài liệu cũ. Khối đã chạy bản đồ mới ⇒ dải cảnh báo "đã chuyển sang giáo trình mới", **không chặn** (Thùy 26/10).
- **Bản lưu trữ** (B2 + phase 0, Thùy 28/10 *"chuyển hẳn sang bản đồ mới"*): mỗi giáo trình cũ ⇒ 1 bản `ban_do='moi'`, `luu_tru_tu = <id cũ>`, giữ tên + buổi + thứ tự + `cau_hinh`; câu → dạng bài của câu → nhóm; ra nhóm mà chưa dạng bài ⇒ `nhom_chua_phan`; không ra nhóm ⇒ `chua_khop` (tô vàng) — **không bỏ câu nào**, kiểm số câu trước = sau.
  Đã chạy 28/10: 29 giáo trình Toán Đại K6–12, 16.747 câu trước = sau, 163 chưa khớp (DB 17/11 còn 27 bản). Giáo trình cũ **giữ nguyên, không xoá** (Luật xoá).
- Còn dùng: ngày buổi trong 14 ngày qua có **3** bản gán từ giáo trình cũ (Toán K5 1 · KHTN K7 2); 30 ngày 52 ⇒ §12 L9.

## 4. ET

- **ET (bản đồ mới)** — lá `lamtailieu:et_bdm`, `bdm/ETBdmEditor` (Thùy 20/10 *"bản mới, tách khỏi bản cũ, dựng dựa trên cái cũ"*; khôi phục 27/10 sau khi bị xoá nhầm). ET cũ (`ETScreen`) không đổi, mở qua Kho tài liệu.
- **Lưu y khuôn ET cũ:** `tai_lieu loai='et' ban_do='moi'`, **một** phần `custom` + `cau_hinh.etMaDe / etFormByCau / hsMaDe` ⇒ Chấm ET, in, ET online, đo **không phải sửa**. Đo 17/11: 178/178 ET mới có `etMaDe`, 151 có `hsMaDe`.
- **Kế hoạch tự điền** dạng bài của giáo trình buổi (bản đồ mới) của lớp ngày đó (`fn_tl_bdm_et_de_xuat`, kể cả bài học Hình); kế hoạch = dạng bài × N câu → ⚡ Sinh (`fn_tl_bdm_goi_y`) → 🎲 Sinh đề 2 & 3 (`fn_tl_bdm_et_ma_de`).
- **Một ET chọn được 3 nhánh** Đại · Hình giải tích · Hình (Thùy 28/10); câu nhớ nhánh ở `nhanhByCau` — **lúc Lưu suy lại nhánh từ dạng của câu** (bug 02/11: thiếu `nhanhByCau` ⇒ câu Hình rụng im lặng khi mở lại / in / chấm; vá mig `202611021909`, `202611032041`). Lớp KHTN / Lý / Hoá: nhánh theo môn của lớp.
- Hàng câu 2 tầng như `CauRow` builder (số · dạng bài · ↻ Đổi ✎ Chọn · dòng · hình · cỡ · 2 cột · ✕ / đề trải hết bề ngang + hình bên phải) (Thùy 02/11).
- Trigger `_et_khong_tron_ban_do`: một buổi (lớp + ngày + nhánh) không có cả ET cũ lẫn ET mới.
- **Phiếu ET:** ý của bài nhiều ý in **"a)"**, không in "Câu n." trước từng ý; dòng lời dẫn mang dải "Câu 1 – 3." để đối bảng điểm (Thùy 16/11). Đầu phiếu BK `ETHeaderBK` (`bkPrint.tsx`).
- **Chưa làm:** Hình–Luyện (bài mô hình nhiều ý) trong ET.
- **ET làm TRƯỚC khi HS đến (Thùy 20/11):** bảng gán mã đề hiện cả lớp kèm điểm danh (✅ có mặt · ⏳ chưa · ⛔ vắng — `fn_et_ds_hs_cua_buoi`); rải mã đề được ngay; **lệnh In chỉ in em có mặt** (chưa ai có mặt ⇒ hỏi in tạm cho em chưa điểm danh).
- ET online, đổ vào lưới chấm ⇒ §10; chấm ⇒ #10.

## 5. MT

- Lá **Làm tài liệu › MT** (`MTScreen` / `MTEditor`). Đề MT mẫu (`loai='mt'`, không lớp) → **gán buổi** thành bản chép `mt_buoi`.
- Phần đề + Cơ bản / Nâng cao (`phanBac`) · **điểm từng câu = ĐỀ GỐC** (`cau_hinh.diemByCau`; bản gán đọc theo đề gốc); Hình đặt điểm **theo từng ý**, người soạn tự đặt, không chia đều (Thùy 07/10).
- Trộn nhánh trong một đề (Đại · HGT · Hình — `nhanhByCau`, Thùy 02/09). **Bài Hình = hàng câu trong phần**, chọn 2 bước mô hình → bài (hoặc nguyên bài từ kho — Thùy 29/10); khoá hàng `HINH:<uuid>`.
- **Số câu theo đúng thứ tự builder**, một bộ đếm cho in lẫn chấm: câu Đại +1, bài Hình +số ý ("Câu 17–19.", ý a/b/c dưới) (Thùy 02/09).
- **Chọn đến DẠNG BÀI đúng như ET mới (Thùy 23/11):** mỗi hàng bấm ô dạng ⇒ `BoChonNhom` (chủ đề → chuyên đề → nhóm → chip dạng bài) + tab **Đại · Hình giải tích · Hình · Học** (bài học = dạng bài, `ChonBaiHoc`; hàng nhánh `hinh_hoc`) + nút Hình · Luyện; ⚡ kế hoạch có đủ 3 tab. Khối chưa chạy bản đồ mới vẫn dùng `DangPickerOne`.
- Soạn như ET mới (Thùy 28/10): mỗi phần **⚡ Thêm nhiều dạng** (dạng bài × N câu, `BoChonNhom`, gợi ý `fn_tl_bdm_goi_y` né câu xuyên mọi phần) · ✎ Chọn tick nhiều câu · **đổi thứ tự** kéo thả hoặc gõ số câu (sang phần khác được).
- **⧉ Nhân bản** MT (`fn_mt_nhan_ban`, Thùy 28/10: hai lớp thi gần giống, sửa 20 %): chép phần + câu + `cau_hinh` một giao dịch; phần và hàng Hình **cấp mã mới**, mọi khoá trỏ tới chúng đổi theo.
- **3 mã đề** (`made.ts`, luật cụm — §2.6).
- **Khuôn thi THPT khối 12** (Thùy 13/11): 12 TN · 4 Đúng/Sai · 6 TLN, điểm theo quy chế (0,25 · bậc 0,1/0,25/0,5/1 · 0,5); câu Đ/S **chọn tay** từ kho câu Đ/S theo chủ đề người soạn chọn (`ChonCauDsKho`, `fn_mt_ds_kho_cau`; gợi ý `fn_mt_goi_y_ds`); registry `KHUON_THI` (`lib/mt.ts`) theo khối, `cau_hinh.khuonThi`. Chấm Đ/S từng ý ⇒ #10.
- MT là nguồn duy nhất của đề test đầu vào (trigger `_de_test_chi_nguon_mt`) ⇒ #8. Chấm MT, bảng kết quả theo chuyên đề ⇒ #10 / #6.

## 6. BTVN · BT

- **BTVN** = phần `btvn_nhom` (bản đồ mới) / `btvn` (cũ) của buổi trong giáo trình; Gán lớp tạo tài liệu `btvn` của (lớp, ngày). Phiếu riêng, đầu phiếu có tên HS (`BtvnBkHead`).
- **BTVN 3 phần xếp chồng (5–3–2)** — soạn trong builder chế độ BTVN, gán lớp chỉ chép ⇒ `spec-van-hanh-tuan` §4.7.
- In BTVN bài nhiều ý: **đề trọn khối rồi mới tới phần giải**, không xen từng ý (Thùy 09/08).
- Hạn nộp online, tự đóng khi hết hạn, BTVN học bù gắn buổi mẹ, chấm ⇒ #10 / #8.
- **BT — "Tài liệu bổ trợ"** (lá `lamtailieu:bo_tro`, `BTScreen`, `loai='bo_tro'`): gán theo **học sinh**, hệ gợi ý dạng yếu theo mastery; luồng cũ (21 tài liệu). Bổ trợ hiện hành (ca yếu / bù / đuổi) ⇒ `spec-bo-tro`.

## 7. Chuyên đề

- Lá **Làm tài liệu › Chuyên đề** (`lamtailieu:chuyen_de`, cùng `GiaoTrinhBdmScreen`): `tai_lieu loai='chuyen_de' ban_do='moi'`, **không gắn lớp, không Gán lớp**, đơn vị **"Phần"** (Thùy 21/10 *"builder như giáo trình, tồn tại độc lập"*).
- **Mỗi chuyên đề một nhánh**, chọn lúc tạo: Đại + HGT (+ KHTN) = `BuilderBanDoMoi laChuyenDe` · **Hình = Hình–Luyện** `bdm/ChuyenDeHinhBuilder` (Phần → mô hình → bài kho trọn ý, `fn_tl_hl_dat_mo_hinh / dat_bai / noi_dung`); in `bdm/ChuyenDeHinhPrintView` (đề = giả thiết chung, bài một ý thì đề nằm trong ý — như màn duyệt).
- Builder / in **từ chối bài Hình sai nhánh** (`spec-ban-do-toan` — bất biến "nhánh chứa tiền đề").
- Ví dụ đang có: "Hình Giữa kì 1" K7 · K8 · K9 (chỉ bài hình 3–4 ý, chuẩn 2,5 điểm — Thùy 04/11), "Hình Cuối kì 1" K8 (13/11).

## 8. Đề thi trên app (Kho đề thi)

> Bóc câu, lưu cấu trúc đề, dò trùng, `/nhap-de-thi` ⇒ `spec-kho-cau-hoi` §11. Luật giải / đáp án / gán dạng / duyệt câu ⇒ `spec-giai-bai`. Ở đây: màn + luồng dùng đề.

### 8.1 Mô hình
- Đề = `tai_lieu(loai='de_thi')` · phần = `tai_lieu_phan(loai_phan='custom')` (+ `diem_moi_cau`) · câu = `tai_lieu_cau` (+ `diem` khi lệch khuôn) (đường A — Thùy 20/09; `toan_de_thi*` 0 dòng, ngừng dùng, DROP là việc riêng theo Luật xoá).
- `cau_hinh.deThi` (nguồn · mã đề · năm · thời gian · thang · PDF gốc · sha256 · `kieu` · `canhBaoCau`) · `nhanhByCau`. Duyệt đề = `duyet_at` / `duyet_boi`, vết do trigger `_trg_tai_lieu_duyet_log` → `tai_lieu_duyet_log`.
- Điểm mặc định khuôn Bộ: TN 0,25 · Đ/S 1 (bậc 0,1 / 0,25 / 0,5 / 1) · TLN 0,5; đề lệch khuôn quy tổng về thang 10. Thời gian mặc định 90 phút (Thùy 22/09).
- **Đề cương** = `deThi.kieu='de_cuong'` (không thêm loại) — cùng màn sửa / in / giao (Thùy 10/10).

### 8.2 Màn Kho đề thi
- Lá riêng **Kho đề thi** (`khodethi`, ngay dưới Kho tài liệu — Thùy 09/10); Kho tài liệu chỉ còn **In / In nhanh / Copy link** cho đề (Thùy 01/10).
- Hàng đầu: công tắc **Đề thi | Đề cương** (kèm số); Đề thi có 3 tab **Chờ duyệt · Sẵn sàng · Đã giao** (suy động ở DB `fn_de_thi_dem` / `fn_de_thi_ds`), Đề cương không có hàng đợi duyệt; nhớ tab gần nhất (Thùy 01/10, 12/10). Lọc khối · **kỳ** · **năm học** · tìm tên (Thùy 20/10). Đo 17/11: Toán 1.920 đề (393 đã duyệt) · 182 đề cương.
- **Một màn sửa + duyệt** `DeThiSoan` (Thùy 01/10, khuôn builder giáo trình 19/10): cây trái Phần → Câu (chấm đỏ / vàng / xanh) · thẻ phần dải màu (đổi tên, 👁 Xem phần) · sửa tại chỗ nội dung / phương án / đáp án / lời giải / hình (`CauEditor` của kho) · dạng của câu (**theo bản đồ mới** — Thùy 20/10) · **dạng từng mệnh đề Đ/S** · ghi chú máy lúc nhập · đề gốc PDF cạnh bên · ↑↓ · ✕ bỏ câu · thêm câu có sẵn trong kho · thêm / xoá phần · mỗi câu dòng "🖨 Bản in" (dòng kẻ · 2 cột · chế độ hình · cỡ ảnh, `patchCauHinhDeThi` trộn đúng khoá) · Duyệt · Giao · In · các lượt đã giao.
- **Thiếu = invariant** `fn_de_thi_thieu(đề)` (không cột trạng thái): **chặn** — câu đã vào kho rác · thiếu đáp án · thiếu phương án · mệnh đề thiếu Đ/S; **chỉ cảnh báo** — chưa có dạng / chủ đề · tự luận (chỉ in) (Thùy 01/10 K6: *"đề luôn dùng được kể cả khi chưa gán đủ dạng"*).
- **Duyệt đề** `fn_de_thi_duyet` = **duyệt NỘI DUNG mọi câu, không đòi phân dạng** (Thùy 20/10; thay 22/09 "duyệt ⇒ mọi câu da_duyet"); câu còn dạng chờ chưa vào kho chuẩn cho tới khi có dạng.
- Bỏ đường nhập PDF bằng Gemini trong ERP (Thùy 01/10: gỡ `NhapDeThiWizard`, `BocCauModal`, `DungSaiBoc`, màn sửa cũ). Còn thiếu: nút xoá đề (Luật xoá) · soạn câu mới bằng tay trong đề.

### 8.3 Giao đề (`DuyetDeThi.tsx`, nút 📱 Giao)
| Chọn | Hàm | Thành |
|---|---|---|
| **📘 Bài trên lớp** | `fn_de_thi_gan(đề, lớp, ngày, 'giao_trinh_buoi')` | tài liệu Giáo trình buổi của (lớp, ngày) — đi y như giáo trình trích xuất (in · 📱 · live · chuông báo yếu) |
| **📝 BTVN** | `fn_de_thi_gan(…, 'btvn')` | tài liệu BTVN của buổi (in có tên HS · chấm buổi sau · hạn nộp) |
| **⏱ Kiểm tra** | `fn_de_thi_mo` | lượt thi tính giờ, giấu đáp án, không tạo tài liệu buổi |

- Thùy 01/10: *"mỗi lớp có 3 loại tài liệu: Giáo trình, ET, BTVN — gán đề thi thì nó là giáo trình hoặc BTVN, phải khớp hệ thống hiện tại"* ⇒ **không thêm loại bài** (`bai_test.loai` `giao_trinh` / `btvn` / `de_thi`).
- Khuôn bản gán: mốc `buoi` (tiêu đề = tên đề, số buổi do `renumberBuoiLop`) + **mỗi phần đề = một phần** `dang` / `btvn`, `ref_ma` trống, `nguon_id` = đề, `cau_hinh` chép từ đề + `etFormByCau[TLN]='tra_loi_ngan'`. **Bản gán là bản chép**; buổi đã có Giáo trình / BTVN ⇒ hàm **từ chối**, nêu tên bản đang có.
- Điều kiện: đề đã duyệt + không câu nào thiếu đáp án · lớp **cùng môn** với đề · câu chưa có dạng không cản.
- Bản đầu chỉ giao **cả đề** (K4); dùng câu lẻ ⇒ nhặt từ kho qua Làm tài liệu.
- Màn đề có bảng **"Đã gán vào buổi của lớp"** (lớp · ngày · loại · đã mở app chưa · mấy em làm · 🖨 · 📱). Đo 17/11: 48 đề đã gán (72 bản gán 30 ngày) · lượt **Kiểm tra: 0** từ trước tới nay.

### 8.4 Thi (Kiểm tra) — đã build 27/09, chưa ai dùng
- `fn_de_thi_mo(đề, lớp, ngày, phút, khoá)`: bắt buộc đã duyệt; tạo `bai_test(loai='de_thi')` + snapshot qua `_kho_snapshot_cau` (điểm từ phần / câu, tên phần, thời gian); **1 lượt / HS**.
- **Trả lời ngắn giữ form đề gốc: 4 ô** chỉ điền số / ký tự / dấu, đúng phiếu TLTN THPT (Thùy 01/10 K5 — thay 20/09 "TLN đổi MCQ"); `bai_test_cau.kieu_nhap='phieu_4o'` (`_de_thi_hop_le_4o`), app có bàn phím 0–9 · − · phẩy; so đáp số qua `fn_tln_normalize` (23,9 = 23.9).
- Đồng hồ: hạn của một HS = `bai_lam.bat_dau_at + thoi_gian_phut` (suy, không job), **server là trọng tài**, ân hạn 2 phút; trigger `_trg_bai_lam_thi` / `_trg_bai_lam_cau_thi` chặn HS tự ghi verdict / điểm, ghi sau nộp, sửa `bat_dau_at` (nộp phải qua `et_nop`).
- **Khoá đáp án** (`khoa_reveal`) ẩn **cả đúng/sai lẫn điểm** tới khi GV mở; đang thi ẩn 💡 Gợi ý. Staff: `fn_de_thi_ket_qua` · `fn_de_thi_thu_bai` (HS tắt app vẫn có điểm) · HS `fn_de_thi_diem_cua_toi`. Điểm thang 10 = Σ đạt / Σ tối đa × 10 (`_et_cham`).
- Câu còn dạng chờ ⇒ `bai_test_cau.ma_dang` **trống** (không tính cho dạng nào — tránh "dạng yếu" giả); gán dạng sau ⇒ trigger `_trg_de_thi_dien_dang` điền vào mọi bài đã phát hành từ đề, chỉ điền chỗ trống (K6c). `fn_de_thi_hoan_thien_bai_test` = một chỗ hoàn thiện bài phát hành từ đề.
- **Chưa làm:** thư viện đề tự luyện (P4, `de_thi_luyen` — chưa có trong CHECK `bai_test.loai`) · xếp hạng · mastery theo từng mệnh đề Đ/S · đổi ngày / xoá bản gán ngay trong Kho đề thi · gán một phần đề · giám sát rời tab (còn mở từ 20/09).

## 9. In ấn

| Loại | Màn in |
|---|---|
| Giáo trình · buổi · BTVN · chuyên đề Đại (nhánh `DocBdm` theo `ban_do`) · đề gán buổi (`itemsTheoDe`) | `PrintView.tsx` |
| ET (3 mã đề, phiếu từng HS) | `ETPrintView.tsx` |
| MT | `MTPrintView.tsx` |
| Đề thi / đề cương (`onlyPhanId` in một phần) | `DeThiPrintView.tsx` |
| BT | `BTPrintView.tsx` |
| Chuyên đề Hình · thẻ Luyện | `bdm/ChuyenDeHinhPrintView.tsx` · `bdm/HinhLuyenIn.tsx` |

- Một bộ máy dàn trang: **paged.js** + `buildPagedCss` / `pageChrome`; khối câu `cauItemParts` → `CauFlow` / `CauColumns` (băng ĐỀ ghép cặp + hàng dòng kẻ rời để ngắt trang đúng — **không** dùng column-count / grid / table, Thùy 03/08). Câu được chảy qua trang (đề Trưng Vương 11 → 7 trang, 19/10).
- **Bỏ dải header ở mọi bản in**, giữ footer (số trang + liên hệ) (Thùy 03/08). "Câu N." luôn cùng dòng đầu với đề (`MathText prefix`, 02/07). Bọc khối bằng `<section>` lồng làm paged.js bỏ trắng trang ⇒ dùng Fragment (25/10).
- **Link PDF:** đóng builder / gán lớp ⇒ xếp hàng `linkgen_jobs` → worker Puppeteer mở `PrintJobPage` (`/#pvjob=…`, chờ `__pvState='ready'`) → PDF chữ thật. Sửa tài liệu sau khi đã có link ⇒ phải sinh lại (link cũ không tự đổi). Đo 17/11: 125 việc đang chờ · 5 hỏng.
- Kho tài liệu: 🖨 In · ⬇ Tải PDF · In nhanh · Copy link; ✏ Sửa mở **đúng builder theo `ban_do` + nhánh + loại** (sửa 20/10).

## 10. Giao lên app HS · nối ô chấm

### 10.1 Phát hành (snapshot)
- Nút 📱 (Kho tài liệu · Gán lớp · Kho đề thi) → `phatHanhTest(tài liệu, lớp+ngày?, chế độ)` → `bai_test` + `bai_test_cau` **snapshot đề + key một lần**; **1 tài liệu × lớp × ngày × loại = 1 bài** (`uq_bai_test_doc`), phát lại phải xoá bài cũ (test-online §1.2, §5.1).
- Sau đó bài **sống độc lập với kho**: sửa kho không đụng bài đã phát; sửa key sai ⇒ **chấm lại thủ công** có log (`fn_sua_key_va_cham_lai`, `bai_test_cham_lai_log`), không chấm lại ngầm. `bai_test_cau.ma_cau` giữ để truy nguồn + đo theo câu.
- Gán HS = **suy sống** từ ghi danh lớp tại thời điểm, không chụp sĩ số.
- **Hai chế độ cho bài trên lớp** (`giao_trinh`, Thùy 02/10): **Từng phần** (mặc định — chỉ phần đầu mở, GV ▶ phát hành từng phần ở tab Live; bài từ đề mở theo PHẦN của đề, giáo trình thường theo DẠNG) · **Toàn bộ**. Chọn ở nút 📱 của Kho tài liệu. Không có cột "chế độ": trạng thái thật = `bai_test_cau_phat_hanh` / `bai_test_dang_phat_hanh` (`fn_bt_mo_*` / `fn_bt_dong_cau`). ET · BTVN · Kiểm tra luôn mở cả bài.
- **Reveal:** ET = sau khi HS nộp (trừ `khoa_reveal`) · BTVN / giáo trình = ngay từng câu · Kiểm tra = khi GV mở.
- Cấp 3: câu tự luận / TLN có form TN đã duyệt ⇒ app hiện MCQ (`_kho_snapshot_cau`, Thùy 20/09); **đề thi giữ TLN 4 ô** (§8.4).
- Mã đề trên app ⇒ §2.6. Không xáo ⇒ §2.5.
- Bài không còn tài liệu nguồn (tài liệu bị xoá) ⇒ trigger `_bai_test_mat_phieu_dong` tự đóng bài.
- Màn HS: `LamBai` (BTVN · giáo trình — chấm từng câu) · `LamET` (ET · đề thi — `et_de` trả đề KHÔNG key, `et_nop` chấm ở server) trong `src/screens/hocsinh/HocSinhApp.tsx`. Đo đếm 17/11: `bai_test` ET 58 · giáo trình 67 · BTVN 99 từ trước tới nay.

### 10.2 Nối ô chấm của buổi ↔ câu — KHOÁ TỰ NHIÊN
- Lưới chấm buổi `gami_session_problems(phase et/mt/btvn)` nối câu bằng **`ma_cau`** (mig `0106`, 21/07), **không bằng vị trí**. `problem_no` chỉ là slot nội bộ (được thủng số); số cột hiện = vị trí trong ĐỀ.
  *Bài học 21/07 (ET 5A2):* lưới chụp một lần rồi nối `problem_no ↔ index` ⇒ GV sửa đề, ô gắn sang câu khác **im lặng**; cảnh báo cũ so **số lượng** nên mù.
- Một hàm `syncDocProblems(buổi, phase, câu, đã đóng)` cho ET / MT / BTVN, chạy mỗi lần mở tab chấm: câu còn ⇒ giữ ô + điểm · câu mới ⇒ thêm ô · ô mất câu chưa có điểm ⇒ xoá · ô mất câu đã có điểm ⇒ giữ + cảnh báo; phase đã đóng không dựng lưới. Cảnh báo lệch **so nội dung** (bộ mã câu), không so số.
- **ET / BTVN online → lưới** (`fn_et_online_dong_bo`, 03/09; BTVN 07/09): verdict của câu nộp → ô cùng `ma_cau`; không ghi đè ô chấm tay; không đụng phase đã đóng; HS không trong buổi / câu không có ô ⇒ đếm, không tự thêm. Câu **biến thể mã đề 2/3** quy về câu gốc qua `(bai_test, thu_tu, bien_the=1)` — khoá cấu trúc có chủ ý của snapshot mã đề, không phải nối vị trí hai tập độc lập.
- Nhãn dạng của ô lấy theo câu ở **bản đồ mới** (`fn_bdm_dang_cua_cau`) — không ghi ngược mã cũ (26/10).
- Còn nối vị trí / chưa có mã ⇒ §12 L7. Chấm · đóng phase · Elo ⇒ #10.

## 11. Bảng · hàm · trigger (bản đồ code)

| Phần | DB | Code |
|---|---|---|
| Khuôn tài liệu | `tai_lieu` · `tai_lieu_phan` · `tai_lieu_cau` · `tai_lieu_duyet_log` · `tl_bdm_dem_luu` (số đếm bộ chọn lưu sẵn) · registry view `tl_bdm_{chu_de,chuyen_de,o,nhom,dang_bai}_v` (Toán + KHTN + Lý + Hoá) | `lib/tailieu.ts` (`getTaiLieuFull` · `trichXuatBuoi` · `renumberBuoiLop` · `copyBuoiBdm` · `khoCuaMon`) · `lib/tailieuBdm.ts` · `lib/mon.ts` |
| Builder bản đồ mới | `fn_tl_bdm_cay_chon` · `_cau` · `_goi_y` · `_dat_buoi` · `_dat_cau` · `_noi_dung` · `_copy_buoi` · `_chuyen_luu_tru` · `_on_tap_ung_vien` · `_trich_buoi` · `_trich_btvn` · `_btvn_khung` · `_dat_cau_lui` · `_lui_goi_y(_buoi)` · `_bo_phan_lui` · nội bộ `_tl_bdm_*` (`_cau_vi_tri` · `_cau_da_dung` · `_so_lan_dung` · `_ghi_cau` · `_kiem_buoi` · `_phan_cua_buoi` · `_buoi_truoc`…) | `bdm/BuilderBanDoMoi` · `BoChonNhom` · `ChonCauBdm` · `GanLopBdm` · `BtvnOnTapBdm` · `GiaoTrinhBdmScreen` |
| Hình | `fn_tl_hh_*` (Học) · `fn_tl_hl_*` (Luyện) · `fn_tl_hinh_trich_buoi` · `_tl_hh_goi_y_nguyen_bai` · `_tl_hl_xep` | `bdm/ChuyenDeHinhBuilder` · `lib/chuyenDeHinh.ts` · `lib/kho/hinhGiaoTrinh.ts` |
| ET | `fn_tl_bdm_et_de_xuat` · `fn_tl_bdm_et_ma_de` · `fn_tl_bdm_et_vi_tri` · trigger `_et_khong_tron_ban_do` | `bdm/ETBdmEditor` · `ETScreen` (cũ) · `ETPrintView` · `lib/made.ts` (cũ) |
| MT | `fn_mt_nhan_ban` · `fn_mt_ds_kho_cau` · `fn_mt_goi_y_ds` · `fn_mt_ds_chu_de` · `_mt_khung_tinh` (+ chấm / kết quả `fn_mt_*` → #10) | `MTScreen` · `MTPrintView` · `ChonCauDsKho` · `lib/mt.ts` |
| Đề thi | `fn_de_thi_*` (16) · `_de_thi_*` (8) · `_et_cham` · `et_de` · `et_nop` · trigger `_trg_tai_lieu_duyet_log` · `_trg_de_thi_dien_dang` (trên bảng kho) | `KhoDeThi` (`DeThiSoan`) · `DuyetDeThi` · `DeThiPrintView` · `lib/dethi.ts` |
| Phát hành / app | `bai_test` · `bai_test_cau` · `bai_lam` · `bai_lam_cau` · `bai_test_cau_phat_hanh(_log)` · `bai_test_dang_phat_hanh` · `fn_bt_*` (7) · `resolve_bien_the` · `han_nop_bai_test` · trigger `_bai_test_mat_phieu_dong` · `fn_bt_tu_phat_hanh_dang1` · `_trg_bai_lam_thi` · `_trg_bai_lam_cau_thi` | `lib/testonline.ts` (`phatHanhTest`) · `hocsinh/HocSinhApp.tsx` (`LamBai` · `LamET`) |
| Nối ô chấm | `gami_session_problems` (UNIQUE `buoi_hoc_id, phase, problem_no`) · `fn_et_online_dong_bo` · `fn_bdm_dang_cua_cau` | `lib/gami.ts` (`syncDocProblems`) |
| In | `linkgen_jobs` | `PrintView` · `bkPrint` · `PrintJobPage` · `lib/linkgen.ts` · `KhoTaiLieuScreen` |

**Trigger trên bảng tài liệu (hidden code — đọc trước khi sửa):**

| Bảng | Trigger | Làm gì |
|---|---|---|
| `tai_lieu` | `trg_et_khong_tron_ban_do` (BEFORE I/U) | chặn ET cũ + ET mới cùng lớp + ngày + nhánh |
| `tai_lieu` | `trg_de_test_chi_nguon_mt` (BEFORE I/U) | đề test đầu vào phải sinh từ một MT |
| `tai_lieu` | `trg_gtt_theo_ngay_day` (AFTER I/U) | gán buổi ⇒ dời liên kết ca giáo trình tuần (`spec-van-hanh-tuan` §3.4) |
| `tai_lieu` | `trg_tai_lieu_duyet_log` (AFTER U) | đổi `duyet_at` ⇒ ghi `tai_lieu_duyet_log` |
| `tai_lieu` | `trg_tl_dong_bo_cau_hinh_in` (AFTER U) | đổi 6 khoá in ở gốc ⇒ chép sang bản chép `giao_trinh_buoi` / `btvn` + bump `updated_at` |
| `bai_test` | `trg_bai_test_mat_phieu_dong` | mất tài liệu nguồn ⇒ đóng bài |
| `bai_test_cau` | `tg_bt_dang_ph_auto_dang1` | bài trên lớp (không từ đề, không ca online) ⇒ tự mở dạng của câu 1 |
| `bai_lam` / `bai_lam_cau` | `trg_bai_lam_thi` / `trg_bai_lam_cau_thi` | luật chế độ thi (§8.4) |
| đo | `trg_mastery_ban_*` (cấp câu lệnh) trên `bai_lam*` · `bai_test_cau` · `gami_session_problems` | đánh bẩn mastery (`spec-mastery` §7) |

**`tai_lieu_phan` và `tai_lieu_cau` không có trigger nào** (17/11) ⇒ mọi luật nội dung (không trùng trong buổi, bump `updated_at`) nằm ở RPC ghi; ghi thẳng PostgREST (RLS `la_thanh_vien()` cho phép ALL) là đi vòng luật.
**Ràng buộc:** `tai_lieu.ban_do` CHECK `cu|moi` · `tai_lieu_phan.lui_bac` CHECK 1|2 · `uq_tai_lieu_van_hanh` · `uq_bai_test_doc` · `bai_test.loai` CHECK 14 giá trị · `bai_test_cau.kieu_nhap` CHECK `phieu_4o` · `gami_session_problems.phase` CHECK `ingame|et|mt|btvn`.

## 12. Thùy chốt 17/11 + lệch phát hiện

**THÙY CHỐT (17/11) — quyết định thắng mọi dòng "đề xuất" trong bảng lệch bên dưới:**
| # | Quyết định | Tình trạng |
|---|---|---|
| L3 | **Chống lặp: KHÔNG cấm.** Chọn tay câu đã dùng ⇒ chỉ hiện cờ. **Gợi ý câu thì tránh tài liệu của buổi gần nhất** (và, như cũ, không trùng trong buổi). | luật; gợi ý ở DB (`fn_tl_bdm_goi_y`) chưa sửa — làm khi có lệnh |
| L4 | **Mã đề: theo luật mới HẾT** (MT cũng dùng luật của ET mới, một nguồn ở DB `fn_tl_bdm_et_ma_de`). **Luật vẫn ưu tiên CLONE đầu tiên** (câu cùng gốc–clone trước, rồi mới tới câu khác cùng dạng bài). | luật; MT chưa chuyển — làm khi có lệnh |
| L5 | Phát hành bài + chấm trên app chuyển xuống DB (so cũ–mới 30 bài thật, deploy ERP + app HS cùng lúc). | OK — chưa làm |
| L9 | Builder + ET bản đồ cũ: **khoá, chỉ xem / in**; giáo trình cũ còn dùng (5A, KHTN 7K–9K) chuyển sang bản lưu trữ. | OK — chưa làm |
| L10 | Giáo trình cũ chưa chuyển: **để nguyên làm lịch sử.** | chốt |
| L11 | **MỘT BUỔI CHỈ MỘT ET** (Thùy: "sao lại có chuyện 1 buổi 2 ET… do làm lỗi"). Gốc lỗi đã tìm: hai lượt lưu chồng nhau ở màn ET mới cùng tạo mới (4 buổi 03–13/11, hai bản giống hệt cách nhau 1–2 giây; 23 cặp cũ hơn ở ET bản đồ cũ cùng kiểu). | ✅ vá client (`ETBdmEditor`: một lượt lưu tại một thời điểm + tạo mới mà buổi đã có ET ⇒ dừng) + ✅ unique index DB `tai_lieu_et_moi_mot_buoi_uidx` (mọi ET bản đồ mới, không mốc ngày — mig `202611172018`). ✅ 4 bản trùng tháng 11 đã xoá (Thùy gật; xoá bản tạo TRƯỚC — bản sau là bản đang dùng; bản chép `_luu-tru/du-lieu/et-trung-thang-11-17-11.json`). 23 cặp ET bản đồ cũ để nguyên. |
| L12 | ~27 đề duyệt trước 20/10: chạy lại `fn_de_thi_duyet` một lượt, đếm trước. | OK — chưa làm |
| L13 | Kiểm tra / thư viện đề luyện (P4): giữ "chưa làm". | chốt |

**Việc kỹ thuật (Thùy 17/11: "7 việc kĩ thuật kia m xử lý đi"):**
| # | Kết quả |
|---|---|
| L1 | ✅ mig `202611172006`: CHECK `tai_lieu.loai` (10 giá trị) + `tai_lieu_phan.loai_phan` (14 đang có + `lt_chuyen_de`). Thêm loại mới ⇒ migration nới CHECK. |
| L2 | ✅ mig `202611172006`: trigger `trg_chan_xoa_cau_dang_dung` (BEFORE DELETE) trên 8 bảng `*_cau_hoi` — chặn xoá cứng câu còn ở `tai_lieu_cau` / `bai_test_cau` / `gami_session_problems`; xoá mềm không ảnh hưởng. Đã thử: chặn đúng. 2 tham chiếu chết cũ giữ nguyên. |
| L6 | Không sửa — gỡ cùng builder cũ (L9). |
| L7 | **Đo lại 17/11: nhận định của nháp SAI một phần** — 129/129 ô MT Hình ĐỀU có khoá thật (`hinh_baitoan_id` / `hinh_y_id`), điểm gắn đúng bài theo khoá. Chỉ còn **số thứ tự ô** (`problem_no`) xếp theo "hàng Hình thứ k ↔ nhãn bắt đầu bằng k" (`thuTuMTTheoDe`) ⇒ đổi thứ tự hàng Hình sau khi gán có thể lệch SỐ hiển thị, không lệch đo. Không sửa đợt này. 12 ô BTVN không mã: chưa soi. |
| L8 | Giữ (ghi nhận). |
| L14 | **Đã đúng từ 16/11** — `fn_tl_bdm_copy_buoi` có `anhPhaiByCau` trong danh sách khoá chép; nháp ghi nhầm. Không làm gì. |
| L15 | ✅ thẻ mã câu dùng chung `MaCau` thêm cờ "đã vào kho rác" (giáo trình cũ + mới; chỉ cảnh báo). Màn ET mới không dùng `MaCau` — chưa có cờ. Chờ deploy ERP. |

### Bảng lệch gốc (đối chiếu 17/11 — cột "đề xuất" là trước khi Thùy chốt)

| # | Lệch (nguồn ↔ hiện trạng 17/11) | Câu hỏi | Đề xuất CTO |
|---|---|---|---|
| L1 | `tai_lieu.loai` (10 giá trị) và `tai_lieu_phan.loai_phan` (14 giá trị) **không có CHECK** — trái CLAUDE §2.1 (cột loại phải có CHECK) | — (kỹ thuật) | CTO tự thêm CHECK đúng tập giá trị đang có, một migration, thử qua REST |
| L2 | `spec-de-thi` §3.3 hứa **trigger chặn xoá cứng** câu đang nằm trong đề — DB **không có**; chỉ client `xoaVinhVienCau` chặn, RLS cho xoá. Có 2 tham chiếu chết thật (`DCDEMO…` ở 1 ET, `DC0000…` ở 1 giáo trình buổi) | — (kỹ thuật) + có dọn 2 dòng chết không | Trigger BEFORE DELETE trên 8 bảng kho: chặn khi `ma_cau` còn ở `tai_lieu_cau` / `bai_test_cau` / `gami_session_problems`. 2 dòng chết: **giữ, ghi chú** (không đoán câu thay) |
| L3 | Chống trùng: builder cũ chặn **cả giáo trình** (Thùy 02/07); builder mới chỉ chặn **trong buổi** ⇒ 176 cặp câu lặp giữa các buổi của giáo trình đang dùng | Phạm vi chống trùng của giáo trình mới là buổi hay cả giáo trình? | **Gợi ý né cả giáo trình** (đúng luật 02/07, cùng tinh thần "luyện lại không trùng chỗ nào"); **chọn tay** câu đã có ở buổi khác ⇒ hiện cờ "đã dùng ở Buổi N", không chặn |
| L4 | Mã đề hai luật: ET mới = cùng **dạng bài**, ưu tiên cùng gốc (DB, 04/11); ET cũ + **MT** = cùng **cụm** cứng (client `made.ts`). MT K12 đo 13/11: TN đề 2/3 dùng lại câu gốc vì "hết câu cùng dạng + cụm" | MT dùng luật mã đề của ET mới? | **Có** — MT gọi `fn_tl_bdm_et_ma_de` (một nguồn ở DB, §2.0); `made.ts` chỉ còn cho tài liệu cũ, gỡ khi bỏ builder cũ |
| L5 | `phatHanhTest` **snapshot ở client** và `LamBai` **chấm ở client rồi ghi** `bai_lam_cau.verdict` (BTVN · giáo trình) — trái §2.0; `spec-de-thi` §6.1 đã ghi "bắt buộc RPC" | Cho làm khi nào (phải deploy cùng lúc ERP + app HS)? | RPC `fn_bt_phat_hanh(tài liệu, lớp, ngày, chế độ)` + chấm ở DB (dùng `_et_cham`); so cũ–mới trên 30 bài thật trước khi đổi; làm sau đợt hiệu năng, một lượt deploy |
| L6 | Gợi ý câu bản đồ cũ (`tailieu.ts` `autoSuggest*`) và `made.ts` tính ở client | — | Không sửa; gỡ cùng builder cũ (L9) |
| L7 | Còn nối **vị trí**: MT hàng Hình — 129 ô chỉ có `hinh_nhan`, khớp "hàng Hình thứ k ↔ ô `hinh_nhan` bắt đầu bằng k" (`_mt_khung_tinh`, `thuTuMTTheoDe`) — sửa thứ tự hàng Hình sau khi chấm là gắn nhầm im lặng. Ô ET không mã 1.394 (trước 21/07, 0 trong 30 ngày) · ô BTVN không mã 12 trong 30 ngày | — (kỹ thuật) | Ghi khoá `HINH:<uuid>#<ý>` vào ô MT Hình, khớp theo khoá; soi 12 ô BTVN; ô cũ trước 21/07 để nguyên (§1.5 — không đoán) |
| L8 | Số hiển thị đang **lưu**: `tai_lieu.stt_lop` + "Buổi N" viết vào tiêu đề bản chép (CLAUDE §2: số thứ tự chỉ suy) | — | **Giữ** (không làm khoá, không FK; đổi sẽ đụng in + app PH) — ghi để biết |
| L9 | Lá giáo trình / ET cũ gỡ 04/11, nhưng 14 ngày qua vẫn có 3 bản gán từ giáo trình cũ (Toán K5 "Giáo trình 5A" · KHTN K7) và 9 ET bản cũ (1 Toán · 8 KHTN) | Khoá hẳn builder cũ thành chỉ xem / in? | **Có**: chuyển nốt giáo trình cũ còn dùng (5A, KHTN 7K–9K) sang bản lưu trữ như 28/10; builder cũ + ET cũ chỉ xem / in / nhân bản sang bản đồ mới |
| L10 | B6 bước 5 "chuyển 87 giáo trình cũ": đã chuyển 29 (DB còn 27 bản lưu trữ); 71 Toán + 26 KHTN giáo trình cũ chưa chuyển (gồm HGT · Hình · KHTN cũ — "đợt 2") | Chuyển nốt hay để nguyên làm lịch sử? | **Để nguyên** (đo đi theo câu, bản chép theo ngày không cần chuyển); chỉ chuyển cái còn dùng (L9) |
| L11 | ET không có ràng buộc một bản / buổi: 27 cặp (lớp, ngày) có ≥ 2 ET (6 trong 30 ngày) — vụ 7S2 13/07, 11A1 21/10 (lưới khớp bản thứ nhất). ET mới gộp 3 nhánh vào một tài liệu | Từ nay 1 ET / (lớp, ngày)? | **Có** với ET mới (unique `lop_id, ngay` khi `loai='et' and ban_do='moi'`); ET cũ chia nhánh để nguyên |
| L12 | ~27 đề duyệt **trước 20/10** (luật cũ) — câu chưa dạng của chúng chưa được đóng dấu duyệt (HANDOFF "chờ Thùy") | Chạy lại `fn_de_thi_duyet` cho các đề đó hay để team bấm "Duyệt lại"? | **Chạy lại một lượt** (chỉ đóng dấu nội dung, không đổi dạng), ROLLBACK đếm trước |
| L13 | Kiểm tra (`fn_de_thi_mo`) build 27/09: **0 lượt**; P4 thư viện đề chưa build (`de_thi_luyen` chưa có trong CHECK); `spec-de-thi` §6.3 còn ghi "loại `else 'btvn'` lọt mastery" — đã hết đúng (mastery dùng danh sách cho phép, `spec-mastery` §2) | Giữ P4 trong lộ trình? | Giữ "chưa làm", không build tới khi Thùy mở; mở thì thêm loại vào CHECK + quyết tường minh test hay luyện |
| L14 | `fn_tl_bdm_copy_buoi` không chép `anhPhaiByCau` (ảnh bên phải) — Đại lẫn Hình (16/11) | — (kỹ thuật) | CTO sửa, migration nhỏ |
| L15 | 2.377 dòng tài liệu trỏ câu đã vào kho rác — resolve được (đúng luật), nhưng builder không báo; Kho đề thi thì có cờ | — | Builder + ET hiện cờ "câu đã vào kho rác" như Kho đề thi (chỉ cảnh báo) |

Không lệch (đã kiểm): không trùng câu trong một buổi ở giáo trình đang dùng · bump `updated_at` đủ · cột `cum` của gợi ý = họ gốc–clone (khớp Thùy 04/11) · 69/69 giáo trình đang dùng có lớp, 0 lớp hai giáo trình cùng nhánh.

## 13. Khi Thùy duyệt

- Chuyển `_luu-tru/` (git mv): **`spec-builder-ban-do-moi.md`** (trọn) · **`spec-de-thi.md`** (§0–§4 đã ở `spec-kho-cau-hoi` §11, §5–§10.10 ở đây — hết phần còn sống).
- `SPEC-INDEX.md`: bảng A dòng #4 → ✅; bảng B thêm 2 dòng (`spec-builder-ban-do-moi` → `spec-builder.md` · `spec-de-thi` → `spec-kho-cau-hoi` §11 + `spec-builder.md` §8). `spec-kho-cau-hoi.md` dòng trạng thái bỏ "`spec-de-thi.md` phần màn/duyệt/thi → chờ #4".
- `CLAUDE.md` §7: thêm dòng `spec-builder.md` (đọc trước khi sửa builder / ET / MT / giáo trình / Kho đề thi / in / phát hành), bỏ dòng trỏ `spec-builder-ban-do-moi`, `spec-de-thi` nếu có; giữ dòng memory "Dùng lại module sẵn" trỏ §2.8.
- Câu Thùy chốt ở §12 ⇒ ghi vào đúng mục (§2.4 · §2.6 · §3.6 · §4 · §8.4), bảng §12 chỉ còn trạng thái.
