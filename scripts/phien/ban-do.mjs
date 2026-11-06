// ============================================================================
// CÔNG CỤ BẢN ĐỒ của Claude trong một PHIÊN (spec-phong-truong-khoi.md) — tay ghi DUY NHẤT của Claude.
// ----------------------------------------------------------------------------
// Bot (scripts/phien/bot.mjs) chạy Claude với biến môi trường PHIEN_ID và chỉ cho phép Bash
// `node scripts/phien/ban-do.mjs …`. Script này KHÔNG nhận mã phiên từ tham số — chỉ từ PHIEN_ID —
// nên Claude không trỏ được sang phiên/khối khác. Mọi lệnh đi qua RPC fn_phien_bd_* (chỉ service_role):
// DB tự kiểm phiên đang mở, đóng vai người mở phiên, kiểm lại quyền trưởng khối, nút thuộc đúng khối.
// CÂU TRONG KHO (06/11, Thùy: trưởng khối đủ quyền sửa kho) — câu phải đúng môn + khối của phiên:
//   duyet_cau '{"ma_cau":["…"]}' | '{"nhom_id":"…"}' | '{"dang_bai_id":"…"}'     duyệt (cả bản sao) · bo_duyet_cau cùng tham số
//   sua_cau <<'HET'  [{"ma_cau":"…","noi_dung":"…","lua_chon":[…],"dap_an":"…","loi_giai":"…"}]  HET     (chỉ trường có mặt mới sửa)
//   kho_rac <<'HET'  [{"ma_cau":"…","ly_do":"…"}]  HET                          đưa vào kho rác (khôi phục được ở màn kho)
//   anh_pdf '{"file":"<pdf>","trang":3,"vung":[x0,y0,x1,y1],"ten":"cau12"}'      cắt hình (vung = tỉ lệ 0–1 của trang) ⇒ in đường dẫn PNG
//   anh_docx '{"file":"<docx>"}'                                                 tách mọi hình trong Word ⇒ in danh sách PNG
//   gan_anh '{"ma_cau":"…","file":"<png đã cắt>","o":"de|dap_an|ca_hai"}'       upload + gắn vào câu. XEM ẢNH (Read) TRƯỚC khi gắn.
// XOÁ (05/11, Thùy: trưởng khối đủ quyền): xoa_chu_de '{"id":..}' · xoa_chuyen_de '{"chu_de_id":..,"chuyen_de_id":..}' ·
// xoa_nhom '{"id":..}' · xoa_dang_bai '{"id":..}' — chỉ chạy sau khi người mở phiên gật trong chat.
//
// Cách dùng (Claude gọi):
//   node scripts/phien/ban-do.mjs xem                    cây bản đồ của khối (mã + tên + mô tả + số câu)
//   node scripts/phien/ban-do.mjs xem --json             như trên, JSON thô
//   node scripts/phien/ban-do.mjs thay-doi [--tu <ISO>]  thay đổi bản đồ khối từ lượt Claude trước (ai sửa · Claude hay sửa tay)
//   node scripts/phien/ban-do.mjs <lệnh> '<json>'        ghi 1 lệnh:
//     them_chu_de     {"ten": "...", "nhanh": "toan|hgt|hinh"}            (nhanh chỉ Toán, mặc định toan)
//     them_chuyen_de  {"chu_de_id": "...", "ten": "...", "mo_ta": "..."}
//     them_nhom       {"chu_de_id": "...", "chuyen_de_id": "...", "ten": "...", "mo_ta": "..."}
//     them_dang_bai   {"nhom_id": "...", "ten": "...", "mo_ta": "..."}
//     sua             {"loai": "chu_de|chuyen_de|nhom|dang_bai", "id": "...", "ten": "...", "mo_ta": "..."}  (chỉ ten, mo_ta)
//     chuyen_nhom     {"id": "<nhóm>", "chu_de_id": "...", "chuyen_de_id": "..."}
//     chuyen_dang_bai {"id": "<dạng bài>", "nhom_id": "..."}
//     sap_xep         {"loai": "chu_de|o|nhom|dang_bai", "ids": ["...", "..."], "chu_de_id": "<chỉ khi loai=o>"}
//   ── phiên LÝ THUYẾT DẠNG ──
//   node scripts/phien/ban-do.mjs doc '{"loai":"nhom|dang_bai|chuyen_de","id":"..."}'   đọc ĐỦ nội dung + md5 từng ô
//   node scripts/phien/ban-do.mjs ghi_noi_dung '{"loai":"dang_bai","id":"...","truong":"ly_thuyet|vi_du|mo_ta","md5_cu":"..."}' <<'HET'
//   <nội dung — dán nguyên văn, $ và \ giữ nguyên vì delimiter có nháy>
//   HET
//     Ô cho phép: chuyen_de.mo_ta · nhom.mo_ta|ly_thuyet · dang_bai.mo_ta|ly_thuyet|vi_du. Ô đang có chữ ⇒ BẮT BUỘC md5_cu
//     (lấy từ doc) — lệch là trưởng khối vừa sửa tay, phải doc lại. Không ghi nội dung trống. Kiểm định dạng trước khi gửi.
//   ── phiên NHẬP KHO & PHÂN DẠNG ──
//   node scripts/phien/ban-do.mjs kho-tong                                    số câu từng hàng của khối (trong · de_xuat · thieu · mau)
//   node scripts/phien/ban-do.mjs kho-cau '{"hang":"trong|de_xuat|thieu|mau","limit":20,"offset":0}'   một trang câu (đề · đáp án · dạng cũ · đề xuất)
//   node scripts/phien/ban-do.mjs kho-dang '{"dang_bai_id":"...","limit":30}'  câu đang nằm trong một dạng (rà lại sau khi sửa mô tả)
//   node scripts/phien/ban-do.mjs phan_dang <<'HET'                            phân một lô ≤ 50 câu:
//   [{"ma_cau":"...","ket_qua":"cao","dang_bai_id":"NDB..."},
//    {"ma_cau":"...","ket_qua":"vua","dang_bai_id":"NDB...","ly_do":"phân vân với NDB... vì ..."},
//    {"ma_cau":"...","ket_qua":"thieu","ly_do":"câu hỏi ... mà bản đồ chưa có dạng","chu_de_id":"NCD... (tuỳ chọn)"}]
//   HET
//     cao = CHẮC ⇒ tự gán (hậu kiểm mẫu ~10%) · vua = chưa chắc ⇒ trưởng khối duyệt · thieu = bản đồ thiếu dạng.
//     Câu NGƯỜI đã quyết thì DB từ chối — trừ khi người mở phiên bảo đổi: thêm "ghi_de": true vào câu đó. Câu lỗi không kéo cả lô.
//   node scripts/phien/ban-do.mjs them_cau <<'HET'                             đưa ≤ 20 BÀI TẬP MỚI vào kho (04/11):
//   [{"nhanh":"dai","loai_cau":"tu_luan","noi_dung":"...","loi_giai":"...","dap_an":"...","ten_de_goc":"tên tài liệu",
//     "phan":{"ket_qua":"cao","dang_bai_id":"NDB..."}},
//    {"nhanh":"hgt","loai_cau":"trac_nghiem","noi_dung":"...","lua_chon":["A","B","C","D"],"dap_an":"B","phan":{"ket_qua":"thieu","ly_do":"..."}}]
//   HET
//     nhanh dai | hgt · loai_cau trac_nghiem | tra_loi_ngan | tu_luan | dung_sai (Đ/S không kèm phan). Câu trùng kho ⇒ KHÔNG thêm, trả mã cũ.
//     Câu vào dạng chờ của khối, chưa duyệt. `phan` (tuỳ chọn) = xếp luôn, cùng luật phan_dang.
// ============================================================================
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const envRaw = (() => { try { return readFileSync(join(root, '.env.local'), 'utf8') } catch { return '' } })()
const env = (k) => envRaw.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '') ?? process.env[k]

