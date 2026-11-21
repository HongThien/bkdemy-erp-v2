// Lời giải 59 bài mới của 4 chuỗi Hình–Luyện K7 "Tam giác bằng nhau" (MH.126 · 130 · 131 · 132) — cây dựng 21/11 theo "Mô hình 7.docx".
//   node scripts/kho/hl-loi-giai-k7-tam-giac-v1.mjs          ⇒ chạy thử (in số bài, kiểm khuôn) rồi ROLLBACK
//   node scripts/kho/hl-loi-giai-k7-tam-giac-v1.mjs --ghi    ⇒ commit
// Ghi qua fn_hl_sua_bai (giữ nguyên đề, hình, tiền đề; chỉ điền lời giải của cách mặc định). Không đè lời giải đã có (bài có lời giải ⇒ dừng).
// Luật: spec-giai-bai.md — Hình chung (dòng ngắn + căn cứ, R1) + Khối 7 Hình (whitelist: c.c.c · c.g.c · g.c.g · tam giác vuông · tam giác cân · đường trung trực
// chỉ ĐỊNH NGHĨA; ba bài thẳng hàng HH00170–172: hai tia cùng là phân giác thì trùng · cộng góc · tiên đề Ơ-clit). Mỗi khẳng định đã kiểm bằng toạ độ: scripts/kho/hl-loi-giai-k7-tam-giac-kiem.mjs.
// "Bài N" trong lời giải = số hiển thị (B…) đọc từ DB lúc ghi (fn_hl_so_hien_thi), không gõ tay.
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

// ── số hiển thị của mọi bài trong 4 cây: ma → "Bài N" ──
const goc = (await q(`select id, ma from hinh_mo_hinh where khoi = '7' and phan = 'luyen' and la_mo_hinh and ma in ('MH.126','MH.130','MH.131','MH.132')`))
const SOHT = {}   // "126" → tập số hiển thị B1…Bn của cây đó
for (const g of goc) SOHT[g.ma.replace('MH.', '')] = new Set((await q(`select so from fn_hl_so_hien_thi($1)`, [g.id])).map((r) => r.so))
const B = (mh, k) => { if (!SOHT[mh]?.has('B' + k)) throw new Error(`cây ${mh} không có B${k}`); return 'Bài ' + k }   // k = SỐ HIỂN THỊ (không phải đuôi mã BT)
const L = (...d) => d.join('\n')

// ── khối dùng chung ──
// Hai góc tương ứng ở A và D bằng nhau (△AMX = △DMY) ⇒ X, M, Y thẳng hàng (cộng góc, HH00171). cX, cY: đỉnh B hoặc C cho biết X, Y cùng phía với đỉnh nào đối với AD.
const congThang = (X, Y, cX, cY) => L(
  String.raw`Suy ra $\widehat{AM${X}}=\widehat{DM${Y}}$ (hai góc tương ứng).`,
  String.raw`Vì $M$ nằm giữa $A$ và $D$ nên`,
  String.raw`$\widehat{AM${X}}+\widehat{${X}MD}=180^\circ$ (hai góc kề bù).`,
  String.raw`Suy ra $\widehat{DM${Y}}+\widehat{${X}MD}=180^\circ$.`,
  String.raw`$${X}$ cùng phía với $${cX}$, $${Y}$ cùng phía với $${cY}$ đối với $AD$,`,
  String.raw`mà $${cX}$, $${cY}$ khác phía đối với $AD$ ($M$ nằm giữa $B$, $C$)`,
  String.raw`nên $${X}$, $${Y}$ nằm khác phía đối với đường thẳng $AD$.`,
  String.raw`Hai góc $\widehat{${X}MD}$, $\widehat{DM${Y}}$ có tổng $180^\circ$`,
  String.raw`nên $M${X}$ và $M${Y}$ là hai tia đối nhau.`,
  String.raw`Vậy $${X}$, $M$, $${Y}$ thẳng hàng.`)
// MH.132: DE ∥ BC từ AD = AE
const deSongSong = L(
  String.raw`Vì $AD=AE$ (cmt) nên $\triangle ADE$ cân tại $A$.`,
  String.raw`Suy ra $\widehat{AED}=\dfrac{180^\circ-\widehat{A}}{2}$ (tổng ba góc, tam giác cân).`,
  String.raw`$\triangle ABC$ cân tại $A$ (gt)`,
  String.raw`nên $\widehat{ABC}=\dfrac{180^\circ-\widehat{A}}{2}$ (tổng ba góc, tam giác cân).`,
  String.raw`Do đó $\widehat{AED}=\widehat{ABC}$.`,
  String.raw`Hai góc này ở vị trí đồng vị ($E$ thuộc cạnh $AB$)`,
  String.raw`nên $DE\parallel BC$ (dấu hiệu nhận biết hai đường thẳng song song).`)

const LG = {}

// ═════════════ MH.126 — Phân giác trong tam giác vuông ═════════════
LG['BT.07.126.04'] = L(
  String.raw`Vì $E$ thuộc cạnh $BC$ nên tia $BE$ trùng tia $BC$.`,
  String.raw`Mà $BD$ là tia phân giác của $\widehat{ABC}$ (gt)`,
  String.raw`nên $\widehat{ABD}=\widehat{EBD}$.`,
  String.raw`Vì $D$ thuộc cạnh $AC$ nên $\widehat{BAD}=\widehat{BAC}=90^\circ$ (gt)`,
  String.raw`nên $\triangle ABD$ vuông tại $A$.`,
  String.raw`$DE\perp BC$ (gt) nên $\triangle EBD$ vuông tại $E$.`,
  String.raw`Xét hai tam giác vuông $ABD$ và $EBD$ có:`,
  String.raw`$BD$ là cạnh chung;`,
  String.raw`$\widehat{ABD}=\widehat{EBD}$ (cmt)`,
  String.raw`Do đó $\triangle ABD=\triangle EBD$ (ch - gn).`)
LG['BT.07.126.05'] = L(
  String.raw`Vì $D$ thuộc cạnh $AC$ nên $\widehat{BAD}=\widehat{BAC}=90^\circ$ (gt)`,
  String.raw`nên $\triangle ABD$ vuông tại $A$.`,
  String.raw`$DE\perp BC$ (gt) nên $\triangle EBD$ vuông tại $E$.`,
  String.raw`Xét hai tam giác vuông $ABD$ và $EBD$ có:`,
  String.raw`$BD$ là cạnh chung;`,
  String.raw`$BA=BE$ (gt)`,
  String.raw`Do đó $\triangle ABD=\triangle EBD$ (ch - cgv).`)
LG['BT.07.126.06'] = L(
  String.raw`Vì $E$ thuộc cạnh $BC$ nên tia $BE$ trùng tia $BC$.`,
  String.raw`Mà $BD$ là tia phân giác của $\widehat{ABC}$ (gt)`,
  String.raw`nên $\widehat{ABD}=\widehat{EBD}$.`,
  String.raw`Xét $\triangle ABD$ và $\triangle EBD$ có:`,
  String.raw`$BA=BE$ (gt);`,
  String.raw`$\widehat{ABD}=\widehat{EBD}$ (cmt);`,
  String.raw`$BD$ là cạnh chung`,
  String.raw`Do đó $\triangle ABD=\triangle EBD$ (c.g.c).`)
