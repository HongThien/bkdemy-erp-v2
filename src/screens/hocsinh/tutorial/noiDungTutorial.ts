// ============================================================================
// NỘI DUNG tutorial "Hành trình tân thủ" app HS — Thùy SỬA CHỮ Ở ĐÂY, không cần đụng code màn.
// Mỗi chương = 1 tính năng, KHỚP 1-1 với một mục trong "Hướng dẫn chơi" (huongdan/noiDungHuongDan.ts, trường `tutorial` = id chương ở đây):
// hướng dẫn là bản ĐỌC đầy đủ, tutorial là bản TƯƠNG TÁC ngắn (< 1 phút/chặng). Đổi luật ⇒ sửa cả hai nơi.
// Mỗi `buoc` = 1 câu người dẫn đường nói; `soi` = phần nào trên màn mô phỏng sáng lên khi nói câu đó (mã khai trong MoPhongTutorial.tsx — để trống = không soi).
// Số liệu theo luật ĐANG CHẠY (kiểm kê code/DB 03/10/2026). Chưa chốt (Đấu trường 3 trận, ngưỡng điểm từng bậc, tỉ lệ vòng quay…) thì KHÔNG nêu số.
// Giọng: thân thiện nhưng trung tính, không ví von game (style game đã có người dẫn đường là nhân vật của style).
// Chuỗi làm bài CHƯA có chặng: DB đã xong nhưng màn ngọn lửa trên màn chính chưa có — thêm chặng khi màn có.
// Icon: `o` = id ô trong anhO của style đang dùng (đổi style tự đổi icon) · `gami` = đường dẫn hình gamification (gami/hinh.ts).
// ============================================================================

export type BuocTutorial = { noi: string; soi?: string; loc?: string } // loc = động tác của Lộc ép cho câu này (mặc định: chỉ tay ở câu đầu chặng, giải thích ở các câu sau)
export type IdChuong = 'giao_dien' | 'hoc_tap' | 'chu_de' | 'tu_luyen' | 'luot_that' | 'chuoi' | 'tro_choi' | 'thu_thach' | 'dau_chinh_phuc' | 'nhiem_vu' | 'bxh' | 'rank' | 'huy_hieu' | 'xu_may_man' | 'the_gioi'
export type ChuongTutorial = {
  id: IdChuong
  ten: string
  phu: string            // 1 dòng dưới tên chương trên bản đồ
  icon: { o?: string; gami?: string; emoji?: string }
  buoc: BuocTutorial[]
  kyNang: string          // dòng trên màn "Mở khoá kỹ năng"
}

export const NGUOI_DAN = 'Người dẫn đường'
/** Tên người dẫn khi style có nhân vật dẫn truyện hoạt hình (Skin.nguoiDan = Lộc) */
export const NGUOI_DAN_LOC = 'Lộc'

/** `{n}` = số chặng, thay lúc hiển thị */
export const MO_DAU = [
  'Chào mừng em đến với BK Academy!',
  'Mình sẽ dẫn em đi {n} chặng ngắn để biết app có gì. Mỗi chặng chưa tới 1 phút.',
  'Chạm vào màn hình để nghe tiếp nhé.',
]

/** Lời mở đầu khi người dẫn là Lộc (Skin.nguoiDan). `{n}` = số chặng. Động tác Lộc theo từng câu. */
export const MO_DAU_LOC: BuocTutorial[] = [
  { noi: 'Chào em! Mình là Lộc, tinh linh dẫn đường của BK Academy.', loc: 'greeting' },
  { noi: 'Mình sẽ dẫn em đi {n} chặng ngắn để biết app có gì, mỗi chặng chưa tới 1 phút.', loc: 'open_book' },
  { noi: 'App mở dần từng phần cho em đỡ ngợp. Có phần mới, mình sẽ ghé kể cho em nghe.', loc: 'explaining' },
  { noi: 'Chạm vào màn hình để nghe tiếp nhé.', loc: 'winking' },
]
export const KET_THUC_LOC = {
  tieuDe: 'Xong rồi, vào học thôi!',
  noi: 'Vậy là em đã biết các khu em đang có. Muốn nghe lại, chạm dấu ⋯ ở màn chính rồi chọn Hướng dẫn của Lộc nhé. Hẹn gặp lại em!',
  nut: 'Vào app',
}

