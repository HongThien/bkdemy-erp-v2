// phan-hinh-doi-xung-2310.mjs — phân lại câu HÌNH K6 ở hàng "thiếu dạng" về 2 dạng mới Thùy thêm 23/10: NDB01417 (trục đối xứng) · NDB01418 (tâm đối xứng).
//   node kho-rules/dai/lo/k6/ban-do-moi/phan-hinh-doi-xung-2310.mjs [--ghi]   (mặc định ROLLBACK)
// Quy tắc (đọc đề): chỉ nhắc "tâm" ⇒ 01418; chỉ "trục" ⇒ 01417; cả hai ⇒ 01418 (luật "dạng sau thắng"); câu có ý VẼ hình ⇒ mức vừa. Chỉ đụng dòng nguon='ai'.
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
try {
  await c.query('begin')
  const rows = (await c.query(`select t.ma_cau, t.ly_do, q.noi_dung from hgt_bdm_cau_thieu_dang t join hgt_cau_hoi q on q.ma_cau = t.ma_cau
     where t.nguon = 'ai' and t.chu_de_id in (select id from dai_bdm_chu_de where khoi = '6') and (q.noi_dung ilike '%đối xứng%' or t.ly_do ilike '%đối xứng%') order by t.ma_cau`)).rows
  let cao = 0, vua = 0
  for (const r of rows) {
    const dec = (x) => ({ tam: /tâm đối xứng/.test(x), truc: /trục đối xứng/.test(x) })
    let { tam, truc } = dec(r.noi_dung.toLowerCase())
    if (!tam && !truc) ({ tam, truc } = dec(r.ly_do.toLowerCase()))
    if (!tam && !truc) { console.log('BỎ QUA', r.ma_cau, r.noi_dung.slice(0, 60)); continue }
    const dang = tam ? 'NDB01418' : 'NDB01417'
    const ve = /(^|[\s)])vẽ\s/i.test(r.noi_dung)
    await c.query(`delete from hgt_bdm_cau_thieu_dang where ma_cau = $1 and nguon = 'ai'`, [r.ma_cau])
    if (ve) { await c.query(`insert into hgt_bdm_de_xuat(ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1,$2,'vua',$3,'ai') on conflict (ma_cau) do nothing`, [r.ma_cau, dang, 'Câu có ý vẽ hình rồi hỏi số trục đối xứng; phần nhận biết thuộc dạng này']); vua++ }
    else { await c.query(`insert into hgt_bdm_gan_cau(ma_cau, dang_bai_id, nguon) values ($1,$2,'ai') on conflict (ma_cau) do nothing`, [r.ma_cau, dang]); cao++ }
    console.log(ve ? 'vừa' : 'cao', dang, r.ma_cau, '|', r.noi_dung.replace(/\n/g, ' ').slice(0, 70))
  }
  console.log(`cao ${cao} · vừa ${vua}`)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
