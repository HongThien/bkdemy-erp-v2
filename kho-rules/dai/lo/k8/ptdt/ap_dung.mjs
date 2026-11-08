// Áp kế hoạch sửa PTĐTTNT K8 vào dai_cau_hoi (1 transaction). Mặc định CHẠY THỬ (rollback). --ghi để ghi thật.
import pg from 'pg'
import fs from 'node:fs'
const D = 'kho-rules/dai/lo/k8/ptdt'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')]))
const GHI = process.argv.includes('--ghi')
const plan = JSON.parse(fs.readFileSync(D + '/plan_all.json', 'utf8'))
const cu = Object.fromEntries(JSON.parse(fs.readFileSync(D + '/cau.json', 'utf8')).map((q) => [q.ma_cau, q]))
const chuan = (s) => (s ?? '').replace(/\$|\s/g, '')
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
await c.query('begin')
const kq = { sua: 0, lech: [], thuHoiForm: 0, cauCoForm: 0, trongTaiLieu: 0, doiDe: 0, doiDap: 0, doiLg: 0 }
const nhatKy = []
for (const [ma, p] of Object.entries(plan)) {
  const hien = (await c.query('select noi_dung, dap_an, loi_giai from dai_cau_hoi where ma_cau=$1 and xoa_at is null', [ma])).rows[0]
  const goc = cu[ma]
  if (!hien) { kq.lech.push(ma + ' (không còn)'); continue }
  if (hien.noi_dung !== goc.noi_dung || (hien.dap_an ?? '') !== (goc.dap_an ?? '') || (hien.loi_giai ?? '') !== (goc.loi_giai ?? '')) { kq.lech.push(ma + ' (đã bị sửa sau lúc đọc)'); continue }
  const moi = { noi_dung: p.noi_dung ?? goc.noi_dung, dap_an: p.dap_an ?? goc.dap_an, loi_giai: p.loi_giai ?? goc.loi_giai }
  const doiDe = moi.noi_dung !== goc.noi_dung, doiDap = chuan(moi.dap_an) !== chuan(goc.dap_an), doiLg = moi.loi_giai !== goc.loi_giai
  if (doiDe) kq.doiDe++; if (doiDap) kq.doiDap++; if (doiLg) kq.doiLg++
  await c.query(`update dai_cau_hoi set noi_dung=$2, dap_an=$3, loi_giai=$4, kiem_may='khop', kiem_may_boi='claude_code', kiem_may_at=now(),
                   kiem_may_ghi=$5 where ma_cau=$1`, [ma, moi.noi_dung, moi.dap_an, moi.loi_giai, 'sympy 08/11: ' + p.ly_do.join(' · ').slice(0, 180)])
  kq.sua++
  const cf = (await c.query('select count(*)::int n from dai_cau_form_tn where ma_cau=$1 and xoa_at is null', [ma])).rows[0].n
  if (cf) kq.cauCoForm++
  if (cf && (doiDe || (chuan(goc.dap_an) && doiDap))) {
    const r = await c.query(`update dai_cau_form_tn set xoa_at=now(), tu_choi_ly_do=$2 where ma_cau=$1 and xoa_at is null`, [ma, 'thu hồi: sửa đề/đáp số câu PTĐTTNT K8 (08/11): ' + (chuan(goc.dap_an) || '∅') + ' → ' + chuan(moi.dap_an)])
    kq.thuHoiForm += r.rowCount
  }
  const tl = (await c.query('select count(*)::int n from tai_lieu_cau where ma_cau=$1', [ma])).rows[0].n
  if (tl) kq.trongTaiLieu++
  nhatKy.push({ ma_cau: ma, dang: goc.dang, ly_do: p.ly_do, cu: { noi_dung: goc.noi_dung, dap_an: goc.dap_an, loi_giai: goc.loi_giai }, moi, form_tn_thu_hoi: cf && (doiDe || (chuan(goc.dap_an) && doiDap)) ? cf : 0, trong_tai_lieu: tl })
}
console.log(kq)
if (GHI && !kq.lech.length) { await c.query('commit'); fs.writeFileSync('kho-rules/dai/lo/k8/ptdt-sua-08-11.json', JSON.stringify(nhatKy, null, 1)); console.log('ĐÃ GHI', nhatKy.length, 'câu · nhật ký: kho-rules/dai/lo/k8/ptdt-sua-08-11.json') }
else { await c.query('rollback'); console.log(GHI ? 'DỪNG (có câu lệch)' : 'chạy thử — đã rollback') }
await c.end()
