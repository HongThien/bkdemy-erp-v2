// Sửa lỗi KaTeX đỏ: lệnh toán (\parallel, \perp, \in…) nằm TRONG \text{...} — vd $\text{AB\parallel CD}$ (Thùy 04/11, mã HHC001872).
// Biến đổi: \text{AB\parallel CD}  →  \text{AB}\parallel\text{ CD}   (chỉ đụng nhóm \text{} không lồng ngoặc có lệnh toán)
// Chạy: node scripts/sua-latex-text-lenh-toan.mjs         → thử trong ROLLBACK, in số liệu + mẫu
//       node scripts/sua-latex-text-lenh-toan.mjs --ghi   → ghi thật (1 transaction; còn sót ⇒ ROLLBACK)
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')

const LENH = 'parallel|perp|angle|widehat|triangle|Rightarrow|Leftrightarrow|cap|cup|in|notin|subset|neq|leq|geq|sim|cong|vec|overrightarrow|infty|pm|cdot|times|le|ge|ne'
const reNhom = /\\text\{([^{}]*)\}/g
const reLenh = new RegExp(`\\\\(?:${LENH})(?![A-Za-z])`)
const reTach = new RegExp(`(\\\\(?:${LENH})(?![A-Za-z]))`)

function sua(s) {
  return s.replace(reNhom, (m, x) => {
    if (!reLenh.test(x)) return m
    // split có nhóm bắt ⇒ phần tử lẻ là lệnh toán, phần tử chẵn là chữ
    return x.split(reTach).map((p, i) => (i % 2 ? p + ' ' : p === '' ? '' : `\\text{${p}}`)).join('').replace(/ $/, '')
  })
}

const BANG = [
  ['bai_test_cau', ['loi_giai', 'noi_dung']],
  ['dai_cau_hoi', ['loi_giai', 'noi_dung']],
  ['dai_cau_menh_de', ['loi_giai', 'noi_dung']],
  ['hgt_cau_hoi', ['loi_giai', 'noi_dung']],
  ['hgt_cau_menh_de', ['loi_giai', 'noi_dung']],
  ['hinh_hoc_cau_hoi', ['loi_giai', 'noi_dung']],
]
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  const dien0 = +(await c.query('select count(*) n from dai_cau_form_dien where xoa_at is null')).rows[0].n
  let tong = 0
  const mau = []
  for (const [t, cols] of BANG) {
    for (const col of cols) {
      const rows = (await c.query(`select ctid::text k, "${col}" v from "${t}" where "${col}" like '%\\text{%'`)).rows
      let n = 0
      for (const r of rows) {
        const moi = sua(r.v)
        if (moi === r.v) continue
        const u = await c.query(`update "${t}" set "${col}"=$3 where ctid=$1::tid and "${col}"=$2`, [r.k, r.v, moi])
        if (u.rowCount !== 1) throw new Error(`update lệch ${t}.${col} ${r.k}`)
        n++
        if (mau.length < 6) { const i = r.v.search(reLenh); mau.push([t, r.v.match(reNhom)?.find((x) => reLenh.test(x)), moi.match(/\\text\{[^{}]*\}\\[A-Za-z]+\s?\\text\{[^{}]*\}/)?.[0]]) }
      }
      console.log(`${t}.${col}: sửa ${n}/${rows.length}`)
      tong += n
      // còn sót?
      const sot = (await c.query(`select "${col}" v from "${t}" where "${col}" like '%\\text{%'`)).rows.filter((r) => { const g = r.v.match(reNhom) || []; return g.some((x) => reLenh.test(x)) }).length
      if (sot) throw new Error(`còn sót ${sot} ở ${t}.${col}`)
    }
  }
  const dien1 = +(await c.query('select count(*) n from dai_cau_form_dien where xoa_at is null')).rows[0].n
  console.log('Form Điền Ô còn hiệu lực:', dien0, '→', dien1, '(trigger thu hồi khi lời giải đổi)')
  console.log('Tổng dòng sửa:', tong); console.log('Mẫu:'); for (const m of mau) console.log(' ', m[1], '=>', m[2])
  if (GHI) { await c.query('commit'); console.log('ĐÃ GHI') } else { await c.query('rollback'); console.log('Thử xong — ROLLBACK (thêm --ghi)') }
} catch (e) { await c.query('rollback'); console.error('LỖI, ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
