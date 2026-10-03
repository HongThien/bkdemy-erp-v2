// ============================================================================
// giai_cong.mjs — CỔNG ghi kết quả "AI giải mù + lời giải" kho Tiếng Anh (Thùy 03/10: OK cả 4 bước + luật mới bước 2).
// Đầu vào (thư mục của giai_chuan_bi.mjs): <thư mục>_khoa/khoa.json · giai_a/lo-NNN.json (bên A, mọi câu) · giai_b/lo-NNN.json (bên B, chỉ câu thiếu đáp án).
// Người làm ≠ người kiểm: bên giải KHÔNG thấy đáp án; cổng (máy) so.
//   ① Câu ĐÃ có đáp án: A ra ĐÚNG đáp án + "chac" + không phương án 2 ⇒ ghi lời giải. Lệch ⇒ KHÔNG ghi, vào biên bản "lech" (nghi đáp án cũ — báo GV).
//   ② Câu THIẾU đáp án: A và B độc lập cùng "chac", cùng đáp án, không phương án 2, không đề lỗi ⇒ ghi đáp án + lời giải.
//      Tự DUYỆT chỉ khi lý do chờ DUY NHẤT là "file GV không có đáp án" (luật mới, Thùy 03/10). Còn lý do khác (phạm vi, cấu trúc, điểm) ⇒ giữ chờ GV.
//   Không bao giờ đè lời giải đã có (người viết). Ghi vết: trigger kho_sua_log (nguon 'may').
// MẶC ĐỊNH CHẠY THỬ (rollback). --ghi để commit. Chạy: node scripts/anh/giai_cong.mjs <thư mục> --model <tên model> [--ghi]
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
process.loadEnvFile('.env')
const dir = process.argv[2]; const GHI = process.argv.includes('--ghi')
const MODEL = process.argv[process.argv.indexOf('--model') + 1]
if (!MODEL || MODEL.startsWith('--')) throw new Error('thiếu --model')
const khoa = JSON.parse(fs.readFileSync(`${dir}_khoa/khoa.json`, 'utf8'))   // đáp án để thư mục ANH EM, ngoài tầm bên giải
const doc = (sub) => { const m = new Map(); const d = path.join(dir, sub); if (!fs.existsSync(d)) return m
  for (const f of fs.readdirSync(d).filter((f) => /^lo-\d+\.json$/.test(f))) for (const g of JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'))) { if (m.has(g.ma)) throw new Error(`${sub}: ${g.ma} lặp`); m.set(g.ma, g) }
  return m }
const A = doc('giai_a'); const B = doc('giai_b')
const CHU = new Set(['A', 'B', 'C', 'D'])
const sach = (g) => g && CHU.has(g.dap_an) && g.chac === 'chac' && !g.pa_thu_hai && typeof g.loi_giai === 'string' && g.loi_giai.trim().length > 20
const LY_DO_CHI_THIEU_DA = /^(Kiểm lại 02\/10 \([^)]*\): )?cấu trúc: khong_co_dap_an · file GV không có đáp án$/

const ghiLg = []; const ghiDa = []; const bb = { lech: [], a_khong_chac: [], chua_giai: [], thieu_khong_dong_y: [], de_loi: [] }
for (const [ma, k] of Object.entries(khoa)) {
  const a = A.get(ma)
  if (!a) { bb.chua_giai.push(ma); continue }
  if (a.de_loi) bb.de_loi.push({ ma, da_duyet: k.da_duyet, de_loi: a.de_loi })   // danh sách cho GV dọn đề (không chặn ghi lời giải nếu đáp án vẫn khớp)
  if (k.dap_an) {
    if (!sach(a)) { bb.a_khong_chac.push({ ma, khoa: k.dap_an, a: a.dap_an, chac: a.chac, pa2: a.pa_thu_hai, de_loi: a.de_loi }); continue }
    if (a.dap_an !== k.dap_an) { bb.lech.push({ ma, khoa: k.dap_an, a: a.dap_an, da_duyet: k.da_duyet, duyet_nguon: k.duyet_nguon, de_loi: a.de_loi, loi_giai_a: a.loi_giai }); continue }
    ghiLg.push({ ma, lg: a.loi_giai.trim(), da: a.dap_an })
  } else {
    const b = B.get(ma)
    if (!sach(a) || !sach(b) || a.dap_an !== b.dap_an || a.de_loi || b.de_loi) { bb.thieu_khong_dong_y.push({ ma, a: a.dap_an, b: b?.dap_an ?? null, a_chac: a.chac, b_chac: b?.chac, de_loi: a.de_loi || b?.de_loi }); continue }
    ghiDa.push({ ma, lg: a.loi_giai.trim(), da: a.dap_an, duyet: LY_DO_CHI_THIEU_DA.test(k.kiem_may_ghi ?? '') && !k.da_duyet })
  }
}

