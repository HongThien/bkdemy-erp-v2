// Điều tra dữ liệu test (buổi/chấm/đánh giá/elo/ET) của 1 số lớp. READ-ONLY (claude_ro).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const TEN = ['6A1', '6A2', '6A3', '9S1']
const c = new pg.Client({ connectionString: url })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  const lops = await q('select id, ten_lop, mon, khoi from lop where ten_lop = any($1) order by ten_lop', [TEN])
  console.log('LỚP:', lops.map((l) => `${l.ten_lop}(${l.id.slice(0, 8)})`).join(', ') || 'KHÔNG THẤY')
  const lopIds = lops.map((l) => l.id)
  if (!lopIds.length) { await c.end(); process.exit(0) }
  const buois = await q('select id, ma_buoi, ngay, trang_thai, lop_id from buoi_hoc where lop_id = any($1) order by ngay', [lopIds])
  console.log(`\nBUỔI HỌC: ${buois.length}`)
  for (const b of buois) {
    const ten = lops.find((l) => l.id === b.lop_id)?.ten_lop
    const [[hs], [pr], [gr], [eh], [ex], [dg], [dgd]] = await Promise.all([
      q('select count(*)::int n from buoi_hoc_hs where buoi_hoc_id=$1', [b.id]),
      q('select count(*)::int n from gami_session_problems where buoi_hoc_id=$1', [b.id]),
      q('select count(*)::int n from gami_grades where buoi_hoc_id=$1', [b.id]),
      q('select count(*)::int n from gami_elo_history where buoi_hoc_id=$1', [b.id]),
      q('select count(*)::int n from gami_exp_ledger where ref_buoi_hoc_id=$1', [b.id]),
      q('select count(*)::int n from buoi_danh_gia where buoi_hoc_id=$1', [b.id]),
      q('select count(*)::int n from buoi_danh_gia_dang where buoi_hoc_id=$1', [b.id]),
    ])
    console.log(`  ${ten} ${b.ma_buoi} [${b.trang_thai}] · roster ${hs.n} · bài ${pr.n} · chấm ${gr.n} · elo_hist ${eh.n} · exp ${ex.n} · đánhgiá ${dg.n}/${dgd.n}`)
  }
  // ET / tài liệu bám các lớp này
  const tl = await q('select id, loai, ten, ngay from tai_lieu where lop_id = any($1) order by loai, ngay', [lopIds])
  console.log(`\nTÀI LIỆU bám lớp (ET/giáo trình buổi/BTVN): ${tl.length}`)
  for (const t of tl) console.log(`  [${t.loai}] ${t.ten}`)
  // gami_elo của HS trong các lớp này + các HS đó có buổi ở lớp KHÁC không
  const hsIds = (await q('select distinct hoc_sinh_id from buoi_hoc_hs where buoi_hoc_id in (select id from buoi_hoc where lop_id=any($1))', [lopIds])).map((r) => r.hoc_sinh_id)
  console.log(`\nHS có dính buổi 4 lớp này: ${hsIds.length}`)
  if (hsIds.length) {
    const [[elo]] = await Promise.all([q('select count(*)::int n from gami_elo where hoc_sinh_id = any($1)', [hsIds])])
    const other = await q('select count(distinct b.id)::int n from buoi_hoc b join buoi_hoc_hs h on h.buoi_hoc_id=b.id where h.hoc_sinh_id=any($1) and b.lop_id <> all($2)', [hsIds, lopIds])
    console.log(`  gami_elo dòng: ${elo.n} · các HS này còn buổi ở lớp KHÁC: ${other[0].n}`)
  }
} finally { await c.end() }
