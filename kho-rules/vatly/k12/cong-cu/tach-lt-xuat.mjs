// Tách lý thuyết NHÓM → lý thuyết chung (nhóm) + lý thuyết riêng (dạng). Thùy 12/11: "nhóm là lý thuyết chung, từng dạng là lý thuyết riêng".
// Bước 1 (chỉ đọc DB): xuất mọi khối lý thuyết của nhóm Vật lý 12 (đánh số), kèm danh sách dạng con, cho trạm xếp chỗ.
//   Khối = đoạn mở bằng ##, ngăn bởi dòng trống. Ra: ../tach-lt/khoi.json + ../tach-lt/khoi-<phan>.md
// Chạy (gốc repo): node kho-rules/vatly/k12/cong-cu/tach-lt-xuat.mjs
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
process.loadEnvFile('.env')
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const OUT = path.join(DIR, '..', 'tach-lt'); fs.mkdirSync(OUT, { recursive: true })
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const rows = (await c.query(`select cd.ten cd, cd.thu_tu ct, ch.ten ch, o.thu_tu ot, n.id, n.ten, n.thu_tu nt, n.ly_thuyet, n.updated_at,
   (select json_agg(json_build_object('id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'lt', length(d.ly_thuyet)) order by d.thu_tu) from vatly_bdm_dang_bai d where d.nhom_id = n.id) dang
 from vatly_bdm_chu_de cd join vatly_bdm_o o on o.chu_de_id = cd.id join vatly_bdm_chuyen_de ch on ch.id = o.chuyen_de_id
 join vatly_bdm_nhom n on n.chu_de_id = cd.id and n.chuyen_de_id = ch.id where cd.khoi = '12' order by ct, ot, nt`)).rows
await c.end()
const nhom = rows.map(r => ({ id: r.id, duong: `${r.cd} › ${r.ch} › ${r.ten}`, cd: r.cd, updated_at: r.updated_at,
  khoi: r.ly_thuyet.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean), dang: r.dang || [] }))
fs.writeFileSync(path.join(OUT, 'khoi.json'), JSON.stringify(nhom, null, 1))
for (const [phan, cds] of [['nhiet-khi', ['Vật lí nhiệt', 'Khí lí tưởng']], ['tu-hn', ['Từ trường', 'Vật lí hạt nhân']]]) {
  let md = ''
  for (const n of nhom.filter(n => cds.includes(n.cd))) {
    md += `\n# NHÓM ${n.id} — ${n.duong}\nDạng con:\n${n.dang.map(d => `- ${d.id} — ${d.ten} — ${d.mo_ta}`).join('\n')}\nKhối lý thuyết:\n`
    n.khoi.forEach((k, i) => { md += `\n[K${i}]\n${k}\n` })
  }
  fs.writeFileSync(path.join(OUT, `khoi-${phan}.md`), md.trim() + '\n')
}
console.log(nhom.length, 'nhóm ·', nhom.reduce((a, n) => a + n.khoi.length, 0), 'khối ·', nhom.reduce((a, n) => a + n.dang.length, 0), 'dạng · dạng đã có LT:', nhom.flatMap(n => n.dang).filter(d => d.lt > 0).length)
