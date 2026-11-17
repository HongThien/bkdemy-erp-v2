# spec-mastery.md — MASTERY / ĐO LƯỜNG (spec #20 của bộ 20 spec)

> **Trạng thái: ĐÃ VIẾT 17/11/2026 — Thùy chốt 5 điểm lệch + xoá A–F (§10), tất cả ĐÃ ÁP; nguồn cũ (`spec-danh-gia-cuoi-cap`, `PLAN-mastery-ban-do-moi`) đã vào `_luu-tru/`.** Viết lại từ: CLAUDE.md §5 · `spec-danh-gia-cuoi-cap.md` · `PLAN-mastery-ban-do-moi.md` ·
> `spec-bo-tro.md` §1 · `spec-van-hanh-tuan.md` §4.3, §5.6 · HANDOFF (mục "Mastery theo lần", "Dashboard học tập") · DEVLOG 10 → 16/11.
> **Mọi luật ở §2–§7 đã đối chiếu với hàm ĐANG CHẠY trong DB ngày 17/11** (`pg_get_functiondef`). Chỗ code lệch luật Thùy đã nói ⇒ không tự sửa, ghi ở §10.
> Spec này thắng các file nguồn ở phần đo lường. Luật mastery MỚI chỉ ghi vào đây.
> **Đọc file này TRƯỚC khi** sửa bất kỳ hàm `_mastery_*` / `fn_mastery_*` / `_do_o*` / dạng yếu / nhóm yếu, hoặc thêm màn / hàm đọc mastery.

---

## 0. Đích

- Trả lời một câu cho mọi người (GV · TA · trưởng khối · HS · PH · máy): **em X đang nắm nút kiến thức Y tới đâu, đo bằng bao nhiêu lần, có đủ tin không.**
- **Đơn vị = (học sinh × nút kiến thức)**, trong một môn. Nút có 4 cấp: **dạng bài · nhóm bài · chuyên đề · chủ đề**. **Nhóm bài là cấp chính** để kết luận và bổ trợ; dạng là cấp phụ (Thùy 10/11).
- **Mastery KHÔNG lưu làm dữ liệu gốc — suy từ các lần đo.** Bảng lưu sẵn (§7) chỉ là bản chụp để đọc nhanh, lệch thì tính lại được từ lần đo. Đổi bản đồ / đổi gán dạng ⇒ mastery tự đổi theo, không phải sửa số.
- Một công thức, một chỗ, chạy y hệt mọi môn (§1.6 CLAUDE): khác nhau chỉ ở **hàm quy câu → nút** theo khuôn, không ở công thức.

## 1. Khái niệm

| Từ | Nghĩa |
|---|---|
| **Lần đo** | Một bài làm có chấm: 1 ET · 1 MT · 1 BTVN · 1 khảo sát · 1 bài test trên app. Cùng ngày làm BTVN và ET ⇒ 2 lần. |
| **% của một lần ở một nút** | Trung bình điểm các câu của lần đó **thuộc nút đang xét** (Đúng 1 · Một phần 0,5 · Sai 0). |
| **Mastery của ô** | Trung bình % của **≤ 5 lần gần nhất** trong **30 ngày** (Hình–Học: ≤ 3 lần). Mọi lần ngang nhau. |
| **Mức** | **Đạt** ≥ 80 % · **Cần luyện** 50–79 % · **Yếu** < 50 %. |
| **Chưa đo** | 30 ngày không có lần nào ở nút ⇒ **không có dòng**. Không phải 0, không phải yếu (CLAUDE §1.5, §5). |
| **Độ tin** | Theo số lần trong 30 ngày: **cao** ≥ 5 · **TB** ≥ 3 · **thấp** < 3 (Hình–Học: 3 / 2). Ít lần = độ tin thấp, KHÁC mastery thấp. Màn luôn hiện số lần cạnh %. |

## 2. Nguồn đo — cái gì là một lần

Một nguồn lượt đo DUY NHẤT: `_mastery_luot_do_quy`. Mỗi dòng = (HS · câu · giá trị · thời điểm · kênh · khoá lần).

