import { readFileSync } from 'node:fs'
import pg from 'pg'
const lines = readFileSync('.env', 'utf8').split(/\r?\n/)
const envKey = (t) => { const l = lines.find((x) => x.trim().startsWith(t + '=')); return l ? l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : null }
const c = new pg.Client({ connectionString: envKey('DATABASE_URL_RO') || envKey('DATABASE_URL') })
await c.connect()
console.table((await c.query(`select ma_chu_de, ten_chu_de, count(distinct ma_chuyen_de) so_cd, count(*) so_dang from dai_ban_do where khoi='12' group by 1,2 order by 1`)).rows)
await c.end()
