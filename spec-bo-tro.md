# BỔ TRỢ — tài liệu tổng (yếu · bù · đuổi)

> **Đọc file này TRƯỚC khi sửa bất cứ gì thuộc luồng bổ trợ.** Đây là bản TỔNG HỢP các quyết định CEO (Thùy) đã chốt + những gì ĐÃ BUILT,
> tính tới **23/09/2026**. Lịch sử/số đo từng quyết định: `DEVLOG.md` theo ngày. Thiết kế gốc: `PLAN-botro-yeu.md` (phát hiện → duyệt →
> nội dung → xếp → đánh giá) và `PLAN-botro-yeu-ca.md` (1 ca diễn ra thế nào, 2 app). Code/DB là chân lý runtime; file này là bản đồ.

---

## 0. Ba loại bổ trợ

| Loại | `buoi_hoc.loai` | Kích hoạt | Bài trên app HS | Màn chính |
|---|---|---|---|---|
| **Bổ trợ YẾU** | `bo_tro_yeu` | Máy phát hiện từ dữ liệu đo + người duyệt | **Có** (luyện · test cuối ca · retest) | nhóm "Bổ trợ yếu" + "Xếp bổ trợ yếu" + app TA + app HS |
| **Bù** | `bu` | HS nghỉ buổi thường | Chưa (ET giấy, TA chấm) | `BoTroScreen` |
| **Đuổi** | `bo_tro_duoi` | HS vào lớp giữa chừng | Chưa (tài liệu giấy, `bt_grades`) | `BoTroDuoiScreen` |

- App HS màn chính có box **"Bổ trợ"**: lịch sắp tới của CẢ 3 loại (`fn_hs_lich_bo_tro`) — "trigger cái nào thì cái đấy hiện"; ca yếu hôm nay đã
  điểm danh ⇒ nút "Vào ca". Box **"Bài tập được giao"** = placeholder, CHƯA định nghĩa.
- **Luật chung (CEO 19–20/09): mọi bài làm TRÊN APP của bổ trợ (yếu · bù · đuổi) CHỈ dùng TRẮC NGHIỆM (MCQ)** — xem §4. Bù/đuổi khi build
  bài trên app PHẢI dùng đúng hàm điều kiện `_kho_dk_mcq_sql`, không viết điều kiện riêng.

Phần còn lại của file nói về **BỔ TRỢ YẾU**.

---

## 1. Luồng tổng (bổ trợ yếu)

```
Dữ liệu đo (ET · MT · BTVN · báo động GV/TA)
   → ① PHÁT HIỆN (máy, 4 kênh)            → màn Duyệt bổ trợ / Dashboard học tập
   → ② DUYỆT (người chốt level L1–L3 + mức ưu tiên) → mở/gộp CASE `bo_tro_yeu`
   → ③ NỘI DUNG (chọn dạng của case)       → màn Nội dung bổ trợ yếu
   → ④ XẾP LỊCH (OPS, theo lịch trực khối+bậc, ca ≤3 em) → màn Xếp bổ trợ yếu
   → ⑤ CA DIỄN RA (TA đứng ca; 📱 app hoặc 📄 giấy)      → app TA + app HS + tab "Đang diễn ra"
   → ⑥ RETEST tầng 2 (sau ET buổi thường) → ⑦ ĐÁNH GIÁ CA (xong / theo dõi / bổ trợ tiếp / nâng mức)
```
Máy chỉ ĐỀ XUẤT — người duyệt mới đổi state; mọi lượt duyệt ghi `hs_level_log` (cả đề xuất máy lẫn chốt người).

### 1.1 VÒNG bổ trợ — 4 trạng thái (CEO chốt 22/09, "linh động")
| Trạng thái | Nghĩa | Ở đâu |
|---|---|---|
| **Chờ duyệt** | máy phát hiện, chưa có case | hàng đợi Duyệt bổ trợ |
| **Đang bổ trợ** | case `dang_xu` còn ≥1 dạng CẦN DẠY (chưa dạy, hoặc retest trượt ⇒ dạy lại) | Xếp lịch: tab **Cần xếp** (chưa có buổi chờ) / **Đã xếp** (có buổi chờ học) |
| **Chờ retest** | dạy hết dạng, còn dạng chưa retest đạt | Xếp lịch: tab **Chờ retest** (KHÔNG xếp lịch — retest sau ET buổi thường, app TA báo "retest đến hạn") |
| **Hoàn thành** | mọi dạng retest đạt → người đánh giá ca chốt (`hoan_thanh`) | Đánh giá ca bổ trợ → tab **Hoàn thành** ở Xếp lịch (lưu HẾT, không cắt) |

