// Soát cấu hình gọi Claude (worker/danhgia.mjs) — KHÔNG gọi mạng, không cần API key.
// Bắt các lỗi API dễ sai mà tsc không thấy: model string sai, tham số đã bị gỡ khỏi
// Opus 4.8 (budget_tokens / temperature), schema vi phạm ràng buộc structured outputs,
// thiếu xử lý stop_reason, và — quan trọng nhất — key Anthropic rò sang bundle browser.
// Chạy: node scripts/verify_danhgia_claude.mjs
import { readFileSync } from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'

const src = readFileSync('worker/danhgia.mjs', 'utf8')
let fail = 0
const ok = (c, m) => { if (!c) { console.error('✗', m); fail++ } else console.log('✓', m) }

// 1. SDK có đúng đường gọi không
const c = new Anthropic({ apiKey: 'sk-ant-fake-for-shape-check' })
ok(typeof c.messages?.create === 'function', 'SDK có client.messages.create')

// 2. Model string — phải khớp danh mục, KHÔNG được tự chế hậu tố ngày
const model = src.match(/const MODEL = '([^']+)'/)?.[1]
ok(model === 'claude-opus-4-8', `model = ${model} (đúng chuỗi trong danh mục, không hậu tố ngày)`)

// 3. Rút SCHEMA ra kiểm ràng buộc structured outputs.
// Tự trích + eval tại chỗ (KHÔNG sinh file tạm rồi import — file tạm bị quên xoá
// là script sau chạy trên schema CŨ mà không ai biết).
let SCHEMA = null
try {
  const i = src.indexOf('const SCHEMA = {'), j = src.indexOf('async function phan')
  SCHEMA = new Function(src.slice(i, j).replace('const SCHEMA =', 'return'))()
} catch { /* để ok() bên dưới báo */ }
ok(!!SCHEMA, 'trích được SCHEMA')
if (SCHEMA) {
  const loi = []
  const duyet = (s, path = '$') => {
    if (s?.type === 'object') {
      if (s.additionalProperties !== false) loi.push(`${path}: thiếu additionalProperties:false`)
      if (!Array.isArray(s.required)) loi.push(`${path}: thiếu required[]`)
      for (const [k, v] of Object.entries(s.properties ?? {})) duyet(v, `${path}.${k}`)
      // required phải nằm trong properties
      for (const r of s.required ?? []) if (!s.properties?.[r]) loi.push(`${path}: required "${r}" không có trong properties`)
    }
    if (s?.type === 'array') duyet(s.items, `${path}[]`)
    // Từ khoá structured outputs KHÔNG hỗ trợ
    for (const k of ['minLength', 'maxLength', 'minimum', 'maximum', 'multipleOf', 'minItems', 'maxItems', 'pattern'])
      if (k in (s ?? {})) loi.push(`${path}: dùng "${k}" — structured outputs KHÔNG hỗ trợ`)
  }
  duyet(SCHEMA)
  ok(loi.length === 0, loi.length ? `schema có vấn đề:\n     ${loi.join('\n     ')}` : 'schema hợp lệ với ràng buộc structured outputs')
}

// 4. Các luật API dễ sai
ok(/thinking: \{ type: 'adaptive' \}/.test(src), "thinking dùng {type:'adaptive'} (budget_tokens bị 400 trên Opus 4.8)")
ok(!/budget_tokens/.test(src), 'không còn budget_tokens')
ok(!/temperature|top_p|top_k/.test(src), 'không dùng temperature/top_p/top_k (bị 400 trên Opus 4.8)')
ok(/stop_reason === 'refusal'/.test(src), 'có xử lý stop_reason refusal TRƯỚC khi đọc content')
ok(/stop_reason === 'max_tokens'/.test(src), 'có xử lý max_tokens (JSON cụt)')
ok(/cache_control/.test(src), 'system prompt có cache_control (lần 2 trở đi đọc cache ~1/10 giá)')
ok(!/VITE_ANTHROPIC/.test(src), 'KHÔNG dùng biến VITE_* cho key (sẽ lọt vào bundle browser)')

// 5. Key không được rò sang phía browser.
// Chỉ soi CODE THẬT — comment nhắc tên Anthropic là bình thường và nên có.
// (Lần đầu viết check này đã báo nhầm vì bắt cả comment.)
const boComment = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ 	]*\/\/.*$/gm, '')
const duyetBrowser = (f) => {
  const code = boComment(readFileSync(f, 'utf8'))
  const xau = []
  if (/from\s+['"]@anthropic-ai\/sdk['"]/.test(code)) xau.push('import SDK Anthropic')
  if (/api\.anthropic\.com/.test(code)) xau.push('gọi thẳng api.anthropic.com')
  if (/sk-ant-/.test(code)) xau.push('có chuỗi giống API key')
  if (/VITE_ANTHROPIC|ANTHROPIC_API_KEY/.test(code)) xau.push('đọc biến ANTHROPIC_API_KEY')
  ok(xau.length === 0, xau.length ? `${f}: ${xau.join(', ')} — key sẽ vào bundle!` : `${f}: không nhúng gì của Anthropic (browser sạch)`)
}
for (const f of ['src/lib/danhgia.ts', 'src/screens/danhgia/DashboardHocTapScreen.tsx']) duyetBrowser(f)

console.log(fail ? `\n❌ ${fail} chỗ cần sửa` : '\n✅ Cấu hình gọi Claude hợp lệ về mặt cấu trúc (CHƯA gọi thật — thiếu API key)')
process.exit(fail ? 1 : 0)
