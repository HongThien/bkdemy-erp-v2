# spec-kho-cau-hoi.md — KHO CÂU HỎI: một câu gồm gì · vào kho · trắc nghiệm · điền ô · clone · báo sai (spec #3 của bộ 20 spec)

> **Trạng thái: NHÁP 17/11/2026 — chờ Thùy duyệt.** Chưa thay file nguồn nào; chừng nào Thùy chưa duyệt, file nguồn vẫn là nguồn đúng (`SPEC-INDEX.md` bảng A).
> **Gộp từ:** `spec-mcq-form.md` · `spec-mcq-quy-trinh-sinh.md` · `spec-mcq-tung-phan.md` · `spec-dien-o.md` · `spec-clone-ai.md` · `spec-kho-chuan.md` (phần định nghĩa "câu vào kho").
> Đọc thêm để trỏ (không chép): CLAUDE.md §1.5 · §1.6 · §2 (mã gốc bất biến, kho rác) · `spec-bo-tro.md` §1, §4–§6 · `spec-giai-bai.md` §A5, §A17, §C6, §C7, Phần D.
> **Đối chiếu DB ngày 17/11/2026** (chỉ đọc: `information_schema`, `pg_get_functiondef`, `pg_trigger`, đếm dòng). Chỗ DB/code lệch spec cũ ⇒ không sửa, ghi ở §8.
> Nhãn **"CTO phân xử 17/11"** = các file cũ nói ngược nhau, Claude chọn theo quyết định mới nhất; Thùy sửa là thành luật của Thùy.

**Không thuộc spec này:** giải bài · nhập kho · duyệt lô · dây chuyền 8 trạm ⇒ `spec-giai-bai.md` · bản đồ dạng / dạng bài / cụm ⇒ spec #2 (`spec-ban-do-toan.md`) · builder · ET · MT ⇒ spec #4 · đo mastery ⇒ `spec-mastery.md` · logic bổ trợ ⇒ `spec-bo-tro.md` (ở đây chỉ giữ luật **chọn câu**).

---

## 0. Đích

- Mỗi **câu** trong kho là một đối tượng có **một mã gốc bất biến**, mang đủ: đề · hình · đáp án · lời giải 2 phần · loại câu · nhãn nguồn · trạng thái kiểm / duyệt — để **bất kỳ màn nào** (app HS, ET, MT, bổ trợ, in giấy) lấy ra dùng mà không phải hỏi thêm.
- Từ một câu gốc sinh ra **các FORM** (hình thái) khác nhau **mà không sửa câu gốc**: trắc nghiệm 4 phương án (MCQ) · điền ô (trắc nghiệm từng phần) · (sau này) trả lời ngắn khoá cấu trúc, tự luận AI chấm. Câu gốc bất động; form là bản THÊM, có vòng duyệt riêng (**cửa 2**), chỉ nhận câu đã qua **cửa 1** (vào kho chuẩn).
- Phương án sai của mọi form **sinh từ một lỗi có tên** (rule) ⇒ HS chọn sai = hệ ghi được lỗi đó chắc 100% (CLAUDE §1.5 "chỉ gán lỗi khi chắc"), không cần người đoán.
- Mọi môn, mọi nhánh chạy **cùng một khuôn** (CLAUDE §1.6): khác nhau chỉ ở tên bảng (`<kho>_cau_hoi`, `<kho>_cau_form_tn`, `<kho>_mcq_rule`), dispatch qua registry `_kho_cau_tbl` / `_kho_form_tn_tbl` / `_kho_form_dien_tbl`.

## 1. Một câu trong kho gồm gì

Bảng câu theo kho: `dai_cau_hoi` (Đại) · `hgt_cau_hoi` (Hình giải tích) · `hinh_hoc_cau_hoi` (Hình — mô hình bài–ý) · `khtn_cau_hoi` · `vatly_cau_hoi` · `hoahoc_cau_hoi` · `tsa_cau_hoi` · `anh_cau_hoi`.
Bản xem gộp: view `v_kho_cau_hoi` · `bdm_cau_hoi` (câu theo dạng bài bản đồ mới) · `bdm_cau_form_tn`. Cột `kho` = hằng của bảng (CHECK `kho = 'dai'`…), dùng để gộp khuôn (CLAUDE §1.6 "chung trong cùng khuôn").

| Nhóm | Cột | Luật |
|---|---|---|
| **Mã gốc** | `ma_cau` (PK) | Cấp **một lần lúc INSERT**, không bao giờ đổi (CLAUDE §2). Đã dò 17/11: **không hàm nào `UPDATE … set ma_cau`**. Cách cấp hiện nay: Đại · HGT · KHTN = **mã dạng lúc sinh + STT 3 chữ số** (script `_kho_insert.mjs` khoá advisory theo dạng; client `nextCauSeq` ở `src/lib/kho/api.ts`); Hình = DB cấp `HHC` + `hinh_hoc_cau_seq`. Mặc định DB `DC…`/`GC…` + sequence hầu như không dùng (6 câu Đại, 60 câu HGT). **Tiền tố mã không được tin** để suy dạng / khối (câu đổi dạng giữ mã cũ). STT lấy max trên cả câu đã vào rác ⇒ mã đã xoá không cấp lại. |
| **Đề** | `noi_dung` · `lua_chon` (jsonb, mảng 4 chuỗi khi TN gốc) · `menh_de` (jsonb, câu Đúng/Sai; đồng bộ sang `<kho>_cau_menh_de` bằng trigger `_trg_sync_*_menh_de`) | Trình bày theo `spec-giai-bai` §A5, §A18. TN: `noi_dung` chỉ đề dẫn, phương án chỉ ở `lua_chon`. |
| **Hình** | `anh_de` · `anh_dap_an` | Nhãn nguồn hình (`kho_hinh_nguon`, `kho_hinh_lenh_ve`) ⇒ `spec-giai-bai` §C12. Câu có chữ "[hình" mà thiếu `anh_de` **không vào bài nào** (`_kho_dk_du_hinh_sql`). |
| **Đáp án** | `dap_an` (text) | TN = chữ A–D · TLN = kết quả cuối, biểu thức bọc `$…$` · Đ/S = theo từng mệnh đề. "Đủ đáp án" định nghĩa ở **một** hàm `_bdm_du_dap_an(loai, dap_an, menh_de, loi_giai)` (TN: `^[A-D]$` · TLN: khác rỗng · Đ/S: đủ 4 mệnh đề Đ/S · tự luận: có lời giải). |
| **Lời giải** | `loi_giai` | **Hai phần** `Phần 1. Hướng dẫn` + `Phần 2. Trình bày`; câu Hình chứng minh dùng Sơ đồ tư duy ⇒ `spec-giai-bai` §A5, §A6, §A18. Đề xuất AI chưa chốt nằm ở `loi_giai_ai` · `dap_an_ai` · `ai_model` · `ai_de_xuat_at`. |
| **Loại câu** | `loai_cau` | `trac_nghiem` · `tra_loi_ngan` · `tu_luan` · `dung_sai` (TSA thêm `keo_tha`). Hình mặc định `tu_luan`. ⚠ Không có CHECK (§8 L11). |
| **Dạng** | `dang_chinh` · `dang_ai_de_xuat` · `ma_cum` | `dang_chinh` = mã dạng **bản đồ cũ** (FK `<kho>_ban_do`), nay chủ yếu là chỗ lưu trữ — 47.605 câu Đại đang ở mã dạng chờ `…000000` (`_kho_la_dang_cho`). **Dạng bài bản đồ mới** gán ở `dai_bdm_gan_cau` / `hgt_bdm_gan_cau` / `khtn_bdm_gan_cau`… (Đ/S: `*_bdm_kho_ds` cấp chủ đề), bản chụp đọc nhanh `kho_cau_dang` (trigger `_trg_kho_cau_dang_cau`). Gán dạng là việc của spec #2; đo theo dạng HIỆN TẠI của câu là việc của `spec-mastery` §3. Hình: `dang_chinh` = `ma_bai` (FK `hinh_hoc_bai`), thêm `bai_y` · `nhan_y` · `cau_hoi_y` (đủ cả ba hoặc trống cả ba) · `mo_hinh_id` · `thu_tu`. |
| **Nguồn** | `nguon` (`le` · `clone` · `de_thi`) · `nguon_loai` (`kho_cu` · `tai_lieu` · `de_thi`, trigger tự điền, clone kế thừa từ gốc) · `ten_de_goc` · `nguon_giai` (`nguoi` · `ai`) · `giai_method` (`claude_code` · `ai_extract_solve` · `clone_doi_so` · null = cũ/Gemini) · `parent_ma_cau` + `clone_method` (§5) · `muc_cau` (KHTN 1–5) | Nhãn dây chuyền ghi thế nào ⇒ `spec-giai-bai` §C7. |
| **Kiểm** | `kiem_may` (`khop` · `nghi` · `khong_kiem_duoc`) · `kiem_may_boi` (`mcq-auto` · `claude_code` · `nguoi`) · `kiem_may_ghi` · `kiem_may_at` · `kiem_may_lo` (FK `kho_kiem_lo`) | AI/máy **chỉ được báo `nghi`, không được sửa đáp số kho**. `nghi` ⇒ rút khỏi HS ngay (§2). |
| **Duyệt** | `da_duyet` · `duyet_boi` · `duyet_at` · `duyet_nguon` (`nguoi` · `may` · `ai`) | Trigger `_kho_cau_duyet_nguon`: duyệt mà không ghi nguồn ⇒ `nguoi`; bỏ duyệt ⇒ xoá nguồn. Script máy/AI **phải** ghi `may`/`ai` tường minh. Câu ở dạng chờ không duyệt được (§2). |
| **Vào kho** | `kho_chuan` (generated) | §2. Hình thêm `rut_khoi_kho` (rút tay khỏi kho, 885 câu). |
| **Kho rác** | `xoa_at` | Xoá = `xoa_at = now()`, không DELETE (§6). |

