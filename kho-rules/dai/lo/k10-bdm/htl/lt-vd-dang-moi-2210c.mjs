// Lý thuyết + ví dụ cho 3 dạng MỚI (Thùy 22/10, Mệnh đề–Tập hợp): NDB01378 tham số cho mệnh đề ∀/∃ · NDB01379 phủ định mệnh đề đơn giản · NDB01399 tập con của ℝ.
// Ví dụ lấy từ câu đã xếp vào dạng (đề + lời giải kho); NDB01378 chỉ có 1 câu ⇒ ví dụ 2 soạn mới. Chỉ ghi vào ô ĐANG RỖNG.
//   node kho-rules/dai/lo/k10-bdm/htl/lt-vd-dang-moi-2210c.mjs [--ghi]
import fs from 'node:fs'
import pg from 'pg'

const GHI = process.argv.includes('--ghi')
const R = String.raw
const L = (...a) => a.join('\n')
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL }); await c.connect()
await c.query('begin')

const gon = (s) => String(s ?? '').replace(/\r/g, '').replace(/\n\s*\n/g, '\n').trim()
async function vd(ma, loiGiai) {
  const q = (await c.query(`select noi_dung, lua_chon, anh_de, loi_giai from dai_cau_hoi where ma_cau = $1 and xoa_at is null`, [ma])).rows[0]
  if (!q) throw new Error('không có câu ' + ma)
  const lc = Array.isArray(q.lua_chon) && q.lua_chon.length ? q.lua_chon.map((x, i) => `${'ABCD'[i]}. ${gon(x)}`).join(' ') : ''
  return L('##VD', gon(q.noi_dung), q.anh_de ? `![](${q.anh_de})` : null, lc || null, '**Hướng dẫn giải:**', gon(loiGiai ?? q.loi_giai)).replace(/\n{2,}/g, '\n').replace(/\nnull(?=\n|$)/g, '')
}
const ghep = (...v) => v.join('\n\n')

// ───────── NDB01378 tham số để mệnh đề ∀/∃ luôn đúng
const LT_1378 = L(
  '##TC',
  R`Mệnh đề $\exists x\in X: P(x)$ đúng khi phương trình (bất phương trình) $P(x)$ có ít nhất một nghiệm $x\in X$.`,
  R`Mệnh đề $\forall x\in X: P(x)$ đúng khi mọi $x\in X$ đều thoả $P(x)$.`,
  '',
  '##PP',
  R`Dịch mệnh đề thành điều kiện của tham số: "tồn tại $x$" ⇒ phương trình có nghiệm (với bậc hai: $\Delta\ge 0$); "với mọi $x$" ⇒ biểu thức giữ dấu trên cả tập $X$ (với bậc hai: xét dấu $a$ và $\Delta$).`,
  R`Giải điều kiện tìm tham số rồi đối chiếu yêu cầu của đề (giá trị nguyên, nguyên dương, …).`,
)
const VD_1378 = ghep(
  await vd('T110010101088'),
  L('##VD',
    R`Tìm tất cả các giá trị của tham số $m$ để mệnh đề "$\forall x\in\mathbb{R}: x^{2}-2x+m>0$" là mệnh đề đúng.`,
    '**Hướng dẫn giải:**',
    R`Tam thức $x^{2}-2x+m$ có hệ số $a=1>0$ nên $x^{2}-2x+m>0$ với mọi $x$ khi và chỉ khi $\Delta'<0$.`,
    R`$\Delta'=1-m<0\Leftrightarrow m>1$.`,
    R`Vậy $m>1$.`),
)

