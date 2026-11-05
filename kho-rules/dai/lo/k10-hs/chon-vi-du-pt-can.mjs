// Tìm câu THẬT trong Kho đề thi K10 (dai_cau_hoi, ma T110…) cho các dạng CĐ3-4 mà mẫu 753 câu thiếu. Chỉ ĐỌC. In số câu + ứng viên.
import fs from 'node:fs'
import pg from 'pg'
process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const rows = (await c.query(`select ma_cau, loai_cau, noi_dung, lua_chon, dap_an, loi_giai, anh_de, menh_de from dai_cau_hoi
  where ma_cau like 'T110%' and loi_giai is not null and length(loi_giai) > 40 and noi_dung !~ 'vec|Oxy|elip|hypebol|đường tròn|parabol \\(P\\)' and (noi_dung ilike '%phương trình%' or noi_dung ilike '%bất phương trình%' or noi_dung ilike '%nghiệm%')`)).rows
await c.end()
const LOP = {
  'PT căn: √f=√g': (s) => /\\sqrt\{[^=]*\}\s*=\s*\\sqrt/.test(s) && !/\|/.test(s) && !/\bm\b/.test(s),
  'PT căn: √f=g': (s) => /\\sqrt\{[^=]*\}\s*=\s*(?!\\sqrt)[-0-9a-z(]/.test(s) && !/\bm\b/.test(s) && !/\|/.test(s) && !/\\sqrt[^=]*\\sqrt/.test(s),
  'PT căn khác': (s) => (/\\sqrt[^=]*\\sqrt[^=]*=/.test(s) || /x\s*[+-]\s*\\sqrt|\\sqrt\{[^}]*\}\s*[+-]\s*[0-9a-z]+\s*=/.test(s)) && !/\bm\b/.test(s),
  'PT giá trị tuyệt đối / trùng phương': (s) => /phương trình/i.test(s) && (/\|[^|]*x[^|]*\|\s*=|=\s*\|/.test(s) || /x\^\{?4\}?[^=]*=\s*0/.test(s)),
  'm để PT chứa căn': (s) => /\\sqrt/.test(s) && /\bm\b/.test(s) && /nghiệm/.test(s),
  'PT căn thực tế/hình': (s) => /\\sqrt/.test(s) && /(km|m\/s|người|xe |thang|tường|ô tô|chiều dài|chiều rộng|cạnh|giờ|phút)/i.test(s) && /phương trình|bao nhiêu|tính/.test(s),
  'BPT tích / thương': (s) => /bất phương trình/i.test(s) && /\\dfrac|\)\(|\\cdot|\)\s*\(/.test(s) && !/\\sqrt/.test(s) && /[<>]|\\le|\\ge/.test(s),
}
const out = {}
for (const [ten, f] of Object.entries(LOP)) {
  const ok = rows.filter((r) => !r.menh_de && f(r.noi_dung))
  out[ten] = ok.sort((a, b) => a.loi_giai.length - b.loi_giai.length).slice(0, 8)
  console.log(`\n== ${ten}: ${ok.length} câu`)
  for (const r of out[ten].slice(0, 6)) console.log(' ', r.ma_cau, r.loai_cau.slice(0, 3), r.anh_de ? 'H' : '-', r.loi_giai.length, '|', r.noi_dung.replace(/\n/g, ' ').slice(0, 130))
}
fs.writeFileSync(new URL('./ra/ung-vien-cd34.json', import.meta.url), JSON.stringify(out, null, 2))
