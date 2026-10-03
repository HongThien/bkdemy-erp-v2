// Auto duyệt kho TSA (Thùy 02/10: "cho học sinh luyện tập nên không cần duyệt"). duyet_nguon='may' tường minh (không giả làm người duyệt).
// CHỈ duyệt câu: kiem_may khác 'nghi' · đáp án ĐỦ (Đúng/Sai: đủ mọi ý; tự luận: không cần) — câu thiếu/mâu thuẫn đáp án để người xem.
//   node scripts/tsa/auto-duyet.mjs [--ghi]
import pg from 'pg'; import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const DK = `xoa_at is null and not da_duyet and kiem_may is distinct from 'nghi'
  and (case loai_cau when 'dung_sai' then jsonb_array_length(coalesce(menh_de,'[]'::jsonb)) > 0 and not exists (select 1 from jsonb_array_elements(menh_de) m where coalesce(m->>'dap_an','') = '')
                     when 'tu_luan' then true
                     else coalesce(dap_an,'') <> '' end)
  and dang_chinh not like '%000000'`
try {
  await c.query('begin')
  const r = await c.query(`update tsa_cau_hoi set da_duyet = true, duyet_nguon = 'may' where ${DK}`)
  const t = await c.query(`select count(*) filter (where da_duyet) duyet, count(*) filter (where not da_duyet) chua, count(*) filter (where kho_chuan) kho_chuan from tsa_cau_hoi where xoa_at is null`)
  const ch = await c.query(`select loai_cau, kiem_may, count(*) n from tsa_cau_hoi where xoa_at is null and not da_duyet group by 1,2 order by 1,2`)
  console.log(GHI ? 'GHI' : 'CHẠY THỬ', 'duyệt thêm', r.rowCount, JSON.stringify(t.rows[0])); console.log('chưa duyệt:', JSON.stringify(ch.rows))
  await c.query(GHI ? 'commit' : 'rollback')
} catch (e) { await c.query('rollback').catch(() => {}); console.error('LỖI', e.message); process.exitCode = 1 } finally { await c.end() }
