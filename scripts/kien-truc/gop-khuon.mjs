// ============================================================================
// ⛔⛔ KHÔNG DÙNG (13/11 tối): cách gắn PARTITION này làm PostgREST không lộ bảng nhánh ra API ⇒ app hỏng (đã cứu bằng mig 202611132053).
// Giữ file làm tư liệu + để tái dùng phần so khớp/làm khớp cột cho cách gộp khác. Script tự dừng ngay bên dưới.
// GỘP THEO KHUÔN (spec-kien-truc.md §2b): gắn các bảng <nhánh>_<họ> làm PHẦN của bảng chung kho_<họ>.
//   node scripts/kien-truc/gop-khuon.mjs <họ> [<họ>…]            → CHẠY THỬ từng họ trong transaction rồi ROLLBACK, in bảng so khớp
//   node scripts/kien-truc/gop-khuon.mjs --ghi <thư-mục> <họ>…   → như trên + ghi <thư-mục>/<họ>.sql cho họ ĐẠT (để đưa vào supabase/migrations)
// Không tự áp gì. Áp = npm run new-migration rồi migrate --only (mỗi họ một file ⇒ mỗi họ một transaction, khoá bảng dưới ~1 giây).
// ⚠ Áp nhiều họ liên tiếp: giãn nhịp, tránh phút chia hết cho 5 (máy 60 kết nối; 13/11 áp dồn làm 6 job cron lỡ một khe).
//
// Tự làm khớp trước khi gắn (chỉ THÊM, không đổi hành vi nhánh nào):
//   · cột có ở nhánh này, thiếu ở nhánh kia ⇒ thêm cột (cho phép rỗng) vào nhánh thiếu;
//   · not null lệch nhau ⇒ bảng chung cho rỗng, nhánh nào đang not null giữ nguyên ràng buộc của mình;
//   · cột tự tăng kiểu IDENTITY (không gắn làm phần được) ⇒ đổi sang sequence + default, số kế tiếp giữ nguyên.
// Điều kiện ĐẠT: cột cùng tên phải cùng kiểu · không hàm nào insert vào họ mà thiếu danh sách cột · sau khi gắn: số dòng + vân tay nội dung
// từng nhánh (trên các cột cũ) không đổi, số trigger / khoá / khoá ngoại trỏ đến / policy / index không đổi, bảng chung = tổng các nhánh.
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

console.error('⛔ gop-khuon.mjs đã bị khoá: gắn partition làm app mất bảng qua API (xem spec-kien-truc.md §2b).'); process.exit(3)
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const NH = ['dai', 'hgt', 'khtn', 'vatly', 'hoahoc']
const argv = process.argv.slice(2)
const gi = argv.indexOf('--ghi'); const DIR = gi >= 0 ? argv[gi + 1] : null
const HOS = argv.filter((a, i) => !a.startsWith('--') && !(gi >= 0 && i === gi + 1))
if (!HOS.length) { console.error('Thiếu tên họ bảng.'); process.exit(2) }
const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const rows = async (q, p) => (await c.query(q, p)).rows
const one = async (q, p) => (await rows(q, p))[0]

const cotCua = (t) => rows(`select a.attname ten, format_type(a.atttypid, a.atttypmod) kieu, a.attnotnull nn, a.attidentity idn, a.attgenerated gen, pg_get_expr(d.adbin, d.adrelid) mac_dinh
  from pg_attribute a left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum where a.attrelid = $1::regclass and a.attnum > 0 and not a.attisdropped order by a.attnum`, ['public.' + t])
