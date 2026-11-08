// HALLOWEEN BẢN ERP (Thùy 30/10: "tao muốn erp kiểu như này" — video Gemini: nhà ma trên đồi, trăng tròn, nghĩa địa, bí ngô sáng khắp nơi, dơi, MA TRỒI TỪ MỘ
// bay lượn; chọn "cách 2" = dựng lại bằng tranh tĩnh + code, không dùng thẳng video). App HS GIỮ bản đáng yêu; vỏ ERP thay style `halloween` bằng bản này
// (cùng id ⇒ ai đã chọn vẫn giữ — lib/erpSkin.ts `BAN_ERP`). Đơn tranh chính thức: design/DON-HANG-HALLOWEEN-ERP.md.
// Tranh: đơn E #01 (ngang 1672×941) + #02 (dọc 941×1672) vẽ lại đúng cảnh video, sạch (không ma, không dơi, không dấu) — gốc design/bk-ui-src/halloween-erp/,
// nén vào public/bk-ui/erp/halloween/nha_ma_<ngang|doc>.jpg. Điểm đo trên chính 2 tranh đó (lưới % — 30/10): x, y = tâm (% ảnh) · r = đường kính quầng (% bề ngang).
// Tranh phủ khung kiểu `center` (neoY 0,5) để giữ cả trăng ở trên lẫn hàng bí ngô ở dưới khi màn rộng xén bớt chiều dọc.
import { HALLOWEEN } from '../screens/hocsinh/skin/styles/halloween'
import type { HoatCanh, Skin } from '../screens/hocsinh/skin/kieu'

const E = '/bk-ui/erp/halloween'
// Phủ tím mỏng trên + dưới cho chữ trên tranh đọc được; giữa giữ nguyên.
const PHU = 'linear-gradient(180deg, rgba(28,16,44,0.4) 0%, rgba(28,16,44,0) 26%, rgba(28,16,44,0) 70%, rgba(28,16,44,0.35) 100%)'
const tranh = (kho: 'ngang' | 'doc') => `${PHU}, url(${E}/nha_ma_${kho}.jpg) center / cover no-repeat, #1c1230`

const goc = HALLOWEEN.hoatCanh!
const NEN_CU = HALLOWEEN.hinhNen.map((h) => h.id)

