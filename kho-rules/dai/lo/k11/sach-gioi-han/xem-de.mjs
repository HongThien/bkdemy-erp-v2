// xem-de.mjs — pha 1 của trạm SOÁT: in id + loại + đề (+ phương án / mệnh đề), KHÔNG in lời giải, đáp án, dạng.
//   node kho-rules/dai/lo/k11/sach-gioi-han/xem-de.mjs <don-vi>
import { readFileSync } from 'node:fs'
const f = process.argv[2]
const ds = JSON.parse(readFileSync(new URL(`./${f}.json`, import.meta.url), 'utf8'))
for (const q of ds) {
  console.log(`\n=== ${q.id} · ${q.loai_cau}`)
  console.log(q.noi_dung)
  if (q.lua_chon) q.lua_chon.forEach((x, i) => console.log(`  ${'ABCD'[i]}. ${x}`))
  if (q.menh_de) q.menh_de.forEach((m, i) => console.log(`  ${'abcd'[i]}) ${m.noi_dung}`))
}
