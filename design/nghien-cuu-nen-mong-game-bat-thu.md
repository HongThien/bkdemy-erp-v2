# Giữ three.js, thêm Colyseus, đo iPad trước

**Khuyến nghị: giữ three.js nhưng nâng lên bản mới nhất (r186). Thú và nhân vật đổi sang file GLB có khung xương, dựng theo 4–6 "khuôn" dùng chung. Hiệu ứng làm bằng three.quarks cộng một bộ shader nhỏ tự viết. Phần nhiều người chơi chạy trên một server Colyseus đặt ở Singapore. Mọi con số dính đến phần thưởng (tỉ lệ bắt, sát thương, xu, EXP) vẫn nằm trong hàm Postgres `fn_game_*`.** Lý do gốc nằm ở máy yếu nhất: iPad gen 7 kẹt vĩnh viễn ở iPadOS 18. Nó chỉ có WebGL2 (cách trình duyệt vẽ 3D bằng card đồ hoạ) và bộ nhớ cho mỗi tab rất hẹp. Hai điều đó loại Unity và Godot bản web, và khiến engine JS nhẹ nhất là lựa chọn an toàn nhất. Toàn bộ stack đều bằng TypeScript, không cần phần mềm editor riêng, nên Claude Code viết được gần hết code. Chi phí server tăng thêm ước khoảng **25–45 USD/tháng** ở mức 500 người online cùng lúc. Có ba rủi ro lớn nhất. Một là bộ nhớ iPad chưa ai đo cho game kiểu này. Hai là chưa có bộ thú dễ thương miễn phí nào kèm đủ hoạt ảnh. Ba là thể loại "bắt thú 3D nhiều người chơi trên web" hầu như chưa có tiền lệ. CEO cần chốt trước một quyết định: đánh nhau **theo lệnh/lượt** hay **thời gian thực**. Lựa chọn này quyết định công thức sát thương có ở lại Postgres được hay không. Không nên cam kết gì trước khi chạy một bản thử (spike) khoảng 1–2 tuần trên iPad gen 7 thật.

| Lớp | Chọn | Thay thế nếu spike trượt |
|---|---|---|
| Engine/renderer (thư viện vẽ 3D) | three.js r186, `WebGLRenderer` | Babylon.js 9 |
| Nhân vật người chơi | KayKit Adventurers + KayKit Character Animations (CC0, miễn phí) | Quaternius UAL1/UAL2 (CC0) |
| Thú | 4–6 khung xương "khuôn" tự dựng trong Blender. Thân thú mua (Omabuarts Quirky, Meshtint) hoặc sinh bằng AI rồi gắn vào khuôn | Quaternius Cute/Ultimate Monsters (CC0) để làm mẫu |
| Hiệu ứng (VFX) | three.quarks + bộ shader tự viết (tan biến, viền sáng, tia, vệt) | Tự viết toàn bộ bằng shader |
| Netcode (phần mạng nhiều người chơi) | Colyseus 0.18 tự chạy trên VPS Singapore | Colyseus Cloud / Cloudflare Durable Objects |
| Logic nghiệp vụ | Supabase Postgres `fn_game_*` (giữ nguyên luật §2.0) | — |
| Thông báo xã hội | Supabase Realtime (mời party, bạn online, báo nhận xu) | — |

## iPad gen 7 đặt trần: chỉ có WebGL2, bộ nhớ vài trăm MB

