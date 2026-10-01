// DỮ LIỆU MẪU cho hs.html?xem=phieu_luu — cây Đại khối 9 THẬT (tên chủ đề/chuyên đề/dạng, số cụm thật), điểm số/máu là giả.
// Cùng hình dạng với `tuBanDoPL()` để khi có hàm DB thật chỉ việc đổi nguồn. Không gọi DB, không cần đăng nhập.
import type { BanDoV, ChangV, LucDiaV, TrangThai } from './kieu'
import { chonDoiHinh } from '../skin/the3d/loai'
import { bam } from '../skin/the3d/hinhHoc'

type Tho = [ten: string, muc: number, st: 'd' | 'y' | 'f', hp?: number, soCum?: number]
const ST: Record<'d' | 'y' | 'f', TrangThai> = { d: 'dat', y: 'yeu', f: 'chua_do' }

function chang(ma: string, t: Tho): ChangV {
  const [ten, muc, st, hp = 5, soCum = 0] = t, id = `${ma}.${bam(ten) % 9973}`
  const so_cau_luot = Math.min(10, Math.max(5, 2 * soCum)) // CHỈ cho trang mẫu — bản thật do Postgres trả (đã ghi Hộp thư §13.6)
  return {
    ma: id, ten, muc_do: muc, trang_thai: ST[st], mastery: st === 'd' ? 0.8 + (bam(ten) % 15) / 100 : st === 'y' ? Math.max(0.2, 0.82 - hp * 0.055) : null,
    da_day: st !== 'f', so_cum: soCum, quai: chonDoiHinh(id, soCum), hp: st === 'y' ? hp : st === 'f' ? 6 : 0, so_cau_luot,
  }
}
function luc(ma: string, ten: string, biome: string, vung: [string, Tho[]][]): LucDiaV {
  return { ma, ten, biome, vung: vung.map(([vt, cs], i) => ({ ma: `${ma}${i}`, ten: vt, chang: cs.map((c) => chang(`${ma}${i}`, c)) })) }
}

