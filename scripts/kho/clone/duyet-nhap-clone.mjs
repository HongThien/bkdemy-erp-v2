// ============================================================================
// duyet-nhap-clone.mjs — "Claude kiểm rồi tự duyệt" cho nháp clone (Q11 · spec-giai-bai §C6 "Câu CLONE: Claude kiểm xong thì tự duyệt").
//
//   node scripts/kho/clone/duyet-nhap-clone.mjs [--dang NDB00401,NDB00408] [--ghi]
//
// Nguồn: dai_cau_hoi_clone_cho_duyet (clone_method='claude_code_batch', chưa từ chối).
// Mỗi nháp: (1) câu gốc còn trong kho, đã gán dạng bài, không hình, (2) dạng đó CÓ bộ kiểm độc lập — bộ kiểm ĐỌC LẠI đề
// (không dùng dữ liệu của bộ sinh) rồi tính lại đáp số + so với đáp số ghi + số cuối của lời giải. Dạng chưa có bộ kiểm ⇒ để nguyên nháp.
// Qua cổng (cong-ghi.xetGoi) ⇒ chèn vào dai_cau_hoi (dạng chờ của khối, nguon 'clone', parent_ma_cau: dạng lấy từ GỐC), đặt da_duyet=true
// duyet_nguon='ai', xoá dòng nháp. Không --ghi: chạy thử trong transaction rồi ROLLBACK.
// Thêm dạng mới = thêm 1 mục vào KIEM bên dưới (đừng sửa nháp tay).
// ============================================================================
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { xetGoi, bamNoiDung } from '../cong-ghi.mjs'
import { insertCauBatch } from '../../_kho_insert.mjs'

const GHI = process.argv.includes('--ghi')
const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const CHI_DANG = lay('--dang')?.split(',') ?? null
const env = Object.fromEntries(readFileSync(new URL('../../../.env', import.meta.url), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))

const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => (x / gcd(x, y)) * y
const bo$ = (s) => String(s).replace(/\$/g, '').replace(/\s+/g, '')
const cuoiLoiGiai = (lg, re) => { const m = [...String(lg).replace(/\$/g, '').matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))]; return m.length ? m[m.length - 1][1] : null }
const so = (s) => Number(String(s).replace('−', '-'))

