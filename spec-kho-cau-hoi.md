# spec-kho-cau-hoi.md — KHO CÂU HỎI: đưa câu vào kho (ảnh · tài liệu · đề thi) · clone · quy chuẩn hiển thị · vẽ lại hình · một câu gồm gì · trắc nghiệm · điền ô · báo sai (spec #3 của bộ 20 spec)

> **Trạng thái: THÙY CHỐT 17/11/2026** ("Chốt theo đề xuất" Q1–Q13, bảng cuối §8). Spec này là nguồn đúng; nguồn đã gộp trọn chuyển `_luu-tru/` (còn ở gốc: `spec-kho-chuan.md` phần quy trình duyệt → chờ #5 · `spec-de-thi.md` đã lưu trữ 17/11 (phần màn → `spec-builder.md` §8)).
> **Gộp từ:** `spec-mcq-form.md` · `spec-mcq-quy-trinh-sinh.md` · `spec-mcq-tung-phan.md` · `spec-dien-o.md` · `spec-clone-ai.md` · `spec-kho-chuan.md` (phần định nghĩa "câu vào kho") ·
> **lượt 2 (17/11, Thùy định lại phạm vi: "Cách nhập kho từ ảnh, cách nhập kho từ đề thi, clone kho, quy chuẩn hiển thị trong kho, vẽ lại hình của kho…"):**
> `spec-de-thi.md` (phần bóc câu + lưu cấu trúc đề) · `spec-format-noidung.md` (phần hiển thị câu / lời giải) · `.claude/commands/nhap-kho.md` · `.claude/commands/nhap-de-thi.md` (thao tác máy — giữ tại chỗ, spec này trỏ) · đầu tệp các script `scripts/anh/*` · `scripts/kho/*` · `scripts/nhap_kho.mjs`.
> Đọc thêm để trỏ (không chép): CLAUDE.md §1.5 · §1.6 · §2 (mã gốc bất biến, kho rác) · `spec-bo-tro.md` §1, §4–§6 · `spec-giai-bai.md` §A5, §A8, §A11, §A17, Phần B › Hình › "Vẽ hình", Phần C, Phần D.
> **Đối chiếu DB ngày 17/11/2026** (chỉ đọc: `information_schema`, `pg_get_functiondef`, `pg_trigger`, đếm dòng). Chỗ DB/code lệch spec cũ ⇒ không sửa, ghi ở §8.
> Nhãn **"CTO phân xử 17/11"** = các file cũ nói ngược nhau, Claude chọn theo quyết định mới nhất; Thùy sửa là thành luật của Thùy.
>
> **Ranh giới với `spec-giai-bai.md` (bắt buộc):** file đó là LUẬT DUY NHẤT về đọc đề · phân dạng · giải · kiểm · trình bày lời giải · khi nào vẽ lại và vẽ thế nào (`scripts/kho/cat-luat.mjs` cắt nó theo tiêu đề ⇒ không sửa, không chép).
> Spec này chỉ mô tả **QUY TRÌNH + CÔNG CỤ + DỮ LIỆU**: bước nào · lệnh nào · ghi bảng nào · ai duyệt · tệp trung gian ở đâu — và trỏ đúng mục luật khi cần.
>
> **Mục lục.** Phần I (nháp lượt 1): §0 Đích · §1 Một câu gồm gì · §2 Vào kho · §3 MCQ · §4 Điền ô · §5 Clone (mở rộng lượt 2) · §6 Báo sai · §7 Bảng & hàm · §8 Chờ Thùy · §9 Lịch sử.
> Phần II (lượt 2): §10 Nhập kho từ ảnh / tài liệu · §11 Nhập kho từ đề thi · §12 Quy chuẩn hiển thị · §13 Vẽ lại hình.
> (Giữ số mục lượt 1 vì §8 và chỗ khác đã trỏ theo số.)
>
> **Lượt 2 đã sửa ở Phần I:** tiêu đề · khối "Không thuộc" (nhập kho chuyển vào spec này, luật vẫn ở `spec-giai-bai`) · §5 thêm §5.0 ba đường clone + hợp nhất `spec-clone-ai` · §7 thêm dòng nhập kho / đề thi / hiển thị / hình, bỏ `clone-batch-lap.mjs` (không tồn tại) · §8 thêm L14–L22, Q8–Q13 · §9 thêm dòng quyết định của phần mới.

**Không thuộc spec này:** LUẬT đọc đề · phân dạng · giải · kiểm · trình bày · làn vào kho · vẽ hình ⇒ `spec-giai-bai.md` (ở đây chỉ quy trình + công cụ + dữ liệu) · bản đồ dạng / dạng bài / cụm, thẻ lý thuyết `##ĐL ĐN TC…` ⇒ spec #2 (`spec-ban-do-toan.md`) · builder · ET · MT · màn Kho đề thi / Duyệt đề / Giao đề / thi ⇒ spec #4 · đo mastery ⇒ `spec-mastery.md` · logic bổ trợ ⇒ `spec-bo-tro.md` (ở đây chỉ giữ luật **chọn câu**) · kho Tiếng Anh ⇒ `spec-anh-kho.md` (gác lại 17/11).

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

### 5.0 Ba đường clone đang có (lượt 2, đối chiếu code + DB 17/11)

| Đường | Ai sinh | Công cụ | Ghi vào | Đếm 17/11 |
|---|---|---|---|---|
| **1. Hàng đợi Claude Code** (luồng 2, Thùy 08/09) | Claude trong phiên, theo đặt hàng | `scripts/hangdoi-clone.mjs` | nháp `dai_cau_hoi_clone_cho_duyet`, `clone_method='claude_code_batch'` | 5.192 nháp (mới nhất 09/11) |
| **2. Máy sinh theo mẫu** (item model / đổi số) | script, đáp số tính lại bằng máy | `scripts/mcq-clone-doi-so.mjs` (đổi số, đáp số bằng bộ tính của `mcq-auto`) · `scripts/kho/clone/k4T-sinh/kiem/ghi.mjs` · `k4T-tbc-*` · `k4T-5dang-*` · `k5T-pt-*` (sinh → kiểm → ghi) | `mcq-clone-doi-so` + `k4T-ghi` ⇒ **nháp** (`mcq_auto_doi_so` 56 · `may_sinh_theo_mau` 417); `k4T-5dang-ghi` · `k4T-tbc-ghi` · `k5T-pt-ghi` ⇒ **thẳng kho** ở dạng chờ, `da_duyet=false`, qua `scripts/kho/cong-ghi.mjs` (biên bản kiểm + giải mù độc lập), dạng bài vào `dai_bdm_de_xuat` | kho: `may_sinh_theo_mau` 395 · `clone_doi_so` 96 · `claude_may_sinh` 64 |
| **3. Trong ERP** (nút ✨ Clone ở `DangHub.tsx`) | Gemini đọc ảnh gốc; DeepSeek/Claude sinh biến thể (`callAiClone`, prompt `buildCloneFromGocPrompt` + `FMT_RULES`, `src/lib/kho/api.ts`) | `saveCloneVariants` / `saveCloneBatch` | **thẳng kho** `dai_cau_hoi`, `clone_method='manual_gemini'`, cấp mã ở client (`nextCauSeq`); tích "Duyệt luôn" ⇒ `da_duyet=true` | 14.750 câu (14.403 đã duyệt); **vẫn chạy: 187 câu tháng 11** — §8 L17 |

Nút "✨ Clone → đưa vào hàng đợi" (`queueClone` → `createYeuCauClone`) là cửa vào của đường 1; nút clone ngay là đường 3. Chỉ kho Đại có hàng đợi clone (không có `hgt_cau_hoi_yeu_cau_clone`).

**Đường 1 — thao tác** (nguồn: `spec-clone-ai.md` §1, §2, §4, §6; luật sinh ở các gạch dưới):
1. `node scripts/hangdoi-clone.mjs --list --out scripts/_auto_clone_ds.json` ⇒ mỗi mục: câu gốc đủ (`noi_dung` · `lua_chon` · `dap_an` · `loi_giai`), `so_bien_the`, `ghi_chu`, `ten_dang`, ≤ 2 `mau_tham_khao` cùng dạng đã duyệt, cờ `co_hinh` / `goc_da_xoa`, `so_da_co`.
2. Sinh đúng `so_bien_the − so_da_co` biến thể, tự kiểm từng cái (gạch "Tự kiểm" dưới).
3. Viết `scripts/_auto_clone_kq.json` = `[{ yeu_cau_id, variants: [{ noi_dung, lua_chon?, dap_an, loi_giai }] }]` — `lua_chon` chỉ khi gốc trắc nghiệm (đúng 4, không kèm "A."), `dap_an` A–D; TLN / tự luận: `dap_an` = kết quả cuối, không đơn vị. LaTeX trong JSON double backslash.
4. `node scripts/hangdoi-clone.mjs --ghi scripts/_auto_clone_kq.json` ⇒ nháp, đóng yêu cầu; xoá 2 tệp tạm.
5. Không làm được ⇒ `--bo <id> "<lý do>"`: gốc có hình · gốc Đ/S / có `menh_de` · đề gốc sai / thiếu dữ kiện / đáp án mâu thuẫn lời giải (nêu chỗ sai) · không tìm được bộ số cho kết quả đẹp. Gốc đã xoá ⇒ `--don`. Không ghi liều (CLAUDE §1.5).
- Trình bày biến thể: như kho — luật ở `spec-giai-bai` §A5, §A18 (hai phần, `\dfrac`, mỗi công thức một `$…$`, không nhãn "Câu N", TN thì phương án chỉ ở `lua_chon`). `spec-clone-ai` §5 và `FMT_RULES` của ERP là bản chép cũ, có chỗ lệch (§8 L18).

### 5.1 Luật chung mọi đường

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
| Clone | `dai_cau_hoi_yeu_cau_clone` · `dai_cau_hoi_clone_cho_duyet` | `scripts/hangdoi-clone.mjs` · `mcq-clone-doi-so.mjs` · `scripts/kho/clone/*` · `api.ts` (`saveCloneChoDuyet` · `duyetCloneChoDuyet` · `tuChoiCloneChoDuyet` · `saveCloneVariants` · `saveCloneBatch` · `buildCloneFromGocPrompt`) · `src/screens/kho/DangHub.tsx` |
| Báo sai | `bai_cau_bao_loi` · `fn_hs_bao_loi_cau` · `fn_bao_loi_cau_ds` · `fn_bao_loi_cau_xu_ly` | — |
| Nhập kho (§10) | `<kho>_cau_hoi` · `hinh_hoc_cau_lop` · `dai_cau_lop` · `*_bdm_de_xuat` · `*_bdm_gan_cau` · `*_bdm_kho_ds` · `nhap_kho_log` · `<kho>_cau_hoi_yeu_cau_giai` · bucket `kho-anh/nhap_kho/` | `scripts/nhap_kho.mjs` · `_kho_insert.mjs` (`insertCauBatch`, `SUBJECTS` = dai · hgt · khtn · hinh_hoc) · `kho_anh.mjs` · `docx-doc.mjs` · `kho/mathtype-thu/doc-docx.mjs` · `kho/sach/*` · `kho/cong-ghi.mjs` · `kho/cat-luat.mjs` · `anh/docx_trich.mjs` · `anh/wmf_sang_png.ps1` · `anh/nhap_hh_tu_draft.mjs` · `anh/hh_lop_chep.mjs` · `kho-rules/hinh/lo/k8T-thales/nhap_lo.mjs` |
| Đề thi (§11) | `tai_lieu(loai='de_thi')` (`cau_hinh.deThi` · `nhanhByCau` · `duyet_at`) · `tai_lieu_phan` · `tai_lieu_cau` · `fn_de_thi_thieu` · bucket `kho-tailieu` | `scripts/kho/de-thi/boc-word.mjs` · `boc-pdf.mjs` · `dung-de-tu-soan.mjs` · `ghi.mjs` · `nhom-bai.mjs` · `cap-nhat-loi-giai.mjs` · `sua-cau-de.mjs` · `ghi-nhan-cau.mjs` · `duyet-de-ai.mjs` · `do-toanmath.mjs` · `kho-rules/dai/lo/toanmath/{tinh-trang.mjs, anh-batch.mjs}` · `scripts/hinh-luyen/nhap_tu_de_thi.mjs` |
| Hiển thị (§12) | — | `src/screens/kho/ui.tsx` (`MathText` · `tex` · `LoiGiaiXem` · `tach2Phan` · `GiaThietY` · `DeY` · `TextAnh`) · `src/lib/math/{macros,latex-fix}.ts` · `src/lib/mon.ts` (`MON_CHU_THUONG`) · `src/lib/lythuyetBlocks.ts` (`tachNhanGiai`) |
| Hình (§13) | `kho_hinh_nguon` · `kho_hinh_lenh_ve` · `fn_kho_hinh_dem` · cột `anh_de` / `anh_dap_an` · `hinh_bai.anh_de` · `hinh_y.anh_de` · `hinh_baitoan.anh_chuan` · `hinh_baitoan_bien_the.anh` / `anh_loi_giai` · `hinh_mo_hinh.anh_cau_hinh` · `hinh_cach_giai.anh_loi_giai` · bucket `kho-anh/hinh_hoc/` | `scripts/anh/ve_hinh_lib.mjs` · `ve_vecto_lib.mjs` · `ve_lai_xuat.mjs` · `ve_lai_xuat_hgt.mjs` · `ve_moi_xuat.mjs` · `ve_lai_bang.mjs` · `bang_hinh.mjs` · `gan_hinh.mjs` · `bien_ban/` · `ve_lai/` · `ve_moi/` · `scripts/hinh-luyen/ve_y_xuat.mjs` · `hinh-luyen/ve/to_soat.mjs` · `scripts/kho/so-hinh.mjs` (→ `kho-rules/SO-HINH.md`) · máy vẽ khác `kho/do-thi.mjs` · `hinh-toado.mjs` · `hinh-luong-giac.mjs` · `hinh-giai-tich.mjs` · `k10-hinh.mjs` |

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
| L14 | Phạm vi mới lệch `SPEC-INDEX.md` | Thùy 17/11 đưa "nhập kho từ ảnh / từ đề thi" vào spec kho; `SPEC-INDEX` bảng A dòng 5 vẫn ghi `spec-de-thi` (phần bóc câu) → `spec-giai-bai`, dòng 3 chưa có `spec-de-thi` · `spec-format-noidung` | **Q8** |
| L15 | Câu đề thi ghi nhãn "người giải" dù dây chuyền AI giải (`spec-giai-bai` §C7; nợ §C10 mục 1, 8) — **vẫn đang tăng** | `ghi.mjs` ghi cứng `nguon_giai='nguoi'`, `giai_method` null: câu nguồn `de_thi` còn sống Đại 41.355/41.602 · HGT 3.872/3.872 · Hình 7.215/7.220 mang `nguoi`; riêng từ 15/11 (sau khi luật §C7 có hiệu lực): **1.728 câu** (Đại 1.124 · HGT 418 · Hình 186) | **Q9** |
| L16 | Nhãn nguồn hình (`spec-giai-bai` §C12, có từ mig `202611152245`) không được ghi ở đường tạo câu mới | `kho_hinh_nguon` chỉ có **24 dòng** (Hình, `ve_moi`, 16/11); **118 câu** có hình đề tạo sau 15/11 22:55 (Đại 52 · Hình 66) không có nhãn ⇒ rơi vào "chưa rõ nguồn"; `fn_kho_hinh_dem`: 14.462 hình đề, 14.438 chưa rõ nguồn | **Q10** |
| L17 | Clone trong ERP ghi thẳng kho, bỏ qua nháp và nhân chứng thứ hai (đường 3, §5.0) | `saveCloneVariants` / `saveCloneBatch`: `manual_gemini` 14.750 câu (14.403 đã duyệt, phần lớn tích "Duyệt luôn"), 187 câu tháng 11; cấp mã ở client (L7); bài học 08/11 "đáp số clone phải có nhân chứng máy / Opus" không áp ở đường này | **Q11** (đi cùng Q5) |
| L18 | Luật trình bày chép cũ trong prompt ERP | `FMT_RULES` (`api.ts`, dùng cho OCR + clone trong ERP) và `spec-clone-ai` §5 dặn "số thập phân dùng dấu chấm 0.6"; `spec-giai-bai` §A10 (TLN dấu phẩy) và Phần B › Hình (`3{,}5`) dùng dấu phẩy; bộ hiển thị `tex()` đã bọc `{,}` cho phẩy thập phân (§12) | **Q12** |
| L19 | Hai đường nhập câu từ ảnh / PDF | Đề thi bỏ đường Gemini-trong-ERP từ 01/10 (`spec-de-thi` §10.6); nhưng `DangHub.tsx` (`runAutoIngest`, `runOcrGoc`, Gemini) vẫn nhập chuỗi câu từ ảnh / PDF ghi thẳng kho từ client, không qua dây chuyền §C2 (đọc ảnh ⇒ model khác đối chiếu, nhân chứng đáp số) | **Q13** |
| L20 | Trỏ tới tệp đã xoá | `docs/mau-brief-ve-lai-hinh.md` + `docs/log-giai-hinh-hoc-bai.md` xoá 15/11 (commit `0ee3866b`, nội dung vào `spec-giai-bai` Phần B › Hình); còn trỏ ở `scripts/anh/gan_hinh.mjs` (dòng 42) · `nhap_hh_tu_draft.mjs` (dòng 11) · `scripts/hinh-luyen/ve_y_xuat.mjs` · `scripts/hinh-luyen/ve/K8-g*.mjs` + `viec.md`. §7 lượt 1 trỏ `clone-batch-lap.mjs` không tồn tại (đã bỏ ở lượt 2) | Kỹ thuật: sửa chú thích khi có lệnh |
| L21 | Brief vẽ mới chép tóm luật | `kho-rules/hinh/ve-moi/BRIEF.md` (16/11) tóm lại luật vẽ của `spec-giai-bai` — trái §C4 "brief không chép luật"; vẽ lại thì không có brief riêng (giao bằng `cat-luat.mjs`) | Kỹ thuật: brief chỉ giữ phần riêng của gói + đầu ra `cat-luat.mjs <khối>` |
| L22 | Vẽ lại hình HGT có công cụ nhưng không có luật | `spec-giai-bai` Phần B › Hình › "Vẽ lại": "chưa có luật vẽ lại cho … `hgt_cau_hoi`"; thực tế có `ve_lai_xuat_hgt.mjs` + `gan_hinh.mjs --bang hgt` (Thùy 08/11, vectơ), 70 câu HGT đang mang hình code | Thùy chốt ⇒ ghi vào `spec-giai-bai` (không sửa từ spec này) |

**Câu hỏi cho Thùy:**
- **Q1.** Điền ô Đại (449 form, 0 duyệt, bỏ từ 13/09): làm tiếp (hàm duyệt + giao bài + `fn_chon_form`) hay đóng băng và ghi rõ "chỉ Hình chứng minh có điền ô"?
- **Q2.** Câu Hình mới chưa duyệt có được vào bài HS không? Nếu không ⇒ đổi công thức `kho_chuan` của Hình về `_kho_cau_chuan` (3.692 câu sẽ rời kho tới khi được duyệt).
- **Q3.** Sửa đáp số ⇒ tự thu hồi form TN (như điền ô) — bật không? 13 form đang lệch ai soát?
- **Q4.** 25 form TN Hình đang chờ: đưa vào rác (`xoa_at`) không?
- **Q5.** Clone: giữ bảng nháp (5.665 dòng chờ — ai duyệt?) hay làm bước 5 spec-kho-chuan: clone ghi thẳng vào kho `da_duyet=false`, đi chung một hàng duyệt, và đáp số clone phải có nhân chứng máy/Opus trước khi duyệt?
- **Q6.** Quét kho cũ còn 353 câu Đại + 1 HGT "tạm dùng": bỏ hẳn vế "câu cũ tạm dùng" (kho chuẩn = `da_duyet` thuần) lúc nào?
- **Q7.** Ai duyệt form TN KHTN / TSA / HGT (đang tồn 1.302 form), có cho máy ký (`duyet_nguon` kiểu `may`) khi verify 0 FAIL + độ lừa đủ không?
- **Q8.** Ranh giới spec kho ↔ spec giải bài: CTO đề xuất — `spec-giai-bai` giữ LUẬT (đọc đề · giải · kiểm · trình bày · vẽ); spec #3 giữ QUY TRÌNH + CÔNG CỤ + DỮ LIỆU nhập kho, nhập đề thi, clone, hiển thị, vẽ lại (đúng như Phần II). Gật thì sửa `SPEC-INDEX` bảng A: dòng 3 thêm `spec-de-thi` (bóc câu + cấu trúc đề) · `spec-format-noidung` (hiển thị câu); dòng 5 bỏ `spec-de-thi`.
- **Q9.** Nhãn câu đề thi (L15): CTO đề xuất — sửa `ghi.mjs` ghi `nguon_giai='ai'`, `giai_method='claude_code'`, `ai_model` theo tệp soạn **trước batch kế tiếp**; vá câu cũ CHỈ với đề có tệp `.soan.md` trong repo làm nhân chứng (không đoán theo ngày). Làm không?
- **Q10.** Nhãn nguồn hình (L16): CTO đề xuất — mọi đường gắn `anh_de` lúc tạo câu (`_kho_insert.mjs`, `ghi-lo.mjs`, `ghi.mjs`, `nhap_hh_tu_draft.mjs`, ERP) gọi `ghiNhanHinh` cùng transaction, mặc định `goc`; 118 câu mới thì gắn nhãn `goc` khi có lệnh. Làm không?
- **Q11.** Clone trong ERP (L17): giữ nút clone-ngay (ghi thẳng kho, "Duyệt luôn") hay chỉ còn nút đưa vào hàng đợi (đường 1, có nhân chứng)? CTO nghiêng: bỏ "Duyệt luôn", clone ERP ghi `da_duyet=false` và đi chung hàng duyệt của Q5.
- **Q12.** Số thập phân trong dữ liệu kho (L18): dấu phẩy theo `spec-giai-bai` cho mọi đường? CTO đề xuất: có — sửa `FMT_RULES` cho khớp (bộ hiển thị đã hiện đúng phẩy thập phân).
- **Q13.** Nhập chuỗi câu từ ảnh / PDF trong ERP (L19): giữ cho nhân sự dùng, hay gỡ như đã gỡ nhập đề thi bằng Gemini 01/10 (mọi tài liệu đi folder + Claude, §10)? Chưa đo được còn ai dùng (đường này không ghi nhãn riêng).

**✅ THÙY CHỐT 17/11 — "Chốt theo đề xuất"** (Q1–Q13; việc DB / app chỉ làm khi có lệnh riêng, một bước một lần):
| Q | Quyết định |
|---|---|
| Q1 | **Đóng băng điền ô Đại** (449 form giữ nguyên, không sinh thêm, không làm hàm duyệt / `fn_chon_form`). Điền ô chỉ còn ở Hình chứng minh. |
| Q2 | **Hình theo luật chung**: `kho_chuan` của Hình đổi về `_kho_cau_chuan` (câu mới phải `da_duyet`). Khi làm: đo trước số câu rời kho (17/11: 3.692) + báo trưởng khối Hình. |
| Q3 | **Bật trigger thu hồi form TN khi sửa đáp số** (như điền ô). 13 form đang lệch ⇒ trưởng khối môn soát. |
| Q4 | **25 form TN Hình chờ ⇒ kho rác** (`xoa_at`, không xoá cứng). |
| Q5 | **Bỏ bảng nháp clone**: clone ghi thẳng kho `da_duyet=false`, đi chung một hàng duyệt; đáp số clone có nhân chứng máy/Opus trước khi duyệt. 5.665 nháp cũ: đưa qua cùng hàng hoặc rác — hỏi khi làm. |
| Q6 | **Bỏ vế "câu cũ tạm dùng"** (kho chuẩn = `da_duyet` thuần) ngay khi quét xong 353 Đại + 1 HGT còn lại. |
| Q7 | **Cho máy ký** form TN (`duyet_nguon` kiểu `may`) khi verify 0 FAIL + độ lừa đủ; form không qua ⇒ trưởng khối môn duyệt. |
| Q8 | **Ranh giới:** `spec-giai-bai` giữ LUẬT; spec này giữ QUY TRÌNH + CÔNG CỤ + DỮ LIỆU. `SPEC-INDEX` đã sửa (dòng 3 thêm `spec-de-thi` phần bóc câu + `spec-format-noidung` phần hiển thị câu; dòng 5 bỏ `spec-de-thi`). |
| Q9 | Sửa `ghi.mjs` ghi `nguon_giai='ai'`, `giai_method='claude_code'`, `ai_model` **trước batch kế tiếp**; vá câu cũ CHỈ với đề có `.soan.md` làm nhân chứng. |
| Q10 | Mọi đường gắn `anh_de` lúc tạo câu gọi `ghiNhanHinh` cùng transaction, mặc định `goc`; 118 câu mới gắn `goc` khi có lệnh. |
| Q11 | **Bỏ "Duyệt luôn"** ở clone ERP: ghi `da_duyet=false`, đi chung hàng duyệt Q5. |
| Q12 | **Dấu phẩy thập phân** cho mọi đường; sửa `FMT_RULES` cho khớp `spec-giai-bai`. |
| Q13 | (không có đề xuất ghi sẵn — CTO chọn) **Giữ tạm** đường nhập ảnh/PDF trong ERP, thêm nhãn nguồn để đo lượt dùng; 2 tuần không ai dùng ⇒ gỡ như nhập đề thi 01/10. |

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
| 04/09 | Thùy | Hàng đợi giải câu chưa có lời giải (`hangdoi-giai.mjs`) — luồng 1 của Claude Code |
| 13/09 | Thùy | Hình vẽ khi nhập kho: cắt từ trang PDF (`kho_anh.mjs`), không bỏ câu phụ thuộc hình; lọc trùng + dạng chờ ở `_kho_insert.mjs` |
| 20–22/09 | Thùy | Đề thi = 1 đầu vào → 2 đầu ra (câu vào kho + đề giữ cấu trúc); câu trùng trỏ về câu cũ; nhập qua Claude, không qua ERP |
| 01/10 | Thùy | Gỡ đường nhập đề thi bằng Gemini trong ERP; đề chỉ có PDF = Gemini gõ, Claude kiểm (`boc-pdf.mjs`); đề luôn vào được, thiếu dạng chỉ cảnh báo |
| 07/10 | Thùy | Hình đề vẽ bằng code; câu đơn cùng hình ở `anh_de` và `anh_dap_an` |
| 10/10 | Thùy | Đề cương = đề có `cau_hinh.deThi.kieu='de_cuong'`, tab riêng ở Kho đề thi |
| 13/10 | Thùy | Luồng vẽ lại hình kho Hình (`ve_lai_xuat` → trạm → `ve_lai_bang` → `gan_hinh --thay`, ảnh cũ không xoá) — phạm vi "mọi ảnh cũ" **đã bị thay 15/11** |
| 14/10 | Thùy | Gạch bằng nhau tối đa 3, nhóm 4–6 dùng ×; Hình luyện vẽ theo ý (`HLB` / `HLY`) |
| 23/10 | Thùy | Vuông tại A ⇒ AB đứng, AC ngang |
| 15/11 | Thùy | Hình đề: gốc ổn giữ · gốc tệ (mã a–f) vẽ lại · có lệnh thì vẽ lại; nhãn nguồn từng hình + bộ đếm theo khối (`spec-giai-bai` §A8, §C12) |
| 16/11 | Thùy | Vẽ hình MỚI cho đề kho Hình thiếu hình (`ve_moi_xuat.mjs`, nhãn `ve_moi`); bài nhiều ý tô nền giả thiết khi hiển thị |
| 17/11 | Thùy | Spec kho gồm cả nhập kho từ ảnh, từ đề thi, clone, quy chuẩn hiển thị, vẽ lại hình (lượt 2 của nháp này) |

---

# PHẦN II — ĐƯA CÂU VÀO KHO · HIỂN THỊ · HÌNH (lượt 2, 17/11)

> Mọi luật nội dung ở đây là **trỏ** sang `spec-giai-bai.md`. Lệch giữa phần này và `spec-giai-bai` về luật ⇒ `spec-giai-bai` đúng; lệch về lệnh / bảng / tệp ⇒ code đúng, báo để sửa spec.

## 10. Nhập kho từ ảnh / tài liệu

### 10.1 Các đường vào

| Đường | Khi nào | Lệnh / công cụ | Ghi vào |
|---|---|---|---|
| **A. `/nhap-kho`** (`.claude/commands/nhap-kho.md`) | tài liệu thả vào folder Drive-sync, chế độ `co_giai` (có lời giải) / `khong_giai` | `scripts/nhap_kho.mjs list → insert --thu → insert → done` (hỏng: `fail`) | `<kho>_cau_hoi` (`--subject dai · hgt · khtn · hinh_hoc`) · `nhap_kho_log` · file dời sang `<root>/DaXuLy/<ngày>/` |
| **B. Đường SÁCH** (Word nhiều bài, MathType) | sách tham khảo theo khối (4T, 5T, 8T…) | `kho/mathtype-thu/doc-docx.mjs` → `kho/sach/tach-bai.mjs` (danh tính bài = sách · khu · số · ý) → `trich-media.mjs` (hình) → `dau-vao-soan.mjs` (bỏ bài đã có / trùng) → trạm soạn → `lo-tu-soan.mjs` → `ghi-lo.mjs` (qua `kho/cong-ghi.mjs`, biên bản kiểm khớp dấu băm) → `gan-bdm-nhom.mjs` / `tu-duyet.mjs`; lọc trùng 3 mức `loc-trung.mjs` | `dai_cau_hoi` (dạng chờ) + `dai_bdm_*`; `ten_de_goc = "<sách> · <mã>"` |
| **C. Bài học Hình từ Word bài giảng** | Word bài giảng Hình THCS | `anh/docx_trich.mjs` (văn bản + `⟦imageN.wmf⟧`, WMF → PNG qua `wmf_sang_png.ps1`) → bản nháp `draft_*.md` → `anh/nhap_hh_tu_draft.mjs` (câu đơn; `--lop giang` = kho trên lớp) hoặc `kho-rules/hinh/lo/k8T-thales/nhap_lo.mjs` (bài–ý + sơ đồ tư duy) → `gan_hinh.mjs` | `hinh_hoc_cau_hoi` · `hinh_hoc_cau_lop` |
| **D. Bài lẻ theo chỉ định** | Thùy / trưởng khối đưa bài + chỉ định dạng, kho trên lớp / về nhà | như `spec-giai-bai` §C11 (bảng kho đích ở đó) | theo chỉ định |
| **E. Hàng đợi giải** | câu đã có trong kho mà chưa có lời giải; nhân sự bấm "📥 Đặt Claude giải" | `scripts/hangdoi-giai.mjs --list → --ghi` | `{dai,hgt,khtn}_cau_hoi_yeu_cau_giai` (đếm 17/11: Đại 245 · HGT 10 · Hình 0 dòng) → cập nhật câu |
| **F. Trong ERP** (`DangHub.tsx`: nhận bài gốc / nhập chuỗi câu từ ảnh, PDF bằng Gemini) | nhân sự tự nhập trên màn | `runOcrGoc` · `runAutoIngest` (render trang, AI tách câu + khung hình) → `CauEditor` → lưu | thẳng `<kho>_cau_hoi` từ client — **§8 L19 / Q13** |

Đề thi / đề cương ⇒ §11 (không qua đường A). Kho Tiếng Anh dùng bộ script riêng trong cùng thư mục `scripts/anh/` (`cong_ghi_anh.mjs` · `giai_chuan_bi.mjs` · `giai_cong.mjs` · `giai_tach_b.mjs` · `duyet_sau_giai.mjs` · `luat_chac_chan.mjs` · `kiem_lai_anh.mjs` · `duyet_de_chac.mjs` · `doc_*.py` · `docx_khoi.py`) — thuộc `spec-anh-kho.md`, gác lại 17/11, không thuộc spec này.

### 10.2 Đọc tài liệu theo loại nguồn

| Nguồn | Máy đọc | Ghi chú |
|---|---|---|
| Word công thức OMML | `scripts/docx-doc.mjs file.docx [--out file.md]` (công thức ⇒ `$…$`) | "file Word dễ nhất" (Thùy 08/09) |
| Word MathType (OLE / WMF) | `scripts/kho/mathtype-thu/doc-docx.mjs` (đọc MTEF ra LaTeX) · `anh/docx_trich.mjs` (đổi WMF ⇒ PNG để đọc bằng mắt) | lớp chữ mất công thức ⇒ đọc theo thứ tự đánh dấu `⟦…⟧` |
| PDF có lớp chữ / PDF scan / ảnh chụp | `pdftoppm -r 150` ảnh trang; chỗ không rõ phóng 300–400 dpi; Read tool ≤ 20 trang/lượt | **ảnh trang là nguồn chính** — luật đọc: `spec-giai-bai` §A11 (bẫy đọc, chỉ trang đề là đề, gõ lại từ ảnh thì model khác đối chiếu) |
| Hình trong đề | `node scripts/kho_anh.mjs cat --pdf <f> --page <n> --bbox x0,y0,x1,y1 --out <png>` (khung theo tỉ lệ trang) → Read PNG kiểm → `kho_anh.mjs up --png <png>` ⇒ URL `kho-anh/nhap_kho/<YYYY-MM>/…` ⇒ `anh_de` (hình lời giải ⇒ `anh_dap_an`) | ảnh gốc ổn thì giữ, tệ thì vẽ lại — `spec-giai-bai` §A8; nhãn nguồn hình §C12 |

Khoá upload `SUPABASE_SERVICE_ROLE` có sẵn trong `.env.local`, chỉ dùng trong script, không in ra.

### 10.3 Dây chuyền (tóm — luật ở `spec-giai-bai` Phần C)

Chuẩn bị + bóc (máy) → đo trùng kho → nạp luật một lần cho batch (`node scripts/kho/cat-luat.mjs <khối> --ra <thư mục>` ⇒ `brief-soan.md` + `brief-soat.md`, dòng đầu `luat: <mã>`) → phân dạng (Sonnet) → giải (Sonnet) → kiểm (máy + Opus giải mù) → cổng + xếp làn → ghi DB.
Vai, lô mẫu, phần Opus kiểm, điều kiện tự vào kho, nhãn dữ liệu: `spec-giai-bai` §C1–§C7. Code còn nợ so với luật (làn tự vào kho, mẫu 15 %…): `spec-giai-bai` §C10.

### 10.4 Ghi DB — quy ước của công cụ

- **Luôn chạy thử trước**: mọi script ghi mặc định ROLLBACK (`--thu` ở `nhap_kho.mjs`; các script khác chạy thử khi không có `--ghi`). Lô 5–10 câu / lần ở đường A (một câu lỗi ⇒ hỏng cả lô). Không chạy hai lượt ghi song song (cấp mã va nhau); không chạy lượt nặng 17–22 h.
- **Mã câu**: script cấp (`_kho_insert.mjs`, khoá advisory theo dạng); JSON đầu vào không truyền `ma_cau` (§1).
- **Trùng**: `insertCauBatch` so `noi_dung` sau chuẩn hoá (chữ thường, bỏ mọi khoảng trắng) với kho + trong lô ⇒ trả mã câu cũ ở đúng vị trí, không chèn (`--cho-trung` chỉ khi cố ý). Trùng khác cách gõ ⇒ `kho/sach/loc-trung.mjs` (3 mức). Trùng hai nguồn Word / PDF chưa bắt được (§11.5).
- **Dạng**: khối chạy bản đồ mới (`select public._bdm_ds_khoi_chay()`) ⇒ `dang_chinh` luôn = dạng chờ của khối (`…000000`); dạng bài qua trường `dang_bai` (NDB…) ⇒ `*_bdm_de_xuat` nguồn `ai`, hoặc `dang_bai_chot: true` ⇒ gán thẳng nguồn `nguoi`; câu Đ/S: `chu_de` (NCD…) ⇒ `*_bdm_kho_ds`, mệnh đề không mang dạng. Không chắc dạng ⇒ bỏ trống (câu ở dạng chờ). Khối cấp 1 / KHTN giữ cách cũ.
- **Làn**: `da_duyet` ghi theo `spec-giai-bai` §C6; câu có cờ ⇒ `kiem_may='nghi'` + lý do ⇒ hàng duyệt trưởng khối. Trigger tự duyệt sau gán dạng: §2.
- **Nhãn**: `nguon_giai` · `giai_method` · `ai_model` theo `spec-giai-bai` §C7 (đường đề thi đang ghi sai — §8 L15).
- **Sổ nhập**: `nhap_kho_log` (sha256 tệp ⇒ chạy lại báo "đã có"; `loi` khác null = lần hỏng, chạy lại được).

### 10.5 Tệp trung gian

| Tệp | Ở đâu |
|---|---|
| Thư mục làm việc (bộ đệm, dựng lại được từ tệp gốc) | `KHO_LAM_VIEC` (`scripts/kho/cau-hinh.mjs`), mặc định `C:\Users\<user>\bk-kho-lam-viec\…` |
| JSON câu + danh sách mã của đường A | scratchpad: `nhap_kho_<sha8>.json` · `nhap_kho_<sha8>_ids.json` |
| Tệp gốc đã xử lý | `<root Drive-sync>/DaXuLy/<YYYY-MM-DD>/` (EBUSY ⇒ log có `CHUA_MOVE`, người kéo tay) |
| Lô, biên bản kiểm, bản soạn theo khối / sách | `kho-rules/<kho>/lo/<…>/` (theo git) |
| Hình chờ gắn | thư mục gói, tên tệp = mã câu (§13.3) |

### 10.6 Số đo 17/11

- `nhap_kho_log`: 2.148 lượt, 51.170 câu mới (`co_giai` 2.135 lượt / 51.041 câu — gồm cả lượt ghi đề thi; `khong_giai` 13 / 129, chỉ 10–21/09), 0 lượt lỗi. Theo tháng: 09 = 7.435 câu · 10 = 10.043 · **11 = 33.692** (tới 14/11).
- Câu Đại còn sống theo nguồn: `de_thi` 41.602 · `le` (kho cũ) 11.596 · `le` (tài liệu) 9.192 · `clone` 16.323. Ảnh đề do nhập cắt từ tài liệu (`kho-anh/nhap_kho/`): Đại 6.174 câu.

## 11. Nhập kho từ đề thi

### 11.1 Một đầu vào → hai đầu ra (Thùy 20/09, `spec-de-thi` §0–§1)

Một đề (Word / PDF) ⇒ **(1)** từng câu vào kho như mọi câu (`nguon='de_thi'`; câu trùng trỏ về câu cũ, không đẻ bản sao) **và (2)** đề giữ nguyên cấu trúc (phần · thứ tự · điểm · thời gian), dùng được ngay trên app. Câu chỉ sống ở kho; đề chỉ **trỏ** tới câu (mô hình item bank + test form, IMS-QTI `assessmentTest → section → itemRef`).

### 11.2 Quy trình (`.claude/commands/nhap-de-thi.md`, `spec-de-thi` §10.3, §10.8)

| Bước | Lệnh | Ra |
|---|---|---|
| 0. Thả đề | `E:\BK ACADEMY\Tài liệu Claude nhập kho\DE_THI\L<khối>\` → chép `goc.docx` / `goc.pdf` vào `<KHO_LAM_VIEC>/de-thi/<TÊN_NGẮN>/` | có Word ⇒ Word là nguồn chữ, PDF đối chiếu |
| 1. Bóc (máy) | `node scripts/kho/de-thi/boc-word.mjs "<work>/goc.docx" --ra "<work>" --khoi <k>` · chỉ có PDF: `boc-pdf.mjs` (Gemini 4 lượt: bóc · mục lục · khung hình 150 dpi · đánh dấu đáp án 250 dpi; máy kiểm số câu, `$` cân, so lớp chữ PDF) | `de.json` + `img/` (+ `trang/`, `trang-dd/`) + danh sách `⚠` |
| 1b. Claude kiểm bóc | mở TỪNG ảnh trang so từng câu, xem từng hình cắt (sai khung ⇒ sửa `box` trong `gemini-trang.json` rồi `--dung-lai`, không gọi lại Gemini); mọi sửa ghi `<work>/quyet.mjs` (mỗi sửa một dòng lý do) | chạy lại được: bóc → `quyet` |
| 2. Phân dạng + giải + kiểm | tệp soạn `<MA>.soan.md` (khuôn `spec-giai-bai` §A10) → `node scripts/kho/de-thi/dung-de-tu-soan.mjs <MA>.soan.md --lam-viec "<work>" --khoi <k> --chi-kiem` tới khi "✔ đạt cổng"; bỏ `--chi-kiem` ⇒ dựng `de.json` (bản Gemini đổi tên `de.boc.json`) | cổng đọc cả dòng `**Hình:** … \| nguon=…` |
| 3. Ghi | `node --env-file=.env scripts/kho/de-thi/ghi.mjs "<work>"` (ROLLBACK, in một dòng / câu) → `… --ghi` | một transaction: câu → kho · đề + phần + câu · `nhap_kho_log`; ảnh → `kho-anh`, PDF gốc → `kho-tailieu` (ngoài transaction) |
| 4. Kiểm trên ERP | Học thuật › Kho đề thi: đủ câu, công thức render, hình hiện | báo: tên đề · số câu theo kho · vào kho / hàng duyệt · `tai_lieu.id` |

- **Batch nhiều đề** (bộ toanmath…): sổ `kho-rules/dai/lo/toanmath/TINH-TRANG.md` tự sinh bằng `tinh-trang.mjs`, chạy lại sau mỗi việc; đề treo ghi tay `batch/<B>/treo.json`; hình nháp đẩy bằng `anh-batch.mjs day <BATCH> <MA…>`; đo bộ đề đã tải so với DB: `kho/de-thi/do-toanmath.mjs` (chỉ đọc). Thứ tự làm, quản batch: `spec-giai-bai` §C8.
- **Bộ đề đặc thù** có script riêng cùng khuôn (vd CLC lớp 6: `tach-clc6` → `dau-vao-clc6` → `gom-soan-clc6` → `gom-kiem-clc6` → `ap-soat-clc6` → `so-ba-nguon` → `ghi-clc6`; `k*-ghi-het.sh` ghi theo khối). Tạo bộ mới thì chép khuôn, không tạo luật mới.
- **Đề cương ôn tập**: `de.json` có `kieu: 'de_cuong'` (+ `thoi_gian_phut: null`) ⇒ `ghi.mjs` ghi dấu; thường không có đáp án ⇒ chỉ gõ lại, tách ý theo luật chung. Mẫu: `kho-rules/dai/lo/k6/de-cuong/NSHM-GKI-2026.build.mjs`.
- **Không chạy hai lượt `--ghi` song song.** Chuỗi LaTeX sửa bằng Write / Edit, không heredoc / `node -e` (`spec-giai-bai` §A5).

### 11.3 Dữ liệu cấu trúc đề

| Tầng | Bảng / trường | Luật |
|---|---|---|
| Đề | `tai_lieu(loai='de_thi')`: `ten` · `khoi` · `mon` · `nhanh` (nhánh mặc định) · `file_url` · `duyet_at` / `duyet_boi` (lịch sử duyệt do trigger ghi `tai_lieu_duyet_log`) | `cau_hinh.deThi` = `nguon` · `maDe` · `nam` · `thoiGianPhut` · `thangDiem` · `pdfGocUrl` · `sha256` (chống nhập trùng tệp) · `kieu` (`de_cuong`) · `nhanCau[ma_cau]` (nhãn gốc "Bài 2a") · `canhBaoCau` · `cauThieu`; `cau_hinh.nhanhByCau[ma_cau]` = nhánh của câu khác nhánh mặc định (Đại + HGT + Hình trong một đề) |
| Phần | `tai_lieu_phan(loai_phan='custom')`: tiêu đề "PHẦN I…" · `diem_moi_cau` · `dang_thuc` (`trac_nghiem` · `dung_sai` · `tra_loi_ngan` · `tu_luan`) = dạng thức gốc trên giấy | điểm mặc định khuôn Bộ: TN 0,25 · Đ/S 1,0 · TLN 0,5 (`spec-de-thi` §1b) |
| Câu trong đề | `tai_lieu_cau(phan_id, ma_cau, thu_tu, diem)` | danh tính = `ma_cau` (text, không FK); `thu_tu` chỉ hiển thị; `diem` null = theo phần · **cấm xoá cứng câu đang nằm trong đề** (chỉ `xoa_at`, màn đề nêu cờ) |
| Nhóm bài của đề gốc | suy lúc đọc: `kho/de-thi/nhom-bai.mjs` (câu kho đã tách ý ⇒ "Bài 2" có 4 ý) | đề giữ cấu trúc gốc, kho tách câu |

Invariant "đề thiếu gì" (pure-derive, không cột trạng thái): `fn_de_thi_thieu(de_id)` — thiếu đáp án / phương án = chặn; chưa đủ dạng = chỉ cảnh báo (Thùy 01/10).

### 11.4 Sửa · duyệt sau khi đã ghi

| Việc | Lệnh |
|---|---|
| Lời giải soạn lại cho đề đã ghi (theo sha256) | `kho/de-thi/cap-nhat-loi-giai.mjs` — chỉ đè câu CHƯA duyệt do chính đề đó đẻ ra |
| Người duyệt quyết sửa đề một câu (đề in lỗi) | `kho/de-thi/sua-cau-de.mjs` |
| Bù nhãn gốc câu cho đề ghi trước khi `ghi.mjs` biết nhãn | `kho/de-thi/ghi-nhan-cau.mjs` |
| Đề đã qua dây chuyền 2 nhân chứng, Thùy bảo "đưa lên app" | `kho/de-thi/duyet-de-ai.mjs <tai_lieu_id>… [--ghi]` — duyệt mọi câu (`duyet_nguon='ai'`) + `tai_lieu.duyet_at`, `duyet_boi` null = máy; chặn như `fn_de_thi_duyet` khi `fn_de_thi_thieu` còn câu chặn |
| Bài tự luận Hình của đề ⇒ kho Hình–Luyện | `scripts/hinh-luyen/nhap_tu_de_thi.mjs --khoi <k> [--ghi]` (chép, không sửa câu gốc) — luật cây Hình ⇒ spec #2 |

**Ranh giới:** màn Kho đề thi (tab Chờ duyệt / Sẵn sàng / Đã giao / Đề cương), màn sửa + Duyệt đề (`DeThiSoan`), Giao 3 chế độ, đồng hồ, chấm, thi trên lớp / tự luyện ⇒ **spec #4** (`spec-de-thi` §5–§10.9). Luật giải · gán dạng · duyệt câu của đề ⇒ `spec-giai-bai`.

### 11.5 Hiện trạng 17/11

- `tai_lieu(loai='de_thi')`: Toán đề thi **1.920** (393 đã duyệt) · Toán đề cương **182** (13) · Tiếng Anh 74 (0); `tai_lieu_cau` 54.707 dòng trên 2.174 đề. 17 đề ghi từ 15/11.
- Câu nguồn `de_thi` còn sống: Đại 41.602 (18.657 duyệt) · HGT 3.872 (2.675) · Hình 7.220 (3.172). Nhãn giải sai — §8 L15.
- Chưa giải quyết (`spec-de-thi` §10.8): **một đề nhập từ hai nguồn Word + PDF ⇒ máy chỉ nhận 1/22 câu trùng** (LaTeX hai nguồn khác nhau) — vì thế luật "một đề không nhập từ cả hai nguồn" (`spec-giai-bai` §A9); chưa đo trên PDF scan; đề Đ/S không có đáp án bị `ghi.mjs` chặn; hình trong lời giải không cắt.

## 12. Quy chuẩn hiển thị trong kho

### 12.1 Một bộ hiển thị cho mọi màn

- **`MathText`** (`src/screens/kho/ui.tsx`) là lá hiển thị DUY NHẤT cho chữ của câu (đề · phương án · đáp án · lời giải) ở kho, duyệt, builder, trang in, test online, app HS. Lời giải hai phần có thêm **`LoiGiaiXem`** (popup kho: công tắc 📝 Lời giải · 💡 Hướng dẫn · 📑 Cả 2, mặc định Lời giải, nhớ theo máy); trang in / danh sách câu / BTVN dùng `MathText` ghép cả hai phần.
- Công thức render bằng **KaTeX** qua `tex()`; macro dùng chung với ô nhập MathLive (`src/lib/math/macros.ts`) ⇒ soạn thấy sao, in / app ra vậy. Copy từ vùng đã render trả về chuỗi kho `$…$` (`installTexCopy`).
- Môn không phải công thức (Tiếng Anh) chọn bộ khác qua registry `MON_CHU_THUONG` (`src/lib/mon.ts`) ⇒ `TextAnh`; cấm `if (mon === …)` ở màn (CLAUDE §1.6).
- **Dữ liệu viết thế nào** là luật của `spec-giai-bai` §A5, §A10, §A18 (hai phần, `\dfrac`, mỗi công thức một `$…$`, dòng, Phần 1 dạng card, sơ đồ tư duy §A6). Mục dưới chỉ ghi **bộ hiển thị làm gì** với dữ liệu đó, để người nhập biết cái gì máy tự lo, cái gì không.

### 12.2 Bộ hiển thị tự xử lý (không cần, không nên viết tay)

| Việc | Cách | Ở đâu |
|---|---|---|
| `\frac` ⇒ `\dfrac` | lúc render | `tex()` |
| `\vec{AB}` (≥ 2 ký tự) ⇒ `\overrightarrow{AB}`; `\vec{u}` giữ | lúc render | `tex()` |
| Phẩy thập phân `1,46` ⇒ `1{,}46` (KaTeX không chèn khoảng) — chỉ cụm số có đúng 1 phẩy, không đứng sau "tên(" (`BCNN(8,10)`, `A(1,2)` giữ) | lúc render | `tex()` |
| `\widehat{A_2}` ⇒ mũ trên chữ, chỉ số ngoài; mũ một chữ cỡ lớn | lúc render (và lúc lưu) | `src/lib/math/latex-fix.ts` |
| Lệnh trần ngoài `$` (`\leq`, `\times`, `\Rightarrow`…) ⇒ ký tự Unicode; lệnh có ngoặc trần (`\dfrac{6}{5}`) ⇒ KaTeX | lưới an toàn | `uni()` · `renderInline` |
| `$` lẻ (quên đóng ở cuối) ⇒ tự thêm `$` đóng | lưới an toàn | `balanceDollars` |
| Phương án lưu sai kiểu object `{key,text}` ⇒ lấy `text`, không sập màn | lưới an toàn | `epChuoi` |
| Khoảng trắng / dòng trống đầu–cuối ⇒ cắt | lưới an toàn | `buildLines` |
| **In đậm tự động**: `**…**`; mọi từ VIẾT HOA ≥ 2 ký tự; "Dấu hiệu (nhận biết)"; nhãn đầu dòng `Ví dụ · Quy tắc · Lưu ý · Chú ý · Nhận xét · Định nghĩa · Định lí · Tính chất · Hệ quả · Ghi nhớ · Phương pháp · Bài toán · Mẹo · Cách giải · Kết luận · Bước N` + `:`/`.` | lúc render | `boldify` · `autoBold` |
| Nghiêng `*…*` | **không hỗ trợ** — đừng dùng (`spec-giai-bai` §A5) | — |
| Ảnh trong chữ `![](url)` ⇒ `<img>` (dùng cho lý thuyết); ảnh của câu đi bằng cột `anh_de` / `anh_dap_an` (URL bucket, không base64) | lúc render | `renderText` |
| **Dòng**: mỗi `\n` một dòng; dòng trống trong dữ liệu là ranh giới đoạn ⇒ hiện LIỀN, chỉ chừa khoảng trước dòng mở ý `a)`–`h)` | lúc render | `htmlDongLienTiep` (Thùy 07/10, 09/10) |
| **Lời giải hai phần**: nhận marker `**Phần 1. Hướng dẫn**` / `**Phần 2. Trình bày**` ⇒ hai tiêu đề; Phần 1 thành card (`**Mấu chốt:**`, chuỗi `**Bước k.**` ⇒ card dọc ↓ hoặc ngang → theo bề rộng, `**Chú ý:**`; sơ đồ tư duy: mệnh đề + mũi tên ⇑ + lý do); thiếu marker ⇒ hiện như chữ thường | lúc render | `tach2Phan` · `htmlPhan1` |
| Nhãn "Giải" / "Lời giải" / "Bài giải" ⇒ "Bài giải:" căn giữa, gạch chân (trang in, lý thuyết) | lúc render | `tachNhanGiai` (`src/lib/lythuyetBlocks.ts`) |
| Bài Hình nhiều ý: giả thiết (chung · dựng ở ý trước · của ý) **tô nền**, không ghi chữ "Đã biết" (Thùy 16/11) | lúc render | `GiaThietY` · `DeY` (`lib/kho/giaThietY.ts`) |

### 12.3 Quy ước dữ liệu mà hiển thị dựa vào

- **Trắc nghiệm**: đề dẫn ở `noi_dung`, 4 phương án ở `lua_chon` (mảng 4 chuỗi) — app tự vẽ lưới A–D; đề không chứa khối "A. … D." (prompt ERP còn tự cắt khối đó: `stripEmbeddedOpts`). Đ/S: mệnh đề ở `menh_de`.
- **Không nhãn "Câu N" / "Bài N"** đầu đề — hệ tự đánh số (nhãn ghép vào dòng đầu qua `prefix`); ERP tự cắt (`stripCauLabel`), dây chuyền không được ghi.
- **Hình**: app HS giới hạn hình cao 288 px ⇒ khung hình nhỏ thì chữ to; cỡ khung và luật vẽ ở `spec-giai-bai` Phần B › Hình › "Kích thước". Câu có chữ "[hình" mà thiếu `anh_de` không vào bài nào (§1).
- **Cổng trước khi ghi** phải bắt được cái hiển thị hỏng: công thức KaTeX render được, không ký tự điều khiển (`\t` `\f` `\b` lọt từ chuỗi JS) — `spec-giai-bai` §C6 điều 4, §A5 (viết LaTeX bằng Write / Edit).
- Chưa làm: khoảng cách dòng lời giải Hình +20 % (`spec-giai-bai` §C10 mục 7); hai quy ước dòng (đề thi: đoạn cách dòng trống · bài học Hình: `\n` đơn) chưa thống nhất (§C10 mục 12).
- **Thẻ lý thuyết dạng** `##ĐL ĐN TC CY PP VD NX BT`, khung màu, parser `lythuyetBlocks.ts`, chống mồ côi đầu khung khi in ⇒ **spec #2** (nguồn hiện tại `spec-format-noidung.md`). Khung "Bài tập tự luyện" bao cả cụm câu trên trang in (`DangBlock` / `CauFlow`) cũng ở đó.

