// ============================================================================
// ghi-clc6.mjs — đưa 58 đề thi vào lớp 6 CLC (kho-rules/dai/lo/clc6) vào ERP, khối 5T (Thùy 15/11 + 21/11).
//
//   node scripts/kho/de-thi/ghi-clc6.mjs [--de "LTV 2018,CG 2022"] [--ra <thư mục làm việc>] [--ghi]
//
// Đọc de-da-sua.json (đề đã sửa theo PDF) + <mã>.soan.json (đáp số, lời giải, sơ đồ) ⇒ dựng thư mục làm việc từng đề
// (de.json + img/) đúng khuôn của ghi.mjs rồi gọi ghi.mjs:
//   · đề ĐỦ hình  ⇒ ghi.mjs đầy đủ: câu → dai_cau_hoi (khối 5T, dạng chờ, da_duyet=false) + đề → Kho đề thi (tai_lieu loai='de_thi')
//   · đề THIẾU hình đề (ảnh gốc nằm trong file Word chưa có trên máy) ⇒ ghi.mjs --chi-cau: chỉ ghi các câu đủ hình; câu thiếu hình
//     KHÔNG ghi (spec-giai-bai §A8: thà thiếu còn hơn câu mất hình), liệt kê trong báo cáo; đề dựng sau khi có hình.
// Không --ghi: chạy thử, mọi thứ ROLLBACK. Không đụng DB ngoài ghi.mjs.
//
// Sơ đồ: soan.so_do_mo_ta → máy vẽ SVG (so-do-doan-thang.mjs) ⇒ anh_dap_an. 6 sơ đồ LỘ SỐ trung gian (Thùy 21/11) sửa ở SUA_SO_DO bên dưới.
// Cờ: ghi_chu_nghi / đề sửa theo suy luận ⇒ canh_bao "CHƯA CHẮC: …" ⇒ ghi.mjs đặt kiem_may='nghi' (da_duyet=false, hiện ở màn duyệt).
// Câu bỏ có chủ ý: q.bo (LTV 2024·19, 20; NTT 2019·1). Câu có trong đề mà không có trong soan: bỏ + liệt kê.
// ============================================================================
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { veSoDo } from '../so-do-doan-thang.mjs'

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const D = path.join(GOC, 'kho-rules/dai/lo/clc6'), HD = path.join(GOC, 'kho-rules/dai/hinh-de')
const a = process.argv.slice(2)
const lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const GHI = a.includes('--ghi')
const RA = lay('--ra') ?? path.join(os.tmpdir(), 'clc6-ghi')
const MODEL = lay('--model-lam') ?? 'claude-sonnet-5-5'
const de = JSON.parse(fs.readFileSync(path.join(D, 'de-da-sua.json'), 'utf8'))
const chon = lay('--de') ? lay('--de').split(',').map((s) => s.trim()) : de.map((d) => d.ma)

