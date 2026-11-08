// nhap.mjs — nhập tong-hop.json (trang='vao') vào kho: vai 'luyen' → kho VỀ NHÀ (dai_cau_hoi, da_duyet=false; dạng = ĐỀ XUẤT; Đ/S → kho Đ/S chủ đề NCD00186);
// vai 'giang' → kho TRÊN LỚP (dai_cau_lop qua fn_dai_lop_them).
//   node kho-rules/dai/lo/k11/sach-gioi-han/nhap.mjs luyen [--ghi]     (mặc định chạy khô: nhap_kho --thu → ROLLBACK)
//   node kho-rules/dai/lo/k11/sach-gioi-han/nhap.mjs giang [--ghi]     (mặc định ROLLBACK)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import pg from 'pg'
process.loadEnvFile('.env')
const D = 'kho-rules/dai/lo/k11/sach-gioi-han/'
const CHU_DE = 'NCD00186' // Giới hạn. Hàm số liên tục
const [CHE, ...co] = process.argv.slice(2)
const GHI = co.includes('--ghi')
const A = JSON.parse(readFileSync(D + 'tong-hop.json', 'utf8')).filter((q) => q.trang === 'vao')
const TEN = { pnl: 'PNL', tt: 'Từ Tâm', nbv: 'NBV' }
const nguon = (q) => `Sách ${q.sach} K11 chương Giới hạn — ${q.don_vi} (câu ${q.id})`
const ghiChu = (q) => [`Nguồn: ${nguon(q)}.`, q.ghi_chu].filter(Boolean).join(' ')
const dapAn = (q) => (q.loai_cau === 'tu_luan' || q.loai_cau === 'dung_sai' || !q.dap_an || q.dap_an === '—' ? null : q.dap_an)

if (CHE === 'luyen') {
  const L = A.filter((q) => q.vai === 'luyen').map((q) => ({
    khoi: '11', loai_cau: q.loai_cau, noi_dung: q.noi_dung, lua_chon: q.lua_chon ?? undefined, dap_an: dapAn(q), loi_giai: q.loi_giai,
    ...(q.loai_cau === 'dung_sai'
      ? { menh_de: q.menh_de.map((m) => ({ noi_dung: m.noi_dung, dap_an: m.dap_an, loi_giai: m.loi_giai ?? null })), chu_de: CHU_DE }
      : q.dang_bai ? { dang_bai: q.dang_bai, dang_bai_chac: q.dang_bai_chac, dang_bai_ly_do: q.dang_bai_ly_do ?? '' } : {}),
    ten_de_goc: `Sách ${q.sach} K11 — ${q.don_vi}`, nguon: 'le', nguon_giai: 'ai', ghi_chu_nhap: ghiChu(q),
  }))
  mkdirSync('.nhap-tam', { recursive: true })
  const kq = { ok: 0, trung: 0, loi: 0, ma: [], de_xuat: 0, chua_dang: 0, kho_ds: 0 }
  for (let i = 0; i < L.length; i += 50) {
    const f = `.nhap-tam/k11-gh-luyen-${i}.json`
    writeFileSync(f, JSON.stringify(L.slice(i, i + 50)))
    const a = ['scripts/nhap_kho.mjs', 'insert', '--subject', 'dai', '--json', f]; if (!GHI) a.push('--thu')
    const r = spawnSync('node', a, { encoding: 'utf8', maxBuffer: 1 << 26 })
    let j; try { j = JSON.parse(r.stdout) } catch { j = { ok: false, error: (r.stdout + r.stderr).slice(0, 500) } }
    if (!j.ok) { kq.loi++; console.error(`lô ${i}: ✘ ${j.error}`); if (GHI) break; continue }
    kq.ok += j.inserted ?? 0; kq.trung += (j.trung ?? []).length; kq.de_xuat += j.bdm?.de_xuat ?? 0; kq.chua_dang += (j.chua_dang ?? []).length; kq.kho_ds += j.bdm?.kho_ds ?? 0
    kq.ma.push(...(j.ma_cau_list ?? []))
    console.log(`lô ${i}: +${j.inserted} · trùng ${(j.trung ?? []).length} · đề xuất dạng ${j.bdm?.de_xuat ?? 0} · kho Đ/S ${j.bdm?.kho_ds ?? 0} · chưa dạng ${(j.chua_dang ?? []).length}`)
  }
  if (GHI) writeFileSync(D + 'luyen-ma-cau.json', JSON.stringify(kq.ma))
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ chạy khô (ROLLBACK)', JSON.stringify({ ...kq, ma: kq.ma.length }))
} else if (CHE === 'giang') {
  const G = A.filter((q) => q.vai === 'giang')
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
  try {
    await c.query('begin')
    const ma = []
    for (const q of G) {
      const cau = { noi_dung: q.noi_dung, loai_cau: q.loai_cau, lua_chon: q.lua_chon ?? null, dap_an: dapAn(q), loi_giai: q.loi_giai, ghi_chu: ghiChu(q), nguon: 'sach' }
      const r = (await c.query(`select ma_cau from fn_dai_lop_them($1,'giang',$2::jsonb)`, [q.dang_bai, JSON.stringify(cau)])).rows[0]
      ma.push(r.ma_cau)
    }
    console.log(`giang: ${ma.length} câu → dai_cau_lop`)
    if (GHI) { await c.query('commit'); writeFileSync(D + 'giang-ma-cau.json', JSON.stringify(ma)); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK') }
  } catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
} else { console.error('Dùng: nhap.mjs luyen|giang [--ghi]'); process.exit(2) }
