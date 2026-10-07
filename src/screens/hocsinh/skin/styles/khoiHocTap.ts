// SINH TỰ ĐỘNG bởi scripts/khoi-hoc-tap.mjs — đừng sửa tay. Khu HỌC TẬP + màn CHINH PHỤC BK của style Khối vuông (Đơn K3, 07/10).
// hop = hộp PHẦN NHÌN THẤY (alpha > 40) theo tỉ lệ khung PNG — cùng khuôn rpgHocTap.ts / rpgChinhPhuc.ts. Neo đế/cầu đo trên ảnh gốc
// (mặt đá = hàng rộng nhất của đế: tổng y≈0,337 · chủ đề y≈0,404; cầu: mặt ván y≈0,60, 2 đầu sát mép ảnh).
const G = '/bk-ui/hs/skin/khoi/hoctap', C = '/bk-ui/hs/skin/khoi/chinhphuc'
export const HOC_TAP_KHOI = {
  nen: `url(${G}/nen_ngang.jpg) center / cover no-repeat, #f7c6a3`,
  nenDoc: `url(${G}/nen_doc.jpg) center / cover no-repeat, #f7c6a3`,
  dao: { hoc_chu_de: `${G}/dao_hoc_chu_de.webp`, luyen_yeu: `${G}/dao_luyen_yeu.webp`, dau_truong: `${G}/dao_dau_truong.webp`, chinh_phuc: `${G}/dao_chinh_phuc.webp`, giai_vo_dich: `${G}/dao_giai_vo_dich.webp` },
  hop: {"hoc_chu_de":{"x0":0.0352,"y0":0.0286,"x1":0.9635,"y1":0.9648},"luyen_yeu":{"x0":0.0352,"y0":0.0911,"x1":0.9661,"y1":0.9427},"dau_truong":{"x0":0.0924,"y0":0.1732,"x1":0.9258,"y1":0.8854},"chinh_phuc":{"x0":0.2669,"y0":0.1523,"x1":0.776,"y1":0.8984},"giai_vo_dich":{"x0":0.1094,"y0":0.0677,"x1":0.9271,"y1":0.9518}} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
}
export const CHINH_PHUC_KHOI = {
  nen: `${C}/nen.jpg`,
  thapTong: `${C}/thap_tong.webp`,
  thapCd: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `${C}/thap_cd_${i}.webp`),
  hop: {"thap_tong":{"x0":0.043,"y0":0.0104,"x1":0.9551,"y1":1},"thap_cd_1":{"x0":0.0078,"y0":0.0273,"x1":0.998,"y1":1},"thap_cd_2":{"x0":0.0039,"y0":0.0221,"x1":0.998,"y1":1},"thap_cd_3":{"x0":0.002,"y0":0.0156,"x1":0.998,"y1":1},"thap_cd_4":{"x0":0.0039,"y0":0.0195,"x1":0.998,"y1":1},"thap_cd_5":{"x0":0.0039,"y0":0.0182,"x1":1,"y1":1},"thap_cd_6":{"x0":0.002,"y0":0.0208,"x1":0.998,"y1":1},"thap_cd_7":{"x0":0.0098,"y0":0.0065,"x1":0.9844,"y1":1},"thap_cd_8":{"x0":0.0039,"y0":0.0195,"x1":0.998,"y1":1}} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
  deTong: { src: `${C}/de_tong.webp`, tl: 1536 / 1024, mat: [0.5, 0.337] as [number, number] },
  deCd: { src: `${C}/de_cd.webp`, tl: 1, mat: [0.5, 0.404] as [number, number] },
  cau: { src: `${C}/cau.webp`, tl: 2, a: [0.02, 0.6] as [number, number], b: [0.98, 0.6] as [number, number] },
}
