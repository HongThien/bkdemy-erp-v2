import { bang, ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
const { body, w, h } = bang([130, 100, 100, 100, 100], [
  ['Hoạt động', 'Nhảy dây', 'Cầu lông', 'Bóng rổ', 'Đá cầu'],
  [['Số lần', 'lặp lại'], '11', '8', '4', '9']], [48, 60], 19)
await ra(OUT, 'T105000000553', w, h, body)
baoCao(OUT, [{ ma_cau: 'T105000000553', tep: 'T105000000553.png', nguon: 've_lenh', trang_pdf: 111, ghi_chu: 'Bảng số lần quay 11/8/4/9 (đề không có hình vòng quay, chỉ bảng)' }], [])
