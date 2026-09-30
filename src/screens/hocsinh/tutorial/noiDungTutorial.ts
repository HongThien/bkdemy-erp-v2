// ============================================================================
// NỘI DUNG tutorial "Hành trình tân thủ" app HS — Thùy SỬA CHỮ Ở ĐÂY, không cần đụng code màn.
// Mỗi chương = 1 tính năng. Mỗi `buoc` = 1 câu người dẫn đường nói; `soi` = phần nào trên màn mô phỏng sáng lên khi nói câu đó
// (mã phần tử khai trong MoPhongTutorial.tsx — để trống = không soi phần nào).
// Số liệu (10 câu, 80%, 30 điểm/ngày…) lấy theo luật ĐANG CHẠY 30/09 — đổi luật thì sửa cả ở đây.
// Icon: `o` = id ô trong anhO của style đang dùng (đổi style tự đổi icon) · `gami` = đường dẫn hình gamification (gami/hinh.ts).
// ============================================================================

export type BuocTutorial = { noi: string; soi?: string }
export type ChuongTutorial = {
  id: 'tu_luyen' | 'chu_de' | 'thu_thach' | 'nhiem_vu' | 'rank' | 'the_gioi'
  ten: string
  phu: string            // 1 dòng dưới tên chương trên bản đồ
  icon: { o?: string; gami?: string }
  buoc: BuocTutorial[]
  kyNang: string          // dòng trên màn "Mở khoá kỹ năng"
}

export const NGUOI_DAN = 'Người dẫn đường'

export const MO_DAU = [
  'Chào mừng em đến với BK Academy!',
  'Mình sẽ dẫn em đi 6 chặng ngắn để biết app có gì. Mỗi chặng chưa tới 1 phút.',
  'Chạm vào màn hình để nghe tiếp nhé.',
]

export const KET_THUC = {
  tieuDe: 'Hoàn thành hành trình tân thủ!',
  noi: 'Vậy là em đã biết hết các khu trong app. Giờ vào luyện thật thôi — Thử thách hôm nay đang chờ em đấy.',
  nut: 'Vào app',
}

