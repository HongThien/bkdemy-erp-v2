// Kiểm mig chuyên đề Hình (202610211633) TRONG ROLLBACK: node scripts/_test_chuyen_de_hinh.mjs [--mig file]
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0
const kt = (dk, ten, ct = '') => { if (dk) { ok++; console.log('  ✔', ten) } else { sai++; console.log('  ✘', ten, ct) } }
const loiKhi = async (s, a) => { await q('savepoint s'); try { await q(s, a); await q('release savepoint s'); return null } catch (e) { await q('rollback to savepoint s'); return e.message } }
try {
  await q('begin')
  const im = process.argv.indexOf('--mig'); if (im > 0) await q(fs.readFileSync(process.argv[im + 1], 'utf8'))
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const mhs = await q(`select m.id, m.ma, (select count(*)::int from hinh_bai b where b.mo_hinh_id = m.id and b.bo_qua_at is null and b.loai_cau = 'tu_luan') n
                         from hinh_mo_hinh m where m.phan = 'luyen' and m.khoi = '8' and m.neo_baitoan_id is null order by n desc limit 3`)
  kt(mhs.length >= 2 && mhs[0].n > 0, `K8 có mô hình luyện có bài (${mhs.map((m) => `${m.ma}:${m.n}`).join(', ')})`)
  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, nhanh, ban_do) values ('chuyen_de','[T] CĐ Hình','8','Toán','hinh','moi') returning id`)
  const [b1] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1,0,'buoi','Phần 1') returning id`, [tl.id])
  const [b2] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1,1,'buoi','Phần 2') returning id`, [tl.id])
  const [{ nd }] = await q(`select fn_tl_hl_dat_mo_hinh($1,$2,$3::uuid[]) nd`, [tl.id, b1.id, [mhs[0].id, mhs[1].id]])
  const bu = nd.buoi[0]
  kt(bu.mo_hinh.map((m) => m.id).join() === [mhs[0].id, mhs[1].id].join(), 'phần 1: 2 mô hình đúng thứ tự chọn')
  kt(bu.mo_hinh[0].bai.length === mhs[0].n, `mô hình 1 tự có ${bu.mo_hinh[0].bai.length}/${mhs[0].n} bài mặc định`)
  const b0 = bu.mo_hinh[0].bai[0]
  kt(b0 && b0.de_bai !== undefined && Array.isArray(b0.y) && b0.y.length > 0, `bài có đề + ${b0?.y.length} ý`)
  await q(`select fn_tl_hl_dat_mo_hinh($1,$2,$3::uuid[])`, [tl.id, b2.id, [mhs[2]?.id ?? mhs[1].id]])
  // giữ bài đã chỉnh khi đặt lại mô hình
  const giu = bu.mo_hinh[0].bai.slice(0, 1).map((x) => x.ma_bai)
  await q(`select fn_tl_hl_dat_bai($1,$2)`, [bu.mo_hinh[0].phan_id, giu])
  const [{ nd2 }] = await q(`select fn_tl_hl_dat_mo_hinh($1,$2,$3::uuid[]) nd2`, [tl.id, b1.id, [mhs[1].id, mhs[0].id]])
  kt(nd2.buoi[0].mo_hinh[1].bai.map((x) => x.ma_bai).join() === giu.join(), 'đổi thứ tự mô hình ⇒ bài đã chỉnh giữ nguyên')
  const tt = await q(`select id, loai_phan, cha_id, thu_tu from tai_lieu_phan where tai_lieu_id = $1 order by thu_tu`, [tl.id])
  const iB2 = tt.findIndex((p) => p.id === b2.id)
  kt(tt[0].id === b1.id && tt.slice(1, iB2).every((p) => p.cha_id === b1.id) && tt.slice(iB2 + 1).every((p) => p.cha_id === b2.id), 'thứ tự: phần 1 → con phần 1 → phần 2 → con phần 2')
  kt(new Set(tt.map((p) => p.thu_tu)).size === tt.length, 'thu_tu không trùng')
  let e = await loiKhi(`select fn_tl_hl_dat_bai($1,$2)`, [nd2.buoi[0].mo_hinh[0].phan_id, giu])
  kt(e && e.includes('mô hình khác'), 'chặn 1 bài ở 2 mô hình cùng phần', e)
  e = await loiKhi(`select fn_tl_hl_dat_bai($1,$2)`, [nd2.buoi[0].mo_hinh[0].phan_id, ['KHONG_CO']])
  kt(e && e.includes('không có trong kho'), 'chặn mã bài lạ', e)
  const [tlD] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do) values ('chuyen_de','[T] Đại','8','Toán','moi') returning id`)
  const [bD] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1,0,'buoi','Phần 1') returning id`, [tlD.id])
  e = await loiKhi(`select fn_tl_hl_dat_mo_hinh($1,$2,$3::uuid[])`, [tlD.id, bD.id, [mhs[0].id]])
  kt(e && e.includes('không phải chuyên đề Hình'), 'chuyên đề Đại không nhận mô hình Hình', e)
  const [{ ndAll }] = await q(`select fn_tl_hl_noi_dung($1) "ndAll"`, [tl.id])
  kt(ndAll.buoi.length === 2 && ndAll.tai_lieu.nhanh === 'hinh', 'nội dung cả tài liệu: 2 phần')
  kt(!(await q(`select has_function_privilege('anon','fn_tl_hl_dat_mo_hinh(uuid,uuid,uuid[])','execute') a`))[0].a, 'anon không gọi được')
} catch (e) { sai++; console.log('LỖI:', e.message, e.where ?? '') }
await q('rollback'); await c.end()
console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`)
process.exitCode = sai ? 1 : 0
