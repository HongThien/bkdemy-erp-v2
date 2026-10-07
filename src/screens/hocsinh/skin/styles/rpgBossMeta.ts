// SINH TỰ ĐỘNG bởi scripts/anime-boss-trang-cuong.mjs (đừng sửa tay) — số đo khung đã chuẩn hoá của boss Trang + Cường.
// W×H = cỡ mọi khung của boss · (px,py) = neo chân trong khung (đã lật ngang: boss đứng phải nhìn trái) · diem[pose].tay/sach = điểm nòng/sách so với neo (px, ĐÃ lật) · fx[…] = cỡ ảnh FX.
export type DiemPose = { tay: [number, number]; sach: [number, number] }
export type MetaBossTC = { W: number; H: number; px: number; py: number; diem: Record<string, DiemPose>; fx: Record<string, { w: number; h: number }> }
export const META_BOSS_TC: Record<'trang' | 'cuong', MetaBossTC> = {
  "trang": {
    "W": 620,
    "H": 537,
    "px": 276.4,
    "py": 532.2,
    "diem": {
      "idle": {
        "tay": [
          -133,
          -315
        ],
        "sach": [
          164,
          -261
        ]
      },
      "talk_1": {
        "tay": [
          -140,
          -312
        ],
        "sach": [
          156,
          -258
        ]
      },
      "talk_2": {
        "tay": [
          -107,
          -312
        ],
        "sach": [
          188,
          -259
        ]
      },
      "hit": {
        "tay": [
          -151,
          -318
        ],
        "sach": [
          154,
          -262
        ]
      },
      "taunt": {
        "tay": [
          -129,
          -313
        ],
        "sach": [
          168,
          -259
        ]
      },
      "defeat": {
        "tay": [
          -98,
          -199
        ],
        "sach": [
          103,
          -162
        ]
      },
      "cast_prepare": {
        "tay": [
          -156,
          -311
        ],
        "sach": [
          138,
          -258
        ]
      },
      "cast_release": {
        "tay": [
          -55,
          -308
        ],
        "sach": [
          213,
          -260
        ]
      },
      "ruler_up": {
        "tay": [
          -169,
          -312
        ],
        "sach": [
          125,
          -259
        ]
      },
      "ruler_down": {
        "tay": [
          30,
          -202
        ],
        "sach": [
          146,
          -259
        ]
      },
      "fire_charge": {
        "tay": [
          -151,
          -313
        ],
        "sach": [
          80,
          -270
        ]
      },
      "fire_release": {
        "tay": [
          -142,
          -321
        ],
        "sach": [
          -142,
          -256
        ]
      }
    },
    "fx": {
      "btvn": {
        "w": 358,
        "h": 106
      },
      "fireball": {
        "w": 887,
        "h": 444
      },
      "desk": {
        "w": 393,
        "h": 204
      }
    }
  },
  "cuong": {
    "W": 824,
    "H": 539,
    "px": 418.1,
    "py": 532.7,
    "diem": {
      "idle": {
        "tay": [
          -137,
          -313
        ],
        "sach": [
          160,
          -259
        ]
      },
      "talk_1": {
        "tay": [
          -163,
          -312
        ],
        "sach": [
          132,
          -258
        ]
      },
      "talk_2": {
        "tay": [
          -175,
          -311
        ],
        "sach": [
          123,
          -257
        ]
      },
      "hit": {
        "tay": [
          -315,
          -310
        ],
        "sach": [
          -14,
          -255
        ]
      },
      "taunt": {
        "tay": [
          -174,
          -311
        ],
        "sach": [
          121,
          -257
        ]
      },
      "defeat": {
        "tay": [
          -78,
          -204
        ],
        "sach": [
          135,
          -166
        ]
      },
      "cast_prepare": {
        "tay": [
          -34,
          -310
        ],
        "sach": [
          264,
          -256
        ]
      },
      "cast_release": {
        "tay": [
          -35,
          -383
        ],
        "sach": [
          241,
          -258
        ]
      },
      "sword_up": {
        "tay": [
          -319,
          -313
        ],
        "sach": [
          -22,
          -259
        ]
      },
      "sword_slash": {
        "tay": [
          -397,
          -317
        ],
        "sach": [
          -34,
          -262
        ]
      },
      "fire_charge": {
        "tay": [
          -192,
          -315
        ],
        "sach": [
          -112,
          -333
        ]
      },
      "fire_release": {
        "tay": [
          -306,
          -386
        ],
        "sach": [
          -32,
          -257
        ]
      }
    },
    "fx": {
      "btvn": {
        "w": 358,
        "h": 106
      },
      "fireball": {
        "w": 887,
        "h": 444
      },
      "chicken": {
        "w": 437,
        "h": 398
      }
    }
  }
}
