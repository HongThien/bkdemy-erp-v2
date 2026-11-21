// ============================================================================
// k8-fill.mjs — fill kho Đại K8 (spec-giai-bai §C13) + sửa 5 câu clone sai đáp án phát hiện khi rà NDB00982 (21/11).
//   NDB00982 (độ khó 3): đích 30 · NDB00983 (độ khó 5): đã 13, rà đáp án đúng hết, giữ nguyên · NDB01427 (độ khó 4): 12 câu · NDB01356: hình đề (phiên vẽ hình).
//
//   node scripts/kho/clone/k8-fill.mjs moi  [--ghi]    # bài lẻ soạn bù (NDB00982 · NDB01427)
//   node scripts/kho/clone/k8-fill.mjs sua  [--ghi]    # sửa đáp án + lời giải 5 câu clone sai (Phần D)
//   node scripts/kho/clone/k8-fill.mjs thu [--in]      # chỉ chạy bộ kiểm
// ============================================================================
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
import { xetGoi, bamNoiDung } from '../cong-ghi.mjs'
import { insertCauBatch } from '../../_kho_insert.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const env = Object.fromEntries(readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const [LENH = 'moi', ...args] = process.argv.slice(2)
const GHI = args.includes('--ghi')
const LG = (chot, buoc, trinhBay) => `**Phần 1. Hướng dẫn**\n\n**Mấu chốt:** ${chot}\n\n${buoc.map((b, i) => `**Bước ${i + 1}.** ${b}`).join('\n\n')}\n\n**Phần 2. Trình bày**\n\n${trinhBay.join('\n\n')}`
const ngoac = (n) => (n < 0 ? `(${n})` : `${n}`)

