// ĐIỀN Ô cho câu TÍNH TOÁN (Đại) — spec-dien-o.md Phase 2 (§1 ô giá trị bằng máy, §3 schema, §4 pipeline); cầu nối
// spec-mcq-tung-phan.md. 100% MÁY, không cần Claude: lời giải tách bước theo `=` (lib/dien-buoc.mjs), ô = số ở bước k là
// giá trị 1 phép tính con ở bước k−1, 4 phương án = key + 3 KẾT QUẢ THẬT của 3 đường sai (rule dai_mcq_rule R01–R88 +
// R100/R101 phần trăm) áp lên ĐÚNG phép tính con đó qua evalRule() của mcq-auto.mjs (dùng chung kho rule với form TN).
//
//   node scripts/mcq-dien.mjs --sinh [--dang T106020304,T107010205] [--n 200] --out kq.json [--debug ma_cau]
//        → kq.json: [{ ma_cau, dang_chinh, loi_giai_bam, buoc:[{k,text}], o:[{id,buoc,key,key_gia_tri,tinh_tu,dap_an,phuong_an[4]}] } | { ma_cau, bo }]
//          `⟦oN⟧` trong buoc[].text đúng chỗ số bị đục (khoá = văn bản + vị trí, không phải index câu §2 CLAUDE.md).
//   node scripts/mcq-dien.mjs --verify kq.json      → kiểm MÁY lại từ DB (nhân chứng thứ hai): ghép ⟦oN⟧←key phải ra
//          nguyên văn lời giải; key = giá trị ô do bộ đọc tìm lại; 4 phương án khác giá trị; rule tồn tại/khác nhau; hình thức.
//   node scripts/mcq-dien.mjs --xem kq.json --out dien.html   → HTML tự chứa (KaTeX nhúng) cho CEO lướt duyệt (D1).
//   node scripts/mcq-dien.mjs --ghi kq.json [--model m]       → verify lại rồi INSERT dai_cau_form_dien (da_duyet=false), mỗi câu
//          1 transaction; câu đã có form hiệu lực → bỏ qua. Trigger DB kiểm lần nữa.
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { parse, ev, canonOf, evalRule, DS } from './mcq-auto.mjs'
import { tachChuoi, timO, timToken, fmtNhu, kieuToken, texNode, chuanManh, val } from './lib/dien-buoc.mjs'
import { timUngVienGtln, RULE_QH } from './lib/dien-khuon-gtln.mjs'
import { timUngVienAnCnD, RULE_ANCND } from './lib/dien-khuon-ancnd.mjs'
import { timUngVienLuyThua, RULE_LUYTHUA } from './lib/dien-khuon-luythua.mjs'
import { timUngVienHieuTich, RULE_HIEUTICH } from './lib/dien-khuon-hieutich.mjs'
import { timUngVienBdt, RULE_BDT } from './lib/dien-khuon-bdt.mjs'
// KHUÔN THEO DẠNG (làm từng dạng một, CEO duyệt mẫu rồi mới chạy cả dạng — Thùy 12/09): dạng có bộ đọc riêng thay cho bộ
// đọc chung theo `=`. Hàm trả ứng viên ô cùng cấu trúc { kieu, v, key, tok, start, end, dong, pick, tinh_tu }.
const KHUON = {
  '077022220401': timUngVienGtln, T106030401: timUngVienAnCnD, T106020601: timUngVienLuyThua, T107010501: timUngVienHieuTich,
  T107010504: timUngVienBdt, T107010505: timUngVienBdt, T107010506: timUngVienBdt, T107010507: timUngVienBdt,
}

const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const has = (k) => args.includes(k)
const env = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const url = env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const TBL = 'dai_cau_form_dien'
const L = ['A', 'B', 'C', 'D']
const md5 = (s) => createHash('md5').update(String(s ?? ''), 'utf8').digest('hex')