**Vết bắt buộc (trigger, app không phải nhớ):** `kho_sua_log` (`_trg_log_kho_sua`: mỗi lần đổi đề · lựa chọn · mệnh đề · đáp án · lời giải · cụm · hình, kèm người, `da_duyet` trước đó) · `kho_doi_dang_log` (`_trg_log_doi_dang`) · `kho_cau_log` (`log_kho_cau`: vào rác / khôi phục / xoá vĩnh viễn). Bảng `hinh_hoc_cau_hoi` **không** có các trigger log này (§8 L11).

**Số đo 17/11** (câu chưa vào rác):

| Kho | Tổng (gồm rác) | Rác | `da_duyet` | `kho_chuan` | Clone (`parent_ma_cau`) | `nghi` | Form TN đã duyệt / chờ |
|---|---|---|---|---|---|---|---|
| Đại | 80.124 | 1.429 | 52.143 | 52.496 | 15.305 | 586 | 11.977 / 6.747 |
| HGT | 6.617 | 45 | 5.171 | 5.172 | 188 | 35 | 199 / 364 |
| Hình | 9.423 | 284 | 5.081 | 8.158 | 30 | 120 | 0 / 25 (§8 L5) |
| KHTN | 12.775 | 3.013 | 8.898 | 8.960 | 14 | 0 | 0 / 757 |
| Vật lý · Hoá học | 0 | — | — | — | — | — | bảng có, 0 dòng |

Loại câu Đại: TLN 28.934 · TN 28.280 · tự luận 16.626 · Đ/S 4.855. Nguồn duyệt Đại: `ai` 35.884 · `nguoi` 12.905 · `may` 3.354.

## 2. Vào kho / kho chuẩn

**Định nghĩa bằng HÀM, không bằng cờ tay** (spec-kho-chuan §1, mig `202609091448`):

```
kho_chuan = _kho_cau_chuan(da_duyet, kiem_may, created_at, giai_method)   -- cột generated ALWAYS
          = da_duyet
            OR (kiem_may <> 'nghi' AND giai_method <> 'claude_code' AND created_at < _kho_ngay_bat())   -- _kho_ngay_bat() = 08/09/2026 09:12
```

- **Câu mới** (sau ngày bật): chỉ vào kho khi `da_duyet = true`. Không ngoại lệ, không phân biệt đường vào.
- **Câu cũ**: tạm dùng tới khi được quét; máy/AI báo `nghi` ⇒ rút ngay; lời giải do Claude Code ghi mà chưa duyệt ⇒ không dùng. Còn **353 câu Đại + 1 câu HGT** đang "tạm dùng" (17/11). Quét xong ⇒ migration mới bỏ vế thứ hai, kho chuẩn = `da_duyet` thuần (§8 câu hỏi Q6).
- **Hình** đang dùng công thức RIÊNG `(not rut_khoi_kho) and (da_duyet or kiem_may <> 'nghi')` — không có mốc ngày bật ⇒ lệch, §8 L2.

**Các đường ký `da_duyet`:**

| Đường | Nguồn ghi | Ở đâu |
|---|---|---|
| Người duyệt trên màn (trưởng khối trở lên; sửa đề / dạng / đáp số / lời giải tại chỗ rồi duyệt) | `nguoi` | màn duyệt kho — quy trình ⇒ `spec-giai-bai` §C1, §C6 |
| Máy tính lại đáp số khớp (whitelist dạng "đáp số = giá trị biểu thức", `mcq-auto`) | `may` | `scripts/kho-quet-dapso.mjs` |
| Dây chuyền giải bài đủ 4 điều kiện làn 🟢 | `ai` | `spec-giai-bai` §C6 |
| **Tự duyệt sau gán dạng** — dòng gán nguồn `ai` vào `*_bdm_gan_cau` / `*_bdm_kho_ds` ⇒ câu chưa duyệt, chưa rác, không `nghi`, đủ đáp án (`_bdm_du_dap_an`) thành `da_duyet`, `duyet_nguon='ai'` | `ai` | trigger `_bdm_tu_duyet_sau_gan` (mig `202611051930`) |

- **Chặn:** câu đang ở dạng chờ không duyệt được (`_trg_chan_duyet_dang_cho`) trừ khi đã gán dạng bài bản đồ mới (Đ/S: đã có chủ đề kho Đ/S), hoặc đang chạy chế độ "duyệt nội dung, phân dạng sau" (`kho.duyet_noi_dung = on`).
- Bỏ duyệt (`da_duyet = false`) ⇒ trigger xoá `duyet_nguon` ⇒ câu mới rời kho ngay.

