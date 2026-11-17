// ============================================================================
// duyet-form-4t-tbc.mjs — DUYỆT form TRẮC NGHIỆM (dai_cau_form_tn) của 27 câu gốc + mọi clone «Clone 4T TBC c1» (chuyên đề Trung bình cộng 4T)
// — Thùy 17/11: "đã bảo làm câu trắc nghiệm thì tự duyệt đi".
//   node scripts/kho/duyet-form-4t-tbc.mjs [--ghi]     (không --ghi = chạy thử rồi ROLLBACK)
// Cổng riêng trước khi duyệt (form không qua cổng thì KHÔNG duyệt, liệt kê): đúng 4 phương án · đúng 1 phương án dung · 4 phương án khác nhau ·
// chữ cái dap_an trỏ đúng phương án dung · số trong phương án dung = số trong đáp án của câu (bộ kiểm độc lập với bộ sinh form).
// Duyệt qua fn_mcq_form_duyet_batch (cùng đường màn Duyệt form) bằng tài khoản admin.
// ============================================================================
import pg from 'pg'
import fs from 'node:fs'

const GHI = process.argv.includes('--ghi')
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const goc = JSON.parse(fs.readFileSync('kho-rules/dai/lo/b3/k4T-tbc/lo-01.json', 'utf8')).map((x) => x.ma_cau)
const so = (s) => (String(s).replace(/\\text\{[^}]*\}/g, ' ').replace(/[^\d,.\s-]/g, ' ').match(/\d+(?:[.,]\d+)?/g) || []).map((x) => x.replace(',', '.')).join('|')
try {
  await q('begin')
  const [ad] = await q("select tk.id, tk.nhan_su_id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const fs_ = await q(`select f.id, f.ma_cau, f.lua_chon, f.dap_an, c.dap_an cau_da, c.da_duyet cau_duyet
      from dai_cau_form_tn f join dai_cau_hoi c on c.ma_cau = f.ma_cau
     where f.xoa_at is null and not f.da_duyet and c.xoa_at is null and (c.ma_cau = any($1) or c.ten_de_goc like 'Clone 4T TBC c1 · %')`, [goc])
  const dat = [], hong = []
  for (const f of fs_) {
    const lc = f.lua_chon, ly = []
    if (!Array.isArray(lc) || lc.length !== 4) ly.push(`số phương án = ${Array.isArray(lc) ? lc.length : 'không phải mảng'}`)
    else {
      const dung = lc.map((o, i) => (o.dung ? i : -1)).filter((i) => i >= 0)
      if (dung.length !== 1) ly.push(`số phương án dung = ${dung.length}`)
      else {
        if ('ABCD'[dung[0]] !== f.dap_an) ly.push(`dap_an ${f.dap_an} ≠ vị trí phương án dung ${'ABCD'[dung[0]]}`)
        if (so(lc[dung[0]].text) !== so(f.cau_da)) ly.push(`số phương án dung [${so(lc[dung[0]].text)}] ≠ đáp số câu [${so(f.cau_da)}]`)
      }
      if (new Set(lc.map((o) => so(o.text) + '|' + String(o.text).replace(/[\d\s$.,]/g, ''))).size !== 4) ly.push('có 2 phương án trùng nhau')
    }
    if (!f.cau_duyet) ly.push('câu chưa duyệt')
    ;(ly.length ? hong : dat).push({ f, ly })
  }
  let duyet = 0
  if (dat.length) {
    const [r] = await q(`select fn_mcq_form_duyet_batch('dai', $1::uuid[], $2) r`, [dat.map((x) => x.f.id), ad.nhan_su_id])
    duyet = r.r.duyet
  }
  console.log(`form chưa duyệt trong phạm vi ${fs_.length} · qua cổng ${dat.length} · duyệt ${duyet} · không qua cổng ${hong.length}`)
  for (const h of hong.slice(0, 25)) console.log('  ✘', h.f.ma_cau, h.ly.join(' | '))
  if (GHI) { await q('commit'); console.log('ĐÃ GHI.') } else { await q('rollback'); console.log('THỬ ⇒ ROLLBACK') }
} catch (e) { await q('rollback'); console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
