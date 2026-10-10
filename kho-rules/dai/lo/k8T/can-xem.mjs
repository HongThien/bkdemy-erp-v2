// ============================================================================
// can-xem.mjs — dựng trang "câu cần chị xem" của kho 8T (khuôn kho-rules/dai/k6-chua-chac.html): mỗi câu một thẻ gồm
// ẢNH CẮT TỪ SÁCH + đề / đáp án / lời giải đang nằm trong kho + việc cần quyết. Thùy 10/10: "Mấy câu sai cần review thì
// m phải cho t view cụ thể chứ".
//
//   node kho-rules/dai/lo/k8T/can-xem.mjs            → kho-rules/dai/k8T-can-xem.html
//
// Công thức dựng sẵn thành MathML (katex, output 'mathml') ⇒ trang không tải gì từ ngoài. Ảnh cắt bằng pdftoppm từ PDF gốc
// (toạ độ điểm ảnh ở 150 dpi, trang 900 × 1350). Danh sách thẻ viết tay ở mảng THE bên dưới — thêm lô thì thêm thẻ.
// ============================================================================
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import katex from 'katex'
import pg from 'pg'

const DIR = dirname(fileURLToPath(import.meta.url)), GOC = join(DIR, '..', '..', '..', '..')
const PDF = 'E:/BK ACADEMY/Tài liệu tham khảo/8T/HSG/Chuyên đề bồi dưỡng HSG Toán 8-NĐT.pdf'
const SACH = 'CĐ BD HSG Toán 8 – Nguyễn Đức Tấn'
const tam = process.env.K8T_XEM_TAM ?? mkdtempSync(join(tmpdir(), 'k8t-xem-'))
let soAnh = 0
/** cắt một dải ngang của trang PDF ⇒ data URI */
function cat(trang, y, cao) {
  const ra = join(tam, `a${++soAnh}`)
  execFileSync('pdftoppm', ['-r', '150', '-gray', '-f', String(trang), '-l', String(trang), '-x', '0', '-y', String(y), '-W', '900', '-H', String(cao), '-png', '-singlefile', PDF, ra])
  return `data:image/png;base64,${readFileSync(ra + '.png').toString('base64')}`
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toan = (tex) => { try { return katex.renderToString(tex, { output: 'mathml', throwOnError: true, strict: 'ignore' }) } catch { return `<code>${esc(tex)}</code>` } }
/** chữ có $…$ và **đậm** ⇒ HTML một dòng */
const dong = (s) => esc(s).replace(/\$([^$]+)\$/g, (_, t) => toan(t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
const doan = (s) => String(s).split(/\n\n+/).map((d) => `<p>${dong(d).replace(/\n/g, '<br>')}</p>`).join('')

// ── dữ liệu: lô đã dựng + mã câu trên DB ────────────────────────────────────
const lo = Object.fromEntries(['NDT-D1-ptnt', 'NDT-D1-hdt-chia-ot', 'NDT-D1s16-D2', 'NDT-D3-pt', 'NDT-D4-bdt', 'NDT-ON-PA'].flatMap((t) => JSON.parse(readFileSync(join(DIR, t + '.json'), 'utf8'))).map((c) => [c.ma_nguon, c]))
const bai = Object.fromEntries(['NDT-D1-ptnt', 'NDT-D1-hdt-chia-ot', 'NDT-D1s16-D2', 'NDT-D3-pt', 'NDT-D4-bdt', 'NDT-ON-PA'].flatMap((t) => JSON.parse(readFileSync(join(DIR, t + '.bai.json'), 'utf8'))).map((b) => [b.ma, b]))
const mu = Object.assign({}, ...['NDT-D1-ptnt', 'NDT-D1-hdt-chia-ot', 'NDT-D1s16-D2', 'NDT-D3-pt', 'NDT-D4-bdt', 'NDT-ON-PA'].map((t) => JSON.parse(readFileSync(join(DIR, t + '.mu.json'), 'utf8')).cau))
const env = Object.fromEntries(readFileSync(join(GOC, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect(); await db.query('begin read only')
const { rows: cauDb } = await db.query(`select ma_cau, noi_dung, dap_an, loi_giai, ten_de_goc, dang_chinh, da_duyet from dai_cau_hoi where xoa_at is null and left(dang_chinh, 4) = 'T18T'`)
const { rows: nhomDb } = await db.query(`select ma_dang, ten_chuyen_de, ten_dang from dai_ban_do where khoi = '8T'`)
await db.end()
const theoNguon = Object.fromEntries(cauDb.filter((r) => r.ten_de_goc?.startsWith(SACH)).map((r) => [r.ten_de_goc.slice(SACH.length + 3), r]))
const theoMa = Object.fromEntries(cauDb.map((r) => [r.ma_cau, r]))
const tenNhom = Object.fromEntries(nhomDb.map((r) => [r.ma_dang, `${r.ten_chuyen_de} › ${r.ten_dang}`]))

/** khối "đang nằm trong kho" của một câu theo mã nguồn (lấy từ DB — nguồn sự thật) */
function trongKho(ma, { loiGiai = true } = {}) {
  const r = theoNguon[ma]
  if (!r) { const c = lo[ma]; return c ? `<div class="kho chua"><div class="ma">chưa ghi vào kho · ${esc(ma)}</div>${doan(c.noi_dung)}<p class="da">Đáp án soạn: ${dong(c.dap_an)}</p></div>` : `<div class="kho chua"><div class="ma">chưa ghi vào kho · ${esc(ma)}</div></div>` }
  return `<div class="kho"><div class="ma"><code>${r.ma_cau}</code> · ${r.da_duyet ? 'đã duyệt' : 'chưa duyệt'} · ${esc(tenNhom[r.dang_chinh] ?? r.dang_chinh)}</div>${doan(r.noi_dung)}<p class="da">Đáp án: ${dong(r.dap_an ?? '')}</p>${loiGiai && r.loi_giai ? `<details><summary>Lời giải đang để trong kho</summary><div class="lg">${doan(r.loi_giai)}</div></details>` : ''}</div>`
}
const khoMa = (maCau) => { const r = theoMa[maCau]; return r ? `<div class="kho"><div class="ma"><code>${r.ma_cau}</code> · ${r.da_duyet ? 'đã duyệt' : 'chưa duyệt'} · ${esc(tenNhom[r.dang_chinh] ?? r.dang_chinh)}</div>${doan(r.noi_dung)}<p class="da">Đáp án: ${dong(r.dap_an ?? '')}</p></div>` : '' }
const anh = (trang, y, cao, chu) => `<figure><img alt="${esc(chu)}" src="${cat(trang, y, cao)}"><figcaption>${esc(chu)} · trang PDF ${trang}</figcaption></figure>`

// ── các thẻ ──────────────────────────────────────────────────────────────────
let so = 0
const the = (tieuDe, than, quyet, xong = false) => `<section class="the"><h3><span class="so">${++so}</span>${esc(tieuDe)}</h3>${than}<p class="quyet"><span class="${xong ? 'dang xong' : 'dang'}">${xong === 'bao' ? 'Đã làm — chị xem' : xong ? 'Đã xử lý' : 'Cần chị quyết'}</span> ${dong(quyet)}</p></section>`
const muc = (nhan, html) => `<div class="muc"><div class="nhan">${esc(nhan)}</div><div class="nd">${html}</div></div>`

const A = [
  the('Bài 50 — sách in hai ý cùng một đa thức', anh(18, 1115, 200, 'Bài 50, đề và lời giải của sách')
    + muc('Trả lời câu hỏi của chị', doan('Đây là **đề bài của sách**, không phải bước biến đổi do tôi thêm: ý a) sách in sẵn dạng đã tách $x^2+3x+2x+6$, ý b) mới là dạng thường $x^2+5x+6$. Lời giải ý b) của sách đi qua đúng biểu thức của ý a).'))
    + muc('Ý a)', '<p>Đã xoá mềm (câu T18T010201025).</p>') + muc('Ý b) — giữ', trongKho('D1.50b@p18', { loiGiai: false })),
    'Chị chốt 10/10: bỏ ý a). Đã xoá mềm, giữ ý b).', true),
  the('Bài 53 — ý a) là ý b) đã thêm bớt sẵn', anh(19, 725, 190, 'Bài 53, đề và kết quả của sách')
    + muc('Trả lời câu hỏi của chị', doan('Cũng là **đề của sách**: ý a) in $x^4+4+4x^2-4x^2$ (đã thêm bớt $4x^2$ sẵn), ý b) là $x^4+4$. Hai ý cùng kết quả.'))
    + muc('Ý a)', '<p>Đã xoá mềm (câu T18T000000002).</p>') + muc('Ý b) — giữ', trongKho('D1.53b@p19', { loiGiai: false })),
    'Chị chốt 10/10: bỏ ý a). Đã xoá mềm, giữ ý b).', true),
]
const B = [
  the('Bài 35 ý b — đề sách thiếu điều kiện', anh(13, 1205, 90, 'Bài 35, đề') + anh(14, 95, 360, 'Bài 35, lời giải của sách (ý b dừng giữa chừng)')
    + muc('Vấn đề', doan('Sách in "Cho biết $a^4+b^4+c^4+d^4=4abcd$. Chứng minh rằng $a=b=c=d$" — sai khi các số trái dấu: $a=b=1$, $c=d=-1$ vẫn thoả giả thiết mà $a\\ne c$. Lời giải sách dừng ở tổng ba bình phương, không kết luận.'))
    + muc('Trong kho', trongKho('D1.35b@p13')), 'Chị đã bảo thêm "số dương" — đề trong kho đã sửa thành "Cho các số dương $a,b,c,d$ thoả mãn …". Chị xem lời giải.', true),
  the('Bài 55 ý d — sách in sai kết quả', anh(19, 1180, 135, 'Bài 55, đề') + anh(20, 395, 170, 'Bài 55, kết quả của sách cho ý c–f')
    + muc('Vấn đề', doan('Sách ghi $x^8+x^7+1=(x^2+x+1)(x^6-x^4+x^2-x+1)$. Nhân ra không bằng vế trái — hạng tử thứ ba phải là $x^3$: $(x^2+x+1)(x^6-x^4+x^3-x+1)$. Máy thay số bắt được, tôi mở ảnh xác nhận sách in $x^2$.'))
    + muc('Trong kho', trongKho('D1.55d@p19')), 'Kho ghi kết quả đúng. Chị xem lời giải.', true),
  the('Bài 82 ý c — sách in sai một nhân tử', anh(28, 840, 200, 'Bài 82, đề và kết quả của sách')
    + muc('Vấn đề', doan('Sách ghi $3x^4-75x^2y^2=3x^2(x+5y)(x-5xy)$. Nhân tử cuối phải là $(x-5y)$.')) + muc('Trong kho', trongKho('D1.82c@p28')), 'Kho ghi kết quả đúng.', true),
  the('Bài 84 ý b — sách in sai dấu', anh(28, 1195, 105, 'Bài 84, đề') + anh(29, 95, 80, 'Bài 84, kết quả của sách')
    + muc('Vấn đề', doan('Sách ghi kết quả ý b) là $(a-b)(b-c)(c-a)$. Thử $a=0$, $b=1$, $c=2$: đề cho $-2$, kết quả sách cho $+2$. Đúng là $(a-b)(a-c)(b-c)$.')) + muc('Trong kho', trongKho('D1.84b@p28')), 'Kho ghi kết quả đúng.', true),
  the('Bài 38 ý c — một dòng biến đổi của sách sai và lược bước', anh(15, 595, 135, 'Bài 38 c, đề') + anh(15, 1100, 200, 'Bài 38 c, lời giải của sách')
    + muc('Vấn đề', doan('Sách viết "$(a^{102}+b^{102})(a^{100}+b^{100})-2(a^{101}+b^{101})=0 \\Leftrightarrow\\dots\\Leftrightarrow(a^{51}-a^{50})^2+(b^{51}-b^{50})^2=0$". Dòng đầu không đúng (phải là **cộng**, không phải nhân): $(a^{102}+b^{102})-2(a^{101}+b^{101})+(a^{100}+b^{100})=0$. Đáp số $P=2$ của sách vẫn đúng.'))
    + muc('Trong kho', trongKho('D1.38c@p15')), 'Lời giải kho viết lại từ dòng đúng, đủ bước. Chị xem lời giải.', true),
  the('Bài 23 ý b — sách in sai dấu và chưa kết luận', anh(9, 1205, 80, 'Bài 23, đề') + anh(10, 95, 265, 'Bài 23, lời giải của sách')
    + muc('Vấn đề', doan('Dòng cuối sách in $-\\left[\\left(x-\\dfrac{5}{2}\\right)^2-120\\dfrac{3}{4}\\right]$ — phải là $+120\\dfrac{3}{4}$ (vì $127-\\dfrac{25}{4}=120\\dfrac{3}{4}$), và sách chưa nêu giá trị lớn nhất.'))
    + muc('Trong kho', trongKho('D1.23b@p9')), 'Kho ghi GTLN bằng $-\\dfrac{483}{4}$ khi $x=\\dfrac{5}{2}$.', true),
  the('Bài 89 ý b — đề có vấn đề, kết quả sách sai', anh(30, 435, 625, 'Bài 89, đề và lời giải của sách')
    + muc('Vấn đề', doan('(1) Đề nói "gọi $x_1,\\dots,x_5$ là các nghiệm của $P(x)=3x^5+2x^2+2011$" — đa thức này chỉ có **một** nghiệm thực; năm nghiệm thì phải kể nghiệm phức, ngoài tầm lớp 8.\n\n(2) Sách viết $P(x)=(x-x_1)\\dots(x-x_5)$, quên hệ số cao nhất $3$ ⇒ kết quả $129385710$ sai gấp $9$ lần. Tính đúng: $32\\cdot\\dfrac{P\\left(\\frac12\\right)}{3}\\cdot\\dfrac{P(-1)}{3}=14376190$.')),
    + muc('Trong kho', trongKho('D1.89b@p30')), 'Chị chốt 10/10: nhập với kết quả đúng $14376190$. Câu đang ở "Chưa phân dạng" vì chưa nhóm nào khớp.', true),
]
const C = [
  the('Ba câu cùng họ "$a^{100}+b^{100}=a^{101}+b^{101}=a^{102}+b^{102}$"', anh(15, 595, 135, 'NĐT bài 38 c') + anh(18, 95, 170, 'NĐT bài 48')
    + muc('Câu đã duyệt từ trước', khoMa('T18T010301006')) + muc('Bài 38 c (mới)', trongKho('D1.38c@p15', { loiGiai: false })) + muc('Bài 48 (mới)', trongKho('D1.48@p18', { loiGiai: false }))
    + muc('Vì sao máy nghi', doan('Ba câu chỉ khác nguồn đề và số mũ cần tính ($2015$, $2010$, $2004$); đáp số đều bằng $2$, cách giải như nhau. Máy không tự bỏ loại này.')),
    'Chị chốt 10/10: giữ cả ba — đề riêng cứ để riêng, coi như biến thể.', true),
  the('Bài 84 b và bài 57 b — hai đề khác nhau, cùng một đa thức', anh(20, 935, 85, 'NĐT bài 57, đề') + anh(28, 1195, 105, 'NĐT bài 84, đề')
    + muc('Bài 57 b', trongKho('D1.57b@p20', { loiGiai: false })) + muc('Bài 84 b', trongKho('D1.84b@p28', { loiGiai: false }))
    + muc('Vì sao máy nghi', doan('Khai triển đề bài 84 b ra thì được đúng đa thức của bài 57 b, nên kết quả giống nhau. Nhưng đề viết khác hẳn và bước đầu (khai triển, ước lược) là việc riêng của 84 b.')),
    'Chị chốt 10/10: giữ cả hai — giống hệt nhau mới bỏ, form đề khác nhau thì giữ.', true),
]
const CHO = ['D1.36@p14', 'D1.55a@p19', 'D1.26b@p10', 'D1.26d@p11', 'D1.80a@p27', 'D1.80b@p27', 'D1.86@p29']
const D = CHO.map((ma) => {
  const c = lo[ma], a = c?.nhom_soan, b = mu[ma]?.dang
  const ten = (x) => (!x || /000000$/.test(x) ? 'không nhóm nào khớp (dạng chờ)' : tenNhom[x] ?? x)
  return the(`Bài ${bai[ma]?.bai}${bai[ma]?.y ? ' ' + bai[ma].y : ''} — hai lượt gán nhóm lệch nhau, chị đã chốt`, muc('Trong kho', trongKho(ma))
    + muc('Lượt soạn chọn', `<p>${esc(ten(a))}</p>`) + muc('Lượt gán độc lập chọn', `<p>${esc(ten(b))}${mu[ma]?.ly_do ? ` <span class="mo">— ${esc(mu[ma].ly_do)}</span>` : ''}</p>`),
    `Chị chốt 10/10: ${ten(theoNguon[ma]?.dang_chinh)}. Đã xếp vào nhóm này.`, true)
})

// ── LÔ 3 (NĐT Đại I §1, §6 + chương II) — thẻ còn chờ chị + thẻ "đã làm, chị xem" ─────────────────
const tenN = (x) => (!x || /000000$/.test(x) ? 'không nhóm nào khớp (dạng chờ)' : tenNhom[x] ?? x)
const lech = (ma, hinh, nghieng) => the(`Bài ${bai[ma]?.bai}${bai[ma]?.y ? ' ' + bai[ma].y : ''} — hai lượt gán nhóm lệch nhau`, hinh + muc('Trong kho', trongKho(ma))
  + muc('Lượt soạn chọn', `<p>${esc(tenN(lo[ma]?.nhom_soan))}</p>`) + muc('Lượt gán độc lập chọn', `<p>${esc(tenN(mu[ma]?.dang))}${mu[ma]?.ly_do ? ` <span class="mo">— ${esc(mu[ma].ly_do)}</span>` : ''}</p>`), nghieng)
const dsDe = (ds) => `<ul class="ds">${ds.map((ma) => `<li><span class="mo">bài ${esc(bai[ma]?.bai ?? ma)}${bai[ma]?.y ? ' ' + esc(bai[ma].y) : ''}</span> ${dong((lo[ma]?.noi_dung ?? '').split('\n\n')[0])}</li>`).join('')}</ul>`
const NC_CO_BAN = ['D1.7a@p5', 'D1.7b@p5', 'D1.8@p5', 'D1.10@p6', 'D1.66a@p23', 'D1.66b@p23', 'D1.67a@p23', 'D1.67b@p23', 'D1.68a@p23', 'D1.68b@p23', 'D1.69@p23']
const E = [
  lech('D1.11b@p6', anh(6, 655, 520, 'Chương I bài 11, đề và lời giải của sách'),
    'Chọn nhóm nào? Lời giải của sách xét số dư khi chia cho $5$, nên tôi nghiêng về **Nghiệm nguyên › Dùng bất đẳng thức, xét số dư**.'),
  lech('D1.13a@p7', anh(7, 350, 125, 'Chương I bài 13 a, đề') + anh(7, 600, 150, 'Bài 13 a, lời giải của sách'),
    'Chọn nhóm nào? Bài nằm ở §1 (nhân đa thức), cách giải là nhân $(4-1)$ vào tổng các luỹ thừa của $4$. Tôi nghiêng về **Kiến thức cơ bản › Nhân, chia đa thức**.'),
  lech('D2.34@p43', anh(43, 265, 990, 'Chương II bài 34, đề và lời giải của sách'),
    'Chọn nhóm nào? Ý a) tính $S$, ý b) là bất đẳng thức dùng kết quả ý a) nên không tách được. Tôi nghiêng về **Bất đẳng thức › Xét hiệu, biến đổi tương đương** vì ý b) mới là đích của bài.'),
  the('Bài 89 ý b (chương I) — chưa có nhóm', muc('Trong kho', trongKho('D1.89b@p30', { loiGiai: false })),
    'Xếp vào nhóm nào? Tôi nghiêng về **Đa thức và phép chia › Tìm dư: định lí Bê-du, sơ đồ Hoóc-ne** — lời giải viết $P(x)$ dưới dạng tích rồi thay $x=\\dfrac{1}{2}$ và $x=-1$.'),
]
const F = [
  the('Bài "nâng cao" của §1 và §6 — bản đồ không có nhóm riêng', muc('Vấn đề', doan('Bản đồ 8T không có nhóm chuyên đề nào cho nhân đa thức và chia đơn thức ở mức nâng cao (tính $x^{n+19}:x^{14}$, tìm đơn thức $A$, tính giá trị bằng cách thay $2223=x+1$, đồng nhất hệ số sau khi nhân…). Chuyên đề "Kiến thức cơ bản" chị đặt ra là cho tầng **Bài tập cơ bản** của sách; 11 câu này sách xếp ở tầng **Bài tập nâng cao**.'))
    + muc('11 câu', dsDe(NC_CO_BAN)),
    'Tôi xếp cả 11 câu vào **Kiến thức cơ bản › Nhân, chia đa thức** (lượt gán độc lập cũng chọn vậy) và đã tự duyệt. Chị thấy không hợp thì bảo, tôi chuyển nhóm — mã câu không đổi.', 'bao'),
  the('Bài 69 (chương I) — đề sách in thiếu chặt điều kiện', anh(23, 1200, 110, 'Bài 69, đề') + anh(24, 95, 125, 'Bài 69, lời giải của sách')
    + muc('Vấn đề', doan('Sách in điều kiện $x\\ne0$, $y\\ge0$. Tại $y=0$ số chia $-2x^2y^3$ bằng $0$ nên biểu thức không xác định. Sách cũng dừng ở $4{,}5x^2+3y^3+1$, không viết bước kết luận.'))
    + muc('Trong kho', trongKho('D1.69@p23')), 'Kho ghi $y>0$ (cùng kiểu với lần chị cho thêm "số dương" ở bài 35 b) và viết đủ bước kết luận.', 'bao'),
  the('Bài 32 ý b (chương II) — sách nêu kết luận, không lập luận', anh(42, 200, 175, 'Bài 32, đề') + anh(42, 650, 440, 'Bài 32 b, lời giải của sách')
    + muc('Vấn đề', doan('Sách đi đến $\\dfrac{a}{(b-c)^2}+\\dfrac{b}{(c-a)^2}+\\dfrac{c}{(a-b)^2}=0$ (in nhầm mẫu thứ ba thành $(c-b)^2$) rồi viết luôn "Vậy trong ba số phải có một số âm và một số dương".'))
    + muc('Trong kho', trongKho('D2.32b@p42')), 'Kho bổ sung bước còn thiếu bằng phản chứng: ba số cùng không âm (hoặc cùng không dương) thì cả ba số hạng bằng $0$, trái với "đôi một khác nhau".', 'bao'),
  the('Bài 40 ý b (chương II) — sách chỉ rút gọn, không tìm $x$', anh(46, 220, 95, 'Bài 40 b, đề') + anh(46, 500, 150, 'Bài 40 b, lời giải của sách')
    + muc('Trong kho', trongKho('D2.40b@p46')), 'Kho soạn tiếp đến hết: $x-1$ là ước của $6$, loại $x=0$ và $x=-1$ theo điều kiện xác định, còn $x\\in\\{-5;-2;2;3;4;7\\}$.', 'bao'),
  the('Bài 41 (chương II) — sách không giải ý c)', anh(46, 690, 600, 'Bài 41, đề và lời giải của sách (ý a, b)') + anh(47, 95, 110, 'Bài 41, phần còn lại của lời giải')
    + muc('Trong kho', trongKho('D2.41@p46')), 'Ý c) do kho soạn: $M=\\dfrac{(x^2+3)(x^2-1)}{x+4}$ với $x\\ne2$, $x\\ne-4$.', 'bao'),
  the('Bài 51 ý a (chương II) — sách chỉ ghi một dòng hướng dẫn', anh(50, 845, 90, 'Bài 51 a, đề') + anh(50, 1195, 95, 'Bài 51 a, hướng dẫn của sách')
    + muc('Trong kho', trongKho('D2.51a@p50')), 'Kho viết đủ: lập ba hệ thức, nhân theo vế, rồi tách hai trường hợp (tích ba hiệu khác $0$ và bằng $0$).', 'bao'),
]

// ── LÔ 4 (NĐT Đại III — phương trình) ────────────────────────────────────────
E.push(the('Bài 73 (ôn tập chương III) — số liệu của đề không ra đáp số', anh(80, 250, 820, 'Chương III bài 73, đề và lời giải của sách')
  + muc('Vấn đề', doan('Đề in **451 giây**. Phương trình sách lập là $3x^2+x-902=0$, không có nghiệm nguyên dương ($x=17$ cho $442$ giây, $x=18$ cho $495$ giây). Sách lại phân tích thành $(x-19)(3x+58)=0$, mà tích đó bằng $3x^2+x-1102$ — tức ứng với **551 giây** ($19\\cdot20+\\dfrac{19\\cdot18}{2}=551$). Kết quả $950$ m của sách chỉ đúng với 551 giây.'))
  + muc('Trong kho (chưa duyệt)', trongKho('D3.73@p80')),
  'Tôi tạm ghi đề với **551 giây** để khớp lời giải và kết quả của sách. Chị chọn: giữ bản 551 giây (tôi duyệt), hay bỏ câu này?'))
F.push(the('Bài 64 (ôn tập chương III) — đề và lời giải của sách lệch nhau', anh(76, 510, 125, 'Chương III bài 64, đề và lời giải của sách')
  + muc('Vấn đề', doan('Đề in $4x-7=x+11$ nhưng lời giải của sách giải $4x-7=x+1$ và ra $\\dfrac{8}{3}$.')) + muc('Trong kho', trongKho('D3.64@p76')),
  'Kho giữ đề như in ($x+11$), đáp số $S=\\{6\\}$.', 'bao'))
const GHI_CHU_LO4 = `<p class="dan">Lô 4 (chương III, 93 câu): cả 45 câu ngoài tầng cơ bản hai lượt gán nhóm đều khớp. Phương trình chứa ẩn ở mẫu tôi xếp cả vào "Đưa về bậc nhất, phương trình tích, chứa ẩn ở mẫu", kể cả bài phải đặt ẩn phụ (44, 47, 49 b); phương trình đa thức bậc ba trở lên vào "Bậc cao"; bài có tham số vào "Có tham số".</p>
<p class="dan">Lỗi in của sách ở chương III, kho ghi theo biểu thức đúng: bài 24 (dòng cuối in ${toan('\\dfrac{1}{20}')} và ${toan('x-375')} thay cho ${toan('\\dfrac{1}{21}')} và ${toan('x-357')}), bài 25 a (in ${toan('\\dfrac{b+c-x}{b}')} thay cho ${toan('\\dfrac{c+a-x}{b}')}), bài 46 (đề in một dấu trông như dấu chia giữa hai phân thức; lời giải của sách dùng dấu cộng). Sách dừng giữa chừng, kho soạn tiếp: bài 23 b, 25 a, 25 b (biện luận theo tham số), bài 33, 35, bài 48 (nêu đủ ba giá trị ${toan('m')} làm phương trình vô nghiệm), bài 49 a, 49 b (sách chỉ ghi đáp số).</p>`

// ── LÔ 5 (NĐT Đại IV — bất đẳng thức, bất phương trình, giá trị tuyệt đối) ───
E.push(
  lech('D4.13a1@p85', anh(85, 890, 65, 'Chương IV bài 13 a ý 1, đề') + anh(86, 400, 110, 'Bài 13 a ý 1, lời giải của sách'),
    'Chọn nhóm nào? Lời giải của sách xét hiệu rồi đưa về tổng hai bình phương, nên tôi nghiêng về **Bất đẳng thức › Xét hiệu, biến đổi tương đương**.'),
  lech('D4.13b2@p85', anh(85, 1125, 175, 'Chương IV bài 13 b, đề') + anh(86, 845, 380, 'Bài 13 b, lời giải của sách'),
    'Chọn nhóm nào? Sách dùng $\\dfrac{x}{y}+\\dfrac{y}{x}\\ge2$ cho từng cặp rồi cộng lại, giống bài 11 c (hai lượt đều xếp "Dùng bất đẳng thức quen thuộc"). Tôi nghiêng về **Bất đẳng thức › Dùng bất đẳng thức quen thuộc**.'),
  lech('D4.14d@p87', anh(87, 975, 150, 'Chương IV bài 14 d, đề') + anh(89, 90, 200, 'Bài 14 d, lời giải của sách'),
    'Chọn nhóm nào? Ý 1 là biến đổi tương đương, ý 2 thêm bớt rồi dùng ý 1 để đánh giá. Tôi không chắc; hơi nghiêng về **Bất đẳng thức › Làm trội, phản chứng và các kỹ thuật khác** vì ý 2 là đích của bài.'),
  lech('D4.47@p102', anh(102, 505, 550, 'Chương IV bài 47, đề và lời giải của sách'),
    'Chọn nhóm nào? Cả ba ý quy về $(a+b)^2\\ge4ab$; ý c) dùng lại ý a), b). Tôi nghiêng về **Bất đẳng thức › Xét hiệu, biến đổi tương đương**.'),
  the('Bài 48 ý b (ôn tập chương IV) — đề sách in là một bất đẳng thức sai', anh(102, 1055, 95, 'Chương IV bài 48, đề') + anh(103, 90, 130, 'Bài 48 b, lời giải của sách')
    + muc('Vấn đề', doan('Sách in $c(a+b)^3$ ở cả đề lẫn lời giải. Với số mũ $3$ bất đẳng thức sai: lấy $a=b=c=\\dfrac{1}{10}$ thì vế trái bằng $0{,}0008$, vế phải bằng $0{,}003$. Lời giải của sách (ra tích ba nhân tử bậc nhất) chỉ đúng với $c(a+b)^2$; dòng cuối sách còn in nhầm $(a+b+c)$ thay cho $(a+b-c)$.'))
    + muc('Trong kho (chưa duyệt)', trongKho('D4.48b@p102')),
    'Tôi tạm ghi đề với **$c(a+b)^2$**. Chị chọn: giữ bản mũ $2$ (tôi duyệt), hay bỏ câu này?'),
)
F.push(
  the('Bài 13 a ý 3 (chương IV) — đề thiếu điều kiện', anh(85, 1000, 125, 'Bài 13 a ý 3, đề') + anh(86, 600, 240, 'Bài 13 a ý 3, lời giải của sách')
    + muc('Vấn đề', doan('Đề in không có điều kiện của $a,b,c$; lời giải của sách mở đầu "Với $a,b,c>0$". Thiếu điều kiện thì các mẫu có thể bằng $0$ hoặc âm.')) + muc('Trong kho', trongKho('D4.13a3@p85')),
    'Kho ghi thêm "Cho $a,b,c>0$" vào đề (cùng kiểu với bài 35 b chương I).', 'bao'),
  the('Bài 21 (chương IV) — đề là hình trục số, kho mô tả bằng lời', anh(93, 215, 390, 'Bài 21, đề và lời giải của sách')
    + muc('Ý a) trong kho', trongKho('D4.21a@p93', { loiGiai: false })) + muc('Ý b) trong kho', trongKho('D4.21b@p93', { loiGiai: false })),
    'Kho chưa có hình vẽ cho hai câu này; đề mô tả trục số bằng lời. Chị muốn có hình thì bảo, tôi vẽ bằng code rồi gắn vào đề.', 'bao'),
  the('Bài 42 (chương IV) — kết luận của sách thiếu một trường hợp', anh(100, 375, 90, 'Bài 42, đề') + anh(100, 880, 420, 'Bài 42, phần biện luận và kết luận của sách')
    + muc('Vấn đề', doan('Sách kết luận ba trường hợp $m=0$, $\\lvert m\\rvert>2$, $m=\\pm2$ — bỏ sót $0<\\lvert m\\rvert<2$. Khi đó $x=\\dfrac{1}{4-m^2}>0$ trái điều kiện $x\\le0$ nên phương trình cũng vô nghiệm.')) + muc('Trong kho', trongKho('D4.42@p100')),
    'Kho kết luận đủ: $0<\\lvert m\\rvert\\le2$ thì vô nghiệm.', 'bao'),
)
const GHI_CHU_LO5 = `<p class="dan">Lô 5 (chương IV, 130 câu): 62 trên 66 câu ngoài tầng cơ bản hai lượt gán nhóm khớp. Bài 43, 44 ôn tập (áp dụng trực tiếp liên hệ giữa thứ tự với phép cộng, phép nhân) tôi xếp vào nhóm cơ bản "Bất phương trình bậc nhất một ẩn". Bài cơ bản của §3 (phương trình chứa dấu giá trị tuyệt đối) vào nhóm cơ bản "Phương trình bậc nhất một ẩn". Bài 13 b ý 1 trùng bất đẳng thức với bài 10 f (${toan('a^2+b^2+c^2\\ge ab+bc+ca')}) nhưng là đề thi có nguồn riêng nên giữ cả hai.</p>
<p class="dan">Lỗi in của sách ở chương IV, kho ghi theo biểu thức đúng: bài 14 b ý 1 (in ${toan('(y-2y^2)^2')} thay cho ${toan('(y-y^2)^2')}), bài 14 d (in ${toan('(ab-a)-(a-c)')} thay cho ${toan('(ab-a)+(a-c)')}), bài 19 d (dòng đầu lời giải in dấu ${toan('>')} thay cho ${toan('\\ge')}), bài 29 b (lời giải chia trường hợp lệch đề), bài 40 (in sai số mũ ở một bước), bài 43 d (in ${toan('-5a\\le5b')}). Bài 52 c: sách thiếu hình trục số. Sách dừng giữa chừng, kho soạn tiếp: bài 11 e, 12 b.</p>`

// ── LÔ 6 (NĐT — ôn tập cuối năm phần Đại + phụ lục A) ──────────────────────
const lech6 = (ma, hinh, nghieng) => the(`${ma.startsWith('ON.') ? 'Ôn tập cuối năm' : 'Phụ lục A'}, bài ${bai[ma]?.bai}${bai[ma]?.y ? ' ' + bai[ma].y : ''} — hai lượt gán nhóm lệch nhau`, hinh + muc('Trong kho', trongKho(ma))
  + muc('Lượt soạn chọn', `<p>${esc(tenN(lo[ma]?.nhom_soan))}</p>`) + muc('Lượt gán độc lập chọn', `<p>${esc(tenN(mu[ma]?.dang))}${mu[ma]?.ly_do ? ` <span class="mo">— ${esc(mu[ma].ly_do)}</span>` : ''}</p>`), nghieng)
E.push(
  the('Bài 31 (phụ lục A) — đề sách in là một mệnh đề sai', anh(245, 470, 655, 'Phụ lục A bài 31, đề và lời giải của sách')
    + muc('Vấn đề', doan('Sách in "Chứng minh rằng tồn tại hai số trong bốn số đó **bằng $1$**". Mệnh đề này sai: $a=2$, $b=\\dfrac{1}{2}$, $c=3$, $d=\\dfrac{1}{3}$ thoả cả hai giả thiết mà không số nào bằng $1$. Lời giải của sách chứng minh $ab=1$ hoặc $bc=1$ hoặc $bd=1$, tức là tồn tại hai số **có tích bằng $1$**.'))
    + muc('Trong kho (chưa duyệt)', trongKho('PA.31@p245')),
    'Tôi tạm ghi đề là "tồn tại hai số trong bốn số đó **có tích bằng $1$**". Chị chọn: giữ bản này (tôi duyệt), hay bỏ câu?'),
  the('Bài 43, 44, 45 (phụ lục A) — bài bất biến, tô màu: bản đồ chưa có nhóm', anh(252, 225, 990, 'Phụ lục A bài 43 và 44, đề và lời giải của sách') + anh(252, 1215, 80, 'Bài 45, đề (phần đầu)') + anh(253, 95, 298, 'Bài 45, đề (phần còn lại)')
    + muc('Bài 43 trong kho', trongKho('PA.43@p252')) + muc('Bài 44 trong kho', trongKho('PA.44@p252')) + muc('Bài 45 trong kho', trongKho('PA.45@p252')),
    'Ba câu đang ở "Chưa phân dạng", chưa duyệt. Chị chọn: (1) xếp vào **Đi-rích-lê, cực hạn › Trong số học và suy luận** — chuyên đề gần nhất; hay (2) chị thêm một nhóm cho bài bất biến, tô màu rồi tôi chuyển sang. Tôi nghiêng về (2): cách giải là tìm một đại lượng không đổi qua mỗi thao tác, khác hẳn Đi-rích-lê và cực hạn.'),
  lech6('ON.6c@p217', anh(217, 565, 80, 'Ôn tập cuối năm bài 6, đề') + anh(217, 860, 420, 'Bài 6 c, cách 1 đến cách 3 của sách') + anh(218, 95, 150, 'Bài 6 c, cách 4 của sách'),
    'Chọn nhóm nào? Cả bốn cách của sách đều tách hoặc thêm bớt hạng tử, không đặt ẩn phụ. Tôi nghiêng về **Phân tích nhân tử › Tách hạng tử, thêm bớt hạng tử**.'),
  lech6('ON.14a@p220', anh(220, 525, 250, 'Ôn tập cuối năm bài 14, đề và lời giải ý a của sách'),
    'Chọn nhóm nào? Hai vế nhìn là bậc ba, nhưng đặt nhân tử chung xong chỉ còn $-3(x+1)(x-2)=0$. Tôi nghiêng về **Phương trình › Đưa về bậc nhất, phương trình tích, chứa ẩn ở mẫu**.'),
  lech6('ON.19@p222', anh(222, 920, 290, 'Ôn tập cuối năm bài 19, đề và lời giải của sách'),
    'Chọn nhóm nào? Lời giải lập tích $(a+1)(2-a)\\ge0$ rồi cộng lại. Theo luật chị đã chốt (bất đẳng thức chứng minh bằng tích nhân tử thì vào "Xét hiệu, biến đổi tương đương"), tôi nghiêng về **Bất đẳng thức › Xét hiệu, biến đổi tương đương**.'),
  lech6('PA.2a@p232', anh(232, 570, 480, 'Phụ lục A bài 2, đề và lời giải của sách'),
    'Chọn nhóm nào (cho cả ý a và ý b)? Sách thêm bớt $x^2$ để có hiệu hai bình phương, không đặt ẩn phụ. Tôi nghiêng về **Phân tích nhân tử › Tách hạng tử, thêm bớt hạng tử**.'),
  lech6('PA.2b@p232', '', 'Cùng bài 2, ảnh sách ở thẻ ngay trên. Tôi nghiêng về **Phân tích nhân tử › Tách hạng tử, thêm bớt hạng tử**.'),
  lech6('PA.7@p234', anh(234, 685, 495, 'Phụ lục A bài 7, đề và lời giải của sách'),
    'Chọn nhóm nào? Lời giải so số dư khi chia cho $3$ của hai bên. Tôi nghiêng về **Chia hết › Số dư, chữ số tận cùng, đồng dư**.'),
  lech6('PA.8@p234', anh(234, 1185, 60, 'Phụ lục A bài 8, đề') + anh(235, 95, 180, 'Bài 8, lời giải của sách'),
    'Chọn nhóm nào? Đề hỏi "tìm các số tự nhiên $n$ sao cho…". Tôi nghiêng về **Số nguyên tố, số chính phương › Tìm số để biểu thức là số chính phương**.'),
  lech6('PA.10@p235', anh(235, 990, 285, 'Phụ lục A bài 10, đề và phần đầu lời giải') + anh(236, 95, 345, 'Bài 10, phần còn lại của lời giải'),
    'Chọn nhóm nào? Bước quyết định của sách là $4\\cdot(1-2x)\\cdot2x\\le(1-2x+2x)^2$, tức $4AB\\le(A+B)^2$. Tôi nghiêng về **Bất đẳng thức › Dùng bất đẳng thức quen thuộc**.'),
  lech6('PA.12@p236', anh(236, 835, 440, 'Phụ lục A bài 12, đề và lời giải của sách (phần ở trang này)'),
    'Chọn nhóm nào? Sách đưa về tích rồi so độ lớn hai vế trong từng trường hợp $y<2013$, $y>2013$. Tôi nghiêng về **Nghiệm nguyên › Dùng bất đẳng thức, xét số dư**.'),
)
F.push(
  the('Bài 16 a (ôn tập cuối năm) — đề sách in sai một mẫu số', anh(221, 545, 250, 'Ôn tập cuối năm bài 16, đề và lời giải ý a của sách')
    + muc('Vấn đề', doan('Đề in mẫu thứ ba là $x^2-x$; lời giải của sách dùng $x^2-4$ (điều kiện $x\\ne\\pm2$, nghiệm $x=-4$). Với $x^2-x$ thì $x=-4$ không là nghiệm.')) + muc('Trong kho', trongKho('ON.16a@p221')),
    'Kho ghi mẫu thứ ba là $x^2-4$.', 'bao'),
  the('Bài 9 (ôn tập cuối năm) — kết quả của sách mất dấu trừ', anh(219, 95, 380, 'Ôn tập cuối năm bài 9, đề và lời giải của sách')
    + muc('Vấn đề', doan('Sách in $A=\\dfrac{12{,}65}{11{,}15}=\\dfrac{253}{223}$. Tử số là $-\\dfrac{3}{4}+1{,}5-13{,}4=-12{,}65$ nên giá trị đúng là $-\\dfrac{253}{223}$ (máy thay số cũng ra số âm).')) + muc('Trong kho', trongKho('ON.9@p219')),
    'Kho ghi $-\\dfrac{253}{223}$.', 'bao'),
  the('Bài 4 b (phụ lục A) — đề sách in thiếu $z^3$', anh(233, 225, 528, 'Phụ lục A bài 4, đề và lời giải của sách')
    + muc('Vấn đề', doan('Đề ý b) in $x^3+y^3+mxyz$; lời giải của sách dùng $x^3+y^3+z^3+mxyz$. Với đề như in thì không có $m$ nào thoả.')) + muc('Trong kho', trongKho('PA.4@p233')),
    'Kho ghi đề có $z^3$.', 'bao'),
  the('Bài 18 (phụ lục A) — đề sách in dấu bằng thay cho dấu cộng', anh(238, 1085, 115, 'Phụ lục A bài 18, đề') + anh(239, 95, 535, 'Bài 18, lời giải của sách')
    + muc('Vấn đề', doan('Đề in $ax^2=by^2=5$; lời giải của sách dùng $ax^2+by^2=5$, và chỉ bản đó khớp các dữ kiện còn lại ($a=b=1$, $\\{x;y\\}=\\{1;2\\}$). Lời giải sách còn in $175xy$ thay cho $17+5xy$.')) + muc('Trong kho', trongKho('PA.18@p238')),
    'Kho ghi $ax^2+by^2=5$.', 'bao'),
  the('Bài 29 (phụ lục A) — số hạng cuối của đề in sai cơ số', anh(244, 685, 610, 'Phụ lục A bài 29, đề và lời giải của sách')
    + muc('Vấn đề', doan('Số hạng cuối in $\\dfrac{2013}{1+2013^2+2014^4}$; quy luật của tổng và lời giải của sách chỉ khớp với $2013^4$.')) + muc('Trong kho', trongKho('PA.29@p244')),
    'Kho ghi $2013^4$.', 'bao'),
  the('Bài 37 (phụ lục A) — điều kiện của đề in thiếu dấu trừ', anh(248, 1020, 240, 'Phụ lục A bài 37, đề và dòng đầu lời giải') + anh(249, 95, 190, 'Bài 37, phần còn lại của lời giải')
    + muc('Vấn đề', doan('Đề in $a\\ne b$, $b\\ne-c$, $c\\ne-a$. Mẫu số là $a+b$ nên điều kiện phải là $a\\ne-b$. Dòng "Tương tự có" của sách còn in lệch mẫu số của hai phân thức.')) + muc('Trong kho', trongKho('PA.37@p248')),
    'Kho ghi $a\\ne-b$ và viết lại phép tách cho đúng mẫu.', 'bao'),
  the('Bài 38 (phụ lục A) — số hạng thứ hai của đề in lặp', anh(249, 285, 250, 'Phụ lục A bài 38, đề và phép đặt của sách')
    + muc('Vấn đề', doan('Đề in hai lần $\\dfrac{1}{(a^2+1)^2}$; lời giải của sách đặt $\\dfrac{1}{b^2+1}=y$ nên số hạng thứ hai là $\\dfrac{1}{(b^2+1)^2}$.')) + muc('Trong kho', trongKho('PA.38@p249')),
    'Kho ghi số hạng thứ hai có $b$.', 'bao'),
  the('Bài 17 và bài 34 (phụ lục A) — sách in lại bài đã có ở chương IV và chương II', anh(238, 680, 410, 'Phụ lục A bài 17') + muc('Đã có trong kho từ chương IV bài 14 b', khoMa('T18T030101015'))
    + anh(247, 285, 660, 'Phụ lục A bài 34') + muc('Đã có trong kho từ chương II bài 51 c', khoMa('T18T010302015')),
    'Hai bài này cùng giả thiết, cùng kết luận với câu đã có (chỉ khác vài chữ), nên tôi không nhập lần hai. Chị muốn giữ cả bản phụ lục thì bảo, tôi nhập thêm.', 'bao'),
)
const GHI_CHU_LO6 = `<p class="dan">Lô 6 (ôn tập cuối năm phần Đại và phụ lục A). Bài 5 a, 5 b ôn tập cuối năm trùng nguyên văn với câu đã có trong kho nên máy bỏ. Bài 20 b ôn tập cuối năm: sách chỉ nêu bất đẳng thức phụ ${toan('\\dfrac{x^2}{y}+\\dfrac{y^2}{z}+\\dfrac{z^2}{x}\\ge x+y+z')}, kho chứng minh đủ.</p>
<p class="dan">Lỗi in của sách trong lời giải, kho ghi theo biểu thức đúng: phụ lục A bài 2 b, 3, 7, 8, 9, 12, 22 a, 22 b, 24, 25, 27, 28, 32, 35, 36 (kết quả in ${toan('a^4+18a^2+16+16a^2')}, đúng là ${toan('a^4+24a^2+16')}), 41, 42, 44, 45 (dãy đổi màu in ĐVVX → XXVV, đúng là XXVX). Sách nêu thiếu trường hợp dấu bằng, kho nêu đủ: bài 10 (thêm các hoán vị của ${toan('(1;0;0)')}), bài 21 (dấu bằng tại ${toan('(2;0;-1)')} và ${toan('(-2;0;1)')}, không phải ${toan('x=\\pm1,\\ y=0,\\ z=\\pm1')}).</p>`

const html = `<title>8T — câu cần chị xem</title>
<style>
/* bố cục: một cột đọc, mỗi câu một thẻ: ảnh sách ở trên, các mục nhãn–nội dung ở dưới, việc cần quyết ở cuối thẻ (theo k6-chua-chac.html) */
:root{--nen:#f6f7f9;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e5e7eb;--nhan:#b45309;--nen-nhan:#fffbeb;--xanh:#047857;--nen-xanh:#ecfdf5;--nen-kho:#f3f4f6}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nen:#111827;--the:#1f2937;--chu:#f3f4f6;--mo:#9ca3af;--vien:#374151;--nhan:#fbbf24;--nen-nhan:#3b2f12;--xanh:#6ee7b7;--nen-xanh:#0f2f25;--nen-kho:#273244;color-scheme:dark}}
:root[data-theme="dark"]{--nen:#111827;--the:#1f2937;--chu:#f3f4f6;--mo:#9ca3af;--vien:#374151;--nhan:#fbbf24;--nen-nhan:#3b2f12;--xanh:#6ee7b7;--nen-xanh:#0f2f25;--nen-kho:#273244;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:15px/1.6 system-ui,"Segoe UI",sans-serif}
main{max-width:900px;margin:0 auto;padding-block:20px 60px;padding-inline:16px}
h1{font-size:22px;margin:8px 0 6px;text-wrap:balance}h2{font-size:17px;margin:36px 0 4px;text-wrap:balance}
p{margin:0 0 8px}p.dan{color:var(--mo);max-width:68ch}.mo{color:var(--mo)}
nav{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0}nav a{color:var(--chu);border:1px solid var(--vien);background:var(--the);border-radius:999px;padding:4px 12px;text-decoration:none;font-size:14px}
nav a:focus-visible,summary:focus-visible{outline:2px solid var(--nhan);outline-offset:2px}
.the{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:14px 16px;margin:14px 0;display:flex;flex-direction:column;gap:10px}
.the h3{font-size:15.5px;margin:0;display:flex;gap:10px;align-items:center}
.so{flex:none;width:28px;height:28px;border-radius:50%;background:var(--chu);color:var(--the);display:grid;place-items:center;font-size:13px;font-variant-numeric:tabular-nums}
figure{margin:0}figure img{display:block;max-width:100%;height:auto;background:#fff;border:1px solid var(--vien);border-radius:8px}
figcaption{color:var(--mo);font-size:13px;margin-top:3px}
.muc{display:grid;grid-template-columns:150px minmax(0,1fr);gap:4px 14px}.nhan{color:var(--mo)}.nd{min-width:0}.nd p:last-child{margin-bottom:0}
.kho{background:var(--nen-kho);border-radius:8px;padding:10px 12px;overflow-x:auto}.kho.chua{border:1px dashed var(--vien);background:transparent}
.ma{color:var(--mo);font-size:13px;margin-bottom:4px}.da{margin-top:6px}
code{font:13px ui-monospace,Consolas,monospace}
details{margin-top:8px}summary{cursor:pointer;color:var(--mo)}.lg{margin-top:8px;padding-top:8px;border-top:1px solid var(--vien)}
.quyet{margin:2px 0 0;padding-top:10px;border-top:1px solid var(--vien)}
.dang{background:var(--nen-nhan);color:var(--nhan);border-radius:6px;padding:2px 8px;display:inline-block;margin-right:6px;font-size:13.5px}.dang.xong{background:var(--nen-xanh);color:var(--xanh)}
ul.ds{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px}ul.ds li{overflow-x:auto}
math{font-size:1.08em}.katex{white-space:nowrap}
@media (max-width:600px){.muc{grid-template-columns:1fr}.nhan{margin-top:4px;font-size:13.5px}}
</style>
<main>
<h1>Khối 8T — câu cần chị xem</h1>
<p class="dan">Kho Đại 8T sau sáu lô (quyển Chuyên đề bồi dưỡng HSG Toán 8 của Nguyễn Đức Tấn: trọn bốn chương Đại số, ôn tập cuối năm phần Đại và phụ lục A): ${cauDb.length} câu, ${cauDb.filter((r) => r.da_duyet).length} câu đã duyệt. Từ 10/10 câu qua cổng được tự duyệt; câu ở mục "Cần chị quyết" thì chưa. Ảnh là trang sách gốc cắt từ PDF. Khung xám là câu đang nằm trong kho; bấm "Lời giải đang để trong kho" để xem lời giải đầy đủ.</p>
<nav><a href="#e">Cần chị quyết (${E.length})</a><a href="#f">Lô 3–6: đã làm, chị xem (${F.length})</a><a href="#a">A. Hai cặp trùng (${A.length})</a><a href="#b">B. Sách in sai, đề thiếu (${B.length})</a><a href="#c">C. Máy nghi trùng (${C.length})</a><a href="#d">D. Nhóm đã chốt (${D.length})</a></nav>
<h2 id="e">Cần chị quyết — ${cauDb.filter((r) => !r.da_duyet).length} câu chưa duyệt, ${E.length} thẻ</h2>
<p class="dan">Hai mươi câu đang ở "Chưa phân dạng": 16 câu hai lượt gán nhóm độc lập chọn khác nhau (thẻ có chữ "hai lượt gán nhóm lệch nhau"), bài 89 b chương I chưa nhóm nào khớp, và ba bài bất biến – tô màu của phụ lục A (một thẻ) bản đồ chưa có nhóm. Chị chọn nhóm, tôi xếp và duyệt. Ba câu còn lại (bài 73 chương III, bài 48 b chương IV, bài 31 phụ lục A) là đề sách in sai. Các thẻ của lô 6 (ôn tập cuối năm, phụ lục A) nằm ở cuối mục này.</p>
${E.join('\n')}
<h2 id="f">Lô 3, 4, 5, 6 — đã làm, chị xem</h2>
<p class="dan">Những chỗ tôi phải tự quyết khi nhập lô 3 (chương I §1, §6 và cả chương II — 105 câu), lô 4 (chương III — 93 câu), lô 5 (chương IV — 130 câu) và lô 6 (ôn tập cuối năm phần Đại, phụ lục A — 79 câu; các thẻ của lô 6 ở cuối mục). Các câu này đã vào kho và đã duyệt; chị thấy chỗ nào không ổn thì bảo, tôi sửa.</p>
${F.join('\n')}
${GHI_CHU_LO4}
${GHI_CHU_LO5}
${GHI_CHU_LO6}
<p class="dan">Sách dừng giữa chừng, kho soạn tiếp đến kết quả: chương I bài 62 b, 62 c (sách in nhầm nhãn lời giải là "63"); chương II bài 17 (kết quả ${toan('\\dfrac{7}{x(x+1)}')}), bài 22, bài 48 (giá trị nhỏ nhất ${toan('2000')} khi ${toan('x=3')}), bài 50.</p>
<p class="dan">Lỗi in của sách ở chương II, kho ghi theo biểu thức đúng: bài 10 a (mẫu in ${toan('(z-y)^2')} thay cho ${toan('(z-x)^2')}), bài 13 (tử in ${toan('48x^2y')} thay cho ${toan('48x^2')}), bài 14 (mẫu in ${toan('4(x+5)(x+5)')}), bài 34 (phần trong ngoặc ${toan('\\dfrac{2abc}{(b-c)(c-a)(a-b)}')} không đúng, không ảnh hưởng kết quả), bài 51 b (in ${toan('\\dfrac{x^2}{b}')} thay cho ${toan('\\dfrac{y^2}{b}')}), bài 51 c (in dấu cộng ở chỗ phải là dấu trừ).</p>
<p class="dan">Chương I bài 5 ("biểu thức nào có giá trị không phụ thuộc vào biến?") giữ nguyên là một câu ba biểu thức như sách, không tách.</p>
<h2 id="a">A. Hai cặp máy báo trùng — đề sách in đúng như vậy</h2>
<p class="dan">Chị hỏi "cái kia là biến đổi chứ, hay đề bài thế?". Cả hai đều là đề của sách: sách cho ý a) ở dạng đã tách sẵn để dẫn sang ý b). Chị đã chốt bỏ ý a) ở cả hai bài.</p>
${A.join('\n')}
<h2 id="b">B. Sách in sai hoặc đề thiếu</h2>
<p class="dan">Sáu câu đầu đã xử lý trong kho và chị đã xem. Câu cuối (bài 89 b) chị đã chốt nhập với kết quả đúng.</p>
${B.join('\n')}
<h2 id="c">C. Máy nghi trùng nhưng không tự bỏ</h2>
${C.join('\n')}
<h2 id="d">D. Bảy câu của lô 1–2 đã chốt nhóm bài</h2>
<p class="dan">Hai lượt gán nhóm độc lập chọn khác nhau; chị đã chọn nhóm cho cả bảy câu, kho đã xếp theo.</p>
${D.join('\n')}
<h2>Lỗi in nhỏ của sách, không ảnh hưởng đề và đáp số</h2>
<p class="dan">Bài 20 b: dòng đầu lời giải in ${toan('4x^4')} thay cho ${toan('4x^2')}. Bài 26 a: dòng kết luận in "a =" thay cho "A =". Bài 38 b: dòng khai triển in ${toan('3xy')} thiếu mũ. Bài 75 a: in ${toan('(2-2)Q(-2)')} thay cho ${toan('(-2+2)Q(-2)')}. Bài 79 b: in ${toan('(m^3+3)')} thay cho ${toan('(m^2+3)')}. Bài 85: hai chỗ gõ nhầm trong các bước giữa. Lời giải trong kho viết theo biểu thức đúng.</p>
</main>
`
const ra = join(DIR, '..', '..', 'k8T-can-xem.html')
writeFileSync(ra, html)
console.log(`${so} thẻ · ${soAnh} ảnh · ${(html.length / 1024).toFixed(0)} KB → ${ra}`)
