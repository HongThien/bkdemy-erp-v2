import pg from 'pg'
import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: envf('.env').DATABASE_URL }); await c.connect()
const r = await c.query(`
  select id, thu_tu, lua_chon, dap_an_key from bai_test_cau
  where bai_test_id='7ca30d8b-6375-4304-826a-c585703b4885' and loai_cau='trac_nghiem' and noi_dung ilike '%bảng biến thiên%'
`)
console.log(JSON.stringify(r.rows, null, 2))
await c.end()
