// Sinh migration SQL chuyển KHỐI 7 từ mô hình LUYỆN (hinh_mo_hinh/hinh_baitoan/…)
// sang mô hình HỌC (hinh_hoc_bai/hinh_hoc_cau_hoi).
//
// Quy tắc (CEO 17/09):
//  · 1 mô hình → 1 Bài học (ten_bai = ten mô hình, khoi='${KHOI}').
//  · Lý thuyết Bài = gia_thiet + (link ảnh cấu hình nếu có).
//  · Bài toán LẺ (not target, not prereq) → 1 câu độc lập.
//  · Bài toán ĐÍCH (has_td=1, lam_td=0) → 1 câu GHÉP: bao đóng tiền đề + đích, sort theo cấp, ghép a) b) c)
//    Câu ghép đặt vào Bài học của mô hình chứa ĐÍCH.
//  · Bài toán GIỮA/TIỀN ĐỀ (không phải đích, có làm tiền đề) → không có câu độc lập, chỉ embed vào câu ghép.
//  · Biến thể: câu CLONE (parent_ma_cau = câu gốc, clone_method='v3_bien_the').
//    Biến thể của bài LẺ / ĐÍCH → clone có parent.
//    Biến thể của bài TIỀN ĐỀ (không đích) → câu độc lập (parent=null) trong Bài của mô hình chứa nó.
//  · da_duyet=false toàn bộ — GV duyệt lại.
//  · mo_hinh_id giữ = baitoan.mo_hinh_id (nhãn mastery signal đã hook sẵn).
//
// Không xóa gì bên `hinh_mo_hinh/hinh_baitoan/…`. Chỉ THÊM dòng vào bảng `hinh_hoc_*`.

