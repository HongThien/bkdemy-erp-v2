// ve_lai_xuat.mjs — LUỒNG VẼ LẠI HÌNH (Thùy 13/10): xuất "gói việc" cho các câu Hình học còn dùng ảnh cắt từ sách/tài liệu.
//
//   node scripts/anh/ve_lai_xuat.mjs --khoi 7 [--bai HH00023,HH00024] [--moi-goi 8] [--ra <thu_muc>]        phần HỌC (hinh_hoc_cau_hoi)
//   node scripts/anh/ve_lai_xuat.mjs --bang baitoan|bienthe [--khoi 7] [--mo-hinh MH.045,MH.046] [--moi-goi 8]  phần LUYỆN (xem dưới)
//
// CHỈ ĐỌC DB. Với mỗi bài (hinh_hoc_bai) có câu mang ảnh CŨ (URL không nằm trong kho-anh/hinh_hoc/ = chưa vẽ bằng code):
//   <ra>/<ma_bai>-<n>/viec.md      đề + đáp án + lời giải của từng hình phải vẽ, kèm tên tệp ra
//   <ra>/<ma_bai>-<n>/viec.json    cùng nội dung, cho máy
//   <ra>/<ma_bai>-<n>/cu/<ten>.png ảnh cũ (để đối chiếu nhãn, số đo, ký hiệu)
// Tên tệp ra = quy ước của gan_hinh.mjs:  <ma>[+<ma>…]        hình đề, gắn cả đề lẫn lời giải
//                                          <ma>[+<ma>…]_de     chỉ hình đề (câu có hình lời giải riêng)
//                                          <ma>[+<ma>…]_lg     chỉ hình lời giải
// Phần LUYỆN (--bang): gói gom theo MÔ HÌNH (các bài cùng mô hình là một chuỗi, hình phải nhất quán) — thư mục BT-MH045-1 / BV-MH045-1.
//   baitoan  hinh_baitoan.anh_chuan             tên tệp = <ma bài toán>          vd BT.07.045.01.png
//   bienthe  hinh_baitoan_bien_the.anh          tên tệp = <id biến thể (uuid)>   mỗi DÒNG một hình (đề biến thể khác số / khác tên điểm)
//            hinh_baitoan_bien_the.anh_loi_giai tên tệp = <id>_lg
//   Đề đầy đủ của bài toán KHÔNG nằm ở một cột: ghép như app (src/lib/kho/hinh.ts → giaThietBaiToan) = giả thiết của bài CHA (tiền đề của
//   cách giải mặc định, đệ quy) hoặc của mô hình (leo cây mô hình, gt_thay_the) + gia_thiet_rieng; rồi tới phat_bieu.
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import puppeteer from 'puppeteer-core'

