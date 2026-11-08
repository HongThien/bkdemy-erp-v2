// ghi-cay.mjs — dựng CÂY DẠNG MỚI K12 (theo ĐỀ THI, de-xuat/<CH>.json + noi-dung/<CH>.txt) vào bản đồ mới (dai_bdm_*). Chạy từ thư mục repo.
//   node kho-rules/dai/lo/k12-de/de-xuat/db/ghi-cay.mjs <CH…|tat-ca> [--nhom-moi "<tên trong JSON>=NCH…"] [--ghi] [--cho-thieu-noi-dung]
//     CH ∈ HS · VT · XS · SDT (LÀM LẠI: dựng cây mới cạnh cây cũ) · NHTP · PPTD (BỔ SUNG: chỉ thêm dạng `them` vào nhóm đã có)
//   MẶC ĐỊNH = CHẠY THỬ: mọi INSERT trong MỘT transaction rồi ROLLBACK, in so sánh cũ/mới + đếm dòng trước/sau để chứng minh DB không đổi.
//   --ghi  = COMMIT thật (chỉ khi Thùy đã gật). Khi đó: upload hình SVG (bucket kho-anh, thư mục bdm-k12/) → ghi → lưu bảng mã db/ma-moi-<CH>.json.
// RÀO:
//   • CHỈ INSERT. Không UPDATE/DELETE bản ghi cũ nào (gỡ cây cũ = B5, chờ Thùy gật theo Luật xoá). Việc trigger tự làm: xem CẢNH BÁO TRIGGER bên dưới.
//   • Chủ đề tìm bằng HAI nhân chứng: tên khớp mẫu + mã kỳ vọng (dò 03/11). Lệch ⇒ dừng.
//   • Kiểm khuôn lý thuyết/ví dụ bằng đúng bộ kiểm của kiem-moi.mjs (k12-hs/kiem.mjs). Còn 1 lỗi ⇒ không ghi gì.
//   • Chương làm lại: mọi nhóm/dạng trong JSON phải có khối nội dung (nhóm: lý thuyết; dạng: lý thuyết + ví dụ) — thiếu ⇒ dừng.
//   • Đã --ghi một chương (có db/ma-moi-<CH>.json) ⇒ chạy lại chương đó bị chặn (không đẻ cây đôi).
//   • NHTP/PPTD: nhóm "MỚI: …" phải được chỉ chuyên đề bằng --nhom-moi; chưa chỉ ⇒ các dạng đó CHỜ (không chèn), và --ghi bị chặn.
//   • Dạng chèn mà thiếu lý thuyết/ví dụ (NHTP/PPTD chưa có tệp nội dung) ⇒ --ghi bị chặn trừ khi thêm --cho-thieu-noi-dung
//     (luật 02/11: xuất lô phân dạng CHẶN dạng thiếu mô tả/LT/ví dụ).
// Id NCH/NNB/NDB do DEFAULT nextval của bảng cấp (giống màn Bản đồ mới — src/lib/kho/banDoMoi.ts); thu_tu do trigger _bdm_thu_tu cấp (nối sau cái cũ).
// ⚠ nextval KHÔNG rollback được: mỗi lần chạy thử làm nhảy sequence (mã bị bỏ qua, không cấp lại — vô hại theo luật mã gốc, nhưng có "lỗ" số).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createHash, randomUUID } from 'node:crypto'
import pg from 'pg'
import { bien } from '../../../../../../scripts/kho/cau-hinh.mjs'
import { docTep, kiemKhoi, DANG, NHOM } from '../../../k12-hs/kiem.mjs'
import { timHinh, veHinh } from '../../../k12-hs/ve.mjs'

const DIR = dirname(fileURLToPath(import.meta.url)) // …/de-xuat/db
const DX = join(DIR, '..') // …/de-xuat
const REPO = join(DX, '../../../../..')

// Hai nhân chứng cho chủ đề: mẫu tên + mã kỳ vọng (dò DB 03/11). nhanh = vùng phải khớp.
const CHUONG = {
  HS: { re: /đạo hàm.*đồ thị/i, ma: 'NCD00094', nhanh: 'toan', kieu: 'lam_lai' },
  VT: { re: /^vect/i, ma: 'NCD00096', nhanh: 'toan', kieu: 'lam_lai' },
  XS: { re: /xác suất có điều kiện/i, ma: 'NCD00097', nhanh: 'toan', kieu: 'lam_lai' },
  SDT: { re: /số đặc trưng/i, ma: 'NCD00098', nhanh: 'toan', kieu: 'lam_lai' },
  NHTP: { re: /nguyên hàm/i, ma: 'NCD00095', nhanh: 'toan', kieu: 'them' },
  PPTD: { re: /phương pháp to[aạ] độ/i, ma: 'NCD00099', nhanh: 'hgt', kieu: 'them' },
}