const loi = (m) => { console.log(`LỖI: ${m}`); process.exit(1) }
const PHIEN = process.env.PHIEN_ID
if (!PHIEN) loi('Không có PHIEN_ID — công cụ này chỉ chạy bên trong một phiên do bot mở.')
const SB_URL = env('VITE_SUPABASE_URL'), SB_SERVICE = env('SUPABASE_SERVICE_ROLE')
if (!SB_URL || !SB_SERVICE) loi('Máy chạy bot thiếu cấu hình Supabase (.env.local).')
const svc = createClient(SB_URL, SB_SERVICE)

const [lenh, ...con] = process.argv.slice(2)
const co = (ten) => { const i = con.indexOf(ten); return i >= 0 ? (con[i + 1] ?? '') : null }

// In cây gọn cho Claude đọc: mã (bất biến, dùng để ra lệnh) + số hiển thị (chỉ để nói với người) + tên + mô tả.
function inCay(cay) {
  const L = []
  const mt = (s) => (s && String(s).trim() ? ` — ${String(s).replace(/\s+/g, ' ').trim().slice(0, 300)}` : '')
  for (const cd of cay?.chu_de ?? []) {
    L.push(`CHỦ ĐỀ ${cd.id} [${cd.thu_tu ?? ''}] ${cd.ten}${cd.nhanh ? ` (vùng ${cd.nhanh})` : ''}`)
    for (const o of cd.o ?? []) {
      const chung = (o.cung_co_o ?? []).length ? ` (dùng chung: ${(o.cung_co_o).map((x) => `${x.ten}/k${x.khoi}`).join(', ')})` : ''
      L.push(`  CHUYÊN ĐỀ ${o.chuyen_de_id} [${o.so ?? o.thu_tu ?? ''}] ${o.ten}${mt(o.mo_ta)}${chung}`)
      for (const n of o.nhom ?? []) {
        L.push(`    NHÓM ${n.id} [${n.so ?? n.thu_tu ?? ''}] ${n.ten}${mt(n.mo_ta)}${n.co_ly_thuyet ? ' · có LT' : ''}`)
        for (const d of n.dang_bai ?? []) {
          L.push(`      DẠNG ${d.id} [${d.so ?? d.thu_tu ?? ''}] ${d.ten}${mt(d.mo_ta)} · ${d.so_cau ?? 0} câu${d.co_ly_thuyet ? ' · LT✓' : ''}${d.co_vi_du ? ' · VD✓' : ''}`)
        }
      }
    }
  }
  return L.length ? L.join('\n') : '(Bản đồ khối này đang trống.)'
}

