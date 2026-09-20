// Read-only: 25 dạng bổ trợ đang 0 MCQ — đã có form ĐIỀN Ô chưa (dai_cau_form_dien), hình dạng đáp số, pipeline TN nhận được không
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const r = await c.query(`
  with dg as (select d.ma_dang, count(distinct y.id)::int so_case from bo_tro_yeu y join bo_tro_yeu_dang d on d.bo_tro_yeu_id=y.id where y.mon='Toán' and y.trang_thai='dang_xu' and d.dong_at is null group by 1)
  select dg.ma_dang, dg.so_case, left(b.ten_dang, 46) ten,
    (select count(*)::int from dai_cau_hoi c where c.dang_chinh=dg.ma_dang and c.xoa_at is null and c.kho_chuan) cau,
    (select count(*)::int from dai_cau_hoi c where c.dang_chinh=dg.ma_dang and c.xoa_at is null and c.kho_chuan and c.loai_cau='tu_luan') tu_luan,
    (select count(*)::int from dai_cau_form_dien f join dai_cau_hoi c on c.ma_cau=f.ma_cau where c.dang_chinh=dg.ma_dang and f.xoa_at is null and f.da_duyet) dien_duyet,
    (select count(*)::int from dai_cau_form_dien f join dai_cau_hoi c on c.ma_cau=f.ma_cau where c.dang_chinh=dg.ma_dang and f.xoa_at is null and not f.da_duyet) dien_cho,
    (select count(*)::int from dai_cau_form_tn f join dai_cau_hoi c on c.ma_cau=f.ma_cau where c.dang_chinh=dg.ma_dang and f.tu_choi_ly_do is not null) tn_tu_choi,
    (select left(c.dap_an, 40) from dai_cau_hoi c where c.dang_chinh=dg.ma_dang and c.xoa_at is null and c.kho_chuan and c.dap_an is not null limit 1) mau_dap_an
  from dg join dai_ban_do b on b.ma_dang=dg.ma_dang
  where not exists (select 1 from dai_cau_hoi c where c.dang_chinh=dg.ma_dang and c.xoa_at is null and c.kho_chuan and ((c.loai_cau='trac_nghiem' and c.dap_an is not null) or exists (select 1 from dai_cau_form_tn f where f.ma_cau=c.ma_cau and f.da_duyet and f.xoa_at is null)))
  order by dg.so_case desc, dg.ma_dang`)
for (const x of r.rows) console.log(`${x.ma_dang} ${String(x.so_case).padStart(2)}case · ${String(x.cau).padStart(3)} câu · điền-ô duyệt ${String(x.dien_duyet).padStart(3)} chờ ${String(x.dien_cho).padStart(3)} · TN từ chối ${x.tn_tu_choi} · ${x.ten} · đáp án mẫu: ${(x.mau_dap_an ?? '').replace(/\s+/g, ' ')}`)
const s = r.rows; console.log(`\nTỔNG ${s.length} dạng · có điền-ô ĐÃ DUYỆT: ${s.filter(x => x.dien_duyet > 0).length} dạng (${s.filter(x => x.dien_duyet > 0).reduce((a, x) => a + x.so_case, 0)} lượt case) · có điền-ô CHỜ duyệt: ${s.filter(x => x.dien_duyet === 0 && x.dien_cho > 0).length} · chưa có gì: ${s.filter(x => x.dien_duyet === 0 && x.dien_cho === 0).length}`)
await c.end()
