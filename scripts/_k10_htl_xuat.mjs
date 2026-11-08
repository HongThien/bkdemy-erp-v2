import pg from 'pg'; import fs from 'node:fs'
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#')&&l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()];}))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO||env.DATABASE_URL }); await c.connect()
const D = 'kho-rules/dai/lo/k10-htl/'
const dang = (await c.query(`select d.id, n.ten nhom, d.ten, d.mo_ta, d.ly_thuyet, d.vi_du from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.id in ('NNB01410','NNB01411','NNB01412') order by n.thu_tu, d.thu_tu`)).rows
fs.writeFileSync(D+'dang.json', JSON.stringify(dang.map(d=>({ dang_id:d.id, nhom:d.nhom, dang:d.ten, mo_ta:d.mo_ta, ly_thuyet:d.ly_thuyet, vi_du:d.vi_du })),null,1))
const ids = dang.map(d=>d.id)
const cau = (await c.query(`
 select q.ma_cau, q.dang_chinh dang_cu, q.loai_cau, q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de, q.anh_dap_an, q.da_duyet, q.kho_chuan,
   'de_xuat' nguon_hang, x.dang_bai_id dx_dang, x.chac dx_chac, x.ly_do dx_ly_do
 from dai_bdm_de_xuat x join dai_cau_hoi q on q.ma_cau=x.ma_cau where x.dang_bai_id = any($1) and q.xoa_at is null
 union all
 select q.ma_cau, q.dang_chinh, q.loai_cau, q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de, q.anh_dap_an, q.da_duyet, q.kho_chuan,
   'thieu_dang', null, null, t.ly_do
 from dai_bdm_cau_thieu_dang t join dai_cau_hoi q on q.ma_cau=t.ma_cau where q.dang_chinh like 'T110%' and q.xoa_at is null
 order by 1`, [ids])).rows
fs.writeFileSync(D+'cau.json', JSON.stringify(cau,null,1))
console.log('dạng', dang.length, 'câu', cau.length, 'de_xuat', cau.filter(x=>x.nguon_hang==='de_xuat').length, 'thieu', cau.filter(x=>x.nguon_hang==='thieu_dang').length, 'có ảnh đề', cau.filter(x=>x.anh_de).length)
await c.end()
