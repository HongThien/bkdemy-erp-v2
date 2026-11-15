// Nhập 2 bài nhiều ý (Thùy 14/11) vào HH00143 — mô hình bài–ý 09/11: hinh_hoc_bai_y + mỗi ý = 1 câu (trigger ghép đề).
// Mặc định CHẠY THỬ (rollback, không upload). --ghi: upload hình + ghi thật.
import pg from 'pg'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { BAI, B1, B2 } from './du-lieu.mjs'
const D = 'kho-rules/hinh/lo/k8-dtb-2bai'
const GHI = process.argv.includes('--ghi')
const doc = (f) => Object.fromEntries(fs.readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const env = doc('.env'), envL = doc('.env.local')
const sb = GHI ? createClient(envL.VITE_SUPABASE_URL, envL.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } }) : null
const thang = new Date().toISOString().slice(0, 7)
const up = async (ten) => {
  if (!GHI) return 'https://thu/' + ten
  const path = `hinh_hoc/${thang}/${ten.replace('.png', '')}-${randomUUID()}.png`
  const { error } = await sb.storage.from('kho-anh').upload(path, fs.readFileSync(`${D}/${ten}`), { contentType: 'image/png', upsert: false })
  if (error) throw new Error('upload ' + ten + ': ' + error.message)
  return sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const bai = (await c.query('select ma_bai, ten_bai from hinh_hoc_bai where ma_bai=$1', [BAI])).rows[0]
if (!bai) throw new Error('không thấy bài ' + BAI)
let tt = (await c.query('select coalesce(max(thu_tu),0)::int m from hinh_hoc_cau_hoi where dang_chinh=$1 and xoa_at is null', [BAI])).rows[0].m
let ttY = (await c.query('select coalesce(max(thu_tu),0)::int m from hinh_hoc_bai_y where dang_chinh=$1 and xoa_at is null', [BAI])).rows[0].m
const trung = (await c.query('select count(*)::int n from hinh_hoc_bai_y where dang_chinh=$1 and xoa_at is null and loi_dan = any($2)', [BAI, [B1.loi_dan, B2.loi_dan]])).rows[0].n
if (trung) throw new Error('đã có bài nhiều ý cùng lời dẫn trong ' + BAI + ' — dừng, không nhập đôi')
const urls = {}
for (const b of [B1, B2]) urls[b.hinh] = await up(b.hinh)
await c.query('begin')
const ra = []
try {
  for (const b of [B1, B2]) {
    const y = (await c.query('insert into hinh_hoc_bai_y (dang_chinh, loi_dan, anh_de, thu_tu) values ($1,$2,$3,$4) returning ma_bai_y', [BAI, b.loi_dan, urls[b.hinh], ++ttY])).rows[0]
    for (const yy of b.y) {
      const q = (await c.query(`insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, bai_y, nhan_y, cau_hoi_y, da_biet, loi_giai, anh_dap_an, thu_tu, loai_cau, nguon_giai, giai_method, da_duyet)
        values ($1,'',$2,$3,$4,$5,$6,$7,$8,'tu_luan','ai','claude_code',false) returning ma_cau, noi_dung, anh_de`,
        [BAI, y.ma_bai_y, yy.nhan, yy.cau_hoi, yy.da_biet, yy.loi_giai, urls[b.hinh], ++tt])).rows[0]
      ra.push({ bai_y: y.ma_bai_y, nhan: yy.nhan, ma_cau: q.ma_cau, de: q.noi_dung, anh: !!q.anh_de })
    }
  }
  if (GHI) await c.query('commit'); else await c.query('rollback')
} catch (e) { await c.query('rollback'); console.error('LỖI, đã rollback:', e.message); await c.end(); process.exit(1) }
console.log(GHI ? '✅ ĐÃ GHI vào ' + BAI + ' — ' + bai.ten_bai : '🧪 CHẠY THỬ (rollback) — ' + BAI + ' ' + bai.ten_bai)
for (const x of ra) console.log('\n' + x.bai_y + ' ' + x.nhan + ' ' + x.ma_cau + (x.anh ? ' [có hình]' : ' [KHÔNG hình]') + '\n   ' + x.de.replace(/\n/g, '\n   '))
await c.end()
