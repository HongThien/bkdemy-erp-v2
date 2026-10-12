# NGUỒN — NBV "12-18. Ứng dụng TP tính diện tích – thể tích" · F. Bài tập nâng cao · DẠNG 2 (thể tích)

> Bản trích máy (chưa sửa tay) phục vụ `spec-day-hinh-3d.md`. **Đừng sửa nội dung bên dưới** — lỗi của nguồn đã ghi ở spec §C.11.
> - File gốc (máy công ty, ổ Drive): `E:\BK ACADEMY\Tài liệu tham khảo\K12\TOAN 12 NBV NEW FULL\TOAN 12 NBV NEW FULL\12-18. UNG DUNG TP TINH DIEN TICH-THE TICH\12-18. UNG DUNG TP TINH DIEN TICH-THE TICH\F. BAI TAP NANG CAO.docx` (cạnh có bản `- CH.docx` = chỉ đề).
> - Trích bằng `node scripts/kho/mathtype-thu/doc-docx.mjs "<file>" --ra <thư mục>` (MathType → LaTeX: 1321/1327 công thức đọc được; 6 hỏng ghi `[[EQ-FAILED…]]`).
>   Hình EMF đổi PNG bằng `scripts/anh/wmf_sang_png.ps1` (-Scale 1). Mỗi dòng = 1 đoạn Word, `[0504]` = số thứ tự đoạn trong file.
> - `[[img:imageN.xxx]]` → ảnh ở `hinh/imageN.png|jpeg` (EMF đã đổi sang .png). Các `image978–992.wmf` ở Câu 43 Cách 2 chỉ là nhãn chữ rời — không chép.
> - Dạng 1 (câu 1–42, diện tích phẳng) không chép — cần thì trích lại từ file gốc.

