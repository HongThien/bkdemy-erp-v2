# Brief trạm SỬA — lý thuyết + ví dụ bản đồ mới khối 11 theo file lỗi của Thùy (16/10)

> Thùy 16/10 gửi file *"Các lỗi cần sửa trong lý thuyết, ví dụ lớp 11"* (26 ảnh chụp màn hình) và nói *"Sửa lại lý thuyết"*. Đây là bản sửa của nội dung đã ghi 15/10.
> `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\bdm\k11` · `<LUOT>` = B1…B6 · Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Đọc thêm brief gốc `brief-soan.md` (khuôn, kiến thức, thử bằng máy) — mọi luật ở đó VẪN ÁP, dưới đây là phần THÊM / THAY.
> KHÔNG ghi DB, KHÔNG sửa Repo. Bạn ghi `<LV>\ra\<LUOT>.v2.txt` (bằng công cụ Write) và script thử trong `<LV>\tam\<LUOT>v2\`.

## 1. Việc làm
Bản gốc đã soát: `<LV>\ra\<LUOT>.txt` (đang nằm trong DB). Bạn tạo `<LUOT>.v2.txt`: **chép lại TOÀN BỘ các khối của lượt**, đã áp (a) luật chung §2 cho MỌI lý thuyết (`@ly_thuyet`) và (b) việc riêng của lượt §4. Khối nào không đổi gì ngoài luật chung thì giữ nguyên chữ, chỉ sửa định dạng.
`@vi_du` của khối: **chỉ chép lại khi khối đó có việc riêng sửa ví dụ (§4)**; còn lại BỎ HẲN phần `@vi_du:` khỏi khối trong v2 (để không ghi đè ví dụ đã tốt). Khối chỉ sửa lý thuyết thì chỉ có `@ly_thuyet:`.
Máy kiểm (chạy từ Repo, phải lỗi 0): `node kho-rules/dai/lo/k11/ban-do/kiem.mjs "C:/Users/WBPC/bk-kho-lam-viec/bdm/k11/ra/<LUOT>.v2.txt"`.

## 2. LUẬT CHUNG của Thùy (áp cho TẤT CẢ lý thuyết; máy kiểm bắt được các điểm có dấu ⚙)
1. ⚙ **Trong `##TC` đầu dòng dùng dấu chấm tròn "• " (ký tự •), KHÔNG dùng "- "** ("gạch đầu dòng dễ bị học sinh hiểu thành dấu trừ").
2. ⚙ **Mỗi công thức một dòng riêng** ("để hết trên một dòng nhìn rối mắt"): dòng `##TC` có ≥ 3 cụm `$…$` bị báo lỗi. Tách: "• Hai góc đối: " là dòng tiêu đề nhỏ không công thức thì được; công thức nằm các dòng dưới, mỗi dòng một công thức (hoặc một đẳng thức chuỗi $a=b=c$).
   Một đẳng thức có điều kiện đi kèm vẫn một dòng ("$\tan 2a=\dfrac{2\tan a}{1-\tan^2 a}$ (khi $\cos a\ne0$ và $\cos 2a\ne0$)").
3. **Bảng công thức đảo pha / liên quan đặc biệt: MỖI CẶP GÓC LÀ MỘT KHUNG `##TC` RIÊNG** (tiêu đề khung = tên cặp góc, vd `##TC Hai góc đối nhau ($-\alpha$)` — ⚠ tiêu đề `##TC` được chứa công thức, tiêu đề `##PP` thì KHÔNG), mỗi khung đúng **4 dòng**: $\sin$, $\cos$, $\tan$, $\cot$ (dòng $\tan$, $\cot$ ghi điều kiện xác định nếu cần). Cặp góc: đối ($-\alpha$) · bù ($\pi-\alpha$) · hơn kém $\pi$ ($\alpha+\pi$) · phụ ($\dfrac\pi2-\alpha$) · hơn kém $\dfrac\pi2$ ($\alpha+\dfrac\pi2$). Áp cho MỌI dạng dùng bảng này (không chỉ dạng nhận diện): NDB00951, 00952, 00949, 00953, 00954, 00955, 00956 và bất kỳ dạng nào khác của lượt có chép bảng đảo pha.
4. ⚙ **Tiêu đề `##PP` KHÔNG chứa công thức `$…$`** (app không hiện, chữ tiêu đề bị vỡ). Viết bằng chữ: `##PP Đọc số hạng đầu và công sai từ công thức`.
5. Giữ luật cũ: `##PP` 3–6 dòng không "Bước N"; công thức `$…$`, `\cdot`, họ nghiệm $k\in\mathbb{Z}$; không đạo hàm / giới hạn; không `$$`; không chữ nghiêng.
6. Khi cần BẢNG (xét dấu, giá trị): dùng một khung `##TC` chứa MỘT công thức mảng: `$\begin{array}{|c|c|c|c|c|}\hline … \\ \hline … \end{array}$` (cả bảng trên một dòng, các hàng cách nhau `\\`), không dùng ký tự gạch đứng thô.

