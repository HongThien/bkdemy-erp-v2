// Ghép 2 nguồn đáp án cho các câu TSA chưa có đáp án:
//   NGUỒN A = lời giải CỦA TÁC GIẢ (đã nằm trong DB): tiền tố "Đúng:/Sai:" từng ý · giá trị giải của B có xuất hiện ở cuối lời giải
//   NGUỒN B = người giải ĐỘC LẬP (chỉ thấy đề, không thấy lời giải) — kết quả ở <giai>/ketqua*.json
// Chỉ GHI khi B 'chac' VÀ A không mâu thuẫn:   khop (A xác nhận)  → kiem_may 'khop'
//                                              chi_B (A im lặng)  → kiem_may 'khong_kiem_duoc' (vẫn ghi: B chắc + có kiểm bằng code)
//                                              lech (A ≠ B)       → KHÔNG ghi, in ra cho người phân xử (đề/lời giải có thể sai)
//   node scripts/tsa/ghep-dap-an.mjs <thư mục giai> [--ghi]
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'

const dir = process.argv[2]
const GHI = process.argv.includes('--ghi')
// <thu-cong.json>: { "<ma_cau>": { loai?, dap_an?(chuỗi) | y?:{a:'D',...}, ghi_chu } } — Claude xem HÌNH + tự giải có kiểm code; không qua bước ghép tự động
const thuCong = process.argv[3] && !process.argv[3].startsWith('--') ? JSON.parse(readFileSync(process.argv[3], 'utf8')) : {}
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const kq = readdirSync(dir).filter((f) => /^ketqua\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
const B = new Map(kq.map((x) => [x.id, x]))
const chuan = (s) => String(s ?? '').toLowerCase().replace(/\\left|\\right|\\,|\\;|\\!|\\quad|\\text\{[^}]*\}|[\s$]/g, '').replace(/\\dfrac|\\tfrac/g, '\\frac').replace(/,/g, '.')
const trongDuoi = (loiGiai, v, n = 500) => {
  const t = chuan(String(loiGiai ?? '').slice(-n)); const k = chuan(v)
  if (!k) return false
  if (/^-?[d.]+$/.test(k)) return new RegExp('(?<![\d.])' + k.replace(/[.]/g, '\.') + '(?![\d]|\.\d)').test(t)
  return t.includes(k)
}