| Nguồn (bảng) | Khoá "một lần" | Thời điểm của lần | Kênh |
|---|---|---|---|
| Chấm buổi `gami_grades` ⨝ `gami_session_problems` — phase `et` · `mt` · `btvn` (kể cả buổi bù, khảo sát) | phase + buổi | **ngày buổi** (giờ VN); không gắn buổi ⇒ lúc chấm | `et` · `mt` · `btvn` |
| Bài trên app `bai_lam_cau` ⨝ `bai_lam` ⨝ `bai_test` | một bài làm (`bai_lam.id`) | ngày buổi của bài; không có ⇒ lúc chấm câu | **TEST** `et` · `de_thi` · `bo_tro_test` · `bu_test` · `htd_test` ⇒ **et** · `btvn` · `giao_trinh` ⇒ **btvn** · `tu_luyen` ⇒ **tu_luyen** · **LUYỆN không tính** (Thùy 17/11 — §10.1, §10.2) |
| Phiếu bổ trợ giấy `bt_grades` | một phiếu | lúc chấm | `bt` (30 ngày tới 17/11: 0 dòng) |

**MASTERY = BẢN CÓ BTVN (Thùy 17/11 "mastery luật mới tính BTVN" → "chuyển hết").** Kênh tính: `et` · `mt` · `btvn` · `bt`.
- Mọi hàm DB và màn đọc mastery đều gọi với `p_include_btvn = true` (4 hàm cuối chuyển ở mig `202611171038`: trợ lý · ôn tập BTVN · thành tựu tháng · vinh danh;
  client `src/lib/mastery.ts` luôn `true`, KQHT bỏ nút "Gộp BTVN" — app GV màn HS + tab Lớp đi theo).
- Tham số `p_include_btvn` vẫn còn trong chữ ký hàm (giữ cho chỗ gọi cũ). **Bản lưu sẵn chỉ còn bộ có BTVN** (bộ "chỉ ET + MT" đã xoá — mig `202611171047`);
  gọi với `false` thì tính trực tiếp (chậm, không ai gọi). **Hàm / màn mới: luôn gọi với `true`.**

**Không tính:**
- **Tự luyện** — trừ HS khối **3 · 4 · 5** (Thùy 10/11 + 12/11: 4T · 5T cũng KHÔNG tính tự luyện). Lý do: mỗi phiên tự luyện = 1 lần, đẩy ET/BTVN ra khỏi cửa sổ 5 lần.
- **Mọi bài LUYỆN** (Thùy 17/11: "chỉ test mới tính, luyện không tính"): `bo_tro` (luyện bổ trợ yếu) · `bu_luyen` · `htd_luyen` · `retest` · `on_thi_luyen` · `thi_thu` (thi thử — Thùy 23/10).
  Code dùng **danh sách CHO PHÉP** các loại bài được tính ⇒ thêm `bai_test.loai` mới thì phải quyết tường minh nó là test hay luyện.
- Phiếu bổ trợ giấy `bt_grades` hiện vẫn trong nguồn "mọi nguồn" (bảng 0 dòng từ trước tới 17/11 — không ảnh hưởng số; nếu dùng lại thì xếp test/luyện theo luật trên).
- ET / đề thi trên app **chưa nộp** (`bai_lam.trang_thai <> 'da_nop'`).
- Câu làm trên app đã có **bản sao** trong bảng chấm buổi (`gami_grades.bai_lam_cau_id`) ⇒ chỉ lấy bản chấm buổi (TA sửa tay ở đó) — nếu không mỗi câu tính 2 lần (sửa 23/10).
- Câu **không quy được về nút** (§3) ⇒ bỏ khỏi lần đó; lần không còn câu nào ở nút ⇒ không thành lần ở nút đó.
- **Không có trọng số nguồn** (Thùy 10/11: bỏ MT 3 · ET 2 · khác 1). Không đặt số câu tối thiểu cho một lần (lần 1 câu vẫn tính).

## 3. Quy câu → nút ("đo đi theo câu")

- Số đo đi theo **câu** (`ma_cau`), không theo mã dạng ghi lúc chấm: dạng của một lần = dạng **HIỆN TẠI** của câu (CEO 08/10, bật 12/10). Gán lại dạng cho câu ⇒ lịch sử đo của câu đó chuyển theo.
- Một cửa dispatch `_do_o_quy(bản đồ mới?, môn một vùng?, mã câu, mã dạng chép)`:
  1. bài **mô hình Hình–Luyện** ⇒ không quy ở đây, đo ở đường riêng (§6);
  2. **KHTN · Vật lý · Hoá học** ⇒ hàm quy của từng môn (`_khtn_do_o_bdm` · `_vatly_do_o_bdm` · `_hoahoc_do_o_bdm`);
  3. **Toán, bản đồ mới** (công tắc `mastery_ban_do_moi` BẬT) ⇒ `_do_o_bdm`: dạng bài mới theo thứ tự gán câu → gán câu gốc → gán cụm cũ → dạng cũ ứng đúng 1 dạng bài → AI đề xuất; HGT theo `hgt_bdm_gan_cau`; khối còn bản đồ cũ đọc `_bdm_khoi_giu_cu` (một nơi quyết);
  4. còn lại ⇒ bản đồ cũ `_do_nhom_cua_o`.
