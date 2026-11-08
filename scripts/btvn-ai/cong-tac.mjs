// Bật/tắt nút "Chấm BTVN tự động" trên app trợ giảng (he_thong_cong_tac 'btvn_cham_tu_dong') — app tự ẩn/hiện, không cần deploy.
// Chạy: node scripts/btvn-ai/cong-tac.mjs bat|tat|xem [--env <file .env có quyền ghi>]
// Mỗi lần đổi, trigger tự ghi he_thong_cong_tac_log (ai, lúc nào, cũ → mới).
import { docEnv, ketNoi } from './chung.mjs'

const lenh = process.argv[2]
if (!['bat', 'tat', 'xem'].includes(lenh)) { console.error('Dùng: node scripts/btvn-ai/cong-tac.mjs bat|tat|xem [--env <file>]'); process.exit(1) }
const c = await ketNoi(docEnv())
if (lenh !== 'xem') await c.query(`update he_thong_cong_tac set bat = $1, updated_at = now() where ma = 'btvn_cham_tu_dong'`, [lenh === 'bat'])
const r = (await c.query(`select bat, updated_at from he_thong_cong_tac where ma = 'btvn_cham_tu_dong'`)).rows[0]
console.log(r ? `Chấm BTVN tự động: ${r.bat ? 'BẬT' : 'TẮT'} (đổi lúc ${r.updated_at.toISOString()})` : 'Chưa có công tắc — áp migration 202611081103 trước.')
await c.end()
