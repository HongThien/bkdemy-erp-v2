// ============================================================================
// k4T-ghi.mjs — GHI lô clone (k4T-sinh.mjs) vào HÀNG CHỜ DUYỆT `dai_cau_hoi_clone_cho_duyet` (KHÔNG ghi thẳng dai_cau_hoi).
//
//   node scripts/kho/clone/k4T-ghi.mjs <lo.json> [--ghi]
//
// Người duyệt ở ERP › Bản đồ kiến thức › Đại › "Câu chờ duyệt" mới đưa câu vào kho (duyetCloneChoDuyet: da_duyet=true,
// nguon='clone'). Câu trả lời ngắn muốn lên app HS còn cần bản trắc nghiệm (mcq-auto.mjs) SAU khi câu được duyệt
// (spec-mcq-form.md §9: clone được duyệt trước → mới sinh form).
// Cổng trước khi ghi (mọi câu, không đạt 1 câu ⇒ KHÔNG ghi cả lô): k4T-kiem.mjs — đáp số tính lại độc lập + hình thức.
// Chống nhân đôi: câu trùng đề (sau chuẩn hoá) với kho hoặc với hàng chờ (chưa bị từ chối) thì bỏ qua ⇒ chạy lại an toàn.
// Không --ghi: chạy thử (chèn trong transaction rồi ROLLBACK).
// ============================================================================
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { kiemCau } from './k4T-kiem.mjs'
import { chuanDe } from './k4T-sinh.mjs'

const CLONE_METHOD = 'may_sinh_theo_mau'
const a = process.argv.slice(2), GHI = a.includes('--ghi')
if (!a[0]) { console.error('Dùng: node scripts/kho/clone/k4T-ghi.mjs <lo.json> [--ghi]'); process.exit(2) }
const lo = JSON.parse(readFileSync(a[0], 'utf8'))

const hong = lo.map((c) => ({ c, l: kiemCau(c) })).filter((x) => x.l.length)
if (hong.length) { console.error(`✘ ${hong.length}/${lo.length} câu không qua bộ kiểm — KHÔNG ghi lô:`); for (const h of hong.slice(0, 20)) console.error('  ', h.c.dang, '|', h.c.noi_dung.slice(0, 70), '|', h.l.join(' · ')); process.exit(1) }

const env = Object.fromEntries(readFileSync(new URL('../../../.env', import.meta.url), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await db.connect()
try {
  await db.query('begin')
  const dangs = [...new Set(lo.map((c) => c.dang))]
  const { rows: kho } = await db.query(`select dang_chinh, noi_dung from dai_cau_hoi where dang_chinh = any($1) and xoa_at is null`, [dangs])
  const { rows: cho } = await db.query(`select dang_chinh, noi_dung from dai_cau_hoi_clone_cho_duyet where dang_chinh = any($1) and tu_choi_at is null`, [dangs])
  const { rows: goc } = await db.query(`select ma_cau, dang_chinh, anh_de from dai_cau_hoi where ma_cau = any($1) and xoa_at is null`, [[...new Set(lo.map((c) => c.parent))]])
  const gocMap = new Map(goc.map((g) => [g.ma_cau, g]))
  const daCo = new Set([...kho, ...cho].map((r) => `${r.dang_chinh}|${chuanDe(r.noi_dung)}`))
  const dem = {}; let trung = 0
  for (const c of lo) {
    const g = gocMap.get(c.parent)
    if (!g) throw new Error(`câu gốc ${c.parent} không còn trong kho`)
    if (g.dang_chinh !== c.dang) throw new Error(`câu gốc ${c.parent} thuộc dạng ${g.dang_chinh}, lô ghi ${c.dang}`)
    if (g.anh_de) throw new Error(`câu gốc ${c.parent} có hình — không clone đổi số (spec-clone-ai.md §2)`)
    const k = `${c.dang}|${chuanDe(c.noi_dung)}`
    if (daCo.has(k)) { trung++; continue }
    daCo.add(k)
    await db.query(`insert into dai_cau_hoi_clone_cho_duyet (dang_chinh, loai_cau, noi_dung, lua_chon, dap_an, loi_giai, parent_ma_cau, clone_method) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [c.dang, c.loai_cau, c.noi_dung, c.lua_chon ? JSON.stringify(c.lua_chon) : null, c.dap_an, c.loi_giai, c.parent, CLONE_METHOD])
    dem[c.dang] = (dem[c.dang] || 0) + 1
  }
  const tong = Object.values(dem).reduce((s, x) => s + x, 0)
  const { rows: [{ n }] } = await db.query(`select count(*)::int n from dai_cau_hoi_clone_cho_duyet where tu_choi_at is null`)
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', `· qua bộ kiểm ${lo.length} · chèn mới ${tong} · trùng đề đã có ${trung} · hàng chờ duyệt sau lượt này: ${n}`)
  console.table(dem)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { await db.query('rollback'); throw e } finally { await db.end() }
