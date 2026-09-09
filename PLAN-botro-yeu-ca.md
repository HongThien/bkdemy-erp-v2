# PLAN — Ca bổ trợ yếu: app HỌC SINH (làm bài) + app TRỢ GIẢNG (điều hành)

> Tiếp PLAN-botro-yeu.md bước 5 ("điểm danh / dạy / retest" — CHƯA LÀM). Story Thùy 03/09/2026, đã
> phản biện 2 vòng. Tài liệu này = bản để Thùy DUYỆT trước khi build. Chưa có dòng code nào.

---

## 0. Quyết định đã chốt (Thùy 03/09)

| # | Câu | Chốt | Hệ quả |
|---|---|---|---|
| 1 | Tài khoản trong ca | **Mỗi em 1 iPad, đăng nhập TÀI KHOẢN EM** (app học sinh, `hs.html`). **TA dùng máy riêng, tài khoản TA** (app TA, `ta.html`). Không đăng nhập tài khoản HS trên máy TA, không tài khoản TA trên máy em | 2 nhóm thao tác tách theo quyền: **làm bài** (HS) · **quyết định** (TA: điểm danh, đóng ca, nhận xét). Bài làm ghi đúng là em làm. RLS HS hiện có dùng lại được gần hết |
| 2 | Retest | **2 tầng.** Tầng 1 = **test cuối ca** (ngay sau khi TA đóng ca, nguồn `bt`) — đo ĐẦU RA CA, không đóng dạng. Tầng 2 = **bài riêng làm ngay sau ET của buổi học thường kế tiếp** (3–7 ngày, nguồn `rieng`) — bằng chứng độc lập để ĐÓNG DẠNG | KPI TA tính trên tầng 2, không trên tầng 1. Tầng 1 không ghi `retest_*` (cột đó dành tầng 2). Tầng 2 build ở pha sau (mục 9) |
| 3 | Ai chấm test cuối ca | **Em tự làm trên iPad, hệ tự chấm** (TN / ĐS / TLN như tự luyện). TA KHÔNG điền điểm test — chỉ nhận xét | Bỏ hẳn bước "TA điền dữ liệu test" trong story gốc — chỗ dễ chạy KPI nhất |
| 4 | Cụm | Mai (04/09) Thùy gắn cụm. **Dạng chưa có cụm → cả dạng = 1 cụm** (fallback trong hàm, không phải nhánh UI riêng) | Số thật 03/09: Đại 39/406 dạng có câu gắn cụm (1.691/16.436 câu) · Hình 4 cụm · KHTN 13 cụm. Fallback là đường CHÍNH lúc ra mắt, không phải ngoại lệ |
| 5 | Số câu test cuối ca | **Sàn 2 · trần 6.** ≥3 cụm đã học → 1 câu/cụm · 1–2 cụm → 2 câu/cụm · >6 cụm → lấy 6 cụm em làm KÉM NHẤT trong ca (tỉ lệ đúng thấp nhất) | Tham số nằm trong hàm DB, đổi không sửa app |
| 6 | Hết giờ | **Không đếm ngược, không nhắc.** Chỉ hiện giờ buổi. TA tự quyết lúc đóng ca | Bỏ khỏi scope |
| 7 | "Hoàn thành cụm" | **Không lưu ý kiến "TA thấy ổn".** Cụm đã học = có câu luyện của cụm trong ca (derive). Chuyển cụm = điều hướng. Kết thúc dạng = `day_at`/`day_buoi_id` trên `bo_tro_yeu_dang` (cột có sẵn), set lúc **đóng ca** cho mọi dạng có câu luyện | Đúng CLAUDE.md §4 pure-derive. Phép đo thật = test cuối ca + retest tầng 2 |
| 8 | Luyện 1 cụm bao nhiêu câu | **Không có lượt cố định — luyện tới khi TA bảo next.** Hệ đưa câu liên tục trong cụm; em bấm "Cụm khác"/"Về dạng" khi TA bảo | Kỹ thuật: sinh từng **lô nhỏ 3 câu nối nhau tự động** (hết lô → tự sinh lô mới, em không thấy ranh giới). Lô nhỏ để cạn câu thì lặp mượt, không đẻ bài rỗng |
| 9 | Em bỏ về không test | TA đánh dấu **"không test" + lý do → vẫn Hoàn tất ca**. Dashboard TA hiện tỉ lệ ca không test | Không treo ca |
| 10 | Máy TA | TA **chắc chắn có máy riêng** (điện thoại được) | Không có đường "đóng ca từ iPad em" |
| 11 | Mức 3 | **Cùng luồng**, chỉ khác người đứng ca (GV cao cấp) | Không nhánh riêng |
| 12 | Retest tầng 2 — ai sinh, khi nào | **Đóng ca bổ trợ = tự sinh luôn bài retest**, gắn **ngày = buổi học thường kế tiếp** của lớp em, **giao cho TA của lớp đó** (phan_cong_lop tg) cho em làm ngay sau ET buổi đó. Em làm trên iPad trung tâm, tài khoản em | Không cần ai bấm "sinh retest". TA lớp thấy task "Retest bổ trợ" trong Việc của tôi đúng ngày. Em vắng buổi đó → task tự trôi sang ngày sau (derive: chưa nộp & ngày ≤ hôm nay) |

