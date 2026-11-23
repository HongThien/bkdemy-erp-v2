// Hình–Học K8 · BÓC Ý các câu hình nhiều ý còn nằm nguyên một câu trong kho (Thùy 23/11: "mấy bài nữa chưa bóc ý … bóc luôn cho chuẩn đi").
// Luật bài–ý (spec-giai-bai "Tách ý — mô hình bài–ý", mig 202611091550): thẻ ý `hinh_hoc_bai_y` (lời dẫn = giả thiết chung KHÔNG chứa câu hỏi + hình chung) + mỗi ý một câu `hinh_hoc_cau_hoi`
//   (bai_y · nhan_y · cau_hoi_y · da_biet · lời giải RIÊNG); trigger ghép noi_dung / anh_de / dang_chinh. Câu gốc GIỮ (tài liệu / điểm cũ) và RÚT khỏi kho (rut_khoi_kho=true).
//   Ý sau dùng điểm dựng ở ý trước / kết quả ý trước ⇒ `da_biet` (bảng CONSTR tay + dòng "Biết … (ý x)" từ chỗ lời giải viện dẫn ý trước).
// KHÔNG làm: Đ/S, trắc nghiệm (5 câu) · sơ đồ tư duy (`hinh_hoc_cau_so_do`) KHÔNG chép sang ý (sơ đồ của ý phải viết lại theo ý) — gỡ dòng [[so-do:…]] khỏi lời giải ý; sơ đồ cũ vẫn ở câu gốc.
//   node scripts/kho/hh-k8-boc-y-cau-le.mjs                ⇒ chạy thử ROLLBACK, in từng ý
//   node scripts/kho/hh-k8-boc-y-cau-le.mjs --ghi          ⇒ commit (bản lùi: _luu-tru/du-lieu/hh-k8-boc-y-cau-le-23-11.json)
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const TEP_BIET = '_luu-tru/du-lieu/hh-k8-boc-y-da-biet-23-11.json'
const DA_BIET = fs.existsSync(TEP_BIET) ? JSON.parse(fs.readFileSync(TEP_BIET, 'utf8')) : null
const XUAT = []   // XUAT=<tệp.json> ⇒ xuất đề + lời giải từng ý để soát da_biet bằng mắt

