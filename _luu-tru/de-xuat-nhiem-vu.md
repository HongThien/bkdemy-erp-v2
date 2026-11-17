# Đề xuất NHIỆM VỤ + VÒNG QUAY + NGÂN SÁCH XU TRÊN APP (detail C7 · C10) — CTO, 28/09/2026 · vòng 2

> Đi kèm `spec-thanh-tuu-nhiem-vu.md`. Logic A6 đã chốt:
> - Nhiệm vụ ngày sống 3 ngày · nhiệm vụ tuần dồn tới hết tháng · đủ N nhiệm vụ/tuần thì mở rương · tháng là chặng nhiều cấp.
> - Thưởng EXP → xu, **KHÔNG cộng Điểm Rank** (L2) · mỗi môn riêng.
>
> **Vòng 2 — Thùy 28/09:** *"Budget trên app chỉ nên tối đa **30 xu/tháng cho mọi hoạt động**. M tự phân bổ. Còn phải căn chỉnh với **bàn quay may mắn**."*

---

## 0. Số thật (DB 28/09, chỉ đọc)

| Chỉ số | Giá trị |
|---|---|
| Xu từ **học trên lớp** (EXP ET + BTVN → xu) | TB **25 xu / em / tháng** (Toán) · KHTN ~11 |
| Giá quà | 5–60 xu · một nửa số món ≤ **22** |
| **Vòng quay may mắn** (T9) | 53 em quay · TB 3 lượt/em · nhiều nhất 9 lượt |
| Vòng quay — cách tính hiện tại | Điều kiện: 1 lượt tự luyện ≥ 70%, tối đa 1 lượt/ngày. Thưởng 50 / 100 / 150 / 200 EXP (40 / 40 / 15 / 5%) ⇒ **TB ~92 EXP/lượt** |
| Vòng quay — lỗ hổng | EXP vòng quay nằm ở bảng riêng `may_man_hs_luot`, **KHÔNG đổi ra xu**. HS thấy trong ví nhưng không bao giờ thành xu (mig `202609112330` ghi rõ "chờ Thùy chốt gộp") |
| Nếu gộp vòng quay nguyên như hiện tại | Quay đủ 30 ngày ≈ 2.800 EXP ≈ **28 xu** ⇒ một mình vòng quay gần hết trần 30 |
| HS học ≥ 2 môn | 52 / 332 em (16%) |

---

## 1. Logic cần Thùy gật

| # | Điểm logic | Đề xuất |
|---|---|---|
| **B-L1** | "30 xu" tính thế nào | ✅ **Thùy chốt: 30 xu / HS / tháng MỖI MÔN** (mọi hoạt động trên app của môn đó). **Tạm thời chỉ triển khai TOÁN**; môn khác bật sau, cùng khuôn (cờ bật/tắt theo môn trong bảng cấu hình) |
| **B-L2** | Cách chặn trần | Cuối tháng (hàm chốt xu ở DB), **theo từng môn**: **xu app môn X = min(30, ceil(EXP app môn X / 100))**. EXP vẫn ghi đủ. Chỉ phần **đổi ra xu** bị chặn. Xu từ học trên lớp **không tính** vào trần này |
| **B-L3** | Vòng quay may mắn | **Gộp vào ngân sách app và đổi ra xu thật** (hiện chưa đổi — lỗ hổng trên). Hạ mức thưởng cho vừa phần 10 xu (§2.1) |
| **B-L4** | Điều kiện quay | **Vòng quay = phần thưởng hằng ngày của nhiệm vụ:** hôm nào xong **≥ 2 nhiệm vụ ngày của môn đó** thì được **1 lượt quay của môn đó**. Tối đa 1 lượt/ngày/môn. Vòng quay **theo môn** vì ngân sách theo môn (B-L1); giai đoạn đầu chỉ có vòng Toán. Thay cho điều kiện cũ "tự luyện ≥ 70%" (nay đã nằm trong nhiệm vụ N1 / N2). *Kỹ thuật:* `may_man_hs_luot` đã có cột `mon`; khi mở môn thứ 2 thì đổi unique `(hs, ngay)` → `(hs, ngay, mon)` bằng migration mới |
| **B-L5** | Nhiệm vụ lẻ | Chỉ cho **Điểm Chặng**. Thưởng nằm ở **cấp chặng + rương tuần** (kiểu battle pass) ⇒ tính trước được chính xác |
| **B-L6** | Bỏ thẻ ×2 Điểm Rank | Vì nhiệm vụ không được cộng rank (L2) |
| **B-L7** | Bảng đua tháng · đua lớp | **Không trả xu app.** Vinh danh TV + gộp **giải thưởng tháng đang có**. Đua lớp thưởng tập thể (vd thêm lượt game buổi) ⇒ nằm ngoài trần 30 |

