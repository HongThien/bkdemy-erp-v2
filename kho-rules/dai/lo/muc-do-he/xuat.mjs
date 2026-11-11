// Độ khó + hệ cho dạng bài bản đồ mới Toán còn TRỐNG (Thùy 11/11 "M đề xuất độ khó đi. duyệt luôn"). CHỈ ĐỌC DB → ds.json
import pg from 'pg'; import fs from 'fs'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? process.env.DATABASE_URL }); await c.connect()
const r = (await c.query(`
  select d.id, cd.khoi, cd.ten chu_de, ch.ten chuyen_de, n.ten nhom, d.ten, left(regexp_replace(coalesce(d.mo_ta,''), '\s+', ' ', 'g'), 110) mo_ta,
         d.muc_do, d.bac_toi_thieu,
         (select round(avg(b.muc_do)) from dai_bdm_doi_ung u join dai_ban_do b on b.ma_dang = u.ma_dang_cu where u.dich_dang_bai = d.id and b.muc_do is not null)::int muc_cu,
         (select string_agg(x.muc_do::text, ',' order by x.thu_tu) from dai_bdm_dang_bai x where x.nhom_id = n.id and x.id <> d.id and x.muc_do is not null) muc_anh_em
    from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
    join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
   where d.muc_do is null or d.bac_toi_thieu is null
   order by cd.khoi, cd.thu_tu, n.thu_tu, d.thu_tu`)).rows
await c.end()
fs.writeFileSync('kho-rules/dai/lo/muc-do-he/ds.json', JSON.stringify(r, null, 1))
const can = r.filter((x) => x.muc_do == null && x.muc_cu == null)
console.log('trống mức hoặc hệ:', r.length, '| trống mức:', r.filter((x) => x.muc_do == null).length, '| lấy từ cũ:', r.filter((x) => x.muc_do == null && x.muc_cu != null).length, '| cần đề xuất:', can.length)
fs.writeFileSync('kho-rules/dai/lo/muc-do-he/can-de-xuat.txt', can.map((x) => `${x.id}\tK${x.khoi}\t${x.chu_de} › ${x.nhom}\t${x.ten}${x.mo_ta ? ' — ' + x.mo_ta : ''}${x.muc_anh_em ? `\t[anh em: ${x.muc_anh_em}]` : ''}`).join('\n'))
