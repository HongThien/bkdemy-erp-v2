# NUÔI HEO — Spec v0.1 (app giảm béo gamification)

> Trạng thái: **BẢN NHÁP chờ Thùy duyệt** · viết 01/11/2026 từ phiên sparring Thùy ↔ Claude.
> Tạm đặt trong repo ERP (`docs/nuoi-heo/`), có repo riêng `nuoi-heo` thì chuyển sang. **Không dính code ERP.**
> Mọi con số ở §14 là **mặc định đề xuất**, chỉnh được — không phải luật cứng.

---

## 0. Mục đích & người dùng

- **Vấn đề:** người thích ăn, thích thể thao (pickleball) nhưng **ghét cardio**, **thích game/progress**, **kỷ luật chưa đủ cao, bận nên hay quên ghi**.
- **Đích:** app tạo động lực hằng ngày để giữ kỷ luật ăn + vận động, chơi cùng nhau (Thùy + Trang trước).
- **Người dùng theo giai đoạn:** ① Thùy + Trang → ② nhân sự trung tâm → ③ người quen → ④ (có thể) học sinh — xem §15.
- **Cân nặng / mục tiêu là số MỖI NGƯỜI tự nhập** — app không giả định người cụ thể.

## 1. Nguyên tắc thiết kế (đứng trên vai ai)

| Nguyên tắc | Nguồn | Áp vào app |
|---|---|---|
| Giảm cân thắng ở **ăn**, không ở tập | Cân bằng năng lượng | Ghi ăn phải dễ nhất; tập là phụ, không ép cardio |
| **NEAT** (vận động ngoài tập) chiếm phần lớn tiêu hao | Levine, NEAT | Bước chân là mục tiêu vận động chính, ngang với 1 buổi tập |
| Calo tập bị thổi phồng | Bài học MyFitnessPal | Chỉ cộng **50%** calo vận động vào ngân sách ăn |
| Tiêu hao thật tự học từ dữ liệu | MacroFactor (adaptive TDEE) | Hiệu chỉnh bằng xu hướng cân ⇒ ước lượng ăn **lệch đều** vẫn ra ngân sách đúng |
| Gamify **hành vi**, không gamify **cân nặng** | Habit design | Lợn ăn theo nhiệm vụ, không theo số cân dao động ±1 kg/ngày |
| Phần thưởng bất ngờ > cố định | Hook Model (Nir Eyal) | Nhiệm vụ bất ngờ 1–2 lần/tuần |
| Sợ mất mạnh hơn muốn được | Loss aversion · Octalysis | Lợn ốm, quỹ phạt tiền thật |
| Cam kết trả giá thật | Commitment device (Beeminder/StickK) | Quỹ phạt tuần |
| Việc nhỏ đến mức không thể từ chối | Tiny Habits (BJ Fogg) | Ghi 1 bữa = 2–3 chạm; ngày chỉ cần ghi ≥2 bữa |

**Đã cân nhắc và BỎ:** chụp ảnh → AI ra calo. Lý do: nghiên cứu NIH (07/2026) đo 4 app (MyFitnessPal, Lose It!, Cal AI, Appediet) **đoán THẤP ~33% (≈250–345 kcal/bữa), hụt béo ~30 g** — vừa tốn tiền AI mỗi bữa vừa sai một chiều nguy hiểm cho người giảm cân. Thay bằng **chọn món + khẩu phần đời thường + số đo thật** (§5).

## 2. Phạm vi

**MVP (bản đầu dùng thử Thùy + Trang):** hồ sơ & ngân sách · ghi bữa theo món@quán · thêm món (số tay / AI ước từ mô tả) · số đo thật · ghi hoạt động (có bí mật) · nhiệm vụ ngày + chốt ngày · con lợn · nhóm + feed · quỹ phạt (danh sách âm) · dashboard ngày/tuần.

