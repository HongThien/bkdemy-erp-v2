# Chăm sóc Phụ huynh & Referral (hồ sơ sức khoẻ PH) — Feature Spec · BKdemy ERP

> **Viết bám sát `BKDEMY_CANHBAO_BOTRO_SPEC.md`** — cùng 4 mắt xích, cùng case log, cùng cơ chế delta + benchmark.
> Đối tượng đổi: **(HS × dạng) → (PH × vấn đề)**. Đội đã hiểu mô hình đó ⇒ chi phí học ≈ 0.
> Nền suy nghĩ: `CSKH-HANDOFF.md` (đọc trước). Ngày: 01/09/2026.
> **Ẩn dụ chủ đạo:** mỗi PH có một **hồ sơ sức khoẻ** · mỗi sự kiện là một **diễn biến** · playbook là **phác đồ điều trị**.

---

## 0. Nguyên tắc nền

1. **Case log là xương sống — dựng TRƯỚC, mọi mắt xích ghi vào.** Bỏ nó thì cả mảng thành đồ chơi: không đo được hiệu quả, không học được, không kiếm được quyền tự động.
2. **Không quy kết nhân quả.** "Sau khi chăm sóc, PH có ấm lên không" — ấm thì tính là có hiệu quả; đủ nhiều ca thì kết luận về *loại/playbook* tự chắc. KHÔNG cố tách "ấm lên nhờ cái gì".
3. **Tự động hoá là PHẦN THƯỞNG KIẾM ĐƯỢC, không phải nút bật.** v1 = **AI đề xuất, người duyệt (bắt DELTA)**.
4. **Báo nhầm cũng gây hại.** Gắn nhãn "nguy cơ" lên một phụ huynh nhạy cảm không kém gắn lên một đứa trẻ. Mọi hành động chạm PH đi qua **người duyệt** ở phase đầu.
5. ⭐ **KHÔNG ÉP PHỤ HUYNH.** Hệ là **bộ lọc tìm người sẵn sàng**, không phải bộ máy thúc người chưa sẵn sàng. **Chưa hài lòng thì không động tới chuyện giới thiệu.**
6. ⭐ **Đo NGƯỜI THỰC HIỆN bằng chất lượng chạm, KHÔNG bằng số lời giới thiệu.** Treo chỉ số referral lên đầu cá nhân là đẻ ra hành vi ép. Referral chỉ đo ở **cấp hệ thống**.
7. ⭐ **KHÁC CĂN BẢN với bổ trợ yếu: KHÔNG CÓ THANG ĐO KHÁCH QUAN.**
   HS có mastery (5 lần đo, khách quan). PH thì "hài lòng" **không đo trực tiếp được** — mọi tín hiệu đều là **proxy**.
   ⇒ Hệ quả bắt buộc: (a) bar can thiệp **cao hơn** bổ trợ yếu · (b) mọi điểm số **luôn đi kèm ĐỘ PHỦ** · (c) độ phủ < 50% ⇒ **không hành động theo điểm**, việc lúc đó là **đi khám**.
8. **Chưa đo ≠ điểm thấp** (§5 CLAUDE.md). Mục chưa điền **không phải 0** — tính theo **tỷ lệ trên các mục đã điền**.
9. **Lưu tín hiệu THÔ, không lưu điểm** (như §1: mastery không lưu, suy động). Công thức chấm sẽ đổi nhiều lần; lưu điểm = mất lịch sử.
10. **Lưu cả CẤU TRÚC lẫn NGUYÊN VĂN.** Nhãn suy được từ nguyên văn; nguyên văn không suy được từ nhãn. **Cấm chỉ lưu nhãn.**

---

## 1. Vòng lõi (4 mắt xích + case log)

