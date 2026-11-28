// ============================================================================
// k5T-pt-fill-C-mcq.mjs — PHƯƠNG ÁN NHIỄU MCQ cho lô fill C (165 câu, 6 dạng NDB02777/02778/03004/03005/03006/03007).
// Máy MCQ chung không đọc được đáp số có đơn vị / % / hướng ⇒ đường riêng (xem k5T-pt-mcq-kiem.mjs).
// Mỗi nhiễu = KẾT QUẢ THẬT của một đường sai có tên: bộ sinh ĐỌC LẠI CHỮ CỦA ĐỀ, tính đường sai bằng code, định dạng cùng khuôn `dap_an`.
//   node scripts/kho/clone/k5T-pt-fill-C-mcq.mjs [lo.json] --ra kho-rules/dai/clone/k5T-pt-fill-C-mcq.json
// Câu không đủ ≥ 4 ứng viên hợp lệ (≥ 3 rule khác nhau) bị LOẠI khỏi file và liệt kê ra màn hình.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { kiemUngVien, chonNhieu } from './k5T-pt-mcq-kiem.mjs'

const RULE = new Map(['R100', 'R101', 'R407', 'R408', 'R409', 'R525', 'R526', 'R527', 'R528', 'R529', 'R530', 'R531', 'R532', 'R533', 'R534', 'R535', 'R536', 'R537', 'R539', 'R540'].map((m) => [m, { ma: m, du_phong: m === 'R540' }]))

// ── định dạng ────────────────────────────────────────────────────────────────────────────────────────────────────
const tidy = (v, k = 2) => Number.isFinite(v) && Math.abs(v * 10 ** k - Math.round(v * 10 ** k)) < 1e-6 * Math.max(1, Math.abs(v) * 10 ** k)
const f = (v) => String(Math.round(v * 100) / 100).replace('.', ',')
const fi = (v) => String(Math.round(v))
const pcs = (s) => Number(s.replace(',', '.'))

/** đọc đề */
function doc(d) {
  const num = (s) => Number(s.replace(/ /g, '').replace(',', '.'))
  return {
    M: [...d.matchAll(/(\d+(?:,\d+)?) (g|kg|tấn)(?![\p{L}])/gu)].map((m) => num(m[1])),
    U: (d.match(/(\d+(?:,\d+)?) (g|kg|tấn)(?![\p{L}])/u) || [])[2],
    P: [...d.matchAll(/(\d+(?:,\d+)?)%/g)].map((m) => num(m[1])),
    T: [...d.matchAll(/(\d{1,3}(?: \d{3})+|\d+) đồng/g)].map((m) => num(m[1])),
    S: [...d.matchAll(/(tăng|giảm) (\d+(?:,\d+)?)%/g)].map((m) => ({ s: m[1] === 'tăng' ? 1 : -1, a: num(m[2]) })),
    Q: (() => { const m = d.match(/(\d{1,3}(?: \d{3})+|\d+) (người|tấn|lượt khách|chiếc xe máy|quyển sách)(?![\p{L}])/u); return m ? num(m[1]) : null })(),
    n: (() => { const m = d.match(/(?:sau|kỳ hạn) (\d+) (?:tháng|năm)/); return m ? Number(m[1]) : null })(),
  }
}

