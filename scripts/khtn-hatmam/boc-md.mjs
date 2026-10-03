// ============================================================================
// boc-md.mjs — bóc NGÂN HÀNG TRẮC NGHIỆM KHTN 6–9 (Hạt Mầm Tò Mò, xếp theo Bản đồ kiến thức, GV đã duyệt — Thùy đưa 03/10)
// từ thư mục Markdown (README: 4 tầng # → #####, mỗi câu khối "##### Câu <mã>" … "---") ra JSON. Không đụng DB.
// Chạy: node scripts/khtn-hatmam/boc-md.mjs <thư mục trac-nghiem> <ra.json>
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'

const [, , goc, ra] = process.argv
const cau = [], loi = []
const cay = { chuDe: {}, chuyenDe: {}, dang: {}, cum: {} }
for (const lopDir of fs.readdirSync(goc).filter((d) => /^KHTN\d$/.test(d)).sort()) {
  const khoi = lopDir.slice(4)
  for (const f of fs.readdirSync(path.join(goc, lopDir)).filter((x) => /^K\d\d-\d+.*\.md$/.test(x)).sort()) {
    const s = fs.readFileSync(path.join(goc, lopDir, f), 'utf8').replace(/\r\n/g, '\n')
    // tầng cây (tên + mã) — để đối chiếu bản đồ
    let cd = null, chd = null, dg = null, cm = null
    const maCd = (s.match(/Mã chủ đề: (K\d\d-\d+)/) || [])[1]
    const tenCd = (s.match(/^# (.+)$/m) || [])[1]
    if (maCd) cay.chuDe[maCd] = { ten: tenCd, khoi, mon: (s.match(/Môn: ([^·\n]+)/) || [])[1]?.trim() }
    const khoiCau = s.split(/^(?=##### Câu )/m)
    for (const k of khoiCau) {
      // cập nhật tầng từ phần đầu khối (trước câu)
      for (const m of k.matchAll(/^## (.+)\n\nMã chuyên đề: (K\d+)(?: · SGK (.+))?$/gm)) cay.chuyenDe[m[2]] = { ten: m[1], sgk: m[3] ?? null, chuDe: maCd }
      for (const m of k.matchAll(/^### (.+)\n\nMã dạng: (K\d+)(.*)$/gm)) cay.dang[m[2]] = { ten: m[1], ghi: m[3].trim() || null }
      for (const m of k.matchAll(/^#### (.+)\n\nMã cụm: (K\d+-C\d+)(.*)$/gm)) cay.cum[m[2]] = { ten: m[1] }
      if (!k.startsWith('##### Câu ')) continue
      const ma = k.match(/^##### Câu (\S+)/)[1]
      const tt = (ten) => (k.match(new RegExp(`^- ${ten}: (.+)$`, 'm')) || [])[1]?.trim() ?? null
      const than = k.split(/^---\s*$/m)[0]
      const de = (than.match(/\*\*Câu hỏi:\*\* ([\s\S]*?)(?=\n\nA\. |\n\n!\[)/) || [])[1]
      const hinhDe = [...(than.match(/\*\*Câu hỏi:\*\*[\s\S]*?(?=\n\nA\. )/) || [''])[0].matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1])
      const pa = ['A', 'B', 'C', 'D'].map((c) => (than.match(new RegExp(`^${c}\\. (.*)$`, 'm')) || [])[1] ?? null)
      const dapAn = (than.match(/\*\*Đáp án:\*\* ([ABCD])/) || [])[1]
      const loiGiai = (than.match(/\*\*Lời giải:\*\* ([\s\S]*?)(?=\n\n\*\*|\n*$)/) || [])[1]?.trim() ?? null
      const viSao = [...((than.match(/\*\*Vì sao sai:\*\*\n([\s\S]*?)(?=\n\n\*\*|\n*$)/) || [])[1] ?? '').matchAll(/^- ([ABCD]): (.+)$/gm)].map((m) => ({ pa: m[1], ly_do: m[2] }))
      const nhanLoi = (than.match(/\*\*Nhãn lỗi:\*\* (.+)/) || [])[1]?.trim() ?? null
      const mucDo = Number((tt('Mức độ') || '').split(' ')[0]) || null
      // "(mã K07010203)" hoặc "(mã K07010203, dạng bổ sung)"
      const dang = ((tt('Dạng bài') || '').match(/\(mã (K\d+)[,)]/) || [])[1] ?? null
      const cum = ((tt('Cụm bài') || '').match(/\(mã (K\d+-C\d+)[,)]/) || [])[1] ?? null
      const r = { ma, khoi, mon: tt('Môn'), chu_de: maCd, dang, cum, muc_do: mucDo, de: de?.trim() ?? null, hinh_de: hinhDe, pa, dap_an: dapAn ?? null, loi_giai: loiGiai, vi_sao_sai: viSao, nhan_loi: nhanLoi, tep: `${lopDir}/${f}` }
      const thieu = ['de', 'dap_an', 'dang', 'cum', 'muc_do'].filter((x) => !r[x]).concat(r.pa.some((x) => x === null) ? ['pa'] : [])
      if (thieu.length) loi.push({ ma, thieu })
      cau.push(r)
    }
  }
}
fs.writeFileSync(ra, JSON.stringify({ cay, cau }, null, 1))
const dem = (f) => cau.reduce((a, c) => (a[f(c)] = (a[f(c)] || 0) + 1, a), {})
console.log('câu', cau.length, '· mã trùng', cau.length - new Set(cau.map((c) => c.ma)).size, '· thiếu trường', loi.length, loi.slice(0, 5))
console.log('theo khối', JSON.stringify(dem((c) => c.khoi)), '\ntheo môn', JSON.stringify(dem((c) => c.mon)), '\ntheo mức', JSON.stringify(dem((c) => c.muc_do)))
console.log('cây: chủ đề', Object.keys(cay.chuDe).length, '· chuyên đề', Object.keys(cay.chuyenDe).length, '· dạng', Object.keys(cay.dang).length, '· cụm', Object.keys(cay.cum).length,
  '· dạng "bổ sung"', Object.values(cay.dang).filter((d) => /bổ sung/.test(d.ghi ?? '') || /bổ sung/.test(d.ten)).length)
console.log('câu có ảnh đề', cau.filter((c) => c.hinh_de.length).length, '· phương án là ảnh', cau.filter((c) => c.pa.some((p) => /!\[/.test(p ?? ''))).length,
  '· có vì sao sai', cau.filter((c) => c.vi_sao_sai.length).length, '· có nhãn lỗi', cau.filter((c) => c.nhan_loi).length)