**Để sau:** mâm chung tự cân giữa nhiều người (MVP có bản 1 người tự nhập hệ số) · bước chân qua Phím tắt · nhắc push · hiệu chỉnh TDEE · đề xuất tập thông minh · thưởng từ quỹ · macro (đạm/tinh bột/béo) · trang phục/chuồng lợn.

## 3. Người dùng · nhóm · quyền riêng tư

- **Tài khoản:** đăng nhập Supabase Auth (Google hoặc email OTP — §15).
- **Hồ sơ:** giới, năm sinh, chiều cao, cân hiện tại, kiểu công việc (ngồi nhiều / đi lại nhiều), tốc độ giảm (§4). Sửa bất cứ lúc nào.
- **Nhóm:** 1 người vào được nhiều nhóm. Mỗi nhóm có **luật riêng** (mức phạt, thủ quỹ) và **quỹ riêng**.
  - Đề xuất: mỗi người chỉ có **1 "nhóm cược"** để tránh một tuần trượt bị phạt nhiều lần (§15).
- **Bạn cùng nhóm THẤY:** hoạt động công khai, con lợn, ngày đạt/trượt, chuỗi, calo ăn/vận động (đã loại phần bí mật).
- **Mặc định ẨN:** cân nặng người.
- **Hoạt động bí mật** (sex, hoặc bất kỳ hoạt động nào người dùng đánh dấu): vẫn tính vào sổ calo + nhiệm vụ của **chính mình**, **không bao giờ** xuất hiện ở feed, màn bạn bè, tổng công khai. **Chặn ở DB bằng RLS**, không dựa vào client ẩn.

## 4. Lõi calo

1. **BMR** theo Mifflin-St Jeor (giới, tuổi, cao, cân).
2. **Tiêu hao nền** = BMR × hệ số công việc (ngồi nhiều 1.2 · đi lại nhiều 1.375). Tập luyện **không** nằm trong hệ số này — tính riêng ở bước 4 để không đếm hai lần.
3. **Tốc độ giảm** người chọn: Nhẹ 0.25 kg/tuần (−275 kcal/ngày) · Vừa 0.5 (−550) · Mạnh 0.75 (−825).
4. **Ngân sách ăn ngày** = Tiêu hao nền − Thâm hụt + **50% × kcal vận động trong ngày**.
   **Sàn an toàn:** không thấp hơn BMR.
5. **kcal vận động** = Σ hoạt động ghi (MET × kg × giờ) + kcal từ bước chân (khi có — giai đoạn sau).
   Biết trước: đi bộ trong lúc đánh pick có thể bị đếm hai lần — chấp nhận, hệ số 50% + hiệu chỉnh ở bước 6 hấp thụ.
6. **Hiệu chỉnh (để sau):** khi có ≥14 ngày với ≥80% ngày có ghi ăn và ≥6 lần cân:
   `Tiêu hao thật ≈ TB kcal ăn − (độ dốc xu hướng cân, kg/ngày × 7700)`.
   Mỗi tuần pha 30% số mới vào số cũ; kẹp trong ±25% so với công thức. Tính ở Postgres, chạy tuần.
   → Ước lượng món lệch đều (vd hụt 30%) thì tiêu hao thật bị hạ tương ứng ⇒ ngân sách vẫn đúng.
7. **Ngày không ghi ăn ⇒ không đoán.** Không có dòng ăn = ngày đó không tính vào hiệu chỉnh.
8. **Cân nặng:** người tự cân, nhập; hiển thị **đường xu hướng 7 ngày**, không nhấn vào số từng ngày.

## 5. Ghi bữa ăn