## 13. Vẽ lại hình của kho

### 13.1 Luật ở đâu

- **Khi nào giữ ảnh gốc, khi nào vẽ lại, nhãn nguồn từng hình**: `spec-giai-bai` §A8 (Thùy 15/11 — gốc ổn GIỮ · gốc tệ có mã lỗi `a`–`f` VẼ LẠI · có LỆNH thì vẽ lại). Luật 13/10 "vẽ lại mọi ảnh không nằm ở `kho-anh/hinh_hoc/`" **đã hết hiệu lực** ⇒ "ảnh chưa vẽ bằng code" KHÔNG còn là việc tồn.
- **Vẽ thế nào** (dựng đúng dữ kiện bằng toạ độ · không vẽ sẵn đáp án · vuông tại A ⇒ AB đứng, AC ngang · ẩn số `bien` / `angleBien` · gạch bằng nhau ≤ 3, nhóm 4–6 dùng × · khung ≈ 520 × 400, cao ≤ 450 · nhiều hình con một ảnh, 2 hàng · hình theo ý Hình–Luyện · vẽ lại giữ đủ thông tin ảnh cũ, vênh đề thì theo đề): `spec-giai-bai` Phần B › "Hình — luật chung mọi khối" › "Vẽ hình" (`cat-luat.mjs <khối>` cắt kèm mục này cho trạm).
- **Brief cho trạm**: `docs/mau-brief-ve-lai-hinh.md` **đã xoá 15/11** (commit `0ee3866b`, nội dung đã vào mục "Vẽ hình" của `spec-giai-bai`). Giao trạm vẽ lại = đầu ra `cat-luat.mjs <khối>` + `viec.md` của gói (§C4: brief không chép luật; lời giao ghi thẳng luật phân xử). Vẽ mới: `kho-rules/hinh/ve-moi/BRIEF.md` (§8 L21).

