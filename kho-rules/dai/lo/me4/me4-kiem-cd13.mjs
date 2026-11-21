// me4-kiem-cd13.mjs — máy kiểm đáp số CĐ13 (Bài toán về tuổi) sách ME lớp 4. Mỗi hàm TỰ TÍNH từ ĐỀ bằng vét cạn / thay ngược, không chép lời giải sách.
// Quy ước: "sau x năm" mọi người thêm x tuổi; x âm là quá khứ ("cách đây").
const gan = (a, b) => Math.abs(a - b) < 1e-9

export const KIEM_CD13 = {
  // mẹ 30, con 2 ; sau x năm mẹ gấp 5 lần con
  'CĐ13 · B1': () => {
    const r = []
    for (let x = 0; x <= 200; x++) if (30 + x === 5 * (2 + x)) r.push(x)
    return r
  },
  // con 16, cha 46 ; cách đây x năm thì 2 lần tuổi cha = 7 lần tuổi con
  'CĐ13 · B2': () => {
    const r = []
    for (let x = 1; x <= 16; x++) if (2 * (46 - x) === 7 * (16 - x)) r.push(x)
    return r
  },
  // Cách đây 3 năm Hùng hơn Cường 4 ; 3 năm sau 4/7 Hùng = 2/3 Cường
  'CĐ13 · B3': () => {
    for (let c = 4; c <= 200; c++) {
      const h = c + 4   // hiệu không đổi
      if (gan((4 / 7) * (h + 3), (2 / 3) * (c + 3))) return [h, c]
    }
    return []
  },
  // tuổi cháu = 1/4 bác ; khi cháu bằng tuổi bác hiện nay thì tổng hai người là 121
  'CĐ13 · B4': () => {
    for (let ch = 1; ch <= 100; ch++) {
      const bac = 4 * ch, t = bac - ch   // số năm để cháu bằng tuổi bác hiện nay
      if (ch + t + bac + t === 121) return [ch, bac]
    }
    return []
  },
  // cha = 7 con ; sau 10 năm cha = 3 con
  'CĐ13 · B5': () => {
    for (let con = 1; con <= 100; con++) {
      const cha = 7 * con
      if (cha + 10 === 3 * (con + 10)) return [con, cha]
    }
    return []
  },
  // mẹ 32, con gái 6, con trai 2 ; sau x năm mẹ = 1,5 tổng tuổi hai con
  'CĐ13 · B6': () => {
    const r = []
    for (let x = 0; x <= 200; x++) if (2 * (32 + x) === 3 * ((6 + x) + (2 + x))) r.push(x)
    return r
  },
  // tổng 104 ; 1/4 con kém 1/6 cha 4 tuổi  (1/4 con = 1/6 cha - 4)
  'CĐ13 · B7': () => {
    for (let con = 1; con <= 103; con++) {
      const cha = 104 - con
      if (gan(con / 4, cha / 6 - 4)) return [con, cha]
    }
    return []
  },
  // mẹ hiện nay hơn con sau 3 năm nữa là 22 ; tìm tuổi hai người khi mẹ gấp 6 lần con
  'CĐ13 · B8': () => {
    const hieu = 22 + 3   // mẹ - con hiện nay = 22 + 3, không đổi
    for (let con = 1; con <= 200; con++) if (con + hieu === 6 * con) return [con, con + hieu]
    return []
  },
  // 8 năm trước tổng ba người 45 ; 8 năm sau cha hơn anh cả 26, hơn em út 34 ; tuổi hiện nay
  'CĐ13 · B9': () => {
    for (let em = 1; em <= 40; em++) {
      const anh = em + (34 - 26), cha = em + 34
      if ((em - 8) + (anh - 8) + (cha - 8) === 45) return [em, anh, cha]
    }
    return []
  },
  // Linh kém Huệ 10 ; cách đây 2 năm 2/3 Linh = 3/7 Huệ
  'CĐ13 · B10': () => {
    for (let linh = 3; linh <= 100; linh++) {
      const hue = linh + 10
      if (gan((2 / 3) * (linh - 2), (3 / 7) * (hue - 2))) return [linh, hue]
    }
    return []
  },
  // chú Hùng hơn Hồng 27 ; 1/2 Hồng kém 1/5 Hùng 3 tuổi (1/2 Hồng = 1/5 Hùng - 3)
  'CĐ13 · B11': () => {
    for (let hong = 1; hong <= 100; hong++) {
      const hung = hong + 27
      if (gan(hong / 2, hung / 5 - 3)) return [hong, hung]
    }
    return []
  },
  // chị = 3 em ; khi em bằng tuổi chị hiện nay thì tổng chị và em là 32 ; hỏi tuổi cách đây 3 năm
  'CĐ13 · B12': () => {
    for (let em = 1; em <= 30; em++) {
      const chi = 3 * em, t = chi - em
      if ((em + t) + (chi + t) === 32) return [em - 3, chi - 3]
    }
    return []
  },
  // tổng hai anh em 20 ; em hiện nay = 2 × (tuổi em khi anh bằng tuổi em hiện nay)
  'CĐ13 · B13': () => {
    for (let em = 1; em < 20; em++) {
      const anh = 20 - em, s = em - anh          // sau s năm anh bằng tuổi em hiện nay (s có thể âm)
      const emLuc = em + s
      if (emLuc > 0 && em === 2 * emLuc) return [em, anh]
    }
    return []
  },
  // mẹ 45, ba con 15, 10, 2 ; sau x năm mẹ = 4/3 tổng ba con
  'CĐ13 · B14': () => {
    const r = []
    for (let x = 0; x <= 200; x++) if (gan(45 + x, (4 / 3) * ((15 + x) + (10 + x) + (2 + x)))) r.push(x)
    return r
  },
  // em - (chị - em) = 12 ; 2 chị - (chị + em) = 3
  'CĐ13 · B15': () => {
    const r = []
    for (let chi = 1; chi <= 100; chi++) for (let em = 1; em < chi; em++) {
      if (em - (chi - em) === 12 && 2 * chi - (chi + em) === 3) r.push([em, chi])
    }
    if (r.length !== 1) throw new Error(`có ${r.length} nghiệm`)
    return r[0]
  },
}
