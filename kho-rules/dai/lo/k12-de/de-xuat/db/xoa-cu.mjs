// xoa-cu.mjs — B5 K12: XOÁ bản đồ CŨ của 4 chủ đề làm lại (HS NCD00094 · VT NCD00096 · XS NCD00097 · SDT NCD00098) + mọi dòng phụ thuộc.
//   node kho-rules/dai/lo/k12-de/de-xuat/db/xoa-cu.mjs [--ghi] [--giu-diem-thi] [--khong-quet]
//   MẶC ĐỊNH = CHẠY THỬ: sao lưu → xoá trong MỘT transaction → hậu kiểm → ROLLBACK; in đếm + md5 trước/trong/sau.
//   --ghi          = COMMIT thật. CHỈ khi Thùy đã gật (Luật xoá CLAUDE.md). Bị chặn nếu còn mục NGUY hoặc CẦN QUYẾT chưa được chốt.
//   --giu-diem-thi = Thùy đã quyết: xoá câu MT nhưng GIỮ NGUYÊN diem_thi đã chốt (xem VAN-DE-xoa.md). Thiếu cờ này ⇒ --ghi bị chặn khi có câu MT.
//   --khong-quet   = bỏ quét toàn schema (nhanh, CHỈ để gỡ lỗi; --ghi luôn quét, cờ này bị bỏ qua khi --ghi).
// Thùy duyệt 03/11: "xoá thoải mái, dữ liệu đó không chuẩn … từ giáo trình đến ET/MT/BTVN của học sinh xoá hết được".
// PHẠM VI = chuyên đề/ô/nhóm/dạng của 4 chủ đề MÀ KHÔNG nằm trong db/ma-moi-<CH>.json, + mọi dòng trỏ vào chúng (FK và KHÔNG-FK).
// TUYỆT ĐỐI KHÔNG đụng NCD00095 (NHTP) · NCD00099 (PPTD) · chủ đề/khối khác — có chốt chặn + md5 chứng minh.
// RÀO:
//   • Danh sách id cũ tính TỪ DB (không chép tay); đối chiếu kỳ vọng KY_VONG (đo B1 03/11) — lệch ⇒ NGUY.
//   • Mỗi bảng có 1 vị từ (PRED) xác định dòng sẽ mất (trực tiếp hoặc CASCADE). Trước khi xoá: sao lưu ĐÚNG các dòng đó ra JSON
//     (S\backup-xoa-cu\) + manifest md5; đếm + md5 phần CÒN LẠI của mỗi bảng. Sau khi xoá (trong tx): md5 cả bảng phải = md5 phần còn lại
//     ⇒ mất ĐÚNG các dòng đã sao lưu, không dòng nào khác bị cascade/sửa.
//   • Thứ tự lá → gốc. Bảng đo lường: xoá dòng cha trỏ dạng cũ, để FK CASCADE dọn con (đã đếm + sao lưu trước). KHÔNG xoá bài test/ca/buổi/tài liệu cha
//     dù rỗng — chỉ liệt kê.
//   • Không DISABLE TRIGGER, không session_replication_role: không trigger nào chặn DELETE. Trigger chạy: _bdm_ghi_log (dai_bdm_log ghi `cu`),
//     _bdm_bump_nhom (bump nhóm CŨ sắp xoá), _tg_gami_grades_mt_tong (gami_grades xoá theo cascade ⇒ câu cha đã mất ⇒ không tính lại diem_thi;
//     md5 diem_thi được kiểm = trước).
//   • Hậu kiểm: quét lại toàn schema (mọi cột text/json/array) — không còn dòng nào chứa id cũ (trừ dai_bdm_log); số chuyên đề/nhóm/dạng còn lại
//     = ma-moi (NCD00095/99 không đổi).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createHash } from 'node:crypto'
import pg from 'pg'
import { bien } from '../../../../../../scripts/kho/cau-hinh.mjs'

const DIR = dirname(fileURLToPath(import.meta.url))
const BACKUP = process.env.BACKUP_DIR ?? ['C:', 'Users', 'WBPC', 'Desktop', 'BKERP', '_backup-xoa-cu-k12-0311'].join('/')   // NGOÀI repo; máy nhà dùng BACKUP_DIR
const XOA = { HS: 'NCD00094', VT: 'NCD00096', XS: 'NCD00097', SDT: 'NCD00098' }
const GIU = { NHTP: 'NCD00095', PPTD: 'NCD00099' }
// Kỳ vọng số CŨ sẽ xoá (B1 03/11, kiểm lại DB 03/11): chuyên đề · nhóm · dạng
const KY_VONG = { NCD00094: { ch: 3, nhom: 33, dang: 11 }, NCD00096: { ch: 3, nhom: 21, dang: 6 }, NCD00097: { ch: 2, nhom: 7, dang: 0 }, NCD00098: { ch: 1, nhom: 7, dang: 0 } }
const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const GIU_DIEM_THI = args.includes('--giu-diem-thi')
const QUET = GHI || !args.includes('--khong-quet')
const url = process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri
if (!url) { console.error('Thiếu chuỗi kết nối'); process.exit(2) }
const in_ = (...a) => console.log(...a)
const nguy = [], canQuyet = []

