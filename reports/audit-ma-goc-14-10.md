# Audit luật "MÃ GỐC BẤT BIẾN" — 14/10/2026 (chỉ đọc)
Script: `scripts/_audit_ma_goc.mjs` + `scripts/_audit_ma_goc_chi_tiet.mjs`. Quét `pg_trigger` + `pg_proc.prosrc` (schema public).

## Bảng có cột mã sinh từ sequence: 29
anh_ban_do.ma_dang · anh_cau_hoi.ma_cau · anh_ngu_lieu.ma_ngu_lieu · chi_khoan.ma · chi_ky.ma · dai_ban_do.ma_dang · dai_cau_hoi.ma_cau · dai_cum_bai.ma_cum · hgt_ban_do.ma_dang · hgt_cau_hoi.ma_cau · hgt_cum_bai.ma_cum · hinh_bai.ma_bai · hinh_ban_do.ma_dang_hinh · hinh_bo_de.ma · hinh_dang.ma · hinh_hoc_bai.ma_bai · hinh_hoc_cau_hoi.ma_cau · hinh_hoc_cum_bai.ma_cum · hinh_mo_hinh.ma · hinh_y.ma_y · hoc_sinh.ma_hs · khtn_ban_do.ma_dang · khtn_cau_hoi.ma_cau · khtn_cum_bai.ma_cum · nhan_su.ma_ns · phu_huynh.ma_ph · tsa_ban_do.ma_dang · tsa_cau_hoi.ma_cau · tsa_cum_bai.ma_cum

## Trigger gán NEW.<mã> (3)
| Bảng | Hàm | Kết luận |
|---|---|---|
| `chi_khoan` | `trg_chi_khoan_bf` | ✅ ĐÚNG: UPDATE ép `new.ma := old.ma` (mẫu nên theo) |
| `sotay_cong_thuc` | `_sotay_ct_truoc_ghi` | 🟡 chỉ sinh ở INSERT, nhưng KHÔNG chặn UPDATE tay lên `ma` |
| `hinh_baitoan` | `hinh_baitoan_gen_ma` | ❌ cấp LẠI mã khi `UPDATE OF mo_hinh_id` — **ĐÃ SỬA 14/10** (mig `202610140048`, test 15/15) |

## Hàm đổi cột mã (vi phạm thật)
- ❌ **`fn_dai_chuyen_dang(p_ma_dang, p_ma_chuyen_de_moi)`** — ĐỔI `dai_ban_do.ma_dang` (PK) khi chuyển dạng sang chuyên đề khác (`fn_dai_chuyen_dang_ma_moi`), rồi `update … set ma_dang=` ở `ca_test_cau` + 7 bảng text-ref (`gami_session_problems`, `bai_test_cau`, `tu_luyen_dang_lan`, `buoi_danh_gia_dang`, `bo_tro_duoi_dang`, `bo_tro_yeu_dang`, `canh_bao_yeu`) và `dai_ban_do` FK cascade. Gốc rễ: **mã dạng Đại mã hoá phân cấp** (`T1+KK+CD+CE+DD`), nên đổi chuyên đề = đổi mã.
- ❌ `fn_dai_chuyen_chuyen_de` — đổi `ma_chuyen_de` ở `dai_chuyen_de_ly_thuyet` (cùng họ).
- ➡ Các hàm còn lại khớp regex (`fn_btyeu_*`, `_btyeu_dong_bo_dang_ban_do`, `fn_dai_gan_mau_gan`, `fn_de_thi_hoan_thien_bai_test`…) chỉ **ghi/đồng bộ bản sao** của mã (không cấp mã mới) — là HỆ QUẢ của `fn_dai_chuyen_dang`, không phải nguồn.

## Việc cần CEO quyết (KHÔNG tự sửa — đụng thiết kế mã Đại/HGT/KHTN/…)
Muốn tuân luật, mã dạng phải **thôi mã hoá chuyên đề**: `ma_dang` bất biến, vị trí nằm ở cột `ma_chuyen_de` (đã có sẵn). Hệ quả: bỏ nhu cầu `fn_dai_chuyen_dang_ma_moi` + cascade 8 bảng; đổi quy ước hiển thị `T1…` thành nhãn suy ra. Chưa đo bao nhiêu dạng đã bị đổi mã từ trước (mất vết lịch sử).
