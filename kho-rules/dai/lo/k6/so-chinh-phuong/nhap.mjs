// nhap.mjs — Thùy 10/11: 6 bài (7 câu) "chứng minh không là số chính phương" từ tài liệu Nhóm các dự án giáo dục (Chuyên đề Số chính phương)
//   → kho VỀ NHÀ (dai_cau_hoi, da_duyet=false) ở nhóm NNB02098 "Số chính phương" (K6 › Số nguyên › Các bài toán nâng cao).
//   node kho-rules/dai/lo/k6/so-chinh-phuong/nhap.mjs          → soạn + kiểm máy + ghi JSON + HTML duyệt + chạy khô (nhap_kho --thu)
//   node kho-rules/dai/lo/k6/so-chinh-phuong/nhap.mjs --ghi    → ghi thật
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const D = 'kho-rules/dai/lo/k6/so-chinh-phuong/'
const GHI = process.argv.includes('--ghi')
const NGUON = 'Tài liệu Nhóm các dự án giáo dục — Chuyên đề Số chính phương'

// ───────── kiểm bằng máy (nhân chứng độc lập, từ ĐỀ)
const isqrt = (n) => { if (n < 2n) return n; let x = 1n << BigInt((n.toString(2).length >> 1) + 1); for (;;) { const y = (x + n / x) >> 1n; if (y >= x) return x; x = y } }
const laSCP = (n) => { const r = isqrt(n); return r * r === n }
const mu = (a, k) => BigInt(a) ** BigInt(k)
const tong = (a, t, d) => { let s = 0n; for (let k = t; k <= d; k++) s += mu(a, k); return s }
const kiem = []
const ck = (ten, ok) => { kiem.push([ten, ok]); if (!ok) { console.error('✘ KIỂM SAI:', ten); process.exit(3) } }
// B13: 2018 = 3.672 + 2; bình phương chia 3 dư 0 hoặc 1
ck('B13 2018=3.672+2', 3 * 672 + 2 === 2018)
ck('B13 bình phương mod 3 ∈ {0,1}', [...Array(3000).keys()].every((m) => [0, 1].includes((m * m) % 3)))
// B14
const A14 = tong(2, 0, 33)
ck('B14 A=2^34-1', A14 === mu(2, 34) - 1n); ck('B14 A tận cùng 3', A14 % 10n === 3n); ck('B14 A không là SCP', !laSCP(A14))
ck('B14 nhóm 4 số hạng k=2,6,..,30 đều ⋮10 và đủ 8 nhóm', [2, 6, 10, 14, 18, 22, 26, 30].length === 8 && [2, 6, 10, 14, 18, 22, 26, 30].every((k) => (15n * mu(2, k)) % 10n === 0n) && A14 === 3n + [2, 6, 10, 14, 18, 22, 26, 30].reduce((s, k) => s + 15n * mu(2, k), 0n))
ck('B14 chữ số tận cùng SCP ∈ {0,1,4,5,6,9}', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => (c * c) % 10).sort().filter((x, i, a) => a.indexOf(x) === i).join() === '0,1,4,5,6,9')
// B4a, B4b
const A4 = tong(2, 2, 20); ck('B4a A+4=2^21', A4 + 4n === mu(2, 21)); ck('B4a không SCP', !laSCP(A4 + 4n))
const B4 = tong(3, 1, 100); ck('B4b 2B+3=3^101', 2n * B4 + 3n === mu(3, 101)); ck('B4b không SCP', !laSCP(2n * B4 + 3n))
// B1
for (const n of [1, 2, 3, 4, 5]) { const a = mu(2012, 4 * n) + mu(2013, 4 * n) + mu(2014, 4 * n) + mu(2015, 4 * n); ck(`B1 n=${n}: A mod 4 = 2`, a % 4n === 2n); ck(`B1 n=${n}: không SCP`, !laSCP(a)) }
ck('B1 2013 mod 4=1, 2015.2015 mod 4=1', 2013 % 4 === 1 && (2015 * 2015) % 4 === 1 && 2012 % 4 === 0 && 2014 % 2 === 0)
// B3
ck('B3 4 số liên tiếp: S=4a+6, không SCP (a<3000)', [...Array(3000).keys()].every((a) => { const s = 4 * a + 6; return s === a + (a + 1) + (a + 2) + (a + 3) && s % 4 === 2 && !laSCP(BigInt(s)) }))
// B6
const M6 = tong(5, 1, 80); ck('B6a M⋮6', M6 % 6n === 0n); ck('B6b M⋮5', M6 % 5n === 0n); ck('B6b M không ⋮25', M6 % 25n !== 0n); ck('B6b M không SCP', !laSCP(M6))
ck('B6a M=6.(5+5^3+…+5^79)', M6 === 6n * [...Array(40).keys()].reduce((s, i) => s + mu(5, 2 * i + 1), 0n))
console.log(`✔ ${kiem.length} phép kiểm máy đều đúng`)

