// Xuất dữ liệu ERP → JSON tĩnh cho web marketing (../bkdemy-web/content/data).
// Web KHÔNG nối Supabase ERP (spec BKDEMY_WEB_SPEC.md §2) — mọi số liệu đi qua script này, chạy theo lô rồi commit.
// Chạy từ gốc repo ERP:  node scripts/web/xuat-cho-web.mjs [--thang 2026-09]
// Đọc: .env DATABASE_URL (claude_build, pg) + .env.local SUPABASE_SERVICE_ROLE (giai_thuong — claude_build thấy 0 dòng).
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const OUT = path.resolve('../bkdemy-web/content/data');
const envOf = (file, key) => (fs.readFileSync(file, 'utf8').match(new RegExp('^' + key + '=(.*)$', 'm')) || [])[1]?.trim().replace(/^"|"$/g, '');
const argThang = process.argv.indexOf('--thang');
const THANG = argThang > 0 ? process.argv[argThang + 1] : null; // 'YYYY-MM'; mặc định = tháng gần nhất đã chốt

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ghi = (ten, data) => { fs.writeFileSync(path.join(OUT, ten), JSON.stringify(data, null, 2) + '\n'); console.log('ghi', ten); };
const homNay = new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

const c = new pg.Client({ connectionString: envOf('.env', 'DATABASE_URL'), ssl: { rejectUnauthorized: false } });
await c.connect();
const q = async (s, p = []) => (await c.query(s, p)).rows;

// 1. Thống kê
const [hs] = await q(`select count(*)::int n from hoc_sinh where trang_thai='dang_hoc'`);
const [lop] = await q(`select count(*)::int n from lop where trang_thai='dang_hoc'`);
const gvRows = await q(`
  select ns.id, ns.ho_ten, ns.anh_url,
         (select string_agg(distinct l.mon, ',' order by l.mon) from phan_cong_lop p join lop l on l.id=p.lop_id and l.trang_thai='dang_hoc' where p.nhan_su_id=ns.id and p.vai_tro='gv') mon,
         (select count(distinct p.lop_id) from phan_cong_lop p join lop l on l.id=p.lop_id and l.trang_thai='dang_hoc' where p.nhan_su_id=ns.id and p.vai_tro='gv')::int so_lop
  from nhan_su ns where ns.trang_thai='dang_lam'
    and exists (select 1 from phan_cong_lop p join lop l on l.id=p.lop_id and l.trang_thai='dang_hoc' where p.nhan_su_id=ns.id and p.vai_tro='gv')
  order by so_lop desc, ns.ho_ten`);
const [ta] = await q(`select count(distinct nt.nhan_su_id)::int n from nhan_su_team nt join team t on t.id=nt.team_id and t.ten='Trợ giảng' join nhan_su ns on ns.id=nt.nhan_su_id and ns.trang_thai='dang_lam'`);
ghi('thong-ke.json', { _ghiChu: 'Sinh bởi scripts/web/xuat-cho-web.mjs (ERP). Không sửa tay — chạy lại script.', ngay: homNay, hoc_sinh: hs.n, lop: lop.n, giao_vien: gvRows.length, tro_giang: ta.n, si_so_toi_da: 15 });

