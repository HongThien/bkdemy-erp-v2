# Hướng dẫn chơi — bản để duyệt

> Nguồn thật: `src/screens/hocsinh/huongdan/noiDungHuongDan.ts` (hướng dẫn) và `src/screens/hocsinh/tutorial/noiDungTutorial.ts` (tutorial). File này chỉ để đọc/duyệt — sửa chữ ở nguồn rồi chạy lại `node scripts/xuat-huong-dan-md.mjs`.

**Luật giọng:** thân bài FORMAL ở mọi style. Style game chỉ đổi TÊN + TÓM TẮT (dòng *Giọng game*). Số liệu theo code/DB ngày 03/10/2026; số chưa chốt thì không nêu.

Trang đầu: **Hướng dẫn chơi** — Mọi chức năng của app và cách vận hành, đọc một lần là nắm.  
*Giọng game:* **Sổ tay phiêu lưu** — Mọi bí kíp của thế giới BK nằm ở đây — chọn một mục để đọc.

## Nhóm: Bắt đầu
*Làm quen màn hình, nhân vật và giao diện*

### 1. Màn chính
**Tóm tắt:** Các khu trên màn chính và cách di chuyển giữa chúng.
*Giọng game:* **Căn cứ của em** — Nhìn một lượt xem căn cứ có những gì và đi đâu.

**Bố cục**
- Trên cùng là thẻ Thế giới BK, ngay dưới là thanh chọn môn (Toán, KHTN, Tiếng Anh).
- Khối “Học tập” thay đổi theo môn đang chọn: Học tập, Thông tin học tập, Sổ tay kiến thức, Làm đề thi thử và các ô bài của thầy cô.
- Khối “Giải trí” dùng chung cho mọi môn: Thế giới BK, Nhiệm vụ, Thư viện BK, May mắn, Thành tựu, Ví xu. Đổi môn thì khối này không đổi.

**Các nút khác**
- Chạm ảnh đại diện để mở Hồ sơ (cấp bậc, huy hiệu, đổi ảnh, giao diện).
- Chuông là Hòm thư thông báo; nút ⋯ có đổi mật khẩu.
- Khi có ca bổ trợ sắp tới giờ, thẻ lịch hiện ngay trên màn chính kèm nút “Vào ca”.

**[LƯU Ý] Lưu ý**
- Một số ô hiện “Sắp có” hoặc bị khoá với môn chưa có kho câu hỏi (ví dụ Tiếng Anh). Đó là trạng thái của môn, không phải lỗi.

### 2. Nhân vật và giao diện
**Tóm tắt:** Chọn nhân vật, chọn giao diện và bật hoặc tắt hiệu ứng game.
*Giọng game:* **Nhân vật & phong cách chơi** — Chọn người hùng của em và kiểu giao diện hợp gu.
*Tutorial tương ứng:* chặng `giao_dien`

**Hai kiểu dùng app**
App có hai cách dùng: kiểu mặc định (nền trơn, chữ gọn, không hiệu ứng) dành cho em thích đơn giản; kiểu game (bản đồ phiêu lưu, nhân vật, quái vật, hiệu ứng) dành cho em thích chơi. Nội dung học và cách tính điểm giống hệt nhau ở cả hai kiểu.

**Cách đổi**
- Vào Hồ sơ rồi chọn Giao diện: chọn kiểu giao diện, chế độ sáng hoặc tối, hình nền.
- Công tắc “Hiệu ứng game” tắt thì bản đồ phiêu lưu và màn đấu hoạt hình được thay bằng danh sách thường.
- Mức đồ hoạ (Thấp, Vừa, Cao) giúp máy yếu chạy mượt hơn.

**Nhân vật chính**
- Lần đầu vào khu Học tập, em chọn một trong 6 nhân vật chính. Nhân vật xuất hiện trên bản đồ và trong màn đấu.
- Có thể đổi nhân vật bằng nút ở đầu khu Học tập; việc đổi không ảnh hưởng điểm hay tiến độ.

## Nhóm: Học tập
*Các cách luyện và làm bài*

### 3. Lượt học thật
**Tóm tắt:** Điều kiện để một lượt luyện được tính vào chuỗi, nhiệm vụ và Điểm Rank.
*Giọng game:* **Lượt luyện hợp lệ** — Luyện thế nào thì mới được ghi vào chiến tích.
*Tutorial tương ứng:* chặng `luot_that`

**Khái niệm**
Chuỗi làm bài, nhiệm vụ và Điểm Rank của Thử thách đều dựa trên “lượt học thật”. Một lượt luyện (10 câu) chỉ được tính khi em thực sự làm bài, không làm cho có.

**[LUẬT] Ba điều kiện (cùng đúng)**
- Làm ít nhất 5 câu.
- Đúng ít nhất một nửa số câu đã làm (lượt 10 câu thì đúng từ 5 câu).
- Trung bình mỗi câu từ 6 giây trở lên, tính từ lúc mở lượt đến câu cuối. Làm quá nhanh thì lượt không được tính.

