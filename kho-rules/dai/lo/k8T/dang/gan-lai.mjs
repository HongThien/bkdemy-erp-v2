// gan-lai.mjs — gán lại câu 8T vào tầng dạng mới (170 dạng, ghi-dang.mjs). Đầu vào gan-lai-ket-qua.json = đối chiếu 2 trạm Sonnet
// (lượt 1 biết nhóm cũ · lượt 2 MÙ, đề đảo thứ tự) — luật [8T-26]: hai trạm trùng dạng mới gán, lệch/trống ⇒ KHÔNG đụng (chờ trưởng khối).
//   cao        = 2 trạm cùng dạng, cả hai mức cao  ⇒ nguon 'ai' nếu câu ĐÃ duyệt, 'doi_ung' nếu chưa (chưa có lý thuyết dạng ⇒ chưa tự duyệt)
//   dong_y_vua = 2 trạm cùng dạng, ≥1 trạm mức vừa ⇒ nguon 'doi_ung' (giữ chỗ, KHÔNG tự duyệt)
//   cho        = bỏ qua
//   node kho-rules/dai/lo/k8T/dang/gan-lai.mjs [--ghi]      (mặc định chạy thử rồi ROLLBACK)
import pg from 'pg'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const DIR = dirname(fileURLToPath(import.meta.url))
const GHI = process.argv.includes('--ghi')
process.loadEnvFile('.env')
const ket = JSON.parse(readFileSync(join(DIR, 'gan-lai-ket-qua.json'), 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
try {
  await c.query('begin')
  const dangOk = new Set((await c.query(`select id from dai_bdm_dang_bai`)).rows.map((r) => r.id))
  const truoc = (await c.query(`select count(*) filter (where da_duyet)::int duyet, count(*)::int tong from dai_cau_hoi where dang_chinh like 'T18T%' and xoa_at is null`)).rows[0]
  const dem = { cao: 0, dong_y_vua: 0, doi_dang: 0, giu_nguyen: 0, moi: 0 }
  for (const k of ket) {
    if (k.kq === 'cho') continue
    if (!dangOk.has(k.dang)) throw new Error(`dạng ${k.dang} (${k.ma_cau}) không tồn tại`)
    // câu CHƯA duyệt ⇒ 'doi_ung' (không kích trigger tự duyệt): dạng chưa có lý thuyết thì câu chưa được coi là "chắc" (§A3, §C6)
    const nguon = k.kq === 'cao' && k.duyet ? 'ai' : 'doi_ung'
    const cu = (await c.query(`select dang_bai_id from dai_bdm_gan_cau where ma_cau = $1`, [k.ma_cau])).rows[0]
    if (cu?.dang_bai_id === k.dang && k.kq !== 'cao') { dem.giu_nguyen++; continue }
    await c.query(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon) values ($1,$2,$3)
      on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon, at = now()`, [k.ma_cau, k.dang, nguon])
    dem[k.kq]++; if (!cu) dem.moi++; else if (cu.dang_bai_id !== k.dang) dem.doi_dang++
  }
  const sau = (await c.query(`select count(*) filter (where da_duyet)::int duyet, count(*)::int tong from dai_cau_hoi where dang_chinh like 'T18T%' and xoa_at is null`)).rows[0]
  console.log('đếm:', dem, '· trước:', truoc, '· sau:', sau)
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
