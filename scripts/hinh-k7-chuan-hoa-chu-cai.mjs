// Chuẩn hoá HIỂN THỊ chữ cái / tên đoạn thẳng trong kho Hình–Học khối 7 (Thùy 16/11): tên điểm, đoạn, góc, tam giác phải nằm trong $…$ cho đồng bộ
// (ngoài $…$ app hiện kiểu chữ khác — đậm — so với KaTeX). Cũng đổi **AD** (in đậm bằng markdown) → $AD$.
//   node scripts/hinh-k7-chuan-hoa-chu-cai.mjs [--khoi 7] [--ghi] [--mau 25]
// Trường sửa: hinh_hoc_bai_y.loi_dan (trigger lan sang ý) · hinh_hoc_cau_hoi.noi_dung (CÂU ĐƠN; đề ý do trigger ghép) · cau_hoi_y · da_biet · loi_giai · hinh_hoc_cau_lop.noi_dung/loi_giai.
// Chỉ đổi phần NGOÀI $…$; không đụng khối `**Phần 1. …**` / `**Mấu chốt:**` / `[[so-do:…]]` / chữ Việt. Idempotent. Dòng có số dấu $ lẻ ⇒ bỏ qua, báo. Lưu giá trị cũ vào bien-ban khi --ghi.
import pg from 'pg'
import { writeFileSync, mkdirSync } from 'node:fs'
import { bien } from './kho/cau-hinh.mjs'

const argv = process.argv.slice(2)
const GHI = argv.includes('--ghi')
const KHOI = argv.includes('--khoi') ? argv[argv.indexOf('--khoi') + 1] : '7'
const MAU = argv.includes('--mau') ? +argv[argv.indexOf('--mau') + 1] : 25

// từ viết hoa KHÔNG phải tên điểm
const BO_QUA = new Set(['GT', 'KL', 'CMR', 'TH', 'HS', 'GV', 'SGK', 'SAI', 'THCS', 'THPT', 'UBND', 'VD', 'BPT', 'HPT'])   // KHÔNG đưa CM/MC/PT/BT/TN/TL… vào: có thể là tên đoạn thẳng
const LA_MA = /^[IVX]{2,}$/            // II, III, IV…
const TRUOC_LUA_CHON = /(Chọn|chọn|Đáp án|đáp án|Phương án|phương án|Câu|Bài|Hình|hình)\s*$/   // "Chọn A", "Hình A" — chữ đơn không phải điểm
const CHU_CAI = '(?:(?:[A-Z][A-Z]{0,2}|[A-Z][xyzt]|O[mn]|[xyzt][A-Z][xyzt])[\'’′]?)'     // AB, ABC, A', Ax, At, Om (KHÔNG [A-Z][a-z] tổng quát: "Ta", "Ba", "Em" là từ tiếng Việt)
const TOKEN = new RegExp(`(?<![\\p{L}\\p{N}\\\\_{}^])(${CHU_CAI})(?![\\p{L}\\p{N}_])`, 'gu')
const DANH_SACH = new RegExp(`(?<![\\p{L}\\p{N}\\\\])([A-Z][A-Z′']?)((?:\\s*,\\s*[A-Z][A-Z′']?)+)(?![\\p{L}\\p{N}])`, 'gu')   // "A, I, D"

