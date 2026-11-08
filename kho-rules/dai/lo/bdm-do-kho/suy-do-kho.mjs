// suy-do-kho.mjs — suy ĐỘ KHÓ (muc_do 1–5) + HỆ thấp nhất (bac_toi_thieu S/A/B/C/D) cho dạng bài bản đồ mới (dai_bdm_dang_bai, NDB…)
// từ bản đồ cũ (dai_ban_do / hgt_ban_do), rồi dựng HTML duyệt cho phần chưa chắc. Cột thêm ở mig 202610241150.
//
//   node kho-rules/dai/lo/bdm-do-kho/suy-do-kho.mjs                      → chỉ xem: in thống kê + dựng HTML, ghi thử trong ROLLBACK
//   node kho-rules/dai/lo/bdm-do-kho/suy-do-kho.mjs --ghi                → COMMIT các thuộc tính CHẮC (mọi câu cùng một giá trị cũ)
//   node kho-rules/dai/lo/bdm-do-kho/suy-do-kho.mjs --ghi --theo-de-xuat → + ghi đề xuất ĐA SỐ của dạng chưa chắc (khi Thùy nói "ghi theo đề xuất")
//   node kho-rules/dai/lo/bdm-do-kho/suy-do-kho.mjs --ghi --chot <file.json>  → + ghi giá trị Thùy chốt (nút "Xuất chốt" trong HTML),
//                                                    dạng {"NDB…": {"muc_do": 3, "bac_toi_thieu": "B"}} — đè cả giá trị đang có.
// Tái chạy được: CHẮC / đề xuất chỉ điền ô đang NULL (không đè giá trị đã có, kể cả giá trị người sửa tay).
//
// LUẬT (từng thuộc tính tách riêng):
//   câu = bdm_cau_dang (nguồn DUY NHẤT câu → dạng bài) ∩ câu còn sống (xoa_at is null); dạng cũ của câu = dang_chinh
//   → muc_do / bac_toi_thieu của dạng cũ (kho dai → dai_ban_do, kho hgt → hgt_ban_do). Bỏ câu ở dạng chờ "Chưa phân dạng" (…000000:
//   giá trị 1/C ở đó là mặc định, không phải độ khó thật). Đếm theo CÂU GỐC (clone tính chung với câu gốc — 1 câu gốc 30 clone không được 30 phiếu).
//   · mọi câu cùng một giá trị            → CHẮC (thừa hưởng nguyên giá trị cũ) — ghi.
//   · nhiều giá trị                        → CHƯA CHẮC, đề xuất = giá trị nhiều câu gốc nhất (hòa ⇒ không đề xuất) — chờ Thùy.
//   · không có câu → dai_bdm_doi_ung (dạng cũ trỏ thẳng dich_dang_bai) → CHƯA CHẮC (nguồn đối ứng) — chờ Thùy.
//   · vẫn không có                         → để trống.
import pg from 'pg'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(DIR, '../../../..')
const katex = createRequire(join(ROOT, 'package.json'))('katex')
const arg = process.argv.slice(2)
const GHI = arg.includes('--ghi'), THEO_DX = arg.includes('--theo-de-xuat')
const iChot = arg.indexOf('--chot'), CHOT = iChot >= 0 ? JSON.parse(readFileSync(arg[iChot + 1], 'utf8')) : null