// Pool Điền Ô đợt 1 (đo 12/09, _do_dien_o_tp.mjs): 2 dạng Toán thực tế — 90–92% câu có ô, ~4 ô/câu, chuỗi nhất quán 100%.
const POOL_TT = ['T106020304', 'T107010205']
// Thứ tự ưu tiên rule cho ô GIÁ TRỊ của toán thực tế (phép tính số nguyên/thập phân/%, không âm): sai ưu tiên/nhầm phép/
// phân phối/phá ngoặc/quên thừa số, rồi phần trăm, rồi rule số hữu tỉ; dự phòng (R24 sót, R05 lệch 1) sau cùng.
const UU_TIEN = {
  T106020304: ['R102', 'R12', 'R52', 'R104', 'R23', 'R01', 'R100', 'R101', 'R10', 'R11', 'R06', 'R08', 'R09', 'R07', 'R27', 'R02', 'R13', 'R24', 'R103', 'R05'],
  T107010205: ['R102', 'R12', 'R52', 'R104', 'R100', 'R101', 'R23', 'R01', 'R11', 'R10', 'R06', 'R08', 'R09', 'R07', 'R27', 'R02', 'R13', 'R24', 'R103', 'R05'],
}
const ALL = ['R01', 'R02', 'R03', 'R06', 'R07', 'R08', 'R09', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18', 'R23', 'R26', 'R27', 'R28', 'R29', 'R30', 'R52', 'R100', 'R101', 'R102', 'R104', 'R24', 'R103', 'R05', 'R04']
// Dự phòng (DB du_phong=true): R24 sót hạng tử · R05 lệch 1 đơn vị · R103 lệch 1 chữ số 0. Điền Ô: mỗi ô ≥1 rule CHÍNH, ≤2 dự phòng
// (nới so với form TN "≤1" — bước 1 phép tính của bài thực tế thường chỉ có 1–2 đường sai khái niệm thật).
const DU_PHONG = new Set(['R24', 'R05', 'R103'])
const DS_THEM = { R100: 'tính phần trăm mà quên chia 100', R101: 'lấy nhầm phần trăm bù (100% − p%) thay vì p%', R102: 'nhầm phép cộng thành trừ / trừ thành cộng', R103: 'đặt tính lệch một chữ số 0 (kết quả gấp 10 hoặc bằng 1/10)', R104: 'quên nhân với số lượng' }

// ── Rule PHẦN TRĂM (R100/R101, riêng Điền Ô — không có trong ev() của mcq-auto): "p\%" đã chuẩn hoá thành (p/100) ────
// Nhận diện nút paren{bin '/' num num100}; R100 thay bằng p (quên :100), R101 thay bằng (100−p)/100 (lấy phần bù).
const laPhanTram = (n) => n?.t === 'paren' && n.a?.t === 'bin' && n.a.op === '/' && n.a.a?.t === 'num' && n.a.b?.t === 'num' && n.a.b.v.q === 1n && n.a.b.v.p === 100n
function thayPhanTram(n, f) {
  if (!n || typeof n !== 'object') return n
  if (laPhanTram(n)) return f(n.a.a)
  const c = { ...n }; for (const k of ['a', 'b', 'L', 'R']) if (n[k]) c[k] = thayPhanTram(n[k], f); return c
}
const coPhanTram = (n) => !!n && typeof n === 'object' && (laPhanTram(n) || ['a', 'b', 'L', 'R'].some((k) => n[k] && coPhanTram(n[k])))
const strip = (n) => (n?.t === 'paren' ? strip(n.a) : n)
const num = (p) => ({ t: 'num', v: { p: BigInt(p), q: 1n }, dec: 0 })
const fmtR = (r) => (r.q === 1n ? `${r.p}` : `${r.p}/${r.q}`)
// Rule RIÊNG cho bài thực tế (R100–R104, 12/09) — biến đổi AST rồi ev(rule null); không đụng ev() của mcq-auto.
//   R102 nhầm + ↔ − ở phép NGOÀI CÙNG (đọc "còn lại"/"tổng" sai)          R103 lệch 1 chữ số 0 (÷10 nếu còn nguyên, alt ×10)
//   R104 quên nhân với số lượng: hạng tử a·b (b ≤ 100, số đếm) → chỉ còn a   R100/R101 phần trăm
function ruleThem(n, r, key) {
  const root = strip(n)
  if (r === 'R100' || r === 'R101') {
    if (!coPhanTram(n)) return null
    if (r === 'R100') { const v = ev(thayPhanTram(n, (p) => p), { rule: null }); return v ? { v, fired: DS_THEM.R100 } : null }
    const v = ev(thayPhanTram(n, (p) => ({ t: 'paren', a: { t: 'bin', op: '/', a: { t: 'bin', op: '-', a: num(100), b: p }, b: num(100) } })), { rule: null }); return v ? { v, fired: DS_THEM.R101 } : null
  }
  if (r === 'R102') {
    if (root.t !== 'bin' || !'+-'.includes(root.op)) return null
    const op = root.op === '+' ? '-' : '+'
    const v = ev({ ...root, op }, { rule: null }); if (!v) return null
    return { v, fired: `${fmtR(ev(root.a, { rule: null }))} ${op} ${fmtR(ev(root.b, { rule: null }))} = ${fmtR(v)} (đáng lẽ ${root.op === '+' ? 'cộng' : 'trừ'} lại ${op === '+' ? 'cộng' : 'trừ'})` }
  }
  if (r === 'R103') {
    if (!key || key.q !== 1n) return null
    const chia = key.p % 10n === 0n ? { p: key.p / 10n, q: 1n } : null, nhan = { p: key.p * 10n, q: 1n }
    return { v: chia ?? nhan, alt: chia ? nhan : null, fired: DS_THEM.R103 }
  }
  if (r === 'R104') {
    // hạng tử a·b với 1 thừa số là số đếm nguyên ≤ 100 → bỏ thừa số đó (chỉ áp hạng tử ĐẦU TIÊN tìm thấy, 1 lỗi/1 chỗ)
    let done = false
    const go = (m) => {
      if (done || !m || typeof m !== 'object') return m
      const s = strip(m)
      if (s.t === 'bin' && s.op === '*') {
        const a = ev(s.a, { rule: null }), b = ev(s.b, { rule: null })
        const dem = (x) => x && x.q === 1n && x.p >= 2n && x.p <= 100n
        if (dem(b) && !dem(a)) { done = true; return s.a }
        if (dem(a) && !dem(b)) { done = true; return s.b }
      }
      const c = { ...m }; for (const k of ['a', 'b']) if (m[k]) c[k] = go(m[k]); return c
    }
    const t2 = go(n); if (!done) return null
    const v = ev(t2, { rule: null }); return v ? { v, fired: DS_THEM.R104 } : null
  }
  return null
}
const RULE_THEM = new Set(['R100', 'R101', 'R102', 'R103', 'R104'])

// Số xuất hiện trong ĐỀ (đã bỏ phân cách nghìn) — ô có giá trị nằm sẵn trong đề thì HS chép được ⇒ không đục (spec §1).
function soTrongDe(noiDung) {
  const s = String(noiDung ?? '').replace(/\\ /g, ' ').replace(/(\d{1,3})(?:[ .](\d{3}))+(?!\d)/g, (m) => m.replace(/[ .]/g, ''))
  const out = new Set(); for (const m of s.matchAll(/\d+(?:,\d+)?/g)) { try { out.add(val(parse(chuanManh(m[0])))) } catch {} } return out
}

// ── SINH cho 1 câu → { item } | { bo } ──────────────────────────────────────────────────────────────────────
function sinhCau(q, counts, ruleUsed, debug) {
  const { text, chuoi } = tachChuoi(q.loi_giai)
  const order = [...(UU_TIEN[q.dang_chinh] ?? []), ...ALL.filter((r) => !(UU_TIEN[q.dang_chinh] ?? []).includes(r))]
  const trongDe = soTrongDe(q.noi_dung)
  const cands = [], loai = []
  const khuon = KHUON[q.dang_chinh]
  if (khuon) cands.push(...khuon(q, { ruleUsed, loai }))
  else for (const ch of chuoi) {
    if (ch.khong_dau_bang || ch.tim_x) continue
    for (const o of timO(ch)) {
      const mk = ch.manh[o.k], mp = ch.manh[o.k - 1]
      const tok = timToken(mk.raw, o.v); if (!tok) { loai.push(`${o.v}: không tìm thấy token trong "${mk.raw.slice(0, 40)}"`); continue }
      if (trongDe.has(o.v)) { loai.push(`${o.v}: có sẵn trong đề`); continue }
      const key = ev(o.n, { rule: null }); if (!key) continue
      let flat = null; if (o.ca_manh) { try { flat = parse(chuanManh(mp.raw), true) } catch { flat = null } }
      const kieuKey = kieuToken(tok.token), duong = key.p > 0n
      const seen = new Set([o.v]), ds = []
      const root = strip(o.n)
      for (const r of order) {
        // R05 (lệch 1 đơn vị) chỉ có nghĩa với số nhỏ (kg, số lượng) — tiền 600001 là vô nghĩa
        if (r === 'R05' && !(key.q === 1n ? key.p < 1000n : true)) continue
        // R52 "nhân thành cộng" với thừa số là số đếm nhỏ (2·45000 → 45002) vô nghĩa — chỉ giữ khi cả 2 thừa số > 10
        if (r === 'R52' && root.t === 'bin' && root.op === '*') { const a = ev(root.a, { rule: null }), b = ev(root.b, { rule: null }); if (!a || !b || a.p * b.q <= 10n * a.q || b.p * a.q <= 10n * b.q) continue }
        let res; try { res = RULE_THEM.has(r) ? ruleThem(o.n, r, key) : evalRule(o.n, flat, r) } catch { res = null }
        if (!res || !res.v || Array.isArray(res.v)) continue
        let v = res.v, c = canonOf(v)
        if (seen.has(c) && res.alt) { v = res.alt; c = canonOf(v) }
        if (seen.has(c)) continue
        if (duong && v.p <= 0n) continue // tiền/kg/số lượng âm hoặc 0 — không phải lỗi "có nghĩa"
        seen.add(c)
        const t = fmtNhu(tok.token, v)
        ds.push({ r, v, c, text: t, kieu: kieuToken(t), ds: res.fired || DS[r] || DS_THEM[r] })
      }
      // chọn 3: ≥1 cùng kiểu với key (bắt buộc), ≤1 dự phòng, xoay vòng theo số lần đã dùng trong lô (như mcq-auto)
      const byXoay = (a, b) => (ruleUsed[a.r] ?? 0) - (ruleUsed[b.r] ?? 0) || order.indexOf(a.r) - order.indexOf(b.r)
      const chinh = ds.filter((d) => !DU_PHONG.has(d.r)), dp = ds.filter((d) => DU_PHONG.has(d.r))
      const pick = []
      const okAdd = (d) => pick.length < 3 && !(DU_PHONG.has(d.r) && pick.filter((p) => DU_PHONG.has(p.r)).length >= 2) && !(d.kieu !== kieuKey && pick.length === 2 && !pick.some((p) => p.kieu === kieuKey))
      const cungKieu = [...chinh].filter((d) => d.kieu === kieuKey).sort(byXoay)[0]; if (cungKieu) pick.push(cungKieu)
      for (const d of chinh.filter((d) => d !== cungKieu).sort(byXoay)) if (okAdd(d)) pick.push(d)
      for (const d of dp.sort(byXoay)) if (okAdd(d)) pick.push(d)
      if (debug) console.log(`  ô ${o.v} @dòng${mk.dong + 1} tok="${tok.token}" tính_từ=${texNode(o.n)} → ${ds.map((d) => `${d.r}=${d.c}`).join(' ')}  → chọn ${pick.map((d) => d.r).join(',')}`)
      if (pick.length < 3 || !pick.some((p) => p.kieu === kieuKey) || !pick.some((p) => !DU_PHONG.has(p.r))) { loai.push(`${o.v}: chỉ ${pick.length} distractor (${ds.map((d) => d.r + '=' + d.c).join(',')})`); continue }
      cands.push({ vi_tri: 'buoc', v: o.v, key, n: o.n, tok, start: mk.start + tok.start, end: mk.start + tok.end, dong: mk.dong, pick })
    }
  }
  if (!cands.length) return { bo: `không có ô đủ distractor${loai.length ? ' — ' + loai.slice(0, 3).join(' · ') : ''}` }
  // chọn ≤3 ô: theo thứ tự xuất hiện, giá trị khác nhau; ô CUỐI (đáp số của cả bài) chỉ lấy khi còn chỗ (spec §1)
  cands.sort((a, b) => a.start - b.start)
  const cuoi = khuon ? null : cands[cands.length - 1] // khuôn riêng tự quyết ô nào, không áp luật "ô cuối = đáp số"
  const chon = [], seenV = new Set()
  // CEO 12/09 tối: form LƯU HẾT mọi chỗ có thể điền (trần DB 8), lúc GIAO BÀI mới chọn 3 ô (tối đa 4, fn_dien_cau_hinh) xoay vòng theo
  // vị trí — "giết nhầm còn hơn bỏ sót", để sau này thống kê HS hay sai ở vị trí nào. Ô cuối (đáp số) vẫn xếp sau cùng.
  const MAX_O = 8
  for (const c of cands) { if (cuoi && c === cuoi && cands.length > 1) continue; if (chon.length >= MAX_O || seenV.has(c.v)) continue; chon.push(c); seenV.add(c.v) }
  if (cuoi && chon.length < MAX_O && !seenV.has(cuoi.v)) chon.push(cuoi)
  if (chon.length < 2) return { bo: `chỉ ${chon.length} ô đủ distractor (cần ≥2)${loai.length ? ' — ' + loai.slice(0, 3).join(' · ') : ''}` }
  chon.sort((a, b) => a.start - b.start)
  // đục lỗ trên văn bản gốc (offset tuyệt đối, từ cuối về đầu) rồi tách dòng thành bước
  let t2 = text
  for (let i = chon.length - 1; i >= 0; i--) t2 = t2.slice(0, chon[i].start) + `⟦o${i + 1}⟧` + t2.slice(chon[i].end)
  const lines = t2.split('\n').map((l, i) => ({ i, l })).filter((x) => x.l.trim())
  const buoc = lines.map((x, j) => ({ k: j + 1, text: x.l }))
  const o = chon.map((c, i) => {
    for (const p of c.pick) ruleUsed[p.r] = (ruleUsed[p.r] ?? 0) + 1
    const pos = L.reduce((mm, l) => ((counts[l] ?? 0) < (counts[mm] ?? 0) ? l : mm), 'A'); counts[pos] = (counts[pos] ?? 0) + 1
    const pi = L.indexOf(pos); const pk = [...c.pick].sort((a, b) => order.indexOf(a.r) - order.indexOf(b.r))
    const phuong_an = []; let di = 0
    for (let j = 0; j < 4; j++) phuong_an.push(j === pi ? { text: `$${c.tok.token}$`, dung: true } : { text: `$${pk[di].text}$`, dung: false, rule: pk[di].r, duong_sai: pk[di++].ds })
    return { id: `o${i + 1}`, vi_tri: c.vi_tri ?? 'buoc', kieu: c.kieu ?? 'gia_tri', buoc: lines.findIndex((x) => x.i === c.dong) + 1, key: c.tok.token, key_gia_tri: c.v, tinh_tu: c.tinh_tu ?? texNode(c.n), dap_an: pos, phuong_an }
  })
  return { item: { ma_cau: q.ma_cau, dang_chinh: q.dang_chinh, loi_giai_bam: md5(q.loi_giai), buoc, o } }
}

// ── DB ──────────────────────────────────────────────────────────────────────────────────────────────────────
const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20000 }); await c.connect()
try {
  const coBang = !!(await c.query(`select to_regclass('${TBL}') t`)).rows[0].t
  async function cauTuDb(where, params) {
    return (await c.query(`select q.ma_cau, q.dang_chinh, b.ten_dang, q.noi_dung, q.dap_an, q.loi_giai from dai_cau_hoi q left join dai_ban_do b on b.ma_dang = q.dang_chinh
      where q.xoa_at is null and q.da_duyet and q.loi_giai is not null and q.lua_chon is null and q.menh_de is null and ${where}
      ${coBang && !has('--lai') ? `and not exists (select 1 from ${TBL} f where f.ma_cau = q.ma_cau and f.xoa_at is null)` : ''} order by q.dang_chinh, q.ma_cau`, params)).rows
    // --lai: sinh LẠI cả câu đã có form (đổi cách chia sau khi CEO duyệt) — chỉ để xem/verify; --ghi vẫn bỏ qua câu đã có form hiệu lực
  }
  async function rules() { return new Map((await c.query('select ma, ten, du_phong from dai_mcq_rule where active')).rows.map((r) => [r.ma, r])) }
  async function phanBoDb() { const pb = Object.fromEntries(L.map((l) => [l, 0])); if (coBang) for (const r of (await c.query(`select x->>'dap_an' d, count(*)::int n from ${TBL} f, jsonb_array_elements(f.o) x where f.xoa_at is null group by 1`)).rows) pb[r.d] = r.n; return pb }

  if (has('--sinh')) {
    const dangs = opt('--dang') ? opt('--dang').split(',') : POOL_TT, n = Number(opt('--n', 500)), debug = opt('--debug')
    const rows = await cauTuDb('q.dang_chinh = any($1) and ($2::text is null or q.ma_cau = $2)', [dangs, debug ?? null])
    const counts = await phanBoDb(), ruleUsed = {}, out = [], bo = []
    for (const q of rows.slice(0, n)) {
      if (debug) console.log(`\n${q.ma_cau}\n${q.loi_giai}`)
      const r = sinhCau(q, counts, ruleUsed, !!debug)
      if (r.bo) bo.push([q.ma_cau, r.bo]); else out.push(r.item)
    }
    for (const [m, ly] of bo) out.push({ ma_cau: m, bo: ly })
    if (!debug) { writeFileSync(opt('--out', 'kq.json'), JSON.stringify(out, null, 1), 'utf8'); console.log('→', opt('--out', 'kq.json')) }
    else console.log(JSON.stringify(out, null, 1))
    const nO = out.filter((x) => !x.bo).reduce((s, x) => s + x.o.length, 0)
    console.log(`Sinh ${out.length - bo.length} câu · ${nO} ô · bỏ ${bo.length} · phân bố đúng ${JSON.stringify(counts)} · rule dùng ${JSON.stringify(ruleUsed)}`)
    for (const [m, ly] of bo) console.log(`  BỎ ${m}: ${ly}`)
  } else if (has('--verify')) { const r = await verify(opt('--verify')); process.exitCode = r.fail ? 1 : 0 }
  else if (has('--xem')) await xem(opt('--xem'), opt('--out', 'dien.html'))
  else if (has('--ghi')) await ghi(opt('--ghi'))
  else if (has('--thu-hoi')) await thuHoi(opt('--dang'))
  else console.log('Dùng: --sinh [--lai] [--dang X,Y] [--n N] --out kq.json [--debug ma_cau] | --verify kq.json | --xem kq.json --out f.html | --ghi kq.json [--model m] | --thu-hoi --dang X')

  // ── VERIFY: kiểm lại từ DB, không tin file ──────────────────────────────────────────────────────────────────
  async function verify(file, quiet = false) {
    const items = JSON.parse(readFileSync(file, 'utf8'))
    const ruleMap = await rules()
    const mas = items.map((x) => x.ma_cau)
    const { rows } = await c.query(`select q.ma_cau, q.dang_chinh, q.noi_dung, q.dap_an, q.loi_giai from dai_cau_hoi q where q.ma_cau = any($1) and q.xoa_at is null and q.da_duyet`, [mas]) // dap_an: khuôn riêng cần làm nhân chứng thứ hai
    const db = new Map(rows.map((r) => [r.ma_cau, r]))
    let ok = 0, fail = 0, boN = 0; const pass = [], pb = Object.fromEntries(L.map((l) => [l, 0]))
    for (const it of items) {
      if (it.bo) { boN++; continue }
      const err = kiemCau(it, db.get(it.ma_cau), ruleMap)
      if (err.length) { fail++; console.log(`FAIL ${it.ma_cau}\n  - ${err.join('\n  - ')}`) }
      else { ok++; pass.push(it); for (const o of it.o) pb[o.dap_an]++; if (!quiet) console.log(`OK   ${it.ma_cau}  ${it.o.length} ô  ${it.o.map((o) => o.dap_an + ':' + o.phuong_an.filter((p) => !p.dung).map((p) => p.rule).join('/')).join('  ')}`) }
    }
    const max = Math.max(...Object.values(pb)), tong = Object.values(pb).reduce((a, b) => a + b, 0)
    const lech = tong >= 8 && max / tong > 0.4
    console.log(`\n${ok} OK · ${fail} FAIL · ${boN} bỏ · vị trí đúng ${JSON.stringify(pb)}${lech ? '  ⚠ LỆCH >40%' : ''}`)
    return { pass, fail: fail + (lech ? 1 : 0) }
  }
  function kiemCau(it, q, ruleMap) {
    const err = []
    if (!q) return ['không có trong kho / chưa duyệt cửa 1']
    if (it.loi_giai_bam !== md5(q.loi_giai)) return ['lời giải trong kho đã đổi so với lúc sinh (vân tay lệch)']
    if (!Array.isArray(it.o) || it.o.length < 2 || it.o.length > 8) return ['phải 2–8 ô']
    if (!Array.isArray(it.buoc) || !it.buoc.length) return ['thiếu buoc']
    // ghép ⟦oN⟧ ← key phải ra NGUYÊN VĂN lời giải (dòng không trống)
    const goc = tachChuoi(q.loi_giai).text.split('\n').filter((l) => l.trim())
    let ghep = it.buoc.map((b) => b.text)
    for (const o of it.o) ghep = ghep.map((l) => l.split(`⟦${o.id}⟧`).join(o.key))
    if (ghep.length !== goc.length || ghep.some((l, i) => l !== goc[i])) err.push('ghép key vào ⟦oN⟧ không ra nguyên văn lời giải')
    const allText = it.buoc.map((b) => b.text).join('\n')
    // nhân chứng thứ hai: bộ đọc tìm lại ứng viên ô từ lời giải kho
    // nhân chứng thứ hai: bộ đọc (chung hoặc khuôn riêng của dạng) tìm lại ứng viên ô từ lời giải kho
    const khuon = KHUON[q.dang_chinh]
    const { chuoi } = tachChuoi(q.loi_giai)
    const ungVien = khuon ? new Set(khuon(q, { ruleUsed: {}, loai: [] }).map((c) => c.v))
      : new Set(chuoi.filter((ch) => !ch.khong_dau_bang && !ch.tim_x).flatMap((ch) => timO(ch).map((o) => o.v)))
    const trongDe = soTrongDe(q.noi_dung)
    const vs = new Set()
    it.o.forEach((o, i) => {
      const p = `ô${i + 1}`, qh = o.kieu === 'quan_he' || o.kieu === 'tap'
      if (o.id !== `o${i + 1}`) err.push(`${p}: id phải o${i + 1}`)
      if (!o.vi_tri) err.push(`${p}: thiếu vi_tri`)
      if ((allText.match(new RegExp(`⟦${o.id}⟧`, 'g')) || []).length !== 1) err.push(`${p}: ⟦${o.id}⟧ phải xuất hiện đúng 1 lần trong buoc`)
      if (!it.buoc[o.buoc - 1] || !it.buoc[o.buoc - 1].text.includes(`⟦${o.id}⟧`)) err.push(`${p}: buoc=${o.buoc} không chứa ⟦${o.id}⟧`)
      if (!qh) { let kv = null; try { kv = val(parse(chuanManh(o.key))) } catch {}; if (kv !== o.key_gia_tri) err.push(`${p}: key "${o.key}" tính ra ${kv} ≠ key_gia_tri ${o.key_gia_tri}`) }
      if (!ungVien.has(o.key_gia_tri)) err.push(`${p}: ${o.key_gia_tri} không phải ô ứng viên theo bộ đọc`)
      if (!khuon && trongDe.has(o.key_gia_tri)) err.push(`${p}: giá trị có sẵn trong đề`)
      if (vs.has(o.key_gia_tri)) err.push(`${p}: trùng giá trị với ô khác`); vs.add(o.key_gia_tri)
      const pa = o.phuong_an
      if (!Array.isArray(pa) || pa.length !== 4) { err.push(`${p}: phải 4 phương án`); return }
      const dungIdx = pa.map((x, j) => (x.dung ? j : -1)).filter((j) => j >= 0)
      if (dungIdx.length !== 1) err.push(`${p}: phải đúng 1 phương án dung=true`)
      else if (L[dungIdx[0]] !== o.dap_an) err.push(`${p}: dap_an=${o.dap_an} lệch vị trí dung (${L[dungIdx[0]]})`)
      else if (pa[dungIdx[0]].text !== `$${o.key}$`) err.push(`${p}: phương án đúng ≠ $key$`)
      if (qh) { // ô quan hệ: so TEXT (không có giá trị số), 4 phương án khác nhau đôi một
        const ts = pa.map((x) => String(x.text).replace(/\s+/g, ''))
        for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) if (ts[a] === ts[b]) err.push(`${p}: ${L[a]} và ${L[b]} trùng text`)
      } else {
        const vals = pa.map((x) => { try { return val(parse(chuanManh(String(x.text).replace(/^\$|\$$/g, '')))) } catch { return null } })
        vals.forEach((v, j) => { if (!v) err.push(`${p}: phương án ${L[j]} không parse được`) })
        for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) if (vals[a] && vals[a] === vals[b]) err.push(`${p}: ${L[a]} và ${L[b]} cùng giá trị ${vals[a]}`)
        const kieu = pa.map((x) => kieuToken(String(x.text)))
        if (dungIdx.length === 1 && kieu.filter((k) => k === kieu[dungIdx[0]]).length < 2) err.push(`${p}: đáp án đúng là hình thức duy nhất (${kieu.join('/')})`)
      }
      const rs = pa.filter((x) => !x.dung).map((x) => x.rule)
      rs.forEach((r, j) => { if (!r || !ruleMap.has(r)) err.push(`${p}: distractor ${j + 1} thiếu rule / rule không tồn tại trong DB (${r})`) })
      if (new Set(rs).size !== rs.length) err.push(`${p}: 3 distractor phải 3 rule khác nhau`)
      if (rs.filter((r) => ruleMap.get(r)?.du_phong).length > 2) err.push(`${p}: quá 2 rule dự phòng`)
      if (rs.length === 3 && rs.every((r) => ruleMap.get(r)?.du_phong)) err.push(`${p}: không có rule chính nào`)
      pa.filter((x) => !x.dung).forEach((x, j) => { if (!x.duong_sai || String(x.duong_sai).trim().length < 8) err.push(`${p}: distractor ${j + 1} thiếu duong_sai`) })
    })
    return err
  }

  // ── XEM: HTML tự chứa (KaTeX nhúng) — ô cam, 4 phương án, xanh = đúng, đỏ = rule + đường sai ──────────────
  async function xem(file, outFile) {
    const items = JSON.parse(readFileSync(file, 'utf8')).filter((x) => !x.bo)
    const { katexCss, mathHtml, esc } = await import('./lib/html-tu-chua.mjs')
    const ruleMap = await rules()
    const mas = items.map((x) => x.ma_cau)
    const { rows } = await c.query(`select q.ma_cau, q.dang_chinh, b.ten_dang, q.noi_dung, q.dap_an from dai_cau_hoi q left join dai_ban_do b on b.ma_dang = q.dang_chinh where q.ma_cau = any($1)`, [mas])
    const db = new Map(rows.map((r) => [r.ma_cau, r]))
    const blocks = items.map((it, idx) => {
      const q = db.get(it.ma_cau) ?? {}
      // 1 bước có thể chứa NHIỀU ô ("… = ⟦o1⟧ = ⟦o2⟧") — gom theo bước, thay hết placeholder, liệt kê phương án từng ô
      const byBuoc = new Map(); for (const o of it.o) byBuoc.set(o.buoc, [...(byBuoc.get(o.buoc) ?? []), o])
      const buocHtml = it.buoc.map((b) => {
        const os = byBuoc.get(b.k) ?? []
        let raw = b.text
        for (const o of os) { const i = raw.indexOf(`⟦${o.id}⟧`); const trongMath = i >= 0 && (raw.slice(0, i).match(/\$/g) || []).length % 2 === 1; raw = raw.replace(`⟦${o.id}⟧`, trongMath ? `\\boxed{\\;?_{${o.id.slice(1)}}\\;}` : `⟦ ?${o.id.slice(1)} ⟧`) }
        const pa = os.map((o) => `<div class="m">ô ${o.id} · vị trí <b>${esc(o.vi_tri ?? '')}</b> · ${mathHtml('$' + o.tinh_tu + '$')} = ${esc(o.key_gia_tri)}</div><div class="pa">${o.phuong_an.map((p, i) => `<span>${L[i]}.</span><span class="${p.dung ? 'd' : ''}">${mathHtml(p.text)}${p.dung ? ' ✓' : ` <span class="loi">${esc(p.rule)} · ${esc(ruleMap.get(p.rule)?.ten ?? RULE_QH[p.rule] ?? RULE_ANCND[p.rule] ?? RULE_LUYTHUA[p.rule] ?? RULE_HIEUTICH[p.rule] ?? RULE_BDT[p.rule] ?? '')} — ${esc(p.duong_sai)}</span>`}</span>`).join('')}</div>`).join('')
        return `<div class="buoc${os.length ? ' o' : ''}">${mathHtml(raw)}${pa}</div>`
      }).join('')
      return `<div class="bai"><div class="m">${idx + 1}. ${esc(it.ma_cau)} · ${esc(q.ten_dang ?? it.dang_chinh)} · đáp số kho: <code>${esc(q.dap_an)}</code> · ${it.o.length} ô (${it.o.map((o) => o.dap_an).join('')})</div><div class="de">${mathHtml(q.noi_dung)}</div>${buocHtml}</div>`
    })
    const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Điền ô — ${items.length} câu</title>
<style>${katexCss()}
body{font:15px/1.5 system-ui;max-width:1000px;margin:24px auto;padding:0 16px}.bai{border:1px solid #ddd;border-radius:10px;padding:14px 16px;margin:14px 0}.m{color:#777;font-size:12px}
.de{background:#f7f7fa;padding:8px 10px;border-radius:6px;margin:6px 0;white-space:pre-line}.buoc{margin:3px 0;padding-left:10px;border-left:3px solid #eee}.buoc.o{border-left-color:#e67e22;background:#fff8f0}
.pa{display:grid;grid-template-columns:24px 1fr;gap:2px 8px;margin:4px 0 4px 18px;font-size:14px}.pa .d{background:#e8f7ec}.pa .loi{color:#a33;font-size:12px}</style></head><body>
<h1>Điền ô (trắc nghiệm từng phần) — ${items.length} câu (máy sinh, chờ CEO duyệt)</h1>
<p class="m">Ô cam = MỌI chỗ có thể điền của câu (form lưu hết; lúc giao bài HS chỉ gặp 3 ô, tối đa 4, xoay vòng theo vị trí). Xanh = đáp án đúng. Đỏ = rule + đường sai (staff thấy, HS không). HS thấy các bước lần lượt, đến ô nào hiện đúng/sai ô đó.</p>
${blocks.join('\n')}
</body></html>`
    writeFileSync(outFile, html, 'utf8'); console.log('→', outFile, `(${Math.round(html.length / 1024)} KB, ${items.length} câu)`)
  }

  // ── THU HỒI form CHƯA DUYỆT của 1 dạng (kho rác xoa_at, không delete) — dùng khi CEO đổi cách chia, trước khi --ghi lại ──
  async function thuHoi(dang) {
    if (!dang) { console.error('✖ --thu-hoi cần --dang X'); process.exitCode = 1; return }
    const r = await c.query(`update ${TBL} f set xoa_at = now(), tu_choi_ly_do = coalesce(f.tu_choi_ly_do, '') || ' [thu hồi: sinh lại theo cách chia mới]'
      from dai_cau_hoi q where q.ma_cau = f.ma_cau and q.dang_chinh = any($1) and f.xoa_at is null and not f.da_duyet returning f.ma_cau`, [dang.split(',')])
    console.log(`Đã thu hồi ${r.rowCount} form chưa duyệt của dạng ${dang} (xoa_at, không xoá dòng).`)
  }

  // ── GHI ─────────────────────────────────────────────────────────────────────────────────────────────────────
  async function ghi(file) {
    if (!coBang) { console.error(`✖ Bảng ${TBL} chưa có — áp migration trước (npm run migrate).`); process.exitCode = 1; return }
    const model = opt('--model', 'may:mcq-dien')
    const { pass, fail } = await verify(file, true)
    if (fail) { console.error('\n✖ Có câu FAIL hoặc phân bố lệch — sửa rồi chạy lại. KHÔNG ghi.'); process.exitCode = 1; return }
    let n = 0, skip = 0
    for (const it of pass) {
      await c.query('begin')
      try {
        const r = await c.query(`insert into ${TBL} (ma_cau, loi_giai_bam, buoc, o, nguon, ai_model)
          select $1, $2, $3::jsonb, $4::jsonb, 'ai', $5 where not exists (select 1 from ${TBL} f where f.ma_cau = $1 and f.xoa_at is null) returning id`,
          [it.ma_cau, it.loi_giai_bam, JSON.stringify(it.buoc), JSON.stringify(it.o), model])
        await c.query('commit'); if (r.rowCount) n++; else skip++
      } catch (e) { await c.query('rollback'); console.error(`✖ ${it.ma_cau}: ${e.message}`); process.exitCode = 1 }
    }
    console.log(`\nĐã ghi ${n} form (da_duyet=false) · bỏ qua ${skip} câu đã có form.`)
  }
} finally { await c.end() }
