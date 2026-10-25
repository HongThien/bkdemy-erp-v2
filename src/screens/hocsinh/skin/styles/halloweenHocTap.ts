// SINH TỰ ĐỘNG bởi scripts/halloween-hinh.mjs — đừng sửa tay. Khu HỌC TẬP + màn CHINH PHỤC BK của style Halloween (Đơn H3, 25/10).
// hop = hộp PHẦN NHÌN THẤY (alpha > 40) theo tỉ lệ khung — cùng khuôn dangYeuHocTap.ts. mat = tâm mặt cỏ của đế (giữa đỉnh đảo và hàng rộng nhất);
// cầu: a/b = mặt ván ở 2 mép ảnh. Tháp đã cắt sát + đặt chạm đáy khung 512×768.
const G = '/bk-ui/hs/skin/halloween/hoctap', C = '/bk-ui/hs/skin/halloween/chinhphuc'
export const HOC_TAP_HALLOWEEN = {
  nen: `url(${G}/nen_ngang.jpg) center / cover no-repeat, #251836`,
  nenDoc: `url(${G}/nen_doc.jpg) center / cover no-repeat, #251836`,
  dao: { hoc_chu_de: `${G}/dao_hoc_chu_de.webp`, luyen_yeu: `${G}/dao_luyen_yeu.webp`, dau_truong: `${G}/dao_dau_truong.webp`, chinh_phuc: `${G}/dao_chinh_phuc.webp`, giai_vo_dich: `${G}/dao_giai_vo_dich.webp` },
  hop: {"hoc_chu_de":{"x0":0.0391,"y0":0.0247,"x1":0.9622,"y1":0.9818},"luyen_yeu":{"x0":0.0078,"y0":0.1901,"x1":0.9935,"y1":0.9206},"dau_truong":{"x0":0.0065,"y0":0.1758,"x1":0.9935,"y1":0.9401},"chinh_phuc":{"x0":0.0651,"y0":0.0156,"x1":0.9349,"y1":0.9909},"giai_vo_dich":{"x0":0.0117,"y0":0.0586,"x1":0.9883,"y1":0.9844}} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
}
export const CHINH_PHUC_HALLOWEEN = {
  nen: `${C}/nen.jpg`,
  thapTong: `${C}/thap_tong.webp`,
  thapCd: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `${C}/thap_cd_${i}.webp`),
  hop: {"thap_tong":{"x0":0.0176,"y0":0.0326,"x1":0.9824,"y1":1},"thap_cd_1":{"x0":0.0488,"y0":0.0117,"x1":0.9512,"y1":1},"thap_cd_2":{"x0":0.043,"y0":0.0117,"x1":0.957,"y1":1},"thap_cd_3":{"x0":0.0469,"y0":0.0117,"x1":0.9531,"y1":1},"thap_cd_4":{"x0":0.0566,"y0":0.0117,"x1":0.9434,"y1":1},"thap_cd_5":{"x0":0.0488,"y0":0.0117,"x1":0.9512,"y1":1},"thap_cd_6":{"x0":0.0176,"y0":0.0404,"x1":0.9824,"y1":1},"thap_cd_7":{"x0":0.0547,"y0":0.0117,"x1":0.9453,"y1":1},"thap_cd_8":{"x0":0.0352,"y0":0.0117,"x1":0.9648,"y1":1}} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
  deTong: { src: `${C}/de_tong.webp`, tl: 1536 / 1024, mat: [0.5,0.2373] as [number, number] },
  deCd: { src: `${C}/de_cd.webp`, tl: 1, mat: [0.5,0.3418] as [number, number] },
  cau: { src: `${C}/cau.webp`, tl: 2, a: [0.03,0.4736] as [number, number], b: [0.97,0.4727] as [number, number] },
}