// Mỗi bộ kiểm: (noi_dung, dap_an, loi_giai) → [] nếu đạt, hoặc danh sách lỗi. Đọc đề từ CHỮ, tính lại bằng code.
const KIEM = {
  NDB00401: (nd, da, lg) => { // UCLN bằng định nghĩa của a và b
    const m = bo$(nd).match(/^TìmUCLNbằngđịnhnghĩacủa(\d+)và(\d+)\.$/); if (!m) return ['không đọc được đề']
    const g = gcd(+m[1], +m[2]), cuoi = cuoiLoiGiai(lg, /UCLN\(\d+,\d+\)=(\d+)/)
    return [da.trim() !== String(g) && `đáp án ${da} ≠ ${g}`, cuoi !== String(g) && `lời giải kết luận ${cuoi} ≠ ${g}`].filter(Boolean)
  },
  NDB00408: (nd, da, lg) => { // BCNN bằng định nghĩa
    const m = bo$(nd).match(/^TìmBCNNbằngđịnhnghĩacủa(\d+)và(\d+)\.$/); if (!m) return ['không đọc được đề']
    const L = lcm(+m[1], +m[2]), cuoi = cuoiLoiGiai(lg, /BCNN\(\d+,\d+\)=(\d+)/)
    return [da.trim() !== String(L) && `đáp án ${da} ≠ ${L}`, cuoi !== String(L) && `lời giải kết luận ${cuoi} ≠ ${L}`].filter(Boolean)
  },
  NDB00400: (nd, da, lg) => { // UC(a;b)
    const m = bo$(nd).match(/^Tìm\\text\{UC\}\((\d+);(\d+)\)\.$/); if (!m) return ['không đọc được đề']
    const g = gcd(+m[1], +m[2]), uc = []; for (let i = 1; i <= g; i++) if (g % i === 0) uc.push(i)
    const cuoi = cuoiLoiGiai(lg, /UC\}?\(\d+;\d+\)=\\\{([^}\\]*)\\\}/)
    return [da.trim() !== uc.join(';') && `đáp án ${da} ≠ ${uc.join(';')}`, cuoi !== uc.join(';') && `lời giải kết luận ${cuoi} ≠ ${uc.join(';')}`].filter(Boolean)
  },
  NDB00407: (nd, da, lg) => { // BC(a;b) — liệt kê 0; L; 2L; ....
    const m = bo$(nd).match(/^TìmBC\((\d+);(\d+)\)\.$/); if (!m) return ['không đọc được đề']
    const L = lcm(+m[1], +m[2]), ex = `0;${L};${2 * L};....`
    const cuoi = cuoiLoiGiai(lg, /BC\(\d+;\d+\)=\\\{([^}\\]*)\\\}/)
    return [da.trim() !== ex && `đáp án ${da} ≠ ${ex}`, cuoi !== ex && `lời giải kết luận ${cuoi} ≠ ${ex}`].filter(Boolean)
  },
  NDB00414: (nd, da, lg) => { // x ⋮ a; b; c, x nhỏ nhất khác 0
    const m = bo$(nd).match(/^Tìmsốtựnhiên\\?x,biết:x\\vdots(\d+);x\\vdots(\d+);x\\vdots(\d+)vàx/); if (!m) return ['không đọc được đề']
    const L = lcm(lcm(+m[1], +m[2]), +m[3]), cuoi = cuoiLoiGiai(lg, /Vậy\s*x=(\d+)/)
    return [da.trim() !== String(L) && `đáp án ${da} ≠ ${L}`, cuoi !== String(L) && `lời giải kết luận ${cuoi} ≠ ${L}`].filter(Boolean)
  },
  NDB01622: (nd, da, lg) => { // số ước của N (N viết thẳng hoặc dạng p^a.q^b)
    const m = bo$(nd).match(/ướcsố\?([\d^.]+)$/); if (!m) return ['không đọc được đề']
    const n = Function(`"use strict";return (${m[1].replace(/\^/g, '**').replace(/\./g, '*')})`)(); let t = 0; for (let i = 1; i <= n; i++) if (n % i === 0) t++
    const cuoi = cuoiLoiGiai(lg, /có\s*(\d+)\s*ước/)
    return [da.trim() !== String(t) && `đáp án ${da} ≠ ${t}`, cuoi !== String(t) && `lời giải kết luận ${cuoi} ≠ ${t}`].filter(Boolean)
  },
  NDB01291: (nd, da, lg) => { // so sánh hai số nguyên
    const m = bo$(nd).match(/:(-?\d+)và(-?\d+)\.$/); if (!m) return ['không đọc được đề']
    const x = +m[1], y = +m[2], s = x < y ? '<' : x > y ? '>' : '='
    const cuoi = cuoiLoiGiai(lg, /-?\d+([<>=])-?\d+\s*$/m)
    return [da.trim() !== s && `đáp án ${da} ≠ ${s}`, cuoi !== s && `lời giải kết luận ${cuoi} ≠ ${s}`].filter(Boolean)
  },
  NDB01302: (nd, da, lg) => { // bỏ dấu ngoặc rồi tính
    const m = bo$(nd).match(/tính:(.+)\.$/); if (!m || !/^[\d+\-()[\]]+$/.test(m[1])) return ['không đọc được đề']
    const v = Function(`"use strict";return (${m[1].replace(/\[/g, '(').replace(/\]/g, ')')})`)()
    const cuoi = cuoiLoiGiai(lg, /=(-?\d+)\s*$/m)
    return [da.trim() !== String(v) && `đáp án ${da} ≠ ${v}`, cuoi !== String(v) && `lời giải kết luận ${cuoi} ≠ ${v}`].filter(Boolean)
  },
  NDB01362: (nd, da, lg) => { // (x-a)(bx+c)=0, nghiệm tự nhiên
    const fs = [...bo$(nd).matchAll(/\((\d*)x([+-])(\d+)\)/g)]; if (fs.length !== 2 || !/=0$/.test(bo$(nd))) return ['không đọc được đề']
    const nghiem = fs.map((f) => (f[2] === '+' ? -1 : 1) * +f[3] / (+f[1] || 1)).filter((r) => Number.isInteger(r) && r >= 0)
    const cuoi = cuoiLoiGiai(lg, /Vậy\s*x=(\d+)/)
    return [nghiem.length !== 1 && `không đúng 1 nghiệm tự nhiên (${nghiem})`, da.trim() !== String(nghiem[0]) && `đáp án ${da} ≠ ${nghiem[0]}`, cuoi !== String(nghiem[0]) && `lời giải kết luận ${cuoi} ≠ ${nghiem[0]}`].filter(Boolean)
  },
  NDB00358: (nd, da, lg) => { // k.x^n = m, x tự nhiên
    const m = bo$(nd).match(/biết:(\d+)\.x\^(\d)=(\d+)$/); if (!m) return ['không đọc được đề']
    const ns = []; for (let x = 0; x <= 2000; x++) if (+m[1] * x ** +m[2] === +m[3]) ns.push(x)
    const cuoi = cuoiLoiGiai(lg, /x=(\d+)\s*$/m)
    return [ns.length !== 1 && `không đúng 1 nghiệm (${ns})`, da.trim() !== String(ns[0]) && `đáp án ${da} ≠ ${ns[0]}`, cuoi !== String(ns[0]) && `lời giải kết luận ${cuoi} ≠ ${ns[0]}`].filter(Boolean)
  },
  NDB00363: (nd, da, lg) => { // a.(b^x - c^2.d) = e
    const m = bo$(nd).match(/biết:(\d+)\.\((\d+)\^x-(\d+)\^2\.(\d+)\)=(\d+)\.?$/); if (!m) return ['không đọc được đề']
    const [a, b, c, d, e] = m.slice(1).map(Number), ns = []; for (let x = 0; x <= 30; x++) if (a * (b ** x - c * c * d) === e) ns.push(x)
    const cuoi = cuoiLoiGiai(lg, /Vậy\s*x=(\d+)/)
    return [ns.length !== 1 && `không đúng 1 nghiệm (${ns})`, da.trim() !== String(ns[0]) && `đáp án ${da} ≠ ${ns[0]}`, cuoi !== String(ns[0]) && `lời giải kết luận ${cuoi} ≠ ${ns[0]}`].filter(Boolean)
  },
  NDB02809: (nd, da, lg) => { // x ∈ Z: a + b^{x+k} = v  |  b^{x-k} - a = v
    const t = bo$(nd); let f
    let m = t.match(/^Tìmx\\in\\mathbb\{Z\},biết:(\d+)\+(\d+)\^\{x\+(\d+)\}=(\d+)$/)
    if (m) f = (X) => Number(m[1]) + Number(m[2]) ** (X + Number(m[3])) === Number(m[4]) && X + Number(m[3]) >= 0
    else if ((m = t.match(/^Tìmx\\in\\mathbb\{Z\},biết:(\d+)\^\{x-(\d+)\}-(\d+)=(\d+)$/))) f = (X) => Number(m[1]) ** (X - Number(m[2])) - Number(m[3]) === Number(m[4]) && X - Number(m[2]) >= 0
    else return ['không đọc được đề']
    const ns = []; for (let X = -30; X <= 60; X++) if (f(X)) ns.push(X)
    const cuoi = cuoiLoiGiai(lg, /x=(-?\d+)\s*$/m)
    return [ns.length !== 1 && `không đúng 1 nghiệm (${ns})`, da.trim() !== String(ns[0]) && `đáp án ${da} ≠ ${ns[0]}`, cuoi !== String(ns[0]) && `lời giải kết luận ${cuoi} ≠ ${ns[0]}`].filter(Boolean)
  },
  NDB01303: (nd, da, lg) => { // Tính: (-a).b — nhân hai số nguyên
    const m = bo$(nd).match(/^Tính:(\(?-?\d+\)?)\.(\(?-?\d+\)?)\.$/); if (!m) return ['không đọc được đề']
    const x = so(m[1].replace(/[()]/g, '')), y = so(m[2].replace(/[()]/g, '')), p = x * y
    const cuoi = cuoiLoiGiai(lg, /=(-?\d+)$/m)
    return [da.trim() !== String(p) && `đáp án ${da} ≠ ${p}`, cuoi !== String(p) && `lời giải kết luận ${cuoi} ≠ ${p}`].filter(Boolean)
  },
}

