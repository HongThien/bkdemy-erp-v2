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
- Khối “Giải trí” dùng chung cho mọi môn: Thế giới BK, Nhiệm vụ, Thư viện BK, Trò chơi, May mắn, Thành tựu, Ví xu. Đổi môn thì khối này không đổi.

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
**Tóm tắt:** Điều kiện để một lượt luyện được tính vào chuỗi, nhiệm vụ và Bảng xếp hạng.
*Giọng game:* **Lượt luyện hợp lệ** — Luyện thế nào thì mới được ghi vào chiến tích.
*Tutorial tương ứng:* chặng `luot_that`

**Khái niệm**
Chuỗi làm bài, nhiệm vụ và Bảng xếp hạng đều dựa trên “lượt học thật”. Một lượt luyện (10 câu) chỉ được tính khi em thực sự làm bài, không làm cho có.

**[LUẬT] Ba điều kiện (cùng đúng)**
- Làm ít nhất 5 câu.
- Đúng ít nhất một nửa số câu đã làm (lượt 10 câu thì đúng từ 5 câu).
- Trung bình mỗi câu từ 6 giây trở lên, tính từ lúc mở lượt đến câu cuối. Làm quá nhanh thì lượt không được tính.

**Loại bài nào được tính**
- Chỉ các lượt luyện thêm trên app: Luyện dạng yếu, Học theo chủ đề và Thử thách.
- ET, BTVN, bài trên lớp và Học từ đầu không nằm trong nhóm này (chúng có cách tính riêng).

**Khi lượt không được tính**
- Em vẫn học được và vẫn có kết quả đúng sai, chỉ là lượt đó không cộng vào chuỗi, nhiệm vụ hay Bảng xếp hạng. Không có hình phạt.
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
- Lượt có được tính vào chuỗi, nhiệm vụ hay Bảng xếp hạng hay không do điều kiện “Lượt học thật” quyết định.

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
**Tóm tắt:** Lượt luyện khó hơn: đúng từ 80% là vượt Thử thách.
*Giọng game:* **Đấu trường thử thách** — Vượt thử thách để chứng tỏ bản lĩnh.
*Tutorial tương ứng:* chặng `thu_thach`

**[LUẬT] Luật đang áp dụng**
- Một lượt gồm 10 câu do hệ thống chọn dạng; em không tự chọn dạng.
- Đúng từ 8 câu trở lên là vượt Thử thách.
- Phần thưởng riêng của Thử thách đang được hoàn thiện; kết quả mỗi lượt vẫn được ghi lại.

**Liên quan đến phần khác**
- Thử thách là một lượt học thật nên được tính vào chuỗi làm bài khi đạt điều kiện “Lượt học thật”.
- Nhiệm vụ ngày chỉ tính lượt Luyện dạng yếu, không tính Thử thách.

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
- Các lượt trong ca này không được tính vào chuỗi, nhiệm vụ và Bảng xếp hạng.

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
- Bảng tỉ lệ dạng đạt; “đạt” ở bảng này nghĩa là làm ít nhất 3 câu và đúng từ 75% trở lên.

## Nhóm: Thành tích & phần thưởng
*Nhiệm vụ, bảng xếp hạng, thành tựu, xu*

### 11. Chuỗi làm bài
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

**Xem chuỗi ở đâu**
- Ngọn lửa và số ngày ở góc trên màn chính. Lửa xám nghĩa là hôm nay em chưa có lượt được tính.
- Bấm vào ngọn lửa để xem 7 ngày gần nhất, kỷ lục, số thẻ đóng băng còn lại và ngày lỡ còn sửa được.
- Chạm mốc thì app mừng em một lần.

### 12. Nhiệm vụ
**Tóm tắt:** Luyện dạng yếu mỗi ngày để nhận EXP và điểm học tập; có việc ngày, tuần và tháng.
*Giọng game:* **Bảng nhiệm vụ** — Luyện mỗi ngày, gom EXP và điểm để chơi game.
*Tutorial tương ứng:* chặng `nhiem_vu`

