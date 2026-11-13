// Them moc "da xong tu": fn_viec_buoi_thuong_loc(p_tu, p_den, p_tat_ca, p_xong_tu). Ham cu thanh vo boc (1 nguon cong thuc). So khop trong transaction roi ROLLBACK; ghi viec2.sql.
import fs from 'fs'; import pg from 'pg'; import crypto from 'crypto';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
const one = async (q, p) => (await c.query(q, p)).rows[0];
const f = await one(`select p.prosrc src, pg_get_functiondef(p.oid) def, p.oid::regprocedure::text sig from pg_proc p where p.proname='fn_viec_buoi_thuong' and p.pronamespace='public'::regnamespace`);
const def = f.def.replace(/\r\n/g, '\n'), src = f.src.replace(/\r\n/g, '\n');
const H1 = 'CREATE OR REPLACE FUNCTION public.fn_viec_buoi_thuong(p_tu date DEFAULT NULL::date, p_den date DEFAULT NULL::date, p_tat_ca boolean DEFAULT false)';
const W1 = '  where p_tat_ca or d.nhan_su_id = me.id';
if (!def.startsWith(H1) || src.split(W1).length !== 2) throw new Error('đầu hàm / mệnh đề where không như dự kiến');
const srcLoc = src.replace(W1, `  where (p_tat_ca or d.nhan_su_id = me.id)
    -- [13/11] Thùy: việc ĐÃ XONG chỉ lấy từ mốc p_xong_tu (app mặc định 2 tuần, bấm "xem cũ hơn" mới lấy hết); việc CHƯA xong luôn lấy đủ.
    and (p_xong_tu is null or d.dong_at is null or d.dong_at >= p_xong_tu)`);
const defLoc = def.replace(H1, 'CREATE OR REPLACE FUNCTION public.fn_viec_buoi_thuong_loc(p_tu date DEFAULT NULL::date, p_den date DEFAULT NULL::date, p_tat_ca boolean DEFAULT false, p_xong_tu timestamp with time zone DEFAULT NULL::timestamp with time zone)').replace(src, srcLoc);
const defVo = def.replace(src, `\n  -- [13/11] vỏ bọc: MỘT nguồn công thức ở fn_viec_buoi_thuong_loc (p_xong_tu = null ⇒ đủ lịch sử, như trước)\n  select * from public.fn_viec_buoi_thuong_loc(p_tu, p_den, p_tat_ca, null)\n`);
const md5 = crypto.createHash('md5').update(f.src, 'utf8').digest('hex');
const sql = `-- ĐỢT 2 — BƯỚC 3b (13/11/2026): "Việc của tôi" — việc ĐÃ XONG chỉ lấy từ một mốc (Thùy: "2 tuần là đủ, muốn xem thêm thì lúc đấy mới mở thêm").
-- Hàm mới fn_viec_buoi_thuong_loc có thêm p_xong_tu; fn_viec_buoi_thuong (3 tham số) thành vỏ bọc gọi sang ⇒ mọi nơi đang gọi hàm cũ không đổi kết quả.
do $g$ begin if (select md5(p.prosrc) from pg_proc p where p.oid = '${f.sig}'::regprocedure) is distinct from '${md5}' then raise exception 'fn_viec_buoi_thuong đã đổi từ lúc sinh migration — sinh lại'; end if; end $g$;

${defLoc.trim()};

${defVo.trim()};
`;
fs.writeFileSync(S + '/viec2.sql', sql);
const ds = (await c.query(`select t.id uid, n.ho_ten from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.trang_thai = 'dang_lam' order by n.ho_ten`)).rows;
const fp = q => `select count(*)::int n, md5(coalesce(string_agg(md5(to_jsonb(x)::text), ',' order by x.ref_key), '')) h from (${q}) x`;
const moc = (await one(`select (now() - interval '14 days') m`)).m;
const chay = async (q, p) => { const o = {}; let ms = 0, n = 0; for (const u of ds) { await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ role: 'authenticated', sub: u.uid })]); const t = Date.now(); const r = await one(fp(q), p); ms += Date.now() - t; n += r.n; o[u.uid] = r; } return { o, ms, n }; };
try {
  await c.query('begin');
  const cu = await chay(`select * from public.fn_viec_buoi_thuong(null, null, false)`, []);
  const cuLoc = await chay(`select * from public.fn_viec_buoi_thuong(null, null, false) y where y.dong_at is null or y.dong_at >= $1`, [moc]);
  await c.query(sql);
  const vo = await chay(`select * from public.fn_viec_buoi_thuong(null, null, false)`, []);
  const moi = await chay(`select * from public.fn_viec_buoi_thuong_loc(null, null, false, $1)`, [moc]);
  const lech = (a, b) => ds.filter(u => a.o[u.uid].n !== b.o[u.uid].n || a.o[u.uid].h !== b.o[u.uid].h).length;
  console.log(`hàm cũ ↔ vỏ bọc mới (đủ lịch sử): lệch ${lech(cu, vo)}/${ds.length} người · ${cu.n} việc`);
  console.log(`hàm cũ lọc tay 2 tuần ↔ hàm mới p_xong_tu: lệch ${lech(cuLoc, moi)}/${ds.length} người · ${cuLoc.n} việc`);
  console.log(`thời gian cho ${ds.length} người: đủ lịch sử ${cu.ms} ms (tb ${Math.round(cu.ms / ds.length)}) → 2 tuần ${moi.ms} ms (tb ${Math.round(moi.ms / ds.length)}) · số việc trả về ${cu.n} → ${moi.n}`);
  const q = await one(`select has_function_privilege('authenticated','public.fn_viec_buoi_thuong_loc(date,date,boolean,timestamptz)','execute') auth, has_function_privilege('anon','public.fn_viec_buoi_thuong_loc(date,date,boolean,timestamptz)','execute') anon`); console.log('quyền hàm mới:', JSON.stringify(q));
} catch (e) { console.log('!!! LỖI:', e.code, e.message); }
finally { await c.query('rollback'); await c.end(); console.log('ĐÃ ROLLBACK'); }
