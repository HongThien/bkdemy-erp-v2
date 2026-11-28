// ============================================================================
// k5T-pt-fill-ghi.mjs — GHI lô fill 5T "Tỉ số phần trăm" (đích 30 câu / dạng, Thùy 28/11) vào kho Đại, đường tự duyệt §C13/§C11.
//
//   node scripts/kho/clone/k5T-pt-fill-ghi.mjs [A|B|C|all] [--ghi]
//
// Mỗi lô `kho-rules/dai/clone/k5T-pt-fill-<X>.json` qua BỘ KIỂM ĐỘC LẬP `k5T-pt-fill-<X>-kiem.mjs` (đọc lại đề từ chữ, tính lại bằng phân số)
// → cổng `cong-ghi.xetGoi` → `insertCauBatch` (lọc trùng đề với cả kho) → duyệt: da_duyet=true, duyet_nguon='ai', nguon='le', giai_method='claude_code'.
// Dạng gán CHỈ ĐỊNH (dang_bai_chot) — đúng dạng của lô. Không --ghi: chạy thử (ROLLBACK). Chạy lại an toàn (trùng đề thì bỏ qua).
// ============================================================================
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
import { xetGoi, bamNoiDung } from '../cong-ghi.mjs'
import { insertCauBatch } from '../../_kho_insert.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const env = Object.fromEntries(readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const chon = (args.find((x) => !x.startsWith('--')) ?? 'all').toUpperCase()
const LO = (chon === 'ALL' ? ['A', 'B', 'C'] : [chon])

const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
let ma = 0
try {
  await db.query('begin')
  const dem = {}, loai = []
  for (const x of LO) {
    const { kiemCau } = await import(`./k5T-pt-fill-${x}-kiem.mjs`)
    const lo = JSON.parse(readFileSync(join(root, `kho-rules/dai/clone/k5T-pt-fill-${x}.json`), 'utf8'))
    const qua = []
    for (const c of lo) {
      const l = kiemCau(c)
      if (l.length) { loai.push(`✘ [${x}] ${c.dang} ${c.noi_dung.slice(0, 70)} | ${l.join(' · ')}`); continue }
      const cau = { khoi: '5T', loai_cau: c.loai_cau ?? 'tra_loi_ngan', noi_dung: c.noi_dung, lua_chon: null, menh_de: null, dap_an: c.dap_an, loi_giai: c.loi_giai, anh_de: null, anh_dap_an: null, ma_cum: null, nguon_giai: 'ai' }
      const bam = bamNoiDung({ ...cau, dang_chinh: 'cho' })
      const mk = (tram, ghi) => ({ tram, lan_chay: 'k5T-pt-fill-kiem', cach: 'code', ket_qua: 'dat', ghi_chu: ghi, bam_noi_dung: bam })
      const kq = xetGoi({ cau: { ...cau, dang_chinh: 'cho' }, vet: { lam: { tram: 'giai', lan_chay: 'k5T-pt-fill-sinh', model: 'claude-sonnet-5-5 (bộ sinh bằng code)' }, kiem: [
        mk('kiem-doc', `bài lẻ soạn bù dạng ${c.dang}: khuôn hai phần, không nhãn "Câu N"`),
        mk('kiem-dang', `dạng ${c.dang} do điều phối chỉ định (§C11), mẫu ${c.mau ?? '?'}`),
        mk('kiem-dap-so', 'bộ kiểm độc lập đọc lại đề từ chữ, tính lại bằng phân số BigInt, kiểm số học từng dòng Phần 2, khớp đáp án')] } })
      if (!kq.duoc_ghi) { loai.push(`✘ [${x}] cổng ${c.dang}: ${kq.ly_do.join(' | ')}`); continue }
      qua.push({ c, cau, kq })
    }
    if (!qua.length) continue
    const cauList = qua.map(({ c, cau }) => ({ ...cau, nguon: 'le', giai_method: 'claude_code', ai_model: 'claude-sonnet-5-5', dang_bai: c.dang, dang_bai_chot: true, ten_de_goc: `Soạn bù ${c.dang} · fill 5T phần trăm 28/11` }))
    const { maCauList, trung } = await insertCauBatch({ client: db, subject: 'dai', cauList })
    const laTrung = new Set(trung.map((t) => t.idx))
    for (let i = 0; i < qua.length; i++) {
      if (laTrung.has(i)) { loai.push(`≈ trùng đề: ${qua[i].c.dang} ↔ ${maCauList[i]}`); continue }
      const { c, kq } = qua[i]
      await db.query(`update dai_cau_hoi set kiem_may = $2, kiem_may_at = now(), kiem_may_boi = 'claude_code', kiem_may_ghi = $3, da_duyet = true, duyet_nguon = 'ai', duyet_at = now() where ma_cau = $1`,
        [maCauList[i], kq.kiem_may, kq.kiem_may_ghi.slice(0, 1500)])
      dem[c.dang] = (dem[c.dang] || 0) + 1
    }
  }
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', '· ghi mới', Object.values(dem).reduce((a, b) => a + b, 0))
  console.table(dem)
  for (const l of loai.slice(0, 40)) console.log(' ', l)
  if (loai.length > 40) console.log(`  … và ${loai.length - 40} dòng nữa`)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { ma = 1; await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message) } finally { await db.end() }
process.exit(ma)
