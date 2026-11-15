// Ghi câu CLONE cho 3 dạng véc tơ K10 (Thùy 15/11: "clone thêm ~20 bài mỗi dạng 5.1 · 6.1 · 6.2 chuyên đề Các phép toán với Vector"):
//   NDB01401 cực trị véc tơ (5.1) · NDB00909 Tách véc tơ (6.1) · NDB00913 Chứng minh 2 véc tơ cùng phương (6.2)
// Nguồn: .nhap-tam/clone-vt/<NDB>.json (câu sinh) + <NDB>.soat.json (agent Opus giải MÙ, không thấy đáp án). Chỉ ghi câu mà đáp án soát mù KHỚP và ok_de.
// Ghi vào hgt_cau_hoi (nguon='clone', clone_method='claude_code_soat_mu') rồi gán hgt_bdm_gan_cau nguon 'ai' ⇒ trigger _bdm_tu_duyet_sau_gan tự duyệt (luật 05/11).
//   node kho-rules/dai/lo/k10-vecto-clone/ghi.mjs [--moi-dang 20] [--ghi]     (không --ghi = chạy thử ROLLBACK)
import fs from 'node:fs'
import pg from 'pg'
process.loadEnvFile('.env')
const a = process.argv.slice(2), GHI = a.includes('--ghi')
const MOI = a.includes('--moi-dang') ? +a[a.indexOf('--moi-dang') + 1] : 20
const DIR = '.nhap-tam/clone-vt/'
const DANG = ['NDB01401', 'NDB00909', 'NDB00913']
const chuan = (s) => (s || '').toLowerCase().replace(/\s+/g, '').replace(/[$\\{}()]/g, '')
const so = (s) => String(s ?? '').trim().replace(/\$/g, '').replace(/\s+/g, '').replace(/,/g, '.').replace(/\\dfrac|\\frac/g, 'frac')

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  const daCo = new Set((await c.query(`select noi_dung from hgt_cau_hoi where xoa_at is null`)).rows.map((r) => chuan(r.noi_dung)))
  const bang = []
  for (const d of DANG) {
    const cau = JSON.parse(fs.readFileSync(DIR + d + '.json', 'utf8'))
    const soat = JSON.parse(fs.readFileSync(DIR + d + '.soat.json', 'utf8'))
    const goc = new Set((await c.query(`select g.ma_cau from hgt_bdm_gan_cau g join hgt_cau_hoi q on q.ma_cau=g.ma_cau where g.dang_bai_id=$1 and q.xoa_at is null`, [d])).rows.map((r) => r.ma_cau))
    let ok = 0, lech = 0, hong = 0, trung = 0, vuot = 0
    for (let i = 0; i < cau.length; i++) {
      const q = cau[i], s = soat.find((x) => x.i === i)
      if (!s || !s.ok_de) { hong++; continue }
      if (!goc.has(q.parent_ma_cau)) { hong++; continue }
      if (!q.noi_dung || !q.loi_giai || !q.dap_an) { hong++; continue }
      if (q.loai_cau === 'trac_nghiem' && (!Array.isArray(q.lua_chon) || q.lua_chon.length !== 4 || !/^[A-D]$/.test(q.dap_an))) { hong++; continue }
      if (so(s.dap_an) !== so(q.dap_an)) { lech++; continue }
      const k = chuan(q.noi_dung)
      if (daCo.has(k)) { trung++; continue }
      if (ok >= MOI) { vuot++; continue }
      daCo.add(k)
      const ma = (await c.query(`insert into hgt_cau_hoi (dang_chinh, loai_cau, noi_dung, lua_chon, dap_an, loi_giai, nguon, nguon_giai, parent_ma_cau, clone_method, kiem_may, kiem_may_at, kiem_may_boi, kiem_may_ghi)
        values ('T310000000', $1, $2, $3, $4, $5, 'clone', 'ai', $6, 'claude_code_soat_mu', 'khop', now(), 'claude_code', 'Opus giải mù từ đề, trùng đáp án') returning ma_cau`,
        [q.loai_cau, q.noi_dung, q.lua_chon ? JSON.stringify(q.lua_chon) : null, q.dap_an, q.loi_giai, q.parent_ma_cau])).rows[0].ma_cau
      await c.query(`insert into hgt_bdm_gan_cau (ma_cau, dang_bai_id, nguon) values ($1, $2, 'ai')`, [ma, d])
      ok++
    }
    bang.push({ dang: d, sinh: cau.length, ghi: ok, lech_soat: lech, hong_de_hoac_form: hong, trung_de: trung, vuot_so_luong: vuot })
  }
  console.table(bang)
  const tong = bang.reduce((s, x) => s + x.ghi, 0)
  const duyet = (await c.query(`select count(*) n from hgt_cau_hoi where clone_method='claude_code_soat_mu' and da_duyet and xoa_at is null`)).rows[0].n
  console.log(`tổng ghi ${tong} · đã tự duyệt qua trigger: ${duyet}`)
  if (GHI) { await c.query('commit'); console.log('ĐÃ GHI') } else { await c.query('rollback'); console.log('Chạy thử — ROLLBACK (thêm --ghi)') }
} catch (e) { await c.query('rollback'); console.error('LỖI, ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
