// Seed 1 doc BTVN DEMO (lớp 11B1) trộn 3 loại câu để TEST test online trong app.
// Xoá được bằng nút Xoá ở Kho tài liệu, hoặc: node scripts/seed_demo_test_online.mjs --xoa
import pg from 'pg'
import { readFileSync } from 'fs'
const url = readFileSync('.env', 'utf8').split('\n').find((l) => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()
const TEN = 'DEMO Test online — 11B1'
const TEN_ET = 'DEMO ET (thi) — 11B1'
const NGAY = '2026-07-10'
const NGAY_ET = '2026-07-11'

const lop = (await c.query("select id from lop where ten_lop='11B1' limit 1")).rows[0]
if (!lop) { console.error('không thấy lớp 11B1'); process.exit(1) }

// dọn demo cũ (idempotent) — kèm bai_test đã phát hành (nguon set null khi xoá doc → dọn tay)
const oldDocs = (await c.query('select id from tai_lieu where ten = any($1)', [[TEN, TEN_ET]])).rows.map((r) => r.id)
if (oldDocs.length) await c.query('delete from bai_test where nguon_tai_lieu_id = any($1)', [oldDocs])
await c.query("delete from dai_cau_hoi where ma_cau='DCDEMO01'")
await c.query('delete from tai_lieu where ten = any($1)', [[TEN, TEN_ET]])
if (process.argv.includes('--xoa')) { console.log('đã xoá demo (BTVN + ET)'); await c.end(); process.exit(0) }

// chọn câu khối 11 HỢP LỆ: 2 trắc nghiệm (lua_chon mảng ≥2 + dap_an A-D) + 1 trả lời ngắn (đáp án SỐ)
const tn = (await c.query(`
  select q.ma_cau, q.dang_chinh from dai_cau_hoi q join dai_ban_do b on b.ma_dang=q.dang_chinh
  where b.khoi='11' and q.loai_cau='trac_nghiem'
    and jsonb_typeof(q.lua_chon)='array' and jsonb_array_length(q.lua_chon)>=2
    and q.dap_an ~ '^[A-D]$' limit 2`)).rows
const tln = (await c.query(`
  select q.ma_cau, q.dang_chinh from dai_cau_hoi q join dai_ban_do b on b.ma_dang=q.dang_chinh
  where b.khoi='11' and q.loai_cau='tra_loi_ngan'
    and q.dap_an ~ '^[-+]?[0-9]+([.,][0-9]+)?$' limit 1`)).rows
// Ưu tiên dạng khối 11 ĐÃ CÓ lý thuyết → câu đúng/sai sẽ hiện nút "Gợi ý" (không seed LT giả).
const dangLT = (await c.query("select l.ma_dang from dai_dang_ly_thuyet l join dai_ban_do b on b.ma_dang=l.ma_dang where b.khoi='11' and coalesce(l.noi_dung,'')<>'' limit 1")).rows[0]?.ma_dang
const dang = dangLT ?? tn[0]?.dang_chinh ?? (await c.query("select ma_dang from dai_ban_do where khoi='11' limit 1")).rows[0].ma_dang
console.log('trắc nghiệm:', tn.map((x) => x.ma_cau), '· trả lời ngắn:', tln.map((x) => x.ma_cau), '· dạng ĐS (có LT:', !!dangLT, ')', dang)

// seed 1 câu đúng/sai structured
const menhDe = [
  { noi_dung: 'Hàm số $y=x^2$ đồng biến trên $(0;+\\infty)$.', dap_an: 'D', ma_dang: dang, loi_giai: 'đạo hàm $2x>0$ khi $x>0$.' },
  { noi_dung: 'Đồ thị $y=x^2$ đi qua điểm $(1;2)$.', dap_an: 'S', ma_dang: dang, loi_giai: 'thay $x=1$ được $y=1$, không phải 2.' },
  { noi_dung: 'Hàm số $y=x^2$ là hàm chẵn.', dap_an: 'D', ma_dang: dang, loi_giai: '$f(-x)=f(x)$.' },
  { noi_dung: 'Giá trị nhỏ nhất của $y=x^2$ bằng $-1$.', dap_an: 'S', ma_dang: dang, loi_giai: 'GTNN = 0 tại $x=0$.' },
]
await c.query("insert into dai_cau_hoi(ma_cau,dang_chinh,loai_cau,noi_dung,menh_de,nguon,nguon_giai) values('DCDEMO01',$1,'dung_sai','Cho hàm số $y=x^2$. Xét tính đúng/sai các mệnh đề:',$2::jsonb,'le','nguoi')", [dang, JSON.stringify(menhDe)])

// tạo doc BTVN + phan btvn + câu (thứ tự: 2 TN, 1 ĐS, 1 TLN)
const tl = (await c.query("insert into tai_lieu(loai,ten,khoi,mon,lop_id,ngay) values('btvn',$1,'11','Toán',$2,$3) returning id", [TEN, lop.id, NGAY])).rows[0]
const phan = (await c.query("insert into tai_lieu_phan(tai_lieu_id,thu_tu,loai_phan,ref_ma) values($1,0,'btvn',$2) returning id", [tl.id, dang])).rows[0]
const caus = [...tn.map((x) => x.ma_cau), 'DCDEMO01', ...tln.map((x) => x.ma_cau)]
let tt = 0
for (const ma of caus) await c.query('insert into tai_lieu_cau(phan_id,ma_cau,thu_tu) values($1,$2,$3)', [phan.id, ma, tt++])
console.log(`\n✓ BTVN "${TEN}" (${caus.length} câu), bám 11B1 · ${NGAY}.`)

// ET doc (loai='et', phan 'custom') — cùng bộ câu, để test CHẾ ĐỘ THI
const tlEt = (await c.query("insert into tai_lieu(loai,ten,khoi,mon,lop_id,ngay) values('et',$1,'11','Toán',$2,$3) returning id", [TEN_ET, lop.id, NGAY_ET])).rows[0]
const phanEt = (await c.query("insert into tai_lieu_phan(tai_lieu_id,thu_tu,loai_phan,ref_ma,tieu_de) values($1,0,'custom',null,'ET') returning id", [tlEt.id])).rows[0]
let te = 0
for (const ma of caus) await c.query('insert into tai_lieu_cau(phan_id,ma_cau,thu_tu) values($1,$2,$3)', [phanEt.id, ma, te++])
console.log(`✓ ET "${TEN_ET}" (${caus.length} câu), bám 11B1 · ${NGAY_ET}.`)
console.log('\n→ Staff: Kho tài liệu → tìm "DEMO" → 📱 Phát hành online (cả 2). Rồi login HS0004/HS0004:')
console.log('   · BTVN = hiện đáp án ngay · ET = badge THI, nộp 1 lần mới hiện đáp án.')
await c.end()
