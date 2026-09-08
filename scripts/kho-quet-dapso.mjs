// QUÉT ĐÁP SỐ TOÀN KHO bằng bộ tính máy (mcq-auto.tinh): câu nào máy tính được thì so với dap_an kho.
//   node scripts/kho-quet-dapso.mjs [--kho dai] [--out lech.json]
// Chỉ ĐỌC. Kết quả: phủ (máy tính được bao nhiêu %), khớp, LỆCH (nghi đáp số kho sai → đưa người soát).
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { tinh } from './mcq-auto.mjs'
import { parseHuuTi } from './lib/huuti.mjs'
const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const kho = opt('--kho', 'dai')
const url = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1]
const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20000 }); await c.connect()
const { rows } = await c.query(`select q.ma_cau, q.dang_chinh, b.khoi, b.ten_dang, q.noi_dung, q.dap_an, q.nguon, q.nguon_giai, q.da_duyet
  from ${kho}_cau_hoi q left join ${kho}_ban_do b on b.ma_dang = q.dang_chinh
  where q.xoa_at is null and q.dap_an is not null and q.dap_an <> ''`)
await c.end()
const tk = { tong: rows.length, ds_parse: 0, may_tinh: 0, khop: 0, lech: 0 }
const byKhoi = {}, byDang = {}, lech = []
for (const q of rows) {
  const k = byKhoi[q.khoi ?? '?'] ??= { tong: 0, may: 0, khop: 0, lech: 0 }; k.tong++
  const key = parseHuuTi(q.dap_an); if (!key.ok) continue
  // CHỈ câu mà đề = 1 biểu thức: phần chữ ngoài $…$ ngắn ("Tính:", "Tìm x biết:") và KHÔNG chứa số — toán có lời thì
  // máy vớ 1 con số trong đề rồi "tính" ra rác (lần quét đầu: 627 "lệch" mà phần lớn là báo giả kiểu này).
  const chu = q.noi_dung.replace(/\$[^$]*\$/g, ' ').replace(/\$.*$/, ' ').replace(/\s+/g, ' ').trim()
  if (chu.length > 45 || /\d/.test(chu)) continue
  tk.ds_parse++
  const r = tinh(q.noi_dung); if (!r.ok) continue
  tk.may_tinh++; k.may++
  const d = byDang[q.dang_chinh] ??= { ten: q.ten_dang, may: 0, lech: 0, ng: {} }; d.may++
  const ngk = q.nguon === 'clone' ? 'clone' : 'goc'; const ng = d.ng[ngk] ??= { may: 0, lech: 0 }; ng.may++
  if (r.canon === key.canon) { tk.khop++; k.khop++ } else { tk.lech++; k.lech++; d.lech++; ng.lech++; lech.push({ ma_cau: q.ma_cau, dang: q.dang_chinh, khoi: q.khoi, nguon: q.nguon, nguon_giai: q.nguon_giai, da_duyet: q.da_duyet, kho: key.canon, may: r.canon, de: q.noi_dung.replace(/\s+/g, ' ').slice(0, 120) }) }
}
console.log(`Kho ${kho}: ${tk.tong} câu có đáp số · đáp số parse được ${tk.ds_parse} · MÁY TÍNH ĐƯỢC ${tk.may_tinh} (${(100 * tk.may_tinh / tk.tong).toFixed(1)}%) · khớp ${tk.khop} · LỆCH ${tk.lech} (${(100 * tk.lech / Math.max(1, tk.may_tinh)).toFixed(1)}% của phần máy tính được)`)
console.log('Theo khối (tổng / máy tính được / lệch):', Object.entries(byKhoi).sort().map(([k, v]) => `${k}: ${v.tong}/${v.may}/${v.lech}`).join('  '))
console.log('Dạng lệch nhiều nhất:'); for (const [ma, d] of Object.entries(byDang).filter(([, d]) => d.lech).sort((a, b) => b[1].lech - a[1].lech).slice(0, 12)) console.log(`  ${ma} ${d.ten}: ${d.lech}/${d.may}`)
const byNguon = {}; for (const l of lech) { const k = `${l.nguon}/${l.nguon_giai}`; byNguon[k] = (byNguon[k] ?? 0) + 1 }
console.log('Lệch theo nguồn đề/lời giải:', byNguon)
// Dạng ĐÁNG TIN = máy kiểm ≥ 20 câu và lệch < 15% (loại dạng làm tròn/đặt tính/quy đồng mà máy báo giả hàng loạt).
// Trong các dạng đó: clone vs gốc lệch bao nhiêu % → kiểm giả thuyết "clone sai là chính".
const tin = Object.entries(byDang).filter(([, d]) => d.may >= 20 && d.lech / d.may < 0.15)
const tong = { clone: { may: 0, lech: 0 }, goc: { may: 0, lech: 0 } }
for (const [, d] of tin) for (const k of ['clone', 'goc']) if (d.ng[k]) { tong[k].may += d.ng[k].may; tong[k].lech += d.ng[k].lech }
console.log(`\nDạng đáng tin (${tin.length} dạng, máy kiểm ${tin.reduce((s, [, d]) => s + d.may, 0)} câu):`)
for (const k of ['clone', 'goc']) console.log(`  ${k}: ${tong[k].lech}/${tong[k].may} lệch (${(100 * tong[k].lech / Math.max(1, tong[k].may)).toFixed(2)}%)`)
console.log('  theo dạng (clone lệch/may · gốc lệch/may):'); for (const [ma, d] of tin.filter(([, d]) => d.lech)) console.log(`    ${ma} ${d.ten.slice(0, 50)}: clone ${d.ng.clone?.lech ?? 0}/${d.ng.clone?.may ?? 0} · gốc ${d.ng.goc?.lech ?? 0}/${d.ng.goc?.may ?? 0}`)
console.log('Mẫu lệch:'); for (const l of lech.slice(0, 15)) console.log(`  ${l.ma_cau} kho=${l.kho} máy=${l.may} | ${l.de.slice(0, 80)}`)
if (opt('--out')) { writeFileSync(opt('--out'), JSON.stringify(lech, null, 1), 'utf8'); console.log('→', opt('--out')) }
