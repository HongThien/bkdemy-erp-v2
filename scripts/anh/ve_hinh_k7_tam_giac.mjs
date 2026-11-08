// ve_hinh_k7_tam_giac.mjs — hình cho TỪNG GIẢ THIẾT của 5 mô hình Hình–Luyện K7 "Tam giác bằng nhau" (bản đồ mới, NCD00210):
// MH.126 Phân giác trong tam giác vuông · MH.130 Phân giác trong tam giác nhọn · MH.131 Tam giác cụng đầu · MH.132 Tam giác cân · MH.133 Hai trung điểm.
//   node scripts/anh/ve_hinh_k7_tam_giac.mjs <thu_muc_ra>       → <ra>/<MÃ GỐC>.png và <ra>/<MÃ GỐC>__<khoá nhánh>.png
//   node scripts/anh/ve_hinh_k7_tam_giac.mjs <ra> --doi-ten      → đổi tên khoá nhánh thành mã giả thiết thật trong DB (khớp theo mô hình gốc + tên nhánh), rồi:
//   node --env-file=.env scripts/anh/gan_hinh.mjs <ra> --bang mohinh [--ghi]
// Dựng bằng chuỗi hl-chuoi-k7-tam-giac.mjs (07/11). Hình một nhánh CỘNG DỒN giả thiết trên đường gốc → nhánh; chỉ vẽ dữ kiện (góc vuông, gạch bằng nhau,
// góc bằng nhau = phân giác), KHÔNG vẽ sẵn điều cần chứng minh. Hướng (Thùy 23/10): vuông tại A ⇒ A góc dưới trái, AB đứng, AC ngang.
import { P, seg, tick, angleMark, rightAngle, dot, labelOut, mid, foot, doiXung, inter, add, mul, lerp, dist, hinh, xuatTat } from './ve_hinh_lib.mjs'
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
import { readFileSync, readdirSync, renameSync, existsSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_hinh_k7_tam_giac.mjs <thu_muc_ra> [--doi-ten]'); process.exit(2) }

// ── tên nhánh theo ĐÚNG thứ tự tạo trong hl-chuoi-k7-tam-giac.mjs (dùng để đổi tên khoá → mã thật) ──
const NHANH = {
  'MH.126': [['N1', 'E trên BC, BE = BA'], ['N1a', 'F trên tia đối AB, AF = CE'], ['N2', 'DE ⊥ BC'], ['N2a', 'BA cắt ED tại Q'], ['N2b', 'M là trung điểm QC']],
  'MH.130': [['N1', 'O = AI ∩ BK'], ['N2', 'E = AB ∩ KI'], ['N3', 'H là trung điểm EC']],
  'MH.131': [['N1', 'MI ⊥ AC, MK ⊥ BD'], ['N2', 'AH ⊥ BC, DK ⊥ BC'], ['N3', 'I trung điểm AC, I trung điểm BE'], ['N4', 'E trên tia đối CD, CE = CD'], ['N4a', 'F là trung điểm AC'], ['N5', 'Tam giác ABC vuông tại A'], ['N6', 'N trung điểm AB, K đối xứng C qua N'], ['N7', 'CE ⊥ BD, BF ⊥ AC']],
  'MH.132': [['Na', 'DM ⊥ AB, AN = AM'], ['Na1', 'K trung điểm CN, E đối xứng D qua K'], ['Nb', 'DE ⊥ AB, DF ⊥ AC'], ['Nb1', 'I là trung điểm EF'], ['Nb2', 'K = AD ∩ EF'], ['Nb3', 'Qua C kẻ đường song song AD'], ['Nd', 'P bất kì trên AD'], ['Ne', 'AH = AK, I = HK ∩ AD'], ['Nf', 'E, F trên hai tia đối, BE = CF'], ['Ng', 'Cx ⊥ BC, Ay ∥ BC'], ['Ng1', 'I trung điểm AC, K = Ay ∩ Cx'], ['Nh', 'P, Q trung điểm AC, AB'], ['Nh1', 'M, N đối xứng B, C qua P, Q'], ['Nh2', 'G = BP ∩ CQ']],
  'MH.133': [],
}

if (process.argv.includes('--doi-ten')) {
  const pg = createRequire(process.cwd() + '/')('pg')
  const env = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? env }); await c.connect()
  const bang = []
  for (const [mh, ds] of Object.entries(NHANH)) {
    if (!ds.length) continue
    const goc = (await c.query(`select id from hinh_mo_hinh where ma = $1 and khoi = '7' and phan = 'luyen' and la_mo_hinh`, [mh])).rows[0].id
    const con = (await c.query(`with recursive cay(id) as (select ch.mo_hinh_id from hinh_mo_hinh_cha ch where ch.cha_id = $1 union all select ch.mo_hinh_id from hinh_mo_hinh_cha ch join cay on ch.cha_id = cay.id)
      select m.ma, m.ten from hinh_mo_hinh m join cay on cay.id = m.id order by m.ma`, [goc])).rows
    for (const [k, ten] of ds) {
      const x = con.filter((r) => r.ten === ten)
      if (x.length !== 1) throw new Error(`${mh} ${k}: tìm thấy ${x.length} giả thiết tên "${ten}"`)
      bang.push([`${mh}__${k}`, x[0].ma])
    }
  }
  await c.end()
  for (const [tu, den] of bang) {
    if (!existsSync(`${dir}/${tu}.png`)) throw new Error(`thiếu ${tu}.png`)
    renameSync(`${dir}/${tu}.png`, `${dir}/${den}.png`)
    if (existsSync(`${dir}/${tu}.svg`)) renameSync(`${dir}/${tu}.svg`, `${dir}/${den}.svg`)
    console.log(tu, '→', den)
  }
  process.exit(0)
}

