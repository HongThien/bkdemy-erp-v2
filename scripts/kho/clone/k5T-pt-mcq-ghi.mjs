// ============================================================================
// k5T-pt-mcq-ghi.mjs — GHI form MCQ cho câu 5T "Tỉ số phần trăm" (28/11) từ các lô nhiễu `kho-rules/dai/clone/k5T-pt-*-mcq.json`.
//
//   node scripts/kho/clone/k5T-pt-mcq-ghi.mjs <A|B|C|c1|all> [--ghi]        # sinh form chờ (da_duyet=false), mặc định chạy thử ROLLBACK
//   node scripts/kho/clone/k5T-pt-mcq-ghi.mjs <A|B|C|c1|all> --mau          # in mẫu MÙ 10% (đề + 4 phương án, KHÔNG nhãn đúng/rule) ra ra/mau-mu-5T-pt.json
//   node scripts/kho/clone/k5T-pt-mcq-ghi.mjs <A|B|C|c1|all> --duyet [--ghi] # máy ký form chờ của lô (chỉ sau khi mẫu mù sạch)
//
// Máy MCQ chung (mcq-sinh) không đọc được đáp số kèm đơn vị / % ⇒ đường riêng. Phương án đúng = `dap_an` nguyên văn trong kho; 3 nhiễu do
// k5T-pt-mcq-kiem.mjs chọn (3 rule khác nhau, giá trị khác nhau, cùng khuôn chữ, ≤1 dự phòng) + cổng hình thức lib/mcq-hinh-thuc.mjs.
// Vị trí đáp án đúng xoay vòng A→D theo thứ tự câu để cân phân bố. Câu đã có form (chưa rác) ⇒ bỏ qua, chạy lại an toàn.
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
import { chonNhieu } from './k5T-pt-mcq-kiem.mjs'
import { loiHinhThuc } from '../../lib/mcq-hinh-thuc.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const env = Object.fromEntries(readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const a = process.argv.slice(2), GHI = a.includes('--ghi'), MAU = a.includes('--mau'), DUYET = a.includes('--duyet')
const chon = (a.find((x) => !x.startsWith('--')) ?? 'all')
const TEN = { A: 'k5T-pt-fill-A-mcq', B: 'k5T-pt-fill-B-mcq', C: 'k5T-pt-fill-C-mcq', C1: 'k5T-pt-c1-mcq' }
const LO = chon.toLowerCase() === 'all' ? Object.values(TEN) : [TEN[chon.toUpperCase()]]
if (LO.includes(undefined)) { console.error('Dùng: … <A|B|C|c1|all> [--ghi|--mau|--duyet]'); process.exit(2) }
const MODEL = 'claude-sonnet-5-5 (k5T-pt-mcq)'
const L = ['A', 'B', 'C', 'D']

