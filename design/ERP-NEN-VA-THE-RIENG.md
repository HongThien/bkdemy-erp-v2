# Nền + dáng thẻ RIÊNG cho từng nhân sự (Trang chính ERP)

> Soạn 17/10/2026 theo yêu cầu Thùy: *"lần sau muốn làm background nào hay card kiểu nào chỉ cần đọc file MD và mô tả phong cách mình muốn"*.
> Claude đọc file này rồi tự làm: **ảnh nền + bộ màu/dáng thẻ** cho đúng 1 mã nhân sự, không đụng người khác.

## 0. Phạm vi + nguyên tắc

- Áp cho **thanh trên cùng + Trang chính + trang nhóm** (các "màn ngoài"). Màn làm việc bên trong (bảng, form) **giữ nền sáng** — chỗ đọc số cả ngày, không phủ tranh.
- Khoá người = **`ma_ns`** (vd `NS004`), KHÔNG dùng email/tên (mã không đổi).
- Hai phần độc lập, có thể làm riêng:
  1. **Nền riêng** → `NEN_ERP` (mục `rieng_cho`) — người đó thấy ảnh trong "🎨 Giao diện → Hình nền", **tự bấm chọn** (không ép).
  2. **Dáng thẻ riêng** → `DANG_RIENG` — ghi đè các biến `--sk-*`, **tự áp ngay** cho người đó, mọi màn tự theo.
- Cả hai nằm ở **một file duy nhất**: `src/lib/erpSkin.ts`. Không rẽ nhánh `if (maNs === …)` trong màn.
- Giao diện vẫn do người dùng chọn style (Mặc định / RPG / Khối vuông / Lo-fi / Đáng yêu); `DANG_RIENG` **đè lên** style đang chọn.

## 1. Làm NỀN riêng (5 bước)

1. Thả ảnh vào `design/bk-ui-src/erp-ca-nhan/` đặt tên **`NS###_ten.png`** (cũng nhận `.jpg` / `.webp`). Khổ **ngang 16:9** (≈1672×941 trở lên) — nền `cover` nên khổ khác sẽ bị xén.
2. Chạy `node scripts/erp-nen-ca-nhan.mjs` → sinh `public/bk-ui/erp/nen/ca-nhan/ns###.jpg` (≤1920 rộng, JPEG 82, ~150–300 KB).
   *(Cần `node_modules` có `@napi-rs/canvas`; nếu checkout này thiếu, chạy ở worktree có `node_modules` với `ERP_CA_NHAN_SRC=<đường dẫn thư mục ảnh>` rồi copy file `.jpg` sang.)*
3. Thêm 1 dòng vào `NEN_ERP`:
   `{ id: 'erp_cn_ns004', ten: 'Tên hiển thị', url: '/bk-ui/erp/nen/ca-nhan/ns004.jpg', rieng_cho: ['NS004'] }`
4. Khi người dùng chọn ảnh này, **nhân vật + hoạ tiết của style tự ẩn** (ảnh của họ là chính).
5. Ảnh gốc PNG/WEBP **giữ lại trong `design/`** (`design/README.md`: file gốc để đây, đừng xoá).

**Yêu cầu ảnh nền cho dễ dùng:** vùng giữa/phải **ít chi tiết, sáng hoặc tối đều** (thẻ + chữ đè lên); nhân vật/điểm nhấn dồn ra mép hoặc góc trái. Ảnh toàn nền rối ⇒ phải dùng thẻ **mờ đục** (xem §3 "Đọc được").

## 2. Làm DÁNG THẺ riêng

Thêm 1 khoá trong `DANG_RIENG` (trường nào bỏ trống = giữ của style):