### 13.2 Dây chuyền

| Bước | Ai | Lệnh | Ra |
|---|---|---|---|
| 0. Ra lệnh (khi có lệnh của Thùy / trưởng khối) | điều phối | `node scripts/kho/so-hinh.mjs lenh --kho <dai\|hgt\|hinh_hoc\|hinh_hoc_lop\|hinh_luyen\|hinh_luyen_y> (--khoi <k> \| --ma <mã,…> \| --de "<tên đề>") --ra-boi "<người>" [--ly-do "…"]` (chạy thử) → `--ghi` | dòng `kho_hinh_lenh_ve` (đang chờ tới khi có nhãn vẽ ghi sau nó) |
| 1. Xuất gói (chỉ đọc DB) | máy | Hình–Học: `node scripts/anh/ve_lai_xuat.mjs --khoi <k> \| --bai HH…,HH… [--moi-goi 8] [--ra <thư mục>]` · Hình–Luyện: `ve_lai_xuat.mjs --bang baitoan\|bienthe\|mohinh\|cachgiai [--khoi <k>] [--mo-hinh MH.…]` · hình theo ý: `scripts/hinh-luyen/ve_y_xuat.mjs --goi <gói> (--ma … \| --khoi <k> --tu 0 --so 6)` · HGT: `ve_lai_xuat_hgt.mjs --dang NDB…[,…] [--moi-goi 8] [--ten VT]` · đề thiếu hình: `ve_moi_xuat.mjs --khoi <k> [--chi-duyet] [--bai …] [--moi-goi 6]` | `<ra>/<gói>/viec.md` + `viec.json` (đề · đáp án · lời giải · tên tệp ra) + `cu/<tên>.png` (ảnh cũ); mặc định `C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh` |
| 2. Vẽ | trạm **Sonnet** (≤ 6–8 hình / gói; không Haiku) | tệp vẽ `scripts/anh/ve_lai/<gói>.mjs` (vẽ mới: `scripts/anh/ve_moi/`, theo ý: `scripts/hinh-luyen/ve/<gói>.mjs`) dùng `ve_hinh_lib.mjs` (`hinh()` + `xuatTat()`; mẫu `ve_lai/HH00021-1.mjs` — `_mau.mjs` mà đầu `ve_hinh_lib.mjs` nhắc không còn); vectơ: `ve_vecto_lib.mjs`; đồ thị / toạ độ / lượng giác / tích phân: `kho/do-thi.mjs` · `hinh-toado.mjs` · `hinh-luong-giac.mjs` · `hinh-giai-tich.mjs` · `k10-hinh.mjs` | `<gói>/moi/<tên>.png` (SVG → PNG 2x qua Chrome headless) + báo cáo mỗi hình một dòng. Trạm không sửa thư viện, không DB, không git, không sửa đề / lời giải |
| 3. Soát | điều phối (mở TỪNG bảng) | `node scripts/anh/ve_lai_bang.mjs <gói> […]` (trái cũ \| phải mới, 6 hình / bảng, ô "CHƯA CÓ") · `bang_hinh.mjs <thư mục> <bảng.png>` · `scripts/hinh-luyen/ve/to_soat.mjs <GÓI>` | `<gói>/bang-<n>.png`; lỗi ⇒ trả trạm, không tin báo cáo "đã đạt" |
| 4. Gắn | điều phối | `node --env-file=.env scripts/anh/gan_hinh.mjs <gói>/moi --thay --nguon <ve_lai:<a–f>\|ve_lenh\|ve_moi> [--bang …]` (chạy thử) → thêm `--ghi` | upload bucket `kho-anh` (một lần / tệp) + UPDATE cột ảnh + nhãn `kho_hinh_nguon` — **một transaction**; URL cũ ghi `scripts/anh/bien_ban/gan-hinh-<lúc>.json` TRƯỚC khi UPDATE; **ảnh cũ không xoá khỏi bucket** |
| 5. Sổ | máy | `node scripts/kho/so-hinh.mjs` | `kho-rules/SO-HINH.md` (commit cùng việc) |

