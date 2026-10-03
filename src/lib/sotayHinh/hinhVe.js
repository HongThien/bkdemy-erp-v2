// @ts-nocheck
/* eslint-disable */
// ============================================================================
// HÌNH VẼ BẰNG MÃ — chép NGUYÊN VĂN từ KHTN Pocket (artifact "Sổ tay KHTN 6–9", GV đã duyệt) bằng scripts/sotay-khtn/chep-hinh-ve.mjs.
// ĐỪNG SỬA TAY — chạy lại script. Phần BK thêm chỉ ở CUỐI file (export veHinh).
// Cách dùng: veHinh('[bohr:10:Ne]') ⇒ chuỗi HTML chứa <svg>; mã lạ / lỗi ⇒ trả lại chính mã (đã escape) để người soạn thấy mà sửa.
// Tương tác gốc (chạm bộ phận tế bào / sơ đồ ⇒ hiện tên + chức năng) gắn 1 lần vào document khi module được nạp.
// ============================================================================

// ── hàm phụ (từ các module khác của Pocket) ──
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function shellsOf(z) {
  const out = []; let rem = z;
  for (const cap of [2, 8, 8, 2]) { if (rem <= 0) break; const k = Math.min(cap, rem); out.push(k); rem -= k; }
  return out;
}

function bohrG(z, cx, cy, o = {}) {
  const sh = o.shells || shellsOf(z), sym = o.sym || byZ(z).sym;
  let g = `<circle cx="${cx}" cy="${cy}" r="11" class="bh-n"/><text x="${cx}" y="${cy + 4}" class="bh-s">${sym}</text>`;
  sh.forEach((n, i) => {
    const r = 18 + i * 10, last = i === sh.length - 1;
    g += `<circle cx="${cx}" cy="${cy}" r="${r}" class="bh-o${n ? '' : ' empty'}"/>`;
    const acc = last ? (o.acc || 0) : 0;
    for (let k = 0; k < n; k++) {
      const a = (-90 + 360 * k / n + (i % 2) * 20) * Math.PI / 180;
      g += `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(cy + r * Math.sin(a)).toFixed(1)}" r="3.2" class="bh-e${k >= n - acc ? ' acc' : ''}"/>`;
    }
  });
  return g;
}

function bkBohr(spec, lab) {
  const sh = spec.includes('-') ? spec.split('-').filter(x => x !== '').map(Number) : (typeof shellsOf === 'function' ? shellsOf(+spec) : []);
  if (!sh.length || sh.some(n => !(n >= 0))) return '';
  const R = 18 + (sh.length - 1) * 10 + 6;
  return `<span class="bk-bohr"><svg class="bohr" viewBox="${-R} ${-R} ${2 * R} ${2 * R}" width="${2 * R}" height="${2 * R}" role="img" aria-label="Mô hình nguyên tử: ${sh.join(', ')}">${bohrG(0, 0, 0, {shells: sh, sym: lab || '?'})}</svg></span>`;
}

/* fig.js */
/* HÌNH VẼ BẰNG MÃ trong câu hỏi ngân hàng — người soạn chỉ viết số liệu, app tự vẽ (không cần file ảnh).
   Dùng trong đề hoặc trong từng phương án. Cú pháp (số thập phân dùng dấu phẩy):
   [bohr:11] [bohr:11:Na] [bohr:2-8-1] [bohr:8-]           mô hình nguyên tử (Hóa); [bohr:8-] = chỉ 1 lớp 8 e
   [dothi:0 0; 2 100; 4 100 | t (s) | s (m)]              đồ thị đường; nhiều đường cách nhau "/" (đường A, B…)
   [song:3 2]                                             đồ thị dao động âm: 3 dao động trong khung, biên độ 2 (1–4)
   [guong:30] [guong:30 30] [guong:30 45 so]              gương phẳng: góc tới 30°; số thứ hai = góc của tia phản xạ vẽ ra; "so" ghi số đo góc
   [anh:3 3] [anh:3 2] [anh:3 3 nguoc] [anh:3 3 mat]      ảnh qua gương phẳng: vật cách gương 3 ô, ảnh cách gương 3 ô; "nguoc" = ảnh lộn ngược (sai);
                                                          "mat" vẽ mắt M và tia A → I → M; "matsai" = điểm tới I đặt sai
   [namcham:NS] [namcham:?? duong] [namcham:NS kim]       nam châm thẳng; "duong" vẽ đường sức; "kim" vẽ kim la bàn; "sai" đảo chiều mũi tên / kim
                                                          "??" = chưa ghi cực (Bắc thật bên trái); thêm "nphai" nếu Bắc thật bên phải
   [bong:1] [bong:2] [bong:2 so]                          nguồn sáng nhỏ (1) hoặc rộng (2), vật cản, màn; "so" chỉ đánh số vùng 1-2-3, không tô màu */

const figNum = s => parseFloat(String(s).trim().replace(',', '.'));
const figFmt = n => (Math.round(n * 100) / 100).toString().replace('.', ',');
const figSub = s => esc(String(s)).replace(/([A-Za-z\)])(\d+)/g, (m, a, d) => a + d.split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[+c]).join(''));
const figSvg = (w, h, body, label) => `<span class="bk-fig"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">${body}</svg></span>`;
const figArrow = (x1, y1, x2, y2, cls = 'fg-ray') => { const a = Math.atan2(y2 - y1, x2 - x1), L = 7;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/><path d="M${x2} ${y2} L${(x2 - L * Math.cos(a - .45)).toFixed(1)} ${(y2 - L * Math.sin(a - .45)).toFixed(1)} M${x2} ${y2} L${(x2 - L * Math.cos(a + .45)).toFixed(1)} ${(y2 - L * Math.sin(a + .45)).toFixed(1)}" class="${cls}"/>`; };
const figMid = (x1, y1, x2, y2, cls = 'fg-ray') => { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>` + figArrow(x1 + (mx - x1) * .9, y1 + (my - y1) * .9, mx, my, cls); };
// Chia trục đẹp: bước 1 / 2 / 2,5 / 5 × 10ⁿ, tối đa 5 khoảng
function figTicks(v) { if (!(v > 0)) return {step: 1, n: 1}; const p = Math.pow(10, Math.floor(Math.log10(v)) - 1);
  for (const m of [1, 2, 2.5, 5, 10, 20, 25, 50, 100]) { const step = m * p, n = Math.ceil(v / step - 1e-9); if (n <= 5) return {step, n}; } return {step: v, n: 1}; }

const FIG = {
  bohr(a) { const [sp, lab] = a.split(':'); return typeof bkBohr === 'function' ? bkBohr(sp.trim(), lab && lab.trim()) : ''; },

  dothi(a) {
    const [data, lx = '', ly = ''] = a.split('|');
    const series = data.split('/').map(s => s.split(';').map(p => p.trim().split(/\s+/).map(figNum)).filter(p => p.length === 2 && p.every(isFinite))).filter(s => s.length);
    if (!series.length) return '';
    const all = series.flat(), W = 260, H = 180, L = 40, B = 34, T = 12, R = 14;
    const tx = figTicks(Math.max(...all.map(p => p[0]))), ty = figTicks(Math.max(...all.map(p => p[1]))), xs = tx.step * tx.n, ys = ty.step * ty.n;
    const X = x => L + x / xs * (W - L - R), Y = y => H - B - y / ys * (H - B - T);
    let g = '';
    for (let k = 0; k <= tx.n; k++) { const vx = tx.step * k;
      g += `<line x1="${X(vx)}" y1="${T}" x2="${X(vx)}" y2="${H - B}" class="fg-grid"/><text x="${X(vx)}" y="${H - B + 13}" class="fg-t" text-anchor="middle">${figFmt(vx)}</text>`; }
    for (let k = 0; k <= ty.n; k++) { const vy = ty.step * k;
      g += `<line x1="${L}" y1="${Y(vy)}" x2="${W - R}" y2="${Y(vy)}" class="fg-grid"/><text x="${L - 5}" y="${Y(vy) + 4}" class="fg-t" text-anchor="end">${figFmt(vy)}</text>`; }
    g += figArrow(L, H - B, W - 4, H - B, 'fg-ax') + figArrow(L, H - B, L, 4, 'fg-ax');
    g += `<text x="${W - 4}" y="${H - 4}" class="fg-t b" text-anchor="end">${figSub(lx.trim())}</text><text x="${L + 5}" y="10" class="fg-t b">${figSub(ly.trim())}</text>`;
    series.forEach((s, i) => { const pts = s.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ');
      g += `<polyline points="${pts}" class="fg-line s${i % 3}"/>` + s.map(p => `<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="2.6" class="fg-dot s${i % 3}"/>`).join('');
      if (series.length > 1) { const p = s[s.length - 1]; g += `<text x="${(X(p[0]) - 4).toFixed(1)}" y="${(Y(p[1]) - 6).toFixed(1)}" class="fg-t b s${i % 3}" text-anchor="end">${'ABC'[i]}</text>`; } });
    return figSvg(W, H, g, `Đồ thị ${lx} – ${ly}`);
  },

  song(a) {
    const [n, A] = a.trim().split(/\s+/).map(figNum); if (!(n > 0) || !(A > 0)) return '';
    const W = 240, H = 110, mid = H / 2, amp = Math.min(4, A) * 11, x0 = 14, x1 = W - 10;
    let d = ''; for (let k = 0; k <= 240; k++) { const x = x0 + (x1 - x0) * k / 240, y = mid - amp * Math.sin(2 * Math.PI * n * k / 240); d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
    let g = `<line x1="${x0}" y1="${mid}" x2="${x1}" y2="${mid}" class="fg-grid"/>` + figArrow(x0, H - 6, x1 + 4, H - 6, 'fg-ax') + `<text x="${x1}" y="${H - 10}" class="fg-t" text-anchor="end">t</text>`;
    for (let k = -4; k <= 4; k++) g += `<line x1="${x0}" y1="${mid - k * 11}" x2="${x0 + 4}" y2="${mid - k * 11}" class="fg-ax"/>`;
    return figSvg(W, H, g + `<path d="${d}" class="fg-line s0"/>`, `Đồ thị dao động: ${n} dao động, biên độ ${A}`);
  },

  guong(a) {
    const t = a.trim().split(/\s+/), i = figNum(t[0]), r = t[1] && isFinite(figNum(t[1])) ? figNum(t[1]) : null, so = t.includes('so');
    if (!(i >= 0 && i < 90)) return '';
    const W = 240, H = 150, cx = 120, cy = 118, len = 95, rad = x => x * Math.PI / 180;
    const sx = cx - len * Math.sin(rad(i)), sy = cy - len * Math.cos(rad(i));
    let g = `<line x1="20" y1="${cy}" x2="${W - 20}" y2="${cy}" class="fg-mirror"/>` + Array.from({length: 12}, (_, k) => `<line x1="${24 + k * 17}" y1="${cy + 2}" x2="${16 + k * 17}" y2="${cy + 10}" class="fg-ax"/>`).join('');
    g += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="16" class="fg-norm"/><text x="${cx + 4}" y="16" class="fg-t b">N</text>`;
    g += figMid(sx, sy, cx, cy) + `<text x="${sx - 10}" y="${sy}" class="fg-t b">S</text><text x="${cx - 4}" y="${cy + 24}" class="fg-t b">I</text>`;
    const arc = (deg, side, lab) => { const rr = 26, a0 = rad(0), a1 = rad(deg), sg = side < 0 ? -1 : 1;
      const p1 = [cx, cy - rr], p2 = [cx + sg * rr * Math.sin(a1), cy - rr * Math.cos(a1)];
      return `<path d="M${p1[0]} ${p1[1]} A${rr} ${rr} 0 0 ${sg > 0 ? 1 : 0} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}" class="fg-arc"/>` + (lab ? `<text x="${(cx + sg * 40 * Math.sin(rad(deg / 2))).toFixed(1)}" y="${(cy - 40 * Math.cos(rad(deg / 2)) + 4).toFixed(1)}" class="fg-t" text-anchor="middle">${lab}</text>` : ''); };
    g += arc(i, -1, so ? i + '°' : 'i');
    if (r != null) { const rx = cx + len * Math.sin(rad(r)), ry = cy - len * Math.cos(rad(r));
      g += figMid(cx, cy, rx, ry) + `<text x="${rx + 4}" y="${ry}" class="fg-t b">R</text>` + arc(r, 1, so ? r + '°' : 'i′'); }
    return figSvg(W, H, g, `Gương phẳng, góc tới ${i} độ${r != null ? `, tia phản xạ ${r} độ` : ''}`);
  },

  anh(a) {
    const t = a.trim().split(/\s+/), dv = figNum(t[0]), da = figNum(t[1] == null || !isFinite(figNum(t[1])) ? t[0] : t[1]), nguoc = t.includes('nguoc'), mat = t.includes('mat') || t.includes('matsai'), msai = t.includes('matsai');
    if (!(dv > 0 && da > 0)) return '';
    const u = 22, W = 260, H = 130, gx = W / 2, base = 100, h = 3 * u;
    let g = `<line x1="${gx}" y1="12" x2="${gx}" y2="${base + 12}" class="fg-mirror"/>` + Array.from({length: 7}, (_, k) => `<line x1="${gx + 2}" y1="${18 + k * 15}" x2="${gx + 9}" y2="${12 + k * 15}" class="fg-ax"/>`).join('');
    for (let k = -5; k <= 5; k++) g += `<line x1="${gx + k * u}" y1="${base}" x2="${gx + k * u}" y2="${base + 5}" class="fg-ax"/>`;
    g += `<line x1="10" y1="${base}" x2="${W - 10}" y2="${base}" class="fg-grid"/>`;
    const vx = gx - dv * u, ax = gx + da * u;
    g += figArrow(vx, base, vx, base - h, 'fg-obj') + `<text x="${vx - 14}" y="${base - h + 4}" class="fg-t b">A</text><text x="${vx - 14}" y="${base + 4}" class="fg-t b">B</text>`;
    g += (nguoc ? figArrow(ax, base - h, ax, base, 'fg-img') : figArrow(ax, base, ax, base - h, 'fg-img')) + `<text x="${ax + 5}" y="${(nguoc ? base : base - h) + 4}" class="fg-t b">A′</text><text x="${ax + 5}" y="${(nguoc ? base - h : base) + 4}" class="fg-t b">B′</text>`;
    if (mat) {   // mắt M phía trước gương; tia từ đỉnh A tới gương tại I rồi tới mắt (đường kéo dài từ ảnh A′ qua I tới mắt). "matsai": I đặt sai (ngang tầm mắt)
      const ex = gx - 1.5 * u, ey = base - 0.9 * u, ay = base - h, ix = gx;
      const iy = msai ? ey : ay + (ey - ay) * (ax - gx) / (ax - ex);
      g += `<line x1="${ax}" y1="${ay}" x2="${ix}" y2="${iy.toFixed(1)}" class="fg-norm"/>` + figMid(vx, ay, ix, iy) + figMid(ix, iy, ex + 6, ey)
        + `<path d="M${ex - 10} ${ey} Q${ex} ${ey - 8} ${ex + 10} ${ey} Q${ex} ${ey + 8} ${ex - 10} ${ey} Z" class="fg-comp"/><circle cx="${ex}" cy="${ey}" r="3" class="fg-kn"/>`
        + `<text x="${ex - 4}" y="${ey + 20}" class="fg-t b">M</text><text x="${ix + 5}" y="${(iy - 4).toFixed(1)}" class="fg-t b">I</text>`;
    }
    return figSvg(W, H, g, `Vật cách gương ${dv} ô, ảnh cách gương ${da} ô${nguoc ? ', ảnh lộn ngược' : ''}${mat ? ', tia sáng từ A qua gương tới mắt M' : ''}`);
  },

  namcham(a) {
    const t = a.trim().split(/\s+/), p = (t[0] || 'NS').toUpperCase().slice(0, 2).split(''), duong = t.includes('duong'), kim = t.includes('kim'), sai = t.includes('sai');
    if (p.length < 2 || p.some(c => !'NS?'.includes(c))) return '';
    const W = 260, H = 160, cx = 130, cy = 80, bw = 110, bh = 28, L = cx - bw / 2, Rr = cx + bw / 2;
    const real = p[0] === 'S' || p[1] === 'N' || t.includes('nphai') ? -1 : 1;   // 1: cực Bắc bên trái; [namcham:?? kim nphai] = cực chưa ghi nhưng Bắc thật ở bên phải
    const dir = (sai ? -1 : 1) * real;                                   // chiều đường sức bên ngoài: từ N sang S
    let g = '';
    if (duong) [[26, 1], [48, 1], [26, -1], [48, -1]].forEach(([k, s]) => {
      g += `<path d="M${L} ${cy} C ${L - 10} ${cy - s * k * 1.9}, ${Rr + 10} ${cy - s * k * 1.9}, ${Rr} ${cy}" class="fg-field"/>`;
      const y = cy - s * k * 1.43; g += figArrow(cx - 6 * dir, y, cx + 6 * dir, y, 'fg-field a'); });
    if (duong) g += figMid(dir > 0 ? L : 18, cy, dir > 0 ? 18 : L, cy, 'fg-field a') + figMid(dir > 0 ? W - 18 : Rr, cy, dir > 0 ? Rr : W - 18, cy, 'fg-field a');
    const col = c => c === 'N' ? 'fg-n' : c === 'S' ? 'fg-s' : 'fg-q';
    g += `<rect x="${L}" y="${cy - bh / 2}" width="${bw / 2}" height="${bh}" class="${col(p[0])}"/><rect x="${cx}" y="${cy - bh / 2}" width="${bw / 2}" height="${bh}" class="${col(p[1])}"/>`
      + `<text x="${L + bw / 4}" y="${cy + 6}" class="fg-pole" text-anchor="middle">${p[0]}</text><text x="${cx + bw / 4}" y="${cy + 6}" class="fg-pole" text-anchor="middle">${p[1]}</text>`;
    if (kim) [[L - 34, cy, -1], [Rr + 34, cy, -1], [cx, cy - 58, 1], [cx, cy + 58, 1]].forEach(([x, y, s]) => {
      const d = s * dir, n = 13;                                          // mũi đỏ = cực Bắc của kim, chỉ theo chiều đường sức
      g += `<circle cx="${x}" cy="${y}" r="16" class="fg-comp"/><path d="M${x + d * n} ${y} L${x} ${y - 4} L${x} ${y + 4} Z" class="fg-kn"/><path d="M${x - d * n} ${y} L${x} ${y - 4} L${x} ${y + 4} Z" class="fg-ks"/>`; });
    return figSvg(W, H, g, `Nam châm thẳng ${p.join('–')}${duong ? ', có đường sức' : ''}${kim ? ', có kim la bàn' : ''}`);
  },

  bong(a) {
    const t = a.trim().split(/\s+/), rong = figNum(t[0]) === 2, so = t.includes('so');
    const W = 260, H = 160, sx = 30, ox = 120, mx = 230, oy1 = 58, oy2 = 102, cy = 80, S = rong ? [cy - 16, cy + 16] : [cy, cy];
    const at = (y0, y1) => y0 + (y1 - y0) * (mx - sx) / (ox - sx);       // tia từ điểm nguồn (sx, y0) qua mép vật (ox, y1) tới màn
    const u1 = at(S[0], oy1), u2 = at(S[1], oy2), p1 = at(S[1], oy1), p2 = at(S[0], oy2);   // u: biên vùng tối, p: biên ngoài vùng nửa tối
    let g = '';
    if (!so) { if (rong) g += `<polygon points="${ox},${oy1} ${mx},${p1} ${mx},${u1}" class="fg-pen"/><polygon points="${ox},${oy2} ${mx},${p2} ${mx},${u2}" class="fg-pen"/>`;
      g += `<polygon points="${ox},${oy1} ${mx},${u1} ${mx},${u2} ${ox},${oy2}" class="fg-umb"/>`; }
    S.forEach(y0 => { g += `<line x1="${sx}" y1="${y0}" x2="${mx}" y2="${at(y0, oy1)}" class="fg-lray"/><line x1="${sx}" y1="${y0}" x2="${mx}" y2="${at(y0, oy2)}" class="fg-lray"/>`; });
    g += rong ? `<rect x="${sx - 5}" y="${S[0]}" width="10" height="${S[1] - S[0]}" rx="4" class="fg-sun"/>` : `<circle cx="${sx}" cy="${cy}" r="6" class="fg-sun"/>`;
    g += `<rect x="${ox - 4}" y="${oy1}" width="8" height="${oy2 - oy1}" class="fg-block"/><line x1="${mx}" y1="8" x2="${mx}" y2="${H - 8}" class="fg-mirror"/>`;
    const lab = (y, k) => `<text x="${mx + 6}" y="${y + 4}" class="fg-t b">${k}</text>`;
    if (so) g += lab((u1 + u2) / 2, 2) + (rong ? lab((p1 + u1) / 2, 1) + lab((p2 + u2) / 2, 3) : lab(18, 1) + lab(H - 18, 3));
    return figSvg(W, H, g, `Nguồn sáng ${rong ? 'rộng' : 'nhỏ'}, vật cản và màn chắn`);
  },
};
const FIG_RE = /\[(bohr|dothi|song|guong|anh|namcham|bong|thaukinh|langkinh|dna|mach|donbay|tebao|punnett|ph|archimedes|apsuat|binhthong|luoi|tuanhoan|phatrang|novinhiet|conlac|vongdoi|conlac2|mang|khucxa|camung|sodo|ctct|thukhi|nst|phahe|docao|hainc|machhh|oersted|bangkep|chumsang|lienket|caysusong|hoa|mat|tai|khop|tuyen|than|thaptuoi):([^\]]*)\]/g;   // thaukinh, langkinh, dna ở fig2.js
// Tách mã hình ra trước khi định dạng chữ (để fmt không đụng vào số liệu), vẽ xong mới ghép lại
function figText(s, fmtFn) {
  const keep = [];
  const t = String(s || '').replace(FIG_RE, (m, k, a) => { keep.push([k, a, m]); return `\u0000${keep.length - 1}\u0000`; });
  return fmtFn(t).replace(/\u0000(\d+)\u0000/g, (m, i) => { const [k, a, raw] = keep[+i]; let h = ''; try { h = FIG[k](a); } catch (e) { h = ''; } return h || esc(raw); });
}

;

/* fig2.js */
/* HÌNH VẼ BẰNG MÃ (bổ sung): thấu kính, lăng kính, DNA – RNA. Dựng theo đúng quang học / nguyên tắc bổ sung, không vẽ ước lượng.
   [thaukinh:ht 3 1,2 2]      thấu kính HỘI TỤ, vật cách thấu kính d = 3, cao h = 1,2, tiêu cự f = 2 (cùng đơn vị bất kì)
   [thaukinh:pk 3 1,2 2]      thấu kính PHÂN KÌ; thêm "noanh" = chỉ vẽ tia tới, không vẽ ảnh (để học sinh tự dựng)
       Ảnh tính theo công thức thấu kính mỏng; tia vẽ: tia song song trục chính, tia qua quang tâm O (+ tia qua F với ảnh thật).
       Quy ước nhãn: F ở bên có vật, F′ ở bên kia. TKHT: tia song song → tia ló qua F′. TKPK: tia song song → đường kéo dài của tia ló qua F.
   [langkinh:tia]             một tia sáng đơn sắc qua lăng kính (chiết suất 1,5, góc chiết quang 60°), lệch về phía đáy
   [thaukinh:… an] [langkinh:… an]   dùng trong câu hỏi: không ghi chú thích tính chất ảnh / đường đi tia (nếu hỏi về ảnh thì thêm cả "noanh")
   [langkinh:tansac]          ánh sáng trắng qua lăng kính tách thành 7 màu, đỏ lệch ít nhất, tím lệch nhiều nhất (độ tách vẽ phóng đại)
   [dna:TACGGA]               hai mạch DNA (mạch 2 bổ sung: A–T 2 liên kết hydrogen, G–C 3 liên kết)
   [dna:TACGGA mrna]          thêm mRNA phiên mã từ mạch 1 (mạch khuôn): A→U, T→A, G→C, C→G; thêm "codon" để chia bộ ba */

const FIG_BASE = {A: '#2E9C7E', T: '#E4572E', G: '#E0A11B', C: '#3F82C4', U: '#8B6AD0'};

Object.assign(FIG, {
  thaukinh(a) {
    const t = a.trim().split(/\s+/), ht = t[0] !== 'pk', noanh = t.includes('noanh'), an = t.includes('an');   // "an": dùng trong câu hỏi, không ghi tính chất ảnh
    const n = t.slice(1).map(figNum).filter(x => isFinite(x));
    const d = n[0] > 0 ? n[0] : 3, h = n[1] > 0 ? n[1] : 1, f = n[2] > 0 ? n[2] : 2;
    // Ảnh (quy ước: di > 0 ảnh ở bên kia thấu kính = ảnh thật; di < 0 ảnh cùng bên vật = ảnh ảo)
    let di = null, hi = null, cap;
    if (ht) {
      if (Math.abs(d - f) < 1e-9) cap = 'Vật ở tiêu điểm: chùm tia ló song song, không tạo ảnh';
      else { di = d * f / (d - f); hi = -h * di / d; }
    } else { di = -d * f / (d + f); hi = -h * di / d; }
    const xa = di != null && Math.abs(di) <= 6 * f;                       // ảnh ở rất xa thì không vẽ
    if (di != null && !cap) {
      const k = Math.abs(hi) / h, co = k > 1.02 ? 'lớn hơn vật' : k < 0.98 ? 'nhỏ hơn vật' : 'bằng vật';
      cap = di > 0 ? `Ảnh thật, ngược chiều, ${co}` : `Ảnh ảo, cùng chiều, ${co}`;
      if (!xa) cap += ' (ảnh ở rất xa)';
    }
    // Khung và tỉ lệ (cùng tỉ lệ ngang – dọc để góc đúng)
    const W = 320, H = 200, P = 22;
    const xs = [-d, -f * 1.15, f * 1.15, ...(xa && !noanh ? [di] : [])], ys = [h, ...(xa && !noanh ? [Math.abs(hi)] : [])];
    const x0 = Math.min(...xs) - 0.4 * f, x1 = Math.max(...xs, f * 1.6) + 0.5 * f, ymax = Math.max(...ys) * 1.25;
    const s = Math.min((W - 2 * P) / (x1 - x0), (H / 2 - 18) / ymax);
    const X = x => P + (x - x0) * s + ((W - 2 * P) - (x1 - x0) * s) / 2, Y = y => H / 2 - y * s;
    const L = ymax * 1.0, cx = X(0), cy = Y(0), xR = X(x1), xL = X(x0);
    const ln = (ax, ay, bx, by, c = 'fg-ray') => `<line x1="${X(ax).toFixed(1)}" y1="${Y(ay).toFixed(1)}" x2="${X(bx).toFixed(1)}" y2="${Y(by).toFixed(1)}" class="${c}"/>`;
    // Kéo dài tia từ (ax, ay) theo hướng (dx, dy) tới mép phải
    const toEdge = (ax, ay, dx, dy) => { const k = (x1 - ax) / dx; return [x1, ay + dy * k]; };
    let g = `<line x1="${xL}" y1="${cy}" x2="${xR}" y2="${cy}" class="fg-ax"/>`;
    // Thấu kính: hội tụ = mũi tên hướng ra ở hai đầu, phân kì = mũi tên hướng vào
    const ty = Y(L), by = Y(-L), aw = 7;
    g += `<line x1="${cx}" y1="${ty}" x2="${cx}" y2="${by}" class="fg-lens"/>`
      + (ht ? `<path d="M${cx - aw} ${ty + aw} L${cx} ${ty} L${cx + aw} ${ty + aw} M${cx - aw} ${by - aw} L${cx} ${by} L${cx + aw} ${by - aw}" class="fg-lens"/>`
            : `<path d="M${cx - aw} ${ty - aw} L${cx} ${ty} L${cx + aw} ${ty - aw} M${cx - aw} ${by + aw} L${cx} ${by} L${cx + aw} ${by + aw}" class="fg-lens"/>`);
    // Tiêu điểm
    [[-f, 'F'], [f, 'F′']].forEach(([x, lab]) => { g += `<circle cx="${X(x)}" cy="${cy}" r="2.6" class="fg-fdot"/><text x="${X(x)}" y="${cy + 14}" class="fg-t b" text-anchor="middle">${lab}</text>`; });
    g += `<text x="${cx + 4}" y="${cy + 14}" class="fg-t b">O</text>`;
    // Vật AB
    g += figArrow(X(-d), cy, X(-d), Y(h), 'fg-obj') + `<text x="${X(-d) - 4}" y="${Y(h) - 4}" class="fg-t b" text-anchor="end">B</text><text x="${X(-d) - 4}" y="${cy + 13}" class="fg-t b" text-anchor="end">A</text>`;
    // Tia 1: song song trục chính → tới thấu kính tại (0, h)
    g += ln(-d, h, 0, h);
    if (ht) { const [ex, ey] = toEdge(0, h, f, -h); g += ln(0, h, ex, ey); if (di != null && di < 0 && xa) g += ln(0, h, di, hi, 'fg-ext'); }
    else { const [ex, ey] = toEdge(0, h, f, h); g += ln(0, h, ex, ey) + ln(0, h, -f, 0, 'fg-ext'); }
    // Tia 2: qua quang tâm O, truyền thẳng
    { const [ex, ey] = toEdge(0, 0, d, -h); g += ln(-d, h, ex, ey); if (di != null && di < 0 && xa) g += ln(0, 0, di, hi, 'fg-ext'); }
    // Tia 3 (TKHT, ảnh thật): qua F → tia ló song song trục chính
    if (ht && di != null && di > 0) { g += ln(-d, h, 0, hi) + ln(0, hi, x1, hi); }
    // Ảnh A′B′
    if (di != null && xa && !noanh) {
      const cls = di > 0 ? 'fg-imgr' : 'fg-img';
      g += figArrow(X(di), cy, X(di), Y(hi), cls) + `<text x="${X(di) + 5}" y="${Y(hi) + (hi < 0 ? 12 : -4)}" class="fg-t b">B′</text><text x="${X(di) + 5}" y="${cy + (hi < 0 ? -5 : 13)}" class="fg-t b">A′</text>`;
    }
    const label = `Thấu kính ${ht ? 'hội tụ' : 'phân kì'}, vật cách thấu kính ${figFmt(d)}, tiêu cự ${figFmt(f)}${noanh || an ? '' : '. ' + cap}`;
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}">${g}</svg>${noanh || an ? '' : `<small class="fg-cap">${esc(cap)}</small>`}</span>`;
  },

  langkinh(a) {
    const tansac = /tansac/.test(a), an = /(^|\s)an(\s|$)/.test(a);   // "an": dùng trong câu hỏi, không ghi chú thích
    const W = 320, H = 200, A = [150, 26], Bp = [82, 144], Cp = [218, 144];   // tam giác đều, đỉnh trên, đáy dưới
    const sub = (p, q) => [p[0] - q[0], p[1] - q[1]], add = (p, q) => [p[0] + q[0], p[1] + q[1]], mul = (p, k) => [p[0] * k, p[1] * k];
    const dot = (p, q) => p[0] * q[0] + p[1] * q[1], unit = p => { const l = Math.hypot(p[0], p[1]); return [p[0] / l, p[1] / l]; };
    // Khúc xạ theo Snell dạng véc-tơ: d tia tới (đơn vị), nrm pháp tuyến đơn vị hướng về phía tia tới, eta = n1/n2
    const refr = (d, nrm, eta) => { const ci = -dot(nrm, d), k = 1 - eta * eta * (1 - ci * ci); if (k < 0) return null; return unit(add(mul(d, eta), mul(nrm, eta * ci - Math.sqrt(k)))); };
    const hit = (p, d, s0, s1) => { const e = sub(s1, s0), den = d[0] * e[1] - d[1] * e[0]; if (Math.abs(den) < 1e-9) return null;
      const w = sub(s0, p), t = (w[0] * e[1] - w[1] * e[0]) / den, u = (w[0] * d[1] - w[1] * d[0]) / den; return t > 0 && u >= 0 && u <= 1 ? add(p, mul(d, t)) : null; };
    // Pháp tuyến ngoài của hai mặt bên
    const nL = unit([-(Bp[1] - A[1]), Bp[0] - A[0]]), nLo = dot(nL, sub(A, [150, 110])) > 0 ? nL : mul(nL, -1);
    const nR = unit([-(Cp[1] - A[1]), Cp[0] - A[0]]), nRo = dot(nR, sub(A, [150, 110])) > 0 ? nR : mul(nR, -1);
    const Pin = add(A, mul(sub(Bp, A), 0.5));                                // điểm tới ở giữa mặt trái
    const d0 = unit([Math.cos(10 * Math.PI / 180), -Math.sin(10 * Math.PI / 180)]);   // tia tới chếch lên 10° (trục y của SVG hướng xuống)
    const src = add(Pin, mul(d0, -95));
    let g = `<polygon points="${A.join(',')} ${Bp.join(',')} ${Cp.join(',')}" class="fg-prism"/>`;
    const nlen = 26, norm = (p, nv) => `<line x1="${(p[0] - nv[0] * nlen).toFixed(1)}" y1="${(p[1] - nv[1] * nlen).toFixed(1)}" x2="${(p[0] + nv[0] * nlen).toFixed(1)}" y2="${(p[1] + nv[1] * nlen).toFixed(1)}" class="fg-norm"/>`;
    const path = (nIdx, cls, stroke) => {
      const d1 = refr(d0, nLo, 1 / nIdx); if (!d1) return '';
      const Q = hit(Pin, d1, A, Cp); if (!Q) return '';
      const d2 = refr(d1, mul(nRo, -1), nIdx); if (!d2) return '';
      const E = add(Q, mul(d2, 110));
      return `<line x1="${Pin[0]}" y1="${Pin[1]}" x2="${Q[0].toFixed(1)}" y2="${Q[1].toFixed(1)}" class="${cls}"${stroke ? ` style="stroke:${stroke}"` : ''}/>`
        + figArrow(+Q[0].toFixed(1), +Q[1].toFixed(1), +E[0].toFixed(1), +E[1].toFixed(1), cls).replace(/class="([^"]+)"/g, `class="$1"${stroke ? ` style="stroke:${stroke}"` : ''}`)
        + (nIdx === 1.5 || stroke === '#E53935' ? norm(Q, nRo) : '');
    };
    g += figArrow(+src[0].toFixed(1), +src[1].toFixed(1), Pin[0], Pin[1], tansac ? 'fg-white' : 'fg-ray') + norm(Pin, nLo);
    let cap;
    if (!tansac) { g += path(1.5, 'fg-ray'); cap = 'Tia sáng qua lăng kính bị lệch về phía đáy'; }
    else {
      const COL = [['Đỏ', '#E53935'], ['Da cam', '#FB8C00'], ['Vàng', '#FDD835'], ['Lục', '#43A047'], ['Lam', '#1E88E5'], ['Chàm', '#3949AB'], ['Tím', '#8E24AA']];
      COL.forEach(([, c], i) => { g += path(1.46 + i * 0.03, 'fg-col', c); });                 // chiết suất tăng dần từ đỏ đến tím (phóng đại)
      const dR = refr(refr(d0, nLo, 1 / 1.46), mul(nRo, -1), 1.46), dV = refr(refr(d0, nLo, 1 / 1.64), mul(nRo, -1), 1.64);
      const QR = hit(Pin, refr(d0, nLo, 1 / 1.46), A, Cp), QV = hit(Pin, refr(d0, nLo, 1 / 1.64), A, Cp);
      const eR = add(QR, mul(dR, 112)), eV = add(QV, mul(dV, 112));
      g += `<text x="${(eR[0] + 3).toFixed(1)}" y="${(eR[1] - 3).toFixed(1)}" class="fg-t b">đỏ</text><text x="${(eV[0] + 3).toFixed(1)}" y="${(eV[1] + 9).toFixed(1)}" class="fg-t b">tím</text>`
        + `<text x="${(src[0]).toFixed(1)}" y="${(src[1] + 16).toFixed(1)}" class="fg-t b">ánh sáng trắng</text>`;
      cap = 'Ánh sáng trắng tách thành dải màu: đỏ lệch ít nhất, tím lệch nhiều nhất (độ tách vẽ phóng đại)';
    }
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(an ? 'Lăng kính' : cap)}">${g}</svg>${an ? '' : `<small class="fg-cap">${esc(cap)}</small>`}</span>`;
  },

  dna(a) {
    const t = a.trim().split(/\s+/), seq = (t[0] || '').toUpperCase().replace(/[^ATGC]/g, '').slice(0, 15);
    if (!seq) return '';
    const mrna = t.includes('mrna'), codon = t.includes('codon');
    const bu = {A: 'T', T: 'A', G: 'C', C: 'G'}, ru = {A: 'U', T: 'A', G: 'C', C: 'G'};
    const m2 = [...seq].map(b => bu[b]).join(''), rn = [...seq].map(b => ru[b]).join('');
    const bw = 20, gap = 3, lab = mrna ? 100 : 60, W = lab + seq.length * (bw + gap) + (codon ? Math.floor((seq.length - 1) / 3) * 6 : 0) + 8;
    const xOf = i => lab + i * (bw + gap) + (codon ? Math.floor(i / 3) * 6 : 0);
    const row = (s, y, cls = '') => [...s].map((b, i) => `<rect x="${xOf(i)}" y="${y}" width="${bw}" height="20" rx="4" fill="${FIG_BASE[b]}"${cls}/><text x="${xOf(i) + bw / 2}" y="${y + 14.5}" class="fg-base" text-anchor="middle">${b}</text>`).join('');
    let g = `<text x="4" y="24" class="fg-t b">Mạch 1${mrna ? ' (khuôn)' : ''}</text>` + row(seq, 10);
    // Liên kết hydrogen: A–T 2 vạch, G–C 3 vạch
    [...seq].forEach((b, i) => { const k = b === 'G' || b === 'C' ? 3 : 2, x = xOf(i) + bw / 2;
      for (let j = 0; j < k; j++) { const dx = (j - (k - 1) / 2) * 4; g += `<line x1="${x + dx}" y1="32" x2="${x + dx}" y2="44" class="fg-hb"/>`; } });
    g += `<text x="4" y="60" class="fg-t b">Mạch 2</text>` + row(m2, 46);
    let H = 74;
    if (mrna) {
      g += `<text x="4" y="104" class="fg-t b">mRNA</text>` + row(rn, 90) + `<text x="${lab}" y="84" class="fg-t">↓ phiên mã từ mạch 1 (bổ sung với mạch 1, U thay T)</text>`;
      H = 118;
      if (codon) for (let i = 0; i + 3 <= seq.length; i += 3) g += `<path d="M${xOf(i)} 114 L${xOf(i)} 117 L${xOf(i + 2) + bw} 117 L${xOf(i + 2) + bw} 114" class="fg-ax"/>`;
      if (codon) H = 124;
    }
    const legend = `<small class="fg-cap">${Object.entries(FIG_BASE).filter(([b]) => b !== 'U' || mrna).map(([b, c]) => `<b style="color:${c}">${b}</b>`).join(' ')} · A–T (A–U) 2 liên kết hydrogen, G–C 3 liên kết</small>`;
    const label = `DNA hai mạch: ${seq} và ${m2}${mrna ? `; mRNA: ${rn}` : ''}`;
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}">${g}</svg>${legend}</span>`;
  },
});

