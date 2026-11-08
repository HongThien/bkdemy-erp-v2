// thuc-don.mjs — dựng THỰC ĐƠN dạng ứng viên cho 6 chương K12 (để trạm đọc gắn câu đề thi). Hàm số + Vectơ: bản đề xuất của Claude (cau-truc.mjs); NH-TP, XS, Số đặc trưng, PP toạ độ: DB hiện tại (bản của Thùy).
//   node kho-rules/dai/lo/k12-de/thuc-don.mjs > kho-rules/dai/lo/k12-de/thuc-don.md
import pg from 'pg'
import fs from 'node:fs'
import { CAY as HS } from '../k12-hs/cau-truc.mjs'
import { CAY as VT } from '../k12-vt/cau-truc.mjs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=')+1).trim().replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const o = []
const cay = (ten, code, CAY) => { o.push(`\n## ${code} — ${ten}`); for (const cd of CAY) { o.push(`### ${cd.ten}`); for (const n of cd.nhom) { o.push(`- Nhóm ${n.id} ${n.ten}`); for (const d of n.dang) o.push(`  - ${d[0]} ${d[1]}`) } } }
o.push('# THỰC ĐƠN DẠNG ỨNG VIÊN — 6 chương Toán 12\n\nMã chương: HS · NHTP · VT · XS · SDT · PPTD · O (ngoài 6 chương: kiến thức lớp 10/11 hoặc chương khác)')
cay('Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số (Hàm số)', 'HS', HS)
cay('Vectơ và hệ trục toạ độ trong không gian', 'VT', VT)
for (const [code, id, ten] of [['NHTP', 'NCD00095', 'Nguyên hàm và tích phân'], ['XS', 'NCD00097', 'Xác suất có điều kiện'], ['SDT', 'NCD00098', 'Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm'], ['PPTD', 'NCD00099', 'Phương pháp toạ độ trong không gian']]) {
  o.push(`\n## ${code} — ${ten}`)
  const r = (await c.query(`select ch.ten chuyen_de, n.id nid, n.ten nhom, d.id did, d.ten dang from dai_bdm_chu_de cd join dai_bdm_o oo on oo.chu_de_id=cd.id join dai_bdm_chuyen_de ch on ch.id=oo.chuyen_de_id join dai_bdm_nhom n on n.chu_de_id=cd.id and n.chuyen_de_id=ch.id left join dai_bdm_dang_bai d on d.nhom_id=n.id where cd.id='${id}' order by oo.thu_tu, n.thu_tu, d.thu_tu`)).rows
  let cdp = '', np = ''
  for (const x of r) { if (x.chuyen_de !== cdp) { cdp = x.chuyen_de; o.push(`### ${cdp}`) } if (x.nid !== np) { np = x.nid; o.push(`- Nhóm ${x.nid} ${x.nhom}${x.did ? '' : '   (chưa có dạng bài — gắn ở mức NHÓM)'}`) } if (x.did) o.push(`  - ${x.did} ${x.dang}`) }
}
console.log(o.join('\n')); await c.end()