- Vào **Đang bổ trợ** rồi thì ở đó tới khi XONG TOÀN BỘ dạng: đang bổ trợ mà thêm dạng mới ⇒ vẫn đang bổ trợ (dạng vào CÙNG case), vẫn hiện ở màn Xếp.
- **Không định mức dạng/buổi**: đóng ca chỉ chốt dạng em có luyện, dạng chưa kịp trôi sang buổi sau; retest trượt ⇒ dạng cần dạy lại (`dat=false`), dạy
  lại xong `dat` về NULL ⇒ chờ retest mới. Học xong 2/3 dạng thì dạng thứ 3 chờ buổi kế — case tự quay lại cột Chờ xếp.
- **Đã hoàn thành** = hết 1 vòng. Yếu lại ⇒ case MỚI nối `case_truoc_id` = **vòng n+1** (chip "vòng n" trên card).
- **Dạng yếu MỚI của em đang bổ trợ:** máy ĐỀ XUẤT (`fn_btyeu_de_xuat_dang_moi`: yếu + ≥3 lần đo + CÓ LẦN ĐO SAU KHI MỞ CASE), card hiện nút
  "🤖 +N dạng yếu mới — Thêm?" (xem tên/điểm, xác nhận) ⇒ vào case với `nguon='may'`. KHÔNG tự gộp — đo 22/09: tự gộp sẽ nhét 116 dạng yếu-cũ vào 63 case,
  đè quyết định của người duyệt ở bước Nội dung. Case đang Chờ retest mà thêm dạng ⇒ về Đang bổ trợ.
- **Báo động (chuông GV/TA) khi em ĐANG có case cùng môn ⇒ ADD THẲNG dạng vào case** (trigger `trg_btyeu_bao_dong_vao_case`, `nguon='bao_dong'`,
  nhãn 🚨 trên card) — cờ cứng của người, không cần đề xuất. Chưa có case ⇒ vào hàng đợi Duyệt như cũ (báo động tự đủ tín hiệu). (CEO 22/09.)
- **Ca đã xếp mà KHÔNG DIỄN RA** (qua ngày không điểm danh có mặt, hoặc TA huỷ) ⇒ tự huỷ buổi (giữ dấu, `ly_do_huy` ghi "tự động"), case về Cần xếp với tag
  "⚠ Ca DD/MM không diễn ra · N lần" (`fn_btyeu_don_ca_khong_dien_ra`, chạy mỗi lần mở màn Xếp; lần đầu 23/09 huỷ 12 buổi treo). (CEO 23/09.)
- Nguồn dạng trong case: `bo_tro_yeu_dang.nguon` = duyet (bước Nội dung) · tay (+ Thêm dạng) · may (đề xuất máy, người bấm) · bao_dong (chuông, add thẳng).

---

## 2. ① Phát hiện — ai vào hàng đợi "Duyệt bổ trợ" (`listCandidatesLop`, `src/lib/danhgia.ts`)

- **4 kênh dữ liệu, mọi kênh chỉ nhìn 2 CỬA SỔ** (hiện tại + liền trước; cửa sổ = nửa tháng, tính theo `graded_at`):
  - ① **Chuyên đề tụt qua ngưỡng** bucket (đạt→cần luyện / cần luyện→yếu). Qua ngưỡng là đủ, KHÔNG xét biên độ.
  - ② **% dạng yếu: >15% HOẶC (>10% VÀ tỉ lệ dạng đạt <50%)** — chốt 10/09 (ca Đỗ Ngọc Tuấn 7K1: 2/19 yếu nhưng 14/19 đạt ⇒ không đáng bổ trợ).
  - ③ **ET:** ≥2 buổi ET trong 2 cửa sổ, TB <90% TB lớp.  ④ **MT:** bài MT gần nhất trong 2 cửa sổ <90% TB lớp.