**[LUẬT] Một việc duy nhất: Luyện dạng yếu**
- Chỉ lượt Luyện dạng yếu mới được tính. Lượt đó phải là lượt học thật và em làm đúng từ 7 trên 10 câu thì mới là lượt đạt.
- Mỗi lượt đạt được 20 EXP và 20 điểm học tập. Mỗi ngày tính tối đa 4 lượt đạt.

**Việc tuần và tháng**
- Một tháng chia 4 tuần (ngày 1 đến 7, 8 đến 14, 15 đến 21, 22 đến hết tháng).
- Việc tuần 1: có lượt đạt ở 5 ngày khác nhau trong tuần, thưởng 100 EXP và 50 điểm học tập.
- Việc tuần 2: đủ 12 lượt đạt trong tuần, thưởng 100 EXP và 50 điểm học tập.
- Việc tháng: có lượt đạt ở 20 ngày trong tháng, thưởng 300 EXP và 200 điểm học tập.

**Điểm học tập**
- Điểm học tập dùng để chơi game. Kho chứa tối đa 6.000 điểm; đầy kho thì phần thêm không được cộng.
- Điểm học tập không đổi ra xu. EXP thì đổi ra xu như bình thường.

**[PHẦN THƯỞNG] Trần EXP**
- EXP từ nhiệm vụ có trần 2.000 mỗi tháng cho mỗi môn (tương đương 20 xu).
- Có ít nhất một lượt đạt trong ngày là em được quay may mắn một lần.

**[LƯU Ý] Lưu ý**
- Nhiệm vụ hiện mở cho môn Toán; các môn khác sẽ mở sau. Nhiệm vụ tính từ ngày 06/10/2026.

### 13. Bảng xếp hạng
**Tóm tắt:** Xem em đứng thứ mấy so với các bạn cùng khối hoặc toàn trung tâm.
*Giọng game:* **Bảng vinh danh** — Xem chiến binh nào đứng đầu bảng.
*Tutorial tương ứng:* chặng `bxh`

**Cách xem**
- Ở màn chính, chạm ô lớn Bảng xếp hạng. Bảng đi theo môn em đang chọn (bảng chuỗi làm bài hiện ở mọi môn).
- Có ba ô chọn xổ xuống: loại bảng, phạm vi (Khối mình hoặc Toàn BK) và thời gian (Tuần hoặc Tháng, tuỳ bảng).
- Danh sách hiện 20 bạn đứng đầu kèm lớp. Có thể bật Mã HS để hiện mã thay cho tên.

**Các bảng hiện có**
- Siêng luyện: số lượt Luyện dạng yếu đạt trong tuần hoặc tháng.
- Tổng câu đúng: số câu đúng trong các lượt luyện được tính.
- Tỉ lệ đạt: phần trăm dạng bài em đã đạt.
- Chuỗi làm bài: số ngày liên tiếp có lượt luyện được tính.
- Mock Test tháng: điểm Mock Test gần nhất; đề mỗi khối khác nhau nên Toàn BK so trực tiếp điểm.
- Một số bảng khác đang ghi “Sắp có”.

**[LUẬT] Quy ước**
- Chỉ em nào có kết quả thật trong kỳ mới có tên trong bảng. Chưa có dữ liệu không có nghĩa là 0 điểm.
- Hạng của chính em hiện ở dải phía trên và chỉ mình em thấy, kể cả khi em ở cuối bảng.
- Hòa điểm thì ai đạt mốc sớm hơn đứng trước.

### 14. Thành tựu
**Tóm tắt:** Đạt bậc nào nhận EXP bậc đó; mỗi bậc thưởng một lần trong mùa.
*Giọng game:* **Bộ thành tựu** — Chinh phục từng bậc để rinh EXP.
*Tutorial tương ứng:* chặng `huy_hieu`

