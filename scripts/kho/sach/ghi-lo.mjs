// ============================================================================
// ghi-lo.mjs — GHI một lô câu đã giải (lo-tu-md.mjs) vào kho Đại QUA CỔNG GHI (kho-rules/README.md §4 việc #3).
//
//   node scripts/kho/sach/ghi-lo.mjs <lo.json> --sach "Toán arc 4 Q1" --kiem <k4T-kiem.mjs> --so-do <thư mục so-do>
//        [--kiem-ngoai <bien-ban-model-khac.json>] [--chua-gan-dang] [--model-lam <model soạn>] [--lan-lam "<mô tả lượt làm>"] [--ghi]
//   --model-lam: model THẬT đã soạn lời giải (ghi vào ai_model + vết trạm làm) — mặc định claude-opus-5-5. Đo chất lượng theo cách soạn cần cột này đúng.
//
// --chua-gan-dang (CEO 08/10: "giải trước, up lên DB ở trạng thái chưa gán dạng … gán dạng là việc độc lập, chạy sau khi bản đồ
//   hoàn thiện"): mọi câu vào DẠNG CHỜ của khối (…000000), kể cả câu lô thử đã có dạng đề xuất — dạng đề xuất chỉ nằm trong lô JSON
//   ở repo, KHÔNG ghi DB (dang_ai_de_xuat = dạng chờ như insertCauBatch), để lượt gán dạng sau chạy độc lập. Không cần trạm kiem-dang.
//   Hệ quả DB: câu dạng chờ chưa bấm duyệt được (_kho_la_dang_cho) — duyệt lời giải sau khi gán dạng.
//
// Không --ghi: CHẠY THỬ — xét cổng, chèn trong 1 transaction rồi ROLLBACK, sơ đồ không upload. --ghi: upload SVG + COMMIT.
//
// Biên bản mỗi câu (cổng tự quyết câu nào cần trạm nào — cong-ghi.mjs tramBatBuoc):
//   kiem-doc      code        đề sắp ghi so với đề tách từ sách (tach-bai.mjs) sau chuẩn hoá định dạng — sai 1 chữ là lộ
//   kiem-dap-so   code        bộ kiểm riêng của khối (--kiem): máy TỰ TÍNH LẠI đáp số từ đề, đối chiếu dap_an
//   kiem-dang     model_khac  model KHÁC gán dạng MÙ (không thấy dạng đã chọn) — từ --kiem-ngoai; thiếu ⇒ cổng từ chối câu đó
//   kiem-hinh-a   code        máy vẽ sơ đồ tự kiểm nhãn tổng/hiệu khớp các hàng (so-do-doan-thang.mjs) — sai thì không vẽ
//   kiem-hinh-b   model_khac  model KHÁC nhìn ảnh sơ đồ + đề, xác nhận sơ đồ đúng bài — từ --kiem-ngoai
// kiem_may do CỔNG suy từ biên bản (một trạm không đạt ⇒ 'nghi'). da_duyet luôn false — người duyệt ở màn Duyệt.
// Danh tính: ten_de_goc = "<sách> · <mã bài>" ⇒ chạy lại không nhân đôi (câu đã có thì bỏ qua). Câu trùng nội dung với kho
// (insertCauBatch lọc) ⇒ không chèn, liệt kê.
// Câu có ảnh trong sách (EMF chưa đổi được) ⇒ KHÔNG ghi, liệt kê (thà thiếu còn hơn câu mất hình — như ghi-tsa.mjs).
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { xetGoi, bamNoiDung } from '../cong-ghi.mjs'
import { veSoDo } from '../so-do-doan-thang.mjs'
import { insertCauBatch, maDangCho } from '../../_kho_insert.mjs'

const GOC_REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const a = process.argv.slice(2)
const lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const GHI = a.includes('--ghi')
const CHUA_GAN = a.includes('--chua-gan-dang')
const MODEL_LAM = lay('--model-lam') ?? 'claude-opus-5-5'
const loTep = a[0], SACH = lay('--sach'), kiemTep = lay('--kiem'), soDoDir = lay('--so-do'), ngoaiTep = lay('--kiem-ngoai')
if (!loTep || !SACH || !kiemTep || !soDoDir) { console.error('Dùng: node scripts/kho/sach/ghi-lo.mjs <lo.json> --sach "<tên>" --kiem <kiem.mjs> --so-do <dir> [--kiem-ngoai <json>] [--ghi]'); process.exit(2) }

