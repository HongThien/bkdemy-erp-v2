// gop-noi-dung.mjs — gộp nội dung đã soạn (nhom1–3.txt + vd-tu-soan.txt) vào ĐÚNG cấu trúc nhóm/dạng AM–GM hiện có của bản đồ 8T (Thùy dựng, 11 dạng).
//   node gop-noi-dung.mjs            ⇒ in tóm tắt + ghi noi-dung-gop.json (CHƯA ghi DB; ghi DB bằng ghi-ban-do.mjs)
// Nguồn: Mai Thành Luân, Chương 2–3 (ví dụ là bản soạn lại của Claude, lời giải kiểm tay từng bước) + 3 ví dụ tự soạn (tách trong vd-tu-soan.txt).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const DIR = dirname(fileURLToPath(import.meta.url))

function doc(f) {
  const t = readFileSync(join(DIR, f), 'utf8').replace(/\r\n/g, '\n')
  const nhom = { dangs: [] }; let cur = null, chuaTen = null
  const phan = t.split(/\n(?=#(?:NHOM|DANG)\s)/)
  for (const p of phan) {
    const dau = p.split('\n')[0], than = p.slice(dau.length + 1)
    const o = { mota: '', ghichu: '', lt: '', vd: '' }; let k = null
    for (const d of than.split('\n')) { const m = d.match(/^@(MOTA|GHICHU|LT|VD)\s*$/); if (m) { k = m[1].toLowerCase(); continue } if (k) o[k] += d + '\n' }
    if (dau.startsWith('#NHOM')) Object.assign(nhom, { ten: dau.split('|')[1].trim(), ...o })
    else if (dau.startsWith('#DANG')) nhom.dangs.push({ ten: dau.split('|')[1].trim(), ...o })
  }
  return nhom
}
const N1 = doc('nhom1.txt'), N2 = doc('nhom2.txt'), N3 = doc('nhom3.txt')
const dangTen = (n, ten) => { const d = n.dangs.find((x) => x.ten.includes(ten)); if (!d) throw new Error('không thấy dạng: ' + ten); return d }
const vdTach = (s) => s.trim().split(/\n(?=##VD)/).map((x) => x.trim()).filter(Boolean)
const tatCa = [...[N1, N2, N3].flatMap((n) => n.dangs.flatMap((d) => vdTach(d.vd)))]
const ownTxt = readFileSync(join(DIR, 'vd-tu-soan.txt'), 'utf8').replace(/\r\n/g, '\n').split('#TACH')
const own = [vdTach(ownTxt[0]), vdTach(ownTxt[1])]
const vd = (khoa) => { const r = tatCa.filter((x) => x.includes(khoa)); if (r.length !== 1) throw new Error(`khoá VD "${khoa}" khớp ${r.length}`); return r[0] }
const nhom = (...xs) => xs.map((x) => x.trim()).filter(Boolean).join('\n\n')
const ltPP = (d) => d.lt.trim()

const out = {
  nhom: {
    NNB01742: { mo_ta: N1.mota.trim(), ly_thuyet: N1.lt.trim() },
    NNB01743: { mo_ta: N2.mota.trim(), ly_thuyet: N2.lt.trim() },
    NNB01745: { mo_ta: N3.mota.trim(), ly_thuyet: N3.lt.trim() },
  },
  dang: {
    NDB01599: { mo_ta: dangTen(N1, '1 biến dạng tổng').mota.trim(), ly_thuyet: ltPP(dangTen(N1, '1 biến dạng tổng')), vd: [vd('a^2+5}{\\sqrt{a^2+1}'), ...own[0]] },
    NDB01600: { mo_ta: dangTen(N1, '1 biến dạng tích').mota.trim(), ly_thuyet: ltPP(dangTen(N1, '1 biến dạng tích')), vd: own[1] },
    NDB01601: { mo_ta: dangTen(N1, 'nhiều biến dạng tổng').mota.trim(), ly_thuyet: ltPP(dangTen(N1, 'nhiều biến dạng tổng')), vd: [vd('a+\\dfrac8{b(a-b)}'), vd('\\dfrac a{b+c}+\\dfrac b{c+a}+\\dfrac c{a+b}\\ge\\dfrac32')] },
    NDB01602: { mo_ta: dangTen(N1, 'nhiều biến dạng tích').mota.trim(), ly_thuyet: ltPP(dangTen(N1, 'nhiều biến dạng tích')), vd: [vd('(a^2+2b^2)(b^2+2c^2)'), vd('(\\sqrt a+\\sqrt b)^4')] },
    NDB01603: { mo_ta: dangTen(N2, 'Điểm rơi của biểu thức dạng 1 biến').mota.trim(), ly_thuyet: ltPP(dangTen(N2, 'Điểm rơi của biểu thức dạng 1 biến')), vd: [vd('$A=a+\\dfrac1a$'), vd('$A=a+\\dfrac1{a^2}$')] },
    NDB01604: { mo_ta: dangTen(N2, 'đối xứng nhiều biến').mota.trim(), ly_thuyet: ltPP(dangTen(N2, 'đối xứng nhiều biến')), vd: [vd('\\dfrac a{b+c}+\\dfrac b{c+a}+\\dfrac c{a+b}+2\\left'), vd('a\\left(\\dfrac a2')] },
    NDB01605: {
      mo_ta: 'các biến có vai trò khác nhau, hoặc bất đẳng thức không đối xứng nên đoán $a=b=c$ là sai (thử thấy hai vế không bằng nhau); giả thiết thường là bất phương trình nên điểm rơi nằm trên biên. So sánh vai trò của từng biến hoặc từng nhóm biến để dự đoán điểm rơi (ví dụ $a=b$ và $c=a+b$), rồi chọn các đánh giá có dấu "=" đúng tại điểm đó.',
      ly_thuyet: nhom(ltPP(dangTen(N2, 'Giả thiết là bất phương trình')), ltPP(dangTen(N2, 'không đối xứng'))),
      vd: [vd('a+2b+3c\\ge16'), vd('(a+b)(a+b+c)^2\\ge16abc'), vd('(a+b+c)^2(a+b+c+d)^2\\ge108abcd')],
    },
    NDB01606: { mo_ta: 'biểu thức chỉ phụ thuộc vào một đại lượng ghép (như $t=ab$) với giả thiết là bất phương trình; trước hết chặn đại lượng đó, rồi thêm (tách) một biểu thức $k\\cdot t$ theo điểm rơi để ghép cặp nghịch đảo, phần dư xử lí bằng chặn vừa có.', ly_thuyet: ltPP(dangTen(N2, 'chỉ phụ thuộc vào tích')), vd: [vd('$A=ab+\\dfrac{64}{ab}$'), vd('\\dfrac4{a^2+b^2}+\\dfrac4{ab}+ab\\ge7')] },
    NDB01608: { mo_ta: N3.dangs.find((d) => d.ten.includes('Ghép cặp')).mota.trim() + '\n' + N3.dangs.find((d) => d.ten.includes('mẫu số')).mota.trim(), ly_thuyet: nhom(ltPP(N3.dangs.find((d) => d.ten.includes('Ghép cặp'))), ltPP(N3.dangs.find((d) => d.ten.includes('mẫu số')))), vd: [vd('\\dfrac{ab}c+\\dfrac{bc}a'), vd('(p-a)(p-b)(p-c)\\le'), vd('\\dfrac1{p-a}+\\dfrac1{p-b}'), vd('\\dfrac1{3a+2b}')] },
    NDB01609: { mo_ta: dangTen(N3, 'Tách hạng tử').mota.trim(), ly_thuyet: ltPP(dangTen(N3, 'Tách hạng tử')), vd: [vd('6a^2+6b^2+c^2\\ge21'), vd('10a^2+10b^2+c^2\\ge36')] },
    NDB01610: {
      mo_ta: nhom(dangTen(N3, 'Thêm một hằng số').mota, dangTen(N3, 'Gom phân thức').mota, dangTen(N3, 'Nhân thêm hằng số').mota),
      ly_thuyet: nhom(ltPP(dangTen(N3, 'Thêm một hằng số')), ltPP(dangTen(N3, 'Gom phân thức')), ltPP(dangTen(N3, 'Nhân thêm hằng số'))),
      vd: [vd('a^3+b^3+c^3\\ge3'), vd('\\dfrac{a^2}b+\\dfrac{b^2}c+\\dfrac{c^2}a\\ge a+b+c'), vd('\\dfrac{a^2}{b+2c}'), vd('\\dfrac{a-d}{b+d}'), vd('\\sqrt[3]{a+2b}'), vd('\\sqrt{3a+b}')],
    },
  },
}
for (const d of Object.values(out.dang)) {
  d.vi_du = d.vd.join('\n\n'); delete d.vd
  d.mo_ta = d.mo_ta.replace(/\(dạng tôi đề xuất thêm\)\s*/g, '').replace(/\n\n+/g, '\n').trim()
}
writeFileSync(join(DIR, 'noi-dung-gop.json'), JSON.stringify(out, null, 1))
for (const [id, d] of Object.entries(out.dang)) console.log(id.padEnd(9), 'mô tả', String(d.mo_ta.length).padStart(4), '· LT', String(d.ly_thuyet.length).padStart(4), '· ví dụ', (d.vi_du.match(/^##VD/gm) ?? []).length)
