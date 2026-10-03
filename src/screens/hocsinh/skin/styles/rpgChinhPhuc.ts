// SINH TỰ ĐỘNG bởi scripts/anime-chinh-phuc.mjs — đừng sửa tay. Màn CHINH PHỤC BK của style Anime RPG (kit hs-chinh-phuc-bk-v4, Đơn 14 Kit A).
// thap: hộp phần nhìn thấy của 9 tháp (tỉ lệ khung 512×768) — chân = đáy hộp. Đế/cầu: neo theo DESIGN.md mục 6 (tỉ lệ trong ảnh, giữ khung).
const G = '/bk-ui/hs/skin/rpg/chinhphuc'
export const CHINH_PHUC_RPG = {
  nen: `${G}/nen.jpg`,
  thapTong: `${G}/thap_tong.webp`,
  thapCd: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `${G}/thap_cd_${i}.webp`),
  hop: {"thap_tong":{"x0":0.0684,"y0":0.0065,"x1":0.9648,"y1":0.9961},"thap_cd_1":{"x0":0.0645,"y0":0.0065,"x1":0.9375,"y1":0.9948},"thap_cd_2":{"x0":0.0742,"y0":0.0052,"x1":0.9336,"y1":1},"thap_cd_3":{"x0":0.0684,"y0":0.0104,"x1":0.9922,"y1":0.9961},"thap_cd_4":{"x0":0.0352,"y0":0.0091,"x1":0.9609,"y1":0.9909},"thap_cd_5":{"x0":0.0391,"y0":0.0065,"x1":0.9609,"y1":1},"thap_cd_6":{"x0":0.0137,"y0":0.0052,"x1":0.9902,"y1":0.9987},"thap_cd_7":{"x0":0.0352,"y0":0.0065,"x1":0.9941,"y1":1},"thap_cd_8":{"x0":0.1094,"y0":0,"x1":0.9004,"y1":0.9987}} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
  deTong: { src: `${G}/de_tong.webp`, tl: 1536 / 1024, mat: [0.5, 0.35] as [number, number], mep: [[0.1, 0.36], [0.9, 0.36]] as [number, number][] },
  deCd: { src: `${G}/de_cd.webp`, tl: 1, mat: [0.5, 0.4] as [number, number], mep: [[0.12, 0.42], [0.88, 0.42]] as [number, number][] },
  cau: { src: `${G}/cau_sang.webp`, tl: 1774 / 887, a: [0.05, 0.6] as [number, number], b: [0.95, 0.6] as [number, number] },
}
