// Lý thuyết + ví dụ cho 8 dạng MỚI của bản đồ K10 (cập nhật 24–27/10): NDB01401 · 01404 · 01421 · 01422 · 01425 · 01595 · 01596 · 01628.
// Ví dụ: câu có sẵn trong kho (chỉ lấy câu lời giải sạch) hoặc SOẠN MỚI (đáp số kiểm tay). Chỉ ghi vào ô ĐANG RỖNG.
//   node kho-rules/dai/lo/k10-bdm/htl/lt-vd-dang-moi-2810.mjs [--ghi]
import fs from 'node:fs'
import pg from 'pg'

const GHI = process.argv.includes('--ghi')
const R = String.raw
const L = (...a) => a.join('\n')
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL }); await c.connect()
await c.query('begin')

const gon = (s) => String(s ?? '').replace(/\r/g, '').replace(/\n\s*\n/g, '\n').trim()
async function vd(ma, bang = 'dai_cau_hoi') {
  const q = (await c.query(`select noi_dung, lua_chon, anh_de, loi_giai from ${bang} where ma_cau = $1 and xoa_at is null`, [ma])).rows[0]
  if (!q) throw new Error('không có câu ' + ma)
  const lc = Array.isArray(q.lua_chon) && q.lua_chon.length ? q.lua_chon.map((x, i) => `${'ABCD'[i]}. ${gon(x)}`).join(' ') : ''
  return L('##VD', gon(q.noi_dung), q.anh_de ? `![](${q.anh_de})` : null, lc || null, '**Hướng dẫn giải:**', gon(q.loi_giai)).replace(/\n{2,}/g, '\n').replace(/\nnull(?=\n|$)/g, '')
}
const moi = (de, ...lg) => L('##VD', de, '**Hướng dẫn giải:**', ...lg)
const ghep = (...v) => v.join('\n\n')

// ───────── NDB01401 cực trị véc tơ
const LT_1401 = L(
  '##PP',
  R`Bước 1. Dựng điểm cố định $I$ thoả $\sum k_i\overrightarrow{IA_i}=\overrightarrow{0}$ (trung điểm, trọng tâm hoặc điểm chia đoạn theo tỉ số).`,
  R`Bước 2. Viết $\sum k_i\overrightarrow{MA_i}=\left(\sum k_i\right)\overrightarrow{MI}$ nên $\left|\sum k_i\overrightarrow{MA_i}\right|=\left|\sum k_i\right|\cdot MI$.`,
  R`Bước 3. Đưa bài toán về tìm vị trí của $M$ làm $MI$ nhỏ nhất: nếu $M$ thuộc đường thẳng $d$ thì $M$ là hình chiếu của $I$ lên $d$, và $MI_{\min}=d(I,d)$.`,
)
const VD_1401 = ghep(
  moi(R`Cho tam giác đều $ABC$ cạnh $2a$, đường thẳng $d$ đi qua $A$ và song song với $BC$. Tìm giá trị nhỏ nhất của $\left|\overrightarrow{MA}+2\overrightarrow{MB}\right|$ khi $M$ di động trên $d$.`,
    R`Lấy $N$ thuộc đoạn $AB$ sao cho $NA=2NB$, khi đó $\overrightarrow{NA}+2\overrightarrow{NB}=\overrightarrow{0}$.`,
    R`$\overrightarrow{MA}+2\overrightarrow{MB}=3\overrightarrow{MN}$ nên $\left|\overrightarrow{MA}+2\overrightarrow{MB}\right|=3MN$.`,
    R`$MN$ nhỏ nhất khi $M$ là hình chiếu của $N$ lên $d$, $MN_{\min}=d(N,d)=\dfrac{2}{3}\cdot a\sqrt{3}=\dfrac{2a\sqrt{3}}{3}$ (khoảng cách từ $B$ đến $d$ bằng đường cao $a\sqrt{3}$ và $AN=\dfrac{2}{3}AB$).`,
    R`Vậy giá trị nhỏ nhất bằng $3\cdot\dfrac{2a\sqrt{3}}{3}=2a\sqrt{3}$.`),
  moi(R`Cho tam giác $ABC$ vuông tại $A$ có $AB=3$, $AC=4$. Điểm $M$ di động trên cạnh $BC$. Tìm giá trị nhỏ nhất của $\left|\overrightarrow{MA}+\overrightarrow{MB}+\overrightarrow{MC}\right|$.`,
    R`Gọi $G$ là trọng tâm tam giác $ABC$ thì $\overrightarrow{MA}+\overrightarrow{MB}+\overrightarrow{MC}=3\overrightarrow{MG}$.`,
    R`Do đó $\left|\overrightarrow{MA}+\overrightarrow{MB}+\overrightarrow{MC}\right|=3MG$, nhỏ nhất khi $M$ là hình chiếu của $G$ lên $BC$.`,
    R`$BC=5$, đường cao $AH=\dfrac{AB\cdot AC}{BC}=\dfrac{12}{5}$ nên $d(G,BC)=\dfrac{1}{3}AH=\dfrac{4}{5}$.`,
    R`Vậy giá trị nhỏ nhất bằng $3\cdot\dfrac{4}{5}=\dfrac{12}{5}$.`),
)