// 2. Giáo viên — giữ dòng gioi_thieu đã nhập tay (khớp theo slug)
const cu = fs.existsSync(path.join(OUT, 'teachers.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'teachers.json'), 'utf8')) : [];
const gioiThieuCu = Object.fromEntries(cu.filter((t) => t.slug).map((t) => [t.slug, t.gioi_thieu || t.intro || '']));
const MON_NHAN = { 'Toán': 'Toán', 'Văn': 'Ngữ văn', 'Tiếng Anh': 'Tiếng Anh', 'KHTN': 'Khoa học tự nhiên' };
const teachers = gvRows.map((r) => {
  const s = slug(r.ho_ten);
  const mon = (r.mon || '').split(',').filter(Boolean).map((m) => MON_NHAN[m] || m);
  return { slug: s, ten: r.ho_ten, anh: r.anh_url || '', mon, so_lop: r.so_lop, gioi_thieu: gioiThieuCu[s] || '' };
});
ghi('teachers.json', [{ _ghiChu: 'Tên/ảnh/môn sinh từ ERP (scripts/web/xuat-cho-web.mjs). CHỈ sửa tay cột gioi_thieu — script giữ lại theo slug. Ảnh trống = ô trống trên web (Thùy 15/10).' }, ...teachers]);

// 3. Vinh danh tháng (giai_thuong — đọc bằng service role)
const sb = createClient(envOf('.env.local', 'VITE_SUPABASE_URL'), envOf('.env.local', 'SUPABASE_SERVICE_ROLE'), { auth: { persistSession: false } });
let thang = THANG;
if (!thang) {
  const { data } = await sb.from('giai_thuong').select('thang').order('thang', { ascending: false }).limit(1);
  thang = data?.[0]?.thang?.slice(0, 7);
}
const tu = thang + '-01';
const den = new Date(Date.UTC(+thang.slice(0, 4), +thang.slice(5, 7), 1)).toISOString().slice(0, 10);
const { data: giai, error } = await sb.from('giai_thuong').select('loai_giai, cong_bo_at, lop:lop_id(ten_lop, khoi, mon), hs:hoc_sinh_id(ho_ten)').gte('thang', tu).lt('thang', den).limit(500);
if (error) throw new Error('giai_thuong: ' + error.message);
const tong = { xuat_sac: 0, tien_bo: 0, cham_chi: 0 };
const theoLop = {};
for (const g of giai) {
  tong[g.loai_giai]++;
  const k = g.lop.ten_lop;
  (theoLop[k] ||= { ten_lop: k, khoi: g.lop.khoi, mon: MON_NHAN[g.lop.mon] || g.lop.mon, giai: [] }).giai.push({ loai: g.loai_giai, ho_ten: g.hs.ho_ten });
}
const KHOI_TT = (k) => (k.replace(/\D/g, '') | 0) * 2 + (k.endsWith('T') ? 1 : 0);
const LOAI_TT = { xuat_sac: 0, tien_bo: 1, cham_chi: 2 };
const khoiMap = {};
for (const l of Object.values(theoLop)) {
  l.giai.sort((a, b) => LOAI_TT[a.loai] - LOAI_TT[b.loai] || a.ho_ten.localeCompare(b.ho_ten, 'vi'));
  (khoiMap[l.khoi] ||= []).push(l);
}
const khoi = Object.entries(khoiMap).sort((a, b) => KHOI_TT(b[0]) - KHOI_TT(a[0])).map(([k, lops]) => ({ khoi: k, lop: lops.sort((a, b) => a.ten_lop.localeCompare(b.ten_lop, 'vi', { numeric: true })) }));
ghi('vinh-danh.json', { _ghiChu: 'Sinh từ giai_thuong (ERP) qua scripts/web/xuat-cho-web.mjs. Tên hiện đầy đủ, không ảnh HS (Thùy 15/10). Chỉ chạy sau khi tháng đã chốt/công bố.', thang, da_cong_bo: giai.some((g) => g.cong_bo_at), tong, so_hs: giai.length, so_lop: Object.keys(theoLop).length, khoi });

// 4. Danh sách đề thi/đề cương trong Kho đề thi (chưa có trang đề — chỉ để hub Tài liệu hiện "sắp có")
const de = await q(`select ten, khoi, mon, cau_hinh->'deThi' as d, duyet_at is not null as da_duyet from tai_lieu where loai='de_thi' and khoi in ('6','7','8','9') and mon='Toán' order by khoi, ten`);
const danhSach = de.map((r) => ({ ten: r.ten, khoi: r.khoi, mon: r.mon, kieu: r.d?.kieu || 'de_thi', truong: r.d?.nguon || '', nam: r.d?.nam || null, so_cau: r.d?.nhanCau ? Object.keys(r.d.nhanCau).length : null, da_duyet: r.da_duyet }));
ghi('tai-lieu-danh-sach.json', { _ghiChu: 'Sinh từ tai_lieu (Kho đề thi ERP). Trang đề thật sinh theo lô ở bước sau — hiện chỉ dùng cho hub Tài liệu.', ngay: homNay, de: danhSach });

await c.end();
console.log('xong:', { hs: hs.n, lop: lop.n, gv: teachers.length, ta: ta.n, thang, giai: giai.length, de: danhSach.length });