- `--thay` mà không `--nguon` ⇒ script chặn (kho có đếm). Gói trộn nhiều nguồn ⇒ tách gói. Không `--thay` ⇒ không đè hình đã có.
- Vẽ xong ⇒ **đẩy lên kho ngay** (Thùy 13/11: hình chỉ nằm máy nhà ⇒ phải làm lại 140 hình).
- Đừng nối `| head` sau lệnh chạy tệp vẽ (EPIPE làm script chết).

### 13.3 Tên tệp ⇒ đích (`gan_hinh.mjs`; không đoán bảng từ tên — người gọi khai `--bang`)

| Tên tệp | Đích |
|---|---|
| `HHC…` / `HH…` (mã cũ) / `HHL…` (kho trên lớp) `.png` — không đuôi | `anh_de` **và** `anh_dap_an` (cùng một hình ở đề và lời giải, Thùy 07/10) |
| `…_de.png` · `…_lg.png` | chỉ hình đề · chỉ hình lời giải (lời giải kẻ thêm đường phụ) |
| `HHC001924+HHC001935_11.png` | `+` = nhiều câu dùng chung một hình; `_<ghi chú>` sau mã bị bỏ qua |
| `--bang baitoan` `BT.07.045.01.png` | `hinh_baitoan.anh_chuan` |
| `--bang bienthe` `<uuid>.png` / `<uuid>_lg.png` | `hinh_baitoan_bien_the.anh` / `anh_loi_giai` |
| `--bang mohinh` `MH.045.png` | `hinh_mo_hinh.anh_cau_hinh` |
| `--bang cachgiai` `<uuid>.png` | `hinh_cach_giai.anh_loi_giai` |
| `--bang hlbai` `HLB….png` · `--bang hly` `HLY….png` | `hinh_bai.anh_de` (giả thiết chung) · `hinh_y.anh_de` (hình riêng của ý, cộng dồn) |
| `--bang baiy` `HHB….png` | `hinh_hoc_bai_y` (bài nhiều ý kho Hình–Học; vẽ mới, `ve_moi_xuat.mjs`) |
| `--bang hgt` `T….png` | `hgt_cau_hoi.anh_de` (chỉ hình đề) |