const argv = process.argv.slice(2)
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d }
const KHOI = opt('--khoi'), BAI = opt('--bai')?.split(','), MOI_GOI = +opt('--moi-goi', 8)
const BANG = opt('--bang'), MO_HINH = opt('--mo-hinh')?.split(',')
const RA = opt('--ra', 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh')
if (BANG && !['baitoan', 'bienthe'].includes(BANG)) { console.error('--bang chỉ nhận: baitoan | bienthe'); process.exit(2) }
if (!BANG && !KHOI && !BAI) { console.error('Dùng: node scripts/anh/ve_lai_xuat.mjs --khoi 7 | --bai HH00023,HH00024 | --bang baitoan|bienthe [--khoi 7] [--mo-hinh MH.045]  [--moi-goi 8] [--ra <thu_muc>]'); process.exit(2) }

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect(); await db.query('begin read only')

const laCu = (u) => u && !u.includes('/kho-anh/hinh_hoc/')
const CU = (c) => `(${c} is not null and ${c} not like '%/kho-anh/hinh_hoc/%')`
// Mỗi nhóm = một bài (phần Học) hoặc một mô hình (phần Luyện); bên dưới cắt thành gói MOI_GOI hình.
//   { ma, tieu_de, them, hinh: [{ ten, kieu, nhan_kieu, url, cau: [{ ma_cau, noi_dung, … }], md }] }
const NHOM = BANG ? await nhomLuyen() : await nhomHoc()
await db.end()

async function nhomHoc() {
  const { rows } = await db.query(
    `select c.ma_cau, c.dang_chinh, b.ten_bai, b.khoi, c.thu_tu, c.loai_cau, c.noi_dung, c.dap_an, c.loi_giai, c.lua_chon, c.menh_de, c.anh_de, c.anh_dap_an, c.da_duyet
       from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh
      where c.xoa_at is null and (${CU('c.anh_de')} or ${CU('c.anh_dap_an')})
        and ($1::text is null or b.khoi = $1) and ($2::text[] is null or c.dang_chinh = any($2))
      order by c.dang_chinh, c.thu_tu, c.ma_cau`, [KHOI ?? null, BAI ?? null])
  // gom theo (bài, URL, kiểu gắn): một ảnh dùng chung cho nhiều câu ⇒ một hình vẽ lại
  const theoBai = new Map()
  for (const r of rows) {
    const them = (url, kieu) => {
      if (!theoBai.has(r.dang_chinh)) theoBai.set(r.dang_chinh, { ten_bai: r.ten_bai, khoi: r.khoi, hinh: new Map() })
      const h = theoBai.get(r.dang_chinh).hinh, k = url + '|' + kieu
      if (!h.has(k)) h.set(k, { url, kieu, cau: [] })
      h.get(k).cau.push(r)
    }
    const lgRieng = r.anh_dap_an && r.anh_dap_an !== r.anh_de
    if (laCu(r.anh_de)) them(r.anh_de, lgRieng ? 'de' : 'chung')
    if (lgRieng && laCu(r.anh_dap_an)) them(r.anh_dap_an, 'lg')
  }
  const NHAN = { chung: 'hình ĐỀ (hiện ở cả đề và lời giải)', de: 'hình ĐỀ (câu này có hình lời giải riêng)', lg: 'hình LỜI GIẢI (có thể có đường phụ, điểm phụ của lời giải)' }
  return [...theoBai].map(([bai, { ten_bai, khoi, hinh }]) => ({
    ma: bai, tieu_de: `${ten_bai} (Hình học ${khoi})`, them: { bai, ten_bai, khoi },
    hinh: [...hinh.values()].map((h) => {
      let md = ''
      for (const c of h.cau) {
        md += `\n### ${c.ma_cau} · ${c.loai_cau}${c.da_duyet ? ' · đã duyệt' : ''}\n\n**Đề:**\n\n${c.noi_dung}\n`
        if (c.lua_chon) md += `\n**Lựa chọn:** ${JSON.stringify(c.lua_chon)}\n`
        if (c.menh_de) md += `\n**Mệnh đề:** ${JSON.stringify(c.menh_de)}\n`
        if (c.dap_an) md += `\n**Đáp án:** ${c.dap_an}\n`
        if (c.loi_giai) md += `\n**Lời giải:**\n\n${c.loi_giai}\n`
      }
      return { ten: h.cau.map((c) => c.ma_cau).join('+') + (h.kieu === 'de' ? '_de' : h.kieu === 'lg' ? '_lg' : ''), kieu: h.kieu, nhan_kieu: NHAN[h.kieu], url: h.url,
        cau: h.cau.map(({ anh_de, anh_dap_an, ...c }) => c), md }
    }),
  }))
}

// ───────── Phần LUYỆN: hinh_baitoan / hinh_baitoan_bien_the ─────────
async function nhomLuyen() {
  const q = async (s) => (await db.query(s)).rows
  const moHinh = await q(`select id, ma, ten, khoi, gia_thiet, gia_thiet_them, gt_thay_the, anh_cau_hinh from hinh_mo_hinh`)
  const canh = await q(`select c.mo_hinh_id, c.cha_id from hinh_mo_hinh_cha c join hinh_mo_hinh m on m.id = c.cha_id order by m.ma`)
  const baiToan = await q(`select id, ma, phat_bieu, mo_hinh_id, cap, de_bai_chuan, anh_chuan, gia_thiet_phu, gia_thiet_rieng, gt_thay_the from hinh_baitoan`)
  const cach = await q(`select id, baitoan_id, la_mac_dinh, thu_tu, loi_giai, giai_method, da_duyet from hinh_cach_giai`)
  const tienDe = await q(`select cach_id, tien_de_id from hinh_cach_tien_de`)
  const bienThe = await q(`select id, baitoan_id, kieu, de_bai, anh, loi_giai, anh_loi_giai, da_duyet, created_at from hinh_baitoan_bien_the order by created_at, id`)
  const mh = new Map(moHinh.map((m) => [m.id, m])), bt = new Map(baiToan.map((b) => [b.id, b]))
  // ↓ chép ĐÚNG luật của src/lib/kho/hinh.ts (duongToTien · giaThietDayDu · cachMacDinh · chaKeThua · giaThietBaiToan · anhCuaBaiToan)
  const duongToTien = (id) => { const p = [], seen = new Set(); let cur = id; while (cur && !seen.has(cur)) { seen.add(cur); p.unshift(cur); cur = canh.find((c) => c.mo_hinh_id === cur)?.cha_id } return p }
  const gtMoHinh = (id) => {
    const nodes = duongToTien(id).map((x) => mh.get(x)).filter(Boolean); let base = 0
    nodes.forEach((m, i) => { if (i > 0 && m.gt_thay_the) base = i })
    return [nodes[base]?.gia_thiet?.trim(), ...nodes.slice(base + 1).map((m) => m.gia_thiet_them?.trim())].filter(Boolean).join('; ')
  }
  const cachMacDinh = (id) => { const ds = cach.filter((c) => c.baitoan_id === id); return ds.find((c) => c.la_mac_dinh) ?? ds.sort((a, b) => a.thu_tu - b.thu_tu)[0] ?? null }
  const chaKeThua = (id, daTham) => {
    const c = cachMacDinh(id)
    return (c ? tienDe.filter((t) => t.cach_id === c.id).map((t) => bt.get(t.tien_de_id)) : []).filter((b) => b && !daTham.has(b.id))
      .sort((a, b) => b.cap - a.cap || b.ma.localeCompare(a.ma))[0] ?? null
  }
  const gtBaiToan = (id, daTham = new Set()) => {
    const b = bt.get(id); if (!b || daTham.has(id)) return ''
    daTham.add(id)
    if (b.gt_thay_the) return b.gia_thiet_rieng?.trim() ?? ''
    const cha = chaKeThua(id, daTham)
    return [cha ? gtBaiToan(cha.id, daTham) : gtMoHinh(b.mo_hinh_id), b.gia_thiet_rieng?.trim()].filter(Boolean).join('; ')
  }
  const anhMoHinh = (id) => duongToTien(id).reverse().map((x) => mh.get(x)?.anh_cau_hinh).find(Boolean) ?? null
  const anhBaiToan = (id, daTham = new Set()) => {
    const b = bt.get(id); if (!b || daTham.has(id)) return null
    daTham.add(id)
    if (b.anh_chuan) return b.anh_chuan
    const cha = chaKeThua(id, daTham)
    return (cha ? anhBaiToan(cha.id, daTham) : null) ?? anhMoHinh(b.mo_hinh_id)
  }
  const chuoiCha = (id) => { const ra = [], daTham = new Set([id]); let cha = chaKeThua(id, daTham); while (cha) { ra.push(cha); daTham.add(cha.id); cha = chaKeThua(cha.id, daTham) } return ra }
  const loiGiai = (id) => { const c = cachMacDinh(id); return c?.loi_giai ? c.loi_giai + (c.giai_method === 'claude_code' && !c.da_duyet ? '\n\n*(lời giải do AI viết, CHƯA duyệt — chỉ để biết điểm phụ, đừng tin tuyệt đối)*' : '') : null }
  const deDayDu = (b) => [gtBaiToan(b.id), b.phat_bieu?.trim()].filter(Boolean).join('\n')
  const motDong = (s) => s.replace(/\s+/g, ' ')
  const mdBaiToan = (b) => {
    let md = `\n**Giả thiết đầy đủ** (app ghép: bài cha / mô hình + giả thiết riêng):\n\n${gtBaiToan(b.id) || '*(trống)*'}\n\n**Câu hỏi** (\`phat_bieu\`):\n\n${b.phat_bieu}\n`
    if (b.gia_thiet_rieng) md += `\n- Giả thiết riêng của bài${b.gt_thay_the ? ' (THAY THẾ giả thiết mô hình)' : ''}: ${b.gia_thiet_rieng}\n`
    if (b.gia_thiet_phu) md += `\n- Dữ kiện phụ / vẽ thêm (\`gia_thiet_phu\`): ${b.gia_thiet_phu}\n`
    if (b.de_bai_chuan) md += `\n- \`de_bai_chuan\`: ${b.de_bai_chuan}\n`
    const cha = chuoiCha(b.id)
    if (cha.length) md += `\n**Bài đứng trước trong chuỗi** (gần → xa): ${cha.map((c) => `\`${c.ma}\` ${motDong(c.phat_bieu)}`).join(' ← ')}\n`
    const lg = loiGiai(b.id)
    if (lg) md += `\n**Lời giải (cách mặc định):**\n\n${lg}\n`
    return md
  }
  const chon = (m) => m && (!KHOI || m.khoi === KHOI) && (!MO_HINH || MO_HINH.includes(m.ma))
  const nhom = new Map()
  const vao = (m) => {
    if (!nhom.has(m.ma)) nhom.set(m.ma, { ma: (BANG === 'baitoan' ? 'BT-' : 'BV-') + m.ma.replace('.', ''),
      tieu_de: `${m.ma} ${m.ten.trim()} (Hình ${m.khoi} · Luyện · ${BANG === 'baitoan' ? 'bài toán' : 'biến thể'})`,
      them: { bang: BANG, mo_hinh: m.ma, ten_mo_hinh: m.ten.trim(), khoi: m.khoi }, hinh: [] })
    return nhom.get(m.ma).hinh
  }
  const theoMa = (a, b) => a.ma.localeCompare(b.ma)
  if (BANG === 'baitoan') {
    for (const b of baiToan.filter((b) => laCu(b.anh_chuan) && chon(mh.get(b.mo_hinh_id))).sort(theoMa)) {
      const m = mh.get(b.mo_hinh_id)
      let md = `\n### ${b.ma} · cấp ${b.cap} · mô hình ${m.ma} ${m.ten.trim()}\n${mdBaiToan(b)}`
      // bài KHÔNG có ảnh riêng đang MƯỢN hình này (luật kế thừa hình của app) ⇒ hình mới cũng phải đúng với các bài đó
      const muon = baiToan.filter((x) => !x.anh_chuan && anhBaiToan(x.id) === b.anh_chuan).sort(theoMa)
      if (muon.length) md += `\n**Các bài không có ảnh riêng đang MƯỢN hình này** (hình không được mâu thuẫn với các bài này; chỉ vẽ những gì ảnh cũ có):\n\n${muon.map((x) => `- \`${x.ma}\`: ${motDong(deDayDu(x))}`).join('\n')}\n`
      vao(m).push({ ten: b.ma, kieu: 'chung', nhan_kieu: 'hình ĐỀ của bài toán (cột anh_chuan)', url: b.anh_chuan,
        cau: [{ ma_cau: b.ma, id: b.id, noi_dung: deDayDu(b), muon: muon.map((x) => x.ma) }], md })
    }
  } else {
    for (const v of bienThe) {
      const b = bt.get(v.baitoan_id), m = b && mh.get(b.mo_hinh_id)
      if (!chon(m)) continue
      const goc = `\n**Bài toán gốc \`${b.ma}\`** (biến thể này là bản ${{ doi_so: 'ĐỔI SỐ', doi_dinh: 'ĐỔI TÊN ĐIỂM', ca_hai: 'ĐỔI SỐ + ĐỔI TÊN ĐIỂM' }[v.kieu] ?? v.kieu} của nó): ${motDong(deDayDu(b))}\n`
      const them = (url, kieu) => {
        let md = `\n### Biến thể của ${b.ma} · ${v.kieu}${v.da_duyet ? ' · đã duyệt' : ''}\n\n**Đề (của biến thể — hình vẽ theo đề NÀY):**\n\n${v.de_bai}\n${goc}`
        if (v.loi_giai) md += `\n**Lời giải của biến thể:**\n\n${v.loi_giai}\n`
        if (url === b.anh_chuan) md += `\n⚠ Ảnh cũ của biến thể này là CHÍNH ảnh của bài gốc — nếu đề biến thể đổi tên điểm/đổi số thì ảnh cũ không khớp đề; vẽ theo ĐỀ biến thể.\n`
        const chung = bienThe.filter((x) => x.id !== v.id && (kieu === 'lg' ? x.anh_loi_giai : x.anh) === url)
        if (chung.length) md += `\nℹ Ảnh cũ này dùng chung cho ${chung.length + 1} biến thể (mỗi biến thể một đề khác nhau) — vẫn vẽ MỖI biến thể một hình theo đề của nó.\n`
        vao(m).push({ ten: v.id + (kieu === 'lg' ? '_lg' : ''), kieu, url, _ma: b.ma,
          nhan_kieu: kieu === 'lg' ? 'hình LỜI GIẢI của biến thể (cột anh_loi_giai; có thể có đường phụ, điểm phụ của lời giải)' : 'hình ĐỀ của biến thể (cột anh)',
          cau: [{ ma_cau: `${b.ma} · biến thể`, id: v.id, bai_goc: b.ma, noi_dung: v.de_bai }], md })
      }
      if (laCu(v.anh)) them(v.anh, 'chung')
      if (laCu(v.anh_loi_giai)) them(v.anh_loi_giai, 'lg')
    }
    for (const n of nhom.values()) { n.hinh.sort((a, b) => a._ma.localeCompare(b._ma)); n.hinh.forEach((h) => delete h._ma) } // sort ổn định: cùng bài gốc giữ thứ tự tạo
  }
  return [...nhom.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, n]) => n)
}