const nh1 = `${B('126', 1)}–3`   // nhóm 1: ba thành viên Bài 1–3 (đầu ra △ABD = △EBD)
// B4: BD là trung trực của AE
LG['BT.07.126.07'] = L(
  String.raw`Gọi $H$ là giao điểm của $BD$ và $AE$.`,
  String.raw`Vì tia $BD$ nằm giữa hai tia $BA$, $BE$ (tia phân giác)`,
  String.raw`nên $H$ nằm giữa $A$ và $E$, và tia $BH$ trùng tia $BD$.`,
  String.raw`Do đó $\widehat{ABH}=\widehat{EBH}$ (tia phân giác).`,
  String.raw`Xét $\triangle ABH$ và $\triangle EBH$ có:`,
  String.raw`$BA=BE$ (gt);`,
  String.raw`$\widehat{ABH}=\widehat{EBH}$ (cmt);`,
  String.raw`$BH$ là cạnh chung`,
  String.raw`nên $\triangle ABH=\triangle EBH$ (c.g.c).`,
  String.raw`Suy ra $HA=HE$ (hai cạnh tương ứng)`,
  String.raw`và $\widehat{AHB}=\widehat{EHB}$ (hai góc tương ứng).`,
  String.raw`Mà $\widehat{AHB}+\widehat{EHB}=180^\circ$ (hai góc kề bù)`,
  String.raw`nên $2.\widehat{AHB}=180^\circ$, suy ra $\widehat{AHB}=90^\circ$.`,
  String.raw`Do đó $BD\perp AE$ tại $H$.`,
  String.raw`$H$ nằm giữa $A$, $E$ và $HA=HE$ nên $H$ là trung điểm của $AE$.`,
  String.raw`Vậy $BD$ là đường trung trực của đoạn thẳng $AE$`,
  String.raw`(định nghĩa đường trung trực).`)
LG['BT.07.126.08'] = L(
  String.raw`Vì $\triangle ABD=\triangle EBD$ (${nh1})`,
  String.raw`nên $DA=DE$ (hai cạnh tương ứng).`,
  String.raw`Vậy $\triangle ADE$ cân tại $D$ (định nghĩa tam giác cân).`)
LG['BT.07.126.09'] = L(
  String.raw`Vì $\triangle ABD=\triangle EBD$ (${nh1})`,
  String.raw`nên $\widehat{ADB}=\widehat{EDB}$ (hai góc tương ứng).`,
  String.raw`Vì tia $BD$ nằm giữa hai tia $BA$, $BE$ (tia phân giác)`,
  String.raw`nên $A$, $E$ nằm khác phía đối với đường thẳng $BD$.`,
  String.raw`Hai tia $DA$, $DE$ nằm khác phía đối với $DB$ và tạo với tia $DB$`,
  String.raw`hai góc bằng nhau là $\widehat{ADB}$, $\widehat{EDB}$.`,
  String.raw`Vậy $DB$ là tia phân giác của góc $ADE$.`)
// Kiểu 1: F = DE ∩ AB
LG['BT.07.126.10'] = L(
  String.raw`Vì $F$ thuộc đường thẳng $AB$ và $AB\perp AC$ nên $DA\perp AF$,`,
  String.raw`suy ra $\widehat{DAF}=90^\circ$.`,
  String.raw`$DE\perp BC$ (gt) nên $\widehat{DEC}=90^\circ$.`,
  String.raw`Do đó $\widehat{DAF}=\widehat{DEC}$.`,
  String.raw`$D$ nằm giữa $A$ và $C$; $D$ nằm giữa $E$ và $F$ (theo hình)`,
  String.raw`nên $\widehat{ADF}=\widehat{EDC}$ (hai góc đối đỉnh).`,
  String.raw`$DA=DE$ (${B('126', 5)})`,
  String.raw`Xét $\triangle ADF$ và $\triangle EDC$ có:`,
  String.raw`$\widehat{DAF}=\widehat{DEC}$ (cmt);`,
  String.raw`$DA=DE$ (cmt);`,
  String.raw`$\widehat{ADF}=\widehat{EDC}$ (cmt)`,
  String.raw`Do đó $\triangle ADF=\triangle EDC$ (g.c.g).`)
LG['BT.07.126.11'] = L(
  String.raw`Vì $\triangle ADF=\triangle EDC$ (${B('126', 7)})`,
  String.raw`nên $AF=EC$ (hai cạnh tương ứng).`,
  String.raw`$A$ nằm giữa $B$ và $F$ (theo hình) nên $BF=BA+AF$.`,
  String.raw`$E$ nằm giữa $B$ và $C$ (gt) nên $BC=BE+EC$.`,
  String.raw`Mà $BA=BE$ (gt) và $AF=EC$ (cmt)`,
  String.raw`nên $BF=BC$.`,
  String.raw`Vậy $\triangle BFC$ cân tại $B$ (định nghĩa tam giác cân).`)
// Kiểu 2: F trên tia đối của tia AB, AF = CE
LG['BT.07.126.12'] = L(
  String.raw`Vì $F$ thuộc tia đối của tia $AB$ và $AB\perp AC$ nên $DA\perp AF$,`,
  String.raw`suy ra $\widehat{DAF}=90^\circ$.`,
  String.raw`$DE\perp BC$ (gt) nên $\widehat{DEC}=90^\circ$.`,
  String.raw`Do đó $\widehat{DAF}=\widehat{DEC}$.`,
  String.raw`$DA=DE$ (${B('126', 5)})`,
  String.raw`Xét $\triangle ADF$ và $\triangle EDC$ có:`,
  String.raw`$AF=EC$ (gt);`,
  String.raw`$\widehat{DAF}=\widehat{DEC}$ (cmt);`,
  String.raw`$AD=ED$ (cmt)`,
  String.raw`Do đó $\triangle ADF=\triangle EDC$ (c.g.c).`)
LG['BT.07.126.13'] = L(
  String.raw`$F$ thuộc tia đối của tia $AB$ nên $A$ nằm giữa $B$ và $F$.`,
  String.raw`Do đó $BF=BA+AF$.`,
  String.raw`$E$ nằm giữa $B$ và $C$ (gt) nên $BC=BE+EC$.`,
  String.raw`Mà $BA=BE$ (gt) và $AF=EC$ (gt)`,
  String.raw`nên $BF=BC$.`,
  String.raw`Vậy $\triangle BFC$ cân tại $B$ (định nghĩa tam giác cân).`)
// M trung điểm FC
LG['BT.07.126.14'] = L(
  String.raw`Vì $\triangle BFC$ cân tại $B$ (${B('126', 8)} hoặc ${B('126', 10)})`,
  String.raw`nên $BF=BC$.`,
  String.raw`$M$ là trung điểm của $FC$ (gt) nên $MF=MC$.`,
  String.raw`Xét $\triangle BFM$ và $\triangle BCM$ có:`,
  String.raw`$BF=BC$ (cmt);`,
  String.raw`$MF=MC$ (cmt);`,
  String.raw`$BM$ là cạnh chung`,
  String.raw`nên $\triangle BFM=\triangle BCM$ (c.c.c).`,
  String.raw`Suy ra $\widehat{FBM}=\widehat{CBM}$ (hai góc tương ứng).`,
  String.raw`$M$ nằm giữa $F$ và $C$ nên tia $BM$ nằm giữa hai tia $BF$, $BC$.`,
  String.raw`Mà tia $BF$ trùng tia $BA$ ($A$ nằm giữa $B$, $F$)`,
  String.raw`nên $BM$ là tia phân giác của $\widehat{ABC}$.`,
  String.raw`$BD$ cũng là tia phân giác của $\widehat{ABC}$ (gt)`,
  String.raw`nên hai tia $BM$ và $BD$ trùng nhau.`,
  String.raw`Vậy $B$, $D$, $M$ thẳng hàng.`)

