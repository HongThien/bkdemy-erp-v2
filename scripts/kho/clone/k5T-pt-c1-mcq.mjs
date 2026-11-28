// ============================================================================
// k5T-pt-c1-mcq.mjs — SINH phương án nhiễu MCQ cho 200 câu "bán hàng / giảm giá" 5T (Tỉ số phần trăm), NDB02771–02773 (28/11).
// Đọc kho-rules/dai/clone/k5T-pt-c1.json (có `mau` + `tham_so`), mỗi nhiễu = KẾT QUẢ THẬT của một đường sai có tên, tính bằng code từ tham số.
//   node scripts/kho/clone/k5T-pt-c1-mcq.mjs [--ra kho-rules/dai/clone/k5T-pt-c1-mcq.json]
// Kiểm: node scripts/kho/clone/k5T-pt-mcq-kiem.mjs kho-rules/dai/clone/k5T-pt-c1-mcq.json
// Ký hiệu: G giá gốc/vốn · B giá bán · L tiền lãi · p,q,a,c,d,x,y phần trăm (số nguyên, 20 = 20%) · N,n số lượng.
// Mỗi mẫu trả danh sách [giá trị, rule, duong_sai]; bộ lọc chung loại giá trị không hợp lệ (âm, 0, trùng đáp án, tiền không bội 1000,
// phần trăm không tròn tới 1 chữ số thập phân, lệch cỡ >100 lần). Xếp: các rule thường theo thứ tự xáo (hạt giống cố định), R540 dự phòng cuối.
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const rnd = mulberry32(20261128)
const sap = (v) => Math.round(v * 1e6) / 1e6
const f = (n) => String(sap(n)).replace('.', ',')