| Trường | Biến CSS | Nghĩa | Gợi ý |
|---|---|---|---|
| `surface` | `--sk-surface` | nền thẻ | `rgba(...)` để có độ trong |
| `surface2` | `--sk-surface2` | nền ô con / chip | nhạt hơn `surface` 1 bậc |
| `ink` | `--sk-ink` | chữ chính | tương phản ≥ 4.5:1 với `surface` |
| `muted` | `--sk-muted` | chữ phụ | ≥ 3:1 |
| `line` | `--sk-line` | đường kẻ mảnh | `rgba` nhạt |
| `acc` / `accInk` | `--sk-acc` / `--sk-acc-ink` | màu nhấn (nút chính, thanh tiến độ) + chữ trên nó | khác tông nền ảnh |
| `badge` / `badgeInk` | `--sk-badge*` | chấm số đỏ | thường = `acc` |
| `cardBorder` | `--sk-card-border` | viền thẻ (cú pháp `border`) | `1px solid rgba(...)` |
| `cardShadow` | `--sk-card-shadow` | bóng thẻ | có thể kèm `inset` làm viền sáng |
| `radius` | `--sk-radius` | bo góc | `12px` vuông vức … `24px` tròn mềm |
| `blur` | `--sk-blur` | làm mờ phía sau thẻ | `blur(14px) saturate(1.25)` |
| `fontHead` | `--sk-font-head` | font tiêu đề | CHỈ dùng font ĐÃ nạp (kiểm `hs.html` / index.html), không thì hỏng chữ |

### Công thức theo từ khoá phong cách (Thùy mô tả → Claude đổi thành giá trị)

| Thùy nói | Làm thế nào |
|---|---|
| **kính mờ / trong suốt / glass** | `surface` trắng/đen `rgba` 0.80–0.88, `blur(12–16px)`, viền 1px trắng mờ, bóng mềm màu theo ảnh |
| **vẽ tay / hoạt hình / dễ thương** | viền `2–2.5px solid` nâu/đen đậm, `radius` 20–24px, bóng CỨNG lệch xuống `0 4px 0 rgba(...)`, không blur |
| **tối giản / phẳng** | không viền (hoặc 1px `line`), không bóng, `radius` 10–14px, `surface` đặc |
| **sci-fi / HUD** | viền 1px màu nhấn sáng, `radius` 4–8px, bóng phát sáng `0 0 12px <acc>66`, nền tối đặc |
| **giấy / sổ tay** | `surface` kem `#fffaf0`, viền nâu nhạt, bóng nhẹ, font có chân nếu có sẵn |
| **ấm / sáng** vs **lạnh / tối** | chọn `ink` + `muted` + `surface` cùng gam ấm/lạnh; `acc` là màu **đối** gam với ảnh nền (nền xanh ⇒ nhấn cam; nền ấm ⇒ nhấn xanh rêu) |

### ⭐ ĐỌC ĐƯỢC trước, đẹp sau (Thùy 17/10: "dễ nhìn chút cho đỡ cùng tone với background")

- Thẻ **không được cùng tông với ảnh nền** — nếu nền xanh thì thẻ KHÔNG xanh. Dùng **trắng/kem đục 0.82–0.9** (kính mờ sáng) hoặc **tối đục** cho ảnh sáng; chữ lấy gam đậm của ảnh (navy cho nền xanh).
- `acc` chọn màu **tương phản** với ảnh (nút chính phải nổi ra khỏi nền), vẫn rút từ **màu có thật trong ảnh** (vd cổng torii đỏ cam) để hợp.
- Ảnh nền rối/nhiều chi tiết ⇒ độ đục thẻ ≥ 0.86 + blur ≥ 12px.
- Kiểm tương phản chữ/nền thẻ ≥ 4.5:1 (chữ thường), ≥ 3:1 (chữ ≥ 18px / đậm). Soi bằng mắt ở cả 3 cỡ: máy tính, iPad, điện thoại.

## 3. Quy trình Claude làm khi Thùy giao việc

