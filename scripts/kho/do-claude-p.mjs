// ============================================================================
// do-claude-p.mjs — ĐO một lượt gọi Claude chạy nền (spec-luong-kho.md §9.4, §9.7 việc 2).
//
// Chạy trên MÁY SẼ CHẠY DÂY CHUYỀN (máy công ty). Trả lời 4 câu trước khi xây bất cứ trạm nào:
//   1. `claude -p` có chạy được bằng đăng nhập subscription trên máy này không?
//   2. Gọi skill bằng `/ten-skill` trong chế độ nền có nạp skill thật không?
//   3. `--json-schema` có giữ đúng khuôn đầu ra không?
//   4. CLAUDE.md của repo làm mỗi lượt gọi đắt thêm bao nhiêu token?
//
//   node scripts/kho/do-claude-p.mjs
//
// Tốn hạn mức: 3 lượt gọi rất ngắn. Không đụng DB, không ghi gì vào repo (skill thử nằm ở thư mục tạm).
// ⚠ CHƯA CHẠY THỬ: máy viết script này không có CLI `claude`. Lần chạy đầu trên máy công ty là lần thử thật.
// ============================================================================
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { GOC_REPO } from './cau-hinh.mjs'

const DAU_HIEU = 'SKILL-KHO-THU-DO-DA-NAP'
const SKILL = `---
name: kho-thu-do
description: Skill thử của dây chuyền kho, chỉ dùng để đo. Cộng hai số và trả JSON.
disable-model-invocation: true
arguments: [a, b]
---

Cộng hai số $a và $b.

Trả về đúng một đối tượng JSON có 2 trường:
- \`tong\`: tổng của hai số, kiểu số.
- \`dau_hieu\`: chuỗi "${DAU_HIEU}" — chuỗi này chỉ có trong skill, nên có nó trong kết quả là bằng chứng skill đã được nạp.

Không dùng công cụ nào. Không giải thích.
`
const KHUON = JSON.stringify({
  type: 'object',
  properties: { tong: { type: 'number' }, dau_hieu: { type: 'string' } },
  required: ['tong', 'dau_hieu'],
  additionalProperties: false,
})

function goi(ten, cwd, args) {
  const t0 = Date.now()
  const r = spawnSync('claude', args, { cwd, encoding: 'utf8', timeout: 5 * 60 * 1000 })
  const giay = ((Date.now() - t0) / 1000).toFixed(1)
  let j = null
  try { j = JSON.parse(r.stdout) } catch {}
  const u = j?.usage ?? {}
  return {
    ten, ma_thoat: r.status, loi_khoi_chay: r.error?.message ?? null, giay,
    la_loi: j?.is_error ?? null,
    token_vao: (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0),
    trong_do_doc_tu_bo_dem: u.cache_read_input_tokens ?? 0,
    token_ra: u.output_tokens ?? 0,
    chi_phi_uoc_usd: j?.total_cost_usd ?? null,
    so_luot: j?.num_turns ?? null,
    ket_qua: j?.result ?? null,
    ket_qua_theo_khuon: j?.structured_output ?? null,
    stdout_tho: j ? null : (r.stdout || '').slice(0, 500),
    stderr: (r.stderr || '').slice(0, 500) || null,
  }
}

// ── 0) CLI + đăng nhập ──────────────────────────────────────────────────────
const v = spawnSync('claude', ['--version'], { encoding: 'utf8', timeout: 30000 })
if (v.error || v.status !== 0) {
  console.error(`❌ Không gọi được CLI "claude" trên máy này (${v.error?.message ?? 'mã thoát ' + v.status}). Cài CLI rồi chạy lại.`)
  process.exit(2)
}
console.log('CLI:', v.stdout.trim())
const a = spawnSync('claude', ['auth', 'status'], { encoding: 'utf8', timeout: 30000 })
let dangNhap = null
try { dangNhap = JSON.parse(a.stdout || '{}') } catch {}
console.log('Đăng nhập:', dangNhap ? JSON.stringify({ loggedIn: dangNhap.loggedIn, authMethod: dangNhap.authMethod, subscriptionType: dangNhap.subscriptionType }) : '(không đọc được `claude auth status`)')
if (!dangNhap?.loggedIn) { console.error('❌ Chưa đăng nhập — chạy `claude login` rồi chạy lại.'); process.exit(2) }

// ── 1) Thư mục tạm có skill thử ─────────────────────────────────────────────
const tam = mkdtempSync(join(tmpdir(), 'kho-do-'))
mkdirSync(join(tam, '.claude', 'skills', 'kho-thu-do'), { recursive: true })
writeFileSync(join(tam, '.claude', 'skills', 'kho-thu-do', 'SKILL.md'), SKILL, 'utf8')

const CAU_TRAN = 'Trả lời đúng một con số, không giải thích: 17 + 25 bằng mấy?'
const CHUNG = ['--output-format', 'json', '--permission-mode', 'dontAsk', '--max-turns', '3']

const kq = [
  goi('A. câu trần, thư mục TRỐNG', tam, ['-p', CAU_TRAN, ...CHUNG]),
  goi('B. câu trần, trong REPO (nạp CLAUDE.md)', GOC_REPO, ['-p', CAU_TRAN, ...CHUNG]),
  goi('C. gọi SKILL + ép khuôn JSON, thư mục trống', tam, ['-p', '/kho-thu-do 17 25', ...CHUNG, '--json-schema', KHUON]),
]
try { rmSync(tam, { recursive: true, force: true }) } catch {}

// ── 2) Phán ─────────────────────────────────────────────────────────────────
const [A, B, C] = kq
const phan = {
  '1. chạy nền bằng đăng nhập hiện tại': A.ma_thoat === 0 && A.la_loi === false ? 'ĐƯỢC' : 'KHÔNG',
  '2. skill được nạp khi gọi /ten-skill': C.ket_qua_theo_khuon?.dau_hieu === DAU_HIEU ? 'CÓ' : 'KHÔNG (không thấy dấu hiệu của skill trong kết quả)',
  '3. đầu ra đúng khuôn': C.ket_qua_theo_khuon?.tong === 42 ? 'ĐÚNG (tong = 42)' : `SAI/THIẾU (${JSON.stringify(C.ket_qua_theo_khuon)})`,
  '4. CLAUDE.md làm mỗi lượt đắt thêm (token vào)': A.ma_thoat === 0 && B.ma_thoat === 0 ? `${B.token_vao - A.token_vao} (repo ${B.token_vao} − trống ${A.token_vao})` : 'không đo được',
}
console.log('\n=== TỪNG LƯỢT ===')
for (const x of kq) console.log(JSON.stringify(x, null, 2))
console.log('\n=== PHÁN ===')
for (const [k, val] of Object.entries(phan)) console.log(`${k}: ${val}`)
process.exit(Object.values(phan).slice(0, 3).every((s) => /^(ĐƯỢC|CÓ|ĐÚNG)/.test(s)) ? 0 : 1)
