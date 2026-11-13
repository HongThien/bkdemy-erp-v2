// so-do-html.mjs — vẽ SƠ ĐỒ TƯ DUY (Thùy 14/11, bảng hinh_hoc_cau_so_do) cho trang duyệt HTML (không đọc DB).
// Một đồ thị mốc → 2 chiều: XUÔI (ô trái → phải, hết hàng xuống dòng; đúng thứ tự khúc lời giải) và NGƯỢC (phân tích đi lên = Phần 1 cũ).
// Lời giải: dòng `[[so-do:<k>]]` ⇒ dải highlight "③ <mốc>" (số = vị trí ô, suy lúc vẽ; khoá k bất biến).
// Khuôn trong tệp soạn: xem docSoDo() trong scripts/kho/de-thi/dung-de-tu-soan.mjs (cổng kiểm ở đó — file này chỉ VẼ).

const SO = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'

/** Đọc khối "**Sơ đồ tư duy** …" (đến trước "**Phần 2. Trình bày**") của một câu trong tệp soạn. null nếu câu không có sơ đồ. */
export function docKhoiSoDo(cauMd) {
  const i = cauMd.indexOf('**Sơ đồ tư duy**'), j = cauMd.indexOf('**Phần 2. Trình bày**')
  if (i < 0 || j < i) return null
  let mauChot = ''; const nut = []
  for (const d of cauMd.slice(i, j).split('\n').map((s) => s.trim())) {
    const m = d.match(/^\*\*Mấu chốt:\*\*\s*(.+)$/)
    if (m) { mauChot = m[1]; continue }
    if (!d.startsWith('- ')) continue
    const [k, y, noi, tu, ly] = d.slice(2).split(' | ').map((s) => s.trim())
    nut.push({ k, y, noi_dung: noi, tu: tu.split(',').map((s) => s.trim()).filter(Boolean), ...(ly ? { ly_do: ly } : {}) })
  }
  return { mau_chot: mauChot, nut }
}

const soCua = (sd) => Object.fromEntries(sd.nut.map((o, i) => [o.k, SO[i] ?? `(${i + 1})`]))
const tuChip = (sd, o, toi) => {
  const so = soCua(sd)
  return o.tu.map((t) => t === 'gt' ? '<span class="sd-chip sd-gt">gt</span>' : `<span class="sd-chip">${so[t]}</span>`).join('')
}

/** HTML khối "Xem sơ đồ tư duy" (ẩn mặc định, 2 tab Xuôi / Ngược). `toi` = hàm render chữ + công thức của trang. */
export function htmlSoDo(sd, toi, id) {
  const so = soCua(sd)
  const xuoi = sd.nut.map((o, i) => `${i ? '<span class="sd-mui" aria-hidden="true">→</span>' : ''}<div class="sd-o${i === sd.nut.length - 1 || sd.nut[i + 1]?.y !== o.y ? ' sd-cuoi-y' : ''}">
<div class="sd-dau"><span class="sd-so">${so[o.k]}</span>${o.y !== '-' ? `<span class="sd-y">ý ${o.y}</span>` : ''}<span class="sd-tu">từ ${tuChip(sd, o, toi)}</span></div>
<div class="sd-moc">${toi(o.noi_dung)}</div>${o.ly_do ? `<div class="sd-ly">${toi(o.ly_do)}</div>` : ''}</div>`).join('')
  const nguoc = [...sd.nut].reverse().map((o) => {
    const can = o.tu.map((t) => t === 'gt' ? 'giả thiết' : `${so[t]} ${toi(sd.nut.find((x) => x.k === t).noi_dung)}`)
    return `<div class="sd-ng"><div class="sd-ng-dich"><span class="sd-so">${so[o.k]}</span> Muốn có ${toi(o.noi_dung)}</div>
<div class="sd-ng-can"><span class="sd-ng-mui">⇑</span> cần ${can.join(' <b>và</b> ')}${o.ly_do ? ` <span class="sd-ly">— ${toi(o.ly_do)}</span>` : ''}</div></div>`
  }).join('')
  return `<details class="sd"><summary>🧠 Xem sơ đồ tư duy</summary>
<div class="sd-mc"><b>Mấu chốt:</b> ${toi(sd.mau_chot)}</div>
<div class="sd-tab" role="tablist"><label><input type="radio" name="sd-${id}" checked> Xuôi — trình bày</label><label><input type="radio" name="sd-${id}"> Ngược — phân tích</label></div>
<div class="sd-xuoi">${xuoi}</div><div class="sd-nguoc">${nguoc}</div></details>`
}

/** Đổi đoạn `[[so-do:k]]` thành dải highlight đầu khúc; đoạn "a)" đứng một mình thành nhãn ý. */
export function htmlDoanLoiGiai(doanMd, sd, toi) {
  const so = sd ? soCua(sd) : {}
  return doanMd.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean).map((x) => {
    const m = x.match(/^\[\[so-do:(n\d+)\]\]$/)
    if (m && sd) { const o = sd.nut.find((q) => q.k === m[1]); return `<div class="sd-khuc"><span class="sd-so">${so[m[1]]}</span> ${o ? toi(o.noi_dung) : '?'}</div>` }
    if (/^[a-h]\)$/.test(x)) return `<p class="sd-ynhan">${x}</p>`
    return `<p>${toi(x)}</p>`
  }).join('')
}

export const CSS_SO_DO = `
.sd{margin:8px 0;border:1px solid var(--vien);border-radius:10px;padding:6px 10px;background:var(--nen)}
.sd summary{font-weight:600;color:var(--nhan)}
.sd-mc{margin:8px 0;padding:6px 10px;border-left:4px solid var(--cb);background:var(--the);border-radius:6px}
.sd-tab{display:flex;gap:16px;margin:6px 0;font-size:.95em}.sd-tab label{cursor:pointer}
.sd-xuoi{display:flex;flex-wrap:wrap;align-items:stretch;gap:6px 4px}
.sd:has(.sd-tab label:nth-child(2) input:checked) .sd-xuoi{display:none}
.sd:has(.sd-tab label:nth-child(1) input:checked) .sd-nguoc{display:none}
.sd-o{flex:0 1 210px;min-width:150px;background:var(--the);border:1.5px solid var(--nhan);border-radius:8px;padding:6px 8px}
.sd-cuoi-y{border-width:2.5px}
.sd-mui{align-self:center;color:var(--nhan);font-weight:700;font-size:1.2em}
.sd-dau{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:.82em;color:var(--mo)}
.sd-so{font-weight:700;color:var(--nhan);font-size:1.15em}.sd-y{background:var(--nen);border-radius:4px;padding:0 5px}
.sd-chip{border:1px solid var(--vien);border-radius:9px;padding:0 5px;margin-left:2px}.sd-gt{color:var(--ok)}
.sd-moc{margin:4px 0;font-weight:600}.sd-ly{font-size:.86em;color:var(--mo)}
.sd-ng{background:var(--the);border:1px solid var(--vien);border-radius:8px;padding:6px 10px;margin:6px 0}
.sd-ng-dich{font-weight:600}.sd-ng-can{margin-left:12px}.sd-ng-mui{color:var(--nhan);font-weight:700}
.sd-khuc{margin:12px 0 4px;padding:5px 10px;border-radius:6px;background:rgba(45,156,219,.14);border-left:4px solid var(--nhan);font-weight:600}
.sd-ynhan{font-weight:700;margin:14px 0 0}
`
