// HÀNG ĐỢI CLONE CÂU ĐÃ ĐẶT HÀNG — worker cho Claude Code (LUỒNG 2; luồng 1 = hangdoi-giai.mjs).
// Thùy 08/09: "Claude Code có 2 luồng: (1) giải các bài không có đáp án trong kho, (2) clone các bài đã
// được đặt hàng trong kho." Bảng hàng đợi có từ mig 202608261700 nhưng tới 08/09 CHƯA có worker nào đọc.
//
// Luồng: nhân sự bấm "✨ Clone → đưa vào hàng đợi" ở ERP (Kho › dạng › câu có sẵn) → dòng vào
// `dai_cau_hoi_yeu_cau_clone` (xu_ly_at NULL = treo; ma_cau_goc + so_bien_the + ghi_chu). Claude Code
// (quota subscription, KHÔNG API trả phí) chạy script này theo lệnh hoặc qua scheduler:
//   1) node scripts/hangdoi-clone.mjs --list [--out file.json]
//        → JSON mọi yêu cầu treo: câu gốc đầy đủ (đề/lựa chọn/đáp án/lời giải), tên dạng, ghi chú người đặt,
//          ≤2 MẪU cùng dạng đã duyệt (để giữ phong cách), cờ `co_hinh` / `goc_da_xoa` / `so_da_co` (nháp đã
//          sinh cho yêu cầu này). Claude ĐỌC spec-clone-ai.md rồi TỰ SINH biến thể trong chat.
//   2) Claude viết file kết quả: [ { yeu_cau_id, variants: [ { noi_dung, lua_chon?, dap_an, loi_giai } ] } ]
//        (LaTeX $…$ như kho; lua_chon = mảng 4 chuỗi khi gốc là trắc nghiệm; dap_an = chữ cái A–D khi trắc nghiệm).
//   3) node scripts/hangdoi-clone.mjs --ghi ket_qua.json
//        → mỗi yêu cầu 1 transaction: INSERT các biến thể vào bảng NHÁP `dai_cau_hoi_clone_cho_duyet`
//          (clone_method='claude_code_batch', parent_ma_cau = câu gốc, yeu_cau_id) + đóng yêu cầu (xu_ly_at).
//          KHÔNG đụng dai_cau_hoi thật — người duyệt ở ERP (Bản đồ kiến thức › Đại › "Câu chờ duyệt") mới
//          promote vào kho. Yêu cầu đã đóng trong lúc chờ → bỏ qua, không ghi.
//   4) node scripts/hangdoi-clone.mjs --don   → đóng yêu cầu mà câu gốc đã bị xoá mềm (xoa_at) — treo vô nghĩa.
//      node scripts/hangdoi-clone.mjs --bo <yeu_cau_id> [lý do]  → đóng 1 yêu cầu KHÔNG ghi gì (câu gốc có
//      hình, đề sai, không sinh được số đẹp…) — lý do nối vào ghi_chu để người đặt thấy vì sao.
//      node scripts/hangdoi-clone.mjs --tu-kiem  → tự kiểm --ghi trong 1 transaction rồi ROLLBACK (0 ghi thật).
//
// Luật cứng ở CODE (không tin mỗi prompt):
//   · Câu gốc có ảnh đề (anh_de) → TỪ CHỐI ghi (HANDOFF: "dạng có hình KHÔNG clone-đổi-số" — hình lệch số).
//   · Câu gốc loại dung_sai / có menh_de → từ chối (bảng nháp không có cột menh_de — clone sẽ mất mệnh đề).
//   · Biến thể thiếu noi_dung/loi_giai → bỏ; trắc nghiệm mà lua_chon ≠ 4 phương án hoặc dap_an ∉ A–D → bỏ.
//   · Không ghi quá so_bien_the; ít hơn thì vẫn ghi + cảnh báo. Không ghi trùng đề gốc / trùng nhau.
//   · Mọi phép đếm/ghi = SQL; script không tính nghiệp vụ gì ngoài kiểm định dạng.
// Kết nối: DATABASE_URL trong .env (cùng cách các script khác trong scripts/).
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const args = process.argv.slice(2)
const flag = (f) => args.includes(f)
const after = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined }
const CLONE_METHOD = 'claude_code_batch'

const c = new pg.Client({ connectionString: envf(join(root, '.env')).DATABASE_URL, connectionTimeoutMillis: 20000 })
await c.connect()

// Bỏ nhãn "Câu N"/"Bài N" đầu đề (chép từ stripCauLabel trong src/lib/kho/api.ts — hệ thống tự đánh số).
const stripCauLabel = (s) => { const t = s.replace(/^[\s*]*(?:câu|bài)\s*\d+\s*[.:)\-]?\s*/i, ''); return t.trim() ? t : s }
const norm = (s) => (typeof s === 'string' ? s.replace(/\r\n/g, '\n').trim() : '')