**Nghĩa "cụm" dùng trong plan này** = đúng spec-cum-bai.md (Thùy duyệt 13/08): **lớp bài tương đương trong
một dạng** (một "góc nhìn"/bài mẫu + các biến thể thay thế được cho nhau), có `thu_tu` và tiền đề cụm↔cụm.
"Luyện một cụm" = làm các biến thể của cùng một bài mẫu tới khi ổn, rồi sang bài mẫu khác. "Test mỗi cụm 1
bài" = 1 biến thể **chưa gặp** trong ca của cụm đó. KP đo mastery **vẫn là DẠNG** (ranh giới bất di dịch
của spec đó) — cụm chỉ để sắp thứ tự luyện và sinh test.

---

## 1. Mô hình: 2 máy · 2 vai · 1 buổi

```
iPad EM (tài khoản HS, app hs.html)            Máy TA (tài khoản TA, app ta.html)
  ô "Bổ trợ" → ca hôm nay                        box "Bổ trợ yếu" → ca hôm nay của tôi (N em)
  → dạng của case → cụm → LUYỆN (LamBai)         → card mỗi em: điểm danh · tiến độ live
  → (TA đóng ca) → TEST cuối ca (LamET)          → "Đóng ca & sinh test" → xem điểm test
  → xem kết quả + lời giải                       → nhận xét (mẫu + tự gõ) + mức → "Hoàn tất ca"
            └──────────── cùng 1 dòng buoi_hoc(loai='bo_tro_yeu') + buoi_hoc_hs ────────────┘
```

- **Chân lý ở Postgres**, 2 app chỉ là 2 mặt của cùng 1 buổi. Không có kênh nào giữa 2 app ngoài DB
  (app HS **poll** hàm `fn_btyeu_ca_cua_toi` mỗi ~10s khi đang ở màn ca — repo chưa dùng realtime channel
  ở đâu, không mở thêm hạ tầng chỉ vì việc này).
- **Nhiều em cùng lúc** (mức 1 sau giờ, TA kèm 2–3 em): mỗi em 1 buổi riêng (đã vậy từ bước xếp lịch),
  máy TA hiện **danh sách card**, mỗi card 1 em, bấm vào là vào ca của em đó. Đây là câu trả lời cho
  "dùng tài khoản TA thì quản nhiều em thế nào" — TA không phải cầm iPad của em.

---

## 2. Luồng ca (theo story, đã sửa)

1. **Em đến.** TA mở card em trên máy TA → bấm **Có mặt** (`buoi_hoc_hs.diem_danh='co_mat'` +
   `bao_den_at`, hàm điểm danh có sẵn). Em **không đến** → **Vắng** → ca **huỷ có đếm số lần** (copy
   `botro.ts` bù — PLAN-botro-yeu §3 nhắc: KHÔNG copy `botro_duoi.ts`). Chưa điểm danh → iPad em
   KHÔNG thấy ca (ca chỉ hiện khi `diem_danh='co_mat'`) — chặn em tự mở luyện khi TA chưa sẵn sàng.