[0504] [[nen:cyan]]Dạng 2. Ứng dụng thể tích[[/nen]]
[0505] Câu 43. Có một cốc nước thủy tinh hình trụ, bán kính trong lòng đáy cốc là $6\,\text{cm}$, chiều cao lòng cốc là $10\,\text{cm}$ đang đựng một lượng nước. Tính thể tích lượng nước trong cốc, biết khi nghiêng cốc nước vừa lúc khi nước chạm miệng cốc thì đáy mực nước trùng với đường kính đáy.
[0506] [[img:image969.emf]][[img:image970.emf]]
[0507] [[b]]Lời giải[[/b]]
[0508] [[img:image971.png]]
[0509] [[b]]Cách 1. [[/b]]Xét thiết diện cắt cốc thủy tinh vuông góc với đường kính tại vị trí bất kỳ có: $S\left( x \right)=\frac{1}{2}\sqrt{R^{2}-x^{2}}.\sqrt{R^{2}-x^{2}}.\tan\alpha$ $\Rightarrow S\left( x \right)=\frac{1}{2}\left( R^{2}-x^{2} \right)\tan\alpha$.
[0510] Thể tích hình cái nêm là: $V=\frac{1}{2}\tan\alpha\int\limits_{-R}^{R} \left( R^{2}-x^{2} \right)\text{ d}x=\frac{2}{3}R^{3}\tan\alpha$.
[0511] Thể tích khối nước tạo thành khi nguyên cốc có hình dạng cái nêm nên $V_{kn}=\frac{2}{3}R^{3}\tan\alpha$. $\Rightarrow V_{kn}=\frac{2}{3}R^{3}.\frac{h}{R}=240\,\text{cm}^{\text{3}}$.
[0512] [[b]]Cách 2.[[/b]] Dựng hệ trục tọa độ $Oxyz$
[0513] [[img:image978.wmf]][[img:image979.wmf]][[img:image980.wmf]][[img:image981.wmf]][[img:image982.wmf]][[img:image983.wmf]][[img:image984.wmf]][[img:image985.wmf]][[img:image986.wmf]][[img:image987.wmf]][[img:image988.wmf]][[img:image989.wmf]][[img:image990.wmf]][[img:image991.wmf]][[img:image992.wmf]]
[0514] Gọi $S\left( x \right)$ là diện tích thiết diện do mặt phẳng có phương vuông góc với trục $Ox$ với khối nước, mặt phẳng này cắt trục $Ox$ tại điểm có hoành độ $h\ge x\ge 0$.
[0515] Gọi $\widehat{IOJ}=\alpha,\,\widehat{FHN}=\beta,\,OE=x$
[0516] $\tan\alpha=\frac{IJ}{OJ}=\frac{6}{10}=\frac{EF}{OE}$ $\Rightarrow EF=\frac{6x}{10}$ $\Rightarrow HF=6-\frac{6x}{10}$.
[0517] $\cos\beta=\frac{HF}{HN}=\frac{6-\frac{6x}{10}}{6}=1-\frac{x}{10}$; $\beta=\arccos\left( 1-\frac{x}{10} \right)$
[0518] $S\left( x \right)=S_{\left( hinh\,quat \right)}-S_{HMN}=\frac{1}{2}HN^{2}.2\beta-\frac{1}{2}HM.HN.\sin 2\beta$
[0519] $\Rightarrow S\left( x \right)=6^{2}\arccos\left( 1-\frac{x}{10} \right)-\frac{1}{2}.6.6.2\left( 1-\frac{x}{10} \right)\sqrt{1-\left( 1-\frac{x}{10} \right)^{2}}$
[0520] $\Rightarrow V=\int\limits_{0}^{10} S\left( x \right)\text{d}x=\int\limits_{0}^{10} \left( 36\arccos\left( 1-\frac{x}{10} \right)-36\left( 1-\frac{x}{10} \right)\sqrt{1-\left( 1-\frac{x}{10} \right)^{2}} \right)\text{d}x=240$.
[0521] Câu 44. Sân vận động Sport Hub (Singapore) là sân có mái vòm kỳ vĩ nhất thế giới. Đây là nơi diễn ra lễ khai mạc Đại hội thể thao Đông Nam Á được tổ chức tại Singapore năm $2015$. Nền sân là một elip $\left( E \right)$ có trục lớn dài $150m$, trục bé dài $90m$ (hình 3). Nếu cắt sân vận động theo một mặt phẳng vuông góc với trục lớn của $\left( E \right)$và cắt elip ở $M,N$ (hình 3) thì ta được thiết diện luôn là một phần của hình tròn có tâm $I$ (phần tô đậm trong hình 4) với $MN$ là một dây cung và góc $\widehat{MIN}=90^{0}.$ Để lắp máy điều hòa không khí thì các kỹ sư cần tính thể tích phần không gian bên dưới mái che và bên trên mặt sân, coi như mặt sân là một mặt phẳng và thể tích vật liệu là mái không đáng kể. Hỏi thể tích xấp xỉ bao nhiêu?
[0522] [[img:image1014.jpeg]] [[img:image1015.jpeg]]
[0523] [[img:image1016.emf]]
[0524] [[b]]Lời giải[[/b]]
[0525] [[img:image1017.png]]
[0526] [[img:image1018.png]]
[0527] Chọn hệ trục như hình vẽ
[0528] Ta cần tìm diện tích của $S\left( x \right)$thiết diện.
[0529] Gọi $d\left( O,MN \right)=x$
[0530] $\left( E \right):\frac{x^{2}}{75^{2}}+\frac{y^{2}}{45^{2}}=1.$
[0531] Lúc đó $MN=2y=2\sqrt{45^{2}\left( 1-\frac{x^{2}}{75^{2}} \right)}=90\sqrt{1-\frac{x^{2}}{75^{2}}}$
[0532] $\Rightarrow R=\frac{MN}{\sqrt{2}}=\frac{90}{\sqrt{2}}.\sqrt{1-\frac{x^{2}}{75^{2}}}\Rightarrow R^{2}=\frac{90^{2}}{2}.\left( 1-\frac{x^{2}}{75^{2}} \right)$
[0533] $S\left( x \right)=\frac{1}{4}\pi R^{2}-\frac{1}{2}R^{2}=\left( \frac{1}{4}\pi-\frac{1}{2} \right)R^{2}=\left( \pi-2 \right)\frac{2025}{2}.\left( 1-\frac{x^{2}}{75^{2}} \right).$
[0534] Thể tích khoảng không cần tìm là
[0535] $V=\int\limits_{-75}^{75} \left( \pi-2 \right)\frac{2025}{2}.\left( 1-\frac{x^{2}}{75^{2}} \right)\approx 115586m^{3}.$
[0536] Câu 45. Chuẩn bị cho đêm hội diễn văn nghệ chào đón năm mới bạn An đã làm một cái mũ “cách điệu” cho ông già Noel có hình dáng là một khối tròn xoay. Mặt cắt qua trục của cái mũ có hình vẽ như bên dưới. Biết rằng: $OO'=5cm,OA=10cm,OB=20cm$ đường cong $AB$ là một phần của parabol có đỉnh là điểm $A$. Thể tích của chiếc mũ bằng
[0537] [[img:image1029.png]]
[0538] [[b]]Lời giải[[/b]]
[0539] Xây dựng hệ trục tọa độ như hình vẽ
[0540] [[img:image1030.png]]
[0541] Chia khối tròn xoay trên thành 2 phần.
[0542] Phần 1 là thể tích của khối trụ có thể tích là $V_{1}$
[0543] Phần 2 là thể tích của khối tròn xoay khi quay hình phẳng giới hạn bởi $x=10-\sqrt{5y};x=0;y=0;y=20$ quanh trục $\text{O}y$ và có thể tích là $V_{2}$
[0544] Tính thể tích $V_{1}=\pi r^{2}h=500\pi(cm^{3}).$
[0545] Tính thể tích $V_{2}$
[0546] $V_{2}=\pi\int\limits_{0}^{20} (10-\sqrt{5y})^{2}\text{d}y=\pi\int\limits_{0}^{20} (100+5y-20\sqrt{5y})\text{d}y=\pi\left. (100y+\frac{5y^{2}}{2}-\frac{40(5y)^{\frac{3}{2}}}{15}) \right|_{0}^{20}=\frac{1000}{3}\pi$
[0547] Thể tích của khối tròn xoay bằng $V=V_{1}+V_{2}=\frac{2500}{3}\pi$.
[0548] [[u]]Ghi chú[[/u]]: đây là [[b]]Lời giải[[/b]] dựa theo [[b]]Lời giải[[/b]] của trường PTTH Quảng Xương. Tuy nhiên chỗ dấu bằng xảy ra chưa chỉ ra được hàm số nào thỏa.
[0549] Câu 46. Trong mặt phẳng cho hình vuông $ABCD$ cạnh $2\sqrt{2}$, phía ngoài hình vuông vẽ thêm bốn đường tròn nhận các cạnh của hình vuông làm đường kính (hình vẽ). Thể tích khối tròn xoay sinh bởi hình trên khi quay quanh đường thẳng $AC$ bằng
[0550] [[img:image1042.png]]
[0551] [[b]]Lời giải[[/b]]
[0552] Gọi $O$ là giao điểm của $AC$ và $BD$. Gắn hệ trực toạ độ $Oxy$ vào hình vẽ như bên dưới.
[0553] [[img:image1047.png]]
[0554] Gọi $I$ là trung điểm $AB$, $X$ là điểm chính giữa dây cung $AB$, $K$ là điểm chính giữa dây cung $AX$ và $L$ là hình chiếu vuông góc của $K$ lên trục $Oy$.
[0555] Khi đó $A\left( 0;2 \right),B\left( 2;0 \right),I\left( 1;1 \right),X\left( 2;2 \right)$. Đường thẳng $AX:y=2$.
[0556] Ta có $IK=R=\sqrt{2}$ và $AO=2$ suy ra $AL=\sqrt{2}-1$. Suy ra $K\left( 1;\sqrt{2}+1 \right)$.
[0557] Đường tròn đường kính $AB$ có phương trình là $\left( x-1 \right)^{2}+\left( y-1 \right)^{2}=2$.
[0558] Cung $\overset{\frown}{XB}$ có phương trình: $x=1+\sqrt{2-\left( y-1 \right)^{2}}$.
[0559] Cung $\overset{\frown}{XK}$ có phương trình: $x=1+\sqrt{2-\left( y-1 \right)^{2}}$.
[0560] Cung $\overset{\frown}{AK}$ có phương trình: $x=1-\sqrt{2-\left( y-1 \right)^{2}}$.
[0561] Gọi $H_{1}$ là hình phẳng tạo bởi dây cung $XB$, đường thẳng $AX$ và hai trục toạ độ.
[0562] Gọi $H_{2}$ là hình phẳng tạo bởi dây cung $AX$ và đường thẳng $AX$.
[0563] Gọi $V_{1},V_{2}$ lần lượt là thể tích khối tròn xoay sinh bởi hình $H_{1},H_{2}$ khi quay quanh trục $Oy$.
[0564] Ta có
[0565] [[EQ-FAILED:oleObject1127.bin:template sel=21 var=0x0030: expected 3 slots (main, lower, upper), got 4]]
[0566] Đặt $y-1=\sqrt{2}\sin t$, với $-\frac{\pi}{2}\le t\le\frac{\pi}{2}$. Suy ra $\text{d}y=\sqrt{2}\cos t\,\text{d}t$. Khi đó
[0567] [[EQ-FAILED:oleObject1131.bin:template sel=21 var=0x0030: expected 3 slots (main, lower, upper), got 4]].
[0568] Suy ra $V_{1}=\frac{16\pi}{3}+2\pi+\pi^{2}$.
[0569] Ta có $V_{2}=\pi\int\limits_{2}^{1+\sqrt{2}} \left[ \left( 1+\sqrt{2-\left( y-1 \right)^{2}} \right)^{2}-\left( 1-\sqrt{2-\left( y-1 \right)^{2}} \right)^{2} \right]\text{d}y=\pi\int\limits_{2}^{1+\sqrt{2}} 4\sqrt{2-\left( y-1 \right)^{2}}\text{d}y$.
[0570] Đặt $y-1=\sqrt{2}\sin t$, với $-\frac{\pi}{2}\le t\le\frac{\pi}{2}$. Suy ra $\text{d}y=\sqrt{2}\cos t\,\text{d}t$. Khi đó
[0571] [[EQ-FAILED:oleObject1137.bin:template sel=21 var=0x0030: expected 3 slots (main, lower, upper), got 4]].
[0572] Do tính đối xứng của hình nên thể tích toàn khối là $V=2\left( V_{1}+V_{2} \right)=\frac{32\pi}{3}+4\pi^{2}$. [[img:image1087.png]][[img:image1087.png]]
[0573] Câu 47. Gọi $\left( H \right)$ là phần giao của hai khối $\frac{1}{4}$ hình trụ có bán kính $a$, hai trục hình trụ vuông góc với nhau như hình vẽ sau. Tính thể tích của khối $\left( H \right)$.
[0574] [[img:image1092.png]]
[0575] [[b]]Lời giải[[/b]]
[0576] [[img:image1093.png]]
[0577] [[sym:Symbol:F0B7]] Đặt hệ toạ độ $Oxyz$ như hình vẽ, xét mặt cắt song song với mp $\left( Oyz \right)$ cắt trục $Ox$ tại $x$: thiết diện mặt cắt luôn là hình vuông có cạnh $\sqrt{a^{2}-x^{2}}$ $\left( 0\le x\le a \right)$.
[0578] [[sym:Symbol:F0B7]] Do đó thiết diện mặt cắt có diện tích: $S\left( x \right)=a^{2}-x^{2}$.
[0579] [[sym:Symbol:F0B7]] Vậy $V_{\left( H \right)}=\int\limits_{0}^{a} S\left( x \right)\text{d}x$$=\int\limits_{0}^{a} \left( a^{2}-x^{2} \right)\text{d}x$$=\left. \left( a^{2}x-\frac{x^{3}}{3} \right) \right|_{0}^{a}$$=\frac{2a^{3}}{3}$.
[0580] Câu 48. Cho hình phẳng $\left( H \right)$ giới hạn bởi các đường $y=f\left( x \right)=x^{2}-8x+12$ và $y=g\left( x \right)=-x+6$ (phần tô đậm trong hình). Khối tròn xoay tạo thành khi quay $\left( H \right)$ xung quanh trục hoành có thể tích bằng bao nhiêu?
[0581] [[img:image1109.png]]
[0582] [[b]]Lời giải[[/b]]
[0583] [[img:image1110.png]]
[0584] Khi quay $\left( H \right)$ xung quanh trục hoành thì khối tròn xoay sinh ra gồng hai phần:
[0585] [[sym:Wingdings:F046]] Phần hình nón có bán kính đáy $r=5,$ chiều cao $h=5$, bỏ đi phần hình phẳng giới hạn bởi đồ thị $f\left( x \right)$ khi nó quanh quanh trục hoành có $V_{1}=\frac{1}{3}\pi r^{2}h-\pi\int\limits_{1}^{2} \left( x^{2}-8x+12 \right)\,\text{d}x=\frac{125\pi}{3}-\frac{113\pi}{15}=\frac{512\pi}{15}.$
[0586] [[sym:Wingdings:F046]] Phần gạch sọc giới hạn bởi đồ thị hai hàm số $y=-f\left( x \right)$ và $y=g\left( x \right)$ có thể tích là $V_{2}=\pi\int\limits_{3}^{6} \left[ \left( -x^{2}+8x-12 \right)^{2}-\left( 6-x \right)^{2} \right]\,\text{d}x=\frac{108\pi}{5}$
[0587] Vậy thể tích khối tròn xoay cần tìm là $V=V_{1}+V_{2}=\frac{836\pi}{15}.$
[0588] Câu 49. Cho $\left( H \right)$ là hình phẳng giới hạn bởi đồ thị hai hàm số $y=x^{2}+1;\,y=-x-1$ và hai đường thẳng $x=-1;\,x=1$.
[0589] [[img:image1123.png]]
[0590] Thể tích của khối tròn xoay được tạo thành khi quay $\left( H \right)$ quanh trục $Ox$ bằng
[0591] [[b]]Lời giải[[/b]]
[0592] [[img:image1126.png]]
[0593] Gọi $\left( H_{1} \right)$ là hình phẳng giới hạn bởi $y=x^{2}+1$, $y=0;x=-1,x=0$. Khi quay $\left( H_{1} \right)$ quanh trục $Ox$ thì khối tròn xoay được tạo thành có thể tích $V_{1}=\pi\int\limits_{-1}^{0} \left( x^{2}+1 \right)^{2}\text{d}x=\frac{28\pi}{15}$.
[0594] Gọi $\left( H_{2} \right)$ là hình phẳng được giới hạn bởi $y=-x-1,y=0;x=0,x=1.$ Khi quay $\left( H_{2} \right)$ quanh trục $Ox$ thì khối tròn xoay được tạo thành có thể tích $V_{2}=\pi\int\limits_{0}^{1} \left( -x-1 \right)^{2}\text{d}x=\frac{7\pi}{3}$.
[0595] Vậy thể tích của khối tròn xoay được tạo thành khi quay $\left( H \right)$ quanh trục $Ox$ là $V=V_{1}+V_{2}=\frac{21\pi}{5}$.
[0596] Câu 50. Một thùng chứa rượu làm bằng gỗ là một hình tròn xoay như hình bên có hai đáy là hai hình tròn bằng nhau, khoảng cách giữa hai đáy bằng $8$ dm. Đường cong mặt bên của thùng là một phần của đường elip có độ dài trục lớn bằng $10$ dm, độ dài trục bé bằng $6$ dm.
[0597] [[img:image1144.png]]
[0598] Hỏi chiếc thùng gỗ đó đựng được bao nhiêu lít rượu?
[0599] [[b]]Lời giải[[/b]]
[0600] Chọn hệ trục tọa độ như hình vẽ
[0601] [[img:image1145.png]]
[0602] Elip có độ dài trục lớn bằng $10$, trục bé bằng $6$ có phương trình $\frac{x^{2}}{25}+\frac{y^{2}}{9}=1\Rightarrow y=3\sqrt{1-\frac{x^{2}}{25}}$.
[0603] Thùng gỗ xem như vật thể tròn xoay hình thành bằng cách quay elip quanh trục $Ox$ và được giới hạn bởi hai đường thẳng $x=-4$, $x=4$.
[0604] Thể tích vật thể là [[EQ-FAILED:oleObject1195.bin:unmapped private-use MTCode U+F700 (typeface 6, font position 9)]] dm3$=\frac{1416\pi}{25}$ (lít).
[0605] Câu 51. Một khuôn viên dạng nửa hình tròn, trên đó người thiết kế phần để trồng hoa có dạng của một cánh hoa hình parabol có đỉnh trùng với tâm và có trục đối xứng vuông góc với đường kính của nửa hình tròn, hai đầu mút của cánh hoa nằm trên nửa đường tròn (phần tô màu) và cách nhau một khoảng bằng 4m. Phần còn lại của khuôn viên (phần không tô màu) dành để trồng cỏ Nhật Bản. Biết các kích thước cho như hình vẽ, chi phí để trồng hoa và cỏ Nhật Bản tương ứng là $150.000$ đồng/$\text{m}^{2}$ và $100.000$ đồng/$\text{m}^{2}$. Hỏi số tiền cần để trồng hoa và trồng cỏ Nhật Bản trong khuôn viên đó gần nhất với số nào sau đây?
[0606] [[img:image1158.png]]
[0607] [[b]]Lời giải[[/b]]
[0608] Kết hợp vào hệ trục tọa độ, ta được:
[0609] [[img:image1159.png]]
[0610] Gọi parabol là $\left( P \right):y=ax^{2}$. Do $F\left( 2\,;\,4 \right)\in\left( P \right)$ nên $\left( P \right):y=x^{2}$.
[0611] Gọi đường tròn có tâm ở gốc tọa độ là $\left( C \right):x^{2}+y^{2}=R^{2}$. Do $F\left( 2\,;\,4 \right)\in\left( C \right)$ nên nửa đường tròn trên là $y=\sqrt{20-x^{2}}$.
[0612] Đặt $S_{1}$ là diện tích phần tô đậm. Khi đó: $S_{1}=2.\int_{0}^{2} \left( \sqrt{20-x^{2}}-x^{2} \right)\text{d}x=20\arcsin\left( \frac{\sqrt{5}}{5} \right)+\frac{8}{3}$.
[0613] Đặt $S_{2}$ là diện tích phần không tô đậm. Khi đó: $S_{2}=\frac{1}{2}.\pi.R^{2}-S_{1}=10\pi-20\arcsin\left( \frac{\sqrt{5}}{5} \right)-\frac{8}{3}$.
[0614] Vậy: Số tiền cần để trồng hoa và cỏ Nhật Bản là: $T=150000.S_{1}+100000.S_{2}\approx 3738574$(đồng).
[0615] Câu 52. Cơ sở sản xuất của ông A có đặt mua từ cơ sở sản xuất $7$ thùng rượu với kích thước như nhau, thùng có dạng khối tròn xoay với đường sinh dạng parabol, mỗi thùng rượu có bán kính hai mặt là $40\,\,\text{cm}$ và ở giữa là $50\,\,\text{cm}$. Chiều dài mỗi thùng rượu là $100\,\,\text{cm}$. Biết rằng thùng rượu chứa đầy rượu và giá mỗi lít rượu là $30$ nghìn đồng. Số tiền mà cửa hàng của ông A phải trả cho cơ sở sản xuất rượu gần nhất với $M$ nghìn đồng, trong đó $M$ là số nguyên dương. Giá trị của $M$ là bao nhiêu?
[0616] [[img:image1179.png]]
[0617] [[b]]Lời giải[[/b]]
[0618] Giả sử đường sinh có phương trình là $f\left( x \right)=ax^{2}+bx+c\,\,\left( a\ne 0 \right)$.
[0619] Gắn hệ trục tọa độ như hình vẽ
[0620] [[img:image1181.png]]
[0621] Khi đó Parabol đi qua các điểm $M\left( 0;0,5 \right),A\left( -0,5;0,4 \right),B\left( 0,5;0,4 \right)$
[0622] Ta có $\left\{ \begin{array}{l} c=0,5 \\ \frac{1}{4}a-0,5b+0,5=0,4 \\ \frac{1}{4}a+0,5b+0,5=0,4 \end{array} \right.$$\Leftrightarrow\left\{ \begin{array}{l} c=0,5 \\ a=-\frac{2}{5} \\ b=0 \end{array} \right.$.
[0623] Đường sinh có phương trình $f\left( x \right)=-\frac{2}{5}x^{2}+\frac{1}{2}$.
[0624] Vậy thể tích một thùng rượu vang bằng $V=\pi\int\limits_{-0,5}^{0,5} \left( -\frac{2}{5}x^{2}+\frac{1}{2} \right)^{2}\text{d}x=\frac{82}{375}\pi\left( m^{3} \right)$.
[0625] Một thùng rượu chứa số lít rượu là $\frac{82}{375}\pi.1000\approx 687\left( l \right)$.
[0626] Số tiền mà ông A phải trả là $687.30.000.7=144.270.000$ đ
[0627] Câu 53. Cho khối trụ có hai đáy là hai hình tròn $\left( O;R \right)$ và $\left( O';R \right)$, $OO'=4R$. Trên đường tròn $\left( O;R \right)$ lấy hai điểm $A,\text{ }B$ sao cho $AB=a\sqrt{3}$. Mặt phẳng $\left( P \right)$ đi qua $A$, $B$ cắt đoạn $OO'$ và tạo với đáy một góc $60{}^{\circ}$, $\left( P \right)$ cắt khối trụ theo thiết diện là một phần của elip. Diện tích thiết diện đó bằng
[0628] [[b]]Lời giải[[/b]]
[0629] [[img:image1201.png]]
[0630] [[b]]Cách 1: [[/b]]Gọi $I,\text{ }H,\text{ }K,\text{ }E$ là các điểm như hình vẽ.
[0631] * Ta có: $\widehat{IHO}=60{}^{\circ}$
[0632] $OH^{2}=OB^{2}-BH^{2}=R^{2}-\frac{3R^{2}}{4}=\frac{R^{2}}{4}$$\Rightarrow OH=\frac{R}{2}$$\Rightarrow OI=OH.\tan 60{}^{\circ}=\frac{R\sqrt{3}}{2}$, $IH=\frac{OH}{\cos 60{}^{\circ}}=R$, $\Delta IOH\sim\Delta EKH$ nên ta có: $\frac{IE}{IH}=\frac{OK}{OH}=2\Rightarrow IE=2R$.
[0633] * Chọn hệ trục tọa độ $Ixy$ như hình vẽ ta có elip $\left( E \right)$ có bán trục lớn là $a=IE=2R$ và $\left( E \right)$ đi qua $A\left( -R;\,\frac{R\sqrt{3}}{2} \right)$ nên $\left( E \right)$ có phương trình là $\left( E \right):\frac{x^{2}}{4R^{2}}+\frac{y^{2}}{R^{2}}=1$.
[0634] * Diện tích của thiết diện là $S=2\int\limits_{-R}^{2R} R\sqrt{1-\frac{x^{2}}{4R^{2}}}\text{d}x=2R\int\limits_{-R}^{2R} \sqrt{1-\frac{x^{2}}{4R^{2}}}\text{d}x$
[0635] * Xét tích phân: $I=\int\limits_{-R}^{2R} \sqrt{1-\frac{x^{2}}{4R^{2}}}\text{dx}$, đặt $x=2R.\sin t;\text{ }t\in\left[ -\frac{\pi}{2};\,\frac{\pi}{2} \right]$ ta được
[0636] $I=\frac{R}{2}\int\limits_{-\frac{\pi}{6}}^{\frac{\pi}{2}} \left( 1+\cos 2t \right)\text{d}t=\frac{R}{2}\left. \left( t+\frac{\sin 2t}{2} \right) \right|_{-\frac{\pi}{6}}^{\frac{\pi}{2}}=\left( \frac{2\pi}{3}+\frac{\sqrt{3}}{8} \right)R$$\Rightarrow S=\left( \frac{4\pi}{3}+\frac{\sqrt{3}}{4} \right)R^{2}$.
[0637] [[b]]Cách 2: [[/b]]$\cos\widehat{AOB}=\frac{OA^{2}+OB^{2}-AB^{2}}{2.OA.OB}=-\,\frac{1}{2}\Rightarrow\,\,\widehat{AOB}=120{}^{\circ}\Rightarrow\,\,OH=\frac{R}{2}.$
[0638] Chọn hệ trục tọa độ $Oxy$ như hình vẽ
[0639] [[img:image1224.png]]
[0640] $\Rightarrow$ Phương trình đường tròn đáy là $x^{2}+y^{2}=R^{2}\Leftrightarrow y=\pm\,\sqrt{R^{2}-x^{2}}.$
[0641] Hình chiếu của phần elip xuống đáy là miền sọc xanh như hình vẽ.
[0642] Ta có $S=2\,\int\limits_{-\,\frac{R}{2}}^{R} \sqrt{R^{2}-x^{2}}\,\text{d}x.$ Đặt $x=R.\sin t$$\Rightarrow\,\,S=\left( \frac{2\pi}{3}+\frac{\sqrt{3}}{4} \right)R^{2}.$
[0643] Gọi diện tích phần elip cần tính là $S'.$
[0644] Theo công thức hình chiếu, ta có $S'=\frac{S}{\cos 60{}^{\circ}}=2\,S=\left( \frac{4\pi}{3}+\frac{\sqrt{3}}{2} \right)R^{2}.$
[0645] Câu 54. Bác Năm làm một cái cửa nhà hình parabol có chiều cao từ mặt đất đến đỉnh là $2,25$mét, chiều rộng tiếp giáp với mặt đất là $3$ mét. Giá thuê mỗi mét vuông là $1500000$ đồng. Vậy số tiền bác Năm phải trả là:
[0646] [[b]]Lời giải[[/b]]
[0647] Gọi phương trình parabol $\left( P \right):y=ax^{2}+bx+c$. Do tính đối xứng của parabol nên ta có thể chọn hệ trục tọa độ $Oxy$ sao cho $\left( P \right)$ có đỉnh $I\in Oy$ (như hình vẽ).
[0648] 
[0649] 
[0650] 
[0651] 
[0652] [[img:image1239.wmf]][[img:image1240.wmf]][[img:image1241.wmf]][[img:image1242.wmf]][[img:image1243.wmf]][[img:image1243.wmf]][[img:image1244.wmf]][[img:image1245.wmf]][[img:image1246.wmf]][[img:image1247.wmf]]
[0653] Ta có hệ phương trình: $\left\{ \begin{array}{l} \frac{9}{4}=c,\left( I\in\left( P \right) \right) \\ \frac{9}{4}a-\frac{3}{2}b+c=0\left( A\in\left( P \right) \right) \\ \frac{9}{4}a+\frac{3}{2}b+c=0\left( B\in\left( P \right) \right) \end{array} \right.$ $\Leftrightarrow\left\{ \begin{array}{l} c=\frac{9}{4} \\ a=-1 \\ b=0 \end{array} \right.$.
[0654] Vậy $\left( P \right):y=-x^{2}+\frac{9}{4}$.
[0655] Dựa vào đồ thị, diện tích cửa parabol là:
[0656] $S=\int\limits_{\frac{-3}{2}}^{\frac{3}{2}} \left( -x^{2}+\frac{9}{4} \right)\text{d}x$$=2\int\limits_{0}^{\frac{3}{2}} \left( -x^{2}+\frac{9}{4} \right)\text{d}x$$=\left. 2\left( \frac{-x^{3}}{3}+\frac{9}{4}x \right) \right|_{0}^{\frac{9}{4}}$$=\frac{9}{2}\text{m}^{2}$.
[0657] Số tiền phải trả là: $\frac{9}{2}.1500000=6750000$ đồng.
[0658] Câu 55. Cho hàm số $y=x^{4}-6x^{2}+m$ có đồ thị $\left( C_{m} \right)$. Giả sử $\left( C_{m} \right)$cắt trục hoành tại bốn điểm phân biệt sao cho hình phẳng giới hạn bởi $\left( C_{m} \right)$và trục hoành có phần phía trên trục hoành và phần phía dưới trục hoành có diện tích bằng nhau. Khi đó $m=\frac{a}{b}$(với $a$, $b$ là các số nguyên, $b>0$, $\frac{a}{b}$ là phân số tối giản). Giá trị của biểu thức $S=a+b$ là:
[0659] [[b]]Lời giải[[/b]]
[0660] Phương trình hoành độ giao điểm: $x^{4}-6x^{2}+m=0$$\left( 1 \right)$.
[0661] Đặt $t=x^{2}$$\left( t\ge 0 \right)$$\left( 1 \right)$ trở thành $t^{2}-6t+m=0$ $\left( 2 \right)$.
[0662] $\left( C_{m} \right)$ cắt trục hoành tại bốn điểm phân biệt thì phương trình $\left( 1 \right)$ có 4 nghiệm phân biệt hay phương trình $\left( 2 \right)$ có hai nghiệm dương phân biệt $\Leftrightarrow\left\{ \begin{array}{l} \Delta'=\left( -3 \right)^{2}-m>0 \\ P=m>0 \\ S=6>0 \end{array} \right.$$\Leftrightarrow 0<m<9$$\left( * \right)$.
[0663] Gọi $t_{1}$, $t_{2}$$\left( 0<t_{1}<t_{2} \right)$ là hai nghiệm của phương trình $\left( 2 \right)$. Lúc đó phương trình $\left( 1 \right)$ có bốn nghiệm phân biệt theo thứ tự tăng dần là: $x_{1}=-\sqrt{t_{2}}$; $x_{2}=-\sqrt{t_{1}}$; $x_{3}=\sqrt{t_{1}}$; $x_{4}=\sqrt{t_{2}}$.
[0664] Do tính đối xứng của đồ thị $\left( C_{m} \right)$ nên có $\int\limits_{0}^{x_{3}} \left( x^{4}-6x^{2}+m \right)\text{d}x$ $=\int\limits_{x_{3}}^{x_{4}} \left( -x^{4}+6x^{2}-m \right)\text{d}x$$\Rightarrow\frac{x_{4}^{5}}{5}-2x_{4}^{3}+mx_{4}=0$$\Leftrightarrow x_{{}^{4}}^{5}-10x_{{}^{4}}^{3}+5mx_{4}=0$.
[0665] Từ đó có $x_{4}$ là nghiệm của hệ phương trình: $\Leftrightarrow\left\{ \begin{array}{l} x_{4}^{4}-6x_{4}^{2}+m=0\, \\ x_{4}^{4}-10x_{4}^{2}+5m=0\, \end{array} \right.\begin{array}{l} \left( 3 \right) \\ \left( 4 \right) \end{array}$
[0666] Lấy $\left( 3 \right)-\left( 4 \right)$$\Rightarrow x_{4}^{2}=m$, thay $x_{4}^{2}=m$ vào $\left( 3 \right)$ có: $m^{2}-5m=0$$\Rightarrow m=0\vee m=5$.
[0667] Đối chiếu điều kiện $\left( * \right)$ta có $m=5$$\Rightarrow a=5$và $b=1$. Vậy $S=6$.
[0668] Câu 56. Cho hàm số $y=f\left( x \right)$ có đạo hàm trên $\mathbb{R}$, đồ thị hàm số $y=f\left( x \right)$ như hình vẽ. Biết diện tích hình phẳng phần sọc kẻ bằng $3$. Tính giá trị của biểu thức:
[0669] $T=\int\limits_{1}^{2} f'\left( x+1 \right)\text{dx}+\int\limits_{2}^{3} f'\left( x-1 \right)\text{dx}+\int\limits_{3}^{4} f\left( 2x-8 \right)\text{dx}$
[0670] [[img:image1302.png]]
[0671] [[b]]Lời giải[[/b]]
[0672] Diện tích hình phẳng phần sọc kẻ bằng $3$
[0673] $\Rightarrow$$\int\limits_{-2}^{0} \left| f\left( x \right) \right|\text{dx}=3\Leftrightarrow-\int\limits_{-2}^{0} f\left( x \right)\text{dx}=3\Leftrightarrow\int\limits_{-2}^{0} f\left( x \right)\text{dx}=-3$
[0674] Ta có: $T=\int\limits_{1}^{2} f'\left( x+1 \right)\text{dx}+\int\limits_{2}^{3} f'\left( x-1 \right)\text{dx}+\int\limits_{3}^{4} f\left( 2x-8 \right)\text{dx}$
[0675] $=\left. f\left( x+1 \right) \right|_{1}^{2}+\left. f\left( x-1 \right) \right|_{2}^{3}+\int\limits_{3}^{4} f\left( 2x-8 \right)\text{dx}$
[0676] $=f\left( 3 \right)-f\left( 2 \right)+f\left( 2 \right)-f\left( 1 \right)+\int\limits_{3}^{4} f\left( 2x-8 \right)\text{dx}$
[0677] $=2-\left( -1 \right)+\int\limits_{3}^{4} f\left( 2x-8 \right)\text{dx}=3+\int\limits_{3}^{4} f\left( 2x-8 \right)\text{dx}$
[0678] Đặt $t=2x-8\Rightarrow dx=\frac{1}{2}dt$
[0679] Đổi cận:
[0680] $x=3\Rightarrow t=-2$
[0681] $x=4\Rightarrow t=0$
[0682] Suy ra: $T=3+\int\limits_{-2}^{0} f\left( t \right)\frac{1}{2}\text{dt}=3+\frac{1}{2}\int\limits_{-2}^{0} f\left( t \right)\text{dt}=3-\frac{3}{2}=\frac{3}{2}$.