Mọi lựa chọn phía sau đều xuất phát từ một sự thật. **iPadOS 26 bỏ đúng một dòng iPad so với iPadOS 18: iPad gen 7.** Lý do là chip A10 không có Neural Engine ([iClarified](https://www.iclarified.com/97601/ipados-26-supported-devices-the-full-list-of-compatible-ipads)). Trong khi đó **WebGPU (chuẩn đồ hoạ web mới, nhanh hơn) chỉ có từ Safari 26** ([WebKit](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)). Trên iOS mọi trình duyệt đều dùng lõi WebKit, nên cài Chrome cũng không giúp gì. Kết luận: máy yếu nhất sẽ chạy **WebGL2 suốt đời sản phẩm**. WebGPU chỉ là phần thưởng thêm cho máy mới. Ngay cả trên Poki, tháng 6/2026 mới khoảng **68% người chơi có WebGPU** ([Poki](https://poki.com/blog/building-web-browser-games-2026)).

Thứ thật sự làm chết game trên iPad là bộ nhớ, không phải tốc độ. Safari tính cả bộ nhớ đồ hoạ vào tab. Khi vượt ngưỡng, iOS **tự tải lại trang, không báo lỗi**. Apple không công bố ngưỡng cố định. Một bảng ước tính cho iPhone đời iPhone 8/X ghi khoảng **300–350 MB** ([Catch Metrics](https://www.catchmetrics.io/blog/deep-dive-ram-internals-webkit)). Chưa có số đo nào riêng cho iPad gen 7, nên con số này phải tự đo. Có một báo cáo Babylon ghi nhận cùng một cảnh tốn khoảng 900 MB trên Safari, so với 300–400 MB trên Chrome ([Babylon forum](https://forum.babylonjs.com/t/surprisingly-big-memory-footprint-on-safari-against-chromium/39130)).

Điểm này loại hai engine lớn. Unity và Godot bản web chạy bằng WASM (mã biên dịch sẵn, giữ trước một vùng nhớ lớn). Unity có một chuỗi thảo luận kéo dài nhiều năm: **cứ khi vùng nhớ WASM phải nở từ 256 MB lên khoảng 300–500 MB là tab iOS sập** ([Unity Discussions](https://discussions.unity.com/t/webgl-memory-increment-issue-and-crash-on-ios/894771)). Godot 4 bản web chỉ có renderer tương thích WebGL2. Chính tài liệu Godot thừa nhận Safari có "nhiều vấn đề WebGL 2.0" ([Godot docs](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)). Godot còn có lỗi game tự tải lại trên iOS sau vài phút nếu có âm thanh ([godot#107390](https://github.com/godotengine/godot/issues/107390)). Dung lượng tải lần đầu cũng chênh lệch lớn. Poki đo: three.js khoảng **151 KB**, Unity khoảng **11 MB** chưa tối ưu, Godot khoảng **10 MB** ([Poki](https://developers.poki.com/guide/web-engine)). Poki khuyên lần tải đầu không quá 5 MB, và mỗi MB thêm làm mất "vài phần trăm" người chơi ([Poki](https://poki.com/blog/building-web-browser-games-2026)).

## Nâng cấp three.js rẻ hơn đổi engine

Three.js thắng vì bốn lý do.

**Thứ nhất, đi tiếp là rẻ.** Nâng từ r128 lên r186 chỉ là việc sửa theo danh sách. Phải chuyển sang ES module, đổi tên hệ màu (`outputEncoding` → `outputColorSpace`), chỉnh lại cường độ đèn, và bỏ `PCFSoftShadowMap` ([three.js Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide)). Đây là việc tính bằng ngày.

**Thứ hai, AI viết three.js tốt nhất.** three.js có khoảng **12,2 triệu lượt tải/tuần**, gấp khoảng 39 lần Babylon ([utsubo](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison)). Kho mã mẫu lớn giúp AI ít "bịa" API hơn. Nhưng trong kho đó cũng có rất nhiều code cũ. Vì vậy phải ghi luật dùng API mới vào CLAUDE.md.

**Thứ ba, nhẹ nhất và không khoá vào nhà cung cấp.** three.js dùng giấy phép MIT, miễn phí, không cần editor trả phí.

**Thứ tư, đã có game thật chạy trên nó.** Krunker.io do một người sáng lập làm, đạt **hơn 200 triệu người chơi** trước khi được mua lại ([PocketGamer.biz](https://www.pocketgamer.biz/frvr-acquires-f2p-first-person-shooter-krunkerio/)). HYTOPIA chạy three.js với server authoritative (server là trọng tài duy nhất) và đạt **39,4 nghìn người chơi/ngày** lúc đỉnh ([HYTOPIA](https://blog.hytopia.com/2026/01/01/hytopia-december-growth-metrics-and-milestones/)).

Nên dùng `WebGLRenderer` cũ, chưa dùng `WebGPURenderer`. Có hai lý do. Diễn đàn ghi nhận WebGPURenderer đôi khi **chậm hơn** ([utsubo](https://www.utsubo.com/blog/threejs-2026-what-changed)). Và nó không chạy được shader viết kiểu cũ, trong khi thư viện hiệu ứng three.quarks vẫn cần kiểu đó ([three.js manual](https://threejs.org/manual/en/webgpurenderer.html)).

Cũng phải nói rõ phản biện. Chính trang so sánh trên (có thiên vị three.js) lại khuyên **Babylon.js hoặc PlayCanvas** cho game, vì hai engine này có sẵn vật lý và âm thanh ([utsubo](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison)). Babylon 9 có sẵn nhiều thứ mà three.js phải tự lắp:
- chuyển hoạt ảnh giữa các khung xương khác nhau (retargeting);
- trình dựng hạt hiệu ứng bằng node;
- bộ điều khiển nhân vật Havok;
- công cụ soi lỗi Inspector.

Nguồn: [Windows Dev Blog](https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0/). Shell Shockers làm bằng Babylon, đã đạt 200 triệu người chơi ([WebGPU.com](https://www.webgpu.com/showcase/shell-shockers-babylonjs-browser-fps/)). Về dung lượng Babylon, các nguồn **mâu thuẫn**. Poki ghi 132 KB nén ([Poki](https://developers.poki.com/guide/web-engine)), còn utsubo ghi khoảng 1,8 MB cho toàn bộ lõi. Vì vậy Babylon là **phương án dự phòng thật**, không phải phương án loại.

Cảnh báo đáng giá nhất đến từ Hordes.io, một MMORPG 3D trên web do một người làm. Tác giả **bỏ three.js** vì nó chậm khi "vẽ nhiều mô hình chuyển động riêng biệt". Đó đúng là tình huống của một cánh đồng đầy thú ([Web Game Dev](https://www.webgamedev.com/interviews/dek-hordes)). Việc gộp lệnh vẽ (batching) đã giúp Hordes rất nhiều. Bài học rút ra: **ngân sách lệnh vẽ (draw call) và số thú trên màn hình phải đo ngay trong spike**, không để sau.

## Thú mượn khung xương theo "khuôn", như Game Freak làm với 1.000 Pokémon

Skeletal animation (hoạt ảnh bằng khung xương) nghĩa là mỗi con thú có một bộ xương ẩn bên trong. Hoạt ảnh là chuyển động của bộ xương đó. Nếu nhiều con dùng chung một bộ xương cùng tên xương, chúng dùng chung được hoạt ảnh. Đây là nâng cấp thật sự, và phải làm dù chọn engine nào.

Game Freak công bố tại CEDEC 2022 cách làm cho hơn 1.000 loài. Mỗi mô hình theo một chuẩn giao hàng có **"khung xương cơ bản"**. Các loài chia theo **khuôn dáng**: người, chó-mèo, rắn, rồng. Hoạt ảnh được sao chép giữa các loài bằng cách ghép xương với xương ([Denfaminicogamer](https://news.denfaminicogamer.jp/kikakuthetower/220825t)). Công cụ của họ còn tự bù chênh lệch kích thước ([Famitsu](https://www.famitsu.com/news/202208/27273621.html)).

Đội nhỏ nên làm y như vậy, ở quy mô nhỏ: 4–6 khuôn.
- Bốn chân nhỏ: chó, mèo, lợn, cừu.
- Bốn chân lớn: bò, ngựa, boss.
- Chim: gà.
- Khối dẻo (slime).
- Loài bay.
- Quái dáng người.

Mỗi khuôn có một bộ khoảng 8–9 hoạt ảnh: đứng, đi, chạy, đánh, trúng đòn, choáng, gục, thắng, giãy khi bị bắt. Trong three.js, các mô hình **cùng tên xương dùng lại được đúng một hoạt ảnh**. Còn công cụ chuyển hoạt ảnh giữa hai bộ xương khác nhau thì bị báo là cho kết quả kém ([three.js forum](https://discourse.threejs.org/t/fixing-skeletonutils-retarget-and-retargetclip-functions/65149)). Vì vậy phải giữ tỉ lệ các con trong cùng khuôn gần giống nhau (kiểu chibi đầu to chân ngắn). Con nào lệch nhiều thì chuyển hoạt ảnh sẵn trong Blender bằng Auto-Rig Pro ([ARP Remap](https://www.lucky3d.fr/auto-rig-pro/doc/remap_doc.html)).

Về nguồn hình, nhân vật người chơi dễ. **KayKit Adventurers** có dáng chibi và dùng một ảnh màu nhỏ, thu được về 128×128. Đi kèm là thư viện **133–161 hoạt ảnh** KayKit, tất cả đều CC0 (miễn phí, dùng thương mại, không cần ghi tên) ([itch.io KayKit](https://kaylousberg.itch.io/kaykit-character-animations)). Riêng động tác "ném" và "ra lệnh" có thể thiếu. Hai động tác này bổ sung từ Mixamo được: Mixamo miễn phí và cho dùng trong game thương mại, nhưng **chỉ hỗ trợ dáng người** ([Adobe Mixamo FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)).

Thú thì khó hơn. **Chưa có thư viện hoạt ảnh bốn chân miễn phí nào dùng chung một bộ xương.** Bộ thú CC0 của Quaternius chỉ có 12 loài, dáng low-poly góc cạnh, không phải chibi ([Poly Pizza](https://poly.pizza/bundle/Animated-Animal-Pack-ILAPXeUYiS)).

Bộ trả phí hợp phong cách Hay Day nhất là **Omabuarts Quirky Series**:
- 180 loài;
- 17–18 hoạt ảnh, có cả Sợ, Trúng đòn, Chết;
- ảnh màu chỉ 16×4 px;
- 4 mức chi tiết (LOD) từ 300 đến 9.000 tam giác;
- giá **299 USD**.

Nhưng **trang bán không ghi điều khoản giấy phép**. Phải xác nhận bằng email hoặc mua qua Unity/Fab trước khi dùng cho sản phẩm có thu phí ([itch.io Omabuarts](https://omabuarts.itch.io/quirky-series-animals-ultimate-pack)). Giấy phép chuẩn của Unity Asset Store không bắt buộc dùng Unity. Nhưng tài sản phải "gắn vào game", người chơi không tách ra tải riêng được ([Unity EULA FAQ](https://assetstore.unity.com/browse/eula-faq)). Với game web, điều đó nghĩa là file GLB phải được nén, đóng gói, và đặt sau lớp đăng nhập.

AI sinh mô hình 3D thì rẻ: khoảng **0,20–0,35 USD mỗi con** trên Meshy/Tripo. Nhưng AI **chỉ tự tạo được hoạt ảnh "đi" cho thú bốn chân** ([Meshy Help](https://help.meshy.ai/en/articles/16231707-how-to-create-3d-animation-with-auto-rigging); [Tripo](https://developers.tripo3d.ai/en/docs/animations-retarget)). Gói miễn phí của Meshy trao quyền sở hữu cho Meshy theo CC BY ([Meshy Terms](https://www.meshy.ai/terms-of-use)). Vì vậy chỉ dùng gói trả phí. Quy trình: vẽ ảnh 2D cùng phong cách trước, sau đó dựng 3D, rồi **gắn tay vào khuôn xương**. Hai hoạt cảnh "gục" và "bị hút vào bóng" nên làm bằng code (thu nhỏ, xoay, tan biến, đổi mắt thành dấu X). Cách này bớt được 1–2 hoạt ảnh cho mỗi loài.

Ngân sách đề xuất cho mỗi con thú, cần đo lại trên máy thật:
- khoảng 5.000 tam giác trở xuống;
- khoảng 40 xương trở xuống;
- 1 vật liệu, 1 ảnh màu ≤256 px;
- tối đa 8–12 con có hoạt ảnh trên màn hình cùng lúc.

## Hiệu ứng chiêu thức phần lớn là shader, không phải hạt

VFX (hiệu ứng hình ảnh) của game này gồm hai phần. Phần phụ là hạt (particle): tia lửa, khói, mảnh vụn. Phần chính là "khoảnh khắc đẹp": tia hút bóng, thú hoá thành ánh sáng, cột lửa, tia sét. Phần chính làm tốt hơn bằng **shader** (đoạn mã tô màu chạy trên card đồ hoạ), dùng các kỹ thuật tan biến theo ngưỡng, viền sáng theo góc nhìn (fresnel), ảnh chạy khung (flipbook) và vệt ribbon.

Cho phần hạt, **three.quarks** là lựa chọn ít rủi ro nhất:
- giấy phép MIT;
- có vệt (trail), hạt con (sub-emitter), gộp lệnh vẽ;
- đọc được hiệu ứng từ Unity;
- có trình dựng trực quan xuất ra JSON, AI đọc sửa được.

Bản 0.17.1 cần three ≥ r182 ([npm](https://registry.npmjs.org/three.quarks/latest)). Hỗ trợ WebGPU vẫn **còn trong lộ trình** ([README](https://raw.githubusercontent.com/Alchemist0823/three.quarks/master/README.md)). Đó chính là lý do ghép với `WebGLRenderer`. three-nebula mới hồi sinh tháng 8/2026, ra 7 bản trong khoảng 7 tuần ([releases](https://github.com/creativelifeform/three-nebula/releases)). Nó hấp dẫn nhưng API chưa ổn định, nên chưa đặt cược vào.

Ảnh cho hiệu ứng lấy từ các bộ CC0: Kenney Particle Pack gồm 80 ảnh ([Kenney](https://kenney.nl/assets/particle-pack)) và Brackeys VFX Bundle. Nên gom các ảnh này vào 1–2 ảnh gộp (atlas).

Trên iPad gen 7, nút thắt của hiệu ứng là **lượng điểm ảnh phải tô**. Màn hình là 2160×1620 ([Apple](https://support.apple.com/kb/SP807)), và các lớp trong suốt chồng lên nhau rất tốn. Luật cứng cho bản iPad:
- vẽ ở độ phân giải giảm: DPR (tỉ lệ điểm ảnh) khoảng 1,0 thay vì 2;
- không bật đèn động cho từng viên đạn;
- tắt bloom (hiệu ứng toả sáng toàn màn), thay bằng tấm sáng vẽ sẵn.

ARM đo bloom chuẩn tốn **khoảng 3 ms mỗi khung hình**, còn cách giả bằng tấm sáng tốn **dưới 1 ms** ([ARM](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/post-processing-effects-on-mobile-optimization-and-alternatives)). Một dự án nhỏ đã hết lỗi iPad cũ tự tải lại chỉ nhờ hạ DPR của máy tính bảng xuống 1,0 ([GitHub PR](https://github.com/jpwarner-sys/blockball/pull/46)).

Hoạt cảnh ném bóng nên theo "ngữ pháp" Pokémon: **số lần bóng lắc = số lần kiểm tra đã qua trước khi thú thoát**. Tối đa 4 lần kiểm tra. Nếu "bắt chí mạng" thì bóng lắc ngay trên không ([Dragonfly Cave](https://www.dragonflycave.com/mechanics/gen-ix-capturing/)). Mỗi lần lắc ứng với một lần tung xúc xắc thật, và các xác suất nhân lại đúng bằng con số hiển thị. Nhờ vậy vừa hồi hộp vừa trung thực.

Palworld là ví dụ nên tránh. Hai nguồn datamine (bóc dữ liệu game) **mâu thuẫn nhau** về con số % trên tâm ngắm. Một nguồn nói nó thấp hơn xác suất thật ([Palworld Wiki](https://palworld.wiki.gg/wiki/Capture_Power)), nguồn kia nói cao hơn ([LootLab](https://lootlab.app/palworld/guides/capture-formula/)). Nhưng cả hai đều đồng ý: **% hiển thị không phải xác suất thật**. Với học sinh, con số phải trung thực, và phải do một hàm `fn_*` duy nhất tính ra.

"Độ đã tay" (juice) lấy theo các con số đã được kiểm chứng:
- dừng hình khi trúng đòn (hit-stop): khoảng **60–90 ms**;
- rung màn hình: có xoay nhẹ, dùng nhiễu mượt, không giật ngẫu nhiên ([valdemird](https://valdemird.com/blog/game-feel-on-the-web/));
- nhấp nháy toàn màn: không quá **3 lần/giây** ([Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/avoid-flickering-images-and-repetitive-patterns/));
- có nút tắt rung màn hình.

## Colyseus ở Singapore làm trọng tài, Postgres giữ công thức

Netcode là phần giúp người chơi thấy nhau di chuyển và cùng đánh boss. Game có thưởng xu thật, nên server phải là trọng tài duy nhất (server-authoritative). Máy khách chỉ gửi *ý định* ("tôi ném bóng vào con này"), không bao giờ gửi *kết quả*.

**Supabase Realtime không dùng được cho việc di chuyển.** Mỗi tin nhắn tính tiền cho cả người gửi lẫn từng người nhận ([Supabase](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages)). Gói Team bị chặn ở **2.500 tin/giây** ([Supabase limits](https://supabase.com/docs/guides/realtime/limits)). Chỉ một vùng bản đồ có 50 người chơi, mỗi người gửi vị trí 10 lần/giây, đã sinh khoảng 25.000 tin/giây, gấp 10 lần mức trần. Supabase Realtime vẫn hợp cho việc thưa: mời vào party, báo bạn online, báo "bạn nhận X xu" ngay trong cùng giao dịch cộng xu.

**Colyseus** là ứng viên duy nhất có đủ mọi thứ cùng lúc:
- chạy bằng TypeScript, giấy phép MIT;
- phòng chơi có server làm trọng tài;
- tự đồng bộ phần thay đổi ở dạng nhị phân;
- tự nối lại khi mạng chập chờn (từ bản 0.17);
- dự đoán chuyển động phía máy khách (từ bản 0.18, ra ngày 20/8/2026);
- thư viện cho trình duyệt chỉ khoảng **58 KB**.

Nguồn: [Colyseus 0.18](https://colyseus.io/blog/colyseus-018-is-here/); [Colyseus 0.17](https://colyseus.io/blog/colyseus-017-is-here/). Game đã ra mắt trên Colyseus gồm Bloxd.io và Pixels.xyz ([colyseus.io](https://colyseus.io/)). Bloxd.io có khoảng 14.800 người online trung bình và lan tới học sinh qua hơn 40 tên miền "unblocked" dùng được trên mạng trường học ([VIVERSE](https://news.viverse.com/post/bloxd-io-free-browser-game-on-viverse)).

Các đối thủ bị loại vì những lý do sau:
- **Nakama** và **SpacetimeDB** mang theo cơ sở dữ liệu riêng. Như vậy sẽ có hai nguồn sự thật, trái luật §2.0.
- **Photon** gói thường chỉ chuyển tiếp tin nhắn, không làm trọng tài. Muốn làm trọng tài phải mua gói Enterprise ([Photon](https://www.photonengine.com/realtime/pricing)).
- **Hathora** đã **đóng cửa ngày 5/5/2026** ([GamesBeat](https://gamesbeat.com/hathora-acquired-will-exit-game-infrastructure-biz-and-hand-over-customers-to-nitrado/)).
- WebTransport (giao thức mạng mới) chỉ có từ Safari 26.4 ([WebKit](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/)). Vậy iPad gen 7 **bắt buộc dùng WebSocket**.

Cách bố trí server như sau. Mỗi vùng bản đồ là một `ZoneRoom`, tối đa khoảng 50–80 người. Khi đầy thì mở thêm "kênh" song song, giống các MMO cổ điển. Vị trí gửi đi 10 lần/giây. Người chơi khác được hiển thị trễ khoảng 100 ms cho mượt, và độ trễ này "thường không nhận ra" ([Gambetta](https://www.gabrielgambetta.com/entity-interpolation.html)). Hordes.io chứng minh 10 lần/giây vẫn "chơi được" ([Web Game Dev](https://www.webgamedev.com/interviews/dek-hordes)).

Khi trưởng party bấm đánh boss, server mở một `BossRoom` riêng và giữ chỗ đúng cho 2–4 thành viên. Ping từ Singapore tới TP.HCM khoảng **43,5 ms** ([WonderNetwork](https://wondernetwork.com/pings/Singapore/Ho%20Chi%20Minh%20City)). Server Colyseus nên đặt **cùng vùng với Supabase**, để mỗi lần gọi hàm Postgres chỉ tốn vài ms.

Chuỗi đăng nhập:
1. Máy khách đăng nhập Supabase như hiện nay.
2. Máy khách gửi token khi vào phòng.
3. Server kiểm tra token qua JWKS (khoá công khai của Supabase) ([Supabase](https://supabase.com/docs/guides/auth/signing-keys)).
4. Server ghi kết quả bằng `supabase.rpc('fn_game_*')` với khoá bí mật chỉ server có.

Mỗi sự kiện có một `event_id` duy nhất, nên mạng chập chờn gửi lại cũng không bao giờ cộng xu hai lần. Các hàm `fn_game_*` phải **thu hồi quyền `anon` một cách tường minh**. CLAUDE.md đã ghi một lần bị cắn ở chỗ này.

| Phương án ở ~500 người online | Ước chi phí/tháng | Ghi chú |
|---|---|---|
| **Colyseus tự chạy, VPS Singapore 2 vCPU/4 GB + máy thử 6 USD** | **≈ 30 USD** | Giá DigitalOcean ([DO](https://www.digitalocean.com/pricing/droplets)). Sức chịu tải phải test |
| Colyseus Cloud | từ 15 USD | Chưa xác nhận có vùng Singapore ([Colyseus](https://colyseus.io/pricing/)) |
| Cloudflare Durable Objects | ≈ 25–65 USD | Phải tự viết phần đồng bộ trạng thái |
| Photon 500 người | 95 USD | Không làm trọng tài, nên trượt yêu cầu |
| SpacetimeDB Pro | ≈ 400–800 USD | Ước tính; thêm một DB thứ hai |
| Nakama trên Heroic Cloud | ≈ 600+ USD | Số từ bên thứ ba |

## Năm quyết định CEO cần chốt trước khi code

Quyết định quan trọng nhất là **kiểu đánh nhau**. Nó quyết định công thức nằm ở đâu. Hai trường hợp:
- **Theo lệnh** (turn-based, hoặc ATB: mỗi chiêu có thời gian hồi): mỗi hành động là một lần gọi `fn_game_*`. Postgres tính sát thương và thưởng trong một giao dịch. Luật "một nguồn công thức duy nhất" được giữ nguyên. Tải ước khoảng 70 lần gọi/giây khi 200 người cùng đánh, mỗi người 3 giây một lệnh. Con số này phải đo lại trên gói Supabase hiện tại.
- **Thời gian thực** kiểu Palworld: sát thương phải tính 20 lần/giây ngay trong server Colyseus. Postgres chỉ còn nhận bản tổng kết trận để trả thưởng. Như vậy công thức nằm ở hai nơi, trái §2.0.

Pokémon và Prodigy đều đánh theo lượt. Riêng Prodigy đạt khoảng **9 triệu người chơi/tháng** mà không cần 3D ([Wikipedia](https://en.wikipedia.org/wiki/Prodigy_Math_Game)).

| # | Câu cần CEO chốt | CTO đề xuất | Vì sao quan trọng |
|---|---|---|---|
| 1 | Đánh nhau theo lệnh/lượt hay thời gian thực? | **Chạy tự do trên bản đồ, nhưng chiêu là lệnh có hồi chiêu ≥1–2 giây, server phân xử từng lệnh qua `fn_*`** | Giữ luật §2.0. Hoạt cảnh 1–2 giây che được độ trễ mạng |
| 2 | iPad gen 7 là "phải chạy mượt" hay "chạy được, bản nhẹ"? | Mức "thấp": DPR 1,0, không bloom, ít thú trên màn hình | Quyết định ngân sách hình ảnh cho mọi máy khác |
| 3 | Game có gắn với việc học không (ví dụ trả lời đúng thì thú yếu đi)? | Có, nhưng tách rõ | Nếu có, dữ liệu đo học tập phải mang nhãn `mon` (§1.6). Còn kinh tế game thì theo luật ví xu chung |
| 4 | Nguồn hình thú: mua gói (khoảng 299 USD, xác nhận giấy phép trước), AI trả phí, hay CC0? | Mua Omabuarts sau khi xác nhận giấy phép. AI cho loài hiếm. CC0 để làm mẫu | Hình thú là thứ học sinh nhìn thấy đầu tiên, và là việc tốn công nhất |
| 5 | Có cho gõ chữ tự do để chat không? | **Không** ở bản đầu. Chỉ câu dựng sẵn và biểu cảm | Người chơi là học sinh lớp 6–12. Tránh việc phải kiểm duyệt |

Nên thêm một luật nền cho xu: **trần xu/ngày cho mỗi học sinh nằm ngay trong Postgres**. Khi đó ngay cả server có lỗi cũng không in xu vô hạn được. Cũng nên tránh mô hình "trả tiền để tiến bộ". Prodigy đã bị khiếu nại lên FTC vì chuyện này ([Wikipedia](https://en.wikipedia.org/wiki/Prodigy_Math_Game)).

## Bản thử 1–2 tuần thay ý kiến bằng số đo

Spike là một bản thử nhỏ, làm nhanh chỉ để đo, xong có thể bỏ. Dưới đây là đề xuất của CTO. Các ngưỡng đạt là mục tiêu tự đặt, dựa trên chuẩn Poki và các con số ở trên, không phải chuẩn công bố cho iPad gen 7.

| Bước | Làm gì | Đo gì | Ngưỡng đạt đề xuất |
|---|---|---|---|
| 1. Cảnh đồng cỏ | three.js r186 `WebGLRenderer`. Đồng cỏ có 30 cây/bụi vẽ bằng instancing (vẽ nhiều bản sao trong một lệnh). Có 1 nhân vật KayKit, 1 thú đồng hành, 5 thú hoang GLB có xương, hoạt ảnh chuyển mượt | FPS, số lệnh vẽ, bộ nhớ tab (Safari Web Inspector) | ≥30 FPS ổn định ([Poki](https://developers.poki.com/guide/requirements-quality)). Bộ nhớ dưới khoảng 300 MB |
| 2. Tăng tải | Nâng dần lên 8, 12, 20 thú có hoạt ảnh | Điểm FPS rơi dưới 30 | Biết được số thú tối đa trên màn hình |
| 3. Ném bóng | Hoạt cảnh đầy đủ: ném, dừng hình, tia hút, tan biến, 3 lần lắc. Dùng three.quarks + shader | FPS lúc hiệu ứng nặng nhất | Không tụt dưới 30 |
| 4. Chạy lâu | Để chơi liên tục 20 phút, có âm thanh, xoay màn hình vài lần (xoay từng bị báo gây rò bộ nhớ ([Apple Forums](https://developer.apple.com/forums/thread/668999))) | Tab có tự tải lại không | 0 lần tải lại |
| 5. Tải lần đầu | Mạng 4G thật, xoá bộ nhớ đệm | Số MB và số giây tới khi chơi được | ≤5 MB ([Poki](https://developers.poki.com/guide/requirements-quality)). Dưới 10 giây |
| 6. Mạng | Colyseus trên VPS Singapore 24 USD. 50–100 người chơi giả. Mỗi lần ném gọi `fn_game_bat_thu` thật | CPU server, độ trễ khứ hồi, CPU Supabase | CPU dưới 50%. Kết quả bắt về máy dưới 300 ms |

Chạy bước 1–5 trên ba máy: iPad gen 7 (Safari 18), một điện thoại Android tầm trung, và một máy tính ở trường. Nếu three.js trượt bước 1–2 vì lệnh vẽ (đúng vết xe Hordes.io), dựng lại cảnh đó bằng Babylon 9 để so. Hai bản cùng một cảnh sẽ cho câu trả lời bằng số thay cho tranh luận.

## Kết luận

Engine gần như không phải điểm khó. Mọi engine JS nhẹ đều vẽ được cảnh này. Ba điểm khó thật nằm ở chỗ khác. Thứ nhất là **bộ nhớ Safari trên chip A10**: chưa ai công bố số đo, chỉ tự đo mới biết. Thứ hai là **dây chuyền làm thú theo khuôn xương**: thị trường chưa có sẵn, mỗi khuôn phải tự dựng một lần. Thứ ba là **quyết định kiểu đánh nhau**: đây là câu hỏi về thiết kế game, nhưng nó quyết định luôn kiến trúc dữ liệu.

Nếu chọn đánh theo lệnh, cả hệ thống giữ được nguyên tắc cũ của BK. Postgres là trọng tài cuối cùng. Server game chỉ lo di chuyển và đếm giờ. Máy khách chỉ lo vẽ. Tiền lệ cho thấy đội 1–5 người vẫn làm được game web 3D nhiều người chơi, với hàng chục nghìn người online. Nhưng chưa ai làm được một game bắt thú 3D như vậy. Nên coi đây là sản phẩm có rủi ro thể loại, không phải rủi ro kỹ thuật. Chính vì thế bản thử trên iPad phải đi trước mọi cam kết về nội dung và mỹ thuật.