// ═════════════ MH.130 — Phân giác trong tam giác nhọn (BA < BC) ═════════════
LG['BT.07.130.01'] = L(
  String.raw`Vì $E$ thuộc cạnh $BC$ nên tia $BE$ trùng tia $BC$.`,
  String.raw`Mà $BD$ là tia phân giác của $\widehat{ABC}$ (gt)`,
  String.raw`nên $\widehat{ABD}=\widehat{EBD}$.`,
  String.raw`Xét $\triangle ABD$ và $\triangle EBD$ có:`,
  String.raw`$BA=BE$ (gt);`,
  String.raw`$\widehat{ABD}=\widehat{EBD}$ (cmt);`,
  String.raw`$BD$ là cạnh chung`,
  String.raw`Do đó $\triangle ABD=\triangle EBD$ (c.g.c).`)
LG['BT.07.130.02'] = L(
  String.raw`Gọi $H$ là giao điểm của $BD$ và $AE$.`,
  String.raw`Vì tia $BD$ nằm giữa hai tia $BA$, $BE$ (tia phân giác)`,
  String.raw`nên $H$ nằm giữa $A$ và $E$, và tia $BH$ trùng tia $BD$.`,
  String.raw`Do đó $\widehat{ABH}=\widehat{EBH}$ (tia phân giác).`,
  String.raw`Xét $\triangle ABH$ và $\triangle EBH$ có:`,
  String.raw`$BA=BE$ (gt);`,
  String.raw`$\widehat{ABH}=\widehat{EBH}$ (cmt);`,
  String.raw`$BH$ là cạnh chung`,
  String.raw`nên $\triangle ABH=\triangle EBH$ (c.g.c).`,
  String.raw`Suy ra $HA=HE$ (hai cạnh tương ứng)`,
  String.raw`và $\widehat{AHB}=\widehat{EHB}$ (hai góc tương ứng).`,
  String.raw`Mà $\widehat{AHB}+\widehat{EHB}=180^\circ$ (hai góc kề bù)`,
  String.raw`nên $2.\widehat{AHB}=180^\circ$, suy ra $\widehat{AHB}=90^\circ$.`,
  String.raw`Do đó $BD\perp AE$ tại $H$.`,
  String.raw`$H$ nằm giữa $A$, $E$ và $HA=HE$ nên $H$ là trung điểm của $AE$.`,
  String.raw`Vậy $BD$ là đường trung trực của đoạn thẳng $AE$`,
  String.raw`(định nghĩa đường trung trực).`)
LG['BT.07.130.03'] = L(
  String.raw`Vì $\triangle ABD=\triangle EBD$ (${B('130', 1)})`,
  String.raw`nên $DA=DE$ (hai cạnh tương ứng).`,
  String.raw`Vậy $\triangle ADE$ cân tại $D$ (định nghĩa tam giác cân).`)
LG['BT.07.130.04'] = L(
  String.raw`Vì $\triangle ABD=\triangle EBD$ (${B('130', 1)})`,
  String.raw`nên $\widehat{ADB}=\widehat{EDB}$ (hai góc tương ứng).`,
  String.raw`Vì tia $BD$ nằm giữa hai tia $BA$, $BE$ (tia phân giác)`,
  String.raw`nên $A$, $E$ nằm khác phía đối với đường thẳng $BD$.`,
  String.raw`Hai tia $DA$, $DE$ nằm khác phía đối với $DB$ và tạo với tia $DB$`,
  String.raw`hai góc bằng nhau là $\widehat{ADB}$, $\widehat{EDB}$.`,
  String.raw`Vậy $DB$ là tia phân giác của góc $ADE$.`)
LG['BT.07.130.05'] = L(
  String.raw`Vì $\triangle ABD=\triangle EBD$ (${B('130', 1)}) nên`,
  String.raw`$\widehat{BAD}=\widehat{BED}$ (hai góc tương ứng).`,
  String.raw`$A$ nằm giữa $B$ và $F$ (theo hình) nên`,
  String.raw`$\widehat{BAD}+\widehat{DAF}=180^\circ$ (hai góc kề bù).`,
  String.raw`$E$ nằm giữa $B$ và $C$ (gt) nên`,
  String.raw`$\widehat{BED}+\widehat{DEC}=180^\circ$ (hai góc kề bù).`,
  String.raw`Mà $\widehat{BAD}=\widehat{BED}$ (cmt)`,
  String.raw`nên $\widehat{DAF}=\widehat{DEC}$ (cùng bù với hai góc bằng nhau).`,
  String.raw`$D$ nằm giữa $A$ và $C$; $D$ nằm giữa $E$ và $F$ (theo hình)`,
  String.raw`nên $\widehat{ADF}=\widehat{EDC}$ (hai góc đối đỉnh).`,
  String.raw`$DA=DE$ (${B('130', 3)})`,
  String.raw`Xét $\triangle ADF$ và $\triangle EDC$ có:`,
  String.raw`$\widehat{DAF}=\widehat{DEC}$ (cmt);`,
  String.raw`$DA=DE$ (cmt);`,
  String.raw`$\widehat{ADF}=\widehat{EDC}$ (cmt)`,
  String.raw`Do đó $\triangle ADF=\triangle EDC$ (g.c.g).`)
LG['BT.07.130.06'] = L(
  String.raw`Vì $\triangle ADF=\triangle EDC$ (${B('130', 5)})`,
  String.raw`nên $AF=EC$ (hai cạnh tương ứng).`,
  String.raw`$A$ nằm giữa $B$ và $F$ (theo hình) nên $BF=BA+AF$.`,
  String.raw`$E$ nằm giữa $B$ và $C$ (gt) nên $BC=BE+EC$.`,
  String.raw`Mà $BA=BE$ (gt) và $AF=EC$ (cmt)`,
  String.raw`nên $BF=BC$.`,
  String.raw`Vậy $\triangle BFC$ cân tại $B$ (định nghĩa tam giác cân).`)
LG['BT.07.130.07'] = L(
  String.raw`Vì $\triangle BFC$ cân tại $B$ (${B('130', 6)})`,
  String.raw`nên $BF=BC$.`,
  String.raw`$M$ là trung điểm của $FC$ (gt) nên $MF=MC$.`,
  String.raw`Xét $\triangle BFM$ và $\triangle BCM$ có:`,
  String.raw`$BF=BC$ (cmt);`,
  String.raw`$MF=MC$ (cmt);`,
  String.raw`$BM$ là cạnh chung`,
  String.raw`nên $\triangle BFM=\triangle BCM$ (c.c.c).`,
  String.raw`Suy ra $\widehat{FBM}=\widehat{CBM}$ (hai góc tương ứng).`,
  String.raw`$M$ nằm giữa $F$ và $C$ nên tia $BM$ nằm giữa hai tia $BF$, $BC$.`,
  String.raw`Mà tia $BF$ trùng tia $BA$ ($A$ nằm giữa $B$, $F$)`,
  String.raw`nên $BM$ là tia phân giác của $\widehat{ABC}$.`,
  String.raw`$BD$ cũng là tia phân giác của $\widehat{ABC}$ (gt)`,
  String.raw`nên hai tia $BM$ và $BD$ trùng nhau.`,
  String.raw`Vậy $B$, $D$, $M$ thẳng hàng.`)

// ═════════════ MH.131 — Tam giác cụng đầu (M trung điểm BC, D thuộc tia đối của tia MA, MD = MA) ═════════════
LG['BT.07.131.01'] = L(
  String.raw`$M$ nằm giữa $A$, $D$ và nằm giữa $B$, $C$ nên`,
  String.raw`$\widehat{AMB}=\widehat{DMC}$ (hai góc đối đỉnh).`,
  String.raw`Xét $\triangle AMB$ và $\triangle DMC$ có:`,
  String.raw`$MA=MD$ (gt);`,
  String.raw`$\widehat{AMB}=\widehat{DMC}$ (cmt);`,
  String.raw`$MB=MC$ (gt, $M$ là trung điểm của $BC$)`,
  String.raw`Do đó $\triangle AMB=\triangle DMC$ (c.g.c).`)
