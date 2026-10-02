// ============================================================================
// cong_ghi_anh.mjs — CỔNG GHI kho Tiếng Anh: (trạm đọc + bên A + bên B) → quyết định từng câu → ghi DB.
//
//   node scripts/anh/cong_ghi_anh.mjs <thu_muc_nhap_unit> <thu_muc_kiem_unit> --de-goc "<tên tài liệu gốc>" [--ghi]
//
// Không có --ghi: CHẠY THỬ — tính quyết định, in báo cáo, ghi biên bản, chạy mọi INSERT trong 1 transaction rồi
// ROLLBACK (ảnh không upload). Có --ghi: upload ảnh biển báo + COMMIT.
//
// Luật "CHẮC CHẮN" (spec-anh-kho.md §2.1, CEO 02/10 "câu chắc chắn đưa thẳng vào kho, chưa chắc chờ duyệt"):
//   ① cấu trúc sạch (trạm đọc không cờ lỗi, có đáp án GV) ② bên A (KHÔNG thấy đáp án) ra đúng đáp án GV
//   ③ bên A không thấy phương án thứ 2 / đề không lỗi ④ A và B cùng 1 điểm kiến thức, cả hai chắc, hợp dạng đề
//   ⑤ trong phạm vi (A và B) và B không nghi đáp án GV.  Đủ 5 ⇒ da_duyet, duyet_nguon='ai', kiem_may='khop'.
//   Thiếu ⇒ chờ duyệt (kiem_may='nghi' + lý do); điểm kiến thức chưa thống nhất ⇒ điểm chờ E09000000 + dang_ai_de_xuat.
//   A và B CÙNG thấy ngoài phạm vi ⇒ KHÔNG nhập (ghi biên bản).
// Lô đã có câu cùng ten_de_goc ⇒ TỪ CHỐI (không nhập 2 lần).
// ============================================================================
import pg from 'pg'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const argv = process.argv.slice(2)
const [dirNhap, dirKiem] = argv.filter((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--de-goc')
const iDe = argv.indexOf('--de-goc')
const deGoc = iDe >= 0 ? argv[iDe + 1] : null
const GHI = argv.includes('--ghi')
if (!dirNhap || !dirKiem || !deGoc) {
  console.error('Dùng: node scripts/anh/cong_ghi_anh.mjs <thu_muc_nhap_unit> <thu_muc_kiem_unit> --de-goc "<tên tài liệu>" [--ghi]')
  process.exit(2)
}
const doc = (p) => JSON.parse(readFileSync(p, 'utf8'))
const unit = dirNhap.replace(/[\\/]+$/, '').split(/[\\/]/).pop()
const cau = doc(join(dirNhap, `${unit}.cau.json`))
const nguLieu = Object.fromEntries(doc(join(dirNhap, `${unit}.ngu_lieu.json`)).map((n) => [n.ref, n]))
const raA = Object.fromEntries(doc(join(dirKiem, 'ra_A.json')).map((x) => [x.ref, x]))
const raB = Object.fromEntries(doc(join(dirKiem, 'ra_B.json')).map((x) => [x.ref, x]))
// Bên A đã thấy ĐÚNG nội dung nào (đề + phương án + đoạn văn) — trạm đọc sửa sau khi kiểm thì kết quả kiểm không còn
// áp cho câu đó nữa ⇒ câu phải về chờ duyệt (không tin kết quả kiểm trên nội dung khác).
const daThayA = Object.fromEntries(doc(join(dirKiem, 'vao_A_khong_dap_an.json')).map((x) => [x.ref,
  JSON.stringify([x.noi_dung, Object.values(x.lua_chon), x.ngu_lieu?.noi_dung ?? null])]))
const vanTayHienTai = (c) => JSON.stringify([c.noi_dung, c.lua_chon, c.ngu_lieu ? (nguLieu[c.ngu_lieu]?.noi_dung ?? null) : null])
// Khoá trùng: cùng dạng đề + đề + phương án + đoạn văn (đã chuẩn hoá khoảng trắng/hoa thường)
const chuan = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
const khoaTrung = (dang, noiDung, luaChon, doan) => [dang, chuan(noiDung), (luaChon ?? []).map(chuan).join('|'), chuan(doan)].join('§')

function env() {
  const e = {}
  for (const f of ['.env', '.env.local']) {
    if (!existsSync(f)) continue
    for (const l of readFileSync(f, 'utf8').split(/\r?\n/)) {
      if (!l.includes('=') || l.trim().startsWith('#')) continue
      const i = l.indexOf('='); e[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '')
    }
  }
  return e
}
const E = env()

// Điểm kiến thức hợp lệ theo dạng đề (máy kiểm — nhân chứng thứ ba, không dựa AI)
const so = (k) => Number(k.split('-')[1])
function hopDang(dang, kp) {
  const [p] = kp.split('-')
  switch (dang) {
    case 'phat_am': return p === 'NA' && so(kp) <= 6
    case 'trong_am': return p === 'NA' && so(kp) >= 7
    case 'bien_bao': return kp === 'ĐH-01'
    case 'doc_hieu': return p === 'ĐH' && so(kp) >= 2
    case 'dien_cau_doan': return kp === 'VT-04'
    case 'sap_xep_doan': return kp === 'VT-03' || kp === 'VT-02'
    default: return ['NP', 'TV', 'GT'].includes(p) || kp === 'VT-01' || kp === 'VT-02'
  }
}

function quyetDinh(c) {
  const a = raA[c.ref], b = raB[c.ref]
  const lyDo = []
  if (!a || !b) return { loai: 'cho', lyDo: ['thiếu kết quả bên ' + (!a ? 'A' : 'B')], kp: null, deXuat: b?.kp ?? a?.kp ?? null }
  if (a.ngoai_pham_vi && b.ngoai_pham_vi) return { loai: 'bo', lyDo: ['ngoài phạm vi (A+B): ' + (b.ly_do_pham_vi || a.ly_do_pham_vi || '')] }
  if (daThayA[c.ref] !== vanTayHienTai(c)) lyDo.push('nội dung đã sửa sau khi kiểm (bên A kiểm trên bản cũ)')
  if (a.ngoai_pham_vi || b.ngoai_pham_vi) lyDo.push('một bên thấy ngoài phạm vi: ' + ((a.ngoai_pham_vi ? a.ly_do_pham_vi : b.ly_do_pham_vi) || ''))
  if (c.loi_cau_truc?.length) lyDo.push('cấu trúc: ' + c.loi_cau_truc.join(', '))
  if (!c.dap_an) lyDo.push('file GV không có đáp án')
  else if (a.dap_an !== c.dap_an) lyDo.push(`bên A ra ${a.dap_an ?? 'không làm được'}, GV ${c.dap_an}`)
  if (a.phuong_an_khac?.length) lyDo.push('bên A thấy cũng đúng: ' + a.phuong_an_khac.join(','))
  if (a.de_loi) lyDo.push('đề lỗi: ' + a.de_loi)
  if (b.nghi_dap_an) lyDo.push('bên B nghi đáp án GV: ' + (b.ly_do_nghi || ''))
  let kp = null
  // Hai lượt ĐỘC LẬP chọn trùng 1 điểm + máy thấy hợp dạng đề = 2 nhân chứng + 1 luật cứng. Cờ "chắc" tự khai của từng
  // lượt KHÔNG dùng làm điều kiện (đo Unit 1 02/10: 33 câu lệch thì phần lớn là A=B cùng mã nhưng tự khai "chưa chắc").
  if (a.kp && a.kp === b.kp && hopDang(c.dang_de, a.kp)) kp = a.kp
  else lyDo.push(`điểm kiến thức chưa thống nhất (A ${a.kp}${a.kp_tin_chac ? '' : '?'} · B ${b.kp}${b.kp_tin_chac ? '' : '?'})`)
  // đề xuất cho GV: ưu tiên điểm hai bên trùng, rồi điểm hợp dạng của B, rồi của A
  const deXuat = kp ?? [b.kp, a.kp].find((k) => k && hopDang(c.dang_de, k)) ?? b.kp ?? a.kp
  return { loai: lyDo.length ? 'cho' : 'chac', lyDo, kp, deXuat }
}

const c0 = new pg.Client({ connectionString: E.DATABASE_URL, statement_timeout: 60000 })
await c0.connect()
const kpRows = (await c0.query(`select ma_dang, ma_hien_thi from anh_ban_do where ma_hien_thi is not null`)).rows
const MA = Object.fromEntries(kpRows.map((r) => [r.ma_hien_thi, r.ma_dang]))
const daCo = (await c0.query(`select count(*)::int n from anh_cau_hoi where ten_de_goc = $1`, [deGoc])).rows[0].n
if (daCo) { console.error(`❌ Lô "${deGoc}" đã có ${daCo} câu trong kho — không nhập lần 2.`); process.exit(1) }

// Câu đã có trong kho Anh (mọi lô) — bỏ câu trùng y hệt, kể cả trùng trong chính lô này (vd U2-C020 ≡ C015)
const daCoKhoa = new Set((await c0.query(
  `select c.dang_de, c.noi_dung, c.lua_chon, coalesce(n.noi_dung, '') doan
     from anh_cau_hoi c left join anh_ngu_lieu n on n.ma_ngu_lieu = c.ngu_lieu where c.xoa_at is null`)).rows
  .map((r) => khoaTrung(r.dang_de, r.noi_dung, r.lua_chon, r.doan)))
const ketQua = cau.map((c) => {
  const k = khoaTrung(c.dang_de, c.noi_dung, c.lua_chon, c.ngu_lieu ? nguLieu[c.ngu_lieu]?.noi_dung : '')
  if (daCoKhoa.has(k)) return { c, q: { loai: 'bo', lyDo: ['trùng câu đã có (trong kho hoặc trong lô)'] } }
  daCoKhoa.add(k)
  return { c, q: quyetDinh(c) }
})
const dem = { chac: 0, cho: 0, bo: 0 }
for (const { q } of ketQua) dem[q.loai]++

// ── upload ảnh biển báo (chỉ khi --ghi) ──
const urlAnh = {}
async function upAnh(nl) {
  if (!nl.anh_file) return null
  if (!GHI) return `(chạy thử) ${nl.anh_file}`
  if (urlAnh[nl.ref]) return urlAnh[nl.ref]
  const sb = createClient(E.VITE_SUPABASE_URL, E.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
  const ext = extname(nl.anh_file).toLowerCase()
  const ct = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' }[ext] ?? 'application/octet-stream'
  const path = `nhap_kho_anh/${new Date().toISOString().slice(0, 7)}/${randomUUID()}${ext}`
  const { error } = await sb.storage.from('kho-anh').upload(path, readFileSync(join(dirNhap, nl.anh_file)), { contentType: ct, upsert: false })
  if (error) throw new Error('upload ảnh lỗi: ' + error.message)
  return (urlAnh[nl.ref] = sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl)
}

const bienBan = []
await c0.query('begin')
try {
  const maNL = {}
  for (const { c, q } of ketQua) {
    if (q.loai === 'bo') { bienBan.push({ ref: c.ref, quyet: 'bo', ly_do: q.lyDo }); continue }
    let ngu = null
    if (c.ngu_lieu) {
      if (!maNL[c.ngu_lieu]) {
        const n = nguLieu[c.ngu_lieu]
        const r = await c0.query(
          `insert into anh_ngu_lieu (loai, tieu_de, noi_dung, anh, nguon, ten_de_goc) values ($1,$2,$3,$4,'le',$5) returning ma_ngu_lieu`,
          [n.loai, n.tieu_de ?? null, n.noi_dung ?? '', await upAnh(n), deGoc])
        maNL[c.ngu_lieu] = r.rows[0].ma_ngu_lieu
      }
      ngu = maNL[c.ngu_lieu]
    }
    const chac = q.loai === 'chac'
    // Điểm kiến thức đã thống nhất (kể cả khi câu vướng lý do khác) ⇒ câu nằm ĐÚNG điểm, GV duyệt ngay dưới điểm đó (lọc 'nghi').
    // Chỉ khi 2 bên không thống nhất điểm mới về điểm chờ E09000000 (lọc 'chua_dang') kèm đề xuất.
    const dang = q.kp ? MA[q.kp] : 'E09000000'
    if (!dang) throw new Error(`Không thấy mã DB cho điểm ${q.kp} (${c.ref})`)
    const ghiChu = chac
      ? `Chắc chắn: A (không thấy đáp án) ra ${raA[c.ref].dap_an} = GV; không phương án thứ 2; A+B cùng ${q.kp}; trong phạm vi.`
      : q.lyDo.join(' · ')
    const r = await c0.query(
      `insert into anh_cau_hoi (dang_chinh, loai_cau, noi_dung, lua_chon, dap_an, nguon, nguon_giai, ten_de_goc,
         ngu_lieu, thu_tu_trong_ngu_lieu, dang_de, unit_sgk, da_duyet, duyet_nguon,
         kiem_may, kiem_may_at, kiem_may_boi, kiem_may_ghi, dang_ai_de_xuat, ai_model)
       values ($1,'trac_nghiem',$2,$3::jsonb,$4,'le','nguoi',$5,$6,$7,$8,$9,$10,$11,$12,now(),'claude_code',$13,$14,$15)
       returning ma_cau`,
      [dang, c.noi_dung, JSON.stringify(c.lua_chon), c.dap_an, deGoc, ngu, ngu ? c.thu_tu_trong_ngu_lieu : null,
       c.dang_de, c.unit_sgk, chac, chac ? 'ai' : null, chac ? 'khop' : 'nghi', ghiChu.slice(0, 1000),
       q.deXuat ? (MA[q.deXuat] ?? null) : null, 'claude-opus-5-5 (A: giải mù · B: gán nhãn)'])
    bienBan.push({ ref: c.ref, ma_cau: r.rows[0].ma_cau, quyet: q.loai, kp: q.kp, de_xuat: q.deXuat, ly_do: q.lyDo })
  }
  if (GHI) await c0.query('commit'); else await c0.query('rollback')
} catch (e) {
  await c0.query('rollback'); console.error('❌ ' + e.message + ' — ĐÃ ROLLBACK, DB không đổi.'); process.exit(1)
} finally { await c0.end() }

writeFileSync(join(dirKiem, GHI ? 'bien_ban_ghi.json' : 'bien_ban_thu.json'), JSON.stringify({ deGoc, dem, bienBan }, null, 1))
const lyDoDem = {}
for (const b of bienBan) for (const l of b.ly_do ?? []) { const k = l.split(':')[0].replace(/\(.*$/, '').trim(); lyDoDem[k] = (lyDoDem[k] ?? 0) + 1 }
console.log(`${GHI ? 'ĐÃ GHI' : 'CHẠY THỬ (đã rollback)'} — ${deGoc}`)
console.log(`  chắc chắn → kho: ${dem.chac} · chờ duyệt: ${dem.cho} · không nhập (ngoài phạm vi / trùng): ${dem.bo} · tổng ${cau.length}`)
console.log('  lý do chờ/bỏ:', lyDoDem)