**Vòng lặp mỗi ngày của HS:**

```
Làm nhiệm vụ ngày (Thử thách · Luyện 20 · Sửa sai)
   ├─ xong ≥ 2 cái  → 🎡 1 lượt quay may mắn (thưởng ngay, hồi hộp)
   └─ mỗi cái       → + Điểm Chặng → lên cấp chặng tháng (quà chắc chắn)
Cuối tuần: đủ 12 nhiệm vụ → rương tuần · Cuối tháng: cấp 30 → khung tháng
```

---

## 2. Phân bổ 30 xu

| Nguồn trên app | Trần xu / tháng | ≈ EXP | Vai trò |
|---|---|---|---|
| 🎡 **Vòng quay may mắn** | **10** | ~1.000 | Thưởng **ngẫu nhiên** mỗi ngày: hồi hộp, kéo HS vào app hằng ngày |
| 📜 **Nhiệm vụ** (chặng 30 cấp + rương tuần) | **15** | 1.500 | Thưởng **chắc chắn**, tích dần. Phần lớn nhất vì đây là việc học chính |
| 🏅 **Thành tựu** (bậc Bạc / Vàng / KC) | **5** | ~500 / tháng | Thưởng **mốc**, thưa. Detail C6 sẽ thiết kế gói gọn trong 5 xu này |
| **Tổng** | **30** | 3.000 | Chặn cứng ở hàm chốt tháng (B-L2) |

### 2.1 Vòng quay — bảng thưởng mới (1 lượt/ngày)

| Giải | EXP | Tỉ lệ |
|---|---|---|
| Thường | 20 | 40% |
| Khá | 30 | 35% |
| Tốt | 50 | 18% |
| Lớn | 100 | 6% |
| **Jackpot** | **200** | **1%** |

- Trung bình **~36 EXP/lượt** ⇒ quay đủ 28 ngày ≈ **1.000 EXP = 10 xu**.
- Giữ **jackpot 200** để vẫn có khoảnh khắc "trúng lớn". Tỉ lệ **công khai** trên màn như hiện nay (`may_man_hs_cau_hinh` đã cho admin sửa).
- ⚠ Số trên vòng nhỏ hơn hiện tại (50–200 → 20–200). **Nhưng bây giờ là EXP thật, đổi ra xu thật**; trước đây là số "ảo". Nên nói rõ với HS khi đổi.

### 2.2 Nhiệm vụ (mỗi môn một bảng, cùng khuôn)

| Tầng | Nhiệm vụ | Điểm Chặng |
|---|---|---|
| **Ngày** (sống 3 ngày) | N1 Pass 1 lượt Thử thách · N2 Làm đúng 20 câu trên app · N3 Sửa sai: làm đúng lại 2 câu thuộc dạng từng sai (sai ở ET / BTVN / MT / app đều tính) | +10 / cái |
| **Tuần** (dồn tới hết tháng) | T1 Nộp đúng hạn mọi BTVN của tuần · T2 ≥ 1 bài ET đúng ≥ 80% · T3 Pass Thử thách ở 4 ngày khác nhau · T4 Đưa 1 dạng từ yếu → đạt | +40 / cái |
| **Rương tuần** | Xong 12 nhiệm vụ trong tuần | +60 · **+75 EXP** (chỉ EXP — Thùy 28/09) |
| **Tháng** | M1 MT bứt phá (hạng tăng so với tháng trước **hoặc** top 30% khối) · M2 Pass Thử thách ở 15 ngày | +150 / cái |

**Chặng tháng:** 30 cấp × 50 Điểm Chặng, reset đầu tháng.

**Thùy 28/09: quà hiện vật / quyền lợi ở mốc cấp làm rắc rối ⇒ quy HẾT ra EXP thưởng thêm.**