### 5.1 Mô hình MÓN = món + quán
- **Một món gắn với một quán:** "Cơm · quán A" ≠ "Cơm · quán B". Quán có thể là *Tự nấu* / *Không rõ quán*.
- Ăn quán C thấy giống hệt quán A ⇒ chọn món của quán A, **không** cần thêm quán C. Chỉ thêm khi khác.
- **Món dùng chung trong nhóm:** 1 người thêm, cả nhóm chọn được (§15 xác nhận).
- **Chống trùng:** gõ tên ⇒ hiện món đã có trước ("Cơm · quán Bà Lan đã có — dùng luôn?").
- **~50 món chung** hệ soạn sẵn (phở, bánh mì, trà sữa…), không gắn quán, để người mới chọn ngay ngày đầu.
- Mỗi món có **1 đơn vị khẩu phần**: bát / đĩa / suất / ly / miếng / hộp / tô / cái.
- Món có **mã gốc bất biến**; đổi tên/quán không đổi mã. Xoá món = cột `xoa_at` (kho rác), không xoá cứng — lịch sử bữa vẫn trỏ được.

### 5.2 Pop-up "Thêm món mới"
- Bắt buộc: **Tên món**, **Đơn vị**. Tuỳ chọn: **Quán**.
- Phải có **một trong hai**:
  - **Số liệu (biết thì điền):** kcal / 1 khẩu phần, **hoặc** khối lượng (g) nếu cân được.
  - **Mô tả** (vd "ba chỉ rang cháy cạnh, ~10 miếng, khá nhiều mỡ, đĩa cỡ vừa") ⇒ bấm **Ước lượng** ⇒ AI trả:
    kcal/khẩu phần · gam ước · 1 dòng giải thích · độ tin (cao/vừa/thấp). Người xem, sửa được, rồi **Lưu**.
- Prompt ước lượng **bắt buộc cộng phần ẩn**: dầu mỡ theo kiểu chế biến (chiên/xào/rang), nước chấm, đường trong đồ uống — đúng chỗ các app đang hụt nhất.
- **AI chỉ chạy 1 lần lúc tạo món**, đọc chữ, không đọc ảnh ⇒ vài chục đồng/món.

### 5.3 Số đo thật
- Gắn với **món** (vốn đã là món@quán). Ai cân được thì nhập:
  - **Gam** (đề xuất): có ô **trừ bì** (cân cả đĩa − cân đĩa không). App quy ra kcal bằng mật độ kcal/g của món
    (lấy từ số tay/AI ước đã có). **Hoặc** nhập thẳng kcal (tự tính ngoài app).
- **Mỗi lần đo = 1 dòng mới, không ghi đè.** Giá trị đo = **trung vị** các lần đo; hiển thị "đã đo 3 lần · 780–820 kcal".
- **App gợi ý nên đo món nào:** xếp theo (số lần ăn × kcal) của các món chưa đo — vd "Cơm quán Bà Lan: ăn 14 lần, chưa đo. Đo 1 lần = chuẩn 30% calo cả tuần."

### 5.4 Ưu tiên khi lấy kcal của món
1. ✅ **Đo thật** (trung vị các lần đo, của bất kỳ ai trong nhóm)
2. ✅ **Nhập tay** (bản mới nhất)
3. ≈ **AI ước** (bản mới nhất)
4. ≈ **Hệ soạn** (món chung)

Mỗi bữa hiện nhãn ✅/≈; ngày có % calo từ món ✅ cao ⇒ **độ tin ngày** cao. Hàm duy nhất: `fn_mon_kcal(mon)`.

### 5.5 Ghi 1 bữa
- Chọn bữa: Sáng / Trưa / Tối / Ăn vặt (app gợi theo giờ VN).
- Chọn món (tìm, hoặc *Món của tôi* / *Giống hôm qua*) → chọn số khẩu phần **½ · 1 · 1.5 · 2 · 3** → xong.
- Bữa được ghi **chỉ khi bấm Lưu** — không có bữa nháp rỗng trong DB.

