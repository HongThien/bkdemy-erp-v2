import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m) ?? [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()

// Tìm lớp 8A1
const { rows: lops } = await c.query(`select id, ten_lop, mon, khoi from lop where ten_lop ilike '%8A1%' order by ten_lop`)
console.log('Lớp khớp 8A1:', lops)

const NGAY = '2026-07-23'
for (const lop of lops) {
  console.log(`\n===== ${lop.ten_lop} (${lop.mon}) id=${lop.id} =====`)

  // buổi ngày 23/07
  const { rows: buoi } = await c.query(`select id, ngay::text, loai, trang_thai, btvn_dong_at from buoi_hoc where lop_id=$1 and ngay=$2`, [lop.id, NGAY])
  console.log('Buổi 23/07:', buoi)

  // tất cả tài liệu loai='btvn' của lớp gần đây
  const { rows: docs } = await c.query(`select id, ngay::text, loai, ten, created_at from tai_lieu where lop_id=$1 and loai='btvn' order by ngay desc limit 12`, [lop.id])
  console.log('BTVN docs:', docs)

  // doc btvn của đúng ngày 23/07 + các phan của nó
  const { rows: docs23 } = await c.query(`select id, ten, created_at from tai_lieu where lop_id=$1 and loai='btvn' and ngay=$2 order by created_at desc`, [lop.id, NGAY])
  console.log('BTVN doc 23/07:', docs23)
  for (const d of docs23) {
    const { rows: phans } = await c.query(`select id, thu_tu, loai_phan, ref_ma, tieu_de from tai_lieu_phan where tai_lieu_id=$1 order by thu_tu`, [d.id])
    console.log(`  doc ${d.id} phans:`)
    for (const p of phans) {
      const { rows: nc } = await c.query(`select count(*) n from tai_lieu_cau where phan_id=$1`, [p.id])
      console.log(`    thu_tu=${p.thu_tu} loai_phan=${p.loai_phan} ref_ma=${p.ref_ma} n_cau=${nc[0].n}`)
    }
  }

  // config ôn tập
  const { rows: cfg } = await c.query(`select nguon_id, nguon_buoi, config from btvn_ontap_config where lop_id=$1 order by updated_at desc limit 5`, [lop.id])
  console.log('  btvn_ontap_config:', JSON.stringify(cfg, null, 2))
}

await c.end()
