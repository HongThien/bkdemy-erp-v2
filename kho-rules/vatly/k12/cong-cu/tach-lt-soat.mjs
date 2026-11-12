// Claude soát bảng xếp của trạm (12/11) — sửa đè vài chỗ, ghi lý do vào "tron" để hiện trên trang duyệt.
import fs from 'node:fs'
import path from 'node:path'
const T = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', 'tach-lt')
const SUA = [
  ['xep-nhiet-khi.json', 'LNB00037', 'K4', 'N', 'Động cơ nhiệt: thuộc định luật II (đang ở chung), không phục vụ dạng ĐL I'],
  ['xep-nhiet-khi.json', 'LNB00037', 'K5', 'N', 'Máy lạnh: như động cơ nhiệt'],
  ['xep-tu-hn.json', 'LNB00052', 'K4', ['LDB00109'], 'Ống tia âm cực: ứng dụng lực Lorentz, không phải động cơ/loa/nam châm điện'],
  ['xep-tu-hn.json', 'LNB00052', 'K7', ['LDB00109'], 'Máy MHD: ứng dụng lực Lorentz'],
  ['xep-tu-hn.json', 'LNB00052', 'K8', ['LDB00109'], 'Lưu lượng kế điện từ: ứng dụng lực Lorentz'],
  ['xep-tu-hn.json', 'LNB00063', 'K3', 'N', 'Định nghĩa nhiệt hạch: kiến thức chung, song song định nghĩa phân hạch'],
]
for (const [f, n, k, v, ly] of SUA) {
  const p = path.join(T, f), j = JSON.parse(fs.readFileSync(p, 'utf8'))
  if (!j.xep[n] || j.xep[n][k] === undefined) throw new Error(`${f} ${n} ${k} không có`)
  if (JSON.stringify(j.xep[n][k]) !== JSON.stringify(v)) { j.xep[n][k] = v; (j.tron ||= []).push({ nhom: n, khoi: k, ghi: 'Claude soát: ' + ly }) }
  fs.writeFileSync(p, JSON.stringify(j, null, 1))
}
console.log('đã áp', SUA.length, 'chỗ sửa')
