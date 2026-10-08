// ============================================================================
// ve-lai-so-do.mjs — VẼ LẠI sơ đồ của các câu ĐÃ GHI KHO khi máy vẽ đổi (sửa lỗi hiển thị), cập nhật anh_dap_an.
//
//   node scripts/kho/sach/ve-lai-so-do.mjs --sach "Toán arc 4 Q1" --so-do kho-rules/dai/so-do <lo1.json> [lo2.json …] [--ghi]
//
// - Câu tìm theo DANH TÍNH ten_de_goc = "<sách> · <mã>" (không theo vị trí). Mô tả sơ đồ lấy từ trường so_do của lô JSON trong repo.
// - So ảnh ĐANG LƯU (tải về từ anh_dap_an) với bản vẽ mới: giống hệt ⇒ bỏ qua; khác ⇒ (--ghi) upload bản mới + UPDATE anh_dap_an.
// - KHÔNG xoá ảnh cũ trong bucket (luật xoá: chỉ xoá khi người gật) — ảnh cũ thành rác, liệt kê đường dẫn để dọn sau nếu muốn.
// - Không --ghi: chỉ báo câu nào sẽ đổi.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { veSoDo } from '../so-do-doan-thang.mjs'

const GOC_REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const GHI = a.includes('--ghi'), SACH = lay('--sach'), SODO = lay('--so-do')
const loTep = a.filter((x, i) => !x.startsWith('--') && !['--sach', '--so-do'].includes(a[i - 1]))
if (!SACH || !SODO || !loTep.length) { console.error('Dùng: node scripts/kho/sach/ve-lai-so-do.mjs --sach "<tên>" --so-do <dir> <lo.json…> [--ghi]'); process.exit(2) }
const docEnv = (f) => existsSync(f) ? Object.fromEntries(readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')])) : {}
const env = docEnv(join(GOC_REPO, '.env')), envLocal = docEnv(join(GOC_REPO, '.env.local'))

const canVe = new Map()
for (const f of loTep) for (const c of JSON.parse(readFileSync(f, 'utf8'))) if (c.so_do) canVe.set(c.ma_nguon, c.so_do)

const db = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
const { rows } = await db.query(`select ma_cau, ten_de_goc, anh_dap_an from dai_cau_hoi where xoa_at is null and ten_de_goc = any($1::text[])`,
  [[...canVe.keys()].map((m) => `${SACH} · ${m}`)])
let sb = null
const thang = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` })()
const doi = [], giong = [], thieu = [], rac = []
for (const r of rows) {
  const ma = r.ten_de_goc.slice(SACH.length + 3), svg = veSoDo(JSON.parse(readFileSync(join(SODO, canVe.get(ma)), 'utf8')))
  let cu = null
  if (r.anh_dap_an) { const res = await fetch(r.anh_dap_an); cu = res.ok ? await res.text() : null }
  if (cu === svg) { giong.push(ma); continue }
  doi.push({ r, ma, svg })
}
for (const m of canVe.keys()) if (!rows.some((r) => r.ten_de_goc === `${SACH} · ${m}`)) thieu.push(m)
try {
  await db.query('begin')
  for (const d of doi) {
    let url = `dry://kho-anh/sach/${thang}/…_${d.ma}.svg`
    if (GHI) {
      sb ??= createClient(envLocal.VITE_SUPABASE_URL, envLocal.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
      const path = `sach/${thang}/${randomUUID()}_${d.ma.replace(/\W+/g, '-')}.svg`
      const { error } = await sb.storage.from('kho-anh').upload(path, Buffer.from(d.svg), { contentType: 'image/svg+xml', upsert: false })
      if (error) throw new Error(`upload ${path}: ${error.message}`)
      url = sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
    }
    await db.query(`update dai_cau_hoi set anh_dap_an = $2 where ma_cau = $1`, [d.r.ma_cau, url])
    if (d.r.anh_dap_an) rac.push(d.r.anh_dap_an)
  }
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message); process.exitCode = 1 }
await db.end()
console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ', `· cần vẽ ${canVe.size} · đổi ${doi.length} · giữ nguyên ${giong.length} · chưa có trong kho ${thieu.length}`)
if (doi.length) console.log('  Đổi:', doi.map((d) => `${d.ma} (${d.r.ma_cau})`).join(', '))
if (thieu.length) console.log('  Chưa có trong kho:', thieu.join(', '))
if (GHI && rac.length) console.log(`  Ảnh cũ để lại trong bucket (${rac.length}) — chưa xoá, chờ người gật:\n   ` + rac.join('\n   '))
