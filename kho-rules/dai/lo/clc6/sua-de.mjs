// ============================================================================
// SỬA ĐỀ bộ CLC lớp 6 — do Opus duyệt 10/10 từ kết quả KIỂM ĐỘC LẬP (58 đề, 805 câu; báo cáo: scratchpad kiem-bao-cao.md).
// Áp bằng scripts/kho/de-thi/ap-sua-de-clc6.mjs lên de.json (bản tách từ Word) ⇒ de-da-sua.json (bản dùng để soạn và ghi).
//
// Mỗi mục, khoá = ma_nguon:
//   thay: [[chuỗi cũ, chuỗi mới], …]  — thay ĐÚNG chuỗi trong noi_dung (không thấy ⇒ script dừng)
//   noi_dung / lua_chon / kieu         — ghi đè cả trường
//   hinh: [tên ảnh media]              — đặt lại danh sách hình (gỡ hình gắn nhầm / chuyển hình sang đúng câu)
//   hinh_bu: [tệp trong kho-rules/dai/hinh-de/] — hình lấy bù từ PDF (CEO 10/10: "có từ pdf thì bù vào")
//   bo: "<lý do>"                      — không soạn, không ghi câu này
//   luu_y_soan: "…"                    — cách hiểu đề báo cho người soạn (KHÔNG chứa đáp số)
//   ghi_chu_duyet: "…"                 — để CEO xem: vì sao sửa, bằng chứng
//   bang_chung: 'pdf' (Word chép lệch PDF đề lẻ) | 'nguon3' (PDF tổng hợp theo trường) | 'suy_ra' (cả hai nguồn in sai, suy từ lời giải sách — CẦN CEO XEM)
// ============================================================================
const R = String.raw