2. **iPad em** mở app học sinh → ô **Bổ trợ** (chỉ hiện khi hôm nay có ca đã điểm danh có mặt, chưa hoàn
   tất) → **danh sách dạng của case** (từ `bo_tro_yeu_dang`, yếu nhất trước; dạng đã `day_at` ở ca
   trước có nhãn "đã học lần 1").
3. **Chọn dạng → danh sách cụm** (theo `thu_tu`, cụm có tiền đề chưa luyện hiện gợi ý "nên làm sau X";
   dạng không cụm → 1 dòng "Cả dạng"). Bấm **Luyện** → hệ đưa câu **liên tục** trong cụm
   (`fn_btyeu_luyen_sinh` sinh lô 3 câu, hết lô app tự gọi lô mới — em không thấy ranh giới), làm bằng
   `LamBai` hiện có: 1 câu/màn → xác nhận → **chấm tức thì → đáp án + lời giải chi tiết** → câu tiếp (đúng
   "giống tự luyện cấp 1"; gợi ý = `bai_lam_goi_y` có sẵn). Luyện **tới khi TA bảo next** → em bấm
   **Cụm khác** hoặc **Về dạng** (2 nút luôn hiện ở góc). Không có nút "hoàn thành cụm", không có "lượt".
4. **TA theo dõi** trên máy TA: bảng tiến độ live per em → per dạng → per cụm: số câu · đúng · sai · số
   lần xem gợi ý · lượt cuối lúc nào. Em im >5 phút → card đổi màu. TA quyết chuyển dạng bằng cách
   **nói với em** — không cần nút điều khiển từ xa (story gốc để TA bấm trên iPad em; nay em bấm).
5. **Hết giờ (TA tự quyết)** → máy TA bấm **Đóng ca & sinh test** (`fn_btyeu_dong_ca`):
   - set `day_at = now()`, `day_buoi_id = buổi` cho mọi dạng **có ≥1 câu luyện** trong ca (dạng chọn mà
     chưa làm câu nào → không tick, ca sau làm tiếp);
   - **sinh 1 bài test** `bai_test(loai='bo_tro_test', hoc_sinh_id=em, buoi_hoc_id=buổi)` theo luật mục
     0.5, câu **chưa gặp trong ca** (loại cả câu luyện lẫn biến thể đã làm), snapshot `ma_cum` từng câu;
   - **sinh luôn bài RETEST tầng 2** `bai_test(loai='retest', hoc_sinh_id=em, lop_id=lớp em ở môn,
     ngay=ngày buổi thường kế tiếp theo TKB, buoi_hoc_id=ca bổ trợ này)`: mỗi dạng đã dạy trong ca
     **3 câu chưa gặp** (loại luyện + test cuối ca), trần 9 câu (>3 dạng → ưu tiên dạng yếu nhất lúc mở).
     Chưa có buổi thường nào trong 28 ngày tới → không sinh, ghi cờ cho OPS (hiện ở "Trạng thái ca").
   - **không có câu luyện nào** → ca đóng "không học", **không test, không retest**, TA vẫn nhận xét.
   - Idempotent: gọi lại → trả test đã sinh, không đẻ bài thứ 2 (bài học "bấm 2 lần đẻ 2 ca" 03/09).
6. **iPad em** (poll thấy test) → màn "Bài kiểm tra cuối buổi" → làm bằng **`LamET`** (chế độ THI: giấu
   đáp án tới khi nộp, chấm server, chỉ tính lần nộp đầu — thêm `'bo_tro_test'` vào `THI_LOAI`) → nộp →
   hiện điểm + lời giải. **Em bỏ về không làm test** → TA đánh dấu "không test" kèm lý do khi hoàn tất
   (ca vẫn hoàn tất được, nhưng dashboard TA hiện tỉ lệ ca-không-test).