;

/* fig3.js */
/* HÌNH VẼ BẰNG MÃ (đợt 3): mạch điện, đòn bẩy, tế bào, bảng lai Punnett.
   [mach:nt 2 A V]      mạch NỐI TIẾP 2 bóng đèn, ampe kế (A) ở mạch chính, vôn kế (V) đo hai đầu đèn 1
   [mach:ss 2 A]        mạch SONG SONG 2 nhánh; thêm "R" = điện trở thay bóng đèn; "mo" = khóa K mở; "hong2" = tháo bóng / đứt nhánh 2
                        "an" = ẩn kết quả (không tô đèn sáng, không ghi trạng thái) — BẮT BUỘC khi câu hỏi hỏi đèn có sáng / có dòng điện không
                        Đèn sáng khi có đường khép kín qua nó: nối tiếp tháo 1 đèn → tất cả tắt; song song → nhánh còn lại vẫn sáng.
   [donbay:1 300 1,5 450 1]   đòn bẩy loại 1: F1 = 300 N cách O 1,5 m; F2 = 450 N cách O 1 m (tự kiểm cân bằng F1·d1 = F2·d2)
   [donbay:1 300 1,5 ? 1] = F₂ cần tìm (máy suy từ cân bằng để vẽ, nhãn ghi ?) · thêm "an" = chú thích không ghi loại đòn bẩy / kết quả
   [donbay:2v 200 1,2 600 0,4]  loại 2, vật ở giữa (O ở đầu, vật F2 gần O, lực F1 ở xa)   [donbay:2l …]  loại 2, lực ở giữa
   [tebao:dv] [tebao:tv] [tebao:ns]   tế bào động vật / thực vật / nhân sơ, có nhãn; thêm tên bộ phận để tô nổi (vd [tebao:tv luclap]); thêm "an" khi dùng trong câu hỏi (không ghi tên loại tế bào, không hiện chức năng)
                        Bộ phận: mang, tbc, nhan, thanh, luclap, khongbao, vungnhan, roi — chạm vào bộ phận để xem chức năng
   [punnett:Aa Aa | hạt vàng, hạt xanh]      bảng lai một cặp tính trạng (trội hoàn toàn)
   [punnett:AaBb AaBb | vàng, xanh ; trơn, nhăn]   hai cặp tính trạng
   [punnett:Aa Aa an]  dùng trong câu hỏi: ô tổ hợp ghi ?, không tô màu, không ghi tỉ lệ; [punnett:Aa aa an angt] giấu cả giao tử */

const TB_INFO = {
  mang: ['Màng tế bào', 'Bao bọc tế bào, kiểm soát sự vận chuyển các chất vào và ra khỏi tế bào.'],
  tbc: ['Tế bào chất', 'Chất keo lỏng chứa các bào quan; nơi diễn ra phần lớn các hoạt động sống của tế bào.'],
  nhan: ['Nhân', 'Có màng nhân bao bọc, chứa vật chất di truyền; điều khiển mọi hoạt động sống của tế bào.'],
  thanh: ['Thành tế bào', 'Lớp ngoài cùng của tế bào thực vật (và vi khuẩn), giúp tế bào có hình dạng ổn định và bảo vệ tế bào.'],
  luclap: ['Lục lạp', 'Chứa diệp lục, là nơi diễn ra quang hợp; chỉ có ở tế bào thực vật (và tảo).'],
  khongbao: ['Không bào', 'Túi chứa dịch tế bào; ở tế bào thực vật trưởng thành thường có không bào lớn.'],
  vungnhan: ['Vùng nhân', 'Nơi chứa vật chất di truyền của tế bào nhân sơ; không có màng nhân bao bọc.'],
  roi: ['Roi', 'Giúp một số vi khuẩn di chuyển.'],
};

