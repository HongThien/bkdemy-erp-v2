# PLAN — Thu Chi BK (hoàn ứng chi tiêu nhân sự)

> Thùy chốt 02/09/2026 (21 câu, xem DEVLOG 09-02). **Chỉ CHI** (Thu = học phí đã có `hoa_don`).
> Bản chất app = **hoàn ứng**: nhân sự đã chi tiền túi → tạo khoản → Lộc (kế toán) chuyển trả
> theo QR → ghi sổ → định kỳ chốt kỳ gửi Ngân (người giữ tiền) để Ngân bù lại cho Lộc.
> Ngân KHÔNG dùng ERP.

---

## 0. Quyết định đã chốt (02/09)

| # | Câu | Chốt |
|---|---|---|
| 1 | Thu? | Chỉ Chi. |
| 2 | Ai tạo khoản chi | Mọi nhân sự `dang_lam`. |
| 3 | Luồng tiền | Chỉ hoàn ứng (nhân sự ứng trước, Lộc trả). Không tạm ứng, không trả thẳng NCC. |
| 4 | Ảnh chứng từ | Cho đính kèm, không bắt buộc. |
| 5 | Từ chối / sửa / huỷ | Lộc từ chối được (có lý do). Nhân sự sửa/huỷ khi còn `cho_duyet`. |
| 6 | Duyệt tầng 2 | Không. Thực tế được duyệt rồi mới chi; app chỉ để hoàn ứng. |
| 7 | STK nhân sự | Nhân sự tự khai trong app; Lộc thấy + sửa được trên ERP. |
| 8 | Nội dung CK | `BK CHI <mã NS> <mã khoản>` không dấu. |
| 9 | Danh mục | Lộc tự thêm/sửa/ẩn trên ERP. Không seed cứng (seed vài mục mẫu, Lộc sửa). |
| 10 | Đề xuất danh mục | Theo LỊCH SỬ (không AI): có lịch sử thì đề xuất, không thì thôi. Không quan trọng. |
| 11 | Lộc sửa số tiền | Được, nhưng PHẢI ghi lưu ý. |
| 12 | Ngày chi | Nhân sự chọn (mặc định hôm nay). |
| 13 | Kỳ chốt cắt theo | **Thời điểm Lộc xác nhận ghi sổ** (`ghi_so_at`), KHÔNG theo ngày nhân sự gửi. |
| 14 | File chốt | Ảnh (render bảng → PNG). |
| 15 | Lưu file chốt | Snapshot SỐ LIỆU trong DB là chân lý; ảnh sinh lại được bất kỳ lúc nào. |
| 16 | Ngân | Không đăng nhập, không care ERP. Không theo dõi Ngân bù hay chưa. |
| 17 | Sau chốt | KHOÁ khoản trong kỳ. |
| 18 | App mobile | App RIÊNG, domain `chi.bkacademy.edu.vn`, khuôn entry Vite cùng repo (HS/OPS/TA/GV). |
| 19 | Leaf ERP | Lá mới `thuchi` — "Thu chi" (Core team). |
| 20 | Thông báo | Chỉ badge trong app. |
| 21 | Khoản cũ | Bắt đầu từ deploy; khoản cũ chưa hoàn = tạo như khoản mới; đã hoàn thì bỏ. |

---

## 1. Vòng đời khoản chi (state machine — trigger DB canh)

```
nhân sự tạo ──► cho_duyet ──(Lộc "Đã thanh toán" + popup ghi sổ, 1 RPC)──► da_thanh_toan  (+1 dòng chi_so)
                    │
                    ├──(Lộc từ chối, có lý do)──► tu_choi
                    └──(nhân sự huỷ)─────────────► huy
```

- Bước 5–7 của story gộp thành **MỘT giao dịch**: popup là UI phía client; bấm "Xác nhận" mới gọi
  `fn_chi_thanh_toan_ghi_so` → (đổi trạng thái khoản + tạo dòng sổ) cùng transaction. Không có
  trạng thái lơ lửng "đã trả tiền mà chưa ghi sổ".
- `da_thanh_toan` / `tu_choi` / `huy` là trạng thái CUỐI. Không sửa lùi (muốn sửa: tạo khoản mới).
- Mọi đổi trạng thái → trigger ghi `chi_khoan_log` (actor · ts · cũ/mới). App không tự log.

## 2. Schema (migration `202609022xxx_thu_chi_v1.sql`)

