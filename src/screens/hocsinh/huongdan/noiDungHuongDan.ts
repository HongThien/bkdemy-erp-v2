// ============================================================================
// NỘI DUNG "HƯỚNG DẪN CHƠI" app HS (Thùy 03/10: "gallery giải thích chi tiết MỌI chức năng — nhiệm vụ, rank, huy hiệu… học sinh chưa hiểu vào đây đọc là biết
// mọi thứ vận hành thế nào"). Thùy SỬA CHỮ Ở ĐÂY, không cần đụng code màn (cùng mẫu noiDungBoss.ts / noiDungTutorial.ts).
//
// LUẬT GIỌNG (Thùy 03/10): bản GỐC phải FORMAL — ai không thích game đọc phải thấy một tài liệu nghiêm túc, rõ ràng. Style game được "múa máy" thêm chữ:
//   `game` của từng chủ đề ghi đè TÊN + TÓM TẮT (chỉ 2 chỗ đó); thân bài giữ nguyên giọng formal ở mọi style. Xem skin/loi.ts (`giongGame`).
// LUẬT SỐ: số liệu lấy theo code/DB ngày 03/10/2026 (kiểm kê trong DEVLOG 03/10). Số CHƯA chốt thì KHÔNG nêu cụ thể (Đấu trường 3 trận, trần Điểm Rank theo tuần,
//   ngưỡng điểm từng bậc Rank, tỉ lệ giải vòng quay, giá quà…) — nói "xem trong màn đó". Đổi luật ở DB thì phải sửa chữ ở đây.
// `sap: true` = chức năng DB/thiết kế đã xong nhưng màn trong app CHƯA có ⇒ hiện nhãn "Sắp có" (không hứa ngày).
// `tutorial` = mã chương trong tutorial/noiDungTutorial.ts để nút "Xem hướng dẫn tương tác" mở đúng chương (chưa có chương ⇒ bỏ trống).
// ============================================================================

export type LoaiKhoi = 'luat' | 'thuong' | 'meo' | 'luuy'
export type KhoiHD = {
  tieu: string
  /** mỗi phần tử = 1 gạch đầu dòng (hoặc 1 đoạn nếu `doan`) */
  y: string[]
  loai?: LoaiKhoi
  doan?: boolean
}
export type BangHD = { cot: string[]; dong: string[][] }
export type NhomHD = 'bat_dau' | 'hoc' | 'thuong' | 'cong_dong'

export type ChuDeHD = {
  id: string
  nhom: NhomHD
  ten: string
  tomTat: string
  /** giọng GAME (chỉ style game dùng): ghi đè tên + tóm tắt, thân bài không đổi */
  game?: { ten?: string; tomTat?: string }
  /** icon: `o` = id ô trong anhO của style (đổi style tự đổi icon) · không có ⇒ `emoji` */
  icon: { o?: string; emoji: string }
  sap?: boolean
  tutorial?: string
  khoi: KhoiHD[]
  bang?: { tieu: string } & BangHD
}

export const NHOM: { id: NhomHD; ten: string; phu: string }[] = [
  { id: 'bat_dau', ten: 'Bắt đầu', phu: 'Làm quen màn hình, nhân vật và giao diện' },
  { id: 'hoc', ten: 'Học tập', phu: 'Các cách luyện và làm bài' },
  { id: 'thuong', ten: 'Thành tích & phần thưởng', phu: 'Điểm, cấp bậc, huy hiệu, xu' },
  { id: 'cong_dong', ten: 'Cộng đồng & hỗ trợ', phu: 'Thế giới BK, hồ sơ, góp ý' },
]

export const MO_DAU_HD = {
  tieu: 'Hướng dẫn chơi',
  phu: 'Mọi chức năng của app và cách vận hành, đọc một lần là nắm.',
  game: { tieu: 'Sổ tay phiêu lưu', phu: 'Mọi bí kíp của thế giới BK nằm ở đây — chọn một mục để đọc.' },
  cuoi: 'Số liệu trong hướng dẫn là luật đang áp dụng. Khi trung tâm thay đổi luật, màn tương ứng trong app luôn hiển thị số mới nhất.',
}

import { rankBat } from '../phieuluu/coBat'