LG['BT.07.131.02'] = L(
  String.raw`$M$ nằm giữa $A$, $D$ và nằm giữa $B$, $C$ nên`,
  String.raw`$\widehat{AMC}=\widehat{DMB}$ (hai góc đối đỉnh).`,
  String.raw`Xét $\triangle AMC$ và $\triangle DMB$ có:`,
  String.raw`$MA=MD$ (gt);`,
  String.raw`$\widehat{AMC}=\widehat{DMB}$ (cmt);`,
  String.raw`$MC=MB$ (gt, $M$ là trung điểm của $BC$)`,
  String.raw`Do đó $\triangle AMC=\triangle DMB$ (c.g.c).`)
LG['BT.07.131.03'] = L(
  String.raw`Vì $\triangle AMB=\triangle DMC$ (${B('131', 1)}) nên:`,
  String.raw`$AB=DC$ (hai cạnh tương ứng);`,
  String.raw`$\widehat{MAB}=\widehat{MDC}$ (hai góc tương ứng).`,
  String.raw`Hai góc $\widehat{MAB}$, $\widehat{MDC}$ ở vị trí so le trong`,
  String.raw`($B$, $C$ khác phía đối với $AD$ vì $M$ nằm giữa $B$, $C$)`,
  String.raw`nên $AB\parallel CD$ (dấu hiệu nhận biết hai đường thẳng song song).`,
  String.raw`Vậy $AB\parallel CD$ và $AB=CD$.`)
LG['BT.07.131.04'] = L(
  String.raw`Vì $\triangle AMC=\triangle DMB$ (${B('131', 2)}) nên:`,
  String.raw`$AC=DB$ (hai cạnh tương ứng);`,
  String.raw`$\widehat{MAC}=\widehat{MDB}$ (hai góc tương ứng).`,
  String.raw`Hai góc $\widehat{MAC}$, $\widehat{MDB}$ ở vị trí so le trong`,
  String.raw`($C$, $B$ khác phía đối với $AD$ vì $M$ nằm giữa $B$, $C$)`,
  String.raw`nên $AC\parallel BD$ (dấu hiệu nhận biết hai đường thẳng song song).`,
  String.raw`Vậy $AC\parallel BD$ và $AC=BD$.`)
// cặp AB, CD
LG['BT.07.131.05'] = L(
  String.raw`Vì $\triangle AMB=\triangle DMC$ (${B('131', 1)}) nên:`,
  String.raw`$AB=DC$ (hai cạnh tương ứng);`,
  String.raw`$\widehat{MAB}=\widehat{MDC}$ (hai góc tương ứng).`,
  String.raw`$E$, $F$ là trung điểm của $AB$, $DC$ (gt)`,
  String.raw`nên $AE=\dfrac{1}{2}AB$ và $DF=\dfrac{1}{2}DC$ (định nghĩa trung điểm).`,
  String.raw`Suy ra $AE=DF$.`,
  String.raw`$E$ thuộc cạnh $AB$ nên tia $AE$ trùng tia $AB$;`,
  String.raw`$F$ thuộc cạnh $DC$ nên tia $DF$ trùng tia $DC$.`,
  String.raw`Do đó $\widehat{MAE}=\widehat{MDF}$.`,
  String.raw`Xét $\triangle AME$ và $\triangle DMF$ có:`,
  String.raw`$AE=DF$ (cmt);`,
  String.raw`$\widehat{MAE}=\widehat{MDF}$ (cmt);`,
  String.raw`$AM=DM$ (gt)`,
  String.raw`nên $\triangle AME=\triangle DMF$ (c.g.c).`,
  congThang('E', 'F', 'B', 'C'))
LG['BT.07.131.06'] = L(
  String.raw`Vì $\triangle AMB=\triangle DMC$ (${B('131', 1)}) nên`,
  String.raw`$\widehat{MAB}=\widehat{MDC}$ (hai góc tương ứng).`,
  String.raw`$I$ thuộc cạnh $AB$ nên tia $AI$ trùng tia $AB$;`,
  String.raw`$J$ thuộc cạnh $DC$ nên tia $DJ$ trùng tia $DC$.`,
  String.raw`Do đó $\widehat{MAI}=\widehat{MDJ}$.`,
  String.raw`Xét $\triangle AMI$ và $\triangle DMJ$ có:`,
  String.raw`$AI=DJ$ (gt);`,
  String.raw`$\widehat{MAI}=\widehat{MDJ}$ (cmt);`,
  String.raw`$AM=DM$ (gt)`,
  String.raw`nên $\triangle AMI=\triangle DMJ$ (c.g.c).`,
  congThang('I', 'J', 'B', 'C'))
LG['BT.07.131.07'] = L(
  String.raw`Vì $\triangle AMB=\triangle DMC$ (${B('131', 1)}) nên`,
  String.raw`$\widehat{MAB}=\widehat{MDC}$ (hai góc tương ứng).`,
  String.raw`$H$ thuộc cạnh $AB$ nên tia $AH$ trùng tia $AB$;`,
  String.raw`$K$ thuộc cạnh $DC$ nên tia $DK$ trùng tia $DC$.`,
  String.raw`Do đó $\widehat{MAH}=\widehat{MDK}$.`,
  String.raw`$MH\perp AB$ (gt) nên $\triangle AHM$ vuông tại $H$.`,
  String.raw`$MK\perp DC$ (gt) nên $\triangle DKM$ vuông tại $K$.`,
  String.raw`Xét hai tam giác vuông $AHM$ và $DKM$ có:`,
  String.raw`$AM=DM$ (gt);`,
  String.raw`$\widehat{MAH}=\widehat{MDK}$ (cmt)`,
  String.raw`nên $\triangle AHM=\triangle DKM$ (ch - gn).`,
  congThang('H', 'K', 'B', 'C'))
LG['BT.07.131.08'] = L(
  String.raw`$N$ là trung điểm của $AB$, $N$ là trung điểm của $CP$ (gt)`,
  String.raw`nên $NA=NB$ và $NC=NP$.`,
  String.raw`$N$ nằm giữa $A$, $B$ và nằm giữa $C$, $P$ nên`,
  String.raw`$\widehat{ANC}=\widehat{BNP}$ (hai góc đối đỉnh).`,
  String.raw`Xét $\triangle ANC$ và $\triangle BNP$ có:`,
  String.raw`$NA=NB$ (cmt);`,
  String.raw`$\widehat{ANC}=\widehat{BNP}$ (cmt);`,
  String.raw`$NC=NP$ (cmt)`,
  String.raw`nên $\triangle ANC=\triangle BNP$ (c.g.c).`,
  String.raw`Suy ra $\widehat{NAC}=\widehat{NBP}$ (hai góc tương ứng).`,
  String.raw`Hai góc này ở vị trí so le trong`,
  String.raw`($C$, $P$ khác phía đối với $AB$ vì $N$ nằm giữa $C$, $P$)`,
  String.raw`nên $BP\parallel AC$.`,
  String.raw`Mà $BD\parallel AC$ (${B('131', 4)})`,
  String.raw`nên $BP$ và $BD$ là hai đường thẳng cùng đi qua $B$`,
  String.raw`và cùng song song với $AC$.`,
  String.raw`Theo tiên đề Ơ-clit, hai đường thẳng $BP$ và $BD$ trùng nhau.`,
  String.raw`Vậy $D$, $B$, $P$ thẳng hàng.`)