// ── 6 sơ đồ lộ số: bỏ nhãn / điểm mang số trung gian (đáp số hoặc bước giữa). Vị trí điểm chỉ để đúng tỉ lệ khi KHÔNG đặt tên/nhãn lộ.
const SUA_SO_DO = {
  'LTV 2019 · 9': { loai: 'chuyen_dong', tieu_de: 'Hai người đi ngược chiều', diem: [{ ten: 'A', x: 0 }, { ten: 'B', x: 160 }],
    di: [{ tu: 0, den: 60, nhan: '40 km/giờ' }, { tu: 160, den: 100, nhan: '30 km/giờ' }], khoang: [{ tu: 0, den: 160, nhan: '160 km' }] },
  'ARC 2020-NC · 20': { loai: 'chuyen_dong', diem: [{ ten: 'A', x: 0 }, { ten: 'B', x: 132 }],
    di: [{ tu: 0, den: 35, nhan: 'An 35 km/giờ' }, { tu: 132, den: 90, nhan: 'Chi 50 km/giờ' }], khoang: [{ tu: 0, den: 132, nhan: '132 km' }] },
  'TX 2024 · 16': { loai: 'chuyen_dong', diem: [{ ten: 'A', x: 0 }, { ten: 'B', x: 12 }],
    di: [{ tu: 0, den: 4, nhan: 'xe 1' }, { tu: 12, den: 8, nhan: 'xe 2' }], khoang: [{ tu: 0, den: 12, nhan: 'Cả quãng đường AB (coi là 1)' }] },
  'NTT 2020 · P1.5': { loai: 'chuyen_dong', tieu_de: 'Đầu tàu vào hầm → đuôi tàu ra khỏi hầm', diem: [{ ten: 'Đầu hầm', x: 0 }, { ten: 'Cuối hầm', x: 1840 }],
    vat: [{ tu: -300, den: 0, nhan: 'Đoàn tàu', kieu: 'tau' }, { tu: 0, den: 1840, nhan: 'Hầm 1840 m', kieu: 'cau' }],
    di: [{ tu: -300, den: 1840, nhan: 'Đuôi tàu: 40 km/giờ, 3 phút' }], khoang: [{ tu: -300, den: 0, nhan: '? m' }, { tu: 0, den: 1840, nhan: '1840 m' }] },
  'NN 2024-TT3 · P1.4': [{ tieu_de: 'Lúc trước', gia_tri_phan: 7, hang: [{ nhan: 'Tuổi anh', phan: 2 }, { nhan: 'Tuổi em', phan: 1 }] },
    { tieu_de: 'Hiện nay', gia_tri_phan: 7, hang: [{ nhan: 'Tuổi em', phan: 2 }, { nhan: 'Tuổi anh', phan: 3 }], tong: '35 tuổi', dau_hoi: ['Tuổi em'] }],
  'AMS 2020 · 15': { loai: 'chuyen_dong', tieu_de: 'Quãng đường từ A đến B', diem: [{ ten: 'A', x: 0 }, { ten: 'B', x: 10 }], di: [], khoang: [{ tu: 0, den: 10, nhan: '10 km' }] },
}

const MAN_HINH = fs.existsSync(path.join(HD, 'CLC6.json')) ? JSON.parse(fs.readFileSync(path.join(HD, 'CLC6.json'), 'utf8')) : {}
const KIEU = { dien: 'tra_loi_ngan', tu_luan: 'tu_luan', trac_nghiem: 'trac_nghiem', dung_sai: 'dung_sai' }
const slug = (s) => s.replace(/ · /g, '-').replace(/[ .]/g, '-')
const bao = { de: [], cau_ghi: 0, bo_soan: [], bo_cuoi: [], thieu_hinh: [], loi_dang: [], so_do: 0, nghi: 0 }

function menhDe(q, dapAn) {
  const dong = [...q.noi_dung.matchAll(/^\s*([a-d])\)\s*(.+)$/gm)].map((m) => ({ k: m[1], t: m[2].trim() }))
  const ds = Object.fromEntries([...String(dapAn).matchAll(/([a-d])\)\s*(Đúng|Sai)/g)].map((m) => [m[1], m[2] === 'Đúng' ? 'D' : 'S']))
  if (dong.length < 2 || dong.some((x) => !ds[x.k])) return null
  return dong.map((x) => ({ noi_dung: x.t, dap_an: ds[x.k], dang: null, loi_giai: null }))
}

