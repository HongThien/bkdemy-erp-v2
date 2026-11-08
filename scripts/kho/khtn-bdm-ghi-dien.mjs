// Kiểm + ghi kết quả trạm "điền bản đồ KHTN mới" (Thùy 03/11). Đi cùng khtn-bdm-xuat-dien.mjs.
//   node scripts/kho/khtn-bdm-ghi-dien.mjs <thư mục lô> [lo1,lo2…] [--ghi]
// - dien-*.out.json ⇒ mô tả / lý thuyết / ví dụ dạng bài + lý thuyết nhóm: CHỈ ghi vào ô đang trống (không đè người đã sửa).
// - tao-*.out.json  ⇒ thêm dạng bài mới cho nhóm CHỈ KHI nhóm vẫn chưa có dạng nào; ghi <lo>.tao-id.json (tên → mã KDB + câu gợi ý).
// Không --ghi ⇒ chạy trong transaction rồi ROLLBACK, in báo cáo.
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
import katex from 'katex'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const DIR = process.argv[2]; const GHI = process.argv.includes('--ghi')
const CHON = process.argv[3] && !process.argv[3].startsWith('--') ? new Set(process.argv[3].split(',')) : null
const los = fs.readdirSync(DIR).filter(f => f.endsWith('.out.json')).map(f => f.replace('.out.json', '')).filter(l => !CHON || CHON.has(l)).sort()

