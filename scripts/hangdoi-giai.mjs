// HÀNG ĐỢI GIẢI CÂU CHƯA CÓ LỜI GIẢI — worker cho Claude Code (Thùy 04/09; mig 202609041808/1811).
//
// Luồng: nhân sự bấm "📥 Đặt Claude giải" ở ERP (Duyệt lời giải AI › tab "Chưa có lời giải") → dòng vào
// `{dai,khtn,hgt}_cau_hoi_yeu_cau_giai` (xu_ly_at NULL = treo). Claude Code (quota subscription, KHÔNG API
// trả phí) chạy script này theo lệnh của Thùy ("xử lý hàng đợi giải"):
//   1) node scripts/hangdoi-giai.mjs --list [--out file.json]
//        → in/ghi JSON mọi yêu cầu treo của 3 môn, mỗi câu kèm ≤2 MẪU THAM KHẢO đã duyệt (ưu tiên cùng
//          cụm, rơi về cùng dạng) để trình bày cùng phong cách. Claude ĐỌC rồi TỰ GIẢI trong chat.
//   2) Claude viết file kết quả (LaTeX $…$, như kho):
//        · câu kho:  { mon: 'toan'|'khtn'|'hgt', yeu_cau_id, ma_cau, loi_giai, dap_an? }
//        · Hình:     { mon: 'hinh', loai: 'baitoan'|'bien_the', id, loi_giai, anh? }  (mig 202609041826/1835 —
//          ghi qua fn_hinh_ghi_loi_giai(…,'ai'): node → điền cách giải rỗng sẵn có / tạo cách mặc định; biến thể → update;
//          tự đóng yêu cầu; từ chối nếu bài đã có lời giải — script KHÔNG tự viết UPDATE cho Hình).
//   3) node scripts/hangdoi-giai.mjs --ghi ket_qua.json
//        → mỗi câu 1 transaction: UPDATE câu (loi_giai, dap_an nếu đang trống, nguon_giai='ai',
//          giai_method='claude_code', da_duyet=false) + đóng yêu cầu (xu_ly_at). Câu đã có lời giải
//          trong lúc chờ (người tự giải) → KHÔNG ghi đè, chỉ đóng yêu cầu. Kết quả tự hiện ở tab
//          "Lời giải mới từ Claude" để người duyệt.
//   4) node scripts/hangdoi-giai.mjs --don      → đóng yêu cầu mà câu đã có lời giải (dọn treo vô nghĩa).
//      node scripts/hangdoi-giai.mjs --bo <mon> <yeu_cau_id> [lý do]  → đóng 1 yêu cầu KHÔNG ghi gì
//      (không giải được / đề sai) — lý do nối vào ghi_chu để người thấy vì sao.
//
// 06/09 (mig 202609060122): 5 bảng yêu cầu giờ dùng chung với tool giaibai (người nhận bài = nguoi_giai ≠ null) —
// worker CHỈ đụng dòng nguoi_giai IS NULL (fn_*_yeu_cau_giai_cho đã lọc ở DB; --don lọc ở đây).
// Luật (CLAUDE.md §1.5): không ghi lời giải dở/không chắc — thà --bo kèm lý do còn hơn ghi sai.
// Kết nối: DATABASE_URL trong .env (cùng cách các script khác trong scripts/).
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const MON = ['toan', 'khtn', 'hgt']
const args = process.argv.slice(2)
const flag = (f) => args.includes(f)
const after = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined }

const c = new pg.Client({ connectionString: envf(join(root, '.env')).DATABASE_URL })
await c.connect()
// tiền tố bảng — lấy từ registry SQL (fn_kho_tbl), không chép lại map ở đây
const tbl = async (mon) => {
  const t = (await c.query('select public.fn_kho_tbl($1) t', [mon])).rows[0]?.t
  if (!t) throw new Error(`môn không hợp lệ: ${mon}`)
  return t
}

