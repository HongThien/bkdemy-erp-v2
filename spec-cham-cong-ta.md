# Chấm công & lương Trợ giảng (CEO chốt 12–13/10/2026)

> **Đích:** lương TA tính hoàn toàn từ ERP, không qua file sheet; **mọi hoạt động của TA đều được ghi lại**, kể cả hoạt động thay thế và ngoài quy trình chính; CEO xem lại được mọi đơn giá.
> **Phạm vi v1:** TA part-time theo package chuẩn. Full-time / core team làm sau (logic theo giờ làm, khác hẳn).
> **Trạng thái (14/10):** Thùy duyệt mockup. **ĐÃ ÁP** 4 migration: `202610122210` (lõi) · `202610141233` (dữ liệu theo ngày phân công + đợt khai lùi tháng 10 + quyền) · `202610141240` (công của tôi cho app TA) · `202610141303` (bảng lương nhanh). App TA + 2 màn ERP đã build (§10). Mockup: §9b. Tháng 9/2026 chỉ dùng tính lương (bản V6, 15 TA, 28.256.807đ), không nạp vào DB.

## 0. Ý tưởng gốc

**Chấm công là lời khai, ERP là bằng chứng, hệ thống tự đối chiếu, người duyệt chỉ nhìn chỗ lệch.**
(Kế toán gọi là *three-way match*: kế hoạch – thực tế – duyệt; cách duyệt là *management by exception*.)

Hai luật kéo theo:
- **Cái gì chắc chắn lấy được từ ERP thì KHÔNG chấm công** (chấm BTVN, chấm ET). Khai thêm chỉ tạo hai nguồn cho một sự thật.
- **Cái gì ERP không tự biết thì phải chấm công**: TA có mặt, và mọi việc cần có mặt.

## 1. Quyết định đã chốt

