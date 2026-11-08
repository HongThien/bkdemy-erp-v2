// DUYỆT MÁY form TN đang CHỜ của câu thuộc dạng bài NDB K6–12 còn 0 MCQ đạt chuẩn (Thùy 24/10: "duyệt 628 form MCQ chờ — soát máy trước").
//   node scripts/_duyet_form_bdm.mjs          → xuất form chờ (dai + hgt) ra kho-rules/dai/lo/mcq-bdm/duyet-may/*.json, chạy
//                                                CHÍNH hàm kiểm của mcq-sinh.mjs (--verify --thay; FAIL thì thử lại khuôn --theo-dap-so),
//                                                in OK/FAIL. KHÔNG ghi.
//   node scripts/_duyet_form_bdm.mjs --ghi    → như trên rồi đặt da_duyet=true (duyet_boi = Admin hệ thống, duyệt máy theo lệnh Thùy)
//                                                CHỈ cho form OK, 1 transaction. FAIL giữ nguyên chờ duyệt + danh sách lý do.
import pg from 'pg'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
await c.query('set statement_timeout = 0')
const GHI = process.argv.includes('--ghi')
const DIR = 'kho-rules/dai/lo/mcq-bdm/duyet-may'
mkdirSync(DIR, { recursive: true })
const dk = (await c.query(`select _kho_dk_mcq_sql('bdm_cau_hoi') d`)).rows[0].d
await c.query(`create temp table tc as select c.ma_cau, c.dang_chinh ndb, (${dk}) la_mcq from bdm_cau_hoi c where c.xoa_at is null and c.dang_chinh like 'NDB%'`)
await c.query(`create temp table dich as select tc.ma_cau, tc.ndb, b.khoi from tc join bdm_ban_do b on b.ma_dang = tc.ndb
                where b.khoi in ('6','7','8','9','10','11','12') and not exists (select 1 from tc t2 where t2.ndb = tc.ndb and t2.la_mcq)`)
const ketQua = {}
const chay = (f, kho, them = []) => {
  try { return execFileSync('node', ['scripts/mcq-sinh.mjs', '--verify', f, '--thay', 'kiem', '--kho', kho, ...them], { encoding: 'utf8', maxBuffer: 64e6 }) }
  catch (e) { return String(e.stdout ?? '') }   // verify trả exit 1 khi có FAIL — vẫn đọc stdout
}
for (const kho of ['dai', 'hgt']) {
  const forms = (await c.query(`select f.id, f.ma_cau, f.dap_an, f.lua_chon, d.khoi, d.ndb from ${kho}_cau_form_tn f join dich d on d.ma_cau = f.ma_cau
                                 where f.xoa_at is null and not f.da_duyet order by d.khoi, d.ndb, f.ma_cau`)).rows
  if (!forms.length) continue
  const f = `${DIR}/cho-${kho}.json`
  writeFileSync(f, JSON.stringify(forms.map((x) => ({ ma_cau: x.ma_cau, dap_an: x.dap_an, lua_chon: x.lua_chon })), null, 1), 'utf8')
  const ok = new Set(), loi = new Map()
  const doc = (out) => { for (const m of out.matchAll(/^OK\s+(\S+)/gm)) ok.add(m[1]); for (const m of out.matchAll(/^FAIL (\S+)\n((?:  - .*\n?)*)/gm)) if (!ok.has(m[1])) loi.set(m[1], m[2].trim()) }
  doc(chay(f, kho))
  doc(chay(f, kho, ['--theo-dap-so']))
  for (const m of ok) loi.delete(m)
  ketQua[kho] = { forms, ok, loi }
  const theoKhoi = {}
  for (const x of forms) { const k = (theoKhoi[x.khoi] ??= { form: 0, ok: 0 }); k.form++; if (ok.has(x.ma_cau)) k.ok++ }
  console.log(`\n[${kho}] ${forms.length} form chờ · ${ok.size} OK · ${loi.size} FAIL`, JSON.stringify(theoKhoi))
}
const failRows = Object.entries(ketQua).flatMap(([kho, r]) => [...r.loi].map(([ma, ly]) => ({ kho, ma_cau: ma, ly_do: ly })))
writeFileSync(`${DIR}/fail.json`, JSON.stringify(failRows, null, 1), 'utf8')
const lyDo = {}
for (const r of failRows) { const k = r.ly_do.split('\n')[0].replace(/[\d.,/\\{}$()-]+/g, '#').slice(2, 60); lyDo[k] = (lyDo[k] ?? 0) + 1 }
console.log('FAIL theo lý do:', Object.entries(lyDo).sort((a, b) => b[1] - a[1]).slice(0, 10))
if (GHI) {
  const [ad] = (await c.query(`select id from nhan_su where lower(email) = 'admin@gmail.com' limit 1`)).rows
  await c.query('begin')
  let n = 0
  for (const [kho, r] of Object.entries(ketQua)) {
    const ids = r.forms.filter((x) => r.ok.has(x.ma_cau)).map((x) => x.id)
    const u = await c.query(`update ${kho}_cau_form_tn set da_duyet = true, duyet_boi = $2, duyet_at = now() where id = any($1) and not da_duyet and xoa_at is null`, [ids, ad.id])
    n += u.rowCount
  }
  await c.query('commit')
  console.log(`ĐÃ DUYỆT ${n} form (duyet_boi = Admin hệ thống).`)
}
await c.end()