const MO = '\u0001', DONG = '\u0002'      // dấu tạm: đoạn đã bọc ở bước 1–2, bước 3 không động vào
function chuanNgoai(s) {
  // 1) **AD** (chỉ khi bên trong là tên điểm/đoạn/góc) → $AD$
  s = s.replace(/\*\*\s*([A-Z][A-Z′']{0,2}(?:\s*[=,]\s*[A-Z][A-Z′']{0,2})*)\s*\*\*/g, (m, x) => MO + x.replace(/\s*=\s*/g, ' = ').replace(/\s*,\s*/g, ', ') + DONG)
  // 2) danh sách điểm "A, I, D"
  // mọi phần tử CÙNG độ dài ("A, I, D" · "AC, AB"); "AC, K" là hai ý khác nhau ⇒ để bước 3 bọc từng chữ
  s = s.replace(DANH_SACH, (m) => { const ts = m.split(/\s*,\s*/); return ts.some((t) => BO_QUA.has(t) || LA_MA.test(t)) || new Set(ts.map((t) => t.length)).size > 1 ? m : MO + ts.join(', ') + DONG })
  // 3) tên trần còn lại — bỏ qua phần đã bọc
  const dich = s.split(new RegExp(`(${MO}[^${DONG}]*${DONG})`)).map((p, i) => (i % 2 ? p : p.replace(TOKEN, (m, t, off, all) => {
    if (BO_QUA.has(t) || LA_MA.test(t)) return m
    if (t.length === 1 && TRUOC_LUA_CHON.test(all.slice(Math.max(0, off - 12), off))) return m
    if (t.length === 1 && /^[A-D]$/.test(t) && /^\s*[.)]/.test(all.slice(off + 1, off + 3))) return m      // "A." "B)" nhãn phương án
    return MO + t + DONG
  }))).join('')
  return dich.split(MO).join('$').split(DONG).join('$')
}
// tách theo $…$ và các khối giữ nguyên
export function chuanHoa(text) {
  if (!text) return text
  if ((text.match(/\$/g) || []).length % 2) return null          // lẻ $ — không dám sửa
  const out = text.split('\n').map((dong) => {
    if (/^\s*\*\*[^*]+\*\*:?\s*$/.test(dong) || /^\s*\[\[so-do:/.test(dong) || /^\s*\*\*(Phần|Mấu chốt|Bước|Chú ý|Sơ đồ)/.test(dong)) return dong
    return dong.split(/(\$\$[^$]*\$\$|\$[^$]*\$)/).map((p, i) => (i % 2 ? p : chuanNgoai(p))).join('')   // $$…$$ và $…$ đều là toán — không đụng
  }).join('\n')
  return out
}

if (process.argv[1].endsWith('hinh-k7-chuan-hoa-chu-cai.mjs')) {
  const c = new pg.Client({ connectionString: (GHI ? process.env.DATABASE_URL_RW : null) ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
  const q = async (s, p) => (await c.query(s, p)).rows
  const bb = { khoi: KHOI, truoc: [] }, TAN = {}
  const CAC = [
    { ten: 'hinh_hoc_bai_y.loi_dan', bang: 'hinh_hoc_bai_y', khoa: 'ma_bai_y', cot: 'loi_dan',
      sql: `select y.ma_bai_y id, y.loi_dan v from hinh_hoc_bai_y y join hinh_hoc_bai b on b.ma_bai = y.dang_chinh where b.khoi = $1 and y.xoa_at is null` },
    { ten: 'hinh_hoc_cau_hoi.noi_dung (câu đơn)', bang: 'hinh_hoc_cau_hoi', khoa: 'ma_cau', cot: 'noi_dung',
      sql: `select h.ma_cau id, h.noi_dung v from hinh_hoc_cau_hoi h join hinh_hoc_bai b on b.ma_bai = h.dang_chinh where b.khoi = $1 and h.xoa_at is null and h.bai_y is null` },
    { ten: 'hinh_hoc_cau_hoi.cau_hoi_y', bang: 'hinh_hoc_cau_hoi', khoa: 'ma_cau', cot: 'cau_hoi_y',
      sql: `select h.ma_cau id, h.cau_hoi_y v from hinh_hoc_cau_hoi h join hinh_hoc_bai b on b.ma_bai = h.dang_chinh where b.khoi = $1 and h.xoa_at is null and h.bai_y is not null and h.cau_hoi_y is not null` },
    { ten: 'hinh_hoc_cau_hoi.da_biet', bang: 'hinh_hoc_cau_hoi', khoa: 'ma_cau', cot: 'da_biet',
      sql: `select h.ma_cau id, h.da_biet v from hinh_hoc_cau_hoi h join hinh_hoc_bai b on b.ma_bai = h.dang_chinh where b.khoi = $1 and h.xoa_at is null and h.bai_y is not null and coalesce(h.da_biet, '') <> ''` },
    { ten: 'hinh_hoc_cau_hoi.loi_giai', bang: 'hinh_hoc_cau_hoi', khoa: 'ma_cau', cot: 'loi_giai',
      sql: `select h.ma_cau id, h.loi_giai v from hinh_hoc_cau_hoi h join hinh_hoc_bai b on b.ma_bai = h.dang_chinh where b.khoi = $1 and h.xoa_at is null and coalesce(h.loi_giai, '') <> ''` },
    { ten: 'hinh_hoc_cau_lop.noi_dung', bang: 'hinh_hoc_cau_lop', khoa: 'ma_cau', cot: 'noi_dung',
      sql: `select l.ma_cau id, l.noi_dung v from hinh_hoc_cau_lop l where l.xoa_at is null and l.dang_bai_id in (select ma_bai from hinh_hoc_bai where khoi = $1)` },
    { ten: 'hinh_hoc_cau_lop.loi_giai', bang: 'hinh_hoc_cau_lop', khoa: 'ma_cau', cot: 'loi_giai',
      sql: `select l.ma_cau id, l.loi_giai v from hinh_hoc_cau_lop l where l.xoa_at is null and coalesce(l.loi_giai, '') <> '' and l.dang_bai_id in (select ma_bai from hinh_hoc_bai where khoi = $1)` },
  ]
  try {
    await c.query('begin')
    for (const f of CAC) {
      const rows = await q(f.sql, [KHOI])
      let doi = 0, le = 0, mau = 0
      for (const r of rows) {
        const moi = chuanHoa(r.v)
        if (moi === null) { le++; continue }
        if (moi === r.v) continue
        doi++
        if (mau < MAU && f.cot !== 'loi_giai') { mau++; console.log(`  ${r.id}\n    - ${r.v.slice(0, 150).replace(/\n/g, ' ⏎ ')}\n    + ${moi.slice(0, 150).replace(/\n/g, ' ⏎ ')}`) }
        for (const m of moi.matchAll(/\$([^$]*)\$/g)) if (!r.v.includes('$' + m[1] + '$')) TAN[m[1]] = (TAN[m[1]] || 0) + 1
        bb.truoc.push({ bang: f.bang, khoa: f.khoa, id: r.id, cot: f.cot, cu: r.v })
        if (GHI) await c.query(`update ${f.bang} set ${f.cot} = $2 where ${f.khoa} = $1`, [r.id, moi])
      }
      console.log(`${f.ten.padEnd(40)} ${String(rows.length).padStart(4)} dòng · sửa ${String(doi).padStart(4)} · bỏ qua (lẻ $) ${le}`)
    }
    console.log('Chữ được bọc mới (nhiều nhất):', Object.entries(TAN).sort((a, b) => b[1] - a[1]).slice(0, 70).map(([k, v]) => `${k}×${v}`).join('  '))
    if (GHI) { mkdirSync('kho-rules/hinh/k7-thang-hang', { recursive: true }); writeFileSync(`kho-rules/hinh/k7-thang-hang/bien-ban-chuan-hoa-chu-cai-k${KHOI}.json`, JSON.stringify(bb)) }
    await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
  } catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
  await c.end()
}
