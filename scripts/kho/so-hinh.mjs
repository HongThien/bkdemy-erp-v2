// so-hinh.mjs — BỘ ĐẾM HÌNH ĐỀ theo khối (spec-giai-bai.md §A8, §C12 — Thùy 15/11). Số tính ở DB (fn_kho_hinh_dem), script chỉ ghi sổ.
//   node scripts/kho/so-hinh.mjs                         — dựng kho-rules/SO-HINH.md (chỉ đọc DB)
//   node scripts/kho/so-hinh.mjs lenh --kho <dai|hgt|hinh_hoc|hinh_hoc_lop|hinh_luyen> (--khoi <k> | --ma <mã,mã…> | --de "<tên đề, khớp ten_de_goc>")
//        --ra-boi "<người ra lệnh>" [--ly-do "<…>"] [--ghi]  — RA LỆNH VẼ LẠI cho các câu có hình đề trong phạm vi (mặc định chạy thử, ROLLBACK)
//   Nhãn nguồn khi gắn hình: dùng ghiNhanHinh() (export) trong CÙNG transaction với lệnh gắn anh_de.
// Không chạy lượt nặng 17–22h (K22) — hàm đếm cả kho ~0,2–0,5 s.
import fs from 'node:fs'; import path from 'node:path'; import pg from 'pg'