const LOAI_TRU = new Set(['HHC002450', 'HHC014622', 'HHC014632', 'HHC019053', 'HHC002422'])   // Đ/S · trắc nghiệm
// Điểm / hình dựng ở một ý mà ý SAU dùng (nguyên văn câu dựng trong đề gốc). Khoá: mã câu gốc → nhãn ý → chuỗi.
const CONSTR = {
  HH00062080: { e: 'Trên tia đối của tia $DM$, lấy $Q$ sao cho $D$ là trung điểm của $MQ$.' },
  HHC019028: { c: 'Gọi $K$ là điểm đối xứng của $M$ qua $B$, nối $KN$ cắt $BC$ tại $F$.' },
  HHC019036: { c: 'Qua $A$ vẽ đường thẳng song song với $BC$, cắt tia $MN$ tại $D$.' },
  HHC019044: { c: 'Qua $A$ vẽ đường thẳng song song với $BC$, cắt tia $MN$ tại $D$.' },
  HHC019050: { c: 'Kẻ $DF\\perp AC$ ($F\\in AC$).' },
  HHC019052: { c: 'Qua $D$ kẻ đường thẳng song song với đường thẳng $AB$ cắt $AC$ tại $M$.' },
  HHC019056: { c: 'Gọi $M$, $N$ theo thứ tự là trung điểm của $BD$, $BC$.' },
  HHC019058: { c: 'Kẻ $BE$ vuông góc với tia $CD$ tại $E$.' },
  HHC019060: { c: 'Trên cạnh $BC$ lấy điểm $M$ sao cho $H$ là trung điểm của $BM$, đường thẳng qua $C$ vuông góc với tia $AM$ tại $K$ và cắt tia $AH$ tại $I$.' },
  HHC019068: { d: 'Lấy điểm $K$ sao cho $D$ là trung điểm của $HK$.' },
}
const CHUY_VAO = { HHC002480: 'a' }   // "Chú ý" ở Phần 1 chỉ gắn vào ý này
// Lời giải ý viết lại tay: HHC002480 ý b — lời giải gốc nhắc điểm phụ $F$ chỉ dựng trong lời giải ý a (không có trong đề) ⇒ bắt đầu từ $DE\parallel BC$ (da_biet "ý a").
const dongF = 'Theo câu a, $DF\\parallel BC$; mà $E$ thuộc $DF$ nên $DE\\parallel BC$.'
const LG_TAY = {
  HHC002480: {
    b: (p2) => {
      if (p2.split(dongF).length !== 2) throw new Error('HHC002480 ý b: không thấy dòng nhắc F')
      return `**Phần 1. Hướng dẫn**\n\n**Mấu chốt:** ý a đã cho $DE\\parallel BC$ (hai điểm $D$, $E$ là trung điểm của hai cạnh); ý b dùng "song song" để có hai góc đồng vị bằng nhau, rồi dùng tổng ba góc của tam giác.\n\n**Bước 1.** Từ $DE\\parallel BC$ (ý a), hai góc $\\widehat{ABC}$ và $\\widehat{ADE}$ là hai góc đồng vị nên bằng nhau.\n\n**Bước 2.** Tính $\\widehat{ACB}$ bằng tổng ba góc của $\\triangle ABC$, trong đó góc $A$ của tam giác chính là $\\widehat{DAE}$ và góc $B$ vừa tìm được.\n\n**Phần 2. Trình bày**\n\n${p2.replace(dongF, 'Theo câu a, $DE\\parallel BC$.')}`
    },
  },
}
const BIET_TAY = {}   // ghi đè tay: mã gốc → nhãn ý → da_biet (chuỗi, '' = không có)
const MOC = /^\s*([a-eA-E]|\d{1,2})[).]\s*/
const ABC = 'abcde'

function parseDe(nd) {
  const lines = nd.split('\n').map((s) => s.trim()).filter(Boolean)
  const stem = [], ys = []
  for (const l of lines) { const m = l.match(MOC); if (m) ys.push({ nhan: m[1].toLowerCase(), text: l.replace(MOC, '').trim() }); else if (ys.length) ys[ys.length - 1].text += ' ' + l; else stem.push(l) }
  return { stem: stem.join(' '), ys }
}
const boSoDo = (s) => s.split('\n').filter((l) => !/^\s*\[\[so-do:[^\]]*\]\]\s*$/.test(l)).join('\n').replace(/\n{3,}/g, '\n\n').trim()
// tiêu đề ý trong lời giải không đánh a) b): nhận diện theo từng dòng đầu khối (chỉ HH00061100)
const TIEUDE = { HH00061100: [/^Chứng minh MECB là hình bình hành/, /^Chứng minh AC, ME, BD đồng quy/] }