const diem = (ds) => ds.map(([p]) => dot(p)).join('')
const nhan = (ds, tam) => ds.map(([p, ten, tu]) => labelOut(p, ten, tu ?? tam)).join('')
const ghep = (...phan) => ({ ve: phan.flatMap((x) => x.ve ?? []), diem: phan.flatMap((x) => x.diem ?? []), them: phan.flatMap((x) => x.them ?? []) })
const xep = (ten, tam, h) => hinh(ten, [...h.diem.map(([p]) => p), ...h.them], [...h.ve, diem(h.diem), nhan(h.diem, tam)])

const CFG = []

// ═════════════ MH.126 — Phân giác trong tam giác vuông ═════════════
CFG.push((Pk) => {
  const R = []
  const A = Pk(70, 330), B = Pk(70, 90), C = Pk(400, 330)            // AB = 240 đứng, AC = 330 ngang
  const AB = dist(A, B), BC = dist(B, C), D = lerp(A, C, AB / (AB + BC))
  const tam = Pk(190, 240)
  const goc = { ve: [seg(A, B), seg(B, C), seg(C, A), seg(B, D), rightAngle(A, B, C, 18), angleMark(B, A, D, 42), angleMark(B, D, C, 56)],
    diem: [[A, 'A', Pk(200, 200)], [B, 'B'], [C, 'C'], [D, 'D', Pk(200, 120)]] }
  const E1 = lerp(B, C, AB / BC)
  const N1 = { ve: [tick(B, A, 1, 0.5), tick(B, E1, 1, 0.5)], diem: [[E1, 'E', P(E1.x - 24, E1.y + 32)]] }
  const F = add(A, mul(sub(A, B), dist(C, E1) / AB))
  const N1a = { ve: [seg(A, F), tick(A, F, 2, 0.5), tick(E1, C, 2, 0.5)], diem: [[F, 'F', Pk(200, 200)]] }
  const E2 = foot(D, B, C)
  const N2 = { ve: [seg(D, E2), rightAngle(E2, D, B, 14)], diem: [[E2, 'E', P(E2.x - 24, E2.y + 32)]] }
  const Q = inter(B, A, E2, D)
  const N2a = { ve: [seg(D, Q), seg(A, Q)], diem: [[Q, 'Q', Pk(200, 200)]] }
  const Mq = mid(Q, C)
  const N2b = { ve: [seg(Q, C), tick(Q, Mq, 1, 0.5), tick(Mq, C, 1, 0.5)], diem: [[Mq, 'M', Pk(200, 200)]] }
  R.push(['MH.126', tam, ghep(goc)])
  R.push(['MH.126__N1', tam, ghep(goc, N1)])
  R.push(['MH.126__N1a', tam, ghep(goc, N1, N1a)])
  R.push(['MH.126__N2', tam, ghep(goc, N2)])
  R.push(['MH.126__N2a', tam, ghep(goc, N2, N2a)])
  R.push(['MH.126__N2b', tam, ghep(goc, N2, N2a, N2b)])
  return R
})

