// Gắn hình vào lý thuyết/ví dụ K10 + thêm ví dụ cho NDB00540 / NDB00544.
//   node kho-rules/dai/lo/k10-bdm/hinh/ghi.mjs <thư-mục-png> [--ghi]     (không có --ghi ⇒ chạy khô, ROLLBACK)
import fs from 'node:fs'
import pg from 'pg'
import { execFileSync } from 'node:child_process'
import { FIGS, PATCH } from './figs.mjs'

const [dir, co] = process.argv.slice(2)
const cacheF = `${dir}/url-cache.json`
const cache = fs.existsSync(cacheF) ? JSON.parse(fs.readFileSync(cacheF, 'utf8')) : {}
const dung = new Set(Object.values(PATCH).flatMap((p) => [...Object.values(p.vd ?? {}).map((x) => x[0]), ...(p.lt ?? [])]))
for (const k of ['hd540a', 'hd540b', 'hd544a', 'hd544b']) dung.add(k)
for (const k of dung) {
  if (cache[k] || !FIGS[k]) continue
  const out = execFileSync('node', ['scripts/kho_anh.mjs', 'up', '--png', `${dir}/${k}.png`, '--ten', `k10-${k}`], { encoding: 'utf8' })
  cache[k] = JSON.parse(out.slice(out.indexOf('{'))).url
  fs.writeFileSync(cacheF, JSON.stringify(cache, null, 1))
}
const img = (k) => `![](${cache[k]})`

// Ví dụ mới cho NDB00540/NDB00544: xem vd-moi.mjs (bản ở đây từng hỏng backslash trong template literal — đã bỏ)

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL }); await c.connect()
await c.query('begin')
let n = 0
const bao = []
for (const [id, p] of Object.entries(PATCH)) {
  const r = (await c.query('select ly_thuyet, vi_du from dai_bdm_dang_bai where id=$1', [id])).rows[0]
  if (!r) { bao.push([id, 'không có dạng']); continue }
  let lt = r.ly_thuyet, vd = r.vi_du
  if (p.lt && !lt.includes('![](')) {
    const k = p.lt[0]
    const i = lt.indexOf('\n\n##', 3)
    lt = i < 0 ? `${lt}\n${img(k)}` : `${lt.slice(0, i)}\n${img(k)}${lt.slice(i)}`
  }
  if (p.vd) {
    const blocks = vd.split(/\n\n(?=##VD)/)
    for (const [idx, [k, vt]] of Object.entries(p.vd)) {
      const b = blocks[+idx - 1]
      if (b === undefined) { bao.push([id, `thiếu ví dụ ${idx}`]); continue }
      if (b.includes('![](')) continue
      const mark = '**Hướng dẫn giải:**'
      const j = b.indexOf(mark)
      if (j < 0) { bao.push([id, `ví dụ ${idx} không có "Hướng dẫn giải"`]); continue }
      if (vt === 'de') blocks[+idx - 1] = `${b.slice(0, j)}${img(k)}\n${b.slice(j)}`
      else { const e = b.indexOf('\n', j); blocks[+idx - 1] = `${b.slice(0, e)}\n${img(k)}${b.slice(e)}` }
    }
    vd = blocks.join('\n\n')
  }
  if (lt !== r.ly_thuyet || vd !== r.vi_du) {
    n += (await c.query(`update dai_bdm_dang_bai set ly_thuyet=$2, vi_du=$3, updated_at=now() where id=$1 and ly_thuyet=$4 and vi_du=$5`, [id, lt, vd, r.ly_thuyet, r.vi_du])).rowCount
  }
}
console.log({ dang_cap_nhat: n, bao })
await c.query(co === '--ghi' ? 'commit' : 'rollback'); await c.end()
console.log(co === '--ghi' ? 'ĐÃ GHI' : 'chạy khô (rollback)')