// tách lời giải theo ý → { p1: {matChot, buoc:[{tag:Set,text}], chuY}|null, p2: Map(nhan → text), coHead }
function tachLoiGiai(g, ys) {
  const lg = (g.loi_giai || '').trim()
  if (!lg) return { rong: true }
  const i2 = lg.search(/\*\*Phần 2\. Trình bày\*\*/)
  const coHead = i2 >= 0
  let p1txt = '', p2txt = lg
  if (coHead) { p1txt = lg.slice(0, i2); p2txt = lg.slice(i2).replace(/^\*\*Phần 2\. Trình bày\*\*\s*/, '') }
  else if (/\*\*Phần 1\./.test(lg)) throw new Error('có Phần 1 mà không có Phần 2')
  p2txt = boSoDo(p2txt)
  const blocks = new Map(); let cur = null
  const tieuDe = TIEUDE[g.ma_cau]
  for (const l of p2txt.split('\n')) {
    let nh = null
    if (tieuDe) { const k = tieuDe.findIndex((re) => re.test(l)); if (k >= 0 && !blocks.has(ABC[k])) nh = ABC[k] }
    else { const m = l.match(/^\s*([a-e])[).]\s*/); if (m && m[1] === ABC[blocks.size]) nh = m[1] }
    if (nh) { cur = nh; blocks.set(nh, []); const rest = tieuDe ? l : l.replace(/^\s*[a-e][).]\s*/, ''); if (rest.trim()) blocks.get(nh).push(rest) }
    else if (cur) blocks.get(cur).push(l)
    else if (l.trim()) throw new Error('có dòng Phần 2 trước ý a: ' + l.slice(0, 40))
  }
  const p2 = new Map([...blocks].map(([k, v]) => [k, v.join('\n').trim()]))
  if (p2.size !== ys.length || ys.some((y, i) => !p2.has(ABC[i]))) throw new Error(`Phần 2 tách được ${p2.size} khối / đề có ${ys.length} ý`)
  let p1 = null
  if (p1txt.trim()) {
    const body = p1txt.replace(/^\*\*Phần 1\. Hướng dẫn\*\*\s*/, '')
    const parts = body.split(/\n(?=\*\*(?:Mấu chốt|Bước \d+|Chú ý)[.:])/).map((s) => s.trim()).filter(Boolean)
    const matChot = parts.find((s) => s.startsWith('**Mấu chốt')); const chuY = parts.find((s) => s.startsWith('**Chú ý'))
    const buoc = []; let tagTruoc = null
    for (const s of parts.filter((x) => x.startsWith('**Bước'))) {
      const m = s.match(/^\*\*Bước \d+\.\*\*\s*Ý ([a-e])(?: và ([a-e]))?(?: \(tiếp\))?\s*:\s*/)
      let tag, text
      if (m) { tag = new Set([m[1], m[2]].filter(Boolean)); text = s.slice(m[0].length) } else { if (!tagTruoc) throw new Error('bước đầu không có thẻ ý'); tag = tagTruoc; text = s.replace(/^\*\*Bước \d+\.\*\*\s*/, '') }
      tagTruoc = tag; buoc.push({ tag, text })
    }
    if (!matChot || !buoc.length) throw new Error('Phần 1 không đủ Mấu chốt / Bước')
    p1 = { matChot, buoc, chuY }
  }
  return { p1, p2, coHead }
}
// ý x được lời giải ý k viện dẫn ("ý a", "câu b", "(cmt, ý a)") — chỉ ý đứng TRƯỚC
function vienDan(txt, k) { const out = new Set(); for (const m of txt.matchAll(/(?:ý|câu)\s*([a-e])\b/gi)) { const x = m[1].toLowerCase(); if (ABC.indexOf(x) < ABC.indexOf(k)) out.add(x) } return [...out] }
function ketLuan(text) {
  const m = [...text.matchAll(/Chứng minh\s*:?\s*/gi)]
  if (!m.length) return null
  const k = m[m.length - 1]; return text.slice(k.index + k[0].length).replace(/^rằng\s+/i, '').replace(/\.\s*$/, '').trim()
}
// Viện dẫn ngầm: dòng có "(cmt" nêu một khẳng định $…$ — nếu khẳng định đó KHÔNG xuất hiện trước đó trong chính khối ý này mà đã xuất hiện ở khối ý trước ⇒ ý này cần "Biết … (ý x)".
const chuan = (t) => t.replace(/\s+/g, '').replace(/\\[,;! ]/g, '')
const QH = /(=|\\parallel|\\perp|\\sim|\\backsim|\\widehat|\\triangle)/
function vienDanNgam(p2, k) {
  const idx = ABC.indexOf(k); const kq = []; const khongTruy = []
  const khoi = ABC.slice(0, idx + 1).split('').map((x) => p2.get(x))
  const dau = []   // dòng đã duyệt trong khối hiện tại
  for (const line of khoi[idx].split('\n')) {
    const i = line.search(/cmt/i)
    if (i >= 0) {
      const truoc = line.slice(0, i); const toan = [...truoc.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]).filter((m) => QH.test(m))
      for (const t of toan) {
        const n = chuan(t)
        if (dau.some((d) => chuan(d).includes(n))) continue
        let tim = -1
        for (let j = 0; j < idx; j++) if (chuan(khoi[j]).includes(n)) { tim = j; break }
        if (tim >= 0) kq.push({ x: ABC[tim], t }); else khongTruy.push(t)
      }
    }
    dau.push(line)
  }
  return { kq, khongTruy }
}

