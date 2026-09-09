// Vercel "Ignored Build Step" cho repo 8 project (ERP · ta · gv · ops · hs · pt · chi · giaibai) — CEO 07/09:
// "hôm trước đã nói tách ra, không build cả 8 cái". Mỗi push chỉ project nào có file LIÊN QUAN thay đổi mới build.
// Cách Vercel gọi: `ignoreCommand` trong vercel.json → exit 0 = BỎ QUA build (không tốn quota), exit 1 = BUILD.
// Quy tắc:
//   · file KHÔNG ảnh hưởng bundle (design/, docs, *.md, supabase/migrations, scripts/, android*, dist*…) → không ai build
//   · file RIÊNG của 1 app (entry html · vite.config.X · main-X · AppX · src/screens/<app>) → chỉ app đó build
//   · còn lại (src/lib, src/components, api/, package.json, index.css…) = DÙNG CHUNG → mọi project build
// Không chắc (thiếu SHA trước, git diff lỗi, không nhận ra project) → BUILD (an toàn hơn bỏ lỡ deploy).
// Test local: VERCEL_PROJECT_PRODUCTION_URL=bkdemy-erp-v2-ops.vercel.app VERCEL_GIT_PREVIOUS_SHA=<a> VERCEL_GIT_COMMIT_SHA=<b> node scripts/vercel-ignore.mjs
import { execSync } from 'node:child_process'

// Nhận diện project qua domain production (system env của Vercel) hoặc env tự đặt VERCEL_IGNORE_APP (ưu tiên).
const URL_APP = [
  ['bkdemy-erp-v2-ta-v2', 'ta'], ['bkdemy-erp-v2-ta', 'ta'], ['bkdemy-erp-v2-gv', 'gv'], ['bkdemy-erp-v2-ops', 'ops'],
  ['bkdemy-erp-v2-hs', 'hs'], ['bkdemy-erp-v2-pt', 'pt'], ['bkdemy-erp-v2-chi', 'chi'], ['bkdemy-erp-v2-gb', 'giaibai'],
  ['bkdemy-erp-v2-giaibai', 'giaibai'], ['bkdemy-erp-v2-soan', 'soan'], ['bkdemy-erp-v2-khaosat', 'khaosat'], ['bkdemy-erp-v2.vercel.app', 'erp'],
]
const APPS = ['erp', 'ta', 'gv', 'ops', 'hs', 'pt', 'chi', 'giaibai', 'soan', 'khaosat']