## 3. HÌNH VẼ trong đề / lời giải — dòng `[[HINH:{json một dòng}]]`
Thùy: *"Các dạng bài về đồ thị / đường tròn lượng giác / góc lượng giác đều cần có HÌNH ở đề bài chứ không phải mô tả bằng lời."* Bạn KHÔNG vẽ ảnh; bạn viết dòng sau (một dòng riêng, nằm trong đề hoặc trong lời giải, không dòng trống chen), máy vẽ SVG thật khi ghi:
```
[[HINH:{"loai":"goc","gocHinhHoc":60,"quay":60,"nhanGoc":"60°"}]]
[[HINH:{"loai":"duong_tron","dauA":true,"goc4":true,"diem":[{"ten":"M","goc":210,"giong":true,"nhanGiong":["cos α","sin α"]}],"cungTuA":{"den":210,"nhan":"α"}}]]
[[HINH:{"loai":"do_thi","ham":"sin","x":[-1,2],"y":[-2,2],"buocX":0.5,"nhan":"y = sin x","diem":[{"x":0.5,"ten":"A","giong":true}]}]]
```
Đọc máy vẽ: `Repo\scripts\kho\hinh-luong-giac.mjs` (đầu file ghi đủ trường). Tóm tắt:
- `goc`: `gocHinhHoc` (độ, 0–180: góc hình học giữa tia Ou và Ov, Ov quay ngược chiều kim đồng hồ từ Ou), `quay` (độ, có dấu: mũi tên cong vẽ chiều quay thật của góc lượng giác (Ou,Ov); **phải ≡ gocHinhHoc (mod 360)**, máy kiểm), `nhanGoc` ("60°" ghi số đo góc hình học), `nhanQuay` (chữ ghi cạnh mũi tên, tuỳ chọn; dùng dấu "−" không "-"), chiều dương "+" tự vẽ.
- `duong_tron`: `diem:[{ten, goc(độ), toaDo("(−3/5; 4/5)" chữ ghi cạnh điểm, tuỳ chọn), giong(true: gióng xuống trục), nhanGiong:["cos α","sin α"]}]`, `dauA`, `cungTuA:{den,nhan}`, `goc4` (ghi I–IV), `chia:[độ…]` (chấm nhỏ đánh dấu cung), `nhanTruc`.
- `do_thi`: `ham` sin|cos|tan|cot, `a,w,p,k` (đồ thị $y=a\,F(w x+p\pi)+k$, **x tính theo bội của π**), `x:[x0,x1]`, `y:[y0,y1]` (số nguyên, khung chứa gốc), `buocX` (bội π), `diem:[{x,ten,giong}]` (điểm PHẢI nằm trên đồ thị — máy kiểm), `them:[{ham,a,w,p,k,nhan}]` (đồ thị thứ hai…), `ngang:[{y,nhan}]` (đường thẳng $y=c$), `anNhanX`.
- **Đề phải KHỚP HÌNH** (số đo, toạ độ, điểm đặt tên đúng như hình). Đề nói "như hình vẽ" thì hình đủ dữ kiện để làm bài; lời giải đọc dữ kiện từ hình (nêu rõ "Từ hình vẽ, ta thấy …"). Hình tiệm cận / khoảng đồng biến: đồ thị phải đúng hàm đề nói.
- Kiểm nhanh khi soạn: bạn có thể vẽ thử ra PNG để xem: `node scripts/kho/hinh-luong-giac.mjs <mo-ta.json> <ra-khong-duoi>` (file json là NỘI DUNG sau `[[HINH:` có thêm `"loai"`), rồi mở PNG bằng công cụ Read để nhìn bố cục (nhãn chồng nhau thì đổi `goc`/`x`).

