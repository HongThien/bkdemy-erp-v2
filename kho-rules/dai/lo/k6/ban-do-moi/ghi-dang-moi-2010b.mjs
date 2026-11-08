// ghi-dang-moi-2010b.mjs — điền LÝ THUYẾT + VÍ DỤ cho 6 dạng bài K6 Thùy thêm tối 20/10 (sau lượt 2 dạng đầu) + LÝ THUYẾT 2 nhóm hình mới.
//   NDB01223 Nhận biết số tự nhiên · NDB01224 So sánh số tự nhiên · NDB01220 Nhận biết các loại hình phẳng · NDB01221 Tính chất các loại hình phẳng
//   NDB01218 Chu vi diện tích các hình · NDB01219 Bài toán lời văn chu vi–diện tích · nhóm NNB01593 (Tính chất cơ bản của các hình) · NNB01595 (Chu vi diện tích các hình)
//   node kho-rules/dai/lo/k6/ban-do-moi/ghi-dang-moi-2010b.mjs [--ghi]   (mặc định chạy thử, ROLLBACK)
// Chỉ ghi ô RỖNG (điều kiện trong CÙNG câu UPDATE ⇒ không đè nếu Thùy vừa gõ). Phạm vi hình = SGK KNTT 6 Ch IV (KHÔNG số đo góc — Ch VIII; hình thoi chỉ nêu "đường chéo vuông góc").
import pg from 'pg'
import { createRequire } from 'node:module'
process.loadEnvFile('.env')
const R = String.raw

