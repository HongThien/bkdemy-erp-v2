// tạm (untracked): node scripts/_chk_created.mjs lo.json → created_at min/max + số câu tạo SAU ngày bật + đã duyệt
import fs from 'node:fs';
import pg from 'pg';
const url = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1];
const f = process.argv[2];
const a = JSON.parse(fs.readFileSync(f, 'utf8'));
const c = a.cau || a.items || a;
const ids = c.map(x => x.ma_cau);
const cl = new pg.Client({ connectionString: url });
await cl.connect();
const r = await cl.query(
  `select to_char(min(created_at) at time zone 'Asia/Ho_Chi_Minh','MM-DD HH24:MI') mn,
          to_char(max(created_at) at time zone 'Asia/Ho_Chi_Minh','MM-DD HH24:MI') mx,
          count(*) filter (where created_at >= _kho_ngay_bat()) sau_bat,
          count(*) filter (where da_duyet) da_duyet, count(*) n
   from dai_cau_hoi where ma_cau = any($1)`, [ids]);
console.log(f.split(/[\\/]/).pop(), r.rows[0]);
await cl.end();
