// Ghi kết quả xếp câu chưa gán vào dạng bài — bản đồ mới KHTN (Thùy 03/11). Đi cùng khtn-bdm-xuat-phan.mjs.
//   node scripts/kho/khtn-bdm-ghi-phan.mjs <thư mục phân> <thư mục lô điền> [--ghi]
// Chỉ mức `cao` được ghi (nguon 'ai', qua _khtn_bdm_gan — kéo theo bản sao). Dạng bài vừa do trạm tạo (tao-*.tao-id.json)
// cần NHÂN CHỨNG THỨ HAI: trạm xếp phải trùng với gợi ý của trạm tạo dạng; lệch ⇒ hạ `vua`, không ghi.
// Câu đã có dòng gán (người gán trong lúc chạy) ⇒ không đụng. Ghi <dir>/ket-qua.json cho HTML hậu kiểm.
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const [DIR, DIR_DIEN] = process.argv.slice(2); const GHI = process.argv.includes('--ghi')
const goiY = {}  // ma_cau → dang_id gợi ý của trạm tạo dạng
for (const f of fs.readdirSync(DIR_DIEN).filter(f => f.endsWith('.tao-id.json')))
  for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(path.join(DIR_DIEN, f), 'utf8')))) for (const m of v.cau) goiY[m] = id
const dangMoi = new Set(Object.values(goiY))

const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const kq = []; const tk = { cao_ghi: 0, cao_ha_vua: 0, vua: 0, trong: 0, loi: 0, da_co_gan: 0, ban_sao: 0 }
try {
  await q('begin')
  for (const f of fs.readdirSync(DIR).filter(f => /^phan(cho)?-.*\.out\.json$/.test(f)).sort()) {
    const lo = f.replace('.out.json', '')
    const vao = JSON.parse(fs.readFileSync(path.join(DIR, lo + '.in.json'), 'utf8'))
    const ra = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))
    const dangCuaNhom = Object.fromEntries(vao.nhom.map(n => [n.nhom_id, new Map(n.dang_bai.map(d => [d.dang_id, d.ten]))]))
    const raBy = new Map(ra.map(r => [r.ma_cau, r]))
    if (ra.length !== vao.cau.length) console.log(`  ⚠ ${lo}: ${ra.length} kết quả / ${vao.cau.length} câu`)
    for (const cv of vao.cau) {
      const r = raBy.get(cv.ma_cau)
      let chac = r?.chac ?? null, dang = r?.dang_bai_id ?? null, ly_do = r?.ly_do ?? 'trạm không trả kết quả'
      if (dang && !dangCuaNhom[cv.nhom_id]?.has(dang)) { tk.loi++; ly_do = `mã ${dang} không thuộc nhóm — bỏ; ` + ly_do; dang = null; chac = null }
      if (chac === 'cao' && cv.nhom_chac === 'vua') { chac = 'vua'; tk.cao_ha_vua++; ly_do += ' [nhóm chỉ chọn ở mức vừa]' }
      if (chac === 'cao' && dangMoi.has(dang) && goiY[cv.ma_cau] !== dang) { chac = 'vua'; tk.cao_ha_vua++; ly_do += ` [trạm tạo dạng gợi ý ${goiY[cv.ma_cau] ?? 'khác'}]` }
      if (chac === 'cao') {
        const co = await q(`select 1 from khtn_bdm_gan_cau where ma_cau=$1`, [cv.ma_cau])
        if (co.length) { tk.da_co_gan++; chac = 'da_co' }
        else { const [{ n }] = await q(`select _khtn_bdm_gan($1,$2,'ai') n`, [cv.ma_cau, dang]); tk.cao_ghi++; tk.ban_sao += n - 1 }
      } else chac === 'vua' ? tk.vua++ : tk.trong++
      kq.push({ lo, ma_cau: cv.ma_cau, nhom_id: cv.nhom_id, dang_bai_id: dang, ten_dang: dang ? dangCuaNhom[cv.nhom_id].get(dang) : null, chac, ly_do })
    }
  }
  await q(GHI ? 'commit' : 'rollback')
} catch (e) { await q('rollback'); throw e } finally { await c.end() }
fs.writeFileSync(path.join(DIR, 'ket-qua.json'), JSON.stringify(kq, null, 1))
console.log(GHI ? 'ĐÃ GHI' : 'CHẠY THỬ (ROLLBACK)', tk)