const CHU_DE_TAT_CA: ChuDeHD[] = [
  // ───────────────────────── BẮT ĐẦU ─────────────────────────
  {
    id: 'man_chinh', nhom: 'bat_dau', ten: 'Màn chính', icon: { o: 'thu_vien', emoji: '🏠' },
    tomTat: 'Các khu trên màn chính và cách di chuyển giữa chúng.',
    game: { ten: 'Căn cứ của em', tomTat: 'Nhìn một lượt xem căn cứ có những gì và đi đâu.' },
    khoi: [
      { tieu: 'Bố cục', y: [
        'Trên cùng là thẻ Thế giới BK, ngay dưới là thanh chọn môn (Toán, KHTN, Tiếng Anh).',
        'Khối “Học tập” thay đổi theo môn đang chọn: Học tập, Thông tin học tập, Sổ tay kiến thức, Làm đề thi thử và các ô bài của thầy cô.',
        'Khối “Giải trí” dùng chung cho mọi môn: Thế giới BK, Nhiệm vụ, Thư viện BK, Trò chơi, May mắn, Thành tựu, Ví xu. Đổi môn thì khối này không đổi.',
      ] },
      { tieu: 'Các nút khác', y: [
        'Chạm ảnh đại diện để mở Hồ sơ (cấp bậc, huy hiệu, đổi ảnh, giao diện).',
        'Chuông là Hòm thư thông báo; nút ⋯ có đổi mật khẩu.',
        'Khi có ca bổ trợ sắp tới giờ, thẻ lịch hiện ngay trên màn chính kèm nút “Vào ca”.',
      ] },
      { tieu: 'Lưu ý', loai: 'luuy', y: ['Một số ô hiện “Sắp có” hoặc bị khoá với môn chưa có kho câu hỏi (ví dụ Tiếng Anh). Đó là trạng thái của môn, không phải lỗi.'] },
    ],
  },
  {
    id: 'nhan_vat_giao_dien', nhom: 'bat_dau', ten: 'Nhân vật và giao diện', icon: { o: 'tu_luyen_rieng', emoji: '🎨' }, tutorial: 'giao_dien',
    tomTat: 'Chọn nhân vật, chọn giao diện và bật hoặc tắt hiệu ứng game.',
    game: { ten: 'Nhân vật & phong cách chơi', tomTat: 'Chọn người hùng của em và kiểu giao diện hợp gu.' },
    khoi: [
      { tieu: 'Hai kiểu dùng app', doan: true, y: [
        'App có hai cách dùng: kiểu mặc định (nền trơn, chữ gọn, không hiệu ứng) dành cho em thích đơn giản; kiểu game (bản đồ phiêu lưu, nhân vật, quái vật, hiệu ứng) dành cho em thích chơi. Nội dung học và cách tính điểm giống hệt nhau ở cả hai kiểu.',
      ] },
      { tieu: 'Cách đổi', y: [
        'Vào Hồ sơ rồi chọn Giao diện: chọn kiểu giao diện, chế độ sáng hoặc tối, hình nền.',
        'Công tắc “Hiệu ứng game” tắt thì bản đồ phiêu lưu và màn đấu hoạt hình được thay bằng danh sách thường.',
        'Mức đồ hoạ (Thấp, Vừa, Cao) giúp máy yếu chạy mượt hơn.',
      ] },
      { tieu: 'Nhân vật chính', y: [
        'Lần đầu vào khu Học tập, em chọn một trong 6 nhân vật chính. Nhân vật xuất hiện trên bản đồ và trong màn đấu.',
        'Có thể đổi nhân vật bằng nút ở đầu khu Học tập; việc đổi không ảnh hưởng điểm hay tiến độ.',
      ] },
    ],
  },

  // ───────────────────────── HỌC TẬP ─────────────────────────
  {
    id: 'luot_hoc_that', nhom: 'hoc', ten: 'Lượt học thật', icon: { o: 'tu_luyen', emoji: '✅' }, tutorial: 'luot_that',
    tomTat: 'Điều kiện để một lượt luyện được tính vào chuỗi, nhiệm vụ và Điểm Rank.',
    game: { ten: 'Lượt luyện hợp lệ', tomTat: 'Luyện thế nào thì mới được ghi vào chiến tích.' },
    khoi: [
      { tieu: 'Khái niệm', doan: true, y: [
        'Chuỗi làm bài, nhiệm vụ và Điểm Rank của Thử thách đều dựa trên “lượt học thật”. Một lượt luyện (10 câu) chỉ được tính khi em thực sự làm bài, không làm cho có.',
      ] },
      { tieu: 'Ba điều kiện (cùng đúng)', loai: 'luat', y: [
        'Làm ít nhất 5 câu.',
        'Đúng ít nhất một nửa số câu đã làm (lượt 10 câu thì đúng từ 5 câu).',
        'Trung bình mỗi câu từ 6 giây trở lên, tính từ lúc mở lượt đến câu cuối. Làm quá nhanh thì lượt không được tính.',
      ] },
      { tieu: 'Loại bài nào được tính', y: [
        'Chỉ các lượt luyện thêm trên app: Luyện dạng yếu, Học theo chủ đề và Thử thách.',
        'ET, BTVN, bài trên lớp và Học từ đầu không nằm trong nhóm này (chúng có cách tính riêng).',
      ] },
      { tieu: 'Khi lượt không được tính', y: [
        'Em vẫn học được và vẫn có kết quả đúng sai, chỉ là lượt đó không cộng vào chuỗi, nhiệm vụ hay Điểm Rank. Không có hình phạt.',
        'App hiển thị lý do nhẹ nhàng: ít câu, đúng chưa đủ, hoặc làm quá nhanh.',
      ] },
      { tieu: 'Câu hỏi không lặp', loai: 'meo', y: ['Hệ thống không ra lại câu em đã gặp khi dạng đó còn câu mới. Hết câu mới thì mới ra lại câu em gặp lâu nhất.'] },
    ],
  },
  {
    id: 'hoc_tap', nhom: 'hoc', ten: 'Khu Học tập', icon: { o: 'tu_luyen', emoji: '🎯' }, tutorial: 'hoc_tap',
    tomTat: 'Năm cách luyện: Học theo chủ đề, Luyện dạng yếu, Đấu trường BK, Chinh phục BK, Giải Vô địch BK.',
    game: { ten: 'Năm đảo phiêu lưu', tomTat: 'Mỗi đảo là một cách chiến đấu và luyện tập.' },
    khoi: [
      { tieu: 'Năm ô', y: [
        'Học theo chủ đề: bản đồ phiêu lưu theo chủ đề em đang học (xem mục riêng).',
        'Luyện dạng yếu: hệ thống chọn câu tập trung vào các dạng em còn yếu.',
        'Đấu trường BK, Chinh phục BK, Giải Vô địch BK: các chế độ thi đấu (xem mục “Đấu trường, Chinh phục, Giải vô địch”).',
      ] },
      { tieu: 'Quy ước chung của một lượt luyện', y: [
        'Mỗi lượt gồm 10 câu; làm bao nhiêu lượt cũng được.',
        'Làm xong là biết đúng sai và có lời giải ngay.',
        'Lượt có được tính vào chuỗi, nhiệm vụ hay Rank hay không do điều kiện “Lượt học thật” quyết định.',
      ] },
      { tieu: 'Môn chưa có kho câu hỏi', loai: 'luuy', y: ['Môn nào chưa có kho câu hỏi (ví dụ Tiếng Anh) thì ô luyện tương ứng bị khoá và có thông báo; ô bài do thầy cô phát hành vẫn dùng được.'] },
    ],
  },
  {
    id: 'hoc_theo_chu_de', nhom: 'hoc', ten: 'Học theo chủ đề (bản đồ phiêu lưu)', icon: { o: 'the_gioi', emoji: '🗺️' }, tutorial: 'chu_de',
    tomTat: 'Bản đồ gồm lục địa, chặng đường và quái vật: mỗi dạng bài là một màn.',
    game: { ten: 'Giải cứu thế giới BK', tomTat: 'Đi qua lục địa, đánh bại quái vật ở từng chặng.' },
    khoi: [
      { tieu: 'Cấu trúc bản đồ', y: [
        'Thế giới: toàn bộ các chủ đề của môn. Mỗi chủ đề là một lục địa.',
        'Lục địa: các chuyên đề của chủ đề, mỗi chuyên đề là một công trình trên đường.',
        'Chặng đường: các dạng bài của chuyên đề, mỗi dạng là một công trình; chạm vào công trình là vào thẳng màn đấu.',
        'Quái vật: mỗi cụm kiến thức trong dạng bài là một quái; hạ hết đội hình là hoàn thành dạng.',
      ] },
      { tieu: 'Ba trạng thái của một dạng', y: [
        'Chưa đo: em chưa làm đủ để hệ thống đánh giá. Vẫn vào học được.',
        'Yếu: quái còn máu, nên luyện thêm.',
        'Đạt: đã chinh phục, có cờ cắm trên công trình. Vẫn có thể ôn lại.',
      ] },
      { tieu: 'Trong màn đấu', y: [
        'Mỗi lượt có nhiều câu hỏi. Cứ 3 câu thì tung một chiêu theo số câu đúng: 3/3 là chiêu mạnh nhất, 2/3 chiêu mạnh, 1/3 chiêu nhẹ, 0/3 thì quái đánh trả và hồi một chút máu.',
        'Tổng sát thương bằng tổng số câu đúng: mỗi câu đúng tương ứng một đòn.',
        'Kết quả của lượt cho biết lượt có được tính hay không và cập nhật độ nắm dạng khi em quay lại bản đồ.',
      ] },
      { tieu: 'Độ nắm dạng', loai: 'meo', y: ['Độ nắm dạng (phần trăm) được tính từ các lần làm gần nhất của em trên dạng đó; có nhiều lần đo thì độ tin cậy càng cao.'] },
    ],
  },
  {
    id: 'luyen_dang_yeu', nhom: 'hoc', ten: 'Luyện dạng yếu', icon: { o: 'tu_luyen_rieng', emoji: '🎯' }, tutorial: 'tu_luyen',
    tomTat: 'Hệ thống tự chọn 10 câu, ưu tiên các dạng em còn yếu.',
    khoi: [
      { tieu: 'Cách hoạt động', y: [
        'Mỗi câu có xác suất khoảng 60% được lấy từ nhóm dạng yếu hơn và khoảng 40% từ mọi dạng em đã có số đo, nên vừa sửa chỗ yếu vừa ôn chỗ đã học.',
        'Em cần đã có số đo (đã làm bài ở lớp hoặc trên app); nếu chưa, app báo chưa có dữ liệu.',
      ] },
      { tieu: 'Theo chủ đề', y: [
        'Em cũng có thể tự chọn một dạng để luyện riêng: danh sách xếp dạng yếu nhất lên đầu, kèm phần trăm độ nắm.',
        '“Chưa đánh giá” nghĩa là dạng đó chưa có lần đo nào gần đây.',
        'Mức độ nắm: Đạt từ 80% trở lên, Cần luyện từ 50% đến 80%, Yếu dưới 50%.',
      ] },
    ],
  },
  {
    id: 'thu_thach', nhom: 'hoc', ten: 'Thử thách', icon: { o: 'rank', emoji: '⚔️' }, tutorial: 'thu_thach',
    tomTat: 'Lượt luyện có điểm thưởng: đúng từ 80% là vượt Thử thách và có Điểm Rank.',
    game: { ten: 'Đấu trường thử thách', tomTat: 'Vượt thử thách để nhận điểm Rank và mở rương nhiệm vụ.' },
    khoi: [
      { tieu: 'Luật đang áp dụng', loai: 'luat', y: [
        'Một lượt gồm 10 câu do hệ thống chọn dạng; em không tự chọn dạng.',
        'Đúng từ 8 câu trở lên là vượt Thử thách.',
        'Điểm Rank: 8 câu đúng được 10 điểm, 9 câu được 20 điểm, 10 câu được 30 điểm.',
        'Mỗi ngày và mỗi tháng có trần Điểm Rank từ Thử thách. Hết trần vẫn làm tiếp được nhưng không có thêm điểm.',
      ] },
      { tieu: 'Liên quan đến phần khác', y: [
        'Vượt Thử thách là điều kiện của nhiều nhiệm vụ và của huy hiệu Hercules.',
        'Lượt phải đạt điều kiện “Lượt học thật” thì điểm mới được tính.',
      ] },
      { tieu: 'Sắp thay đổi', loai: 'luuy', y: ['Thử thách đang được nâng cấp thành đấu trường nhiều trận. Khi chính thức đổi, luật mới sẽ được cập nhật tại đây và trong màn Thử thách.'] },
    ],
  },
  {
    id: 'dau_chinh_phuc', nhom: 'hoc', ten: 'Đấu trường, Chinh phục, Giải vô địch', icon: { o: 'xep_hang', emoji: '🏟️' }, tutorial: 'dau_chinh_phuc',
    tomTat: 'Các chế độ thi đấu dùng game Đấu Từ: mỗi câu chỉ được trả lời một lần.',
    game: { ten: 'Sàn đấu BK', tomTat: 'Đấu, leo tháp và tranh ngôi vô địch.' },
    khoi: [
      { tieu: 'Luật chung', loai: 'luat', y: [
        'Mỗi câu chỉ bấm một lần; chọn sai là khoá cả câu.',
        'Câu hỏi là trắc nghiệm 4 đáp án, có giới hạn thời gian theo môn.',
        'Điểm trận phụ thuộc tốc độ trả lời và chuỗi trả lời đúng liên tiếp.',
      ] },
      { tieu: 'Ba chế độ', y: [
        'Đấu trường BK: thi đấu với người chơi khác hoặc với máy.',
        'Chinh phục BK: leo tháp. Tháp tổng ở giữa, các tháp chủ đề xung quanh, mỗi tháp có bảng xếp hạng riêng (hôm nay và kỷ lục). Có chế độ Sinh tồn và Vô tận.',
        'Giải Vô địch BK: giải đấu có đăng ký, nhánh đấu và lịch; mục “Đấu với máy” dẫn vào Thử thách.',
      ] },
      { tieu: 'Điểm có được tính vào Rank không?', loai: 'luuy', y: ['Hiện điểm của các chế độ này chưa cộng vào Rank, chuỗi, nhiệm vụ hay độ nắm dạng. Chúng là sân chơi thi đấu riêng.'] },
    ],
  },
  {
    id: 'bo_tro', nhom: 'hoc', ten: 'Học từ đầu, bổ trợ và bù', icon: { o: 'hoc_tu_dau', emoji: '📘' },
    tomTat: 'Ca học thêm khi em yếu, nghỉ buổi hoặc vào lớp giữa chừng.',
    game: { ten: 'Ca hồi phục', tomTat: 'Lấy lại nền tảng khi em bị lỡ hoặc còn yếu.' },
    khoi: [
      { tieu: 'Ba loại ca', y: [
        'Bổ trợ yếu: ca học thêm cho các dạng em còn yếu.',
        'Bù: học lại nội dung của buổi em đã nghỉ.',
        'Đuổi: dành cho em vào lớp giữa chừng, học lại các dạng đã qua.',
        'Lịch ca sắp tới và nút “Vào ca” hiện ngay trên màn chính.',
      ] },
      { tieu: 'Học từ đầu', y: [
        'Chọn chủ đề, chuyên đề rồi đến từng dạng. Mỗi dạng gồm Lý thuyết, Luyện tập (10 câu, không giới hạn lượt, không tính độ nắm) và Test (tính độ nắm).',
        'Dạng kế tiếp mở khi em đã nộp Test của dạng ngay trước; không cần đạt điểm.',
      ] },
      { tieu: 'Lưu ý', loai: 'luuy', y: [
        'Bài trong ca bù chỉ dùng câu trắc nghiệm. Dạng nào chưa có câu trắc nghiệm thì app báo em học dạng đó trên giấy với thầy cô.',
        'Các lượt trong ca này không được tính vào chuỗi, nhiệm vụ và Điểm Rank.',
      ] },
    ],
  },
  {
    id: 'bai_tren_lop', nhom: 'hoc', ten: 'Bài của thầy cô và công cụ học', icon: { o: 'giao_trinh', emoji: '📚' },
    tomTat: 'ET, BTVN, bài trên lớp, đề thi thử, Sổ tay kiến thức và Thông tin học tập.',
    khoi: [
      { tieu: 'Bài thầy cô phát hành', y: [
        'ET: bài kiểm tra do thầy cô phát, làm theo chế độ thi. Đáp án và lời giải chỉ hiện sau khi nộp.',
        'BTVN: bài về nhà, hiện đáp án ngay khi làm.',
        'Bài tập trên lớp: phần luyện theo giáo trình của buổi học.',
        'Làm đề thi thử: đề do thầy cô phát hành cho lớp, có tính giờ (hiện dành cho khối 10 đến 12).',
      ] },
      { tieu: 'Sổ tay kiến thức', y: [
        'Tra lý thuyết và bài mẫu theo từng dạng. Tìm bằng cách gõ tên (không cần dấu) hoặc lọc theo Chủ đề, Chuyên đề, Dạng.',
        'Thẻ Công thức hiện trước, thẻ lý thuyết hiện sau.',
      ] },
      { tieu: 'Thông tin học tập', y: [
        'Dạng đang yếu của em.',
        'Lịch sử làm bài 30 ngày gần nhất.',
        'Bảng xếp hạng với ba tab; “đạt” ở bảng này nghĩa là làm ít nhất 3 câu và đúng từ 75% trở lên.',
      ] },
    ],
  },

  // ───────────────────────── THÀNH TÍCH & PHẦN THƯỞNG ─────────────────────────
  {
    id: 'chuoi', nhom: 'thuong', ten: 'Chuỗi làm bài', icon: { o: 'btvn', emoji: '🔥' },
    tomTat: 'Số ngày liên tiếp em có ít nhất một lượt học thật.',
    game: { ten: 'Ngọn lửa chuỗi', tomTat: 'Giữ lửa mỗi ngày để lên mốc chuỗi.' },
    khoi: [
      { tieu: 'Cách tính', loai: 'luat', y: [
        'Chuỗi dùng chung cho mọi môn và tính theo giờ Việt Nam.',
        'Một ngày được tính khi em có ít nhất một lượt học thật.',
        'Ngày trung tâm công bố nghỉ: chuỗi không đứt và cũng không tăng.',
        'Hôm nay chưa học: chuỗi chưa đứt, em còn cả ngày để học.',
      ] },
      { tieu: 'Khi lỡ một ngày', y: [
        'Em có 48 giờ để sửa: các lượt học thật thừa (lượt thứ hai trở đi trong ngày) trong hai ngày kế tiếp sẽ bù cho ngày lỡ cũ nhất.',
        'Hết hạn mà chưa bù thì hệ thống tự dùng thẻ đóng băng: mỗi tháng có 2 thẻ, không cộng dồn sang tháng sau.',
        'Hết thẻ thì chuỗi đứt và bắt đầu lại.',
      ] },
      { tieu: 'Các mốc', y: ['Mốc chuỗi: 3, 7, 14, 30, 50, 100, 200 và 365 ngày. Các mốc lớn được đưa tin lên Thế giới BK.'] },
      { tieu: 'Xem chuỗi ở đâu', y: [
        'Ngọn lửa và số ngày ở góc trên màn chính. Lửa xám nghĩa là hôm nay em chưa có lượt được tính.',
        'Bấm vào ngọn lửa để xem 7 ngày gần nhất, kỷ lục, số thẻ đóng băng còn lại và ngày lỡ còn sửa được.',
        'Chạm mốc thì app mừng em một lần.',
      ] },
    ],
  },
  {
    id: 'nhiem_vu', nhom: 'thuong', ten: 'Nhiệm vụ', icon: { o: 'nhiem_vu', emoji: '📜' }, tutorial: 'nhiem_vu',
    tomTat: 'Việc theo ngày, tuần và tháng; hoàn thành để lấy Điểm Chặng, EXP và mở rương.',
    game: { ten: 'Bảng nhiệm vụ', tomTat: 'Nhận việc mỗi ngày, mở rương mỗi tuần, chạm chặng mỗi tháng.' },
    khoi: [
      { tieu: 'Nhiệm vụ ngày', y: [
        'N1: vượt một Thử thách (từ 80%, lượt được tính).',
        'N2: cứ 20 câu đúng mới (câu em chưa từng làm đúng) trong các lượt được tính là một việc.',
        'N3: cứ 2 câu đúng ở dạng em từng làm sai trong 14 ngày gần đây là một việc.',
        'Việc ngày chưa làm có thể treo lại tối đa 3 ngày.',
      ] },
      { tieu: 'Nhiệm vụ tuần', y: [
        'T1: nộp BTVN đúng hạn cả tuần.',
        'T2: có ít nhất một bài ET đạt từ 80%.',
        'T3: vượt Thử thách ở 4 ngày khác nhau.',
        'T4: lấp một lỗ hổng: dạng yếu đầu tháng đã lên mức đạt.',
        'Một tháng chia 4 tuần (ngày 1 đến 7, 8 đến 14, 15 đến 21, 22 đến hết tháng); việc chưa xong được dồn đến hết tháng.',
      ] },
      { tieu: 'Nhiệm vụ tháng', y: [
        'M1: Mock Test (MT) tăng hạng so với lần trước, hoặc vào top 30% khối.',
        'M2: vượt Thử thách ở 15 ngày trong tháng.',
      ] },
      { tieu: 'Phần thưởng', loai: 'thuong', y: [
        'Mỗi việc cộng Điểm Chặng. Cứ 50 Điểm Chặng lên 1 cấp của Chặng tháng (tối đa 30 cấp); mỗi cấp thưởng EXP, các mốc cấp 10, 20, 30 thưởng thêm.',
        'Rương tuần mở khi hoàn thành 12 việc trong tuần: thêm Điểm Chặng và EXP.',
        'Một lượt luyện chỉ hoàn thành một việc và ưu tiên việc cũ nhất còn treo.',
      ] },
      { tieu: 'Lưu ý', loai: 'luuy', y: ['Nhiệm vụ hiện mở cho môn Toán; các môn khác sẽ mở sau. Nhiệm vụ không cộng Điểm Rank.'] },
    ],
  },
  {
    id: 'rank', nhom: 'thuong', ten: 'Rank', icon: { o: 'rank', emoji: '🛡️' }, tutorial: 'rank',
    tomTat: 'Cấp bậc theo môn, tích luỹ trong một mùa; lên bậc không bao giờ bị tụt trong mùa.',
    game: { ten: 'Cấp bậc chiến binh', tomTat: 'Từ Novice đến Supreme God: leo từng bậc trong mùa.' },
    khoi: [
      { tieu: 'Điểm Rank đến từ đâu', loai: 'luat', y: [
        'ET: mỗi bài ET được chấm là 100 điểm.',
        'BTVN: nộp đúng hạn 100 điểm, nộp muộn 50 điểm.',
        'Mock Test (MT) sát hạch tại trung tâm: từ 500 đến 1000 điểm theo thứ hạng.',
        'Thử thách: 10, 20 hoặc 30 điểm theo số câu đúng (xem mục Thử thách).',
      ] },
      { tieu: 'Mùa và bậc', y: [
        'Một mùa kéo dài một năm, từ 1 tháng 7 đến 30 tháng 6 năm sau. Hết mùa, em bắt đầu lại từ Novice.',
        'Có 10 bậc, từ thấp đến cao như bảng dưới. Điểm cần cho từng bậc xem trong màn Rank (mỗi môn có thể khác nhau).',
        'Các bậc đầu có 3 sao. Đã lên bậc thì không tụt bậc trong mùa.',
      ] },
      { tieu: 'Bảng đua tháng', y: ['Xếp hạng theo Điểm Rank kiếm được trong tháng, giữa các em cùng khối và cùng môn. Bảng này không làm đổi bậc.'] },
      { tieu: 'Lưu ý', loai: 'luuy', y: ['Rank hiện mở cho môn Toán; các môn khác sẽ mở sau.'] },
    ],
    bang: { tieu: 'Mười bậc Rank (thấp đến cao)', cot: ['Thứ tự', 'Bậc'], dong: [
      ['1', 'Novice'], ['2', 'Soldier'], ['3', 'Captain'], ['4', 'General'], ['5', 'Hero'],
      ['6', 'Legend'], ['7', 'King'], ['8', 'Emperor'], ['9', 'God of War'], ['10', 'Supreme God'],
    ] },
  },
  {
    id: 'huy_hieu', nhom: 'thuong', ten: 'Huy hiệu, Thành tựu và Album', icon: { o: 'thanh_tuu', emoji: '🏅' }, tutorial: 'huy_hieu',
    tomTat: 'Tám huy hiệu ghi nhận chuyên cần, bài tập và tiến bộ theo từng tháng.',
    game: { ten: 'Bộ sưu tập huy hiệu', tomTat: 'Tám huy hiệu thần thoại, mỗi cái nâng tới 5 sao.' },
    khoi: [
      { tieu: 'Tám huy hiệu', y: [
        'Helios: chuyên cần, đi học đủ các buổi.',
        'Chronos: nộp đủ BTVN đúng hạn.',
        'Athena: kết quả ET tốt.',
        'Zeus: Mock Test (MT) thuộc nhóm đầu khối.',
        'Phoenix: bứt phá, hạng MT tiến bộ so với đầu mùa.',
        'Hercules: vượt Thử thách nhiều ngày trong tháng.',
        'Hephaestus: lấp lỗ hổng, đưa dạng yếu lên mức đạt.',
        'Nike: nằm trong nhóm đầu Bảng đua tháng.',
      ] },
      { tieu: 'Cách tính', y: [
        'Mùa huy hiệu chạy từ tháng 7 đến tháng 4.',
        'Mỗi tháng đạt chuẩn là thêm một bước; càng nhiều tháng đạt, huy hiệu càng nhiều sao, tối đa 5 sao. Đã đạt thì không bị mất.',
        'Kết quả chốt sau ngày 10 của tháng kế tiếp (chờ kết quả MT); trước đó hiển thị “tạm tính”.',
        'Các sao cao có phần thưởng EXP; điều kiện chi tiết của từng huy hiệu do trung tâm cấu hình và có thể điều chỉnh.',
      ] },
      { tieu: 'Thành tựu và Album', y: [
        'Thành tựu: giải thưởng cuối tháng đã công bố (Xuất sắc, Tiến bộ, Chăm chỉ).',
        'Album: nơi xem toàn bộ huy hiệu; em có thể ghim tối đa 3 huy hiệu để khoe ở Hồ sơ.',
      ] },
      { tieu: 'Lưu ý', loai: 'luuy', y: ['Huy hiệu hiện mở cho môn Toán; các môn khác sẽ mở sau.'] },
    ],
  },
  {
    id: 'exp_xu', nhom: 'thuong', ten: 'EXP, xu và Ví xu', icon: { o: 'vi_xu', emoji: '🪙' }, tutorial: 'xu_may_man',
    tomTat: 'EXP tích luỹ từ việc học, đổi thành xu ngay trong ngày để đổi quà tại trung tâm.',
    game: { ten: 'Kho báu xu', tomTat: 'Gom EXP, đổi thành xu và rinh quà.' },
    khoi: [
      { tieu: 'EXP đến từ đâu', y: [
        'Việc học ở lớp: ET, BTVN, buổi bù và bổ trợ, game trong buổi học.',
        'Việc học trên app: Chặng nhiệm vụ, rương tuần, vòng quay May mắn, các sao huy hiệu.',
      ] },
      { tieu: 'Đổi sang xu', loai: 'luat', y: [
        'Xu được tính theo từng môn và từng tháng từ tổng EXP của tháng đó: cứ 100 EXP là 1 xu (làm tròn lên).',
        'Xu cập nhật ngay khi em có EXP, không đợi cuối tháng. Nếu EXP bị giảm (phạt BTVN, sửa điểm) thì xu cũng giảm theo.',
        'Xu kiếm từ hoạt động trên app có trần mỗi tháng cho mỗi môn; xu từ việc học trên lớp không bị tính vào trần này.',
      ] },
      { tieu: 'Dùng xu', y: [
        'Xu dùng để đổi quà ở tủ quà tại trung tâm. App chỉ hiện số dư và lịch sử; việc đổi quà thực hiện trực tiếp tại trung tâm.',
        'Danh mục và giá quà do trung tâm thông báo.',
      ] },
    ],
  },
  {
    id: 'may_man', nhom: 'thuong', ten: 'Vòng quay May mắn', icon: { o: 'may_man', emoji: '🎰' }, tutorial: 'xu_may_man',
    tomTat: 'Mỗi ngày một lượt quay miễn phí để nhận EXP.',
    game: { ten: 'Vòng quay may mắn', tomTat: 'Quay mỗi ngày một lần để rinh EXP.' },
    khoi: [
      { tieu: 'Cách có lượt quay', y: [
        'Vòng quay miễn phí, không tốn xu; mỗi em tối đa một lượt mỗi ngày.',
        'Với môn đã mở Nhiệm vụ: hoàn thành từ 2 nhiệm vụ ngày trong hôm nay để có lượt.',
        'Với môn chưa mở Nhiệm vụ: làm một lượt tự luyện 10 câu đúng từ 70% để có lượt (luật cũ).',
      ] },
      { tieu: 'Phần thưởng', y: [
        'Giải thưởng là EXP; các mức và tỉ lệ nằm trong màn vòng quay.',
        'Kết quả luôn do hệ thống quyết định; hoạt hình chỉ minh hoạ.',
        'EXP từ vòng quay được quy đổi thành xu ngay theo quy tắc chung.',
      ] },
    ],
  },

  {
    id: 'tro_choi', nhom: 'thuong', ten: 'Trò chơi', icon: { o: 'tro_choi', emoji: '🎮' },
    tomTat: 'Nơi chứa các game giải trí của BK; hiện có Nông trại BK.',
    game: { ten: 'Khu trò chơi', tomTat: 'Giải lao với Nông trại BK, game mới sẽ lần lượt mở.' },
    khoi: [
      { tieu: 'Ô Trò chơi', y: [
        'Ô Trò chơi nằm ở khối Giải trí trên màn chính và dùng chung cho mọi môn.',
        'Mỗi game là một thẻ. Thẻ sáng thì chạm để chơi; thẻ mờ ghi “Sắp ra mắt” là game chưa mở.',
        'Chạm nút ‹ ở góc dưới bên phải màn game để quay về danh sách.',
      ] },
      { tieu: 'Nông trại BK', y: [
        'Trồng cây, nuôi gà và bò, sang vườn bạn bè. Mỗi ngày vào một lần, khoảng mười đến mười lăm phút là đủ.',
        'Ngày trong game đổi lúc 5 giờ sáng giờ Việt Nam. Cây chín sau 1, 2 hoặc 3 ngày tuỳ loại.',
        'Càng chăm vườn đều đặn thì càng mở thêm ô đất và loại cây mới.',
      ] },
      { tieu: 'Lưu ý', loai: 'luuy', y: [
        'Nông trại BK hiện là bản thử: tiến độ được lưu ngay trên thiết bị đang dùng, chưa theo tài khoản và chưa nối với xu hay việc học. Đổi thiết bị thì vườn bắt đầu lại.',
        'Săn lùng Quái Vật là game tiếp theo, chưa có ngày mở.',
      ] },
    ],
  },

  // ───────────────────────── CỘNG ĐỒNG & HỖ TRỢ ─────────────────────────
  {
    id: 'the_gioi_bk', nhom: 'cong_dong', ten: 'Thế giới BK', icon: { o: 'the_gioi', emoji: '🌏' }, tutorial: 'the_gioi',
    tomTat: 'Bảng tin thành tích của em, bạn bè và lớp; em không phải gõ chữ tự do.',
    game: { ten: 'Quảng trường Thế giới BK', tomTat: 'Khoe chiến tích, thả tim và kết bạn.' },
    khoi: [
      { tieu: 'Ba kênh', y: ['Thế giới (toàn bộ học sinh), Bạn bè và Lớp.'] },
      { tieu: 'Tin được tạo như thế nào', y: [
        'Tin do hệ thống tự sinh từ sự kiện thật (lên bậc, mốc chuỗi, huy hiệu…). Học sinh không đăng chữ tự do.',
        'Em có thể “khoe” thành tích của mình: tối đa 3 bài mỗi ngày, thành tích phải đạt trong 3 ngày gần đây và mỗi thành tích khoe một lần.',
      ] },
      { tieu: 'Tương tác', y: [
        'Thả cảm xúc, bình luận bằng câu soạn sẵn hoặc sticker (tối đa 3 bình luận cho mỗi tin).',
        'Tương tác không cộng EXP. Thầy cô và trợ giảng có thể gửi lời khen.',
        'Kết bạn: tìm theo tên, mã học sinh hoặc lớp. Tên hiển thị luôn kèm lớp; có thể chọn hiện mã học sinh thay cho tên.',
      ] },
    ],
  },
  {
    id: 'ho_so_thong_bao', nhom: 'cong_dong', ten: 'Hồ sơ và thông báo', icon: { o: 'thong_tin', emoji: '👤' },
    tomTat: 'Ảnh đại diện, cấp bậc, huy hiệu khoe, giao diện và hòm thư.',
    khoi: [
      { tieu: 'Hồ sơ', y: [
        'Chạm ảnh đại diện trên màn chính: xem cấp bậc, 3 huy hiệu khoe, Album; đổi ảnh đại diện; chuyển môn.',
        'Từ Hồ sơ vào được phần Giao diện và Đồ hoạ.',
      ] },
      { tieu: 'Thông báo và tài khoản', y: [
        'Chuông là Hòm thư: thông báo từ trung tâm và từ app.',
        'Nút ⋯ có đổi mật khẩu.',
      ] },
    ],
  },
  {
    id: 'gop_y', nhom: 'cong_dong', ten: 'Góp ý và báo lỗi', icon: { o: 'so_tay', emoji: '💬' },
    tomTat: 'Gửi ý kiến hoặc báo lỗi trực tiếp tới đội phát triển.',
    khoi: [
      { tieu: 'Mở ở đâu', y: [
        'Màn chính: nút ⋯ ở góc trên → "Góp ý & báo lỗi". Hoặc trong Hồ sơ của em.',
      ] },
      { tieu: 'Gửi thế nào', y: [
        'Chọn "Báo lỗi" khi app chạy sai, hoặc "Góp ý tưởng" khi em muốn app có thêm điều gì.',
        'Mô tả từ 10 đến 1.500 chữ; có thể đính kèm 1 ảnh chụp màn hình (chọn tệp hoặc dán vào ô chữ).',
        'Mỗi ngày gửi tối đa 5 lần.',
      ] },
      { tieu: 'Theo dõi', y: [
        'Mục "Góp ý của em" hiện trạng thái: Đã nhận · Đang xem · Đã xử lý · Chưa làm được, kèm lời trả lời của thầy cô.',
        'Có lời trả lời mới thì nút ⋯ ở màn chính hiện chấm đỏ.',
      ] },
    ],
  },
]

/** Rank tạm khoá (06/10) ⇒ bỏ mục Rank khỏi Hướng dẫn chơi. */
export const CHU_DE: ChuDeHD[] = CHU_DE_TAT_CA.filter((c) => c.id !== 'rank' || rankBat())
