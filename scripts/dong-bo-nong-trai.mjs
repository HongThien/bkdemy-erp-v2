// ĐỒNG BỘ game Nông Trại BK (repo riêng HongThien/bk-nong-trai, máy công ty `..\BKGame\NongTrai`, nhánh `nhip-ngay`) vào app HS: public/games/nong-trai/
// — Web TĨNH (three r128, không build): chép đúng phần chạy được, KHÔNG chép tools/ · README · spec · cho-demo · desktop.ini · .git.
// App HS nhúng bằng <iframe src="/games/nong-trai/index.html?nhung=1"> (screens/hocsinh/trochoi/). Cùng origin ⇒ localStorage của game (nongtrai_ngay_v1) nằm chung origin app HS (bản thử: tiến độ theo MÁY, chưa theo tài khoản).
// Hậu xử lý index.html: ẩn nút thử "⏭ Ngày mới" / "📘 +điểm" (chỉ bản thử, học sinh không cần) trừ khi có `?dev=1`.
// Chạy: node scripts/dong-bo-nong-trai.mjs [thư mục nguồn]   (mặc định ..\BKGame\NongTrai). Ghi đè file của chính bản chép, không xoá gì.
import fs from 'node:fs'
import path from 'node:path'

const NGUON = path.resolve(process.argv[2] ?? '../BKGame/NongTrai'), DICH = path.resolve('public/games/nong-trai')
const LOAI = new Set(['desktop.ini', 'Thumbs.db'])
const BO_QUA_FILE = new Set(['js/cho-demo.js'])
function chep(rel) {
  const src = path.join(NGUON, rel), dst = path.join(DICH, rel), st = fs.statSync(src)
  if (st.isDirectory()) { for (const f of fs.readdirSync(src)) if (!LOAI.has(f) && !BO_QUA_FILE.has(path.posix.join(rel.replace(/\\/g, '/'), f))) chep(path.join(rel, f)); return }
  fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst)
}
if (!fs.existsSync(path.join(NGUON, 'index.html'))) throw new Error('Không thấy index.html ở ' + NGUON)
for (const r of ['index.html', 'manifest.webmanifest', 'css', 'js', 'icons', 'assets']) chep(r)

const f = path.join(DICH, 'index.html')
let h = fs.readFileSync(f, 'utf8')
const GAN = '<!-- bk-app-hs: ẩn nút thử -->'
if (!h.includes(GAN)) {
  h = h.split('</head>').join(`${GAN}\n<style>html.an-dev #btnTua,html.an-dev #btnDiem{display:none!important}</style>\n<script>if(!/[?&]dev=1/.test(location.search))document.documentElement.classList.add('an-dev')</script>\n</head>`)
  fs.writeFileSync(f, h)
}
let n = 0, tong = 0
const dem = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) dem(p); else { n++; tong += fs.statSync(p).size } } }
dem(DICH)
console.log(`xong: ${n} file, ${(tong / 1048576).toFixed(1)} MB → ${DICH}`)