// ═════════════════ NDB00982 — phân tích đa thức bậc 3 bằng cách nhẩm nghiệm ═══════════════════════════════════════
const lin = (r) => (r === 0 ? 'x' : r > 0 ? `x-${r}` : `x+${-r}`)
const hs = (c, body) => (c === 1 ? body : c === -1 ? `-${body}` : `${c}${body}`)
function poly(cs) { // [1,b,c,d] → x^3+bx^2+cx+d
  const n = cs.length - 1; let s = ''
  cs.forEach((c, i) => { if (!c) return; const k = n - i, body = k === 0 ? `${Math.abs(c)}` : k === 1 ? 'x' : `x^${k}`; const a = Math.abs(c)
    const t = k === 0 ? `${a}` : (a === 1 ? body : `${a}${body}`); s += (s === '' ? (c < 0 ? '-' : '') : c < 0 ? '-' : '+') + t })
  return s
}
const evalStr = (cs, r) => { const n = cs.length - 1; const p = []; cs.forEach((c, i) => { if (!c) return; const k = n - i, base = k === 0 ? '' : k === 1 ? ngoac(r) : `${ngoac(r)}^${k}`; p.push(k === 0 ? `${c}` : c === 1 ? base : c === -1 ? `-${base}` : `${c}.${base}`) }); return p.join('+').replace(/\+-/g, '-') }
const val = (cs, r) => cs.reduce((s, c) => s * r + c, 0)
const uocSo = (n) => { const u = []; for (let i = 1; i <= Math.abs(n); i++) if (n % i === 0) u.push(i); return u }
function giaiBac3(cs) { // cs=[1,b,c,d], d≠0
  const [, b, c, d] = cs, f = poly(cs)
  const ung = d === 0 ? [0] : uocSo(d).flatMap((u) => [u, -u]); let r = null; const thu = []
  for (const u of ung) { const v = val(cs, u); if (v === 0) { r = u; break } thu.push([u, v]) }
  if (r === null) throw new Error('không có nghiệm nguyên: ' + f)
  const p = b + r, q = c + r * p, dl = p * p - 4 * q
  const qd = `x^2${p === 0 ? '' : p > 0 ? `+${p === 1 ? '' : p}x` : `${p === -1 ? '-' : p}x`}${q === 0 ? '' : q > 0 ? `+${q}` : `${q}`}`
  const nghiemNguyen = [r]; let dong = []; let ketQuaTxt
  const hon = []
  if (dl >= 0 && Number.isInteger(Math.sqrt(dl))) {
    const s = (-p + Math.sqrt(dl)) / 2, t = (-p - Math.sqrt(dl)) / 2
    dong.push(`Phân tích $${qd}=(${lin(s)})(${lin(t)})$.`, `Do đó $f(x)=(${lin(r)})(${lin(s)})(${lin(t)})=0$.`)
    nghiemNguyen.push(s, t)
  } else if (dl < 0) {
    const bp = p % 2 === 0 ? `(x${p / 2 >= 0 ? '+' : ''}${p / 2 === 0 ? '' : p / 2})^2+${q - (p * p) / 4}` : `\\left(x+\\dfrac{${p}}{2}\\right)^2+\\dfrac{${4 * q - p * p}}{4}`
    dong.push(`Với $${qd}$: ${p % 2 === 0 ? `$${qd}=${bp}$` : `$${qd}=${bp}$`} và biểu thức này luôn dương (vì bình phương $\\ge 0$ cộng một số dương) nên $${qd}=0$ vô nghiệm.`.replace('$$', '$').replace(/\$\$/g, '$'), `Do đó $f(x)=(${lin(r)})(${qd})=0$ chỉ khi $${lin(r)}=0$.`)
  } else {
    const cd = Math.sqrt(dl); void cd
    dong.push(`Với $${qd}=0$ có $\\Delta=${p}^2-4.${ngoac(q)}=${dl}>0$ (không là số chính phương) nên có hai nghiệm $x=\\dfrac{${-p}+\\sqrt{${dl}}}{2}$ và $x=\\dfrac{${-p}-\\sqrt{${dl}}}{2}$.`, `Do đó $f(x)=(${lin(r)})(${qd})=0$.`)
    hon.push(`x = \\dfrac{${-p}+\\sqrt{${dl}}}{2}`, `x = \\dfrac{${-p}-\\sqrt{${dl}}}{2}`)
  }
  const dist = [...new Set(nghiemNguyen)].sort((x, y) => x - y)
  const tat = [...dist.map((x) => `x = ${x}`), ...hon]
  const dapAn = tat.length === 1 ? `${dist[0]}` : `$${tat.join('; ')}$`
  ketQuaTxt = `Vậy phương trình có nghiệm ${tat.length === 1 ? `$x=${dist[0]}$` : `$${tat.join('; ')}$`}.`
  const thuDong = thu.map(([u, v]) => `Thử $x=${u}$: $f(${u})=${evalStr(cs, u)}=${v}\\ne 0$.`)
  return {
    dap_an: dapAn, nghiem: dist, hon: hon.length,
    loi_giai: LG('đa thức có hệ số nguyên và có nghiệm nguyên thì nghiệm đó là **ước của hệ số tự do**; nhẩm tìm nghiệm $r$, tách thừa số $(x-r)$ rồi phân tích phần còn lại để chia các trường hợp.', [
      'Đặt $f(x)$ là vế trái, thử các ước của hệ số tự do (cả số dương và số âm) cho đến khi $f(x)=0$.', 'Có nghiệm $r$ thì $f(x)$ chia hết cho $(x-r)$: chia đa thức để được thương bậc hai.', 'Phân tích thương bậc hai (nếu được) hoặc chứng tỏ nó vô nghiệm / tìm nghiệm của nó.', 'Cho từng nhân tử bằng $0$ rồi kết luận.'], [
      `Đặt $f(x)=${f}$.`, ...thuDong, `Thử $x=${r}$: $f(${r})=${evalStr(cs, r)}=0$ nên $x=${r}$ là nghiệm, suy ra $f(x)$ chia hết cho $(${lin(r)})$.`,
      `Chia $f(x)$ cho $(${lin(r)})$ ta được thương $${qd}$, tức $f(x)=(${lin(r)})(${qd})$.`, ...dong, ketQuaTxt]),
  }
}
const heSo = (r1, r2, r3) => { const [a, b, c] = [r1, r2, r3]; return [1, -(a + b + c), a * b + a * c + b * c, -a * b * c] }
const nhan3 = (r, p, q) => [1, p - r, q - r * p, -r * q]                           // (x-r)(x²+px+q)
const MOI_00982 = [
  ...[[-4, 1, 3], [-2, -1, 4], [-5, 1, 2], [-3, 1, 4], [-4, 2, 3]].map((r) => heSo(...r)),
  ...[[2, -1], [1, 3], [-2, 1], [3, -2]].map(([a, s]) => { const cs = heSo(a, a, s); return cs }),
  ...[[2, 2, 3], [-2, -1, 2], [3, 2, 5]].map(([r, p, q]) => nhan3(r, p, q)),
].map((cs) => { const g = giaiBac3(cs); return { noi_dung: `Tìm $x$, biết: $${poly(cs)}=0$.`, dap_an: g.dap_an, loai: 'tra_loi_ngan', loi_giai: g.loi_giai, cs } })