Object.assign(FIG, {
  mach(a) {
    const t = a.trim().split(/\s+/), ss = t[0] === 'ss', nb = Math.min(3, Math.max(1, parseInt(t[1]) || 2));
    const R = t.includes('R'), mo = t.includes('mo'), amp = t.includes('A'), volt = t.includes('V') && !ss;
    const hong = new Set(t.filter(x => /^hong\d$/.test(x)).map(x => +x[4]));
    // Đèn nào sáng: cần khóa đóng; nối tiếp: mọi đèn còn nguyên; song song: nhánh của đèn đó còn nguyên
    const an = t.includes('an');   // "an" = ẩn kết quả (dùng trong câu hỏi): không tô đèn sáng, không ghi trạng thái mạch
    const lit = i => !an && !mo && (ss ? !hong.has(i) : hong.size === 0);
    const W = 300, H = ss ? 220 : 200, L = 30, Rr = 270, T = 38, B = ss ? 162 : 150;
    let g = '';
    const wire = (pts) => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" class="fg-wire"/>`;
    const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="3.2" class="fg-node"/>`;
    const lamp = (x, y, i, vert) => {
      const on = lit(i), tag = `${R ? 'R' : 'Đ'}${nb > 1 ? '<tspan dy="3" font-size="8">' + i + '</tspan>' : ''}`;
      if (hong.has(i)) return `<text x="${x}" y="${y + 4}" class="fg-t" text-anchor="middle">(tháo)</text>`;
      if (R) return `<rect x="${x - 14}" y="${y - 6}" width="28" height="12" class="fg-res"/><text x="${x}" y="${y - 10}" class="fg-t b" text-anchor="middle">${tag}</text>`;
      return (on ? `<circle cx="${x}" cy="${y}" r="17" class="fg-glow"/>` : '') + `<circle cx="${x}" cy="${y}" r="10" class="fg-lamp${on ? ' on' : ''}"/>`
        + `<path d="M${x - 7} ${y - 7} L${x + 7} ${y + 7} M${x + 7} ${y - 7} L${x - 7} ${y + 7}" class="fg-wire"/><text x="${x}" y="${y - 14}" class="fg-t b" text-anchor="middle">${tag}</text>`;
    };
    const meter = (x, y, ch) => `<circle cx="${x}" cy="${y}" r="11" class="fg-meter"/><text x="${x}" y="${y + 4.5}" class="fg-t b" text-anchor="middle" font-size="12">${ch}</text>`;
    // Nguồn (pin) ở cạnh trên, bên trái: vạch dài (+) bên trái, vạch ngắn (−) bên phải
    const px = 100;
    g += wire([[L, T], [px - 4, T]]) + `<line x1="${px}" y1="${T - 13}" x2="${px}" y2="${T + 13}" class="fg-bat"/><line x1="${px + 8}" y1="${T - 7}" x2="${px + 8}" y2="${T + 7}" class="fg-bat s"/>`
      + `<text x="${px - 4}" y="${T - 16}" class="fg-t b" text-anchor="middle">+</text><text x="${px + 12}" y="${T - 10}" class="fg-t b" text-anchor="middle">−</text>`;
    // Khóa K
    const k1 = 175, k2 = 205;
    g += wire([[px + 12, T], [k1, T]]) + dot(k1, T) + dot(k2, T)
      + (mo ? `<line x1="${k1}" y1="${T}" x2="${k2 - 4}" y2="${T - 15}" class="fg-wire"/>` : `<line x1="${k1}" y1="${T}" x2="${k2}" y2="${T}" class="fg-wire"/>`)
      + `<text x="${(k1 + k2) / 2}" y="${T - 18}" class="fg-t b" text-anchor="middle">K</text>` + wire([[k2, T], [Rr, T], [Rr, B]]);
    // Cạnh trái: ampe kế (mạch chính)
    const ay = (T + B) / 2;
    g += amp ? wire([[L, T], [L, ay - 11]]) + meter(L, ay, 'A') + wire([[L, ay + 11], [L, B]]) : wire([[L, T], [L, B]]);
    if (!ss) {
      const xs = nb === 1 ? [150] : nb === 2 ? [115, 195] : [100, 150, 200];
      let x = L; const segs = [];
      xs.forEach((cx, i) => { segs.push(hong.has(i + 1) ? [[x, B], [cx - 16, B]] : [[x, B], [cx - (R ? 14 : 10), B]]); x = cx + (R ? 14 : 10); if (hong.has(i + 1)) x = cx + 16; });
      segs.push([[x, B], [Rr, B]]);
      g += segs.map(wire).join('') + xs.map((cx, i) => lamp(cx, B, i + 1)).join('');
      if (volt) { const c = xs[0], a1 = c - 22, a2 = c + 22, vy = B + 34;
        g += dot(a1, B) + dot(a2, B) + wire([[a1, B], [a1, vy], [c - 11, vy]]) + meter(c, vy, 'V') + wire([[c + 11, vy], [a2, vy], [a2, B]]); }
    } else {
      // Hai (ba) nhánh song song giữa hai nút N1, N2
      const n1 = 95, n2 = 245, ys = nb === 1 ? [B] : nb === 2 ? [B - 24, B + 24] : [B - 34, B, B + 34];
      g += wire([[L, B], [n1, B]]) + wire([[n2, B], [Rr, B]]) + dot(n1, B) + dot(n2, B) + wire([[n1, ys[0]], [n1, ys[ys.length - 1]]]) + wire([[n2, ys[0]], [n2, ys[ys.length - 1]]]);
      ys.forEach((y, i) => { const cx = 170, w = R ? 14 : 10;
        g += hong.has(i + 1) ? wire([[n1, y], [cx - 16, y]]) + wire([[cx + 16, y], [n2, y]]) : wire([[n1, y], [cx - w, y]]) + wire([[cx + w, y], [n2, y]]);
        g += lamp(cx, y, i + 1); });
    }
    // Chiều dòng điện quy ước (từ cực + qua dây dẫn về cực −) khi mạch kín
    const kin = !mo && (ss ? [...Array(nb).keys()].some(i => !hong.has(i + 1)) : hong.size === 0);
    if (kin) g += figArrow(L, T + 18, L, T + 30, 'fg-cur');
    const st = an ? 'Sơ đồ mạch điện' : mo ? 'Khóa K mở: mạch hở, không có dòng điện' : !kin ? 'Mạch hở ở chỗ tháo: không có dòng điện' : ss && hong.size ? 'Nhánh còn lại vẫn có dòng điện' : 'Mạch kín: có dòng điện chạy qua';
    const cap = `${ss ? 'Mạch song song' : 'Mạch nối tiếp'} · ${st}`;
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H + (volt ? 20 : 0)}" width="${W}" height="${H + (volt ? 20 : 0)}" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${esc(cap)}</small></span>`;
  },

  donbay(a) {
    const t = a.trim().split(/\s+/), kind = t[0] || '1', raw = t.slice(1, 5), n = raw.map(figNum), an = t.includes('an');
    // "?" = đại lượng cần tìm: máy tự suy từ điều kiện cân bằng F1·d1 = F2·d2 để vẽ đúng tỉ lệ, nhãn ghi "?"
    const hoi = [0, 1, 2, 3].map(i => raw[i] === '?'), v = [0, 1, 2, 3].map(i => hoi[i] ? NaN : n[i]);
    if (hoi.filter(Boolean).length === 1) { const k = hoi.indexOf(true); v[k] = k === 0 ? v[2] * v[3] / v[1] : k === 1 ? v[2] * v[3] / v[0] : k === 2 ? v[0] * v[1] / v[3] : v[0] * v[1] / v[2]; }
    const [F1, d1, F2, d2] = [v[0] || 300, v[1] || 1.5, v[2] || 450, v[3] || 1], lb = (i, x) => hoi[i] ? '?' : figFmt(x);
    const W = 320, H = 210, by = 100, M1 = F1 * d1, M2 = F2 * d2, can = Math.abs(M1 - M2) < 1e-9;
    // Vị trí trên thanh (mét → px), O là gốc
    const span = kind === '1' ? d1 + d2 : Math.max(d1, d2), s = Math.min(240 / span, 150), ox = kind === '1' ? 40 + d1 * s : 50;
    const xF1 = kind === '1' ? ox - d1 * s : ox + d1 * s, xF2 = ox + d2 * s;
    const beamL = Math.min(ox, xF1, xF2) - 12, beamR = Math.max(ox, xF1, xF2) + 12;
    const len = F => 22 + 40 * F / Math.max(F1, F2);
    const rot = t.includes('nghieng') && !can ? (M1 > M2 ? -6 : 6) : 0;   // loại 1: F1 bên trái thắng → trái đi xuống; loại 2: F1 (hướng lên) thắng → đầu phải nâng lên
    let g = `<g transform="rotate(${rot} ${ox} ${by})"><rect x="${beamL}" y="${by - 4}" width="${beamR - beamL}" height="8" rx="3" class="fg-beam"/>`;
    // Lực: loại 1 cả hai hướng xuống (trọng lượng); loại 2 lực tác dụng F1 hướng lên, vật F2 hướng xuống
    const up1 = kind !== '1';
    g += up1 ? figArrow(xF1, by - 4, xF1, by - 4 - len(F1), 'fg-f1') : figArrow(xF1, by - 4 - len(F1), xF1, by - 4, 'fg-f1');
    g += figArrow(xF2, by + 4, xF2, by + 4 + len(F2), 'fg-f2');
    g += `<text x="${xF1}" y="${by - 12 - len(F1)}" class="fg-t b" text-anchor="middle">F₁ = ${lb(0, F1)} N</text>`
      + `<text x="${xF2}" y="${by + 18 + len(F2)}" class="fg-t b" text-anchor="middle">F₂ = ${lb(2, F2)} N</text></g>`
      + `<path d="M${ox} ${by + 4} L${ox - 11} ${by + 24} L${ox + 11} ${by + 24} Z" class="fg-pivot"/><text x="${ox}" y="${by + 38}" class="fg-t b" text-anchor="middle">O</text>`;
    // Kích thước d1, d2 (từ O)
    const dim = (x, y, lab) => `<line x1="${ox}" y1="${y}" x2="${x}" y2="${y}" class="fg-dim"/><line x1="${x}" y1="${y - 4}" x2="${x}" y2="${y + 4}" class="fg-dim"/><line x1="${ox}" y1="${y - 4}" x2="${ox}" y2="${y + 4}" class="fg-dim"/><text x="${(ox + x) / 2}" y="${y - 4}" class="fg-t" text-anchor="middle">${lab}</text>`;
    g += dim(xF1, 14, `d₁ = ${lb(1, d1)} m`) + dim(xF2, H - 6, `d₂ = ${lb(3, d2)} m`);
    const ten = {1: 'Đòn bẩy loại 1 (O ở giữa)', '2v': 'Đòn bẩy loại 2, vật ở giữa', '2l': 'Đòn bẩy loại 2, lực ở giữa'}[kind] || 'Đòn bẩy';
    const cap = an || hoi.some(Boolean) ? (an ? 'Đòn bẩy' : ten) : `${ten} · F₁·d₁ = ${figFmt(M1)}, F₂·d₂ = ${figFmt(M2)} → ${can ? 'cân bằng' : M1 > M2 ? 'lực F₁ thắng' : 'lực F₂ thắng'}`;   // an: không ghi loại đòn bẩy / kết quả
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${esc(cap)}</small></span>`;
  },

  tebao(a) {
    const t = a.trim().split(/\s+/), an = t.includes('an'), k = t[0] || 'dv', hl = (an ? t.filter(x => x !== 'an') : t)[1] || '';   // an: dùng trong câu hỏi — không ghi tên loại tế bào, không hiện chức năng
    const part = (id, svg) => an ? `<g class="fg-bp${hl === id ? ' hl' : ''}">${svg}</g>` : `<g class="fg-bp${hl === id ? ' hl' : ''}" data-bp="${id}" tabindex="0" role="button" aria-label="${esc(TB_INFO[id][0])}">${svg}</g>`;
    const lab = (id, x1, y1, x2, y2, anchor = 'start') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="fg-lead"/><circle cx="${x1}" cy="${y1}" r="2" class="fg-node"/><text x="${x2 + (anchor === 'start' ? 3 : -3)}" y="${y2 + 3.5}" class="fg-t b fg-bpl${hl === id ? ' hl' : ''}" text-anchor="${anchor}" data-bp="${id}">${TB_INFO[id][0]}</text>`;
    let g = '', ten;
    if (k === 'tv') {
      ten = 'Tế bào thực vật';
      g += part('thanh', `<rect x="30" y="22" width="170" height="126" rx="10" class="fg-thanh"/>`)
        + part('tbc', `<rect x="37" y="29" width="156" height="112" rx="7" class="fg-tbc tv"/>`)
        + part('mang', `<rect x="37" y="29" width="156" height="112" rx="7" class="fg-mang"/>`)
        + part('khongbao', `<path d="M78 52 Q118 40 160 56 Q176 88 156 118 Q116 130 80 116 Q66 84 78 52 Z" class="fg-kb"/>`)
        + part('nhan', `<circle cx="56" cy="122" r="12" class="fg-nhan"/>`)
        + part('luclap', [[54, 44], [176, 44], [182, 96], [118, 134], [48, 80]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" class="fg-ll"/>`).join(''));
      g += lab('thanh', 196, 30, 226, 18) + lab('mang', 193, 60, 226, 42) + lab('luclap', 182, 96, 226, 66) + lab('khongbao', 150, 100, 226, 90) + lab('tbc', 170, 128, 226, 114) + lab('nhan', 60, 132, 226, 150);
    } else if (k === 'ns') {
      ten = 'Tế bào nhân sơ (vi khuẩn)';
      g += part('roi', `<path d="M196 86 q10 -10 20 0 t20 0 t20 0" class="fg-roi"/>`)
        + part('thanh', `<rect x="36" y="48" width="162" height="76" rx="38" class="fg-thanh"/>`)
        + part('tbc', `<rect x="42" y="54" width="150" height="64" rx="32" class="fg-tbc"/>`)
        + part('mang', `<rect x="42" y="54" width="150" height="64" rx="32" class="fg-mang"/>`)
        + part('vungnhan', `<path d="M96 80 q10 -14 20 0 t18 4 q-4 14 -20 8 t-18 -12 q6 -8 14 2" class="fg-dnaloop"/>`);
      g += lab('thanh', 70, 49, 62, 20) + lab('mang', 150, 56, 170, 22) + lab('vungnhan', 118, 88, 90, 150, 'end') + lab('tbc', 160, 100, 186, 150) + lab('roi', 236, 86, 262, 60);
    } else {
      ten = 'Tế bào động vật';
      g += part('tbc', `<path d="M60 40 Q120 18 176 44 Q206 86 184 128 Q130 156 72 134 Q34 96 60 40 Z" class="fg-tbc dv"/>`)
        + part('mang', `<path d="M60 40 Q120 18 176 44 Q206 86 184 128 Q130 156 72 134 Q34 96 60 40 Z" class="fg-mang"/>`)
        + part('nhan', `<circle cx="120" cy="88" r="22" class="fg-nhan"/>`);
      g += lab('mang', 186, 60, 226, 40) + lab('tbc', 164, 110, 226, 100) + lab('nhan', 136, 80, 226, 150);
    }
    const W = 300, H = 170;
    if (an) return `<span class="bk-fig fg-wrap fg-cell"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Hình một tế bào, có nhãn các bộ phận">${g}</svg></span>`;
    return `<span class="bk-fig fg-wrap fg-cell"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(ten)}, có nhãn các bộ phận">${g}</svg><small class="fg-cap bp-info">${hl && TB_INFO[hl] ? `<b>${TB_INFO[hl][0]}:</b> ${esc(TB_INFO[hl][1])}` : `${ten} · chạm vào một bộ phận để xem chức năng`}</small></span>`;
  },

  punnett(a) {
    const [gp, tr = ''] = a.split('|'), t = gp.trim().split(/\s+/);
    const p1 = (t[0] || 'Aa').trim(), p2 = (t[1] || 'Aa').trim(), an = t.includes('an'), angt = t.includes('angt');   // an: ô tổ hợp ghi ?, không màu, không tỉ lệ; angt: giấu cả giao tử
    const ng = Math.min(2, Math.floor(p1.length / 2));
    if (!ng || p1.length !== p2.length || !/^[A-Za-z]+$/.test(p1 + p2)) return '';
    const pairs = s => Array.from({length: ng}, (_, i) => s.slice(2 * i, 2 * i + 2));
    const sortPair = p => p[0] <= p[1] ? p : p[1] + p[0];                                     // chữ hoa đứng trước (A < a)
    const gametes = s => pairs(s).reduce((acc, p) => { const al = [...new Set(p.split(''))]; return acc.flatMap(x => al.map(y => x + y)); }, ['']);
    const G1 = gametes(p1), G2 = gametes(p2);
    const tt = tr.split(';').map(x => x.split(',').map(y => y.trim()).filter(Boolean));
    const pheno = geno => pairs(geno).map((p, i) => { const troi = p !== p.toLowerCase(); const names = tt[i] || []; return names.length === 2 ? names[troi ? 0 : 1] : (troi ? `trội ${p[0].toUpperCase()}` : `lặn ${p[0].toLowerCase()}`); }).join(', ');
    const cells = G1.map(x => G2.map(y => Array.from({length: ng}, (_, i) => sortPair(x[i] + y[i])).join('')));
    const cntG = {}, cntP = {};
    cells.flat().forEach(c => { cntG[c] = (cntG[c] || 0) + 1; const ph = pheno(c); cntP[ph] = (cntP[ph] || 0) + 1; });
    const gcd = (x, y) => y ? gcd(y, x % y) : x, gg = arr => arr.reduce(gcd);
    const ratio = obj => { const e = Object.entries(obj).sort((x, y) => y[1] - x[1]), k = gg(e.map(x => x[1])); return e.map(([n, c]) => `${c / k} ${n}`).join(' : '); };
    const genoOrder = Object.keys(cntG).sort((x, y) => (x < y ? -1 : 1));
    const kgKey = gg(Object.values(cntG));
    const PH = Object.keys(cntP).sort((x, y) => cntP[y] - cntP[x]), COL = ['#FDE68A', '#BBF7D0', '#BFDBFE', '#FBCFE8'];
    const cw = ng === 1 ? 64 : 58, W = 60 + G2.length * cw, H = 30 + G1.length * 34 + 6;
    let g = `<text x="30" y="20" class="fg-t" text-anchor="middle">♀ \\ ♂</text>`;
    G2.forEach((x, j) => { g += `<text x="${60 + j * cw + cw / 2}" y="20" class="fg-t b" text-anchor="middle">${angt ? '?' : x}</text>`; });
    G1.forEach((x, i) => { const y = 30 + i * 34;
      g += `<text x="30" y="${y + 21}" class="fg-t b" text-anchor="middle">${angt ? '?' : x}</text>`;
      G2.forEach((_, j) => { const c = cells[i][j]; g += `<rect x="${60 + j * cw + 1}" y="${y + 1}" width="${cw - 2}" height="32" rx="5" fill="${an ? '#EEF1F5' : COL[PH.indexOf(pheno(c)) % 4]}" class="fg-pc"/><text x="${60 + j * cw + cw / 2}" y="${y + 21}" class="fg-t b" text-anchor="middle">${an ? '?' : c}</text>`; }); });
    const kg = ng === 1 ? `Kiểu gene: ${genoOrder.map(x => `${cntG[x] / kgKey} ${x}`).join(' : ')} · ` : `${cells.flat().length} tổ hợp · `;
    const cap = `P: ${p1} × ${p2} · Giao tử: (${G1.join(', ')}) × (${G2.join(', ')})`;
    const legend = PH.map((p, i) => `<span class="fg-pl"><i style="background:${COL[i % 4]}"></i>${esc(p)}</span>`).join('');
    if (an) return `<span class="bk-fig fg-wrap"><small class="fg-cap">${esc(angt ? `P: ${p1} × ${p2}` : cap)}</small><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Khung Punnett">${g}</svg></span>`;
    return `<span class="bk-fig fg-wrap"><small class="fg-cap">${esc(cap)}</small><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cap + '. ' + kg + 'Kiểu hình: ' + ratio(cntP))}">${g}</svg><small class="fg-cap">${esc(kg)}<b>Kiểu hình: ${esc(ratio(cntP))}</b></small><span class="fg-plg">${legend}</span></span>`;
  },
});

// Chạm vào bộ phận tế bào → hiện tên và chức năng ngay dưới hình
document.addEventListener('click', e => {
  const p = e.target.closest('[data-bp]'); if (!p) return;
  const wrap = p.closest('.fg-cell'); if (!wrap) return;
  const id = p.dataset.bp, info = wrap.querySelector('.bp-info');
  wrap.querySelectorAll('.fg-bp, .fg-bpl').forEach(x => x.classList.toggle('hl', x.dataset.bp === id));
  if (info && TB_INFO[id]) info.innerHTML = `<b>${TB_INFO[id][0]}:</b> ${esc(TB_INFO[id][1])}`;
});

;

/* fig4.js */
/* HÌNH VẼ BẰNG MÃ (đợt 4): thang pH, lực đẩy Archimedes, áp suất chất lỏng, bình thông nhau, lưới thức ăn.
   [ph:3]              thang pH 0–14, vạch chỉ pH = 3; màu quỳ tím và phenolphthalein tương ứng
                       Quỳ tím chuyển rõ đỏ khi pH ≤ khoảng 4,5 và rõ xanh khi pH ≥ khoảng 8,3; gần trung tính đổi màu rất ít.
                       Phenolphthalein không màu khi pH dưới khoảng 8,3, hồng khi pH từ khoảng 8,3 trở lên.
   [archimedes:0,5 100 2,7 10000]  vật thể tích 100 cm³, trọng lượng 2,7 N, chìm 0,5 (một nửa) trong chất lỏng d = 10 000 N/m³
   [archimedes:… an] / [apsuat:… an]: lực kế ghi ?, chú thích không ghi kết quả (dùng khi đề hỏi F_A, số chỉ lực kế, áp suất)
   [apsuat:2 3 10000]  điểm ở độ sâu h = 2 m trong bể sâu 3 m, chất lỏng d = 10 000 N/m³ (áp suất do chất lỏng gây ra, p = d·h)
   [binhthong:3]       bình thông nhau ba nhánh khác hình dạng, cùng một chất lỏng đứng yên
   [luoi:dong-co]      lưới thức ăn ở đồng cỏ; chạm một loài để xem điều gì xảy ra khi loài đó biến mất
                       [luoi:dong-co an]   dùng trong câu hỏi: không cho chạm, không ghi hệ quả */

const phQuy = p => p <= 4.5 ? ['#D7263D', 'hóa đỏ'] : p < 6.5 ? ['#B8336A', 'hơi đỏ (đổi màu ít)'] : p <= 7.5 ? ['#7B4FA8', 'giữ màu tím'] : p < 8.3 ? ['#5A56B5', 'hơi xanh (đổi màu ít)'] : ['#2E6FC1', 'hóa xanh'];
const phPhe = p => p >= 8.3 ? ['#EC4E9A', 'hồng'] : ['transparent', 'không màu'];
const PH_VD = [[2, 'nước chanh'], [3, 'giấm ăn'], [7, 'nước cất'], [7.4, 'máu'], [10, 'xà phòng'], [12.4, 'nước vôi trong']];

// Lưới thức ăn đồng cỏ: [id, tên, cột (bậc), hàng]; cạnh: [bị ăn, ăn]
const LUOI = {
  sv: [['co', 'Cỏ', 0, 1], ['sau', 'Sâu', 1, 0], ['tho', 'Thỏ', 1, 1], ['chuot', 'Chuột', 1, 2], ['chim', 'Chim sâu', 2, 0], ['ran', 'Rắn', 2, 1], ['cao', 'Cáo', 2, 2], ['daibang', 'Đại bàng', 3, 1]],
  an: [['co', 'sau'], ['co', 'tho'], ['co', 'chuot'], ['sau', 'chim'], ['chuot', 'ran'], ['tho', 'cao'], ['chuot', 'cao'], ['ran', 'daibang'], ['chuot', 'daibang']],
};
function luoiEffect(mat) {
  const ten = id => LUOI.sv.find(s => s[0] === id)[1];
  const an = LUOI.an, predators = an.filter(e => e[0] === mat).map(e => e[1]), prey = an.filter(e => e[1] === mat).map(e => e[0]);
  const out = [];
  predators.forEach(p => { const con = an.filter(e => e[1] === p && e[0] !== mat); out.push(con.length ? `<b>${ten(p)}</b> mất một nguồn thức ăn, phải ăn nhiều hơn ${con.map(e => ten(e[0]).toLowerCase()).join(', ')} → số lượng có thể giảm.` : `<b>${ten(p)}</b> mất nguồn thức ăn duy nhất → số lượng giảm mạnh.`); });
  prey.forEach(p => out.push(`<b>${ten(p)}</b> bớt bị ăn → lúc đầu số lượng có thể tăng.`));
  if (mat === 'co') out.unshift('Mất sinh vật sản xuất: mọi sinh vật tiêu thụ trong lưới đều dần thiếu thức ăn.');
  return `<b>Nếu ${ten(mat).toLowerCase()} biến mất:</b> ` + out.join(' ') + ' <i>Ảnh hưởng còn lan tiếp sang các loài khác trong lưới.</i>';
}

Object.assign(FIG, {
  ph(a) {
    const t = a.trim().split(/\s+/), v0 = figNum(t[0]), p = Math.max(0, Math.min(14, isFinite(v0) ? v0 : 7));
    // an: thang xám, không ghi acid/base, chỉ thị ghi ? (hỏi môi trường / màu chỉ thị). an mau: ẩn giá trị pH, chỉ cho màu chỉ thị (hỏi khoảng pH)
    const an = t.includes('an'), mau = an && t.includes('mau');
    const W = 320, H = 170, x0 = 18, x1 = 302, X = v => x0 + (x1 - x0) * v / 14, by = 34;
    const stops = ['#D7263D', '#EE6A2B', '#F6C33A', '#B8D441', '#3BAE6A', '#2A9D8F', '#3A63B8', '#5E3A9E'];
    let g = `<defs><linearGradient id="phg" x1="0" x2="1">${stops.map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`
      + `<rect x="${x0}" y="${by}" width="${x1 - x0}" height="16" rx="4" fill="${an ? '#C9CFD8' : 'url(#phg)'}"/>`;
    for (let v = 0; v <= 14; v++) g += `<line x1="${X(v)}" y1="${by + 16}" x2="${X(v)}" y2="${by + 20}" class="fg-ax"/><text x="${X(v)}" y="${by + 30}" class="fg-t" text-anchor="middle">${v}</text>`;
    if (!an) g += `<text x="${X(3.5)}" y="${by + 44}" class="fg-t b" text-anchor="middle">← acid</text><text x="${X(7)}" y="${by + 44}" class="fg-t b" text-anchor="middle">trung tính</text><text x="${X(10.5)}" y="${by + 44}" class="fg-t b" text-anchor="middle">base →</text>`;
    if (!mau) g += `<path d="M${X(p)} ${by - 2} l-6 -9 h12 z" class="fg-phm"/><text x="${X(p)}" y="${by - 24}" class="fg-t b" text-anchor="middle">pH = ${figFmt(p)}</text>`;
    let [qc, qt] = phQuy(p), [pc, pt] = phPhe(p);
    if (an && !mau) { qc = '#D9DDE3'; qt = '?'; pc = 'transparent'; pt = '?'; }
    // Mẩu quỳ và ống nghiệm phenolphthalein
    g += `<rect x="40" y="${by + 64}" width="44" height="22" rx="3" fill="${qc}" class="fg-strip"/><text x="92" y="${by + 74}" class="fg-t b">Quỳ tím</text><text x="92" y="${by + 87}" class="fg-t">${qt}</text>`;
    g += `<path d="M190 ${by + 58} v30 a8 8 0 0 0 16 0 v-30" class="fg-tube"/><path d="M191 ${by + 72} v16 a7 7 0 0 0 14 0 v-16 z" fill="${pc === 'transparent' ? 'var(--surface)' : pc}"/><path d="M190 ${by + 58} v30 a8 8 0 0 0 16 0 v-30" class="fg-tube"/><text x="214" y="${by + 74}" class="fg-t b">Phenolphthalein</text><text x="214" y="${by + 87}" class="fg-t">${pt}</text>`;
    const mt = p < 7 ? 'môi trường acid' : p > 7 ? 'môi trường base' : 'môi trường trung tính';
    const vd = PH_VD.filter(([v]) => Math.abs(v - p) <= 0.3).sort((x, y) => Math.abs(x[0] - p) - Math.abs(y[0] - p)).slice(0, 1).map(x => x[1]);
    const cap = mau ? `Màu chất chỉ thị trong dung dịch: quỳ tím ${qt}; phenolphthalein ${pt}` : an ? `Thang pH; dung dịch có pH = ${figFmt(p)}` : `pH = ${figFmt(p)}: ${mt}${vd.length ? ` (gần ${vd.join(', ')})` : ''}; quỳ tím ${qt}; phenolphthalein ${pt}`;
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${esc(cap)}</small></span>`;
  },

  archimedes(a) {
    const n = a.trim().split(/\s+/).map(figNum), an = /(^|\s)an(\s|$)/.test(a);   // an: lực kế ghi ?, chú thích không ghi F_A
    const phan = Math.max(0, Math.min(1, isFinite(n[0]) ? n[0] : 1)), V = n[1] > 0 ? n[1] : 100, P = n[2] > 0 ? n[2] : 2.7, d = n[3] > 0 ? n[3] : 10000;
    const FA = d * V * 1e-6 * phan, doc = P - FA;
    const W = 300, H = 230, cx = 150;
    const lv = 150, bx0 = 95, bx1 = 205, bb = 212;                       // mực chất lỏng, đáy cốc
    const oh = 48, ow = 40, oy = lv - oh + oh * phan;                     // đỉnh vật; phần nằm dưới mực chất lỏng = oh·phan
    let g = `<rect x="${bx0}" y="${lv}" width="${bx1 - bx0}" height="${bb - lv}" class="fg-liq"/><path d="M${bx0} 104 V${bb} H${bx1} V104" class="fg-cup"/>`;
    // Lực kế
    g += `<rect x="${cx - 16}" y="10" width="32" height="64" rx="5" class="fg-meter"/><line x1="${cx}" y1="74" x2="${cx}" y2="${oy}" class="fg-wire"/>`
      + `<text x="${cx}" y="36" class="fg-t b" text-anchor="middle">${an ? '?' : figFmt(Math.round(Math.max(0, doc) * 100) / 100)}</text><text x="${cx}" y="50" class="fg-t" text-anchor="middle">N</text>`
      + `<text x="${cx + 22}" y="30" class="fg-t b">Lực kế</text>`;
    g += `<rect x="${cx - ow / 2}" y="${oy}" width="${ow}" height="${oh}" rx="3" class="fg-obj2"/>`;
    // Mũi tên P (xuống) và F_A (lên)
    g += figArrow(cx - 34, oy + oh / 2 - 14, cx - 34, oy + oh / 2 + 22, 'fg-f2') + `<text x="${cx - 40}" y="${oy + oh / 2 + 8}" class="fg-t b" text-anchor="end">P</text>`;
    if (FA > 0) g += figArrow(cx + 34, oy + oh / 2 + 22, cx + 34, oy + oh / 2 + 22 - Math.max(8, 36 * FA / P), 'fg-f1') + `<text x="${cx + 40}" y="${oy + oh / 2 + 8}" class="fg-t b">F<tspan dy="3" font-size="8">A</tspan></text>`;
    const fa = figFmt(Math.round(FA * 1000) / 1000), lk = figFmt(Math.round(Math.max(0, doc) * 1000) / 1000);
    const cap = an ? `Vật treo dưới lực kế, chìm ${Math.round(phan * 100)}% thể tích trong chất lỏng` : `Chìm ${Math.round(phan * 100)}% thể tích: lực đẩy Archimedes ${fa} N; lực kế chỉ ${lk} N`;
    const capH = an ? esc(cap) : `Chìm ${Math.round(phan * 100)}% thể tích: F<sub>A</sub> = d·V<sub>chìm</sub> = ${fa} N; lực kế chỉ P − F<sub>A</sub> = ${lk} N`;
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${capH}</small></span>`;
  },

  apsuat(a) {
    const n = a.trim().split(/\s+/).map(figNum);
    const an = /(^|\s)an(\s|$)/.test(a), Hd = n[1] > 0 ? n[1] : 3, h = Math.max(0, Math.min(Hd, isFinite(n[0]) ? n[0] : 1)), d = n[2] > 0 ? n[2] : 10000, p = d * h;
    const W = 300, H = 200, top = 30, bot = 180, x0 = 70, x1 = 250, Y = v => top + (bot - top) * v / Hd, py = Y(h), px = 160;
    let g = `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${bot - top}" class="fg-liq"/><path d="M${x0} ${top - 12} V${bot} H${x1} V${top - 12}" class="fg-cup"/>`;
    // Thước đo độ sâu
    const tk = figTicks(Hd);   // vạch chia tự giãn (bể sâu 90 m không in 91 vạch)
    for (let v = 0; v <= Hd + 1e-9; v += tk.step) g += `<line x1="${x0 - 8}" y1="${Y(v)}" x2="${x0 - 2}" y2="${Y(v)}" class="fg-ax"/><text x="${x0 - 11}" y="${Y(v) + 3.5}" class="fg-t" text-anchor="end">${figFmt(v)} m</text>`;
    g += `<line x1="${x0 - 5}" y1="${top}" x2="${x0 - 5}" y2="${bot}" class="fg-ax"/>`;
    // Điểm M và áp suất theo mọi phương (mũi tên dài bằng nhau, dài hơn khi sâu hơn)
    const L = 10 + 26 * h / Hd;
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { g += figArrow(px - dx * (L + 4), py - dy * (L + 4), px - dx * 4, py - dy * 4, 'fg-f1'); });
    const tt = a.trim().split(/\s+/), iN = tt.indexOf('N'), hN = iN >= 0 ? figNum(tt[iN + 1]) : NaN;   // điểm thứ hai N (so sánh áp suất)
    if (hN >= 0 && hN <= Hd) g += `<circle cx="${px + 50}" cy="${Y(hN)}" r="3.5" class="fg-node"/><text x="${px + 58}" y="${Y(hN) - 8}" class="fg-t b">N</text>`;
    g += `<circle cx="${px}" cy="${py}" r="3.5" class="fg-node"/><text x="${px + 8}" y="${py - 8}" class="fg-t b">M</text>`
      + `<line x1="${x1 + 8}" y1="${top}" x2="${x1 + 8}" y2="${py}" class="fg-dim"/><text x="${x1 + 12}" y="${(top + py) / 2 + 4}" class="fg-t b">h</text>`;
    const cap = an ? `Điểm M ở độ sâu h = ${figFmt(h)} m${hN >= 0 ? `, điểm N ở độ sâu ${figFmt(hN)} m` : ''} trong chất lỏng` : `Tại M sâu h = ${figFmt(h)} m: áp suất do chất lỏng gây ra p = d·h = ${figFmt(p).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} Pa, như nhau theo mọi phương`;
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${esc(cap)}</small></span>`;
  },

  binhthong() {
    const W = 330, H = 170, lv = 60;
    // Ba nhánh: thẳng hẹp (40–62), loe rộng dần lên trên, xiên; nối với nhau bằng ống dưới đáy (y 128–150)
    const at = (xa, ya, xb, yb, y) => xa + (xb - xa) * (y - ya) / (yb - ya);       // hoành độ trên thành bình tại độ cao y
    const v2L = at(120, 128, 105, 22, lv), v2R = at(140, 128, 155, 22, lv), v3L = at(210, 128, 232, 22, lv), v3R = at(232, 150, 254, 22, lv);
    let g = `<path d="M40 ${lv} H62 V128 H120 L${v2L.toFixed(1)} ${lv} H${v2R.toFixed(1)} L140 128 H210 L${v3L.toFixed(1)} ${lv} H${v3R.toFixed(1)} L232 150 H40 Z" class="fg-liq"/>`;
    g += `<path d="M40 22 V150 H232 L254 22 M62 22 V128 H120 L105 22 M155 22 L140 128 H210 L232 22" class="fg-cup"/>`;
    g += `<line x1="28" y1="${lv}" x2="266" y2="${lv}" class="fg-norm"/><text x="268" y="${lv + 4}" class="fg-t b">mực ngang nhau</text>`;
    const cap = 'Bình thông nhau chứa cùng một chất lỏng đứng yên: mực chất lỏng ở các nhánh cao bằng nhau, dù hình dạng nhánh khác nhau';
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${esc(cap)}</small></span>`;
  },

  luoi(a) {
    const mat = (a.match(/mat-([a-z]+)/) || [])[1] || '', an = /(^|\s)an(\s|$)/.test(a);   // "an" = dùng trong câu hỏi: không cho chạm, không ghi hệ quả
    const W = 330, H = 210, cols = [40, 125, 215, 295], rows = [45, 105, 165];
    const pos = id => { const s = LUOI.sv.find(x => x[0] === id); return [cols[s[2]], rows[s[3]]]; };
    const bac = ['Sinh vật sản xuất', 'Tiêu thụ bậc 1', 'Tiêu thụ bậc 2', 'Bậc cao hơn'];
    let g = bac.map((b, i) => `<text x="${cols[i]}" y="14" class="fg-t" text-anchor="middle">${b}</text>`).join('');
    LUOI.an.forEach(([x, y]) => { const [x1, y1] = pos(x), [x2, y2] = pos(y), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), k1 = 24 / L, k2 = 26 / L;
      const off = mat && (x === mat || y === mat);
      g += figArrow(+(x1 + dx * k1).toFixed(1), +(y1 + dy * k1).toFixed(1), +(x2 - dx * k2).toFixed(1), +(y2 - dy * k2).toFixed(1), off ? 'fg-edge off' : 'fg-edge'); });
    LUOI.sv.forEach(([id, ten]) => { const [x, y] = pos(id), off = id === mat;
      g += `<g class="fg-sp${off ? ' off' : ''}"${an ? '' : ` data-sp="${id}" role="button" tabindex="0"`} aria-label="${esc(ten)}"><rect x="${x - 30}" y="${y - 13}" width="60" height="26" rx="13" class="fg-spb${id === 'co' ? ' sx' : ''}"/><text x="${x}" y="${y + 4}" class="fg-t b" text-anchor="middle">${ten}</text></g>`; });
    g += `<text x="${W / 2}" y="${H - 6}" class="fg-t" text-anchor="middle">Vi khuẩn, nấm (sinh vật phân giải) phân giải xác và chất thải</text>`;
    const cap = an ? 'Mũi tên chỉ chiều “bị ăn → ăn”.' : mat ? luoiEffect(mat) : 'Mũi tên chỉ chiều “bị ăn → ăn”. Chạm một loài để xem điều gì xảy ra khi loài đó biến mất.';
    return `<span class="bk-fig fg-wrap fg-luoi"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Lưới thức ăn ở đồng cỏ">${g}</svg><small class="fg-cap luoi-info">${cap}</small>${mat ? '<button class="b3 light sm" data-sp="">Khôi phục lưới</button>' : ''}</span>`;
  },
});

