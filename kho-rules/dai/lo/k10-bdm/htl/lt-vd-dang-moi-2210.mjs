// Lý thuyết + ví dụ cho 4 dạng MỚI (Thùy 22/10): NDB01367 tan+cot · NDB01371 sơ đồ Ven · NDB01375 min max từ hệ có sẵn · NDB01377 min max từ miền nghiệm có sẵn.
// Ví dụ lấy từ câu đã xếp vào dạng đó trong kho (đề + lời giải sách; đáp số đã tính lại). Riêng NDB01377 chưa có câu nào ⇒ 2 ví dụ SOẠN MỚI, hình dựng bằng code.
// Chỉ ghi vào ô ĐANG RỖNG.   node kho-rules/dai/lo/k10-bdm/htl/lt-vd-dang-moi-2210.mjs <url-mm1> <url-mm2> [--ghi]
import fs from 'node:fs'
import pg from 'pg'

const [URL1, URL2] = process.argv.slice(2)
const GHI = process.argv.includes('--ghi')
const R = String.raw
const L = (...a) => a.join('\n')
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL }); await c.connect()
await c.query('begin')

const gon = (s) => String(s ?? '').replace(/\r/g, '').replace(/\n\s*\n/g, '\n').trim()
async function vd(ma) {
  const q = (await c.query(`select noi_dung, lua_chon, anh_de, loi_giai, dap_an from dai_cau_hoi where ma_cau = $1 and xoa_at is null`, [ma])).rows[0]
  if (!q) throw new Error('không có câu ' + ma)
  const lc = Array.isArray(q.lua_chon) && q.lua_chon.length ? q.lua_chon.map((x, i) => `${'ABCD'[i]}. ${gon(x)}`).join(' ') : ''
  return L('##VD', gon(q.noi_dung), q.anh_de ? `![](${q.anh_de})` : null, lc || null, '**Hướng dẫn giải:**', gon(q.loi_giai)).replace(/\n{2,}/g, '\n').replace(/\nnull(?=\n|$)/g, '')
}
const ghep = (...v) => v.join('\n\n')

// ───────── NDB01367 tan + cot
const LT_1367 = L(
  '##TC',
  R`$\tan\alpha\cdot\cot\alpha=1$ nên $\cot\alpha=\dfrac{1}{\tan\alpha}$ (với $\alpha\ne 0^\circ,90^\circ,180^\circ$).`,
  R`$\tan\alpha+\cot\alpha=\dfrac{\sin^{2}\alpha+\cos^{2}\alpha}{\sin\alpha\cos\alpha}=\dfrac{1}{\sin\alpha\cos\alpha}$.`,
  R`$1+\tan^{2}\alpha=\dfrac{1}{\cos^{2}\alpha}$; $1+\cot^{2}\alpha=\dfrac{1}{\sin^{2}\alpha}$.`,
  '',
  '##PP',
  R`Đặt $t=\tan\alpha$, đưa giả thiết $\tan\alpha+\cot\alpha=k$ về phương trình $t^{2}-kt+1=0$ rồi giải tìm $t$ (hoặc dùng $\sin\alpha\cos\alpha=\dfrac{1}{k}$).`,
  R`Dựa vào điều kiện của góc (nhọn, tù, $\sin\alpha>\cos\alpha$, …) để chọn nghiệm $\tan\alpha$ phù hợp.`,
  R`Từ $\tan\alpha$ tính $\cos^{2}\alpha=\dfrac{1}{1+\tan^{2}\alpha}$, $\sin^{2}\alpha=\dfrac{1}{1+\cot^{2}\alpha}$ rồi xét dấu để suy ra $\sin\alpha$, $\cos\alpha$ và giá trị biểu thức cần tính.`,
)
const VD_1367 = ghep(await vd('T110030107008'), await vd('T110030107065'), await vd('T110030107071'))

// ───────── NDB01371 sơ đồ Ven
const LT_1371 = L(
  '##TC',
  R`Trong biểu đồ Ven: $A\cap B$ là phần chung của hai hình; $A\cup B$ là phần thuộc ít nhất một trong hai hình; $A\setminus B$ là phần của $A$ nằm ngoài $B$; $B\setminus A$ là phần của $B$ nằm ngoài $A$.`,
  '',
  '##PP',
  R`Xác định rõ phần nào của hình bị gạch (hoặc được tô) và phần nào không.`,
  R`Đối chiếu phần cần tìm (phần bị gạch hoặc không bị gạch) với các phần $A\cap B$, $A\setminus B$, $B\setminus A$ của biểu đồ.`,
  R`Ghép các phần đó thành tập hợp tương ứng (giao, hợp, hiệu) và chọn đáp án.`,
  '',
  '##CY',
  R`Bài thuộc dạng này có nội dung phụ thuộc hoàn toàn vào hình vẽ: không có hình thì không xác định được tập hợp.`,
)
const VD_1371 = ghep(await vd('T110000000103'), await vd('T110000000273'), await vd('T110010202100'))

