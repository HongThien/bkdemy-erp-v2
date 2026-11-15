// ghep-brief.mjs — dựng brief SOẠN/KIỂM cho 1 batch toanmath = đầu riêng của batch (batch/<ma>/_dau-brief.md: danh sách đề, đường dẫn,
// điểm cần xét — KHÔNG chứa luật) + luật cắt từ spec-giai-bai.md (scripts/kho/cat-luat.mjs). Thùy 15/11: luật chỉ ở spec, brief không viết tay.
//   node kho-rules/dai/lo/toanmath/ghep-brief.mjs <BATCH> <khối>        vd: ghep-brief.mjs B055 9
// Ra: batch/<ma>/brief-soan.md, batch/<ma>/brief-soat.md (dòng đầu `luat: <mã>`). Spec đổi ⇒ chạy lại.
import { spawnSync } from 'node:child_process'
import path from 'node:path'
const [MA, KHOI] = process.argv.slice(2)
if (!MA || !KHOI) { console.error('Dùng: ghep-brief.mjs <BATCH> <khối>'); process.exit(2) }
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const ROOT = path.resolve(HERE, '../../../..')
const D = path.join(HERE, 'batch', MA)
const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts/kho/cat-luat.mjs'), KHOI, '--ra', D, '--dau', path.join(D, '_dau-brief.md')], { stdio: 'inherit' })
process.exit(r.status ?? 1)
