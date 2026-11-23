// Hình–Học K8 · 136 câu cuối kì 1 đã được TÁCH Ý từ 16/11 (hinh_hoc_bai_y, thẻ ý nằm ở HH08000000) — lượt dời trước chỉ đổi câu GỐC
// nên kho các chuyên đề vẫn "chưa có câu" (count_cau_by_bai_hh ẩn câu gốc đã tách ý, hiện thẻ ý thay). Dời THẺ Ý theo câu gốc + duyệt ý.
//   hinh_hoc_bai_y.dang_chinh := dang_chinh của câu gốc → trigger lan sang các ý (hinh_hoc_cau_hoi.bai_y) tự đổi dang_chinh.
//   Duyệt ý: da_duyet=true, duyet_nguon='ai' (8 ý 'nghi' của 2 câu đã sửa đề cũng duyệt). Script máy được phép ghi (bản đồ khoá chỉ chặn người dùng app).
//   node scripts/kho/hh-k8-cuoi-ki-doi-the-y.mjs          ⇒ chạy thử ROLLBACK
//   node scripts/kho/hh-k8-cuoi-ki-doi-the-y.mjs --ghi    ⇒ commit (bản lùi: _luu-tru/du-lieu/hh-k8-cuoi-ki-doi-the-y-23-11.json)
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const goc = JSON.parse(fs.readFileSync('_luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json', 'utf8')).map((x) => x.ma_cau)
const ds = [...new Set([...goc, 'HHC015574'])]
await c.query('begin')
try {
  // 0) 2 câu đã sửa chữ đề ở câu gốc (hh-k8-sua-de-2-cau-loi-duyet) ⇒ sửa nốt trên thẻ ý + các ý (đề ghép = lời dẫn + ý, không sửa thẳng được)
  const lg0 = []
  {
    const y1 = await q(`select loi_dan from hinh_hoc_bai_y where ma_bai_y = 'HHB000963'`)
    if (y1[0].loi_dan.split('Gọi $D$ là điểm đối xứng với $H$ qua $AC$.').length !== 2) throw new Error('lời dẫn HHB000963 không khớp')
    await q(`update hinh_hoc_bai_y set loi_dan = replace(loi_dan, 'Gọi $D$ là điểm đối xứng với $H$ qua $AC$.', 'Gọi $D$, $E$ lần lượt là điểm đối xứng với $H$ qua $AB$ và $AC$.') where ma_bai_y = 'HHB000963'`)
    const y2 = await q(`select ma_cau, cau_hoi_y from hinh_hoc_cau_hoi where ma_cau = 'HHC017465'`)
    if (y2[0].cau_hoi_y.trim() !== 'Tứ giác $DECF$ là hình bình hành.') throw new Error('ý a HHC017465 không khớp: ' + y2[0].cau_hoi_y)
    await q(`update hinh_hoc_cau_hoi set cau_hoi_y = 'Tứ giác $EMCF$ là hình bình hành.' where ma_cau = 'HHC017465'`)
    for (const r of await q(`select ma_cau, loi_giai from hinh_hoc_cau_hoi where ma_cau in ('HHC017281','HHC017282','HHC017283','HHC017284')`)) {
      const moi = r.loi_giai.replace(/Bổ sung đề:[^\n]*\n?/g, '').replace(/\(đề bổ sung\)/g, '(gt)')
      lg0.push({ ma_cau: r.ma_cau, loi_giai_cu: r.loi_giai })
      await q(`update hinh_hoc_cau_hoi set loi_giai = $2 where ma_cau = $1`, [r.ma_cau, moi])
    }
    const con = await q(`select ma_cau from hinh_hoc_cau_hoi where ma_cau in ('HHC017281','HHC017282','HHC017283','HHC017284') and loi_giai ~ 'Bổ sung đề|đề bổ sung'`)
    if (con.length) throw new Error('còn chữ "bổ sung đề" ở ' + con.map((x) => x.ma_cau))
    console.log('đã sửa đề trên thẻ ý + 5 ý (4 lời giải bỏ "bổ sung đề")')
  }
  const the = await q(`select y.ma_bai_y, y.ma_cau_goc, y.dang_chinh tu, c.dang_chinh den from hinh_hoc_bai_y y join hinh_hoc_cau_hoi c on c.ma_cau = y.ma_cau_goc where y.xoa_at is null and y.ma_cau_goc = any($1)`, [ds])
  console.log('thẻ ý của 136 câu:', the.length, ' (cần ≤ 136)')
  const lech = the.filter((t) => t.tu !== 'HH08000000'); if (lech.length) console.log('đã ở bài khác (bỏ qua):', lech.map((t) => t.ma_bai_y + '@' + t.tu).join(' '))
  const doi = the.filter((t) => t.tu === 'HH08000000' && t.den !== 'HH08000000')
  const lui = doi.map((t) => ({ ma_bai_y: t.ma_bai_y, ma_cau_goc: t.ma_cau_goc, tu: t.tu, den: t.den }))
  for (const t of doi) await q(`update hinh_hoc_bai_y set dang_chinh = $2 where ma_bai_y = $1 and dang_chinh = $3`, [t.ma_bai_y, t.den, t.tu])
  console.log('dời thẻ ý:', doi.length)
  const ids = the.map((t) => t.ma_bai_y)
  const sai = await q(`select c.ma_cau, c.dang_chinh, y.ma_cau_goc, g.dang_chinh dg from hinh_hoc_cau_hoi c join hinh_hoc_bai_y y on y.ma_bai_y = c.bai_y join hinh_hoc_cau_hoi g on g.ma_cau = y.ma_cau_goc where c.bai_y = any($1) and c.xoa_at is null and c.dang_chinh <> g.dang_chinh`, [ids])
  if (sai.length) throw new Error('còn ý lệch bài so với câu gốc: ' + sai.length)
  const nghi = await q(`select ma_cau, kiem_may_ghi from hinh_hoc_cau_hoi where bai_y = any($1) and xoa_at is null and kiem_may = 'nghi'`, [ids])
  console.log('ý máy nghi (không duyệt):', nghi.length); nghi.forEach((n) => console.log('  ', n.ma_cau, (n.kiem_may_ghi || '').slice(0, 140)))
  const du = await q(`update hinh_hoc_cau_hoi set da_duyet = true, duyet_at = now(), duyet_nguon = 'ai' where bai_y = any($1) and xoa_at is null and not da_duyet returning ma_cau`, [ids])
  console.log('duyệt ý:', du.length)
  const dem = await q(`select c.dang_chinh, count(distinct y.ma_bai_y) the, count(*) y_cau, count(*) filter (where c.da_duyet) duyet, count(*) filter (where c.kho_chuan) chuan from hinh_hoc_cau_hoi c join hinh_hoc_bai_y y on y.ma_bai_y = c.bai_y where c.bai_y = any($1) and c.xoa_at is null group by 1 order by 1`, [ids])
  console.table(dem)
  // đếm theo đúng công thức màn kho (count_cau_by_bai_hh) — câu gốc ẩn, thẻ ý hiện
  const man = await q(`select y.dang_chinh, count(*) the from hinh_hoc_bai_y y where y.xoa_at is null and y.ma_bai_y = any($1) group by 1 order by 1`, [ids]); console.log('thẻ ý theo bài:', JSON.stringify(man))
  if (GHI) { fs.writeFileSync('_luu-tru/du-lieu/hh-k8-cuoi-ki-doi-the-y-23-11.json', JSON.stringify({ the: lui, lg_cu: lg0, duyet_y: du.map((x) => x.ma_cau) }, null, 1)); await c.query('commit'); console.log('ĐÃ GHI (commit)') }
  else { await c.query('rollback'); console.log('(chạy thử — ROLLBACK)') }
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
