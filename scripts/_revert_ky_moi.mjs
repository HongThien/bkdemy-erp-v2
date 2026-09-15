// tạm (untracked): AI lô mức B đã KÝ nhầm câu MỚI (created_at >= NGÀY BẬT — đang được phiên khác nhập kho song song).
// Spec kho chuẩn: câu mới phải qua cửa 1 (người duyệt). Gỡ chữ ký AI, GIỮ kiem_may='khop' (kết quả kiểm vẫn đúng).
//   node scripts/_revert_ky_moi.mjs            → đếm (dry run)
//   node scripts/_revert_ky_moi.mjs --go       → thực hiện
import pg from 'pg';
import fs from 'node:fs';
const url = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1];
const go = process.argv.includes('--go');
const cl = new pg.Client({ connectionString: url });
await cl.connect();
const where = `kiem_may_boi = 'claude_code' and duyet_nguon = 'ai' and da_duyet and created_at >= _kho_ngay_bat() and xoa_at is null`;
const { rows } = await cl.query(`select l.ten, count(*) n from dai_cau_hoi q left join kho_kiem_lo l on l.id = q.kiem_may_lo where ${where} group by l.ten order by l.ten`);
console.table(rows);
if (go) {
  const r = await cl.query(`update dai_cau_hoi set da_duyet = false, duyet_nguon = null, duyet_at = null,
      kiem_may_ghi = coalesce(kiem_may_ghi, '') || ' [gỡ ký AI 08/09: câu tạo sau NGÀY BẬT → chờ người duyệt cửa 1]'
    where ${where}`);
  console.log('đã gỡ ký', r.rowCount, 'câu');
}
await cl.end();