export const KET_THUC = {
  tieuDe: 'Hoàn thành hành trình tân thủ!',
  noi: 'Vậy là em đã biết các khu chính trong app. Muốn đọc lại bất cứ phần nào, vào Thư viện BK rồi chọn Hướng dẫn chơi.',
  nut: 'Vào app',
}

import { rankBat } from '../phieuluu/coBat'

const CHUONG_TAT_CA: ChuongTutorial[] = [
  {
    id: 'giao_dien', ten: 'Nhân vật và giao diện', phu: 'Chọn cách dùng app hợp với em', icon: { o: 'thanh_tuu' },
    kyNang: 'Giao diện — chọn kiểu mặc định hoặc kiểu game, đổi bất cứ lúc nào',
    buoc: [
      { noi: 'Chặng 1: giao diện. App có hai cách dùng: kiểu mặc định gọn gàng, hoặc kiểu game có bản đồ, nhân vật và hiệu ứng.', soi: 'hai_kieu' },
      { noi: 'Nội dung học và cách tính điểm giống hệt nhau ở cả hai kiểu. Em thích kiểu nào thì chọn kiểu đó.', soi: 'hai_kieu' },
      { noi: 'Lần đầu vào khu Học tập, em chọn một trong 6 nhân vật chính. Đổi nhân vật không ảnh hưởng điểm hay tiến độ.', soi: 'nhan_vat' },
      { noi: 'Muốn đổi giao diện, vào Hồ sơ rồi chọn Giao diện. Có công tắc Hiệu ứng game và mức đồ hoạ cho máy yếu.', soi: 'cong_tac' },
    ],
  },
  {
    id: 'hoc_tap', ten: 'Khu Học tập', phu: 'Năm cách luyện ở một chỗ', icon: { o: 'tu_luyen' },
    kyNang: 'Khu Học tập — biết năm cách luyện và mỗi lượt có 10 câu',
    buoc: [
      { noi: 'Chặng 2: khu Học tập. Ở màn chính, chạm ô Học tập. Mọi cách luyện của em nằm ở đây.', soi: 'o_home' },
      { noi: 'Có 5 ô: Học theo chủ đề, Luyện dạng yếu, Đấu trường BK, Chinh phục BK và Giải Vô địch BK.{sr1}', soi: 'nam_o' },
      { noi: 'Mỗi lượt luyện có 10 câu, làm bao nhiêu lượt cũng được. Làm xong là biết đúng sai và có lời giải ngay.', soi: 'luot_10' },
      { noi: 'Môn nào chưa có kho câu hỏi, ví dụ Tiếng Anh, thì ô luyện bị khoá và có thông báo. Đó không phải lỗi.', soi: 'nam_o' },
    ],
  },
  {
    id: 'chu_de', ten: 'Học theo chủ đề', phu: 'Bản đồ: lục địa, chặng, quái vật', icon: { o: 'the_gioi' },
    kyNang: 'Học theo chủ đề — đi qua bản đồ, mỗi dạng bài là một màn',
    buoc: [
      { noi: 'Chặng 3: Học theo chủ đề. Em thấy cả thế giới của môn đang học. Mỗi chủ đề là một lục địa.', soi: 'the_gioi_map' },
      { noi: 'Chạm một lục địa để xem các chuyên đề, rồi chạm một chuyên đề để xem các dạng bài. Mỗi dạng là một công trình.', soi: 'cong_trinh' },
      { noi: 'Chạm vào công trình là vào thẳng màn đấu. Dạng chưa đo vẫn vào học được, dạng yếu còn quái, dạng đạt có cờ.', soi: 'trang_thai' },
      { noi: 'Trong màn đấu, cứ 3 câu thì tung một chiêu. Đúng cả 3 câu là chiêu mạnh nhất, đúng ít thì chiêu nhẹ, sai cả 3 thì quái đánh trả.', soi: 'combo' },
    ],
  },
  {
    id: 'tu_luyen', ten: 'Luyện dạng yếu', phu: 'Máy chọn câu cho đúng chỗ em yếu', icon: { o: 'tu_luyen_rieng' },
    kyNang: 'Luyện dạng yếu — 10 câu, ưu tiên dạng em còn yếu',
    buoc: [
      { noi: 'Chặng 4: Luyện dạng yếu. Trong khu Học tập, chạm ô Luyện dạng yếu.', soi: 'o_home' },
      { noi: 'Máy tự chọn 10 câu cho em. Phần lớn câu lấy từ dạng em đang yếu, số còn lại để ôn các dạng đã học.', soi: 'phan_bo' },
      { noi: 'Em cần đã có số đo, tức đã làm bài ở lớp hoặc trên app. Chưa có thì app báo chưa có dữ liệu.', soi: 'the_tong_hop' },
      { noi: 'Làm xong là biết đúng sai ngay. Muốn luyện nữa thì bấm Luyện lượt mới, làm bao nhiêu lượt cũng được.', soi: 'ket_qua' },
    ],
  },
  {
    id: 'luot_that', ten: 'Lượt học thật', phu: 'Khi nào lượt luyện được tính', icon: { o: 'et' },
    kyNang: 'Lượt học thật — làm nghiêm túc thì lượt mới được tính',
    buoc: [
      { noi: 'Chặng 5: lượt học thật. Chuỗi, nhiệm vụ và Bảng xếp hạng đều chỉ tính khi lượt luyện của em là lượt học thật.', soi: 'dk_cau' },
      { noi: 'Một lượt được tính khi cùng đủ ba điều kiện: làm ít nhất 5 câu, đúng ít nhất một nửa, và trung bình mỗi câu từ 6 giây trở lên.', soi: 'dk_dung' },
      { noi: 'Chỉ lượt luyện thêm trên app được tính: Luyện dạng yếu và Học theo chủ đề. ET, BTVN và bài trên lớp có cách tính riêng.', soi: 'loai_bai' },
      { noi: 'Lượt không được tính thì em vẫn học bình thường, không bị phạt. App chỉ nhắc nhẹ vì sao chưa tính.', soi: 'khong_tinh' },
    ],
  },
  {
    id: 'chuoi', ten: 'Chuỗi làm bài', phu: 'Giữ ngọn lửa mỗi ngày', icon: { emoji: '🔥' },
    kyNang: 'Chuỗi làm bài — mỗi ngày có 1 lượt học thật là giữ chuỗi',
    buoc: [
      { noi: 'Chặng 6: Chuỗi làm bài. Ngay dưới lời chào ở màn chính có thẻ Chuỗi. Ngọn lửa cho em biết em đã giữ chuỗi mấy ngày liên tiếp.', soi: 'lua' },
      { noi: 'Mỗi ngày em có ít nhất 1 lượt học thật là giữ được chuỗi. Bảy ô bên dưới là bảy ngày gần nhất, ô cuối là hôm nay.', soi: 'bay_ngay' },
      { noi: 'Hôm nay chưa giữ thì lửa xám và thẻ sáng viền để nhắc em. Chạm Luyện ngay là vào luyện được liền.', soi: 'chua_giu' },
      { noi: 'Lỡ một ngày thì còn sửa được: làm bù trong 48 giờ để nối lại chuỗi. Hết hạn mà chưa bù thì tự dùng thẻ đóng băng, mỗi tháng có 2 thẻ.', soi: 'ngay_lo' },
      { noi: 'Ngày nghỉ của trung tâm và tuần thi không làm đứt chuỗi. Chạm các mốc 3, 7, 14, 30 ngày… em sẽ có hoạt cảnh mừng.', soi: 'moc' },
    ],
  },
  {
    id: 'thu_thach', ten: 'Thử thách', phu: 'Đúng từ 80% là vượt Thử thách', icon: { gami: 'nhiem-vu/N1.png' },
    kyNang: 'Thử thách — đúng 8/10 trở lên để vượt Thử thách',
    buoc: [
      { noi: 'Chặng 6: Thử thách. Nó giống Luyện dạng yếu, 10 câu, nhưng đòi hỏi cao hơn.', soi: 'the_thu_thach' },
      { noi: 'Đúng từ 8 câu trở lên là vượt Thử thách.', soi: 'cham_cau' },
      { noi: 'Thử thách cũng là lượt học thật, nên được tính vào chuỗi làm bài của em.', soi: 'bang_thuong' },
      { noi: 'Phần thưởng riêng của Thử thách đang được hoàn thiện. Em cứ thử sức trước, kết quả vẫn được ghi lại.', soi: 'tien_do' },
    ],
  },
  {
    id: 'dau_chinh_phuc', ten: 'Đấu trường, Chinh phục, Giải vô địch', phu: 'Ba chế độ thi đấu', icon: { o: 'xep_hang' },
    kyNang: 'Thi đấu — mỗi câu chỉ được trả lời một lần',
    buoc: [
      { noi: 'Chặng 7: các chế độ thi đấu trong khu Học tập. Luật chung: mỗi câu chỉ bấm một lần, chọn sai là khoá cả câu.', soi: 'luat_chung' },
      { noi: 'Câu hỏi là trắc nghiệm 4 đáp án, có giới hạn thời gian. Trả lời nhanh và đúng liên tiếp thì điểm cao hơn.', soi: 'luat_chung' },
      { noi: '{sr2}', soi: 'ba_che_do' },
      { noi: 'Điểm của các chế độ này hiện chưa cộng vào chuỗi hay nhiệm vụ. Đây là sân thi đấu riêng.', soi: 'khong_rank' },
    ],
  },
  {
    id: 'nhiem_vu', ten: 'Nhiệm vụ', phu: 'Việc ngày · tuần · tháng', icon: { gami: 'nhiem-vu/ruong_mo.png' },
    kyNang: 'Nhiệm vụ — luyện dạng yếu mỗi ngày, nhận EXP và điểm học tập',
    buoc: [
      { noi: 'Chặng 8: Nhiệm vụ. Ở khối Giải trí trên màn chính, chạm ô Nhiệm vụ. Hiện nhiệm vụ mở cho môn Toán.', soi: 'link_nhiem_vu' },
      { noi: 'Nhiệm vụ chỉ có một việc: Luyện dạng yếu. Mỗi lượt em làm đúng từ 7 trên 10 câu là được 20 EXP và 20 điểm học tập. Mỗi ngày tính tối đa 4 lượt.', soi: 'khoi_ngay' },
      { noi: 'Có ít nhất 1 lượt đạt trong ngày là em được quay may mắn 1 lần. Vòng quay tự hiện ra khi em có lượt, không cần tìm ô riêng.', soi: 'quay' },
      { noi: 'Việc tuần: có lượt đạt ở 5 ngày khác nhau, hoặc đủ 12 lượt đạt trong tuần, mỗi việc +100 EXP và +50 điểm. Việc tháng: có lượt đạt ở 20 ngày, +300 EXP và +200 điểm.', soi: 'khoi_tuan' },
      { noi: 'Điểm học tập tích lại để em chơi game, kho chứa tối đa 6.000 điểm. EXP thì đổi ra xu ngay.', soi: 'chang' },
    ],
  },
  {
    id: 'bxh', ten: 'Bảng xếp hạng', phu: 'Em đứng thứ mấy so với các bạn', icon: { o: 'xep_hang' },
    kyNang: 'Bảng xếp hạng — chọn bảng, chọn Khối hoặc Toàn BK, chọn tuần hoặc tháng',
    buoc: [
      { noi: 'Chặng 9: Bảng xếp hạng. Ở màn chính, chạm ô lớn Bảng xếp hạng. Bảng đi theo môn em đang chọn.', soi: 'bxh_loc' },
      { noi: 'Có ba ô chọn xổ xuống: loại bảng (Siêng luyện, Tổng câu đúng, Chuỗi làm bài, Mock Test…), phạm vi Khối mình hoặc Toàn BK, và thời gian Tuần hoặc Tháng.', soi: 'bxh_loc' },
      { noi: 'Dải phía trên cho em biết em đứng hạng mấy. Chỉ mình em thấy hạng của chính em, kể cả khi em ở cuối bảng.', soi: 'bxh_hang' },
      { noi: 'Danh sách hiện 20 bạn đứng đầu, kèm lớp. Chỉ bạn nào có kết quả thật mới có tên. Hòa điểm thì ai đạt trước đứng trước.', soi: 'bxh_top' },
    ],
  },
  {
    id: 'rank', ten: 'Rank và Bảng xếp hạng', phu: '10 bậc, đua cả mùa', icon: { o: 'rank' },
    kyNang: 'Rank — tích Điểm Rank cả mùa, leo 10 bậc',
    buoc: [
      { noi: 'Chặng 9: Rank. Vào Thư viện BK, chạm Rank. Rank tính riêng từng môn, hiện mở cho môn Toán.', soi: 'the_bac' },
      { noi: 'Điểm Rank đến từ việc học thật: mỗi bài ET 100 điểm, BTVN đúng hạn 100 (muộn 50), Thử thách 10 đến 30, bài MT tới 1.000 điểm theo thứ hạng.', soi: 'nguon_diem' },
      { noi: 'Điểm cộng dồn cả mùa để leo 10 bậc, từ Novice lên Supreme God. Mùa chạy từ 1/7 đến 30/6 năm sau. Đã lên bậc thì không tụt trong mùa.', soi: 'thang_bac' },
      { noi: 'Bảng đua tháng xếp em với các bạn cùng khối trong tháng này. Bảng tháng không làm đổi bậc của em.', soi: 'bang_thang' },
      { noi: 'Mỗi môn có Rank riêng. Đổi môn ở thanh chọn môn trên màn chính.', soi: 'mon' },
    ],
  },
  {
    id: 'huy_hieu', ten: 'Thành tựu', phu: 'Mỗi bậc đạt được thưởng EXP một lần mỗi mùa', icon: { o: 'thanh_tuu' },
    kyNang: 'Thành tựu — đạt bậc nào, nhận EXP bậc đó',
    buoc: [
      { noi: 'Chặng 10: Thành tựu. Vào ô Thành tựu để xem các thành tựu của mùa này. Mỗi thành tựu là một thẻ, chỉ hiện bậc gần nhất em cần đạt, kèm phần thưởng EXP.', soi: 'tam_huy_hieu' },
      { noi: 'Có chuỗi làm bài liên tiếp, nhiệm vụ ngày liên tiếp, luyện dạng yếu đạt liên tiếp, tổng số câu luyện đạt, và top đầu khối ở Mock Test.', soi: 'tam_huy_hieu' },
      { noi: 'Mỗi bậc chỉ thưởng một lần trong mùa. Mất chuỗi rồi cày lại tới bậc cũ thì không thưởng lại. Mùa mới bắt đầu ngày 1 tháng 7.', soi: 'sao' },
      { noi: 'Có những thành tựu ẩn. Em đạt được mới biết tên, trước đó chỉ thấy ổ khoá.', soi: 'chot_thang' },
      { noi: 'Đạt điều kiện thì thẻ sáng lên và có nút Nhận quà. Ô Thành tựu ở màn chính hiện số quà đang chờ. Nhận xong, thẻ chuyển sang bậc kế tiếp, EXP đổi ra xu như mọi EXP khác.', soi: 'ghim' },
    ],
  },
  {
    id: 'xu_may_man', ten: 'EXP, xu và May mắn', phu: 'Từ EXP đến quà và vòng quay', icon: { o: 'vi_xu' },
    kyNang: 'EXP và xu — EXP đổi ra xu ngay để đổi quà ở trung tâm',
    buoc: [
      { noi: 'Chặng 11: EXP và xu. EXP đến từ việc học ở lớp và việc làm trên app như nhiệm vụ, vòng quay và thành tựu.', soi: 'exp_xu' },
      { noi: 'Có EXP là đổi ra xu ngay, theo từng môn: cứ 100 EXP trong tháng được 1 xu. Xu kiếm từ nhiệm vụ trên app tối đa 20 xu mỗi tháng, từ vòng quay tối đa 10 xu mỗi tháng.', soi: 'exp_xu' },
      { noi: 'Ô Ví xu cho em xem số dư và lịch sử. Muốn đổi quà thì đến tủ quà tại trung tâm, app chưa có nút đổi.', soi: 'vi_xu' },
      { noi: 'Vòng quay may mắn mỗi ngày một lượt, mở khi em có ít nhất 1 lượt Luyện dạng yếu đạt. Giải thưởng là EXP.', soi: 'quay_so' },
    ],
  },
  {
    id: 'tro_choi', ten: 'Trò chơi', phu: 'Giải lao sau giờ học', icon: { o: 'tro_choi' },
    kyNang: 'Trò chơi — giải lao với Nông trại BK, game mới sẽ lần lượt mở',
    buoc: [
      { noi: 'Chặng cuối: Trò chơi. Ở khối Giải trí trên màn chính, chạm ô Trò chơi để giải lao sau giờ học.', soi: 'o_tro_choi' },
      { noi: 'Hiện có Nông trại BK để chơi. Các game khác đang chuẩn bị, em sẽ thấy chúng mờ và ghi Sắp ra mắt.', soi: 'ds_game' },
      { noi: 'Nông trại BK đang là bản thử: tiến độ lưu ngay trên thiết bị em đang dùng, chưa nối với xu hay việc học. Đổi thiết bị thì vườn bắt đầu lại.', soi: 'nong_trai' },
    ],
  },
  {
    id: 'the_gioi', ten: 'Thế giới BK', phu: 'Khoe thành tích, thả tim bạn bè', icon: { o: 'the_gioi' },
    kyNang: 'Thế giới BK — khoe thành tích thật, tương tác với bạn',
    buoc: [
      { noi: 'Chặng cuối: Thế giới BK, nơi xem các bạn ở BK vừa đạt gì. Có 3 kênh: Thế giới, Bạn bè, Lớp.', soi: 'tab' },
      { noi: 'Khi em có thành tích, ví dụ ET 10 điểm hay luyện 50 câu đúng trong ngày, nó hiện ở mục Thành tích chờ em khoe.', soi: 'cho_khoe' },
      { noi: 'Chạm Khoe để đăng lên. Mỗi ngày khoe được 3 lần, thành tích khoe được trong 3 ngày.', soi: 'nut_khoe' },
      { noi: 'Bấm Thích để thả cảm xúc, bấm Bình luận để chọn câu khen có sẵn hoặc sticker. Mỗi tin em bình luận tối đa 3 lần.', soi: 'tuong_tac' },
      { noi: 'Muốn kết bạn thì tìm theo tên, mã HS hoặc lớp. Bạn đồng ý là hai đứa thấy tin của nhau.', soi: 'ket_ban' },
    ],
  },
]