// ═════════════════ NDB01427 — tìm (x;y) nguyên: đưa về tích bằng một số ═══════════════════════════════════════════
const tx = (c, v) => (c === 0 ? '' : c === 1 ? `+${v}` : c === -1 ? `-${v}` : c > 0 ? `+${c}${v}` : `${c}${v}`)
const ct = (k) => (k === 0 ? '' : k > 0 ? `+${k}` : `${k}`)
const uocDau = (N) => { const u = []; for (let i = 1; i <= Math.abs(N); i++) if (N % i === 0) u.push(i, -i); return u.sort((x, y) => x - y) }
function tichXY(a, b, N, kieu) { // (x+a)(y+b)=N
  const goc = kieu === 0 ? `xy${tx(b, 'x')}${tx(a, 'y')}${ct(a * b)}` : `xy${tx(b, 'x')}${a > 0 ? '+' : '-'}${Math.abs(a)}(y${ct(b)})`
  const nhom = kieu === 0 ? `x(y${ct(b)})${a > 0 ? '+' : '-'}${Math.abs(a)}(y${ct(b)})` : null
  const fx = `x${ct(a)}`, fy = `y${ct(b)}`
  const sol = uocDau(N).map((u) => [u - a, N / u - b, u]).sort((p, q) => p[0] - q[0])
  const dap = sol.map(([x, y]) => `(${x};${y})`).join(';')
  return {
    noi_dung: `Tìm các số nguyên $x,\\ y$ thoả mãn đẳng thức $${goc}=${N}$.`, dap_an: `$(x;y)\\in\\{${dap}\\}$`, loai: 'tra_loi_ngan',
    loi_giai: LG('nhóm các hạng tử để đưa vế trái về tích hai nhân tử chứa $x$ và $y$, vế phải là một số nguyên; mỗi nhân tử là ước của số đó.', [
      'Nhóm hạng tử và đặt nhân tử chung để vế trái thành tích $(x+a)(y+b)$.', 'Vì $x,y$ nguyên nên hai nhân tử là các số nguyên có tích bằng số đã cho: liệt kê các ước (cả số dương và số âm).', 'Lập bảng các trường hợp, tìm $x$ và $y$ tương ứng rồi kết luận.'], [
      `Ta có $${goc}=${nhom ?? `x(y${ct(b)})${a > 0 ? '+' : '-'}${Math.abs(a)}(y${ct(b)})`}=(${fx})(${fy})$.`,
      `Do đó $(${fx})(${fy})=${N}$. Vì $x,\\ y\\in\\mathbb{Z}$ nên $${fx}$ và $${fy}$ là các ước của $${N}$ có tích bằng $${N}$.`,
      `Ta có $\\text{Ư}(${N})=\\{${uocDau(N).join(';')}\\}$.`,
      ...sol.map(([x, y, u]) => `Với $${fx}=${u}$ thì $x=${u}${a > 0 ? '-' : '+'}${Math.abs(a)}=${x}$ và $${fy}=${N}:${ngoac(u)}=${N / u}$ nên $y=${N / u}${b > 0 ? '-' : '+'}${Math.abs(b)}=${y}$.`),
      `Vậy $(x;y)\\in\\{${dap}\\}$.`]),
  }
}
const MOI_01427 = [[2, -1, 11, 0], [2, -1, 13, 1], [3, -2, 7, 0], [-1, 2, 5, 1], [4, 1, 15, 0], [1, -3, 13, 0], [3, 2, 21, 1], [-2, 3, 17, 0], [5, -1, 6, 1], [-3, -1, 10, 0], [2, 3, 14, 1], [1, 4, 9, 0]].map((x) => tichXY(...x))

// ═════════════════ bộ kiểm ĐỘC LẬP ═════════════════════════════════════════════════════════════════════════════════
const bo = (s) => String(s ?? '').replace(/\$/g, '').replace(/\\ /g, ' ').replace(/\s+/g, ' ').trim()
const parsePoly = (s) => { // "x^3-4x+3" → hệ số bậc 3..0
  const t = bo(s).replace(/\s/g, ''); const cs = [0, 0, 0, 0]; const re = /([+-]?)(\d*)(x(?:\^(\d))?)?/g; let m, dem = 0
  const u = /^[+-]/.test(t) ? t : `+${t}`
  const r2 = /([+-])(\d*)(x(?:\^(\d))?)?/g
  while ((m = r2.exec(u)) !== null) { if (m[0] === '') { r2.lastIndex++; continue } const k = m[3] ? (m[4] ? +m[4] : 1) : 0, c = (m[2] === '' ? (m[3] ? 1 : 0) : +m[2]) * (m[1] === '-' ? -1 : 1); if (k > 3) return null; cs[3 - k] += c; dem++ }
  void re; return dem ? cs : null
}
const nghiemThuc = (cs) => { const f = (t) => ((cs[0] * t + cs[1]) * t + cs[2]) * t + cs[3]; const ints = []; for (let t = -300; t <= 300; t++) if (f(t) === 0) ints.push(t)
  let extra = 0; for (let t = -300; t < 300; t += 0.005) { const a = f(t), b = f(t + 0.005); if (a * b < 0 && !ints.some((i) => i >= t - 1e-9 && i <= t + 0.005 + 1e-9)) extra++ } return { ints, extra } }
