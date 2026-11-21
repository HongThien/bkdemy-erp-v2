# spec-bo-tro.md — BỔ TRỢ: logic (loại · mức · đề xuất – duyệt · vòng đời case · nội dung ca · theo dõi) (spec #18 của bộ 20 spec)

> **Trạng thái: THÙY CHỐT 17/11/2026** (trả lời 12 câu — bảng §12.0). Riêng **§7.4 Đuổi CHƯA CHỐT** (Thùy: "cần review lại kỹ hơn"). Thay bản tổng 13/11 (nay ở `_luu-tru/spec-bo-tro-ban-13-11.md` — **§41–§43 xếp lịch của bản đó + `spec-xep-bo-tro-chung.md` CÒN HIỆU LỰC tới khi spec #8 viết xong**).
> Việc code / DB phát sinh từ quyết định (gỡ trần, gỡ Bổ trợ Hình, L3/L4 vào ca khối, báo động theo tuần…) **chỉ làm khi Thùy ra lệnh** — danh sách §12.0 cột cuối + §12.2.
> **Gộp từ:** `spec-bo-tro.md` §0–§10 · `spec-xep-bo-tro-chung.md` (chỉ phần mức ↔ đơn vị, ưu tiên trong loại) · `_luu-tru/PLAN-botro-yeu.md` · `_luu-tru/PLAN-botro-yeu-ca.md` ·
> `_luu-tru/BKDEMY_CANHBAO_BOTRO_SPEC.md` (lịch sử, chỉ giữ ý "không quy kết nhân quả") · HANDOFF (mục bổ trợ 28/09 → 17/11) · DEVLOG 09/09 → 17/11 (quyết định có ngày, ghi `(Thùy dd/mm)`) · CLAUDE.md §1, §1.5, §4, §5 + đoạn MCQ bổ trợ.
> **Đối chiếu DB 17/11** (chỉ đọc: `pg_constraint`, `pg_trigger`, `pg_get_functiondef` 197 hàm, đếm dòng). Số trong file là số ngày 17/11. Chỗ DB / code lệch nguồn ⇒ **không sửa**, ghi §11–§12.
>
> **Ranh giới (chỉ trỏ, không chép):**
> luật đo (lần đo · công thức · dạng yếu · nhóm yếu · HS yếu · cache) ⇒ `spec-mastery.md` §2, §4, §5, §7 ·
> nhịp tuần · Mục tiêu tuần Phần 2 · Báo cáo tuần (Vào / Ra / Độ phủ / Hết yếu sau ca) ⇒ `spec-van-hanh-tuan.md` §1, §4, §5 ·
> câu nào là MCQ / form trắc nghiệm / kho chuẩn ⇒ `spec-kho-cau-hoi.md` ·
> **xếp lịch · phòng · đơn vị ca · suất TA · báo phụ huynh · điểm danh ca ⇒ #8 `spec-van-hanh-trung-tam.md` (chốt 17/11 — §13)** ·
> việc của TA trong ca · app TA · chấm công ⇒ #10 `spec-tro-giang.md` (chốt 17/11) · giao diện app HS ⇒ #12 `spec-app-hs.md`.

---

## 0. Đích

- Bổ trợ = **phần trung tâm làm thêm cho một em ngoài buổi chính khoá** để em bắt kịp: yếu ở kiến thức đã học (Yếu · Sau giờ), nghỉ buổi (Bù), vào lớp giữa chừng (Đuổi), Hình, ôn trước kỳ thi.
- Một câu spec này phải trả lời được: **em X đang ở loại bổ trợ nào, mức nào, ai quyết, đã học chưa, và sau khi học thì em có khá lên không.**
- **Không quy kết nhân quả** (nguyên tắc từ spec 05/07, còn hiệu lực): không cố chứng minh "khá lên nhờ bổ trợ". Chỉ ghi: trước ca em yếu ở đâu → ca dạy gì → sau ca mastery ra sao. Kết luận về hiệu quả là số tổng hợp nhiều ca.
- **Pure-derive (CLAUDE §1, §4):** không có bảng việc. "Em cần bù" = vắng mà chưa có buổi bù / chưa ghi không-bù. "Ca đang ở bước nào" suy từ dữ liệu con. Không tạo dòng chờ.
- **Mọi dữ liệu bổ trợ mang nhãn môn** (CLAUDE §1.6). Hiện chỉ Toán có case (17/11: 100 % case mở là Toán); thao tác phải chạy y hệt cho môn khác.

## 1. Các loại bổ trợ

| Loại | Ai vào | Ai mở | Nội dung | Kết thúc khi | `buoi_hoc.loai` |
|---|---|---|---|---|---|
| **Yếu — ca khối** (L2 · L3) | Em có nhóm / dạng yếu được chốt | Trưởng khối đề xuất → trưởng bộ môn duyệt (§4) | Luyện theo dạng → test cuối ca (§6) | TA hoàn tất ca (1 tuần 1 lần) · hết hạn 14 ngày · hạ L0 | `bo_tro_yeu` |
| **Sau giờ** (L1) | như trên, mức L1 | như trên | Lý thuyết + luyện + test giấy ngay sau buổi học, 20–25′ | TA nhập kết quả test · hoặc reset thứ Hai | `bo_tro_nhe` |
| **Riêng với GV** (L4) | như trên, mức L4 | như trên | GV kèm riêng, ngoài ca khối | *chưa có luồng — §12 câu 4* | — |
| **Bù** | Em vắng buổi thường | Tự sinh từ điểm danh (R-BU, §7.3) | Nội dung buổi đã nghỉ: luyện → test bù | Em có mặt buổi bù · hoặc ghi `bang_khong_bu` | `bu` |
| **Đuổi** | Em vào lớp giữa chừng | Học thuật / tuyển sinh mở đợt, GV chọn dạng | Tự học ở nhà + TA làm cùng phần dở | Người phụ trách bấm Hoàn thành đợt | `bo_tro_duoi` |
| ~~Hình~~ | **BỎ HẲN (Thùy 17/11)** — 0 case từ 17/10; code / DB còn, gỡ theo Luật xoá khi có lệnh | | | | |
| **Ôn thi** | Em được thêm vào đợt ôn | Trang lập đợt mỗi kỳ thi | Luyện đề, không đo | Hết đợt | `bo_tro_on_thi` |
| ~~Khẩn cấp~~ | **BỎ HẲN (Thùy 17/11)** — trưởng khối đề xuất / duyệt được bất kỳ ngày nào | | | | |

- Một em có thể cùng lúc ở nhiều loại (bù riêng, yếu riêng — không gộp, Thùy 24/09). Mỗi (em × môn) tối đa **một case Yếu đang mở**.
- Số 30 ngày tới 17/11 (lượt HS có mặt / lượt xếp, buổi không huỷ): Sau giờ 89 / 97 · Yếu ca khối 61 / 61 (thêm 41 buổi huỷ) · Bù 106 / 137 · Đuổi 16 / 17 · Ôn thi 33 / 76 · **Hình 0** (bảng `bo_tro_hinh` chưa có dòng nào).

## 2. Phát hiện — ai thấy em yếu, bằng gì

- **Nguồn duy nhất = mastery theo lần** (`spec-mastery.md` §4). **Dạng yếu / nhóm yếu / HS yếu: `spec-mastery.md` §5** — không chép công thức ở đây. Nhóm bài là cấp quyết định; dạng là cấp thực thi.
- Bổ trợ đọc mastery **chỉ qua** `_btyeu_dang_theo_nhom` (dạng yếu) và `_mastery_lan_cap_nhanh` (bảng chụp). Cấm hàm bổ trợ tự quét lịch sử làm bài.
- **Ai phát hiện:** trưởng khối, trên Dashboard học tập (cột Nhóm yếu · x dạng; ô = TB 5 lần). **Máy không tự đề xuất, không tự mở case** (bỏ máy đề xuất mức từ 17/10; bỏ danh sách Theo dõi + Duyệt 2 vòng 13/11).
- **"Cứ yếu là bổ trợ"** (Thùy 23/09, 08/10): số lần đo ít không loại em khỏi bổ trợ — số lần chỉ để xếp ưu tiên và hiện độ tin.
- **Báo động** (chuông GV / TA trong buổi, bảng `canh_bao_yeu`; 30 ngày: 56 lượt — BTVN 31 · ET 17 · đánh giá 8): hiện 🚨 30 ngày trên Dashboard học tập. Em **đang có case cùng môn** ⇒ dạng báo động vào thẳng case (`trg_btyeu_bao_dong_vao_case`, nguồn `bao_dong`). Em chưa có case ⇒ chỉ là tín hiệu cho trưởng khối (§12 câu 7).
- 4 kênh phát hiện + ngưỡng "so lớp" của thiết kế 08–09/2026 (kênh ①–⑤, máy đề xuất level) **đã hết hiệu lực** — thay bằng một luật đo 13/11.

## 3. Thang mức L1–L4 · ưu tiên · trần

**Thang mức (Thùy 11/11; mức sống ở `hs_level` loại `kien_thuc`, mỗi em × môn một dòng; L0 = không có dòng):**

| Mức | Nghĩa | Vào bằng | Ra bằng | Ghi chú |
|---|---|---|---|---|
| L0 | Không bổ trợ | Hạ L0 (`fn_btyeu_doi_level`, bắt buộc lý do) | — | Hạ L0 = đóng case `bo`, huỷ buổi chưa học |
| **L1** | **Sau giờ** — 1 ca 20–25′ / tuần | Duyệt đề xuất L1 | Nhập kết quả test · reset thứ Hai | Không mở case khối, không qua Lộc, không kiểm trần |
| **L2** | Ca khối theo lịch khối — **TA trực ca khối dạy** | Duyệt đề xuất L2 · Đổi mức từ L1 | Hoàn tất ca · hết hạn 14 ngày · hết tuần chốt (mức về L0) | |
| **L3** | Ca khối, **xếp y như L2** — **GIÁO VIÊN dạy** (Thùy 17/11); ít em | Duyệt đề xuất L3 | như L2 | |
| **L4** | Ca khối, **xếp y như L2** — **đặc biệt nghiêm trọng: chuẩn bị kỹ hơn và ĐỔI giáo viên** (Thùy 17/11); rất ít em | Duyệt đề xuất L4 | như L2 | code hiện chưa đưa L4 vào ứng viên ca khối — §12.0 |

- Đổi mức: trên thẻ case (`fn_btyeu_doi_level`, 0–4) · trên hàng chờ / thẻ ca Sau giờ **L1 → L2/L3/L4** (`fn_btnhe_doi_muc`, trưởng khối trở lên; đi đúng đường đề xuất + duyệt; ca sau giờ đã tạo không tự huỷ, thẻ ghi "Đã chuyển Lx") (Thùy 12/11).
- Mọi lần đổi mức có dòng `hs_level_log` (mức cũ → mới, lý do, người, nguồn). Log trước 11/11 dùng số thang cũ (2 = buổi riêng TA, 3 = buổi riêng GV).
- Đơn vị của từng mức trong ca, trần đơn vị theo tuần, suất TA ⇒ #8 (§13). Spec này chỉ giữ luật: **mức quyết định em đi đường nào** (L1 sau giờ · L2 / L3 ca khối · L4 riêng).
- Hiện có (17/11): L1 143 em · L2 66 · L3 1 · L4 0.

**Ưu tiên của case:** Cao (3) · Thường (2) · Thấp (1), do trưởng khối chọn lúc đề xuất, sửa được trên thẻ. Thứ tự hiện ứng viên ca: ưu tiên cao → case mở lâu hơn (không xét bậc lớp).

**Trần toàn trung tâm: BỎ (Thùy 17/11 "Bỏ trần").** Luật cũ 70 em / 20 Cao (09/10) hết hiệu lực; code còn kiểm trần lúc duyệt + trigger lúc mở case — gỡ khi có lệnh (§12.0). **"Bổ trợ yếu theo lịch khối" = L2 trở lên** (L2 · L3 · L4); L1 = sau giờ.

**Mức thuộc về LƯỢT CHỐT TUẦN (Thùy 17/11, câu 2):** case đóng / hết tuần ⇒ em về L0; "em đang bổ trợ" = có case mở hoặc lượt duyệt trong tuần. Lịch sử mức còn ở `hs_level_log`. (Code hiện giữ mức tới khi có người đổi — sửa khi có lệnh.)

## 4. Đề xuất → duyệt → chốt tuần (Thùy 10/11)

1. **Trưởng khối** (Phòng làm việc › Chất lượng › Dashboard học tập) bấm **Bổ trợ** trên dòng em ⇒ popup: 5 nhóm % thấp nhất (mở rộng được), nhóm yếu tick sẵn, xổ từng dạng (Yếu / Cần luyện / Đạt / Chưa đo + % + số lần). Chọn **nhóm · mức L1–L4 · ưu tiên · ghi chú** ⇒ Lưu = dòng **nháp** (`bo_tro_de_xuat`; mỗi em × môn một dòng sống).
2. **Chốt & gửi** cả khối ⇒ `cho_duyet`.
3. **Trưởng bộ môn** (Chất lượng › Danh sách bổ trợ): **Duyệt** hoặc **Trả lại** (bắt buộc lý do). Trạng thái dòng: `nhap` → `cho_duyet` → `da_duyet` | `tra_lai` | `huy`. Mọi đổi trạng thái tự ghi `bo_tro_de_xuat_log` (trigger).
4. **Duyệt làm gì** (`fn_btk_duyet` → `_btk_duyet_chay`, một transaction): ghi mức + log ·
   - **L1** ⇒ em vào hàng chờ Sau giờ (§7.2); không mở case khối.
   - **L2–L4** ⇒ ~~kiểm trần~~ (bỏ 17/11) ⇒ mở case mới hoặc **gộp vào case đang mở** ⇒ đổ dạng: **"nhóm quyết, dạng thực thi"** — mọi dạng đã đo **chưa đạt** của các nhóm đã tick; nhóm mà mọi dạng đều đạt ⇒ lấy 1 dạng điểm thấp nhất.
5. **Nhịp:** chiều thứ Hai trưởng khối soi Dashboard và chốt bổ trợ tuần (`spec-van-hanh-tuan.md` §1). Đề xuất + duyệt **làm được bất kỳ ngày nào**; lượt chốt L1 chỉ có hiệu lực **trong tuần được duyệt** (T2–CN, Thùy 16/11). Lượt chốt là nguồn Phần 2 của Mục tiêu tuần.
6. **Quyền:** trưởng khối = trong phạm vi môn × khối (`_btk_la_tk`); trưởng bộ môn = chế độ `tbm` + phạm vi (`_btk_la_tbm`). Phạm vi là bảng phân công — `spec-truong-khoi.md`.
- Số (17/11): đã duyệt mọi thời L1 208 · L2 73 · L3 1; **tuần này** đã duyệt L1 82 · L2 36 · L3 1, chờ duyệt 21, nháp 2.

## 5. Vòng đời một case Yếu · cách KẾT LUẬN

**Vòng đời (case `bo_tro_yeu`, trạng thái lưu chỉ `dang_xu` → `hoan_thanh`; bước giữa là suy ra):**

```
Duyệt (mở / gộp case, đổ dạng) → Cần xếp → Đã xếp (1 buổi chờ học) → Em có mặt → Luyện → Đóng ca & sinh test → Test → Hoàn tất ca ⇒ case KẾT THÚC
                                     ↑ ca không diễn ra / em vắng ⇒ buổi huỷ, case về Cần xếp
```

- Một case tối đa **một buổi chờ học** (trigger). "Đã xếp chưa bổ trợ" là trạng thái cứng — không xếp lại khi buổi còn sống (Thùy 20/09).
- Ca đã xếp mà không diễn ra ⇒ tự huỷ buổi, case về Cần xếp (`fn_btyeu_don_ca_khong_dien_ra`). TA điểm danh nhầm ⇒ chạm lại để bỏ (`fn_btyeu_bo_diem_danh`).

**Ba cách một case kết thúc (cột `ket_qua`; 30 ngày tới 17/11, case khối):**

| `ket_qua` | Khi nào | Số 30 ngày |
|---|---|---|
| `day_xong` | TA bấm **Hoàn tất ca** | 51 |
| `het_han` | Case mở quá **14 ngày** mà không có ca đang học (Thùy 26/10) | 60 |
| `bo` | Hạ L0 (hết yếu / dừng) · reset duyệt lại | 30 |

**Luật kết luận đang có hiệu lực:**

1. **1 tuần bổ trợ 1 lần** (Thùy 17/10): hoàn tất ca ⇒ case kết thúc **ngay**, kể cả còn dạng chưa dạy. Tuần sau trưởng khối nhìn Dashboard và chốt lại nếu em còn yếu. Áp cả Yếu và Hình.
2. **Không còn retest** (HOLD 29/09; bỏ hẳn 13/11): case = học → test cuối ca → xong. Không thiết kế, không đề xuất, không nhắc retest. Muốn có lại = thiết kế mới.
3. **Không còn danh sách Theo dõi** sau ca (bỏ 13/11): em còn yếu ⇒ tự hiện lại trên Dashboard tuần sau.
4. **Case không tự kết luận "đạt / chưa đạt".** Ba giá trị `dat` · `mot_phan` · `chua_dat` còn trong CHECK nhưng **0 dòng** (di tích thời retest). Em có khá lên không là số **suy từ mastery**, đọc ở ba chỗ:
   - **Kết quả tuần** (Dashboard bổ trợ, `fn_botro_ket_qua_tuan`): mỗi dạng đã dạy trong ca — **Giảm** = trước ca (00:00 ngày ca) Yếu, hết ngày ca không còn Yếu · **Vẫn yếu** · không yếu từ trước.
   - **Báo cáo tuần**: Độ phủ + Hết yếu sau ca (`spec-van-hanh-tuan.md` §5.5).
   - **Dashboard học tập** tuần sau (trưởng khối tự nhìn).
   ⇒ Có cần một kết luận ghi trên case không: **§12 câu 1**.
5. **Dạng đã dạy** của ca lấy từ **dữ liệu**: ca 📱 app = dạng em làm ≥ 1 câu trong ca (bỏ qua tick tay); ca 📄 giấy = dạng TA tick (Thùy 29/09).
6. **Em không làm test cuối ca:** TA phải nhập lý do "không test" mới hoàn tất được; lý do ghi vào nhận xét. Ca không có câu luyện nào ⇒ đóng "không học", không sinh test.
7. Hoàn tất ca bắt buộc có **nhận xét hoặc mức đánh giá buổi** (`buoi_danh_gia`).

## 6. Nội dung một ca — luyện → test

- **Hai máy, hai vai** (Thùy 03/09): em làm bài bằng **tài khoản của em**; TA điều hành bằng tài khoản TA (điểm danh, đóng ca, nhận xét). TA không nhập điểm test của ca app.
- **Hai chế độ ca** (Thùy 21/09), TA chọn cho từng em, lưu `buoi_hoc_hs.btyeu_che_do`: **📱 app** (luyện + test trên iPad, tự chấm) · **📄 giấy** (in phiếu luyện + phiếu test, TA nhập kết quả, đi trọn luồng kể cả test). 30 ngày: app 35 · giấy 6 · chưa chọn 20 lượt.
- **Giấy và app không xáo câu** (Thùy 29/09) — thứ tự câu trên giấy = thứ tự câu đã chọn. Riêng **chọn câu** giấy khác app: **IN GIẤY = in được MỌI LOẠI CÂU (Thùy 21/11)** — trắc nghiệm · trả lời ngắn · tự luận · đúng/sai (trừ kéo-thả); luật "MCQ trước" chỉ áp cho bài làm TRÊN APP. Giấy lấy bộ câu của app trước (giống app), thiếu thì bù mọi loại câu còn lại (có đáp án hoặc lời giải để TA chấm); vẫn khác mã + khác đề, vẫn chừa 2 câu / dạng cho test. Câu không phải trắc nghiệm: TA đối chiếu đáp án / lời giải rồi chấm Đúng / Sai. Áp cho MỌI bài in giấy, **kể cả Hình** (`fn_btyeu_in_sinh_hinh` đi qua cùng hàm). Hàm: `_btyeu_chon_cau_giay`; test cuối ca của ca 📄 giấy cũng dùng hàm này (`fn_btyeu_dong_ca`); nhập tay `fn_btyeu_giay_nhap`.
- **Luyện:** theo dạng của case (bản đồ mới không có cụm ⇒ luyện "cả dạng"); câu ra liên tục theo lô nhỏ, không có lượt cố định, không đếm ngược — TA quyết lúc chuyển dạng / đóng ca. Mỗi câu chấm ngay, hiện đáp án + lời giải.
- **Test cuối ca** (`bo_tro_test`): sinh lúc TA bấm **Đóng ca & sinh test**. Số câu: sàn 2 · trần 6 (1–2 dạng đã luyện ⇒ 2 câu / dạng; ≥ 3 ⇒ 1 câu / dạng; > 6 ⇒ 6 dạng em làm kém nhất trong ca) (Thùy 03/09).
- **Luyện ≠ test** (Thùy 17/10): câu test khác mã **và** khác đề với mọi câu đã gặp trong ca; luyện chừa 2 câu / dạng cho test. Dạng chỉ có ≤ 2 câu đủ điều kiện ⇒ "học trên giấy". Test rỗng ⇒ lấy lại 1 dạng kém nhất, gắn cờ `test_lap_cau`.
- **Chọn câu — MỘT nguồn** (Thùy 10/10, thay "MCQ tuyệt đối" 20/09): **trắc nghiệm trước**; cả dạng không có câu trắc nghiệm ⇒ **câu trả lời ngắn có đáp án** (kho chuẩn, mọi mức độ). Hàm: `_kho_dk_mcq_sql` · `_btyeu_dk_dang_sql` · `_btyeu_chon_cau` · `_btyeu_chon_cau_khac`; Bù dùng `tu_luyen_chu_de_sinh` loại `bu_luyen` / `bu_test`. **Luồng bổ trợ mới trên app phải đi qua các hàm này**, không viết điều kiện chọn câu riêng. Câu ghi "[hình…]" mà chưa đính hình bị loại khỏi mọi bài (`_kho_dk_du_hinh_sql`).
  - Luật "trắc nghiệm trước" ở trên là cho bài trên **app**. Bài **in giấy**: **IN GIẤY = in được MỌI LOẠI CÂU (Thùy 21/11)** — trắc nghiệm · trả lời ngắn · tự luận · đúng/sai (trừ kéo-thả); luật "MCQ trước" chỉ áp cho bài làm TRÊN APP. Giấy lấy bộ câu của app trước (giống app), thiếu thì bù mọi loại câu còn lại (có đáp án hoặc lời giải để TA chấm); vẫn khác mã + khác đề, vẫn chừa 2 câu / dạng cho test. Câu không phải trắc nghiệm: TA đối chiếu đáp án / lời giải rồi chấm Đúng / Sai. Áp cho MỌI bài in giấy, **kể cả Hình** (`fn_btyeu_in_sinh_hinh` đi qua cùng hàm). Hàm: `_btyeu_chon_cau_giay`; test cuối ca của ca 📄 giấy cũng dùng hàm này (`fn_btyeu_dong_ca`); nhập tay `fn_btyeu_giay_nhap`.
  - Ngoại lệ có chủ ý: **Sau giờ** (bài giấy) — §7.2 (đã là in giấy mọi loại câu).
- Câu trả lời ngắn: TA sửa được kết quả khi máy chấm sai (`fn_btyeu_ta_sua_ket_qua`, Thùy 19/09); trên phiếu giấy TA chấm Đúng / Sai.
- **Bài nào tính mastery:** chỉ **TEST** — `bo_tro_test` · `bu_test` · `htd_test`, tính như ET. **Mọi bài luyện không tính** (`bo_tro` · `bu_luyen` · `htd_luyen` · `on_thi_luyen`) (Thùy 17/11 — `spec-mastery.md` §2). 30 ngày: test cuối ca / sau giờ 180 bài, 132 đã nộp, TB 75 % (≥ 80 %: 63 bài · 50–79 %: 53 · < 50 %: 16).

## 7. Từng loại

### 7.1 Yếu — ca khối (L2 · L3 · L4)
- Theo §3–§6. Dạng trong case có nguồn: `duyet` (lúc duyệt) · `tay` · `may` · `bao_dong`. Dạng bị xoá / gộp ở bản đồ ⇒ case tự đổi sang dạng nhận hoặc đóng dạng (`_btyeu_dong_bo_dang_ban_do`).
- Hạn 14 ngày: `fn_btyeu_het_han_xu_ly` (§12 kỹ thuật 2).
- Hiện (17/11): 54 case đang mở, 31 đã có buổi chờ học.

### 7.2 Sau giờ (L1) — Thùy 11/11 → 16/11
- **Hàng chờ** = em có đề xuất **mới nhất** là L1 đã duyệt **trong tuần này**, chưa có ca sau giờ tuần này (`fn_btnhe_cho`). **1 lần / em / tuần.** Vắng không bù. Không qua Lộc, không suất.
- **Reset thứ Hai** (Thùy 16/11, **chỉ** Sau giờ — ca khối không reset): 0h mỗi ngày bộ điều phối chạy `_btnhe_reset_tuan` (sổ `sau_gio_reset_tuan`): huỷ buổi sau giờ chưa thực hiện của tuần cũ, case sau giờ đóng `bo`. Không xoá dòng.
- **Khởi tạo ca** (GV / OPS, `fn_btnhe_tao`): lớp → em đã duyệt → buổi học sắp tới; ca bắt đầu lúc buổi tan, cùng phòng. Bị chặn nếu em không có lượt chốt L1 trong đúng tuần của ngày ca.
- **Dạng của em = dạng YẾU trong đúng các nhóm đã chốt** (lượt chốt mới nhất); nhóm chốt không có dạng yếu ⇒ 1 dạng chưa đạt điểm thấp nhất (`_btnhe_dang_chot`, Thùy 13/11).
- **Tài liệu giấy, 3 thứ in riêng:** lý thuyết + ví dụ · bài luyện · bài test (1 câu / dạng, tối đa 10 câu). Soạn bằng builder (tự lưu), in khuôn ET.
- **Chọn câu** (Thùy 12/11): khối 3–9 tự luận + trả lời ngắn ngang hàng, hết mới trắc nghiệm, **không hiện form trắc nghiệm**; khối 10–12 trắc nghiệm trước.
- **Điểm danh (Thùy 21/11): CHỈ Trang tích có mặt / vắng** (quyền `diem_danh_sau_gio`, admin luôn được; gán cho Phạm Thị Thùy Trang ở Phân quyền). **TA không điểm danh** — TA chỉ **ghi chú** từng em (em không đến · đến muộn…) ở thẻ nhập Đ/C/S (`sau_gio_ta_note`, `fn_btnhe_ta_note`). Một đường ghi duy nhất `fn_btnhe_diem_danh`; trigger khoá ghi thẳng từ client; đường cũ của người đứng ca (`fn_btyeu_bo_diem_danh`) từ chối buổi sau giờ. **Có bài ⇒ có mặt** (nộp Đ/C/S, như trên). **Không có bài ⇒ hệ thống tự điểm danh vắng** lúc 0h hôm sau (`_btnhe_tu_vang`, job `sau_gio_tu_vang`, chạy trước reset thứ Hai): em vắng + buổi huỷ, lý do ghi "Hệ thống…"; Trang soát theo ghi chú TA, đổi sang có mặt ⇒ mở lại buổi + case — chỉ khi ca chưa bị reset thứ Hai huỷ (ca còn mở, ngày thuộc tuần này) và em không có buổi sau giờ khác đang mở. Ca đã xong (có bài nộp) không đổi điểm danh.
- **Ai nhập / sửa Đ/C/S (Thùy 21/11 — lớp 11B1: TA nghỉ, GV không nhập được, reset huỷ 6 buổi đã có mặt):** TA của ca · người mở ca · **GV / TA được phân công lớp (mặc định có quyền)** · trưởng khối (môn × khối) · Trang · admin (`_btnhe_duoc_nhap`; đọc `fn_btnhe_ta_nhap_ds`, ghi `fn_btnhe_nhap_dcs`). **TA nghỉ ⇒ đổi TA của ca** (`fn_btnhe_doi_ta`, nút "Đổi TA" trên thẻ ca; quyền: trưởng khối · người mở ca · GV/TA lớp · Trang · admin) — không cần GV mở lại ca. GV / TA phân công lớp thấy ca của lớp ở Bổ trợ › Sau giờ (`fn_btnhe_ds`).
- **Reset thứ Hai KHÔNG huỷ buổi có em đã CÓ MẶT** (đã diễn ra, đang chờ nhập kết quả) — chỉ huỷ buổi chưa có mặt và chưa có bài làm. Buổi có mặt chưa nhập nằm ở danh sách "chờ nhập" như nợ cũ cho tới khi nhập xong.
- **Kết thúc:** TA nhập **Đ / C / S** từng câu test (`fn_btnhe_nhap_dcs`) ⇒ em có mặt + ca xong (`nhe_xong` / `day_xong`); test tính mastery như ET.
- Hiện: 63 case sau giờ đang mở; tuần này 69 buổi đã khởi tạo, 7 đã có kết quả. 30 ngày: 88 xong · 49 đóng `bo` (reset / huỷ).

### 7.3 Bù — R-BU
- **Invariant R-BU** (CLAUDE §4): ∀ lượt em **vắng** buổi thường (không huỷ) ⇒ ∃ **buổi bù còn hiệu lực** (không huỷ, em không vắng) **hoặc** một dòng `bang_khong_bu`. Thiếu ⇒ việc "cần xếp bù" (`fn_bu_lan_nghi_can_xep`, thuần tính — không có dòng chờ).
- `bang_khong_bu.loai`: `khong_can_bu` · `khong_xep_duoc` ("gặp vấn đề lịch và không xếp luôn" — trạng thái đóng, CEO). Có lý do + người ghi.
- Em vắng buổi bù / buổi bù huỷ ⇒ lượt nghỉ **quay lại** "cần xếp", kèm số lần đã xếp + lý do quay lại.
- Nội dung: luyện + test bù trên app, **100 % trắc nghiệm trước** rồi trả lời ngắn (Thùy 03/10, 10/10); nếu in giấy thì in mọi loại câu (§6, Thùy 21/11). BTVN của buổi nghỉ gắn về buổi mẹ (Thùy 03/11). Đóng ET buổi bù không đổi `trang_thai` buổi.
- Ô trống mastery do vắng-không-bù **để trống**, chờ dạng lặp lại lấp (CLAUDE §5).
- Số: 30 ngày 221 lượt vắng — 88 đã bù có mặt · 66 ghi không bù; **đang tồn 44 lượt cần xếp** (cũ nhất 03/10).

### 7.4 Đuổi (thống nhất 15/10, thay "Học từ đầu") — ⚠ CHƯA CHỐT
> **Thùy 17/11: "cần review lại bổ trợ đuổi kỹ hơn".** Dưới đây là HIỆN TRẠNG code / DB, không phải luật đã chốt. Điểm cần review: cổng "xong dạng" ≥ 50 % (mastery Đạt ≥ 80 %) · đợt hoàn thành bấm tay (17 / 89 đợt hoàn thành chưa từng chốt dạng mục tiêu) · hoàn thành / xoá đợt ghi thẳng từ client không log · cổng 50 % chỉ đếm câu đúng hẳn. Không đổi gì ở đuổi trước buổi review.
- **Đợt đuổi** = em × lớp (`bo_tro_duoi`: `can_duoi` → `hoan_thanh`; nguồn `thu_cong` · `tuyen_sinh`). **Mục tiêu = đúng các dạng GV chọn** (`bo_tro_duoi_dang`); dạng ngoài mục tiêu ẩn.
- Em **tự học ở nhà**: đọc lý thuyết → luyện → test từng dạng; đến ca TA làm cùng phần dở. **Xong một dạng = test dạng đó đúng ≥ 50 %** (Thùy 21/09; chỉ đếm câu đúng hoàn toàn).
- Khoá tuần tự theo bản đồ; TA **mở tay** được (`fn_duoi_mo_dang`). Một nguồn tiến trình `fn_duoi_tien_trinh` (nhà / ca suy từ ngày nộp test).
- Ca có thể in giấy cho MỌI dạng, mọi loại câu (Thùy 14/11; 21/11: không còn giới hạn "dạng có trắc nghiệm" — `fn_duoi_giay_sinh` chọn câu bất kỳ loại). Màn TA nói rõ khi đợt chưa có dạng mục tiêu / đợt đã hoàn thành (`fn_duoi_buoi_tinh_trang`).
- Kết thúc: người phụ trách bấm **Hoàn thành** (tay). `htd_test` tính mastery như ET (17/11).
- Hiện: 6 đợt đang đuổi (2 chưa chốt dạng) · 89 đã hoàn thành.

### 7.5 Hình — BỎ HẲN (Thùy 17/11)
- Bổ trợ Hình độc lập (17/10) chưa từng chạy (0 case). Thùy 17/11: bỏ hẳn. Còn trong code / DB: tab Hình ở hub Bổ trợ, Lịch phòng tab Hình, `CaHinhTA`, bảng `bo_tro_hinh` (+ `_log`, `_tai_lieu`), hàm `fn_bthinh_*`, trigger `trg_bthinh_*` — **gỡ = Luật xoá: liệt kê chính xác rồi chờ Thùy gật**. Nhánh cũ "Hình theo mô hình" cũng nằm trong danh sách gỡ (§11).

### 7.6 Ôn thi
- **Đợt ôn** mỗi kỳ (`bo_tro_on_thi_dot`: giữa kỳ / cuối kỳ × học kỳ × khối × từ–đến ngày). Trang thêm em tay. Ngoài hệ case, ngoài trần, **không đo** (`on_thi_luyen` không tính mastery).
- TA điểm danh + ghi báo động của đợt (`bo_tro_on_thi_bao_dong`: `moi` → `da_xu_ly`). Hiện 1 đợt (giữa kỳ I).

## 8. Theo dõi

| Ai | Xem gì | Ở đâu | Hàm |
|---|---|---|---|
| Trưởng khối | Em nào yếu, đã đề xuất chưa, lượt chốt đang ở đâu | Phòng làm việc › Chất lượng (Dashboard học tập · Danh sách bổ trợ) | `fn_dbht_bang` · `fn_btk_ds` |
| Trưởng bộ môn | Lượt chờ duyệt | Chất lượng › Danh sách bổ trợ | `fn_btk_ds` |
| Trang / Lộc | **Tiến độ tuần**: mỗi tuần × loại — đã chạy / chốt | Bổ trợ › Dashboard › Tiến độ | `fn_bo_tro_dashboard_tuan` |
| Trang / trưởng khối | **📊 Kết quả tuần**: dạng Giảm / Vẫn yếu sau ca (Yếu · Sau giờ) | Dashboard › Kết quả | `fn_botro_ket_qua_tuan` |
| Lộc | **Lấp đầy ca** (% theo HS, % theo đơn vị) · **Chi tiết** (1 buổi 1 dòng) | Dashboard | `fn_botro_lap_day_ca` · `fn_botro_chi_tiet` |
| Lộc / TA | Trạng thái sống của từng case / ca | Bổ trợ › Yếu › Trạng thái ca · Lịch phòng | `fn_btyeu_trang_thai_ca` · `fn_btyeu_ca_theo_doi` |
| TA | Câu em đang làm + lời giải | Trong ca (yếu · bù · đuổi) | `fn_ta_cau_cua_em` |
| HS · PH | Lịch bổ trợ sắp tới · Phần 2 Mục tiêu tuần | App HS · app PH | `fn_hs_lich_bo_tro` |
| CEO | Báo cáo tuần: Vào / Ra · Độ phủ · Hết yếu sau ca | Báo cáo Chuyên môn tuần | `fn_bctk_so` — `spec-van-hanh-tuan.md` §5 |

- "Chốt" ở Tiến độ = mọi lượt đã xếp có ngày trong tuần (kể cả vắng / không diễn ra), trừ ca OPS gỡ; "đã chạy" = em có mặt.
- Tự kiểm hiển thị: `fn_bo_tro_tu_kiem` (TA / HS có thấy ca không) + `fn_btyeu_kiem_ca_hs` — dải đỏ ở Lịch phòng.
- Số không realtime đọc bảng tính sẵn; chỉ trạng thái ca đang diễn ra mới hỏi lại theo chu kỳ — màn mới phải dùng cửa polling chung `src/lib/poll.ts` (`spec-kien-truc.md` K13).

## 9. Quy ước bắt buộc

1. Mọi số + luật ở DB (`fn_*`), màn chỉ vẽ (CLAUDE §2.0). Sau mutation **vá tại chỗ**; màn hàng đợi nhớ trạng thái ở module-level.
2. Đọc mastery qua bảng chụp (`_mastery_lan_cap_nhanh`); so trước / sau ca dùng tham số mốc `p_den`.
3. Chọn câu cho bài bổ trợ trên app: chỉ qua các hàm §6. Thêm `bai_test.loai` mới ⇒ quyết tường minh là test hay luyện (`spec-mastery.md` §2) + migration nới CHECK.
4. Thêm mức / trạng thái / kết quả mới ⇒ migration nới CHECK đi kèm (đã dính 12/11: thang L1–L4 quên nới `buoi_hoc_hs.don_vi` ⇒ không xếp được em L2).
5. Không tạo dòng chờ: không có "case chờ duyệt" ngoài `bo_tro_de_xuat`; không có "buổi bù chờ xếp".
6. Đổi trạng thái đề xuất / mức / case Hình ⇒ log bằng **trigger**, app không tự ghi log.
7. Việc chạy theo lịch ⇒ một dòng ở bộ điều phối `tinh_san_dang_ky`, không cron riêng (`spec-kien-truc.md` K4).
8. Không chạy lô nặng 17–22 h. Đổi cấu trúc bảng mà app đọc ⇒ thử qua REST.
9. Luật bổ trợ mới chỉ ghi vào file này; xếp lịch ghi vào #8.

## 10. Bảng · hàm · trigger

**Bảng (giá trị hợp lệ theo CHECK 17/11):**

| Bảng | Vai trò | Giá trị |
|---|---|---|
| `bo_tro_de_xuat` (+ `_log`) | Lượt đề xuất / duyệt | `trang_thai` nhap · cho_duyet · da_duyet · tra_lai · huy · `muc` 1–4 · `uu_tien` 1–3 · `nhom` mảng ≥ 1 |
| `hs_level` · `hs_level_log` | Mức hiện tại + lịch sử | `level` 0–4 · `loai` kien_thuc · thai_do |
| `bo_tro_yeu` | Case Yếu + case Sau giờ | `trang_thai` dang_xu · hoan_thanh · nhe_mo · nhe_xong · `ket_qua` dat · mot_phan · chua_dat · bo · day_xong · het_han · `uu_tien` 1–3 · `nguon` (không CHECK) ai_de_xuat · chuong_do · thu_cong · nhe · `ban_do` cu · moi |
| `bo_tro_yeu_dang` | Dạng của case | `nguon` duyet · tay · may · bao_dong · cột retest (di tích) |
| `bo_tro_duoi` · `bo_tro_duoi_dang` · `hoc_tu_dau_dang` | Đợt đuổi · dạng mục tiêu · tiến độ từng dạng | `trang_thai` (không CHECK) can_duoi · hoan_thanh |
| `bo_tro_hinh` (+ `_log`, `_tai_lieu`) | Case Hình | `muc` 1–3 · `ket_qua` on · can_them · bo · day_xong |
| `bo_tro_on_thi_dot` · `_bao_dong` | Đợt ôn thi | `loai` giua_ky · cuoi_ky |
| `bang_khong_bu` | Đóng R-BU không bù | `loai` khong_can_bu · khong_xep_duoc |
| `canh_bao_yeu` | Báo động GV / TA | — |
| `buoi_hoc` · `buoi_hoc_hs` | Buổi + em trong buổi | `loai` (bảng §1) · `btyeu_che_do` app · giay · `diem_danh` co_mat · vang · vang_phep |
| `bai_test` (+ `_cau`) · `bai_lam` (+ `_cau`) | Bài luyện / test | `loai` bo_tro · bo_tro_test · bu_luyen · bu_test · htd_luyen · htd_test · on_thi_luyen · retest (di tích) |
| `ca_bo_tro` · `ca_bo_tro_nhe` · `lich_truc_bo_tro` · `lich_khoi_chot` | Ca + lịch — **#8** | — |

**Hàm chính:** đề xuất / duyệt `fn_btk_goi_y` · `fn_btk_dang_nhom` · `fn_btk_luu` · `fn_btk_gui` · `fn_btk_duyet` · `fn_btk_tra_lai` · `fn_btk_huy` · `_btk_duyet_chay` ·
case / mức `fn_btyeu_doi_level` · `fn_btyeu_kiem_suc_chua` · `fn_btyeu_het_han_xu_ly` · `_btyeu_ket_thuc_case` ·
ca `fn_btyeu_ca_cua_toi` (HS) · `fn_btyeu_ca_ta` · `fn_btyeu_luyen_sinh` · `fn_btyeu_dong_ca` · `fn_btyeu_hoan_tat` · giấy `fn_btyeu_in_sinh` · `fn_btyeu_in_test` · `fn_btyeu_giay_nhap` · `fn_btyeu_giay_nop` ·
sau giờ `fn_btnhe_cho` · `fn_btnhe_tao` · `fn_btnhe_soan` · `fn_btnhe_luu_bai` · `fn_btnhe_nhap_dcs` · `fn_btnhe_doi_muc` · `_btnhe_dang_chot` · `_btnhe_reset_tuan` ·
bù `fn_bu_lan_nghi_can_xep` · `fn_bu_ca_cua_toi` · đuổi `fn_duoi_tien_trinh` · `fn_duoi_dang_trang_thai` · `fn_duoi_mo_dang` · `fn_duoi_buoi_tinh_trang` · Hình `fn_bthinh_mo` · `fn_bthinh_hoan_tat` · `fn_bthinh_dong` ·
theo dõi `fn_bo_tro_dashboard_tuan` · `fn_botro_ket_qua_tuan` · `fn_botro_lap_day_ca` · `fn_botro_chi_tiet` · `fn_bo_tro_tu_kiem`.

**Trigger:** `trg_bo_tro_de_xuat_log` · `trg_btyeu_suc_chua` + `trg_bthinh_suc_chua` (trần 70 / 20) · `trg_btyeu_ban_do_luc_mo` · `trg_btyeu_mot_buoi_cho_hoc` · `trg_bthinh_mot_buoi_cho_hoc` · `trg_btyeu_bao_dong_vao_case` · `trg_btnhe_dong_case` · `trg_htd_test_nop` (cổng ≥ 50 %) · `trg_bthinh_log`.

**Code:** lib `boTroTk.ts` · `botro_yeu.ts` · `botro_yeu_ca.ts` · `botro_nhe.ts` · `botro.ts` (bù) · `botro_duoi.ts` · `botro_hinh.ts` · `botro_on_thi.ts` · `botro_dashboard.ts` ·
màn `phongtk/BoTroPopup` · `phongtk/ChatLuongPhong` · `botro/*` · `danhgia/XepLichBoTroYeuScreen` · `TrangThaiCaBoTroScreen` · app TA `ta/CaBoTroTA` · `SauGioCa` · `SauGioNhapTA` · `PhieuGiayYeuTA` · `DuoiCaTA` · `CaHinhTA` · `CaOnThiTA` · app HS `hocsinh/CaBoTroHS` · `BoTroDuoiHS` · `luyen/LuyenYeuDau`.

## 11. Logic cũ còn sống, trái luật hiện hành — chờ Thùy gật mới gỡ (Luật xoá)

| # | Cái gì | Tình trạng 17/11 |
|---|---|---|
| 1 | **Retest**: công tắc `_btyeu_retest_bat()` = false; 24 hàm còn nhánh retest (`fn_btyeu_retest_*` · `_btyeu_bu_retest` · `fn_btyeu_bu_retest_ton`…) · trigger `trg_btyeu_retest_lam` · `trg_ta_retest_push_badge` · màn `RetestTab.tsx` · hằng `RETEST_BAT` · công cụ `bo_tro_retest` của ô hỏi TBM · `bai_test.loai = 'retest'` (35 bài, đều đã đóng) · cột `retest_*` · `dat` | Tắt, không chạy. Gỡ = xoá code + hàm |
| 2 | **Theo dõi + Duyệt 2 vòng + Chốt tuần cũ**: bảng `bo_tro_theo_doi` · `bo_tro_chot_tuan(_hs)` · `fn_botro_chot_tuan` · `fn_botro_danh_sach_tuan` · `fn_botro_theo_doi_vao` / `_ket_thuc` · màn `DuyetBoTroYeuScreen` (ẩn) · `botro_tuan.ts` | `fn_botro_theo_doi_vao` vẫn ghi được: **còn 1 dòng `theo_doi` mở ngày 16/11 (KHTN)** — trái ghi chú "không còn đường nào ghi" |
| 3 | **Luật 2 cửa sổ**: `fn_btyeu_dang_yeu_2_cua_so_moi` · `_btyeu_moc_2_cua_so(_tai)` · `_btyeu_dang_con_yeu` · `fn_btyeu_fill_dang_yeu` (client `botro_tuan.ts` còn gọi) · nhánh chết trong `_dang_yeu_tai_lo` | Chỉ màn ẩn gọi |
| 4 | **Máy đề xuất dạng cho case**: `fn_btyeu_de_xuat_dang_moi` · `fn_btyeu_dang_goi_y_moi` (đọc `fn_mastery_cells_bdm`) — `XepLichBoTroYeuScreen` vẫn gọi mỗi lần mở | Đang chạy (0,5–0,8 s). Trái "máy không đề xuất"? — §12 kỹ thuật 4 |
| 5 | **Hình theo mô hình**: `fn_hinh_yeu_*` · `hinh_yeu_da_day` · `HinhYeuScreen` · `HinhYeuTA` · nhánh `hinh_mo_hinh` trong `fn_btyeu_*` | Ẩn từ 17/10 |
| 6 | **Màn Nội dung bổ trợ yếu / Đánh giá ca** (`NoiDungBoTroYeuScreen` · `DanhGiaCaBoTroScreen`) | Dạng nay đổ lúc duyệt |
| 7 | **"Học từ đầu" cũ**: `LoTrinhDuoiHS` · `ChonChuDeHTD` · `htd_lo_trinh` (vỏ) | Thay bằng Đuổi thống nhất 15/10 |
| 8 | `_sau_gio_dang` | Không còn ai gọi (2 hàm chỉ còn nhắc tên trong chú thích) |
| 9 | Cột `bo_tro_yeu.muc` · `muc_may_de_xuat` · `de_xuat_may` (CHECK 1–3) | Case khối để trống; mức thật ở `hs_level` |
| 10 | `ket_qua` `dat` · `mot_phan` · `chua_dat` | 0 dòng — tuỳ câu 1 §12 |

## 12. Câu hỏi cho Thùy · lệch kỹ thuật

### 12.0 Thùy trả lời 17/11 (thắng mọi "đề xuất" ở 12.1; chỗ nào thân spec §1–§11 còn trái thì theo bảng này — sửa thân khi chốt hẳn)

| Câu | Thùy trả lời (nguyên ý) | Hệ quả cho spec | Việc code / DB (chỉ làm khi có lệnh) |
|---|---|---|---|
| 4 | **L3, L4 CÓ dùng, nhưng ít. Cách xếp GIỐNG L2, chỉ khác NGƯỜI DẠY.** | L2 · L3 · L4 cùng một đường: case ca khối → xếp theo lịch khối. Bỏ câu "L4 riêng với GV, ngoài khối, chưa có đường ra" và "mọi ca khối tính L2". Mức quyết định **ai dạy**, không quyết định đường xếp. **Người dạy (Thùy 17/11):** L2 = TA trực ca khối · **L3 = GIÁO VIÊN** · **L4 = đặc biệt nghiêm trọng: chuẩn bị kỹ hơn và ĐỔI giáo viên** (giáo viên khác với người đang dạy em). | L4 vào ứng viên ca khối; gán người dạy theo mức |
| 5 | **BỎ TRẦN. Bổ trợ yếu theo lịch khối tính từ L2 trở lên.** | Xoá luật trần 70 em / 20 Cao (§3). "Bổ trợ yếu theo lịch khối" = L2 + L3 + L4; L1 = sau giờ, không thuộc lịch khối. | Gỡ kiểm trần lúc duyệt + trigger trần lúc mở case, `_btyeu_tran_dang` / `_btyeu_tran_cao`, chữ "trần" trên màn |
| 6 | **BỎ HẲN Bổ trợ Khẩn cấp và Bổ trợ Hình.** | Loại "Khẩn cấp" không tồn tại. Bổ trợ Hình (§7.5) ra khỏi spec — còn: yếu (L1 sau giờ · L2–L4 ca khối) · bù · đuổi · ôn thi. (Đóng luôn câu 12.) | Ẩn / gỡ tab Hình, Lịch phòng tab Hình, `CaHinhTA`, bảng `bo_tro_hinh*` + `fn_bthinh_*` (0 case) — **xoá = Luật xoá, liệt kê rồi chờ gật** |
| 7 | **Báo động hiện THEO TUẦN ở màn Dashboard duyệt bổ trợ của trưởng khối.** | Báo động của GV / TA là tín hiệu của TUẦN, nằm ngay nơi trưởng khối đề xuất / duyệt bổ trợ (không phải 🚨 30 ngày ở Dashboard học tập). | Đưa báo động của tuần vào màn duyệt bổ trợ trưởng khối |
| 8 | **Cái này giáo viên chủ động.** | Dạng đưa vào bài không do hệ áp cứng theo mức — người dạy chủ động chọn. *Cần rõ: "giáo viên" = người dạy ca (TA / GV), và hệ vẫn gợi ý sẵn hay để trống (§12.1b).* | theo câu trả lời 12.1b |
| 11 | **Cần review lại bổ trợ ĐUỔI kỹ hơn.** | §7.4 Đuổi = **CHƯA CHỐT**, review riêng với Thùy (ngưỡng 50 % · hoàn thành tay · 17 / 89 đợt hoàn thành chưa chốt dạng · client ghi thẳng không log). Không đổi gì ở đuổi trước buổi review. | — |
| 8 (rõ thêm) | **Hệ vẫn gợi ý.** | Hệ điền sẵn dạng gợi ý; người dạy chủ động sửa / chọn. | — |
| 1 | Đồng ý đề xuất | Case KHÔNG ghi nhãn "đạt / chưa đạt" — kết quả là số suy từ mastery (test cuối ca là một lần đo); muốn nhìn nhanh thì hiện nhãn suy lúc đọc. | — |
| 2 | Đồng ý đề xuất | Mức thuộc lượt chốt tuần: case đóng / hết tuần ⇒ L0 (§3). | job / hàm hạ mức cuối tuần |
| 3 | Đồng ý đề xuất | Case ca khối giữ hạn 14 ngày, không reset thứ Hai. Thêm số **"chốt mà không chạy"** theo khối ở Dashboard bổ trợ. | số mới trên Dashboard |
| 9 | Đồng ý đề xuất | Ca có mặt mà không test vẫn tính Độ phủ; hiện tỉ lệ **"ca không test" theo TA**. | số mới trên Dashboard |
| 10 | Đồng ý đề xuất | Lượt bù tồn KHÔNG có hạn — chỉ đóng khi đã bù hoặc người ghi "không bù" có lý do; tô đỏ lượt quá 14 ngày. | tô đỏ ở màn bù |
| 12 | (theo câu 6) | Bổ trợ Hình bỏ hẳn. | xem câu 6 |

### 12.0b Đã sửa code / DB cho khớp (17/11, Thùy "có lệch gì thì fix luôn") — mig `202611172100` ĐÃ ÁP; phần màn chờ DEPLOY ERP + app TA
- ✅ **Bỏ trần:** gỡ trigger `trg_btyeu_suc_chua`; `fn_btyeu_kiem_suc_chua` luôn trả null; màn Duyệt bỏ "x/70", "Cao x/20", bỏ khoá duyệt khi đầy. (`_btyeu_tran_*` + trigger bên Hình còn — đi cùng việc gỡ Hình.)
- ✅ **L3 · L4 vào ứng viên ca khối** như L2 (`fn_ca_bo_tro_ung_vien`: mức ≥ 2). Nhãn mức trên màn sửa: L2 ca khối (TA) · L3 ca khối (giáo viên) · L4 ca khối (đổi giáo viên). *Chưa có:* ràng buộc "người dạy ca phải là giáo viên" với em L3 / L4 — hiện do người xếp tự chọn đúng người.
- ✅ **Mức về L0 khi hết lượt chốt tuần:** `_bt_muc_het_tuan()` chạy mỗi ngày 01h (bộ điều phối, sổ `bt_muc_het_tuan`), ghi `hs_level_log`. Chạy thử: 53 em sẽ về L0 ở lượt đầu.
- ✅ **Hạn 14 ngày tự chạy:** `_btyeu_het_han_chay()` mỗi ngày 01h (sổ `btyeu_het_han`) — trước chỉ chạy khi có người mở màn Xếp.
- ✅ **Ẩn tab Hình** ở hub Bổ trợ (chưa xoá gì).
- ⏳ **Chưa làm (là xây thêm, không phải sửa nhanh):** báo động theo tuần ở màn duyệt của trưởng khối (câu 7) · số "chốt mà không chạy" + tỉ lệ "ca không test" theo TA trên Dashboard (câu 3, 9) · tô đỏ lượt bù quá 14 ngày (câu 10) · gỡ hẳn Bổ trợ Hình (Luật xoá) · các lệch §12.2 còn lại.

### 12.1b Hỏi lại cho rõ (phát sinh từ câu trả lời)
- **4b.** ✅ Thùy 17/11: L3 cũng là giáo viên; L4 đặc biệt nghiêm trọng thì chuẩn bị kỹ hơn và đổi giáo viên. *(L2 = TA trực ca khối là tôi hiểu theo hiện trạng — Thùy chưa nói ngược lại.)*
- **8b.** ✅ Thùy 17/11: "hệ vẫn gợi ý". ~~"Giáo viên chủ động" = người dạy ca tự chọn dạng trong các nhóm đã chốt (hệ vẫn điền sẵn gợi ý, sửa được) — hay hệ để trống hoàn toàn cho người dạy chọn? Áp cho cả L1 sau giờ lẫn ca khối?

### 12.1 Câu hỏi gốc (ĐÃ TRẢ LỜI HẾT ở 12.0 — giữ làm bối cảnh; "đề xuất" dưới đây là trước khi Thùy chốt)

1. **Case có cần một KẾT LUẬN "đạt / chưa đạt" không?**
   Hiện: case chỉ đóng bằng "dạy xong" · "hết hạn" · "bỏ". Em khá lên hay không chỉ thấy ở Dashboard (dạng Giảm / Vẫn yếu) và Báo cáo tuần — hệ không ghi kết luận lên case.
   (a) Giữ như hiện tại — kết luận là số suy từ mastery. (b) Lúc hoàn tất ca, hệ ghi nhãn theo test cuối ca (ví dụ ≥ 80 % đạt · 50–79 % một phần · < 50 % chưa đạt). (c) Trưởng khối tự kết luận tay.
   **Đề xuất: (a)** — test cuối ca đã là một lần đo của mastery; ghi thêm nhãn là hai nguồn cho một sự thật. Nếu muốn nhìn nhanh thì hiện nhãn suy ra lúc đọc.

2. **Mức L của em có "hết hạn" không?**
   Hiện: case đóng xong mức **vẫn giữ nguyên** cho tới khi có lượt duyệt mới hoặc ai đó hạ L0 tay. 210 em đang mang mức L1–L3, nhưng 93 em không có case nào đang mở, 73 em không có cả lượt duyệt tuần này.
   (a) Mức là của **lượt chốt tuần** — case đóng / hết tuần thì em về L0. (b) Mức là **nhãn dài hạn** của em, giữ tới khi người đổi.
   **Đề xuất: (a)** — khớp "1 tuần 1 lần, tuần sau chốt lại"; "em đang bổ trợ" = có case mở hoặc lượt duyệt trong tuần. Lịch sử mức vẫn còn trong log.

3. **Case ca khối không xếp được: 30 ngày có 60 case "hết hạn 14 ngày" so với 51 case "dạy xong".**
   Thùy 16/11 đã chốt ca khối KHÔNG reset thứ Hai (chỉ Sau giờ reset). Hỏi: (a) giữ hạn 14 ngày; (b) rút còn hết tuần như Sau giờ; và **case hết hạn mà chưa học buổi nào có cần hiện thành một con số riêng** (ở Dashboard bổ trợ / Báo cáo tuần) không?
   **Đề xuất: giữ 14 ngày + thêm số "chốt mà không chạy" theo khối vào Dashboard** — đây là chỗ bổ trợ rơi mà hiện không ai thấy.

4. **L3 và L4 có đang dùng không?**
   Hiện: popup trưởng khối vẫn cho chọn cả 4 mức. L3: 12/11 Thùy chuyển hết về L2, nhưng tuần này vẫn có 1 em được duyệt L3. L4: duyệt xong mở case như L2, tính vào trần 70, nhưng không vào ứng viên ca khối và không có màn nào cho GV xếp ⇒ nằm 14 ngày rồi "hết hạn" (hiện 0 em L4).
   (a) Khoá L3 + L4 trên popup tới khi Thùy mở. (b) L3 mở, L4 khoá. (c) L4 = chỉ ghi nhận, GV tự xếp ngoài hệ, không mở case, không tính trần.
   **Đề xuất: (a).**

5. **Trần 70 em / 20 Cao tính những ai?**
   Hiện đếm thực tế: case ca khối (L2 · L3 · L4) + Hình. **L1 sau giờ không tính** (bản 13/11 ghi "vẫn đếm L1" — không đúng với code).
   **Đề xuất: xác nhận đúng như đang chạy** (trần là sức chứa ca khối; L1 không tốn ca khối), L4 theo câu 4.

6. **"Bổ trợ Khẩn cấp" (nêu 17/10, chưa làm) còn cần không?**
   Từ 10/11 trưởng khối đề xuất và trưởng bộ môn duyệt được **bất kỳ ngày nào**; báo động khi em đang có case thì dạng vào thẳng case.
   (a) Coi như đã có — bỏ khái niệm Khẩn cấp. (b) Vẫn cần loại riêng (vượt "1 tuần 1 lần" / vượt trần).
   **Đề xuất: (a).**

7. **Báo động của GV / TA cho em CHƯA có case đi đâu?**
   Trước 13/11 vào hàng đợi Duyệt. Nay chỉ hiện 🚨 30 ngày trên Dashboard học tập, trưởng khối tự quyết (30 ngày: 56 báo động).
   (a) Đúng ý — báo động là tín hiệu. (b) Báo động phải thành một việc trưởng khối bắt buộc xử lý (bấm "đã xem / đưa vào bổ trợ / bỏ qua").
   **Đề xuất: (a) cho tới khi có số báo động bị bỏ sót.**

8. **Dạng đưa vào bài: L1 và L2 đang khác nhau — có chủ ý không?**
   L1 Sau giờ: chỉ dạng **Yếu** trong nhóm đã chốt. L2 ca khối: mọi dạng **chưa đạt** (Yếu + Cần luyện) trong nhóm đã chốt.
   **Đề xuất: giữ** (ca sau giờ 20–25′ không đủ cho cả dạng Cần luyện) — chỉ cần Thùy xác nhận.

9. **Ca hoàn tất mà em không làm test** (TA nhập lý do "không test") có được tính là "đã bổ trợ" trong Độ phủ không?
   Hiện: có tính (đếm ca em có mặt). 30 ngày: 180 bài test sinh ra, 132 đã nộp.
   **Đề xuất: vẫn tính Độ phủ, nhưng hiện thêm tỉ lệ "ca không test" theo TA** (thiết kế 03/09 đã nêu, chưa thấy trên Dashboard).

10. **Bù: lượt nghỉ tồn có hạn không?** Đang tồn 44 lượt cần xếp, cũ nhất 03/10.
    (a) Không hạn — tồn tới khi bù hoặc có người ghi "không bù". (b) Quá N ngày tự chuyển "không xếp được".
    **Đề xuất: (a)** + tô đỏ lượt quá 14 ngày (đóng phải do người, có lý do).

11. **Đuổi: "xong dạng" là test ≥ 50 %, trong khi mastery Đạt là ≥ 80 %.** Em đuổi xong dạng ở 50–79 % sẽ hiện "Cần luyện" trên Dashboard.
    **Đề xuất: giữ 50 %** (đuổi là để bắt kịp, không phải thành thạo) — chỉ cần xác nhận. Kèm: đợt đuổi hoàn thành do người bấm tay — 17 / 89 đợt đã hoàn thành mà chưa từng chốt dạng mục tiêu; có chặn không?

12. **Bổ trợ Hình chưa từng chạy** (0 case từ 17/10), mức vẫn theo thang cũ L1–L3. (a) Giữ nguyên chờ dùng. (b) Ẩn tab Hình tới khi bản đồ Hình xong rồi thiết kế lại theo nhóm.
    **Đề xuất: (b).**

### 12.2 Lệch kỹ thuật (không cần Thùy quyết — CTO làm khi có lệnh)

1. **Duyệt gộp vào case đang mở không cập nhật ưu tiên** của case theo lượt duyệt mới (`_btk_duyet_chay` chỉ ghi `uu_tien` khi mở case mới).
2. **Hạn 14 ngày chạy "lười"**: `fn_btyeu_het_han_xu_ly` chỉ được gọi khi nhân sự mở màn Xếp (client, 10 phút / lần; lần đóng gần nhất 10/11) — không ai mở màn thì không case nào hết hạn. Nên đăng ký bộ điều phối. Hàm bỏ qua case có ca em đã có mặt chưa hoàn tất ⇒ 2 case mở từ 03/10 sống mãi (xem mục 3).
3. **5 ca Yếu em đã có mặt mà chưa hoàn tất**, 2 ca trước hôm nay (cũ nhất 03/10) — kẹt, cần dọn tay hoặc luật tự đóng.
4. `XepLichBoTroYeuScreen` vẫn gọi `fn_btyeu_de_xuat_dang_moi` (§11 mục 4) — đọc cấp dạng qua `fn_mastery_cells_bdm`, không qua bảng chụp.
5. `fn_botro_ket_qua_tuan_loai` đọc `fn_mastery_cells_bdm` tại mốc cho từng em (tính trực tiếp) — đúng luật mới (chỉ test) nhưng chưa đo thời gian với tuần đông.
6. **Không hàm bổ trợ nào còn đọc luật đo cũ** trên đường đang chạy: `_btyeu_dang_theo_nhom` · `_btk_duyet_chay` · `_btnhe_dang_chot` · `fn_btk_goi_y` đều gọi `_mastery_lan_cap_nhanh(…, true, …)` (bản có BTVN, chỉ test). Luật cũ chỉ còn ở §11 mục 3–4.
7. `bo_tro_yeu.nguon` và `bo_tro_duoi.trang_thai` / `nguon` **không có CHECK** (giá trị đang dùng ghi ở §10).
8. `bo_tro_yeu_dang.nguon` CHECK không có `nhe`, bản 13/11 ghi "đổ vào case `nguon='nhe'`" — thực tế dạng sau giờ ghi `may`; `nhe` là nguồn của **case**.
9. `botro_duoi.ts`: hoàn thành đợt + **xoá cứng** đợt đuổi làm thẳng từ client (`.update` / `.delete` trên `bo_tro_duoi`), không qua hàm, không log.
10. 20 / 61 lượt ca Yếu có mặt 30 ngày **không ghi chế độ** app / giấy (cột trống) — hoàn tất không bắt chọn.
11. Cổng ≥ 50 % của Đuổi chỉ đếm `correct`; mastery tính "một phần" = 0,5 — hai cách đếm.
12. `check:style-hs` đang rớt sẵn ở `CaBoTroHS.tsx` (3 màu gõ tay).
13. Bản 13/11 ghi "30 em theo dõi kết thúc `go`" — DB: `go` 58 · `bo_qua` 94 · `len_chinh_thuc` 57 · còn 1 `theo_doi`.

## 13. Chuyển sang spec khác (không chép vào đây)

**Sang #8 `spec-van-hanh-trung-tam.md` (chốt 17/11):**
- `spec-bo-tro.md` §3 phần đơn vị / ca + trần đơn vị tuần (`_ca_bo_tro_don_vi`, `_btyeu_dv_tuan`) · §4 gạch "Xếp lịch (Lộc)" + "Capacity khối" · §5 phần khởi tạo ca (giờ, phòng) + ảnh thông báo PH · §6 đơn vị bù theo nhóm.
- `spec-bo-tro.md` **§41** (đơn vị bù theo nhóm vào Lịch phòng) · **§42** (Lịch khối ↔ Lịch phòng đồng bộ) · **§43** (phòng dùng chung với test / phát sinh).
- `spec-xep-bo-tro-chung.md` **gần trọn**: §1 đơn vị · §2 ca trực TA · §3 phòng + lịch phòng một nguồn + Chốt tuần lịch khối · §4 luồng xếp · §6–§6b màn Lịch phòng · §7 quyền · §8 hướng DB · §9 giả định G1–G4. (Chỉ §5 "ưu tiên trong loại" được tóm ở §3 trên.)
- Điểm danh ca · huỷ ca · "Xếp = đã chốt PH" · báo phụ huynh (ảnh thông báo sau giờ, nhắn lịch).
- Việc còn treo của §42: 5 nhóm dòng Lịch khối nhân đôi · bấm Chốt tuần · 2 ca mồ côi đã có em.

**Sang #10 `spec-tro-giang.md` (chốt 17/11):** màn app TA của từng loại ca · TA chỉnh câu trả lời ngắn · viewer "Câu em đang làm" · công TA ca bổ trợ (đầu việc `bo_tro_sau_gio`, giờ bổ trợ, thiếu công) · hướng dẫn TA (bản cũ đã lỗi thời).

**Sang #12 `spec-app-hs.md`:** ô Bổ trợ · màn `CaBoTroHS` · `BoTroDuoiHS` · lịch bổ trợ trên app.

**Sang #6 `spec-quan-ly-chat-luong.md`:** phạm vi trưởng khối / trưởng bộ môn · KPI dạng yếu đóng băng lúc Trang Chốt tuần.

## 14. Đã làm khi Thùy chốt (17/11)

- File này thay bản 13/11 (bản cũ → `_luu-tru/spec-bo-tro-ban-13-11.md`; §41–§43 của nó + `spec-xep-bo-tro-chung.md` còn hiệu lực cho xếp lịch tới khi #8 viết xong).
- `SPEC-INDEX.md` dòng #18 ✅. CLAUDE.md đoạn trỏ `spec-bo-tro.md` giữ nguyên (cùng tên file).
- **Còn nợ:** review Đuổi với Thùy (§7.4) · mọi việc code / DB ở §12.0 + §12.2 chờ lệnh · mục §11 gỡ theo Luật xoá.