**[LUẬT] Luật chung**
- Đạt là đạt, không có mức thấp hay cao. Mỗi bậc là một thành tựu riêng và có phần thưởng EXP riêng.
- Mỗi bậc chỉ thưởng một lần trong mùa. Mất chuỗi rồi cày lại tới bậc cũ thì không thưởng lại.
- Mùa chạy từ 1 tháng 7 đến 30 tháng 6 năm sau. Sang mùa mới, các bậc tính lại từ đầu.
- EXP thành tựu không có trần và đổi ra xu như EXP khác.

**Các thành tựu đang mở**
- Chuỗi làm bài liên tiếp: 7, 14, 30, 60, 90, 150, 210, 300 ngày.
- Nhiệm vụ ngày liên tiếp: 7, 14, 30, 60, 90 ngày.
- Luyện dạng yếu đạt liên tiếp: 3, 5, 10 lượt (một lượt dưới ngưỡng sẽ cắt chuỗi).
- Tổng số câu luyện đạt trong mùa: 1.000, 2.000, 5.000, 10.000 câu.
- Top 5 khối và Top 1 khối ở Mock Test tháng; Mock Test 10 điểm lần đầu trong mùa.
- Một số thành tựu khác ghi “Sắp có”, và có thành tựu ẩn: đạt rồi mới biết tên.

**Nhận thưởng**
- Khi em về màn chính, thành tựu mới đạt hiện ra để chúc mừng. Xem toàn bộ ở ô Thành tựu.

**Album huy hiệu và giải thưởng cuối tháng**
- Giải thưởng cuối tháng (Xuất sắc, Tiến bộ, Chăm chỉ) do thầy cô công bố và hiện cùng màn Thành tựu.
- Album huy hiệu là bộ sưu tập, hiện không thưởng EXP và đang được làm mới.

**[LƯU Ý] Lưu ý**
- Thành tựu hiện mở cho môn Toán; các môn khác sẽ mở sau.

### 15. EXP, xu và Ví xu
**Tóm tắt:** EXP tích luỹ từ việc học, đổi thành xu ngay trong ngày để đổi quà tại trung tâm.
*Giọng game:* **Kho báu xu** — Gom EXP, đổi thành xu và rinh quà.
*Tutorial tương ứng:* chặng `xu_may_man`

**EXP đến từ đâu**
- Việc học ở lớp: ET, BTVN, buổi bù và bổ trợ, game trong buổi học.
- Việc học trên app: nhiệm vụ, vòng quay May mắn, thành tựu.

**[LUẬT] Đổi sang xu**
- Xu được tính theo từng môn và từng tháng từ tổng EXP của tháng đó: cứ 100 EXP là 1 xu (làm tròn lên).
- Xu cập nhật ngay khi em có EXP, không đợi cuối tháng. Nếu EXP bị giảm (phạt BTVN, sửa điểm) thì xu cũng giảm theo.
- Xu từ nhiệm vụ có trần 20 xu mỗi tháng cho mỗi môn, từ vòng quay có trần 10 xu mỗi tháng; thành tựu không có trần. Xu từ việc học trên lớp không bị tính vào các trần này.

**Dùng xu**
- Xu dùng để đổi quà ở tủ quà tại trung tâm. App chỉ hiện số dư và lịch sử; việc đổi quà thực hiện trực tiếp tại trung tâm.
- Danh mục và giá quà do trung tâm thông báo.

### 16. Vòng quay May mắn
**Tóm tắt:** Mỗi ngày một lượt quay miễn phí để nhận EXP.
*Giọng game:* **Vòng quay may mắn** — Quay mỗi ngày một lần để rinh EXP.
*Tutorial tương ứng:* chặng `xu_may_man`