- Không quy được ⇒ NULL ⇒ ô trống, tự lấp khi câu được gán (CLAUDE §1.5: không đoán).
- **Cuộn lên 4 cấp** (`_mastery_lan_d`): dạng bài → nhóm (`dai_bdm_dang_bai.nhom_id`) → chuyên đề → chủ đề. **Hình–Học: bài học = dạng = nhóm = chuyên đề** (Thùy 28/10), chủ đề lấy từ bài học. KHTN · Lý · Hoá cuộn qua `tl_bdm_dang_bai_v` / `tl_bdm_nhom_v`.
- Quy dạng là bước tốn nhất của lõi ⇒ tính **một lần cho mỗi cặp (câu, mã chép)** (CTE `materialized`), không chạy lại cho từng lượt đo.
- **Đường nhanh theo tập (17/11, mig 202611171340):** trong `_mastery_luot_do_quy`, cặp thuộc "đường thường" — bản đồ mới BẬT · câu có trong `dai_cau_hoi` · không có trong kho KHTN / Lý / Hoá · mã chép không phải bài mô hình · (đã có dạng bài hoặc câu chưa xoá) — được quy **cả tập một lượt** bằng bảng tra `bdm_cau_dang` (CTE `cap_n`), đúng bằng nhánh "câu có ở kho Đại ⇒ `dang_bai_id`" của `_do_o_bdm`. Mọi cặp khác vẫn gọi `_do_o_quy` từng cặp. Đã so 31.542 cặp của cả hệ + 60 HS: lệch 0; hàm tổng quan HS trung vị 631 → 202 ms.
  **⚠ Đổi luật quy ở `_do_o_quy` / `_do_o_bdm` (thứ tự ưu tiên, điều kiện câu đã xoá, khối giữ bản đồ cũ…) thì PHẢI đổi cả `cap_n` trong `_mastery_luot_do_quy`**, rồi so lại mọi cặp (kịch bản: so `cap_n` với `_do_o_quy` trên toàn bộ cặp của `gami_session_problems` ∪ `bai_test_cau` ∪ `bt_grades`). Bảy bảng `cap_n` đọc cùng một policy `la_thanh_vien()`; đổi policy của một bảng thì xem lại.

## 4. Công thức — MỘT chỗ

Toán: `_mastery_lan_cap_t` · KHTN / Lý / Hoá: `_mastery_mon_cap` (cùng công thức, không có ngoại lệ Hình–Học). Các hàm khác chỉ là lớp mỏng gọi vào đây.

1. Lấy lần đo trong **30 ngày tính tới mốc** (mốc = `p_den` nếu có, không thì bây giờ) (Thùy 10/11).
2. **Mỗi cấp tự gộp lần của mình:** một BTVN rải câu vào 3 dạng cùng nhóm ⇒ cấp dạng 3 lần, cấp nhóm 1 lần (gộp mọi câu của BTVN thuộc nhóm).
3. Xếp lần theo **thời điểm giảm dần, cùng thời điểm thì theo khoá lần giảm dần** — mọi hàm cùng xếp "gần nhất" trên một tập PHẢI dùng chung khoá này (bài học 23/10).
4. `score` = TB % của ≤ 5 lần gần nhất (Hình–Học ≤ 3). `n` = **số lần trong 30 ngày** (không chỉ 5). Mức + độ tin theo §1.
5. **Tính tại một mốc quá khứ** (`p_den`): chỉ dùng lần trước mốc ⇒ "mastery của em tại 00:00 thứ Hai" tính ngược được bất kỳ lúc nào (dùng cho chụp tuần, báo cáo, kết quả bổ trợ trước/sau ca).
6. Tham số cửa sổ (5 · độ tin 5 / 3) truyền vào hàm; **chỉ bộ mặc định 5 / 5 / 3 được lưu sẵn** (§7).

## 5. Dạng yếu · nhóm yếu · HS yếu (Thùy 13/11 — MỘT luật)