Bảng Luyện: chỉ ghi đúng cột khai, bump `updated_at` như app; tên không khớp mẫu khoá ⇒ dừng, không làm gì.

### 13.4 Hiện trạng 17/11 (đếm URL; "code" = URL ở `kho-anh/hinh_hoc/` = hình đã vẽ bằng code qua `gan_hinh.mjs`)

| Kho | Có hình đề | Hình code | Ảnh khác (cắt từ tài liệu, phần lớn `kho-anh/nhap_kho/`) |
|---|---|---|---|
| `hinh_hoc_cau_hoi` K7 | 977 | 843 | 134 |
| K8 | 397 | 236 | 161 |
| K8T | 162 | 162 | 0 |
| K9 | 1.468 | 550 | 918 |
| K11 | 934 | 0 | 934 |
| **Hình–Học cộng** | **3.938** | **1.791** | **2.147** |
| `hinh_hoc_cau_lop` | 84 | 84 | 0 |
| `hgt_cau_hoi` | 1.160 | 70 | 1.090 |
| `dai_cau_hoi` | 8.598 | — (đồ thị / sơ đồ máy vẽ không theo đường này) | — |
| `hinh_bai` (Luyện) | 525 | 191 | 334 |
| `hinh_y` | 157 | 157 | 0 |
| `hinh_baitoan.anh_chuan` | 126 | 125 | 1 |
| `hinh_baitoan_bien_the.anh` | 78 | 78 | 0 |
| `hinh_mo_hinh.anh_cau_hinh` | 66 | 58 | 8 |
| `hinh_cach_giai.anh_loi_giai` | 6 | 6 | 0 |

