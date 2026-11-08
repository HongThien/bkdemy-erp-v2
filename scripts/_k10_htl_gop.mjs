import fs from 'node:fs'
const D = 'kho-rules/dai/lo/k10-htl/'
const cau = JSON.parse(fs.readFileSync(D+'cau.json','utf8'))
const L = {}
for (const f of ['1A','2A','1B','2B']) for (const r of JSON.parse(fs.readFileSync(D+`out-${f}.json`,'utf8'))) (L[r.ma_cau] ||= []).push({ ...r, tram: f })
const rows = cau.map(q => {
  const ls = L[q.ma_cau] || []
  const d = ls.map(x => x.dang_id)
  const dongY = ls.length === 2 && d[0] === d[1]
  return { ma_cau: q.ma_cau, hang: q.nguon_hang, dang_cu: q.dang_cu, dx: q.dx_dang, dx_chac: q.dx_chac, a: ls[0], b: ls[1], dong_y: dongY, anh: !!q.anh_de_file }
})
fs.writeFileSync(D+'gop.json', JSON.stringify(rows,null,1))
const cnt = (f) => rows.filter(f).length
console.log('tổng', rows.length, '· đủ 2 nhãn', cnt(r=>r.a&&r.b), '· hai trạm đồng ý', cnt(r=>r.dong_y))
console.log('đồng ý & trùng đề xuất hiện có', cnt(r=>r.dong_y && r.a.dang_id===r.dx))
console.log('đồng ý & KHÁC đề xuất hiện có', cnt(r=>r.dong_y && r.dx && r.a.dang_id!==r.dx))
console.log('đồng ý & thieu_dang', cnt(r=>r.dong_y && r.hang==='thieu_dang'), ' trong đó NGOAI', cnt(r=>r.dong_y && r.hang==='thieu_dang' && r.a.dang_id==='NGOAI'), 'KHONG_KHOP', cnt(r=>r.dong_y && r.hang==='thieu_dang' && r.a.dang_id==='KHONG_KHOP'))
console.log('KHÔNG đồng ý', cnt(r=>!r.dong_y))
const by = {}; rows.filter(r=>r.dong_y).forEach(r=>{by[r.a.dang_id]=(by[r.a.dang_id]||0)+1}); console.log('đồng ý theo dạng', by)
const dx = {}; rows.filter(r=>r.hang==='de_xuat').forEach(r=>{dx[r.dx]=(dx[r.dx]||0)+1}); console.log('đề xuất hiện có', dx)