**Điều kiện câu được đưa cho HỌC SINH (mọi môn, Thùy 02/10):** `_kho_dk_online_hs_sql(bảng)` = `_kho_dk_mcq_sql(bảng)` (TSA: `_kho_dk_online_sql`) — tức **kho chuẩn + đủ hình + là MCQ** (§3.6). Cùng một nguồn cho tự luyện, bổ trợ, đề thi trên app (`fn_dtv_kho_*`), bù.

## 3. Form TRẮC NGHIỆM (MCQ)

### 3.1 Phạm vi (còn hiệu lực)

1. **MCQ ưu tiên trước TLN** trên app HS (Thùy 08/09): HS chưa quen thì TLN "làm đúng gõ sai"; chọn phương án sai = xác định lỗi chắc hơn.
2. **MCQ là bản THÊM** (`<kho>_cau_form_tn`), **không đổ `lua_chon` vào câu gốc** — đổ vào gốc làm mọi ET in giấy / mã đề / phiếu chấm đang dùng câu đó tự đổi form (`etFormOf` coi "có `lua_chon`" = trắc nghiệm).
3. **Mỗi phương án sai = kết quả THẬT của một đường sai có tên** (rule `<kho>_mcq_rule`), không bịa số.
4. **Không hiện `duong_sai` cho HS** (Thùy 08/09): HS đọc lời giải chi tiết; `rule`/`duong_sai` chỉ cho staff. `duong_sai` không bao giờ vào `bai_test_cau`, chỉ mã rule (`lua_chon_rule`).
5. **Phạm vi khuôn** (§3.3 bảng RÕ/MƠ HỒ): đáp số 1 giá trị · tập · biểu thức đóng một khuôn ⇒ làm được; ≤3 kết luận rời · Có/Không · nhiều bước lập luận ⇒ không ép vào MCQ nguyên câu (sang điền ô §4, hoặc hỏi Thùy).
6. **Hình học (`hinh_hoc_*`, cả Hình luyện) KHÔNG làm MCQ** (Thùy 13/11); bổ trợ Hình hiện đề, làm giấy, TA chấm Đ/C/S. **Hình giải tích (`hgt_*`) có MCQ.**
7. Mastery không đổi công thức: form TN chấm `correct`/`wrong` như TN thường (`spec-mastery`). Việc "MCQ có 25 % đoán ⇒ cân trọng số theo loại câu" — để sau, chưa ai chốt.

### 3.2 Dữ liệu

- **`<kho>_cau_form_tn`** (có ở `dai` · `hgt` · `hinh_hoc` · `khtn` · `vatly` · `hoahoc` · `tsa`): `ma_cau` · `lua_chon` jsonb (mảng 4 phần tử theo thứ tự hiện: `{text, dung}` hoặc `{text, dung:false, rule, duong_sai}`) · `dap_an` A–D · `key_gia_tri` (đáp số đã chuẩn hoá — nhân chứng thứ hai) · `nguon` (`ai`/`nguoi`) · `ai_model` · `sinh_at` · `da_duyet` · `duyet_boi` · `duyet_at` · `sua_truoc_duyet` · `tu_choi_boi` · `tu_choi_ly_do` · `xoa_at` · `kho`.
- **Một form hiệu lực / câu** (unique `ma_cau where xoa_at is null`, đã kiểm). Sinh lại = `xoa_at` bản cũ rồi chèn bản mới.
- Trigger `<kho>_cau_form_tn_kiem`: đúng 4 phương án, đúng 1 `dung`, `dap_an` khớp vị trí, không phương án trống, mọi phương án sai có `rule` tồn tại.
- **`<kho>_mcq_rule`**: `ma` (`R01…`) · `ten` · `mo_ta` · `vi_du` · `nhom` (`khai_niem` = sai quy tắc, dạy lại · `tinh` = tính ẩu) · `ap_dung` (danh sách KHUÔN gợi ý, không ràng buộc cứng) · `du_phong` · `active`. Đại: 505 rule, số lớn nhất R518, 79 dự phòng (17/11).

### 3.3 Quy trình sinh (mọi khối, mọi nhánh có MCQ)

**Đơn vị = dạng bài bản đồ mới** (Thùy 26/10): chọn câu theo dạng bài NDB qua view `bdm_cau_hoi`; câu Đại và HGT đi chung lô, mỗi câu tự mang `kho` ⇒ form ghi vào đúng `<kho>_cau_form_tn`, rule kiểm theo `<kho>_mcq_rule`. Cấp 1 (K3–5T, còn bản đồ cũ): `--dang <mã dạng cũ>`.

```
node scripts/mcq-sinh.mjs --list --dang NDB…[,NDB…] --n 100 --out pool.json     # hoặc --khoi 9 [--chu-de NCD…]
node scripts/mcq-auto.mjs pool.json --out kq.json                                 # --debug <ma_cau> soi 1 câu
node scripts/mcq-sinh.mjs --verify kq.json                                        # phải 0 FAIL
node scripts/mcq-sinh.mjs --ghi kq.json                                           # da_duyet=false, mỗi câu 1 transaction, câu đã có form ⇒ bỏ qua
```

- **Pool** = câu **đã `da_duyet`** (cửa 2 chỉ nhận câu qua cửa 1), có đáp số, chưa phải TN gốc (`lua_chon` và `menh_de` null), chưa có form. Clone chờ duyệt không vào pool (chưa nằm trong bảng câu) ⇒ **clone được duyệt trước, sinh MCQ sau**.
- **Khuôn đáp số** thay cho mã dạng trong các bảng dispatch của máy (`SPECIAL_DANG` · `TEXT_DANG` · `TEXT_FN` · `ANSWER_DANG` · `UU_TIEN` · `CHAM_LA_NHAN`, whitelist `KHUON_MAY_KY`): tra theo **khuôn của câu** ở bảng `<kho>_cau_khuon` (`dai_cau_khuon` 611 dòng, mig `202610261852`), đọc ở MỘT chỗ `scripts/lib/khuon-dap-so.mjs`. Khuôn ≠ dạng bài (một dạng bài có thể trộn nhiều khuôn). Câu số thuần chưa khuôn ⇒ `node scripts/kho-khuon-gan-may.mjs` gán khuôn `dap_so` (chạy thử ROLLBACK rồi `--ghi`, idempotent).
- **Chuẩn hoá đáp số trước khi sinh** (`parseHuuTi`): số nguyên · thập phân · phân số · dấu âm ở tử/mẫu · tập nghiệm ⇒ phân số tối giản `p/q` (q > 0) hoặc tập đã sắp, ghi `key_gia_tri`. Không parse được ⇒ loại khỏi lô, ghi lý do, **không đoán**.

**Mỗi dạng mới — 6 bước bắt buộc:** (1) đọc `loi_giai` thật của vài câu · (2) khảo sát hết sub-shape văn bản của dạng (`regexp_replace(noi_dung,'[0-9]+','#','g')` + đếm) · (3) liệt kê điểm rẽ có thể sai, đối chiếu rule đã có (trùng / thiếu / **đúng tên sai ngữ cảnh**) · (4) phân loại RÕ / MƠ HỒ (bảng dưới) — MƠ HỒ ⇒ trình Thùy ngắn gọn, chỉ code sau khi Thùy chốt · (5) không ghi form nào trước khi verify 0 FAIL · (6) kiểm `lua_chon`/`menh_de` trước — nhiều dạng "tưởng cần convert" đã là TN gốc.