// ───────── LÝ THUYẾT CẤP DẠNG ─────────
const LT = {
  NDB01223: R`##ĐN
Tập hợp các số tự nhiên kí hiệu $\mathbb{N}=\{0;1;2;3;\dots\}$. Tập hợp các số tự nhiên khác $0$ kí hiệu $\mathbb{N}^*=\{1;2;3;\dots\}$.

##TC
Số tự nhiên là $0$ và các số đếm $1; 2; 3; \dots$; mỗi số tự nhiên có đúng một số liền sau, và chỉ số $0$ không có số liền trước.
Số có phần thập phân khác $0$ (như $2,5$), phân số mà tử không chia hết cho mẫu (như $\dfrac{3}{4}$) và số có dấu trừ đứng trước (như $-3$) không là số tự nhiên.
Một số viết dưới dạng khác nhưng bằng một số tự nhiên vẫn là số tự nhiên: $9,0=9$; $\dfrac{12}{4}=3$.

##PP
Với từng số đã cho, viết gọn về dạng đơn giản nhất (bỏ chữ số $0$ thừa sau dấu phẩy, thực hiện phép chia ở phân số nếu chia hết).
Số nào đưa được về $0; 1; 2; 3; \dots$ thì là số tự nhiên; số còn lại thì không.
Với câu hỏi về tập hợp: kiểm tra từng phần tử có là số tự nhiên không; chú ý tập $\mathbb{N}$ có phần tử $0$, tập $\mathbb{N}^*$ không có.

##CY
$0$ là số tự nhiên nhưng không thuộc $\mathbb{N}^*$.
Đừng loại nhầm số như $5,0$ hay $\dfrac{8}{4}$: chúng bằng $5$ và $2$ nên vẫn là số tự nhiên.`,

  NDB01224: R`##TC
Trong hai số tự nhiên, số nào có nhiều chữ số hơn thì lớn hơn.
Hai số có cùng số chữ số thì so sánh từng cặp chữ số cùng hàng, từ trái sang phải; ở cặp đầu tiên khác nhau, chữ số nào lớn hơn thì số đó lớn hơn.
Trên tia số, số nằm bên trái nhỏ hơn số nằm bên phải. Nếu $a<b$ và $b<c$ thì $a<c$.

##PP
Đếm số chữ số của các số cần so sánh; nếu khác nhau, kết luận ngay.
Nếu cùng số chữ số, so sánh lần lượt hàng cao nhất, hàng kế tiếp, … cho tới cặp đầu tiên khác nhau.
Muốn sắp xếp nhiều số: so sánh từng cặp rồi viết theo thứ tự tăng dần (hoặc giảm dần) bằng dấu $<$ ($>$).

##CY
$a\le b$ nghĩa là $a<b$ hoặc $a=b$; $a\ge b$ nghĩa là $a>b$ hoặc $a=b$.
Chữ số $0$ ở đầu không tính vào số chữ số của một số.`,

  NDB01220: R`##PP
Đọc kĩ dữ kiện đề cho (số cạnh, các cạnh được đánh dấu bằng nhau, góc vuông, cạnh song song, đường chéo) rồi đối chiếu với đặc điểm của từng hình ở phần lý thuyết nhóm.
Đếm số cạnh của hình: ba cạnh là tam giác, bốn cạnh là tứ giác (hình vuông, hình chữ nhật, hình thoi, hình bình hành, hình thang cân), sáu cạnh có thể là lục giác đều.
Với tứ giác, xét lần lượt: bốn cạnh có bằng nhau không, có góc vuông không, hai cặp cạnh đối có song song không, rồi chọn hình có đủ các đặc điểm đó.

##CY
Chỉ kết luận theo các kí hiệu có trên hình (gạch bằng nhau, kí hiệu góc vuông, mũi tên song song), không đoán bằng mắt vì hình vẽ có thể không đúng tỉ lệ.
Một hình có thể thoả mãn nhiều đặc điểm; chọn tên hình thoả mãn đầy đủ nhất các đặc điểm đề cho.`,

  NDB01221: R`##PP
Gọi tên hình mà đề nêu (hoặc nhận ra hình từ dữ kiện), nhớ lại các tính chất của hình đó (cạnh, góc, đường chéo).
Từ độ dài hoặc tính chất đã cho, suy ra yếu tố cần tìm: cạnh đối bằng nhau, đường chéo bằng nhau, hai đường chéo vuông góc, …
Kết luận bằng một câu nêu rõ tính chất đã dùng.

##CY
Mỗi hình chỉ dùng đúng những tính chất của nó: hình thoi có hai đường chéo vuông góc nhưng không nhất thiết bằng nhau; hình chữ nhật có hai đường chéo bằng nhau nhưng không nhất thiết vuông góc.
Hình bình hành có cạnh đối bằng nhau; hình thang cân chỉ có hai cạnh bên bằng nhau, hai đáy thì không bằng nhau.`,

  NDB01218: R`##PP
Xác định hình đề cho và các số đo đã biết; đổi các độ dài về cùng một đơn vị đo.
Chọn công thức chu vi hoặc diện tích của hình đó (xem lý thuyết nhóm) rồi thay số.
Tính theo từng bước, ghi đơn vị: chu vi dùng đơn vị độ dài ($\text{cm}$, $\text{m}$), diện tích dùng đơn vị diện tích ($\text{cm}^2$, $\text{m}^2$).

##CY
Chu vi là tổng độ dài các cạnh; diện tích là phần mặt phẳng hình chiếm.
Với hình bình hành và hình thang cân phải dùng chiều cao (đường vuông góc), không dùng cạnh bên để tính diện tích.
Với hình thoi, tính diện tích bằng hai đường chéo; chu vi bằng bốn lần cạnh.`,

  NDB01219: R`##PP
Đọc đề, xác định hình thực tế (sân, mảnh vườn, nền nhà, …) và phải tính đại lượng nào: diện tích (lát gạch, trồng cây, sơn, …) hay chu vi (làm hàng rào, viền, …).
Đổi các độ dài về cùng đơn vị, tính chu vi hoặc diện tích bằng công thức của hình đó.
Tính tiếp số viên gạch, số cây, số tiền, … bằng phép nhân hoặc phép chia với số liệu đề cho (chia diện tích cho diện tích một viên gạch; nhân số mét với giá mỗi mét).
Kết luận bằng một câu có đơn vị.

##CY
Muốn đếm số viên gạch phải chia hai diện tích cùng một đơn vị (đổi $\text{m}^2$ ra $\text{dm}^2$ hoặc $\text{cm}^2$ trước khi chia).
Hàng rào quanh mảnh đất tính theo chu vi; chú ý đề có chừa lối đi / cổng thì trừ đúng độ dài đó.`,
}

