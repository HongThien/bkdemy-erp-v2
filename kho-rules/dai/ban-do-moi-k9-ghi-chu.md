# Bản đồ mới khối 9 — ghi chú khi điền lý thuyết + ví dụ (14/10/2026)

Thùy 14/10: *"bản đồ lớp 9 mới đã xong dạng bài và mô tả. M điền lý thuyết và ví dụ nhé. Tham khảo từ bản đồ cũ và các quyển sách mà t gửi"*.

- **Đã ghi (DB live):** 75 dạng có mô tả (khối 9, Toán) ⇒ lý thuyết MỚI 61 dạng (14 dạng đã có lý thuyết thì giữ nguyên) · ví dụ 75 dạng × 2 = 150 ví dụ có lời giải.
  Sau khi ghi: 75/75 dạng có mô tả đều có lý thuyết + ví dụ. **Không đụng:** 3 dạng chưa có mô tả (NDB00512, 513, 514), `mo_ta`, tên, lý thuyết nhóm, lý thuyết dạng có sẵn.
- **Nguồn:** mô tả của Thùy (đích) · lý thuyết bản đồ cũ (`dai_dang_ly_thuyet`, qua `dai_bdm_doi_ung`) + câu kho cũ · sách `E:\BK ACADEMY\Tài liệu tham khảo\K9\` (Ngô Đức Tài HK1, Tài liệu học tập HK1, sách HK2) · luật trình bày `kho-rules/dai/k9.md` §1–§3.
- **Dây chuyền:** 8 lượt (A1–A8, theo nhóm) → trạm soạn Sonnet (`lo/k9/ban-do/brief-soan.md`) → trạm soát Opus (`brief-soat.md`, kiểm từng dòng biến đổi bằng máy, quét nghiệm, quét GTLN–GTNN) → máy kiểm khuôn `kiem.mjs` lỗi 0
  → `ghi.mjs --ghi` (chỉ ghi ô đang TRỐNG; mỗi dạng một UPDATE, trigger tự lưu `dai_bdm_log`). 8/8 lượt soát ĐẠT, ~60 chỗ được sửa (vd 3 dạng hệ có tham số làm lại, NDB00733 ví dụ 2 thiếu dữ kiện ra 2 đáp án, `\mathbb{N}^{ast}` hiện sai, NDB00716 "trừ" người thiếu chỗ → "cộng").
- **Trang duyệt:** `kho-rules/dai/k9-ban-do-moi-duyet.html` (`node kho-rules/dai/lo/k9/ban-do/duyet.mjs`). Bản soạn, bản gốc trước soát, biên bản: `C:\Users\WBPC\bk-kho-lam-viec\bdm\k9\ra\A*.txt|.goc.txt|.soat.md`.

## Cần Thùy quyết / xác nhận

### A. Làm theo mô tả của Thùy nhưng trái luật khối 9 đang có
- **NDB00707, 708, 709** (hệ có tham số): phương pháp chính = xét tỉ số các hệ số ($\dfrac{a}{a'}$ với $\dfrac{b}{b'}$, có lưu ý hệ số bằng 0) đúng như mô tả. `k9.md` §1 (v0) đang cấm dùng tỉ số như công thức thuộc lòng ⇒ Thùy xác nhận để sửa §1 cho khớp.

### B. Cách hiểu mô tả (trạm soạn tự hiểu, trạm soát thấy hợp lí)
- **NDB00714:** "thay đổi giữa chừng" = đổi người làm giữa chừng + năng suất đổi theo phần trăm.
- **NDB00716:** chưa có đối ứng bản đồ cũ — viết theo thừa người / thừa ghế, đổi cách xếp dãy.
- **NDB00719** "Các bài toán khác … thực tế": có bài tuổi và bài chữ số (bài chữ số không hẳn "thực tế").
- **NDB00721:** nằm trong nhóm "Phương trình tích" nhưng mô tả là phương trình bậc nhất — viết theo mô tả.
- **NDB00724 / 725:** chia 724 = ẩn phụ đa thức, trùng phương; 725 = phân tích mẫu, ẩn phụ phân thức.
- **NDB00722:** ví dụ mới bám mô tả "tích có sẵn bằng 0"; lý thuyết có sẵn lại là "quy về tích" (trùng NDB00726).
- **NDB00728:** mô tả "biểu diễn tập nghiệm" — ví dụ kết luận bằng lời, chưa có trục số. Có cần hình trục số không?
- **NDB00485:** mô tả ghi "bình phương hai vế" cho dạng rút gọn — hiểu là đặt $A$, tính $A^2$, xét dấu $A$. Ranh giới với NDB00484 nằm ở phương pháp, không ở đề.
- **NDB00740:** ví dụ 1 là một căn ở mẫu + một căn ngoài; có cần ví dụ có hai phân thức không?
- **NDB00503:** ví dụ chọn $|P|=P$ và $|P|>3$. **NDB00508:** ví dụ dùng tử hằng số.
- **NDB00487:** ví dụ 2 nhận cả hai giá trị; muốn có ca loại vì mẫu bằng 0 thì đổi số. **NDB00500:** cả hai ví dụ $A=\sqrt{x}$. **NDB00824:** ca $\sqrt{x-6\sqrt{x}+9}$ mới nêu ở lý thuyết, chưa có ví dụ.
- **NDB00713, 732:** ví dụ 1 cùng khuôn ví dụ của lý thuyết nhóm (khác số liệu / câu hỏi) — giữ vì là bài chuẩn của dạng.

### C. Lỗi trong nội dung CÓ SẴN (chưa sửa — không đè chữ của Thùy)
- **NDB00723** lý thuyết: ĐKXĐ ghi $x\ne5$ cho mẫu $x+5$ — đúng là $x\ne-5$.
- **NDB00722** lý thuyết: "Giải hệ phương trình: $x^2-1=5(x+1)$" — phải là "Giải phương trình".
- **NDB00731** lý thuyết: nghiệm loại ghi $-\dfrac{15}{4}$, đúng là $-\dfrac{4}{15}$; còn dùng `$$`.
- **NDB00717** lý thuyết: lãi $x$% nhưng viết gốc + lãi $A(1+x)$ (đúng $A\left(1+\dfrac{x}{100}\right)$); "mượn" → "gửi"; ví dụ trong đó là bài giảm giá (hợp NDB00715 hơn).
- **NDB00705** lý thuyết: "Thay $u=v+2$" — đúng là $u=2v+2$. **NDB00706** lý thuyết: kết luận dạng tập hợp, trái `k9.md` §1.
- **NDB00710, 720** lý thuyết mỏng (710 chỉ 3 công thức; 720 chỉ một ví dụ, không ##TC / ##PP).
- **NDB00727** tên: "một ổn" → "một ẩn".
- **Nhóm NNB01050:** "TH1: $x-50$" thiếu "$=0$". **Nhóm NNB01062/63/64:** "$A\ge, B>0$", dấu "." làm dấu nhân, thiếu `$` đóng, dùng $\Leftrightarrow$.
- **Nhóm NNB01070:** ví dụ 1 $U(5)=\{1;\pm5\}$ thiếu $-1$; ví dụ 2 điều kiện $x>0$ mà nhận $x=0$; thiếu lập luận vì sao chỉ xét $\sqrt{x}$ nguyên.
