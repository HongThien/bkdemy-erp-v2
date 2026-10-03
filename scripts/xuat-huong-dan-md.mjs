// Xuất nội dung Hướng dẫn chơi + tutorial ra 1 file Markdown ĐỌC ĐƯỢC để Thùy duyệt (nguồn thật vẫn là noiDungHuongDan.ts / noiDungTutorial.ts — sửa ở đó).
// Chạy: node scripts/xuat-huong-dan-md.mjs  → HUONG-DAN-CHOI-DUYET.md
import { buildSync } from 'esbuild'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
const nap = async (f) => { const out = `node_modules/.cache/${f.split('/').pop()}.mjs`; buildSync({ entryPoints: [f], outfile: out, bundle: true, format: 'esm', platform: 'node', logLevel: 'silent' }); return import(pathToFileURL(out).href + '?t=' + Date.now()) }
const hd = await nap('src/screens/hocsinh/huongdan/noiDungHuongDan.ts'), tu = await nap('src/screens/hocsinh/tutorial/noiDungTutorial.ts')
const L = []
L.push('# Hướng dẫn chơi — bản để duyệt', '', '> Nguồn thật: `src/screens/hocsinh/huongdan/noiDungHuongDan.ts` (hướng dẫn) và `src/screens/hocsinh/tutorial/noiDungTutorial.ts` (tutorial). File này chỉ để đọc/duyệt — sửa chữ ở nguồn rồi chạy lại `node scripts/xuat-huong-dan-md.mjs`.', '',
  '**Luật giọng:** thân bài FORMAL ở mọi style. Style game chỉ đổi TÊN + TÓM TẮT (dòng *Giọng game*). Số liệu theo code/DB ngày 03/10/2026; số chưa chốt thì không nêu.', '',
  `Trang đầu: **${hd.MO_DAU_HD.tieu}** — ${hd.MO_DAU_HD.phu}  \n*Giọng game:* **${hd.MO_DAU_HD.game.tieu}** — ${hd.MO_DAU_HD.game.phu}`, '')
const NHAN = { luat: 'LUẬT', thuong: 'PHẦN THƯỞNG', meo: 'MẸO', luuy: 'LƯU Ý' }
let stt = 0
for (const n of hd.NHOM) {
  L.push(`## Nhóm: ${n.ten}`, `*${n.phu}*`, '')
  for (const c of hd.CHU_DE.filter((x) => x.nhom === n.id)) {
    stt++
    L.push(`### ${stt}. ${c.ten}${c.sap ? '  — *(Sắp có)*' : ''}`, `**Tóm tắt:** ${c.tomTat}`)
    if (c.game) L.push(`*Giọng game:* **${c.game.ten ?? c.ten}** — ${c.game.tomTat ?? c.tomTat}`)
    if (c.tutorial) L.push(`*Tutorial tương ứng:* chặng \`${c.tutorial}\``)
    L.push('')
    for (const k of c.khoi) {
      L.push(`**${k.loai ? `[${NHAN[k.loai]}] ` : ''}${k.tieu}**`)
      for (const y of k.y) L.push(k.doan ? `${y}` : `- ${y}`)
      L.push('')
    }
    if (c.bang) { L.push(`**${c.bang.tieu}**`, '', `| ${c.bang.cot.join(' | ')} |`, `|${c.bang.cot.map(() => '---').join('|')}|`, ...c.bang.dong.map((r) => `| ${r.join(' | ')} |`), '') }
  }
}
L.push('---', '', '## Tutorial "Hành trình tân thủ"', '', `**Mở đầu:** ${tu.MO_DAU.join(' ').replace('{n}', String(tu.CHUONG.length))}`, '')
tu.CHUONG.forEach((c, i) => {
  L.push(`### Chặng ${i + 1}: ${c.ten} (\`${c.id}\`)`, `*${c.phu}* · Mở khoá: ${c.kyNang}`, '')
  c.buoc.forEach((b, j) => L.push(`${j + 1}. ${b.noi}`))
  L.push('')
})
L.push(`**Kết thúc:** ${tu.KET_THUC.tieuDe} — ${tu.KET_THUC.noi}`, '')
fs.writeFileSync('HUONG-DAN-CHOI-DUYET.md', L.join('\n'))
console.log('ok', stt, 'chủ đề,', tu.CHUONG.length, 'chặng')