- Đợt 13/10 đã vẽ xong K7 · 8 · 8T · 9 phần Học (330 câu / 295 tệp hình) + phần Luyện 209/209 (`hinh_baitoan` + biến thể) — DEVLOG 13/10. "Ảnh khác" ở K7 · 8 · 9 hiện nay chủ yếu là câu nhập SAU 13/10 (đề thi, đề cương) — theo luật 15/11 chỉ vẽ lại khi có mã lỗi hoặc có lệnh.
- **Nhãn nguồn** (`fn_kho_hinh_dem('Toán')`): 14.462 hình đề, **14.438 chưa rõ nguồn**, 24 `ve_moi` (16/11), 0 lệnh đang chờ. Ảnh cũ trước 15/11 để "chưa rõ" theo chủ ý (chỉ xét khi có lệnh theo khối, `spec-giai-bai` §C12); 118 câu mới sau 15/11 không nhãn ⇒ §8 L16.
- Biên bản gắn: 181 tệp trong `scripts/anh/bien_ban/` (13/10 → 16/11).
- **Chưa có luật vẽ lại** (theo `spec-giai-bai`): K11 hình không gian (934 hình đều là ảnh gốc), `hgt_cau_hoi` (dù đã có công cụ — §8 L22); đồ thị / bảng của câu Đại, HGT chưa có máy vẽ loại đó ⇒ giữ gốc + `**Chưa chắc:**`.
