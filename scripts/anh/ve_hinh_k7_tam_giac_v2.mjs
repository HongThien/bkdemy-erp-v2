// ve_hinh_k7_tam_giac_v2.mjs — hình cho TỪNG NÚT của 4 chuỗi Hình–Luyện K7 "Tam giác bằng nhau" theo BẢN CHUỖI 21/11 (Documents\Mô hình 7.docx):
// MH.126 Phân giác trong tam giác vuông · MH.130 Phân giác trong tam giác nhọn · MH.131 Tam giác cụng đầu · MH.132 Tam giác cân.
//   node scripts/anh/ve_hinh_k7_tam_giac_v2.mjs <thu_muc_ra>      → <ra>/<MÃ NÚT>.png + .svg (mã nút thật trong DB, tra theo đường tên từ mô hình gốc)
//   node --env-file=.env scripts/anh/gan_hinh.mjs <ra> --bang mohinh [--thay] [--ghi]
// Hình một nút CỘNG DỒN giả thiết trên đường gốc → nút; chỉ vẽ DỮ KIỆN (góc vuông, gạch bằng nhau, cung góc bằng nhau = phân giác) và
// các đoạn mà đề nhắc tên (△EBD, DE…); KHÔNG vẽ sẵn điều cần chứng minh (không nối A–I–M, không kéo dài để "thấy" thẳng hàng).
// Nhóm bài (MH.126): ba thành viên là ba cách phát biểu — mỗi thành viên chỉ vẽ ĐÚNG những gì đề thành viên đó cho. Hướng (Thùy 23/10): vuông tại A ⇒ A góc dưới trái, AB đứng.
import { P, seg, tick, angleMark, rightAngle, dot, label, labelOut, mid, foot, doiXung, inter, lerp, dist, hinh, xuatTat } from './ve_hinh_lib.mjs'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_hinh_k7_tam_giac_v2.mjs <thu_muc_ra>'); process.exit(2) }

const diem = (ds) => ds.map(([p]) => dot(p)).join('')
// tu: điểm để đẩy nhãn RA XA · hoặc {dx, dy} đặt nhãn tại chỗ
const nhan = (ds, tam) => ds.map(([p, ten, tu]) => (tu && 'dx' in tu ? label(p, ten, tu.dx, tu.dy) : labelOut(p, ten, tu ?? tam))).join('')
const ghep = (...phan) => ({ ve: phan.flatMap((x) => x.ve ?? []), diem: phan.flatMap((x) => x.diem ?? []) })
const xep = (ten, tam, h) => hinh(ten, h.diem.map(([p]) => p), [...h.ve, diem(h.diem), nhan(h.diem, tam)])

// khoá hình → đường tên nút trong DB (mô hình gốc > … > nút)
const DUONG = {
  'MH.126': ['MH.126', []], 'MH.126__tv1': ['MH.126', ['Thành viên 1']], 'MH.126__tv2': ['MH.126', ['Thành viên 2']], 'MH.126__tv3': ['MH.126', ['Thành viên 3']],
  'MH.126__n2': ['MH.126', ['Nhóm 2: điểm F']], 'MH.126__k1': ['MH.126', ['Nhóm 2: điểm F', 'Kiểu 1']], 'MH.126__k2': ['MH.126', ['Nhóm 2: điểm F', 'Kiểu 2']], 'MH.126__m': ['MH.126', ['Nhóm 2: điểm F', 'M trung điểm FC']],
  'MH.130': ['MH.130', []], 'MH.130__f': ['MH.130', ['DE cắt AB tại F']], 'MH.130__m': ['MH.130', ['DE cắt AB tại F', 'M trung điểm FC']],
  'MH.131': ['MH.131', []],
  'MH.131__ef_ab': ['MH.131', ['E, F trung điểm AB, CD']], 'MH.131__ef_ac': ['MH.131', ['E, F trung điểm AC, BD']],
  'MH.131__ij_ab': ['MH.131', ['AI = DJ (trên AB, CD)']], 'MH.131__ij_ac': ['MH.131', ['AI = DJ (trên AC, BD)']],
  'MH.131__hk_ab': ['MH.131', ['MH ⊥ AB, MK ⊥ DC']], 'MH.131__hk_ac': ['MH.131', ['MH ⊥ AC, MK ⊥ BD']],
  'MH.131__np': ['MH.131', ['N trung điểm AB, P đối xứng C qua N']], 'MH.131__lq': ['MH.131', ['L trung điểm AC, Q đối xứng B qua L']],
  'MH.132': ['MH.132', []],
  'MH.132__cao': ['MH.132', ['Hai đường cao BD, CE']], 'MH.132__cao_k': ['MH.132', ['Hai đường cao BD, CE', 'K trung điểm DE']],
  'MH.132__pg': ['MH.132', ['Hai phân giác BD, CE']], 'MH.132__pg_k': ['MH.132', ['Hai phân giác BD, CE', 'K trung điểm DE']],
  'MH.132__tt': ['MH.132', ['Hai trung tuyến BD, CE']], 'MH.132__tt_k': ['MH.132', ['Hai trung tuyến BD, CE', 'K trung điểm DE']],
}
const pg = createRequire(process.cwd() + '/')('pg')
const env = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const MA = {}
for (const [khoa, [goc, duong]] of Object.entries(DUONG)) {
  const r = (await c.query(`with recursive t as (
      select m.id, m.ma, m.ten, array[]::text[] d from hinh_mo_hinh m where m.ma = $1 and m.khoi = '7' and m.phan = 'luyen' and m.la_mo_hinh
      union all select ch.id, ch.ma, ch.ten, t.d || ch.ten from t join hinh_mo_hinh_cha h on h.cha_id = t.id join hinh_mo_hinh ch on ch.id = h.mo_hinh_id)
    select ma from t where d = $2::text[]`, [goc, duong])).rows
  if (r.length !== 1) throw new Error(`${khoa}: đường [${duong.join(' > ')}] dưới ${goc} có ${r.length} nút`)
  MA[khoa] = r[0].ma
}
await c.end()