// ── cách viết đáp số theo khuôn của đáp án ───────────────────────────────────────────────────────────────────────
const tien = (v) => `$${sap(v)}$ đồng`
const pct = (v) => `$${f(v)}\\%$`
const lai = (v) => `Lãi $${f(v)}\\%$`
const money = (v) => Number.isInteger(sap(v)) && sap(v) % 1000 === 0
const pcOk = (v) => Math.abs(v * 10 - Math.round(v * 10)) < 1e-6
const vnd = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/** Mỗi mẫu → { kind: 'tien' | 'pct' | 'lai', dung, ds: [[giá trị, rule, duong_sai]…] } */
function duongSai(mau, t) {
  const P = (x) => x / 100
  switch (mau) {
    case 'bh_gg_a': { // G, p: bán B = G(1+p%) ⇒ tìm G
      const B = t.G * (1 + P(t.p)), L = B - t.G
      return { kind: 'tien', dung: t.G, ds: [
        [B * P(t.p), 'R525', `Lấy ${t.p}% của giá bán (${vnd(B)} × ${t.p}%) thay vì chia cho ${100 + t.p}%.`],
        [B - B * P(t.p), 'R527', `Tính ${t.p}% trên giá bán rồi trừ đi, quên rằng ${t.p}% là phần của giá vốn.`],
        [B + B * P(t.p), 'R407', `Cộng thêm ${t.p}% giá bán thay vì tìm giá vốn.`],
        [L, 'R539', `Mới tính ra tiền lãi (${vnd(L)} đồng) rồi dừng, tưởng là giá vốn.`],
        [B, 'R537', 'Ghi luôn giá bán (cả gốc lẫn lãi) làm giá vốn.'],
        [B / (1 - P(t.p)), 'R530', `Hiểu ngược lãi thành lỗ: chia giá bán cho ${100 - t.p}% thay vì ${100 + t.p}%.`],
        [B / P(t.p), 'R525', `Chia giá bán cho ${t.p}% thay vì cho ${100 + t.p}%.`],
        [t.G * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'bh_gg_b': { // L, p: lãi = p% giá nhập
      const G = t.L / P(t.p)
      return { kind: 'tien', dung: G, ds: [
        [t.L * P(t.p), 'R525', `Lấy ${t.p}% của tiền lãi thay vì chia tiền lãi cho ${t.p}%.`],
        [G + t.L, 'R537', 'Tính ra giá bán (giá nhập cộng lãi) rồi ghi làm giá nhập.'],
        [t.L / P(100 - t.p), 'R101', `Chia tiền lãi cho ${100 - t.p}% (phần trăm bù) thay vì ${t.p}%.`],
        [G - t.L, 'R407', 'Trừ tiền lãi khỏi giá nhập vừa tìm, nhầm thêm một bước.'],
        [t.L * (100 - t.p) / t.p, 'R527', `Coi tiền lãi là ${t.p}% của giá bán nên giá nhập là phần còn lại.`],
        [G / 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'],
        [G * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'bh_lai_a': { // G, p: lãi = G·p%
      const L = t.G * P(t.p)
      return { kind: 'tien', dung: L, ds: [
        [t.G / P(t.p), 'R525', `Chia giá vốn cho ${t.p}% thay vì nhân với ${t.p}%.`],
        [t.G + L, 'R537', 'Tính ra giá bán (gốc cộng lãi) rồi ghi làm tiền lãi.'],
        [t.G * P(100 - t.p), 'R101', `Lấy ${100 - t.p}% giá vốn (phần trăm bù) thay vì ${t.p}%.`],
        [t.G - L, 'R407', 'Lấy giá vốn trừ tiền lãi thay vì tìm tiền lãi.'],
        [t.G * (1 + P(t.p)) * P(t.p), 'R527', `Tính ${t.p}% trên giá bán thay vì trên giá vốn.`],
        [L / 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'],
        [L * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'bh_lai_b': { // G, B: lãi = B − G
      const L = t.B - t.G
      return { kind: 'tien', dung: L, ds: [
        [t.B + t.G, 'R407', 'Cộng giá bán với giá vốn thay vì lấy hiệu.'],
        [t.B, 'R537', 'Ghi luôn giá bán (cả gốc lẫn lãi) làm tiền lãi.'],
        [t.G, 'R539', 'Dừng ở số liệu ban đầu, lấy giá vốn làm đáp số.'],
        [L * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'], [L / 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'bh_lai_c': { // B, p: G = B/(1+p%)
      const G = t.B / (1 + P(t.p)), L = t.B - G
      return { kind: 'tien', dung: L, ds: [
        [t.B * P(t.p), 'R527', `Lấy ${t.p}% của giá bán thay vì ${t.p}% của giá nhập.`],
        [G, 'R539', 'Mới tìm ra giá nhập rồi dừng, ghi làm tiền lãi.'],
        [t.B / P(t.p), 'R525', `Chia giá bán cho ${t.p}% thay vì tìm giá nhập rồi lấy hiệu.`],
        [t.B * P(100 - t.p), 'R101', `Lấy ${100 - t.p}% của giá bán (phần trăm bù) làm tiền lãi.`],
        [t.B * (1 - P(t.p)), 'R530', `Hiểu ngược: coi giá nhập bằng giá bán trừ ${t.p}%, ghi làm tiền lãi.`],
        [L / 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'],
        [L * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'bh_gb_a': { // G, p: B = G(1+p%)
      const L = t.G * P(t.p), B = t.G + L
      return { kind: 'tien', dung: B, ds: [
        [L, 'R408', `Mới tính tiền lãi (${vnd(L)} đồng), quên cộng giá gốc.`],
        [t.G - L, 'R530', `Hiểu ngược lãi thành lỗ: trừ ${t.p}% thay vì cộng.`],
        [t.G / P(t.p), 'R525', `Chia giá gốc cho ${t.p}% thay vì nhân với ${t.p}%.`],
        [t.G * t.p, 'R100', `Nhân giá gốc với ${t.p} mà quên chia 100.`],
        [t.G / (1 - P(t.p)), 'R527', `Coi lãi ${t.p}% là phần trăm của giá bán, chia giá gốc cho ${100 - t.p}%.`],
        [B / 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'],
        [B * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'bh_gb_b': { // G, L: B = G + L
      const B = t.G + t.L
      return { kind: 'tien', dung: B, ds: [
        [t.G - t.L, 'R407', 'Lấy giá nhập trừ tiền lãi thay vì cộng.'],
        [t.L, 'R537', 'Ghi luôn tiền lãi làm giá bán, quên cộng giá nhập.'],
        [t.G, 'R408', 'Dừng ở giá nhập, chưa cộng tiền lãi.'],
        [t.L - t.G, 'R409', 'Lấy số nhỏ trừ số lớn theo chiều ngược (lệch hướng cộng).'],
        [B * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'bh_gb_c': { // G, p, n: tổng tiền thu = n·G(1+p%)
      const B1 = t.G * (1 + P(t.p)), tong = t.n * B1
      return { kind: 'tien', dung: tong, ds: [
        [B1, 'R104', `Chỉ tính giá bán một chiếc, quên nhân với ${t.n} chiếc.`],
        [t.n * t.G * P(t.p), 'R531', 'Chỉ tính tổng tiền lãi, quên cộng tiền vốn của cả lô.'],
        [t.n * t.G, 'R408', 'Chỉ tính tổng tiền vốn của cả lô, chưa cộng lãi.'],
        [t.n * t.G * (1 - P(t.p)), 'R530', `Hiểu ngược lãi thành lỗ: trừ ${t.p}% thay vì cộng.`],
        [tong * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'bh_tl_a': case 'bh_tl_b': case 'bh_tl_c': { // tỉ lệ lãi so với giá nhập
      const G = t.G ?? (t.B - t.L), B = t.B ?? (t.G + t.L), L = B - G, dung = (L / G) * 100
      const ds = [
        [(B / G) * 100, 'R528', 'Tính giá bán bằng bao nhiêu phần trăm giá nhập rồi ghi luôn, quên trừ 100%.'],
        [(L / B) * 100, 'R527', 'Lấy tiền lãi chia cho giá bán thay vì chia cho giá nhập.'],
        [(G / L) * 100, 'R529', 'Chia ngược: lấy giá nhập chia cho tiền lãi.'],
        [100 - dung, 'R101', `Lấy phần trăm bù: 100% − ${f(dung)}%.`],
        [(G / B) * 100, 'R529', 'Chia ngược: lấy giá nhập chia cho giá bán.'],
        [((B + G) / G) * 100, 'R407', 'Cộng giá bán với giá nhập rồi so với giá nhập thay vì lấy hiệu.'],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'], [dung / 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ]
      return { kind: 'pct', dung, ds }
    }
    case 'bh_tb_a': { // N, S: tỉ lệ bán
      const dung = (t.S / t.N) * 100
      return { kind: 'pct', dung, ds: [
        [(t.N / t.S) * 100, 'R529', 'Chia ngược: lấy số nhập chia cho số bán.'],
        [100 - dung, 'R101', 'Tính phần trăm số hàng CHƯA bán (phần bù) thay vì số đã bán.'],
        [((t.N + t.S) / t.N) * 100, 'R407', 'Cộng số nhập với số bán rồi chia cho số nhập.'],
        [((t.N - t.S) / t.S) * 100, 'R529', 'Lấy số hàng còn lại chia cho số hàng đã bán.'],
        [100 + dung, 'R528', 'Cộng thêm 100% vào tỉ số đã tính.'],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'], [dung / 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'bh_tb_b': { // N, a, B: thu = N·a%·B
      const dung = t.N * P(t.a) * t.B
      return { kind: 'tien', dung, ds: [
        [t.N * P(100 - t.a) * t.B, 'R101', `Tính cho ${100 - t.a}% số hàng chưa bán (phần bù) thay vì ${t.a}% số hàng đã bán.`],
        [t.N * t.B, 'R539', 'Lấy cả số hàng đã nhập nhân giá bán, quên chỉ bán một phần.'],
        [t.N * t.a * t.B, 'R100', `Nhân với ${t.a} mà quên chia 100.`],
        [(t.N / P(t.a)) * t.B, 'R525', `Chia số hàng cho ${t.a}% thay vì nhân.`],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'bh_tb_c': { // N, a, g, p: lãi = N·a%·g·p%
      const dung = t.N * P(t.a) * t.g * P(t.p), gb = t.g * (1 + P(t.p))
      return { kind: 'tien', dung, ds: [
        [t.N * P(t.a) * t.g, 'R539', 'Mới tính tiền vốn của số hàng đã bán, chưa tính phần lãi.'],
        [t.N * t.g * P(t.p), 'R408', 'Tính lãi như thể bán hết số hàng, bỏ sót bước lấy phần đã bán.'],
        [t.N * P(t.a) * gb * P(t.p), 'R527', `Tính ${t.p}% trên giá bán thay vì trên giá gốc.`],
        [t.N * P(t.a) * gb, 'R537', 'Ghi cả tiền gốc lẫn lãi của số hàng đã bán làm tiền lãi.'],
        [t.g * P(t.p), 'R104', 'Chỉ tính lãi của một sản phẩm, quên nhân số hàng đã bán.'],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'gb_1': { // G, a: lãi = a% B ⇒ B = G/(1−a%)
      const B = t.G / (1 - P(t.a)), L = B - t.G
      return { kind: 'tien', dung: B, ds: [
        [t.G * (1 + P(t.a)), 'R527', `Tính ${t.a}% trên giá vốn thay vì trên giá bán.`],
        [t.G / P(t.a), 'R101', `Chia giá vốn cho ${t.a}% thay vì cho ${100 - t.a}% (phần bù).`],
        [L, 'R539', 'Mới tìm ra tiền lãi rồi dừng, chưa cộng giá vốn.'],
        [t.G / (1 + P(t.a)), 'R530', `Hiểu ngược: chia cho ${100 + t.a}% thay vì ${100 - t.a}%.`],
        [t.G * (1 - P(t.a)), 'R525', `Nhân giá vốn với ${100 - t.a}% thay vì chia.`],
        [t.G * t.a, 'R100', `Nhân giá vốn với ${t.a} mà quên chia 100.`],
        [B * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'gb_2a': case 'gb_2b': { // L, c, hoi: G = c% B, L = (1−c%) B
      const B = t.L / (1 - P(t.c)), G = B * P(t.c), dung = t.hoi === 'B' ? B : G
      const ds = t.hoi === 'B' ? [
        [t.L / P(t.c), 'R101', `Chia tiền lãi cho ${t.c}% (giá vốn) thay vì cho ${100 - t.c}% (lãi).`],
        [t.L * (1 - P(t.c)), 'R525', `Nhân tiền lãi với ${100 - t.c}% thay vì chia.`],
        [G, 'R539', 'Mới tìm ra giá vốn rồi dừng, ghi làm giá bán.'],
        [B * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] : [
        [B, 'R408', 'Mới tìm ra giá bán rồi dừng, chưa tính giá vốn.'],
        [t.L / P(t.c), 'R101', `Chia tiền lãi cho ${t.c}% thay vì cho ${100 - t.c}%.`],
        [t.L * P(t.c), 'R525', `Nhân tiền lãi với ${t.c}% thay vì chia theo ${100 - t.c}%.`],
        [t.L + G, 'R537', 'Cộng thêm tiền lãi vào giá vốn, ra giá bán thay vì giá vốn.'],
        [G * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ]
      return { kind: 'tien', dung, ds }
    }
    case 'gb_3a': case 'gb_3b': { // B, a, hoi: lãi = a% B
      const L = t.B * P(t.a), G = t.B - L, dung = t.hoi === 'L' ? L : G
      const ds = t.hoi === 'L' ? [
        [t.B / P(t.a), 'R525', `Chia giá bán cho ${t.a}% thay vì nhân.`],
        [t.B * P(100 - t.a), 'R101', `Lấy ${100 - t.a}% giá bán (phần bù, chính là giá nhập) thay vì ${t.a}%.`],
        [t.B * t.a, 'R100', `Nhân giá bán với ${t.a} mà quên chia 100.`],
        [t.B + L, 'R407', 'Cộng tiền lãi vào giá bán thay vì chỉ lấy tiền lãi.'],
        [L * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] : [
        [L, 'R408', 'Mới tính tiền lãi rồi dừng, quên lấy giá bán trừ đi.'],
        [t.B + L, 'R407', 'Cộng tiền lãi vào giá bán thay vì trừ.'],
        [t.B / (1 + P(t.a)), 'R527', `Tính ${t.a}% trên giá nhập thay vì trên giá bán.`],
        [t.B / (1 - P(t.a)), 'R525', `Chia giá bán cho ${100 - t.a}% thay vì nhân.`],
        [G * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ]
      return { kind: 'tien', dung, ds }
    }
    case 'gb_4': { // G, B: tiền lãi bằng bao nhiêu % giá bán
      const dung = ((t.B - t.G) / t.B) * 100
      return { kind: 'pct', dung, ds: [
        [((t.B - t.G) / t.G) * 100, 'R527', 'Lấy tiền lãi chia cho giá nhập thay vì chia cho giá bán.'],
        [(t.G / t.B) * 100, 'R101', 'Tính giá nhập bằng bao nhiêu phần trăm giá bán (phần bù của lãi).'],
        [(t.B / t.G) * 100, 'R529', 'Chia ngược: lấy giá bán chia cho giá nhập.'],
        [((t.B - t.G) / t.G) * 100 + 100, 'R528', 'Tính giá bán bằng bao nhiêu phần trăm giá nhập rồi cộng thêm 100%.'],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'gb_5': { // x, y, kieu
      const dung = t.y
      if (t.kieu === 'bg') return { kind: 'pct', dung, ds: [ // lãi x% GIÁ BÁN ⇒ lãi bằng y% giá gốc
        [t.x, 'R527', `Ghi luôn ${t.x}%, quên đổi cơ sở từ giá bán sang giá gốc.`],
        [100 - t.x, 'R101', `Lấy phần bù: 100% − ${t.x}% = ${100 - t.x}%.`],
        [(100 - t.x) / t.x * 100, 'R529', `Chia ngược: giá gốc (${100 - t.x}%) chia cho tiền lãi (${t.x}%).`],
        [100 + t.x, 'R528', `Cộng thêm: 100% + ${t.x}% = ${100 + t.x}%.`],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
      return { kind: 'pct', dung, ds: [ // lãi x% GIÁ GỐC ⇒ lãi bằng y% giá bán
        [t.x, 'R527', `Ghi luôn ${t.x}%, quên đổi cơ sở từ giá gốc sang giá bán.`],
        [100 - t.x, 'R101', `Lấy phần bù: 100% − ${t.x}% = ${100 - t.x}%.`],
        [(100 + t.x) / t.x * 100, 'R529', `Chia ngược: giá bán (${100 + t.x}%) chia cho tiền lãi (${t.x}%).`],
        [100 + t.x, 'R528', `Tính giá bán bằng ${100 + t.x}% giá gốc rồi ghi luôn.`],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'gg_1_pt': { // p, d: lãi p%, giảm d% ⇒ còn lãi q%
      const dung = (1 + P(t.p)) * (1 - P(t.d)) * 100 - 100
      return { kind: 'lai', dung, ds: [
        [t.p - t.d, 'R526', `Trừ thẳng ${t.p}% − ${t.d}% thay vì nhân hai tỉ số.`],
        [(1 + P(t.p)) * (1 + P(t.d)) * 100 - 100, 'R530', `Hiểu ngược giảm giá thành tăng giá ${t.d}%.`],
        [(1 + P(t.p)) * (1 - P(t.d)) * 100, 'R528', 'Tính giá bán mới bằng bao nhiêu phần trăm giá vốn rồi ghi luôn, quên trừ 100%.'],
        [t.p + t.d, 'R526', `Cộng thẳng ${t.p}% + ${t.d}% thay vì nhân hai tỉ số.`],
        [(1 - P(t.d)) * 100, 'R101', `Chỉ lấy phần trăm còn lại sau giảm (${100 - t.d}%), bỏ qua giá vốn.`],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'gg_1_tien': { // G, p, d: tiền lãi còn lại
      const Bt = t.G * (1 + P(t.p)), Bm = Bt * (1 - P(t.d)), dung = Bm - t.G
      return { kind: 'tien', dung, ds: [
        [t.G * P(t.p - t.d), 'R526', `Lấy ${t.p}% − ${t.d}% rồi tính trên giá vốn thay vì nhân hai tỉ số.`],
        [t.G * P(t.p), 'R539', 'Mới tính tiền lãi ngày thường rồi dừng, chưa tính phần giảm giá.'],
        [Bm, 'R537', 'Ghi giá bán sau giảm (cả gốc lẫn lãi) làm tiền lãi.'],
        [Bt * (1 + P(t.d)) - t.G, 'R530', `Hiểu ngược giảm giá thành tăng giá ${t.d}%.`],
        [Bt * P(t.d), 'R408', 'Chỉ tính số tiền được giảm, chưa lấy tiền lãi trừ đi.'],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'gg_2_pt': { // q, d: giảm d% còn lãi q% ⇒ niêm yết lãi p%
      const dung = (1 + P(t.q)) / (1 - P(t.d)) * 100 - 100
      return { kind: 'lai', dung, ds: [
        [t.q + t.d, 'R526', `Cộng thẳng ${t.q}% + ${t.d}% thay vì chia cho ${100 - t.d}%.`],
        [(1 + P(t.q)) / (1 + P(t.d)) * 100 - 100, 'R530', `Hiểu ngược giảm giá thành tăng giá ${t.d}%.`],
        [(1 + P(t.q)) / (1 - P(t.d)) * 100, 'R528', 'Tính giá niêm yết bằng bao nhiêu phần trăm giá vốn rồi ghi luôn, quên trừ 100%.'],
        [(1 + P(t.q)) * (1 + P(t.d)) * 100 - 100, 'R525', `Nhân với ${100 + t.d}% thay vì chia cho ${100 - t.d}%.`],
        [t.q - t.d, 'R526', `Trừ thẳng ${t.q}% − ${t.d}% thay vì chia cho ${100 - t.d}%.`],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    case 'gg_2_tien': { // G, q, d: giá niêm yết
      const Bg = t.G * (1 + P(t.q)), dung = Bg / (1 - P(t.d))
      return { kind: 'tien', dung, ds: [
        [t.G * (1 + P(t.q + t.d)), 'R526', `Cộng thẳng ${t.q}% + ${t.d}% rồi lấy trên giá gốc.`],
        [Bg, 'R539', 'Mới tính giá bán sau giảm rồi dừng, chưa tìm giá niêm yết.'],
        [Bg / (1 + P(t.d)), 'R530', `Hiểu ngược giảm giá thành tăng giá ${t.d}%.`],
        [Bg * (1 - P(t.d)), 'R525', `Nhân với ${100 - t.d}% thay vì chia cho ${100 - t.d}%.`],
        [Bg * (1 + P(t.d)), 'R407', `Cộng thêm ${t.d}% vào giá bán sau giảm thay vì chia.`],
        [dung * 10, 'R540', 'Làm đúng cách nhưng lệch một hàng ở kết quả cuối.'] ] }
    }
    default: throw new Error('mẫu chưa có: ' + mau)
  }
}

function hopLe(kind, dung, v) {
  if (!Number.isFinite(v) || v <= 0) return false
  if (Math.abs(sap(v) - sap(dung)) < 1e-6) return false
  if (v / dung > 100 || v / dung < 0.01) return false
  return kind === 'tien' ? money(v) : pcOk(sap(v))
}
const viet = { tien, pct, lai: lai }

export function nhieuCuaCau(c) {
  const { kind, dung, ds } = duongSai(c.mau, c.tham_so)
  const thuong = ds.filter((d) => d[1] !== 'R540'), dp = ds.filter((d) => d[1] === 'R540')
  // xáo thứ tự các rule thường (hạt giống cố định) để rule phân bố đều; R540 luôn cuối
  for (let i = thuong.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [thuong[i], thuong[j]] = [thuong[j], thuong[i]] }
  const ra = [], rules = new Set(), vals = []
  for (const [v, rule, d] of [...thuong, ...dp]) {
    if (ra.length >= 6) break
    if (rules.has(rule) || !hopLe(kind, dung, v) || vals.some((x) => Math.abs(x - sap(v)) < 1e-6)) continue
    rules.add(rule); vals.push(sap(v)); ra.push({ text: viet[kind](v), rule, duong_sai: d })
  }
  return ra
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-c1-mcq.mjs')) {
  const a = process.argv.slice(2), i = a.indexOf('--ra')
  const ra = i >= 0 ? a[i + 1] : 'kho-rules/dai/clone/k5T-pt-c1-mcq.json'
  const lo = JSON.parse(readFileSync(new URL('../../../kho-rules/dai/clone/k5T-pt-c1.json', import.meta.url), 'utf8'))
  const out = [], bo = []
  for (const c of lo) {
    const nhieu = nhieuCuaCau(c)
    if (nhieu.length >= 4 && new Set(nhieu.map((n) => n.rule)).size >= 3) out.push({ noi_dung: c.noi_dung, nhieu })
    else bo.push(`${c.mau} ${c.noi_dung.slice(0, 60)} → chỉ ${nhieu.length}`)
  }
  mkdirSync(dirname(ra), { recursive: true }); writeFileSync(ra, JSON.stringify(out, null, 1), 'utf8')
  console.log(`${lo.length} câu → ${out.length} câu có ≥4 ứng viên · bỏ ${bo.length}`); bo.slice(0, 20).forEach((x) => console.log('  ✘', x))
}
