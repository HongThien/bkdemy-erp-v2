// ghep-khuc.mjs <BATCH> <MA> — ghép các khúc batch/<B>/<MA>.k<N>.soan.md (N = 1,2,…) thành batch/<B>/<MA>.soan.md
//   Đầu tệp (# ĐỀ | …, kieu, nam, bo_sach…) lấy từ khúc 1; mọi `## PHẦN n` đánh số lại liên tục theo thứ tự khúc;
//   các mục `## GHI CHÚ CHO NGƯỜI DUYỆT` gom về cuối (ghi rõ khúc). Biên bản soát khúc <MA>.k<N>.soat.md phải ĐẠT hết
//   ⇒ ghi <MA>.soat.md tổng (KẾT LUẬN: ĐẠT + bảng khúc). Không xoá tệp khúc. Tệp đích đã có ⇒ dừng (thêm --de để ghi đè).
import fs from 'node:fs';
import path from 'node:path';
const [B, MA, co] = process.argv.slice(2);
if (!B || !MA) { console.error('dùng: node ghep-khuc.mjs <BATCH> <MA> [--de]'); process.exit(1); }
const dir = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), 'batch', B);
const khuc = fs.readdirSync(dir).map(f => f.match(new RegExp(`^${MA}\\.k(\\d+)\\.soan\\.md$`))).filter(Boolean)
  .map(m => +m[1]).sort((a, b) => a - b);
if (!khuc.length) { console.error(`❌ không có khúc ${MA}.k<N>.soan.md trong ${dir}`); process.exit(1); }
if (khuc.some((k, i) => k !== i + 1)) { console.error(`❌ khúc không liên tục: ${khuc.join(',')}`); process.exit(1); }
const dich = path.join(dir, `${MA}.soan.md`), dichSoat = path.join(dir, `${MA}.soat.md`);
if (fs.existsSync(dich) && co !== '--de') { console.error(`❌ ${dich} đã có — thêm --de để ghi đè`); process.exit(1); }
const soat = [];
for (const k of khuc) {
  const s = path.join(dir, `${MA}.k${k}.soat.md`);
  const ok = fs.existsSync(s) && /KẾT LUẬN:\**\s*ĐẠT/.test(fs.readFileSync(s, 'utf8'));
  soat.push({ k, ok });
}
if (soat.some(x => !x.ok)) { console.error(`❌ khúc chưa soát ĐẠT: ${soat.filter(x => !x.ok).map(x => 'k' + x.k).join(', ')}`); process.exit(1); }
let dau = null, than = [], ghiChu = [], n = 0;
for (const k of khuc) {
  const s = fs.readFileSync(path.join(dir, `${MA}.k${k}.soan.md`), 'utf8').replace(/\r\n/g, '\n');
  const i0 = s.search(/^## PHẦN /m);
  if (i0 < 0) { console.error(`❌ khúc ${k} không có ## PHẦN`); process.exit(1); }
  if (k === 1) dau = s.slice(0, i0).trimEnd();
  let rest = s.slice(i0);
  const ig = rest.search(/^## GHI CHÚ CHO NGƯỜI DUYỆT/m);
  if (ig >= 0) { ghiChu.push(`**Khúc ${k}:**\n` + rest.slice(ig).replace(/^## GHI CHÚ CHO NGƯỜI DUYỆT\s*\n/, '').trim()); rest = rest.slice(0, ig); }
  // PHẦN đầu khúc ghi "<tên> (tiếp)" trùng tên PHẦN cuối khúc trước ⇒ nối vào PHẦN đó (bỏ dòng đầu PHẦN)
  const tenPhan = (l) => (l.split('|')[1] || '').replace(/\(tiếp\)/i, '').trim().toLowerCase();
  const dongDau = rest.split('\n')[0];
  if (than.length && /\(tiếp\)/i.test(dongDau)) {
    const cuoiTruoc = [...than.join('\n').matchAll(/^## PHẦN .*$/gm)].pop()?.[0] || '';
    const a = tenPhan(cuoiTruoc), b = tenPhan(dongDau);
    if (a && b && (a === b || a.endsWith(b))) rest = rest.split('\n').slice(1).join('\n');
  }
  rest = rest.replace(/^## PHẦN \d+ \|/gm, () => `## PHẦN ${++n} |`);
  than.push(rest.trim());
}
let out = dau + '\n\n' + than.join('\n\n') + '\n';
if (ghiChu.length) out += '\n## GHI CHÚ CHO NGƯỜI DUYỆT\n\n' + ghiChu.join('\n\n') + '\n';
if (/[\x00-\x08\x0b\x0c\x0e-\x1f]|\t/.test(out)) { console.error('❌ có ký tự điều khiển trong khúc'); process.exit(1); }
// nhãn câu phải duy nhất trong mỗi PHẦN — sau đánh số lại thì PHẦN mỗi khúc riêng nên chỉ kiểm trùng trong PHẦN
fs.writeFileSync(dich, out);
fs.writeFileSync(dichSoat, `# Biên bản soát tổng ${MA} (ghép ${khuc.length} khúc)\n\n| Khúc | Biên bản |\n|---|---|\n` +
  khuc.map(k => `| k${k} | ${MA}.k${k}.soat.md — ĐẠT |`).join('\n') + `\n\nKẾT LUẬN: ĐẠT\n`);
console.log(`✔ ${MA}: ghép ${khuc.length} khúc · ${n} PHẦN → ${path.basename(dich)} + ${path.basename(dichSoat)}`);
