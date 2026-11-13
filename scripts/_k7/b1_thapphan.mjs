// Đổi phương án phân số → số thập phân khi đáp số kho là số thập phân (kq từ mcq-auto)
import { readFileSync } from 'node:fs'
import { S, luu } from './lib.mjs'
const kq = JSON.parse(readFileSync(`${S}/kq_k7c.json`, 'utf8'))
const pool = new Map(JSON.parse(readFileSync(`${S}/pool_k7.json`, 'utf8')).cau.map((c) => [c.ma_cau, c]))
const toDec = (t) => {
  const m = t.match(/^\$?(-?)\W*dfrac\{(\d+)\}\{(\d+)\}\$?$/)
  if (!m) { const n = t.replace(/\$/g, '').trim(); return /^-?\d+(,\d+)?$/.test(n) ? n : null }
  let q = +m[3]; let a = 0, b = 0
  while (q % 2 === 0) { q /= 2; a++ }
  while (q % 5 === 0) { q /= 5; b++ }
  if (q !== 1) return null
  const k = Math.max(a, b), p = BigInt(m[2]) * (10n ** BigInt(k)) / BigInt(m[3])
  let s = p.toString().padStart(k + 1, '0')
  s = k ? s.slice(0, -k) + ',' + s.slice(-k) : s
  s = s.includes(',') ? s.replace(/0+$/, '').replace(/,$/, '') : s
  return (m[1] && s !== '0' ? '-' : '') + s
}
const out = []
for (const it of kq) {
  if (it.bo) { out.push(it); continue }
  const c = pool.get(it.ma_cau), kho = c.dap_an.trim()
  if (!/^-?\d+,\d+$/.test(kho)) { out.push(it); continue }
  const lc = it.lua_chon.map((o) => ({ ...o, text: toDec(o.text) }))
  if (lc.some((o) => o.text === null)) { out.push({ ma_cau: it.ma_cau, bo: 'nhiễu không đổi được sang số thập phân hữu hạn' }); continue }
  out.push({ ...it, lua_chon: lc })
}
luu('k7_b1_thapphan', out)