const docEnv = (f) => existsSync(f) ? Object.fromEntries(readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')])) : {}
const env = docEnv(join(GOC_REPO, '.env')), envLocal = docEnv(join(GOC_REPO, '.env.local'))
const { kiemDapSo } = await import(pathToFileURL(resolve(kiemTep)).href)
const lo = JSON.parse(readFileSync(loTep, 'utf8'))
const ngoai = ngoaiTep ? JSON.parse(readFileSync(ngoaiTep, 'utf8')) : null   // { model, lan_chay, cau: { "<ma>": { dang, ly_do, hinh_dung?, hinh_ghi? } } }

// ── chuẩn hoá để so đề với sách (chỉ định dạng — chữ và số phải giữ nguyên) ─────────────
const chuanDe = (s) => String(s).normalize('NFC').replace(/\\ /g, '')   // dấu cách LaTeX "\ " (sách gõ \overline{17a8\ b}) — chỉ định dạng
  .replace(/\\d?frac/g, '\\frac').replace(/\\text\{\s*([^}]*)\}/g, '$1').replace(/\\left|\\right/g, '')
  .replace(/\$|\s+|…|\.{3,}|\{|\}/g, '').toLowerCase()
function kiemDoc(c) {
  const de = chuanDe(c.noi_dung), sach = chuanDe(c.noi_dung_sach)
  if (de === sach) return { ket_qua: 'dat', ghi_chu: 'đề trùng nguyên văn bài trong sách (sau chuẩn hoá định dạng)' }
  const than = chuanDe(c.noi_dung.replace(/^Tính:\s*/, ''))
  if (/[A-F]$/.test(c.ma_nguon) && sach.includes(than)) return { ket_qua: 'dat', ghi_chu: `biểu thức ${c.ma_nguon.slice(-1)} nằm nguyên trong bài gốc` }
  return { ket_qua: 'khong_dat', ghi_chu: 'đề LỆCH với bài trong sách' }
}

// ── sơ đồ: vẽ (máy tự kiểm) + upload ────────────────────────────────────────
let sb = null
const storage = () => {
  if (!sb) {
    if (!envLocal.VITE_SUPABASE_URL || !envLocal.SUPABASE_SERVICE_ROLE) throw new Error('thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local')
    sb = createClient(envLocal.VITE_SUPABASE_URL, envLocal.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
  }
  return sb
}
const thang = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` })()
async function soDo(c) {
  if (!c.so_do) return { url: null, kiemA: null }
  let svg, kiemA
  try { svg = veSoDo(JSON.parse(readFileSync(join(soDoDir, c.so_do), 'utf8'))); kiemA = { ket_qua: 'dat', ghi_chu: `máy vẽ ${c.so_do}: nhãn tổng/hiệu khớp các hàng, đúng tỉ lệ` } }
  catch (e) { return { url: null, kiemA: { ket_qua: 'khong_dat', ghi_chu: `máy vẽ từ chối ${c.so_do}: ${e.message}` }, loi: e.message } }
  const path = `sach/${thang}/${randomUUID()}_${c.ma_nguon.replace(/\W+/g, '-')}.svg`
  if (!GHI) return { url: `dry://kho-anh/${path}`, kiemA }
  const { error } = await storage().storage.from('kho-anh').upload(path, Buffer.from(svg), { contentType: 'image/svg+xml', upsert: false })
  if (error) throw new Error(`upload ${path}: ${error.message}`)
  return { url: storage().storage.from('kho-anh').getPublicUrl(path).data.publicUrl, kiemA }
}

