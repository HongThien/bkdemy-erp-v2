# hs-bang-xep-hang-v1
## 1. Đơn đặt hàng
App **hs**, màn **bang-xep-hang**: chọn bảng, phạm vi Khối/Toàn BK và kỳ Tuần/Tháng. Bảng vinh danh gồm header gọn có nút quay lại, tên màn, ba dropdown ngang; dải hạng của em; 20 dòng theo hai cột 1–10 và 11–20. Nền và cảm giác chibi phép thuật ban đêm, viền đồng/vàng, navy/chàm. Toàn cảnh iPad 1672×941 đã duyệt trước khi sinh asset.
Giao **22 PNG RGBA trong suốt**, tên/kích thước theo đơn, **6 .slice.json**. Các ngoại lệ trực tiếp của đơn (PNG nhỏ, tên tùy chọn, metadata slice) ưu tiên quy định chung trong UI kit. Mọi tên, lớp, điểm, nhãn, giá trị lọc, số hạng và câu trong dải đều do code.
Bổ sung đã chốt trong chat: huy chương top 3 **phải hiển thị số 1/2/3 bằng code**, PNG vẫn trống.
Nền sử dụng lại từ kit nền đã giao: **hs-3-nen-v1/assets/backdrop/nen_bxh_ngang.jpg** và **nen_bxh_doc.jpg**. Đây là phụ thuộc có sẵn, không phải PNG mới của bộ này; không sinh hay đổi nền.

## 2. Font & bảng màu
- **Baloo 2**, tiếng Việt; tên màn 24–28px/800; tên người 16–18px/700; lớp 14–16px/500; điểm 17–20px/800; nhãn dropdown 14–16px/700. Đây là cỡ **CSS px/logical px**, không tự chia đôi theo độ phân giải ảnh.
- Viền chủ đạo **#D9A84E**, highlight **#FFE29A**; ruột tối **#11172F**, tím chàm **#252044**; chữ chính **#F7F4E8**, chữ phụ **#C3C5D0**. PNG có sắc độ vẽ tay quanh màu định hướng.
- Khung thường: code brightness **0.65**, khung em/open **1.00**; không đổi hue. Hai khung dòng gần trong suốt ở giữa; code đặt SHAPE navy #11172F opacity ≈40% phía dưới, góc bo khớp khung.
- Số **1–3**: Baloo 2/800, màu **#11172F**, viền mảnh #FFE29A 1px nếu cần. Tâm chữ neo **x50%, y60%** trên canvas huy chương. Khi icon cao 56px: số 18–20px; icon 44px: số 16px.
- Số **4–20**: Baloo 2/800, **#FFE29A**, tâm **x50%, y53%** canvas khiên; cỡ 16–18px khi khiên cao 44–52px. Khiên có vùng tối trống ≈**72,35% diện tích silhouette**, vượt yêu cầu 55%.
- Ảnh kiểm tra số dùng Arial Bold, chỉ để minh họa vị trí; app dùng Baloo 2. Không có chữ/số trong asset.

## 3. Bảng kiểm kê
Asset sinh mới riêng từng ảnh; không lấy mảnh từ mockup. Những ngôi sao/kim loại trên khung là chi tiết đã gộp trong khung, không tương tác.

