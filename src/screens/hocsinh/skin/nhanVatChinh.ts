// SINH TỰ ĐỘNG bởi scripts/anime-nhan-vat-chinh.mjs — đừng sửa tay. 4 NHÂN VẬT CHÍNH mới (kit nhan_vat_moi_v1, Thùy 03/10); ảnh ở public/bk-ui/hs/skin/rpg/nhanvat/<id>/.
// chay: khung CHẠY/BAY (f1..fN, N = số khung kit đang có) + đứng — ax trục thân, ay[i] neo đất khung i+1, top đỉnh đầu (tỉ lệ canvas 360×540)
// dau: 15 tư thế chiến đấu (512×768) — ax/ay neo, tay điểm tay (tỉ lệ canvas) · thanDung = cao thân đứng / cao canvas (cỡ chung cả chuỗi)
export type NvMoi = 'su_tu' | 'cao' | 'ninja' | 'elf'
export interface NvChinh { ten: string; moTa: string; bay: boolean; chay: { w: number; h: number; ax: number; ay: number[]; ayDung: number; top: number }; thanDung: number; dau: Record<string, { ax: number; ay: number; tay: number[][] }> }
export const NV_MOI: NvMoi[] = ["su_tu","cao","ninja","elf"]
export const NHAN_VAT_CHINH: Record<NvMoi, NvChinh> = {
  "su_tu": {
    "ten": "Chiến binh Sư tử",
    "moTa": "Dũng mãnh, kiếm và khiên",
    "bay": false,
    "chay": {
      "w": 360,
      "h": 540,
      "ax": 0.55,
      "ay": [
        0.954,
        0.939,
        0.935,
        0.944
      ],
      "ayDung": 0.985,
      "top": 0.017
    },
    "thanDung": 0.9557,
    "dau": {
      "dung_1": {
        "ax": 0.55,
        "ay": 0.9714,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "dung_2": {
        "ax": 0.55,
        "ay": 0.972,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "suy_nghi": {
        "ax": 0.55,
        "ay": 0.9733,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "tich_nang_1": {
        "ax": 0.55,
        "ay": 0.9733,
        "tay": [
          [
            0.65,
            0.47
          ]
        ]
      },
      "tich_nang_2": {
        "ax": 0.55,
        "ay": 0.9694,
        "tay": [
          [
            0.87,
            0.5
          ]
        ]
      },
      "niem_troi_1": {
        "ax": 0.55,
        "ay": 0.9681,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "niem_troi_2": {
        "ax": 0.55,
        "ay": 0.9766,
        "tay": [
          [
            0.21,
            0.13
          ],
          [
            0.92,
            0.19
          ]
        ]
      },
      "nem_truoc_1": {
        "ax": 0.55,
        "ay": 0.929,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "nem_truoc_2": {
        "ax": 0.55,
        "ay": 0.9036,
        "tay": [
          [
            0.93,
            0.43
          ]
        ]
      },
      "phat_nho": {
        "ax": 0.55,
        "ay": 0.9727,
        "tay": [
          [
            0.93,
            0.4
          ]
        ]
      },
      "bi_danh_1": {
        "ax": 0.55,
        "ay": 0.9577,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "bi_danh_2": {
        "ax": 0.55,
        "ay": 0.9316,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "guc": {
        "ax": 0.55,
        "ay": 0.9199,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "thang_1": {
        "ax": 0.55,
        "ay": 0.9857,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "thang_2": {
        "ax": 0.55,
        "ay": 0.9674,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      }
    }
  },
  "cao": {
    "ten": "Pháp sư Cáo",
    "moTa": "Tinh thông phép thuật",
    "bay": false,
    "chay": {
      "w": 360,
      "h": 540,
      "ax": 0.55,
      "ay": [
        0.948,
        0.959,
        0.924,
        0.944
      ],
      "ayDung": 0.965,
      "top": 0.043
    },
    "thanDung": 0.9251,
    "dau": {
      "dung_1": {
        "ax": 0.55,
        "ay": 0.9629,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "dung_2": {
        "ax": 0.55,
        "ay": 0.9824,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "suy_nghi": {
        "ax": 0.55,
        "ay": 0.9785,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "tich_nang_1": {
        "ax": 0.55,
        "ay": 0.9635,
        "tay": [
          [
            0.65,
            0.47
          ]
        ]
      },
      "tich_nang_2": {
        "ax": 0.55,
        "ay": 0.9447,
        "tay": [
          [
            0.86,
            0.53
          ]
        ]
      },
      "niem_troi_1": {
        "ax": 0.55,
        "ay": 0.9707,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "niem_troi_2": {
        "ax": 0.55,
        "ay": 0.9544,
        "tay": [
          [
            0.39,
            0.28
          ],
          [
            0.91,
            0.28
          ]
        ]
      },
      "nem_truoc_1": {
        "ax": 0.55,
        "ay": 0.9284,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "nem_truoc_2": {
        "ax": 0.55,
        "ay": 0.8704,
        "tay": [
          [
            0.95,
            0.46
          ]
        ]
      },
      "phat_nho": {
        "ax": 0.55,
        "ay": 0.9753,
        "tay": [
          [
            0.94,
            0.4
          ]
        ]
      },
      "bi_danh_1": {
        "ax": 0.55,
        "ay": 0.944,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "bi_danh_2": {
        "ax": 0.55,
        "ay": 0.9531,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "guc": {
        "ax": 0.55,
        "ay": 0.931,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "thang_1": {
        "ax": 0.55,
        "ay": 0.9909,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "thang_2": {
        "ax": 0.55,
        "ay": 0.9688,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      }
    }
  },
  "ninja": {
    "ten": "Ninja",
    "moTa": "Nhanh như gió, ra đòn bất ngờ",
    "bay": false,
    "chay": {
      "w": 360,
      "h": 540,
      "ax": 0.55,
      "ay": [
        0.952,
        0.948,
        0.944
      ],
      "ayDung": 0.972,
      "top": 0.031
    },
    "thanDung": 0.9336,
    "dau": {
      "dung_1": {
        "ax": 0.55,
        "ay": 0.9681,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "dung_2": {
        "ax": 0.55,
        "ay": 0.9701,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "suy_nghi": {
        "ax": 0.55,
        "ay": 0.9629,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "tich_nang_1": {
        "ax": 0.55,
        "ay": 0.9714,
        "tay": [
          [
            0.65,
            0.47
          ]
        ]
      },
      "tich_nang_2": {
        "ax": 0.55,
        "ay": 0.9622,
        "tay": [
          [
            0.86,
            0.51
          ]
        ]
      },
      "niem_troi_1": {
        "ax": 0.55,
        "ay": 0.972,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "niem_troi_2": {
        "ax": 0.55,
        "ay": 0.9655,
        "tay": [
          [
            0.31,
            0.12
          ],
          [
            0.86,
            0.17
          ]
        ]
      },
      "nem_truoc_1": {
        "ax": 0.55,
        "ay": 0.9551,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "nem_truoc_2": {
        "ax": 0.55,
        "ay": 0.89,
        "tay": [
          [
            0.92,
            0.46
          ]
        ]
      },
      "phat_nho": {
        "ax": 0.55,
        "ay": 0.9609,
        "tay": [
          [
            0.93,
            0.41
          ]
        ]
      },
      "bi_danh_1": {
        "ax": 0.55,
        "ay": 0.9564,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "bi_danh_2": {
        "ax": 0.55,
        "ay": 0.9329,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "guc": {
        "ax": 0.55,
        "ay": 0.9342,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "thang_1": {
        "ax": 0.55,
        "ay": 1.026,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "thang_2": {
        "ax": 0.55,
        "ay": 0.9733,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      }
    }
  },
  "elf": {
    "ten": "Tinh linh Elf",
    "moTa": "Bay lượn giữa ánh sáng",
    "bay": true,
    "chay": {
      "w": 360,
      "h": 540,
      "ax": 0.5,
      "ay": [
        0.946,
        0.92,
        0.88,
        0.935
      ],
      "ayDung": 0.924,
      "top": 0.02
    },
    "thanDung": 0.8457,
    "dau": {
      "dung_1": {
        "ax": 0.5,
        "ay": 0.9948,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "dung_2": {
        "ax": 0.5,
        "ay": 1.0026,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "suy_nghi": {
        "ax": 0.5,
        "ay": 1.015,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "tich_nang_1": {
        "ax": 0.5,
        "ay": 1.002,
        "tay": [
          [
            0.65,
            0.47
          ]
        ]
      },
      "tich_nang_2": {
        "ax": 0.5,
        "ay": 1.0098,
        "tay": [
          [
            0.9,
            0.45
          ]
        ]
      },
      "niem_troi_1": {
        "ax": 0.5,
        "ay": 1.0391,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "niem_troi_2": {
        "ax": 0.5,
        "ay": 1.0046,
        "tay": [
          [
            0.43,
            0.16
          ],
          [
            0.88,
            0.19
          ]
        ]
      },
      "nem_truoc_1": {
        "ax": 0.5,
        "ay": 1.0098,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "nem_truoc_2": {
        "ax": 0.5,
        "ay": 1.0215,
        "tay": [
          [
            0.94,
            0.4
          ]
        ]
      },
      "phat_nho": {
        "ax": 0.5,
        "ay": 0.9909,
        "tay": [
          [
            0.94,
            0.33
          ]
        ]
      },
      "bi_danh_1": {
        "ax": 0.5,
        "ay": 0.9922,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "bi_danh_2": {
        "ax": 0.5,
        "ay": 0.9674,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "guc": {
        "ax": 0.5,
        "ay": 0.9375,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "thang_1": {
        "ax": 0.5,
        "ay": 1.0645,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      },
      "thang_2": {
        "ax": 0.5,
        "ay": 1.0039,
        "tay": [
          [
            0.75,
            0.5
          ]
        ]
      }
    }
  }
}
