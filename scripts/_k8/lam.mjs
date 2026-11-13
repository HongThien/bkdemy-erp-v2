// MCQ lớp 8–9: Hình giải tích (hgt) + Hình học (hinh_hoc), độ khó dạng 1–3. mcq-sinh.mjs chưa nối 2 bảng này
// (parseHuuTi không đọc phương án có căn / π / đơn vị) ⇒ script riêng, GIỮ NGUYÊN các cổng của mcq-sinh:
//   • đáp số kho (đọc lại từ DB) = nhân chứng độc lập; phương án đúng phải trùng giá trị kho, sai ⇒ bỏ câu, không đoán;
//   • 4 phương án khác nhau theo GIÁ TRỊ; 3 nhiễu = 3 rule khác nhau có trong bảng rule của nhánh, ≤1 dự phòng, duong_sai ≥ 8 ký tự;
//   • phân bố vị trí đúng A–D không lệch >40% (khi ≥8 câu / nhánh).
// Mọi giá trị nhiễu TÍNH LẠI bằng công thức sai tương ứng, không gõ tay số.
// Dùng: node scripts/_k8/lam.mjs            (chạy khô)   |   node scripts/_k8/lam.mjs --ghi   (ghi, da_duyet=false)
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')] }))
const GHI = process.argv.includes('--ghi')
const R = (d) => (d * Math.PI) / 180, D = (r) => (r * 180) / Math.PI
const sin = (d) => Math.sin(R(d)), cos = (d) => Math.cos(R(d)), tan = (d) => Math.tan(R(d)), cot = (d) => 1 / tan(d)
const vn = (v, nd = 0) => { const s = (Math.round(v * 10 ** nd) / 10 ** nd).toFixed(nd); return s.replace('.', '{,}') } // số kiểu VN trong $...$
const lam = (v, nd = 0) => Math.round(v * 10 ** nd) / 10 ** nd
const n0 = (x) => (Math.abs(x) < 1e-9 ? 0 : x)

// o(text, val, rule, duong_sai) — phương án; dung không có rule
const o = (text, val, rule, duong_sai) => ({ text, val, rule, duong_sai })
const items = []
const add = (kho, ma, dung, ds) => items.push({ kho, ma, dung, ds })
const I = (v) => String.raw`$${vn(n0(v), 0)}$`
const I1 = (v) => String.raw`$${vn(v, 1)}$`