// ── Đọc 1 yêu cầu treo kèm câu gốc (dùng cho cả --list lẫn --ghi để 2 đường nhìn CÙNG dữ liệu) ──
const SQL_YEU_CAU = `
  select y.id yeu_cau_id, y.ma_cau_goc, y.so_bien_the, y.ghi_chu, y.created_at, y.xu_ly_at,
         ns.ho_ten nguoi_yeu_cau,
         g.dang_chinh, bd.ten_dang, bd.ten_chuyen_de, bd.khoi, g.loai_cau, g.ma_cum,
         g.noi_dung, g.lua_chon, g.menh_de, g.dap_an, g.loi_giai, g.anh_de, g.anh_dap_an,
         (g.anh_de is not null) co_hinh,
         (g.xoa_at is not null) goc_da_xoa,
         (select count(*)::int from dai_cau_hoi_clone_cho_duyet d where d.yeu_cau_id = y.id) so_da_co
  from dai_cau_hoi_yeu_cau_clone y
  join dai_cau_hoi g on g.ma_cau = y.ma_cau_goc
  left join dai_ban_do bd on bd.ma_dang = g.dang_chinh
  left join nhan_su ns on ns.id = y.nguoi_yeu_cau`

async function yeuCauTreo() {
  return (await c.query(`${SQL_YEU_CAU} where y.xu_ly_at is null order by y.created_at`)).rows
}
async function mauThamKhao(r) {
  const { rows } = await c.query(
    `select ma_cau, noi_dung, lua_chon, dap_an, loi_giai from dai_cau_hoi
     where da_duyet and loi_giai is not null and xoa_at is null and anh_de is null and ma_cau <> $1 and dang_chinh = $3
     order by (ma_cum is not null and ma_cum = $2) desc, created_at limit 2`,
    [r.ma_cau_goc, r.ma_cum, r.dang_chinh])
  return rows
}

// Kiểm 1 biến thể theo câu gốc. Trả { ok, row } hoặc { ok:false, ly_do }.
function kiemBienThe(v, goc) {
  const noi_dung = stripCauLabel(norm(v?.noi_dung ?? v?.de_bai))
  const loi_giai = norm(v?.loi_giai)
  const dap_an = norm(v?.dap_an) || null
  if (!noi_dung) return { ok: false, ly_do: 'thiếu noi_dung' }
  if (!loi_giai) return { ok: false, ly_do: 'thiếu loi_giai (clone phải kèm lời giải)' }
  if (noi_dung === norm(goc.noi_dung)) return { ok: false, ly_do: 'trùng đề gốc' }
  const gocTN = Array.isArray(goc.lua_chon) && goc.lua_chon.length > 0
  let lua_chon = null
  if (gocTN) {
    if (!Array.isArray(v?.lua_chon) || v.lua_chon.length !== 4 || v.lua_chon.some((x) => !norm(x))) return { ok: false, ly_do: 'trắc nghiệm cần đúng 4 lua_chon' }
    lua_chon = v.lua_chon.map((x) => norm(x).replace(/^[A-D]\s*[.):]\s*/i, ''))
    if (!/^[A-D]$/i.test(dap_an ?? '')) return { ok: false, ly_do: 'dap_an trắc nghiệm phải là A/B/C/D' }
    return { ok: true, row: { noi_dung, lua_chon, dap_an: dap_an.toUpperCase(), loi_giai } }
  }
  if (goc.dap_an && !dap_an) return { ok: false, ly_do: 'thiếu dap_an (gốc có đáp án)' }
  return { ok: true, row: { noi_dung, lua_chon: null, dap_an, loi_giai } }
}

