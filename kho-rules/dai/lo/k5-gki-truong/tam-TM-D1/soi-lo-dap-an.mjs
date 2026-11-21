// Soi: Phan 1 khong lo dap so; dap_an trong tep khop ket qua cuoi o Phan 2; khong dung \cdot; so buoc 3-6.
import fs from 'node:fs';
const f = process.argv[2];
const txt = fs.readFileSync(f, 'utf8');
const blocks = txt.split(/^### /m).slice(1);
let loi = 0;
for (const b of blocks) {
  const head = b.split('\n')[0];
  const nhan = head.split('|')[0].trim();
  const dap = (head.match(/dap_an=([^|]*?)\s*\|/) || [])[1]?.trim();
  const p1 = b.split('**Phần 1. Hướng dẫn**')[1]?.split('**Phần 2. Trình bày**')[0] ?? '';
  const p2 = b.split('**Phần 2. Trình bày**')[1] ?? '';
  const nBuoc = (p1.match(/^\*\*Bước \d+\.\*\*/gm) || []).length;
  if (nBuoc < 3 || nBuoc > 6) { loi++; console.log('LOI so buoc', nhan, nBuoc); }
  if (/\\cdot/.test(b) || /\\frac\{/.test(b.replace(/\\dfrac/g, ''))) { loi++; console.log('LOI ky hieu', nhan); }
  if (dap && dap !== '—' && !/^[A-D]$/.test(dap)) {
    // tach cac so trong dap_an, kiem khong xuat hien trong Phan 1, co xuat hien trong Phan 2
    const so = dap.match(/\d+(?:,\d+)?/g) || [];
    for (const s of so) {
      const re = new RegExp('(^|[^\\d,])' + s.replace(',', ',') + '($|[^\\d])');
      if (re.test(p1)) { loi++; console.log('LO dap so trong Phan 1:', nhan, s); }
      if (!re.test(p2)) { loi++; console.log('Phan 2 thieu so', nhan, s); }
    }
  }
  if (/^[A-D]$/.test(dap || '')) {
    const m = p2.trim().split('\n').filter(Boolean).pop();
    if (m !== `Chọn ${dap}.`) { loi++; console.log('Dong cuoi khong khop', nhan, m); }
    if (new RegExp('Chọn ' + dap).test(p1)) { loi++; console.log('Phan 1 lo chon', nhan); }
  }
}
console.log(blocks.length + ' cau, ' + loi + ' loi');
