// Kiểm ĐỘC LẬP file đề xuất ánh xạ dạng (do agent sinh) — không tin báo cáo của agent.
// Chạy: node scripts/khtn-hatmam/kiem-de-xuat.mjs <thư mục gan> <khối> <môn-file: ly|hoa|sinh>
import fs from 'node:fs'
const [, , dir, khoi, f] = process.argv
const vao = JSON.parse(fs.readFileSync(`${dir}/${khoi}-${f}.json`, 'utf8'))
const dx = JSON.parse(fs.readFileSync(`${dir}/de-xuat-${khoi}-${f}.json`, 'utf8'))
const erp = new Map(vao.erp.map((e) => [e.ma_dang, e])); const cdErp = new Set(vao.erp.map((e) => e.ma_chuyen_de))
const loi = []; const phu = new Map(); const dem = { xanh: [0, 0], vang: [0, 0], do: [0, 0], thieu_cd: [0, 0] }
const hmMap = new Map(vao.hm.map((h) => [h.ma_dang, h]))
const thayDang = new Set()
for (const d of dx.dang) {
  const h = hmMap.get(d.hm); if (!h) { loi.push(`dạng lạ ${d.hm}`); continue }
  if (thayDang.has(d.hm)) loi.push(`dạng ${d.hm} lặp`); thayDang.add(d.hm)
  if (d.nhom.length > 1 && d.nhom.some((n) => n.cau === '*')) loi.push(`${d.hm}: nhiều nhóm mà có cau "*"`)
  for (const n of d.nhom) {
    if (!dem[n.lan]) { loi.push(`${d.hm}: làn lạ ${n.lan}`); continue }
    const ds = n.cau === '*' ? h.cau.map((c) => c.ma) : n.cau
    if (!Array.isArray(ds) || !ds.length) { loi.push(`${d.hm}: nhóm rỗng`); continue }
    for (const m of ds) { if (!h.cau.some((c) => c.ma === m)) loi.push(`${d.hm}: câu ${m} không thuộc dạng`); if (phu.has(m)) loi.push(`câu ${m} phủ 2 lần`); phu.set(m, n.lan) }
    dem[n.lan][0]++; dem[n.lan][1] += ds.length
    if (n.lan === 'xanh' && !erp.has(n.erp_dang)) loi.push(`${d.hm}: erp_dang ${n.erp_dang} không có`)
    if ((n.lan === 'vang' || n.lan === 'do') && !cdErp.has(n.erp_chuyen_de)) loi.push(`${d.hm}: erp_chuyen_de ${n.erp_chuyen_de} không có`)
    if (n.lan === 'vang' && (!n.ten || !n.mo_ta_ngan || !n.ly_do)) loi.push(`${d.hm}: vàng thiếu ten/mo_ta_ngan/ly_do`)
    if (n.lan === 'do' && !n.ly_do) loi.push(`${d.hm}: đỏ thiếu ly_do`)
    if (n.gan_nhat && !erp.has(n.gan_nhat)) loi.push(`${d.hm}: gan_nhat ${n.gan_nhat} không có`)
    if (n.lan === 'thieu_cd' && n.erp_chuyen_de) loi.push(`${d.hm}: thieu_cd mà có erp_chuyen_de`)
  }
}
for (const h of vao.hm) { if (!thayDang.has(h.ma_dang)) loi.push(`thiếu dạng ${h.ma_dang}`); for (const c of h.cau) if (!phu.has(c.ma)) loi.push(`câu chưa phủ ${c.ma}`) }
// Nghi vấn: xanh mà tên 2 bên không chung chữ nào (để người đọc tay)
const tu = (s) => new Set((s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3))
const nghi = []
for (const d of dx.dang) for (const n of d.nhom) if (n.lan === 'xanh' && erp.has(n.erp_dang)) {
  const a = tu(hmMap.get(d.hm)?.ten), b = tu(erp.get(n.erp_dang).ten_dang)
  if (![...a].some((w) => b.has(w))) nghi.push(`${d.hm} «${hmMap.get(d.hm)?.ten}» → ${n.erp_dang} «${erp.get(n.erp_dang).ten_dang}»`)
}
console.log(`${khoi}-${f}: ${loi.length ? '❌ ' + loi.length + ' lỗi' : '✔ sạch'} · làn (nhóm/câu) ${JSON.stringify(dem)} · xanh khác tên hẳn: ${nghi.length}`)
if (loi.length) console.log('  ' + loi.slice(0, 10).join('\n  '))
if (process.argv.includes('--nghi')) console.log('  ' + nghi.join('\n  '))
