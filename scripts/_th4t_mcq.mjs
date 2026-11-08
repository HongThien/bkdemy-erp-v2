// MCQ cho chủ đề Tổng hiệu 4T (T14T08) — Thùy 26/10 "4T dạng tổng hiệu có MCQ chưa… làm và fix đi".
//   node scripts/_th4t_mcq.mjs        → chạy thử (ROLLBACK), in số liệu
//   node scripts/_th4t_mcq.mjs --ghi  → ghi thật
// 1) Sửa ô ĐÁP ÁN KHO 5 câu sai (lời giải trong kho đúng, ô đáp án ghi sai — soát 24/10 + giải lại 26/10) và dựng lại form của chúng.
// 2) Sinh form cho câu chưa có form (khuôn y form đã có của dạng: nhiễu R343 gấp đôi · R344/R345 lệch 1 ở giá trị thứ nhất · R346 lệch 1
//    ở giá trị thứ hai (đáp số cặp) — đáp số 1 giá trị: R343 gấp đôi · R344 +1 · R345 −1).
// 3) Kiểm MỌI form của chủ đề bằng bộ kiểm hiểu đáp số CẶP ("44, 46" / "35; 45" — bộ đọc chung mcq-sinh hiểu nhầm thành thập phân):
//    đúng 4 phương án, đúng 1 phương án đúng, phương án đúng = đáp số kho (cùng thứ tự), 4 phương án khác nhau, mọi số > 0, nhiễu có rule.
// 4) Duyệt form đạt (duyet_boi = Admin hệ thống) TRỪ 3 câu đề phi thực tế (con ≤ 0 tuổi ở mốc quá khứ — chờ Thùy).
// 5) Duyệt 20 bản sao T14T080101 (máy kiểm đáp số (S+D)/2, (S−D)/2 khớp 20/20) ⇒ vào kho chuẩn.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const GHI = process.argv.includes('--ghi')
const SUA_DA = { T14T080102002: '5', T14T080102004: '4', T14T080102005: '6', T14T080102008: '6', T14T080102018: '5' }
const PHI_THUC_TE = new Set(['T14T080102004', 'T14T080102006', 'T14T080102012'])
const LET = ['A', 'B', 'C', 'D']
const so = (s) => String(s ?? '').replace(/\$/g, '').split(/[;,]/).map((x) => x.trim()).filter(Boolean).map(Number)
const txt = (v) => `$${v.join(';')}$`
const DS = { R343: 'tính gấp đôi giá trị thứ nhất (quên chia đôi ở 1 bước)', R344: 'tính lệch 1 đơn vị ở giá trị thứ nhất',
  R345: 'tính lệch 1 đơn vị ở giá trị thứ nhất, chiều ngược lại (dự phòng)', R346: 'tính lệch 1 đơn vị ở giá trị thứ hai' }
