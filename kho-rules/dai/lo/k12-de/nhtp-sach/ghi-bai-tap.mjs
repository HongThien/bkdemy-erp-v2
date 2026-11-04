// ghi-bai-tap.mjs — nhập BÀI TẬP sách (Từ Tâm · NBV · PNL, phần Nguyên hàm – Tích phân) mà kho CHƯA có vào kho luyện (dạng chờ K12).
//   node kho-rules/dai/lo/k12-de/nhtp-sach/ghi-bai-tap.mjs [--ghi]      (mặc định chạy thử ROLLBACK)
// Nhập: TN đủ 4 PA + đáp án sách · tự luận có lời giải · Đ/S đủ 4 mệnh đề + đáp án từng ý đọc từ lời giải ("a) đúng/sai") · KHÔNG công thức hỏng/hình.
// nguon='le', nguon_giai='nguoi' (đáp án của sách), da_duyet=false; Đ/S ⇒ kho Đ/S chủ đề NCD00095. Chạy lại không nhân đôi.
import fs from 'node:fs'
import pg from 'pg'
import { insertCauBatch } from '../../../../../scripts/_kho_insert.mjs'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const CHU_DE = 'NCD00095'
const miss = JSON.parse(fs.readFileSync('kho-rules/dai/lo/k12-de/nhtp-sach/chua-co-that.json', 'utf8'))
const cauList = [], bo = {}
const dem = (k) => { bo[k] = (bo[k] || 0) + 1 }
const nfc = (s) => String(s ?? '').normalize('NFC')
for (const x of miss) {
  const text = JSON.stringify([x.noi_dung, x.lua_chon, x.menh_de, x.loi_giai])
  if (/EQ-FAILED|omml|\[\[eq|\[\[img/i.test(text)) { dem('cong_thuc_hong_hoac_hinh'); continue }
  const o = { dang_chinh: 'CHUA', khoi: '12', loai_cau: x.loai_cau, noi_dung: x.noi_dung.trim(), nguon: 'le', nguon_giai: 'nguoi', ten_de_goc: `${x.nguon} · ${x.file.replace(/\.docx$/i, '')}`.slice(0, 200) }
  if (x.loai_cau === 'trac_nghiem') {
    if (!x.lua_chon || x.lua_chon.length !== 4 || !/^[A-D]$/.test(x.dap_an ?? '')) { dem('tn_thieu_dap_an'); continue }
    o.lua_chon = x.lua_chon; o.dap_an = x.dap_an; if (x.loi_giai) o.loi_giai = x.loi_giai
  } else if (x.loai_cau === 'tu_luan') {
    if (!x.loi_giai) { dem('tu_luan_khong_loi_giai'); continue }
    o.loi_giai = x.loi_giai
  } else if (x.loai_cau === 'dung_sai') {
    if (!x.menh_de || x.menh_de.length !== 4) { dem('ds_khong_4_y'); continue }
    const ans = ['a', 'b', 'c', 'd'].map((ch) => { const m = nfc(x.loi_giai ?? '').match(new RegExp('(?:^|\\n)\\s*' + ch + '\\)\\s*(đúng|sai)', 'i')); return m ? (/đúng/i.test(m[1]) ? 'D' : 'S') : null })
    if (ans.some((a) => !a)) { dem('ds_khong_doc_duoc_dap_an'); continue }
    o.menh_de = x.menh_de.map((m, i) => ({ noi_dung: m.noi_dung, dap_an: ans[i], loi_giai: null }))
    if (x.loi_giai) o.loi_giai = x.loi_giai
  } else { dem('tra_loi_ngan_thieu_dap_an'); continue }
  cauList.push(o)
}
console.log('đủ điều kiện nhập:', cauList.length, '· loại:', JSON.stringify(bo))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList })
  const moi = r.maCauList.map((m, i) => ({ m, i })).filter((x) => !r.trung.some((t) => t.idx === x.i))
  console.log(`insert: mới ${moi.length} · trùng kho/lô ${r.trung.length}`)
  const ds = moi.filter((x) => cauList[x.i].loai_cau === 'dung_sai').map((x) => x.m)
  if (ds.length) { const k = await c.query(`insert into dai_bdm_kho_ds (ma_cau, chu_de_id, nguon) select unnest($1::text[]), $2, 'ai' on conflict (ma_cau) do nothing`, [ds, CHU_DE]); console.log(`kho Đ/S ${CHU_DE}: +${k.rowCount}/${ds.length}`) }
  const by = {}; for (const x of moi) by[cauList[x.i].loai_cau] = (by[cauList[x.i].loai_cau] || 0) + 1
  console.log('theo loại:', JSON.stringify(by))
  if (GHI) fs.writeFileSync('kho-rules/dai/lo/k12-de/nhtp-sach/ghi-bai-tap-ket-qua.json', JSON.stringify(moi.map((x) => ({ ma_cau: x.m, loai: cauList[x.i].loai_cau }))))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
