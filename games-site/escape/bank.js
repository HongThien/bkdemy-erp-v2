// BK Escape — ngân hàng câu hỏi Style 1 (nguồn: escape/NGAN-HANG-CAU-HOI.md, Thùy chốt 26/09).
// Mỗi câu = 1 "gốc" (id) có nhiều biến thể {q, a}; a luôn là 1 chữ số 0–9.
// Câu cố định có 1 biến thể; câu KHUÔN sinh nhiều biến thể bằng máy (đổi số ⇒ đổi đáp án) → lấp đủ chữ số, chống lộ đề.
// g: 1 = bẫy trực giác (30s) · 2 = suy luận · 3 = cân/bốc/đếm cách (1p30).
(function () {
  const B = [];
  const add = (g, id, name, variants) => B.push({ g, id, name, v: variants.filter(x => Number.isInteger(x.a) && x.a >= 0 && x.a <= 9) });
  const one = (q, a) => [{ q, a }];
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const vnd = n => n.toLocaleString('vi-VN');
  const THU = { 2: 'thứ Hai', 3: 'thứ Ba', 4: 'thứ Tư', 5: 'thứ Năm', 6: 'thứ Sáu', 7: 'thứ Bảy' };

  // ================= NHÓM 1 — BẪY TRỰC GIÁC =================
  add(1, '1-01', 'Bút và vở', range(1, 9).map(x => ({
    q: `Bút và vở giá tổng cộng ${vnd(10000 + 200 * x)}đ. Vở đắt hơn bút đúng 10.000đ.\nBút giá mấy TRĂM đồng?`, a: x })));
  add(1, '1-02', 'Máy làm hàng', range(2, 9).map(n => ({
    q: `${n} cái máy làm ${n} sản phẩm hết ${n} phút.\n100 cái máy làm 100 sản phẩm hết mấy phút?`, a: n })));
  add(1, '1-03', 'Bèo phủ ao', range(2, 10).map(n => ({
    q: `Bèo trên ao mỗi ngày nở gấp đôi. Đến ngày thứ ${n} thì bèo phủ kín ao.\nNgày thứ mấy bèo phủ được nửa ao?`, a: n - 1 })));
  add(1, '1-04', 'Mèo bắt chuột', range(2, 9).map(k => ({
    q: `${k} con mèo bắt ${k} con chuột hết ${k} phút.\nCần mấy con mèo để bắt 100 con chuột trong 100 phút?`, a: k })));
  add(1, '1-05', 'Ngày trong tuần', range(2, 7).map(d => ({
    q: `"7 ngày sau của 70 ngày trước" là ${THU[d]}.\n"7 ngày trước của 70 ngày sau" là thứ mấy?`, a: d })));
  add(1, '1-06', 'Cái hố', [[2, 2, 2], [3, 2, 1], [2, 1, 3]].map(([s, r, d]) => ({
    q: `Một cái hố sâu ${s}m, rộng ${r}m, dài ${d}m.\nTrong hố có bao nhiêu mét khối đất?`, a: 0 })));
  add(1, '1-10', 'Xếp hạng trong lớp', range(2, 5).map(k => ({
    q: `Minh vừa đứng thứ ${k} tính từ trên xuống, vừa đứng thứ ${k} tính từ dưới lên trong bảng điểm của lớp.\nLớp có mấy học sinh?`, a: 2 * k - 1 })));
  add(1, '1-11', 'Mua bán con heo', [60, 50, 40].map(p => ({
    q: `Mua con heo giá ${p} nghìn, bán ${p + 10} nghìn. Mua lại ${p + 20} nghìn, rồi bán ${p + 30} nghìn.\nTổng cộng lãi mấy CHỤC nghìn?`, a: 2 })));
  add(1, '1-12', 'Uống thuốc', [{ q: `Bác sĩ đưa 3 viên thuốc, dặn cứ 30 phút uống 1 viên, uống viên đầu tiên ngay bây giờ.\nSau mấy GIỜ thì uống hết?`, a: 1 },
    ...range(3, 10).map(n => ({ q: `Bác sĩ đưa ${n} viên thuốc, dặn cứ 1 giờ uống 1 viên, uống viên đầu tiên ngay bây giờ.\nSau mấy giờ thì uống hết?`, a: n - 1 }))]);
  add(1, '1-13', 'Cưa gỗ', [...[2, 4, 5].map(m => ({ q: `Cưa một khúc gỗ thành 3 khúc hết 4 phút.\nCưa thành ${m} khúc (cùng tốc độ) hết mấy phút?`, a: 2 * (m - 1) })),
    ...range(4, 10).map(m => ({ q: `Cưa một khúc gỗ thành 3 khúc hết 2 phút.\nCưa thành ${m} khúc (cùng tốc độ) hết mấy phút?`, a: m - 1 }))]);
  add(1, '1-14', 'Leo cầu thang', range(2, 10).filter(k => k !== 3).map(k => ({
    q: `Đi bộ từ tầng 1 lên tầng 3 hết 2 phút.\nĐi từ tầng 1 lên tầng ${k} (cùng tốc độ) hết mấy phút?`, a: k - 1 })));
  add(1, '1-15', 'Đồng hồ đánh chuông', range(2, 10).filter(m => m !== 6).map(m => ({
    q: `Đồng hồ đánh 6 tiếng chuông hết 5 giây.\nĐánh ${m} tiếng hết mấy giây?`, a: m - 1 })));
  add(1, '1-16', 'Đào hố', one(`2 người đào 2 cái hố hết 2 giờ.\n1 người đào NỬA cái hố hết mấy giờ?`, 1));
  add(1, '1-17', 'Đi câu cá', one(`2 người cha và 2 người con đi câu, mỗi người câu được đúng 1 con cá. Về nhà chỉ có 3 con cá, không mất con nào.\nCó mấy người đi câu?`, 3));
  add(1, '1-18', 'Mèo trong phòng', one(`Căn phòng vuông có 4 góc, mỗi góc có 1 con mèo. Trước mặt mỗi con mèo có 3 con mèo.\nTrong phòng có mấy con mèo?`, 4));
  add(1, '1-19', 'Hai đồng xu', one(`Có 2 đồng xu, tổng cộng 6.000đ. Một trong hai đồng KHÔNG phải đồng 5.000đ.\nĐồng đó là mấy nghìn đồng?`, 1));
  add(1, '1-21', 'Quả trứng', range(5, 9).flatMap(n => range(1, 3).map(k => ({
    q: `Tôi có ${n} quả trứng. Tôi làm vỡ ${k} quả, rán ${k} quả, rồi ăn ${k} quả.\nTôi còn mấy quả trứng?`, a: n - k }))));

  // ================= NHÓM 2 — SUY LUẬN =================
  add(2, '2-01', 'Tuổi 3 cô con gái', one(`Điều tra viên hỏi tuổi 3 đứa con. Mẹ nói: "Tích tuổi 3 đứa là 36." — "Chưa đủ để biết."\n"Tổng tuổi 3 đứa bằng số nhà bên kia đường." Anh nhìn số nhà: "Vẫn chưa đủ."\n"Đứa lớn nhất đang học piano." — "À, tôi biết rồi!"\nĐứa lớn nhất mấy tuổi?`, 9));
  add(2, '2-02', 'Anh em trai – chị em gái', one(`Trong một gia đình: mỗi cậu con trai có số anh em trai BẰNG số chị em gái. Mỗi cô con gái có số anh em trai GẤP ĐÔI số chị em gái.\nNhà có mấy người con?`, 7));
  add(2, '2-03', 'Sư Tử & Kỳ Lân', one(`Sư Tử luôn nói dối vào thứ Hai, Ba, Tư. Kỳ Lân luôn nói dối vào thứ Năm, Sáu, Bảy. Các ngày khác cả hai nói thật.\nHôm nay cả hai cùng nói: "Hôm qua tôi nói dối."\nHôm nay là thứ mấy?`, 5));
  add(2, '2-04', 'Hiệp sĩ & Kẻ dối (3 người)', one(`Mỗi người hoặc LUÔN nói thật, hoặc LUÔN nói dối.\nA: "B nói dối." — B: "C nói dối." — C: "A và B đều nói dối."\nCó mấy người nói thật?`, 1));
  add(2, '2-05', 'Hiệp sĩ & Kẻ dối (2 người)', one(`Mỗi người hoặc LUÔN nói thật (hiệp sĩ), hoặc LUÔN nói dối (kẻ dối).\nA nói: "Hoặc tôi là kẻ dối, hoặc B là hiệp sĩ."\nTrong A và B có mấy hiệp sĩ?`, 2));
  add(2, '2-06', 'Cùng một câu nói', range(3, 5).map(n => ({
    q: `${n} người, mỗi người hoặc LUÔN nói thật, hoặc LUÔN nói dối. Cả ${n} người cùng nói đúng một câu:\n"Trong ${n} chúng tôi có đúng 1 người nói thật."\nCó mấy người nói thật?`, a: 0 })));
  { // 2-07 Ai lấy bánh: người "tôi không lấy" thứ hai là thủ phạm; đổi chỗ ngồi ⇒ đáp án 1/2/3
    const N = ['An', 'Bình', 'Chi'], v = [];
    for (const p of [[0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 2, 1], [1, 0, 2], [2, 1, 0]]) {
      const [x, y, z] = p.map(i => N[i]), seat = {}; N.forEach((n, i) => seat[n] = i + 1);
      v.push({ q: `Ba bạn ngồi ghế số 1 An, số 2 Bình, số 3 Chi. Đúng 1 bạn đã lấy bánh, và đúng 1 bạn nói thật.\n${x}: "${y} lấy." — ${y}: "Tôi không lấy." — ${z}: "Tôi không lấy."\nBạn ngồi ghế số mấy đã lấy bánh?`, a: seat[z] });
    }
    add(2, '2-07', 'Ai lấy bánh', v);
  }
  { // 2-08 3 hộp nhãn sai: đáp án = số của hộp dán "Táo + Cam"
    const L = ['"Táo"', '"Cam"', '"Táo + Cam"'], v = [];
    for (const p of [[0, 1, 2], [2, 0, 1], [1, 2, 0]]) v.push({
      q: `3 hộp số 1, 2, 3 lần lượt dán nhãn ${p.map(i => L[i]).join(', ')}. Biết CẢ 3 nhãn đều sai.\nBạn chỉ được lấy 1 quả từ 1 hộp, rồi phải nói đúng cả 3 hộp chứa gì.\nLấy từ hộp số mấy?`, a: p.indexOf(2) + 1 });
    add(2, '2-08', '3 hộp dán nhãn sai', v);
  }
  add(2, '2-09', '3 công tắc – 3 bóng đèn', one(`Ngoài cửa có 3 công tắc. Trong phòng đóng kín có 3 bóng đèn, mỗi công tắc bật 1 bóng. Đứng ngoài không nhìn thấy gì.\nÍt nhất phải vào phòng mấy lần để biết công tắc nào bật bóng nào?`, 1));
  add(2, '2-10', '4 lá bài', one(`4 lá bài, mỗi lá có 1 mặt là chữ cái, mặt kia là số. Đang thấy:  A · K · 4 · 7\nLuật: "Nếu mặt chữ là nguyên âm thì mặt kia là số chẵn."\nÍt nhất phải lật mấy lá để biết luật có đúng không?`, 2));
  add(2, '2-11', 'Bóng đèn bật tắt', [...range(10, 99)].filter((_, i) => i % 3 === 0).map(n => ({
    q: `${n} bóng đèn đánh số 1 → ${n}, đang tắt hết. Có ${n} người. Người thứ k bấm công tắc (đang tắt thì bật, đang bật thì tắt) mọi bóng có số chia hết cho k.\nSau khi cả ${n} người bấm xong, có mấy bóng sáng?`, a: Math.floor(Math.sqrt(n)) })));
  add(2, '2-12', 'Tháp Hà Nội', one(`3 cái đĩa to nhỏ khác nhau xếp ở cọc trái (to dưới, nhỏ trên). Chuyển cả chồng sang cọc phải, mỗi lần chỉ 1 đĩa, đĩa to không được đè lên đĩa nhỏ, được dùng cọc giữa.\nÍt nhất mấy lần chuyển?`, 7));
  add(2, '2-13', 'Sói – Dê – Bắp cải', one(`Người lái đò chở sói, dê và bắp cải qua sông. Thuyền chỉ chở được người + 1 thứ. Vắng người thì sói ăn dê, dê ăn bắp cải.\nÍt nhất mấy lượt thuyền qua sông (mỗi chiều tính 1 lượt)?`, 7));
  { // 2-14 Josephus: n người, cứ loại người kế bên
    const J = n => { let r = 0; for (let i = 2; i <= n; i++) r = (r + 2) % i; return r + 1 };
    add(2, '2-14', 'Vòng tròn Josephus', range(4, 10).map(n => ({
      q: `${n} người đánh số 1 → ${n} đứng thành vòng tròn. Người 1 loại người 2 rồi đưa kiếm cho người 3; người 3 loại người 4 rồi đưa kiếm cho người kế tiếp còn lại… cứ thế vòng quanh.\nNgười số mấy còn lại cuối cùng?`, a: J(n) })));
  }
  add(2, '2-15', 'Đấu loại trực tiếp', range(5, 10).map(n => ({
    q: `${n} kỳ thủ đấu loại trực tiếp: mỗi trận 2 người, thua là bị loại (vòng nào lẻ người thì có người được miễn đấu).\nTổng cộng mấy trận để tìm ra nhà vô địch?`, a: n - 1 })));
  { // 2-16 Nim: đếm tới N, mỗi lượt 1..k số; đi trước dừng ở N mod (k+1)
    const v = [];
    for (const k of [2, 3, 4, 5]) for (const N of range(10, 30)) { const a = N % (k + 1); if (a > 0 && a <= 9) v.push({
      q: `Hai người lần lượt đếm tiếp từ 1, mỗi lượt được đếm 1 đến ${k} số liền nhau (vd: "1, 2" rồi người kia "3"…). Ai nói ra số ${N} là THẮNG.\nBạn đi trước. Lượt đầu tiên bạn phải dừng ở số mấy để chắc chắn thắng?`, a }) }
    add(2, '2-16', 'Trò đếm (Nim)', v);
  }
  add(2, '2-17', 'Kim đồng hồ trùng nhau', range(2, 10).map(h => ({
    q: `Tính từ SAU 12 giờ trưa đến TRƯỚC ${h} giờ chiều, kim giờ và kim phút trùng khít lên nhau mấy lần?`, a: Math.ceil(11 * h / 12) - 1 })));
  add(2, '2-18', 'Sinh nhật Cheryl', one(`Cheryl cho 10 ngày có thể là sinh nhật mình: 15/5 · 16/5 · 19/5 · 17/6 · 18/6 · 14/7 · 16/7 · 14/8 · 15/8 · 17/8.\nCheryl nói riêng THÁNG cho Albert, nói riêng NGÀY cho Bernard.\nAlbert: "Tôi không biết, nhưng tôi chắc Bernard cũng không biết."\nBernard: "Lúc đầu tôi không biết, nhưng giờ tôi biết rồi."\nAlbert: "Vậy giờ tôi cũng biết."\nSinh nhật Cheryl vào tháng mấy?`, 7));
  add(2, '2-19', 'Qua sông (Kordemsky)', one(`Bố nặng 80kg, 2 con mỗi đứa 40kg. Thuyền chở tối đa 80kg và phải có người chèo.\nMỗi lần thuyền đi từ bờ này sang bờ kia tính 1 chuyến. Ít nhất mấy chuyến để cả 3 người sang bờ bên kia?`, 5));
  { // 2-20 Bình nước: BFS tìm số bước ít nhất
    const steps = (A, Bc, T) => { const seen = new Set(['0,0']); let fr = [[0, 0]], d = 0;
      while (fr.length) { if (fr.some(([x, y]) => x === T || y === T)) return d; const nx = [];
        for (const [x, y] of fr) { const p = Math.min(x, Bc - y), r = Math.min(y, A - x);
          for (const s of [[A, y], [x, Bc], [0, y], [x, 0], [x - p, y + p], [x + r, y - r]]) { const k = s + ''; if (!seen.has(k)) { seen.add(k); nx.push(s) } } }
        fr = nx; d++ } return -1 };
    const v = [];
    for (const [A, Bc, T] of [[3, 5, 4], [3, 5, 1], [4, 7, 5], [4, 9, 6], [2, 7, 3], [3, 7, 5], [5, 8, 2], [3, 4, 2], [4, 7, 2]]) { const a = steps(A, Bc, T); if (a >= 2) v.push({
      q: `Có 2 bình rỗng ${A} lít và ${Bc} lít (không có vạch chia), vòi nước dùng thoải mái.\nMỗi lần ĐỔ ĐẦY 1 bình, ĐỔ BỎ 1 bình, hoặc RÓT từ bình này sang bình kia tính là 1 bước.\nÍt nhất mấy bước để trong 1 bình có đúng ${T} lít?`, a }) }
    add(2, '2-20', 'Hai bình nước', v);
  }
  { // 2-21 Cầu & đèn pin 3 người: tối ưu = a+b+c
    const v = []; for (const [a, b, c] of [[1, 2, 5], [1, 2, 4], [1, 2, 3], [1, 3, 4], [1, 3, 5], [1, 2, 6]]) v.push({
      q: `Trời tối, 3 người qua một cây cầu hẹp hết lần lượt ${a}, ${b}, ${c} phút. Cầu chịu tối đa 2 người, có đúng 1 đèn pin và ai qua cầu cũng phải cầm đèn (không ném được). Đi 2 người thì theo tốc độ người chậm hơn.\nÍt nhất mấy phút để cả 3 qua cầu?`, a: a + b + c });
    add(2, '2-21', 'Cầu và đèn pin', v);
  }
  { const E = `4 ngôi nhà số 1 → 4 xếp từ trái sang phải. Mỗi nhà sơn 1 màu (Đỏ, Xanh, Vàng, Trắng) và nuôi 1 con (Mèo, Chó, Cá, Chim), không trùng nhau.\n① Nhà Đỏ nằm ngay bên trái nhà Xanh.\n② Nhà Vàng không nằm cạnh nhà Đỏ.\n③ Nhà Trắng ở một đầu dãy.\n④ Nhà Vàng nuôi Cá, và nhà nuôi Cá ở một đầu dãy.\n⑤ Nhà số 1 nuôi Chim.\n⑥ Con Chó sống ở nhà Xanh.\n`;
    add(2, '2-22', 'Câu đố Einstein thu nhỏ', [{ q: E + 'Con MÈO ở nhà số mấy?', a: 2 }, { q: E + 'Con CHÓ ở nhà số mấy?', a: 3 }, { q: E + 'Con CÁ ở nhà số mấy?', a: 4 }]); }
  add(2, '2-24', 'Ma phương Lạc Thư', [{ q: `Điền các số 1 → 9 vào lưới 3×3, mỗi số đúng 1 lần, sao cho mọi hàng, mọi cột và 2 đường chéo đều có tổng 15.\nÔ CHÍNH GIỮA là số mấy?`, a: 5 },
    ...[1, 2, 3, 4, 6, 7, 8, 9].map(x => ({ q: `Điền các số 1 → 9 vào lưới 3×3, mỗi số đúng 1 lần, sao cho mọi hàng, mọi cột và 2 đường chéo đều có tổng 15.\nMột ô sát mép (không phải ô giữa) đang là số ${x}.\nÔ ĐỐI XỨNG với nó qua ô chính giữa là số mấy?`, a: 10 - x }))]);

  // ================= NHÓM 3 — CÂN · BỐC · ĐẾM CÁCH =================
  add(3, '3-01', 'Tìm viên bi nặng', [[8, 2], [9, 2], [6, 2], [20, 3], [27, 3], [15, 3], [50, 4], [81, 4]].map(([n, a]) => ({
    q: `${n} viên bi giống hệt nhau, trong đó có đúng 1 viên nặng hơn. Có 1 cái cân hai đĩa (không có quả cân).\nÍt nhất mấy lần cân để CHẮC CHẮN tìm ra viên nặng?`, a })));
  add(3, '3-02', '12 viên bi lệch', one(`12 viên bi giống hệt nhau, có đúng 1 viên LỆCH cân — nhưng không biết nó nặng hơn hay nhẹ hơn. Có 1 cân hai đĩa.\nÍt nhất mấy lần cân để chắc chắn tìm ra viên lệch?`, 3));
  add(3, '3-03', 'Rượu độc', [8, 16, 30, 60, 100, 200, 500, 1000].map(n => ({
    q: `Có ${n} chai rượu, đúng 1 chai có độc. Chuột uống phải chai độc sẽ chết sau đúng 1 giờ. Bạn chỉ có đúng 1 giờ (mỗi con chuột được uống thử bao nhiêu chai cũng được).\nCần ít nhất mấy con chuột để tìm ra chai độc?`, a: Math.ceil(Math.log2(n)) })));
  add(3, '3-04', 'Găng tay trong bóng tối', range(1, 4).map(k => ({
    q: `Tủ tối om có ${k} đôi găng tay đen và ${k} đôi găng tay trắng để lẫn lộn (găng có chiếc tay trái, chiếc tay phải).\nBốc ít nhất mấy chiếc để CHẮC CHẮN có 1 đôi đeo được (1 trái + 1 phải, cùng màu)?`, a: 2 * k + 1 })));
  add(3, '3-05', 'Khối lập phương sơn', [
    { q: `Khối lập phương to 3×3×3 được sơn kín bên ngoài, rồi cắt thành 27 khối nhỏ bằng nhau.\nCó mấy khối nhỏ có đúng 3 mặt dính sơn?`, a: 8 },
    { q: `Khối lập phương to 3×3×3 được sơn kín bên ngoài, rồi cắt thành 27 khối nhỏ bằng nhau.\nCó mấy khối nhỏ có đúng 1 mặt dính sơn?`, a: 6 },
    { q: `Khối lập phương to 3×3×3 được sơn kín bên ngoài, rồi cắt thành 27 khối nhỏ bằng nhau.\nCó mấy khối nhỏ KHÔNG dính sơn mặt nào?`, a: 1 },
    { q: `Khối lập phương to 3×3×3 được sơn kín bên ngoài, rồi cắt thành 27 khối nhỏ bằng nhau.\nCó mấy khối nhỏ có đúng 4 mặt dính sơn?`, a: 0 },
    { q: `Khối lập phương to 4×4×4 được sơn kín bên ngoài, rồi cắt thành 64 khối nhỏ bằng nhau.\nCó mấy khối nhỏ KHÔNG dính sơn mặt nào?`, a: 8 }]);
  { // 3-06 Ốc sên: ngày thứ mấy ra khỏi giếng
    const day = (H, u, d) => u >= H ? 1 : Math.ceil((H - u) / (u - d)) + 1, v = [];
    for (const [H, u, d] of [[10, 3, 2], [11, 3, 2], [12, 4, 2], [9, 3, 1], [20, 5, 3], [15, 4, 2], [10, 4, 3], [7, 3, 2], [13, 5, 3]]) { const a = day(H, u, d); if (a <= 9) v.push({
      q: `Con ốc sên ở đáy giếng sâu ${H}m. Ban ngày leo lên ${u}m, ban đêm tụt xuống ${d}m.\nNgày thứ mấy ốc sên ra khỏi miệng giếng?`, a }) }
    add(3, '3-06', 'Ốc sên dưới giếng', v);
  }
  add(3, '3-07', 'Tất trong bóng tối', range(2, 8).map(k => ({
    q: `Ngăn kéo tối om có rất nhiều chiếc tất của ${k} màu khác nhau để lẫn lộn.\nLấy ít nhất mấy chiếc để CHẮC CHẮN có 2 chiếc cùng màu?`, a: k + 1 })));
  add(3, '3-09', 'Bốc bi nhiều màu', [[3, 3], [2, 3], [2, 4], [4, 3], [2, 5], [3, 2]].map(([k, m]) => ({
    q: `Hộp có bi ${k} màu, mỗi màu 10 viên. Bịt mắt bốc bi.\nBốc ít nhất mấy viên để CHẮC CHẮN có ${m} viên cùng màu?`, a: k * (m - 1) + 1 })));
  add(3, '3-10', '25 con ngựa', one(`Có 25 con ngựa và 1 đường đua 5 làn. Không có đồng hồ — mỗi lượt đua chỉ biết thứ tự về đích của 5 con trong lượt đó.\nÍt nhất mấy lượt đua để tìm ra 3 con nhanh nhất?`, 7));
  add(3, '3-11', 'Chồng xu giả', one(`Có 10 chồng xu, mỗi chồng 10 đồng. Có đúng 1 chồng toàn xu giả: mỗi đồng giả nặng hơn đồng thật 1 gam (biết đồng thật nặng bao nhiêu). Có 1 cân điện tử hiện số gam.\nÍt nhất mấy lần cân để tìm ra chồng xu giả?`, 1));
  add(3, '3-13', 'Cắt khối gỗ', [
    { q: `Khối gỗ lập phương 3×3×3 cần cắt thành 27 khối nhỏ bằng nhau. Sau mỗi nhát được xếp chồng, sắp xếp lại các mảnh tuỳ ý rồi mới cắt nhát tiếp.\nÍt nhất mấy nhát cắt?`, a: 6 },
    { q: `Khối gỗ lập phương 2×2×2 cần cắt thành 8 khối nhỏ bằng nhau. Sau mỗi nhát được xếp chồng, sắp xếp lại các mảnh tuỳ ý rồi mới cắt nhát tiếp.\nÍt nhất mấy nhát cắt?`, a: 3 }]);
  add(3, '3-14', 'Cắt bánh', [[2, 4], [3, 7]].map(([n, a]) => ({
    q: `Cắt 1 cái bánh tròn phẳng bằng ${n} nhát dao thẳng (không xếp chồng các miếng lên nhau).\nNhiều nhất được mấy miếng?`, a })));
  add(3, '3-15', 'Hai xúc xắc', one(`Tung 2 con xúc xắc rồi cộng số chấm ở 2 mặt trên.\nTổng nào có khả năng xuất hiện nhiều nhất?`, 7));
  add(3, '3-16', 'Thả trứng', [[6, 3], [10, 4], [15, 5], [21, 6], [28, 7], [36, 8], [45, 9]].map(([F, a]) => ({
    q: `Toà nhà ${F} tầng, có 2 quả trứng giống nhau. Cần tìm tầng thấp nhất mà thả trứng xuống thì vỡ (trứng chưa vỡ được thả lại).\nTrong trường hợp xấu nhất, ít nhất phải thả mấy lần?`, a })));
  add(3, '3-17', 'Quả cân', [
    ...[[4, 2], [13, 3], [40, 4], [121, 5]].map(([R, a]) => ({ q: `Cân hai đĩa, được đặt quả cân ở CẢ HAI bên đĩa.\nCần ít nhất mấy quả cân để cân được mọi vật nặng 1, 2, 3, …, ${R} kg?`, a })),
    ...[[7, 3], [15, 4], [31, 5], [63, 6], [127, 7], [255, 8], [511, 9]].map(([R, a]) => ({ q: `Cân hai đĩa, quả cân chỉ được đặt ở MỘT bên đĩa (bên kia là vật cần cân).\nCần ít nhất mấy quả cân để cân được mọi vật nặng 1, 2, 3, …, ${R} kg?`, a }))]);
  add(3, '3-18', 'Đường đi trên lưới', [[1, 2, 3], [1, 3, 4], [1, 4, 5], [2, 2, 6], [1, 6, 7], [1, 7, 8], [1, 8, 9]].map(([r, c, a]) => ({
    q: `Lưới ô vuông ${r} hàng × ${c} cột. Đi dọc theo các đường kẻ từ góc TRÊN-TRÁI đến góc DƯỚI-PHẢI, mỗi bước chỉ được sang PHẢI hoặc đi XUỐNG.\nCó mấy đường đi khác nhau?`, a })));
  add(3, '3-19', 'Leo cầu thang', [[3, 3], [4, 5], [5, 8]].map(([n, a]) => ({
    q: `Cầu thang có ${n} bậc. Mỗi bước được leo 1 bậc hoặc 2 bậc.\nCó mấy cách khác nhau để leo lên hết cầu thang?`, a })));
  add(3, '3-20', 'Chắc chắn trùng', [
    { q: `Cần ít nhất mấy người để CHẮC CHẮN có 2 người sinh cùng một thứ trong tuần (thứ Hai, thứ Ba, …, Chủ nhật)?`, a: 8 },
    { q: `Cần ít nhất mấy người để CHẮC CHẮN có 2 người có cùng nhóm máu (A, B, AB, O)?`, a: 5 }]);
  add(3, '3-21', 'Bắt tay', range(3, 9).map(n => ({
    q: `Một nhóm bạn gặp nhau, mỗi cặp bắt tay nhau đúng 1 lần. Đếm được tổng cộng ${n * (n - 1) / 2} cái bắt tay.\nNhóm có mấy người?`, a: n })));
  add(3, '3-22', 'Xếp chỗ ngồi', one(`Có mấy cách xếp 3 bạn An, Bình, Chi ngồi thành 1 hàng ngang 3 ghế?`, 6));

  window.ESC_BANK = B;
  window.ESC_LIMIT = { 1: 30, 2: 90, 3: 90 };
  window.ESC_GNAME = { 1: 'Bẫy trực giác', 2: 'Suy luận', 3: 'Cân · Bốc · Đếm cách' };
})();