| Hình dạng đáp số | Phân loại |
|---|---|
| 1 giá trị hữu tỉ | RÕ |
| Tập hữu hạn / khoảng liệt kê rõ | RÕ (`TEXT_DANG`) |
| Biểu thức / công thức đóng một khuôn | RÕ — nhưng phải khảo sát hết sub-shape (dễ trộn nhiều khuôn ⇒ MƠ HỒ) |
| ≤ 3 kết luận rời (A<B / A>B / A=B) | MƠ HỒ — không đủ 4 phương án phân biệt thật |
| Có / Không kiểu chứng minh Đúng–Sai | MƠ HỒ — hỏi trước (có thể cần 4 mệnh đề, 4 lý do) |
| Nhiều bước lập luận (chứng minh, toán thực tế, GTLN–GTNN, tìm 2 số…) | Không MCQ nguyên câu ⇒ điền ô (§4) |

**Luật sinh** (đưa vào prompt / code): 3 phương án sai = **3 rule KHÁC nhau**, ưu tiên rule có trong `ap_dung` của khuôn · **cùng hình thức** với đáp án đúng — đáp án đúng không được là kiểu duy nhất, ≥ 1 phương án sai cùng kiểu (nới từ "cả 4 cùng kiểu", 08/09) · câu 2 nghiệm ⇒ cả 4 là tập 2 giá trị · **cấm giá trị tương đương đáp án** làm phương án sai (`4/8` vs `1/2`, `0,5` vs `1/2`) · thiếu rule khái niệm ⇒ tối đa **1** rule dự phòng; vẫn thiếu ⇒ bỏ câu kèm lý do · vị trí đúng cân A/B/C/D trong lô · `duong_sai` một câu, TA đọc hiểu trong 3 giây.

**Verify (máy, deterministic, không AI):** 4 phương án · 1 đúng khớp `dap_an` · `parse(text đúng) == key_gia_tri` (AI không tự đổi đáp án) · 4 giá trị khác nhau đôi một **sau chuẩn hoá** · 3 rule tồn tại, `active`, khác nhau, ≤ 1 dự phòng · luật hình thức · phân bố `dap_an` cả lô không chữ nào > 40 %. Soát lại lô cũ: `--verify kq.json --ca-form-da-co` (chỉ đọc).

**Rule mới:** mã tăng dần, **lấy số lớn nhất bằng ép kiểu số** `select max((regexp_replace(ma,'[^0-9]','','g'))::int) from <kho>_mcq_rule` (so chuỗi thì `'R100' < 'R99'` — đã đè 5 rule ngày 12/09, mig `202609121531`) · **mọi INSERT/UPDATE bảng rule đi qua migration có sổ**, không ghi tay · migration rule phải áp TRƯỚC khi chạy verify · thử vài giá trị trước khi đăng ký rule "mới" (hai rule tên khác có thể luôn ra cùng công thức) · `du_phong` chỉ cho rule thật sự cứu vãn; tỉ lệ "thiếu distractor" > 20–30 % ⇒ debug một câu bỏ, thêm 1–2 rule dự phòng luôn tính được.

**Bẫy đã dính (giữ để khỏi tái phạm):** kho bọc `$…$` quanh từng cụm, không quanh cả câu — regex nối cụm phải cho `\$?` ở ranh giới · regex lệch trả `null` âm thầm ⇒ luôn thử `.match()` trên chuỗi thật lấy từ DB · `TEXT_DANG`/`TEXT_FN` định nghĩa lặp ở `mcq-auto.mjs` và `mcq-sinh.mjs` — sửa CẢ HAI · dạng trộn sub-shape: `textFn` trả `null` thì rơi xuống nhánh `parseHuuTi`/`SPECIAL_DANG`/AST, `mcq-sinh` phân biệt bằng chữ ký trong chính đáp số kho (`laHinhThucText`) · `parseHuuTi` là cổng chung — "đáp số kho không parse" = tín hiệu dạng cần `TEXT_DANG`.

Hai luồng song song dùng chung `<kho>_mcq_rule`, `mcq-auto.mjs`, `mcq-sinh.mjs`, `lib/mini-dang.mjs` ⇒ đọc diff trước khi gộp; trạng thái "dạng nào đã làm" ghi ở DEVLOG/HANDOFF, không ghi ở spec.

### 3.4 Duyệt (cửa 2)

- Màn "Duyệt lời giải AI" › tab **"Trắc nghiệm AI"**: đề · 4 phương án (đúng tô xanh, sai kèm rule + đường sai). **Duyệt** (`fn_mcq_form_duyet`) · **Sửa rồi duyệt** (tự đặt `sua_truoc_duyet` khi lựa chọn khác bản sinh) · **Duyệt lô** (`fn_mcq_form_duyet_batch`) · **Từ chối** có lý do bắt buộc (`fn_mcq_form_tu_choi` ⇒ `xoa_at` + `tu_choi_boi`, câu về pool để sinh lại).
- Người duyệt: TA/GV môn (Delegation — cấp thấp nhất làm được).
- Metric `fn_mcq_metric(p_kho, p_tu, p_den)`: precision = duyệt không sửa / (duyệt + từ chối thật) · tỉ lệ sửa · lý do từ chối · phân bố vị trí đúng · **độ lừa** (form có ≥ 30 lượt làm: số HS chọn từng phương án — phương án sai không ai chọn = không đo gì, sinh lại). Từ chối thật = có người + lý do; xoá-để-sinh-lại không tính.

### 3.5 Tiêu thụ

- **Snapshot** `_kho_snapshot_cau` (mọi đường chọn câu gọi vào: tự luyện, bổ trợ, bù, đuổi, đề thi, ôn thi…): câu có form TN **đã duyệt** ⇒ chụp `loai_cau='trac_nghiem'`, `lua_chon` = 4 text, `dap_an_key` = chữ cái, `form_tn_id` (Đại) / `form_tn_hgt_id` (HGT), `lua_chon_rule` (mảng song song: `null` = đúng, mã rule = sai). Ngoại lệ: cờ giao dịch `bk.snap_khong_form = '1'` ⇒ chụp đúng loại gốc (bổ trợ sau giờ cấp 1–2).
- `lua_chon_rule` song song theo vị trí là ngoại lệ có chủ ý của luật "danh tính bám khoá tự nhiên": hai cột ghi trong **cùng một INSERT**, không bao giờ sửa riêng, `form_tn_id` giữ đường về bản gốc.
- **ET / BTVN online và in:** mặc định form của câu không đổi (0 regression tài liệu cũ); GV chọn form `trac_nghiem` thì kéo lựa chọn từ form TN đã duyệt. MT đọc form TN đã duyệt (`MTScreen.tsx`).
- **Lỗi của HS:** view `v_mcq_loi_hs` (lựa chọn sai ⇒ `lua_chon_rule[dap_an_hs + 1]`) · `fn_mcq_loi_theo_hs(hs, môn)` · `fn_mcq_loi_theo_dang(mã dạng)`. Không thêm cột vào `bai_lam_cau`.
- Đếm 17/11: 65.504 câu đã giao dùng form TN Đại, 28 câu dùng form HGT.

### 3.6 Luật CHỌN CÂU cho HS và bổ trợ — MỘT nguồn