7. **Máy TA**: thấy điểm test per dạng/cụm → **nhận xét** (chọn mẫu `nhan_xet_mau` theo môn + gõ thêm)
   + **mức** (`muc_ma` như đánh giá buổi thường) → **Hoàn tất ca** (`fn_btyeu_hoan_tat`): ghi
   `buoi_danh_gia` + `buoi_hoc.danh_gia_xong_at`. Đây là mốc "hoàn thành ca" duy nhất.
8. **Buổi thường kế tiếp (3–7 ngày sau).** TA của lớp thấy task **"Retest bổ trợ · tên em"** trong Việc
   của tôi (derive: `bai_test(loai='retest')` của lớp, `ngay ≤ hôm nay`, chưa nộp). Sau ET, TA đưa iPad
   trung tâm cho em → app học sinh (tài khoản em) hiện **"Bài kiểm tra lại"** (chỉ hiện khi `ngay ≤ hôm
   nay`) → `LamET` chế độ thi → nộp → hệ ghi lên **từng dạng** của case: `retest_diem` (tỉ lệ đúng câu
   dạng đó), `retest_at`, `retest_nguon='rieng'`, `dat = retest_diem > 0.5` → `dat` thì `dong_at`
   (đóng dạng, đúng ngưỡng migration 202607222255 "retest > 0.5"). Mọi dạng của case `dong_at` → case
   sang "hoàn thành" theo derive `layTienDoCa` (đã có). Em vắng buổi đó → task trôi sang ngày sau, không
   cần ai xếp lại.

---

## 3. Trạng thái ca — PURE-DERIVE (không thêm cột trạng thái)

| Hiển thị | Điều kiện |
|---|---|
| Chờ em | `buoi_hoc_hs.diem_danh is null`, ngày = hôm nay |
| Vắng / đã huỷ | `diem_danh='vang'` → `buoi_hoc.trang_thai='huy'` (đếm số lần như bù) |
| Đang luyện | có mặt, chưa có `bai_test(loai='bo_tro_test')` của buổi |
| Đã đóng ca, chờ test | có `bo_tro_test`, `bai_lam.trang_thai <> 'da_nop'` |
| Đã test, chờ nhận xét | `bai_lam.trang_thai='da_nop'`, `danh_gia_xong_at is null` |
| Đóng không học | `danh_gia_xong_at` có, không có `bo_tro_test`, không có câu luyện |
| Hoàn tất ca — chờ retest | `danh_gia_xong_at` có, `bai_test(loai='retest')` chưa nộp |
| Retest xong | `retest` đã nộp → từng dạng có `retest_diem`/`dat`; case đóng khi mọi dạng `dong_at` |

---

## 4. Data model — TÁI DÙNG bộ bài cá nhân của tự luyện, không đẻ hệ mới

**Dùng nguyên:** `bai_test` (bài, `hoc_sinh_id` = bài cá nhân) · `bai_test_cau` (snapshot câu) · `bai_lam` ·
`bai_lam_cau` (đáp án + verdict + `cham_boi`) · `bai_lam_goi_y` (lượt xem gợi ý) · `buoi_hoc_hs`
(điểm danh) · `bo_tro_yeu_dang` (`day_at`/`day_buoi_id`) · `buoi_danh_gia` (nhận xét, mức) · `nhan_xet_mau`.

**Thêm (migration, chờ Thùy gật — toàn ADD, không xoá/thu hẹp):**

