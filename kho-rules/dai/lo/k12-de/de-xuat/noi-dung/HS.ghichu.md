# GHI CHÚ CHO CEO — HS (gộp từ các lượt soạn)

### HS-A.txt
- Đã đọc: hồ sơ nguồn `k12-hs/ho-so/` (hoso-nbv-1-2.md, hoso-pnl-1-2.md, hoso-tutam.md) và bản v1 đã soát `k12-hs/ra/J1.txt` (khối H1.1, H1.2, H1.3 — nguồn gốc, đã viết lại cho dạng mới và thêm ý theo đề thi: đồng biến trên R, tổng a+b, hàm lôgarit/mũ, so sánh f(a), f(b)). Chưa trích lại file Word của 3 bộ sách vì văn bản chương này đã có sẵn trong hồ sơ.
- C1.1.1: mô tả có "kể cả câu chỉ hỏi tính y'" — xử lí bằng ý a) của ví dụ 2 (tính y' phân thức).
- C1.1.2: ví dụ b) dạng "chọn hàm đồng biến trên R" nằm ở dạng này (đề hay trộn với C1.1.1); có thể chuyển nếu CEO muốn tách.
- Mọi ví dụ đã thử lại bằng script node (quét dấu y', so sánh giá trị): không phát hiện sai.
- (Trạm soát 03/11) Đã thay 3 ví dụ trùng gần nguyên câu đề thi trong kho (C1.1.1 vd1 ≈ T112010102062; C1.1.2 vd1 b, c = T112010102049, T1120000005883); thêm công thức $ad-bc$, trùng phương, $\log_a u$, $a^u$ vào lý thuyết vì đề hỏi nhiều. Chi tiết: `HS-A.soat.md`.


### HS-B.txt
- Nhóm C1.2 có đủ 6 dạng; mô tả dạng nào cũng rõ, không phải tự đoán.
- Đã bỏ "quy tắc II" ($f''$) khỏi lý thuyết: câu đề thi trong 6 dạng này chỉ hỏi bằng xét dấu $y'$ (CT 2018 không có quy tắc II). Đã bỏ các ý tham số $m$, đường thẳng qua hai cực trị, tam giác cực trị: đó là dạng khác, không thuộc nhóm giao.
- (Trạm soát sửa) 53 câu đề thi dạng C1.2.2: đa số phân thức bậc hai/bậc nhất, còn lại hàm mũ ($x^2e^{x+1}$, $e^{x^2-2x+2024}$), căn ($\sqrt{4-x^2}$, $2x\sqrt{8-x^2}$), logarit ($\log_{0{,}5}(-x^2+4x)$, $\log_3(x^2-2x+3)$); KHÔNG có câu hàm trị tuyệt đối/chia khúc. Ý "hàm có điểm không khả vi" và ví dụ 2b) $|x^2-4x+3|$ giữ lại vì mô tả dạng ghi rõ; nếu bám đề tuyệt đối thì có thể thay 2b) bằng hàm logarit — CEO quyết. Đã thêm dòng lý thuyết cho $e^{u}$, $\log_a u$ (đề có hỏi).
- Tất cả ví dụ đã tính lại bằng node (quét lưới đổi chiều biến thiên và đổi dấu $f'$): khớp đáp số; hình đồ thị vẽ từ công thức, đọc được các điểm nguyên.
- Sách đã dùng: văn bản sách đã trích trong `k12-hs/ho-so/` (hoso-nbv-1-2.md: NBV 12-2; hoso-tutam.md: Từ Tâm; hoso-pnl-1-2.md: PNL Bài 1 cực trị) và bản v1 đã soát `k12-hs/ra/J2.txt` (H2.1.1, H2.1.3, H2.1.4, H2.2.1, H2.2.2, H2.3.1, H2.3.2). Thư mục `scratchpad\txt\nbv|tutam` rỗng; trạm soát đã đối chiếu thêm lý thuyết SGK trong `scratchpad\sach\hsd\nbv-ct-lt.md` (định nghĩa cực trị "xác định và liên tục trên khoảng", định lí xét dấu, 4 bước tìm cực trị) — khớp. Ví dụ đã viết lại cho đúng dạng mới (thêm trùng phương/bậc cao vào C1.2.1, hàm khúc/trị tuyệt đối vào C1.2.2, ví dụ đồ thị trùng phương cho C1.2.4, nhân tử $(3-x)^3$ cho C1.2.6).


### HS-C.txt
- Đã đọc sách: NBV 12-3 file `A. LY THUYET.docx` (lý thuyết SGK, ví dụ 1–4); PNL Toán 12 Chương 1 Bài 2 `Dạng 01 ..._GV.docx` (định nghĩa, quy trình đoạn/miền, ghi chú hàm đơn điệu, Cô-si); Từ Tâm `C1-B2-GIÁ TRỊ LỚN NHẤT-NHỎ NHẤT CỦA HÀM SỐ-P1.docx` (Dạng 1 trên đoạn, Dạng 2 trên khoảng). Hồ sơ `k12-hs/ho-so/hoso-nbv-3-4.md` và gốc v1 `k12-hs/ra/J4.txt` (H3.1, H3.2) dùng làm nền, các ví dụ viết lại và tính lại bằng số (`soan/HS/thu-C13.mjs`, quét lưới 2 triệu điểm, khớp mọi đáp số).
- Phần "Ứng dụng" (tốc độ, mô hình thực tế), tham số m, hàm hợp, $|f+m|$ của NBV 12-3 nằm ngoài C1.3 (thuộc phần khác của cây), không đưa vào.
- C1.3.3: đề thi trộn cả câu trả lời ngắn có dạng $a\sqrt{b}$, "làm tròn" và "tập giá trị"; ví dụ viết tự luận nên không có câu làm tròn, chỉ nêu "tập giá trị = $[m;M]$" ở lý thuyết.
- C1.3.4 (trạm soát kiểm lại bằng số cả 20 câu đề thật của dạng): câu **T112010402145** ($y=x^3-\dfrac{3x^2}{2}-6x-4$ trên $(-\infty;-1)$, đáp án C $=-\dfrac12$) **sai theo định nghĩa** — hàm đồng biến trên cả khoảng, $-\dfrac12$ là giá trị tại đầu mở $x=-1$ không đạt, nên GTLN không tồn tại (không có phương án đúng). Câu bậc ba trên $(-1;3)$ (**T1120000005639**, $x^3-3x^2+3$, đáp án $x_0=0$) thì **đúng** (GTLN $3$ đạt tại $x=0$). Các câu còn lại khớp. Ví dụ của dạng viết theo đúng định nghĩa.
- C1.3.4: câu **T1120000006307** ($f'(x)=3$, hỏi GTLN–GTNN trên đoạn $[2;3]$) xếp nhầm vào dạng "trên khoảng"; hợp với C1.3.6 (hàm đơn điệu trên đoạn) hơn.
- C1.3.6: đề thi có 3 kiểu — bảng biến thiên trên đoạn/nửa khoảng/ℝ; bảng xét dấu $f'$ với mệnh đề về max/min trên khoảng; công thức $f'(x)$ (hoặc "liên tục và đồng biến trên đoạn") hỏi điểm đạt. Ví dụ đã phủ cả 3 kiểu. Hai ví dụ chỉ dựa bảng, trạm soát kiểm bằng hàm dựng khớp bảng (nội suy đơn điệu qua các cột; $f'=(x+2)(x-1)(x-3)$ cho bảng dấu).


### HS-D.txt
- Đã đọc sách: NBV 12-4 (TIEM CAN: A. LY THUYET, C. BAI TAP TRAC NGHIEM - CH), NBV 12-1, 12-2, 12-3 (A. LY THUYET: định nghĩa đồng biến, định lý dấu y', cực trị, GTLN-GTNN), PNL 2026 Chương 1 Bài 3 (Dạng 1-4 và Đề 03, bản GV; Dạng 2 có phần xác định TCX), Từ Tâm (hồ sơ TCĐ/TCN/TCX); công thức trong sách là ảnh nên chỉ lấy cấu trúc và cách giải, ví dụ tự giải lại. Nền là bản v1 đã soát `ra/J5.txt` (H4.1, H4.2, H4.3) và `ra/J6.txt` (H5.1), viết lại cho dạng mới.
- C1.4.1 và C1.4.3 (trạm soát đã chốt theo định nghĩa SGK, đối chiếu NBV 12-4 phần lý thuyết và Từ Tâm "hằng/bậc nhất là tiệm cận của chính nó"): khi $ad-bc=0$ hàm là $y=\frac{a}{c}$ khuyết một điểm — không có TCĐ, $y=\frac{a}{c}$ vẫn là TCN; khi phép chia dư $r=0$ — không có TCĐ, $y=px+q$ vẫn là TCX. Đã ghi vào ##CY C1.4.1 và ##TC C1.4.3. Một số tài liệu cũ nói "không có tiệm cận"; ví dụ vẫn luôn cho $ad-bc\ne0$, dư khác $0$.
- C1.4.4 ví dụ 2 vẽ nét đứt tiệm cận xiên (tiệm cận đứng không vẽ) để đọc được phương trình đường chéo; ví dụ 1 vẽ cả hai nét đứt, không ghi tên.
- C1.4.2 gộp H4.1.2 và H4.1.3 (phân thức bậc cao + hàm chứa căn/trị tuyệt đối). C1.4.3 gộp ba kiểu (chia đa thức, đã tách, chứa căn); ví dụ 2 gồm hai ý khác kiểu.
- C1.4.6 có thêm ý tiệm cận xiên từ $\lim[f(x)-(ax+b)]=0$ (T1120000006174) và ý hàm $kf(x)+m$ (T1120000006377); trạm soát bỏ ý "tập xác định bị chặn" vì đề không hỏi.
- C1.5.1: câu đề T112000000890 không chặt chẽ — đáp án A ("đạt cực trị tại $x_0$ thì đạo hàm đổi dấu khi qua $x_0$") không đúng với mọi hàm, còn B ("đạt cực trị thì $f'(x_0)=0$") đúng khi $f$ có đạo hàm tại $x_0$ ($y=|x|$ là phản ví dụ của B khi không có đạo hàm). Lý thuyết dạng viết theo SGK; ví dụ không dùng câu này. CEO quyết có sửa đáp án/ghi chú câu đề không.
- C1.5.2: đề thi chỉ có 3 câu, cả ba là hàm bậc ba ⇒ trạm soát đổi ví dụ 2 sang bậc ba $a<0$ ($y=-x^3+3x+2$, có cực tiểu nằm trên $Ox$) và bỏ lý thuyết hàm phân thức. Hình đặt trong lời giải (không phải trong đề) vì bài khảo sát yêu cầu HS tự lập bảng và vẽ.
- Mọi số liệu đã thử bằng script `S\soan\HS-D\thu.mjs`; trạm soát tự giải lại bằng `S\soat\HS-D\kiem.mjs`.


### HS-E.txt
- Nguồn: bản v1 đã soát (k12-hs/ra/J6, J11, J12, J13) + câu đề thi thật (cau-dang.cjs, 8 dạng). Trạm soát đã đối chiếu thêm sách: NBV 12-5 và 12-6 "A. LÝ THUYẾT" (sơ đồ khảo sát; tâm đối xứng = giao hai tiệm cận; hàm bậc hai/bậc nhất cần tử không chia hết mẫu), Từ Tâm C1-B4 P2 (cách loại theo loại hàm → dấu a → điểm đi qua) và hồ sơ hoso-nbv-5-6-7.md; công thức trong sách là ảnh WMF nên chỉ đối chiếu được cách làm, không đọc được từng số.
- C2.1.5: mô tả ghi "bốn phương án thuộc các loại hàm khác nhau", nhưng 5/6 câu đề thật xếp vào dạng có hai phương án CÙNG loại (vd T1120000004343 có hai hàm bậc nhất trên bậc nhất), phải dùng thêm tiệm cận/điểm đi qua; ranh giới với C2.1.1–C2.1.3 (mô tả các dạng này đã ghi "kể cả khi phương án lẫn loại hàm khác") cần chốt. Ví dụ giữ đúng mô tả (bốn loại khác nhau).
- C2.1.4: một trong hai câu đề thật hỏi ngược (cho công thức, chọn một trong bốn HÌNH); ví dụ chỉ có chiều "cho hình/bảng, chọn công thức" vì mỗi ví dụ một hình.
- C2.3.1: đề thật còn có câu chọn công thức từ bảng biến thiên (T112020202034) xếp vào dạng này; ví dụ chỉ có đồ thị, vì nhận dạng từ bảng đã nằm ở C2.1.2.
- C2.3.2: đề thật gần như chỉ hỏi toạ độ tâm (từ công thức hoặc đồ thị) và biểu thức theo toạ độ tâm ($m+n$, $a\cdot b$, $OI$); không thấy câu nào hỏi "điểm đối xứng qua tâm" dù mô tả dạng có ý này. Ví dụ 2 vẫn giữ một ý điểm đối xứng theo mô tả; nếu bám đề thật thì bỏ ý đó.
- C2.3.3: bỏ "hình chữ nhật diện tích bằng k" và "a, b theo hai tiệm cận" của v1 vì mô tả dạng mới và câu đề không hỏi.


### HS-F.txt
- Nguồn: hồ sơ NBV 12-5 và Từ Tâm (thư mục ho-so của k12-hs), PNL Bài 1 Dạng 03 bản GV; trạm soát đã trích thêm Word NBV 12-1, 12-2, 12-5 (A. LÝ THUYẾT) và 12-5 (B. TỰ LUẬN). Công thức trong Word là ảnh WMF nên chỉ đối chiếu được lời văn: tâm đối xứng là điểm có hoành độ nghiệm $y''=0$ (khớp); cực trị theo dấu $y'$ (khớp). Điều kiện đủ bằng $y''$ không có trong phần lý thuyết NBV nhưng PNL dùng, nên giữ.
- C2.2.5: lý thuyết chỉ nói đơn điệu, đúng mô tả. Khi gắn lại câu, cần chuyển khỏi C2.2.5: khoảng 11 câu cực trị theo $m$ sang C2.2.6; 2 câu "góc $OAB$ nhọn" sang C2.2.4; 2 câu GTLN theo $m$ (T1120000006683, T112010402127) sang chương GTLN–GTNN.
- C2.2.6 chỉ có 3 câu đề thi thật (xác suất hai trùng phương, cực tiểu $A(2;-2)$ của hàm bậc bốn, cực đại tại $0$ của $x^{12}+\dots$). Lý thuyết đã có luật hạng tử bậc thấp nhất (đã thử bằng máy với câu $x^{12}$: đúng 9 giá trị) nhưng chưa có ví dụ cho kiểu này.
- C2.2.4: đề có 1 câu "$MA+MB$ nhỏ nhất với $M$ trên đường thẳng qua hai cực trị" (dùng điểm đối xứng, kiến thức lớp 10), lý thuyết chưa có.


### HS-G.txt
- Sách tham khảo: văn bản chữ trích sẵn ở `S\txt\` chỉ có 4 tệp PNL (Bài 1 Dạng 03, Bài 5 Dạng 01), không có phần của nhóm này. Đã đọc thay bằng hồ sơ nguồn tóm tắt ba tác giả trong `kho-rules/dai/lo/k12-hs/ho-so/`: `hoso-nbv-1-2.md` (kiểu C9, C15, C19, C21–C22, Đ16', Đ22–Đ27), `hoso-nbv-3-4.md` (T14, hàm hợp 1/(f+m)), `hoso-nbv-5-6-7.md` (5.13), `hoso-tutam.md` (K7a, K7b, K5), `hoso-pnl-1-2.md`, `hoso-pnl-3-5.md`; chưa mở trực tiếp ba bộ sách ở thư mục `K12`. Nội dung cũ tái dùng làm gốc (đã đổi số, viết lại theo dạng mới, thử lại bằng số): `ra/J13.txt` (H5.2.3, H5.3.3), `ra/J3.txt` (H2.4.6), `ra/J1.txt` (H1.4.1, H1.4.2, H1.5.6), `ra/J3.txt` (H2.3.3, H2.6.1–H2.6.3), `ra/J4.txt` (H3.1.3, H3.3.1–H3.4.2), `ra/J5.txt` (H4.3.4).
- Trạm soát đã đối chiếu thêm sách (bản trích chữ trong `S\sach\hsd\` — NBV lý thuyết tiệm cận, PNL tiệm cận Dạng 1–4 — và `S\sach\gtln\` — NBV, PNL Dạng 1, Từ Tâm Dạng 1–5): NBV ghi điều kiện "tử không chia hết cho mẫu" cho hàm bậc hai trên bậc nhất; PNL và Từ Tâm đều coi mẫu có nghiệm kép là một tiệm cận đứng; PNL có kiểu đồ thị $f'$ kèm đẳng thức giữa các giá trị của $f$; Từ Tâm Dạng 4 có kiểu phương trình, bất phương trình chứa $m$ dùng GTLN, GTNN.
- C2.4.1: đề thi thật có câu thực tế (máy bay, đường trượt) đọc hệ số từ hình; chưa đưa ví dụ thực tế vì cùng kỹ thuật với hai ví dụ. Câu trắc nghiệm tâm đối xứng từ đồ thị (T112000000279) máy xếp vào dạng này nhưng cùng bản chất C2.4.2.
- C2.4.3: kiểu "đơn điệu có tham số" (đề có 2 câu, một câu xúc xắc) và "diện tích hình chữ nhật" chỉ có ở lý thuyết, chưa có ví dụ. Hàm suy biến (tử chia hết mẫu): đáp án đề thật T112010102243 (bằng 3) tính cả giá trị $m=3$ làm hàm thành $y=x+1$ — lý thuyết đã ghi theo đáp án đó.
- C2.5.2: hai ví dụ phủ $f(x)+ax$ (có điểm tiếp xúc) và $f(|x|)$ có tham số; $f(u(x))$ (đề có 4 câu), $f^3-3f^2+2$ và $|f(\ldots)|$ chỉ ở lý thuyết.
- C2.5.3: dạng gộp bốn kiểu; ví dụ 1 = tham số trong công thức (8/14 câu đề), ví dụ 2 = đồ thị $f'$ kèm đẳng thức (2/14). Kiểu hàm hợp $f(u)+m$ từ đồ thị (1/14), phương trình–bất phương trình chứa $m$ (2/14), biểu thức nhiều biến (2/14) chỉ ở lý thuyết.
- C2.5.4: kiểu $\dfrac{h(x)}{\text{biểu thức của }f}$ (đề có 3/10 câu) và mẫu chứa căn (2/10) chỉ ở lý thuyết, chưa có ví dụ.


### HS-H.txt
- Đã đọc: hồ sơ ba tác giả cho chương Hàm số (`hoso-nbv-5-6-7.md` mục 5.9–5.11, 6.10–6.12, TN/ĐS/TLN của 12-7; `hoso-tutam.md` Dạng 8 sự tương giao và K6–K8 hình học tiệm cận; `hoso-pnl-3-5.md` mục 3.1.h, 3.3.c, 3.4.a, 4.3.e–f) cùng bản v1 đã soát (`ra/J6.txt` mục H4.5.2–H4.5.4, `ra/J7.txt` H6.1, `ra/J8.txt` H6.2–H6.3); nguồn văn bản gốc `txt\nbv`, `txt\tutam`, `txt\pnl` ở máy này gần như rỗng (chỉ có 2 tệp PNL) nên không đọc được thêm chương sách gốc. Mọi ví dụ đều tự giải lại và thử bằng số (`soan/HS/thu-H.mjs`).
- Trạm soát (03/11) đã đọc thêm sách gốc: PNL Bài 04 Dạng 04 (ứng dụng khảo sát vào bài thực tế: hồ, đảo, đường), NBV 12-6 A. Lý thuyết + F. Nâng cao (hàm hữu tỉ, khoảng cách tới tiệm cận), Từ Tâm C1-B4-P2 (tiếp tuyến, tổng khoảng cách tới tiệm cận).
- C3.1.2: bảng ánh xạ xếp vào dạng này nhiều câu "giao điểm với hai trục" (vd tính $2a+3b$) — theo mô tả cây, loại câu đó thuộc C3.1.1, nên ví dụ 2 b) đã đổi sang "$y=m$ không cắt đồ thị phân thức" (cũng là câu đề thật của dạng). Nếu muốn các câu "giao với trục" ở lại C3.1.2 thì cần sửa mô tả một trong hai dạng.
- C3.1.3: đề thật chỉ hỏi tính $y_1+y_2$, $MN$, $OM$, giới hạn hoành độ giao điểm — không có câu tìm tham số; đã bỏ ví dụ "tìm $m$ để trung điểm thuộc đường thẳng" và phần trung điểm/$x_1^2+x_2^2$ trong lý thuyết, thay bằng ví dụ $y_1+y_2$ + giới hạn $a_n$.
- C3.3.1: phần lớn câu đề thi là bài thực tế (hồ, sông, đảo, quỹ đạo); ví dụ 2 đã đổi thành bài hồ nước – con đường (có hình), đáp số làm tròn ra mét như đề thật.
- C3.3.2: ví dụ 2 b) dùng công thức $\tan\varphi=1/|k|$ cho góc giữa tiệm cận đứng và tiệm cận xiên; không dùng điểm uốn hay đạo hàm cấp hai.
- Dạng C3.2.2 chỉ có 2 câu đề thi (cả hai mức VDC: $IA^2+IB^2$ cho trước, chu vi nhỏ nhất); ví dụ 2 theo kiểu chu vi nhỏ nhất, ví dụ 1 là tính chất nền (trung điểm, diện tích không đổi) mà cả hai câu đề đều dùng.


### HS-I.txt
- Đã đọc: hồ sơ nguồn `ho-so/hoso-pnl-3-5.md` (các bảng kiểu câu Bài 5, B4-D4, B3-D4), `hoso-nbv-3-4.md`, `hoso-tutam.md` (các dạng thực tế), và bản chữ PNL Bài 5 GV (`txt/pnl/BAI 5. UDDH GIAI BAI THUC TE/..._GV.txt`, phần lý thuyết tốc độ thay đổi và tối ưu); không trích lại Word gốc ba bộ sách vì hồ sơ và bản chữ đã có. Đối chiếu câu đề thi thật bằng `cau-dang.cjs HS C4.1.x/C4.2.x` (tổng 68, 15, 27, 29, 133, 58, 16 câu). Lấy gốc từ bản v1 đã soát `ra/J9.txt` (H7.1, H7.2) và `ra/J10.txt` (H7.8), viết lại theo dạng mới, đổi toàn bộ số liệu và tự thử lại bằng node (`soan/HS/thu-HS-I.mjs`, 20 phép kiểm, tất cả đạt, gồm quét lưới GTLN/GTNN, đối chiếu hình học trực tiếp cho khối chóp và đối chiếu vật lí cho bài nồng độ).
- Trạm soát (Opus, 03/11) đã đối chiếu thêm Word gốc PNL Bài 5 Dạng 02 (tối ưu đơn giản) và Dạng 03 (tăng trưởng, tiệm cận) bản GV — trích ở `S/sach/hsI/`; bản chữ `txt/pnl/BAI 5` trạm soạn dùng thực ra chỉ có Dạng 01. Quy trình 3 bước của PNL khớp ##PP nhóm C4.2; công thức trong sách là ảnh WMF nên chỉ đối chiếu được kiểu bài và cách đặt ẩn. Từ Tâm không có bài riêng cho toán thực tế; NBV để ở tệp nén `17 CĐ TOÁN THỰC TẾ 12 2026.rar` (không giải nén).
- C4.1.2: đã thêm ý b) ở ví dụ 2 cho kiểu đề "tham số $m$ nguyên để chi phí giảm liên tục" (1/15 câu đề). Câu đề gốc ($\dfrac{x^2-mx+9}{9x-9m}$, $x\in(50;53)$) cho đáp án $m\in\{50;53\}$, nhưng với $m=53$ chi phí âm khi $x$ gần $53$ (mẫu âm) — đề gốc bỏ qua miền thực tế; ví dụ đã đặt điều kiện $x>m$ để tránh ca này.
- C4.1.3: một số câu đề thi dùng hàm mũ ($C(x)=100e^{0{,}001x}$, giải bất phương trình mũ bằng lôgarit — kiến thức lớp 11), hàm căn ($10\sqrt v-v$) hoặc thuế suất chia khúc; ví dụ chỉ dùng tam thức và phân thức đưa về tam thức. CEO quyết có cần thêm ví dụ mũ không.
- C4.1.4: đề thi có mô hình $e^{-kt}$ (quần thể tảo, nấm men), ví dụ 1 phần a) đã dùng $\lim e^{-kt}=0$; không dùng đạo hàm của hàm mũ trong ví dụ. Câu đề dựa trên phương trình vi phân $y'=-ky^2$ (một câu) để ngoài.
- C4.2.1: bài khối chóp từ tấm bìa (đề gặp nhiều lần, cạnh 6 dm, đáp án 7,3) là ví dụ 2 với cạnh 8 dm; trạm soát dựng lại bằng toạ độ (E, F trên đoạn nối tâm với trung điểm cạnh, AE = BE, trung đoạn = BM) — khớp $V_{\max}=\dfrac{2048\sqrt{10}}{375}\approx17{,}27$ và khi thu nhỏ về cạnh 6 cho 7,29 ≈ 7,3 như đề. Đề đã viết lại để hiểu được không cần hình (đặt tên tam giác cắt bỏ, vị trí E, F, G, H). Bài tám phần tám khối cầu chỉ ở lý thuyết (1 câu đề).
- C4.2.2: dạng "đường thẳng qua điểm cố định cắt hai trục/hai bờ, diện tích tam giác nhỏ nhất" (2 câu đề thi) mới có công thức trong lý thuyết, chưa có ví dụ. Ẩn là góc ($S=R^2\sin2\alpha$) chỉ có trong lý thuyết; ví dụ dùng ẩn độ dài.
- C4.2.3: câu đề cổng parabol tính **chi phí theo diện tích phần parabol** (tích phân) và câu "khoảng cách từ điểm trên bờ hồ đến con đường" (công thức khoảng cách điểm–đường thẳng) chưa có ví dụ. Ví dụ 2 đổi sang kiểu "cột đỡ $MN$ thẳng đứng giữa đường cong và đường thẳng" (đề: cầu qua hẻm núi, dây đèn công viên).


### HS-J.txt
- Nguồn đã đọc: trạm soạn dùng hồ sơ `ho-so/hoso-nbv-3-4.md`, `hoso-nbv-5-6-7.md`, `hoso-pnl-1-2.md` và bản v1 `ra/J10.txt` (H7.4.1-4). Trạm soát đã trích và đối chiếu thêm PNL "Bài 05_Dạng 04. Bài toán kinh tế và tối ưu hóa trong sản xuất_GV" và Từ Tâm "C1-B2-GTLN-GTNN-P2" (công thức trong sách là ảnh WMF nên chỉ đối chiếu được lời văn và cách giải); hồ sơ `hoso-tutam.md` (cá hồi ngược dòng, ý nghĩa tiệm cận của chi phí trung bình).
- Ánh xạ câu đề lệch dạng (cần gắn lại khi gắn câu): T112020401351 (thuế đặc biệt, đáp 800) đang ở C4.4.1, đúng là C4.4.5; T112020401004 (tàu cao tốc, đáp 130) đang ở C4.4.2, đúng là C4.4.6. Cùng kiểu: thuế phụ thu hai tầng T112020401113, T112020401201, T112020401261, T112020401370 đang ở C4.4.2 → C4.4.5; chi phí/nhiên liệu theo vận tốc T1120000004272, T112020401092, T112020401112, T112020401136, T112020401143, T112020401172 (C4.4.2) và T1120000003719 (C4.4.3) → C4.4.6.
- C4.4.2: đề thật có câu cho chi phí biên và HỎI GIÁ TRỊ lợi nhuận (T1120000001127, cần nguyên hàm để tìm $C(x)$, ngoài chương) nên ví dụ chỉ hỏi sản lượng.
- C4.4.3: câu "chi phí trung bình không thấp hơn $a$" (hàm $a+c/x$) là giới hạn, không có giá trị nhỏ nhất đạt được; T112020401365 lại hỏi "chi phí trung bình TỐI ĐA" với đáp 250 (chính là giới hạn) — đề viết sai chữ.
- C4.4.6 chỉ có 2 câu đề trong ánh xạ hiện tại; lý thuyết đã bổ sung các kiểu của 7 câu vận tốc đang nằm nhầm ở C4.4.2/C4.4.3 (chi phí theo km, đi rồi về, lợi nhuận tiền vé, đổi W sang kWh).


### HS-K.txt
- Sách đã đọc: hồ sơ trích sẵn `k12-hs/ho-so/hoso-pnl-3-5.md` (PNL Bài 5: B5-D1 tốc độ thay đổi, B5-D2 tối ưu hình học/vật lí, B5-D3 tăng trưởng, B5-D5 tốc độ liên quan), `hoso-nbv-3-4.md` (NBV 12-3: K11 GTLN của đạo hàm, K16 đường đi hai môi trường, K17 thang qua góc L, K18 khoảng cách đến đồ thị), `hoso-nbv-5-6-7.md` (5.12, 6.15), `hoso-tutam.md` (Dạng thực tế Từ Tâm); lý thuyết gốc PNL Bài 5 dạng 01 bản GV `S\txt\pnl\BAI 5. UDDH GIAI BAI THUC TE\…_GV.txt`; bản v1 đã soát `k12-hs/ra/J9.txt`, `J10.txt` (mã H7.3, H7.5, H7.6, H7.7) làm gốc rồi viết lại theo dạng mới. Không trích lại Word gốc.
- Trạm soát (03/11) đọc thêm sách Word PNL Bài 5 bản GV: Dạng 02 (tối ưu đơn giản — có bài gara, hành lang chữ L), Dạng 03 (tăng trưởng, logistic), Dạng 05 (tốc độ liên quan — có thang trượt, ra đa) — trích ra `S\sach\b5\pnl-d2.md`, `pnl-d3.md`, `pnl-d5.md` (công thức trong sách là ảnh WMF nên chỉ đọc được lời, phần công thức tự dựng lại).
- C4.3.3: tên/mô tả dạng có "góc nhìn lớn nhất" nhưng 16 câu đề thật của dạng không có câu góc nhìn nào (thang qua hàng rào/mái che ~9, sào hành lang/cọc góc hồ/đường qua điểm ~5, gara ô tô 3, độ chiếu sáng 1). Đã bỏ phần góc nhìn, thêm khung NX + ví dụ 3 cho bài gara (đề thật đáp số $3{,}7$). Đề nghị đổi tên dạng thành "Thang, sào, xe qua góc; độ chiếu sáng lớn nhất".
- C4.3.2: dạng gồm nhiều kiểu (trạm bơm/trạm dừng cùng phía bờ ~9 câu, hai vật chuyển động ~5, khoảng cách điểm–đường cong/hai đường cong ~6, cầu qua sông 4, ống dẫn chữ Y 4, gấp giấy 2…). Ví dụ làm 2 kiểu: hai vật (ví dụ 1) và trạm cùng phía cho $AB$ (ví dụ 2, thay ví dụ cầu của bản soạn vì đề hỏi kiểu này nhiều hơn; cầu vẫn nêu ở lý thuyết và chú ý).
- C4.3.2: không có radar/vùng phủ sóng theo ranh giới VT (Thùy chốt).
- C4.3.1: đề thi có thêm câu robot đi qua bãi cát chữ nhật (3 vùng, 2 vận tốc) và "xuất phát muộn nhất lúc mấy giờ"; chưa có ví dụ riêng (cùng PP, thêm cộng thời gian).
- C4.5.1: câu Hubble có hai bộ hệ số. Bản $v(t)=0{,}001302t^3-0{,}09029t^2+23$ (T1120000003566 đáp số $23$; T1120000006707 đáp số $23{,}1$) khớp nguồn Larson ($a'(t)=0\Leftrightarrow t\approx23{,}1$). Bản $-0{,}08029t^2$ (T1120000006168, T112020402008, hỏi độ dài khoảng gia tốc tăng, đáp số $105$) nghi gõ sai hệ số: với $0{,}09029$ thì đáp số phải là $126-23{,}1\approx103$. Ngoài ra cả 4 câu ghi "$+23$" trong khi nguồn là "$+23{,}61t-3{,}083$" (không ảnh hưởng đáp số vì chỉ dùng $v''$). Không dùng mô hình này làm ví dụ; đã thêm vào lý thuyết ý "cho sẵn $v(t)$, gia tốc tăng khi $v''>0$".
- C4.6.2: ví dụ 1 bản soạn dùng $-t^3+15t^2$ trùng đề thật T1120000005872 ($15t^2-t^3$) và có tốc độ âm cuối đoạn (số người nhiễm tích luỹ giảm) — trạm soát đổi thành $-t^3+21t^2$, $0\le t\le14$.
- C4.6.3 (hiếm): 9 câu đề thật đều là bể/chậu (nón, nón cụt có bi, lăng trụ có khối cầu, đáy nghiêng, thùng parabol) + 1 kiến trên thanh trượt + 1 mô tô trong $Oxyz$; không có câu thang trượt thuần — giữ thang trượt vì mô tả dạng nêu tên. Chưa có ví dụ bể có vật chắn (cần thể tích chỏm cầu).
- Mọi ví dụ đã thử lại bằng số (trạm soạn: `S\soan\HS\thu-K.mjs`; trạm soát: `S\soat\HS-K\kiem.cjs`, `gara.cjs`); đồ thị ví dụ 2 của C4.5.2 vẽ theo $s=-t^3+6t^2$ (cực đại $(4;32)$).