// ───────── soạn
const BO = String.raw`Giả sử $%X%$ là số chính phương, tức là $%X%=n.n$ với $n\in\mathbb{N}$. Phân tích $n$ ra thừa số nguyên tố; mỗi luỹ thừa $p^e$ có trong $n$ thì trong $n.n$ thành $p^e.p^e=p^{e+e}$, số mũ là số chẵn. Vậy khi phân tích $%X%$ ra thừa số nguyên tố, mọi thừa số đều có số mũ chẵn.`
const bo = (x) => BO.replaceAll('%X%', x)

const C = []
// ── B13
C.push({
  id: 'B13', dang_bai: 'NDB02801', chac: 'cao', ly_do: 'Chứng minh một số (cho bằng tổng chữ số) không là số chính phương: so số dư khi chia cho 3.',
  ten_de_goc: `${NGUON} — Bài 13`,
  noi_dung: String.raw`Một số tự nhiên có tổng các chữ số bằng $2018$ thì có thể là số chính phương được không? Vì sao?`,
  ghi_chu: 'ĐỀ IN LỖI HIỂN NHIÊN: tài liệu in "2008" nhưng lời giải trong tài liệu dùng $2018=672.3+2$ ⇒ sửa đề thành 2018. (Với 2008 thì tổng chữ số chia 3 dư 1, không kết luận được bằng cách này.)',
  loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** số chính phương khi chia cho 3 chỉ dư $0$ hoặc $1$; còn số tự nhiên chia cho 3 dư bằng số dư của tổng các chữ số của nó chia cho 3. So hai điều này với nhau.

**Bước 1.** Dùng dấu hiệu chia hết cho 3: một số và tổng các chữ số của nó có cùng số dư khi chia cho 3. Tìm số dư của tổng các chữ số cho 3, từ đó biết số đã cho chia 3 dư mấy.

**Bước 2.** Viết số tự nhiên bất kì $m$ theo số dư khi chia cho 3 ($m=3q$, $m=3q+1$, $m=3q+2$), rồi tính $m.m$ để biết số chính phương chia 3 dư bao nhiêu.

**Bước 3.** So hai số dư: nếu số dư của số đã cho không nằm trong các số dư có thể có của số chính phương thì kết luận.

**Chú ý:** chỉ cần số dư không khớp là đủ để khẳng định số đó không là số chính phương.

**Phần 2. Trình bày**

Gọi $n$ là số tự nhiên có tổng các chữ số bằng $2018$.

Ta có $2018=3.672+2$ nên tổng các chữ số của $n$ chia cho 3 dư 2.

Do đó $n$ chia cho 3 dư 2.

Giả sử $n$ là số chính phương, tức là $n=m.m$ với $m\in\mathbb{N}$. Xét số dư của $m$ khi chia cho 3:

Nếu $m=3q$ thì $m.m=9q^2=3.3q^2$ chia hết cho 3.

Nếu $m=3q+1$ thì $m.m=9q^2+6q+1=3.(3q^2+2q)+1$ chia cho 3 dư 1.

Nếu $m=3q+2$ thì $m.m=9q^2+12q+4=3.(3q^2+4q+1)+1$ chia cho 3 dư 1.

Vậy số chính phương chia cho 3 chỉ dư $0$ hoặc $1$, trái với $n$ chia cho 3 dư 2.

Vậy một số tự nhiên có tổng các chữ số bằng $2018$ không là số chính phương.`,
})
// ── B14
C.push({
  id: 'B14', dang_bai: 'NDB02800', chac: 'cao', ly_do: 'Dãy luỹ thừa cùng cơ số; xét chữ số tận cùng để chứng minh không là số chính phương.',
  ten_de_goc: `${NGUON} — Bài 14`,
  noi_dung: String.raw`Cho $A=1+2+2^2+2^3+\dots+2^{33}$. Hỏi $A$ có là số chính phương không? Vì sao?`,
  ghi_chu: '',
  loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** số chính phương chỉ có thể tận cùng bằng $0;1;4;5;6;9$. Tìm chữ số tận cùng của $A$ bằng cách ghép các số hạng thành những nhóm chia hết cho 10.

**Bước 1.** Đếm số số hạng từ $2^2$ đến $2^{33}$ để biết ghép 4 số hạng liền nhau được mấy nhóm vừa đủ; hai số hạng đầu $1$ và $2$ để riêng.

**Bước 2.** Trong mỗi nhóm 4 số hạng, đặt luỹ thừa của 2 nhỏ nhất làm thừa số chung; phần trong ngoặc là $1+2+2^2+2^3$.

**Bước 3.** Từ kết quả trong ngoặc, chứng tỏ mỗi nhóm chia hết cho 2 và cho 5 nên chia hết cho 10, rồi suy ra chữ số tận cùng của $A$.

**Bước 4.** Lập bảng chữ số tận cùng của bình phương một số tự nhiên rồi đối chiếu với chữ số tận cùng của $A$.

**Chú ý:** các số hạng không thuộc nhóm nào (ở đây là $1$ và $2$) phải cộng riêng.

**Phần 2. Trình bày**

Các số hạng từ $2^2$ đến $2^{33}$ có $33-2+1=32$ số hạng, ghép 4 số hạng liền nhau thành 8 nhóm:

$A=(1+2)+(2^2+2^3+2^4+2^5)+(2^6+2^7+2^8+2^9)+\dots+(2^{30}+2^{31}+2^{32}+2^{33})$

$=3+2^2.(1+2+2^2+2^3)+2^6.(1+2+2^2+2^3)+\dots+2^{30}.(1+2+2^2+2^3)$

Vì $1+2+2^2+2^3=15$ nên

$A=3+15.2^2+15.2^6+\dots+15.2^{30}$

Mỗi số $15.2^2; 15.2^6; \dots; 15.2^{30}$ chia hết cho 2 và chia hết cho 5 nên chia hết cho 10, tức là có chữ số tận cùng là $0$.

Suy ra $15.2^2+15.2^6+\dots+15.2^{30}$ có chữ số tận cùng là $0$, do đó $A$ có chữ số tận cùng là $3$.

Mặt khác, số tự nhiên $m=10q+c$ (với $c$ là chữ số tận cùng của $m$) có $m.m=100q^2+20qc+c.c$, nên $m.m$ có cùng chữ số tận cùng với $c.c$.

Với $c=0;1;2;\dots;9$ thì $c.c=0;1;4;9;16;25;36;49;64;81$, nên số chính phương chỉ có thể tận cùng bằng $0;1;4;5;6;9$.

Vì $A$ có chữ số tận cùng là $3$ nên $A$ không là số chính phương.`,
})
// ── B4a
C.push({
  id: 'B4a', dang_bai: 'NDB02801', chac: 'vua', ly_do: 'Biến đổi A+4 về một luỹ thừa rồi xét số mũ; vừa là dãy luỹ thừa vừa là biểu thức — theo luật "dạng sau thắng" lấy NDB02801.',
  ten_de_goc: `${NGUON} — Bài 4a`,
  noi_dung: String.raw`Cho $A=2^2+2^3+2^4+\dots+2^{20}$. Chứng minh rằng $A+4$ không là số chính phương.`,
  ghi_chu: '',
  loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** tính gọn $A+4$ bằng cách nhân $A$ với 2 rồi lấy hiệu hai tổng, được một luỹ thừa của 2; sau đó dùng tính chất: số chính phương có mọi thừa số nguyên tố với số mũ chẵn.

**Bước 1.** Nhân hai vế của $A$ với $2$ để được một tổng gần giống $A$ (chỉ lệch hai đầu).

**Bước 2.** Lấy hiệu hai tổng, triệt tiêu các số hạng chung để tìm $A$, rồi cộng thêm $4$ để được $A+4$.

**Bước 3.** Xem số mũ của thừa số nguyên tố $2$ trong $A+4$ là số chẵn hay số lẻ.

**Bước 4.** Lập luận số chính phương thì mọi số mũ trong phân tích ra thừa số nguyên tố đều chẵn rồi kết luận.

**Chú ý:** nhớ cộng $4$ vào kết quả của $A$ trước khi nhận xét về số mũ.

**Phần 2. Trình bày**

Ta có $A=2^2+2^3+2^4+\dots+2^{20}$ (1)

Suy ra $2A=2^3+2^4+2^5+\dots+2^{21}$ (2)

Lấy (2) trừ (1) ta được $2A-A=2^{21}-2^2$

Suy ra $A=2^{21}-4$

Suy ra $A+4=2^{21}$

@@BO@@

Mà $2^{21}$ có số mũ của thừa số nguyên tố $2$ là $21$, là số lẻ. Mâu thuẫn.

Vậy $A+4$ không là số chính phương.`.replace('@@BO@@', bo('2^{21}')),
})
// ── B4b
C.push({
  id: 'B4b', dang_bai: 'NDB02801', chac: 'vua', ly_do: 'Biến đổi 2B+3 về một luỹ thừa rồi xét số mũ; vừa là dãy luỹ thừa vừa là biểu thức — theo luật "dạng sau thắng" lấy NDB02801.',
  ten_de_goc: `${NGUON} — Bài 4b`,
  noi_dung: String.raw`Cho $B=3+3^2+3^3+\dots+3^{100}$. Chứng minh rằng $2B+3$ không là số chính phương.`,
  ghi_chu: '',
  loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** nhân $B$ với 3 rồi lấy hiệu hai tổng để tính $2B$, từ đó $2B+3$ thành một luỹ thừa của 3; sau đó dùng tính chất: số chính phương có mọi thừa số nguyên tố với số mũ chẵn.

**Bước 1.** Nhân hai vế của $B$ với $3$ để được một tổng gần giống $B$.

**Bước 2.** Lấy hiệu hai tổng để tìm $2B$ (chú ý hiệu của hai tổng là $3B-B=2B$), rồi cộng thêm $3$.

**Bước 3.** Xem số mũ của thừa số nguyên tố $3$ trong $2B+3$ là số chẵn hay số lẻ.

**Bước 4.** Lập luận số chính phương thì mọi số mũ trong phân tích ra thừa số nguyên tố đều chẵn rồi kết luận.

**Chú ý:** hiệu hai tổng là $3B-B=2B$ chứ không phải $B$, nên cuối cùng phải cộng $3$ vào $2B$.

**Phần 2. Trình bày**

Ta có $B=3+3^2+3^3+\dots+3^{100}$ (3)

Suy ra $3B=3^2+3^3+3^4+\dots+3^{101}$ (4)

Lấy (4) trừ (3) ta được $3B-B=3^{101}-3$

Suy ra $2B=3^{101}-3$

Suy ra $2B+3=3^{101}$

@@BO@@

Mà $3^{101}$ có số mũ của thừa số nguyên tố $3$ là $101$, là số lẻ. Mâu thuẫn.

Vậy $2B+3$ không là số chính phương.`.replace('@@BO@@', bo('3^{101}')),
})
// ── B1
C.push({
  id: 'B1', dang_bai: 'NDB02801', chac: 'cao', ly_do: 'Tổng bốn luỹ thừa cùng số mũ: xét số dư khi chia cho 4 rồi lập luận số mũ của 2.',
  ten_de_goc: `${NGUON} — Bài 1 (đề thi vào lớp 10 chuyên ĐHSP TP Hồ Chí Minh 2015–2016)`,
  noi_dung: String.raw`Chứng minh rằng $A=2012^{4n}+2013^{4n}+2014^{4n}+2015^{4n}$ không phải là số chính phương với mọi số nguyên dương $n$.`,
  ghi_chu: 'Đề thi vào lớp 10 chuyên ĐHSP TP.HCM 2015–2016. Lời giải viết lại: chứng minh rõ vì sao $2013^{4n}$ và $2015^{4n}$ chia 4 dư 1 (tài liệu gốc chỉ nêu kết quả).',
  loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** tính số dư của $A$ khi chia cho 4: được dư $2$, tức là $A$ chia hết cho 2 nhưng không chia hết cho 4; số như vậy có thừa số nguyên tố 2 với số mũ lẻ nên không là số chính phương.

**Bước 1.** Xét $2012^{4n}$ và $2014^{4n}$: tìm xem chúng có chia hết cho 4 không (chú ý $n\ge 1$ nên có ít nhất 4 thừa số).

**Bước 2.** Xét $2013^{4n}$: $2013$ chia 4 dư 1; chứng tỏ tích của các số chia 4 dư 1 vẫn chia 4 dư 1.

**Bước 3.** Xét $2015^{4n}$: $2015$ chia 4 dư 3; nhóm các thừa số thành từng cặp $2015.2015$ rồi tính số dư của một cặp.

**Bước 4.** Cộng bốn số dư để được số dư của $A$ khi chia cho 4.

**Bước 5.** Lập luận số chính phương có mọi số mũ trong phân tích ra thừa số nguyên tố đều chẵn; $A$ chia hết cho 2 mà không chia hết cho $2^2$ nên số mũ của 2 trong $A$ bằng 1.

**Chú ý:** hai số chia 4 dư 1 nhân với nhau vẫn chia 4 dư 1, vì $(4q+1)(4r+1)=4.(4qr+q+r)+1$.

**Phần 2. Trình bày**

Vì $2012=4.503$ chia hết cho 4 nên $2012^{4n}$ (tích của $4n$ thừa số $2012$) chia hết cho 4.

Vì $2014$ chia hết cho 2 nên $2014^{4n}$ (tích của $4n\ge 4$ thừa số, mỗi thừa số chia hết cho 2) chia hết cho $2.2=4$.

Vì $2013=4.503+1$ chia cho 4 dư 1, mà $(4q+1)(4r+1)=4.(4qr+q+r)+1$ chia cho 4 dư 1 nên tích của $4n$ thừa số $2013$ chia cho 4 dư 1. Do đó $2013^{4n}$ chia cho 4 dư 1.

Vì $2015=4.503+3$ nên $2015.2015=(4.503+3)(4.503+3)=4.(4.503^2+6.503+2)+1$ chia cho 4 dư 1. Mà $2015^{4n}$ là tích của $2n$ thừa số, mỗi thừa số bằng $2015.2015$, nên $2015^{4n}$ chia cho 4 dư 1.

Do đó $A=2012^{4n}+2013^{4n}+2014^{4n}+2015^{4n}$ có số dư khi chia cho 4 là $0+1+0+1=2$, tức là $A=4k+2$ với $k\in\mathbb{N}$.

Suy ra $A$ chia hết cho 2 nhưng $A$ không chia hết cho 4, nên số mũ của thừa số nguyên tố $2$ trong phân tích $A$ ra thừa số nguyên tố bằng $1$.

@@BO@@

Mà số mũ của $2$ trong $A$ là $1$, là số lẻ. Mâu thuẫn.

Vậy $A$ không phải là số chính phương.`.replace('@@BO@@', bo('A')),
})
// ── B3
C.push({
  id: 'B3', dang_bai: 'NDB02801', chac: 'cao', ly_do: 'Tổng bốn số tự nhiên liên tiếp: chia 4 dư 2 nên số mũ của 2 là 1.',
  ten_de_goc: `${NGUON} — Bài 3 (trích đề thi HSG lớp 6 THCS Nguyễn Huy Tưởng 2004–2005)`,
  noi_dung: String.raw`Chứng minh rằng tổng bốn số tự nhiên liên tiếp không là số chính phương.`,
  ghi_chu: 'Trích đề thi HSG lớp 6 THCS Nguyễn Huy Tưởng 2004–2005.',
  loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** viết tổng bốn số liên tiếp theo số thứ nhất rồi xét số dư khi chia cho 4; tổng chia hết cho 2 mà không chia hết cho 4 thì không là số chính phương.

**Bước 1.** Đặt bốn số tự nhiên liên tiếp là $a;\ a+1;\ a+2;\ a+3$ rồi cộng lại và rút gọn.

**Bước 2.** Tách tổng thành một số chia hết cho 4 cộng với một số dư, để xem tổng chia 4 dư mấy.

**Bước 3.** Suy ra tổng chia hết cho 2 nhưng không chia hết cho 4.

**Bước 4.** Lập luận số chính phương có mọi số mũ trong phân tích ra thừa số nguyên tố đều chẵn để kết luận.

**Chú ý:** tổng không chia hết cho 4 thì số mũ của 2 trong tổng chỉ có thể là 0 hoặc 1; ở đây tổng chia hết cho 2 nên số mũ là 1.

**Phần 2. Trình bày**

Gọi bốn số tự nhiên liên tiếp là $a;\ a+1;\ a+2;\ a+3$ với $a\in\mathbb{N}$.

Gọi tổng của chúng là $S$. Ta có

$S=a+(a+1)+(a+2)+(a+3)=4a+6=4.(a+1)+2$

Vì $4.(a+1)$ chia hết cho 4 nên $S$ chia cho 4 dư 2.

Suy ra $S$ chia hết cho 2 nhưng $S$ không chia hết cho 4, nên số mũ của thừa số nguyên tố $2$ trong phân tích $S$ ra thừa số nguyên tố bằng $1$.

@@BO@@

Mà số mũ của $2$ trong $S$ là $1$, là số lẻ. Mâu thuẫn.

Vậy tổng bốn số tự nhiên liên tiếp không là số chính phương.`.replace('@@BO@@', bo('S')),
})
// ── B6
C.push({
  id: 'B6', dang_bai: 'NDB02800', chac: 'vua', ly_do: 'Ý b: dãy luỹ thừa M không là số chính phương (chia hết 5 mà không chia hết 25). Ý a thuộc dạng chia hết dãy luỹ thừa (NDB00384) — dạng sau (SCP) thắng.',
  ten_de_goc: `${NGUON} — Bài 6 (trích đề thi HSG lớp 6 Đa Phúc 2010–2011)`,
  noi_dung: String.raw`Cho $M=5+5^2+5^3+\dots+5^{80}$.
a) Chứng minh $M$ chia hết cho 6.
b) Chứng minh $M$ không là số chính phương.`,
  ghi_chu: 'Trích đề thi HSG lớp 6 Đa Phúc 2010–2011. Bài 6 hai ý chung dữ kiện $M$, giữ chung một câu (ý a thuộc dạng chia hết dãy luỹ thừa NDB00384, ý b thuộc NDB02800).',
  loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** ý a ghép hai số hạng liền nhau để đặt thừa số chung $5.(1+5)=5.6$; ý b chứng minh $M$ chia hết cho 5 mà không chia hết cho 25, rồi dùng tính chất: số chính phương có mọi thừa số nguyên tố với số mũ chẵn.

**Bước 1.** Ý a: đếm số số hạng ($80$ số hạng) để ghép từng cặp liền nhau; mỗi cặp đặt luỹ thừa nhỏ của 5 làm thừa số chung, ngoặc còn $1+5$.

**Bước 2.** Ý b: chứng tỏ mọi số hạng đều chia hết cho 5, nên $M$ chia hết cho 5.

**Bước 3.** Ý b: tách $M=5+(5^2+\dots+5^{80})$; từ $5^2$ trở đi mọi số hạng chia hết cho 25, còn $5$ không chia hết cho 25, nên suy ra $M$ có chia hết cho 25 không.

**Bước 4.** Lập luận số chính phương thì mọi số mũ trong phân tích ra thừa số nguyên tố đều chẵn: $M$ chia hết cho 5 thì số mũ của 5 phải từ 2 trở lên, tức $M$ phải chia hết cho 25.

**Chú ý:** tổng có đúng một số hạng không chia hết cho 25, các số hạng còn lại chia hết cho 25, thì cả tổng không chia hết cho 25.

**Phần 2. Trình bày**

a) $M$ có $80$ số hạng, ghép hai số hạng liền nhau thành $40$ nhóm:

$M=(5+5^2)+(5^3+5^4)+\dots+(5^{79}+5^{80})$

$=5.(1+5)+5^3.(1+5)+\dots+5^{79}.(1+5)$

$=6.(5+5^3+\dots+5^{79})$

Suy ra $M\vdots 6$.

b) Mỗi số hạng $5;\ 5^2;\ \dots;\ 5^{80}$ đều chia hết cho 5 nên $M\vdots 5$.