| id | Vùng | Phần tử | Vị trí & cỡ | Loại | Động? | Kích thước file | File asset |
|---|---|---|---|---|---|---|---|
| 01 | top/body | huy_chuong_1 | Đầu dòng top 3, trước tên; iPad ≈56×56px trong dòng 60px; điện thoại ≈44×44px; không kéo méo | ILLUST | không | 160×160 | assets/illustrations/huy_chuong_1.png |
| 02 | top/body | huy_chuong_2 | Đầu dòng top 3, trước tên; iPad ≈56×56px trong dòng 60px; điện thoại ≈44×44px; không kéo méo | ILLUST | không | 160×160 | assets/illustrations/huy_chuong_2.png |
| 03 | top/body | huy_chuong_3 | Đầu dòng top 3, trước tên; iPad ≈56×56px trong dòng 60px; điện thoại ≈44×44px; không kéo méo | ILLUST | không | 160×160 | assets/illustrations/huy_chuong_3.png |
| 04 | top/body | khien_hang | Đầu dòng hạng 4–20; iPad cao ≈52px, điện thoại ≈44px; số code nằm trên mặt khiên | ILLUST | không | 120×140 | assets/illustrations/khien_hang.png |
| 05 | top/body | khung_hang | Xem bảng 9-slice mục 4; neo theo component, nằm dưới chữ | ILLUST (khung) | không | 640×96 | assets/frames/khung_hang.png |
| 06 | top/body | khung_hang_em | Xem bảng 9-slice mục 4; neo theo component, nằm dưới chữ | ILLUST (khung) | không | 640×96 | assets/frames/khung_hang_em.png |
| 07 | top/body | khung_dai_hang_em | Xem bảng 9-slice mục 4; neo theo component, nằm dưới chữ | ILLUST (khung) | không | 960×104 | assets/frames/khung_dai_hang_em.png |
| 08 | top/body | khung_o_chon | Xem bảng 9-slice mục 4; neo theo component, nằm dưới chữ | ILLUST (khung) | không | 320×100 | assets/frames/khung_o_chon.png |
| 09 | top/body | khung_o_chon_mo | Xem bảng 9-slice mục 4; neo theo component, nằm dưới chữ | ILLUST (khung) | không | 320×100 | assets/frames/khung_o_chon_mo.png |
| 10 | top/body | khung_menu_chon | Xem bảng 9-slice mục 4; neo theo component, nằm dưới chữ | ILLUST (khung) | không | 480×480 | assets/frames/khung_menu_chon.png |
| 11 | top/body | mui_ten | Mép phải ô chọn, iPad ≈26×18px; điện thoại ≈18×12px; trên ruột khung | ILLUST | không | 48×32 | assets/illustrations/mui_ten.png |
| 12 | top/body | o_xep_hang | Ô lớn màn chính, icon căn giữa ≈70% ô; không hiện trong danh sách BXH | ILLUST | không | 192×192 | assets/illustrations/o_xep_hang.png |
| 13 | top/body | huy_hieu_bxh | Header, giữa nút quay lại và tên màn; iPad ≈86px, điện thoại ≈32px | ILLUST | không | 96×96 | assets/illustrations/huy_hieu_bxh.png |
| 14 | top/body | bang_a1 | Trước nhãn bảng trong menu/ô chọn đầu; iPad ≈40px, điện thoại ≈28–32px | ILLUST | không | 96×96 | assets/illustrations/bang_a1.png |
| 15 | top/body | bang_a2 | Trước nhãn bảng trong menu/ô chọn đầu; iPad ≈40px, điện thoại ≈28–32px | ILLUST | không | 96×96 | assets/illustrations/bang_a2.png |
| 16 | top/body | bang_a3 | Trước nhãn bảng trong menu/ô chọn đầu; iPad ≈40px, điện thoại ≈28–32px | ILLUST | không | 96×96 | assets/illustrations/bang_a3.png |
| 17 | top/body | bang_a4 | Trước nhãn bảng trong menu/ô chọn đầu; iPad ≈40px, điện thoại ≈28–32px | ILLUST | không | 96×96 | assets/illustrations/bang_a4.png |
| 18 | top/body | bang_a5 | Trước nhãn bảng trong menu/ô chọn đầu; iPad ≈40px, điện thoại ≈28–32px | ILLUST | không | 96×96 | assets/illustrations/bang_a5.png |
| 19 | top/body | bang_b1 | Trước nhãn bảng trong menu/ô chọn đầu; iPad ≈40px, điện thoại ≈28–32px | ILLUST | không | 96×96 | assets/illustrations/bang_b1.png |
| 20 | top/body | bang_c1 | Trước nhãn bảng trong menu/ô chọn đầu; iPad ≈40px, điện thoại ≈28–32px | ILLUST | không | 96×96 | assets/illustrations/bang_c1.png |
| 21 | top/body | bang_e1 | Trước nhãn bảng trong menu/ô chọn đầu; iPad ≈40px, điện thoại ≈28–32px | ILLUST | không | 96×96 | assets/illustrations/bang_e1.png |
| 22 | top/body | trong | Minh họa trạng thái chưa có hạng, cạnh câu code; iPad tối đa 360×300px, điện thoại rộng ≈70% vùng trống; giữ tỉ lệ | ILLUST | không | 360×300 | assets/illustrations/trong.png |
| 23 | top | Nút quay lại + chevron | Góc trái header; vùng chạm ≥44×44px; vòng tròn SHAPE và chevron do code, trên nền; điện thoại tương tự | SHAPE+GLYPH | không | — | — |
| 24 | top | Tên màn + nhãn/giá trị 3 ô | Tên sau icon; ba ô ở phần phải cùng hàng iPad; trên khung, không ghi vào PNG | TEXT | giá trị lọc động | — | — |
| 25 | body | Số hạng 1–20 | Neo trên huy chương/khiên theo mục 2, nằm trước tên; mọi khổ màn giữ vị trí tương đối | TEXT | động | — | — |
| 26 | body | Tên · lớp · điểm | Trong mỗi dòng: tên bên trái, lớp cột giữa, điểm căn phải; iPad hai cột, khung đổi rộng trên điện thoại | TEXT | động | — | — |
| 27 | body | Vòng số + nội dung dải của em | Vòng tối viền vàng code, neo trái dải; chữ/điểm đặt trong ruột, trên khung; không bake vòng vào 9-slice | SHAPE+TEXT | động | — | — |
| 28 | body | Nền ruột dòng + đường chia | SHAPE tối phía dưới PNG; đường chia mảnh giữa cột tên/lớp/điểm do code để đổi theo chiều rộng | SHAPE | không | — | — |
| 29 | body | Câu trạng thái rỗng | Cạnh/dưới trong.png trong vùng thông báo, trên nền; “Em chưa có hạng”; vẫn giữ bảng top 20 nếu có dữ liệu | TEXT | động | — | — |
| 30 | nền | Nền bầu trời BXH | Phủ màn, nằm sau toàn bộ UI; chọn ngang/dọc từ kit nền có sẵn | BACKDROP có sẵn | không | theo kit nền | hs-3-nen-v1/assets/backdrop/nen_bxh_*.jpg |

