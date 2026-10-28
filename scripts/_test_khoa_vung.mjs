// Kiểm mig bdm_chu_de_hinh_gop_khoa_vung TRONG ROLLBACK
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
const chan = async (sql, re, t) => { try { await q('savepoint s'); await q(sql); await q('rollback to savepoint s'); kt(false, t + ' (KHÔNG bị chặn)') } catch (e) { await q('rollback to savepoint s'); kt(re.test(e.message), t + ': ' + e.message.slice(0, 90)) } }
try {
  await q('begin')
  if (process.argv.includes('--mig')) await q(fs.readFileSync(fs.readdirSync('supabase/migrations').filter((x) => x.endsWith('_bdm_chu_de_hinh_gop_khoa_vung.sql')).map((x) => 'supabase/migrations/' + x).pop(), 'utf8'))
  const v = await q(`select nhanh, count(*)::int n from dai_bdm_chu_de group by 1 order by 1`)
  kt(!v.some((r) => r.nhanh === 'hinh_hoc' || r.nhanh === 'hinh_luyen'), 'không còn chủ đề vùng hinh_hoc/hinh_luyen: ' + JSON.stringify(v))
  const [dai] = await q(`select id, ten from dai_bdm_chu_de where nhanh = 'toan' and khoi = '9' and _bdm_chu_de_co_noi_dung(id) limit 1`)
  await chan(`update dai_bdm_chu_de set nhanh = 'hgt' where id = '${dai.id}'`, /khoá/, `đổi vùng chủ đề Đại có nội dung «${dai.ten}»`)
  await chan(`update dai_bdm_chu_de set nhanh = 'toan' where id = 'NCD00178'`, /khoá/, 'đổi vùng chủ đề Hình «Tứ giác» (có mô hình)')
  await chan(`insert into dai_bdm_chu_de (khoi, ten, nhanh) values ('9', '[THỬ]', 'hinh_luyen')`, /gộp/, 'tạo chủ đề vùng hinh_luyen')
  const [moi] = await q(`insert into dai_bdm_chu_de (khoi, ten, nhanh) values ('9', '[THỬ] rỗng', 'toan') returning id`)
  await q(`update dai_bdm_chu_de set nhanh = 'hinh' where id = $1`, [moi.id])
  kt((await q(`select nhanh from dai_bdm_chu_de where id = $1`, [moi.id]))[0].nhanh === 'hinh', 'chủ đề còn rỗng vẫn đổi vùng được (tạo nhầm thì sửa)')
  await q(`update dai_bdm_chu_de set ten = ten where id = $1`, [dai.id]); kt(true, 'sửa tên chủ đề có nội dung vẫn được')
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