try {
  if (flag('--list')) {
    const out = []
    for (const mon of MON) {
      const t = await tbl(mon)
      const { rows } = await c.query('select * from public.fn_kho_yeu_cau_giai_cho($1)', [mon])
      for (const r of rows) {
        const mau = await c.query(
          `select ma_cau, noi_dung, lua_chon, dap_an, loi_giai from ${t}_cau_hoi
           where da_duyet and loi_giai is not null and xoa_at is null and ma_cau <> $1
             and ((ma_cum is not null and ma_cum = $2) or dang_chinh = $3)
           order by (ma_cum is not null and ma_cum = $2) desc, created_at limit 2`,
          [r.ma_cau, r.ma_cum, r.dang_chinh])
        out.push({ mon, ...r, mau_tham_khao: mau.rows })
      }
    }
    // Hình: yêu cầu treo kèm đề (giả thiết mô hình + phát biểu) + mẫu = cách giải node gốc (biến thể) — 1 fn, không join ở JS.
    for (const r of (await c.query('select * from public.fn_hinh_yeu_cau_giai_cho()')).rows) out.push({ mon: 'hinh', ...r })
    const txt = JSON.stringify(out, null, 2)
    const o = after('--out')
    if (o) { writeFileSync(o, txt, 'utf8'); console.log(`${out.length} yêu cầu treo → ${o}`) } else console.log(txt)
    const daCo = out.filter((x) => x.da_co_loi_giai).length
    if (daCo) console.error(`⚠ ${daCo} yêu cầu mà câu ĐÃ có lời giải (người tự làm) — chạy --don để đóng.`)
  } else if (flag('--ghi')) {
    const f = after('--ghi'); if (!f) throw new Error('--ghi <file.json>')
    const items = JSON.parse(readFileSync(f, 'utf8'))
    let ghi = 0, bo = 0
    for (const it of items) {
      if (it.mon === 'hinh') {
        if (!it.loai || !it.id || !(it.loi_giai?.trim() || it.anh)) { console.error('bỏ qua Hình (thiếu trường):', JSON.stringify(it).slice(0, 120)); continue }
        try { await c.query('select public.fn_hinh_ghi_loi_giai($1, $2, $3, $4, $5)', [it.loai, it.id, it.loi_giai?.trim() || null, it.anh ?? null, 'ai']); ghi++ }
        catch (e) { bo++; console.error(`hinh ${it.loai} ${it.id}: ${e.message}`) }
        continue
      }
      if (!it.mon || !it.yeu_cau_id || !it.ma_cau || !it.loi_giai?.trim()) { console.error('bỏ qua (thiếu trường):', JSON.stringify(it).slice(0, 120)); continue }
      const t = await tbl(it.mon)
      await c.query('begin')
      try {
        const u = await c.query(
          `update ${t}_cau_hoi set loi_giai = $2, dap_an = coalesce(dap_an, nullif($3, '')), nguon_giai = 'ai', giai_method = 'claude_code', da_duyet = false
           where ma_cau = $1 and xoa_at is null and loi_giai is null and anh_dap_an is null`,
          [it.ma_cau, it.loi_giai.trim(), it.dap_an ?? null])
        await c.query(`update ${t}_cau_hoi_yeu_cau_giai set xu_ly_at = now() where id = $1 and xu_ly_at is null`, [it.yeu_cau_id])
        await c.query('commit')
        if (u.rowCount) ghi++; else { bo++; console.error(`${it.ma_cau}: câu đã có lời giải sẵn — KHÔNG ghi đè, chỉ đóng yêu cầu.`) }
      } catch (e) { await c.query('rollback'); throw e }
    }
    console.log(`Đã ghi ${ghi} lời giải (chờ duyệt ở tab "Lời giải mới từ Claude") · ${bo} yêu cầu đóng không ghi.`)
  } else if (flag('--don')) {
    let n = 0
    for (const mon of MON) {
      const t = await tbl(mon)
      const r = await c.query(
        `update ${t}_cau_hoi_yeu_cau_giai y set xu_ly_at = now() from ${t}_cau_hoi c
         where c.ma_cau = y.ma_cau and y.xu_ly_at is null and y.nguoi_giai is null and (c.loi_giai is not null or c.anh_dap_an is not null)`)
      n += r.rowCount
    }
    const h = await c.query(`
      with a as (update hinh_baitoan_yeu_cau_giai y set xu_ly_at = now()
                 where y.xu_ly_at is null and y.nguoi_giai is null and exists (select 1 from hinh_cach_giai cg where cg.baitoan_id = y.baitoan_id and (cg.loi_giai is not null or cg.anh_loi_giai is not null)) returning 1),
           b as (update hinh_bien_the_yeu_cau_giai y set xu_ly_at = now() from hinh_baitoan_bien_the v
                 where v.id = y.bien_the_id and y.xu_ly_at is null and y.nguoi_giai is null and (v.loi_giai is not null or v.anh_loi_giai is not null) returning 1)
      select (select count(*) from a) + (select count(*) from b) n`)
    n += Number(h.rows[0].n)
    console.log(`Đã đóng ${n} yêu cầu mà bài đã có lời giải.`)
  } else if (flag('--bo')) {
    const [mon, id, ...ly] = args.slice(args.indexOf('--bo') + 1)
    if (!mon || !id) throw new Error('--bo <mon|hinh> <yeu_cau_id> [lý do]')
    const note = `[Claude bỏ: ${ly.join(' ') || 'không giải được'}]`
    let r
    if (mon === 'hinh') {
      r = await c.query(`update hinh_baitoan_yeu_cau_giai set xu_ly_at = now(), ghi_chu = concat_ws(' | ', ghi_chu, $2) where id = $1 and xu_ly_at is null`, [id, note])
      if (!r.rowCount) r = await c.query(`update hinh_bien_the_yeu_cau_giai set xu_ly_at = now(), ghi_chu = concat_ws(' | ', ghi_chu, $2) where id = $1 and xu_ly_at is null`, [id, note])
    } else {
      const t = await tbl(mon)
      r = await c.query(`update ${t}_cau_hoi_yeu_cau_giai set xu_ly_at = now(), ghi_chu = concat_ws(' | ', ghi_chu, $2) where id = $1 and xu_ly_at is null`, [id, note])
    }
    console.log(r.rowCount ? 'Đã đóng yêu cầu (không ghi lời giải).' : 'Không thấy yêu cầu treo với id này.')
  } else {
    console.log('Dùng: --list [--out f.json] | --ghi f.json | --don | --bo <mon> <id> [lý do]  (đọc chú thích đầu file)')
  }
} finally { await c.end() }
