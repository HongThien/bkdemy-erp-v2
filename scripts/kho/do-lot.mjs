// ĐO TỈ LỆ LỌT của câu TỰ VÀO KHO (Thùy 21/11; spec-giai-bai §C5 + §C10 mục 5; sổ kho_do_lot mig 202611210824).
//
//   node scripts/kho/do-lot.mjs --rut --kho toan [--khoi 9] [--n 40] [--tu 2026-11-18] [--nguon ai] --ra <de.json>
//        rút NGẪU NHIÊN n câu đã duyệt (duyet_nguon = ai|may, duyệt từ ngày --tu) ⇒ ghi tệp ĐỀ (không đáp án, không lời giải) cho người giải mù.
//        Chỉ đọc DB. Mặc định n = 15% số câu đủ điều kiện (tối thiểu 20, tối đa 200).
//   node scripts/kho/do-lot.mjs --so <de.json> <giai.json> --model <tên model giải mù> [--xet ma=khop,ma=lech] [--ghi]
//        so đáp số: giai.json = [{ "ma_cau": "...", "dap_an": "...", "khong_giai_duoc": true? }]. Mặc định chạy thử (ROLLBACK).
//        Chuẩn hoá so sánh (bỏ $, khoảng trắng, \dfrac→\frac, 0,5→0.5 …); lệch kiểu chữ có thể là cùng giá trị ⇒ nhìn danh sách lệch rồi
//        dùng --xet để chốt từng câu (khop|lech) trước khi --ghi. Model giải mù PHẢI khác model soạn câu (§C1) — script kiểm ai_model của câu.
//   node scripts/kho/do-lot.mjs --tong-ket [--lo <uuid>]   tỉ lệ lọt theo lượt / khối / đường vào kho. > 2% ⇒ batch đó Opus kiểm 100% (§C5).
//
// CHỈ ĐO: không sửa câu, không rút câu về hàng chờ (quy trình rà E4 chưa được duyệt). Câu lệch ⇒ người/Claude báo sai qua 🚩 hoặc
// scripts/kho/nhan-xet.mjs rồi mới sửa. Không chạy 17–22h (giờ học sinh dùng app, §C7).
import pg from 'pg'
import fs from 'node:fs'
import crypto from 'node:crypto'

const args = process.argv.slice(2)
const co = (k) => args.includes(k)
const sau = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined }
const TBL = { toan: 'dai', hgt: 'hgt', khtn: 'khtn', vatly: 'vatly', hoahoc: 'hoahoc', anh: 'anh', tsa: 'tsa' }   // hinh_hoc: chưa có đường đo đáp số
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()

const chuanHoa = (s) => String(s ?? '').toLowerCase()
  .replace(/\\[dt]frac/g, '\\frac').replace(/\$/g, '').replace(/\\left|\\right|\\,|\\;|\\!|\\ /g, '').replace(/\s+/g, '')
  .replace(/(\d),(\d)/g, '$1.$2').replace(/[.;]$/, '').replace(/^đáp\s*(số|án):?/, '')

