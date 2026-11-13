import { pool, form, luu, nhom3, soTrang } from './lib.mjs'
const P = pool(), out = []
const n = (s) => +String(s).replace(/\s/g, '')
const T = (v) => nhom3(v)
const dec = (v) => (Number.isInteger(v) ? T(v) : String(v).replace('.', ','))
function chot(c, dung, cand) {
  if (String(dung) !== soTrang(c.dap_an)) return out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` })
  out.push(form(c.ma_cau, T(dung), cand.filter((x) => x.v !== null && x.v !== dung && Number.isFinite(x.v)).map((x) => ({ text: dec(x.v), rule: x.rule, duong_sai: x.ds }))))
}
// (1) thu hoạch
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02141' && /^Một khu vực trồng/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/diện tích là ([\d ]+) m²\. Hằng năm, trung bình cứ (\d+) ha thu hoạch được (\d+) tấn [^;]*; (\d+) tấn [^.]*? bán được khoảng ([\d ]+) đồng/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const S = n(m[1]), h = +m[2], t = +m[3], t2 = +m[4], P2 = n(m[5])
  const tan = S / 10000 / h * t / t2, dung = tan * P2
  chot(c, dung, [
    { v: tan, rule: 'R408', ds: 'dừng ở số tấn thu hoạch, chưa nhân với giá bán' },
    { v: dung * 10, rule: 'R383', ds: 'đổi m² sang ha bằng hệ số 1 000 thay vì 10 000' },
    { v: dung / 10, rule: 'R414', ds: 'viết kết quả thiếu một chữ số 0' },
  ])
}
// (2) lát nền, tiền
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02143' && /^Người ta dùng .* để (lát|trải)/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/chiều dài (\d+) m, chiều rộng (\d+) m.*?là ([\d ]+) đồng/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const L = +m[1], W = +m[2], g = n(m[3]), dt = L * W, dung = dt * g
  chot(c, dung, [
    { v: 2 * (L + W) * g, rule: 'R411', ds: 'dùng chu vi thay vì diện tích để tính số mét vuông cần lát' },
    { v: dt, rule: 'R408', ds: 'dừng ở diện tích căn phòng, chưa nhân với giá tiền 1 m²' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
    { v: (L + W) * g, rule: 'R407', ds: 'cộng chiều dài với chiều rộng thay vì nhân' },
  ])
}
// (3) gạch theo hộp
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02143' && /muốn lát gạch/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/chiều dài (\d+) m, chiều rộng (\d+) m.*?cạnh (\d+) dm.*?mỗi hộp có (\d+) viên/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [L, W, a, k] = m.slice(1).map(Number), dung = L * W * 100 / (a * a * k)
  if (!Number.isInteger(dung)) { out.push({ ma_cau: c.ma_cau, bo: 'không nguyên' }); continue }
  chot(c, dung, [
    { v: dung * k, rule: 'R408', ds: 'tính số viên gạch, quên chia thành số hộp' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
    { v: L * W * 10 / (a * a * k), rule: 'R383', ds: 'đổi m² sang dm² bằng hệ số 10 thay vì 100' },
    { v: 2 * (L + W) * 10 / (a * k), rule: 'R411', ds: 'dùng chu vi thay vì diện tích mặt sàn' },
  ])
}
// (4) cửa sổ thông gió
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02143' && /thông gió/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/chiều dài ([\d,]+) m.*?dfrac\{(\d+)\}\{(\d+)\}/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const L = +m[1].replace(',', '.'), a = +m[2], b = +m[3], m2 = L * a / b, dung = Math.round(m2 * 100 * 1e6) / 1e6
  chot(c, dung, [
    { v: dung / 10, rule: 'R383', ds: 'đổi m² sang dm² bằng hệ số 10 thay vì 100' },
    { v: dung * 10, rule: 'R384', ds: 'đổi m² sang dm² bằng hệ số 1 000 thay vì 100' },
    { v: Math.round(m2 / 100 * 1e6) / 1e6, rule: 'R388', ds: 'đổi nhầm chiều: chia thay vì nhân với 100' },
    { v: L * a, rule: 'R408', ds: 'chỉ nhân chiều dài với tử số, bỏ bước chia cho mẫu số' },
  ])
}
luu('k5_b5_tien', out)