const CFG = []

// ═════════════ MH.126 — Phân giác trong tam giác vuông ═════════════
CFG.push((Pk) => {
  const A = Pk(70, 330), B = Pk(70, 90), C = Pk(400, 330), tam = Pk(200, 230)
  const AB = dist(A, B), BC = dist(B, C), D = lerp(A, C, AB / (AB + BC)), E = lerp(B, C, AB / BC)
  const F = inter(D, E, A, B)                                       // DE cắt AB, F nằm trên tia đối của tia AB, AF = CE
  // dl: vị trí nhãn D (hình có F thì D dời sang phải để khỏi đè lên nét DF)
  const co = (dl) => ({ ve: [seg(A, B), seg(B, C), seg(C, A), rightAngle(A, B, C, 18), seg(B, D)], diem: [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D', dl], [E, 'E']] })
  const pg = { ve: [angleMark(B, A, D, 42), angleMark(B, D, C, 56)] }                 // BD phân giác
  const bb = { ve: [tick(B, A, 1, 0.5), tick(B, E, 1, 0.5)] }                         // BE = BA
  const de = { ve: [seg(D, E), rightAngle(E, D, B, 14)] }                              // DE ⊥ BC
  const deThuong = { ve: [seg(D, E)] }                                                 // chỉ nối D, E (không nói vuông)
  const fCo = [seg(D, F), seg(A, F), seg(F, C)]
  const k1 = { ve: fCo, diem: [[F, 'F']] }
  const k2 = { ve: [...fCo, tick(A, F, 2, 0.5), tick(C, E, 2, 0.5)], diem: [[F, 'F']] }
  const M = mid(F, C)
  const m = { ve: [tick(F, M, 3, 0.5), tick(M, C, 3, 0.5)], diem: [[M, 'M', { dx: 24, dy: 8 }]] }
  const goc = ghep(co(), pg, bb, de), gocF = ghep(co({ dx: 24, dy: 30 }), pg, bb, de)
  return [
    ['MH.126', tam, goc],
    ['MH.126__tv1', tam, ghep(co(), pg, de)],            // vuông A · BD phân giác · DE ⊥ BC
    ['MH.126__tv2', tam, ghep(co(), bb, de)],            // vuông A · BE = BA · DE ⊥ BC (D là giao của đường vuông góc với AC)
    ['MH.126__tv3', tam, ghep(co(), pg, bb, deThuong)],  // vuông A · BD phân giác · BE = BA
    ['MH.126__n2', tam, ghep(gocF, k2)],
    ['MH.126__k1', tam, ghep(gocF, k1)],
    ['MH.126__k2', tam, ghep(gocF, k2)],
    ['MH.126__m', tam, ghep(gocF, k2, m)],
  ]
})

// ═════════════ MH.130 — Phân giác trong tam giác nhọn (BA < BC) ═════════════
CFG.push((Pk) => {
  const A = Pk(153, 58), B = Pk(40, 300), C = Pk(400, 300), tam = Pk(200, 190)
  const BA = dist(B, A), BC = dist(B, C), D = lerp(A, C, BA / (BA + BC)), E = lerp(B, C, BA / BC)
  const F = inter(D, E, A, B)                                       // F nằm trên tia BA, BF = BC
  const goc = { ve: [seg(A, B), seg(B, C), seg(C, A), seg(B, D), seg(D, E), angleMark(B, A, D, 40), angleMark(B, D, C, 54), tick(B, A, 1, 0.5), tick(B, E, 1, 0.5)],
    diem: [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D'], [E, 'E']] }
  const f = { ve: [seg(D, F), seg(A, F), seg(F, C)], diem: [[F, 'F']] }
  const M = mid(F, C)
  const m = { ve: [tick(F, M, 2, 0.5), tick(M, C, 2, 0.5)], diem: [[M, 'M', { dx: 24, dy: 6 }]] }
  return [['MH.130', tam, ghep(goc)], ['MH.130__f', tam, ghep(goc, f)], ['MH.130__m', tam, ghep(goc, f, m)]]
})

// ═════════════ MH.131 — Tam giác cụng đầu (M trung điểm BC, D đối xứng A qua M) ═════════════
CFG.push((Pk) => {
  const A = Pk(120, 60), B = Pk(40, 200), C = Pk(340, 200), M = mid(B, C), D = doiXung(A, M), tam = Pk(190, 200)
  const gocM = (nm) => ({ ve: [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, D), seg(C, D), tick(A, M, 1, 0.5), tick(M, D, 1, 0.5), tick(B, M, 2, 0.5), tick(M, C, 2, 0.5)],
    diem: [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D'], [M, 'M', nm]] })       // nm: vị trí nhãn M (nhánh MH ⊥ AC dời sang phải vì MK đi xuống bên trái)
  const goc = gocM({ dx: -20, dy: 28 })
  // E, F trung điểm hai cạnh đối
  const trungDiem = (X, Y, Z, W) => { const E = mid(X, Y), F = mid(Z, W); return { ve: [tick(X, E, 3, 0.5), tick(E, Y, 3, 0.5), tick(Z, F, 4, 0.5), tick(F, W, 4, 0.5)], diem: [[E, 'E'], [F, 'F']] } }
  // I, J: AI = DJ
  const dongDai = (X, Y, Z, W) => { const I = lerp(X, Y, 0.4), J = lerp(Z, W, 0.4); return { ve: [tick(X, I, 3, 0.5), tick(Z, J, 3, 0.5)], diem: [[I, 'I'], [J, 'J']] } }
  // MH ⊥ cạnh, MK ⊥ cạnh đối
  const vuong = (X, Y, Z, W, nhanM) => { const H = foot(M, X, Y), K = foot(M, Z, W); return { ve: [seg(M, H), seg(M, K), rightAngle(H, M, X, 12), rightAngle(K, M, Z, 12)], diem: [[H, 'H'], [K, 'K'], ...(nhanM ? [[M, 'M', nhanM]] : [])] } }
  const N = mid(A, B), Pp = doiXung(C, N)
  const np = { ve: [seg(C, Pp), tick(A, N, 3, 0.5), tick(N, B, 3, 0.5), tick(C, N, 4, 0.5), tick(N, Pp, 4, 0.5)], diem: [[N, 'N', { dx: -30, dy: 18 }], [Pp, 'P']] }
  const L = mid(A, C), Q = doiXung(B, L)
  const lq = { ve: [seg(B, Q), tick(A, L, 3, 0.5), tick(L, C, 3, 0.5), tick(B, L, 4, 0.5), tick(L, Q, 4, 0.5)], diem: [[L, 'L'], [Q, 'Q']] }
  return [
    ['MH.131', tam, ghep(goc)],
    ['MH.131__ef_ab', tam, ghep(goc, trungDiem(A, B, C, D))],
    ['MH.131__ef_ac', tam, ghep(goc, trungDiem(A, C, B, D))],
    ['MH.131__ij_ab', tam, ghep(goc, dongDai(A, B, D, C))],
    ['MH.131__ij_ac', tam, ghep(goc, dongDai(A, C, D, B))],
    ['MH.131__hk_ab', tam, ghep(goc, vuong(A, B, D, C))],
    ['MH.131__hk_ac', tam, ghep(gocM({ dx: 26, dy: 24 }), vuong(A, C, D, B))],
    ['MH.131__np', tam, ghep(goc, np)],
    ['MH.131__lq', tam, ghep(goc, lq)],
  ]
})

// ═════════════ MH.132 — Tam giác cân (AB = AC, M trung điểm BC) ═════════════
CFG.push((Pk) => {
  const A = Pk(250, 40), B = Pk(60, 300), C = Pk(440, 300), M = mid(B, C), tam = Pk(250, 200)
  // tAB: vị trí gạch AB = AC dọc cạnh (nhánh trung tuyến dời gạch đi để khỏi đè lên trung điểm)
  const gocCan = (tAB) => ({ ve: [seg(A, B), seg(B, C), seg(C, A), tick(A, B, 1, tAB), tick(A, C, 1, tAB), tick(B, M, 2, 0.5), tick(M, C, 2, 0.5)],
    diem: [[A, 'A'], [B, 'B'], [C, 'C'], [M, 'M']] })
  const goc = gocCan(0.5), gocPg = gocCan(0.78)
  const nhanI = (I) => [I, 'I', { dx: 0, dy: 32 }]
  const nhanK = (K) => [K, 'K', { dx: 0, dy: -12 }]
  const kNut = (D, E, sn) => { const K = mid(D, E); return { ve: [tick(D, K, sn, 0.62), tick(K, E, sn, 0.38)], diem: [nhanK(K)] } }
  // hai đường cao
  const Dc = foot(B, A, C), Ec = foot(C, A, B), Ic = inter(B, Dc, C, Ec)
  const cao = { ve: [seg(B, Dc), seg(C, Ec), seg(Dc, Ec), rightAngle(Dc, B, A, 13), rightAngle(Ec, C, A, 13)], diem: [[Dc, 'D'], [Ec, 'E'], nhanI(Ic)] }
  // hai phân giác
  const AB = dist(A, B), BC = dist(B, C)
  const Dp = lerp(A, C, AB / (AB + BC)), Ep = lerp(A, B, AB / (AB + BC)), Ip = inter(B, Dp, C, Ep)
  const pg = { ve: [seg(B, Dp), seg(C, Ep), seg(Dp, Ep), angleMark(B, A, Dp, 36, 1), angleMark(B, Dp, C, 50, 1), angleMark(C, A, Ep, 36, 2), angleMark(C, Ep, B, 50, 2)],
    diem: [[Dp, 'D'], [Ep, 'E'], nhanI(Ip)] }
  // hai trung tuyến
  const Dt = mid(A, C), Et = mid(A, B), It = inter(B, Dt, C, Et)
  const tt = { ve: [seg(B, Dt), seg(C, Et), seg(Dt, Et), tick(A, Dt, 3, 0.5), tick(Dt, C, 3, 0.5), tick(A, Et, 4, 0.5), tick(Et, B, 4, 0.5)], diem: [[Dt, 'D'], [Et, 'E'], nhanI(It)] }
  const gocTt = gocCan(0.12)
  return [
    ['MH.132', tam, ghep(goc)],
    ['MH.132__cao', tam, ghep(goc, cao)], ['MH.132__cao_k', tam, ghep(goc, cao, kNut(Dc, Ec, 3))],
    ['MH.132__pg', tam, ghep(gocPg, pg)], ['MH.132__pg_k', tam, ghep(gocPg, pg, kNut(Dp, Ep, 3))],
    ['MH.132__tt', tam, ghep(gocTt, tt)], ['MH.132__tt_k', tam, ghep(gocTt, tt, kNut(Dt, Et, 5))],
  ]
})

// ── mỗi hình tự co để vừa khung app (rộng ≤ 460, cao ≤ 305 chưa kể lề) — hệ số k riêng từng hình ──
const bbox = (h) => { const ps = h.diem.map(([p]) => p); const xs = ps.map((p) => p.x), ys = ps.map((p) => p.y); return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)] }
let n = 0
for (const cfg of CFG) {
  const goc = cfg((x, y) => P(x, y))
  goc.forEach(([khoa, tam, h], i) => {
    const [w, hh] = bbox(h)
    const k = Math.min(1, 460 / w, 305 / hh)
    const r = k < 0.999 ? cfg((x, y) => P(x * k, y * k))[i] : [khoa, tam, h]
    if (!MA[khoa]) throw new Error('hình không có nút: ' + khoa)
    xep(MA[khoa], r[1], r[2]); n++
    if (k < 0.999) console.log('  co', khoa, '→', MA[khoa], 'k=' + k.toFixed(2))
  })
}
if (n !== Object.keys(DUONG).length) throw new Error(`vẽ ${n} hình nhưng khai ${Object.keys(DUONG).length} nút`)
await xuatTat(dir)
