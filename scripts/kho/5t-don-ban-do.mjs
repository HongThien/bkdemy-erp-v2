// 5t-don-ban-do.mjs — DỌN bản đồ 5T theo bản chi tiết (Thùy gật 21/11: "Làm S01 S02 S06"). Chỉ SỬA chữ trên dạng có sẵn, không đổi mã, không xoá.
//   S01  12 dạng lý thuyết kiểu cũ (dán từ sách, lẫn "Ví dụ", không thẻ): viết lý thuyết MỚI mở bằng thẻ ##TC/##PP/##CY; các ví dụ cũ chuyển nguyên sang ô `vi_du` (##VD, kèm sơ đồ) — không mất ví dụ nào.
//   S02  8 dạng mô tả quá ngắn (NDB02771–02778): viết lại mô tả nhận biết (dấu hiệu đề + cách giải + khác dạng gần).
//   S06  3 cặp dạng chồng lấn: thêm câu "Phân biệt với … ở chỗ …" vào mô tả HAI phía.
//   node scripts/kho/5t-don-ban-do.mjs [--ghi]    (mặc định chạy thử rồi ROLLBACK; chạy lại an toàn)
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')

// ---------------------------------------------------------------- S01: lý thuyết mới (khuôn spec-ban-do-toan §8: ##TC / ##PP / ##CY, không chứa ví dụ)
const LT = {
  NDB01797: `##TC
Bài toán tổng – tỉ: biết tổng của hai số và tỉ số của chúng. Tổng số phần bằng nhau bằng tổng hai số trong tỉ số; giá trị một phần bằng tổng chia cho tổng số phần.
Bài toán hiệu – tỉ: biết hiệu của hai số và tỉ số của chúng. Hiệu số phần bằng nhau bằng số phần của số lớn trừ số phần của số bé; giá trị một phần bằng hiệu chia cho hiệu số phần.
Số bé bằng giá trị một phần nhân với số phần của số bé; số lớn bằng giá trị một phần nhân với số phần của số lớn (hoặc tổng trừ số bé, hoặc số bé cộng hiệu).

##PP
Vẽ sơ đồ: số bé mấy phần bằng nhau, số lớn mấy phần như thế, ghi tổng hoặc hiệu.
Tìm tổng (hiệu) số phần bằng nhau.
Tìm giá trị một phần.
Tìm từng số, rồi thử lại.

##CY
Tỉ số $\\dfrac{a}{b}$ với $a<b$ nghĩa là số bé có $a$ phần, số lớn có $b$ phần; "gấp $k$ lần" nghĩa là $k$ phần.
Tổng hoặc hiệu có khi cho gián tiếp (số bé nhất có bốn chữ số, thương của một phép chia…): tìm ra trước rồi mới lập sơ đồ.`,
  NDB01798: `##TC
Khi thêm, bớt hoặc chuyển một lượng giữa các đại lượng thì tổng hoặc hiệu thay đổi theo: thêm $a$ vào một số thì tổng tăng $a$; bớt thì giảm $a$; chuyển $a$ từ số này sang số kia thì tổng không đổi, còn hiệu đổi $a\\times 2$.
Tỉ số đề cho là tỉ số của các số SAU khi thay đổi; muốn có số ban đầu phải hoàn lại đúng chiều lượng đã thay đổi.

##PP
Tính tổng (hoặc hiệu) sau khi thay đổi.
Giải bài tổng – tỉ (hiệu – tỉ) với các số sau khi thay đổi.
Hoàn lại lượng đã thêm, bớt hoặc chuyển để được các số ban đầu.

##CY
Hoàn lại ngược chiều: đã thêm thì trừ đi, đã bớt thì cộng lại.
Thêm ở số này, bớt ở số kia thì tổng (hiệu) đổi theo cả hai lượng.`,
  NDB01799: `##TC
Hiệu số tuổi của hai người không đổi theo thời gian.
Sau $n$ năm, mỗi người thêm $n$ tuổi nên tổng số tuổi của hai người thêm $n\\times 2$ (trước $n$ năm thì bớt $n\\times 2$); với ba người thì thêm (bớt) $n\\times 3$.

##PP
Chọn mốc thời gian mà đề cho tỉ số (tuổi gấp mấy lần).
Tính hiệu hoặc tổng số tuổi ở mốc đó (hiệu không đổi; tổng thì cộng thêm $2\\times$ số năm).
Giải bài hiệu – tỉ hoặc tổng – tỉ để tìm tuổi ở mốc đó.
Lùi hoặc tiến về hiện tại, rồi thử lại.

##CY
Tổng số tuổi thay đổi nhiều lần số năm; chỉ hiệu số tuổi mới giữ nguyên.
Đọc kỹ đề hỏi tuổi hiện nay hay tuổi ở mốc khác.`,
  NDB01800: `##TC
Ba đại lượng liên hệ theo chuỗi tỉ số nối tiếp (A bằng $\\dfrac{m}{n}$ B, B bằng $\\dfrac{p}{q}$ C): chọn đại lượng làm "gốc" rồi đổi các đại lượng còn lại thành số phần của gốc; phân số nối tiếp cần quy về cùng một số phần cho đại lượng chung (đại lượng ở giữa).
Biết tổng ba đại lượng thì giá trị một phần bằng tổng chia cho tổng số phần của cả ba.

##PP
Xác định đại lượng nhỏ nhất (hoặc đại lượng ở giữa) làm $1$ phần hoặc quy đồng số phần của đại lượng ở giữa.
Biểu thị số phần của từng đại lượng, vẽ sơ đồ.
Cộng số phần, chia tổng cho tổng số phần để được một phần, rồi tìm từng số.

##CY
Phải làm cho đại lượng ở giữa có CÙNG số phần ở hai tỉ số trước khi nối.
Kiểm tra điều kiện chia hết (số học sinh, số con vật phải là số tự nhiên).`,
  NDB01801: `##TC
Nếu $\\dfrac{a}{b}$ số thứ nhất bằng $\\dfrac{c}{d}$ số thứ hai bằng $\\dfrac{e}{f}$ số thứ ba thì ta quy đồng TỬ số của các phân số (đổi về cùng tử số); khi đó số thứ nhất, thứ hai, thứ ba lần lượt có số phần bằng các MẪU số mới.
Biết tổng (hoặc hiệu) của các số thì chia cho tổng (hiệu) số phần để được một phần.

##PP
Đổi các phân số về cùng tử số.
Coi mỗi số có số phần bằng mẫu số tương ứng.
Tìm tổng (hiệu) số phần, giá trị một phần, rồi từng số.

##CY
Quy đồng TỬ số, không phải mẫu số.
Đổi "gấp $k$ lần" thành phân số trước khi quy đồng tử.`,
  NDB01802: `##TC
Bài toán ba đại lượng phức hợp thường cho tỉ số gián tiếp: "một đại lượng bằng tổng hai đại lượng còn lại" thì nó bằng $\\dfrac{1}{2}$ tổng cả ba; "bằng $\\dfrac{1}{3}$ tổng hai đại lượng còn lại" thì bằng $\\dfrac{1}{4}$ tổng cả ba; "tổng hai đại lượng gấp $k$ lần đại lượng thứ ba" thì tổng cả ba có $k+1$ phần của đại lượng thứ ba.
Khi tổng không cho thẳng mà cho trong một khoảng thì dùng điều kiện chia hết cho tổng số phần để xác định.

##PP
Chuyển mọi quan hệ về cùng một số làm gốc (thường là tổng cả ba hoặc đại lượng nhỏ nhất).
Biểu thị số phần của từng đại lượng.
Tìm giá trị một phần từ tổng đã cho (hoặc từ điều kiện chia hết), rồi tìm từng đại lượng.

##CY
Phân biệt "bằng tổng hai số kia" với "bằng tổng cả ba".
Số phần phải ứng với số tự nhiên các đối tượng.`,
  NDB01803: `##TC
Hai tỉ số, MỘT đại lượng không đổi: chọn đại lượng không đổi làm mốc, viết đại lượng thay đổi thành số phần của mốc ở lúc đầu và lúc sau; đưa hai tỉ số về cùng số phần của đại lượng không đổi.
Hiệu hai số phần của đại lượng thay đổi ứng với lượng thêm hoặc bớt đã cho.

##PP
Xác định đại lượng không đổi.
Đổi hai tỉ số thành phân số của đại lượng không đổi (cùng số phần cho mốc).
Tìm hiệu số phần của đại lượng thay đổi, ứng với lượng thêm (bớt).
Tìm giá trị một phần, rồi các số cần tìm.

##CY
Phải chọn ĐÚNG đại lượng không đổi (đại lượng chưa bị thêm hoặc bớt).
Số phần của mốc ở hai lúc phải bằng nhau.`,
  NDB01804: `##TC
Hai tỉ số, TỔNG không đổi: khi chuyển một lượng từ đại lượng này sang đại lượng kia thì tổng không đổi. Viết mỗi đại lượng thành phân số của TỔNG ở hai lúc: nếu đại lượng A bằng $\\dfrac{a}{b}$ đại lượng B thì A bằng $\\dfrac{a}{a+b}$ tổng.
Hiệu hai phân số của tổng ứng với lượng đã chuyển.

##PP
Xác định tổng không đổi.
Đổi hai tỉ số thành phân số của tổng ở lúc đầu và lúc sau.
Tìm phân số của tổng ứng với lượng chuyển, suy ra tổng.
Tìm từng đại lượng lúc đầu, rồi thử lại.

##CY
Phân số của tổng là $\\dfrac{a}{a+b}$, không phải $\\dfrac{a}{b}$.
Xét đúng chiều chuyển (đại lượng nào tăng, đại lượng nào giảm).`,
  NDB01805: `##TC
Hai tỉ số, HIỆU không đổi: khi hai đại lượng cùng thêm hoặc cùng bớt một lượng như nhau thì hiệu của chúng không đổi. Nếu đại lượng nhỏ bằng $\\dfrac{a}{b}$ đại lượng lớn thì nó bằng $\\dfrac{a}{b-a}$ hiệu.
Hiệu hai phân số của hiệu ứng với lượng cùng thêm (bớt) của đại lượng nhỏ.

##PP
Xác định hiệu không đổi.
Đổi hai tỉ số thành phân số của hiệu ở lúc đầu và lúc sau.
Tìm phân số của hiệu ứng với lượng thêm (bớt), suy ra hiệu.
Tìm hai đại lượng, rồi thử lại.

##CY
Phân số của hiệu là $\\dfrac{a}{b-a}$.
Phân biệt hiệu không đổi (cùng thêm, cùng bớt) với tổng không đổi (chuyển qua lại).`,
  NDB01807: `##TC
Biết giá trị $m$ ứng với $\\dfrac{a}{b}$ của một số thì số đó bằng $m:\\dfrac{a}{b}$.
Nếu đề cho "một số bớt đi $m$ thì bằng $\\dfrac{a}{b}$ số đó" thì $m$ ứng với $1-\\dfrac{a}{b}$ số đó.

##PP
Xác định phân số của cả số ứng với giá trị đã biết (đổi lời đề nếu cần, ví dụ lấy $1$ trừ phân số đã cho).
Lấy giá trị đã biết chia cho phân số đó để tìm cả số.
Thử lại bằng phép nhân.

##CY
Chia cho một phân số là nhân với phân số đảo ngược.
Đừng nhầm "phân số ứng với giá trị" với phân số của đề cho.`,
  NDB01808: `##TC
Cả số được chia thành nhiều phần, mỗi phần là một phân số của cả số; muốn tìm phân số ứng với TỔNG hoặc HIỆU của hai phần thì cộng hoặc trừ các phân số ấy.
Cả số bằng giá trị của tổng (hoặc hiệu) chia cho phân số vừa tìm được.

##PP
Tìm phân số chỉ mỗi phần (nếu một phần chưa cho thì lấy $1$ trừ các phần đã cho).
Cộng hoặc trừ các phân số ứng với tổng (hiệu) đã biết giá trị.
Lấy giá trị đã biết chia cho phân số đó để tìm cả số.

##CY
Hiệu hai phần ứng với giá trị đã cho thì phải TRỪ hai phân số.
Quy đồng mẫu số trước khi cộng, trừ.`,
  NDB01809: `##TC
Phân số của "các phần còn lại" phải đổi thành phân số của CẢ số: nếu một phần bằng $\\dfrac{m}{n}$ các phần còn lại thì nó bằng $\\dfrac{m}{m+n}$ cả số.
Phần còn lại cuối cùng bằng $1$ trừ các phân số đã lấy; cả số bằng giá trị của phần còn lại chia cho phân số chỉ phần còn lại.

##PP
Đổi mọi phân số của đề thành phân số của cả số.
Lấy $1$ trừ các phân số đó để được phân số chỉ phần còn lại.
Lấy giá trị phần còn lại chia cho phân số này để tìm cả số.

##CY
Không cộng trừ trực tiếp phân số của "các phần còn lại" với phân số của cả số.
Thử lại bằng cách tính từng phần từ cả số.`,
}

