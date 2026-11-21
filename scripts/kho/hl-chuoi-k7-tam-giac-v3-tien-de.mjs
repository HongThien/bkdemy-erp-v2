// Cập nhật cây Hình–Luyện K7 "Tam giác bằng nhau" theo BẢN CẬP NHẬT 21/11 (17:53) của `Documents\Mô hình 7.docx` — chỉ THÊM, không dựng lại:
//  · tiền đề file ghi rõ: MH.126 B3→B5.1, B3→B5.2, (B6.1,B6.2)→B7 · MH.130 B3→B5, B6→B7 · MH.131 B1→5.1–5.3, B2→5.4–5.6, B1→6.1, B2→6.2 · MH.132 B6→B8, (B7,B8)→B9
//  · MH.131: +3 nhánh giả thiết (E,F trung điểm AC,BD · AI=DJ trên AC,BD · MH⊥AC, MK⊥BD) và đổi nhãn 3 nhánh cũ thêm "(AB, CD)" cho khỏi lẫn
//   node scripts/kho/hl-chuoi-k7-tam-giac-v3-tien-de.mjs          ⇒ chạy thử rồi ROLLBACK
//   node scripts/kho/hl-chuoi-k7-tam-giac-v3-tien-de.mjs --ghi    ⇒ commit
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const T = String.raw
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const goc = async (ma) => (await q(`select id from hinh_mo_hinh where ma = $1 and khoi = '7' and phan = 'luyen' and la_mo_hinh`, [ma]))[0]?.id ?? (() => { throw new Error('không thấy ' + ma) })()
const con = async (cha, ten) => { const r = await q(`select m.id from hinh_mo_hinh m join hinh_mo_hinh_cha h on h.mo_hinh_id = m.id where h.cha_id = $1 and m.ten = $2`, [cha, ten]); if (r.length !== 1) throw new Error(`nhánh "${ten}" dưới ${cha}: ${r.length} kết quả`); return r[0].id }
const bais = async (nut) => (await q(`select id from hinh_baitoan where mo_hinh_id = $1 order by thu_tu, created_at`, [nut])).map((r) => r.id)
const tt = (s) => { if ((s.match(/\$/g) || []).length % 2) throw new Error('số $ lẻ: ' + s) }
let nTd = 0
// thêm tiền đề (giữ nguyên tiền đề + lời giải + hình cũ của bài) qua fn_hl_sua_bai — hàm có kiểm cùng cây
async function themTienDe(bai, ...them) {
  const b = (await q(`select b.phat_bieu, b.gia_thiet_rieng, b.anh_chuan from hinh_baitoan b where b.id = $1`, [bai]))[0]
  const cach = (await q(`select id, loi_giai from hinh_cach_giai where baitoan_id = $1 and la_mac_dinh`, [bai]))[0]
  const cu = cach ? (await q(`select tien_de_id from hinh_cach_tien_de where cach_id = $1`, [cach.id])).map((r) => r.tien_de_id) : []
  const moi = them.filter((x) => !cu.includes(x))
  if (!moi.length) return
  await q(`select fn_hl_sua_bai($1, $2, $3, $4, $5, $6::uuid[])`, [bai, b.phat_bieu, b.gia_thiet_rieng, cach?.loi_giai ?? null, b.anh_chuan, [...cu, ...moi]])
  nTd += moi.length
}
await c.query('begin')
try {
  // ── MH.126 ──
  { const R = await goc('MH.126'), rb = await bais(R), n2 = await con(R, 'Nhóm 2: điểm F')
    const k1 = await bais(await con(n2, 'Kiểu 1')), k2 = await bais(await con(n2, 'Kiểu 2')), m = await bais(await con(n2, 'M trung điểm FC'))
    if (rb.length !== 3 || k1.length !== 2 || k2.length !== 2 || m.length !== 1) throw new Error('MH.126: số bài không như đã dựng')
    await themTienDe(k1[0], rb[1]); await themTienDe(k2[0], rb[1])   // B3 (ADE cân) → B5.1, B5.2
    // (B6.1, B6.2) → B7 KHÔNG ghi: bài ngoài nhóm dựa vào bài của thành viên ⇒ ⚠ sai nhánh (spec §10.3) — chờ Thùy quyết
  }
  // ── MH.130 ──
  { const R = await goc('MH.130'), rb = await bais(R), f = await bais(await con(R, 'DE cắt AB tại F'))
    const fNut = await con(R, 'DE cắt AB tại F'), m = await bais(await con(fNut, 'M trung điểm FC'))
    if (rb.length !== 4 || f.length !== 2 || m.length !== 1) throw new Error('MH.130: số bài không như đã dựng')
    await themTienDe(f[0], rb[2]); await themTienDe(m[0], f[1])      // B3 → B5 · B6 → B7
  }
  // ── MH.131 ──
  { const R = await goc('MH.131'), rb = await bais(R)
    if (rb.length !== 4) throw new Error('MH.131: gốc không có 4 bài')
    for (const [cu, moi] of [['E, F trung điểm AB, CD', 'E, F trung điểm AB, CD'], ['AI = DJ', 'AI = DJ (trên AB, CD)'], ['MH ⊥ AB, MK ⊥ DC', 'MH ⊥ AB, MK ⊥ DC']]) {
      const id = await con(R, cu); const b = await bais(id); if (b.length !== 1) throw new Error('MH.131 nhánh ' + cu)
      await themTienDe(b[0], rb[0])                                  // B1 → B5.1–5.3
      if (cu !== moi) await q(`update hinh_mo_hinh set ten = $2 where id = $1`, [id, moi])
    }
    await q(`update hinh_mo_hinh set ten = 'E, F trung điểm AB, CD' where id = $1`, [await con(R, 'E, F trung điểm AB, CD')])
    const moi = [
      { ten: 'E, F trung điểm AC, BD', gt: T`Gọi $E, F$ lần lượt là trung điểm của $AC, BD$.`, pb: T`Chứng minh ba điểm $E, M, F$ thẳng hàng.` },
      { ten: 'AI = DJ (trên AC, BD)', gt: T`Gọi $I, J$ lần lượt là điểm trên $AC, BD$ sao cho $AI=DJ$.`, pb: T`Chứng minh ba điểm $I, M, J$ thẳng hàng.` },
      { ten: 'MH ⊥ AC, MK ⊥ BD', gt: T`Kẻ $MH\perp AC$, $MK\perp BD$ ($H\in AC$, $K\in BD$).`, pb: T`Chứng minh ba điểm $H, M, K$ thẳng hàng.` },
    ]
    for (const n of moi) {
      tt(n.gt); tt(n.pb)
      await q(`select fn_hl_them_gia_thiet($1, $2, $3, false)`, [R, n.ten, n.gt])
      const id = await con(R, n.ten)
      const r = (await q(`select fn_hl_them_bai($1, $2, null, null, null, $3::uuid[]) v`, [id, n.pb, [rb[1]]]))[0].v   // B2 → B5.4–5.6
      nTd++
    }
    const np = await con(R, 'N trung điểm AB, P đối xứng C qua N'), nl = await con(R, 'L trung điểm AC, Q đối xứng B qua L')
    await themTienDe((await bais(np))[0], rb[0])                      // B1 → B6.1
    await themTienDe((await bais(nl))[0], rb[1])                      // B2 → B6.2
  }
  // ── MH.132 ──
  { const R = await goc('MH.132')
    const nhanh = (await q(`select m.id from hinh_mo_hinh m join hinh_mo_hinh_cha h on h.mo_hinh_id = m.id where h.cha_id = $1 order by m.created_at`, [R])).map((r) => r.id)
    if (nhanh.length !== 3) throw new Error('MH.132: không có 3 nhánh')
    for (const n of nhanh) {
      const b = await bais(n), kc = await con(n, 'K trung điểm DE'), k = await bais(kc)
      if (b.length !== 7 || k.length !== 2) throw new Error('MH.132: số bài một nhánh không như đã dựng')
      await themTienDe(k[0], b[5])                                    // B6 → B8
      await themTienDe(k[1], b[6], k[0])                              // B7, B8 → B9
    }
  }
  const out = []
  for (const ma of ['MH.126', 'MH.130', 'MH.131', 'MH.132']) {
    const g = await goc(ma)
    const sai = await q(`select * from fn_hl_sai_nhanh($1)`, [g])
    if (sai.length) throw new Error(`${ma}: SAI NHÁNH ${JSON.stringify(sai)}`)
    const r = (await q(`with recursive t as (select $1::uuid id union all select c.mo_hinh_id from t join hinh_mo_hinh_cha c on c.cha_id = t.id)
      select (select count(*) from t) nut, (select count(*) from hinh_baitoan b where b.mo_hinh_id in (select id from t)) bai,
             (select count(*) from hinh_cach_tien_de x join hinh_cach_giai g on g.id = x.cach_id join hinh_baitoan b on b.id = g.baitoan_id where b.mo_hinh_id in (select id from t)) td`, [g]))[0]
    out.push(`${ma}: ${r.nut} nút · ${r.bai} bài · ${r.td} tiền đề · sai nhánh 0`)
  }
  console.log(out.join('\n') + `\n+${nTd} tiền đề/bài mới ghi lượt này`)
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message, e.detail || '', e.where || ''); process.exitCode = 1 }
await c.end()
