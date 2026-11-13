import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
const one = async (q, p) => (await c.query(q, p)).rows[0];
const thu = async (ten, f) => { await c.query('savepoint s'); let v; try { v = await f(); } catch (e) { v = 'LỖI [' + e.code + '] ' + e.message.slice(0, 140); } await c.query('rollback to savepoint s'); console.log('  ' + ten.padEnd(58), typeof v === 'string' ? v : JSON.stringify(v)); };
const lech = async () => (await one(`select count(*)::int n from public.fn_kho_cau_dang_lech()`)).n;
const t0 = Date.now();
try {
  await c.query('begin');
  const t1 = Date.now(); await c.query(fs.readFileSync(S + '/tra.sql', 'utf8')); console.log('áp + đổ dữ liệu:', Date.now() - t1, 'ms');
  console.log('bảng tra:', JSON.stringify((await c.query(`select kho, count(*)::int n, count(*) filter (where nguon='gan_cau')::int gan, count(*) filter (where nguon='de_xuat')::int dx from public.kho_cau_dang group by 1 order by 1`)).rows));
  // SO KHOP voi view hien tai (dai + hgt)
  const sk = await one(`select (select count(*) from public.bdm_cau_dang)::int view_n, (select count(*) from public.kho_cau_dang where kho in ('dai','hgt'))::int bang_n,
     (select count(*) from (select kho, ma_cau, dang_bai_id, nguon from public.bdm_cau_dang except select kho, ma_cau, dang_bai_id, nguon from public.kho_cau_dang) x)::int view_tru_bang,
     (select count(*) from (select kho, ma_cau, dang_bai_id, nguon from public.kho_cau_dang where kho in ('dai','hgt') except select kho, ma_cau, dang_bai_id, nguon from public.bdm_cau_dang) x)::int bang_tru_view`);
  console.log('SO KHỚP VỚI VIEW bdm_cau_dang:', JSON.stringify(sk));
  console.log('đối chiếu lưu sẵn ↔ tính trực tiếp (phải 0):', await lech());
  // thu trigger qua TEN CU
  const goc = await one(`select q.ma_cau from dai_cau_hoi q where q.parent_ma_cau is null and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau=q.ma_cau) and not exists (select 1 from dai_bdm_de_xuat d where d.ma_cau=q.ma_cau) and exists (select 1 from dai_cau_hoi k where k.parent_ma_cau = q.ma_cau) limit 1`);
  const db = await c.query(`select id from dai_bdm_dang_bai order by id limit 2`); const [D1, D2] = db.rows.map(r => r.id);
  console.log('\nTHỬ TRIGGER (ghi qua tên cũ dai_*), câu gốc', goc?.ma_cau, 'có bản sao:');
  const xem = async () => (await c.query(`select t.ma_cau = $1 la_goc, t.dang_bai_id, t.nguon from public.kho_cau_dang t where t.kho='dai' and (t.ma_cau = $1 or t.ma_cau in (select ma_cau from dai_cau_hoi where parent_ma_cau = $1)) order by 1 desc`, [goc.ma_cau])).rows.map(r => (r.la_goc ? 'gốc' : 'sao') + ':' + r.dang_bai_id + '/' + r.nguon).join(' ');
  if (goc) await thu('đề xuất → gán → đổi dạng → bỏ gán → bỏ đề xuất', async () => {
    const b = []; b.push('đầu[' + await xem() + ']');
    await c.query(`insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1, $2, 'cao', 'thu', 'ai')`, [goc.ma_cau, D1]); b.push('đx[' + await xem() + ']');
    await c.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon) values ($1, $2, 'nguoi')`, [goc.ma_cau, D2]); b.push('gán[' + await xem() + ']');
    await c.query(`update dai_bdm_gan_cau set dang_bai_id = $2 where ma_cau = $1`, [goc.ma_cau, D1]); b.push('đổi[' + await xem() + ']');
    await c.query(`delete from dai_bdm_gan_cau where ma_cau = $1`, [goc.ma_cau]); b.push('bỏ gán[' + await xem() + ']');
    await c.query(`delete from dai_bdm_de_xuat where ma_cau = $1`, [goc.ma_cau]); b.push('bỏ đx[' + await xem() + ']');
    b.push('lệch=' + await lech()); return b.join(' → ').slice(0, 900); });
  await thu('ghi hàng loạt 500 dòng gán (đo thời gian trigger)', async () => { const t = Date.now(); const r = await c.query(`update dai_bdm_gan_cau set at = at where ma_cau in (select ma_cau from dai_bdm_gan_cau limit 500)`); return { dong: r.rowCount, ms: Date.now() - t, lech: await lech() }; });
  await thu('đổi câu gốc của một bản sao (parent_ma_cau)', async () => { const k = await one(`select ma_cau, parent_ma_cau from hgt_cau_hoi where parent_ma_cau is not null limit 1`); if (!k) return 'không có bản sao hgt'; await c.query(`update hgt_cau_hoi set parent_ma_cau = null where ma_cau = $1`, [k.ma_cau]); return { lech: await lech() }; });
  await thu('KHTN: gán một câu qua tên cũ', async () => { const k = await one(`select ma_cau, dang_bai_id from khtn_bdm_gan_cau limit 1`); await c.query(`delete from khtn_bdm_gan_cau where ma_cau = $1`, [k.ma_cau]); const l1 = await lech(); await c.query(`insert into khtn_bdm_gan_cau (ma_cau, dang_bai_id, nguon) values ($1, $2, 'nguoi')`, [k.ma_cau, k.dang_bai_id]); return { sau_xoa: l1, sau_gan_lai: await lech() }; });
  await thu('đọc 1 câu qua bảng tra — plan', async () => (await c.query(`explain select dang_bai_id from public.kho_cau_dang where kho = 'dai' and ma_cau = any($1)`, [['a', 'b', 'c']])).rows.map(r => r['QUERY PLAN']).join(' | ').slice(0, 160));
} catch (e) { console.log('!!! LỖI:', e.code, e.message, (e.where || '').slice(0, 300)); }
finally { await c.query('rollback'); console.log('\nĐÃ ROLLBACK (' + (Date.now() - t0) + ' ms). bảng tra còn (phải 0):', (await one(`select count(*)::int n from pg_class where relname='kho_cau_dang'`)).n); await c.end(); }
