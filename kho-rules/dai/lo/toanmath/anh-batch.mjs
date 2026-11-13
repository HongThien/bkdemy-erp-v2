// anh-batch.mjs — HÌNH CỦA BATCH SỐNG TRÊN KHO, KHÔNG SỐNG Ở MÁY (Thùy 13/11: "vẽ hình xong phải up lên kho luôn chứ sao lại để ở máy").
//   node kho-rules/dai/lo/toanmath/anh-batch.mjs day <BATCH> [MA…]   — đẩy <LV>/img/* + <LV>/tam/*.mjs (mã vẽ) lên kho (ghi đè bản cũ cùng tên)
//   node kho-rules/dai/lo/toanmath/anh-batch.mjs keo <BATCH> [MA…]   — kéo về <LV>/img, <LV>/tam những tệp máy này CHƯA có
// Chỗ để: bucket `kho-anh`, đường `lam-viec/toanmath/<BATCH>/<MA>/img|tam/<tệp>` (cố định theo tên ⇒ máy nào cũng tìm ra).
// Khi nào chạy: trạm soạn/soát vẽ xong ⇒ `day` (brief làm lại hình + quy trình batch gọi); ghi-batch.sh tự `keo` trước khi ghi.
// <LV> = ${BK_LV:-C:/Users/WBPC/bk-kho-lam-viec}/de-thi/toanmath/<BATCH>/<MA>. Đây là kho LÀM VIỆC; ảnh dùng trong câu vẫn do ghi.mjs đẩy riêng lúc ghi.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const ROOT = path.resolve(HERE, '../../../..')
const { createClient } = createRequire(path.join(ROOT, 'package.json'))('@supabase/supabase-js')
const [CACH, BATCH, ...CHI] = process.argv.slice(2)
if (!['day', 'keo'].includes(CACH) || !BATCH) { console.error('Dùng: anh-batch.mjs day|keo <BATCH> [MA…]'); process.exit(2) }
const env = Object.fromEntries(readFileSync(path.join(ROOT, '.env.local'), 'utf8').split(/\r?\n/).map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/)).filter(Boolean).map((m) => [m[1], m[2]]))
if (!env.VITE_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE) { console.error('thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local'); process.exit(2) }
const kho = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } }).storage.from('kho-anh')
const KV = `${process.env.BK_LV || 'C:/Users/WBPC/bk-kho-lam-viec'}/de-thi/toanmath/${BATCH}`
const ds = JSON.parse(readFileSync(path.join(HERE, 'batch', BATCH, 'ds-de.json'), 'utf8')).map((d) => d.ma).filter((m) => !CHI.length || CHI.includes(m))
const LOAI = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', mjs: 'text/plain' }
const loai = (f) => LOAI[f.split('.').pop().toLowerCase()]
let n = 0, loi = 0
for (const ma of ds) {
  for (const sub of ['img', 'tam']) {
    const dir = path.join(KV, ma, sub), goc = `lam-viec/toanmath/${BATCH}/${ma}/${sub}`
    if (CACH === 'day') {
      if (!existsSync(dir)) continue
      for (const f of readdirSync(dir)) {
        if (!loai(f) || !statSync(path.join(dir, f)).isFile() || (sub === 'tam' && !f.endsWith('.mjs'))) continue
        const { error } = await kho.upload(`${goc}/${f}`, readFileSync(path.join(dir, f)), { contentType: loai(f), upsert: true })
        if (error) { loi++; console.error(`✘ ${ma}/${sub}/${f}: ${error.message}`) } else n++
      }
    } else {
      const { data, error } = await kho.list(goc, { limit: 1000 })
      if (error) { loi++; console.error(`✘ liệt kê ${goc}: ${error.message}`); continue }
      for (const o of data || []) {
        if (!o.id || existsSync(path.join(dir, o.name))) continue
        const r = await kho.download(`${goc}/${o.name}`)
        if (r.error) { loi++; console.error(`✘ ${ma}/${sub}/${o.name}: ${r.error.message}`); continue }
        mkdirSync(dir, { recursive: true }); writeFileSync(path.join(dir, o.name), Buffer.from(await r.data.arrayBuffer())); n++
      }
    }
  }
}
console.log(`${CACH === 'day' ? '⬆ đẩy' : '⬇ kéo'} ${n} tệp · ${ds.length} đề · ${BATCH}${loi ? ` · ${loi} LỖI` : ''}`)
process.exit(loi ? 1 : 0)
