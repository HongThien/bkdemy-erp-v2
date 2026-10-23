# HANDOFF-BAI-HOC — bài học còn hiệu lực (đừng đạp lại)

> Chép NGUYÊN VĂN mục ② + các bài học cuối file HANDOFF cũ.

---

## Mục lục (số dòng trong file này)

- dòng 36 — ⭐⭐⭐ LUẬT DUYỆT (Thùy 14/10, "nói bao lần rồi") — MỌI KHỐI, MỌI LÔ: muốn Thùy duy�
- Bài học 12→23/10 — Nông trại + app HS (cuối file)
- Bài học 14→20/10 — Kho K7 (đề thi, đề cương, bản đồ, hình) (ngay dưới LUẬT DUYỆT)
- Bài học 20→21/10 — builder bản đồ mới · ET · Chuyên đề (ngay dưới LUẬT DUYỆT)
- Bài học 17→19/10 — Bản đồ mới · Hình–Luyện · Kho đề thi (bản in)
- dòng 47 — Bài học 10→17/10 — Bổ trợ (đừng đạp lại)
- dòng 65 — Bài học 14/10 — Hình–Luyện cây nhánh + kho bài
- dòng 146 — Bài học 28/09–02/10 — luồng kho + đề thi (nhập, gán vào buổi, đọc PDF)
- dòng 551 — Bài học 08–09/09 — form câu, sinh bằng máy, quét kho
- dòng 580 — Bài học 12/08 — đọc dữ liệu & viết tài liệu
- dòng 627 — Bài học 12/08 (phần 2) — dựng sản phẩm & bẫy kỹ thuật
- dòng 714 — Bài học 08/09 — kho chuẩn & làm việc song song 2 phiên
- dòng 743 — Bài học 08–09/09 — hạ tầng đa phiên & deploy
- dòng 748 — Bài học 09/09 — BTVN ảnh xuyên 2 repo, tool vẽ, role RO
- dòng 770 — Bài học 09/09 tối — test đầu vào (luồng "biến mất im lặng")
- dòng 779 — Bài học 10–13/09 — test đầu vào: phiếu từ kit ChatGPT, form GV, phân công, asset
- dòng 812 — Bài học 10/09 tối — Claude nhập câu vào kho (HGT PT mặt phẳng)
- dòng 819 — Bài học 28/09 (đêm) — hàm Postgres chậm do CTE bị inline + trần timeout của app
- dòng 830 — Bài học 28/09 — thiết kế gamification HS với CEO (spec `spec-thanh-tuu-nhiem-vu.md`)
- dòng 866 — Bài học 29/09 — trợ lý: báo cáo Sư phạm + tổng kết tuần
- dòng 937 — Bài học 18–20/09 — quyền EXECUTE của function trên Supabase (sổ tay kiến thức)
- dòng 951 — Bài học 26/09 — hệ sự kiện (plpgsql · test theo vai · test UI qua ô trình duyệt ẩn)
- dòng 964 — Bài học 26–27/09 — game chạy thật (sự kiện) + game trong buổi học
- dòng 1019 — Bài học 20/09 — `format()` trong plpgsql, và lỗi bị UI nuốt
- dòng 1029 — Bài học 20/09 (phiên 3) — lọc vs xếp hạng, và "đã áp rồi"
- dòng 1040 — Bài học 16–27/09 — kho Hình học phase Học (cắm bảng mới vào module cũ)

---

## ② BÀI HỌC CÒN HIỆU LỰC (đừng đạp lại)

### Bài học 23/10 — Đánh giá cuối cấp (đo theo lần)
- **Hai hàm cùng xếp "gần nhất" trên một tập phải dùng CHUNG một khoá xếp, kể cả khi hoà.** Popup xếp `t tăng, luot tăng`, thẻ xếp `t giảm, luot tăng` ⇒ 2 lần cùng ngày đổi chỗ ⇒ popup lệch thẻ (TB5 88,2 vs 87,2). Kiểm bằng so dòng mới nhất của popup với thẻ trên CẢ LỚP (784/784), không chỉ 1 ô.
- **Ngưỡng "nhẹ/rõ" lấy từ phân bố thật, theo tầng.** Tầng ít lần (nhóm bài, cửa sổ 3/5) dao động gấp ~1,5 lần ⇒ dùng chung ngưỡng với tầng rộng là gắn "rõ" cho nhiễu (331 ô). Cách: SD của chênh, ngưỡng ≈ 0,5 SD / 1,5 SD.
- **Số đặt sát mũi tên bị đọc thành độ chênh** ("↓ 26" = 26 lần, Thùy đọc là giảm 26). Số phụ trên thẻ phải có đơn vị, hoặc để vào popup.

### ⭐⭐⭐ LUẬT DUYỆT (Thùy 14/10, "nói bao lần rồi") — MỌI KHỐI, MỌI LÔ: muốn Thùy duyệt gì thì PHẢI đưa một FILE HTML xem được

- **Mỗi lô cần Thùy duyệt/quyết (đề thi, đề cương, bài học, câu chưa chắc, bản đồ…) phải kèm MỘT trang HTML tự đủ**, dựng NGAY trong lượt báo cáo lô — không chờ bị hỏi, không chỉ liệt kê bằng chữ / đường dẫn `.md` / tên ảnh PNG rời.
- **Trang HTML gồm (khuôn `kho-rules/dai/lo/k7/CKI-7-duyet.html`, dựng bằng `build_duyet_html.mjs`):**
  ① mục **"Cần Thùy quyết"** ở ĐẦU: mỗi chỗ = tên đề · câu · trang file gốc · vấn đề MỘT câu · **ảnh NGUYÊN câu từ đề/sách gốc** · link nhảy xuống đề + lời giải;
  ② mục lục các đề (số câu, số "chưa chắc", kết luận soát);
  ③ **toàn bộ đề + hình + đáp số + lời giải** (Phần 1, Phần 2 bấm mở), công thức KaTeX render sẵn, câu "chưa chắc" tô viền cam.
- **File để cạnh `.soan.md`, mở bằng double-click là xem** (ảnh nhúng base64, KaTeX qua CDN). Đã có: `GKI` → `lo/k7/can-xem/index.html` (chỉ ảnh — thiếu đề/lời giải, nên làm lại theo khuôn mới khi cần), `DC-01.html`, `DC-02.html`, `CKI-7-duyet.html`.
- **Lỗi đã mắc (14/10):** soạn+soát+ghi 14 đề CKI-7 xong mà chỉ báo bằng bảng chữ + tên PNG, Thùy phải đòi lại HTML. Trạm SOÁT đã cắt ảnh cho CEO nhưng KHÔNG ai gom thành một trang — **bước "dựng HTML duyệt" là bước cuối BẮT BUỘC của mọi dây chuyền kho**, ngang hàng "ghi DB". Thiếu HTML = lô chưa xong.
- **Cũng nhớ:** phản hồi cuối của lượt phải NÊU ĐƯỜNG DẪN file HTML (link bấm được) trước, rồi mới tóm tắt chỗ cần quyết.

### Bài học 14→20/10 — Kho K7 (đề thi, đề cương, bản đồ, hình)

- **⭐ Nội dung BẢN ĐỒ (lý thuyết/ví dụ/dạng/gán dạng): làm xong chỉ là ĐỀ XUẤT trong HTML; ghi DB CHỈ khi Thùy nói rõ "ghi".** 20/10 "Claude điền" bị tôi hiểu thành ghi thẳng 6 trường ⇒ Thùy gắt "t đã bảo m ghi đâu" ⇒ phải gỡ về trống (Luật xoá: hỏi trước, gỡ chỉ khi nội dung còn y bản tôi ghi). Mẫu trang chọn Giữ/Gỡ/Sửa: \`K7-de-xuat-5-dang-so-thuc.html\`.
- **⭐ Muốn Thùy quyết gì ⇒ MỘT file HTML có nút chọn + "Sao chép câu trả lời"** (\`scripts/kho/de-thi/build-cau-hoi-html.mjs\`; danh sách chỗ cần quyết sinh bằng \`QUYET_JSON=… build-duyet-html.mjs\`). Báo cáo cuối nêu link file trước.
- **Trạng thái gán dạng của bản đồ mới KHÔNG đọc từ cột \`dai_cau_hoi.dang_chinh\`** (câu nhập từ đề vẫn \`T107000000\`): đọc ở \`dai_bdm_gan_cau\` + \`dai_bdm_de_xuat\` + \`dai_bdm_cau_thieu_dang\`. 20/10 tôi báo nhầm "395 câu chưa có trạng thái" vì chỉ xét 2 bảng sau; \`bdm-b3-xuat-lo.mjs\` báo 0 câu chưa gán mới lộ.
- **Trạm sinh JSON làm MẤT dấu \`\\\` của LaTeX** (\`\\left\`→\`left\`, \`\\dfrac\`→\`dfrac\`, \`\\right\`→ký tự điều khiển/xuống dòng): cổng cũ (\`$\` chẵn + JSON hợp lệ) và cả KaTeX parse đều KHÔNG bắt được vì \`left(dfrac{1}{3})\` là chữ hợp lệ. Kiểm bắt buộc trước khi ghi: không ký tự điều khiển; không từ ASCII ≥2 chữ trần trong \`$…$\` (ngoài \`\\text{}\`, ngoài \`cases\`); trạm ghi bằng công cụ Write với \`\\\\\`. Script kiểm cũng phải viết bằng Write (heredoc bash ăn \`\\\`).
- **Luật phạm vi (CEO 19–20/10): đề/câu có kiến thức KÌ 2 không phải KNTT HK1 ⇒ bỏ** (tỉ lệ thức, dãy tỉ số bằng nhau, tỉ lệ thuận/nghịch, hình hộp/lăng trụ/lập phương, đa thức). Phải ghi vào brief soạn VÀ soát: trạm soạn vẫn để lọt câu tỉ lệ thức (DC-04 Khác Bài 4), chỉ trạm soát bắt được.
- **Trạm SOÁT lỡ mở \`.soan.md\` trước khi giải mù xong** (3/6 trạm đề cương) ⇒ 30–40 câu đầu không mù hoàn toàn. Brief soát phải CẤM mở \`.soan.md\` tới khi \`.kiem.md\` đủ.
- **Đề rỗng do người tạo trong app vẫn có 1 dòng \`linkgen_jobs\` (pending, attempt 0) + 1 phần** — khi xoá đề phải kèm job; chạy thử ROLLBACK + kiểm FK (\`pg_constraint confrelid='tai_lieu'\`) trước.
- **Vẽ hình cho câu hỏi "khái niệm" (song song/vuông góc suy ra từ cặp góc bằng nhau):** vẽ đúng dữ kiện thì hình tự lộ đáp án; chỉ đánh dấu điều ĐỀ CHO (cung góc bằng nhau, ô vuông), không vẽ mũi tên song song. Hình đề + đáp án cùng một tệp (không đuôi) trừ khi lời giải cần thêm đường phụ (dùng đuôi \`_de\`).
- **Xoá câu khỏi kho: \`xoa_at\` (kho rác), không xoá cứng** (câu nhập từ đề không có FK trỏ vào nhưng \`tai_lieu_cau\` trỏ bằng text). Gỡ câu khỏi đề cương = xoá \`tai_lieu_cau\` + dọn \`cau_hinh.deThi.nhanCau/nhomBai/canhBaoCau\`.

### Bài học 20→21/10 — builder bản đồ mới · ET · Chuyên đề

- **⭐ Chạy `tsc` SAU MỖI lần sửa, kể cả sửa 1 dòng/1 chú thích.** 21/10 chèn `// chú thích` vào GIỮA một lời gọi hàm nhiều đối số ⇒ phần còn lại của dòng thành chú thích ⇒ Vite trắng màn (ngay sau vụ backtick 19/10). `sed` chèn chú thích cũng đã làm gãy 1 script kiểm cùng ngày.
- **Trước khi tạo bảng/hàm "mới" cho một nhánh, tra `pg_trigger` + `information_schema` xem đã có chưa:** HGT bản đồ mới đã có đủ 4 bảng từ 18/10 (phiên khác dựng) — suýt tạo trùng + thêm policy ghi rộng hơn. Chỗ thiếu thật chỉ là 1 hàm gốc (`_tl_bdm_cau_vi_tri`) — mở hàm gốc thì mọi hàm builder ăn theo.
- **Bài Hình–Luyện: `de_bai` là bản GỐC trọn (đã gồm các ý), đề hiển thị = `gia_thiet_chung`;** không có giả thiết chung + 1 ý = "bài một ý" (đề nằm trong ý, hình = hình ý → hình bài). In cả hai ⇒ đề lặp. Làm màn mới đọc dữ liệu cũ: chép đúng cách màn đang chạy hiển thị, đừng đoán theo tên cột.
- **Hàm `listTaiLieu(…, nhanh=null)` lọc CHỈ nhánh Đại** (null ≠ "mọi nhánh"; undefined mới là mọi nhánh) — danh sách nhiều nhánh phải truyền undefined.
- **Hàm plpgsql có `create temp table` phải `volatile`** (stable bị Postgres từ chối).
- **Unique "1 tài liệu / buổi" chỉ có cho `btvn`/`giao_trinh_buoi`, KHÔNG có cho `et`** (dữ liệu cũ có buổi 2 ET) ⇒ chặn trộn bản cũ/mới bằng trigger so `ban_do`, không thêm unique.
- **Lệnh shell: không mở đầu bằng `cat > file` khi không có heredoc** — treo chờ stdin tới timeout (dính 2 lần). Viết file bằng Write rồi chạy.
- **Browser pane ẩn (phiên không mở trong cửa sổ) ⇒ paged.js không dựng trang** (watchdog 30s); kiểm nội dung nguồn `.pv-src` thay vì đếm trang, và nhờ Thùy xem bản in thật.

### Bài học 17→19/10 — Bản đồ mới · Hình–Luyện · Kho đề thi (bản in)

- **⭐ Lớp phủ (overlay/modal) trong ERP phải z ≥ 65** — header ERP là `z-[60]`; z-50 nằm DƯỚI header, nút đóng bị che (đã dính 2 lần: Duyệt kho full màn, Catalog Hình).
- **⭐ Cột cố định + cột cuộn riêng:** khung ngoài `h-full min-h-0 overflow-hidden`, cột trái `flex min-h-0 flex-col`, cột phải `min-h-0 flex-1 overflow-y-auto`. Thiếu `min-h-0` ở bất kỳ tầng flex nào ⇒ cả hai cột cuộn chung (Thùy báo 2 lần ở Cây nhánh).
- **⭐ Bản in paged.js: `break-inside:avoid` trên khối CAO (câu nhiều ý + dòng kẻ) ⇒ nhảy nguyên khối sang trang mới, bỏ trống tới 257mm.** Đề thi giờ `.pv-dethi .pv-cau{break-inside:auto}` (giữ khối chỉ cho phương án TN / dòng Đ-S / cặp dòng kẻ / hình). **Đừng** thêm `.pv-math:first-child{break-after:avoid}` cho đề thi: đo thật, nó đẩy CẢ Phần 1 sang trang 2. Đo bằng JS trong Browser pane (khoảng trống cuối mỗi `.pagedjs_page`); **pane ẩn ⇒ paged.js không dựng xong (watchdog 30s)** — mở pane (`show_pane preview`) trước khi đo.
- **⭐ CSS nằm trong template literal JS: CẤM dấu backtick trong chú thích** — đóng chuỗi sớm, Vite "Missing semicolon", ERP trắng màn (19/10 đã push lên main 1 commit lỗi). Sửa xong PHẢI chạy `tsc` lại dù chỉ sửa chú thích.
- **Ghi `cau_hinh` jsonb dùng chung nhiều tính năng:** đọc bản DB rồi trộn ĐÚNG khoá đang sửa (`patchCauHinhDeThi`/`tronCauHinh`, null = bỏ khoá) — ghi nguyên object từ state client sẽ đè meta đề/số dòng do màn khác ghi.
- **Trigger PL/pgSQL dùng chung nhiều bảng:** không tham chiếu `NEW.<cột>` mà bảng kia không có — tách nhánh `IF TG_TABLE_NAME = …` (lỗi "record new has no field" chỉ hiện khi bảng đó INSERT).
- **Xoá danh mục có tham chiếu CHỮ (mã `DH.xxx` trong `canh_bao_yeu`/`bo_tro_yeu_dang`):** dò mọi cột text khớp mã trước khi đề xuất xoá, nêu cho Thùy chọn kho rác hay xoá cứng. Auto mode chặn tự áp migration xoá dữ liệu ⇒ viết + thử ROLLBACK, đưa lệnh cho Thùy chạy.

### Bài học 10→17/10 — Bổ trợ (đừng đạp lại)

- **⭐⭐ Đường ống nhiều tầng + MỘT điểm sai ⇒ lỗi hiện ở mọi tầng, nhưng chỉ sửa được ở một chỗ.** Dạng yếu "không đồng bộ bản đồ" (12/10) không nằm ở màn ca của em (đọc thẳng bản đồ, 0 mã chết) mà ở nơi TÍNH dạng yếu (đọc mã dạng CHÉP trên dòng đo). Đo bằng DB thật từng tầng trước khi sửa; đừng sửa chỗ hiển thị.
- **⭐ Muốn đưa một kiểu nội dung mới vào đường ống sẵn có: thêm NHÁNH vào registry + view giả-bảng cùng cột**, đừng viết lại đường ống. Hình mô hình vào case = 4 view `hmh_*` + 1 dòng ở mỗi hàm registry (`_kho_nhanh_cua_dang`, `_kho_ban_do_tbl`, `_kho_cau_tbl`, `_kho_lt_tbl`, `_kho_muc_do_dang`); KHÔNG đưa vào `_kho_ds_nhanh` thì các vòng đếm kho / tự luyện không thấy. **View đọc bảng có RLS phải `security_invoker = true`** (chủ view = chủ bảng bypass RLS ⇒ học sinh đọc được lời giải).
- **⭐ Sửa hàm = DỰNG TỪ ĐỊNH NGHĨA ĐANG CHẠY (`pg_get_functiondef`), thay chuỗi bằng `rep()` bắt buộc khớp ĐÚNG 1 lần, rồi chạy thử trong transaction ROLLBACK.** Nhiều phiên song song cùng sửa 1 hàm (`fn_mastery_cells` bị phiên khác đổi thang 3 bài giữa chừng) — bản từ file migration cũ sẽ ghi đè mất. Migration đã áp thì BẤT BIẾN: sửa tiếp = migration MỚI (đã làm ở `…1212`).
- **Script thử trong transaction: KHÔNG `.catch()` nuốt lỗi truy vấn** (transaction aborted, mọi lệnh sau lỗi im lặng; dính lại 14/10). Không đổi được role `authenticated` ⇒ kiểm quyền bằng ĐÓNG VAI qua `set_config('request.jwt.claims', …)` + gọi đúng RPC app gọi; view/RLS thì suy từ chính sách, nói rõ "chưa kiểm bằng role thật".
- **Số trên màn phải có ĐƠN VỊ cạnh số.** "Hoàn tất · 12/12" cạnh "1 dạng cần dạy" bị đọc thành "12 dạng" (thật ra 12/12 CÂU). Hai màn cùng một đại lượng phải cùng khuôn chữ ("còn 1/4 dạng cần dạy").
- **Một nguồn cho mọi bên nhìn.** Đuổi: HS thấy 280 dạng (cả chuyên đề), TA/ERP đếm 182 (mục tiêu) ⇒ không bao giờ trùng, không ai nhìn rõ tiến trình. Khi 2 màn cùng nói về một việc, làm MỘT RPC trả cả hai.
- **Danh sách có khoá tuần tự phải XẾP THEO THỨ TỰ KHOÁ**, không theo lúc tạo — nếu không người đọc thấy "dạng liền trước xong mà vẫn khoá" (dạng độ khó 3 nằm lẫn giữa độ khó 2). Ghi rõ "chờ «dạng nào»".
- **Phiên dev không đăng nhập được tài khoản HS** (chỉ quick-login Admin; `hs.html` chặn nhân sự). Kiểm màn HS bằng: lấy dữ liệu THẬT của 1 em qua RPC nhân sự (`fn_duoi_tien_trinh(hs)`), vá `supabase.rpc` rồi dựng component độc lập (import module qua Vite dev, `createRoot` từ `/node_modules/.vite/deps/react-dom_client.js?v=…`). Nhớ: vá `supabase.rpc` lần sau sẽ bọc lên bản đã vá ⇒ dữ liệu cũ (đã dính 15/10).
- **Gợi nhớ "người dùng thật bấm gì":** TA mở ca bù/đuổi ngoài lịch trực; em không nhớ mã HS (⇒ mã phải hiện ở MỌI việc); chị Thùy đọc số không đơn vị là hiểu sai. Mỗi tính năng bổ trợ mới: tự hỏi "TA cầm iPad của em lúc 21h sẽ thấy gì".

- **⭐⭐ Loại trừ "câu đã gặp" ở nơi gọi KHÔNG đủ nếu hàm con có nhánh "lặp lại".** Luyện≠test (17/10): `fn_btyeu_dong_ca` truyền danh sách tránh, nhưng `_btyeu_chon_cau` gọi theo cụm tự lặp trong cụm khi cụm hết ⇒ vẫn bốc câu cũ và nhánh "sang cụm khác" của người gọi không bao giờ chạy (hàm con luôn trả đủ). Đọc ĐỊNH NGHĨA hàm con trước khi tin "đã loại trừ". Đo bằng dữ liệu thật rồi mới đoán nguyên nhân: tưởng do kho mỏng, đo ra 20/32 ca trùng có kho >15 câu.
- **⭐ Đổi hành vi hàm dùng chung ⇒ THÊM hàm mới, đổi từng nơi gọi; KHÔNG đổi chữ ký/xoá hàm cũ** (`_btyeu_chon_cau` còn retest/bù/đuổi dùng; drop = luật xoá). "Cùng đề" so md5(chữ đề|hình|lựa chọn), không so mã (kho có câu trùng nội dung khác mã) và không so mỗi chữ đề (câu "Cho hình vẽ…" khác hình là khác đề).
- **Mô phỏng cả ca trong transaction ROLLBACK:** đóng vai HS (`request.jwt.claims` sub = tai_khoan của em) gọi RPC luyện nhiều lượt, chèn `bai_lam`/`bai_lam_cau` trực tiếp để "em trả lời", đổi vai Admin đóng ca, đo trùng; chạy cả hàm CŨ để chắc phép đo bắt được lỗi (14/18 → 0/18) và cả ca dở dang lúc deploy. `update buoi_hoc.ngay/diem_danh` bên trong tx để mượn ca sắp tới — hoàn tác hết.
- **Mỗi entry app (`main-*.tsx`) tự nạp CSS — thiếu `katex/dist/katex.min.css` thì `MathText` hiện "x2" thay vì x² và KHÔNG báo lỗi** (app TA thiếu từ lâu, khối "Câu trả lời ngắn" bị suốt). Thêm màn dùng `MathText` vào entry mới ⇒ kiểm entry đó đã nạp CSS công thức.
- **Màn "xem câu" cho nhân sự: đọc BẢN CHỤP đề (`bai_test_cau`), không đọc kho** — kho có thể đã sửa/xoá sau khi em làm; và chỉ lộ đáp án khi người bấm (iPad của TA hay đặt chung bàn với em).

### Bài học 14/10 — Hình–Luyện cây nhánh + kho bài