- **Dạng yếu** = ô cấp dạng có mức **Yếu**. **Nhóm yếu** = ô cấp nhóm có mức **Yếu**. Hai số đếm **độc lập** trên cùng nguồn (nhóm gộp mọi lần của các dạng trong nhóm) — không suy cái này từ cái kia.
- Luật "2 cửa sổ" (dạng chưa đạt trong nhóm yếu + có đo trong 2 nửa tháng) **đã bỏ** (mig `202611131539`).
- Mọi chỗ đếm dạng yếu đi qua **`_btyeu_dang_theo_nhom`** (giữ tên + chữ ký cũ; tham số cửa sổ cũ không còn dùng): Dashboard học tập · QLCL · KPI báo cáo tuần · đổ dạng vào case yếu · "+N dạng yếu mới" · popup chốt.
- **Tại một mốc:** `_dang_yeu_tai_lo(HS[], môn, mốc)` (chia lô 20 em) = luật trên + bài mô hình Hình–Luyện mức yếu. **Chụp tự động 00:00 thứ Hai** (`_dang_yeu_chup_tuan` → `dang_yeu_dau_tuan`); ảnh là bộ đệm, lệch thì tính lại từ hàm.
- **Hiện tại:** sổ tính sẵn `dang_yeu` (`_qlcl_lam_moi_nen`, 5 phút) → `dang_yeu_hien_tai`.
- **HS yếu = em có ≥ 1 NHÓM yếu** ở môn đó (Thùy 17/11 — thống nhất theo nhóm; box trưởng khối chia ≥ 3 · 2 · 1 nhóm).
  Ảnh chụp `dang_yeu_hien_tai` / `dang_yeu_dau_tuan` có cột **`so_nhom_yeu` + `nhom`** (tên · % · số lần), một nguồn **`_nhom_yeu_tai_lo(HS[], môn, mốc)`**
  (mig `202611171134` · chụp bù `…1135` cho ảnh hiện tại + tuần 09/11, 16/11). Đếm theo nhóm ở: Báo cáo tuần `fn_bctk_so` (phien_ban 2, thêm chỉ số **Nhóm yếu**) ·
  QLCL `fn_qlcl_tong_quan` · box trưởng khối `fn_qlcl_nhom_yeu` (trước 17/11 đếm "nhóm có chứa dạng yếu" — sai luật) · `fn_qlcl_dang_yeu_hs` (mig `202611171137`).
  Đo 17/11 (Toán): HS yếu theo dạng 312 → theo nhóm 261. Báo cáo đã nộp trước 17/11 giữ số snap theo dạng (phien_ban 1, màn ghi "bản cũ").
  Em chỉ yếu ở bài mô hình Hình–Luyện (không có nhóm) không tính là HS yếu.
- Số đã chụp / đóng băng trước 13/11 giữ nguyên (lịch sử, sổ bất biến).

## 6. Hình–Luyện (bài mô hình) — đường đo riêng

- Câu của bài mô hình (`hinh_baitoan`) không đi qua §3 (nút = bài mô hình); đo ở **một** hàm `_mastery_cells_hinh_tai` (`fn_mastery_cells_hinh` chỉ gọi vào đó).
- **Luật (Thùy 17/11 "chuyển sang luật mới toàn bộ"):** như §2 + §4 — một lần = một bài làm · TB ≤ **3** lần gần nhất (thang Hình 3, CEO 14/10) · 30 ngày tới mốc · không trọng số · chỉ TEST tính, luyện / retest không tính · độ tin 3 / 2.
- *Trước mig `202611171010`:* theo câu, 3 câu gần nhất, trọng số MT 3 · ET 2 · khác 1, không giới hạn 30 ngày, có tính luyện bổ trợ + retest.
- Dashboard học tập từ 10/11 **không còn cột Hình–Luyện** (chưa quy câu Hình–Luyện vào nhóm). Bổ trợ Hình chạy riêng (`spec-bo-tro`).

## 7. Lưu sẵn (cache) — đọc nhanh mà luôn đúng

**Luật kiến trúc** (CLAUDE §2.0, `spec-kien-truc` K3): mọi thứ suy từ lịch sử đo đọc qua bản lưu sẵn; **cấm hàm đọc quét lại toàn bộ lịch sử làm bài mỗi lượt gọi.** Bảng phụ suy từ mastery (dạng đã học theo lớp, mục tiêu tuần, dạng yếu) bám mốc `mastery_luu_san_tinh.tinh_at`.

