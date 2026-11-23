// ============================================================================
// NHẬP TOKEN CLAUDE CODE của máy này vào sổ chi phí AI (Thùy 23/11: "token claude code t làm có tính được trên đấy ko" → "Làm đi").
// ----------------------------------------------------------------------------
// Claude Code ghi nhật ký từng câu trả lời ở ~/.claude/projects/**/*.jsonl (kèm model + usage). Script đọc nhật ký, bỏ dòng trùng
// (một câu trả lời có thể ghi nhiều dòng — khoá message.id + requestId), gộp theo (máy · phiên · model · ngày VN) rồi gửi
// fn_ai_nhap_claude_code (upsert theo khoá ⇒ chạy lại bao nhiêu lần cũng KHÔNG đếm trùng). Phiên bot (claude_phien) DB tự bỏ qua.
// Người dùng gắn vào: mã nhân sự AI_CLAUDE_CODE_MA_NS (.env.local) — mặc định NS001 (máy của Thùy).
// CHỈ ĐẾM TỪ 01/11/2026 (giờ VN) — Thùy: "Quá khứ ko quan trọng … hoặc từ đầu tháng 11 thôi" (khớp số phiên Claude, cũng từ 01/11).
// Chạy:  node scripts/ai/nhap-claude-code.mjs            → nhật ký sửa trong 3 ngày gần nhất (bot phiên gọi lúc khởi động + mỗi ngày một lần)
//        node scripts/ai/nhap-claude-code.mjs --tu-moc   → mọi nhật ký từ mốc 01/11 (lần đầu ở mỗi máy)
// ============================================================================
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { homedir, hostname } from 'node:os'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const envRaw = (() => { try { return readFileSync(join(root, '.env.local'), 'utf8') } catch { return '' } })()
const env = (k) => envRaw.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '') ?? process.env[k]
const svc = createClient(env('VITE_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE'))
const MOC = Date.parse('2026-11-01T00:00:00+07:00')   // trước mốc này không đếm
const MAY = hostname()
const GOC = join(homedir(), '.claude', 'projects')

const { data: ns, error: eNs } = await svc.from('nhan_su').select('id').eq('ma_ns', env('AI_CLAUDE_CODE_MA_NS') ?? 'NS001').maybeSingle()
if (eNs || !ns) { console.error('Không tìm thấy nhân sự gắn Claude Code:', eNs?.message ?? 'không có mã'); process.exit(1) }

const tu = process.argv.includes('--tu-moc') ? MOC : Math.max(MOC, Date.now() - 3 * 86400e3)
const files = []
const walk = (d) => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = join(d, f.name); if (f.isDirectory()) walk(p); else if (f.name.endsWith('.jsonl')) files.push(p) } }
try { walk(GOC) } catch { console.log('Máy này chưa có nhật ký Claude Code.'); process.exit(0) }

// dự án = thư mục repo (đoạn ngay sau BKERP\ hoặc tên thư mục cwd)
const duAn = (cwd) => {
  if (!cwd) return '?'
  const p = cwd.split(/[\\/]/)
  const i = p.findIndex((x) => x.toUpperCase() === 'BKERP')
  return (i >= 0 && p[i + 1]) ? p[i + 1] : p[p.length - 1]
}
const ngayVN = (ts) => new Date(Date.parse(ts) + 7 * 3600e3).toISOString().slice(0, 10)   // chỉ để lấy NGÀY theo giờ VN (+7)

const gop = new Map()
let soFile = 0
for (const f of files) {
  if (statSync(f).mtimeMs < tu) continue
  soFile++
  const phien = basename(f, '.jsonl')
  const thay = new Set()
  let cwd = null
  let txt
  try { txt = readFileSync(f, 'utf8') } catch { continue }
  for (const dong of txt.split('\n')) {
    if (!cwd) { const m = dong.match(/"cwd":"([^"]+)"/); if (m) cwd = m[1].replace(/\\\\/g, '\\') }
    if (!dong.includes('"usage"')) continue
    let j; try { j = JSON.parse(dong) } catch { continue }
    const m = j.message
    if (j.type !== 'assistant' || !m?.usage || !m.id || !String(m.model ?? '').startsWith('claude-') || !j.timestamp || Date.parse(j.timestamp) < MOC) continue
    const k = m.id + (j.requestId ?? '')
    if (thay.has(k)) continue
    thay.add(k)
    const u = m.usage, h1 = u.cache_creation?.ephemeral_1h_input_tokens ?? 0
    const ngay = ngayVN(j.timestamp)
    const khoa = `${MAY}:${phien}:${m.model}:${ngay}`
    const g = gop.get(khoa) ?? { nguon_id: khoa, phien, at: j.timestamp, model: m.model, du_an: duAn(j.cwd ?? cwd), vao: 0, ghi_5m: 0, ghi_1h: 0, doc: 0, ra: 0 }
    g.vao += u.input_tokens ?? 0
    g.ghi_1h += h1
    g.ghi_5m += Math.max((u.cache_creation_input_tokens ?? 0) - h1, 0)
    g.doc += u.cache_read_input_tokens ?? 0
    g.ra += u.output_tokens ?? 0
    if (j.timestamp > g.at) g.at = j.timestamp
    gop.set(khoa, g)
  }
}

const ds = [...gop.values()]
let ghi = 0
for (let i = 0; i < ds.length; i += 2000) {
  const { data, error } = await svc.rpc('fn_ai_nhap_claude_code', { p_ns: ns.id, p_ds: ds.slice(i, i + 2000) })
  if (error) { console.error('Lỗi ghi sổ:', error.message); process.exit(1) }
  ghi += data.ghi
}
console.log(`Claude Code · ${MAY}: đọc ${soFile} nhật ký, ${ds.length} nhóm (phiên × model × ngày), ghi ${ghi} dòng (phiên bot đã bỏ qua).`)
