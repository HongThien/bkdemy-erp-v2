// B3 — in các câu MẪU mà máy (mức cao) lệch nhãn người, kèm đề + 2 dạng bài, để PHÂN XỬ.
// Nhãn mẫu lấy từ đối ứng CỤM cũ → dạng bài (thô) nên "lệch" chưa chắc là máy sai.
//   node scripts/bdm-b3-lech-mau.mjs <khoi>  ⇒ in ra + ghi lech-mau.json (để điền phan_xu: 'may' | 'nguoi' | 'ca_hai' | 'khong')
import fs from 'node:fs'
import path from 'node:path'
const khoi = process.argv[2]
const goc = path.join('kho-rules', 'dai', 'lo', 'b3', 'k' + khoi)
const mau = JSON.parse(fs.readFileSync(fs.existsSync(path.join(goc, '..', '_mau', `k${khoi}.json`)) ? path.join(goc, '..', '_mau', `k${khoi}.json`) : path.join(goc, 'mau.json'), 'utf8')) // mẫu để NGOÀI thư mục agent (17/10: 1 agent đã mở mau.json)
const kq = JSON.parse(fs.readFileSync(path.join(goc, 'ket_qua.json'), 'utf8'))
const dich = fs.readFileSync(path.join(goc, 'dich.md'), 'utf8')
const dang = (id) => { const m = dich.match(new RegExp(`\\*\\*${id}\\*\\* · (.*)\\n(  - Mô tả: (.*)\\n)?`)); return m ? `${id} «${m[1]}» — ${(m[3] ?? '').slice(0, 220)}` : id }
const vao = {}
for (const f of fs.readdirSync(goc).filter((x) => /^lo-\d+\.json$/.test(x))) for (const c of JSON.parse(fs.readFileSync(path.join(goc, f), 'utf8'))) vao[c.ma_cau] = c
const lech = kq.filter((r) => r.ma_cau in mau && r.chac === 'cao' && r.dang_bai_id !== mau[r.ma_cau])
const out = lech.map((r) => ({ ma_cau: r.ma_cau, may: r.dang_bai_id, nguoi: mau[r.ma_cau], phan_xu: null }))
for (const r of lech) {
  const c = vao[r.ma_cau]
  console.log(`\n### ${r.ma_cau}  (cũ: ${c.nhan_cu})`)
  console.log('ĐỀ:', c.de.replace(/\s+/g, ' ').slice(0, 600))
  if (c.menh_de) console.log('MỆNH ĐỀ:', JSON.stringify(c.menh_de).slice(0, 400))
  console.log('  MÁY  :', dang(r.dang_bai_id))
  console.log('  NGƯỜI:', dang(mau[r.ma_cau]))
}
fs.writeFileSync(path.join(goc, 'lech-mau.json'), JSON.stringify(out, null, 1))
console.log(`\n${lech.length} câu lệch ⇒ ${path.join(goc, 'lech-mau.json')}`)
