// me4-kiem-cd02.mjs — máy kiểm đáp số CĐ2 "Lập số và quy tắc đếm" (ME4). Mọi hàm đếm / cộng bằng VÉT CẠN từ đề, không chép lời giải sách.
// Bài 19 (chữ MATH) và Bài 20 (đường đi của kiến) có hình trong đề ⇒ hoãn, không có hàm.

const hoanVi = (mang) => {
  if (mang.length <= 1) return [mang.slice()]
  const ra = []
  mang.forEach((x, i) => { for (const p of hoanVi(mang.slice(0, i).concat(mang.slice(i + 1)))) ra.push([x, ...p]) })
  return ra
}
/** Mọi số n chữ số lập từ nhóm chữ số `cs` (cho lặp hay không), hàng đầu khác 0. Trả mảng số nguyên. */
function lapSo(cs, n, { lap = false } = {}) {
  const ra = []
  const dfs = (cur, dung) => {
    if (cur.length === n) { ra.push(Number(cur.join(''))); return }
    cs.forEach((d, i) => {
      if (!lap && dung.has(i)) return
      if (cur.length === 0 && d === 0) return
      dung.add(i); cur.push(d); dfs(cur, dung); cur.pop(); dung.delete(i)
    })
  }
  dfs([], new Set())
  return [...new Set(ra)]   // bỏ trùng khi nhóm chữ số có hai chữ số giống nhau
}
const tong = (mang) => mang.reduce((a, b) => a + b, 0)
const cs = (n) => String(n).split('').map(Number)

export const KIEM_CD02 = {
  'CĐ2 · B1a': () => [lapSo([0, 3, 8, 9], 4).length],
  'CĐ2 · B1b': () => { const d = lapSo([0, 3, 8, 9], 4); return [Math.max(...d), Math.min(...d)] },
  'CĐ2 · B1c': () => { const d = lapSo([0, 3, 8, 9], 4); return [Math.max(...d.filter((x) => x % 2)), Math.min(...d.filter((x) => x % 2 === 0))] },
  'CĐ2 · B2a': () => [lapSo([1, 4, 6, 8, 9], 4, { lap: true }).length],
  'CĐ2 · B2b': () => [lapSo([1, 4, 6, 8, 9], 5, { lap: true }).filter((x) => x % 2 && cs(x)[2] === 4).length],
  'CĐ2 · B2c': () => [lapSo([1, 4, 6, 8, 9], 5).filter((x) => x % 2 === 0).length],
  'CĐ2 · B3': () => [tong(lapSo([3, 5, 6, 8], 4))],
  'CĐ2 · B4a': () => { let d = 0; for (let n = 1000; n <= 9999; n++) if (tong(cs(n)) === 3) d++; return [d] },
  'CĐ2 · B4b': () => { let d = 0; for (let n = 10; n <= 99; n++) { const [a, b] = cs(n); if (Math.abs(a - b) === 2) d++ } return [d] },
  'CĐ2 · B5': () => { let d = 0; for (let n = 1000; n <= 9999; n++) { const c = cs(n); if (n % 2 === 0 && new Set(c).size === 4 && !c.includes(6)) d++ } return [d] },
  'CĐ2 · B6': () => {
    // thử x = 0..9: nhóm chữ số {x,2,5,8} lập được đúng 12 số có 4 chữ số (mỗi số đủ 4 chữ số) và tổng bằng 66660
    const ok = []
    for (let x = 0; x <= 9; x++) {
      const so = [...new Set(hoanVi([x, 2, 5, 8]).filter((p) => p[0] !== 0).map((p) => Number(p.join(''))))]
      if (so.length === 12 && tong(so) === 66660) ok.push(x)
    }
    if (ok.length !== 1) throw new Error('không có đúng một x: ' + ok)
    return [ok[0]]
  },
  'CĐ2 · B7': () => {
    // mọi bộ 4 chữ số khác nhau, khác 0, có tổng 15: tổng các số lập được phải luôn như nhau
    const kq = new Set()
    for (let a = 1; a <= 9; a++) for (let b = a + 1; b <= 9; b++) for (let c = b + 1; c <= 9; c++) for (let d = c + 1; d <= 9; d++) {
      if (a + b + c + d !== 15) continue
      kq.add(tong(hoanVi([a, b, c, d]).map((p) => Number(p.join('')))))
    }
    if (kq.size !== 1) throw new Error('tổng không cố định: ' + [...kq])
    return [[...kq][0]]
  },
  'CĐ2 · B8': () => [lapSo([0, 2, 3, 7, 5], 4).filter((x) => x % 5 === 0).length],
  'CĐ2 · B9': () => [lapSo([0, 1, 2, 4, 7, 9], 5).filter((x) => x % 2 === 0 && x % 3 === 0).length],
  'CĐ2 · B10': () => { let d = 0; for (let n = 1000; n <= 9999; n++) if (n % 3 === 0 && n % 10 === 5) d++; return [d] },
  'CĐ2 · B11a': () => { let d = 0; for (let n = 1000; n <= 9999; n++) if (Math.floor(n / 100) > n % 100) d++; return [d] },
  'CĐ2 · B11b': () => { let d = 0; for (let n = 1000; n <= 9999; n++) if (Math.floor(n / 100) + (n % 100) < 100) d++; return [d] },
  'CĐ2 · B12': () => { let d = 0; for (let n = 1000; n <= 9999; n++) if (n % 5 === 0 && cs(n).filter((x) => x === 5).length === 1) d++; return [d] },
  'CĐ2 · B13': () => {
    // số viết ngược lại cũng là số có 3 chữ số (chữ số hàng đơn vị khác 0) — cách hiểu của sách. Cách hiểu khác (cho phép c = 0) ra 180, ghi ở ghi-chu.
    let d = 0
    for (let n = 100; n <= 999; n++) { const [a, b, c] = cs(n); if (c === 0) continue; if ((n + Number(`${c}${b}${a}`)) % 5 === 0) d++ }
    return [d]
  },
  'CĐ2 · B14': () => [lapSo([0, 3, 5, 7, 8], 4).filter((x) => x % 15 === 0).length],
  'CĐ2 · B15': () => { let d = 0; for (let n = 10000; n <= 99999; n++) if (n % 3 === 0 && String(n).includes('6')) d++; return [d] },
  'CĐ2 · B16a': () => [tong(lapSo([2, 3, 0, 7], 4, { lap: true }))],
  'CĐ2 · B16b': () => [tong(lapSo([2, 3, 0, 7], 4))],
  'CĐ2 · B17': () => { let d = 0; for (let i = 0; i < 30; i++) for (let j = i + 1; j < 30; j++) d++; return [d] },
  'CĐ2 · B18': () => {
    // 13 cặp vợ chồng: đàn ông bắt tay mọi người trừ vợ mình; phụ nữ không bắt tay nhau
    let d = 0
    for (let i = 0; i < 13; i++) {
      for (let j = i + 1; j < 13; j++) d++            // đàn ông i với đàn ông j
      for (let j = 0; j < 13; j++) if (j !== i) d++   // đàn ông i với phụ nữ j (không phải vợ mình)
    }
    return [d]
  },
}