**Loại bài nào được tính**
- Chỉ các lượt luyện thêm trên app: Luyện dạng yếu, Học theo chủ đề và Thử thách.
- ET, BTVN, bài trên lớp và Học từ đầu không nằm trong nhóm này (chúng có cách tính riêng).

**Khi lượt không được tính**
- Em vẫn học được và vẫn có kết quả đúng sai, chỉ là lượt đó không cộng vào chuỗi, nhiệm vụ hay Điểm Rank. Không có hình phạt.
- App hiển thị lý do nhẹ nhàng: ít câu, đúng chưa đủ, hoặc làm quá nhanh.

**[MẸO] Câu hỏi không lặp**
- Hệ thống không ra lại câu em đã gặp khi dạng đó còn câu mới. Hết câu mới thì mới ra lại câu em gặp lâu nhất.

### 4. Khu Học tập
**Tóm tắt:** Năm cách luyện: Học theo chủ đề, Luyện dạng yếu, Đấu trường BK, Chinh phục BK, Giải Vô địch BK.
*Giọng game:* **Năm đảo phiêu lưu** — Mỗi đảo là một cách chiến đấu và luyện tập.
*Tutorial tương ứng:* chặng `hoc_tap`

**Năm ô**
- Học theo chủ đề: bản đồ phiêu lưu theo chủ đề em đang học (xem mục riêng).
- Luyện dạng yếu: hệ thống chọn câu tập trung vào các dạng em còn yếu.
- Đấu trường BK, Chinh phục BK, Giải Vô địch BK: các chế độ thi đấu (xem mục “Đấu trường, Chinh phục, Giải vô địch”).

**Quy ước chung của một lượt luyện**
- Mỗi lượt gồm 10 câu; làm bao nhiêu lượt cũng được.
- Làm xong là biết đúng sai và có lời giải ngay.
- Lượt có được tính vào chuỗi, nhiệm vụ hay Rank hay không do điều kiện “Lượt học thật” quyết định.

**[LƯU Ý] Môn chưa có kho câu hỏi**
- Môn nào chưa có kho câu hỏi (ví dụ Tiếng Anh) thì ô luyện tương ứng bị khoá và có thông báo; ô bài do thầy cô phát hành vẫn dùng được.

### 5. Học theo chủ đề (bản đồ phiêu lưu)
**Tóm tắt:** Bản đồ gồm lục địa, chặng đường và quái vật: mỗi dạng bài là một màn.
*Giọng game:* **Giải cứu thế giới BK** — Đi qua lục địa, đánh bại quái vật ở từng chặng.
*Tutorial tương ứng:* chặng `chu_de`

**Cấu trúc bản đồ**
- Thế giới: toàn bộ các chủ đề của môn. Mỗi chủ đề là một lục địa.
- Lục địa: các chuyên đề của chủ đề, mỗi chuyên đề là một công trình trên đường.
- Chặng đường: các dạng bài của chuyên đề, mỗi dạng là một công trình; chạm vào công trình là vào thẳng màn đấu.
- Quái vật: mỗi cụm kiến thức trong dạng bài là một quái; hạ hết đội hình là hoàn thành dạng.

**Ba trạng thái của một dạng**
- Chưa đo: em chưa làm đủ để hệ thống đánh giá. Vẫn vào học được.
- Yếu: quái còn máu, nên luyện thêm.
- Đạt: đã chinh phục, có cờ cắm trên công trình. Vẫn có thể ôn lại.

**Trong màn đấu**
- Mỗi lượt có nhiều câu hỏi. Cứ 3 câu thì tung một chiêu theo số câu đúng: 3/3 là chiêu mạnh nhất, 2/3 chiêu mạnh, 1/3 chiêu nhẹ, 0/3 thì quái đánh trả và hồi một chút máu.
- Tổng sát thương bằng tổng số câu đúng: mỗi câu đúng tương ứng một đòn.
- Kết quả của lượt cho biết lượt có được tính hay không và cập nhật độ nắm dạng khi em quay lại bản đồ.

**[MẸO] Độ nắm dạng**
- Độ nắm dạng (phần trăm) được tính từ các lần làm gần nhất của em trên dạng đó; có nhiều lần đo thì độ tin cậy càng cao.

### 6. Luyện dạng yếu
**Tóm tắt:** Hệ thống tự chọn 10 câu, ưu tiên các dạng em còn yếu.
*Tutorial tương ứng:* chặng `tu_luyen`

**Cách hoạt động**
- Mỗi câu có xác suất khoảng 60% được lấy từ nhóm dạng yếu hơn và khoảng 40% từ mọi dạng em đã có số đo, nên vừa sửa chỗ yếu vừa ôn chỗ đã học.
- Em cần đã có số đo (đã làm bài ở lớp hoặc trên app); nếu chưa, app báo chưa có dữ liệu.

