// Kiểm máy các mệnh đề chia hết của lô bài lẻ 16/11 (dạng NDB03054, khối 8).
// Viết TỪ ĐỀ: quét n trên [-3000; 3000] bằng BigInt, kể cả n = 0 và số âm.
// Chạy: node kho-rules/dai/lo/k8/bai-le-chia-het-1611/kiem-menh-de.mjs
const chan = (n) => n % 2n === 0n
const le = (n) => n % 2n !== 0n
const moi = () => true
const bon = (n) => n % 4n === 0n

const DS = [
  // Đề đúng như ảnh Thùy gửi — kỳ vọng SAI
  { ma: 'ANH', ten: 'n^3-16n ⋮ 48, n chẵn (đề in)', f: (n) => n ** 3n - 16n * n, m: 48n, dk: chan, kyVong: false },
  // Bài gốc đã sửa + 10 bài clone — kỳ vọng ĐÚNG
  { ma: 'G', ten: 'n^3-4n ⋮ 48, n chẵn', f: (n) => n ** 3n - 4n * n, m: 48n, dk: chan, kyVong: true },
  { ma: 'C1', ten: 'n^3+20n ⋮ 48, n chẵn', f: (n) => n ** 3n + 20n * n, m: 48n, dk: chan, kyVong: true },
  { ma: 'C2', ten: 'n^3-n ⋮ 24, n lẻ', f: (n) => n ** 3n - n, m: 24n, dk: le, kyVong: true },
  { ma: 'C3', ten: 'n^3+3n^2-n-3 ⋮ 48, n lẻ', f: (n) => n ** 3n + 3n * n ** 2n - n - 3n, m: 48n, dk: le, kyVong: true },
  { ma: 'C4', ten: 'n^4-4n^3-4n^2+16n ⋮ 384, n chẵn', f: (n) => n ** 4n - 4n * n ** 3n - 4n * n ** 2n + 16n * n, m: 384n, dk: chan, kyVong: true },
  { ma: 'C5', ten: 'n^3-16n ⋮ 384, n chia hết cho 4', f: (n) => n ** 3n - 16n * n, m: 384n, dk: bon, kyVong: true },
  { ma: 'C6', ten: 'n^5-5n^3+4n ⋮ 120, mọi n', f: (n) => n ** 5n - 5n * n ** 3n + 4n * n, m: 120n, dk: moi, kyVong: true },
  { ma: 'C7', ten: 'n^3+3n^2+2n ⋮ 6, mọi n', f: (n) => n ** 3n + 3n * n ** 2n + 2n * n, m: 6n, dk: moi, kyVong: true },
  { ma: 'C8', ten: 'n^3-13n ⋮ 6, mọi n', f: (n) => n ** 3n - 13n * n, m: 6n, dk: moi, kyVong: true },
  { ma: 'C9', ten: '(n^2+n-1)^2-1 ⋮ 24, mọi n', f: (n) => (n ** 2n + n - 1n) ** 2n - 1n, m: 24n, dk: moi, kyVong: true },
  { ma: 'C10', ten: 'n^2+4n+3 ⋮ 8, n lẻ', f: (n) => n ** 2n + 4n * n + 3n, m: 8n, dk: le, kyVong: true },
]

// Kiểm thêm: số chia có "chặt" không (ƯCLN của mọi giá trị) — để biết đề không chọn số chia yếu hơn hẳn.
const ucln = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }

let hong = 0
for (const d of DS) {
  let sai = [], g = 0n, dem = 0
  for (let n = -3000n; n <= 3000n; n++) {
    if (!d.dk(n)) continue
    dem++
    const v = d.f(n)
    g = ucln(g, v)
    if (v % d.m !== 0n && sai.length < 5) sai.push(`n=${n}→${v}`)
  }
  const dung = sai.length === 0
  const ok = dung === d.kyVong
  if (!ok) hong++
  console.log(`${ok ? 'OK  ' : 'HỎNG'} ${d.ma.padEnd(4)} ${d.ten.padEnd(40)} thử ${dem} giá trị · ${dung ? 'ĐÚNG' : 'SAI: ' + sai.join(', ')} · ƯCLN mọi giá trị = ${g}`)
}
console.log(hong ? `\n${hong} mệnh đề KHÔNG như kỳ vọng` : '\nMọi mệnh đề như kỳ vọng')
process.exit(hong ? 1 : 0)
