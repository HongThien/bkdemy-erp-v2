// ============================================================================
// noctorium_crosswalk.mjs — dạng CỦA HỌ (Noctorium: chương/bài/dạng) → dạng BK (ma_dang) khi nhập đề.
// CEO 24/09: khối 12 gán dạng chương I (đạo hàm) · II (véc tơ) · V (toạ độ KG, kho hgt); khối 11 gán chương I (lượng giác)
// · II (dãy số) — bản đồ BK mới phủ tới đó. Chương khác ⇒ 'CHUA' (dạng chờ theo khối, mã …000000, DB chặn duyệt).
// Nhãn của họ KHÔNG lưu DB (CEO 21/09) — chỉ dùng ở đây để thu hẹp rồi bỏ. Không chắc ⇒ 'CHUA' (§1.5 thà bỏ trống).
// Câu Đúng/Sai: dạng câu = theo bảng dưới; MỖI MỆNH ĐỀ = 'CHUA' (cần đọc từng ý — bước AI sau, chưa có kênh).
// ============================================================================

const CHUA = 'CHUA'
const has = (q, re) => re.test(q.noi_dung ?? '')

// ── KHỐI 12 ──────────────────────────────────────────────────────────────────
const K12 = {
  // Bài 1 — đơn điệu, cực trị
  'Bài toán liên quan hai điểm cực trị (đường thẳng qua 2 cực trị, tam giác cực trị, điều kiện hình học)': 'T112020105',
  'Dùng tính đơn điệu để so sánh giá trị hoặc giải bất phương trình': 'T112010102',
  'Kiểm tra nhiều tính chất của một hàm số cho bởi công thức': 'T112010102',
  'Lý thuyết- điều kiện đơn điệu (f′-0-f′-0), dấu hiệu cực trị': CHUA,
  'Tìm cực trị khi cho công thức hàm số hoặc đạo hàm': 'T112010201',
  'Tìm tham số để hàm số đơn điệu hoặc có cực trị theo yêu cầu': (q) => has(q, /cực trị|cực đại|cực tiểu/) ? (has(q, /x\^\{3\}/) ? 'T112020105' : CHUA) : has(q, /đồng biến|nghịch biến|đơn điệu/) ? 'T112010102' : CHUA,
  'Xét tính đơn điệu khi cho công thức hàm số': 'T112010102',
  'Xét đơn điệu-cực trị của hàm hợp, hàm ẩn (biết đồ thị-BBT của f hoặc f′)': 'T112010104',
  'Đọc cực trị từ bảng biến thiên hoặc bảng xét dấu': 'T112010202',
  'Đọc cực trị từ hình vẽ đồ thị': 'T112010202',
  'Đọc khoảng đơn điệu từ bảng biến thiên hoặc bảng xét dấu': 'T112010101',
  'Đọc khoảng đơn điệu từ hình vẽ đồ thị': 'T112010101',
  // Bài 2 — GTLN/GTNN
  'Giải bài toán thực tiễn quy về giá trị lớn nhất, nhỏ nhất': 'T112010403',
  'Kiểm tra nhiều tính chất liên quan giá trị lớn nhất, nhỏ nhất': 'T112010402',
  'Tìm giá trị lớn nhất, nhỏ nhất của hàm hợp, hàm ẩn (biết đồ thị-BBT của f), có thể kèm tham số': 'T112010401',
  'Tìm giá trị lớn nhất, nhỏ nhất của hàm lượng giác, mũ, logarit, căn thức': 'T112010402',
  'Tìm giá trị lớn nhất, nhỏ nhất của hàm đa thức hoặc phân thức trên đoạn': 'T112010402',
  'Tìm giá trị lớn nhất, nhỏ nhất trên khoảng hoặc nửa khoảng': 'T112010402',
  'Tìm tham số để giá trị lớn nhất, nhỏ nhất thoả điều kiện cho trước': 'T112010402',
  'Tính biểu thức chứa giá trị lớn nhất và giá trị nhỏ nhất': 'T112010402',
  'Đọc giá trị lớn nhất, nhỏ nhất từ bảng biến thiên hoặc hình vẽ đồ thị': 'T112010401',
  // Bài 3 — tiệm cận
  'Lý thuyết- định nghĩa đường tiệm cận': 'T112010308',
  'Tìm tiệm cận ngang khi cho công thức hàm số': 'T112010301',
  'Tìm tiệm cận từ giới hạn cho trước': 'T112010308',
  'Tìm tiệm cận xiên khi cho công thức hàm số': 'T112010305',
  'Tìm tiệm cận đứng khi cho công thức hàm số': 'T112010303',
  'Tìm tâm đối xứng của đồ thị (giao hai đường tiệm cận)': CHUA,           // BK chưa có dạng
  'Tìm đồng thời các đường tiệm cận hoặc đếm số tiệm cận': CHUA,          // BK tách ngang/đứng riêng
  'Đếm-tìm tiệm cận của hàm chứa f(x) hoặc hàm hợp khi biết bảng biến thiên': CHUA,
  'Đọc tiệm cận khi cho bảng biến thiên hoặc hình vẽ': (q) => has(q, /tiệm cận xiên/) ? 'T112010306' : CHUA, // BK chỉ có "xiên từ BBT/đồ thị"
  // Bài 4 — khảo sát
  'Dùng đồ thị biện luận số nghiệm của phương trình': (q) => has(q, /bậc ba|x\^\{3\}/) ? 'T112020104' : CHUA,
  'Kiểm tra nhiều tính chất của hàm số cho bởi công thức': CHUA,
  'Kiểm tra nhiều tính chất khi cho hình vẽ đồ thị hoặc bảng biến thiên': CHUA,
  'Nhận dạng đồ thị hàm phân thức bậc hai trên bậc nhất': 'T112020302',
  'Nhận dạng đồ thị hàm phân thức bậc nhất trên bậc nhất': 'T112020202',
  'Nhận dạng đồ thị hàm số bậc ba': 'T112020104',
  'Nhận dạng đồ thị hàm số bậc bốn trùng phương': CHUA,
  'Tìm giao điểm của đồ thị với trục toạ độ hoặc với đồ thị khác': CHUA,
  'Xác định hệ số của hàm số từ hình vẽ đồ thị': (q) => has(q, /x\^\{3\}|bậc ba/) ? 'T112020103' : has(q, /\{ax\+b\}\{cx\+d\}|bậc nhất trên bậc nhất/) ? 'T112020201' : has(q, /\{ax\^\{2\}|bậc hai trên bậc nhất/) ? 'T112020301' : CHUA,
  // Bài 5 — thực tiễn
  'Giải bài toán tăng trưởng hoặc phân rã': 'T112020402',
  'Kiểm tra nhiều tính chất của một mô hình thực tiễn': 'T112020402',
  'Tính tốc độ liên hệ giữa hai đại lượng cùng biến thiên': 'T112020402',
  'Tính tốc độ thay đổi tức thời của một đại lượng': 'T112020402',
  'Tính vận tốc, gia tốc, quãng đường của chuyển động': 'T112020402',
  'Tối ưu chi phí, lợi nhuận, doanh thu': 'T112020401',
  'Tối ưu diện tích, thể tích, kích thước': 'T112020401',
  'Tối ưu quãng đường, thời gian di chuyển': 'T112020401',
  'Tối ưu trong bài toán sinh học, y tế, môi trường': 'T112020402',
  'Tối ưu trong bài toán vật lý, kỹ thuật': 'T112020402',
  'Xác định tham số của mô hình từ dữ kiện cho trước': 'T112020402',
  'Đọc mô hình thực tế từ hình vẽ đồ thị hoặc bảng biến thiên': 'T112020402',
  // Bài 6 — véc tơ trong không gian
  'Biểu diễn một véc tơ qua ba véc tơ không đồng phẳng': 'T112070101',
  'Dùng hệ thức trung điểm, trọng tâm để tính toán hoặc chứng minh': 'T112070105',
  'Giải bài toán thực tế mô tả bằng véc tơ': 'T112070109',
  'Kiểm tra nhiều tính chất trong một bài toán véc tơ tổng hợp': 'T112070101',
  'Làm việc với véc tơ khi cho bằng toạ độ Oxyz': 'T112070301',
  'Tính góc giữa hai véc tơ': (q) => has(q, /hình (lập phương|hộp|chóp|tứ diện|lăng trụ)/) ? 'T112070107' : 'T112070103',
  'Tính tích vô hướng của hai véc tơ trong hình khối': 'T112070102',
  'Tính tổng, hiệu các véc tơ trong hình khối': 'T112070101',
  'Tính độ dài véc tơ hoặc độ dài đoạn thẳng': CHUA,
  'Xác định véc tơ bằng nhau, cùng phương hoặc đối nhau trong hình khối': CHUA,
  // Bài 7 — hệ trục
  'Tính tích có hướng của hai véc tơ và ứng dụng': 'T112070201',
  // Bài 8 — biểu thức toạ độ
  'Dùng hệ thức trung điểm, trọng tâm theo toạ độ': 'T112070305',
  'Giải bài toán thực tế mô tả bằng toạ độ': (q) => has(q, /vận tốc|tốc độ/) ? 'T112070311' : has(q, /\blực\b|Lực\b|\bN\b/) ? 'T112070312' : 'T112070203',
  'Kiểm tra nhiều tính chất trong một bài toán toạ độ tổng hợp': 'T112070301',
  'Toạ độ hoá một bài toán hình học không gian': 'T112070308',
  'Tìm toạ độ của điểm hoặc véc tơ từ dữ kiện cho trước': 'T112070301',
  'Tìm điểm thoả mãn điều kiện cho trước hoặc cực trị hình học': 'T112070307',
  'Tính tích vô hướng và góc giữa hai véc tơ theo toạ độ': 'T112070303',
  'Tính tổng, hiệu, tích của véc tơ với một số theo toạ độ': 'T112070302',
  'Tính độ dài véc tơ hoặc khoảng cách giữa hai điểm': 'T112070304',
  'Xét hai véc tơ cùng phương, vuông góc hoặc ba véc tơ đồng phẳng': 'T112070306',
  // Bài 14 — mặt phẳng (kho hgt)
  'Kiểm tra nhiều tính chất trong một bài toán mặt phẳng tổng hợp': 'T312010101',
  'Tìm điểm hoặc tham số thoả mãn điều kiện cho trước': 'T312010107',          // bài 14 (mặt phẳng); bài 15 xử riêng bên dưới theo bài
  'Tính khoảng cách từ một điểm đến mặt phẳng': 'T312010503',
  'Viết phương trình mặt phẳng qua ba điểm hoặc dạng đoạn chắn': 'T312010103',
  'Viết phương trình mặt phẳng qua điểm và biết véc tơ pháp tuyến': 'T312010102',
  'Viết phương trình mặt phẳng song song hoặc vuông góc với mặt phẳng cho trước': 'T312010102',
  'Xác định véc tơ pháp tuyến hoặc kiểm tra điểm thuộc mặt phẳng': 'T312010101',
  'Xét vị trí tương đối của hai mặt phẳng': 'T312010701',
  // Bài 15 — đường thẳng
  'Kiểm tra nhiều tính chất trong một bài toán đường thẳng tổng hợp': 'T312010201',
  'Tính khoảng cách từ điểm đến đường thẳng hoặc giữa hai đường chéo nhau': (q) => has(q, /chéo nhau/) ? 'T312010504' : 'T312010502',
  'Viết phương trình tham số hoặc chính tắc của đường thẳng': 'T312010202',
  'Viết phương trình đường thẳng thoả điều kiện song song, vuông góc, cắt nhau': 'T312010202',
  'Xác định véc tơ chỉ phương hoặc điểm thuộc đường thẳng': 'T312010201',
  'Xét vị trí tương đối giữa hai đường thẳng': 'T312010703',
  'Xét vị trí tương đối giữa đường thẳng và mặt phẳng': 'T312010702',
  // Bài 16 — góc
  'Tính góc giữa hai mặt phẳng hoặc góc nhị diện': 'T312010601',
  'Tính góc giữa hai đường thẳng': 'T312010603',
  'Tính góc giữa đường thẳng và mặt phẳng': 'T312010602',
  // Bài 17- — thực tiễn
  'Giải bài toán chuyển động bằng toạ độ': 'T312010802',
  'Giải bài toán thực tiễn dùng phương trình mặt cầu': 'T312010803',
  'Giải bài toán thực tiễn dùng phương trình mặt phẳng': 'T312010801',
  'Giải bài toán thực tiễn dùng phương trình đường thẳng': 'T312010802',
  'Kiểm tra nhiều tính chất trong một bài toán toạ độ thực tiễn': CHUA,
  'Tìm cực trị trong hệ toạ độ không gian': CHUA,
  'Tìm toạ độ điểm trong bài toán thực tiễn': CHUA,
  // Bài 17 — mặt cầu
  'Kiểm tra nhiều tính chất trong một bài toán mặt cầu tổng hợp': 'T312010301',
  'Tìm điểm hoặc tham số liên quan đến mặt cầu': 'T312010301',
  'Viết phương trình mặt cầu từ điều kiện cho trước': 'T312010301',
  'Xác định tâm và bán kính từ phương trình mặt cầu': 'T312010301',
  'Xét vị trí tương đối giữa mặt cầu với mặt phẳng hoặc đường thẳng': (q) => has(q, /mặt phẳng/) ? 'T312010704' : 'T312010705',
  'Xét vị trí tương đối giữa mặt cầu với điểm hoặc với mặt cầu khác': 'T312010706',
}
// Cùng tên dạng ở 2 bài khác nhau (bài 15 vs 14; 17- vs 8) ⇒ ghi đè theo bài
const K12_THEO_BAI = {
  'Bài 15|Tìm điểm hoặc tham số thoả mãn điều kiện cho trước': 'T312010201',
  'Bài 17-|Toạ độ hoá một bài toán hình học không gian': CHUA,
}

// ── KHỐI 11 ──────────────────────────────────────────────────────────────────
const K11 = {
  // Bài 1
  // tên file của họ bị Windows cắt cụt ở "…trên đ" — khớp đúng chuỗi cụt
  'Cung và góc lượng giác- đổi đơn vị độ↔radian, độ dài cung; xác định số đo góc lượng giác (Ou,Ov) và biểu diễn góc trên đ':
    (q) => has(q, /độ dài cung|độ dài của cung/) ? 'T111010102' : has(q, /rađian|radian|rad\b|đổi/) ? 'T111010101' : CHUA,
  'Giải bài toán thực tế dùng giá trị lượng giác': CHUA,
  'Tính hoặc rút gọn giá trị lượng giác của một góc': (q) => has(q, /dấu/) ? 'T111010106' : has(q, /biểu thức|[A-Z]\s*=\s*\\?\w*\s*\$?\\(sin|cos|tan|cot)/) ? 'T111010110' : has(q, /Cho \$?\\(sin|cos|tan|cot)/) ? 'T111010108' : CHUA,
  // Bài 2
  'Biến đổi giữa tổng và tích các giá trị lượng giác': CHUA,
  'Dùng công thức cộng hoặc công thức nhân đôi để tính, rút gọn': (q) => { const doi = has(q, /2\\alpha|2a\b|\\(sin|cos|tan) 2|nhân đôi|hạ bậc/); const rg = has(q, /Rút gọn|rút gọn/); return doi ? (rg ? 'T111010606' : 'T111010605') : (rg ? 'T111010603' : 'T111010602') },
  // Bài 3
  'Giải bài toán thực tế mô tả bằng hàm số lượng giác': 'T111030105',
  'Kiểm tra nhiều tính chất của một hàm số lượng giác': 'T111030101',
  'Nhận dạng đồ thị của hàm số lượng giác': 'T111030501',
  'Tìm tập giá trị, giá trị lớn nhất và nhỏ nhất của hàm số lượng giác': (q) => has(q, /\^\{2\}/) ? 'T111030203' : (has(q, /\\sin/) && has(q, /\\cos/)) ? 'T111030204' : 'T111030201',
  'Tìm tập xác định của hàm số lượng giác': (q) => has(q, /\\dfrac|phân thức/) ? 'T111030102' : 'T111030101',
  'Xét tính chẵn lẻ và tính tuần hoàn của hàm số lượng giác': (q) => has(q, /chu kỳ|chu kì|tuần hoàn/) ? 'T111030104' : has(q, /chẵn|lẻ/) ? 'T111030103' : CHUA,
  // Bài 4
  'Giải bài toán thực tế đưa về phương trình lượng giác': (q) => has(q, /bao nhiêu lần|số lần/) ? 'T111040302' : 'T111040301',
  'Giải phương trình cos x = m': 'T111040101',
  'Giải phương trình sin x = m': 'T111040101',
  'Giải phương trình tan x = m hoặc cot x = m': 'T111040101',
  'Kiểm tra nhiều tính chất trong một bài toán lượng giác tổng hợp': 'T111040101',
  'Tìm nghiệm thoả mãn điều kiện cho trước trên một khoảng': 'T111040102',
  // Bài 5
  'Tìm số hạng của dãy số cho bởi công thức hoặc hệ thức truy hồi': 'T111060101',
  'Xét tính tăng, giảm và tính bị chặn của dãy số': (q) => has(q, /bị chặn/) ? 'T111060105' : 'T111060104',
  // Bài 6
  'Giải bài toán thực tế bằng cấp số cộng': 'T111060205',
  'Nhận biết một dãy số có phải là cấp số cộng': 'T111060201',
  'Tìm công sai của cấp số cộng': 'T111060202',
  'Tìm số hạng đầu, hoặc tìm đồng thời số hạng đầu và công sai': 'T111060204',
  'Tính tổng n số hạng đầu của cấp số cộng': 'T111060202',
  // Bài 7
  'Giải bài toán thực tế bằng cấp số nhân': 'T111060304',
  'Nhận biết một dãy số có phải là cấp số nhân': 'T111060301',
  'Tìm công bội của cấp số nhân': 'T111060302',
  'Tìm số hạng đầu, hoặc tìm đồng thời số hạng đầu và công bội': 'T111060302',
  'Tính tổng n số hạng đầu của cấp số nhân': 'T111060302',
}
// Cùng tên ở bài 6 (CSC) và bài 7 (CSN)
const K11_THEO_BAI = {
  'Bài 6|Tìm một số hạng cụ thể hoặc số hạng tổng quát': 'T111060202',
  'Bài 7|Tìm một số hạng cụ thể hoặc số hạng tổng quát': 'T111060302',
}

const chuongCua = (nhan) => nhan?.chuong?.match(/^Chương ([IVX]+)\./)?.[1] ?? null
const baiCua = (nhan) => nhan?.bai?.match(/^(Bài \d+-?)/)?.[1] ?? '' // "Bài 17-" (thực tiễn) khác "Bài 17" (mặt cầu); KHÔNG kèm dấu chấm
// Rào: mã dạng phải cùng kho với subject (T1… = dai, T3… = hgt) — lệch là lỗi crosswalk ⇒ dạng chờ, không đâm vào FK
const hopKho = (subject, dang) => dang === CHUA || (subject === 'dai' ? dang.startsWith('T1') : dang.startsWith('T3'))

/**
 * @returns {{ subject: 'dai'|'hgt'|null, dang: string, ly_do: string }}
 *   subject null = KHÔNG nhập (khối 11 chương IV/VII hình không gian — kho đích chưa chốt, xem báo cáo 24/09)
 *   dang 'CHUA' = dạng chờ theo khối
 */
export function ganDang(khoi, q) {
  const ch = chuongCua(q.nhan); const bai = baiCua(q.nhan); const ten = q.nhan?.dang ?? ''
  if (String(khoi) === '12') {
    const subject = ch === 'V' ? 'hgt' : 'dai'
    if (!['I', 'II', 'V'].includes(ch)) return { subject, dang: CHUA, ly_do: `chương ${ch ?? '?'} chưa gán` }
    const rule = K12_THEO_BAI[`${bai}|${ten}`] ?? K12[ten]
    if (rule === undefined) return { subject, dang: CHUA, ly_do: `dạng lạ: ${ten}` }
    const dang = typeof rule === 'function' ? rule(q) : rule
    if (!hopKho(subject, dang)) return { subject, dang: CHUA, ly_do: `crosswalk lệch kho (${dang} vs ${subject}): ${ten}` }
    return { subject, dang, ly_do: dang === CHUA ? `crosswalk CHUA: ${ten}` : 'crosswalk' }
  }
  if (String(khoi) === '11') {
    if (ch === 'IV' || ch === 'VII') return { subject: null, dang: CHUA, ly_do: 'hình không gian 11 — kho đích chưa chốt' }
    const subject = 'dai'
    if (!['I', 'II'].includes(ch)) return { subject, dang: CHUA, ly_do: `chương ${ch ?? '?'} chưa gán` }
    const rule = K11_THEO_BAI[`${bai}|${ten}`] ?? K11[ten]
    if (rule === undefined) return { subject, dang: CHUA, ly_do: `dạng lạ: ${ten}` }
    const dang = typeof rule === 'function' ? rule(q) : rule
    return { subject, dang, ly_do: dang === CHUA ? `crosswalk CHUA: ${ten}` : 'crosswalk' }
  }
  return { subject: 'dai', dang: CHUA, ly_do: `khối ${khoi} chưa có crosswalk` }
}
