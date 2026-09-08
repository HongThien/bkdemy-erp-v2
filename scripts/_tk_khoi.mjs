// node scripts/_tk_khoi.mjs 9  → thống kê kiem_may theo khối (claude_code) + danh sách lô
import pg from 'pg'; import fs from 'fs';
const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
const url = env.match(/^DATABASE_URL\s*=\s*"?([^"\r\n]+)"?/m)?.[1];
const khoi = process.argv[2];
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await c.connect();
const r = await c.query(`select q.kiem_may, count(*)::int n, count(*) filter (where q.da_duyet)::int ky
  from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh
  where q.xoa_at is null and b.khoi = $1 and q.kiem_may_boi = 'claude_code' group by 1 order by 1`, [khoi]);
console.log('K' + khoi, r.rows);
const l = await c.query(`select l.ten, count(q.*)::int n, count(*) filter (where q.kiem_may='khop')::int khop,
  count(*) filter (where q.kiem_may='nghi')::int nghi, count(*) filter (where q.kiem_may='khong_kiem_duoc')::int kk
  from kho_kiem_lo l join dai_cau_hoi q on q.kiem_may_lo = l.id join dai_ban_do b on b.ma_dang = q.dang_chinh
  where b.khoi = $1 group by l.ten order by l.ten`, [khoi]);
console.table(l.rows);
const t = await c.query(`select count(*)::int con_lai from dai_cau_hoi q join dai_ban_do b on b.ma_dang=q.dang_chinh
  where q.xoa_at is null and q.kiem_may is null and q.dap_an is not null and q.dap_an<>'' and b.khoi=$1 and q.created_at < _kho_ngay_bat()`, [khoi]);
console.log('còn chưa kiểm (trước ngày bật):', t.rows[0].con_lai);
await c.end();