**Theo chủ đề**
- Em cũng có thể tự chọn một dạng để luyện riêng: danh sách xếp dạng yếu nhất lên đầu, kèm phần trăm độ nắm.
- “Chưa đánh giá” nghĩa là dạng đó chưa có lần đo nào gần đây.
- Mức độ nắm: Đạt từ 80% trở lên, Cần luyện từ 50% đến 80%, Yếu dưới 50%.

### 7. Thử thách
**Tóm tắt:** Lượt luyện có điểm thưởng: đúng từ 80% là vượt Thử thách và có Điểm Rank.
*Giọng game:* **Đấu trường thử thách** — Vượt thử thách để nhận điểm Rank và mở rương nhiệm vụ.
*Tutorial tương ứng:* chặng `thu_thach`

**[LUẬT] Luật đang áp dụng**
- Một lượt gồm 10 câu do hệ thống chọn dạng; em không tự chọn dạng.
- Đúng từ 8 câu trở lên là vượt Thử thách.
- Điểm Rank: 8 câu đúng được 10 điểm, 9 câu được 20 điểm, 10 câu được 30 điểm.
- Mỗi ngày và mỗi tháng có trần Điểm Rank từ Thử thách. Hết trần vẫn làm tiếp được nhưng không có thêm điểm.

**Liên quan đến phần khác**
- Vượt Thử thách là điều kiện của nhiều nhiệm vụ và của huy hiệu Hercules.
- Lượt phải đạt điều kiện “Lượt học thật” thì điểm mới được tính.

**[LƯU Ý] Sắp thay đổi**
- Thử thách đang được nâng cấp thành đấu trường nhiều trận. Khi chính thức đổi, luật mới sẽ được cập nhật tại đây và trong màn Thử thách.

### 8. Đấu trường, Chinh phục, Giải vô địch
**Tóm tắt:** Các chế độ thi đấu dùng game Đấu Từ: mỗi câu chỉ được trả lời một lần.
*Giọng game:* **Sàn đấu BK** — Đấu, leo tháp và tranh ngôi vô địch.
*Tutorial tương ứng:* chặng `dau_chinh_phuc`

**[LUẬT] Luật chung**
- Mỗi câu chỉ bấm một lần; chọn sai là khoá cả câu.
- Câu hỏi là trắc nghiệm 4 đáp án, có giới hạn thời gian theo môn.
- Điểm trận phụ thuộc tốc độ trả lời và chuỗi trả lời đúng liên tiếp.

**Ba chế độ**
- Đấu trường BK: thi đấu với người chơi khác hoặc với máy.
- Chinh phục BK: leo tháp. Tháp tổng ở giữa, các tháp chủ đề xung quanh, mỗi tháp có bảng xếp hạng riêng (hôm nay và kỷ lục). Có chế độ Sinh tồn và Vô tận.
- Giải Vô địch BK: giải đấu có đăng ký, nhánh đấu và lịch; mục “Đấu với máy” dẫn vào Thử thách.

**[LƯU Ý] Điểm có được tính vào Rank không?**
- Hiện điểm của các chế độ này chưa cộng vào Rank, chuỗi, nhiệm vụ hay độ nắm dạng. Chúng là sân chơi thi đấu riêng.

### 9. Học từ đầu, bổ trợ và bù
**Tóm tắt:** Ca học thêm khi em yếu, nghỉ buổi hoặc vào lớp giữa chừng.
*Giọng game:* **Ca hồi phục** — Lấy lại nền tảng khi em bị lỡ hoặc còn yếu.

**Ba loại ca**
- Bổ trợ yếu: ca học thêm cho các dạng em còn yếu.
- Bù: học lại nội dung của buổi em đã nghỉ.
- Đuổi: dành cho em vào lớp giữa chừng, học lại các dạng đã qua.
- Lịch ca sắp tới và nút “Vào ca” hiện ngay trên màn chính.

**Học từ đầu**
- Chọn chủ đề, chuyên đề rồi đến từng dạng. Mỗi dạng gồm Lý thuyết, Luyện tập (10 câu, không giới hạn lượt, không tính độ nắm) và Test (tính độ nắm).
- Dạng kế tiếp mở khi em đã nộp Test của dạng ngay trước; không cần đạt điểm.

**[LƯU Ý] Lưu ý**
- Bài trong ca bù chỉ dùng câu trắc nghiệm. Dạng nào chưa có câu trắc nghiệm thì app báo em học dạng đó trên giấy với thầy cô.
- Các lượt trong ca này không được tính vào chuỗi, nhiệm vụ và Điểm Rank.

### 10. Bài của thầy cô và công cụ học
**Tóm tắt:** ET, BTVN, bài trên lớp, đề thi thử, Sổ tay kiến thức và Thông tin học tập.

**Bài thầy cô phát hành**
- ET: bài kiểm tra do thầy cô phát, làm theo chế độ thi. Đáp án và lời giải chỉ hiện sau khi nộp.
- BTVN: bài về nhà, hiện đáp án ngay khi làm.
- Bài tập trên lớp: phần luyện theo giáo trình của buổi học.
- Làm đề thi thử: đề do thầy cô phát hành cho lớp, có tính giờ (hiện dành cho khối 10 đến 12).

