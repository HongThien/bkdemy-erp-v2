// Dọn tiền tố ý con "a)" "b." "c)"… ở đầu MỖI dòng trong noi_dung/loi_giai của kho câu.
// Cùng quy tắc với stripYCon (src/lib/kho/api.ts): chỉ cắt 1 chữ cái a–h + ')'/'.' + khoảng trắng.
//
// Dry-run (mặc định, CHỈ ĐỌC):   node scripts/_fix_ycon.mjs
// Ghi thật (backup trước):        node scripts/_fix_ycon.mjs --apply
// Tuỳ chọn: --khoi=07 (mặc định 07) | --khoi=all | --khtn (gồm cả bảng KHTN)
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8')
  .match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')

const APPLY = process.argv.includes('--apply')
const khoiArg = (process.argv.find((a) => a.startsWith('--khoi=')) ?? '--khoi=07').split('=')[1]
const TABLES = ['dai_cau_hoi', ...(process.argv.includes('--khtn') ? ['khtn_cau_hoi'] : [])]

// === CHÍNH XÁC bằng stripYCon trong app ===
const stripYCon = (s) => s == null ? s : s.split('\n').map((ln) => ln.replace(/^(\s*)[a-h][.)]\s+/, '$1')).join('\n')

const c = new pg.Client({ connectionString: url })
await c.connect()

let grandChanged = 0
const backup = []
for (const tbl of TABLES) {
  const where = khoiArg === 'all' ? '' : ` where ma_cau like '${khoiArg}%'`
  const { rows } = await c.query(`select ma_cau, noi_dung, loi_giai from public.${tbl}${where}`)
  const changed = []
  for (const r of rows) {
    const nd = stripYCon(r.noi_dung), lg = stripYCon(r.loi_giai)
    if (nd !== r.noi_dung || lg !== r.loi_giai) changed.push({ ma_cau: r.ma_cau, old: r, next: { noi_dung: nd, loi_giai: lg } })
  }
  console.log(`\n### ${tbl} (khoi=${khoiArg}) — ${rows.length} câu, ${changed.length} cần dọn`)
  for (const ch of changed.slice(0, 8)) {
    const oldLine = (ch.old.noi_dung ?? '').split('\n').find((l) => /^(\s*)[a-h][.)]\s+/.test(l)) ?? ''
    const newLine = stripYCon(oldLine)
    console.log(`  ${ch.ma_cau}:  «${oldLine.trim()}»  →  «${newLine.trim()}»`)
  }
  if (changed.length > 8) console.log(`  … và ${changed.length - 8} câu nữa`)
  backup.push({ tbl, rows: changed.map((ch) => ({ ma_cau: ch.ma_cau, noi_dung: ch.old.noi_dung, loi_giai: ch.old.loi_giai })) })
  grandChanged += changed.length

  if (APPLY && changed.length) {
    await c.query('begin')
    try {
      for (const ch of changed) {
        await c.query(`update public.${tbl} set noi_dung=$1, loi_giai=$2 where ma_cau=$3`, [ch.next.noi_dung, ch.next.loi_giai, ch.ma_cau])
      }
      await c.query('commit')
      console.log(`  ✓ ĐÃ CẬP NHẬT ${changed.length} câu trong ${tbl}`)
    } catch (e) { await c.query('rollback'); console.error(`  ✗ rollback ${tbl}:`, e.message); throw e }
  }
}

if (APPLY) {
  const bkPath = join(root, `scripts/_ycon_backup_${khoiArg}.json`)
  writeFileSync(bkPath, JSON.stringify(backup, null, 2))
  console.log(`\nBackup (giá trị CŨ) ghi tại: ${bkPath} — cần hoàn tác thì restore từ file này.`)
  console.log(`TỔNG đã dọn: ${grandChanged} câu.`)
} else {
  console.log(`\n[DRY-RUN] Tổng ${grandChanged} câu sẽ dọn. Chạy lại với --apply để ghi thật.`)
}
await c.end()