// ---- kiểm định dạng một chuỗi ----
function kiemChuoi(s, loai) {
  const loi = []
  if (!s) return loi
  if (/\[\[|<\/?[a-z]+[ >]|https?:\/\//i.test(s)) loi.push('thẻ lạ/HTML/URL')
  const toan = [...s.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)]
  const bo = s.replace(/\$\$[\s\S]+?\$\$|\$[^$]+?\$/g, '')
  if (bo.includes('$')) loi.push('lẻ dấu $')
  for (const m of toan) { try { katex.renderToString(m[1] ?? m[2], { throwOnError: true }) } catch (e) { loi.push('KaTeX: ' + (m[1] ?? m[2]).slice(0, 40)) } }
  if (loai === 'lt') {
    if (/##VD|Bài giải:|^\s*Ví dụ\b/m.test(s)) loi.push('lý thuyết chứa ví dụ')
    const khoi = s.split(/\n\s*\n/)
    for (const k of khoi) if (!/^##(TC|PP|CY|ĐN|ĐL|NX)\b/.test(k.trim())) loi.push('khối không thẻ: ' + k.trim().slice(0, 30))
    if (/^##PP[\s\S]*?^\s*Bước\s*\d/m.test(s)) loi.push('PP còn "Bước N"')
  }
  if (loai === 'vd') {
    const vds = s.split(/^##VD.*$/m).slice(1)
    if (!vds.length || !s.trim().startsWith('##VD')) loi.push('ví dụ không mở bằng ##VD')
    for (const v of vds) {
      const i = v.search(/^\s*Bài giải:?/m)
      if (i < 0) { loi.push('VD thiếu "Bài giải:"'); continue }
      if (/\n\s*\n/.test(v.slice(0, i).trim())) loi.push('đề VD có dòng trống')
    }
  }
  return loi
}

const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let tk = { mt: 0, lt: 0, vd: 0, ltn: 0, dang_moi: 0, bo_qua: 0, loi: 0 }
const loiDs = []
try {
  await q('begin')
  for (const lo of los) {
    const vao = JSON.parse(fs.readFileSync(path.join(DIR, lo + '.in.json'), 'utf8'))
    let ra; try { ra = JSON.parse(fs.readFileSync(path.join(DIR, lo + '.out.json'), 'utf8')) } catch (e) { loiDs.push(`${lo}: JSON hỏng ${e.message}`); tk.loi++; continue }
    const nhomVao = new Set(vao.nhom.map(n => n.nhom_id))
    // lý thuyết nhóm
    for (const n of ra.nhom ?? []) {
      if (!nhomVao.has(n.nhom_id)) { loiDs.push(`${lo}: nhóm lạ ${n.nhom_id}`); tk.loi++; continue }
      if (n.ly_thuyet?.trim()) {
        const l = kiemChuoi(n.ly_thuyet, 'lt'); if (l.length) { loiDs.push(`${lo} ${n.nhom_id} LT nhóm: ${l.join('; ')}`); tk.loi++; continue }
        const r = await q(`update khtn_bdm_nhom set ly_thuyet=$2 where id=$1 and btrim(ly_thuyet)='' returning id`, [n.nhom_id, n.ly_thuyet.trim()])
        r.length ? tk.ltn++ : tk.bo_qua++
      }
    }
    if (lo.startsWith('dien')) {
      const dangVao = new Map(vao.dang_bai.map(d => [d.dang_id, d]))
      const thieu = [...dangVao.keys()].filter(id => !(ra.dang_bai ?? []).some(d => d.dang_id === id))
      if (thieu.length) loiDs.push(`${lo}: thiếu ${thieu.length} dạng trong .out (${thieu.slice(0, 5).join(',')})`)
      for (const d of ra.dang_bai ?? []) {
        if (!dangVao.has(d.dang_id)) { loiDs.push(`${lo}: dạng lạ ${d.dang_id}`); tk.loi++; continue }
        for (const [cot, loai, k] of [['mo_ta', 'mt', 'mt'], ['ly_thuyet', 'lt', 'lt'], ['vi_du', 'vd', 'vd']]) {
          const v = d[cot]?.trim(); if (!v) continue
          const l = kiemChuoi(v, loai); if (l.length) { loiDs.push(`${lo} ${d.dang_id} ${cot}: ${l.join('; ')}`); tk.loi++; continue }
          const r = await q(`update khtn_bdm_dang_bai set ${cot}=$2 where id=$1 and btrim(${cot})='' returning id`, [d.dang_id, v])
          r.length ? tk[k]++ : tk.bo_qua++
        }
      }
    } else {
      const ids = {}
      for (const n of ra.nhom ?? []) {
        const vn = vao.nhom.find(x => x.nhom_id === n.nhom_id); if (!vn) continue
        const vaoCau = new Set(vn.cau.map(x => x.ma_cau))
        const raCau = [...(n.dang_bai ?? []).flatMap(d => d.cau ?? []), ...(n.khong_hop ?? []).map(x => x.ma_cau)]
        const lech = raCau.length !== new Set(raCau).size || raCau.some(m => !vaoCau.has(m)) || [...vaoCau].some(m => !raCau.includes(m))
        if (lech) loiDs.push(`${lo} ${n.nhom_id}: danh sách câu gợi ý lệch đầu vào (chỉ là gợi ý, vẫn ghi dạng)`)
        const co = +(await q(`select count(*) n from khtn_bdm_dang_bai where nhom_id=$1`, [n.nhom_id]))[0].n
        if (co) { loiDs.push(`${lo} ${n.nhom_id}: nhóm đã có ${co} dạng — bỏ qua dạng đề xuất`); tk.bo_qua++; continue }
        let hong = false
        for (const d of n.dang_bai ?? []) {
          const l = [...kiemChuoi(d.mo_ta, 'mt'), ...kiemChuoi(d.ly_thuyet, 'lt'), ...kiemChuoi(d.vi_du, 'vd')]
          if (!d.ten?.trim() || l.length) { loiDs.push(`${lo} ${n.nhom_id} "${d.ten}": ${l.join('; ') || 'thiếu tên'}`); tk.loi++; hong = true }
        }
        if (hong) continue  // nhóm có dạng hỏng ⇒ không ghi nhóm đó (tránh bản đồ nửa vời), sửa rồi chạy lại
        for (const d of n.dang_bai ?? []) {
          const [r] = await q(`insert into khtn_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, vi_du) values ($1,$2,$3,$4,$5) returning id`,
            [n.nhom_id, d.ten.trim(), d.mo_ta?.trim() ?? '', d.ly_thuyet?.trim() ?? '', d.vi_du?.trim() ?? ''])
          ids[r.id] = { nhom_id: n.nhom_id, ten: d.ten.trim(), cau: d.cau ?? [] }; tk.dang_moi++
        }
      }
      if (GHI) { const f = path.join(DIR, lo + '.tao-id.json'); const cu = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}; fs.writeFileSync(f, JSON.stringify({ ...cu, ...ids }, null, 1)) }
    }
  }
  await q(GHI ? 'commit' : 'rollback')
} catch (e) { await q('rollback'); throw e } finally { await c.end() }
console.log(GHI ? 'ĐÃ GHI' : 'CHẠY THỬ (ROLLBACK)', los.length, 'lô', tk)
for (const l of loiDs) console.log('  ✘', l)
