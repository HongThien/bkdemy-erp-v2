import { pool, form, luu, nhom3, soTrang } from './lib.mjs'
const P = pool(), out = []
const T = (v) => (Number.isInteger(v) && v > 0 ? nhom3(v) : null)
const mk = (v, rule, duong_sai) => ({ text: T(v), rule, duong_sai })
const nhan = (c, dung, cand) => {
  if (String(dung) !== soTrang(c.dap_an)) return out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` })
  out.push(form(c.ma_cau, nhom3(dung), cand.filter((x) => x && x.text)))
}
const nums = (s) => (s.replace(/\$/g, '').match(/\d+/g) || []).map(Number)
for (const c of P) {
  const t = c.noi_dung, id = c.ma_dang_bai
  let n
  if (id === 'NDB01773' && /từ con thứ|từ xe thứ|từ thuyền thứ/.test(t)) {
    n = nums(t); const p = +t.match(/từ \S+(?: \S+)? thứ (\d+)/)[1], q = +t.match(/đến \S+(?: \S+)? thứ (\d+)/)[1], r = +t.match(/(?:chở|tha) (\d+) (?:kg|gam)/)[1], k = q - p + 1, dung = k * r
    nhan(c, dung, [mk(k, 'R408', 'dừng ở số con/xe tham gia, chưa nhân với khối lượng mỗi con'), mk((q - p) * r, 'R413', 'đếm thiếu một con/xe (lấy hiệu hai số thứ tự)'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'), mk(k + r, 'R415', 'cộng thay vì nhân')])
  } else if (id === 'NDB01773' && /thùng bánh|mỗi nhóm|nhóm/.test(t) && !/từ con/.test(t)) {
    n = nums(t); const [a, b, d] = /^Khối lớp/.test(t) ? n.slice(1, 4) : n.slice(-3), dung = a * b * d
    nhan(c, dung, [mk(b * d, 'R408', 'dừng ở kết quả trung gian, thiếu một lần nhân'), mk((a - 1) * b * d, 'R413', 'tính sai thừa số thứ nhất (lệch một nhóm)'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'), mk(a + b + d, 'R415', 'cộng thay vì nhân')])
  } else if (id === 'NDB02670' && /hai tấm pin mặt trời|hai hình vuông/.test(t)) {
    n = nums(t); const s = n[0], mm = /mm/.test(t) || /cm/.test(t) && /\text\{mm/.test(t)
    const area = 2 * s * s
    const dung = /mm\^2|mm/.test(t) && /cạnh \$?\d+\$? cm/.test(t) ? area * 100 : area * 100
    nhan(c, dung, [mk(area * 10, 'R383', 'đổi diện tích với hệ số 10 thay vì 100'), mk(area * 1000, 'R384', 'đổi diện tích với hệ số 1 000 thay vì 100'), mk(area, 'R408', 'dừng ở diện tích chưa đổi đơn vị'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0')])
  } else if (id === 'NDB02670' && /lát (sàn|nền|sân)/.test(t) && /hình vuông cạnh/.test(t)) {
    n = nums(t); const S = n[0] * 10; let tam
    if (/gấp/.test(t)) { const L = n[1], k = n[2]; if (L % k) { out.push({ ma_cau: c.ma_cau, bo: 'không nguyên' }); continue } tam = L * (L / k) } else tam = n[1] * n[2]
    if ((S * S) % tam) { out.push({ ma_cau: c.ma_cau, bo: 'không chia hết' }); continue }
    const dung = (S * S) / tam, sdm = S * S
    nhan(c, dung, [mk(sdm, 'R408', 'dừng ở diện tích sàn (dm²), chưa chia cho diện tích một tấm'), mk((S / 10) ** 2 * 10 / tam, 'R383', 'đổi m² sang dm² bằng hệ số 10 thay vì 100'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'), mk(4 * S / (tam > 0 ? Math.sqrt(tam) : 1), 'R407', 'dùng chu vi thay vì diện tích sàn')].map((x) => x))
  } else if (id === 'NDB02670' && /đổ cát/.test(t)) {
    n = nums(t); const [d, r, tt, ch] = n.filter((x, i) => !(i === 2 && false)).filter((x) => x !== 1 || false)
    const m2 = n.filter((_, i) => true)
    const [dd, rr, per, cap] = [n[0], n[1], n[3] ?? n[2], n[4] ?? n[3]]
    // n = [dài, rộng, 1(m²), tấn/m², tấn/chuyến]
    const D = n[0], R = n[1], tn = n[3], cap2 = n[4], tong = D * R * tn
    if (tong % cap2) { out.push({ ma_cau: c.ma_cau, bo: 'không chia hết' }); continue }
    const dung = tong / cap2
    nhan(c, dung, [mk(tong, 'R408', 'dừng ở tổng số tấn cát, chưa chia cho sức chở mỗi chuyến'), mk(tong * cap2, 'R407', 'nhân thay vì chia với sức chở mỗi chuyến'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'), mk(D * R / cap2 * 1 === Math.floor(D * R / cap2) ? D * R / cap2 : (D + R) * tn / cap2, 'R413', 'bỏ sót hệ số tấn trên mỗi m² khi tính')])
  } else if (id === 'NDB01783' && /thu hoạch được/.test(t)) {
    n = nums(t); const [T0, t0, b] = n, k = n[4], tao = T0 * 10 + t0 - b, dung = tao * 10 * k
    nhan(c, dung, [mk(tao, 'R408', 'dừng ở số tạ thóc còn lại, chưa đổi ra yến và tính gạo'), mk(tao * 100 * k, 'R387', 'nhầm hệ số: 1 tạ = 100 yến'), mk((T0 * 10 + t0 + b) * 10 * k, 'R407', 'cộng thay vì trừ số thóc đã bán'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0')])
  } else if (id === 'NDB01754' && /Trong các số đó, các số (chẵn|lẻ)/.test(t)) {
    const list = (t.match(/Cho các số:(.*?)\. Trong/)?.[1] || '').split(';').map((s) => s.replace(/\$/g, '').trim()).filter(Boolean)
    const chan = /chẵn/.test(t), ok = (s) => (+s.slice(-1) % 2 === 0) === chan
    const dungL = list.filter(ok), dung = dungL.join('; ')
    if (dung !== c.dap_an.trim()) { out.push({ ma_cau: c.ma_cau, bo: `máy "${dung}" ≠ kho "${c.dap_an}"` }); continue }
    const dau = list.filter((s) => (+s[0] % 2 === 0) === chan), nguoc = list.filter((s) => !ok(s))
    out.push(form(c.ma_cau, dung, [
      dau.join('; ') !== dung && dau.length && { text: dau.join('; '), rule: 'R406', duong_sai: 'xác định chẵn/lẻ theo chữ số đầu tiên thay vì chữ số tận cùng' },
      nguoc.length && { text: nguoc.join('; '), rule: 'R420', duong_sai: 'nhầm số chẵn với số lẻ (chọn ngược loại)' },
      dungL.length > 1 && { text: dungL.slice(1).join('; '), rule: 'R403', duong_sai: 'liệt kê thiếu một số thỏa mãn' },
      { text: [...dungL, ...nguoc.slice(0, 1)].join('; '), rule: 'R404', duong_sai: 'liệt kê thừa một số không thỏa mãn' },
    ].filter(Boolean)))
  }
}
luu('k4_b3', out)
