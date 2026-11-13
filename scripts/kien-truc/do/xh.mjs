// fn_xephang_chung + _tich_luy_cua: doc BANG TINH SAN viec thang (dash_viec_thang_luu qua _dash_viec_thang) thay vi tinh lai viec ca thang cua MOI nhan su moi luot mo.
// So cu–moi cho tung nhan su trong transaction roi ROLLBACK; ghi xh.sql.
import fs from 'fs'; import pg from 'pg'; import crypto from 'crypto';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
const one = async (q, p) => (await c.query(q, p)).rows[0];
const lay = async n => { const r = (await c.query(`select p.prosrc src, pg_get_functiondef(p.oid) def, p.oid::regprocedure::text sig from pg_proc p where p.proname=$1 and p.pronamespace='public'::regnamespace`, [n])).rows; if (r.length !== 1) throw new Error(n + ': ' + r.length + ' bản'); return { ...r[0], def: r[0].def.replace(/\r\n/g, '\n'), src: r[0].src.replace(/\r\n/g, '\n'), md5: crypto.createHash('md5').update(r[0].src, 'utf8').digest('hex') }; };
const thay = (f, pairs) => { let s = f.src; for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(f.sig + ': không thấy đúng 1 lần: ' + a.slice(0, 70)); s = s.split(a).join(b); } return f.def.split(f.src).join(s); };
const ck = await one(`select string_agg(pg_get_constraintdef(oid), ' ; ') s from pg_constraint where conrelid = 'public.dash_viec_thang_luu'::regclass`); console.log('ràng buộc dash_viec_thang_luu:', ck.s);
const ckTen = (await one(`select conname from pg_constraint where conrelid = 'public.dash_viec_thang_luu'::regclass and contype = 'c' and pg_get_constraintdef(oid) ~ 'loai'`)).conname;
const d = await lay('_dash_viec_thang'), x = await lay('fn_xephang_chung'), t = await lay('_tich_luy_cua');
const dMoi = thay(d, [
  [`if p_loai not in ('ta', 'gv') or`, `if p_loai not in ('ta', 'gv', 'ops') or`],
  [`    else\n      select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) into v_dong from public.fn_gv_viec_thang(v_tu, v_den) x;\n    end if;`,
   `    elsif p_loai = 'gv' then\n      select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) into v_dong from public.fn_gv_viec_thang(v_tu, v_den) x;\n    else   -- [13/11] 'ops': cùng khuôn dòng, tên việc đưa vào cột ten_lop\n      select coalesce(jsonb_agg(to_jsonb(x) || jsonb_build_object('ten_lop', x.ten_viec)), '[]'::jsonb) into v_dong from public.fn_ops_viec_thang(v_tu, v_den) x;\n    end if;`],
]);
const xMoi = thay(x, [
  [`    select nhan_su_id, kq from public.fn_ta_viec_thang(v_tu, v_den)\n    union all\n    select nhan_su_id, kq from public.fn_gv_viec_thang(v_tu, v_den)\n    union all\n    select nhan_su_id, kq from public.fn_ops_viec_thang(v_tu, v_den)`,
   `    -- [13/11] đọc bảng tính sẵn việc tháng (≤ 10 phút, cùng nguồn với fn_ta_dashboard / fn_gv_dashboard) thay vì tính lại việc cả tháng của mọi nhân sự mỗi lượt mở\n    select nhan_su_id, kq from public._dash_viec_thang('ta', p_ym)\n    union all\n    select nhan_su_id, kq from public._dash_viec_thang('gv', p_ym)\n    union all\n    select nhan_su_id, kq from public._dash_viec_thang('ops', p_ym)`],
]);
const tMoi = thay(t, [
  [`      select ngay, kq from public.fn_ta_viec_thang(v_tu, v_den) where nhan_su_id = p_ns\n      union all select ngay, kq from public.fn_gv_viec_thang(v_tu, v_den) where nhan_su_id = p_ns\n      union all select ngay, kq from public.fn_ops_viec_thang(v_tu, v_den) where nhan_su_id = p_ns`,
   `      -- [13/11] đọc bảng tính sẵn việc tháng (≤ 10 phút) — trước tính việc cả tháng của MỌI nhân sự rồi mới lọc một người\n      select ngay, kq from public._dash_viec_thang('ta', p_ym) where nhan_su_id = p_ns\n      union all select ngay, kq from public._dash_viec_thang('gv', p_ym) where nhan_su_id = p_ns\n      union all select ngay, kq from public._dash_viec_thang('ops', p_ym) where nhan_su_id = p_ns`],
]);
const guard = fs_ => fs_.map(f => `  if (select md5(p.prosrc) from pg_proc p where p.oid = '${f.sig}'::regprocedure) is distinct from '${f.md5}' then raise exception '% đã đổi từ lúc sinh migration — sinh lại', '${f.sig}'; end if;`).join('\n');
const sql = `-- ĐỢT 5 (làm sớm, 13/11/2026): xếp hạng chung + tích luỹ của dashboard nhân sự đọc BẢNG TÍNH SẴN việc tháng (spec-kien-truc.md K2 — hàm client gọi không được tính cả hệ).
-- Trước: mỗi lượt mở Dash TA / GV / OPS, fn_xephang_chung và fn_tich_luy (qua _tich_luy_cua) tính lại việc cả tháng của MỌI nhân sự (3,2–3,4 s, tăng dần theo ngày trong tháng).
-- Sau: đọc dash_viec_thang_luu qua _dash_viec_thang (số cũ tối đa 10 phút — cùng nguồn fn_ta_dashboard / fn_gv_dashboard đang dùng); thêm loại 'ops' vào bảng tính sẵn.
do $g$
begin
${guard([d, x, t])}
end
$g$;

-- nới CHECK cho loại mới (CLAUDE.md §2.1: thêm giá trị vào cột trạng thái/loại phải nới CHECK đi kèm)
alter table public.dash_viec_thang_luu drop constraint ${ckTen};
alter table public.dash_viec_thang_luu add constraint ${ckTen} check (loai = any (array['ta'::text, 'gv'::text, 'ops'::text]));

${dMoi.trim()};

${xMoi.trim()};

${tMoi.trim()};
`;
fs.writeFileSync(S + '/xh.sql', sql);
const ds = (await c.query(`select t.id uid, n.id ns, n.ho_ten from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.trang_thai = 'dang_lam' order by n.ho_ten`)).rows;
const YM = ['2026-11', '2026-10'];
const chay = async () => { const o = {}; let ms = 0, lan = 0; for (const u of ds) { await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ role: 'authenticated', sub: u.uid })]); for (const ym of YM) { const t0 = Date.now(); const a = await one(`select public.fn_xephang_chung($1)::text x, public.fn_tich_luy($1)::text t`, [ym]); ms += Date.now() - t0; lan++; o[u.uid + '|' + ym] = { ...a, ten: u.ho_ten }; } } return { o, ms, lan }; };
try {
  await c.query('begin');
  const cu = await chay();
  await c.query(sql);
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ role: 'authenticated', sub: ds[0].uid })]);
  const t0 = Date.now(); for (const ym of YM) for (const l of ['ta', 'gv', 'ops']) await c.query(`select count(*) from public._dash_viec_thang($1, $2, 0)`, [l, ym]); const msNap = Date.now() - t0;   // làm mới bảng tính sẵn để so công bằng
  const mo = await chay();
  let lx = 0, lt = 0; for (const k of Object.keys(cu.o)) { if (cu.o[k].x !== mo.o[k].x) { lx++; if (lx <= 2) console.log('LỆCH xếp hạng', k.split('|')[1], cu.o[k].ten, '\n   cũ ', cu.o[k].x.slice(0, 200), '\n   mới', mo.o[k].x.slice(0, 200)); } if (cu.o[k].t !== mo.o[k].t) { lt++; if (lt <= 2) console.log('LỆCH tích luỹ', k.split('|')[1], cu.o[k].ten, cu.o[k].t, '→', mo.o[k].t); } }
  console.log(`đã so ${Object.keys(cu.o).length} cặp (${ds.length} nhân sự × ${YM.length} tháng): lệch xếp hạng ${lx} · lệch tích luỹ ${lt}`);
  console.log(`thời gian (cả 2 hàm một lượt): ${Math.round(cu.ms / cu.lan)} ms → ${Math.round(mo.ms / mo.lan)} ms mỗi lượt · làm mới bảng tính sẵn 6 khoá (ta/gv/ops × 2 tháng): ${msNap} ms`);
} catch (e) { console.log('!!! LỖI:', e.code, e.message, (e.where || '').slice(0, 200)); }
finally { await c.query('rollback'); await c.end(); console.log('ĐÃ ROLLBACK'); }