**Sổ tay kiến thức**
- Tra lý thuyết và bài mẫu theo từng dạng. Tìm bằng cách gõ tên (không cần dấu) hoặc lọc theo Chủ đề, Chuyên đề, Dạng.
- Thẻ Công thức hiện trước, thẻ lý thuyết hiện sau.

**Thông tin học tập**
- Dạng đang yếu của em.
- Lịch sử làm bài 30 ngày gần nhất.
- Bảng xếp hạng với ba tab; “đạt” ở bảng này nghĩa là làm ít nhất 3 câu và đúng từ 75% trở lên.

## Nhóm: Thành tích & phần thưởng
*Điểm, cấp bậc, huy hiệu, xu*

### 11. Chuỗi làm bài  — *(Sắp có)*
**Tóm tắt:** Số ngày liên tiếp em có ít nhất một lượt học thật.
*Giọng game:* **Ngọn lửa chuỗi** — Giữ lửa mỗi ngày để lên mốc chuỗi.

**[LUẬT] Cách tính**
- Chuỗi dùng chung cho mọi môn và tính theo giờ Việt Nam.
- Một ngày được tính khi em có ít nhất một lượt học thật.
- Ngày trung tâm công bố nghỉ: chuỗi không đứt và cũng không tăng.
- Hôm nay chưa học: chuỗi chưa đứt, em còn cả ngày để học.

**Khi lỡ một ngày**
- Em có 48 giờ để sửa: các lượt học thật thừa (lượt thứ hai trở đi trong ngày) trong hai ngày kế tiếp sẽ bù cho ngày lỡ cũ nhất.
- Hết hạn mà chưa bù thì hệ thống tự dùng thẻ đóng băng: mỗi tháng có 2 thẻ, không cộng dồn sang tháng sau.
- Hết thẻ thì chuỗi đứt và bắt đầu lại.

**Các mốc**
- Mốc chuỗi: 3, 7, 14, 30, 50, 100, 200 và 365 ngày. Các mốc lớn được đưa tin lên Thế giới BK.

**[LƯU Ý] Tình trạng**
- Phần tính chuỗi đã hoạt động ở hệ thống; màn hiển thị ngọn lửa trên màn chính đang được hoàn thiện.

### 12. Nhiệm vụ
**Tóm tắt:** Việc theo ngày, tuần và tháng; hoàn thành để lấy Điểm Chặng, EXP và mở rương.
*Giọng game:* **Bảng nhiệm vụ** — Nhận việc mỗi ngày, mở rương mỗi tuần, chạm chặng mỗi tháng.
*Tutorial tương ứng:* chặng `nhiem_vu`

**Nhiệm vụ ngày**
- N1: vượt một Thử thách (từ 80%, lượt được tính).
- N2: cứ 20 câu đúng mới (câu em chưa từng làm đúng) trong các lượt được tính là một việc.
- N3: cứ 2 câu đúng ở dạng em từng làm sai trong 14 ngày gần đây là một việc.
- Việc ngày chưa làm có thể treo lại tối đa 3 ngày.

**Nhiệm vụ tuần**
- T1: nộp BTVN đúng hạn cả tuần.
- T2: có ít nhất một bài ET đạt từ 80%.
- T3: vượt Thử thách ở 4 ngày khác nhau.
- T4: lấp một lỗ hổng: dạng yếu đầu tháng đã lên mức đạt.
- Một tháng chia 4 tuần (ngày 1 đến 7, 8 đến 14, 15 đến 21, 22 đến hết tháng); việc chưa xong được dồn đến hết tháng.

**Nhiệm vụ tháng**
- M1: Mock Test (MT) tăng hạng so với lần trước, hoặc vào top 30% khối.
- M2: vượt Thử thách ở 15 ngày trong tháng.

**[PHẦN THƯỞNG] Phần thưởng**
- Mỗi việc cộng Điểm Chặng. Cứ 50 Điểm Chặng lên 1 cấp của Chặng tháng (tối đa 30 cấp); mỗi cấp thưởng EXP, các mốc cấp 10, 20, 30 thưởng thêm.
- Rương tuần mở khi hoàn thành 12 việc trong tuần: thêm Điểm Chặng và EXP.
- Một lượt luyện chỉ hoàn thành một việc và ưu tiên việc cũ nhất còn treo.

**[LƯU Ý] Lưu ý**
- Nhiệm vụ hiện mở cho môn Toán; các môn khác sẽ mở sau. Nhiệm vụ không cộng Điểm Rank.

### 13. Rank
**Tóm tắt:** Cấp bậc theo môn, tích luỹ trong một mùa; lên bậc không bao giờ bị tụt trong mùa.
*Giọng game:* **Cấp bậc chiến binh** — Từ Novice đến Supreme God: leo từng bậc trong mùa.
*Tutorial tương ứng:* chặng `rank`

