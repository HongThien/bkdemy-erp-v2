# Spec — KHO CHUẨN: một cửa duyệt câu + quét lại toàn kho

> CEO chốt 09/09/2026 (sáng sớm): *"Duyệt lại cả kho. Quét một lượt: câu đúng coi như đã duyệt, vào kho chuẩn; câu có vấn đề
> đưa ra màn duyệt lại. Từ giờ mọi câu mới phải qua màn duyệt mới chính thức vào kho, mới được sử dụng."*
> Về bản chất chỉ còn **2 cửa duyệt**: (1) chất lượng câu (đề, dạng, cụm, đáp số, lời giải) — cửa này; (2) form mới của câu
> (trắc nghiệm AI, spec-mcq-form.md) — chỉ nhận câu đã qua cửa 1.

---

## 0. Sự thật đo được (09/09, kho Đại)

| | Số |
|---|---|
| Câu | 17.743 (clone 12.192 · gốc 5.551) |
| Đã có người ký `da_duyet` | 60 |
| Cờ `da_duyet` được dùng khi chọn câu cho HS/ET | **không** (0 chỗ) |
| Bộ tính máy (mcq-auto) kiểm được đáp số | 2.456 câu; **đáng tin** 1.611 (36 dạng tính toán thuần) |
| Lệch trong phần đáng tin | clone 9/1.404 (0,64%) · gốc 3/207 (1,45%) — 2 lỗi thật đã xác nhận đều là câu gốc |

Kết luận: cửa 1 hiện là cờ trang trí; "sai" không dồn vào clone; máy chỉ phủ ~10% kho, phần còn lại phải Claude giải lại.

## 1. Định nghĩa "vào kho chuẩn" — bằng QUERY, không bằng cờ

Thêm vào mọi bảng câu (`dai_/khtn_/hgt_cau_hoi`):

```sql
kiem_may     text     check (kiem_may in ('khop','nghi','khong_kiem_duoc')),  -- kết quả máy/AI kiểm đáp số
kiem_may_at  timestamptz, kiem_may_boi text,      -- 'mcq-auto' | 'claude_code' | 'nguoi'
kiem_may_ghi text,                                 -- vd "máy 37/24 ≠ kho 13/16"
duyet_nguon  text     check (duyet_nguon in ('nguoi','may','ai'))   -- ai ký da_duyet
```

Một hàm SQL duy nhất, mọi nơi chọn câu đều gọi (tự luyện, bổ trợ yếu, retest, ET/BTVN online, `listCauByDang` khi soạn):

```sql
create function _kho_cau_chuan(da_duyet boolean, kiem_may text, created_at timestamptz) returns boolean
  immutable language sql as $$
  select da_duyet
      or (kiem_may is distinct from 'nghi' and created_at < '<NGÀY BẬT>')   -- câu cũ: tạm dùng tới khi được quét; máy NGHI thì rút ngay
$$;
```

- **Câu mới** (sau NGÀY BẬT): chỉ dùng khi `da_duyet = true`. Không ngoại lệ, không phân biệt đường vào.
- **Câu cũ**: tạm dùng; quét tới đâu chuyển trạng thái tới đó. `nghi` ⇒ rút khỏi HS ngay, vào hàng duyệt lại.
- Khi quét xong toàn kho thì bỏ vế thứ hai (migration mới) — kho chuẩn = `da_duyet` thuần.

## 2. Quét lại toàn kho — chương trình 3 mức, không phải một lệnh

**Mức A — máy tính (mcq-auto), tự động, chạy ngay.** Chỉ trong **whitelist dạng** "đáp số = giá trị biểu thức" (tính giá trị,
tìm x, cộng trừ nhân chia, luỹ thừa…; KHÔNG làm tròn/đặt tính/quy đồng/so sánh/toán có lời). Việc trước khi chạy: lớp 6 dùng
dấu chấm làm phép nhân (`9.6 − 81:3³`) — thêm quy tắc theo dạng, nếu không báo giả hàng loạt. Kết quả: khớp ⇒ `kiem_may='khop'`,
`da_duyet=true`, `duyet_nguon='may'`; lệch ⇒ `nghi` + ghi chú.