const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const CHO_THIEU = args.includes('--cho-thieu-noi-dung')
const nhomMoiO = {}
for (let i = 0; i < args.length; i++) if (args[i] === '--nhom-moi') { const [ten, ch] = args[++i].split('='); nhomMoiO[ten.trim()] = ch.trim() }
let dsCh = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--nhom-moi')
if (dsCh.includes('tat-ca')) dsCh = Object.keys(CHUONG)
if (!dsCh.length || dsCh.some((c) => !CHUONG[c])) { console.error('Dùng: node …/db/ghi-cay.mjs <HS|VT|XS|SDT|NHTP|PPTD|tat-ca…> [--nhom-moi "<tên>=NCH…"] [--ghi] [--cho-thieu-noi-dung]'); process.exit(2) }
const url = process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri
if (!url) { console.error('Thiếu chuỗi kết nối (DATABASE_URL_RW hoặc DATABASE_URL)'); process.exit(2) }

const in_ = (...a) => console.log(...a)
const ngan = (s, n = 70) => { const t = String(s ?? '').replace(/\s+/g, ' '); return t.length > n ? t.slice(0, n - 1) + '…' : t }

// ── 1. Đọc + kiểm khuôn (giống kiem-moi.mjs) ──────────────────────────────────────────────────────────────
function napKiem(ch, j) {
  for (const k of Object.keys(DANG)) delete DANG[k]
  for (const k of Object.keys(NHOM)) delete NHOM[k]
  if (j.chuyen_de) for (const cd of j.chuyen_de) for (const n of cd.nhom) { NHOM[n.id] = { id: n.id, ten: n.ten, dang: n.dang }; for (const d of n.dang) DANG[d.id] = { ten: d.ten, mo_ta: d.mo_ta, hinh: d.hinh || 'khong', nhom: n.id } }
  if (j.them) for (const d of j.them) DANG[d.id] = { ten: d.ten, mo_ta: d.mo_ta, hinh: d.hinh || 'khong', nhom: d.nhom }
  if (ch === 'PPTD') NHOM.MN1 = { id: 'MN1', ten: 'Cực trị trong không gian Oxyz' } // nhóm mới, mã tạm
}
function docChuong(ch) {
  const j = JSON.parse(readFileSync(join(DX, ch + '.json'), 'utf8'))
  const tepNd = join(DX, 'noi-dung', ch + '.txt')
  const coNd = existsSync(tepNd)
  const khoi = coNd ? docTep(readFileSync(tepNd, 'utf8')) : []
  napKiem(ch, j)
  const loi = [], canh = []
  for (const k of khoi) {
    const r = kiemKhoi(k)
    for (const l of r.loi) loi.push(`${k.id}: ${l}`)
    for (const l of r.canhBao) canh.push(`${k.id}: ${l}`)
  }
  const kNhom = new Map(khoi.filter((k) => k.la_nhom).map((k) => [k.id, k]))
  const kDang = new Map(khoi.filter((k) => !k.la_nhom).map((k) => [k.id, k]))
  if (CHUONG[ch].kieu === 'lam_lai') {
    if (!coNd) loi.push(`thiếu tệp noi-dung/${ch}.txt`)
    for (const cd of j.chuyen_de) for (const n of cd.nhom) {
      if (!kNhom.get(n.id)?.lt) loi.push(`${n.id}: nhóm thiếu lý thuyết trong noi-dung/${ch}.txt`)
      for (const d of n.dang) { const k = kDang.get(d.id); if (!k?.lt || !k?.vd) loi.push(`${d.id}: dạng thiếu ${!k?.lt ? 'lý thuyết' : ''}${!k?.lt && !k?.vd ? ' + ' : ''}${!k?.vd ? 'ví dụ' : ''}`) }
    }
  }
  return { j, coNd, kNhom, kDang, loi, canh }
}