const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
const q = async (s, p) => (await db.query(s, p)).rows
let ma = 0
try {
  await q('begin')
  const ruleInfo = new Map((await q(`select ma, du_phong from dai_mcq_rule where active`)).map((r) => [r.ma, r]))
  const deLo = []
  for (const t of LO) for (const x of JSON.parse(readFileSync(join(root, 'kho-rules/dai/clone', t + '.json'), 'utf8'))) deLo.push(x)
  const cau = await q(`select ma_cau, noi_dung, dap_an from dai_cau_hoi where xoa_at is null and da_duyet and lua_chon is null and menh_de is null and noi_dung = any($1)`, [deLo.map((x) => x.noi_dung)])
  const theoDe = new Map(cau.map((c) => [c.noi_dung, c]))
  const maCauLo = [...new Set(deLo.map((x) => theoDe.get(x.noi_dung)?.ma_cau).filter(Boolean))]

  if (MAU || DUYET) {
    const forms = await q(`select f.id, f.ma_cau, f.lua_chon, f.dap_an, h.noi_dung from dai_cau_form_tn f join dai_cau_hoi h on h.ma_cau = f.ma_cau
      where f.ma_cau = any($1) and f.xoa_at is null and not f.da_duyet and f.ai_model = $2 order by f.ma_cau`, [maCauLo, MODEL])
    if (MAU) {
      const xs = forms.map((f) => [Math.sin(f.ma_cau.length * 7 + [...f.ma_cau].reduce((s, c) => s + c.charCodeAt(0), 0)), f]).sort((p, r) => p[0] - r[0]).map((p) => p[1])
      const n = Math.max(20, Math.ceil(forms.length * 0.1)), mau = xs.slice(0, n).map((f) => ({ ma: f.ma_cau, de: f.noi_dung, A: f.lua_chon[0].text, B: f.lua_chon[1].text, C: f.lua_chon[2].text, D: f.lua_chon[3].text }))
      mkdirSync(join(root, 'ra'), { recursive: true }); const tep = join(root, 'ra/mau-mu-5T-pt.json'); writeFileSync(tep, JSON.stringify(mau, null, 1))
      console.log(`form chờ ${forms.length} · mẫu mù ${mau.length} → ${tep}`)
      await q('rollback')
    } else {
      // phương án "Giảm ≥ 100%" là phi lí (HS loại bằng mắt) ⇒ không ký, để chờ sinh lại
      const phiLi = (o) => { const m = String(o.text).replace(/\\%/g, '%').match(/Giảm[^0-9]*(\d+(?:,\d+)?)\s*%/); return m && Number(m[1].replace(',', '.')) >= 100 }
      const bad = forms.filter((f) => loiHinhThuc(f.noi_dung, f.lua_chon.map((o) => o.text)).length || f.lua_chon.some(phiLi))
      const dat = forms.filter((f) => !bad.includes(f))
      console.log(`form chờ ${forms.length} · loại vì hình thức ${bad.length} · duyệt ${dat.length}`)
      const [ad] = await q("select tk.id, tk.nhan_su_id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
      await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
      if (dat.length) console.log('duyệt', JSON.stringify((await q(`select fn_mcq_form_duyet_batch('dai', $1::uuid[], $2) r`, [dat.map((x) => x.id), ad.nhan_su_id]))[0].r))
      await q(GHI ? 'commit' : 'rollback'); console.log(GHI ? '■ ĐÃ DUYỆT' : '□ THỬ ⇒ ROLLBACK')
    }
  } else {
    const co = new Set((await q(`select ma_cau from dai_cau_form_tn where ma_cau = any($1) and xoa_at is null`, [maCauLo])).map((r) => r.ma_cau))
    let ok = 0, thieu = 0, daCo = 0, khongCau = 0, hinhThuc = 0, i = 0; const dem = { A: 0, B: 0, C: 0, D: 0 }, ruleDem = {}, lyDoThieu = []
    for (const it of deLo) {
      const c = theoDe.get(it.noi_dung); if (!c) { khongCau++; continue }
      if (co.has(c.ma_cau)) { daCo++; continue }
      const { chon: ch, lyDo } = chonNhieu(c.dap_an, it.nhieu, ruleInfo)
      if (ch.length < 3) { thieu++; lyDoThieu.push(`${c.ma_cau}: ${lyDo.slice(0, 2).join(' | ')}`); continue }
      const vt = i++ % 4, lc = ch.map((n) => ({ dung: false, rule: n.rule, text: n.text, duong_sai: n.duong_sai }))
      lc.splice(vt, 0, { dung: true, text: c.dap_an })
      if (loiHinhThuc(c.noi_dung, lc.map((o) => o.text)).length) { hinhThuc++; i--; continue }
      await q(`insert into dai_cau_form_tn (ma_cau, lua_chon, dap_an, key_gia_tri, nguon, ai_model) values ($1, $2::jsonb, $3, $4, 'ai', $5)`,
        [c.ma_cau, JSON.stringify(lc), L[vt], c.dap_an.replace(/[\s$]/g, ''), MODEL])
      ok++; dem[L[vt]]++; co.add(c.ma_cau); for (const n of ch) ruleDem[n.rule] = (ruleDem[n.rule] || 0) + 1
    }
    console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', `· form mới ${ok} · thiếu nhiễu ${thieu} · hình thức ${hinhThuc} · đã có form ${daCo} · đề không có trong kho ${khongCau}`)
    console.log('  phân bố đúng', JSON.stringify(dem), '· rule', JSON.stringify(ruleDem))
    for (const l of lyDoThieu.slice(0, 8)) console.log('  ✘', l)
    await q(GHI ? 'commit' : 'rollback')
  }
} catch (e) { ma = 1; await q('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message) } finally { await db.end() }
process.exit(ma)
