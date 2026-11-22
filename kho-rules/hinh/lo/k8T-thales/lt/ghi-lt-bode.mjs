// ghi-lt-bode.mjs — GHI lý thuyết + ví dụ + mô tả bài HH00162 "Bổ đề hình thang" khối 8T (Thùy 22/11).
//   node kho-rules/hinh/lo/k8T-thales/lt/ghi-lt-bode.mjs [--ghi]       (mặc định chạy thử: kiểm thẻ + ảnh, ROLLBACK, KHÔNG upload)
// Nguồn: lt/lt-bode.md (lý thuyết) · lt/vd-bode.md (ví dụ) · lt/ra/<ten>.png (hình, vẽ bằng ve-bode.mjs). {{HINH:<ten>|<chú thích>}} → ![chú thích](url).
// CHỈ GHI VÀO Ô TRỐNG: hinh_hoc_bai_ly_thuyet chưa có dòng · hinh_hoc_bai.vi_du còn rỗng (mo_ta đã có thì giữ). Chặn: đoạn lý thuyết không mở bằng thẻ · lý thuyết chứa ##VD · ##VD thiếu "Bài giải" · \frac trần · \text chữ Việt.
import pg from 'pg'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
const DIR = dirname(fileURLToPath(import.meta.url))
const GHI = process.argv.includes('--ghi')
const THAY = process.argv.includes('--thay')   // 22/11 Thùy đổi tên điểm + thêm cách 2: THAY bản do chính phiên này ghi trước đó (hình lên tên mới có hậu tố -v2 để khỏi dính cache)
const MA = 'HH00162'
const envL = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
process.loadEnvFile('.env')
const MO_TA = `Hình thang có hai đáy song song, giao điểm I của hai cạnh bên, giao điểm O của hai đường chéo, trung điểm hai đáy: đường thẳng qua I hoặc qua O cắt hai đáy thì chia hai đáy thành các đoạn tỉ lệ; đường thẳng IO đi qua trung điểm hai đáy; trung điểm hai đáy, I và O thẳng hàng. Yêu cầu hay gặp: chứng minh trung điểm, chứng minh thẳng hàng, tính độ dài, chứng minh 1/OE = 1/a + 1/b. Chưa dùng tam giác đồng dạng.`
const lt0 = readFileSync(join(DIR, 'lt-bode.md'), 'utf8').replace(/\r\n/g, '\n').trim()
const vd0 = readFileSync(join(DIR, 'vd-bode.md'), 'utf8').replace(/\r\n/g, '\n').trim()

// ── kiểm ──
const loi = []
const TH = /^##(ĐN|ĐL|TC|CY|PP|NX)(\s|$)/
for (const kh of lt0.split(/\n\s*\n/)) { const k = kh.trim(); if (!k.startsWith('{{HINH:') && !TH.test(k)) loi.push(`lý thuyết: đoạn không mở bằng thẻ: «${k.slice(0, 50)}»`) }
if (/##VD/.test(lt0)) loi.push('lý thuyết chứa ##VD')
const ds = vd0.split(/\n(?=##VD)/).filter((x) => x.trim())
for (const v of ds) { if (!/^##VD/.test(v)) loi.push('ví dụ không mở bằng ##VD'); if (!/\n\s*Bài giải\s*[:.]/i.test(v)) loi.push('một ##VD thiếu «Bài giải:»') }
for (const [ten, s] of [['lý thuyết', lt0], ['ví dụ', vd0]]) {
  if (/\\frac(?!\w)|\\frac\{/.test(s.replace(/\\dfrac/g, ''))) loi.push(ten + ': dùng \\frac')
  if (/\\text\{[^}]*[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(s)) loi.push(ten + ': \\text chữ Việt')
  if (((s.replace(/\{\{HINH[^}]*\}\}/g, '').match(/(?<!\\)\$/g) || []).length) % 2) loi.push(ten + ': số dấu $ lẻ')
}
const hinhDung = [...new Set([...(lt0 + vd0).matchAll(/\{\{HINH:([a-z_]+)\|/g)].map((m) => m[1]))]
for (const h of hinhDung) if (!existsSync(join(DIR, 'ra', h + '.png'))) loi.push(`thiếu ảnh ra/${h}.png (chạy ve-bode.mjs)`)
console.log(`lý thuyết ${lt0.split(/\n\s*\n/).length} khối · ví dụ ${ds.length} · hình dùng: ${hinhDung.join(', ')} · lỗi: ${loi.length}`)
if (loi.length) { console.log(loi.join('\n')); process.exit(1) }

// ── ghi ──
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
try {
  await c.query('begin')
  const b = (await c.query(`select ma_bai, khoi, mo_ta, vi_du from hinh_hoc_bai where ma_bai = $1`, [MA])).rows[0]
  if (!b || b.khoi !== '8T') throw new Error(`${MA} không phải bài khối 8T`)
  const daCoLt = (await c.query(`select 1 from hinh_hoc_bai_ly_thuyet where ma_bai = $1`, [MA])).rowCount
  if (!THAY && (daCoLt || (b.vi_du ?? '') !== '')) throw new Error(`${MA} đã có lý thuyết / ví dụ — chỉ ghi vào ô trống`)
  // upload hình (chỉ khi --ghi)
  const url = {}
  const sb = GHI ? createClient(envL.VITE_SUPABASE_URL, envL.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } }) : null
  const thang = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` })()
  for (const h of hinhDung) {
    const p = `hinh_hoc/${thang}/lt-${MA}-${h}${THAY ? '-v2' : ''}.png`
    if (!GHI) { url[h] = `dry://kho-anh/${p}`; continue }
    const { error } = await sb.storage.from('kho-anh').upload(p, readFileSync(join(DIR, 'ra', h + '.png')), { contentType: 'image/png', upsert: THAY })
    if (error) throw new Error(`upload ${h}: ${error.message}`)
    url[h] = sb.storage.from('kho-anh').getPublicUrl(p).data.publicUrl
  }
  const them = (s) => s.replace(/\{\{HINH:([a-z_]+)\|([^}]*)\}\}/g, (_, h, alt) => `![${alt}](${url[h]})`)
  if (THAY && daCoLt) await c.query(`update hinh_hoc_bai_ly_thuyet set noi_dung = $2, cap_nhat_at = now() where ma_bai = $1`, [MA, them(lt0)])
  else await c.query(`insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung, cap_nhat_at) values ($1, $2, now())`, [MA, them(lt0)])
  // mô tả đã có (bản đồ 14/11) thì GIỮ; chỉ điền khi trống
  await c.query(`update hinh_hoc_bai set mo_ta = case when coalesce(mo_ta,'') = '' then $2 else mo_ta end, vi_du = $3 where ma_bai = $1`, [MA, MO_TA, them(vd0)])
  console.log(`ghi: lý thuyết ${them(lt0).length} ký tự · ví dụ ${them(vd0).length} ký tự · ${hinhDung.length} hình`)
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
