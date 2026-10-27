// Sau dung-de-tu-soan: đề K5 ôn GKI (ảnh chụp, Thùy 27/10) — tên không nói kỳ ⇒ đặt tay ky=gk1; trắc nghiệm 1 điểm/câu như đề in.
import { readFileSync, writeFileSync } from 'node:fs'
for (const d of process.argv.slice(2)) {
  const f = d + '/de.json', de = JSON.parse(readFileSync(f, 'utf8'))
  de.ky = 'gk1'
  for (const p of de.phan) if (p.dang_thuc === 'trac_nghiem') p.diem_moi_cau = 1
  writeFileSync(f, JSON.stringify(de, null, 1))
}
