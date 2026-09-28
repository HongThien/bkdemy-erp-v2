# Spec — Giao diện app HS: skin theo 3 nhóm khối + Home mới (chi tiết nhất cho lớp 9–12)

> Nguồn: phiên 28/09/2026 (Thùy + Claude). Trang đề xuất có mockup chạy được:
> https://claude.ai/artifact/LZF11536BxanSuLQcnbWiR · DEVLOG 28/09 (6)(7)(8).
> Trạng thái: **P1 lớp 9–12 ĐÃ BUILD 28/09** — mig `202609281346_hs_giao_dien_skin` · `src/screens/hocsinh/skin/registry.ts`
> (5 skin: Tối giản · Đấu trường · Y2K · Soft Hàn · Anime RPG) · `HomeHS912.tsx` (Home mới + nút **Hình nền** + tấm chọn + hướng
> dẫn lần đầu) · `src/lib/giaodien_hs.ts`. Còn: Lo-fi (chờ Đơn 3) · nhập ngày thi vào `lich_thi_lon` · lớp 3–5 / 6–8 (chờ Đơn 1–2) ·
> tầng 2 (màu nhấn, widget) · reskin các màn con (mới chỉ bỏ màu theo giới tính).

---

## 1. Phạm vi — 3 nhóm khối, mỗi nhóm 1 bộ skin riêng (Thùy chốt 28/09)

| Nhóm | Thiết bị | Skin gốc | HS chọn |
|---|---|---|---|
| Lớp 3–5 | iPad/laptop, máy dùng chung | Thị trấn (Play Together) | 3 làng + 3 linh vật |
| Lớp 6–8 | iPad/laptop hoặc máy bố mẹ, không có máy riêng | Khối vuông (Minecraft/Roblox) | 3 vùng đất (1 vùng tối) + 3 bạn đồng hành |
| **Lớp 9–12 (phần lớn spec này)** | **Có điện thoại riêng** | Tối giản | 6 skin × sáng/tối |

- Nhóm có máy riêng: đăng nhập giữ lâu, dùng buổi tối ⇒ nền tối, nhận nhắc việc, chia sẻ MXH. Nhóm máy chung: phiên ngắn,
  **skin đi theo TÀI KHOẢN chứ không theo máy**, không nhắc việc.
- Ranh giới nhóm = khối lấy từ lớp đang học. ⚠ Code hiện chia khác: `laCap1HS` (cấp 1) · `laCap2HS` (khối 6–9 dùng HomeHS + KHU_CAP2)
  · khối 10–12 dùng KHU cũ. **Khối 9 phải chuyển sang nhóm 9–12** khi build.
- Registry skin gắn nhãn nhóm; mỗi nhóm thấy danh sách skin riêng, cùng 1 cơ chế, cùng bảng `hs_giao_dien`.

## 2. Quyết định CEO (28/09)

| # | Câu | Chốt |
|---|---|---|
| 1 | Nhóm | 3 nhóm: lớp 3–5 · 6–8 · 9–12 (9–12 có điện thoại riêng), mỗi nhóm bộ skin riêng |
| 2 | Cho HS bầu trước? | **Không.** Làm trước rồi đo xem HS chọn gì ⇒ lựa chọn skin phải ghi vết để đếm (§5) |
| 3 | Ngày thi cho widget đếm ngược | **Trung tâm nhập sẵn**, HS không nhập |
| 4 | Điểm công khai hay riêng? | **Điểm của ai người đó thấy.** Không có nút tuỳ chọn. (Rank/Elo trên bảng xếp hạng vẫn theo `spec-thanh-tuu-nhiem-vu.md` v2 — công khai vì là game) |
| 5 | Ai design | Claude design bằng code; phần cần vẽ hình thì Claude viết prompt, Thùy đưa ChatGPT (§6) |
| 6 | Chia sẻ thẻ thành tích lên MXH cần PH đồng ý? | Không cần |

## 3. Chẩn đoán (vì sao HS chê Home v4)

Home v4 coi HS như trẻ con: khẩu hiệu động viên viết tay ở mọi ô · pastel/trái tim/chibi · màu + nhân vật gán theo `gioi_tinh` ·
hero 1/3 màn dành cho hình trang trí · không nền tối · chữ Pacifico 10–11px. (NN/g Teen UX: teen ghét giọng kẻ cả và thiết kế con nít.)

## 4. Home mới (1 bố cục cho mọi skin)

