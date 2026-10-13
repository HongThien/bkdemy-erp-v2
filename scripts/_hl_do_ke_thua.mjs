// C0 (spec-hinh-cay-nhanh.md §6) — ĐO, chỉ đọc: bao nhiêu bài `hinh_baitoan` đang dựa vào luật 17/08
// "kế thừa giả thiết/hình của bài CHA (tiền đề chính)" mà luật mới (đường gốc→nhánh + riêng) sẽ cho kết quả KHÁC.
// Port của `giaThietBaiToan` / `anhCuaBaiToan` (src/lib/kho/hinh.ts). Ghi báo cáo reports/hl-c0-ke-thua-17-08.md.
// Chạy: node scripts/_hl_do_ke_thua.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const pick = k => (txt.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm')) || [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: pick('DATABASE_URL_RO') || pick('DATABASE_URL'), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
const q = async s => (await c.query(s)).rows
const mh = await q(`select id, ma, ten, khoi, gia_thiet, gia_thiet_them, gt_thay_the, anh_cau_hinh, phan from hinh_mo_hinh`)
const cha = await q(`select mo_hinh_id, cha_id from hinh_mo_hinh_cha`)
const bt = await q(`select id, ma, mo_hinh_id, cap, phat_bieu, gia_thiet_rieng, gt_thay_the, anh_chuan from hinh_baitoan`)
const cg = await q(`select id, baitoan_id, la_mac_dinh, thu_tu from hinh_cach_giai`)
const td = await q(`select cach_id, tien_de_id from hinh_cach_tien_de`)
await c.query('ROLLBACK'); await c.end()

const MH = new Map(mh.map(m => [m.id, m])), BT = new Map(bt.map(b => [b.id, b]))
const chaCua = id => cha.filter(x => x.mo_hinh_id === id).map(x => x.cha_id)
function duong(id) { const p = [], seen = new Set(); let cur = id; while (cur && !seen.has(cur)) { seen.add(cur); p.unshift(cur); cur = chaCua(cur)[0] } return p }
function gtDayDu(mid) {
  const nodes = duong(mid).map(i => MH.get(i)).filter(Boolean)
  let base = 0; nodes.forEach((m, i) => { if (i > 0 && m.gt_thay_the) base = i })
  const parts = []
  if (nodes[base]?.gia_thiet?.trim()) parts.push(nodes[base].gia_thiet.trim())
  for (let i = base + 1; i < nodes.length; i++) if (nodes[i].gia_thiet_them?.trim()) parts.push(nodes[i].gia_thiet_them.trim())
  return parts.join('; ')
}
function anhMH(mid) { for (const i of duong(mid).slice().reverse()) if (MH.get(i)?.anh_cau_hinh) return MH.get(i).anh_cau_hinh; return null }
function cachMD(bid) { const ds = cg.filter(x => x.baitoan_id === bid); if (!ds.length) return null; return ds.find(x => x.la_mac_dinh) ?? ds.slice().sort((a, b) => a.thu_tu - b.thu_tu)[0] }
function tienDe(bid) { const k = cachMD(bid); return k ? td.filter(x => x.cach_id === k.id).map(x => x.tien_de_id) : [] }
function chaKeThua(bid, da) {
  return tienDe(bid).filter(i => !da.has(i)).map(i => BT.get(i)).filter(Boolean)
    .sort((a, b) => b.cap - a.cap || b.ma.localeCompare(a.ma))[0] ?? null
}
function gtCu(bid, da = new Set()) {
  const b = BT.get(bid); if (!b || da.has(bid)) return ''
  da.add(bid)
  if (b.gt_thay_the) return b.gia_thiet_rieng?.trim() ?? ''
  const ch = chaKeThua(bid, da)
  const nen = ch ? gtCu(ch.id, da) : gtDayDu(b.mo_hinh_id)
  return [nen, b.gia_thiet_rieng?.trim()].filter(Boolean).join('; ')
}
function gtMoi(bid) {
  const b = BT.get(bid)
  if (b.gt_thay_the) return b.gia_thiet_rieng?.trim() ?? ''
  return [gtDayDu(b.mo_hinh_id), b.gia_thiet_rieng?.trim()].filter(Boolean).join('; ')
}
function anhCu(bid, da = new Set()) {
  const b = BT.get(bid); if (!b || da.has(bid)) return null
  da.add(bid); if (b.anh_chuan) return b.anh_chuan
  const ch = chaKeThua(bid, da)
  return (ch ? anhCu(ch.id, da) : null) ?? anhMH(b.mo_hinh_id)
}
const anhMoi = bid => { const b = BT.get(bid); return b.anh_chuan || anhMH(b.mo_hinh_id) }

