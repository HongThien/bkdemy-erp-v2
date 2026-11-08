// ============================================================================
// k4T-tbc-ghi.mjs — GHI lô clone «Trung bình cộng» (k4T-tbc-sinh.mjs) vào kho Đại QUA CỔNG GHI (cong-ghi.mjs).
//
//   node scripts/kho/clone/k4T-tbc-ghi.mjs <lo.json> --mu <mu.json> [--hinh <hinh.json>] [--ghi]
//
//   lo.json   = lô máy sinh (mỗi câu có `id` = số thứ tự trong lô)
//   mu.json   = [{ id, dap_an }] — bản giải MÙ độc lập (model không thấy đáp số máy); câu lệch ⇒ KHÔNG ghi
//   hinh.json = [{ id, hinh_dung, hinh_ghi }] — model KHÁC (Opus) nhìn ảnh sơ đồ + đề (trạm kiem-hinh-b); câu có sơ đồ mà thiếu/không đạt ⇒ KHÔNG ghi
//
// Câu vào DẠNG CHỜ của khối (T14T000000, da_duyet=false, nguon='clone'): bản đồ mới gán dạng bằng dai_bdm_gan_cau.
//   · Clone có câu gốc (parent_ma_cau): `_bdm_cau_giai` tự lấy dạng của GỐC ⇒ chỉ cần kiểm gốc đã gán đúng dạng lô ghi; KHÔNG ghi thêm gán.
//   · Clone không có gốc (dạng sách không có câu: 1.2 · 1.4 · 2.3 + mẫu hai-so-tbc-hieu): ghi `dai_bdm_gan_cau` nguon 'ai' cho CHÍNH câu đó.
// Biên bản mỗi câu (cổng quyết trạm nào bắt buộc): kiem-doc (code: khuôn đề/lời giải của mẫu), kiem-dap-so (code: k4T-tbc-kiem vét cạn từ chữ
// của đề + khớp bản giải mù), kiem-hinh-a (code: máy vẽ sơ đồ tự kiểm), kiem-hinh-b (model khác). Người làm = máy sinh (lượt khác hẳn người kiểm).
// Sơ đồ: veSoDo → SVG → bucket kho-anh → anh_dap_an (như câu gốc của sách). Chống nhân đôi: ten_de_goc = "Clone 4T TBC c1 · <mẫu> #<id>".
// Không --ghi: chạy thử (chèn trong transaction rồi ROLLBACK, sơ đồ không upload).
// ============================================================================
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { xetGoi, bamNoiDung } from '../cong-ghi.mjs'
import { veSoDo } from '../so-do-doan-thang.mjs'
import { insertCauBatch } from '../../_kho_insert.mjs'
import { kiemCau } from './k4T-tbc-kiem.mjs'

const GHI = process.argv.includes('--ghi')
const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const loTep = a[0], muTep = lay('--mu'), hinhTep = lay('--hinh')
if (!loTep || !muTep) { console.error('Dùng: node scripts/kho/clone/k4T-tbc-ghi.mjs <lo.json> --mu <mu.json> [--hinh <hinh.json>] [--ghi]'); process.exit(2) }

const KHOI_CHO = 'T14T000000', TIEN_TO = 'Clone 4T TBC c1'
const MODEL_LAM = 'claude-sonnet-5-5 (máy sinh theo mẫu k4T-tbc-sinh.mjs)', LAN_LAM = 'tbc-c1-sinh', LAN_CODE = 'tbc-c1-kiem-code', LAN_HINH = 'tbc-c1-hinh-opus'
const lo = JSON.parse(readFileSync(loTep, 'utf8'))
const mu = new Map(JSON.parse(readFileSync(muTep, 'utf8')).map((x) => [x.id, x.dap_an]))
const hinh = new Map((hinhTep ? JSON.parse(readFileSync(hinhTep, 'utf8')) : []).map((x) => [x.id, x]))