export const KHO_HINH = { dai: 'dai_cau_hoi', hgt: 'hgt_cau_hoi', hinh_hoc: 'hinh_hoc_cau_hoi', hinh_hoc_lop: 'hinh_hoc_cau_lop', hinh_luyen: 'hinh_bai' }
export const NGUON_HINH = ['goc', 've_lai', 've_lenh', 've_moi']
// Đọc phần đuôi dòng **Hình:** trong tệp soạn: "<tệp> | nguon=ve_lai:ab" ⇒ { nguon: 've_lai', ma_loi: 'ab' }. Sai khuôn ⇒ throw (cổng trả lại).
export function docNhanHinh(s) {
  const m = String(s ?? '').match(/\|\s*nguon\s*=\s*(goc|ve_lai|ve_lenh|ve_moi)(?::([a-f]{1,6}))?\s*$/)
  if (!m) return null
  if ((m[1] === 've_lai') !== !!m[2]) throw new Error(`nhãn nguồn hình sai khuôn: "${s}" — ve_lai phải kèm mã lỗi a–f (ve_lai:ab), nhãn khác không kèm mã`)
  return { nguon: m[1], ma_loi: m[2] || null }
}
// Ghi một dòng nhãn — gọi trong transaction đang ghi anh_de. lenh_id: lệnh vẽ lại đang chờ của câu (nếu nguon='ve_lenh' mà không truyền ⇒ tự lấy lệnh mới nhất).
export async function ghiNhanHinh(client, { mon = 'Toán', kho, ma_cau, url, nguon, ma_loi = null, lenh_id = null, ghi_boi = 'claude_code' }) {
  if (!KHO_HINH[kho]) throw new Error('kho lạ: ' + kho)
  if (!NGUON_HINH.includes(nguon)) throw new Error('nguồn lạ: ' + nguon)
  if (nguon === 've_lenh' && !lenh_id) lenh_id = (await client.query(`select id from kho_hinh_lenh_ve where kho=$1 and ma_cau=$2 order by tao_at desc, id desc limit 1`, [kho, ma_cau])).rows[0]?.id ?? null
  await client.query(`insert into kho_hinh_nguon (mon, kho, ma_cau, url, nguon, ma_loi, lenh_id, ghi_boi) values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [mon, kho, ma_cau, url, nguon, ma_loi, lenh_id, ghi_boi])
}

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '../..')
const env = () => Object.fromEntries(fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const THU_TU = ['3', '4', '4T', '5', '5T', '6', '7', '8', '8T', '9', '10', '11', '12', '?']
const thuTu = (k) => { const i = THU_TU.indexOf(k); return i < 0 ? 99 : i }
const TEN_KHO = { dai: 'Đại', hgt: 'Hình giải tích', hinh_hoc: 'Hình (học)', hinh_hoc_lop: 'Hình — trên lớp', hinh_luyen: 'Hình luyện (bài)' }

async function soMd() {
  const E = env(); const c = new pg.Client({ connectionString: E.DATABASE_URL_RO || E.DATABASE_URL }); await c.connect()
  await c.query('begin transaction read only'); await c.query("set local statement_timeout = '20s'")
  const t = Date.now(); const rows = (await c.query('select * from fn_kho_hinh_dem($1)', ['Toán'])).rows; const ms = Date.now() - t
  const cho = (await c.query(`select l.kho, l.ma_cau, l.ra_boi, l.ly_do, to_char(l.tao_at at time zone 'Asia/Ho_Chi_Minh','DD/MM HH24:MI') luc
     from kho_hinh_lenh_ve l where not exists (select 1 from kho_hinh_nguon n where n.kho=l.kho and n.ma_cau=l.ma_cau and n.nguon<>'goc' and (n.tao_at, n.id) > (l.tao_at, 0))
     order by l.tao_at limit 200`)).rows
  await c.query('rollback'); await c.end()
  const cong = (a, k) => a.reduce((s, r) => s + r[k], 0)
  const theoMa = (a) => { const o = {}; for (const r of a) for (const [m, n] of Object.entries(r.ve_lai_theo_ma || {})) o[m] = (o[m] || 0) + n; return Object.keys(o).sort().map((m) => `${m}:${o[m]}`).join(' ') }
  const dong = (ten, a) => `| ${ten} | ${cong(a, 'co_hinh')} | ${cong(a, 'goc')} | ${cong(a, 've_lai')} | ${theoMa(a)} | ${cong(a, 've_lenh')} | ${cong(a, 've_moi')} | ${cong(a, 'chua_ro')} | ${cong(a, 'lenh_cho') || ''} |`
  const DAU = '| Khối | Có hình đề | Giữ gốc | Vẽ lại (gốc tệ) | Theo mã lỗi | Vẽ theo lệnh | Vẽ mới | Chưa rõ nguồn | Lệnh đang chờ |\n|---|---|---|---|---|---|---|---|---|'
  const khoi = [...new Set(rows.map((r) => r.khoi))].sort((a, b) => thuTu(a) - thuTu(b))
  const gio = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 16).replace('T', ' ')
  let md = `# SỔ HÌNH ĐỀ — theo khối\n\n> Tự sinh bởi \`scripts/kho/so-hinh.mjs\` lúc ${gio} (giờ VN) từ \`fn_kho_hinh_dem\` (${ms} ms) — KHÔNG sửa tay. Luật: \`spec-giai-bai.md\` §A8 (gốc ổn giữ · gốc quá tệ vẽ lại · có lệnh vẽ lại), §C12.\n`
  md += `> **Chưa rõ nguồn** = câu có hình đề mà chưa có nhãn khớp hình hiện tại (mọi ảnh ghi trước 15/11 nằm ở đây cho tới khi được xét / có lệnh).\n> Mã lỗi: a không đọc chắc · b cụt / dính chữ · c lộ đáp án · d vênh đề · e scan bẩn / méo · f hình dính nhau.\n\n`
  md += `## 1. Theo khối (gộp mọi kho)\n\n${DAU}\n` + khoi.map((k) => dong(k, rows.filter((r) => r.khoi === k))).join('\n') + `\n${dong('**Tổng**', rows)}\n`
  md += `\n## 2. Theo kho × khối\n`
  for (const kho of Object.keys(TEN_KHO)) {
    const a = rows.filter((r) => r.kho === kho); if (!a.length) continue
    md += `\n### ${TEN_KHO[kho]} (\`${kho}\`)\n\n${DAU}\n` + a.sort((x, y) => thuTu(x.khoi) - thuTu(y.khoi)).map((r) => dong(r.khoi, [r])).join('\n') + '\n'
  }
  md += `\n## 3. Lệnh vẽ lại đang chờ (${cho.length}${cho.length === 200 ? '+' : ''})\n\n`
  md += cho.length ? '| Kho | Mã câu | Ra lệnh | Lúc | Lý do |\n|---|---|---|---|---|\n' + cho.map((l) => `| ${l.kho} | ${l.ma_cau} | ${l.ra_boi} | ${l.luc} | ${l.ly_do ?? ''} |`).join('\n') + '\n' : 'Không có.\n'
  fs.writeFileSync(path.join(ROOT, 'kho-rules', 'SO-HINH.md'), md)
  console.log(`✔ kho-rules/SO-HINH.md · ${cong(rows, 'co_hinh')} hình đề · giữ gốc ${cong(rows, 'goc')} · vẽ lại ${cong(rows, 've_lai')} · theo lệnh ${cong(rows, 've_lenh')} · chưa rõ ${cong(rows, 'chua_ro')} · lệnh chờ ${cho.length} · ${ms} ms`)
}

async function raLenh(a) {
  const lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
  const kho = lay('--kho'), khoi = lay('--khoi'), ma = lay('--ma'), de = lay('--de'), raBoi = lay('--ra-boi'), lyDo = lay('--ly-do'), GHI = a.includes('--ghi')
  const bang = KHO_HINH[kho]
  if (!bang || !raBoi || [khoi, ma, de].filter(Boolean).length !== 1) { console.error('Dùng: so-hinh.mjs lenh --kho <kho> (--khoi <k> | --ma <mã,…> | --de "<ten_de_goc>") --ra-boi "<người>" [--ly-do "…"] [--ghi]'); process.exit(2) }
  const E = env(); const c = new pg.Client({ connectionString: E.DATABASE_URL }); await c.connect()
  try {
    await c.query('begin'); await c.query("set local statement_timeout = '20s'")
    const khoa = kho === 'hinh_luyen' ? 'ma_bai' : 'ma_cau'
    const xoa = kho === 'hinh_luyen' ? '' : 'and c.xoa_at is null'
    let dk, p
    if (ma) { dk = `c.${khoa} = any($1)`; p = [ma.split(',').map((x) => x.trim()).filter(Boolean)] }
    else if (de) { if (kho === 'hinh_luyen' || kho === 'hinh_hoc_lop') throw new Error('--de chỉ dùng cho kho có ten_de_goc'); dk = `c.ten_de_goc = $1`; p = [de] }
    else {
      // khối: suy GIỐNG HỆT fn_kho_hinh_dem (sửa cách suy khối ⇒ sửa cả hai chỗ)
      if (kho === 'dai' || kho === 'hgt') { dk = `(case when substr(c.dang_chinh,3,2) ~ '^0[0-9]$' then substr(c.dang_chinh,4,1) else substr(c.dang_chinh,3,2) end) = $1`; p = [khoi] }
      else if (kho === 'hinh_hoc') { dk = `coalesce((select b.khoi from hinh_hoc_bai b where b.ma_bai = c.dang_chinh), case when length(c.dang_chinh)=10 then ltrim(substr(c.dang_chinh,3,2),'0') end) = $1`; p = [khoi] }
      else if (kho === 'hinh_hoc_lop') { dk = `(select b.khoi from hinh_hoc_bai b where b.ma_bai = c.dang_bai_id) = $1`; p = [khoi] }
      else { dk = `c.khoi = $1`; p = [khoi] }
    }
    const r = await c.query(`insert into kho_hinh_lenh_ve (kho, ma_cau, url_luc_ra, ly_do, ra_boi)
       select $${p.length + 1}, c.${khoa}, c.anh_de, $${p.length + 2}, $${p.length + 3} from ${bang} c
        where c.anh_de is not null and c.anh_de <> '' ${xoa} and ${dk} returning ma_cau`, [...p, kho, lyDo, raBoi])
    console.log(`${GHI ? '✔ ĐÃ GHI' : 'CHẠY THỬ (ROLLBACK)'} lệnh vẽ lại: ${r.rowCount} câu · kho ${kho} · ${khoi ? 'khối ' + khoi : ma ? 'mã chỉ định' : 'đề ' + de} · ra bởi ${raBoi}`)
    console.log('  ', r.rows.slice(0, 12).map((x) => x.ma_cau).join(' '), r.rowCount > 12 ? `… +${r.rowCount - 12}` : '')
    if (ma) { const thieu = p[0].filter((x) => !r.rows.some((y) => y.ma_cau === x)); if (thieu.length) console.log('  ⚠ không có hình đề / không thấy:', thieu.join(' ')) }
    await c.query(GHI ? 'commit' : 'rollback')
  } catch (e) { await c.query('rollback'); throw e } finally { await c.end() }
  if (GHI) await soMd()
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
if (isMain) { const a = process.argv.slice(2); if (a[0] === 'lenh') await raLenh(a.slice(1)); else await soMd() }