const url = readFileSync(join(ROOT, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows

// ---- suy (tính ở Postgres) -------------------------------------------------------------------------------------------------
const SQL_SUY = `
with cau as (
  select b.dang_bai_id, b.nguon, q.ma_cau, coalesce(q.parent_ma_cau, q.ma_cau) goc, q.dang_chinh, d.ten_dang ten_cu,
         d.muc_do, d.bac_toi_thieu bac
    from bdm_cau_dang b join dai_cau_hoi q on q.ma_cau = b.ma_cau and q.xoa_at is null
    join dai_ban_do d on d.ma_dang = q.dang_chinh
   where b.kho = 'dai' and d.ma_dang !~ '000000$'
  union all
  select b.dang_bai_id, b.nguon, q.ma_cau, coalesce(q.parent_ma_cau, q.ma_cau), q.dang_chinh, h.ten_dang, h.muc_do, h.bac_toi_thieu
    from bdm_cau_dang b join hgt_cau_hoi q on q.ma_cau = b.ma_cau and q.xoa_at is null
    join hgt_ban_do h on h.ma_dang = q.dang_chinh
   where b.kho = 'hgt' and h.ma_dang !~ '000000$'
),
-- dạng bài không có câu nào ⇒ đối ứng: mỗi dạng cũ trỏ thẳng dạng bài = 1 phiếu
du as (
  select d.dich_dang_bai dang_bai_id, d.ma_dang_cu goc, coalesce(a.muc_do, h.muc_do) muc_do, coalesce(a.bac_toi_thieu, h.bac_toi_thieu) bac
    from dai_bdm_doi_ung d left join dai_ban_do a on a.ma_dang = d.ma_dang_cu left join hgt_ban_do h on h.ma_dang = d.ma_dang_cu
   where d.dich_dang_bai is not null and coalesce(a.muc_do, h.muc_do) is not null
     and not exists (select 1 from cau where cau.dang_bai_id = d.dich_dang_bai)
),
phieu as (select 'cau' nguon_suy, dang_bai_id, goc, muc_do, bac from cau union all select 'doi_ung', dang_bai_id, goc, muc_do, bac from du),
pmd as (select nguon_suy, dang_bai_id, muc_do::text v, count(distinct goc) n from phieu group by 1, 2, 3),
pbac as (select nguon_suy, dang_bai_id, bac v, count(distinct goc) n from phieu where bac is not null group by 1, 2, 3),
gom as (
  select 'muc_do' tt, nguon_suy, dang_bai_id, jsonb_object_agg(v, n order by v) pb, count(*) so_gia_tri,
         (array_agg(v order by n desc, v))[1] top1, (array_agg(n order by n desc))[1] n1, (array_agg(n order by n desc))[2] n2
    from pmd group by 2, 3
  union all
  select 'bac', nguon_suy, dang_bai_id, jsonb_object_agg(v, n order by v), count(*),
         (array_agg(v order by n desc, v))[1], (array_agg(n order by n desc))[1], (array_agg(n order by n desc))[2]
    from pbac group by 2, 3
)
select v.ma_dang, v.khoi, v.nhanh_bdm, v.ma_chu_de, v.ten_chu_de, v.ten_chuyen_de, v.ma_nhom, v.ten_nhom, v.ten_dang,
       v.thu_tu_chu_de, v.thu_tu_chuyen_de, v.thu_tu_nhom, v.thu_tu_dang, v.muc_do hien_md, v.bac_toi_thieu hien_bac,
       (select count(distinct goc) from cau where cau.dang_bai_id = v.ma_dang) so_goc,
       (select count(*) from cau where cau.dang_bai_id = v.ma_dang) so_cau,
       (select jsonb_object_agg(nguon, n) from (select nguon, count(*) n from cau where cau.dang_bai_id = v.ma_dang group by 1) x) nguon_cau,
       (select to_jsonb(g) - 'dang_bai_id' - 'tt' from gom g where g.dang_bai_id = v.ma_dang and g.tt = 'muc_do') md,
       (select to_jsonb(g) - 'dang_bai_id' - 'tt' from gom g where g.dang_bai_id = v.ma_dang and g.tt = 'bac') bac
  from bdm_ban_do v
 order by v.khoi, v.nhanh_bdm, v.thu_tu_chu_de, v.thu_tu_chuyen_de nulls last, v.thu_tu_nhom, v.thu_tu_dang`

// 2–3 câu ví dụ / dạng bài: ưu tiên mỗi giá trị độ khó một câu (thấy ngay vì sao lệch)
const SQL_VD = `
with cau as (
  -- câu ở dạng chờ vẫn lấy làm ví dụ (dạng bài chỉ có câu dạng chờ ⇒ trống, Thùy cần thấy đề), độ khó hiện "dạng chờ"
  select b.dang_bai_id, q.ma_cau, q.parent_ma_cau, q.noi_dung, q.dang_chinh, d.ten_dang ten_cu,
         case when d.ma_dang !~ '000000$' then d.muc_do end muc_do, case when d.ma_dang !~ '000000$' then d.bac_toi_thieu end bac
    from bdm_cau_dang b join dai_cau_hoi q on q.ma_cau = b.ma_cau and q.xoa_at is null left join dai_ban_do d on d.ma_dang = q.dang_chinh
   where b.kho = 'dai' and b.dang_bai_id = any($1)
  union all
  select b.dang_bai_id, q.ma_cau, q.parent_ma_cau, q.noi_dung, q.dang_chinh, h.ten_dang,
         case when h.ma_dang !~ '000000$' then h.muc_do end, case when h.ma_dang !~ '000000$' then h.bac_toi_thieu end
    from bdm_cau_dang b join hgt_cau_hoi q on q.ma_cau = b.ma_cau and q.xoa_at is null left join hgt_ban_do h on h.ma_dang = q.dang_chinh
   where b.kho = 'hgt' and b.dang_bai_id = any($1)
), r as (
  select *, row_number() over (partition by dang_bai_id, muc_do, bac order by (parent_ma_cau is null) desc, ma_cau) rn_gt from cau
), r2 as (select *, row_number() over (partition by dang_bai_id order by rn_gt, muc_do nulls last, bac, ma_cau) rn from r)
select dang_bai_id, ma_cau, noi_dung, dang_chinh, ten_cu, muc_do, bac from r2 where rn <= 3 order by dang_bai_id, rn`

const SQL_DU = `
select d.dich_dang_bai dang_bai_id, d.ma_dang_cu, coalesce(a.ten_dang, h.ten_dang) ten_cu,
       coalesce(a.muc_do, h.muc_do) muc_do, coalesce(a.bac_toi_thieu, h.bac_toi_thieu) bac
  from dai_bdm_doi_ung d left join dai_ban_do a on a.ma_dang = d.ma_dang_cu left join hgt_ban_do h on h.ma_dang = d.ma_dang_cu
 where d.dich_dang_bai = any($1) order by 1, 2`

// ---- phân loại --------------------------------------------------------------------------------------------------------------
const loai = (g) => !g ? { tt: 'trong' }
  : g.nguon_suy === 'doi_ung' ? { tt: 'chua', vi: 'doi_ung', dx: Number(g.n1) === Number(g.n2 ?? -1) ? null : g.top1 }
  : Number(g.so_gia_tri) === 1 ? { tt: 'chac', dx: g.top1 }
  : { tt: 'chua', vi: 'lech', dx: Number(g.n1) === Number(g.n2) ? null : g.top1 }

let rows
try {
  await q('begin')
  rows = await q(SQL_SUY)
  for (const r of rows) { r.lmd = loai(r.md); r.lbac = loai(r.bac) }

  // ---- ghi ----
  const ghi = [] // [ma_dang, cot, gia_tri, ly_do, ghi_de]
  for (const r of rows) {
    for (const [cot, l, hien] of [['muc_do', r.lmd, r.hien_md], ['bac_toi_thieu', r.lbac, r.hien_bac]]) {
      if (hien != null) continue
      if (l.tt === 'chac') ghi.push([r.ma_dang, cot, l.dx, 'chac', false])
      else if (THEO_DX && l.tt === 'chua' && l.dx != null) ghi.push([r.ma_dang, cot, l.dx, 'de_xuat', false])
    }
  }
  if (CHOT) for (const [ma, v] of Object.entries(CHOT)) for (const cot of ['muc_do', 'bac_toi_thieu']) if (v[cot] != null && v[cot] !== '') ghi.push([ma, cot, v[cot], 'chot', true])
  let n = 0
  for (const [ma, cot, val, , de] of ghi) {
    const kq = await c.query(`update dai_bdm_dang_bai set ${cot} = $2 where id = $1 ${de ? `and ${cot} is distinct from $2` : `and ${cot} is null`}`,
      [ma, cot === 'muc_do' ? Number(val) : val])
    n += kq.rowCount
  }
  const dem = ghi.reduce((a, x) => ((a[x[1] + ':' + x[3]] = (a[x[1] + ':' + x[3]] || 0) + 1), a), {})
  console.log(`${GHI ? 'GHI' : 'THỬ (ROLLBACK)'} — ${n} ô cập nhật`, dem)

  // thống kê theo khối SAU ghi (trong transaction — chỉ xem thì là "nếu ghi")
  const tk = await q(`select khoi, count(*) tong, count(muc_do) co_md, count(bac_toi_thieu) co_bac from bdm_ban_do group by 1 order by 1`)
  console.table(tk)
  await q(GHI ? 'commit' : 'rollback')
} catch (e) { await q('rollback'); throw e }

// ---- thống kê phân loại theo khối ----------------------------------------------------------------------------------------
const KHOI_SO = (k) => parseInt(k) + (/T$/.test(k) ? 0.5 : 0)
const tkKhoi = {}
for (const r of rows) {
  const t = (tkKhoi[r.khoi] ??= { tong: 0, md_chac: 0, md_chua: 0, md_trong: 0, bac_chac: 0, bac_chua: 0, bac_trong: 0, ca_hai_chac: 0 })
  t.tong++; t['md_' + r.lmd.tt]++; t['bac_' + r.lbac.tt]++
  if (r.lmd.tt === 'chac' && r.lbac.tt === 'chac') t.ca_hai_chac++
}
console.table(Object.fromEntries(Object.entries(tkKhoi).sort((a, b) => KHOI_SO(a[0]) - KHOI_SO(b[0]))))

// ---- HTML duyệt: dạng bài có ít nhất 1 thuộc tính chưa chắc / trống ------------------------------------------------------
const can = rows.filter((r) => r.lmd.tt !== 'chac' || r.lbac.tt !== 'chac')
const vd = {}, du = {}
for (const x of await q(SQL_VD, [can.map((r) => r.ma_dang)])) (vd[x.dang_bai_id] ??= []).push(x)
for (const x of await q(SQL_DU, [can.map((r) => r.ma_dang)])) (du[x.dang_bai_id] ??= []).push(x)
await c.end()

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const toan = (t) => { try { return katex.renderToString(t, { output: 'mathml', throwOnError: true, strict: 'ignore' }) } catch { return `<code>${esc(t)}</code>` } }
const unesc = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
const dong = (s) => esc(s).replace(/\$\$([^$]+)\$\$/g, (_, t) => toan(unesc(t))).replace(/\$([^$]+)\$/g, (_, t) => toan(unesc(t)))
const cat = (s, n = 260) => { const t = String(s ?? '').replace(/\[\[HINH[^\]]*\]\]/g, '[hình]'); if (t.length <= n) return t; let k = t.slice(0, n); if ((k.match(/\$/g) || []).length % 2) k = k.slice(0, k.lastIndexOf('$')); return k + ' …' }
const pbHtml = (g) => !g ? '<span class="mo">—</span>' : Object.entries(g.pb).map(([v, n]) => `<span class="pb">${esc(v)}<b>×${n}</b></span>`).join(' ')
const TEN_TT = { chac: 'chắc', chua: 'chưa chắc', trong: 'trống' }
const o = (cot, r, l, g, hien) => {
  const opts = cot === 'muc_do' ? ['', '1', '2', '3', '4', '5'] : ['', 'S', 'A', 'B', 'C', 'D']
  const chon = hien ?? (l.tt === 'chac' ? l.dx : l.dx) ?? ''
  const dis = l.tt === 'chac' ? ' disabled' : ''
  return `<td class="tt ${l.tt}"><div class="nhan">${TEN_TT[l.tt]}${l.vi === 'doi_ung' ? ' · đối ứng' : l.vi === 'lech' ? ' · lệch' : ''}${l.tt === 'chua' && l.dx == null ? ' · hòa' : ''}</div>
    <select data-ma="${esc(r.ma_dang)}" data-cot="${cot}"${dis}>${opts.map((v) => `<option${String(chon) === v ? ' selected' : ''}>${v}</option>`).join('')}</select>
    <div class="pbw">${pbHtml(g)}</div></td>`
}

let html = '', khoiCu = null, cdCu = null, nhomCu = null
const theo = {}
for (const r of can) (theo[r.khoi] ??= []).push(r)
const dsKhoi = Object.keys(theo).sort((a, b) => KHOI_SO(a) - KHOI_SO(b))
for (const k of dsKhoi) {
  const t = tkKhoi[k]
  html += `<section class="khoi" id="k${esc(k)}"><h2>Khối ${esc(k)} <small>${theo[k].length} dạng bài cần chốt / ${t.tong} — độ khó: ${t.md_chac} chắc · ${t.md_chua} chưa chắc · ${t.md_trong} trống; hệ: ${t.bac_chac} chắc · ${t.bac_chua} chưa chắc · ${t.bac_trong} trống</small></h2>`
  cdCu = null; nhomCu = null
  for (const r of theo[k]) {
    if (r.ma_chu_de !== cdCu) { if (cdCu) html += '</tbody></table>'; cdCu = r.ma_chu_de; nhomCu = null
      html += `<h3>${esc(r.ten_chu_de)} <span class="ma">${esc(r.ma_chu_de)} · ${r.nhanh_bdm === 'hgt' ? 'HGT' : 'Đại'}</span></h3><table><thead><tr><th>Dạng bài</th><th>Độ khó (1–5)</th><th>Hệ thấp nhất</th><th>Câu ví dụ (dạng cũ → độ khó · hệ)</th></tr></thead><tbody>` }
    if (r.ma_nhom !== nhomCu) { nhomCu = r.ma_nhom; html += `<tr class="nhom"><td colspan="4">${r.ten_chuyen_de ? esc(r.ten_chuyen_de) + ' › ' : ''}${esc(r.ten_nhom)}</td></tr>` }
    const vds = (vd[r.ma_dang] || []).map((x) => `<li><div class="cu"><span class="ma">${esc(x.ma_cau)}</span> ${esc(x.dang_chinh)} ${esc(x.ten_cu)} → ${x.muc_do == null ? '<i>dạng chờ</i>' : `<b>${x.muc_do}</b> · <b>${esc(x.bac ?? '—')}</b>`}</div><div class="de">${dong(cat(x.noi_dung))}</div></li>`).join('')
    const dus = (du[r.ma_dang] || []).map((x) => `<li><div class="cu">đối ứng: <span class="ma">${esc(x.ma_dang_cu)}</span> ${esc(x.ten_cu)} → <b>${x.muc_do ?? '—'}</b> · <b>${esc(x.bac ?? '—')}</b></div></li>`).join('')
    const nguon = r.nguon_cau ? Object.entries(r.nguon_cau).map(([k2, n]) => `${k2} ${n}`).join(' · ') : ''
    html += `<tr><td class="dang"><div class="ten">${esc(r.ten_dang)}</div><div class="ma">${esc(r.ma_dang)}</div>
      <div class="mo">${Number(r.so_goc) ? `${r.so_goc} câu gốc · ${r.so_cau} câu (${esc(nguon)})` : 'không có câu nào'}</div></td>
      ${o('muc_do', r, r.lmd, r.md, r.hien_md)}${o('bac_toi_thieu', r, r.lbac, r.bac, r.hien_bac)}
      <td><ul class="vd">${vds || dus || '<li class="mo">—</li>'}</ul></td></tr>`
  }
  if (cdCu) html += '</tbody></table>'
  html += '</section>'
}

const ngay = new Date(); const ymd = `${ngay.getFullYear()}${String(ngay.getMonth() + 1).padStart(2, '0')}${String(ngay.getDate()).padStart(2, '0')}`
const tongBang = dsKhoi.map((k) => `<tr><td><a href="#k${esc(k)}">${esc(k)}</a></td><td>${tkKhoi[k].tong}</td><td>${tkKhoi[k].md_chac}</td><td>${tkKhoi[k].md_chua}</td><td>${tkKhoi[k].md_trong}</td><td>${tkKhoi[k].bac_chac}</td><td>${tkKhoi[k].bac_chua}</td><td>${tkKhoi[k].bac_trong}</td></tr>`).join('')
const trang = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Duyệt độ khó dạng bài</title>
<style>
:root{--bg:#f7f7f5;--fg:#1d1d1f;--mo:#6b6b70;--line:#e2e2e0;--card:#fff;--chac:#e7f5ea;--chua:#fff4dc;--trong:#f1f1f1;--acc:#2f5bd3}
@media (prefers-color-scheme:dark){:root{--bg:#161618;--fg:#ececec;--mo:#9a9aa0;--line:#333;--card:#1f1f22;--chac:#1f3324;--chua:#3a3020;--trong:#2a2a2c;--acc:#86a6ff}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:16px}
main{max-width:1200px;margin:0 auto}h1{font-size:22px;margin:0 0 4px}h2{margin:32px 0 8px;font-size:18px}h2 small{font-weight:400;color:var(--mo);font-size:13px;display:block}
h3{margin:20px 0 6px;font-size:15px}.ma{color:var(--mo);font:12px ui-monospace,Consolas,monospace}.mo{color:var(--mo);font-size:12px}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:8px;overflow:hidden}
th,td{border-top:1px solid var(--line);padding:6px 8px;vertical-align:top;text-align:left}th{font-size:12px;color:var(--mo);font-weight:600}
tr.nhom td{background:var(--trong);font-weight:600;font-size:13px}td.dang{width:24%}td.dang .ten{font-weight:600}
td.tt{width:120px}td.tt.chac{background:var(--chac)}td.tt.chua{background:var(--chua)}td.tt.trong{background:var(--trong)}
.nhan{font-size:11px;color:var(--mo)}select{font:inherit;margin:2px 0}.pb{display:inline-block;font-size:12px;margin-right:4px}.pb b{font-weight:600;color:var(--mo);margin-left:1px}
ul.vd{margin:0;padding-left:16px}ul.vd li{margin-bottom:6px}.cu{font-size:12px;color:var(--mo)}.de{font-size:13px}
.thanh{position:sticky;top:0;background:var(--bg);padding:8px 0;border-bottom:1px solid var(--line);z-index:2;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
button{font:inherit;padding:6px 12px;border-radius:6px;border:1px solid var(--acc);background:var(--acc);color:#fff;cursor:pointer}
textarea{width:100%;height:120px;font:12px ui-monospace,monospace;display:none;margin-top:8px;background:var(--card);color:var(--fg);border:1px solid var(--line)}
.tong td,.tong th{text-align:center}.tong{max-width:720px}
@media (max-width:700px){td.dang{width:auto}table,thead,tbody,tr,td,th{display:block}thead{display:none}td.tt{width:auto}}
</style></head><body><main>
<h1>Duyệt độ khó + hệ cho dạng bài bản đồ mới</h1>
<p class="mo">Dựng ${ngay.toLocaleString('vi-VN')} bằng <code>kho-rules/dai/lo/bdm-do-kho/suy-do-kho.mjs</code>. Mỗi dạng bài thừa hưởng độ khó (1–5; 1–3 cơ bản, 4–5 nâng cao) và hệ thấp nhất (S/A/B/C/D)
từ dạng CŨ của các câu đang gán vào nó (đếm theo câu gốc, bỏ câu ở dạng chờ "Chưa phân dạng"). <b>Xanh = chắc</b> (mọi câu cùng giá trị — đã ghi vào DB, không cần duyệt).
<b>Vàng = chưa chắc</b>: câu đến từ nhiều dạng cũ khác độ khó (ô chọn sẵn giá trị nhiều câu nhất; "hòa" = không đề xuất) hoặc dạng bài chưa có câu nên lấy theo bảng đối ứng.
<b>Xám = trống</b>: không có căn cứ. Trang chỉ liệt kê dạng bài có ít nhất 1 ô chưa chắc/trống.</p>
<table class="tong"><thead><tr><th>Khối</th><th>Dạng bài</th><th>Độ khó chắc</th><th>chưa chắc</th><th>trống</th><th>Hệ chắc</th><th>chưa chắc</th><th>trống</th></tr></thead><tbody>${tongBang}</tbody></table>
<div class="thanh"><button id="xuat">Xuất chốt (JSON)</button><span class="mo">Sửa ô chọn rồi bấm — gửi nội dung cho Claude, chạy: <code>node kho-rules/dai/lo/bdm-do-kho/suy-do-kho.mjs --ghi --chot chot.json</code>. Hoặc nói "ghi theo đề xuất" ⇒ <code>--ghi --theo-de-xuat</code>.</span>
<textarea id="out" readonly></textarea></div>
${html}
</main><script>
document.getElementById('xuat').onclick = function () {
  var o = {}; document.querySelectorAll('select:not([disabled])').forEach(function (s) { if (!s.value) return; (o[s.dataset.ma] = o[s.dataset.ma] || {})[s.dataset.cot] = s.dataset.cot === 'muc_do' ? Number(s.value) : s.value })
  var t = document.getElementById('out'); t.style.display = 'block'; t.value = JSON.stringify(o, null, 1); t.select()
  try { navigator.clipboard.writeText(t.value) } catch (e) {}
}
</script></body></html>`
mkdirSync(DIR, { recursive: true })
const ra = join(DIR, `duyet-${ymd}.html`)
writeFileSync(ra, trang)
console.log('HTML →', ra, `(${can.length} dạng bài)`)
