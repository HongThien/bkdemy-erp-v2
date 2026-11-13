// "Viec cua toi": loc theo NGUOI GOI truoc (chi cac lop toi co the co viec), giu nguyen ket qua. So cu–moi cho TUNG nhan su trong transaction roi ROLLBACK; ghi viec.sql.
import fs from 'fs'; import pg from 'pg'; import crypto from 'crypto';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
const one = async (q, p) => (await c.query(q, p)).rows[0];
const f = await one(`select p.prosrc src, pg_get_functiondef(p.oid) def, p.oid::regprocedure::text sig from pg_proc p where p.proname='fn_viec_buoi_thuong' and p.pronamespace='public'::regnamespace`);
const A1 = `with me as (select public.current_nhan_su_id() as id),\n  b as (`;
const A2 = `      and (p_den is null or bh.ngay <= p_den)\n  ),`;
const src = f.src.replace(/\r\n/g, '\n');
if (src.split(A1).length !== 2 || src.split(A2).length !== 2) throw new Error('không thấy đúng 1 chỗ để chèn');
const moi = src
  .replace(A1, `with me as (select public.current_nhan_su_id() as id),
  -- [đợt 2 bước 3, 13/11] LỌC THEO NGƯỜI GỌI TRƯỚC: chỉ những lớp tôi có thể có việc = lớp tôi được phân công ∪ lớp thuộc (môn, khối) tôi là khối vận hành.
  -- Mọi dòng trả về cho tôi đều nằm trong tập lớp này (thuong/mt_gv cần phân công; mt_tk cần khối vận hành) ⇒ kết quả không đổi, chỉ bớt quét buổi của người khác.
  lop_toi as (
    select pc.lop_id from phan_cong_lop pc, me where pc.nhan_su_id = me.id
    union
    select l.id
      from (select distinct l0.mon, l0.khoi from lop l0) mk
      join lop l on l.mon is not distinct from mk.mon and l.khoi is not distinct from mk.khoi
     where exists (select 1 from public._khoi_van_hanh(mk.mon, mk.khoi) pk, me where pk.nhan_su_id = me.id)
  ),
  b as (`)
  .replace(A2, `      and (p_den is null or bh.ngay <= p_den)
      and (p_tat_ca or bh.lop_id in (select lt.lop_id from lop_toi lt))
  ),`);
const md5 = crypto.createHash('md5').update(f.src, 'utf8').digest('hex');
const defMoi = f.def.replace(/\r\n/g, '\n').replace(src, moi);
if (defMoi === f.def.replace(/\r\n/g, '\n')) throw new Error('không thay được thân hàm');
const sql = `-- ĐỢT 2 — BƯỚC 3 (13/11/2026): "Việc của tôi" lọc theo NGƯỜI GỌI trước (spec-kien-truc.md K2 — hàm client gọi chỉ tốn theo một người).
-- Trước: dựng việc của MỌI nhân sự trên mọi buổi rồi mới lọc d.nhan_su_id = tôi ở dòng cuối. Sau: chỉ dựng trên các lớp tôi có thể có việc.
-- Kết quả không đổi (đã so cũ–mới cho từng nhân sự trước khi áp). Nhánh p_tat_ca = true (fn_viec_buoi_thuong_lh, cron) giữ nguyên.
do $g$ begin if (select md5(p.prosrc) from pg_proc p where p.oid = '${f.sig}'::regprocedure) is distinct from '${md5}' then raise exception 'fn_viec_buoi_thuong đã đổi từ lúc sinh migration — sinh lại'; end if; end $g$;

${defMoi.trim()};
`;
fs.writeFileSync(S + '/viec.sql', sql);
// ---- so cũ – mới
const ds = (await c.query(`select t.id uid, n.id ns, n.ho_ten from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.trang_thai = 'dang_lam' order by n.ho_ten`)).rows;
const hs = (await one(`select id from tai_khoan where hoc_sinh_id is not null limit 1`)).id;
const Q = `select count(*)::int n, md5(coalesce(string_agg(md5(to_jsonb(x)::text), ',' order by x.ref_key), '')) h from public.fn_viec_buoi_thuong($1, $2, false) x`;
const CA = [[null, null, 'mọi thời gian'], ['2026-11-01', '2026-11-30', 'tháng 11'], ['2026-09-01', null, 'từ 01/09']];
const chay = async () => { const o = {}; for (const u of [...ds, { uid: hs, ho_ten: '(học sinh)' }]) { await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ role: 'authenticated', sub: u.uid })]); for (const [a, b, ten] of CA) { const t = Date.now(); const r = await one(Q, [a, b]); o[u.uid + '|' + ten] = { ...r, ms: Date.now() - t, ten: u.ho_ten }; } } return o; };
try {
  await c.query('begin');
  const cu = await chay();
  await c.query(sql);
  const mo = await chay();
  let lech = 0, tongCu = 0, tongMoi = 0, viec = 0; const cham = [];
  for (const k of Object.keys(cu)) { if (cu[k].n !== mo[k].n || cu[k].h !== mo[k].h) { lech++; console.log('LỆCH', k.split('|')[1], cu[k].ten, cu[k].n, '→', mo[k].n); } if (k.endsWith('mọi thời gian')) { tongCu += cu[k].ms; tongMoi += mo[k].ms; viec += cu[k].n; cham.push([cu[k].ms, mo[k].ms, cu[k].n, cu[k].ten]); } }
  console.log(`đã so ${Object.keys(cu).length} cặp (${ds.length} nhân sự + 1 HS × ${CA.length} khoảng ngày) — LỆCH: ${lech}`);
  console.log(`gọi "mọi thời gian": tổng ${tongCu} ms → ${tongMoi} ms cho ${ds.length + 1} người (tb ${Math.round(tongCu / (ds.length + 1))} → ${Math.round(tongMoi / (ds.length + 1))} ms/lượt); tổng số việc trả về ${viec}`);
  cham.sort((a, b) => b[0] - a[0]); for (const x of cham.slice(0, 5)) console.log(`   ${x[3].slice(0, 22).padEnd(22)} ${x[2]} việc: ${x[0]} → ${x[1]} ms`);
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ role: 'authenticated', sub: ds[0].uid })]);
  const tc = await one(`select count(*)::int n from public.fn_viec_buoi_thuong('2026-11-01', '2026-11-30', true)`); console.log('nhánh p_tat_ca = true (tháng 11):', tc.n, 'dòng');
} catch (e) { console.log('!!! LỖI:', e.code, e.message); }
finally { await c.query('rollback'); await c.end(); console.log('ĐÃ ROLLBACK'); }
