// ============================================================================
// ban-do-4t-tbc-dien.mjs — ĐIỀN lý thuyết + ví dụ cho chuyên đề «Trung bình cộng» (NCH00516) của bản đồ mới 4T,
// lấy từ CHUYÊN ĐỀ 13 sách "Toán arc 4 quyển 1" (Tóm tắt lý thuyết · 6 Ví dụ · Luyện tập), theo khuôn spec-format-noidung.md
// (##TC · ##PP · ##CY · ##VD + «Hướng dẫn giải»).
//
//   node scripts/kho/ban-do-4t-tbc-dien.mjs          (XEM: rollback + dựng HTML xem trước)
//   node scripts/kho/ban-do-4t-tbc-dien.mjs --ghi    (COMMIT)
//
// CHỈ ĐIỀN Ô TRỐNG: ô nào đã có chữ (Thùy đã viết) thì giữ nguyên, không đè (ban-do-moi-cap-nhat-thi-phan-lai-khong-hoi, 21/10).
// Không đụng `mo_ta` (Thùy viết). Ví dụ lấy thẳng từ sách = nguon 'sach'; ví dụ mô phỏng sách cho dạng sách không có = nguon 'mo_phong'
// (đánh dấu ở HTML để Thùy thấy chỗ nào là của sách, chỗ nào Claude dựng theo khuôn sách).
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { katexCss, mathHtml, esc, imgDataUri } from '../lib/html-tu-chua.mjs'

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const GHI = process.argv.includes('--ghi')
const env = Object.fromEntries(readFileSync(join(GOC, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const KHO = 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/sach/2026-10/'
const SD = { 4: `${KHO}c3c64f1e-8313-4c53-af00-a887ed85a7d0_VD-13-4.svg`, 5: `${KHO}a83a37d9-6389-4271-a250-2b0a28f11c8f_VD-13-5.svg`, 6: `${KHO}a850ed07-5f1b-49ac-959b-580659f310d1_VD-13-6.svg` }

const R = String.raw
// ── NHÓM ────────────────────────────────────────────────────────────────────────────────────────
const NHOM = {
  NNB01724: { ly_thuyet: R`##TC Trung bình cộng
Muốn tìm trung bình cộng của nhiều số, ta tính tổng của các số đó rồi chia tổng đó cho số các số hạng.

##TC Tìm tổng khi biết trung bình cộng
Tổng các số $=$ trung bình cộng $\times$ số các số hạng.
Biết trung bình cộng và số các số hạng thì tìm được tổng, rồi từ tổng tìm ra số còn thiếu.

##TC Trung bình cộng của dãy số cách đều
Trung bình cộng của một dãy số cách đều bằng (số đầu $+$ số cuối) $:2$.

##CY
Số các số hạng là số số đem cộng, kể cả người hoặc vật không được nêu tên rõ (gia đình có $4$ người thì chia cho $4$, dù chỉ $2$ người đi làm).
Các số phải cùng đơn vị đo thì mới cộng được.` },
  NNB01739: { ly_thuyet: R`##TC Thêm hoặc bớt một số
Thêm một số vào nhóm: tổng mới $=$ tổng cũ $+$ số thêm; số các số hạng mới $=$ số cũ $+1$.
Bớt một số khỏi nhóm: tổng mới $=$ tổng cũ $-$ số bớt; số các số hạng mới $=$ số cũ $-1$.

##PP Cách làm chung
Tính tổng cũ $=$ trung bình cộng cũ $\times$ số các số hạng cũ.
Tính tổng mới $=$ trung bình cộng mới $\times$ số các số hạng mới.
So hai tổng: hiệu của chúng chính là số được thêm vào (hoặc bớt đi).

##CY
Không lấy trung bình cộng cũ cộng hay trừ trực tiếp với số được thêm: số thêm chỉ là một trong các số của nhóm mới. Luôn đi qua tổng.` },
  NNB01740: { ly_thuyet: R`##TC Một số bằng, nhiều hơn hay ít hơn trung bình cộng
Gọi $n$ là số các số hạng, các số còn lại là những số khác số đang xét.
Một số bằng trung bình cộng thì $n-1$ lần trung bình cộng $=$ tổng các số còn lại.
Một số nhiều hơn trung bình cộng $k$ đơn vị thì $n-1$ lần trung bình cộng $=$ tổng các số còn lại $+\,k$.
Một số ít hơn trung bình cộng $k$ đơn vị thì $n-1$ lần trung bình cộng $=$ tổng các số còn lại $-\,k$.

##PP Bài toán ba số (hai lần trung bình cộng)
Vẽ sơ đồ: số đang xét là $1$ đoạn trung bình cộng (thêm hoặc bớt $k$); hai số còn lại bù đúng phần đó.
Tính hai lần trung bình cộng từ tổng hai số còn lại (cộng thêm $k$ nếu "nhiều hơn", trừ đi $k$ nếu "ít hơn").
Chia đôi được trung bình cộng, rồi tìm số cần tìm hoặc tổng cả ba số.

##CY
Đọc kĩ chiều so sánh: "nhiều hơn" thì cộng $k$ khi tính hai lần trung bình cộng, "ít hơn" thì trừ $k$.` },
}

// ── DẠNG BÀI ────────────────────────────────────────────────────────────────────────────────────
const DANG = {
  NDB01542: { nguon: 'sach (VD 13.1)', ly_thuyet: R`##PP
Đổi các số liệu về cùng một đơn vị đo (nếu đề cho nhiều đơn vị khác nhau).
Tính tổng các số.
Chia tổng cho số các số hạng rồi ghi đơn vị.

##CY
Đếm đủ số các số hạng trước khi chia (bốn bạn thì chia cho $4$).
Đề cho các số bằng quan hệ "nhiều hơn", "ít hơn" thì phải tìm đủ từng số rồi mới cộng.`,
    vi_du: R`##VD
Bảng sau ghi cân nặng của bốn bạn học sinh: Mia $36$ kg; Jenny $39$ kg; John $42$ kg; Tom $43$ kg. Hỏi trung bình mỗi bạn cân nặng bao nhiêu ki-lô-gam?
**Hướng dẫn giải:**
Muốn tìm trung bình cộng của bốn số, ta lấy tổng của bốn số chia cho $4$.

Trung bình mỗi bạn nặng số ki-lô-gam là: $\left(36+39+42+43\right):4=40$ (kg)

Đáp số: $40$ kg` },
  NDB01583: { nguon: 'mô phỏng (đảo VD 13.1)', ly_thuyet: R`##PP
Tính tổng của tất cả các số: lấy trung bình cộng nhân với số các số hạng.
Tính tổng các số đã biết.
Số cần tìm $=$ tổng của tất cả các số $-$ tổng các số đã biết.

##CY
Số các số hạng tính cả số cần tìm (bốn bài kiểm tra thì nhân với $4$, không phải $3$).`,
    vi_du: R`##VD
Lan làm bốn bài kiểm tra Toán, điểm trung bình cộng của bốn bài là $8$ điểm. Ba bài đầu Lan được $7$ điểm, $9$ điểm và $6$ điểm. Hỏi bài thứ tư Lan được mấy điểm?
**Hướng dẫn giải:**
Biết trung bình cộng và số bài thì tìm được tổng điểm cả bốn bài.

Tổng điểm của bốn bài là: $8\times 4=32$ (điểm)

Tổng điểm của ba bài đầu là: $7+9+6=22$ (điểm)

Điểm bài thứ tư là: $32-22=10$ (điểm)

Đáp số: $10$ điểm` },
  NDB01584: { nguon: 'sach (LT 13.3)', ly_thuyet: R`##PP
Với mỗi loại, tính tổng của loại đó: số lượng nhân với đại lượng của mỗi cái.
Cộng các tổng lại được tổng chung của cả nhóm.
Cộng số lượng của các loại được tổng số cái.
Trung bình cộng $=$ tổng chung $:$ tổng số cái.

##CY
Chia cho TỔNG số cái (số xe), không chia cho số loại.
Kiểm tra đơn vị của đề hỏi: kg đổi ra tạ, tấn khi cần.`,
    vi_du: R`##VD
Có $5$ xe ô tô chở thóc, trong đó có $3$ xe, mỗi xe chở được $5000$ kg thóc và $2$ xe, mỗi xe chở được $4500$ kg thóc. Hỏi trung bình mỗi xe chở được bao nhiêu tạ thóc?
**Hướng dẫn giải:**
Ba xe đầu chở được số ki-lô-gam thóc là: $5000\times 3=15000$ (kg)

Hai xe sau chở được số ki-lô-gam thóc là: $4500\times 2=9000$ (kg)

Cả $5$ xe chở được số ki-lô-gam thóc là: $15000+9000=24000$ (kg)

Trung bình mỗi xe chở được số ki-lô-gam thóc là: $24000:5=4800$ (kg)

Đổi $4800$ kg $=48$ tạ.

Đáp số: $48$ tạ` },
  NDB01585: { nguon: 'mô phỏng (đảo LT 13.3)', ly_thuyet: R`##PP
Tính tổng chung của cả nhóm: trung bình cộng nhân với tổng số cái.
Tính tổng của loại đã biết: số lượng nhân với đại lượng của mỗi cái.
Tổng của loại cần tìm $=$ tổng chung $-$ tổng của loại đã biết.
Đại lượng của mỗi cái thuộc loại cần tìm $=$ tổng của loại đó $:$ số lượng của loại đó.

##CY
Nhân trung bình cộng với tổng số cái của cả hai loại, rồi mới trừ.
Cuối cùng phải chia cho số lượng của loại cần tìm để ra đại lượng của MỖI cái.`,
    vi_du: R`##VD
Một đội có $5$ xe chở hàng: $3$ xe loại I, mỗi xe chở $5$ tấn và $2$ xe loại II (mỗi xe chở như nhau). Trung bình mỗi xe chở $7$ tấn. Hỏi mỗi xe loại II chở bao nhiêu tấn?
**Hướng dẫn giải:**
Cả $5$ xe chở được số tấn hàng là: $7\times 5=35$ (tấn)

Ba xe loại I chở được số tấn hàng là: $5\times 3=15$ (tấn)

Hai xe loại II chở được số tấn hàng là: $35-15=20$ (tấn)

Mỗi xe loại II chở được số tấn hàng là: $20:2=10$ (tấn)

Đáp số: $10$ tấn` },
  NDB01586: { nguon: 'sach (VD 13.3)', ly_thuyet: R`##PP
Kiểm tra dãy số có cách đều không: hai số hạng liền nhau hơn kém nhau cùng một số.
Lấy số đầu cộng số cuối.
Chia tổng đó cho $2$ được trung bình cộng của cả dãy.

##CY
Chỉ dùng cách này cho dãy số cách đều.
Không cần biết dãy có bao nhiêu số hạng.`,
    vi_du: R`##VD
Cho dãy số $2$; $4$; $6$; $8$; ...; $20$. Tìm trung bình cộng của các số trong dãy số đó.
**Hướng dẫn giải:**
Vì dãy số trên là dãy số cách đều nên trung bình cộng các số hạng của dãy là: $\left(2+20\right):2=11$

Đáp số: $11$` },
  NDB01588: { nguon: 'sach (LT 13.10)', ly_thuyet: R`##PP
Các số liên tiếp là dãy số cách đều; số các số hạng lẻ thì trung bình cộng là số ở giữa.
Số ở giữa $=$ trung bình cộng; các số còn lại hơn kém nó theo đúng khoảng cách của dãy.
Tổng $=$ trung bình cộng $\times$ số các số hạng (khi đề hỏi tổng).

##CY
Số tự nhiên liên tiếp hơn kém nhau $1$; số chẵn liên tiếp, số lẻ liên tiếp hơn kém nhau $2$.`,
    vi_du: R`##VD
Biết trung bình cộng của ba số tự nhiên liên tiếp bằng $126$. Tìm ba số đó.
**Hướng dẫn giải:**
Ba số tự nhiên liên tiếp là dãy số cách đều nên số ở giữa bằng trung bình cộng, tức là $126$.

Số bé nhất là: $126-1=125$

Số lớn nhất là: $126+1=127$

Vậy ba số cần tìm là $125$; $126$; $127$.` },
  NDB01589: { nguon: 'sach (LT 13.4)', ly_thuyet: R`##PP
Tính tổng cũ: trung bình cộng cũ nhân với số các số hạng cũ.
Cộng (hoặc trừ) số được thêm (hoặc bớt) để được tổng mới.
Chia tổng mới cho số các số hạng mới.

##CY
Không lấy (trung bình cộng cũ $+$ số thêm) $:2$: số thêm chỉ là một trong các số của nhóm mới.`,
    vi_du: R`##VD
Biết trung bình cộng của bốn số là $3200$. Hỏi nếu thêm số thứ năm là $3000$ thì trung bình cộng của năm số là bao nhiêu?
**Hướng dẫn giải:**
Tổng của bốn số là: $3200\times 4=12800$

Tổng của năm số là: $12800+3000=15800$

Trung bình cộng của năm số là: $15800:5=3160$

Đáp số: $3160$` },
  NDB01590: { nguon: 'sach (VD 13.2)', ly_thuyet: R`##PP
Tính tổng cũ và tổng mới (trung bình cộng nhân với số các số hạng tương ứng).
Số được thêm $=$ tổng mới $-$ tổng cũ.
Số được bớt $=$ tổng cũ $-$ tổng mới.

##CY
Số các số hạng của nhóm mới khác nhóm cũ ($1$ số): nhân đúng số cho từng nhóm.`,
    vi_du: R`##VD
Trung bình cộng của ba số là $9$, nếu thêm số thứ tư thì trung bình cộng của bốn số là $11$. Tìm số thứ tư.
**Hướng dẫn giải:**
Tổng ba số là: $9\times 3=27$

Tổng của bốn số là: $11\times 4=44$

Số thứ tư là: $44-27=17$

Đáp số: $17$` },
  NDB01591: { nguon: 'mô phỏng', ly_thuyet: R`##PP
So số được thêm với trung bình cộng mới: tìm phần hơn (hoặc phần kém).
Mỗi số cũ phải được "bù" từ trung bình cộng cũ lên trung bình cộng mới: tìm mức chênh của mỗi số cũ.
Số các số cũ $=$ phần hơn $:$ mức chênh của mỗi số cũ.

##CY
Thử lại bằng cách tính tổng cũ cộng số thêm rồi chia cho số các số hạng mới.`,
    vi_du: R`##VD
Có một nhóm số có trung bình cộng là $12$. Nếu thêm vào nhóm số $30$ thì trung bình cộng của cả nhóm là $15$. Hỏi lúc đầu nhóm có bao nhiêu số?
**Hướng dẫn giải:**
Số $30$ lớn hơn trung bình cộng mới số đơn vị là: $30-15=15$

Phần hơn này được chia đều để bù cho các số cũ. Mỗi số cũ được bù từ $12$ lên $15$, tức là mỗi số cũ tăng thêm: $15-12=3$

Lúc đầu nhóm có số số là: $15:3=5$ (số)

Thử lại: $\left(12\times 5+30\right):6=15$ (đúng).

Đáp số: $5$ số` },
  NDB01592: { nguon: 'sach (VD 13.4)', ly_thuyet: R`##PP
Số bằng trung bình cộng thì các số còn lại bù cho nhau: với ba số, hai số kia cộng lại bằng $2$ lần trung bình cộng.
Tìm trung bình cộng từ tổng các số còn lại.
Số cần tìm chính là trung bình cộng (hoặc tìm tổng cả nhóm nếu đề hỏi).

##CY
"Bằng trung bình cộng" nghĩa là số đó lấy được từ trung bình cộng của cả ba số, không phải của hai số còn lại.`,
    vi_du: R`##VD
Tổ bạn An được thưởng $24$ ngôi sao, tổ bạn Bình được thưởng $28$ ngôi sao. Tổ bạn Minh được thưởng số ngôi sao bằng trung bình cộng số ngôi sao của ba tổ. Hỏi tổ bạn Minh được thưởng bao nhiêu ngôi sao?
**Hướng dẫn giải:**
Ta có sơ đồ:

![sơ đồ](${SD[4]})

Hai lần trung bình cộng số ngôi sao của ba tổ là: $24+28=52$ (ngôi sao)

Số ngôi sao của tổ bạn Minh là: $52:2=26$ (ngôi sao)

Đáp số: $26$ ngôi sao` },
  NDB01593: { nguon: 'sach (VD 13.5)', ly_thuyet: R`##PP
Vẽ sơ đồ: số lớn hơn trung bình cộng là $1$ đoạn trung bình cộng thêm $k$.
Hai số còn lại bù đúng phần đó, nên $2$ lần trung bình cộng $=$ tổng hai số còn lại $+\,k$.
Chia đôi được trung bình cộng; số cần tìm hoặc tổng cả nhóm tính từ đó.

##CY
"Nhiều hơn" thì CỘNG $k$ khi tính hai lần trung bình cộng.
Đề hỏi tổng cả ba số thì cuối cùng nhân trung bình cộng với $3$.`,
    vi_du: R`##VD
An đọc xong một quyển truyện trong ba ngày. Ngày thứ nhất An đọc $39$ trang, ngày thứ hai đọc $41$ trang, ngày thứ ba đọc nhiều hơn trung bình cộng của cả ba ngày là $8$ trang. Hỏi quyển truyện đó dày bao nhiêu trang?
**Hướng dẫn giải:**
Ta có sơ đồ:

![sơ đồ](${SD[5]})

Hai lần trung bình cộng số trang An đọc trong cả ba ngày là: $39+41+8=88$ (trang)

Trung bình mỗi ngày An đọc số trang là: $88:2=44$ (trang)

Quyển truyện đó dày số trang là: $44\times 3=132$ (trang)

Đáp số: $132$ trang` },
  NDB01594: { nguon: 'sach (VD 13.6)', ly_thuyet: R`##PP
Vẽ sơ đồ: số nhỏ hơn trung bình cộng là $1$ đoạn trung bình cộng bớt $k$.
Hai số còn lại bù đúng phần đó, nên $2$ lần trung bình cộng $=$ tổng hai số còn lại $-\,k$.
Chia đôi được trung bình cộng; số cần tìm $=$ trung bình cộng $-\,k$.

##CY
"Ít hơn" (hoặc "kém") thì TRỪ $k$ khi tính hai lần trung bình cộng, rồi trừ $k$ lần nữa để ra số cần tìm.`,
    vi_du: R`##VD
Đầu năm học nhà trường kiểm tra sức khỏe của học sinh. Bạn Hà nặng $36$ kg, bạn Nam nặng $34$ kg. Bạn Cường có số cân nặng kém trung bình cộng số cân nặng của ba bạn là $4$ kg. Hỏi bạn Cường cân nặng bao nhiêu ki-lô-gam?
**Hướng dẫn giải:**
Ta có sơ đồ:

![sơ đồ](${SD[6]})

Hai lần trung bình cộng cân nặng của ba bạn là: $36+34-4=66$ (kg)

Trung bình cộng cân nặng của ba bạn là: $66:2=33$ (kg)

Cân nặng của bạn Cường là: $33-4=29$ (kg)

Đáp số: $29$ kg` },
}

// ── chạy ─────────────────────────────────────────────────────────────────────────────────────────
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
const q = async (s, p) => (await db.query(s, p)).rows
const bao = { nhom: [], dang: [] }
try {
  await db.query('begin')
  // đúng chuyên đề, đúng cây (chống ghi nhầm khi CEO đã đổi mã)
  const cay = await q(`select n.id nhom, d.id dang from dai_bdm_nhom n left join dai_bdm_dang_bai d on d.nhom_id = n.id where n.chuyen_de_id = 'NCH00516' order by n.thu_tu, d.thu_tu`)
  const idN = new Set(cay.map((x) => x.nhom)), idD = new Set(cay.map((x) => x.dang).filter(Boolean))
  for (const k of Object.keys(NHOM)) if (!idN.has(k)) throw new Error(`nhóm ${k} không còn trong chuyên đề NCH00516 — cây đã đổi, dừng`)
  for (const k of Object.keys(DANG)) if (!idD.has(k)) throw new Error(`dạng ${k} không còn trong chuyên đề NCH00516 — cây đã đổi, dừng`)
  for (const d of idD) if (!(d in DANG)) throw new Error(`dạng ${d} có trong cây nhưng chưa có nội dung — Thùy vừa thêm dạng? Dừng, không đè`)
  for (const [id, v] of Object.entries(NHOM)) {
    const cu = (await q(`select ten, ly_thuyet from dai_bdm_nhom where id = $1`, [id]))[0]
    const trong = cu.ly_thuyet.trim() === ''
    if (trong) await db.query(`update dai_bdm_nhom set ly_thuyet = $2 where id = $1`, [id, v.ly_thuyet])
    bao.nhom.push({ id, ten: cu.ten, lt: trong ? 'điền' : 'GIỮ (đã có chữ)' })
  }
  for (const [id, v] of Object.entries(DANG)) {
    const cu = (await q(`select ten, ly_thuyet, vi_du from dai_bdm_dang_bai where id = $1`, [id]))[0]
    const ltTrong = cu.ly_thuyet.trim() === '', vdTrong = cu.vi_du.trim() === ''
    if (ltTrong) await db.query(`update dai_bdm_dang_bai set ly_thuyet = $2 where id = $1`, [id, v.ly_thuyet])
    if (vdTrong) await db.query(`update dai_bdm_dang_bai set vi_du = $2 where id = $1`, [id, v.vi_du])
    bao.dang.push({ id, ten: cu.ten, lt: ltTrong ? 'điền' : 'GIỮ', vd: vdTrong ? 'điền' : 'GIỮ', nguon: v.nguon })
  }
  console.log(GHI ? '■ GHI THẬT' : '□ XEM (rollback)'); console.table(bao.nhom); console.table(bao.dang)

  // HTML xem trước
  const khoi = (s) => s.split(/\n{2,}/).map((b) => {
    const l = b.split('\n'), m = l[0].match(/^##(TC|PP|CY|VD|ĐL|ĐN|NX)\s*(.*)$/)
    const nhan = { TC: 'Kiến thức cần nhớ', PP: 'Phương pháp giải', CY: 'Chú ý', VD: 'Ví dụ', ĐN: 'Định nghĩa', ĐL: 'Định lý', NX: 'Nhận xét' }
    if (!m) return `<p>${mathHtml(b)}</p>`
    return `<div class="k ${m[1]}"><div class="tag">${nhan[m[1]]}${m[2] ? ' — ' + esc(m[2]) : ''}</div>${(m[1] === 'PP' ? ['<ol>', ...l.slice(1).map((x) => `<li>${mathHtml(x)}</li>`), '</ol>'] : l.slice(1).map((x) => `<div>${mathHtml(x).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')}</div>`)).join('')}</div>`
  }).join('')
  const vd = async (s) => {
    let h = esc(s).replace(/^##VD\s*\n/, '')
    const [de, ...giai] = s.replace(/^##VD\s*\n/, '').split(/\n(?=\*\*Hướng dẫn giải:\*\*)/)
    const phan = (giai.join('\n') || '').split(/\n{2,}/)
    const dong = []
    for (const p of phan) {
      const im = p.match(/!\[[^\]]*\]\(([^)]+)\)/)
      if (im) { const u = await imgDataUri(im[1]); dong.push(u ? `<img src="${u}" alt="sơ đồ">` : '<i>(sơ đồ)</i>') } else dong.push(`<div>${mathHtml(p).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')}</div>`)
    }
    return `<div class="k VD"><div class="tag">Ví dụ</div>${de.split('\n').map((x) => `<div>${mathHtml(x)}</div>`).join('')}</div><div class="giai">${dong.join('')}</div>`
  }
  let phanDang = ''
  const tenN = Object.fromEntries((await q(`select id, ten from dai_bdm_nhom where chuyen_de_id = 'NCH00516'`)).map((x) => [x.id, x.ten]))
  const nhomCua = Object.fromEntries((await q(`select d.id, d.nhom_id from dai_bdm_dang_bai d where d.id = any($1)`, [Object.keys(DANG)])).map((x) => [x.id, x.nhom_id]))
  let nhomHienTai = null
  for (const [id, v] of Object.entries(DANG)) {
    const b = bao.dang.find((x) => x.id === id)
    if (nhomCua[id] !== nhomHienTai) { nhomHienTai = nhomCua[id]; phanDang += `<h2>Nhóm: ${esc(tenN[nhomHienTai])}</h2><div class="lt">${khoi(NHOM[nhomHienTai].ly_thuyet)}</div>` }
    phanDang += `<section><h3>${esc(b.ten)} <small>${id}</small> <span class="nguon ${v.nguon.startsWith('sach') ? 's' : 'm'}">${esc(v.nguon)}</span></h3><div class="lt">${khoi(v.ly_thuyet)}</div>${await vd(v.vi_du)}</section>`
  }
  writeFileSync(join(GOC, 'reports', 'ban-do-4t-tbc-ly-thuyet-vi-du.html'), `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>4T Trung bình cộng — lý thuyết · ví dụ</title><style>${katexCss()}
:root{--bg:#fafafb;--c:#fff;--tx:#1f2937;--mu:#6b7280;--ln:#e5e7eb}@media(prefers-color-scheme:dark){:root{--bg:#0f1117;--c:#181b24;--tx:#e5e7eb;--mu:#9ca3af;--ln:#2a2f3a}}
body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.6 system-ui,"Segoe UI",sans-serif;padding:16px}main{max-width:860px;margin:0 auto}h1{font-size:21px}h2{font-size:18px;margin-top:34px;border-top:2px solid var(--ln);padding-top:14px}h3{font-size:16px;margin:22px 0 6px}small{color:var(--mu);font-weight:400}
section{background:var(--c);border:1px solid var(--ln);border-radius:12px;padding:6px 14px 12px;margin:12px 0}.k{border:2px solid #7c5cbf;border-radius:12px;padding:10px 12px 6px;margin:14px 0 8px;position:relative}.k .tag{position:absolute;top:-12px;left:12px;background:#7c5cbf;color:#fff;font-size:12px;font-weight:600;padding:1px 10px;border-radius:999px}
.k.TC{border-color:#2D9CDB}.k.TC .tag{background:#2D9CDB}.k.PP{border-color:#6b7280}.k.PP .tag{background:#6b7280}.k.CY{border-color:#e08a2e}.k.CY .tag{background:#e08a2e}.k.VD{border-color:#b23a72}.k.VD .tag{background:#b23a72}
ol{margin:4px 0 4px 18px;padding:0}.giai{padding:4px 8px}.giai div{margin:4px 0}img{max-width:100%;background:#fff;border:1px solid var(--ln);border-radius:8px;margin:4px 0}.nguon{font-size:11px;padding:1px 8px;border-radius:999px;color:#fff;margin-left:6px;vertical-align:2px}.nguon.s{background:#059669}.nguon.m{background:#d97706}
@media(max-width:600px){body{padding:12px}}</style></head><body><main><h1>Chuyên đề Trung bình cộng (4T) — lý thuyết &amp; ví dụ điền từ sách</h1>
<p>Nguồn: <i>Toán arc 4 quyển 1</i>, Chuyên đề 13. Nhãn <span class="nguon s">sách</span> = lấy nguyên ví dụ sách; <span class="nguon m">mô phỏng</span> = sách không có ví dụ cho dạng này, Claude dựng theo khuôn sách (đảo chiều bài sách). Chỉ điền ô TRỐNG; mô tả dạng của Thùy giữ nguyên.</p>${phanDang}</main></body></html>`)
  console.log('→ reports/ban-do-4t-tbc-ly-thuyet-vi-du.html')
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('✘', e.message); process.exitCode = 1 } finally { await db.end() }