/** Chương nào thuộc tính năng nào (mã `tinh_nang` ở DB). Không có mã ⇒ luôn có. Tính năng ĐÓNG ⇒ chương ẩn (Thùy 07/10: mở dần, HS đỡ ngợp). */
export const TINH_NANG_CHUONG: Partial<Record<IdChuong, string>> = {
  hoc_tap: 'hoc_tap', chu_de: 'hoc_tap', tu_luyen: 'hoc_tap', luot_that: 'hoc_tap', dau_chinh_phuc: 'hoc_tap', thu_thach: 'rank', chuoi: 'chuoi',
  nhiem_vu: 'nhiem_vu', bxh: 'xep_hang', rank: 'rank', huy_hieu: 'thanh_tuu', xu_may_man: 'vi_xu', tro_choi: 'tro_choi', the_gioi: 'the_gioi',
}
/** Nút "Thử ngay" cuối chặng (học bằng làm): chặng → màn thật. App ánh xạ id này sang màn. */
export type DichThu = 'hoc_tap' | 'luyen_yeu' | 'nhiem_vu' | 'xep_hang' | 'thanh_tuu' | 'vi_xu' | 'tro_choi' | 'rank' | 'the_gioi'
export const THU_NGAY: Partial<Record<IdChuong, { dich: DichThu; nut: string }>> = {
  hoc_tap: { dich: 'hoc_tap', nut: 'Thử ngay: vào khu Học tập' }, chu_de: { dich: 'hoc_tap', nut: 'Thử ngay: vào khu Học tập' },
  tu_luyen: { dich: 'luyen_yeu', nut: 'Thử ngay: Luyện dạng yếu' }, chuoi: { dich: 'luyen_yeu', nut: 'Thử ngay: luyện 1 lượt giữ chuỗi' },
  nhiem_vu: { dich: 'nhiem_vu', nut: 'Thử ngay: xem Nhiệm vụ' }, bxh: { dich: 'xep_hang', nut: 'Thử ngay: xem Bảng xếp hạng' },
  huy_hieu: { dich: 'thanh_tuu', nut: 'Thử ngay: xem Thành tựu' }, xu_may_man: { dich: 'vi_xu', nut: 'Thử ngay: mở Ví xu' },
  tro_choi: { dich: 'tro_choi', nut: 'Thử ngay: vào Trò chơi' }, dau_chinh_phuc: { dich: 'hoc_tap', nut: 'Thử ngay: vào khu Học tập' },
}