await c.query('begin')
try {
  await c.query(`select set_config('kho.duyet_noi_dung', 'on', true)`)   // duyệt ĐỀ (nội dung) ở dạng chờ được phép — giữ nguyên trạng thái duyệt của câu gốc
  const goc = await q(`select c.* from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh where c.xoa_at is null and b.khoi = '8' and c.bai_y is null and not c.rut_khoi_kho and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null) and c.loai_cau in ('tu_luan','tra_loi_ngan') order by c.ma_cau`)
  const lui = [], bo = []
  for (const g of goc) {
    if (LOAI_TRU.has(g.ma_cau)) continue
    const { stem, ys } = parseDe(g.noi_dung)
    if (ys.length < 2) continue
    if (!stem) { bo.push(`${g.ma_cau}: không có lời dẫn`); continue }
    if (ys.some((y, i) => y.nhan !== ABC[i])) { bo.push(`${g.ma_cau}: nhãn ý không a,b,c…`); continue }
    let lg
    try { lg = tachLoiGiai(g, ys) } catch (e) { bo.push(`${g.ma_cau}: ${e.message}`); continue }
    const ydu = []
    for (let i = 0; i < ys.length; i++) {
      const k = ys[i].nhan; let ldg = null
      if (!lg.rong) {
        const p2 = lg.p2.get(k)
        if (lg.p1) {
          const b = lg.p1.buoc.filter((x) => x.tag.has(k)).map((x, j) => `**Bước ${j + 1}.** ${x.text}`)
          if (!b.length) throw new Error(`${g.ma_cau} ý ${k}: Phần 1 không có bước nào gắn ý này`)
          ldg = `**Phần 1. Hướng dẫn**\n\n${lg.p1.matChot}\n\n${b.join('\n\n')}${lg.p1.chuY && CHUY_VAO[g.ma_cau] === k ? '\n\n' + lg.p1.chuY : ''}\n\n**Phần 2. Trình bày**\n\n${p2}`
        } else ldg = lg.coHead ? `**Phần 2. Trình bày**\n\n${p2}` : p2
      }
      const biet = []
      if (CONSTR[g.ma_cau]?.[k]) biet.push(CONSTR[g.ma_cau][k])
      let sua = false
      if (ldg && LG_TAY[g.ma_cau]?.[k]) { ldg = LG_TAY[g.ma_cau][k](lg.p2.get(k)); sua = true }
      let tt = ''
      if (!lg.rong) {
        for (const x of vienDan(lg.p2.get(k), k)) { const kl = ketLuan(ys[ABC.indexOf(x)].text); if (kl) biet.push(`Biết ${kl} (ý ${x}).`) }
        const { kq, khongTruy } = vienDanNgam(lg.p2, k)
        for (const e of kq) { if (!biet.some((b) => chuan(b).includes(chuan(e.t)))) biet.push(`Biết $${e.t}$ (ý ${e.x}).`) }
        if (khongTruy.length) tt = 'KHÔNG TRUY ĐƯỢC: ' + khongTruy.map((t) => `$${t}$`).join(' ; ')
      }
      // Bảng da_biet đã soát tay (agent soát + Claude kiểm) THẮNG heuristic: có tệp ⇒ ý nào không ghi trong tệp = không có da_biet
      if (DA_BIET) { biet.length = 0; if (DA_BIET[g.ma_cau]?.[k]) biet.push(DA_BIET[g.ma_cau][k]) }
      if (BIET_TAY[g.ma_cau]?.[k] !== undefined) { biet.length = 0; if (BIET_TAY[g.ma_cau][k]) biet.push(BIET_TAY[g.ma_cau][k]) }
      ydu.push({ nhan: k, cau_hoi_y: ys[i].text, da_biet: biet.join(' ') || null, loi_giai: ldg, tt, sua })
    }
    const chuY = lg.p1?.chuY && !CHUY_VAO[g.ma_cau] ? 'CÓ "Chú ý" ở Phần 1 chưa gắn vào ý nào' : ''
    console.log(`\n=== ${g.ma_cau} (${g.dang_chinh}) · ${ys.length} ý · da_duyet=${g.da_duyet} · ${lg.rong ? 'KHÔNG có lời giải' : ''} ${chuY}\n  lời dẫn: ${stem}`)
    for (const y of ydu) console.log(`  [${y.nhan}] ${y.cau_hoi_y.slice(0, 90)}\n      da_biet: ${y.da_biet ?? '—'}${y.tt ? '\n      ⚠ ' + y.tt : ''}\n      lg: ${y.loi_giai ? y.loi_giai.replace(/\s+/g, ' ').slice(0, 110) : '(trống)'}`)
    const [the] = await q(`insert into hinh_hoc_bai_y (dang_chinh, loi_dan, anh_de, ma_cau_goc, thu_tu) values ($1,$2,$3,$4,1) returning ma_bai_y`, [g.dang_chinh, stem, g.anh_de ?? g.anh_dap_an, g.ma_cau])
    if (process.env.XUAT) { XUAT.push({ ma_cau: g.ma_cau, loi_dan: stem, y: ydu.map((y, i) => ({ nhan: y.nhan, cau_hoi_y: y.cau_hoi_y, constr: CONSTR[g.ma_cau]?.[y.nhan] ?? null, loi_giai_phan2: lg.rong ? null : lg.p2.get(y.nhan) })) }) }
    const maY = []
    for (const y of ydu) {
      const [r] = await q(`insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, loai_cau, bai_y, nhan_y, cau_hoi_y, da_biet, loi_giai, anh_dap_an, nguon, nguon_giai, da_duyet, duyet_at, duyet_nguon, duyet_boi, kiem_may, kiem_may_boi, kiem_may_ghi, kiem_may_at, thu_tu)
        values ($1,'','tu_luan',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,1) returning ma_cau`,
        [g.dang_chinh, the.ma_bai_y, y.nhan, y.cau_hoi_y, y.da_biet, y.loi_giai, g.anh_dap_an, g.nguon, g.nguon_giai, g.da_duyet && !y.sua, g.da_duyet && !y.sua ? g.duyet_at : null, g.da_duyet && !y.sua ? g.duyet_nguon : null, g.da_duyet && !y.sua ? g.duyet_boi : null, g.kiem_may, g.kiem_may_boi, g.kiem_may_ghi, g.kiem_may_at])
      maY.push(r.ma_cau)
    }
    await q(`update hinh_hoc_cau_hoi set rut_khoi_kho = true where ma_cau = $1`, [g.ma_cau])
    lui.push({ goc: g.ma_cau, the: the.ma_bai_y, y: maY })
  }
  if (process.env.XUAT) fs.writeFileSync(process.env.XUAT, JSON.stringify(XUAT, null, 1))
  console.log('\nBỎ QUA / CHƯA LÀM:'); bo.forEach((x) => console.log('  ' + x))
  const kt = await q(`select count(*) n, count(*) filter (where c.noi_dung = '') rong, count(*) filter (where c.kho_chuan) chuan from hinh_hoc_cau_hoi c where c.ma_cau = any($1)`, [lui.flatMap((x) => x.y)])
  console.log('\nđọc lại ý mới:', kt[0], '· câu gốc đã bóc:', lui.length)
  if (+kt[0].rong) throw new Error('ý có noi_dung rỗng — trigger ghép không chạy')
  if (GHI) { fs.writeFileSync('_luu-tru/du-lieu/hh-k8-boc-y-cau-le-23-11.json', JSON.stringify(lui, null, 1)); await c.query('commit'); console.log('ĐÃ GHI (commit)') }
  else { await c.query('rollback'); console.log('(chạy thử — ROLLBACK)') }
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
