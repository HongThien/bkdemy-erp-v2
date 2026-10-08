# LUỒNG KHO KIỂU 1 — nhập bài HỌC (Hình) từ file Word

> CEO (Thùy) gọi luồng này là **"kho kiểu 1"** (07–08/10/2026): MỘT file Word bài giảng (lý thuyết + các dạng bài + hướng dẫn giải) → ra **một bài học trọn vẹn** trong phần HỌC: bài + lý thuyết + câu (đề + lời giải) + hình (đề và lời giải). Đã chạy thật cho 5 bài Hình 7 (§6).
> Rule chi tiết về định dạng/hình nằm ở [`log-giai-hinh-hoc-bai.md`](log-giai-hinh-hoc-bai.md) (R1, R2, luồng hình đề). File này là **quy trình từ đầu đến cuối** — đọc cả hai trước khi nhập bài mới.

## 0. Bốn thứ một bài học gồm (bảng DB)

| Thứ | Bảng | Ghi chú |
|---|---|---|
| Bài | `hinh_hoc_bai` (`khoi`, `ten_bai`, `thu_tu`) | `ma_bai` (`HH000xx`) tự cấp từ sequence. `hinh_hoc_ban_do` chỉ là **view** — đừng INSERT vào đó. |
| Lý thuyết | `hinh_hoc_bai_ly_thuyet` (`ma_bai`, `noi_dung`) | `ma_dang` là cột generated — đừng ghi. |
| Câu | `hinh_hoc_cau_hoi` (`dang_chinh` = `ma_bai`, `noi_dung`, `loi_giai`, `thu_tu`, `anh_de`, `anh_dap_an`) | Mã câu `HHC00xxxx` tự cấp. 1 câu = 1 số trong sách, các ý a), b), c) nằm chung. |
| Hình | bucket `kho-anh/hinh_hoc/…` → `anh_de` **và** `anh_dap_an` | App HS đọc `anh_de` ở đề, `anh_dap_an` ở lời giải → ghi cùng 1 hình vào cả hai. |

Mọi thứ Claude ghi vào đều `da_duyet=false`, `nguon_giai='ai'`, `giai_method='claude_code'` — **Thùy duyệt trên ERP**.

## 1. Vai trò

- **Thùy (CEO):** duyệt trên ERP; trả lời các chỗ nghi vấn (đề lỗi, đọc hình).
- **Claude chính:** điều phối, đọc tài liệu, tạo bài, viết lý thuyết, soát bản nháp, ghi DB, gắn hình. **Không** tự giải hàng loạt.
- **Subagent Sonnet:** soạn đề + lời giải + hình theo nhóm ≤6 câu, chạy song song, chỉ ghi nháp ra scratchpad (Thùy 07/10: "dùng Sonnet để giải").
- **Subagent Sonnet thứ hai:** DUYỆT bản nháp của model yếu hơn (nếu có thử) và hoàn thiện.
- Model nhỏ (Haiku): đã thử 08/10 — xem §7. Chưa đạt cho kiểu việc này.

## 2. Các bước (lệnh thật)

**B1 — Trích Word.** Công thức trong Word là ảnh WMF → text extract mất sạch ("a) ;"). Dùng:
```
node scripts/anh/docx_trich.mjs "<file.docx>" <thu_muc_ra>
```
Ra `van_ban.md` (mỗi đoạn 1 dòng, hình/công thức đánh dấu ngay chỗ: `⟦image10.wmf⟧`) và `png/imageN.png` (WMF đổi PNG phóng 4x, jpeg/png gốc chép nguyên). Máy chặn chạy `.ps1` thì tool đã tự nạp qua `-Command`; đừng đổi ExecutionPolicy.

**B2 — Đọc và chia.** Đọc `van_ban.md`: tóm tắt lý thuyết (= whitelist kiến thức), các dạng, từng câu, "Hướng dẫn giải". Lập danh sách câu theo thứ tự sách. Soát ngay:
- số câu bị đánh số nhầm (vd bài 5: ba ý "13. a) b) c)" thật ra là của câu 12);
- hình jpeg/png nổi trong Word **lệch chỗ** so với câu → đối chiếu nội dung hình với đề;
- WMF **mất dấu mũ góc** và đôi khi mất ký tự ("AB = EF" là "BC = EF") → suy từ hình + hướng dẫn, số đo (45°, 60°…) phải xem ảnh.

**B3 — Tạo bài.** `INSERT INTO hinh_hoc_bai (khoi, ten_bai, thu_tu)` (thu_tu nối tiếp trong khối). Lấy `ma_bai` mới.

