# design/ — file GỐC thiết kế (không vào build)

`design/bk-ui-src/`: tranh nền, ảnh thiết kế gốc, sheet icon, zip icon CEO gửi cho khu "Của tôi" (app TA;
dùng lại cho GV/OPS). `public/bk-ui/` CHỈ chứa file app dùng thật (bg_*.jpg cắt sẵn, icon đã tách/thu nhỏ).
Quy ước (CEO 07/09): file gốc → để đây, đừng để trong public/ (đóng gói vào build, nặng); đừng xoá file gốc.
**Bổ sung 01/10 (Thùy chốt):** ảnh gốc ChatGPT bộ LỚN (vd `bk-ui-src/gami/` ~140 MB) để trên đĩa nhưng KHÔNG lên git (`.gitignore`) — cất bản
chính lên Google Drive cho mọi máy (bộ gami: https://drive.google.com/drive/folders/1SuezN0GRVndmnU25MaDfcR1r12ha3aYA). Repo đã ~260 MB (riêng `design/` 183 MB), mỗi lần clone + mỗi lần Vercel build (5 project) đều kéo.
Repo giữ: hình app dùng (`public/`) + ảnh toàn cảnh tham chiếu bản JPG (`design/handoff/<kit>/reference/`).
