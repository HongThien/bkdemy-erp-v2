// ============================================================================
// nhap.mjs — NHẬP ngân hàng trắc nghiệm Hạt Mầm (KHTN, GV đã duyệt nội dung) vào kho khtn_cau_hoi THEO 1 KHỐI,
// đúng luồng kho 3 làn như Toán Đại (spec-luong-kho §5.3; Thùy 03/10: "KHTN làm như toán ấy"):
//   🟢 xanh  ⇒ câu vào DẠNG ERP đã ánh xạ, da_duyet=false (học thuật duyệt câu ở màn Duyệt)
//   🟡 vang  ⇒ câu ở DẠNG CHỜ + đề xuất 'dang_moi' (khtn_de_xuat)
//   🔴 do    ⇒ câu ở DẠNG CHỜ + đề xuất 'trao_doi' (câu hỏi cho học thuật)
//   ⚪ thieu_cd (bản đồ ERP chưa có chuyên đề) ⇒ BỎ QUA lượt này (chờ Thùy chốt), báo số câu.
// Ánh xạ dạng = file đề xuất (AI đề xuất theo câu mẫu — scripts/khtn-hatmam/de-xuat/<khối>-<môn>.json). Câu chèn bằng
// scripts/_kho_insert.mjs (mã <dạng>+STT, lọc trùng nội dung). Ảnh lên Storage kho-anh/hat_mam/<khối>/<tệp> (tên cố định ⇒ chạy lại ghi đè, không nhân bản).
// MẶC ĐỊNH CHẠY THỬ (ROLLBACK, không đẩy ảnh). --ghi mới đẩy ảnh + COMMIT. Câu nào của lượt đã có trong kho (ten_de_goc) ⇒ từ chối cả lượt.
// Chạy: node scripts/khtn-hatmam/nhap.mjs --khoi 7 --json <hatmam.json> --anh <thư mục trac-nghiem> --env-local <.env.local> [--ghi]
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { insertCauBatch } from '../_kho_insert.mjs'

const arg = (k, md) => { const i = process.argv.indexOf('--' + k); return i < 0 ? md : (process.argv[i + 1]?.startsWith('--') || i + 1 >= process.argv.length ? true : process.argv[i + 1]) }
const khoi = String(arg('khoi')); const GHI = arg('ghi', false) === true
const { cau } = JSON.parse(fs.readFileSync(arg('json'), 'utf8'))
const anhGoc = arg('anh')
process.loadEnvFile('.env'); process.loadEnvFile(arg('env-local'))
const LO = `hatmam-k${khoi}`
const MON_FILE = { 'Vật lí': 'ly', 'Hóa học': 'hoa', 'Sinh học': 'sinh' }

// 1) Ánh xạ: mã câu HM → { lan, erp_dang, nhom } từ 3 file đề xuất của khối
const nhomCuaCau = new Map(); const nhomDs = []
for (const [mon, f] of Object.entries(MON_FILE)) {
  const p = `scripts/khtn-hatmam/de-xuat/${khoi}-${f}.json`
  if (!fs.existsSync(p)) throw new Error('thiếu file đề xuất ' + p)
  const dx = JSON.parse(fs.readFileSync(p, 'utf8'))
  for (const d of dx.dang) {
    const cauDang = cau.filter((x) => x.khoi === khoi && x.mon === mon && x.dang === d.hm).map((x) => x.ma)
    for (const n of d.nhom) {
      const ds = n.cau === '*' ? cauDang : n.cau
      const g = { ...n, hm: d.hm, mon, cau: ds }
      nhomDs.push(g)
      for (const ma of ds) { if (nhomCuaCau.has(ma)) throw new Error(`câu ${ma} nằm ở 2 nhóm`); nhomCuaCau.set(ma, g) }
    }
  }
}
const cauKhoi = cau.filter((x) => x.khoi === khoi)
const thieu = cauKhoi.filter((x) => !nhomCuaCau.has(x.ma))
if (thieu.length) throw new Error(`${thieu.length} câu khối ${khoi} chưa có trong file đề xuất (vd ${thieu[0].ma})`)