const anh = async (t, bo) => {
  const v = await one(`select count(*)::int n, md5(coalesce(string_agg(h, ',' order by h), '')) h from (select md5((to_jsonb(x) - $1::text[])::text) h from public.${t} x) y`, [bo.length ? bo : ['__khong_co__']])
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

  // hợp các cột của mọi nhánh
  const hop = new Map(); const themCot = []; const boIdn = []
  for (const n of co) for (const x of cots[n]) {
    const h = hop.get(x.ten)
    if (!h) hop.set(x.ten, { ...x, nnChung: x.nn })
    else { h.nnChung = h.nnChung && x.nn; if (h.kieu !== x.kieu || h.gen !== x.gen) loi.push(`cột ${x.ten}: kiểu lệch giữa các nhánh (${h.kieu} / ${x.kieu})`) }
  }
  for (const n of co) {
    if (cots[n].some((x) => x.ten === 'kho')) loi.push(`nhánh ${n} đã có cột kho`)
    for (const [ten, h] of hop) if (!cots[n].some((x) => x.ten === ten)) { if (h.gen) loi.push(`cột sinh ${ten} thiếu ở ${n}`); themCot.push({ n, ten, kieu: h.kieu }); h.nnChung = false }
    for (const x of cots[n]) if (x.idn) boIdn.push({ n, ten: x.ten })
  }
  const cotThem = [...new Set(themCot.map((x) => x.ten))]
  const laPhan = await rows(`select c.relname from pg_class c where c.relispartition and c.relname = any($1)`, [co.map((n) => n + '_' + HO)])
  if (laPhan.length) loi.push('đã là phần của bảng khác: ' + laPhan.map((x) => x.relname).join(','))

  // hàm insert vào họ mà không nêu danh sách cột ⇒ vỡ khi thêm cột
  const tenRe = '(' + co.join('|') + ')_' + HO
  const fx = await rows(`select proname, prosrc from pg_proc where pronamespace = 'public'::regnamespace and prosrc ~ $1`, ['(^|[^a-z0-9_])' + tenRe + '([^a-z0-9_]|$)'])
  const reIns = new RegExp('insert\\s+into\\s+(public\\.)?' + tenRe + '\\s*(as\\s+[a-z_]+\\s*)?(select|values|default|table|with)', 'i')
  const xau = fx.filter((f) => reIns.test(f.prosrc)).map((f) => f.proname)
  if (xau.length) loi.push('hàm insert không danh sách cột — sửa trước: ' + [...new Set(xau)].join(', '))
  if (loi.length) { console.log(`✗ ${HO}: ${loi.join(' · ')}`); hong++; continue }

  const dn = [...hop.values()].map((x) => {
    const tuTang = x.idn || /nextval\(/.test(x.mac_dinh || '')
    return `  ${x.ten.padEnd(20)} ${x.kieu}${x.gen === 's' ? ` generated always as (${x.mac_dinh}) stored` : ''}${x.nnChung ? ' not null' : ''}${x.gen !== 's' && x.mac_dinh && !tuTang ? ` default ${x.mac_dinh}` : ''}`
  })
  const T = (n) => `public.${n}_${HO}`
  const sqlThem = themCot.length ? '-- Làm khớp cột: thêm cột còn thiếu ở từng nhánh (cho phép rỗng; dữ liệu sẵn có không đổi)\n' + themCot.map((x) => `alter table ${T(x.n)} add column ${x.ten} ${x.kieu};`).join('\n') + '\n' : ''
  const sqlIdn = boIdn.length ? '-- Cột tự tăng kiểu IDENTITY không gắn làm phần được ⇒ đổi sang sequence + default (số kế tiếp giữ nguyên)\n' + boIdn.map((x) => {
    const sq = `public.${x.n}_${HO}_${x.ten}_seq2`
    return `alter table ${T(x.n)} alter column ${x.ten} drop identity;\ncreate sequence ${sq} owned by ${T(x.n)}.${x.ten};\nselect setval('${sq}', greatest((select coalesce(max(${x.ten}), 0) from ${T(x.n)}), 1), (select count(*) > 0 from ${T(x.n)}));\nalter table ${T(x.n)} alter column ${x.ten} set default nextval('${sq}');`
  }).join('\n') + '\n' : ''
  const sql = `-- GỘP THEO KHUÔN — họ ${HO} (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột \`kho\` (hằng) rồi gắn làm một PHẦN của bảng chung ${CHA}. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.${CHA} detach partition public.<nhánh>_${HO}; alter table … drop constraint <nhánh>_${HO}_kho_chk, drop column kho;
set local lock_timeout = '5s';
${sqlThem}${sqlIdn}${co.map((n) => `alter table ${T(n)} add column kho text not null default '${n}' constraint ${n}_${HO}_kho_chk check (kho = '${n}');`).join('\n')}

create table public.${CHA} (
${dn.join(',\n')},
  ${'kho'.padEnd(20)} text not null
) partition by list (kho);
comment on table public.${CHA} is 'Bảng CHUNG khuôn dạng–câu, họ ${HO}. Mỗi nhánh là một phần: <nhánh>_${HO}. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
${co.map((n) => `alter table public.${CHA} attach partition ${T(n)} for values in ('${n}');`).join('\n')}

alter table public.${CHA} enable row level security;
revoke all on public.${CHA} from anon;
create policy ${CHA}_member_all on public.${CHA} for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.${CHA} for select to claude_ro using (true);
`
  let dat = true; const dong = []
  await c.query('begin')
  try {
    const truoc = {}; for (const n of co) truoc[n] = await anh(n + '_' + HO, [])
    const idTruoc = {}; for (const x of boIdn) idTruoc[x.n] = (await one(`select coalesce(max(${x.ten}), 0)::bigint m from ${T(x.n)}`)).m
    const t1 = Date.now(); await c.query(sql); const msAp = Date.now() - t1
    let tong = 0
    for (const n of co) {
      // so trên các cột CŨ của chính nhánh đó: bỏ `kho` và những cột vừa thêm cho nhánh này (nhánh vốn có cột thì vẫn so cột đó)
      const s = await anh(n + '_' + HO, ['kho', ...themCot.filter((x) => x.n === n).map((x) => x.ten)]), t = truoc[n]; tong += s.n
      const okND = s.n === t.n && s.h === t.h
      const okPT = s.trg === t.trg && s.khoa === t.khoa && s.fk_den === t.fk_den && s.pol === t.pol && s.idx === t.idx
      if (!okND || !okPT) dat = false
      dong.push(`${n}:${t.n}${okND ? '' : '→' + s.n + ' LỆCH NỘI DUNG'}${okPT ? '' : ` LỆCH phụ thuộc (trg ${t.trg}→${s.trg} khoá ${t.khoa}→${s.khoa} fkđến ${t.fk_den}→${s.fk_den} pol ${t.pol}→${s.pol} idx ${t.idx}→${s.idx})`}`)
    }
    for (const x of boIdn) { const k = (await one(`select nextval('public.${x.n}_${HO}_${x.ten}_seq2')::bigint v`)).v; if (Number(k) <= Number(idTruoc[x.n])) { dat = false; dong.push(`số kế tiếp ${x.n}.${x.ten} = ${k} ≤ max ${idTruoc[x.n]}`) } }
    const ch = await one(`select count(*)::int n from public.${CHA}`)
    if (ch.n !== tong) { dat = false; dong.push(`bảng chung ${ch.n} ≠ tổng ${tong}`) }
    console.log(`${dat ? '✔' : '✗'} ${HO.padEnd(18)}${themCot.length ? ' +cột[' + themCot.map((x) => x.n + '.' + x.ten).join(',') + ']' : ''}${boIdn.length ? ' đổi-tự-tăng[' + boIdn.map((x) => x.n).join(',') + ']' : ''} · ${co.length} nhánh · chung ${ch.n} dòng · áp ${msAp} ms · ${dong.join(' ')}`)
  } catch (e) { dat = false; console.log(`✗ ${HO}: LỖI [${e.code}] ${e.message.slice(0, 200)}`) }
  await c.query('rollback')
  if (!dat) { hong++; continue }
  if (DIR) { fs.mkdirSync(DIR, { recursive: true }); fs.writeFileSync(path.join(DIR, HO + '.sql'), sql) }
}
await c.end()
console.log(hong ? `\n✗ ${hong} họ chưa đạt.` : `\n✔ Cả ${HOS.length} họ đạt (đã rollback, chưa áp gì).`)
process.exit(hong ? 1 : 0)