// In nội dung đọc được: mỗi ô kèm md5 (để ghi đè an toàn) — Claude đọc chữ thật, không phải JSON lồng.
function inNoiDung(d) {
  const o = (ten, nd, md5) => `── ${ten}${md5 ? ` (md5 ${md5})` : ''}:\n${nd && String(nd).trim() ? nd : '(trống)'}`
  const L = []
  if (d.loai === 'nhom') {
    L.push(`NHÓM ${d.id} — ${d.ten}  (chủ đề ${d.chu_de} › chuyên đề ${d.chuyen_de})${d.co_file_ly_thuyet ? '  · có FILE lý thuyết đính kèm' : ''}`)
    L.push(o('mo_ta', d.mo_ta, d.md5?.mo_ta), o('ly_thuyet', d.ly_thuyet, d.md5?.ly_thuyet))
    for (const x of d.dang_bai ?? []) {
      L.push(`\n== DẠNG ${x.id} [${x.thu_tu}] ${x.ten}`)
      L.push(o('mo_ta', x.mo_ta, x.md5?.mo_ta), o('ly_thuyet', x.ly_thuyet, x.md5?.ly_thuyet), o('vi_du', x.vi_du, x.md5?.vi_du))
    }
  } else if (d.loai === 'dang_bai') {
    L.push(`DẠNG ${d.id} — ${d.ten}  (nhóm ${d.nhom?.id} ${d.nhom?.ten})`)
    L.push(o('mo_ta', d.mo_ta, d.md5?.mo_ta), o('ly_thuyet', d.ly_thuyet, d.md5?.ly_thuyet), o('vi_du', d.vi_du, d.md5?.vi_du))
    L.push(`\n── lý thuyết NHÓM cha (đừng chép lặp):\n${d.nhom?.ly_thuyet?.trim() ? d.nhom.ly_thuyet : '(trống)'}`)
    L.push(`\n── các dạng anh em (mô tả phải phân biệt được):\n${(d.dang_anh_em ?? []).map((x) => `- ${x.id} ${x.ten}${x.mo_ta ? ` — ${x.mo_ta}` : ''}`).join('\n') || '(không có)'}`)
  } else {
    L.push(`CHUYÊN ĐỀ ${d.id} — ${d.ten}`, o('mo_ta', d.mo_ta, d.md5?.mo_ta))
    L.push(`Nhóm trong khối: ${(d.nhom ?? []).map((x) => `${x.id} ${x.ten}`).join(' · ') || '(chưa có)'}`)
  }
  return L.join('\n')
}

