// ============================================================================
// GỘP THEO KHUÔN (spec-kien-truc.md §2b): gắn các bảng <nhánh>_<họ> làm PHẦN của bảng chung kho_<họ>.
//   node scripts/kien-truc/gop-khuon.mjs <họ> [<họ>…]            → CHẠY THỬ từng họ trong transaction rồi ROLLBACK, in bảng so khớp
//   node scripts/kien-truc/gop-khuon.mjs --ghi <thư-mục> <họ>…   → như trên + ghi <thư-mục>/<họ>.sql cho họ ĐẠT (để đưa vào supabase/migrations)
// Không tự áp gì. Áp = npm run new-migration rồi migrate --only (mỗi họ một file ⇒ mỗi họ một transaction, khoá bảng dưới ~1 giây).
// Điều kiện một họ ĐẠT: cột các nhánh giống hệt (tên, kiểu, not null) · không cột identity · không hàm nào ghi vào họ mà thiếu danh sách cột /
// dùng %rowtype · sau khi gắn: số dòng + vân tay nội dung từng nhánh không đổi, số trigger / khoá / policy / index không đổi.
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const NH = ['dai', 'hgt', 'khtn', 'vatly', 'hoahoc']
const argv = process.argv.slice(2)
const gi = argv.indexOf('--ghi'); const DIR = gi >= 0 ? argv[gi + 1] : null
const HOS = argv.filter((a, i) => !a.startsWith('--') && i !== gi + 1)
if (!HOS.length) { console.error('Thiếu tên họ bảng.'); process.exit(2) }
const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const rows = async (q, p) => (await c.query(q, p)).rows
const one = async (q, p) => (await rows(q, p))[0]

const cotCua = (t) => rows(`select a.attname ten, format_type(a.atttypid, a.atttypmod) kieu, a.attnotnull nn, a.attidentity idn, a.attgenerated gen, pg_get_expr(d.adbin, d.adrelid) mac_dinh, a.attnum
  from pg_attribute a left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum where a.attrelid = $1::regclass and a.attnum > 0 and not a.attisdropped order by a.attnum`, ['public.' + t])
const anh = async (t, boKho) => {
  const v = await one(`select count(*)::int n, md5(coalesce(string_agg(h, ',' order by h), '')) h from (select md5((to_jsonb(x) ${boKho ? "- 'kho'" : ''})::text) h from public.${t} x) y`)
  const d = await one(`select (select count(*) from pg_trigger where tgrelid = $1::regclass and not tgisinternal)::int trg, (select count(*) from pg_constraint where conrelid = $1::regclass and contype in ('f','p','u'))::int khoa,
     (select count(*) from pg_constraint where confrelid = $1::regclass and contype = 'f')::int fk_den, (select count(*) from pg_policies where schemaname = 'public' and tablename = $2)::int pol, (select count(*) from pg_indexes where schemaname = 'public' and tablename = $2)::int idx`, ['public.' + t, t])
  return { ...v, ...d }
}

