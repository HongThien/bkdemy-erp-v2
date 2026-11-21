// xem-de-xuat.mjs — dựng trang HTML để Thùy xem lại ĐỀ XUẤT tầng dạng Đại khối 8T (14/11: dai-g1..g4.json, 170 dạng / 37 nhóm). Chỉ đọc, không ghi DB.
//   node kho-rules/dai/lo/k8T/dang/xem-de-xuat.mjs <ra-do-dang-du-cau.csv> <tệp_ra.html>
// CSV = đầu ra của scripts/do-dang-du-cau.mjs (để ghép tên nhóm → dạng bản đồ hiện tại + số câu dùng được).
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = dirname(fileURLToPath(import.meta.url))
const [csvPath, ra] = process.argv.slice(2)
if (!csvPath || !ra) { console.error('Dùng: node xem-de-xuat.mjs <csv> <ra.html>'); process.exit(2) }
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// bản đồ hiện tại (khối 8T) từ CSV đo
const hienTai = new Map()
for (const l of readFileSync(csvPath, 'utf8').replace(/^﻿/, '').split('\n').slice(1)) {
  const m = [...l.matchAll(/"((?:[^"]|"")*)"|([^,]+)/g)].map((x) => x[1] ?? x[2])
  if (m[2] === '8T') hienTai.set(m[1].trim(), { id: m[0], dung_duoc: +m[5] })
}

const TANG = { co_ban: 'cơ bản', nang_cao: 'nâng cao', hsg: 'HSG', on_tap: 'ôn tập' }
const nhomAll = []; const thieu = []; const lan = []
for (const f of ['dai-g1', 'dai-g2', 'dai-g3', 'dai-g4']) {
  const j = JSON.parse(readFileSync(join(DIR, f + '.json'), 'utf8'))
  nhomAll.push(...j.nhom); thieu.push(...(j.nhom_thieu ?? [])); lan.push(...(Array.isArray(j.chong_lan) ? j.chong_lan : Object.values(j.chong_lan ?? {})))
}
let tongDang = 0; let tongBai = 0
const phan = nhomAll.map((n) => {
  const ht = hienTai.get(n.ten.trim())
  const dang = n.dang.map((d, i) => {
    const bai = d.nguon.reduce((a, s) => a + (s.so_bai ?? 0), 0)
    tongDang++; tongBai += bai
    return `<div class="dang"><div class="dh"><span class="stt">${i + 1}</span><b>${esc(d.ten)}</b>
      <span class="chip ${d.do_tin === 'cao' ? 'cao' : 'vua'}">tin: ${esc(d.do_tin)}</span><span class="chip">${esc(TANG[d.tang] ?? d.tang)}</span><span class="chip">${bai} bài trong sách</span></div>
      <p>${esc(d.mo_ta)}</p><p class="cc"><i>Công cụ:</i> ${esc(d.cong_cu)}</p>
      <ul class="ng">${d.nguon.map((s) => `<li><b>${esc(s.sach)}</b> ${esc(s.muc)} — ${s.so_bai} bài</li>`).join('')}</ul></div>`
  }).join('')
  const tong = n.dang.reduce((a, d) => a + d.nguon.reduce((b, s) => b + (s.so_bai ?? 0), 0), 0)
  return `<section><h3>${esc(n.ten)} <small>${n.id}</small></h3>
    <p class="ht">${ht ? `Bản đồ hiện tại: <b>${ht.id}</b> (1 dạng) — đang có <b>${ht.dung_duoc}</b> câu dùng được` : '<b>Không khớp tên với dạng nào trong bản đồ hiện tại</b>'} · đề xuất tách <b>${n.dang.length}</b> dạng · sách có ~<b>${tong}</b> bài</p>${dang}</section>`
}).join('')

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Đề xuất tầng dạng Đại 8T</title><style>
:root{--bg:#f5f5f7;--card:#fff;--tx:#1d1d1f;--mu:#6e6e73;--ln:#e5e5ea;--ac:#0a64c8;--ok:#1f7a3d;--wa:#a15c00}
@media(prefers-color-scheme:dark){:root{--bg:#1c1c1e;--card:#2c2c2e;--tx:#f5f5f7;--mu:#a1a1a6;--ln:#3a3a3c;--ac:#64a8ff;--ok:#5fd68a;--wa:#ffb454}}
body{font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--tx);margin:0;padding:16px}
.w{max-width:900px;margin:0 auto}h1{font-size:22px;margin:4px 0}h2{font-size:18px;margin:28px 0 8px}h3{font-size:16px;margin:0 0 4px}small{color:var(--mu);font-weight:400}
section{background:var(--card);border-radius:14px;padding:14px 16px;margin:12px 0}.ht{color:var(--mu);margin:2px 0 10px;font-size:13px}
.dang{border-top:1px solid var(--ln);padding:10px 0}.dh{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.stt{background:var(--ac);color:#fff;border-radius:50%;width:22px;height:22px;display:inline-grid;place-items:center;font-size:12px}
.chip{font-size:11px;border:1px solid var(--ln);border-radius:999px;padding:1px 8px;color:var(--mu)}.chip.cao{color:var(--ok);border-color:var(--ok)}.chip.vua{color:var(--wa);border-color:var(--wa)}
.dang p{margin:4px 0}.cc{color:var(--mu);font-size:13px}.ng{margin:4px 0 0;padding-left:18px;color:var(--mu);font-size:13px}
.note{background:var(--card);border-radius:14px;padding:12px 16px;margin:10px 0;border-left:4px solid var(--wa)}.note p{margin:3px 0}
</style></head><body><div class="w">
<h1>Đề xuất tầng dạng Đại khối 8T (14/11)</h1>
<p class="ht">${nhomAll.length} nhóm · ${tongDang} dạng đề xuất · ~${tongBai} bài trong 6 quyển nguồn · chưa ghi DB. Bản đồ hiện tại có 52 dạng (mỗi nhóm đa số 1 dạng).</p>
${phan}
<h2>Nhóm sách có mà bản đồ chưa có (${thieu.length})</h2>
${thieu.map((t) => `<div class="note"><p><b>${esc(t.ten)}</b> <small>${esc(t.chuyen_de)}</small></p><p>${esc(t.nguon)} — ${t.so_bai} bài</p><p class="cc">${esc(t.ly_do ?? t.ly_d ?? '')}</p></div>`).join('')}
<h2>Chỗ dễ lẫn giữa các nhóm</h2>
${lan.map((t) => `<div class="note"><p>${esc(t)}</p></div>`).join('')}
</div></body></html>`
writeFileSync(ra, html)
console.log('nhóm', nhomAll.length, '· dạng', tongDang, '· bài', tongBai, '· không khớp bản đồ:', nhomAll.filter((n) => !hienTai.has(n.ten.trim())).map((n) => n.id).join(' ') || 'không', '→', ra)