// ───────── NDB01379 phủ định mệnh đề đơn giản
const LT_1379 = L(
  '##ĐN',
  R`Phủ định của mệnh đề $P$ là mệnh đề $\overline{P}$: đúng khi $P$ sai, sai khi $P$ đúng.`,
  '',
  '##PP',
  R`Với mệnh đề không chứa "với mọi", "tồn tại": thêm (hoặc bớt) từ "không" ("không phải") vào trước vị ngữ của $P$.`,
  R`Phủ định của "$a$ chia hết cho $b$" là "$a$ không chia hết cho $b$"; phủ định của "$a$ là số nguyên tố" là "$a$ không là số nguyên tố".`,
  R`Không nhầm phủ định với mệnh đề "trái nghĩa" hay mệnh đề nói về một tính chất khác.`,
)
const VD_1379 = ghep(await vd('T110010103080'), await vd('T110010103089'), await vd('T110010103073'))

// ───────── NDB01399 tập con của ℝ
const LT_1399 = L(
  '##TC',
  R`Với $a<b$: khoảng $(a;b)=\{x\in\mathbb{R}\mid a<x<b\}$; đoạn $[a;b]=\{x\in\mathbb{R}\mid a\le x\le b\}$; nửa khoảng $[a;b)=\{x\in\mathbb{R}\mid a\le x<b\}$, $(a;b]=\{x\in\mathbb{R}\mid a<x\le b\}$.`,
  R`$(a;+\infty)=\{x\mid x>a\}$; $[a;+\infty)=\{x\mid x\ge a\}$; $(-\infty;b)=\{x\mid x<b\}$; $(-\infty;b]=\{x\mid x\le b\}$; $\mathbb{R}=(-\infty;+\infty)$.`,
  R`Đầu mút nào lấy được (dấu $\le$, $\ge$) thì dùng ngoặc vuông; đầu mút không lấy (dấu $<$, $>$) và $\pm\infty$ luôn dùng ngoặc tròn.`,
  '',
  '##PP',
  R`Đọc điều kiện của $x$ (hoặc phần trục số được tô), xác định từng đầu mút có thuộc tập hay không.`,
  R`Viết tập dưới dạng khoảng, đoạn, nửa khoảng; ngược lại, khi đề cho khoảng/đoạn thì viết lại bằng tính chất đặc trưng.`,
  '',
  '##CY',
  R`Phân biệt tập số thực $\{x\in\mathbb{R}\mid -3<x<1\}=(-3;1)$ với tập số nguyên $\{x\in\mathbb{Z}\mid -3<x<1\}=\{-2;-1;0\}$.`,
)
const VD_1399 = ghep(
  await vd('T110010201037', R`Các số thực $x$ thoả $-2\le x<5$ lập thành nửa khoảng, lấy đầu $-2$, không lấy đầu $5$.` + '\n' + R`Vậy $A=[-2;5)$.`),
  await vd('T110010203104'),
  await vd('T110010203126'),
  await vd('T110010203119'),
)

let n = 0
for (const [id, lt, v] of [['NDB01378', LT_1378, VD_1378], ['NDB01379', LT_1379, VD_1379], ['NDB01399', LT_1399, VD_1399]]) {
  n += (await c.query(`update dai_bdm_dang_bai set ly_thuyet=$2, updated_at=now() where id=$1 and coalesce(ly_thuyet,'')=''`, [id, lt])).rowCount
  n += (await c.query(`update dai_bdm_dang_bai set vi_du=$2, updated_at=now() where id=$1 and coalesce(vi_du,'')=''`, [id, v])).rowCount
}
const kt = (await c.query(`select id, vi_du from dai_bdm_dang_bai where id in ('NDB01378','NDB01379','NDB01399')`)).rows
for (const r of kt) { const d = (r.vi_du.match(/\$/g) || []).length; if (d % 2) throw new Error('lẻ dấu $ ở ' + r.id) ; if (/[\u0000-\u0008\u000b-\u001f]/.test(r.vi_du)) throw new Error('ký tự điều khiển ' + r.id) }
console.log({ truong_ghi: n, ky_vong: 6 })
if (GHI && n === 6) { await c.query('commit'); console.log('ĐÃ GHI') } else { await c.query('rollback'); console.log(GHI ? 'lệch ⇒ chưa ghi' : 'chạy khô (rollback)') }
await c.end()