// Đường dẫn RIÊNG → chủ sở hữu. Prefix khớp đầu chuỗi; thư mục kết thúc bằng '/'.
const RIENG = [
  { p: ['ta.html', 'vite.config.ta.ts', 'src/main-ta.tsx', 'src/AppTa.tsx', 'src/screens/ta/', 'api/ta-nhac-viec.mjs', 'android-ta/'], chu: ['ta'] },
  { p: ['gv.html', 'vite.config.gv.ts', 'src/main-gv.tsx', 'src/AppGv.tsx', 'src/screens/gv/'], chu: ['gv'] },
  { p: ['ops.html', 'vite.config.ops.ts', 'src/main-ops.tsx', 'src/AppOps.tsx', 'src/screens/ops/'], chu: ['ops'] },
  { p: ['hs.html', 'vite.config.hs.ts', 'src/main-hs.tsx', 'src/AppHS.tsx', 'android/'], chu: ['hs'] },
  { p: ['src/screens/hocsinh/'], chu: ['hs', 'erp'] },                       // ERP cũng import màn hocsinh
  { p: ['pt.html', 'vite.config.pt.ts', 'src/main-pt.tsx', 'src/AppPt.tsx', 'src/screens/pt/', 'api/pt-nhac-viec.mjs'], chu: ['pt'] },
  { p: ['chi.html', 'vite.config.chi.ts', 'src/main-chi.tsx', 'src/AppChi.tsx', 'src/screens/chi/'], chu: ['chi'] },
  { p: ['giaibai.html', 'vite.config.giaibai.ts', 'src/main-giaibai.tsx', 'src/AppGiaiBai.tsx', 'src/screens/giaibai/'], chu: ['giaibai'] },
  { p: ['soan.html', 'vite.config.soan.ts', 'src/main-soan.tsx', 'src/AppSoan.tsx'], chu: ['soan'] },
  { p: ['khaosat.html', 'vite.config.khaosat.ts', 'src/main-khaosat.tsx', 'src/AppKhaoSat.tsx', 'src/screens/khaosat/'], chu: ['khaosat'] },
  { p: ['index.html', 'vite.config.ts', 'src/main.tsx', 'src/App.tsx'], chu: ['erp'] },
  // khu "Của tôi" (TA đã lắp; OPS/GV sắp lắp cùng khuôn) — 3 app cùng sở hữu để không bỏ lỡ
  { p: ['src/components/bk/', 'public/bk-ui/'], chu: ['ta', 'ops', 'gv'] },
  // Banner đếm ngược đi chơi — CHỈ TA + OPS dùng (07/09). File này nằm ngoài components/bk/ nên PHẢI khai
  // riêng, không thì rơi vào nhóm "chung" ở dưới → build oan cả 8 project (đã dính đúng lần đầu commit).
  { p: ['src/components/TripCountdownBanner.tsx'], chu: ['ta', 'ops'] },
  // Bộ soạn công thức (MathPopup/MathBuilder/RichMath/MathDoc/mathfield.ts/cum.ts…) — CHỈ erp (kho/nhập kho
  // dùng MathTextarea → kéo cả SoanModal), giaibai (GiaiEditor/ChuoiSoanModal), soan (app riêng) đụng tới.
  // gv/pt/ta/ops/hs/chi KHÔNG import (đã grep xác nhận 07/09) — trước đây rơi vào nhóm "chung" ở dưới nên
  // build oan cả 8 project mỗi lần sửa (Thùy báo "sao sửa giải bài lại đụng gv/pt"). "src/soan/" ở đây KHÔNG
  // đụng ta.html/gv.html/… (những entry app khác) vì prefix so đầu chuỗi khác nhau hoàn toàn.
  { p: ['src/lib/math/', 'src/components/math/', 'src/soan/'], chu: ['erp', 'giaibai', 'soan'] },
  // Chốt xu tháng (07/09) — ChotXuScreen/xu.ts/thanhtich.ts chỉ vào được qua NhanSuHome.tsx, mà NhanSuHome
  // CHỈ App.tsx (erp) import (đã grep xác nhận: AppTa/AppGv/AppOps/AppChi không import trực tiếp).
  { p: ['src/lib/xu.ts', 'src/lib/thanhtich.ts', 'src/screens/gami/ChotXuScreen.tsx'], chu: ['erp'] },
]
// Đường dẫn KHÔNG ảnh hưởng bundle nào
const BO_QUA = [
  'design/', 'docs/', 'supabase/', 'scripts/', 'worker/', '.claude/', '.github/', 'dist', 'schema.md', 'DEVLOG.md', 'HANDOFF.md',
  'CLAUDE.md', 'README', '_v1_ref/', '.gitignore', '.env.example',
]
const laBoQua = (f) => BO_QUA.some((b) => f.startsWith(b)) || (f.endsWith('.md') && !f.startsWith('src/')) || f.endsWith('.sql')