/** Các chặng của hành trình theo công tắc tính năng: `mo(ma)` = tính năng ma đang MỞ cho em. Đánh số lại "Chặng N:"; thay {sr1}/{sr2} theo việc Chinh phục BK / Giải Vô địch BK đã mở chưa. */
export function chuongMo(mo: (ma: string) => boolean): ChuongTutorial[] {
  const sapRa = !mo('chinh_phuc') || !mo('giai_vo_dich')
  const sr1 = sapRa ? ' Hai ô Chinh phục BK và Giải Vô địch BK đang mờ vì sắp ra mắt.' : ''
  const sr2 = sapRa
    ? 'Đấu trường BK mở rồi, em vào thi đấu được ngay. Chinh phục BK (leo tháp) và Giải Vô địch BK sắp ra mắt, em cứ chờ nhé.'
    : 'Đấu trường BK để thi đấu. Chinh phục BK là leo tháp, mỗi tháp có bảng xếp hạng riêng. Giải Vô địch BK có đăng ký và nhánh đấu.'
  return CHUONG_TAT_CA.filter((c) => { const m = TINH_NANG_CHUONG[c.id]; return !m || mo(m) }).map((c, i) => ({
    ...c, buoc: c.buoc.map((b, j) => {
      const noi = b.noi.replace('{sr1}', sr1).replace('{sr2}', sr2)
      return { ...b, noi: j === 0 ? noi.replace(/^Chặng [^:]*:/, `Chặng ${i + 1}:`) : noi }
    }),
  }))
}

/** Bản mặc định (không có công tắc): Rank tạm khoá (06/10) ⇒ bỏ chặng Rank khỏi hành trình. */
export const CHUONG: ChuongTutorial[] = chuongMo((ma) => ma !== 'rank' || rankBat())
