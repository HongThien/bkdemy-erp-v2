// ĐIỀN Ô cho CHỨNG MINH HÌNH — worker cho Claude Code (spec-dien-o.md §0b). Khuôn hangdoi-giai.mjs.
//   1) node scripts/hinh-dien.mjs --list --khoi 7 [--out lo.json]
//        → JSON: mỗi bài = { id, loai:'cach'|'bien_the', ma, khoi, de (phat_bieu/de_bai), gia_thiet, anh, loi_giai, buoc[] (tách câu
//          văn + tách "kết luận (lý do)" thô + cờ máy: trong_de / la_dich / la_tham_chieu), danh mục lý do. Claude ĐỌC (xem ảnh
//          qua URL nếu cần), TỰ ĐỀ XUẤT 2–3 ô ở PHẦN GIỮA theo spec, ghi kq.json:
//          [{ id, o:[{ kieu:'ket_luan'|'ly_do', buoc, key, dap_an:'A'..'D', phuong_an:[{text,dung,loi?,vi_sao_sai?}] }] } | { id, bo }]
//   2) node scripts/hinh-dien.mjs --verify kq.json     → kiểm CẤU TRÚC: key nguyên văn trong bước; không đục bước mở đầu/kết/tham chiếu;
//          4 phương án khác nhau; lý do là mã LD tồn tại, sai cùng nhóm; kết luận sai không trùng một mệnh đề đúng khác trong bài;
//          xen kẽ 2 kiểu khi ≥2 ô; phân bố vị trí đúng.
//   3) --ghi kq.json  → (sau khi có migration bảng hinh_form_dien) — CHƯA có ở D1, chỉ --xem ra HTML để CEO duyệt.
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const has = (k) => args.includes(k)
const url = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1]
const CAT = JSON.parse(readFileSync(new URL('./mcq-lo/hinh-ly-do-catalog.json', import.meta.url), 'utf8'))
const LD = new Map(CAT.ly_do.map((x) => [x.ma, x]))
const norm = (s) => String(s ?? '').replace(/\$/g, '').replace(/\\left|\\right|\\,|\s+/g, '').toLowerCase()

// Tách lời giải thành BƯỚC: theo câu (dấu chấm cuối câu hoặc xuống dòng), rồi tách "kết luận (lý do)" thô.
function tachBuoc(loiGiai, de, giaThiet, dich) {
  const cau = String(loiGiai).replace(/\r/g, '').split(/\n|(?<=[^\d])\.\s+(?=[A-ZVĐTM])/).map((s) => s.trim()).filter((s) => s.length > 3)
  const deN = norm(de + ' ' + (giaThiet ?? '')), dichN = norm(dich)
  return cau.map((text, i) => {
    const lyDo = [...text.matchAll(/\(([^()]{4,120})\)/g)].map((m) => m[1])
    const menhDe = [...text.matchAll(/\$[^$]+\$/g)].map((m) => m[0])
    const thamChieu = /theo câu|câu trên|câu trước|cách dựng|đpcm|dpcm/i.test(text)
    const chepGT = /giả thiết|hình vẽ|đã cho|theo đề/i.test(text) && menhDe.every((m) => deN.includes(norm(m)))
    const laDich = menhDe.length > 0 && menhDe.some((m) => dichN && dichN.includes(norm(m))) && i >= cau.length - 2
    return { k: i + 1, text, menh_de: menhDe, ly_do_tho: lyDo, ly_do_ma: lyDo.map(maLyDo), tham_chieu: thamChieu, chep_gia_thiet: chepGT, la_dich: laDich }
  })
}
function maLyDo(s) { const t = norm(s); for (const x of CAT.ly_do) if (x.tuong_duong.some((tđ) => t.includes(norm(tđ))) || t.includes(norm(x.ten))) return x.ma; return null }