| Hàm | Điều kiện |
|---|---|
| `_kho_dk_mcq_sql(bảng)` | `kho_chuan` **và** `_kho_dk_du_hinh_sql()` **và** (TN gốc có đáp án **hoặc** có form TN đã duyệt, chưa rác) |
| `_kho_dk_tln_sql()` | `kho_chuan` **và** đủ hình **và** `loai_cau='tra_loi_ngan'` có đáp án |
| `_btyeu_dk_dang_sql(bảng, dạng)` | dạng có ≥ 1 câu thoả `_kho_dk_mcq_sql` ⇒ chỉ MCQ; **cả dạng 0 MCQ ⇒ TLN có đáp án** |
| `_btyeu_chon_cau(bảng, dạng, cụm, trừ[], n)` | ngẫu nhiên theo điều kiện trên, ưu tiên câu chưa gặp; cạn thì lặp câu đã làm |

- **Luật (Thùy 10/10 — thay "MCQ tuyệt đối" 20/09 và "TLN chỉ mức 4–5" 28/09): MCQ TRƯỚC; cả dạng 0 MCQ ⇒ câu TRẢ LỜI NGẮN có đáp án, mọi mức độ.** Áp cho bổ trợ yếu (luyện · test · phiếu giấy — TA chấm Đ/S câu TLN trên giấy) và bù (`tu_luyen_chu_de_sinh` loại `bu_luyen` / `bu_test`). Dạng không có cả MCQ lẫn TLN ⇒ app báo rõ, em học trên giấy.
- **Luồng bổ trợ mới PHẢI đi qua `_btyeu_chon_cau` / `_kho_dk_mcq_sql`**, không viết điều kiện chọn câu riêng.
- **Ngoại lệ có chủ ý — bổ trợ sau giờ (Thùy 12/11, `spec-bo-tro` §5, mig `202611121657`):** bài in giấy cấp 1–2 (khối 3–9) chọn **tự luận + TLN ngang hàng, hết mới TN, không hiện form TN** (`_btnhe_chon_cau` / `_btnhe_chon_loai` + `bk.snap_khong_form`); cấp 3 (10–12) TN trước. **CTO phân xử 17/11:** luật 10/10 là luật chung cho bài làm TRÊN APP; ngoại lệ 12/11 chỉ cho bài IN GIẤY sau giờ — hai luật không đè nhau.
- **Hình:** không MCQ (§3.1 mục 6) ⇒ bổ trợ Hình hiện đề, làm giấy, TA chấm Đ/C/S.

## 4. Form ĐIỀN Ô (trắc nghiệm từng phần)

### 4.1 Luật (Thùy 09/09, còn hiệu lực)

- Câu tự luận nhiều bước ⇒ hiện **lời giải chi tiết**, bỏ trống một số chỗ quan trọng, mỗi chỗ **4 phương án**. Tên lý thuyết: *completion problems / faded worked examples* (Sweller, Renkl); với chứng minh: *Proof Blocks*.
- **Đo theo CÂU:** đúng hết ô = **Đ** · sai quá 60 % ô = **S** · còn lại **C**. Một nguồn công thức: `fn_dien_cham(key, hs)` (đúng × 10 < tổng × 4 ⇒ `wrong`). Log theo ô chỉ để chẩn đoán (`v_dien_loi_hs`).
- **Đến ô nào hiện đúng/sai ô đó** (kèm đáp án đúng) rồi mới mở ô sau; xong bài đọc lời giải đầy đủ (không có đường sai). ET chế độ thi: chọn hết mới nộp, không hiện từng ô.
- **"Trắc nghiệm từng phần" = Phase 2 của điền ô**, không phải spec riêng; ô "giá trị" dùng LẠI bảng rule `<kho>_mcq_rule` của MCQ — một kho rule cho hai form.
- **Thứ tự xây theo độ dễ:** câu dễ trắc nghiệm ⇒ MCQ trước; câu khó trắc nghiệm ⇒ điền ô trước.

### 4.2 Phase 1 — chứng minh Hình: ĐÃ CHẠY

- **Đơn vị** = bước chứng minh "KẾT LUẬN (LÝ DO)". Mỗi bước đục **một trong hai**: ô kết luận (sai = cùng hình thức, khác nội dung, lấy từ chính hình) hoặc ô lý do (key = mã `LD01–LD52` trong `scripts/mcq-lo/hinh-ly-do-catalog.json`, sai = 3 mã cùng nhóm). Nhãn lỗi chứng minh E01–E05. Lý do ngoài danh mục ⇒ đề xuất mục mới, không tự do.
- **Chỉ đục PHẦN GIỮA** (suy từ giả thiết, vận dụng biến đổi); không đục mở đầu (chép giả thiết, "theo câu trên") và kết (đpcm). **Mật độ: 4–5 dòng một ô, tối đa 4 ô / bài** (bài ≤ 3 bước suy luận: 1–2 ô).
- Claude đề xuất (`scripts/hinh-dien.mjs --list/--verify/--ghi`), máy kiểm cấu trúc (key có nguyên văn trong lời giải theo văn bản + lần xuất hiện, sai ≠ key, mã LD tồn tại), người duyệt 100 % (`fn_dien_form_duyet`).
- Bảng `hinh_form_dien` (khoá `cach_giai_id` hoặc `bien_the_id` — kho Hình cũ không có `ma_cau`) · 23 form đã duyệt (pilot khối 7) · HS luyện ở "Luyện chứng minh" (`tu_luyen_dien_sinh` → `hs_dien_tra_loi` → `fn_dien_cham`; `DienOCau.tsx`) · snapshot `bai_test_cau.loai_cau='dien_o'` + `dien` (đã lược key) + `form_dien_id` + `o_rule` · 87 câu đã giao (17/11).

### 4.3 Phase 2 — câu tính toán Đại: ĐÃ SINH, CHƯA DÙNG ĐƯỢC

- **Ô = một số ở bước k là giá trị một phép tính con (không phải lá) ở bước k−1**; tách bước theo dấu `=` (tìm x: mỗi dòng `x = …`). Ba loại ô: **giá trị** (máy 100 %, phương án sai = rule áp lên đúng biểu thức con) · **biểu thức sau chuyển vế** (máy, R19/R20) · **lý do** (AI đề xuất, người duyệt).
- Chọn ô (máy chấm điểm): tại đó ≥ 2 rule cho giá trị khác nhau · không suy ra được từ xung quanh (bỏ ô rút gọn thuần, bỏ ô trùng giá trị) · ưu tiên rule thuộc `ap_dung` · ô đáp số cuối chỉ lấy khi còn chỗ · luật hình thức như MCQ.
- Lời giải sai ở bước giữa ⇒ chuỗi không nhất quán ⇒ bỏ câu, đẩy về kho sửa lời giải; **không đục lỗ trên lời giải sai**.
- **Hiện trạng 17/11 (khác `spec-mcq-tung-phan` 12/09 nói "chưa xây" — §8 L1):** ĐÃ CÓ `scripts/mcq-dien.mjs` (`--sinh/--verify/--xem/--ghi`, khuôn theo dạng `KHUON`) · bảng `dai_cau_form_dien` (mig `202609121423`: `ma_cau` · `loi_giai_bam` md5 · `buoc` · `o` · duyệt/từ chối/rác; trigger kiểm **2–8 ô** "lưu hết ứng viên, giao bài chọn 3"; trigger `dai_cau_form_dien_thu_hoi` trên `dai_cau_hoi` tự thu hồi khi lời giải/đáp án đổi) · **449 form sinh 12–13/09: 366 chờ, 83 rác, 0 duyệt**. CHƯA CÓ: hàm duyệt cho Đại (`fn_dien_form_duyet` chỉ đọc `hinh_form_dien`) · đường giao bài (`bai_test_cau.form_dien_id` FK chỉ trỏ `hinh_form_dien`; `tu_luyen_dien_sinh` chỉ lấy Hình) · `fn_chon_form`.
- Hàng đợi dạng gợi ý (đã xác nhận không hợp MCQ nguyên câu, 12/09): K6 `T106030401` Tìm n để an+b ⋮ cn+d · `T106020601` dãy luỹ thừa · `T106020304` toán thực tế · K7 `T107010205` toán thực tế · `077022220401` / `0770222204220402` GTLN–GTNN · nhóm dãy phân số `T107010501–508` (chưa khảo sát) · Có/Không chia hết `T106030102` / `T106030403` (có thể cần ô lý do). Mã dạng cũ — đổi sang dạng bài NDB khi làm tiếp.