// Một câu cho Claude đọc khi phân dạng. Câu có HÌNH: Claude không xem được ảnh ⇒ ghi rõ để tự hạ mức chắc.
function inCau(c) {
  const L = [`CÂU ${c.ma_cau}${c.nhanh ? ` [${c.nhanh}]` : ''}${c.loai || c.loai_cau ? ` (${c.loai ?? c.loai_cau})` : ''}${c.nguon_gan ? ` · đang gán: ${c.nguon_gan === 'ai' ? 'AI' : c.nguon_gan}` : ''}`]
  if (c.dang_cu || c.chuyen_de_cu) L.push(`  bản đồ cũ: ${[c.chuyen_de_cu, c.dang_cu].filter(Boolean).join(' › ')}`)
  L.push(`  đề: ${String(c.noi_dung ?? '').trim()}`)
  if (Array.isArray(c.lua_chon) && c.lua_chon.length) L.push(`  lựa chọn: ${c.lua_chon.join(' | ')}`)
  if (Array.isArray(c.menh_de) && c.menh_de.length) L.push(`  mệnh đề: ${c.menh_de.map((m) => m.noi_dung ?? '').join(' | ')}`)
  if (c.dap_an) L.push(`  đáp án: ${c.dap_an}`)
  if (c.loi_giai) L.push(`  lời giải: ${String(c.loi_giai).replace(/\s+/g, ' ').slice(0, 600)}`)
  if (c.anh_de) L.push('  ⚠ ĐỀ CÓ HÌNH (bạn không xem được) — đề phụ thuộc hình thì đừng phân "cao"')
  if (c.dang_bai_id) L.push(`  dạng hiện tại/đề xuất: ${c.dang_bai_id} ${c.dang_bai ?? ''}${c.nhom ? ` (nhóm ${c.nhom})` : ''}${c.chac ? ` · mức ${c.chac}` : ''}`)
  if (c.ly_do) L.push(`  lý do trước: ${c.ly_do}`)
  return L.join('\n')
}