export const CHUONG: ChuongTutorial[] = [
  {
    id: 'tu_luyen', ten: 'Tự luyện', phu: 'Luyện thêm ngoài giờ học', icon: { o: 'tu_luyen' },
    kyNang: 'Tự luyện — 10 câu mỗi lượt, không giới hạn lượt',
    buoc: [
      { noi: 'Chặng 1: Tự luyện. Ở màn chính, chạm ô Tự luyện.', soi: 'o_home' },
      { noi: 'Chọn Tổng hợp. Mỗi lượt có 10 câu.', soi: 'the_tong_hop' },
      { noi: 'Máy tự chọn câu cho em: 6 câu ở dạng em đang yếu, 4 câu ôn lại dạng đã học. Em yếu chỗ nào thì luyện đúng chỗ đó.', soi: 'phan_bo' },
      { noi: 'Làm xong là biết đúng sai ngay. Muốn luyện nữa thì bấm Luyện lượt mới — làm bao nhiêu lượt cũng được.', soi: 'ket_qua' },
    ],
  },
  {
    id: 'chu_de', ten: 'Tự luyện chủ đề', phu: 'Chọn đúng dạng muốn luyện', icon: { o: 'so_tay' },
    kyNang: 'Tự luyện chủ đề — tự chọn dạng, 10 câu chỉ dạng đó',
    buoc: [
      { noi: 'Chặng 2: muốn luyện đúng một dạng thì vào Tự luyện, chọn Theo chủ đề.', soi: 'the_chu_de' },
      { noi: 'Số % cạnh mỗi dạng là mức em đang nắm dạng đó. Dạng yếu nhất luôn đứng đầu danh sách.', soi: 'ds_dang' },
      { noi: 'Dạng ghi "Chưa đánh giá" là em chưa làm đủ để máy đo.', soi: 'chua_danh_gia' },
      { noi: 'Bật Chỉ câu mới thì em không gặp lại câu đã làm trong khoảng 1 tháng gần đây.', soi: 'cau_moi' },
      { noi: 'Chạm một dạng là vào 10 câu chỉ của dạng đó.', soi: 'dang_dau' },
    ],
  },
  {
    id: 'thu_thach', ten: 'Thử thách', phu: 'Đúng từ 80% là có Điểm Rank', icon: { gami: 'nhiem-vu/N1.png' },
    kyNang: 'Thử thách — đúng 8/10 trở lên để lấy Điểm Rank',
    buoc: [
      { noi: 'Chặng 3: Thử thách. Nó giống Tổng hợp — 10 câu — nhưng có điểm thưởng.', soi: 'the_thu_thach' },
      { noi: 'Đúng từ 8 câu trở lên là vượt Thử thách.', soi: 'cham_cau' },
      { noi: 'Đúng 8 câu được 10 Điểm Rank, 9 câu được 20, cả 10 câu được 30.', soi: 'bang_thuong' },
      { noi: 'Mỗi ngày lấy tối đa 30 điểm, mỗi tháng 600. Hết phần điểm em vẫn làm tiếp được, câu làm vẫn tính là luyện tập.', soi: 'tien_do' },
    ],
  },
  {
    id: 'nhiem_vu', ten: 'Nhiệm vụ', phu: 'Việc ngày · tuần · tháng', icon: { gami: 'nhiem-vu/ruong_mo.png' },
    kyNang: 'Nhiệm vụ — xong việc lên Chặng, nhận EXP đổi xu',
    buoc: [
      { noi: 'Chặng 4: Nhiệm vụ. Vào Tự luyện, chạm Nhiệm vụ ở dưới cùng. Nhiệm vụ mở từ ngày 01/10.', soi: 'link_nhiem_vu' },
      { noi: 'Mỗi ngày có 3 việc nhỏ: vượt 1 Thử thách, luyện 20 câu, sửa 2 câu dạng em từng sai. Mỗi việc +10 Điểm Chặng.', soi: 'khoi_ngay' },
      { noi: 'Hôm nào lỡ thì việc được giữ 3 ngày cho em làm bù. Xong 2 việc trong ngày là có 1 lượt quay May mắn.', soi: 'quay' },
      { noi: 'Việc tuần mỗi việc +40, việc tháng mỗi việc +150. Xong 12 việc trong tuần thì mở rương tuần +75 EXP.', soi: 'khoi_tuan' },
      { noi: 'Đủ 50 Điểm Chặng là lên 1 cấp, mỗi cấp +25 EXP. Cuối tháng EXP đổi ra xu.', soi: 'chang' },
    ],
  },
  {
    id: 'rank', ten: 'Rank và Bảng xếp hạng', phu: '10 bậc, đua cả mùa', icon: { o: 'xep_hang' },
    kyNang: 'Rank — tích Điểm Rank cả mùa, leo 10 bậc',
    buoc: [
      { noi: 'Chặng 5: Rank. Vào Tự luyện, chạm Rank của em.', soi: 'the_bac' },
      { noi: 'Điểm Rank đến từ việc học thật: mỗi bài ET 100 điểm, BTVN đúng hạn 100 (muộn 50), Thử thách 10 đến 30, bài MT tới 1.000 điểm theo thứ hạng.', soi: 'nguon_diem' },
      { noi: 'Điểm cộng dồn cả mùa để leo 10 bậc, từ Novice lên Supreme God. Mùa chạy từ 1/7 đến 30/6 năm sau.', soi: 'thang_bac' },
      { noi: 'Bảng đua tháng xếp em với các bạn cùng khối trong tháng này. Bảng tháng không làm đổi bậc của em.', soi: 'bang_thang' },
      { noi: 'Mỗi môn có Rank riêng. Đổi môn ở thanh chọn môn trên màn chính.', soi: 'mon' },
    ],
  },
  {
    id: 'the_gioi', ten: 'Thế giới BK', phu: 'Khoe thành tích, thả tim bạn bè', icon: { o: 'the_gioi' },
    kyNang: 'Thế giới BK — khoe thành tích thật, tương tác với bạn',
    buoc: [
      { noi: 'Chặng cuối: Thế giới BK — nơi xem các bạn ở BK vừa đạt gì. Có 3 kênh: Thế giới, Bạn bè, Lớp.', soi: 'tab' },
      { noi: 'Khi em có thành tích — ET 10 điểm, luyện 50 câu đúng trong ngày, nhất buổi… — nó hiện ở mục Thành tích chờ em khoe.', soi: 'cho_khoe' },
      { noi: 'Chạm Khoe để đăng lên. Mỗi ngày khoe được 3 lần, thành tích khoe được trong 3 ngày.', soi: 'nut_khoe' },
      { noi: 'Bấm Thích để thả cảm xúc, bấm Bình luận để chọn câu khen có sẵn hoặc sticker. Mỗi tin em bình luận tối đa 3 lần.', soi: 'tuong_tac' },
      { noi: 'Muốn kết bạn thì tìm theo tên, mã HS hoặc lớp. Bạn đồng ý là hai đứa thấy tin của nhau.', soi: 'ket_ban' },
    ],
  },
]