export const MAU_BAN_DO: BanDoV = {
  mon: 'Toán',
  luc_dia: [
    luc('C', 'Phương trình và hệ phương trình bậc nhất hai ẩn', 'rung', [
      ['Phương trình bậc nhất hai ẩn', [['Tìm nghiệm của phương trình bậc nhất hai ẩn', 1, 'd']]],
      ['Hệ phương trình bậc nhất hai ẩn', [['Giải hệ phương trình bậc nhất hai ẩn cơ bản', 2, 'y', 7, 1], ['Giải hệ phương trình đưa về hệ bậc nhất hai ẩn', 3, 'f'], ['Giải hệ bằng PP đặt ẩn phụ – dạng phân thức', 3, 'f'], ['Giải hệ bằng PP đặt ẩn phụ – có chứa giá trị tuyệt đối', 4, 'f']]],
      ['Giải toán bằng cách lập hệ phương trình', [['Bài toán Lãi suất', 3, 'd'], ['Bài toán Công việc chung – riêng', 3, 'd'], ['Bài toán Chuyển động thường', 3, 'y', 4], ['Bài toán Chuyển động trên dòng nước', 3, 'y', 6], ['Bài toán Cổ điển', 3, 'f'], ['Bài toán có nội dung Hình học', 3, 'f'], ['Các bài toán khác', 3, 'f'], ['Bài toán Chuyển động cùng chiều – ngược chiều', 3, 'f']]],
      ['Hệ phương trình đối xứng', [['Hệ phương trình Tổng – Tích', 4, 'f'], ['Hệ phương trình đưa về hệ tổng – tích', 5, 'f']]],
    ]),
    luc('B', 'Phương trình và bất phương trình bậc nhất một ẩn', 'bien_dao', [
      ['Phương trình bậc nhất một ẩn', [['Phương trình bậc nhất một ẩn dạng cơ bản', 1, 'd'], ['Phương trình quy về bậc nhất một ẩn – đa thức', 2, 'd'], ['Phương trình quy về bậc nhất một ẩn – phân thức', 3, 'd']]],
      ['Bất phương trình bậc nhất một ẩn', [['Giải bất phương trình bậc nhất một ẩn dạng cơ bản', 1, 'd'], ['Bất phương trình quy về bậc nhất – đa thức', 2, 'd'], ['Bất phương trình quy về bậc nhất – phân thức', 3, 'd'], ['Giải toán bằng cách lập bất phương trình', 3, 'y', 3]]],
      ['Giải toán bằng cách lập phương trình', [['Bài toán Năng suất', 3, 'd'], ['Bài toán Diện tích', 3, 'd'], ['Bài toán Chuyển động cùng chiều – ngược chiều', 3, 'd'], ['Bài toán Chuyển động cổ điển', 3, 'd'], ['Bài toán Chuyển động dòng nước', 3, 'd'], ['Bài toán Hai đại lượng', 3, 'y', 5], ['Bài toán Công việc chung – riêng', 3, 'd']]],
      ['Phương trình tích', [['Phương trình tích dạng cơ bản', 2, 'd'], ['Phương trình quy về tích – đa thức', 3, 'd'], ['Phương trình quy về tích – phân thức', 3, 'd'], ['Phương trình quy về tích – đặt ẩn phụ', 4, 'y', 6], ['Phương trình quy về tích – biến đổi đặc biệt', 4, 'y', 8]]],
    ]),
    luc('A', 'Căn bậc hai – Căn thức bậc hai', 'bang', [
      ['Rút gọn biểu thức chứa căn bậc hai của số', [['Rút gọn biểu thức chứa căn – dạng cơ bản', 2, 'd', 0, 3], ['Rút gọn biểu thức chứa căn – ứng dụng hằng đẳng thức', 3, 'd', 0, 3]]],
      ['Rút gọn Căn thức', [['Tìm ĐKXĐ của Căn thức', 2, 'd'], ['Tính giá trị Căn thức khi biết giá trị của biến', 2, 'd', 0, 2], ['Rút gọn Căn thức', 3, 'y', 6, 6], ['Tìm x ứng dụng Rút gọn Căn thức', 3, 'y', 7]]],
      ['Câu C rút gọn', [['Tìm x để P thoả mãn Đẳng thức', 3, 'y', 5], ['Tìm x để P thoả mãn Bất đẳng thức', 3, 'y', 6], ['Tìm x nguyên để P nguyên', 3, 'f'], ['Tìm x để P nguyên', 3, 'f'], ['Tìm GTLN – GTNN của P', 3, 'f'], ['Tìm GTLN – GTNN của P ứng dụng Côsi', 3, 'f'], ['Bài toán liên quan đến Giá trị tuyệt đối và Căn bậc hai', 3, 'f']]],
    ]),
    luc('H', 'Các dạng bài Toán nâng cao', 'troi_sao', [
      ['Bất đẳng thức một biến', [['GTLN – GTNN của biểu thức một biến bậc hai', 3, 'f'], ['GTLN – GTNN của biểu thức một biến có điều kiện', 4, 'f'], ['GTLN – GTNN bậc 3 ứng dụng Cauchy chiều xuôi', 5, 'f'], ['GTLN – GTNN bậc 3 ứng dụng Cauchy chiều ngược', 5, 'f'], ['GTLN – GTNN dạng phân thức Cauchy 2 số', 4, 'f'], ['GTLN – GTNN bậc hai với x nguyên', 4, 'f'], ['GTLN – GTNN phân thức Cauchy 2 số với x nguyên', 4, 'f']]],
      ['Bất đẳng thức hai biến đối xứng', [['Tìm GTLN – GTNN dạng tổng', 4, 'f'], ['Tìm GTLN – GTNN dạng tích', 4, 'f'], ['Tìm GTLN – GTNN dạng tổng bình phương', 4, 'f']]],
      ['Ứng dụng phương pháp dồn biến', [['Dồn biến dạng tổng', 5, 'f'], ['Dồn biến dạng tích', 5, 'f']]],
      ['Các bài toán về biểu thức bậc nhất hai biến', [['Phương trình nghiệm nguyên bậc nhất hai biến', 4, 'f'], ['Biểu diễn hệ thức qua hệ thức khác', 4, 'f'], ['GTLN – GTNN hai biến nhiều điều kiện', 5, 'f']]],
      ['Tính chất của bất đẳng thức', [['Chứng minh bất đẳng thức đa thức', 3, 'f'], ['Chứng minh bất đẳng thức phân thức', 3, 'f'], ['Chứng minh bất đẳng thức căn thức', 3, 'f'], ['Chứng minh bất đẳng thức có giá trị tuyệt đối', 3, 'f']]],
    ]),
    luc('I', 'Các mô hình toán thực tế nâng cao', 'nui_lua', [
      ['Bài toán về Doanh thu – Lợi nhuận', [['Bài toán tối ưu doanh thu – lợi nhuận', 4, 'f'], ['Tối ưu doanh thu – lợi nhuận với biến nguyên', 4, 'f']]],
      ['Bài toán tối ưu chi phí', [['Tối ưu chi phí sản xuất – dạng 1 biến', 4, 'f'], ['Tối ưu chi phí sản xuất – dạng 1 biến nguyên', 4, 'f']]],
      ['Bài toán thực tế hình học', [['Chu vi – diện tích: cho tổng – hỏi tích', 4, 'f'], ['Chu vi – diện tích: cho tích – hỏi tổng', 4, 'f'], ['Thể tích – diện tích: cho thể tích – hỏi diện tích', 4, 'f'], ['Thể tích – diện tích: cho diện tích – hỏi thể tích', 4, 'f'], ['Hình chữ nhật nội tiếp hình tam giác', 5, 'f']]],
      ['Bài toán tối ưu doanh thu chi phí 2 biến', [['Tối ưu doanh thu chi phí có miền điều kiện', 4, 'f']]],
    ]),
    luc('D', 'Hàm số bậc hai – Định lý Viète', 'thanh_co', [['Hàm số bậc hai', [['Tính chất hàm số bậc hai', 3, 'f']]]]),
    luc('E', 'Tần số – Tần số tương đối', 'sa_mac', [['Bảng tần số – Biểu đồ tần số', [['Bảng tần số – Biểu đồ tần số', 3, 'f']]]]),
    luc('F', 'Xác suất', 'dam_lay', [['Xác suất của biến cố liên quan tới phép thử', [['Xác suất của biến cố liên quan tới phép thử', 3, 'f']]]]),
    luc('G', 'Hình học không gian', 'thanh_co', [['Tính diện tích – thể tích hình khối không gian', [['Diện tích – Thể tích của hình hộp chữ nhật', 2, 'f']]]]),
  ],
}