| Bảng | Nội dung (17/11) |
|---|---|
| `mastery_luu_san` | Toán: (HS × cấp × nút) → score · n · mức · độ tin · lần gần nhất; chỉ bộ có BTVN (`btvn = true`). ~28 nghìn dòng |
| `mastery_luu_san_mon` | KHTN · Vật lý · Hoá học, cùng khuôn. ~5,4 nghìn dòng |
| `mastery_luu_san_tinh` | mỗi em: lúc chụp + **mốc** (lùi 2 phút). 376 em |
| `mastery_ban_log` | nhật ký "em bẩn" **chỉ-chèn** (không upsert — upsert trên khoá duy nhất chặn HS nộp bài khi có giao dịch dài, đã dính 10/11 + 14/11) |

- **Đánh dấu bẩn:** 54 trigger cấp câu lệnh trên các bảng nguồn (`gami_grades` · `gami_session_problems` · `bai_lam` · `bai_lam_cau` · `bai_test_cau` · `bt_grades` · `buoi_hoc` (ngày) · `hoc_sinh` (khối) · bảng gán / đề xuất / dạng bài của Đại · HGT · KHTN · Lý · Hoá · công tắc hệ thống). Gán dạng cho câu ⇒ đánh bẩn mọi em từng làm câu đó (kể cả câu con).
- **Làm mới:** sổ `mastery` của bộ điều phối (`tinh_san_dang_ky`, mỗi 5 phút, ngân sách 20 s) → `fn_mastery_lam_moi(20)`: lô 20 em, em bẩn cũ nhất trước → em chưa từng chụp → em thiếu cấp; **ghi phần khác biệt** (lượt thường ghi ~0 dòng); khoá advisory chống hai lượt chồng nhau. **Lưới đêm 02:00** (sổ `mastery_luoi_dem` → `fn_mastery_danh_dau_tat_ca`) đánh bẩn mọi em để lần quá 30 ngày rơi ra theo ngày.
- **Đọc:** `_mastery_lan_cap_nhanh` (Toán) · `_mastery_mon_doc` (môn một vùng). Chỉ dùng bản chụp khi gọi **tham số mặc định** (không mốc, cửa sổ 5 / 5 / 3, công tắc khớp); em sạch ⇒ đọc bảng, em bẩn / chưa chụp ⇒ tính trực tiếp ⇒ **luôn đúng**, chỉ khác tốc độ. Gọi tại mốc ⇒ luôn tính trực tiếp.
- **Kiểm:** `fn_mastery_doi_chieu(n)` so ngẫu nhiên n em bản chụp ↔ tính trực tiếp (14/11: 60 em lệch 0).
- Số đo 15/11: lượt 02:00 tính lại cả 376 em ~54 s; trung bình lượt nền 1,4 s. Đo 16/11: lõi môn một vùng `_mastery_mon_d` ~0,58 s / em (chậm nhất).

## 8. Ai đọc mastery (17/11)

| Cửa đọc | Ai gọi |
|---|---|
| `_mastery_lan_cap_nhanh` (cấp nhóm / dạng / chuyên đề / chủ đề, bản chụp) | Dashboard học tập `fn_dbht_bang` · Mục tiêu tuần `_mtt_tinh` · bổ trợ: `_btyeu_dang_theo_nhom` · `fn_btyeu_case_dang_nhom` · `fn_btyeu_dang_goi_y_nhom` · `_btk_*` · `fn_btk_*` · `_btnhe_dang_chot` · `_sau_gio_dang` |
| `_mastery_mon_doc` | `fn_dbht_bang` (KHTN · Lý · Hoá) |
| `fn_mastery_cells_moi` (cấp dạng, theo công tắc) | tự luyện (`_tu_luyen_chon_dang`, `_tu_luyen_mastery_dang`) · bản đồ phiêu lưu · ôn tập BTVN `fn_ontap_diem_dang` · thành tựu tháng · trợ lý · `hs_dang_hoc_tap` · client `src/lib/mastery.ts` (2 chỗ: 1 HS · nhiều HS) |
| `fn_mastery_cells_bdm` | `_dang_yeu_tai_lo` (nhánh công tắc tắt) · kết quả bổ trợ tuần · đề xuất / gợi ý dạng bổ trợ |
| `fn_mastery_cells_hinh` | bổ trợ Hình (`fn_hinh_yeu_*`, `fn_btyeu_*`) |
| Lịch sử từng lần: `_mastery_lan_d` · `fn_dbht_o_lich_su` · `fn_mastery_lan_do_moi` | popup ô Dashboard · KQHT · màn HS app GV |
| `fn_tong_quan_hs` | Tổng quan KQHT · Report PH (16/11: 1,4 s, gốc là bước quy dạng — chưa sửa) |

