// ============================================================================
// ghi-tsa.mjs — ghi kết quả của boc-tsa.mjs vào kho TSA (tsa_cau_hoi + lý thuyết chuyên đề).
//
//   node scripts/tsa/ghi-tsa.mjs <tsa.json> <thư mục img>            # CHẠY THỬ: ghi trong 1 transaction rồi ROLLBACK, không upload ảnh
//   node scripts/tsa/ghi-tsa.mjs <tsa.json> <thư mục img> --ghi      # ghi thật (upload ảnh → bucket kho-anh)
//
// - Mọi câu qua CỔNG GHI (scripts/kho/cong-ghi.mjs): kiem_may do cổng suy ra từ biên bản, không tự khai. da_duyet luôn false.
//   Biên bản: kiem-doc (code, đối chiếu bản HS cùng tài liệu = nhân chứng độc lập) · kiem-dang (code: dạng suy từ cấu trúc folder/file).
// - Câu có hình KHÔNG phải PNG/JPG (WMF) → KHÔNG ghi, liệt kê cho người xử lý (thà thiếu còn hơn câu mất hình).
// - Chạy lại không nhân đôi: khoá nguồn (tên tài liệu, mục, số câu) — câu đã có thì bỏ qua.
// - Đáp án không chắc ⇒ để trống (§1.5). kiem_may hạ xuống khong_kiem_duoc / nghi khi đáp án trống, lấy từ câu cuối lời giải, hoặc mâu thuẫn.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { xetGoi, bamNoiDung } from '../kho/cong-ghi.mjs'

const GOC_REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const [tsaJson, imgDir] = args.filter((a) => !a.startsWith('--'))
if (!tsaJson || !imgDir) { console.error('Dùng: node scripts/tsa/ghi-tsa.mjs <tsa.json> <thư mục img> [--ghi]'); process.exit(2) }
const j = JSON.parse(readFileSync(tsaJson, 'utf8'))

const docEnv = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const env = docEnv(join(GOC_REPO, '.env'))
const envLocal = docEnv(join(GOC_REPO, '.env.local'))

const KHOI = '12'
const maDangCua = (cd) => `TS${KHOI}${cd.so_chu_de}${String(cd.thu_tu).padStart(2, '0')}01`
const laAnhDuoc = (f) => /\.(png|jpe?g)$/i.test(f)
const cdTheoKey = new Map(j.chuyen_de.map((cd) => [`${cd.so_chu_de}.${cd.thu_tu}`, cd]))

// ── upload ảnh (chỉ khi --ghi) ───────────────────────────────────────────────
let sb = null
const storage = () => {
  if (!sb) {
    if (!envLocal.VITE_SUPABASE_URL || !envLocal.SUPABASE_SERVICE_ROLE) throw new Error('thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local')
    sb = createClient(envLocal.VITE_SUPABASE_URL, envLocal.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
  }
  return sb
}
const thang = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` })()
async function upAnh(cd, f, nhan) {
  const p = join(imgDir, `${cd.so_chu_de}${String(cd.thu_tu).padStart(2, '0')}_${f}`)
  if (!existsSync(p)) throw new Error(`thiếu file ảnh ${p}`)
  const ext = f.split('.').pop().toLowerCase()
  const path = `tsa/${thang}/${randomUUID()}_${nhan}.${ext}`
  if (!GHI) return `dry://kho-anh/${path}`
  const { error } = await storage().storage.from('kho-anh').upload(path, readFileSync(p), { contentType: ext === 'png' ? 'image/png' : 'image/jpeg', upsert: false })
  if (error) throw new Error(`upload ${path}: ${error.message}`)
  return storage().storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}

