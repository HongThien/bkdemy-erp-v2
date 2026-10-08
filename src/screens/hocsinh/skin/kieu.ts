// ============================================================================
// HỢP ĐỒNG 1 STYLE (skin) của app HS — mọi style trong skin/styles/*.ts PHẢI khai đủ kiểu `Skin` này.
// Đọc design/STYLE-HS.md trước khi thêm style hoặc thêm tính năng/màn mới.
// ============================================================================

import type { BangMau3D } from './the3d/kieuMau'
import type { LoiHS } from './loi'


// Thêm style mới: thêm id ở đây + file skin/styles/<id>.ts + đăng ký trong registry.ts + migration nới CHECK hs_giao_dien.skin.
export type SkinId = 'rpg' | 'toi_gian' | 'khoi'
export type CheDo = 'sang' | 'toi' | 'he_thong'
// hieu_ung_game: công tắc của em (mig 202610020037, mặc định bật) — tắt ⇒ không bản đồ phiêu lưu / màn đấu. Không có trường (bản cũ) = bật.
export type GiaoDien = { skin: SkinId; che_do: CheDo; hinh_nen: string; hieu_ung_game?: boolean }

export type Mau = {
  bg: string; surface: string; surface2: string; ink: string; muted: string; line: string
  acc: string; accInk: string; badge: string; badgeInk: string
  cardBorder: string; cardShadow: string
  /** NỀN MÀN TRONG (Thùy 06/10): đơn sắc/tối, thay tranh nền ở mọi màn bên trong. Không khai ⇒ dùng `bg`. */
  nenTrong?: string
}
// Bảng màu MÀN ĐỌC (tầng cuối tra cứu — xem `Skin.doc`). nen = nền trang · giay = thẻ nội dung · vd = khối ví dụ ·
// nham* = khối "hay nhầm" · luuY* = khối "lưu ý". Màu nhấn KHÔNG ở đây — theo môn (`mauDocMon`).
export type MauDoc = {
  font: string; nen: string; giay: string; ink: string; muted: string; line: string; bong: string
  vd: string; nhamNen: string; nhamVien: string; nhamChu: string; luuYNen: string; luuYChu: string
}
// sangDoc/toiDoc: bản cho màn DỌC (điện thoại) — tranh vẽ riêng khổ 9:16, không có thì dùng bản thường.
export type HinhNen = { id: string; ten: string; sang?: string; toi?: string; sangDoc?: string; toiDoc?: string }

// SỔ HÌNH BẢN ĐỒ PHIÊU LƯU 2D của 1 style (phieuluu/ban2d/hinh2d.ts đọc qua đây — màn KHÔNG gõ đường dẫn ảnh). Mỗi style khai ở
// skin/styles/<id>BanDo2d.ts. Danh sách nào thiếu biome ⇒ màn vẽ HÌNH TẠM bằng màu biome của `the3d` (ghép dần được).
export type BanDo2D = {
  g: string                 // thư mục ảnh (public)
  nenTheGioi: string        // file nền tầng thế giới (trong g)
  /** GHÉP THEO TRANH: chủ đề thứ i ⇒ mảnh i (biome + tâm x,y + bề rộng w, % khung 16:9). Ảnh mảnh = `${g}/${tienToLucDia}${biome}.webp` */
  lucDia: { biome: string; x: number; y: number; w: number }[]
  tienToLucDia: string
  tlLucDia: number          // rộng / cao khung ảnh mảnh (mọi mảnh cùng tỉ lệ)
  nhanDuoi?: number         // nhãn tên lục địa đặt dưới tâm mảnh bao nhiêu × bề rộng mảnh (mặc định 0,04 — mảnh dẹt)
  nenVung: string[]; nenChang: string[]; nenDang: string[]   // biome có tranh nen_vung_ / nen_chang_ / nen_dang_<biome>.jpg
  moc: string[]             // công trình mốc đã có (moc_<loại>.webp) — vòng lại theo thứ tự
  vat: string[]             // vật nhỏ đã có: be_da · may_suong · la_ban · co_chinh_phuc (<tên>.webp)
  /** chỗ đặt mốc dò trên từng nền vùng (% khung) — không có ⇒ bố cục đường chung (boCuc.ts) */
  choMoc?: Record<string, { x: number; y: number }[]>
  /** có KIT lục địa Đơn 12 (nền vẽ sẵn đường + 8 công trình/biome, phieuluu/ban2d/kitLucDia*.ts) — kit vẽ theo nét của style này */
  kit?: boolean
}