const docEnv = (f) => Object.fromEntries(readFileSync(new URL(f, import.meta.url), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const env = docEnv('../../../.env'); let envLocal = {}; try { envLocal = docEnv('../../../.env.local') } catch { /* chỉ cần khi --ghi có sơ đồ */ }
const nums = (s) => (String(s).replace(/\$/g, '').match(/\d+/g) || []).map(Number).join(',')

// ── cổng: bộ kiểm riêng + khớp bản giải mù ─────────────────────────────────────
const tuChoi = [], giu = []
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await db.connect()
let kho = null
const storage = () => {
  if (!kho) {
    if (!envLocal.VITE_SUPABASE_URL || !envLocal.SUPABASE_SERVICE_ROLE) throw new Error('thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local')
    kho = createClient(envLocal.VITE_SUPABASE_URL, envLocal.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
  }
  return kho
}
try {
  const { rows: goc } = await db.query(`select g.ma_cau, g.dang_chinh, g.anh_de, gc.dang_bai_id from dai_cau_hoi g left join dai_bdm_gan_cau gc on gc.ma_cau = g.ma_cau where g.ma_cau = any($1) and g.xoa_at is null`, [[...new Set(lo.map((c) => c.parent).filter(Boolean))]])
  const gocMap = new Map(goc.map((g) => [g.ma_cau, g]))
  const { rows: daCo } = await db.query(`select ten_de_goc from dai_cau_hoi where ten_de_goc like $1 and xoa_at is null`, [`${TIEN_TO} · %`])
  const daCoSet = new Set(daCo.map((r) => r.ten_de_goc))

  for (const c of lo) {
    const ten = `${TIEN_TO} · ${c.mau} #${c.id}`, ly = []
    if (daCoSet.has(ten)) continue
    const loiKiem = kiemCau(c); if (loiKiem.length) ly.push(`bộ kiểm: ${loiKiem.join(' | ')}`)
    if (!mu.has(c.id)) ly.push('thiếu bản giải mù')
    else if (nums(mu.get(c.id)) !== nums(c.dap_an)) ly.push(`bản giải mù lệch: mù=${mu.get(c.id)} · máy=${c.dap_an}`)
    if (c.parent) {
      const g = gocMap.get(c.parent)
      if (!g) ly.push(`câu gốc ${c.parent} không còn trong kho`)
      else if (g.dang_bai_id !== c.dang) ly.push(`câu gốc ${c.parent} chưa gán đúng dạng ${c.dang} (đang: ${g.dang_bai_id ?? 'chưa gán'})`)
      else if (g.anh_de) ly.push('câu gốc có hình đề — không clone đổi số')
    }
    let svg = null, kiemB = null
    if (c.so_do) {
      try { svg = veSoDo(c.so_do) } catch (e) { ly.push(`sơ đồ: ${e.message}`) }
      const h = hinh.get(c.id)
      if (!h) ly.push('thiếu biên bản kiem-hinh-b'); else if (!h.hinh_dung) ly.push(`kiem-hinh-b không đạt — không ghi: ${h.hinh_ghi}`); else kiemB = h   // sơ đồ sai thì bỏ câu, không đưa vào kho kèm cờ nghi
    }
    if (ly.length) { tuChoi.push({ c, ly_do: ly }); continue }
    giu.push({ c, ten, svg, kiemB })
  }

  // ── dựng gói + qua cổng ─────────────────────────────────────────────────────
  const qua = []
  for (const { c, ten, svg, kiemB } of giu) {
    let url = `dry://kho-anh/clone/tbc/c${c.id}.svg`
    if (svg && GHI) {
      const path = `clone/2026-10/${randomUUID()}_tbc-c${c.id}.svg`
      const { error } = await storage().storage.from('kho-anh').upload(path, Buffer.from(svg), { contentType: 'image/svg+xml', upsert: false })
      if (error) throw new Error(`upload ${path}: ${error.message}`)
      url = storage().storage.from('kho-anh').getPublicUrl(path).data.publicUrl
    }
    const cau = { dang_chinh: KHOI_CHO, loai_cau: c.loai_cau, noi_dung: c.noi_dung, lua_chon: null, menh_de: null, dap_an: c.dap_an, loi_giai: c.loi_giai,
      anh_de: null, anh_dap_an: svg ? url : null, ma_cum: null, nguon_giai: 'ai', hinh_do_may_ve: !!svg }
    const bam = bamNoiDung(cau), kiem = []
    const bb = (tram, cach, kq, lan, model) => kiem.push({ tram, lan_chay: lan, cach, ...(model ? { model } : {}), ket_qua: kq.ket_qua, ghi_chu: kq.ghi_chu, bam_noi_dung: bam })
    bb('kiem-doc', 'code', { ket_qua: 'dat', ghi_chu: `câu clone dựng từ mẫu ${c.mau}${c.parent ? ` (gốc ${c.parent})` : ' (dạng sách không có câu — soạn theo mô tả dạng)'}; khuôn đề/lời giải 2 phần đạt` }, LAN_CODE)
    bb('kiem-dap-so', 'code', { ket_qua: 'dat', ghi_chu: 'bộ kiểm vét cạn từ chữ của đề ra đúng đáp số + mọi phép tính trong lời giải đúng + bản giải mù độc lập khớp' }, LAN_CODE)
    if (svg) {
      bb('kiem-hinh-a', 'code', { ket_qua: 'dat', ghi_chu: 'máy vẽ sơ đồ tự kiểm: nhãn tổng/hiệu khớp các hàng, đúng tỉ lệ' }, LAN_CODE)
      bb('kiem-hinh-b', 'model_khac', kiemB.hinh_dung ? { ket_qua: 'dat', ghi_chu: `model khác xem ảnh sơ đồ: khớp đề${kiemB.hinh_ghi ? ' — ' + kiemB.hinh_ghi : ''}` } : { ket_qua: 'khong_dat', ghi_chu: `model khác xem ảnh sơ đồ: ${kiemB.hinh_ghi ?? 'không khớp'}` }, LAN_HINH, 'claude-opus-5-5')
    }
    const kq = xetGoi({ cau, vet: { lam: { tram: 'giai', lan_chay: LAN_LAM, model: MODEL_LAM }, kiem } })
    if (!kq.duoc_ghi) { tuChoi.push({ c, ly_do: kq.ly_do }); continue }
    qua.push({ c, ten, cau, kq })
  }

  // ── chèn ────────────────────────────────────────────────────────────────────
  await db.query('begin')
  const dem = {}; let trung = 0, nGan = 0
  if (qua.length) {
    const cauList = qua.map(({ c, ten, cau }) => ({ ...cau, nguon: 'clone', giai_method: 'claude_code', ai_model: 'claude-sonnet-5-5', ten_de_goc: ten }))
    const { maCauList, trung: tr } = await insertCauBatch({ client: db, subject: 'dai', cauList })
    const laTrung = new Set(tr.map((t) => t.idx)); trung = laTrung.size
    for (const t of tr) console.log(`  ≈ trùng đề: #${qua[t.idx].c.id} ${qua[t.idx].c.mau} ↔ ${t.ma_cau_cu ?? 'câu khác trong lô'}`)
    for (let i = 0; i < qua.length; i++) {
      if (laTrung.has(i)) continue
      const { c, kq } = qua[i], ma = maCauList[i]
      await db.query(`update dai_cau_hoi set parent_ma_cau = $2, clone_method = 'may_sinh_theo_mau', kiem_may = $3, kiem_may_at = now(), kiem_may_boi = 'claude_code', kiem_may_ghi = $4 where ma_cau = $1`,
        [ma, c.parent ?? null, kq.kiem_may, kq.kiem_may_ghi.slice(0, 1500)])
      if (!c.parent) { await db.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon) values ($1, $2, 'ai')`, [ma, c.dang]); nGan++ }
      dem[c.dang] = (dem[c.dang] || 0) + 1
    }
  }
  const tong = Object.values(dem).reduce((s, x) => s + x, 0)
  const { rows: [{ n }] } = await db.query(`select count(*)::int n from dai_cau_hoi where ten_de_goc like $1 and xoa_at is null`, [`${TIEN_TO} · %`])
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', `· lô ${lo.length} · qua cổng ${qua.length} · chèn mới ${tong} · trùng đề đã có ${trung} · gán riêng (không gốc) ${nGan} · đã có từ trước ${daCoSet.size} · cổng từ chối ${tuChoi.length}`)
  console.table(dem)
  console.log(`  clone TBC trong kho sau lượt này: ${n}`)
  for (const t of tuChoi.slice(0, 30)) console.log(`  ✘ #${t.c.id} ${t.c.mau}: ${t.ly_do.join(' | ').slice(0, 300)}`)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message); process.exitCode = 1 } finally { await db.end() }
