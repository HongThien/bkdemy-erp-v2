// HTML duyệt kết quả B3 chủ đề Giới hạn K11 (đề cương/đề thi) — CHƯA ghi DB.
//   node kho-rules/dai/lo/b3/_ds/build-html-gh.mjs  ⇒ kho-rules/dai/lo/b3/_ds/duyet-k11-gh.html
import fs from 'node:fs'
import path from 'node:path'

const goc = process.argv[2] ?? 'kho-rules/dai/lo/b3/k11-gh2'
const truoc = fs.existsSync('kho-rules/dai/lo/b3/k11-gh/ket_qua.json') && goc.endsWith('gh2') ? new Map(JSON.parse(fs.readFileSync('kho-rules/dai/lo/b3/k11-gh/ket_qua.json', 'utf8')).map((r) => [r.ma_cau, r])) : null
const dich = fs.readFileSync(path.join(goc, 'dich.md'), 'utf8').split('\n')
const ten = {}, thuTu = []
for (const l of dich) { const m = l.match(/^- \*\*(NDB\d+)\*\* · (.+)/); if (m) { ten[m[1]] = m[2]; thuTu.push(m[1]) } }
const de = {}
for (const f of fs.readdirSync(goc).filter((x) => /^lo-\d+\.json$/.test(x))) for (const q of JSON.parse(fs.readFileSync(path.join(goc, f), 'utf8'))) de[q.ma_cau] = q
const kq = JSON.parse(fs.readFileSync(path.join(goc, 'ket_qua.json'), 'utf8'))
const doi = truoc ? kq.filter((r) => truoc.get(r.ma_cau) && truoc.get(r.ma_cau).dang_bai_id !== r.dang_bai_id) : []
const canCu = {}
for (let i = 1; i <= 5; i++) for (const r of JSON.parse(fs.readFileSync(path.join(goc, `lo-0${i}.out.json`), 'utf8'))) canCu[r.ma_cau] = r.can_cu
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const cau = (r) => {
  const q = de[r.ma_cau] ?? {}
  const lc = q.lua_chon ? `<div class="lc">${esc(Array.isArray(q.lua_chon) ? q.lua_chon.join('  |  ') : JSON.stringify(q.lua_chon))}</div>` : ''
  return `<div class="cau"><div class="mc">${esc(r.ma_cau)}${q.co_hinh ? ' · <b>có hình</b>' : ''}</div><div class="de">${esc(q.de ?? '').replace(/\n/g, '<br>')}</div>${lc}${q.dap_an ? `<div class="da">Đáp án: ${esc(q.dap_an)}</div>` : ''}<div class="ld">AI: ${esc(r.ly_do)}${canCu[r.ma_cau] ? `<br><i>căn cứ: “${esc(canCu[r.ma_cau])}”</i>` : ''}</div></div>`
}
const cao = kq.filter((r) => r.chac === 'cao'), vua = kq.filter((r) => r.chac === 'vua'), trong = kq.filter((r) => !r.dang_bai_id)
// gom câu trống theo lý do thiếu dạng (từ khoá)
const NHOM = [
  ['Dãy số cho bởi công thức truy hồi (tìm lim)', /truy hồi|đệ quy|hệ thức/i],
  ['Tổng / tích khử liên tiếp (telescoping)', /khử liên tiếp|triệt tiêu|telescop|tách hiệu|tách phân/i],
  ['Giới hạn hàm lượng giác dạng 0/0', /lượng giác|1\s*-\s*cos|cos|sin/i],
  ['Thuộc nhánh khác (HGT / Hình học)', /thuộc (HGT|Hình|nhánh)/i],
]
const nhomTrong = NHOM.map(([t]) => ({ t, ds: [] })); const khac = { t: 'Khác / chưa rõ', ds: [] }
for (const r of trong) { const i = NHOM.findIndex(([, re]) => re.test(r.ly_do)); (i >= 0 ? nhomTrong[i] : khac).ds.push(r) }
nhomTrong.push(khac)
const byDang = {}; for (const r of cao) (byDang[r.dang_bai_id] ??= []).push(r)
const dangCao = Object.keys(byDang).sort((a, b) => thuTu.indexOf(a) - thuTu.indexOf(b))
const doc = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Duyệt phân dạng K11 Giới hạn</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>
:root{--bg:#f6f7f9;--card:#fff;--tx:#1b1f24;--mu:#5a6572;--bd:#dde1e6}
@media(prefers-color-scheme:dark){:root{--bg:#14171a;--card:#1c2025;--tx:#e6e9ed;--mu:#9aa5b1;--bd:#2d333b}}
body{margin:0;background:var(--bg);color:var(--tx);font:15px/1.55 system-ui,sans-serif}main{max-width:920px;margin:0 auto;padding:16px}
h1{font-size:20px}h2{font-size:17px;margin:22px 0 6px}details{background:var(--card);border:1px solid var(--bd);border-radius:10px;margin:8px 0;padding:6px 12px}
summary{cursor:pointer;font-weight:600}.cau{border-top:1px solid var(--bd);padding:8px 0}.mc{font-size:12px;color:var(--mu)}
.de{margin:2px 0}.lc,.da{font-size:13px;color:var(--mu)}.ld{font-size:13px;color:#e08a2c;margin-top:2px}.top{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:10px 14px}
.tag{display:inline-block;font-size:11px;border-radius:9px;padding:0 7px;margin-left:6px;color:#fff;background:#4c6fff}
</style></head><body><main>
<h1>Duyệt phân dạng K11 — chủ đề Giới hạn (đề cương/đề thi) — lần 2, đã có 3 dạng mới</h1>
<div class="top"><b>Đề xuất — CHƯA ghi DB.</b> ${kq.length} câu · bảng đích ${thuTu.length} dạng đủ mô tả + lý thuyết + ví dụ · mỗi câu có cụm “căn cứ” trích nguyên văn từ dạng (máy kiểm: ${cao.length + vua.length}/${cao.length + vua.length} cụm có thật).
<br>Cao <b>${cao.length}</b> · Vừa <b>${vua.length}</b> · Trống <b>${trong.length}</b>. Không có đáp án chuẩn để đo độ đúng, nên cần Thùy xem mẫu: mở từng dạng ở phần C và liếc xem có câu lạc dạng không.</div>

${doi.length ? `<h2>0. ${doi.length} câu ĐỔI DẠNG so với lần phân trước (bảng 54 dạng)</h2><details open><summary>Bấm để xem — gồm cả câu chuyển sang 3 dạng mới</summary>${doi.map((r) => `<div class="cau"><div class="mc">${esc(r.ma_cau)}: ${esc(truoc.get(r.ma_cau).dang_bai_id ?? '(trống)')} → <b>${esc(r.dang_bai_id ?? '(trống)')}</b> ${esc(ten[r.dang_bai_id] ?? '')}</div></div>`).join('')}</details>` : ''}
<h2>A. ${trong.length} câu TRỐNG — bản đồ đang thiếu dạng nào?</h2>
${nhomTrong.filter((n) => n.ds.length).map((n) => `<details><summary>${esc(n.t)} <span class="tag">${n.ds.length} câu</span></summary>${n.ds.map(cau).join('')}</details>`).join('')}

<h2>B. ${vua.length} câu VỪA — máy còn lưỡng lự</h2>
${vua.map((r) => `<details><summary>${esc(r.ma_cau)} → ${esc(r.dang_bai_id)} ${esc(ten[r.dang_bai_id])}</summary>${cau(r)}</details>`).join('')}

<h2>C. ${cao.length} câu CAO — gom theo dạng (${dangCao.length} dạng)</h2>
${dangCao.map((id) => `<details><summary>${id} · ${esc(ten[id])} <span class="tag">${byDang[id].length}</span></summary>${byDang[id].map(cau).join('')}</details>`).join('')}
</main></body></html>`
fs.writeFileSync(goc.endsWith('gh2') ? 'kho-rules/dai/lo/b3/_ds/duyet-k11-gh2.html' : 'kho-rules/dai/lo/b3/_ds/duyet-k11-gh.html', doc)
console.log(`ok · cao ${cao.length} vừa ${vua.length} trống ${trong.length} · nhóm trống:`, nhomTrong.map((n) => `${n.t}=${n.ds.length}`).join(' | '))
