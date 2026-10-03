// Soi tay ngẫu nhiên các nhóm 🟢: in tên dạng HM ↔ dạng ERP + 2 câu HM + 2 câu mẫu ERP. Chạy: node … <dir> <khối> <môn-file> [số nhóm]
import fs from 'node:fs'
const [, , dir, khoi, f, n = '4'] = process.argv
const vao = JSON.parse(fs.readFileSync(`${dir}/${khoi}-${f}.json`, 'utf8'))
const dx = JSON.parse(fs.readFileSync(`${dir}/de-xuat-${khoi}-${f}.json`, 'utf8'))
const erp = new Map(vao.erp.map((e) => [e.ma_dang, e])); const hm = new Map(vao.hm.map((h) => [h.ma_dang, h]))
const xanh = dx.dang.flatMap((d) => d.nhom.filter((x) => x.lan === 'xanh').map((x) => ({ d, x })))
const chon = xanh.sort(() => Math.random() - 0.5).slice(0, Number(n))
for (const { d, x } of chon) {
  const h = hm.get(d.hm); const e = erp.get(x.erp_dang)
  const cs = x.cau === '*' ? h.cau : h.cau.filter((c) => x.cau.includes(c.ma))
  console.log(`\n${d.hm} «${h.ten}» → ${x.erp_dang} «${e.ten_dang}» (${cs.length} câu)`)
  for (const c of cs.slice(0, 2)) console.log('  HM : ' + c.de.slice(0, 150))
  for (const m of e.mau.slice(0, 2)) console.log('  ERP: ' + m.slice(0, 150))
}
