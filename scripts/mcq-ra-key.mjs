// RÀ form trắc nghiệm (dai_cau_form_tn) theo NHÂN CHỨNG ĐỘC LẬP scripts/lib/so-vn.mjs — chỉ ĐỌC, không ghi (18/10).
//   node --env-file=.env scripts/mcq-ra-key.mjs [--json ra.json]
// Nhóm:
//   DOC_SAI      đáp số kho là số thuần mà phương án ĐÚNG viết khác chữ số / khác giá trị (vd "12,61" → "12;61", "30 000" → "0")
//   PHAN_SO      đề/đáp số kho là SỐ THẬP PHÂN hoặc HỖN SỐ mà phương án là PHÂN SỐ (ca T105040103023)
//   KHAC_CHU     key_gia_tri khác chữ đáp số kho nhưng không thuộc 2 nhóm trên (phần lớn chỉ đổi thứ tự/cách viết — vô hại)
import pg from 'pg'
import { writeFileSync } from 'node:fs'
import { kiemKeyVoiDapAn, docDanhSachSo, coThapPhan, lamSachSo } from './lib/so-vn.mjs'
const args = process.argv.slice(2), outJ = args.includes('--json') ? args[args.indexOf('--json') + 1] : null
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const { rows } = await c.query(`
  select f.id, f.ma_cau, q.dang_chinh, b.ten_dang, q.noi_dung, q.dap_an, f.key_gia_tri, f.lua_chon, f.dap_an fa, f.da_duyet, f.ai_model, f.nguon, f.tu_choi_ly_do,
         (select count(*) from bai_test_cau t where t.form_tn_id = f.id)::int n_lam
  from dai_cau_form_tn f join dai_cau_hoi q on q.ma_cau = f.ma_cau left join dai_ban_do b on b.ma_dang = q.dang_chinh
  where f.xoa_at is null order by q.dang_chinh, f.ma_cau limit 50000`)
await c.end()
const coPhanSo = (t) => /\\[dt]?frac|\d\s*\/\s*\d/.test(String(t))
const hoiThapPhan = (nd) => /số thập phân|hỗn số|dạng thập phân/i.test(String(nd))
const laHonSo = (s) => /^-?\d+\s*\\[dt]?frac\{\d+\}\{\d+\}$|^-?\d+\s+\d+\/\d+$/.test(lamSachSo(s))
// giá trị (số thực, đủ để so) của phân số/hỗn số đơn "-\dfrac{a}{b}", "c\dfrac{a}{b}", "a/b" và của số thuần
const giaTriPhanSo = (t) => { const m = lamSachSo(t).match(/^(-?)(\d+)?\s*(?:\\[dt]?frac\{(\d+)\}\{(\d+)\}|(\d+)\/(\d+))$/); if (!m) return null; const v = (+(m[2] ?? 0)) + (+(m[3] ?? m[5])) / (+(m[4] ?? m[6])); return Math.round((m[1] ? -v : v) * 1e9) }
const giaTriSo = (s, opt) => { const d = docDanhSachSo(s, opt); if (d?.length === 1) return Math.round(Number(d[0].v.p) / Number(d[0].v.q) * 1e9); return giaTriPhanSo(s) }
const nhom = { DOC_SAI: [], PHAN_SO: [], KHAC_CHU: [] }
for (const r of rows) {
  const lc = r.lua_chon || [], dung = lc.find((x) => x.dung)
  const opt = { thapPhan: coThapPhan(r.dang_chinh) }
  const ds = docDanhSachSo(r.dap_an, opt)
  const loi = dung ? kiemKeyVoiDapAn({ dapAn: r.dap_an, key: null, textDung: dung.text, texts: [], dang: r.dang_chinh }) : ['không có phương án đúng']
  const tp = (ds && ds.some((x) => x.fmt.loai === 'thap_phan')) || laHonSo(r.dap_an)
  const row = { ma_cau: r.ma_cau, dang: r.dang_chinh, ten_dang: r.ten_dang, de: String(r.noi_dung).slice(0, 200), dap_an_kho: r.dap_an, key: r.key_gia_tri,
    phuong_an: lc.map((x) => (x.dung ? '✔ ' : '') + x.text), da_duyet: r.da_duyet, ai_model: r.ai_model, nguon: r.nguon, n_lam: r.n_lam, thu_hoi: !!r.tu_choi_ly_do?.startsWith('[18/10 Claude] Máy sinh') }
  if ((tp || (hoiThapPhan(r.noi_dung) && !coPhanSo(r.dap_an))) && lc.some((x) => coPhanSo(x.text))) { nhom.PHAN_SO.push({ ...row, gia_tri_dung: !dung || !coPhanSo(dung.text) ? null : giaTriPhanSo(dung.text) === giaTriSo(r.dap_an, opt) }); continue }
  if (loi.length) { nhom.DOC_SAI.push({ ...row, loi }); continue }
  const chu = (s) => lamSachSo(s).replace(/\\left|\\right/g, '').replace(/\s|\\[dt]?frac|[{}]/g, '')
  if (r.key_gia_tri != null && chu(r.key_gia_tri) !== chu(r.dap_an)) nhom.KHAC_CHU.push(row)
}
const tk = (a) => ({ tong: a.length, da_duyet: a.filter((x) => x.da_duyet).length, chua_duyet: a.filter((x) => !x.da_duyet).length, co_hs_lam: a.filter((x) => x.n_lam).length })
console.log('Tổng form hiệu lực:', rows.length)
for (const [k, a] of Object.entries(nhom)) console.log(k.padEnd(9), JSON.stringify(tk(a)))
if (outJ) { writeFileSync(outJ, JSON.stringify(nhom, null, 1)); console.log('→', outJ) }