// ---------------------------------------------------------------- S02: mô tả mới (giữ ý cũ, thêm dấu hiệu + cách giải + khác dạng gần)
const MT = {
  NDB02771: 'Bài bán hàng cơ bản xoay quanh giá vốn (giá gốc), tiền lãi, giá bán và tỉ lệ lãi tính theo GIÁ VỐN: đề cho hai trong các đại lượng ấy và hỏi đại lượng còn lại (giá bán, tiền lãi, giá vốn, lãi bao nhiêu phần trăm). Cách giải: coi giá vốn là $100\\%$, giá bán là $100\\%+$ tỉ lệ lãi; tiền lãi bằng giá bán trừ giá vốn. Khác «Bài toán cho số liệu theo giá bán» (NDB02772) ở chỗ gốc so sánh là giá vốn, không phải giá bán.',
  NDB02772: 'Bài bán hàng mà lãi (hoặc giá vốn) được cho bằng phần trăm của GIÁ BÁN thay vì giá vốn: "lãi $a\\%$ giá bán". Cách giải: coi giá bán là $100\\%$, tiền lãi là $a\\%$, giá vốn là $100\\%-a\\%$ giá bán rồi tìm từng đại lượng. Khác «Bài toán cơ bản về bán hàng» (NDB02771) ở chỗ gốc so sánh là giá bán; dễ sai nếu coi giá vốn là $100\\%$.',
  NDB02773: 'Bài bán hàng có giảm giá một lần: giá bán ngày thường (có lãi dự định), sau đó giảm $a\\%$ so với giá bán ngày thường; hỏi giá sau khi giảm, lãi (hoặc lỗ) thực tế, hoặc tính ngược giá vốn khi biết lãi thực tế. Cách giải: giá sau giảm bằng giá bán ngày thường nhân $(100\\%-a\\%)$, lãi thực tế bằng giá sau giảm trừ giá vốn. Khác «Bài toán giảm giá kép» (NDB02774) ở chỗ chỉ giảm một lần.',
  NDB02774: 'Bài giảm giá HAI (hoặc nhiều) lần liên tiếp, mỗi lần giảm theo giá đã giảm ở lần trước: giảm lần 1 rồi lần 2 trên giá đã giảm, hỏi giá cuối hoặc tính ngược giá ban đầu. Cách giải: nhân các tỉ lệ còn lại, giá cuối bằng giá đầu nhân $(100\\%-a\\%)\\times(100\\%-b\\%)$, KHÔNG cộng dồn phần trăm giảm (giảm hai lần $10\\%$ không bằng giảm $20\\%$). Khác «Bài toán giảm giá» (NDB02773) ở chỗ giảm từ hai lần trở lên.',
  NDB02775: 'Bài toán về doanh thu – chi phí – giá bán – số lượng khi các đại lượng thay đổi theo phần trăm: doanh thu bằng giá bán nhân số lượng bán; đề cho tỉ số doanh thu và tỉ số giá (hay chi phí) rồi hỏi tỉ số số lượng, lợi nhuận. Cách giải: viết các tỉ số phần trăm theo cùng một gốc, tỉ số doanh thu bằng tích hai tỉ số giá và số lượng nên tỉ số số lượng bằng tỉ số doanh thu chia tỉ số giá. Khác «Bài toán về diện tích» (NDB02776) ở chỗ tích là doanh thu, không phải diện tích.',
  NDB02776: 'Bài toán về diện tích hình chữ nhật (hay tích hai đại lượng) khi chiều dài, chiều rộng thay đổi theo phần trăm: đề cho thay đổi hai cạnh (hoặc một cạnh) và diện tích, hỏi cạnh hay diện tích còn lại. Cách giải: coi mỗi đại lượng ban đầu là $100\\%$, diện tích mới bằng tích hai tỉ số phần trăm của hai cạnh, từ đó tìm tỉ số cạnh còn lại rồi đổi ra số đo. Khác «Bài toán về doanh thu – chi phí» (NDB02775) ở chỗ tích là diện tích.',
  NDB02777: 'Bài trộn hai (hay nhiều) phần có tỉ lệ phần trăm chất tan khác nhau rồi hỏi tỉ lệ phần trăm của hỗn hợp: pha dung dịch nước muối, nước đường, trộn sữa có độ béo khác nhau. Cách giải: tính lượng chất tan của từng phần (khối lượng nhân tỉ lệ), cộng lại, chia cho tổng khối lượng hỗn hợp. Khác «Bài toán cho hỗn hợp tìm ngược lại A và B» (NDB02778) ở chỗ đề cho các phần rồi tìm tỉ lệ của hỗn hợp, không phải ngược lại.',
  NDB02778: 'Bài cho hỗn hợp A và B đã trộn rồi tìm ngược lại một thành phần: biết khối lượng, tỉ lệ phần trăm của hỗn hợp và của một phần, hỏi tỉ lệ (hay khối lượng) của phần còn lại. Cách giải: tính lượng chất tan của hỗn hợp, trừ lượng chất tan của phần đã biết để được lượng chất tan của phần cần tìm, rồi chia cho khối lượng phần đó. Khác «Bài toán trộn A và B để tìm hỗn hợp» (NDB02777) ở chỗ đi theo chiều ngược: từ hỗn hợp tìm thành phần.',
}