**[LUẬT] Điểm Rank đến từ đâu**
- ET: mỗi bài ET được chấm là 100 điểm.
- BTVN: nộp đúng hạn 100 điểm, nộp muộn 50 điểm.
- Mock Test (MT) sát hạch tại trung tâm: từ 500 đến 1000 điểm theo thứ hạng.
- Thử thách: 10, 20 hoặc 30 điểm theo số câu đúng (xem mục Thử thách).

**Mùa và bậc**
- Một mùa kéo dài một năm, từ 1 tháng 7 đến 30 tháng 6 năm sau. Hết mùa, em bắt đầu lại từ Novice.
- Có 10 bậc, từ thấp đến cao như bảng dưới. Điểm cần cho từng bậc xem trong màn Rank (mỗi môn có thể khác nhau).
- Các bậc đầu có 3 sao. Đã lên bậc thì không tụt bậc trong mùa.

**Bảng đua tháng**
- Xếp hạng theo Điểm Rank kiếm được trong tháng, giữa các em cùng khối và cùng môn. Bảng này không làm đổi bậc.

**[LƯU Ý] Lưu ý**
- Rank hiện mở cho môn Toán; các môn khác sẽ mở sau.

**Mười bậc Rank (thấp đến cao)**

| Thứ tự | Bậc |
|---|---|
| 1 | Novice |
| 2 | Soldier |
| 3 | Captain |
| 4 | General |
| 5 | Hero |
| 6 | Legend |
| 7 | King |
| 8 | Emperor |
| 9 | God of War |
| 10 | Supreme God |

### 14. Huy hiệu, Thành tựu và Album
**Tóm tắt:** Tám huy hiệu ghi nhận chuyên cần, bài tập và tiến bộ theo từng tháng.
*Giọng game:* **Bộ sưu tập huy hiệu** — Tám huy hiệu thần thoại, mỗi cái nâng tới 5 sao.
*Tutorial tương ứng:* chặng `huy_hieu`

**Tám huy hiệu**
- Helios: chuyên cần, đi học đủ các buổi.
- Chronos: nộp đủ BTVN đúng hạn.
- Athena: kết quả ET tốt.
- Zeus: Mock Test (MT) thuộc nhóm đầu khối.
- Phoenix: bứt phá, hạng MT tiến bộ so với đầu mùa.
- Hercules: vượt Thử thách nhiều ngày trong tháng.
- Hephaestus: lấp lỗ hổng, đưa dạng yếu lên mức đạt.
- Nike: nằm trong nhóm đầu Bảng đua tháng.

**Cách tính**
- Mùa huy hiệu chạy từ tháng 7 đến tháng 4.
- Mỗi tháng đạt chuẩn là thêm một bước; càng nhiều tháng đạt, huy hiệu càng nhiều sao, tối đa 5 sao. Đã đạt thì không bị mất.
- Kết quả chốt sau ngày 10 của tháng kế tiếp (chờ kết quả MT); trước đó hiển thị “tạm tính”.
- Các sao cao có phần thưởng EXP; điều kiện chi tiết của từng huy hiệu do trung tâm cấu hình và có thể điều chỉnh.

**Thành tựu và Album**
- Thành tựu: giải thưởng cuối tháng đã công bố (Xuất sắc, Tiến bộ, Chăm chỉ).
- Album: nơi xem toàn bộ huy hiệu; em có thể ghim tối đa 3 huy hiệu để khoe ở Hồ sơ.

**[LƯU Ý] Lưu ý**
- Huy hiệu hiện mở cho môn Toán; các môn khác sẽ mở sau.

### 15. EXP, xu và Ví xu
**Tóm tắt:** EXP tích luỹ từ việc học; cuối tháng đổi thành xu để đổi quà tại trung tâm.
*Giọng game:* **Kho báu xu** — Gom EXP, đổi thành xu và rinh quà.
*Tutorial tương ứng:* chặng `xu_may_man`

**EXP đến từ đâu**
- Việc học ở lớp: ET, BTVN, buổi bù và bổ trợ, game trong buổi học.
- Việc học trên app: Chặng nhiệm vụ, rương tuần, vòng quay May mắn, các sao huy hiệu.

**[LUẬT] Đổi sang xu**
- Xu được tính theo từng môn và từng tháng từ tổng EXP của tháng đó: cứ 100 EXP là 1 xu (làm tròn lên).
- Việc chốt xu diễn ra cuối tháng.
- Xu kiếm từ hoạt động trên app có trần mỗi tháng cho mỗi môn; xu từ việc học trên lớp không bị tính vào trần này.

**Dùng xu**
- Xu dùng để đổi quà ở tủ quà tại trung tâm. App chỉ hiện số dư và lịch sử; việc đổi quà thực hiện trực tiếp tại trung tâm.
- Danh mục và giá quà do trung tâm thông báo.

