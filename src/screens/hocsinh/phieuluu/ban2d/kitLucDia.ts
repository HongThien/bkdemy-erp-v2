// KIT LỤC ĐỊA (Đơn 12 — design/bk-ui-src/AppHS/<kit>/DESIGN.md): nền vẽ sẵn ĐƯỜNG + 8 công trình rời + chibi chạy. Toạ độ = % khung 16:9 (1672×941).
// Mỗi kit: chân 8 công trình, bề rộng (% khung), đường tâm ≥24 điểm (mốc = điểm đánh `*`), kiểu chữ nhãn, bảng cỡ nhân vật theo độ sâu.
// Ảnh nén ở public/bk-ui/hs/skin/rpg/lucdia/<biome>/ (scripts/anime-kit-lucdia.mjs); số đo ảnh + neo ở kitLucDia.anh.ts (sinh tự động).
// Màu ở đây là màu RIÊNG của từng bức tranh (chữ nhãn đọc trên tranh đó) — không phải màu giao diện nên được gõ ở file .ts này, ngoài luật của màn.
// Biome KHÔNG có kit (hoặc >8 chuyên đề) ⇒ màn dùng bản vẽ chung cũ (LucDia2D/boCuc).
import { DUONG_DO } from './kitLucDia.duong'

export interface KitLucDia {
  biome: string
  /** chân 8 công trình theo thứ tự đường đi: x%, y%, bề rộng % khung */
  moc: { x: number; y: number; w: number }[]
  /** đường tâm (x%, y%) + chỉ số điểm là mốc của từng công trình */
  duong: [number, number][]
  diemMoc: number[]
  /** nhãn: chữ + viền (đọc được trên tranh) */
  chu: { mau: string; vien: string }
  /** cao nhân vật (% chiều CAO khung) tại y=30% · 55% · 80%, nội suy tuyến tính rồi kẹp */
  nv: [number, number, number]
}

/** "x,y x,y* …" — dấu * đánh mốc công trình */
function tuyen(s: string): { duong: [number, number][]; diemMoc: number[] } {
  const duong: [number, number][] = [], diemMoc: number[] = []
  s.trim().split(/\s+/).forEach((p, i) => { const [x, y] = p.replace('*', '').split(',').map(Number); duong.push([x, y]); if (p.endsWith('*')) diemMoc.push(i) })
  return { duong, diemMoc }
}

const THO: Record<string, ReturnType<typeof tuyen>> = {}
/** Tâm đường: ƯU TIÊN đường DÒ THẬT từ nền (kitLucDia.duong.ts — scripts/anime-duong-kit.mjs); tuyến xấp xỉ trong DESIGN.md chỉ là dự phòng. */
function duongCua(biome: string, tho: string): ReturnType<typeof tuyen> { return DUONG_DO[biome] ?? (THO[biome] ??= tuyen(tho)) }

export const KIT_LUC_DIA: Record<string, KitLucDia> = {
  rung: {
    biome: 'rung',
    moc: [{ x: 12, y: 72, w: 10 }, { x: 19, y: 25, w: 10 }, { x: 36, y: 56, w: 11 }, { x: 40, y: 31, w: 13 }, { x: 55, y: 77, w: 13 }, { x: 63, y: 30, w: 15 }, { x: 80, y: 67, w: 15 }, { x: 90, y: 35, w: 18 }],
    ...duongCua('rung', '0,50 4,52 7,57 7,63 4,70 5,75 9,75 12,72* 16,68 19,62 18,53 15,45 13,39 14,34 17,31 19,25* 23,31 27,36 30,40 35,42 42,44 46,49 45,54 40,55 36,56* 34,49 32,43 29,39 28,34 29,27 32,21 35,22 37,27 40,31* 44,37 46,45 46,54 43,64 43,70 46,75 51,75 55,77* 61,80 66,83 68,78 67,70 63,60 60,52 58,46 59,41 62,37 63,30* 68,37 71,40 71,46 69,52 72,56 76,57 79,61 80,67* 85,65 90,62 94,57 94,51 92,47 86,44 84,40 86,37 90,35* 94,39 97,46 100,50'),
    chu: { mau: '#FFF7DA', vien: '#243B25' }, nv: [4.5, 6, 7.5],
  },
  thanh_co: {
    biome: 'thanh_co',
    moc: [{ x: 10.5, y: 52, w: 8 }, { x: 23.5, y: 33.5, w: 12 }, { x: 36, y: 63, w: 7 }, { x: 46, y: 39, w: 8 }, { x: 63, y: 38, w: 10 }, { x: 60, y: 69, w: 14 }, { x: 82, y: 73, w: 16 }, { x: 88, y: 44, w: 18 }],
    ...duongCua('thanh_co', '0,53 5,54 10.5,55* 14,52 16,45 18,38 21,34 23.5,34* 27,38 28,46 28,55 30,61 33,65 36,65* 39,63 41,57 42,49 44,43 46,39* 50,37 55,37 60,38 63,39* 67,40 70,44 70,51 69,58 67,65 64,69 60,71* 64,73 71,74 77,75 82,75* 88,73 92,68 94,61 94,55 91,49 88,44* 91,46 95,51 100,53'),
    chu: { mau: '#3D2C1C', vien: '#FFF1CF' }, nv: [5, 7, 9],
  },
  anh_dao: {
    biome: 'anh_dao',
    moc: [{ x: 8.5, y: 42, w: 14 }, { x: 26, y: 61, w: 13 }, { x: 32, y: 45, w: 15 }, { x: 47, y: 47, w: 10 }, { x: 59, y: 36, w: 11 }, { x: 69, y: 67, w: 19 }, { x: 80, y: 29, w: 18 }, { x: 89, y: 63, w: 21 }],
    ...duongCua('anh_dao', '0,44 4,44 8.5,42* 13,42 16,45 18,51 18,57 21,62 26,64* 30,62 32,58 32,52 33,47* 36,43 40,44 43,45 47,44* 51,43 54,40 57,37 59,36* 61,39 62,43 60,49 59,54 61,60 65,64 69,67* 73,65 75,60 75,52 76,43 78,34 80,29* 82,29 83,33 83,41 81,50 81,56 84,61 89,64* 93,66 97,65 100,62'),
    chu: { mau: '#362A43', vien: '#FFF4DD' }, nv: [5, 7, 9],
  },
}
