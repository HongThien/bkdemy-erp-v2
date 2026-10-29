// Chuyển bản đồ KHTN cũ (khtn_ban_do: chủ đề → chuyên đề → dạng → cụm) sang bản đồ mới khtn_bdm_* (mig 202610291707).
// Thùy 29/10: chủ đề→chủ đề · chuyên đề→chuyên đề · DẠNG→NHÓM BÀI · CỤM→DẠNG BÀI; câu không cụm = "chưa phân" trong nhóm (không
// có dòng gán, §1.5); dạng chờ …000000 không vào bản đồ (câu của nó = chưa khớp). Lý thuyết dạng cũ → lý thuyết nhóm.
//   node scripts/kho/khtn-bdm-chuyen.mjs         → chạy thử (ROLLBACK) + báo cáo đếm
//   node scripts/kho/khtn-bdm-chuyen.mjs --ghi   → ghi thật (chỉ khi mọi phép đếm khớp)
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const one = async (s, a) => Object.values((await q(s, a))[0])[0]
const GHI = process.argv.includes('--ghi')
const CHO = `b.ma_dang like '%000000'`
let loi = []
const kiem = (ten, a, b) => { const ok = String(a) === String(b); console.log(`  ${ok ? '✔' : '✘'} ${ten}: ${a}${ok ? '' : ' ≠ ' + b}`); if (!ok) loi.push(ten) }
try {
  await q('begin')
  if (Number(await one(`select count(*) from khtn_bdm_chu_de`))) throw new Error('khtn_bdm_chu_de đã có dữ liệu — không chạy lại đè.')
  // 1) chủ đề
  await q(`insert into khtn_bdm_chu_de (khoi, ten, thu_tu, ma_cu)
           select khoi, ten_chu_de, row_number() over (partition by khoi order by ma_chu_de), ma_chu_de
             from (select distinct b.khoi, b.ma_chu_de, b.ten_chu_de from khtn_ban_do b where not ${CHO}) x`)
  // 2) chuyên đề + ô
  await q(`insert into khtn_bdm_chuyen_de (ten, ma_cu)
           select distinct on (b.ma_chuyen_de) b.ten_chuyen_de, b.ma_chuyen_de from khtn_ban_do b where not ${CHO} order by b.ma_chuyen_de`)
  await q(`insert into khtn_bdm_o (chu_de_id, chuyen_de_id, thu_tu)
           select cd.id, ch.id, row_number() over (partition by cd.id order by ch.ma_cu)
             from (select distinct b.ma_chu_de, b.ma_chuyen_de from khtn_ban_do b where not ${CHO}) x
             join khtn_bdm_chu_de cd on cd.ma_cu = x.ma_chu_de join khtn_bdm_chuyen_de ch on ch.ma_cu = x.ma_chuyen_de`)
  // 3) nhóm bài = dạng cũ (+ lý thuyết dạng cũ)
  await q(`insert into khtn_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, thu_tu, ma_cu)
           select cd.id, ch.id, b.ten_dang, coalesce(b.mo_ta_ngan, ''), coalesce(l.noi_dung, ''), l.file_url, l.ten_file,
                  row_number() over (partition by cd.id, ch.id order by b.ma_dang), b.ma_dang
             from khtn_ban_do b
             join khtn_bdm_chu_de cd on cd.ma_cu = b.ma_chu_de join khtn_bdm_chuyen_de ch on ch.ma_cu = b.ma_chuyen_de
             left join khtn_dang_ly_thuyet l on l.ma_dang = b.ma_dang
            where not ${CHO}`)
  // 4) dạng bài = cụm cũ (độ khó / bậc kế thừa dạng cũ)
  await q(`insert into khtn_bdm_dang_bai (nhom_id, ten, mo_ta, thu_tu, muc_do, bac_toi_thieu, ma_cu)
           select n.id, k.ten, coalesce(k.ghi_chu, ''), row_number() over (partition by n.id order by k.thu_tu, k.ma_cum), b.muc_do, b.bac_toi_thieu, k.ma_cum
             from khtn_cum_bai k join khtn_ban_do b on b.ma_dang = k.ma_dang join khtn_bdm_nhom n on n.ma_cu = k.ma_dang`)
  // 5) tiền đề dạng ↔ dạng = nhóm ↔ nhóm
  await q(`insert into khtn_bdm_nhom_tien_de (nhom_id, tien_de_nhom_id)
           select a.id, b.id from khtn_dang_tien_de t join khtn_bdm_nhom a on a.ma_cu = t.ma_dang join khtn_bdm_nhom b on b.ma_cu = t.tien_de_ma_dang`)
  // 6) câu có cụm ⇒ gán dạng bài (nguồn 'cum')
  await q(`insert into khtn_bdm_gan_cau (ma_cau, dang_bai_id, nguon, actor)
           select q.ma_cau, d.id, 'cum', null from khtn_cau_hoi q join khtn_bdm_dang_bai d on d.ma_cu = q.ma_cum`)

  console.log('ĐẾM (bản đồ cũ ⇄ bản đồ mới):')
  kiem('chủ đề', await one(`select count(*) from khtn_bdm_chu_de`), await one(`select count(distinct b.ma_chu_de) from khtn_ban_do b where not ${CHO}`))
  kiem('chuyên đề', await one(`select count(*) from khtn_bdm_chuyen_de`), await one(`select count(distinct b.ma_chuyen_de) from khtn_ban_do b where not ${CHO}`))
  kiem('ô chủ đề × chuyên đề', await one(`select count(*) from khtn_bdm_o`), await one(`select count(distinct b.ma_chuyen_de) from khtn_ban_do b where not ${CHO}`))
  kiem('nhóm bài = dạng cũ', await one(`select count(*) from khtn_bdm_nhom`), await one(`select count(*) from khtn_ban_do b where not ${CHO}`))
  kiem('dạng bài = cụm cũ', await one(`select count(*) from khtn_bdm_dang_bai`), await one(`select count(*) from khtn_cum_bai`))
  kiem('lý thuyết nhóm = lý thuyết dạng cũ', await one(`select count(*) from khtn_bdm_nhom where btrim(ly_thuyet) <> '' or ly_thuyet_file_url is not null`),
    await one(`select count(*) from khtn_dang_ly_thuyet l join khtn_ban_do b on b.ma_dang = l.ma_dang where not ${CHO} and (btrim(l.noi_dung) <> '' or l.file_url is not null)`))
  kiem('câu có cụm ⇒ có gán', await one(`select count(*) from khtn_bdm_gan_cau`), await one(`select count(*) from khtn_cau_hoi where ma_cum is not null`))
  kiem('gán đúng nhóm của câu (dạng cũ của câu = nhóm của dạng bài)', await one(`select count(*) from khtn_bdm_gan_cau g join khtn_cau_hoi q on q.ma_cau = g.ma_cau
      join khtn_bdm_dang_bai d on d.id = g.dang_bai_id join khtn_bdm_nhom n on n.id = d.nhom_id where n.ma_cu = q.dang_chinh`), await one(`select count(*) from khtn_bdm_gan_cau`))
  kiem('tên 4 tầng giữ nguyên', await one(`select count(*) from khtn_bdm_dang_bai d join khtn_cum_bai k on k.ma_cum = d.ma_cu join khtn_bdm_nhom n on n.id = d.nhom_id
      join khtn_ban_do b on b.ma_dang = n.ma_cu join khtn_bdm_chuyen_de ch on ch.id = n.chuyen_de_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id
      where d.ten = k.ten and n.ten = b.ten_dang and ch.ten = b.ten_chuyen_de and cd.ten = b.ten_chu_de`), await one(`select count(*) from khtn_bdm_dang_bai`))
  const live = await q(`select count(*) filter (where g.ma_cau is not null)::int gan,
        count(*) filter (where g.ma_cau is null and n.id is not null)::int chua_phan,
        count(*) filter (where n.id is null)::int chua_khop, count(*)::int tong
      from khtn_cau_hoi q left join khtn_bdm_gan_cau g on g.ma_cau = q.ma_cau left join khtn_bdm_nhom n on n.ma_cu = q.dang_chinh where q.xoa_at is null`)
  console.log('CÂU CÒN SỐNG:', live[0])
  kiem('câu còn sống: gán + chưa phân + chưa khớp = tổng', live[0].gan + live[0].chua_phan + live[0].chua_khop, live[0].tong)
  console.table(await q(`select cd.khoi, count(distinct cd.id) chu_de, count(distinct n.chuyen_de_id) chuyen_de, count(distinct n.id) nhom, count(distinct d.id) dang_bai
      from khtn_bdm_chu_de cd join khtn_bdm_nhom n on n.chu_de_id = cd.id left join khtn_bdm_dang_bai d on d.nhom_id = n.id group by 1 order by 1`))
  const log = await one(`select count(*) from khtn_bdm_log`)
  console.log('dòng lịch sử ghi được:', log)
  if (loi.length) throw new Error('Đếm lệch: ' + loi.join(', ') + ' — KHÔNG ghi.')
  await q(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử) — thêm --ghi để ghi')
} catch (e) { await q('rollback'); console.log('✘', e.message); process.exitCode = 1 } finally { await c.end() }