// ── 2. Hình [[HINH {json}]] → SVG → ![](url) (giống k11/ban-do/ghi2.mjs) ──────────────────────────────────
let sb = null
const daUp = new Map()
async function nhungHinh(ma, text) {
  if (!text) return { text, so: 0 }
  let kq = text, so = 0
  for (const h of timHinh(text)) {
    const svg = veHinh(h.sp)
    const bam = createHash('sha1').update(svg).digest('hex').slice(0, 12)
    let u = daUp.get(bam)
    if (!u) {
      const path = `bdm-k12/${ma.replace(/[^A-Za-z0-9._-]/g, '_')}_${bam}_${randomUUID().slice(0, 6)}.svg`
      if (!GHI) u = `dry://kho-anh/${path}`
      else {
        const { error } = await sb.storage.from('kho-anh').upload(path, Buffer.from(svg), { contentType: 'image/svg+xml', upsert: false })
        if (error) throw new Error(`upload ${path}: ${error.message}`)
        u = sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
      }
      daUp.set(bam, u)
    }
    kq = kq.replace(h.raw, `![](${u})`); so++
  }
  return { text: kq, so }
}

// ── 3. Ảnh chụp DB để chứng minh "không đổi" ───────────────────────────────────────────────────────────────
const CHU_DE_K12 = Object.values(CHUONG).map((c) => c.ma)
async function anhChup(c) {
  const dem = (await c.query(`select
     (select count(*) from dai_bdm_chuyen_de)::int chuyen_de, (select count(*) from dai_bdm_o)::int o,
     (select count(*) from dai_bdm_nhom)::int nhom, (select count(*) from dai_bdm_dang_bai)::int dang,
     (select count(*) from dai_bdm_log)::int log, (select coalesce(max(id),0) from dai_bdm_log)::bigint log_max,
     (select md5(coalesce(string_agg(n.id||n.ten||n.ly_thuyet||n.updated_at::text, ',' order by n.id),'')) from dai_bdm_nhom n where n.chu_de_id = any($1)) bam_nhom,
     (select md5(coalesce(string_agg(d.id||d.ten||d.ly_thuyet||d.vi_du||d.updated_at::text, ',' order by d.id),'')) from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id = any($1)) bam_dang,
     (select md5(coalesce(string_agg(o.chu_de_id||o.chuyen_de_id||o.thu_tu, ',' order by o.chu_de_id, o.chuyen_de_id),'')) from dai_bdm_o o where o.chu_de_id = any($1)) bam_o`, [CHU_DE_K12])).rows[0]
  const seq = (await c.query(`select (select last_value from dai_bdm_chuyen_de_seq) ch, (select last_value from dai_bdm_nhom_seq) nb, (select last_value from dai_bdm_dang_bai_seq) db`)).rows[0]
  return { dem, seq }
}

// ── chạy ────────────────────────────────────────────────────────────────────────────────────────────────────
const doc = {}
let loiTong = []
for (const ch of dsCh) {
  const d = docChuong(ch); doc[ch] = d
  if (GHI && existsSync(join(DIR, `ma-moi-${ch}.json`))) d.loi.push(`đã --ghi trước đây (db/ma-moi-${ch}.json) — chặn để không đẻ cây đôi`)
  in_(`[kiểm khuôn] ${ch}: ${d.coNd ? `noi-dung/${ch}.txt ${d.kNhom.size} nhóm · ${d.kDang.size} dạng` : 'KHÔNG có tệp nội dung'} · lỗi ${d.loi.length} · cảnh báo ${d.canh.length}`)
  for (const l of d.loi) in_('   ✖ ' + l)
  for (const l of d.canh) in_('   ⚠ ' + l)
  loiTong = loiTong.concat(d.loi.map((l) => `${ch} ${l}`))
}
if (loiTong.length) { console.error(`❌ Còn ${loiTong.length} lỗi — KHÔNG mở transaction, không ghi gì.`); process.exit(3) }