// ---------------- HGT (T309…) ----------------
{
  const S1 = sin(30) ** 2 + sin(60) ** 2, S2 = sin(40) ** 2 + sin(50) ** 2
  add('hgt', 'T309000000005', o(I(n0(S1 - S2)), n0(lam(S1 - S2, 9))), [
    o(I(S1 + S2), lam(S1 + S2, 9), 'R600', 'cộng cả hai nhóm thay vì giữ dấu trừ ở nhóm sau nên được 1 + 1'),
    o(I(S1), lam(S1, 9), 'R601', 'chỉ rút gọn nhóm sin²30° + sin²60° rồi dừng, bỏ nhóm còn lại'),
    o(I(-S2), lam(-S2, 9), 'R602', 'chỉ rút gọn nhóm đứng sau dấu trừ, bỏ nhóm đầu'),
  ])
  const c = tan(45) * cot(30) * cot(30)
  add('hgt', 'T309000000006', o(I(c), lam(c, 9)), [
    o(String.raw`$\sqrt{3}$`, lam(tan(45) * cot(30), 9), 'R603', 'bỏ sót một thừa số cot30° khi nhân'),
    o(String.raw`$\dfrac{1}{3}$`, lam(tan(45) * tan(30) * tan(30), 9), 'R604', 'lấy cot30° = 1/√3 (giá trị của tan30°) nên được 1/3'),
    o(String.raw`$3\sqrt{3}$`, lam(tan(45) * cot(30) ** 3, 9), 'R614', 'nhân thừa thêm một thừa số cot30°'),
  ])
  const h = cos(42) ** 2 * sin(30) + sin(42) ** 2 * cos(60)
  add('hgt', 'T309000000025', o(String.raw`$${vn(h, 1)}$`, lam(h, 9)), [
    o(I(cos(42) ** 2 + sin(42) ** 2), lam(cos(42) ** 2 + sin(42) ** 2, 9), 'R608', 'rút gọn sin²+cos²=1 nhưng quên nhân hệ số chung 1/2'),
    o(String.raw`$\dfrac{\sqrt{3}}{2}$`, lam((cos(42) ** 2 + sin(42) ** 2) * (Math.sqrt(3) / 2), 9), 'R607', 'lấy sin30° = cos60° = √3/2 thay vì 1/2'),
    o(String.raw`$${vn(0.5 * 0.5, 2)}$`, lam(0.25, 9), 'R609', 'nhân hệ số chung 1/2 hai lần nên được 1/4'),
  ])
  const k = [[10, 80], [35, 55], [30, 60]].map(([a, b]) => cos(a) ** 2 + cos(b) ** 2)
  const tong = k.reduce((s, x) => s + x, 0)
  add('hgt', 'T309000000026', o(I(tong), lam(tong, 9)), [
    o(I(k[0] + k[1]), lam(k[0] + k[1], 9), 'R615', 'chỉ ghép được 2 cặp góc phụ, bỏ sót cặp cos²30° + cos²60°'),
    o(I(k.length * 2), 6, 'R610', 'coi mỗi cặp cos²α + cos²(90°−α) bằng 2 nên được 6'),
    o(String.raw`$${vn(k.length * 0.5, 1)}$`, 1.5, 'R612', 'coi mỗi cặp góc phụ bằng 1/2 nên được 3/2'),
  ])
  const A = D(Math.acos(1.5 / 4))
  add('hgt', 'T309000000012', o(I(lam(A)), lam(A)), [
    o(I(lam(90 - lam(A))), lam(90 - lam(A)), 'R606', 'trả lời góc phụ (90° − 68°) thay vì góc giữa thang và mặt đất'),
    o(I(lam(D(Math.atan(1.5 / 4)))), lam(D(Math.atan(1.5 / 4))), 'R617', 'dùng tan = BH/AB thay cho cos = BH/AB'),
    o(I(lam(D(Math.atan(4 / 1.5)))), lam(D(Math.atan(4 / 1.5))), 'R611', 'đảo tỉ số: tan = AB/BH'),
  ])
  const H = 12 * tan(68)
  add('hgt', 'T309000000019', o(I1(H), lam(H, 1)), [
    o(I1(12 / tan(68)), lam(12 / tan(68), 1), 'R611', 'chia cho tan68° thay vì nhân'),
    o(I1(12 * sin(68)), lam(12 * sin(68), 1), 'R605', 'dùng sin68° thay cho tan68°'),
    o(I1(12 * cos(68)), lam(12 * cos(68), 1), 'R616', 'dùng cos68° thay cho tan68°'),
  ])
  const G = D(Math.atan(30 / 40))
  add('hgt', 'T309000000020', o(I(lam(G)), lam(G)), [
    o(I(lam(90 - G)), lam(90 - G), 'R606', 'trả lời góc phụ (90° − góc nắng) thay vì góc nắng'),
    o(I(lam(D(Math.asin(30 / 40)))), lam(D(Math.asin(30 / 40))), 'R605', 'dùng sin = 30/40 thay cho tan = 30/40'),
    o(I(lam(D(Math.acos(30 / 40)))), lam(D(Math.acos(30 / 40))), 'R616', 'dùng cos = 30/40 thay cho tan = 30/40'),
  ])
  const K = 66 / tan(25)
  add('hgt', 'T309000000022', o(I(lam(K)), lam(K)), [
    o(I(lam(66 * tan(25))), lam(66 * tan(25)), 'R611', 'nhân với tan25° thay vì chia'),
    o(I(lam(66 / sin(25))), lam(66 / sin(25)), 'R605', 'dùng sin25° thay cho tan25°'),
    o(I(lam(66 / cos(25))), lam(66 / cos(25)), 'R616', 'dùng cos25° thay cho tan25°'),
  ])
  const d1 = 100 / tan(30), d2 = 100 / tan(60), v = (d1 - d2) / 6
  add('hgt', 'T309000000023', o(I(lam(d2 / v)), lam(d2 / v)), [
    o(I(lam(d1 / v)), lam(d1 / v), 'R619', 'tính thời gian đi hết cả quãng từ lần nhìn đầu (6 + 3 phút)'),
    o(I(6), 6, 'R618', 'lấy luôn 6 phút đề cho làm đáp số'),
    o(I(lam(6 * d2 / d1)), lam(6 * d2 / d1), 'R621', 'lấy 6 phút nhân tỉ lệ quãng đường sau/đầu thay vì chia cho quãng đã đi'),
  ])
}