## 4. VIỆC RIÊNG THEO LƯỢT
Dưới đây là yêu cầu NGUYÊN VĂN của Thùy (rút gọn). Chỗ nào ghi "đọc mô tả mới" thì mô tả hiện hành ở `<LV>\<mã dạng>.md` (đã làm mới 16/10).

**B1**
- `NDB00565` (mô tả: *Xác định số đo của góc lượng giác cho bởi hình vẽ*): ví dụ có HÌNH `goc` ở đề; **chỉ bài đơn giản: cho một góc (hình vẽ), hỏi số đo các góc lượng giác (Ou,Ov)** — kiểu "Cho góc hình học uOv có số đo 60° như hình vẽ. Số đo của các góc lượng giác (Ou,Ov) là ..." (4 phương án hoặc tự luận). Làm lại cả 2 ví dụ (ví dụ 2 có mũi tên chiều quay âm). Lý thuyết giữ, chỉnh theo luật chung.
- `NDB00569` (điểm biểu diễn): ví dụ có HÌNH đường tròn lượng giác minh hoạ ở đề (điểm trên đường tròn có đánh dấu; hỏi biểu diễn góc nào / thuộc góc phần tư nào…). Làm lại cả 2 ví dụ.
- `NDB00945` (xác định GTLG của góc dựa vào toạ độ điểm biểu diễn): **THÊM một ví dụ (ví dụ 3)** cho điểm có toạ độ ghi trên HÌNH đường tròn lượng giác (điểm $M\left(-\dfrac35;\dfrac45\right)$ kiểu hình có `toaDo`), đề nói "như hình vẽ". Giữ hai ví dụ cũ → file v2 phải chứa đủ 3 `##VD` (chép nguyên ví dụ 1, 2 từ bản gốc).
- `NDB00946` (xác định dấu GTLG): lý thuyết **thêm BẢNG XÉT DẤU** của $\sin,\cos,\tan,\cot$ theo bốn góc phần tư (một khung `##TC Bảng xét dấu`, luật chung §2.6); phần còn lại chỉnh theo luật chung.
- `NDB00951` (nhận diện đảo pha), `NDB00952`, `NDB00949`, `NDB00953`, `NDB00954`, `NDB00955`, `NDB00956`: luật chung §2.3 (mỗi cặp góc một khung 4 dòng) ở dạng nào có bảng.
- Mọi dạng còn lại của B1: luật chung §2.1, §2.2, §2.4.

**B2**
- `NDB00986` (mô tả mới: *Bài toán thực tế tổng hợp 2 dao động CÙNG BIÊN ĐỘ*): **đổi cả lý thuyết lẫn ví dụ**: chỉ xét hai dao động cùng biên độ, $x_1=A\sin(\omega t+\varphi_1)$, $x_2=A\sin(\omega t+\varphi_2)$ (hoặc $\cos$); áp dụng **công thức tổng thành tích** $\sin a+\sin b=2\sin\dfrac{a+b}2\cos\dfrac{a-b}2$ (và $\cos a+\cos b$) để ra biên độ tổng hợp $2A\left|\cos\dfrac{\varphi_1-\varphi_2}{2}\right|$ và pha. KHÔNG dùng công thức $\sqrt{a^2+b^2}$ / $\tan\varphi=b/a$ tổng quát. Làm lại 2 ví dụ cùng loại (số đẹp).
- Nhóm `NNB01540` (Bài toán thực tế sử dụng công thức lượng giác): lý thuyết nhóm NẰM TRONG tệp `<LV>\ra\N1.txt` (khối `=== NNB01540`) — bạn viết lại khối này theo ý trên và cho vào file riêng `<LV>\ra\N1b.v2.txt` (khuôn `=== NNB01540` + `@ly_thuyet:`).
- Mọi dạng B2: luật chung §2.1–§2.4. Chú ý các dạng nhận dạng / công thức: bảng công thức phải xuống dòng từng công thức.