LG['BT.07.131.09'] = L(
  String.raw`Vì $\triangle ANC=\triangle BNP$ (${B('131', 8)}) nên`,
  String.raw`$BP=AC$ (hai cạnh tương ứng).`,
  String.raw`Mà $AC=BD$ (${B('131', 4)})`,
  String.raw`nên $BP=BD$.`,
  String.raw`$AB\parallel CD$ (${B('131', 3)}) nên $C$, $D$ cùng phía đối với $AB$.`,
  String.raw`$N$ nằm giữa $C$, $P$ nên $C$, $P$ khác phía đối với $AB$.`,
  String.raw`Do đó $D$, $P$ khác phía đối với đường thẳng $AB$.`,
  String.raw`Mà $D$, $B$, $P$ thẳng hàng (${B('131', 8)}) và $B$ thuộc $AB$`,
  String.raw`nên $B$ nằm giữa $D$ và $P$.`,
  String.raw`Vậy $B$ là trung điểm của $DP$ (vì $BD=BP$).`)
LG['BT.07.131.10'] = L(
  String.raw`$L$ là trung điểm của $AC$, $L$ là trung điểm của $BQ$ (gt)`,
  String.raw`nên $LA=LC$ và $LB=LQ$.`,
  String.raw`$L$ nằm giữa $A$, $C$ và nằm giữa $B$, $Q$ nên`,
  String.raw`$\widehat{ALB}=\widehat{CLQ}$ (hai góc đối đỉnh).`,
  String.raw`Xét $\triangle ALB$ và $\triangle CLQ$ có:`,
  String.raw`$LA=LC$ (cmt);`,
  String.raw`$\widehat{ALB}=\widehat{CLQ}$ (cmt);`,
  String.raw`$LB=LQ$ (cmt)`,
  String.raw`nên $\triangle ALB=\triangle CLQ$ (c.g.c).`,
  String.raw`Suy ra $\widehat{LAB}=\widehat{LCQ}$ (hai góc tương ứng).`,
  String.raw`Hai góc này ở vị trí so le trong`,
  String.raw`($B$, $Q$ khác phía đối với $AC$ vì $L$ nằm giữa $B$, $Q$)`,
  String.raw`nên $CQ\parallel AB$.`,
  String.raw`Mà $CD\parallel AB$ (${B('131', 3)})`,
  String.raw`nên $CQ$ và $CD$ là hai đường thẳng cùng đi qua $C$`,
  String.raw`và cùng song song với $AB$.`,
  String.raw`Theo tiên đề Ơ-clit, hai đường thẳng $CQ$ và $CD$ trùng nhau.`,
  String.raw`Vậy $D$, $C$, $Q$ thẳng hàng.`)
LG['BT.07.131.11'] = L(
  String.raw`Vì $\triangle ALB=\triangle CLQ$ (${B('131', 10)}) nên`,
  String.raw`$CQ=AB$ (hai cạnh tương ứng).`,
  String.raw`Mà $AB=CD$ (${B('131', 3)})`,
  String.raw`nên $CQ=CD$.`,
  String.raw`$AC\parallel BD$ (${B('131', 4)}) nên $B$, $D$ cùng phía đối với $AC$.`,
  String.raw`$L$ nằm giữa $B$, $Q$ nên $B$, $Q$ khác phía đối với $AC$.`,
  String.raw`Do đó $D$, $Q$ khác phía đối với đường thẳng $AC$.`,
  String.raw`Mà $D$, $C$, $Q$ thẳng hàng (${B('131', 10)}) và $C$ thuộc $AC$`,
  String.raw`nên $C$ nằm giữa $D$ và $Q$.`,
  String.raw`Vậy $C$ là trung điểm của $DQ$ (vì $CD=CQ$).`)
// cặp AC, BD
LG['BT.07.131.12'] = L(
  String.raw`Vì $\triangle AMC=\triangle DMB$ (${B('131', 2)}) nên:`,
  String.raw`$AC=DB$ (hai cạnh tương ứng);`,
  String.raw`$\widehat{MAC}=\widehat{MDB}$ (hai góc tương ứng).`,
  String.raw`$E$, $F$ là trung điểm của $AC$, $DB$ (gt)`,
  String.raw`nên $AE=\dfrac{1}{2}AC$ và $DF=\dfrac{1}{2}DB$ (định nghĩa trung điểm).`,
  String.raw`Suy ra $AE=DF$.`,
  String.raw`$E$ thuộc cạnh $AC$ nên tia $AE$ trùng tia $AC$;`,
  String.raw`$F$ thuộc cạnh $DB$ nên tia $DF$ trùng tia $DB$.`,
  String.raw`Do đó $\widehat{MAE}=\widehat{MDF}$.`,
  String.raw`Xét $\triangle AME$ và $\triangle DMF$ có:`,
  String.raw`$AE=DF$ (cmt);`,
  String.raw`$\widehat{MAE}=\widehat{MDF}$ (cmt);`,
  String.raw`$AM=DM$ (gt)`,
  String.raw`nên $\triangle AME=\triangle DMF$ (c.g.c).`,
  congThang('E', 'F', 'C', 'B'))
LG['BT.07.131.13'] = L(
  String.raw`Vì $\triangle AMC=\triangle DMB$ (${B('131', 2)}) nên`,
  String.raw`$\widehat{MAC}=\widehat{MDB}$ (hai góc tương ứng).`,
  String.raw`$I$ thuộc cạnh $AC$ nên tia $AI$ trùng tia $AC$;`,
  String.raw`$J$ thuộc cạnh $DB$ nên tia $DJ$ trùng tia $DB$.`,
  String.raw`Do đó $\widehat{MAI}=\widehat{MDJ}$.`,
  String.raw`Xét $\triangle AMI$ và $\triangle DMJ$ có:`,
  String.raw`$AI=DJ$ (gt);`,
  String.raw`$\widehat{MAI}=\widehat{MDJ}$ (cmt);`,
  String.raw`$AM=DM$ (gt)`,
  String.raw`nên $\triangle AMI=\triangle DMJ$ (c.g.c).`,
  congThang('I', 'J', 'C', 'B'))
LG['BT.07.131.14'] = L(
  String.raw`Vì $\triangle AMC=\triangle DMB$ (${B('131', 2)}) nên`,
  String.raw`$\widehat{MAC}=\widehat{MDB}$ (hai góc tương ứng).`,
  String.raw`$H$ thuộc cạnh $AC$ nên tia $AH$ trùng tia $AC$;`,
  String.raw`$K$ thuộc cạnh $DB$ nên tia $DK$ trùng tia $DB$.`,
  String.raw`Do đó $\widehat{MAH}=\widehat{MDK}$.`,
  String.raw`$MH\perp AC$ (gt) nên $\triangle AHM$ vuông tại $H$.`,
  String.raw`$MK\perp BD$ (gt) nên $\triangle DKM$ vuông tại $K$.`,
  String.raw`Xét hai tam giác vuông $AHM$ và $DKM$ có:`,
  String.raw`$AM=DM$ (gt);`,
  String.raw`$\widehat{MAH}=\widehat{MDK}$ (cmt)`,
  String.raw`nên $\triangle AHM=\triangle DKM$ (ch - gn).`,
  congThang('H', 'K', 'C', 'B'))

