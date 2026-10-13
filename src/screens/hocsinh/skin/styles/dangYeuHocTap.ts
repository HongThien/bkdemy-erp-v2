// SINH TỰ ĐỘNG bởi scripts/dang-yeu-hinh.mjs — đừng sửa tay. Khu HỌC TẬP + màn CHINH PHỤC BK của style Đáng yêu (Đơn N3, 13/10).
// hop = hộp PHẦN NHÌN THẤY (alpha > 40) theo tỉ lệ khung — cùng khuôn khoiHocTap.ts. mat = tâm mặt cỏ của đế (giữa đỉnh gò và hàng rộng nhất);
// cầu: a/b = mặt ván ở 2 mép ảnh. Tháp đã cắt sát + đặt chạm đáy khung 512×768.
const G = '/bk-ui/hs/skin/dang_yeu/hoctap', C = '/bk-ui/hs/skin/dang_yeu/chinhphuc'
export const HOC_TAP_DANG_YEU = {
  nen: `url(${G}/nen_ngang.jpg) center / cover no-repeat, #bfe3f2`,
  nenDoc: `url(${G}/nen_doc.jpg) center / cover no-repeat, #bfe3f2`,
  dao: { hoc_chu_de: `${G}/dao_hoc_chu_de.webp`, luyen_yeu: `${G}/dao_luyen_yeu.webp`, dau_truong: `${G}/dao_dau_truong.webp`, chinh_phuc: `${G}/dao_chinh_phuc.webp`, giai_vo_dich: `${G}/dao_giai_vo_dich.webp` },
  hop: {"hoc_chu_de":{"x0":0.0169,"y0":0.0378,"x1":0.9831,"y1":0.9753},"luyen_yeu":{"x0":0.0143,"y0":0.2161,"x1":0.987,"y1":0.8516},"dau_truong":{"x0":0.026,"y0":0.2565,"x1":0.9753,"y1":0.7969},"chinh_phuc":{"x0":0.2201,"y0":0.0299,"x1":0.7813,"y1":0.9844},"giai_vo_dich":{"x0":0.0352,"y0":0.1029,"x1":0.9648,"y1":0.9102}} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
}
export const CHINH_PHUC_DANG_YEU = {
  nen: `${C}/nen.jpg`,
  thapTong: `${C}/thap_tong.webp`,
  thapCd: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `${C}/thap_cd_${i}.webp`),
  hop: {"thap_tong":{"x0":0.0293,"y0":0.0117,"x1":0.9707,"y1":1},"thap_cd_1":{"x0":0.1367,"y0":0.0117,"x1":0.8633,"y1":1},"thap_cd_2":{"x0":0.1406,"y0":0.0117,"x1":0.8613,"y1":1},"thap_cd_3":{"x0":0.1387,"y0":0.0117,"x1":0.8613,"y1":1},"thap_cd_4":{"x0":0.0156,"y0":0.099,"x1":0.9844,"y1":1},"thap_cd_5":{"x0":0.1348,"y0":0.0117,"x1":0.8633,"y1":1},"thap_cd_6":{"x0":0.1152,"y0":0.0117,"x1":0.8867,"y1":1},"thap_cd_7":{"x0":0.1191,"y0":0.0117,"x1":0.8809,"y1":1},"thap_cd_8":{"x0":0.082,"y0":0.0117,"x1":0.918,"y1":1}} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
  deTong: { src: `${C}/de_tong.webp`, tl: 1536 / 1024, mat: [0.5,0.3213] as [number, number] },
  deCd: { src: `${C}/de_cd.webp`, tl: 1, mat: [0.5,0.3877] as [number, number] },
  cau: { src: `${C}/cau.webp`, tl: 2, a: [0.03,0.4824] as [number, number], b: [0.97,0.4824] as [number, number] },
}