// 2) Ảnh: hinh/<tệp> ⇒ URL public cố định
const SUPA = process.env.VITE_SUPABASE_URL
const urlAnh = (rel) => `${SUPA}/storage/v1/object/public/kho-anh/hat_mam/k${khoi}/${path.basename(rel)}`
const anhCan = new Set()
const doiAnh = (s) => (s ?? '').replace(/!\[([^\]]*)\]\((hinh\/[^)]+)\)/g, (_, alt, rel) => { anhCan.add(rel); return `![${alt}](${urlAnh(rel)})` })

// 3) Danh sách câu cần chèn (bỏ làn thieu_cd)
const vao = cauKhoi.filter((x) => nhomCuaCau.get(x.ma).lan !== 'thieu_cd')
const cauList = vao.map((x) => {
  const g = nhomCuaCau.get(x.ma)
  const viSao = x.vi_sao_sai.length ? '\n\nVì sao các phương án khác sai:\n' + x.vi_sao_sai.map((v) => `- ${v.pa}: ${v.ly_do}`).join('\n') : ''
  return {
    dang_chinh: g.lan === 'xanh' ? g.erp_dang : null, khoi,
    loai_cau: 'trac_nghiem', noi_dung: doiAnh(x.de) + (x.hinh_de.filter((h) => !x.de.includes(h)).map((h) => `\n![Hình](${urlAnh(h)})`).join('')),
    lua_chon: x.pa.map(doiAnh), dap_an: x.dap_an, loi_giai: doiAnh(x.loi_giai) + doiAnh(viSao),
    nguon: 'hat_mam', nguon_giai: 'nguoi', ten_de_goc: `Hạt Mầm · ${x.ma}`, _hm: x.ma, _muc: x.muc_do,
  }
})
for (const x of vao) for (const h of x.hinh_de) anhCan.add(h)