// ───────── VÍ DỤ CẤP DẠNG ─────────
const VD = {
  NDB01223: R`##VD
Trong các số $0$; $\dfrac{3}{4}$; $7$; $2,5$; $\dfrac{12}{4}$; $9,0$, những số nào là số tự nhiên?
**Hướng dẫn giải:**
Ta đưa các số về dạng gọn nhất:

$\dfrac{12}{4}=3$ và $9,0=9$.

Các số $0$; $7$; $3$; $9$ là số tự nhiên.

Số $\dfrac{3}{4}$ (tử không chia hết cho mẫu) và số $2,5$ (phần thập phân khác $0$) không là số tự nhiên.

Vậy các số tự nhiên là $0$; $7$; $\dfrac{12}{4}$; $9,0$.

##VD
Điền kí hiệu $\in$ hoặc $\notin$ vào chỗ trống:
a) $0\ \ldots\ \mathbb{N}^*$;
b) $0\ \ldots\ \mathbb{N}$;
c) $\dfrac{1}{2}\ \ldots\ \mathbb{N}$.
**Hướng dẫn giải:**
a) Tập $\mathbb{N}^*$ gồm các số tự nhiên khác $0$ nên $0\notin\mathbb{N}^*$.

b) $0$ là số tự nhiên nên $0\in\mathbb{N}$.

c) $\dfrac{1}{2}$ không là số tự nhiên nên $\dfrac{1}{2}\notin\mathbb{N}$.`,

  NDB01224: R`##VD
So sánh:
a) $9876$ và $10000$;
b) $4705$ và $4750$.
**Hướng dẫn giải:**
a) Số $9876$ có $4$ chữ số, số $10000$ có $5$ chữ số.

Do đó $9876<10000$.

b) Hai số đều có $4$ chữ số. Hàng nghìn: $4=4$; hàng trăm: $7=7$; hàng chục: $0<5$.

Do đó $4705<4750$.

##VD
Sắp xếp các số $3092$; $3209$; $392$; $3029$ theo thứ tự tăng dần.
**Hướng dẫn giải:**
Số $392$ có $3$ chữ số, các số còn lại có $4$ chữ số nên $392$ nhỏ nhất.

So sánh ba số có $4$ chữ số: hàng nghìn đều là $3$. Hàng trăm của $3029$ và $3092$ là $0$, của $3209$ là $2$ nên $3209$ lớn nhất.

So sánh $3029$ và $3092$: hàng trăm bằng nhau; hàng chục $2<9$ nên $3029<3092$.

Vậy $392<3029<3092<3209$.`,

  NDB01220: R`##VD
Hình có bốn cạnh bằng nhau và bốn góc vuông là hình gì?
**Hướng dẫn giải:**
Hình có bốn cạnh bằng nhau và bốn góc vuông là hình vuông.

Vậy đó là hình vuông.

##VD
Tứ giác $ABCD$ có $AB=BC=CD=DA$, hai cặp cạnh đối song song và hai đường chéo vuông góc nhưng không có góc nào là góc vuông. Đó là hình gì?
**Hướng dẫn giải:**
Tứ giác có bốn cạnh bằng nhau và hai cặp cạnh đối song song nên không phải hình thang cân hay hình chữ nhật.

Tứ giác không có góc vuông nên không phải hình vuông.

Vậy $ABCD$ là hình thoi.`,

  NDB01221: R`##VD
Cho hình chữ nhật $ABCD$ có đường chéo $AC=10\ \text{cm}$. Tính độ dài đường chéo $BD$.
**Hướng dẫn giải:**
Hình chữ nhật có hai đường chéo bằng nhau nên $BD=AC$.

Vậy $BD=10\ \text{cm}$.

##VD
Hình bình hành $MNPQ$ có $MN=6\ \text{cm}$, $NP=4\ \text{cm}$. Tính độ dài các cạnh $PQ$ và $QM$.
**Hướng dẫn giải:**
Hình bình hành có các cạnh đối bằng nhau nên $PQ=MN=6\ \text{cm}$ và $QM=NP=4\ \text{cm}$.

Vậy $PQ=6\ \text{cm}$; $QM=4\ \text{cm}$.`,

  NDB01218: R`##VD
Tính chu vi và diện tích hình chữ nhật có chiều dài $12\ \text{cm}$, chiều rộng $5\ \text{cm}$.
**Hướng dẫn giải:**
Chu vi hình chữ nhật là:

$2.(12+5)=34\ (\text{cm})$.

Diện tích hình chữ nhật là:

$12.5=60\ (\text{cm}^2)$.

Vậy chu vi là $34\ \text{cm}$, diện tích là $60\ \text{cm}^2$.

##VD
Tính diện tích:
a) hình thoi có hai đường chéo dài $8\ \text{cm}$ và $6\ \text{cm}$;
b) hình thang cân có hai đáy dài $10\ \text{cm}$ và $6\ \text{cm}$, chiều cao $4\ \text{cm}$.
**Hướng dẫn giải:**
a) Diện tích hình thoi là:

$\dfrac{8.6}{2}=24\ (\text{cm}^2)$.

b) Diện tích hình thang cân là:

$\dfrac{(10+6).4}{2}=32\ (\text{cm}^2)$.

Vậy diện tích hình thoi là $24\ \text{cm}^2$, diện tích hình thang cân là $32\ \text{cm}^2$.`,

  NDB01219: R`##VD
Sân trường hình chữ nhật dài $40\ \text{m}$, rộng $25\ \text{m}$. Người ta lát sân bằng những viên gạch hình vuông cạnh $5\ \text{dm}$. Hỏi cần bao nhiêu viên gạch?
**Hướng dẫn giải:**
Diện tích sân trường là:

$40.25=1000\ (\text{m}^2)=100000\ (\text{dm}^2)$.

Diện tích một viên gạch là:

$5.5=25\ (\text{dm}^2)$.

Số viên gạch cần dùng là:

$100000:25=4000$ (viên).

Vậy cần $4000$ viên gạch.

##VD
Mảnh vườn hình bình hành có hai cạnh liền kề dài $15\ \text{m}$ và $10\ \text{m}$, đường cao ứng với cạnh $15\ \text{m}$ dài $8\ \text{m}$. Người ta rào xung quanh mảnh vườn, giá mỗi mét hàng rào là $30000$ đồng.
a) Tính diện tích mảnh vườn.
b) Tính số tiền rào mảnh vườn.
**Hướng dẫn giải:**
a) Diện tích mảnh vườn là:

$15.8=120\ (\text{m}^2)$.

b) Chu vi mảnh vườn là:

$2.(15+10)=50\ (\text{m})$.

Số tiền rào mảnh vườn là:

$50.30000=1500000$ (đồng).

Vậy diện tích là $120\ \text{m}^2$ và số tiền rào là $1500000$ đồng.`,
}