// ── dựng câu + gói qua cổng ──────────────────────────────────────────────────
const giu = [], boQua = []
for (const q of j.cau) {
  const cd = cdTheoKey.get(q.chuyen_de)
  const anhLa = [...q.anh, ...q.anh_giai, ...(q.menh_de ?? []).flatMap((m) => m.anh)].filter((f) => !laAnhDuoc(f))
  if (anhLa.length) { boQua.push({ q, cd, ly_do: `hình không phải PNG/JPG (${anhLa.length} tệp WMF/…) — chưa đổi được` }); continue }
  giu.push({ q, cd })
}

const tuKiem = (q) => {
  // mức tin của ĐÁP ÁN (không phải của việc đọc): trống / từ câu cuối lời giải / mâu thuẫn ⇒ hạ
  if (q.dap_an_nguon === 'mau_thuan' || (q.menh_de ?? []).some((m) => m.dap_an_nguon === 'mau_thuan')) return 'nghi'
  const thieu = q.loai_cau === 'dung_sai' ? q.menh_de.some((m) => !m.dap_an) : (!q.dap_an && q.loai_cau !== 'tu_luan')
  if (thieu || q.dap_an_nguon === 'cuoi_loi_giai') return 'khong_kiem_duoc'
  return null
}

async function dungCau(cd, q, anhDe, anhGiai) {
  const cau = {
    dang_chinh: maDangCua(cd), loai_cau: q.loai_cau, noi_dung: q.noi_dung,
    lua_chon: q.lua_chon ?? null,
    menh_de: q.menh_de ? q.menh_de.map((m) => ({ noi_dung: m.noi_dung, dap_an: m.dap_an, ma_dang: maDangCua(cd), loi_giai: m.loi_giai })) : null,
    dap_an: q.loai_cau === 'dung_sai' ? null : (q.dap_an ?? null),
    loi_giai: q.loi_giai ?? null, anh_de: anhDe, anh_dap_an: anhGiai, ma_cum: null, nguon_giai: 'nguoi',
  }
  const bam = bamNoiDung(cau)
  const hsOk = q.hs_khop === true && !q.canh_bao.some((w) => /công thức hỏng/.test(w))
  const kiemDoc = { tram: 'kiem-doc', lan_chay: 'K1', cach: 'code', ket_qua: q.hs_khop === null ? 'khong_kiem_duoc' : hsOk ? 'dat' : 'khong_dat',
    bam_noi_dung: bam, ghi_chu: `đối chiếu chữ đề với bản HS cùng tài liệu: ${q.hs_khop === true ? 'khớp' : q.hs_khop === false ? 'LỆCH' : 'không có bản HS'}` }
  const kiemDang = { tram: 'kiem-dang', lan_chay: 'K2', cach: 'code', ket_qua: 'dat', bam_noi_dung: bam,
    ghi_chu: 'dạng suy từ cấu trúc folder/file tài liệu (không phán đoán) — dạng cơ bản của chuyên đề' }
  const goi = { cau: { ...cau, nguon_giai: 'nguoi' }, vet: { lam: { tram: 'doc-tsa', lan_chay: 'L1', model: 'boc-tsa.mjs' }, kiem: [kiemDoc, kiemDang] } }
  const kq = xetGoi(goi)
  if (!kq.duoc_ghi) throw new Error(`cổng từ chối ${cd.file_goc} ${q.phan} câu ${q.so}: ${kq.ly_do.join('; ')}`)
  let kiemMay = kq.kiem_may
  const ha = tuKiem(q)
  if (ha === 'nghi' || (ha === 'khong_kiem_duoc' && kiemMay === 'khop')) kiemMay = ha
  const ghi = [kq.kiem_may_ghi, q.dap_an_nguon ? `đáp án: ${q.dap_an_nguon}` : null, ...(q.menh_de ?? []).map((m) => `${m.chu}:${m.dap_an_nguon ?? 'trống'}`), ...q.canh_bao].filter(Boolean).join(' · ')
  return { cau, kiemMay, ghi }
}

