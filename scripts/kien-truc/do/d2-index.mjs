// Dot 2 buoc 1: tao index KHONG khoa ghi (CONCURRENTLY, ngoai transaction), roi EXPLAIN kiem da duoc dung. Ghi file migration (if not exists) vao scratchpad.
import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const KT = t => String.raw`(md5(regexp_replace(lower(noi_dung || coalesce(lua_chon::text, '') || coalesce(menh_de::text, '')), '\s+', '', 'g'))) where xoa_at is null`;
const IDX = [
  ['hgt_cau_hoi_parent_idx', 'hgt_cau_hoi', '(parent_ma_cau) where parent_ma_cau is not null', 'view bdm_cau_dang nối gốc→bản sao: thiếu nên mọi hàm bốc câu quét cả bảng (bên dai đã có idx_dai_cau_parent)'],
  ['bai_test_lop_loai_idx', 'bai_test', '(lop_id, loai)', '_hs_dang_da_hoc / fn_ban_do_phieu_luu: bài lớp đã giao — trước chỉ có index riêng cho loai=et'],
  ['bai_test_nguon_idx', 'bai_test', '(nguon_tai_lieu_id) where nguon_tai_lieu_id is not null', '_de_thi_da_giao(t.id) chạy cho từng đề — fn_de_thi_dem/_ds'],
  ['gami_grades_buoi_hs_idx', 'gami_grades', '(buoi_hoc_id, hoc_sinh_id)', '_et_diem_buoi, cron tin Thế giới: điểm theo buổi'],
  ['bai_lam_cau_cham_at_idx', 'bai_lam_cau', '(cham_at)', 'cron tin Thế giới + mastery theo mốc thời gian'],
  ['bai_lam_hs_idx', 'bai_lam', '(hoc_sinh_id)', '_hs_cau_lan_gap: bài làm của một em (index cũ có cột đầu là bai_test_id)'],
  ['the_gioi_tin_luu_thanh_vien_gin', 'the_gioi_tin_luu', 'using gin (thanh_vien)', 'tin của em: v_me = any(thanh_vien)'],
  ['hgt_bdm_de_xuat_dang_bai_idx', 'hgt_bdm_de_xuat', '(dang_bai_id)', 'đối xứng với dai_bdm_de_xuat'],
  ['hoa_don_dong_hoa_don_idx', 'hoa_don_dong', '(hoa_don_id)', 'fn_hocphi_no_theo_ph: 2 truy vấn con cho mỗi hoá đơn, trước quét cả bảng'],
  ['thanh_toan_hoa_don_idx', 'thanh_toan', '(hoa_don_id)', 'như trên'],
  ['buoi_hoc_hs_btyeu_idx', 'buoi_hoc_hs', '(bo_tro_yeu_id) where bo_tro_yeu_id is not null', 'fn_btyeu_case_xep_lich: buổi của từng case'],
  ['tai_lieu_de_thi_idx', 'tai_lieu', "(mon, khoi, created_at desc) where loai = 'de_thi'", 'Kho đề thi: danh sách + đếm'],
  ['ban_be_loi_moi_gui_idx', 'ban_be_loi_moi', '(nguoi_gui)', '_ban_be_cua: bạn của một em'],
  ['ban_be_loi_moi_nhan_idx', 'ban_be_loi_moi', '(nguoi_nhan)', 'như trên'],
  ['gami_exp_ledger_hs_idx', 'gami_exp_ledger', '(hoc_sinh_id, created_at)', 'xu-dong-bo, EXP theo em theo tháng — trước chỉ có khoá chính'],
  ['canh_bao_yeu_hs_idx', 'canh_bao_yeu', '(hoc_sinh_id)', 'báo động yếu theo em'],
  ['dai_cau_hoi_khoa_trung2_idx', 'dai_cau_hoi', KT(), 'kiểm trùng khi thêm câu (fn_phien_kho_them) — bản ĐÚNG biểu thức \\s+; bản cũ *_khoa_trung_idx dựng nhầm s+ nên chưa từng được dùng'],
  ['hgt_cau_hoi_khoa_trung2_idx', 'hgt_cau_hoi', KT(), 'như trên'],
  ['khtn_cau_hoi_khoa_trung2_idx', 'khtn_cau_hoi', KT(), 'như trên'],
  ['hinh_hoc_cau_hoi_khoa_trung2_idx', 'hinh_hoc_cau_hoi', KT(), 'như trên'],
];
const stmt = (ten, bang, dn, conc) => `create index ${conc ? 'concurrently ' : ''}if not exists ${ten} on public.${bang} ${dn.startsWith('using') ? dn : dn};`;
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query(`set lock_timeout = '4s'`); await c.query(`set statement_timeout = '110s'`);
for (const [ten, bang, dn] of IDX) { const t0 = Date.now(); try { await c.query(stmt(ten, bang, dn, true)); const v = (await c.query(`select i.indisvalid ok, pg_size_pretty(pg_relation_size(i.indexrelid)) sz from pg_index i where i.indexrelid = $1::regclass`, ['public.' + ten])).rows[0]; console.log((v.ok ? '✔' : '✗ KHONG HOP LE') + ' ' + ten.padEnd(36) + String(Date.now() - t0).padStart(6) + ' ms  ' + v.sz); } catch (e) { console.log('✗ ' + ten + ' LOI: ' + e.message); } }
await c.query('analyze public.hgt_cau_hoi, public.bai_test, public.hoa_don_dong, public.thanh_toan, public.buoi_hoc_hs, public.bai_lam, public.gami_exp_ledger');
// EXPLAIN thuong: index co duoc chon khong
const ex = async (ten, sql, p) => { const r = await c.query('explain ' + sql, p); const plan = r.rows.map(x => x['QUERY PLAN']).join(' | '); const dung = (plan.match(/(?:Index(?: Only)? Scan using|Bitmap Index Scan on) ([a-z0-9_]+)/g) || []).map(x => x.split(' ').pop()); console.log('  ' + ten.padEnd(34) + (dung.length ? '→ dùng ' + [...new Set(dung)].join(', ') : '→ KHÔNG dùng index: ' + plan.slice(0, 120))); };
console.log('\nEXPLAIN:');
const u = '00000000-0000-4000-8000-000000000001';
await ex('hgt parent', `select 1 from hgt_cau_hoi h where h.parent_ma_cau = $1`, ['X']);
await ex('bai_test lop+loai', `select 1 from bai_test where lop_id = $1 and loai = any(array['giao_trinh','et','btvn','de_thi'])`, [u]);
await ex('bai_test nguon', `select exists(select 1 from bai_test where nguon_tai_lieu_id = $1)`, [u]);
await ex('gami_grades buoi', `select 1 from gami_grades where buoi_hoc_id = $1`, [u]);
await ex('bai_lam_cau cham_at', `select 1 from bai_lam_cau where cham_at >= now() - interval '1 day'`);
await ex('bai_lam hs', `select 1 from bai_lam where hoc_sinh_id = $1`, [u]);
await ex('hoa_don_dong', `select sum(thanh_tien) from hoa_don_dong where hoa_don_id = $1`, [u]);
await ex('thanh_toan', `select sum(so_tien) from thanh_toan where hoa_don_id = $1`, [u]);
await ex('buoi_hoc_hs btyeu', `select 1 from buoi_hoc_hs where bo_tro_yeu_id = $1`, [u]);
await ex('tai_lieu de_thi', `select id from tai_lieu where loai = 'de_thi' and mon = 'Toán' and khoi = '9' order by created_at desc limit 25`);
await ex('gami_exp_ledger', `select sum(amount) from gami_exp_ledger where hoc_sinh_id = $1 and created_at >= now() - interval '30 days'`, [u]);
await ex('khoa_trung dai', String.raw`select min(c.ma_cau) from dai_cau_hoi c where c.xoa_at is null and md5(regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g')) = md5($1)`, ['x']);
await ex('khoa_trung hinh_hoc', String.raw`select min(c.ma_cau) from hinh_hoc_cau_hoi c where c.xoa_at is null and md5(regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g')) = md5($1)`, ['x']);
await c.end();
const sql = `-- ĐỢT 2 — BƯỚC 1 (13/11/2026): index cho các đường đọc nóng (spec-kien-truc.md §10 đợt 2, K7). Bằng chứng: reports/audit-scale-13-11.md §2.2.
-- Các index này ĐÃ được tạo trước bằng CREATE INDEX CONCURRENTLY (không khoá ghi) rồi mới ghi sổ; file dùng IF NOT EXISTS để dựng lại DB từ repo vẫn đủ.
-- 4 index *_khoa_trung2_idx là bản đúng của *_khoa_trung_idx (mig 202611112136 dựng nhầm 's+' thay vì '\\s+' ⇒ idx_scan = 0). Bản cũ CHƯA xoá (Luật xoá — chờ Thùy).
${IDX.map(([ten, bang, dn, ly]) => `-- ${ly}\n${stmt(ten, bang, dn, false)}`).join('\n')}
`;
fs.writeFileSync(S + '/d2-index.sql', sql);
console.log('\nda ghi d2-index.sql', IDX.length, 'index');