// ---------------- Hình học (HH00109 — hai tiếp tuyến cắt nhau) ----------------
{
  const x = (8 + 4) / (7 - 3)
  add('hinh_hoc', 'HHC002146', o(String.raw`$x=${vn(x)}$`, x), [
    o(String.raw`$x=${vn((8 - 4) / (7 - 3))}$`, (8 - 4) / (7 - 3), 'R632', 'chuyển vế không đổi dấu hạng tử tự do: 7x + 4 = 3x + 8'),
    o(String.raw`$x=${vn(7 * x - 4)}$`, 7 * x - 4, 'R631', 'giải đúng x = 3 nhưng thay vào 7x − 4 và trả lời độ dài AB'),
    o(String.raw`$x=${vn((8 + 4) / (7 + 3), 1)}$`, (8 + 4) / (7 + 3), 'R633', 'cộng hệ số của x (7 + 3) thay vì trừ (7 − 3)'),
  ])
  const m = 180 - 130
  add('hinh_hoc', 'HHC002147', o(String.raw`$${m}^\circ$`, m), [
    o(String.raw`$130^\circ$`, 130, 'R634', 'coi góc giữa hai tiếp tuyến bằng góc ở tâm COB'),
    o(String.raw`$${130 / 2}^\circ$`, 65, 'R635', 'lấy một nửa góc ở tâm (như góc nội tiếp) làm kết quả'),
    o(String.raw`$${m / 2}^\circ$`, 25, 'R637', 'chỉ tính góc OMB (một nửa góc CMB)'),
  ])
  const cv = 2 * (6 + 3 + 8)
  add('hinh_hoc', 'HHC002148', o(String.raw`$${cv}$ cm`, cv), [
    o(String.raw`$${cv / 2}$ cm`, cv / 2, 'R638', 'dừng ở nửa chu vi AM + BP + CE, quên nhân 2'),
    o(String.raw`$${cv * 2}$ cm`, cv * 2, 'R639', 'nhân thừa 2 ở bước cuối nên gấp đôi chu vi'),
    o(String.raw`$${2 * (6 + 8)}$ cm`, 2 * (6 + 8), 'R640', 'bỏ sót tiếp tuyến BP khi cộng, chỉ tính 2(AM + CE)'),
  ])
  const p3 = 2 * (6 / 2)
  add('hinh_hoc', 'HHC002153', o(String.raw`$${p3}$ cm`, p3), [
    o(String.raw`$${3 * 6}$ cm`, 18, 'R641', 'trả lời chu vi tam giác ABC thay vì chu vi tam giác AEF'),
    o(String.raw`$${p3 / 2}$ cm`, p3 / 2, 'R638', 'lấy AM = 3 cm (một nửa chu vi AEF), quên nhân 2'),
    o(String.raw`$${p3 * 2}$ cm`, p3 * 2, 'R639', 'nhân thừa 2 nên gấp đôi chu vi'),
  ])
  const MN = Math.sqrt(10 ** 2 - 6 ** 2), p4 = 2 * MN
  add('hinh_hoc', 'HHC002158', o(String.raw`$${vn(p4)}$ cm`, p4), [
    o(String.raw`$${vn(MN)}$ cm`, MN, 'R638', 'lấy MN = 8 cm (một nửa chu vi), quên nhân 2'),
    o(String.raw`$${vn(p4 * 2)}$ cm`, p4 * 2, 'R639', 'nhân thừa 2 nên gấp đôi chu vi'),
    o(String.raw`$${vn(2 * 10)}$ cm`, 20, 'R642', 'dùng MO = 10 cm thay cho độ dài tiếp tuyến MN'),
  ])
  const MA = 25 / tan(30)
  add('hinh_hoc', 'HHC003252', o(I(lam(MA)), lam(MA)), [
    o(I(lam(25 / sin(30))), lam(25 / sin(30)), 'R605', 'dùng sin30° thay cho tan30° (được đoạn MO)'),
    o(I(lam(25 / cos(30))), lam(25 / cos(30)), 'R616', 'dùng cos30° thay cho tan30°'),
    o(I(lam(25 * tan(30))), lam(25 * tan(30)), 'R611', 'nhân với tan30° thay vì chia'),
  ])
  const AB = Math.sqrt(25 - 9), BC = (2 * 3 * AB) / 5
  add('hinh_hoc', 'HHC011490', o(String.raw`$${vn(BC, 1)}$`, lam(BC, 1)), [
    o(String.raw`$${vn(BC / 2, 1)}$`, lam(BC / 2, 1), 'R638', 'lấy BH (một nửa dây BC), quên nhân 2'),
    o(String.raw`$${vn(AB)}$`, AB, 'R644', 'trả lời độ dài tiếp tuyến AB thay cho dây BC'),
    o(String.raw`$${vn(BC * 2, 1)}$`, lam(BC * 2, 1), 'R639', 'nhân thừa 2 nên gấp đôi BC'),
  ])
  const BD = Math.sqrt(36 - BC * BC)
  add('hinh_hoc', 'HHC011491', o(String.raw`$${vn(BD, 1)}$`, lam(BD, 1)), [
    o(String.raw`$${vn(BD / 2, 1)}$`, lam(BD / 2, 1), 'R638', 'lấy OH (một nửa BD), quên nhân 2'),
    o(String.raw`$${vn(BC, 1)}$`, lam(BC, 1), 'R644', 'trả lời độ dài BC thay cho BD'),
    o(String.raw`$${vn(6)}$`, 6, 'R645', 'trả lời đường kính CD thay cho BD'),
  ])
  const B = 2 * D(Math.acos(3 / 5))
  add('hinh_hoc', 'HHC011492', o(I(lam(B)), lam(B)), [
    o(I(lam(B / 2)), lam(B / 2), 'R638', 'chỉ tính góc BOA (một nửa BOC)'),
    o(I(lam(2 * D(Math.asin(3 / 5)))), lam(2 * D(Math.asin(3 / 5))), 'R605', 'dùng sin = OB/OA thay cho cos = OB/OA'),
    o(I(180 - lam(B / 2)), 180 - lam(B / 2), 'R646', 'trả lời góc kề bù 180° − 53°'),
  ])
  const dd = 20 / sin(30)
  add('hinh_hoc', 'HHC011562', o(I(dd), dd), [
    o(I(dd / 2), dd / 2, 'R638', 'lấy bán kính 20 cm (một nửa khoảng cách), quên nhân 2'),
    o(I(dd * 2), dd * 2, 'R639', 'nhân thừa 2 nên gấp đôi khoảng cách'),
    o(String.raw`$${vn(20 / tan(30), 1)}$`, lam(20 / tan(30), 1), 'R644', 'tính khoảng cách từ tiếp điểm đến góc tường (dùng tan30°)'),
  ])
  // HHC002027: dây curoa; a = 1. OO' = 6a, MN = √(OO'² − (R−r)²)
  const Rr = 4, r = 1, OO = Rr / sin(30) - r / sin(30), tt = Math.sqrt(OO * OO - (Rr - r) ** 2)
  const goc = 180 - 60 // góc MOP của (O) = 120°; cung lớn 240°
  const arc = (rad, deg) => (2 * Math.PI * rad * deg) / 360
  const tong = 2 * tt + arc(Rr, 360 - goc) + arc(r, goc)
  add('hinh_hoc', 'HHC002027', o(String.raw`$6a(\pi+\sqrt{3})$`, lam(tong, 9)), [
    o(String.raw`$a\left(\dfrac{10\pi}{3}+6\sqrt{3}\right)$`, lam(2 * tt + arc(Rr, goc) + arc(r, goc), 9), 'R647', 'dùng cung nhỏ MP (120°) thay cho cung lớn MP (240°) của (O)'),
    o(String.raw`$3a(2\pi+\sqrt{3})$`, lam(tt + arc(Rr, 360 - goc) + arc(r, goc), 9), 'R640', 'chỉ cộng một đoạn tiếp tuyến chung MN, bỏ sót PQ'),
    o(String.raw`$a\left(\dfrac{20\pi}{3}+6\sqrt{3}\right)$`, lam(2 * tt + arc(Rr, 360 - goc) + arc(r, 360 - goc), 9), 'R648', 'dùng cung lớn (240°) cho cả (O′) thay vì cung nhỏ NQ (120°)'),
  ])
}