const KIEM = {
  NDB00982: (nd, da) => {
    const m = bo(nd).match(/^Tìm x, biết: (.+) = ?0\.?$/) ?? bo(nd).match(/^Tìm x, biết: (.+)=0\.?$/); if (!m) return ['không đọc được đề']
    const cs = parsePoly(m[1]); if (!cs || cs[0] !== 1) return ['không đọc được đa thức']
    const { ints, extra } = nghiemThuc(cs); if (extra) return ['phương trình còn nghiệm không nguyên']
    const ans = [...bo(da).matchAll(/-?\d+/g)].map((x) => +x[0]); const a = [...new Set(ans)].sort((p, q) => p - q)
    return [JSON.stringify(a) !== JSON.stringify(ints) && `đáp án ${da} ≠ nghiệm ${ints.join(';')}`].filter(Boolean)
  },
  NDB01427: (nd, da) => {
    const m = bo(nd).match(/đẳng thức (.+?)=(-?\d+)\.?$/); if (!m) return ['không đọc được đề']
    const prep = (s) => s.replace(/\s/g, '').replace(/(\d|\)|x|y)(?=[xy(])/g, '$1*')
    const f = Function('x', 'y', `return (${prep(m[1])})`), N = +m[2], sol = []
    for (let x = -Math.abs(N) - 40; x <= Math.abs(N) + 40; x++) for (let y = -Math.abs(N) - 40; y <= Math.abs(N) + 40; y++) if (f(x, y) === N) sol.push(`${x},${y}`)
    const got = [...bo(da).matchAll(/\((-?\d+);(-?\d+)\)/g)].map((x) => `${x[1]},${x[2]}`).sort().join('|')
    return [got !== sol.sort().join('|') && `đáp án ${da} ≠ tập nghiệm tính lại`].filter(Boolean)
  },
}
const MOI = { NDB00982: MOI_00982, NDB01427: MOI_01427 }
const kiemTai = (dang, c) => KIEM[dang](c.noi_dung, c.dap_an ?? '', c.loi_giai)
const nhanDang = (cs) => cs.join(',')

