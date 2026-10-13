// Khảo sát (chỉ đọc): xem thô cau_hinh.deThi của 1 đề + các câu Hình tự luận của nó. node scripts/_ks_de_thi_hinh_mau.mjs 8 [thứ tự đề]
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
const q = async (s, p) => (await c.query(s, p)).rows
const khoi = process.argv[2] || '8', thu = Number(process.argv[3] || 0)
const de = (await q(`select t.id, t.ten, t.cau_hinh from tai_lieu t where t.loai='de_thi' and t.khoi=$1
   and exists (select 1 from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id=p.id join hinh_hoc_cau_hoi h on h.ma_cau=tc.ma_cau where p.tai_lieu_id=t.id and h.loai_cau='tu_luan')
   order by t.created_at, t.id offset $2 limit 1`, [khoi, thu]))[0]
console.log('ĐỀ:', de.ten)
console.log('khoá cau_hinh:', Object.keys(de.cau_hinh || {}), '· khoá deThi:', Object.keys(de.cau_hinh?.deThi || {}))
console.log('nhomBai:', JSON.stringify(de.cau_hinh?.deThi?.nhomBai ?? null).slice(0, 700))
console.log('nhanCau:', JSON.stringify(de.cau_hinh?.deThi?.nhanCau ?? null).slice(0, 500))
const cau = await q(`select tc.thu_tu, p.thu_tu pt, tc.ma_cau, h.loai_cau, h.noi_dung, h.loi_giai, h.dap_an, h.anh_de, h.anh_dap_an, h.nguon
  from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id=p.id join hinh_hoc_cau_hoi h on h.ma_cau=tc.ma_cau where p.tai_lieu_id=$1 and h.loai_cau<>'trac_nghiem' order by p.thu_tu, tc.thu_tu`, [de.id])
for (const r of cau) console.log(`\n● ${r.ma_cau} [${r.loai_cau}] phần ${r.pt} câu ${r.thu_tu} · hình đề: ${!!r.anh_de} · hình LG: ${!!r.anh_dap_an} · nguồn: ${r.nguon}\n  ĐỀ: ${(r.noi_dung||'').replace(/\n/g,' ⏎ ').slice(0,600)}\n  ĐÁP: ${(r.dap_an||'').slice(0,120)}\n  LG: ${(r.loi_giai||'').replace(/\n/g,' ⏎ ').slice(0,500)}`)
await c.query('ROLLBACK'); await c.end()
