// node --input-type=module - <khối> < scripts/kho/bdm-ly-thuyet.mjs  (chạy từ gốc repo; in cây bản đồ mới + lý thuyết + ví dụ)
// Chỉ đọc: dump toàn bộ lý thuyết K6 của bản đồ mới (chủ đề → chuyên đề → nhóm → dạng bài) theo thứ tự hiển thị
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>/^[A-Z_]+=/.test(l)).map(l=>[l.slice(0,l.indexOf('=')),l.slice(l.indexOf('=')+1).replace(/^"|"$/g,'')]))
const c = new pg.Client({connectionString: env.DATABASE_URL}); await c.connect()
await c.query('begin read only')
const q = async (s, p=[])=> (await c.query(s, p)).rows
const KHOI = process.argv[2] ?? '6'
const rows = await q(`
  select cd.thu_tu cd_tt, cd.ten chu_de, o.thu_tu o_tt, ch.ten chuyen_de, ch.mo_ta ch_mota,
         n.id nhom_id, n.thu_tu n_tt, n.ten nhom, n.mo_ta n_mota, n.ly_thuyet n_lt, n.ly_thuyet_file_url n_file,
         coalesce(json_agg(json_build_object('id',d.id,'tt',d.thu_tu,'ten',d.ten,'mo_ta',d.mo_ta,'lt',d.ly_thuyet,'vd',d.vi_du,'vd_file',d.vi_du_file_url,'lt_file',d.ly_thuyet_file_url) order by d.thu_tu) filter (where d.id is not null),'[]') dang
  from dai_bdm_chu_de cd
  join dai_bdm_o o on o.chu_de_id=cd.id
  join dai_bdm_chuyen_de ch on ch.id=o.chuyen_de_id
  left join dai_bdm_nhom n on n.chu_de_id=o.chu_de_id and n.chuyen_de_id=o.chuyen_de_id
  left join dai_bdm_dang_bai d on d.nhom_id=n.id
  where cd.khoi=$1
  group by cd.thu_tu, cd.ten, o.thu_tu, ch.ten, ch.mo_ta, n.id, n.thu_tu, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url
  order by cd.thu_tu, o.thu_tu, n.thu_tu`, [KHOI])
let cdCu='', chCu=''
for (const r of rows) {
  if (r.chu_de!==cdCu) { console.log(`\n\n######## CHỦ ĐỀ ${r.cd_tt}. ${r.chu_de}`); cdCu=r.chu_de; chCu='' }
  if (r.chuyen_de!==chCu) { console.log(`\n==== Chuyên đề ${r.o_tt}. ${r.chuyen_de}${r.ch_mota?' — '+r.ch_mota:''}`); chCu=r.chuyen_de }
  if (!r.nhom_id) continue
  console.log(`\n--- Nhóm ${r.n_tt}. ${r.nhom} [${r.nhom_id}]${r.n_mota?'\nMô tả: '+r.n_mota:''}${r.n_file?'\nFile LT: '+r.n_file:''}`)
  if (r.n_lt) console.log(`LÝ THUYẾT:\n${r.n_lt}`)
  for (const d of r.dang) {
    console.log(`  · Dạng ${d.tt}. ${d.ten} [${d.id}]${d.mo_ta?' — '+d.mo_ta:''}${d.vd_file?' (file VD '+d.vd_file+')':''}${d.lt_file?' (file LT '+d.lt_file+')':''}`)
    if (d.lt) console.log(`    LT: ${d.lt}`)
    if (d.vd) console.log(`    VÍ DỤ: ${d.vd}`)
  }
}
await c.query('rollback'); await c.end()