// ═════════════ MH.132 — Tam giác cân (AB = AC, M trung điểm BC), ba nhánh ═════════════
// Dùng chung cho B6–B9 của mỗi nhánh. n = số hiển thị của Bài 2 / Bài 5 / Bài 6 của nhánh.
const cuoiNhanh = (nB2, nB5, nB6, nB7, nB8) => ({
  b6: L(
    String.raw`Vì $\triangle BEI=\triangle CDI$ (${nB5})`,
    String.raw`nên $IB=IC$ (hai cạnh tương ứng).`,
    String.raw`Vậy $\triangle BIC$ cân tại $I$ (định nghĩa tam giác cân).`),
  b7: L(
    String.raw`$IB=IC$ (${nB6})`,
    String.raw`Xét $\triangle AIB$ và $\triangle AIC$ có:`,
    String.raw`$AB=AC$ (gt);`,
    String.raw`$IB=IC$ (cmt);`,
    String.raw`$AI$ là cạnh chung`,
    String.raw`nên $\triangle AIB=\triangle AIC$ (c.c.c).`,
    String.raw`Suy ra $\widehat{BAI}=\widehat{CAI}$ (hai góc tương ứng).`,
    String.raw`$I$ nằm giữa $B$ và $D$, $D$ nằm giữa $A$ và $C$`,
    String.raw`nên tia $AI$ nằm giữa hai tia $AB$, $AC$.`,
    String.raw`Do đó $AI$ là tia phân giác của $\widehat{BAC}$.`,
    String.raw`Xét $\triangle ABM$ và $\triangle ACM$ có:`,
    String.raw`$AB=AC$ (gt);`,
    String.raw`$MB=MC$ (gt);`,
    String.raw`$AM$ là cạnh chung`,
    String.raw`nên $\triangle ABM=\triangle ACM$ (c.c.c).`,
    String.raw`Suy ra $\widehat{BAM}=\widehat{CAM}$ (hai góc tương ứng).`,
    String.raw`$M$ nằm giữa $B$ và $C$ nên tia $AM$ nằm giữa hai tia $AB$, $AC$.`,
    String.raw`Do đó $AM$ cũng là tia phân giác của $\widehat{BAC}$.`,
    String.raw`Hai tia $AI$ và $AM$ cùng là tia phân giác của $\widehat{BAC}$`,
    String.raw`nên hai tia này trùng nhau.`,
    String.raw`Vậy $A$, $I$, $M$ thẳng hàng.`),
  b8: L(
    String.raw`Xét $\triangle AIB$ và $\triangle AIC$ có:`,
    String.raw`$AB=AC$ (gt);`,
    String.raw`$IB=IC$ (${nB6});`,
    String.raw`$AI$ là cạnh chung`,
    String.raw`nên $\triangle AIB=\triangle AIC$ (c.c.c).`,
    String.raw`Suy ra $\widehat{BAI}=\widehat{CAI}$ (hai góc tương ứng).`,
    String.raw`$I$ nằm giữa $B$ và $D$, $D$ nằm giữa $A$ và $C$`,
    String.raw`nên tia $AI$ nằm giữa hai tia $AB$, $AC$.`,
    String.raw`Do đó $AI$ là tia phân giác của $\widehat{BAC}$.`,
    String.raw`$K$ là trung điểm của $DE$ (gt) nên $KD=KE$.`,
    String.raw`Xét $\triangle ADK$ và $\triangle AEK$ có:`,
    String.raw`$AD=AE$ (${nB2});`,
    String.raw`$KD=KE$ (cmt);`,
    String.raw`$AK$ là cạnh chung`,
    String.raw`nên $\triangle ADK=\triangle AEK$ (c.c.c).`,
    String.raw`Suy ra $\widehat{DAK}=\widehat{EAK}$ (hai góc tương ứng).`,
    String.raw`$K$ nằm giữa $D$ và $E$ nên tia $AK$ nằm giữa hai tia $AD$, $AE$.`,
    String.raw`Mà tia $AD$ trùng tia $AC$, tia $AE$ trùng tia $AB$`,
    String.raw`nên $AK$ là tia phân giác của $\widehat{BAC}$.`,
    String.raw`Hai tia $AI$ và $AK$ cùng là tia phân giác của $\widehat{BAC}$`,
    String.raw`nên hai tia này trùng nhau.`,
    String.raw`Vậy $A$, $I$, $K$ thẳng hàng.`),
  b9: L(
    String.raw`$A$, $I$, $M$ thẳng hàng (${nB7})`,
    String.raw`nên $M$ thuộc đường thẳng $AI$.`,
    String.raw`$A$, $I$, $K$ thẳng hàng (${nB8})`,
    String.raw`nên $K$ thuộc đường thẳng $AI$.`,
    String.raw`Vậy bốn điểm $A$, $I$, $M$, $K$ cùng thuộc đường thẳng $AI$,`,
    String.raw`tức là $A$, $I$, $M$, $K$ thẳng hàng.`),
})
// ── nhánh 1: hai đường cao BD ⊥ AC, CE ⊥ AB ──
{
  const n = (k) => B('132', k)
  const c = cuoiNhanh(n(2), n(5), n(6), n(7), n(8))
  LG['BT.07.132.01'] = L(
    String.raw`$BD\perp AC$ (gt) nên $\triangle ABD$ vuông tại $D$.`,
    String.raw`$CE\perp AB$ (gt) nên $\triangle ACE$ vuông tại $E$.`,
    String.raw`Vì $D$ thuộc cạnh $AC$, $E$ thuộc cạnh $AB$ nên`,
    String.raw`$\widehat{BAD}=\widehat{CAE}$ (cùng bằng $\widehat{BAC}$).`,
    String.raw`Xét hai tam giác vuông $ABD$ và $ACE$ có:`,
    String.raw`$AB=AC$ (gt);`,
    String.raw`$\widehat{BAD}=\widehat{CAE}$ (cmt)`,
    String.raw`Do đó $\triangle ABD=\triangle ACE$ (ch - gn).`)
  LG['BT.07.132.02'] = L(
    String.raw`Vì $\triangle ABD=\triangle ACE$ (${n(1)})`,
    String.raw`nên $AD=AE$ (hai cạnh tương ứng).`,
    String.raw`Vậy $\triangle ADE$ cân tại $A$ (định nghĩa tam giác cân).`)
  LG['BT.07.132.03'] = L(String.raw`$AD=AE$ (${n(1)}, hai cạnh tương ứng)`, deSongSong)
  LG['BT.07.132.04'] = L(
    String.raw`$CE\perp AB$ (gt) nên $\widehat{BEC}=90^\circ$.`,
    String.raw`$BD\perp AC$ (gt) nên $\widehat{CDB}=90^\circ$.`,
    String.raw`Do đó $\triangle BEC$ vuông tại $E$, $\triangle CDB$ vuông tại $D$.`,
    String.raw`$\triangle ABC$ cân tại $A$ (gt) nên $\widehat{ABC}=\widehat{ACB}$.`,
    String.raw`$E$ thuộc cạnh $AB$, $D$ thuộc cạnh $AC$ nên`,
    String.raw`$\widehat{EBC}=\widehat{DCB}$.`,
    String.raw`Xét hai tam giác vuông $BEC$ và $CDB$ có:`,
    String.raw`$BC$ là cạnh chung;`,
    String.raw`$\widehat{EBC}=\widehat{DCB}$ (cmt)`,
    String.raw`Do đó $\triangle BEC=\triangle CDB$ (ch - gn).`)
  LG['BT.07.132.05'] = L(
    String.raw`Vì $\triangle BEC=\triangle CDB$ (${n(4)}) nên`,
    String.raw`$BE=CD$ (hai cạnh tương ứng).`,
    String.raw`Vì $\triangle ABD=\triangle ACE$ (${n(1)}) nên`,
    String.raw`$\widehat{ABD}=\widehat{ACE}$ (hai góc tương ứng).`,
    String.raw`$E$ thuộc cạnh $AB$, $D$ thuộc cạnh $AC$ nên`,
    String.raw`tia $BE$ trùng tia $BA$, tia $CD$ trùng tia $CA$.`,
    String.raw`$I$ thuộc $BD$ và $CE$ nên`,
    String.raw`tia $BI$ trùng tia $BD$, tia $CI$ trùng tia $CE$.`,
    String.raw`Do đó $\widehat{EBI}=\widehat{DCI}$.`,
    String.raw`$\widehat{BEI}=\widehat{CDI}=90^\circ$ (gt)`,
    String.raw`Xét $\triangle BEI$ và $\triangle CDI$ có:`,
    String.raw`$\widehat{EBI}=\widehat{DCI}$ (cmt);`,
    String.raw`$BE=CD$ (cmt);`,
    String.raw`$\widehat{BEI}=\widehat{CDI}$ (cmt)`,
    String.raw`Do đó $\triangle BEI=\triangle CDI$ (g.c.g).`)
  LG['BT.07.132.06'] = c.b6
  LG['BT.07.132.07'] = c.b7
  LG['BT.07.132.08'] = c.b8
  LG['BT.07.132.09'] = c.b9
}
// ── nhánh 2: hai phân giác BD, CE ──
{
  const n = (k) => B('132', k)
  const c = cuoiNhanh(n(11), n(14), n(15), n(16), n(17))
  LG['BT.07.132.10'] = L(
    String.raw`$BD$ là tia phân giác của $\widehat{ABC}$ (gt)`,
    String.raw`nên $\widehat{ABD}=\dfrac{1}{2}\widehat{ABC}$.`,
    String.raw`$CE$ là tia phân giác của $\widehat{ACB}$ (gt)`,
    String.raw`nên $\widehat{ACE}=\dfrac{1}{2}\widehat{ACB}$.`,
    String.raw`$\triangle ABC$ cân tại $A$ (gt) nên $\widehat{ABC}=\widehat{ACB}$.`,
    String.raw`Do đó $\widehat{ABD}=\widehat{ACE}$.`,
    String.raw`$D$ thuộc cạnh $AC$, $E$ thuộc cạnh $AB$ nên`,
    String.raw`$\widehat{BAD}=\widehat{CAE}$ (cùng bằng $\widehat{BAC}$).`,
    String.raw`Xét $\triangle ABD$ và $\triangle ACE$ có:`,
    String.raw`$\widehat{BAD}=\widehat{CAE}$ (cmt);`,
    String.raw`$AB=AC$ (gt);`,
    String.raw`$\widehat{ABD}=\widehat{ACE}$ (cmt)`,
    String.raw`Do đó $\triangle ABD=\triangle ACE$ (g.c.g).`)
  LG['BT.07.132.11'] = L(
    String.raw`Vì $\triangle ABD=\triangle ACE$ (${n(10)})`,
    String.raw`nên $AD=AE$ (hai cạnh tương ứng).`,
    String.raw`Vậy $\triangle ADE$ cân tại $A$ (định nghĩa tam giác cân).`)
  LG['BT.07.132.12'] = L(String.raw`$AD=AE$ (${n(10)}, hai cạnh tương ứng)`, deSongSong)
  LG['BT.07.132.13'] = L(
    String.raw`$\triangle ABC$ cân tại $A$ (gt) nên $\widehat{ABC}=\widehat{ACB}$.`,
    String.raw`$E$ thuộc cạnh $AB$, $D$ thuộc cạnh $AC$ nên`,
    String.raw`$\widehat{EBC}=\widehat{ABC}$ và $\widehat{DCB}=\widehat{ACB}$.`,
    String.raw`Do đó $\widehat{EBC}=\widehat{DCB}$.`,
    String.raw`$BD$, $CE$ là các tia phân giác (gt) nên`,
    String.raw`$\widehat{DBC}=\dfrac{1}{2}\widehat{ABC}$ và $\widehat{ECB}=\dfrac{1}{2}\widehat{ACB}$.`,
    String.raw`Suy ra $\widehat{DBC}=\widehat{ECB}$.`,
    String.raw`Xét $\triangle BEC$ và $\triangle CDB$ có:`,
    String.raw`$\widehat{EBC}=\widehat{DCB}$ (cmt);`,
    String.raw`$BC$ là cạnh chung;`,
    String.raw`$\widehat{ECB}=\widehat{DBC}$ (cmt)`,
    String.raw`Do đó $\triangle BEC=\triangle CDB$ (g.c.g).`)
  LG['BT.07.132.14'] = L(
    String.raw`Vì $\triangle BEC=\triangle CDB$ (${n(13)}) nên`,
    String.raw`$BE=CD$ (hai cạnh tương ứng)`,
    String.raw`và $\widehat{BEC}=\widehat{CDB}$ (hai góc tương ứng).`,
    String.raw`Vì $\triangle ABD=\triangle ACE$ (${n(10)}) nên`,
    String.raw`$\widehat{ABD}=\widehat{ACE}$ (hai góc tương ứng).`,
    String.raw`$I$ thuộc $BD$ và $CE$; $E$ thuộc cạnh $AB$, $D$ thuộc cạnh $AC$ nên`,
    String.raw`$\widehat{EBI}=\widehat{ABD}$, $\widehat{DCI}=\widehat{ACE}$,`,
    String.raw`$\widehat{BEI}=\widehat{BEC}$, $\widehat{CDI}=\widehat{CDB}$.`,
    String.raw`Do đó $\widehat{EBI}=\widehat{DCI}$ và $\widehat{BEI}=\widehat{CDI}$.`,
    String.raw`Xét $\triangle BEI$ và $\triangle CDI$ có:`,
    String.raw`$\widehat{EBI}=\widehat{DCI}$ (cmt);`,
    String.raw`$BE=CD$ (cmt);`,
    String.raw`$\widehat{BEI}=\widehat{CDI}$ (cmt)`,
    String.raw`Do đó $\triangle BEI=\triangle CDI$ (g.c.g).`)
  LG['BT.07.132.15'] = c.b6
  LG['BT.07.132.16'] = c.b7
  LG['BT.07.132.17'] = c.b8
  LG['BT.07.132.18'] = c.b9
}
// ── nhánh 3: hai trung tuyến BD, CE ──
{
  const n = (k) => B('132', k)
  const c = cuoiNhanh(n(20), n(23), n(24), n(25), n(26))
  LG['BT.07.132.19'] = L(
    String.raw`$D$, $E$ là trung điểm của $AC$, $AB$ (gt)`,
    String.raw`nên $AD=\dfrac{1}{2}AC$ và $AE=\dfrac{1}{2}AB$ (định nghĩa trung điểm).`,
    String.raw`Mà $AB=AC$ (gt) nên $AD=AE$.`,
    String.raw`$D$ thuộc cạnh $AC$, $E$ thuộc cạnh $AB$ nên`,
    String.raw`$\widehat{BAD}=\widehat{CAE}$ (cùng bằng $\widehat{BAC}$).`,
    String.raw`Xét $\triangle ABD$ và $\triangle ACE$ có:`,
    String.raw`$AB=AC$ (gt);`,
    String.raw`$\widehat{BAD}=\widehat{CAE}$ (cmt);`,
    String.raw`$AD=AE$ (cmt)`,
    String.raw`Do đó $\triangle ABD=\triangle ACE$ (c.g.c).`)
  LG['BT.07.132.20'] = L(
    String.raw`$AD=AE$ (${n(19)})`,
    String.raw`Vậy $\triangle ADE$ cân tại $A$ (định nghĩa tam giác cân).`)
  LG['BT.07.132.21'] = L(String.raw`$AD=AE$ (${n(19)})`, deSongSong)
  LG['BT.07.132.22'] = L(
    String.raw`$D$, $E$ là trung điểm của $AC$, $AB$ (gt)`,
    String.raw`nên $CD=\dfrac{1}{2}AC$ và $BE=\dfrac{1}{2}AB$ (định nghĩa trung điểm).`,
    String.raw`Mà $AB=AC$ (gt) nên $BE=CD$.`,
    String.raw`$\triangle ABC$ cân tại $A$ (gt) nên $\widehat{ABC}=\widehat{ACB}$.`,
    String.raw`$E$ thuộc cạnh $AB$, $D$ thuộc cạnh $AC$ nên`,
    String.raw`$\widehat{EBC}=\widehat{DCB}$.`,
    String.raw`Xét $\triangle BEC$ và $\triangle CDB$ có:`,
    String.raw`$BE=CD$ (cmt);`,
    String.raw`$\widehat{EBC}=\widehat{DCB}$ (cmt);`,
    String.raw`$BC$ là cạnh chung`,
    String.raw`Do đó $\triangle BEC=\triangle CDB$ (c.g.c).`)
  LG['BT.07.132.23'] = L(
    String.raw`Vì $\triangle BEC=\triangle CDB$ (${n(22)}) nên`,
    String.raw`$BE=CD$ (hai cạnh tương ứng)`,
    String.raw`và $\widehat{BEC}=\widehat{CDB}$ (hai góc tương ứng).`,
    String.raw`Vì $\triangle ABD=\triangle ACE$ (${n(19)}) nên`,
    String.raw`$\widehat{ABD}=\widehat{ACE}$ (hai góc tương ứng).`,
    String.raw`$I$ thuộc $BD$ và $CE$; $E$ thuộc cạnh $AB$, $D$ thuộc cạnh $AC$ nên`,
    String.raw`$\widehat{EBI}=\widehat{ABD}$, $\widehat{DCI}=\widehat{ACE}$,`,
    String.raw`$\widehat{BEI}=\widehat{BEC}$, $\widehat{CDI}=\widehat{CDB}$.`,
    String.raw`Do đó $\widehat{EBI}=\widehat{DCI}$ và $\widehat{BEI}=\widehat{CDI}$.`,
    String.raw`Xét $\triangle BEI$ và $\triangle CDI$ có:`,
    String.raw`$\widehat{EBI}=\widehat{DCI}$ (cmt);`,
    String.raw`$BE=CD$ (cmt);`,
    String.raw`$\widehat{BEI}=\widehat{CDI}$ (cmt)`,
    String.raw`Do đó $\triangle BEI=\triangle CDI$ (g.c.g).`)
  LG['BT.07.132.24'] = c.b6
  LG['BT.07.132.25'] = c.b7
  LG['BT.07.132.26'] = c.b8
  LG['BT.07.132.27'] = c.b9
}