### 16. Vòng quay May mắn
**Tóm tắt:** Mỗi ngày một lượt quay miễn phí để nhận EXP.
*Giọng game:* **Vòng quay may mắn** — Quay mỗi ngày một lần để rinh EXP.
*Tutorial tương ứng:* chặng `xu_may_man`

**Cách có lượt quay**
- Vòng quay miễn phí, không tốn xu; mỗi em tối đa một lượt mỗi ngày.
- Với môn đã mở Nhiệm vụ: hoàn thành từ 2 nhiệm vụ ngày trong hôm nay để có lượt.
- Với môn chưa mở Nhiệm vụ: làm một lượt tự luyện 10 câu đúng từ 70% để có lượt (luật cũ).

**Phần thưởng**
- Giải thưởng là EXP; các mức và tỉ lệ nằm trong màn vòng quay.
- Kết quả luôn do hệ thống quyết định; hoạt hình chỉ minh hoạ.
- EXP từ vòng quay được quy đổi thành xu cuối tháng theo quy tắc chung.

## Nhóm: Cộng đồng & hỗ trợ
*Thế giới BK, hồ sơ, góp ý*

### 17. Thế giới BK
**Tóm tắt:** Bảng tin thành tích của em, bạn bè và lớp; em không phải gõ chữ tự do.
*Giọng game:* **Quảng trường Thế giới BK** — Khoe chiến tích, thả tim và kết bạn.
*Tutorial tương ứng:* chặng `the_gioi`

**Ba kênh**
- Thế giới (toàn bộ học sinh), Bạn bè và Lớp.

**Tin được tạo như thế nào**
- Tin do hệ thống tự sinh từ sự kiện thật (lên bậc, mốc chuỗi, huy hiệu…). Học sinh không đăng chữ tự do.
- Em có thể “khoe” thành tích của mình: tối đa 3 bài mỗi ngày, thành tích phải đạt trong 3 ngày gần đây và mỗi thành tích khoe một lần.

**Tương tác**
- Thả cảm xúc, bình luận bằng câu soạn sẵn hoặc sticker (tối đa 3 bình luận cho mỗi tin).
- Tương tác không cộng EXP. Thầy cô và trợ giảng có thể gửi lời khen.
- Kết bạn: tìm theo tên, mã học sinh hoặc lớp. Tên hiển thị luôn kèm lớp; có thể chọn hiện mã học sinh thay cho tên.

### 18. Hồ sơ và thông báo
**Tóm tắt:** Ảnh đại diện, cấp bậc, huy hiệu khoe, giao diện và hòm thư.

**Hồ sơ**
- Chạm ảnh đại diện trên màn chính: xem cấp bậc, 3 huy hiệu khoe, Album; đổi ảnh đại diện; chuyển môn.
- Từ Hồ sơ vào được phần Giao diện và Đồ hoạ.

**Thông báo và tài khoản**
- Chuông là Hòm thư: thông báo từ trung tâm và từ app.
- Nút ⋯ có đổi mật khẩu.

### 19. Góp ý và báo lỗi  — *(Sắp có)*
**Tóm tắt:** Gửi ý kiến hoặc báo lỗi trực tiếp tới đội phát triển.

**Dự kiến**
- Mỗi ngày gửi được một số lượng góp ý nhất định, mỗi góp ý cần mô tả đủ rõ (từ 10 chữ).
- Phần gửi góp ý trong app đang được hoàn thiện; trong lúc chờ, em báo cho thầy cô hoặc trung tâm.

---

## Tutorial "Hành trình tân thủ"

**Mở đầu:** Chào mừng em đến với BK Academy! Mình sẽ dẫn em đi 12 chặng ngắn để biết app có gì. Mỗi chặng chưa tới 1 phút. Chạm vào màn hình để nghe tiếp nhé.

### Chặng 1: Nhân vật và giao diện (`giao_dien`)
*Chọn cách dùng app hợp với em* · Mở khoá: Giao diện — chọn kiểu mặc định hoặc kiểu game, đổi bất cứ lúc nào

1. Chặng 1: giao diện. App có hai cách dùng: kiểu mặc định gọn gàng, hoặc kiểu game có bản đồ, nhân vật và hiệu ứng.
2. Nội dung học và cách tính điểm giống hệt nhau ở cả hai kiểu. Em thích kiểu nào thì chọn kiểu đó.
3. Lần đầu vào khu Học tập, em chọn một trong 6 nhân vật chính. Đổi nhân vật không ảnh hưởng điểm hay tiến độ.
4. Muốn đổi giao diện, vào Hồ sơ rồi chọn Giao diện. Có công tắc Hiệu ứng game và mức đồ hoạ cho máy yếu.

### Chặng 2: Khu Học tập (`hoc_tap`)
*Năm cách luyện ở một chỗ* · Mở khoá: Khu Học tập — biết năm cách luyện và mỗi lượt có 10 câu