// BOSS RIÊNG (mỗi GV 1 boss — design/FLOW-NPC-BOSS-CUOI.md): 6 tư thế + chân dung, PNG trong suốt cùng khung vuông, chân chạm đáy.
// Khoá của `Skin.boss` = mã boss (`boss_<ma_gv>`) — cũng là `loai_quai` DB trả về. Thiếu boss ở style nào ⇒ rơi về quái thường.
/** Thông số dựng boss CHIBI 3D bằng code (skin/the3d/bossChibi3D.ts) — mỗi GV 1 dòng. Màu lấy từ bảng màu của style. */
export type MoHinhChibi = {
  da: string; toc: string
  /** kính gọng nửa */
  kinh: boolean
  ao: string; aoLot: string; vien: string; ngoc: string
  /** hào quang thường · khi giận (pha 2) */
  hao: string; haoGian: string
}
import type { AnhNv, AnhTt, NguoiDanAnh } from './anhGiaoDien'
export type NenManId = 'bxh' | 'nhiem_vu' | 'thanh_tuu'
/** Khung 9-slice: cat = độ dày góc (px trên ảnh GỐC w×h; 4 cạnh bằng nhau theo file .slice.json của kit) */
export type Khung9 = { src: string; w: number; h: number; cat: number }
export type AnhBxh = {
  huyChuong: [string, string, string]; khien: string; muiTen: string; huyHieu: string; trong: string
  khungHang: Khung9; khungHangEm: Khung9; khungDai: Khung9; khungChon: Khung9; khungChonMo: Khung9; khungMenu: Khung9
  /** mã bảng (A1…E1) → icon */
  iconBang: Record<string, string>
}
/** 1 đoạn HOẠT ẢNH THEO KHUNG của boss có animation vẽ riêng (vd Minh Quân — design/bk-ui-src/AppHS/Animation/minh-quan-boss). Mọi khung cùng neo chân. */
export type ClipBoss = {
  src: string[]
  /** thời gian từng khung (ms) */
  ms: number[]
  /** true = lặp (nói chuyện); false = phát 1 lần rồi GIỮ khung cuối (laser · trúng đòn · hạ gục) */
  lap?: boolean
  /** bề rộng khung ảnh + hoành độ neo chân trong ảnh (px). Mặc định 768 / 384; laser 2048 / 450 */
  rong?: number; px?: number
  /** chiều cao khung + tung độ neo chân (px). Mặc định 640 / 580 (Minh Quân); Trang/Cường khung khác (số đo sinh bởi scripts/anime-boss-trang-cuong.mjs → styles/rpgBossMeta.ts) */
  cao?: number; py?: number
  /** lật ngang quanh neo — ảnh vẽ hướng PHẢI mà boss đứng bên phải nhìn sang TRÁI (laser) */
  lat?: boolean
}
/** 1 chiêu tấn công riêng của boss (thay đòn "ma thuật" chung). tia = laser vẽ sẵn trong ảnh · don/mua = vật bay (ảnh FX riêng) · song = nổ tại tay + sóng xung kích lan tới nhân vật */
export type ChieuBoss = {
  ten: string; kieu: 'tia' | 'don' | 'mua' | 'song'; clip: ClipBoss
  /** câu thoại hiện trong bong bóng trên đầu boss lúc bắt đầu chiêu (≈1,9 giây) */
  thoai?: string
  /** bàn gỗ đứng yên suốt chiêu (đập thước xuống bàn): toạ độ = tâm mép TRÊN bàn so với neo chân (px khung), rong = bề rộng ảnh (px khung) */
  ban?: { anh: string; x: number; y: number; rong: number }
  /** nạp lửa: từ `tuMs` tới `phongMs` ngọn lửa bốc ở vị trí `vi` (so với neo, px khung), lớn dần */
  sac?: { anh: string; vi: [number, number]; tuMs: number; rong: number; /** CSS background của quầng sáng sau ngọn lửa */ nen: string }
  /** nhát chém hồ quang ở tay boss lúc phóng (kiếm) — màu nét + màu quầng */
  chem?: { net: string; bong: string }
  /** tia: chiều dài tia trong ảnh gốc, tính từ neo chân tới đầu tia (px, khung gốc) — để biết boss phải LAO tới gần nhân vật bao nhiêu thì tia chạm */
  daiTia?: number
  /** ms (từ lúc bắt đầu clip) đòn chạm nhân vật — tia: lúc tia chạm · tên lửa: lúc phóng */
  phongMs: number
  /** tên lửa: số quả · cách nhau (ms) · thời gian bay (ms) · điểm nòng trong ảnh (px, khung 768×640, đúng neo (384,580)) */
  qua?: {
    n: number; cach: number; bay: number; nong: [number, number][]
    /** điểm gốc của `nong`: mặc định (384,580) = neo khung 768×640; [0,0] = nong đã tính SO VỚI NEO chân */
    neo?: [number, number]
    /** ảnh riêng của chiêu (thay `anhTenLua`) + bề rộng = keCao × rong (mặc định 0.4; ảnh tỉ lệ theo `ty` = cao/rộng) */
    anh?: string; rong?: number; ty?: number
    /** false = không xoay theo quỹ đạo (chữ BTVN); mặc định true. Ảnh riêng (`anh`) vẽ mũi hướng PHẢI — bay sang trái được lật ngang cho khỏi ngược đầu */
    xoay?: boolean; quang?: string
    /** độ vồng quỹ đạo (× chiều cao sân); mặc định: nhiều quả ⇒ 0.5, một quả ⇒ 0 */
    vong?: number
  }
}
export type BossAnh = {
  /** boss có hoạt ảnh theo khung: tư thế nào có ở đây thì phát clip, không thì dùng ảnh tĩnh cùng tên */
  khung?: Partial<Record<'dung' | 'noi' | 'chieu' | 'trung' | 'gian' | 'ha', ClipBoss>>
  /** các chiêu riêng (xoay vòng mỗi lần boss tấn công) + ảnh FX tên lửa (mũi hướng PHẢI) */
  chieuRieng?: ChieuBoss[]; anhTenLua?: string
  /** màu hiệu ứng của chiêu riêng: nền tia nổ (CSS background) + màu quầng tên lửa */
  fx?: {
    no: string; vet: string
    /** bong bóng thoại của chiêu (ChieuBoss.thoai) */
    thoai?: { nen: string; vien: string; chu: string }
    /** sóng xung kích (ChieuBoss kieu 'song'): màu viền + quầng */
    song?: { vien: string; bong: string }
  }
  /** Cách dựng boss trong cảnh trận 3D. 'anh' = tấm ảnh 2D quay mặt camera + hoạt ảnh code (quaiAnh.ts) — MẶC ĐỊNH, nhẹ, giống bản vẽ 100%.
   *  'relief' = phù điêu từ chính ảnh (quaiRelief.ts, có khối nhẹ) · 'chibi' = dựng khối bằng code (bossChibi3D.ts, cần mo3d; thô — chỉ để thử). */
  dang?: 'anh' | 'relief' | 'chibi'
  /** có ⇒ MÔ HÌNH dựng bằng khối cơ bản theo thông số này (bossChibi3D.ts); không có cả hai ⇒ tấm ảnh 2D (quaiAnh.ts) */
  mo3d?: MoHinhChibi
  ten: string
  /** chiều cao nhân vật trong cảnh 3D (đơn vị thế giới; quái thường ~1.3–1.6) */
  cao: number
  dung: string; noi: string; chieu: string; trung: string; gian: string; ha: string
  chandung: string
}