**Cách có lượt quay**
- Vòng quay miễn phí, không tốn xu; mỗi em tối đa một lượt mỗi ngày.
- Với môn đã mở Nhiệm vụ: có ít nhất 1 lượt Luyện dạng yếu đạt trong hôm nay thì lượt quay tự hiện ra.
- Với môn chưa mở Nhiệm vụ: làm một lượt tự luyện 10 câu đúng từ 70% để có lượt (luật cũ).

**Phần thưởng**
- Giải thưởng là EXP; các mức và tỉ lệ nằm trong màn vòng quay.
- Kết quả luôn do hệ thống quyết định; hoạt hình chỉ minh hoạ.
- EXP từ vòng quay được quy đổi thành xu ngay theo quy tắc chung.

### 17. Trò chơi
**Tóm tắt:** Nơi chứa các game giải trí của BK; hiện có Nông trại BK.
*Giọng game:* **Khu trò chơi** — Giải lao với Nông trại BK, game mới sẽ lần lượt mở.

**Ô Trò chơi**
- Ô Trò chơi nằm ở khối Giải trí trên màn chính và dùng chung cho mọi môn.
- Mỗi game là một thẻ. Thẻ sáng thì chạm để chơi; thẻ mờ ghi “Sắp ra mắt” là game chưa mở.
- Chạm nút ‹ ở góc dưới bên phải màn game để quay về danh sách.

**Nông trại BK**
- Trồng cây, nuôi gà và bò, sang vườn bạn bè. Mỗi ngày vào một lần, khoảng mười đến mười lăm phút là đủ.
- Ngày trong game đổi lúc 5 giờ sáng giờ Việt Nam. Cây chín sau 1, 2 hoặc 3 ngày tuỳ loại.
- Càng chăm vườn đều đặn thì càng mở thêm ô đất và loại cây mới.

**[LƯU Ý] Lưu ý**
- Nông trại BK hiện là bản thử: tiến độ được lưu ngay trên thiết bị đang dùng, chưa theo tài khoản và chưa nối với xu hay việc học. Đổi thiết bị thì vườn bắt đầu lại.
- Săn lùng Quái Vật là game tiếp theo, chưa có ngày mở.

## Nhóm: Cộng đồng & hỗ trợ
*Thế giới BK, hồ sơ, góp ý*

### 18. Thế giới BK
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

### 19. Hồ sơ và thông báo
**Tóm tắt:** Ảnh đại diện, cấp bậc, huy hiệu khoe, giao diện và hòm thư.

**Hồ sơ**
- Chạm ảnh đại diện trên màn chính: xem cấp bậc, 3 huy hiệu khoe, Album; đổi ảnh đại diện; chuyển môn.
- Từ Hồ sơ vào được phần Giao diện và Đồ hoạ.

**Thông báo và tài khoản**
- Chuông là Hòm thư: thông báo từ trung tâm và từ app.
- Nút ⋯ có đổi mật khẩu.

### 20. Góp ý và báo lỗi
**Tóm tắt:** Gửi ý kiến hoặc báo lỗi trực tiếp tới đội phát triển.

**Mở ở đâu**
- Màn chính: nút ⋯ ở góc trên → "Góp ý & báo lỗi". Hoặc trong Hồ sơ của em.

**Gửi thế nào**
- Chọn "Báo lỗi" khi app chạy sai, hoặc "Góp ý tưởng" khi em muốn app có thêm điều gì.
- Mô tả từ 10 đến 1.500 chữ; có thể đính kèm 1 ảnh chụp màn hình (chọn tệp hoặc dán vào ô chữ).
- Mỗi ngày gửi tối đa 5 lần.

**Theo dõi**
- Mục "Góp ý của em" hiện trạng thái: Đã nhận · Đang xem · Đã xử lý · Chưa làm được, kèm lời trả lời của thầy cô.
- Có lời trả lời mới thì nút ⋯ ở màn chính hiện chấm đỏ.

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

