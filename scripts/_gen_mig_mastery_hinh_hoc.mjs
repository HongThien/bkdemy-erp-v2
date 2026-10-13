// Sinh migration 202610140130 từ THÂN ĐANG CHẠY của fn_mastery_cells (memory: sửa hàm DB phải lấy từ bản live,
// không chép file migration cũ — phiên khác có thể đã sửa). Mỗi phép thay PHẢI khớp đúng số lần, lệch ⇒ dừng.
// Chạy: node scripts/_gen_mig_mastery_hinh_hoc.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect()
const r = await c.query(`select pg_get_functiondef(p.oid) d from pg_proc p join pg_namespace s on s.oid=p.pronamespace and s.nspname='public' where p.proname='fn_mastery_cells'`)
await c.end()
if (r.rowCount !== 1) throw new Error('fn_mastery_cells: cần đúng 1 bản, thấy ' + r.rowCount)
let d = r.rows[0].d
if (/\bcs\b|hinh_hoc_bai/.test(d)) throw new Error('hàm live đã có cửa sổ Hình — không sinh lại')
const thay = (a, b, lan) => {
  const n = d.split(a).length - 1
  if (n !== lan) throw new Error(`"${a.slice(0, 50)}…" khớp ${n} lần, cần ${lan}`)
  d = d.split(a).join(b)
}
thay(`order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn\n    from mg mf\n  )`,
  `order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn,
           -- ⭐ HÌNH–HỌC (CEO 14/10): bài tập hình làm được ít hơn Đại nhiều ⇒ thang đo 3 bài thay vì 5.
           -- Độ tin scale cùng tỉ lệ (3/2 thay 5/3) — cùng bộ số với Hình–Luyện (fn_mastery_cells_hinh, 21/08).
           -- "Là Hình–Học" = dạng nằm trong hinh_hoc_bai (KP = bài học). Đại / Hình giải tích giữ nguyên tham số.
           case when hh.ma_bai is not null then least(p_window, 3)  else p_window  end as cs,
           case when hh.ma_bai is not null then least(p_tin_cao, 3) else p_tin_cao end as tc,
           case when hh.ma_bai is not null then least(p_tin_tb, 2)  else p_tin_tb  end as tt
    from mg mf
    left join hinh_hoc_bai hh on hh.ma_bai = mf.ma_dang
  )`, 1)
thay('rn <= p_window', 'rn <= cs', 6)
thay('count(*) >= p_tin_cao', 'count(*) >= max(tc)', 1)
thay('count(*) >= p_tin_tb', 'count(*) >= max(tt)', 1)

const dau = `-- ============================================================================
-- 202610140130 — mastery_hinh_hoc_cua_so_3
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   CEO 14/10: "số lượng bài tập hình làm được thấp hơn đại nhiều, nên thang đo của Hình không phải 5 bài,
--   giảm xuống còn 3 bài". Hình–Luyện (fn_mastery_cells_hinh) đã 3 bài từ 21/08; Hình–HỌC đi chung
--   fn_mastery_cells nên vẫn 5. Đo trước khi đổi (scripts/_do_mastery_hinh_hoc_3.mjs): 335 ô (HS × bài học),
--   76% ô chỉ có ≤ 2 lần đo, 30 ô có > 3 lần; đổi sang 3 ⇒ 7 ô đổi mức, "tin thấp" 256 → 165, "tin cao" 22 → 79.
--   Thân hàm lấy từ bản ĐANG CHẠY (pg_get_functiondef) rồi thay đúng 4 chỗ — sinh bằng scripts/_gen_mig_mastery_hinh_hoc.mjs.
--   Đại / Hình giải tích / KHTN / Anh KHÔNG đổi (cùng tham số, cùng kết quả).
--
-- MẤT GÌ: không xoá gì. Chữ ký hàm giữ nguyên (create or replace).
-- ============================================================================
`
writeFileSync(new URL('../supabase/migrations/202610140130_mastery_hinh_hoc_cua_so_3.sql', import.meta.url), dau + d.trimEnd() + ';\n')
console.log('OK — đã ghi migration, dài', d.length)
