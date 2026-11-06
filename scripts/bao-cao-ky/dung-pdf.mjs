// Dựng PDF BÁO CÁO HỌC KÌ gửi phụ huynh từ SNAPSHOT đã công bố (spec-bao-cao-ky.md §A8 + §C "PDF").
// ERP không tạo PDF — script này đọc `bao_cao_ph_ky.snapshot` (chỉ dòng đã công bố, không tính lại) rồi in bằng Edge headless.
// Luật trình bày (Thùy 04/11): khổ 125×220 mm, 1 CỘT, phần 1 dưới header, phần 2–5 mỗi phần sang trang mới,
// chuyên đề mở sẵn, phụ lục in đủ dòng, giữ trọn mỗi card/dòng bảng trong 1 trang, KHÔNG chú thích nhỏ/chân trang, điểm 2 chữ số.
//
//   node scripts/bao-cao-ky/dung-pdf.mjs [--ky <ky_id>] [--lop <tên lớp>] [--mon Toán|KHTN] [--hs <ma_hs|uuid>] [--out <thư mục>] [--html]
//   Mặc định: kì mới nhất, MỌI em đã công bố → <repo>/../_bao-cao-ky-pdf/<kì>/<lớp>/<Tên HS> - <môn>.pdf (ngoài repo: có tên HS).
//   --html = chỉ ghi .html (xem bằng trình duyệt, không in).
// Chỉ ĐỌC DB (ưu tiên DATABASE_URL_RO).
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null }
const env = fs.readFileSync('.env', 'utf8')
const url = (process.env.DATABASE_URL_RO || env.match(/^DATABASE_URL_RO=(.*)$/m)?.[1] || env.match(/^DATABASE_URL=(.*)$/m)?.[1] || '').trim()
const chiHtml = process.argv.includes('--html')
const OUT = path.resolve(arg('--out') ?? path.join(process.cwd(), '..', '_bao-cao-ky-pdf'))