Viết $M=5+(5^2+5^3+\dots+5^{80})$. Với $k\ge 2$ ta có $5^k=25.5^{k-2}$ chia hết cho 25, nên $5^2+5^3+\dots+5^{80}$ chia hết cho 25. Mà $5$ không chia hết cho 25.

Suy ra $M$ không chia hết cho 25.

@@BO@@

Vì $M$ chia hết cho 5 nên số mũ của thừa số nguyên tố $5$ trong $M$ lớn hơn hoặc bằng $1$, mà số mũ đó chẵn nên lớn hơn hoặc bằng $2$. Suy ra $M$ chia hết cho $5^2=25$. Mâu thuẫn với $M$ không chia hết cho 25.

Vậy $M$ không là số chính phương.`.replace('@@BO@@', bo('M')),
})

// ───────── kiểm định dạng
for (const q of C) {
  const t = q.noi_dung + '\n' + q.loi_giai
  if ((t.match(/\$/g) ?? []).length % 2) { console.error('✘ số $ lẻ', q.id); process.exit(3) }
  if (/\\cdot|\\times|\\left|\\right/.test(t)) { console.error('✘ ký hiệu cấm', q.id); process.exit(3) }
  if (!/\*\*Phần 1\. Hướng dẫn\*\*[\s\S]+\*\*Phần 2\. Trình bày\*\*/.test(q.loi_giai)) { console.error('✘ thiếu 2 phần', q.id); process.exit(3) }
  const b = (q.loi_giai.match(/\*\*Bước \d+\./g) ?? []).length
  if (b < 3 || b > 6) { console.error('✘ số bước', q.id, b); process.exit(3) }
  if (/\$\{|%X%/.test(t)) { console.error('✘ còn mẫu chưa thay', q.id); process.exit(3) }
}
console.log('✔ định dạng 7 câu ổn')

const L = C.map((q) => ({
  khoi: '6', loai_cau: 'tu_luan', noi_dung: q.noi_dung, dap_an: null, loi_giai: q.loi_giai,
  dang_bai: q.dang_bai, dang_bai_chac: q.chac, dang_bai_ly_do: q.ly_do,
  ten_de_goc: q.ten_de_goc, nguon: 'le', nguon_giai: 'ai', ghi_chu_nhap: [`Nguồn: ${NGUON} (${q.id}).`, q.ghi_chu].filter(Boolean).join(' '),
}))
mkdirSync('.nhap-tam', { recursive: true })
writeFileSync('.nhap-tam/scp-6.json', JSON.stringify(L))
writeFileSync(D + 'cau.json', JSON.stringify(C.map((q, i) => ({ id: q.id, ...L[i] })), null, 1))

// ───────── HTML duyệt (ảnh gốc + đề + lời giải)
const IMG = process.env.SCP_IMG_DIR
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')
const b64 = (n) => (IMG && existsSync(`${IMG}/${n}.png`)) ? `<img src="data:image/png;base64,${readFileSync(`${IMG}/${n}.png`).toString('base64')}" style="max-width:100%;border:1px solid #ddd;margin:6px 0">` : ''
const gom = { B13: 1, B14: 1, B4a: 2, B4b: 2, B1: 3, B3: 4, B6: 5 }
let h = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Duyệt: 7 câu Số chính phương (K6)</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>body{font:15px/1.65 system-ui,'Segoe UI',sans-serif;max-width:1000px;margin:0 auto;padding:16px;background:#fafafb;color:#1a1a2e}h1{font-size:22px}.q{background:#fff;border:1px solid #e1e1ec;border-left:5px solid #4c6fff;border-radius:8px;padding:10px 14px;margin:14px 0}.tag{display:inline-block;font-size:11.5px;border-radius:10px;padding:1px 9px;color:#fff;background:#2D9CDB;margin-right:4px}.note{font-size:12.5px;color:#a33;margin-top:4px}.box{background:#fff;border:1px solid #dde;border-radius:10px;padding:10px 14px}</style></head><body>
<h1>Duyệt 7 câu → kho <i>Số chính phương</i> (K6 › Số nguyên › Các bài toán nâng cao)</h1>
<div class="box">6 bài của tài liệu <b>${esc(NGUON)}</b> → <b>7 câu</b> (Bài 4 tách a, b vì hai dãy khác nhau). Kho <b>về nhà</b> (<code>dai_cau_hoi</code>, chưa duyệt), loại <code>tu_luan</code>. Mọi bước tính đã kiểm máy (BigInt). Dạng bài ghi là <b>đề xuất</b>.<br><b class="note">Sửa đề: Bài 13 in "2008" nhưng lời giải trong tài liệu dùng 2018 ⇒ em sửa đề thành 2018.</b></div>`
for (const [i, q] of C.entries()) {
  h += `<div class="q"><span class="tag">${esc(q.id)}</span><span class="tag" style="background:#b23a72">${esc(q.dang_bai)} · ${q.chac}</span> <span style="font-size:12px;color:#888">${esc(q.ten_de_goc)}</span>
${i === 0 || gom[q.id] !== gom[C[i - 1].id] ? `<details><summary>Ảnh gốc</summary>${b64(gom[q.id])}</details>` : ''}
<p><b>Đề:</b><br>${fmt(q.noi_dung)}</p>${q.ghi_chu ? `<div class="note">${esc(q.ghi_chu)}</div>` : ''}<div class="note" style="color:#555">${esc(q.ly_do)}</div>
<details open><summary>Lời giải</summary><div>${fmt(q.loi_giai)}</div></details></div>`
}
h += `<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script><script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script><script>renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})</script></body></html>`
writeFileSync(D + 'so-chinh-phuong-duyet.html', h)
console.log('✔ so-chinh-phuong-duyet.html', (h.length / 1024).toFixed(0) + ' KB')

// ───────── nhập kho
const a = ['scripts/nhap_kho.mjs', 'insert', '--subject', 'dai', '--json', '.nhap-tam/scp-6.json']; if (!GHI) a.push('--thu')
const r = spawnSync('node', a, { encoding: 'utf8' })
let j; try { j = JSON.parse(r.stdout) } catch { j = { ok: false, error: (r.stdout + r.stderr).slice(0, 600) } }
console.log(GHI ? '── GHI THẬT ──' : '── CHẠY KHÔ (--thu) ──'); console.log(JSON.stringify(j).slice(0, 900))
if (GHI && j.ok) writeFileSync(D + 'ma-cau.json', JSON.stringify(j.ma_cau_list ?? []))
