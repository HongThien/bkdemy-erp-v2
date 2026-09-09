// ============================================================================
// DANH MỤC LỆNH TRA CỨU VIẾT SẴN cho bot hỏi–đáp — "AI chọn lệnh, không viết SQL".
// ----------------------------------------------------------------------------
// VÌ SAO (CEO 29/08): "AI không trực tiếp query DB mà dùng các hàm có sẵn — mỗi lần
// viết lại lệnh thì lâu chết". Mỗi lệnh ở đây do NGƯỜI viết + test sẵn trên DB thật;
// AI chỉ chọn tên + điền tham số thô (tên lớp/tên HS nguyên văn — KHÔNG bao giờ điền
// id, đúng luật danh tính bám khoá tự nhiên). Câu nào chưa có lệnh → fallback SELECT
// tự do (query.mjs) — thấy fallback lặp lại nhiều thì thăng cấp thành lệnh mới ở đây.
//
// Khuôn 1 lệnh: { name, mo_ta, tham_so: {ten: 'mô tả'}, sql(p) → {text, values} }.
// - sql() trả câu PARAMETERIZED ($1, $2...) — giá trị đi theo values, không nối chuỗi.
// - Tham số lọc đều OPTIONAL trừ khi ghi (bắt buộc); bỏ trống = không lọc chiều đó.
// - Ngày mặc định tính theo giờ máy (máy VN): tuần này = T2→CN.
// - Logic nghiệp vụ chép từ src/lib (gami.ts, botro.ts...) — sửa logic ở lib thì NHỚ
//   đối chiếu lại đây (2 bản chép tay, chưa có nguồn chung — đánh đổi có ý thức để
//   bot chạy server không kéo được module browser).
// ============================================================================

