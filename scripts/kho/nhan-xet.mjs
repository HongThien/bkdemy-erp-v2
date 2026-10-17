// Nhận xét lúc duyệt — phía CLAUDE (Thùy 17/10). Quy trình: docs/quy-trinh-sua-theo-nhan-xet.md · mig 202610171123.
//
//   node scripts/kho/nhan-xet.mjs --ds [--ra <file.json>]      nhận xét ĐANG MỞ + nội dung đầy đủ của đối tượng (chỉ đọc)
//   node scripts/kho/nhan-xet.mjs --sua <goi.json> [--ghi]      áp bản sửa + ghi "đã sửa gì" trong CÙNG 1 transaction
//                                                               (mặc định chạy thử rồi ROLLBACK; --ghi mới commit)
//   node scripts/kho/nhan-xet.mjs --khong <id,id> "lý do" [--ghi]  không sửa (không đồng ý / thiếu dữ kiện) — người duyệt thấy lý do
//   node scripts/kho/nhan-xet.mjs --thong-ke                    lỗi lặp lại theo khâu × loại × môn (để rút luật vào kho-rules)
//
// goi.json:
//   { "nhan_xet": [12, 13], "ghi_chu": "Sửa bước 2: −3 → +3; đáp án 5 → 7",
//     "thay": [ { "doi_tuong": "cau", "mon": "toan", "ma": "T109…", "cot": { "loi_giai": "…", "dap_an": "7" } },
//               { "con": "hinh_y", "id": "<uuid>", "cot": { "loi_giai": "…" } } ] }
// Chỉ sửa được các cột trong bảng DT bên dưới. KHÔNG đụng da_duyet — người duyệt lại mới duyệt (luật 28/09: không tự làm–tự kiểm–tự ghi).
import pg from 'pg'
import fs from 'node:fs'

const BANG_CAU = { toan: 'dai_cau_hoi', hgt: 'hgt_cau_hoi', khtn: 'khtn_cau_hoi', anh: 'anh_cau_hoi', tsa: 'tsa_cau_hoi', hinh_hoc: 'hinh_hoc_cau_hoi' }
const TIEN_TO = { toan: 'dai', hgt: 'hgt', khtn: 'khtn', tsa: 'tsa', hinh_hoc: 'hinh_hoc' }
// Registry đối tượng ↔ bảng (một chỗ duy nhất). sua = cột được phép sửa.
const DT = {
  cau:            { bang: (m) => BANG_CAU[m], khoa: 'ma_cau', sua: ['noi_dung', 'lua_chon', 'menh_de', 'dap_an', 'loi_giai', 'dang_chinh', 'ma_cum', 'anh_de', 'anh_dap_an', 'loai_cau'] },
  form_tn:        { bang: (m) => TIEN_TO[m] && `${TIEN_TO[m]}_cau_form_tn`, khoa: 'id', sua: ['lua_chon', 'dap_an', 'key_gia_tri'] },
  form_dien:      { bang: () => 'hinh_form_dien', khoa: 'id', sua: ['loi_giai_bam', 'buoc', 'o'] },
  hinh_bai:       { bang: () => 'hinh_bai', khoa: 'id', sua: ['de_bai', 'anh_de', 'gia_thiet_chung', 'huong_dan'] },
  hinh_bien_the:  { bang: () => 'hinh_baitoan_bien_the', khoa: 'id', sua: ['de_bai', 'anh', 'loi_giai', 'anh_loi_giai'] },
  hinh_cach_giai: { bang: () => 'hinh_cach_giai', khoa: 'id', sua: ['loi_giai', 'anh_loi_giai'] },
  clone:          { bang: () => 'dai_cau_hoi_clone_cho_duyet', khoa: 'id', sua: ['noi_dung', 'lua_chon', 'dap_an', 'loi_giai', 'dang_chinh', 'loai_cau'] },
  de_thi:         { bang: () => 'tai_lieu', khoa: 'id', sua: [] },   // sửa CẢ ĐỀ = sửa các câu con (thay doi_tuong 'cau')
}
// Bảng CON (sửa từng dòng con; bump updated_at của cha — CLAUDE.md §2)
const CON = { hinh_y: { cha: 'hinh_bai', fk: 'bai_id', sua: ['noi_dung', 'dap_an', 'loi_giai', 'anh_loi_giai', 'anh_de', 'gia_thiet_them', 'nhan_hien_thi'] } }