// ── chạy ─────────────────────────────────────────────────────────────────────
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const tk = { moi: 0, da_co: 0, lt: 0, anh: 0 }
const theoKiem = {}
try {
  await c.query('begin')
  const { rows: coRoi } = await c.query(`select ten_de_goc, phan_tai_lieu, so_cau_goc from tsa_cau_hoi where xoa_at is null`)
  const daCo = new Set(coRoi.map((r) => `${r.ten_de_goc}|${r.phan_tai_lieu}|${r.so_cau_goc}`))

  // lý thuyết chuyên đề (chỉ khi có nội dung đáng kể; ảnh trong lý thuyết chưa chèn được ⇒ ghi chú)
  for (const cd of j.chuyen_de) {
    if ((cd.ly_thuyet ?? '').length < 150) continue
    const r = await c.query(`insert into tsa_chuyen_de_ly_thuyet (ma_chuyen_de, noi_dung) values ($1, $2) on conflict (ma_chuyen_de) do nothing`,
      [`TS${KHOI}${cd.so_chu_de}${String(cd.thu_tu).padStart(2, '0')}`, cd.ly_thuyet])
    tk.lt += r.rowCount
  }

  for (const { q, cd } of giu) {
    const khoa = `${cd.file_goc}|${q.phan}|${q.so}`
    if (daCo.has(khoa)) { tk.da_co++; continue }
    const nhan = `${cd.so_chu_de}${cd.thu_tu}${q.phan[0]}${q.so}`
    const a = q.anh.find(laAnhDuoc), g = q.anh_giai.find(laAnhDuoc)
    const anhDe = a ? await upAnh(cd, a, nhan) : null
    const anhGiai = g ? await upAnh(cd, g, nhan + 'g') : null
    if (a) tk.anh++; if (g) tk.anh++
    const { cau, kiemMay, ghi } = await dungCau(cd, q, anhDe, anhGiai)
    await c.query(
      `insert into tsa_cau_hoi (dang_chinh, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, nguon, nguon_giai,
         da_duyet, kiem_may, kiem_may_at, kiem_may_boi, kiem_may_ghi, ten_de_goc, phan_tai_lieu, so_cau_goc)
       values ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,'tai_lieu','nguoi',false,$10,now(),'claude_code',$11,$12,$13,$14)`,
      [cau.dang_chinh, cau.loai_cau, cau.noi_dung, cau.lua_chon ? JSON.stringify(cau.lua_chon) : null, cau.menh_de ? JSON.stringify(cau.menh_de) : null,
       cau.dap_an, cau.loi_giai, cau.anh_de, cau.anh_dap_an, kiemMay, ghi.slice(0, 1500), cd.file_goc, q.phan, q.so])
    tk.moi++
    theoKiem[kiemMay] = (theoKiem[kiemMay] || 0) + 1
  }

  // đối chiếu trong transaction
  const { rows: dem } = await c.query(`select b.ten_chuyen_de, count(*) filter (where h.ma_cau is not null) n from tsa_ban_do b
     left join tsa_cau_hoi h on h.dang_chinh = b.ma_dang and h.xoa_at is null group by b.ten_chuyen_de, b.thu_tu order by b.thu_tu`)
  console.log(GHI ? 'GHI THẬT' : 'CHẠY THỬ (sẽ ROLLBACK)', JSON.stringify(tk), 'kiem_may:', JSON.stringify(theoKiem))
  console.log('Số câu trong kho theo chuyên đề (sau lượt này):'); for (const r of dem) console.log('  ', String(r.n).padStart(3), r.ten_chuyen_de)
  console.log(`Không ghi (${boQua.length}):`); for (const b of boQua) console.log(`  ${b.cd.file_goc} · ${b.q.phan} câu ${b.q.so}: ${b.ly_do}`)
  await c.query(GHI ? 'commit' : 'rollback')
} catch (e) {
  await c.query('rollback').catch(() => {})
  console.error('LỖI — đã rollback:', e.message); process.exitCode = 1
} finally { await c.end() }