**Thêm màn / hàm mới đọc mastery:** đi qua `_mastery_lan_cap_nhanh` / `_mastery_mon_doc` (hoặc hàm đã có ở bảng trên). Cấm tự viết lại công thức, cấm đọc thẳng `gami_grades` / `bai_lam_cau` để ra mức, cấm tính mastery ở client.

## 9. Kênh nhìn thêm — KHÁC công thức có chủ ý

### 9.1 Đánh giá cuối cấp — xu hướng theo lần (Thùy duyệt 23/10; gộp từ `spec-danh-gia-cuoi-cap.md` 17/11)

**Đích:** lớp cuối cấp thấy **em đang lên hay xuống** ở từng mảng qua thời gian dài, không để một bài nhiều câu lấn át. Là **màn nhìn THÊM** (leaf `db_cuoicap`, khu Quản lý chất lượng) — mastery chính và bổ trợ không đọc nó.
**Phạm vi:** khối trong `_dgcc_tham_so()` = **5T · 9 · 12**; lần từ **15/06/2026** (năm học này). Khối nào còn bản đồ cũ: `_bdm_khoi_giu_cu` (5T đã sang bản đồ mới 31/10). Khối 9 Hình: chỉ tầng Chủ đề.

| # | Luật (Thùy 23/10) |
|---|---|
| L1 | **Một lần = một bài làm** (1 BTVN · 1 ET · 1 MT · 1 khảo sát · 1 test bổ trợ). Cùng ngày BTVN + ET ⇒ 2 lần. |
| L2 | **Mỗi tầng tự gộp lần của mình** (1 BTVN rải 3 chuyên đề cùng chủ đề ⇒ chủ đề 1 lần, chuyên đề 3 lần). |
| L3 | **% một lần** = điểm các câu của lần thuộc nút / số câu đó. **Không trọng số** lần, không trọng số nguồn. |
| L4 | Lần 1 câu vẫn tính. |
| L5 | **Nguồn:** ET · MT · khảo sát · BTVN (giấy, app, giáo trình) · test bổ trợ `bo_tro_test` · `bu_test` · `htd_test`. **Không:** tự luyện, game, luyện bổ trợ, retest, thi thử. |
| L6 | **Cửa sổ** (`_dgcc_cua_so`): Chủ đề **5 / 10** · Chuyên đề **5 / 10** · Nhóm bài **3 / 5** (TB ngắn / TB dài, chồng lấn). |

- **Xu hướng = TB ngắn − TB dài** (điểm %). Ngưỡng `_dgcc_nguong` (lấy từ SD thật trên 2.342 ô, ≈ 0,5 SD / 1,5 SD): chủ đề, chuyên đề **3 / 10** · nhóm **5 / 15**
  ⇒ `> rõ` ↑↑ · `nhẹ … rõ` ↑ · `±nhẹ` → · ↓ · ↓↓. Số lần **≤ cửa sổ ngắn** ⇒ "chưa đủ lần" (không hiện xu hướng); giữa ngắn và dài ⇒ TB dài lấy hết số lần đang có. Luôn hiện **số lần** cạnh TB.
- **Khác mastery chính (có chủ ý):** có khảo sát · điểm câu dùng **điểm đạt / điểm tối đa** khi có (không chỉ Đ / C / S) · thời điểm bài app = lúc **nộp** · không giới hạn 30 ngày (từ 15/06) · không lưu sẵn (tính lúc mở).
- Câu quy về nút bằng `_dgcc_nut` (cùng quy câu của bản đồ mới); không quy được ⇒ bỏ (§1.5). Hai hàm cùng xếp "gần nhất" phải chung khoá xếp, kể cả khi hoà (bài học 23/10).
- **Hàm:** `_dgcc_cau` (nguồn câu) → `_dgcc_lan` (lần × nút) → `fn_dgcc_hs` · `fn_dgcc_lop(lớp, tầng)` · `fn_dgcc_lan_nut` / `fn_dgcc_lich_su_nut` (popup từng lần); tham số `_dgcc_tham_so` · `_dgcc_cua_so` · `_dgcc_nguong` · `_dgcc_ten`.
  **Màn:** chọn lớp → tầng → lưới HS × nút (ô = TB dài + mũi tên + số lần), bấm ô ⇒ danh sách lần. Đo 23/10: khối 9 cả khối ~5 s, một lớp ~1 s.
- **Dashboard học tập** từ 10/11 tối **đọc mastery chính** (không còn kênh "10 câu gần nhất" riêng, không lọc tuần); popup ô = từng lần của nút.
- Elo / EXP / điểm rank app HS **không phải mastery** (`spec-kinh-te-nhiem-vu`).

