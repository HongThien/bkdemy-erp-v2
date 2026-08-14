// DRY-RUN migration tiền tố mã theo môn: chạy THẬT trong 1 transaction rồi ROLLBACK.
// In báo cáo trước/sau. KHÔNG ghi gì vào DB.
//   node scripts/tiento_dryrun.mjs            → dry-run (rollback)
//   node scripts/tiento_dryrun.mjs --apply    → áp THẬT (commit)
import { readFileSync } from 'node:fs'; import pg from 'pg'

const APPLY  = process.argv.includes('--apply')
const VERIFY = process.argv.includes('--verify')   // chỉ soi trạng thái HIỆN TẠI, không chạy migration
const MIG = 'supabase/migrations/202608141259_tien_to_ma_theo_mon.sql'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s,p=[]) => (await c.query(s,p)).rows
const n = async (s) => Number((await q(s))[0].c)

const KHO_DANG = [['dai_ban_do','ma_dang'],['hinh_ban_do','ma_dang_hinh'],['hgt_ban_do','ma_dang'],['khtn_ban_do','ma_dang']]
const KHO_CAU  = [['dai_cau_hoi','ma_cau'],['hgt_cau_hoi','ma_cau'],['khtn_cau_hoi','ma_cau']]
// (bảng, cột, loại) — text trần cần backfill
const TRAN = [
  ['bai_test_cau','ma_dang','dang'],['bai_test_cau','ma_cau','cau'],
  ['bo_tro_duoi_dang','ma_dang','dang'],['bo_tro_yeu_dang','ma_dang','dang'],
  ['bt_grades','ma_dang','dang'],['bt_grades','ma_cau','cau'],
  ['buoi_danh_gia_dang','ma_dang','dang'],
  ['ca_test_cau','ma_dang','dang'],['ca_test_cau','ma_cau','cau'],
  ['canh_bao_yeu','ma_dang','dang'],
  ['gami_session_problems','ma_dang','dang'],['gami_session_problems','ma_cau','cau'],
  ['tai_lieu_phan','ref_ma','dang'],['tai_lieu_cau','ma_cau','cau'],
  ['kho_cau_log','ma_cau','cau'],['kho_tag_log','ma_cau','cau'],
  ['kho_tag_log','ai_value','dang'],['kho_tag_log','final_value','dang'],
  ['question_accepted_answers','ma_cau','cau'],
]
const conCu = async (t,col) => n(`select count(*)::int c from "${t}" where "${col}" ~ '^[0-9]'`)
const tong  = async (t) => n(`select count(*)::int c from "${t}"`)

async function trungNhau() {
  const P = [['dai_ban_do','ma_dang','khtn_ban_do','ma_dang'],['dai_ban_do','ma_dang','hgt_ban_do','ma_dang'],
             ['dai_ban_do','ma_dang','hinh_ban_do','ma_dang_hinh'],['khtn_ban_do','ma_dang','hgt_ban_do','ma_dang'],
             ['khtn_ban_do','ma_dang','hinh_ban_do','ma_dang_hinh'],['hgt_ban_do','ma_dang','hinh_ban_do','ma_dang_hinh'],
             ['dai_cau_hoi','ma_cau','khtn_cau_hoi','ma_cau'],['dai_cau_hoi','ma_cau','hgt_cau_hoi','ma_cau'],
             ['khtn_cau_hoi','ma_cau','hgt_cau_hoi','ma_cau']]
  const out = []
  for (const [a,ca,b,cb] of P)
    out.push([`${a}.${ca} ∩ ${b}.${cb}`, await n(`select count(*)::int c from "${a}" x join "${b}" y on y."${cb}"=x."${ca}"`)])
  return out
}
async function snapshot() {
  const s = { trung: await trungNhau(), tong: {}, conCu: {} }
  for (const [t] of [...KHO_DANG, ...KHO_CAU]) s.tong[t] = await tong(t)
  for (const [t,col] of [...KHO_DANG, ...KHO_CAU, ...TRAN]) s.conCu[`${t}.${col}`] = await conCu(t,col)
  for (const [t] of TRAN) if (s.tong[t] === undefined) s.tong[t] = await tong(t)
  return s
}
// dòng đo trỏ tới mã KHÔNG tồn tại ở kho nào (mồ côi) — phải KHÔNG tăng
async function moCoi() {
  const all = `select ma_dang from dai_ban_do union all select ma_dang_hinh from hinh_ban_do
               union all select ma_dang from hgt_ban_do union all select ma_dang from khtn_ban_do`
  const r = {}
  for (const [t,col,loai] of TRAN) {
    if (loai !== 'dang') continue
    r[`${t}.${col}`] = await n(`select count(*)::int c from "${t}" where "${col}" is not null and "${col}" <> ''
       and "${col}" not in (${all})`)
  }
  return r
}

console.log(`\n${'═'.repeat(78)}\n  ${APPLY ? '🔴 ÁP THẬT (COMMIT)' : '🟡 DRY-RUN (sẽ ROLLBACK — không ghi gì)'}\n${'═'.repeat(78)}`)