### 4.4 Chọn form cho HS — Ý ĐỊNH, chưa xây

`fn_chon_form(hs, dạng, câu)` trả form + lý do (ghi `bai_test_cau.form_ly_do`): dạng đang yếu và có ĐIỀN ⇒ ĐIỀN ("đỡ từng bước") · lần trước làm ĐIỀN cùng dạng đạt Đ ⇒ TN ("bỏ đỡ") · có TN ⇒ TN · có ĐIỀN ⇒ ĐIỀN · không có form ⇒ loại gốc. Giai đoạn đầu không đẩy TLN/tự luận khi có form khác. Metric "HS thích làm": tỉ lệ bỏ dở + thời gian/câu theo form. **Hàm chưa tồn tại trong DB** (§8 L9).

## 5. Clone câu

- **Đích:** đủ câu cho mỗi dạng (mốc tối thiểu 60 câu/dạng ở pool MCQ đầu) mà **giữ nguyên cấu trúc phép tính** ⇒ rule lỗi vẫn áp y hệt.
- **Luồng hàng đợi (Thùy 08/09 — "luồng 2" của Claude Code):** nhân sự bấm "✨ Clone → đưa vào hàng đợi" ⇒ `dai_cau_hoi_yeu_cau_clone` (`ma_cau_goc` · `so_bien_the` · `ghi_chu` · `xu_ly_at` null = treo) ⇒ `node scripts/hangdoi-clone.mjs --list` ⇒ Claude sinh biến thể ⇒ `--ghi` vào **bảng NHÁP** `dai_cau_hoi_clone_cho_duyet` (`parent_ma_cau`, `clone_method='claude_code_batch'`) + đóng yêu cầu ⇒ người duyệt ở ERP (Bản đồ kiến thức › Đại › "Câu chờ duyệt") mới đưa vào kho. Lệnh phụ: `--bo <id> "<lý do>"` · `--don` (gốc đã xoá) · `--tu-kiem` (ROLLBACK).
- **Luật cứng ở code** (không tin prompt): gốc có `anh_de` ⇒ không clone (hình lệch số) · gốc Đ/S / có `menh_de` ⇒ không clone (bảng nháp không có mệnh đề) · biến thể thiếu đề / lời giải ⇒ bỏ · TN phải đúng 4 phương án + `dap_an` A–D · không vượt `so_bien_the` · không trùng gốc, không trùng nhau.
- **Luật sinh biến thể:** GIỮ cấu trúc câu, phương pháp, **số bước và thứ tự bước** — lời giải biến thể song ánh từng bước với gốc, chỉ khác con số / tên / bối cảnh · cấm thêm/bớt bước, đổi cách giải, thêm dữ kiện · kết quả **đẹp, cùng độ khó, cùng độ lớn**, giữ "thiết kế" của gốc (phân số chưa tối giản để rút gọn…) · `ghi_chu` người đặt = ràng buộc cứng · TN: phương án sai là lỗi HS hay mắc · trình bày như `mau_tham_khao` và §A5 `spec-giai-bai`.
- **Tự kiểm từng biến thể:** giải lại độc lập từ đề biến thể ⇒ khớp `dap_an`; đối chiếu số bước với gốc; không đạt ⇒ sinh lại, vẫn không đạt ⇒ bớt biến thể hoặc `--bo`. **Đáp số clone phải có nhân chứng thứ hai** (máy hoặc Opus) — bài học 08/11: 49/488 câu clone phân tích đa thức sai đáp số (`spec-giai-bai` Phần D, §C6.2).
- **Clone cho MCQ:** clone phải được duyệt trước, mới sinh form (§3.3).
- **Ranh giới:** script chỉ ghi bảng nháp, không ghi thẳng `dai_cau_hoi`, không sửa gốc, không tự duyệt. Hàng đợi chỉ có cho Đại; HGT / KHTN chưa có.
- **Hiện trạng 17/11:** 937 yêu cầu (3 treo) · **5.665 dòng nháp chờ, 0 đã duyệt, 0 từ chối** (mới nhất 09/11) · trong kho có 15.305 câu Đại là clone (`manual_gemini` 14.750 · `may_sinh_theo_mau` 395 · `clone_doi_so` 96 · `claude_may_sinh` 64). Duyệt nháp ở client (`duyetCloneChoDuyet`): cấp mã ở client, chèn `da_duyet=true`, xoá dòng nháp — §8 L6.

## 6. Báo sai · sửa · xoá

- **HS báo sai câu** (nút "🚩 Em nghĩ đề hoặc đáp án sai", dùng chung cho TN / điền ô): `fn_hs_bao_loi_cau(bai_test_cau_id, lý do, ghi chú)` ⇒ `bai_cau_bao_loi` (HS · môn · `ma_cau` · lý do ∈ `thieu_du_kien` · `hinh_loi` · `cong_thuc_loi` · `dap_an_sai` · `loi_giai_sai` · `khac` (bắt buộc ghi chú ≥ 5 chữ) · trạng thái `moi` → `da_xu_ly` / `khong_loi`). Tối đa **10 báo cáo / HS / ngày** (Thùy 10/10); một HS báo trùng câu + lý do khi còn `moi` ⇒ gộp. Staff xem `fn_bao_loi_cau_ds`, xử lý `fn_bao_loi_cau_xu_ly` (quyền `bdkt`). Đếm 17/11: 118 báo cáo, toàn môn Toán (84 `moi`). Góp ý / báo lỗi app chung là bảng khác (`bao_loi`) — không thuộc spec này.
- **Hậu kiểm:** câu bị báo đúng là lỗi ⇒ sửa hoặc xoá + **một dòng Phần D `spec-giai-bai`** (sai gì · lọt trạm nào · luật rút ra · có quét câu cùng loại không). Lỗi cùng kiểu ≥ 3 câu ⇒ sửa luật, quét lại, không vá từng câu.
- **Sửa câu:** mọi thay đổi đề / đáp án / lời giải / hình tự vào `kho_sua_log` (trigger). **Sửa đáp số hoặc lời giải ⇒ form của câu phải thu hồi để sinh lại** (spec-kho-chuan §3, spec-dien-o §3): điền ô Đại tự thu hồi bằng trigger; **form TN chưa có trigger** (§8 L3). AI/máy không sửa đáp số kho, chỉ báo `nghi`.
- **Xoá = kho rác** (`xoa_at`), **cấm xoá cứng** — câu được tham chiếu bằng text `ma_cau` ở `bai_test_cau`, đề, builder, lịch sử đo ⇒ xoá cứng làm các chỗ resolve rụng im lặng (CLAUDE §2). Khôi phục = đặt `xoa_at` về null (log `khoi_phuc`). Mã đã vào rác không cấp lại. Hình còn thêm `rut_khoi_kho` (giữ câu, rút khỏi kho).
- Đổi dạng sau khi câu đã dùng không phá gì: lịch sử đo chụp `ma_dang` vào `bai_test_cau`, form khoá `ma_cau`, đo đi theo dạng hiện tại của câu (`spec-mastery` §3).