- **Vào hàng đợi khi:** ≥1/4 kênh (đang CHẠY THỬ 1 tháng từ 23/08 — cuối 09 đo lại so với ≥2/4) **HOẶC** báo động (chuông 🚨 của GV/TA ở chấm
  ET/MT/BTVN/Đánh giá sau buổi — `canh_bao_yeu.nguon`; hoặc "hổng nền") **HOẶC** case đang mở mà máy đề xuất level khác.
- **Bị loại khỏi hàng đợi:** HS **đã có cờ bổ trợ (level ≥1)** — hàng đợi chỉ để MỞ cờ; HS có cờ xử ở Nội dung/Xếp/Đánh giá ca · HS đã chốt
  (kể cả giữ L0) trong cửa sổ hiện tại.
- Thái độ (từ `btvn_ket_qua`) + báo động **scope theo MÔN của buổi** (bug cross-môn 10/09: HS học 2 môn bị gộp); thái độ chỉ 2 cửa sổ gần nhất.
- Mức yếu của 1 dạng = mastery **5 lần đo gần nhất** (không theo cửa sổ, cùng engine màn Kết quả học tập). Cửa sổ chỉ quyết dạng có ĐƯỢC ĐẾM.
- Card duyệt có **chip "chạm: …"** (① ② ③ ④ · 🚨 · ⑤ thái độ · "Case mở") để biết em vào vì kênh nào.
- ⚠ PostgREST cap cứng **1000 dòng/query** dù `.limit()` lớn hơn ⇒ đọc `gami_grades`/`btvn_ket_qua`… phải `fetchAllRows` (`src/lib/pgrest.ts`)
  có `.order()` tất định. (09/09: 33/46 lớp từng bị cắt cụt, engine mù dữ liệu mới.)

## 3. ② Duyệt — level + MỨC ƯU TIÊN + máy ĐỔ DẠNG lúc mở case

- Level kiến thức: L1 = bổ trợ mức 1 (trước/sau giờ, TA) · L2 = buổi riêng (TA) · L3 = buổi riêng (GV cao cấp). L1–L3 mở case. Thái độ KHÔNG mở case.
- **`bo_tro_yeu.uu_tien`** (khác level — cùng level vẫn cần trước/sau): **3 Cao · 2 Thường (mặc định) · 1 Thấp**. Đặt khi duyệt (gợi ý máy: báo
  động hoặc ≥2 kênh kiến thức ⇒ Cao; chỉ ghi khi MỞ case mới); đổi nhanh bằng chip trên card ở Xếp lịch.
  **Mọi danh sách chờ + tự ghép ca chạy theo: ưu tiên cao trước → case mở lâu hơn trước.**
