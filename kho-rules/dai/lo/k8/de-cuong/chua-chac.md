# Đề cương ôn tập giữa kì I Toán 8 (Ngôi Sao Hoàng Mai 2026–2027) — CÂU CHƯA CHẮC cần CEO xem

> Gom từ các dòng `**Chưa chắc:**` của bản soạn đã qua soát (12/10). Mỗi câu đã có lời giải theo cách hiểu hợp lí nhất, hai lượt giải độc lập khớp nhau;
> cờ chỉ nói rằng ĐỀ CƯƠNG có chỗ cần người quyết. Trên ERP: Kho đề thi › Đề cương › mở đề › câu có cảnh báo "CHƯA CHẮC".
> **1 câu** còn cờ.

## Bài 23

- lời giải CHƯA đầy đủ — chỗ hở là bước loại các $m$ lẻ chia hết cho 3 và $m>9$ (tức $n=2008+m$ với $m=15,21,27,\dots$). Đã chứng minh được: bài đưa về $113+2^m=s^2$; $m$ chẵn vô nghiệm; $m$ phải lẻ và chia hết cho 3; $m=3$ và $m=9$ thoả mãn (ứng với $n=2011$, $n=2017$). Kiểm bằng máy (BigInt, `tam/kiem_p11.mjs`) mọi $m\le30000$ (tức $n\le32008$) chỉ có $m=3$ và $m=9$. Còn việc chứng minh KHÔNG có $m$ nào lớn hơn thì không có cách sơ cấp trong phạm vi lớp 8 mà tôi biết: $s^2-2^m=113$ thuộc họ phương trình Ramanujan–Nagell tổng quát ($x^2+D=2^m$, ở đây $D=-113$); phép thử số dư chỉ cho điều kiện tuần hoàn theo $m$, mà $m=3$ thoả nên lớp "$m=3+$ bội của chu kì" không bao giờ bị loại. (Trạm soát kiểm lại 12/10: giải mù ra cùng $n=2011$, $n=2017$; vét độc lập $m\le3000$; phần đã chứng minh trong lời giải đúng; chỗ hở đúng như nêu.) Nghi đề in lỗi hoặc sai hằng số: dạng kinh điển $2^{2008}+2^{2011}+2^n$ (hằng số 9 thay cho 113) thì chứng minh trọn vẹn được bằng $(s-3)(s+3)=2^m$ và cho $m=4$, $n=2012$ (đã kiểm bằng máy).
