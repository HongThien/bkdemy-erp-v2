// Lý thuyết + ví dụ cho 2 dạng MỚI còn rỗng của K10 Hệ thức lượng: NDB01034 (R ngoại tiếp), NDB01035 (dùng diện tích tìm yếu tố khác).
// Ví dụ lấy từ câu CEO đã gán tay (nguon 'nguoi') — đề + lời giải sách, đáp số đã tính lại. Chỉ ghi vào ô ĐANG RỖNG.
//   node kho-rules/dai/lo/k10-bdm/htl/lt-vd-01034-01035.mjs [--ghi]
import fs from 'node:fs'
import pg from 'pg'

const R = String.raw
const L = (...a) => a.join('\n')

const LT_1034 = L(
  '##TC',
  R`Định lí sin mở rộng: trong tam giác $ABC$ có bán kính đường tròn ngoại tiếp $R$ thì $\dfrac{a}{\sin A}=\dfrac{b}{\sin B}=\dfrac{c}{\sin C}=2R$.`,
  R`Suy ra $R=\dfrac{a}{2\sin A}=\dfrac{b}{2\sin B}=\dfrac{c}{2\sin C}$.`,
  '',
  '##PP',
  R`Xác định một cạnh và góc đối diện với cạnh đó (nếu chưa có thì tìm bằng định lí côsin, định lí Pythagore hoặc tổng ba góc bằng $180^\circ$).`,
  R`Áp dụng định lí sin $\dfrac{a}{\sin A}=2R$ để tìm $R$.`,
  R`Kết luận; nếu đề hỏi chu vi hay diện tích đường tròn ngoại tiếp thì tính tiếp từ $R$.`,
  '',
  '##CY',
  R`Tam giác $ABC$ vuông tại $A$ thì tâm đường tròn ngoại tiếp là trung điểm cạnh huyền, $R=\dfrac{BC}{2}$.`,
)

const VD_1034 = L(
  '##VD',
  R`Cho tam giác $ABC$ có $\widehat{BAC}=60^\circ$ và $BC=\sqrt{3}$. Tính bán kính $R$ của đường tròn ngoại tiếp tam giác $ABC$.`,
  R`A. $R=1$. B. $R=2$. C. $R=4$. D. $R=3$.`,
  '**Hướng dẫn giải:**',
  R`Áp dụng định lí sin: $\dfrac{BC}{\sin A}=2R$.`,
  R`Suy ra $R=\dfrac{BC}{2\sin A}=\dfrac{\sqrt{3}}{2\sin 60^\circ}=\dfrac{\sqrt{3}}{2\cdot\dfrac{\sqrt{3}}{2}}=1$. Chọn A.`,
  '',
  '##VD',
  R`Cho tam giác $ABC$ có $\hat{B}+\hat{C}=135^\circ$, $BC=10\sqrt{2}$. Chu vi đường tròn ngoại tiếp tam giác $ABC$ là`,
  R`A. $15\pi$. B. $20\pi$. C. $10\pi$. D. $40\pi$.`,
  '**Hướng dẫn giải:**',
  R`Tổng ba góc bằng $180^\circ$ nên $\hat{A}=180^\circ-135^\circ=45^\circ$.`,
  R`Định lí sin: $2R=\dfrac{BC}{\sin A}=\dfrac{10\sqrt{2}}{\sin 45^\circ}=\dfrac{10\sqrt{2}}{\dfrac{\sqrt{2}}{2}}=20$, suy ra $R=10$.`,
  R`Chu vi đường tròn ngoại tiếp là $2\pi R=2\pi\cdot 10=20\pi$. Chọn B.`,
  '',
  '##VD',
  R`Cho tam giác $ABC$ có $c=9$, $b=18$ và $A=60^\circ$. Bán kính của đường tròn ngoại tiếp tam giác $ABC$ bằng`,
  R`A. $3\sqrt{3}$. B. $9\sqrt{3}$. C. $6$. D. $9$.`,
  '**Hướng dẫn giải:**',
  R`Định lí côsin: $a^{2}=b^{2}+c^{2}-2bc\cos A=18^{2}+9^{2}-2\cdot 18\cdot 9\cdot\cos 60^\circ=324+81-162=243$, suy ra $a=9\sqrt{3}$.`,
  R`Định lí sin: $R=\dfrac{a}{2\sin A}=\dfrac{9\sqrt{3}}{2\cdot\dfrac{\sqrt{3}}{2}}=9$. Chọn D.`,
)