1. Chặng 5: lượt học thật. Chuỗi, nhiệm vụ và Bảng xếp hạng đều chỉ tính khi lượt luyện của em là lượt học thật.
2. Một lượt được tính khi cùng đủ ba điều kiện: làm ít nhất 5 câu, đúng ít nhất một nửa, và trung bình mỗi câu từ 6 giây trở lên.
3. Chỉ lượt luyện thêm trên app được tính: Luyện dạng yếu, Học theo chủ đề và Thử thách. ET, BTVN và bài trên lớp có cách tính riêng.
4. Lượt không được tính thì em vẫn học bình thường, không bị phạt. App chỉ nhắc nhẹ vì sao chưa tính.

### Chặng 6: Thử thách (`thu_thach`)
*Đúng từ 80% là vượt Thử thách* · Mở khoá: Thử thách — đúng 8/10 trở lên để vượt Thử thách

1. Chặng 6: Thử thách. Nó giống Luyện dạng yếu, 10 câu, nhưng đòi hỏi cao hơn.
2. Đúng từ 8 câu trở lên là vượt Thử thách.
3. Thử thách cũng là lượt học thật, nên được tính vào chuỗi làm bài của em.
4. Phần thưởng riêng của Thử thách đang được hoàn thiện. Em cứ thử sức trước, kết quả vẫn được ghi lại.

### Chặng 7: Đấu trường, Chinh phục, Giải vô địch (`dau_chinh_phuc`)
*Ba chế độ thi đấu* · Mở khoá: Thi đấu — mỗi câu chỉ được trả lời một lần

1. Chặng 7: các chế độ thi đấu trong khu Học tập. Luật chung: mỗi câu chỉ bấm một lần, chọn sai là khoá cả câu.
2. Câu hỏi là trắc nghiệm 4 đáp án, có giới hạn thời gian. Trả lời nhanh và đúng liên tiếp thì điểm cao hơn.
3. Đấu trường BK để thi đấu. Chinh phục BK là leo tháp, mỗi tháp có bảng xếp hạng riêng. Giải Vô địch BK có đăng ký và nhánh đấu.
4. Điểm của các chế độ này hiện chưa cộng vào Rank, chuỗi hay nhiệm vụ. Đây là sân thi đấu riêng.

### Chặng 8: Nhiệm vụ (`nhiem_vu`)
*Việc ngày · tuần · tháng* · Mở khoá: Nhiệm vụ — luyện dạng yếu mỗi ngày, nhận EXP và điểm học tập

1. Chặng 8: Nhiệm vụ. Ở khối Giải trí trên màn chính, chạm ô Nhiệm vụ. Hiện nhiệm vụ mở cho môn Toán.
2. Nhiệm vụ chỉ có một việc: Luyện dạng yếu. Mỗi lượt em làm đúng từ 7 trên 10 câu là được 20 EXP và 20 điểm học tập. Mỗi ngày tính tối đa 4 lượt.
3. Có ít nhất 1 lượt đạt trong ngày là em được quay may mắn 1 lần. Vòng quay tự hiện ra khi em có lượt, không cần tìm ô riêng.
4. Việc tuần: có lượt đạt ở 5 ngày khác nhau, hoặc đủ 12 lượt đạt trong tuần, mỗi việc +100 EXP và +50 điểm. Việc tháng: có lượt đạt ở 20 ngày, +300 EXP và +200 điểm.
5. Điểm học tập tích lại để em chơi game, kho chứa tối đa 6.000 điểm. EXP thì đổi ra xu ngay.

### Chặng 9: Bảng xếp hạng (`bxh`)
*Em đứng thứ mấy so với các bạn* · Mở khoá: Bảng xếp hạng — chọn bảng, chọn Khối hoặc Toàn BK, chọn tuần hoặc tháng

