// Sinh mig "khtn_de_xuat_dang_cum" = BẢN SAO luồng đề xuất của Đại cho KHTN (Thùy 03/10: "KHTN làm như toán ấy").
// Bảng: chép DDL từ mig 202609282236 (bảng Đại chưa đổi từ đó). Hàm: lấy từ pg_get_functiondef BẢN ĐANG CHẠY rồi thay tên bảng.
// Mỗi phép thay phải xuất hiện ≥1 lần trong đúng chỗ; sau thay KHÔNG được còn chữ 'dai_' / 'fn_dai_'.
// Chạy: node scripts/khtn-hatmam/gen-mig-de-xuat.mjs <file ra phần thân>
import fs from 'node:fs'
import pg from 'pg'
process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const THAY = [
  ['dai_de_xuat_quyet_dinh', 'khtn_de_xuat_quyet_dinh'], ['dai_de_xuat_cau', 'khtn_de_xuat_cau'], ['dai_de_xuat', 'khtn_de_xuat'],
  ['dai_ban_do', 'khtn_ban_do'], ['dai_cau_hoi', 'khtn_cau_hoi'], ['dai_cum_bai', 'khtn_cum_bai'],
  ['fn_dai_sinh_ma_dang', 'fn_khtn_sinh_ma_dang'],
]
const doi = (s) => { let x = s; for (const [a, b] of THAY) x = x.split(a).join(b); return x }
const conDai = (s, ten) => { const m = s.match(/\b(fn_)?dai_[a-z_]+/g); if (m) throw new Error(`${ten}: còn sót ${[...new Set(m)].join(', ')}`) }

// 1) DDL bảng + RLS từ file mig Đại (phần trước hàm đầu tiên)
const f = fs.readFileSync('supabase/migrations/202609282236_dai_de_xuat_dang_cum.sql', 'utf8').replace(/\r\n/g, '\n')
const ddl = f.slice(f.indexOf('create table if not exists public.dai_de_xuat ('), f.indexOf('create or replace function public.fn_dai_de_xuat_ds'))
  .split('\n').filter((l) => !/^\s*--/.test(l)).join('\n')
let out = doi(ddl)
conDai(out, 'DDL')

// 2) Hàm từ bản đang chạy
for (const sig of ['fn_dai_de_xuat_ds(text, boolean)', 'fn_dai_de_xuat_quyet(uuid, text, text, text, text, text)',
  'fn_dai_de_xuat_tao(text, text, text, text, text[], text, text, text, text, text)', 'fn_dai_de_xuat_tk(text)']) {
  const { rows: [{ d, acl }] } = await c.query(`select pg_get_functiondef($1::regprocedure) d, pg_get_function_identity_arguments($1::regprocedure) acl`, ['public.' + sig])
  const moi = doi(d)
  conDai(moi, sig)
  const sigMoi = doi(sig).replace(/^fn_/, 'public.fn_')
  out += `\n-- ${doi(sig)} — bản sao ${sig} (thân lấy từ bản đang chạy, chỉ thay tên bảng Đại → KHTN)\n${moi.trimEnd()};\n`
  out += `revoke all on function ${sigMoi} from public, anon;\ngrant execute on function ${sigMoi} to authenticated;\n`
}
fs.writeFileSync(process.argv[2], out)
console.log('ok', out.length)
await c.end()
