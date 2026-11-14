# ⚠️ ĐẦU ĐÈ cho brief chuẩn bị batch — CUỐI KÌ I THPT (K10 đề thi · K10/K11 đề cương), MÁY CÔNG TY (14/11) — đè lên `_brief-chuan-bi-batch.md`

Làm theo `kho-rules/dai/lo/toanmath/_brief-chuan-bi-batch.md` (quy trình + trả lời cuối), CHỈ khác:

- **Máy công ty:** Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. KHÔNG đặt `BK_GOC`/`BK_LV`, KHÔNG đổi `WBPC`→`Admin`.
  Lệnh: `node kho-rules/dai/lo/toanmath/chuan-bi-batch.mjs <BATCH>`; đo trùng `node --env-file=.env kho-rules/dai/lo/toanmath/do-trung-batch.mjs --batch <BATCH>` (chỉ đọc DB) trước khi quyết bỏ/giữ.
- **Phạm vi:** CHỈ bài `folder` = `Đề thi/CKI` hoặc `Đề cương/CKI` trong batch được giao (bài CKII: BỎ, ghi `bo.md` "lượt sau").
  **Đề thi: chỉ đề của MỘT trường / sở** — bỏ bộ ôn tập nhiều đề (`10-de-…`, `bo-de-…`, `05-de-on-thi…`) ghi `bo.md` "bỏ — bộ ôn tập (Thùy 13/11)". File nhiều mã đề ⇒ chỉ lấy MỘT mã (mã đầu) bằng `tach`.
  Đề / đề cương đã có trong kho (cùng trường + năm học, nội dung khớp) ⇒ bỏ, ghi bằng chứng. Bản PDF và Word cùng một bài ⇒ DÙNG PDF; Word đáp án = nhân chứng (`dap_an_word`).
  Batch Word (B041): đọc ghi chú batch "có đề lỗi công thức: giải phần sạch, câu hỏng bỏ" — nếu có PDF cùng đề thì dùng PDF.
- **Mỗi đề / đề cương = MỘT tệp soạn** `<BATCH>-NN` (đề cương dài vẫn một mục — người điều phối tự chia khúc khi soạn). `de` = mọi trang có bài tập (bỏ bìa, ma trận, lý thuyết chỉ chữ, quảng cáo).
  Có lời giải / đáp án ⇒ `hd` = các trang đó (nhân chứng, tự giải trước).
- **`_dau-brief.md` cho từng batch** (khuôn: `batch/B032/_dau-brief.md` — đề thi K11 THPT đã chạy 13/11):
  - `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\<BATCH>\<MA>`; tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\<BATCH>\<MA>.soan.md`. Cổng `--khoi <10|11> --chi-kiem`.
  - Đầu tệp đề thi: `# ĐỀ | Đề kiểm tra cuối học kì 1 Toán <khối> năm <năm học> — <don_vi> (<mã đề>)`, `nam`, `bo_sach`, `thoi_gian_phut` (KHÔNG `kieu`).
    Đầu tệp đề cương: `# ĐỀ | Đề cương ôn tập cuối học kì 1 Toán <khối> năm <năm học> — <don_vi>`, **`kieu: de_cuong`**, `nam`, `bo_sach`.
  - PHẦN theo đúng đề: TN · Đ/S (đủ 4 ý a–d) · TLN · tự luận; đề cương theo đúng cách đề cương chia.
  - **Phạm vi = cuối học kì 1 của khối THEO BỘ SÁCH** (đọc từ tiêu đề / nội dung): K10 theo `kho-rules/dai/lo/k10/de-cuong/brief-soan.md` (phạm vi kiến thức + phân kho `hgt` cho Vectơ / hệ thức lượng); K11 theo `kho-rules/dai/lo/k11/de-cuong/brief-soan.md` + `brief-cki.md` (CKI). Ghi rõ trong `_dau-brief`.
  - Luật chung đã chốt (ghi vào `_dau-brief`): đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai` (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị;
    hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10); hình cắt / vẽ xong, soát xong ⇒ người điều phối chạy `anh-batch.mjs day <BATCH>`;
    KHÔNG ghi `\text`, `\frac`, `\notin`, `\neq` qua chuỗi JS (dùng Write/Edit).
- Sau khi viết `_dau-brief.md`: `node kho-rules/dai/lo/toanmath/ghep-brief.mjs <BATCH> k10dc` (K10) hoặc `… k11dc` (K11), rồi mở `brief-soan.md` kiểm đường dẫn tệp soạn `lo\toanmath\batch\<BATCH>\<MA>.soan.md`, `<LV>` = `de-thi\toanmath\<BATCH>\<MA>`.
- Không ghi DB (chỉ đọc), không commit, không xoá gì. Trả lời cuối: mỗi batch — giữ / bỏ (vì sao), danh sách `ma` + trường + loại (đề thi / đề cương) + số trang + có đáp án không + scan/chữ + bộ sách + ước số câu.
