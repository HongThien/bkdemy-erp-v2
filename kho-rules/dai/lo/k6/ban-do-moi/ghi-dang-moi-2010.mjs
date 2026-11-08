// ghi-dang-moi-2010.mjs — điền LÝ THUYẾT DẠNG + VÍ DỤ cho 2 dạng bài K6 Thùy vừa thêm 19/10 (NDB01215, NDB01216). Mặc định chạy thử (ROLLBACK).
//   node kho-rules/dai/lo/k6/ban-do-moi/ghi-dang-moi-2010.mjs [--ghi]
// Chỉ ghi vào ô RỖNG (điều kiện trong CÙNG câu UPDATE ⇒ không đè nếu Thùy vừa gõ). Trigger bản đồ mới tự ghi dai_bdm_log.
// Nội dung theo định dạng spec-format-noidung (##ĐN/##TC/##PP/##CY/##VD) + khuôn bản đồ K6 (dấu nhân chấm, Ư/B, \vdots).
import pg from 'pg'
import { createRequire } from 'node:module'
process.loadEnvFile('.env')
const R = String.raw

const LT = {
  // ── Tìm ước của một số khi ĐÃ có phân tích ra thừa số nguyên tố ──
  NDB01216: R`##TC
Nếu $a$ đã được viết dưới dạng tích các luỹ thừa của số nguyên tố thì mỗi ước của $a$ là tích của các luỹ thừa của đúng những số nguyên tố đó, mỗi luỹ thừa có số mũ không vượt quá số mũ của nó trong $a$ (số mũ bằng $0$ nghĩa là không có thừa số ấy).
Ví dụ $a=2^3.5^2$ thì mỗi ước của $a$ có dạng $2^m.5^n$ với $m\in\{0;1;2;3\}$, $n\in\{0;1;2\}$ (nhớ $2^0=5^0=1$). Hai cách chọn $(m;n)$ khác nhau cho hai ước khác nhau.

##PP
Giữ nguyên phân tích đã cho của $a$ (không cần phân tích lại), ghi riêng từng số nguyên tố cùng các luỹ thừa của nó từ số mũ $0$ đến số mũ trong $a$.
Lấy các luỹ thừa của số nguyên tố thứ nhất làm hàng ngang, các luỹ thừa của số nguyên tố thứ hai làm cột dọc; mỗi ô là tích của hai luỹ thừa tương ứng, đó là một ước của $a$ (có thể liệt kê dần: nhân tất cả ước đã có với từng luỹ thừa mới).
Nếu có từ ba số nguyên tố trở lên, làm lần lượt: nhân mọi ước tìm được với các luỹ thừa của số nguyên tố kế tiếp.
Viết các ước theo thứ tự tăng dần, kiểm tra có đủ $1$ và $a$; số ô đã điền chính là số ước.

##CY
Đừng quên ước $1$ (chọn số mũ $0$ ở mọi số nguyên tố) và ước $a$ (chọn số mũ lớn nhất ở mọi số nguyên tố).
Số mũ của mỗi thừa số trong ước không được lớn hơn số mũ của nó trong $a$; số nguyên tố không có trong phân tích của $a$ thì không thể là thừa số của một ước nào.`,

  // ── Toán thực tế (lời văn) về ước, bội thoả điều kiện ──
  NDB01215: R`##TC
Trong bài toán lời văn, các cụm "chia đều", "xếp đều", "chia hết", "cắt vừa đủ" nghĩa là số phải tìm là ước của số đã cho: nếu $a$ được chia đều thành các phần có $x$ đơn vị thì $a\vdots x$ hay $x\in\text{Ư}(a)$.
Các cụm "cứ sau mỗi ... lại", "lặp lại", "là bội của", "thứ mấy chia hết cho" nghĩa là số phải tìm là bội: $x\in\text{B}(b)$.
Điều kiện thêm của đề (nhiều hơn, ít hơn, nằm giữa hai số, số nhóm lớn hơn $1$, ...) chỉ dùng để chọn lại trong tập ước hoặc tập bội đã liệt kê, không tìm thêm số mới.

##PP
Gọi ẩn (kèm đơn vị) và ghi điều kiện của ẩn, thường là $x\in\mathbb{N}^*$.
Đổi lời văn thành quan hệ chia hết: $a\vdots x$ (tìm ước) hoặc $x\vdots b$ (tìm bội), rồi viết $x\in\text{Ư}(a)$ hoặc $x\in\text{B}(b)$.
Liệt kê đầy đủ tập ước (chia $a$ lần lượt cho $1; 2; 3; \dots$ và ghi các cặp ước) hoặc tập bội ($b.1; b.2; b.3; \dots$ tới khi vượt giới hạn của đề).
Lọc các giá trị thoả điều kiện thực tế của đề rồi kết luận bằng một câu có đơn vị.

##CY
Ước thì hữu hạn, bội thì vô số nên với bội phải dựa vào giới hạn của đề để dừng.
Chú ý ý nghĩa thực tế: số người, số nhóm, số ngày phải là số tự nhiên khác $0$; "chia thành các nhóm" thường hiểu có ít nhất hai nhóm.
Đọc kĩ điều kiện lớn hơn / nhỏ hơn có lấy dấu bằng hay không.`,
}