// ── kiểm khuôn trước khi ghi ──
const hien = (s) => s.replace(/\$[^$]*\$/g, (m) => m.replace(/\\(?:triangle|widehat|dfrac|perp|parallel|circ)\b|\\[a-z]+/g, 'X').replace(/[{}]/g, ''))
const tong = Object.keys(LG).length
const dsBai = (await q(`select b.ma, b.id, g.id cach, g.loi_giai from hinh_baitoan b left join hinh_cach_giai g on g.baitoan_id = b.id and g.la_mac_dinh
  where b.ma ~ '^BT\\.07\\.(126|130|131|132)\\.' and b.mo_hinh_id in (select id from hinh_mo_hinh where khoi = '7' and phan = 'luyen')`))
const cua = Object.fromEntries(dsBai.map((r) => [r.ma, r]))
const loi = []
for (const [ma, lg] of Object.entries(LG)) {
  const r = cua[ma]
  if (!r) { loi.push(`${ma}: không thấy bài`); continue }
  if (r.loi_giai && r.loi_giai.trim()) loi.push(`${ma}: ĐÃ có lời giải — không đè`)
  if ((lg.match(/\$/g) || []).length % 2) loi.push(`${ma}: số $ lẻ`)
  if (/\n\n/.test(lg)) loi.push(`${ma}: có dòng trống`)
  if (/undefined|\[object/.test(lg)) loi.push(`${ma}: chuỗi lỗi`)
  for (const d of lg.split('\n')) { if (hien(d).length > 68) loi.push(`${ma}: dòng dài ${hien(d).length}: ${d.slice(0, 60)}`) }
}
const thieu = dsBai.filter((r) => !LG[r.ma]).map((r) => r.ma)
if (thieu.length) loi.push('Bài chưa có lời giải trong script: ' + thieu.join(', '))
if (tong !== dsBai.length) loi.push(`script ${tong} bài ≠ DB ${dsBai.length} bài`)
if (loi.length) { console.error('LỖI KHUÔN:\n' + loi.join('\n')); await c.end(); process.exit(1) }
console.log(`Khuôn đạt: ${tong} lời giải · ${Object.values(LG).reduce((s, x) => s + x.split('\n').length, 0)} dòng`)

await c.query('begin')
try {
  // đề MH.285 (nút "DE cắt AB tại F"): "Tia DE" sai hướng — F nằm trên tia ED (D nằm giữa E và F) ⇒ đổi thành giao điểm của hai đường thẳng
  const r = await c.query(`update hinh_mo_hinh set gia_thiet_them = $1, updated_at = now()
    where ma = 'MH.285' and gia_thiet_them = $2`, [String.raw`Gọi $F$ là giao điểm của đường thẳng $DE$ và đường thẳng $AB$.`, String.raw`Tia $DE$ cắt đường thẳng $AB$ tại $F$.`])
  if (r.rowCount !== 1) throw new Error('MH.285: không thấy giả thiết cũ để sửa (rowCount=' + r.rowCount + ')')
  let n = 0
  for (const [ma, lg] of Object.entries(LG)) {
    const b = (await q(`select b.id, b.phat_bieu, b.gia_thiet_rieng, b.anh_chuan from hinh_baitoan b where b.ma = $1`, [ma]))[0]
    const cach = (await q(`select id from hinh_cach_giai where baitoan_id = $1 and la_mac_dinh`, [b.id]))[0]
    const td = cach ? (await q(`select tien_de_id from hinh_cach_tien_de where cach_id = $1`, [cach.id])).map((x) => x.tien_de_id) : []
    await q(`select fn_hl_sua_bai($1, $2, $3, $4, $5, $6::uuid[])`, [b.id, b.phat_bieu, b.gia_thiet_rieng, lg, b.anh_chuan, td]); n++
  }
  // đọc lại (chỉ 59 bài của script; BT.07.126.01/.02 nằm ở mô hình cũ ẩn MH.061, không đụng)
  const ds = Object.keys(LG)
  const dem = (await q(`select count(*) filter (where g.loi_giai is not null and g.loi_giai <> '') co, count(*) tong
    from hinh_cach_giai g join hinh_baitoan b on b.id = g.baitoan_id where g.la_mac_dinh and b.ma = any($1)`, [ds]))[0]
  const nCach = (await q(`select count(*) n from hinh_cach_giai g join hinh_baitoan b on b.id = g.baitoan_id where b.ma = any($1)`, [ds]))[0].n
  const td = (await q(`select count(*) n from hinh_cach_tien_de x join hinh_cach_giai g on g.id = x.cach_id join hinh_baitoan b on b.id = g.baitoan_id where b.ma = any($1)`, [ds]))[0].n
  let sai = 0
  for (const g of goc) sai += (await q(`select * from fn_hl_sai_nhanh($1)`, [g.id])).length
  console.log(`Đã ghi ${n} lời giải · đọc lại: ${dem.co}/${dem.tong} bài có lời giải · ${nCach} cách · ${td} tiền đề (trước khi ghi 49) · sai nhánh ${sai}`)
  if (Number(dem.co) !== tong || Number(dem.tong) !== tong || Number(nCach) !== tong || Number(td) !== 49 || sai) throw new Error('đọc lại không khớp')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message, e.detail || '', e.where || ''); process.exitCode = 1 }
await c.end()