### 5.6 Mâm chung (ăn chung kiểu Việt)
- **Cơm đếm riêng** (mấy bát — món "Cơm · quán X" × số bát), **thức ăn chung chia theo phần**.
- **Dựng mâm:** chọn các món trên mâm (mỗi món × số đĩa) + số người ăn N. Lưu được thành **Mâm quen** của quán.
- **Phần của mình:** mức ăn so với mọi người: **Ít hơn ×0.7 · Như mọi người ×1 · Khỏe hơn chút ×1.3 · Ăn nhiều ×1.6**; có thể chỉnh riêng từng món.
- **MVP:** phần của mình = (1/N) × hệ số.
- **Để sau — tự cân 100%:** người trong nhóm bấm "Vào mâm này", chọn hệ số của mình; người không dùng app tính ×1.
  Phần của A = hệ số A / Σ hệ số. Vd A ×1.3, B ×0.8, 4 người ×1 ⇒ A = 1.3/6.1 ≈ 21%.
  Phần mâm **tính động tới lúc chốt ngày** (§7), chốt xong là đóng băng.

## 6. Hoạt động

- **Danh mục** dựng từ *Compendium of Physical Activities* (bảng MET chuẩn), ~100 hoạt động: thể thao (pickleball 4.5–6, cầu lông, bơi, gym…), đi bộ/đạp xe, việc nhà, leo cầu thang, sex (1.8–3 MET, **mặc định bí mật**)…
- Mỗi người đánh dấu **Thích / Ghét** từng hoạt động ⇒ đề xuất chỉ chọn từ cái thích.
- **Ghi:** chọn hoạt động → số phút → (cờ bí mật) → xong. kcal = MET × kg × giờ, chụp lại lúc ghi.
- **Bước chân (để sau):** Phím tắt iPhone chạy tự động 23:00, đọc số bước trong Health, gửi lên endpoint của app kèm **token cá nhân** (tạo trong app, dán vào Phím tắt). Upsert 1 dòng/ngày.
- **Đề xuất "hôm nay nên tập gì" (bản đơn giản):** kcal vận động còn thiếu của mục tiêu tuần ÷ số ngày còn lại ⇒ gợi 1–2 hoạt động *thích* đủ mức đó; tránh cùng nhóm cơ 2 ngày liền; ngày thường có pick ⇒ gợi pick.

## 7. Một ngày

- **Ngày theo giờ VN** (`Asia/Ho_Chi_Minh`).
- **3 nhiệm vụ cố định:**
  1. 🍽️ **Ghi ≥2 bữa**
  2. ⚖️ **Ăn trong ngân sách** (kcal ăn ≤ ngân sách)
  3. 🏃 **Vận động đạt**: (bước ≥ mục tiêu bước) **hoặc** (≥1 hoạt động ≥30 phút, MET ≥3). Hoạt động bí mật được tính.
     Mục tiêu bước = TB 7 ngày gần nhất + 10%, sàn 5.000.
- **Nhiệm vụ phụ:** ⚖️ cân (≥3 lần/tuần) · 📏 *Ngày cân đo* (đo 1 món) · 🎁 nhiệm vụ bất ngờ 1–2 lần/tuần.
- **Ghi bù:** được ghi cho hôm qua tới **12:00 trưa hôm sau**.
- **Chốt ngày:** người bấm "Chốt" sớm để nhận thưởng ngay; không bấm thì hệ **tự chốt lúc 12:00 hôm sau**. Chốt xong kết quả **đóng băng** (không tính lại dù sau này món được đo chuẩn hơn).
- **Kết quả ngày:**
  - **Đạt** = đủ 3 nhiệm vụ.
  - **Thường** = có ghi nhưng chưa đủ 3, và không vượt ngân sách quá 15%.
  - **Trượt** = **không ghi bữa nào**, hoặc **ăn vượt ngân sách >15%**.
- **Nhắc (để sau, web push):** 12:00 · 19:00 · 22:00 nếu còn thiếu bữa / chưa chốt.

## 8. Con lợn 🐷

Ý chính: **người gầy đi ⇒ lợn béo lên.** Mỗi người 1 con, tự đặt tên.