// ───────── NDB01404 BPT bậc nhất một ẩn thực tế
const LT_1404 = L(
  '##PP',
  R`Bước 1. Gọi ẩn $x$ là đại lượng cần tìm (kèm điều kiện: không âm, nguyên nếu đếm vật).`,
  R`Bước 2. Biểu diễn mọi đại lượng liên quan theo $x$; dịch ràng buộc của đề thành bất phương trình: "không vượt quá" $\Rightarrow\le$; "ít nhất" $\Rightarrow\ge$; "vượt quá" $\Rightarrow>$; "nhỏ hơn" $\Rightarrow<$.`,
  R`Bước 3. Giải bất phương trình bậc nhất $ax+b\le 0$ (chia hai vế cho số âm thì đổi chiều), kết hợp điều kiện của $x$ rồi trả lời đúng điều đề hỏi (giá trị lớn nhất, nhỏ nhất hoặc khoảng giá trị).`,
)
const VD_1404 = ghep(
  moi(R`Bạn Lan có $600$ nghìn đồng để mua bút, mỗi chiếc bút giá $15$ nghìn đồng. Hỏi Lan mua được nhiều nhất bao nhiêu chiếc bút?`,
    R`Gọi $x$ là số bút Lan mua, $x\in\mathbb{N}$.`,
    R`Số tiền mua là $15x$ (nghìn đồng), không vượt quá $600$ nên $15x\le 600$.`,
    R`Suy ra $x\le 40$.`,
    R`Vậy Lan mua được nhiều nhất $40$ chiếc bút.`),
  moi(R`Một gói cước điện thoại tính phí thuê bao $50$ nghìn đồng mỗi tháng và $2$ nghìn đồng mỗi phút gọi. Để số tiền phải trả trong tháng không vượt quá $200$ nghìn đồng thì thời gian gọi tối đa là bao nhiêu phút?`,
    R`Gọi $x$ là số phút gọi trong tháng, $x\ge 0$.`,
    R`Số tiền phải trả là $50+2x$ (nghìn đồng) và không vượt quá $200$ nên $50+2x\le 200$.`,
    R`Suy ra $2x\le 150$, tức $x\le 75$.`,
    R`Vậy thời gian gọi tối đa là $75$ phút.`),
)