const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20000 }); await c.connect()
try {
  if (has('--list')) {
    const khoi = opt('--khoi', '7')
    const { rows } = await c.query(`
      select 'cach' loai, cg.id, bt.ma, mh.khoi, bt.phat_bieu de, bt.gia_thiet_rieng gia_thiet, bt.gia_thiet_phu, coalesce(bt.anh_chuan, mh.anh_cau_hinh) anh, cg.loi_giai, cg.da_duyet, cg.nguon_giai
      from hinh_cach_giai cg join hinh_baitoan bt on bt.id = cg.baitoan_id left join hinh_mo_hinh mh on mh.id = bt.mo_hinh_id
      where cg.loi_giai is not null and mh.khoi = $1
      union all
      select 'bien_the', v.id, bt.ma || '/' || v.thu_tu, mh.khoi, v.de_bai, null, null, coalesce(v.anh, bt.anh_chuan, mh.anh_cau_hinh), v.loi_giai, v.da_duyet, v.nguon_giai
      from hinh_baitoan_bien_the v join hinh_baitoan bt on bt.id = v.baitoan_id left join hinh_mo_hinh mh on mh.id = bt.mo_hinh_id
      where v.loi_giai is not null and mh.khoi = $1
      order by 3, 1`, [khoi])
    const bai = rows.map((r) => {
      const dich = (r.de ?? '').replace(/^.*?(chứng minh|tính|so sánh)\s*:?\s*/i, '')
      return { id: r.id, loai: r.loai, ma: r.ma, khoi: r.khoi, de: r.de, gia_thiet: r.gia_thiet, gia_thiet_phu: r.gia_thiet_phu, anh: r.anh, dich, loi_giai: r.loi_giai, da_duyet: r.da_duyet, nguon_giai: r.nguon_giai, buoc: tachBuoc(r.loi_giai, r.de, r.gia_thiet, dich) }
    })
    const out = { khoi, sinh_luc: new Date().toISOString(), ly_do: CAT.ly_do.filter((x) => x.khoi.includes(khoi)).map(({ ma, nhom, ten, phat_bieu }) => ({ ma, nhom, ten, phat_bieu })), loi: CAT.loi_chung_minh, bai }
    const f = opt('--out'); if (f) { writeFileSync(f, JSON.stringify(out, null, 1), 'utf8'); console.log('→', f) } else console.log(JSON.stringify(out, null, 1))
    const tb = bai.reduce((s, b) => s + b.buoc.length, 0), giua = bai.reduce((s, b) => s + b.buoc.filter((x) => !x.tham_chieu && !x.chep_gia_thiet && !x.la_dich).length, 0)
    console.error(`Khối ${khoi}: ${bai.length} bài (${bai.filter((b) => b.loai === 'cach').length} cách giải + ${bai.filter((b) => b.loai === 'bien_the').length} biến thể) · ${tb} bước · ${giua} bước phần giữa · có ảnh ${bai.filter((b) => b.anh).length} · lý do nhận diện được ${bai.reduce((s, b) => s + b.buoc.reduce((t, x) => t + x.ly_do_ma.filter(Boolean).length, 0), 0)}/${bai.reduce((s, b) => s + b.buoc.reduce((t, x) => t + x.ly_do_tho.length, 0), 0)}`)
  } else if (has('--verify') || has('--xem')) {
    const kq = JSON.parse(readFileSync(opt('--verify') ?? opt('--kq'), 'utf8'))
    const lo = JSON.parse(readFileSync(opt('--lo'), 'utf8'))
    const byId = new Map(lo.bai.map((b) => [b.id, b]))
    let ok = 0, fail = 0, boN = 0; const pb = { A: 0, B: 0, C: 0, D: 0 }; const pass = []
    for (const it of kq) {
      if (it.bo) { boN++; continue }
      const b = byId.get(it.id); const err = []
      if (!b) err.push('id không trong lô')
      else {
        if (!Array.isArray(it.o) || it.o.length < 2 || it.o.length > 3) err.push('phải 2–3 ô')
        const kieu = new Set((it.o ?? []).map((o) => o.kieu)); if ((it.o ?? []).length >= 2 && kieu.size < 2) err.push('phải xen kẽ ô kết luận và ô lý do')
        for (const [i, o] of (it.o ?? []).entries()) {
          const bw = b.buoc.find((x) => x.k === o.buoc); if (!bw) { err.push(`ô${i + 1}: bước ${o.buoc} không có`); continue }
          if (bw.tham_chieu || bw.chep_gia_thiet || bw.la_dich) err.push(`ô${i + 1}: bước ${o.buoc} là mở đầu/kết/tham chiếu — không đục`)
          if (!norm(bw.text).includes(norm(o.key))) err.push(`ô${i + 1}: key không có nguyên văn trong bước ${o.buoc}`)
          const pa = o.phuong_an ?? []; if (pa.length !== 4) err.push(`ô${i + 1}: phải 4 phương án`)
          const dung = pa.filter((p) => p.dung); if (dung.length !== 1) err.push(`ô${i + 1}: đúng 1 phương án đúng`)
          else if ('ABCD'[pa.indexOf(dung[0])] !== o.dap_an) err.push(`ô${i + 1}: dap_an lệch vị trí`)
          if (new Set(pa.map((p) => norm(p.ma ?? p.text))).size !== pa.length) err.push(`ô${i + 1}: phương án trùng`)
          if (o.kieu === 'ly_do') {
            for (const p of pa) { const m = p.ma ?? ((p.text ?? '').match(/^LD\d\d|^GT$|^CT$/) || [])[0]; if (!m || !LD.has(m)) err.push(`ô${i + 1}: phương án "${(p.ma ?? p.text ?? '').slice(0, 30)}" không phải mã LD`) }
            const nh = new Set(pa.map((p) => LD.get(p.ma ?? (p.text ?? '').slice(0, 4))?.nhom)); if (nh.size > 2) err.push(`ô${i + 1}: lý do sai phải cùng nhóm với key (đang ${[...nh].join(',')})`)
          } else {
            // kết luận sai không được là mệnh đề đúng xuất hiện ở bước khác của bài
            const dungKhac = new Set(b.buoc.flatMap((x) => x.menh_de.map(norm)))
            for (const p of pa) if (!p.dung && dungKhac.has(norm(p.text))) err.push(`ô${i + 1}: phương án sai "${p.text}" là mệnh đề ĐÚNG ở bước khác`)
          }
          for (const p of pa) if (!p.dung && !p.loi) err.push(`ô${i + 1}: phương án sai thiếu nhãn lỗi E0x`)
          if (!err.length) pb[o.dap_an] = (pb[o.dap_an] ?? 0) + 1
        }
      }
      if (err.length) { fail++; console.log(`FAIL ${it.id.slice(0, 8)} ${b?.ma ?? ''}\n  - ${err.join('\n  - ')}`) } else { ok++; pass.push({ it, b }) }
    }
    console.log(`\n${ok} OK · ${fail} FAIL · ${boN} bỏ · vị trí đúng ${JSON.stringify(pb)}`)
    if (has('--xem')) {
      // HTML TỰ CHỨA (trình xem trong app chặn CDN + ảnh ngoài): KaTeX render sẵn, font nhúng, ảnh nhúng data URI.
      const { katexCss, mathHtml, imgDataUri, esc } = await import('./lib/html-tu-chua.mjs')
      const blocks = []
      for (const { it, b } of pass) {
        const oByBuoc = new Map(it.o.map((o) => [o.buoc, o]))
        const img = await imgDataUri(b.anh)
        const buocHtml = b.buoc.map((bw) => {
          const o = oByBuoc.get(bw.k); let raw = bw.text
          if (o) {
            // ô kết luận nằm trong $…$ → \boxed{?} để KaTeX vẽ ô; ô lý do là chữ thường → ⟦ ? ⟧
            const i = raw.indexOf(o.key)
            const trongMath = i >= 0 && (raw.slice(0, i).match(/\$/g) || []).length % 2 === 1
            raw = i >= 0 ? raw.slice(0, i) + (trongMath ? '\\boxed{\\;?\\;}' : '⟦ ? ⟧') + raw.slice(i + o.key.length) : raw
          }
          let t = mathHtml(raw).replace('⟦ ? ⟧', '<span class="blank">⟦ ? ⟧</span>')
          const pa = o ? `<div class="pa">${o.phuong_an.map((p, i) => `<span>${'ABCD'[i]}.</span><span class="${p.dung ? 'd' : ''}">${o.kieu === 'ly_do' ? esc(LD.get(p.ma ?? (p.text ?? '').slice(0, 4))?.ten ?? p.text) : mathHtml(p.text)}${p.dung ? ' ✓' : ` <span class="loi">${esc(p.loi)} · ${esc(p.vi_sao_sai ?? '')}</span>`}</span>`).join('')}</div>` : ''
          return `<div class="buoc${o ? ' o' : ''}">${t}${pa}</div>`
        }).join('')
        blocks.push(`<div class="bai"><div class="m">${esc(b.ma)} · ${b.loai} · ${it.o.length} ô${it.ap_khuon ? ' · áp khuôn' : ''}</div><div class="de"><b>Đề:</b> ${mathHtml(b.de)}${b.gia_thiet ? `<br><span class="m">GT: ${mathHtml(b.gia_thiet)}</span>` : ''}</div>${img ? `<img src="${img}">` : (b.anh ? `<div class="m">ảnh không tải được: ${esc(b.anh)}</div>` : '')}${buocHtml}</div>`)
      }
      const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Điền ô chứng minh — ${pass.length} bài</title>
<style>${katexCss()}
body{font:15px/1.5 system-ui;max-width:1000px;margin:24px auto;padding:0 16px}.bai{border:1px solid #ddd;border-radius:10px;padding:14px 16px;margin:14px 0}.m{color:#777;font-size:12px}
.de{background:#f7f7fa;padding:8px 10px;border-radius:6px;margin:6px 0}img{max-height:240px;max-width:100%;border:1px solid #eee;margin:6px 0;background:#fff}.buoc{margin:3px 0;padding-left:10px;border-left:3px solid #eee}.buoc.o{border-left-color:#e67e22;background:#fff8f0}
.blank{background:#ffe8cc;padding:0 6px;border-radius:4px;font-weight:600}.pa{display:grid;grid-template-columns:24px 1fr;gap:2px 8px;margin:4px 0 8px 18px;font-size:14px}.pa .d{background:#e8f7ec}.pa .loi{color:#a33;font-size:12px}</style></head><body>
<h1>Điền ô chứng minh hình khối ${lo.khoi} — ${pass.length} bài (nháp Claude, CEO duyệt)</h1>
<p class="m">Ô cam = chỗ trống HS phải chọn. Xanh = đáp án đúng. Đỏ = nhãn lỗi + vì sao sai (chỉ staff thấy).</p>
${blocks.join('\n')}
</body></html>`
      writeFileSync(opt('--xem'), html, 'utf8'); console.log('→', opt('--xem'), `(${Math.round(html.length / 1024)} KB)`)
    }
  } else if (has('--ap-khuon')) {
    // ÁP KHUÔN: đề xuất ô của bài GỐC (Claude viết tay) → nhân sang biến thể/cách giải trùng cùng khuôn (cùng mã BT.07.xxx)
    // bằng cách khớp BƯỚC theo bộ xương câu văn và ánh xạ TÊN GÓC + SỐ theo vị trí. Lệch cấu trúc / token không ánh xạ được ⇒ bỏ
    // biến thể đó (báo), không đoán (§1.5). Vị trí đáp án đúng xoay theo thứ tự biến thể để cân A/B/C/D.
    const goc = JSON.parse(readFileSync(opt('--ap-khuon'), 'utf8'))
    const lo = JSON.parse(readFileSync(opt('--lo'), 'utf8'))
    const sk = (t) => String(t).replace(/\$[^$]*\$/g, '⟨M⟩').replace(/\d+/g, '⟨N⟩').replace(/\b2 góc\b/g, 'hai góc').toLowerCase().replace(/[^a-zà-ỹ⟨⟩]+/g, '')
    const toks = (t) => [...String(t).matchAll(/\\widehat\s*\{\s*([^}]*?)\s*\}/g)].map((m) => m[1].replace(/\s+/g, ''))
    const nums = (t) => [...String(t).matchAll(/(?<![A-Za-z_{^])(\d+)(?![\d}])/g)].map((m) => m[1])
    const out = []; const log = []
    for (const g of goc.kq) {
      const base = lo.bai.find((b) => b.id.startsWith(g.id)); if (!base) { log.push(`gốc ${g.id} không trong lô`); continue }
      const khuon = base.ma.split('/')[0]
      const anhEm = lo.bai.filter((b) => b.ma.split('/')[0] === khuon)
      let vi = 0
      for (const v of anhEm) {
        const laGoc = v.id === base.id
        // 1) khớp bước: mỗi bước gốc → bước biến thể có cùng bộ xương (ưu tiên cùng chỉ số)
        const map = new Map(); let hong = null
        const pair = []
        for (const bb of base.buoc) {
          const cands = v.buoc.filter((vb) => sk(vb.text) === sk(bb.text))
          const vb = cands.find((x) => x.k === bb.k) ?? cands[0]
          if (vb) pair.push([bb, vb])
        }
        // Ánh xạ token từ các cặp bước khớp được. Cặp nào lệch số token thì BỎ QUA cặp đó (không ánh xạ từ nó), chỉ mâu thuẫn
        // thật (cùng token gốc → 2 token khác) mới bỏ biến thể. Hằng 180/90/360/1/2 không phải token đổi số.
        const HANG = new Set(['180', '90', '360', '1', '2'])
        for (const [bb, vb] of pair) {
          const a1 = toks(bb.text), a2 = toks(vb.text), n1 = nums(bb.text).filter((x) => !HANG.has(x)), n2 = nums(vb.text).filter((x) => !HANG.has(x))
          if (a1.length === a2.length) for (let i = 0; i < a1.length; i++) { const k = 'A:' + a1[i]; if (map.has(k) && map.get(k) !== a2[i]) { hong = `góc ${a1[i]} ánh xạ mâu thuẫn`; break } map.set(k, a2[i]) }
          if (hong) break
          if (n1.length === n2.length) for (let i = 0; i < n1.length; i++) { const k = 'N:' + n1[i]; if (map.has(k) && map.get(k) !== n2[i]) { hong = `số ${n1[i]} ánh xạ mâu thuẫn`; break } map.set(k, n2[i]) }
          if (hong) break
        }
        if (!laGoc && hong) { log.push(`${v.ma} [${v.id.slice(0, 8)}]: ${hong} — bỏ`); continue }
        const apMap = (t) => {
          let s = String(t); let thieu = null
          s = s.replace(/\\widehat\s*\{\s*([^}]*?)\s*\}/g, (m, a) => { const k = 'A:' + a.replace(/\s+/g, ''); if (!map.has(k)) { thieu = a; return m } return `\\widehat{${map.get(k)}}` })
          s = s.replace(/(?<![A-Za-z_{^\\])(\d+)(?![\d}])/g, (m, n) => (n === '180' || n === '90' || n === '360' || n === '2' || n === '1') ? m : (map.has('N:' + n) ? map.get('N:' + n) : (thieu ??= n, m)))
          return { s, thieu }
        }
        const oMoi = []; let loiO = null
        for (const o of g.o) {
          const bb = base.buoc.find((x) => x.k === o.buoc); const vb = pair.find(([b]) => b === bb)?.[1]
          if (!vb) { loiO = `bước ${o.buoc} không khớp`; break }
          let key = o.key, pa = o.phuong_an
          if (!laGoc) {
            if (o.kieu === 'ket_luan') {
              const r = apMap(o.key); if (r.thieu) { loiO = `key: token ${r.thieu} không ánh xạ`; break } key = r.s
              pa = []; for (const p of o.phuong_an) { const rp = apMap(p.text); if (rp.thieu) { loiO = `phương án: token ${rp.thieu} không ánh xạ`; break } const vs = p.vi_sao_sai ? apMap(p.vi_sao_sai).s : p.vi_sao_sai; pa.push({ ...p, text: rp.s, vi_sao_sai: vs }) }
              if (loiO) break
            } else {
              // ô lý do: tìm cụm tương đương trong bước biến thể theo mã LD của key gốc
              const ma = maLyDo(o.key); const x = LD.get(ma)
              const t = vb.text.toLowerCase(); const hit = [x?.ten, ...(x?.tuong_duong ?? [])].filter(Boolean).map((s) => s.toLowerCase()).find((s) => t.includes(s))
              if (!hit) { loiO = `lý do ${ma} không thấy ở bước ${vb.k}`; break }
              key = vb.text.slice(t.indexOf(hit), t.indexOf(hit) + hit.length)
            }
          }
          if (!norm(vb.text).includes(norm(key))) { loiO = `key không nằm trong bước ${vb.k}`; break }
          // xoay vị trí đúng theo thứ tự biến thể
          const rot = laGoc ? 0 : (vi % 4)
          const pa2 = pa.map((p, i) => pa[(i + rot) % 4]); const dap_an = 'ABCD'[pa2.findIndex((p) => p.dung)]
          oMoi.push({ ...o, buoc: vb.k, key, phuong_an: pa2, dap_an })
        }
        if (loiO) { log.push(`${v.ma} [${v.id.slice(0, 8)}]: ${loiO} — bỏ`); continue }
        out.push({ id: v.id, ma: v.ma, khuon, ap_khuon: !laGoc, o: oMoi }); vi++
      }
    }
    for (const b of goc.bo ?? []) for (const v of lo.bai.filter((x) => x.ma.split('/')[0] === b.ma)) out.push({ id: v.id, ma: v.ma, bo: b.ly_do })
    writeFileSync(opt('--out', 'kq.json'), JSON.stringify(out, null, 1), 'utf8')
    console.log(`Áp khuôn: ${out.filter((x) => !x.bo).length} bài có ô (gốc ${out.filter((x) => x.ap_khuon === false).length} + áp ${out.filter((x) => x.ap_khuon).length}) · bỏ ${out.filter((x) => x.bo).length} · lỗi áp ${log.length}`)
    for (const l of log) console.log('  ', l)
  } else if (has('--ghi')) {
    // GHI form vào hinh_form_dien (da_duyet=false) — mỗi bài 1 transaction; bài đã có form hiệu lực → bỏ qua. Trigger DB kiểm lại.
    const { createHash } = await import('node:crypto')
    const kq = JSON.parse(readFileSync(opt('--ghi'), 'utf8')); const lo = JSON.parse(readFileSync(opt('--lo'), 'utf8'))
    const byId = new Map(lo.bai.map((b) => [b.id, b])); const model = opt('--model', 'claude-fable-5-1')
    let n = 0, skip = 0, loi = 0
    for (const it of kq) {
      if (it.bo) continue
      const b = byId.get(it.id); if (!b) { loi++; console.error('✖ không trong lô', it.id); continue }
      const buoc = b.buoc.map((x) => ({ k: x.k, text: x.text }))
      const o = it.o.map((x, i) => ({ id: `o${i + 1}`, kieu: x.kieu, buoc: x.buoc, key: x.key, dap_an: x.dap_an,
        phuong_an: x.phuong_an.map((p) => (x.kieu === 'ly_do' ? { ma: p.ma, dung: !!p.dung, ...(p.dung ? {} : { loi: p.loi, vi_sao_sai: p.vi_sao_sai ?? null }) }
                                                            : { text: p.text, dung: !!p.dung, ...(p.dung ? {} : { loi: p.loi, vi_sao_sai: p.vi_sao_sai ?? null }) })) }))
      const bam = createHash('md5').update(b.loi_giai, 'utf8').digest('hex')
      const col = b.loai === 'cach' ? 'cach_giai_id' : 'bien_the_id'
      await c.query('begin')
      try {
        const r = await c.query(`insert into hinh_form_dien (${col}, loi_giai_bam, buoc, o, nguon, ai_model)
          select $1, $2, $3::jsonb, $4::jsonb, 'ai', $5 where not exists (select 1 from hinh_form_dien f where f.${col} = $1 and f.xoa_at is null) returning id`,
          [b.id, bam, JSON.stringify(buoc), JSON.stringify(o), model])
        await c.query('commit'); if (r.rowCount) n++; else skip++
      } catch (e) { await c.query('rollback'); loi++; console.error(`✖ ${b.ma}: ${e.message}`) }
    }
    console.log(`Đã ghi ${n} form (da_duyet=false) · bỏ qua ${skip} đã có · lỗi ${loi}`)
  } else console.log('Dùng: --list --khoi 7 --out lo.json | --ap-khuon goc.json --lo lo.json --out kq.json | --verify kq.json --lo lo.json [--xem out.html] | --ghi kq.json --lo lo.json')
} finally { await c.end() }
