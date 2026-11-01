// ============================================================================
// CÔNG CỤ BẢN ĐỒ của Claude trong một PHIÊN (spec-phong-truong-khoi.md) — tay ghi DUY NHẤT của Claude.
// ----------------------------------------------------------------------------
// Bot (scripts/phien/bot.mjs) chạy Claude với biến môi trường PHIEN_ID và chỉ cho phép Bash
// `node scripts/phien/ban-do.mjs …`. Script này KHÔNG nhận mã phiên từ tham số — chỉ từ PHIEN_ID —
// nên Claude không trỏ được sang phiên/khối khác. Mọi lệnh đi qua RPC fn_phien_bd_* (chỉ service_role):
// DB tự kiểm phiên đang mở, đóng vai người mở phiên, kiểm lại quyền trưởng khối, nút thuộc đúng khối.
// KHÔNG có lệnh xoá — cần xoá thì đề xuất để trưởng khối xoá tay trên màn Bản đồ mới (Luật xoá).
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
  const gon = (r) => r ? JSON.stringify(Object.fromEntries(Object.entries(r).filter(([k]) => !['created_at', 'updated_at', 'ly_thuyet', 'vi_du'].includes(k)))) : '∅'
  console.log(`${ds.length} thay đổi trên bản đồ khối ${data.khoi} từ ${data.tu}:`)
  for (const t of ds) console.log(`- ${t.at} · ${t.nguon === 'claude' ? 'CLAUDE (qua phiên)' : 'SỬA TAY'} · ${t.ai_sua} · ${t.hanh_dong} ${t.loai}\n    cũ: ${gon(t.cu)}\n    mới: ${gon(t.moi)}`)
  process.exit(0)
}

let ts
try { ts = JSON.parse(con[0] ?? '{}') } catch { loi(`Tham số phải là JSON trong dấu nháy đơn, vd: node scripts/phien/ban-do.mjs ${lenh} '{"ten":"..."}'`) }
const { data, error } = await svc.rpc('fn_phien_bd_ghi', { p_phien: PHIEN, p_viec: lenh, p_ts: ts })
if (error) loi(error.message)
console.log(`OK ${lenh}: ${JSON.stringify(data)}`)