1. Thùy gửi: **mã `NS###`** + ảnh (hoặc đã thả vào `design/bk-ui-src/erp-ca-nhan/`) + **mô tả phong cách thẻ** (từ khoá như bảng trên, hoặc "giống phim X").
2. Claude: nén ảnh (§1) → khai `NEN_ERP` → **tự rút palette từ ảnh** (màu chủ đạo, màu nhấn, độ sáng vùng giữa) → chọn giá trị `DANG_RIENG` theo công thức §2 → `tsc` → soi mockup tương phản.
3. Trình Thùy duyệt (ảnh chụp mockup nếu chưa đăng nhập được tài khoản đó) → **commit + push** (Thùy gật mới push).
4. Người dùng F5, mở "🎨 Giao diện → Hình nền", chọn ảnh của mình. Thẻ đã đổi sẵn.

## 4. Đã làm

| Mã | Nền | Dáng thẻ |
|---|---|---|
| NS002 | Corgi sân vườn (`ns002.jpg`) | mặc định theo style |
| NS004 | **Sân thượng sau mưa** — ChatGPT vẽ theo phong cách Weathering With You (`ns004.jpg`); tranh gốc phim để ở `_tham-khao/`, không dùng | kính mờ trắng-xanh, chữ navy `#14305c`, nhấn cam torii `#cf4a2a`, bo 20px, blur 14px |
| NS009 | Nền của Quỳnh Trang — 2 bé ăn bánh (`ns009.jpg`) | mặc định theo style |

## 5. Lưu ý bản quyền

Ảnh đang dùng **nội bộ ERP** (không công khai, không bán). Nếu ảnh là tranh của một tác phẩm có bản quyền (phim, truyện) thì **chỉ dùng nội bộ**; không đưa lên app học sinh, tài liệu in ra ngoài, hay bản demo công khai. Với app HS, luật ĐƯỢC/CẤM ở `design/DON-HANG-STYLE-NHO-XINH.md` vẫn áp.

## 6. Việc có thể làm tiếp (chưa làm)

- Mức 3 — **cảnh riêng có ô vẽ sẵn** (manifest toạ độ như `public/bk-ui/erp/canh/`): cần ảnh đúng khuôn `design/YEU-CAU-ANH-STYLE-ERP.md`.
- Cho nhân sự tự chỉnh dáng thẻ (hiện chỉ Claude khai trong code).
- Lưu `DANG_RIENG` vào DB (`nhan_su.erp_giao_dien`) thay vì code, nếu số người nhiều.

---

## 7. ĐƠN CHO CHATGPT — vẽ ảnh nền riêng (dán nguyên khối, chỉ điền phần `‹…›`)

> Chỉ dán **khối trong ``` dưới đây** cho ChatGPT (không dán cả file này — các mục 0–6 là cho Claude).
> Mỗi nhân sự = 1 context ChatGPT mới. Đính kèm **ảnh tham chiếu phong cách** nếu có (vd 1 ảnh phim / tranh bạn thích — ghi rõ "chỉ lấy không khí, màu, ánh sáng; không vẽ lại nhân vật").
> Ảnh về: lưu vào `design/bk-ui-src/erp-ca-nhan/` đặt tên `NS###_ten.png` rồi nhắn Claude "làm NS### theo ERP-NEN-VA-THE-RIENG.md".

