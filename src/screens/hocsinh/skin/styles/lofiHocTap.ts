// SINH TỰ ĐỘNG bởi scripts/lofi-hinh.mjs — đừng sửa tay. Khu HỌC TẬP + màn CHINH PHỤC BK của style Lo-fi chill (Đơn L3 + bổ sung, 12/10).
// hop = hộp PHẦN NHÌN THẤY (alpha > 40) theo tỉ lệ khung — cùng khuôn khoiHocTap.ts. mat = tâm mặt cỏ của đế (giữa đỉnh đảo và hàng rộng nhất);
// cầu: a/b = đáy cọc 2 đầu cầu. Tháp đã cắt sát + đặt chạm đáy khung 512×768.
const G = '/bk-ui/hs/skin/lofi/hoctap', C = '/bk-ui/hs/skin/lofi/chinhphuc'
export const HOC_TAP_LOFI = {
  nen: `url(${G}/nen_ngang.jpg) center / cover no-repeat, #f3b38a`,
  nenDoc: `url(${G}/nen_doc.jpg) center / cover no-repeat, #f3b38a`,
  dao: { hoc_chu_de: `${G}/dao_hoc_chu_de.webp`, luyen_yeu: `${G}/dao_luyen_yeu.webp`, dau_truong: `${G}/dao_dau_truong.webp`, chinh_phuc: `${G}/dao_chinh_phuc.webp`, giai_vo_dich: `${G}/dao_giai_vo_dich.webp` },
  hop: {"hoc_chu_de":{"x0":0.0234,"y0":0.0234,"x1":0.987,"y1":0.9362},"luyen_yeu":{"x0":0.0391,"y0":0.0273,"x1":0.9661,"y1":0.9297},"dau_truong":{"x0":0,"y0":0.0143,"x1":1,"y1":0.9635},"chinh_phuc":{"x0":0.2383,"y0":0.0078,"x1":0.7747,"y1":0.9844},"giai_vo_dich":{"x0":0.0052,"y0":0.0299,"x1":0.9961,"y1":0.9727}} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
}
export const CHINH_PHUC_LOFI = {
  nen: `${C}/nen.jpg`,
  thapTong: `${C}/thap_tong.webp`,
  thapCd: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `${C}/thap_cd_${i}.webp`),
  hop: {"thap_tong":{"x0":0.0781,"y0":0.0117,"x1":0.9219,"y1":1},"thap_cd_1":{"x0":0.1309,"y0":0.0117,"x1":0.8691,"y1":1},"thap_cd_2":{"x0":0.1738,"y0":0.0117,"x1":0.8262,"y1":1},"thap_cd_3":{"x0":0.1484,"y0":0.0117,"x1":0.8535,"y1":1},"thap_cd_4":{"x0":0.1211,"y0":0.0117,"x1":0.8789,"y1":1},"thap_cd_5":{"x0":0.0898,"y0":0.0117,"x1":0.9121,"y1":1},"thap_cd_6":{"x0":0.1914,"y0":0.0117,"x1":0.8086,"y1":1},"thap_cd_7":{"x0":0.1484,"y0":0.0117,"x1":0.8516,"y1":1},"thap_cd_8":{"x0":0.0957,"y0":0.0117,"x1":0.9043,"y1":1}} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
  deTong: { src: `${C}/de_tong.webp`, tl: 1536 / 1024, mat: [0.5,0.2432] as [number, number] },
  deCd: { src: `${C}/de_cd.webp`, tl: 1, mat: [0.5,0.2471] as [number, number] },
  cau: { src: `${C}/cau.webp`, tl: 2, a: [0.03,0.5391] as [number, number], b: [0.97,0.5391] as [number, number] },
}
