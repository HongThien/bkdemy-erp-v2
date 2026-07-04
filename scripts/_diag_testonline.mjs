import pg from 'pg'
import { readFileSync } from 'fs'
const url = readFileSync('.env','utf8').split('\n').find(l=>l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()

console.log('== trac_nghiem: dap_an + lua_chon shape ==')
console.table((await c.query(`select ma_cau, left(dap_an,20) dap_an, left(lua_chon::text,80) lua_chon from dai_cau_hoi where loai_cau='trac_nghiem' order by created_at desc limit 6`)).rows)

console.log('== dung_sai raw rows (dai) ==')
;(await c.query(`select ma_cau, dap_an, menh_de, left(lua_chon::text,60) lua_chon from dai_cau_hoi where loai_cau='dung_sai'`)).rows.forEach(r=>console.log(r.ma_cau,'| dap_an=',r.dap_an,'| menh_de=',JSON.stringify(r.menh_de)?.slice(0,300),'| lua_chon=',r.lua_chon))

console.log('== tra_loi_ngan cleanliness: chứa $ (LaTeX/biểu thức) vs số thuần ==')
console.table((await c.query(`
  select
    count(*) tong,
    count(*) filter (where dap_an ~ '\\$') co_latex,
    count(*) filter (where dap_an ~ '[a-zA-Z]') co_chu,
    count(*) filter (where dap_an ~ '^[-+]?[0-9]+([.,][0-9]+)?(\\s*;\\s*[-+]?[0-9]+([.,][0-9]+)?)*$') so_thuan_hoac_list
  from dai_cau_hoi where loai_cau='tra_loi_ngan' and dap_an is not null`)).rows)

console.log('== phân bố loai_cau theo KHỐI (dai_ban_do.khoi) — xem cấp 3 (10-12) có gì ==')
console.table((await c.query(`
  select b.khoi, q.loai_cau, count(*) n
  from dai_cau_hoi q join dai_ban_do b on b.ma_dang=q.dang_chinh
  where b.khoi in ('10','11','12')
  group by b.khoi, q.loai_cau order by b.khoi, n desc`)).rows)

console.log('== ET/BTVN docs hiện có (tai_lieu loai et/btvn) ==')
console.table((await c.query(`select loai, count(*) n from tai_lieu where loai in ('et','btvn') group by loai`)).rows)

await c.end()
