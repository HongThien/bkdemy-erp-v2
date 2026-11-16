// Đẩy câu "chứng minh ba điểm thẳng hàng" của kho Hình K7 vào 3 bài Thẳng hàng (HH00170 cùng đường · HH00171 cộng góc · HH00172 tiên đề Ơ-clit) — Thùy 16/11.
//   Ý của bài–ý (đã tách) : chỉ ý thẳng hàng sang bài mới, các ý còn lại ở lại bài cũ (Thùy: "câu c thẳng hàng, câu a–b thuộc tam giác cân").
//     - mọi ý đang hiện của bài_y đều sang cùng 1 bài ⇒ đổi dang_chinh của bài_y (trigger lan sang ý);
//     - còn ý ở lại ⇒ tạo bài_y MỚI (cùng lời dẫn + hình + thứ tự, dang_chinh mới; ma_cau_goc để trống vì có ràng buộc duy nhất — nguồn gốc vẫn ở bài_y cũ) và chuyển ý sang đó (trigger ghép lại đề + dang_chinh).
//   Câu đơn (không bài_y) mà câu hỏi cuối là thẳng hàng ⇒ đổi thẳng dang_chinh.
//   Không đụng câu nhiều ý CHƯA tách (cần tách bài–ý trước) — in danh sách cuối. Không xoá gì. Lưu trạng thái cũ vào bien-ban-truoc.json.
//   node scripts/hinh-k7-day-thang-hang.mjs          # chạy thử (ROLLBACK) + dựng HTML xem
//   node scripts/hinh-k7-day-thang-hang.mjs --ghi
import pg from 'pg'
import { writeFileSync, mkdirSync } from 'node:fs'
import { bien } from './kho/cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
const T = { '170': 'HH00170', '171': 'HH00171', '172': 'HH00172' }
const TEN = { '170': 'Phương pháp cùng đường', '171': 'Phương pháp cộng góc', '172': 'Dùng tiên đề Euclide' }
// ma_cau → [bài đích, lý do ngắn]. Đã đọc lời giải từng câu (16/11).
const MAP = {
  // ý của bài–ý (đã tách)
  HHC012867: ['172', 'hai đường cùng qua M, cùng vuông góc BD ⇒ trùng (hệ quả tiên đề)'],
  HHC012881: ['171', 'cộng hai góc kề nhau = 180°'],
  HHC012904: ['172', 'AD ∥ BC, AK ∥ BC ⇒ trùng (tiên đề Ơ-clit)'],
  HHC012908: ['171', 'cộng hai góc kề nhau = 180°'],
  HHC012910: ['170', 'tia MH, ME cùng là phân giác ⇒ trùng'],
  HHC012913: ['172', 'MN ∥ BC, NE ∥ BC ⇒ trùng (tiên đề Ơ-clit)'],
  HHC012918: ['172', 'CE ∥ AB, CD ∥ AB ⇒ trùng (tiên đề Ơ-clit)'],
  HHC012920: ['171', 'cộng hai góc kề nhau = 180°'],
  HHC012922: ['170', 'cùng thuộc đường trung trực của EF'],
  HHC012999: ['171', 'cộng hai góc kề bù = 180°, A,K / H khác phía'],
  HHC013002: ['171', 'cộng hai góc kề bù = 180°, M,N khác phía'],
  HHC013040: ['172', 'EI, EK cùng qua E, cùng vuông góc BD ⇒ trùng (hệ quả tiên đề)'],
  HHC013073: ['171', 'cộng góc α+β+γ = 180°'],
  HHC013084: ['170', 'tia AM, AE cùng là phân giác ⇒ trùng'],
  HHC013256: ['170', 'tia BH, BE cùng là phân giác ⇒ trùng'],
  HHC013284: ['170', 'tia BM, BD cùng là phân giác ⇒ trùng'],
  HHC013288: ['172', 'CE ∥ AB, CD ∥ AB ⇒ trùng (tiên đề Euclid)'],
  HHC013293: ['170', 'tia AI, AD cùng là phân giác ⇒ trùng'],
  // câu đơn (câu hỏi cuối = thẳng hàng)
  HHC000772: ['171', 'cộng hai góc kề nhau = 180°'],
  HHC000776: ['172', 'AH, AB cùng vuông góc AC tại A ⇒ trùng (hệ quả tiên đề)'],
  HHC000780: ['171', 'cộng hai góc kề nhau = 180°'],
  HHC000783: ['170', 'tia DB, DM cùng là phân giác ⇒ trùng'],
  HHC000786: ['170', 'tia MH, ME cùng là phân giác ⇒ trùng'],
  HHC000816: ['172', 'MN ∥ …, EN ∥ … ⇒ trùng (tiên đề Ơ-clit)'],
  HHC000819: ['170', 'cùng thuộc đường trung trực của EF'],
  HHC000822: ['172', 'MI, MK cùng qua M, cùng vuông góc BD ⇒ trùng (hệ quả tiên đề)'],
  HHC000832: ['172', 'BD ∥ AC, BK ∥ AC ⇒ trùng (tiên đề Ơ-clit)'],
  HHC000837: ['172', 'CD ∥ AB, CE ∥ AB ⇒ trùng (tiên đề Euclid)'],
}
// đọc lời giải thấy KHÔNG thuộc 3 phương pháp (không gán, báo)
const KHAC = { HHC012872: 'dùng tính chất hình bình hành (hai đường chéo cắt nhau tại trung điểm)', HHC000825: 'dùng tính chất hình bình hành (hai đường chéo cắt nhau tại trung điểm)' }

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  const bai = await q(`select ma_bai, ten_bai from hinh_hoc_bai where khoi = '7' and ma_bai = any($1)`, [Object.values(T)])
  for (const k of Object.keys(T)) { const b = bai.find((x) => x.ma_bai === T[k]); if (!b || b.ten_bai !== TEN[k]) throw new Error(`bài đích ${T[k]} không đúng tên "${TEN[k]}"`) }

  const ids = Object.keys(MAP)
  const cau = await q(`select h.ma_cau, h.dang_chinh, h.bai_y, h.nhan_y, h.noi_dung, h.da_duyet, h.rut_khoi_kho, h.xoa_at, h.cau_hoi_y from hinh_hoc_cau_hoi h where h.ma_cau = any($1)`, [ids])
  if (cau.length !== ids.length) throw new Error(`thiếu câu: có ${cau.length}/${ids.length}`)
  for (const r of cau) if (r.xoa_at || r.rut_khoi_kho) throw new Error(`${r.ma_cau} đã rút/xoá — không đưa vào`)
  const truoc = cau.map((r) => ({ ma_cau: r.ma_cau, dang_chinh: r.dang_chinh, bai_y: r.bai_y, noi_dung: r.noi_dung }))
  mkdirSync('kho-rules/hinh/k7-thang-hang', { recursive: true })
  if (GHI) writeFileSync('kho-rules/hinh/k7-thang-hang/bien-ban-truoc.json', JSON.stringify(truoc, null, 1))

  const kq = []
  // 1) câu đơn
  for (const r of cau.filter((x) => !x.bai_y)) {
    await c.query(`update hinh_hoc_cau_hoi set dang_chinh = $2 where ma_cau = $1`, [r.ma_cau, T[MAP[r.ma_cau][0]]])
    kq.push({ ma_cau: r.ma_cau, tu: r.dang_chinh, den: T[MAP[r.ma_cau][0]], loai: 'cả câu', ly_do: MAP[r.ma_cau][1], nd_doi: false })
  }
  // 2) ý của bài–ý
  const theoBaiY = {}
  for (const r of cau.filter((x) => x.bai_y)) (theoBaiY[r.bai_y] ??= []).push(r)
  for (const [by, ys] of Object.entries(theoBaiY)) {
    const dich = [...new Set(ys.map((y) => MAP[y.ma_cau][0]))]
    for (const d of dich) {
      const nhom = ys.filter((y) => MAP[y.ma_cau][0] === d)
      const hien = await q(`select ma_cau from hinh_hoc_cau_hoi where bai_y = $1 and xoa_at is null and not rut_khoi_kho`, [by])
      const conLai = hien.filter((h) => !nhom.some((y) => y.ma_cau === h.ma_cau))
      const bg = (await q(`select * from hinh_hoc_bai_y where ma_bai_y = $1`, [by]))[0]
      let moi = by
      if (conLai.length === 0 && dich.length === 1) {
        await c.query(`update hinh_hoc_bai_y set dang_chinh = $2 where ma_bai_y = $1`, [by, T[d]])
      } else {
        moi = (await q(`insert into hinh_hoc_bai_y (dang_chinh, loi_dan, anh_de, thu_tu) values ($1,$2,$3,$4) returning ma_bai_y`, [T[d], bg.loi_dan, bg.anh_de, bg.thu_tu]))[0].ma_bai_y
        for (const y of nhom) await c.query(`update hinh_hoc_cau_hoi set bai_y = $2 where ma_cau = $1`, [y.ma_cau, moi])
      }
      for (const y of nhom) kq.push({ ma_cau: y.ma_cau, tu: bg.dang_chinh, den: T[d], loai: moi === by ? 'cả bài_y' : `ý ${y.nhan_y} → bài_y mới ${moi} (ý còn lại ở ${by})`, ly_do: MAP[y.ma_cau][1], nd_doi: false })
    }
  }
  // kiểm: đề ghép không đổi, dang_chinh đúng đích
  const sau = await q(`select ma_cau, dang_chinh, noi_dung, bai_y from hinh_hoc_cau_hoi where ma_cau = any($1)`, [ids])
  let loi = 0
  for (const s of sau) {
    const t = truoc.find((x) => x.ma_cau === s.ma_cau)
    if (s.dang_chinh !== T[MAP[s.ma_cau][0]]) { console.log('LỆCH dang_chinh', s.ma_cau, s.dang_chinh); loi++ }
    if (s.noi_dung !== t.noi_dung) { console.log('ĐỀ BỊ ĐỔI', s.ma_cau); loi++ }
  }
  // ý ở lại bài cũ không đổi dang_chinh
  const conLaiSai = await q(`select h.ma_cau, h.dang_chinh, y.dang_chinh dy from hinh_hoc_cau_hoi h join hinh_hoc_bai_y y on y.ma_bai_y = h.bai_y where h.bai_y = any($1) and h.dang_chinh <> y.dang_chinh`, [Object.keys(theoBaiY)])
  if (conLaiSai.length) { console.log('ý lệch dang_chinh với bài_y:', conLaiSai); loi++ }
  if (loi) throw new Error(`${loi} lỗi kiểm — ROLLBACK`)

  // chưa đụng: câu nhiều ý chưa tách mà có ý thẳng hàng
  const chua = await q(`select h.ma_cau, h.dang_chinh, h.da_duyet, h.noi_dung from hinh_hoc_cau_hoi h join hinh_hoc_bai b on b.ma_bai = h.dang_chinh where b.khoi = '7' and h.xoa_at is null and not h.rut_khoi_kho and h.bai_y is null and h.noi_dung ~* '(chứng minh|cmr|chứng tỏ)[^\\n]{0,200}thẳng hàng' and h.noi_dung ~ '(^|\\n)\\s*[a-e]\\) ' and h.ma_cau <> all($1)`, [ids])
  console.log(`\nĐã chuyển ${kq.length}: ${kq.filter((k) => k.loai === 'cả câu').length} câu đơn + ${kq.length - kq.filter((k) => k.loai === 'cả câu').length} ý`)
  const dem = {}; for (const k of kq) dem[k.den] = (dem[k.den] || 0) + 1
  console.log('Theo bài đích:', dem)
  console.log(`Chưa gán (không thuộc 3 phương pháp): ${Object.keys(KHAC).join(', ')}`)
  console.log(`Chưa đụng — câu nhiều ý chưa tách bài–ý có ý chứng minh thẳng hàng: ${chua.length} câu (${chua.filter((x) => !x.da_duyet).length} chưa duyệt)`)

  // HTML xem
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const lg = Object.fromEntries((await q(`select ma_cau, loi_giai, anh_de from hinh_hoc_cau_hoi where ma_cau = any($1)`, [ids])).map((r) => [r.ma_cau, r]))
  let h = `<!doctype html><meta charset=utf-8><title>Đẩy câu thẳng hàng K7</title><link rel=stylesheet href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"><script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script><script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}]})"></script>
<style>body{font:15px/1.6 system-ui;max-width:920px;margin:20px auto;padding:0 12px}h2{margin-top:30px;border-bottom:2px solid #36c}.b{border:1px solid #ccc;border-radius:8px;padding:10px 14px;margin:10px 0}.m{color:#555;font-size:12.5px}.t{background:#eef3ff;border-radius:4px;padding:1px 6px}pre{white-space:pre-wrap;font:inherit;margin:4px 0}img{max-height:200px}</style>
<h1>Câu thẳng hàng K7 → 3 bài (${GHI ? 'ĐÃ GHI' : 'NHÁP, chưa ghi'})</h1><p class=m>${kq.length} mục. Mỗi mục: đề ghép (đúng như app hiện) · cách chuyển · lý do · đuôi lời giải.</p>`
  for (const k of ['170', '171', '172']) {
    h += `<h2>${T[k]} — ${TEN[k]} (${dem[T[k]] || 0})</h2>`
    for (const x of kq.filter((z) => z.den === T[k])) {
      const r = cau.find((y) => y.ma_cau === x.ma_cau), l = lg[x.ma_cau]
      h += `<div class=b><div class=m><b>${x.ma_cau}</b> · từ ${x.tu} → <span class=t>${x.den}</span> · ${esc(x.loai)} · ${esc(x.ly_do)}</div><pre>${esc(r.noi_dung)}</pre>${l.anh_de ? `<img src="${l.anh_de}">` : ''}<details><summary class=m>đuôi lời giải</summary><pre>${esc((l.loi_giai || '').split('\n').slice(-9).join('\n'))}</pre></details></div>`
    }
  }
  h += `<h2>Chưa gán / chưa đụng</h2><p class=m>Không thuộc 3 phương pháp: ${Object.entries(KHAC).map(([a, b]) => `${a} (${esc(b)})`).join(' · ')}.</p><p class=m>Câu nhiều ý CHƯA tách bài–ý có ý thẳng hàng (${chua.length}) — cần tách bài–ý trước mới đưa ý thẳng hàng sang bài khác được:</p><pre>${esc(chua.map((x) => `${x.ma_cau} (${x.dang_chinh}${x.da_duyet ? '' : ', chưa duyệt'})`).join('\n'))}</pre>`
  writeFileSync('kho-rules/hinh/k7-thang-hang/day-thang-hang.html', h)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
