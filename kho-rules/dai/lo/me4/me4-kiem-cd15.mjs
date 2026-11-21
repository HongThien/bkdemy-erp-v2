// me4-kiem-cd15.mjs — máy kiểm đáp số CĐ15 (Bài toán công việc chung). Mỗi hàm TỰ TÍNH TỪ ĐỀ: thử các thời gian ứng viên (số nguyên hoặc phân số nhỏ)
// rồi giữ lại giá trị làm mọi điều kiện của đề cùng đúng, so bằng PHÂN SỐ CHÍNH XÁC (không số thực). KHÔNG chép các bước lời giải sách
// và KHÔNG dùng cách "quy về số phần" của sách: công việc được coi là 1, mỗi người làm 1/T công việc mỗi đơn vị thời gian.
const g = (a, b) => (b ? g(b, a % b) : Math.abs(a))
const F = (n, d = 1) => { const k = g(n, d) || 1; return d < 0 ? [-n / k, -d / k] : [n / k, d / k] }
const cong = (a, b) => F(a[0] * b[1] + b[0] * a[1], a[1] * b[1])
const nhan = (a, b) => F(a[0] * b[0], a[1] * b[1])
const bang = (a, b) => a[0] * b[1] === b[0] * a[1]
const nghich = (a) => F(a[1], a[0])
const MOT = F(1), NUA = F(1, 2)
const hien = (x) => (x[1] === 1 ? String(x[0]) : `${x[0]}/${x[1]}`)
const co = (r) => { if (!r.length) throw new Error('không ra nghiệm nào'); return r }
// thời gian ứng viên: số nguyên 1..gh hoặc phân số p/q (q <= qmax)
const ungVien = (gh, qmax = 1) => { const r = []; for (let q = 1; q <= qmax; q++) for (let p = 1; p <= gh * q; p++) if (g(p, q) === 1) r.push(F(p, q)) ; return r }
// năng suất một giờ của người làm xong cả việc trong T = 1/T
const nsuat = (T) => nghich(T)