// ---------------------------------------------------------------- S06: phân định ba cặp dạng chồng lấn (nối vào CUỐI mô tả hai phía, chỉ khi chưa có)
const PD = [
  ['NDB03025', 'Phân biệt với «Trung điểm / điểm chia cạnh theo tỉ số» (NDB03027): ở dạng này quan hệ giữa các đoạn trên đáy đã cho sẵn bằng số hoặc phân số (hay đọc thẳng được từ hình), chỉ việc lập tỉ số diện tích; còn đề nói điểm chia cạnh bằng lời ("trung điểm", "BM = 2 × MC") phải đổi thành phần của cả cạnh trước thì thuộc NDB03027.'],
  ['NDB03027', 'Phân biệt với «Tính diện tích tam giác dùng tỉ lệ cạnh» (NDB03025): nếu quan hệ giữa các đoạn thẳng đã cho thẳng thành tỉ số hay số đo thì thuộc NDB03025; dạng này dành cho đề dùng lời ("trung điểm", "điểm chính giữa", "BM = 2 × MC", "một phần ba") và phải đổi sang số phần của cả cạnh trước khi lập tỉ số diện tích.'],
  ['NDB02993', 'Phân biệt với «Bài toán Hai tỉ số - Dạng hiệu không đổi» (NDB01805): hai dạng chồng lấn ở bài cho tỉ số ở hai thời điểm; quy ước: đối tượng là TUỔI người (mẹ, con, anh, em…) ⇒ dạng này; đối tượng là lượng khác (bi, sách, tiền, số học sinh…) cùng thêm hoặc cùng bớt một lượng như nhau ⇒ NDB01805.'],
  ['NDB01805', 'Phân biệt với «Tổng tuổi / tỉ số tuổi ở hai thời điểm» (NDB02993): bài nói về TUỔI người ⇒ thuộc NDB02993; dạng này dành cho các lượng khác (bi, sách, tiền, số học sinh…) cùng thêm hoặc cùng bớt một lượng như nhau nên hiệu không đổi.'],
  ['NDB02937', 'Phân biệt với «Một số bài toán nâng cao liên quan đến cấu tạo số thập phân» (NDB01817): dạng này CHỈ gồm bài tổng các số viết từ cùng các chữ số nhưng đặt dấu phẩy ở những vị trí khác nhau ($\\overline{a,bcd}+\\overline{ab,cd}+\\overline{abc,d}+\\overline{abcd}$…); các bài ẩn chữ khác (hiệu, nhân, chia, quan hệ giữa các hàng, lập số) thuộc NDB01817.'],
  ['NDB01817', 'Phân biệt với «Có phần thập phân» (NDB02937): bài tổng các số viết từ cùng các chữ số $a,b,c,d$ với dấu phẩy đặt ở các vị trí khác nhau thuộc NDB02937; dạng này gồm các bài ẩn chữ khác (hiệu, nhân, chia, quan hệ giữa các hàng, lập số từ các chữ số).'],
]