| Cấp | Quà |
|---|---|
| Mỗi cấp | +25 EXP |
| Mốc 10 | **+100 EXP** thưởng thêm |
| Mốc 20 | **+150 EXP** thưởng thêm |
| Mốc 30 | **+200 EXP** thưởng thêm |

**Tối đa 1 môn:** 30 × 25 = 750 + mốc 450 + 4 rương × 75 = 300 ⇒ **1.500 EXP = 15 xu** (đúng phần nhiệm vụ trong trần 30).

### 2.3 Ai được bao nhiêu (ước lượng 1 tháng, HS 1 môn)

| Kiểu HS | Vòng quay | Nhiệm vụ | Thành tựu | **Xu từ app** | + xu từ lớp | **Tổng xu / tháng** |
|---|---|---|---|---|---|---|
| **Cày đều** (app gần như mỗi ngày) | ~28 lượt → 10 | cấp 30 + 4 rương → 15 | ~3–5 | **28–30** (chạm trần) | ~25–35 | **~55–65** ≈ 2–3 quà |
| **Chăm vừa** (~3 ngày/tuần) | ~12 lượt → 4 | cấp ~18 (450 + mốc 10: 100) + 1–2 rương → ~7 | ~2 | **~13** | ~25 | **~38** |
| **Không dùng app** | 0 | cấp ~8 → 2 | ~1 | **~3** | ~20–25 | **~25** |

**Mỗi môn một trần 30 riêng** (B-L1). Giai đoạn đầu chỉ Toán.

---

## 3. Việc kỹ thuật kéo theo (để lập plan — CLAUDE.md §2.0 / §2.1)

- **Nguồn EXP mới** `exp_nhiem_vu` · `exp_thanh_tuu` · `exp_may_man` (vòng quay hiện ở bảng riêng) cùng vào hàm chốt xu, **trần 30 tính trong hàm**. Theo bài học HANDOFF phải:
  - sửa đủ 4 chỗ đọc viết cứng: `fn_gami_exp_xu_thang`, `fn_gami_exp_chi_tiet_thang`, `fn_hs_vi_xu_cua_toi`, `EXP_NOTE_SOURCES`;
  - loại các nguồn này khỏi lệnh delete của `fn_recompute_exp_thang`.
- Vòng quay:
  - Đổi `fn_may_man_hs_du_dieu_kien` sang điều kiện "≥ 2 nhiệm vụ ngày hôm nay".
  - Đổi bảng tỉ lệ trong `may_man_hs_cau_hinh`: thêm mức 20 / 30 / 50 và jackpot 1%.
- Ví xu HS hiện rõ **"Xu từ app tháng này: X / 30"** — HS biết đã chạm trần thì không thấy "bị nuốt".

---

## 4. Cần Thùy chốt

| # | Câu | Đề xuất |
|---|---|---|
| B-L1 · B-L2 | ✅ 30 xu / HS / tháng **mỗi môn**, chặn ở hàm chốt · **tạm chỉ Toán** | Đã chốt 28/09 |
| B-L3 | ✅ Vòng quay đổi ra xu thật, nằm trong trần 30 | Đã chốt 28/09 |
| B-L4 | ✅ Lượt quay = xong ≥ 2 nhiệm vụ ngày của môn (thay "tự luyện ≥ 70%") | Đã chốt 28/09 |
| B-L5 · B-L6 · B-L7 | ✅ Nhiệm vụ lẻ chỉ cho Điểm Chặng · bỏ thẻ ×2 rank · đua tháng / đua lớp không trả xu app | Đã chốt 28/09 |
| Chia 10 / 15 / 5 | ✅ Vòng quay / Nhiệm vụ / Thành tựu | Đã chốt 28/09 |
| Bảng thưởng vòng quay | ✅ 20 / 30 / 50 / 100 / 200 EXP (40 / 35 / 18 / 6 / 1%) | Đã chốt 28/09 |
| Danh sách nhiệm vụ §2.2 | N1–N3 · T1–T4 · M1–M2 · chặng 30 cấp | Thùy hỏi lại danh sách 28/09 — chờ gật |
| Quà mốc chặng + rương | ✅ Chỉ EXP: cấp 25 · mốc 10/20/30 = +100/150/200 · rương 75 | Đã chốt 28/09 |