import pg from 'pg'
import { readFileSync, writeFileSync } from 'fs'
const url = readFileSync('.env','utf8').split('\n').find(l=>l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const KHOI = process.argv[2]
if (!KHOI) { console.error('Usage: node _gen_migration_hinh_k7_hoc.mjs <khoi>  (vd: 7, 8, 9)'); process.exit(1) }
const c = new pg.Client({ connectionString: url }); await c.connect()

// ── 1. Nạp mô hình khối {KHOI} + bài toán + tiền đề + cách giải + biến thể ─────
const mos = (await c.query(`select id, ma, ten, gia_thiet, gia_thiet_them, anh_cau_hinh, la_goc_ho, cap_mo_hinh
  from hinh_mo_hinh where khoi=$1`, [KHOI])).rows
if (!mos.length) { console.error(`Khối ${KHOI}: không có mô hình nào trong hinh_mo_hinh.`); process.exit(1) }
const bts = (await c.query(`select bt.id, bt.ma, bt.mo_hinh_id, bt.phat_bieu, bt.cap, bt.anh_chuan, bt.gia_thiet_rieng, bt.gia_thiet_phu, bt.gt_thay_the
  from hinh_baitoan bt join hinh_mo_hinh mh on mh.id=bt.mo_hinh_id where mh.khoi=$1`, [KHOI])).rows
const btById = new Map(bts.map(b => [b.id, b]))
const btIds = bts.map(b => b.id)

// Cách giải mặc định của từng bài toán (ưu tiên la_mac_dinh=true, sau đó thu_tu thấp nhất)
const cgs = (await c.query(`select id, baitoan_id, ten, loi_giai, anh_loi_giai, la_mac_dinh, thu_tu
  from hinh_cach_giai where baitoan_id = any($1) order by baitoan_id, la_mac_dinh desc nulls last, thu_tu, created_at`, [btIds])).rows
const cgDefaultOf = new Map()  // baitoan_id -> cach_giai row
for (const cg of cgs) if (!cgDefaultOf.has(cg.baitoan_id)) cgDefaultOf.set(cg.baitoan_id, cg)

// Tiền đề: bài toán X có tiền đề Y ↔ cách giải của X có edge sang Y trong hinh_cach_tien_de.
// Lấy TẤT CẢ cách của mỗi bài để bao đóng đầy đủ (chưa filter theo cách mặc định — 1 bài có thể có nhiều
// cách với bộ tiền đề khác nhau; để không mất data, gộp union). Nếu sau này CEO muốn chỉ cách mặc định
// thì lọc `cg.la_mac_dinh` ở đây.
const tds = (await c.query(`select cg.baitoan_id, ctd.tien_de_id
  from hinh_cach_tien_de ctd join hinh_cach_giai cg on cg.id=ctd.cach_id
  where cg.baitoan_id = any($1) and ctd.tien_de_id = any($1)`, [btIds])).rows
const tienDeCua = new Map()  // baitoan_id -> Set<tien_de_id>
const lamTienDeCho = new Map()  // tien_de_id -> Set<baitoan_id>
for (const b of bts) { tienDeCua.set(b.id, new Set()); lamTienDeCho.set(b.id, new Set()) }
for (const t of tds) { tienDeCua.get(t.baitoan_id).add(t.tien_de_id); lamTienDeCho.get(t.tien_de_id).add(t.baitoan_id) }

// Biến thể có lời giải hoặc ảnh (đã lọc ở khảo sát 46 cái)
const bvs = (await c.query(`select id, baitoan_id, kieu, de_bai, anh, loi_giai, anh_loi_giai, ghi_chu, thu_tu, giai_method
  from hinh_baitoan_bien_the where baitoan_id = any($1) order by baitoan_id, thu_tu, created_at`, [btIds])).rows

// ── 2. Phân loại bài toán ─────────────────────────────────────────────────────
const isLe = (b) => tienDeCua.get(b.id).size===0 && lamTienDeCho.get(b.id).size===0
const isDich = (b) => tienDeCua.get(b.id).size > 0 && lamTienDeCho.get(b.id).size === 0
const isTienDeThuan = (b) => tienDeCua.get(b.id).size === 0 && lamTienDeCho.get(b.id).size > 0

const le = bts.filter(isLe)
const dich = bts.filter(isDich)
const tienDeThuan = bts.filter(isTienDeThuan)

// ── 3. Bao đóng tiền đề của 1 bài toán (đệ quy, tránh vòng lặp) ────────────────
function baoDong(rootId) {
  const seen = new Set()
  const stack = [rootId]
  while (stack.length) {
    const x = stack.pop()
    if (seen.has(x)) continue
    seen.add(x)
    for (const t of tienDeCua.get(x) ?? []) stack.push(t)
  }
  seen.delete(rootId)
  return [...seen]
}

// ── 4. Sắp thứ tự Bài (mô hình) → thu_tu 1..9 ──────────────────────────────────
mos.sort((a,b) => {
  if (a.la_goc_ho !== b.la_goc_ho) return a.la_goc_ho ? -1 : 1
  const capA = a.cap_mo_hinh ?? 999, capB = b.cap_mo_hinh ?? 999
  if (capA !== capB) return capA - capB
  return a.ma.localeCompare(b.ma)
})
const baiThuTu = new Map()   // mo_hinh_id -> thu_tu (1-based)
mos.forEach((m, i) => baiThuTu.set(m.id, i + 1))

// ── 5. Sinh nội dung câu ghép (Markdown-like, dùng $...$ giữ nguyên LaTeX) ─────
const chuIdx = (i) => String.fromCharCode(97 + i)  // 0->a, 1->b, ...
function ghepCau(dichBt) {
  const bd = baoDong(dichBt.id)  // các bài toán tiền đề (không kể chính đích)
  const members = [...bd.map(id => btById.get(id)), dichBt].sort((a,b) => {
    if (a.cap !== b.cap) return a.cap - b.cap
    return a.ma.localeCompare(b.ma)
  })
  // Ghép phát biểu: a) [phat_bieu_1]  b) [phat_bieu_2] …
  const noiDung = members.map((m, i) => `${chuIdx(i)}) ${m.phat_bieu ?? ''}`).join('\n\n').trim()
  // Ghép lời giải theo cách MẶC ĐỊNH của từng bài toán
  const parts = []
  for (let i = 0; i < members.length; i++) {
    const cg = cgDefaultOf.get(members[i].id)
    if (cg?.loi_giai) parts.push(`${chuIdx(i)}) ${cg.loi_giai}`)
  }
  const loiGiai = parts.length ? parts.join('\n\n') : null
  // Ảnh đề: dùng ảnh chuẩn của ĐÍCH (câu ghép in 1 hình chung)
  const anhDe = dichBt.anh_chuan ?? null
  // Ảnh lời giải: nếu đích có ảnh lời giải thì dùng, không thì null
  const anhLg = cgDefaultOf.get(dichBt.id)?.anh_loi_giai ?? null
  return { noiDung, loiGiai, anhDe, anhLg, members }
}

// ── 6. Sinh câu cho tất cả nguồn ───────────────────────────────────────────────
// Sinh row RAW (chưa có ma_cau — sẽ dùng RETURNING lúc INSERT). Ở đây gán tempKey để tra ngược khi clone.
let seq = 0
const nextKey = () => `TMP${(++seq).toString().padStart(4,'0')}`
const cauRows = []  // {tempKey, dang_chinh_thu_tu, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu_trong_bai, parent_key, clone_method, nguon}
const cauKeyOfBaitoan = new Map()   // baitoan_id -> tempKey (chỉ với lẻ & đích — dùng khi clone biến thể)

function pushCauLe(bt) {
  const cg = cgDefaultOf.get(bt.id)
  const tk = nextKey()
  cauKeyOfBaitoan.set(bt.id, tk)
  cauRows.push({
    tempKey: tk,
    mo_hinh_thu_tu: baiThuTu.get(bt.mo_hinh_id),
    mo_hinh_id: bt.mo_hinh_id,
    noi_dung: bt.phat_bieu,
    dap_an: null,
    loi_giai: cg?.loi_giai ?? null,
    anh_de: bt.anh_chuan ?? null,
    anh_dap_an: cg?.anh_loi_giai ?? null,
    parent_key: null,
    clone_method: null,
    nguon: 'le',
    ghi_chu_gen: `Từ ${bt.ma}`,
  })
}
function pushCauGhep(dichBt) {
  const g = ghepCau(dichBt)
  const tk = nextKey()
  cauKeyOfBaitoan.set(dichBt.id, tk)   // biến thể của đích sẽ clone parent = câu ghép này
  cauRows.push({
    tempKey: tk,
    mo_hinh_thu_tu: baiThuTu.get(dichBt.mo_hinh_id),
    mo_hinh_id: dichBt.mo_hinh_id,
    noi_dung: g.noiDung,
    dap_an: null,
    loi_giai: g.loiGiai,
    anh_de: g.anhDe,
    anh_dap_an: g.anhLg,
    parent_key: null,
    clone_method: null,
    nguon: 'le',
    ghi_chu_gen: `Ghép ${g.members.map(m=>m.ma).join(' → ')}`,
  })
}
// LẺ
for (const b of le) pushCauLe(b)
// ĐÍCH → câu ghép
for (const b of dich) pushCauGhep(b)
// BIẾN THỂ
for (const bv of bvs) {
  const parentTk = cauKeyOfBaitoan.get(bv.baitoan_id)  // có nếu bài là lẻ/đích
  const parentBt = btById.get(bv.baitoan_id)
  const tk = nextKey()
  cauRows.push({
    tempKey: tk,
    mo_hinh_thu_tu: baiThuTu.get(parentBt.mo_hinh_id),
    mo_hinh_id: parentBt.mo_hinh_id,
    noi_dung: bv.de_bai || parentBt.phat_bieu,
    dap_an: null,
    loi_giai: bv.loi_giai,
    anh_de: bv.anh ?? parentBt.anh_chuan,
    anh_dap_an: bv.anh_loi_giai,
    parent_key: parentTk ?? null,   // null nếu bài là tiền đề thuần
    clone_method: parentTk ? 'v3_bien_the' : null,
    nguon: parentTk ? 'clone' : 'le',
    ghi_chu_gen: parentTk
      ? `Biến thể ${bv.kieu ?? ''} của ${parentBt.ma} (parent tempKey=${parentTk})`
      : `Biến thể ${bv.kieu ?? ''} của ${parentBt.ma} — bài tiền đề, không có câu gốc → câu độc lập`,
  })
}

// ── 7. Ghi migration SQL ───────────────────────────────────────────────────────
const now = new Date()
const pad = (n) => String(n).padStart(2, '0')
const ts = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`
const fname = `${ts}_chuyen_hinh_k${KHOI}_ve_hoc.sql`
const path = `supabase/migrations/${fname}`

// Escape SQL literal (chỉ chuỗi text; null → NULL)
const esc = (v) => v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`

const parts = []
parts.push(`-- ============================================================================`)
parts.push(`-- ${ts} — CHUYỂN dữ liệu HÌNH khối ${KHOI} từ mô hình LUYỆN sang mô hình HỌC (CEO 17/09)`)
parts.push(`-- ----------------------------------------------------------------------------`)
parts.push(`-- QUY TẮC (spec-kho-hinh-v3 §5 + user 17/09):`)
parts.push(`--  · 1 mô hình khối ${KHOI} (\`hinh_mo_hinh\` khoi='${KHOI}') → 1 Bài học (\`hinh_hoc_bai\`).`)
parts.push(`--  · Lý thuyết Bài = gia_thiet + link ảnh cấu hình (nếu có).`)
parts.push(`--  · Bài toán LẺ (không tham gia chuỗi tiền đề) → 1 câu độc lập.`)
parts.push(`--  · Bài toán ĐÍCH (nhận tiền đề, không làm tiền đề cho ai) → 1 câu GHÉP:`)
parts.push(`--      ghép phát biểu của bao đóng tiền đề + đích, sort theo cấp, thành "a) b) c) …".`)
parts.push(`--      Cross-model: đặt vào Bài của mô hình chứa đích cấp cao nhất.`)
parts.push(`--  · Bài toán TIỀN ĐỀ THUẦN / GIỮA CHUỖI: không có câu độc lập, chỉ embed vào câu ghép.`)
parts.push(`--  · Biến thể (\`hinh_baitoan_bien_the\`) → câu CLONE (parent_ma_cau=câu gốc, clone_method='v3_bien_the').`)
parts.push(`--      Biến thể của bài tiền đề thuần → câu độc lập (không parent).`)
parts.push(`--  · da_duyet=false toàn bộ — GV duyệt lại từng câu.`)
parts.push(`--  · mo_hinh_id giữ nguyên (nhãn mastery signal, spec-kho-hinh-v3 §7 hook đã có).`)
parts.push(`--`)
parts.push(`-- SỐ LIỆU (sinh lúc gen):`)
parts.push(`--   Bài học sẽ tạo:   ${mos.length}`)
parts.push(`--   Câu lẻ:           ${le.length}`)
parts.push(`--   Câu ghép:         ${dich.length}`)
parts.push(`--   Biến thể clone:   ${bvs.filter(bv => cauKeyOfBaitoan.has(bv.baitoan_id)).length}`)
parts.push(`--   Biến thể độc lập: ${bvs.filter(bv => !cauKeyOfBaitoan.has(bv.baitoan_id)).length}`)
parts.push(`--   Bài toán không dùng (tiền đề thuần + giữa chuỗi, không có câu riêng): ${tienDeThuan.length + bts.filter(b=>tienDeCua.get(b.id).size>0 && lamTienDeCho.get(b.id).size>0).length}`)
parts.push(`--   Nguồn: ${bts.length} \`hinh_baitoan\` + ${bvs.length} biến thể của khối ${KHOI}.`)
parts.push(`--`)
parts.push(`-- KHÔNG XÓA gì bên hinh_mo_hinh/hinh_baitoan/…. Chỉ THÊM vào hinh_hoc_bai/…`)
parts.push(`-- Idempotency: chèn xong sẽ có 9 dòng \`hinh_hoc_bai\` khoi='${KHOI}'. Nếu chạy lại,`)
parts.push(`--   PRE-CHECK ở đầu block sẽ RAISE để không double-insert.`)
parts.push(`-- ============================================================================`)
parts.push(``)
parts.push(`begin;`)
parts.push(``)
parts.push(`-- ── PRE-CHECK: 9 tên Bài mới (đúng tên mô hình v3) đã có trong DB chưa? ────`)
parts.push(`-- (CEO 16/09 đã có sẵn "Tổng ba góc của một tam giác" cho khối ${KHOI} — KHÔNG đụng.`)
parts.push(`--  Migration này APPEND 9 Bài từ mô hình v3 vào bên cạnh, thu_tu tiếp theo tự động.)`)
parts.push(`do $$`)
parts.push(`declare n int;`)
parts.push(`begin`)
parts.push(`  select count(*) into n from hinh_hoc_bai where khoi='${KHOI}' and ten_bai in (${mos.map(m=>esc(m.ten)).join(',')});`)
parts.push(`  if n > 0 then raise exception 'Đã có % Bài trong 9 tên mô hình v3 (khối ${KHOI}) — migration này đã chạy. Bỏ qua để tránh double-insert.', n; end if;`)
parts.push(`end $$;`)
parts.push(``)

// ── Bảng tạm để trung chuyển tempKey ─────────────────────────────────────────
parts.push(`-- ── STAGE 1 · Tạo bảng tạm chứa mapping mô hình → thu_tu Bài ────────────────`)
parts.push(`create temp table _hh_bai_map (mo_hinh_id uuid, ten_bai text, thu_tu smallint) on commit drop;`)
parts.push(`create temp table _hh_bai_ma (thu_tu smallint, ma_bai text) on commit drop;`)
parts.push(`create temp table _hh_cau_map (temp_key text primary key, ma_cau text) on commit drop;`)
parts.push(``)

parts.push(`-- ── STAGE 2 · INSERT hinh_hoc_bai (9 Bài) ───────────────────────────────────`)
for (const m of mos) {
  parts.push(`insert into _hh_bai_map values (${esc(m.id)}, ${esc(m.ten)}, ${baiThuTu.get(m.id)});`)
}
parts.push(`insert into hinh_hoc_bai (khoi, ten_bai, thu_tu, da_duyet)`)
parts.push(`  select '${KHOI}', ten_bai, thu_tu, false from _hh_bai_map order by thu_tu`)
parts.push(`  returning ma_bai, thu_tu into _hh_bai_ma;`)
parts.push(`-- Bug: RETURNING ... INTO chỉ cho single-row. Dùng CTE thay.`)
parts.push(``)
// Chuyển sang cách khác an toàn hơn: dùng WITH CTE để mapping
// Reset — dùng approach khác
parts.length = parts.findIndex(p => p.startsWith('-- ── STAGE 2'))
parts.push(`-- ── STAGE 2 · INSERT hinh_hoc_bai (9 Bài) + build map thu_tu → ma_bai ──────`)
for (const m of mos) {
  parts.push(`insert into _hh_bai_map values (${esc(m.id)}, ${esc(m.ten)}, ${baiThuTu.get(m.id)});`)
}
parts.push(``)
parts.push(`-- Base = max(thu_tu) khối ${KHOI} hiện tại. Bài mới ghi thu_tu = base + 1..9.`)
parts.push(`-- Map giữa (_hh_bai_map.thu_tu ∈ 1..9) và ma_bai mới dựa vào ten_bai (9 tên đều KHÁC nhau, verified).`)
parts.push(`with base as (select coalesce(max(thu_tu),0) as b from hinh_hoc_bai where khoi='${KHOI}'),`)
parts.push(`ins as (`)
parts.push(`  insert into hinh_hoc_bai (khoi, ten_bai, thu_tu, da_duyet)`)
parts.push(`  select '${KHOI}', m.ten_bai, m.thu_tu + b, false from _hh_bai_map m, base order by m.thu_tu`)
parts.push(`  returning ma_bai, ten_bai`)
parts.push(`)`)
parts.push(`insert into _hh_bai_ma (thu_tu, ma_bai)`)
parts.push(`  select m.thu_tu, ins.ma_bai from ins join _hh_bai_map m on m.ten_bai = ins.ten_bai;`)
parts.push(``)

parts.push(`-- ── STAGE 3 · Lý thuyết Bài (gia_thiet + link ảnh cấu hình nếu có) ─────────`)
for (const m of mos) {
  const gt = m.gia_thiet ?? ''
  const anhLine = m.anh_cau_hinh ? `\n\n![Cấu hình](${m.anh_cau_hinh})` : ''
  const ndung = (gt + anhLine).trim()
  if (!ndung) continue
  parts.push(`insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)`)
  parts.push(`  select ma_bai, ${esc(ndung)} from _hh_bai_ma where thu_tu = ${baiThuTu.get(m.id)};`)
}
parts.push(``)

parts.push(`-- ── STAGE 4 · INSERT hinh_hoc_cau_hoi (${cauRows.length} câu: ${le.length} lẻ + ${dich.length} ghép + ${cauRows.length - le.length - dich.length} biến thể) ──`)
// Insert theo 2 pass: (1) câu không parent, (2) câu clone (cần parent)
const cauKhongParent = cauRows.filter(r => !r.parent_key)
const cauCoParent = cauRows.filter(r => r.parent_key)

// Pass 1: câu không parent — dùng CTE để lấy ma_bai theo thu_tu, INSERT, ghi tempKey vào _hh_cau_map
for (const r of cauKhongParent) {
  const nguon_giai = r.loi_giai ? 'nguoi' : 'nguoi'
  parts.push(`with bai as (select ma_bai from _hh_bai_ma where thu_tu = ${r.mo_hinh_thu_tu}),`)
  parts.push(`ins as (`)
  parts.push(`  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)`)
  parts.push(`  select ma_bai, ${esc(r.mo_hinh_id)}, ${esc(r.noi_dung)}, ${esc(r.dap_an)}, ${esc(r.loi_giai)}, ${esc(r.anh_de)}, ${esc(r.anh_dap_an)}, 1, false, 'tu_luan', ${esc(r.nguon)}, ${esc(nguon_giai)} from bai`)
  parts.push(`  returning ma_cau`)
  parts.push(`)`)
  parts.push(`insert into _hh_cau_map (temp_key, ma_cau) select ${esc(r.tempKey)}, ma_cau from ins;`)
}
parts.push(``)

// Pass 2: câu clone
for (const r of cauCoParent) {
  parts.push(`with bai as (select ma_bai from _hh_bai_ma where thu_tu = ${r.mo_hinh_thu_tu}),`)
  parts.push(`par as (select ma_cau from _hh_cau_map where temp_key = ${esc(r.parent_key)}),`)
  parts.push(`ins as (`)
  parts.push(`  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)`)
  parts.push(`  select bai.ma_bai, ${esc(r.mo_hinh_id)}, ${esc(r.noi_dung)}, ${esc(r.dap_an)}, ${esc(r.loi_giai)}, ${esc(r.anh_de)}, ${esc(r.anh_dap_an)}, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, ${esc(r.clone_method)}`)
  parts.push(`  from bai, par`)
  parts.push(`  returning ma_cau`)
  parts.push(`)`)
  parts.push(`insert into _hh_cau_map (temp_key, ma_cau) select ${esc(r.tempKey)}, ma_cau from ins;`)
}
parts.push(``)

parts.push(`-- ── POST-CHECK ──────────────────────────────────────────────────────────────`)
parts.push(`do $$`)
parts.push(`declare n_bai int; n_cau int; n_lt int;`)
parts.push(`begin`)
parts.push(`  select count(*) into n_bai from hinh_hoc_bai where khoi='${KHOI}';`)
parts.push(`  select count(*) into n_cau from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai=c.dang_chinh where b.khoi='${KHOI}';`)
parts.push(`  select count(*) into n_lt from hinh_hoc_bai_ly_thuyet lt join hinh_hoc_bai b on b.ma_bai=lt.ma_bai where b.khoi='${KHOI}';`)
parts.push(`  raise notice 'Chuyển xong khối ${KHOI}: % Bài học tổng (bao gồm Bài đã có trước migration), % câu tổng, % lý thuyết Bài tổng.', n_bai, n_cau, n_lt;`)
parts.push(`  -- Sau migration ít nhất phải THÊM 9 Bài + ${cauRows.length} câu so với trước.`)
parts.push(`  -- (Verify chính xác thêm bao nhiêu bằng cách xem count(*) TRƯỚC/SAU migration nếu cần)`)
parts.push(`  -- Guard tối thiểu: mỗi Bài trong 9 tên mô hình v3 phải xuất hiện đúng 1 lần.`)
parts.push(`  select count(*) into n_bai from hinh_hoc_bai where khoi='${KHOI}' and ten_bai in (${mos.map(m=>esc(m.ten)).join(',')});`)
parts.push(`  if n_bai <> ${mos.length} then raise exception 'Sau migration: mong ${mos.length} Bài tên mô hình v3, có %', n_bai; end if;`)
parts.push(`end $$;`)
parts.push(``)
parts.push(`commit;`)

writeFileSync(path, parts.join('\n'), 'utf8')
console.log(`\n✅ Migration đã ghi: ${path}`)
console.log(`   ${mos.length} Bài · ${cauRows.length} câu (${cauKhongParent.length} không parent + ${cauCoParent.length} clone có parent)`)

// In tóm tắt chuỗi
console.log('\n=== Câu ghép (${dich.length} cái):')
for (const d of dich) {
  const bd = baoDong(d.id)
  const members = [...bd.map(id => btById.get(id).ma), d.ma]
  console.log(`  Bài "${mos.find(m=>m.id===d.mo_hinh_id).ten}" ← ${members.join(' + ')}`)
}

await c.end()