const LT_1035 = L(
  '##TC',
  R`Các công thức diện tích tam giác ($p$ là nửa chu vi): $S=\dfrac{1}{2}bc\sin A=\dfrac{1}{2}ca\sin B=\dfrac{1}{2}ab\sin C$; $S=\dfrac{1}{2}a\,h_{a}$; $S=pr$; $S=\dfrac{abc}{4R}$; công thức Hê-rông $S=\sqrt{p(p-a)(p-b)(p-c)}$.`,
  '',
  '##PP',
  R`Xác định diện tích $S$: đề cho sẵn, hoặc tính từ hai cạnh và góc xen giữa, hoặc từ ba cạnh (Hê-rông).`,
  R`Chọn công thức liên hệ $S$ với đại lượng cần tìm: $h_{a}=\dfrac{2S}{a}$, $r=\dfrac{S}{p}$, $\sin A=\dfrac{2S}{bc}$, $R=\dfrac{abc}{4S}$, …`,
  R`Biến đổi, thay số tìm đại lượng đó rồi kết luận.`,
  '',
  '##CY',
  R`Nếu còn thiếu một cạnh (để tính $p$ hoặc $a$) thì tìm trước bằng định lí côsin; thiếu $\sin A$ khi chỉ biết $\cos A$ thì dùng $\sin^{2}A+\cos^{2}A=1$.`,
)

const VD_1035 = L(
  '##VD',
  R`Cho tam giác $ABC$ có diện tích bằng $12$ và chu vi bằng $12$. Bán kính $r$ của đường tròn nội tiếp tam giác $ABC$ là`,
  R`A. $r=1$. B. $r=\dfrac{1}{2}$. C. $r=2$. D. $r=3$.`,
  '**Hướng dẫn giải:**',
  R`Nửa chu vi $p=\dfrac{12}{2}=6$.`,
  R`Từ $S=p\cdot r$ ta có $r=\dfrac{S}{p}=\dfrac{12}{6}=2$. Chọn C.`,
  '',
  '##VD',
  R`Cho tam giác $ABC$ có $AB=6$, $AC=10$, $\widehat{A}=120^\circ$. Độ dài đường cao kẻ từ $A$ của tam giác $ABC$ bằng`,
  R`A. $\dfrac{30\sqrt{3}}{7}$. B. $\dfrac{15\sqrt{3}}{14}$. C. $\dfrac{15\sqrt{3}}{7}$. D. $\dfrac{15}{7}$.`,
  '**Hướng dẫn giải:**',
  R`Định lí côsin: $BC^{2}=6^{2}+10^{2}-2\cdot 6\cdot 10\cos 120^\circ=196$, suy ra $BC=14$.`,
  R`Diện tích $S=\dfrac{1}{2}\cdot 6\cdot 10\cdot\sin 120^\circ=15\sqrt{3}$.`,
  R`Đường cao $h_{a}=\dfrac{2S}{BC}=\dfrac{2\cdot 15\sqrt{3}}{14}=\dfrac{15\sqrt{3}}{7}$. Chọn C.`,
  '',
  '##VD',
  R`Cho tam giác $ABC$ có $b=7$, $c=5$ và $\cos A=\dfrac{3}{5}$. Biết bán kính đường tròn nội tiếp tam giác $ABC$ có dạng $r=a-\sqrt{b}$ với $a,b\in\mathbb{N}$. Tính $a-2b$.`,
  '**Hướng dẫn giải:**',
  R`Định lí côsin: $a^{2}=7^{2}+5^{2}-2\cdot 7\cdot 5\cdot\dfrac{3}{5}=32$, suy ra $a=4\sqrt{2}$.`,
  R`Vì $\sin A>0$ nên $\sin A=\sqrt{1-\dfrac{9}{25}}=\dfrac{4}{5}$. Diện tích $S=\dfrac{1}{2}bc\sin A=\dfrac{1}{2}\cdot 7\cdot 5\cdot\dfrac{4}{5}=14$.`,
  R`Nửa chu vi $p=\dfrac{4\sqrt{2}+7+5}{2}=6+2\sqrt{2}$.`,
  R`Bán kính nội tiếp $r=\dfrac{S}{p}=\dfrac{14}{6+2\sqrt{2}}=\dfrac{7}{3+\sqrt{2}}=\dfrac{7(3-\sqrt{2})}{7}=3-\sqrt{2}$.`,
  R`Đối chiếu $r=a-\sqrt{b}$ ta được $a=3$, $b=2$. Vậy $a-2b=3-2\cdot 2=-1$.`,
)

const GHI = process.argv.includes('--ghi')
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL }); await c.connect()
await c.query('begin')
let n = 0
for (const [id, lt, vd] of [['NDB01034', LT_1034, VD_1034], ['NDB01035', LT_1035, VD_1035]]) {
  n += (await c.query(`update dai_bdm_dang_bai set ly_thuyet=$2, updated_at=now() where id=$1 and coalesce(ly_thuyet,'')=''`, [id, lt])).rowCount
  n += (await c.query(`update dai_bdm_dang_bai set vi_du=$2, updated_at=now() where id=$1 and coalesce(vi_du,'')=''`, [id, vd])).rowCount
}
console.log({ truong_ghi: n, ky_vong: 4 })
await c.query(GHI ? 'commit' : 'rollback'); await c.end()
console.log(GHI ? 'ĐÃ GHI' : 'chạy khô')
