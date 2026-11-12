// so-theo-doi.mjs — KHÔNG đọc DB. Dựng so-theo-doi.md từ batch.json + batch/<ma>/bao-cao.json (mỗi batch xong ghi 1 file).
//   node kho-rules/dai/lo/toanmath/so-theo-doi.mjs
// bao-cao.json: { trang_thai, ngay, cau_boc, trung_kho, sonnet, opus_khop, lech, bo, ghi_db, ghi_chu }
import fs from 'node:fs'; import path from 'node:path'
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const B = JSON.parse(fs.readFileSync(path.join(HERE, 'batch.json'), 'utf8'))
const bc = (ma) => { const p = path.join(HERE, 'batch', ma, 'bao-cao.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {} }
const GD = (b) => b.nhom === 'Word' ? '1. Word đã bóc' : b.nhom === 'Thi thử K12' || /thi thử/.test(b.ten) && b.bai[0]?.khoi === 'K12' ? '6. K12 thi thử' : /K(6|7|8|9) đề thi|vào 10/.test(b.ten) ? '2. THCS đề thi' : /K(6|7|8|9) đề cương/.test(b.ten) ? '3. THCS đề cương' : /đề thi|chính thức/.test(b.ten) ? '4. K10–12 đề thi' : '5. K10–12 đề cương'
const v = (x) => x ?? '—'
let md = `# Sổ theo dõi batch — bộ đề toanmath còn lại\n\n> Tự sinh bởi \`so-theo-doi.mjs\` — KHÔNG sửa tay. Kế hoạch: \`KE-HOACH.md\`.\n\n`
const g = {}; for (const b of B) { const k = GD(b); g[k] ??= { batch: 0, bai: 0, cau: 0, xong: 0, ghi: 0 }; g[k].batch++; g[k].bai += b.so_bai; g[k].cau += b.so_cau_boc || 0; const r = bc(b.ma); if (r.trang_thai === 'xong') g[k].xong++; g[k].ghi += r.ghi_db || 0 }
md += `| Giai đoạn | Batch | Bài | Câu đã bóc | Batch xong | Câu đã ghi |\n|---|---|---|---|---|---|\n`
for (const [k, o] of Object.entries(g)) md += `| ${k} | ${o.batch} | ${o.bai} | ${o.cau || 'chưa bóc'} | ${o.xong} | ${o.ghi} |\n`
md += `\n| Batch | Giai đoạn | Nội dung | Bài | Câu bóc | Trùng kho | Sonnet giải | Opus khớp | Lệch | Bỏ | Ghi DB | Trạng thái |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n`
for (const b of B) { const r = bc(b.ma); md += `| ${b.ma} | ${GD(b).slice(0, 1)} | ${b.ten} | ${b.so_bai} | ${v(r.cau_boc ?? b.so_cau_boc)} | ${v(r.trung_kho)} | ${v(r.sonnet)} | ${v(r.opus_khop)} | ${v(r.lech)} | ${v(r.bo)} | ${v(r.ghi_db)} | ${r.trang_thai || 'chưa làm'} |\n` }
fs.writeFileSync(path.join(HERE, 'so-theo-doi.md'), md)
for (const [k, o] of Object.entries(g)) console.log(k, JSON.stringify(o))
