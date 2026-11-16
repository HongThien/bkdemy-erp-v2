// Nội dung 3 bài Hình–Học K7 "Thẳng hàng" (HH00170–172) từ PDF "thẳng hàng.pdf" của Thùy (16/11): mô tả · lý thuyết · ví dụ.
//   node scripts/hinh-k7-thang-hang-noidung.mjs          # dựng HTML xem trước (không đụng DB)
//   node scripts/hinh-k7-thang-hang-noidung.mjs --ghi    # ghi DB (CHỈ khi Thùy nói "ghi")
// Format theo spec-format-noidung: ##ĐL/ĐN/TC/CY/PP · ví dụ = ##VD + "Bài giải:" · dòng ngắn · (gt)/(cmt) · không dòng trống thừa.
import pg from 'pg'
import { writeFileSync } from 'node:fs'
import { bien } from './kho/cau-hinh.mjs'

const BAI = [
  {
    ten: 'Phương pháp cùng đường',
    mo_ta: String.raw`Câu chứng minh ba điểm thẳng hàng bằng cách chỉ ra ba điểm cùng nằm trên một đường thẳng cho trước.
Ở lớp 7, đường thẳng cho trước là tia phân giác của một góc (chứng minh hai tia cùng là tia phân giác của góc đó) hoặc đường trung trực của một đoạn thẳng (chứng minh các điểm cách đều hai đầu đoạn thẳng, hoặc là trung điểm của nó).`,
    ly_thuyet: String.raw`##PP Phương pháp "cùng đường"
Để chứng minh ba điểm $A, D, I$ thẳng hàng, ta chứng minh ba điểm đó cùng thuộc một đường thẳng cho trước.
Ở lớp 7, đường thẳng này là tia phân giác của một góc hoặc đường trung trực của một đoạn thẳng.

##PP Loại 1: Đường phân giác
Để chứng minh $A, D, I$ thẳng hàng, ta chứng minh $AD$ và $AI$ cùng là tia phân giác của một góc có đỉnh $A$.
Mỗi góc chỉ có một tia phân giác nên hai tia $AD$, $AI$ trùng nhau.

##PP Loại 2: Đường trung trực
Để chứng minh $A, D, I$ thẳng hàng, ta chứng minh $A, D, I$ cùng thuộc đường trung trực của một đoạn thẳng.
Điểm cách đều hai đầu của một đoạn thẳng thì thuộc đường trung trực của đoạn thẳng đó.
Trung điểm của một đoạn thẳng cũng thuộc đường trung trực của đoạn thẳng đó.`,
    vi_du: String.raw`##VD
Cho $\triangle ABC$ có $AB=AC$. $AD$ là tia phân giác của $\widehat{BAC}$ ($D$ thuộc $BC$). $I$ là điểm nằm trong tam giác sao cho $BI=CI$. Chứng minh $A, I, D$ thẳng hàng.

Bài giải:
Xét $\triangle ABI$ và $\triangle ACI$ có:
$AB=AC$ (gt);
$BI=CI$ (gt);
$AI$ chung.
Do đó $\triangle ABI=\triangle ACI$ (c.c.c).
Suy ra $\widehat{BAI}=\widehat{CAI}$ (hai góc tương ứng).
Nên $AI$ là tia phân giác của $\widehat{BAC}$.
Mà $AD$ cũng là tia phân giác của $\widehat{BAC}$ (gt)
nên $A, I, D$ thẳng hàng.

##VD
Cho $\triangle ABC$ có $AB=AC$. Gọi $D$ là trung điểm của $BC$. $I$ là điểm nằm trong tam giác sao cho $IB=IC$. Chứng minh $A, D, I$ thẳng hàng.

Bài giải:
Vì $AB=AC$ (gt)
nên $A$ thuộc đường trung trực của $BC$.
Vì $IB=IC$ (gt)
nên $I$ thuộc đường trung trực của $BC$.
Vì $DB=DC$ (gt)
nên $D$ thuộc đường trung trực của $BC$.
Vậy $A, D, I$ cùng thuộc đường trung trực của $BC$
nên $A, D, I$ thẳng hàng.`,
  },
  {
    ten: 'Phương pháp cộng góc',
    mo_ta: String.raw`Câu chứng minh ba điểm thẳng hàng bằng cách chứng minh một góc bằng $180^\circ$: hai góc kề nhau có tổng $180^\circ$ thì hai tia ngoài cùng đối nhau.
Bài tiêu biểu là hai góc đối đỉnh bằng nhau dẫn đến ba điểm thẳng hàng; thường dùng thêm hai tam giác bằng nhau để có cặp góc bằng nhau, rồi cộng với góc kề bù.`,
    ly_thuyet: String.raw`##PP Phương pháp cộng góc
Để chứng minh ba điểm $A, M, D$ thẳng hàng, ta chứng minh $\widehat{AMD}=180^\circ$.
Cách khác: lấy một tia $Mx$ và chứng minh $\widehat{AMx}+\widehat{DMx}=180^\circ$.

##TC Hai góc kề nhau có tổng bằng $180^\circ$
Nếu $\widehat{AMx}$ và $\widehat{DMx}$ là hai góc kề nhau ($A$, $D$ nằm ở hai phía của đường thẳng chứa tia $Mx$) và $\widehat{AMx}+\widehat{DMx}=180^\circ$ thì hai tia $MA$, $MD$ đối nhau.
Khi đó $A, M, D$ thẳng hàng.

##PP Bài toán hai góc ở vị trí đối đỉnh
Bài toán tiêu biểu nhất của phương pháp này là hai góc ở vị trí đối đỉnh bằng nhau dẫn đến ba điểm thẳng hàng.
Ta chứng minh một cặp góc bằng nhau (bằng giả thiết hoặc qua tam giác bằng nhau), cộng với góc kề bù để được tổng bằng $180^\circ$.

##CY
Phải nói rõ hai điểm cần chứng minh nằm ở hai phía khác nhau của đường thẳng đã cho, để tia chung nằm giữa hai tia còn lại.`,
    vi_du: String.raw`##VD
Cho ba điểm $A, M, B$ thẳng hàng ($M$ nằm giữa $A$ và $B$). Vẽ điểm $C$ và điểm $D$ nằm ở hai phía khác nhau của đường thẳng $AB$ sao cho $\widehat{AMC}=\widehat{BMD}$. Chứng minh $C, M, D$ thẳng hàng.

Bài giải:
Vì $A, M, B$ thẳng hàng nên
$\widehat{AMC}+\widehat{BMC}=180^\circ$ (hai góc kề bù).
Mà $\widehat{AMC}=\widehat{BMD}$ (gt)
nên $\widehat{BMD}+\widehat{BMC}=180^\circ$.
Vì $C$, $D$ ở hai phía của $AB$ nên tia $MB$ nằm giữa hai tia $MC$, $MD$.
Do đó $\widehat{CMD}=\widehat{BMD}+\widehat{BMC}=180^\circ$.
Vậy $C, M, D$ thẳng hàng.

##VD
Cho $\triangle ABC$ có $M$ là trung điểm của $BC$. Qua $C$ vẽ đường thẳng song song với $AB$. Lấy $D$ trên đường thẳng vừa vẽ sao cho $CD=AB$ ($D$ và $A$ nằm ở hai phía của đường thẳng $BC$). Chứng minh $A, M, D$ thẳng hàng.

Bài giải:
Vì $AB\parallel CD$ (gt)
nên $\widehat{ABM}=\widehat{DCM}$ (hai góc so le trong).
Xét $\triangle ABM$ và $\triangle DCM$ có:
$AB=CD$ (gt);
$\widehat{ABM}=\widehat{DCM}$ (cmt);
$MB=MC$ (gt).
Do đó $\triangle ABM=\triangle DCM$ (c.g.c).
Suy ra $\widehat{AMB}=\widehat{CMD}$ (hai góc tương ứng).
Mà $\widehat{AMB}+\widehat{AMC}=180^\circ$ (hai góc kề bù)
nên $\widehat{CMD}+\widehat{AMC}=180^\circ$.
Vì $A$, $D$ ở hai phía của $BC$ nên tia $MC$ nằm giữa hai tia $MA$, $MD$.
Do đó $\widehat{AMD}=\widehat{AMC}+\widehat{CMD}=180^\circ$.
Vậy $A, M, D$ thẳng hàng.`,
  },
  {
    ten: 'Dùng tiên đề Euclide',
    mo_ta: String.raw`Câu chứng minh ba điểm thẳng hàng bằng cách chứng minh hai đường thẳng đi qua cùng một điểm và cùng song song với một đường thẳng thứ ba, nên hai đường thẳng đó trùng nhau (tiên đề Ơ-clit).
Thường dùng hai cặp tam giác bằng nhau để có các cặp góc so le trong bằng nhau, suy ra hai đường song song.`,
    ly_thuyet: String.raw`##ĐL Tiên đề Ơ-clit
Qua một điểm nằm ngoài một đường thẳng cho trước chỉ có một và chỉ một đường thẳng song song với đường thẳng đã cho.

##TC Hệ quả của tiên đề Ơ-clit
Nếu hai đường thẳng cùng đi qua một điểm và cùng song song với một đường thẳng thì hai đường thẳng này trùng nhau.
Nếu $AD\parallel BC$ và $AE\parallel BC$ thì đường thẳng $AD$ và đường thẳng $AE$ trùng nhau.
Nghĩa là $A, D, E$ thẳng hàng.

##PP Phương pháp sử dụng tiên đề Ơ-clit
Để chứng minh $A, D, E$ thẳng hàng, ta chứng minh $AD\parallel BC$ và $AE\parallel BC$.
Thường chứng minh qua hai tam giác bằng nhau để có hai góc so le trong bằng nhau.
Kết luận $A, D, E$ thẳng hàng (theo tiên đề Ơ-clit).`,
    vi_du: String.raw`##VD
Cho $\triangle ABC$. Gọi $M$, $N$ lần lượt là trung điểm của $AB$, $AC$. Lấy $D$, $E$ sao cho $M$ là trung điểm của $CD$ và $N$ là trung điểm của $BE$. Chứng minh $A, D, E$ thẳng hàng.

Bài giải:
Xét $\triangle AMD$ và $\triangle BMC$ có:
$MA=MB$ (gt);
$MD=MC$ (gt);
$\widehat{AMD}=\widehat{BMC}$ (hai góc đối đỉnh).
Do đó $\triangle AMD=\triangle BMC$ (c.g.c).
Suy ra $\widehat{ADM}=\widehat{BCM}$ (hai góc tương ứng).
Mà hai góc này ở vị trí so le trong
nên $AD\parallel BC$ (1).
Xét $\triangle ANE$ và $\triangle CNB$ có:
$NA=NC$ (gt);
$NE=NB$ (gt);
$\widehat{ANE}=\widehat{CNB}$ (hai góc đối đỉnh).
Do đó $\triangle ANE=\triangle CNB$ (c.g.c).
Suy ra $\widehat{AEN}=\widehat{CBN}$ (hai góc tương ứng).
Mà hai góc này ở vị trí so le trong
nên $AE\parallel BC$ (2).
Từ (1) và (2) suy ra $A, D, E$ thẳng hàng (theo tiên đề Ơ-clit).`,
  },
]

