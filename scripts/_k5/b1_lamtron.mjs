import { pool, form, luu, nhom3, soTrang } from './lib.mjs'
const HANG = { 'chục': 10, 'trăm': 100, 'nghìn': 1000, 'chục nghìn': 10000, 'trăm nghìn': 100000 }
const lamTron = (n, h, mode = 'chuan') => { const r = n % h; const base = n - r; if (mode === 'xuong') return base; if (mode === 'len') return base + h; return r * 2 >= h ? base + h : base }
const out = []
for (const c of pool().filter((c) => c.ma_dang_bai === 'NDB02075')) {
  const m = c.noi_dung.match(/Làm tròn số ([\d ]+) đến hàng (chục nghìn|trăm nghìn|nghìn|trăm|chục)/)
  if (!m) { continue }
  const n = +soTrang(m[1]), hn = m[2], h = HANG[hn]
  const dung = lamTron(n, h)
  if (String(dung) !== soTrang(c.dap_an)) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  const chuan = lamTron(n, h) === lamTron(n, h, 'xuong') ? 'len' : 'xuong'
  const ds = [
    { text: nhom3(lamTron(n, h / 10)), rule: 'R395', duong_sai: `làm tròn đến hàng liền kề nhỏ hơn (${h / 10}) thay vì hàng ${hn}` },
    { text: nhom3(lamTron(n, h * 10)), rule: 'R422', duong_sai: `làm tròn đến hàng liền kề lớn hơn (${h * 10}) thay vì hàng ${hn}` },
    { text: nhom3(lamTron(n, h, chuan)), rule: 'R396', duong_sai: `xét sai chữ số quyết định nên làm tròn ngược chiều (${chuan === 'xuong' ? 'xuống' : 'lên'})` },
    { text: nhom3(lamTron(n, h, 'xuong')), rule: 'R397', duong_sai: 'cắt bỏ chữ số sau hàng làm tròn, không xét chữ số kế tiếp (luôn làm tròn xuống)' },
    { text: nhom3(lamTron(n, h, 'len') === dung ? n - (n % h) + h + (n % h) : n), rule: 'R421', duong_sai: 'cộng 1 vào chữ số hàng làm tròn nhưng giữ nguyên các chữ số phía sau' },
  ]
  out.push(form(c.ma_cau, nhom3(dung), ds))
}
luu('k5_b1_lamtron', out)