let hong = 0
for (const HO of HOS) {
  const CHA = 'kho_' + HO
  const co = []
  for (const n of NH) if ((await one(`select to_regclass($1) r`, ['public.' + n + '_' + HO])).r) co.push(n)
  const loi = []
  if (co.length < 2) loi.push('chỉ có ' + co.length + ' nhánh')
  if ((await one(`select to_regclass($1) r`, ['public.' + CHA])).r) loi.push('bảng ' + CHA + ' đã tồn tại')
  const cots = {}; for (const n of co) cots[n] = await cotCua(n + '_' + HO)
  const ky = (cs) => cs.map((x) => `${x.ten}:${x.kieu}:${x.nn}:${x.gen}`).sort().join('|')
  const goc = cots[co[0]] || []
  for (const n of co) { if (ky(cots[n]) !== ky(goc)) loi.push(`cột nhánh ${n} lệch nhánh ${co[0]}`); if (cots[n].some((x) => x.idn)) loi.push(`nhánh ${n} có cột identity`); if (cots[n].some((x) => x.ten === 'kho')) loi.push(`nhánh ${n} đã có cột kho`) }
  const laPhan = await rows(`select c.relname from pg_class c where c.relispartition and c.relname = any($1)`, [co.map((n) => n + '_' + HO)])
  if (laPhan.length) loi.push('đã là phần của bảng khác: ' + laPhan.map((x) => x.relname).join(','))
  // hàm ghi vào họ mà không nêu cột / dùng rowtype
  const tenRe = `(${co.join('|')})_${HO}`
  const fx = await rows(`select proname, prosrc from pg_proc where pronamespace = 'public'::regnamespace and prosrc ~ $1`, [`(^|[^a-z0-9_])${tenRe}([^a-z0-9_]|$)`])
  const xau = []
  for (const f of fx) { const s = f.prosrc
    if (new RegExp(`insert\\s+into\\s+(public\\.)?${tenRe}\\s*(as\\s+[a-z_]+\\s*)?(select|values|default|table|with)`, 'i').test(s)) xau.push(f.proname + ' (insert không danh sách cột)')
    if (new RegExp(`${tenRe}\\s*%rowtype`, 'i').test(s)) xau.push(f.proname + ' (%rowtype)') }
  if (xau.length) loi.push('hàm phải sửa trước: ' + [...new Set(xau)].join(', '))
  if (loi.length) { console.log(`✗ ${HO}: ${loi.join(' · ')}`); hong++; continue }

  const dn = goc.map((x) => `  ${x.ten.padEnd(20)} ${x.kieu}${x.gen === 's' ? ` generated always as (${x.mac_dinh}) stored` : ''}${x.nn ? ' not null' : ''}${x.gen !== 's' && x.mac_dinh ? ` default ${x.mac_dinh}` : ''}`)
  const sql = `-- GỘP THEO KHUÔN — họ ${HO} (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột \`kho\` (hằng) rồi gắn làm một PHẦN của bảng chung ${CHA}. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.${CHA} detach partition public.<nhánh>_${HO}; alter table … drop constraint <nhánh>_${HO}_kho_chk, drop column kho;
set local lock_timeout = '5s';
${co.map((n) => `alter table public.${n}_${HO} add column kho text not null default '${n}' constraint ${n}_${HO}_kho_chk check (kho = '${n}');`).join('\n')}

create table public.${CHA} (
${dn.join(',\n')},
  ${'kho'.padEnd(20)} text not null
) partition by list (kho);
comment on table public.${CHA} is 'Bảng CHUNG khuôn dạng–câu, họ ${HO}. Mỗi nhánh là một phần: <nhánh>_${HO}. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
${co.map((n) => `alter table public.${CHA} attach partition public.${n}_${HO} for values in ('${n}');`).join('\n')}

alter table public.${CHA} enable row level security;
revoke all on public.${CHA} from anon;
create policy ${CHA}_member_all on public.${CHA} for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.${CHA} for select to claude_ro using (true);
`
  const t0 = Date.now(); let dat = true; const dong = []
  await c.query('begin')
  try {
    const truoc = {}; for (const n of co) truoc[n] = await anh(n + '_' + HO, false)
    const t1 = Date.now(); await c.query(sql); const msAp = Date.now() - t1
    let tong = 0
    for (const n of co) { const s = await anh(n + '_' + HO, true), t = truoc[n]; tong += s.n
      const ok = s.n === t.n && s.h === t.h && s.trg === t.trg && s.khoa === t.khoa && s.fk_den === t.fk_den && s.pol === t.pol && s.idx === t.idx
      if (!ok) dat = false
      dong.push(`${n}:${t.n}${s.n === t.n && s.h === t.h ? '' : '→' + s.n + ' LỆCH NỘI DUNG'}${s.trg === t.trg && s.khoa === t.khoa && s.fk_den === t.fk_den && s.pol === t.pol && s.idx === t.idx ? '' : ` LỆCH phụ thuộc (trg ${t.trg}→${s.trg} khoá ${t.khoa}→${s.khoa} fkđến ${t.fk_den}→${s.fk_den} pol ${t.pol}→${s.pol} idx ${t.idx}→${s.idx})`}`) }
    const ch = await one(`select count(*)::int n from public.${CHA}`)
    if (ch.n !== tong) { dat = false; dong.push(`bảng chung ${ch.n} ≠ tổng ${tong}`) }
    console.log(`${dat ? '✔' : '✗'} ${HO.padEnd(22)} ${co.length} nhánh · chung ${ch.n} dòng · áp ${msAp} ms · ${dong.join(' ')}`)
  } catch (e) { dat = false; console.log(`✗ ${HO}: LỖI [${e.code}] ${e.message.slice(0, 160)}`) }
  await c.query('rollback')
  if (!dat) { hong++; continue }
  if (DIR) { fs.mkdirSync(DIR, { recursive: true }); fs.writeFileSync(path.join(DIR, HO + '.sql'), sql) }
  void t0
}
await c.end()
console.log(hong ? `\n✗ ${hong} họ chưa đạt.` : `\n✔ Cả ${HOS.length} họ đạt (đã rollback, chưa áp gì).`)
process.exit(hong ? 1 : 0)