if (GHI) {
  const env = Object.fromEntries(readFileSync(join(REPO, '.env.local'), 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
  const { createClient } = await import('@supabase/supabase-js')
  sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
}

const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
let ma = 0
const bangMa = {}
try {
  const truoc = await anhChup(c)
  in_(`\n[trước] chuyen_de ${truoc.dem.chuyen_de} · o ${truoc.dem.o} · nhom ${truoc.dem.nhom} · dang ${truoc.dem.dang} · log ${truoc.dem.log} · seq NCH ${truoc.seq.ch} NNB ${truoc.seq.nb} NDB ${truoc.seq.db}`)
  await c.query('begin')
  await c.query(`set local statement_timeout = '120s'`)
  const chan = [] // lý do chặn --ghi phát hiện trong lúc chạy
  for (const ch of dsCh) {
    const { j, kNhom, kDang } = doc[ch]
    const cfg = CHUONG[ch]
    const bm = (bangMa[ch] = { chu_de: null, chuyen_de: {}, nhom: {}, dang: {} })
    // chủ đề — hai nhân chứng
    const { rows: cds } = await c.query(`select id, ten, nhanh from dai_bdm_chu_de where khoi = '12'`)
    const khop = cds.filter((x) => cfg.re.test(x.ten))
    if (khop.length !== 1 || khop[0].id !== cfg.ma || khop[0].nhanh !== cfg.nhanh) throw new Error(`${ch}: chủ đề không khớp hai nhân chứng (tên ~ ${cfg.re} → ${khop.map((x) => x.id + '/' + x.nhanh).join(',') || 'không có'}; kỳ vọng ${cfg.ma}/${cfg.nhanh})`)
    const cdId = khop[0].id; bm.chu_de = cdId
    const cu = (await c.query(`select (select count(*) from dai_bdm_o where chu_de_id=$1)::int ch, (select count(*) from dai_bdm_nhom where chu_de_id=$1)::int nb,
       (select count(*) from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id=$1)::int db`, [cdId])).rows[0]
    in_(`\n══ ${ch} → ${cdId} «${khop[0].ten}» (vùng ${cfg.nhanh}) — CŨ: ${cu.ch} chuyên đề · ${cu.nb} nhóm · ${cu.db} dạng`)
    let nCh = 0, nNb = 0, nDb = 0, nHinh = 0, thieuNd = [], hiem = [], khongMucDo = 0
    const themDang = async (nhomId, d, k) => {
      const lt = k?.lt ?? '', vdRaw = k?.vd ?? ''
      const vd = await nhungHinh(`${ch}_${d.id}`, vdRaw); nHinh += vd.so
      if (!lt || !vdRaw) thieuNd.push(d.id)
      if (d.hiem) hiem.push(d.id)
      if (d.muc_do == null) khongMucDo++
      const r = await c.query(`insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, vi_du, muc_do) values ($1,$2,$3,$4,$5,$6) returning id, thu_tu`,
        [nhomId, d.ten.trim(), (d.mo_ta ?? '').trim(), lt, vd.text, d.muc_do ?? null])
      bm.dang[d.id] = r.rows[0].id; nDb++
      return r.rows[0]
    }
    if (cfg.kieu === 'lam_lai') {
      const tenCu = new Set((await c.query(`select cd.ten from dai_bdm_o o join dai_bdm_chuyen_de cd on cd.id=o.chuyen_de_id where o.chu_de_id=$1`, [cdId])).rows.map((x) => x.ten.trim().toLowerCase()))
      for (const cd of j.chuyen_de) {
        const r1 = await c.query(`insert into dai_bdm_chuyen_de (ten, mo_ta) values ($1,$2) returning id`, [cd.ten.trim(), (cd.mo_ta ?? '').trim()])
        const chId = r1.rows[0].id; bm.chuyen_de[cd.id] = chId; nCh++
        const r2 = await c.query(`insert into dai_bdm_o (chu_de_id, chuyen_de_id) values ($1,$2) returning thu_tu`, [cdId, chId])
        in_(`  + chuyên đề ${cd.id} → ${chId} (ô thu_tu ${r2.rows[0].thu_tu}) «${ngan(cd.ten, 60)}»${tenCu.has(cd.ten.trim().toLowerCase()) ? '  ⚠ TRÙNG TÊN chuyên đề cũ — cùng hiện hai cái tới B5' : ''}`)
        for (const n of cd.nhom) {
          const r3 = await c.query(`insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, ly_thuyet) values ($1,$2,$3,$4,$5) returning id`, [cdId, chId, n.ten.trim(), (n.mo_ta ?? '').trim(), kNhom.get(n.id)?.lt ?? ''])
          const nbId = r3.rows[0].id; bm.nhom[n.id] = nbId; nNb++
          const ds = []
          for (const d of n.dang) { await themDang(nbId, d, kDang.get(d.id)); ds.push(`${d.id}→${bm.dang[d.id]}${d.hiem ? '(hiếm)' : ''}`) }
          in_(`      + nhóm ${n.id} → ${nbId} «${ngan(n.ten, 50)}» · ${n.dang.length} dạng: ${ds.join(' ')}`)
        }
      }
    } else {
      const nhomCu = new Map((await c.query(`select id, ten, chuyen_de_id from dai_bdm_nhom where chu_de_id=$1`, [cdId])).rows.map((x) => [x.id, x]))
      const oCu = new Set((await c.query(`select chuyen_de_id from dai_bdm_o where chu_de_id=$1`, [cdId])).rows.map((x) => x.chuyen_de_id))
      const nhomTao = {}
      for (const d of j.them) {
        let nbId = d.nhom
        if (/^NNB\d{5}$/.test(d.nhom)) {
          const nb = nhomCu.get(d.nhom)
          if (!nb) throw new Error(`${ch} ${d.id}: nhóm ${d.nhom} không thuộc chủ đề ${cdId}`)
          const trung = (await c.query(`select id from dai_bdm_dang_bai where nhom_id=$1 and lower(btrim(ten))=lower(btrim($2))`, [d.nhom, d.ten])).rows[0]
          if (trung) { in_(`  = ${d.id} đã có dạng cùng tên ${trung.id} trong ${d.nhom} — BỎ QUA`); continue }
        } else {
          const ten = d.nhom.replace(/^MỚI:\s*/, '').trim()
          if (!nhomTao[d.nhom]) {
            const chId = nhomMoiO[d.nhom] ?? nhomMoiO[ten]
            if (!chId) { in_(`  ⏸ ${d.id} «${ngan(d.ten, 60)}» — nhóm MỚI «${ten}» CHƯA có chuyên đề (thêm --nhom-moi "${d.nhom}=NCH…") — CHỜ, không chèn`); chan.push(`${ch} ${d.id}: nhóm mới chưa chọn chuyên đề`); continue }
            let chDung = chId
            if (/^NEW:/.test(chId)) { // Thùy 03/11: tạo CHUYÊN ĐỀ MỚI cho nhóm này (vd "Bài toán cực trị")
              const tenCd = chId.slice(4).trim()
              const r1 = await c.query(`insert into dai_bdm_chuyen_de (ten, mo_ta) values ($1,$2) returning id`, [tenCd, ''])
              chDung = r1.rows[0].id; nCh++
              const r2 = await c.query(`insert into dai_bdm_o (chu_de_id, chuyen_de_id) values ($1,$2) returning thu_tu`, [cdId, chDung])
              bm.chuyen_de[tenCd] = chDung
              in_(`  + chuyên đề MỚI «${tenCd}» → ${chDung} (ô thu_tu ${r2.rows[0].thu_tu})`)
            } else if (!oCu.has(chId)) throw new Error(`${ch}: --nhom-moi chỉ ${chId}, không phải chuyên đề của ${cdId}`)
            const ltNhom = kNhom.get('MN1')?.lt ?? '' // nhóm mới duy nhất hiện nay: «Cực trị trong không gian Oxyz» (mã tạm MN1)
            const r = await c.query(`insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, ly_thuyet) values ($1,$2,$3,$4) returning id, thu_tu`, [cdId, chDung, ten, ltNhom])
            nhomTao[d.nhom] = r.rows[0].id; bm.nhom[d.nhom] = r.rows[0].id; nNb++
            in_(`  + nhóm MỚI «${ten}» → ${r.rows[0].id} trong ${chDung} (thu_tu ${r.rows[0].thu_tu}) — lý thuyết nhóm ${ltNhom ? ltNhom.length + ' ký tự' : 'CHƯA có'}`)
          }
          nbId = nhomTao[d.nhom]
        }
        const r = await themDang(nbId, d, kDang.get(d.id))
        in_(`  + dạng ${d.id} → ${r.id} vào ${nbId} (thu_tu ${r.thu_tu}) «${ngan(d.ten, 60)}»${d.hiem ? ' (hiếm)' : ''}${d.so_cau != null ? ` · ${d.so_cau} câu đề` : ''}`)
      }
      if (j.dang_cu_khong_xuat_hien?.length) in_(`  ℹ dạng cũ không xuất hiện trong đề (GIỮ NGUYÊN, không đụng): ${j.dang_cu_khong_xuat_hien.map((x) => x.ma).join(', ')}`)
      if (j.nghi_gan_nham?.length) in_(`  ℹ ${j.nghi_gan_nham.length} câu "nghi gán nhầm" trong JSON — KHÔNG xử lý ở đây (thuộc B3/B4)`)
    }
    in_(`  ⇒ ${ch} SẼ THÊM: ${nCh} chuyên đề · ${nNb} nhóm · ${nDb} dạng · ${nHinh} hình SVG${hiem.length ? ` · hiếm ${hiem.length}: ${hiem.join(',')}` : ''}`)
    in_(`     muc_do: JSON không có ⇒ NULL cho ${khongMucDo}/${nDb} dạng (CHECK 1–5 cho phép NULL; chưa có nguồn mức độ)`)
    if (thieuNd.length) { in_(`     ⚠ ${thieuNd.length} dạng CHÈN mà THIẾU lý thuyết/ví dụ: ${thieuNd.join(',')} — xuất lô phân dạng (B4) sẽ CHẶN các dạng này`); if (!CHO_THIEU) chan.push(`${ch}: ${thieuNd.length} dạng thiếu nội dung`) }
    if (j.bo_moi?.length) in_(`     ℹ bo_moi: ${j.bo_moi.length} mô tả câu không lập dạng (ghi trong JSON, không ghi DB)`)
    if (j.gop?.length) in_(`     ℹ gop: ${j.gop.map((g) => `${g.ma}→${g.vao}`).join(', ')} (chỉ là ghi chú đối ứng, không ghi DB)`)
  }
  // ── trigger đã làm gì trong transaction này
  const lg = (await c.query(`select bang, hanh_dong, count(*)::int n from dai_bdm_log where id > $1 group by 1,2 order by 1,2`, [truoc.dem.log_max])).rows
  in_(`\n[CẢNH BÁO TRIGGER] dai_bdm_log sẽ có thêm: ${lg.map((x) => `${x.bang}/${x.hanh_dong} ${x.n}`).join(' · ') || '(không)'} — actor = jwt_uid() = NULL khi chạy bằng script`)
  const bump = (await c.query(`select count(*)::int n from dai_bdm_nhom where chu_de_id = any($1) and updated_at >= (select now()) and id <> all($2)`, [CHU_DE_K12, Object.values(bangMa).flatMap((b) => Object.values(b.nhom))])).rows[0].n
  in_(`  _bdm_bump_nhom: ${bump} nhóm CŨ được bump updated_at (do chèn dạng vào nhóm cũ — không đổi nội dung, log bỏ qua vì chỉ đổi updated_at)`)
  in_(`  _bdm_thu_tu: thu_tu ô/nhóm/dạng mới = max+1 ⇒ cây mới hiện SAU cây cũ trong cùng chủ đề cho tới B5`)
  in_(`  trg_bdm_chu_de_khoa_vung: KHÔNG kích hoạt (script không INSERT/UPDATE dai_bdm_chu_de)`)

  if (GHI && chan.length) throw new Error('chặn --ghi: ' + chan.join(' · '))
  await c.query(GHI ? 'commit' : 'rollback')
  const sau = await anhChup(c)
  in_(`\n[sau ${GHI ? 'COMMIT' : 'ROLLBACK'}] chuyen_de ${sau.dem.chuyen_de} · o ${sau.dem.o} · nhom ${sau.dem.nhom} · dang ${sau.dem.dang} · log ${sau.dem.log} · seq NCH ${sau.seq.ch} NNB ${sau.seq.nb} NDB ${sau.seq.db}`)
  if (!GHI) {
    const giong = ['chuyen_de', 'o', 'nhom', 'dang', 'log', 'bam_nhom', 'bam_dang', 'bam_o'].every((k) => String(truoc.dem[k]) === String(sau.dem[k]))
    in_(giong ? '✔ DB KHÔNG ĐỔI: đếm dòng + vân tay md5 cây 6 chủ đề K12 trước = sau.' : '✘ CẢNH BÁO: trước ≠ sau — kiểm ngay!')
    in_(`  (sequence nhảy: NCH +${sau.seq.ch - truoc.seq.ch} · NNB +${sau.seq.nb - truoc.seq.nb} · NDB +${sau.seq.db - truoc.seq.db} — nextval không rollback, mã đó bỏ trống vĩnh viễn)`)
    if (!giong) ma = 4
    if (chan.length) in_(`  ⚠ Nếu chạy --ghi bây giờ sẽ bị CHẶN: ${chan.join(' · ')}`)
    in_('Đã ROLLBACK. Thêm --ghi để ghi thật (chỉ sau khi Thùy gật).')
  } else {
    for (const ch of dsCh) writeFileSync(join(DIR, `ma-moi-${ch}.json`), JSON.stringify({ luc: new Date().toISOString(), ...bangMa[ch] }, null, 1))
    in_('✔ Đã ghi. Bảng mã logic → DB: db/ma-moi-<CH>.json (dùng cho B3/B4).')
  }
} catch (e) { ma = 1; try { await c.query('rollback') } catch {} ; console.error('✘ LỖI — đã rollback:', e.message) } finally { await c.end() }
process.exit(ma)
