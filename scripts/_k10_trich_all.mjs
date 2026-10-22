import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'
const S = process.argv[2]; const K = 'E:/BK ACADEMY/Tài liệu tham khảo/K10'
const jobs = []
function quet(d, tag, filter) { for (const e of fs.readdirSync(d,{withFileTypes:true})) { const p = path.join(d,e.name); if (e.isDirectory()) quet(p, tag, filter); else if (e.name.endsWith('.docx') && !e.name.startsWith('~$') && filter(e.name,p)) jobs.push({p, tag}) } }
quet(path.join(S,'src2/nbv'), 'NBV', (n)=>!/ - CH\.docx$/.test(n))
quet(path.join(K,'TOÁN 10 PNL - 2026/Chương 01. Mệnh đề, tập hợp'), 'PNL', (n)=>/_GV\.docx$/.test(n))
quet(path.join(K,'TOÁN 10 PNL - 2026/Chương 02. Bất phương trình và hệ bất phương trình bậc nhất hai ẩn'), 'PNL', (n)=>/_GV\.docx$/.test(n))
quet('C:/Temp/k10c3', 'PNL', (n)=>/_GV\.docx$/.test(n))
for (const c of ['CHƯƠNG 1-MỆNH ĐỀ và TẬP HỢP','CHƯƠNG 2-BẤT PHƯƠNG TRÌNH và HỆ BPT BẬC NHẤT HAI ẨN','CHƯƠNG 4-HỆ THỨC LƯỢNG TRONG TAM GIÁC'])
  quet(path.join(K,'TOAN 10 - TOAN TU TAM/TOÁN 10 - TỪ TÂM',c), 'TT', (n)=>/GV|P1|P2/.test(n) && !/HS\.docx/.test(n))
console.log('jobs', jobs.length)
const out = path.join(S,'txt2'); fs.mkdirSync(out,{recursive:true})
let i=0
const used = new Set()
for (const j of jobs) {
  const par = path.basename(path.dirname(j.p)).replace(/[^\p{L}\p{N}\-. _]/gu,'_').slice(0,45)
  let name = j.tag + '__' + par + '__' + path.basename(j.p,'.docx').replace(/[^\p{L}\p{N}\-. _]/gu,'_').slice(0,80)
  while (used.has(name)) name += '_'
  used.add(name)
  const tmp = path.join(out, '_t' + (++i)); fs.mkdirSync(tmp,{recursive:true})
  try { execFileSync('node',['scripts/kho/mathtype-thu/doc-docx.mjs', j.p, '--ra', tmp],{stdio:'ignore'}) } catch(e) {}
  const base = path.basename(j.p,'.docx'); const src = path.join(tmp, base + '.txt')
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(out, name + '.txt')); else console.log('THIẾU', j.p)
  fs.rmSync(tmp,{recursive:true,force:true})
}
console.log('XONG', i)