| Nhóm | # | Quyết định |
|---|---|---|
| Nguyên tắc | 1 | TA **phải chấm công** (đảo quyết định 07/09 "mặc định có mặt, chỉ ghi vắng"). |
| | 2 | Hai kênh, **ERP là nguồn số 1**; không có trong ERP mới dùng lời khai của TA. |
| | 3 | Việc lấy chắc được từ ERP **không chấm công** (13/10). |
| | 4 | Làm cho **TA chuẩn** trước. Không có TA online. |
| Chấm công | 5 | **Check-in và check-out như đi làm**, bấm trên app TA, không quét QR. **Cả hai đều phải được duyệt.** Sau này có thể thay bằng máy chấm công (13/10). |
| | 6 | Hệ thống **tự khớp lịch và gợi ý việc** của TA lúc đó; không khớp thì TA tự điền. |
| | 7 | Trợ giảng phải ghi **lớp**, mặc định là lớp chính của TA. |
| | 8 | **Trang duyệt hằng ngày.** Màn duyệt tách hai trạng thái: việc đã có bằng chứng hiện **"đã khớp"**, việc chưa có thì **để trống**. Trang đọc một lượt, bỏ chọn cái không duyệt, rồi **duyệt cả lô một lần** (13/10). |
| | 9 | **Khai bù trong 24 giờ**, vẫn qua duyệt như thường (13/10). |
| | 10 | Hạn chót duyệt/sửa của kỳ: **ngày 3 tháng sau**. |
| Lương | 11 | Lương tính **riêng**, không nhân hiệu suất. Sai thì gậy + phạt (`gay_chot_thang.tien_phat`), **không trần phạt**. |
| | 12 | **Không trần** %TG và %BTVN. |
| | 13 | Sĩ số lớp = **trung bình cả tháng theo ngày**, xếp bậc theo số nguyên gần nhất. |
| | 14 | **Tiền trợ giảng đi theo người thực sự dạy** từng buổi, tính theo bậc và số buổi của **lớp được dạy**. Lớp vẫn thuộc TA được phân công (giữ BTVN + chỉ tiêu bổ trợ). |
| | 15 | **BTVN** tính theo buổi **chính TA đó chấm** trong hạn; buổi thi/MT không có BTVN thì không tính. |
| | 16 | **Chỉ tiêu bổ trợ = 8 giờ × số lớp**; giờ bổ trợ dùng chung, không gắn riêng lớp nào. |
| | 17 | Trông thi **lớp mình** nằm trong công trợ giảng; **lớp khác** 50.000đ/giờ. Bổ trợ đặc biệt (kèm riêng) 150.000đ/buổi, tính riêng. |
| | 18 | Đơn giá chỉ áp cho việc ngoài package, nằm ở **một bảng đơn giá có lịch sử** để CEO xem lại. |
| | 19 | Chỉ CEO và Trang xem lương toàn bộ; TA chỉ xem của mình. |
| | 20 | Chấm công **theo tài khoản** của từng TA (thiết bị nào cũng được). Người duyệt là **Phạm Thị Thùy Trang** (13/10). |
| Thời gian | 21 | **Dữ liệu tính TỪ NGÀY PHÂN CÔNG, không đẻ dữ liệu phía trước** (14/10): TA phân lớp ngày 12/10 thì trước 12/10 lớp đó không phải lớp của TA — gợi ý việc, lớp mặc định khi khai, "làm hộ ai", người phụ trách buổi thiếu công đều đọc phân công **tại ngày đó** (`phan_cong_lop_log`). TA bị rút giữa tháng vẫn giữ lớp cho tháng đó. |
| | 22 | TA vào giữa tháng: **%TG = buổi TA làm ÷ số buổi CẢ THÁNG** của lớp (phân 12/10, đi đủ 4/8 buổi ⇒ 50%) (14/10). |
| | 23 | **Khai lùi tháng 10**: hệ thống mở giữa tháng nên TA tự khai ca + việc cho mọi ngày 01–31/10 tới hết 03/11; ngoài đợt vẫn luật 24 giờ. "Thiếu công" tính từ 01/10 (14/10). Bảng `ta_dot_khai_bu`. |
| Quyền | 24 | `ta_cong_duyet` + `ta_luong` gán vai **Core team** (Thùy, Trang, Lộc) — Thùy chấp nhận Lộc cũng xem lương (14/10, thay #19). |
| Chữ | 25 | Trên app: **Checkin / Checkout** (không "chấm công vào/ra"); việc theo lịch bấm **"Ghi công"**, đã ghi hiện **"Đã ghi công"** (14/10). |

## 2. Mô hình: ba lớp

| Lớp | Là gì | Nguồn | Ai xác nhận |
|---|---|---|---|
| **Có mặt** | Một ca: giờ vào, giờ ra thật | TA bấm (sau này: máy chấm công) | Trang duyệt, có thể chốt lại giờ |
| **Việc** | Phiếu công: loại việc · lớp/ca/HS · khung giờ | Hệ thống gợi ý từ lịch, TA tick hoặc tự thêm | Trang duyệt |
| **Bằng chứng** | Dấu vết việc đó trên ERP | ERP tự có | Máy đối chiếu |

Vòng đời một ngày:

1. **Vào ca** — TA bấm check-in. Hệ thống hiện "việc của bạn lúc này" (khớp lịch ±30 phút) và cả ngày.
2. **Khai việc** — tick việc định làm; việc ngoài lịch thì chọn từ danh mục và điền lớp / HS / giờ.
3. **Ra ca** — bấm check-out; bỏ việc không làm, thêm việc phát sinh.
4. **Đối chiếu** — máy gắn cho mỗi việc: *đã khớp* / *(trống)* / kèm cờ nếu mâu thuẫn.
5. **Duyệt** — Trang duyệt cả lô.
6. **Vào lương** — chỉ dòng đã duyệt.

Giờ tính lương (cho việc tính theo giờ: bổ trợ, trông thi) = khung giờ của việc. Việc nằm ngoài khoảng có mặt đã duyệt thì hiện cờ, không tự tính.
Giờ TA bấm là dữ liệu gốc **không sửa**; nếu Trang chốt giờ khác thì lưu thành cột riêng (giờ chốt), giữ cả hai.

## 3. Danh mục hoạt động

| Loại | Hoạt động | Chấm công? | "Đã khớp" khi ERP có |
|---|---|---|---|
| Chính | Trợ giảng lớp học | Có | Buổi `thuong` của lớp đó, ngày đó, không huỷ, khung giờ nằm trong ca có mặt |
| | Trực bổ trợ khối (định kì) | Có | `ca_bo_tro` ngày đó có tên TA |
| | Bổ trợ bù / yếu / đuổi / ôn thi | Có | Buổi bổ trợ loại tương ứng, có ≥1 HS có mặt |
| | **Chấm BTVN** | **Không** | Lấy thẳng: `gami_grades.graded_by` → TA, trong hạn |
| | **Chấm ET** | **Không** | Lấy thẳng từ dữ liệu chấm |
| Thay thế | Trợ giảng hộ lớp khác | Có (chọn đúng lớp) | Như trợ giảng. Hệ thống **tự suy** là làm hộ ai; người được hộ không khai gì |
| | Trực hộ ca bổ trợ | Có (chọn đúng ca) | Như trực bổ trợ |
| | Chấm hộ BTVN | Không | Tự ra theo người chấm |
| Ngoài quy trình | Trông thi, trông thi lại | Có | Buổi của lớp hôm đó là buổi thi (ERP chưa đủ dữ liệu, thường để trống) |
| | Bổ trợ đặc biệt (kèm riêng) | Có | Không có → trống |
| | Chữa bài, chấm thi, họp, đào tạo, việc khác | Có | Không có → trống |

Việc chưa có đơn giá (chấm thi, họp, đào tạo, khác) **vẫn ghi**, trả 0đ và hiện cờ "chưa có đơn giá" cho tới khi CEO thêm giá.

## 4. Kịch bản TA (app TA)

1. Mở app, bấm **Chấm công vào**.
2. Thấy danh sách việc hôm nay do hệ thống gợi ý; việc đang diễn ra nổi lên đầu. Tick việc định làm. Trợ giảng không chọn lớp thì lấy lớp chính.
3. Việc không có trong gợi ý: bấm **Thêm việc**, chọn loại, điền lớp / học sinh / khung giờ / ghi chú.
4. Bấm **Chấm công ra** khi về. Quên ra thì ca treo trạng thái "quên ra", Trang chốt giờ.
5. **Khai bù:** trong 24 giờ kể từ khi việc diễn ra, TA tự khai được, dòng mang nhãn "khai bù". Quá 24 giờ chỉ Trang nhập hộ (có vết).
6. Xem **Bảng công của tôi**: từng việc, trạng thái đã khớp / chờ duyệt / đã duyệt / từ chối kèm lý do.

## 5. Màn duyệt của Trang (ERP desktop, hằng ngày)

Một bảng theo ngày, mỗi dòng một ca hoặc một việc, mặc định **đã chọn sẵn**:

| Cột | Nội dung |
|---|---|
| TA · ngày | |
| Có mặt | Giờ vào – giờ ra (thật); nhãn "quên ra" / "khai bù" nếu có |
| Việc | Loại · lớp/ca · khung giờ · học sinh |
| Đối chiếu | **Đã khớp** hoặc **(trống)** |
| Cờ | Mâu thuẫn nếu có (xem §6) |
| Làm hộ | Tên TA được làm hộ, nếu là việc thay thế |

Thao tác: đọc một lượt → bỏ chọn dòng không duyệt (bắt buộc ghi lý do) → **Duyệt tất cả dòng đang chọn**. Sửa giờ chốt ngay trên dòng khi cần.

Thêm một khối riêng: **"Buổi không ai chấm công"** (§6).

## 6. Bất biến và cờ

Bất biến (thuần suy, không đẻ dòng chờ — CLAUDE.md §4):
- **Mỗi buổi lớp diễn ra phải có một phiếu công trợ giảng.** Thiếu → cờ "buổi không ai chấm công", giao cho TA chính của lớp. Bắt được ca nhờ dạy hộ mà không ai khai.
- **Mỗi ca trực bổ trợ đã xếp phải có phiếu công** của người được xếp hoặc người trực hộ.

Cờ trên dòng việc:
- Buổi/ca đã huỷ mà có khai · khung giờ việc nằm ngoài ca có mặt · hai việc trùng giờ · kết thúc ≤ bắt đầu · giờ ngoài 7h–22h30.
- Hai TA cùng khai trợ giảng một buổi.
- Bổ trợ không có HS nào có mặt (trực khối không có HS vẫn hợp lệ, chỉ hiện nhãn).
- Giờ bổ trợ tháng vượt xa chỉ tiêu (tháng 9: TrangQ 31,5 giờ).
- Lớp được phân công nhưng cả tháng không có hoạt động.
- Việc chưa có đơn giá.

## 7. Công thức lương

```
Gross = Σ lớp [ bậc × (0,4 × %TG + 0,2 × %BTVN) ]
      + 0,4 × giờ bổ trợ ÷ (8 × số lớp) × Σ bậc
      + giờ trông thi lớp khác × 50.000 + buổi bổ trợ đặc biệt × 150.000
Net   = Gross − tiền phạt gậy đã chốt của kỳ
```

| Thành phần | Cách tính |
|---|---|
| %TG | Số buổi TA có phiếu công trợ giảng đã duyệt ở lớp đó (gồm cả trông thi lớp mình) ÷ số buổi `thuong` không huỷ của lớp trong tháng. Không trần. |
| %BTVN | Số buổi của lớp mà chính TA chấm trong hạn ÷ định mức (lớp 8 buổi/tháng: 7; lớp 4 buổi/tháng: 3). Không trần. |
| Lớp của TA | Lớp được phân công tới cuối kỳ (lớp chủ) **và** lớp TA có công trợ giảng trong kỳ (dạy hộ). |
| Số lớp cho chỉ tiêu bổ trợ | Lớp chủ mà TA có hoạt động trong kỳ (có trợ giảng hoặc có chấm BTVN). Chưa có lớp chủ nào thì theo lớp có trợ giảng. |
| Bậc | Sĩ số trung bình tháng, làm tròn: ≤8: 1.000.000 · 9–12: 1.200.000 · 13–15: 1.400.000 · 16–20: 1.600.000 · ≥21: 1.800.000. |
| Kỳ | Theo ngày việc diễn ra, không theo ngày khai. |

Mọi con số tính ở Postgres (`fn_ta_luong_thang`), app chỉ gọi (CLAUDE.md §2.0). Hệ số và đơn giá đọc từ `ta_don_gia` theo ngày hiệu lực.

## 8. Dữ liệu và hàm

**Đã viết trong migration `202610122210` (chưa áp, đã test rollback):** `ta_don_gia` (chỉ thêm dòng) · `ta_loai_viec` · `ta_cham_cong` · `ta_cong_viec` · `ta_cong_log` · `phan_cong_lop_log` + trigger · `fn_ta_cham_cong_vao/ra` · `fn_ta_khai_viec` · `fn_ta_duyet_cong` · `fn_ta_dat_don_gia` · `fn_ta_hom_nay` · `fn_ta_cong_thang` · `fn_ta_bang_don_gia` · `fn_ta_luong_thang`.

**Đã chỉnh theo quyết định 13/10 (vẫn chưa áp; `scripts/luong-ta-t9/test_chamcong.mjs` = 31 ca test, chạy trong rollback):**
1. `ta_cham_cong`: trạng thái duyệt riêng cho ca, giờ chốt (`vao_chot`, `ra_chot`) tách khỏi giờ gốc, `khai_bu`, `nguon` (`app`/`may_cham_cong`/`nhap_ho`). "Quên ra" là trạng thái suy (chưa có giờ ra mà đã sang ngày khác), không lưu cờ.
2. `ta_cong_viec`: `khai_bu`, nguồn `nhap_ho`. `fn_ta_khai_viec` chặn khai trước cho ngày chưa tới và chặn quá 24 giờ.
3. `ta_loai_viec`: thêm chữa bài (vào bổ trợ), họp, đào tạo. Trực bổ trợ khối không bắt chọn lớp.
4. Hàm mới: `fn_ta_cham_cong_khai_bu` · `fn_ta_cham_cong_nhap_ho` · `fn_ta_chot_gio` · `fn_ta_bo_viec` · `fn_ta_nhap_ho_viec` · `fn_ta_doi_chieu` (đã khớp / trống, cờ, làm hộ ai — suy tại chỗ) · `fn_ta_buoi_thieu_cong` (chỉ buổi/ca đã kết thúc).
5. `fn_ta_duyet_cong(p_ca, p_viec, kết quả, lý do)`: duyệt lô cả ca lẫn việc; ca chưa có giờ ra phải chốt giờ trước.
6. `fn_ta_luong_thang`: chỉ tính việc đã duyệt thuộc ca có mặt đã duyệt.

**Thêm 14/10 (đã áp):** `_ta_pc_khoang` / `_ta_tg_tai(ngày, lớp, TA)` = phân công tại một ngày từ log · `ta_dot_khai_bu` + `_ta_duoc_khai_bu` + `_ta_moc_cham_cong` · `_ta_doi_chieu(tu, den, ns)` dùng chung cho `fn_ta_doi_chieu` (người duyệt) và `fn_ta_cong_cua_toi` (TA) · `fn_ta_khai_bu_cho_phep` · khai trợ giảng/trông thi tự gắn buổi của lớp hôm đó (trùng ⇒ "Việc này đã ghi công rồi").
**Test (rollback, DB thật):** `scripts/luong-ta-t9/test_chamcong.mjs` 32/32 · `test_ngay_phan_cong.mjs` 26/26 · `kiemchuan.mjs` T9 = 28.256.807đ · mockup `smoke_mockup.mjs` 35/35. Tốc độ (DB thật + tải giả nửa tháng): bảng lương 0,2s · duyệt 14 ngày 0,23s · thiếu công 0,07s.

**Chốt kỳ (14/10, mig `202610141527` ĐÃ ÁP; test `scripts/luong-ta-t9/test_chot_ky.mjs` 30/30):** `ta_luong_ky` (mỗi lần chốt một dòng, mở lại = ghi `mo_lai_*` một lần, chốt lại = lần mới) + `ta_luong_ky_dong` (bản chụp từng TA, bất biến). `fn_ta_ky_trang_thai` · `fn_ta_chot_ky` · `fn_ta_mo_lai_ky` (bắt lý do) · `fn_ta_luong_ky` (đã chốt ⇒ bản chốt, chưa ⇒ tạm tính; thay `fn_ta_luong_thang` ở cả màn ERP và app TA).
Điều kiện chốt: sau hạn duyệt (ngày `han_duyet_ngay` tháng sau, hoặc hạn đợt khai lùi nếu muộn hơn), không còn ca/việc chờ duyệt, không còn ca quên checkout, và tháng **không nằm trước mốc chấm công ERP** (tháng 9 tính ngoài ERP — chốt trên ERP sẽ ra 6,06 triệu thay vì 28,26 triệu).
Kỳ đã chốt ⇒ trigger khoá thêm/sửa/xoá `ta_cham_cong`, `ta_cong_viec` của tháng đó và chặn thêm đơn giá có hiệu lực ≤ đầu tháng đó.

**Quyền:** hai chức năng mới `ta_cong_duyet` và `ta_luong`, gán cho CEO và Trang.

## 9. Còn mở

1. **Đơn giá** chấm thi, họp, đào tạo, việc khác.
2. **Chấm ET** nằm trong 40% "trợ giảng + ET" nhưng chưa đo riêng; hiện 40% chỉ theo số buổi trợ giảng.
3. **Dữ liệu ERP cần dọn trước lần chạy thật:** thiếu phân công Ngân → 3A1; TrangQ có 7B1/7B2 phân công treo và đang dạy 7S3 (ERP ghi Vân Anh); buổi còn trạng thái "mở" làm lệch mẫu số (tháng 9: 109/349 buổi).
4. **Máy chấm công** (ý tưởng): khi có thì chỉ thay nguồn của lớp "Có mặt", hai lớp còn lại giữ nguyên.

## 9b. Mockup để test

`design/mockup-cham-cong-ta.html` (bản bấm được, dữ liệu giả, đã đưa lên Artifact). Gồm app TA (chấm công, việc hôm nay, thêm việc, khai bù, bảng công, lương tạm tính) và màn quản lý (duyệt công, thiếu công, bảng lương, đơn giá), kèm **12 kịch bản test** có các bước và kết quả mong đợi. Luật trong mockup chép từ hàm Postgres; khi luật đổi phải sửa cả hai.

## 10. Thứ tự build

1. ✅ (14/10) Mockup duyệt · migration áp · schema.
2. ✅ (14/10) Đăng ký 2 chức năng + gán Core team.
3. ✅ (14/10) App TA: ô **Chấm công** ở màn chính (Checkin/Checkout tại chỗ) + màn `ta/CongTA.tsx` (Hôm nay · Bảng công · Lương tạm tính; khai bù ngày khác). Seam `lib/tacong.ts`.
4. ✅ (14/10) ERP lá `ta_cong_duyet` → `tacong/DuyetCongScreen.tsx` (duyệt lô · chốt giờ · từ chối · thiếu công · nhập hộ).
5. ✅ (14/10) ERP lá `ta_luong` → `tacong/LuongTaScreen.tsx` (bảng lương tháng · đơn giá). Soi không cần đăng nhập: `/xem-thu-cong-ta.html` (`?man=duyet` | `?man=luong`).
6. ✅ (14/10) Chốt kỳ: khối chốt trên màn Lương trợ giảng (trạng thái · điều kiện còn thiếu · xác nhận ngay trên màn · mở lại bắt lý do · lịch sử lần chốt); app TA tab **Lương** hiện "Phiếu lương chính thức" khi tháng đã chốt. Xem thử: `/xem-thu-cong-ta.html?man=luong&chot=1`.
7. Chạy song song với sheet một tháng; lệch về 0 thì tắt sheet. Khai tử `ta_vang` + `ChamCongTa.tsx`.

## 11. Ngoài phạm vi v1

Full-time / core team · thông báo đẩy · thực thể ca thi / phân công chấm thi (làm sau khi lõi chạy) · điều chỉnh lương theo hiệu suất (đã bỏ).