const args = process.argv.slice(2)
const co = (k) => args.includes(k)
const sau = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined }
const GHI = co('--ghi')
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()

async function kieuCot(bang) {
  const r = await c.query(`select column_name, data_type from information_schema.columns where table_schema='public' and table_name=$1`, [bang])
  return Object.fromEntries(r.rows.map((x) => [x.column_name, x.data_type]))
}
const giaTri = (kieu, v) => (v !== null && typeof v === 'object' && (kieu === 'jsonb' || kieu === 'json') ? JSON.stringify(v) : v)

async function noiDung(doiTuong, mon, ma) {
  const d = DT[doiTuong]; const bang = d?.bang(mon)
  if (!bang) return { loi: `không biết bảng cho ${doiTuong}/${mon}` }
  const r = (await c.query(`select * from ${bang} where ${d.khoa}::text = $1`, [ma])).rows[0]
  if (!r) return { loi: `không thấy ${bang}.${d.khoa} = ${ma}` }
  const out = { bang, dong: r }
  if (doiTuong === 'hinh_bai') out.y = (await c.query(`select * from hinh_y where bai_id = $1 order by thu_tu`, [ma])).rows
  if (doiTuong === 'de_thi') {
    // câu của đề (cùng nguồn màn Kho đề thi) — sửa câu nào thì thay doi_tuong 'cau' với mon theo kho (dai → toan)
    out.cau = (await c.query(`select stt, phan_tieu_de, ma_cau, kho, loai_cau, dap_an from fn_de_thi_cau($1)`, [ma])).rows
  }
  return out
}