// ───────── NDB01421 vị trí điểm thoả đẳng thức vectơ
const LT_1421 = L(
  '##PP',
  R`Biến đổi đẳng thức đã cho về dạng $\overrightarrow{AM}=k\cdot\overrightarrow{u}$ (với $A$ là một điểm cố định và $\overrightarrow{u}$ là vectơ xác định từ các điểm đã cho) bằng quy tắc ba điểm, quy tắc hình bình hành, tính chất trung điểm, trọng tâm.`,
  R`Từ $\overrightarrow{AM}=k\overrightarrow{u}$: điểm $M$ nằm trên tia $Ax$ cùng hướng $\overrightarrow{u}$ nếu $k>0$, ngược hướng nếu $k<0$, với $AM=|k|\cdot|\overrightarrow{u}|$; có đúng một điểm $M$ như vậy.`,
  R`Các kết quả hay gặp: $\overrightarrow{MA}+\overrightarrow{MB}=\overrightarrow{0}$ $\Leftrightarrow$ $M$ là trung điểm $AB$; $\overrightarrow{MA}+\overrightarrow{MB}+\overrightarrow{MC}=\overrightarrow{0}$ $\Leftrightarrow$ $M$ là trọng tâm tam giác $ABC$; $\overrightarrow{MC}=\overrightarrow{AB}$ $\Leftrightarrow$ $ABCM$ là hình bình hành (khi $A,B,C$ không thẳng hàng).`,
)
const VD_1421 = ghep(
  await vd('T310010201086', 'hgt_cau_hoi'),
  await vd('T310000000220', 'hgt_cau_hoi'),
  moi(R`Cho tam giác $ABC$. Xác định vị trí điểm $M$ thoả mãn $\overrightarrow{MA}+\overrightarrow{MB}+\overrightarrow{MC}=\overrightarrow{0}$.`,
    R`Gọi $G$ là trọng tâm tam giác $ABC$ thì $\overrightarrow{GA}+\overrightarrow{GB}+\overrightarrow{GC}=\overrightarrow{0}$.`,
    R`Ta có $\overrightarrow{MA}+\overrightarrow{MB}+\overrightarrow{MC}=3\overrightarrow{MG}$, nên điều kiện đã cho tương đương $\overrightarrow{MG}=\overrightarrow{0}$.`,
    R`Vậy $M$ trùng với trọng tâm $G$ của tam giác $ABC$.`),
)

// ───────── NDB01422 hai vectơ bằng nhau, đối nhau (toạ độ)
const LT_1422 = L(
  '##TC',
  R`Hai vectơ $\vec{a}=(a_1;a_2)$ và $\vec{b}=(b_1;b_2)$ bằng nhau khi và chỉ khi $a_1=b_1$ và $a_2=b_2$.`,
  R`Hai vectơ đối nhau ($\vec{a}=-\vec{b}$) khi và chỉ khi $a_1=-b_1$ và $a_2=-b_2$.`,
  '',
  '##PP',
  R`Bước 1. Viết đẳng thức toạ độ từng thành phần: hoành độ bằng hoành độ, tung độ bằng tung độ (đổi dấu nếu đối nhau).`,
  R`Bước 2. Giải hệ phương trình thu được để tìm tham số hoặc ẩn; kết luận cặp giá trị thoả mãn.`,
)
const VD_1422 = ghep(await vd('T3100000001133', 'hgt_cau_hoi'), await vd('T3100000001178', 'hgt_cau_hoi'),
  moi(R`Cho $\vec{u}=(2m+1;3)$ và $\vec{v}=(5;n-2)$. Tìm $m$, $n$ để $\vec{u}$ và $\vec{v}$ đối nhau.`,
    R`$\vec{u}=-\vec{v}\Leftrightarrow\begin{cases}2m+1=-5\\3=-(n-2)\end{cases}$.`,
    R`Từ đó $m=-3$ và $n=-1$.`,
    R`Vậy $m=-3$, $n=-1$.`))

// ───────── NDB01425 điều kiện lực thành phần
const LT_1425 = L(
  '##PP',
  R`Bước 1. Đặt tên các lực thành vectơ cùng gốc; hợp lực là $\overrightarrow{F}=\overrightarrow{F_1}+\overrightarrow{F_2}+\dots$ (dựng hình bình hành hoặc chiếu lên hai phương vuông góc).`,
  R`Bước 2. Dịch điều kiện của đề thành hệ thức cho hợp lực: vật cân bằng $\Rightarrow\overrightarrow{F}=\overrightarrow{0}$; hợp lực có độ lớn cho trước hoặc có hướng cho trước (vuông góc với một lực, dọc theo một đường).`,
  R`Bước 3. Tính độ lớn bằng định lí côsin, định lí sin hoặc định lí Pythagore rồi giải tìm độ lớn lực chưa biết.`,
)
const VD_1425 = ghep(
  moi(R`Hai lực $\overrightarrow{F_1}$, $\overrightarrow{F_2}$ vuông góc với nhau cùng tác dụng lên một vật, $\left|\overrightarrow{F_1}\right|=3\ \text{N}$. Hỏi lực $\overrightarrow{F_2}$ phải có độ lớn bao nhiêu để hợp lực có độ lớn $5\ \text{N}$?`,
    R`Vì $\overrightarrow{F_1}\perp\overrightarrow{F_2}$ nên hợp lực $\overrightarrow{F}=\overrightarrow{F_1}+\overrightarrow{F_2}$ là đường chéo hình chữ nhật có hai cạnh $\left|\overrightarrow{F_1}\right|$ và $\left|\overrightarrow{F_2}\right|$.`,
    R`$\left|\overrightarrow{F}\right|^{2}=\left|\overrightarrow{F_1}\right|^{2}+\left|\overrightarrow{F_2}\right|^{2}$ nên $25=9+\left|\overrightarrow{F_2}\right|^{2}$.`,
    R`Suy ra $\left|\overrightarrow{F_2}\right|=4\ \text{N}$.`),
  await vd('T310010104017', 'hgt_cau_hoi'),
)

