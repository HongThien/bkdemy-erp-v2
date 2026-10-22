import fs from 'node:fs'; import path from 'node:path'
const D = 'kho-rules/dai/lo/k10-htl/'
const S = process.argv[2]
const cau = JSON.parse(fs.readFileSync(D+'cau.json','utf8'))
fs.mkdirSync(`${S}/htl-anh`, { recursive: true })
let n = 0
for (const q of cau) {
  q.anh_de_file = null; q.anh_dap_an_file = null
  for (const [k, f] of [['anh_de','anh_de_file'],['anh_dap_an','anh_dap_an_file']]) {
    if (!q[k]) continue
    const out = `${S}/htl-anh/${q.ma_cau}_${k}.png`
    if (!fs.existsSync(out)) { const r = await fetch(q[k]); if (r.ok) { fs.writeFileSync(out, Buffer.from(await r.arrayBuffer())); n++ } }
    q[f] = fs.existsSync(out) ? out : null
  }
}
// đầu vào KHÔNG có đề xuất hiện tại (gán mù)
const mu = cau.map(q => ({ ma_cau: q.ma_cau, loai_cau: q.loai_cau, noi_dung: q.noi_dung, lua_chon: q.lua_chon, menh_de: q.menh_de, dap_an: q.dap_an, loi_giai: q.loi_giai, anh_de_file: q.anh_de_file, anh_dap_an_file: q.anh_dap_an_file }))
// xáo cố định (hạt giống đơn giản) rồi chia đôi
let s = 12345; const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
const a = [...mu]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
const h = Math.ceil(a.length / 2)
const H1 = a.slice(0, h), H2 = a.slice(h)
fs.writeFileSync(D+'in-P1A.json', JSON.stringify(H1, null, 1)); fs.writeFileSync(D+'in-P1B.json', JSON.stringify(H2, null, 1))
console.log('tải ảnh', n, '· nửa', H1.length, H2.length)