// Kiểm định dạng theo spec-format-noidung.md + khuôn K9/K11 (kho-rules/dai/k11.md §4). Lỗi ⇒ chặn; cảnh báo ⇒ vẫn ghi.
const KI_HIEU = ['ĐL', 'DL', 'ĐN', 'DN', 'TC', 'CY', 'PP', 'VD', 'NX', 'BT']
function kiemDinhDang(t, truong) {
  const loi = [], canh_bao = []
  const doiDo = (t.replace(/\\\$/g, '').match(/\$/g) ?? []).length
  if (doiDo % 2) loi.push('số dấu $ lẻ — có công thức chưa đóng')
  if (/\$\$/.test(t)) loi.push('không dùng $$…$$ — chỉ $…$')
  if (/\\\(|\\\[/.test(t)) loi.push('không dùng \\( \\[ — chỉ $…$')
  for (const m of t.matchAll(/^##(\S*)/gm)) if (!KI_HIEU.includes(m[1])) loi.push(`kí hiệu khối lạ "##${m[1]}" — chỉ ##ĐL ##ĐN ##TC ##CY ##PP ##VD ##NX ##BT`)
  if (truong === 'vi_du' && !/^##VD/m.test(t)) canh_bao.push('ô ví dụ nên mở mỗi ví dụ bằng ##VD')
  if (truong === 'vi_du' && /^##VD/m.test(t) && !/^(Bài giải|Lời giải|Giải)\s*[:.]/m.test(t)) canh_bao.push('ví dụ chưa có dòng "Bài giải:"')
  if (/\\times/.test(t)) canh_bao.push('dấu nhân nên dùng \\cdot thay \\times')
  if (/^(?:Bước|B)\s*\d+\s*[:.]/m.test(t)) canh_bao.push('##PP không ghi "Bước N" — app tự đánh số')
  if (/(^|[^*])\*[^*\s][^*]*\*(?!\*)/.test(t)) canh_bao.push('chỉ dùng **đậm**, không *nghiêng*')
  return { loi, canh_bao }
}

function docStdin() {
  return new Promise((resolve) => {
    let s = ''
    const het = setTimeout(() => loi('Không nhận được nội dung: dùng heredoc  … ghi_noi_dung \'{…}\' <<\'HET\'  (nội dung)  HET'), 10_000)
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (d) => { s += d })
    process.stdin.on('end', () => { clearTimeout(het); resolve(s) })
  })
}

if (!lenh || lenh === 'tro-giup' || lenh === '--help') {
  // In đúng khối "Cách dùng" ở đầu file — một nguồn, không chép hướng dẫn hai nơi.
  const dong = readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n')
  const tu = dong.findIndex((l) => l.includes('Cách dùng'))
  const den = dong.findIndex((l, i) => i > tu && l.startsWith('// ====='))
  console.log(dong.slice(tu, den).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'))
  process.exit(0)
}

if (lenh === 'xem') {
  const { data, error } = await svc.rpc('fn_phien_bd_xem', { p_phien: PHIEN })
  if (error) loi(error.message)
  if (con.includes('--json')) console.log(JSON.stringify(data, null, 1))
  else console.log(`Bản đồ ${data.mon} khối ${data.khoi}\n\n${inCay(data.cay)}`)
  process.exit(0)
}

if (lenh === 'thay-doi') {
  const { data, error } = await svc.rpc('fn_phien_bd_thay_doi', { p_phien: PHIEN, p_tu: co('--tu') || null })
  if (error) loi(error.message)
  const ds = data.thay_doi ?? []
  if (!ds.length) { console.log(`Không có thay đổi nào trên bản đồ khối ${data.khoi} từ ${data.tu}.`); process.exit(0) }
  // Ô chữ dài (lý thuyết, ví dụ) chỉ hiện độ dài + đầu đoạn — muốn đọc đủ thì dùng lệnh doc.
  const gon = (r) => r ? JSON.stringify(Object.fromEntries(Object.entries(r)
    .filter(([k]) => !['created_at', 'updated_at'].includes(k) && !k.endsWith('_file_url') && !k.endsWith('_ten_file'))
    .map(([k, v]) => ['ly_thuyet', 'vi_du', 'mo_ta'].includes(k) && typeof v === 'string' && v.length > 80 ? [k, `«${v.length} ký tự: ${v.slice(0, 80).replace(/\s+/g, ' ')}…»`] : [k, v]))) : '∅'
  console.log(`${ds.length} thay đổi trên bản đồ khối ${data.khoi} từ ${data.tu}:`)
  for (const t of ds) console.log(`- ${t.at} · ${t.nguon === 'claude' ? 'CLAUDE (qua phiên)' : 'SỬA TAY'} · ${t.ai_sua} · ${t.hanh_dong} ${t.loai}\n    cũ: ${gon(t.cu)}\n    mới: ${gon(t.moi)}`)
  process.exit(0)
}

if (lenh === 'kho-tong') {
  const { data, error } = await svc.rpc('fn_phien_kho_tong', { p_phien: PHIEN })
  if (error) loi(error.message)
  const d = data.dem ?? {}
  console.log(`Kho khối ${data.khoi}: chưa có dạng (trong) ${d.trong ?? '?'} · đề xuất chờ duyệt ${d.de_xuat ?? '?'} · thiếu dạng ${d.thieu ?? '?'} · mẫu hậu kiểm chờ xem ${d.mau ?? '?'}` +
    (d.kiem_n != null ? ` · đã kiểm mẫu ${d.kiem_n} câu, giữ ${d.kiem_giu}` : ''))
  process.exit(0)
}

let ts
const thamSo = con[0] ?? (['phan_dang', 'them_cau', 'sua_cau', 'kho_rac'].includes(lenh) ? await docStdin() : '{}')
try { ts = JSON.parse(thamSo) } catch { loi(`Tham số phải là JSON (trong dấu nháy đơn, hoặc qua heredoc với phan_dang), vd: node scripts/phien/ban-do.mjs ${lenh} '{"ten":"..."}'`) }

if (lenh === 'doc') {
  const { data, error } = await svc.rpc('fn_phien_bd_doc', { p_phien: PHIEN, p_loai: ts.loai, p_id: ts.id })
  if (error) loi(error.message)
  console.log(inNoiDung(data))
  process.exit(0)
}

if (lenh === 'kho-cau' || lenh === 'kho-dang') {
  const { data, error } = lenh === 'kho-cau'
    ? await svc.rpc('fn_phien_kho_hang', { p_phien: PHIEN, p_hang: ts.hang ?? 'trong', p_limit: ts.limit ?? 20, p_offset: ts.offset ?? 0 })
    : await svc.rpc('fn_phien_kho_dang', { p_phien: PHIEN, p_dang_bai: ts.dang_bai_id, p_limit: ts.limit ?? 30, p_offset: ts.offset ?? 0 })
  if (error) loi(error.message)
  const rows = lenh === 'kho-cau' ? (data.rows ?? []) : (data ?? [])
  const tong = lenh === 'kho-cau' ? data.tong : rows[0]?.tong
  console.log(lenh === 'kho-cau' ? `Hàng "${ts.hang ?? 'trong'}": ${tong ?? 0} câu — trang này ${rows.length} câu (offset ${ts.offset ?? 0})` : `Dạng ${ts.dang_bai_id}: ${tong ?? 0} câu — trang này ${rows.length}`)
  console.log(rows.map(inCau).join('\n\n') || '(không có câu)')
  process.exit(0)
}

if (lenh === 'phan_dang') {
  if (!Array.isArray(ts)) loi('phan_dang cần một MẢNG câu (xem tro-giup).')
  const { data, error } = await svc.rpc('fn_phien_kho_phan', { p_phien: PHIEN, p_ds: ts })
  if (error) loi(error.message)
  console.log(`Phân lô: ${data.ok} câu OK · ${data.loi} câu lỗi`)
  for (const x of data.chi_tiet ?? []) if (!x.ok) console.log(`  ✗ ${x.ma_cau}: ${x.loi}`)
  process.exit(0)
}

if (lenh === 'duyet_cau' || lenh === 'bo_duyet_cau') {
  const { data, error } = await svc.rpc('fn_phien_kho_duyet', { p_phien: PHIEN, p_ts: { ...ts, duyet: lenh === 'duyet_cau' } })
  if (error) loi(error.message)
  console.log(`${lenh === 'duyet_cau' ? 'Duyệt' : 'Bỏ duyệt'}: ${data.ok} câu OK · ${data.loi} câu lỗi${data.ghi_chu ? ' — ' + data.ghi_chu : ''}`)
  for (const x of data.chi_tiet ?? []) console.log(`  ✗ ${x.ma_cau}: ${x.loi}`)
  process.exit(0)
}

if (lenh === 'sua_cau' || lenh === 'kho_rac') {
  if (!Array.isArray(ts)) loi(`${lenh} cần một MẢNG câu (xem tro-giup).`)
  const { data, error } = await svc.rpc(lenh === 'sua_cau' ? 'fn_phien_kho_sua_cau' : 'fn_phien_kho_rac', { p_phien: PHIEN, p_ds: ts })
  if (error) loi(error.message)
  console.log(`${lenh === 'sua_cau' ? 'Sửa' : 'Kho rác'}: ${data.ok} câu OK · ${data.loi} câu lỗi`)
  for (const x of data.chi_tiet ?? []) console.log(`  ✗ ${x.ma_cau}: ${x.loi}`)
  process.exit(0)
}

// ẢNH: cắt / tách vào thư mục tạm TRONG repo (Claude đọc được bằng Read để soát), rồi gan_anh mới upload + ghi DB.
if (lenh === 'anh_pdf' || lenh === 'anh_docx' || lenh === 'gan_anh') {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync, existsSync, readdirSync, writeFileSync } = await import('node:fs')
  const { resolve, extname, basename } = await import('node:path')
  const tam = join(root, 'scripts', 'phien', '.tam', PHIEN); mkdirSync(tam, { recursive: true })
  const TAI_LIEU = (env('PHIEN_TAI_LIEU_DIR') ?? '').split(';').map((x) => x.trim()).filter(Boolean).map((x) => resolve(x).toLowerCase())
  const trongDuoc = (f) => { const a = resolve(f).toLowerCase(); return a.startsWith(resolve(tam).toLowerCase()) || TAI_LIEU.some((d) => a.startsWith(d)) }
  if (!ts.file || !existsSync(ts.file)) loi(`Không thấy file: ${ts.file ?? '(thiếu "file")'}`)
  if (!trongDuoc(ts.file)) loi('File phải nằm trong thư mục tài liệu hoặc thư mục ảnh tạm của phiên.')
  if (lenh === 'anh_pdf') {
    const trang = Number(ts.trang), v = ts.vung ?? [0, 0, 1, 1]
    if (!(trang >= 1) || v.length !== 4 || v.some((x) => !(x >= 0 && x <= 1)) || v[2] <= v[0] || v[3] <= v[1]) loi('Cần "trang" ≥ 1 và "vung":[x0,y0,x1,y1] tỉ lệ 0–1 (x1>x0, y1>y0).')
    const goc = join(tam, `_trang${trang}`)
    try { execFileSync('pdftoppm', ['-f', String(trang), '-l', String(trang), '-r', '200', '-png', '-singlefile', ts.file, goc], { stdio: 'pipe' }) }
    catch (e) { loi(`pdftoppm lỗi (máy bot cần cài poppler): ${String(e.message).slice(0, 200)}`) }
    const { PNG } = (await import('pngjs')).default
    const anh = PNG.sync.read(readFileSync(`${goc}.png`))
    const x0 = Math.floor(v[0] * anh.width), y0 = Math.floor(v[1] * anh.height), w = Math.max(1, Math.floor((v[2] - v[0]) * anh.width)), h = Math.max(1, Math.floor((v[3] - v[1]) * anh.height))
    const cat = new PNG({ width: w, height: h })
    PNG.bitblt(anh, cat, x0, y0, Math.min(w, anh.width - x0), Math.min(h, anh.height - y0), 0, 0)
    const ra = join(tam, `${String(ts.ten ?? `trang${trang}`).replace(/[^\w.-]/g, '_')}.png`)
    writeFileSync(ra, PNG.sync.write(cat))
    console.log(`Đã cắt: ${ra}  (${w}×${h}px; cả trang: ${goc}.png) — đọc ảnh này để soát trước khi gan_anh`)
  } else if (lenh === 'anh_docx') {
    const ra = join(tam, basename(ts.file, extname(ts.file)).replace(/[^\w.-]/g, '_'))
    try { execFileSync(process.execPath, [join(root, 'scripts', 'anh', 'docx_trich.mjs'), ts.file, ra], { stdio: 'pipe' }) }
    catch (e) { loi(`Tách Word lỗi: ${String(e.message).slice(0, 200)}`) }
    const ds = existsSync(join(ra, 'png')) ? readdirSync(join(ra, 'png')) : []
    console.log(`Đã tách ${ds.length} hình vào ${join(ra, 'png')} · văn bản đánh dấu vị trí hình: ${join(ra, 'van_ban.md')}`)
    for (const f of ds) console.log(`  ${join(ra, 'png', f)}`)
  } else {
    if (!ts.ma_cau) loi('Thiếu "ma_cau".')
    const duoi = extname(ts.file).toLowerCase().replace('.', '')
    if (!['png', 'jpg', 'jpeg'].includes(duoi)) loi('Chỉ gắn ảnh png / jpg.')
    const duongDan = `${crypto.randomUUID()}.${duoi}`
    const { error: eUp } = await svc.storage.from('kho-anh').upload(duongDan, readFileSync(ts.file), { contentType: duoi === 'png' ? 'image/png' : 'image/jpeg', upsert: false })
    if (eUp) loi(`Upload lỗi: ${eUp.message}`)
    const url = svc.storage.from('kho-anh').getPublicUrl(duongDan).data.publicUrl
    const { data, error } = await svc.rpc('fn_phien_kho_anh', { p_phien: PHIEN, p_ma_cau: ts.ma_cau, p_url: url, p_o: ts.o ?? 'ca_hai' })
    if (error) loi(error.message)
    console.log(`OK gan_anh ${data.ma_cau} (${data.o}): ${data.url}`)
  }
  process.exit(0)
}

if (lenh === 'them_cau') {
  if (!Array.isArray(ts)) loi('them_cau cần một MẢNG câu (xem tro-giup).')
  const { data, error } = await svc.rpc('fn_phien_kho_them', { p_phien: PHIEN, p_ds: ts })
  if (error) loi(error.message)
  console.log(`Đưa vào kho: ${data.them} câu mới · ${data.trung} câu trùng (đã có, không thêm) · ${data.loi} câu lỗi`)
  for (const x of data.chi_tiet ?? []) {
    if (!x.ok) console.log(`  ✗ "${x.dau_de}…": ${x.loi}`)
    else console.log(`  ${x.trung ? '= trùng' : '+ mới '} ${x.ma_cau}${x.phan ? ` → ${x.phan.ket_qua}${x.phan.dang_bai_id ? ' ' + x.phan.dang_bai_id : ''}` : ''}`)
  }
  process.exit(0)
}

if (lenh === 'ghi_noi_dung') {
  if (typeof ts.noi_dung !== 'string') ts.noi_dung = await docStdin()
  ts.noi_dung = ts.noi_dung.replace(/\r\n/g, '\n').replace(/^\n+|\s+$/g, '')
  const k = kiemDinhDang(ts.noi_dung, ts.truong)
  if (k.loi.length) loi(`nội dung chưa đúng định dạng, CHƯA ghi:\n- ${k.loi.join('\n- ')}`)
  const { data, error } = await svc.rpc('fn_phien_lt_ghi', { p_phien: PHIEN, p_ts: ts })
  if (error) loi(error.message)
  console.log(`OK ghi_noi_dung: ${JSON.stringify(data)}`)
  if (k.canh_bao.length) console.log(`Lưu ý định dạng (đã ghi, nên sửa ở lượt sau):\n- ${k.canh_bao.join('\n- ')}`)
  process.exit(0)
}
const { data, error } = await svc.rpc('fn_phien_bd_ghi', { p_phien: PHIEN, p_viec: lenh, p_ts: ts })
if (error) loi(error.message)
console.log(`OK ${lenh}: ${JSON.stringify(data)}`)
