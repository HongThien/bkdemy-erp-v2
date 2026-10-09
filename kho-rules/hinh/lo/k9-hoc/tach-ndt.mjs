// tách DT.pdf (Ngô Đức Tài ch.V) thành bài có mã: B<bài> D<dạng> VD<n> | B<bài> TL<n> | B<bài> TN<n>; kèm trang pdf
import { readFileSync, writeFileSync } from 'node:fs'
const [src, out] = process.argv.slice(2)
const pages = readFileSync(src, 'utf8').split('\f')
const items = []; let bai = 0, dang = 0, khu = '', cur = null
const push = () => { if (cur) { cur.text = cur.lines.join('\n').replace(/\n\s*b Lời giải[\s\S]*$/, '').replace(/^\s*\.{8,}\s*$/gm, '').replace(/\n{2,}/g, '\n').trim(); delete cur.lines; items.push(cur) } cur = null }
pages.forEach((pg, pi) => {
  for (const raw of pg.split('\n')) {
    const l = raw.replace(/\s+$/, '')
    let m
    if ((m = l.match(/^\s*Bài\s+(\d)\b/))) { push(); bai = +m[1]; dang = 0; khu = ''; continue }
    if (/ÔN TẬP CHƯƠNG V/.test(l)) { push(); bai = 6; dang = 0; khu = 'TL'; continue }
    if ((m = l.match(/^\s*Dạng\s+(\d+)\s+(.*)$/))) { push(); dang = +m[1]; khu = 'VD'; items.push({ id: `B${bai} D${dang}`, ten_dang: m[2].trim(), trang: pi + 1, laDang: true }); continue }
    if (/Bài tập tự luyện/.test(l)) { push(); khu = 'TL'; continue }
    if (/Bài tập trắc nghiệm/.test(l)) { push(); khu = 'TN'; continue }
    if (/Tóm tắt lý thuyết|Các dạng bài tập/.test(l)) { push(); khu = ''; continue }
    if ((m = l.match(/^\s*VÍ DỤ\s+(\d+)/))) { push(); cur = { id: `B${bai} D${dang} VD${m[1]}`, trang: pi + 1, lines: [l.replace(/^\s*VÍ DỤ\s+\d+\s*/, '')] }; continue }
    if ((m = l.match(/^\s*Câu\s+(\d+)\.\s*(.*)$/)) && (khu === 'TL' || khu === 'TN')) { push(); cur = { id: `B${bai} ${khu}${m[1]}`, trang: pi + 1, lines: [m[2]] }; continue }
    if (cur && !/^\s*\d{3}\s*$/.test(l) && !/Ngô Đức Tài|^THCS\s*$|Lý thuyết và phân dạng/.test(l)) { cur.lines.push(l.trim()); if (pi + 1 !== cur.trang) cur.trang2 = pi + 1 }
  }
})
push()
writeFileSync(out, JSON.stringify(items, null, 1))
const n = items.filter((x) => !x.laDang)
console.log(n.length, 'bài;', ['VD', 'TL', 'TN'].map((k) => k + ' ' + n.filter((x) => x.id.includes(' ' + k)).length).join(' · '))
for (let b = 1; b <= 6; b++) console.log('B' + b, n.filter((x) => x.id.startsWith('B' + b + ' ')).length)
