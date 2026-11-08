// SINH LẠI form trắc nghiệm máy sinh ĐỌC SAI ĐÁP SỐ (sự cố 18/10: "12,61" → "12;61", "30 000" → "0") — Đại.
// Chọn form bằng NHÂN CHỨNG ĐỘC LẬP so-vn.mjs (không bằng regex trên key cũ): phương án đúng khác chữ số / khác giá
// trị với đáp số kho, thuộc dạng "sinh nhiễu từ đáp số" (ANSWER_DANG_LIST của mcq-auto.mjs), và parser MỚI đọc đúng.
//
//   node --env-file=.env scripts/mcq-sinh-lai-1810.mjs --pool <pool.json> [--ds <ds.json>]   → CHỈ ĐỌC: lập pool cho mcq-auto
//   node --env-file=.env scripts/mcq-sinh-lai-1810.mjs --thu-hoi <ds.json> [--ghi]          → thu hồi duyệt các form ĐÃ DUYỆT trong ds
//   rồi:  node scripts/mcq-auto.mjs <pool.json> --out <kq.json>
//         node scripts/mcq-sinh.mjs --verify <kq.json> --thay "<lý do>"
//         node scripts/mcq-sinh.mjs --ghi <kq.json> --thay "<lý do>" --model may-so-vn-1810     (form mới da_duyet=false)
// Bỏ qua 9 câu đã dựng TAY trong scripts/sua-bao-loi-hs-1810.mjs (SUA_FORM).
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { kiemKeyVoiDapAn } from './lib/so-vn.mjs'
import { sinhNhieuDapSoThucTe } from './lib/mini-dang.mjs'

const args = process.argv.slice(2)
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const GHI = args.includes('--ghi')
const LY_DO = '[18/10 Claude] Máy sinh đọc sai đáp số (phẩy thập phân / dấu cách hàng nghìn thành nhiều số) — cần sinh lại'
const TAY = ['077020101050', '077022220401080', 'T104010103026', 'T104010103028', 'T105040103023', 'T105040103028', 'T106020701004', 'T108010402015', 'T108010403018']
const ANSWER = new Set(readFileSync(new URL('./mcq-auto.mjs', import.meta.url), 'utf8').match(/const ANSWER_DANG_LIST = \[([\s\S]*?)\]\r?\n/)[1].match(/'[^']+'/g).map((x) => x.slice(1, -1)))

const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
try {
  if (opt('--pool')) await lapPool(opt('--pool'), opt('--ds'))
  else if (opt('--thu-hoi')) await thuHoi(opt('--thu-hoi'))
  else console.log('Dùng: --pool <pool.json> [--ds ds.json] | --thu-hoi <ds.json> [--ghi]')
} finally { await c.end() }

async function lapPool(fPool, fDs) {
  const { rows } = await c.query(`
    select f.id form_id, f.ma_cau, q.dang_chinh, b.ten_dang, q.noi_dung, q.dap_an, q.loi_giai, f.key_gia_tri key_cu, f.lua_chon lua_chon_cu,
           f.dap_an dap_an_cu, f.da_duyet, f.tu_choi_ly_do, (select count(*) from bai_test_cau t where t.form_tn_id = f.id)::int n_lam
    from dai_cau_form_tn f join dai_cau_hoi q on q.ma_cau = f.ma_cau join dai_ban_do b on b.ma_dang = q.dang_chinh
    where f.xoa_at is null and q.xoa_at is null and q.lua_chon is null and q.menh_de is null and q.dang_chinh = any($1)
    order by q.dang_chinh, f.ma_cau limit 20000`, [[...ANSWER]])
  const cau = [], khongSua = []
  for (const r of rows) {
    if (TAY.includes(r.ma_cau)) continue
    const dung = (r.lua_chon_cu || []).find((x) => x.dung)
    if (!dung || !kiemKeyVoiDapAn({ dapAn: r.dap_an, key: null, textDung: dung.text, dang: r.dang_chinh }).length) continue // form này đọc đúng
    const moi = sinhNhieuDapSoThucTe(r.dap_an, null, { dang: r.dang_chinh, noiDung: r.noi_dung })
    if (!moi || kiemKeyVoiDapAn({ dapAn: r.dap_an, key: null, textDung: moi.text, dang: r.dang_chinh }).length) { khongSua.push(r); continue }
    cau.push(r)
  }
  const pb = Object.fromEntries((await c.query(`select dap_an, count(*)::int n from dai_cau_form_tn where xoa_at is null group by 1`)).rows.map((x) => [x.dap_an, x.n]))
  writeFileSync(fPool, JSON.stringify({ sinh_luc: new Date().toISOString(), phan_bo_dap_an_hien_co: pb, cau }, null, 1))
  if (fDs) writeFileSync(fDs, JSON.stringify(cau.map((r) => ({ ma_cau: r.ma_cau, form_id: r.form_id, dang: r.dang_chinh, ten_dang: r.ten_dang, de: r.noi_dung, dap_an_kho: r.dap_an,
    key_cu: r.key_cu, lua_chon_cu: r.lua_chon_cu, dap_an_cu: r.dap_an_cu, da_duyet: r.da_duyet, n_lam: r.n_lam })), null, 1))
  const dem = (a) => ({ tong: a.length, da_duyet: a.filter((x) => x.da_duyet).length, chua_duyet: a.filter((x) => !x.da_duyet).length, co_hs_lam: a.filter((x) => x.n_lam).length })
  console.log('Sinh lại được:', JSON.stringify(dem(cau)), '→', fPool)
  if (khongSua.length) { console.log('Đọc sai mà parser mới CŨNG không đọc được (để nguyên, báo người):', khongSua.length); for (const r of khongSua) console.log('  ', r.ma_cau, JSON.stringify(r.dap_an)) }
}

async function thuHoi(fDs) {
  const ds = JSON.parse(readFileSync(fDs, 'utf8')).filter((x) => x.da_duyet).map((x) => x.form_id)
  await c.query('begin')
  const r = await c.query(`update dai_cau_form_tn set da_duyet = false, tu_choi_ly_do = $2
    where id = any($1::uuid[]) and da_duyet and xoa_at is null returning ma_cau`, [ds, LY_DO])
  console.log(`Thu hồi duyệt ${r.rowCount}/${ds.length} form`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '== ĐÃ GHI ==' : '== THỬ (rollback) — thêm --ghi để ghi thật ==')
}