// Chạm một loài trong lưới → vẽ lại lưới khi loài đó biến mất
document.addEventListener('click', e => {
  const s = e.target.closest('[data-sp]'); if (!s) return;
  const wrap = s.closest('.fg-luoi'); if (!wrap) return;
  wrap.outerHTML = FIG.luoi(s.dataset.sp ? 'mat-' + s.dataset.sp : '');
});

;

/* fig5.js */
/* HÌNH VẼ BẰNG MÃ (đợt 5): vòng tuần hoàn, pha Mặt Trăng, sự nở vì nhiệt, con lắc (động năng – thế năng), vòng đời.
   [tuanhoan:ca|lon|nho]   sơ đồ hai vòng tuần hoàn ở người (tim nhìn từ phía trước: tim phải ở bên trái hình), chấm máu chạy theo mạch
                           Vòng nhỏ: tâm thất phải → động mạch phổi → mao mạch phổi → tĩnh mạch phổi → tâm nhĩ trái.
                           Vòng lớn: tâm thất trái → động mạch chủ → mao mạch các cơ quan → tĩnh mạch chủ → tâm nhĩ phải.
   [phatrang:7,4]          vị trí Mặt Trăng sau 7,4 ngày kể từ trăng mới (chu kì khoảng 29,5 ngày) và hình dạng trăng nhìn từ Việt Nam
   [novinhiet:60]          chất rắn, lỏng, khí cùng nóng thêm 60 °C: độ nở vẽ PHÓNG ĐẠI, giữ đúng thứ tự khí > lỏng > rắn
   [conlac:30]             con lắc dài 1 m, vật 0,2 kg (P = 2 N) thả từ góc 60°; đang ở góc 30°; bỏ qua lực cản; thế năng tính từ vị trí thấp nhất
   [vongdoi:ech|buom|muoi] vòng đời 4 giai đoạn; chạm từng giai đoạn để xem đặc điểm */

const VD_DATA = {
  ech: {ten: 'Vòng đời của ếch', loai: 'phát triển qua biến thái', st: [
    ['Trứng', 'Ếch đẻ trứng trong nước; trứng được thụ tinh ngoài.'],
    ['Nòng nọc', 'Sống trong nước, bơi bằng đuôi, thở bằng mang.'],
    ['Ếch con', 'Mọc chân, đuôi ngắn dần rồi tiêu biến; bắt đầu lên cạn.'],
    ['Ếch trưởng thành', 'Sống được ở cạn và dưới nước, thở bằng phổi và da; sinh sản.']]},
  buom: {ten: 'Vòng đời của bướm', loai: 'biến thái hoàn toàn', st: [
    ['Trứng', 'Bướm đẻ trứng trên lá cây.'],
    ['Sâu (ấu trùng)', 'Ăn lá, lớn rất nhanh, lột xác nhiều lần; giai đoạn này phá hại cây trồng.'],
    ['Nhộng', 'Không ăn, ít di chuyển; bên trong diễn ra biến đổi lớn để thành bướm.'],
    ['Bướm', 'Có cánh, hút mật hoa; giao phối và đẻ trứng.']]},
  muoi: {ten: 'Vòng đời của muỗi', loai: 'biến thái hoàn toàn', st: [
    ['Trứng', 'Muỗi đẻ trứng trên mặt nước đọng.'],
    ['Bọ gậy (ấu trùng)', 'Sống trong nước, ngoi lên mặt nước để thở; dễ tiêu diệt nhất.'],
    ['Cung quăng (nhộng)', 'Sống trong nước, không ăn; sau đó lột xác thành muỗi.'],
    ['Muỗi trưởng thành', 'Bay được; muỗi cái hút máu, có thể truyền bệnh sốt xuất huyết, sốt rét.']]},
};

Object.assign(FIG, {
  tuanhoan(a) {
    const k = (a.trim() || 'ca').split(/\s+/)[0], on = g => k === 'ca' || k === g, an = /(^|\s)an(\s|$)/.test(a);   // "an": dùng trong câu hỏi, không ghi đường đi của máu
    const RED = an ? '#8A94A6' : '#D7263D', BLUE = an ? '#8A94A6' : '#3A56A8';   // an: mạch xám, không chấm máu chạy, không chú giải màu (hỏi đường đi / sự đổi máu)
    const V = {   // [id, path, màu, vòng, nhãn, x, y]
      dmp: ['M112 184 H62 V44 H112', BLUE, 'nho', 'Động mạch phổi', 66, 96],
      tmp: ['M208 44 H258 V140 H208', RED, 'nho', 'Tĩnh mạch phổi', 262, 96],
      dmc: ['M208 184 H290 V270 H208', RED, 'lon', 'Động mạch chủ', 294, 228],
      tmc: ['M112 270 H30 V140 H112', BLUE, 'lon', 'Tĩnh mạch chủ', 34, 206],
    };
    let g = `<rect x="112" y="24" width="96" height="40" rx="12" class="fg-organ"/><text x="160" y="42" class="fg-t b" text-anchor="middle">Phổi</text><text x="160" y="55" class="fg-t" text-anchor="middle">nhận O₂, thải CO₂</text>`
      + `<rect x="112" y="250" width="96" height="40" rx="12" class="fg-organ"/><text x="160" y="268" class="fg-t b" text-anchor="middle">Các cơ quan</text><text x="160" y="281" class="fg-t" text-anchor="middle">nhận O₂, thải CO₂</text>`;
    // Tim: 4 ngăn (nhìn từ phía trước nên tim phải ở bên trái hình)
    const ngan = [[112, 118, 'Tâm nhĩ phải', BLUE], [112, 162, 'Tâm thất phải', BLUE], [164, 118, 'Tâm nhĩ trái', RED], [164, 162, 'Tâm thất trái', RED]];
    g += ngan.map(([x, y, t, c]) => `<rect x="${x}" y="${y}" width="44" height="40" rx="8" fill="${c}" opacity=".18" stroke="${c}" stroke-width="1.5"/><text x="${x + 22}" y="${y + 17}" class="fg-t b" text-anchor="middle" font-size="8.5">${t.split(' ')[0]} ${t.split(' ')[1]}</text><text x="${x + 22}" y="${y + 28}" class="fg-t b" text-anchor="middle" font-size="8.5">${t.split(' ')[2]}</text>`).join('')
      + figArrow(134, 150, 134, 164, 'fg-in') + figArrow(186, 150, 186, 164, 'fg-in');
    Object.entries(V).forEach(([id, [d, c, vong, lab, lx, ly]]) => {
      const mo = on(vong) ? 1 : 0.18;
      g += `<path id="th-${id}" d="${d}" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round" opacity="${mo}"/>`;
      if (on(vong) && !an) for (let i = 0; i < 3; i++) g += `<circle r="3.6" fill="#fff" stroke="${c}" stroke-width="1.5"><animateMotion dur="3s" begin="-${i}s" repeatCount="indefinite" path="${d}"/></circle>`;
      g += `<text x="${lx}" y="${ly}" class="fg-t b" opacity="${mo}" ${lx > 200 ? '' : ''}>${lab.split(' ').slice(0, 2).join(' ')}</text><text x="${lx}" y="${ly + 11}" class="fg-t b" opacity="${mo}">${lab.split(' ').slice(2).join(' ')}</text>`;
    });
    if (!an) g += `<rect x="4" y="298" width="10" height="6" fill="${RED}"/><text x="18" y="304" class="fg-t">máu đỏ tươi (giàu O₂)</text><rect x="150" y="298" width="10" height="6" fill="${BLUE}"/><text x="164" y="304" class="fg-t">máu đỏ thẫm (giàu CO₂)</text>`;
    const cap = an ? 'Sơ đồ hệ tuần hoàn' : k === 'nho' ? 'Vòng tuần hoàn nhỏ: tâm thất phải → động mạch phổi → mao mạch phổi → tĩnh mạch phổi → tâm nhĩ trái'
      : k === 'lon' ? 'Vòng tuần hoàn lớn: tâm thất trái → động mạch chủ → mao mạch các cơ quan → tĩnh mạch chủ → tâm nhĩ phải'
      : 'Hai vòng tuần hoàn ở người (tim vẽ như nhìn từ phía trước người đó nên tim phải ở bên trái hình)';
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 370 310" width="370" height="310" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${esc(cap)}</small></span>`;
  },

  phatrang(a) {
    const day = Math.max(0, Math.min(29.5, figNum(a) || 0)), th = 360 * day / 29.5, rad = th * Math.PI / 180;
    const W = 330, H = 190, ex = 110, ey = 95, R = 62;
    // Quỹ đạo: Mặt Trời ở bên trái; θ = 0 (trăng mới) Mặt Trăng nằm giữa Trái Đất và Mặt Trời; quay ngược chiều kim đồng hồ (nhìn từ cực Bắc)
    const mx = ex + R * Math.cos(Math.PI + rad), my = ey - R * Math.sin(Math.PI + rad);
    let g = '';
    for (let i = 0; i < 5; i++) g += figArrow(4, 30 + i * 32, 30, 30 + i * 32, 'fg-sunray');
    g += `<text x="4" y="186" class="fg-t">Ánh sáng Mặt Trời</text><circle cx="${ex}" cy="${ey}" r="${R}" class="fg-orbit"/>`
      + `<circle cx="${ex}" cy="${ey}" r="13" class="fg-earth"/><path d="M${ex} ${ey - 13} A13 13 0 0 0 ${ex} ${ey + 13} Z" class="fg-earthlit"/><text x="${ex}" y="${ey + 27}" class="fg-t b" text-anchor="middle">Trái Đất</text>`
      + `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="7" class="fg-moondark"/><path d="M${mx.toFixed(1)} ${(my - 7).toFixed(1)} A7 7 0 0 0 ${mx.toFixed(1)} ${(my + 7).toFixed(1)} Z" class="fg-moonlit"/>`;
    // Hình dạng trăng nhìn từ Trái Đất (Bắc bán cầu): trăng đầu tháng sáng bên phải, cuối tháng sáng bên trái
    const cx = 272, cy = 80, r = 34, rx = Math.abs(Math.cos(rad)) * r, right = th < 180, gib = Math.cos(rad) < 0, S = gib === right ? 1 : 0;
    g += `<circle cx="${cx}" cy="${cy}" r="${r}" class="fg-moondark"/><path d="M${cx} ${cy - r} A${r} ${r} 0 0 ${right ? 1 : 0} ${cx} ${cy + r} A${rx.toFixed(2)} ${r} 0 0 ${S} ${cx} ${cy - r} Z" class="fg-moonlit"/>`
      + `<text x="${cx}" y="${cy + r + 16}" class="fg-t b" text-anchor="middle">Nhìn từ Trái Đất</text>`;
    const PHA = ['Trăng mới (không trăng)', 'Trăng lưỡi liềm đầu tháng', 'Trăng bán nguyệt đầu tháng', 'Trăng khuyết đầu tháng', 'Trăng tròn', 'Trăng khuyết cuối tháng', 'Trăng bán nguyệt cuối tháng', 'Trăng lưỡi liềm cuối tháng'];
    const ten = PHA[Math.floor(((th + 22.5) % 360) / 45)];
    const cap = `${ten} · khoảng ngày ${Math.min(30, Math.floor(day) + 1)} âm lịch (hình không theo tỉ lệ)`;
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${esc(cap)}</small></span>`;
  },

  novinhiet(a) {
    const dt = Math.max(0, Math.min(100, figNum(a) || 0)), f = dt / 100;
    // Độ nở VẼ PHÓNG ĐẠI để nhìn được, chỉ giữ đúng thứ tự: khí nở nhiều nhất, rồi lỏng, rắn ít nhất
    const W = 330, H = 170;
    let g = `<text x="55" y="18" class="fg-t b" text-anchor="middle">Chất rắn</text><text x="165" y="18" class="fg-t b" text-anchor="middle">Chất lỏng</text><text x="275" y="18" class="fg-t b" text-anchor="middle">Chất khí</text>`;
    // Rắn: thanh kim loại
    const L0 = 80, L = L0 + 6 * f;
    g += `<rect x="15" y="70" width="${L0}" height="12" class="fg-ghost"/><rect x="15" y="70" width="${L.toFixed(1)}" height="12" rx="2" class="fg-metal"/><text x="55" y="104" class="fg-t" text-anchor="middle">thanh kim loại</text>`;
    // Lỏng: bình cầu, ống nhỏ; mực chất lỏng dâng
    const h0 = 30, h = h0 + 34 * f;
    g += `<circle cx="165" cy="120" r="24" class="fg-liq2"/><circle cx="165" cy="120" r="24" class="fg-cup"/><rect x="161" y="${120 - 24 - h}" width="8" height="${h}" class="fg-liq2"/><path d="M161 96 V24 M169 96 V24" class="fg-cup"/>`
      + `<line x1="152" y1="${96 - h0}" x2="178" y2="${96 - h0}" class="fg-norm"/><text x="182" y="${99 - h0}" class="fg-t">lúc đầu</text>`;
    // Khí: quả bóng bịt miệng bình
    const r0 = 18, rr = r0 + 14 * f;
    g += `<circle cx="275" cy="70" r="${r0}" class="fg-ghostc"/><circle cx="275" cy="${70 - (rr - r0)}" r="${rr.toFixed(1)}" class="fg-balloon"/><rect x="262" y="${88}" width="26" height="46" rx="4" class="fg-cup"/><text x="275" y="152" class="fg-t" text-anchor="middle">bình chứa không khí</text>`;
    const cap = dt ? `Cùng nóng thêm ${figFmt(dt)} °C: chất khí nở nhiều nhất, chất lỏng nở ít hơn, chất rắn nở ít nhất (độ nở vẽ phóng đại)` : 'Chưa đun nóng: kéo thanh để tăng nhiệt độ';
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${esc(cap)}</small></span>`;
  },

  conlac(a) {
    const A0 = 60, ang = Math.max(-A0, Math.min(A0, figNum(a) || 0)), Lm = 1, P = 2, m = 0.2;
    const rad = x => x * Math.PI / 180, h = Lm * (1 - Math.cos(rad(ang))), h0 = Lm * (1 - Math.cos(rad(A0)));
    const W0 = P * h0, Wt = P * h, Wd = Math.max(0, W0 - Wt), v = Math.sqrt(2 * Wd / m);
    const W = 330, H = 200, ox = 115, oy = 20, Lp = 120, bx = ox + Lp * Math.sin(rad(ang)), by = oy + Lp * Math.cos(rad(ang));
    let g = `<line x1="${ox - 40}" y1="${oy}" x2="${ox + 40}" y2="${oy}" class="fg-wire"/>`;
    // Cung chuyển động và hai vị trí cao nhất
    g += `<path d="M${(ox - Lp * Math.sin(rad(A0))).toFixed(1)} ${(oy + Lp * Math.cos(rad(A0))).toFixed(1)} A${Lp} ${Lp} 0 0 0 ${(ox + Lp * Math.sin(rad(A0))).toFixed(1)} ${(oy + Lp * Math.cos(rad(A0))).toFixed(1)}" class="fg-norm" fill="none"/>`;
    g += `<line x1="${ox}" y1="${oy}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" class="fg-wire"/><circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="9" class="fg-bob"/>`;
    const yLow = oy + Lp;
    g += `<line x1="${ox - 70}" y1="${yLow + 9}" x2="${ox + 70}" y2="${yLow + 9}" class="fg-grid"/><text x="${ox - 70}" y="${yLow + 22}" class="fg-t">mốc thế năng (vị trí thấp nhất)</text>`;
    // Cột năng lượng
    const bw = 22, base = 170, sc = 120 / W0, bar = (x, val, cls, lab) => `<rect x="${x}" y="${(base - val * sc).toFixed(1)}" width="${bw}" height="${(val * sc).toFixed(1)}" class="${cls}"/><text x="${x + bw / 2}" y="${base + 13}" class="fg-t b" text-anchor="middle">${lab}</text><text x="${x + bw / 2}" y="${(base - val * sc - 4).toFixed(1)}" class="fg-t" text-anchor="middle">${figFmt(Math.round(val * 100) / 100)}</text>`;
    g += bar(238, Wt, 'fg-wt', 'Wt') + bar(266, Wd, 'fg-wd', 'Wđ') + bar(294, W0, 'fg-w', 'W') + `<text x="292" y="30" class="fg-t" text-anchor="middle">năng lượng (J)</text>`;
    const cap = `Góc lệch ${Math.abs(Math.round(ang))}°: thế năng ${figFmt(Math.round(Wt * 100) / 100)} J, động năng ${figFmt(Math.round(Wd * 100) / 100)} J, cơ năng luôn ${figFmt(Math.round(W0 * 100) / 100)} J; tốc độ khoảng ${figFmt(Math.round(v * 100) / 100)} m/s (bỏ qua lực cản)`;
    return `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${esc(cap)}</small></span>`;
  },

  vongdoi(a) {
    const [k, sel] = a.trim().split(/\s+/), D = VD_DATA[k] || VD_DATA.ech, si = sel != null && sel !== '' ? +sel : -1;
    const W = 320, H = 250, cx = 160, cy = 142, RX = 104, RY = 78, R = 1, pos = i => [cx + RX * Math.sin(i * Math.PI / 2), cy - RY * Math.cos(i * Math.PI / 2)];
    let g = `<text x="${cx}" y="14" class="fg-t b" text-anchor="middle">${D.ten}</text><text x="${cx}" y="28" class="fg-t" text-anchor="middle">(${D.loai})</text>`;
    D.st.forEach((_, i) => { const [x1, y1] = pos(i), [x2, y2] = pos((i + 1) % 4), am = (i + 0.5) * Math.PI / 2, px = cx + RX * 1.05 * Math.sin(am), py = cy - RY * 1.05 * Math.cos(am);
      g += `<path d="M${(x1 + (px - x1) * 0.35).toFixed(1)} ${(y1 + (py - y1) * 0.35).toFixed(1)} Q${px.toFixed(1)} ${py.toFixed(1)} ${(x2 + (px - x2) * 0.35).toFixed(1)} ${(y2 + (py - y2) * 0.35).toFixed(1)}" class="fg-cyc"/>`
        + figArrow(+(x2 + (px - x2) * 0.42).toFixed(1), +(y2 + (py - y2) * 0.42).toFixed(1), +(x2 + (px - x2) * 0.35).toFixed(1), +(y2 + (py - y2) * 0.35).toFixed(1), 'fg-cyc'); });
    D.st.forEach(([ten], i) => { const [x, y] = pos(i);
      g += `<g class="fg-st${i === si ? ' hl' : ''}" data-vd="${k} ${i}" role="button" tabindex="0" aria-label="${esc(ten)}"><rect x="${x - 55}" y="${y - 14}" width="110" height="28" rx="14" class="fg-stb"/><text x="${x}" y="${y + 4}" class="fg-t b" text-anchor="middle">${i + 1}. ${ten}</text></g>`; });
    const info = si >= 0 ? `<b>${esc(D.st[si][0])}:</b> ${esc(D.st[si][1])}` : 'Chạm vào từng giai đoạn để xem đặc điểm.';
    return `<span class="bk-fig fg-wrap fg-vd"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(D.ten + ': ' + D.st.map(s => s[0]).join(' → '))}">${g}</svg><small class="fg-cap">${info}</small></span>`;
  },
});