## 10. Quyết định 17/11 (Thùy) — lệch phát hiện khi đối chiếu DB, và tình trạng sửa

| # | Lệch phát hiện | Thùy chốt 17/11 | Tình trạng |
|---|---|---|---|
| 1 | Code xếp mọi `bai_test.loai` lạ vào kênh btvn ⇒ luyện bổ trợ `bo_tro` (1.050 câu / 30 ngày) · `bu_luyen` 323 · `htd_luyen` 107 đang tính | **Chỉ test mới tính, luyện không tính** | ✅ mig `202611171010` ĐÃ ÁP 17/11 |
| 2 | `bu_test` · `htd_test` ở kênh btvn, `bo_tro_test` ở kênh ET | **Cả ba loại test tính như ET** | ✅ mig `202611171010` ĐÃ ÁP 17/11 |
| 3 | Hình–Luyện công thức cũ (theo câu, trọng số, không 30 ngày, có luyện + retest) | **Chuyển sang luật mới toàn bộ** (§6) | ✅ mig `202611171010` + `202611171025` (cấp quyền) ĐÃ ÁP 17/11. Đưa Hình–Luyện lại vào Dashboard theo nhóm: việc sau |
| 4 | CLAUDE.md §1 ghi "KP = dạng" | **Sửa** — nhóm là cấp chính | ✅ đã sửa CLAUDE.md §1 (17/11). Notion chưa |
| 5 | Hai định nghĩa HS yếu (báo cáo tuần theo dạng · box trưởng khối theo nhóm) | **Thống nhất theo nhóm yếu** (§5) | ✅ mig `202611171134` · `…1135` · `…1137` ĐÃ ÁP 17/11; client chưa deploy |
| 6 | Cấp 1 (K3 · 4 · 5) quy theo bản đồ cũ, Dashboard bỏ qua 345T | "tính sau" (Thùy 23/10) | ghi để nhớ |

**Số thử mig `202611171010` (17/11 10:12, giao dịch ROLLBACK, 361 HS đang học, 58 HS KHTN · Lý · Hoá):**
- **Toán, mọi nguồn:** ô dạng 14.641 → 14.634 (7 ô chỉ có luyện thành "chưa đo") · dạng yếu 1.668 → 1.679 · nhóm yếu 740 → 754 · 53 ô dạng + 52 ô nhóm đổi mức (17 + 18 ô thành yếu, 4 + 4 ô hết yếu) · HS có ≥ 1 nhóm yếu 260 → 259.
- **Toán, ET + MT:** thêm 45 ô dạng + 15 ô nhóm (test bù / học từ đầu nay vào bộ này) · yếu gần như không đổi.
- **KHTN · Lý · Hoá:** 0 thay đổi (không có bài luyện).
- **Hình–Luyện:** ô mọi nguồn 3.586 → 456 · ô yếu 497 → 133. **Toàn bộ** phần giảm là do **giới hạn 30 ngày** (đo lại: công thức cũ cắt 30 ngày cũng ra đúng 456 ô · 133 yếu) ⇒ ô chỉ có lần đo cũ hơn 30 ngày thành "chưa đo"; đổi sang theo lần + bỏ luyện chỉ làm 10 ô đổi mức. Ảnh hưởng: số bài mô hình yếu đổ vào bổ trợ Hình giảm mạnh.
- `fn_mastery_cells_hinh` sau khi thành lớp mỏng = `_mastery_cells_hinh_tai`: lệch 0 dòng.

**Việc kỹ thuật (CTO tự làm khi có lệnh, không cần quyết):** lõi môn một vùng `_mastery_mon_d` ~0,58 s / em (viết lại theo tập cần bộ đối chiếu trước) · `fn_tong_quan_hs` 1,4 s ·
dọn các nhánh "công tắc theo lần tắt" còn nằm chết trong `_dang_yeu_tai_lo` · `fn_btyeu_dang_yeu_2_cua_so_moi` · `fn_btyeu_de_xuat_dang_moi` · `_tu_luyen_mastery_dang` · `fn_mastery_lam_moi` (không bao giờ chạy, vô hại).