- **⭐⭐ "Vào kho" định nghĩa bằng ĐÚNG đơn vị CEO nói, không thêm điều kiện.** Hàng đợi "chưa phân mô hình" ban đầu tính theo ý chưa gán BÀI mô hình ⇒ gán mô hình xong bài vẫn treo; Thùy: *"thêm bài vào kho mô hình chỉ cần mô hình thôi"*. Trước khi viết điều kiện lọc hàng đợi, nói lại thành một câu ("bài ra khỏi hàng đợi khi …") và đối chiếu lời CEO.
- **⭐ Hàm SECURITY INVOKER gọi helper `_hl_*` ⇒ helper phải GRANT EXECUTE cho `authenticated`.** Revoke public rồi quên grant = `permission denied for function` chỉ lộ khi gọi bằng phiên đăng nhập (SQL bằng role ghi không thấy).
- **⭐ Thêm FK thứ hai giữa hai bảng đã có quan hệ ⇒ mọi embed PostgREST cũ chết (`PGRST201 more than one relationship`).** Sau migration thêm FK: grep `.select(` có tên bảng đó, sửa thành `bang!cot_fk!inner(...)`. Lỗi chỉ lộ khi mở màn.
- **Lưới UI chữ | hình: mỗi hàng một grid riêng ⇒ hàng cao bằng hình, chữ ngắn hở cả khoảng.** Dùng MỘT lưới cho cả bài, hình `grid-row: i / span n` qua các hàng dùng chung, `sticky` bên trong.
- **Vá file có regex/LaTeX/backtick: để nội dung trong file riêng (viết bằng Write) rồi script đọc vào, không nhét vào heredoc / `node -e` / template literal** — dấu `\` bị nuốt, backtick cắt chuỗi (14/10 dính 3 lần).
- **Dev server dùng chung với phiên song song tự tải lại liên tục** ⇒ kiểm UI bằng `javascript_tool` đo DOM (vd khoảng cách giữa 2 phần tử) + gọi RPC trực tiếp bằng script RO, đừng chờ ảnh chụp.

- **[Bot TA · 16/10] Biến môi trường của cron phải có trên ĐÚNG project chạy cron.** Code đúng, deploy đúng, thiếu `CRON_SECRET` trên project TA ⇒ im lặng không đăng (nhắc việc 23:30 hỏng từ đầu không ai biết). Sau mỗi lần thêm cron: `curl` endpoint không kèm secret — 401 là đủ biến, 500 "Thiếu …" là thiếu.
- **[Gami · 16/10] Thưởng theo thành tích phải ghi vào THỜI ĐIỂM ĐẠT, không phải lúc hệ thống phát hiện / em bấm nhận** — mở tính năng muộn thì quét bù cả mùa dồn vào tháng hiện tại. Sửa luật đã phát thưởng: chạy thử trong rollback, liệt kê từng em mất gì + ví có âm không, rồi mới xoá (Luật xoá) và chốt lại xu.
- **[Kỹ thuật · 16/10] JS `String.replace(a, b)` biến `$$` trong `b` thành `$`** ⇒ chèn khối SQL có `$$` bằng replace là hỏng thân hàm. Dùng `s.split(a).join(b)`.
- **[Bot TA · 15/10] Bản tin để CEO duyệt: gửi bản xem trước vào chat RIÊNG của Thùy (`ban-tin.mjs --gui-rieng`), mẫu 1 TA thì `--chi`; chỉ đăng nhóm khi được bảo "đăng".** Chữ trên tin phải đọc được không cần giải thích ("×2" bị chê ⇒ "2 học sinh"); từ "trễ" chỉ dùng khi thật sự có hạn đã qua mà người dùng đã có cách làm (chấm công hệ thống mới ra ⇒ "cần hoàn thành").
- **[Sơ đồ tổ chức · 15/10] Hai bảng cùng trả lời một câu hỏi ("ai phụ trách khối") = chồng chéo chắc chắn sẽ lệch.** Gộp về một nguồn, chuyển hàm đọc sang nguồn đó và KIỂM TRÙNG KẾT QUẢ trước/sau (md5 danh sách người nhận việc) trước khi áp; bảng cũ giữ, không xoá.
- **[Chấm công TA · 14/10 tối] Test phải đi ĐÚNG đường người dùng bấm, không phải đường người viết test nghĩ ra.** Test cũ khai bổ trợ qua "Thêm việc ngoài lịch" (tự chọn lớp) nên xanh hết, trong khi ô gợi ý — đường TA thật bấm — chết với MỌI buổi bổ trợ (buổi bổ trợ không có `lop_id`). Cách: lấy dữ liệu thật của hôm nay, đóng vai từng người, gọi ĐÚNG hàm mà nút đó gọi với ĐÚNG tham số màn truyền (`test_goi_y_bo_tro.mjs`).
- **[Chấm công TA · 14/10 tối] Sửa kỹ thuật mà làm đổi tiền đã trả ⇒ đó là luật, hỏi CEO.** Gộp giờ bổ trợ trùng nhìn như sửa lỗi, nhưng chạy lại T9 thì 6 TA giảm ~495k — luôn chạy `kiemchuan.mjs` trước/sau và so từng người khi đụng `_ta_luong_tinh`.
- **[Bot Telegram · 14/10] Telegram chỉ giữ update cho bot 24h, Bot API không đọc lại lịch sử nhóm** ⇒ ghi DB ngay lúc nhận (webhook), không đợi cuối ngày. Có webhook thì `getUpdates` bị khoá. Privacy mode phải tắt TRƯỚC khi bot vào nhóm.
- **[Chấm công TA · 14/10] "Lớp của TA" cho một NGÀY QUÁ KHỨ phải đọc phân công TẠI ngày đó, không đọc bảng phân công hiện tại.** Mig gốc đọc `phan_cong_lop` ở 4 chỗ (gợi ý, lớp mặc định, làm hộ, thiếu công) ⇒ đúng cho hôm nay, sai lặng lẽ cho mọi ngày trước khi phân công / sau khi rút. Test chỉ chạy "hôm nay" thì không bao giờ lộ — phải dựng kịch bản BÀN GIAO giữa kỳ (TA cũ rút, TA mới vào cùng ngày) và kiểm cả hai phía của ngày đó.
- **[Chấm công TA · 14/10] Đo thời gian hàm tổng hợp trên DB THẬT trước khi gắn màn.** `fn_ta_luong_thang` qua mọi test logic nhưng chạy 9,3s (> trần ~8s của API ⇒ màn báo lỗi); bản gốc đã 6,9s mà không ai đo. Nguyên nhân: subquery tương quan nối từ cột KHÔNG index (`gami_grades.buoi_hoc_id`) ⇒ quét 148k dòng × 148 lần. Cách: EXPLAIN ANALYZE thân hàm (thay tham số bằng hằng), xem SubPlan nào `loops × time` lớn; đổi chiều nối qua bảng có index, kiểm kết quả giống hệt bản cũ.
- **[Công cụ · 14/10] `scripts/migrate.mjs` KHÔNG có `--help`: cờ lạ = lệnh áp TRẦN mọi file treo** (của phiên khác). Lần này chết ngay file đầu nên không lọt gì. Muốn biết cờ thì đọc nguồn script; chỉ dùng `--status` / `--only <file>`.

- **[Chấm công TA · 13/10] Viết "kết quả mong đợi" cho từng kịch bản TRƯỚC khi tin luật là đúng.** Hai lỗi của hàm DB chỉ lộ ra lúc viết mockup: `fn_ta_buoi_thieu_cong` tính cả buổi hôm nay chưa diễn ra là "thiếu công", và loại việc trực bổ trợ khối bắt chọn lớp dù ca trực không gắn lớp. Test hàm đơn lẻ không bắt được vì không ai hỏi "người dùng sẽ thấy gì lúc 9 giờ sáng".
- **[Chấm công TA · 13/10] Dữ liệu gốc do người bấm thì KHÔNG sửa; người duyệt chỉnh thì ghi cột riêng** (`vao_at/ra_at` vs `vao_chot/ra_chot`). Trạng thái suy được (quên ra ca = chưa có giờ ra mà đã sang ngày khác) thì suy, không lưu cờ.

- **[LƯƠNG TA · 12/10] Lớp phụ trách lấy từ `phan_cong_lop`, KHÔNG suy từ sheet; và `phan_cong_lop.created_at` là ngày NHẬP ERP, không phải ngày bắt đầu thật.** Suy từ sheet làm Duy ra 0đ; lịch sử phân công chỉ có từ khi trigger `phan_cong_lop_log` chạy ⇒ chấm công mới là chân lý.
- **[LƯƠNG TA · 12/10] Luật "một lần" phải cài ĐỦ HAI NỬA.** "Trông thi lớp mình tính vào TG, không trả riêng" = (bỏ tiền) VÀ (cộng 1 buổi TG). Cài nửa đầu thì mất công TG khi hôm đó chỉ có dòng trông thi. Test luôn có ca "chỉ có MỘT trong hai dòng".
- **[LƯƠNG TA · 12/10] Mọi số tính lương phải theo KỲ (as-of), không theo "bây giờ".** Sĩ số = trung bình mỗi ngày của tháng (`hoc_sinh_lop.ngay_vao/ngay_roi`), đơn giá = dòng `ta_don_gia` có `hieu_luc_tu` ≤ đầu kỳ. Lấy sĩ số hiện tại làm lương nhảy khi lớp nhận thêm HS.
- **[LƯƠNG TA · 12/10] "Buổi đã đóng BTVN" ≠ "TA đã chấm".** Bằng chứng TA chấm = `gami_grades.graded_by` (→ `tai_khoan.nhan_su_id`) trong hạn. BTVN online chưa chấm, buổi thi/MT không có câu đều không tính.
- **[Công cụ · 12/10] Heredoc bash KHÔNG quote làm shell nuốt `$`/backtick trong code** (và cả lệnh dài có dấu nháy lạ có thể báo lỗi cú pháp trước khi chạy). Nội dung dài/chứa code ⇒ ghi bằng công cụ Write rồi chạy file.

- **⭐ HỌC PHÍ — ba lỗi tính tiền & luật để không mắc lại (06/10):**
  ① **Số ĐÃ ĐÓNG BĂNG không được cộng lại như số mới.** Hoá đơn chốt kỳ sau chứa dòng "Nợ kỳ trước" (`hoa_don_dong.loai='no_ky_truoc'`); nợ tổng = nợ_đầu_kỳ + Σ(tong_tien − dòng mang sang) − Σ thu — KHÔNG phải Σ tong_tien − Σ thu (đếm đôi, kỳ thứ 3 đếm ba). Nợ_đầu_kỳ = max(`no_khoi_tao`, dòng mang sang của hoá đơn chốt ĐẦU TIÊN) vì `no_khoi_tao` bị đặt về 0 sau khi thu. Hai hàm `fn_hocphi_so_du_no` + `fn_hocphi_no_theo_ph` PHẢI cùng công thức (đã kiểm khớp 0 lệch). Thêm loại dòng "mang sang" nào vào hoá đơn ⇒ sửa cả hai hàm.
  ② **Quan hệ (HS × lớp) có LỊCH SỬ — đừng ghi đè.** `hoc_sinh_lop` unique (hoc_sinh_id, lop_id) + upsert `nhansu.ts:588` đặt lại ngày vào/rời trên dòng cũ ⇒ buổi đã học rụng khỏi học phí, hỏng ÂM THẦM. `hoc_phi_theo_mon_ky` giờ tính buổi nếu trong khoảng ghi danh HOẶC có điểm danh thật (nhân chứng độc lập, §2 "map lại quan hệ đã mất"); dòng đã rời: buổi chưa điểm danh KHÔNG tính (§1.5). Gốc chưa sửa — thêm tính năng đụng ghi danh thì nhớ nó vẫn ghi đè.
  ③ **"Đã bù" = có mặt (điểm danh) ở buổi bù chưa huỷ, KHÔNG phải buổi bù đã `hoan_tat`.** Buổi bù huỷ / HS vắng ở buổi bù = không tính là bù; "đã xếp" = còn hiệu lực chưa học. Tab Bổ trợ bù "Đã xếp" tách 2 nhóm theo cùng luật.
  ④ **Sửa số tiền đã chốt (hoá đơn) = việc có người nhận:** luôn (a) dry-run đọc-thuần in từng PH trước→sau, (b) tìm "trả thừa" (thu > tổng mới) và ca bất thường (mới > cũ) — dry-run đầu từng ra 5,3M trả thừa vì thiếu nợ_đầu_kỳ, (c) giữ bảng sao lưu giá trị cũ trong CÙNG migration, (d) tính lại `trang_thai` theo luật `fn_hoa_don_cap_nhat_trang_thai` (trigger chỉ chạy khi `thanh_toan` đổi), (e) báo Thùy gửi lại phiếu/QR cho PH bị đổi. Dòng về 0đ: để 0 + UI ẩn, không xoá (luật xoá).
  ⑤ Áp migration khi có file treo của người khác: `node scripts/migrate.mjs --only <file>` — `npm run migrate` áp hết (đã thấy 13 file treo). Nhật ký chi tiết: DEVLOG 06/10.
- **⭐ Giao diện game app HS (03/10):** ① khung đo kích thước phải là **ref dạng hàm** (`useState` làm ref + effect theo phần tử) — `useRef` + effect `[]` thì khung bị gỡ rồi gắn lại (vào game nhúng rồi lùi) không được đo lại,
  ResizeObserver của khung cũ còn bắn 0 ⇒ màn trống (đã dính Chinh phục BK) · ② Tailwind v4 `-translate-x-1/2` dùng thuộc tính CSS `translate` riêng — thêm `transform: translateX(-50%)` là dịch 2 lần ·
  ③ ảnh `absolute` vẽ đè chữ tĩnh đứng trước nó ⇒ nhãn để lớp riêng sau cùng (`relative z-10`) · ④ style ảnh truyền đúng `width/height`, không phải `w/h` (ảnh hiện cỡ gốc phủ màn) ·
  ⑤ cờ Preview/Production đọc `VERCEL_ENV` lúc build (define), đừng đoán bằng hostname · ⑥ pane trình duyệt bị ẩn thì rAF/timer chậm ⇒ không kiểm hoạt cảnh chuyển màn bằng ảnh chụp được — kiểm bằng logic + để Thùy xem máy thật ·
  ⑦ Bash: `cat > file` thiếu heredoc là treo chờ stdin; script vá nhiều dòng thì Write file `.cjs` vào scratchpad rồi `node` (xử CRLF bằng split/join).
- **⭐ Giao diện app HS — bài học bổ sung cuối ngày 03/10:** ① **hiệu ứng "giật" thường là KHOẢNG TRỐNG chứ không phải hiệu ứng** — đo chuỗi chunk → RPC → giải mã ảnh trước khi chỉnh easing; nạp trước + 1 màn chờ chung + lớp chồng màn cũ/mới · ② effect có cờ chống chạy lại thì cleanup PHẢI mở cờ (StrictMode) ·
  ③ nén ảnh nhân vật/boss: **ĐO độ nét (Laplacian) trước khi chọn chất lượng WebP** — q82 mất 17% ⇒ "mờ"; q95 giữ 96% · ④ ảnh vẽ cố định chiều dài (tia laser) không co giãn được ⇒ dời diễn viên (boss lao tới), đừng kéo ảnh · ⑤ vị trí công trình trên nền: **xếp chồng lên nền rồi so với reference bằng mắt** (khớp tự động theo màu sai vì công trình sinh lại khác reference);
  tuyến đường trong DESIGN.md chỉ xấp xỉ ⇒ dò lại · ⑥ pane trình duyệt ẩn thì hoạt ảnh CSS/WAAPI đứng ⇒ xác nhận bằng TRẠNG THÁI (data-attr, toạ độ, số phần tử) và chụp sau khi ép `currentTime`; đừng kết luận "không chạy" · ⑦ `vite-plugin-pwa`: URL có query + `navigateFallback` ⇒ iframe trả app shell, phải `navigateFallbackDenylist` ·
  ⑧ script vá file CRLF: normalize rồi ghi lại đúng kiểu; **heredoc >~120 dòng bị cắt ⇒ dùng Write tool**; `String.replace` có `$&` ⇒ `split/join` · ⑨ gói CC0 chỉ có PSD: `ag-psd` + `@napi-rs/canvas` (chạy qua stdin từ cwd repo) · ⑩ nội dung hướng dẫn: số chưa chốt thì KHÔNG nêu, chức năng chưa có màn thì gắn "Sắp có" — đừng hứa trong tài liệu.

- **⭐ AI LÀM ĐÁP ÁN / ÁNH XẠ HÀNG LOẠT (chốt 03/10, kho Anh + Hạt Mầm KHTN):**
  - **Bên giải phải MÙ thật:** đáp án để ngoài thư mục bên giải đọc (thư mục anh em `<dir>_khoa/`), cổng là MÁY so — không phải agent tự so.
  - **Model tự khai "chắc" vẫn sai ~0,3%** (Sonnet: "the chair of ___ one leg" chọn whose thay which). Câu CÓ đáp án đối chứng ⇒ một bên giải + cổng so là đủ;
    câu KHÔNG có đáp án ⇒ phải 2 bên độc lập trùng nhau mới nhận. Chọn model bằng đo trên mẫu có đáp án (Haiku: câu chắc mà sai ⇒ loại), không theo cảm giác.
  - **Agent đặt CÙNG TÊN cho nhiều nhóm = ý muốn gom 1 dạng** ⇒ script nhập phải gộp theo (chuyên đề, tên) trước khi tạo thẻ, không thì học thuật thấy N thẻ cho 1 dạng.
  - **Chặn nhập đè theo TỪNG CÂU (khoá tự nhiên `ten_de_goc`), không theo cả lô** ⇒ lượt sau vẫn nhập được phần còn treo mà không nhân bản.
  - Ghi hàng nghìn dòng qua mạng: gom 1 lệnh `unnest(...)` — từng câu một ⇒ >5 phút cho ~1.000 dòng.
  - Bên giải mù bắt được LỖI DỮ LIỆU người đọc code không thấy (phương án dính câu sau, ngữ liệu cắt cụt, cau_so lệch) ⇒ luôn gom `de_loi` thành danh sách cho GV.

- **⭐ ĐỒ HOẠ APP HS / ĐƠN CHATGPT (chốt 02/10, luồng Giao diện — bản đồ phiêu lưu):**
  - **Đơn ChatGPT LUÔN theo giao thức kit** (`design/CHATGPT-UI-KIT.md`): ① 1 ảnh toàn cảnh chi tiết ② vẽ lại TỪNG thành phần của chính ảnh đó ③ file mô tả vị trí. Đơn 7 tự ghi "không DESIGN.md, không zip"
    ⇒ mảnh vẽ độc lập không khớp nhau, phải làm lại. ChatGPT hết lượt / không giao file vị trí ⇒ Claude tự đo (lưới % trên ảnh), nhưng phải ghép thử ra ảnh để soi trước khi đưa vào app.
  - **Chọn giữa "giống ảnh mẫu" và "nhu cầu sản phẩm" thì HỎI Thùy** — CTO từng chọn tấm đất liền 1 lớp cho giống ảnh gốc, bỏ qua bộ mảnh rời Thùy đã đặt vẽ (để bỏ bớt lục địa theo số chủ đề).
    Đúng: mảnh rời + toạ độ theo ảnh gốc. "Ghép rời" KHÔNG có nghĩa là xếp lưới.
  - **Ảnh ChatGPT vẽ lại KHÔNG trùng dáng ảnh gốc** ⇒ dò toạ độ tự động bằng so màu ra sai cỡ. Dùng tâm vùng đo trên ảnh gốc + nới bề rộng tới khi khớp, ghép thử 1–2 vòng.
  - **Đặt vật lên tranh: tranh và toạ độ phải cùng 1 khung.** Nền `object-cover` (cắt mép theo ô) + mốc đặt theo khung 16:9 ⇒ lệch dù đo đúng. Vẽ tranh TRONG khung 16:9, phần thừa = chính tranh phóng to mờ.
  - **Toạ độ đo bằng mắt trên tranh trơn không đủ chính xác để đặt công trình vào bãi đất** ⇒ đặt vẽ SẴN đường + bệ trong tranh (Đơn 10), code chỉ gắn đồ lên bệ.
  - **Nén ảnh về cỡ hiển thị trước khi dùng:** ảnh gốc 1536×1024 giải nén ≈6MB/ảnh (10 ảnh ≈60MB ⇒ Safari iPad cũ giật/tự tải lại); WebP cạnh dài 640 ≈1MB giải nén. Công cụ: `@napi-rs/canvas` có sẵn trong node_modules.
  - **Hoạt ảnh chạy theo requestAnimationFrame dừng hẳn khi tab/khung ẩn** ⇒ thứ gì CHẶN nút (vd chiêu ở màn đấu) phải có chốt thời gian (`Promise.race` 4 giây).
  - **Tailwind v4: `-translate-x-1/2` dùng thuộc tính `translate` riêng** ⇒ thêm `style.transform` chỉ để scale; viết lại translateX(-50%) là lệch đôi.
  - **Cảnh bản đồ phải do HOẠ SĨ vẽ liền 1 tranh rồi tách thành phần** (ảnh to → thành phần → bố cục). Nền trơn + đường code + công trình dán rời = 3 nguồn khác góc nhìn/ánh sáng
    ⇒ "không thật" dù toạ độ đúng (Thùy chê tầng lục địa 02/10). Code chỉ vẽ thứ ĐỘNG (nhãn, sao, mũi tên, cờ, sương, đoạn đã đi).
  - Dò vị trí trên tranh: vùng màu phẳng liên thông (ô 8px, chênh màu + nhiễu thấp) chính xác hơn đo mắt — nhưng cỏ/lá nhiều vân phải nới ngưỡng + loại tay vệt bóng; luôn soi ảnh đánh dấu.
  - Đường vẽ bằng code trên tranh nhìn chéo phải dựng trên MẶT ĐẤT rồi chiếu (y × độ nghiêng, xa nhỏ gần to, thành phía gần) — dải đều bề ngang trông như nhìn thẳng từ trên trời.
  - Windows không phân biệt hoa thường tên file: `DuongThree.tsx` đụng `duongThree.ts` (tsc TS1261, Vite lỗi export) ⇒ đặt tên khác hẳn.
  - Nhãn trên tranh: chữ KHÔNG khung + viền dày màu nền (`San2D.CHU_VIEN`) đọc rõ mọi nền; sao tiến độ chưa đạt phải RỖNG (tô nhạt nhìn như đầy).
  - **Kit ghi tuyến đường "xấp xỉ" ⇒ luôn DÒ LẠI từ nền:** mặt nạ màu đường + A* (rẻ trên lòng đường, đắt khi băng rừng/nước) giữa các mốc. Mỗi nền một mặt nạ riêng (sa mạc: đường lát đá nhạt s .26–.39 khác cát s ≥ .43; đầm lầy đổi màu khi Thùy đổi nền ⇒ mặt nạ cũ chỉ bắt 0,5% — kiểm % mặt nạ + soi ảnh).
    **Thứ tự công trình phải theo ĐƯỜNG THẬT** (đầm lầy kit ghi đền 5/hang 6, đường đi qua hang trước ⇒ đổi chỗ), nếu không nhân vật băng nước/quay lại.
  - **Làm mờ/lọc màu nền ⇒ công trình nét trông "dán" (giả)** — Thùy chê 2 lần; để nền NGUYÊN BẢN, chỉ thêm ánh sáng cạnh công trình. Muốn nền dịu ⇒ nhờ hoạ sĩ vẽ nền mới (v4).
  - **Chữ/sao đè tranh: LUẬT KHÔNG ĐÈ NHAU** — đừng đặt nhãn cố định dưới chân; đo nhãn thật (hộp nhãn rộng tới maxWidth dù chữ ngắn ⇒ đo bằng `Range`) rồi quét lưới tránh công trình/nhãn khác. Sao trùng màu nền ⇒ vàng rực + viền tối dày + viên thuốc tối phía sau.
  - **Sprite chạy: neo ĐẤT đo từng khung (đáy hộp alpha), cỡ thân CÙNG một tỉ lệ cho cả chu kỳ** (neo riêng từng khung dùng để đặt chân, không đổi cỡ) + delta thời gian. Tài liệu kit hay lỗi thời (Thùy đổi tên file/khung giữa chừng) ⇒ bám file thật. Tốc độ chạy tính theo CHIỀU CAO NGƯỜI, không theo bề ngang màn (490px/s ≈ 6 người/s = "như gió").
  - **Z-order nhân vật cộng ~3,5% độ sâu** để luôn đứng TRƯỚC cửa công trình đang tới (không thì tháp che mất người); sương phải z ngay trên công trình của nó, dưới nhân vật.
  - **Soi hiệu ứng canvas/rAF trong pane Browser:** pane ẩn ⇒ `requestAnimationFrame` đứng (canvas im, tư thế kẹt) ⇒ thay rAF bằng `setTimeout` khi test, và đóng băng đúng khung bằng `window.__dtDung=<ms>` (dev, trong `hieuUng.ts`); canvas chỉ hiện trong ảnh chụp sau khi `getImageData` đọc lại. Script `| head` ⇒ EPIPE cắt ngang (kit nén dở, file sinh chưa ghi) — ghi log ra file.
  - **Nhân vật chính ≠ NPC dẫn truyện** (Thùy 02/10): chính = nhà thám hiểm (`heroChay.ts`), NPC = bé trai+mèo / bé gái+cú (`Skin.nhanVat`). Đừng dùng NPC làm nhân vật của em.

### Bài học 28/09–02/10 — luồng kho + đề thi (nhập, gán vào buổi, đọc PDF)

- **⭐ Làm theo LÁT dùng được ngay, không dựng cả dây chuyền rồi mới chạy.** Thùy chê thẳng khi bản đồ + gán mẫu + skill gán dạng chồng lên nhau mà thứ
  cần gấp (1 đề PDF → 1 đề trên ERP) chưa có. Mỗi lát phải có "xong khi" là một việc người dùng làm được.
- **⭐ Tính năng mới phải KHỚP KHUÔN CŨ trước, dạy thêm sau.** Gán đề vào buổi: chép phần của đề thành phần `dang` / `btvn` (mã dạng trống) đúng khuôn
  giáo trình trích xuất ⇒ in, chấm BTVN, mở app, đánh số buổi chạy ngay; chỉ phải dạy thêm 3 chỗ. Phương án "giữ phần `custom`" đòi dạy lại ~10 chỗ
  đọc, mỗi chỗ quên là một lỗi im lặng. Trước khi viết: đọc hết các nơi đang lọc theo `loai_phan`.
- **⭐ Dạng chờ (`…000000`) không được lọt vào `bai_test_cau.ma_dang`.** `fn_mastery_cells` chỉ loại `ma_dang is null` ⇒ ghi mã chờ là đẻ một "dạng yếu"
  giả trên bản đồ và kéo cả bổ trợ. Để trống lúc chụp, trigger điền khi câu có dạng thật.
- **App HS có HAI lớp lọc câu của giáo trình online:** RLS `_btc_trang_thai` (mở theo câu hoặc theo dạng) và một lớp lọc nữa ở client
  `getBaiTestFull` (trước 01/10 chỉ nhận mở theo dạng). Đổi luật mở câu phải sửa cả hai, không thì DB cho mà app vẫn giấu.
- **⭐ Deploy tay ⇒ bản app đang chạy là bản CŨ; thay đổi phía DB phải đúng với CẢ client cũ.** 01/10: sửa lớp lọc client trong repo (nhận câu mở lẻ) rồi coi
  như xong, trong khi học sinh dùng bản Vercel chưa deploy ⇒ lớp chỉ thấy câu 1. "Đọc DB thấy 22/22 câu đã mở" KHÔNG phải bằng chứng học sinh thấy 22 câu —
  dấu hiệu có sẵn mà CTO bỏ qua: 3 em vào làm, cả 3 chỉ có đúng 1 câu trả lời. Kiểm đường của người dùng thật (bản đang chạy), không chỉ đường của code mới.
- **⭐ Tính năng mới phải gắn vào CHỖ THAO TÁC ĐANG DIỄN RA, không phải chỗ CTO vừa dựng.** 02/10: làm 2 chế độ phát hành nhưng đặt chỗ chọn ở Kho đề thi + tab Live,
  còn nút 📱 ở Kho tài liệu — nơi mọi người vẫn bấm phát hành — lại để mặc định im lặng. Thùy: "chọn chế độ phát hành là phải chọn từ kho tài liệu chứ."
  Trước khi đặt một nút: hỏi "hôm nay người ta làm việc này ở màn nào?".
- **Hạ tầng "mở dần" có sẵn 2 tầng (theo dạng 13/09 · theo câu 19/09 của luồng Học online, DB đã áp, màn ở nhánh chưa merge).** Trước khi thêm cơ chế, dò `pg_proc` +
  `git branch -a` + sổ `_migrations` xem luồng khác đã dựng gì — 02/10 nhờ vậy chỉ thêm 2 hàm thay vì một bảng mới.
- **Hàm `security definer` do `claude_build` sở hữu không gọi được `auth.uid()`** ("permission denied for schema auth") — dùng `public.jwt_uid()`.
  Bản chạy thử có giả phiên mới bắt được; `create function` thì trót lọt.
- **⭐ Chạy thử migration trước khi áp:** `thu-migration.mjs --kiem` (transaction + SAVEPOINT từng câu + ROLLBACK) cho phép duyệt đề, gán, mở thi,
  đổi dạng… trên dữ liệu thật mà không để lại gì. Ca "phải bị chặn" cũng viết vào file kiểm (kỳ vọng lỗi).
- **Không đăng nhập được thì dựng trang xem-thử dữ liệu giả** (`xem-thu-*.html` + `src/_xem_*.tsx`, gán đè `supabase.from/rpc`) để bấm thử giao diện —
  bắt được lỗi bố cục + luồng báo lỗi mà không ghi DB. Không thay được bước bấm thật bằng phiên đăng nhập thật.
- **⭐ Máy đọc (Gemini): "dặn kỹ hơn trong prompt" KHÔNG thay được "tách việc + đo".** Đo trên 1 đề có bản chuẩn:
  - đọc cả file PDF thì chữ đúng (22/22) nhưng **bịa vị trí hình** và khung lệch ⇒ hình chỉ lấy từ lượt đọc ẢNH từng trang;
  - hỏi "hình này của câu nào" là sai ⇒ chỉ hỏi TOẠ ĐỘ (khung hình, nhãn "Câu N"), còn thuộc câu nào để máy TÍNH. Thứ gì tính được thì đừng hỏi model;
  - gộp nhiều việc vào một lượt soi trang làm việc khó nhất (chữ gạch chân) trả về rỗng; tách riêng một việc + ảnh 250 dpi thì đúng, 150 dpi thì sai;
  - kể cả vậy lượt gạch chân vẫn sót (7/12) ⇒ là nhân chứng thêm, **mắt Claude trên ảnh trang vẫn bắt buộc**; script phải in ra câu nào máy CHƯA soi được.
- **⭐ Đáp án có hai nguồn trong tài liệu luyện thi: chữ cái GẠCH CHÂN và dòng "Chọn X" của lời giải — gạch chân đúng, "Chọn X" hay sai** (đo 28/09 + 01/10).
  Hai nguồn lệch ⇒ không tự chọn im lặng: ghi cảnh báo vào câu cho người duyệt, soi được thì ghi lý do.
- **So trùng câu bằng chuỗi sẽ trượt khi hai nguồn viết LaTeX khác nhau** (`(S)` ↔ `\left( S \right)`, `\vec` ↔ `\overrightarrow`): bản PDF của đề đã nhập
  từ Word chỉ được nhận trùng 1/22. Chưa chuẩn hoá ⇒ một đề chỉ nhập từ MỘT nguồn.
- **Vá file trên máy công ty:** file nguồn cũ là CRLF, file mới tạo bằng Write là LF, và `grep -c $'\r'` của Git Bash trả 0 cho cả hai ⇒ đừng tin nó.
  Chuỗi nhiều dòng hoặc có dấu `\` (regex, LaTeX) ⇒ Edit tool; khối dài ⇒ Write ra file rồi cho script đọc file đó mà ghép. `node - <<EOF` nuốt dấu `\`.
  Script vá phải `throw` khi không thấy chuỗi cần thay (01/10: nhờ vậy vá trượt mà không hỏng file).
- **Báo số cho CEO phải lấy từ query, không nhẩm:** CTO nói "19 câu lên app" (trừ nhầm câu Đúng/Sai), thực tế 22/22.
- **Nhiều phiên Claude cùng một checkout:** `git add <file cụ thể> && git commit` trong MỘT lệnh, không `git add -A`; `git pull --no-rebase`; DEVLOG conflict
  thì giữ cả hai bên; không đụng file phiên khác đang sửa (`SuKienScreen.tsx`, `TvSuKien.tsx`, `scripts/_q_*`, `_xem_*` không phải của mình).

- **⭐ Cảnh three.js phải dựng lại khung camera mỗi khi ô chứa đổi cỡ (01/10).** Ô chưa có kích thước lúc tạo (flex/grid chưa layout) ⇒ aspect = 0 ⇒ khoảng cách camera vô hạn ⇒ cảnh TRẮNG hoàn toàn, không báo lỗi. Cảnh thế giới may chưa dính, cảnh lục địa dính.
  Sửa: `sanKhau.vuaKhung` lưu hàm dựng lại và gọi trong `doiCo`; cảnh có chuyển động camera đọc `sk.khung` MỖI KHUNG, không giữ bản chụp lúc tạo. Cách bắt: expose tạm `window.__sk`, đọc `camera.position` (10538 ⇒ lộ ngay) rồi gỡ.
- **⭐ Voronoi/cắt nửa mặt phẳng: kiểm dấu bằng MÀU, không bằng mắt (01/10).** `a·x+b·y ≤ c` giữ nửa XA hạt hay nửa GẦN tùy dấu; sai dấu thì mỗi vùng chiếm phần của vùng khác nhưng nhãn vẫn nằm đúng hạt ⇒ chỉ lộ khi màu vùng ngược với danh sách bên cạnh. Đã dính 2 lần (mockup + 3D). Sau khi đổi trọng số nhớ lấy nhãn ở trọng tâm vùng thật, không ở hạt.
- **⭐ Sương mù cố định nuốt cảnh khi camera ra xa (màn dọc) (01/10).** `Fog(near, far)` tuyệt đối + `vuaKhung` kéo camera ra theo bề ngang ⇒ màn dọc ra xa quá `far` ⇒ cả cảnh chỉ còn màu sương. Sương phải co giãn theo khoảng cách camera (`datNen(..., theoXa)`).
- **`mergeGeometries` (three) fail im lặng khi trộn primitive có index và không index (01/10).** `PolyhedronGeometry` (Octahedron/Icosahedron) KHÔNG index, Sphere/Cylinder/Box có index ⇒ trả null. Chuyển hết về `toNonIndexed()` trước khi gộp.
- **Code mới đã nằm trên `main` mà deploy là thủ công ⇒ cờ TẮT mặc định (01/10).** Push `main` KHÔNG có nghĩa học sinh chưa thấy: lần deploy kế tiếp (vì lý do khác) cuốn theo mọi thứ. Tính năng chưa duyệt phải đi sau cờ theo máy (`?cờ=1` → localStorage), mặc định tắt, bật cho mọi người là 1 dòng + 1 lần deploy có chủ đích.
- **Thử app trên iPad cùng Wi-Fi: `http://` (không https), đúng thư mục, bản build cho độ mượt (01/10).** Safari "không thể thiết lập kết nối bảo mật" = nó đang đi https tới server http (mạng vẫn thông). `npm run` sai thư mục v1/v2 ⇒ "Missing script". Server dev (Vite) nạp three chưa nén nên chậm hàng chục giây trên iPad ⇒ muốn đo FPS dùng `vite preview` bản build. Windows: kiểm quy tắc tường lửa Node.js (Public) trước khi đổ lỗi cho mạng; KHÔNG tự sửa tường lửa. Pane trình duyệt ẩn ⇒ `requestAnimationFrame` dừng, chỉ vẽ khi chụp màn hình ⇒ không đo được FPS bằng pane.
- **Quái/boss là phần Thùy tự thiết kế; ChatGPT chỉ làm icon (01/10).** Đừng soạn đơn ChatGPT cho bản đồ/địa hình, đừng trau chuốt quái dựng bằng code — chỉ giữ giao diện `Quai` + điểm cắm `nguonQuai.ts`.
- **⭐ Màn nhiều dòng nhỏ phải soi CẢ khổ PC, không chỉ 375px (29/09).** Nút bản nhỏ mang `w-full` trong hàng flex giành hết bề ngang ⇒ cột chữ còn
  vài px, rụng từng chữ (Thế giới BK lọt lên prod). Nút phụ trong hàng = `flex-none`; `w-full` chỉ cho nút thanh hành động. Tương tự: `grid-cols-2`
  mặc định `minmax(auto,1fr)` ⇒ dòng `truncate` đẩy thẻ tràn/đè thẻ bên ⇒ dùng `grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`.
- **Sửa hàm DB đang chạy: lấy `pg_get_functiondef` từ DB, KHÔNG từ file migration (29/09).** Hàm có thể đã bị migration sau đè. Thay đúng khúc bằng
  mốc chữ, ghi migration mới. Tách công thức ra hàm chung ⇒ so kết quả cũ vs mới trên DỮ LIỆU THẬT với ĐÚNG điều kiện gốc (lần so đầu t lệch vì chính
  câu so thiếu join lớp — không phải hàm sai). Hàm đang chưa có dữ liệu (nhiệm vụ mở 01/10) ⇒ so khúc con, đừng tin "0 = 0".
- **Script vá file: `replace(/\r\n/g,'\n')` TRƯỚC khi tìm mốc nhiều dòng (29/09).** Repo có file CRLF; mốc `'\n}\n'` không khớp ⇒ `indexOf` = -1 ⇒ dán
  lặp cả file. Lệnh `node -e "…"` trong bash: backtick trong chuỗi = chạy lệnh (mất chữ im lặng) ⇒ script dài viết ra file .cjs.
- **Chữ trên màn không hứa tính năng chưa có (29/09).** Màn Lên sóng từng ghi "em nhận thông báo ngay" trong khi push HS chưa làm — soát câu chữ theo
  những gì ĐANG chạy.
- **Prod "vẫn lỗi" ⇒ soi bundle đang chạy trước (29/09).** `curl hs.bkacademy.edu.vn` → lấy `/assets/hs-*.js` → grep chuỗi của bản sửa: 2 lần Thùy báo lỗi
  là do deploy bản trước bản sửa. Main checkout cũng hay chậm commit so với worktree ⇒ `git -C <main> merge --ff-only origin/main` sau mỗi push.

- **⭐⭐ Đơn ChatGPT = ẢNH CHUNG trước + TỪNG HÌNH riêng, và kiểm hàng bằng MẮT (29/09).** Đơn chỉ có mô tả + "nhận zip" là thiếu (Thùy trả).
  Khuôn đúng: A ảnh toàn cảnh/bảng duyệt → DỪNG chờ duyệt → B, C… mỗi lượt 1 hình có "#số tên_file", hình cùng họ vẽ dựa trên hình đã duyệt,
  bản nhỏ Claude tự thu nhỏ. Kiểm hàng: số đo (cỡ, % trong suốt) KHÔNG đủ — Town 29/09: 19 hình đều nền trong chuẩn nhưng từ #19 ChatGPT vẽ
  lệch danh sách (rương/bản đồ/cúp lặp). Luôn ghép tờ liên hoàn (nền hồng cánh sen lộ chỗ trong suốt) + xem từng hình đối chiếu đơn.
- **⭐ Màu game trong màn HS phải nằm ở sổ riêng, không gõ trong màn (29/09).** `check:style-hs` đếm hex + `bg/text-white` trong `*.tsx` theo mốc
  chỉ-giảm (file mới mốc 0). Màu có nghĩa (màu huy hiệu, chương rank, vàng sao) ⇒ khai 1 lần ở `gami/hinh.ts` (`MAU_GAMI`), màn chỉ tham chiếu.
- **Worktree + xem app (29/09):** `preview_start` đọc `.claude/launch.json` của repo CHÍNH ⇒ `dev-hs` chạy code main, KHÔNG phải worktree (kiểm:
  `fetch('/src/…')` có chuỗi mới không); phiên worktree không sửa được file đó ⇒ chạy vite nền từ worktree cổng riêng, xong nhớ tắt tiến trình
  (TaskStop không giết con vite ⇒ tìm PID theo cổng). Worktree cần copy `.env.local` (VITE_SUPABASE_URL), không chỉ `.env`.
- **Giả lập HS khi test RPC trong transaction:** `my_hoc_sinh_id()` đọc `jwt_uid()` = claim `sub` → `tai_khoan.id` (không phải email, không phải
  `hoc_sinh.id`). `set_config('request.jwt.claims', {"sub": <tai_khoan.id>}, true)`.

- **⭐⭐ Bổ trợ: "xếp mãi vẫn Cần xếp" có 2 gốc — đừng vá triệu chứng (24/09).** (1) Form xếp mở buổi 'mo' ĐÃ ĐÓNG CA ở chế độ SỬA ⇒ "xếp" chỉ dời
  ngày buổi cũ (dữ liệu học bị đẩy sang tương lai) — giờ chặn cứng bằng trigger `trg_buoi_bo_tro_khoa_ngay`. (2) Đóng ca chỉ ghi "đã dạy" cho dạng em
  luyện APP ⇒ em học giấy đóng xong 0 dạng tiến ⇒ case trông như chưa học ⇒ OPS đi sửa buổi cũ (10/14 buổi dính) — giờ TA tick dạng lúc hoàn tất.
  **Áp dụng:** "trạng thái không chuyển" ⇒ tra DB từng buổi (danh_gia_xong_at, day_buoi_id, updated_at) trước khi sửa UI; trả ngày thật chỉ khi ≥2
  nhân chứng độc lập trùng nhau (đóng ca · làm bài · nhận xét · sinh bài).
- **⭐ Retest chỉ chấm dạng CÓ câu trong bài retest** (`fn_btyeu_retest_ghi`) ⇒ mọi đường làm dạng sang "chờ retest" PHẢI đảm bảo có câu retest cho
  dạng đó, không thì kẹt vĩnh viễn (bài cũ chỉ lấy ≤3 dạng). Dạng 0 MCQ vẫn kẹt tới khi có câu — `fn_btyeu_bu_retest_ton` tự thông khi mở màn Xếp.
- **⭐ Sửa hàm SQL mà phiên khác cũng sửa ⇒ dựng từ bản ĐANG CHẠY (`pg_get_functiondef`), không từ file migration cũ** — `fn_ca_bo_tro_ung_vien`
  bị phiên khác thêm nhãn "cùng lớp" sau file gốc; dựng từ file cũ là đè mất. Hàm mình viết cũng có thể bị phiên khác sửa lỗi (vd `fn_btyeu_hoan_tat`
  thiếu cột `buoi_danh_gia.muc` ⇒ CHECK nổ khi TA chọn mức) — pull main trước khi đụng lại.
- **⭐ Vercel: auto-deploy TẮT, deploy TAY ⇒ `ignoreCommand` lọc theo diff là vô nghĩa và nguy hiểm** (không có PREVIOUS_SHA, hoặc PREVIOUS_SHA =
  deployment vừa bị cancel ⇒ "đang build thì biến mất"). Đã gỡ khỏi vercel.json (24/09). "Push rồi mà prod không đổi" ⇒ kiểm bundle prod có chuỗi mới
  không trước khi nghi code.
- **Luật CEO đổi thì sửa CẢ spec + CLAUDE.md** (MCQ tuyệt đối 20/09 → ngoại lệ mức 4–5 ngày 28/09): 1 dòng "tuyệt đối" còn sót trong CLAUDE.md sẽ
  khiến phiên sau "sửa lại cho đúng luật" và phá quyết định mới.

- **⭐⭐ Kit ChatGPT PHẢI đủ 3 phần — không bao giờ đặt "đơn chỉ sinh asset" (28/09, skin RPG).** Đơn chỉ-asset (bỏ vẽ mockup) ⇒ ChatGPT vẫn vẽ
  ảnh toàn cảnh (nhân vật + 8 icon khác) nhưng không đóng vào zip, và chỉ sinh 7 mảnh rời theo danh sách ⇒ Claude dựng ra màn khác hẳn ảnh Thùy
  đã xem, còn tự ghi "đạt v1". **Áp dụng:** mọi kit = `reference/` ảnh toàn cảnh mọi khổ màn + bảng kiểm kê có cột **Vị trí & cỡ** + đủ asset thấy
  trong ảnh (kit §2/§4/§8 câu 9–11, `design-check` tự rớt). "Đạt" = khớp ẢNH TOÀN CẢNH, không phải khớp danh sách file mình tự liệt kê.
  Thùy thả file vào `public/` là bị đóng vào bản build ⇒ luôn chuyển sang `design/handoff/`. Kiểm kit cũng phải nhìn "được sinh bằng
  công cụ tạo ảnh hay ghép khối bằng code" (Lo-fi v1 là khối hình phẳng — script đo cạnh sắc vẫn ĐẠT).

- **⭐⭐ Snapshot text-ref phải sync khi RPC đổi mã cha (bug 18/09 Test đầu vào không load chuyên đề mới).** `ca_test_cau` lưu SNAPSHOT `ten_chuyen_de` + `muc_do` tại thời điểm tạo ca test (phiếu `fn_test_dau_vao_phieu` đọc thẳng, KHÔNG JOIN dai_ban_do runtime — có ý đồ giữ lịch sử "HS làm câu này khi câu thuộc chuyên đề X"). RPC `fn_dai_chuyen_dang` lượt đầu chỉ update `ma_dang`, quên sync 2 cột snapshot → sau khi CEO chuyển 1 đống dạng, phiếu hiện chuyên đề CŨ. Fix mig `202609181342`: sync retroactive + tách `ca_test_cau` ra update riêng trong RPC (không lẫn với 7 bảng text-ref khác chỉ có `ma_dang`). **Áp dụng:** viết RPC đổi mã nào (`fn_*_chuyen_*`, `fn_*_gop_*`) → grep `schema.md` cột `ten_chuyen_de|ten_chu_de|muc_do|ten_dang` để tìm mọi snapshot cần sync, KHÔNG chỉ update PK/FK. Snapshot là "ý đồ giữ lịch sử" ở CHỖ ĐÚNG (đo lường) nhưng "ý đồ giữ lịch sử" ở CHỖ SAI (đổi tên/rename) là bug.

- **⭐⭐ Bug sinh mã "nối chuỗi" — `parseInt(soThuTuCua(c, from))` nuốt CẢ phần còn lại (18/09 fix `maxOrd → maxOrdCon`).** Bản cũ `parseInt(c.slice(from))` với `c = 'T10701012203'` (rác) và `from=6` → `parseInt('01012203') = 1012203`, `pad2` giữ nguyên (không cắt về 2 digit) → mã mới = `parent + 1012204` = len 15 vô nghĩa. Bug ÂM THẦM khi tồn tại mã anh em lệch chuẩn — mã hợp lệ khác vẫn có nhưng bị max che khuất. **Áp dụng:** khi tính max STT anh em, filter STRICT trước (cùng parent + đúng length + đúng 2 digit cuối), KHÔNG parseInt phần dài không cắt được. Cách chống bug tổng quát: "1 lần sinh mã sai → mọi lần sinh sau đều lây" — luôn có bước validate format anh em trước khi cấp mã mới.

- **⭐ Rule mã bản đồ có ngoại lệ historic (K4T/K5T tồn tại thật trong `lop.khoi`, KHÔNG phải typo).** Regex khối phải là `(\d{2}|\dT)` chứ không phải `\d{2}` — nếu strict `\d{2}` sẽ báo 88 dòng K4+K5 legacy (1215 câu, 3170 rows tự luyện, 2 lớp đang dạy) là RÁC → không thể xoá. **Áp dụng:** luôn đo shape data thật trước khi viết CHECK constraint (`scripts/_check_shape_4kho.mjs`, `_check_khoi_dac_biet.mjs`); rule "đúng" trong tài liệu chưa chắc đúng với data lịch sử.

