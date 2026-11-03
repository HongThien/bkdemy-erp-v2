// xep-khong-tt.mjs [--ghi] — LƯỢT HÌNH cuối kì 1 K9 (03/11) đã để MỌI câu vào HH00108 (Vị trí tương đối đt–đường tròn) "tạm";
// câu KHÔNG phải tiếp tuyến (phanloai.json tt=khong_tt) phải về đúng bài. Chỉ đổi dang_chinh, mã câu bất biến.
// Chỉ đụng câu đang ở HH00108 và có tt=khong_tt trong phanloai (nhân chứng: nội dung đề trong bản soạn khớp DB — như gan-mo-hinh-tt.mjs).
// Ghi nhật ký hoàn tác ra xep-khong-tt.undo.json. Mặc định ROLLBACK.
import pg from 'pg'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const GHI = process.argv.includes('--ghi')
const ENV = readFileSync(join(HERE, '../../../../../.env'), 'utf8')
const lay = (k) => { const m = ENV.match(new RegExp('[ \\t]*' + k + '[ \\t]*=[ \\t]*(.+?)[ \\t\\r]*$', 'm')); return m ? m[1].replace(/^["']|["']$/g, '') : null }
const chuan = (s) => String(s ?? '').normalize('NFD').replace(/\p{M}/gu, '').replace(/[đĐ]/g, 'd').replace(/\$/g, '').replace(/\\[a-zA-Z]+/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().toLowerCase()
const dau = (s) => String(s).replace(/\\(sin|cos|tan|cot)/g, ' $1 ').replace(/\$/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, ' ').toLowerCase()

function docSoan(f) {
  const out = []; let phan = 0, cur = null
  for (const dong of readFileSync(f, 'utf8').split(/\r?\n/)) {
    let m
    if ((m = dong.match(/## PHẦN (\d+)/))) { phan = Number(m[1]); continue }
    if ((m = dong.match(/^### ([^|]+?)\s*\|/))) { cur = { khoa: `P${phan} ${m[1].trim()}`, de: [], trongDe: false }; out.push(cur); continue }
    if (!cur) continue
    if (/\*\*Đề:\*\*/.test(dong)) { cur.trongDe = true; cur.de.push(dong.replace(/^\*\*Đề:\*\*\s*/, '')); continue }
    if (/\*\*[^*]+:\*\*|^\*\*Phần/.test(dong)) { cur.trongDe = false; continue }
    if (cur.trongDe) cur.de.push(dong)
  }
  return out.map((x) => ({ khoa: x.khoa, de: x.de.join(' ') }))
}

// ── luật xếp (chữ có dấu, đã đọc tay từng câu 03/11) ──
const B = { LG: 'HH00095', DT: 'HH00105', CUNG: 'HH00106', QUAT: 'HH00107', TT: 'HH00108', DT2: 'HH00110', DCAO: 'HH00086', PARK: 'HH00140' }
const GIU_TT = new Set(['HHC011335', 'HHC011484'])                                   // vị trí tương đối đường thẳng – đường tròn
const THU_CONG = {
  HHC011431: B.CUNG,                                                                  // vòm cầu: độ dài cung
  HHC011347: B.QUAT, HHC011413: B.QUAT, HHC011388: B.QUAT,                            // diện tích hình cung / phần đất / vành khăn
  HHC011372: B.QUAT, HHC011402: B.QUAT, HHC011495: B.QUAT, HHC011529: B.QUAT,        // hình quạt: a) diện tích
  HHC011334: B.DT, HHC011549: B.DT, HHC011482: B.DT, HHC011550: B.DT,                // đường kính / nửa hình tròn
  HHC011333: B.DCAO,                                                                  // hệ thức đường cao trong tam giác vuông
  HHC011336: B.DT2, HHC011483: B.DT2, HHC011452: B.DT2,                               // hai đường tròn
  HHC011306: B.LG, HHC011320: B.LG, HHC011342: B.LG, HHC011350: B.LG, HHC011360: B.LG, HHC011361: B.LG,
  HHC011428: B.LG, HHC011537: B.LG, HHC011416: B.LG, HHC011417: B.LG, HHC011524: B.LG, HHC011551: B.LG, HHC011563: B.LG, HHC011585: B.LG,
  HHC011362: B.PARK, HHC011363: B.PARK, HHC011437: B.PARK, HHC011438: B.PARK, HHC011481: B.PARK,   // bài thực tế / cực trị hình: chưa có bài hợp
}
const luat = [
  [B.DT2, /vị trí tương đối của hai đường tròn|hai đường tròn .*(cắt nhau|tiếp xúc|đựng nhau|ngoài nhau)/],
  [B.CUNG, /(độ dài|chiều dài) cung|kim phút|con lắc|số đo cung|đầu kim/],
  [B.QUAT, /vành khuyên|quạt tròn|hình quạt|chiếc quạt|phần giấy|pizza|đĩa|vòng đệm|bánh xe|khăn trải|diện tích (của )?(hình tròn|phần|mặt|bề mặt)|chu vi .*hình tròn|đống cát|giếng|chiếc trống|buộc .*dê/],
  [B.LG, /sin|cos|tan|cot|tỉ số lượng giác|giải tam giác|vuông tại|góc nghiêng|phương (nằm ngang|thẳng đứng)|bóng|tia nắng|góc nâng|góc hạ|tháp|máy bay|thang|tàu ngầm|dốc|quan sát|làm tròn đến độ|làm tròn đến phút|dây diều|đu quay|xích đu|khinh khí cầu|flycam|cột đèn|hải đăng|góc nhìn|phương nhìn/],
  [B.DT, /nội tiếp|đường tròn|cùng thuộc một đường tròn|bốn điểm|ba điểm .*cùng|cung|góc nhọn|đường chéo/],
]
const xep = (ma, de) => {
  if (GIU_TT.has(ma)) return B.TT
  if (THU_CONG[ma]) return THU_CONG[ma]
  const t = dau(de)
  for (const [b, re] of luat) if (re.test(t)) return b
  return null
}

const c = new pg.Client({ connectionString: lay('DATABASE_URL'), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('begin')
const ds = JSON.parse(readFileSync(join(HERE, 'ds.json'), 'utf8'))
const kt = new Map()   // ma_cau → de gốc có dấu (đã qua nhân chứng) cho câu khong_tt
for (const x of ds) {
  const f = join(HERE, `${x.ma}.hinh.soan.md`), pj = join(HERE, `${x.ma}.hinh.phanloai.json`), dg = join(x.LV, 'da-ghi.txt')
  if (!existsSync(dg) || !existsSync(f) || !existsSync(pj)) continue
  const tl = readFileSync(dg, 'utf8').match(/[0-9a-f-]{36}/)?.[0]
  const soan = docSoan(f), pl = JSON.parse(readFileSync(pj, 'utf8'))
  const db = (await c.query(`select tc.ma_cau, h.noi_dung from tai_lieu_cau tc join tai_lieu_phan p on p.id=tc.phan_id join hinh_hoc_cau_hoi h on h.ma_cau=tc.ma_cau where p.tai_lieu_id=$1 order by p.thu_tu, tc.thu_tu`, [tl])).rows
  if (db.length !== soan.length) continue
  const lech = soan.filter((s, i) => { const a = chuan(s.de).slice(0, 50), b = chuan(db[i].noi_dung).slice(0, 50); return !(a && b && (b.startsWith(a.slice(0, 30)) || a.startsWith(b.slice(0, 30)))) })
  if (lech.length) continue
  soan.forEach((s, i) => { if (pl[s.khoa]?.tt === 'khong_tt' && !kt.has(db[i].ma_cau)) kt.set(db[i].ma_cau, db[i].noi_dung) })
}
const dem = {}, undo = [], bo = []
for (const [ma, de] of kt) {
  const dich = xep(ma, de)
  if (!dich) { bo.push(ma); continue }
  const r = await c.query(`update hinh_hoc_cau_hoi set dang_chinh=$2 where ma_cau=$1 and dang_chinh='HH00108' and xoa_at is null returning ma_cau`, [ma, dich])
  if (r.rowCount === 1 && dich !== B.TT) { dem[dich] = (dem[dich] ?? 0) + 1; undo.push({ ma_cau: ma, tu: 'HH00108', den: dich }) }
}
console.log('câu khong_tt đã qua nhân chứng:', kt.size, '| đã chuyển:', dem, '| chưa xếp được:', bo)
if (GHI) { writeFileSync(join(HERE, 'xep-khong-tt.undo.json'), JSON.stringify(undo, null, 1)); await c.query('commit'); console.log('✔ ĐÃ GHI', undo.length, '(nhật ký hoàn tác: xep-khong-tt.undo.json)') }
else { await c.query('rollback'); console.log('Chạy thử — ROLLBACK. Thêm --ghi để ghi thật.') }
await c.end()