export type Skin = {
  id: SkinId
  ten: string
  moTa: string
  giongGi: string
  font: string          // chữ thường
  fontHead: string      // tiêu đề, tên ô, số to (font phải khai thêm ở hs.html)
  headCase: 'none' | 'uppercase'
  headTrack: string
  radius: string        // bo góc thẻ
  // bo góc của thứ dáng VIÊN THUỐC / TRÒN (nút tròn đầu trang, nhãn, badge, chip môn, avatar). Không khai = '999px' (tròn).
  // Style vuông (Khối vuông) khai '0px' — nếu không nút vẫn tròn giữa thẻ vuông (lỗ ① spec-giao-dien-hs §10).
  radiusPill?: string
  cardClip: string      // clip-path thẻ ('none' nếu không cắt góc)
  cardAccentLeft: string // viền trái nhấn — 'none' nếu không
  blur: string          // backdrop-filter của thẻ (skin nền ảnh cần mờ sau thẻ)
  // LỜI CHỮ giọng game (skin/loi.ts): không khai ⇒ bản FORMAL gốc. Khai từng khoá để ghi đè (Thùy 03/10: bản gốc phải formal, style game được múa máy).
  loi?: Partial<LoiHS>
  cheDo: ('sang' | 'toi')[] // chế độ skin hỗ trợ; 1 phần tử = khoá chế độ đó
  sang?: Mau
  toi?: Mau
  hinhNen: HinhNen[]    // phần tử đầu = mặc định
  // id Ô CHỨC NĂNG → icon vẽ riêng của style. MỌI ô trong KHU/KHU_CAP2 (HocSinhApp) phải có — ô mới thêm mà thiếu icon
  // thì `npm run check:style-hs` báo, và app tạm hiện dauThayIcon.
  anhO?: Record<string, string>
  // NỀN MÀN TRONG có hồn (Đơn 16, 07/10): ảnh trời đêm riêng cho 3 màn — không khai ⇒ giữ nền đơn sắc (--sk-nen-trong). ngang = iPad/PC · doc = điện thoại dọc.
  nenMan?: Partial<Record<NenManId, { ngang: string; doc: string }>>
  // BỘ ĐỒ HOẠ màn Bảng xếp hạng (Đơn 15) — không khai ⇒ màn tự vẽ bằng code (khung đơn sắc + huy chương emoji).
  anhBxh?: AnhBxh
  // Bộ đồ hoạ màn Nhiệm vụ (Đơn hs-nhiem-vu-v1) + Thành tựu (hs-thanh-tuu-v1) — không khai ⇒ vẽ bằng code
  anhNv?: AnhNv
  anhTt?: AnhTt
  /** người dẫn truyện hoạt hình (Lộc) cho Tutorial/giới thiệu; style không khai ⇒ dùng nhân vật tĩnh `nhanVat` */
  nguoiDan?: NguoiDanAnh
  // true ⇒ icon ô là nét đơn sắc dùng làm MẶT NẠ, tô bằng màu chữ của style (style đơn sắc: 1 bộ icon đúng cả sáng lẫn tối)
  anhOMask?: boolean
  // Ô thiếu icon ⇒ hiện DẤU này (màu nhấn) thay vì emoji — emoji lẫn icon vẽ tay trông lệch (Thùy 28/09).
  dauThayIcon?: string
  trangTri?: { goc?: string; gach?: string } // hoa văn góc thẻ "Tiếp theo" + gạch phân cách dưới đầu trang
  anhBanner?: { lich?: string; kiemTraLai?: string } // ảnh vẽ riêng cho thẻ ca bổ trợ + banner bài kiểm tra lại
  // Thẻ "Việc tiếp theo": mặc định tô đặc màu nhấn. Skin nền tối sang (RPG) tô đặc thì thành mảng vàng thô — dùng kiểu riêng.
  theTiep?: { bg: string; ink: string; border: string }
  // Tấm mờ sau tên HS — skin nền ẢNH cần (tên đè lên tia sáng/lâu đài thì không đọc được). Có nenTen + chế độ TỐI ⇒ bật luôn bóng chữ toàn trang.
  nenTen?: string
  // Nhân vật cắt nền (PNG trong suốt) đứng nửa trái Home khổ NGANG (PC/iPad) kèm bong bóng thoại — như ảnh gốc style
  // (RPG: design/bk-ui-src/Nền app HS cấp 3_11.png). Chọn theo giới tính HS; chưa biết ⇒ `nam`. Không có ⇒ Home ngang không vẽ nhân vật.
  nhanVat?: { nam: string; nu: string }
  // Bảng màu 3D của bản đồ phiêu lưu (thế giới · lục địa · chặng đường · màn đấu) — 1 bảng duy nhất cho cả cảnh (skin/the3d/kieuMau.ts).
  the3d?: BangMau3D
  // Sổ hình bản đồ phiêu lưu 2D (xem `BanDo2D`). Không khai ⇒ mọi tầng vẽ hình tạm theo màu `the3d`.
  banDo2d?: BanDo2D
  // Ảnh QUÁI theo mã loài (`loai` — skin/the3d/loai.ts), PNG/WebP trong suốt cắt sát. Không có loài đó ⇒ quái tạm CC0 (ban2d/quaiCc0.ts).
  quai2d?: Record<string, string>
  // Hình của GAME NHÚNG (src/dautu — Đấu trường BK, leo tháp): nền menu · nền màn đấu/leo tháp · icon 5 mục menu. Không khai ⇒ game dùng hình mặc định của nó.
  game?: { nenMenu: string; nenDau: string; icon: { dau: string; giai: string; thap: string; noi_tu: string; goc: string } }
  // Boss riêng của từng giáo viên (ảnh 2D chibi, hoạt ảnh bằng code). Khoá = mã boss.
  boss?: Record<string, BossAnh>
  // THẺ CÂU HỎI TRONG MÀN ĐẤU (Thùy 02/10: "viền card + font chưa mang vibe game") — không khai ⇒ dùng thẻ thường của style.
  // font: chữ đề + đáp án · nen/vien: nền + khung thẻ (box-shadow nhiều lớp = viền kép) · phien/phienDay: phiến đáp án + gờ dưới (bấm lún)
  tran?: { font: string; nen: string; vien: string; phien: string; phienDay: string }
  // MÀN ĐỌC — tầng CUỐI của luồng tra cứu (1 mục sổ tay, 1 lý thuyết dạng): màn riêng nền SÁNG trơn, KHÔNG tranh nền
  // (Thùy 03/10: "menu vẫn hiện backdrop, vào lớp cuối cùng phải hiện màn riêng — ô trên nền backdrop rất khó nhìn";
  // mẫu: file gốc KHTN Pocket). Không khai ⇒ dùng DOC_MAC_DINH (registry). Màu nhấn theo MÔN/phân môn: `mauDocMon` (registry).
  doc?: Partial<MauDoc>
  // Nền SÂN ĐẤU TRƯỜNG (Thử thách — ảnh ngang ~2,8:1, mặt sân ở ~60–100% chiều dọc). Không khai ⇒ sân là mảng màu của style (Tối giản).
  sanDau?: string
  // KHU HỌC TẬP kiểu game (Thùy 03/10: "5 ô = mỗi cái 1 lục địa trôi nổi trên bầu trời sao"): nền trời + ảnh ĐẢO cho từng ô (khoá = id ô ở hoctap/HocTapHS.tsx).
  // Không khai ⇒ khu Học tập là lưới ô thường (Tối giản…).
  // nenDoc: nền khổ dọc (điện thoại) · hop: hộp PHẦN NHÌN THẤY của từng đảo trong khung PNG (tỉ lệ) — có ⇒ đặt đảo theo tâm + bề rộng phần này (kit DESIGN.md).
  hocTap?: { nen: string; nenDoc?: string; dao: Record<string, string>; hop?: Record<string, { x0: number; y0: number; x1: number; y1: number }> }
  // MÀN CHINH PHỤC BK (leo tháp — hoctap/ChinhPhucHS.tsx): nền + tháp tổng + 8 mẫu tháp chủ đề + đế đảo + cầu. Không khai ⇒ vào thẳng menu leo tháp của game.
  chinhPhuc?: {
    nen: string; thapTong: string; thapCd: string[]
    /** hộp phần nhìn thấy của tháp trong khung PNG (khoá 'thap_tong' | 'thap_cd_<i>') — chân tháp = đáy hộp */
    hop: Record<string, { x0: number; y0: number; x1: number; y1: number }>
    /** đế đảo: tl = rộng/cao khung · mat = tâm mặt đá (tỉ lệ khung) — chân tháp đặt vào đây */
    deTong: { src: string; tl: number; mat: [number, number] }
    deCd: { src: string; tl: number; mat: [number, number] }
    /** cầu: a/b = 2 đầu cầu (tỉ lệ khung) — kéo dãn từ a tới b */
    cau: { src: string; tl: number; a: [number, number]; b: [number, number] }
  }
}