**Mức B — Claude giải lại (quota Claude Code, không API).** Cho câu máy không kiểm được. Script theo khuôn `hangdoi-giai.mjs`:
`--list` xuất lô 200–300 câu (đề + đáp số kho + lời giải kho) → Claude giải trong chat, ghi `{ma_cau, dap_an_ai, khop: bool, ghi}`
→ `--ghi`. Khớp ⇒ `khop` + `da_duyet=true` + `duyet_nguon='ai'`; không khớp ⇒ `nghi`; câu không giải được/đề lỗi ⇒
`khong_kiem_duoc` + hàng duyệt. **AI chỉ được báo nghi, không được sửa đáp số kho.** Ước lượng: ~16.000 câu, 60 lô, nhiều
phiên; ưu tiên theo 2 trục: câu **đã xuất hiện trong bài làm HS** trước, câu **chưa kiểm được** trước.

**Mức C — người.** Hàng "duyệt lại" = `nghi` ∪ `khong_kiem_duoc`. Cộng **mẫu 2%** của phần máy/AI đã ký để đo độ tin
(precision của máy và của AI tách riêng). Độ tin thấp ⇒ hạ mức B xuống chỉ báo, không ký.

## 3. Màn duyệt = bước CHUẨN HOÁ (một hàng đợi, nhiều bộ lọc)

Gộp 4 đường vào (nhập kho UI · clone · giải AI · nhập từ file) thành **một trạng thái**: dòng thật trong bảng câu với
`da_duyet=false`. Bỏ bảng nháp `dai_cau_hoi_clone_cho_duyet` (clone ghi thẳng, `nguon='clone'`). Các tab hiện có của màn
"Duyệt lời giải AI" thành bộ lọc: *Chưa có lời giải · Lời giải AI mới · Máy nghi sai đáp số · Không kiểm được · Tồn đọng*.

Một thẻ duyệt sửa được ngay tại chỗ, lưu là chuẩn:
- **Dạng**: ô tìm kiếm (không dropdown), chuyên đề suy từ dạng nên không có ô riêng. Lưu `dang_ai_de_xuat` (AI gán lúc vào)
  cạnh `dang_chinh` (người chốt) ⇒ precision gán dạng đo được, không cần log riêng.
- **Cụm**: lọc theo dạng đang chọn; đổi dạng thì cụm reset.
- **Đáp số, lời giải, đề**: sửa tại chỗ; sửa đáp số ⇒ mọi form trắc nghiệm của câu bị **thu hồi** (`xoa_at`) để sinh lại.
- **Duyệt** = `da_duyet=true, duyet_boi, duyet_at, duyet_nguon='nguoi'`. Từ chối = `xoa_at` (kho rác, §2 CLAUDE.md).
- Không có "duyệt tất cả" cho hàng nghi.

Đổi dạng sau khi câu đã dùng không phá gì: lịch sử đo snapshot `ma_dang` trong `bai_test_cau`; form trắc nghiệm khoá `ma_cau`;
tiền tố mã câu không được tin (đã quy ước).

## 4. Thứ tự làm

| Bước | Việc | Xong khi |
|---|---|---|
| 1 | Migration cột §1 + hàm `_kho_cau_chuan` + cắm vào 5 chỗ chọn câu (NGÀY BẬT = ngày áp) | Câu mới không duyệt không xuất hiện ở HS/ET; câu cũ không đổi |
| 2 | Mức A: whitelist dạng + fix dấu chấm lớp 6 + chạy, ghi `kiem_may` | ~1.600 câu ký máy; hàng nghi có N câu |
| 3 | Màn duyệt hợp nhất §3 (mở rộng tab hiện có, không màn mới) | TA duyệt được hàng nghi, sửa dạng/cụm/đáp số tại chỗ |
| 4 | Mức B theo lô, ưu tiên câu HS đã làm | Mỗi lô ghi log precision; dừng nếu độ tin < ngưỡng CEO đặt |
| 5 | Gộp đường vào: clone/giải AI/nhập file ghi thẳng `da_duyet=false`; bỏ bảng nháp clone | 1 hàng đợi |
| 6 | Quét xong ⇒ bỏ vế "câu cũ tạm dùng" | Kho chuẩn = `da_duyet` thuần |

Cửa 2 (form trắc nghiệm) từ bước 1 chỉ sinh cho câu `da_duyet=true`. 488 form đã sinh trước cửa 1: giữ, nhưng form của câu bị
`nghi` tự thu hồi khi đáp số câu bị sửa.

## 5. Câu hỏi còn mở (không chặn bước 1–2)

- Ngưỡng độ tin để AI được **ký** (mức B) thay vì chỉ báo: đề xuất precision mẫu ≥ 98% trên 200 câu đầu.
- Khối/dạng nào quét trước: đề xuất khối 6–9 (đang dạy, HS làm nhiều), rồi 10–12, rồi cấp 1.