// ───────── LÝ THUYẾT CẤP NHÓM (2 nhóm hình mới) ─────────
const NHOM_LT = {
  NNB01593: R`##TC
Tam giác đều: ba cạnh bằng nhau, ba góc bằng nhau.
Hình vuông: bốn cạnh bằng nhau, bốn góc vuông; hai cặp cạnh đối song song; hai đường chéo bằng nhau.
Lục giác đều: sáu cạnh bằng nhau, sáu góc bằng nhau; ba đường chéo chính (nối hai đỉnh đối nhau) bằng nhau và cắt nhau tại một điểm.

##TC
Hình chữ nhật: bốn góc vuông; các cạnh đối bằng nhau và song song; hai đường chéo bằng nhau.
Hình thoi: bốn cạnh bằng nhau; các cạnh đối song song; các góc đối bằng nhau; hai đường chéo vuông góc với nhau.
Hình bình hành: các cạnh đối song song và bằng nhau; các góc đối bằng nhau; hai đường chéo cắt nhau tại trung điểm của mỗi đường.
Hình thang cân: hai cạnh đáy song song; hai cạnh bên bằng nhau; hai đường chéo bằng nhau.

##PP
Để biết một hình là hình gì: đếm số cạnh, xét các cạnh được đánh dấu bằng nhau, kí hiệu góc vuông và các cạnh song song, rồi đối chiếu với đặc điểm từng hình ở trên.
Để dùng tính chất: gọi tên hình, chọn đúng tính chất của hình đó (cạnh, góc, đường chéo) và suy ra yếu tố cần tìm.

##CY
Chỉ dựa vào kí hiệu trên hình hoặc dữ kiện của đề, không kết luận bằng mắt.
Mỗi hình chỉ có các tính chất của nó: hình thoi có hai đường chéo vuông góc, hình chữ nhật có hai đường chéo bằng nhau.`,

  NNB01595: R`##TC
Hình vuông cạnh $a$: chu vi $C=4.a$; diện tích $S=a.a$.
Hình chữ nhật có hai cạnh $a$, $b$: chu vi $C=2.(a+b)$; diện tích $S=a.b$.
Hình bình hành có hai cạnh liền kề $a$, $b$ và đường cao $h$ ứng với cạnh $a$: chu vi $C=2.(a+b)$; diện tích $S=a.h$.

##TC
Hình thoi cạnh $a$, hai đường chéo $m$, $n$: chu vi $C=4.a$; diện tích $S=\dfrac{m.n}{2}$.
Hình thang cân có hai đáy $a$, $b$ và chiều cao $h$: diện tích $S=\dfrac{(a+b).h}{2}$.
Tam giác đều cạnh $a$: chu vi $C=3.a$. Lục giác đều cạnh $a$: chu vi $C=6.a$.

##PP
Đổi các độ dài về cùng một đơn vị đo, chọn công thức của hình đã cho, thay số rồi tính.
Ghi đơn vị đúng: chu vi theo đơn vị độ dài ($\text{cm}$, $\text{m}$), diện tích theo đơn vị diện tích ($\text{cm}^2$, $\text{m}^2$).
Bài thực tế: tính diện tích hoặc chu vi trước, sau đó dùng phép nhân, chia để tính số gạch, số tiền, …

##CY
Chu vi là tổng độ dài các cạnh; diện tích là phần mặt phẳng hình chiếm.
Với hình bình hành dùng chiều cao (đường vuông góc), không dùng cạnh bên.`,
}