| Việc | Vì sao |
|---|---|
| `bai_test.loai` CHECK thêm `'bo_tro'` (lô luyện trong ca) · `'bo_tro_test'` (test cuối ca) · `'retest'` (bài riêng tầng 2) | CLAUDE.md §2.1: thêm giá trị union TS mà quên nới CHECK = chết đúng lúc bấm nút |
| `bai_test.buoi_hoc_id uuid null FK buoi_hoc` | Bài thuộc CA BỔ TRỢ nào — nguồn cho tiến độ TA, "câu đã gặp trong ca", trạng thái derive, và nối retest về ca (qua `buoi_hoc_hs.bo_tro_yeu_id` ra case). ⚠ Với `retest`, `ngay` = ngày buổi thường kế tiếp (ngày LÀM) còn `buoi_hoc_id` = ca bổ trợ (NGUỒN) — cố ý, ghi comment cột. Tự luyện/ET để null |
| `bai_test_cau.ma_cum text null` | Snapshot cụm của từng câu lúc sinh (test cuối ca gồm nhiều cụm → phải ở tầng câu, không ở tầng bài). Text, không FK — cụm 3 bảng theo môn, cùng lý do `ma_dang` là text |
| RLS `bai_test_hs_read` mở thêm `or hoc_sinh_id = my_hoc_sinh_id()` (và `bai_test_cau` tương ứng) | Hiện HS đọc bài qua `hs_o_lop(lop_id)`; tự luyện "đi lậu" được vì set `lop_id` = lớp em. Bài bổ trợ mức 1 cũng có lớp, nhưng nói thẳng "bài của tôi thì tôi đọc" đúng hơn là dựa vào mánh lop_id |
| `bo_tro_yeu_dang.retest_nguon` CHECK **đồng bộ DB thật**: DB đang `('et','mt','rieng')`, file migration 202607241948 ghi `('bt','et','mt')` → **drift** | Viết migration mới ghi đúng `('et','mt','rieng')` + comment "tầng 2 = rieng". Không đụng dữ liệu |

**Không thêm:** bảng "cụm đã học", cờ "TA thấy ổn", cột trạng thái ca, bảng nhận xét mới.

**Mastery:** câu luyện trong ca và test cuối ca đều vào nguồn **`bt`** (đã có trong `EvalSrc`; trọng số
mastery 1, trọng số tầng level **0** — đúng ý "test cuối ca không tự nâng level"). Cần nối
`fetchBTEvals` (mastery.ts) đọc thêm `bai_lam_cau` của `bai_test.loai in ('bo_tro','bo_tro_test')` —
theo §2.0 việc này phải đi qua `fn_mastery_cells`, không tính ở client. **Verify lúc code:** hàm đó hiện
lấy nguồn `bt` từ đâu (bài tập bổ trợ giấy?) để không đếm đôi.

---

## 5. Hàm DB (luật §2.0 — app chỉ gọi)

| Hàm | Ai gọi | Làm gì |
|---|---|---|
| `fn_btyeu_ca_cua_toi()` | HS | Buổi bổ trợ yếu HÔM NAY của em đã điểm danh có mặt, chưa hoàn tất: buổi · mức · dạng của case (tên, chuyên đề, `day_at` cũ) · cụm của từng dạng (tên, thứ tự, tiền đề, **số câu/đúng đã làm trong ca**) · test cuối ca nếu đã sinh (`bai_test_id`, đã nộp chưa). App poll ~10s |
| `fn_btyeu_luyen_sinh(p_buoi, p_ma_dang, p_ma_cum, p_so_cau=3)` | HS, security definer | Sinh 1 LÔ 3 câu (app tự gọi lô mới khi hết — mục 0.8). Guard: em thuộc buổi, buổi hôm nay & `mo`, có mặt, chưa có test cuối ca, dạng thuộc case. Chọn câu trong cụm (null = cả dạng) **hỗ trợ chấm online** (cùng bộ lọc `tu_luyen_sinh`), **chưa dùng trong ca** (mọi `bai_test` của buổi), cạn → lặp (CEO đã chốt cho tự luyện). Insert `bai_test(loai='bo_tro', buoi_hoc_id, hoc_sinh_id, lop_id)` + snapshot câu có `ma_cum`. **Tách phần chọn+snapshot của `tu_luyen_sinh` thành hàm chung** `_kho_snapshot_cau(...)` dùng cho cả 2 — không copy-paste 80 dòng |
| `fn_btyeu_tien_do(p_buoi)` | TA | Per dạng → per cụm: số câu, đúng, sai, gợi ý xem, thời điểm câu cuối. 1 dòng/cụm. Nguồn: `bai_test(buoi_hoc_id)` ⋈ `bai_test_cau` ⋈ `bai_lam_cau` |
| `fn_btyeu_dong_ca(p_buoi)` | TA | Guard: `nguoi_day_tg` = tôi hoặc OPS/admin; đã có mặt; chưa có test. 1 transaction: set `day_at`/`day_buoi_id` dạng có câu luyện → sinh `bo_tro_test` theo mục 0.5 (câu chưa gặp trong ca; cạn: câu cùng dạng khác cụm → cạn nữa: lặp) → sinh `retest` (3 câu/dạng đã dạy, trần 9, `ngay` = buổi thường kế tiếp theo TKB — logic ngày chuyển từ `goiYXepLichBoTroYeu` sang SQL, 1 nguồn) → trả `{bo_tro_test_id, retest_id, retest_ngay}` hoặc null (không học). Idempotent |
| `fn_btyeu_hoan_tat(p_buoi, p_nhan_xet, p_muc_ma, p_khong_test_ly_do)` | TA | Guard: test đã nộp HOẶC không có test HOẶC `p_khong_test_ly_do` có. Upsert `buoi_danh_gia`, set `danh_gia_xong_at` |
| Nộp test / retest | HS | Dùng đường nộp thi hiện có của `LamET` (`et_nop` + chấm server). **Verify lúc code:** `et_nop` có khoá cứng `loai='et'` không; có thì nới cho `bo_tro_test`/`retest`, không viết RPC nộp thứ 2. **Trigger sau nộp `retest`** (hoặc bước cuối trong RPC nộp): tính tỉ lệ đúng theo `ma_dang` → ghi `retest_diem`/`retest_at`/`retest_nguon='rieng'`/`dat`/`dong_at` lên `bo_tro_yeu_dang` của case (qua `buoi_hoc_id` → `buoi_hoc_hs.bo_tro_yeu_id`). Ở DB, không ở app |
| `fn_btyeu_retest_cua_toi()` | HS | Bài `retest` của em có `ngay ≤ hôm nay`, chưa nộp → app hiện "Bài kiểm tra lại" |

