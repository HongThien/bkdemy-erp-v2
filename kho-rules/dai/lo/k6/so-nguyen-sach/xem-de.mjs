// xem-de.mjs <b1|b2|…|ot> — in CHỈ id · loại · đề (không đáp án, không lời giải, không dạng) cho trạm SOÁT giải mù.
import { readFileSync } from 'node:fs'
const f = process.argv[2]
const a = JSON.parse(readFileSync(new URL(`./${f}.json`, import.meta.url), 'utf8'))
for (const q of a) console.log(`### ${q.id} | ${q.loai_cau}\n${q.noi_dung}${q.lua_chon ? '\n' + q.lua_chon.join('\n') : ''}\n`)