// ───────── KIỂM ─────────
const require = createRequire(new URL('../../../../../package.json', import.meta.url))
const katex = require('katex')
const loi = []
for (const [grp, tb] of [['LT', LT], ['VD', VD], ['NHOM', NHOM_LT]]) {
  for (const [k, s] of Object.entries(tb)) {
    if ((s.match(/\$/g) || []).length % 2) loi.push(`${grp} ${k}: số dấu $ lẻ`)
    for (const m of s.matchAll(/\$([^$]+)\$/g)) {
      try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${grp} ${k}: KaTeX «${m[1].slice(0, 40)}» ${e.message.slice(0, 60)}`) }
      if (/\\cdot|\\times/.test(m[1])) loi.push(`${grp} ${k}: cấm \\cdot/\\times`)
    }
  }
}
const chk = (c, t) => { if (!c) loi.push(t) }
chk(Math.floor(12 / 4) === 3 && 12 % 4 === 0, '12/4')
chk(9876 < 10000 && String(9876).length === 4 && String(10000).length === 5, '9876<10000')
chk(4705 < 4750, '4705<4750')
chk(JSON.stringify([3092, 3209, 392, 3029].sort((a, b) => a - b)) === JSON.stringify([392, 3029, 3092, 3209]), 'sắp xếp')
chk(2 * (12 + 5) === 34 && 12 * 5 === 60, 'HCN 12x5')
chk(8 * 6 / 2 === 24 && (10 + 6) * 4 / 2 === 32, 'thoi/thang')
chk(40 * 25 === 1000 && 1000 * 100 === 100000 && 5 * 5 === 25 && 100000 / 25 === 4000, 'gạch')
chk(15 * 8 === 120 && 2 * (15 + 10) === 50 && 50 * 30000 === 1500000, 'vườn bình hành')
if (loi.length) { console.error('✘\n  ' + loi.join('\n  ')); process.exit(3) }
console.log('✔ KaTeX + số liệu đạt')

const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  for (const id of Object.keys(LT)) {
    const r = await c.query(
      `update dai_bdm_dang_bai set ly_thuyet = $2, vi_du = $3, updated_at = now()
       where id = $1 and coalesce(btrim(ly_thuyet), '') = '' and coalesce(btrim(vi_du), '') = ''`, [id, LT[id], VD[id]])
    console.log(`dạng ${id}: ${r.rowCount === 1 ? 'điền được' : 'BỎ QUA (đã có chữ / không tồn tại)'}`)
  }
  for (const id of Object.keys(NHOM_LT)) {
    const r = await c.query(`update dai_bdm_nhom set ly_thuyet = $2, updated_at = now() where id = $1 and coalesce(btrim(ly_thuyet), '') = ''`, [id, NHOM_LT[id]])
    console.log(`nhóm ${id}: ${r.rowCount === 1 ? 'điền được' : 'BỎ QUA (đã có chữ / không tồn tại)'}`)
  }
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
