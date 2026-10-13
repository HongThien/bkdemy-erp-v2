// SINH TỰ ĐỘNG bởi scripts/lofi-hinh.mjs — đừng sửa tay. Màn chính "SỐNG" của style Lo-fi chill (Đơn L2, 12/10) — hợp đồng HomeSong ở skin/kieu.ts.
// nen: lớp PHÒNG đã khoét trời (phông xanh) + dải TRỜI trôi sau cửa sổ; hopTroi = hộp vùng trời trong khung phòng (tỉ lệ), tl = rộng/cao khung phòng, tlTroi = rộng/cao dải trời.
// nv: MẢNH hoạt họa cắt từ khung vẽ lại (đã bù lệch so với hình gốc, mép mờ dần) — hop = [x0, y0, x1, y1] tỉ lệ khung góc học; den = tâm ánh đèn bàn.
// Hình hiệu ứng rời (lá · nốt nhạc · sao giấy · hơi nước · cuộn len) đã nén sẵn ở public/bk-ui/hs/skin/lofi/song/fx_*.webp — chưa màn nào dùng.
import type { HomeSong, LopNenSong } from '../kieu'
type Hop4 = [number, number, number, number]
const S = '/bk-ui/hs/skin/lofi/song'
const lop = (gio: 'chieu' | 'dem', kho: 'ngang' | 'doc', hopTroi: LopNenSong['hopTroi'], tl: number, tlTroi: number): LopNenSong =>
  ({ phong: `${S}/phong_${gio}_${kho}.webp`, troi: `${S}/troi_${gio}.jpg`, hopTroi, tl, tlTroi })
export const SONG_LOFI: Required<Pick<HomeSong, 'nen' | 'nv'>> = {
  nen: {
    cua_so: {
      sang: { ngang: lop('chieu', 'ngang', {"x0":0.0114,"y0":0,"x1":0.317,"y1":0.3974}, 1.7768, 2.9417), doc: lop('chieu', 'doc', {"x0":0.0191,"y0":0,"x1":0.3401,"y1":0.2972}, 0.5628, 2.9417) },
      toi: { ngang: lop('dem', 'ngang', {"x0":0.0114,"y0":0,"x1":0.3242,"y1":0.3039}, 1.7768, 2.4533), doc: lop('dem', 'doc', {"x0":0.0191,"y0":0.0054,"x1":0.3411,"y1":0.3002}, 0.5628, 2.4533) },
    },
  },
  nv: {
    nam: {
    rong: 640, cao: 648, den: [0.72,0.38] as [number, number],
    viet: [{ src: `${S}/nam/viet_2.webp`, hop: [0.4,0.45,0.62,0.66] as Hop4 }, { src: `${S}/nam/viet_3.webp`, hop: [0.4,0.45,0.62,0.66] as Hop4 }, { src: `${S}/nam/viet_4.webp`, hop: [0.4,0.45,0.62,0.66] as Hop4 }],
    nghi: [{ src: `${S}/nam/ngang_len.webp`, hop: [0.24,0,0.78,0.4] as Hop4 }, { src: `${S}/nam/gat_gu.webp`, hop: [0.24,0,0.78,0.4] as Hop4 }],
    duoi: [{ src: `${S}/nam/duoi_2.webp`, hop: [0,0.33,0.22,0.6] as Hop4 }, { src: `${S}/nam/duoi_3.webp`, hop: [0,0.33,0.22,0.6] as Hop4 }],
    ngap: { src: `${S}/nam/ngap.webp`, hop: [0.22,0.44,0.4,0.64] as Hop4 },
  },
    nu: {
    rong: 640, cao: 654, den: [0.73,0.4] as [number, number],
    viet: [{ src: `${S}/nu/viet_2.webp`, hop: [0.38,0.44,0.6,0.66] as Hop4 }, { src: `${S}/nu/viet_3.webp`, hop: [0.38,0.44,0.6,0.66] as Hop4 }, { src: `${S}/nu/viet_4.webp`, hop: [0.38,0.44,0.6,0.66] as Hop4 }],
    nghi: [{ src: `${S}/nu/ngang_len.webp`, hop: [0.1,0.02,0.7,0.48] as Hop4 }, { src: `${S}/nu/gat_gu.webp`, hop: [0.1,0.02,0.7,0.48] as Hop4 }],
    duoi: [{ src: `${S}/nu/duoi_2.webp`, hop: [0,0.52,0.24,0.92] as Hop4 }, { src: `${S}/nu/duoi_3.webp`, hop: [0,0.52,0.24,0.92] as Hop4 }],
    ngap: { src: `${S}/nu/ngap.webp`, hop: [0.22,0.5,0.38,0.7] as Hop4 },
  },
  },
}