// ── dựng gói + xét cổng ──────────────────────────────────────────────────────
const LAN_LAM = lay('--lan-lam') ?? 'giai:lo-giai-thu-4T (Claude Code, lời giải CEO duyệt trong chat 07–08/10)'
const LAN_KIEM_CODE = `kiem-code:${new Date().toISOString().slice(0, 16)}`
const giu = [], tuChoi = [], boQua = []
for (const c of lo) {
  if (c.anh_sach?.length) { boQua.push({ c, ly_do: `bài có hình trong sách (${c.anh_sach.join(', ')}) — chưa đổi EMF, chưa cắt ảnh đề` }); continue }
  const { url, kiemA, loi } = await soDo(c)
  if (loi) { tuChoi.push({ c, ly_do: [`sơ đồ: ${loi}`] }); continue }
  const cau = {
    dang_chinh: CHUA_GAN ? maDangCho('dai', c.khoi) : c.dang_chinh, loai_cau: c.loai_cau, noi_dung: c.noi_dung, lua_chon: null, menh_de: null,
    dap_an: c.dap_an, loi_giai: c.loi_giai, anh_de: null, anh_dap_an: url, ma_cum: null,
    nguon_giai: 'ai', hinh_do_may_ve: !!c.so_do,
  }
  const bam = bamNoiDung(cau)
  const kiem = []
  const bb = (tram, cach, kq, lan, model) => kiem.push({ tram, lan_chay: lan, cach, ...(model ? { model } : {}), ket_qua: kq.ket_qua, ghi_chu: kq.ghi_chu, bam_noi_dung: bam })
  bb('kiem-doc', 'code', kiemDoc(c), LAN_KIEM_CODE)
  bb('kiem-dap-so', 'code', kiemDapSo(c.ma_nguon, c.dap_an), LAN_KIEM_CODE)
  if (kiemA) bb('kiem-hinh-a', 'code', kiemA, LAN_KIEM_CODE)
  const n = ngoai?.cau?.[c.ma_nguon]
  if (n && !/000000$/.test(cau.dang_chinh)) bb('kiem-dang', 'model_khac', n.dang === c.dang_chinh
    ? { ket_qua: 'dat', ghi_chu: `model khác gán mù ra cùng dạng (${n.dang})` }
    : { ket_qua: 'khong_dat', ghi_chu: `model khác gán mù ra ${n.dang}: ${String(n.ly_do ?? '').slice(0, 160)}` }, ngoai.lan_chay, ngoai.model)
  if (n && c.so_do && n.hinh_dung != null) bb('kiem-hinh-b', 'model_khac', n.hinh_dung
    ? { ket_qua: 'dat', ghi_chu: `model khác xem ảnh sơ đồ: khớp đề${n.hinh_ghi ? ' — ' + n.hinh_ghi : ''}` }
    : { ket_qua: 'khong_dat', ghi_chu: `model khác xem ảnh sơ đồ: ${n.hinh_ghi ?? 'không khớp'}` }, ngoai.lan_chay, ngoai.model)
  const kq = xetGoi({ cau, vet: { lam: { tram: 'giai', lan_chay: LAN_LAM, model: MODEL_LAM }, kiem } })
  if (!kq.duoc_ghi) { tuChoi.push({ c, ly_do: kq.ly_do }); continue }
  giu.push({ c, cau, kq })
}