## 7. Bảng & hàm (bản đồ code)

| Phần | DB | Script / client |
|---|---|---|
| Câu | `<kho>_cau_hoi` · `<kho>_cau_menh_de` · views `v_kho_cau_hoi` · `bdm_cau_hoi` · `hmh_cau_hoi` · registry `_kho_cau_tbl` | `src/lib/kho/api.ts` · `scripts/_kho_insert.mjs` |
| Vết | `kho_sua_log` (`_trg_log_kho_sua`) · `kho_doi_dang_log` (`_trg_log_doi_dang`) · `kho_cau_log` (`log_kho_cau`) | — |
| Vào kho | `_kho_cau_chuan` · `_kho_ngay_bat` · cột `kho_chuan` · `_kho_cau_duyet_nguon` · `_trg_chan_duyet_dang_cho` · `_kho_la_dang_cho` · `_bdm_tu_duyet_sau_gan` · `_bdm_du_dap_an` · `_tl_hh_cau_chuan` (Hình) | `scripts/kho-quet-dapso.mjs` · `kho-rules/dai/lo/k12-de/nhtp-sach/duyet-cao-moi-khoi.mjs` (vá tồn đọng) |
| Chọn câu | `_kho_dk_online_hs_sql` · `_kho_dk_mcq_sql` · `_kho_dk_tln_sql` · `_kho_dk_du_hinh_sql` · `_btyeu_dk_dang_sql` · `_btyeu_chon_cau` · `_btnhe_chon_cau` / `_btnhe_chon_loai` · `_kho_form_tn_cua` | — |
| Snapshot | `_kho_snapshot_cau` · `bai_test_cau` (`form_tn_id` · `form_tn_hgt_id` · `lua_chon_rule` · `dien` · `form_dien_id` · `o_rule`) | `src/lib/testonline.ts` |
| MCQ | `<kho>_cau_form_tn` (+ trigger `_kiem`) · `<kho>_mcq_rule` · `<kho>_cau_khuon` · `_kho_form_tn_tbl` · `fn_mcq_form_duyet` / `_batch` / `_tu_choi` · `fn_mcq_metric` · `v_mcq_loi_hs` · `fn_mcq_loi_theo_hs` / `_dang` | `scripts/mcq-sinh.mjs` · `mcq-auto.mjs` · `lib/mini-dang.mjs` · `lib/khuon-dap-so.mjs` · `kho-khuon-gan-may.mjs` · `mcq-xem.mjs` · trang duyệt `kho-rules/dai/lo/mcq-bdm/build-duyet.mjs` · tab Trắc nghiệm AI |
| Điền ô | `hinh_form_dien` · `dai_cau_form_dien` (+ trigger kiểm, thu hồi) · `_kho_form_dien_tbl` · `fn_dien_cham` · `fn_dien_form_duyet` (Hình) · `tu_luyen_dien_sinh` · `hs_dien_tra_loi` · `v_dien_loi_hs` | `scripts/hinh-dien.mjs` · `mcq-dien.mjs` · `lib/dien-buoc.mjs` · `lib/dien-khuon-*.mjs` · `_do_dien_o.mjs` · `src/screens/hocsinh/DienOCau.tsx` · `src/lib/tuluyen.ts` |
| Clone | `dai_cau_hoi_yeu_cau_clone` · `dai_cau_hoi_clone_cho_duyet` | `scripts/hangdoi-clone.mjs` · `mcq-clone-doi-so.mjs` · `clone-batch-lap.mjs` · `api.ts` (`saveCloneChoDuyet` · `duyetCloneChoDuyet` · `tuChoiCloneChoDuyet`) |
| Báo sai | `bai_cau_bao_loi` · `fn_hs_bao_loi_cau` · `fn_bao_loi_cau_ds` · `fn_bao_loi_cau_xu_ly` | — |

## 8. Chờ Thùy quyết / lệch phát hiện (17/11)

| # | Lệch | Bằng chứng | Đề xuất CTO |
|---|---|---|---|
| L1 | `spec-mcq-tung-phan` / `spec-mcq-quy-trinh-sinh` §8 ghi điền ô Đại "chưa xây, bảng chưa tồn tại" — thực tế đã sinh nhưng bỏ dở giữa chừng | `dai_cau_form_dien` có 449 form (366 chờ · 83 rác · 0 duyệt), sinh 12–13/09; `fn_dien_form_duyet` chỉ đọc `hinh_form_dien`; FK `bai_test_cau.form_dien_id` → `hinh_form_dien`; `tu_luyen_dien_sinh` không đọc bảng Đại | **Q1** |
| L2 | Hình tính kho chuẩn bằng công thức riêng, không có mốc ngày bật ⇒ câu Hình mới chưa duyệt vẫn "vào kho" | cột generated `hinh_hoc_cau_hoi.kho_chuan = (not rut_khoi_kho) and (da_duyet or kiem_may <> 'nghi')`; **3.692 câu** Hình tạo sau 08/09 chưa duyệt mà `kho_chuan = true`; `_kho_dk_mcq_sql` / `_kho_dk_tln_sql` đọc thẳng cột này (riêng `_tl_hh_cau_chuan` có gọi thêm `_kho_cau_chuan`) | **Q2** |
| L3 | Sửa đáp số không thu hồi form TN (spec-kho-chuan §3 + spec-dien-o §3 nói phải thu hồi) | không có trigger thu hồi trên `dai_cau_hoi` cho `dai_cau_form_tn` (chỉ có cho điền ô); **13 form TN Đại còn hiệu lực (9 đã duyệt)** mà `kho_sua_log` có lần sửa `dap_an` sau `sinh_at` | Thêm trigger như điền ô (CTO làm khi có lệnh); 13 form này cần người soát — **Q3** |
| L4 | Câu vào rác không kéo form theo | 108 form TN Đại đã duyệt, còn hiệu lực, trên câu `xoa_at` khác null. Vô hại cho HS (chọn câu lọc `c.xoa_at`) nhưng làm lệch metric | gộp vào trigger L3 (kỹ thuật) |
| L5 | Form TN Hình tồn tại trái quyết 13/11 "Hình không làm MCQ" | `hinh_hoc_cau_form_tn`: 25 chờ + 11 rác (sinh 14/10 → 13/11); `_kho_form_tn_cua('hinh_hoc_cau_hoi')` có bảng ⇒ ai bấm duyệt là câu Hình thành MCQ trên app | **Q4** (đưa 25 form vào rác — cần gật theo Luật xoá) |
| L6 | Bảng nháp clone không ai duyệt; spec-kho-chuan bước 5 ("bỏ bảng nháp, clone ghi thẳng `da_duyet=false`, một hàng đợi") chưa làm | 5.665 nháp chờ, 0 duyệt / 0 từ chối từ trước tới nay; `duyetCloneChoDuyet` cấp mã ở client, chèn thẳng `da_duyet=true`, rồi DELETE dòng nháp (trái CLAUDE §2.0 và không có nhân chứng thứ hai §C6.2) | **Q5** |
| L7 | Mã câu cấp ở client không khoá | `nextCauSeq` (`api.ts`) chỉ quét câu đang có `dang_chinh` = dạng đó ⇒ câu đã đổi dạng đi nhưng giữ tiền tố không được tính ⇒ có thể va PK (lỗi to, không hỏng âm thầm); script `_kho_insert.mjs` thì có khoá advisory + quét theo tiền tố | Kỹ thuật: chuyển cấp mã xuống một hàm DB dùng chung (CTO làm khi có lệnh) |
| L8 | Lỗi HS theo rule chỉ đọc kho Đại (vỡ symmetry) | `fn_mcq_loi_theo_hs` / `_dang` join cứng `dai_mcq_rule`; form HGT đã giao 28 câu ⇒ rule HGT không ra tên | Kỹ thuật |
| L9 | Logic chọn form (spec-dien-o §7) chưa có | `fn_chon_form` không tồn tại | Đi cùng Q1 |
| L10 | Số ô điền | spec: 2–3 ô (Hình: tối đa 4); trigger `dai_cau_form_dien_kiem`: 2–8 ô "lưu hết ứng viên, giao bài mới chọn 3" | Chấp nhận (lưu ứng viên ≠ số ô giao) nếu Q1 làm tiếp |
| L11 | Thiếu ràng buộc | `loai_cau` không có CHECK ở `dai/hgt/khtn/hinh_hoc_cau_hoi` (CLAUDE §2.1); `hinh_hoc_cau_hoi` không có trigger `kho_sua_log` / `kho_cau_log` / `duyet_nguon` (290 câu Hình đã duyệt có `duyet_nguon` null) | Kỹ thuật |
| L12 | Form TN chờ không có người duyệt | KHTN 757 · TSA 181 · HGT 364 · Đại 6.747 form chờ; KHTN + TSA 0 form đã duyệt | **Q7** |
| L13 | Tài liệu cũ | spec-mcq-quy-trinh-sinh §6 ghi bảng khuôn "nháp chờ Thùy duyệt" — đã áp (mig `202610261852`, `dai_cau_khuon` 611 dòng); `fn_mcq_form_duyet` nhận người duyệt từ tham số, không kiểm `jwt_uid()` | Kỹ thuật |

