// Smoke test kho: insert dạng + câu (FK) trong transaction rồi ROLLBACK (không để lại data).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8')
  .match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')

const c = new pg.Client({ connectionString: url })
await c.connect()
try {
  await c.query('begin')
  const d = await c.query(
    `insert into dai_ban_do (khoi, ma_chuong, ten_chuong, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do)
     values ('6','C1','Số học','CD1','Ước & bội','CDE1','UCLN-BCNN','Tìm UCLN',2) returning ma_dang`)
  const maDang = d.rows[0].ma_dang
  const q = await c.query(
    `insert into dai_cau_hoi (dang_chinh, loai_cau, noi_dung, dap_an) values ($1,'tra_loi_ngan','Tìm UCLN(12,18)','6') returning ma_cau`,
    [maDang])
  console.log(`✅ insert OK — dạng=${maDang}, câu=${q.rows[0].ma_cau} (FK + sequence + prefix chạy đúng)`)
  await c.query('rollback')
  console.log('✅ đã rollback — DB sạch, không để lại data test')
} catch (e) {
  console.error('❌', e.message); process.exitCode = 1
  try { await c.query('rollback') } catch {}
} finally {
  await c.end()
}
