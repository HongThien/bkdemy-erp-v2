// Dry-run migration tiền tố CHỦ ĐỀ / CHUYÊN ĐỀ. Chạy trong transaction rồi ROLLBACK.
//   node scripts/tiento2_dryrun.mjs [đường-dẫn-sql]
import { readFileSync } from 'node:fs'; import pg from 'pg'
const SQL = process.argv[2] ?? 'supabase/migrations/202608141430_tien_to_ma_chu_de.sql'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s) => (await c.query(s)).rows
const n = async (s) => Number((await q(s))[0].c)

const COLS = [['dai_ban_do','ma_chu_de'],['dai_ban_do','ma_chuyen_de'],['dai_chuyen_de_ly_thuyet','ma_chuyen_de'],
  ['hinh_ban_do','ma_mang'],['hinh_ban_do','ma_loai_ch'],['hgt_ban_do','ma_chu_de'],['hgt_ban_do','ma_chuyen_de'],
  ['hgt_chuyen_de_ly_thuyet','ma_chuyen_de'],['khtn_ban_do','ma_chu_de'],['khtn_ban_do','ma_chuyen_de'],
  ['khtn_chuyen_de_ly_thuyet','ma_chuyen_de']]
const PAIRS = [['dai_ban_do','khtn_ban_do'],['dai_ban_do','hgt_ban_do'],['khtn_ban_do','hgt_ban_do']]

const cu = () => Promise.all(COLS.map(async ([t,col]) => [`${t}.${col}`, await n(`select count(*)::int c from "${t}" where "${col}" ~ '^[0-9]'`), await n(`select count(*)::int c from "${t}"`)]))
const trung = () => Promise.all(PAIRS.flatMap(([a,b]) => [
  [`${a} ∩ ${b} · chủ đề`,   n(`select count(distinct x.ma_chu_de)::int c from ${a} x join ${b} y on y.ma_chu_de=x.ma_chu_de`)],
  [`${a} ∩ ${b} · chuyên đề`, n(`select count(distinct x.ma_chuyen_de)::int c from ${a} x join ${b} y on y.ma_chuyen_de=x.ma_chuyen_de`)],
].map(async ([k,p]) => [k, await p])))

console.log('\n🟡 DRY-RUN (rollback cuối) —', SQL, '\n')
await c.query('begin')
try {
  const cuTruoc = await cu(), trungTruoc = await trung()
  const res = await c.query(readFileSync(SQL, 'utf8'))
  const cuSau = await cu(), trungSau = await trung()
  ;[].concat(res).flat().forEach(r => (r?.rows === undefined) && 0)

  console.log('── TRÙNG giữa các kho ' + '─'.repeat(50))
  trungTruoc.forEach(([k,v],i)=>console.log(`   ${k.padEnd(42)} ${String(v).padStart(3)} → ${String(trungSau[i][1]).padStart(3)}  ${trungSau[i][1]===0?'✅':'❌'}`))

  console.log('\n── Mã còn dạng CŨ (bắt đầu bằng số) ' + '─'.repeat(36))
  cuTruoc.forEach(([k,v,tong],i)=>console.log(`   ${k.padEnd(42)} ${String(tong).padStart(4)} dòng · cũ ${String(v).padStart(4)} → ${String(cuSau[i][1]).padStart(4)}  ${cuSau[i][1]===0?'✅':'❌'}`))

  console.log('\n── Mẫu sau khi đổi ' + '─'.repeat(53))
  for (const t of ['dai_ban_do','khtn_ban_do','hgt_ban_do']) {
    const r = (await q(`select ma_chu_de, ma_chuyen_de, ma_dang from ${t} order by ma_dang limit 2`))
    r.forEach(x=>console.log(`   ${t.padEnd(13)} chủ đề ${String(x.ma_chu_de).padEnd(9)} chuyên đề ${String(x.ma_chuyen_de).padEnd(11)} dạng ${x.ma_dang}`))
  }
  const h = (await q(`select ma_mang, ma_loai_ch, ma_dang_hinh from hinh_ban_do order by 1 limit 2`))
  h.forEach(x=>console.log(`   hinh_ban_do   mảng   ${String(x.ma_mang).padEnd(9)} loại      ${String(x.ma_loai_ch).padEnd(11)} dạng ${x.ma_dang_hinh}`))

  await c.query('rollback')
  console.log('\n🟡 ĐÃ ROLLBACK — DB nguyên vẹn.')
} catch (e) {
  await c.query('rollback')
  console.error('\n❌ LỖI → rollback:', e.message); process.exitCode = 1
}
await c.end()