| Chỉ số | Luật |
|---|---|
| **Cân lợn** | Mỗi nhiệm vụ xong = **1 bao cám = +0.4 kg**. Mỗi ngày lợn **tự sụt −0.5 kg**. Ngày đạt (3 nv) ⇒ +0.7; 1 nv ⇒ −0.1; lười ⇒ −0.5. Sàn 5 kg (lợn không chết). |
| **Cấp** | Theo mốc cân: 10 · 20 · 35 · 55 · 80 · 110 · 150 · 200 kg… Lên cấp mở hình lợn mới (trang phục/chuồng để sau). Có tụt cấp không — §15. |
| **Hình dạng** | Theo cân hiện tại: gầy trông thảm, béo trông sướng. |
| **Ốm** | **Ngày trượt ⇒ ốm 3 ngày.** Lợn gầy dưới 70% mốc cấp hiện tại cũng tự ốm. Trong lúc ốm: cám chỉ được **50%**, tự sụt **×2**. |
| **Thuốc** | Mua bằng xu (25 xu). Uống ⇒ khỏi sau 1 ngày thay vì 3. |
| **Vắc xin** | 80 xu, chặn được **1 lần ốm** (= vé freeze nhưng phải tự cày). Giữ tối đa 1 liều. |
| **Xu** | Chuỗi 3 ngày đạt liên tiếp +10 · tuần đạt +30 · tuần xuất sắc +60 · nhiệm vụ bất ngờ +5–15 · đo 1 món +10. **Không mua bằng tiền thật**, tách hẳn khỏi quỹ. |

- Hai con lợn của người cùng nhóm hiện **cạnh nhau** ở màn nhóm.
- **Trạng thái lợn KHÔNG lưu đè** — suy từ sổ sự kiện (ăn cám, tự sụt, ốm, khỏi, thuốc, vắc xin, lên cấp).

## 9. Tuần & quỹ 💰

- **Tuần:** Thứ Hai 00:00 → Chủ nhật 24:00 giờ VN; chốt tuần sau khi ngày Chủ nhật chốt (trưa thứ Hai).
- **Đạt tuần** = ≥5/7 ngày đạt · **Xuất sắc** = 7/7 · **Trượt** = <5.
- **Tự nguyện:** người bật "tham gia cược" mới bị phạt. **Tuần đầu tiên = tuần làm quen, không phạt.**
- **Phạt:** trượt tuần ⇒ trừ **mức phạt của nhóm** (mặc định 50.000đ; nhóm tự thống nhất 50–100k).
- **App chỉ ghi sổ, không giữ tiền.** Màn quỹ hiện tạm **DANH SÁCH ÂM**: mỗi người một số dư, ai âm nhiều nhất lên đầu.
  Nộp tiền thật ⇒ **thủ quỹ** bấm "đã nhận" ⇒ số dư về lại.
- Sổ quỹ **append-only**: mỗi khoản (phạt / nộp / thưởng / chi trả) là 1 dòng, có người xác nhận + thời điểm; không sửa/xoá — sai thì thêm dòng điều chỉnh.
- **Thưởng (để sau):** cuối tuần quỹ chi tối đa **30% số dư** cho những người xuất sắc, chia đều, mỗi người ≤ 1× mức phạt. Quỹ nhiều thưởng nhiều, quỹ ít thưởng ít, **quỹ = 0 không thưởng**, quỹ không bao giờ âm.

## 10. Bạn bè & feed

- Feed nhóm: hoạt động công khai, bữa (tên món + kcal, không ảnh), lợn lên cấp/ốm, ngày đạt/chuỗi, tuần đạt/trượt.
- Thả tim / bình luận ngắn (để sau).
- **Không bao giờ có trong feed:** hoạt động bí mật, cân nặng người.

## 11. Dashboard

- **Ngày:** 3 vòng nhiệm vụ · ngân sách còn lại · bữa đã ghi (nhãn ✅/≈) · vận động · con lợn.
- **Tuần:** số ngày đạt/7 · kcal ăn vs ngân sách theo ngày · top hoạt động · trạng thái quỹ.
- **Dài hạn:** đường xu hướng cân · heatmap chuỗi ngày · cân lợn theo thời gian · độ tin dữ liệu (% calo từ món đã đo).
- Mọi con số dashboard = hàm `fn_*` ở Postgres; client chỉ vẽ.