const norm = s => (s || '').replace(/\s+/g, ' ').trim()
const rows = []
for (const b of bt) {
  const coCha = tienDe(b.id).length > 0
  const gc = norm(gtCu(b.id)), gm = norm(gtMoi(b.id))
  const ac = anhCu(b.id), am = anhMoi(b.id)
  rows.push({ ma: b.ma, mh: MH.get(b.mo_hinh_id)?.ma, khoi: MH.get(b.mo_hinh_id)?.khoi, coCha, gtDoi: gc !== gm, anhDoi: (ac || null) !== (am || null),
    mat: gc.length > gm.length, gc, gm })
}
const tong = rows.length, coCha = rows.filter(r => r.coCha).length
const gtDoi = rows.filter(r => r.gtDoi), anhDoi = rows.filter(r => r.anhDoi)
const theoKhoi = {}
for (const r of rows) { const k = r.khoi || '?'; (theoKhoi[k] ??= { tong: 0, coCha: 0, gtDoi: 0, anhDoi: 0 }); const t = theoKhoi[k]; t.tong++; t.coCha += r.coCha; t.gtDoi += r.gtDoi; t.anhDoi += r.anhDoi }

let md = `# C0 — đo luật 17/08 (kế thừa giả thiết/hình của bài cha)\n\n`
md += `- Tổng bài \`hinh_baitoan\`: **${tong}** · có tiền đề (cách mặc định): **${coCha}**\n`
md += `- **Giả thiết hiệu lực ĐỔI khi bỏ luật 17/08: ${gtDoi.length}** bài (luật mới ngắn hơn: ${gtDoi.filter(r => r.mat).length} · dài hơn/khác: ${gtDoi.filter(r => !r.mat).length})\n`
md += `- **Hình hiệu lực ĐỔI: ${anhDoi.length}** bài\n\n`
md += `| khối | tổng | có tiền đề | GT đổi | hình đổi |\n|---|---|---|---|---|\n`
for (const [k, t] of Object.entries(theoKhoi).sort()) md += `| ${k} | ${t.tong} | ${t.coCha} | ${t.gtDoi} | ${t.anhDoi} |\n`
md += `\n> Lưu ý: luật mới ở đây = giả thiết **mô hình** (đường tổ tiên theo \`hinh_mo_hinh_cha\`) + riêng bài. Khi cây nhánh có thật, "mô hình" sẽ là NHÁNH chứa bài — số liệu này là cận trên cho việc phải chuyển hoá thủ công (bài đổi ⇒ cần gán nhánh/GT riêng).\n\n`
md += `## 40 bài đầu có GT đổi\n\n`
for (const r of gtDoi.slice(0, 40)) md += `### ${r.ma} (${r.mh})\n- cũ: ${r.gc || '∅'}\n- mới: ${r.gm || '∅'}\n\n`
mkdirSync(new URL('../reports/', import.meta.url), { recursive: true })
writeFileSync(new URL('../reports/hl-c0-ke-thua-17-08.md', import.meta.url), md)
console.log(md.split('## 40 bài')[0])