const HOAT_CANH_ERP: HoatCanh = {
  diem: {
    ...goc.diem,
    nha_ma: {
      tl: 1672 / 941, neoY: 0.5, suong: true,
      ds: [
        { x: 19.2, y: 19, r: 26, kieu: 'trang' },
        // cửa sổ + cửa chính nhà ma — chập chờn như nến bên trong
        { x: 53.9, y: 17.6, r: 2.4, kieu: 'den', ck: 2.3 }, { x: 54, y: 24.8, r: 3, kieu: 'den', ck: 2.1 }, { x: 56.9, y: 24.8, r: 3, kieu: 'den', ck: 2.7 },
        { x: 48.2, y: 34.9, r: 3.2, kieu: 'den', ck: 1.9 }, { x: 61.4, y: 35.4, r: 3, kieu: 'den', ck: 2.4 }, { x: 52.6, y: 48.2, r: 5, kieu: 'den', ck: 3 },
        { x: 48, y: 48.6, r: 2.8, kieu: 'den', ck: 2.6 }, { x: 56.6, y: 47, r: 2.6, kieu: 'den', ck: 2.2 }, { x: 60.1, y: 45.3, r: 2.8, kieu: 'den', ck: 2.8 }, { x: 61.9, y: 45.6, r: 2.8, kieu: 'den', ck: 2.5 },
        // 15 quả bí ngô — sáng → tắt → sáng, lệch pha
        { x: 10.5, y: 88.7, r: 14, kieu: 'bi', ck: 5.8 }, { x: 27, y: 81.9, r: 7, kieu: 'bi', ck: 4.4 }, { x: 33.8, y: 89.5, r: 9, kieu: 'bi', ck: 5.1 },
        { x: 32.4, y: 75.8, r: 5, kieu: 'bi', ck: 3.7 }, { x: 43, y: 82.1, r: 7.5, kieu: 'bi', ck: 4.8 }, { x: 46, y: 76.4, r: 4.4, kieu: 'bi', ck: 3.3 },
        { x: 38.9, y: 66.3, r: 4, kieu: 'bi', ck: 4.1 }, { x: 49, y: 65.5, r: 3.2, kieu: 'bi', ck: 3.6 }, { x: 56.1, y: 80, r: 6, kieu: 'bi', ck: 4.6 },
        { x: 62.7, y: 66.3, r: 3.8, kieu: 'bi', ck: 3.9 }, { x: 62.7, y: 59.2, r: 3, kieu: 'bi', ck: 4.3 }, { x: 66.7, y: 86, r: 9.5, kieu: 'bi', ck: 5.4 },
        { x: 78.9, y: 70.5, r: 3.4, kieu: 'bi', ck: 3.5 }, { x: 83.9, y: 79.2, r: 8, kieu: 'bi', ck: 4.9 }, { x: 88.3, y: 88.7, r: 13, kieu: 'bi', ck: 6 },
      ],
      // ma vải trồi từ 8 bia mộ (chân bia đo trên tranh), lượn lên trời rồi tan
      ma: [
        { x: 11.7, y: 76, s: 5, ck: 18, lat: true }, { x: 21.2, y: 84, s: 6.5, ck: 15 }, { x: 36.9, y: 82, s: 6, ck: 13 },
        { x: 42, y: 75, s: 4.5, ck: 19 }, { x: 60.5, y: 80, s: 6, ck: 16, lat: true }, { x: 75.7, y: 82, s: 6, ck: 14 },
        { x: 92.2, y: 78, s: 6, ck: 17, lat: true }, { x: 38, y: 58, s: 3.5, ck: 20 },
      ],
    },
    // KHỔ DỌC (điện thoại) — tranh #02
    'nha_ma:doc': {
      tl: 941 / 1672, neoY: 0.5, suong: true,
      ds: [
        { x: 27.2, y: 11.9, r: 46, kieu: 'trang' },
        { x: 61.3, y: 24.7, r: 4, kieu: 'den', ck: 2.3 }, { x: 61.6, y: 29.4, r: 5, kieu: 'den', ck: 2.1 }, { x: 67.4, y: 29.4, r: 5, kieu: 'den', ck: 2.7 },
        { x: 49.6, y: 35.6, r: 5.5, kieu: 'den', ck: 1.9 }, { x: 76.7, y: 36.3, r: 5, kieu: 'den', ck: 2.4 }, { x: 58, y: 44.1, r: 9, kieu: 'den', ck: 3 },
        { x: 48.7, y: 44.3, r: 5, kieu: 'den', ck: 2.6 }, { x: 66.7, y: 43.6, r: 4.6, kieu: 'den', ck: 2.2 }, { x: 73.7, y: 42.4, r: 5, kieu: 'den', ck: 2.8 }, { x: 77.4, y: 42.8, r: 5, kieu: 'den', ck: 2.5 },
        { x: 41.8, y: 53.9, r: 6, kieu: 'bi', ck: 4.2 }, { x: 75.7, y: 53.5, r: 5.5, kieu: 'bi', ck: 3.8 }, { x: 33.3, y: 57.5, r: 9, kieu: 'bi', ck: 4.6 },
        { x: 72.8, y: 57.9, r: 8, kieu: 'bi', ck: 4 }, { x: 20.3, y: 59.4, r: 5, kieu: 'bi', ck: 3.4 }, { x: 16.4, y: 61.3, r: 7, kieu: 'bi', ck: 3.9 },
        { x: 43.9, y: 62.9, r: 9, kieu: 'bi', ck: 4.4 }, { x: 36.7, y: 67.3, r: 13, kieu: 'bi', ck: 5 }, { x: 67.9, y: 68.5, r: 13, kieu: 'bi', ck: 5.2 },
        { x: 33.6, y: 77.4, r: 18, kieu: 'bi', ck: 5.6 }, { x: 73.3, y: 75.4, r: 16, kieu: 'bi', ck: 5.3 }, { x: 14.7, y: 85.7, r: 32, kieu: 'bi', ck: 6.2 },
        { x: 90.1, y: 84.2, r: 28, kieu: 'bi', ck: 5.9 },
      ],
      ma: [
        { x: 17.5, y: 76, s: 12, ck: 16 }, { x: 26, y: 66, s: 10, ck: 18, lat: true }, { x: 27, y: 58, s: 8, ck: 14 },
        { x: 79, y: 69, s: 11, ck: 15, lat: true }, { x: 87.5, y: 74.8, s: 11, ck: 17 }, { x: 70.8, y: 50, s: 7, ck: 19, lat: true },
      ],
    },
  },
  // tiền cảnh bí ngô cắt từ tranh "phố đêm" / "vườn bí" chỉ hợp với 3 tranh cũ — tranh nhà ma đã có sẵn hàng bí ngô ở dưới
  tienCanh: (goc.tienCanh ?? []).map((t) => ({ ...t, chiNen: NEN_CU })),
  doi: goc.doi ? { ...goc.doi, so: 8 } : undefined,
  // bé ma nhỏ đáng yêu trôi xa: bỏ ở bản ERP (đã có ma vải)
  nvBong: true,
}

/** Halloween của vỏ ERP: Nhà ma (mặc định) + 3 tranh cũ; hoạt cảnh có ma trồi từ mộ + sương. */
export const HALLOWEEN_ERP: Skin = {
  ...HALLOWEEN,
  moTa: 'Nhà ma trên đồi, ma trồi từ mộ',
  hinhNen: [{ id: 'nha_ma', ten: 'Nhà ma', toi: tranh('ngang'), toiDoc: tranh('doc') }, ...HALLOWEEN.hinhNen],
  hoatCanh: HOAT_CANH_ERP,
}