// kiểm cú pháp: $ chẵn, không dòng trống ngoài ranh giới đoạn, mọi đoạn lý thuyết mở bằng thẻ
for (const b of BAI) for (const [k, v] of [['mo_ta', b.mo_ta], ['ly_thuyet', b.ly_thuyet], ['vi_du', b.vi_du]]) {
  if ((v.match(/\$/g) || []).length % 2) throw new Error(`${b.ten}/${k}: số dấu $ lẻ`)
  if (/\n\n\n/.test(v)) throw new Error(`${b.ten}/${k}: 2 dòng trống liền`)
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)) throw new Error(`${b.ten}/${k}: ký tự điều khiển`)
  for (const m of v.matchAll(/\$([^$]+)\$/g)) if (/(?<![\\a-zA-Z])(widehat|triangle|parallel|circ|Rightarrow)\b/.test(m[1])) throw new Error(`${b.ten}/${k}: lệnh LaTeX mất \\ ở ${m[1]}`)
  if (k !== 'mo_ta') for (const d of v.split(/\n[ \t]*\n/)) if (k === 'ly_thuyet' && !/^##(ĐL|ĐN|TC|CY|PP)/.test(d.trim())) throw new Error(`${b.ten}: đoạn lý thuyết thiếu thẻ: ${d.slice(0, 40)}`)
}