**Đã xoá 17/11 (Thùy "Xoá cả A–F"):** A bộ "chỉ ET + MT" của bản lưu sẵn (23.510 + 4.519 dòng, mig `202611171047`) · B bảng `mastery_ban` · C `_dy_so_nhom` · D `fn_mastery_nhom` ·
E đường lùi theo câu (`_mastery_cells_cau` + công tắc `mastery_theo_lan`; `_mastery_theo_lan_bat()` thành hằng `true`) — mig `202611171048_mastery_xoa_bang_cu…` ·
F màn so sánh bản đồ cũ ↔ mới (`MasteryBdmCongTac.tsx` + `fn_mastery_bdm_so_sanh`, mig `202611171048_mastery_xoa_ham_so_sanh…`).

## 11. Công tắc

| Công tắc (`he_thong_cong_tac`) | Đang | Tắt thì |
|---|---|---|
| `mastery_ban_do_moi` | BẬT | Toán quy theo bản đồ cũ |

Bật / tắt qua `fn_he_thong_cong_tac_dat(ma, bat)` ở SQL (màn admin 🔀 Mastery đã gỡ 17/11), có log; đổi công tắc ⇒ đánh bẩn mọi em.
**Mastery luôn đo theo LẦN** — không còn đường lùi theo câu (xoá 17/11; muốn quay lại phải dựng từ migration cũ trong git). `fn_mastery_cells` (bản gốc) đã không còn trong DB.

## 12. Luật khi sửa mastery (bài học đã trả giá)

- **Dựng từ định nghĩa đang chạy** (`pg_get_functiondef`), thay chuỗi bắt buộc khớp đúng 1 lần — nhiều phiên cùng sửa lõi (10/11 `fn_dbht_bang` bị phiên khác đổi mà không có file mig).
- **Đổi hàm lõi ⇒ đo MỌI hàm gọi nó với kích thước thật** (lớp, khối, cả môn), không chỉ hàm chính (10/11: Bổ trợ nhẹ vượt trần 8 s vì không đo). Danh sách người gọi: §8.
- **Đổi cách tính ⇒ so cũ–mới từng dòng trước khi áp** (bộ "tắt công tắc ⇒ trùng khít bản cũ"), trong giao dịch rollback.
- **Không DDL / lượt thử dài trên `mastery_luu_san` lúc có lớp** — 14/11 khoá độc quyền ~7 phút làm mọi lượt đọc treo tới trần 8 s (`spec-kien-truc` K26).
- Đổi **tên** tham số RPC ⇒ bản web đang chạy chết tới khi deploy ⇒ giữ hàm chuyển tiếp nhận tên cũ.
- Mã dạng chờ (`…000000`) không được ghi vào `bai_test_cau.ma_dang` (đẻ "dạng yếu" giả).
- Chú thích `--` chèn giữa dòng nuốt phần code còn lại của dòng (dính 24/10, 12/11) ⇒ dùng `/* */` hoặc đặt cuối dòng.

## 13. Bản đồ code

| Phần | DB | Màn |
|---|---|---|
| Nguồn lượt đo | `_mastery_luot_do_quy` · `_mastery_lan_do_quy` · `_mastery_lan_do` | — |
| Quy câu → nút | `_do_o_quy` · `_do_o_bdm` / `_do_o_bdm_core` · `_do_o` · `_khtn_/_vatly_/_hoahoc_do_o_bdm` | — |
| Công thức | `_mastery_lan_d` → `_mastery_lan_cap_t` / `_mastery_lan_cap` · `_mastery_mon_d` → `_mastery_mon_cap` · lớp mỏng `_mastery_lan_core` · `_mastery_cells_core` · `fn_mastery_cells_moi` / `_bdm` | — |
| Lưu sẵn | `mastery_luu_san*` · `mastery_ban_log` · `fn_mastery_lam_moi` · `fn_mastery_danh_dau_tat_ca` · `_mastery_hs_sach` · `_mastery_luu_san_doc` · `_mastery_mon_doc` · `fn_mastery_doi_chieu` | — |
| Dạng yếu | `_btyeu_dang_theo_nhom` · `_dang_yeu_tai_lo` · `_dang_yeu_chup_tuan` · `dang_yeu_dau_tuan` · `dang_yeu_hien_tai` · `_qlcl_lam_moi_nen` | Phòng TK › Chất lượng · Dashboard học tập |
| Hình–Luyện | `_mastery_cells_hinh_tai` · `fn_mastery_cells_hinh` | Bổ trợ Hình |
| Cuối cấp | `_dgcc_*` · `fn_dgcc_*` | `db_cuoicap` |
| Client | `src/lib/mastery.ts` (`getMasteryHS`, `dangInfoCuaMon`) · `src/lib/dashboardHocTap.ts` | `danhgia/DashboardHocTapScreen.tsx` · KQHT · app GV |