// Ghi 1 mục kết quả trong transaction ĐANG MỞ (caller begin/commit — để --tu-kiem rollback được).
async function ghiMot(it, log) {
  if (!it?.yeu_cau_id || !Array.isArray(it.variants)) { log(`bỏ qua (thiếu yeu_cau_id/variants): ${JSON.stringify(it).slice(0, 100)}`); return { ghi: 0, bo: 1 } }
  const r = (await c.query(`${SQL_YEU_CAU} where y.id = $1 for update of y`, [it.yeu_cau_id])).rows[0]
  if (!r) { log(`${it.yeu_cau_id}: không có yêu cầu này (đã bị xoá / sai id) — bỏ qua.`); return { ghi: 0, bo: 1 } }
  if (r.xu_ly_at) { log(`${it.yeu_cau_id} (${r.ma_cau_goc}): yêu cầu ĐÃ đóng trong lúc chờ — KHÔNG ghi.`); return { ghi: 0, bo: 1 } }
  if (r.goc_da_xoa) { await dongYeuCau(r.yeu_cau_id, 'câu gốc đã xoá'); log(`${r.ma_cau_goc}: câu gốc đã xoá — đóng yêu cầu, không ghi.`); return { ghi: 0, bo: 1 } }
  if (r.co_hinh) { log(`${r.ma_cau_goc}: câu gốc CÓ HÌNH — không clone đổi số (hình lệch số). Dùng --bo kèm lý do.`); return { ghi: 0, bo: 1 } }
  if (r.loai_cau === 'dung_sai' || r.menh_de) { log(`${r.ma_cau_goc}: câu đúng/sai có mệnh đề — bảng nháp không chứa được, dùng --bo.`); return { ghi: 0, bo: 1 } }

  const rows = []; const seen = new Set()
  for (const v of it.variants) {
    const k = kiemBienThe(v, r)
    if (!k.ok) { log(`${r.ma_cau_goc}: bỏ 1 biến thể — ${k.ly_do}`); continue }
    if (seen.has(k.row.noi_dung)) { log(`${r.ma_cau_goc}: bỏ 1 biến thể — trùng biến thể khác`); continue }
    seen.add(k.row.noi_dung); rows.push(k.row)
  }
  const gioiHan = Math.max(0, r.so_bien_the - r.so_da_co)
  if (rows.length > gioiHan) { log(`${r.ma_cau_goc}: sinh ${rows.length} > cần ${gioiHan} — chỉ ghi ${gioiHan} đầu.`); rows.length = gioiHan }
  if (!rows.length) { log(`${r.ma_cau_goc}: không có biến thể hợp lệ — yêu cầu VẪN treo (sinh lại hoặc --bo).`); return { ghi: 0, bo: 1 } }
  if (rows.length < gioiHan) log(`⚠ ${r.ma_cau_goc}: chỉ ${rows.length}/${gioiHan} biến thể — vẫn ghi, đóng yêu cầu.`)

  for (const v of rows) {
    await c.query(
      `insert into dai_cau_hoi_clone_cho_duyet (yeu_cau_id, dang_chinh, loai_cau, noi_dung, lua_chon, dap_an, loi_giai, parent_ma_cau, clone_method)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [r.yeu_cau_id, r.dang_chinh, r.loai_cau, v.noi_dung, v.lua_chon ? JSON.stringify(v.lua_chon) : null, v.dap_an, v.loi_giai, r.ma_cau_goc, CLONE_METHOD])
  }
  await dongYeuCau(r.yeu_cau_id)
  return { ghi: rows.length, bo: 0 }
}
async function dongYeuCau(id, lyDo) {
  await c.query(
    `update dai_cau_hoi_yeu_cau_clone set xu_ly_at = now(),
       ghi_chu = case when $2::text is null then ghi_chu else concat_ws(' | ', ghi_chu, 'Claude bỏ: ' || $2) end
     where id = $1 and xu_ly_at is null`, [id, lyDo ?? null])
}

try {
  if (flag('--list')) {
    const out = []
    for (const r of await yeuCauTreo()) {
      const { xu_ly_at, ma_cum, ...rest } = r
      out.push({ ...rest, mau_tham_khao: r.co_hinh || r.goc_da_xoa ? [] : await mauThamKhao(r) })
    }
    const txt = JSON.stringify(out, null, 2)
    const o = after('--out')
    if (o) { writeFileSync(o, txt, 'utf8'); console.log(`${out.length} yêu cầu clone treo → ${o}`) } else console.log(txt)
    const coHinh = out.filter((x) => x.co_hinh).length, daXoa = out.filter((x) => x.goc_da_xoa).length
    if (coHinh) console.error(`⚠ ${coHinh} yêu cầu mà câu gốc CÓ HÌNH — không clone đổi số, đóng bằng --bo <id> "câu gốc có hình".`)
    if (daXoa) console.error(`⚠ ${daXoa} yêu cầu mà câu gốc đã xoá — chạy --don để đóng.`)
  } else if (flag('--ghi')) {
    const f = after('--ghi'); if (!f) throw new Error('--ghi <file.json>')
    const items = JSON.parse(readFileSync(f, 'utf8'))
    let ghi = 0, bo = 0
    for (const it of items) {
      await c.query('begin')
      try { const k = await ghiMot(it, (m) => console.error(m)); ghi += k.ghi; bo += k.bo; await c.query('commit') }
      catch (e) { await c.query('rollback'); throw e }
    }
    console.log(`Đã ghi ${ghi} biến thể vào bảng nháp (duyệt ở ERP › Bản đồ kiến thức › Đại › "Câu chờ duyệt") · ${bo} mục không ghi.`)
  } else if (flag('--don')) {
    const r = await c.query(
      `update dai_cau_hoi_yeu_cau_clone y set xu_ly_at = now(), ghi_chu = concat_ws(' | ', y.ghi_chu, 'Claude bỏ: câu gốc đã xoá')
       from dai_cau_hoi g where g.ma_cau = y.ma_cau_goc and y.xu_ly_at is null and g.xoa_at is not null`)
    console.log(`Đã đóng ${r.rowCount} yêu cầu mà câu gốc đã xoá.`)
  } else if (flag('--bo')) {
    const [id, ...ly] = args.slice(args.indexOf('--bo') + 1)
    if (!id) throw new Error('--bo <yeu_cau_id> [lý do]')
    await c.query('begin')
    const r = await c.query('select id from dai_cau_hoi_yeu_cau_clone where id = $1 and xu_ly_at is null for update', [id])
    if (!r.rowCount) { await c.query('rollback'); throw new Error(`${id}: không có yêu cầu treo với id này`) }
    await dongYeuCau(id, ly.join(' ') || 'không sinh được biến thể đạt')
    await c.query('commit')
    console.log(`Đã đóng yêu cầu ${id} (không ghi gì).`)
  } else if (flag('--tu-kiem')) {
    // Tự kiểm toàn bộ đường --ghi trong 1 transaction rồi ROLLBACK: tạo yêu cầu giả trên 1 câu thật, ghi 2
    // biến thể hợp lệ + 2 biến thể lỗi, kiểm số dòng nháp + trạng thái yêu cầu, rồi huỷ hết. 0 ghi thật.
    await c.query('begin')
    try {
      const goc = (await c.query(`select ma_cau, noi_dung, dap_an from dai_cau_hoi where xoa_at is null and anh_de is null and lua_chon is null and loai_cau <> 'dung_sai' and dap_an is not null and loi_giai is not null order by ma_cau limit 1`)).rows[0]
      if (!goc) throw new Error('không tìm được câu gốc để thử')
      const y = (await c.query(`insert into dai_cau_hoi_yeu_cau_clone (ma_cau_goc, so_bien_the, ghi_chu) values ($1, 2, 'TỰ KIỂM — sẽ rollback') returning id`, [goc.ma_cau])).rows[0]
      const truoc = (await c.query('select count(*)::int n from dai_cau_hoi_clone_cho_duyet')).rows[0].n
      const logs = []
      const k = await ghiMot({ yeu_cau_id: y.id, variants: [
        { noi_dung: 'Câu 5. Thử biến thể 1: $\\dfrac{1}{2}$', dap_an: '1', loi_giai: 'Lời giải 1' },
        { noi_dung: goc.noi_dung, dap_an: '1', loi_giai: 'trùng gốc → phải bị bỏ' },
        { noi_dung: 'Thử biến thể thiếu lời giải', dap_an: '1' },
        { noi_dung: 'Thử biến thể 2', dap_an: '2', loi_giai: 'Lời giải 2' },
        { noi_dung: 'Thử biến thể 3 (vượt so_bien_the)', dap_an: '3', loi_giai: 'Lời giải 3' },
      ] }, (m) => logs.push(m))
      const sau = (await c.query('select count(*)::int n, bool_and(clone_method = $1 and parent_ma_cau = $2 and yeu_cau_id = $3) dung, bool_and(noi_dung not like $4) bo_nhan from dai_cau_hoi_clone_cho_duyet where yeu_cau_id = $3', [CLONE_METHOD, goc.ma_cau, y.id, 'Câu %'])).rows[0]
      const yc = (await c.query('select xu_ly_at is not null dong from dai_cau_hoi_yeu_cau_clone where id = $1', [y.id])).rows[0]
      const lai = await ghiMot({ yeu_cau_id: y.id, variants: [{ noi_dung: 'ghi lại sau khi đóng', dap_an: '1', loi_giai: 'x' }] }, (m) => logs.push(m))
      const tong = (await c.query('select count(*)::int n from dai_cau_hoi_clone_cho_duyet')).rows[0].n
      const ok = k.ghi === 2 && sau.n === 2 && sau.dung && sau.bo_nhan && yc.dong && lai.ghi === 0 && tong === truoc + 2
      console.log(ok ? '✅ TỰ KIỂM ĐẠT' : '❌ TỰ KIỂM KHÔNG ĐẠT', JSON.stringify({ ghi: k.ghi, nhap: sau.n, dung_cot: sau.dung, bo_nhan_cau: sau.bo_nhan, yeu_cau_dong: yc.dong, ghi_lai_bi_chan: lai.ghi === 0 }))
      for (const m of logs) console.log('   ·', m)
      if (!ok) process.exitCode = 1
    } finally { await c.query('rollback'); console.log('(đã rollback — không ghi gì thật)') }
  } else {
    console.log('Dùng: --list [--out f.json] | --ghi f.json | --don | --bo <yeu_cau_id> [lý do] | --tu-kiem')
  }
} finally { await c.end() }