**B4 — Lý thuyết.** Viết `noi_dung` vào `hinh_hoc_bai_ly_thuyet` (INSERT … ON CONFLICT (ma_bai) DO UPDATE). Giữ đúng phát biểu của sách, viết tắt như sách "(ch - gn)". Định dạng như R2 (xuống dòng đơn, chỉ cách 1 dòng trống trước tiêu đề mục).

**B5 — Soạn câu (subagent).** Chia nhóm ≤6 câu/agent (chọn theo dạng; câu đọc hình đi cùng nhau). Giao bằng mẫu [`mau-brief-soan-hinh-hoc.md`](mau-brief-soan-hinh-hoc.md) (đổi mã bài, đường dẫn nguồn, **whitelist**, danh sách câu). Brief phải có: nguồn đã trích · luật R1/R2 · whitelist · định dạng đầu ra · cách vẽ hình · bắt buộc verify toạ độ · "cấm ghi DB". Đầu ra: `draft_<bài>_<nhóm>.md` + thư mục hình.

> **Whitelist = lý thuyết của chính bài đó + mọi bài trước** (Thùy: "lý thuyết chính là whitelist"). Bài tam giác vuông CẤM tam giác cân/đều/trung trực; bài tam giác cân CẤM chiều đảo tính chất trung trực (muốn chứng minh trung trực phải dùng định nghĩa), Pytago, đồng dạng, hình bình hành, lượng giác.

**B6 — Soát bản nháp (bắt buộc, đừng tin báo cáo agent).** (1) Chạy chế độ thử của B7 — nó lọc từ cấm theo whitelist. (2) `node scripts/anh/bang_hinh.mjs <thu_muc_hinh> <bang.png>` rồi Read bảng: nhãn cắt đáy, nhãn đè đường, hình sai dữ kiện, vẽ sẵn đáp án. (3) Đọc phần "nghi vấn" từng câu — gom lại hỏi Thùy một lượt. Agent nào báo "chưa xong / pending / cần xác nhận" thì **chưa phải bản nháp**.

**B7 — Nhập câu.**
```
node --env-file=.env scripts/anh/nhap_hh_tu_draft.mjs HH000xx draft1.md draft2.md … --cam "<regex từ cấm>" \
     --hinh <dirHinh1,dirHinh2> --ra <thu_muc_gan>            # chạy thử
… thêm  --ghi  (và  --bo-qua-canh-bao  khi đã xem từng cảnh báo)
```
Truyền file theo ĐÚNG thứ tự câu trong sách. Tool chuẩn hoá R1/R2, lọc từ cấm, INSERT 1 transaction, `thu_tu` nối tiếp, từ chối nhập chồng lên bài đã có câu, và chép hình sang `<ra>/<ma_cau>_<nhan>.png`.

**B8 — Gắn hình.** `node --env-file=.env scripts/anh/gan_hinh.mjs <thu_muc_gan>` (thử) rồi `--ghi`. Upload bằng `SUPABASE_SERVICE_ROLE` trong `.env.local` (không in ra), ghi `anh_de` + `anh_dap_an` trong 1 transaction. Đừng đòi Thùy cấp key — kiểm tên khoá trong `.env.local` trước.

**B9 — Kiểm cuối.** Mọi câu của bài: có `loi_giai`, đề/lời giải không dòng trống thừa, hình mở được (HEAD 200, `image/png`), `da_duyet=false`. Báo Thùy duyệt trên ERP + danh sách nghi vấn đã gom.

## 3. Luật cứng (tóm tắt — chi tiết ở `log-giai-hinh-hoc-bai.md`)

- **R1:** sau dấu chấm xuống dòng. **R2:** xuống dòng ĐƠN, đề không dòng trống nào, lời giải chỉ cách 1 dòng trống TRƯỚC ý b), c), d)…
- Đề **tự đủ dữ kiện không cần nhìn hình** (số đo, gạch bằng nhau, góc vuông ghi thẳng vào đề "biết …").
- Hình **dựng đúng dữ kiện đề bằng toạ độ**, không ước mắt; không vẽ sẵn **đáp án**; hai góc kề nhau đánh dấu bằng 2 bán kính khác nhau; canvas cao ≲450px, chừa ≥35px dưới nhãn đáy. Câu đề dựng bằng lời cũng phải có hình.
- Lời giải đã verify bằng toạ độ số (điểm "bất kỳ" thử ≥2 bộ). Ký hiệu đánh dấu góc bằng nhau gọi là **góc**, không gọi "cung" (cung lớp 9).
- Đề Word mâu thuẫn hình → ưu tiên hình, **ghi lại**, không tự sửa DB.

## 4. Bẫy đã gặp (đừng giẫm lại)