try {
  if (co('--rut')) {
    const kho = sau('--kho'); const t = TBL[kho]; if (!t) throw new Error(`--kho ∈ ${Object.keys(TBL).join('|')}`)
    const khoi = sau('--khoi'); const tu = sau('--tu') ?? '2026-11-18'; const nguon = sau('--nguon') ?? 'ai'
    const dk = `c.da_duyet and c.xoa_at is null and c.duyet_nguon = $1 and c.duyet_at >= $2::date and c.dap_an is not null and ($3::text is null or b.khoi = $3)`
    const tong = Number((await c.query(`select count(*) n from ${t}_cau_hoi c join ${t}_ban_do b on b.ma_dang = c.dang_chinh where ${dk}`, [nguon, tu, khoi ?? null])).rows[0].n)
    const n = Number(sau('--n') ?? Math.min(200, Math.max(20, Math.ceil(tong * 0.15))))
    const r = await c.query(`select c.ma_cau, b.khoi, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.anh_de, c.ai_model
                               from ${t}_cau_hoi c join ${t}_ban_do b on b.ma_dang = c.dang_chinh where ${dk} order by random() limit $4`, [nguon, tu, khoi ?? null, n])
    const ra = sau('--ra'); if (!ra) throw new Error('--ra <de.json>')
    fs.writeFileSync(ra, JSON.stringify({ kho, nguon, tu, tong_du_dieu_kien: tong, cau: r.rows }, null, 2))
    console.log(`Đủ điều kiện ${tong} câu (${kho}${khoi ? ' khối ' + khoi : ''}, duyet_nguon=${nguon}, từ ${tu}). Rút ${r.rowCount} câu → ${ra}`)
    console.log('Giao tệp này cho người giải MÙ (Opus, ngữ cảnh sạch). Trả về giai.json = [{ma_cau, dap_an}].')
  } else if (co('--so')) {
    const i = args.indexOf('--so'); const fDe = args[i + 1], fGiai = args[i + 2]
    const model = sau('--model'); if (!fDe || !fGiai || !model) throw new Error('--so <de.json> <giai.json> --model <tên>')
    const de = JSON.parse(fs.readFileSync(fDe, 'utf8')); const giai = new Map(JSON.parse(fs.readFileSync(fGiai, 'utf8')).map((g) => [g.ma_cau, g]))
    const xet = new Map((sau('--xet') ?? '').split(',').filter(Boolean).map((s) => s.split('=')))
    const t = TBL[de.kho]
    const kho = (await c.query(`select ma_cau, dap_an, ai_model, duyet_nguon from ${t}_cau_hoi where ma_cau = any($1)`, [de.cau.map((x) => x.ma_cau)])).rows
    const theoMa = new Map(kho.map((k) => [k.ma_cau, k]))
    const dong = []
    for (const q of de.cau) {
      const k = theoMa.get(q.ma_cau); const g = giai.get(q.ma_cau)
      if (!k) { console.warn(`! ${q.ma_cau} không còn trong kho — bỏ`); continue }
      if (k.ai_model && model.toLowerCase().includes(k.ai_model.toLowerCase())) console.warn(`! ${q.ma_cau}: model giải mù (${model}) trùng model soạn (${k.ai_model}) — không còn là nhân chứng độc lập`)
      let kq, ghi = null
      if (!g || g.khong_giai_duoc || g.dap_an == null) { kq = 'khong_giai_duoc'; ghi = g?.ghi_chu ?? 'người giải mù không giải được' }
      else kq = chuanHoa(g.dap_an) === chuanHoa(k.dap_an) ? 'khop' : 'lech'
      if (xet.has(q.ma_cau)) { kq = xet.get(q.ma_cau); ghi = (ghi ? ghi + ' · ' : '') + 'người chốt sau khi xem tay' }
      dong.push({ ma_cau: q.ma_cau, khoi: q.khoi, kk: k.dap_an, gg: g?.dap_an ?? null, kq, ghi, nguon: k.duyet_nguon })
    }
    const dem = (x) => dong.filter((d) => d.kq === x).length
    console.log(`Khớp ${dem('khop')} · Lệch ${dem('lech')} · Không giải được ${dem('khong_giai_duoc')} (mẫu ${dong.length}).`)
    for (const d of dong.filter((d) => d.kq === 'lech')) console.log(`  LỆCH ${d.ma_cau} (khối ${d.khoi}): kho=${JSON.stringify(d.kk)}  giải mù=${JSON.stringify(d.gg)}`)
    const loId = crypto.randomUUID()
    await c.query('begin')
    for (const d of dong) await c.query(`insert into kho_do_lot (lo_id, kho, khoi, ma_cau, dap_an_kho, dap_an_giai, model_giai, ket_qua, ghi_chu, nguon_cau) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [loId, de.kho, d.khoi, d.ma_cau, d.kk, d.gg, model, d.kq, d.ghi, d.nguon])
    await c.query(co('--ghi') ? 'commit' : 'rollback')
    console.log(co('--ghi') ? `Đã ghi sổ kho_do_lot, lượt ${loId}` : '(chạy thử — ROLLBACK; xem LỆCH, chốt bằng --xet nếu chỉ khác kiểu chữ, rồi thêm --ghi)')
  } else if (co('--tong-ket')) {
    const lo = sau('--lo')
    const r = await c.query(`select ${lo ? `lo_id::text` : `'(mọi lượt)'`} lo, kho, coalesce(khoi,'?') khoi, coalesce(nguon_cau,'?') nguon,
                                    count(*) filter (where ket_qua='khop') khop, count(*) filter (where ket_qua='lech') lech, count(*) filter (where ket_qua='khong_giai_duoc') kg
                               from kho_do_lot ${lo ? 'where lo_id = $1' : ''} group by 1,2,3,4 order by 2,3,4`, lo ? [lo] : [])
    console.log('lượt | kho | khối | đường vào | khớp | lệch | không giải | tỉ lệ lọt')
    for (const x of r.rows) {
      const dung = Number(x.khop) + Number(x.lech); const ti = dung ? (100 * Number(x.lech) / dung) : null
      console.log(`${x.lo} | ${x.kho} | ${x.khoi} | ${x.nguon} | ${x.khop} | ${x.lech} | ${x.kg} | ${ti == null ? '—' : ti.toFixed(1) + '%'}${ti != null && ti > 2 ? '   ← > 2%: Opus kiểm 100% batch này (§C5)' : ''}`)
    }
    if (!r.rowCount) console.log('(chưa có lượt đo nào)')
  } else {
    console.log('Dùng: --rut | --so | --tong-ket   (xem đầu file)')
  }
} finally { await c.end() }