document.addEventListener('click', e => {
  const s = e.target.closest('[data-vd]'); if (!s) return;
  const wrap = s.closest('.fg-vd'); if (wrap) wrap.outerHTML = FIG.vongdoi(s.dataset.vd);
});

;

/* fig6.js */
/* HÌNH VẼ BẰNG MÃ (đợt 6) — vẽ THEO SỐ LIỆU, đúng tỉ lệ; mỗi loại có bộ tự kiểm (scratchpad/test_fig6.js).
   Các phần cách nhau "|", cờ viết rời (an = không ghi gì làm lộ đáp án; so = ghi thêm số đo).
   LÝ
   [mang:A 2; B 0; C 1,2 | moc B | bi A | so | an]  máng trượt / mặt dốc qua các điểm theo thứ tự trái → phải, số = độ cao so với MẶT ĐẤT (m).
                          Vẽ đúng tỉ lệ độ cao, có trục h (m). moc = tên điểm hoặc độ cao (m) làm mốc thế năng (mặc định mặt đất).
                          bi A = viên bi ở A. so = ghi độ cao từng điểm SO VỚI MỐC. an = bỏ số trên trục (độ cao cho trong đề).
   [conlac2:goc 45 | M 20 | l 1 | vat O | h | so | an]  con lắc đơn thả từ A lệch goc° (A bên trái, B bên phải, O thấp nhất);
                          M = thêm điểm M ở góc lệch 20° (âm: bên trái); vat = vị trí vẽ vật (A/O/B/M, mặc định A);
                          l = chiều dài dây (m); h = vẽ đoạn độ cao h của A so với O; so = ghi giá trị h = l(1 − cos α).
   [khucxa:i 40 | mt kk nuoc | r 29 | so | px | an]   tia sáng qua mặt phân cách phẳng; mt = môi trường trên, dưới: kk (n = 1), nuoc (1,33),
                          thuytinh (1,5) hoặc số chiết suất. Không cho r thì máy tính r theo sin i / sin r = n2/n1.
                          Nếu đi từ môi trường chiết quang hơn và i vượt góc tới hạn: vẽ phản xạ toàn phần. px = vẽ thêm tia phản xạ mờ.
                          Mặc định ghi số đo i, chỉ ghi chữ "r"; so = ghi cả số đo r; an = không ghi số đo nào.
   [camung:vao | S | an]  nam châm – cuộn dây – điện kế G. vao / ra / yen (đứng yên). S = cực S quay về cuộn dây (mặc định N).
                          an = không vẽ kim điện kế (hỏi kim có lệch không).
   [sodo:A → B → C | vong] sơ đồ khối có mũi tên (chuyển hoá năng lượng, chuỗi thức ăn, chu trình…). Ô "?" = ô cần điền.
                          vong = mũi tên quay lại ô đầu. Từ 4 ô trở lên vẽ dọc.
   HÓA
   [ctct:ethanol | thugon | an]  công thức cấu tạo đầy đủ (mặc định) hoặc thu gọn: methane, ethane, propane, butane, isobutane,
                          ethylene, chloromethane, dibromoethane, ethanol, acetic, ethylacetate, pe (mắt xích polyethylene).
                          an = không ghi tên chất dưới hình.
   [ctct:mach thang 4] [ctct:mach nhanh 4] [ctct:mach vong 6]   các loại mạch carbon (chỉ vẽ nguyên tử C).
   [thukhi:ngua | khi CO2 | an]  cách thu khí: ngua = đẩy không khí, bình ngửa (khí nặng hơn không khí);
                          up = đẩy không khí, bình úp (khí nhẹ hơn không khí); nuoc = đẩy nước (khí ít tan trong nước).
   SINH
   [nst:2n 4 | np giua | an]   tế bào đang phân bào: np (nguyên phân) / gp1 / gp2 (giảm phân I, II) + dau / giua / sau / cuoi.
                          2n = 2…8 (chẵn). Mỗi cặp tương đồng một màu: đậm = chiếc từ bố, nhạt = chiếc từ mẹ. an = không ghi tên kì.
   [nst:2n 8 | bo | kep | xy]  bộ NST lưỡng bội xếp theo cặp; kep = NST kép; xy / xx = cặp NST giới tính.
   [nst:2n 8 | giaotu]    giao tử: n NST đơn.
   [phahe:m F / M f m | I1-I2: II1 II3 | an]  sơ đồ phả hệ: các thế hệ cách nhau "/", m nam, f nữ, VIẾT HOA = bị bệnh, thêm ? = chưa biết.
                          I1-I2: II1 II3 = cặp vợ chồng I1–I2 (phải đứng cạnh nhau) có các con II1, II3 (đứng liền nhau).
                          Nhiều gia đình cách nhau "|". */

const f6parts = a => String(a).split('|').map(s => s.trim()).filter(Boolean);
const f6flag = (a, k) => f6parts(a).some(p => p.split(/\s+/).includes(k));
const f6kv = (P, k) => { const p = P.find(s => s.split(/\s+/)[0] === k); return p == null ? null : p.slice(k.length).trim(); };
const f6r = (x, d = 1) => +x.toFixed(d);
const f6wrap = (W, H, g, cap) => `<span class="bk-fig fg-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(cap)}">${g}</svg><small class="fg-cap">${esc(cap)}</small></span>`;
const f6deg = x => x * Math.PI / 180;
const f6arc = (cx, cy, r, a1, a2) => {   // cung tròn từ góc a1 đến a2 (độ, 0 = sang phải, tăng theo chiều kim đồng hồ trên màn hình)
  const p = a => [f6r(cx + r * Math.cos(f6deg(a))), f6r(cy + r * Math.sin(f6deg(a)))], [x1, y1] = p(a1), [x2, y2] = p(a2);
  return `<path d="M${x1} ${y1} A${r} ${r} 0 ${Math.abs(a2 - a1) > 180 ? 1 : 0} ${a2 > a1 ? 1 : 0} ${x2} ${y2}" class="fg-arc"/>`; };

// Nội suy bậc ba đơn điệu (không vọt quá các điểm đã cho): cực trị của máng chỉ nằm đúng tại các điểm có ghi độ cao
function f6mono(xs, ys) {
  const n = xs.length, d = [], m = [];
  for (let k = 0; k < n - 1; k++) d.push((ys[k + 1] - ys[k]) / (xs[k + 1] - xs[k]));
  for (let k = 0; k < n; k++) m.push(k === 0 || k === n - 1 ? 0 : d[k - 1] * d[k] <= 0 ? 0 : 2 * d[k - 1] * d[k] / (d[k - 1] + d[k]));
  let s = `M${f6r(xs[0])} ${f6r(ys[0])}`;
  for (let k = 0; k < n - 1; k++) { const h = (xs[k + 1] - xs[k]) / 3;
    s += ` C${f6r(xs[k] + h)} ${f6r(ys[k] + m[k] * h)} ${f6r(xs[k + 1] - h)} ${f6r(ys[k + 1] - m[k + 1] * h)} ${f6r(xs[k + 1])} ${f6r(ys[k + 1])}`; }
  return s;
}

// ---------- HÓA: dữ liệu công thức cấu tạo (toạ độ lưới, liên kết [i, j, bậc]) ----------
function ctAlk(n) {
  const a = [], b = [];
  for (let i = 0; i < n; i++) { a.push(['C', i, 0]); if (i) b.push([i - 1, i, 1]); }
  const H = (x, y, c) => { a.push(['H', x, y]); b.push([c, a.length - 1, 1]); };
  H(-1, 0, 0); for (let i = 0; i < n; i++) { H(i, -1, i); H(i, 1, i); } H(n, 0, n - 1);
  return {a, b};
}
const ctSwap = (m, x, y, el) => { m.a.find(t => t[1] === x && t[2] === y)[0] = el; return m; };
const ctAdd = (m, el, x, y, to, o = 1) => { m.a.push([el, x, y]); m.b.push([to, m.a.length - 1, o]); return m; };
const CTCT = {
  methane: ['methane', 'CH4', () => ctAlk(1), 'CH4'],
  ethane: ['ethane', 'C2H6', () => ctAlk(2), 'CH3–CH3'],
  propane: ['propane', 'C3H8', () => ctAlk(3), 'CH3–CH2–CH3'],
  butane: ['butane', 'C4H10', () => ctAlk(4), 'CH3–CH2–CH2–CH3'],
  isobutane: ['isobutane', 'C4H10', () => { const m = {a: [['C', 0, 0], ['C', 1, 0], ['C', 2, 0], ['C', 1, 2]], b: [[0, 1, 1], [1, 2, 1], [1, 3, 1]]};
    [[-1, 0, 0], [0, -1, 0], [0, 1, 0], [1, -1, 1], [2, -1, 2], [2, 1, 2], [3, 0, 2], [0, 2, 3], [2, 2, 3], [1, 3, 3]].forEach(([x, y, c]) => ctAdd(m, 'H', x, y, c)); return m; }, 'CH3–CH(CH3)–CH3'],
  ethylene: ['ethylene', 'C2H4', () => { const m = {a: [['C', 0, 0], ['C', 1, 0]], b: [[0, 1, 2]]};
    [[0, -1, 0], [0, 1, 0], [1, -1, 1], [1, 1, 1]].forEach(([x, y, c]) => ctAdd(m, 'H', x, y, c)); return m; }, 'CH2=CH2'],
  chloromethane: ['chloromethane', 'CH3Cl', () => ctSwap(ctAlk(1), 1, 0, 'Cl'), 'CH3–Cl'],
  dibromoethane: ['1,2-dibromoethane', 'C2H4Br2', () => ctSwap(ctSwap(ctAlk(2), -1, 0, 'Br'), 2, 0, 'Br'), 'Br–CH2–CH2–Br'],
  ethanol: ['ethylic alcohol (ethanol)', 'C2H6O', () => ctAdd(ctSwap(ctAlk(2), 2, 0, 'O'), 'H', 3, 0, 7), 'CH3–CH2–OH'],
  acetic: ['acetic acid', 'C2H4O2', () => { const m = {a: [['C', 0, 0], ['C', 1, 0]], b: [[0, 1, 1]]};
    [[-1, 0], [0, -1], [0, 1]].forEach(([x, y]) => ctAdd(m, 'H', x, y, 0)); ctAdd(m, 'O', 1, -1, 1, 2); ctAdd(m, 'O', 2, 0, 1); ctAdd(m, 'H', 3, 0, 6); return m; }, 'CH3–COOH'],
  ethylacetate: ['ethyl acetate', 'C4H8O2', () => { const m = {a: [['C', 0, 0], ['C', 1, 0]], b: [[0, 1, 1]]};
    [[-1, 0], [0, -1], [0, 1]].forEach(([x, y]) => ctAdd(m, 'H', x, y, 0)); ctAdd(m, 'O', 1, -1, 1, 2); ctAdd(m, 'O', 2, 0, 1);
    ctAdd(m, 'C', 3, 0, 6); ctAdd(m, 'H', 3, -1, 7); ctAdd(m, 'H', 3, 1, 7); ctAdd(m, 'C', 4, 0, 7); [[4, -1], [4, 1], [5, 0]].forEach(([x, y]) => ctAdd(m, 'H', x, y, 10)); return m; }, 'CH3–COO–CH2–CH3'],
  pe: ['polyethylene', 'C2H4', () => { const m = {a: [['C', 0, 0], ['C', 1, 0], ['*', -1, 0], ['*', 2, 0]], b: [[0, 1, 1], [0, 2, 1], [1, 3, 1]]};
    [[0, -1, 0], [0, 1, 0], [1, -1, 1], [1, 1, 1]].forEach(([x, y, c]) => ctAdd(m, 'H', x, y, c)); return m; }, '–(CH2–CH2)n–'],
};
const CT_HOA_TRI = {C: 4, H: 1, O: 2, Cl: 1, Br: 1, '*': 1};
const CT_MAU = {O: '#D7263D', Cl: '#2E9C3A', Br: '#A0522D'};

// ---------- SINH: nhiễm sắc thể ----------
const NST_DAM = ['#D8572A', '#2F6FB0', '#2E8B57', '#7B55C7'], NST_NHAT = ['#F4A582', '#92C5DE', '#A6DBA0', '#C9B3EE'], NST_DAI = [34, 27, 21, 15];

