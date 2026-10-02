// SINH TỰ ĐỘNG bởi scripts/anime-chien-dau-2d.mjs — đừng sửa tay. Bộ CHIẾN ĐẤU 2D nhân vật chính (15 tư thế × nam/nữ, Thùy 02/10); ảnh ở public/bk-ui/hs/skin/rpg/dau_truong/.
// Mọi tư thế CÙNG khổ canvas, trục thân x = 50%. ay = neo ĐẤT (tỉ lệ dọc canvas) · tay = điểm tay/tâm cầu (tỉ lệ canvas) · thanDung = cao thân tư thế đứng / cao canvas
// ⇒ CÙNG một tỉ lệ cho mọi tư thế (theo tư thế đứng) — không phóng tư thế gục theo hộp bao (DESIGN.md).
export type TuTheDau = 'dung_1' | 'dung_2' | 'suy_nghi' | 'tich_nang_1' | 'tich_nang_2' | 'niem_troi_1' | 'niem_troi_2' | 'nem_truoc_1' | 'nem_truoc_2' | 'phat_nho' | 'bi_danh_1' | 'bi_danh_2' | 'guc' | 'thang_1' | 'thang_2'
export interface NeoTuThe { ay: number; tay: number[][] }
export const TU_THE_DAU: TuTheDau[] = ["dung_1","dung_2","suy_nghi","tich_nang_1","tich_nang_2","niem_troi_1","niem_troi_2","nem_truoc_1","nem_truoc_2","phat_nho","bi_danh_1","bi_danh_2","guc","thang_1","thang_2"]
export const HERO_DAU: Record<'nam' | 'nu', Record<TuTheDau, NeoTuThe>> = {
  "nam": {
    "dung_1": {
      "ay": 0.9577,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "dung_2": {
      "ay": 0.9414,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "suy_nghi": {
      "ay": 0.957,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "tich_nang_1": {
      "ay": 0.9421,
      "tay": [
        [
          0.73,
          0.46
        ]
      ]
    },
    "tich_nang_2": {
      "ay": 0.9264,
      "tay": [
        [
          0.86,
          0.48
        ]
      ]
    },
    "niem_troi_1": {
      "ay": 0.9486,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "niem_troi_2": {
      "ay": 0.9583,
      "tay": [
        [
          0.43,
          0.1
        ],
        [
          0.865,
          0.105
        ]
      ]
    },
    "nem_truoc_1": {
      "ay": 0.9186,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "nem_truoc_2": {
      "ay": 0.8867,
      "tay": [
        [
          0.955,
          0.39
        ]
      ]
    },
    "phat_nho": {
      "ay": 0.9596,
      "tay": [
        [
          0.97,
          0.33
        ]
      ]
    },
    "bi_danh_1": {
      "ay": 0.9271,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "bi_danh_2": {
      "ay": 0.9395,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "guc": {
      "ay": 0.8203,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "thang_1": {
      "ay": 0.94,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "thang_2": {
      "ay": 0.9264,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    }
  },
  "nu": {
    "dung_1": {
      "ay": 0.9538,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "dung_2": {
      "ay": 0.9499,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "suy_nghi": {
      "ay": 0.9577,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "tich_nang_1": {
      "ay": 0.9557,
      "tay": [
        [
          0.73,
          0.46
        ]
      ]
    },
    "tich_nang_2": {
      "ay": 0.9583,
      "tay": [
        [
          0.86,
          0.5
        ]
      ]
    },
    "niem_troi_1": {
      "ay": 0.9609,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "niem_troi_2": {
      "ay": 0.9596,
      "tay": [
        [
          0.41,
          0.07
        ],
        [
          0.825,
          0.08
        ]
      ]
    },
    "nem_truoc_1": {
      "ay": 0.9323,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "nem_truoc_2": {
      "ay": 0.8984,
      "tay": [
        [
          0.955,
          0.405
        ]
      ]
    },
    "phat_nho": {
      "ay": 0.9577,
      "tay": [
        [
          0.97,
          0.32
        ]
      ]
    },
    "bi_danh_1": {
      "ay": 0.9466,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "bi_danh_2": {
      "ay": 0.9329,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "guc": {
      "ay": 0.9004,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "thang_1": {
      "ay": 0.94,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    },
    "thang_2": {
      "ay": 0.9486,
      "tay": [
        [
          0.75,
          0.5
        ]
      ]
    }
  }
}
export const THAN_DUNG: Record<'nam' | 'nu', number> = {"nam":0.873,"nu":0.8665}
export const KHO_DAU = { w: 512, h: 768 }
const G = '/bk-ui/hs/skin/rpg/dau_truong'
export const anhDau = (g: 'nam' | 'nu', p: TuTheDau) => `${G}/${g}/${p}.webp`
export type FxDau = 'fx_cau_lua' | 'fx_cau_bang' | 'fx_dan_ma' | 'fx_thien_thach' | 'fx_bang_boc'
export const anhFx = (f: FxDau) => `${G}/${f}.webp`
/** Hộp vẽ để THÂN đứng cao đúng `cao` px, chân tư thế `p` chạm (x, y). */
export function hopDau(g: 'nam' | 'nu', p: TuTheDau, cao: number, x: number, y: number) {
  const h = cao / THAN_DUNG[g], w = h * (KHO_DAU.w / KHO_DAU.h)
  return { left: x - 0.5 * w, top: y - HERO_DAU[g][p].ay * h, width: w, height: h }
}
