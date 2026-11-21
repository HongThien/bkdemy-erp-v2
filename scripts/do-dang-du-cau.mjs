// Chỉ ĐỌC: mỗi dạng bài bản đồ mới (dai_bdm_dang_bai) có bao nhiêu câu dùng được / bao nhiêu câu MCQ cho HS. Thùy 20/11.
import { readFileSync, writeFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.trim().startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')).trim(), l.slice(l.indexOf('=')+1).trim().replace(/^["']|["']$/g,'')]))
const db = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL, ssl:{rejectUnauthorized:false} }); await db.connect()
const q = async (s) => (await db.query(s)).rows
const sqlKho = (kho, cau, form) => `
 select d.dang_bai_id,
   count(*) filter (where c.xoa_at is null and c.kho_chuan and not (c.noi_dung ~* '[[]\s*hình' and coalesce(c.anh_de,'')='') and public._bdm_du_dap_an(c.loai_cau,c.dap_an,c.menh_de,c.loi_giai)) dung_duoc,
   count(*) filter (where c.xoa_at is null and c.kho_chuan and not (c.noi_dung ~* '[[]\s*hình' and coalesce(c.anh_de,'')='')
        and ((c.loai_cau='trac_nghiem' and c.dap_an is not null) or exists (select 1 from ${form} f where f.ma_cau=c.ma_cau and f.da_duyet and f.xoa_at is null))) mcq,
   count(*) filter (where c.xoa_at is null and not c.kho_chuan and not (c.noi_dung ~* '[[]\s*hình' and coalesce(c.anh_de,'')='') and public._bdm_du_dap_an(c.loai_cau,c.dap_an,c.menh_de,c.loi_giai)) cho_duyet,
   count(*) filter (where c.xoa_at is null and c.kho_chuan and exists (select 1 from ${form} f where f.ma_cau=c.ma_cau and not f.da_duyet and f.xoa_at is null)) form_cho,
   count(*) filter (where c.xoa_at is null and c.kho_chuan and c.loai_cau='tra_loi_ngan' and c.dap_an is not null and not (c.noi_dung ~* '[[]\s*hình' and coalesce(c.anh_de,'')='')) tln,
   count(*) filter (where c.xoa_at is null and c.kho_chuan and c.parent_ma_cau is not null and not (c.noi_dung ~* '[[]\s*hình' and coalesce(c.anh_de,'')='') and public._bdm_du_dap_an(c.loai_cau,c.dap_an,c.menh_de,c.loi_giai)) clone_dung_duoc
 from bdm_cau_dang d join ${cau} c on c.ma_cau=d.ma_cau where d.kho='${kho}' group by 1`
const rows = await q(`
 with a as (${sqlKho('dai','dai_cau_hoi','dai_cau_form_tn')} union all ${sqlKho('hgt','hgt_cau_hoi','hgt_cau_form_tn')}),
 t as (select dang_bai_id, sum(dung_duoc) dung_duoc, sum(mcq) mcq, sum(tln) tln, sum(clone_dung_duoc) clone, sum(cho_duyet) cho_duyet, sum(form_cho) form_cho from a group by 1)
 select d.id, d.ten, cd.khoi, cd.nhanh, nh.ten nhom, coalesce(t.dung_duoc,0)::int dung_duoc, coalesce(t.mcq,0)::int mcq, coalesce(t.tln,0)::int tln, coalesce(t.clone,0)::int clone, coalesce(t.cho_duyet,0)::int cho_duyet, coalesce(t.form_cho,0)::int form_cho
 from dai_bdm_dang_bai d join dai_bdm_nhom nh on nh.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=nh.chu_de_id left join t on t.dang_bai_id=d.id`)
// Dùng: node scripts/do-dang-du-cau.mjs reports/dang-du-cau.csv   (chỉ ĐỌC DB; mốc đủ = 50 câu dùng được: kho chuẩn + đủ hình + đủ đáp án)
const esc = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"'
const cot = ['id','ten','khoi','nhanh','nhom','dung_duoc','mcq','tln','clone','cho_duyet','form_cho']
const NL = String.fromCharCode(10)
const csv = String.fromCharCode(0xFEFF) + cot.join(',') + ',thieu_so_50,can_clone_that' + NL +
  rows.sort((a, b) => String(a.khoi).localeCompare(String(b.khoi), 'vi', { numeric: true }) || a.id.localeCompare(b.id))
    .map((r) => [...cot.map((c) => esc(r[c])), Math.max(0, 50 - r.dung_duoc), Math.max(0, 50 - r.dung_duoc - r.cho_duyet)].join(',')).join(NL)
writeFileSync(process.argv[2], csv)
console.log('dạng:', rows.length, '→', process.argv[2])

// Tóm tắt in ra màn: mốc 30 (đích fill clone, spec-giai-bai §C13) và mốc 50 (Thùy 20/11)
const dem = (f) => rows.filter(f).length
const thieu = (m) => rows.reduce((a, r) => a + Math.max(0, m - r.dung_duoc), 0)
console.log('dưới 30 câu dùng được:', dem((r) => r.dung_duoc < 30), '· thiếu', thieu(30), 'câu để đủ 30')
console.log('dưới 50 câu dùng được:', dem((r) => r.dung_duoc < 50), '· thiếu', thieu(50), 'câu để đủ 50')
console.log('dạng rỗng (0 câu):', dem((r) => r.dung_duoc === 0))
console.log('chưa có MCQ:', dem((r) => r.mcq === 0), '= rỗng', dem((r) => r.mcq === 0 && r.dung_duoc === 0), '+ có trả lời ngắn', dem((r) => r.mcq === 0 && r.tln > 0), '+ chỉ có form chờ', dem((r) => r.mcq === 0 && r.tln === 0 && r.form_cho > 0), '+ không có đường nào', dem((r) => r.mcq === 0 && r.tln === 0 && r.form_cho === 0 && r.dung_duoc > 0))
await db.end()