## 4. Trạng thái & hành vi
**Danh sách:** bình thường dùng khung_hang.png; dòng trùng học sinh hiện tại dùng khung_hang_em.png, không phụ thuộc vị trí; mẫu duyệt tô dòng thứ 6. Top 3 dùng huy_chuong_1/2/3, hạng khác dùng khien_hang; tất cả số đều do code. Tối đa 20 dòng, ít dữ liệu thì giữ đúng thứ hạng hiện có.
**Dropdown:** đóng dùng khung_o_chon; mở dùng khung_o_chon_mo, mũi tên xoay180°, menu nằm trên các lớp UI. A1–A5, B1, C1, E1 có icon riêng. Phạm vi và kỳ dùng nhãn code. Chạm ngoài đóng; chọn giá trị đóng menu rồi tải bảng tương ứng.
**Chưa có hạng của em:** bỏ số/điểm cá nhân, dùng câu code “Em chưa có hạng”; trong.png dùng trong vùng thông báo rộng khi có chỗ. Không xóa top 20 của người khác chỉ vì em chưa có hạng. Không ép minh họa 360×300 vào dải mỏng: trên dải chỉ dùng câu; minh họa dùng trong vùng rỗng/thông báo phù hợp.
**Đang tải:** giữ khung, code hiển thị skeleton; disabled giảm brightness/opacity, khóa thao tác; không đổi màu kim loại. Chạm co nhẹ0.98; điện thoại không cần hover.
**Bố cục:** iPad ngang đủ chỗ giữ 2 cột như reference (1–10 trái,11–20 phải); header/dải cố định, danh sách là vùng chính. Trên điện thoại ưu tiên tên đọc rõ: dưới chiều rộng đủ cho 2 cột chuyển1 cột theo thứ tự1–20, chỉ body cuộn; ba ô lọc vẫn một hàng, nhãn rút gọn/ellipsis. Đây là hướng triển khai co giãn, chưa có mockup dọc trong đơn.
**Vùng chạm:** mọi dòng và tùy chọn menu cao **≥44 CSS px**, gợi ý56–64px; nút quay lại và dropdown ≥44px. Không scale toàn bộ ảnh tham chiếu thành UI rồi làm vùng chạm nhỏ hơn44px. Nếu iPad có chiều cao logical không đủ 10 dòng44px + header, cho body cuộn, không thu chữ hoặc vùng chạm.