- Hiểu "sau chấm xuống dòng" thành cách một dòng trống → 34 câu phải sửa.
- Tưởng không có khoá upload → thật ra có sẵn trong `.env.local`.
- Cột `ma_dang` của `hinh_hoc_bai`/`hinh_hoc_bai_ly_thuyet` là generated; `hinh_hoc_ban_do` là view.
- 4 hình lớp 7 từng bị nhãn dưới cắt mép đáy; hình 15/16 cao quá bị app thu nhỏ → chữ bé.
- Điểm O của hình "AO = ON, AB ∥ MN" ước mắt bị lệch giao điểm: dữ kiện này BUỘC hình đối xứng qua O.
- Agent báo "hoàn tất, đã verify" mà thực ra chưa vẽ hình / chưa verify; tóm tắt của nó mô tả sai đề → luôn soát bản nháp (B6).
- Khi đề cần vị trí điểm ("tia nằm giữa", "K thuộc tia đối…") mà Word không ghi → agent phải ghi rõ cơ sở/lấy theo hình trong lời giải và báo ở nghi vấn.

## 5. Việc chưa làm trong luồng (đề xuất)

- Hình minh hoạ cho **lý thuyết** (định lí/trường hợp bằng nhau) — hiện lý thuyết chỉ có chữ.
- Công thức gom "chấm điểm bản nháp" thành tool (hiện làm bằng agent Sonnet đọc lại nguồn).
- Dọn ảnh mồ côi trong bucket (hình 1A cũ của HH00101) — chờ Thùy gật theo luật xoá.

## 6. Bài đã nhập bằng luồng này

| Bài | Tên | Câu | Ghi chú |
|---|---|---:|---|
| HH00099 | Tam giác bằng nhau — TH thứ nhất | 7 (Claude giải) | các câu còn lại do người soạn |
| HH00101 | Tam giác bằng nhau — TH thứ hai (c.g.c) | 15 | 1A–6B + tự luyện 11a, 12, 15 |
| HH00102 | Tam giác bằng nhau — TH thứ ba (g.c.g) | 12 | 7A–10B + tự luyện 11b, 13, 14, 16 |
| HH00103 | Các trường hợp bằng nhau của tam giác vuông | 16 | 1A–10, soạn bằng Sonnet; lý thuyết + hình đủ |
| HH00104 | Tam giác cân. Đường trung trực của đoạn thẳng | 21 | 1A–7B + tự luyện 8–14 (câu 12 gồm cả 3 ý bị đánh số nhầm "13."); Sonnet làm lại từ ảnh sau khi bản Haiku hỏng; lý thuyết + hình đủ |

## 7. Thử model nhỏ (Haiku) — 08/10/2026: KHÔNG đạt cho luồng này

Thùy nghe nói Haiku mới ổn nên cho thử: bài HH00104 (21 câu) chia 4 nhóm giao 4 agent Haiku soạn, rồi 4 agent Sonnet duyệt từng nhóm (đọc lại nguồn, sửa/làm lại, chấm bản Haiku). Tên model gọi là `haiku` (hệ thống không cho biết đúng phiên bản).

**Kết quả chấm của Sonnet trên 21 câu:** đúng-dùng-được **0** · sửa nhẹ **2** (1A, câu 8) · sai-phải-làm-lại hoặc bỏ dở **19**.

| Nhóm | Câu | Haiku tự báo | Thực tế |
|---|---|---|---|
| 1 | 1A–3B | "partial, pending" | 0 dùng được, 1 sửa nhẹ, 5 sai/bỏ dở (đọc sai ảnh 5/6 câu) |
| 2 | 4A–6B | "hoàn tất, đã verify ✓" | 6/6 không dùng được; tóm tắt mô tả sai đề; hình chưa vẽ; không chạy verify |
| 3 | 7A–10 | "remaining: vẽ hình, verify" | 0 dùng được, 1 sửa nhẹ, 4 làm lại; câu 9 dùng Pytago + cosin (cấm) |
| 4 | 11–14 | "khung, khó giải mã ảnh" | 0/4; 12–14 đề bịa; có chữ tự thoại "Tôi sai", dùng hình chữ nhật, căn bậc hai |

**Nguyên nhân gốc:** (1) không mở/đọc được ảnh công thức WMF rồi **bịa đề** thay vì ghi nghi vấn; (2) bỏ qua verify toạ độ và vẽ hình (có nhóm tự cho rằng "không cần vẽ hình" — sai luật); (3) báo cáo nói quá ("đã verify"); (4) vi phạm whitelist, để sót ghi chú tự thoại trong lời giải.

**Kết luận:** không giao Haiku khâu đọc đề từ ảnh + giải + verify + vẽ hình. Sửa bản Haiku còn tốn công hơn làm mới (Sonnet đã làm lại từ ảnh, không vá). Chỉ cân nhắc Haiku cho bước cơ học khi đề đã là text sạch (vd chuẩn hoá định dạng). **Luôn soát bản nháp, đừng tin báo cáo agent** (B6).
