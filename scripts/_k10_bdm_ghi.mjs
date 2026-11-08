import pg from 'pg'; import fs from 'node:fs'
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#')&&l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()];}))
const u = JSON.parse(fs.readFileSync('kho-rules/dai/lo/k10-bdm/ghi-db.json','utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL }); await c.connect()
await c.query('begin')
let nd = 0, nn = 0
for (const d of u.dang) {
  if (d.ly_thuyet) nd += (await c.query(`update dai_bdm_dang_bai set ly_thuyet=$2, updated_at=now() where id=$1 and coalesce(ly_thuyet,'')=''`, [d.id, d.ly_thuyet])).rowCount
  if (d.vi_du) nd += (await c.query(`update dai_bdm_dang_bai set vi_du=$2, updated_at=now() where id=$1 and coalesce(vi_du,'')=''`, [d.id, d.vi_du])).rowCount
}
for (const n of u.nhom) nn += (await c.query(`update dai_bdm_nhom set ly_thuyet=$2, updated_at=now() where id=$1 and coalesce(ly_thuyet,'')=''`, [n.id, n.ly_thuyet])).rowCount
console.log({ ghi_truong_dang: nd, ghi_nhom: nn, ky_vong_dang: u.dang.reduce((a,d)=>a+(d.ly_thuyet?1:0)+(d.vi_du?1:0),0), ky_vong_nhom: u.nhom.length })
await c.query(process.argv[2] === '--ghi' ? 'commit' : 'rollback'); await c.end()
console.log(process.argv[2] === '--ghi' ? 'ĐÃ GHI' : 'chạy khô (rollback)')