const db = new pg.Client({ connectionString: process.env.DATABASE_URL }); await db.connect()
await db.query('begin')
try {
  const r1 = await db.query(`update anh_cau_hoi c set loi_giai = v.lg, loi_giai_ai = v.lg, dap_an_ai = v.da, nguon_giai = 'ai', giai_method = 'ai_giai_mu', ai_model = $3, ai_de_xuat_at = now()
    from unnest($1::text[], $2::text[], $4::text[]) v(ma, lg, da) where c.ma_cau = v.ma and coalesce(c.loi_giai, '') = '' and c.dap_an = v.da and c.xoa_at is null`,
    [ghiLg.map((x) => x.ma), ghiLg.map((x) => x.lg), MODEL, ghiLg.map((x) => x.da)])
  const r2 = await db.query(`update anh_cau_hoi c set dap_an = v.da, dap_an_ai = v.da, loi_giai = v.lg, loi_giai_ai = v.lg, nguon_giai = 'ai', giai_method = 'ai_giai_mu', ai_model = $4, ai_de_xuat_at = now(),
      da_duyet = c.da_duyet or v.duyet, duyet_nguon = case when v.duyet and not c.da_duyet then 'ai' else c.duyet_nguon end,
      kiem_may = case when v.duyet then 'khop' else c.kiem_may end, kiem_may_boi = case when v.duyet then 'claude_code' else c.kiem_may_boi end,
      kiem_may_ghi = c.kiem_may_ghi || ' · 03/10: 2 bên giải mù độc lập cùng đáp án ' || v.da || case when v.duyet then ' ⇒ tự duyệt (luật Thùy 03/10)' else ' — còn lý do khác, chờ GV' end
    from unnest($1::text[], $2::text[], $3::text[], $5::boolean[]) v(ma, da, lg, duyet)
    where c.ma_cau = v.ma and coalesce(c.dap_an, '') = '' and c.xoa_at is null`,
    [ghiDa.map((x) => x.ma), ghiDa.map((x) => x.da), ghiDa.map((x) => x.lg), MODEL, ghiDa.map((x) => x.duyet)])
  const kq = (await db.query(`select count(*) filter (where coalesce(loi_giai,'') <> '')::int co_lg, count(*) filter (where da_duyet)::int duyet, count(*) filter (where coalesce(dap_an,'') = '')::int thieu_da
    from anh_cau_hoi where xoa_at is null`)).rows[0]
  console.log(`A: ${A.size} câu · B: ${B.size} câu · khoá: ${Object.keys(khoa).length}`)
  console.log(`① ghi lời giải ${r1.rowCount}/${ghiLg.length} · lệch đáp án ${bb.lech.length} (trong đó đã duyệt ${bb.lech.filter((x) => x.da_duyet).length}) · A chưa chắc ${bb.a_khong_chac.length} · chưa giải ${bb.chua_giai.length}`)
  console.log(`   bên A báo lỗi đề ${bb.de_loi.length} câu (đã duyệt ${bb.de_loi.filter((x) => x.da_duyet).length}) — danh sách cho GV`)
  console.log(`② thiếu đáp án: ghi ${r2.rowCount}/${ghiDa.length} (tự duyệt ${ghiDa.filter((x) => x.duyet).length}) · A/B không đồng ý ${bb.thieu_khong_dong_y.length}`)
  console.log(`DB sau: có lời giải ${kq.co_lg} · đã duyệt ${kq.duyet} · thiếu đáp án ${kq.thieu_da}`)
  fs.writeFileSync(path.join(dir, 'bien_ban_cong.json'), JSON.stringify(bb, null, 1))
  if (!GHI) { await db.query('rollback'); console.log('CHẠY THỬ — rollback. Biên bản: bien_ban_cong.json') }
  else { await db.query('commit'); console.log('ĐÃ GHI · commit.') }
} catch (e) { await db.query('rollback'); throw e } finally { await db.end() }