// ───────── NDB01595 tập hợp chứa tham số m khác
const LT_1595 = L(
  '##PP',
  R`Bước 1. Đặt điều kiện để mỗi tập hợp (khoảng, đoạn, nửa khoảng) hợp lệ, tức đầu mút trái nhỏ hơn đầu mút phải (với đoạn $[a;b]$ cho phép $a\le b$).`,
  R`Bước 2. Chuyển yêu cầu của đề (hiệu rỗng, hai tập bằng nhau, tập có đúng $k$ phần tử nguyên…) về quan hệ giữa các đầu mút, vẽ hai tập trên trục số để so sánh; chú ý đầu mút lấy hay không lấy.`,
  R`Bước 3. Giải hệ bất phương trình theo $m$, kết hợp điều kiện hợp lệ rồi đếm hoặc liệt kê các giá trị $m$ thoả mãn (đề thường hỏi $m$ nguyên).`,
)
const VD_1595 = ghep(
  moi(R`Cho hai tập hợp $A=(m-1;8]$ và $B=(2;16-m)$, $m\in\mathbb{R}$. Có bao nhiêu số nguyên $m$ để $A\setminus B=\varnothing$?`,
    R`$A$ là nửa khoảng nên $m-1<8$, tức $m<9$.`,
    R`$A\setminus B=\varnothing\Leftrightarrow A\subset B$.`,
    R`Đầu mút trái của $B$ là $2$ (không lấy), $A$ không lấy $m-1$ nên cần $m-1\ge 2$, tức $m\ge 3$.`,
    R`Đầu mút phải $8$ của $A$ được lấy nên cần $8<16-m$, tức $m<8$.`,
    R`Vậy $3\le m<8$; các số nguyên $m$ là $3;4;5;6;7$, có $5$ giá trị.`),
  moi(R`Cho $A=[m;m+2]$ và $B=[1;4]$. Tìm $m$ để $A\subset B$.`,
    R`$A\subset B$ khi và chỉ khi $m\ge 1$ và $m+2\le 4$.`,
    R`Suy ra $m\ge 1$ và $m\le 2$.`,
    R`Vậy $1\le m\le 2$.`),
)

// ───────── NDB01596 tổng số phần tử của cả nhóm
const LT_1596 = L(
  '##TC',
  R`Với hai tập $A$, $B$: $n(A\cup B)=n(A)+n(B)-n(A\cap B)$.`,
  R`Nếu toàn nhóm gồm những phần tử thuộc $A\cup B$ và $k$ phần tử không thuộc $A$, cũng không thuộc $B$ thì tổng số phần tử của cả nhóm là $n(A\cup B)+k$.`,
  '',
  '##PP',
  R`Bước 1. Đặt tên các tập hợp $A$, $B$ ứng với từng nhóm và ghi $n(A)$, $n(B)$, $n(A\cap B)$ theo đề.`,
  R`Bước 2. Tính số phần tử thuộc ít nhất một nhóm: $n(A\cup B)=n(A)+n(B)-n(A\cap B)$.`,
  R`Bước 3. Cộng số phần tử không thuộc nhóm nào để được tổng số của cả nhóm.`,
)
const VD_1596 = ghep(
  await vd('T110010204067'),
  moi(R`Trong một nhóm bạn, có $25$ bạn thích bóng đá, $18$ bạn thích bóng rổ, $8$ bạn thích cả hai môn và $3$ bạn không thích môn nào. Hỏi nhóm có bao nhiêu bạn?`,
    R`Gọi $A$ là tập các bạn thích bóng đá, $B$ là tập các bạn thích bóng rổ: $n(A)=25$, $n(B)=18$, $n(A\cap B)=8$.`,
    R`$n(A\cup B)=25+18-8=35$.`,
    R`Có thêm $3$ bạn không thích môn nào nên cả nhóm có $35+3=38$ bạn.`),
)