// ── 0. Bảng mã MỚI (giữ) ────────────────────────────────────────────────────────────────────────────────
const MOI = {} // cd → {ch:Set, nhom:Set, dang:Set}
for (const [ch, cd] of Object.entries(XOA)) {
  const j = JSON.parse(readFileSync(join(DIR, `ma-moi-${ch}.json`), 'utf8'))
  if (j.chu_de !== cd) throw new Error(`ma-moi-${ch}.json chu_de ${j.chu_de} ≠ ${cd}`)
  MOI[cd] = { ch: new Set(Object.values(j.chuyen_de)), nhom: new Set(Object.values(j.nhom)), dang: new Set(Object.values(j.dang)) }
}
const moiTat = new Set(Object.values(MOI).flatMap((m) => [...m.ch, ...m.nhom, ...m.dang]))
// nhân chứng thứ hai cho gan_cau: danh sách mồ côi gan-cau.mjs đã in (db/mo-coi.md)
const moCoi = new Set(readFileSync(join(DIR, 'mo-coi.md'), 'utf8').split(/\r?\n/).map((l) => l.split('|').map((x) => x.trim())).filter((c) => c.length > 8 && /^T\d+/.test(c[3] ?? '')).map((c) => c[3]))

const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
c.on('error', (e) => console.error('✘ kết nối lỗi:', e.message))
await c.connect()
const Q = async (s, p) => (await c.query(s, p)).rows
let ma = 0
try {
  // ── 1. CHỐT CHẶN: id cũ tính từ DB ────────────────────────────────────────────────────────────────────
  const cdXoa = Object.values(XOA), cdGiu = Object.values(GIU)
  const cay = await Q(`select 'ch' loai, o.chuyen_de_id id, o.chu_de_id cd, c.ten, null::text cha from dai_bdm_o o join dai_bdm_chuyen_de c on c.id=o.chuyen_de_id where o.chu_de_id = any($1)
    union all select 'nhom', n.id, n.chu_de_id, n.ten, n.chuyen_de_id from dai_bdm_nhom n where n.chu_de_id = any($1)
    union all select 'dang', d.id, n.chu_de_id, d.ten, d.nhom_id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id = any($1) order by 1, 3, 2`, [cdXoa])
  const cu = cay.filter((x) => !moiTat.has(x.id))
  const ID = cu.map((x) => x.id), ID_CH = cu.filter((x) => x.loai === 'ch').map((x) => x.id)
  // mọi id ma-moi phải có trong DB, đúng chủ đề, đúng loại
  for (const [cd, m] of Object.entries(MOI)) for (const [loai, s] of Object.entries(m)) for (const id of s) { const r = cay.find((x) => x.id === id); if (!r || r.cd !== cd || r.loai !== loai) nguy.push(`ma-moi: ${id} (${loai}) không có trong cây ${cd} của DB`) }
  // nhóm/dạng MỚI không được nằm dưới chuyên đề/nhóm CŨ (FK no action sẽ chặn, hoặc mất cây mới)
  for (const x of cay) if (moiTat.has(x.id) && x.cha && ID.includes(x.cha)) nguy.push(`${x.loai} MỚI ${x.id} nằm dưới ${x.cha} CŨ`)
  // id cũ không được dính chủ đề khác: chuyên đề chỉ thuộc 1 ô; nhóm/dạng của 095/099 không trỏ chuyên đề/nhóm cũ
  const lan = await Q(`select 'o' k, chu_de_id||'|'||chuyen_de_id v from dai_bdm_o where chuyen_de_id = any($1) and not chu_de_id = any($2)
    union all select 'nhom', id from dai_bdm_nhom where (chuyen_de_id = any($1) or id = any($1)) and not chu_de_id = any($2)
    union all select 'dang', d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where (d.nhom_id = any($1) or d.id = any($1)) and not n.chu_de_id = any($2)
    union all select 'doi_ung', id::text from dai_bdm_doi_ung where dich_chu_de is not null and not dich_chu_de = any($2) and (dich_chuyen_de = any($1) or dich_nhom = any($1) or dich_dang_bai = any($1))`, [ID, cdXoa])
  for (const x of lan) nguy.push(`id cũ dính chủ đề ngoài 4 chủ đề: ${x.k} ${x.v}`)
  if (ID.some((id) => !/^N(CH|NB|DB)\d{5}$/.test(id))) nguy.push('id cũ sai khuôn')
  in_(`Id CŨ sẽ xoá: ${ID.length} (chuyên đề ${ID_CH.length} · nhóm ${cu.filter((x) => x.loai === 'nhom').length} · dạng ${cu.filter((x) => x.loai === 'dang').length})`)
  in_(['chủ đề', 'chuyên đề cũ', 'nhóm cũ', 'dạng cũ', 'kỳ vọng', 'mới (giữ) ch/nhóm/dạng'].join('\t'))
  for (const cd of cdXoa) {
    const d = (l) => cu.filter((x) => x.cd === cd && x.loai === l).length, k = KY_VONG[cd]
    const ok = d('ch') === k.ch && d('nhom') === k.nhom && d('dang') === k.dang
    if (!ok) nguy.push(`${cd}: số cũ ${d('ch')}/${d('nhom')}/${d('dang')} ≠ kỳ vọng ${k.ch}/${k.nhom}/${k.dang}`)
    in_([cd, d('ch'), d('nhom'), d('dang'), `${k.ch}/${k.nhom}/${k.dang} ${ok ? '✔' : '✘'}`, `${MOI[cd].ch.size}/${MOI[cd].nhom.size}/${MOI[cd].dang.size}`].join('\t'))
  }

  // ── 2. Vị từ từng bảng (dòng sẽ MẤT: trực tiếp hoặc cascade) ──────────────────────────────────────────
  const GSP = `select id from gami_session_problems where ma_dang = any($1)`
  const BTC = `select id from bai_test_cau where ma_dang = any($1)`
  const BLC = `select id from bai_lam_cau where bai_test_cau_id in (${BTC})`
  const CTC = `select id from ca_test_cau where ma_dang = any($1)`
  const TLP = `with recursive t as (select id from tai_lieu_phan where ref_ma = any($1) union select p.id from tai_lieu_phan p join t on p.cha_id = t.id) select id from t`
  const B = [ // bang · pred · kieu (truc_tiep|cascade) · thu tu xoá (null = cascade)
    ['dai_bdm_gan_cau', `dang_bai_id = any($1)`, 'trực tiếp'],
    ['hgt_bdm_gan_cau', `dang_bai_id = any($1)`, 'trực tiếp'],
    ['dai_bdm_de_xuat', `dang_bai_id = any($1)`, 'trực tiếp'],
    ['hgt_bdm_de_xuat', `dang_bai_id = any($1)`, 'trực tiếp'],
    ['dai_bdm_kiem_mau', `dang_bai_ai_id = any($1)`, 'trực tiếp'],
    ['hgt_bdm_kiem_mau', `dang_bai_ai_id = any($1)`, 'trực tiếp'],
    ['dai_bdm_tu_choi', `dang_bai_ai_id = any($1)`, 'trực tiếp'],
    ['hgt_bdm_tu_choi', `dang_bai_ai_id = any($1)`, 'trực tiếp'],
    ['dai_cau_lop', `dang_bai_id = any($1)`, 'trực tiếp'],
    ['dai_bdm_doi_ung', `dich_dang_bai = any($1) or dich_nhom = any($1) or dich_chuyen_de = any($1)`, 'trực tiếp'],
    ['dai_bdm_doi_ung_cum', `dang_bai_id = any($1)`, 'trực tiếp'],
    ['dai_bdm_nhom_tien_de', `nhom_id = any($1) or tien_de_nhom_id = any($1)`, 'trực tiếp'],
    ['gami_session_problems', `ma_dang = any($1)`, 'trực tiếp'],
    ['gami_grades', `problem_id in (${GSP})`, 'cascade ← gami_session_problems'],
    ['bai_test_dang_phat_hanh', `ma_dang = any($1)`, 'trực tiếp'],
    ['bai_test_cau', `ma_dang = any($1)`, 'trực tiếp'],
    ['bai_lam_cau', `bai_test_cau_id in (${BTC})`, 'cascade ← bai_test_cau'],
    ['bai_lam_cau_sua_log', `bai_lam_cau_id in (${BLC})`, 'cascade ← bai_lam_cau'],
    ['bai_test_report', `bai_lam_cau_id in (${BLC})`, 'cascade ← bai_lam_cau'],
    ['bai_test_cau_phat_hanh', `bai_test_cau_id in (${BTC})`, 'cascade ← bai_test_cau'],
    ['bai_test_cham_lai_log', `bai_test_cau_id in (${BTC})`, 'cascade ← bai_test_cau'],
    ['bai_lam_goi_y', `bai_test_cau_id in (${BTC})`, 'cascade ← bai_test_cau'],
    ['thi_thu_anh', `bai_test_cau_id in (${BTC})`, 'cascade ← bai_test_cau'],
    ['ca_test_cau', `ma_dang = any($1)`, 'trực tiếp'],
    ['ca_test_cau_kq', `ca_test_cau_id in (${CTC})`, 'cascade ← ca_test_cau'],
    ['tu_luyen_dang_lan', `ma_dang = any($1)`, 'trực tiếp'],
    ['tai_lieu_phan', `id in (${TLP})`, 'trực tiếp (ref_ma) + cascade con (cha_id)'],
    ['tai_lieu_cau', `phan_id in (${TLP})`, 'cascade ← tai_lieu_phan'],
    ['dai_bdm_dang_bai', `id = any($1)`, 'trực tiếp'],
    ['dai_bdm_nhom', `id = any($1)`, 'trực tiếp'],
    ['dai_bdm_o', `chuyen_de_id = any($1) and chu_de_id = any($2)`, 'trực tiếp'],
    ['dai_bdm_chuyen_de', `id = any($1)`, 'trực tiếp'],
  ]
  // SET NULL / NO ACTION con của bảng bị xoá: phải = 0 (nếu không ⇒ NGUY: sửa dòng ngoài phạm vi / FK chặn)
  const CHAN = [
    ['bai_cau_bao_loi (SET NULL ← bai_test_cau)', `select count(*)::int n from bai_cau_bao_loi where bai_test_cau_id in (${BTC})`],
    ['gami_grades.bai_lam_cau_id (SET NULL ← bai_lam_cau)', `select count(*)::int n from gami_grades where bai_lam_cau_id in (${BLC}) and not problem_id in (${GSP})`],
    ['tln_ai_cham_log (NO ACTION ← bai_lam_cau: CHẶN)', `select count(*)::int n from tln_ai_cham_log where bai_lam_cau_id in (${BLC})`],
    ['dang_yeu_hien_tai.dang (jsonb, không FK)', `select count(*)::int n from dang_yeu_hien_tai where dang::text ~ ('(' || array_to_string($1::text[],'|') || ')([^0-9]|$)')`],
  ]
  const P = [ID, cdXoa]
  const usesP2 = (s) => s.includes('$2')
  const q2 = async (sql) => Q(sql, usesP2(sql) ? P : sql.includes('$1') ? [ID] : [])
  const md5Bang = async (t, where) => (await q2(`select count(*)::int n, md5(coalesce(string_agg(x, ',' order by x), '')) h from (select to_jsonb(t)::text x from ${t} t ${where ? `where ${where}` : ''}) z`))[0]

  // ảnh chụp ngoài phạm vi (đặt tên): cây + gan_cau của 095/099 và của 4 cây MỚI; diem_thi; tai_lieu (bỏ updated_at)
  const moiArr = [...moiTat]
  const CHUP = {
    'cây NCD00095+099 (o·chuyen_de·nhom·dang)': `select md5(string_agg(x, ',' order by x)) h, count(*)::int n from (
        select to_jsonb(o)::text x from dai_bdm_o o where chu_de_id = any($1) union all select to_jsonb(c)::text from dai_bdm_chuyen_de c where id in (select chuyen_de_id from dai_bdm_o where chu_de_id = any($1))
        union all select to_jsonb(n)::text from dai_bdm_nhom n where chu_de_id = any($1) union all select to_jsonb(d)::text from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id = any($1)) z`,
    'gan_cau (dai+hgt) dạng NCD00095+099': `select md5(string_agg(x, ',' order by x)) h, count(*)::int n from (select to_jsonb(g)::text x from dai_bdm_gan_cau g where dang_bai_id in (select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id = any($1))
        union all select to_jsonb(g)::text from hgt_bdm_gan_cau g where dang_bai_id in (select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id = any($1))) z`,
    'cây MỚI HS/VT/XS/SDT (o·chuyen_de·nhom·dang)': `select md5(string_agg(x, ',' order by x)) h, count(*)::int n from (
        select to_jsonb(o)::text x from dai_bdm_o o where chuyen_de_id = any($M) union all select to_jsonb(c)::text from dai_bdm_chuyen_de c where id = any($M)
        union all select (to_jsonb(n) - 'updated_at')::text from dai_bdm_nhom n where id = any($M) union all select to_jsonb(d)::text from dai_bdm_dang_bai d where id = any($M)) z`,
    'gan_cau (dai+hgt) dạng MỚI': `select md5(string_agg(x, ',' order by x)) h, count(*)::int n from (select to_jsonb(g)::text x from dai_bdm_gan_cau g where dang_bai_id = any($M) union all select to_jsonb(g)::text from hgt_bdm_gan_cau g where dang_bai_id = any($M)) z`,
    'diem_thi (cả bảng)': `select md5(string_agg(x, ',' order by x)) h, count(*)::int n from (select to_jsonb(t)::text x from diem_thi t) z`,
    'tai_lieu (cả bảng, bỏ updated_at)': `select md5(string_agg(x, ',' order by x)) h, count(*)::int n from (select (to_jsonb(t) - 'updated_at')::text x from tai_lieu t) z`,
    'dai_bdm_chu_de (cả bảng)': `select md5(string_agg(x, ',' order by x)) h, count(*)::int n from (select to_jsonb(t)::text x from dai_bdm_chu_de t) z`,
  }
  const chup = async () => { const r = {}; for (const [k, s] of Object.entries(CHUP)) r[k] = (await Q(s.split('$M').join('$1'), s.includes('$M') ? [moiArr] : s.includes('$1') ? [cdGiu] : []))[0]; return r }
  const demCay = async () => Object.fromEntries((await Q(`select x.cd, (select count(*) from dai_bdm_o o where o.chu_de_id=x.cd)::int ch, (select count(*) from dai_bdm_nhom n where n.chu_de_id=x.cd)::int nhom,
      (select count(*) from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id=x.cd)::int dang from unnest($1::text[]) x(cd) order by 1`, [[...cdXoa, ...cdGiu]])).map((r) => [r.cd, r]))
  const tongBang = async () => { const r = {}; for (const [t] of B) r[t] = await md5Bang(t); return r }

  const truocCay = await demCay(), truocTong = await tongBang()
  const logTruoc = (await Q(`select count(*)::int n, coalesce(max(id),0)::bigint mx from dai_bdm_log`))[0]

  // REPEATABLE READ: một ảnh chụp cố định cho cả tx (bảng đo lường đang được app ghi liên tục — READ COMMITTED làm lệch đếm).
  // Ai đó sửa đúng dòng đang xoá ⇒ lỗi tuần tự hoá ⇒ tx huỷ (an toàn).
  await c.query('begin isolation level repeatable read')
  await c.query(`set local statement_timeout = '600s'`)
  await c.query(`set local lock_timeout = '20s'`)
  // ảnh chụp ngoài phạm vi lấy TRONG tx (cùng snapshot với lúc 'sau xoá'): bảng sống như diem_thi/tai_lieu bị app ghi đồng thời thì chụp trước tx sẽ lệch oan (dry-run 03/11 chiều)
  const truocNgoai = await chup()
  const BANG_SONG = new Set(['diem_thi (cả bảng)', 'tai_lieu (cả bảng, bỏ updated_at)'])

  // ── 3. Đếm + sao lưu (trong tx, trước khi xoá) ────────────────────────────────────────────────────────
  for (const [nhan, s] of CHAN) { const n = (await Q(s, [ID]))[0].n; if (n && !nhan.startsWith('bai_cau_bao_loi')) nguy.push(`${nhan}: ${n} dòng`);   // báo lỗi của HS: chỉ mất liên kết bai_test_cau_id (SET NULL), dòng giữ ma_cau ⇒ cho phép + sao lưu (04/11)
 in_(`  kiểm ${nhan}: ${n}`) }
  mkdirSync(BACKUP, { recursive: true })
  { const bl = await Q(`select * from bai_cau_bao_loi where bai_test_cau_id in (${BTC})`, [ID]); writeFileSync(join(BACKUP, 'bai_cau_bao_loi-se-SET-NULL.json'), JSON.stringify(bl, null, 1)); in_(`  báo lỗi HS sẽ mất liên kết bai_test_cau_id (giữ ma_cau): ${bl.length} dòng, đã sao lưu`) }
  const KE = [] // {t, kieu, n, conLai, h, vd, file, md5file}
  for (const [t, pred, kieu] of B) {
    const rows = (await q2(`select to_jsonb(t) j from ${t} t where ${pred}`)).map((r) => r.j)
    const con = await md5Bang(t, `(${pred}) is not true`), del = await md5Bang(t, pred)
    const body = JSON.stringify(rows, null, 1)
    const file = join(BACKUP, `${t}.json`)
    writeFileSync(file, body)
    const vd = rows.slice(0, 3).map((r) => r.id ?? r.ma_cau ?? r.ma_cum_cu ?? r.bai_test_cau_id ?? (r.chu_de_id && r.chuyen_de_id ? `${r.chu_de_id}|${r.chuyen_de_id}` : null) ?? `${r.bai_test_id}|${r.ma_dang}`).join(', ')
    KE.push({ t, kieu, n: rows.length, con, del, vd, file, md5file: createHash('md5').update(body).digest('hex') })
  }
  // gan_cau: nhân chứng thứ hai = mo-coi.md; không dòng 'nguoi'
  const gc = (await Q(`select ma_cau, nguon from dai_bdm_gan_cau where dang_bai_id = any($1) union all select ma_cau, nguon from hgt_bdm_gan_cau where dang_bai_id = any($1)`, [ID]))
  const gcSet = new Set(gc.map((x) => x.ma_cau))
  const lechMoCoi = [...gcSet].filter((m) => !moCoi.has(m)).concat([...moCoi].filter((m) => !gcSet.has(m)))
  if (lechMoCoi.length) nguy.push(`gan_cau sắp xoá ≠ danh sách mo-coi.md (${gcSet.size} vs ${moCoi.size}; lệch ${lechMoCoi.length}: ${lechMoCoi.slice(0, 10).join(',')})`)
  const gcNguoi = gc.filter((x) => x.nguon === 'nguoi').length
  if (gcNguoi) nguy.push(`gan_cau sắp xoá có ${gcNguoi} dòng nguon=nguoi`)
  // tai_lieu_phan con bị cascade mà trỏ id NGOÀI tập cũ ⇒ mất nội dung hợp lệ
  const tlpNgoai = await Q(`select id, ref_ma from tai_lieu_phan where id in (${TLP}) and ref_ma is not null and not ref_ma = any($1)`, [ID])
  for (const x of tlpNgoai) nguy.push(`tai_lieu_phan ${x.id} (cascade) trỏ ${x.ref_ma} — không thuộc tập cũ`)
  // MT: xoá câu MT ⇒ diem_thi đã chốt không còn khớp câu ⇒ CẦN QUYẾT
  const mt = await Q(`select s.buoi_hoc_id, b.ngay, _mt_ky_thi(s.buoi_hoc_id) ky, count(*)::int xoa, (select count(*) from gami_session_problems t where t.buoi_hoc_id=s.buoi_hoc_id and t.phase='mt')::int tong,
      (select count(*) from diem_thi d where d.ky_thi_id=_mt_ky_thi(s.buoi_hoc_id))::int diem_thi from gami_session_problems s join buoi_hoc b on b.id=s.buoi_hoc_id where s.ma_dang = any($1) and s.phase='mt' group by 1,2`, [ID])
  if (mt.length && !GIU_DIEM_THI) canQuyet.push(`MT: ${mt.map((x) => `buổi ${x.buoi_hoc_id} (${new Date(x.ngay).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}) xoá ${x.xoa}/${x.tong} câu MT, kỳ thi ${x.ky} có ${x.diem_thi} diem_thi`).join('; ')} — diem_thi giữ nguyên hay tính lại? (VAN-DE-xoa.md) ⇒ cần --giu-diem-thi`)
  // cha sẽ RỖNG (liệt kê, KHÔNG xoá)
  const rong = {
    bai_test: await Q(`select b.bai_test_id id, t.loai, t.ngay, t.mon, count(*)::int xoa from bai_test_cau b join bai_test t on t.id=b.bai_test_id where b.ma_dang = any($1) group by 1,2,3,4 having count(*) = (select count(*) from bai_test_cau x where x.bai_test_id=b.bai_test_id) order by 3`, [ID]),
    buoi_phase: await Q(`select s.buoi_hoc_id id, s.phase, b.ngay, count(*)::int xoa from gami_session_problems s join buoi_hoc b on b.id=s.buoi_hoc_id where s.ma_dang = any($1) group by 1,2,3 having count(*) = (select count(*) from gami_session_problems t where t.buoi_hoc_id=s.buoi_hoc_id and t.phase=s.phase) order by 3`, [ID]),
    ca_test: await Q(`select x.ca_test_id id, count(*)::int xoa from ca_test_cau x where x.ma_dang = any($1) group by 1 having count(*) = (select count(*) from ca_test_cau t where t.ca_test_id=x.ca_test_id)`, [ID]),
    tai_lieu_phan_cha: await Q(`select p.id, p.tieu_de, p.loai_phan, l.ten tai_lieu from tai_lieu_phan p join tai_lieu l on l.id=p.tai_lieu_id where p.id in (select cha_id from tai_lieu_phan where id in (${TLP})) and not p.id in (${TLP})
        and not exists (select 1 from tai_lieu_phan k where k.cha_id=p.id and not k.id in (${TLP})) and not exists (select 1 from tai_lieu_cau k where k.phan_id=p.id)`, [ID]),
  }
  const taiLieu = await Q(`select l.id, l.ten, count(*)::int phan_xoa, (select count(*) from tai_lieu_phan x where x.tai_lieu_id=l.id)::int phan_tong from tai_lieu_phan p join tai_lieu l on l.id=p.tai_lieu_id where p.id in (${TLP}) group by 1,2 order by 2`, [ID])

  // quét toàn schema TRƯỚC (cột text/json/array có id cũ) — phải nằm trong các bảng đã có vị từ
  const re = `(${ID.join('|')})([^0-9]|$)`
  const quet = async () => {
    const cols0 = await Q(`select c.table_name t, c.column_name col from information_schema.columns c join information_schema.tables t on t.table_name=c.table_name and t.table_schema=c.table_schema
      where c.table_schema='public' and t.table_type='BASE TABLE' and c.data_type in ('text','character varying','jsonb','json','ARRAY','character') and c.table_name <> 'dai_bdm_log' order by 1,2`)
    const theoBang = new Map(); for (const x of cols0) theoBang.set(x.t, [...(theoBang.get(x.t) ?? []), x.col])
    const cols = []
    for (const [t, cs] of theoBang) { await c.query('savepoint q'); try { const n = (await c.query(`select count(*)::int n from "${t}" where concat_ws('|', ${cs.map((x) => `"${x}"::text`).join(', ')}) ~ $1`, [re])).rows[0].n; await c.query('release savepoint q'); if (n) for (const col of cs) cols.push({ t, col }) } catch (e) { await c.query('rollback to savepoint q'); for (const col of cs) cols.push({ t, col }) } }
    const r = []
    for (const x of cols) { await c.query('savepoint q'); try { const n = (await c.query(`select count(*)::int n from "${x.t}" where "${x.col}"::text ~ $1`, [re])).rows[0].n; await c.query('release savepoint q'); if (n) r.push({ ...x, n }) } catch (e) { await c.query('rollback to savepoint q'); r.push({ ...x, n: -1, loi: e.message }) } }
    return r
  }
  const QUET_BIET = new Set(B.map((x) => x[0]))
  let quetTruoc = []
  if (QUET) {
    quetTruoc = await quet()
    for (const x of quetTruoc) if (!QUET_BIET.has(x.t) || x.n < 0) nguy.push(`quét: ${x.t}.${x.col} có ${x.n} dòng chứa id cũ — bảng KHÔNG nằm trong phạm vi xử lý${x.loi ? ` (${x.loi})` : ''}`)
  }

  // ── 4. XOÁ lá → gốc (trong tx) ────────────────────────────────────────────────────────────────────────
  const XOA_SQL = B.filter(([, , k]) => !k.startsWith('cascade')).map(([t, pred]) => [t, t === 'tai_lieu_phan' ? `ref_ma = any($1)` : pred])
  const daXoa = {}
  for (const [t, pred] of XOA_SQL) daXoa[t] = (await c.query(`delete from ${t} where ${pred}`, pred.includes("$2") ? P : [ID])).rowCount
  // CLAUDE.md §2: đổi nội dung con ⇒ bump updated_at của cha (giáo trình)
  await Q(`update tai_lieu set updated_at = now() where id = any($1::uuid[])`, [taiLieu.map((x) => x.id)])
  const bumpN = taiLieu.length

  // ── 5. HẬU KIỂM (trong tx) ────────────────────────────────────────────────────────────────────────────
  const sauTong = await tongBang()
  in_(`\n══ BẢNG · dòng xoá trực tiếp · dòng cascade · còn lại · md5 phần còn lại = md5 sau xoá? · ví dụ ══`)
  in_(['bảng', 'kiểu', 'trực tiếp', 'cascade', 'tổng mất', 'trước', 'sau', 'khớp', 'ví dụ'].join('\t'))
  for (const k of KE) {
    const tr = { n: k.con.n + k.n }, sa = sauTong[k.t]
    const truc = k.kieu.startsWith('cascade') ? 0 : k.t === 'tai_lieu_phan' ? daXoa[k.t] : (daXoa[k.t] ?? 0)
    const cas = k.n - truc
    const khop = sa.n === k.con.n && sa.h === k.con.h && tr.n - sa.n === k.n
    if (!khop) nguy.push(`${k.t}: sau xoá ${sa.n} dòng (md5 ${sa.h.slice(0, 8)}) ≠ phần còn lại ${k.con.n} (md5 ${k.con.h.slice(0, 8)}) hoặc mất ${tr.n - sa.n} ≠ ${k.n}`)
    if (!k.kieu.startsWith('cascade') && k.t !== 'tai_lieu_phan' && truc !== k.n) nguy.push(`${k.t}: DELETE ${truc} ≠ sao lưu ${k.n}`)
    k.truc = truc; k.cas = cas
    in_([k.t, k.kieu, truc, cas, k.n, tr.n, sa.n, khop ? '✔' : '✘', k.vd].join('\t'))
  }
  in_(`(bump tai_lieu.updated_at: ${bumpN} giáo trình)`)
  const sauCay = await demCay()
  in_(`\n══ CÂY CÒN LẠI (trong tx, sau xoá): chuyên đề · nhóm · dạng ══`)
  for (const cd of [...cdXoa, ...cdGiu]) {
    const s = sauCay[cd], t = truocCay[cd]
    const kv = MOI[cd] ? { ch: MOI[cd].ch.size, nhom: MOI[cd].nhom.size, dang: MOI[cd].dang.size } : { ch: t.ch, nhom: t.nhom, dang: t.dang }
    const ok = s.ch === kv.ch && s.nhom === kv.nhom && s.dang === kv.dang
    if (!ok) nguy.push(`${cd}: còn ${s.ch}/${s.nhom}/${s.dang} ≠ ${kv.ch}/${kv.nhom}/${kv.dang}`)
    in_(`  ${cd}: trước ${t.ch}/${t.nhom}/${t.dang} → sau ${s.ch}/${s.nhom}/${s.dang} · phải = ${MOI[cd] ? 'ma-moi' : 'trước (KHÔNG ĐỤNG)'} ${kv.ch}/${kv.nhom}/${kv.dang} ${ok ? '✔' : '✘'}`)
  }
  const trongNgoai = await chup()
  in_(`\n══ NGOÀI PHẠM VI: trước → trong tx sau xoá (phải bằng) ══`)
  for (const k of Object.keys(CHUP)) {
    const a = truocNgoai[k], b = trongNgoai[k], ok = a.n === b.n && a.h === b.h
    if (!ok) nguy.push(`ngoài phạm vi đổi trong tx: ${k}`)
    in_(`  ${k}: ${a.n} (md5 ${String(a.h).slice(0, 10)}) → ${b.n} (md5 ${String(b.h).slice(0, 10)}) ${ok ? '✔' : '✘'}`)
  }
  if (QUET) {
    const quetSau = await quet()
    in_(`\n══ QUÉT TOÀN SCHEMA (cột text/json/array, trừ dai_bdm_log): trước ${quetTruoc.length} cột có id cũ → sau ${quetSau.length} ══`)
    for (const x of quetTruoc) in_(`  trước  ${x.t}.${x.col}: ${x.n}`)
    for (const x of quetSau) { in_(`  SAU ✘ ${x.t}.${x.col}: ${x.n}`); nguy.push(`còn id cũ sau xoá: ${x.t}.${x.col} ${x.n}`) }
    if (!quetSau.length) in_('  ✔ sau xoá không còn cột nào chứa id cũ')
  } else in_('\n(bỏ quét toàn schema: --khong-quet)')
  const lg = await Q(`select bang, hanh_dong, count(*)::int n from dai_bdm_log where id > $1 group by 1,2 order by 1,2`, [logTruoc.mx])
  in_(`\n[TRIGGER] dai_bdm_log thêm (giữ \`cu\` jsonb): ${lg.map((x) => `${x.bang}/${x.hanh_dong} ${x.n}`).join(' · ') || '(không)'}`)

  // ── 6. In danh sách + cha rỗng ────────────────────────────────────────────────────────────────────────
  in_(`\n══ CHA SẼ RỖNG (KHÔNG xoá, chỉ liệt kê) ══`)
  in_(`  bài test hết câu: ${rong.bai_test.length} — ${rong.bai_test.map((x) => `${x.id.slice(0, 8)}(${x.loai},${x.xoa}c)`).join(' ')}`)
  in_(`  buổi × phase hết câu: ${rong.buoi_phase.length} — ${rong.buoi_phase.map((x) => `${x.id.slice(0, 8)}/${x.phase}(${x.xoa})`).join(' ')}`)
  in_(`  ca test hết câu: ${rong.ca_test.length}`)
  in_(`  phần giáo trình cha hết con: ${rong.tai_lieu_phan_cha.length} — ${rong.tai_lieu_phan_cha.map((x) => `${x.tai_lieu}/«${x.tieu_de}»`).join(' · ')}`)
  in_(`  giáo trình: ${taiLieu.map((x) => `«${x.ten}» mất ${x.phan_xoa}/${x.phan_tong} phần`).join(' · ')}`)
  if (mt.length) in_(`  MT: ${mt.map((x) => `buổi ${x.buoi_hoc_id.slice(0, 8)} xoá ${x.xoa}/${x.tong} câu MT; kỳ thi ${x.ky} có ${x.diem_thi} diem_thi (giữ nguyên — trigger không tính lại vì câu cha đã mất)`).join('; ')}`)

  // manifest sao lưu
  const manifest = { luc: new Date().toISOString(), che_do: GHI ? 'GHI' : 'CHAY_THU', id_cu: cu, bang: KE.map((k) => ({ bang: k.t, kieu: k.kieu, so_dong: k.n, truc_tiep: k.truc, cascade: k.cas, tep: k.file, md5_tep: k.md5file })) }
  writeFileSync(join(BACKUP, 'manifest.json'), JSON.stringify(manifest, null, 1))
  in_(`\nSao lưu: ${BACKUP} (${KE.length} tệp + manifest.json, tổng ${KE.reduce((s, k) => s + k.n, 0)} dòng)`)

  // danh sách md
  const tenCh = new Map(cu.filter((x) => x.loai === 'ch').map((x) => [x.id, x.ten])), tenN = new Map(cu.filter((x) => x.loai === 'nhom').map((x) => [x.id, x.ten]))
  const md = [`# Danh sách XOÁ bản đồ CŨ K12 — 4 chủ đề làm lại (xoa-cu.mjs)`, '',
    `> Sinh bởi \`xoa-cu.mjs\` (${GHI ? 'GHI' : 'chạy thử'} ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}). Thùy đã duyệt xoá 03/11. KHÔNG đụng NCD00095 (NHTP) · NCD00099 (PPTD). Sao lưu JSON: \`${BACKUP}\`.`, '',
    `## 1. Số dòng mỗi bảng`, '', '| bảng | kiểu | xoá trực tiếp | cascade | tổng mất |', '|---|---|---|---|---|',
    ...KE.map((k) => `| \`${k.t}\` | ${k.kieu} | ${k.truc} | ${k.cas} | **${k.n}** |`), `| **tổng** | | | | **${KE.reduce((s, k) => s + k.n, 0)}** |`, '',
    `Kèm: \`tai_lieu.updated_at\` bump ${bumpN} giáo trình (CLAUDE.md §2). \`dai_bdm_log\` thêm ${lg.reduce((s, x) => s + x.n, 0)} dòng (${lg.map((x) => `${x.bang}/${x.hanh_dong} ${x.n}`).join(' · ')}).`, '',
    `## 2. Cha sẽ RỖNG (không xoá — Thùy quyết)`, '',
    `- Bài test hết câu (${rong.bai_test.length}): ${rong.bai_test.map((x) => `\`${x.id}\` (${x.loai}, ${x.mon}, ${x.ngay ? new Date(x.ngay).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : '—'}, ${x.xoa} câu)`).join(' · ') || 'không'}`,
    `- Buổi × phase hết câu (${rong.buoi_phase.length}): ${rong.buoi_phase.map((x) => `\`${x.id}\`/${x.phase} (${new Date(x.ngay).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}, ${x.xoa} câu)`).join(' · ') || 'không'}`,
    `- Ca test hết câu: ${rong.ca_test.length}`,
    `- Phần giáo trình cha hết con (${rong.tai_lieu_phan_cha.length}): ${rong.tai_lieu_phan_cha.map((x) => `${x.tai_lieu} / «${x.tieu_de}» (\`${x.id}\`)`).join(' · ') || 'không'}`,
    `- Giáo trình: ${taiLieu.map((x) => `«${x.ten}» mất ${x.phan_xoa}/${x.phan_tong} phần`).join(' · ')}`,
    ...(mt.length ? [`- **MT**: ${mt.map((x) => `buổi \`${x.buoi_hoc_id}\` xoá ${x.xoa}/${x.tong} câu MT; kỳ thi \`${x.ky}\` có ${x.diem_thi} dòng \`diem_thi\` — giữ nguyên (xem VAN-DE-xoa.md)`).join('; ')}`] : []), '',
    `## 3. Id cũ sẽ xoá (${ID.length})`, '']
  for (const cd of cdXoa) {
    const ten = Object.entries(XOA).find(([, v]) => v === cd)[0]
    md.push(`### ${cd} (${ten})`, '', '| loại | id | tên | cha |', '|---|---|---|---|')
    for (const x of cu.filter((y) => y.cd === cd)) md.push(`| ${x.loai === 'ch' ? 'chuyên đề' : x.loai} | ${x.id} | ${x.ten.replace(/\|/g, '/')} | ${x.cha ? `${x.cha} ${(tenCh.get(x.cha) ?? tenN.get(x.cha) ?? '').replace(/\|/g, '/')}` : ''} |`)
    md.push('')
  }
  writeFileSync(join(DIR, 'xoa-cu-danh-sach.md'), md.join('\n') + '\n')
  in_(`Danh sách: db/xoa-cu-danh-sach.md`)

  if (canQuyet.length) { in_(`\n⚠ CẦN QUYẾT (${canQuyet.length}) — chặn --ghi:`); for (const x of canQuyet) in_('  ' + x) }
  if (nguy.length) { in_(`\n✖ NGUY (${nguy.length}) — chặn --ghi:`); for (const x of nguy.slice(0, 100)) in_('  ' + x) } else in_('\n✔ Không có mục NGUY.')
  if (GHI && (nguy.length || canQuyet.length)) throw new Error('chặn --ghi vì còn mục NGUY / CẦN QUYẾT')
  await c.query(GHI ? 'commit' : 'rollback')

  // ── 7. Sau COMMIT/ROLLBACK ────────────────────────────────────────────────────────────────────────────
  const sauNgoai = await chup(), sauTongR = await tongBang()
  const logSau = (await Q(`select count(*)::int n from dai_bdm_log`))[0]
  in_(`\n══ SAU ${GHI ? 'COMMIT' : 'ROLLBACK'}: đếm + md5 ══`)
  let giong = true
  for (const k of Object.keys(CHUP)) { const a = truocNgoai[k], b = sauNgoai[k], ok = a.n === b.n && a.h === b.h; if (!ok && !BANG_SONG.has(k)) giong = false; in_(`  ${k}: ${a.n} → ${b.n} ${ok ? '✔' : '✘'}`) }
  in_('  (bảng · dòng phạm vi xoá: trong tx trước xoá → sau ' + (GHI ? 'COMMIT phải 0' : 'ROLLBACK phải = và cùng md5') + ' · tổng bảng trước tx → sau [bảng sống: app ghi đồng thời thì tổng có thể đổi, không tính là lỗi])')
  for (const k of KE) { const pred = B.find((x) => x[0] === k.t)[1]; const d = await md5Bang(k.t, pred); const ok = GHI ? d.n === 0 : d.n === k.del.n && d.h === k.del.h; if (!ok) giong = false; const a = truocTong[k.t], b = sauTongR[k.t]; in_(`  ${k.t}: ${k.del.n} → ${d.n} ${ok ? '✔' : '✘'} · tổng ${a.n} → ${b.n}${a.n === b.n && a.h === b.h ? ' =' : ' (đổi)'}`) }
  in_(`  dai_bdm_log: ${logTruoc.n} → ${logSau.n}`)
  if (!GHI) {
    if (logTruoc.n !== logSau.n) giong = false
    in_(giong ? '✔ DB KHÔNG ĐỔI: mọi dòng trong phạm vi xoá còn nguyên (đếm + md5), các ảnh chụp ngoài phạm vi và số dòng log trước = sau ROLLBACK.' : '✘ CẢNH BÁO: trước ≠ sau — kiểm ngay!')
    if (!giong) ma = 4
    in_('Đã ROLLBACK. --ghi chỉ sau khi Thùy gật.')
  } else if (!giong) { in_('✘ Ngoài phạm vi đổi sau COMMIT — kiểm ngay!'); ma = 4 }
} catch (e) { ma = 1; try { await c.query('rollback') } catch {} ; console.error('✘ LỖI — đã rollback:', e.message) } finally { await c.end() }
process.exit(ma)