- **Dạng vào case LÚC MỞ (CEO 23/09 "cứ yếu là bổ trợ"): TẤT CẢ dạng mastery YẾU (<0,5) · ≥3 lần đo (bỏ tin thấp — "thấp = không
  quan trọng") · có lần đo trong 2 CỬA SỔ gần nhất** (cùng phạm vi kênh ②). Engine `dien` (src/gami/danhgia.js) đổ khi bấm duyệt;
  bản SQL cùng rule `fn_btyeu_dang_yeu_2_cua_so` / `fn_btyeu_fill_dang_yeu(case)` để đổ lại case rỗng. CHỈ THÊM, không xoá dạng
  người chọn. Sau khi mở, máy KHÔNG tự đổ thêm — chỉ nút "🤖 +N dạng yếu mới" (§1.1) + người ở màn Nội dung. Case máy không tìm ra dạng
  (chuông đỏ/thái độ, dạng yếu chưa đủ 3 lần đo — Hà Linh 11A1 09/09) ⇒ card Nội dung đỏ "Chưa có dạng — chọn tay".

## 4. Nội dung bài trên app — MCQ TUYỆT ĐỐI

- Mọi bài của ca (luyện · test cuối ca · retest · phiếu giấy) chọn câu qua **`_btyeu_chon_cau`** với điều kiện DUY NHẤT **`_kho_dk_mcq_sql`** =
  `kho_chuan` + (trắc nghiệm gốc có đáp án | có `dai_cau_form_tn` ĐÃ DUYỆT). `_kho_snapshot_cau` tự hiện form thành 4 đáp án. Né câu em đã gặp
  trong ca; cạn thì lặp lại câu MCQ.
- **KHÔNG có nhánh lùi** sang trả lời ngắn/đúng-sai. (19/09 từng để "dạng 0 MCQ thì tạm ra TLN" — CEO bác 20/09: luật là luật.) Dạng chưa có MCQ ⇒
  app báo "Dạng này chưa có câu TRẮC NGHIỆM — em học với thầy cô trên giấy"; việc cần làm là SINH + DUYỆT MCQ (phiên MCQ, `spec-mcq-quy-trinh-sinh.md`).
- Dữ liệu cũ còn câu trả lời ngắn ⇒ TA được **tích lại Đúng/Sai câu TLN** trong ca (`fn_btyeu_ta_sua_ket_qua`; log `bai_lam_cau_sua_log`; giữ
  `cham_at`; MCQ không cho chỉnh).
- ⚠ CHƯA nối form **Điền Ô** (`dai_cau_form_dien` — "trắc nghiệm từng phần" cho dạng nâng cao K6–7) vào bổ trợ — chờ CEO chốt có tính là MCQ không.

## 5. ④ Xếp lịch — màn "Xếp bổ trợ yếu" (8 tab, CEO 23/09: **Cần xếp · Đã xếp · Chờ retest · Hoàn thành** theo CASE như màn Bù · **📝 Retest** · ● Đang diễn ra · Ca bổ trợ · Lịch trực)

- **Lịch trực** `lich_truc_bo_tro`: môn × **KHỐI × BẬC** × thứ × giờ × phòng × **người trực (bắt buộc)** × hiệu lực × `suc_chua` (mặc định **3**).
  BK bổ trợ theo khối, KHÔNG theo lớp. Bậc theo `lop_bac.thu_tu`: **S > A > B > C** — **ca bậc cao nhận HS bậc thấp hơn, không ngược lại** (ca 7S
  nhận HS 7A; ca 7A KHÔNG nhận 7S). Bậc HS = `lop.bac` của lớp em đang học môn đó. Kết thúc lịch = đặt `hieu_luc_den`, không xoá cứng.
- **"Ca"** = nhóm buổi cùng (môn, ngày, giờ bắt đầu, NGƯỜI DẠY) — phòng không nằm trong khoá. **Tối đa 3 em/ca; đủ 3 ⇒ ca BIẾN MẤT khỏi mọi chỗ
  chọn**; mọi chỗ hiện ca đều kèm n/3. **Không ưu tiên "cùng bậc trước" — ai chốt trước chiếm chỗ trước** (bổ trợ phải báo phụ huynh).
- **Đề xuất ca cho 1 em:** (1) ca trực **khớp thứ + giờ của ca bổ trợ lần trước** ★ → (2) ca trực gần nhất còn chỗ → (3) không có lịch trực thì
  mặc định cũ (mức 1: ngay sau giờ tan buổi thường theo TKB, TA lớp; mức 2/3: theo ca cũ; mức 3 không kéo người cũ).
- **1 case tối đa 1 buổi "đã xếp, chưa học"** — trigger DB `trg_btyeu_mot_buoi_cho_hoc` chặn MỌI đường tạo buổi thứ hai (form, tự ghép…).
  - Cột **"Chờ xếp lịch"** = chưa có buổi chờ học + còn dạng chưa dạy (em học xong 1 buổi còn dạng ⇒ quay lại đây).
  - Cột **"Đã xếp · chưa bổ trợ"** = hiện ngày/giờ/phòng/người; quá ngày chưa học ⇒ viền vàng ⚠ (OPS soát).
  - Dạng gộp thêm SAU khi đã xếp ("đợt duyệt mới") ⇒ nhãn "＋N dạng mới — học chung buổi đã xếp, KHÔNG xếp lại".
  - Mở lại case đã xếp = **SỬA buổi đó**, không đẻ buổi mới. Giờ chọn bằng khung sẵn bước 30'. Báo trùng phòng = cảnh báo, không chặn.
- Tab **Chờ retest**: case dạy hết dạng — chỉ hiện ngày retest sắp tới, không xếp; nút thêm dạng yếu mới nếu máy đề xuất. Tab **Hoàn thành**: mọi case đã đóng
  vòng (kết quả đạt/một phần/chưa đạt/bỏ, ngày mở→đóng).
- Tab **📝 Retest** (CEO 23/09 "xứng đáng 1 tab riêng"): mọi bài retest tầng 2 theo BÀI — chip Chờ làm · Quá hạn (đỏ, số ngày trễ) · Đã nộp 14 ngày;
  mỗi bài: HS·lớp·TA lớp·ca bổ trợ gốc·từng dạng (số câu / đúng / ✓ đạt / ✗ trượt → dạy lại) · nút **📅 Dời ngày** (chỉ bài chưa nộp, ngày ≥ hôm nay —
  `fn_btyeu_retest_doi_ngay`) · Lịch sử. Nguồn `fn_btyeu_retest_theo_doi`. Vẫn KHÔNG xếp lịch: retest làm sau ET buổi thường, TA lớp đưa iPad.
- **Tab Ca bổ trợ:** ca 28 ngày tới + n/3 + **Tự ghép** các em chờ xếp vào ca trực còn chỗ (XEM TRƯỚC → xác nhận mới tạo buổi; theo thứ tự ưu tiên).
- Filter môn + khối dùng chung các tab. RPC: `fn_btyeu_case_xep_lich` · `fn_lich_truc_cua_hs` · `fn_btyeu_ca_sap_toi`.

## 6. ⑤ Ca diễn ra — HAI CHẾ ĐỘ, TA bấm chọn (21/09)

`buoi_hoc_hs.btyeu_che_do` = `'app'` | `'giay'` (NULL = chưa chọn). App TA: sau Điểm danh có khối **"Em làm bài bằng gì?"** — 2 nút to; đổi được
tới khi đóng ca.

| | 📱 **Trên iPad (app)** | 📄 **In giấy** (thiếu iPad) |
|---|---|---|
| Luyện | Em chọn dạng → cụm → lô 3 câu nối nhau trên app HS; máy chấm | TA **In phiếu luyện** (3/5/8/10 câu mỗi dạng, in NHIỀU phiếu được — phiếu sau né câu đã gặp) → em khoanh |
| Ghi kết quả | tự động | TA **nhập đáp án EM KHOANH (A–D), MÁY chấm theo key** — TA không tự phán đúng/sai; bấm lại ô đang chọn = xoá |
| Đóng ca | TA bấm Đóng ca → sinh test cuối buổi | như bên |
| Test cuối ca | em làm trên iPad (chế độ thi, nộp 1 lần) | TA **In bài kiểm tra** → em làm → TA nhập → **Nộp** (câu chưa nhập = bỏ trống = sai; nộp rồi KHOÁ) |
| Hoàn tất | nhận xét + mức → hoàn tất | như bên |

- Bài giấy KHÔNG phải đường riêng: là `bai_test` loại `bo_tro`/`bo_tro_test` có **`in_giay_at`**, sinh bằng CÙNG bộ chọn câu + snapshot của app ⇒
  tiến độ luyện, test cuối ca, câu-đã-gặp, mastery đều thấy như bài app. RPC: `fn_btyeu_in_sinh · fn_btyeu_in_lay · fn_btyeu_giay_nhap ·
  fn_btyeu_in_test · fn_btyeu_giay_nop`. Bản in: đề theo dạng (A–D 2 cột, ảnh, công thức), NGẮT TRANG, trang ĐÁP ÁN + lời giải cho thầy cô.
- Retest tầng 2 (sau ET buổi thường, 3–7 ngày) vẫn làm trên app như `PLAN-botro-yeu-ca.md` §2.
- App TA là PWA tự cập nhật ⇒ bản mới chỉ ăn sau khi ĐÓNG HẲN app mở lại.

## 6b. Lịch sử bổ trợ (CEO 23/09) — nút 🕘 CHỈ ở card màn Duyệt bổ trợ (+ modal Dashboard), KHÔNG ở màn Xếp

`fn_btyeu_lich_su_hs(hs, mon, 14)` → popup dòng thời gian TOÀN BỘ hoạt động 2 tuần (chọn 14/30/60 ngày): buổi yếu/bù/đuổi (điểm danh, dạng dạy, luyện,
test cuối ca, nhận xét, 📱/📄, lý do huỷ) · retest (đạt/trượt từng dạng) · lượt duyệt level · báo động · case mở/đóng. `LichSuBoTroModal.tsx`.

## 7. Theo dõi — tab "● Đang diễn ra" (ERP → Xếp bổ trợ yếu)

`fn_btyeu_ca_theo_doi(ngay)`: mọi ca trong ngày, nhóm theo giờ, tự cập nhật 15s (không blank). Trạng thái: **Chưa điểm danh · Vắng · Đang luyện ·
Im lâu (≥5', viền vàng) · Đã đóng chờ em làm test · Test xong chờ nhận xét · Hoàn tất**; badge chế độ 📱/📄/chưa chọn; ngay tại dòng ca:
🖨 In tài liệu · ✎ Nhập kết quả · 🖨 In lại (cả phiếu luyện lẫn TEST cuối ca).
**23/09: tab này = MỌI bổ trợ liên quan ngày đó** — toggle bar Yếu · Bù · Đuổi · Retest (`fn_bo_tro_trong_ngay`): bù/đuổi hiện giờ·phòng·người·HS·điểm danh
(xử lý ở màn Bù/Đuổi); retest đến hạn hiện HS·lớp·TA lớp·đã nộp/quá hạn.

## 8. Quy ước UI bắt buộc (đã ghi CLAUDE.md §2 React)

Sau mutation **vá đúng phần tử tại chỗ, KHÔNG reload cả danh sách** (duyệt xong ca rời hàng đợi ngay, không trắng màn, không cuộn về đầu); màn
hàng đợi **nhớ filter + list + vị trí cuộn + khối đang mở** khi rời màn quay lại (cache module-level, có nút ↻).

## 9. Bản đồ code / DB

- **Lib:** `src/lib/danhgia.ts` (engine phát hiện, duyệt) · `src/lib/botro_yeu.ts` (case, dạng, xếp lịch, lịch trực, ca sắp tới, ưu tiên) ·
  `src/lib/botro_yeu_ca.ts` (ca: app HS/TA, in giấy, chế độ, theo dõi, lịch HS) · `src/lib/pgrest.ts` (`fetchAllRows`) · `src/gami/danhgia.js` (engine thuần).
- **Màn ERP:** `src/screens/danhgia/` — `DuyetBoTroYeuScreen` · `DashboardHocTapScreen` (`DuyetKhoi`, `KenhChips`) · `NoiDungBoTroYeuScreen` ·
  `XepLichBoTroYeuScreen` (+ `TheoDoiCaBoTroTab`, import `TrangIn`/`NhapKetQua` từ `ta/PhieuGiayYeuTA.tsx`) · `TrangThaiCaBoTroScreen` · `DanhGiaCaBoTroScreen`.
- **App TA:** `src/screens/ta/CaBoTroTA.tsx` (+ `PhieuGiayYeuTA.tsx`: `TrangIn`, `NhapKetQua` — TA-native, ERP import ngược lại từ đây).
  **App HS:** `src/screens/hocsinh/CaBoTroHS.tsx` (+ `LichBoTroHS`, `BoTroBanner`, dùng chung `CardBai`/`Chevron` từ `HocTuDau.tsx`), `HomeHS.tsx`.
- **Bảng:** `bo_tro_yeu` (+`uu_tien`) · `bo_tro_yeu_dang` · `lich_truc_bo_tro` · `hs_level` / `hs_level_log` · `canh_bao_yeu` ·
  `buoi_hoc`/`buoi_hoc_hs` (+`btyeu_che_do`) · `bai_test` (+`in_giay_at`) / `bai_test_cau` / `bai_lam` / `bai_lam_cau` · `bai_lam_cau_sua_log`.
- **Migration (09→21/09):** `202609091750` lịch HS · `202609141708` lịch trực · `202609161637/1639/1651` ca sắp tới, sức chứa, khối+bậc ·
  `202609191317` + `202609191922` MCQ · `202609191717` TA chỉnh TLN · `202609201300` ưu tiên + chặn xếp lại · `202609211729` in giấy + theo dõi ·
  `202609211801` 2 chế độ + test giấy · `202609221344` 4 trạng thái vòng (giai_doan, nguon dạng, dạy lại reset dat) · `202609221346` đề xuất dạng mới (không tự gộp) · `202609221354` báo động add thẳng · `202609231621` tab case + dọn ca không diễn ra + lịch sử + bổ trợ trong ngày · `202609231649` tab Retest (theo dõi + dời ngày, `_kho_ten_dang`) (không tự gộp).
- **Script chẩn đoán (read-only):** `scripts/_diag_*` — vd `_diag_lydo_hs.ts` (vì sao 1 HS vào hàng đợi), `_diag_kenh2_nguong.ts`,
  `_diag_mcq_nguon_botro.mjs`, `_diag_25dang_form.mjs`, `_diag_case_xep_lich.ts`, `_diag_ta_tln.ts`.

## 10. Còn treo (21/09)

1. **25 dạng đang nằm trong case mở chưa có MCQ** (12 case mà mọi dạng đều 0 MCQ ⇒ app không có gì để luyện) — việc của phiên MCQ: 92 form K9 đã
   sinh chờ duyệt · K6–7 nâng cao là form Điền Ô (bổ trợ chưa đọc loại này) · K10–11 chưa sinh.
2. In giấy: chưa chọn được in RIÊNG 1 dạng (mỗi phiếu lấy mọi dạng còn mở); trình bày bản in chưa chỉnh theo bản giấy thật.
3. 8 buổi "đã xếp, quá ngày chưa học" (đo 20/09) đang chặn xếp buổi mới cho các em đó — OPS soát (học rồi chưa hoàn tất? vắng chưa huỷ?).
4. Box "Bài tập được giao" ở app HS: chưa định nghĩa.
5. Cuối 09: đo lại ngưỡng vào hàng đợi ≥1/4 kênh vs ≥2/4.
6. `npm run migrate` đang vấp 4 migration treo của phiên Sổ tay (permission) ⇒ áp riêng bằng `node scripts/migrate.mjs --only <file>`.
7. `lop.bac` lệch tên lớp ở vài lớp (6S1/6S2/7S3 ghi bậc A; 3A1 ghi S) — engine theo `lop.bac`; soát ở màn Lớp.

## 11. Cập nhật 22/09 — đồng bộ giao diện với Bổ trợ Đuổi + mastery test/luyện

- Card màn "ca diễn ra" (app HS: danh sách dạng/cụm) đổi sang khuôn CardBai (icon box +
  tên/mô tả + chevron) — y hệt Bổ trợ Đuổi, dùng chung component từ HocTuDau.tsx.
  Backdrop (trời/nhân vật/quote) đã bọc màn này từ trước — chỉ màn LamBai/LamET (đang
  luyện/đang test) không bọc.
- TrangIn/NhapKetQua (in phiếu giấy + nhập kết quả) chuyển từ màn ERP desktop
  (TheoDoiCaBoTroTab.tsx) sang file TA-native (ta/PhieuGiayYeuTA.tsx) — ERP import
  ngược lại từ đó. App TA không còn mượn component từ màn ERP desktop nữa (đúng luật
  đã áp cho Đuổi).
- fn_mastery_cells: test cuối ca (bai_test.loai='bo_tro_test') giờ tính vào mastery
  chung của hệ thống (gán src='et', giống ET). Luyện (loai='bo_tro') VẪN không tính,
  chỉ để em luyện. Retest tầng 2 / dat của case — KHÔNG đổi gì, vẫn chạy y hệt cũ.
- KHÔNG đụng: 4 kênh phát hiện, duyệt+ưu tiên, lịch trực khối+bậc, cụm luyện+lô 3 câu,
  4 trạng thái vòng, báo động chuông — giữ nguyên 100% như trước 22/09.
