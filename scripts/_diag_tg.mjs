import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect(); const q = async s => (await c.query(s)).rows
console.log('— BUỔI ĐANG MỞ (mo, thuong):')
for (const b of await q(`select b.id, b.ngay, b.trang_thai, l.ten_lop, l.id lop_id from buoi_hoc b join lop l on l.id=b.lop_id where b.trang_thai='mo' and b.loai='thuong' order by b.ngay desc limit 20`)) {
  const pc = await q(`select pc.vai_tro, pc.la_chinh, n.ho_ten, n.id ns_id, (select count(*) from tai_khoan tk where tk.id is not null and tk.nhan_su_id=n.id)::int has_acc from phan_cong_lop pc join nhan_su n on n.id=pc.nhan_su_id where pc.lop_id='${b.lop_id}'`)
  console.log(`  ${b.ten_lop} ${b.ngay}: ` + (pc.length ? pc.map(p=>`${p.vai_tro}${p.la_chinh?'(c)':''}=${p.ho_ten}${p.has_acc?'[acc]':'[no-acc]'}`).join(', ') : 'CHƯA phân công ai'))
}
console.log('\n— TÀI KHOẢN gắn nhân sự là TG ở lớp nào:')
for (const r of await q(`select n.ho_ten, count(distinct case when pc.vai_tro='tg' then pc.lop_id end)::int tg_lop, count(distinct case when pc.vai_tro='gv' then pc.lop_id end)::int gv_lop from tai_khoan tk join nhan_su n on n.id=tk.nhan_su_id left join phan_cong_lop pc on pc.nhan_su_id=n.id group by n.ho_ten order by tg_lop desc limit 20`)) console.log(`  ${r.ho_ten}: TG ${r.tg_lop} lớp · GV ${r.gv_lop} lớp`)
await c.end()