```
nhan_su                      + bank_bin text · bank_stk text · bank_chu_tk text   (NULL = chưa khai)

chi_danh_muc                 id · ten · thu_tu · active · created_at            (Lộc quản lý)

chi_khoan  (yêu cầu hoàn ứng — nhân sự tạo)
  id uuid · ma text default 'CHI'||lpad(seq,4)  (ID hiển thị + nội dung CK, KHÔNG FK)
  nhan_su_id → nhan_su · so_tien_bao numeric>0 · muc_dich text · ngay_chi date
  danh_muc_de_xuat_id → chi_danh_muc (nullable — nhân sự gợi ý)
  anh_paths text[] default '{}'   (bucket public 'kho-anh', prefix thuchi/ — khuôn bao_loi)
  trang_thai text check (cho_duyet|da_thanh_toan|tu_choi|huy) default cho_duyet
  tu_choi_ly_do text · xu_ly_boi → nhan_su · xu_ly_at timestamptz
  created_at · updated_at

chi_khoan_log                id · chi_khoan_id · actor → nhan_su · at · tu text · den text · ghi_chu

chi_so  (sổ chi CHÍNH THỨC — 1-1 với chi_khoan đã thanh toán)
  id · chi_khoan_id unique → chi_khoan
  ngay date            (mặc định = ngay_chi nhân sự chọn; Lộc sửa được)
  so_tien numeric>0    (số Lộc duyệt; ≠ so_tien_bao ⇒ luu_y bắt buộc — RPC canh)
  muc_dich text · danh_muc_id → chi_danh_muc (not null) · luu_y text
  ghi_so_boi → nhan_su · ghi_so_at timestamptz default now()   ← ⭐ trục cắt kỳ
  ky_id → chi_ky (NULL = chưa chốt; NOT NULL = KHOÁ, trigger chặn update/delete)

chi_ky  (kỳ chốt gửi Ngân)
  id · ma 'KY'||lpad(seq,3) · tu_at timestamptz · den_at timestamptz (= now() lúc chốt)
  so_khoan int · tong_tien numeric · ghi_chu text · chot_boi → nhan_su · chot_at
chi_ky_danh_muc  (snapshot tổng theo danh mục — chân lý của "file chốt")
  ky_id → chi_ky · danh_muc_id · ten_danh_muc (chép tên lúc chốt) · so_khoan · so_tien
```

Vì sao cắt kỳ bằng `ghi_so_at` (timestamptz) chứ không bằng ngày: chốt "đến bây giờ" = `den_at = now()`;
kỳ sau bắt đầu đúng từ `den_at` ⇒ khoản Lộc ghi sổ SAU khi chốt (kể cả cùng ngày) tự rơi vào kỳ sau,
không có khoản nào lọt hay bị đếm hai lần. Trả lời đúng câu 8 story: Lộc không phải dò "chốt từ lúc nào".

## 3. RPC / view (mọi tính toán ở Postgres — §2.0)

| Hàm | Ai gọi | Làm gì |
|---|---|---|
| `chi_me_id()` | nội bộ | resolve nhân sự hiện tại (khuôn coalesce `tai_khoan` → `nhan_su.email` như `my_quyen`) |
| `fn_chi_tao(so_tien, muc_dich, ngay_chi, danh_muc_id?, anh_paths)` | app | insert `chi_khoan` cho chính mình |
| `fn_chi_sua(id, …)` / `fn_chi_huy(id)` | app | chỉ khi own + `cho_duyet` |
| `fn_chi_tu_choi(id, ly_do)` | ERP | `co_quyen_ghi('thuchi')` |
| `fn_chi_thanh_toan_ghi_so(id, so_tien, muc_dich, danh_muc_id, ngay, luu_y)` | ERP | transactional: check `cho_duyet`, so_tien ≠ bao ⇒ luu_y bắt buộc, insert `chi_so`, đổi trạng thái |
| `fn_chi_de_xuat_danh_muc(chi_khoan_id)` | ERP | ưu tiên: danh mục nhân sự gợi ý → danh mục hay dùng nhất của khoản cùng nhân sự có `muc_dich` trùng từ khoá → danh mục hay dùng nhất của nhân sự → NULL |
| `fn_chi_ky_xem_truoc()` | ERP | từ `den_at` kỳ gần nhất (hoặc -∞) đến now(): tổng theo danh mục + tổng cộng + số khoản |
| `fn_chi_ky_chot(ghi_chu)` | ERP | transactional: tạo `chi_ky` (den_at = now()), gán `ky_id` cho mọi `chi_so` chưa chốt có `ghi_so_at <= den_at`, snapshot `chi_ky_danh_muc`. 0 khoản ⇒ raise. |
| `fn_chi_ky_chi_tiet(ky_id)` | ERP | jsonb: header + dòng danh mục + danh sách khoản (để render ảnh/xem lại) |
| `fn_chi_tong_quan()` | ERP/app | badge: số `cho_duyet`, số khoản chưa chốt + tổng tiền chưa chốt, kỳ gần nhất |
| `fn_chi_cua_toi()` | app | danh sách khoản của tôi + trạng thái + thông tin thanh toán |
| view `v_chi_khoan_duyet` | ERP | khoản + tên NS + mã NS + bank + danh mục gợi ý (list duyệt) |
| view `v_chi_so` | ERP | sổ + khoản + NS + danh mục + kỳ (list sổ, filter PostgREST) |

