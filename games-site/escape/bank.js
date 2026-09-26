// BK Escape — ngân hàng câu hỏi Style 1 (nguồn: escape/NGAN-HANG-CAU-HOI.md, Thùy chốt 26/09).
// Mỗi câu = 1 "gốc" (id) có nhiều biến thể {q, a, w}: q = đề (dòng cuối là câu hỏi), a = đáp án 1 chữ số 0–9, w = giải thích (hiện ở màn xem lại cuối lượt).
// Câu cố định có 1 biến thể; câu KHUÔN sinh nhiều biến thể bằng máy (đổi số ⇒ đổi đáp án) → lấp đủ chữ số, chống lộ đề.
// g: 1 = bẫy trực giác (30s) · 2 = suy luận · 3 = cân/bốc/đếm cách (1p30).
// Bản 2 (26/09): viết lại lời cho RÕ (luật ghi tường minh, nói rõ đơn vị trả lời) + thêm giải thích — Thùy: "câu hỏi cần diễn giải rõ hơn".
(function () {
  const B = [];
  const add = (g, id, name, variants) => B.push({ g, id, name, v: variants.filter(x => Number.isInteger(x.a) && x.a >= 0 && x.a <= 9) });
  const one = (q, a, w) => [{ q, a, w }];
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const vnd = n => n.toLocaleString('vi-VN');
  const THU = { 2: 'thứ Hai', 3: 'thứ Ba', 4: 'thứ Tư', 5: 'thứ Năm', 6: 'thứ Sáu', 7: 'thứ Bảy' };

  // ================= NHÓM 1 — BẪY TRỰC GIÁC =================
  add(1, '1-01', 'Bút và vở', range(1, 9).map(x => ({
    q: `Một cây bút và một quyển vở giá tổng cộng ${vnd(10000 + 200 * x)}đ.\nQuyển vở đắt hơn cây bút ĐÚNG 10.000đ.\nHỏi: cây bút giá bao nhiêu TRĂM đồng? (vd 300đ → trả lời 3)`, a: x,
    w: `Bút = ${x}00đ thì vở = ${vnd(10000 + 100 * x)}đ, tổng ${vnd(10000 + 200 * x)}đ ✓. Bẫy: lấy ${vnd(10000 + 200 * x)} − 10.000 = ${vnd(200 * x)}đ — khi đó vở 10.000đ chỉ đắt hơn bút ${vnd(10000 - 200 * x)}đ, không phải 10.000đ.` })));
  add(1, '1-02', 'Máy làm hàng', range(2, 9).map(n => ({
    q: `${n} cái máy chạy cùng lúc làm ra ${n} sản phẩm hết ${n} phút (mỗi máy làm 1 sản phẩm, máy nào cũng nhanh như nhau).\nHỏi: 100 cái máy làm ra 100 sản phẩm hết bao nhiêu phút?`, a: n,
    w: `Mỗi máy mất ${n} phút để làm 1 sản phẩm. 100 máy chạy cùng lúc, mỗi máy làm 1 cái ⇒ vẫn ${n} phút. Bẫy: 100.` })));
  add(1, '1-03', 'Bèo phủ ao', range(2, 10).map(n => ({
    q: `Bèo trên mặt ao mỗi ngày lan rộng GẤP ĐÔI so với hôm trước.\nĐến ngày thứ ${n} thì bèo phủ kín cả ao.\nHỏi: bèo phủ được đúng NỬA ao vào ngày thứ mấy?`, a: n - 1,
    w: `Ngày ${n} kín ao, mà mỗi ngày gấp đôi ⇒ ngay hôm trước (ngày ${n - 1}) bèo mới phủ nửa ao. Bẫy: chia đôi số ngày.` })));
  add(1, '1-04', 'Mèo bắt chuột', range(2, 9).map(k => ({
    q: `${k} con mèo bắt được ${k} con chuột trong ${k} phút (các con mèo bắt cùng lúc, con nào cũng giỏi như nhau).\nHỏi: cần bao nhiêu con mèo để bắt được 100 con chuột trong 100 phút?`, a: k,
    w: `Mỗi con mèo cứ ${k} phút bắt 1 con chuột. Trong 100 phút, ${k} con mèo bắt được 100 con chuột ⇒ vẫn cần ${k} con. Bẫy: 100.` })));
  add(1, '1-05', 'Ngày trong tuần', range(2, 7).map(d => ({
    q: `Ngày A: từ hôm nay LÙI lại 70 ngày, rồi TIẾN thêm 7 ngày. Ngày A là ${THU[d]}.\nNgày B: từ hôm nay TIẾN thêm 70 ngày, rồi LÙI lại 7 ngày.\nHỏi: ngày B là thứ mấy? (thứ Hai → 2, …, thứ Bảy → 7)`, a: d,
    w: `A = hôm nay − 63 ngày, B = hôm nay + 63 ngày ⇒ A và B cách nhau 126 ngày = đúng 18 tuần ⇒ cùng là ${THU[d]}.` })));
  add(1, '1-06', 'Cái hố', [[2, 2, 2], [3, 2, 1], [2, 1, 3]].map(([s, r, d]) => ({
    q: `Một cái hố đã đào xong, sâu ${s}m, rộng ${r}m, dài ${d}m.\nHỏi: TRONG cái hố đó có bao nhiêu mét khối đất?`, a: 0,
    w: `Hố là chỗ đất đã bị đào đi ⇒ bên trong không còn đất: 0. Bẫy: nhân ra ${s * r * d}.` })));
  add(1, '1-10', 'Xếp hạng trong lớp', range(2, 5).map(k => ({
    q: `Bảng điểm cả lớp xếp từ cao xuống thấp (không ai bằng điểm ai).\nMinh đứng thứ ${k} nếu đếm từ TRÊN xuống, và cũng đứng thứ ${k} nếu đếm từ DƯỚI lên.\nHỏi: lớp có bao nhiêu học sinh?`, a: 2 * k - 1,
    w: `${k - 1} bạn trên Minh + Minh + ${k - 1} bạn dưới Minh = ${2 * k - 1}. Bẫy: ${k} + ${k} = ${2 * k} (đếm Minh 2 lần).` })));
  add(1, '1-11', 'Mua bán con heo', [60, 50, 40].map(p => ({
    q: `Một người mua con heo giá ${p} nghìn → bán được ${p + 10} nghìn → mua lại chính con đó giá ${p + 20} nghìn → bán lần nữa được ${p + 30} nghìn.\nHỏi: tính cả 2 lần, người đó LÃI bao nhiêu CHỤC nghìn? (vd 30 nghìn → trả lời 3)`, a: 2,
    w: `Chi ra ${p} + ${p + 20} = ${2 * p + 20} nghìn, thu về ${p + 10} + ${p + 30} = ${2 * p + 40} nghìn ⇒ lãi 20 nghìn = 2 chục. Bẫy: nghĩ mua lại đắt hơn là lỗ.` })));
  add(1, '1-12', 'Uống thuốc', [{ q: `Bác sĩ đưa 3 viên thuốc: uống viên thứ nhất NGAY BÂY GIỜ, sau đó cứ đúng 30 phút uống thêm 1 viên.\nHỏi: kể từ bây giờ, sau bao nhiêu GIỜ thì uống xong viên cuối cùng?`, a: 1, w: `Uống ở phút 0, phút 30, phút 60 ⇒ 60 phút = 1 giờ. Bẫy: 3 × 30 = 90 phút.` },
    ...range(3, 10).map(n => ({ q: `Bác sĩ đưa ${n} viên thuốc: uống viên thứ nhất NGAY BÂY GIỜ, sau đó cứ đúng 1 giờ uống thêm 1 viên.\nHỏi: kể từ bây giờ, sau bao nhiêu giờ thì uống xong viên cuối cùng?`, a: n - 1,
      w: `${n} viên có ${n - 1} khoảng cách 1 giờ (viên đầu uống ngay) ⇒ ${n - 1} giờ. Bẫy: ${n}.` }))]);
  add(1, '1-13', 'Cưa gỗ', [...[2, 4, 5].map(m => ({ q: `Cưa một khúc gỗ thành 3 khúc thì mất 4 phút (mọi nhát cưa lâu như nhau).\nHỏi: cưa một khúc gỗ y hệt thành ${m} khúc thì mất bao nhiêu phút?`, a: 2 * (m - 1),
      w: `3 khúc chỉ cần 2 nhát ⇒ 2 phút/nhát. ${m} khúc cần ${m - 1} nhát ⇒ ${2 * (m - 1)} phút. Bẫy: tính theo số khúc.` })),
    ...range(4, 10).map(m => ({ q: `Cưa một khúc gỗ thành 3 khúc thì mất 2 phút (mọi nhát cưa lâu như nhau).\nHỏi: cưa một khúc gỗ y hệt thành ${m} khúc thì mất bao nhiêu phút?`, a: m - 1,
      w: `3 khúc chỉ cần 2 nhát ⇒ 1 phút/nhát. ${m} khúc cần ${m - 1} nhát ⇒ ${m - 1} phút. Bẫy: tính theo số khúc.` }))]);
  add(1, '1-14', 'Leo cầu thang', range(2, 10).filter(k => k !== 3).map(k => ({
    q: `Đi bộ từ tầng 1 lên tầng 3 mất 2 phút (đoạn cầu thang giữa 2 tầng nào cũng dài như nhau).\nHỏi: đi từ tầng 1 lên tầng ${k} (cùng tốc độ) mất bao nhiêu phút?`, a: k - 1,
    w: `Tầng 1 → 3 chỉ có 2 đoạn cầu thang ⇒ 1 phút/đoạn. Tầng 1 → ${k} có ${k - 1} đoạn ⇒ ${k - 1} phút. Bẫy: tính theo số tầng.` })));
  add(1, '1-15', 'Đồng hồ đánh chuông', range(2, 10).filter(m => m !== 6).map(m => ({
    q: `Đồng hồ đánh 6 tiếng chuông: tính từ tiếng ĐẦU đến tiếng CUỐI hết 5 giây (các tiếng cách đều nhau).\nHỏi: nếu đánh ${m} tiếng thì từ tiếng đầu đến tiếng cuối hết bao nhiêu giây?`, a: m - 1,
    w: `6 tiếng có 5 khoảng lặng ⇒ 1 giây/khoảng. ${m} tiếng có ${m - 1} khoảng ⇒ ${m - 1} giây. Bẫy: chia theo số tiếng.` })));
  add(1, '1-16', 'Đào hố', one(`2 người cùng làm thì đào được 2 cái hố trong 2 giờ (mỗi người đào 1 hố, ai cũng nhanh như nhau).\nHỏi: 1 người đào NỬA cái hố mất bao nhiêu giờ?`, 1,
    `Mỗi người đào 1 hố mất 2 giờ ⇒ nửa hố mất 1 giờ. Bẫy: 0,5.`));
  add(1, '1-17', 'Đi câu cá', one(`Hai người cha và hai người con cùng đi câu. Mỗi người câu được ĐÚNG 1 con cá.\nVề nhà đếm lại chỉ có 3 con cá, không ai làm mất con nào.\nHỏi: có bao nhiêu người đi câu?`, 3,
    `Ông – bố – cháu: người bố vừa là "cha" (của cháu) vừa là "con" (của ông) ⇒ 2 cha + 2 con nhưng chỉ 3 người.`));
  add(1, '1-18', 'Mèo trong phòng', one(`Căn phòng hình vuông có 4 góc, mỗi góc có 1 con mèo ngồi.\nMỗi con mèo nhìn ra đều thấy trước mặt có 3 con mèo.\nHỏi: trong phòng có tất cả bao nhiêu con mèo?`, 4,
    `Mỗi con nhìn thấy chính 3 con ở 3 góc còn lại ⇒ chỉ có 4 con. Bẫy: 4 + 4 × 3.`));
  add(1, '1-19', 'Hai đồng xu', one(`Tôi có 2 đồng xu, tổng cộng 6.000đ.\nTôi nói: "Một trong hai đồng này KHÔNG PHẢI là đồng 5.000đ."\nHỏi: đồng xu mà tôi nói (đồng KHÔNG phải 5.000đ) là đồng mấy NGHÌN?`, 1,
    `Hai đồng là 5.000đ + 1.000đ. Câu nói chỉ bảo MỘT đồng không phải 5.000đ — đó là đồng 1.000đ; đồng còn lại vẫn là 5.000đ.`));
  add(1, '1-21', 'Quả trứng', range(5, 9).flatMap(n => range(1, 3).map(k => ({
    q: `Tôi có ${n} quả trứng. Tôi đập vỡ ${k} quả, đem rán ${k} quả, rồi ăn ${k} quả.\nHỏi: tôi còn bao nhiêu quả trứng?`, a: n - k,
    w: `Muốn rán thì phải đập vỡ; quả đã rán chính là quả đem ăn ⇒ chỉ ${k} quả được dùng ⇒ còn ${n - k}. Bẫy: ${n} − ${3 * k}.` }))));

  // ================= NHÓM 2 — SUY LUẬN =================
  add(2, '2-01', 'Tuổi 3 cô con gái', one(`Một người mẹ có 3 đứa con (tuổi là số nguyên). Người điều tra dân số hỏi tuổi 3 đứa.\n① Mẹ: "Nhân tuổi 3 đứa lại được 36." — Người điều tra: "Chưa đủ để tôi biết."\n② Mẹ: "Cộng tuổi 3 đứa bằng đúng số nhà bên kia đường." — Anh nhìn số nhà: "Vẫn chưa đủ."\n③ Mẹ: "Đứa LỚN NHẤT đang học piano." — "À, giờ tôi biết rồi!"\nHỏi: đứa lớn nhất bao nhiêu tuổi?`, 9,
    `Các bộ tuổi có tích 36: 1-1-36 (tổng 38), 1-2-18 (21), 1-3-12 (16), 1-4-9 (14), 1-6-6 (13), 2-2-9 (13), 2-3-6 (11), 3-3-4 (10). Nhìn số nhà vẫn chưa biết ⇒ số nhà là 13 (2 bộ trùng tổng). "Đứa lớn nhất" (chỉ 1 đứa) ⇒ loại 1-6-6 ⇒ 2-2-9.`));
  add(2, '2-02', 'Anh em trai – chị em gái', one(`Trong một gia đình:\n• Mỗi cậu con trai có số anh em trai (không tính mình) BẰNG số chị em gái.\n• Mỗi cô con gái có số anh em trai GẤP ĐÔI số chị em gái (không tính mình).\nHỏi: gia đình có tất cả bao nhiêu người con?`, 7,
    `Gọi t con trai, g con gái. Con trai: t − 1 = g. Con gái: t = 2(g − 1). ⇒ t = 4, g = 3 ⇒ 7 người con.`));
  add(2, '2-03', 'Sư Tử & Kỳ Lân', one(`Sư Tử nói dối vào thứ Hai, thứ Ba, thứ Tư; các ngày khác luôn nói thật.\nKỳ Lân nói dối vào thứ Năm, thứ Sáu, thứ Bảy; các ngày khác luôn nói thật.\nHôm nay, cả hai con đều nói: "Hôm qua là ngày tôi nói dối."\nHỏi: hôm nay là thứ mấy? (thứ Hai → 2, …, thứ Bảy → 7)`, 5,
    `Sư Tử chỉ nói được câu đó vào thứ Hai (hôm nay nói dối, hôm qua CN nói thật) hoặc thứ Năm (nói thật, hôm qua thứ Tư nói dối). Kỳ Lân: Chủ nhật hoặc thứ Năm. Ngày chung: thứ Năm.`));
  add(2, '2-04', 'Người thật – người dối (3 người)', one(`Trên đảo, mỗi người hoặc LUÔN nói thật, hoặc LUÔN nói dối.\nA nói: "B là người nói dối."\nB nói: "C là người nói dối."\nC nói: "A và B đều là người nói dối."\nHỏi: trong 3 người, có bao nhiêu người nói thật?`, 1,
    `Nếu C nói thật ⇒ A, B đều dối ⇒ nhưng A dối nghĩa là B nói thật: mâu thuẫn. Vậy C dối ⇒ B nói đúng (B nói thật) ⇒ A nói "B dối" là sai ⇒ A dối. Chỉ B nói thật.`));
  add(2, '2-05', 'Hiệp sĩ & kẻ dối (2 người)', one(`Trên đảo có 2 loại người: HIỆP SĨ luôn nói thật, KẺ DỐI luôn nói dối.\nA nói: "Ít nhất một trong hai điều này là đúng: tôi là kẻ dối, hoặc B là hiệp sĩ."\nHỏi: trong A và B có bao nhiêu hiệp sĩ?`, 2,
    `Nếu A là kẻ dối thì vế "tôi là kẻ dối" đúng ⇒ câu A nói thành đúng ⇒ kẻ dối nói thật: vô lý. Vậy A là hiệp sĩ ⇒ câu đúng; vế đầu sai nên vế sau phải đúng ⇒ B là hiệp sĩ ⇒ 2.`));
  add(2, '2-06', 'Cùng một câu nói', range(3, 5).map(n => ({
    q: `${n} người, mỗi người hoặc LUÔN nói thật, hoặc LUÔN nói dối.\nCả ${n} người cùng nói y hệt một câu: "Trong ${n} chúng tôi có ĐÚNG 1 người nói thật."\nHỏi: có bao nhiêu người nói thật?`, a: 0,
    w: `Cùng một câu ⇒ nếu câu đúng thì cả ${n} người đều nói thật — trái với "đúng 1 người". Vậy câu sai ⇒ tất cả đều nói dối ⇒ 0 người nói thật (và "đúng 1" đúng là sai ✓).` })));
  { // 2-07 Ai lấy bánh: người nói thật là người "tôi không lấy" thứ nhất; thủ phạm là người "tôi không lấy" thứ hai
    const N = ['An', 'Bình', 'Chi'], seat = { An: 1, 'Bình': 2, Chi: 3 }, v = [];
    for (const p of [[0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 2, 1], [1, 0, 2], [2, 1, 0]]) {
      const [x, y, z] = p.map(i => N[i]);
      v.push({ q: `3 bạn ngồi: ghế số 1 là An, ghế số 2 là Bình, ghế số 3 là Chi.\nBiết: chỉ ĐÚNG 1 bạn lấy bánh, và chỉ ĐÚNG 1 bạn nói thật (2 bạn kia nói dối).\n${x}: "${y} lấy bánh."\n${y}: "Tôi không lấy."\n${z}: "Tôi không lấy."\nHỏi: bạn ngồi ghế số mấy đã lấy bánh?`, a: seat[z],
        w: `Thử cho từng bạn nói thật: nếu ${x} thật ⇒ ${y} lấy, nhưng ${z} dối ⇒ ${z} cũng lấy: 2 người, sai. Nếu ${z} thật ⇒ ${x} dối (${y} không lấy) nhưng ${y} dối (${y} có lấy): mâu thuẫn. Chỉ còn ${y} nói thật ⇒ ${z} nói dối ⇒ ${z} lấy ⇒ ghế ${seat[z]}.` });
    }
    add(2, '2-07', 'Ai lấy bánh', v);
  }
  { // 2-08 3 hộp nhãn sai: đáp án = số của hộp dán "Táo + Cam"
    const L = ['"Táo"', '"Cam"', '"Táo + Cam"'], v = [];
    for (const p of [[0, 1, 2], [2, 0, 1], [1, 2, 0]]) v.push({
      q: `Có 3 hộp số 1, 2, 3, dán nhãn lần lượt là ${p.map(i => L[i]).join(', ')}.\nThật ra: 1 hộp chỉ có táo, 1 hộp chỉ có cam, 1 hộp có cả táo lẫn cam — nhưng CẢ 3 NHÃN ĐỀU DÁN SAI.\nBạn được thò tay vào 1 hộp (không nhìn), lấy ra 1 quả để xem, rồi phải nói đúng cả 3 hộp chứa gì.\nHỏi: phải lấy từ hộp số mấy?`, a: p.indexOf(2) + 1,
      w: `Hộp dán "Táo + Cam" chắc chắn KHÔNG trộn ⇒ chỉ có 1 loại ⇒ rút 1 quả là biết cả hộp. Hai hộp còn lại suy ra nhờ "nhãn nào cũng sai". Hộp đó là số ${p.indexOf(2) + 1}.` });
    add(2, '2-08', '3 hộp dán nhãn sai', v);
  }
  add(2, '2-09', '3 công tắc – 3 bóng đèn', one(`Ngoài hành lang có 3 công tắc. Trong 1 phòng đóng kín có 3 bóng đèn sợi đốt kiểu cũ; mỗi công tắc bật đúng 1 bóng.\nĐứng ngoài không nhìn được vào phòng. Bạn được bật / tắt công tắc tuỳ ý, bao lâu cũng được.\nHỏi: ít nhất phải vào phòng mấy lần để biết chắc công tắc nào bật bóng nào?`, 1,
    `Bật công tắc 1 thật lâu rồi tắt, bật công tắc 2, vào phòng 1 lần: bóng đang sáng = công tắc 2; bóng tắt nhưng còn NÓNG = công tắc 1; bóng tắt và nguội = công tắc 3.`));
  add(2, '2-10', '4 lá bài', one(`4 lá bài trên bàn. Mỗi lá: một mặt in CHỮ CÁI, mặt kia in SỐ. Mặt đang ngửa lên: A · K · 4 · 7\nLuật cần kiểm tra: "Lá nào có mặt chữ là NGUYÊN ÂM thì mặt số của nó phải là SỐ CHẴN."\nHỏi: ít nhất phải lật mấy lá để biết chắc luật có bị phá hay không?`, 2,
    `Lật A (mặt kia phải chẵn) và 7 (mặt kia mà là nguyên âm thì luật sai). K không liên quan; 4 mặt kia là gì cũng không phá luật ⇒ 2 lá. Bẫy: lật A và 4.`));
  add(2, '2-11', 'Bóng đèn bật tắt', range(10, 99).filter((_, i) => i % 3 === 0).map(n => {
    const sq = range(1, 9).filter(i => i * i <= n).map(i => i * i);
    return { q: `Có ${n} bóng đèn đánh số 1 → ${n}, lúc đầu TẮT hết. Có ${n} người lần lượt đi qua:\n• Người 1 bấm công tắc tất cả các bóng.\n• Người 2 bấm các bóng số 2, 4, 6, 8…\n• Người 3 bấm các bóng số 3, 6, 9, 12…\n• Cứ thế: người thứ k bấm các bóng có số chia hết cho k. (Bấm = đang tắt thì bật, đang bật thì tắt.)\nHỏi: sau khi cả ${n} người đi qua, có bao nhiêu bóng đang SÁNG?`, a: sq.length,
      w: `Bóng số m bị bấm đúng bằng số ước của m. Ước đi theo cặp (vd 12 = 1×12 = 2×6 = 3×4) nên thường chẵn ⇒ bóng tắt; chỉ số chính phương (4 = 2×2…) có số ước lẻ ⇒ sáng: ${sq.join(', ')} ⇒ ${sq.length} bóng.` };
  }));
  add(2, '2-12', 'Tháp Hà Nội', one(`Có 3 cọc. Cọc trái có 3 cái đĩa to nhỏ khác nhau xếp chồng (to ở dưới, nhỏ ở trên).\nPhải chuyển cả chồng sang cọc phải. Luật: mỗi lần chỉ chuyển 1 đĩa trên cùng; đĩa to KHÔNG được đặt lên đĩa nhỏ; được dùng cọc giữa.\nHỏi: ít nhất bao nhiêu lần chuyển?`, 7,
    `Chuyển 2 đĩa nhỏ sang cọc giữa (3 lần) → đĩa to sang cọc phải (1 lần) → 2 đĩa nhỏ từ giữa sang phải (3 lần) ⇒ 7.`));
  add(2, '2-13', 'Sói – Dê – Bắp cải', one(`Người lái đò phải chở 1 con sói, 1 con dê và 1 cây bắp cải qua sông.\nThuyền chỉ chở được người + 1 thứ. Nếu vắng người: sói sẽ ăn dê, dê sẽ ăn bắp cải (sói không ăn bắp cải).\nMỗi lần thuyền đi từ bờ này sang bờ kia tính 1 lượt.\nHỏi: ít nhất bao nhiêu lượt để cả 3 thứ sang bờ bên kia an toàn?`, 7,
    `① Chở dê sang ② về không ③ chở sói sang ④ chở DÊ về ⑤ chở bắp cải sang ⑥ về không ⑦ chở dê sang ⇒ 7 lượt.`));
  { // 2-14 Josephus
    const run = n => { const a = range(1, n), out = []; let i = 0; while (a.length > 1) { const k = (i + 1) % a.length; out.push(a[k]); a.splice(k, 1); i = k % a.length } return { last: a[0], out } };
    add(2, '2-14', 'Vòng tròn Josephus', range(4, 10).map(n => { const r = run(n); return {
      q: `${n} người đánh số 1 → ${n} đứng thành vòng tròn theo thứ tự. Người số 1 cầm thanh kiếm.\nLuật: người cầm kiếm loại người đứng NGAY SAU mình (người đó rời vòng), rồi đưa kiếm cho người kế tiếp còn trong vòng.\nVd: 1 loại 2, đưa kiếm cho 3; 3 loại 4, đưa cho 5; … đi hết vòng thì quay lại.\nHỏi: người số mấy còn lại cuối cùng?`, a: r.last,
      w: `Thứ tự bị loại: ${r.out.join(' → ')} ⇒ còn lại người số ${r.last}.` } }));
  }
  add(2, '2-15', 'Đấu loại trực tiếp', range(5, 10).map(n => ({
    q: `${n} kỳ thủ thi đấu LOẠI TRỰC TIẾP: mỗi trận 2 người, người thua bị loại ngay, không có hoà. Vòng nào số người lẻ thì 1 người được đi thẳng vào vòng sau.\nHỏi: tổng cộng phải đấu bao nhiêu trận để có nhà vô địch?`, a: n - 1,
    w: `Mỗi trận loại đúng 1 người. Muốn còn 1 nhà vô địch phải loại ${n - 1} người ⇒ ${n - 1} trận (không cần vẽ nhánh đấu).` })));
  { // 2-16 Nim: đếm tới N, mỗi lượt 1..k số; người đi trước dừng ở N mod (k+1)
    const v = [];
    for (const k of [2, 3, 4, 5]) for (const N of range(10, 30)) { const a = N % (k + 1); if (a > 0 && a <= 9) {
      const keys = []; for (let x = a; x <= N; x += k + 1) keys.push(x);
      v.push({ q: `Trò chơi 2 người: lần lượt đọc các số 1, 2, 3, … Mỗi lượt được đọc tiếp từ 1 đến ${k} số liền nhau (vd: người đầu đọc "1, 2", người sau đọc tiếp "3" hoặc "3, 4"…).\nAi đọc được số ${N} là THẮNG. Bạn đi trước.\nHỏi: ở lượt đầu tiên bạn phải dừng ở số mấy thì CHẮC CHẮN thắng, dù đối thủ chơi thế nào?`, a,
        w: `Mỗi vòng (bạn + đối thủ) bạn luôn bù được cho đủ ${k + 1} số. Nên các "số chốt" cách nhau ${k + 1}, đếm ngược từ ${N}: ${keys.join(', ')}. Dừng ở ${a} rồi mỗi lượt sau nhảy tới số chốt kế tiếp.` }) } }
    add(2, '2-16', 'Trò đếm (Nim)', v);
  }
  { const TR = ['1:05', '2:11', '3:16', '4:22', '5:27', '6:33', '7:38', '8:44', '9:49'];
    add(2, '2-17', 'Kim đồng hồ trùng nhau', range(2, 10).map(h => { const a = Math.ceil(11 * h / 12) - 1; return {
      q: `Xét đồng hồ kim, tính từ SAU 12 giờ trưa đến TRƯỚC ${h} giờ chiều (không tính đúng 2 thời điểm đó).\nHỏi: trong khoảng này, kim giờ và kim phút nằm chồng khít lên nhau bao nhiêu lần?`, a,
      w: `Kim phút đuổi kịp kim giờ khoảng mỗi 1 giờ 5 phút 27 giây: ~${TR.slice(0, a).join(', ')} ⇒ ${a} lần. Bẫy: nghĩ mỗi giờ trùng 1 lần.` } })); }
  add(2, '2-18', 'Sinh nhật Cheryl', one(`Cheryl cho Albert và Bernard 10 ngày có thể là sinh nhật mình:\n15/5 · 16/5 · 19/5 · 17/6 · 18/6 · 14/7 · 16/7 · 14/8 · 15/8 · 17/8\nCheryl nói riêng THÁNG cho Albert, nói riêng NGÀY cho Bernard.\nAlbert: "Tôi không biết sinh nhật, nhưng tôi chắc chắn Bernard cũng không biết."\nBernard: "Lúc đầu tôi không biết, nhưng giờ thì tôi biết rồi."\nAlbert: "Vậy thì giờ tôi cũng biết."\nHỏi: sinh nhật Cheryl vào tháng mấy?`, 7,
    `Ngày 18 và 19 chỉ xuất hiện 1 lần; Albert chắc Bernard không biết ⇒ tháng của Albert không chứa 18/19 ⇒ không phải tháng 5, 6. Còn 14/7, 16/7, 14/8, 15/8, 17/8. Bernard giờ biết ⇒ ngày không phải 14 ⇒ còn 16/7, 15/8, 17/8. Albert cũng biết ⇒ tháng đó chỉ còn 1 ngày ⇒ 16/7.`));
  add(2, '2-19', 'Qua sông (Kordemsky)', one(`Ba người cần qua sông: bố nặng 80kg, hai con mỗi đứa 40kg.\nChỉ có 1 chiếc thuyền chở tối đa 80kg, và phải có người ngồi chèo (thuyền không tự đi).\nMỗi lần thuyền đi từ bờ này sang bờ kia tính 1 chuyến.\nHỏi: ít nhất bao nhiêu chuyến để cả 3 người sang được bờ bên kia?`, 5,
    `① 2 con sang ② 1 con chèo về ③ bố sang ④ con bên kia chèo về ⑤ 2 con sang ⇒ 5 chuyến.`));
  { // 2-20 Bình nước: BFS số bước ít nhất + in lời giải
    const solve = (A, Bc, T) => { const key = s => s + '', prev = new Map([['0,0', null]]); let fr = [[0, 0]];
      while (fr.length) { const nx = [];
        for (const [x, y] of fr) { if (x === T || y === T) { const path = []; let k = key([x, y]); while (prev.get(k)) { const [pk, act] = prev.get(k); path.unshift(act); k = pk } return path }
          const p = Math.min(x, Bc - y), r = Math.min(y, A - x);
          for (const [s, act] of [[[A, y], `đổ đầy bình ${A}L`], [[x, Bc], `đổ đầy bình ${Bc}L`], [[0, y], `đổ bỏ bình ${A}L`], [[x, 0], `đổ bỏ bình ${Bc}L`], [[x - p, y + p], `rót ${A}L → ${Bc}L`], [[x + r, y - r], `rót ${Bc}L → ${A}L`]]) {
            const k = key(s); if (!prev.has(k)) { prev.set(k, [key([x, y]), `${act} (${s[0]}·${s[1]})`]); nx.push(s) } } }
        fr = nx } return null };
    const v = [];
    for (const [A, Bc, T] of [[3, 5, 4], [3, 5, 1], [4, 7, 5], [4, 9, 6], [2, 7, 3], [3, 7, 5], [5, 8, 2], [3, 4, 2], [4, 7, 2]]) { const p = solve(A, Bc, T); if (p && p.length >= 2 && p.length <= 9) v.push({
      q: `Có 2 bình rỗng loại ${A} lít và ${Bc} lít (không có vạch chia), nước lấy từ vòi thoải mái.\nMỗi lần làm 1 trong 3 việc sau tính là 1 bước: ĐỔ ĐẦY 1 bình từ vòi · ĐỔ BỎ hết nước 1 bình · RÓT từ bình này sang bình kia (đến khi bình kia đầy hoặc bình này hết).\nHỏi: ít nhất bao nhiêu bước để trong 1 bình có đúng ${T} lít?`, a: p.length,
      w: `${p.map((s, i) => `${i + 1}) ${s}`).join(' ')} ⇒ ${p.length} bước. (số trong ngoặc = lượng nước bình ${A}L · bình ${Bc}L)` }) }
    add(2, '2-20', 'Hai bình nước', v);
  }
  { const v = []; for (const [a, b, c] of [[1, 2, 5], [1, 2, 4], [1, 2, 3], [1, 3, 4], [1, 3, 5], [1, 2, 6]]) v.push({
      q: `Trời tối, 3 người cần qua 1 cây cầu hẹp. Đi một mình, họ mất lần lượt ${a}, ${b}, ${c} phút.\nLuật: cầu chịu tối đa 2 người một lúc; chỉ có 1 cái đèn pin, ai đi trên cầu cũng phải có đèn (không ném đèn qua được); 2 người đi cùng thì đi theo tốc độ người chậm hơn.\nHỏi: ít nhất bao nhiêu phút để cả 3 người qua cầu?`, a: a + b + c,
      w: `Người nhanh nhất (${a} phút) làm "người cầm đèn": đi cùng người ${c} phút (${c}) → cầm đèn quay về (${a}) → đi cùng người ${b} phút (${b}) ⇒ ${c} + ${a} + ${b} = ${a + b + c} phút.` });
    add(2, '2-21', 'Cầu và đèn pin', v); }
  { const E = `4 ngôi nhà đánh số 1 → 4 xếp thành hàng từ trái sang phải. Mỗi nhà sơn 1 màu khác nhau (Đỏ, Xanh, Vàng, Trắng) và nuôi 1 con vật khác nhau (Mèo, Chó, Cá, Chim).\n① Nhà Đỏ nằm NGAY bên trái nhà Xanh.\n② Nhà Vàng không nằm sát cạnh nhà Đỏ.\n③ Nhà Trắng ở một trong hai đầu hàng.\n④ Nhà Vàng nuôi Cá, và nhà nuôi Cá ở một trong hai đầu hàng.\n⑤ Nhà số 1 nuôi Chim.\n⑥ Con Chó sống ở nhà Xanh.\n`,
      W = `Đỏ–Xanh đứng liền nhau; Vàng và Trắng đều ở đầu hàng ⇒ Vàng, Trắng chiếm 2 đầu, Đỏ–Xanh ở giữa (nhà 2–3). Nhà 1 nuôi Chim nên không phải Vàng (Vàng nuôi Cá) ⇒ 1 Trắng-Chim, 2 Đỏ, 3 Xanh-Chó, 4 Vàng-Cá ⇒ Mèo ở nhà 2. (Vàng ở nhà 4 không cạnh Đỏ ✓)`;
    add(2, '2-22', 'Câu đố Einstein thu nhỏ', [{ q: E + 'Hỏi: con MÈO ở nhà số mấy?', a: 2, w: W }, { q: E + 'Hỏi: con CHÓ ở nhà số mấy?', a: 3, w: W }, { q: E + 'Hỏi: con CÁ ở nhà số mấy?', a: 4, w: W }]); }
  { const Q = `Điền các số 1, 2, 3, …, 9 vào lưới 3×3 (mỗi số đúng 1 lần) sao cho MỌI hàng ngang, MỌI cột dọc và CẢ 2 đường chéo đều có tổng bằng 15.\n`;
    add(2, '2-24', 'Ma phương Lạc Thư', [{ q: Q + 'Hỏi: ô CHÍNH GIỮA là số mấy?', a: 5, w: `Cộng hàng giữa + cột giữa + 2 đường chéo = 4 × 15 = 60; tổng này chứa cả 9 số (= 45) cộng thêm ô giữa 3 lần nữa ⇒ 45 + 3 × giữa = 60 ⇒ giữa = 5.` },
      ...[1, 2, 3, 4, 6, 7, 8, 9].map(x => ({ q: Q + `Một ô (không phải ô chính giữa) đang là số ${x}.\nHỏi: ô ĐỐI XỨNG với ô đó qua ô chính giữa là số mấy?`, a: 10 - x,
        w: `Ô giữa luôn là 5. Ô đó, ô giữa và ô đối xứng nằm trên cùng 1 đường thẳng có tổng 15 ⇒ ô đối xứng = 15 − 5 − ${x} = ${10 - x}.` }))]); }

  // ================= NHÓM 3 — CÂN · BỐC · ĐẾM CÁCH =================
  add(3, '3-01', 'Tìm viên bi nặng', [[8, 2], [9, 2], [6, 2], [20, 3], [27, 3], [15, 3], [50, 4], [81, 4]].map(([n, a]) => ({
    q: `${n} viên bi trông giống hệt nhau, trong đó có đúng 1 viên NẶNG HƠN các viên còn lại.\nCó 1 cái cân hai đĩa (chỉ cho biết bên nào nặng hơn, hoặc bằng nhau), không có quả cân.\nHỏi: ít nhất phải cân mấy lần để CHẮC CHẮN tìm ra viên nặng (kể cả khi xui nhất)?`, a,
    w: `Mỗi lần cân chia bi thành 3 nhóm (2 nhóm lên 2 đĩa, 1 nhóm để ngoài) ⇒ biết viên nặng ở nhóm nào ⇒ còn 1/3. Cân ${a} lần phân biệt được tối đa 3^${a} = ${3 ** a} viên ≥ ${n}; cân ${a - 1} lần chỉ được ${3 ** (a - 1)} < ${n}.` })));
  add(3, '3-02', '12 viên bi lệch', one(`12 viên bi trông giống hệt nhau, có đúng 1 viên LỆCH cân — nhưng không biết nó nặng hơn hay nhẹ hơn.\nCó 1 cân hai đĩa (không có quả cân).\nHỏi: ít nhất phải cân mấy lần để chắc chắn tìm ra viên lệch?`, 3,
    `Chia 4 – 4 – 4, cân 2 nhóm 4. Mỗi lần cân có 3 kết quả (trái nặng / phải nặng / bằng) ⇒ 3 lần cho 27 khả năng ≥ 24 khả năng (12 viên × nặng/nhẹ); 2 lần chỉ 9 < 24.`));
  add(3, '3-03', 'Rượu độc', [8, 16, 30, 60, 100, 200, 500].map(n => { const a = Math.ceil(Math.log2(n)); return {
    q: `Có ${n} chai rượu giống nhau, đúng 1 chai bị bỏ độc. Chuột uống phải dù chỉ 1 giọt độc sẽ chết sau đúng 1 giờ.\nBạn chỉ còn đúng 1 giờ ⇒ chỉ kịp cho chuột uống thử 1 đợt; mỗi con chuột được uống thử nhiều chai khác nhau.\nHỏi: cần ít nhất bao nhiêu con chuột để biết chắc chai nào có độc?`, a,
    w: `Mỗi con chuột cho 2 kết quả (sống / chết) ⇒ ${a} con cho 2^${a} = ${2 ** a} tổ hợp ≥ ${n} chai (${a - 1} con chỉ ${2 ** (a - 1)}). Cách làm: đánh số chai theo hệ nhị phân, chuột thứ i uống các chai có chữ số thứ i là 1; nhìn con nào chết là đọc ra số chai.` } }));
  add(3, '3-04', 'Găng tay trong bóng tối', range(1, 4).map(k => ({
    q: `Tủ tối om có ${k} đôi găng tay đen và ${k} đôi găng tay trắng để lẫn lộn. Mỗi đôi gồm 1 chiếc tay TRÁI và 1 chiếc tay PHẢI.\nHỏi: bốc ít nhất bao nhiêu chiếc để CHẮC CHẮN có 1 đôi đeo được (1 trái + 1 phải, cùng màu)?`, a: 2 * k + 1,
    w: `Xui nhất: bốc toàn găng tay trái (${2 * k} chiếc, đủ cả đen lẫn trắng) mà chưa có đôi. Chiếc thứ ${2 * k + 1} chắc chắn là tay phải và khớp màu với 1 chiếc đã có.` })));
  { const C3 = `Một khối lập phương to cỡ 3×3×3 được sơn kín cả 6 mặt bên ngoài, rồi cắt thành 27 khối lập phương nhỏ bằng nhau.\n`;
    add(3, '3-05', 'Khối lập phương sơn', [
      { q: C3 + 'Hỏi: có bao nhiêu khối nhỏ có ĐÚNG 3 mặt dính sơn?', a: 8, w: `Chỉ khối ở góc mới lộ ra 3 mặt; khối lập phương có 8 góc ⇒ 8.` },
      { q: C3 + 'Hỏi: có bao nhiêu khối nhỏ có ĐÚNG 1 mặt dính sơn?', a: 6, w: `Khối nằm chính giữa mỗi mặt to chỉ lộ 1 mặt; có 6 mặt to ⇒ 6.` },
      { q: C3 + 'Hỏi: có bao nhiêu khối nhỏ KHÔNG dính sơn mặt nào?', a: 1, w: `Chỉ khối nằm tận trong lõi (chính giữa khối to) là không lộ ra ngoài ⇒ 1.` },
      { q: C3 + 'Hỏi: có bao nhiêu khối nhỏ có ĐÚNG 4 mặt dính sơn?', a: 0, w: `Khối nhỏ lộ nhiều mặt nhất là khối góc — chỉ 3 mặt ⇒ không khối nào có 4 mặt sơn: 0.` },
      { q: `Một khối lập phương to cỡ 4×4×4 được sơn kín cả 6 mặt bên ngoài, rồi cắt thành 64 khối lập phương nhỏ bằng nhau.\nHỏi: có bao nhiêu khối nhỏ KHÔNG dính sơn mặt nào?`, a: 8, w: `Bóc 1 lớp ngoài cùng ⇒ lõi còn lại cỡ 2×2×2 = 8 khối.` }]); }
  { const v = [];
    for (const [H, u, d] of [[10, 3, 2], [11, 3, 2], [12, 4, 2], [9, 3, 1], [20, 5, 3], [15, 4, 2], [10, 4, 3], [7, 3, 2], [13, 5, 3]]) { const a = Math.ceil((H - u) / (u - d)) + 1; if (a <= 9) v.push({
      q: `Con ốc sên ở đáy 1 cái giếng sâu ${H}m. Mỗi ngày: ban ngày leo lên được ${u}m, ban đêm ngủ bị tụt xuống ${d}m.\nHễ leo tới miệng giếng là ốc ra ngoài ngay (không bị tụt nữa).\nHỏi: ốc ra khỏi giếng vào ngày thứ mấy?`, a,
      w: `Mỗi ngày đêm lên thêm ${u - d}m. Sáng ngày thứ ${a}, ốc đang ở ${(a - 1) * (u - d)}m, leo thêm ${u}m là tới ${(a - 1) * (u - d) + u}m ≥ ${H}m ⇒ ra ngay, không bị tụt. Bẫy: ${H} ÷ ${u - d}.` }) }
    add(3, '3-06', 'Ốc sên dưới giếng', v); }
  add(3, '3-07', 'Tất trong bóng tối', range(2, 8).map(k => ({
    q: `Ngăn kéo tối om có rất nhiều chiếc tất rời, gồm ${k} màu khác nhau (màu nào cũng có nhiều chiếc). Bạn bốc mà không nhìn thấy màu.\nHỏi: bốc ít nhất bao nhiêu chiếc để CHẮC CHẮN có 2 chiếc cùng màu?`, a: k + 1,
    w: `Xui nhất: ${k} chiếc đầu mỗi chiếc một màu. Chiếc thứ ${k + 1} chắc chắn trùng màu với 1 chiếc đã có (nguyên lý Dirichlet).` })));
  add(3, '3-09', 'Bốc bi nhiều màu', [[3, 3], [2, 3], [2, 4], [4, 3], [2, 5], [3, 2]].map(([k, m]) => ({
    q: `Hộp có bi ${k} màu, mỗi màu 10 viên. Bịt mắt bốc bi.\nHỏi: bốc ít nhất bao nhiêu viên để CHẮC CHẮN có ${m} viên cùng màu?`, a: k * (m - 1) + 1,
    w: `Xui nhất: mỗi màu bốc được ${m - 1} viên mà chưa màu nào đủ ${m} ⇒ ${k} × ${m - 1} = ${k * (m - 1)} viên. Viên tiếp theo chắc chắn làm 1 màu đủ ${m} ⇒ ${k * (m - 1) + 1}.` })));
  add(3, '3-10', '25 con ngựa', one(`Có 25 con ngựa và 1 đường đua chỉ có 5 làn. Không có đồng hồ: mỗi lượt đua (tối đa 5 con) chỉ biết thứ tự về đích của các con trong lượt đó. Ngựa lần nào chạy cũng nhanh như nhau.\nHỏi: ít nhất bao nhiêu lượt đua để tìm ra 3 con nhanh nhất?`, 7,
    `5 lượt: chia 5 bảng, mỗi bảng 5 con. Lượt 6: đua 5 con về nhất bảng ⇒ con thắng là nhanh nhất. Lượt 7: chỉ 5 con còn có thể vào top 3 (nhì, ba bảng của con nhất; nhất, nhì bảng của con về nhì; nhất bảng của con về ba) ⇒ lấy nhất, nhì ⇒ 7 lượt.`));
  add(3, '3-11', 'Chồng xu giả', one(`Có 10 chồng xu, mỗi chồng 10 đồng. 9 chồng là xu thật (mỗi đồng nặng 10 gam), 1 chồng toàn xu giả (mỗi đồng nặng 11 gam). Nhìn không phân biệt được.\nCó 1 cân điện tử hiện chính xác số gam.\nHỏi: ít nhất phải cân mấy lần để biết chồng nào là xu giả?`, 1,
    `Lấy 1 đồng từ chồng 1, 2 đồng từ chồng 2, …, 10 đồng từ chồng 10 (55 đồng), cân 1 lần. Nếu toàn thật sẽ nặng 550g; nặng dư bao nhiêu gam thì chồng số đó là giả.`));
  add(3, '3-13', 'Cắt khối gỗ', [
    { q: `Khối gỗ lập phương cỡ 3×3×3 cần cắt thành 27 khối nhỏ bằng nhau bằng các nhát cưa thẳng.\nSau mỗi nhát, bạn được sắp xếp / xếp chồng các mảnh tuỳ ý rồi mới cưa nhát tiếp.\nHỏi: ít nhất bao nhiêu nhát cưa?`, a: 6, w: `Khối nhỏ nằm chính giữa có 6 mặt, mặt nào cũng phải do 1 nhát cưa tạo ra (mỗi nhát chỉ tạo được 1 mặt của nó) ⇒ không thể ít hơn 6; và 6 nhát (2 nhát mỗi chiều) là đủ.` },
    { q: `Khối gỗ lập phương cỡ 2×2×2 cần cắt thành 8 khối nhỏ bằng nhau bằng các nhát cưa thẳng.\nSau mỗi nhát, bạn được sắp xếp / xếp chồng các mảnh tuỳ ý rồi mới cưa nhát tiếp.\nHỏi: ít nhất bao nhiêu nhát cưa?`, a: 3, w: `Mỗi khối nhỏ có 3 mặt nằm bên trong khối to, 3 mặt đó vuông góc nhau ⇒ cần 3 nhát theo 3 chiều khác nhau; 3 nhát là đủ.` }]);
  add(3, '3-14', 'Cắt bánh', [[2, 4, 'Nhát 2 cắt ngang nhát 1 ⇒ 4 miếng.'], [3, 7, 'Mỗi nhát mới cắt qua mọi nhát cũ tại các điểm khác nhau: 2 → 4 → 7 miếng (nhát thứ 3 cắt qua 2 nhát cũ, bị chia làm 3 đoạn, mỗi đoạn tạo thêm 1 miếng).']].map(([n, a, w]) => ({
    q: `Cắt 1 cái bánh tròn phẳng bằng ${n} nhát dao thẳng, KHÔNG được xếp chồng các miếng lên nhau.\nHỏi: nhiều nhất được bao nhiêu miếng?`, a, w })));
  add(3, '3-15', 'Hai xúc xắc', one(`Tung cùng lúc 2 con xúc xắc thường (mặt 1 → 6 chấm), rồi cộng số chấm ở 2 mặt trên.\nHỏi: tổng nào có khả năng xuất hiện NHIỀU nhất?`, 7,
    `Tổng 7 có 6 cách: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1 — nhiều hơn mọi tổng khác (tổng 6 và 8 chỉ có 5 cách).`));
  add(3, '3-16', 'Thả trứng', [[6, 3], [10, 4], [15, 5], [21, 6], [28, 7], [36, 8], [45, 9]].map(([F, a]) => ({
    q: `Toà nhà ${F} tầng, có 2 quả trứng giống hệt nhau. Có 1 tầng "ngưỡng": thả trứng từ tầng đó trở lên thì vỡ, thấp hơn thì không vỡ.\nTrứng chưa vỡ thì nhặt lên thả lại được; vỡ rồi thì mất.\nHỏi: trong trường hợp xui nhất, ít nhất phải thả mấy lần để chắc chắn biết tầng ngưỡng?`, a,
    w: `Thả quả đầu ở tầng ${a}; nếu vỡ, dùng quả 2 thử lần lượt tầng 1 → ${a - 1}. Nếu không vỡ, lên thêm ${a - 1} tầng, rồi ${a - 2}… Với ${a} lần thả kiểm được ${a} + ${a - 1} + … + 1 = ${a * (a + 1) / 2} tầng ≥ ${F}; ${a - 1} lần chỉ ${a * (a - 1) / 2} tầng.` })));
  add(3, '3-17', 'Quả cân', [
    ...[[4, 2, '1, 3'], [13, 3, '1, 3, 9'], [40, 4, '1, 3, 9, 27'], [121, 5, '1, 3, 9, 27, 81']].map(([R, a, s]) => ({ q: `Cân hai đĩa. Quả cân được đặt ở CẢ HAI bên đĩa (cùng bên với vật hoặc bên kia).\nHỏi: cần ít nhất bao nhiêu quả cân để cân được mọi vật nặng 1, 2, 3, …, ${R} kg?`, a,
      w: `Mỗi quả cân có 3 cách: bên trái / bên phải / không dùng ⇒ dùng các quả ${s} kg cân được mọi số từ 1 đến ${R} (vd 2 = 3 − 1). ${a - 1} quả chỉ cân tối đa ${(3 ** (a - 1) - 1) / 2} kg.` })),
    ...[[7, 3, '1, 2, 4'], [15, 4, '1, 2, 4, 8'], [31, 5, '1, 2, 4, 8, 16'], [63, 6, '1, 2, 4, …, 32'], [127, 7, '1, 2, 4, …, 64'], [255, 8, '1, 2, 4, …, 128'], [511, 9, '1, 2, 4, …, 256']].map(([R, a, s]) => ({ q: `Cân hai đĩa. Quả cân chỉ được đặt ở MỘT bên đĩa (bên kia là vật cần cân).\nHỏi: cần ít nhất bao nhiêu quả cân để cân được mọi vật nặng 1, 2, 3, …, ${R} kg?`, a,
      w: `Mỗi quả cân chỉ có 2 cách (dùng / không dùng) ⇒ ${a} quả tạo tối đa 2^${a} − 1 = ${R} tổng khác nhau: dùng các quả ${s} kg.` }))]);
  add(3, '3-18', 'Đường đi trên lưới', [[1, 2, 3], [1, 3, 4], [1, 4, 5], [2, 2, 6], [1, 6, 7], [1, 7, 8], [1, 8, 9]].map(([r, c, a]) => ({
    q: `Một lưới ô vuông gồm ${r} hàng × ${c} cột ô. Đi dọc theo các đường kẻ, từ góc TRÊN-TRÁI đến góc DƯỚI-PHẢI; mỗi bước chỉ được đi sang PHẢI hoặc đi XUỐNG.\nHỏi: có bao nhiêu đường đi khác nhau?`, a,
    w: `Mọi đường đều gồm ${c} bước sang phải và ${r} bước xuống (tổng ${r + c} bước). Chỉ cần chọn đâu là bước xuống: ${r === 1 ? `${r + c} vị trí cho 1 bước xuống ⇒ ${a}` : `chọn 2 trong 4 vị trí ⇒ 6`} đường.` })));
  add(3, '3-19', 'Leo cầu thang', [[3, 3, '1+1+1, 1+2, 2+1'], [4, 5, '1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2'], [5, 8, 'số cách lên bậc 5 = lên bậc 4 (bước cuối 1) + lên bậc 3 (bước cuối 2) = 5 + 3']].map(([n, a, w]) => ({
    q: `Cầu thang có ${n} bậc. Mỗi bước được leo 1 bậc hoặc 2 bậc.\nHỏi: có bao nhiêu cách khác nhau để leo lên hết cầu thang? (thứ tự bước khác nhau là cách khác nhau)`, a,
    w: `${w} ⇒ ${a} cách.` })));
  add(3, '3-20', 'Chắc chắn trùng', [
    { q: `Hỏi: cần ít nhất bao nhiêu người để CHẮC CHẮN có 2 người sinh vào cùng một thứ trong tuần (thứ Hai, thứ Ba, …, Chủ nhật)?`, a: 8, w: `Tuần có 7 thứ. Xui nhất 7 người rơi vào 7 thứ khác nhau; người thứ 8 chắc chắn trùng.` },
    { q: `Mỗi người có 1 trong 4 nhóm máu: A, B, AB, O.\nHỏi: cần ít nhất bao nhiêu người để CHẮC CHẮN có 2 người cùng nhóm máu?`, a: 5, w: `4 nhóm máu. Xui nhất 4 người 4 nhóm khác nhau; người thứ 5 chắc chắn trùng.` }]);
  add(3, '3-21', 'Bắt tay', range(3, 9).map(n => ({
    q: `Một nhóm bạn gặp nhau, mỗi 2 người bắt tay nhau đúng 1 lần. Đếm được tổng cộng ${n * (n - 1) / 2} cái bắt tay.\nHỏi: nhóm có bao nhiêu người?`, a: n,
    w: `Với ${n} người: người thứ 1 bắt tay ${n - 1} người, người thứ 2 thêm ${n - 2}, … ⇒ ${range(1, n - 1).reverse().join(' + ')} = ${n * (n - 1) / 2}.` })));
  add(3, '3-22', 'Xếp chỗ ngồi', one(`Có 3 bạn An, Bình, Chi và 3 cái ghế xếp thành 1 hàng ngang.\nHỏi: có bao nhiêu cách xếp 3 bạn ngồi vào 3 ghế?`, 6,
    `Ghế 1 có 3 cách chọn, ghế 2 còn 2, ghế 3 còn 1 ⇒ 3 × 2 × 1 = 6.`));

  window.ESC_BANK = B;
  window.ESC_LIMIT = { 1: 30, 2: 90, 3: 90 };
  window.ESC_GNAME = { 1: 'Bẫy trực giác', 2: 'Suy luận', 3: 'Cân · Bốc · Đếm cách' };
})();