```
Hãy vẽ 1 ẢNH NỀN cho trang chủ phần mềm quản lý (ERP) của trung tâm dạy thêm, làm riêng cho 1 nhân viên.

PHONG CÁCH:   ‹mô tả: vd "anime phong cảnh kiểu Shinkai — bầu trời mưa nắng, mây lớn, ánh sáng xuyên mây" / "tranh màu nước ấm, phòng học nắng" /
              "pixel art đêm thành phố" …›
CHỦ ĐỀ / CẢNH: ‹vd: sân thượng thành phố sau mưa, có cổng torii đỏ nhỏ ở góc dưới phải›
BẢNG MÀU:      ‹vd: xanh da trời + trắng mây là chủ đạo, điểm nhấn cam đỏ nhỏ›   (tuỳ chọn)
NHÂN VẬT:      ‹không có nhân vật› hoặc ‹1 nhân vật nhỏ ở góc TRÁI-DƯỚI, không che vùng giữa›

QUY CÁCH BẮT BUỘC:
- Khổ NGANG 16:9, 1672×941 px (hoặc lớn hơn cùng tỉ lệ). Ảnh đặc, KHÔNG nền trong suốt, KHÔNG khung viền, KHÔNG chữ / số / logo / watermark.
- BỐ CỤC: trang chủ sẽ đặt nhiều THẺ CHỮ lên ảnh, nên:
    · vật nổi bật (nhân vật, toà nhà, cây, mặt trời) dồn sang TRÁI và 2 góc;
    · khoảng GIỮA và PHẢI (khoảng 60% bề ngang) phải thoáng, ÍT chi tiết, độ sáng đều, không có đường nét mạnh hay vật tương phản cao;
    · phần dưới 15% đơn giản (có thanh công cụ che).
- Không có vật nào quá tối hoặc quá chói sát mép — chữ đặt lên phải đọc được.
- Tông màu hài hoà, không bão hoà gắt; nhìn cả ngày không mỏi mắt.
- CẤM: vẽ lại nhân vật / logo / cảnh nguyên bản của tác phẩm có bản quyền (phim, truyện, game). Chỉ lấy không khí, bảng màu, ánh sáng, cách vẽ.

GIAO HÀNG: đúng 1 ảnh, vẽ bằng công cụ tạo ảnh (không dựng bằng code). Dòng đầu ghi tên file đề xuất `NS###_‹ten›`.
Nếu bố cục chưa đúng (giữa/phải còn rối) tôi sẽ nhờ vẽ lại — hãy chỉnh theo.
```

**Gợi ý khi viết ‹mô tả›:** nói cả **không khí** (yên tĩnh, ấm, mát, buổi sáng/chiều/đêm) lẫn **vật cụ thể** (cửa sổ, mưa, cây, mèo…). Càng cụ thể về bố cục "thoáng giữa-phải" thì ảnh càng dùng được ngay, ít phải vẽ lại.

---

## 8. TRANG TRÍ ĐỘNG riêng (mèo ngủ trên card "Chào …") — mức mở rộng, đã làm cho NS004

Một lớp trang trí GẮN vào card, có chuyển động nhẹ, khai theo mã nhân sự trong `MEO_NGU` (`src/lib/erpSkin.ts`), vẽ bởi `src/components/MeoNgu.tsx`, gắn ở `HomeScreen.tsx` (chỉ màn rộng, màn điện thoại bỏ).

- **Cần 2 ảnh PNG nền trong suốt** (đặt `design/bk-ui-src/erp-ca-nhan/NS###_meo_than.png` + `NS###_meo_duoi.png`): THÂN (không đuôi, đáy phẳng) + ĐUÔI riêng (gốc ở mép trên ảnh, buông thẳng). Script nén tự cắt sát viền và in tỉ lệ rộng÷cao → điền `tiLeThan` / `tiLeDuoi`.
- **Chuyển động:** đuôi xoay quanh gốc, vẫy ~3 giây rồi nghỉ ~6 giây (chu kỳ 9s); thân phập phồng nhẹ 4,6s. Máy bật "giảm chuyển động" ⇒ đứng yên.
- **Chỉnh vị trí** bằng số trong `MEO_NGU`: `phai` (âm = thò ra ngoài mép phải card, đuôi buông xuống dọc mép), `chim` (thân lún xuống mặt card), `rong`, `duoiCao`, `duoiX/duoiY` (gốc đuôi trong thân).
- Vẽ lớp này sẽ **đẩy hàng đầu trang chủ xuống** đúng bằng chiều cao mèo (để mèo không bị cắt).
- Đơn ChatGPT mèo: giữ lại câu "KHÔNG vẽ đuôi" cho thân, và "gốc đuôi sát mép trên khung" cho đuôi.