1. Chặng 2: khu Học tập. Ở màn chính, chạm ô Học tập. Mọi cách luyện của em nằm ở đây.
2. Có 5 ô: Học theo chủ đề, Luyện dạng yếu, Đấu trường BK, Chinh phục BK và Giải Vô địch BK.
3. Mỗi lượt luyện có 10 câu, làm bao nhiêu lượt cũng được. Làm xong là biết đúng sai và có lời giải ngay.
4. Môn nào chưa có kho câu hỏi, ví dụ Tiếng Anh, thì ô luyện bị khoá và có thông báo. Đó không phải lỗi.

### Chặng 3: Học theo chủ đề (`chu_de`)
*Bản đồ: lục địa, chặng, quái vật* · Mở khoá: Học theo chủ đề — đi qua bản đồ, mỗi dạng bài là một màn

1. Chặng 3: Học theo chủ đề. Em thấy cả thế giới của môn đang học. Mỗi chủ đề là một lục địa.
2. Chạm một lục địa để xem các chuyên đề, rồi chạm một chuyên đề để xem các dạng bài. Mỗi dạng là một công trình.
3. Chạm vào công trình là vào thẳng màn đấu. Dạng chưa đo vẫn vào học được, dạng yếu còn quái, dạng đạt có cờ.
4. Trong màn đấu, cứ 3 câu thì tung một chiêu. Đúng cả 3 câu là chiêu mạnh nhất, đúng ít thì chiêu nhẹ, sai cả 3 thì quái đánh trả.

### Chặng 4: Luyện dạng yếu (`tu_luyen`)
*Máy chọn câu cho đúng chỗ em yếu* · Mở khoá: Luyện dạng yếu — 10 câu, ưu tiên dạng em còn yếu

1. Chặng 4: Luyện dạng yếu. Trong khu Học tập, chạm ô Luyện dạng yếu.
2. Máy tự chọn 10 câu cho em. Phần lớn câu lấy từ dạng em đang yếu, số còn lại để ôn các dạng đã học.
3. Em cần đã có số đo, tức đã làm bài ở lớp hoặc trên app. Chưa có thì app báo chưa có dữ liệu.
4. Làm xong là biết đúng sai ngay. Muốn luyện nữa thì bấm Luyện lượt mới, làm bao nhiêu lượt cũng được.

### Chặng 5: Lượt học thật (`luot_that`)
*Khi nào lượt luyện được tính* · Mở khoá: Lượt học thật — làm nghiêm túc thì lượt mới được tính

1. Chặng 5: lượt học thật. Chuỗi, nhiệm vụ và Điểm Rank đều chỉ tính khi lượt luyện của em là lượt học thật.
2. Một lượt được tính khi cùng đủ ba điều kiện: làm ít nhất 5 câu, đúng ít nhất một nửa, và trung bình mỗi câu từ 6 giây trở lên.
3. Chỉ lượt luyện thêm trên app được tính: Luyện dạng yếu, Học theo chủ đề và Thử thách. ET, BTVN và bài trên lớp có cách tính riêng.
4. Lượt không được tính thì em vẫn học bình thường, không bị phạt. App chỉ nhắc nhẹ vì sao chưa tính.

### Chặng 6: Thử thách (`thu_thach`)
*Đúng từ 80% là có Điểm Rank* · Mở khoá: Thử thách — đúng 8/10 trở lên để lấy Điểm Rank

1. Chặng 6: Thử thách. Nó giống Luyện dạng yếu, 10 câu, nhưng có điểm thưởng.
2. Đúng từ 8 câu trở lên là vượt Thử thách.
3. Đúng 8 câu được 10 Điểm Rank, 9 câu được 20, cả 10 câu được 30.
4. Mỗi ngày và mỗi tháng có giới hạn Điểm Rank từ Thử thách. Hết phần điểm em vẫn làm tiếp được, chỉ là không có thêm điểm.

### Chặng 7: Đấu trường, Chinh phục, Giải vô địch (`dau_chinh_phuc`)
*Ba chế độ thi đấu* · Mở khoá: Thi đấu — mỗi câu chỉ được trả lời một lần

1. Chặng 7: các chế độ thi đấu trong khu Học tập. Luật chung: mỗi câu chỉ bấm một lần, chọn sai là khoá cả câu.
2. Câu hỏi là trắc nghiệm 4 đáp án, có giới hạn thời gian. Trả lời nhanh và đúng liên tiếp thì điểm cao hơn.
3. Đấu trường BK để thi đấu. Chinh phục BK là leo tháp, mỗi tháp có bảng xếp hạng riêng. Giải Vô địch BK có đăng ký và nhánh đấu.
4. Điểm của các chế độ này hiện chưa cộng vào Rank, chuỗi hay nhiệm vụ. Đây là sân thi đấu riêng.

### Chặng 8: Nhiệm vụ (`nhiem_vu`)
*Việc ngày · tuần · tháng* · Mở khoá: Nhiệm vụ — xong việc lên Chặng, nhận EXP đổi xu

