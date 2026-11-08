import fs from 'node:fs'
const [vao, ra] = process.argv.slice(2)
const D = JSON.parse(fs.readFileSync(vao, 'utf8'))
const c = {}; for (const r of D.kq) { const k = `${r.chac}|${r.n}|${r.dang_bai_id ? 'co' : 'khong'}`; c[k] = (c[k] || 0) + 1 }
console.log('kq', D.kq.length, c)
console.log('dem', JSON.stringify(D.dem).slice(0, 300)); console.log('dsDem', JSON.stringify(D.dsDem).slice(0, 200))
console.log('ds', D.ds.length, [...new Set(D.ds.map((x) => x.chu_de_id))], 'cau keys', Object.keys(D.cau).length)
const ids = new Set(D.kq.map((r) => r.ma_cau)); console.log('trùng kq', D.kq.length - ids.size, '· giao kq∩ds', D.ds.filter((x) => ids.has(x.ma_cau)).length)
const dich = new Set(D.dich.map((d) => d.id)); console.log('dạng ngoài bảng đích', [...new Set(D.kq.filter((r) => r.dang_bai_id && !dich.has(r.dang_bai_id)).map((r) => r.dang_bai_id))])
fs.mkdirSync(ra, { recursive: true })
const lo = D.kq.map((r) => ({ ma_cau: r.ma_cau })), out = D.kq.map((r) => ({ ma_cau: r.ma_cau, dang_bai_id: r.dang_bai_id || null, chac: r.dang_bai_id ? (r.chac === 'cao' ? 'cao' : 'vua') : null, ly_do: r.ly_do || '' }))
fs.writeFileSync(ra + '/lo-01.json', JSON.stringify(lo)); fs.writeFileSync(ra + '/out-01.json', JSON.stringify(out))
console.log('ghi', ra)