function app() {
  if (process.env.VERCEL_IGNORE_APP && APPS.includes(process.env.VERCEL_IGNORE_APP)) return process.env.VERCEL_IGNORE_APP
  const url = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? ''
  // khớp tên dài trước (ta-v2 trước ta; erp = đúng domain gốc)
  for (const [k, a] of URL_APP) if (url.startsWith(k) && (a !== 'erp' || url === k)) return a
  return null
}
// ⭐ 07/09 tối — Thùy soi log thấy `ta-v2` build cùng lúc với `giaibai` cho 1 commit "tính xu", không tin lời giải
// thích suông ("so với lần build gần nhất của CHÍNH project đó, không phải commit liền trước") — ĐÚNG, không có
// bằng chứng thật thì đừng đoán. Từ nay LUÔN in ra SHA thật + đường đi (VERCEL_GIT_PREVIOUS_SHA có hay không) +
// TOÀN BỘ danh sách file đổi (không chỉ file "liên quan") — đọc thẳng ở "Ignored Build Step" trong Build Logs
// của đúng project đó trên Vercel, không suy luận từ tên commit hiển thị ngoài Deployments (đó là commit MỚI
// NHẤT đang đứng, không phải toàn bộ khoảng diff project đó đang so).
function daDoi() {
  const truoc = process.env.VERCEL_GIT_PREVIOUS_SHA, sau = process.env.VERCEL_GIT_COMMIT_SHA ?? 'HEAD'
  const thu = (cmd) => { try { return execSync(cmd, { encoding: 'utf8' }).split('\n').map((s) => s.trim()).filter(Boolean) } catch { return null } }
  if (truoc) {
    const r = thu(`git diff --name-only ${truoc} ${sau}`)
    if (r) return { files: r, duong: `so với PREVIOUS_SHA thật (${truoc.slice(0, 8)} → ${sau.slice(0, 8)})` }
    console.log(`[vercel-ignore] có PREVIOUS_SHA=${truoc} nhưng git diff LỖI (SHA không có trong lịch sử clone?) → rơi về so HEAD^`)
  } else {
    console.log('[vercel-ignore] VERCEL_GIT_PREVIOUS_SHA RỖNG (Vercel không cấp — có thể lần đầu deploy dự án này với ignoreCommand, hoặc không phải push GitHub thường) → rơi về so HEAD^')
  }
  const r = thu(`git diff --name-only HEAD^ HEAD`)   // clone nông / thiếu previous SHA: ít nhất so với commit liền trước
  return r ? { files: r, duong: 'so với HEAD^ (KHÔNG phải lần build gần nhất thật của project — chỉ 1 commit gần nhất)' } : { files: null, duong: null }
}

const a = app()
console.log(`[vercel-ignore] VERCEL_PROJECT_PRODUCTION_URL="${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? ''}" → nhận là project="${a ?? '???'}" · VERCEL_GIT_COMMIT_SHA=${process.env.VERCEL_GIT_COMMIT_SHA ?? '(không có, dùng HEAD)'} · VERCEL_GIT_PREVIOUS_SHA=${process.env.VERCEL_GIT_PREVIOUS_SHA ?? '(rỗng)'}`)
const { files, duong } = daDoi()
if (!a) { console.log(`[vercel-ignore] không nhận ra project → BUILD (an toàn)`); process.exit(1) }
if (!files) { console.log('[vercel-ignore] git diff lỗi cả 2 đường (clone nông?) → BUILD (an toàn)'); process.exit(1) }
console.log(`[vercel-ignore] ${duong} — ${files.length} file đổi:`)
console.log(files.map((f) => '  · ' + f).join('\n'))

const lienQuan = []
for (const f of files) {
  if (laBoQua(f)) continue
  const r = RIENG.find((x) => x.p.some((p) => f.startsWith(p)))
  if (!r) { lienQuan.push(f + ' (chung — không khớp RIENG nào)'); continue }
  if (r.chu.includes(a)) lienQuan.push(f + ` (riêng, chu gồm: ${r.chu.join(',')})`)
}
console.log(`[vercel-ignore] project=${a} · ${lienQuan.length}/${files.length} liên quan`)
if (lienQuan.length) { console.log(lienQuan.slice(0, 30).map((s) => '  ✓ ' + s).join('\n')); console.log('[vercel-ignore] → BUILD'); process.exit(1) }
console.log('[vercel-ignore] không file nào liên quan → BỎ QUA build')
process.exit(0)
