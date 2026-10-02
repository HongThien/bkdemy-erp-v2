import pg from 'pg'; process.loadEnvFile('.env');
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect();
const sql = process.argv[2];
await c.query('begin read only');
try { const r = await c.query(sql); for (const row of r.rows) console.log(Object.values(row).map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(' | ')) }
catch (e) { console.log('LỖI', e.message) } finally { await c.query('rollback'); await c.end() }