/** sinh danh sách ứng viên thô cho 1 câu: [{rule, ds, v}] — v: số | {t:1|-1, x} | [X,Y] */
function ungVien(c) {
  const d = c.noi_dung, { M, P, T, S, Q, n } = doc(d), mau = c.mau, K = []
  const add = (rule, ds, v) => K.push({ rule, ds, v })
  const E = (a, b) => Math.abs(a - b) < 1e-9
  const sx = (x) => x * 10  // R540 helper
  switch (mau) {
    case 'tr_a': case 'tr_b': case 'tr_e': case 'tr_f': {
      const nuoc = mau === 'tr_f'
      let m, a
      if (mau === 'tr_b') { m = M.slice(0, 3); a = P.slice(0, 3) }
      else if (mau === 'tr_e') { m = [M[0], M[0] * P[2] / 100]; a = P.slice(0, 2) }
      else { m = M.slice(0, 2); a = P.slice(0, 2) }
      const Tt = m.reduce((s, x) => s + x, 0), C = m.reduce((s, x, i) => s + x * a[i] / 100, 0), p = C / Tt * 100
      const out = (v) => (nuoc ? 100 - v : v)
      add('R532', nuoc ? 'Lấy trung bình cộng các tỉ số phần trăm nước, không tính theo khối lượng từng phần' : 'Lấy trung bình cộng các tỉ số phần trăm của các phần, không tính theo khối lượng', nuoc ? 100 - a.reduce((s, x) => s + x, 0) / a.length : a.reduce((s, x) => s + x, 0) / a.length)
      { const sum = a.reduce((s, x) => s + x, 0), cc = nuoc ? a.map((x) => 100 - x) : a, sm = cc.reduce((s, x) => s + x, 0)
        add('R526', 'Cộng thẳng các tỉ số phần trăm của các phần thay vì tính theo khối lượng', sm <= 100 ? sm : Math.abs(cc[0] - cc[1]))
        add('R526', 'Trừ thẳng hai tỉ số phần trăm đầu thay vì tính theo khối lượng', Math.abs(cc[0] - cc[1]))
        const T2 = m[0] - m.slice(1).reduce((s, x) => s + x, 0); if (T2 > 0) add('R407', 'Trừ (thay vì cộng) khối lượng các phần khi tính khối lượng hỗn hợp', out(C / T2 * 100)); void sum }
      add('R527', 'Chia lượng chất tan cho khối lượng của phần thứ nhất thay vì cho cả hỗn hợp', nuoc ? 100 - C / m[0] * 100 : C / m[0] * 100)
      add('R527', 'Chia lượng chất tan cho khối lượng của phần cuối thay vì cho cả hỗn hợp', nuoc ? 100 - C / m[m.length - 1] * 100 : C / m[m.length - 1] * 100)
      if (nuoc) add('R101', 'Dừng ở tỉ số phần trăm chất tan, quên lấy 100% trừ đi để ra phần nước', p)
      else add('R101', 'Lấy 100% trừ đi tỉ số phần trăm tìm được (nhầm sang phần không phải chất tan)', 100 - p)
      const sw = m.map((_, i) => m[(i + 1) % m.length])
      add('R529', 'Ghép nhầm khối lượng của phần này với tỉ số phần trăm của phần kia', out(sw.reduce((s, x, i) => s + x * a[i] / 100, 0) / Tt * 100))
      if (mau === 'tr_e') { const m2 = M[0] / (P[2] / 100), C2 = M[0] * a[0] / 100 + m2 * a[1] / 100; add('R525', 'Tìm khối lượng loại hai bằng cách chia (thay vì nhân) với phần trăm đề cho', C2 / (M[0] + m2) * 100) }
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', out(p) * 10)
      break
    }
    case 'ng_a': case 'ng_g': {
      const g = mau === 'ng_g'
      let Tt, mm, a1, m2, ms, Tm
      if (g) { ms = M[0]; m2 = M[1]; Tt = ms + m2; a1 = P[0]; mm = P[1] } else { ms = M[1]; Tt = M[0]; m2 = Tt - ms; a1 = P[1]; mm = P[0] }
      Tm = Tt * mm / 100; const Ca = ms * a1 / 100, b = (Tm - Ca) / m2 * 100
      add('R407', 'Cộng (thay vì trừ) lượng chất tan của phần đã biết vào lượng chất tan của hỗn hợp', (Tm + Ca) / m2 * 100)
      add('R527', 'Chia lượng chất tan còn lại cho khối lượng cả hỗn hợp thay vì cho khối lượng phần còn lại', (Tm - Ca) / Tt * 100)
      add('R532', 'Coi hỗn hợp là trung bình cộng hai nồng độ nên lấy 2 lần nồng độ hỗn hợp trừ nồng độ đã biết', 2 * mm - a1)
      add('R529', 'Chia lượng chất tan còn lại cho khối lượng phần đã biết (chia nhầm vai trò)', (Tm - Ca) / ms * 100)
      add('R101', 'Lấy 100% trừ đi tỉ số phần trăm tìm được', 100 - b)
      add('R526', 'Cộng thẳng hai tỉ số phần trăm (nồng độ hỗn hợp + nồng độ phần đã biết)', mm + a1)
      add('R526', 'Trừ thẳng hai tỉ số phần trăm (nồng độ hỗn hợp − nồng độ phần đã biết)', Math.abs(mm - a1))
      add('R533', 'Lấy khối lượng phần còn lại làm lượng chất tan rồi chia cho khối lượng hỗn hợp', m2 / Tt * 100)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', b / 10)
      break
    }
    case 'ng_b'
: case 'ng_h': {
      const m1 = M[0], a = P[0], b = P[1], m = P[2], dA = Math.abs(m - a), dB = Math.abs(b - m), X = m1 * dA / 100, Y = m1 * dA / dB
      if (mau === 'ng_b') {
        add('R529', 'Đảo vai trò hai chỗ chênh lệch: lấy khối lượng nhân chênh lệch của loại kia rồi chia cho chênh lệch của loại này', m1 * dB / dA)
        add('R408', 'Dừng ở lượng chất tan chênh lệch, quên chia cho phần trăm chênh lệch của loại thứ hai', X)
        add('R407', 'Chia lượng chất tan chênh lệch cho hiệu hai nồng độ (b − a) thay vì cho chênh lệch với hỗn hợp', X / (Math.abs(b - a) / 100))
        add('R532', 'Coi hai loại có khối lượng bằng nhau vì lấy trung bình nồng độ', m1)
        add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', Y * 10)
      } else {
        add('R531', 'Chỉ tìm khối lượng loại thứ hai, quên cộng thêm khối lượng loại thứ nhất', Y)
        add('R408', 'Cộng khối lượng loại thứ nhất với lượng chất tan chênh lệch (dừng ở bước giữa)', m1 + X)
        add('R529', 'Đảo vai trò hai chỗ chênh lệch khi tìm loại thứ hai rồi cộng loại thứ nhất', m1 + m1 * dB / dA)
        add('R407', 'Trừ (thay vì cộng) khối lượng loại thứ hai khỏi loại thứ nhất', m1 - Y)
        add('R532', 'Coi hai loại có khối lượng bằng nhau nên tổng gấp đôi loại thứ nhất', 2 * m1)
        add('R540', 'Lệch một hàng ở bước cộng cuối (dịch dấu phẩy)', (m1 + Y) * 10)
      }
      break
    }
    case 'ng_c': {
      const Tt = M[0], a = P[0], b = P[1], m = P[2], Ca = Tt * a / 100, Cm = Tt * m / 100, D = Cm - Ca, Y = D / ((b - a) / 100), X = Tt - Y
      add('R529', 'Gán nhầm hai khối lượng cho hai loại (đảo vai trò)', [Y, X])
      const Y1 = D / (b / 100); add('R407', 'Chia lượng chất tan còn thiếu cho nồng độ loại đậm thay vì cho phần chênh hai nồng độ', [Tt - Y1, Y1])
      add('R408', 'Lấy luôn lượng chất tan còn thiếu làm khối lượng loại đậm, quên chia cho phần chênh nồng độ', [Tt - D, D])
      add('R532', 'Coi mỗi loại chiếm một nửa hỗn hợp vì lấy trung bình', [Tt / 2, Tt / 2])
      add('R540', 'Lệch một hàng ở khối lượng loại đậm (dịch dấu phẩy)', [X, Y * 10])
      break
    }
    case 'pl_a': { const [Mm, w] = M, a = P[0], C = Mm * a / 100, p = C / (Mm + w) * 100
      add('R533', 'Cộng nước thêm vào cả lượng chất tan lẫn khối lượng dung dịch', (C + w) / (Mm + w) * 100)
      add('R527', 'Chia lượng chất tan cho khối lượng nước thêm vào thay vì khối lượng dung dịch mới', C / w * 100)
      add('R408', 'Giữ nguyên nồng độ cũ, bỏ bước chia lại cho khối lượng dung dịch mới', a)
      add('R101', 'Lấy 100% trừ tỉ số phần trăm tìm được', 100 - p)
      add('R407', 'Trừ (thay vì cộng) khối lượng nước thêm vào khối lượng dung dịch', C / (Mm - w) * 100)
      add('R529', 'Đảo tỉ số: tưởng thêm nước thì nồng độ tăng theo tỉ số khối lượng mới : khối lượng cũ', a * (Mm + w) / Mm)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', p * 10); break }
    case 'pl_b': { const [Mm] = M, [a, b] = P, C = Mm * a / 100, Tt = C / (b / 100), w = Tt - Mm
      add('R408', 'Dừng ở khối lượng dung dịch lúc sau, quên trừ khối lượng lúc đầu', Tt)
      add('R526', 'Lấy khối lượng dung dịch nhân hiệu hai tỉ số phần trăm (trừ thẳng a% − b%)', Mm * (a - b) / 100)
      add('R533', 'Lấy luôn lượng chất tan làm khối lượng nước cần thêm', C)
      add('R529', 'Đảo tỉ số: khối lượng lúc sau tính bằng M × b : a thay vì M × a : b', Math.abs(Mm * b / a - Mm))
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', w * 10); break }
    case 'pl_c': { const [Mm, w] = M, a = P[0], C = Mm * a / 100, p = C / (Mm - w) * 100
      add('R408', 'Giữ nguyên nồng độ cũ, bỏ bước chia lại cho khối lượng dung dịch còn lại', a)
      add('R407', 'Cộng (thay vì trừ) lượng nước bay hơi vào khối lượng dung dịch', C / (Mm + w) * 100)
      add('R527', 'Chia lượng chất tan cho khối lượng nước đã bay hơi', C / w * 100)
      add('R101', 'Lấy 100% trừ đi tỉ số phần trăm tìm được', 100 - p)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', p / 10); break }
    case 'pl_d': { const [Mm] = M, [a, b] = P, C = Mm * a / 100, Tt = C / (b / 100), w = Mm - Tt
      add('R408', 'Dừng ở khối lượng dung dịch còn lại, quên lấy khối lượng đầu trừ đi', Tt)
      add('R526', 'Lấy khối lượng dung dịch nhân hiệu hai tỉ số phần trăm (trừ thẳng b% − a%)', Mm * (b - a) / 100)
      add('R533', 'Lấy luôn lượng chất tan làm khối lượng nước bay hơi', C)
      add('R525', 'Nhân (thay vì chia) lượng chất tan với tỉ số phần trăm mới rồi lấy khối lượng đầu trừ đi', Mm - C * b / 100)
      add('R407', 'Cộng (thay vì trừ) khối lượng lúc sau với khối lượng lúc đầu', Mm + Tt)
      add('R540', 'Lệch một hàng ở bước chia (dịch dấu phẩy)', w / 10); break }
    case 'pl_e': { const [Mm, s] = M, a = P[0], C = Mm * a / 100, p = (C + s) / (Mm + s) * 100
      add('R527', 'Chia lượng chất tan lúc sau cho khối lượng dung dịch lúc đầu', (C + s) / Mm * 100)
      add('R531', 'Quên cộng lượng chất tan thêm vào, chỉ cộng vào khối lượng dung dịch', C / (Mm + s) * 100)
      add('R533', 'Coi lượng chất tan lúc sau chỉ là phần thêm vào', s / (Mm + s) * 100)
      add('R101', 'Lấy 100% trừ đi tỉ số phần trăm tìm được', 100 - p)
      add('R408', 'Giữ nguyên nồng độ cũ, bỏ bước tính lại sau khi thêm chất tan', a)
      add('R407', 'Trừ (thay vì cộng) lượng chất tan thêm vào khối lượng dung dịch', (C + s) / (Mm - s) * 100)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', p / 10); break }
    case 'pl_f': { const [Mm] = M, [a, b] = P, W = Mm * (100 - a) / 100, Tt = W / ((100 - b) / 100), s = Tt - Mm
      add('R408', 'Dừng ở khối lượng lúc sau, quên trừ khối lượng lúc đầu', Tt)
      add('R526', 'Lấy khối lượng nhân hiệu hai tỉ số phần trăm (trừ thẳng b% − a%)', Mm * (b - a) / 100)
      add('R525', 'Nhân (thay vì chia) phần còn lại với tỉ số phần trăm mới rồi lấy khối lượng đầu trừ đi', Math.abs(Mm - W * (100 - b) / 100))
      add('R101', 'Chia khối lượng phần còn lại cho b% thay vì cho (100% − b%)', W / (b / 100) - Mm)
      add('R407', 'Cộng (thay vì trừ) khối lượng lúc sau với khối lượng lúc đầu', Tt + Mm)
      add('R533', 'Lấy luôn khối lượng phần còn lại (không đổi) làm lượng chất tan cần thêm', W)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', s / 10); break }
    case 'pl_g': { const [w] = M, [a, b] = P, Mm = w * b / (a - b)
      add('R408', 'Dừng ở khối lượng dung dịch lúc sau, quên trừ phần nước thêm', w * a / (a - b))
      add('R525', 'Nhân (thay vì chia) khối lượng nước thêm với phần chênh lệch số lần', w * (a / b - 1))
      add('R526', 'Chia khối lượng nước thêm cho hiệu hai tỉ số phần trăm (a% − b%)', w / ((a - b) / 100))
      add('R533', 'Lấy khối lượng nước thêm chia cho tỉ số phần trăm chất tan lúc đầu', w / (a / 100))
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', Mm * 10); break }
    case 'pl_h': { const [w] = M, [a, b] = P, Mm = w * b / (b - a)
      add('R408', 'Dừng ở khối lượng dung dịch lúc sau, quên cộng phần nước bay hơi', Mm - w)
      add('R525', 'Nhân (thay vì chia) khối lượng nước bay hơi với phần chênh lệch số lần', w * (1 - a / b))
      add('R526', 'Chia khối lượng nước bay hơi cho hiệu hai tỉ số phần trăm (b% − a%)', w / ((b - a) / 100))
      add('R533', 'Lấy khối lượng nước bay hơi chia cho tỉ số phần trăm chất tan lúc sau', w / (b / 100))
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', Mm / 10); break }
    case 'hk_a': { const [Mm] = M, [a, c] = P, x = 100 - a, y = 100 - c, Dd = Mm * x / 100, Kk = Dd / (y / 100)
      add('R534', 'Dùng phần trăm nước thay cho phần trăm chất khô khi quy đổi', Mm * (a / 100) / (c / 100))
      add('R408', 'Dừng ở khối lượng chất khô, quên chia cho phần trăm chất khô của hạt khô', Dd)
      add('R525', 'Nhân (thay vì chia) khối lượng chất khô với phần trăm chất khô của hạt khô', Dd * y / 100)
      add('R529', 'Đảo tỉ số hai phần trăm chất khô: nhân M với y rồi chia cho x', Mm * y / x)
      add('R101', 'Chia khối lượng chất khô cho phần trăm nước của hạt khô thay vì phần trăm chất khô', Dd / (c / 100))
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', Kk * 10); break }
    case 'hk_b': { const [K0] = M, [a, c] = P, x = 100 - a, y = 100 - c, Dk = K0 * y / 100, Tu = Dk / (x / 100)
      add('R534', 'Dùng phần trăm nước thay cho phần trăm chất khô khi quy đổi', K0 * (c / 100) / (a / 100))
      add('R408', 'Dừng ở khối lượng chất khô, quên chia cho phần trăm chất khô của hạt tươi', Dk)
      add('R525', 'Nhân (thay vì chia) khối lượng chất khô với phần trăm chất khô của hạt tươi', Dk * x / 100)
      add('R529', 'Đảo tỉ số hai phần trăm chất khô: nhân K với x rồi chia cho y', K0 * x / y)
      add('R101', 'Chia khối lượng chất khô cho phần trăm nước của hạt tươi thay vì phần trăm chất khô', Dk / (a / 100))
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', Tu / 10); break }
    case 'hk_c': { const [Mm] = M, [a, c] = P, x = 100 - a, y = 100 - c, Dd = Mm * x / 100, Kk = Dd / (y / 100), bay = Mm - Kk
      add('R408', 'Dừng ở khối lượng hạt khô, quên lấy khối lượng hạt tươi trừ đi', Kk)
      add('R534', 'Lấy nước của hạt tươi làm lượng nước bay hơi (quên phần nước còn lại trong hạt khô)', Mm * a / 100)
      add('R407', 'Cộng (thay vì trừ) khối lượng hạt khô vào khối lượng hạt tươi', Mm + Kk)
      add('R525', 'Nhân (thay vì chia) khối lượng chất khô với phần trăm chất khô rồi lấy hạt tươi trừ đi', Mm - Dd * y / 100)
      add('R540', 'Lệch một hàng ở bước trừ cuối (dịch dấu phẩy)', bay * 10); break }
    case 'hk_d': case 'hk_e': {
      const Mm = M[0], a = P[0], Kk = mau === 'hk_d' ? M[1] : M[0] - M[1], Dd = Mm * (100 - a) / 100, y = Dd / Kk * 100, c = 100 - y
      add('R408', 'Dừng ở phần trăm chất khô của hạt khô, quên lấy 100% trừ đi', y)
      add('R527', 'Cho rằng phần trăm nước không đổi so với hạt tươi', a)
      add('R101', 'Lấy phần trăm chất khô của hạt tươi làm phần trăm nước', 100 - a)
      add('R534', 'Coi phần nước bay hơi là phần trăm nước của hạt khô', (Mm - Kk) / Mm * 100)
      add('R529', 'Chia khối lượng hạt khô cho khối lượng hạt tươi (đảo vai trò)', Kk / Mm * 100)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', c * 10); break }
    case 'hk_f': { const [Mm, Kk] = M, c = P[0], y = 100 - c, Dk = Kk * y / 100, x = Dk / Mm * 100, a = 100 - x
      add('R408', 'Dừng ở phần trăm chất khô của hạt tươi, quên lấy 100% trừ đi', x)
      add('R534', 'Coi phần nước bay hơi là phần trăm nước của hạt tươi', (Mm - Kk) / Mm * 100)
      add('R529', 'Chia khối lượng hạt khô cho khối lượng hạt tươi (đảo vai trò)', Kk / Mm * 100)
      add('R527', 'Chia chất khô cho khối lượng hạt khô thay vì hạt tươi', Dk / Kk * 100)
      add('R101', 'Lấy luôn phần trăm nước của hạt khô làm phần trăm nước của hạt tươi', c)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', a / 10); break }
    case 'hk_g1': case 'hk_g2': {
      const [a, c] = P, x = 100 - a, y = 100 - c, kp = x / y * 100, gi = 100 - kp, giam = mau === 'hk_g2'
      if (giam) {
        add('R528', 'Ghi luôn khối lượng hạt khô bằng bao nhiêu phần trăm mà không lấy 100% trừ đi', kp)
        add('R526', 'Trừ thẳng hai tỉ số phần trăm nước (a% − c%)', a - c)
        add('R408', 'Dừng ở phần trăm chất khô của hạt tươi', x)
        add('R529', 'Đảo tỉ số hai phần trăm chất khô (y : x) rồi trừ đi 100%', y / x * 100 - 100)
        add('R540', 'Lệch một hàng ở bước trừ cuối (dịch dấu phẩy)', gi / 10)
      } else {
        add('R529', 'Đảo tỉ số hai phần trăm chất khô (y : x)', y / x * 100)
        add('R534', 'Dùng phần trăm nước thay cho phần trăm chất khô khi lập tỉ số', a / c * 100)
        add('R101', 'Lấy phần khối lượng đã giảm thay vì phần còn lại', gi)
        add('R408', 'Dừng ở phần trăm chất khô của hạt tươi', x)
        add('R526', 'Trừ thẳng hai tỉ số phần trăm nước (a% − c%)', a - c)
        add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', kp / 10)
      }
      break
    }
    case 'tg_a': case 'tg_c1': {
      const nn = S.length, fs = S.map((o) => 100 + o.s * o.a); let kp = 100; for (const q of fs) kp = kp * q / 100
      const ch = kp - 100, tang = ch > 0, net = S.reduce((s, o) => s + o.s * o.a, 0)
      let part = 100; for (const q of fs.slice(0, nn - 1)) part = part * q / 100
      add('R526', 'Cộng/trừ thẳng các tỉ số phần trăm thay vì nhân các tỉ số', { t: net > 0 ? 1 : -1, x: Math.abs(net) })
      add('R528', 'Ghi luôn giá trị cuối bằng bao nhiêu phần trăm giá trị đầu mà quên trừ 100%', { t: tang ? 1 : -1, x: kp })
      add('R530', 'Hiểu ngược chiều: tưởng tăng thành giảm (hoặc ngược lại) khi so sánh với lúc đầu', { t: tang ? -1 : 1, x: Math.abs(ch) })
      add('R539', 'Dừng sau các lần thay đổi đầu, bỏ sót lần thay đổi cuối cùng', { t: part - 100 > 0 ? 1 : -1, x: Math.abs(part - 100) })
      add('R540', 'Lệch một hàng ở bước trừ cuối (dịch dấu phẩy)', { t: tang ? 1 : -1, x: Math.abs(ch) * 10 })
      break
    }
    case 'tg_b': case 'tg_c2': case 'tg_d': {
      const M0 = mau === 'tg_d' ? Q : T[0], nn = S.length, gia = [M0]
      for (const o of S) gia.push(gia[gia.length - 1] * (100 + o.s * o.a) / 100)
      const fin = gia[nn], lastO = S[nn - 1], net = S.reduce((s, o) => s + o.s * o.a, 0)
      add('R526', 'Cộng/trừ thẳng các tỉ số phần trăm rồi nhân với giá trị đầu', M0 * (100 + net) / 100)
      add('R539', 'Dừng sau các lần thay đổi đầu, bỏ sót lần thay đổi cuối cùng', gia[nn - 1])
      let alt = M0; for (const o of S) alt = alt * (100 - o.s * o.a) / 100
      add('R530', 'Hiểu ngược chiều từng lần: tăng thành giảm, giảm thành tăng', alt)
      add('R527', 'Tính phần trăm của lần cuối trên giá trị đầu thay vì trên giá trị ngay trước', gia[nn - 1] + lastO.s * M0 * lastO.a / 100)
      add('R525', 'Chia (thay vì nhân) giá trị lần trước cho tỉ số phần trăm của lần cuối', gia[nn - 1] / ((100 + lastO.s * lastO.a) / 100))
      add('R540', 'Lệch một hàng ở bước nhân cuối (dịch dấu phẩy)', fin / 10)
      add('R540', 'Lệch một hàng ở bước nhân cuối (dịch dấu phẩy)', fin * 10)
      break
    }
    case 'tg_e': {
      const N = T[0], nn = S.length; let pr = 1; for (const o of S) pr *= (100 + o.s * o.a) / 100
      const net = S.reduce((s, o) => s + o.s * o.a, 0); let alt = 1; for (const o of S) alt *= (100 - o.s * o.a) / 100
      const Mm = N / pr, lastF = (100 + S[nn - 1].s * S[nn - 1].a) / 100
      add('R525', 'Nhân (thay vì chia) giá cuối với các tỉ số phần trăm', N * pr)
      add('R526', 'Cộng/trừ thẳng các tỉ số phần trăm rồi chia giá cuối cho tỉ số đó', N / ((100 + net) / 100))
      add('R530', 'Hiểu ngược chiều từng lần tăng giảm rồi chia giá cuối', N / alt)
      add('R408', 'Chỉ chia giá cuối cho tỉ số của lần thay đổi cuối, bỏ sót các lần trước', N / lastF)
      add('R408', 'Chỉ chia giá cuối cho tỉ số của lần thay đổi đầu, bỏ sót lần sau', N / ((100 + S[0].s * S[0].a) / 100))
      add('R525', 'Nhân giá cuối với tỉ số của lần thay đổi cuối thay vì chia', N * lastF)
      add('R526', 'Cộng/trừ thẳng các tỉ số rồi nhân (thay vì chia) với giá cuối', N * (100 + net) / 100)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', Mm / 10)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', Mm * 10)
      break
    }
    case 'tg_f': {
      const o = S[0], a = o.a, tang = o.s === 1, r = tang ? a / (100 + a) * 100 : a / (100 - a) * 100, hd = tang ? -1 : 1
      add('R527', 'Lấy luôn phần trăm đề cho (tính trên giá cũ) làm phần trăm cần đổi, không tính trên giá mới', { t: hd, x: a })
      add('R530', 'Đảo chiều: tăng thì phải tăng tiếp (hoặc giảm thì giảm tiếp) thay vì ngược lại', { t: -hd, x: r })
      add('R528', 'Ghi giá mới bằng bao nhiêu phần trăm giá cũ mà quên so sánh với phần cần đổi', { t: hd, x: tang ? 100 + a : 100 - a })
      add('R101', 'Lấy 100% trừ đi tỉ số phần trăm tìm được', { t: hd, x: 100 - r })
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', { t: hd, x: r / 10 })
      break
    }
    case 'ls_a1': case 'ls_a2': {
      const Mm = T[0], r = P[0], L1 = Mm * r / 100, L = L1 * n, lai = mau === 'ls_a1', cg = Mm * (1 + r / 100) ** n
      add('R535', 'Chỉ tính lãi của một năm, quên nhân với số năm gửi', lai ? L1 : Mm + L1)
      add('R535', 'Nhân tiền lãi một năm với (số năm + 1) thay vì số năm', lai ? L1 * (n + 1) : Mm + L1 * (n + 1))
      add('R535', 'Nhân tiền lãi một năm với (số năm − 1) thay vì số năm', lai ? L1 * (n - 1) : Mm + L1 * (n - 1))
      add('R537', lai ? 'Cộng thêm tiền gốc vào tiền lãi (nhầm sang cả gốc lẫn lãi)' : 'Chỉ lấy tiền lãi, quên cộng tiền gốc', lai ? Mm + L : L)
      add('R536', 'Tính lãi như lãi nhập vốn (lãi năm sau tính trên cả vốn lẫn lãi)', lai ? cg - Mm : cg)
      if (!lai) add('R539', 'Dừng ở tiền lãi một năm, chưa nhân số năm và chưa cộng gốc', L1)
      add('R540', 'Lệch một hàng ở bước tính cuối (dịch dấu phẩy)', (lai ? L : Mm + L) / 10)
      break
    }
    case 'ls_b': {
      const Mm = T[0], r = P[0], L1 = Mm * r / 100, L = L1 * n
      add('R535', 'Chỉ tính lãi của một tháng, quên nhân với số tháng gửi', Mm + L1)
      add('R535', 'Nhân tiền lãi một tháng với (số tháng + 1) thay vì số tháng', Mm + L1 * (n + 1))
      add('R535', 'Nhân tiền lãi một tháng với (số tháng − 1) thay vì số tháng', Mm + L1 * (n - 1))
      add('R537', 'Chỉ lấy tiền lãi, quên cộng tiền gốc', L)
      add('R536', 'Tính lãi như lãi nhập vốn (lãi tháng sau tính trên cả vốn lẫn lãi)', Mm * (1 + r / 100) ** n)
      add('R539', 'Dừng ở tiền lãi một tháng, chưa nhân số tháng và chưa cộng gốc', L1)
      add('R540', 'Lệch một hàng ở bước cộng cuối (dịch dấu phẩy)', (Mm + L) / 10)
      break
    }
    case 'ls_c': {
      const Mm = T[0], r = P[0], L1 = Mm * r / 100, L = L1 * n / 12, tong = /cả gốc lẫn lãi/.test(d)
      add('R535', 'Lấy tiền lãi của cả năm, không đổi số tháng ra năm', tong ? Mm + L1 : L1)
      add('R535', 'Nhân tiền lãi một năm với số tháng (coi số tháng là số năm)', tong ? Mm + L1 * n : L1 * n)
      add('R537', tong ? 'Chỉ lấy tiền lãi, quên cộng tiền gốc' : 'Cộng thêm tiền gốc vào tiền lãi (nhầm sang cả gốc lẫn lãi)', tong ? L : Mm + L)
      add('R529', 'Đổi tháng ra năm bị ngược: lấy 12 chia số tháng thay vì số tháng chia 12', tong ? Mm + L1 * 12 / n : L1 * 12 / n)
      add('R540', 'Lệch một hàng ở bước tính cuối (dịch dấu phẩy)', (tong ? Mm + L : L) / 10)
      break
    }
    case 'ls_d': case 'ls_e': {
      const Mm = T[0], r = P[0], vs = [Mm]; for (let i = 0; i < n; i++) vs.push(vs[i] * (1 + r / 100))
      add('R536', 'Tính lãi đơn: mỗi kỳ đều tính lãi trên số tiền gốc ban đầu', Mm * (1 + r / 100 * n))
      add('R537', 'Chỉ lấy tổng tiền lãi, quên cộng tiền gốc', vs[n] - Mm)
      add('R539', 'Dừng ở số tiền sau kỳ gần cuối, bỏ sót kỳ cuối cùng', vs[n - 1])
      add('R535', 'Chỉ tính lãi một kỳ rồi cộng vào gốc, quên các kỳ sau', Mm * (1 + r / 100))
      add('R536', 'Tính lãi đơn rồi trừ đi tiền gốc (nhầm với tiền lãi)', Mm * r / 100 * n)
      add('R540', 'Lệch một hàng ở bước cộng cuối (dịch dấu phẩy)', vs[n] / 10)
      break
    }
    case 'ls_f': {
      const L = T[0], r = P[0], Mm = L / (r / 100)
      add('R537', 'Coi tiền lãi là cả gốc lẫn lãi nên chia cho (100% + lãi suất)', L / (1 + r / 100))
      add('R407', 'Tìm đúng tiền gốc rồi cộng thêm cả tiền lãi (cộng thay vì dừng)', Mm + L)
      add('R101', 'Chia tiền lãi cho (100% − lãi suất) thay vì cho lãi suất', L / (1 - r / 100))
      add('R100', 'Chia tiền lãi cho số r mà quên đổi % (quên chia 100)', L / r)
      add('R535', 'Nhầm tháng với năm: nhân số tiền gửi với 12', Mm * 12)
      add('R535', 'Nhầm tháng với năm: chia số tiền gửi cho 12', Mm / 12)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', Mm / 10)
      break
    }
    case 'ls_g': {
      const N = T[0], r = P[0], Mm = N / (1 + r / 100)
      add('R537', 'Lấy tiền lãi (cả gốc lẫn lãi trừ tiền gửi) làm đáp số', N - Mm)
      add('R525', 'Nhân (thay vì chia) cả gốc lẫn lãi với (100% + lãi suất)', N * (1 + r / 100))
      add('R527', 'Chia cả gốc lẫn lãi cho lãi suất thay vì cho (100% + lãi suất)', N / (r / 100))
      add('R101', 'Chia cho (100% − lãi suất) thay vì cho (100% + lãi suất)', N / (1 - r / 100))
      add('R526', 'Trừ thẳng phần trăm lãi suất của cả gốc lẫn lãi (N − N × r%)', N * (1 - r / 100))
      add('R407', 'Cộng (thay vì chia) cả gốc lẫn lãi với số tiền gửi', N + Mm)
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', Mm / 10)
      break
    }
    case 'ls_h1': case 'ls_h2': {
      const Mm = T[0], X = T[1], L = mau === 'ls_h1' ? X : X - Mm, r = L / Mm * 100
      if (mau === 'ls_h1') {
        add('R527', 'Chia tiền lãi cho cả gốc lẫn lãi thay vì cho tiền gửi', L / (Mm + L) * 100)
        add('R101', 'Lấy 100% trừ đi lãi suất tìm được', 100 - r)
        add('R528', 'Cộng thêm 100% vào lãi suất tìm được', 100 + r)
        add('R535', 'Nhầm năm với tháng: nhân lãi suất với 12', r * 12)
        add('R535', 'Nhầm năm với tháng: chia lãi suất cho 12', r / 12)
      } else {
        add('R528', 'Ghi cả gốc lẫn lãi bằng bao nhiêu phần trăm tiền gửi mà quên trừ 100%', X / Mm * 100)
        add('R527', 'Chia tiền lãi cho cả gốc lẫn lãi thay vì cho tiền gửi', L / X * 100)
        add('R101', 'Lấy 100% trừ đi lãi suất tìm được', 100 - r)
        add('R535', 'Nhầm năm với tháng: nhân lãi suất với 12', r * 12)
        add('R535', 'Nhầm năm với tháng: chia lãi suất cho 12', r / 12)
      }
      add('R540', 'Lệch một hàng ở bước chia cuối (dịch dấu phẩy)', r / 10)
      break
    }
    default: throw new Error('mẫu lạ ' + mau)
  }
  return K
}

/** định dạng ứng viên theo khuôn dap_an */
function dinhDang(c, v) {
  const da = c.dap_an.trim(); let m
  const ok = (x, k = 2) => Number.isFinite(x) && x > 0 && tidy(x, k)
  if ((m = da.match(/^\$[\d,]+\\%\$$/))) return ok(v) && (v <= 100 || !/^(tr_|ng_|pl_|hk_[def])/.test(c.mau)) ? `$${f(v)}\\%$` : null
  if ((m = da.match(/^\$[\d,]+\$ (g|kg|tấn)$/))) return ok(v) ? `$${f(v)}$ ${m[1]}` : null
  if ((m = da.match(/^\$\d+\$ đồng$/))) return Number.isFinite(v) && v > 0 && Math.abs(v - Math.round(v)) < 1e-6 && Math.round(v) % 1000 === 0 ? `$${fi(v)}$ đồng` : null
  if ((m = da.match(/^\$\d+\$ (.+)$/))) return Number.isFinite(v) && v > 0 && Math.abs(v - Math.round(v)) < 1e-6 ? `$${fi(v)}$ ${m[1]}` : null
  if ((m = da.match(/^(Tăng|Giảm) \$[\d,]+\\%\$$/))) return v && ok(v.x) ? `${v.t > 0 ? 'Tăng' : 'Giảm'} $${f(v.x)}\\%$` : null
  if ((m = da.match(/^Loại \$([\d,]+)\\%\$: \$[\d,]+\$ (g|kg|tấn); loại \$([\d,]+)\\%\$: \$[\d,]+\$ (g|kg|tấn)$/))) {
    return v.every((x) => ok(x)) ? `Loại $${m[1]}\\%$: $${f(v[0])}$ ${m[2]}; loại $${m[3]}\\%$: $${f(v[1])}$ ${m[4]}` : null
  }
  throw new Error('khuôn dap_an lạ: ' + da)
}

/** đáp số đúng dạng số / {t,x} / [X,Y] để dựng nhiễu R540 */
function dungTri(c) {
  const da = c.dap_an, n = (s) => Number(s.replace(',', '.')); let m
  if ((m = da.match(/^(Tăng|Giảm) \$([\d,]+)\\%\$$/))) return { t: m[1] === 'Tăng' ? 1 : -1, x: n(m[2]) }
  if ((m = da.match(/^Loại .*?: \$([\d,]+)\$ \S+; loại .*?: \$([\d,]+)\$ \S+$/))) return [n(m[1]), n(m[2])]
  return n((da.match(/\$([\d,]+)/) ?? [])[1] ?? 'NaN')
}
const scal = (v, k) => (Array.isArray(v) ? [v[0], v[1] * k] : typeof v === 'object' ? { t: v.t, x: v.x * k } : v * k)
export function taoNhieu(c) {
  const raw = ungVien(c).filter((k) => k.rule !== 'R540'), ra = [], thay = new Set()
  const dt = dungTri(c)
  raw.push({ rule: 'R540', ds: 'Lệch một hàng ở bước tính cuối (dịch dấu phẩy sang phải)', v: scal(dt, 10) })
  raw.push({ rule: 'R540', ds: 'Lệch một hàng ở bước tính cuối (dịch dấu phẩy sang trái)', v: scal(dt, 0.1) })
  const M0 = (c.noi_dung.match(/(d+(?:,d+)?) (?:g|kg|tấn)(?![p{L}])/u) || [])[1]
  const tran = (c.mau === 'hk_a' || c.mau === 'hk_c') && M0 ? Number(M0.replace(',', '.')) : null   // hạt khô / nước bay hơi không thể ≥ khối lượng hạt tươi
  for (const k of raw) {
    if (tran !== null && typeof k.v === 'number' && k.v >= tran) continue
    let text = null; try { text = dinhDang(c, k.v) } catch (e) { throw e }
    if (!text) continue
    const nv = { text, rule: k.rule, duong_sai: k.ds }
    if (kiemUngVien(c.dap_an, nv, RULE).length) continue
    if (thay.has(text)) continue
    thay.add(text); ra.push(nv)
  }
  // ưu tiên: mỗi rule một đại diện (R540 cuối), sau đó phần còn lại; tối đa 6
  const dau = [], sau = [], seen = new Set()
  for (const nv of ra) { if (nv.rule === 'R540') continue; if (!seen.has(nv.rule)) { seen.add(nv.rule); dau.push(nv) } else sau.push(nv) }
  const dp = ra.filter((nv) => nv.rule === 'R540')
  return [...dau, ...dp.slice(0, 1), ...sau].slice(0, 6)
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-fill-C-mcq.mjs')) {
  const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
  const lo = JSON.parse(readFileSync(a.find((x) => x.endsWith('.json') && !x.includes('-mcq')) ?? 'kho-rules/dai/clone/k5T-pt-fill-C.json', 'utf8'))
  const ra = [], loai = []; const dem = {}, ruleDem = {}
  for (const c of lo) {
    const nhieu = taoNhieu(c), { chon } = chonNhieu(c.dap_an, nhieu, RULE)
    if (nhieu.length < 4 || chon.length < 3) { loai.push(`${c.dang} ${c.mau}: ${c.noi_dung.slice(0, 70)} → ${nhieu.length} ứng viên, ${chon.length} chọn được (${nhieu.map((x) => x.rule).join(',')})`); continue }
    ra.push({ noi_dung: c.noi_dung, nhieu }); dem[c.dang] = (dem[c.dang] || 0) + 1
    for (const n of chon) ruleDem[n.rule] = (ruleDem[n.rule] || 0) + 1
  }
  console.log(`${ra.length}/${lo.length} câu đủ nhiễu`, JSON.stringify(dem)); console.log('rule (3 nhiễu máy sẽ chọn):', JSON.stringify(ruleDem))
  for (const l of loai) console.log('LOẠI:', l)
  const out = lay('--ra'); if (out) { writeFileSync(out, JSON.stringify(ra, null, 1)); console.log('→', out) }
}
