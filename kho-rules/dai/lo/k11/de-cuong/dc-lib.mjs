// dc-lib.mjs — dựng KHUNG đề cương ôn tập (de.json chưa lời giải + các tệp `<MA>.p<N>.soan.md` cho trạm soạn) từ danh sách câu gõ tay.
// Dùng chung cho các đề cương K8 gõ lại từ PDF/ảnh (LTV-GKI-2026, DTD-GKI-2026…). Mẫu dữ liệu: LTV-GKI-2026.build.mjs.
//
//   dung({ MA, TEN, NGUON, FILE, PHAN, CAU, NHOM, LV, HERE })
//     CAU[i] = { phan, kho: 'dai'|'hinh_hoc', nhan, noi_dung, anh?: ['de_bai10.png'], canh_bao?: ['…' | 'CHƯA CHẮC — …'], loai?: 'tu_luan'|'trac_nghiem', nhom?: <số trạm> }
//     PHAN[i] = { thu_tu, ten, dang_thuc?: 'tu_luan'|'trac_nghiem' }  (mặc định tu_luan; phần TRẮC NGHIỆM ⇒ dang_thuc:'trac_nghiem', câu loai:'trac_nghiem', noi_dung có dòng A. B. C. D.)
//     Chia trạm: NHOM = [[tuBai, denBai], …] theo số trong nhãn 'Bài N'/'Câu N', HOẶC bỏ NHOM và gán q.nhom = 1..k cho từng câu.
//     NHOM   = [[tuBai, denBai], …] — mỗi nhóm một tệp phần cho một trạm soạn
//   Cần sẵn: <LV>/goc.pdf (tệp gốc) và <LV>/img/<hình đề>.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'

export function dung({ MA, TEN, NGUON, FILE, PHAN, CAU, NHOM, LV, HERE, NAM = 2026 }) {
  const require = createRequire(join(HERE, '../../../../../package.json'))
  const katex = require('katex')
  const loi = []
  for (const q of CAU) {
    const s = q.noi_dung
    if ((s.match(/\$/g) || []).length % 2) loi.push(`${q.nhan}: số dấu $ lẻ`)
    for (const m of s.matchAll(/\$([^$]+)\$/g)) {
      try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${q.nhan}: KaTeX hỏng «${m[1].slice(0, 50)}» — ${e.message.slice(0, 80)}`) }
      if (/\\times/.test(m[1])) loi.push(`${q.nhan}: khối 11 không dùng \\times`)
      if (/[À-ỹĐđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`${q.nhan}: chữ Việt ngoài \\text{} trong công thức`)
    }
    for (const a of q.anh ?? []) if (!existsSync(join(LV, 'img', a))) loi.push(`${q.nhan}: thiếu hình đề img/${a}`)
    if (!PHAN.some((p) => p.thu_tu === q.phan)) loi.push(`${q.nhan}: phần ${q.phan} không có`)
  }
  if (new Set(CAU.map((q) => q.nhan)).size !== CAU.length) loi.push('trùng nhãn câu')
  if (loi.length) { console.error('❌\n  ' + loi.join('\n  ')); process.exit(3) }

  const pdf = join(LV, 'goc.pdf')
  if (!existsSync(pdf)) { console.error('thiếu ' + pdf); process.exit(2) }
  const sha256 = createHash('sha256').update(readFileSync(pdf)).digest('hex')

  // de.json (khung)
  const cau = CAU.map((q) => ({ phan: q.phan, so: 0, nhan: q.nhan, kho: q.kho, loai_cau: q.loai ?? 'tu_luan', noi_dung: q.noi_dung, lua_chon: null, dap_an: null, dap_an_nguon: null,
    menh_de: null, loi_giai: null, anh: q.anh ?? [], anh_giai: [], dang: null, canh_bao: q.canh_bao ?? [] }))
  const dem = {}
  for (const q of cau) q.so = (dem[q.phan] = (dem[q.phan] ?? 0) + 1)
  const de = {
    khoi: '11', mon: 'Toán', nam: NAM, nguon: NGUON, kieu: 'de_cuong', ten: TEN, file: FILE, sha256, thoi_gian_phut: null, thang_diem: 10,
    phan: PHAN.map((p) => ({ ...p, dang_thuc: p.dang_thuc ?? 'tu_luan', diem_moi_cau: 0 })), cau,
  }
  mkdirSync(join(LV, 'img'), { recursive: true })
  writeFileSync(join(LV, 'de.json'), JSON.stringify(de, null, 1))

  // tệp khung cho trạm soạn
  const baiCua = (nhan) => +nhan.match(/^(?:Bài|Câu) (\d+)/)[1]
  const dung_ = new Set()
  const DS = NHOM ?? [...new Set(CAU.map((q) => q.nhom))].sort((a, b) => a - b).map((k) => ({ k }))
  DS.forEach((g, n) => {
    const cs = Array.isArray(g) ? CAU.filter((q) => baiCua(q.nhan) >= g[0] && baiCua(q.nhan) <= g[1]) : CAU.filter((q) => q.nhom === g.k)
    cs.forEach((q) => { if (dung_.has(q.nhan)) throw new Error('trùng ' + q.nhan); dung_.add(q.nhan) })
    let md = `# ĐỀ | ${TEN}\nnam: ${NAM}\nbo_sach: KNTT\nkieu: de_cuong\n`
    for (const pt of [...new Set(cs.map((q) => q.phan))]) {
      const p = PHAN.find((x) => x.thu_tu === pt)
      md += `\n## PHẦN ${pt} | ${p.ten} | ${p.dang_thuc ?? 'tu_luan'}\n`
      for (const q of cs.filter((c) => c.phan === pt)) {
        md += `\n### ${q.nhan} | kho=${q.kho} | loai=${q.loai ?? 'tu_luan'} | dap_an=${(q.loai ?? 'tu_luan') === 'trac_nghiem' ? '?' : '—'}\n**Đề:** ${q.noi_dung}\n`
        for (const a of q.anh ?? []) md += `**Hình:** ${a}\n`
        for (const cb of q.canh_bao ?? []) md += cb.startsWith('CHƯA CHẮC — ') ? `**Chưa chắc:** ${cb.slice(12)}\n` : `**Ghi chú:** ${cb}\n`
      }
    }
    writeFileSync(join(HERE, `${MA}.p${n + 1}.soan.md`), md)
    console.log(`p${n + 1}: ${cs.length} câu — ${cs.map((q) => q.nhan.replace('Bài ', '')).join(' ')}`)
  })
  if (dung_.size !== CAU.length) throw new Error(`thiếu câu: ${dung_.size}/${CAU.length}`)
  const tk = PHAN.map((p) => `${p.ten}: ${cau.filter((q) => q.phan === p.thu_tu).length}`).join(' · ')
  console.log(`✔ ${join(LV, 'de.json')} — ${cau.length} câu (${tk}) · hình đề ${CAU.filter((q) => q.anh?.length).length} · ghi chú ${CAU.filter((q) => q.canh_bao?.length).length} câu · sha256 ${sha256.slice(0, 12)}…`)
}