const homNay = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
const congNgay = (ymd, n) => { const d = new Date(ymd + 'T00:00:00'); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
const dauTuan = () => { const d = new Date(); const lech = (d.getDay() + 6) % 7; return congNgay(homNay(), -lech) } // T2 tuần này
const like = (s) => (s?.trim() ? `%${s.trim()}%` : null)
const khoang = (p, macDinhTu) => [p.tu_ngay?.trim() || macDinhTu, p.den_ngay?.trim() || homNay()]

export const HOIDAP_TOOLS = [
  {
    name: 'thieu_btvn',
    mo_ta: 'HS thiếu BTVN (khong_lam / nop_muon / xin_phep) theo lớp hoặc khối, trong khoảng ngày. Mặc định: tuần này, toàn hệ. Chỉ đếm được buổi ĐÃ chấm BTVN — nói rõ điều này khi trả lời.',
    tham_so: { ten_lop: 'vd "8S1"', khoi: 'vd "8"', tu_ngay: 'YYYY-MM-DD', den_ngay: 'YYYY-MM-DD' },
    sql(p) {
      const [tu, den] = khoang(p, dauTuan())
      // ⚠ hoan_thanh/dung_han là cột ĐỜI CŨ (nay toàn false/null) — tín hiệu thật là
      // trang_thai_nop (soi data thật 29/08 mới lộ; đừng tin tên cột).
      return {
        text: `select bh.ngay, l.ten_lop, l.mon, hs.ho_ten, hs.ma_hs, kq.trang_thai_nop as tinh_trang
               from btvn_ket_qua kq
               join buoi_hoc bh on bh.id = kq.buoi_hoc_id and bh.trang_thai <> 'huy'
               join lop l on l.id = bh.lop_id
               join hoc_sinh hs on hs.id = kq.hoc_sinh_id
               where kq.trang_thai_nop in ('khong_lam', 'nop_muon', 'xin_phep')
                 and bh.ngay between $1 and $2
                 and ($3::text is null or l.ten_lop ilike $3)
                 and ($4::text is null or l.khoi = $4)
               order by bh.ngay, l.ten_lop, hs.ho_ten`,
        values: [tu, den, like(p.ten_lop), p.khoi?.trim() || null],
      }
    },
  },
  {
    name: 'vang_hoc',
    mo_ta: 'HS vắng (vang / vang_phep) theo lớp/khối, trong khoảng ngày. Mặc định: tuần này, toàn hệ.',
    tham_so: { ten_lop: 'vd "8S1"', khoi: 'vd "8"', tu_ngay: 'YYYY-MM-DD', den_ngay: 'YYYY-MM-DD' },
    sql(p) {
      const [tu, den] = khoang(p, dauTuan())
      return {
        text: `select bh.ngay, l.ten_lop, l.mon, hs.ho_ten, hs.ma_hs, bhh.diem_danh
               from buoi_hoc_hs bhh
               join buoi_hoc bh on bh.id = bhh.buoi_hoc_id and bh.trang_thai <> 'huy'
               join lop l on l.id = bh.lop_id
               join hoc_sinh hs on hs.id = bhh.hoc_sinh_id
               where bhh.diem_danh in ('vang', 'vang_phep')
                 and bh.ngay between $1 and $2
                 and ($3::text is null or l.ten_lop ilike $3)
                 and ($4::text is null or l.khoi = $4)
               order by bh.ngay, l.ten_lop, hs.ho_ten`,
        values: [tu, den, like(p.ten_lop), p.khoi?.trim() || null],
      }
    },
  },
  {
    name: 'bang_elo_exp',
    mo_ta: 'Bảng xếp hạng Elo + tổng EXP của HS đang học, lọc theo môn/khối/lớp. Mặc định top 20 theo Elo.',
    tham_so: { mon: 'Toán|Văn|Anh|KHTN', khoi: 'vd "8"', ten_lop: 'vd "8S1"', top: 'số dòng, mặc định 20' },
    sql(p) {
      return {
        text: `select hs.ho_ten, hs.ma_hs, hs.khoi, ge.mon, ge.elo, ge.sessions_played,
                      coalesce((select sum(el.amount) from gami_exp_ledger el
                                where el.hoc_sinh_id = hs.id and el.mon is not distinct from ge.mon), 0) as exp
               from gami_elo ge
               join hoc_sinh hs on hs.id = ge.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
               where ($1::text is null or ge.mon = $1)
                 and ($2::text is null or hs.khoi = $2)
                 and ($3::text is null or exists (select 1 from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                        where hl.hoc_sinh_id = hs.id and hl.trang_thai = 'dang_hoc' and l.ten_lop ilike $3))
               order by ge.elo desc
               limit $4`,
        values: [p.mon?.trim() || null, p.khoi?.trim() || null, like(p.ten_lop), Number(p.top) || 20],
      }
    },
  },
  {
    name: 'hoc_tap_hoc_sinh',
    mo_ta: 'Tổng quan MỘT học sinh theo tên: Elo/EXP từng môn + thống kê ET 30 ngày + BTVN 30 ngày. Trùng tên sẽ ra nhiều dòng — phân biệt bằng ma_hs rồi hỏi lại người dùng nếu cần.',
    tham_so: { ten_hoc_sinh: '(bắt buộc) tên nguyên văn từ câu hỏi' },
    sql(p) {
      return {
        text: `select hs.ho_ten, hs.ma_hs, hs.khoi, ge.mon, ge.elo, ge.sessions_played,
                      coalesce((select sum(el.amount) from gami_exp_ledger el
                                where el.hoc_sinh_id = hs.id and el.mon is not distinct from ge.mon), 0) as exp,
                      (select count(*) from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
                       where g.hoc_sinh_id = hs.id and sp.phase = 'et' and g.graded_at > now() - interval '30 days') as et_cau_30n,
                      (select count(*) from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
                       where g.hoc_sinh_id = hs.id and sp.phase = 'et' and g.result = 'correct'
                         and g.graded_at > now() - interval '30 days') as et_dung_30n,
                      (select count(*) from btvn_ket_qua kq join buoi_hoc b2 on b2.id = kq.buoi_hoc_id
                       where kq.hoc_sinh_id = hs.id and b2.ngay > current_date - 30
                         and kq.trang_thai_nop in ('khong_lam', 'nop_muon')) as btvn_thieu_30n
               from hoc_sinh hs
               left join gami_elo ge on ge.hoc_sinh_id = hs.id
               where hs.ho_ten ilike $1 and hs.trang_thai = 'dang_hoc'
               order by hs.ho_ten, ge.mon`,
        values: [like(p.ten_hoc_sinh)],
      }
    },
  },
  {
    name: 'hoc_phi_no',
    mo_ta: 'Hoá đơn học phí CHƯA THU ĐỦ (chua_thu / thu_mot_phan / qua_han) theo phụ huynh, kèm tên các con đang học. Lọc được theo kỳ (YYYY-MM).',
    tham_so: { ky: 'YYYY-MM, bỏ trống = mọi kỳ còn nợ' },
    sql(p) {
      const ky = p.ky?.trim() ? `${p.ky.trim()}-01` : null
      return {
        text: `select ph.ho_ten as phu_huynh, ph.so_dien_thoai, hd.ky, hd.trang_thai, hd.tong_tien,
                      (select string_agg(hs.ho_ten, ', ') from hoc_sinh hs
                       where hs.phu_huynh_id = ph.id and hs.trang_thai = 'dang_hoc') as cac_con
               from hoa_don hd
               join phu_huynh ph on ph.id = hd.phu_huynh_id
               where hd.trang_thai in ('chua_thu', 'thu_mot_phan', 'qua_han')
                 and ($1::date is null or hd.ky = $1)
               order by hd.ky, ph.ho_ten`,
        values: [ky],
      }
    },
  },
  {
    name: 'viec_dang_treo',
    mo_ta: 'Việc phát triển đang mở (mới giao / đang làm / chờ nghiệm thu / trả lại / hold), lọc theo tên người làm.',
    tham_so: { ten_nhan_vien: 'tên người làm, bỏ trống = cả team' },
    sql(p) {
      return {
        text: `select v.tieu_de, v.trang_thai, v.deadline, v.tien_do, nl.ho_ten as nguoi_lam, ng.ho_ten as nguoi_giao
               from viec v
               left join nhan_su nl on nl.id = v.nguoi_lam_id
               join nhan_su ng on ng.id = v.nguoi_giao_id
               where v.trang_thai in ('moi_giao', 'dang_lam', 'cho_nghiem_thu', 'tra_lai', 'hold')
                 and ($1::text is null or nl.ho_ten ilike $1)
               order by v.deadline nulls last, v.created_at`,
        values: [like(p.ten_nhan_vien)],
      }
    },
  },
  {
    name: 'buoi_hom_nay',
    mo_ta: 'Các buổi học của MỘT ngày (mặc định hôm nay): lịch từ TKB (kể cả buổi CHƯA MỞ — trang_thai=chua_mo) + buổi ngoài TKB đã mở (bù/bổ trợ/MT), kèm sĩ số có mặt/vắng.',
    tham_so: { ngay: 'YYYY-MM-DD, bỏ trống = hôm nay' },
    sql(p) {
      // ⚠ buoi_hoc CHỈ có dòng khi buổi ĐÃ MỞ (moBuoi) — lịch chuẩn của ngày phải derive
      // từ thoi_khoa_bieu (khái niệm "buổi ảo", xem gami.ts buoiAoCuaNgay). thu = isodow+1
      // (2=T2 … 8=CN — đã kiểm data thật).
      return {
        text: `with d as (select $1::date as ngay),
               mo as (select b.* from buoi_hoc b, d where b.ngay = d.ngay and b.trang_thai <> 'huy')
               select l.ten_lop, l.mon, t.gio_bat_dau, t.gio_ket_thuc,
                      coalesce(m.phong, t.phong) as phong, ns.ho_ten as nguoi_day,
                      coalesce(m.loai, 'thuong') as loai,
                      coalesce(m.trang_thai, 'chua_mo') as trang_thai,
                      (select count(*) from buoi_hoc_hs x where x.buoi_hoc_id = m.id and x.diem_danh = 'co_mat')::int as co_mat,
                      (select count(*) from buoi_hoc_hs x where x.buoi_hoc_id = m.id and x.diem_danh in ('vang', 'vang_phep'))::int as vang
               from thoi_khoa_bieu t
               join d on t.thu = extract(isodow from d.ngay) + 1
                     and t.hieu_luc_tu <= d.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay)
               join lop l on l.id = t.lop_id and l.trang_thai = 'dang_hoc'
               left join mo m on m.lop_id = t.lop_id and m.loai = 'thuong'
               left join nhan_su ns on ns.id = m.nguoi_day
               union all
               select coalesce(l2.ten_lop, '(không gắn lớp)'), l2.mon, m.gio_bat_dau, m.gio_ket_thuc,
                      m.phong, ns2.ho_ten, m.loai, m.trang_thai,
                      (select count(*) from buoi_hoc_hs x where x.buoi_hoc_id = m.id and x.diem_danh = 'co_mat')::int,
                      (select count(*) from buoi_hoc_hs x where x.buoi_hoc_id = m.id and x.diem_danh in ('vang', 'vang_phep'))::int
               from mo m
               left join lop l2 on l2.id = m.lop_id
               left join nhan_su ns2 on ns2.id = m.nguoi_day
               where m.lop_id is null or m.loai <> 'thuong'
               order by gio_bat_dau nulls last`,
        values: [p.ngay?.trim() || homNay()],
      }
    },
  },
  {
    name: 'tuyen_sinh_dem',
    mo_ta: 'Đếm ứng viên tuyển sinh theo level (L5/L6/L7) và trạng thái (đang chạy / loại / đã convert), lọc môn/khối.',
    tham_so: { mon: 'Toán|Văn|Anh|KHTN', khoi: 'vd "8"' },
    sql(p) {
      return {
        text: `select level, trang_thai, count(*)::int as so_luong
               from ung_vien
               where ($1::text is null or mon = $1) and ($2::text is null or khoi = $2)
               group by level, trang_thai
               order by level, trang_thai`,
        values: [p.mon?.trim() || null, p.khoi?.trim() || null],
      }
    },
  },
  {
    name: 'diem_et',
    mo_ta: 'Kết quả chấm ET theo buổi: mỗi dòng = 1 HS trong 1 buổi (số câu đúng/một phần/sai + điểm TB). Lọc theo lớp/HS/khoảng ngày. Mặc định: 30 ngày gần đây.',
    tham_so: { ten_lop: 'vd "8S1"', ten_hoc_sinh: 'tên HS', tu_ngay: 'YYYY-MM-DD', den_ngay: 'YYYY-MM-DD' },
    sql(p) {
      const [tu, den] = khoang(p, congNgay(homNay(), -30))
      return {
        text: `select bh.ngay, l.ten_lop, l.mon, hs.ho_ten, hs.ma_hs,
                      count(*) filter (where g.result = 'correct')::int as dung,
                      count(*) filter (where g.result = 'partial')::int as mot_phan,
                      count(*) filter (where g.result = 'wrong')::int as sai,
                      count(*)::int as tong_cau,
                      round(avg(g.points)::numeric, 2) as diem_tb_cau
               from gami_grades g
               join gami_session_problems sp on sp.id = g.problem_id and sp.phase = 'et'
               join buoi_hoc bh on bh.id = g.buoi_hoc_id
               left join lop l on l.id = bh.lop_id
               join hoc_sinh hs on hs.id = g.hoc_sinh_id
               where bh.ngay between $1 and $2
                 and ($3::text is null or l.ten_lop ilike $3)
                 and ($4::text is null or hs.ho_ten ilike $4)
               group by bh.ngay, l.ten_lop, l.mon, hs.ho_ten, hs.ma_hs
               order by bh.ngay desc, l.ten_lop, hs.ho_ten`,
        values: [tu, den, like(p.ten_lop), like(p.ten_hoc_sinh)],
      }
    },
  },
  {
    name: 'diem_mt',
    mo_ta: 'Điểm các kỳ thi/MT (bảng diem_thi): điểm, cơ bản/nâng cao, verdict đạt/gần đạt/không đạt. Lọc theo HS/khối/môn/loại kỳ (truong | mt_sat_hach | khao_sat_thang). Mặc định: 90 ngày gần đây.',
    tham_so: { ten_hoc_sinh: 'tên HS', khoi: 'vd "8"', mon: 'Toán|Văn|Anh|KHTN', loai: 'truong|mt_sat_hach|khao_sat_thang', tu_ngay: 'YYYY-MM-DD', den_ngay: 'YYYY-MM-DD' },
    sql(p) {
      const [tu, den] = khoang(p, congNgay(homNay(), -90))
      return {
        text: `select kt.ngay, kt.ten as ky_thi, kt.loai, kt.mon, kt.khoi, hs.ho_ten, hs.ma_hs,
                      dt.diem, dt.diem_co_ban, dt.diem_nang_cao, dt.verdict, dt.vuot_band
               from diem_thi dt
               join ky_thi kt on kt.id = dt.ky_thi_id
               join hoc_sinh hs on hs.id = dt.hoc_sinh_id
               where (kt.ngay is null or kt.ngay between $1 and $2)
                 and ($3::text is null or hs.ho_ten ilike $3)
                 and ($4::text is null or kt.khoi = $4)
                 and ($5::text is null or kt.mon = $5)
                 and ($6::text is null or kt.loai = $6)
               order by kt.ngay desc nulls last, hs.ho_ten`,
        values: [tu, den, like(p.ten_hoc_sinh), p.khoi?.trim() || null, p.mon?.trim() || null, p.loai?.trim() || null],
      }
    },
  },
  {
    name: 'bo_tro',
    mo_ta: 'Tình hình bổ trợ, tham số loai (bắt buộc): "bu" = HS vắng 30 ngày qua + đã xếp bù/ghi không-bù/còn chờ; "duoi" = case bổ trợ đuổi + tiến độ dạng; "yeu" = case bổ trợ yếu đang xử/đã xong + kết quả.',
    tham_so: { loai: '(bắt buộc) bu | duoi | yeu', ten_hoc_sinh: 'lọc theo tên HS' },
    sql(p) {
      const loai = p.loai?.trim()
      const ten = like(p.ten_hoc_sinh)
      if (loai === 'bu') return {
        text: `select hs.ho_ten, hs.ma_hs, l.ten_lop, bh.ngay as ngay_vang, v.diem_danh,
                      case when kb.id is not null then 'khong_bu: ' || kb.loai
                           when bu.id is not null then 'da_xep_bu'
                           else 'cho_xep_bu' end as tinh_trang
               from buoi_hoc_hs v
               join buoi_hoc bh on bh.id = v.buoi_hoc_id and bh.trang_thai <> 'huy'
               join lop l on l.id = bh.lop_id
               join hoc_sinh hs on hs.id = v.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
               left join bang_khong_bu kb on kb.buoi_hoc_hs_id = v.id
               left join buoi_hoc_hs bu on bu.bu_cho_buoi_id = bh.id and bu.hoc_sinh_id = v.hoc_sinh_id
               where v.diem_danh in ('vang', 'vang_phep') and bh.ngay > current_date - 30
                 and ($1::text is null or hs.ho_ten ilike $1)
               order by bh.ngay desc, hs.ho_ten`,
        values: [ten],
      }
      if (loai === 'duoi') return {
        text: `select hs.ho_ten, hs.ma_hs, l.ten_lop, d.trang_thai, d.ly_do, d.so_buoi_du_kien, d.created_at::date as mo_ngay,
                      (select count(*) from bo_tro_duoi_dang x where x.bo_tro_duoi_id = d.id)::int as tong_dang,
                      (select count(*) from bo_tro_duoi_dang x where x.bo_tro_duoi_id = d.id and x.day_at is not null)::int as da_day
               from bo_tro_duoi d
               join hoc_sinh hs on hs.id = d.hoc_sinh_id
               left join lop l on l.id = d.lop_id
               where ($1::text is null or hs.ho_ten ilike $1)
               order by (d.hoan_thanh_at is not null), d.created_at desc`,
        values: [ten],
      }
      if (loai === 'yeu') return {
        text: `select hs.ho_ten, hs.ma_hs, y.mon, y.trang_thai, y.muc, y.ket_qua, y.ly_do, y.created_at::date as mo_ngay,
                      (select count(*) from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id)::int as tong_dang,
                      (select count(*) from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id and x.dat = true)::int as dang_dat
               from bo_tro_yeu y
               join hoc_sinh hs on hs.id = y.hoc_sinh_id
               where ($1::text is null or hs.ho_ten ilike $1)
               order by (y.trang_thai <> 'dang_xu'), y.created_at desc`,
        values: [ten],
      }
      throw new Error('Tham số loai phải là: bu | duoi | yeu')
    },
  },
]
