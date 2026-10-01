// Read-only: câu TRẢ LỜI NGẮN vẫn lọt vào bài bổ trợ yếu SAU khi áp MCQ-first (19/09 13:20 VN) — vì sao (dạng 0 MCQ? cụm 0 MCQ?)
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const MCQ = `(c.kho_chuan and ((c.loai_cau='trac_nghiem' and c.dap_an is not null) or exists (select 1 from dai_cau_form_tn f where f.ma_cau=c.ma_cau and f.da_duyet and f.xoa_at is null)))`
const r = await c.query(`
  select hs.khoi, hs.ho_ten, t.loai, (t.created_at at time zone 'Asia/Ho_Chi_Minh')::text tao, k.ma_dang, k.ma_cum, k.loai_cau, count(*)::int n,
    (select count(*)::int from dai_cau_hoi c where c.dang_chinh=k.ma_dang and c.xoa_at is null and ${MCQ}) mcq_dang,
    (select count(*)::int from dai_cau_hoi c where c.dang_chinh=k.ma_dang and c.ma_cum is not distinct from k.ma_cum and c.xoa_at is null and ${MCQ}) mcq_cum
  from bai_test t join bai_test_cau k on k.bai_test_id=t.id join hoc_sinh hs on hs.id=t.hoc_sinh_id
  where t.loai in ('bo_tro','bo_tro_test','retest') and t.created_at >= '2026-09-19T06:20:00Z' and k.loai_cau <> 'trac_nghiem'
  group by 1,2,3,4,5,6,7 order by 4 desc`)
console.log('lô có câu KHÔNG phải trắc nghiệm, sinh sau khi áp MCQ-first:', r.rows.length)
for (const x of r.rows) console.log(` K${x.khoi} ${x.ho_ten} · ${x.loai} ${x.tao.slice(5, 16)} · ${x.ma_dang} cụm=${x.ma_cum ?? '-'} · ${x.loai_cau}×${x.n} · MCQ của dạng=${x.mcq_dang} · của cụm=${x.mcq_cum}`)
const t = await c.query(`select k.loai_cau, count(*)::int n from bai_test t join bai_test_cau k on k.bai_test_id=t.id where t.loai in ('bo_tro','bo_tro_test','retest') and t.created_at >= '2026-09-19T06:20:00Z' group by 1`)
console.log('tổng câu sinh sau khi áp:', JSON.stringify(t.rows))
await c.end()
