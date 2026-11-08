// Ví dụ MỚI cho NDB00540 + NDB00544 (Thùy 15/10: dạng "xác định BPT / hệ BPT dựa vào miền nghiệm" chưa có ví dụ).
// Soạn theo khuôn nguồn (NBV 10-4/10-5, PNL Bài 01–02): đề cho miền nghiệm bằng HÌNH + 4 đáp án. Hình dựng đúng theo đáp án đúng.
//   node kho-rules/dai/lo/k10-bdm/hinh/vd-moi.mjs <thư-mục-png> [--ghi]
import fs from 'node:fs'
import pg from 'pg'

const [dir, co] = process.argv.slice(2)
const cache = JSON.parse(fs.readFileSync(`${dir}/url-cache.json`, 'utf8'))
const img = (k) => `![](${cache[k]})`
const R = String.raw

const VD540 = [
  '##VD',
  R`Ví dụ 1: Phần tô màu (kể cả bờ $d$) trong hình dưới đây là miền nghiệm của bất phương trình nào? Biết $d$ là đường thẳng $x+2y=4$.`,
  img('hd540a'),
  R`A. $x+2y\ge 4$. B. $x+2y\le 4$. C. $x+2y>4$. D. $x+2y<4$.`,
  '**Hướng dẫn giải:**',
  R`Đường thẳng $d$ vẽ nét liền nên miền nghiệm kể cả bờ, bất phương trình có dấu $\le$ hoặc $\ge$.`,
  R`Gốc toạ độ $O(0;0)$ nằm trong phần tô màu và $0+2\cdot 0=0<4$.`,
  R`Vậy bất phương trình cần tìm là $x+2y\le 4$. Chọn B.`,
  '',
  '##VD',
  R`Ví dụ 2: Phần tô màu (không kể bờ $d$) trong hình dưới đây là miền nghiệm của bất phương trình nào? Biết $d$ là đường thẳng $3x-y=3$.`,
  img('hd540b'),
  R`A. $3x-y<3$. B. $3x-y\le 3$. C. $3x-y>3$. D. $3x-y\ge 3$.`,
  '**Hướng dẫn giải:**',
  R`Đường thẳng $d$ vẽ nét đứt nên miền nghiệm không kể bờ, bất phương trình có dấu $<$ hoặc $>$.`,
  R`Gốc toạ độ $O(0;0)$ không thuộc phần tô màu mà $3\cdot 0-0=0<3$, nên các điểm của miền nghiệm phải thoả $3x-y>3$ (kiểm tra: điểm $(3;0)$ thuộc phần tô màu có $3\cdot 3-0=9>3$).`,
  R`Vậy bất phương trình cần tìm là $3x-y>3$. Chọn C.`,
].join('\n')

const cs = (a, b, c) => R`\begin{cases} ${a} \\ ${b} \\ ${c} \end{cases}`
const VD544 = [
  '##VD',
  R`Ví dụ 1: Phần tô màu (kể cả biên) trong hình dưới đây là miền nghiệm của hệ bất phương trình nào? Biết các đường biên là trục $Ox$, trục $Oy$ và đường thẳng $d: x+y=3$.`,
  img('hd544a'),
  `A. $${cs(R`x\ge 0`, R`y\ge 0`, R`x+y\le 3`)}$. B. $${cs(R`x\ge 0`, R`y\ge 0`, R`x+y\ge 3`)}$. C. $${cs(R`x\le 0`, R`y\ge 0`, R`x+y\le 3`)}$. D. $${cs(R`x\ge 0`, R`y\le 0`, R`x+y\le 3`)}$.`,
  '**Hướng dẫn giải:**',
  R`Các đường biên vẽ nét liền nên miền nghiệm kể cả biên, các bất phương trình có dấu $\le$ hoặc $\ge$.`,
  R`Phần tô màu nằm bên phải trục $Oy$ nên $x\ge 0$; nằm phía trên trục $Ox$ nên $y\ge 0$.`,
  R`Điểm $(1;1)$ thuộc phần tô màu và $1+1=2<3$ nên $x+y\le 3$.`,
  `Vậy hệ cần tìm là $${cs(R`x\ge 0`, R`y\ge 0`, R`x+y\le 3`)}$. Chọn A.`,
  '',
  '##VD',
  R`Ví dụ 2: Phần tô màu (không kể biên) trong hình dưới đây là miền nghiệm của hệ bất phương trình nào? Biết các đường biên là trục $Ox$, đường thẳng $d_{1}: x-y=0$ và đường thẳng $d_{2}: x+y=4$.`,
  img('hd544b'),
  `A. $${cs('y>0', 'x-y<0', 'x+y<4')}$. B. $${cs('y<0', 'x-y>0', 'x+y<4')}$. C. $${cs('y>0', 'x-y>0', 'x+y>4')}$. D. $${cs('y>0', 'x-y>0', 'x+y<4')}$.`,
  '**Hướng dẫn giải:**',
  R`Các đường biên vẽ nét đứt nên miền nghiệm không kể biên, các bất phương trình có dấu $<$ hoặc $>$.`,
  R`Lấy điểm $M(2;1)$ nằm trong phần tô màu: $y=1>0$; $x-y=2-1=1>0$; $x+y=2+1=3<4$.`,
  `Vậy hệ cần tìm là $${cs('y>0', 'x-y>0', 'x+y<4')}$. Chọn D.`,
].join('\n')

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL }); await c.connect()
await c.query('begin')
let n = 0
for (const [id, vd] of [['NDB00540', VD540], ['NDB00544', VD544]]) {
  // chỉ ghi đè bản do chính script này ghi lần đầu (có thẻ ảnh hd540*/hd544* và còn ký tự hỏng) hoặc đang rỗng
  n += (await c.query(`update dai_bdm_dang_bai set vi_du=$2, updated_at=now() where id=$1 and (coalesce(vi_du,'')='' or vi_du like '%k10-hd54%')`, [id, vd])).rowCount
}
console.log({ cap_nhat: n })
await c.query(co === '--ghi' ? 'commit' : 'rollback'); await c.end()
console.log(co === '--ghi' ? 'ĐÃ GHI' : 'chạy khô')