Việc của tôi (`getMyTasks`, gami.ts khối `bo_tro_yeu` dòng ~1097): hiện đẻ 2 task "Chấm ET (bổ trợ yếu)"
+ "Đánh giá bổ trợ yếu" — ca không có ET. **Đổi thành 1 task "Điều hành ca bổ trợ"** (done =
`danh_gia_xong_at`, deadline 23:59 ngày buổi), bỏ task chấm ET. **Thêm task "Retest bổ trợ · tên em"**
cho TA lớp (vai `tg` của `bai_test.lop_id`): derive từ `bai_test(loai='retest')` `ngay ≤ hôm nay` chưa nộp,
done = `bai_lam.da_nop`, deadline 23:59 ngày `ngay` (trễ thì hiện quá hạn nhưng vẫn làm được — em vắng).

---

## 6. UI

**App học sinh (`HocSinhApp.tsx`)** — thêm ô **Bổ trợ** vào lưới ô (cả cấp 1 lẫn 2/3), **chỉ render khi
`fn_btyeu_ca_cua_toi` trả ca**, không có ca thì không có ô (không "sắp có", không ô trống). Màn mới:
- `CaBoTro`: header (môn · mức · TA) → list dạng → list cụm (tiến độ) → `LamBai` (tái dùng, truyền
  `doneExtra` = 3 nút mục 2.3) → khi có test: banner "Bài kiểm tra cuối buổi" → `LamET` → kết quả.
- Không nút đóng ca, không nút nhận xét, không thấy em khác. Thoát ca vẫn quay lại được (poll).

**App TA (`TaHome.tsx`)** — thêm nghiệp vụ thứ 4 **Bổ trợ yếu** (box + bottom-tab, bubble = số ca hôm
nay chưa hoàn tất; class màu literal riêng — bài học Tailwind JIT đã ghi trong file). Màn mới:
- `CaBoTroList`: card mỗi em (tên · mức · môn · giờ · trạng thái derive mục 3 · chấm màu im lâu).
- `CaBoTroDetail`: điểm danh (Có mặt / Vắng→huỷ) → tiến độ live (poll 10s) → nút **Đóng ca & sinh test**
  (disabled sau khi có test — không bấm 2 lần) → điểm test → nhận xét (mẫu + text) + mức → **Hoàn tất ca**
  (khoá sau khi xong). Không import màn ERP desktop (luật app TA).