const MAU_EM = '#4f46e5', MAU_TB = '#f97316'
const NHAN_MUC = { tot: 'Tốt', on: 'Ổn', chua_tot: 'Chưa tốt', chua_du: 'Chưa đủ quan sát' }
const MAU_MUC = { tot: '#059669', on: '#d97706', chua_tot: '#e11d48', chua_du: '#94a3b8' }
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const so = (v) => v == null ? '—' : Number(v).toLocaleString('vi-VN', { maximumFractionDigits: 2 })
const thangNhan = (ym) => { const [y, m] = ym.split('-'); return `${Number(m)}/${y}` }
const ddmm = (iso) => { const [, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}` }
const pctMau = (p) => p == null ? '#94a3b8' : p >= 80 ? '#059669' : p >= 50 ? '#d97706' : '#e11d48'
const lines = (s) => esc(s).replace(/\n/g, '<br>')
const tenFile = (s) => String(s).replace(/[\\/:*?"<>|]/g, '').trim()

const CSS = `
@page { size: 125mm 220mm; margin: 6mm }
* { box-sizing: border-box }
body { margin: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; font-size: 10.5pt; line-height: 1.4 }
.hd { background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff; border-radius: 12px; padding: 12px 14px; margin-bottom: 10px }
.hd small { font-size: 8pt; letter-spacing: .08em; text-transform: uppercase; opacity: .85 }
.hd h1 { margin: 2px 0 4px; font-size: 17pt } .hd p { margin: 0; font-size: 9.5pt; opacity: .95 }
.ph { break-before: page }
.ph:first-of-type { break-before: auto }
.tt { display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px }
.tt b.n { width: 22px; height: 22px; border-radius: 50%; background: #4f46e5; color: #fff; text-align: center; line-height: 22px; font-size: 10pt; flex: none }
.tt h2 { margin: 0; font-size: 12.5pt } .tt span { color: #94a3b8; font-size: 8.5pt }
.cd { border: 1px solid #e2e8f0; border-radius: 9px; margin-bottom: 8px; break-inside: avoid; overflow: hidden }
.cd .top { padding: 8px 10px }
.row { display: flex; align-items: center; gap: 8px }
.row .ten { flex: 1; font-weight: 700; font-size: 10.5pt }
.chip { border-radius: 6px; padding: 1px 7px; font-weight: 800; font-size: 10pt }
.bar { height: 7px; border-radius: 4px; background: #e2e8f0; overflow: hidden; margin-top: 5px } .bar i { display: block; height: 100% }
.sub { color: #94a3b8; font-size: 8.5pt; margin-top: 3px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap }
.viên { color: #fff; border-radius: 99px; padding: 0 7px; font-size: 8pt; font-weight: 700 }
.cy { border-top: 1px solid #f1f5f9; background: #f8fafc; padding: 2px 10px }
.cy .l { display: flex; align-items: center; gap: 8px; padding: 5px 0; border-bottom: 1px solid #eef2f6; break-inside: avoid }
.cy .l:last-child { border-bottom: 0 }
.cy .t { flex: 1; font-size: 9.5pt } .cy .bb { width: 52px; height: 7px; border-radius: 4px; background: #e2e8f0; overflow: hidden; flex: none } .cy .bb i { display: block; height: 100% }
.cy b.p { width: 36px; text-align: right; font-size: 9.5pt; flex: none }
table { width: 100%; border-collapse: collapse; font-size: 9.5pt }
th { color: #64748b; font-weight: 500; font-size: 8.5pt; text-align: right; padding: 4px 3px; border-bottom: 1px solid #e2e8f0 } th:first-child { text-align: left }
td { text-align: right; padding: 5px 3px; border-bottom: 1px solid #f1f5f9 } td:first-child { text-align: left; font-weight: 600 }
tr { break-inside: avoid }
.kt td { background: #eef2ff; font-weight: 800; border-bottom: 0 }
.lb { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; color: #64748b; margin: 10px 0 5px } .lb:first-child { margin-top: 0 }
.g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 7px }
.o { border-radius: 9px; padding: 8px 10px; break-inside: avoid } .o b { display: block; font-size: 15pt; line-height: 1.15 } .o span { font-size: 8.5pt; opacity: .85 }
.o.x { background: #ecfdf5; color: #047857 } .o.c { background: #fffbeb; color: #b45309 } .o.d { background: #fff1f2; color: #be123c } .o.m { background: #f8fafc; color: #1e293b }
.nl { background: #eef2ff; border-radius: 9px; padding: 9px 12px; margin-bottom: 10px }
.nl .k { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; color: #4338ca } .nl .d { font-size: 28pt; font-weight: 800; color: #4f46e5; line-height: 1.05 } .nl .s { font-size: 14pt; color: #64748b; font-weight: 600 }
.nx { border: 1px solid #e2e8f0; border-radius: 9px; margin-bottom: 8px; overflow: hidden; break-inside: avoid }
.nx > h3 { margin: 0; background: #4f46e5; color: #fff; font-size: 10pt; padding: 4px 10px }
.nx .m { padding: 6px 10px; border-bottom: 1px solid #f1f5f9 } .nx .m:last-child { border-bottom: 0 }
.nx .m em { font-style: normal; font-weight: 600; font-size: 9.5pt; margin-right: 6px } .nx .m u { text-decoration: none; font-size: 8.5pt; font-weight: 700; color: #fff; border-radius: 99px; padding: 0 7px }
.nx .m p { margin: 2px 0 0; font-size: 10pt } .nx .them { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 6px 10px; font-style: italic; font-size: 10pt }
.box { background: #f8fafc; border-left: 4px solid #7c3aed; border-radius: 6px; padding: 8px 11px; font-size: 10pt; break-inside: avoid }
.box.kh { border-left-color: #10b981 } .box ul { margin: 0; padding-left: 16px } .box li { margin-bottom: 3px }
.gv { text-align: right; color: #64748b; font-size: 9pt; margin-top: 6px }
.vuot { color: #94a3b8 }
.pl { font-size: 8.5pt } .pl th, .pl td { padding: 3px 2px } .pl td:first-child { font-weight: 400; color: #94a3b8 } .pl td.ten { text-align: left; font-weight: 400 } .pl th.ten { text-align: left }
.pl tr.em td { background: #e0e7ff; font-weight: 800; color: #312e81 }
.trong { color: #94a3b8; font-size: 10pt }
`

function bieuDo(thi) {
  if (!thi.length) return '<p class="trong">Chưa có lần thi nào trong kì.</p>'
  const W = 340, H = 210, L = 24, R = 8, T = 20, B = 26, PAD = 22
  const x = (i) => thi.length === 1 ? (L + W - R) / 2 : L + PAD + (i * (W - L - R - 2 * PAD)) / (thi.length - 1)
  const y = (v) => T + (1 - v / 10) * (H - T - B)
  const duong = (k) => thi.map((t, i) => `${x(i)},${y(t[k])}`).join(' ')
  const luoi = [0, 2, 4, 6, 8, 10].map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#e2e8f0"/><text x="${L - 7}" y="${y(v) + 3}" font-size="10" text-anchor="end" fill="#94a3b8">${v}</text>`).join('')
  const diem = thi.map((t, i) => `<circle cx="${x(i)}" cy="${y(t.tb)}" r="4" fill="${MAU_TB}"/><circle cx="${x(i)}" cy="${y(t.diem)}" r="4.5" fill="${MAU_EM}"/>
    <text x="${x(i)}" y="${y(t.diem) + (t.diem >= t.tb ? -9 : 16)}" font-size="11" font-weight="700" text-anchor="middle" fill="${MAU_EM}">${so(t.diem)}</text>
    <text x="${x(i)}" y="${y(t.tb) + (t.diem >= t.tb ? 16 : -9)}" font-size="10.5" font-weight="600" text-anchor="middle" fill="${MAU_TB}">${so(t.tb)}</text>
    <text x="${x(i)}" y="${H - 9}" font-size="11" text-anchor="middle" fill="#475569">${esc(t.nhan)}</text>`).join('')
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%">${luoi}<polyline points="${duong('tb')}" fill="none" stroke="${MAU_TB}" stroke-width="3" stroke-linejoin="round"/><polyline points="${duong('diem')}" fill="none" stroke="${MAU_EM}" stroke-width="3" stroke-linejoin="round"/>${diem}</svg>
  <div style="display:flex;gap:16px;font-size:9pt"><span><i style="display:inline-block;width:16px;height:4px;border-radius:2px;background:${MAU_EM};margin-right:5px;vertical-align:middle"></i>Điểm của con</span><span><i style="display:inline-block;width:16px;height:4px;border-radius:2px;background:${MAU_TB};margin-right:5px;vertical-align:middle"></i>TB cả khối</span></div>`
}

const vienHang = (u) => u.hang == null || !u.tong ? '' : `<span class="viên" style="background:#475569">Hạng ${u.hang}/${u.tong}</span>`
const vienMuc = (u) => u.muc ? `<span class="viên" style="background:${u.muc === 'nang_cao' ? '#7c3aed' : '#0ea5e9'}">${u.muc === 'nang_cao' ? 'Nâng cao' : 'Cơ bản'}</span>` : ''
const nLan = (u) => `${u.n} lần đánh giá`
const O = (v, nhan, t) => `<div class="o ${t ?? 'm'}"><b>${v}</b><span>${esc(nhan)}</span></div>`

function dungHtml(d) {
  const cc = d.thai_do.chuyen_can, bt = d.thai_do.btvn
  const nghi = cc ? cc.vang + cc.vang_phep : 0
  const tt = (n, ten, mo) => `<div class="tt"><b class="n">${n}</b><h2>${esc(ten)}</h2>${mo ? `<span>${esc(mo)}</span>` : ''}</div>`

  // Chưa đo (không có lần đánh giá trong 60 ngày cuối kì) = không quan trọng ⇒ KHÔNG hiện (Thùy 06/11), cả chủ đề lẫn chuyên đề
  // chủ đề chỉ có 1 chuyên đề trùng tên (vd "Hình" → "Hình") ⇒ hiện 1 dòng thôi (Thùy 06/11)
  const boLap = (cd, cy) => cy.length === 1 && cy[0].ten.trim() === cd.ten.trim() ? [] : cy
  const daDo = (u) => u.n > 0 && u.p != null
  const chuDe = d.danh_gia.chu_de.filter(daDo).map((cd) => ({ ...cd, chuyen_de: boLap(cd, cd.chuyen_de.filter(daDo)) }))
  const p1 = chuDe.length ? chuDe.map((cd) => `
    <div class="cd"><div class="top">
      <div class="row"><div class="ten">${esc(cd.ten)}</div><span class="chip" style="color:${pctMau(cd.p)};background:${pctMau(cd.p)}1a">${cd.p == null ? 'chưa đo' : cd.p + '%'}</span></div>
      <div class="bar"><i style="width:${cd.p ?? 0}%;background:${pctMau(cd.p)}"></i></div>
      <div class="sub">${vienHang(cd)}${nLan(cd)}</div></div>
      ${cd.chuyen_de.length ? `<div class="cy">${cd.chuyen_de.map((u) => `
        <div class="l"><div class="t">${esc(u.ten)}<div class="sub" style="margin-top:1px">${vienMuc(u)}${vienHang(u)}${nLan(u)}</div></div>
          <div class="bb"><i style="width:${u.p ?? 0}%;background:${pctMau(u.p)}"></i></div><b class="p" style="color:${pctMau(u.p)}">${u.p == null ? '—' : u.p + '%'}</b></div>`).join('')}</div>` : ''}
    </div>`).join('') : '<p class="trong">Chưa có lần đánh giá nào trong kì.</p>'

  const p2 = bieuDo(d.thi) + (d.thi.length ? `<table style="margin-top:10px"><thead><tr><th>Lần thi</th><th>Ngày</th><th>Điểm</th><th>TB khối</th><th>Chênh</th><th>Hạng</th></tr></thead><tbody>
    ${d.thi.map((t) => `<tr><td>${esc(t.nhan)}</td><td style="color:#64748b">${ddmm(t.ngay)}</td><td style="font-weight:700;color:${MAU_EM}">${so(t.diem)}</td><td style="color:${MAU_TB}">${so(t.tb)}</td><td style="color:${t.chenh >= 0 ? '#059669' : '#e11d48'}">${t.chenh >= 0 ? '+' : ''}${so(t.chenh)}</td><td>${t.hang}/${t.n_mau}</td></tr>`).join('')}
    ${d.hang_ky ? `<tr class="kt"><td>Cả học kì</td><td></td><td style="color:${MAU_EM}">${so(d.hang_ky.diem_tb)}</td><td></td><td></td><td style="color:#4338ca">${d.hang_ky.hang}/${d.hang_ky.tong}</td></tr>` : ''}
    </tbody></table>` : '')

  const p3 = `<div class="lb">Chuyên cần</div>` + (cc && cc.tong > 0
    ? `<div class="g2">${O(`${cc.co_mat}/${cc.tong}`, 'Buổi có mặt', 'x')}${O(nghi, `Buổi nghỉ${cc.vang_phep ? ` (${cc.vang_phep} có phép)` : ''}`, nghi ? 'c' : 'm')}</div>`
    : '<p class="trong">Chưa có buổi điểm danh nào trong kì.</p>')
    + `<div class="lb">Bài tập về nhà${bt && bt.tong > 0 ? ` <span style="font-weight:400;text-transform:none;color:#94a3b8">· ${bt.tong} buổi có ghi nhận</span>` : ''}</div>`
    + (bt && bt.tong > 0
      ? `<div class="g2">${O(`${bt.dat_chuan}/${bt.tong}`, 'Đạt chuẩn (đúng hạn, nghiêm túc)', 'x')}${O(bt.dung_han_chua_nt, 'Đúng hạn nhưng chưa nghiêm túc', bt.dung_han_chua_nt ? 'c' : 'x')}${O(bt.nop_muon, 'Nộp muộn', bt.nop_muon ? 'c' : 'x')}${O(bt.khong_lam, 'Không làm', bt.khong_lam ? 'd' : 'x')}${bt.xin_phep > 0 ? O(bt.xin_phep, 'Xin phép') : ''}${bt.chua_ghi > 0 ? O(bt.chua_ghi, 'Chưa ghi trạng thái nộp') : ''}</div>`
      : '<p class="trong">Chưa có ghi nhận bài tập về nhà trong kì.</p>')

  const nxc = d.nhan_xet_chon ?? [], khc = d.ke_hoach_chon ?? []
  // Kết luận (Thùy 06/11) — 7 mức y report tháng (MUC_HEX ở src/screens/report/ReportCard.tsx)
  const KL = { rat_tot: ['#ecfdf5', '#047857', '🌟', 'Con học rất tốt'], dat_yeu_cau: ['#f0fdf4', '#15803d', '✅', 'Con đạt yêu cầu'], tien_bo: ['#f0f9ff', '#0369a1', '📈', 'Con đang tiến bộ'],
    cai_thien_thai_do: ['#fffbeb', '#b45309', '⚠️', 'Con cần cải thiện thái độ học tập'], cai_thien_kien_thuc: ['#fffbeb', '#b45309', '⚠️', 'Con cần cải thiện kiến thức và kĩ năng'],
    van_de_thai_do: ['#fff1f2', '#be123c', '🆘', 'Con gặp vấn đề về thái độ học tập'], van_de_kien_thuc: ['#fff1f2', '#be123c', '🆘', 'Con gặp vấn đề về kiến thức và kĩ năng'] }
  const kl = d.ket_luan, klm = kl?.muc ? KL[kl.muc] : null
  const klHtml = kl ? `<div class="box" style="background:${klm ? klm[0] : '#f8fafc'};border-left:0;margin-bottom:8px"><div class="lb" style="margin:0">Kết luận</div>${klm ? `<div style="font-weight:800;font-size:12.5pt;color:${klm[1]}">${klm[2]} ${klm[3]}</div>` : ''}${kl.noi_dung ? `<div style="margin-top:3px">${lines(kl.noi_dung)}</div>` : ''}</div>` : ''
  const p4 = `<div class="nl"><div class="k">Điểm năng lực</div><div><span class="d">${so(d.nang_luc.diem)}</span> <span class="s">± ${so(d.nang_luc.sai_so)}</span></div></div>`
    + klHtml
    + (!nxc.length && !d.nhan_xet ? '<p class="trong">Giáo viên chưa nhập nhận xét.</p>' : '')
    + nxc.map((t) => `<div class="nx"><h3>${esc(t.ten)}</h3>${t.con.map((c) => `<div class="m"><em>${esc(c.ten)}</em><u style="background:${MAU_MUC[c.muc_do]}">${NHAN_MUC[c.muc_do]}</u>${c.noi_dung ? `<p>${esc(c.noi_dung)}</p>` : ''}</div>`).join('')}</div>`).join('')
    + (d.nhan_xet ? `<div class="lb">Thầy cô ghi thêm</div><div class="box">${lines(d.nhan_xet)}</div>` : '')
    // nhãn + khung + tên GV đi liền nhau, không tách qua trang (nhãn mồ côi ở cuối trang trước)
    + `<div style="break-inside:avoid"><div class="lb">Kế hoạch cải thiện</div>` + (khc.length || d.ke_hoach
      ? `<div class="box kh">${khc.length ? `<ul>${khc.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}${d.ke_hoach ? `<div style="${khc.length ? 'margin-top:5px' : ''}">${lines(d.ke_hoach)}</div>` : ''}</div>`
      : '<p class="trong">Giáo viên chưa nhập kế hoạch.</p>')
    + (d.gv ? `<div class="gv">— ${esc(d.gv)}</div>` : '') + '</div>'

  const p5 = d.phu_luc.hs.length
    ? `<table class="pl"><thead><tr><th>#</th><th class="ten">Học sinh</th>${d.phu_luc.cot.map((c) => `<th>${esc(c.nhan)}</th>`).join('')}<th>Hạng TB</th><th>Hạng</th></tr></thead><tbody>
      ${d.phu_luc.hs.map((h, i) => `<tr class="${h.la_em ? 'em' : ''}"><td>${i + 1}</td><td class="ten">${esc(h.ten)}${h.la_em ? ' ⭐' : ''}</td>${h.diem.map((v) => `<td>${v == null ? '<span class="vuot">—</span>' : so(v)}</td>`).join('')}<td>${so(h.hang_tb)}</td><td>${h.hang}</td></tr>`).join('')}
      </tbody></table>`
    : '<p class="trong">Chưa có lần thi nào trong kì.</p>'

  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${esc(d.hs.ho_ten)} — ${esc(d.mon)} — ${esc(d.ky.ten)}</title><style>${CSS}</style></head><body>
  <div class="hd"><small>BK Academy · Báo cáo học kì</small><h1>${esc(d.hs.ho_ten)}</h1>
    <p>${esc(d.mon)}${d.lop.khoi ? ' ' + esc(d.lop.khoi) : ''} · Lớp ${esc(d.lop.ten ?? '—')}<br>${esc(d.ky.ten)} (tháng ${thangNhan(d.ky.tu_thang)} → ${thangNhan(d.ky.den_thang)})${d.gv ? `<br>Giáo viên: ${esc(d.gv)}` : ''}</p></div>
  <section class="ph">${tt(1, 'Đánh giá kiến thức')}${p1}</section>
  <section class="ph">${tt(2, 'Kết quả thi')}${p2}</section>
  <section class="ph">${tt(3, 'Thái độ học tập')}${p3}</section>
  <section class="ph">${tt(4, 'Nhận xét của giáo viên')}${p4}</section>
  <section class="ph">${tt(5, 'Phụ lục — điểm thi toàn khối', `Khối ${d.lop.khoi ?? ''} ${d.mon} · ${d.phu_luc.hs.length} học sinh`)}${p5}</section>
  </body></html>`
}

const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p))
if (!chiHtml && !EDGE) throw new Error('Không thấy Edge/Chrome để in PDF (dùng --html)')

const jsonFile = arg('--json')   // thử bố cục với 1 snapshot/bản nháp lưu ra file (không đọc DB)
const c = new pg.Client({ connectionString: url })
if (!jsonFile) await c.connect()
const kyArg = arg('--ky')
const ky = jsonFile ? { id: 'json', ten: 'thu' } : kyArg
  ? (await c.query(`select id, ten from ky_hoc where id = $1`, [kyArg])).rows[0]
  : (await c.query(`select id, ten from ky_hoc order by den_thang desc, created_at desc limit 1`)).rows[0]
if (!ky) throw new Error('Không có kì')
const hs = arg('--hs'), mon = arg('--mon'), lop = arg('--lop')
const rows = jsonFile ? [{ snapshot: JSON.parse(fs.readFileSync(jsonFile, 'utf8')) }] : (await c.query(`
  select b.snapshot from bao_cao_ph_ky b join hoc_sinh h on h.id = b.hoc_sinh_id
   where b.ky_id = $1 and b.cong_bo_at is not null and b.snapshot is not null
     and ($2::text is null or b.mon = $2) and ($3::text is null or b.snapshot->'lop'->>'ten' = $3)
     and ($4::text is null or h.id::text = $4 or h.ma_hs = $4)
   order by b.snapshot->'lop'->>'ten', b.snapshot->'hs'->>'ho_ten', b.mon`, [ky.id, mon, lop, hs])).rows
if (!jsonFile) await c.end()
console.log(`Kì "${ky.ten}": ${rows.length} báo cáo đã công bố → ${OUT}`)
if (!rows.length) process.exit(0)

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bckypdf-'))
let ok = 0
for (const { snapshot: d } of rows) {
  const dir = path.join(OUT, tenFile(ky.ten), tenFile(d.lop.ten ?? 'khong-lop'))
  fs.mkdirSync(dir, { recursive: true })
  const base = path.join(dir, `${tenFile(d.hs.ho_ten)} - ${tenFile(d.mon)}`)
  const html = dungHtml(d)
  if (chiHtml) { fs.writeFileSync(base + '.html', html); ok++; continue }
  const f = path.join(tmp, 'bc.html'); fs.writeFileSync(f, html)
  try {
    execFileSync(EDGE, ['--headless', '--disable-gpu', '--no-pdf-header-footer', `--user-data-dir=${path.join(tmp, 'p')}`, `--print-to-pdf=${base}.pdf`, pathToFileURL(f).href], { stdio: 'ignore', timeout: 60000 })
    ok++
  } catch (e) { console.log('LỖI', d.hs.ho_ten, d.mon, e.message) }
}
fs.rmSync(tmp, { recursive: true, force: true })
console.log(`XONG: ${ok}/${rows.length} → ${OUT}`)
