// SINH TỰ ĐỘNG bởi scripts/anime-boss-thuy.mjs (đừng sửa tay) — số đo khung đã chuẩn hoá của 3 form boss cuối Thùy.
// W×H = cỡ mọi khung của form · (px,py) = neo chân trong khung (đã lật ngang: boss đứng phải nhìn trái) · diem[pose].tay = điểm tay/nòng so với neo (px, ĐÃ lật) · fx[…] = cỡ ảnh FX.
export type MetaBossThuy = { W: number; H: number; px: number; py: number; diem: Record<string, { tay: [number, number] }>; fx: Record<string, { w: number; h: number }> }
export const META_BOSS_THUY: Record<'thuy' | 'thuy2' | 'thuy3', MetaBossThuy> = {
  "thuy": {
    "W": 530,
    "H": 539,
    "px": 263.8,
    "py": 533.8,
    "diem": {
      "idle_1": {
        "tay": [
          -173,
          -327
        ]
      },
      "idle_2": {
        "tay": [
          -173,
          -327
        ]
      },
      "talk_1": {
        "tay": [
          -175,
          -327
        ]
      },
      "talk_2": {
        "tay": [
          -185,
          -327
        ]
      },
      "hit_1": {
        "tay": [
          -172,
          -327
        ]
      },
      "hit_2": {
        "tay": [
          -173,
          -294
        ]
      },
      "taunt_1": {
        "tay": [
          -173,
          -327
        ]
      },
      "taunt_2": {
        "tay": [
          -202,
          -327
        ]
      },
      "defeat": {
        "tay": [
          -91,
          -183
        ]
      },
      "point_prepare": {
        "tay": [
          -209,
          -427
        ]
      },
      "point_release": {
        "tay": [
          -246,
          -416
        ]
      },
      "point_hold": {
        "tay": [
          -236,
          -407
        ]
      },
      "snap_prepare": {
        "tay": [
          -182,
          -327
        ]
      },
      "snap_release": {
        "tay": [
          -150,
          -393
        ]
      },
      "snap_after": {
        "tay": [
          -149,
          -393
        ]
      },
      "swing_prepare": {
        "tay": [
          -185,
          -327
        ]
      },
      "swing_mid": {
        "tay": [
          -188,
          -373
        ]
      },
      "swing_release": {
        "tay": [
          -188,
          -378
        ]
      },
      "swing_after": {
        "tay": [
          -169,
          -374
        ]
      }
    },
    "fx": {
      "missile": {
        "w": 536,
        "h": 223
      },
      "fire": {
        "w": 887,
        "h": 444
      },
      "ice": {
        "w": 887,
        "h": 444
      }
    }
  },
  "thuy2": {
    "W": 512,
    "H": 547,
    "px": 247.5,
    "py": 541.7,
    "diem": {
      "idle": {
        "tay": [
          -155,
          -365
        ]
      },
      "talk": {
        "tay": [
          -155,
          -366
        ]
      },
      "cast": {
        "tay": [
          -207,
          -357
        ]
      }
    },
    "fx": {
      "btvn": {
        "w": 362,
        "h": 110
      }
    }
  },
  "thuy3": {
    "W": 565,
    "H": 542,
    "px": 272.7,
    "py": 536.9,
    "diem": {
      "idle": {
        "tay": [
          -183,
          -380
        ]
      },
      "cast": {
        "tay": [
          -200,
          -382
        ]
      },
      "rage": {
        "tay": [
          -202,
          -380
        ]
      },
      "ruler_windup": {
        "tay": [
          -212,
          -369
        ]
      },
      "ruler_strike": {
        "tay": [
          -190,
          -377
        ]
      }
    },
    "fx": {
      "btvn": {
        "w": 362,
        "h": 110
      },
      "test": {
        "w": 493,
        "h": 347
      }
    }
  }
}