**B3**
- Ba dạng CEO viết tay mà thiếu thẻ: `NDB00994`, `NDB00996`, `NDB00997` (và `NDB01021` thuộc B5): chữ gốc nằm ở `<LV>\cu\<mã>.md` (mục LÝ THUYẾT). Việc: **giữ nguyên nội dung của Thùy**, chỉ gắn thẻ `##TC` / `##PP <tên>` / `##CY` đúng khuôn và theo luật chung (• đầu dòng, mỗi công thức một dòng, tiêu đề ##PP không công thức). Phần "Ví dụ minh họa" trong chữ cũ KHÔNG đưa vào lý thuyết (đã nằm ở `@vi_du` của bản gốc) — nếu cần giữ thì để nguyên ví dụ ở `@vi_du` hiện có, không ghi lại. Viết 3 khối này vào v2 với đủ `@ly_thuyet:` (không có `@vi_du:`).
- `NDB00999` và `NDB01000` (min–max hàm lượng giác bậc 2): **chỉ cần so sánh 3 giá trị của hàm số tại $t=-1$, $t=1$ và $t=t_0$ (đỉnh)** (nếu $t_0$ thuộc đoạn); **KHÔNG nhắc tính đồng biến, nghịch biến của hàm bậc hai**. Sửa cả lý thuyết lẫn 2 ví dụ ở cả hai dạng (dạng có điều kiện của biến: đoạn $[t_1;t_2]$ thay cho $[-1;1]$, so sánh $f(t_1),f(t_2),f(t_0)$). Đọc mô tả mới ở hồ sơ.
- Dạng thuộc nhóm đồ thị (`NNB01142`): `NDB01003`, `NDB01004`, `NDB01005`, `NDB01022`, `NDB01002` (và `NDB01006` nếu đề có thể kèm hình): **MỌI ví dụ phải có HÌNH đồ thị `do_thi` ở đề bài** ("không mô tả đồ thị bằng lời"), đề hỏi đọc từ hình: đơn điệu (khoảng hình), chu kỳ (hai điểm đánh dấu), điểm thuộc đồ thị (điểm trên hình), nhận diện đồ thị (chỉ đưa hình, hỏi là đồ thị hàm nào / bốn hình A–D cho trắc nghiệm → có thể 4 dòng `[[HINH]]` ghi nhãn "Hình A"… trong đề, mỗi hình một dòng). Lời giải nêu đúng điều đọc được từ hình. Làm lại 2 ví dụ mỗi dạng.
- Các dạng B3 còn lại: luật chung.

**B4**
- `NDB01014` (đã đổi tên: *Giải PTLG dạng $\sin u\pm\cos v=0$*; mô tả mới ở hồ sơ): **bị hiểu nhầm — đọc mô tả mới, viết lại toàn bộ lý thuyết + 2 ví dụ.** Ý đúng: phương trình dạng $\sin u+\cos v=0$ hoặc $\sin u-\cos v=0$ với $u$, $v$ là biểu thức của $x$ (có thể giống nhau hoặc khác nhau, vd $\sin 3x+\cos 2x=0$ chứ không chỉ $\sin x+\cos x=0$); **cách làm: chuyển vế rồi dùng công thức đảo pha (góc phụ $\cos v=\sin\left(\dfrac\pi2-v\right)$, góc đối…) để đưa về phương trình $\sin A=\sin B$ hoặc $\cos A=\cos B$ cơ bản**, KHÔNG chia cho $\cos u$.
- `NDB01015` (hạ bậc): **ví dụ 1 đổi thành ví dụ phức tạp hơn** — ví dụ cũ ($\sin^2x=\dfrac14$) lấy căn hai vế là xong, không cần hạ bậc. Chọn đề mà muốn gọn phải dùng công thức hạ bậc (vd $\sin^2 x+\sin^2 3x=\dfrac32$ hoặc $\cos^2x-\sin^2... $ tuỳ bạn, nhưng phải thật sự cần hạ bậc). Ví dụ 2 giữ như bản gốc nếu vẫn hợp, kiểm lại mức khó.
- `NDB01023` (**mới có mô tả**: *Thường là bài trắc nghiệm 4 đáp án, đề cho 4 phương trình lượng giác, hỏi phương trình nào vô nghiệm*) và `NDB01025` thuộc B6: dạng B4 này chưa có gì ⇒ soạn đủ `@ly_thuyet` + `@vi_du` (2 ví dụ trắc nghiệm 4 đáp án A–D, mỗi đáp án một phương trình: $\sin x=m$ với $|m|>1$, $a\sin x+b\cos x=c$ với $c^2>a^2+b^2$, $\cos x=\dfrac{\sqrt3}{...}$ kiểu… đủ loại; lời giải kiểm từng đáp án). Lý thuyết: điều kiện có nghiệm của các phương trình cơ bản và $a\sin x+b\cos x=c$ (**$c^2\le a^2+b^2$**, đã học trong nhóm hàm lượng giác mở rộng), $\tan x=m$ / $\cot x=m$ luôn có nghiệm.
- `NDB00581` ("Xác định PTLG từ điểm biểu diễn nghiệm") và `NDB00582` ("Giải PTLG và biểu diễn nghiệm trên đường tròn LG"): **cần HÌNH đường tròn lượng giác có các điểm biểu diễn**. 00581: hình ở ĐỀ (các điểm biểu diễn nghiệm đánh dấu, hỏi phương trình). 00582: đề giải PT, **hình ở LỜI GIẢI** vẽ các điểm biểu diễn nghiệm (`duong_tron` với `diem` có `goc` đúng nghiệm trong $[0;2\pi)$). Làm lại 2 ví dụ mỗi dạng. Lý thuyết chỉnh theo luật chung (sửa luôn câu chữ nếu thấy lệch).
- `NDB00584` ("Tìm số lượng giao điểm của 2 đồ thị **dựa vào đồ thị**"): **ví dụ phải có HÌNH đồ thị ở đề** (vd `do_thi` hàm sin hoặc cos kèm `ngang` $y=c$ hoặc `them` hàm thứ hai) rồi đếm giao điểm trên đoạn đề cho; lời giải đọc từ hình (có thể đối chiếu bằng phương trình). Làm lại 2 ví dụ; chỉnh lý thuyết cho đúng ý "đếm theo hình".
- Mọi dạng B4: luật chung.

**B5**
- `NDB01021` (CEO viết tay thiếu thẻ): như `NDB00994` ở B3 — chữ gốc ở `<LV>\cu\NDB01021.md`, giữ nội dung, gắn thẻ ##TC / ##PP / ##CY theo luật chung; chỉ `@ly_thuyet:`.
- `NDB00610` — LỖI CODE LATEX: tiêu đề `##PP` có `$…$` bị vỡ ⇒ luật chung §2.4; **rà TOÀN BỘ dạng của lượt B5** xem tiêu đề ##PP nào còn có `$`.
- Mọi dạng B5: luật chung (• , mỗi công thức một dòng).

**B6**
- `NDB01025` (**mới có mô tả**: *Tìm x để 3 số lập thành cấp số nhân*; dạng "tham khảo"): chưa có gì ⇒ soạn đủ `@ly_thuyet` + `@vi_du` (2 ví dụ): ba số $a,b,c$ lập thành CSN ⇔ $b^2=ac$ (chú ý các số khác 0 / công bội), ví dụ tìm $x$ để $x+1,\,2x,\,x+7$… hoặc ba số có tổng cho trước; kiểm nghiệm bằng cách thế lại, nêu rõ loại nghiệm làm ba số có số 0. Đọc mô tả ở hồ sơ.
- Dạng `NDB01027` đã được CEO đổi tên/mô tả chưa? Đọc hồ sơ `<LV>\NDB01027.md` — nếu tên còn là "cấp số cộng" thì vẫn soạn theo cấp số nhân như bản gốc (đừng đổi).
- Mọi dạng B6: luật chung. Tiêu đề ##PP không công thức.

**N** (lý thuyết NHÓM — khi lượt của bạn được giao N1 riêng; xem lời giao)

## 5. Trả lời cuối (≤ 120 từ)
Số khối trong v2 · số lý thuyết / ví dụ đã viết lại · máy kiểm lỗi 0 chưa · các hình đã vẽ thử bằng PNG và nhìn chưa · điểm ít chắc (mỗi điểm một dòng) · mục `## GHI CHÚ CHO CEO` cuối tệp (không có thì ghi "Không").
