// Khảo sát các dạng khối 7 (nhánh Đại) — dạng nào ĐỦ ĐIỀU KIỆN làm TN 4 đáp án theo spec-mcq-form.md.
// Đọc-only (SELECT), dùng DATABASE_URL hiện có (claude_build) — chỉ SELECT, không ghi.
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 20000 })
await c.connect()

const { rows: dangs } = await c.query(`
  select ma_dang, ten_chu_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu
  from dai_ban_do where khoi = '7' order by ma_dang`)

const POOL1 = new Set(['T107010201','T107010202','T107010203','T107010206','T107010207','T107010401','T107010403','T107010404','T107010301'])

const out = []
for (const d of dangs) {
  const { rows: [agg] } = await c.query(`
    select count(*)::int as tong,
      count(*) filter (where dap_an is not null and dap_an <> '')::int as co_dap_an,
      count(*) filter (where loai_cau = 'tu_luan')::int as tu_luan,
      count(*) filter (where loai_cau = 'trac_nghiem')::int as da_tn,
      count(*) filter (where loai_cau = 'tra_loi_ngan')::int as tln,
      count(*) filter (where loai_cau = 'dung_sai')::int as dung_sai,
      count(*) filter (where xoa_at is null and exists (select 1 from dai_cau_form_tn f where f.ma_cau = q.ma_cau and f.xoa_at is null))::int as da_co_form,
      count(*) filter (where noi_dung ~ '[a-eA-E]\\s*\\)\\s*\\$' or noi_dung ~ '\\n\\s*[a-eA-E]\\)')::int as nhieu_y,
      count(*) filter (where noi_dung ~* 'chứng minh|CMR')::int as chung_minh,
      count(*) filter (where dap_an ~ '[;,]' and dap_an !~ '^\\s*[-0-9.,;\\\\{}dfrac()\\s$]+$')::int as dapan_phuctap_tho
    from dai_cau_hoi q where dang_chinh = $1 and xoa_at is null`, [d.ma_dang])
  const { rows: samples } = await c.query(`
    select ma_cau, noi_dung, dap_an from dai_cau_hoi
    where dang_chinh = $1 and xoa_at is null and dap_an is not null and dap_an <> ''
    order by random() limit 3`, [d.ma_dang])
  out.push({ ...d, ...agg, samples, pool1: POOL1.has(d.ma_dang) })
}
await c.end()
console.log(JSON.stringify(out, null, 1))
