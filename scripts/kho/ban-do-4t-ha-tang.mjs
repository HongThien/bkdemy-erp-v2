// ============================================================================
// ban-do-4t-ha-tang.mjs — HẠ BẢN ĐỒ MỚI KHỐI 4T XUỐNG 1 TẦNG (Thùy 24/10):
//   chủ đề → CHUYÊN ĐỀ · chuyên đề → NHÓM BÀI · nhóm bài → DẠNG BÀI, rồi dựng 6 chủ đề mới ở trên cùng.
//
//   node scripts/kho/ban-do-4t-ha-tang.mjs            (mặc định = XEM: chạy trong 1 transaction rồi ROLLBACK, ghi HTML + sao lưu, DB không đổi)
//   node scripts/kho/ban-do-4t-ha-tang.mjs --ghi      (COMMIT — chỉ chạy sau khi Thùy gật danh sách xoá, CLAUDE.md "Luật xoá")
//
// Khác `fn_bdm_ha_nhom` (hạ 1 nhóm vào nhóm khác): ở đây hạ CẢ CÂY. Mỗi cấp là một BẢNG riêng nên "hạ" = tạo hàng mới ở bảng dưới
// (mã mới NCH/NNB/NDB), chép tên + mô tả + lý thuyết, trỏ lại các tham chiếu, rồi xoá hàng cũ ở bảng trên (đúng cách `fn_bdm_ha_nhom` làm).
// Bảng đổi mã cũ → mới ghi ra `kho-rules/dai/ban-do-4t-ha-tang-doi-ma.json`; sao lưu trước khi đổi ở `…-truoc.json`.
// Dừng (throw) nếu có BẤT KỲ câu/đề xuất/duyệt nào đang trỏ vào cây 4T — hiện đo được 0 (08/10 → 24/10: gan 0 · đề xuất 0).
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const GHI = process.argv.includes('--ghi')
const env = Object.fromEntries(readFileSync(join(GOC, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))

// 6 chủ đề MỚI (Thùy 24/10) ← chủ đề CŨ nào thành chuyên đề của nó, theo đúng thứ tự Thùy viết.
// «Quan hệ đại lượng trong phép toán» (NCD00120) Thùy chưa nhắc ⇒ hỏi lại: đặt vào Số tự nhiên, sau Tính toán.
const MOI = [
  { ten: 'Số tự nhiên', cu: ['NCD00112', 'NCD00113', 'NCD00114', 'NCD00115', 'NCD00120'] },
  { ten: 'Hình học', cu: ['NCD00116'] },
  { ten: 'Các bài toán Logic', cu: ['NCD00117', 'NCD00118', 'NCD00125', 'NCD00126', 'NCD00134'] },
  { ten: 'Cấu tạo số', cu: ['NCD00121', 'NCD00122', 'NCD00123'] },
  { ten: 'Các bài toán lời văn', cu: ['NCD00119', 'NCD00124', 'NCD00133'] },
  { ten: 'Phân số', cu: ['NCD00127', 'NCD00128', 'NCD00129', 'NCD00130', 'NCD00131', 'NCD00132'] },
]
const TAT_CA_CU = MOI.flatMap((m) => m.cu)

const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
const q = async (s, p) => (await db.query(s, p)).rows
const one = async (s, p) => (await q(s, p))[0]

/** Cây 4T hiện tại: chủ đề → chuyên đề → nhóm → dạng (đọc trong CÙNG transaction). */
async function cay() {
  const cd = await q(`select id, ten, thu_tu from dai_bdm_chu_de where khoi = '4T' order by thu_tu, id`)
  const o = await q(`select o.chu_de_id, o.chuyen_de_id, o.thu_tu, ch.ten, ch.mo_ta from dai_bdm_o o join dai_bdm_chuyen_de ch on ch.id = o.chuyen_de_id where o.chu_de_id = any($1) order by o.thu_tu, o.chuyen_de_id`, [cd.map((x) => x.id)])
  const nh = await q(`select id, chu_de_id, chuyen_de_id, ten, mo_ta, thu_tu, (btrim(ly_thuyet) <> '') co_lt from dai_bdm_nhom where chu_de_id = any($1) order by thu_tu, id`, [cd.map((x) => x.id)])
  const db_ = await q(`select d.id, d.nhom_id, d.ten, d.thu_tu, (btrim(d.ly_thuyet) <> '') co_lt from dai_bdm_dang_bai d where d.nhom_id = any($1) order by d.thu_tu, d.id`, [nh.map((x) => x.id)])
  return cd.map((c) => ({ ...c, chuyen_de: o.filter((x) => x.chu_de_id === c.id).map((x) => ({ ...x, nhom: nh.filter((n) => n.chu_de_id === c.id && n.chuyen_de_id === x.chuyen_de_id).map((n) => ({ ...n, dang: db_.filter((d) => d.nhom_id === n.id) })) })) }))
}
const dem = (c) => ({ chu_de: c.length, chuyen_de: c.reduce((s, x) => s + x.chuyen_de.length, 0), nhom: c.reduce((s, x) => s + x.chuyen_de.reduce((t, y) => t + y.nhom.length, 0), 0), dang: c.reduce((s, x) => s + x.chuyen_de.reduce((t, y) => t + y.nhom.reduce((u, z) => u + z.dang.length, 0), 0), 0) })

try {
  await db.query('begin')
  await db.query(`lock table dai_bdm_chu_de, dai_bdm_o, dai_bdm_chuyen_de, dai_bdm_nhom, dai_bdm_dang_bai, dai_bdm_doi_ung in share row exclusive mode`)

  // ── 0 · điều kiện trước ───────────────────────────────────────────────────────────────────────
  const truoc = await cay(), nTruoc = dem(truoc)
  const idCu = truoc.map((c) => c.id).sort(), mong = [...TAT_CA_CU].sort()
  if (JSON.stringify(idCu) !== JSON.stringify(mong)) throw new Error(`Cây 4T đã khác lúc lập kế hoạch (có người sửa?): có ${idCu.join(',')} — cần ${mong.join(',')}. Dừng, không đụng gì.`)
  const nhomCu = truoc.flatMap((c) => c.chuyen_de.flatMap((h) => h.nhom)), dangCu = nhomCu.flatMap((n) => n.dang)
  const idsNhom = nhomCu.map((n) => n.id), idsDang = dangCu.map((d) => d.id), idsCd = truoc.map((c) => c.id)
  const chan = await one(`select
      (select count(*)::int from dai_bdm_gan_cau where dang_bai_id = any($2)) gan_cau,
      (select count(*)::int from dai_bdm_de_xuat where dang_bai_id = any($2)) de_xuat,
      (select count(*)::int from dai_bdm_kiem_mau where dang_bai_ai_id = any($2)) kiem_mau,
      (select count(*)::int from dai_bdm_tu_choi where dang_bai_ai_id = any($2)) tu_choi,
      (select count(*)::int from dai_cau_lop where dang_bai_id = any($2)) cau_lop,
      (select count(*)::int from dai_bdm_nhom_tien_de where nhom_id = any($1) or tien_de_nhom_id = any($1)) tien_de,
      (select count(*)::int from dai_bdm_kho_ds where chu_de_id = any($3)) kho_ds,
      (select count(*)::int from dai_bdm_duyet_pham_vi where chu_de_id = any($3)) duyet_pham_vi,
      (select count(*)::int from dai_bdm_cau_chua_khop where chu_de_id = any($3)) chua_khop,
      (select count(*)::int from dai_bdm_cau_thieu_dang where chu_de_id = any($3)) thieu_dang,
      (select count(*)::int from hinh_mo_hinh where chu_de_id = any($3)) mo_hinh,
      (select count(*)::int from hinh_hoc_bai where chu_de_id = any($3)) hoc_bai,
      (select count(*)::int from hinh_nhom_mo_hinh where chu_de_id = any($3)) nhom_mo_hinh,
      (select count(*)::int from dai_bdm_doi_ung where dich_chu_de = any($3)) doi_ung_o,
      (select count(*)::int from dai_bdm_doi_ung where dich_dang_bai = any($2)) doi_ung_dang`, [idsNhom, idsDang, idsCd])
  // doi_ung_cum (cụm cũ → dạng bài) KHÔNG chặn: 11 dạng bài cũ được GIỮ NGUYÊN mã, chỉ đổi nhóm cha ⇒ hàng đối ứng đi theo; kiểm lại ở bước 3.
  const nCum = (await one(`select count(*)::int n from dai_bdm_doi_ung_cum where dang_bai_id = any($1)`, [idsDang])).n
  const vuong = Object.entries(chan).filter(([, v]) => v > 0)
  if (vuong.length) throw new Error(`Có dữ liệu đang trỏ vào cây 4T: ${vuong.map(([k, v]) => `${k}=${v}`).join(', ')} — hạ tầng sẽ làm lệch. Dừng, không đụng gì.`)
  const nDoiUng = (await one(`select count(*)::int n from dai_bdm_doi_ung where dich_nhom = any($1)`, [idsNhom])).n
  const dungChung = await q(`select chuyen_de_id, count(*)::int n from dai_bdm_o where chuyen_de_id = any($1) group by 1 having count(*) > 1`, [truoc.flatMap((c) => c.chuyen_de.map((h) => h.chuyen_de_id))])
  if (dungChung.length) throw new Error(`Chuyên đề dùng chung nhiều ô: ${dungChung.map((x) => x.chuyen_de_id).join(', ')} — chưa hỗ trợ. Dừng.`)

  const sao = {}
  for (const [ten, sql, p] of [['chu_de', `select * from dai_bdm_chu_de where id = any($1)`, [idsCd]], ['o', `select * from dai_bdm_o where chu_de_id = any($1)`, [idsCd]],
    ['chuyen_de', `select * from dai_bdm_chuyen_de where id in (select chuyen_de_id from dai_bdm_o where chu_de_id = any($1))`, [idsCd]], ['nhom', `select * from dai_bdm_nhom where id = any($1)`, [idsNhom]],
    ['dang_bai', `select * from dai_bdm_dang_bai where id = any($1)`, [idsDang]], ['doi_ung', `select * from dai_bdm_doi_ung where dich_nhom = any($1)`, [idsNhom]]]) sao[ten] = await q(sql, p)

  // ── 1 · dựng cây mới ──────────────────────────────────────────────────────────────────────────
  const doiMa = { chu_de_moi: [], chuyen_de: [], nhom: [], dang: [], dang_con_chuyen: [] }
  for (const [i, m] of MOI.entries()) {
    const P = (await one(`insert into dai_bdm_chu_de (khoi, ten, thu_tu, nhanh) values ('4T', $1, $2, 'toan') returning id`, [m.ten, i + 1])).id
    doiMa.chu_de_moi.push({ id: P, ten: m.ten })
    for (const [k, idC] of m.cu.entries()) {
      const C = truoc.find((c) => c.id === idC)
      const X = (await one(`insert into dai_bdm_chuyen_de (ten, mo_ta) values ($1, '') returning id`, [C.ten])).id            // chủ đề cũ → CHUYÊN ĐỀ
      await db.query(`insert into dai_bdm_o (chu_de_id, chuyen_de_id, thu_tu) values ($1, $2, $3)`, [P, X, k + 1])
      doiMa.chuyen_de.push({ cu: C.id, moi: X, ten: C.ten, chu_de_moi: P })
      for (const H of C.chuyen_de) {
        const N2 = (await one(`insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, thu_tu) values ($1, $2, $3, $4, $5) returning id`, [P, X, H.ten, H.mo_ta ?? '', H.thu_tu])).id  // chuyên đề cũ → NHÓM
        doiMa.nhom.push({ cu: H.chuyen_de_id, moi: N2, ten: H.ten })
        let tt = 0
        for (const N of H.nhom) {                                                                                            // nhóm cũ → DẠNG BÀI (chép tên · mô tả · lý thuyết · tệp)
          const D2 = (await one(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, thu_tu)
                                 select $1, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, $3 from dai_bdm_nhom where id = $2 returning id`, [N2, N.id, ++tt])).id
          doiMa.dang.push({ cu_nhom: N.id, moi: D2, ten: N.ten })
          for (const d of N.dang) {                                                                                          // dạng bài cũ (nằm dưới nhóm) → ngồi sau dạng vừa tạo, giữ thứ tự (như fn_bdm_ha_nhom)
            await db.query(`update dai_bdm_dang_bai set nhom_id = $1, thu_tu = $2 where id = $3`, [N2, ++tt, d.id])
            doiMa.dang_con_chuyen.push({ id: d.id, ten: d.ten, tu_nhom_cu: N.id, sang_nhom_moi: N2 })
          }
          await db.query(`update dai_bdm_doi_ung set dich_nhom = null, dich_dang_bai = $1 where dich_nhom = $2`, [D2, N.id])    // đối ứng dạng cũ (dai_ban_do) → dạng bài mới
        }
      }
    }
  }

  // ── 2 · xoá hàng CŨ đã thay thế (lá → gốc) ────────────────────────────────────────────────────
  const xoa = {}
  xoa.nhom = (await db.query(`delete from dai_bdm_nhom where id = any($1)`, [idsNhom])).rowCount
  xoa.o = (await db.query(`delete from dai_bdm_o where chu_de_id = any($1)`, [idsCd])).rowCount
  const chCu = truoc.flatMap((c) => c.chuyen_de.map((h) => h.chuyen_de_id))
  xoa.chuyen_de = (await db.query(`delete from dai_bdm_chuyen_de where id = any($1)`, [chCu])).rowCount
  xoa.chu_de = (await db.query(`delete from dai_bdm_chu_de where id = any($1)`, [idsCd])).rowCount

  // ── 3 · kiểm sau ─────────────────────────────────────────────────────────────────────────────
  const sau = await cay(), nSau = dem(sau)
  const loi = []
  if (nSau.chu_de !== 6) loi.push(`chủ đề = ${nSau.chu_de}, cần 6`)
  if (nSau.chuyen_de !== nTruoc.chu_de) loi.push(`chuyên đề mới = ${nSau.chuyen_de}, cần ${nTruoc.chu_de} (= số chủ đề cũ)`)
  if (nSau.nhom !== nTruoc.chuyen_de) loi.push(`nhóm mới = ${nSau.nhom}, cần ${nTruoc.chuyen_de} (= số chuyên đề cũ)`)
  if (nSau.dang !== nTruoc.nhom + nTruoc.dang) loi.push(`dạng mới = ${nSau.dang}, cần ${nTruoc.nhom + nTruoc.dang} (= nhóm cũ + dạng cũ)`)
  const ltTruoc = nhomCu.filter((n) => n.co_lt).length + dangCu.filter((d) => d.co_lt).length
  const ltSau = sau.flatMap((c) => c.chuyen_de.flatMap((h) => h.nhom.flatMap((n) => n.dang))).filter((d) => d.co_lt).length
  if (ltSau !== ltTruoc) loi.push(`số mục có lý thuyết: trước ${ltTruoc}, sau ${ltSau}`)
  const doiUngSau = (await one(`select count(*)::int n from dai_bdm_doi_ung where dich_dang_bai in (select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = any($1))`, [doiMa.chu_de_moi.map((x) => x.id)])).n
  if (doiUngSau !== nDoiUng) loi.push(`đối ứng dạng cũ: trước ${nDoiUng}, sau (trỏ vào dạng bài mới) ${doiUngSau}`)
  const cumSau = (await one(`select count(*)::int n from dai_bdm_doi_ung_cum where dang_bai_id = any($1)`, [idsDang])).n
  if (cumSau !== nCum) loi.push(`đối ứng cụm cũ → dạng bài: trước ${nCum}, sau ${cumSau}`)
  const mo = await one(`select count(*)::int n from dai_bdm_doi_ung where dich_nhom = any($1)`, [idsNhom]); if (mo.n) loi.push(`còn ${mo.n} đối ứng trỏ vào nhóm cũ`)
  const toiTen = (c) => c.flatMap((x) => x.chuyen_de.map((h) => h.ten)).sort().join('|')
  if (toiTen(sau) !== truoc.map((c) => c.ten).sort().join('|')) loi.push('tên chuyên đề mới ≠ tên chủ đề cũ')
  if (loi.length) throw new Error('KIỂM SAU KHÔNG ĐẠT — rollback:\n  ' + loi.join('\n  '))

  // ── 4 · ra tệp ───────────────────────────────────────────────────────────────────────────────
  const thuMuc = join(GOC, 'kho-rules', 'dai', 'ban-do'); mkdirSync(thuMuc, { recursive: true })
  writeFileSync(join(thuMuc, '4T-ha-tang-truoc.json'), JSON.stringify({ ngay: '2026-10-24', ghi_chu: 'Sao lưu cây bản đồ mới 4T TRƯỚC khi hạ 1 tầng', ...sao }, null, 1))
  writeFileSync(join(thuMuc, '4T-ha-tang-doi-ma.json'), JSON.stringify({ ngay: '2026-10-24', ghi: GHI, truoc: nTruoc, sau: nSau, xoa, doi_ma: doiMa }, null, 1))
  writeFileSync(join(GOC, 'reports', '_ban-do-4t-ha-tang.json'), JSON.stringify({ truoc, sau, nTruoc, nSau, xoa, nDoiUng, ltTruoc, doiMa }))   // nguồn dựng HTML
  console.log(GHI ? '■ GHI THẬT' : '□ XEM (sẽ ROLLBACK)', '· trước', JSON.stringify(nTruoc), '→ sau', JSON.stringify(nSau))
  console.log('  xoá hàng cũ:', JSON.stringify(xoa), '· đối ứng dạng cũ giữ lại:', doiUngSau, '· mục có lý thuyết giữ:', ltSau, '· dạng bài con dời:', doiMa.dang_con_chuyen.length)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('✘', e.message); process.exitCode = 1 } finally { await db.end() }
