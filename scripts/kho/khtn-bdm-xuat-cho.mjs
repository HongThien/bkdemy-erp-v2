// Câu KHTN ở dạng chờ (…000000, chưa thuộc nhóm nào) — bước 1: chọn NHÓM (Thùy 03/11). Chỉ đọc DB.
//   node scripts/kho/khtn-bdm-xuat-cho.mjs <thư mục ra>
//   → cho-<khối>[-k].in.json { danh_muc: [nhóm + tên/mô tả từng dạng], cau: [...] }
// Bước 2 dùng lại khtn-bdm-xuat-phan.mjs --tu-chon <dir> (xếp dạng trong nhóm đã chọn, đọc đủ mô tả/lý thuyết/ví dụ).
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
await c.query('begin read only')
const q = async (s, a) => (await c.query(s, a)).rows
const DIR = process.argv[2]; if (!DIR) throw new Error('thiếu thư mục ra'); fs.mkdirSync(DIR, { recursive: true })
const cat = (s, n) => (s ?? '').length > n ? s.slice(0, n) + ' …' : (s ?? '')
const cau = await q(`select b.khoi, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.dap_an, c.loi_giai, c.anh_de, c.ten_de_goc
  from khtn_cau_hoi c join khtn_ban_do b on b.ma_dang=c.dang_chinh
  where c.xoa_at is null and c.parent_ma_cau is null and c.dang_chinh like '%000000'
    and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau=c.ma_cau) order by b.khoi, c.ma_cau`)
for (const khoi of [...new Set(cau.map(r => r.khoi))]) {
  const dm = await q(`select n.id nhom_id, cd.ten chu_de, ch.ten chuyen_de, n.ten nhom,
      json_agg(json_build_object('dang_id', d.id, 'ten', d.ten, 'mo_ta', split_part(d.mo_ta, E'\n', 1)) order by d.thu_tu) dang
    from khtn_bdm_nhom n join khtn_bdm_chu_de cd on cd.id=n.chu_de_id join khtn_bdm_chuyen_de ch on ch.id=n.chuyen_de_id
    join khtn_bdm_o o on o.chu_de_id=n.chu_de_id and o.chuyen_de_id=n.chuyen_de_id join khtn_bdm_dang_bai d on d.nhom_id=n.id
    where cd.khoi=$1 group by n.id, cd.thu_tu, cd.ten, o.thu_tu, ch.ten, n.thu_tu, n.ten order by cd.thu_tu, o.thu_tu, n.thu_tu`, [khoi])
  const cs = cau.filter(r => r.khoi === khoi).map(r => ({ ma_cau: r.ma_cau, loai: r.loai_cau, de: r.noi_dung, ...(r.lua_chon ? { lua_chon: r.lua_chon } : {}),
    ...(r.dap_an ? { dap_an: r.dap_an } : {}), loi_giai: cat(r.loi_giai, 500), ...(r.anh_de ? { co_hinh: true } : {}), ...(r.ten_de_goc ? { de_goc: r.ten_de_goc } : {}) }))
  for (let i = 0, k = 0; i < cs.length; i += 100, k++) {
    const f = `cho-${khoi}${k ? '-' + k : ''}`
    fs.writeFileSync(path.join(DIR, f + '.in.json'), JSON.stringify({ danh_muc: dm, cau: cs.slice(i, i + 100) }, null, 1))
    console.log(f, 'nhóm', dm.length, 'câu', cs.slice(i, i + 100).length)
  }
}
await c.query('rollback'); await c.end()