**Câu hỏi cho Thùy:**
- **Q1.** Điền ô Đại (449 form, 0 duyệt, bỏ từ 13/09): làm tiếp (hàm duyệt + giao bài + `fn_chon_form`) hay đóng băng và ghi rõ "chỉ Hình chứng minh có điền ô"?
- **Q2.** Câu Hình mới chưa duyệt có được vào bài HS không? Nếu không ⇒ đổi công thức `kho_chuan` của Hình về `_kho_cau_chuan` (3.692 câu sẽ rời kho tới khi được duyệt).
- **Q3.** Sửa đáp số ⇒ tự thu hồi form TN (như điền ô) — bật không? 13 form đang lệch ai soát?
- **Q4.** 25 form TN Hình đang chờ: đưa vào rác (`xoa_at`) không?
- **Q5.** Clone: giữ bảng nháp (5.665 dòng chờ — ai duyệt?) hay làm bước 5 spec-kho-chuan: clone ghi thẳng vào kho `da_duyet=false`, đi chung một hàng duyệt, và đáp số clone phải có nhân chứng máy/Opus trước khi duyệt?
- **Q6.** Quét kho cũ còn 353 câu Đại + 1 HGT "tạm dùng": bỏ hẳn vế "câu cũ tạm dùng" (kho chuẩn = `da_duyet` thuần) lúc nào?
- **Q7.** Ai duyệt form TN KHTN / TSA / HGT (đang tồn 1.302 form), có cho máy ký (`duyet_nguon` kiểu `may`) khi verify 0 FAIL + độ lừa đủ không?

## 9. Lịch sử quyết định

| Ngày | Ai chốt | Nội dung |
|---|---|---|
| 08/09 | Thùy | MCQ ưu tiên trước TLN; MCQ là form THÊM, không đổ `lua_chon` vào gốc; pool 1 = lớp 7 Số hữu tỉ; duyệt 100 % pool 1; clone thêm cho đa dạng |
| 08/09 | Thùy | Không hiện `duong_sai` cho HS |
| 08/09 | Thùy | Hai luồng Claude Code: (1) giải câu chưa có đáp án, (2) clone câu đã đặt hàng |
| 09/09 | Thùy | KHO CHUẨN: quét cả kho, từ nay câu mới phải duyệt mới được dùng; 2 cửa duyệt (câu · form) |
| 09/09 | Thùy | Lời giải do Claude Code ghi phải duyệt (Gemini tạm dùng) — mig `202609091448` |
| 09/09 | Thùy | Form ĐIỀN Ô: đo theo câu Đ/C/S; hiện đúng/sai từng ô; tách bước theo `=`; Phase 1 = chứng minh; chỉ đục phần giữa; 4–5 dòng một ô, tối đa 4 ô |
| 12/09 | Thùy | Tách 2 luồng MCQ (khối 8–9 · khối 6–7); dạng nhiều bước không ép MCQ — "trắc nghiệm từng phần" = Phase 2 điền ô |
| 19/09 | Thùy | Mọi luồng bài làm trên app của bổ trợ chỉ dùng MCQ (`_kho_dk_mcq_sql`) |
| 20/09 | Thùy | MCQ "tuyệt đối" ở bổ trợ — **đã bị thay** |
| 28/09 | Thùy | Cho TLN khi dạng không có MCQ, chỉ mức 4–5 — **đã bị thay** |
| 02/10 | Thùy | HS chỉ nhận câu trong kho chuẩn, mọi môn (`_kho_dk_online_hs_sql`) |
| 10/10 | Thùy | **MCQ TRƯỚC; cả dạng 0 MCQ ⇒ TLN có đáp án, mọi mức độ** (thay 20/09 và 28/09); HS báo sai tối đa 10 câu/ngày |
| 26/10 | Thùy | Pipeline MCQ chuyển hẳn sang dạng bài bản đồ mới; khuôn đáp số thay mã dạng trong dispatch máy |
| 05/11 | Thùy | Gán dạng bài mức cao (nguồn AI) ⇒ DB tự duyệt nếu đủ đáp án (`_bdm_tu_duyet_sau_gan`) |
| 08/11 | (hậu kiểm) | 49/488 câu clone sai đáp số ⇒ mọi đáp số phải có nhân chứng máy hoặc Opus |
| 12/11 | Thùy | Bổ trợ sau giờ in giấy cấp 1–2: tự luận + TLN ngang hàng, không hiện form TN; cấp 3 TN trước |
| 13/11 | Thùy | Hình học không làm MCQ; chỉ Hình giải tích có MCQ |
| 17/11 | CTO phân xử | Luật 10/10 = bài trên app; ngoại lệ 12/11 = bài in giấy sau giờ; hai luật cùng hiệu lực |
