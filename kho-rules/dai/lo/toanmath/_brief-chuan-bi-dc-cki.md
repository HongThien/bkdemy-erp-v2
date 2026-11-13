# ⚠️ ĐẦU ĐÈ cho brief chuẩn bị batch — ĐỀ CƯƠNG CUỐI KÌ I Toán 6/7/8, MÁY CÔNG TY (13/11) — đè lên `_brief-chuan-bi-batch.md`

Làm theo `kho-rules/dai/lo/toanmath/_brief-chuan-bi-batch.md` (quy trình + trả lời cuối), CHỈ khác:

- **Máy công ty:** Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. KHÔNG đặt `BK_GOC`/`BK_LV`, KHÔNG đổi `WBPC`→`Admin`.
  Lệnh: `node kho-rules/dai/lo/toanmath/chuan-bi-batch.mjs <BATCH>` rồi `node kho-rules/dai/lo/toanmath/ghep-brief.mjs <BATCH> k<khối>` (k8 / k7 / k6).
  Đo trùng: `node --env-file=.env kho-rules/dai/lo/toanmath/do-trung-batch.mjs --batch <BATCH>` (chỉ đọc DB) — chạy trước khi quyết bỏ/giữ.
- **Phạm vi:** CHỈ bài `folder = Đề cương/CKI` trong các batch được giao (bài CKII trong cùng batch: BỎ, ghi `bo.md` "lượt sau").
  Đề cương đã có trong kho (kho đề thi tab Đề cương — `tai_lieu` loai de_thi, `cau_hinh->>'kieu'='de_cuong'`, cùng trường + năm học, nội dung khớp) ⇒ bỏ, ghi bằng chứng.
- **Mỗi đề cương = MỘT mục / MỘT tệp soạn** (`<BATCH>-NN`), `de` = MỌI trang có bài tập (bỏ bìa, ma trận, lý thuyết tóm tắt chỉ chữ, quảng cáo cuối). Đề cương kèm lời giải /
  đáp án ⇒ `hd` = các trang đó (nhân chứng, tự giải trước).
- **`_dau-brief.md` (khuôn B005, đổi cho đề cương):**
  - Tên: `# ĐỀ | Đề cương ôn tập cuối học kì 1 Toán <khối> năm <năm học> — <don_vi>`; dòng **`kieu: de_cuong`** (bắt buộc — vào tab Đề cương); `nam:`; `bo_sach:`.
  - **PHẦN theo đúng cách đề cương chia** (I. Trắc nghiệm / II. Tự luận / Dạng 1, Dạng 2… / Đề minh hoạ số 1, 2…), mỗi phần một `## PHẦN n | <tên> | <dạng thức>`; nhãn câu giữ như in,
    duy nhất trong PHẦN. Phần LÝ THUYẾT chỉ chữ (không phải bài tập) KHÔNG đưa vào. Đề cương nhiều câu (> 80) vẫn MỘT tệp — trạm soạn làm hết, không bỏ dở.
  - **Phạm vi = cuối học kì 1 của khối** theo brief gốc khối (`kho-rules/dai/lo/k<khối>-brief-soan.md`) + `kho-rules/dai/k<khối>.md` luật kiến thức theo thứ tự bài, tính tới hết học kì 1.
    K8: **đường trung bình ĐƯỢC dùng** ở cuối kì 1 (Thùy 13/11 cho K8 CKI). K6/K7: theo đúng luật khối đã chạy bộ đề CKI (`k6.md`, `k7.md`).
  - Phân kho: Hình học ⇒ `kho=hinh_hoc` (K7, K8); K6 hình học trực quan theo luật `k6.md` (kho dai/hgt như brief gốc K6). Còn lại `kho=dai`.
  - Đáp án / lời giải in trong đề cương = nhân chứng, TỰ GIẢI TRƯỚC; lệch ⇒ tính lại bằng máy, giữ đúng + `**Ghi chú:**`.
  - **Hình:** cắt / vẽ xong, soát xong ⇒ người điều phối chạy `anh-batch.mjs day <BATCH>` (hình sống trên kho).
  - Cảnh báo trạm: KHÔNG ghi `\text`, `\frac`, `\notin`, `\neq` qua chuỗi JS (`"\t"`, `"\f"`, `"\n"` biến thành ký tự thật) — dùng công cụ Write/Edit trực tiếp.
- Trả lời cuối: mỗi batch — số đề cương giữ / bỏ (vì sao), danh sách `ma` + trường + số trang đề + có lời giải không + scan/chữ + ước số câu.
