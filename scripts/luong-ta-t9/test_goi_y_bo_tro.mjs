// Test GỢI Ý + GHI CÔNG buổi bổ trợ (bù · yếu · đuổi) hôm nay — mig 202610142016. Chạy từ GỐC repo:
//   node scripts/luong-ta-t9/test_goi_y_bo_tro.mjs
// Lỗi gốc (Thùy 14/10): bấm "Ghi công" ô "Bổ trợ đuổi" ⇒ 'cần chọn lớp' (buổi bổ trợ không có buoi_hoc.lop_id).
// Mỗi buổi bổ trợ hôm nay: đóng vai TA đứng lớp ⇒ hoặc có ô gợi ý và GHI CÔNG ĐƯỢC từ ô đó, hoặc buổi nằm trong
// ca trực của chính TA đó (ca trực đã bao, không gợi ý riêng). Mọi thứ trong BEGIN … ROLLBACK.
import pg from 'pg'; import fs from 'fs';
import { pathToFileURL } from 'url';
const { apMigration } = await import(pathToFileURL('scripts/luong-ta-t9/_mig.mjs').href);
const env = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
let pass = 0, fail = 0;
const ok = (ten, dk, them = '') => { dk ? pass++ : fail++; console.log((dk ? '✔ ' : '✘ ') + ten + (them ? '  → ' + them : '')); };
await c.query('begin');
try {
  console.log('   migration chạy trong test:', (await apMigration(c)).join(', ') || '(đã có sẵn trên DB)');
  const homNay = "(now() at time zone 'Asia/Ho_Chi_Minh')::date";
  const buoi = await q(`select b.id, b.loai, coalesce(b.nguoi_day_tg, b.nguoi_day) ns, n.ho_ten,
      exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and coalesce(b.nguoi_day_tg, b.nguoi_day) in (c.nhan_su_id, c.nhan_su_2_id)) trong_ca
    from buoi_hoc b join nhan_su n on n.id = coalesce(b.nguoi_day_tg, b.nguoi_day)
    where b.ngay = ${homNay} and b.loai in ('bu','bo_tro_yeu','bo_tro_duoi') and b.trang_thai <> 'huy'`);
  if (!buoi.length) console.log('   (hôm nay không có buổi bổ trợ nào — chạy lại vào ngày có ca)');
  for (const b of buoi) {
    const tk = (await q('select id from tai_khoan where nhan_su_id = $1 limit 1', [b.ns]))[0];
    if (!tk) continue;
    await c.query('savepoint s');
    await c.query("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: tk.id, role: 'authenticated' })]);
    const g = (await q('select loai_viec, lop_id, ten_lop from fn_ta_hom_nay() where buoi_hoc_id = $1', [b.id]))[0];
    if (b.trong_ca) { ok(`${b.ho_ten} ${b.loai}: trong ca trực của mình ⇒ không gợi ý riêng`, !g); await c.query('rollback to savepoint s'); continue; }
    if (!g) { ok(`${b.ho_ten} ${b.loai}: có ô gợi ý`, false, 'không có'); await c.query('rollback to savepoint s'); continue; }
    const cc = (await q(`select count(*)::int n from ta_cham_cong where nhan_su_id=$1 and ngay=${homNay} and duyet<>'tu_choi'`, [b.ns]))[0].n;
    if (!cc) await q(`insert into ta_cham_cong(nhan_su_id, ngay, vao_at, created_by) values ($1, ${homNay}, now(), $1)`, [b.ns]);
    try {
      const id = (await q(`select fn_ta_khai_viec($1, ${homNay}, $2, $3) id`, [g.loai_viec, g.lop_id, b.id]))[0].id;
      const r = (await q('select l.ten_lop from ta_cong_viec cv left join lop l on l.id = cv.lop_id where cv.id = $1', [id]))[0];
      ok(`${b.ho_ten} ${b.loai}: ghi công từ ô gợi ý`, true, 'lớp ' + (r.ten_lop ?? '(không xác định — buổi là bằng chứng)'));
    } catch (e) { ok(`${b.ho_ten} ${b.loai}: ghi công từ ô gợi ý`, false, e.message); }
    await c.query('rollback to savepoint s');
  }
} catch (e) { fail++; console.log('✘ LỖI NGOÀI DỰ KIẾN:', e.message); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