Object.assign(FIG, {
  mang(a) {
    const P = f6parts(a), an = f6flag(a, 'an'), so = f6flag(a, 'so');
    const pts = P[0].split(';').map(s => s.trim().split(/\s+/)).filter(p => p.length === 2 && isFinite(figNum(p[1]))).map(([n, h]) => ({n, h: figNum(h)}));
    if (pts.length < 2 || pts.some(p => p.h < 0)) return '';
    const mocS = f6kv(P, 'moc'), biS = f6kv(P, 'bi');
    let hm = 0, mocTen = 'mặt đất';
    if (mocS) { const q = pts.find(p => p.n === mocS); if (q) { hm = q.h; mocTen = `mặt phẳng ngang qua ${q.n}`; } else if (isFinite(figNum(mocS))) { hm = figNum(mocS); mocTen = `độ cao ${figFmt(hm)} m`; } else return ''; }
    const W = 340, H = 210, x0 = 44, y0 = H - 26, yt = 22, tk = figTicks(Math.max(hm, ...pts.map(p => p.h))), top = tk.step * tk.n, sc = (y0 - yt) / top;
    const Y = h => y0 - h * sc, xs = pts.map((_, i) => x0 + 30 + i * (W - x0 - 58) / (pts.length - 1)), ys = pts.map(p => Y(p.h));
    let g = `<line x1="${x0}" y1="${y0}" x2="${W - 6}" y2="${y0}" class="fg-ax"/>`;
    for (let x = x0 + 4; x < W - 6; x += 9) g += `<line x1="${x}" y1="${y0}" x2="${x - 6}" y2="${y0 + 6}" class="fg-grid"/>`;
    g += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${yt - 8}" class="fg-ax"/><text x="${x0 - 4}" y="${yt - 12}" class="fg-t b" text-anchor="end">h (m)</text>`;
    for (let i = 0; i <= tk.n; i++) { const v = i * tk.step, y = f6r(Y(v)); g += `<line x1="${x0 - 4}" y1="${y}" x2="${x0}" y2="${y}" class="fg-ax"/>` + (an ? '' : `<text x="${x0 - 7}" y="${y + 3.5}" class="fg-t" text-anchor="end">${figFmt(v)}</text>`); }
    if (!an) pts.forEach((p, i) => { if (p.h > 0) g += `<line x1="${x0}" y1="${f6r(ys[i])}" x2="${f6r(xs[i])}" y2="${f6r(ys[i])}" class="fg-grid" stroke-dasharray="2 3"/>`; });
    g += `<path d="${f6mono(xs, ys)}" class="fg6-track"/>`;
    if (mocS) { const y = f6r(Y(hm)); g += `<line x1="${x0}" y1="${y}" x2="${W - 8}" y2="${y}" class="fg6-moc"/><text x="${W - 8}" y="${y - 4}" class="fg-t b fg6-moct" text-anchor="end">mốc thế năng</text>`; }
    else g += `<text x="${W - 8}" y="${y0 + 16}" class="fg-t" text-anchor="end">mặt đất</text>`;
    pts.forEach((p, i) => { const x = f6r(xs[i]), y = f6r(ys[i]);
      g += `<circle cx="${x}" cy="${y}" r="3" class="fg-node"/><text x="${x}" y="${y - (biS === p.n ? 20 : 8)}" class="fg-t b" text-anchor="middle">${esc(p.n)}</text>`;
      if (biS === p.n) g += `<circle cx="${x}" cy="${f6r(y - 8)}" r="7" class="fg-bob"/>`;
      if (so) { const d = p.h - hm; if (Math.abs(d) > 1e-9) { const yM = f6r(Y(hm)), xd = x + 10;
        g += `<line x1="${xd}" y1="${yM}" x2="${xd}" y2="${y}" class="fg-dim"/><line x1="${xd - 3}" y1="${y}" x2="${xd + 3}" y2="${y}" class="fg-dim"/><line x1="${xd - 3}" y1="${yM}" x2="${xd + 3}" y2="${yM}" class="fg-dim"/>`
          + `<text x="${xd + 4}" y="${f6r((y + yM) / 2 + 3)}" class="fg-t">${d > 0 ? '' : 'dưới mốc '}${figFmt(Math.abs(d))} m</text>`; } } });
    const cap = an ? 'Máng trượt (vẽ đúng tỉ lệ độ cao)' : `Độ cao so với mặt đất: ${pts.map(p => `${p.n} ${figFmt(p.h)} m`).join(', ')}${mocS ? `; mốc thế năng: ${mocTen}` : ''} (vẽ đúng tỉ lệ độ cao)`;
    return f6wrap(W, H, g, cap);
  },

  conlac2(a) {
    const P = f6parts(a), an = f6flag(a, 'an'), so = f6flag(a, 'so'), hf = f6flag(a, 'h');
    const g0 = Math.max(10, Math.min(80, figNum(f6kv(P, 'goc')) || 45)), Ms = f6kv(P, 'M'), mA = Ms != null && isFinite(figNum(Ms)) ? Math.max(-g0, Math.min(g0, figNum(Ms))) : null;
    const l = f6kv(P, 'l') != null ? figNum(f6kv(P, 'l')) : null, vat = (f6kv(P, 'vat') || 'A').toUpperCase();
    const W = 330, Lp = 140, ox = 150, oy = 22, H = oy + Lp + 42, pos = t => [f6r(ox + Lp * Math.sin(f6deg(t))), f6r(oy + Lp * Math.cos(f6deg(t)))];
    const V = {A: -g0, O: 0, B: g0}; if (mA != null) V.M = mA;
    const [ax, ay] = pos(-g0), [bx2, by2] = pos(g0), yO = oy + Lp;
    let g = `<line x1="${ox - 50}" y1="${oy}" x2="${ox + 50}" y2="${oy}" class="fg-wire"/>`;
    for (let x = ox - 46; x <= ox + 50; x += 9) g += `<line x1="${x}" y1="${oy}" x2="${x - 6}" y2="${oy - 6}" class="fg-grid"/>`;
    g += `<line x1="${ox}" y1="${oy}" x2="${ox}" y2="${yO + 12}" class="fg-norm"/><path d="M${ax} ${ay} A${Lp} ${Lp} 0 0 0 ${bx2} ${by2}" class="fg-norm" fill="none"/>`;
    g += f6arc(ox, oy, 30, 90, 90 + g0) + `<text x="${f6r(ox - 30 * Math.sin(f6deg(g0 / 2)) - 4)}" y="${f6r(oy + 30 * Math.cos(f6deg(g0 / 2)) + 12)}" class="fg-t" text-anchor="end">${an ? 'α' : g0 + '°'}</text>`;
    Object.entries(V).forEach(([k, t]) => { const [x, y] = pos(t);
      g += k === vat ? `<line x1="${ox}" y1="${oy}" x2="${x}" y2="${y}" class="fg-wire"/><circle cx="${x}" cy="${y}" r="9" class="fg-bob"/>` : `<circle cx="${x}" cy="${y}" r="9" class="fg6-ghost"/>`;
      const dx = t < 0 ? -14 : t > 0 ? 14 : 0; g += `<text x="${x + dx}" y="${y + (t === 0 ? 24 : 4)}" class="fg-t b" text-anchor="middle">${k}</text>`; });
    if (l != null) g += `<text x="${ox + 5}" y="${f6r(oy + Lp * 0.45)}" class="fg-t">ℓ = ${figFmt(l)} m</text>`;
    if (hf) { const xd = bx2 + 26;
      g += `<line x1="${ax}" y1="${ay}" x2="${xd + 4}" y2="${ay}" class="fg-grid" stroke-dasharray="3 3"/><line x1="${ox}" y1="${yO}" x2="${xd + 4}" y2="${yO}" class="fg-grid" stroke-dasharray="3 3"/>`
        + figArrow(xd, (ay + yO) / 2, xd, ay + 1, 'fg-dim') + figArrow(xd, (ay + yO) / 2, xd, yO - 1, 'fg-dim')
        + `<text x="${xd + 5}" y="${f6r((ay + yO) / 2 + 4)}" class="fg-t b">h${so && l != null ? ' = ' + figFmt(f6r(l * (1 - Math.cos(f6deg(g0))), 2)) + ' m' : ''}</text>`; }
    const cap = an ? 'Con lắc đơn dao động giữa A và B, O là vị trí thấp nhất' : `Con lắc đơn thả từ A (dây lệch ${g0}° so với phương thẳng đứng), dao động giữa A và B; O là vị trí thấp nhất`;
    return f6wrap(W, H, g, cap);
  },

  khucxa(a) {
    const P = f6parts(a), an = f6flag(a, 'an'), so = f6flag(a, 'so'), px = f6flag(a, 'px');
    const MT = {kk: ['không khí', 1], nuoc: ['nước', 1.33], thuytinh: ['thuỷ tinh', 1.5]};
    const i = Math.max(0, Math.min(89, figNum(f6kv(P, 'i')) || 0)), mt = (f6kv(P, 'mt') || 'kk nuoc').split(/\s+/);
    const med = s => MT[s] || (isFinite(figNum(s)) ? [`môi trường n = ${figFmt(figNum(s))}`, figNum(s)] : null), m1 = med(mt[0]), m2 = med(mt[1] || 'nuoc');
    if (!m1 || !m2) return '';
    const rS = f6kv(P, 'r'), s = m1[1] * Math.sin(f6deg(i)) / m2[1], tir = rS == null && s > 1;
    const r = rS != null ? figNum(rS) : tir ? null : Math.asin(s) * 180 / Math.PI;
    const W = 320, H = 230, ix = 160, iy = 115, R = 100;
    const shade = (s, n) => s === 'kk' || n <= 1 ? '' : s === 'nuoc' ? 'fg6-mnuoc' : 'fg6-mtt';   // không khí: không tô
    const sh1 = shade(mt[0], m1[1]), sh2 = shade(mt[1] || 'nuoc', m2[1]);
    let g = (sh1 ? `<rect x="0" y="0" width="${W}" height="${iy}" class="${sh1}"/>` : '') + (sh2 ? `<rect x="0" y="${iy}" width="${W}" height="${H - iy}" class="${sh2}"/>` : '') + `<line x1="0" y1="${iy}" x2="${W}" y2="${iy}" class="fg-ax"/>`
      + `<line x1="${ix}" y1="10" x2="${ix}" y2="${H - 10}" class="fg-norm"/><text x="${ix + 4}" y="20" class="fg-t">N</text><text x="${ix + 4}" y="${H - 12}" class="fg-t">N′</text>`
      + `<text x="8" y="${iy - 8}" class="fg-t b">${esc(m1[0])}${so ? ` (n = ${figFmt(m1[1])})` : ''}</text><text x="8" y="${iy + 18}" class="fg-t b">${esc(m2[0])}${so ? ` (n = ${figFmt(m2[1])})` : ''}</text>`;
    const sx = f6r(ix - R * Math.sin(f6deg(i))), sy = f6r(iy - R * Math.cos(f6deg(i)));
    g += figMid(sx, sy, ix, iy) + `<text x="${sx - 8}" y="${sy}" class="fg-t b">S</text><text x="${ix - 12}" y="${iy + 13}" class="fg-t b">I</text>`;
    if (i > 0) g += f6arc(ix, iy, 30, -90 - i, -90) + `<text x="${f6r(ix - 40 * Math.sin(f6deg(i / 2)) - 2)}" y="${f6r(iy - 40 * Math.cos(f6deg(i / 2)) + 3)}" class="fg-t b" text-anchor="middle">${an ? 'i' : 'i = ' + figFmt(i) + '°'}</text>`;
    const refl = (cls) => { const x = f6r(ix + R * Math.sin(f6deg(i))), y = f6r(iy - R * Math.cos(f6deg(i))); return figMid(ix, iy, x, y, cls) + `<text x="${x + 4}" y="${y}" class="fg-t b">R</text>`; };
    if (tir) g += refl('fg-ray');
    else { const kx = f6r(ix + R * Math.sin(f6deg(r))), ky = f6r(iy + R * Math.cos(f6deg(r)));
      g += figMid(ix, iy, kx, ky) + `<text x="${kx + 4}" y="${ky + 4}" class="fg-t b">K</text>`;
      if (r > 0) g += f6arc(ix, iy, 34, 90 - r, 90) + `<text x="${f6r(ix + 46 * Math.sin(f6deg(r / 2)) + 2)}" y="${f6r(iy + 46 * Math.cos(f6deg(r / 2)) + 3)}" class="fg-t b" text-anchor="middle">${so && !an ? 'r ≈ ' + figFmt(Math.round(r)) + '°' : 'r'}</text>`;
      if (px) g += refl('fg-ext'); }
    const cap = an ? 'Đường truyền của tia sáng qua mặt phân cách hai môi trường' : `Tia sáng đi từ ${m1[0]} sang ${m2[0]}, góc tới ${figFmt(i)}°${tir ? ': xảy ra phản xạ toàn phần' : so ? `, góc khúc xạ khoảng ${figFmt(Math.round(r))}°` : ''}`;
    return f6wrap(W, H, g, cap);
  },

  camung(a) {
    const P = f6parts(a), an = f6flag(a, 'an'), cucS = f6flag(a, 'S'), k = ['vao', 'ra', 'yen'].find(t => f6flag(a, t)) || 'vao';
    const W = 330, H = 190;
    const [near, far] = cucS ? ['S', 'N'] : ['N', 'S'];
    let g = `<rect x="22" y="56" width="44" height="24" class="${far === 'N' ? 'fg-n' : 'fg-s'}"/><rect x="66" y="56" width="44" height="24" class="${near === 'N' ? 'fg-n' : 'fg-s'}"/>`
      + `<text x="44" y="73" class="fg-pole" text-anchor="middle">${far}</text><text x="88" y="73" class="fg-pole" text-anchor="middle">${near}</text>`;
    g += k === 'vao' ? figArrow(40, 40, 96, 40) + `<text x="66" y="32" class="fg-t b" text-anchor="middle">lại gần</text>` : k === 'ra' ? figArrow(96, 40, 40, 40) + `<text x="66" y="32" class="fg-t b" text-anchor="middle">ra xa</text>` : `<text x="66" y="40" class="fg-t b" text-anchor="middle">đứng yên</text>`;
    for (let j = 0; j < 7; j++) { const x = 150 + j * 14; g += `<ellipse cx="${x}" cy="68" rx="6" ry="24" class="fg6-coil"/>`; }
    g += `<path d="M150 92 V150 H208 M234 150 H290 V92 H234" class="fg-wire"/><text x="199" y="40" class="fg-t b" text-anchor="middle">cuộn dây</text>`
      + `<circle cx="221" cy="150" r="17" class="fg-meter"/><text x="221" y="178" class="fg-t b" text-anchor="middle">điện kế G</text><circle cx="221" cy="156" r="2" class="fg-node"/>`;
    const tilt = k === 'yen' ? 0 : (k === 'vao') !== cucS ? 32 : -32;
    g += an ? `<text x="221" y="154" class="fg-t b" text-anchor="middle">?</text>` : `<line x1="221" y1="156" x2="${f6r(221 + 13 * Math.sin(f6deg(tilt)))}" y2="${f6r(156 - 13 * Math.cos(f6deg(tilt)))}" class="fg-cur"/>`;
    const cap = an ? 'Nam châm và cuộn dây dẫn kín nối với điện kế' : k === 'yen' ? 'Nam châm đứng yên: số đường sức từ qua tiết diện cuộn dây không đổi, không có dòng điện cảm ứng (kim điện kế chỉ số 0)'
      : `${k === 'vao' ? 'Đưa nam châm lại gần' : 'Kéo nam châm ra xa'} cuộn dây: số đường sức từ qua tiết diện cuộn dây ${k === 'vao' ? 'tăng' : 'giảm'}, xuất hiện dòng điện cảm ứng (kim điện kế lệch)`;
    return f6wrap(W, H, g, cap);
  },

  sodo(a) {
    const P = f6parts(a), vong = f6flag(a, 'vong'), it = P[0].split(/\s*(?:→|->)\s*/).map(s => s.trim()).filter(Boolean);
    if (it.length < 2) return '';
    const wrap = (s, n) => { const w = s.split(/\s+/), L = [''];
      w.forEach(x => { if ((L[L.length - 1] + ' ' + x).trim().length > n && L[L.length - 1]) L.push(x); else L[L.length - 1] = (L[L.length - 1] + ' ' + x).trim(); }); return L; };
    const doc = it.length > 3, bw = doc ? 210 : 96, gap = doc ? 20 : 26, lines = it.map(s => wrap(s, doc ? 32 : 14)), bh = Math.max(30, 14 + 13 * Math.max(...lines.map(l => l.length)));
    const W = doc ? bw + (vong ? 70 : 20) : it.length * bw + (it.length - 1) * gap + 10, H = doc ? it.length * bh + (it.length - 1) * gap + 10 : bh + (vong ? 50 : 10);
    const box = i => doc ? [10, 5 + i * (bh + gap)] : [5 + i * (bw + gap), 5];
    let g = '';
    it.forEach((s, i) => { const [x, y] = box(i), q = s === '?';
      g += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="8" class="${q ? 'fg6-boxq' : 'fg6-box'}"/>`
        + lines[i].map((t, j) => `<text x="${x + bw / 2}" y="${f6r(y + bh / 2 + 4 + (j - (lines[i].length - 1) / 2) * 13)}" class="fg-t b" text-anchor="middle">${figSub(t)}</text>`).join('');
      if (i) { const [px, py] = box(i - 1); g += doc ? figArrow(10 + bw / 2, py + bh + 2, 10 + bw / 2, y - 2) : figArrow(px + bw + 2, y + bh / 2, x - 2, y + bh / 2); } });
    if (vong) { const [lx, ly] = box(it.length - 1), [fx, fy] = box(0);
      g += doc ? `<path d="M${lx + bw} ${ly + bh / 2} H${lx + bw + 30} V${fy + bh / 2}" class="fg-ray"/>` + figArrow(lx + bw + 30, fy + bh / 2, fx + bw + 2, fy + bh / 2)
        : `<path d="M${lx + bw / 2} ${ly + bh} V${ly + bh + 30} H${fx + bw / 2}" class="fg-ray"/>` + figArrow(fx + bw / 2, fy + bh + 30, fx + bw / 2, fy + bh + 2); }
    return f6wrap(W, H, g, 'Sơ đồ: ' + it.join(' → ') + (vong ? ' → (lặp lại)' : ''));
  },

  ctct(a) {
    const P = f6parts(a), an = f6flag(a, 'an'), tg = f6flag(a, 'thugon'), key = P[0].split(/\s+/);
    let m, cap;
    if (key[0] === 'mach') {
      const loai = key[1] || 'thang', n = Math.max(2, Math.min(6, +key[2] || 4));
      m = {a: [], b: []};
      if (loai === 'vong') { const n2 = Math.max(3, n), R = 0.5 / Math.sin(Math.PI / n2) * 1.3;
        for (let i = 0; i < n2; i++) { m.a.push(['C', f6r(R * Math.sin(2 * Math.PI * i / n2), 3), f6r(-R * Math.cos(2 * Math.PI * i / n2), 3)]); m.b.push([i, (i + 1) % n2, 1]); } }
      else { const nc = loai === 'nhanh' ? Math.max(3, n - 1) : n; for (let i = 0; i < nc; i++) { m.a.push(['C', i, 0]); if (i) m.b.push([i - 1, i, 1]); }
        if (loai === 'nhanh') { m.a.push(['C', 1, 1]); m.b.push([1, nc, 1]); } }
      cap = an ? 'Mạch carbon' : `Mạch carbon ${loai === 'vong' ? 'vòng' : loai === 'nhanh' ? 'nhánh' : 'không nhánh'} (chỉ vẽ các nguyên tử C)`;
    } else {
      const d = CTCT[key[0]]; if (!d) return '';
      if (tg) { const cap2 = an ? 'Công thức cấu tạo thu gọn' : `Công thức cấu tạo thu gọn của ${d[0]}`;
        const t = figSub(d[3]).replace(/\)n/, ')<tspan class="fg6-n" dy="4">n</tspan>'), W = 24 + 9.4 * d[3].length;
        return f6wrap(f6r(W), 44, `<text x="${f6r(W / 2)}" y="28" class="fg6-ct" text-anchor="middle">${t}</text>`, cap2); }
      m = d[2](); cap = an ? 'Công thức cấu tạo' : key[0] === 'pe' ? 'Công thức cấu tạo của polyethylene: mắt xích –CH₂–CH₂– lặp lại n lần' : `Công thức cấu tạo của ${d[0]} (${figSub(d[1]).replace(/<[^>]+>/g, '')})`;
    }
    const U = 38, xs = m.a.map(t => t[1]), ys = m.a.map(t => t[2]), mnx = Math.min(...xs), mny = Math.min(...ys);
    const X = x => f6r(22 + (x - mnx) * U), Y = y => f6r(20 + (y - mny) * U), W = X(Math.max(...xs)) + 22, H = Y(Math.max(...ys)) + 20;
    let g = '';
    m.b.forEach(([i, j, o]) => { const [, x1, y1] = m.a[i], [, x2, y2] = m.a[j], dx = X(x2) - X(x1), dy = Y(y2) - Y(y1), L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      const c1 = m.a[i][0] === '*' ? 0 : 10, c2 = m.a[j][0] === '*' ? 0 : 10;
      for (let k = 0; k < o; k++) { const off = (k - (o - 1) / 2) * 5;
        g += `<line x1="${f6r(X(x1) + ux * c1 - uy * off)}" y1="${f6r(Y(y1) + uy * c1 + ux * off)}" x2="${f6r(X(x2) - ux * c2 - uy * off)}" y2="${f6r(Y(y2) - uy * c2 + ux * off)}" class="fg6-bond"/>`; } });
    m.a.forEach(([el, x, y]) => { if (el !== '*') g += `<text x="${X(x)}" y="${Y(y) + 5}" class="fg6-at${el === 'H' ? ' h' : ''}" text-anchor="middle"${CT_MAU[el] ? ` style="fill:${CT_MAU[el]}"` : ''}>${el}</text>`; });
    if (key[0] === 'pe') { const bx1 = X(-0.55), bx2 = X(1.55), t = Y(-1.35), b = Y(1.35);
      g += `<path d="M${bx1 + 5} ${t} H${bx1} V${b} H${bx1 + 5} M${bx2 - 5} ${t} H${bx2} V${b} H${bx2 - 5}" class="fg6-bond" fill="none"/><text x="${bx2 + 4}" y="${b + 2}" class="fg6-at h">n</text>`; }
    return f6wrap(W, H, g, cap);
  },

  thukhi(a) {
    const P = f6parts(a), an = f6flag(a, 'an'), k = ['ngua', 'up', 'nuoc'].find(t => f6flag(a, t)) || 'ngua', khi = f6kv(P, 'khi');
    const W = 300, H = 200;
    let g = `<rect x="8" y="30" width="54" height="30" rx="6" class="fg6-box"/><text x="35" y="49" class="fg-t b" text-anchor="middle">${khi ? figSub(khi) : 'khí'}</text>`;
    if (k === 'nuoc') {   // ống nghiệm ÚP NGƯỢC: đáy tròn ở trên, miệng ngập trong nước; khí dồn lên đáy ống, nước bị đẩy xuống
      g += `<path d="M120 110 V182 H290 V110" class="fg-cup" fill="none"/><rect x="121" y="126" width="168" height="55" class="fg6-water"/>`
        + `<rect x="197" y="${an ? 88 : 112}" width="26" height="${an ? 82 : 58}" class="fg6-water"/><path d="M196 170 V84 A14 14 0 0 1 224 84 V170" class="fg-cup" fill="none"/>`
        + `<path d="M62 45 H150 V176 H210 V160" class="fg6-tube"/>`;
      for (let j = 0; j < 3; j++) g += `<circle cx="${209 + (j % 2) * 4}" cy="${150 - j * 13}" r="3" class="fg6-bub"/>`;
      g += `<text x="232" y="80" class="fg-t">ống nghiệm úp ngược</text><text x="205" y="197" class="fg-t" text-anchor="middle">chậu nước</text>`;
    } else if (k === 'ngua') {
      g += `<path d="M190 70 V170 H250 V70" class="fg-cup" fill="none"/><path d="M62 45 H220 V160" class="fg6-tube"/>`
        + figArrow(228, 150, 228, 100, 'fg-ext') + `<text x="258" y="120" class="fg-t">bình ngửa</text>`;
    } else {
      g += `<path d="M190 175 V75 H250 V175" class="fg-cup" fill="none"/><path d="M62 45 H130 V190 H220 V88" class="fg6-tube"/>`
        + figArrow(228, 100, 228, 150, 'fg-ext') + `<text x="258" y="120" class="fg-t">bình úp</text>`;
    }
    const cap = an ? 'Dụng cụ thu khí' : k === 'nuoc' ? 'Thu khí bằng cách đẩy nước (khí ít tan trong nước): khí đẩy nước ra khỏi ống nghiệm úp ngược'
      : k === 'ngua' ? 'Thu khí bằng cách đẩy không khí, bình để ngửa: dùng cho khí nặng hơn không khí (ống dẫn khí sát đáy bình)'
      : 'Thu khí bằng cách đẩy không khí, bình để úp: dùng cho khí nhẹ hơn không khí (ống dẫn khí sát đáy bình úp)';
    return f6wrap(W, H, g, cap);
  },

  nst(a) {
    const P = f6parts(a), an = f6flag(a, 'an'), n2 = +(f6kv(P, '2n') || 4);
    if (!(n2 >= 2 && n2 <= 8 && n2 % 2 === 0)) return '';
    const n = n2 / 2, xy = f6flag(a, 'xy'), xx = f6flag(a, 'xx'), gt = xy || xx;
    const ph = ['np', 'gp1', 'gp2'].find(t => f6flag(a, t)), ki = ['dau', 'giua', 'sau', 'cuoi'].find(t => f6flag(a, t)) || 'giua';
    const mode = f6flag(a, 'bo') ? 'bo' : f6flag(a, 'giaotu') ? 'giaotu' : ph || 'np';
    // Một chiếc NST: cặp p (0…n−1), bo = true nếu từ bố; kép = 2 crômatit
    const K = n2 <= 4 ? 1.45 : n2 <= 6 ? 1.2 : 1, len = (p, bo) => Math.round(K * (gt && p === n - 1 ? (xy && bo ? 13 : 30) : NST_DAI[p]));   // phóng to khi ít NST
    const one = (p, bo, kep, x, y) => { const L = len(p, bo), c = bo ? NST_DAM[p] : NST_NHAT[p], r = (yy) => `<rect x="${f6r(x - L / 2)}" y="${f6r(yy - 3.2)}" width="${L}" height="6.4" rx="3.2" fill="${c}" class="fg6-cr"/>`;
      return (kep ? r(y - 3.6) + r(y + 3.6) : r(y)) + `<circle cx="${x}" cy="${y}" r="${kep ? 3.8 : 3}" fill="${c}" class="fg6-cen"/>` + (gt && p === n - 1 ? `<text x="${f6r(x + L / 2 + 5)}" y="${y + 3}" class="fg-t b" font-size="9">${xy && bo ? 'Y' : 'X'}</text>` : ''); };
    const row = (list, cx, y, gap = 8) => { const ws = list.map(([p, bo]) => len(p, bo) + (gt && p === n - 1 ? 10 : 0)), tot = ws.reduce((s, w) => s + w, 0) + gap * (list.length - 1);
      let x = cx - tot / 2, s = ''; list.forEach(([p, bo, kep], i) => { s += one(p, bo, kep, f6r(x + ws[i] / 2 - (gt && p === n - 1 ? 5 : 0)), y); x += ws[i] + gap; }); return [s, tot]; };
    // Xếp NST vào tế bào nhỏ: tự xuống hàng để không tràn ra ngoài màng tế bào (dùng ở kì cuối, giao tử)
    const fit = (list, cx, cy, maxW, gap = 5) => { const R = [[]]; let w = 0;
      list.forEach(it => { const d = len(it[0], it[1]) + (gt && it[0] === n - 1 ? 10 : 0); if (R[R.length - 1].length && w + gap + d > maxW) { R.push([]); w = 0; } w += (R[R.length - 1].length ? gap : 0) + d; R[R.length - 1].push(it); });
      const dy = list.some(it => it[2]) ? 18 : 13; return R.map((L, i) => row(L, cx, f6r(cy + (i - (R.length - 1) / 2) * dy), gap)[0]).join(''); };
    const all = kep => { const L = []; for (let p = 0; p < n; p++) { L.push([p, true, kep]); L.push([p, false, kep]); } return L; };
    const cell = (cx, cy, rx, ry, inner, spindle = []) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="fg6-cell"/>`
      + spindle.map(([x, y, py]) => `<line x1="${cx}" y1="${py}" x2="${x}" y2="${y}" class="fg6-spin"/>`).join('') + inner;
    const cenX = (list, cx, gap = 8) => { const ws = list.map(([p, bo]) => len(p, bo) + (gt && p === n - 1 ? 10 : 0)), tot = ws.reduce((s, w) => s + w, 0) + gap * (list.length - 1); let x = cx - tot / 2; return ws.map(w => { const c = x + w / 2; x += w + gap; return c; }); };
    // Phân li độc lập ở kì sau I: cực trên nhận chiếc từ bố ở cặp chẵn, chiếc từ mẹ ở cặp lẻ
    const top1 = kep => { const L = []; for (let p = 0; p < n; p++) L.push([p, p % 2 === 0, kep]); return L; }, bot1 = kep => top1(kep).map(([p, bo, k]) => [p, !bo, k]);
    let W = 330, H = 170, g = '', ten = '', mo = '';
    const TEN = {np: 'nguyên phân', gp1: 'giảm phân I', gp2: 'giảm phân II'}, KI = {dau: 'Kì đầu', giua: 'Kì giữa', sau: 'Kì sau', cuoi: 'Kì cuối'};
    if (mode === 'bo' || mode === 'giaotu') {
      const kep = f6flag(a, 'kep'), L = mode === 'bo' ? all(kep).map(([p, bo, k]) => [p, bo, k]) : top1(kep);
      let x = 18, s = ''; const pairs = mode === 'bo' ? n : 0;
      if (mode === 'bo') { for (let p = 0; p < n; p++) { const w = Math.max(len(p, true), len(p, false)) + (gt && p === n - 1 ? 12 : 0);
          s += one(p, true, kep, f6r(x + w / 2), 60) + one(p, false, kep, f6r(x + w / 2), 82) + `<text x="${f6r(x + w / 2)}" y="112" class="fg-t" text-anchor="middle">cặp ${p + 1}</text>`; x += w + 18; }
        W = Math.max(200, x + 6); H = 150; g = s + `<text x="${W / 2}" y="138" class="fg-t" text-anchor="middle">đậm: chiếc từ bố · nhạt: chiếc từ mẹ</text>`;
        ten = `Bộ NST lưỡng bội 2n = ${n2} (${n} cặp NST tương đồng)`; }
      else { const s2 = fit(L, 110, 70, 150); g = cell(110, 70, 90, 42, s2); W = 220; H = 130; ten = `Giao tử: bộ NST đơn bội n = ${n}`; }
      return f6wrap(W, H, g, an ? 'Bộ nhiễm sắc thể' : ten);
    }
    const kepPh = !(mode === 'np' && ki === 'cuoi') && !(mode === 'gp2' && (ki === 'sau' || ki === 'cuoi'));
    if (mode === 'np' || mode === 'gp1') {
      if (ki === 'dau') { const L = mode === 'np' ? all(true) : null; let s = '';
        if (mode === 'np') { const pos = [[-70, -20], [-20, -28], [34, -22], [76, -6], [-64, 18], [-10, 22], [40, 26], [80, 20]];
          L.forEach(([p, bo], i) => { s += one(p, bo, true, 160 + pos[i][0], 85 + pos[i][1]); }); }
        else { const pos = [[-60, -18], [20, -22], [-40, 20], [50, 18]]; for (let p = 0; p < n; p++) { s += one(p, true, true, 160 + pos[p][0], 76 + pos[p][1]) + one(p, false, true, 160 + pos[p][0], 92 + pos[p][1]); } }
        g = `<ellipse cx="160" cy="85" rx="140" ry="68" class="fg6-cell"/><ellipse cx="160" cy="85" rx="118" ry="54" class="fg6-nuc"/>` + s;
        mo = mode === 'np' ? 'các NST kép bắt đầu đóng xoắn, co ngắn; thoi phân bào dần hình thành' : 'các NST kép bắt đầu co xoắn; các NST kép trong từng cặp tương đồng tiếp hợp với nhau'; }
      if (ki === 'giua') { const cy = 85;
        if (mode === 'np') { const L = all(true), [s] = row(L, 160, cy), xs = cenX(L, 160);
          g = cell(160, cy, 150, 66, s, xs.flatMap(x => [[x, cy - 6, 22], [x, cy + 6, 148]])); mo = `${n2} NST kép xếp thành một hàng trên mặt phẳng xích đạo của thoi phân bào`; }
        else { const T = [], B = []; for (let p = 0; p < n; p++) { T.push([p, p % 2 === 0, true]); B.push([p, p % 2 !== 0, true]); }
          const [s1] = row(T, 160, cy - 10, 14), [s2] = row(B, 160, cy + 10, 14), xs = cenX(T, 160, 14);
          g = cell(160, cy, 150, 66, s1 + s2, xs.flatMap(x => [[x, cy - 16, 22], [x, cy + 16, 148]])); mo = `${n} cặp NST kép tương đồng xếp thành hai hàng trên mặt phẳng xích đạo của thoi phân bào`; }
        g += `<line x1="18" y1="${cy}" x2="302" y2="${cy}" class="fg6-eq"/>`; }
      if (ki === 'sau') { const cy = 85;
        const T = mode === 'np' ? all(false) : top1(true), B = mode === 'np' ? all(false) : bot1(true);
        const [s1] = row(T, 160, 50), [s2] = row(B, 160, 120), x1 = cenX(T, 160), x2 = cenX(B, 160);
        g = cell(160, cy, 150, 72, s1 + s2, [...x1.map(x => [x, 54, 14]), ...x2.map(x => [x, 116, 156])]);
        mo = mode === 'np' ? `mỗi NST kép tách thành 2 NST đơn, phân li về hai cực (mỗi cực ${n2} NST đơn)` : `mỗi NST kép trong cặp tương đồng phân li về một cực (mỗi cực ${n} NST kép)`; }
      if (ki === 'cuoi') { const L1 = mode === 'np' ? all(false) : top1(true), L2 = mode === 'np' ? all(false) : bot1(true), s1 = fit(L1, 82, 80, 128), s2 = fit(L2, 248, 80, 128);
        g = cell(82, 80, 76, 50, s1) + cell(248, 80, 76, 50, s2); H = 150;
        mo = mode === 'np' ? `tạo 2 tế bào con, mỗi tế bào có ${n2} NST đơn (giống tế bào mẹ)` : `tạo 2 tế bào con, mỗi tế bào có ${n} NST kép`; }
    } else {   // giảm phân II: hai tế bào (từ giảm phân I) phân chia đồng thời
      const cells = [top1(true), bot1(true)];
      if (ki === 'dau' || ki === 'giua') { cells.forEach((L, c) => { const cx = 82 + c * 166, [s] = row(L, cx, 80, 6), xs = cenX(L, cx, 6);
          g += cell(cx, 80, 76, 56, s, ki === 'giua' ? xs.flatMap(x => [[x, 74, 26], [x, 86, 134]]) : []) + (ki === 'giua' ? `<line x1="${cx - 70}" y1="80" x2="${cx + 70}" y2="80" class="fg6-eq"/>` : ''); });
        H = 160; mo = ki === 'giua' ? `ở mỗi tế bào, ${n} NST kép xếp thành một hàng trên mặt phẳng xích đạo` : `ở mỗi tế bào có ${n} NST kép, thoi phân bào hình thành`; }
      if (ki === 'sau') { cells.forEach((L, c) => { const cx = 82 + c * 166, D = L.map(([p, bo]) => [p, bo, false]), [s1] = row(D, cx, 44, 5), [s2] = row(D, cx, 116, 5), xa = cenX(D, cx, 5);
          g += cell(cx, 80, 76, 62, s1 + s2, [...xa.map(x => [x, 48, 20]), ...xa.map(x => [x, 112, 140])]); });
        H = 165; mo = `ở mỗi tế bào, mỗi NST kép tách thành 2 NST đơn, phân li về hai cực (mỗi cực ${n} NST đơn)`; }
      if (ki === 'cuoi') { const out = [top1(false), top1(false), bot1(false), bot1(false)];
        out.forEach((L, c) => { const cx = 42 + c * 82, s = fit(L, cx, 60, 64, 3); g += cell(cx, 60, 38, 34, s); });
        W = 330; H = 110; mo = `từ 1 tế bào mẹ (2n = ${n2}) tạo 4 tế bào con, mỗi tế bào có ${n} NST đơn`; }
    }
    ten = `${KI[ki]} ${TEN[mode]}`;
    return f6wrap(W, H, g, an ? `Tế bào đang phân chia (2n = ${n2})` : `${ten} (2n = ${n2}): ${mo}`);
  },

  phahe(a) {
    const P = f6parts(a), gens = P[0].split('/').map(s => s.trim().split(/\s+/).filter(Boolean));
    if (!gens.length || gens.some(G => !G.length || G.some(t => !/^[mMfF]\??$/.test(t)))) return '';
    const RO = ['I', 'II', 'III', 'IV'], W = Math.max(260, 60 + 50 * Math.max(...gens.map(G => G.length))), H = 40 + 66 * gens.length + 24;
    const pos = gens.map((G, gi) => G.map((_, i) => [f6r(52 + (W - 70) * (i + 0.5) / G.length), 30 + 66 * gi]));
    const id = s => { const m = /^(I{1,3}|IV)(\d+)$/.exec(s.trim()); if (!m) return null; const gi = RO.indexOf(m[1]), i = +m[2] - 1; return gens[gi] && gens[gi][i] ? [gi, i] : null; };
    let g = '';
    for (const fam of P.slice(1).filter(s => s.includes(':'))) {
      const [cp, ch] = fam.split(':'), [p1, p2] = cp.split('-').map(id), kids = ch.trim().split(/\s+/).map(id);
      if (!p1 || !p2 || p1[0] !== p2[0] || Math.abs(p1[1] - p2[1]) !== 1 || kids.some(k => !k || k[0] !== p1[0] + 1)) return '';
      const ki = kids.map(k => k[1]).sort((x, y) => x - y); if (ki.some((v, j) => j && v !== ki[j - 1] + 1)) return '';
      const [xa, y] = pos[p1[0]][Math.min(p1[1], p2[1])], [xb] = pos[p1[0]][Math.max(p1[1], p2[1])], mx = (xa + xb) / 2, yb = y + 33;
      const kx = kids.map(k => pos[k[0]][k[1]][0]), yk = pos[kids[0][0]][0][1];
      g += `<line x1="${xa + 10}" y1="${y}" x2="${xb - 10}" y2="${y}" class="fg-wire"/><line x1="${mx}" y1="${y}" x2="${mx}" y2="${yb}" class="fg-wire"/>`
        + `<line x1="${Math.min(mx, ...kx)}" y1="${yb}" x2="${Math.max(mx, ...kx)}" y2="${yb}" class="fg-wire"/>` + kx.map(x => `<line x1="${x}" y1="${yb}" x2="${x}" y2="${yk - 10}" class="fg-wire"/>`).join('');
    }
    gens.forEach((G, gi) => { g += `<text x="10" y="${30 + 66 * gi + 4}" class="fg-t b">${RO[gi]}</text>`;
      G.forEach((t, i) => { const [x, y] = pos[gi][i], hoi = t.endsWith('?'), benh = !hoi && t[0] === t[0].toUpperCase(), nam = t[0].toLowerCase() === 'm', cls = benh ? 'fg6-ph1' : 'fg6-ph0';   // ? = chưa biết: để trắng, ghi dấu ?
        g += (nam ? `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" class="${cls}"/>` : `<circle cx="${x}" cy="${y}" r="10.5" class="${cls}"/>`)
          + (t.endsWith('?') ? `<text x="${x}" y="${y + 4}" class="fg-t b" text-anchor="middle">?</text>` : '') + `<text x="${x}" y="${y + 23}" class="fg-t" text-anchor="middle">${i + 1}</text>`; }); });
    const ly = H - 12;
    g += `<rect x="12" y="${ly - 9}" width="10" height="10" class="fg6-ph0"/><text x="26" y="${ly}" class="fg-t">nam</text><circle cx="66" cy="${ly - 4}" r="5.5" class="fg6-ph0"/><text x="75" y="${ly}" class="fg-t">nữ</text>`
      + `<rect x="104" y="${ly - 9}" width="10" height="10" class="fg6-ph1"/><circle cx="124" cy="${ly - 4}" r="5.5" class="fg6-ph1"/><text x="134" y="${ly}" class="fg-t">bị bệnh</text>`;
    return f6wrap(W, H, g, 'Sơ đồ phả hệ');
  },
});

;

/* fig7.js */
/* HÌNH VẼ BẰNG MÃ (đợt 7) — vẽ theo số liệu, có cờ an (không ghi gì làm lộ đáp án). Tự kiểm: scratchpad/test_fig7.js
   [docao:Quyển sách 1,5; Chậu hoa 3 | moc 1 | an]  các vật ở độ cao (m) so với MẶT ĐẤT, vẽ đúng tỉ lệ, trục h (m).
                          moc = độ cao mốc thế năng (m) hoặc tên vật; an = bỏ số trên trục (độ cao cho trong đề).
   [hainc:NS SN]          hai thanh nam châm đặt đối diện nhau (cực trái→phải của từng thanh; ? = chưa biết cực).
                          Hình KHÔNG ghi hút/đẩy.
   [machhh:nt-ss | D | A]  mạch hỗn hợp: nt-ss = (1) nối tiếp với cụm (2) // (3); ss-nt = nhánh (1) nt (2) song song với nhánh (3).
                          R = điện trở R1 R2 R3 (mặc định), D = đèn Đ1 Đ2 Đ3; A = ampe kế ở mạch chính.
   [oersted:bat | an]     dây dẫn thẳng đặt song song phía trên kim la bàn, nối pin qua khoá K. tat = khoá mở, bat = khoá đóng.
                          an = không vẽ kim (hỏi kim có lệch không).
   [bangkep:dong sat | nong | an]  băng kép hai kim loại (trên, dưới), một đầu kẹp chặt: nong = hơ nóng, lanh = làm lạnh.
                          Độ nở: nhôm > đồng > sắt. Khi nóng băng cong về phía kim loại nở ÍT hơn; khi lạnh cong về phía kim loại co NHIỀU hơn. an = vẽ băng thẳng, ghi ?.
   [chumsang:ss | an]     chùm sáng song song (ss) / hội tụ (hoitu) / phân kì (phanki). an = không ghi tên loại chùm.
   [lienket:ion Na Cl | sau | an]  sơ đồ liên kết ion (cặp có sẵn: Na–Cl, K–Cl, Na–F, Li–F, K–F, Mg–O, Ca–O, Mg–S, Ca–S, Li–Cl);
                          truoc = chưa chuyển e (mặc định), sau = đã chuyển e, ghi điện tích ion. an = không ghi số e lớp ngoài.
   [lienket:cht H2O | an]  sơ đồ góp chung electron: H2, Cl2, O2, N2, HCl, H2O, NH3, CH4, CO2. an = không ghi số e lớp ngoài.
   [caysusong:(Cá,(Lưỡng cư,(Thú,Chim)))]  cây sự sống (sơ đồ quan hệ họ hàng) theo cấu trúc ngoặc lồng nhau: hai nhóm trong
                          cùng một ngoặc có tổ tiên chung gần nhất. Chỉ vẽ cấu trúc nhánh (không ghi thời gian cụ thể). Tên "?" = nhóm cần xác định.
   Áp suất 2 điểm: [apsuat:2 3 10000 N 1 an] (fig4.js) = thêm điểm N ở độ sâu 1 m. */

Object.assign(FIG, {
  docao(a) {
    const P = f6parts(a), an = f6flag(a, 'an');
    const it = P[0].split(';').map(s => s.trim()).filter(Boolean).map(s => { const m = s.match(/^(.*\S)\s+([\d.,]+)$/); return m ? {n: m[1], h: figNum(m[2])} : null; });
    if (!it.length || it.some(x => !x || !(x.h >= 0))) return '';
    const mocS = f6kv(P, 'moc'); let hm = null;
    if (mocS != null) { const q = it.find(x => x.n === mocS); hm = q ? q.h : isFinite(figNum(mocS)) ? figNum(mocS) : null; if (hm == null) return ''; }
    const W = Math.max(260, 70 + it.length * 90), H = 220, x0 = 46, y0 = H - 28, yt = 26, tk = figTicks(Math.max(hm || 0, ...it.map(x => x.h))), sc = (y0 - yt) / (tk.step * tk.n), Y = h => f6r(y0 - h * sc);
    let g = `<line x1="${x0}" y1="${y0}" x2="${W - 6}" y2="${y0}" class="fg-ax"/>`;
    for (let x = x0 + 4; x < W - 6; x += 9) g += `<line x1="${x}" y1="${y0}" x2="${x - 6}" y2="${y0 + 6}" class="fg-grid"/>`;
    g += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${yt - 8}" class="fg-ax"/><text x="${x0 - 4}" y="${yt - 12}" class="fg-t b" text-anchor="end">h (m)</text><text x="${W - 8}" y="${y0 + 18}" class="fg-t" text-anchor="end">mặt đất</text>`;
    for (let i = 0; i <= tk.n; i++) { const v = i * tk.step, y = Y(v); g += `<line x1="${x0 - 4}" y1="${y}" x2="${x0}" y2="${y}" class="fg-ax"/>` + (an ? '' : `<text x="${x0 - 7}" y="${y + 3.5}" class="fg-t" text-anchor="end">${figFmt(v)}</text>`); }
    if (hm != null) { const y = Y(hm); g += `<line x1="${x0}" y1="${y}" x2="${W - 8}" y2="${y}" class="fg6-moc"/><text x="${x0 + 4}" y="${y + 12}" class="fg-t b fg6-moct">mốc thế năng</text>`; }
    it.forEach((o, i) => { const x = x0 + 60 + i * 90, y = Y(o.h);
      g += `<line x1="${x0}" y1="${y}" x2="${x - 14}" y2="${y}" class="fg-grid" stroke-dasharray="2 3"/><line x1="${x}" y1="${y + 6}" x2="${x}" y2="${y0}" class="fg-dim" stroke-dasharray="3 3"/>`
        + `<rect x="${x - 13}" y="${y - 6}" width="26" height="12" rx="3" class="fg-obj2"/><circle cx="${x}" cy="${y}" r="2.2" class="fg-node"/>`
        + `<text x="${x}" y="${y - 11}" class="fg-t b" text-anchor="middle">${esc(o.n)}</text>`; });
    const cap = an ? 'Các vật ở những độ cao khác nhau (vẽ đúng tỉ lệ độ cao)' : `Độ cao so với mặt đất: ${it.map(o => `${o.n} ${figFmt(o.h)} m`).join(', ')} (vẽ đúng tỉ lệ)`;
    return f6wrap(W, H, g, cap);
  },

  hainc(a) {
    const t = f6parts(a)[0].split(/\s+/).filter(Boolean);
    if (t.length !== 2 || t.some(s => !/^[NS?]{2}$/.test(s) || (s[0] !== '?' && s[0] === s[1]))) return '';
    const W = 320, H = 90, cls = c => c === 'N' ? 'fg-n' : c === 'S' ? 'fg-s' : 'fg-q';
    let g = '';
    t.forEach((s, k) => { const x = k ? 186 : 18; [0, 1].forEach(j => { g += `<rect x="${x + j * 58}" y="30" width="58" height="28" class="${cls(s[j])}"/><text x="${x + j * 58 + 29}" y="50" class="fg-pole" text-anchor="middle">${s[j]}</text>`; }); });
    g += `<text x="160" y="80" class="fg-t" text-anchor="middle">hai thanh nam châm đặt đối diện, cùng trên một đường thẳng</text>`;
    return f6wrap(W, H, g, 'Hai thanh nam châm đặt đối diện nhau');
  },

  machhh(a) {
    const P = f6parts(a), k = P[0].split(/\s+/)[0], den = f6flag(a, 'D'), am = f6flag(a, 'A');
    if (!['nt-ss', 'ss-nt'].includes(k)) return '';
    const W = 330, H = 190, yT = 60, yB = 165, xL = 30, xR = 300, lab = i => den ? `Đ${i}` : `R${i}`;
    const el = (x, y, i) => den ? `<circle cx="${x}" cy="${y}" r="11" class="fg-lamp"/><path d="M${x - 7.8} ${y - 7.8} L${x + 7.8} ${y + 7.8} M${x + 7.8} ${y - 7.8} L${x - 7.8} ${y + 7.8}" class="fg-wire"/><text x="${x}" y="${y - 16}" class="fg-t b" text-anchor="middle">${lab(i)}</text>`
      : `<rect x="${x - 18}" y="${y - 7}" width="36" height="14" class="fg-res"/><text x="${x}" y="${y - 12}" class="fg-t b" text-anchor="middle">${lab(i)}</text>`;
    const hw = den ? 11 : 18, wire = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="fg-wire"/>`;
    let g = '';
    // Nguồn ở cạnh trái (cực dương là vạch dài), dây dưới về nguồn, ampe kế (nếu có) ở dây dưới
    g += wire(xL, yT, xL, 102) + wire(xL, 118, xL, yB) + `<line x1="${xL - 12}" y1="102" x2="${xL + 12}" y2="102" class="fg-bat"/><line x1="${xL - 6}" y1="118" x2="${xL + 6}" y2="118" class="fg-bat s"/><text x="${xL + 16}" y="104" class="fg-t b">+</text><text x="${xL + 16}" y="122" class="fg-t b">−</text>`;
    g += am ? wire(xL, yB, 150, yB) + `<circle cx="165" cy="${yB}" r="13" class="fg-meter"/><text x="165" y="${yB + 4}" class="fg-t b" text-anchor="middle">A</text>` + wire(178, yB, xR, yB) : wire(xL, yB, xR, yB);
    g += wire(xR, yB, xR, yT);
    if (k === 'nt-ss') {   // (1) nối tiếp với cụm (2) // (3)
      const y1 = yT - 32, y2 = yT + 32, bx0 = 160, bx1 = 280, xm = (bx0 + bx1) / 2;
      g += wire(xL, yT, 80 - hw, yT) + el(80, yT, 1) + wire(80 + hw, yT, bx0, yT) + wire(bx1, yT, xR, yT)
        + wire(bx0, y1, bx0, y2) + wire(bx1, y1, bx1, y2) + wire(bx0, y1, xm - hw, y1) + el(xm, y1, 2) + wire(xm + hw, y1, bx1, y1)
        + wire(bx0, y2, xm - hw, y2) + el(xm, y2, 3) + wire(xm + hw, y2, bx1, y2) + `<circle cx="${bx0}" cy="${yT}" r="3" class="fg-node"/><circle cx="${bx1}" cy="${yT}" r="3" class="fg-node"/>`;
    } else {               // nhánh (1) nt (2) song song với nhánh (3)
      const y1 = yT - 32, y2 = yT + 32, bx0 = 80, bx1 = 270;
      g += wire(xL, yT, bx0, yT) + wire(bx1, yT, xR, yT) + wire(bx0, y1, bx0, y2) + wire(bx1, y1, bx1, y2)
        + wire(bx0, y1, 130 - hw, y1) + el(130, y1, 1) + wire(130 + hw, y1, 220 - hw, y1) + el(220, y1, 2) + wire(220 + hw, y1, bx1, y1)
        + wire(bx0, y2, 175 - hw, y2) + el(175, y2, 3) + wire(175 + hw, y2, bx1, y2) + `<circle cx="${bx0}" cy="${yT}" r="3" class="fg-node"/><circle cx="${bx1}" cy="${yT}" r="3" class="fg-node"/>`;
    }
    const cap = k === 'nt-ss' ? `Mạch hỗn hợp: ${lab(1)} nối tiếp với cụm (${lab(2)} // ${lab(3)})` : `Mạch hỗn hợp: (${lab(1)} nối tiếp ${lab(2)}) // ${lab(3)}`;
    return f6wrap(W, H, g, cap + (am ? '; ampe kế A ở mạch chính' : ''));
  },

  oersted(a) {
    const an = f6flag(a, 'an'), bat = f6flag(a, 'bat'), W = 300, H = 170;
    let g = `<line x1="40" y1="50" x2="260" y2="50" class="fg-wire" stroke-width="3"/><text x="150" y="40" class="fg-t b" text-anchor="middle">dây dẫn thẳng</text>`
      + `<path d="M40 50 V140 H110 M150 140 H260 V50" class="fg-wire"/><line x1="120" y1="128" x2="120" y2="152" class="fg-bat"/><line x1="128" y1="134" x2="128" y2="146" class="fg-bat s"/>`
      + `<text x="124" y="164" class="fg-t" text-anchor="middle">pin</text><circle cx="150" cy="140" r="2.5" class="fg-node"/><circle cx="180" cy="140" r="2.5" class="fg-node"/>`
      + (bat ? `<line x1="150" y1="140" x2="180" y2="140" class="fg-wire"/>` : `<line x1="150" y1="140" x2="175" y2="126" class="fg-wire"/>`) + `<text x="165" y="124" class="fg-t b" text-anchor="middle">K</text>`
      + `<circle cx="150" cy="92" r="22" class="fg-comp"/>`;
    // Kim la bàn: chưa có dòng điện thì nằm dọc theo dây (hướng Bắc – Nam); có dòng điện thì lệch khỏi hướng đó
    if (an) g += `<text x="150" y="97" class="fg-t b" text-anchor="middle">?</text>`;
    else { const t = bat ? 60 : 0, dx = 18 * Math.cos(f6deg(t)), dy = 18 * Math.sin(f6deg(t));
      g += `<path d="M${f6r(150 + dx)} ${f6r(92 + dy)} L${f6r(150 - 4 * Math.sin(f6deg(t)))} ${f6r(92 + 4 * Math.cos(f6deg(t)))} L${f6r(150 - dx)} ${f6r(92 - dy)} Z" class="fg-ks"/>`
        + `<path d="M${f6r(150 + dx)} ${f6r(92 + dy)} L${f6r(150 + 4 * Math.sin(f6deg(t)))} ${f6r(92 - 4 * Math.cos(f6deg(t)))} L${f6r(150 - dx)} ${f6r(92 - dy)} Z" class="fg-kn"/>`; }
    const cap = an ? `Dây dẫn đặt song song phía trên kim la bàn; khoá K ${bat ? 'đóng' : 'mở'}` : bat ? 'Khoá K đóng, có dòng điện chạy trong dây: kim la bàn bị lệch khỏi hướng ban đầu' : 'Khoá K mở, không có dòng điện: kim la bàn nằm dọc theo dây dẫn (hướng Bắc – Nam)';
    return f6wrap(W, H, g, cap);
  },

  bangkep(a) {
    const P = f6parts(a), kl = P[0].split(/\s+/), an = f6flag(a, 'an'), nong = f6flag(a, 'nong'), lanh = f6flag(a, 'lanh');
    const NO = {nhom: [3, 'nhôm'], dong: [2, 'đồng'], sat: [1, 'sắt']}, T = NO[kl[0]], D = NO[kl[1]];
    if (!T || !D || T === D) return '';
    // Nóng: kim loại nở nhiều hơn dài hơn → nằm phía ngoài (lồi) → băng cong về phía kim loại nở ít. Lạnh: ngược lại.
    const bien = (nong || lanh) && !an, dau = (T[0] > D[0] ? 1 : -1) * (lanh ? -1 : 1), W = 300, H = 170, L = 200, R = 420;   // bán kính cong lớn: cong vừa đủ thấy, không tràn khung
    const path = off => { if (!bien) return `M50 ${80 + off} H${50 + L}`; const th = L / R, cy = 80 + dau * R, sy = 80 + off, rr = R - dau * off;
      const ex = 50 + rr * Math.sin(th), ey = cy - dau * rr * Math.cos(th); return `M50 ${sy} A${rr} ${rr} 0 0 ${dau > 0 ? 1 : 0} ${f6r(ex)} ${f6r(ey)}`; };
    let g = `<rect x="30" y="62" width="20" height="36" class="fg-block"/><path d="${path(-4)}" fill="none" stroke="#B87333" stroke-width="7"/><path d="${path(4)}" fill="none" stroke="#8D9BAE" stroke-width="7"/>`
      + `<text x="60" y="62" class="fg-t b">${T[1]} (trên)</text><text x="60" y="110" class="fg-t b">${D[1]} (dưới)</text>`;
    if (nong) g += `<path d="M150 158 Q140 142 150 128 Q160 142 150 158 Z" fill="#F29B38"/><text x="170" y="152" class="fg-t">hơ nóng</text>`;
    if (lanh) g += `<text x="150" y="152" class="fg-t" text-anchor="middle">làm lạnh</text>`;
    if (an) g += `<text x="${50 + L + 12}" y="84" class="fg-t b">?</text>`;
    const cap = !bien ? `Băng kép ${T[1]} – ${D[1]}, một đầu kẹp chặt${nong ? ', hơ nóng' : lanh ? ', làm lạnh' : ''}` : `Khi ${nong ? 'hơ nóng' : 'làm lạnh'}, băng kép cong về phía ${dau > 0 ? D[1] : T[1]} (${nong ? 'kim loại nở ít hơn' : 'kim loại co nhiều hơn'})`;
    return f6wrap(W, H, g, cap);
  },

  chumsang(a) {
    const an = f6flag(a, 'an'), k = ['ss', 'hoitu', 'phanki'].find(t => f6flag(a, t)) || 'ss', W = 280, H = 130;
    let g = '';
    [-36, 0, 36].forEach(d => {
      if (k === 'ss') g += figMid(30, 65 + d, 250, 65 + d);
      if (k === 'hoitu') g += figMid(30, 65 + d, 230, 65);
      if (k === 'phanki') g += figMid(50, 65, 250, 65 + d * 1.4);
    });
    if (k === 'hoitu') g += `<circle cx="230" cy="65" r="3" class="fg-node"/>`;
    if (k === 'phanki') g += `<circle cx="50" cy="65" r="3" class="fg-node"/>`;
    const ten = {ss: 'Chùm sáng song song: các tia sáng không giao nhau', hoitu: 'Chùm sáng hội tụ: các tia sáng giao nhau tại một điểm', phanki: 'Chùm sáng phân kì: các tia sáng loe rộng ra'}[k];
    return f6wrap(W, H, g, an ? 'Một chùm sáng gồm ba tia' : ten);
  },

  lienket(a) {
    if (typeof ionSvg !== 'function' || typeof covSvg !== 'function') return '';
    const P = f6parts(a), t = P[0].split(/\s+/), an = f6flag(a, 'an');
    let svg = '', cap = '';
    if (t[0] === 'ion') {
      const pr = ION_PAIRS.find(([x, y]) => x === t[1] && y === t[2]); if (!pr) return '';
      const sau = f6flag(a, 'sau'), k = sau ? outerOf(EL[pr[0]].z) : 0;
      svg = ionSvg({a: pr[0], b: pr[1]}, sau ? {k, giver: 'a'} : {});
      cap = an ? `Sơ đồ nguyên tử ${pr[0]} và ${pr[1]}` : sau ? `Nguyên tử ${pr[0]} nhường ${k} electron cho nguyên tử ${pr[1]}, tạo ion ${pr[0]}${k > 1 ? k : ''}+ và ion ${pr[1]}${k > 1 ? k : ''}−` : `Nguyên tử ${pr[0]} và ${pr[1]} trước khi tạo liên kết`;
    } else if (t[0] === 'cht') {
      const m = COV_MOLS.find(x => x.f === t[1]); if (!m) return '';
      svg = covSvg(m, m.p); cap = an ? 'Sơ đồ góp chung electron' : `Sơ đồ góp chung electron trong phân tử ${m.f}`;
    } else return '';
    if (an) svg = svg.replace(/<text[^>]*class="bd-c"[^>]*>[^<]*<\/text>/g, '').replace(/aria-label="[^"]*"/, `aria-label="${esc(cap)}"`);
    return `<span class="bk-fig fg-wrap">${svg}<small class="fg-cap">${esc(figSub(cap).replace(/<[^>]+>/g, ''))}</small></span>`;
  },

  caysusong(a) {
    // Đọc cấu trúc ngoặc lồng nhau → cây nhị phân / đa phân
    const src = f6parts(a)[0]; let i = 0;
    const node = () => { if (src[i] === '(') { i++; const ch = [node()]; while (src[i] === ',') { i++; ch.push(node()); } if (src[i] !== ')') throw 0; i++; return {ch}; }
      let t = ''; while (i < src.length && !'(),'.includes(src[i])) t += src[i++]; t = t.trim(); if (!t) throw 0; return {ten: t}; };
    let root; try { root = node(); if (i !== src.length || !root.ch) return ''; } catch (e) { return ''; }
    const leaves = []; const depth = n => n.ch ? 1 + Math.max(...n.ch.map(depth)) : 0, D = depth(root);
    const W = 330, rowH = 30, x0 = 20, xL = 210;
    const walk = (n, d) => { if (!n.ch) { n.y = 24 + leaves.length * rowH; leaves.push(n); n.x = xL; return; }
      n.ch.forEach(c => walk(c, d + 1)); n.x = x0 + (xL - x0) * d / D; n.y = (n.ch[0].y + n.ch[n.ch.length - 1].y) / 2; };
    walk(root, 0);
    const H = 24 + leaves.length * rowH + 22;
    let g = '';
    const draw = n => { if (!n.ch) return; const ys = n.ch.map(c => c.y);
      g += `<line x1="${f6r(n.x)}" y1="${f6r(Math.min(...ys))}" x2="${f6r(n.x)}" y2="${f6r(Math.max(...ys))}" class="fg-wire"/>`;
      n.ch.forEach(c => { g += `<line x1="${f6r(n.x)}" y1="${f6r(c.y)}" x2="${f6r(c.x)}" y2="${f6r(c.y)}" class="fg-wire"/>`; draw(c); }); };
    g += `<line x1="${x0 - 12}" y1="${f6r(root.y)}" x2="${x0}" y2="${f6r(root.y)}" class="fg-wire"/>`; draw(root);
    leaves.forEach(l => { g += `<circle cx="${xL}" cy="${f6r(l.y)}" r="2.5" class="fg-node"/><text x="${xL + 8}" y="${f6r(l.y + 4)}" class="fg-t b">${esc(l.ten)}</text>`; });
    g += figArrow(x0, H - 10, xL, H - 10, 'fg-dim') + `<text x="${x0}" y="${H - 14}" class="fg-t">tổ tiên chung</text><text x="${xL}" y="${H - 14}" class="fg-t" text-anchor="end">hiện nay</text>`;
    return f6wrap(W, H, g, 'Cây sự sống: hai nhóm tách ra từ cùng một điểm rẽ càng gần hiện nay thì họ hàng càng gần');
  },
});

;

/* fig8.js */
/* HÌNH VẼ BẰNG MÃ (đợt 8) — hình giải phẫu / sinh thái Sinh 7–8. Tự kiểm: tools/test_fig8.js.
   LUÔN ghi dấu ":" sau tên hình, kể cả khi không có tham số: [mat:] chứ không phải [mat] — thiếu ":" thì hình KHÔNG vẽ.
   Cách ghi nhãn (dùng chung cho mọi hình cơ quan dưới đây) — chọn đúng một, để hình KHÔNG làm lộ đáp án bằng cách loại trừ:
     (mặc định)  ghi đủ tên các bộ phận            — dùng khi câu hỏi KHÔNG hỏi tên / vị trí bộ phận (hỏi chức năng, sự biến đổi…)
     so          chỉ ghi số 1, 2, 3…               — câu hỏi "bộ phận số mấy là…", "số 3 có chức năng gì"
     ? <mã>      chỉ một nhãn "?" ở bộ phận được hỏi — câu hỏi "bộ phận đánh dấu ? là gì"
     an          không nhãn nào                     — chỉ cho thấy hình dạng, vị trí
   [hoa:cat dau voi]   hoa lưỡng tính cắt dọc. Mã bộ phận: dau (đầu nhuỵ) voi (vòi nhuỵ) bau (bầu nhuỵ) noan (noãn) bp (bao phấn)
                       cn (chỉ nhị) canh (cánh hoa) dai (đài hoa) de (đế hoa) cuong (cuống hoa). cat … = các bộ phận bị mất (vẽ nét đứt).
   [mat:]              cầu mắt cắt ngang, ánh sáng tới từ trái. gm (giác mạc) mm (mống mắt) ttt (thuỷ tinh thể) dtt (dịch thuỷ tinh)
                       ml (màng lưới) dv (điểm vàng) dm (điểm mù) tk (dây thần kinh thị giác) mc (màng cứng). KHÔNG vẽ tia sáng.
   [tai:] [tai:vung]   tai cắt dọc, âm tới từ trái. vt (vành tai) ot (ống tai) mn (màng nhĩ) xt (chuỗi xương tai) vn (vòi nhĩ)
                       oc (ốc tai) bk (ống bán khuyên) tk (dây thần kinh thính giác). vung = ghi ba vùng tai ngoài / giữa / trong.
   [khop:duoi]  [khop:gap]   cánh tay – khớp khuỷu – cẳng tay; duoi = tay duỗi thẳng, gap = cẳng tay gập 90°. xct (xương cánh tay)
                       xcg (xương cẳng tay) kk (khớp khuỷu tay) c2 (cơ hai đầu) c3 (cơ ba đầu). Tay gập: cơ hai đầu ngắn và to hơn
                       (đang co), cơ ba đầu dài và mảnh (đang dãn); an = vẽ hai cơ như nhau (không lộ cơ nào co).
   [tuyen:]            hình người nhìn thẳng với các tuyến nội tiết: yen (tuyến yên) giap (tuyến giáp) tuy (tuyến tuỵ)
                       tt (tuyến trên thận). Dạ dày và thận vẽ mờ, không ghi tên, làm mốc vị trí.
   [than:]             đơn vị chức năng của thận: ct (cầu thận) nct (nang cầu thận) ot (ống thận) og (ống góp) mm (mạch máu).
   [thaptuoi:45 35 20 | so | dan]   tháp tuổi: tỉ lệ nhóm trước / đang / sau sinh sản (từ đáy lên), vẽ đúng tỉ lệ bề rộng.
                       so = ghi %; dan = tháp dân số (nhóm 0–14 / 15–64 / từ 65 tuổi). KHÔNG bao giờ ghi tên dạng tháp. */

// Nhãn chung: parts = [[mã, tên, xNeo, yNeo, xChữ, yChữ, 'l' | 'r']]
function f8lab(a, parts) {
  const P = f6parts(a), hoi = f6kv(P, '?'), so = f6flag(a, 'so'), an = f6flag(a, 'an');
  if (an) return '';
  return parts.map(([k, ten, x, y, tx, ty, s], i) => {
    if (hoi != null && hoi !== k) return '';
    const t = hoi != null ? '?' : so ? String(i + 1) : ten, r = s === 'r', ex = r ? tx - 3 : tx + 3;
    return `<line x1="${ex}" y1="${ty - 3.5}" x2="${x}" y2="${y}" class="fg8-ld"/><circle cx="${x}" cy="${y}" r="1.8" class="fg8-dot"/>`
      + `<text x="${tx}" y="${ty}" class="fg-t${hoi != null || so ? ' b fg8-big' : ''}" text-anchor="${r ? 'start' : 'end'}">${t}</text>`;
  }).join('');
}
const f8has = (parts, k) => parts.some(p => p[0] === k);
// Tự kiểm: mã "?" phải là một bộ phận có thật của hình
const f8ok = (a, parts) => { const k = f6kv(f6parts(a), '?'); return k == null || f8has(parts, k); };

Object.assign(FIG, {
  hoa(a) {
    const P = f6parts(a), cat = (f6kv(P, 'cat') || '').split(/\s+/).filter(Boolean), cx = 170;
    const parts = [['dau', 'Đầu nhuỵ', cx + 6, 88, 262, 52, 'r'], ['voi', 'Vòi nhuỵ', cx + 3, 124, 262, 96, 'r'], ['bau', 'Bầu nhuỵ', cx + 17, 160, 262, 140, 'r'],
      ['noan', 'Noãn', cx + 5, 172, 262, 176, 'r'], ['de', 'Đế hoa', cx + 20, 198, 262, 208, 'r'],
      ['bp', 'Bao phấn', cx - 44, 108, 74, 52, 'l'], ['cn', 'Chỉ nhị', cx - 25, 152, 74, 96, 'l'], ['canh', 'Cánh hoa', cx - 72, 118, 74, 140, 'l'],
      ['dai', 'Đài hoa', cx - 50, 190, 74, 180, 'l'], ['cuong', 'Cuống hoa', cx - 3, 226, 74, 222, 'l']];
    if (!f8ok(a, parts) || cat.some(k => !f8has(parts, k))) return '';
    const mir = d => `<path d="${d}" class="CL"/><path d="${d}" class="CL" transform="translate(${2 * cx} 0) scale(-1 1)"/>`;
    const c = (k, cls) => cat.includes(k) ? 'fg8-cut' : cls;
    let g = `<path d="M${cx - 4} 200 L${cx - 4} 236 L${cx + 4} 236 L${cx + 4} 200 Z" class="${c('cuong', 'fg8-stem')}"/>`
      + mir(`M${cx - 20} 194 C${cx - 44} 198 ${cx - 64} 188 ${cx - 70} 172 C${cx - 54} 176 ${cx - 36} 184 ${cx - 18} 188 Z`).replace(/CL/g, c('dai', 'fg8-sepal'))
      + mir(`M${cx - 22} 190 C${cx - 70} 176 ${cx - 96} 120 ${cx - 86} 76 C${cx - 66} 100 ${cx - 40} 150 ${cx - 16} 184 Z`).replace(/CL/g, c('canh', 'fg8-petal'))
      + `<ellipse cx="${cx}" cy="197" rx="26" ry="8" class="${c('de', 'fg8-recep')}"/>`;
    for (const [bx, tx, ty] of [[-14, -44, 110], [-8, -26, 100], [8, 26, 100], [14, 44, 110]])   // 4 nhị: chỉ nhị + bao phấn
      g += `<path d="M${cx + bx} 190 Q${cx + bx + (tx - bx) * 0.2} 150 ${cx + tx} ${ty + 8}" class="${c('cn', 'fg8-fil')}"/><ellipse cx="${cx + tx}" cy="${ty}" rx="5" ry="9" class="${c('bp', 'fg8-anth')}"/>`;
    g += `<path d="M${cx - 3} 152 L${cx - 3} 94 L${cx + 3} 94 L${cx + 3} 152 Z" class="${c('voi', 'fg8-pist')}"/>`
      + `<path d="M${cx - 11} 92 Q${cx} 80 ${cx + 11} 92 Q${cx} 97 ${cx - 11} 92 Z" class="${c('dau', 'fg8-stig')}"/>`
      + `<path d="M${cx} 150 C${cx + 24} 152 ${cx + 22} 190 ${cx} 192 C${cx - 22} 190 ${cx - 24} 152 ${cx} 150 Z" class="${c('bau', 'fg8-ovary')}"/>`
      + [[-7, 164], [7, 164], [-7, 179], [7, 179]].map(([dx, y]) => `<ellipse cx="${cx + dx}" cy="${y}" rx="3.6" ry="5" class="${c('noan', 'fg8-ovule')}"/>`).join('');
    return f6wrap(336, 244, g + f8lab(a, parts), 'Cấu tạo hoa (cắt dọc)' + (cat.length ? ' — nét đứt: bộ phận đã bị mất' : ''));
  },

  mat(a) {
    const cx = 180, cy = 118, R = 70, pt = (r, d) => [f6r(cx + r * Math.cos(f6deg(d))), f6r(cy - r * Math.sin(f6deg(d)))];
    const parts = [['gm', 'Giác mạc', 100, 104, 70, 70, 'l'], ['mm', 'Mống mắt', 123, 92, 70, 118, 'l'], ['ttt', 'Thuỷ tinh thể', 134, 134, 70, 166, 'l'],
      ['dtt', 'Dịch thuỷ tinh', 186, 150, 70, 212, 'l'], ['mc', 'Màng cứng', ...pt(R, 70), 306, 34, 'r'], ['ml', 'Màng lưới', ...pt(R - 8, 35), 306, 70, 'r'],
      ['dv', 'Điểm vàng', ...pt(R - 8, 0), 306, 106, 'r'], ['dm', 'Điểm mù', ...pt(R - 8, -16), 306, 142, 'r'], ['tk', 'Dây thần kinh thị giác', 284, 166, 306, 196, 'r']];
    if (!f8ok(a, parts)) return '';
    const [ax, ay] = pt(R, 148), [bx, by] = pt(R, -148), [rx1, ry1] = pt(R - 8, 128), [rx2, ry2] = pt(R - 8, -128), [nx1, ny1] = pt(R, -10), [nx2, ny2] = pt(R, -22);
    let g = `<path d="M${ax} ${ay} A${R} ${R} 0 1 1 ${bx} ${by}" class="fg8-scl"/>`
      + `<path d="M${ax} ${ay} Q${cx - R - 30} ${cy} ${bx} ${by}" class="fg8-corn"/>`
      + `<path d="M${rx1} ${ry1} A${R - 8} ${R - 8} 0 1 1 ${rx2} ${ry2}" class="fg8-ret"/>`
      + `<path d="M${nx1} ${ny1} L300 ${cy + 36} L300 ${cy + 56} L${nx2} ${ny2} Z" class="fg8-nerve"/>`
      + `<line x1="123" y1="${cy - 35}" x2="123" y2="${cy - 11}" class="fg8-iris"/><line x1="123" y1="${cy + 11}" x2="123" y2="${cy + 35}" class="fg8-iris"/>`
      + `<ellipse cx="134" cy="${cy}" rx="9" ry="25" class="fg8-lens"/>`
      + `<circle cx="${pt(R - 8, 0)[0] - 1}" cy="${cy}" r="3.4" class="fg8-fovea"/>`;
    return f6wrap(420, 232, g + f8lab(a, parts), 'Cầu mắt (cắt ngang)');
  },

  tai(a) {
    const vung = f6flag(a, 'vung');
    const parts = [['vt', 'Vành tai', 22, 60, 14, 22, 'r'], ['ot', 'Ống tai', 92, 113, 70, 22, 'r'], ['mn', 'Màng nhĩ', 153, 108, 122, 22, 'r'],
      ['xt', 'Chuỗi xương tai', 184, 102, 176, 22, 'r'], ['bk', 'Ống bán khuyên', 250, 72, 308, 50, 'r'], ['tk', 'Dây thần kinh thính giác', 290, 116, 308, 98, 'r'],
      ['oc', 'Ốc tai', 262, 148, 308, 150, 'r'], ['vn', 'Vòi nhĩ', 224, 180, 308, 196, 'r']];
    if (!f8ok(a, parts)) return '';
    let g = `<path d="M44 150 C18 150 8 112 14 78 C20 44 50 32 64 54 C72 70 60 84 54 100 L52 124 C54 138 56 150 44 150 Z" class="fg8-skin"/><path d="M40 68 C28 80 28 106 40 120" class="fg8-helix"/>`
      + `<path d="M50 104 L150 100 L152 126 L50 124 Z" class="fg8-canal"/>`
      + `<line x1="150" y1="96" x2="156" y2="130" class="fg8-drum"/>`
      + `<path d="M156 86 Q156 78 166 78 L204 78 Q212 78 212 88 L212 138 Q212 146 204 146 L166 146 Q156 146 156 138 Z" class="fg8-cav"/>`
      + `<path d="M200 146 L240 196 L232 202 L192 150 Z" class="fg8-cav"/>`
      + `<path d="M154 106 L166 96 L171 102 L160 114 Z M172 96 L184 94 L186 106 L176 108 Z M188 104 L204 102 L212 108 L204 114 L190 114 Z" class="fg8-bone"/>`
      + `<ellipse cx="236" cy="70" rx="10" ry="15" class="fg8-semi"/><ellipse cx="250" cy="80" rx="15" ry="8" class="fg8-semi"/><ellipse cx="226" cy="86" rx="8" ry="11" class="fg8-semi"/>`
      + `<path d="M212 102 Q224 94 238 100 Q244 112 236 120 Q222 122 212 116 Z" class="fg8-vest"/>`;
    let sp = '';   // ốc tai: xoắn ốc ~2,5 vòng
    for (let t = 0; t <= 5 * Math.PI + 0.01; t += 0.2) { const r = 2 + 1.35 * t; sp += `${sp ? 'L' : 'M'}${f6r(246 + r * Math.cos(t))} ${f6r(142 + r * Math.sin(t) * 0.85)} `; }
    g += `<path d="${sp}" class="fg8-coch"/><path d="M248 136 Q268 112 300 108 L300 116 Q276 122 256 144 Z" class="fg8-nerve"/>`;
    if (vung) g += [[10, 152, 'Tai ngoài'], [155, 212, 'Tai giữa'], [214, 300, 'Tai trong']].map(([x1, x2, t]) => `<path d="M${x1} 214 L${x1} 220 L${x2} 220 L${x2} 214" class="fg-arc"/><text x="${(x1 + x2) / 2}" y="232" class="fg-t b" text-anchor="middle">${t}</text>`).join('');
    return f6wrap(430, vung ? 238 : 210, g + f8lab(a, parts), 'Cấu tạo tai (cắt dọc)');
  },

  khop(a) {
    const gap = f6flag(a, 'gap'), an = f6flag(a, 'an'), E = [176, 150], ang = gap ? -90 : 0;
    const fw = (d, s = 0) => { const q = f6deg(ang); return [f6r(E[0] + d * Math.cos(q) - s * Math.sin(q)), f6r(E[1] + d * Math.sin(q) + s * Math.cos(q))]; };   // d dọc cẳng tay, s lệch vuông góc
    // bụng cơ: gân ở hai đầu, phần bụng phồng về phía side (−1 = phía trên xương cánh tay, +1 = phía dưới)
    const belly = ([x1, y1], [x2, y2], w, side) => { const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy * side, ny = ux * side;
      const P = (t, k) => `${f6r(x1 + ux * L * t + nx * k)} ${f6r(y1 + uy * L * t + ny * k)}`;
      return {d: `<line x1="${x1}" y1="${y1}" x2="${P(0.14, 0).split(' ')[0]}" y2="${P(0.14, 0).split(' ')[1]}" class="fg8-ten"/><line x1="${P(0.86, 0).split(' ')[0]}" y1="${P(0.86, 0).split(' ')[1]}" x2="${x2}" y2="${y2}" class="fg8-ten"/>`
        + `<path d="M${P(0.14, 0)} C${P(0.3, 1.45 * w)} ${P(0.7, 1.45 * w)} ${P(0.86, 0)} C${P(0.7, -0.25 * w)} ${P(0.3, -0.25 * w)} ${P(0.14, 0)} Z" class="fg8-mus"/>`, mid: P(0.5, 0.8 * w).split(' ').map(Number)}; };
    const w2 = an ? 10 : gap ? 15 : 9, w3 = an ? 10 : gap ? 7 : 10;
    const b2 = belly([40, 141], fw(20, -8), w2, -1), b3 = belly([40, 159], fw(-10, 12), w3, 1);
    const parts = [['xct', 'Xương cánh tay', 104, 150, 118, 222, 'r'], ['kk', 'Khớp khuỷu tay', E[0], E[1], 214, 206, 'r'], ['xcg', 'Xương cẳng tay', ...fw(70), 250, gap ? 60 : 118, 'r'],
      ['c2', 'Cơ hai đầu', ...b2.mid, 36, 60, 'r'], ['c3', 'Cơ ba đầu', ...b3.mid, 14, 222, 'r']];
    if (!f8ok(a, parts)) return '';
    const [hx, hy] = fw(118);
    let g = `<path d="M24 136 Q16 150 24 164 L34 160 Q30 150 34 140 Z" class="fg8-bone"/>`   // ổ khớp vai
      + `<path d="M34 146 L166 146 L166 154 L34 154 Z" class="fg8-bone"/><circle cx="36" cy="150" r="9" class="fg8-bone"/><circle cx="${E[0] - 6}" cy="${E[1]}" r="9" class="fg8-bone"/>`
      + `<path d="M${fw(4, -7).join(' ')} L${fw(112, -6).join(' ')} L${fw(112, 6).join(' ')} L${fw(4, 7).join(' ')} Z" class="fg8-bone"/>`
      + `<path d="M${fw(-4, 7).join(' ')} Q${fw(-14, 14).join(' ')} ${fw(-6, 16).join(' ')} L${fw(6, 8).join(' ')} Z" class="fg8-bone"/>`   // mỏm khuỷu
      + `<circle cx="${E[0]}" cy="${E[1]}" r="15" class="fg8-caps"/>`
      + `<path d="M${hx} ${hy} m${gap ? '-9 0 a9 11 0 1 0 18 0 a9 11 0 1 0 -18 0' : '0 -9 a11 9 0 1 0 0 18 a11 9 0 1 0 0 -18'}" class="fg8-hand"/>`
      + b2.d + b3.d;
    return f6wrap(336, 236, g + f8lab(a, parts), gap ? 'Tay gập ở khớp khuỷu' : 'Tay duỗi thẳng');
  },

  tuyen(a) {
    const parts = [['yen', 'Tuyến yên', 130, 44, 204, 34, 'r'], ['giap', 'Tuyến giáp', 130, 90, 204, 84, 'r'], ['tuy', 'Tuyến tuỵ', 146, 162, 204, 150, 'r'], ['tt', 'Tuyến trên thận', 150, 181, 204, 196, 'r']];
    if (!f8ok(a, parts)) return '';
    let g = `<circle cx="130" cy="44" r="26" class="fg8-body"/><path d="M121 68 L139 68 L140 80 L120 80 Z" class="fg8-body"/>`
      + `<path d="M120 80 L84 88 Q70 92 68 108 L60 200 L72 202 L84 120 L86 214 Q88 240 100 244 L160 244 Q172 240 174 214 L176 120 L188 202 L200 200 L192 108 Q190 92 176 88 L140 80 Z" class="fg8-body"/>`
      + `<path d="M146 124 Q170 120 168 138 Q164 152 144 148 Q134 138 146 124 Z" class="fg8-ghost"/>`   // dạ dày (mốc, bên trái cơ thể = bên phải hình)
      + `<ellipse cx="112" cy="204" rx="9" ry="14" class="fg8-ghost"/><ellipse cx="150" cy="200" rx="9" ry="14" class="fg8-ghost"/>`   // hai quả thận (mốc; thận phải thấp hơn)
      + `<ellipse cx="130" cy="47" rx="3.2" ry="2.6" class="fg8-gland"/>`
      + `<path d="M130 90 Q124 84 121 88 Q119 94 124 96 Q128 95 130 92 Q132 95 136 96 Q141 94 139 88 Q136 84 130 90 Z" class="fg8-gland"/>`
      + `<path d="M110 158 Q116 154 128 158 Q146 160 160 154 Q166 156 162 162 Q148 168 128 166 Q116 168 110 164 Z" class="fg8-gland"/>`   // tuỵ: đầu bên phải cơ thể, đuôi về phía lách
      + `<path d="M105 192 L112 184 L119 192 Z" class="fg8-gland"/><path d="M143 188 L150 180 L157 188 Z" class="fg8-gland"/>`;
    return f6wrap(300, 252, g + f8lab(a, parts), 'Vị trí một số tuyến nội tiết (hình người nhìn thẳng)');
  },

  than(a) {
    const parts = [['ct', 'Cầu thận', 64, 70, 128, 22, 'r'], ['nct', 'Nang cầu thận', 42, 94, 14, 132, 'r'], ['ot', 'Ống thận', 150, 150, 186, 196, 'r'],
      ['og', 'Ống góp', 262, 170, 276, 222, 'r'], ['mm', 'Mạch máu', 32, 40, 14, 18, 'r']];
    if (!f8ok(a, parts)) return '';
    let tub = 'M84 88 ';   // ống lượn gần → quai → ống lượn xa → ống góp
    for (let i = 0; i < 4; i++) tub += `Q${96 + i * 18} ${i % 2 ? 108 : 70} ${104 + i * 18} 88 `;
    tub += 'L176 88 L176 200 Q184 214 192 200 L192 110 ';
    for (let i = 0; i < 3; i++) tub += `Q${202 + i * 16} ${i % 2 ? 126 : 94} ${210 + i * 16} 110 `;
    tub += 'L262 110';
    let g = `<path d="M28 50 Q46 56 58 64" class="fg8-art"/><path d="M58 76 Q44 86 30 82" class="fg8-art2"/>`
      + `<path d="M84 88 C88 110 70 118 58 116 C36 114 30 92 34 76 C38 58 56 50 72 54 C80 56 84 62 86 68" class="fg8-caps2"/>`
      + [[60, 68], [70, 64], [66, 76], [56, 78], [74, 74]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" class="fg8-glom"/>`).join('')
      + `<path d="${tub}" class="fg8-tub"/><path d="M262 60 L262 236" class="fg8-duct"/>`;
    return f6wrap(336, 244, g + f8lab(a, parts), 'Đơn vị chức năng của thận (sơ đồ)');
  },

  thaptuoi(a) {
    const P = f6parts(a), v = (P[0] || '').split(/\s+/).map(x => +String(x).replace(',', '.'));
    if (v.length !== 3 || v.some(x => !(x > 0))) return '';
    const so = f6flag(a, 'so'), dan = f6flag(a, 'dan'), sum = v.reduce((s, x) => s + x, 0), mx = Math.max(...v), cx = 200, Wmax = 220, h = 44, y0 = 172;
    const ten = dan ? ['0–14 tuổi', '15–64 tuổi', 'Từ 65 tuổi'] : ['Trước sinh sản', 'Đang sinh sản', 'Sau sinh sản'];
    let g = '';
    v.forEach((x, i) => { const w = f6r(Wmax * x / mx), y = y0 - (i + 1) * h;
      g += `<rect x="${f6r(cx - w / 2)}" y="${y}" width="${w}" height="${h}" class="fg8-age${i}"/><text x="82" y="${y + h / 2 + 4}" class="fg-t b" text-anchor="end">${ten[i]}</text>`
        + (so ? `<text x="${cx}" y="${y + h / 2 + 4}" class="fg-t b" text-anchor="middle">${f6r(100 * x / sum, 0)}%</text>` : ''); });
    return f6wrap(320, 186, g + `<line x1="86" y1="${y0}" x2="316" y2="${y0}" class="fg-arc"/>`, dan ? 'Tháp dân số' : 'Tháp tuổi của quần thể');
  },
});

;


// ── BK: điểm vào duy nhất ──
// Chỉ nhận 1 mã hình (hoặc chữ có lẫn mã) — phần chữ ngoài mã được escape, không chạy định dạng của Pocket.
export function veHinh(ma) { return figText(ma, esc) }
export const KIEU_HINH = FIG_RE.source