// ---------------- đọc đáp số kho → số ----------------
function khoSo(ma, s) {
  if (ma === 'HHC002027') return s.replace(/[\s{}]/g, '') === String.raw`$6a(\pi+\sqrt3)$` ? lam(2 * Math.sqrt(36 - 9) + (2 * Math.PI * 4 * 240) / 360 + (2 * Math.PI * 1 * 120) / 360, 9) : null
  const t = s.replace(/\$/g, '').replace(/\\circ|\^|cm|\\text\{[^}]*\}|x\s*=/g, '').replace(/\{,\}/g, '.').replace(/\s/g, '').replace(',', '.')
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null
}

const c = new pg.Client({ connectionString: GHI ? env.DATABASE_URL : (env.DATABASE_URL_RO ?? env.DATABASE_URL) })
await c.connect()
const TBL = { hgt: ['hgt_cau_hoi', 'hgt_cau_form_tn', 'hgt_mcq_rule'], hinh_hoc: ['hinh_hoc_cau_hoi', 'hinh_hoc_cau_form_tn', 'hinh_hoc_mcq_rule'] }
const rules = {}
for (const k of Object.keys(TBL)) rules[k] = new Map((await c.query(`select ma, du_phong from ${TBL[k][2]} where active`)).rows.map((r) => [r.ma, r]))
const POS = { hgt: [1, 2, 0, 3, 2, 0, 3, 1, 1], hinh_hoc: [2, 3, 0, 1, 3, 0, 1, 2, 3, 0, 1] }
const dem = { hgt: 0, hinh_hoc: 0 }, phan = { hgt: [0, 0, 0, 0], hinh_hoc: [0, 0, 0, 0] }
const ok = [], fail = []
for (const it of items) {
  const [cauT, formT] = TBL[it.kho], err = []
  const row = (await c.query(`select dap_an, lua_chon, menh_de, xoa_at, (select count(*)::int from ${formT} f where f.ma_cau = q.ma_cau and f.xoa_at is null) co_form from ${cauT} q where ma_cau = $1`, [it.ma])).rows[0]
  if (!row || row.xoa_at || row.lua_chon || row.menh_de) { fail.push([it.ma, 'không phải câu tự luận/trả lời ngắn còn sống']); continue }
  if (row.co_form) { fail.push([it.ma, 'đã có form']); continue }
  const kv = khoSo(it.ma, row.dap_an)
  if (kv == null) { fail.push([it.ma, `đáp số kho không đọc được: ${row.dap_an}`]); continue }
  if (Math.abs(kv - it.dung.val) > 1e-6) { fail.push([it.ma, `MÁY ${it.dung.val} ≠ KHO ${kv} (${row.dap_an})`]); continue }
  const vals = [it.dung.val, ...it.ds.map((d) => d.val)], txts = [it.dung.text, ...it.ds.map((d) => d.text)]
  if (new Set(vals.map((v) => lam(v, 6))).size !== 4) err.push(`giá trị trùng nhau: ${vals.join(' / ')}`)
  if (new Set(txts).size !== 4) err.push('text trùng')
  const rs = it.ds.map((d) => d.rule)
  rs.forEach((r) => { if (!rules[it.kho].has(r)) err.push(`rule ${r} không có ở ${TBL[it.kho][2]}`) })
  if (new Set(rs).size !== 3) err.push(`3 nhiễu phải 3 rule khác nhau (${rs})`)
  if (rs.filter((r) => rules[it.kho].get(r)?.du_phong).length > 1) err.push('quá 1 rule dự phòng')
  it.ds.forEach((d) => { if ((d.duong_sai ?? '').length < 8) err.push(`thiếu duong_sai ${d.rule}`) })
  if (err.length) { fail.push([it.ma, err.join('; ')]); continue }
  const k = POS[it.kho][dem[it.kho]++ % POS[it.kho].length]
  const lc = it.ds.map((d) => ({ text: d.text, dung: false, rule: d.rule, duong_sai: d.duong_sai }))
  lc.splice(k, 0, { text: it.dung.text, dung: true })
  phan[it.kho][k]++
  ok.push({ ...it, lua_chon: lc, dap_an: 'ABCD'[k], key: String(lam(it.dung.val, 9)) })
}
for (const k of Object.keys(phan)) { const t = phan[k].reduce((a, b) => a + b, 0), mx = Math.max(...phan[k]); console.log(k, 'phân bố đúng A–D', phan[k].join('/'), t >= 8 && mx / t > 0.4 ? '⚠ LỆCH' : 'ok') }
for (const [ma, e] of fail) console.log('BỎ/FAIL', ma, e)
console.log(`${ok.length} OK · ${fail.length} bỏ/fail`)
for (const x of ok) console.log(`OK ${x.ma} đúng=${x.dap_an}  ` + x.lua_chon.map((l) => (l.dung ? '[' + l.text + ']' : l.text + '(' + l.rule + ')')).join('  '))
if (GHI) {
  if (fail.length) { console.error('✖ có câu fail — sửa rồi chạy lại, KHÔNG ghi'); process.exit(1) }
  let n = 0
  for (const x of ok) {
    const formT = TBL[x.kho][1]
    await c.query('begin')
    try {
      const r = await c.query(`insert into ${formT} (ma_cau, lua_chon, dap_an, key_gia_tri, nguon, ai_model) select $1, $2::jsonb, $3, $4, 'ai', 'claude-sonnet-5-5' where not exists (select 1 from ${formT} f where f.ma_cau = $1 and f.xoa_at is null)`, [x.ma, JSON.stringify(x.lua_chon), x.dap_an, x.key])
      await c.query('commit'); n += r.rowCount
    } catch (e) { await c.query('rollback'); console.error('✖', x.ma, e.message); process.exitCode = 1 }
  }
  console.log(`Đã ghi ${n} form (da_duyet=false)`)
}
await c.end()