if (!process.argv.includes('--ghi')) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  let h = `<!doctype html><meta charset=utf-8><title>Thẳng hàng — K7 Hình–Học (nháp)</title>
<link rel=stylesheet href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"><script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}]})"></script>
<style>body{font:15px/1.65 system-ui;max-width:880px;margin:20px auto;padding:0 12px}h2{margin-top:34px;border-bottom:2px solid #36c}h3{margin:18px 0 4px;color:#36c}pre{white-space:pre-wrap;font:inherit;background:#f6f8fb;border:1px solid #dde;border-radius:8px;padding:10px 14px;margin:6px 0}.n{color:#a60;font-size:13px}</style>
<h1>Chuyên đề Thẳng hàng — lớp 7 Hình–Học (NHÁP, chưa ghi DB)</h1><p class=n>Nguồn: thẳng hàng.pdf. Chép đúng 3 phần của file; chỉ chỉnh trình bày (dòng ngắn, (gt)/(cmt)) và bổ sung điều kiện còn thiếu (đánh dấu ở cuối trang). Hình trong ví dụ chưa gắn — vẽ bằng code sau khi bạn duyệt chữ.</p>`
  BAI.forEach((b, i) => { h += `<h2>${i + 1}. ${esc(b.ten)}</h2><h3>Mô tả dạng</h3><pre>${esc(b.mo_ta)}</pre><h3>Lý thuyết</h3><pre>${esc(b.ly_thuyet)}</pre><h3>Ví dụ</h3><pre>${esc(b.vi_du)}</pre>` })
  h += `<h2>Chỗ mình bổ sung so với PDF (bạn xem có đúng ý không)</h2><ol class=n>
<li>Cộng góc – Ví dụ 1: thêm "M nằm giữa A và B" và "C, D ở hai phía của AB" — thiếu hai điều kiện này thì đề không đúng với mọi hình; thêm dòng "tia MB nằm giữa MC, MD" trước khi cộng góc.</li>
<li>Cộng góc – Ví dụ 2: thêm dòng "tia MC nằm giữa MA, MD vì A, D ở hai phía của BC" (PDF chỉ ghi "D và A nằm ở 2 phía" ở đề).</li>
<li>Cùng đường – Ví dụ 1: thêm "(D thuộc BC)"; Ví dụ 2 dùng "điểm cách đều hai đầu mút thì thuộc đường trung trực" (chiều đảo của tính chất trung trực — PDF dùng, nhưng K7 bản đồ chưa chắc đã dạy).</li>
<li>Tiên đề Ơ-clit: tên bài giữ "Euclide" như bạn gõ; nội dung viết "Ơ-clit" như PDF và các bài khác của bản đồ.</li></ol>`
  writeFileSync('kho-rules/hinh/k7-thang-hang-nhap.html', h)
  console.log('✔ đã dựng kho-rules/hinh/k7-thang-hang-nhap.html (chưa ghi DB)')
} else {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
  await c.connect()
  try {
    await c.query('begin')
    for (const b of BAI) {
      const r = (await c.query(`select ma_bai, mo_ta, vi_du from hinh_hoc_bai where khoi = '7' and ten_bai = $1`, [b.ten])).rows
      if (r.length !== 1) throw new Error(`${b.ten}: tìm được ${r.length} bài (cần đúng 1)`)
      if (r[0].mo_ta || r[0].vi_du) throw new Error(`${b.ten} (${r[0].ma_bai}) đã có mô tả/ví dụ — dừng, không ghi đè`)
      await c.query(`update hinh_hoc_bai set mo_ta = $2, vi_du = $3 where ma_bai = $1`, [r[0].ma_bai, b.mo_ta, b.vi_du])
      await c.query(`insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung) values ($1, $2)`, [r[0].ma_bai, b.ly_thuyet])
      console.log(`  ${r[0].ma_bai} ${b.ten}: mô tả + lý thuyết + ví dụ`)
    }
    await c.query('commit'); console.log('✔ ĐÃ GHI')
  } catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
  await c.end()
}