```
Khám ─► Chẩn đoán ─► Điều trị ─► Tái khám
  │         │            │           │
  └────┬────┴─────┬──────┴─────┬─────┘   (mọi mắt xích GHI vào)
       ▼          ▼            ▼
 ┌──────────────────────────────────────────┐
 │ CASE LOG (xương sống)                      │
 │ tín hiệu+mức → bệnh → playbook →           │
 │ đề xuất AI → NGƯỜI SỬA GÌ+LÝ DO →          │
 │ can thiệp → pre/post-1/post-2 → NGUYÊN VĂN │
 └──────────────────────────────────────────┘
       ↻ nuôi lại "Chẩn đoán" (playbook tiến hoá) + là thước autonomy
```

---

## 2. Mắt xích #1 — KHÁM / Phát hiện (deterministic, KHÔNG phải AI)

- **Bắt SỚM bằng THAY ĐỔI, không bằng MỨC.** PH luôn chậm phí = tính cách, không nói gì. PH luôn đúng hạn mà tháng này chậm = **tín hiệu**. Áp cho mọi tín hiệu hành vi.
- **Output = MỨC (triage), không phải cờ có/không.** Hai băng:

| Băng | Bar | Ví dụ tín hiệu | Ý nghĩa |
|---|---|---|---|
| **Cảnh báo** | thấp — quét rộng, rẻ, **chấp nhận báo nhầm** | band con tụt 1 tháng · vắng nhích lên · im lặng > 30 ngày · độ phủ hồ sơ thấp | chỉ là cờ theo dõi, **không tốn người** |
| **Xử lý — nhẹ** | cao | ≥2 tín hiệu cảnh báo cùng lúc · band tụt 2 tháng liên tiếp · **chậm phí lần đầu** | tốn 1 cuộc gọi |
| **Xử lý — nặng** | rất cao | **hỏi về bảo lưu/nghỉ** · ngừng trả lời tin nhắn · nợ phí + con đang tụt | người cứng gọi, SLA 48h |

- **Nguồn tín hiệu (reuse, không đẻ lại):** `bao_cao_ph` (`nl_band` theo tháng → delta) · `canh_bao_yeu` · `bo_tro_yeu` · `buoi_hoc_hs` (vắng) · `hoa_don`/`thanh_toan` (chậm phí) · `hoc_sinh` (thâm niên, khối, trường) · Cổng PH (`last_sign_in_at`, `must_change_password` — **tín hiệu YẾU, chỉ nói "đã mở cửa"**, không nói thái độ) · phần điền tay · ghi âm cuộc gọi (trích xuất) · Zalo (⏳ chờ, xem §8).
- ⭐ **Quy tắc PH có nhiều con:** tín hiệu đến theo (HS × môn), nhưng vấn đề gắn với **PH**. **Cờ đỏ của MỘT con kéo cả PH sang mức nặng** — bố mẹ không tách bạch, họ chỉ nhớ "BK đang có vấn đề với con tôi". Điểm hài lòng gộp: lấy **con có trạng thái xấu nhất**, không lấy trung bình.
- **Chuẩn hoá theo lớp:** so PH với **trung vị lớp của con**, không so toàn trung tâm. Lớp có GV được yêu thích thì cả lớp điểm cao — đó là biến của **GV**, không phải của PH.

---

## 3. Mắt xích #2 — CHẨN ĐOÁN + PLAYBOOK (chỗ AI vào)

**Playbook = chính sách quyết định viết thành DATA.** Cùng một mức nhưng **bệnh khác nhau → xử khác nhau** → mỗi bệnh một playbook.

### 3.1 Danh mục BỆNH (v1 — Cách 1, thô, ít)

