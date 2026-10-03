// Dựng BỘ ĐỐI CHIẾU để đề xuất ánh xạ DẠNG Hạt Mầm → dạng khtn_ban_do của 1 khối (chỉ đọc DB, không ghi).
// Mỗi chuyên đề Hạt Mầm: chuyên đề ERP ứng viên (theo độ giống tên, mọi chuyên đề cùng khối xếp hạng), dạng 2 bên + câu mẫu.
// Chạy: node scripts/khtn-hatmam/bo-doi-chieu-dang.mjs <hatmam.json> <khối> <ra.md>
import fs from 'node:fs'
import pg from 'pg'
process.loadEnvFile('.env')
const [, , vao, khoi, ra] = process.argv
const { cay, cau } = JSON.parse(fs.readFileSync(vao, 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const kK = 'K0' + khoi
const erpDang = (await c.query(`select ma_dang, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, mo_ta_ngan from khtn_ban_do where khoi = $1 order by ma_dang`, [khoi])).rows
const mau = (await c.query(`select dang_chinh, (array_agg(left(regexp_replace(noi_dung, '\\s+', ' ', 'g'), 160) order by random()))[1:2] m, count(*)::int n
  from khtn_cau_hoi where xoa_at is null and dang_chinh like $1 group by 1`, [kK + '%'])).rows
const mauErp = new Map(mau.map((r) => [r.dang_chinh, r]))
const tu = (s) => new Set((s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 2))
const jac = (a, b) => { const A = tu(a), B = tu(b); const i = [...A].filter((x) => B.has(x)).length; return A.size + B.size ? i / (A.size + B.size - i) : 0 }
const cdErp = [...new Map(erpDang.map((d) => [d.ma_chuyen_de, d.ten_chuyen_de])).entries()]
let out = `# Đối chiếu dạng KHTN khối ${khoi}: Hạt Mầm → bản đồ ERP\n\nDạng ERP khối ${khoi}: ${erpDang.length} · chuyên đề ERP: ${cdErp.length}\n\n## Toàn bộ chuyên đề ERP khối ${khoi}\n`
for (const [ma, ten] of cdErp) out += `- ${ma} ${ten}: ${erpDang.filter((d) => d.ma_chuyen_de === ma).map((d) => `${d.ma_dang} «${d.ten_dang}» (mức ${d.muc_do}, ${mauErp.get(d.ma_dang)?.n ?? 0} câu)`).join(' · ')}\n`
for (const [maCd, cd] of Object.entries(cay.chuyenDe).filter(([m]) => m.startsWith(kK))) {
  const ungVien = cdErp.map(([m, t]) => ({ m, t, j: jac(cd.ten.replace(/^Chuyên đề [\d.]+\.\s*/, ''), t) })).sort((a, b) => b.j - a.j).slice(0, 3)
  out += `\n## HM ${maCd} ${cd.ten} (SGK ${cd.sgk ?? '?'})\nỨng viên ERP: ${ungVien.map((u) => `${u.m} «${u.t}» (${u.j.toFixed(2)})`).join(' · ')}\n`
  for (const [maD, d] of Object.entries(cay.dang).filter(([m]) => m.startsWith(maCd))) {
    const ds = cau.filter((x) => x.dang === maD)
    const muc = ds.reduce((a, x) => (a[x.muc_do] = (a[x.muc_do] || 0) + 1, a), {})
    out += `- **${maD}** ${d.ten}${d.ghi ? ' ' + d.ghi : ''} — ${ds.length} câu, mức ${JSON.stringify(muc)}\n`
    for (const x of ds.filter((_, i) => i % Math.max(1, Math.floor(ds.length / 2)) === 0).slice(0, 2)) out += `  - «${x.de.replace(/!\[[^\]]*\]\([^)]*\)/g, '[hình]').slice(0, 170)}»\n`
  }
  for (const u of ungVien.slice(0, 2)) for (const d of erpDang.filter((e) => e.ma_chuyen_de === u.m)) {
    const m = mauErp.get(d.ma_dang)
    out += `  · ERP ${d.ma_dang} «${d.ten_dang}»${m ? ': ' + m.m.map((x) => `«${x}»`).join(' ') : ' (0 câu)'}\n`
  }
}
fs.writeFileSync(ra, out)
console.log('ok', (out.length / 1024).toFixed(0), 'KB')
await c.end()
