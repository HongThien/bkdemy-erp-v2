// sua_latex_hh00103055.mjs — chuẩn hoá LaTeX + trình bày câu HH00103055 (Hình 7, bài HH00103): đề có a) b), \widehat / ^\circ,
// lời giải dòng ngắn + (gt)/(cmt) + tên trường hợp bằng nhau (luật trình bày Hình 7·8·9, CEO 27/10); loai_cau tra_loi_ngan → tu_luan (câu chứng minh, như 16 câu cùng bài).
//   node scripts/anh/sua_latex_hh00103055.mjs          # chạy thử (ROLLBACK)
//   node scripts/anh/sua_latex_hh00103055.mjs --ghi
import pg from 'pg'
import { mkdirSync, writeFileSync } from 'node:fs'
import { bien } from '../kho/cau-hinh.mjs'

const MA = 'HH00103055'
const NOI_DUNG = String.raw`Cho $\triangle ABC$ vuông tại $A$. $BD$ là tia phân giác của $\widehat{ABC}$ ($D$ thuộc $AC$). Kẻ $DE\perp BC$ tại $E$. $AE$ cắt $BD$ tại $I$.
Chứng minh:
a) $\triangle ABD=\triangle EBD$.
b) $I$ là trung điểm của $AE$.`
const LOI_GIAI = String.raw`a) Xét $\triangle ABD$ và $\triangle EBD$ có:
$\widehat{BAD}=\widehat{BED}=90^\circ$ (gt);
$BD$ chung (cạnh huyền);
$\widehat{ABD}=\widehat{EBD}$ ($BD$ là tia phân giác của $\widehat{ABC}$, gt).
Do đó $\triangle ABD=\triangle EBD$ (trường hợp cạnh huyền - góc nhọn).

b) Vì $\triangle ABD=\triangle EBD$ (cmt)
nên $AB=EB$ (hai cạnh tương ứng).
Xét $\triangle ABI$ và $\triangle EBI$ có:
$AB=EB$ (cmt);
$\widehat{ABI}=\widehat{EBI}$ ($BD$ là tia phân giác của $\widehat{ABC}$, gt);
$BI$ chung.
Do đó $\triangle ABI=\triangle EBI$ (trường hợp c.g.c).
Suy ra $IA=IE$ (hai cạnh tương ứng).
Mà $I$ thuộc đoạn $AE$ (gt)
nên $I$ là trung điểm của $AE$.`

// kiểm cú pháp: số dấu $ chẵn, không ký tự điều khiển, không lệnh LaTeX mất `\`, đề không có dòng trống (R2)
for (const [ten, v] of [['noi_dung', NOI_DUNG], ['loi_giai', LOI_GIAI]]) {
  if ((v.match(/\$/g) || []).length % 2) throw new Error(ten + ': số dấu $ lẻ')
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)) throw new Error(ten + ': ký tự điều khiển')
  for (const m of v.matchAll(/\$([^$]+)\$/g)) if (/(?<![\\a-zA-Z])(widehat|triangle|perp|circ|dfrac)\b/.test(m[1])) throw new Error(ten + ': lệnh LaTeX mất \\ ở ' + m[1])
}
if (/\n\n/.test(NOI_DUNG)) throw new Error('đề có dòng trống')
if (/\\angle|\^0\b/.test(NOI_DUNG + LOI_GIAI)) throw new Error('còn \\angle / ^0')

const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
await c.query('begin')
const cu = (await c.query('select noi_dung, loi_giai, loai_cau from hinh_hoc_cau_hoi where ma_cau = $1 and xoa_at is null', [MA])).rows[0]
if (!cu) throw new Error('không thấy câu ' + MA)
mkdirSync('scripts/anh/bien_ban', { recursive: true })
const bb = `scripts/anh/bien_ban/sua-latex-${MA}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
if (GHI) writeFileSync(bb, JSON.stringify({ ma_cau: MA, truoc: cu }, null, 1))
const r = await c.query('update hinh_hoc_cau_hoi set noi_dung = $2, loi_giai = $3, loai_cau = $4 where ma_cau = $1 and xoa_at is null', [MA, NOI_DUNG, LOI_GIAI, 'tu_luan'])
console.log('cập nhật', r.rowCount, 'dòng · loai_cau', cu.loai_cau, '→ tu_luan', GHI ? '· bản cũ: ' + bb : '')
if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK (chạy thử)') }
await c.end()
