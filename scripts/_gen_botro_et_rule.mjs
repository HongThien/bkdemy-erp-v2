import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
let d = (await c.query("select pg_get_functiondef(p.oid) d from pg_proc p where proname='fn_botro_et_btvn' and pronamespace='public'::regnamespace")).rows[0].d.split(String.fromCharCode(13, 10)).join('\n')
const sub = (s, a, b) => { if (!s.includes(a)) throw new Error('KHÔNG KHỚP ' + a); return s.replace(a, b) }
d = sub(d, '(x.n >= 4 and x.diem < x.tb and x.diem <= x.thap2)', '(x.n >= 4 and x.so_bang * 2 <= x.n and x.diem < x.tb and x.diem <= x.thap2)')
d = sub(d, '(x.n >= 4 and x.diem > x.tb and x.diem >= x.cao2)', '(x.n >= 4 and x.so_bang * 2 <= x.n and x.diem > x.tb and x.diem >= x.cao2)')
fs.writeFileSync(process.argv[2], '-- Thùy 17/10: luật "2 cuối / 2 đầu lớp" KHÔNG áp khi QUÁ NỬA lớp cùng điểm với em (vd 9/10 bạn cùng 50% thì không ai là "2 cuối lớp" — rơi về luật so TB).\n-- Hai mốc theo TB lớp (<85% / >115%) giữ nguyên.\n' + d + ';\n'); await c.end(); console.log('ok')
