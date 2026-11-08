// cau-truc.mjs — cây 4 tầng ĐỀ XUẤT cho chương "Vectơ và hệ trục toạ độ trong không gian" (K12, chủ đề NCD00096) — 22/10/2026.
// Làm giống chương Hàm số (k12-hs): Chuyên đề › Nhóm bài › Dạng bài + mô tả nhận biết + độ khó + nguồn tạo dạng. CHƯA ghi DB.
// 3 chuyên đề = 3 bài sách = 3 chuyên đề của bản đồ cũ (T1120701 · T1120702 · T1120703):
//   P1 Vectơ trong không gian (hình học tổng hợp, chưa dùng toạ độ) · P2 Hệ trục toạ độ trong không gian · P3 Biểu thức toạ độ của các phép toán vectơ.
// Quy ước đặt dạng (theo phản hồi của Thùy ở chương Hàm số): mỗi dạng = MỘT bài toán đặc trưng; bài đơn giản ở nhóm cơ bản, bài khó/nâng cao ở nhóm riêng; thực tế tách nhóm.
// Dạng: [tên, mô tả nhận biết, hình ('3d' = cần hình khối; 'khong'), độ khó đề xuất 1–5]. ĐỘ KHÓ + NGUỒN: xem phan-loai-dang.mjs.
import { DO_KHO, nguonCua } from './phan-loai-dang.mjs'

export const CHU_DE = { id: 'NCD00096', ten: 'Vectơ và hệ trục toạ độ trong không gian' }