// ---------------------------------------------------------------- chuyển ví dụ cũ → ##VD
const tachVD = (lt) => {
  const dong = lt.split(/\r?\n/)
  const phan = []; let cur = null
  for (const l of dong) { if (/^\s*(?:\*\*)?\s*Ví dụ/.test(l)) { cur = []; phan.push(cur) } if (cur) cur.push(l); }
  if (!phan.length && /Bài giải/.test(lt)) phan.push(dong)
  return phan.map((p) => {
    const t = p.join('\n').replace(/^\s*(?:\*\*)?\s*Ví dụ\s*\d*\s*(?:\*\*)?\s*[.:]?\s*(?:\*\*)?\s*[.:]?\s*/, '').trim()
    const i = t.search(/^\s*(?:\*\*)?\s*(Bài giải|Bài làm|Hướng dẫn tư duy)\s*(?:\*\*)?\s*:?/mi)
    const de = (i < 0 ? t : t.slice(0, i)).trim(), loi = (i < 0 ? '' : t.slice(i)).replace(/^\s*(?:\*\*)?\s*(Bài giải|Bài làm)\s*(?:\*\*)?\s*:?\s*\n?/i, '').trim()
    const sach = (s) => s.split('\n').filter((l) => !/^\s*\*{2,}\s*$/.test(l)).join('\n')
    return `##VD\n${sach(de).replace(/\n{2,}/g, '\n')}\n**Hướng dẫn giải:**\n${sach(loi).replace(/\n{3,}/g, '\n\n').replace(/\n\n(?!\n)/g, '\n')}`.trimEnd()
  }).filter((x) => x.length > 20)
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL }); await c.connect()
try {
  await c.query('begin')
  const ds = (await c.query(`select id, ten, mo_ta, ly_thuyet, vi_du from dai_bdm_dang_bai where id = any($1)`, [[...Object.keys(LT), ...Object.keys(MT), ...PD.map((x) => x[0])]])).rows
  const by = Object.fromEntries(ds.map((d) => [d.id, d]))
  let s1 = 0, nVD = 0, s2 = 0, s6 = 0
  for (const [id, lt] of Object.entries(LT)) {
    const d = by[id]; if (!d) throw new Error('không có ' + id)
    if (/^\s*##/.test(d.ly_thuyet) && !/Ví dụ/.test(d.ly_thuyet)) continue   // đã dọn rồi
    const vd = tachVD(d.ly_thuyet)
    const cu = d.vi_du.trimEnd()
    const them = vd.filter((b) => !cu.includes(b.slice(5, 45)))
    const moi = [cu, ...them].filter(Boolean).join('\n\n')
    await c.query(`update dai_bdm_dang_bai set ly_thuyet=$2, vi_du=$3 where id=$1`, [id, lt, moi]); s1++; nVD += them.length
    console.log(id, '→ lý thuyết mới', lt.length, 'ký tự · chuyển', them.length, '/', vd.length, 'ví dụ cũ sang vi_du')
  }
  for (const [id, mt] of Object.entries(MT)) { if (by[id].mo_ta === mt) continue; await c.query(`update dai_bdm_dang_bai set mo_ta=$2 where id=$1`, [id, mt]); s2++ }
  for (const [id, cau] of PD) { const d = (await c.query(`select mo_ta from dai_bdm_dang_bai where id=$1`, [id])).rows[0]; if (d.mo_ta.includes('Phân biệt với')) continue; await c.query(`update dai_bdm_dang_bai set mo_ta=$2 where id=$1`, [id, d.mo_ta.trimEnd() + ' ' + cau]); s6++ }
  const kiem = (await c.query(`select count(*) filter (where ly_thuyet !~ '^\\s*##')::int khong_the, count(*) filter (where ly_thuyet ~ 'Ví dụ')::int con_vd from dai_bdm_dang_bai where id = any($1)`, [Object.keys(LT)])).rows[0]
  const ngan = (await c.query(`select count(*)::int n from dai_bdm_dang_bai where id = any($1) and length(mo_ta) < 200`, [Object.keys(MT)])).rows[0].n
  console.log({ S01_dang: s1, S01_vi_du_chuyen: nVD, S02_dang: s2, S06_dang: s6, sau_S01: kiem, S02_con_ngan: ngan })
  if (kiem.khong_the || kiem.con_vd) throw new Error('S01 còn dạng chưa gắn thẻ / còn chữ "Ví dụ" trong lý thuyết')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