// ── chèn ─────────────────────────────────────────────────────────────────────
const db = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
const theoKiem = {}, daCo = [], trungKho = []
try {
  await db.query('begin')
  const { rows: co } = await db.query(`select ten_de_goc, ma_cau from dai_cau_hoi where xoa_at is null and ten_de_goc like $1`, [`${SACH} · %`])
  const coMap = new Map(co.map((r) => [r.ten_de_goc, r.ma_cau]))
  // GẦN TRÙNG câu kho nguồn khác cùng khối (cùng bài, khác cách gõ: "5 và 9" ↔ "$5$ và $9$", "17a8\ b" ↔ "17a8b") — insertCauBatch chỉ bắt
  // trùng nguyên văn nên lọt (đo 08/10: 8 câu CĐ10 lọt/sắp lọt). So bằng khoá chuanDe (bỏ $, ngoặc, khoảng trắng, \text…) ⇒ không chèn, liệt kê.
  const tienTo = [...new Set(giu.map(({ c }) => maDangCho('dai', c.khoi).slice(0, 4)))]
  const { rows: khoKhac } = await db.query(`select ma_cau, noi_dung from dai_cau_hoi where xoa_at is null and lua_chon is null and menh_de is null
     and left(dang_chinh, 4) = any($1::text[]) and coalesce(ten_de_goc, '') not like $2`, [tienTo, `${SACH} · %`])
  const ganTrung = new Map(khoKhac.map((r) => [chuanDe(r.noi_dung), r.ma_cau]))
  const moi = giu.filter(({ c }) => {
    const k = `${SACH} · ${c.ma_nguon}`
    if (coMap.has(k)) { daCo.push(`${c.ma_nguon} (${coMap.get(k)})`); return false }
    const g = ganTrung.get(chuanDe(c.noi_dung)); if (g) { trungKho.push(`${c.ma_nguon} ≈ ${g}`); return false }
    return true
  })
  if (moi.length) {
    const cauList = moi.map(({ c, cau }) => ({ ...cau, khoi: c.khoi, nguon: 'le', giai_method: 'claude_code', ai_model: MODEL_LAM, ten_de_goc: `${SACH} · ${c.ma_nguon}` }))
    const { maCauList, trung } = await insertCauBatch({ client: db, subject: 'dai', cauList })
    const laTrung = new Set(trung.map((t) => t.idx))
    for (let i = 0; i < moi.length; i++) {
      const { c, kq } = moi[i]
      if (laTrung.has(i)) { trungKho.push(`${c.ma_nguon} ≡ ${maCauList[i]}`); continue }
      // kiem_may_boi: cổng ghi 'day_chuyen' nhưng CHECK của bảng chỉ nhận mcq-auto|claude_code|nguoi ⇒ 'claude_code' (như ghi-tsa.mjs)
      await db.query(`update dai_cau_hoi set kiem_may = $2, kiem_may_at = now(), kiem_may_boi = 'claude_code', kiem_may_ghi = $3 where ma_cau = $1`,
        [maCauList[i], kq.kiem_may, kq.kiem_may_ghi.slice(0, 1500)])
      theoKiem[kq.kiem_may] = (theoKiem[kq.kiem_may] || 0) + 1
      c._ma_cau = maCauList[i]
    }
  }
  const { rows: [dem] } = await db.query(`select count(*) filter (where ten_de_goc like $1) n_sach, count(*) n_4T from dai_cau_hoi where xoa_at is null and dang_chinh like 'T14T%'`, [`${SACH} · %`])
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', CHUA_GAN ? '· CHƯA GÁN DẠNG (mọi câu vào dạng chờ)' : '', `· qua cổng ${giu.length} · chèn mới ${Object.values(theoKiem).reduce((x, y) => x + y, 0)} · kiem_may ${JSON.stringify(theoKiem)}`)
  console.log(`  kho 4T sau lượt này: ${dem.n_4t} câu (từ sách này: ${dem.n_sach})`)
  if (daCo.length) console.log(`  Đã có từ lượt trước, bỏ qua (${daCo.length}): ${daCo.join(', ')}`)
  if (trungKho.length) console.log(`  Trùng nội dung câu sẵn có trong kho, không chèn (${trungKho.length}): ${trungKho.join(', ')}`)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) {
  await db.query('rollback').catch(() => {})
  console.error('LỖI — đã rollback:', e.message); process.exitCode = 1
} finally { await db.end() }

console.log(`  Cổng TỪ CHỐI (${tuChoi.length}):`); for (const t of tuChoi) console.log(`    ${t.c.ma_nguon}: ${t.ly_do.join(' | ')}`)
console.log(`  Không ghi (${boQua.length}):`); for (const b of boQua) console.log(`    ${b.c.ma_nguon}: ${b.ly_do}`)
const nghi = giu.filter((g) => g.kq.kiem_may !== 'khop')
console.log(`  Câu mang cờ (${nghi.length}):`); for (const g of nghi) console.log(`    ${g.c.ma_nguon} [${g.kq.kiem_may}] ${g.kq.kiem_may_ghi.split(' · ').filter((s) => !/=dat\//.test(s)).join(' · ')}`)