const PHAN = [
  { id: 'P1', ten: 'Vectơ trong không gian', mo_ta: 'Hình học tổng hợp, chưa dùng toạ độ: khái niệm vectơ trên hình khối (hình hộp, lăng trụ, hình chóp, tứ diện), tổng–hiệu–tích với một số, ba vectơ đồng phẳng, tích vô hướng và góc, lực và công.', nhom: [
    ['P1.1', 'Khái niệm vectơ trong không gian', true, 'Hai vectơ cùng phương, cùng hướng, bằng nhau, đối nhau; độ dài vectơ; đọc các vectơ trên hình khối.', [
      ['Nhận biết các yếu tố của vectơ trên hình khối', 'Đề cho hình hộp, lăng trụ, tứ diện…; đếm hoặc chọn các vectơ bằng nhau, đối nhau, cùng phương, cùng hướng, có giá cho trước.', '3d', 1],
      ['Độ dài của tổng và hiệu hai vectơ trên hình đặc biệt', 'Tính |AB+AD|, |BC+DD′|… trên lập phương, hình hộp chữ nhật, tứ diện đều có cạnh cho trước.', '3d', 2],
    ]],
    ['P1.2', 'Tổng, hiệu hai vectơ và tích của một số với một vectơ', true, 'Quy tắc ba điểm, hình bình hành, hình hộp; vectơ đối; điều kiện cùng phương a=kb; trung điểm, trọng tâm.', [
      ['Tổng và hiệu vectơ trong hình hộp', 'Dùng quy tắc hình hộp AB+AD+AA′=AC′ để rút gọn hoặc tính tổng, hiệu các vectơ trên hình hộp, lập phương.', '3d', 2],
      ['Tổng và hiệu vectơ trong lăng trụ', 'Rút gọn, so sánh vectơ trong lăng trụ (đáy tam giác, tứ giác); vectơ bằng AA′, điểm M′ sao cho MM′=AA′.', '3d', 2],
      ['Tổng và hiệu vectơ trong hình chóp và tứ diện', 'Rút gọn, biểu diễn vectơ trong hình chóp, tứ diện bằng quy tắc ba điểm, hình bình hành.', '3d', 2],
      ['Chứng minh đẳng thức vectơ', 'Chứng minh hệ thức dạng AC+BD=AD+BC, AB+CD=… trong tứ diện, hình hộp bằng quy tắc ba điểm.', '3d', 3],
      ['Hệ thức trung điểm và trọng tâm', 'Dùng MA+MB=2MI, GA+GB+GC=0, OA+OB+OC=3OG để tính hoặc chứng minh trên hình khối.', '3d', 3],
      ['Phân tích một vectơ theo ba vectơ không đồng phẳng', 'Biểu diễn AM theo AB, AD, AA′ (hoặc ba vectơ cạnh của chóp, tứ diện) khi M xác định bởi tỉ số, trung điểm, trọng tâm.', '3d', 3],
      ['Cùng phương, thẳng hàng và tìm tỉ số trên hình khối', 'Chứng minh MN∥BD′, ba điểm thẳng hàng, tìm tỉ số k trong MN=kBD′ hay giao điểm của đường thẳng với mặt phẳng bằng cách biểu diễn vectơ.', '3d', 3],
    ]],
    ['P1.3', 'Ba vectơ đồng phẳng', false, 'Định nghĩa đồng phẳng, điều kiện c=ma+nb, nhận biết trên hình khối. (Nguồn chỉ dạy qua bài tập, lý thuyết nhóm cần viết mới.)', [
      ['Nhận biết ba vectơ đồng phẳng, không đồng phẳng trên hình', 'Đề cho hình hộp, lăng trụ, tứ diện; chọn bộ ba vectơ đồng phẳng hay không, có giá song song với một mặt phẳng.', '3d', 3],
      ['Chứng minh đồng phẳng và tìm hệ số', 'Chứng minh ba vectơ đồng phẳng bằng c=ma+nb, tìm m, n; tìm tham số để ba vectơ đồng phẳng.', '3d', 4],
    ]],
    ['P1.4', 'Tích vô hướng của hai vectơ và góc giữa hai vectơ', true, 'Góc giữa hai vectơ, a·b=|a||b|cos(a,b), a⊥b⇔a·b=0, a²=|a|², cách tìm góc khi hai vectơ khác điểm đầu.', [
      ['Tích vô hướng khi biết độ dài và góc', 'Hai vectơ độc lập cho độ dài và góc (hoặc a·b, |a|, |b|): tính |a+b|, (a+b)·(a−b), góc giữa hai vectơ.', 'khong', 2],
      ['Tích vô hướng của hai vectơ trên hình', 'Tính AB·AC, AS·BC, … trên tứ diện đều, chóp đều, lập phương, hình hộp bằng cách phân tích vectơ và dùng góc.', '3d', 3],
      ['Góc giữa hai vectơ trong hình đặc biệt', 'Tính góc (AB,DH), (AC,A′D′)… trên lập phương, hình hộp chữ nhật, tứ diện đều (đưa về cùng gốc).', '3d', 3],
      ['Tìm góc khi biết tích vô hướng', 'Cho a·b và độ dài (hoặc tích vô hướng nhiều vectơ), tính góc (a,b).', 'khong', 2],
      ['Biến đổi và đánh giá bằng tích vô hướng', 'Dùng |a±b|²=|a|²±2a·b+|b|², tìm giá trị nhỏ nhất/lớn nhất của biểu thức vectơ.', 'khong', 4],
      ['Chứng minh vuông góc và tính góc giữa hai đường thẳng bằng tích vô hướng', 'Tứ diện hoặc chóp tổng quát cho dữ kiện cạnh bằng nhau, góc ở đỉnh; chứng minh AB⊥CD hoặc tính góc giữa hai đường thẳng chéo nhau (đường chéo, cạnh đối) qua tích vô hướng.', '3d', 3],
    ]],
    ['P1.5', 'Lực và công trong không gian', true, 'Hợp lực, phân tích lực, lực căng, cân bằng của vật; công của lực A=F·d.', [
      ['Hợp lực, lực căng và cân bằng của vật', 'Tìm độ lớn hợp lực, lực căng dây, điều kiện cân bằng (tổng các lực bằng vectơ-không) trong đèn treo, cầu, chậu cây, giá đỡ…', '3d', 3],
      ['Công của lực', 'Tính công A=F·d=|F||d|cosα của lực kéo, trọng lực, lực tĩnh điện bằng tích vô hướng.', 'khong', 3],
    ]],
  ] },
  { id: 'P2', ten: 'Hệ trục toạ độ trong không gian', mo_ta: 'Hệ trục Oxyz, toạ độ của điểm và vectơ; gắn hệ trục vào hình khối; các mô hình thực tế lập hệ trục rồi đọc toạ độ.', nhom: [
    ['P2.1', 'Toạ độ của điểm và của vectơ', true, 'Hệ trục Oxyz (i, j, k), toạ độ điểm qua hình chiếu, toạ độ của OM, AB; điểm thuộc trục và mặt phẳng toạ độ.', [
      ['Đọc toạ độ điểm và vị trí điểm so với trục, mặt phẳng toạ độ', 'Cho điểm hoặc hình có hệ trục dựng sẵn; đọc toạ độ, nhận biết điểm thuộc trục Ox, Oy, Oz hoặc mặt phẳng (Oxy), (Oyz), (Oxz).', 'khong', 1],
      ['Hình chiếu và điểm đối xứng', 'Tìm toạ độ hình chiếu vuông góc của điểm lên trục, mặt phẳng toạ độ; điểm đối xứng qua trục, mặt phẳng toạ độ, gốc O.', 'khong', 2],
      ['Biểu diễn vectơ theo i, j, k và đọc toạ độ vectơ', 'Cho a=xi+yj+zk (hoặc OM, AB trên hình); đọc toạ độ vectơ, viết vectơ theo i, j, k.', 'khong', 1],
    ]],
    ['P2.2', 'Gắn hệ trục toạ độ vào hình khối', true, 'Chọn gốc và các trục sao cho toạ độ các đỉnh đơn giản; tìm toạ độ đỉnh từ độ dài cạnh, góc.', [
      ['Gắn hệ trục vào hình hộp chữ nhật, lập phương, hình hộp đứng', 'Chọn gốc tại một đỉnh, trục theo ba cạnh xuất phát; tìm toạ độ các đỉnh và điểm đặc biệt (trung điểm, trọng tâm mặt).', '3d', 3],
      ['Gắn hệ trục vào hình chóp, tứ diện có cạnh vuông góc', 'Chọn hệ trục theo các cạnh vuông góc đôi một (tứ diện vuông, chóp có đường cao); tìm toạ độ các đỉnh.', '3d', 3],
      ['Tìm toạ độ đỉnh khi biết độ dài cạnh và góc', 'Đáy là tam giác đều, hình thoi, hình chữ nhật…; dùng độ dài, góc để tính toạ độ các đỉnh sau khi gắn hệ trục.', '3d', 4],
    ]],
    ['P2.3', 'Mô hình thực tế dùng hệ trục toạ độ', true, 'Lập hệ trục cho công trình, thiết bị, rồi đọc toạ độ và tính các đại lượng cần tìm.', [
      ['Công trình, sân, phòng: lập hệ trục và đọc toạ độ', 'Nhà, kho, sân tennis, lều… cho kích thước; lập hệ trục, tìm toạ độ các điểm đặc biệt.', '3d', 3],
      ['Cần trục, giá đỡ, thiết bị: toạ độ và vectơ', 'Cần trục, giá đỡ ba chân, đèn treo… cho bằng toạ độ hoặc kích thước; tìm toạ độ điểm và vectơ cần dùng.', '3d', 3],
    ]],
  ] },
  { id: 'P3', ten: 'Biểu thức toạ độ của các phép toán vectơ', mo_ta: 'Tính toán trên toạ độ: tổng, hiệu, nhân số; trung điểm, trọng tâm; độ dài; tích vô hướng và góc; tích có hướng và ứng dụng; cực trị hình học; ứng dụng thực tế.', nhom: [
    ['P3.1', 'Toạ độ của tổng, hiệu, tích với một số; hai vectơ cùng phương', true, 'Biểu thức toạ độ a±b, ka; điều kiện cùng phương; tìm vectơ từ đẳng thức vectơ.', [
      ['Tính toạ độ của tổng, hiệu và tích với một số', 'Cho toạ độ các vectơ; tính toạ độ của a+b, a−b, ka, 2a−3b+…', 'khong', 1],
      ['Hai vectơ cùng phương và ba điểm thẳng hàng', 'Xét a=kb, tìm tham số m để hai vectơ cùng phương, chứng minh ba điểm thẳng hàng.', 'khong', 2],
      ['Tìm vectơ thoả đẳng thức vectơ', 'Tìm toạ độ vectơ x biết x+a=2b−c…; phân tích c=ma+nb+pd theo toạ độ.', 'khong', 2],
    ]],
    ['P3.2', 'Toạ độ vectơ AB, trung điểm, trọng tâm; tìm toạ độ điểm', true, 'AB=(xB−xA;…); trung điểm, trọng tâm; hình bình hành, hình hộp; chia đoạn theo tỉ số.', [
      ['Toạ độ của vectơ AB', 'Từ toạ độ hai điểm tính toạ độ AB; tìm điểm biết AB và một điểm.', 'khong', 1],
      ['Trung điểm và trọng tâm', 'Toạ độ trung điểm đoạn thẳng, trọng tâm tam giác, trọng tâm tứ diện; tìm đỉnh còn lại khi biết trọng tâm.', 'khong', 2],
      ['Hình bình hành và hình hộp: tìm đỉnh còn lại', 'Cho ba đỉnh hình bình hành (hoặc bốn đỉnh hình hộp); tìm toạ độ đỉnh còn lại bằng AD=BC.', '3d', 2],
      ['Điểm chia đoạn theo tỉ số; điểm trên trục và mặt phẳng toạ độ', 'Tìm M thuộc đoạn AB với MA=kMB; tìm điểm trên trục, mặt phẳng toạ độ thoả điều kiện thẳng hàng, tỉ số.', 'khong', 3],
      ['Tìm điểm thoả mãn đẳng thức vectơ', 'Tìm toạ độ điểm M từ đẳng thức OM=2AB−AC, MA+2MB−MC=0, ΣkMA=0 (biến đổi về toạ độ điểm cần tìm).', 'khong', 3],
    ]],
    ['P3.3', 'Độ dài vectơ và khoảng cách giữa hai điểm', true, '|a|=√(x²+y²+z²), AB=√(…); tam giác đặc biệt, điểm cách đều.', [
      ['Độ dài vectơ và khoảng cách giữa hai điểm', 'Tính |a|, AB, độ dài trung tuyến, đường chéo hình hộp từ toạ độ.', 'khong', 1],
      ['Chu vi và loại tam giác bằng độ dài', 'Tính chu vi; nhận biết tam giác cân, đều, vuông từ độ dài ba cạnh.', 'khong', 2],
      ['Điểm cách đều và điểm có khoảng cách cho trước', 'Tìm điểm trên trục, mặt phẳng toạ độ cách đều hai điểm hoặc cách một điểm một khoảng cho trước.', 'khong', 3],
    ]],
    ['P3.4', 'Tích vô hướng, góc và vuông góc theo toạ độ', true, 'a·b=xx′+yy′+zz′; cos(a,b); a⊥b⇔a·b=0.', [
      ['Tích vô hướng và cosin góc giữa hai vectơ', 'Tính a·b, |a|, cos(a,b) và số đo góc từ toạ độ.', 'khong', 2],
      ['Hai vectơ vuông góc và tham số', 'Tìm m để a⊥b, tam giác vuông tại một đỉnh, hai đường thẳng vuông góc theo vectơ.', 'khong', 3],
      ['Góc trong tam giác và tứ diện; điểm cho trước góc', 'Tính các góc của tam giác; tìm điểm M biết góc hoặc cos của góc tạo bởi các vectơ.', 'khong', 3],
    ]],
    ['P3.5', 'Tích có hướng và ứng dụng', false, '[a,b]=(y z′−z y′; z x′−x z′; x y′−y x′), vuông góc với cả a và b; diện tích, thể tích, đồng phẳng. (Sách chỉ nêu công thức [a,b]; các ứng dụng nằm trong bài giải.)', [
      ['Tính tích có hướng và vectơ vuông góc với hai vectơ', 'Tính [a,b]; tìm vectơ vuông góc với a và b; điều kiện a, b không cùng phương.', 'khong', 2],
      ['Diện tích tam giác và hình bình hành', 'S=½|[AB,AC]|, S_ABCD=|[AB,AD]|; đường cao hạ từ một đỉnh.', 'khong', 3],
      ['Thể tích hình hộp, tứ diện, chóp; ba vectơ đồng phẳng', 'V=|[a,b]·c|, V_tứ diện=⅙|[AB,AC]·AD|; ba vectơ đồng phẳng ⇔ [a,b]·c=0.', 'khong', 3],
    ]],
    ['P3.6', 'Cực trị hình học và tâm tỉ cự', false, 'Điểm I thoả Σk_i IA_i=0 (tâm tỉ cự), tổng bình phương Σk_i MA_i², điểm M trên mặt phẳng toạ độ làm biểu thức nhỏ nhất. (Lý thuyết nhóm cần viết mới.)', [
      ['Tâm tỉ cự và tổng Σk_i·MA_i²', 'Tìm I thoả k₁IA+k₂IB+k₃IC=0; tìm M để Σk_i MA_i² nhỏ nhất, giá trị nhỏ nhất.', 'khong', 4],
      ['Điểm M thuộc mặt phẳng toạ độ làm biểu thức nhỏ nhất', 'Tìm M∈(Oxy) (hoặc trục) để |MA+MB| hay MA+MB nhỏ nhất bằng hình chiếu, điểm đối xứng.', 'khong', 4],
      ['Cực trị vectơ khác', 'Giá trị lớn nhất, nhỏ nhất của độ dài, tích vô hướng, tổng các khoảng cách bằng bất đẳng thức hoặc quỹ tích.', 'khong', 5],
    ]],
    ['P3.7', 'Ứng dụng thực tế: chuyển động, radar, lực', true, 'Lập hệ trục cho tình huống thực tế rồi dùng toạ độ và vectơ: chuyển động thẳng đều, khoảng cách hai vật, hợp lực.', [
      ['Chuyển động thẳng đều trong không gian', 'Vị trí tại thời điểm t của vật chuyển động thẳng đều (máy bay, khinh khí cầu, tàu); khi nào đến một điểm, đi qua mặt phẳng.', 'khong', 3],
      ['Radar, khoảng cách và quan sát hai vật', 'Radar, camera, thiết bị dò: khoảng cách giữa hai vật chuyển động, điểm quan sát trên mặt đất, đối xứng qua (Oxy).', 'khong', 4],
      ['Lực và công viết bằng toạ độ', 'Hợp lực, lực căng, công của lực khi các lực cho bằng toạ độ.', 'khong', 3],
    ]],
  ] },
]

// tuple dạng: [id, ten, mo_ta, hinh, key (= id, khoá nội dung ra/J*.txt), do_kho, nguon]
export const CAY = PHAN.map((p) => ({
  id: p.id, ten: p.ten, mo_ta: p.mo_ta,
  nhom: p.nhom.map(([id, ten, bb, mo_ta, dang]) => ({
    id, cu: null, bb, ten, mo_ta,
    dang: dang.map(([dten, dmo, hinh, kho], i) => {
      const ma = `${id}.${i + 1}`
      return [ma, dten, dmo, hinh, ma, DO_KHO[ma] ?? kho, nguonCua(ma)]
    }),
  })),
}))

export const THONG_KE = () => ({
  chuyen_de: CAY.length,
  nhom: CAY.reduce((s, c) => s + c.nhom.length, 0),
  dang: CAY.reduce((s, c) => s + c.nhom.reduce((t, n) => t + n.dang.length, 0), 0),
})