### 9-slice và vùng an toàn chữ
Các giá trị sau tính trên **PNG gốc**. JSON cạnh file dùng cùng tên: khung_hang.slice.json v.v. Giữ nguyên bốn góc; chỉ kéo cạnh và ruột. Chỉ số slice không đồng nghĩa padding chữ. Khi scale tổng thể asset theo hệ số s, scale cả slice/padding theo s; vẫn giữ vùng chạm CSS ≥44px.

| Khung | PNG | left/right/top/bottom | Lề chữ trong (L/R/T/B px gốc) | Vùng dành riêng |
|---|---|---|---|---|
| khung_hang | 640×96 | 28/28/28/28 | 40/40/16/16 | Có badge: chữ bắt đầu sau badge +12px; gợi ý L104 |
| khung_hang_em | 640×96 | 28/28/28/28 | 40/40/16/16 | Hai sao ở đầu; chữ tránh vùng40px hai mép, badge như dòng thường |
| khung_dai_hang_em | 960×104 | 32/32/32/32 | 48/48/18/18 | Vòng code bên trái ≈72px; nội dung gợi ý L144, chừa phải cho điểm |
| khung_o_chon | 320×100 | 24/24/24/24 | 32/56/18/18 | Mũi tên riêng ở phải; icon bảng nếu có lấy thêm40px bên trái |
| khung_o_chon_mo | 320×100 | 24/24/24/24 | 32/56/18/18 | Như đóng, mũi tên xoay180° |
| khung_menu_chon | 480×480 | 40/40/40/40 | 52/52/52/52 | Mỗi mục icon28–40px + nhãn code; hàng≥44 CSS px |

Không nén kích thước đích dưới tổng caps: khung dòng cần **>56px** cao nếu dùng caps28px nguyên; dải **>64px**, ô **>48px**, menu **>80px**. Ví dụ dòng60px hợp lệ. Muốn vẽ thấp hơn phải scale caps đồng bộ, không kéo âm vùng giữa. Đã thử rộng320/640/900px và xem ảnh reference_9_slice.png.
Hai khung dòng có alpha giữa lần lượt **3/255** và **0/255**; alpha này là kết quả sinh trong suốt, không xóa màu nền. Lớp navy mờ phía dưới tạo ruột gần trong suốt-tối.

## 5. Thứ tự lớp
Nền bầu trời có sẵn → SHAPE ruột dòng → PNG khung → huy chương/khiên → số hạng code → tên/lớp/điểm → header/dải → dropdown menu nổi.
Trong dải: khung → vòng số code → số/chữ. Khi mở dropdown, menu đè lên dải và danh sách; vùng chạm theo hình chữ nhật logical.
**Chứng cứ tự kiểm:** đã xem22 ảnh xuất trên nền navy, không có chữ/số, góc trong suốt, bạc/giấy trắng còn nguyên. Kiểm tra dữ liệu từng PNG: RGBA, đúng kích thước, bốn góc alpha0, ảnh không rỗng. Đã xem dựng lại2×10 dòng, dropdown mở, các khung đổi rộng và số1/2/3 đặt bằng code. Các reference minh họa mã đã dùng asset xuất thật, không cắt asset từ reference.
Bản reference_bxh.png là concept đã duyệt; reference_bxh_assets.png là đối chiếu dựng bằng asset cuối, cùng cấu trúc. Các chi tiết đơn giản của nút/vòng/đường chia được code dựng theo bảng kiểm kê.