const VD = {
  NDB01216: R`##VD
Cho $60=2^2.3.5$. Viết tập hợp các ước của $60$.
**Hướng dẫn giải:**
Các luỹ thừa của $2$ có số mũ không vượt quá $2$ là $1; 2; 4$.

Nhân các số đó với $3$ ta được thêm $3; 6; 12$. Như vậy các ước của $2^2.3=12$ là $1; 2; 3; 4; 6; 12$.

Nhân mỗi ước vừa tìm được với $5$ ta được thêm $5; 10; 15; 20; 30; 60$.

Vậy $\text{Ư}(60)=\{1;2;3;4;5;6;10;12;15;20;30;60\}$.

##VD
Biết $b=2^3.5^2$.
a) Trong các số $20; 50; 15; 16$, số nào là ước của $b$?
b) Tìm các ước của $b$ lớn hơn $20$.
**Hướng dẫn giải:**
a) Ta có $20=2^2.5$ có số mũ của $2$ là $2<3$ và số mũ của $5$ là $1<2$ nên $20$ là ước của $b$.

$50=2.5^2$ có số mũ của $2$ là $1<3$ và số mũ của $5$ là $2$ nên $50$ là ước của $b$.

$15=3.5$ có thừa số $3$ không có trong $b$ nên $15$ không là ước của $b$.

$16=2^4$ có số mũ của $2$ là $4>3$ nên $16$ không là ước của $b$.

Vậy trong các số đã cho, $20$ và $50$ là ước của $b$.

b) Các luỹ thừa của $2$ không vượt quá $2^3$ là $1; 2; 4; 8$.

Nhân với $5$ ta được thêm $5; 10; 20; 40$; nhân với $5^2=25$ ta được thêm $25; 50; 100; 200$.

Do đó $\text{Ư}(b)=\{1;2;4;5;8;10;20;25;40;50;100;200\}$.

Các ước của $b$ lớn hơn $20$ là $25; 40; 50; 100; 200$.`,

  NDB01215: R`##VD
Lớp 6A có $36$ học sinh. Cô giáo muốn chia lớp thành các nhóm có số học sinh bằng nhau, mỗi nhóm có nhiều hơn $3$ và ít hơn $15$ học sinh (không còn bạn nào dư). Hỏi mỗi nhóm có thể có bao nhiêu học sinh?
**Hướng dẫn giải:**
Gọi số học sinh của mỗi nhóm là $x$ (học sinh), $x\in\mathbb{N}^*$.

Vì $36$ học sinh được chia đều vào các nhóm nên $36\vdots x$ hay $x\in\text{Ư}(36)$.

Ta có $36:1=36$; $36:2=18$; $36:3=12$; $36:4=9$; $36:6=6$ nên $\text{Ư}(36)=\{1;2;3;4;6;9;12;18;36\}$.

Vì $3<x<15$ nên $x\in\{4;6;9;12\}$.

Vậy mỗi nhóm có thể có $4$, $6$, $9$ hoặc $12$ học sinh.

##VD
Một cửa hàng khuyến mãi cho những khách hàng có số thứ tự là bội của $15$ trong $100$ khách hàng đầu tiên. Hỏi những khách hàng nào được khuyến mãi?
**Hướng dẫn giải:**
Gọi số thứ tự của khách hàng được khuyến mãi là $x$, $x\in\mathbb{N}^*$ và $x\le 100$.

Vì số thứ tự là bội của $15$ nên $x\in\text{B}(15)$.

Ta có $15.1=15$; $15.2=30$; $15.3=45$; $15.4=60$; $15.5=75$; $15.6=90$; $15.7=105>100$.

Vậy những khách hàng có số thứ tự $15; 30; 45; 60; 75; 90$ được khuyến mãi.`,
}

// ── Kiểm: KaTeX + dấu $ chẵn + kiểm số liệu bằng máy ──
const require = createRequire(new URL('../../../../../package.json', import.meta.url))
const katex = require('katex')
const loi = []
for (const [k, s] of [...Object.entries(LT), ...Object.entries(VD)]) {
  if ((s.match(/\$/g) || []).length % 2) loi.push(`${k}: số dấu $ lẻ`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${k}: KaTeX «${m[1].slice(0, 40)}» ${e.message.slice(0, 60)}`) }
    if (/\\cdot|\\times/.test(m[1])) loi.push(`${k}: cấm \\cdot/\\times`)
  }
}
const uoc = (n) => [...Array(n)].map((_, i) => i + 1).filter((d) => n % d === 0)
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b)
if (!eq(uoc(60), [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60])) loi.push('Ư(60)')
if (!eq(uoc(200), [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 200])) loi.push('Ư(200)')
if (!eq(uoc(200).filter((d) => d > 20), [25, 40, 50, 100, 200])) loi.push('Ư(200)>20')
if (!eq(uoc(36), [1, 2, 3, 4, 6, 9, 12, 18, 36])) loi.push('Ư(36)')
if (!eq(uoc(36).filter((d) => d > 3 && d < 15), [4, 6, 9, 12])) loi.push('Ư(36) lọc')
if (!eq([...Array(100)].map((_, i) => i + 1).filter((x) => x % 15 === 0), [15, 30, 45, 60, 75, 90])) loi.push('B(15)')
if (200 % 20 || 200 % 50 || 200 % 15 === 0 || 200 % 16 === 0) loi.push('kiểm ước 20/50/15/16 của 200')
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
       where id = $1 and coalesce(btrim(ly_thuyet), '') = '' and coalesce(btrim(vi_du), '') = ''`,
      [id, LT[id], VD[id]])
    console.log(`${id}: ${r.rowCount === 1 ? 'điền được' : 'BỎ QUA (đã có chữ / không tồn tại)'}`)
  }
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