let trinhDuyet = null
async function svgSangPng(tep) {
  trinhDuyet ??= await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
  const p = await trinhDuyet.newPage(); await p.setViewport({ width: 900, height: 700, deviceScaleFactor: 2 })
  await p.setContent(`<body style="margin:0;background:#fff"><img id="i" src="data:image/svg+xml;base64,${fs.readFileSync(tep).toString('base64')}" style="max-width:800px;min-width:300px"></body>`)
  const png = tep.replace(/.svg$/, '.png')
  await (await p.$('#i')).screenshot({ path: png }); await p.close()
  return png
}

const DUOI = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/svg+xml': 'svg', 'image/webp': 'webp', 'image/gif': 'gif' }
let tongHinh = 0, tongGoi = 0
for (const { ma, tieu_de, them, hinh: ds } of NHOM) {
  for (let i = 0, n = 1; i < ds.length; i += MOI_GOI, n++) {
    const goi = `${ma}-${n}`, dir = path.join(RA, goi)
    fs.mkdirSync(path.join(dir, 'cu'), { recursive: true })
    const viec = []
    let md = `# Gói ${goi} — ${tieu_de}\n\nMỗi mục = MỘT hình phải vẽ lại. Tên tệp ra phải đúng y như ghi.\n`
    for (const h of ds.slice(i, i + MOI_GOI)) {
      const res = await fetch(h.url)
      if (!res.ok) throw new Error(`tải ảnh cũ lỗi ${res.status}: ${h.url}`)
      const duoi = DUOI[(res.headers.get('content-type') || '').split(';')[0]] || 'png'
      let cu = path.join(dir, 'cu', `${h.ten}.${duoi}`)
      fs.writeFileSync(cu, Buffer.from(await res.arrayBuffer()))
      if (duoi === 'svg') cu = await svgSangPng(cu) // ảnh cũ dạng SVG ⇒ dựng thêm PNG để người/agent mở xem được
      viec.push({ ten: h.ten, kieu: h.kieu, url_cu: h.url, anh_cu: cu, cau: h.cau })
      md += `\n---\n\n## Tệp ra: \`${h.ten}.png\`\n\n- Kiểu: ${h.nhan_kieu}\n- Ảnh cũ: \`${cu.replace(/\\/g, '/')}\`\n${h.md}`
    }
    fs.writeFileSync(path.join(dir, 'viec.json'), JSON.stringify({ goi, ...them, hinh: viec }, null, 1))
    fs.writeFileSync(path.join(dir, 'viec.md'), md)
    console.log(`${goi.padEnd(16)} ${String(viec.length).padStart(2)} hình · ${tieu_de}`)
    tongHinh += viec.length; tongGoi++
  }
}
await trinhDuyet?.close()
console.log(`\n${tongGoi} gói · ${tongHinh} hình → ${RA}`)