for (const ma of chon) {
  const d = de.find((x) => x.ma === ma)
  if (!d) { console.error('không có đề', ma); continue }
  const f = path.join(D, ma.replace(/ /g, '-') + '.soan.json')
  const sj = JSON.parse(fs.readFileSync(f, 'utf8'))
  const soan = new Map((Array.isArray(sj) ? sj : sj.cau).map((x) => [x.ma_nguon, x]))
  const dir = path.join(RA, slug(ma)), img = path.join(dir, 'img')
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(img, { recursive: true })
  const cauRa = [], thieu = []
  for (const q of d.cau) {
    const s = soan.get(q.ma_nguon)
    if (q.bo) { bao.bo_cuoi.push(q.ma_nguon); continue }
    if (!s) { bao.bo_soan.push(q.ma_nguon); continue }
    // hình đề: ảnh gốc trong Word (imageNN.png) KHÔNG có trên máy — chỉ dùng được hình đã dựng sẵn ở kho-rules/dai/hinh-de
    const anh = []
    const tep = [...(q.hinh_bu ?? []).map((h) => h.tep ?? h), ...(q.hinh ?? []).map(() => `CLC6-${slug(q.ma_nguon)}.png`)]
    let mat = false
    for (const t of tep.slice(0, 1)) { const p = path.join(HD, t); if (fs.existsSync(p)) { fs.copyFileSync(p, path.join(img, t)); anh.push(t) } else mat = true }
    if ((q.hinh ?? []).length > 1 || (q.hinh_bu ?? []).length > 1) mat = mat || tep.length > anh.length
    if (mat) { thieu.push(q.ma_nguon); bao.thieu_hinh.push(q.ma_nguon); continue }
    // sơ đồ máy vẽ
    const anhGiai = []
    const sd = SUA_SO_DO[q.ma_nguon] ?? s.so_do_mo_ta
    if (sd) {
      try { const nm = `${slug(q.ma_nguon)}-sd.svg`; fs.writeFileSync(path.join(img, nm), veSoDo(sd)); anhGiai.push(nm); bao.so_do++ }
      catch (e) { thieu.push(q.ma_nguon); bao.loi_dang.push(`${q.ma_nguon}: sơ đồ máy từ chối — ${e.message}`); continue }
    }
    const loai = KIEU[q.kieu]
    const base = { phan: 0, so: q.so, ma_nguon: q.ma_nguon, nhan: `Câu ${q.so}`, kho: 'dai', loai_cau: loai, noi_dung: q.noi_dung,
      dap_an: s.dap_an, loi_giai: s.loi_giai, anh, anh_giai: anhGiai, diem: q.diem ?? null, canh_bao: [],
      ten_de_goc: `Đề thi vào lớp 6 CLC · ${q.ma_nguon}` }
    // nhãn nguồn hình (spec-kho-cau-hoi Q10): manifest hinh-de/CLC6.json — cach 've_lai' (kèm ma_loi a–f) | 've_moi' | còn lại = ảnh gốc
    const mh = MAN_HINH[q.ma_nguon]
    if (anh.length && mh?.cach === 've_lai') base.anh_nguon = { nguon: 've_lai', ma_loi: mh.ma_loi ?? 'a' }
    else if (anh.length && mh?.cach === 've_moi') base.anh_nguon = { nguon: 've_moi', ma_loi: null }
    if (loai === 'trac_nghiem') {
      // de.json lưu phương án dạng {A,B,C,D}; ghi.mjs cần mảng 4 phần tử theo thứ tự A–D
      const lc = Array.isArray(q.lua_chon) ? q.lua_chon : ['A', 'B', 'C', 'D'].map((k) => q.lua_chon?.[k])
      if (lc.length !== 4 || lc.some((x) => !x)) { bao.loi_dang.push(`${q.ma_nguon}: trắc nghiệm không đủ 4 phương án`); continue }
      base.lua_chon = lc
      base.dap_an = String(s.dap_an).trim().toUpperCase()
    }
    if (loai === 'dung_sai') {
      const md = menhDe(q, s.dap_an)
      if (!md) { bao.loi_dang.push(`${q.ma_nguon}: không tách được mệnh đề Đúng/Sai`); continue }
      base.menh_de = md; base.dap_an = null
    }
    if (s.ghi_chu_nghi) base.canh_bao.push('CHƯA CHẮC: ' + s.ghi_chu_nghi)
    if (q.noi_dung_goc && q.ghi_chu_duyet) base.canh_bao.push(`${q.bang_chung === 'pdf' ? '' : 'CHƯA CHẮC: '}Đề đã sửa so với bản Word (${q.bang_chung ?? 'không rõ nguồn'}): ${q.ghi_chu_duyet}`)
    if (q.luu_y_soan) base.canh_bao.push('Lưu ý: ' + q.luu_y_soan)
    if (base.canh_bao.some((c) => /^CHƯA CHẮC/.test(c))) bao.nghi++
    cauRa.push({ ...base, _phan_goc: q.phan })
  }
  // phần: đề có phần ⇒ theo đề (stt, kieu); đề không có ⇒ gom theo kiểu liên tiếp
  let phan = []
  if (d.phan.length) {
    phan = d.phan.map((p) => ({ thu_tu: p.stt, ten: p.ten, dang_thuc: KIEU[p.kieu] ?? 'tra_loi_ngan', diem_moi_cau: null }))
    for (const c of cauRa) c.phan = c._phan_goc
  } else {
    let cur = null
    for (const c of cauRa) {
      if (!cur || cur.dang_thuc !== c.loai_cau) { cur = { thu_tu: phan.length + 1, ten: { tra_loi_ngan: 'Điền đáp số', tu_luan: 'Tự luận', trac_nghiem: 'Trắc nghiệm', dung_sai: 'Đúng – Sai' }[c.loai_cau], dang_thuc: c.loai_cau, diem_moi_cau: null }; phan.push(cur) }
      c.phan = cur.thu_tu
    }
  }
  const dem = new Map(phan.map((p) => [p.thu_tu, new Set()]))
  for (const c of cauRa) dem.get(c.phan)?.add(c.diem)
  for (const p of phan) { const s = [...(dem.get(p.thu_tu) ?? [])].filter((x) => x != null); if (s.length === 1) p.diem_moi_cau = s[0] }
  const phanCoCau = new Set(cauRa.map((c) => c.phan))
  const phanRa = phan.filter((p) => phanCoCau.has(p.thu_tu))
  cauRa.forEach(({ _phan_goc, ...c }, i) => { cauRa[i] = c })
  const deOut = { khoi: '5T', mon: 'Toán', ten: d.ten, ma: d.ma, nam: d.nam, file: `TUYỂN TẬP ĐỀ THI CLC 2025-2026 · ${d.ma}`,
    sha256: createHash('sha256').update('CLC6|' + d.ma + '|' + JSON.stringify(d.cau.map((q) => q.ma_nguon))).digest('hex'),
    nguon: 'le', thoi_gian_phut: 75, thang_diem: 10, phan: phanRa, cau: cauRa }
  fs.writeFileSync(path.join(dir, 'de.json'), JSON.stringify(deOut, null, 1))
  const dayDu = thieu.length === 0
  const cmd = [path.join(GOC, 'scripts/kho/de-thi/ghi.mjs'), dir, '--model-lam', MODEL, ...(dayDu ? [] : ['--chi-cau']), ...(GHI ? ['--ghi'] : [])]
  const r = spawnSync(process.execPath, cmd, { cwd: GOC, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  const out = (r.stdout ?? '') + (r.stderr ?? '')
  fs.writeFileSync(path.join(dir, 'ket-qua.txt'), out)
  const tom = out.split('\n').filter((l) => /câu mới|LỖI|❌|✔|ROLLBACK|bản đồ mới|fn_de_thi_thieu/.test(l)).map((l) => l.trim()).join(' | ')
  console.log(`${ma.padEnd(14)} ${dayDu ? 'ĐỀ ' : 'CÂU'} ${String(cauRa.length).padStart(3)}/${d.cau.length} thiếu hình ${thieu.length} → exit ${r.status} :: ${tom.slice(0, 330)}`)
  bao.de.push({ ma, dayDu, ghi: cauRa.length, tong: d.cau.length, thieu: thieu.length, exit: r.status })
  if (r.status === 0) bao.cau_ghi += cauRa.length
}
console.log('\nTỔNG', JSON.stringify({ de_day_du: bao.de.filter((x) => x.dayDu).length, de_thieu_hinh: bao.de.filter((x) => !x.dayDu).length, cau_xu_ly: bao.cau_ghi, thieu_hinh: bao.thieu_hinh.length, bo_cuoi: bao.bo_cuoi, bo_soan: bao.bo_soan, so_do: bao.so_do, nghi: bao.nghi, loi: bao.loi_dang, exit_loi: bao.de.filter((x) => x.exit !== 0).map((x) => x.ma) }, null, 1))
fs.writeFileSync(path.join(RA, GHI ? 'bao-cao-ghi.json' : 'bao-cao-thu.json'), JSON.stringify(bao, null, 1))