// ═════════════ MH.130 — Phân giác trong tam giác nhọn ═════════════
CFG.push((Pk) => {
  const R = []
  const A = Pk(150, 40), B = Pk(40, 300), C = Pk(480, 300)           // AB ≈ 282 < AC ≈ 421
  const AB = dist(A, B), AC = dist(A, C), I = lerp(B, C, AB / (AB + AC)), K = lerp(A, C, AB / AC)
  const tam = Pk(220, 210)
  const goc = { ve: [seg(A, B), seg(B, C), seg(C, A), seg(A, I), angleMark(A, B, I, 40), angleMark(A, I, C, 54), tick(A, B, 1, 0.5), tick(A, K, 1, 0.5)],
    diem: [[A, 'A'], [B, 'B'], [C, 'C'], [I, 'I', Pk(220, 200)], [K, 'K']] }
  const O = inter(A, I, B, K)
  const N1 = { ve: [seg(B, K)], diem: [[O, 'O', Pk(240, 230)]] }
  const E = inter(A, B, K, I)
  const N2 = { ve: [seg(K, E), seg(B, E)], diem: [[E, 'E', Pk(200, 200)]] }
  const H = mid(E, C)
  const N3 = { ve: [seg(E, C), tick(E, H, 2, 0.5), tick(H, C, 2, 0.5)], diem: [[H, 'H', Pk(240, 240)]] }
  R.push(['MH.130', tam, ghep(goc)])
  R.push(['MH.130__N1', tam, ghep(goc, N1)])
  R.push(['MH.130__N2', tam, ghep(goc, N1, N2)])
  R.push(['MH.130__N3', tam, ghep(goc, N1, N2, N3)])
  return R
})