- **⭐ UI chia cấp 1/2/3 mà cùng feature — refetch state phải mở cho MỌI cấp có feature đó (bug 18/09 vòng quay may mắn).**
  `HocSinhApp.tsx` fetch `maymanCoLuot` với guard `if (!cap2) return` — nhưng ô "May mắn" hiện trong CẢ `HomeCap1`
  (BOX_CAP1) LẪN `KHU_CAP2`. Kết quả: 14 HS cấp 1 đủ điều kiện quay ngày 17/09 nhưng badge tắt câm → không ai vào
  bấm quay → qua đêm `bt.ngay < v_today` (đúng intent CEO "làm ngày nào quay ngày đấy") → mất lượt. RPC không cấm
  cấp 1 — chỉ FE thiếu tín hiệu. **Áp dụng:** khi feature hiện ở nhiều cấp, list các cấp CÓ UI của nó rồi mở guard
  cho tất cả (ở đây: `if (!cap1 && !cap2) return`), không dựa vào cấp mặc định.
- **⭐⭐ QUY TRÌNH thiết kế RULE LỖI cho form trắc nghiệm (Thùy chốt 09/09, sau khi CTO code trước-hỏi-sau 1 lần) —
  áp cho MỌI dạng mới đưa vào MCQ (`scripts/mcq-auto.mjs`/`mcq-sinh.mjs`, spec-mcq-form.md), không riêng "tích bằng 0":**
  **(1) Đọc `loi_giai` (lời giải chi tiết) THẬT trong kho của vài câu mẫu dạng đó trước** — không suy luận rule lỗi từ
  cấu trúc AST trong đầu. Kho thường tự trình bày đúng khuôn TH1/TH2/các bước, đọc ra ngay chỗ HS hay trượt.
  **(2) Từ lời giải, liệt kê các ĐIỂM RẼ có thể sai** (mỗi bước-giải-đúng ứng với 1+ cách hiểu-sai-hợp-lý) — đối
  chiếu với rule đã có trong `dai_mcq_rule` xem trùng/thiếu/**đã có nhưng SAI NGỮ CẢNH** (case thật: R21 "chỉ lấy
  nghiệm dương" đúng cho dạng KHÔNG ràng buộc miền, nhưng với dạng CÓ "x≥0" tường minh thì "chỉ lấy dương" lại là
  quy trình ĐÚNG — rule cũ vô dụng ở ngữ cảnh mới, cần rule NGƯỢC LẠI "quên áp miền, giữ dư nghiệm"). Đừng gán 1 rule
  cũ vào ngữ cảnh mới chỉ vì tên nghe giống.
  **(3) Đề xuất bảng rule (tên/mô tả/ví dụ) cho CEO — CEO CHỐT rồi mới viết code.** Việc chọn "lỗi nào đáng mô hình
  hoá" là quyết định SẢN PHẨM (ảnh hưởng chất lượng chẩn đoán lỗi của HS thật), không phải chi tiết kỹ thuật tự
  quyết được (khác §0 R2 — đây không phải "câu kỹ thuật").
  **(4) CHỈ SAU KHI CHỐT mới sinh lô + verify + ghi.** Case cụ thể (09/09): pool tích-bằng-0 khối 7 (`077022022203`,
  spec-mcq-form.md), CTO tự code `solveProduct` (chứng minh 1 thừa số vô nghiệm rồi loại) VÀ ĐÃ GHI 12 form vào DB
  trước khi hỏi — chạy đúng, verify sạch, nhưng CEO chỉ ra ngay 4 lỗ hổng rule (R21 sai ngữ cảnh + 3 lỗi chưa mô
  hình: giải nhầm nhân tử vô nghiệm ra nghiệm ảo · quên khai căn khi x²=k · quên bình phương khi √x=k) mà lẽ ra
  phải bàn TRƯỚC. 12 form đã ghi (chưa duyệt) phải sinh lại sau khi rule mới xong — làm 2 lần vì bỏ qua bước (3).
  **⭐ NỚI bước (3) — 11/09, sau khi pool khối 6 tái dùng ~90% rule cũ trót lọt:** dạng MỚI mà lỗi khả dĩ ĐÃ RÕ
  RÀNG/TÁI DÙNG được (giống hệt 1 dạng đã CEO duyệt trước đó, khác chỉ ở miền số — vd R52 "nhầm phép tính" cho
  Số tự nhiên khối 6, sinh từ chính lỗ hổng đo được lúc chạy, không phải suy đoán) → **CTO tự quyết luôn, không hỏi**
  (đúng tinh thần §0 R2). **CHỈ mang ra hỏi CEO khi dạng đó bản thân THIẾU RÕ hoặc MƠ HỒ** (đáp số không phải 1 giá
  trị đơn — vd "Phân tích ra thừa số nguyên tố" đáp số là biểu thức luỹ thừa, "Nhận biết nguyên tố/hợp số" đáp số
  kiểu chọn-tất-cả-trong-danh-sách — những ca này CẦN bàn TRƯỚC vì bản chất "câu hỏi trắc nghiệm 4 đáp án cho nó"
  còn chưa rõ, không phải vì thiếu rule lỗi). Không đổi (1)(2)(4) — vẫn đọc lời giải trước, vẫn liệt kê điểm rẽ,
  vẫn chỉ ghi sau khi tính đúng+verify sạch — chỉ đổi AI QUYẾT rule cho dạng RÕ RÀNG.
- **⭐⭐ Quy trình cho ĐIỀN Ô/"trắc nghiệm từng phần" (Thùy chốt 12/09, khác quy trình rule-form-TN ở trên):** với
  MỖI dạng tự luận mới, CTO đề xuất CHỖ CHIA (ô nào đục, đục theo cách nào) TRƯỚC → làm mẫu 10 câu → CEO duyệt →
  MỚI chạy cả dạng → verify → ghi. Đã có 1 lần làm ngược (nhóm Toán thực tế, sinh+ghi 91 câu trước rồi mới hỏi) —
  không sai kỹ thuật (spec đã ghi rõ "100% máy" nên không cần hỏi cách làm) nhưng đi trước quy trình; từ dạng sau
  (GTLN/GTNN) làm đúng thứ tự thì CEO góp ý 2-3 vòng NHỎ trên MẪU (rẻ, sửa code rồi làm mẫu lại) thay vì phải xoá-ghi-
  lại cả trăm câu đã vào DB (đắt, dính Luật xoá). **Mẫu 10 câu phải TRẢI ĐỦ các khuôn con** (khảo sát trước để biết
  có mấy khuôn) — mẫu ngẫu nhiên 10 câu cùng 1 khuôn thì CEO không thấy được ca khó.
- **⭐ Mã rule PHẢI TÁCH KHÔNG GIAN theo pipeline khi 2+ luồng chạy song song — đừng đua `select max(ma)+1`.**
  12/09: luồng Điền Ô (`mcq-dien.mjs`) và luồng form-TN (`mcq-auto.mjs`, khối 8-9) CÙNG ghi vào 1 bảng
  `dai_mcq_rule`, cùng ngày, đụng mã rule THẬT **2 LẦN TRONG 1 GIỜ** (đặt `R89-R93` lúc max là `R88` thì 25 phút
  sau luồng kia đã chiếm tới `R99`; đặt tiếp `R125-R130` thì cũng bị chiếm gần hết trong giờ tiếp theo) — vì cả 2
  luồng đều query `max(ma)` NGAY LÚC ĐỊNH ĐẶT, không có khoá/đồng bộ giữa 2 phiên. **Chỉ 1 cách chắc chắn: mỗi
  pipeline độc lập dùng 1 TIỀN TỐ CHỮ CÁI riêng** (đã đổi Điền Ô sang `D%`, form-TN giữ `R%`) — không phải khoảng
  số riêng (khoảng số vẫn đụng nếu 2 luồng cùng nhảy tới đó), không phải "hỏi nhau trước khi đặt" (chậm, dễ quên).
  Tác dụng phụ: mã 3 chữ số (`R100+`) làm `select max(ma)` (so CHUỖI) trả sai — `order by length(ma) desc, ma desc`.
- **⭐ Khoanh VỊ TRÍ đục ô trong lời giải phải lấy ĐÚNG TOKEN, không phải cả câu chứa token đó.** Bug thật (khuôn
  `an+b⋮cn+d`, 12/09): quy tắc "tìm dòng chứa số r rồi đục" match theo REGEX TRÊN CẢ ĐOẠN (`"3 \vdots (x-1)"`) rồi
  gán biến `seg` = TOÀN BỘ đoạn khớp thay vì tách riêng con số bên trong — HS sẽ thấy cả câu bị đục thay vì đúng 1
  chữ số. Verify KHÔNG bắt được lỗi này (vì "ghép lại ra đúng nguyên văn" vẫn đúng — ghép cả câu vào chỗ trống thì
  vẫn ra đúng câu gốc!) — chỉ lộ ra khi ĐỌC BẢN IN. Bài học: verify kiểm được "khớp lại đúng nguyên văn" nhưng
  KHÔNG kiểm được "đục đúng CHỖ nên đục" — việc đó phải tự đọc lại bản `--xem` trước khi tin.
- **⭐ Quy trình chạy pool MCQ mới (đúc kết 11-12/09, lặp lại ~10 lần): list → auto (debug 1 câu mẫu) → nếu tỉ lệ
  "chỉ tìm được N<3 distractor" cao (>20-30%) → debug câu bỏ cụ thể xem THIẾU RULE GÌ (không phải bug) → thêm 1-2
  rule "dự phòng" (luôn tính được, không phụ thuộc đặc điểm số cụ thể — vd R61/R71/R72/R84) qua MIGRATION MỚI
  (không sửa migration rule cũ đã áp) → chạy lại → verify → ghi. Coverage 85-100% là bình thường, phần dư bỏ vì
  đặc thù số (vd chỉ 1 thừa số chung, dữ liệu quá nhỏ) — KHÔNG cần cố vét 100%.
- **⭐ Bẫy regex lặp lại 3 lần (T106040104, T106030101, T106040101) — kho bọc `$…$` quanh TỪNG PHẦN so sánh/biểu
  thức, KHÔNG bọc quanh cả câu:** `"...biết rằng $36 \vdots n$ và $n<15$."` — dấu `$` xen giữa các cụm điều kiện.
  Regex nối 2 cụm bằng `\s*và\s*` mà không cho phép `\$?` ở ranh giới sẽ FAIL SILENT (trả `null`, không lỗi) —
  luôn test regex bằng `.match()` trên CHUỖI THẬT lấy từ DB trước khi tin, đừng suy từ cách kho hiển thị.
- **⭐ 2 rule tưởng khác nhau có thể LUÔN RA CÙNG GIÁ TRỊ về mặt toán học** (T106010103 R81 "cộng thêm K" vs R82
  gốc "công thức 1..K" — `K(K−1)/2+K ≡ K(K+1)/2` luôn đúng, không phải trùng ngẫu nhiên) — trước khi đăng ký 1
  rule mới, thử vài giá trị xem có suy ra CÙNG CÔNG THỨC ĐẠI SỐ với rule đã có không, đừng chỉ nhìn "tên nghe
  khác nhau" rồi coi là đủ đa dạng.
- **⭐ Trước khi thiết kế rule cho dạng "mới" — kiểm `lua_chon`/`menh_de` có NULL không trước.** 2 lần hụt (khối
  6, 12/09): T106010102/T106020101/phần lớn T106010103 tưởng là câu tự luận cần convert, khảo sát ra mới biết
  ĐÃ LÀ trắc nghiệm gốc trong kho — pipeline form-tn tự động loại (`q.lua_chon is null`) nên không sao, nhưng
  tốn công khảo sát/thiết kế nhầm nếu không kiểm trước.
- **⭐⭐ Đưa script kiểm cho bên bị kiểm = Goodhart (hs-home v3, 08/09):** ChatGPT cầm `design-check.mjs` trong tay → sinh asset để
  QUA script (ảnh rỗng 100% trong suốt tự chấm PASS), không để ĐÚNG. Script là của bên nhận; bên giao chỉ nhận câu hỏi tự kiểm.
  Kèm theo: **script chỉ là lưới thô — vẫn phải MỞ ẢNH nhìn** (v3 qua 100% mà mắt thấy hỏng ngay).
- **⭐⭐ ChatGPT sinh ảnh PHẲNG, không layer:** mọi "asset" nó xuất từ ảnh tổng = crop + phóng to + xoá màu trắng (áo/giấy/cốc thủng
  lỗ, icon xám rỗng). Chỉ chấp nhận asset **sinh mới bằng công cụ tạo ảnh**, từng cái, nền trong suốt; spec/JSX/layout.json của nó
  bỏ hết — nó không nhìn thấy asset của chính nó nên spec tự lệch ảnh. Chữ (kể cả viết tay) LUÔN là code + font.
- **⭐ `migrate.mjs --baseline <file>` đánh dấu MỌI file tới-và-gồm file đó, không chỉ 1 file (cắn 08/09):** áp 1 file bằng
  `_apply_one` rồi baseline ⇒ file khác đang FAIL cũng bị ghi "đã áp". Lần đó vô tình đúng ý (file luỹ tiến xu đã bị thay bằng
  EXP:100 áp tay) — lần sau kiểm `--status` TRƯỚC khi baseline, hoặc sửa nguyên nhân fail rồi `npm run migrate` bình thường.
- **⭐ Màn Home mobile: không cuộn NHƯNG không kéo giãn cho đầy màn** (CEO 08/09: "tỉ lệ phải như gốc mới đẹp, scale sai tỉ lệ xấu").
  `flex-1`/`grid-rows` chia đều → SE bẹp, Pro Max phình. Đúng: aspect-ratio đo từ mockup + chữ clamp(vw) + dư để trống dưới; kiểm
  `scrollHeight === innerHeight` ở 390×844 và 430×932 kể cả trạng thái có banner.
- **⭐ File chưa theo dõi trong `public/` VẪN vào build + precache PWA:** zip/kit thả vào `public/bk-ui` làm `build:hs` fail
  ("asset > 2 MiB won't be precached") dù Vercel (checkout sạch) không sao. File gốc → `design/`, đúng `design/README.md`.
- **⭐ Font chữ tay: thử font trước khi xuất doodle ảnh.** Đổi 5 font qua `?font=` trên demo trong 5 phút → CEO chọn Pacifico;
  doodle ảnh là mỗi câu 1 vòng ảnh, không sửa được chữ, dễ sai dấu — chỉ là ngoại lệ.
- **⭐ plpgsql: sau `EXECUTE` (bất kỳ dạng nào) ĐỪNG TIN `FOUND` (cắn 06/09 hai lần).** `EXECUTE 'update …'` không RETURNING
  ⇒ FOUND false dù đã sửa dòng. **`EXECUTE 'select …' INTO` cũng vậy: đo bằng DO block 06/09 chiều → `found=false` DÙ biến đã nạp
  đủ giá trị** (bản đầu của mục này ghi "EXECUTE INTO thì FOUND đúng" — sai, khiến `fn_giaibai_duyet` chưa từng chạy được tới mig
  `202609061543`). Luật: SQL động kiểm kết quả bằng `GET DIAGNOSTICS n = ROW_COUNT` (ghi) hoặc **kiểm biến INTO có null không** (đọc).
  3 fn `fn_giaibai_tra/luu_nhap/nop` ném "Không lưu được" dù DB đã ghi — phải vá bằng migration MỚI.
- **⭐ `CREATE OR REPLACE VIEW`: cột MỚI PHẢI đứng SAU CÙNG — mọi cột cũ giữ nguyên vị trí/tên/kiểu (cắn 06/09 hai lần).** Đặt cột
  mới trước cột cũ (kể cả ẩn qua `k.*`) ⇒ "cannot change name of view column X to Y". Với UNION nhiều nhánh: nhánh liệt kê tay phải
  khớp VỊ TRÍ với nhánh dùng `y.*` (cột `ALTER TABLE ADD` nằm CUỐI bảng ⇒ `y.*` đẩy chúng ra cuối). Đừng `k.*` khi thêm cột — liệt kê tay.
- **⭐ `CREATE OR REPLACE FUNCTION` mà THÊM tham số (dù có DEFAULT) = tạo OVERLOAD thứ 2, KHÔNG thay hàm cũ (cắn 06/09).** Gọi bằng
  số tham số cũ khớp cả hai ⇒ "function … is not unique" cho MỌI caller cũ (kể cả supabase.rpc). Phải `DROP FUNCTION` đúng chữ ký cũ
  trong migration kế (mig `202609061533`). Kiểm bằng `pg_get_function_identity_arguments`. Cùng họ: `EXECUTE … INTO record` không có dòng ⇒ record null,
  và truy `y.<cột>` mà bảng nhánh khác không có cột đó (`y.baitoan_id` vs `y.bien_the_id` trong CASE) = lỗi field — lấy khoá qua
  `execute format('select %I …', key_col)`.
- **⭐ React: KHÔNG khai báo component trong THÂN component khác (cắn 06/09 BaiCuaToi).** `const The = (…) => <li>…</li>` bên trong
  render ⇒ mỗi render cha là 1 type mới ⇒ React unmount/mount lại toàn bộ cây con ⇒ editor mất text đang gõ, ref DOM stale liên tục,
  form nhấp nháy. Dấu hiệu: tool test báo "ref is stale" ngay sau mỗi state change. Hoist ra mức module, truyền callback qua props.
- **⭐ Trước khi kết luận "tính năng X chưa có": `git fetch` + so `origin/main`, đừng grep worktree đang đứng (cắn 06/09).** Local
  outdate ⇒ grep sạch ⇒ báo CEO "chưa build" trong khi main đã có từ hôm trước. Nghi thức: `git fetch origin main` →
  `git log --oneline HEAD..origin/main` → grep trong `git show origin/main:<file>` nếu cần.


- **⭐⭐ PHIÊN LÀM TỪ ĐIỆN THOẠI (remote, KHÔNG có credential DB) — về máy có DB PHẢI chạy nghi thức
  đóng sổ, nếu không repo và DB nói hai chuyện khác nhau (cắn 01/09, 5 ngày liền):** phiên remote
  viết được migration nhưng **áp không được** → CEO dán tay qua SQL Editor → **DB có, sổ không**;
  có file còn **chưa từng vào git** (4 file `giai_thuong` 22/08 — `git log --all` = 0 hit). Nghi
  thức bắt buộc khi về máy có credential: ① `npm run migrate:status` → đối chiếu từng file "còn
  treo" với `pg_catalog` (có bảng/cột/fn CHƯA đủ — phải **soi THÂN hàm** tìm dấu vân của đúng bản
  mới, vì `create or replace` không đổi tên) → cái nào DB đã có thì `--baseline`, cái nào chưa thì
  `npm run migrate` ② `npm run schema` + commit `schema.md` ③ **verify các thao tác dán tay** bằng
  query thật (seed cờ, role, bucket, backfill) — đừng tin DEVLOG ghi "CEO đã dán".
- **⭐ "Ai đang dùng quyền này?" phải đo ở PHÍA TIÊU THỤ, không suy từ migration cũ (cắn 01/09):**
  đọc mig 15/08 (siết `fdw_bkdemy_web` còn 4 bảng, viết lúc chỉ có bkdemy-web dùng) rồi thấy DB đang
  mở 35 bảng ⇒ tao kết luận "lỗ hổng". Sai: từ 15/08 tới giờ **app PH** đã thành hộ dùng chính với
  21 foreign table, mở lại là đúng nghiệp vụ. Migration chỉ nói sự thật **lúc nó được viết**. Muốn
  biết hiện trạng thì mở **repo phía tiêu thụ** đọc khai báo (`limit to (...)`/`create foreign
  table`) rồi diff với grant — kết quả ra con số dùng được ngay (24 đang dùng / 10 dư). Cùng họ với
  §2 "số lượng khớp không phải bằng chứng": chứng cứ phải đến từ nơi tiêu thụ, không từ nơi cấp.
- **⭐ Băm file migration mà tính cả CRLF = 62 báo động giả (01/09):** cùng file áp từ Windows (CRLF)
  và từ container remote (LF) ra 2 vân tay ⇒ `--status` la làng "DB và repo nói khác nhau" trong khi
  nội dung y hệt. Báo động giả lâu ngày = **không ai đọc cảnh báo nữa**, nguy hơn không có cảnh báo.
  Sửa gốc ở CÔNG CỤ (băm nội dung LOGIC, bỏ CR) chứ không sửa từng file. Cùng họ với bài học
  "sửa `introspect` thay vì vá 1 constraint".
- **⭐ Sổ migration phải soi ĐỦ 3 CHIỀU** — ① file có, sổ không (còn treo) ② file có, sổ có, vân tay
  lệch (bị sửa sau khi áp) ③ **sổ có, file KHÔNG** ← chiều này trước 01/09 bị mù, và nó là chiều
  nguy hiểm nhất: dựng lại DB từ repo sẽ **thiếu im lặng**, không lỗi, không cảnh báo. Migration áp
  tay xong **phải commit file** — SQL chạy rồi mà file không vào git thì repo hết là source of truth.
- **⭐ Khôi phục DDL từ DB thì CHÉP ĐÚNG HIỆN TRẠNG, đừng tiện tay "cho chuẩn" (01/09):** dựng lại
  `giai_thuong` từ `pg_catalog` thấy bảng có **policy cho `fdw_bkdemy_web` nhưng KHÔNG có GRANT** —
  suýt thêm `grant select` cho "đủ bộ", tức là **tự nới quyền đọc** trong lúc chỉ định khôi phục.
  Policy và GRANT là **hai cổng độc lập** (đã ghi trong mig 15/08): chép cái đang có, ghi chú chỗ
  lệch, để CEO quyết. Migration khôi phục cũng phải idempotent + bọc DO-block kiểm **chủ sở hữu**
  (role migrate không sửa nổi RLS/trigger của bảng thuộc `postgres`).
- **⭐ PURE-DERIVE thắng roster tĩnh khi vấn đề chỉ là "list quá dài" (Test đầu vào assign, 08-14):**
  build xong 1 bảng curate riêng (`test_dau_vao_nhan_su`) để rút gọn dropdown chọn người, Thùy phản
  biện ngay — sort theo GẦN NHẤT-TỪNG-ĐƯỢC-GÁN (derive từ lịch sử, đã có sẵn trong DB) giải quyết đúng
  vấn đề mà không cần bảng/màn CRUD mới, không ai phải nhớ bảo trì khi người nghỉ việc. Bài học: trước
  khi thêm bảng/cột mới để "gọn UI", hỏi trước — dữ liệu LỊCH SỬ đã có sẵn có derive ra được thứ tự ưu
  tiên tương đương không? Chỉ tạo state tĩnh mới khi thật sự có KHÁI NIỆM MỚI (ở đây `nguoi_cham_id`/
  `nguoi_tra_bai_id` trên `ca_test` là assign THẬT của từng ca — giữ; danh mục "ai được chọn" thì KHÔNG).
- **⭐ Thuật ngữ CEO nghĩa HẸP theo ngữ cảnh — soi ví dụ TRƯỚC khi build UI (Kho Hình 08-08, hiểu nhầm 2 vòng):** Thùy nói "hiện list chuỗi trước" → tao hiểu list MỌI dạng/chuỗi khác nhau (build sai nút + popup list mọi component); ý thật = "các chuỗi CỦA NODE" = **gốc + biến thể của CHÍNH chuỗi đang xem**. Rồi lần 2 làm list nhãn nhỏ, Thùy muốn popup TO view full từng bản. Gặp danh từ CEO ("chuỗi", "bản", "ghế"…) có ≥2 nghĩa → **hỏi/soi 1 ví dụ cụ thể (ảnh màn) trước khi dựng cả UI**, đừng chọn nghĩa rộng rồi code. Rẻ vì đã tách UI khỏi logic (chỉ sửa popup, không đụng `noDapAn`).
- **`zoom:1.15` (#root) + `100vh`**: mọi `100vh`/`min-h-screen` painted ×1.15 → body scrollbar thừa. Chặn chiều cao 1 lần ở App = `h-[calc(100vh/1.15)]`, dưới dùng `h-full`. **MODAL (`fixed inset-0`+`vh`/`vw`) trong #root cũng bị phóng 1.15× → tràn màn hình → `createPortal(modal, document.body)` để THOÁT zoom.**
- **PostgREST embed: FK ĐƠN mới embed thẳng được; nhiều FK cùng đích → NHẬP NHẰNG (query lỗi âm thầm → rỗng).** `gami_grades.problem_id→gami_session_problems` = FK đơn → `select('...,prob:problem_id(...)')` (bỏ luôn IN-list, tránh URL dài). Còn `buoi_hoc_hs` có **2 FK** về `buoi_hoc` (`buoi_hoc_id`+`bu_cho_buoi_id`) → KHÔNG embed, phải **tách 2 bước** (lấy id rồi `.in()`).
- **"Đóng phase = XÁC NHẬN, GIỮ bảng read-only, chỉ Mở-lại mới sửa" (Thùy):** cấm early-return tắt UI khi đóng. Đóng → header banner "✓ đã đóng + ↩ Mở lại" + `disabled` mọi nút, bảng vẫn hiện. (Áp mọi tab chấm: Chấm bài/ET/BTVN/Đánh giá.)
- **Đổi tab mà KHÔNG mất state:** lazy-mount + `hidden` (mount 1 lần, ẩn khi off) thay vì conditional-render (unmount = mất chọn).
- **`grid h-full` KHÔNG đủ cuộn**: hàng grid mặc định `auto` → ô con tràn bị `overflow-hidden` cắt. Phải `grid-rows-[minmax(0,1fr)]` thì inner `overflow-auto` mới ăn. `min-h-0` một mình không cứu grid.
- **MathText `\n` vs lệnh LaTeX (`\neq`/`\nVì`)** — đã SAI 2 lần: cùng dạng `\n`+chữ, regex không phân biệt nổi. **Fix gốc: tách `$…$` TRƯỚC**, chỉ xử lý xuống dòng ở text NGOÀI `$`; trong text đổi ký hiệu Unicode trước rồi cắt dòng. **Bài học to: 2 thứ cùng pattern → TÁCH NGỮ CẢNH, đừng vá lookahead.** KaTeX dùng `\dfrac` (không `\frac`).
- **⭐ Cột `text` KHÔNG nói lên tập giá trị hợp lệ — CHECK mới nói.** Thêm giá trị vào union type TS mà quên migration nới CHECK ⇒ DB chặn đúng lúc user bấm nút (`new row for relation X violates check constraint`), và **chỉ nhánh giá trị MỚI chết** nên ẩn rất lâu (`prep_phong.luot` thiếu `'toi'` ẩn cả tháng vì Sáng/Chiều vẫn chạy). Đổi union type ⇒ **phải có migration đi kèm**. `schema.md` giờ hiện cột "giá trị hợp lệ" — đọc nó trước khi code cột trạng thái/loại.
  - **Bài học to hơn cái bug:** lỗi user báo là *một nút không bấm được*; thứ đáng sửa là **công cụ tra cứu đang giấu một chiều của schema**. Vá 1 constraint = trừ 1/47 điểm; sửa `introspect` = 46 điểm còn lại tự lộ ở lần `npm run schema` kế. Gặp bug, luôn hỏi thêm: *"cái gì đã cho phép nó ẩn lâu đến vậy?"*
  - **Luật xoá không phải thủ tục cho có:** trước khi xoá 20 dòng `'ngay'`, dữ kiện **mâu thuẫn giả định** — Thùy nói *"đang test, data không quan trọng"* nhưng 19/20 dòng có ảnh evidence thật, 6 dòng leader đã chốt. Nêu ra rồi mới xoá. Chỗ dừng đó là chỗ bắt sai lệch giữa *điều người ta nhớ* và *điều data nói*.
- **Mã/STT per-nhóm KHÔNG dùng trigger BEFORE INSERT**: multi-row insert 1 statement không thấy nhau → trùng. Tính **client-side max+1**.
- **⭐ (Kho Hình 07-24) Ba cái bẫy IM LẶNG — không lỗi, không cảnh báo:** (1) `migrate.mjs` áp LẠI mọi file mỗi lần → lệnh `drop` phải có **cổng nhận diện shape** (vd chỉ bảng CŨ mới có cột X) nếu không lần chạy sau xoá data MỚI. (2) CSS thư viện nạp SAU CSS của mình + **cùng độ ưu tiên** → override của mình thua (katex `.katex{1.21em}` đè `1em` → công thức to 21%); dùng `!important` hoặc đảm bảo thứ tự. (3) **React StrictMode + `paged.js Previewer.preview()` gọi thẳng trong effect** → 2 run chồng nhau ra ĐÚNG 0 trang (như treo); hoãn `setTimeout(…,0)` + clearTimeout ở cleanup để chỉ 1 run sống.
- **⭐ Suy để HIỂN THỊ vs id ỔN ĐỊNH:** Thùy muốn mã cây 1/1.1/1.1.1 (dễ đọc) nhưng spec cấm nhét vị trí vào mã (vỡ khi đổi cha/DAG). Không phải chọn một — **giữ id trơ bên dưới, DERIVE mã phân cấp để hiển thị** (tự tính lại khi cây đổi). Cùng khuôn: giả thiết con = derive (bố + delta), đề bài = derive (giả thiết mô hình + câu hỏi). Cái gì suy được từ cấu trúc thì đừng lưu trùng.
- **⭐ (08-06) Kế thừa KHÔNG phải lúc nào cũng = cộng text.** Tách 2 tầng đang bị gộp: **cạnh logic is-a** (subsumption — hình bình hành ⊑ hình thang, LUÔN kế thừa, nuôi bao đóng/cách giải) vs **text phát biểu** (tiếng Việt định-danh-hoá: "cho hình bình hành ABCD" đã bao "hình thang ABCD", không cộng dồn). Lý thuyết: subtype vs lexicalization — subclass vừa extend vừa override cách biểu diễn mà vẫn giữ Liskov. Fix = per-node mode, **giữ cạnh cha, chỉ nhánh hàm render text**. Đừng ép 1 quy tắc derive cho mọi cạnh.
- **⭐ (08-06) Tách một CHIỀU mới khi data còn NON = gần như miễn phí.** Catalog Hình tách theo khối lúc chỉ có 7 dạng / 0 bổ đề / 0 đo lường → 0 rủi ro. Nếu đợi sau khi có mastery (HS × dạng) rồi mới tách = phải map lại quan hệ đã mất (§2 "số lượng khớp không phải bằng chứng") — ác mộng. Verify TRƯỚC bằng query "dùng-xuyên-khối" rồi mới quyết default backfill; data mâu thuẫn lời nói (Thùy bảo khối 8, hoá ra khối 9) thì HỎI, đừng đoán.
- **(08-06) Bump cỡ chữ/hiển thị 1 khu vực mà không đụng nơi khác:** primitive dùng chung → thêm prop tuỳ chọn (`big`, mặc định false), CHỖ CẦN truyền prop; đừng sửa hằng số trong component (đổi cả app). KaTeX scale theo `font-size` container nên chỉ cần to container là công thức to theo. Đơn vị Thùy nói "pt" = point (≈1.33×px) — 12–13pt ≈ 16–17px, đừng nhầm sang px.
- **Paste ảnh nhân đôi**: window paste-listener + slot `onPaste` cùng nổ → `e.stopPropagation()` ở slot.
- **Lưu phải ĐỦ cột**: patch thiếu `lua_chon`/`anh_*` → rớt data. Tái dùng editor + mapper đủ cột.
- **claude_build KHÔNG đụng schema `auth`/`storage`**: tạo user + bucket/policy phải qua **Dashboard** (SQL Editor cho storage). Bảng `public` thì áp migration bình thường.
- **Auth không vướng RLS**: login đi endpoint `/auth` riêng → bật RLS KHÔNG khoá đăng nhập (chỉ khoá đọc/ghi bảng).
- **Render phải CHỊU output AI ẩu**: AI hay quên bọc `$` (để `\dfrac{6}{5}` trần) + dùng `<br>`. Renderer phải tự render lệnh-CÓ-NGOẶC trần + đổi `<br>`→xuống dòng. ĐỪNG tin AI bọc `$` chuẩn.
- **AI hay LỜ số lượng yêu cầu** (xin 20 biến thể, trả 41) → **luôn CAP cứng ở CODE**, đừng tin prompt. `maxOutputTokens` thấp CHE lỗi này (output bị cắt) → nâng 65536 + bắt `finishReason==='MAX_TOKENS'`.
- **Completeness phải có trạng thái "KHÔNG áp dụng" TƯỜNG MINH** (vd chuyên đề "không cần LT" → loại khỏi mẫu số %) — đừng tính ngầm/đoán, sẽ ra % sai.
- **Op**: migration áp RIÊNG từng file (0001 không idempotent). Test regex/chuỗi bằng **file `.mjs` chạy `node`** — ĐỪNG `node -e` qua bash heredoc (nuốt backslash). Vercel env nằm TRONG từng Environment (click Production), thêm xong phải **Redeploy**. Gemini key public → giới hạn HTTP referrer + budget alert.
- **⭐ team ≠ ghế (RBAC, vướng 3 lần):** gán role cho ghế phải ở **Phân quyền → "gán role cho vị trí"** (`vi_tri.vai_tro_id`), KHÔNG phải gán team ở tab Nhân sự. Chỉnh role mà không thấy đổi → 99% là role chưa bám ghế, hoặc account chưa **đăng nhập lại** (quyền load lúc login). Ghế trống tên → khó nhận trong tab gán → nên đặt tên vị trí.
- **⭐ Cờ quyền theo NGƯỜI/email, KHÔNG theo auth-uid:** Founder flag để ở `nhan_su` (set bằng ma_ns), `my_quyen()` resolve nhan_su qua tai_khoan HOẶC email → bootstrap được trước cả khi account login (chưa có dòng tai_khoan). Để cờ trên tai_khoan(=uid) thì người chưa login không set được.
- **⭐ Env khác nhau giữa LOCAL và VERCEL:** đổi `VITE_GEMINI_KEY` ở `.env.local` KHÔNG ảnh hưởng bản deploy — phải đổi env trên Vercel + Redeploy. "Local chạy, deploy lỗi key" = 2 key khác nhau, KHÔNG phải leak. (`CONSUMER_SUSPENDED`/`prepayment depleted` = billing/cap, không mặc định leak.)
- **⭐ Câu test/luyện/BTVN chống lạm dụng = least-used-first** (đếm `tai_lieu_cau`), KHÔNG block cứng toàn cục (dạng ít câu sẽ cạn). Cứng chỉ trong-buổi/đề; mềm xuyên thời điểm.
- **Bài (gami_session_problems) = SLOT/cấu trúc, KHÔNG phải phép đo** → tạo sẵn 10 bài OK; anti-NULL §1.5 áp ở GRADE (chỉ sinh khi chấm thật). Phân biệt slot vs measurement.
- **⭐ Reuse layout IN phải mang theo MỌI override CSS/page-break, không chỉ component** (vướng 1 lần ET): tái dùng `CauItem` cho ET nhưng quên scope override `.pv-h-dang{border-bottom:none}` + `.pv-cau{break-inside:auto}` (đã fix cho BTVN) → 2 lỗi cũ quay lại. Khi reuse PrintView CSS: scope override theo container mới (`.pv-et`, `.pv-btvn`).
- **Header/footer dải sóng:** path SVG phần MÀU phải phủ gần hết dải (footer V14/header V84, KHÔNG V40/V68) → text canh-giữa nằm trọn trên màu. `buildPagedCss` dùng chung mọi tài liệu.
- **Số thứ tự xuyên nhóm:** đếm liên tục qua nested map = counter ngoài (`let no=0` rồi `++no` trong map con), KHÔNG `index+1` (reset mỗi nhóm). BTVN/ET đều vướng.
- **Gemini `CONSUMER_SUSPENDED` (403) = CHẠM spend cap, KHÔNG mặc định là leak key.** Đoán "key bị trảm vì lộ" là SAI (đã sai 1 lần). Check **Console → Spend cap + email Google** trước. Nâng cap có **~10 phút latency** (F5 vô ích, không phải lỗi client). Cache `accepted_answers` + (sau) proxy server-side để giảm gọi/né cap.
- **Preview-phải-bằng-bản-in → dùng paged.js, ĐỪNG tự cuộn 1 mạch.** Tự phân trang HTML là vô vọng: **flex chặn page-break**; `@page` counter (số trang) **cần có margin** mới hiện. paged.js cho A4 thật + header/footer mỗi trang + đếm trang, **1 engine cho cả preview lẫn in** nên khớp.
- **⭐ paged.js — đầu khung/tiêu đề KHÔNG được là phần tử riêng trông vào `break-after:avoid` (27/09).** paged.js 0.4.3 chỉ xét avoid khi
  CHÍNH anh em liền sau tràn trang; nếu cái tràn là con BÊN TRONG nó (câu 1 trong `.pv-caulist`) thì avoid bị bỏ qua ⇒ đỉnh khung mồ côi cuối
  trang. Luật: gộp đầu khung + nội dung ĐẦU TIÊN vào 1 khối `break-inside:avoid`. Đo: cũ 14/61 vị trí mồ côi, mới 0/61.
- **⭐ Khung/CSS dùng chung phải thử CẢ 1 cột lẫn nhiều cột.** `.pv-caulist.pv-cols` đặt `line-height: --pitch` (7.5mm) ⇒ mọi thứ đặt trong nó
  (tag, nhãn) kế thừa, phình cao gấp đôi, đè chữ (lỗi 4A1 27/09 — test 26/09 chỉ thử 1 cột). Phần tử trang trí trong câu ⇒ đặt `line-height` tường minh.
- **⭐ Verify PDF khi Browser pane không vẽ được** (cửa sổ bị che ⇒ paged.js >30s, 0 trang, screenshot timeout — KHÔNG phải lỗi code; từng kết luận
  sai "div bọc làm treo" vì thế): dựng HTML tối giản + CSS rút thẳng từ `PrintView.tsx` + `node_modules/pagedjs/dist/paged.polyfill.js` → Chrome
  headless (`puppeteer-core` + Chrome máy), quét filler 0..N px để đo mọi vị trí sát đáy trang; so bản cũ (`git show HEAD:…`) vs mới. Component
  thật: `renderToStaticMarkup` qua `npx vite-node` (file .ts, không JSX; tránh `'\\'` trong heredoc — dùng `String.fromCharCode(92)`).
- **Sửa dữ liệu nội dung hàng loạt:** thay ĐOẠN CHÍNH XÁC (mỗi đoạn tìm đúng 1 lần, lệch là bỏ cả lượt) thay vì gõ lại; nhân chứng = so multiset
  từ cũ/mới; `update … where noi_dung = <bản cũ>` trong 1 transaction; lưu bản cũ vào repo. Editor tự xoá dấu cách cuối dòng trong file script ⇒
  chuẩn hoá `[ 	]+
` của bản gốc trước khi tìm.
- **⭐⭐ paged.js — LUẬT NGẮT TRANG ĐÚNG (bản 08-14, GỘP & SỬA bản cũ "cứ để `auto` là trang đầy"):** bản cũ nói *avoid trên khối TO làm nhảy cả khối → bỏ trống cuối trang, nên để `break-inside:auto`* — **đúng một nửa, và nửa sai đã gây bug thật**. Sự thật đo được (render thật + đo **% diện tích mỗi trang thực dùng**, không nhìn mắt):
  - **Ngắt GIỮA hai khối anh-em ruột (sibling) → paged.js chạy ĐÚNG.** **Ngắt VÀO TRONG lòng một khối, sâu ≥2 tầng** (vd giữa các `.mline` bên trong `.pv-blk` bên trong `.pv-box-lt`) → paged.js **bỏ phí nốt phần trang còn lại**: phần tử KẾ TIẾP không chịu nằm cùng trang mà nhảy hẳn trang mới (đo được: trang chỉ dùng **10%**). Nặng hơn: có ca nó dựng DỞ rồi để TRẮNG 1 trang rồi DỰNG LẠI TỪ ĐẦU → **lặp/mất nội dung THẬT**, không chỉ xấu.
  - **⇒ Công thức đúng: CẤM xé trong lòng khối (`break-inside:avoid`) + CHẺ khối dài thành nhiều khối NGẮN** để vẫn đủ chỗ ngắt HỢP LỆ (ở tầng sibling). Vừa không phí trang vừa không vỡ. (`LyThuyetBody` chẻ theo dòng khi khối > `LT_BLK_MAX`=3 dòng; dòng đầu giữ `.pv-blk-keep{break-after:avoid}` cho nhãn "Ví dụ N." không mồ côi.) Đo GT 8S1: **8 trang (99/10/97/95/85/72/82/34%) → 6 trang (96/91/96/85/96/85%)**.
  - **Thẻ BỌC thừa không style cũng là "1 tầng"** — `<div>` bọc cả nhóm card làm paged.js hỏng y hệt; đổi sang `<Fragment>` (không sinh DOM) là hết. **Ít tầng lồng = ít cửa hỏng.**
  - `.pv-math span.katex-text{display:inline}` — phải scope `span`, KHÔNG để trần `.katex-text`: MathText trả `<span>` khi 1 dòng nhưng `<div>` chứa `.mline` BLOCK khi nhiều dòng; ép `inline` lên `<div>` = block-trong-inline → paged.js đo sai chỗ xé (riêng cái này: 8 trang → 7).
  - Vẫn giữ từ bản cũ: chỉ avoid thứ ATOMIC nhỏ là đúng tinh thần, nhưng "nhỏ" phải hiểu là **chẻ cho nó nhỏ**, chứ không phải bỏ avoid. ("Dòng kẻ lạ" dưới heading = `border-bottom` của heading, KHÔNG phải dòng-viết.)
- **⭐ Bug IN phải verify bằng RENDER THẬT + SỐ ĐO, không bằng "nhìn ảnh thấy ổn" (08-14, tự vấp):** đã báo "fix xong" trong khi dữ liệu ngay trước mắt cho thấy trang 2 chỉ có 292 ký tự — vẫn lỗi. Công cụ đúng: script Node dựng headless qua **đúng pipeline `worker/index.mjs`** (Puppeteer + `dist/` + tín hiệu `window.__pvState`) → ra PDF trong ~4s **không treo** (khác hẳn bấm 🖨 In trong app hay browser-tool, cả hai đều treo/không compositing), rồi **đo % diện tích từng trang thực dùng** + **quét mã dạng trùng** để bắt lặp/mất. Metric này là ĐỒ NGHỀ NỘI BỘ — Thùy không quan tâm %, chỉ cần **gửi thẳng file PDF** để nhìn cái sẽ in ra giấy.
- **paged.js rewrite mọi `url()` (trừ `data:`) theo base = blob URL của stylesheet** (`sheet.js`): `url("/x.png")` tương đối → `new URL('/x','blob:…')` **THROW → preview TRẮNG**. Trong CSS nạp vào paged.js phải dùng **URL tuyệt đối** (`location.origin+'/x'`) hoặc `data:`. Luôn để paged.js `.preview().catch()` **hiện lỗi**, đừng nuốt → trắng trơn khó mò.
- **⭐ Đóng phase 2 lần (Elo×2):** guard đọc cờ ở ĐẦU nhưng set ở CUỐI (closePhase ~4s) → double-click lọt. **Fix gốc: CLAIM atomic** — `update set dong_at=now where id AND dong_at is null` ngay đầu; 0 row = đã đóng. Mọi hành động "1 lần/đối tượng" tốn thời gian PHẢI claim atomic trước khi tính, đừng tin guard-đọc-rồi-ghi-sau (+ disable nút busy).
- **⭐ Elo độc lập nhiều phase phải tính từ SNAPSHOT trước-buổi, không nối tiếp:** ban đầu ET dùng elo-sau-ingame → buổi 1 mọi HS điểm 0 mà kỳ vọng E lệch (vì elo_before lệch). Đúng: pre = elo hiện tại − Σ delta CỦA CHÍNH BUỔI NÀY (phase kia); gami_elo **cộng dồn delta** (độc lập thứ tự); reopen = **trừ delta** (đừng revert elo_before — xoá delta phase kia). Data cũ sai → **replay theo thời gian** (`_replay_elo.mjs`).
- **⭐ EXP theo hạng KHÔNG công bằng khi hoà:** `rankSession` chia hạng 1..N kể cả khi điểm thô bằng nhau → EXP lệch dù thành tích y hệt. Fix: **gom theo điểm thô, mỗi nhóm = TB bậc EXP các vị trí nhóm chiếm**.
- **⭐ Tràn bảng rộng = `min-width:auto` của flex/GRID item:** bảng rộng (nhiều cột) bung cả track thay vì cuộn trong `overflow-x-auto` → mất scrollbar + đẩy nút khuất. Phải `min-w-0` ở **MỌI tầng** flex/grid từ khung tới ô cuộn (block thường không cần). 9A2 không bị (đã đóng→bảng hẹp), 9B1 bị (đang mở→11 bài) → khác nhau do trạng thái, không phải data.
- **⭐ Seed trùng do StrictMode chạy effect 2 lần:** insert không idempotent → đẻ đôi (Bài 1,1,2,2…). Fix: **unique constraint** + **upsert ignoreDuplicates** ở mọi `ensure*Problems`. (Effect mount chạy 2 lần trong dev là bình thường — data-layer phải chịu được.)
- **⭐ 1 người nhiều vai/lớp:** logic gộp role về 1 (ưu-tiên-gv) làm rụng task vai kia (tg→ET). Luôn gom UNION vai, dedup theo tab — đừng "1 lớp 1 vai".
- **⭐ Task định tính cần mốc-xong TƯỜNG MINH:** pure-derive (suy từ bằng chứng) hợp cho điểm danh/chấm-bài/ET (có mốc tự nhiên); đánh giá sau buổi KHÔNG có "đủ" rõ → phải có **nút Hoàn thành + cờ riêng** (`danh_gia_xong_at`). Đừng piggyback mốc của task khác.
- **⭐ Buổi `hoan_tat` ≠ đóng-1-phase:** buổi thường hoàn tất khi CẢ ingame+ET đóng. Đóng ET đơn lẻ set hoan_tat (model cũ) → task GV biến mất (getMyTasks lọc trang_thai='mo'). Mốc xong phải theo TỪNG phase, không phải cả buổi.
- **Xoá denormalize (chủ đề/chuyên đề trong dai_ban_do) bị FK RESTRICT chặn nếu còn câu:** xoá-cụm phải **cascade câu trước** (`dai_cau_hoi` → tai_lieu_cau/bổ-đề tự CASCADE) rồi mới dai_ban_do. Rename = đổi TÊN giữ MÃ (mã là FK-target).
- **⭐ Windowing theo mùa/tháng = INSTANT UTC, không format ngày-local:** "reset EXP theo mùa/tháng" = lọc `created_at` (timestamptz), KHÔNG xoá data. Mốc = `new Date(Date.UTC(y, m, d, -7,0,0)).toISOString()` (VN+7 → giờ -7) = đúng instant VN-midnight để so. Cấm `toISOString()` của §2 chỉ áp cho **format ngày-local hiển thị**, KHÔNG cấm tạo instant boundary để so timestamptz.
- **⭐ Thống kê phụ-thuộc-thời-điểm phải GHI tại thời điểm, không suy ngược:** "hạng cao nhất từng đạt" / "verdict so band" phụ thuộc trạng thái người khác / band LÚC ĐÓ → không tính lại sau được. Phải **snapshot ngay** (mig 0042 lưu `rank` mỗi buổi; `diem_thi.band_luc_thi` snapshot band lúc thi). Đếm Top-1 = đọc rank đã ghi.
- **⭐ Gu UI 2 cõi: STAFF = Apple-clean · HS-facing = GAME** (đừng lẫn): màn staff/vận hành = **Apple-clean** (xem "GU UI STAFF" ở ① — **KHÔNG sci-fi**; Thùy ĐÃ BỎ hẳn skill `bkdemy-scifi-ui`, đừng invoke cho staff). Profile HS chiếu TV = game vui nhộn (mascot/gradient tươi/Fredoka). Mockup chốt LOGIC trước, skin đẹp = phiên claude design sau.
- **⭐ Sửa tay HANDOFF/DEVLOG khi CHƯA pull = working tree bẩn chặn `git pull` (fast-forward abort) → tưởng "pull không ăn".** Về máy MỚI: `git pull` TRƯỚC rồi mới sửa. Lỡ sửa → `git stash` → pull → `stash pop`. (Diverged thật vs chỉ-chậm-sau: `git rev-list --left-right --count main...origin/main`.)
- **⭐ Supabase `.update()` resolve IM LẶNG kể cả 0 dòng / sửa nhầm cột** → chỉ báo "đã lưu" KHÔNG chứng minh data đổi. Nghi thì VERIFY DB (claude_ro). Vụ "đổi tên giáo trình buổi": indicator ✓ nhưng người sửa nhầm `tai_lieu_phan.tieu_de` thay vì `tai_lieu.ten`; RLS member_all cho UPDATE OK + không trigger → loại trừ đúng tầng bằng query TRƯỚC khi sửa code.
- **⭐ Fit-to-screen = giữ layout ở DESIGN_W cố định rồi `transform:scale(min(1,…))`**, KHÔNG responsive co chữ. transform KHÔNG đổi offset layout → đo `offsetHeight` ra kích thước thật, ResizeObserver không loop. `matchMedia` đọc viewport (KHÔNG bị `zoom:1.15` ở #root).
- **⭐ Cắt hình từ PDF = render DPI cao rồi crop, KHÔNG phóng ảnh nhỏ.** pdf.js render trang 300 DPI (hình vector nét tuyệt đối); hiển thị downscale để kéo box, map toạ độ về nguồn DPI cao khi cắt. Scan → cap theo DPI gốc. Worker Vite: `pdf.worker.min.mjs?url`.
- **⭐ paged.js `:first-of-type` theo TAG không theo class** → `.pv-btvn:first-of-type` áp NHẦM khi BtvnSheet là `<section>` duy nhất trong BuoiBlock (scope all → mất ngắt trang BTVN). Gate bằng class cha (`.pv-doc-btvn > …`) khi chỉ muốn trang-đầu-quyển.
- **⭐ AI trả JSON có LaTeX/text → DÙNG `responseSchema` (constrained decoding), đừng vá-tay từng lỗi.** `responseMimeType:'application/json'` KHÔNG đủ: Gemini vẫn ra `\dfrac` (1 backslash → "Bad escaped character") rồi `"` chưa escape ("Expected , or }") — vá lần lượt là đuổi mãi. Bật `generationConfig.responseSchema` (Type enum UPPERCASE) ép xuất JSON hợp lệ + tự escape. `lenientJsonParse` (nhân đôi backslash lẻ: `/\\(["\\/bfnrtu])|\\/g`) làm lưới phụ. Áp cho MỌI call AI→JSON.
- **⭐ Pixel-math trên element trong `#root` (zoom:1.15) phải map theo TỈ LỆ rect**, KHÔNG trừ thẳng `clientX-rect.left` (clientX ở viewport, rect đã zoom → lệch 1.15×). Công thức chuẩn: `(clientX-rect.left)/rect.width*canvas.width` (chống mọi zoom/scale/DPR).
- **⭐ Canvas cần đo/paint phải LUÔN mount** (ẩn bằng class, đừng render điều kiện): nếu chỉ mount khi `hasSrc` thì `paint()` chạy ngay sau set state → canvas chưa mount → vẽ hụt → "phải chọn file 2 lần". Mount sẵn (hidden) → ref có ngay.
- **⭐ List hiển thị có UPDATE tại chỗ PHẢI có thứ tự tường minh** (`.order()` hoặc sort client): PostgREST KHÔNG đảm bảo thứ tự; UPDATE đẩy tuple mới xuống cuối heap (MVCC). Điểm danh: `getRoster` thiếu order → mỗi `update diem_danh` làm HS vừa bấm NHẢY chỗ → "loạn thứ tự". Fix: sort client theo `hoc_sinh.ho_ten` (localeCompare 'vi', tie-break id) — PostgREST không order được theo cột bảng NHÚNG (`hoc_sinh(...)`). Mọi tab buổi (đánh giá/chấm/ET/BTVN) đều `roster.filter` từ 1 nguồn → fix 1 chỗ ổn định hết.
- **⭐ BTVN KHÔNG soạn riêng — làm CÙNG giáo trình + TRÍCH XUẤT + khớp (lớp+ngày).** (đã thử thêm editor BTVN riêng lá `lamtailieu:btvn` → Thùy bác → REVERT toàn bộ.) BTVN/giáo-trình-buổi đều là doc VẬN HÀNH bám (lớp+ngày) sinh từ trích xuất master (TrichPanel tick BTVN), tab buổi tự khớp y như ET. **"Chưa có BTVN" = buổi đó CHƯA trích BTVN, KHÔNG phải bug** (verify DB: 14 doc btvn đều `tu_trich`, gắn lớp+ngày, khớp buổi, không trùng). Đừng tạo đường soạn tài liệu vận hành tách khỏi trích xuất.
- **⭐ `responseSchema` (constrained decoding) LÀM PHẲNG xuống dòng:** áp responseSchema cho clone → Gemini gộp chuỗi 1 dòng (mất bố cục đề/lời giải). Prompt nói "cách xuống dòng" KHÔNG đủ — phải ép bằng **`description` per-field** trong schema (Gemini tôn trọng) + rule "giữ đúng bố cục nhiều dòng". Trade-off: responseSchema = JSON luôn hợp lệ NHƯNG mất format tự do → khi cần format, bù bằng description.
- **⭐ Migration sửa 1 phần QUÊN CHECK constraint = bug ẩn:** mig 0045 thêm BTVN (phase='btvn') nhưng QUÊN nới `gami_session_problems_phase_check` (vẫn ingame|et|mt) → insert 400. **Thêm giá trị mới cho 1 cột có CHECK/enum → PHẢI nới constraint cùng migration.** Sau migrate: grep code dùng giá trị mới + check `pg_constraint`.
- **⭐ `catch {}` nuốt lỗi = giấu bug, chẩn sai:** BtvnTab `catch → setMissing(true)` biến lỗi-constraint-400 thành "Chưa có BTVN" (đánh lừa = thiếu tài liệu, mất 2 phiên mới ra). Catch ở luồng load nên **log/hiện lỗi thật**, đừng map mọi lỗi về 1 trạng thái "rỗng".
- **⭐ In lặp tiêu đề (doc bám buổi):** doc `btvn`/`giao_trinh_buoi` từng in lớp/ngày/tên buổi ở 3 chỗ (bìa + dải buổi + header/footer). Quy ước: **tên buổi 1 lần** (dải buổi / tiêu đề phiếu) · **lớp+ngày ở header dải sóng** · **footer = liên hệ** (KHÔNG lặp tên/khối). `buildPagedCss(opts:{headerText,footerText})` override; bỏ pv-cover cho doc bám buổi. LT buổi-1-chuyên-đề → "Lý thuyết" (tên chuyên đề hay trùng tên buổi).
- **⭐ CHỤP ẢNH DOM (ảnh gửi PH / report) — luật chốt (06-22, sửa 6 vòng mới ra):** (1) **BÊ NGUYÊN pattern V1** `TabSatHach.handleCopy`/`copyImg` (đọc KỸ cả 2 hàm, đừng tự chế iframe/canvas): `window.open` → `document.write` HTML phiếu (card `outerHTML`) + html2canvas **CDN** + nút "Copy ảnh" TRONG popup → bấm = user-gesture trong popup → `clipboard.write(ClipboardItem)`; tải file CHỈ trong `catch`. (2) **KHÔNG chụp node sống trong app shell** (app CSS / `zoom:1.15` / scroll / clip → lệch/trắng) — popup = document sạch. (3) Card **tự-mô-tả bằng inline HEX/rgb** (KHÔNG class màu Tailwind v4 — v4 compute `oklch()` → `html-to-image` ra trắng âm thầm, `html2canvas@1.4.1` throw cứng). (4) Cần **căn-chữ-chính-xác / hình** trong vùng chụp → dùng **SVG** (`<text dominant-baseline=central>` — browser render, pixel-perfect), ĐỪNG dựa căn-CSS của html2canvas (baseline lệch + bỏ qua `position:relative` inline → nudge tay vô hiệu). [Auto-Report Pha 1.5: full app không inline-hex được → screenshot phải `getDisplayMedia`, KHÔNG html2canvas node live.]
- **⭐ Gu UI staff = clean/modern NHIỀU MÀU, KHÔNG sci-fi** (Thùy BỎ HẲN HUD "xóa luôn cơ mà") — ĐỪNG invoke skill `bkdemy-scifi-ui` cho màn staff. Profile HS-facing = game (khác). Muốn "đẹp hơn": **dựng mockup (visualize widget) duyệt hướng TRƯỚC**, hỏi mẫu tham chiếu — KHÔNG code thẳng rồi căn vòng vo. Card text: **bỏ `truncate`** (Thùy: tên phải FULL) + thông tin đầy đủ; lấp chiều ngang (đừng để cột rail rộng thừa).
- **⭐ Roster `buoi_hoc_hs` = SNAPSHOT lúc mở buổi → HS ghi danh SAU bị sót điểm danh.** Vá tại NGUỒN: `ghiDanh`/`setNgayVao` tự `syncHSVaoBuoiTuNgay` (thêm HS vào mọi buổi mở của lớp từ `ngay_vao`, mo+hoan_tat bỏ huy, idempotent) — KHÔNG chỉ dựa `dongBoSiSo`-lúc-mount (chậm + từng từ chối hoan_tat). Roster = SLOT (insert sẵn OK, §1.5 anti-NULL chỉ áp ở GRADE). Buổi hoan_tat thêm HS → tự về "cần điểm danh" (hoan_tat = phase Elo đóng, KHÁC điểm-danh-completeness). Chẩn bug sĩ số/roster = soi DATA THẬT (claude_ro: so `enrolled` vs `in_roster`) trước khi sửa.
- **⭐ Tuần BK + deadline = util thuần `lib/tuan.ts`** (giờ VN: `Date.UTC`, `vnInstant(ngay,'HH:MM')`=epoch VN−7h; KHÔNG `toISOString`/`new Date('YYYY-MM-DD')`). Tuần 1 mốc cứng `Date.UTC(2026,5,29)`. Ngưỡng/giá trị "người chỉnh được" → để 1 CONST tập trung (`NGUONG_DEADLINE`) chứ đừng rải số ma; UI settings dựng sau.
- **⭐ Sửa DATA SAI (xoá nhầm) = điều tra read-only TRƯỚC, xoá scope theo ID, ko cascade nếu pure-derive:** quy trình chốt — script `_diag` (claude_ro/SELECT) tìm HÀNG + MỌI downstream (FK con + bảng keyed theo `hoc_sinh_id`+`buoi_hoc_id`: grades/elo/exp/btvn/canh_bao/problems) → xác nhận khớp "mô tả sai" (vd HS đã `da_roi` lớp kia, lớp khai-giảng tương lai) → `_del` scope CỨNG theo id, print before, **abort nếu ≠ số dòng mong đợi**. **CẤM xoá đè dữ liệu ĐO THẬT** (§1.5): `buoi_hoc_hs` rỗng → xoá được; có ET/điểm → CHẶN (sửa điểm danh thay vì xoá). buoi_hoc_hs là SLOT, pure-derive → gỡ dòng là sĩ số tự đúng, ko phải dọn cascade. Đưa quy trình này thành **nút trong app** (gỡ HS khỏi buổi) thay vì cứ Supabase/nhờ Claude.
- **⭐ Danh mục liệt-kê (môn…) lấy từ NGUỒN CHUNG, ĐỪNG suy từ "data đang có":** panel lớp&band suy môn từ (môn-có-lớp ∪ môn-HS-học) → Anh/Văn chưa có lớp bị ẩn (Thùy: "phải đủ 4 môn"). Fix: 1 hằng `MON_LIST` (`src/lib/mon.ts`) dùng chung tuyển-sinh+HS. "Data-driven, ko cứng N" chỉ hợp khi danh mục THẬT SỰ động — môn/khối là danh mục CỐ ĐỊNH → hiện đủ để xếp/lập-kế-hoạch kể cả khi chưa có data của mục đó.
- **⭐ Doc VẬN-HÀNH (BTVN/giáo-trình-buổi) 1-1 với (lớp+ngày+loại) → re-tạo = THAY THẾ, ko đẻ thêm:** `trichXuatBuoi` insert mù → re-trích đẻ doc trùng → `getBTVNByBuoi.maybeSingle()` THROW → màn ko load (im lặng). Fix 3 lớp: (a) **unique index TỪNG PHẦN** `(lop_id,ngay,loai) where loai in (...) and lop_id/ngay not null` (master GT `lop_id` null ko dính) — DB chặn cứng; (b) trích **xoá-rồi-tạo**; (c) loader **`order+limit1` thay `.maybeSingle()`** (maybeSingle giòn — 2 dòng là throw cả màn). Bài học chung: query "đúng 1 dòng" mà nguồn có thể đẻ trùng → đừng maybeSingle, dùng order+limit1 + unique-index ở DB.
- **⭐ Cột schema CHUẨN BỊ SẴN nhưng chưa dùng = tái dùng đúng intent:** `dai_cau_hoi.menh_de` (jsonb) có sẵn từ lâu, null hết → đúng để chứa 4 mệnh đề câu Đúng/Sai (mỗi cái 1 `ma_dang` riêng), KHÔNG cần bảng mới. Trước khi đẻ bảng/cột, grep schema xem có cột prepared chưa.
- **⭐ Scope UI/search theo MÔN ĐANG XEM, ko xuyên môn** (Thùy: "kho nào search cái đấy thôi — nhân sự môn nào chỉ thấy môn đó"): search câu/kho dùng `config.cauTbl` của nhánh hiện tại, ko gộp Toán+KHTN. Khớp RBAC scope④ (staff thấy đúng môn). Mã câu `ma_cau = ma_dang + STT` → nhìn mã biết dạng/khối → lần về kho nhanh.
- **⭐ "Tính năng ko thấy trên bản chạy" → kiểm CHƯA-COMMIT / CHƯA-PUSH trước khi nghĩ thiếu/hỏng:** reorder dạng đã code xong nhưng nằm working-tree CHƯA commit → `origin/main` (Vercel deploy) ko có → Thùy báo "cần lại tính năng". Quy trình chẩn: `git status` (uncommitted) → `git log origin/main..main` (unpushed) → `git show origin/main:<file>` (có trên deploy ko). Đừng vội build lại cái đã có. Code chạy local ≠ đã deploy: chỉ **push main** mới lên Vercel.
- **⭐ Chiều MÔN = 2 NGUỒN tách bạch, đừng lẫn:** `nhan_su_mon` (môn của NGƯỜI → scope④ content: vào kho/tài liệu môn nào) vs `vi_tri.mon` (môn của GHẾ → cấu trúc org + span-of-control trong môn + role bám ghế → "mở màn nào"). Quyền-mở-màn (①) từ role-trên-ghế, KHÔNG từ môn; môn chỉ siết NỘI DUNG (④) + TÁCH cây org. Người ngồi ghế KHTN phải được gán KHTN ở Nhân sự mới vào được kho KHTN (2 thao tác). Môn (như quyền) **load lúc LOGIN** → đổi xong phải đăng nhập lại.
- **⭐ Thêm chiều lọc (môn) vào bảng CÓ SẴN data → BACKFILL kẻo "biến mất":** thêm `vi_tri.mon` + lọc `mon===sel` làm 31 ghế cũ (mon=null) mất khỏi mọi tab. Backfill ghế chuyên môn cũ → 'Toán' (org trước chỉ Toán) NGAY sau migration. Cùng pattern: nhan_su_mon backfill mọi NS = Toán. Quy tắc: cột-lọc mới NOT-NULL-trong-thực-tế nhưng nullable-trong-DB → backfill giá trị mặc định hợp lý cho data cũ.
- **⭐⭐ KIẾN TRÚC MÔN = mỗi môn 1 TRUNG TÂM riêng, ĐỪNG gộp content (Thùy chốt sau audit 06-29):** 4 môn = 4 bounded-context đối xứng (bản chất như nhau), chỉ chung HS + vận hành. **Content (kho/dạng/câu/lý-thuyết) RIÊNG từng môn/nhánh — KHÔNG gộp 1 bảng chung.** Lý do bác gộp: các môn/nhánh KHÁC cấu trúc (Đại=Câu, Hình=Bài/Ý; Lý/Hóa/Sinh/Văn/Anh sẽ khác) → gộp = ghép cứng domain độc lập, **lợi hiệu suất ~0** (bảng riêng bằng/nhanh hơn), rủi ro "sai lệch 1 tý là phiền". Kho xây-1-lần, mở chiều RỘNG (thêm trung tâm) không nhồi sâu. **LUẬT (CLAUDE.md §1.6): mọi dữ liệu HỌC TẬP mang nhãn `mon`; chỉ phi-học-tập (HS cá nhân/PH/ví-xu/tài-khoản) mới chung.** Nhãn 2 tầng (môn→nhánh). Symmetry test = tiêu chí đúng: `if mon==='Toán'` đặc biệt trong code chung = SAI. Bài học meta: **đừng vá-ngọn dispatch từng màn — audit gốc trước; CEO bác "gộp cho gọn" là đúng (bounded context > DRY khi domain độc lập).** Chi tiết: `ADR-mon.md`.

- **⭐ Postgres regex KHÔNG hiểu `\d`/`\s` như JS/PCRE** (chẩn SAI 1 lần: query "khối 7 có câu dính Câu N?" trả 0 → tưởng sạch, thực ra 11 câu): POSIX ARE của Postgres — `\d`/`\s` cho kết quả LỆCH/rỗng. Dùng **`[0-9]` / `[[:space:]]`** (hoặc `~*` + lớp POSIX). Test regex trên DB bằng ILIKE (chắc) trước khi kết luận "không có dòng nào".
- **⭐ Layout đáp án/ý-con = tách theo NHÃN + ước lượng độ rộng** (`splitStem`/`OptGrid` dùng chung print): ưu tiên đáp-án-A/B/C/D-nhúng → ý-con-a/b/c (`splitLabeled`, đòi nhãn LIÊN TỤC chống bắt nhầm "a)" lẻ) → ý-con-KHÔNG-nhãn. `optCols` ngưỡng 14/30 (≤14→4 cột·≤30→2×2·dài→1). Câu có hình: đề→HÌNH→đáp án. Đáp án nhúng trong noi_dung (lua_chon=null) = data bẩn nhưng RENDER tự tách được (fix hiển thị, ko cần sửa data gấp).
- **⭐ BLOCK model (Thùy chốt): block = tầng HIỂN THỊ ≈/⊆ 1 dạng, câu giữ `ma_dang`.** Lưu = tái dùng `tai_lieu_phan` (nhiều phan cùng ma_dang = nhiều block/dạng), `kieu` = registry mở rộng (thêm kiểu = thêm renderer, ko sửa schema). Setting doc (lý thuyết/kiểu) để builder + persist `cau_hinh` → **trích xuất buổi KẾ THỪA** (Thùy trích-buổi-gán-lớp, KHÔNG xuất cả file → đừng đặt lựa chọn ở toolbar-in, đặt ở SETTING).
- **⭐ paged.js `.preview()` async + effect đổi deps NHIỀU LẦN = 2 Previewer chồng → NHÂN ĐÔI TRANG:** effect có dep load muộn (vd `lopTen` fetch sau `full` ở doc bám-buổi) → chạy 2 lần; cleanup `cancelled=true` KHÔNG chặn Previewer đang flow → run cũ vẫn append trang SAU khi run mới đã clear node → trang gấp đôi (chỉ lộ ở doc đủ dài + có dep async, doc ngắn/không-async ko dính → dễ tưởng "chỉ 1 doc lỗi"). **Fix: mỗi run render vào CONTAINER RIÊNG (`createElement` append live để paged.js đo layout); run stale (`cancelled`) tự `.remove()`, run mới xoá container run trước → luôn CHỈ 1 bản.** (Áp `PrintView`+`ETPrintView`.) Bài học chung: engine async ghi thẳng DOM chung + React re-run = phải cô lập output mỗi run + huỷ output stale, KHÔNG chỉ set cờ.
- **⭐ MASTERY = suy động (HS×dạng), công thức Thùy: Đ/C/S per lần = 1/0.5/0; TB 5 lần gần nhất → ≥0.8 đạt·0.5–0.8 cần luyện·<0.5 yếu; chưa-đo=null(≠0); độ tin theo cỡ mẫu.** Dùng **mean** (ko tổng tuyệt đối) để <5 lần vẫn xếp mức. V1 (`StudentAcademicView.jsx`) = **ví dụ CÁCH HIỂN THỊ** (timeline lần đánh giá per-dạng), KHÔNG phải cách đo (V1 binary Đ/S, ngưỡng 0.7; V2 3-mức, ngưỡng **0.8**). Nguồn đo V2 = ingame+ET (`gami_grades.result` qua `problem_id→session_problems.ma_dang`)+đánh giá GV (`buoi_danh_gia_dang.diem`); **BTVN LOẠI** (toggle để soi). Engine `src/gami/mastery.js` + service `src/lib/mastery.ts`. **3 view TÁCH** (từng-HS chi tiết / lớp rollup tổng quát / chiều-dạng), ĐỪNG gộp 1 heatmap (Thùy bác). [Login HS ĐÃ CÓ 07-04 — `my_hoc_sinh_id()`/`tai_khoan.hoc_sinh_id`; ⏳ mastery CHƯA đọc kết quả ET-online (`bai_lam_cau`).]
- **⭐ ĐẾM/TỔNG-HỢP TOÀN BẢNG: KHÔNG fetch-all rồi group ở client — PostgREST cap `max-rows` (~1000) cắt ÂM THẦM (không lỗi) → sai KHÔNG báo.** Triệu chứng: kho >1000 câu → thẻ "0/50" cho dạng mới (cuối heap) trong khi DangHub (lọc theo 1 dạng, <cap) vẫn thấy câu. Chẩn: data đúng (soi claude_ro) + RLS `la_thanh_vien()` STABLE no-arg = eval 1 lần (không throw/timeout) + card render được (query xong) ⇒ chỉ còn cap. **Fix = aggregate ở Postgres trả `jsonb` 1 DÒNG** (RPC `count_cau_by_dang` `jsonb_object_agg`) — 1 dòng miễn nhiễm cap; GROUP-BY nhiều dòng CŨNG dính cap nên phải jsonb. `security definer` + guard `la_thanh_vien()` + whitelist bảng. (mig 0062.)
- **⭐ RASTERIZE paged.js → PDF (html2canvas-pro + jsPDF): header/footer là `::before/::after` NHIỀU background (logo+chip+wave) KHÔNG chụp được** → header trắng, chữ trắng thành mờ, trang lỗi (§367 cảnh báo đúng). **Fix: `onclone` TẮT pseudo (`content:none`) + chèn PHẦN TỬ THẬT** (`<img>` logo + `<img>` chip + 1 wave nền ĐƠN + `<span>` text) — html2canvas chụp ảnh/element thật chuẩn. Kèm: `await document.fonts.ready` + preload logo TRƯỚC chụp (chống trang trắng chữ) · render **on-screen sau lớp phủ đục** (KHÔNG `left:-99999px` — xa quá hay ra trắng) · `html2canvas-pro` (chịu oklch Tailwind v4, bản gốc throw). Nguồn header/footer = 1 hàm chung (`pageChrome`) cho cả paged-CSS (pseudo, bản IN vector) lẫn onclone (element, bản TẢI). PDF tải = RASTER (chữ không select) — bản vector vẫn ở `window.print()`. **window.print KHÔNG tự tải file** (bắt buộc hộp thoại) → muốn 1-bấm-tải phải tự dựng PDF.
- **⭐ Bản GV in tài liệu phải phủ MỌI loại câu** (gom `GvAnswer` dùng chung): **Đúng/Sai** đừng chỉ render `noi_dung` — 4 mệnh đề ở `menh_de` (render a·b·c·d + Đ/S; thiếu = mất câu ở CẢ bản HS). **ET trả-lời-ngắn** GV cần cả lời giải (không chỉ đáp án ngắn). Câu `menh_de` trong ET → route sang nhánh CauItem (bảng TLN không hiển thị nổi mệnh đề).
- **⭐ Renderer phải cân bằng `$` lẻ (AI clone hay quên `$` đóng cuối)** — `balanceDollars` trong `MathText.buildLines` (đếm `$` đơn không-escape, LẺ → thêm cuối). Đếm THỦ CÔNG `s[i-1]!=='\\'`, **KHÔNG lookbehind regex** (Safari <16.4 ném SyntaxError lúc parse module → chết cả file). Fix ở renderer = lợi mọi nơi + data cũ.
- **⭐ Gom việc "Việc của tôi" theo NGÀY** (mỗi ngày 1 hàng) thay lưới `auto-fill` tràn ngang: đầu hàng = thanh-màu-kẻ-dọc (design §259) + Thứ/ngày/đếm; body = card của ngày. `thuCuaNgay` dùng `Date.UTC`+`getUTCDay` (không lệch tz, KHÔNG `new Date('YYYY-MM-DD')`).
- **⭐ RLS 2 CÕI staff/HS — bảng mới KHAI TAY, HS ≠ `la_thanh_vien()`:** 0026 blanket member_all chỉ phủ bảng CÓ SẴN lúc đó; bảng mới (test online) phải tự khai 2 policy song song: staff = `la_thanh_vien()` · HS = scope riêng (`my_hoc_sinh_id()`/`hs_o_lop()`). Tài khoản HS (`hoc_sinh_id` set, `nhan_su_id` null) KHÔNG phải thành viên → tự tách khỏi mọi màn staff. HS cần đọc 1 bảng staff (vd tên lớp) → thêm policy đọc HẸP (`lop_hs_read` theo `hs_o_lop`), đừng nới member-gate.
- **⭐ Bài THI online = 3 lớp chống gian lận, THIẾU 1 là thủng:** (1) HS **không SELECT được bảng chứa key** (RLS loại ET) — client "không hiển thị" là vô nghĩa, HS đọc PostgREST thẳng được; (2) đề qua **RPC security-definer LỌC key/lời giải** (`et_de`); (3) **chấm SERVER-side + chỉ chấm lần nộp ĐẦU** (`et_nop` claim `get diagnostics row_count`) — chấm client hay chấm-lại-mỗi-lần-gọi đều cho sửa-đáp-án-rồi-nộp-lại. Snapshot phải **self-contained** (kèm lý thuyết/lời giải) vì HS không đọc kho.
- **⭐ Đáp án nhiều phần tách CHỈ theo `;`, ĐỪNG tách theo `,`:** `,` là dấu THẬP PHÂN VN ("0,5") — V1 `split(/[;,]/)` cắt "0,5"→["0","5"] là bug ngầm. Kho quy ước list = "3; 4". (`smartCheckTLN` testgrade.js.)
- **⭐ App HS-facing trên NỀN app staff có `#root{zoom:1.15}`:** đừng sửa zoom gốc (vỡ staff) — bọc nhánh HS trong `zoom: 1/1.15` → net 1.0 cho điện thoại. Màn làm-bài dùng `h-screen` (footer nút ghim đáy, giữa cuộn).
- **⭐ FK bảng bài-làm → bảng đề snapshot phải CASCADE:** `bai_lam_cau→bai_test_cau` để RESTRICT làm "xoá test phát lại" FAIL ngay khi có 1 HS làm (mig 0066). Xoá instance đông cứng = bỏ luôn bài làm của nó — thiết kế FK theo vòng đời instance, đừng mặc định RESTRICT.
- **⭐ Đổi state có ĐIỀU KIỆN LIÊN QUAN (HS nghỉ ⇒ phải rời lớp) = TRIGGER DB, không phải "nhớ gọi thêm hàm ở app":** bug lộ ra qua triangulation (đúng §5) — provisioning script lọc `trang_thai='dang_hoc'` phát hiện 2 HS "nghỉ" nhưng vẫn `dang_hoc` 1 lớp = data mâu thuẫn, do chưa từng có cơ chế nào tự đóng ghi danh khi đổi trạng thái HS. Fix: trigger AFTER UPDATE `hoc_sinh` tự đóng mọi `hoc_sinh_lop.dang_hoc` liên quan (chảy qua trigger log sẵn có). Bài học chung: khi 1 thay đổi ở bảng A **logic bắt buộc kéo theo** thay đổi bảng B, đặt invariant đó ở TRIGGER — đừng rải "nhớ gọi hàm X sau khi set Y" ở nhiều nơi trong app (chắc chắn có chỗ quên).
- **⭐ Xáo hiển thị (chống liếc bài) = CHỈ đổi tầng UI, chấm luôn theo chỉ số GỐC:** cần 2 HS thấy thứ tự câu/đáp án khác nhau nhưng chấm điểm phải nguyên vẹn — đáp: seed ổn định theo (HS×bài[×câu]) sinh hoán vị CHỈ dùng để hiển thị (nhãn A/B/C/D theo vị trí hiển thị), còn `state`/so-sánh-đúng-sai luôn dùng **chỉ số gốc** (orig). Nhờ vậy engine chấm (client lẫn server RPC) không cần đổi 1 dòng nào. Bài học chung: khi cần "trộn ngẫu nhiên nhưng vẫn chấm đúng", tách bạch NGAY từ đầu 2 khái niệm — vị-trí-hiển-thị vs định-danh-gốc — đừng để logic chấm phụ thuộc vị trí render.
- **⭐ Khoản tiền/thuộc-tính "đi kèm nhau" trong 1 bảng mức = giả định RỦI RO, hỏi rõ TRƯỚC khi gộp:** bundling ban đầu "học phí + giá đuổi cùng 1 mức" rồi lại phải tách 2 lần (mức đầu → theo lớp → cuối cùng đuổi phải theo CA chứ không theo lớp gốc). Bài học: khi 2 con số CÓ VẺ liên quan (cùng 1 lớp, cùng 1 loại phí) chưa chắc cùng ĐƠN VỊ THAY ĐỔI — hỏi CEO "cái này có luôn đi cùng nhau không, hay có lúc tách riêng" trước khi thiết kế bảng, đỡ phải tách schema 2-3 lần.
- **⭐ "Hệ số/thuộc tính của NHÓM" mặc định nên nghi ngờ — kiểm xem có phải thực ra là của TỪNG CÁ THỂ:** hệ số học phí ban đầu đóng dấu-1-số-cho-cả-gia-đình (giống elo/exp per-môn từng bị hiểu nhầm là per-nhóm) — đúng ra là per-HS, chỉ điều kiện tính có tham chiếu tới anh-chị-em. Dấu hiệu nhận: nếu 2 điều kiện tính (bản thân + so-với-người-khác) gộp thành 1 số chung cho CẢ NHÓM thay vì lưu riêng từng cá thể → dễ sai khi nhóm thay đổi (thêm/bớt thành viên) mà không có cơ chế nào recompute đúng lúc.
- **⭐ Bảng "tổng quan bulk" (N PH/HS cùng lúc) và "chi tiết 1-đối-tượng" là 2 NGUỒN TÍNH KHÁC NHAU, đừng cố dùng chung 1 hàm:** bulk phải batch-query (gộp mọi query "theo X" thành 1 query `.in()` rồi map trong JS) để tránh N+1 nổ theo số PH; chi tiết 1-đối-tượng thì N+1 chấp nhận được (rẻ) nhưng CHÍNH XÁC hơn (chạy đủ xét-duyệt/nợ-cũ/phát-sinh-tay). Sự lệch số giữa 2 nguồn là ĐÚNG THIẾT KẾ (bulk là ước lượng nhanh), không phải bug — nhưng phải nói rõ trong UI/comment kẻo sau này tưởng bug.
- **⭐ "Chỉ tính khi CÓ điều kiện nền" — đừng default charge vô điều kiện:** học liệu ban đầu charge bất kể tháng đó có buổi học không (lớp 0 buổi vẫn thu học liệu) — sai theo trực giác nghiệp vụ ("chưa học thì sao thu"). Khi 1 khoản phụ (B) đi kèm 1 khoản chính (A), mặc định B chỉ tính khi A cũng phát sinh — đừng tính B độc lập trừ khi CEO xác nhận rõ.
- **⭐ State chọn-lọc (PH đang xem / kỳ đang chọn / tab con) phải sống ở STORE ngoài React tree nếu user kỳ vọng "quay lại vẫn còn":** `useState` cục bộ mất sạch khi component unmount (tab-switch dùng conditional-render, hoặc rời hẳn màn). Bug này generic — bất kỳ màn nào có tab con unmount-khi-đổi-tab đều dính. Fix 1 lần: dồn state "phải nhớ" vào zustand `useStore` (module-scope, không phụ thuộc component lifecycle); state tạm (input đang gõ, loading) vẫn để `useState` bình thường — đừng lạm dụng store cho MỌI state.
- **⭐ `SearchSelect` (component DÙNG CHUNG) — dropdown mặc định luôn bung XUỐNG là giả định sai khi trigger gần đáy màn hình:** phải đo `getBoundingClientRect()` lúc mở rồi tự quyết bung lên/xuống (giống mọi combobox thật). Sửa 1 lần ở component gốc lợi TOÀN APP, không phải vá riêng từng chỗ dùng nó.
- **⭐⭐ Spec (kể cả do AI/người ngoài viết kỹ) vẫn có thể SAI về VỊ TRÍ/IA dù đúng kỹ thuật — chỉ lộ ra khi soi UI THẬT:** feature "Đề thi" ban đầu đặt đúng như spec gợi ý (`lamtailieu:de_thi`, cạnh Giáo trình/ET) — kỹ thuật/data-model không sai gì, nhưng SAI mô hình tư duy: "Làm tài liệu" = soạn TỪ kho có sẵn (chiều kho→ra), còn đề thi là NGƯỢC chiều (đề→vào kho), đúng ra phải cạnh "Nhập kho". Thùy chỉ ra ngay khi thấy UI thật, sửa RẺ vì đã tách bạch UI (nav/entry-point) khỏi logic (component/data) từ đầu — chỉ cần dời nơi render, không sửa lại bên trong. Bài học: **luôn tách UI-vị-trí khỏi component-logic** để lỗi IA (nếu có) sửa rẻ; và genuinely audit/build theo spec không thay thế được việc CEO xem trên UI thật — 2 tầng kiểm khác nhau, không tầng nào thừa.
- **⭐⭐ paged.js KHÔNG hỗ trợ CSS layout hiện đại (`display:grid`/`<table>`/`display:flex`) — TREO CỨNG (không lỗi, không ra trang, chờ vô hạn); CHỈ block/inline-level (`display:block`/`inline-block`) an toàn.** Vụ ghép câu 2/3/4-cột trong in giáo trình: `column-count` không treo nhưng KHÔNG tôn trọng `break-after:avoid` của heading theo sau → heading mồ côi cuối trang + khoảng trắng xấu, không cách nào vá bằng CSS thuần. Thử thay bằng grid/table/flex (tưởng căn hàng ngang nhau tốt hơn) → **CẢ 3 đều treo cứng paged.js** (test thật, không đoán). Fix cuối: bỏ hẳn multicol, **ghép câu theo HÀNG bằng `inline-block`** (`.pv-row` = N câu `display:inline-block`, width `calc()`+CSS var `--cols`) — vẫn là block-flow bình thường nên paged.js ổn định, hàng xếp chồng tự nhiên, cột chạy xuyên trang được, không cần tránh-mồ-côi (không còn "khối lớn" phải giữ nguyên). ⚠ **Test paged.js LUÔN dùng tab/server HOÀN TOÀN MỚI mỗi kịch bản** — tái dùng tab đã chạy qua 1 case treo làm MỌI test sau đó "ăn theo" treo oan (suýt kết luận sai "table cũng lỗi do CSS", thực ra do tab cũ). Lần fix ĐẦU (bọc `break-inside:avoid` quanh cả khối) tưởng ổn qua repro giả lập nhưng **gây MẤT NỘI DUNG thật** trên tài liệu thật (nhiều dạng liên tiếp + KaTeX nặng hơn giả định) — bài học: repro giả lập PASS không chứng minh AN TOÀN, phải verify trên app thật trước khi báo xong việc nhạy cảm (in ấn/dữ liệu).
- **⭐⭐ Trước khi thiết kế field lương/hiệu-suất mới — verify bảng đang có ĐÚNG LÀ của đối tượng định dùng, đừng suy theo TÊN GIỐNG NHAU:** spec Giao việc giả định `luong_bac`/`gami_exp_ledger` ("lương"/EXP) là cơ chế lương NHÂN SỰ để tái dùng — verify schema lộ ra đó là cơ chế gamification CỦA HỌC SINH (tên gọi trùng "lương" chỉ là ẩn dụ vui trong ADR thành tích). Nếu tin theo spec mà không verify sẽ dựng nhầm lương NS lên bảng của HS. Bài học chung: tên bảng/cột nghe "đúng ý" không đủ — luôn `information_schema`/đọc FK thật xem nó THỰC SỰ trỏ tới đối tượng nào trước khi tái dùng.
- **⭐⭐ CÔNG THỨC NGHIỆP VỤ (điểm/hiệu suất/tiến độ...) KHÔNG ĐƯỢC ĐOÁN — 3 lần sai trong 1 buổi (07-06):** (1) "chất lượng" TA chấm ET bịa từ tỉ lệ HS làm đúng bài — nhầm outcome-học-tập với quality-làm-việc; (2) gọi tràn `deXuatTienDo()` (hàm chỉ đúng cho task ĐÃ xong, dựa `r.doneAt`) cho cả task CHƯA xong → hiện nhầm "Tiến độ 100%" cho việc còn trễ hạn chưa làm; (3) đoán "Hiệu suất = trung bình cộng(tiến độ, chất lượng)" — SAI, công thức thật là **Chất lượng − phạt tiến độ** (phạt = 100−tiến độ, KHÔNG PHẢI avg). Thùy bắt lỗi cả 3 lần ngay khi nhìn số hiện ra vô lý trên UI. **Quy tắc rút ra: công thức tính điểm/hiệu suất/xếp hạng — dù nhìn "có vẻ hợp lý" — PHẢI hỏi rõ định nghĩa/ví dụ cụ thể từ CEO TRƯỚC khi code, đừng suy đoán rồi để lộ qua UI.** Việc dựng UI xong rồi mới lộ sai công thức (từng bug) đắt hơn hỏi trước 1 câu.
- **⭐ Task CHƯA XONG vẫn suy được số "tiến độ SỐNG"** (không phải luôn `null`): so hiện-tại-với-deadline (cùng ngưỡng giờ trễ của task đã xong) → số tụt dần nếu càng để lâu, đúng pattern badge Quá hạn/Sát hạn đã có sẵn ở "Việc của tôi" (`mucDeadline`). Khi 1 field "chỉ tính được lúc xong" bị hỏi "sao chưa xong mà có số" — cân nhắc có phải nó thực ra suy được LIVE từ deadline, đừng vội để `null`.
- **⭐ "Ngày hiển thị/đến-hạn" ≠ "ngày sự-kiện-gốc" → filter khoảng-tuần theo NGÀY GỐC là bug rình sẵn ở 2 biên:** report tối-hôm-trước ca học — filter `ngayReport>=tu` (chặn trùng khi xem tuần liền kề) chỉ test 1 chiều (hôm nay=cuối tuần) mà quên chiều kia (hôm nay=ĐẦU tuần, report-hôm-qua thuộc TUẦN TRƯỚC theo lịch nhưng vẫn phải hiện vì còn nợ). Khi 1 mốc hiển thị lệch khỏi mốc sự kiện (report=ngày-trước, deadline=giờ-sau…), test filter khoảng phải thử CẢ 2 đầu tuần (đầu tuần lẫn cuối tuần đang xem), không chỉ 1 kịch bản.
- **⭐ Component tự giữ state RIÊNG (tách khỏi list cha, key không đổi) — MỌI hàm ghi-rồi-cần-phản-ánh-UI phải tự refetch, không có ngoại lệ "hàm này chắc không cần":** `LuotCard` (PrepScreen) có 4 hàm ghi (`tick/cham/chot/dong`), 3 hàm đầu tự `setRow()` sau ghi, hàm thứ 4 (`dong`) quên — vì key card không đổi (`phong+luot`) nên React không remount, state cũ tồn tại dù DB đúng, card "trông như chưa đóng". Khi copy-paste pattern refetch cho hàm anh-em, audit ĐỦ cả nhóm cùng lúc, đừng tin "đã sửa xong" sau khi thấy 1-2 hàm đúng.
- **⭐ Trước khi đặt SỐ migration mới, `ls supabase/migrations | tail` check TRÙNG** — nhất là khi biết có thể có phiên/máy KHÁC đang chạy song song (07-07: 1 phiên khác đang tạo `web_lead_writer_role` cho bkdemy-web, đụng đúng số 0087 với tôi, phát hiện lúc `git status` thấy file untracked lạ). Đừng đụng/xoá file người khác — đổi số CỦA MÌNH cho tránh đè, xong ghi rõ lý do đổi số vào DEVLOG.
- **Áp 1 migration lẻ đã CÓ SẴN script `scripts/_apply_one.mjs <file.sql>`** (xem ①) — dùng CÁI NÀY, đừng tự chế lại logic tương tự trong `migrate.mjs` (đã từng tự sửa `migrate.mjs` thêm argv-filter rồi phải revert vì trùng chức năng — kiểm tra HANDOFF/`scripts/` trước khi tưởng "thiếu tool" mà tự đẻ thêm).
- **⭐ Storage bucket KHÔNG tự tồn tại chỉ vì HANDOFF/migration nói "đã chạy" — verify LIVE trước khi tin, đặc biệt trên project/environment MỚI hoặc lâu không đụng lại.** Bước tạo bucket là THAO TÁC TAY qua Supabase Dashboard (`claude_build` không có quyền schema `storage`, chỉ `public`), rất dễ bị bỏ sót khi chuyển project/môi trường mới. **⚠ SỬA LẠI 07-09 — cách verify ĐÚNG khác cách nghi ban đầu:** `storage.listBuckets()` bằng **anon/authenticated key KHÔNG đáng tin** — RLS mặc định chặn SELECT trên bảng `storage.buckets` (khác `storage.objects` có policy `to public`) nên LUÔN trả `[]` GIẢ dù bucket có tồn tại thật (đã tự dính đúng lỗi này 1 lần khi verify lại). **Verify đúng: dùng `SUPABASE_SERVICE_ROLE` key gọi `listBuckets()` (bypass RLS), hoặc test thẳng `storage.from(bucket).list()`** (ăn theo policy objects, phản ánh đúng thực tế app dùng).
- **⭐ `ma_dang` KHÔNG tự động unique xuyên MÔN — verify bằng `join` đếm trùng trước khi tin "namespace tách biệt":** tưởng KHTN dùng dãy mã riêng (KG/KC) như ý định gốc ghi trong HANDOFF, thực tế KHTN seed bằng format số giống Toán → 17 mã trùng số giữa `dai_ban_do`/`khtn_ban_do`. Mọi chỗ tra tên/thông-tin theo `ma_dang` mà KHÔNG biết trước `mon` (gộp/merge nhiều bảng theo môn) → RỦI RO lộ nhầm tên môn khác cho mã trùng (bug thật: buổi bù Toán hiện tên dạng KHTN). Quy tắc: **có `mon` trong tay lúc nào → dùng NGAY để chỉ tra 1 bảng đúng môn đó** (`khoCuaMon(mon)`), đừng gộp-rồi-lọc.
- **⭐ Buổi-loại-MỚI (`buoi_hoc.loai`) thêm vào enum/CHECK KHÔNG có nghĩa là `getMyTasks()` tự route được cho nó** — phải tự tay thêm nhánh derive (route theo cột chủ sở hữu đúng của loại đó: `nguoi_day`/`nguoi_day_tg` hay `phan_cong_lop`) + component Detail phải `export` và nhận được `buoiId` độc lập (không chỉ nhận full object từ 1 màn list cụ thể) mới mở được từ "Việc của tôi". `loai='bo_tro_duoi'` tồn tại trong schema/UI list từ lâu nhưng KHÔNG có task nào route tới nó cho tới khi phát hiện qua báo lỗi thật — kiểm tra CHÉO: mỗi `buoi_hoc.loai` mới thêm, tự hỏi "task cho nó route ở đâu trong `getMyTasks()`?" ngay lúc build, đừng đợi ai báo thiếu.
- **⭐⭐ Hoạt-động-đa-lớp (MT) KHÔNG cần bảng/entity RIÊNG cho "buổi" của nó — nếu bản chất là 1 PHASE của buổi_hoc đã có (07-08, Thùy chốt sau khi build sai kiến trúc 1 lần):** bản đầu cho MT hẳn `buoi_hoc.loai='mt'` riêng (giống ET/BTVN từng KHÔNG có buổi riêng làm mẫu ngay trước mắt mà vẫn không theo) → sinh HÀNG LOẠT vấn đề đồng bộ (buổi thường song song không tự đóng, "Buổi học" phải thêm nhánh routing riêng, "Việc của tôi" phải query riêng) mà lẽ ra KHÔNG TỒN TẠI nếu theo đúng mẫu ET (buổi thường + cột đóng riêng `_dong_at` + tab UI). Dấu hiệu nhận sớm: nếu 1 hoạt động mới **luôn xảy ra TRONG 1 buổi_hoc đã/sẽ tồn tại** (dù nó multi-lớp/multi-lần như MT) thì nó là PHASE, không phải LOẠI BUỔI mới — chỉ tạo `loai` mới khi hoạt động đó không gắn với buổi_hoc nào cả (vd sự kiện độc lập ngoài lịch lớp). So sánh với mẫu tương tự CÙNG hệ thống (ET) TRƯỚC khi chọn kiến trúc, đừng thiết kế từ đầu như nó chưa từng có tiền lệ.
- **⭐ Buổi "hoàn tất" khi thêm 1 phase MỚI (không phải-mọi-buổi-đều-có, như MT) vào buổi thường có sẵn (ingame+et) → gate PHẢI hỏi thêm "phase này có ÁP DỤNG cho buổi này không" trước khi đòi nó đóng:** gate cũ (ternary 2 chiều `phase==='et' ? ingame_dong_at : et_dong_at`) không đủ khi thêm chiều thứ 3 — nếu bắt buộc `mt_dong_at` luôn phải có mới hoàn tất thì buổi KHÔNG gán MT (đa số buổi) sẽ KHÔNG BAO GIỜ hoàn tất được. Fix: query nhẹ ngay trong hàm đóng phase xem phase đó CÓ tồn tại thật cho buổi này không (`gami_session_problems` count theo phase, hoặc `tai_lieu` instance exists) rồi mới đưa vào điều kiện gate — áp dụng cho MỌI lần thêm phase tuỳ-chọn (không phải mọi buổi đều có) vào 1 luồng "hoàn tất" đã có sẵn N phase cố định.
- **⭐⭐ Khi CEO mô tả rule nghiệp vụ bằng lời có ≥2 cách hiểu (hẹp/rộng) — QUERY DB xem THỰC TẾ dữ liệu ủng hộ cách nào, đừng chỉ suy luận trên giấy "cách nào an toàn hơn":** "gán MT thì đóng hoạt động khác của buổi" — tự chọn cách hiểu HẸP ("chỉ đóng của chính buổi MT vừa tạo") vì nghĩ an toàn hơn (ít side-effect), KHÔNG chủ động kiểm xem có buổi_hoc(loai='thuong') SONG SONG cùng (lớp,ngày) hay không — thực tế CÓ (9S1 hôm đó đã có buổi thường), CEO test thật mới lộ thiếu. Bài học: gặp câu lệnh nghiệp vụ mơ hồ, việc ĐẦU TIÊN là tra DB xem tình huống thực tế nó áp dụng lên state nào, không phải chọn phương án nghe "conservative" hơn trên lý thuyết.
- **⭐ Hành-động GẮN 1 nội dung (MT/ET/tài liệu…) vào buổi đã có/sẽ có KHÔNG được hỏi lại thuộc tính CỦA BUỔI (giờ/phòng/GV) — buổi tự suy từ TKB hoặc đã tồn tại sẵn, hỏi lại là sai lớp trách nhiệm:** form "Gán MT vào buổi" bản đầu có 3 ô Giờ/Phòng/GV thừa (CEO: "cái đó thuộc về buổi học"). Quy tắc chung khi thiết kế form "gắn X vào entity Y có sẵn": chỉ hỏi cái form đó THỰC SỰ sở hữu (ở đây: định danh buổi = lớp+ngày); mọi thuộc tính khác của Y phải suy/tái dùng từ nguồn đã có (TKB) hoặc để entity Y tự quản, không hỏi lại người dùng dù "tiện có sẵn ô nhập".
- **⭐⭐ `overflow-hidden`/`overflow-x-auto` trên 1 div CHỈ để bo-góc/cuộn-ngang sẽ NUỐT sticky của con nếu div đó không tự cuộn dọc:** theo CSS spec, bất kỳ `overflow` khác `visible` trên 1 ancestor (kể cả chỉ set 1 trục) đều biến nó thành "scroll container" — `position:sticky` của con bám vào ancestor GẦN NHẤT có overflow non-visible, KHÔNG PHẢI ancestor thật đang cuộn (trang ngoài). Div bọc chỉ để bo-góc/cho-cuộn-ngang thường KHÔNG có `max-height` riêng (cao = nội dung, tự nó không bao giờ cuộn dọc độc lập) → sticky "bám" vào 1 khung chẳng hề cuộn → nhìn như vô hiệu, không báo lỗi gì. Vá: gỡ overflow khỏi div bọc cosmetic đó, để khung cuộn NGOÀI CÙNG (cấp trang) làm chuẩn duy nhất. Muốn 1 bảng vừa sticky-top vừa tự cuộn-ngang-riêng (không kéo cả trang) thì div bọc đó phải TỰ LÀ khung cuộn dọc luôn (`flex-1 min-h-0 overflow-auto` có chiều cao bound, kiểu `ETChamTab`/`MTTab` trong BuoiHocScreen) — không có cách nào vừa để trang ngoài cuộn dọc vừa có 1 div-con lo cuộn-ngang MÀ sticky vẫn xuyên qua, đây là giới hạn cứng của CSS, không phải thiếu class.
- **⭐ Loading placeholder ngắn thay-thế-toàn-bộ nội dung mỗi lần `reload()` sẽ TỰ RESET vị trí cuộn của khung `overflow-auto` chứa nó:** `<p>Đang tải…</p>` chỉ vài chục px thay chỗ 1 bảng cao hàng nghìn px → khung cuộn co chiều cao lại → trình duyệt TỰ ĐỘNG clamp `scrollTop` về 0 (hành vi mặc định, không chặn được ở tầng CSS) → bảng đầy lại ngay sau đó nhưng `scrollTop` đã mất, không tự phục hồi → cảm giác "làm gì xong cũng nhảy về đầu trang". Vá: chỉ hiện loading khi CHƯA có data (`list.length===0`, lần tải đầu) — các lần `reload()` sau (sau khi sửa/lưu) giữ nguyên nội dung cũ trên màn tới khi data mới về, DOM không bị phá giữa chừng nên scroll tự nhiên giữ nguyên. Áp cho MỌI `reload()` viết theo công thức `setLoading(true)` vô điều kiện — pattern lặp lại ở gần hết các màn danh sách trong app.
- **⭐ Màn KHÔNG có khung cuộn riêng = nội dung tràn bị CẮT THẲNG bởi `overflow-hidden` của khung ngoài, KHÔNG PHẢI thiếu data:** `NhanSuHome` bọc mọi `staffLeaf` trong 1 khung `overflow-hidden` (chủ đích — mỗi leaf tự quản cuộn riêng, tránh 2 tầng cuộn lồng nhau phá sticky, xem bài học ngay trên). Leaf nào build vội quên bọc `flex-1 overflow-auto` cho chính nó (chỉ 1 block div thường) thì phần tràn khỏi viewport MẤT HẲN, không kéo xuống xem được — TRÔNG như thiếu data nhưng thật ra data đủ, chỉ là không render ra được. Checklist cho leaf mới: root PHẢI có dạng `flex h-full min-h-0 flex-col` (header đứng yên) + con `min-h-0 flex-1 overflow-auto` (nội dung cuộn) — soi nhanh bằng `el.scrollHeight > el.clientHeight` ở khung nghi ngờ.
- **⭐ Dữ liệu effective-dated PER-SLOT (như TKB/`phan_cong_ops`) — tra "trạng thái tại 1 ngày" cho NHIỀU ngày trong 1 khoảng PHẢI resolve theo ĐÚNG ngày của từng bản ghi kết quả, KHÔNG được snapshot 1 ngày đại diện (kể cả ngày đầu khoảng) rồi dùng chung:** snapshot chỉ đúng cho bản ghi mà hiệu lực đã bắt đầu TRƯỚC mốc snapshot đó; bản ghi bắt đầu SAU mốc (hiệu lực rơi giữa khoảng — vd nhân sự vừa được phân công trực giữa tuần) sẽ bị tra hụt TOÀN BỘ, không phải 1 phần. Triệu chứng: "mới gán/đổi xong mà vẫn không thấy hiệu lực" dù data DB đã đúng — bug nằm ở TẦNG ĐỌC (thời điểm tra), không phải tầng ghi.
- **⭐⭐ Có 2 con đường ra cùng 1 kết quả (native engine vs tự-viết-lại-bằng-JS) → ưu tiên NATIVE cho nhu cầu CHÍNH, chỉ giữ tự-viết-lại cho phần native KHÔNG LÀM ĐƯỢC (07-11, sau nhiều vòng vá html2canvas không dứt điểm):** `window.print()` (native, browser tự render DOM đã ổn định) và `html2canvas` (JS tự re-implement chụp màn hình, chạy như tiến trình bất đồng bộ ĐỘC LẬP, có thể đua với thư viện JS khác đang thao tác cùng DOM — ở đây là paged.js) cho ra "PDF" bề ngoài giống nhau, nhưng độ tin cậy khác hẳn. MỌI bug rasterize đã chase trong session 07-11 (JPEG rám chữ, nhân bản 419→210 trang, dòng-kẻ-mồ-côi, header/footer lệch) đều là biến thể của đúng 1 lớp vấn đề gốc: race giữa 2 xử lý JS độc lập. Native không có lớp "vẽ lại bằng JS" nên miễn nhiễm cả lớp bug đó. Quy tắc: khi nhu cầu CHÍNH (ở đây: "lấy 1 file PDF cục bộ") có đường NATIVE khả thi, dùng nó — chỉ giữ pipeline tự-vẽ-lại cho nhu cầu native KHÔNG THỂ đáp ứng (ở đây: upload Blob im lặng — browser chặn lấy Blob từ hộp thoại in, rào bảo mật cố ý, không sửa được). Đừng tiếp tục vá triệu chứng (đổi định dạng ảnh, đổi thời điểm cleanup DOM…) khi gốc rễ là chọn SAI công cụ cho nhu cầu chính.
- **⭐ html2canvas rasterize CSS `background:url(data-URI-SVG) center/100% 100%` KHÔNG tôn trọng `backgroundSize` — dùng kích thước "tự nhiên" theo tỉ lệ viewBox gốc thay vì kéo giãn theo khối chứa** (07-11 tiếp 8, nối dài bài học §597 — hồi đó chỉ phát hiện/sửa được logo+chip, CHƯA phát hiện chính dải sóng nền vẫn còn dính): hậu quả là dải màu bị nén dẹt xuống rất thấp so với khối chứa thật, phần còn lại trắng trơn; chữ `align-items:center` theo chiều cao ĐẦY ĐỦ của khối rơi vào vùng trắng đó → chỉ còn thấy bóng đổ (`text-shadow`) mờ mờ, KHÔNG thấy chữ trắng thật (nhìn giống "chữ biến mất" chứ không giống lỗi background rõ ràng). Chẩn ra được nhờ TỰ TẢI + TỰ RENDER file PDF thật ở độ phân giải cao rồi crop đúng vùng header/footer soi — không đoán được từ đọc code suông. Fix chuẩn (khớp hẳn với cách đã chứng minh đúng cho logo/chip): mọi ảnh cần html2canvas chụp ĐÚNG TỈ LỆ phải là `<img>` thật (`position:absolute;inset:0;width/height:100%`), KHÔNG dùng CSS `background`.
- **⭐ `document.title` = tên file MUỐN GỢI Ý, set NGAY TRƯỚC `window.print()`:** Chromium (kể cả driver "Microsoft Print to PDF") lấy `document.title` hiện tại làm tên file mặc định trong hộp thoại "Lưu dưới dạng PDF" — không có cơ chế API nào khác để gợi ý tên file cho native print. Đổi title ngay trước `print()`, khôi phục lại sau `afterprint` (bắn dù bấm lưu hay huỷ) để không lộ tên "giả" ra tiêu đề tab thật lúc bình thường.
- **⭐ Job NỀN (tự động, không ai đứng canh) chạy qua 1 pipeline có TIỀN SỬ TREO VĨNH VIỄN (paged.js, xem bài học trên) BẮT BUỘC có watchdog timeout — job THỦ CÔNG (người bấm, tự thấy nếu treo) thì không cần:** hàng đợi tự động (backfill link mọi tài liệu, 07-11 tiếp 8) mà không có giới hạn thời gian → 1 tài liệu hiếm gặp bị treo sẽ chặn đứng TOÀN BỘ hàng đợi phía sau vĩnh viễn, không ai biết để can thiệp (khác job bấm tay — người bấm tự thấy "sao mãi không xong"). Watchdog chỉ áp lớp NỀN, không áp lớp thủ công (tránh cắt ngang việc người dùng đang cố ý chờ).
- **⭐⭐ PDF = ảnh-chụp-trang (rasterize) là sai lầm gốc rễ CẢ về kích thước LẪN chất lượng (07-12, kết sổ toàn bộ saga link PDF):** cùng 1 tài liệu — html2canvas chụp PNG từng trang ra 10-50MB (vượt trần bucket 50MB → upload 400), chữ là ảnh (không copy/search); Chrome in native ra PDF CHỮ chỉ vài trăm KB, sắc nét mọi độ zoom. Và MỌI lớp bug canvas suốt 07-11→12 (JPEG rám, nhân trang, chữ nhân đôi, nền lệch, mất chữ trắng) chung 1 gốc: thư viện TỰ VẼ LẠI trang bằng JS. Nhu cầu "tạo file PDF không hộp thoại" đã có đường native thật: **Puppeteer `page.pdf({printBackground:true})` = đúng engine in Chrome** — server-side hoá đường native chứ không phải re-implement. Từ nay: cần PDF từ HTML → Chrome print engine (tay hoặc Puppeteer), KHÔNG BAO GIỜ html2canvas cho mục đích này nữa.
- **⭐⭐ Hàng đợi việc-phải-làm thuộc về DB, KHÔNG phải RAM/localStorage client (07-12 — vi phạm luật §2 CLAUDE.md và trả giá đúng từng chữ):** hàng đợi gen-link đời 1 sống trong Zustand → mất sạch khi F5 (bao nhiêu job đang chờ biến mất không dấu vết — chính là "bấm nút ko thấy link" Thùy report); vá bằng persist localStorage vẫn sai bản chất (trạng thái chỉ 1 máy thấy, máy đó không mở browser thì không ai làm việc). Chuyển thành bảng `linkgen_jobs` + worker server: job sống sót mọi reload, mọi máy thấy cùng trạng thái, worker tắt thì job DỒN chờ chứ không mất. Nhận diện sớm: cái gì là "việc PHẢI xảy ra dù user rời đi" → DB ngay từ đầu.
- **⭐ Supabase refresh token DÙNG-1-LẦN (rotation) — cấm chia sẻ 1 session cho nhiều client:** worker Node đăng nhập 1 lần rồi phát token cho từng trang Puppeteer qua `setSession` → trang đầu "tiêu" refresh token là phiên gốc chết theo, job 2 trở đi dính "Auth session missing!" (job 1 luôn chạy được — bẫy khó thấy nếu chỉ test 1 lần). Fix: mỗi consumer/job `signInWithPassword` MỚI TINH (~200ms) — mỗi trang 1 session family riêng, rotation vô hại.
- **⭐ Upload Storage trả 400 → nghi NGAY trần dung lượng file của bucket/plan** (checklist "Debug 400" §2 vốn chỉ cover PostgREST, thiếu vế storage): đo bằng binary-search upload thật (40MB qua / 60MB chặn → trần 50MB, khớp dashboard "Global file size limit" do spend cap). Body lỗi của storage là JSON có `statusCode`/`message` riêng — đọc nó trước khi đoán RLS/policy.
- **⭐ Component render-nhiều-lần (scope tự chuyển, data phụ nạp async làm re-render) mà consumer chỉ cần "lần dựng CUỐI" → debounce tín hiệu ready ở phía CONSUMER,** đừng bắt component tự đoán lần nào là cuối (nó không biết): PrintJobPage debounce 1.2s sau mỗi `onReady` — btvn/giao_trinh_buoi dựng 2-3 lần (scope + tên lớp async), bắn ready ngay lần đầu là worker in BẢN DỞ thiếu header "Lớp X ·".
- **⭐ Thư mục làm việc có thể ĐANG dùng CHUNG bởi >1 phiên Claude cùng lúc (nhiều session song song trên cùng máy) — trước khi `git checkout`/switch branch, LUÔN `git status` soi uncommitted của phiên KHÁC, đừng checkout/stash đè lên:** lộ ra khi merge 07-14 — `git checkout main` bị chính git chặn vì có thay đổi CHƯA COMMIT (staged/unstaged xen kẽ, biến động ngay trong lúc soi — dấu hiệu rõ có tiến trình khác đang ghi) nằm trên các file KHÔNG liên quan tới việc đang làm (`mastery.ts`, `thanhtich.ts`, `QuanLyLevelScreen.tsx`…) — git tự chặn checkout đã cứu 1 lần, không phải luôn được vậy. Cách an toàn: `git commit -- <path riêng của mình>` (commit đúng path, KHÔNG đụng index của phiên khác) rồi `git worktree add <dir> main` tách hẳn 1 thư mục riêng để merge/push vào nhánh khác — khỏi phải checkout ngay trong thư mục đang có người/phiên khác dùng.
- **⭐⭐ Ingest ảnh AI (Gemini): gộp NHIỀU ảnh/1 lệnh giúp né MAX_TOKENS nhưng HẠI ĐỘ CHÍNH XÁC cropping/câu-attribution — mỗi câu 1 hình thì LUÔN 1-ảnh-1-lệnh (07-14, Nhập đề thi):** NhapKhoScreen (tỉ lệ tốt) luôn render+gửi ĐÚNG 1 trang/1 ảnh/1 lệnh Gemini; DeThiScreen batch nhiều trang/1 lệnh (fix MAX_TOKENS trước đó) vô tình bắt AI vừa định bounding-box vừa gán câu-nào-thuộc-ảnh-nào CÙNG LÚC trên nhiều ảnh → tệ hơn hẳn, không chỉ hình mà cả đáp án/loại câu. Quy tắc rút ra: batch nhiều trang CHỈ an toàn khi KHÔNG cần cắt hình chính xác (text thuần); có hình → luôn 1-ảnh-1-lệnh dù phải gọi API nhiều lần hơn.
- **⭐⭐ Ingest theo TỪNG TRANG RIÊNG LẺ (không nhớ trang trước) sẽ BỊA CÂU MỚI khi 1 câu thật có lời giải tràn qua nhiều trang (07-14, Nhập đề thi, bug CHƯA fix xong):** đề thi chuẩn 22 câu thật nhưng lời giải chi tiết dài 2-3 trang/câu (đặc biệt Đúng-Sai/TLN) → trang chỉ chứa PHẦN TIẾP lời giải (không có "Câu N:" mới) vẫn bị AI hiểu lầm/bịa thành câu mới vì mỗi lệnh Gemini không biết gì về lượt trước đã bóc đến đâu — 22 câu thật nhân ảo lên 137-150. Hướng fix đúng: truyền state "câu cuối cùng đã bóc (stt+phần)" xuyên các lượt vào prompt, dạy AI "trang không thấy nhãn câu mới → trả mảng rỗng, đừng bịa" — CHƯA triển khai xong, xem DEVLOG 07-14 mục cuối.
- **⭐ Có test file thật, ĐỪNG tự suy diễn cấu trúc tài liệu — hỏi thẳng người biết hoặc đọc RAW TEXT gốc (pdfjs `getTextContent`, không qua Gemini) trước khi kết luận "bug ở đâu" (07-14):** lần đầu tưởng file test là "nhiều đề mini nối tiếp" (dựa vào pattern số câu reset lặp lại nhiều lần trong kết quả AI trả) — Thùy sửa thẳng "t up file cấu trúc chuẩn cơ mà", và đọc lại raw text mới lộ nguyên nhân thật (lời giải tràn trang, không phải nhiều đề). Kết quả AI trả về (dù đã qua parse) vẫn có thể là ảo/bịa — muốn chẩn đoán đúng root cause phải đối chiếu với NGUỒN GỐC (raw text/hình gốc), không suy diễn từ output của chính hệ thống đang nghi có bug.
- **⭐⭐ "Chuyển nhà" (dựng lại 1 luồng theo khuôn luồng khác) BAO GỒM dời cả ĐIỂM VÀO (nav/entry-point), không chỉ nội bộ luồng — CEO không cần nói lại điều đã ngụ ý trong chính từ đó (Kho Hình 08-08):** dựng xong `TaiLieuBuilder`/`TrichPanel`-khuôn-Đại cho Hình đầy đủ nhưng vẫn để entry point chôn trong rail cũ của Kho Hình → Thùy phải nói lại "thì t bảo làm luôn ở chỗ đấy mà". Khi CEO dùng động từ ngụ ý DI CHUYỂN CẢ CẤU TRÚC ("chuyển nhà", "dọn sang", "y hệt bên kia") — mặc định phạm vi gồm cả nơi người dùng BƯỚC VÀO tính năng, đừng thu hẹp về "sao chép logic bên trong" rồi chờ hỏi thêm.
- **⭐ Copy layout/số liệu (max-width, px cột, breakpoint…) từ màn khác PHẢI tự hỏi "số này đo theo HÌNH DẠNG NỘI DUNG nào", đừng dán nguyên xi vì "trông giống" (lặp lại 3 lần trong 1 phiên — Kho Hình 08-08):** `max-w-[860px]` đúng cho layout 1-cột của `TaiLieuBuilder` nhưng bóp chết layout 3-cột của Hình; 2 cột biên 240/220px đúng tỉ lệ cho "mục lục lớn" nơi khác nhưng quá to cho "mục lục bé" Hình cần; header/dòng-kẻ/vị-trí-hiện-hình copy sai vị trí UI dù đúng Ý TƯỞNG. Dấu hiệu chung: bug KHÔNG BÁO LỖI, chỉ "trông sai" — chỉ lộ qua ảnh chụp CEO gửi, không lộ qua tsc/build. Trước khi dán số/pattern từ file khác, tự hỏi 1 câu: "bối cảnh sinh ra con số NÀY có giống bối cảnh mình đang áp không."
- **⭐ "Header" (và các từ tương tự có NHIỀU TẦNG RENDER riêng biệt cùng tên) — sửa 1 tầng rồi báo xong dễ bị CEO bắt lại "vẫn còn cái cũ" (Kho Hình 08-08, lặp lại lỗi đã ghi ở §759 dạng khác):** ít nhất 2 khái niệm "header" hoàn toàn tách biệt về code lẫn hành vi — masthead NỘI DUNG (xuất hiện 1 lần đầu tài liệu, sửa ở component chính) vs header PAGE-CHROME (chạy lặp mọi trang qua `pageChrome`/CSS `::before`, điều khiển bởi 1 flag riêng `ch.header`). Sửa xong tầng 1, verify UI thấy đổi → dễ báo "xong" trong khi tầng 2 vẫn dùng default cũ (`ch` truyền rỗng ⇒ ngầm định `head:true`). Trước khi báo "đã đổi X" cho bất kỳ khái niệm đa-tầng nào (header/footer/watermark…), liệt kê HẾT các nguồn sinh ra nó rồi xác nhận từng nguồn, không chỉ nguồn vừa động tay.
- **⭐⭐ 1 cột (`mon`) phục vụ ĐỒNG THỜI 2 mục đích xung đột (RBAC/billing cần GIÁ TRỊ CỐ ĐỊNH vs content-dispatch cần PHÂN BIỆT thêm) — đừng ép giá trị mới vào cột đó, TÁCH THÊM 1 CỘT CHIỀU KHÁC (Hình giải tích 08-08, áp dụng "Chiều MÔN §1.6" cho ca khó hơn KHTN):** KHTN dùng `tai_lieu.mon='KHTN'` làm khoá dispatch kho ĐƯỢC vì KHTN cũng là 1 mon RBAC hợp lệ — nhưng "Hình giải tích" KHÔNG PHẢI 1 môn mới, nó là 1 NHÁNH bên trong mon='Toán' (RBAC/billing/`lop.mon` đều cần thấy 'Toán' y hệt Đại). Nếu dùng `mon` để phân biệt sẽ phá §1.6 symmetry test ở MỌI nơi khác dùng `mon` (billing, RBAC scope④, `lop.mon`). Giải đúng: thêm cột `nhanh` (nullable, default = hành vi cũ) làm chiều dispatch RIÊNG, độc lập `mon`. **Quy tắc tổng quát: khi 1 field vừa là khoá NGHIỆP VỤ ổn định (không được đổi ý nghĩa) vừa cần thêm 1 chiều PHÂN LOẠI NỘI DUNG mới — đừng ép 2 việc vào 1 cột, tách cột mới cho chiều mới, giữ field gốc nguyên nghĩa cho MỌI consumer khác của nó.**

---

### Bài học 08–09/09 — form câu, sinh bằng máy, quét kho
- **⭐ Distractor phải là KẾT QUẢ THẬT của một đường sai có tên, không phải số bịa.** HS chọn nó = tự khai lỗi với độ chắc 100% (§1.5) —
  đó là lợi ích thật duy nhất của MCQ so với trả lời ngắn. Distractor ngẫu nhiên là tệ nhất cả hai phía.
- **⭐ Verify "≠ đáp án" phải so GIÁ TRỊ sau chuẩn hoá, không so chuỗi.** `4/8`, `1/2`, `0,5`, `-a/b`, `a/-b` là MỘT đáp án; so chuỗi ⇒
  HS làm đúng bị chấm sai. `parseHuuTi` (BigInt, tối giản, tập nghiệm sắp) là nhân chứng thứ hai độc lập với AI.
- **⭐ Đáp án máy PHẢI khớp đáp số kho mới được sinh gì lên câu đó** — lệch thì bỏ, KHÔNG đoán. Chính cái "lệch" đó phát hiện 2 đáp số
  kho sai (đều câu gốc do người nhập, không phải clone).
- **⭐ Máy quét toàn kho không phải một lệnh — là chương trình theo dạng.** Lần quét đầu 627 "lệch" phần lớn BÁO GIẢ (toán có lời,
  đặt tính, làm tròn, quy đồng, lớp 6 dấu chấm = nhân). Phải whitelist dạng "đáp số = giá trị biểu thức" rồi mới tin số.
- **Cờ duyệt mà không có chỗ nào LỌC theo nó = cờ trang trí.** `da_duyet` 60/17.743 và 0 chỗ chọn câu lọc ⇒ "vào kho chuẩn" phải định
  nghĩa bằng hàm SQL mọi nơi cùng gọi, không phải bằng cột.
- **Luật hình thức phương án đúng là "không được là cái duy nhất khác kiểu", không phải "cả 4 cùng kiểu"** — cứng quá thì câu đáp số
  nguyên/0/1 đói distractor (bỏ 5 câu lô 1 oan).
- **Biến thể "đổi số" trong kho hình KHÔNG cùng cấu trúc câu văn với bài gốc** (gộp/tách bước, đổi thứ tự tên góc) ⇒ áp khuôn chỉ ăn
  ~15%. Muốn tự động phải chuẩn hoá lời giải biến thể theo gốc ở cửa 1, hoặc chấp nhận đề xuất tay từng bài.
- **Bản HS thấy phải được CẮT key ở SERVER** (`_dien_buoc_hs`), không "lược trường dung" rồi chép nguyên lời giải — bản đầu lộ đáp án
  ngay trong câu văn. Kiểm bằng script: bản HS không chứa dap_an/key/dung.
- **Return sớm trong component React phải nằm SAU mọi hook** (`LamTuLuyen`: `if (dienO) return …` đặt trước `useState` khác = đổi số
  hook giữa 2 lần render).
- **`format('%I', NULL)` trong Postgres NỔ** ("null values cannot be formatted as an SQL identifier") — guard bằng `case when … is null`
  trước khi `format`. `jsonb -> bigint` (cột `ordinality`) cũng nổ, ép `::int`.
- **Nhiều phiên trên 1 DB: `npm run migrate` áp MỌI file treo, `--baseline <f>` đánh dấu "tới và gồm"** ⇒ cả hai đều đụng file của
  phiên khác (2 lần trong 1 ngày). Luôn `--status` trước; có file lạ thì `--only <file>`.
- **HTML gửi CEO xem trong app phải tự chứa**: trình xem chặn script CDN và ảnh ngoài ⇒ KaTeX render trong node, font base64, ảnh data URI.
  Ba bảng duyệt đầu (488 form, 61 câu docx) CEO không thấy công thức vì lý do này.
- **Docx MathType = ảnh WMF**, không có công thức trong XML; đọc bằng mắt sau khi render qua `System.Drawing` (PowerShell), biến lặp
  `$s`/`$S` trong PowerShell là MỘT (không phân biệt hoa thường) — vòng `for ($s…)` đè mất `$S`.


### Bài học 12/08 — đọc dữ liệu & viết tài liệu

- **⭐⭐ CẤM SUY TỪ DỮ LIỆU VẮNG MẶT — dẫm 3 lần trong 1 ngày, cả 3 đều tự tin và đều sai.**
  ① `viec` đủ cột đẹp ⇒ tưởng mảng học liệu được đo tốt (thật ra **15 dòng, cả 15 đứng ở `moi_giao`**).
  ② không có `bai_test` ⇒ tưởng buổi không có ET (thật ra `bai_test` chỉ là luồng **ONLINE**; **331/445
  buổi đã đóng ET**). ③ đợt đuổi có 0 dạng ⇒ tưởng kẹt (thật ra **29/34 đợt HOÀN THÀNH cũng 0 dạng**).
  **Luật:** trước khi kết luận "X không xảy ra", phải chỉ ra **cột nào ghi nhận X KHI NÓ XẢY RA** và xác
  nhận cột đó có dữ liệu. **Và luôn đối chiếu nhóm ĐÃ THÀNH CÔNG trước khi gọi một trạng thái là bất thường.**
- **⭐ Cột đầy đủ ≠ có dữ liệu.** Schema đẹp không nói gì về việc có ai dùng. Luôn `count(*)` + `max(ngày)`
  trước khi chọn một mảng để xây gì lên trên.
- **⭐ `must-exist` chưa bao giờ được ghi vào hệ.** CLAUDE.md §4 định nghĩa task = must-exist − does-exist;
  vế does-exist làm rất tốt, vế must-exist thì **đóng cứng trong code** ("mọi buổi thường cần đủ 4 khâu").
  Chỉ MT có guard thật (`mtKeys`). Thêm khâu/việc mới thì phải hỏi **"lấy đâu ra bằng chứng việc này
  ĐÁNG LẼ phải xảy ra?"** trước.
- **⭐ Thiếu vế thứ hai: hệ KHÔNG ghi nhận được "CỐ TÌNH BỎ QUA".** Rà soát 12/08 cho thấy 12/13 mục
  `ingame` là CEO **chủ động không làm** — không phải quên, không phải lỗi code. Nhưng hệ chỉ có
  "đã đóng" / "chưa đóng", nên **bỏ-có-chủ-ý và quên trông y hệt nhau**, và task treo vĩnh viễn.
  ⇒ Task pure-derive cần **ba** trạng thái chứ không phải hai: *chưa làm* · *đã làm* · **_không cần_
  (có người quyết, có dấu vết ai/khi nào)*. Thiếu trạng thái thứ ba thì mọi thống kê tồn đọng đều lẫn.
- **⭐ Ngưỡng phải RÚT TỪ HÀNH VI THẬT, không đặt tay.** Đo phân phối của nhóm đã hoàn thành rồi so.
  Ngưỡng rút từ dữ liệu thì cãi lại được; ngưỡng bịa thì không. Kèm cảnh báo **thiên lệch kẻ sống sót**:
  cohort hoàn thành thiên về ca DỄ ⇒ p75/p90 là cận dưới; riêng "vượt mốc lâu nhất từng hoàn thành" thì vững.
- **⭐ Ground truth phải do CHÍNH người dò kiểm được — tiêu chí này ĐỨNG TRÊN "dữ liệu sạch".**
  Đã chọn sai một lần: lấy chuỗi bổ trợ đuổi (data sạch nhất) làm pilot cho người **không quản mảng đó**
  ⇒ CEO bác đúng. Dữ liệu sạch mà không ai xác nhận nổi đúng/sai thì hiệu chuẩn = 0.
- **⭐ Dữ liệu không chứa câu trả lời thì đừng gọi model.** Lượt 1 cố ý KHÔNG dùng AI: hệ không biết lớp
  nào bắt buộc làm khâu nào, nên mọi suy luận trên đó — của người hay máy — đều là đoán. Người phân xử
  trước, và **phán quyết đó CHÍNH LÀ dữ liệu đang thiếu**. §10 "dò lỗ hổng dữ liệu" = **THU ĐƯỢC** cái
  thiếu, không phải phát hiện ra là thiếu.
- **⭐ Hệ tự sinh trạng thái thay người thì PHẢI đánh dấu ở cột riêng.** `giaoviec_housekeeping()` tự đóng
  việc thành `'dat'` chất lượng 100 — trước 12/08 chỉ phân biệt bằng chuỗi trong text tự do. DB **khẳng
  định một điều sai** còn nguy hơn DB thiếu dữ liệu: không có chỗ nào để khai "không biết".
- **⭐ ĐỪNG BACKDATE để "làm đẹp" dữ liệu.** Ghi lùi ngày = bịa lịch sử, vi phạm §1.5 ("cấm insert trước
  điền sau"), xoá mất tín hiệu *treo bao lâu*, và nội dung bịa (`nhan_xet`/`muc`/`hoan_thanh_pct`) chảy
  thẳng vào mastery/Elo ⇒ hỏng tầng Measurement. Thay bằng **kẻ ĐƯỜNG NGÀY**: từ ngày D mới bắt buộc,
  trước D giữ nguyên + đánh dấu "chưa có luật".
- **⭐ Tài liệu có ví dụ copy-paste-được thì ví dụ đó LÀ CODE.** Dòng mẫu `set DATABASE_URL_RW=postgresql://...
  && npm run migrate` khiến cmd gán cả dấu cách trước `&&` ⇒ host `"... "` ⇒ ENOTFOUND, mà `.env` thì
  đúng hoàn toàn nên cực khó lần. Placeholder phải **sai rõ ràng** (`USER:PASS@HOST`), đừng **mơ hồ hợp lệ**.
- **⭐ Biến môi trường đè file cấu hình ⇒ lỗi PHẢI khai NGUỒN.** Biến sống hết phiên terminal nên chạy lại
  bao nhiêu lần cũng hỏng y hệt — trông như lỗi mạng. Cùng lớp lỗi với `housekeeping()` chạy-theo-người-
  mở-màn: **hai bên nhìn hai thực tại khác nhau mà không ai phát hiện ra.** Nghi ngờ đầu tiên khi
  "file cấu hình đúng mà vẫn hỏng".
- **Một dòng tài liệu nói "an toàn cứng" mà không ai verify thì NGUY HƠN không có dòng nào** — nó khiến
  cả người lẫn Claude tưởng có rào. (CLAUDE.md §2.1 nói `claude_ro` chỉ SELECT suốt nhiều tháng, thực tế
  là `claude_build` ghi được và sở hữu 121 bảng.)

### Bài học 12/08 (phần 2) — dựng sản phẩm & bẫy kỹ thuật

- **⭐⭐ SẢN PHẨM LÀ "ĐỌC-HỘ-VÀ-KẾT-LUẬN", không phải thêm một màn hiển thị.** Doc §1: *"ERP đã hiển thị đủ dữ liệu, người quá tải
  không tự tổng hợp nổi"*. 12/08 CEO nghĩ đường tới đó là HỎI ĐƯỢC; **29/09 CEO chốt lại: BÁO CÁO là chính, hỏi là phụ** — báo cáo đủ thì không cần hỏi.
  Điểm chung của cả hai lần: một danh sách đổ ra là vô dụng; phải có **con số kết luận + của ai + so với mức thường đạt**, chi tiết để sau nút bấm.
- **⭐ CHO NGƯỜI QUYẾT rẻ hơn nhiều so với CỐ HIỂU TRƯỚC.** Cả buổi kẹt ở "chưa biết must-exist nên không dám
  nhắc" → đâm đi kiểm toán 125 bảng. Ba nút Làm/Huỷ/Gác gỡ sạch: **nhắc sai thì bấm Huỷ, luật lộ ra từ các
  lần bấm.** Đúng vòng lặp doc §11 — nhắc trước, người quyết, dữ liệu tự đầy dần. Claude làm NGƯỢC.
- **⭐ HỎI TIÊU CHÍ NGHIỆM THU TRƯỚC KHI XÂY.** CEO phải nói ba lần mới ra đúng thứ cần ("nhắc việc hàng ngày"
  → "phải hỏi được" → "hôm nay = deadline hôm nay thôi, không phải nợ"). Mỗi vòng Claude đều xây thêm rồi
  phải bỏ. **Câu "làm xong thì nó trả lời được câu gì?" đáng hỏi từ đầu.**
- **⭐ StrictMode + ref-cleanup = giao diện treo VĨNH VIỄN.** Cleanup đặt cờ `true` mà THÂN effect không reset
  về `false` ⇒ vòng mount-unmount-mount của StrictMode (bật ở `main.tsx`) để cờ đứng nguyên `true` ⇒ mọi vòng
  lặp gác theo cờ đó không chạy nổi một vòng. Triệu chứng: server trả lời xong trong 14s, UI đứng ở "đang
  tải…" mãi mãi. **Luôn reset cờ trong THÂN effect, không chỉ set ở cleanup.**
- **⭐ Lỗi cấu hình phải nổ lúc BẬT, không nổ lúc DÙNG.** Worker thiếu key vẫn khởi động im ru; người dùng hỏi
  một câu rồi ngồi chờ, job chết trong 0 giây. `danhgia.mjs` có bước kiểm key lúc bật, bản đầu `troly.mjs`
  quên. **Mọi worker gọi API ngoài PHẢI tự kiểm key ngay khi khởi động.**
- **⭐ Retry mà không đếm = vòng lặp VÔ HẠN có tính tiền.** Nhánh thử-lại đọc cột `so_lan` mà bảng chưa có ⇒
  điều kiện bỏ cuộc không bao giờ đúng. **Mọi cơ chế retry phải ghi số lần vào DB, không giữ trong bộ nhớ.**
- **⭐ Ví dụ copy-paste-được trong tài liệu LÀ CODE.** Dòng mẫu nối `&& npm run migrate` cùng dòng `set` khiến
  cmd gán cả dấu cách vào biến ⇒ host `"... "` ⇒ ENOTFOUND, mà `.env` đúng hoàn toàn nên cực khó lần.
  Placeholder phải **sai rõ ràng** (`USER:PASS@HOST`), đừng **mơ hồ hợp lệ**.
- **⭐ Biến môi trường đè file cấu hình ⇒ lỗi PHẢI khai NGUỒN.** Biến sống hết phiên terminal nên chạy lại bao
  nhiêu lần cũng hỏng y hệt — trông như lỗi mạng. Cùng lớp lỗi với `housekeeping()` chạy-theo-người-mở-màn:
  **hai bên nhìn hai thực tại khác nhau mà không ai phát hiện ra.**
- **⭐ ORACLE ẨU CÒN NGUY HƠN KHÔNG CÓ ORACLE.** Claude viết query kiểm vội (`tuổi > 1`) rồi kết luận model sai
  ở "30/31", suýt đi sửa một tầng đang chạy ĐÚNG (bảng sạch tính theo deadline THẬT — 30 mới đúng).
  **Bản kiểm phải dùng ĐÚNG định nghĩa của bản được kiểm, nếu không nó chỉ đo sự khác nhau giữa hai định nghĩa.**

- **⭐ Custom element trong React 18: `className` KHÔNG thành `class`.** `<math-field className="…">` không nhận class ⇒
  CSS `::part()` không áp. Gán tay `el.classList.add` trong effect. Áp cho mọi web component nhúng React.
- **⭐ Chặn phím ở tầng nào thì kiểm tầng đó, và lọc `isTrusted`.** Chỉ chặn `keydown` thì text qua `input`/IME/dán vẫn lọt;
  chặn thêm `beforeinput` thì MathLive **tự phát `beforeinput` GIẢ** (isTrusted=false, data = LaTeX) mỗi lần `insert()` —
  handler nuốt luôn mẫu. Sự kiện tổng hợp của thư viện và sự kiện người gõ đi chung một cửa.
- **Mode chữ/toán của MathLive là trạng thái ẩn:** đang trong `\text{}` mà `insert()` LaTeX thì bị nhét như chữ thường;
  ô trống trong `\text{}` vẫn ở mode toán (mất `\text`, mất khoảng trắng). Trước mỗi lần chèn mẫu **ép về mode toán**, mẫu
  Văn bản **ép sang mode chữ**, Tab hết ô thì trả về toán.
- **Trả focus sau khi gỡ web component: `setTimeout`, không chỉ rAF** — MathLive dọn focus async, focus sớm bị cướp về body.
- **Mẫu LaTeX ghép với chữ gõ vào phải có khoảng trắng sau lệnh:** `\int#?` điền `x` thành `\intx` (lệnh lạ). Test mẫu theo
  4 ca (nút · ô trống · đã điền · lưu còn ô trống), không chỉ 1.
- **⭐ MathLive: `captureSelection=true` = vô hình với CHUỘT (08/09).** `Atom.bind()` không cấp `data-atom-id` cho atom con
  dưới cha `captureSelection`; `nearestAtomFromPoint` chỉ xét atom có id ⇒ click vào chữ dưới `\widehat{…}` rơi ra SAU cả
  khối, Backspace xoá nguyên ký hiệu — mà PHÍM ←/→ vẫn vào được nên tưởng "đúng". Fix ngọn (tìm glyph ▢) chỉ cứu 1 ca;
  fix gốc = tắt cờ trên prototype. Nâng MathLive thì đo lại đúng thao tác "click A trong góc A1 → Backspace → gõ B".
- **⭐ KaTeX `\widehat`: cỡ mũ chọn theo SỐ PHẦN TỬ trong thân, không theo bề rộng.** 1 chữ → cỡ nhỏ nhất, lệch phải theo
  italic. `\widehat{{}A{}}` (2 nhóm rỗng) lên cỡ 2, phủ đúng chữ, không thêm khoảng trắng — chỉ làm lúc render, không lưu.
  Và chỉ số phải đứng NGOÀI dấu mũ (`\widehat{A}_2`) — trong thân thì mũ căn theo cả "A₂".
- **⭐ Copy từ vùng KaTeX render: Chrome serialize `.vlist-t/.vlist-r` (table) thành xuống dòng/tab GIỮA các mảnh** — trim
  `\n` đầu/cuối không cứu được. Cách đúng = copy-tex: gắn `data-latex` lúc render, listener `copy` thay bằng `$…$`.
- **⭐ Ô trống của cụm là `#?`, còn ô trống MathLive lưu ra là `{}`** — hai thứ khác nhau, đường tạo cụm qua bảng dựng phải
  chuẩn hoá `{}` → `#?`, không thì mọi "cụm có ô trống" tạo bằng UI đều câm (không nhận tham số, chèn ra rỗng).
- **⭐ Verify trong Browser pane khi cửa sổ Claude bị che (08/09, mất ~30'):** tab không vẽ ⇒ `requestAnimationFrame` không
  chạy (MathLive/React render qua rAF ⇒ DOM CŨ, mọi phép đo bounds/ids sai), screenshot timeout, ~5' sau Chrome ép
  `setTimeout` 1 lần/phút (script `await` treo). Làm được: ghi đè `requestAnimationFrame = cb => cb(now)`, script KHÔNG await
  dài, click bằng `PointerEvent` (`composed:true`) dispatch lên `shadowRoot.elementFromPoint`, Backspace phải là
  `KeyboardEvent` có `code:'Backspace'` lên `.ML__keyboard-sink` (`computer.key` gửi `code=''`, MathLive so theo `code`).
  `innerWidth` = 0 lúc này — bề rộng layout không đo được.
- **Bash tool trên máy này ăn 1 lớp backslash trong heredoc + nhiều file là CRLF** — patch nhiều dòng bằng node/sed
  không khớp im lặng; sửa file bằng Edit tool. `git add -p` không có: tách phần DEVLOG của mình khỏi phần phiên khác
  đang viết dở bằng `awk` cắt tới heading lạ → `git hash-object -w --path` → `git update-index --cacheinfo`.
- **`npm run migrate` áp MỌI file treo, kể cả của phiên khác** — có file lạ thì `--only <file>`; đã lỡ áp
  `202609080246_khao_sat…` (không phá gì) vì quên.
- **⭐⭐ Vercel 1 repo × 8 project = TRẦN BUILD DÙNG CHUNG CẢ TÀI KHOẢN (Hobby: 100/ngày), không phải riêng
  từng project — cắn 07/09, 2 LẦN TRONG CÙNG 1 NGÀY.** Lần 1: chưa có `ignoreCommand` ⇒ mỗi push build cả
  8 project ⇒ ~15 push/ngày × 8 = vượt trần ⇒ Vercel lặng lẽ chặn 7/8 project ("Deployment rate limited —
  retry in 24 hours") — **không hiện lỗi gì trong Deployments**, chỉ đơn giản NGỪNG tạo deployment mới cho
  project đó dù `main` vẫn nhận commit đều. Dấu hiệu nhận biết: so commit mới nhất trong Deployments với
  `git log` HEAD — thấy khoảng trống nhiều commit/nhiều giờ là đủ kết luận, ĐỪNG đợi thấy dòng "Error".
  Đã sửa (`vercel.json.ignoreCommand = scripts/vercel-ignore.mjs`): mỗi push chỉ build project có file
  RIÊNG của nó đổi (file dùng chung như `src/lib`/`src/components`/`package.json` vẫn build cả 8).
  **Lần 2 (cùng ngày, ~3h sau, SUÝT bị hiểu nhầm là bug script):** dù đã có `ignoreCommand`, 2 project
  (TA lẫn OPS) đột nhiên NGỪNG nhận deployment y hệt kiểu lần 1 — ban đầu nghi sai do 2 commit TA "chỉ
  đụng đúng file riêng của nó vẫn không build" (tưởng bug diff/shallow-clone), commit rỗng ép trigger 2
  lần cũng im lặng luôn. Chỉ khi xác nhận **OPS — project khác hẳn — cũng bị y hệt cùng lúc** mới chốt
  đúng: `ignoreCommand` chỉ giảm SỐ PROJECT build MỖI PUSH (8→1), KHÔNG giảm SỐ LƯỢT PUSH — nhiều phiên
  Claude Code chạy song song, mỗi phiên tự push sau mỗi sửa nhỏ (kể cả phiên đang ghi bài học "gom commit"
  này cũng lỡ push riêng 2 lần cho 2 sửa nhỏ ngay buổi sáng cùng ngày) vẫn cộng đủ lượt để đụng trần lại,
  dù mỗi push nhẹ hơn. **Luật chẩn đoán: khi 1 project "im lặng không build", luôn kiểm project KHÁC có
  bị y hệt không TRƯỚC khi nghi ngờ code/script riêng của project đó** — bị 1 project = có thể là bug
  local; bị ≥2 project không liên quan cùng lúc = gần như chắc chắn trần tài khoản, không phải bug.
  **Không có cách sửa CODE nào chặn được lần tái diễn** — chỉ NGỪNG PUSH một lúc (quan sát: lần 1 tự
  thông lại sau ~7-8h, có vẻ cửa sổ trượt theo giờ chứ không phải khoá cứng 24h lịch) hoặc NÂNG GÓI Vercel.
  **Quy tắc thật (không phải chỉ "gom commit của 1 phiên"):** khi NHIỀU phiên cùng làm việc trên 1 repo
  Vercel-8-project trong cùng khung giờ, tổng lượt push của TẤT CẢ phiên cộng lại mới là con số so với
  trần — 1 phiên tự kỷ luật gom commit không đủ nếu các phiên khác vẫn push dồn dập song song.

### Bài học 08/09 — kho chuẩn & làm việc song song 2 phiên
- **Cờ duyệt mà không chỗ nào lọc = cờ trang trí.** `da_duyet` có 60/17.743 câu ký và 0 chỗ chọn câu lọc theo nó suốt 3 tuần.
  Sửa bằng ĐỊNH NGHĨA (1 hàm SQL + cột generated để PostgREST lọc được), rồi grep TỪNG chỗ chọn câu để cắm — chọn ≠ resolve: chỗ
  resolve câu đã nằm trong tài liệu KHÔNG lọc, nếu không câu bị rút làm ET cũ không lưu được (cùng luật kho rác 07-21).
- **Máy kiểm đáp số: whitelist theo BẢN CHẤT DẠNG, không theo thống kê lệch.** "Đáp số = giá trị biểu thức" thì máy đúng gần
  tuyệt đối (17/1.696 lệch đều là kho sai thật); dạng lệch 27% (`T105040204`) vẫn vào whitelist vì máy đúng — kho sai hàng loạt là
  chuyện của kho. Ngược lại dạng máy "khớp" nhiều nhưng bản chất khác (đặt tính chia có dư, quy đồng ra cặp, đổi đơn vị) phải loại
  dù số đẹp. Lớp 6 viết nhân bằng dấu chấm — quy tắc parse theo DẠNG, không toàn cục.
- **Người ghi đè máy có điều kiện.** Người duyệt câu máy đã ký khớp mà không đổi đáp số ⇒ GIỮ `kiem_may_boi='mcq-auto'` — nếu
  ghi đè thành 'nguoi' thì mất mẫu để đo precision máy/AI ở mức C. Chỉ ghi đè khi người ĐỔI đáp số hoặc câu đang nghi/chưa kiểm.
- **Hàm `stable`/`immutable` không được tạo temp table** — Postgres nổ ngay lần gọi đầu "CREATE TABLE is not allowed in a non-volatile
  function". Bắt được trước khi lên màn nhờ **test RPC bằng JWT giả lập**: `select set_config('request.jwt.claims', '{"sub":…,
  "email":…}', true)` trong transaction rồi ROLLBACK — `la_thanh_vien()`/`jwt_uid()` chạy như user thật, DB không đổi. Dùng khuôn này
  cho mọi RPC security definer trước khi tin UI.
- **Generated STORED column không tính lại khi đổi thân hàm.** Đổi thân mà kết quả y hệt (gom literal vào `_kho_ngay_bat()`) thì
  không sao; đổi NGHĨA (bước 6) thì phải DROP/ADD lại cột — ghi thẳng vào comment migration để người sau không quên.
- **2 phiên song song trên 1 repo + 1 DB:** mở worktree (`EnterWorktree`), copy `.env`/`.env.local`, junction `node_modules`; file
  UNTRACKED ở thư mục chính không tự sang (spec, script mới) — copy tay; `npm run migrate` áp luôn file treo của phiên kia ⇒ **chỉ
  `--only <file>`**. Preview tool chỉ đọc `.claude/launch.json` THƯ MỤC CHÍNH và phiên worktree không sửa được file đó ⇒ chạy vite nền
  `npm run dev -- --port 5191 --host 127.0.0.1 --strictPort` rồi `preview_start {url}`; đăng nhập bằng nút dev account của `Login.tsx`
  (`VITE_DEV_ACCOUNTS` trong `.env.local`). 403 font KaTeX qua `@fs/` = junction ngoài root vite, không phải lỗi code.
- **Mức B: ký cả CỤM chỉ sau khi giải lại TỪNG câu — "cụm này sạch" là ảo giác.** Bỏ sót 4 câu T111040201 (B-38) và 7 câu
  T111010202 (B-29) đều do đọc lướt cụm cùng khuôn rồi mặc định khớp; lỗi khuôn MCQ (2 phương án đúng) chỉ lộ khi thử từng phương án.
  Gặp 1 câu lạ trong cụm ⇒ quay lại rà mọi câu cùng khuôn đã ký. `lo-txt` cắt lời giải 250 ký tự — nghi thì đọc FULL lời giải
  (số cuối lời giải ≠ đáp án là loại lỗi phổ biến nhất K11/K12).
- **Quét lô phải đóng đinh tập câu theo MỐC THỜI GIAN, không theo "cái gì đang null".** Kho SỐNG (2 phiên ghi cùng lúc): 126 câu
  mới tạo trong lúc quét bị ký nhầm vì `--list` chọn theo `kiem_may is null`.
- **Sidebar "không hiện" trong accessibility tree nhưng screenshot có** — tree của Browser pane có thể stale sau login; tin screenshot,
  hoặc click bằng `javascript_tool` theo text khi ref trả toạ độ âm.
### Bài học 08–09/09 — hạ tầng đa phiên & deploy
- **`npm run migrate` của phiên khác quét cả file migration ĐANG VIẾT DỞ của mình.** `new-migration` tạo file template rỗng trước; phiên MCQ chạy `npm run migrate` ⇒ sổ `_migrations` ghi "đã áp" với vân tay của template, DB không có bảng, `--status` báo sạch. Rule: làm song song thì viết xong SQL rồi mới tạo file (hoặc đổi tên file lúc xong), và **không chạy `npm run migrate` trần** khi biết có phiên khác đang có file treo — áp đúng file mình. Sửa sổ: update `bam` trong CÙNG transaction với SQL thật.
- **Prod báo "Invalid API key"** = key nướng trong bundle sai. Đừng đoán: tải `assets/*.js` đang chạy, grep key, so với `.env.local` **từng ký tự** (09/09: thừa đúng 1 chữ "W" cuối key trên Vercel). Vite nướng env lúc build ⇒ sửa env xong PHẢI Redeploy.
- **Commit của mình chỉ chứa hunk của mình** khi nhiều phiên cùng sửa `package.json`/`launch.json`: dựng blob từ `git show HEAD:file` + đúng dòng mình thêm rồi `git update-index --cacheinfo`, không `git add` cả file. "commit đi" của CEO = commit + push luôn (Vercel tắt auto-deploy).
- **Scale app riêng:** mỗi app một project Vercel (blast radius, rollback/env riêng); trần build/ngày là chuyện gói Hobby → lên Pro, không gộp project. Gộp chỉ cân nhắc cho tầng "công cụ/chiến dịch" khi ≥5 app, bằng rewrite theo host.
### Bài học 09/09 — BTVN ảnh xuyên 2 repo, tool vẽ, role RO
- **Bước 0 trước khi tin spec:** spec "tạo bảng btvn_nop/btvn_anh" hoá ra bảng + RPC + màn đã có từ 30/08; và audit repo PH bản
  CŨ cho kết luận "chưa có luồng nộp" sai hoàn toàn. Rule: grep repo TRƯỚC, và hỏi "bản này final chưa" trước khi audit repo khác.
- **Server action Next mặc định trần body 1MB (Vercel function 4.5MB)** — nộp ảnh qua FormData là chết với ảnh điện thoại thật.
  Ảnh đi thẳng client → storage bằng signed upload URL; action chỉ nhận mảng path rồi kiểm lại bằng `storage.list` (size/mimetype).
- **Tailwind v4: 2 utility cùng property trong 1 className thì thứ tự CSS quyết định** (`bg-white` đè `bg-emerald-600`) — màu
  mặc định đặt trong nhánh idle, không đặt tĩnh rồi "đè" bằng nhánh động (bug Đ/C/S mất chữ có từ 30/08).
- **Listener đăng ký với deps `[]` gọi hàm đóng state → state đọc trong đó phải qua ref** (Ctrl+Z ở trang 2 xoá mark trang 1).
- **Input mount trong `pointerdown`:** `mousedown` mặc định dời focus (canvas không focus được) → `e.preventDefault()` + `autoFocus`
  (đồng bộ lúc commit; `setTimeout` chậm hơn người gõ ngay) + bỏ qua blur <300ms.
- **Sau lưu phải có tín hiệu** ("✓ Đã lưu" 2.5s) — nút chỉ mờ đi thì CEO tưởng treo dù DB đã ghi.
- **Task engine = must-exist:** buổi có `mt_buoi` không sinh task BTVN (`where not b.co_mt`) → bài PH gán vào buổi MT là tàng hình
  với TA. Mọi "tự gán" phải kiểm cùng điều kiện với engine sinh task, nếu không dữ liệu rơi vào chỗ không ai thấy.
- **`pg.Pool` module-scope giữ chuỗi kết nối cũ** sau khi `.env.local` đổi — Next nạp lại env nhưng pool không; restart dev.
- **Key nhầm project cùng độ dài** (service key PH vs ERP đều 219 ký tự) — kiểm bằng claim `ref` trong JWT, không so độ dài.
- **Host `db.<ref>.supabase.co` chỉ IPv6** — dev Windows lẫn Vercel đều ENOTFOUND; luôn dùng pooler với user `role.<ref>`.
- **Automation trình duyệt:** phím "Return" của tool KHÔNG phải Enter (dùng "Enter"); `read_console_messages` trả log tích luỹ cả
  lỗi HMR trung gian → reload + tsc trước khi tin; `prompt()` thật bị tự đóng.
- **Test trên data thật:** đọc snapshot trước, chỉ đụng dòng test, không "Mở lại/Đóng" phase của lớp thật (đổi `btvn_dong_at` →
  dashboard TA "đóng muộn", EXP hoàn/thưởng lại); dọn lá→gốc theo danh sách đã gật, kiểm snapshot khớp sau dọn.
- **Deploy tay khi auto-deploy im:** kiểm bằng cách curl bundle prod grep chuỗi UI mới, không tin "đã push = đã lên".

### Bài học 09/09 tối — test đầu vào (luồng "biến mất im lặng")
- **"Chọn rồi phải bấm thêm nút mới lưu" = mất dữ liệu im lặng.** Dropdown chọn đề + nút "Gán đề" chỉ hiện sau khi chọn: người thao tác chọn → upload → Hoàn tất trong 51 giây, đề chưa từng tới DB, không lỗi nào hiện. Lựa chọn có 1 giá trị hợp lý mặc định (đề đang dùng) thì **tự gán**, chọn là lưu ngay; nút xác nhận riêng chỉ cho thao tác có hậu quả.
- **Gate "hoàn tất" phải đòi ĐỦ bằng chứng mà khâu SAU cần.** Hoàn tất chỉ đòi bài upload, còn Chấm cần đề ⇒ ca lọt qua rồi kẹt vĩnh viễn. Hỏi "khâu kế tiếp cần gì để chạy" trước khi viết điều kiện đóng.
- **Hàng đợi LỌC BỎ ≠ hàng đợi TRỐNG.** `.not('tai_lieu_id','is',null)` làm 5 ca thiếu đề biến mất khỏi mọi màn, kể cả màn có thể sửa nó. Đúng luật invariant §4: thiếu bằng chứng ⇒ **nổi lên thành việc** (card "chưa có đề → gán"), không lọc đi. Lọc theo ngày ("hoàn thành hôm nay") cũng là một dạng lọc bỏ.
- **Trigger log là nhân chứng tốt nhất khi người nói "tôi đã làm rồi".** `ca_test_log` ghi mọi UPDATE, đọc diff từng cột ra ngay đề chưa từng được set — không cần đoán, không cần cãi. Đầu tư trigger log cho entity vận hành trả lãi đúng lúc này.
- **"Nhãn" (`nguoi_cham_id`) không phải "việc".** Cột gán người tồn tại từ 14/08 nhưng không màn nào lọc theo nó và Việc của tôi không có card ⇒ với người dùng bằng không có. Thêm cột assign thì phải thêm luôn đường "việc của tôi" trong cùng lượt.
- **Snapshot thuộc tính phân loại lúc neo, đừng join live để tính báo cáo.** `nhanh`/`muc_do`/`ten_chuyen_de` ghi vào `ca_test_cau` lúc gán đề ⇒ hàm phiếu chỉ gom 2 bảng, không nhân đôi registry môn→bảng trong SQL, đề/dạng sửa sau không làm lệch phiếu cũ.
- **Hàng "không ở kho câu" (`HINH:<uuid>`) bị `layCauTheoThuTu` bỏ rơi không báo** — cùng họ với `.filter(Boolean)` nuốt tham chiếu chết. Mọi chỗ "resolve mã → nội dung" phải nói ra số hàng KHÔNG resolve được.

### Bài học 10–13/09 — test đầu vào: phiếu từ kit ChatGPT, form GV, phân công, asset
- **"Kit UI" của ChatGPT thường CHỈ là ảnh reference + DESIGN.md;** mục `assets/svg` ghi trong DESIGN có thể không
  tồn tại trong zip, và bản "gửi bù" có thể là 3 glyph 150 byte hoặc 1 **contact sheet** gộp mọi thứ trên nền tối
  có nhãn tên file. Kiểm zip TRƯỚC khi hứa "làm giống"; nói thẳng thiếu gì (liệt kê từng file, kích thước, trong
  suốt hay không) để CEO đòi tiếp — vector tự vẽ chỉ được "giống cấu trúc/màu", không giống raster.
- **PNG "trong suốt" của ChatGPT hay là ô caro NƯỚNG vào ảnh** (alpha 100%). Đo bằng pngjs (alpha<250 %, màu 4
  góc) trước khi dùng. Khử được nếu chủ thể có màu bão hoà (gold/xanh): gắn nhãn thành phần liên thông của pixel
  trung tính sáng, xoá thành phần chạm mép HOẶC lớn (lỗ tay cầm) — flood-fill từ mép thôi thì sót lỗ kín. Chủ thể
  có phần trắng (giấy, highlight) thì cắt hỏng ⇒ bỏ. PIL trên máy này hỏng ("unknown slot ID 85") — dùng `pngjs`.
- **html2canvas 1.4.1:** `<img>` SVG với width % ⇒ bỏ qua; SVG inline thì browser rasterize nguyên khối (filter/
  gradient OK) nhưng phải có `width/height` PX trên thẻ svg và **id gradient/filter RIÊNG** (2 svg cùng `id="navy"`
  ⇒ svg sau lấy nhầm def svg trước); SVG `<text>` + `dominantBaseline` lệch ⇒ đè chữ bằng div. Popup `about:blank`
  không resolve URL tương đối ⇒ fetch asset → data URL rồi split/join vào outerHTML; thiếu file ⇒ thay bằng pixel
  trong suốt. Vite dev không set CORS nên `useCORS` không cứu được.
- **Bash heredoc + python/regex có backslash = mất backslash 2 tầng.** Patch dài/ký tự đặc biệt: Write script ra
  file rồi chạy, hoặc dùng Edit; kiểm `grep` dòng kết quả trước khi tin.
- **Trước "làm giống y ảnh" phải chốt cái gì là DATA vs ĐỒ HOẠ.** Kit v2 hiện "4/5" nhưng CEO đã chốt 3 mức hôm
  trước rồi lại chốt 5 mức — hỏi lại đúng 3 câu (thang, paragraph, điểm) trước khi code, đừng đoán từ ảnh.
- **Donut/biểu đồ phải tô theo con số ở giữa.** Vẽ theo tỉ lệ số câu (như mockup) ⇒ ca toàn cơ bản ra vòng đầy
  100% dù giữa ghi 48% — CEO bắt ngay. Trực quan phải khớp số đọc được.
- **`new-migration` tạo file rỗng trước = mồi cho phiên khác áp nhầm** (đã ghi HANDOFF 08/09, vẫn cắn 13/09 sau
  đúng 60 giây). Cách sống chung: viết SQL xong mới tạo file, áp NGAY bằng `node scripts/migrate.mjs --only <file>`
  (đã có, tôi từng không biết); nếu bị áp rỗng ⇒ đổi tên timestamp mới + `--only`, dòng sổ mồ côi xoá khi CEO gật.
  `npm run migrate` trần còn kẹt ở file lỗi của người khác (`must be owner of function`) — không phải việc mình.
- **Gán mặc định = trigger BEFORE INSERT ở DB**, không phải client tra bảng rồi truyền — mọi đường tạo (ERP, app
  Ops, script) đều đúng, đường truyền tay vẫn thắng vì chỉ điền cột NULL. Verify bằng transaction ROLLBACK (insert
  giả → đọc → rollback), không cần tạo dữ liệu thật.
- **Form nhập của GV ≠ phiếu có ô nhập.** CEO: "Trả bài LÀ cái phiếu; màn đánh giá chỉ GẦN GIỐNG" — gộp 2 thứ làm
  phiếu xấu đi và form khó dùng. Tách: form riêng cùng phong cách + phiếu thật xem trước bên cạnh (scale theo màn).
- **Browser pane:** app full-reload mỗi khi phiên khác sửa file ⇒ modal đang mở bay mất giữa chuỗi thao tác; luôn
  guard `if(!document.querySelector('.z-\\[90\\]'))` rồi mở lại; click theo text dễ dính sidebar trùng tên ("Phân
  công" CORE TEAM) — lọc thêm class của tab. Screenshot hay timeout khi cửa sổ bị che, text check thay thế được.

### Bài học 10/09 tối — Claude nhập câu vào kho (HGT PT mặt phẳng)
- **⭐ Nguồn công thức MathType cũ = docx MÙ, phải dùng PDF vision.** DOCX Toán Tứ Tâm 2 MB có 758 `.wmf` (ảnh vector rời từ MathType 6/7 khi paste) + 0 OMML — pandoc chỉ trả text + `![](imageXX.wmf)`; Claude không đọc được nội dung công thức. Cùng file export PDF: Claude `Read pages=1-N` render vision đọc math sharp, extract LaTeX ổn định. Áp dụng cho MỌI tài liệu Toán VN trước ~2020 (thời MathType thống trị) — hỏi có PDF không, có thì dùng PDF; không thì export tay trước.
- **⭐ Kiểm HÌNH VẼ TRƯỚC bulk INSERT, không phải sau.** Bỏ qua `anh_de` cho câu có hình lập phương/tứ diện = HS đọc câu vẫn tưởng tượng được, nhưng LỜI GIẢI gốc ghi "Dựa vào hình vẽ" thành đứt logic. Pass đầu tách câu cũng phải grep pandoc md `![](image...png)` (PNG = hình vẽ, WMF = công thức) → nhận diện câu có ảnh → upload cùng lượt, không tách pha. Đặt vào `anh_de` (không `anh_dap_an`) khi HS cần thấy khi ĐỌC ĐỀ để định vị tên đỉnh — không phải sau khi làm xong.
- **⭐ `ma_cau` phải EXPLICIT theo convention `<dang><STT 3 số>` (`src/lib/kho/api.ts:447`), đừng để default `GC000001`.** Column default `('GC'||nextval)` là legacy — mọi câu thật đều dùng convention TS. STT = `MAX(ma_cau WHERE ma_cau LIKE '<dang>%')` + 1. FK `parent_ma_cau` + `hgt_cau_hoi_yeu_cau_giai.ma_cau` đều ON UPDATE CASCADE nên rename sau cũng an toàn (đã test) — nhưng vẫn nên đúng ngay từ đầu để CEO không phải sửa tay lúc duyệt.
- **⭐ Verify script phải in `duyet_at` để phân biệt "trigger tự set" vs "người bấm".** Sau UPDATE nếu thấy `da_duyet=true` bất ngờ, đọc `duyet_at`: đồng loạt cùng timestamp = trigger; rải rác vài giây/câu = CEO đang bấm duyệt SONG SONG (Claude làm việc trong lúc CEO mở màn duyệt). Đã suýt gọi bug oan 1 lần. Trigger `_kho_cau_duyet_nguon` thực chất chỉ trigger `BEFORE INSERT OR UPDATE OF da_duyet, duyet_nguon` — không chạm khi rename `ma_cau` hay set `anh_de`.
- **`dang_ai_de_xuat=dang_chinh` khi AI đề xuất, không NULL.** Spec `202609080938_kho_duyet_hop_nhat.sql` dùng cột này đo precision AI = count(ai=chính)/count(ai not null). Nếu bỏ NULL thì mất mọi câu AI nạp trong mẫu số ⇒ số precision không đo được. Người duyệt đổi `dang_chinh` khi sai; `dang_ai_de_xuat` giữ vết bản gốc.

### Bài học 28/09 (đêm) — hàm Postgres chậm do CTE bị inline + trần timeout của app
- **⭐⭐ plpgsql `return query with …` có CTE dùng trong subquery TƯƠNG QUAN (vd `(select … from dd where dd.hs = h.hs)` trong `case`) ⇒ planner có thể INLINE CTE vào subquery chạy cho TỪNG dòng ngoài.**
  `fn_thanh_tuu_thang` gọi `fn_mastery_cells` trong CTE ⇒ bị gọi lại hàng trăm lần: cả tháng 70s (lúc khác đo 4–7s — planner đổi kế hoạch, nên nút lúc chạy lúc không).
  Ép `as materialized (` cho mọi CTE ⇒ 2–4s, khối 9: 9,3s → 0,56s; kết quả cũ vs mới 0 dòng khác (EXCEPT 2 chiều). **Hàm đo lớn: mặc định `materialized`.**
- **⭐ `SET statement_timeout` gắn vào hàm (`create function … set statement_timeout`) KHÔNG vượt được trần của phiên** (đo bằng hàm `pg_temp` với trần 1s).
  Role `authenticated` = 8s, `anon` = 3s (`pg_roles.rolconfig`). Việc nặng gọi từ app ⇒ phải NHANH (hoặc chạy ngoài PostgREST), không nới trần được từ trong hàm.
- **⭐ Hàm nặng chạy INVOKER bị RLS `la_thanh_vien()` gắn lên từng dòng mọi bảng nó đọc** ⇒ đo bằng `claude_build` (bỏ qua RLS) luôn LẠC QUAN hơn app.
  Hàm batch của admin: `security definer` + cổng quyền ngay dòng đầu (`co_quyen_ghi('<leaf>')`) + `revoke … from public, anon`.
- **`claude_build` không `set role authenticated` được** ⇒ muốn thử dưới danh tính người dùng: `set_config('request.jwt.claims', '{"email":…}', true)` rồi gọi hàm
  (cổng `co_quyen_ghi` / `la_thanh_vien` đọc JWT) — thử cả người CÓ quyền lẫn KHÔNG quyền, trong transaction + ROLLBACK.

### Bài học 28/09 — thiết kế gamification HS với CEO (spec `spec-thanh-tuu-nhiem-vu.md`)
- **⭐⭐ Gami BK = GAME (cày cuốc, đua top), KHÔNG khung app học online** (Khan / Duolingo / nghiên cứu edu "chống leaderboard"). Thùy bác v1:
  *"Khan vẫn là online, BK là offline"*. Lấy **cơ chế** game, **không lấy tên** game (Liên Quân…) — HS sẽ bảo trung tâm copy.
- **⭐ Đừng tự thêm giá trị CEO không đặt:**
  - "Chống cày ảo" là t tự thêm → Thùy: *"cày càng nhiều càng ok"*.
  - "Trần theo chính em" để chặn bỏ lớp → Thùy: *"HS offline không được nghỉ"*.
  - Chuẩn hoá để so chung giữa môn → Thùy: *"mỗi môn riêng hoàn toàn"*.
- **⭐⭐ CEO thêm NGUYÊN TẮC ≠ đổi CẤU TRÚC đã chốt.** Thùy thêm "3 phương diện chăm chỉ / thành tích / tiến bộ" ⇒ t dựng lại thành 3 huy hiệu lớn
  (trái luôn H1 "mỗi dòng 5★" t tự bẻ để giảm mẫu bản cứng) ⇒ sai 2 lần.
  - Đúng: áp nguyên tắc **vào trong** cấu trúc cũ (10 loại, 5★/dòng). Phương diện là góc nhìn thiết kế, **không phải output**.
  - Muốn đổi điều đã chốt vì lý do vận hành thì **nêu ra và hỏi**.
- **⭐ Spec cho CEO: LOGIC trước, DETAIL sau, không trộn** (bảng số / catalog để danh sách "bàn sau").
  - **Phase 1 phải vừa phải:** đưa ~100 cấp huy hiệu ngay ⇒ *"nhiều quá bị ngợp"* ⇒ 6–8 cái.
  - Đưa quyết định dạng **bảng có đề xuất**, CEO trả lời theo mã (L1–L4, D1–D6, B-L…, H…).
- **⭐ Đặt bộ tên "theo gốc X" phải kiểm gốc tích TỪNG tên:**
  - Nữ Oa (thần thoại Trung Quốc) lọt vào bộ "Việt Nam".
  - Phoenix là chim thần thoại, không phải thần — vẫn hợp vì tiêu chí có "biểu tượng".
- **⭐⭐ Mô phỏng: ĐO phân bố thật THEO TỪNG HS trước, đừng giả định các lần đo độc lập.**
  - "BTVN đủ đúng hạn trong tháng" thật ~47% và **bền theo người** (3 tháng: 23% đủ cả 3, 28% không tháng nào).
  - Mô hình tung xu từng bài ra ~24% ⇒ ★4 gần 0 ⇒ kết luận sai.
- **⭐ Ngưỡng bậc cộng dồn đặt theo CUỐI mùa ⇒ đầu mùa cả khối dồn 1 bậc** (mùa 3 tháng: hết tháng 1 có 99% cùng bậc 2).
  - Luôn in phân bố theo **từng mốc thời gian**, không chỉ cuối mùa.
  - ~~Ghế top theo phong độ~~ — SUPERSEDE 28/09: Thùy muốn thần là ĐÍCH theo điểm tích luỹ (không ghế top/hạng). T hiểu "ghế" thành luật vị trí suốt 1 ngày.
- **⭐⭐ Hàm SQL làm "view có tham số": KHÔNG gắn `set search_path`, gọi bằng hằng/biến (không bằng cột CTE)** — mất inline ⇒ 13–35 s thay vì 0,15 s.
- **⭐ Số đầu vào phải hỏi nhịp vận hành THẬT** (8 buổi/tháng = 1 MT + 7 ET) — t lấy 5 ET từ mô phỏng ⇒ phong độ > 100%.
- **⭐ Cột "có vẻ đúng" có thể rỗng 100%** (`btvn_ket_qua.ti_le_dung`, `hoan_thanh`) — đo phân bố cột trước khi dùng làm nguồn.
- **⭐ Tưởng bug phải đo theo THÁNG trước khi sửa** (A4 0% là thật: tự luyện chỉ bùng từ tháng 9).
- **⭐ Chốt có ghi người chốt ⇒ để CEO bấm, không lấy jwt nhân sự bất kỳ chạy thay** (mạo danh vết).
- **`.env` chỉ có `DATABASE_URL` role GHI** ⇒ script dò dữ liệu mở đầu `set default_transaction_read_only = on` + in `show transaction_read_only`
  làm bằng chứng.
- **Máy CEO:**
  - Python chỉ gọi được qua `py` (`python` = alias Store).
  - Không có LibreOffice ⇒ `recalc.py` của skill xlsx chết (AF_UNIX) ⇒ bật `fullCalcOnLoad` + tự kiểm công thức bằng Python.
- **DEVLOG xung đột merge với phiên song song** (cả hai cùng append cuối file) ⇒ giữ CẢ HAI phía (xoá 3 dòng marker), commit merge.
  Không rebase / đè.

### Bài học 29/09 — trợ lý: báo cáo Sư phạm + tổng kết tuần

**Hiểu yêu cầu**
- **⭐⭐ HỎI "BÁO CÁO NÀY CỦA AI" TRƯỚC KHI XÂY.** Xây 2 lượt mới biết mẫu là của Trang (Sư phạm), còn Lộc (Vận hành) cần bản khác. Mỗi người quản một
  mảng có một bộ báo cáo — không có "báo cáo chung".
- **⭐⭐ BÁM MẪU TỪNG CHỮ ≠ HIỂU KHUNG.** Bản đầu chép đúng 7 mục của mẫu, đơn vị là "lớp trong một ngày", mở sẵn mọi danh sách ⇒ đọc xong vẫn không biết
  việc nào của ai. CEO phải rút khung hộ (3 luồng). **Đơn vị của báo cáo vận hành là VIỆC có người phụ trách + hạn**, không phải lớp hay ngày.
- **⭐ ĐO VIỆC DÙNG THẬT TRƯỚC KHI LÀM TIẾP MỘT TÍNH NĂNG.** Đếm câu hỏi đã lưu mới lộ: tab trợ lý 21 câu cả đời, 3 nút không ai bấm. Không đo thì đã đi
  "sửa cho hỏi được" — đúng thứ CEO sau đó gọi là phụ.
- **Cùng một chữ, hai trục:** "xin phép" hợp lệ về THÁI ĐỘ nhưng nghĩa vụ NỘP BÀI vẫn còn. "Học sinh không đến" là sự cố của học sinh, không phải miss của
  nhân sự. Gặp trạng thái mơ hồ thì hỏi nó thuộc trục nào, đừng tự gộp.

**Postgres / quyền**
- **⭐⭐ TEST BẰNG ROLE CHỦ BẢNG KHÔNG THẤY RLS LẪN TRẦN 8 GIÂY.** Hàm báo cáo chạy 1 giây khi test, lên app thì "statement timeout" — vì người dùng thật
  đi qua RLS của từng bảng. Hàm tổng hợp nặng ⇒ `SECURITY DEFINER` có cổng ở dòng đầu + thu quyền gọi thẳng các hàm bên trong. **Chỉ coi là xong khi đã
  mở trên app bằng phiên đăng nhập thật.**
- **⭐ Báo cáo nặng thì LƯU, đừng tính mỗi lần mở.** Và bản lưu phải mang **số phiên bản của cách tính**: nhận biết bằng "có khoá X" không phân biệt được
  luật cũ/mới ⇒ đổi luật xong người dùng vẫn thấy số cũ tới hết ngày.
- **⭐ Nhiều phiên cùng sửa một DB: tạo lại hàm có sẵn thì lấy thân từ `pg_get_functiondef`**, thay bằng script "mỗi phép thay phải khớp ĐÚNG 1 chỗ", rồi
  **so JSON trước/sau**. File migration cũ của chính mình có thể không còn là bản đang chạy (phiên khác đã sửa 2 hàm báo cáo trong lúc làm).
- **⭐ Công thức dùng ở 2 nơi ⇒ tách HÀM GỐC trả mọi dòng + nhãn, hai nơi đọc từ đó.** Kiểm việc tách bằng "kết quả cũ không đổi một ký tự" (0 chỗ khác).
- **Cờ nội bộ đặt bằng `set_config(…, true)` sống tới HẾT transaction**, không phải hết hàm ⇒ dùng xong phải hạ ngay, rồi kiểm lại cổng sau khi áp.
- **Muốn thêm tham số cho hàm đừng `drop` rồi tạo lại** (Luật xoá): `create or replace` đổi được `stable` → `volatile` mà giữ nguyên chữ ký.
- **Đếm theo buổi bằng subquery tương quan trên `gami_grades`/`btvn_ket_qua` rất chậm** (không có index dẫn đầu bằng `buoi_hoc_id`): 17 giây → 0,14 giây
  khi gom trước bằng CTE rồi join.
- **`gami_grades.graded_by` là `tai_khoan.id`, KHÔNG phải `nhan_su.id`** — tra người chấm phải đi qua `tai_khoan`.

**Thống kê trên chuỗi tuần**
- **⭐⭐ "MẢNG CHƯA CHẠY" ≠ "ĐO RA 0"** (CLAUDE.md §1.5 áp cho cả chuỗi thời gian). Tính cả các tuần trước khi có ca test đầu vào ⇒ thường đạt = 0,1 và mọi
  tuần có ca test thật bị coi là nhiễu. Mỗi chỉ số cần một số "neo" để biết từ tuần nào mới là lần đo.
- **⭐ Chỉ số chưa "chín" không đem so với lịch sử đã chín** (bù đã học, test đã trả kết quả): tuần mới nhất luôn ra "vấn đề" giả.
- **⭐ Mẫu số phải loại việc CHƯA TỚI HẠN**, nếu không tuần mới nhất luôn xấu giả (BTVN tuần vừa rồi: 26/59 việc chưa tới hạn chấm).
- **Khâu đang đi lên thì trung bình toàn lịch sử vô nghĩa** (luôn "trên thường đạt", tuần tốt gần đây bị lọc như nhiễu) ⇒ cửa sổ trượt. Nêu hệ quả của
  định nghĩa cho CEO thấy bằng số, để CEO chọn — đừng tự đổi định nghĩa.
- **Ngưỡng theo độ lệch chuẩn của CHÍNH chỉ số**, không một con số cứng cho mọi chỉ số (chuyên cần dao động ~4 điểm, ET đúng chuẩn ~19 điểm).

**Giao diện**
- **⭐⭐ TÍNH NĂNG CỐT LÕI KHÔNG TREO VÀO API MÀ TRÌNH DUYỆT CÓ QUYỀN TỪ CHỐI.** Trình chiếu dựa hẳn vào `requestFullscreen` ⇒ nơi bị từ chối thì bấm nút
  không thấy gì. Dựng lớp phủ của mình trước, toàn màn hình chỉ cộng thêm. Và `fullscreenchange` báo "đã thoát" ngay sau khi vào KHÔNG có nghĩa người
  dùng muốn thoát.
- **⭐ Trình chiếu ≠ màn thường phóng to.** Mỗi bảng một màn vừa khít, chuyển trang — đứng chiếu không ai kéo chuột. Co giãn bằng `transform: scale` trên
  khối có bề rộng gốc cố định (đo bằng ResizeObserver); `zoom` làm đổi kích thước bố cục nên phép đo tự kích lại chính nó.
- **⭐ Hai lần liền "viết xong, kiểu đúng, build qua" mà bấm thử mới lộ hỏng.** `tsc` sạch không nói gì về việc nút có chạy.
- **Xem thử từ worktree:** công cụ preview phục vụ checkout CHÍNH. `fetch` file mới trả 200 có thể chỉ là trang index của SPA — phải nhìn nội dung, không
  nhìn mã trạng thái. Muốn xem bản mới: đẩy lên `main` rồi kéo về checkout chính.

- **⭐ Dựng nhân vật boss riêng (01/10 — bài học trả giá bằng 3 vòng làm lại).** (a) **Khối cơ bản bằng code CHẠM TRẦN chi tiết**: áo choàng/hoa văn/khuôn mặt của bản vẽ không bao giờ ra được
  — muốn "giống đúng con đó" thì dùng CHÍNH bản vẽ làm bề mặt (tấm ảnh 2D + hoạt ảnh code), đừng dựng lại. (b) Chi tiết đặt sát mặt cong (mày, mắt) cách mặt <0.02 bị lớp da
  `transparent` che vì sắp xếp vật trong suốt theo tâm đối tượng ⇒ đẩy ra ≥0.04 + `renderOrder`. (c) Truyền object tạo mới mỗi render (`so={{…}}`) làm `useMemo` dựng lại ⇒ effect gọi
  `setState` của cha ⇒ vòng lặp "Maximum update depth": hằng ổn định + effect phụ thuộc giá trị gốc (chuỗi/số), không phụ thuộc object. (d) Browser pane TẠM DỪNG `requestAnimationFrame` khi
  không hiển thị ⇒ script đánh trận tự động bị khựng; chụp màn hình xen kẽ để pane vẽ khung. (e) `check:style-hs` báo rớt vẫn commit được nếu nối lệnh bằng `;` — kiểm riêng, đừng tin chuỗi lệnh.
  (f) ChatGPT/AI ảnh: giữ nhất quán nhiều pose bằng cách đính lại HÌNH GỐC + câu mô tả cố định mỗi lượt; kiểm máy (alpha, cao đầu, mốc chân) trước khi nhận.

- **⭐⭐ DANH TÍNH bám KHOÁ TỰ NHIÊN, KHÔNG bám VỊ TRÍ** (bug ET 07-21, nguồn gốc sâu nhất): nối 2 tập bằng "phần tử thứ i ↔ phần tử thứ i" **sai ngay khi một bên thêm/bớt ở GIỮA**, và hỏng **âm thầm** — không lỗi, chỉ gắn nhầm. Lưu thẳng khoá bên kia (`ma_cau`), vị trí chỉ để hiển thị. Áp cho mọi lưới sinh-từ-doc: ET/MT/BTVN.
- **⭐⭐ Cảnh báo lệch phải so NỘI DUNG, không so SỐ LƯỢNG:** `a.length !== b.length` **mù hoàn toàn** với "đổi phần tử mà giữ nguyên số lượng" — đúng ca nguy hiểm nhất. Nút "↻ Đồng bộ" đời cũ còn tệ hơn: nó **từ chối chạy khi đã có điểm**, tức vô dụng đúng lúc cần nhất.
- **⭐⭐ Map lại quan hệ đã mất: "số lượng khớp" KHÔNG phải bằng chứng.** Phản ví dụ thật: 5A2 bỏ 1 câu ở GIỮA rồi dọn ô rỗng cuối → 5 ô/5 câu, số khớp, nhưng ô 3,4,5 vẫn giữ câu CŨ. Phải có **nhân chứng thứ hai độc lập** (ở đây: `ma_dang` seed từ lúc chấm) mới dám ghi; lệch dù 1 phần tử ⇒ **bỏ cả lượt, để trống, hỏi người** (§1.5).
- **⭐ Tham chiếu bằng TEXT (không FK) thì CẤM xoá cứng bên được trỏ:** không FK ⇒ DB không chặn ⇒ chỗ resolve `.filter(Boolean)` cho nó **rụng im lặng** (150 dòng chết, Giáo trình 11A thiếu 24 câu, không ai biết). Dùng **kho rác**: cột `xoa_at` **NGAY TRONG bảng gốc** — tách bảng rác riêng thì (a) mọi chỗ resolve phải join 2 nơi, sót 1 chỗ là tái hiện đúng bug, (b) `nextCauSeq` cấp lại mã đã xoá cho câu mới ⇒ tham chiếu cũ trỏ nhầm sang câu khác hẳn.
- **⭐ So TRÙNG phải so trong đúng PHẠM VI, không so theo giá trị toàn cục:** kiểm `0112` bằng "mã câu này có xuất hiện >1 lần ở đâu đó không" → báo động giả (dòng trùng nằm ở TÀI LIỆU KHÁC). Đúng: với từng dòng vừa ghi, đếm trong CHÍNH tài liệu của nó.
- **⭐ Lưới "vị trí cố định" + `find()` một-lần-mỗi-ô = NUỐT phần tử dư** (bug TKB 07-21): 6 ô phòng, mỗi ô `cell.find(p => p.phong===phong)` → ca thứ 2 cùng phòng / ca `phong=NULL` biến mất, mất 23/76 ca. Render kiểu "gán chỗ" phải là **thuật toán xếp CÓ PHẦN DƯ** (xếp hết, dư thì tràn xuống), không phải N lần tra cứu độc lập.
- **Đổi NỘI DUNG con phải bump `updated_at` của cha:** `setETCaus` sửa `tai_lieu_cau` mà không đụng `tai_lieu` ⇒ mất dấu thời gian ⇒ chẩn đoán về sau đọc nhầm "đề này chưa ai sửa".
- **⭐ Vá dữ liệu: thứ tự migration là một phần của tính đúng.** `0106` backfill CHẠY TRƯỚC `0107` xoá ô thừa ⇒ đúng buổi cần vá lại bị điều kiện an toàn loại ra. Migration vá dữ liệu phải tự hỏi "bước trước có làm thay đổi điều kiện của bước này không".
- **⭐ Migration vá dữ liệu nên ghi CẶP TƯỜNG MINH, đừng để SQL tự suy lúc chạy:** `0112` liệt kê 149 lệnh `update … where id=… and ma_cau=…` → soát được từng dòng, chạy lại = no-op, và nếu ai sửa tay trước đó thì lệnh tự đứng yên thay vì đè. Kèm bảng đối chiếu trong `docs/`.
- **Báo SCOPE phải ĐẾM trước khi nói.** Báo "1 dòng dangling của 8B1" trong khi thực tế **150 dòng / 12 tài liệu MẪU** → suýt lấy cái gật cho 1 dòng đi xoá 150. Luôn query `count(*)` toàn hệ trước khi mô tả quy mô một vấn đề.
- **DB là PRODUCTION đang có người dùng.** Giữa lúc chạy migration, `gami_grades` tăng vì GV đang chấm thật (9A2 buổi hôm đó). Migration nặng nên hỏi giờ trước.
- **⭐⭐ Elo/EXP: KHÔNG CÓ PHÉP ĐO thì KHÔNG ĐƯỢC TÍNH, đừng coi là "mọi người bằng nhau".** `raw[id]=0` cho mọi HS rồi chạy tiếp = 0 dữ liệu bị hiểu thành CẢ LỚP HOÀ; hoà thì `actual` đều nhau nhưng `expected` phụ thuộc Elo ⇒ **hồi quy về trung bình một cách âm thầm** (Elo cao mất, Elo thấp được). Đây là §1.5 ở dạng nguy hiểm nhất: giá trị mặc định 0 TRÔNG như dữ liệu thật. Mọi engine tính điểm/xếp hạng phải hỏi "có dòng đo nào không" TRƯỚC khi hỏi "điểm bao nhiêu".
- **⭐ Bỏ qua âm thầm = bug sống lâu.** Cả 3 bug 07-21 (TKB nuốt ca · lưới chấm lệch câu · Elo phiên trống) đều KHÔNG ném lỗi, chỉ lặng lẽ ra số sai. Khi hệ quyết định "không làm gì" ở một nhánh, PHẢI nói ra cho người dùng (alert/banner), đừng return im.
- **⭐ Elo là CHUỖI PHỤ THUỘC — sửa quá khứ thì phải REPLAY, không trừ ngược được.** `delta` buổi sau tính từ Elo sau buổi trước (qua `expected`), nên xoá/sửa 1 phiên ở giữa làm mọi delta phía sau sai theo.
- **⭐ Script replay phải phủ ĐỦ phase, kiểm trước khi chạy.** `_replay_elo.mjs` đời cũ chỉ có ingame+et; chạy nó sau khi MT ra đời sẽ **xoá sạch Elo của MT** mà không báo gì. Script sửa-dữ-liệu-hàng-loạt: luôn đối chiếu danh sách phase/loại HIỆN TẠI trước khi tin script cũ.
- **Chốt sanity cho replay Elo: TB Elo toàn hệ phải KHÔNG ĐỔI** (Elo zero-sum trong mỗi phiên). Lệch TB = replay sai ở đâu đó.
- **Verify dữ liệu ≠ verify đường code.** Replay chứng minh data đúng, KHÔNG chứng minh `closePhase` đã sửa. Phải test thật đường code (đóng phase rỗng → xem alert + DB), và chọn thao tác CÓ ĐƯỜNG LÙI (`reopenPhase` gỡ sạch) để test trên dữ liệu thật an toàn.

### Bài học 18–20/09 — quyền EXECUTE của function trên Supabase (sổ tay kiến thức)

- **⭐⭐ `grant … to authenticated` KHÔNG chặn `anon`, và `revoke … from public` CŨNG CHƯA CHẮC ĐỦ — phụ thuộc AI ÁP MIGRATION.** Postgres mặc định cấp EXECUTE cho `PUBLIC` khi `create function`, nên chỉ `grant` là cửa vẫn mở. Nhưng gỡ PUBLIC vẫn chưa xong: **Supabase có `alter default privileges … grant execute on functions to anon, authenticated, service_role`, và default privileges GẮN THEO ROLE TẠO HÀM.**
  - Áp bằng **SQL Editor** ⇒ owner `postgres` ⇒ `anon` nhận grant **RIÊNG, TƯỜNG MINH** ⇒ `revoke … from public` gỡ được PUBLIC mà **không đụng `anon=X`** ⇒ phải thêm `revoke execute … from anon`.
  - Áp bằng **`npm run migrate`** (owner `claude_build`) ⇒ không dính default privileges ⇒ ACL không hề có `anon` ⇒ `revoke from public` là đủ.
  - Đó là lý do tiền lệ mig 0062/0063 (`count_cau_by_dang`, `my_hoc_sinh_id`) chạy đúng mà mig 202609181946 thì không — **cùng câu lệnh, khác người áp, khác kết quả**.
- **⭐ Phân biệt "chặn ở GRANT" vs "chặn trong THÂN HÀM" bằng HTTP code — đừng thấy bị từ chối là yên tâm.** Anon gọi ra `400 / P0001 / <message tự viết>` nghĩa là **hàm ĐÃ CHẠY**, chỉ bị guard trong thân chặn ⇒ còn đúng 1 lớp. Ra `401 / 42501 / permission denied for function` mới là chặn ở tầng GRANT, hàm không chạy. Với `security definer` đọc kho thì phải là 401. (`404 / PGRST202` = hàm không tồn tại/sai chữ ký — PostgREST khớp hàm theo TÊN THAM SỐ, gọi `{}` thì hàm nào cũng 404, đừng vội kết luận "chưa áp".)
- **⭐ Migration siết quyền phải SELF-VERIFY 2 CHIỀU trong cùng transaction.** Chiều xuôi: `anon` phải MẤT EXECUTE. Chiều ngược: `authenticated` phải CÒN — siết lố role là lỗi dễ mắc và **chỉ lộ khi người dùng bấm vào màn**, lúc đó đã muộn. Dùng `has_function_privilege(role, 'public.ten(argtypes)', 'EXECUTE')`, raise là rollback sạch. (Migration `revoke` phải do OWNER chạy — `claude_build` revoke hàm của `postgres` sẽ chết với "must be owner of function", fail rõ ràng nên không cần guard thêm.)
- **⭐⭐ Comment khẳng định "đã an toàn" mà chưa đo = nợ nguy hiểm hơn không có comment.** Mig 181946 tự viết *"không để cửa mở"* dựa trên suy luận từ tiền lệ, chưa hề đo ACL. Đúng cái §2.1 đã cảnh báo về chính mục quyền DB — và vẫn đạp lại. **Viết xong câu "đã chặn/đã an toàn" thì việc kế tiếp là ĐO, không phải commit.** Sửa comment sai ở file đã áp là KHÔNG được (lịch sử bất biến) — ghi đính chính trong migration mới.
- **⭐ SQL Editor cũng grant TOÀN QUYỀN BẢNG cho `anon`/`authenticated` (không chỉ EXECUTE hàm).** Đo 26/09: bảng `sk_*` tạo bằng SQL
  Editor ⇒ `has_table_privilege('anon', …, 'INSERT') = true`. RLS không có policy ghi thì vẫn chặn, nhưng chỉ còn 1 lớp ⇒ bảng "ghi chỉ qua
  RPC" phải `revoke all … from anon` + `revoke insert, update, delete … from authenticated` ngay trong migration. `information_schema.role_table_grants`
  KHÔNG hiện grant của role mình không thuộc — đo bằng `has_table_privilege`.

### Bài học 26/09 — hệ sự kiện (plpgsql · test theo vai · test UI qua ô trình duyệt ẩn)

- **⭐⭐ plpgsql: alias bảng TRÙNG TÊN biến `record` trong hàm ⇒ Postgres bind vào BIẾN, không phải bảng.** `declare d record;` rồi
  `(select … from sk_dang_ky d … where d.id = …)` ⇒ nổ `record "d" is not assigned yet` ở dòng đầu hàm (PostgREST trả 500). Không lỗi
  lúc `create function` — chỉ lộ khi CHẠY. Cổng quyền/tra cứu phụ nên gói vào hàm riêng (`_sk_sk_cua_dang_ky`), không alias trong hàm có biến.
- **⭐ Đổi cổng quyền ⇒ test MỌI RPC dưới MỌI vai, không chọn mẫu.** Lỗi trên lọt vì test persona chỉ chạy check-in/đăng ký, bỏ qua 3 hàm
  quản trò. Script PGlite (stub `jwt_email/la_thanh_vien/hoc_sinh/nhan_su`) chạy đủ vai + người ngoài trong vài giây — rẻ hơn 1 vòng dán SQL.
- **Ô trình duyệt của app Claude khi bị ẨN: ảnh chụp đứng hình + click toạ độ trượt vì layout dịch.** Kết luận "bấm không ăn" từ ảnh là sai
  (bàn quay đã quay thật, xu tăng 38→63). Xác nhận bằng TEXT/dữ liệu (`get_page_text`, gọi RPC), click bằng ref/JS, không tin screenshot.
  Nhưng chính việc đó lộ lỗi thật: khung `items-center overflow-hidden` cắt mất nút nằm dưới mép — màn làm việc phải có vùng tự cuộn.
- **Máy "nhớ lựa chọn" (localStorage) phải kiểm lại khi dữ liệu đổi**: máy nhớ sự kiện TEST đã đóng ⇒ mở app vào nhầm TEST cùng ngày. Nhớ
  thì được, nhưng mở lại phải ưu tiên trạng thái hợp lệ (sự kiện đang mở).

### Bài học 26–27/09 — game chạy thật (sự kiện) + game trong buổi học
- **⭐⭐ Thêm NGUỒN EXP mới: rà cả chỗ ĐỌC lẫn chỗ XOÁ.** Đọc: nguồn bị liệt kê cứng ở 4 chỗ (`fn_gami_exp_xu_thang` chốt xu ·
  `fn_gami_exp_chi_tiet_thang` · `fn_hs_vi_xu_cua_toi` · `EXP_NOTE_SOURCES`), tháng xác định bằng `note='YYYY-MM'` (không created_at) —
  sót 1 chỗ là EXP không bao giờ thành xu, im lặng. Xoá: `fn_recompute_exp_thang` (chạy mỗi lần đóng ET/BTVN) xoá theo `ref_buoi_hoc_id`
  KHÔNG lọc nguồn ⇒ suýt xoá sạch EXP game (bắt trước khi mở cho GV, vá mig `202609272048`). Grep `delete from gami_exp_ledger` mỗi khi thêm nguồn.
- **⭐ Sửa hàm mà phiên khác cũng đang sửa: ĐỪNG chép đè thân hàm.** Migration đọc `pg_get_functiondef` lúc áp, `replace` đúng chỗ cần,
  ASSERT đúng 1 chỗ khớp rồi `execute` (mẫu: mig `202609272045_*`). Chép bản lấy lúc sáng = xoá sửa của người khác lúc trưa.
- **⭐ Verify migration GHI trên DB thật: chạy cả file + gọi RPC trong 1 transaction rồi ROLLBACK** (claude_build, node qua stdin từ repo).
  Thấy được kết quả trên buổi/HS thật, không để lại dòng nào; chạy 2 lần (trước/sau vá) để CHỨNG MINH bug thay vì suy luận.
- **`scripts/migrate.mjs` KHÔNG có `--help` — gõ là nó ÁP THẬT mọi file treo** (27/09 lỡ gõ, may dừng ở file đầu do thiếu quyền). Chỉ dùng
  `--status` (đọc) hoặc `--only <file>`. Trong repo luôn có file treo của sự kiện/Sổ tay (áp bằng SQL Editor, sổ không ghi).
- **⭐ "Đã nối kênh" ≠ "có máy nghe".** Tối 26/09 app để hub BK01, TV thật ở BK09 ⇒ nhãn xanh "● nghe TV" mà tên gửi vào khoảng không.
  Máy điều khiển phải đọc **presence** của máy nhận (`role:'tv'`) và cảnh báo khi vắng; nút "bắt đầu" phải kéo theo mọi bước TV (mở game)
  thay vì trông người vận hành nhớ làm tay.
- **Cú pháp hợp lệ ≠ chạy đúng**: patch làm rơi `;` ⇒ `P.fin=falseP.ready=false` — `new Function` qua, chạy thì ReferenceError, iPad kẹt
  màn kết quả. Game nhiều ván phải chạy ≥2 ván liên tiếp khi verify.
- **Hình phần thưởng theo GIÁ TRỊ TUYỆT ĐỐI, không theo vị trí trong khoảng của từng hạng** (Giải 3 200 EXP từng ra "núi vàng" to hơn Nhất
  340). Loại rương/khung đã báo hạng; hình chỉ nói "được nhiều hay ít".
- **Kinh tế game: tính TB theo SĨ SỐ THẬT trước khi nhận mục tiêu.** Lớp TB 8 bạn có mặt ⇒ Giải 3 chiếm ~3/4 ⇒ "TB 250" bất khả với Giải 3
  ≤200 (max tất cả = 238). Đưa bảng TB theo sĩ số cho CEO chọn. Thêm độc đắc hiếm/nhỏ hơn ⇒ phải bù vào ô thường để giữ tỉ lệ chi.
- **iPad Safari:** nền `html` mặc định TRẮNG — trang nảy là lộ "thanh trắng"; tô `html` cùng màu game + `overscroll-behavior:none`.
  `touch-action` trên `html` áp cho mọi phần tử (lấy giao chuỗi tổ tiên) ⇒ tắt chạm-đúp-zoom toàn trang một chỗ.
- **Commit CHỈ phần mình khi file có sửa đổi chưa commit của người khác:** dựng bản index = `git show HEAD:file` + đúng patch của mình
  (script patch chạy được cho cả 2 bản) → `git hash-object -w` → `git update-index --cacheinfo`. Không `git add` cả file.
- **CEO nói "đừng chốt — t đề xuất kịch bản, luật t viết"** ⇒ CTO chỉ hỏi OUTPUT + tìm đường nối hệ thống; không tự điền số rồi build (R3).
  Số liệu luật CTO đưa ra phải dán nhãn "nháp, không dùng".
- **⭐ URL/domain phải ĐO trước khi làm mặc định, không "tạm".** 27/09 t đặt `GAMES_URL='bkdemy-games.vercel.app'` theo tên project, không curl
  ⇒ 404, nút mở TV hỏng tới khi CEO test thật ("chưa thấy game trên ERP"). Domain thật tìm bằng `vercel project ls` (CLI có sẵn, đã đăng nhập)
  → `game.bkacademy.edu.vn`. Kèm: "chưa thấy tính năng" ⇒ đo bản ĐANG CHẠY (tải bundle prod, grep chuỗi) trước khi kết luận thiếu deploy/pull.
- **Test UI có nút GHI trên ERP dev mà không ghi DB:** trong trang, `await import('/src/lib/supabase.ts')` rồi thay `supabase.rpc` (giả kết quả,
  chặn mọi `fn_*` ghi). **Vite dev tự reload khi phiên khác sửa file ⇒ override mất im lặng** — mỗi bước bấm phải kiểm override còn sống
  (vd `window.__GHI`) rồi mới bấm; xong kiểm lại DB bằng query.
- **Màn công khai không được lộ kết quả trước hoạt ảnh — và mọi màn cả lớp nhìn thấy đều là màn công khai:** dữ liệu (DB/bảng lớp) đến NHANH
  hơn hoạt ảnh ⇒ đánh dấu "đang mở" lúc NHẬN lệnh, chỉ hiện số khi game BÁO xong. Vá TV (`BKLopBang.cho/xong`) mà quên list ERP ⇒ Cast chung vẫn
  lộ (29/09). Cách đúng: game gửi tín hiệu `xong` theo `hid`, mọi nơi hiển thị chờ tín hiệu đó (+ timeout phòng TV rớt).
- **Game may rủi: đừng để thứ tự mở tiết lộ kết quả.** Luật "quà 1–2 nhỏ, quà cuối quyết định" = mở 2 món đầu vô nghĩa. Đo độ hồi hộp bằng giả lập:
  vị trí món to phải gần đều, tương quan món đầu ↔ tổng thấp, đoán lãi/lỗ sau n-1 món không quá ~70%.
- Liệt kê dữ liệu để xin xoá: t đọc `date` bằng `toISOString()` ⇒ lệch 1 ngày (27/09 thay vì 28/09) — đúng cái §2 CẤM; luôn format ngày theo VN.
- **⭐ Cân game bằng GIẢ LẬP, và giả lập phải chạy CHÍNH bộ máy của game** (Bắn Quà 28/09): cảm giác "đạn không cân" của CEO đúng — đo ra
  Chùm 52 vs Bom to 27. Bản giả lập đầu chép lại vật lý ⇒ "công thức 2 nơi" (§2.0 cấm); làm đúng là tách vật lý + điểm thành bộ máy THUẦN
  (trả sự kiện, không vẽ/âm thanh), game "diễn" sự kiện, giả lập gọi cùng bộ máy. Có bộ máy chung thì thêm 5 đạn mới + tự cân (`canBang`) rẻ.
- **Game kỹ năng nối ERP: TV tính điểm, DB tính mọi thứ còn lại.** Vật lý không chạy ở Postgres được ⇒ chỉ nhận ĐIỂM THÔ từ TV, kẹp trần, GV xem
  rồi Chốt; vòng quay, chia đội, hạng, EXP, rương, trà sữa đều rút/tính ở DB (cùng họ `fn_sk_tra_xu_van` sự kiện). Bắt đầu lại ván GIỮ đạn đã quay.
- **plpgsql: `create temp table … on commit drop` trong hàm = gọi 2 lần/transaction là trùng tên** — dùng CTE trong `for x in with … loop`.
- **Đo phân bố ngẫu nhiên bằng SQL: `lateral (… order by random() limit 1)` KHÔNG tương quan với hàng ngoài ⇒ Postgres tính 1 lần** ⇒ ra "100% một
  loại" dù hàm đúng. Đo bằng đúng câu của hàm, chạy trong vòng lặp plpgsql.
- **Chèn mục vào spec bằng "replace mốc" làm MẤT mốc 2 lần liền** (chuỗi thay không kết thúc bằng chính mốc). Mục "còn hỏi" để CUỐI file; thêm
  mục = cắt đuôi, ghi mục mới, dán lại đuôi.
- Vặt: tab trình duyệt ẩn ⇒ `requestAnimationFrame` đứng (game 3D "kẹt" không phải bug — `?loop=timer`) · file game `games-site/*.html` là **CRLF**,
  Edit tool chèn LF ⇒ chuẩn hoá lại · đường dẫn Windows nhúng vào heredoc Bash mất `\` ⇒ ghi file tạm trong repo rồi xoá · máy không có `python`.

- **⭐ Query kiểm chứng phải KHÔNG ĐƯỢC tautology, và luôn có ĐỐI CHỨNG.** Viết `where not f(x) and f(x)` để "đếm cái lọt" thì kết quả 0 là do logic, không phải do dữ liệu — vô giá trị nhưng trông y hệt bằng chứng. Tương tự, "không thấy trong kết quả" chỉ có nghĩa khi có một mẫu ĐỐI CHỨNG chắc chắn PHẢI thấy và nó thật sự hiện ra; không thì "không thấy" có thể chỉ vì query nhân bản bị hỏng.
- **Đọc dữ liệu bằng anon key để kết luận "bảng rỗng" là SAI** — RLS member-gate trả **HTTP 200 + `[]`**, không phải lỗi. Cùng họ với bẫy §2.1. Muốn số thật phải `DATABASE_URL_RO` (`claude_ro`), và `claude_ro` không gọi được RPC `grant to authenticated` nên **không thay thế được việc test end-to-end bằng tài khoản thật**.
- **Bookkeeping `_migrations`:** `bam` = sha256(nội dung utf8 **đã bỏ hết `\r`**), hex, **cắt 16 ký tự** (`migrate.mjs:105-107`); `ten` = basename. Trước khi đưa số cho người dán, **tính lại bam cho toàn bộ file đã có trong sổ và đối chiếu** (477 khớp / 0 lệch) — rẻ, và nó chứng minh mình replicate đúng thuật toán thay vì đọc code rồi tin.

### Bài học 20/09 — `format()` trong plpgsql, và lỗi bị UI nuốt

- **⭐⭐ `format()` KHÔNG biết `--` là comment SQL — nó xử lý CHUỖI THÔ.** Mọi dấu `%` nằm trong `$q$…$q$`, **kể cả trong comment**, đều bị nuốt làm format specifier ⇒ `ERROR 22023 unrecognized format() type specifier`. Cắn thật: comment viết để *cảnh báo phải escape `%`* lại chính là chỗ quên escape, làm `hs_sotay_tim` throw MỌI lần gọi suốt 2 ngày.
  **Luật rút ra (mạnh hơn "nhớ escape `%%`"): chuỗi truyền vào `format()` chỉ chứa SQL, KHÔNG comment, và KHÔNG dấu `%` nào ngoài `%1$I/%2$I`.** Mẫu LIKE dựng ở plpgsql rồi truyền qua `USING`; `limit` cũng truyền tham số thay vì `%3$s`. Escape `%%` chỉ chữa được lần này — người sửa sau viết thêm một dòng comment là đạp lại; luật "không có `%`" thì nhìn là thấy, và **kiểm được bằng máy** (tách `prosrc`, gỡ 2 specifier hợp lệ, còn `%` nào là raise trong chính migration).
- **⭐⭐ `security definer` + guard trong thân hàm = lỗi runtime NÚP SAU guard.** Test bằng anon chỉ chứng minh guard chạy, KHÔNG chứng minh phần sau guard chạy — anon bị chặn TRƯỚC khi tới `format()`. Muốn biết hàm có chạy không thì phải gọi bằng role ĐI QUA được guard. Tương tự: `tsc`/`build` không chạm DB, demo dùng mock, đo bằng SQL viết tay không qua `format()`. **Bốn lớp "verify" mà không lớp nào GỌI HÀM ⇒ vẫn là 0 lớp.**
- **⭐ Lỗi RPC và "không có dữ liệu" PHẢI là hai trạng thái tách hẳn ở UI.** `.catch(() => setRows([]))` biến mọi lỗi thành "không tìm thấy" — người dùng nhìn màn hình không thể phân biệt *kho rỗng* với *hàm nổ*, nên bug không được báo đúng bản chất và sống rất lâu. Lỗi ⇒ vẽ hộp lỗi + `console.error` **nguyên error object** (giữ `code`/`hint`/stack); rỗng ⇒ mới vẽ hộp rỗng.
- **⭐ Lỗi Supabase KHÔNG phải `Error`.** `supabase.rpc` trả `PostgrestError` = object thường `{message, details, hint, code}`. `e instanceof Error ? e.message : '<mặc định>'` ⇒ **luôn** rơi vào fallback, vứt mất message thật của DB — đúng thứ cần đọc nhất. Đọc `.message` của mọi object thay vì hỏi nó có phải `Error` không.
- **⭐ Test kiểm chuỗi/regex phải tự chặn "bắt nhầm mục tiêu".** Regex `\$q\$(.*?)\$q\$` để lấy chuỗi format đã vớ phải `$q$…$q$` trong **comment header** của chính file migration ⇒ test chạy trên chuỗi `"…"` và báo xanh cả 2 bước đầu. Lấy khối DÀI NHẤT + assert nội dung bắt buộc (`phải chứa jsonb_agg`) trước khi tin kết quả. Xanh giả nguy hơn đỏ.
- **Chốt quy trình: `npm run smoke:sotay` sau MỌI migration đụng 3 RPC sổ tay.** Giá trị của nó được chứng minh ngay lúc viết — chạy trước khi áp fix thì FAIL đúng chỗ (`22023`, exit 1), chạy sau thì PASS cả 3. Test không bao giờ đỏ là test không chứng minh được gì.

### Bài học 20/09 (phiên 3) — lọc vs xếp hạng, và "đã áp rồi"

- **⭐⭐ Tham số nghe như bộ lọc mà thực ra chỉ CỘNG ĐIỂM — kiểm bằng cách so TẬP KẾT QUẢ, không so thứ tự.** `p_khoi` của `hs_sotay_tim` nằm trong biểu thức `diem`, không nằm trong `WHERE`: đứng khối 9 vẫn ra dạng khối 4/5, chỉ khác là khối 9 nổi lên đầu. Dấu hiệu nhận ra từ chính số đo: *cùng số dòng, cùng tập, chỉ khác điểm* = đang XẾP HẠNG chứ không LỌC. Ca tệ nhất: truyền khối **không tồn tại** vẫn trả về đủ kho — test phải có case đó.
- **⭐⭐ Luật khớp chuỗi do người đề xuất (kể cả CEO) phải ĐO trên dữ liệu thật trước khi code.** "Đổi sang khớp đầu từ" nghe là chữa được "chu vi" ra "Công việc chung", nhưng KHÔNG: `chung` *bắt đầu bằng* `chu`, `viec` *bắt đầu bằng* `vi` — cả hai đều là đầu từ. Luật đúng là **tiếng cuối = tiền tố, các tiếng trước = trọn từ** (`\m<t>\M` … `\m<t>`): loại được ca sai mà vẫn cho gõ dở chữ. Cách kiểm rẻ: lấy 2 bản ghi ĐỐI LẬP (một cái phải khớp, một cái phải loại) rồi chạy từng phương án lên đúng 2 cái đó.
- **⭐ Đổi LIKE → regex thì phải khử metachar của người dùng.** `(`, `[`, `*`, `\` làm nổ query hoặc khớp bậy. Lọc mỗi tiếng còn `[a-z0-9]` trước khi ghép. (Bản LIKE cũ cũng đã dính nhẹ: `%`, `_` trong input là wildcard — lỗ âm thầm, không ai báo.)
- **⭐ `~ all('{}')` / `like all('{}')` với mảng RỖNG là TRUE-rỗng ⇒ trả về CẢ BẢNG.** Guard "không còn tiếng nào thì return rỗng" là thứ duy nhất chặn ca gõ toàn ký tự rác. Ai bỏ guard đó thì `"(((("` trả cả kho. Nhớ khi refactor.
- **⭐⭐ "Đã áp rồi" KHÔNG phải bằng chứng — luôn đo lại trước khi ghi sổ.** CEO báo đã áp `201203` + smoke xanh + test app đúng; chạy lại thì smoke **exit 1**, migration chưa hề áp. App nhìn có vẻ đúng vì 2 dạng đúng được 40 điểm nổi lên đầu còn 2 dạng rác 4 điểm xếp bét — không kéo xuống thì không thấy. **Ghi `_migrations` cho migration chưa áp là hỏng sổ VĨNH VIỄN** (từ đó `--status` coi như xong, không ai phát hiện nữa) ⇒ gặp mâu thuẫn thì DỪNG, đừng ghi.
  Cách đo rẻ và chắc: **dấu vân tay hành vi** — chọn một truy vấn mà bản cũ/bản mới ra số khác hẳn ("chu vi" không lọc khối: cũ 13 dòng + 2 dòng rác, mới 9 dòng + 0), hoặc đọc thẳng `pg_proc.prosrc` tìm chuỗi đặc trưng của từng bản.
- **⭐ `DATABASE_URL_RO` phải là chuỗi POOLER, không phải host trực tiếp.** `db.<ref>.supabase.co` đã bỏ IPv4 ⇒ `ENOTFOUND` ⇒ `npm run schema` và mọi script `pg` chết, trong khi đường REST vẫn sống (nên smoke test vẫn chạy và dễ tưởng DB bình thường). Đúng chuỗi: `…@aws-0-<region>.pooler.supabase.com:5432` — xem `.env.example:22`.
- **Self-verify trong migration nên kiểm THẲNG vào bug đang sửa, không kiểm chung chung.** `201150`: phải có `bd.khoi = $3`, không được còn `then 50`. `201203`: phải có `hay ~ all(`, không được còn `hay like all(`. Nhờ vậy migration áp nửa vời hoặc áp nhầm bản cũ là raise + rollback ngay, không cần đợi người phát hiện.

### Bài học 16–27/09 — kho Hình học phase Học (cắm bảng mới vào module cũ)

- **⭐⭐ Có module sẵn thì BÊ NGUYÊN, đừng viết lại.** 16/09 t tự viết modal câu + OCR + hub riêng; CEO: *"bê nguyên module nhập của bên đại, tự tạo module mới làm gì"* (nhập ảnh phải **dán clipboard**, PDF mới upload — module Đại có sẵn cả hai, bản tự viết thì thiếu). Trước khi viết UI nhập/sửa: grep component nhận `cauTbl`/`api` param (`DangHub`, `CauModal`, `AiImportModal`, `LyThuyetModal`, `KhoPicker`, `DangPicker`). Cách rẻ nhất: cho **bảng mới đúng SHAPE bảng cũ** (rename cột, thêm cột compat nullable/GENERATED) + **1 dòng registry** (`CUM_TBL`, `khoCuaMon`, `NHANH_CUA_MON`).
- **⭐⭐ Cắm bảng mới vào module cũ ⇒ phải kê MỌI cột module đó select/filter/insert, không chỉ cột "chính".** Dính 3 lần liên tiếp, lần nào cũng **im lặng**: (1) insert của Đại không truyền `khoi` NOT NULL; (2) `getTaiLieuFull` select `ma_dang,ten_dang,muc_do,ma_chuyen_de,ten_chuyen_de` trên `banDoTbl` ⇒ fail ⇒ buổi rỗng; (3) `listCauByDang` mặc định `.eq('kho_chuan', true)` ⇒ `autoSuggestByLoai` throw ⇒ `setDangOfBuoi` dừng giữa chừng ⇒ buổi "0 dạng", UI đơ, không báo lỗi. **Cách làm đúng:** grep `.from(K.` / `.from(cauTbl` / `.from(tbl` toàn repo, gom tập cột, đối chiếu `information_schema.columns` TRƯỚC khi báo xong — không đợi CEO bấm từng màn mới lộ.
- **⭐ UI "chọn xong mà đơ" ⇒ đếm dòng DB trước khi đọc code render.** Đếm `tai_lieu_phan` theo `loai_phan` của đúng tài liệu đó: có `buoi` mà 0 `dang` ⇒ lỗi nằm giữa đường GHI (hàm ghi throw), không phải render.
- **⭐ Đếm nguồn trước khi viết script ghép data.** `hinh_bai` tên y như nguồn nhưng (27/09) **0 dòng**; data thật ở `hinh_baitoan`. Và `phat_bieu` chỉ là câu hỏi (`de_bai_chuan` 100% NULL) — không ghép bối cảnh mô hình thì câu không đứng độc lập được. Chạy 1 query thống kê (null/rỗng từng cột ứng viên) rồi mới chốt mapping.
- **Script ghép data 1 lần: 1 transaction + gộp theo khoá tự nhiên (tên Bài) + xoá script sau khi chạy.** Không idempotent thì đừng để lại trong repo — người sau chạy lại là nhân đôi 150 câu.
- **Bộ lọc "chỉ hiện khi có dữ liệu" (`coMucDo`) cho component dùng chung.** Thêm filter độ khó vào `DangPicker` mà không làm rối nhánh chưa có `muc_do`: điều kiện hiện = tồn tại ≥1 leaf có giá trị, không `if (nhanh === 'hinh_hoc')` (§1.6 symmetry).
- **git sau stash-pop/rebase: `git status` NGAY trước `git commit`, add theo tên.** 16/09 một `git commit` trần dính 6 file phiên khác đã staged sẵn (CEO cho push chung, nhưng lẽ ra không được xảy ra).

## Bài học 12→23/10 — Nông trại + app HS (đừng đạp lại)

- **Service worker (Workbox navigateFallback) trả app HS vào iframe game** ⇒ "vào được trò chơi" nhưng hiện app HS thay vì game. Hỏng IM LẶNG, chỉ ở máy từng cài PWA. Luật: mọi đường tĩnh nhúng iframe (`/games/`) phải nằm trong `navigateFallbackDenylist`; sau deploy kiểm `sw.js` production có dòng đó. (Browser pane không đăng ký được SW nên không tái hiện được — sửa từ hành vi Workbox.)
- **Số tiền/xu cộng theo con số client báo = tin client.** `s.thang.ra` do game gửi lên; server chỉ giới hạn trần. Muốn chống gian thật phải đo ở server (số ngày/phút chơi do `fn_nt_nhip` ghi). Đừng mô tả "tối đa 20 xu/tháng" như thể đã chống gian.
- **Đồng bộ bằng số LUỸ KẾ (`diemTieu`, `thang.ra`), không bằng sự kiện** — server cộng phần chênh so với lần đã nhận ⇒ gửi lặp/mất gói không nhân đôi/mất tiền. Mẫu để tái dùng cho mọi khoản "game → ví".
- **"0 dòng" khi đọc bằng role CLI KHÔNG phải bằng chứng bảng rỗng** (RLS/owner): `giai_thuong` đọc qua app hoặc service role. Đã dính khi dò giải thưởng T9.
- **Đổi luật pha ở game ⇒ sửa `tools/test-engine.mjs` cùng lúc** (đã dính: khẳng định "mèo/chim tắt ở pha 1" làm test đỏ sau khi mở thú cưng). Chạy test TRƯỚC khi sync sang ERP.
- **Chạy generator migration thất bại vẫn có thể áp file rỗng** (`202610141758` là no-op; việc thật ở `…1759`). Kiểm nội dung file trước `npm run migrate`.
- **Bảng của owner khác không `ALTER` được** (`thong_bao_hs` "must be owner") ⇒ tạo bảng riêng (`hs_tin_moi`) rồi GỘP khi hiển thị, đừng cố mở rộng bảng cũ.
- **Đẩy từ worktree tạm cắt từ `origin/main`** khi checkout chính còn commit chưa push/tệp bẩn của phiên khác: copy đúng file của mình + append DEVLOG ở đó; tránh cherry-pick (DEVLOG xung đột).