if (co('--ds')) {
  const r = await c.query(`
    select n.id, n.doi_tuong, n.mon, n.ma, n.khau, n.noi_dung, n.man, n.at, coalesce(ns.ho_ten,'') nguoi
      from kho_nhan_xet n left join nhan_su ns on ns.id = n.nguoi
     where not exists (select 1 from kho_nhan_xet_xu_ly x where x.nhan_xet_id = n.id)
     order by n.at`)
  const nhom = new Map()
  for (const n of r.rows) { const k = `${n.doi_tuong}|${n.mon}|${n.ma}`; if (!nhom.has(k)) nhom.set(k, []); nhom.get(k).push(n) }
  const ds = []
  for (const [k, nx] of nhom) { const [doi_tuong, mon, ma] = k.split('|'); ds.push({ doi_tuong, mon, ma, nhan_xet: nx, ...(await noiDung(doi_tuong, mon, ma)) }) }
  const ra = sau('--ra')
  if (ra) fs.writeFileSync(ra, JSON.stringify(ds, null, 1))
  console.log(`${r.rows.length} nhận xét đang mở · ${ds.length} đối tượng${ra ? ` ⇒ ${ra}` : ''}`)
  for (const d of ds) for (const n of d.nhan_xet) console.log(`  #${n.id} [${d.doi_tuong}/${d.mon} ${d.ma}] ${n.khau}: ${n.noi_dung.replace(/\s+/g, ' ').slice(0, 140)} — ${n.nguoi}${d.loi ? `  ⚠ ${d.loi}` : ''}`)
  if (!ra && ds.length) console.log('(thêm --ra <file.json> để lấy nội dung đầy đủ)')
} else if (co('--sua') || co('--khong')) {
  await c.query('begin')
  try {
    let ids, ghiChu, ketQua
    if (co('--sua')) {
      const goi = JSON.parse(fs.readFileSync(sau('--sua'), 'utf8'))
      ids = goi.nhan_xet; ghiChu = goi.ghi_chu; ketQua = 'da_sua'
      if (co('--thu')) {   // KIỂM script: tạo nhận xét tạm cho đối tượng đầu tiên trong gói, LUÔN rollback
        const t0 = goi.thay.find((x) => !x.con)
        ids = [(await c.query(`insert into kho_nhan_xet (doi_tuong, mon, ma, khau, noi_dung, man) values ($1,$2,$3,'khac','[thử script]','script') returning id`, [t0.doi_tuong, t0.mon, t0.ma])).rows[0].id]
      }
      if (!ids?.length || !ghiChu?.trim() || !goi.thay?.length) throw new Error('gói thiếu nhan_xet / ghi_chu / thay')
      for (const t of goi.thay) {
        let bang, khoa, ma, cho
        if (t.con) { const k = CON[t.con]; if (!k) throw new Error(`bảng con lạ ${t.con}`); bang = t.con; khoa = 'id'; ma = t.id; cho = k.sua }
        else { const d = DT[t.doi_tuong]; if (!d) throw new Error(`đối tượng lạ ${t.doi_tuong}`); bang = d.bang(t.mon); khoa = d.khoa; ma = t.ma; cho = d.sua }
        const cot = Object.keys(t.cot ?? {})
        const la = cot.filter((x) => !cho.includes(x)); if (la.length) throw new Error(`${bang}: không được sửa cột ${la.join(', ')}`)
        const kieu = await kieuCot(bang)
        const set = cot.map((x, i) => `${x} = $${i + 2}`)
        if (kieu.updated_at) set.push('updated_at = now()')
        const r = await c.query(`update ${bang} set ${set.join(', ')} where ${khoa}::text = $1`, [ma, ...cot.map((x) => giaTri(kieu[x], t.cot[x]))])
        if (r.rowCount !== 1) throw new Error(`${bang} ${ma}: cập nhật ${r.rowCount} dòng (phải đúng 1)`)
        if (t.con) await c.query(`update ${CON[t.con].cha} set updated_at = now() where id = (select ${CON[t.con].fk} from ${bang} where id::text = $1)`, [ma])
        console.log(`  ✎ ${bang} ${ma}: ${cot.join(', ')}`)
      }
    } else {
      ids = sau('--khong').split(',').map(Number); ghiChu = args[args.indexOf('--khong') + 2]; ketQua = 'khong_sua'
      if (!ghiChu?.trim()) throw new Error('--khong cần lý do')
    }
    const mo = (await c.query(`select id from kho_nhan_xet n where id = any($1) and not exists (select 1 from kho_nhan_xet_xu_ly x where x.nhan_xet_id = n.id)`, [ids])).rows.map((x) => +x.id)
    const thua = ids.filter((x) => !mo.includes(+x)); if (thua.length) throw new Error(`nhận xét không mở / không có: ${thua.join(', ')}`)
    await c.query(`insert into kho_nhan_xet_xu_ly (nhan_xet_id, ket_qua, ghi_chu, boi, nguoi) select unnest($1::bigint[]), $2, $3, 'claude', null`, [ids, ketQua, ghiChu.trim()])
    console.log(`  ↳ ${ids.length} nhận xét ⇒ ${ketQua}: ${ghiChu.trim()}`)
    if (co('--thu')) {
      const t = (await c.query(`select n.doi_tuong, n.mon, n.ma from kho_nhan_xet n where n.id = $1`, [ids[0]])).rows[0]
      const tt = (await c.query(`select trang_thai from _kho_nhan_xet_trang_thai($1, $2) where ma = $3`, [t.doi_tuong, t.mon, t.ma])).rows[0]
      console.log(`  [thử] trạng thái sau khi xử lý: ${tt?.trang_thai}`)
    }
    await c.query(GHI && !co('--thu') ? 'commit' : 'rollback')
    console.log(GHI && !co('--thu') ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử — thêm --ghi để ghi)')
  } catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
} else if (co('--thong-ke')) {
  const r = await c.query(`select doi_tuong, mon, khau, count(*) n, max(at) moi_nhat from kho_nhan_xet group by 1,2,3 order by n desc`)
  console.table(r.rows)
} else {
  console.log('Dùng: --ds [--ra f.json] | --sua <goi.json> [--ghi] | --khong <id,id> "lý do" [--ghi] | --thong-ke')
}
await c.end()
