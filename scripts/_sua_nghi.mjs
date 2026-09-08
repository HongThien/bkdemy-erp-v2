// node scripts/_sua_nghi.mjs <ma_cau> "<ghi>" — AI tự sửa 1 câu mình đã ghi 'khop' thành 'nghi' (gỡ ký AI). Chỉ đụng câu kiem_may_boi='claude_code'.
import pg from 'pg'; import fs from 'fs';
const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
const url = env.match(/^DATABASE_URL\s*=\s*"?([^"\r\n]+)"?/m)?.[1];
const [ma, ghi] = process.argv.slice(2);
if (!ma || !ghi) { console.error('Dùng: node scripts/_sua_nghi.mjs <ma_cau> "<ghi>"'); process.exit(1) }
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await c.connect();
const r = await c.query(`update dai_cau_hoi set kiem_may='nghi', kiem_may_ghi=$2,
    da_duyet=false, duyet_nguon=null, duyet_at=null
  where ma_cau=$1 and kiem_may_boi='claude_code' and kiem_may='khop'
  returning ma_cau, kiem_may, da_duyet, kiem_may_lo`, [ma, ghi]);
console.log(r.rowCount ? r.rows[0] : 'không sửa (câu không phải khop của claude_code)');
await c.end();