| Mã | Bệnh | Triệu chứng quan sát được | Câu hỏi khám phân biệt |
|---|---|---|---|
| **B0** | **Chưa rõ** (chưa khám) | độ phủ < 50% | → playbook = **đi khám**, không đoán |
| **B1** | Thất vọng về kết quả con | band tụt · cảnh báo yếu · so sánh điểm | *"Chị kỳ vọng con đạt mức nào? Hiện chị thấy cách chỗ đó bao xa?"* |
| **B2** | Thấy không được quan tâm | im lặng · ít chạm · từng nhắn mà không ai trả lời | *"Chị có đủ thông tin về việc học của con không?"* |
| **B3** | Vấn đề tiền | chậm phí (đổi hành vi) · hỏi về học bổng/giảm | *"Kỳ này nhà mình có gì cần em sắp xếp không?"* |
| **B4** | Vấn đề lịch / đi lại | vắng tăng · xin đổi ca nhiều · vắng đúng khung giờ | *"Giờ học hiện tại có hợp với lịch nhà mình không?"* |
| **B5** | Mất niềm tin vào một GV | tụt sau khi đổi GV · nhắc tên GV · cả lớp đó cùng tụt | *"Con có hay kể gì về buổi học không?"* |
| **B6** | Con không muốn đi học | vắng + con phản đối · GV báo đổi thái độ | *"Con nói gì khi đến giờ đi học?"* |
| **B7** | **Mù thông tin** — không biết con đang học gì | chưa vào app · chưa xem báo cáo · hỏi lại thứ đã báo | *"Chị có xem báo cáo tháng không? Có chỗ nào khó hiểu?"* |
| **B8** | ⭐ **Hài lòng nhưng vô hình** | học ≥4 năm · không cờ xấu · không tương tác · chưa từng giới thiệu | *"Hồi đầu con thế nào, giờ chị thấy khác gì?"* → **khơi lại lý do** |

> **B8 là bệnh không có triệu chứng khó chịu** — đúng "chữ U ngược" của thâm niên. Không cố ý tìm thì không hệ nào bắt được, và đây là nhóm PH lâu năm, hài lòng, mà **không bao giờ kể với ai**.

- **1 period = 1 chính sách chung. Mỗi bệnh đúng 1 playbook. KHÔNG phân thân, KHÔNG A/B song song** (2 PH giống nhau xử khác nhau = loạn vận hành + chẻ mẫu). So sánh **theo THỜI GIAN, không theo không gian** (§6).
- **AI ở đây (v1):** cho một ca (tín hiệu + mức), AI **đề xuất bệnh + playbook khớp** + diễn giải, có thể **gắn cờ ca đặc biệt** (không khớp bệnh nào). **v1 = luật/playbook-based**, CHƯA "học".
- ⭐ **Người duyệt — BẮT DELTA (sống-chết):** không cho approve trơn. Hệ ghi **người sửa gì so với đề xuất AI + LÝ DO**. Approve mù = data rác. **Tín hiệu học nằm ở delta, không ở approve.**
- ⭐ **Mỗi đề xuất AI PHẢI kèm "dựa trên tín hiệu nào" + "độ phủ bao nhiêu".** Không có ⇒ người duyệt sẽ tin những đề xuất dựng từ không khí (AI làm rác trông như vàng — rule engine thì lộ ra ngay, AI thì không).

---

## 4. Mắt xích #3 — ĐIỀU TRỊ / Chạy chăm sóc

**⚠️ Khác bổ trợ yếu: catalog can thiệp CHƯA CÓ, phải dựng.** (Bổ trợ yếu reuse được 5 loại bổ trợ + tài liệu + TKB sẵn.)

### 4.1 Catalog can thiệp (v1)