**ERP desktop**: "Trạng thái ca bổ trợ" (`layTienDoCa`) đọc thêm trạng thái mục 3; `NhanSuHome` nhánh
`bo_tro_yeu` rơi vào `BuoiDetail` chung (cảnh báo dòng 527) → trỏ sang `CaBoTroDetail` bản desktop mỏng
(chỉ xem). Không ưu tiên pha đầu.

---

## 7. Chống chạy KPI — nằm trong cơ cấu, camera là lớp phụ

1. Test cuối ca do **hệ chọn câu chưa gặp**, em tự làm, hệ tự chấm → TA không sửa được điểm.
2. Bài làm ghi **tài khoản em** → phân biệt được em làm hay TA làm (ít nhất về dấu vết).
3. **Retest tầng 2** (bài riêng sau ET buổi thường, người khác đứng lớp) mới là số tính KPI TA.
4. Dashboard TA hiện thêm: tỉ lệ ca không test · số gợi ý xem/câu · tỉ lệ đúng luyện vs đúng test (lệch
   lớn = dấu hỏi).

---

## 8. Còn treo (nhỏ — Claude tự chốt tạm, Thùy sửa nếu khác ý)

1. **Retest 3 câu/dạng, trần 9** — chưa có số từ Thùy, lấy theo tinh thần "sàn 2 trần 6" của test cuối ca
   nhưng nhiều hơn vì đây là phép đo đóng dạng.
2. **Ngưỡng đóng dạng** giữ `retest_diem > 0.5` (migration 202607222255, Thùy 07-24 "0.5 vẫn giữ level").
3. **Retest tính vào mastery** nguồn `rieng`? Hiện `EvalSrc` không có `rieng`. Đề xuất: retest cũng vào
   mastery như `bt` (trọng số 1, level 0) — nó là bài giám sát nhưng cá nhân, không phải ET lớp. Nếu Thùy
   muốn retest ĐẾM vào level thì phải thêm nguồn mới vào `DANHGIA_CONFIG.WEIGHT` — quyết định engine, tách riêng.

---

## 9. Thứ tự làm — ✅ BUILT 03/09 (Thùy gật "làm luôn đến cuối")

- **Pha A — DB ✅** `202609030307_bo_tro_yeu_ca.sql` + `202609030325_bo_tro_yeu_ca_viec.sql` (đã áp, schema.md
  refresh). Test parity `scripts/_diag_btyeu_test.mjs` (transaction → rollback, 11 bước pass). Hàm thực tế:
  `fn_btyeu_ca_cua_toi · fn_btyeu_luyen_sinh · fn_btyeu_ca_ta` (thay `tien_do` — trả toàn cảnh) `· fn_btyeu_dong_ca ·
  fn_btyeu_hoan_tat · fn_btyeu_retest_cua_toi · fn_btyeu_viec_cua_toi · fn_btyeu_retest_ghi` (+2 trigger).
  `_kho_snapshot_cau` tách ra dùng cho hàm mới; `tu_luyen_sinh` CHƯA chuyển sang (cố ý, để lượt dọn riêng).
- **Pha B — App HS ✅** [CaBoTroHS.tsx](src/screens/hocsinh/CaBoTroHS.tsx) + HocSinhApp. ⚠ Chưa verify UI trên
  trình duyệt (không có login HS) — chỉ tsc + RPC.
- **Pha C — App TA ✅** [CaBoTroTA.tsx](src/screens/ta/CaBoTroTA.tsx) + TaHome (box + tab). Verify trình duyệt OK.
- **Pha D ✅ một phần**: mastery nguồn `bt` ✅ · getMyTasks 1 task ✅ · huỷ ca khi vắng ✅ (đếm huỷ hiện ở detail).
  **Treo:** ERP desktop "Trạng thái ca" chưa hiện bước retest · `BuoiBoTroYeuDetail` desktop chưa có.

Mỗi pha 1 commit, verify thật trên localhost với case Tùng trước khi sang pha sau. Pha A cần Thùy gật
migration (Luật xoá/thêm CLAUDE.md — toàn ADD nhưng vẫn xin gật).