const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await db.connect()
try {
  const { rows: nhap } = await db.query(`select d.id, d.loai_cau, d.noi_dung, d.lua_chon, d.dap_an, d.loi_giai, d.parent_ma_cau, d.clone_method,
      g.anh_de, g.xoa_at goc_xoa, gc.dang_bai_id, cd.khoi
    from dai_cau_hoi_clone_cho_duyet d
    left join dai_cau_hoi g on g.ma_cau = d.parent_ma_cau
    left join dai_bdm_gan_cau gc on gc.ma_cau = d.parent_ma_cau
    left join dai_bdm_dang_bai db on db.id = gc.dang_bai_id left join dai_bdm_nhom nh on nh.id = db.nhom_id left join dai_bdm_chu_de cd on cd.id = nh.chu_de_id
    where d.clone_method = 'claude_code_batch' and d.tu_choi_at is null order by d.created_at`)
  const tuChoi = [], qua = [], boQua = {}
  for (const n of nhap) {
    if (!n.dang_bai_id) { boQua['gốc chưa gán dạng'] = (boQua['gốc chưa gán dạng'] || 0) + 1; continue }
    if (CHI_DANG && !CHI_DANG.includes(n.dang_bai_id)) continue
    const kiem = KIEM[n.dang_bai_id]
    if (!kiem) { boQua[`${n.dang_bai_id} chưa có bộ kiểm`] = (boQua[`${n.dang_bai_id} chưa có bộ kiểm`] || 0) + 1; continue }
    const ly = []
    if (n.goc_xoa) ly.push('câu gốc đã vào rác'); if (n.anh_de) ly.push('câu gốc có hình đề')
    if (!n.loi_giai || !/Phần 1\./.test(n.loi_giai) || !/Phần 2\./.test(n.loi_giai)) ly.push('lời giải không đủ hai phần')
    if (/^\s*(câu|bài)\s*\d+/i.test(n.noi_dung)) ly.push('đề còn nhãn "Câu N"')
    ly.push(...kiem(n.noi_dung, n.dap_an ?? '', n.loi_giai ?? ''))
    if (ly.length) { tuChoi.push({ n, ly_do: ly }); continue }
    const cau = { khoi: n.khoi, loai_cau: n.loai_cau, noi_dung: n.noi_dung, lua_chon: n.lua_chon, menh_de: null, dap_an: n.dap_an, loi_giai: n.loi_giai, anh_de: null, anh_dap_an: null, ma_cum: null, nguon_giai: 'ai' }
    const bam = bamNoiDung({ ...cau, dang_chinh: 'cho' }), bb = []
    const mk = (tram, ghi) => bb.push({ tram, lan_chay: 'clone-duyet', cach: 'code', ket_qua: 'dat', ghi_chu: ghi, bam_noi_dung: bam })
    mk('kiem-doc', `clone ${n.dang_bai_id} của ${n.parent_ma_cau}: khuôn hai phần, không nhãn "Câu N"`)
    mk('kiem-dang', `dạng lấy từ câu gốc ${n.parent_ma_cau} (đã gán ${n.dang_bai_id}); clone giữ nguyên khuôn đề, chỉ đổi số`)
    mk('kiem-dap-so', 'bộ kiểm đọc lại đề từ chữ, tính lại đáp số bằng code, khớp đáp án ghi và kết luận cuối lời giải')
    const kq = xetGoi({ cau: { ...cau, dang_chinh: 'cho' }, vet: { lam: { tram: 'giai', lan_chay: 'clone-sinh', model: 'claude-sonnet-5-5 (bộ sinh bằng code)' }, kiem: bb } })
    if (!kq.duoc_ghi) { tuChoi.push({ n, ly_do: kq.ly_do }); continue }
    qua.push({ n, cau, kq })
  }

  await db.query('begin')
  const dem = {}; let trung = 0
  if (qua.length) {
    const cauList = qua.map(({ n, cau }) => ({ ...cau, nguon: 'clone', giai_method: 'clone_doi_so', ai_model: 'claude-sonnet-5-5', ten_de_goc: `Clone duyệt ${n.dang_bai_id} · ${n.id}` }))
    const { maCauList, trung: tr } = await insertCauBatch({ client: db, subject: 'dai', cauList })
    const laTrung = new Set(tr.map((t) => t.idx)); trung = laTrung.size
    for (let i = 0; i < qua.length; i++) {
      const { n, kq } = qua[i], ma = maCauList[i]
      if (laTrung.has(i)) { console.log(`  ≈ trùng đề: ${n.id} ↔ ${ma}`); await db.query(`delete from dai_cau_hoi_clone_cho_duyet where id = $1`, [n.id]); continue }
      await db.query(`update dai_cau_hoi set parent_ma_cau = $2, clone_method = 'claude_code_batch', kiem_may = $3, kiem_may_at = now(), kiem_may_boi = 'claude_code', kiem_may_ghi = $4,
          da_duyet = true, duyet_nguon = 'ai', duyet_at = now() where ma_cau = $1`, [ma, n.parent_ma_cau, kq.kiem_may, kq.kiem_may_ghi.slice(0, 1500)])
      await db.query(`delete from dai_cau_hoi_clone_cho_duyet where id = $1`, [n.id])
      dem[n.dang_bai_id] = (dem[n.dang_bai_id] || 0) + 1
    }
  }
  console.log(GHI ? '■ DUYỆT THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', `· nháp ${nhap.length} · qua cổng ${qua.length} · vào kho ${Object.values(dem).reduce((s, x) => s + x, 0)} · trùng đề ${trung} · từ chối ${tuChoi.length}`)
  console.table(dem); if (Object.keys(boQua).length) console.log('  để nguyên nháp:', boQua)
  for (const t of tuChoi.slice(0, 30)) console.log(`  ✘ ${t.n.id} (${t.n.dang_bai_id}): ${[].concat(t.ly_do).join(' | ').slice(0, 300)}`)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message); process.exitCode = 1 } finally { await db.end() }