Từ trên xuống: **tên + lớp + rank** → **Việc tiếp theo** (ca/bài gần nhất: gì · mấy giờ · phòng · hạn) → **2 widget** (mặc định: đếm
ngược kỳ thi · rank mùa) → **4 ô việc** (Bài trên lớp · BTVN · Tự luyện · Thi thử; badge = việc còn làm được) → **thanh điều hướng**.

- Bỏ: câu chào viết tay, nhân vật, khẩu hiệu, doodle, decor sách/cốc, `THEME = {nam, nu}`.
- Chữ chính ≥ 15px, không font viết tay ở chỗ có thông tin.
- "Việc tiếp theo", badge, đếm ngược = **hàm Postgres** `fn_hs_home_*` (§2.0 CLAUDE.md); client chỉ vẽ.

## 5. Skin

6 skin × (sáng | tối). Mặc định = **Tối giản**, chế độ theo cài đặt điện thoại.

| Skin | Tham chiếu | Font | Cần hình? |
|---|---|---|---|
| Tối giản | iOS, Notion | Lexend | Không |
| Đấu trường | Valorant, Liên Quân | Chakra Petch | Không |
| Y2K | Poster Gen Z | Unbounded + Be Vietnam Pro | Không |
| Soft Hàn | Locket (= Home v4 bỏ sến) | Be Vietnam Pro | Không (nền gradient CSS) |
| Lo-fi đêm | Lofi Girl, study with me | Nunito | **Có** — tranh nền (§6.1) |
| Anime RPG | Genshin, Star Rail | Philosopher | **Có** — tranh nền + hoa văn + 4 icon (§6.2) |

Token màu của từng skin: xem CSS trong trang đề xuất (class `.t-clean` … `.t-soft`) — đó là bản gốc để chuyển sang registry.

**Kỹ thuật:**
- Registry skin (1 file): mỗi skin = bộ biến CSS sáng + tối, font, danh sách hình, nhãn nhóm. Component chỉ đọc biến.
  **Cấm `if (skin === …)` trong component** (cùng luật đối xứng môn §1.6).
- Kiểm tương phản chữ mọi skin × 2 chế độ trong `design-check`.
- **Dữ liệu:** bảng `hs_giao_dien` (1 dòng / HS, chỉ có dòng khi HS đã chọn — chưa có = mặc định, §1.5): `skin`, `che_do`
  (`sang|toi|he_thong`), `mau_nhan`, `widgets text[]`, `hinh_nen`. Skin là dữ liệu **không-học-tập** ⇒ không nhãn môn.
  **Trigger ghi vết** mọi lần đổi (actor + ts + cũ/mới) ⇒ đây chính là "phiếu bầu" thay cho vòng hỏi HS (quyết định #2):
  đếm skin đang dùng, skin bị bỏ sau 1 tuần, theo khối.
- Bảng `ky_thi` (trung tâm nhập): tên, ngày, khối áp dụng. Widget đếm ngược đọc qua hàm, không tính ở client.

## 6. Tự chỉnh (3 tầng)

1. **Chọn skin + sáng/tối** — miễn phí, ai cũng có. *(P1)*
2. **Trong skin:** màu nhấn (5–6 màu có sẵn) · hình nền (bộ có sẵn của skin; ảnh riêng để P3) · bật/tắt + sắp widget trong bộ có sẵn
   (đếm ngược · rank mùa · giờ học tuần · dạng yếu) · khung avatar + danh hiệu (chỉ qua rank/thành tựu, không mua). *(P2)*
3. Tự thiết kế giao diện tự do — **không làm.**

Tính năng đi kèm: thẻ thành tích dọc 9:16 để đăng story (có logo BK) · tổng kết tháng kiểu Spotify Wrapped · hẹn giờ tập trung. *(P2)*

## 7. Lộ trình

- **P1:** Home mới + registry skin + `hs_giao_dien` (+ trigger log) + `ky_thi` + màn chọn skin · ra mắt 4 skin chỉ-code
  (Tối giản, Đấu trường, Y2K, Soft Hàn). Đo 2 tuần: tỉ lệ đổi skin, skin nào giữ, số lần mở app/tuần trước–sau.
- **P2:** Lo-fi + Anime RPG khi có hình · tầng 2 · thẻ story · tổng kết tháng · hẹn giờ.
- **P3:** hình nền ảnh riêng · skin theo mùa · bỏ skin không ai dùng.

## 8. Đơn đặt hàng ChatGPT

Toàn bộ đơn (4 đơn: lớp 3–5 Thị trấn · lớp 6–8 Khối vuông · lớp 9–12 Lo-fi · lớp 9–12 Anime RPG) nằm ở
`design/DON-HANG-SKIN-HS.md` — 1 nguồn duy nhất, không chép lại ở đây.
