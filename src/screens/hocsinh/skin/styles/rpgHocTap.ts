// SINH TỰ ĐỘNG bởi scripts/anime-hoc-tap.mjs — đừng sửa tay. Khu HỌC TẬP của style Anime RPG (kit hs-hoc-tap-v2, Đơn 14 Kit B, Thùy duyệt 03/10).
// hop = hộp PHẦN NHÌN THẤY của đảo (alpha > 40) theo tỉ lệ khung PNG vuông — đặt đảo theo tâm + bề rộng phần này (DESIGN.md mục 3), khung PNG giữ nguyên lề.
const G = '/bk-ui/hs/skin/rpg/hoctap'
export const HOC_TAP_RPG = {
  nen: `url(${G}/nen_ngang.jpg) center / cover no-repeat, #080e37`,
  nenDoc: `url(${G}/nen_doc.jpg) center / cover no-repeat, #080e37`,
  dao: { hoc_chu_de: `${G}/dao_hoc_chu_de.webp`, luyen_yeu: `${G}/dao_luyen_yeu.webp`, dau_truong: `${G}/dao_dau_truong.webp`, chinh_phuc: `${G}/dao_chinh_phuc.webp`, giai_vo_dich: `${G}/dao_giai_vo_dich.webp` },
  hop: {"hoc_chu_de":{"x0":0.0431,"y0":0.0375,"x1":0.9777,"y1":0.9633},"luyen_yeu":{"x0":0.0351,"y0":0.0191,"x1":0.9745,"y1":0.9785},"dau_truong":{"x0":0.0263,"y0":0.1005,"x1":0.9777,"y1":0.933},"chinh_phuc":{"x0":0.1794,"y0":0.0231,"x1":0.8142,"y1":0.9793},"giai_vo_dich":{"x0":0.075,"y0":0.0542,"x1":0.925,"y1":0.9577}} as Record<string, { x0: number; y0: number; x1: number; y1: number }>,
}