## 6. Danh sách file trong kit
- **assets/illustrations/**:16 PNG, đúng tên trong bảng01–04,11–22; gồm trong.png360×300.
- **assets/frames/**:6 PNG khung và6 file.slice.json; JSON chỉ có left/right/top/bottom theo bảng mục4.
- **reference/reference_bxh.png**:1672×941, concept đã duyệt, vạch giữ chỗ, không chữ/số.
- **reference/reference_bxh_assets.png**:1672×941, dựng2×10 dòng từ asset cuối, chữ/số vẫn là vạch giữ chỗ.
- **reference/reference_bxh_mo.png**:1672×941, dropdown mở có8 icon bảng, vạch giữ chỗ.
- **reference/reference_assets.png**:1200×1000, đối chiếu icon/alpha trên nền tối; tên file chỉ là nhãn kiểm tra.
- **reference/reference_9_slice.png**:1500×1580, chứng cứ thử nhiều chiều rộng.
- **reference/reference_so_huy_chuong.png**:600×220, ví dụ số1/2/3 do code đặt lên PNG trống.
- **DESIGN.md**:tài liệu này. Không chứa scripts, manifest, JSX hoặc CSS.
Nguồn sinh: built-in **imagegen**, từng ảnh riêng; tham chiếu bố cục đã duyệt và nhân vật nam skin RPG. Chuẩn hóa file xuất từ **asset sinh độc lập**: bỏ phần lề gần như vô hình, thu nhỏ về đúng kích thước và resample các cap để phù hợp lề9-slice đã yêu cầu; không cắt từ mockup, không xóa màu nền, không đổi hue.

**Bộ prompt dùng sinh (phần chung + mô tả từng file):**
Phần chung: Use case: stylized-concept. Single isolated production game UI PNG asset, genuine TRANSPARENT background and clear transparent corners. Hand-painted 2D anime chibi RPG matching the approved leaderboard reference, plump rounded forms, warm golden bronze outlines #D9A84E, highlight #FFE29A, midnight navy #11172F and indigo #252044. No 3D render, no photorealism, no noise. ABSOLUTELY NO letters, digits, roman numerals, pseudo writing, gray placeholder bars, watermark, backdrop, or scene unless specifically described. Preserve opaque white/silver materials. Center composition, small transparent margin, asset alone.
- huy_chuong_1.png (160×160): Gold medal: chunky shield crowned with small gold crown on top, short ribbon above, small symmetrical laurel sides. Blank polished gold shield center. Same silhouette family as silver/bronze, no number.
- huy_chuong_2.png (160×160): Silver medal: chunky silver shield with small silver four-point star crest at top, short blue ribbon above, small symmetrical silver laurel sides. Blank silver shield center. Same silhouette family as gold/bronze, no number.
- huy_chuong_3.png (160×160): Bronze medal: chunky copper bronze shield with small bronze rounded diamond crest at top, short dark violet ribbon above, small symmetrical bronze laurel sides. Blank bronze shield center. Warm brown metallic bronze, not red. Same silhouette family as gold/silver, no number.
- khien_hang.png (120×140): Neutral empty small shield, deep navy-purple perfectly FLAT blank center covering at least 55% of entire shield area for code number overlay, thin bronze gold rim, modest rounded pointed bottom, no gem or emblem in center.
- khung_hang.png (640×96): EXACT horizontal canvas 640x96, ONE normal rank-row frame occupying almost full canvas. Long slender rounded rectangular dark parchment/wood ribbon, thin bronze rim. Center flat midnight navy with partial transparency (alpha approx90/255); outside fully transparent. 9-slice caps exactly28px each side. ALL corner folds and metal tips confined to outer28px, no art in scalable middle, top/bottom edges uniform straight horizontal, no internal dividers, no badge, no arrow. Very slim so list of20 remains readable.
- khung_hang_em.png (640×96): EXACT horizontal canvas640x96, ONE highlighted rank-row frame. Same slender rectangular dark ribbon as normal row, brighter golden rim with very thin soft glow, TWO tiny four-point gold sparkle stars at far left and right, entirely within outer28px caps. Flat midnight navy partially transparent center alphaapprox90/255. 9-slice caps28px all sides, middle straight uniform edges, no central decorations, no dividers or badges. Transparent outside, glow not clipped.
- khung_dai_hang_em.png (960×104): EXACT horizontal canvas960x104, ONE slim personal-rank magic scroll ribbon. Bright warm gold thin rim, very restrained tiny corner scroll folds entirely within32px caps. Flat dark indigo semi-transparent center, long straight uniform horizontal edges, no dividers, no crown, no text or stars in center. Left inner area left EMPTY to place circular rank socket by code (do not bake circle into scalable pixels). 9-slice32px all sides. Transparent outside. Much wider than tall.
- khung_o_chon.png (320×100): EXACT canvas320x100 ONE closed dropdown panel, small dark navy wood plaque with modest rounded beveled corners and thin bronze rim. Interior flat dark navy mostly opaque. Both sides empty including right side for separate code arrow. 9-slice24px all sides; no arrow or icon baked in, no central shapes, uniform straight top/bottom edges, corner ornament confined24px. Transparent outside.
- khung_o_chon_mo.png (320×100): EXACT canvas320x100 ONE OPEN-state dropdown panel, same shape as closed dropdown with brighter warm gold rim and very slim glow. Interior flat dark navy mostly opaque. Empty right side for separate arrow. 9-slice24px all sides, no arrow icon or label, no middle art, uniform straight edges, corners confined24px. Transparent outside.
- khung_menu_chon.png (480×480): EXACT480x480 ONE dropdown menu panel, rounded dark navy parchment square, thin bronze gold rim, four small gold metal corner brackets entirely within40px caps. Center completely flat dark navy opaque enough for white text, no texture, no separators, no decorative middle. 9-slice40px all sides, straight uniform scalable edges. Transparent outside.
- mui_ten.png (48×32): ONE simple downward triangular pale golden crystal arrow, front view, rounded corners, subtle facet shading, wide triangular silhouette, no shaft, isolated. Intended48x32, clear when small.
- o_xep_hang.png (192×192): ONE large home-grid icon: ornate chunky gold trophy cup crowned with small gold crown, compact rolled blank honor scroll behind and below trophy, restrained violet ribbons and gem highlights. More prominent than reference o_cup, grouped as one isolated icon; no inscription on scroll.
- huy_hieu_bxh.png (96×96): ONE SMALL HEADER emblem, simplified chunky gold trophy plus small gold crown and tiny rolled blank scroll base. Compact silhouette, bold details readable at96px; match large leaderboard icon but far less detail, no dangling long ribbons.
- bang_a1.png (96×96): ONE compact easily readable board icon: small gold hammer and dark indigo anvil, representing diligent practice, few bold shapes.
- bang_a2.png (96×96): ONE compact easily readable board icon: stack of three rolled parchment scrolls with ONE gold checkmark emblem. Checkmark is pictorial shape, no writing.
- bang_a3.png (96×96): ONE compact easily readable board icon: gold rimmed indigo shield inside partial circular gold progress ring, no % symbol, no numbers or letters, blank shield face.
- bang_a4.png (96×96): ONE compact easily readable board icon: chunky open indigo magic book with blank pages, gentle pale golden glow emerging, one small sparkle, no writing or runes.
- bang_a5.png (96×96): ONE compact easily readable board icon: THREE linked pale golden magical flame shapes arranged horizontally, connected by short gold links, each flame distinct. No red or orange fire.
- bang_b1.png (96×96): ONE compact easily readable board icon: rolled blank exam parchment plus diagonal indigo-gold quill pen, no writing.
- bang_c1.png (96×96): ONE compact easily readable board icon: short chunky indigo fantasy tower with warm gold trims and a bold gold UPWARD arrow beside it. No large scene or ground.
- bang_e1.png (96×96): ONE compact easily readable board icon: open small dark indigo display chest with gold rim, containing three tiny shiny shield badges arranged visibly; compact silhouette.
- trong.png (360×300): ONE empty-state character vignette, intended360x300 wide. SAME BOY as character reference: tousled dark violet hair, warm golden eyes, navy/blue indigo cloak with gold trim, small chibi body. Sitting beside small EMPTY dark wooden signboard with bronze edge, elbow on knee and chin resting in hand, patiently waiting with gentle bored expression. No text or numbers. Isolated boy and blank board only, fully transparent outside, no sky, no floor, no companion animals, no magical book.
Tinh chỉnh cuối: huy_chuong_1 dùng huy_chuong_2 làm tham chiếu để giữ bố cục ruy băng phía trên, đổi bạc thành vàng và crest thành vương miện; khung_hang/khung_hang_em bỏ nền ruột để alpha gần0, giữ outline thẳng và đầu nhỏ, em có2 sao. PNG không chứa số sau yêu cầu bổ sung; số1–3 được code đặt theo mục2.