await c.query('begin')
let ok = true
try {
  const before = await snapshot(); const moCoiTruoc = await moCoi()
  let ms = 0
  if (!VERIFY) { const t0 = Date.now(); await c.query(readFileSync(MIG, 'utf8')); ms = Date.now() - t0 }
  const after = VERIFY ? before : await snapshot()
  const moCoiSau = VERIFY ? moCoiTruoc : await moCoi()

  console.log(VERIFY ? '\n▸ CHỈ SOI trạng thái hiện tại (migration KHÔNG chạy lại)\n' : `\n▸ migration chạy ${ms}ms\n`)

  console.log('── TRÙNG MÃ GIỮA CÁC KHO ' + '─'.repeat(52))
  before.trung.forEach(([k,v],i)=>{
    const a = after.trung[i][1]
    console.log(`   ${k.padEnd(46)} ${String(v).padStart(4)} → ${String(a).padStart(4)}  ${a===0?'✅':'❌ CÒN TRÙNG'}`)
    if (a!==0) ok = false
  })

  console.log('\n── KHO: mã còn dạng CŨ (bắt đầu bằng số) ' + '─'.repeat(37))
  for (const [t,col] of [...KHO_DANG, ...KHO_CAU]) {
    const k=`${t}.${col}`, b=before.conCu[k], a=after.conCu[k]
    console.log(`   ${k.padEnd(34)} ${String(before.tong[t]).padStart(6)} dòng · cũ ${String(b).padStart(6)} → ${String(a).padStart(5)}  ${a===0?'✅':'❌'}`)
    if (a!==0) ok = false
  }

  console.log('\n── TEXT TRẦN: đã gắn tiền tố / còn sót ' + '─'.repeat(39))
  let sot = 0
  for (const [t,col] of TRAN) {
    const k=`${t}.${col}`, b=before.conCu[k], a=after.conCu[k]
    if (b===0 && a===0) continue
    sot += a
    console.log(`   ${k.padEnd(34)} cũ ${String(b).padStart(6)} → còn ${String(a).padStart(5)}  (đổi ${b-a})  ${a===0?'✅':'⚠ KHÔNG PHÂN GIẢI ĐƯỢC'}`)
  }
  console.log(`   ${'TỔNG còn sót'.padEnd(34)} ${sot}${sot?'  ⚠ những dòng này ĐỂ NGUYÊN (không đoán bừa)':'  ✅'}`)

  console.log('\n── MỒ CÔI (mã đo không có ở kho nào) — phải KHÔNG tăng ' + '─'.repeat(23))
  for (const k of Object.keys(moCoiTruoc)) {
    const b=moCoiTruoc[k], a=moCoiSau[k]
    if (b===0 && a===0) continue
    console.log(`   ${k.padEnd(34)} ${b} → ${a}  ${a<=b?'✅':'❌ TĂNG'}`)
    if (a>b) ok = false
  }
  if (Object.values(moCoiSau).every(v=>v===0)) console.log('   (không có mồ côi ở bảng nào) ✅')

  console.log('\n── SỐ DÒNG các bảng (phải KHÔNG đổi) ' + '─'.repeat(41))
  let lech = 0
  for (const t of Object.keys(before.tong)) {
    const a = await tong(t)
    if (a !== before.tong[t]) { console.log(`   ❌ ${t}: ${before.tong[t]} → ${a}`); lech++; ok = false }
  }
  console.log(lech ? `   ${lech} bảng LỆCH` : '   mọi bảng giữ nguyên số dòng ✅')

  // sanity: mỗi dòng đo giờ khớp ĐÚNG 1 kho
  console.log('\n── SAU FIX: mỗi mã đo khớp đúng 1 kho? ' + '─'.repeat(39))
  for (const [t,col,loai] of TRAN) {
    if (loai !== 'dang') continue
    const r = await n(`select count(*)::int c from "${t}" x where x."${col}" is not null and x."${col}"<>'' and (
        (case when exists(select 1 from dai_ban_do d where d.ma_dang=x."${col}") then 1 else 0 end) +
        (case when exists(select 1 from hinh_ban_do h where h.ma_dang_hinh=x."${col}") then 1 else 0 end) +
        (case when exists(select 1 from hgt_ban_do g where g.ma_dang=x."${col}") then 1 else 0 end) +
        (case when exists(select 1 from khtn_ban_do k where k.ma_dang=x."${col}") then 1 else 0 end)) > 1`)
    if (r > 0) { console.log(`   ❌ ${t}.${col}: ${r} dòng vẫn khớp >1 kho`); ok = false }
  }
  console.log('   (0 dòng nhập nhằng) ✅')

  console.log('\n── PHÂN BỔ SAU FIX (dòng đo về từng kho) ' + '─'.repeat(37))
  for (const [t,col,loai] of TRAN) {
    if (loai !== 'dang') continue
    const r = await q(`select left("${col}", case when "${col}" like 'K%' then 1 else 2 end) p, count(*)::int c
      from "${t}" where "${col}" ~ '^[A-Z]' group by 1 order by 2 desc`)
    if (r.length) console.log(`   ${t}.${col}: ` + r.map(x=>`${x.p}=${x.c}`).join(' · '))
  }

  if (APPLY && ok) { await c.query('commit'); console.log('\n✅ ĐÃ COMMIT.') }
  else if (APPLY)  { await c.query('rollback'); console.log('\n❌ CÓ LỖI KIỂM TRA → ĐÃ ROLLBACK, DB không đổi.') }
  else             { await c.query('rollback'); console.log('\n🟡 ĐÃ ROLLBACK — DB nguyên vẹn. Chạy lại với --apply để áp thật.') }
} catch (e) {
  await c.query('rollback')
  console.error('\n❌ LỖI → rollback:', e.message)
  if (e.hint) console.error('   hint:', e.hint)
  if (e.where) console.error('   where:', e.where)
  process.exitCode = 1
}
await c.end()