function dung(v, viTri) {   // v = mảng số đáp đúng
  const nh = v.length >= 2
    ? [['R343', [2 * v[0], ...v.slice(1)]], ['R344', [v[0] + 1, ...v.slice(1)]], ['R346', [v[0], v[1] + 1, ...v.slice(2)]]]
    : [['R343', [2 * v[0]]], ['R344', [v[0] + 1]], ['R345', [v[0] - 1]]]
  const opts = nh.map(([rule, val]) => ({ dung: false, rule, text: txt(val), duong_sai: nh.length && v.length >= 2 ? DS[rule] : DS[rule].replace(' ở giá trị thứ nhất', '') }))
  opts.splice(viTri, 0, { dung: true, text: txt(v) })
  return { lua_chon: opts, dap_an: LET[viTri] }
}
function kiem(lc, dapAnKho) {
  const e = []
  if (!Array.isArray(lc) || lc.length !== 4) return ['không đủ 4 phương án']
  const d = lc.filter((x) => x.dung); if (d.length !== 1) e.push('phải đúng 1 phương án đúng')
  const kho = so(dapAnKho)
  if (d[0] && JSON.stringify(so(d[0].text)) !== JSON.stringify(kho)) e.push(`phương án đúng ${d[0].text} ≠ đáp số kho ${dapAnKho}`)
  const keys = lc.map((x) => JSON.stringify(so(x.text))); if (new Set(keys).size !== 4) e.push('có 2 phương án trùng')
  if (lc.some((x) => so(x.text).some((n) => !(n > 0) || !Number.isFinite(n)))) e.push('có số ≤ 0 hoặc không đọc được')
  if (lc.some((x) => !x.dung && !x.rule)) e.push('nhiễu thiếu rule')
  return e
}
try {
  await q('begin')
  const [ad] = await q(`select id from nhan_su where lower(email) = 'admin@gmail.com' limit 1`)
  // 1) sửa đáp án kho
  for (const [ma, da] of Object.entries(SUA_DA)) await q(`update dai_cau_hoi set dap_an = $2 where ma_cau = $1`, [ma, da])
  const caus = await q(`select q.ma_cau, q.dap_an, q.kho_chuan, f.id fid, f.lua_chon, f.dap_an f_dap, f.da_duyet
                          from dai_cau_hoi q left join dai_cau_form_tn f on f.ma_cau = q.ma_cau and f.xoa_at is null
                         where q.dang_chinh like 'T14T08%' and q.xoa_at is null order by q.ma_cau`)
  let i = 0, sinhMoi = 0, dungLai = 0
  for (const r of caus) {
    const v = so(r.dap_an); const viTri = (i++) % 4
    if (!r.fid) {   // 2) sinh form mới
      const f = dung(v, viTri)
      await q(`insert into dai_cau_form_tn (ma_cau, lua_chon, dap_an, key_gia_tri, nguon, ai_model, da_duyet) values ($1, $2, $3, $4, 'ai', 'may-tong-hieu-2610', false)`,
        [r.ma_cau, JSON.stringify(f.lua_chon), f.dap_an, v.join(';')])
      sinhMoi++
    } else if (SUA_DA[r.ma_cau]) {   // dựng lại form theo đáp án đã sửa
      const f = dung(v, LET.indexOf(r.f_dap) >= 0 ? LET.indexOf(r.f_dap) : viTri)
      await q(`update dai_cau_form_tn set lua_chon = $2, dap_an = $3, key_gia_tri = $4 where id = $1`, [r.fid, JSON.stringify(f.lua_chon), f.dap_an, v.join(';')])
      dungLai++
    }
  }
  // 5) duyệt 20 bản sao đã kiểm đáp số bằng máy
  const cl = await q(`select ma_cau, noi_dung, dap_an from dai_cau_hoi where dang_chinh = 'T14T080101' and xoa_at is null and not kho_chuan`)
  const clOk = cl.filter((r) => { const m = r.noi_dung.match(/tổng hai số đó là (\d+), hiệu hai số đó là (\d+)/); const [a, b] = so(r.dap_an); return m && (+m[1] + +m[2]) / 2 === a && (+m[1] - +m[2]) / 2 === b })
  if (clOk.length) await q(`update dai_cau_hoi set da_duyet = true, duyet_nguon = 'may', kiem_may = 'khop', kiem_may_at = now(), kiem_may_boi = 'claude_code', kiem_may_ghi = 'th4t-tong-hieu 26/10: máy (S+D)/2, (S−D)/2 khớp đáp số kho' where ma_cau = any($1)`, [clOk.map((r) => r.ma_cau)])
  // 3)+4) kiểm + duyệt form
  const fs2 = await q(`select f.id, f.ma_cau, f.lua_chon, q.dap_an, q.kho_chuan from dai_cau_form_tn f join dai_cau_hoi q on q.ma_cau = f.ma_cau
                        where q.dang_chinh like 'T14T08%' and q.xoa_at is null and f.xoa_at is null and not f.da_duyet order by 2`)
  const ok = [], loi = []
  for (const r of fs2) { const e = kiem(r.lua_chon, r.dap_an); if (PHI_THUC_TE.has(r.ma_cau)) loi.push([r.ma_cau, 'đề phi thực tế — chờ Thùy']); else if (e.length) loi.push([r.ma_cau, e.join('; ')]); else ok.push(r.id) }
  if (ok.length) await q(`update dai_cau_form_tn set da_duyet = true, duyet_boi = $2, duyet_at = now() where id = any($1)`, [ok, ad.id])
  console.log(`sửa đáp án kho 5 · dựng lại form ${dungLai} · sinh form mới ${sinhMoi} · duyệt bản sao ${clOk.length}/${cl.length} · DUYỆT form ${ok.length} · để chờ ${loi.length}`)
  for (const [m, e] of loi) console.log('  chờ', m, '—', e)
  const sau = await q(`select q.dang_chinh, count(*)::int cau, count(*) filter (where q.kho_chuan and exists (select 1 from dai_cau_form_tn f where f.ma_cau = q.ma_cau and f.da_duyet and f.xoa_at is null))::int hien_app
                         from dai_cau_hoi q where q.dang_chinh like 'T14T08%' and q.xoa_at is null group by 1 order by 1`)
  console.table(sau)
  await q(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await q('rollback'); console.log('LỖI', e.message) } finally { await c.end() }
