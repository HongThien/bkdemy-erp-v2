# Tiến độ bộ đề GKI Toán 9 (58 đề) — sổ điều phối (18/10/2026)

Quy trình mỗi đề: soạn (Sonnet) → soát mù (Opus, biên bản `<MA>.soat.md` có "KẾT LUẬN: ĐẠT") → cổng → ghi (`scripts/kho/de-thi/k9-ghi-de.sh <MA> [--ghi]` / `k9-ghi-het.sh`, tuần tự, KHÔNG 2 lượt --ghi song song) → câu Hình tự vào dạng HH00140.
Trần 20 subagent song song. Mỗi lần có trạm xong: đẩy soát đề vừa soạn, rồi soạn đề kế tiếp.

(Trạng thái lúc ghi sổ — luôn đối chiếu lại bằng đĩa: `ls GKI-*.soan.md`, `grep -l "KẾT LUẬN: ĐẠT" GKI-*.soat.md`.)

- Soạn đã giao: 01–44, 46. **Chưa giao soạn: 45, 47–58.**
- Soát chưa giao: 36 (đã giao), các đề soạn xong sau này.
- Việc phải làm sau khi soát xong hết: k9-ghi-het.sh → kiểm "nhóm bài" (lời dẫn khác nhau không gom được: nom-bai.mjs) → dựng trang xem + tổng hợp câu "Chưa chắc" → DEVLOG + k9.md → commit/push.
