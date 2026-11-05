// soat-nghi-tieu-hoc-ghi.mjs — ghi kết quả soát lại câu kho tiểu học bị máy nghi đáp số (Thùy 05/11 "Soát 90 câu nghi").
//
//   node scripts/kho/soat-nghi-tieu-hoc-ghi.mjs <thư mục có ket-*.json + cau.json> [--ghi]     (không --ghi = chạy thử, ROLLBACK)
//
// Mỗi câu: kho_dung / kho_sai / de_hong đã sửa ⇒ cập nhật trường *_moi khác null, kiem_may = 'khop' (ghi chú phân xử vào kiem_may_ghi),
// da_duyet = true · duyet_nguon 'ai'. `bo: true` ⇒ KHÔNG đụng (để người quyết; không xoá — luật xoá). 1 transaction, chặn nếu câu
// đã đổi kể từ lúc xuất (so dap_an/noi_dung với cau.json).
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'
import { bien } from './cau-hinh.mjs'

const [dir] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const GHI = process.argv.includes('--ghi')
const goc = new Map(JSON.parse(readFileSync(join(dir, 'cau.json'), 'utf8')).map((x) => [x.ma_cau, x]))
const ket = readdirSync(dir).filter((f) => /^ket-\w+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL').gia_tri })
await c.connect()
const tk = { kho_dung: 0, kho_sai: 0, de_hong: 0, bo: 0, sua_de: 0 }
try {
  await c.query('begin')
  for (const k of ket) {
    const g = goc.get(k.ma_cau)
    if (!g) throw new Error(`${k.ma_cau}: không có trong cau.json`)
    if (k.bo) { tk.bo++; continue }
    tk[k.ket_luan]++
    const { rows: [cur] } = await c.query('select noi_dung, dap_an, da_duyet from dai_cau_hoi where ma_cau = $1 for update', [k.ma_cau])
    if (cur.noi_dung !== g.noi_dung || cur.dap_an !== g.dap_an) throw new Error(`${k.ma_cau}: câu đã đổi kể từ lúc xuất — dừng`)
    if (k.noi_dung_moi || k.lua_chon_moi) tk.sua_de++
    if (k.lua_chon_moi && k.lua_chon_moi.length !== 4) throw new Error(`${k.ma_cau}: lua_chon_moi phải 4 phương án`)
    await c.query(
      `update dai_cau_hoi set
         noi_dung = coalesce($2, noi_dung), lua_chon = coalesce($3::jsonb, lua_chon), dap_an = coalesce($4, dap_an), loi_giai = coalesce($5, loi_giai),
         kiem_may = 'khop', kiem_may_at = now(), kiem_may_boi = 'claude_code', kiem_may_ghi = $6, da_duyet = true, duyet_nguon = 'ai', duyet_at = now()
       where ma_cau = $1`,
      [k.ma_cau, k.noi_dung_moi, k.lua_chon_moi ? JSON.stringify(k.lua_chon_moi) : null, k.dap_an_moi, k.loi_giai_moi,
        `Soát lại 05/11 (Opus giải mù): ${k.ket_luan} — ${k.ly_do}`.slice(0, 1000)])
  }
  console.log(`${GHI ? 'GHI THẬT' : 'CHẠY THỬ'} — ${ket.length} câu:`, tk)
  await c.query(GHI ? 'commit' : 'rollback')
} catch (e) { await c.query('rollback'); console.error('❌', e.message); process.exitCode = 1 }
await c.end()