export const KIEM_CD15 = {
  // anh T=2, em T=3; tìm t: t × (1/2 + 1/3) = 1
  'CĐ15 · B1': () => co(ungVien(60, 12).filter((t) => bang(nhan(t, cong(nsuat(F(2)), nsuat(F(3)))), MOT))).map(hien),
  // cả hai làm xong trong 12/5 giờ; người 1 T=4; tìm T2: (12/5) × (1/4 + 1/T2) = 1
  'CĐ15 · B2': () => co(ungVien(100, 4).filter((T2) => bang(nhan(F(12, 5), cong(nsuat(F(4)), nsuat(T2))), MOT))).map(hien),
  // tốp 1 T=A, tốp 2 T=B (nguyên): 12 giờ chung xong; chung 4 giờ rồi tốp 2 làm 20 giờ
  'CĐ15 · B3': () => { const r = []; for (let A = 1; A <= 300; A++) for (let B = 1; B <= 300; B++) { const s = cong(nsuat(F(A)), nsuat(F(B))); if (bang(nhan(F(12), s), MOT) && bang(cong(nhan(F(4), s), nhan(F(20), nsuat(F(B)))), MOT)) r.push(F(A), F(B)) } return co(r).map(hien) },
  // anh T=16 phút; em T=E: anh 4 phút, rồi cả hai 10 phút
  'CĐ15 · B4': () => co(ungVien(400).filter((E) => bang(cong(nhan(F(4), nsuat(F(16))), nhan(F(10), cong(nsuat(F(16)), nsuat(E)))), MOT))).map(hien),
  // tổ 1 T=A, tổ 2 T=B: chung 48 giờ xong; tổ 1 làm 60 giờ rồi tổ 2 làm 32 giờ thì xong
  'CĐ15 · B5': () => { const r = []; for (let A = 1; A <= 400; A++) for (let B = 1; B <= 400; B++) { if (bang(nhan(F(48), cong(nsuat(F(A)), nsuat(F(B)))), MOT) && bang(cong(nhan(F(60), nsuat(F(A))), nhan(F(32), nsuat(F(B)))), MOT)) r.push(F(A)) } return co(r).map(hien) },
  // máy I T=A, máy II T=B: chung 12 giờ xong; I gặt 4 giờ rồi II gặt 9 giờ được 7/12 thửa ruộng
  'CĐ15 · B6': () => { const r = []; for (let A = 1; A <= 300; A++) for (let B = 1; B <= 300; B++) { if (bang(nhan(F(12), cong(nsuat(F(A)), nsuat(F(B)))), MOT) && bang(cong(nhan(F(4), nsuat(F(A))), nhan(F(9), nsuat(F(B)))), F(7, 12))) r.push(F(A), F(B)) } return co(r).map(hien) },
  // người 1,2,3 T = 25, 20, 24; người 4 T=X: 3 người làm 2 ngày; người 3 làm 6 ngày; người 1, 3, 4 làm 4 ngày thì xong
  'CĐ15 · B7': () => co(ungVien(400).filter((X) => {
    const s3 = cong(cong(nsuat(F(25)), nsuat(F(20))), nsuat(F(24)))
    const giaiDoan1 = nhan(F(2), s3), giaiDoan2 = nhan(F(6), nsuat(F(24)))
    const giaiDoan3 = nhan(F(4), cong(cong(nsuat(F(25)), nsuat(F(24))), nsuat(X)))
    return bang(cong(cong(giaiDoan1, giaiDoan2), giaiDoan3), MOT)
  })).map(hien),
  // người 1 T=15, người 2 T=12: chung 3 giờ, người 1 làm 2 giờ, rồi cả hai làm t giờ nữa thì xong
  'CĐ15 · B8': () => co(ungVien(10, 12).filter((t) => {
    const s = cong(nsuat(F(15)), nsuat(F(12)))
    return bang(cong(cong(nhan(F(3), s), nhan(F(2), nsuat(F(15)))), nhan(t, s)), MOT)
  })).map(hien),
  // người 1 T=A (nguyên), người 2 T=B (phân số mẫu ≤ 4): chung 5 giờ xong; chung 2 giờ rồi người 1 làm 9 giờ thì xong
  'CĐ15 · B9': () => { const r = []; const ds = ungVien(60, 4); for (let A = 1; A <= 100; A++) for (const B of ds) { const s = cong(nsuat(F(A)), nsuat(B)); if (bang(nhan(F(5), s), MOT) && bang(cong(nhan(F(2), s), nhan(F(9), nsuat(F(A)))), MOT)) r.push(F(A), B) } return co(r).map(hien) },
  // vòi 1 T=6, vòi 2 T = 6 × 2/3; tìm t để cả hai vòi chảy đầy bể
  'CĐ15 · B10': () => { const T2 = nhan(F(6), F(2, 3)); return co(ungVien(10, 12).filter((t) => bang(nhan(t, cong(nsuat(F(6)), nsuat(T2))), MOT))).map(hien) },
  // chung 8 giờ xong; người 1 T=12; tìm T2 (ý a)
  'CĐ15 · B11a': () => co(ungVien(300).filter((T2) => bang(nhan(F(8), cong(nsuat(F(12)), nsuat(T2))), MOT))).map(hien),
  // cả việc 216 thùng, người 1 làm xong trong 12 giờ (tốc độ 216/12 thùng mỗi giờ); trong 8 giờ làm chung, người 1 đóng x thùng, người 2 đóng 216 - x
  'CĐ15 · B11b': () => { const r = []; for (let x = 0; x <= 216; x++) if (x * 12 === 216 * 8) r.push(x, 216 - x); return co(r).map(String) },
  // ba người: năng suất tuần = 1/3, 3/8, 5/12 công việc; tìm số giờ H (mỗi tuần 45 giờ) để làm xong 1 công việc
  'CĐ15 · B12': () => co(ungVien(400, 4).filter((H) => bang(nhan(nhan(H, F(1, 45)), cong(cong(F(1, 3), F(3, 8)), F(5, 12))), MOT))).map(hien),
  // người 1 T=A, người 2 T=B: chung 12 giờ xong; người 1 làm 7 giờ, người 2 làm 4 giờ được một nửa. Hỏi B
  'CĐ15 · B13': () => { const r = []; for (let A = 1; A <= 300; A++) for (let B = 1; B <= 300; B++) { const sA = nsuat(F(A)), sB = nsuat(F(B)); if (bang(nhan(F(12), cong(sA, sB)), MOT) && bang(cong(nhan(F(7), sA), nhan(F(4), sB)), NUA)) r.push(F(B)) } return co(r).map(hien) },
}
