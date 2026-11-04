// Duyệt nhanh TOÀN BỘ phần Hình học (Học) — Thùy 04/11: "duyệt hết các bài trong phần hình học đi chứ".
// Cùng kiểu HH00104 (Hình 7) / Hình 8: da_duyet=true, duyet_nguon='ai', duyet_boi trống, duyet_at=now().
// Chỉ câu ở BÀI THẬT (không phải bài chờ HH??000000), chưa xoá, chưa duyệt, kiem_may<>'nghi', CÓ lời giải. + bài hinh_hoc_bai chưa duyệt.
//   node scripts/_duyet_hinh_hoc_het.mjs --thu   → ROLLBACK     |   node scripts/_duyet_hinh_hoc_het.mjs → ghi thật
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const THU = process.argv.includes('--thu')
const DK = `xoa_at is null and not da_duyet and dang_chinh !~ '000000$' and kiem_may is distinct from 'nghi' and coalesce(loi_giai,'') <> ''`
try {
  await q('begin')
  const t = {
    cau: Number((await q(`select count(*) n from hinh_hoc_cau_hoi where ${DK}`))[0].n),
    bai: Number((await q(`select count(*) n from hinh_hoc_bai where not da_duyet`))[0].n),
    cho_cau: Number((await q(`select count(*) n from hinh_hoc_cau_hoi where xoa_at is null and not da_duyet and dang_chinh ~ '000000$'`))[0].n),
    da: Number((await q(`select count(*) n from hinh_hoc_cau_hoi where xoa_at is null and da_duyet`))[0].n),
  }
  console.log('TRƯỚC', t)
  const r1 = await q(`update hinh_hoc_cau_hoi set da_duyet = true, duyet_nguon = 'ai', duyet_boi = null, duyet_at = now() where ${DK} returning ma_cau`)
  const r2 = await q(`update hinh_hoc_bai set da_duyet = true, duyet_boi = null, duyet_at = now() where not da_duyet returning ma_bai`)
  const s = {
    cau: r1.length, bai: r2.length,
    cho_cau: Number((await q(`select count(*) n from hinh_hoc_cau_hoi where xoa_at is null and not da_duyet and dang_chinh ~ '000000$'`))[0].n),
    da: Number((await q(`select count(*) n from hinh_hoc_cau_hoi where xoa_at is null and da_duyet`))[0].n),
    con_chua_o_bai_that: Number((await q(`select count(*) n from hinh_hoc_cau_hoi where xoa_at is null and not da_duyet and dang_chinh !~ '000000$'`))[0].n),
  }
  console.log('SAU', s)
  if (s.cau !== t.cau || s.bai !== t.bai || s.cho_cau !== t.cho_cau || s.da !== t.da + t.cau) throw new Error('Lệch kỳ vọng — rollback')
  if (THU) { await q('rollback'); console.log('--thu ⇒ ROLLBACK') } else { await q('commit'); console.log('ĐÃ GHI.') }
} catch (e) { await q('rollback'); console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
