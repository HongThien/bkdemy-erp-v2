// cau-truc.mjs — cây 4 tầng ĐỀ XUẤT cho K12 chủ đề "Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số" (21/10/2026).
// Chủ đề → chuyên đề → nhóm bài → dạng bài. Mã H… là mã TẠM của bản đề xuất (khi Thùy chốt mới sinh NNB/NDB).
// Dạng: [mã, tên, mô tả nhận biết, hình] — hình: 'bbt' | 'dothi' | 'ca-hai' | 'khong' (ví dụ cần hình gì).
export const CHU_DE = { id: 'NCD00094', ten: 'Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số' }

export const CAY = [
  { id: 'H1', ten: 'Tính đơn điệu của hàm số', nhom: [
    { id: 'H1.1', ten: 'Xét tính đơn điệu khi biết hàm số', bb: true,
      mo_ta: 'Đề cho công thức y=f(x), hỏi khoảng đồng biến, nghịch biến; quy trình tìm tập xác định, tính y′, lập bảng biến thiên.',
      dang: [
        ['H1.1.1', 'Hàm đa thức, hàm phân thức', 'y′ là đa thức hoặc phân thức; giải y′=0, lập bảng xét dấu rồi kết luận khoảng đơn điệu (với phân thức nhớ loại điểm không xác định).', 'khong'],
        ['H1.1.2', 'Hàm chứa căn, mũ, logarit, giá trị tuyệt đối, lượng giác', 'Phải tìm tập xác định (hoặc bỏ dấu giá trị tuyệt đối theo từng khoảng) trước khi xét dấu y′; kèm câu chọn hàm đồng biến trên ℝ trong bốn hàm cho sẵn.', 'khong'],
      ] },
    { id: 'H1.2', ten: 'Đọc tính đơn điệu từ bảng biến thiên, đồ thị của f', bb: true,
      mo_ta: 'Đề cho hình (bảng biến thiên hoặc đồ thị của chính hàm f), chỉ cần đọc khoảng đồng biến, nghịch biến.',
      dang: [
        ['H1.2.1', 'Đọc từ bảng biến thiên', 'Cho bảng biến thiên của f; đọc khoảng đồng biến (mũi tên đi lên), nghịch biến (mũi tên đi xuống), chọn mệnh đề đúng.', 'bbt'],
        ['H1.2.2', 'Đọc từ đồ thị của f', 'Cho đồ thị y=f(x); đồ thị đi lên từ trái sang phải trên khoảng nào thì đồng biến trên khoảng đó.', 'dothi'],
      ] },
    { id: 'H1.3', ten: 'Đơn điệu của f khi biết f′', bb: true,
      mo_ta: 'Đề cho dữ kiện về đạo hàm f′ (bảng xét dấu, đồ thị hoặc biểu thức), hỏi tính đơn điệu của chính f.',
      dang: [
        ['H1.3.1', 'Bảng xét dấu hoặc đồ thị của f′', 'f′ nằm trên trục hoành thì f đồng biến, nằm dưới thì nghịch biến; chú ý giá trị nhận/không nhận khi f′ bằng 0.', 'ca-hai'],
        ['H1.3.2', 'f′ cho bằng biểu thức tích nhân tử', 'Cho f′(x)=(x−a)^m(x−b)^n…; lập bảng xét dấu, nghiệm bội chẵn không đổi dấu, bội lẻ đổi dấu.', 'khong'],
      ] },
    { id: 'H1.4', ten: 'Đơn điệu của hàm hợp khi biết f′', bb: false,
      mo_ta: 'Đề cho đồ thị hoặc bảng xét dấu của f′, hỏi tính đơn điệu của g(x)=f(u(x)) (có thể cộng thêm hàm phụ); dùng g′=u′·f′(u).',
      dang: [
        ['H1.4.1', 'g(x)=f(u(x)) khi biết f′', 'Tính g′(x)=u′(x)·f′(u(x)); giải f′(u)≥0 hoặc ≤0 bằng cách đọc đồ thị/bảng của f′ rồi suy ra khoảng của x.', 'ca-hai'],
        ['H1.4.2', 'g(x)=f(u(x))+v(x) (có hàm phụ)', 'g′(x)=u′f′(u)+v′; vẽ thêm đường biểu diễn −v′/u′ lên đồ thị f′ hoặc thử từng phương án.', 'dothi'],
      ] },
    { id: 'H1.5', ten: 'Tìm m để hàm số đơn điệu', bb: true,
      mo_ta: 'Hàm số chứa tham số m; tìm m để đồng biến/nghịch biến trên ℝ, trên từng khoảng xác định hoặc trên một khoảng cho trước.',
      dang: [
        ['H1.5.1', 'Hàm bậc ba đơn điệu trên ℝ', 'y′=ax²+bx+c không đổi dấu: a>0 và Δ′≤0 (đồng biến); nhớ xét a=0 khi hệ số a chứa m.', 'khong'],
        ['H1.5.2', 'Hàm nhất biến đơn điệu trên từng khoảng xác định', 'y=(ax+b)/(cx+d): y′=(ad−bc)/(cx+d)², cần ad−bc>0 (đồng biến) hoặc <0 (nghịch biến), không có dấu bằng.', 'khong'],
        ['H1.5.3', 'Hàm nhất biến hoặc bậc ba đơn điệu trên một khoảng cho trước', 'Nhất biến: ad−bc cùng dấu và −d/c nằm ngoài khoảng. Bậc ba: y′≥0 trên khoảng, cô lập m rồi lập bảng biến thiên của hàm vế kia.', 'khong'],
        ['H1.5.4', 'Hàm phân thức bậc hai trên bậc nhất', 'y′ có tử là tam thức bậc hai; xét dấu tử trên từng khoảng xác định hoặc trên khoảng cho trước.', 'khong'],
        ['H1.5.5', 'Hàm lượng giác, logarit, căn, mũ, giá trị tuyệt đối: đặt t=u(x)', 'Đặt t=u(x), tìm miền của t, đưa về hàm nhất biến hoặc bậc ba theo t, chú ý dấu của u′(x) trên khoảng đã cho.', 'khong'],
        ['H1.5.6', 'Hàm ẩn, hàm hợp có tham số m', 'Cho đồ thị hoặc bảng của f′ và hàm như f(x+m), f(x²+mx), f(2x−m); so miền của u(x,m) với khoảng đơn điệu của f.', 'ca-hai'],
      ] },
  ] },

  { id: 'H2', ten: 'Cực trị của hàm số', nhom: [
    { id: 'H2.1', ten: 'Tìm cực trị khi biết hàm số', bb: true,
      mo_ta: 'Đề cho công thức hàm số; tìm điểm cực trị, giá trị cực trị, số điểm cực trị; quy trình y′→bảng biến thiên.',
      dang: [
        ['H2.1.1', 'Hàm bậc ba', 'y′ là tam thức bậc hai; có hai nghiệm phân biệt thì có cực đại và cực tiểu; tính giá trị cực trị từ y.', 'khong'],
        ['H2.1.2', 'Hàm trùng phương, hàm bậc bốn', 'y′=4ax³+2bx=2x(2ax²+b); một hoặc ba cực trị tuỳ dấu của ab.', 'khong'],
        ['H2.1.3', 'Hàm phân thức', 'Bậc hai/bậc nhất có thể có đủ cực đại, cực tiểu; bậc nhất/bậc nhất không có cực trị.', 'khong'],
        ['H2.1.4', 'Hàm mũ, logarit, căn, lượng giác và hàm có điểm không khả vi', 'Tìm tập xác định, giải y′=0, kể cả điểm y′ không tồn tại nhưng hàm liên tục (như |x|, ∛(x²)) vẫn có thể là cực trị.', 'khong'],
      ] },
    { id: 'H2.2', ten: 'Đọc cực trị từ bảng biến thiên, đồ thị của f', bb: true,
      mo_ta: 'Đề cho hình của chính hàm f; phân biệt điểm cực trị (x), giá trị cực trị (y), điểm cực trị của đồ thị (x;y).',
      dang: [
        ['H2.2.1', 'Đọc cực trị từ bảng biến thiên', 'Điểm cực đại: y′ đổi dấu từ + sang −; cực tiểu: từ − sang +; hỏi tổng/tích các giá trị cực trị, số điểm cực trị.', 'bbt'],
        ['H2.2.2', 'Đọc cực trị từ đồ thị của f', 'Đỉnh đồ thị là cực đại, đáy là cực tiểu; chú ý đáp án là hoành độ, tung độ hay toạ độ điểm.', 'dothi'],
      ] },
    { id: 'H2.3', ten: 'Cực trị khi biết f′', bb: true,
      mo_ta: 'Đề cho dữ kiện về đạo hàm f′ (bảng xét dấu, đồ thị hoặc biểu thức), hỏi cực trị của f.',
      dang: [
        ['H2.3.1', 'Bảng xét dấu hoặc đồ thị của f′', 'Số cực trị của f là số điểm f′ đổi dấu; đồ thị f′ chỉ tiếp xúc trục hoành thì không phải cực trị.', 'ca-hai'],
        ['H2.3.2', 'f′ cho bằng biểu thức nhân tử', 'f′(x)=(x−a)^m(x−b)^n…; chỉ nghiệm bội lẻ làm f′ đổi dấu; xác định loại cực trị bằng bảng xét dấu.', 'khong'],
        ['H2.3.3', 'Số cực trị của g(x)=f(x)+ax khi biết đồ thị f′', 'g′=f′(x)+a; số cực trị là số giao điểm mà đồ thị f′ cắt (đổi dấu) với đường thẳng y=−a.', 'dothi'],
      ] },
    { id: 'H2.4', ten: 'Tìm m, hệ số liên quan đến cực trị', bb: true,
      mo_ta: 'Hàm số chứa tham số; tìm m để có cực trị thoả điều kiện, hoặc tìm hệ số từ điểm cực trị cho trước.',
      dang: [
        ['H2.4.1', 'Điều kiện có, không có hoặc có đúng hai cực trị', 'y′=0 có hai nghiệm phân biệt (Δ′>0, a≠0); xét riêng trường hợp hệ số a bằng 0 khi chứa m.', 'khong'],
        ['H2.4.2', 'Đạt cực trị tại điểm cho trước, tìm hệ số', 'Dùng y′(x₀)=0 và giá trị cực trị y(x₀)=y₀, giải hệ rồi thử lại bằng bảng biến thiên hoặc y″.', 'khong'],
        ['H2.4.3', 'Hệ thức giữa hai điểm cực trị (Viète)', 'Hai điểm cực trị x₁, x₂ là nghiệm y′=0; đưa hệ thức như x₁²+x₂²=a, x₁+2x₂=b về S=x₁+x₂, P=x₁x₂ rồi giải theo m.', 'khong'],
        ['H2.4.4', 'Vị trí hai điểm cực trị: so với trục, cùng hay khác phía, đối xứng, cách đều', 'Tìm toạ độ hai điểm cực trị theo m rồi dùng tích tung độ, trung điểm, điều kiện vuông góc hoặc khoảng cách bằng nhau.', 'khong'],
        ['H2.4.5', 'Hàm trùng phương: ba cực trị tạo tam giác đặc biệt', 'Ba cực trị A(0;c), B, C đối xứng; tam giác đều, vuông cân, diện tích cho trước đưa về điều kiện của a, b.', 'khong'],
        ['H2.4.6', 'Hàm phân thức bậc hai trên bậc nhất có cực đại và cực tiểu', 'y′=0 có hai nghiệm phân biệt khác nghiệm mẫu; tìm m rồi tính các đại lượng liên quan.', 'khong'],
      ] },
    { id: 'H2.5', ten: 'Đường thẳng qua hai điểm cực trị và hình học các điểm cực trị', bb: true,
      mo_ta: 'Đề hỏi phương trình đường thẳng đi qua hai điểm cực trị, độ dài AB, diện tích tam giác với gốc toạ độ, quan hệ của AB với đường hoặc điểm khác.',
      dang: [
        ['H2.5.1', 'Phương trình đường thẳng qua hai điểm cực trị', 'Hàm bậc ba: chia y cho y′ lấy phần dư; hàm phân thức: y=u′/v′ tại điểm cực trị.', 'khong'],
        ['H2.5.2', 'Độ dài AB, khoảng cách từ O đến AB, diện tích tam giác OAB', 'Tìm toạ độ hai điểm cực trị rồi dùng công thức khoảng cách, diện tích bằng nửa |x_Ay_B−x_By_A|.', 'khong'],
        ['H2.5.3', 'Quan hệ của AB với đường thẳng hoặc điểm khác', 'AB song song, vuông góc đường thẳng cho trước; hai điểm cực trị đối xứng qua điểm/đường thẳng; ba điểm thẳng hàng.', 'khong'],
      ] },
    { id: 'H2.6', ten: 'Số cực trị của hàm hợp và hàm chứa giá trị tuyệt đối', bb: false,
      mo_ta: 'Nâng cao: đếm số điểm cực trị của |f(x)|, f(|x|), f(u(x)) hoặc tìm m để có số cực trị cho trước.',
      dang: [
        ['H2.6.1', 'Hàm |f(x)| và f(|x|)', 'Số cực trị của |f(x)| bằng số cực trị của f cộng số nghiệm bội lẻ của f(x)=0 (không trùng cực trị); f(|x|) là hàm chẵn: đếm nửa x>0 rồi ghép.', 'ca-hai'],
        ['H2.6.2', 'Hàm hợp f(u(x)) không chứa giá trị tuyệt đối', 'y′=u′·f′(u)=0; đếm các nghiệm bội lẻ của u′=0 và f′(u)=0, loại nghiệm trùng.', 'ca-hai'],
        ['H2.6.3', 'Tìm m để f(u(x,m)) có số cực trị cho trước', 'Đặt t=u(x), lập bảng biến thiên của u, đếm số nghiệm f′(t)=0 theo từng khoảng của t rồi biện luận theo m.', 'ca-hai'],
      ] },
  ] },

  { id: 'H3', ten: 'Giá trị lớn nhất, giá trị nhỏ nhất của hàm số', nhom: [
    { id: 'H3.1', ten: 'Đọc GTLN, GTNN từ bảng biến thiên, đồ thị', bb: true,
      mo_ta: 'Đề cho hình của f (hoặc f′) trên đoạn/khoảng; đọc GTLN, GTNN, tính M±m, nhận mệnh đề đúng.',
      dang: [
        ['H3.1.1', 'Đọc từ đồ thị của f', 'Trên đoạn cho trước, điểm cao nhất/thấp nhất của đồ thị (kể cả hai đầu mút) cho M, m; tính M+m, M−m.', 'dothi'],
        ['H3.1.2', 'Đọc từ bảng biến thiên hoặc bảng xét dấu f′', 'Chú ý khoảng mở, giá trị giới hạn không đạt được; kết luận có hay không có GTLN, GTNN.', 'bbt'],
        ['H3.1.3', 'Từ đồ thị f′ kèm giả thiết nối các giá trị f(a), f(b)', 'Lập bảng biến thiên của f từ dấu f′, dùng diện tích hoặc giả thiết f(a)+f(b)=f(c)+f(d) để so sánh các giá trị.', 'dothi'],
      ] },
    { id: 'H3.2', ten: 'GTLN, GTNN khi biết hàm số', bb: true,
      mo_ta: 'Đề cho công thức; tìm GTLN, GTNN trên đoạn, khoảng hoặc nửa khoảng; ba bước: nghiệm của y′, tính f ở nghiệm và hai đầu mút, so sánh.',
      dang: [
        ['H3.2.1', 'Hàm đa thức trên đoạn', 'Giải y′=0 chọn nghiệm thuộc đoạn, tính giá trị tại nghiệm và hai đầu mút, lấy số lớn nhất và nhỏ nhất.', 'khong'],
        ['H3.2.2', 'Hàm phân thức trên đoạn', 'Bậc nhất/bậc nhất đơn điệu nên cực trị ở đầu mút; bậc hai/bậc nhất lập bảng biến thiên, chú ý đoạn không chứa nghiệm mẫu.', 'khong'],
        ['H3.2.3', 'Hàm chứa căn thức', 'Tìm tập xác định rồi dùng đạo hàm, hoặc đặt ẩn phụ/đánh giá khi hàm có hai căn.', 'khong'],
        ['H3.2.4', 'Hàm lượng giác, mũ, logarit', 'Giải y′=0 trong đoạn (hàm lượng giác có thể đặt t=sin x, cos x), tính giá trị tại nghiệm và đầu mút.', 'khong'],
        ['H3.2.5', 'Trên khoảng, nửa khoảng hoặc trên ℝ', 'Lập bảng biến thiên có giới hạn ở đầu mở; đầu mở không đạt giá trị nên có thể không tồn tại GTLN hoặc GTNN.', 'bbt'],
      ] },
    { id: 'H3.3', ten: 'GTLN, GTNN có tham số m', bb: true,
      mo_ta: 'Hàm số hoặc điều kiện chứa m; tìm m để GTLN, GTNN thoả điều kiện cho trước, hoặc dùng max–min để giải phương trình, bất phương trình tham số.',
      dang: [
        ['H3.3.1', 'Cho GTLN hoặc GTNN bằng k, tìm m', 'Biểu diễn max/min theo m (hàm đơn điệu thì ở đầu mút), cho bằng k rồi giải; kiểm tra điều kiện đạt được.', 'khong'],
        ['H3.3.2', 'Hàm y=|f(x)+m| trên đoạn', 'Gọi K, k là GTLN, GTNN của f; max|f+m|=max{|m+K|,|m+k|}; xét hai trường hợp khi cho max/min bằng a, không vượt quá M, đạt nhỏ nhất.', 'khong'],
        ['H3.3.3', 'Phương trình, bất phương trình chứa m dùng max–min', 'm≥f(x) nghiệm đúng ⇔ m≥max f; m≥f(x) có nghiệm ⇔ m≥min f; lập bảng biến thiên hàm vế không chứa m.', 'khong'],
      ] },
    { id: 'H3.4', ten: 'GTLN, GTNN nâng cao: hàm hợp và biểu thức nhiều biến', bb: false,
      mo_ta: 'Nâng cao: GTLN, GTNN của f(u(x)) khi biết bảng/đồ thị của f; biểu thức hai biến có ràng buộc đưa về một biến.',
      dang: [
        ['H3.4.1', 'Hàm hợp f(u(x)) từ bảng biến thiên hoặc đồ thị f′', 'Đặt t=u(x), tìm miền của t, đọc GTLN, GTNN của f trên miền đó từ bảng biến thiên hoặc dấu f′.', 'ca-hai'],
        ['H3.4.2', 'Biểu thức nhiều biến có ràng buộc', 'Rút một biến từ ràng buộc hoặc đặt t=x+y, tìm miền của t rồi khảo sát hàm một biến; dùng Cô-si khi bài cho phép.', 'khong'],
      ] },
  ] },

  { id: 'H4', ten: 'Đường tiệm cận của đồ thị hàm số', nhom: [
    { id: 'H4.1', ten: 'Tìm tiệm cận đứng và tiệm cận ngang khi biết hàm số', bb: true,
      mo_ta: 'Đề cho công thức; tìm hoặc đếm tiệm cận đứng, tiệm cận ngang bằng giới hạn.',
      dang: [
        ['H4.1.1', 'Hàm bậc nhất trên bậc nhất', 'y=(ax+b)/(cx+d): tiệm cận đứng x=−d/c, tiệm cận ngang y=a/c.', 'khong'],
        ['H4.1.2', 'Đếm tiệm cận của hàm phân thức hữu tỉ', 'Phân tích nhân tử để loại nghiệm chung của tử và mẫu; mỗi nghiệm còn lại của mẫu cho một tiệm cận đứng; so sánh bậc để có tiệm cận ngang.', 'khong'],
        ['H4.1.3', 'Hàm chứa căn thức hoặc giá trị tuyệt đối', 'Giới hạn khi x→+∞ và x→−∞ khác nhau nên có thể có hai tiệm cận ngang; nhân liên hợp khi cần.', 'khong'],
      ] },
    { id: 'H4.2', ten: 'Tìm tiệm cận xiên khi biết hàm số', bb: true,
      mo_ta: 'Đề cho công thức có tiệm cận xiên y=ax+b; tìm phương trình, hoặc tính biểu thức theo a, b.',
      dang: [
        ['H4.2.1', 'Hàm bậc hai trên bậc nhất: chia đa thức', 'Chia tử cho mẫu được y=ax+b+r/(cx+d); tiệm cận xiên là y=ax+b.', 'khong'],
        ['H4.2.2', 'Hàm đã tách phần nguyên', 'Cho sẵn y=ax+b+(phân thức có giới hạn 0); đọc ngay tiệm cận xiên, kiểm tra phần phân thức tiến tới 0.', 'khong'],
        ['H4.2.3', 'Hàm chứa căn: dùng a=lim f(x)/x, b=lim(f(x)−ax)', 'Tính a, b theo định nghĩa ở +∞ và −∞ riêng; có thể có hai tiệm cận xiên.', 'khong'],
      ] },
    { id: 'H4.3', ten: 'Đọc tiệm cận từ bảng biến thiên, đồ thị, giới hạn', bb: true,
      mo_ta: 'Đề cho hình hoặc giới hạn của hàm; đọc, đếm tiệm cận; chọn mệnh đề đúng.',
      dang: [
        ['H4.3.1', 'Đọc từ đồ thị', 'Đường mà đồ thị tiến sát: đứng ở chỗ đồ thị đi lên/xuống vô cực, ngang khi x ra vô cực, xiên khi đồ thị bám đường chéo.', 'dothi'],
        ['H4.3.2', 'Đọc từ bảng biến thiên, đếm tiệm cận', 'Giới hạn ở hai đầu cho tiệm cận ngang, giới hạn vô cực ở điểm gián đoạn cho tiệm cận đứng; nhớ đếm cả hai phía.', 'bbt'],
        ['H4.3.3', 'Từ giới hạn cho trước, theo định nghĩa', 'Đề cho lim f(x) tại x₀ hoặc ±∞ (kể cả giới hạn một phía); đối chiếu định nghĩa, chú ý tập xác định.', 'khong'],
        ['H4.3.4', 'Hàm hợp g=1/(f(x)+m) cho qua bảng biến thiên', 'Số tiệm cận đứng của g bằng số nghiệm của f(x)=−m; tiệm cận ngang suy từ giới hạn của f ở hai đầu.', 'bbt'],
      ] },
    { id: 'H4.4', ten: 'Tiệm cận có tham số m', bb: true,
      mo_ta: 'Hàm số chứa m; tìm m để đồ thị có đúng k tiệm cận, hoặc biết tiệm cận để tìm hệ số.',
      dang: [
        ['H4.4.1', 'Tìm m để có, không có hoặc có đúng k tiệm cận', 'Xét nghiệm mẫu phụ thuộc m, loại nghiệm trùng với tử, đếm tiệm cận ngang theo bậc; chia trường hợp theo m.', 'khong'],
        ['H4.4.2', 'Biết tiệm cận, tìm hệ số', 'Cho tiệm cận đứng/ngang/xiên hoặc cặp tiệm cận; đồng nhất để tìm a, b, m.', 'khong'],
      ] },
    { id: 'H4.5', ten: 'Hình học của tiệm cận', bb: true,
      mo_ta: 'Đề gắn tiệm cận với hình: tâm đối xứng, khoảng cách từ điểm trên đồ thị tới tiệm cận, diện tích hình tạo bởi tiệm cận và trục toạ độ, góc.',
      dang: [
        ['H4.5.1', 'Giao của hai tiệm cận, tâm đối xứng', 'Giao điểm tiệm cận đứng và tiệm cận ngang (hoặc xiên) là tâm đối xứng của đồ thị.', 'khong'],
        ['H4.5.2', 'Khoảng cách từ điểm M thuộc đồ thị tới hai tiệm cận', 'Đặt M(x₀; y₀) rồi tính d₁, d₂; tích d₁·d₂ không đổi, tổng d₁+d₂ nhỏ nhất bằng bất đẳng thức Cô-si.', 'khong'],
        ['H4.5.3', 'Diện tích hình tạo bởi tiệm cận và trục toạ độ', 'Tìm hai tiệm cận; hình chữ nhật, tam giác hoặc hình thang với Ox, Oy; tính diện tích rồi giải theo m nếu có.', 'khong'],
        ['H4.5.4', 'Góc giữa hai tiệm cận, giữa đường thẳng và tiệm cận', 'Dùng vectơ chỉ phương hoặc hệ số góc của hai đường để tính góc.', 'khong'],
      ] },
  ] },

  { id: 'H5', ten: 'Khảo sát và nhận dạng đồ thị hàm số', nhom: [
    { id: 'H5.1', ten: 'Khảo sát sự biến thiên và vẽ đồ thị', bb: true,
      mo_ta: 'Bài tự luận theo sơ đồ: tập xác định, chiều biến thiên, cực trị, giới hạn và tiệm cận, bảng biến thiên, vẽ đồ thị.',
      dang: [
        ['H5.1.1', 'Khảo sát hàm bậc ba', 'Có hai cực trị, không cực trị, a>0 và a<0; tâm đối xứng có hoành độ x=−b/(3a); lập bảng biến thiên rồi vẽ.', 'ca-hai'],
        ['H5.1.2', 'Khảo sát hàm bậc nhất trên bậc nhất', 'Không có cực trị, có tiệm cận đứng và ngang; xét dấu ad−bc để biết đồng biến hay nghịch biến, vẽ hai nhánh.', 'ca-hai'],
        ['H5.1.3', 'Khảo sát hàm bậc hai trên bậc nhất', 'Viết y=ax+b+r/(cx+d), tìm tiệm cận đứng và xiên, hai cực trị (nếu có), vẽ hai nhánh quanh tâm đối xứng.', 'ca-hai'],
      ] },
    { id: 'H5.2', ten: 'Nhận dạng hàm số, đồ thị, bảng biến thiên', bb: true,
      mo_ta: 'Cho hình, chọn công thức đúng trong bốn phương án, hoặc cho công thức, chọn đồ thị/bảng biến thiên đúng.',
      dang: [
        ['H5.2.1', 'Hàm bậc ba', 'Loại bằng dạng đồ thị (không có tiệm cận, hai cực trị hoặc không), dấu hệ số a theo hướng cuối của đồ thị, điểm đặc biệt.', 'ca-hai'],
        ['H5.2.2', 'Hàm bậc nhất trên bậc nhất', 'Đọc tiệm cận đứng, ngang và điểm cắt trục để chọn công thức.', 'ca-hai'],
        ['H5.2.3', 'Hàm bậc hai trên bậc nhất', 'Đọc tiệm cận đứng, tiệm cận xiên, điểm cắt Oy và chiều biến thiên để chọn công thức.', 'ca-hai'],
      ] },
    { id: 'H5.3', ten: 'Xác định dấu và giá trị các hệ số', bb: true,
      mo_ta: 'Cho đồ thị hoặc bảng biến thiên của hàm số có hệ số chữ; xác định dấu của a, b, c, d hoặc tính giá trị biểu thức theo hệ số.',
      dang: [
        ['H5.3.1', 'Dấu a, b, c, d của hàm bậc ba', 'a theo hướng đồ thị; d là tung độ giao điểm với Oy; dấu b, c theo tổng và tích hai nghiệm của y′=0.', 'dothi'],
        ['H5.3.2', 'Hệ số của hàm bậc nhất trên bậc nhất', 'Tiệm cận đứng x=−d/c, tiệm cận ngang y=a/c, giao Ox, Oy cho các hệ số.', 'dothi'],
        ['H5.3.3', 'Hệ số của hàm bậc hai trên bậc nhất', 'Tiệm cận đứng cho mẫu, tiệm cận xiên cho a và b của phần nguyên, điểm đi qua cho phần còn lại.', 'dothi'],
        ['H5.3.4', 'Lập công thức hàm số từ điều kiện', 'Hàm đi qua các điểm cho trước, có cực trị tại điểm cho trước; lập hệ phương trình theo các hệ số rồi giải.', 'khong'],
      ] },
    { id: 'H5.4', ten: 'Đọc tính chất của đồ thị cho sẵn, số nghiệm của f(x)=m', bb: true,
      mo_ta: 'Cho đồ thị hoặc bảng biến thiên; hỏi đơn điệu, cực trị, GTLN, giao trục, số nghiệm phương trình, tâm đối xứng.',
      dang: [
        ['H5.4.1', 'Đọc đơn điệu, cực trị, giao trục từ đồ thị', 'Đọc trực tiếp các tính chất rồi chọn mệnh đề đúng/sai.', 'dothi'],
        ['H5.4.2', 'Số nghiệm của f(x)=m, f(x)=k', 'Số nghiệm bằng số giao điểm của đồ thị với đường y=m; biện luận theo vị trí của đường thẳng so với cực trị.', 'ca-hai'],
        ['H5.4.3', 'Tâm đối xứng của đồ thị', 'Hàm bậc ba: tâm đối xứng có hoành độ x=−b/(3a); hàm phân thức: giao hai tiệm cận; chứng minh hai điểm đối xứng qua tâm.', 'khong'],
      ] },
  ] },

  { id: 'H6', ten: 'Các bài toán liên quan đến đồ thị hàm số', nhom: [
    { id: 'H6.1', ten: 'Tương giao của đồ thị với đường thẳng, với trục', bb: false,
      mo_ta: 'Nâng cao: tìm số giao điểm, điều kiện về hoành độ giao điểm, hình học trên các giao điểm.',
      dang: [
        ['H6.1.1', 'Số giao điểm, số nghiệm theo m', 'Lập phương trình hoành độ giao điểm, cô lập m, lập bảng biến thiên hàm vế kia rồi đếm nghiệm.', 'khong'],
        ['H6.1.2', 'Hoành độ giao điểm thoả hệ thức', 'Dùng Viète cho phương trình bậc hai (sau khi tách nghiệm đặc biệt) để xử lý hệ thức, cấp số cộng, cấp số nhân.', 'khong'],
        ['H6.1.3', 'Hình học trên các giao điểm', 'Độ dài AB cho trước, trung điểm, trọng tâm, diện tích tam giác với gốc toạ độ; biểu diễn bằng tổng và tích hoành độ.', 'khong'],
      ] },
    { id: 'H6.2', ten: 'Tiếp tuyến của đồ thị', bb: false,
      mo_ta: 'Nâng cao: viết phương trình tiếp tuyến theo các điều kiện khác nhau, tính đại lượng gắn với tiếp tuyến.',
      dang: [
        ['H6.2.1', 'Tiếp tuyến tại một điểm cho trước', 'Phương trình y=f′(x₀)(x−x₀)+f(x₀); kể cả khi cho tung độ, tại tâm đối xứng, tại giao với trục.', 'khong'],
        ['H6.2.2', 'Tiếp tuyến song song hoặc vuông góc đường thẳng cho trước', 'Hệ số góc k=f′(x₀) bằng k của đường thẳng (song song) hoặc tích bằng −1 (vuông góc); giải x₀ rồi viết phương trình.', 'khong'],
        ['H6.2.3', 'Tiếp tuyến cắt hai tiệm cận của hàm nhất biến', 'Tiếp tuyến tại M cắt hai tiệm cận tại A, B; M là trung điểm AB, diện tích tam giác IAB không đổi; tìm M để AB nhỏ nhất.', 'khong'],
      ] },
    { id: 'H6.3', ten: 'Điểm di động trên đồ thị', bb: false,
      mo_ta: 'Nâng cao: tìm điểm thuộc đồ thị thoả điều kiện về khoảng cách nhỏ nhất, đối xứng, toạ độ nguyên.',
      dang: [
        ['H6.3.1', 'Khoảng cách nhỏ nhất từ điểm trên đồ thị đến điểm hoặc đường cho trước', 'Đặt M(t; f(t)), lập d²(t) hoặc d(t), khảo sát hoặc dùng Cô-si để tìm giá trị nhỏ nhất.', 'khong'],
        ['H6.3.2', 'Hai điểm thuộc hai nhánh, cặp điểm đối xứng qua tâm', 'Tham số hoá hai điểm theo hai nhánh của hàm phân thức; dùng tâm đối xứng để tìm cặp điểm; khảo sát AB nhỏ nhất.', 'khong'],
        ['H6.3.3', 'Điểm có toạ độ nguyên thuộc đồ thị', 'Viết y=ax+b+r/(cx+d), điều kiện cx+d là ước của r; liệt kê rồi kiểm tra toạ độ nguyên.', 'khong'],
      ] },
    { id: 'H6.4', ten: 'Phương trình hợp từ đồ thị hàm bậc ba', bb: false,
      mo_ta: 'Nâng cao: đếm nghiệm các phương trình như f(f(x))=m, f(x³−3x)=m, |f(x)|=m khi biết đồ thị f.',
      dang: [
        ['H6.4.1', 'Phương trình f(u(x))=m, f(f(x))=m', 'Đặt t=u(x), đếm nghiệm t của f(t)=m từ đồ thị, rồi với mỗi t đếm số nghiệm x của u(x)=t.', 'dothi'],
        ['H6.4.2', 'Phương trình chứa |f(x)|, f(|x|)', 'Vẽ đồ thị |f(x)| (lấy đối xứng phần dưới Ox) hoặc f(|x|) (đối xứng qua Oy) rồi đếm giao điểm với y=m.', 'dothi'],
      ] },
  ] },

  { id: 'H7', ten: 'Ứng dụng đạo hàm giải quyết vấn đề thực tiễn', nhom: [
    { id: 'H7.1', ten: 'Tối ưu khi hàm mô hình đã cho sẵn', bb: true,
      mo_ta: 'Đề cho sẵn biểu thức mô tả đại lượng thực tế (lợi nhuận, nồng độ, nhiệt độ, công suất…), hỏi giá trị lớn nhất, nhỏ nhất, thời điểm đạt được.',
      dang: [
        ['H7.1.1', 'Tìm GTLN, GTNN của hàm mô hình trên miền thực tế', 'Xác định miền (t≥0, x nguyên, ràng buộc sản lượng), tìm cực trị của hàm đã cho, đối chiếu điều kiện thực tế.', 'khong'],
        ['H7.1.2', 'Tìm tham số của mô hình từ điều kiện cực trị hoặc điều kiện đầu', 'Dùng giá trị ban đầu, giá trị cực đại cho trước để lập hệ phương trình tìm a, b, c.', 'khong'],
        ['H7.1.3', 'Khoảng tăng, giảm và ý nghĩa thực tiễn của hàm mô hình', 'Xét dấu đạo hàm để biết đại lượng tăng hay giảm khi nào, trả lời bằng ngữ cảnh bài toán.', 'khong'],
      ] },
    { id: 'H7.2', ten: 'Tối ưu phải lập hàm từ hình học', bb: true,
      mo_ta: 'Đề mô tả hình (hộp, bể, khung, đoạn dây) với đại lượng cố định; tự chọn ẩn, lập hàm một biến rồi tìm giá trị lớn nhất, nhỏ nhất.',
      dang: [
        ['H7.2.1', 'Hộp, bể, lon: thể tích hoặc diện tích cố định, vật liệu nhỏ nhất', 'Chọn ẩn x, biểu diễn diện tích toàn phần hoặc thể tích theo x, tìm giá trị nhỏ nhất/lớn nhất; gồm bài cắt bốn góc tấm bìa.', 'khong'],
        ['H7.2.2', 'Diện tích, chu vi hình phẳng lớn nhất', 'Hình chữ nhật nội tiếp, khung cửa, hàng rào: lập diện tích theo một ẩn, tìm giá trị lớn nhất.', 'khong'],
        ['H7.2.3', 'Cắt, uốn dây thành hai hình', 'Chia sợi dây thành hai phần uốn hai hình khác nhau; lập tổng diện tích theo độ dài một phần.', 'khong'],
        ['H7.2.4', 'Parabol, đồ thị bậc ba đặt trong hệ toạ độ', 'Đặt hệ trục, lập phương trình đường cong từ các điểm cho trước rồi tối ưu diện tích hoặc độ cao.', 'dothi'],
      ] },
    { id: 'H7.3', ten: 'Tối ưu khoảng cách, đường đi, góc', bb: true,
      mo_ta: 'Đề hỏi đường đi nhanh nhất, ngắn nhất, vật dài nhất qua góc, góc nhìn lớn nhất; lập hàm theo một ẩn hình học.',
      dang: [
        ['H7.3.1', 'Đường đi qua hai môi trường', 'Bơi rồi chạy, ống dưới sông và trên đất; thời gian hoặc chi phí T(x)=√(a²+x²)/v₁+(L−x)/v₂; tìm x làm T nhỏ nhất.', 'khong'],
        ['H7.3.2', 'Khoảng cách ngắn nhất', 'Từ điểm đến đường cong/đường thẳng, giữa hai vật chuyển động; lập d²(t) rồi tìm giá trị nhỏ nhất.', 'khong'],
        ['H7.3.3', 'Thang, sào, ống dài nhất qua góc hành lang', 'Độ dài ℓ(θ)=a/sin θ+b/cos θ; vật qua được khi độ dài không vượt giá trị nhỏ nhất của ℓ.', 'khong'],
        ['H7.3.4', 'Góc nhìn, góc chiếu lớn nhất', 'Dùng hiệu hai góc, tan(α−β) hoặc hàm góc theo khoảng cách; tìm vị trí làm góc lớn nhất.', 'khong'],
      ] },
    { id: 'H7.4', ten: 'Tối ưu kinh tế', bb: true,
      mo_ta: 'Đề cho quan hệ giá–số lượng, chi phí, doanh thu; tự lập hàm lợi nhuận, doanh thu hoặc chi phí rồi tối ưu.',
      dang: [
        ['H7.4.1', 'Giá và cầu tuyến tính', 'Cứ giảm (tăng) giá a thì bán thêm (bớt) b; đặt x là số lần thay đổi, lập doanh thu hoặc lợi nhuận bậc hai rồi tìm giá trị lớn nhất.', 'khong'],
        ['H7.4.2', 'Lợi nhuận bằng doanh thu trừ chi phí cho sẵn', 'L(x)=R(x)−C(x) với R, C cho bằng công thức (có thể có thuế, ràng buộc sản lượng); tìm x làm L lớn nhất.', 'khong'],
        ['H7.4.3', 'Chi phí trung bình nhỏ nhất', 'C̄(x)=C(x)/x; tìm x làm C̄ nhỏ nhất bằng đạo hàm hoặc bất đẳng thức Cô-si.', 'khong'],
        ['H7.4.4', 'Số máy, số lô hàng tối ưu', 'Tổng chi phí gồm phần tăng theo số máy (lô) và phần giảm theo số máy (lô); lập hàm của số máy rồi tối ưu, chú ý biến nguyên.', 'khong'],
      ] },
    { id: 'H7.5', ten: 'Chuyển động: quãng đường, vận tốc, gia tốc', bb: true,
      mo_ta: 'Đề cho phương trình chuyển động s(t) (hoặc v(t)); dùng v=s′, a=v′ để tính, xét chiều chuyển động, tìm vận tốc, gia tốc lớn nhất.',
      dang: [
        ['H7.5.1', 'Tính vận tốc, gia tốc; chiều chuyển động; tăng giảm tốc', 'v=s′ (v>0 thì đi theo chiều dương), a=v′; xét dấu v, a để kết luận.', 'khong'],
        ['H7.5.2', 'Vận tốc, gia tốc lớn nhất', 'Khảo sát v(t) (hoặc a(t)) trên khoảng thời gian đã cho để tìm giá trị lớn nhất.', 'khong'],
      ] },
    { id: 'H7.6', ten: 'Tốc độ thay đổi của một đại lượng', bb: true,
      mo_ta: 'Đề cho hàm theo thời gian (dân số, ca bệnh, nồng độ, chi phí); đạo hàm là tốc độ thay đổi; hỏi tốc độ tại một thời điểm hoặc thời điểm tốc độ lớn nhất.',
      dang: [
        ['H7.6.1', 'Ý nghĩa của đạo hàm, chi phí biên', 'Tốc độ tăng dân số, tốc độ truyền bệnh f′(t); chi phí biên C′(x) xấp xỉ chi phí sản xuất thêm một đơn vị.', 'khong'],
        ['H7.6.2', 'Mô hình tăng trưởng: thời điểm tốc độ lớn nhất', 'Hàm logistic hoặc bậc ba; f′ đạt lớn nhất khi f″=0; tính thời điểm và tốc độ lớn nhất.', 'khong'],
      ] },
    { id: 'H7.7', ten: 'Tốc độ liên quan giữa hai đại lượng', bb: false,
      mo_ta: 'Nâng cao: hai đại lượng liên hệ bằng một công thức hình học; biết tốc độ của đại lượng này, tìm tốc độ của đại lượng kia bằng cách lấy đạo hàm hai vế theo thời gian.',
      dang: [
        ['H7.7.1', 'Quan hệ hình học: thang trượt, khoảng cách', 'Thang dựa tường, khoảng cách từ ra-đa đến máy bay: x²+y²=ℓ²; đạo hàm hai vế theo t, thay giá trị tại thời điểm xét.', 'khong'],
        ['H7.7.2', 'Thể tích nước dâng, diện tích thay đổi theo thời gian', 'Viết V theo chiều cao h, V′(t)=V′(h)·h′(t); từ lưu lượng bơm tìm tốc độ dâng mực nước.', 'khong'],
      ] },
    { id: 'H7.8', ten: 'Tiệm cận và giới hạn dài hạn trong mô hình', bb: true,
      mo_ta: 'Đề cho mô hình hữu tỉ mô tả nồng độ, dân số, chi phí; hỏi đại lượng tiến tới giá trị nào khi thời gian đủ lớn, hoặc không thể đạt được giá trị nào.',
      dang: [
        ['H7.8.1', 'Mô hình bão hoà cho sẵn: giá trị ngưỡng', 'Tiệm cận ngang y=L của hàm mô hình chính là giá trị mà đại lượng tiến tới nhưng không vượt qua.', 'khong'],
        ['H7.8.2', 'Tự lập hàm nồng độ, chi phí trung bình rồi tìm tiệm cận', 'Lập hàm tỉ số (lượng chất/thể tích, tổng chi phí/số lượng) rồi tìm tiệm cận ngang hoặc xiên.', 'khong'],
        ['H7.8.3', 'Tiệm cận đứng trong chi phí làm sạch', 'C(p)=kp/(100−p): tiệm cận đứng p=100 cho biết không thể làm sạch 100%; ý nghĩa của chi phí tăng vô hạn.', 'khong'],
      ] },
  ] },
]

export const THONG_KE = () => ({
  chuyen_de: CAY.length,
  nhom: CAY.reduce((s, c) => s + c.nhom.length, 0),
  dang: CAY.reduce((s, c) => s + c.nhom.reduce((t, n) => t + n.dang.length, 0), 0),
})
