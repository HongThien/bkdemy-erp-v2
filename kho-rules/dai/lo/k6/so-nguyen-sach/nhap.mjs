// nhap.mjs — nhập tong-hop.json (trang='vao') vào kho: vai 'luyen' → kho VỀ NHÀ (dai_cau_hoi, da_duyet=false, dạng = ĐỀ XUẤT); vai 'giang' → kho TRÊN LỚP (dai_cau_lop qua fn_dai_lop_them).
//   node kho-rules/dai/lo/k6/so-nguyen-sach/nhap.mjs luyen [--ghi]     (mặc định chạy khô: nhap_kho --thu)
//   node kho-rules/dai/lo/k6/so-nguyen-sach/nhap.mjs giang [--ghi]     (mặc định ROLLBACK)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import pg from 'pg'
process.loadEnvFile('.env')
const D = 'kho-rules/dai/lo/k6/so-nguyen-sach/'
const [CHE, ...cờ] = process.argv.slice(2)
const GHI = cờ.includes('--ghi')
const A = JSON.parse(readFileSync(D + 'tong-hop.json', 'utf8')).filter((q) => q.trang === 'vao')
const lc = (arr) => arr?.map((o) => { let t = String(o).replace(/^[A-D]\.\s*/, '').trim().replace(/\.$/, ''); if (!t.includes('$')) t = /^[-+\d\s.,;:()\{}a-z^/=<>]+$/i.test(t) && !/[À-ỹ]{2}/.test(t) ? `$${t}$` : t; return t + '.' })
const ghiChu = (q) => [`Nguồn: sách Củng cố Toán 6 tập 1, Chương III — ${q.sach} (câu ${q.id}).`, q.ghi_chu].filter(Boolean).join(' ')
const dapAn = (q) => (q.loai_cau === 'tu_luan' || !q.dap_an || q.dap_an === '—' ? null : q.dap_an)

if (CHE === 'luyen') {
  const L = A.filter((q) => q.vai === 'luyen').map((q) => ({
    khoi: '6', loai_cau: q.loai_cau, noi_dung: q.noi_dung, lua_chon: lc(q.lua_chon) ?? undefined, dap_an: dapAn(q), loi_giai: q.loi_giai,
    ...(q.dang_bai ? { dang_bai: q.dang_bai, dang_bai_chac: q.dang_bai_chac, dang_bai_ly_do: q.dang_bai_ly_do ?? '' } : {}),
    ten_de_goc: `Củng cố Toán 6 T1 Ch.III — ${q.sach}`, nguon: 'le', nguon_giai: 'ai', ghi_chu_nhap: ghiChu(q),
  }))
  mkdirSync('.nhap-tam', { recursive: true })
  const kq = { ok: 0, trung: 0, loi: 0, ma: [], de_xuat: 0, chua_dang: 0 }
  for (let i = 0; i < L.length; i += 50) {
    const f = `.nhap-tam/so-nguyen-luyen-${i}.json`
    writeFileSync(f, JSON.stringify(L.slice(i, i + 50)))
    const a = ['scripts/nhap_kho.mjs', 'insert', '--subject', 'dai', '--json', f]; if (!GHI) a.push('--thu')
    const r = spawnSync('node', a, { encoding: 'utf8' })
    let j; try { j = JSON.parse(r.stdout) } catch { j = { ok: false, error: (r.stdout + r.stderr).slice(0, 400) } }
    if (!j.ok) { kq.loi++; console.error(`lô ${i}: ✘ ${j.error}`); if (GHI) break; continue }
    kq.ok += j.inserted ?? 0; kq.trung += (j.trung ?? []).length; kq.de_xuat += j.bdm?.de_xuat ?? 0; kq.chua_dang += (j.chua_dang ?? []).length
    kq.ma.push(...(j.ma_cau_list ?? []))
    console.log(`lô ${i}: +${j.inserted} · trùng ${(j.trung ?? []).length} · đề xuất dạng ${j.bdm?.de_xuat ?? 0} · chưa dạng ${(j.chua_dang ?? []).length}`)
  }
  if (GHI) writeFileSync(D + 'luyen-ma-cau.json', JSON.stringify(kq.ma))
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ chạy khô (ROLLBACK)', JSON.stringify({ ...kq, ma: kq.ma.length }))
} else if (CHE === 'giang') {
  const G = A.filter((q) => q.vai === 'giang')
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
  try {
    await c.query('begin')
    let n = 0
    const ma = []
    for (const q of G) {
      const cau = { noi_dung: q.noi_dung, loai_cau: q.loai_cau, lua_chon: lc(q.lua_chon), dap_an: dapAn(q), loi_giai: q.loi_giai, ghi_chu: ghiChu(q), nguon: 'sach' }
      const r = (await c.query(`select ma_cau from fn_dai_lop_them($1,'giang',$2::jsonb)`, [q.dang_bai, JSON.stringify(cau)])).rows[0]
      ma.push(r.ma_cau); n++
    }
    console.log(`giang: ${n} câu → dai_cau_lop`)
    if (GHI) { await c.query('commit'); writeFileSync(D + 'giang-ma-cau.json', JSON.stringify(ma)); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK') }
  } catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
} else { console.error('Dùng: nhap.mjs luyen|giang [--ghi]'); process.exit(2) }
