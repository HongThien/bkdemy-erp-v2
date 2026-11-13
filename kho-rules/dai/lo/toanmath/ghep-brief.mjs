// ghep-brief.mjs — dựng brief SOẠN/SOÁT cho 1 batch toanmath = đầu riêng của batch (batch/<ma>/_dau-brief.md) + brief gốc đã chạy thật
// (khuôn _ghep-brief.mjs của k9/bo-de: chỉ đổi đường dẫn, không viết lại luật).
//   node kho-rules/dai/lo/toanmath/ghep-brief.mjs B001 k9-cki
// Ra: batch/<ma>/brief-soan.md, batch/<ma>/brief-soat.md
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
const [MA, GOC] = process.argv.slice(2)
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const LO = path.resolve(HERE, '..')
const dau = readFileSync(path.join(HERE, 'batch', MA, '_dau-brief.md'), 'utf8').replace(/\r\n/g, '\n')
const MAP = { 'k9-cki': { lo: ['lo\\k9\\cki\\', 'lo/k9/cki/'], lv: ['K9-cki\\', 'K9-cki/'] },
  // 13/11: brief gốc khối 6/7/8 (dây chuyền đề GKI/CKI 10/10) — <LV> = de-thi\K<khối>\<MA>, tệp soạn lo\k<khối>\<MA>
  //   CHỈ thay chỗ trỏ tệp của đề (`lo\k8\<MA>`), KHÔNG thay `lo\k8\GKI-01.soan.md` (đề mẫu khuôn tệp — phải giữ đường dẫn thật)
  k8: { lo: ['lo\\k8\\<MA>', 'lo/k8/<MA>'], lv: ['de-thi\\K8\\', 'de-thi/K8/'] },
  k7: { lo: ['lo\\k7\\<MA>', 'lo/k7/<MA>'], lv: ['de-thi\\K7\\', 'de-thi/K7/'] },
  k6: { lo: ['lo\\k6\\<MA>', 'lo/k6/<MA>'], lv: ['de-thi\\K6\\', 'de-thi/K6/'] },
  // 13/11: đề thi THPT K11 — gốc = brief ĐỀ CƯƠNG K11 (24/10, có khuôn TN · Đ/S · TLN); một đề = một tệp ⇒ bỏ hậu tố khúc `.p<P>`
  k11dc: { lo: ['lo\\k11\\de-cuong\\<MA>', 'lo/k11/de-cuong/<MA>'], lv: ['de-cuong\\K11\\', 'de-cuong/K11/'], boKhuc: true, src: (k) => `k11/de-cuong/brief-${k}.md` } }[GOC]
if (!MAP) throw new Error('chưa có khuôn brief cho ' + GOC)
const LVMOI = /^de-(thi|cuong)/.test(MAP.lv[0]) ? [`de-thi\\toanmath\\${MA}\\`, `de-thi/toanmath/${MA}/`] : [`toanmath\\${MA}\\`, `toanmath/${MA}/`]
const DUOI = MAP.lo[0].endsWith('<MA>') ? '<MA>' : ''
for (const kind of ['soan', 'soat']) {
  let s = readFileSync(path.join(LO, MAP.src ? MAP.src(kind) : `${GOC}-brief-${kind}.md`), 'utf8').replace(/\r\n/g, '\n')
  s = s.replaceAll(MAP.lo[0], `lo\\toanmath\\batch\\${MA}\\${DUOI}`).replaceAll(MAP.lo[1], `lo/toanmath/batch/${MA}/${DUOI}`)
    .replaceAll(MAP.lv[0], LVMOI[0]).replaceAll(MAP.lv[1], LVMOI[1])
    .replaceAll(`lo\\${GOC}-brief-soan.md`, `lo\\toanmath\\batch\\${MA}\\brief-soan.md`).replaceAll(`lo/${GOC}-brief-soan.md`, `lo/toanmath/batch/${MA}/brief-soan.md`)
  if (MAP.boKhuc) s = s.replaceAll('.p<P>', '').replaceAll('ve_p<P>', 've')
  writeFileSync(path.join(HERE, 'batch', MA, `brief-${kind}.md`), dau + '\n---\n\n' + s)
}
console.log(`✔ batch/${MA}/brief-soan.md, brief-soat.md (gốc ${GOC})`)
