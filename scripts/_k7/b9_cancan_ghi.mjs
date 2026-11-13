// Gộp file kq đã qua verify, cân lại vị trí đáp án đúng A–D (hoán đổi chỗ phương án đúng với phương án ở vị trí đích)
import { readFileSync } from 'node:fs'
import { S, luu } from './lib.mjs'
const ids = process.argv[2] ? readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean) : []
const kq = JSON.parse(readFileSync(`${S}/k7_b1_thapphan.json`, 'utf8')).filter((x) => !x.bo && !ids.includes(x.ma_cau))
const out = kq.map((it, i) => {
  const tgt = i % 4, cur = it.lua_chon.findIndex((o) => o.dung)
  const lc = it.lua_chon.slice();
  [lc[cur], lc[tgt]] = [lc[tgt], lc[cur]]
  return { ma_cau: it.ma_cau, dap_an: 'ABCD'[tgt], lua_chon: lc }
})
luu('k7_final_dai', out)
