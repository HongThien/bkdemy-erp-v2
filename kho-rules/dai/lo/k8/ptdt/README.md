# Sửa phân tích đa thức thành nhân tử K8 (08/11) — câu clone sai

Kiểm 488 câu của chủ đề NCD00155 (16 dạng bài) bằng sympy: đề có phân tích được trên Z không · đáp án = đề · từng dòng lời giải = đề · nghiệm Tìm x.
- `cau.json` = ảnh chụp 488 câu TRƯỚC khi sửa · `kiem2.py` = bộ kiểm (cần `pip install sympy`) · `plan.py` (nhẩm nghiệm bậc 3) + `plan2.py` (còn lại) sinh `plan_all.json` (49 câu).
- `ap_dung.mjs`: chạy thử mặc định (rollback), `node --env-file=.env kho-rules/dai/lo/k8/ptdt/ap_dung.mjs --ghi` để ghi thật 1 transaction.
  Từ chối ghi nếu câu đã bị sửa sau lúc chụp; thu hồi form trắc nghiệm của câu đổi đề/đáp số (như `fn_kho_duyet_cau`); ghi nhật ký cũ→mới vào `kho-rules/dai/lo/k8/ptdt-sua-08-11.json`.