## 12. Kiến trúc kỹ thuật

- **Web app (PWA)**: React + Vite + TypeScript + Tailwind; "Thêm vào màn hình chính" trên iPhone.
- **Supabase gói Free, ORG RIÊNG** (không đặt trong org BKdemy để không phát sinh ~$10/tháng/project nếu org đó là Pro) ⇒ **$0/tháng**.
  Free: 2 project, 500 MB DB, tự tạm dừng sau 7 ngày không dùng (dùng hằng ngày nên không bị).
- **Deploy Vercel.** AI qua serverless function (mẫu `api/kho-ai.mjs` của ERP): key ở env server, không tiền tố `VITE_`, xác thực bằng token đăng nhập.
- **AI:** Gemini 2.5 Flash (dùng key Gemini sẵn có), tắt chế độ suy nghĩ; trả JSON theo schema. Đổi sang Claude = đổi 1 dòng cấu hình.
- **Bước chân:** endpoint `/api/buoc-chan` nhận token cá nhân (lưu dạng băm), upsert 1 dòng/ngày.
- **Lịch chạy** (tự chốt ngày 12:00, chốt tuần, hiệu chỉnh tuần, nhắc): `pg_cron` của Supabase.
- **Luật mang từ ERP:** tính toán nghiệp vụ ở Postgres (`fn_*`), client chỉ CRUD + hiển thị · "thiếu data = không có dòng", không NULL cho "chưa đo" · lịch sử append-only · mã gốc bất biến · ngày theo giờ VN, cấm `toISOString()` cho ngày local · sau mutation vá tại chỗ, không reload cả list · migration đặt tên timestamp.

## 13. Mô hình dữ liệu (mức khái niệm — chốt cột lúc viết migration)

| Bảng | Một dòng = | Ghi chú |
|---|---|---|
| `ho_so` | 1 người | giới, năm sinh, cao, kiểu công việc, tốc độ giảm |
| `can_nang` | 1 lần cân | người, ngày, kg |
| `nhom` · `nhom_thanh_vien` | 1 nhóm · 1 người trong nhóm | mức phạt, thủ quỹ; cờ tham gia cược |
| `quan` | 1 quán | thuộc nhóm |
| `mon` | 1 món@quán | mã bất biến, đơn vị, `quan_id` NULL = món không gắn quán (không áp dụng), `xoa_at` |
| `mon_thong_so` | 1 lần khai số cho món | nguồn `he_soan`/`ai_uoc`/`nhap_tay`/`do_that`, kcal, gam (khi có), mô tả + giải thích AI, độ tin, người, lúc. **Append-only** |
| `bua` · `bua_mon` | 1 bữa · 1 món trong bữa | bữa, ngày; món × số khẩu phần |
| `mam` · `mam_mon` · `mam_phan` | 1 mâm · 1 món trên mâm · phần của 1 người | số người N, hệ số chung, hệ số riêng từng món |
| `hoat_dong` | 1 hoạt động trong danh mục | MET, nhóm cơ, mặc định bí mật |
| `so_thich_hd` | (người × hoạt động) | thích / ghét |
| `hoat_dong_ghi` | 1 lần tập | phút, kcal chụp lúc ghi, cờ bí mật (RLS: chỉ chủ đọc được khi bí mật) |
| `buoc_chan` | (người × ngày) | upsert từ Phím tắt |
| `ket_qua_ngay` | (người × ngày) đã chốt | kcal ăn/vận động/ngân sách, 3 nv, đạt/thường/trượt. **Chỉ sinh khi chốt** |
| `lon` · `lon_su_kien` | 1 con lợn · 1 sự kiện | trạng thái lợn suy từ sự kiện |
| `xu_so` | 1 khoản xu | cộng/trừ, lý do |
| `ket_qua_tuan` | (người × tuần) đã chốt | số ngày đạt, đạt/xuất sắc/trượt |
| `quy_so` | 1 khoản quỹ | phạt/nộp/thưởng/chi trả, số tiền, người xác nhận. **Append-only** |