// ───────── NDB01628 trực tâm, chân đường cao
const LT_1628 = L(
  '##PP',
  R`Trực tâm $H(x;y)$ của tam giác $ABC$: $\begin{cases}\overrightarrow{AH}\cdot\overrightarrow{BC}=0\\\overrightarrow{BH}\cdot\overrightarrow{AC}=0\end{cases}$ (hai đường cao vuông góc với hai cạnh tương ứng); giải hệ hai phương trình bậc nhất ẩn $x,y$.`,
  R`Chân đường cao $K$ kẻ từ $A$ xuống $BC$: $K$ thuộc $BC$ (nên $\overrightarrow{BK}=t\overrightarrow{BC}$) và $\overrightarrow{AK}\cdot\overrightarrow{BC}=0$; giải tìm $t$ rồi suy ra toạ độ $K$.`,
)
const VD_1628 = ghep(
  moi(R`Trong mặt phẳng $Oxy$, cho tam giác $ABC$ có $A(5;3)$, $B(2;-1)$, $C(-1;5)$. Tìm toạ độ trực tâm $H$ của tam giác $ABC$.`,
    R`Gọi $H(x;y)$ là trực tâm; $\overrightarrow{AH}=(x-5;y-3)$, $\overrightarrow{BC}=(-3;6)$, $\overrightarrow{BH}=(x-2;y+1)$, $\overrightarrow{AC}=(-6;2)$.`,
    R`$\overrightarrow{AH}\cdot\overrightarrow{BC}=0\Leftrightarrow-3(x-5)+6(y-3)=0\Leftrightarrow x-2y=-1$.`,
    R`$\overrightarrow{BH}\cdot\overrightarrow{AC}=0\Leftrightarrow-6(x-2)+2(y+1)=0\Leftrightarrow3x-y=7$.`,
    R`Giải hệ ta được $x=3$, $y=2$. Vậy $H(3;2)$.`),
  await vd('T310000000932', 'hgt_cau_hoi'),
  moi(R`Cho $A(1;2)$, $B(3;4)$, $C(2;-1)$. Tìm toạ độ chân đường cao $K$ kẻ từ $A$ của tam giác $ABC$.`,
    R`$\overrightarrow{BC}=(-1;-5)$. Vì $K\in BC$ nên $\overrightarrow{BK}=t\overrightarrow{BC}$, suy ra $K(3-t;4-5t)$.`,
    R`$\overrightarrow{AK}=(2-t;2-5t)$ và $AK\perp BC$ nên $-(2-t)-5(2-5t)=0\Leftrightarrow26t=12\Leftrightarrow t=\dfrac{6}{13}$.`,
    R`Vậy $K\left(\dfrac{33}{13};\dfrac{22}{13}\right)$.`),
)

let n = 0
const dang = [['NDB01401', LT_1401, VD_1401], ['NDB01404', LT_1404, VD_1404], ['NDB01421', LT_1421, VD_1421], ['NDB01422', LT_1422, VD_1422],
  ['NDB01425', LT_1425, VD_1425], ['NDB01595', LT_1595, VD_1595], ['NDB01596', LT_1596, VD_1596], ['NDB01628', LT_1628, VD_1628]]
for (const [id, lt, v] of dang) {
  if ((v.match(/\$/g) || []).length % 2 || (lt.match(/\$/g) || []).length % 2) throw new Error('lẻ dấu $ ở ' + id)
  if (/[\u0000-\u0008\u000b-\u001f]/.test(v + lt)) throw new Error('ký tự điều khiển ở ' + id)
  n += (await c.query(`update dai_bdm_dang_bai set ly_thuyet=$2, updated_at=now() where id=$1 and coalesce(ly_thuyet,'')=''`, [id, lt])).rowCount
  n += (await c.query(`update dai_bdm_dang_bai set vi_du=$2, updated_at=now() where id=$1 and coalesce(vi_du,'')=''`, [id, v])).rowCount
}
console.log({ truong_ghi: n, ky_vong: 16 })
if (GHI && n === 16) { await c.query('commit'); console.log('ĐÃ GHI') } else { await c.query('rollback'); console.log(GHI ? 'lệch ⇒ chưa ghi' : 'chạy khô (rollback)') }
await c.end()
