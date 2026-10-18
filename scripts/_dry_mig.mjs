// Chạy 1 file migration trong transaction rồi ROLLBACK (kiểm cú pháp/ràng buộc, không để lại gì).
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
c.on('notice', (n) => console.log('NOTICE', n.message)); await c.query('begin')
try { await c.query(fs.readFileSync(process.argv[2], 'utf8')); console.log('OK cú pháp + chạy được (sắp rollback)')
  if (process.argv[3]) { const r = await c.query(fs.readFileSync(process.argv[3], 'utf8')); console.log(JSON.stringify(r.rows ?? r, null, 1).slice(0, 3000)) }
} catch (e) { console.log('LỖI:', e.message, e.position ?? '') }
await c.query('rollback'); await c.end()
