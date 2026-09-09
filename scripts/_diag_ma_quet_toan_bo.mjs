// QUÉT TOÀN BỘ: cột text nào ĐANG chứa mã dạng (8 số) / mã câu (11 số)?
// Không đoán từ tên cột — dò theo GIÁ TRỊ, để không sót tham chiếu text trần (CLAUDE.md §2).
import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s,p=[]) => (await c.query(s,p)).rows

const cols = await q(`select table_name t, column_name col from information_schema.columns
  where table_schema='public' and data_type in ('text','character varying')
    and table_name not like 'pg_%' order by 1,2`)
console.log(`Quét ${cols.length} cột text...`)
const hits = []
for (const { t, col } of cols) {
  try {
    const r = (await q(`select count(*) filter (where "${col}" ~ '^[0-9]{8}$')::int d8,
                               count(*) filter (where "${col}" ~ '^[0-9]{11}$')::int d11,
                               count(*) filter (where "${col}" ~ '^[0-9]{1,2}[A-Z][0-9]{6}$')::int legacy
                        from "${t}"`))[0]
    if (r.d8 || r.d11 || r.legacy) hits.push({ t, col, ...r })
  } catch {}
}
console.log('\n## CỘT CHỨA MÃ (8số = mã dạng · 11số = mã câu · legacy = 4T010101)')
hits.forEach(h=>console.log(`   ${h.t}.${h.col}`.padEnd(46)+`dạng ${String(h.d8).padStart(6)} · câu ${String(h.d11).padStart(6)} · legacy ${h.legacy}`))

console.log('\n## JSONB có thể chứa mã')
const jb = await q(`select table_name t, column_name col from information_schema.columns
  where table_schema='public' and data_type='jsonb' order by 1,2`)
for (const { t, col } of jb) {
  try {
    const r = (await q(`select count(*)::int n from "${t}" where "${col}"::text ~ '[^0-9]([0-9]{8}|[0-9]{11})[^0-9]'`))[0]
    if (r.n) console.log(`   ${t}.${col}: ${r.n} dòng có chuỗi 8/11 số`)
  } catch {}
}

console.log('\n## buoi_hoc.lop_id NULL → môn suy từ đâu?')
console.log((await q(`select loai, count(*)::int n, count(muc_hoc_duoi_id)::int co_muc from buoi_hoc where lop_id is null group by 1 order by 2 desc`))
  .map(r=>`   loai=${r.loai} n=${r.n} có muc_hoc_duoi ${r.co_muc}`).join('\n'))
console.log('   → gami rows thuộc buổi lop_id null, theo loai:')
console.log((await q(`select b.loai, count(*)::int n from gami_session_problems x join buoi_hoc b on b.id=x.buoi_hoc_id
   where b.lop_id is null and x.ma_dang is not null group by 1 order by 2 desc`)).map(r=>`     ${r.loai}: ${r.n}`).join('\n'))

// bổ trợ: buổi bổ trợ nối về bo_tro_* nào?
console.log('\n## bảng nối buổi bổ trợ → lớp/môn')
for (const t of ['bo_tro_yeu','bo_tro_duoi','muc_hoc_duoi'])
  console.log(`   ${t}:`, (await q(`select column_name from information_schema.columns where table_schema='public' and table_name='${t}' order by 1`)).map(r=>r.column_name).join(', '))
await c.end()