Trigger: `trg_chi_khoan_log` (state-log) · `trg_chi_so_khoa` (chặn update/delete khi `ky_id` not null,
trừ chính việc gán `ky_id` từ NULL) · `trg_chi_khoan_khoa` (khoản ở trạng thái cuối chỉ đổi qua RPC — chặn
update trực tiếp trừ cột `updated_at`).

RLS (default invoker + RLS, không security definer trừ helper resolve người):
- `chi_danh_muc`: select `la_thanh_vien()`; write `co_quyen_ghi('thuchi')`.
- `chi_khoan`: select own ∨ `co_chuc_nang('thuchi')`; insert own; update own khi `cho_duyet` ∨ `co_quyen_ghi('thuchi')`; không delete.
- `chi_so` / `chi_ky` / `chi_ky_danh_muc` / `chi_khoan_log`: select own (qua khoản) ∨ `co_chuc_nang('thuchi')`; write `co_quyen_ghi('thuchi')`.
- `nhan_su` bank cols: policy update hiện có (member) — nhân sự sửa own row; UI app chỉ mở 3 cột này.

Quyền: leaf `thuchi` cấp qua màn Phân quyền (Lộc = ghi; Thùy founder bypass). KHÔNG hardcode NS003.

## 4. App "BK Chi" (entry Vite thứ 5, PWA, Vercel project riêng → chi.bkacademy.edu.vn)

```
chi.html · src/main-chi.tsx · vite.config.chi.ts · package.json dev:chi/build:chi/preview:chi
src/AppChi.tsx            session → chặn tài khoản HS → staff vào; không cần leaf (ai cũng tạo được)
src/screens/chi/ChiHome.tsx      shell bottom-tab: Khoản chi · Tài khoản
src/screens/chi/DanhSachChi.tsx  list của tôi (nhóm: chờ duyệt / đã thanh toán / từ chối-huỷ) + FAB "+ Khoản chi"
src/screens/chi/TaoKhoanChi.tsx  form: số tiền · mục đích · ngày chi · danh mục (tuỳ chọn) · ảnh (camera/thư viện) — sửa khi còn chờ
src/screens/chi/ChiTietChi.tsx   detail + huỷ (khi chờ) + thông tin thanh toán/từ chối
src/screens/chi/TaiKhoanBank.tsx ngân hàng (chọn từ danh sách BIN) · STK · tên chủ TK · preview QR tĩnh · đăng xuất
src/lib/thuchi.ts                seam data (mọi màn app + ERP gọi qua đây)
src/lib/nganhang.ts              danh sách ngân hàng VN + BIN NAPAS (config hiển thị)
```
Luật bundle như PLAN-app-ops §2: không import `useStore`/`NhanSuHome`/`screens/kho`. Touch-first.
Thiếu STK ⇒ form tạo khoản cảnh báo "Lộc không chuyển được, khai STK ở tab Tài khoản" (không chặn).

## 5. ERP — lá `thuchi` "Thu chi" (`src/screens/thuchi/ThuChiScreen.tsx`)

Tab:
1. **Duyệt chi** — hàng chờ `cho_duyet` (mới nhất trước) · click → drawer detail: NS · số tiền · mục đích ·
   ngày · ảnh · **QR VietQR động** (bin/stk NS + số tiền + nội dung `BK CHI NSxxx CHIxxxx`) · nút
   **Đã thanh toán** → popup ghi sổ (mục đích · danh mục [đề xuất] · ngày · số tiền · lưu ý) → Xác nhận ·
   nút **Từ chối** (lý do). NS chưa có STK ⇒ cảnh báo đỏ thay QR.
2. **Sổ chi** — `v_chi_so`, lọc theo khoảng ngày/danh mục/NS/kỳ; badge 🔒 khoản đã chốt.
3. **Chốt kỳ** — khối "Chưa chốt: từ <den_at kỳ trước> đến bây giờ" (tổng theo danh mục + tổng) →
   nút **Chốt kỳ** (xác nhận) → tạo kỳ · danh sách kỳ đã chốt → mở: bảng tổng + phụ lục → **Tải ảnh** (html2canvas, khuôn PhieuThongBao).
4. **Danh mục** — CRUD `chi_danh_muc` (thêm/sửa tên/ẩn/kéo thứ tự).
5. **Tài khoản NS** — bảng nhân sự + bank (Lộc sửa được).

## 6. Thứ tự làm

1. Migration + `npm run migrate` + `npm run schema`.
2. `lib/thuchi.ts` + `lib/nganhang.ts`.
3. App BK Chi (4 màn) → chạy `dev:chi` verify.
4. ERP ThuChiScreen (5 tab) + leaf + đăng ký màn → verify trên erp dev.
5. DEVLOG · launch.json (`chi-dev`) · commit.

Ngoài scope v1: tạm ứng trước · Ngân xác nhận bù · push/Zalo · duyệt tầng 2 · xuất xlsx.