| Mã | Can thiệp | Chi phí | Ai làm |
|---|---|---|---|
| C1 | Nhắn tin **có nội dung cụ thể** về con | thấp | OPS/CSKH |
| C2 | Gọi ngắn (5–10') | vừa | CSKH |
| C3 | Gọi sâu / tâm sự (20'+) | cao | CSKH (nền tâm lý) |
| C4 | **Thùy gọi** | rất cao | CEO — dùng cho ca nặng/nhạy cảm |
| C5 | Mời dự giờ | vừa | OPS |
| C6 | **Tặng suất chẩn đoán để PH ĐƯA cho người khác** | thấp | — mở cửa DÁM + NÓI ĐƯỢC |
| C7 | Gặp trực tiếp | cao | CEO/CSKH |
| C8 | Điều chỉnh vận hành (đổi ca/GV/xếp bổ trợ) | tuỳ | OPS |
| C9 | Gửi **tin vui về con** (level up · Elo · ca bổ trợ đóng · delta band) | rất thấp | máy + người duyệt nội dung |

### 4.2 Ba luật phiên dịch (bắt buộc, áp cho mọi can thiệp)
1. ⭐ **Tin xấu KHÔNG BAO GIỜ để máy nói.** Tin tốt máy gửi được; tin xấu qua người. Ranh giới cứng.
2. **Hành động trước, chẩn đoán sau.** *"Con yếu → xếp bổ trợ"* = phán xét. *"Em xếp cho con buổi kèm thứ 5, con đang vướng dạng X"* = BK đang làm gì đó cho con.
3. **Cụ thể mới là quan tâm.** **Ấm = CỤ THỂ**, không phải emoji hay nhiều chữ.

### 4.3 Trần chạm
- **Một PH = MỘT người phụ trách duy nhất.** Mọi playbook đi qua người đó.
- Trần tần suất **không để giảm tổng số chạm** (ở VN nhiều chạm là **tính năng**) — mà để **tránh chạm trùng lặp từ nhiều người**.
- **Ngưỡng DỪNG:** PH từ chối lời mời giới thiệu 2 lần ⇒ thôi, không hỏi nữa. Ghi cờ.
- **Cờ "chỉ Thùy gọi"** cho ca nhạy cảm.

---

## 5. Mắt xích #4 — TÁI KHÁM / Đánh giá

**⚠️ Đây là chỗ YẾU NHẤT khi clone** — không có mastery làm thước. Phải dùng proxy, và phải biết mình đang dùng proxy.

- **Per-CA, 2 mốc:**
  - **post-1 = ngay sau can thiệp** → *PH có phản hồi không, phản hồi thế nào*. **BẮT BUỘC ghi NGUYÊN VĂN 1–2 câu PH nói** — không chỉ nhãn. Người gọi tự chấm ⇒ rất chủ quan ⇒ nguyên văn là thứ duy nhất kiểm chứng được.
  - **post-2 = sau 30 ngày** → *có giữ được không*: cờ đỏ tắt chưa · có tương tác trở lại không · có đổi ô/level không.
  - ⭐ **Tín hiệu quý "lên rồi rớt"** (post-1 tốt, post-2 nguội lại) = chạm **XOA DỊU** chứ không **GIẢI QUYẾT** → data để playbook học đổi cách. Một mốc thì mù chuyện này.
- **So pre → post trên đúng bệnh đã điều trị.** Ấm lên = tính là có hiệu quả (không quy kết nhân quả).
- **Per-BỆNH/PLAYBOOK = gộp nhiều ca** → nuôi benchmark (§6).

---

## 6. Playbook quality + Benchmark (cơ chế tiến hoá — LÕI)

> ⚠ **Đo quality PLAYBOOK ≠ đo hiệu quả CA.** Hiệu quả ca (#5) = PH có ấm lên không. Quality playbook = playbook có tốt hơn **mặt bằng trên cùng phân khúc** không → quyết nhân rộng / giết.

1. Trong một **period**: cả trung tâm chạy **một chính sách chung**; mỗi bệnh 1 playbook.
2. Mỗi playbook tích ca → ra **con số hiệu quả**.
3. **Benchmark THEO PHÂN KHÚC (chuẩn hoá độ khó):** playbook xử ca nặng so với *mặt bằng ca nặng*, không so một con số chung (kẻo giết oan playbook xử ca khó).
4. **Gate CỨNG "đủ mẫu + đủ thời gian":** chưa đủ N ca / T thời gian → playbook ở trạng thái **"đang thử", MIỄN đánh giá**.
5. Cuối period: trên benchmark → giữ; dưới → **THAY bằng ứng viên mới**. Nguồn ứng viên: người rút từ case log / AI đề xuất biến thể từ ca thành công. ⭐ **Loại tệ + NẠP ứng viên = MỘT vòng, không chỉ cắt** (cắt mà không đắp = lỗ hổng).
6. ⭐ **CẢNH BÁO TỐC ĐỘ:** 300 PH, mỗi PH ít ca hơn HS nhiều ⇒ **mẫu lên rất chậm**, chậm hơn bổ trợ yếu hàng bậc. ⇒ **period dài hơn** (6 tháng, không phải 3) và **phân khúc gộp thô hơn**. Đừng chẻ nhỏ phân khúc — sẽ không bao giờ đủ mẫu.

**Cách XÂY playbook = 2 giai đoạn của 1 vòng:**
- **Cách 1 (nền):** vài playbook chung THÔ trước — mọi ca xử theo *một khung nhất quán*.
- **Cách 2 (tiến hoá):** chạy N ca → review case log → rút playbook phổ biến / tách ca đặc biệt / giết cái tệ.
- **Bắt buộc Cách 1 trước** — không có khung chung thì 200 ca = 200 quyết định ngẫu hứng, review không ra pattern.

---

## 7. Lộ trình tự-động-hoá & Học

- **Phase A (v1):** người quyết là chính; **AI đề xuất bệnh + playbook, người duyệt + bắt delta**. Mọi hành động chạm PH qua người.
- **Phase B:** khi case log chứng minh đề xuất AI khớp người + kết quả tốt trên đủ ca → AI tự chạy mức **Cảnh báo**; mức Xử lý vẫn người ký.
- **Cơ chế học (KHÔNG fine-tune):** case log (đề xuất + **delta người sửa** + outcome + **nguyên văn**) → tiền lệ/rule/biến thể playbook. **Chỉ học được nếu mọi delta + mọi outcome được ghi có cấu trúc.**
- ⭐ **Chống buồng vọng:** tách rõ **nguồn** mỗi trường — *máy sinh* / *người ghi* / *AI đề xuất*. Nếu người copy đề xuất AI vào ô ghi chú thì vòng sau AI đọc lại lời mình và **tự khẳng định**.
- ⭐ **Khi AI đề xuất giống nhau 3 vòng liên tiếp cho cùng một loại tình huống ⇒ luật đã lộ ra ⇒ mã hoá thành rule cứng.** Vòng lặp là cách **khám phá luật**, không phải trạng thái cuối.

---

## 8. Phạm vi v1

**IN:**
- **Sổ tín hiệu** (thô, append-only) + phần **điền tay** (có `ngay_dien`; quá 12 tháng ⇒ hạ trọng số / coi như chưa đo).
- **Phát hiện** deterministic → **mức** (Cảnh báo / Xử lý nhẹ-nặng) + **phân khúc**. Ngưỡng chỉnh được.
- **Danh mục bệnh B0–B8** + **catalog can thiệp C1–C9** + seed playbook Cách-1 (1 playbook/bệnh).
- **Chẩn đoán:** AI đề xuất bệnh + playbook → **người duyệt, hệ BẮT DELTA + lý do**; đề xuất **kèm tín hiệu căn cứ + độ phủ**.
- **Điều trị:** orchestration nối can thiệp; ghi lần chạm **chỉ khi đã chạm thật**.
- **Tái khám:** pre → post-1 (kèm **nguyên văn**) → post-2 (30 ngày), per-ca; gộp per-playbook.
- **CASE LOG** (central, dựng SỚM NHẤT).
- **Benchmark/period** (§6) — build v1, chỉ *bite* khi đủ data.
- **Quy kết referral:** trường bắt buộc **"biết BK qua ai"** ở luồng tuyển sinh inbound + link `nguoi_gioi_thieu`.
- 3 màn hình: **Danh sách PH** · **Hồ sơ 1 PH** · **Hàng đợi hôm nay**.

**OUT (phase sau):**
- AI tự chạy. A/B song song (**đã bác — không làm**). Hút Zalo tự động (⏳ chờ khảo sát 3 câu: có API đẩy ra ngoài? có nhóm? hợp đồng dữ liệu? — xem `CSKH-HANDOFF.md`). Cho tới lúc đó, tín hiệu Zalo vào bằng **người chép nguyên văn**.

---

## 9. Data model (reuse — verify trước)

- `tin_hieu_ph` (**sổ tín hiệu thô**): `phu_huynh_id`, `loai`, `gia_tri` jsonb, `nguon` (`may`/`nguoi`/`ai`), `hoc_sinh_id` (nullable), `ngay_ghi`, `ngay_het_han` (cho tín hiệu điền tay). **Append-only. Không lưu điểm.**
- `van_de_ph` (risk case): `phu_huynh_id`, `loai_benh` (B0–B8), `muc` (`canh_bao`/`xu_ly_nhe`/`xu_ly_nang`), `tin_hieu` jsonb (snapshot lúc phát hiện), `phan_khuc`, `trang_thai`.
- `playbook_ph`: `dieu_kien_ap` (bệnh + mức + phân khúc), `chuoi_hanh_dong` (ref catalog), `trang_thai` (`dang_thu`/`hieu_luc`/`loai`), `period`, số liệu hiệu quả.
- `catalog_can_thiep_ph`: C1–C9.
- `case_ph` (**CASE LOG** — trung tâm): `van_de_id`, `playbook_id`, `de_xuat_ai` jsonb (**kèm `tin_hieu_can_cu` + `do_phu`**), `nguoi_duyet`, `delta` jsonb, `ly_do`, `plan`, `pre`, `post1` (**+ `nguyen_van` NOT NULL khi có chạm**), `post2`, `ket_qua`, `case_truoc_id`.
- `cham_ph`: mỗi lần chạm **đã xảy ra** — `phu_huynh_id`, `case_id`, `nguoi_cham`, `kenh`, `noi_dung`, `nguyen_van`, `ket_qua`, `at`.
- `benchmark_ph`: per `phan_khuc` × `period`.
- Bổ sung: `hoc_sinh.nguon_biet_den` + `hoc_sinh.nguoi_gioi_thieu_ph_id`.
- **Reuse (KHÔNG tạo lại):** `bao_cao_ph` · `canh_bao_yeu` · `bo_tro_yeu` · `hoa_don`/`thanh_toan` · `buoi_hoc_hs` · `hoc_sinh` · `phu_huynh` · Cổng PH (`fetchPhLogins`).

> **Về §1.6 (nhãn môn):** quan hệ với PH **KHÔNG phải dữ liệu học tập** ⇒ `van_de_ph` / `case_ph` / `cham_ph` **không mang nhãn `mon`**. Nhưng `tin_hieu_ph.gia_tri` **giữ nguyên `mon` của tín hiệu gốc** (band môn nào, cảnh báo môn nào). Quyết định kỹ thuật của CTO — nêu để CEO bác nếu thấy sai.
> Verify `information_schema` + `pg_tables.rowsecurity` trước migration. Grep repo trước khi đổi.

---

## 10. Các bước build

1. Đọc `CSKH-HANDOFF.md` + `HANDOFF.md` + `CLAUDE.md` + `BKDEMY_CANHBAO_BOTRO_SPEC.md`. Audit: `bao_cao_ph`, `canh_bao_yeu`, `bo_tro_yeu`, hoá đơn, điểm danh, Cổng PH.
2. **CASE LOG trước** (`case_ph`) + `van_de_ph` + `tin_hieu_ph` — xương sống.
3. Phát hiện: rule trên tín hiệu (ưu tiên **delta**, không mức) → `van_de_ph` với `muc` + `phan_khuc`. Ngưỡng chỉnh được. Quy tắc gộp nhiều con (§2).
4. `playbook_ph` + `catalog_can_thiep_ph` + seed 1 playbook/bệnh (Cách 1).
5. Chẩn đoán: AI đề xuất bệnh+playbook (**kèm tín hiệu căn cứ + độ phủ**) → UI người duyệt **bắt delta + lý do** (chặn approve trơn).
6. Điều trị: orchestration can thiệp; form ghi chạm **bắt buộc nguyên văn**; hiện lại nguyên văn lần trước ở lần chạm sau.
7. Tái khám: post-1 (ngay) / post-2 (30 ngày) → ghi vào case; gộp per-playbook; bắt "lên rồi rớt".
8. Benchmark/period: theo phân khúc + gate đủ-mẫu + giữ/thay + nguồn ứng viên. **Period 6 tháng.**
9. 3 màn hình + trường "biết BK qua ai" ở luồng tuyển sinh.
10. RLS chuẩn. `tsc` sạch. Test 1 ca end-to-end.

---

## 11. Definition of Done

- 1 ca end-to-end: tín hiệu → `van_de_ph` đúng **mức + bệnh** → AI đề xuất **kèm căn cứ + độ phủ** → **người duyệt CÓ ghi delta + lý do** → can thiệp → **ghi chạm có NGUYÊN VĂN** → post-1/post-2 → case log ghi trọn vòng.
- Phát hiện **deterministic** (không AI), output là **mức** (không cờ có/không), bắt bằng **delta** (không chỉ mức sàn).
- **Độ phủ < 50% ⇒ hệ KHÔNG xếp hạng, mà ra việc "đi khám" (B0).**
- Playbook là **data**; 1 period 1 chính sách; mỗi bệnh 1 playbook; **không A/B song song**.
- **Approve trơn bị chặn** — buộc ghi delta khi người sửa khác đề xuất AI.
- Mọi đề xuất AI **hiển thị tín hiệu căn cứ + độ phủ**.
- **Tin xấu không có đường gửi tự động** — hệ chặn ở tầng code, không dựa lời hứa.
- `cham_ph` chỉ có dòng khi **đã chạm thật** (§1.5) — không insert trước điền sau.
- Tín hiệu điền tay có `ngay_ghi`; quá hạn tự hạ trọng số.
- **Nguồn mỗi trường phân biệt được** (máy / người / AI).
- Benchmark theo phân khúc; chưa đủ mẫu = "đang thử" **miễn đánh giá**; dưới benchmark → thay **kèm nguồn ứng viên**.
- Case log ghi đủ để (a) đo hiệu quả ca, (b) đo quality playbook, (c) có delta + outcome + nguyên văn cho học sau.
- Verify schema, RLS chuẩn, `tsc` sạch.

---

## Goal / Kickoff

> Kick 1 câu: *"Đọc spec-cskh.md, làm theo Goal cuối file."*

**NHIỆM VỤ:** Build hệ Chăm sóc Phụ huynh & Referral theo spec này, tới khi đạt HẾT "Definition of Done".

**ĐỌC TRƯỚC (bắt buộc):** `CSKH-HANDOFF.md` · `HANDOFF.md` · `CLAUDE.md` · `BKDEMY_CANHBAO_BOTRO_SPEC.md` · toàn bộ spec này.

**KỶ LUẬT:**
- Verify schema TRƯỚC mọi migration. Grep repo trước khi đổi.
- Reuse > đẻ mới: `bao_cao_ph`/`canh_bao_yeu`/`bo_tro_yeu`/hoá đơn/điểm danh/Cổng PH.
- **CASE LOG dựng trước.** Phát hiện deterministic (không AI); AI chỉ ở "Chẩn đoán".
- **KHÔNG ép PH. KHÔNG A/B song song. KHÔNG quy kết nhân quả.** Mọi hành động chạm PH qua người duyệt.
- **KHÔNG lưu điểm — chỉ lưu tín hiệu thô.** **KHÔNG chỉ lưu nhãn — luôn kèm nguyên văn.**
- Việc = **suy ra** (§4 invariant). KHÔNG bảng `tasks`, KHÔNG row chờ.
- RLS: data DISABLE / staffs ENABLE. Staff-only.

**VÒNG LÀM:** implement → `tsc` sạch → tự review có trôi spec không → commit rõ → append `DEVLOG.md` → bước tiếp.

**DỪNG & HỎI khi:** fork spec không cover · cần xoá/drop/migration phá dữ liệu · đụng dữ liệu PH thật gây rủi ro. Chưa chắc thì hỏi, đừng đoán.
