// ORACLE tạm — số KỲ VỌNG của tab Trợ lý cho 1 nhân sự, tính thẳng bằng SQL, độc lập app.
// Dùng để đối chiếu bằng mắt sau khi đăng nhập. CHỈ SELECT, không ghi gì.
//   node scripts/_chk_troly_nguon.mjs NS001
import { readFileSync } from 'node:fs'
import pg from 'pg'
const MA = process.argv[2] ?? 'NS001'
const env = readFileSync('.env', 'utf8')
const url = env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url })
await c.connect()
const homNay = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
const one = async (sql) => (await c.query(sql)).rows[0]?.n ?? '?'

const ns = (await c.query(`select id, ho_ten from nhan_su where ma_ns=$1`, [MA])).rows[0]
if (!ns) { console.log('Không có', MA); await c.end(); process.exit(0) }
console.log(`\n=== ${MA} · ${ns.ho_ten} · hôm nay ${homNay} ===`)
const id = ns.id

// ① việc buổi (GV/TG) — buổi thường của lớp mình phân công, khâu chưa đóng
console.log('① Buổi học — lớp được phân công     :', await one(`select count(*) n from phan_cong_lop where nhan_su_id='${id}'`))
console.log('   buổi thường chưa đóng đủ 4 khâu  :', await one(`
  select count(*) n from buoi_hoc b
  where b.loai='thuong' and b.trang_thai<>'huy'
    and b.lop_id in (select lop_id from phan_cong_lop where nhan_su_id='${id}')
    and (b.danh_gia_xong_at is null or b.ingame_dong_at is null or b.et_dong_at is null or b.btvn_dong_at is null)`))
// ② điểm danh — ca trực
console.log('② Điểm danh — ca được phân trực     :', await one(`select count(*) n from phan_cong_ca where nhan_su_id='${id}'`))
// ③④ report/tan + prep chạy theo phan_cong_ca nên cùng điều kiện trên
// ⑤ đợt đuổi chờ chốt kế hoạch, theo môn học thuật của người này
console.log('⑤ Đợt đuổi chờ chốt (toàn hệ)       :', await one(`select count(*) n from bo_tro_duoi where trang_thai='can_duoi' and dang_duyet_at is null`))
// ⑥ bài test chờ scan (pool Ops)
console.log('⑥ Bài test đã chấm chờ scan (pool)  :', await one(`select count(*) n from ca_test where trang_thai='hoan_thanh' and bai_da_cham_url is null`))
// ⑦ việc phát triển tôi làm
console.log('⑦ Task phát triển của tôi (đang mở) :', await one(`select count(*) n from viec where nguoi_lam_id='${id}' and trang_thai in ('moi_giao','dang_lam','tra_lai')`))
// ⑧ việc tôi giao, chờ tôi nghiệm thu
console.log('⑧ Chờ tôi nghiệm thu                :', await one(`select count(*) n from viec where nguoi_giao_id='${id}' and trang_thai='cho_nghiem_thu'`))
// ⑨ lịch dạy hôm nay (buổi chưa mở → rổ "dự kiến")
console.log('⑨ Lịch dạy HÔM NAY (lớp của tôi)    :', await one(`
  select count(*) n from thoi_khoa_bieu t join lop l on l.id=t.lop_id
  where t.lop_id in (select lop_id from phan_cong_lop where nhan_su_id='${id}')
    and t.thu = (case extract(dow from date '${homNay}') when 0 then 8 else extract(dow from date '${homNay}')+1 end)
    and t.hieu_luc_tu <= '${homNay}' and (t.hieu_luc_den is null or t.hieu_luc_den >= '${homNay}')
    and l.trang_thai='dang_hoc' and l.ngay_khai_giang <= '${homNay}'`))
console.log('   trong đó buổi ĐÃ mở              :', await one(`
  select count(*) n from buoi_hoc where ngay='${homNay}' and loai='thuong' and trang_thai<>'huy'
    and lop_id in (select lop_id from phan_cong_lop where nhan_su_id='${id}')`))
await c.end()