const db = new pg.Client({ connectionString: process.env.DATABASE_URL }); await db.connect()
await db.query('begin')
try {
  // Chặn theo TỪNG CÂU (không theo cả lô): lượt sau còn nhập được phần ⚪ khi bản đồ đã có chuyên đề, câu đã vào thì không bao giờ vào lại.
  const { rows: [daCo] } = await db.query(`select count(*)::int so, min(ten_de_goc) vd from khtn_cau_hoi where ten_de_goc = any($1::text[])`, [cauList.map((q) => q.ten_de_goc)])
  if (daCo.so) throw new Error(`${daCo.so} câu của lượt này đã có trong kho (vd ${daCo.vd}) — không nhập đè`)

  const { maCauList, trung } = await insertCauBatch({ client: db, subject: 'khtn', cauList })
  const maMoi = new Map(cauList.map((q, i) => [q._hm, maCauList[i]]))
  const trungHm = new Set(trung.map((t) => cauList[t.idx]._hm))
  const moi = cauList.filter((q) => !trungHm.has(q._hm))   // 1 lệnh cho cả lô (từng câu một ⇒ ~1.000 lượt khứ hồi, chạy thử khối 7 mất >5 phút)
  await db.query(`update khtn_cau_hoi c set muc_cau = v.muc from unnest($1::text[], $2::smallint[]) v(ma, muc) where c.ma_cau = v.ma`,
    [moi.map((q) => maMoi.get(q._hm)), moi.map((q) => q._muc)])

  // 4) Đề xuất cho làn vàng / đỏ (câu trùng kho cũ không đưa vào đề xuất — câu cũ đã có dạng)
  // Nhóm vàng CÙNG (chuyên đề, tên) = agent cố ý gom về 1 dạng mới ⇒ 1 đề xuất duy nhất (khối 7 nhập trước khi gộp ⇒ 11 thẻ cho 5 dạng).
  const gop = new Map()
  for (const g of nhomDs.filter((n) => n.lan === 'vang' || n.lan === 'do')) {
    const k = g.lan === 'vang' ? `v|${g.erp_chuyen_de}|${g.ten}` : `d|${g.hm}|${gop.size}`
    const cu = gop.get(k)
    if (!cu) gop.set(k, { ...g, ly_do: `[${g.hm}] ${g.ly_do}` })
    else gop.set(k, { ...cu, cau: [...cu.cau, ...g.cau], ly_do: `${cu.ly_do}\n[${g.hm}] ${g.ly_do}`, gan_nhat: cu.gan_nhat ?? g.gan_nhat })
  }
  let soDx = 0
  for (const g of gop.values()) {
    const ma = g.cau.filter((m) => !trungHm.has(m)).map((m) => maMoi.get(m))
    if (!ma.length) continue
    const lyDo = g.ly_do
    const { rows: [{ id }] } = await db.query(
      `insert into khtn_de_xuat (loai, khoi, ma_chuyen_de, ten, mo_ta_ngan, dang_gan_nhat, ly_do, lo, nguon, ai_model)
       values ($1, $2, $3, $4, $5, $6, $7, $8, 'ai', 'claude-opus-5-5') returning id`,
      [g.lan === 'vang' ? 'dang_moi' : 'trao_doi', khoi, g.erp_chuyen_de, g.lan === 'vang' ? g.ten : null,
       g.lan === 'vang' ? g.mo_ta_ngan : null, g.gan_nhat ?? null, lyDo, LO])
    await db.query(`insert into khtn_de_xuat_cau (de_xuat_id, ma_cau) select $1, unnest($2::text[])`, [id, ma])
    soDx++
  }

  // 5) Đo
  const dem = (lan) => vao.filter((x) => nhomCuaCau.get(x.ma).lan === lan).length
  const kq = (await db.query(`select count(*) filter (where right(dang_chinh, 6) = '000000')::int cho, count(*) filter (where right(dang_chinh, 6) <> '000000')::int vao_dang,
      count(*) filter (where muc_cau is not null)::int co_muc from khtn_cau_hoi where ten_de_goc like 'Hạt Mầm · K0' || $1 || '%'`, [khoi])).rows[0]
  console.log(`Lô ${LO}: câu khối ${cauKhoi.length} · nhập ${vao.length} (🟢 ${dem('xanh')} · 🟡 ${dem('vang')} · 🔴 ${dem('do')}) · ⚪ bỏ qua thiếu chuyên đề ${cauKhoi.length - vao.length}`)
  console.log(`  trùng kho cũ (không chèn): ${trung.length} · DB sau chèn: vào dạng ${kq.vao_dang} · dạng chờ ${kq.cho} · có mức câu ${kq.co_muc} · đề xuất ${soDx} · ảnh cần ${anhCan.size}`)

  if (!GHI) { console.log('CHẠY THỬ — rollback, không đẩy ảnh. Thêm --ghi để ghi thật.'); await db.query('rollback'); await db.end(); process.exit(0) }

  // 6) Đẩy ảnh (trước commit; tên cố định ⇒ chạy lại ghi đè)
  const sb = createClient(SUPA, process.env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } })
  const lop = `KHTN${khoi}`
  let up = 0
  for (const rel of anhCan) {
    const f = path.join(anhGoc, lop, rel)
    if (!fs.existsSync(f)) throw new Error('thiếu ảnh ' + f)
    const { error } = await sb.storage.from('kho-anh').upload(`hat_mam/k${khoi}/${path.basename(rel)}`, fs.readFileSync(f), { contentType: 'image/png', upsert: true })
    if (error) throw new Error(`đẩy ảnh ${rel}: ${error.message}`)
    up++
  }
  await db.query('commit')
  console.log(`ĐÃ GHI: ${up} ảnh · commit.`)
} catch (e) { await db.query('rollback'); throw e } finally { await db.end().catch(() => {}) }
