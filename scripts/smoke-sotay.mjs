// ============================================================================
// smoke-sotay.mjs — GỌI THẬT 3 RPC sổ tay bằng tài khoản `authenticated`.
//
// VÌ SAO CẦN: 20/09 `hs_sotay_tim` throw ở `format()` MỌI LẦN GỌI (comment có `%` trần lọt vào
// chuỗi format) ⇒ ô tìm chưa từng chạy. Ba đường kiểm trước đó đều KHÔNG phát hiện được vì
// không đường nào GỌI HÀM:
//   · test anon      → chạm guard `_sotay_duoc_doc()` TRƯỚC format() ⇒ 401, không tới chỗ nổ
//   · đo bằng SQL    → viết lại query bằng tay, không qua format()
//   · demo ?demo=    → dùng MOCK_API, không đụng RPC
// Bài học: **verify dữ liệu ≠ verify đường code.** Script này đóng đúng khe đó.
//
// CHẠY: npm run smoke:sotay
// CẦN trong .env: VITE_SUPABASE_URL · VITE_SUPABASE_KEY · VITE_DEV_ACCOUNTS
//   (`VITE_DEV_ACCOUNTS=Tên|email|pass,...` — cùng biến mà nút dev quick-login của Login.tsx dùng)
// Script TỰ đọc rồi đăng nhập; KHÔNG in mật khẩu/email ra màn hình.
// Tài khoản nào cũng được miễn qua được `_sotay_duoc_doc()` (là HS, hoặc là nhân sự).
//
// Exit code 0 = tất cả PASS · 1 = có FAIL (dùng được trong CI).
// ============================================================================
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function docEnv(ten) {
  let txt = ''
  for (const f of ['.env', '.env.local']) {
    try { txt += readFileSync(join(root, f), 'utf8') + '\n' } catch { /* không có thì thôi */ }
  }
  const m = txt.match(new RegExp('^' + ten + '=(.*)$', 'm'))
  return m ? m[1].replace(/^["']|["']$/g, '').trim() : null
}

const URL = docEnv('VITE_SUPABASE_URL')
const KEY = docEnv('VITE_SUPABASE_KEY')
const ACC = docEnv('VITE_DEV_ACCOUNTS')

const thieu = []
if (!URL) thieu.push('VITE_SUPABASE_URL')
if (!KEY) thieu.push('VITE_SUPABASE_KEY')
if (!ACC) thieu.push('VITE_DEV_ACCOUNTS')
if (thieu.length) {
  console.error(`✖ Thiếu biến trong .env: ${thieu.join(', ')}`)
  console.error('  VITE_DEV_ACCOUNTS có dạng: Tên|email@abc.com|matkhau  (nhiều tài khoản cách nhau bởi dấu phẩy)')
  process.exit(1)
}

// "Tên|email|pass,Tên2|email2|pass2" → lấy tài khoản đầu tiên
const [ten, email, matKhau] = ACC.split(',')[0].split('|').map((s) => s.trim())
if (!email || !matKhau) {
  console.error('✖ VITE_DEV_ACCOUNTS sai định dạng, cần: Tên|email|matkhau')
  process.exit(1)
}

const sb = createClient(URL, KEY)
let soFail = 0
const ok = (nhan, dat, chiTiet = '') => {
  console.log(`${dat ? '  ✔' : '  ✖'} ${nhan}${chiTiet ? ' — ' + chiTiet : ''}`)
  if (!dat) soFail++
}

// Gọi RPC và PHÂN BIỆT lỗi với rỗng — đây chính là thứ bản client cũ gộp làm một.
async function rpc(ten_ham, args) {
  const { data, error } = await sb.rpc(ten_ham, args)
  if (error) {
    const e = new Error(`${ten_ham}: [${error.code ?? '?'}] ${error.message}`)
    e.chiTiet = error
    throw e
  }
  return data
}

console.log(`\n▶ Đăng nhập bằng tài khoản dev "${ten ?? '?'}" …`)
const { error: loiDn } = await sb.auth.signInWithPassword({ email, password: matKhau })
if (loiDn) {
  console.error(`✖ Đăng nhập hỏng: ${loiDn.message}`)
  console.error('  (kiểm lại VITE_DEV_ACCOUNTS — script không in mật khẩu nên phải tự soát)')
  process.exit(1)
}
console.log('  ✔ đã có phiên `authenticated`')

const MON = 'Toán'
const NHANH = null

try {
  // ── ① hs_sotay_cay ────────────────────────────────────────────────────────
  console.log('\n▶ ① hs_sotay_cay')
  const cay = await rpc('hs_sotay_cay', { p_mon: MON, p_nhanh: NHANH, p_khoi: null })
  ok('trả về object', !!cay && typeof cay === 'object')
  const nhanhCay = Array.isArray(cay?.cay) ? cay.cay : []
  ok('cây có ≥1 chủ đề', nhanhCay.length >= 1, `${nhanhCay.length} chủ đề, khối ${cay?.khoi}`)
  ok('khoi_list không rỗng', (cay?.khoi_list ?? []).length >= 1, JSON.stringify(cay?.khoi_list ?? []))

  // lấy 1 lá thật từ cây → mọi assert sau bám dữ liệu SỐNG, không hardcode mã (mã đổi là hỏng test)
  const la = nhanhCay.flatMap((cd) => (cd.con ?? []).flatMap((cde) => cde.dangs ?? []))[0]
  ok('cây có ≥1 dạng (lá)', !!la, la ? `${la.ma_dang} "${la.ten_dang}"` : 'không có lá nào')
  if (!la) throw new Error('Không có lá nào để kiểm 2 hàm còn lại — dừng.')

  // ── ② hs_sotay_tim ────────────────────────────────────────────────────────
  // Từ khoá lấy TỪ CHÍNH tên lá vừa có ⇒ chắc chắn phải khớp. Nếu 0 dòng thì là hàm sai,
  // không phải "kho không có". 2 tiếng giữa tên (bỏ "Bài toán…" chung chung ở đầu).
  console.log('\n▶ ② hs_sotay_tim')
  const tu = la.ten_dang.split(/\s+/).filter((w) => w.length > 2).slice(1, 3).join(' ')
  const kq = await rpc('hs_sotay_tim', {
    p_tu_khoa: tu, p_mon: MON, p_nhanh: NHANH, p_khoi: cay?.khoi ?? null, p_limit: 20,
  })
  ok('trả về mảng', Array.isArray(kq))
  ok(`tìm "${tu}" có ≥1 kết quả`, (kq ?? []).length >= 1, `${(kq ?? []).length} kết quả`)
  ok('kết quả chứa đúng dạng đã lấy từ cây', (kq ?? []).some((r) => r.ma_dang === la.ma_dang), la.ma_dang)

  // Đối chứng ÂM: chuỗi chắc chắn không có → phải 0. Không có bước này thì "có kết quả"
  // cũng có thể chỉ vì hàm trả bừa mọi dòng.
  const rong = await rpc('hs_sotay_tim', {
    p_tu_khoa: 'zzzkhongcogidauma', p_mon: MON, p_nhanh: NHANH, p_khoi: null, p_limit: 20,
  })
  ok('từ khoá vô nghĩa → 0 kết quả', (rong ?? []).length === 0, `${(rong ?? []).length}`)

  // ── ②b p_khoi phải LỌC CỨNG, không phải chỉ cộng điểm ─────────────────────
  // Bug 20/09: đứng khối 9 gõ "chu vi" vẫn ra dạng khối 4/4T/5 — `p_khoi` chỉ +50 điểm,
  // WHERE không hề có khối ⇒ tập kết quả y hệt lúc p_khoi=null, chỉ khác thứ tự.
  // Test: tìm từ khoá TRẢI ≥2 KHỐI (dò từ dữ liệu sống, không hardcode), rồi lọc 1 khối
  // và soi khối của TỪNG dòng trả về. So số lượng là chưa đủ — phải so NỘI DUNG.
  console.log('\n▶ ②b hs_sotay_tim — p_khoi lọc cứng')
  const UNG_VIEN = ['chu vi', 'bai toan', 'tinh gia tri', 'phuong trinh', 'so nguyen']
  let rong2 = null, tuRong = null
  for (const ung of UNG_VIEN) {
    const r = await rpc('hs_sotay_tim', {
      p_tu_khoa: ung, p_mon: MON, p_nhanh: NHANH, p_khoi: null, p_limit: 50,
    })
    if (new Set((r ?? []).map((x) => x.khoi)).size >= 2) { rong2 = r; tuRong = ung; break }
  }
  if (!rong2) {
    console.log('  ⚠ bỏ qua — không tìm được từ khoá nào trải ≥2 khối trong kho hiện tại')
  } else {
    const khoiCo = [...new Set(rong2.map((x) => x.khoi))]
    ok(`"${tuRong}" không lọc → trải nhiều khối`, khoiCo.length >= 2, `${rong2.length} dòng, khối [${khoiCo.join(', ')}]`)
    const K = khoiCo[0]
    const loc = await rpc('hs_sotay_tim', {
      p_tu_khoa: tuRong, p_mon: MON, p_nhanh: NHANH, p_khoi: K, p_limit: 50,
    })
    const khoiLoc = [...new Set((loc ?? []).map((x) => x.khoi))]
    ok(`lọc p_khoi="${K}" → MỌI dòng cùng khối ${K}`,
      (loc ?? []).length > 0 && khoiLoc.length === 1 && khoiLoc[0] === K,
      `${(loc ?? []).length} dòng, khối [${khoiLoc.join(', ')}]`)
    ok('lọc phải HẸP hơn không lọc', (loc ?? []).length < rong2.length,
      `${(loc ?? []).length} < ${rong2.length}`)
    // khối không tồn tại ⇒ 0 dòng. Nếu ra >0 nghĩa là điều kiện khối lại bị bỏ qua.
    const khongCo = await rpc('hs_sotay_tim', {
      p_tu_khoa: tuRong, p_mon: MON, p_nhanh: NHANH, p_khoi: '__khongcokhoinay__', p_limit: 50,
    })
    ok('khối không tồn tại → 0 kết quả', (khongCo ?? []).length === 0, `${(khongCo ?? []).length}`)
  }

  // ── ②c khớp theo RANH GIỚI TỪ, không lọt giữa từ ──────────────────────────
  // Bug 20/09: "chu vi" ra "Bài toán Công việc chung - riêng" vì khớp CHUỖI CON
  // (`%chu%` trúng "chung", `%vi%` trúng "việc"). Luật mới: tiếng cuối là tiền tố,
  // các tiếng trước phải TRỌN TỪ. Lưu ý "khớp đầu từ" KHÔNG đủ — "chung" cũng bắt
  // đầu bằng "chu"; đã đo và loại phương án đó (xem mig 202609201203).
  console.log('\n▶ ②c hs_sotay_tim — khớp ranh giới từ')
  const boDau = (s) => (s ?? '').toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
  const chuVi = await rpc('hs_sotay_tim', {
    p_tu_khoa: 'chu vi', p_mon: MON, p_nhanh: NHANH, p_khoi: null, p_limit: 50,
  })
  const dinh = (chuVi ?? []).filter((r) => boDau(r.ten_dang).includes('cong viec chung'))
  // ÂM: dạng khớp-giữa-từ phải biến mất
  ok('"chu vi" KHÔNG trả dạng "công việc chung"', dinh.length === 0,
    dinh.length ? dinh.map((r) => `${r.ma_dang} "${r.ten_dang}"`).join(' | ') : '0 dòng dính')
  // DƯƠNG: và không được siết tới mức chẳng còn gì — phải còn đúng dạng chu vi thật
  const that = (chuVi ?? []).filter((r) => boDau(r.ten_dang).includes('chu vi'))
  ok('"chu vi" VẪN trả dạng chu vi thật', that.length >= 1,
    `${that.length}/${(chuVi ?? []).length} dòng có "chu vi" trong tên`)

  // DƯƠNG 2: gõ mỗi "chu" (tiếng cuối = tiền tố) phải RỘNG hơn hoặc bằng "chu vi",
  // và vẫn với tới được dạng chu vi — chứng minh không bị siết thành khớp nguyên từ.
  const chu = await rpc('hs_sotay_tim', {
    p_tu_khoa: 'chu', p_mon: MON, p_nhanh: NHANH, p_khoi: null, p_limit: 50,
  })
  ok('"chu" (1 tiếng, tiền tố) rộng hơn/bằng "chu vi"', (chu ?? []).length >= (chuVi ?? []).length,
    `${(chu ?? []).length} ≥ ${(chuVi ?? []).length}`)
  ok('"chu" vẫn với tới dạng chu vi',
    (chu ?? []).some((r) => boDau(r.ten_dang).includes('chu vi')))

  // Ký tự đặc biệt không được làm nổ hàm (regex-injection) — mọi tiếng bị lọc còn [a-z0-9].
  for (const rac of ['chu (vi', 'chu*vi', '((((']) {
    const r = await rpc('hs_sotay_tim', {
      p_tu_khoa: rac, p_mon: MON, p_nhanh: NHANH, p_khoi: null, p_limit: 10,
    })
    ok(`ký tự đặc biệt "${rac}" không làm nổ hàm`, Array.isArray(r), `${r.length} dòng`)
  }

  // ── ③ hs_sotay_dang ───────────────────────────────────────────────────────
  console.log('\n▶ ③ hs_sotay_dang')
  const chiTiet = await rpc('hs_sotay_dang', { p_ma_dang: la.ma_dang, p_mon: MON, p_nhanh: NHANH })
  ok('trả về object (không null)', !!chiTiet, chiTiet ? chiTiet.ten_dang : 'null')
  ok('có nội dung lý thuyết', !!chiTiet?.noi_dung && chiTiet.noi_dung.trim() !== '',
    chiTiet?.noi_dung ? `${chiTiet.noi_dung.length} ký tự` : 'rỗng')
  ok('đúng mã đã hỏi', chiTiet?.ma_dang === la.ma_dang)
} catch (e) {
  soFail++
  console.error(`\n✖ NỔ: ${e.message}`)
  if (e.chiTiet) console.error('  chi tiết:', e.chiTiet)
} finally {
  await sb.auth.signOut()
}

console.log(soFail === 0 ? '\n✅ SMOKE PASS — cả 3 RPC gọi thật được và trả dữ liệu.\n'
  : `\n❌ SMOKE FAIL — ${soFail} assert hỏng.\n`)
process.exit(soFail === 0 ? 0 : 1)