1. Chặng 9: Bảng xếp hạng. Ở màn chính, chạm ô lớn Bảng xếp hạng. Bảng đi theo môn em đang chọn.
2. Có ba ô chọn xổ xuống: loại bảng (Siêng luyện, Tổng câu đúng, Chuỗi làm bài, Mock Test…), phạm vi Khối mình hoặc Toàn BK, và thời gian Tuần hoặc Tháng.
3. Dải phía trên cho em biết em đứng hạng mấy. Chỉ mình em thấy hạng của chính em, kể cả khi em ở cuối bảng.
4. Danh sách hiện 20 bạn đứng đầu, kèm lớp. Chỉ bạn nào có kết quả thật mới có tên. Hòa điểm thì ai đạt trước đứng trước.

### Chặng 10: Thành tựu (`huy_hieu`)
*Mỗi bậc đạt được thưởng EXP một lần mỗi mùa* · Mở khoá: Thành tựu — đạt bậc nào, nhận EXP bậc đó

1. Chặng 10: Thành tựu. Vào ô Thành tựu để xem các thành tựu của mùa này. Đạt là đạt, mỗi bậc có phần thưởng EXP riêng.
2. Có chuỗi làm bài liên tiếp, nhiệm vụ ngày liên tiếp, luyện dạng yếu đạt liên tiếp, tổng số câu luyện đạt, và top đầu khối ở Mock Test.
3. Mỗi bậc chỉ thưởng một lần trong mùa. Mất chuỗi rồi cày lại tới bậc cũ thì không thưởng lại. Mùa mới bắt đầu ngày 1 tháng 7.
4. Có những thành tựu ẩn. Em đạt được mới biết tên, trước đó chỉ thấy ổ khoá.
5. Khi em về màn chính, thành tựu mới đạt sẽ hiện ra chúc mừng. EXP được đổi ra xu như mọi EXP khác.

### Chặng 11: EXP, xu và May mắn (`xu_may_man`)
*Từ EXP đến quà và vòng quay* · Mở khoá: EXP và xu — EXP đổi ra xu ngay để đổi quà ở trung tâm

1. Chặng 11: EXP và xu. EXP đến từ việc học ở lớp và việc làm trên app như nhiệm vụ, vòng quay, huy hiệu.
2. Có EXP là đổi ra xu ngay, theo từng môn: cứ 100 EXP trong tháng được 1 xu. Xu kiếm từ nhiệm vụ trên app tối đa 20 xu mỗi tháng, từ vòng quay tối đa 10 xu mỗi tháng.
3. Ô Ví xu cho em xem số dư và lịch sử. Muốn đổi quà thì đến tủ quà tại trung tâm, app chưa có nút đổi.
4. Vòng quay may mắn mỗi ngày một lượt, mở khi em có ít nhất 1 lượt Luyện dạng yếu đạt. Giải thưởng là EXP.

### Chặng 12: Thế giới BK (`the_gioi`)
*Khoe thành tích, thả tim bạn bè* · Mở khoá: Thế giới BK — khoe thành tích thật, tương tác với bạn

1. Chặng cuối: Thế giới BK, nơi xem các bạn ở BK vừa đạt gì. Có 3 kênh: Thế giới, Bạn bè, Lớp.
2. Khi em có thành tích, ví dụ ET 10 điểm hay luyện 50 câu đúng trong ngày, nó hiện ở mục Thành tích chờ em khoe.
3. Chạm Khoe để đăng lên. Mỗi ngày khoe được 3 lần, thành tích khoe được trong 3 ngày.
4. Bấm Thích để thả cảm xúc, bấm Bình luận để chọn câu khen có sẵn hoặc sticker. Mỗi tin em bình luận tối đa 3 lần.
5. Muốn kết bạn thì tìm theo tên, mã HS hoặc lớp. Bạn đồng ý là hai đứa thấy tin của nhau.

**Kết thúc:** Hoàn thành hành trình tân thủ! — Vậy là em đã biết các khu chính trong app. Muốn đọc lại bất cứ phần nào, vào Thư viện BK rồi chọn Hướng dẫn chơi.