**Hàm chính:** `fn_mon_kcal` · `fn_ngan_sach_ngay` · `fn_ngay_hom_nay` (3 vòng + còn lại) · `fn_chot_ngay` · `fn_chot_tuan` · `fn_lon_trang_thai` · `fn_quy_so_du` · `fn_feed_nhom` · `fn_goi_y_do_mon` · `fn_goi_y_tap`.

## 14. Tham số mặc định (chỉnh được)

| Tham số | Mặc định |
|---|---|
| Phần calo vận động cộng vào ngân sách | 50% |
| Nhiệm vụ ghi bữa | ≥2 bữa/ngày |
| Ngưỡng ngày trượt | vượt ngân sách >15% hoặc 0 bữa |
| Hạn ghi bù / tự chốt ngày | 12:00 hôm sau |
| Mục tiêu bước | TB 7 ngày +10%, sàn 5.000 |
| Hoạt động đủ cho nv vận động | ≥30 phút, MET ≥3 |
| Cám / nhiệm vụ · tự sụt / ngày | +0.4 kg · −0.5 kg |
| Ốm khi trượt | 3 ngày, cám 50%, sụt ×2 |
| Thuốc · vắc xin | 25 xu (khỏi sau 1 ngày) · 80 xu (chặn 1 lần ốm) |
| Đạt tuần · xuất sắc | ≥5/7 · 7/7 |
| Mức phạt tuần | 50.000đ (nhóm chỉnh 50–100k) |
| Thưởng (để sau) | ≤30% quỹ, ≤1× mức phạt/người |
| Hệ số mâm chung | ×0.7 · ×1 · ×1.3 · ×1.6 |

## 15. Câu hỏi còn mở

1. **Lợn có tụt cấp khi gầy không?** Đề xuất: **không tụt cấp** (giữ thành tựu), chỉ đổi hình dạng + dễ ốm.
2. **Món + số đo dùng chung trong nhóm?** Đề xuất: **có**.
3. **Mỗi người chỉ 1 nhóm cược?** Đề xuất: **có**.
4. **Thủ quỹ nhóm đầu tiên:** Thùy hay Trang?
5. **Đăng nhập:** Google hay email OTP?
6. **Bữa trưa thường là gì** (cơm quán mâm chung / cơm hộp / tự nấu)? — quyết định đưa mâm chung tự cân lên sớm hay không.
7. **Học sinh (giai đoạn ④):** đề xuất **không tham gia cược tiền** (trẻ vị thành niên + tiền thật) và **không có ngân sách thâm hụt** (ăn kiêng tuổi dậy thì nhạy cảm) — chỉ bản vận động/thói quen. Quyết khi mở rộng.

## 16. Lộ trình build

| Pha | Nội dung | Xong = |
|---|---|---|
| **P0** | Repo `nuoi-heo`, Supabase Free org riêng, Vercel, đăng nhập, hồ sơ, ngân sách ngày | Đăng nhập thấy ngân sách của mình |
| **P1** | Món@quán + pop-up thêm món (số tay / AI ước) + số đo thật · ghi bữa · hoạt động (bí mật) · 3 nhiệm vụ + chốt ngày · dashboard ngày | **Thùy + Trang dùng thử 1 tuần** |
| **P2** | Con lợn + xu + thuốc/vắc xin · nhóm + feed · mâm chung (bản 1 người) | Hai con lợn cạnh nhau |
| **P3** | Chốt tuần + quỹ (danh sách âm) · bước chân Phím tắt · nhắc push · gợi ý nên đo món nào | Tuần cược đầu tiên |
| **P4** | Hiệu chỉnh tiêu hao · đề xuất tập · thưởng từ quỹ · mâm chung tự cân · dashboard dài hạn | Mở cho nhân sự |