if (LENH === 'thu') {
  for (const [dang, ds] of Object.entries(MOI)) {
    const dung = ds.filter((c) => !kiemTai(dang, c).length).length
    const c = ds[1]; const sai = { ...c, dap_an: c.dap_an.replace(/\d/, (m) => String((+m + 1) % 10)) }
    console.log(`${dang}: ${dung}/${ds.length} qua bộ kiểm · cố tình sai đáp án → ${kiemTai(dang, sai).length ? 'bắt' : '⚠ KHÔNG BẮT'}`)
    for (const c2 of ds.filter((x) => kiemTai(dang, x).length).slice(0, 3)) console.log('   ✘', kiemTai(dang, c2).join(' | '), '::', c2.noi_dung.slice(0, 80))
    if (args.includes('--in')) console.log('-----\n' + c.noi_dung + '\n=> ' + c.dap_an + '\n' + c.loi_giai.split('**Phần 2. Trình bày**')[1] + '\n-----')
  }
} else {
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await db.connect()
  try {
    await db.query('begin')
    if (LENH === 'sua') {
      // 5 câu clone NDB00982 sai đáp án (rà 21/11): viết lại đáp án + lời giải theo đúng nghiệm
      const MA = ['T108030601002', 'T108030601003', 'T108030601009', 'T108030601055', 'T108030601056']
      const { rows } = await db.query(`select ma_cau, noi_dung, dap_an from dai_cau_hoi where ma_cau = any($1) and xoa_at is null`, [MA])
      for (const r of rows) {
        const cs = parsePoly(bo(r.noi_dung).replace(/ = ?0$/, '').replace(/^Tìm x, biết: /, '')); if (!cs || cs[0] !== 1) throw new Error('không đọc được ' + r.ma_cau)
        const g = giaiBac3(cs)
        if (!g.hon) { const { ints, extra } = nghiemThuc(cs); if (extra || JSON.stringify([...new Set([...bo(g.dap_an).matchAll(/-?\d+/g)].map((x) => +x[0]))].sort((p, q) => p - q)) !== JSON.stringify(ints)) throw new Error('lời giải mới không khớp: ' + r.ma_cau) }
        console.log(`  ${r.ma_cau}: ${bo(r.dap_an)}  →  ${bo(g.dap_an)}`)
        await db.query(`update dai_cau_hoi set dap_an = $2, loi_giai = $3 where ma_cau = $1`, [r.ma_cau, g.dap_an, g.loi_giai])
      }
      console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (ROLLBACK)', `· sửa ${rows.length} câu`)
    } else {
      const { rows: cu } = await db.query(`select c.noi_dung from bdm_cau_dang d join dai_cau_hoi c on c.ma_cau = d.ma_cau where d.kho = 'dai' and d.dang_bai_id = 'NDB00982' and c.xoa_at is null`)
      const daCo = new Set(cu.map((r) => { const m = bo(r.noi_dung).replace(/^Tìm x, biết: /, '').replace(/ ?= ?0\.?$/, ''); const cs = parsePoly(m); return cs ? nhanDang(cs) : '' }))
      const qua = [], dem = {}
      for (const [dang, ds] of Object.entries(MOI)) {
        for (const c of ds) {
          if (dang === 'NDB00982' && daCo.has(nhanDang(c.cs))) { console.log(`  ≈ đã có đa thức: ${c.noi_dung}`); continue }
          const l = kiemTai(dang, c); if (l.length) { console.log(`  ✘ ${dang}: ${l.join(' | ')} :: ${c.noi_dung.slice(0, 80)}`); continue }
          const cau = { khoi: '8', loai_cau: c.loai, noi_dung: c.noi_dung, lua_chon: null, menh_de: null, dap_an: c.dap_an, loi_giai: c.loi_giai, anh_de: null, anh_dap_an: null, ma_cum: null, nguon_giai: 'ai' }
          const bam = bamNoiDung({ ...cau, dang_chinh: 'cho' })
          const mk = (tram, ghi) => ({ tram, lan_chay: 'k8-fill-kiem', cach: 'code', ket_qua: 'dat', ghi_chu: ghi, bam_noi_dung: bam })
          const kq = xetGoi({ cau: { ...cau, dang_chinh: 'cho' }, vet: { lam: { tram: 'giai', lan_chay: 'k8-fill-sinh', model: 'claude-sonnet-5-5 (bộ sinh bằng code)' }, kiem: [
            mk('kiem-doc', `bài lẻ soạn bù dạng ${dang}: khuôn hai phần, không nhãn "Câu N"`), mk('kiem-dang', `dạng ${dang} do điều phối chỉ định (§C11)`), mk('kiem-dap-so', 'bộ kiểm đọc lại đề từ chữ, tính lại nghiệm bằng vét cạn, khớp đáp án')] } })
          if (!kq.duoc_ghi) { console.log(`  ✘ ${dang} cổng: ${kq.ly_do.join(' | ')}`); continue }
          qua.push({ dang, cau, kq })
        }
      }
      if (qua.length) {
        const cauList = qua.map(({ dang, cau }) => ({ ...cau, nguon: 'le', giai_method: 'claude_code', ai_model: 'claude-sonnet-5-5', dang_bai: dang, dang_bai_chot: true, ten_de_goc: `Soạn bù ${dang} · fill K8 21/11` }))
        const { maCauList, trung } = await insertCauBatch({ client: db, subject: 'dai', cauList }); const laTrung = new Set(trung.map((t) => t.idx))
        for (let i = 0; i < qua.length; i++) {
          if (laTrung.has(i)) { console.log(`  ≈ trùng đề: ${qua[i].dang} ↔ ${maCauList[i]}`); continue }
          const { dang, kq } = qua[i]
          await db.query(`update dai_cau_hoi set kiem_may = $2, kiem_may_at = now(), kiem_may_boi = 'claude_code', kiem_may_ghi = $3, da_duyet = true, duyet_nguon = 'ai', duyet_at = now() where ma_cau = $1`, [maCauList[i], kq.kiem_may, kq.kiem_may_ghi.slice(0, 1500)])
          dem[dang] = (dem[dang] || 0) + 1
        }
      }
      console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (ROLLBACK)', '· qua cổng', qua.length); console.table(dem)
    }
    await db.query(GHI ? 'commit' : 'rollback')
  } catch (e) { await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message); process.exitCode = 1 } finally { await db.end() }
}