const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const { rows } = await c.query(`select ma_cau, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai from tsa_cau_hoi where xoa_at is null and not da_duyet order by ma_cau`)
const tk = { khop: 0, chi_B: 0, lech: 0, khong_chac: 0, thieu_B: 0 }
const lech = [], ghi = []
for (const q of rows) {
  if (thuCong[q.ma_cau]) continue
  const b = B.get(q.ma_cau)
  if (!b) { tk.thieu_B++; continue }
  if (b.do_chac !== 'chac') { tk.khong_chac++; lech.push({ id: q.ma_cau, ly_do: 'B không chắc: ' + b.ghi_chu }); continue }
  if (q.loai_cau === 'dung_sai') {
    const mo = q.menh_de.map((m, k) => {
      const chu = 'abcd'[k]
      const mA = /^\s*(Đúng|Sai)\s*[:：]/i.exec(m.loi_giai ?? '')
      const a = mA ? (/^đ/i.test(mA[1]) ? 'D' : 'S') : null
      return { chu, a, b: b.dap_an?.[chu] }
    })
    if (mo.some((x) => x.b !== 'D' && x.b !== 'S')) { tk.lech++; lech.push({ id: q.ma_cau, ly_do: 'B trả sai định dạng ' + JSON.stringify(b.dap_an) }); continue }
    const xung = mo.filter((x) => x.a && x.a !== x.b)
    if (xung.length) { tk.lech++; lech.push({ id: q.ma_cau, ly_do: 'Đúng/Sai lệch: ' + xung.map((x) => `${x.chu}) tác giả ${x.a} ≠ B ${x.b}`).join('; '), ghi_chu: b.ghi_chu }); continue }
    const nguon = mo.every((x) => x.a) ? 'khop' : 'chi_B'
    tk[nguon]++
    ghi.push({ ma_cau: q.ma_cau, loai: q.loai_cau, menh_de: q.menh_de.map((m, k) => ({ ...m, dap_an: mo[k].b })), nguon, ghi_chu: b.ghi_chu })
    continue
  }
  if (typeof b.dap_an === 'object' && !Array.isArray(b.dap_an)) { tk.lech++; lech.push({ id: q.ma_cau, ly_do: 'loại câu trong DB (' + q.loai_cau + ') lệch với đề (thực chất Đúng/Sai) — người sửa loại câu', ghi_chu: b.ghi_chu }); continue }
  if (q.loai_cau === 'tra_loi_ngan' && Array.isArray(q.lua_chon) && q.lua_chon.length) { tk.lech++; lech.push({ id: q.ma_cau, ly_do: 'đề có phương án A-D nhưng loại câu = tra_loi_ngan', ghi_chu: b.ghi_chu }); continue }
  let dap, ok
  if (q.loai_cau === 'trac_nghiem') { dap = String(b.dap_an).trim().toUpperCase(); ok = /^[A-D]$/.test(dap) && trongDuoi(q.loi_giai, q.lua_chon?.['ABCD'.indexOf(dap)] ?? '', 700) }
  else if (q.loai_cau === 'keo_tha') { const arr = Array.isArray(b.dap_an) ? b.dap_an : [b.dap_an]; dap = arr.map((x, k) => `${'abcd'[k]}) $${String(x).replace(/^$|$$/g, '')}$`).join(', '); ok = arr.every((x) => trongDuoi(q.loi_giai, x, 800)) }
  else { dap = String(b.dap_an).trim(); ok = trongDuoi(q.loi_giai, dap, 400) }
  if (!dap || dap === 'undefined') { tk.khong_chac++; lech.push({ id: q.ma_cau, ly_do: 'B thiếu đáp án' }); continue }
  // A "xung đột" = lời giải có KẾT LUẬN số khác hẳn B — chỉ nhận ra được khi lời giải kết thúc bằng "Vậy …$X$" khác dap
  const kl = /^(Vậy|Do đó|Đáp số|Suy ra|Kết luận|Từ đó|Như vậy)/i.test(String(q.loi_giai ?? '').trim().split('\n').pop() ?? '') ? [...(q.loi_giai.trim().split('\n').pop().matchAll(/\$([^$]+)\$/g))].pop()?.[1] : null
  if (q.loai_cau === 'tra_loi_ngan' && kl && chuan(kl) !== chuan(dap) && !trongDuoi(q.loi_giai, dap, 120)) { tk.lech++; lech.push({ id: q.ma_cau, ly_do: `tác giả kết luận "${kl}" ≠ B "${dap}"`, ghi_chu: b.ghi_chu }); continue }
  tk[ok ? 'khop' : 'chi_B']++
  ghi.push({ ma_cau: q.ma_cau, loai: q.loai_cau, dap_an: dap, nguon: ok ? 'khop' : 'chi_B', ghi_chu: b.ghi_chu })
}
console.log(GHI ? 'GHI' : 'CHẠY THỬ', JSON.stringify(tk), '· sẽ ghi', ghi.length)
console.log('--- CẦN NGƯỜI XEM (không ghi):'); for (const x of lech) console.log(' ', x.id, '|', x.ly_do, x.ghi_chu ? '| B: ' + String(x.ghi_chu).slice(0, 160) : '')
try {
  await c.query('begin')
  for (const g of ghi) {
    const kiem = g.nguon === 'khop' ? 'khop' : 'khong_kiem_duoc'
    const nhan = ` · đáp án 02/10: giải độc lập (${g.nguon === 'khop' ? 'lời giải tác giả xác nhận' : 'lời giải tác giả im lặng'}) — ${String(g.ghi_chu ?? '').slice(0, 200)}`
    if (g.loai === 'dung_sai') await c.query(`update tsa_cau_hoi set menh_de = $2::jsonb, kiem_may = $3, kiem_may_at = now(), kiem_may_ghi = left(coalesce(kiem_may_ghi,'') || $4, 1500), da_duyet = true, duyet_nguon = 'may' where ma_cau = $1`, [g.ma_cau, JSON.stringify(g.menh_de), kiem, nhan])
    else await c.query(`update tsa_cau_hoi set dap_an = $2, kiem_may = $3, kiem_may_at = now(), kiem_may_ghi = left(coalesce(kiem_may_ghi,'') || $4, 1500), da_duyet = true, duyet_nguon = 'may' where ma_cau = $1`, [g.ma_cau, g.dap_an, kiem, nhan])
  }
  for (const [id, o] of Object.entries(thuCong)) {
    const nhan = ` · đáp án 02/10: tự giải có kiểm bằng code, đối chiếu hình — ${o.ghi_chu ?? ''}`
    if (o.loai) await c.query(`update tsa_cau_hoi set loai_cau = $2 where ma_cau = $1`, [id, o.loai])
    if (o.y) {
      const { rows: [q] } = await c.query(`select menh_de from tsa_cau_hoi where ma_cau = $1`, [id])
      await c.query(`update tsa_cau_hoi set menh_de = $2::jsonb where ma_cau = $1`, [id, JSON.stringify(q.menh_de.map((m, k) => ({ ...m, dap_an: o.y['abcd'[k]] })))])
    } else if (o.dap_an != null) await c.query(`update tsa_cau_hoi set dap_an = $2 where ma_cau = $1`, [id, o.dap_an])
    await c.query(`update tsa_cau_hoi set kiem_may = 'khop', kiem_may_at = now(), kiem_may_ghi = left(coalesce(kiem_may_ghi,'') || $2, 1500), da_duyet = true, duyet_nguon = 'may' where ma_cau = $1`, [id, nhan])
  }
  const t = await c.query(`select count(*) filter (where da_duyet) duyet, count(*) filter (where not da_duyet) chua from tsa_cau_hoi where xoa_at is null`)
  console.log('sau lượt này:', JSON.stringify(t.rows[0]))
  await c.query(GHI ? 'commit' : 'rollback')
} catch (e) { await c.query('rollback').catch(() => {}); console.error('LỖI', e.message); process.exitCode = 1 } finally { await c.end() }
