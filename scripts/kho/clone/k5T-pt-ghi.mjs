// ============================================================================
// k5T-pt-ghi.mjs — GHI lô clone phần trăm 5T (k5T-pt-sinh.mjs) vào kho Đại, bản đồ MỚI.
//
//   node scripts/kho/clone/k5T-pt-ghi.mjs <lo.json> [--ghi]
//
// Mỗi câu: dang_chinh = dạng chờ 5T (đúng luật bản đồ mới), nguon 'clone' · clone_method 'may_sinh_theo_mau' · giai_method 'claude_code',
// DẠNG BÀI (NDB…) vào `dai_bdm_de_xuat` (nguon 'ai', chắc 'cao') — KHÔNG tự gán, KHÔNG tự duyệt: Thùy xem rồi mới duyệt (clone là nội dung MỚI).
// Cổng trước khi ghi: k5T-pt-kiem.mjs (đáp số tính lại từ chữ của đề · số học từng dòng Phần 2 · Phần 1 card 3–6 bước); 1 câu hỏng ⇒ KHÔNG ghi cả lô.
// Chống nhân đôi: insertCauBatch lọc trùng đề (chuẩn hoá) với cả kho ⇒ chạy lại an toàn. Không --ghi: chạy thử (ROLLBACK).
// ============================================================================
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { insertCauBatch, maDangCho } from '../../_kho_insert.mjs'
import { kiemCau } from './k5T-pt-kiem.mjs'

const a = process.argv.slice(2), GHI = a.includes('--ghi'), tep = a.find((x) => !x.startsWith('--'))
if (!tep) { console.error('Dùng: node scripts/kho/clone/k5T-pt-ghi.mjs <lo.json> [--ghi]'); process.exit(2) }
const lo = JSON.parse(readFileSync(tep, 'utf8'))
const hong = lo.map((c) => ({ c, l: kiemCau(c) })).filter((x) => x.l.length)
if (hong.length) { console.error(`✘ ${hong.length}/${lo.length} câu không qua bộ kiểm — KHÔNG ghi lô`); for (const h of hong.slice(0, 10)) console.error('  ', h.c.noi_dung.slice(0, 70), '|', h.l.join(' · ')); process.exit(1) }

const env = Object.fromEntries(readFileSync(new URL('../../../.env', import.meta.url), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
let ma = 0
try {
  await db.query('begin')
  const CHO = maDangCho('dai', '5T')
  const cauList = lo.map((c) => ({
    khoi: '5T', dang_chinh: CHO, loai_cau: c.loai_cau, noi_dung: c.noi_dung, dap_an: c.dap_an, loi_giai: c.loi_giai,
    nguon: 'clone', nguon_giai: 'ai', giai_method: 'claude_code', ai_model: 'claude-sonnet-5-5',
    ten_de_goc: `Clone 5T phần trăm · ${c.mau}`,
    dang_bai: c.dang, dang_bai_chac: 'cao', dang_bai_ly_do: `Câu sinh theo mẫu ${c.mau} của đúng dạng này (đề xuất do máy sinh, chờ người duyệt)`,
  }))
  const kq = await insertCauBatch({ client: db, subject: 'dai', cauList })
  const moi = kq.maCauList.filter((m, i) => !kq.trung.some((t) => t.idx === i))
  const ghi = `clone-sinh=dat/code (k5T-pt-sinh.mjs, mẫu theo tham số đẹp) · kiem-dap-so=dat/code (k5T-pt-kiem.mjs: đọc chữ của đề, tính lại bằng phân số; kiểm số học từng dòng Phần 2; Phần 1 card 3–6 bước)`
  await db.query(`update dai_cau_hoi set nguon_loai = 'tai_lieu', clone_method = 'may_sinh_theo_mau', kiem_may = 'khop', kiem_may_boi = 'claude_code', kiem_may_at = now(), kiem_may_ghi = $2
                   where ma_cau = any($1) and xoa_at is null and not da_duyet`, [moi, ghi])
  const { rows } = await db.query(`select x.dang_bai_id, d.ten, count(*) n from dai_bdm_de_xuat x join dai_bdm_dang_bai d on d.id = x.dang_bai_id where x.ma_cau = any($1) group by 1, 2 order by 1`, [moi])
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', `· qua bộ kiểm ${lo.length} · chèn mới ${moi.length} · trùng đề đã có ${kq.trung.length} · đề xuất dạng ${kq.bdm.de_xuat}`)
  for (const r of rows) console.log(`   ${String(r.n).padStart(3)} câu → ${r.dang_bai_id}  ${r.ten}`)
  if (kq.trung.length) console.log('  TRÙNG:', kq.trung.slice(0, 5).map((t) => `#${t.idx}→${t.ma_cau_cu}`).join(' '))
  console.log('  mã câu:', moi[0], '…', moi[moi.length - 1])
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { ma = 1; await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message) } finally { await db.end() }
process.exit(ma)