export const SUA = {
  // ── A. Word chép lệch so với PDF đề lẻ (bang_chung: pdf) ─────────────────────────────────────────────
  'LTV 2019 · 2': { thay: [[R`$120:x-1=73$`, R`$120:x-\frac{1}{4}=7\frac{3}{4}$`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word mất phân số 1/4 và hỗn số 7 3/4.' },
  'LTV 2019 · 8': { thay: [[R`$\frac{8}{9}$; 2020 và 2019.`, R`$\frac{8}{9}$ và $\frac{2020}{2019}$.`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word tách phân số 2020/2019 thành hai số.' },
  'LTV 2020 · 2': { thay: [['đề thể tích', 'để thể tích']], bang_chung: 'pdf', ghi_chu_duyet: 'Chính tả.' },
  'LTV 2021 · 1': { thay: [[R`$\frac{1}{7}$ km`, R`$1\frac{1}{7}$ km`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word mất phần nguyên của hỗn số.' },
  'LTV 2025 · 2': { thay: [[R`$3\times x-3=\frac{76}{9}$`, R`$3\times x-3\frac{5}{9}=\frac{76}{9}$`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word mất phần 5/9 của hỗn số.' },
  'LL 2024 · 2': { thay: [[R`$1,001;\,\,\frac{7}{8};\,\,\frac{8}{9}$ và 2020`, R`$1,001;\,\,\frac{7}{8};\,\,\frac{2021}{2020}$ và $\frac{8}{9}$`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word mất phân số 2021/2020.' },
  'TX 2023 · 14': { thay: [[R`$\frac{1}{8};\frac{1}{15};\frac{1}{24};\frac{1}{35};\frac{1}{48};...$`, R`$\frac{1}{8};\frac{1}{35};\frac{1}{80};\frac{1}{143};...$`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word chép sai cả dãy.' },
  'NTL 2024 · P1.8': { thay: [['[[omml-equation-not-converted]]', R`$60\%$`]], bang_chung: 'pdf', ghi_chu_duyet: 'Công thức Equation duy nhất của tệp Word, bộ đọc không đổi được.' },
  'NS-HB1 · P1.8': { thay: [[R`0,5\times 6:0,125`, R`0,5\times 6,6:0,125`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word mất ",6" (6,6 thành 6).' },
  'ARC 2020-NC · 19': { thay: [[R`=\overline{cbd}$`, R`=\overline{cbbd}$`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word mất một chữ b.' },
  'ARC 2022-CB · 9': {
    noi_dung: R`Diện tích trên bản đồ tỉ lệ 1 : 2000 của một khu đất là $3cm^{2}$. Diện tích thực của khu đất đó là:`,
    lua_chon: { A: R`$60m^{2}$`, B: R`$120m^{2}$`, C: R`$600m^{2}$`, D: R`$1200m^{2}$` }, kieu: 'trac_nghiem', bang_chung: 'pdf', ghi_chu_duyet: 'Phương án gõ dính liền câu hỏi.',
  },
  'ARC 2022-CB · 25': { lua_chon: { A: '15', B: '35', C: '25' }, bang_chung: 'pdf', ghi_chu_duyet: 'PDF chỉ có 3 phương án; Word thêm D = 23.' },
  'CG 2019 · P1.1': { thay: [[R`134,2\times x<`, R`\overline{134,2x7}<`]], bang_chung: 'pdf', ghi_chu_duyet: 'x là CHỮ SỐ trong số thập phân 134,2x7; Word đổi thành dấu nhân.', luu_y_soan: 'x là chữ số hàng phần trăm của số thập phân 134,2x7.' },
  'CG 2024 · 4': { thay: [['Chiều cao bằng chiều rộng.', R`Chiều cao bằng $\frac{3}{4}$ chiều rộng.`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word mất phân số 3/4.' },
  'CG 2024 · 9': { thay: [[R`đọc được $\frac{1}{5}$ số trang bằng với tổng số trang`, R`đọc được số trang bằng với $\frac{1}{5}$ tổng số trang`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word đặt phân số sai chỗ.' },
  'NTT 2018 · 4': { lua_chon: { A: '400', B: '325', C: '350', D: '391' }, bang_chung: 'pdf', ghi_chu_duyet: 'Phương án B bị thay bằng chữ "TRẢ LỜI NGẮN".' },
  'NTT 2018 · 6': { thay: [['tồng', 'tổng']], hinh: [], bang_chung: 'pdf', ghi_chu_duyet: 'Gỡ hình gắn nhầm (hình của câu 7); chính tả.' },
  'NTT 2018 · 7': { hinh: ['image582.png'], bang_chung: 'pdf', ghi_chu_duyet: 'Hình bị gắn nhầm sang câu 6.' },
  'NTT 2020 · P1.6': { thay: [['25/6 ( hoặc 26/6)', '26/5 (hoặc 26/6)']], bang_chung: 'pdf', ghi_chu_duyet: 'Ngày chép lệch.' },
  'NTT 2024 · 5': { thay: [[R`chiều rộng bằng $\frac{1}{2}$ chiều dài và chiều cao bằng chiều rộng`, R`chiều rộng bằng 1 m và chiều cao bằng $\frac{1}{2}$ chiều dài`]], bang_chung: 'pdf', ghi_chu_duyet: 'Chữ đề khác PDF (kích thước không đổi).' },
  'NN 2024-TT2 · P1.4': { thay: [['bằng diện tích tấm bìa hình tam giác', R`bằng $\frac{2}{3}$ diện tích tấm bìa hình tam giác`]], bang_chung: 'pdf', ghi_chu_duyet: 'Word mất phân số 2/3.' },
  'NN 2024-TT4 · P1.4': { lua_chon: { A: R`$\frac{2}{3}$`, B: R`$\frac{5}{6}$`, C: R`$\frac{3}{4}$`, D: R`$\frac{5}{8}$` }, bang_chung: 'pdf', ghi_chu_duyet: 'Thứ tự phương án theo PDF.' },
  'AMS 2020 · 14': { thay: [['Cho hình chữ nhật ABCD. M', 'Cho hình chữ nhật ABCD (như hình vẽ). M']], bang_chung: 'pdf', ghi_chu_duyet: 'Thiếu "(như hình vẽ)".' },

  // ── B. Hình gắn nhầm câu (Word đặt hình trước nhãn câu kế) ───────────────────────────────────────────
  'TX 2021 · 7': { hinh: [], bang_chung: 'pdf', ghi_chu_duyet: 'Gỡ hình (của câu 8).' },
  'TX 2021 · 8': { hinh: ['image169.png'], bang_chung: 'pdf', ghi_chu_duyet: 'Nhận lại hình hoa 4 cánh.' },
  'TX 2025 · 15': { hinh: [], bang_chung: 'suy_ra', ghi_chu_duyet: 'Gỡ hình (hai hình vuông ABCD, NMDP — của câu 16). Đề không có PDF; xét theo nội dung hình.' },
  'TX 2025 · 16': { hinh: ['image208.png'], bang_chung: 'suy_ra', ghi_chu_duyet: 'Nhận lại hình. Đề chữ không định nghĩa điểm R.', luu_y_soan: 'Điểm R chỉ có trên hình: R là giao điểm của PM với AB — nói rõ "theo hình vẽ".' },
  'ARC 2022-CB · 38': { hinh: [], bang_chung: 'pdf', ghi_chu_duyet: 'Gỡ hình (của câu 39).' },
  'ARC 2022-CB · 39': { hinh: ['image423.png'], bang_chung: 'pdf', ghi_chu_duyet: 'Nhận lại hình.' },
  'NTT-MH1 · P1.7': { hinh: [], bang_chung: 'pdf', ghi_chu_duyet: 'Gỡ hình (của câu 8).' },
  'NTT-MH1 · P1.8': { hinh: ['image707.png'], bang_chung: 'pdf', ghi_chu_duyet: 'Nhận lại hình.' },

  // ── C. Hình lấy bù từ PDF ───────────────────────────────────────────────────────────────────────────
  'CG 2022 · P2.8': { hinh_bu: ['CLC6-CG-2022-P2-8.png'], bang_chung: 'pdf', ghi_chu_duyet: 'Hình thang ABCD, PDF trang 2.' },
  'TX 2022 · P1.3': { hinh_bu: ['CLC6-TX-2022-P1-3.png'], bang_chung: 'pdf', ghi_chu_duyet: 'Bốn đường tròn tâm ở bốn đỉnh hình vuông, PDF trang 1.' },
  'CG 2023 · P2.8': { hinh_bu: ['CLC6-CG-2023-P2-8.png'], bang_chung: 'pdf', ghi_chu_duyet: 'Hình vuông ABCD, nửa đường tròn + 1/4 đường tròn, PDF trang 2.' },
  'CG 2021 · 10': {
    thay: [['\nSố bi hộp A\nSố bi hộp B\nSố bi hộp C\nLúc đầu\n8\n15\n10\nSau lượt 1\n7\n14\n12\nSau lượt 2\nSau lượt 3\nSau lượt 4\n10\n11\n12\n', '\n']],
    hinh_bu: ['CLC6-CG-2021-10.png'], bang_chung: 'pdf', ghi_chu_duyet: 'Bảng số bi bị Word dàn thành các dòng rời ⇒ thay bằng ảnh bảng từ PDF trang 2.',
  },

  // ── D. Cả Word lẫn PDF đề lẻ in thiếu / sai — có NGUỒN THỨ BA xác nhận ──────────────────────────────
  'NTT 2020 · P1.4': {
    noi_dung: R`Một lớp thu gom giấy vụn. Ngày thứ nhất thu được $\frac{1}{4}$ số giấy, ngày thứ hai thu được $\frac{3}{5}$ số giấy còn lại và ngày thứ ba thu được 36 kg. Hỏi tổng số giấy cần thu là bao nhiêu?`,
    bang_chung: 'nguon3', ghi_chu_duyet: 'Word và PDF đề lẻ đều cụt sau "Ngày thứ 2 thu 3/5 số còn lại." Bản đầy đủ lấy từ "Tổng hợp đề thi chính thức … Nguyễn Tất Thành.pdf" (năm học 2020–2021, câu 4).',
  },
  'NTT 2020 · P2.2': { thay: [['chia hết cho 3. Hỏi Lào', 'chia hết cho 3 và 4. Hỏi Lào']], bang_chung: 'nguon3', ghi_chu_duyet: 'Word và PDF đề lẻ mất "và 4" (thiếu thì có 5 đáp án). Theo "Tổng hợp đề thi chính thức … Nguyễn Tất Thành.pdf".' },
  'NTT 2020 · P1.9': { bang_chung: 'nguon3', ghi_chu_duyet: 'PDF đề lẻ ghi đáp số 423 000 đồng; "Tổng hợp … Nguyễn Tất Thành.pdf" ghi 515 000 đồng (mua nguyên hộp) — trùng kết quả người kiểm tính.', luu_y_soan: 'Nguyên liệu bán theo HỘP nguyên, không mua lẻ.' },

  // ── E. Cả hai nguồn in sai, KHÔNG có nguồn thứ ba — suy từ lời giải sách. CẦN CEO XEM ────────────────
  'ARC 2020-NC · 4': { thay: [[R`$\frac{49}{37}$`, R`$\frac{49}{73}$`]], bang_chung: 'suy_ra', ghi_chu_duyet: 'Word và PDF đều in 49/37; lời giải sách dùng "73 − 49 = 24" và sơ đồ 24. Với 49/37 không có đáp số hợp lệ (tử, mẫu thành số âm) ⇒ sửa thành 49/73.' },
  'NTT-MH1 · P1.1': { thay: [[R`2,34\times 34,5`, R`2,34\times 34,6`]], bang_chung: 'suy_ra', ghi_chu_duyet: 'Word và PDF đều in 34,5; lời giải sách dùng 34,6. Với 34,5 kết quả 234,766 không trùng phương án nào ⇒ sửa thành 34,6.' },
  'NN 2024-TT4 · P2.1': { thay: [[R`$\frac{13}{17}$`, R`$\frac{13}{27}$`]], bang_chung: 'suy_ra', ghi_chu_duyet: 'Word và PDF đều in 13/17; lời giải sách dùng 13/27. Với 13/17 số năm không nguyên (54 × 13/17) ⇒ sửa thành 13/27.' },
  'NTT 2025 · 15': { thay: [['Đoạn thẳng AD, CE cắt nhau tại F', 'Đoạn thẳng AE, CD cắt nhau tại F']], bang_chung: 'suy_ra', ghi_chu_duyet: 'Đề ghi "AD, CE cắt nhau tại F" là vô lí (D thuộc AB, E thuộc BC ⇒ AD và CE là hai cạnh, chỉ gặp nhau tại B). Hiểu là AE và CD. Đề 2025 không có PDF để đối chiếu.' },

  // ── F. Giữ nguyên đề, ghi chú cách hiểu ─────────────────────────────────────────────────────────────
  'NTL 2024 · P2.2': { bang_chung: 'pdf', ghi_chu_duyet: 'Mọi nguồn đều in AM = 2/3 AD, nhưng lời giải sách tính với AM = 2/5 AD (ra 20 cm², 5/2, 5/2). Giữ đề 2/3 ⇒ đáp số khác sách (100/3 cm², 3/2, 3/2). CEO chốt giữ 2/3 hay đổi 2/5.' },
  'NTL 2025 · P1.9': { kieu: 'dung_sai', bang_chung: 'suy_ra', ghi_chu_duyet: 'Câu bốn mệnh đề Đúng – Sai (khuôn đề 2025).' },
  'NTL 2025 · P1.10': { kieu: 'dung_sai', bang_chung: 'suy_ra', ghi_chu_duyet: 'Câu bốn mệnh đề Đúng – Sai. Đề chữ ghi "hình vuông ABCD" nhưng hình vẽ là hình chữ nhật 4 cm × 3 cm.', luu_y_soan: 'Chữ đề ghi "hình vuông ABCD" nhưng theo hình vẽ ABCD là hình chữ nhật gồm các ô vuông cạnh 1 cm — giải theo HÌNH và ghi rõ số ô đếm được.' },
  'NTT 2025 · 12': { bang_chung: 'suy_ra', ghi_chu_duyet: '15 khối lập phương nhỏ không xếp được thành hình lập phương lớn; hiểu là hình hộp chữ nhật.', luu_y_soan: '15 khối lập phương nhỏ không xếp được thành một hình lập phương; hiểu "hình lớn" là hình hộp chữ nhật và xét các cách xếp.' },
  'AMS 2020 · 8': { bang_chung: 'pdf', ghi_chu_duyet: 'Đề nêu mốc "tính đến năm 2021" rồi hỏi "năm nay"; sách lấy năm nay = 2020 (năm thi).', luu_y_soan: 'Đề thi năm 2020: "năm nay" là năm 2020 — ghi rõ giả thiết này trong lời giải.' },
  'LTV 2024 · 2': { bang_chung: 'pdf', ghi_chu_duyet: 'Đề hỏi "số tự nhiên nhỏ nhất chia hết cho 5 và 7"; chặt chẽ là 0, sách đáp 35 (đề kèm ngoặc "Đề khác: … có hai chữ số").', luu_y_soan: 'Hiểu là số tự nhiên KHÁC 0 nhỏ nhất — ghi rõ điều này ở Chú ý.' },
  'ARC 2020-CB · 8': { bang_chung: 'pdf', ghi_chu_duyet: 'Đề hỏi "ô tô đi từ B về A lúc mấy giờ" trong khi đã cho giờ khởi hành; ý là giờ ô tô ĐẾN A.', luu_y_soan: 'Câu hỏi được hiểu là: ô tô ĐẾN A lúc mấy giờ.' },

  // ── G. Bỏ: đề nguồn không có nội dung ───────────────────────────────────────────────────────────────
  'NTT 2019 · 1': { bo: 'Đề nguồn chỉ ghi "Là 1 bài về giao thông có hình vẽ…" — không có hình, không có dữ kiện (đề do HS nhớ lại).' },
  'LTV 2024 · 19': { bo: 'Đề nguồn ghi "Đang cập nhật đề" — không có nội dung.' },
  'LTV 2024 · 20': { bo: 'Đề nguồn ghi "Đang cập nhật đề" — không có nội dung.' },
}
