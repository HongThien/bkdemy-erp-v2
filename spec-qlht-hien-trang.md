# QLHT (hệ xu/quà của Hải) — HIỆN TRẠNG DB, audit 2026-08-29

> Chụp lại TOÀN BỘ những gì Hải đã tạo trong DB (app riêng, codebase ngoài workspace — DB là điểm gặp
> duy nhất). Nguồn: đọc catalog + full source 15 hàm ngày 29/08/2026. Mọi object owner=`postgres`,
> tạo tay qua SQL Editor, KHÔNG qua migration → trước audit này repo mù hoàn toàn (suýt đẻ bảng xu trùng).
>
> **Quyết định Thùy 29/08:** BK chỉ có 1 xu — chốt xu tháng ghi chung sổ `qlht_xu_ledger`, số dư đổi
> từ "EXP÷10 tự động (công thức tạm của Hải)" sang "Σ sổ đã chốt theo BẬC THANG" (`scripts/sql_chot_xu_qlht.sql`).
> **Module quà sẽ VIẾT LẠI theo style ERP** (Hải hiểu không đủ sâu hệ thống) — DB layer giữ làm nền/tham chiếu.

## Kiến trúc Hải dựng

- Bảng chỉ cho `authenticated` **SELECT**; mọi ghi qua **RPC SECURITY DEFINER**, đều gate `current_nhan_su_id()`.
- ⚠ **`current_nhan_su_id()` map người dùng QUA EMAIL** (`auth.users.email` = `nhan_su.email`, `dang_lam`)
  — KHÁC ERP (map qua `tai_khoan.id` = auth.uid). Email lệch ⇒ hệ Hải coi là không có quyền. Khi ERP
  gọi chung hạ tầng này phải để ý; về lâu dài nên thống nhất một cơ chế.

## Bản đồ chức năng (15 hàm — full source đã đọc, phụ lục cuối file)

| Mảng | Hàm | Ghi chú |
|---|---|---|
| Sổ xu | `qlht_dieu_chinh_xu(hs, ±amount, lý_do)` | cộng/trừ tay, CHẶN ví âm; ghi `cong_tay`/`tru_tay` |
| Số dư | view `qlht_v_so_du_xu` | = floor(EXP all-time ÷10) + Σ sổ (÷10 là TẠM — bị thay bằng bậc thang) |
| Catalog quà | `qlht_qua_them/sua/doi_trang_thai` | chống trùng tên (unique + check), giá xu > 0 |
| Nhập kho | `qlht_qua_nhap_kho(qua, ±sl)` → `qlht_nhap_xac_nhan` / `qlht_nhap_huy` | dương = phiếu chờ→xác nhận (số lượng thực); âm = trừ tồn ngay, chặn tồn âm; có FOR UPDATE (đúng) |
| Tồn | view `qlht_v_ton_qua` | nhập `da_vao_kho` − đã giao |
| Đổi quà catalog | `qlht_doi_qua_moi(hs, qua, sl)` | check tồn + số dư → trừ xu (sổ `doi_qua`, ref_id) → trạng thái `cho_giao` |
| Order theo yêu cầu | `qlht_order_tao` → `qlht_order_duyet(giá)` → `qlht_order_huy` | duyệt = chốt giá + TRỪ XU NGAY; hủy = HOÀN (`hoan`, ref_id) |
| Profile NS | `qlht_doi_giao_dien(sang/toi)` · `qlht_nhan_su_doi_avatar` | app Hải có profile riêng, ghi vào `nhan_su` |
| Test | `qlht_smoke_test` | bảng thử kết nối (có policy insert/update) |

**Data lúc audit (29/08): thử nghiệm** — 2 quà · 2 phiếu nhập (hoạt động 25/08) · 3 dòng sổ · 1 order · 0 đổi quà. Chưa live với HS.

## Phần CHƯA LÀM XONG (flow đứt ở khúc giao nhận)

- Đổi quà catalog: KHÔNG có hàm chuyển `da_giao` / hủy-hoàn-xu — trạng thái tồn tại mà không có đường tới.
- Order: KHÔNG có hàm chuyển `da_ve` / `da_giao` / `tu_choi` — duyệt xong đơn treo.
- 2 RACE: `qlht_doi_qua_moi` và `qlht_order_duyet` check số dư/tồn KHÔNG khóa dòng ⇒ 2 thao tác đồng thời
  có thể vượt tồn/âm ví (phần nhập kho Hải khóa đúng). Vá khi viết lại.

## KHÔNG phải của Hải (đừng tính vào bàn giao)

`giai_thuong` + `giai_thuong_lop_thang` (0 dòng): style khác hẳn — policy member-gate kiểu ERP, cổng đọc
`fdw_bkdemy_web`, trigger `giai_thuong_check_slot` (Xuất sắc 3 · Tiến bộ 2 · Chăm chỉ 1 / lớp / tháng).
Khung giải thưởng tháng chờ dùng, từ lane khác.

## Phụ lục — FULL SOURCE 15 hàm + trigger + grants (dump 29/08, đổi là phải dump lại)

```sql
-- current_nhan_su_id(): map qua EMAIL (khác ERP)
SELECT ns.id FROM public.nhan_su ns
JOIN auth.users au ON lower(au.email) = lower(ns.email)
WHERE au.id = auth.uid() AND ns.trang_thai = 'dang_lam' LIMIT 1;
```

Toàn văn 15 hàm + trigger + grants: **`scripts/qlht_dump_2026-08-29.txt`** (bản chụp 29/08).
Cần bản mới nhất: `node scripts/dump_qlht.mjs` (đọc `pg_get_functiondef` từ DB live, ghi đè file txt).