// ═════════════ MH.131 — Tam giác cụng đầu ═════════════
CFG.push((Pk) => {
  const R = []
  const mk = (A) => {
    const B = Pk(40, 160), C = Pk(340, 160), M = mid(B, C), D = doiXung(A, M)
    const tam = Pk(190, 150)
    const goc = { ve: [seg(A, B), seg(B, C), seg(C, A), seg(A, D), tick(A, M, 1, 0.5), tick(M, D, 1, 0.5), tick(B, M, 2, 0.5), tick(M, C, 2, 0.74)],
      diem: [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D', tam], [M, 'M', Pk(190, 60)]] }
    return { A, B, C, M, D, tam, goc }
  }
  const g = mk(Pk(120, -20))
  const { A, B, C, M, D, tam, goc } = g
  const I = foot(M, A, C), K = foot(M, B, D)
  const N1 = { ve: [seg(B, D), seg(M, I), seg(M, K), rightAngle(I, M, A, 12), rightAngle(K, M, B, 12)], diem: [[I, 'I', Pk(190, 150)], [K, 'K', Pk(190, 150)]] }
  const H = foot(A, B, C), K2 = foot(D, B, C)
  const N2 = { ve: [seg(A, H), seg(D, K2), rightAngle(H, A, B, 12), rightAngle(K2, D, C, 12)], diem: [[H, 'H', Pk(190, 120)], [K2, 'K', Pk(190, 100)]] }
  const I3 = mid(A, C), E3 = doiXung(B, I3)
  const N3 = { ve: [seg(B, E3), tick(A, I3, 3, 0.5), tick(I3, C, 3, 0.5), tick(B, I3, 4, 0.5), tick(I3, E3, 4, 0.5)], diem: [[I3, 'I', Pk(190, 150)], [E3, 'E', Pk(190, 150)]] }
  const E4 = doiXung(D, C)
  const N4 = { ve: [seg(C, D), seg(C, E4), tick(C, D, 3, 0.5), tick(C, E4, 3, 0.5)], diem: [[E4, 'E', Pk(190, 150)]] }
  const F4 = mid(A, C)
  const N4a = { ve: [tick(A, F4, 4, 0.5), tick(F4, C, 4, 0.5)], diem: [[F4, 'F', Pk(190, 150)]] }
  // N5: tam giác vuông tại A (A trên đường tròn đường kính BC)
  const g5 = mk(Pk(100, 40)), { A: A5, B: B5, C: C5, D: D5 } = g5
  const N5v = { ve: [rightAngle(A5, B5, C5, 14)] }
  const N = mid(A, B), K6 = doiXung(C, N)
  const N6 = { ve: [seg(C, K6), tick(A, N, 3, 0.5), tick(N, B, 3, 0.5), tick(C, N, 4, 0.5), tick(N, K6, 4, 0.5)], diem: [[N, 'N', Pk(190, 150)], [K6, 'K', Pk(190, 150)]] }
  const E7 = foot(C, B, D), F7 = foot(B, A, C)
  const N7 = { ve: [seg(B, D), seg(D, E7), seg(C, E7), seg(A, F7), seg(B, F7), rightAngle(E7, C, D, 12), rightAngle(F7, B, C, 12)], diem: [[E7, 'E', Pk(190, 150)], [F7, 'F', Pk(190, 150)]] }
  R.push(['MH.131', tam, ghep(goc)])
  R.push(['MH.131__N1', tam, ghep(goc, N1)])
  R.push(['MH.131__N2', tam, ghep(goc, N2)])
  R.push(['MH.131__N3', tam, ghep(goc, N3)])
  R.push(['MH.131__N4', tam, ghep(goc, N4)])
  R.push(['MH.131__N4a', tam, ghep(goc, N4, N4a)])
  R.push(['MH.131__N5', g5.tam, ghep(g5.goc, N5v)])
  R.push(['MH.131__N6', tam, ghep(goc, N6)])
  R.push(['MH.131__N7', tam, ghep(goc, N7)])
  return R
})

// ═════════════ MH.132 — Tam giác cân (AB = AC, AD phân giác) ═════════════
CFG.push((Pk) => {
  const R = []
  const A = Pk(250, 40), B = Pk(60, 300), C = Pk(440, 300), D = Pk(250, 300), tam = Pk(250, 200)
  const goc = { ve: [seg(A, B), seg(B, C), seg(C, A), seg(A, D), tick(A, B, 1, 0.5), tick(A, C, 1, 0.5), angleMark(A, B, D, 44), angleMark(A, D, C, 58)],
    diem: [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D', Pk(250, 200)]] }
  // Na
  const M = foot(D, A, B), N = lerp(A, C, dist(A, M) / dist(A, C))
  const Na = { ve: [seg(D, M), seg(D, N), rightAngle(M, D, A, 12), tick(A, M, 2, 0.5), tick(A, N, 2, 0.5)], diem: [[M, 'M', Pk(250, 200)], [N, 'N', Pk(250, 200)]] }
  const K1 = mid(C, N), E1 = doiXung(D, K1)
  const Na1 = { ve: [seg(D, E1), seg(C, N), tick(C, K1, 3, 0.5), tick(K1, N, 3, 0.5), tick(D, K1, 4, 0.5), tick(K1, E1, 4, 0.5)], diem: [[K1, 'K', Pk(250, 200)], [E1, 'E', Pk(250, 200)]] }
  // Nb
  const Eb = foot(D, A, B), Fb = foot(D, A, C)
  const Nb = { ve: [seg(D, Eb), seg(D, Fb), rightAngle(Eb, D, A, 12), rightAngle(Fb, D, A, 12)], diem: [[Eb, 'E', Pk(250, 200)], [Fb, 'F', Pk(250, 200)]] }
  const Ib = mid(Eb, Fb)
  const Nb1 = { ve: [seg(Eb, Fb), tick(Eb, Ib, 2, 0.5), tick(Ib, Fb, 2, 0.5)], diem: [[Ib, 'I', Pk(300, 210)]] }
  const Kb = inter(A, D, Eb, Fb)
  const Nb2 = { ve: [seg(Eb, Fb)], diem: [[Kb, 'K', Pk(300, 210)]] }
  // Nb3
  const G = inter(C, add(C, sub(D, A)), B, A)
  const Nb3 = { ve: [seg(C, G), seg(A, G)], diem: [[G, 'G', Pk(250, 200)]] }
  // Nd
  const Pd = lerp(A, D, 0.55)
  const Nd = { ve: [], diem: [[Pd, 'P', Pk(330, 200)]] }
  // Ne
  const He = lerp(A, B, 0.42), Ke = lerp(A, C, 0.42), Ie = inter(He, Ke, A, D)
  const Ne = { ve: [seg(He, Ke), tick(A, He, 2, 0.5), tick(A, Ke, 2, 0.5)], diem: [[He, 'H', Pk(250, 200)], [Ke, 'K', Pk(250, 200)], [Ie, 'I', Pk(310, 200)]] }
  // Nf
  const Ef = add(B, mul(sub(B, C), 0.3)), Ff = add(C, mul(sub(C, B), 0.3))
  const Nf = { ve: [seg(Ef, B), seg(C, Ff), tick(Ef, B, 2, 0.5), tick(C, Ff, 2, 0.5)], diem: [[Ef, 'E', Pk(250, 200)], [Ff, 'F', Pk(250, 200)]] }
  // Ng
  const xg = add(C, Pk(0, -340)), yg = add(A, Pk(260, 0))
  const Ng = { ve: [seg(C, xg), seg(A, yg), rightAngle(C, B, xg, 16)], diem: [[xg, 'x', Pk(250, 200)], [yg, 'y', Pk(250, 200)]] }
  const Ig = mid(A, C), Kg = inter(A, yg, C, xg)
  const Ng1 = { ve: [tick(A, Ig, 2, 0.5), tick(Ig, C, 2, 0.5)], diem: [[Ig, 'I', Pk(250, 200)], [Kg, 'K', Pk(250, 200)]] }
  // Nh
  const Ph = mid(A, C), Qh = mid(A, B)
  const Nh = { ve: [tick(A, Ph, 2, 0.5), tick(Ph, C, 2, 0.5), tick(A, Qh, 3, 0.5), tick(Qh, B, 3, 0.5)], diem: [[Ph, 'P', P(Ph.x - 30, Ph.y - 44)], [Qh, 'Q', P(Qh.x + 30, Qh.y - 44)]] }
  const Mh = doiXung(B, Ph), Nh_ = doiXung(C, Qh)
  const Nh1 = { ve: [seg(B, Mh), seg(C, Nh_), tick(B, Ph, 4, 0.5), tick(Ph, Mh, 4, 0.5), tick(C, Qh, 5, 0.5), tick(Qh, Nh_, 5, 0.5)], diem: [[Mh, 'M', Pk(250, 200)], [Nh_, 'N', Pk(250, 200)]] }
  const Gh = inter(B, Ph, C, Qh)
  const Nh2 = { ve: [seg(B, Ph), seg(C, Qh)], diem: [[Gh, 'G', Pk(250, 250)]] }
  R.push(['MH.132', tam, ghep(goc)])
  R.push(['MH.132__Na', tam, ghep(goc, Na)])
  R.push(['MH.132__Na1', tam, ghep(goc, Na, Na1)])
  R.push(['MH.132__Nb', tam, ghep(goc, Nb)])
  R.push(['MH.132__Nb1', tam, ghep(goc, Nb, Nb1)])
  R.push(['MH.132__Nb2', tam, ghep(goc, Nb, Nb2)])
  R.push(['MH.132__Nb3', tam, ghep(goc, Nb3)])
  R.push(['MH.132__Nd', tam, ghep(goc, Nd)])
  R.push(['MH.132__Ne', tam, ghep(goc, Ne)])
  R.push(['MH.132__Nf', tam, ghep(goc, Nf)])
  R.push(['MH.132__Ng', tam, ghep(goc, Ng)])
  R.push(['MH.132__Ng1', tam, ghep(goc, Ng, Ng1)])
  R.push(['MH.132__Nh', tam, ghep(goc, Nh)])
  R.push(['MH.132__Nh1', tam, ghep(goc, Nh, Nh1)])
  R.push(['MH.132__Nh2', tam, ghep(goc, Nh, Nh2)])
  return R
})

// ═════════════ MH.133 — Hai trung điểm ═════════════
CFG.push((Pk) => {
  const R = []
  const A = Pk(170, 60), B = Pk(50, 220), C = Pk(290, 230), tam = Pk(170, 150)
  const D = mid(A, C), E = mid(A, B), M = doiXung(B, D), N = doiXung(C, E)
  R.push(['MH.133', tam, ghep({ ve: [seg(A, B), seg(B, C), seg(C, A), seg(B, M), seg(C, N),
      tick(A, D, 1, 0.5), tick(D, C, 1, 0.5), tick(A, E, 2, 0.5), tick(E, B, 2, 0.5), tick(B, D, 3, 0.5), tick(D, M, 3, 0.5), tick(C, E, 4, 0.5), tick(E, N, 4, 0.5)],
    diem: [[A, 'A', Pk(170, 150)], [B, 'B'], [C, 'C'], [D, 'D', Pk(120, 90)], [E, 'E', Pk(250, 160)], [M, 'M'], [N, 'N']] })])
  return R
})


// ── mỗi hình tự co để vừa khung app (rộng ≤ 560, cao ≤ 420 kể cả lề) — hệ số k riêng từng hình ──
const bbox = (h) => { const ps = [...h.diem.map(([p]) => p), ...h.them]; const xs = ps.map((p) => p.x), ys = ps.map((p) => p.y); return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)] }
for (const cfg of CFG) {
  const goc = cfg((x, y) => P(x, y))
  goc.forEach(([ten, tam, h], i) => {
    const [w, hh] = bbox(h)
    const k = Math.min(1, 460 / w, 305 / hh)
    const r = k < 0.999 ? cfg((x, y) => P(x * k, y * k))[i] : [ten, tam, h]
    xep(r[0], r[1], r[2])
    if (k < 0.999) console.log('  co', ten, 'k=' + k.toFixed(2))
  })
}

await xuatTat(dir)