1. Chặng 8: Nhiệm vụ. Ở khối Giải trí trên màn chính, chạm ô Nhiệm vụ. Hiện nhiệm vụ mở cho môn Toán.
2. Mỗi ngày có 3 việc nhỏ: vượt 1 Thử thách, luyện 20 câu đúng mới, sửa 2 câu dạng em từng sai. Mỗi việc +10 Điểm Chặng.
3. Hôm nào lỡ thì việc được giữ 3 ngày cho em làm bù. Xong 2 việc trong ngày là có 1 lượt quay May mắn.
4. Việc tuần mỗi việc +40, việc tháng mỗi việc +150. Xong 12 việc trong tuần thì mở rương tuần.
5. Đủ 50 Điểm Chặng là lên 1 cấp, mỗi cấp được thêm EXP. Cuối tháng EXP đổi ra xu.

### Chặng 9: Rank và Bảng xếp hạng (`rank`)
*10 bậc, đua cả mùa* · Mở khoá: Rank — tích Điểm Rank cả mùa, leo 10 bậc

1. Chặng 9: Rank. Vào Thư viện BK, chạm Rank. Rank tính riêng từng môn, hiện mở cho môn Toán.
2. Điểm Rank đến từ việc học thật: mỗi bài ET 100 điểm, BTVN đúng hạn 100 (muộn 50), Thử thách 10 đến 30, bài MT tới 1.000 điểm theo thứ hạng.
3. Điểm cộng dồn cả mùa để leo 10 bậc, từ Novice lên Supreme God. Mùa chạy từ 1/7 đến 30/6 năm sau. Đã lên bậc thì không tụt trong mùa.
4. Bảng đua tháng xếp em với các bạn cùng khối trong tháng này. Bảng tháng không làm đổi bậc của em.
5. Mỗi môn có Rank riêng. Đổi môn ở thanh chọn môn trên màn chính.

### Chặng 10: Huy hiệu và Thành tựu (`huy_hieu`)
*8 huy hiệu, nâng dần theo tháng* · Mở khoá: Huy hiệu — tháng nào đạt chuẩn thì huy hiệu thêm một bước

1. Chặng 10: Huy hiệu. Vào Hồ sơ hoặc ô Thành tựu để xem Album. Có 8 huy hiệu, mỗi huy hiệu ghi nhận một thói quen tốt.
2. Ví dụ: Helios cho chuyên cần, Chronos cho BTVN đúng hạn, Athena cho ET tốt, Hercules cho vượt Thử thách nhiều ngày.
3. Mỗi tháng đạt chuẩn thì huy hiệu được thêm một bước. Càng nhiều tháng đạt, càng nhiều sao, tối đa 5 sao. Đã đạt thì không bị mất.
4. Kết quả chốt sau ngày 10 của tháng kế tiếp. Trước đó em thấy chữ tạm tính.
5. Em ghim tối đa 3 huy hiệu để khoe ở Hồ sơ.

### Chặng 11: EXP, xu và May mắn (`xu_may_man`)
*Từ EXP đến quà và vòng quay* · Mở khoá: EXP và xu — cuối tháng EXP đổi ra xu để đổi quà ở trung tâm

1. Chặng 11: EXP và xu. EXP đến từ việc học ở lớp và việc làm trên app như nhiệm vụ, vòng quay, huy hiệu.
2. Cuối tháng, EXP đổi ra xu theo từng môn: cứ 100 EXP được 1 xu. Xu kiếm từ hoạt động trên app có giới hạn mỗi tháng.
3. Ô Ví xu cho em xem số dư và lịch sử. Muốn đổi quà thì đến tủ quà tại trung tâm, app chưa có nút đổi.
4. Ô May mắn là vòng quay miễn phí, mỗi ngày một lượt. Xong 2 nhiệm vụ ngày thì có lượt quay, giải thưởng là EXP.

### Chặng 12: Thế giới BK (`the_gioi`)
*Khoe thành tích, thả tim bạn bè* · Mở khoá: Thế giới BK — khoe thành tích thật, tương tác với bạn

1. Chặng cuối: Thế giới BK, nơi xem các bạn ở BK vừa đạt gì. Có 3 kênh: Thế giới, Bạn bè, Lớp.
2. Khi em có thành tích, ví dụ ET 10 điểm hay luyện 50 câu đúng trong ngày, nó hiện ở mục Thành tích chờ em khoe.
3. Chạm Khoe để đăng lên. Mỗi ngày khoe được 3 lần, thành tích khoe được trong 3 ngày.
4. Bấm Thích để thả cảm xúc, bấm Bình luận để chọn câu khen có sẵn hoặc sticker. Mỗi tin em bình luận tối đa 3 lần.
5. Muốn kết bạn thì tìm theo tên, mã HS hoặc lớp. Bạn đồng ý là hai đứa thấy tin của nhau.

**Kết thúc:** Hoàn thành hành trình tân thủ! — Vậy là em đã biết các khu chính trong app. Muốn đọc lại bất cứ phần nào, vào Thư viện BK rồi chọn Hướng dẫn chơi.