// ───────── NDB01375 min max từ hệ bất phương trình có sẵn
const LT_1375 = L(
  '##TC',
  R`Cho hệ bất phương trình bậc nhất hai ẩn có miền nghiệm là đa giác lồi. Biểu thức $F(x;y)=ax+by$ đạt giá trị lớn nhất và giá trị nhỏ nhất trên miền nghiệm đó tại một trong các đỉnh của đa giác.`,
  '',
  '##PP',
  R`Biểu diễn miền nghiệm của hệ bất phương trình đã cho (vẽ các đường biên, xác định phần mặt phẳng thoả từng bất phương trình).`,
  R`Tìm toạ độ các đỉnh của miền nghiệm bằng cách giải hệ hai phương trình đường biên cắt nhau tại đỉnh đó.`,
  R`Tính $F$ tại từng đỉnh rồi so sánh để chọn giá trị lớn nhất, nhỏ nhất.`,
)
const VD_1375 = ghep(await vd('T110000000041'), await vd('T110000000026'), await vd('T110000000071'))

// ───────── NDB01377 min max từ miền nghiệm có sẵn (đề cho HÌNH miền nghiệm, không cho hệ) — ví dụ soạn mới
const LT_1377 = L(
  '##TC',
  R`Miền nghiệm là đa giác lồi cho bằng hình vẽ: biểu thức $F(x;y)=ax+by$ đạt giá trị lớn nhất, nhỏ nhất trên miền đó tại các đỉnh của đa giác.`,
  '',
  '##PP',
  R`Đọc toạ độ các đỉnh của miền nghiệm từ hình vẽ.`,
  R`Tính giá trị của $F$ tại từng đỉnh.`,
  R`So sánh các giá trị để kết luận giá trị lớn nhất và nhỏ nhất.`,
)
const VD_1377 = ghep(
  L('##VD',
    R`Cho miền nghiệm của một hệ bất phương trình là miền tam giác $ABC$ (phần tô màu, kể cả biên) trong hình vẽ dưới đây. Tìm giá trị lớn nhất và giá trị nhỏ nhất của biểu thức $F=2x+y$ trên miền đó.`,
    `![](${URL1})`,
    '**Hướng dẫn giải:**',
    R`Từ hình vẽ, các đỉnh của miền nghiệm là $A(1;1)$, $B(5;1)$, $C(3;4)$.`,
    R`Tính $F$ tại các đỉnh: $F(A)=2\cdot 1+1=3$; $F(B)=2\cdot 5+1=11$; $F(C)=2\cdot 3+4=10$.`,
    R`Vậy giá trị lớn nhất của $F$ là $11$ (tại $B$), giá trị nhỏ nhất là $3$ (tại $A$).`),
  L('##VD',
    R`Miền nghiệm của một hệ bất phương trình là miền tứ giác $OABC$ (phần tô màu, kể cả biên) trong hình vẽ dưới đây. Tính tổng của giá trị lớn nhất và giá trị nhỏ nhất của biểu thức $F=x+3y$ trên miền đó.`,
    `![](${URL2})`,
    R`A. $12$. B. $14$. C. $10$. D. $16$.`,
    '**Hướng dẫn giải:**',
    R`Từ hình vẽ, các đỉnh là $O(0;0)$, $A(4;0)$, $B(3;3)$, $C(0;2)$.`,
    R`Tính $F$ tại các đỉnh: $F(O)=0$; $F(A)=4$; $F(B)=3+3\cdot 3=12$; $F(C)=0+3\cdot 2=6$.`,
    R`Giá trị lớn nhất là $12$, giá trị nhỏ nhất là $0$, tổng bằng $12$. Chọn A.`),
)

let n = 0
for (const [id, lt, v] of [['NDB01367', LT_1367, VD_1367], ['NDB01371', LT_1371, VD_1371], ['NDB01375', LT_1375, VD_1375], ['NDB01377', LT_1377, VD_1377]]) {
  n += (await c.query(`update dai_bdm_dang_bai set ly_thuyet=$2, updated_at=now() where id=$1 and coalesce(ly_thuyet,'')=''`, [id, lt])).rowCount
  n += (await c.query(`update dai_bdm_dang_bai set vi_du=$2, updated_at=now() where id=$1 and coalesce(vi_du,'')=''`, [id, v])).rowCount
}
console.log({ truong_ghi: n, ky_vong: 8 })
if (GHI && n === 8) { await c.query('commit'); console.log('ĐÃ GHI') } else { await c.query('rollback'); console.log(GHI ? 'lệch ⇒ chưa ghi' : 'chạy khô (rollback)') }
await c.end()
