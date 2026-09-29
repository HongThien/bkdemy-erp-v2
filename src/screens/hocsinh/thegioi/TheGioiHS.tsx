// ============================================================================
// THẾ GIỚI BK — mạng xã hội KHOE nội bộ của HS (spec-the-gioi-bk.md · mockup chốt 29/09 https://claude.ai/artifact/QNDbroHiEMNPctHjS5dWTb).
// 3 tab: 🌏 Thế giới (tin S riêng + tin A GỘP theo loại — không ngập) · 🤝 Bạn bè (tin chi tiết của bạn + lời mời + kết bạn) ·
// 🏰 Lớp (tin chi tiết các lớp em học). Không đăng bài, không chat. Tên LUÔN kèm lớp.
// TƯƠNG TÁC = y hệt FACEBOOK (Thùy 29/09: "UX quen thuộc giống FB, đừng bắt học cái mới" — mig 202609290148):
//   dòng "👍❤️🔥 Em, Hà và 12 người khác · 5 bình luận" · thanh [👍 Thích] [💬 Bình luận] · bấm Thích = 👍, GIỮ = dải cảm xúc,
//   bấm lại = bỏ · tấm bình luận trượt lên: bong bóng xám, ô "Viết bình luận…" — chỉ khác FB ở chỗ chạm 1 CÂU soạn sẵn / STICKER là gửi
//   (không gõ chữ tự do, spec §5).
// Tách VIEW chỉ vẽ (TheGioiView · TamBinhLuan · TamCamXuc · TamKetBan — dùng chung app thật + hs.html?xem=gami&man=the_gioi) khỏi container.
// Style: chỉ skin/KhungHS (MAU/THE/HEAD) — design/STYLE-HS.md. Hình: gami/hinh.ts (KIT.the_gioi tắt ⇒ emoji; kit Đơn 5 về ⇒ bật cờ).
// Sau khi thả / bình luận / ẩn / trả lời lời mời: VÁ đúng tin/dòng đó tại chỗ, không tải lại cả danh sách (CLAUDE §2).
// ============================================================================
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ManHS, DauTrangHS, MAU, THE, THE_TRON, HEAD, NhomHS, TrongHS } from '../skin/KhungHS'
import { ICON_TIN, ICON_TG, anhTG, anhTin, anhTuongTac, anhSticker, anhPhaoGiay } from '../gami/hinh'
import {
  layKenh, thaCamXuc, guiBinhLuan, goBinhLuan, anBinhLuan, layChiTiet, anTin, datHien, banBeCuaToi, goiYKetBan, guiKetBan, traLoiKetBan, layDanhMuc,
  type KenhId, type KenhTG, type TinTG, type GopTG, type KhenTG, type NguoiTG, type BanBeTG, type GoiYTG, type DanhMucTG, type BinhLuanTG, type ChiTietTG,
} from '../../../lib/thegioi'

// ── Mảnh nhỏ ────────────────────────────────────────────────────────────────
function Hinh({ src, emoji, size }: { src: string | null; emoji: string; size: number }) {
  return src
    ? <img src={src} alt="" style={{ width: size, height: size, objectFit: 'contain' }} />
    : <span aria-hidden style={{ fontSize: Math.round(size * 0.78), lineHeight: 1 }}>{emoji}</span>
}
const NHAN_LOP: CSSProperties = { display: 'inline-block', marginLeft: 5, padding: '0 6px', borderRadius: 5, background: MAU.surface2, color: MAU.acc, fontSize: 11, fontWeight: 700, verticalAlign: 1 }
const ngan = (ten: string) => ten.trim().split(/\s+/).slice(-2).join(' ')

// Tên LUÔN kèm lớp (Thùy 29/09). Chế độ Mã HS ⇒ chỉ mã, không tên, không lớp.
export function TenLop({ n, rutGon }: { n: NguoiTG; rutGon?: boolean }) {
  if (n.an) return <span>{n.ma}</span>
  return <span>{rutGon ? ngan(n.ten ?? '') : n.ten}{n.lop && <span style={NHAN_LOP}>{n.lop}</span>}</span>
}
function Avatar({ n, size = 40 }: { n: NguoiTG | null; size?: number }) {
  const s: CSSProperties = { width: size, height: size, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    fontWeight: 800, fontSize: Math.round(size * 0.36), background: MAU.surface2, color: MAU.acc, boxShadow: `0 0 0 2px ${MAU.acc}` }
  if (!n || n.an) return <span style={s}><Hinh src={anhTG('avatar_an_danh')} emoji={ICON_TG.avatar_an_danh} size={size - 8} /></span>
  if (n.anh) return <span style={s}><img src={n.anh} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></span>
  return <span style={s}>{(n.ten ?? '').trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()}</span>
}

const TEN_GAME: Record<string, string> = { mo_ruong: 'Mở Rương', chiem_dat: 'Chiếm Đất', ban_qua: 'Bắn Quà' }
const TEN_GIAI: Record<string, string> = { xuat_sac: 'Xuất sắc', tien_bo: 'Tiến bộ', cham_chi: 'Chăm chỉ' }
const ddmm = (d: unknown) => { const s = String(d ?? ''); return s.length >= 10 ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : '' }
export function moTaTin(t: TinTG): ReactNode {
  const c = t.chi_tiet as Record<string, string | number>
  switch (t.kieu) {
    case 'nhat_buoi': return <><b>Nhất buổi</b> {t.mon} {ddmm(c.ngay)}</>
    case 'game_nhat': return <><b>Nhất {TEN_GAME[String(c.game)] ?? 'game'}</b> buổi {ddmm(c.ngay)}</>
    case 'doi_thang': return <>Đội {c.doi} thắng <b>{TEN_GAME[String(c.game)] ?? 'game'}</b> buổi {ddmm(c.ngay)}</>
    case 'tra_sua': return <>trúng <b>trà sữa 🧋</b> ở {TEN_GAME[String(c.game)] ?? 'game buổi'}</>
    case 'huy_hieu': return <>đạt huy hiệu <b>{c.ten ?? c.key} ★{c.sao}</b> · {t.mon}</>
    case 'giai_thang': return <>nhận giải <b>{TEN_GIAI[String(c.loai_giai)] ?? 'tháng'} tháng {Number(String(c.thang).slice(5, 7))}</b> · {t.mon}</>
    case 'et_cao': return <>đạt <b>ET {String(c.diem).replace('.', ',')} điểm</b> ({c.so_cau} câu) · {t.mon} {ddmm(c.ngay)}</>
    case 'tu_luyen': return <>luyện đúng <b>{c.so_dung} câu</b> trong ngày · {t.mon}</>
    default: return <>{t.kieu}</>
  }
}
function luc(at: string): string {
  const phut = Math.round((Date.now() - new Date(at).getTime()) / 60000)
  if (phut < 60) return `${Math.max(1, phut)} phút`
  if (phut < 24 * 60) return `${Math.round(phut / 60)} giờ`
  if (phut < 48 * 60) return 'hôm qua'
  const d = new Date(at); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}
const TIEU_DE_GOP: Record<string, (so: number) => ReactNode> = {
  nhat_buoi: (so) => <>Hôm nay <b>{so} bạn</b> Nhất buổi</>,
  game_nhat: (so) => <>Hôm nay <b>{so} bạn</b> Nhất game buổi</>,
  doi_thang: (so) => <>Hôm nay <b>{so} đội</b> thắng game buổi</>,
  huy_hieu: (so) => <>Tuần này <b>{so} bạn</b> nhận huy hiệu</>,
  et_cao: (so) => <>Hôm nay <b>{so} bạn</b> đạt ET 10 điểm</>,
}

function DauTang({ tang }: { tang: TinTG['tang'] }) {
  const src = anhTG(tang === 'S' ? 'tang_s' : tang === 'A' ? 'tang_a' : 'tang_b')
  return src ? <img src={src} alt={`Tầng ${tang}`} style={{ width: 18, height: 18 }} />
    : <span title={`Tầng ${tang}`} style={{ width: 18, height: 18, borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800,
        background: tang === 'S' ? MAU.acc : MAU.surface2, color: tang === 'S' ? MAU.accInk : MAU.acc, border: `1px solid ${MAU.line}` }}>{tang}</span>
}

// ── Tương tác kiểu Facebook ─────────────────────────────────────────────────
const KEYFRAMES = '@keyframes tgPop{from{transform:translateY(10px) scale(.4);opacity:0}to{transform:none;opacity:1}}'
const SO_TREN_DAI = 6 // dải cảm xúc hiện 6 cái đầu (thứ tự ở DB) + nút ＋ mở hết — như Messenger

// 3 icon chồng nhau (nhiều nhất trước) — y như FB
function IconChong({ k, size = 18 }: { k: KhenTG; size?: number }) {
  return (
    <span className="inline-flex items-center">
      {k.dem.slice(0, 3).map((d, i) => (
        <span key={d.ma} className="inline-flex items-center justify-center rounded-full" style={{ width: size + 4, height: size + 4, marginLeft: i ? -6 : 0, zIndex: 3 - i, background: MAU.bg, border: `1.5px solid ${MAU.bg}` }}>
          <Hinh src={anhTuongTac(d.ma)} emoji={d.icon} size={size} />
        </span>))}
    </span>
  )
}
// "Em, Hà [9A1] và 12 người khác"
function TenNguoiTha({ k }: { k: KhenTG }) {
  const ten = k.ten.map((x, i) => <span key={i}>{x.la_em ? 'Em' : <TenLop n={x.nguoi} rutGon />}</span>)
  const con = Math.max(0, k.tong - ten.length)
  if (ten.length === 0) return <span>{k.tong}</span>
  if (ten.length === 1) return <span>{ten[0]}{con > 0 && <> và {con} người khác</>}</span>
  return con > 0 ? <span>{ten[0]}, {ten[1]} và {con} người khác</span> : <span>{ten[0]} và {ten[1]}</span>
}

function DongTuongTac({ k, onMoTha, onMoBl }: { k: KhenTG; onMoTha: () => void; onMoBl: () => void }) {
  if (k.tong === 0 && k.so_bl === 0 && k.thay_co.length === 0) return null
  return (
    <div className="flex flex-col gap-1.5">
      {k.thay_co.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-bold" style={{ background: MAU.surface2, border: `1px solid ${MAU.acc}`, color: MAU.acc }}>
          <Hinh src={anhTG('thay_co_khen')} emoji={ICON_TG.thay_co_khen} size={20} /> Thầy cô khen · {k.thay_co.join(', ')}
        </div>
      )}
      {(k.tong > 0 || k.so_bl > 0) && (
        <div className="flex items-center gap-2 text-[12.5px]" style={{ color: MAU.muted }}>
          {k.tong > 0 && <button onClick={onMoTha} className="flex min-w-0 flex-1 items-center gap-1.5 text-left"><IconChong k={k} /><span className="truncate"><TenNguoiTha k={k} /></span></button>}
          {k.tong === 0 && <span className="flex-1" />}
          {k.so_bl > 0 && <button onClick={onMoBl} className="flex-none">{k.so_bl} bình luận</button>}
        </div>
      )}
    </div>
  )
}

// Dải cảm xúc bật lên khi GIỮ nút Thích
export function DaiCamXuc({ icons, chon, onChon, onThem, canh = 'trai' }: {
  icons: DanhMucTG[]; chon: string | null; onChon: (ma: string) => void; onThem: () => void; canh?: 'trai' | 'phai'
}) {
  return (
    <div className={`absolute bottom-[calc(100%+6px)] z-30 flex items-center gap-0.5 rounded-full px-1.5 py-1 shadow-2xl ${canh === 'trai' ? 'left-0' : 'right-0'}`}
      style={{ background: MAU.bg, border: `1px solid ${MAU.line}` }} role="menu" aria-label="Chọn cảm xúc">
      {icons.slice(0, SO_TREN_DAI).map((d, i) => (
        <button key={d.ma} role="menuitem" onClick={() => onChon(d.ma)} aria-label={d.nhan ?? d.ma} title={d.nhan ?? undefined}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:-translate-y-1 hover:scale-125 active:scale-110"
          style={{ animation: `tgPop .22s ${i * 0.03}s ease-out both`, background: chon === d.ma ? MAU.surface2 : 'transparent' }}>
          <Hinh src={anhTuongTac(d.ma)} emoji={d.noi_dung} size={30} />
        </button>))}
      <button onClick={onThem} aria-label="Thêm cảm xúc" className="flex h-9 w-9 items-center justify-center rounded-full text-[18px] font-bold"
        style={{ animation: `tgPop .22s ${SO_TREN_DAI * 0.03}s ease-out both`, background: MAU.surface2, color: MAU.muted }}>＋</button>
    </div>
  )
}

type TuongTacProps = {
  danhMuc: DanhMucTG[]; thanhKhoa: string | null
  onThanh: (khoa: string | null) => void; onTha: (t: TinTG, icon: string | null) => void
  onThemCamXuc: (t: TinTG) => void; onMoBl: (t: TinTG, xem: 'bl' | 'tha') => void
}
// Nút Thích: BẤM = 👍 (đã thả thì bỏ) · GIỮ ~0,4s = dải cảm xúc (như FB)
function NutThich({ t, p, nho, canh }: { t: TinTG; p: TuongTacProps; nho?: boolean; canh?: 'trai' | 'phai' }) {
  const hen = useRef(0), daGiu = useRef(false)
  const k = t.khen.cua_toi
  const icons = p.danhMuc.filter((d) => d.loai === 'icon')
  const giu = () => { daGiu.current = false; window.clearTimeout(hen.current); hen.current = window.setTimeout(() => { daGiu.current = true; p.onThanh(t.khoa) }, 400) }
  const tha = () => window.clearTimeout(hen.current)
  return (
    <div className={nho ? "relative flex-none" : "relative"}>
      <button onPointerDown={giu} onPointerUp={tha} onPointerLeave={tha} onPointerCancel={tha} onContextMenu={(e) => e.preventDefault()}
        onClick={() => { if (!daGiu.current) p.onTha(t, k ? null : 'thich') }}
        className={`flex items-center justify-center gap-1.5 rounded-lg font-bold select-none active:scale-95 ${nho ? 'h-8 px-2 text-[12.5px] whitespace-nowrap' : 'h-9 w-full text-[13.5px]'}`}
        style={{ color: k ? MAU.acc : MAU.muted, WebkitTouchCallout: 'none', touchAction: 'manipulation' }} aria-pressed={!!k}>
        {k ? <Hinh src={anhTuongTac(k.icon_ma)} emoji={k.icon} size={nho ? 16 : 19} /> : <Hinh src={anhTuongTac('thich')} emoji="👍" size={nho ? 15 : 18} />}
        {k ? k.nhan : 'Thích'}
      </button>
      {p.thanhKhoa === t.khoa && <DaiCamXuc icons={icons} chon={k?.icon_ma ?? null} canh={canh}
        onChon={(ma) => { p.onThanh(null); p.onTha(t, ma === k?.icon_ma ? null : ma) }} onThem={() => { p.onThanh(null); p.onThemCamXuc(t) }} />}
    </div>
  )
}
function NutBinhLuan({ t, p, nho }: { t: TinTG; p: TuongTacProps; nho?: boolean }) {
  return (
    <button onClick={() => p.onMoBl(t, 'bl')} className={`flex items-center justify-center gap-1.5 rounded-lg font-bold active:scale-95 ${nho ? 'h-8 flex-none px-2 text-[12.5px] whitespace-nowrap' : 'h-9 w-full text-[13.5px]'}`}
      style={{ color: MAU.muted }}>
      <span aria-hidden style={{ fontSize: nho ? 14 : 16 }}>💬</span>{nho ? (t.khen.so_bl > 0 ? t.khen.so_bl : '') : 'Bình luận'}
    </button>
  )
}
// Thanh hành động cuối thẻ: [👍 Thích] [💬 Bình luận] — tin của chính em thì chỉ Bình luận (không tự thả cho mình)
function ThanhHanhDong({ t, p }: { t: TinTG; p: TuongTacProps }) {
  return (
    <div className={`grid gap-1 pt-1 ${t.cua_toi ? 'grid-cols-1' : 'grid-cols-2'}`} style={{ borderTop: `1px solid ${MAU.line}` }}>
      {!t.cua_toi && <NutThich t={t} p={p} />}
      <NutBinhLuan t={t} p={p} />
    </div>
  )
}

// 1 bình luận: bong bóng xám (tên [lớp] + câu) · sticker thì hiện to, không bong bóng — như FB
function BongBL({ b, nho, duoi }: { b: BinhLuanTG; nho?: boolean; duoi?: ReactNode }) {
  return (
    <div className="flex items-start gap-2" style={{ opacity: b.an ? 0.5 : 1 }}>
      <Avatar n={b.nguoi} size={nho ? 28 : 34} />
      <div className="min-w-0 flex-1">
        {b.loai === 'cau'
          ? <div className="inline-block max-w-full rounded-[18px] px-3 py-1.5" style={{ background: MAU.surface2 }}>
              <p className="text-[12.5px] font-bold leading-tight">{b.la_em ? 'Em' : <TenLop n={b.nguoi} rutGon />}</p>
              <p className="text-[13.5px] leading-snug">{b.noi_dung}</p>
            </div>
          : <div>
              <p className="px-1 text-[12.5px] font-bold leading-tight">{b.la_em ? 'Em' : <TenLop n={b.nguoi} rutGon />}</p>
              <span className="mt-0.5 inline-block"><Hinh src={anhSticker(b.ma)} emoji={b.noi_dung} size={nho ? 52 : 72} /></span>
            </div>}
        {duoi && <div className="mt-0.5 flex gap-3 px-3 text-[11.5px] font-semibold" style={{ color: MAU.muted }}>{duoi}</div>}
      </div>
    </div>
  )
}
// Dưới thẻ: "Xem tất cả N bình luận" + 1 bình luận xem trước
function BlXemTruoc({ t, p }: { t: TinTG; p: TuongTacProps }) {
  const b = t.khen.bl
  if (!b) return null
  return (
    <button onClick={() => p.onMoBl(t, 'bl')} className="flex flex-col gap-1.5 text-left">
      {t.khen.so_bl > 1 && <span className="text-[12.5px] font-semibold" style={{ color: MAU.muted }}>Xem tất cả {t.khen.so_bl} bình luận</span>}
      <BongBL b={b} nho duoi={<span>{luc(b.at)}</span>} />
    </button>
  )
}

// ── Thẻ tin ─────────────────────────────────────────────────────────────────
function TheTin({ t, p, onAnTin, menuMo, onMenu, anNhanBan }: {
  t: TinTG; p: TuongTacProps; onAnTin?: (t: TinTG, an: boolean) => void; menuMo?: boolean; onMenu?: (khoa: string | null) => void
  anNhanBan?: boolean // tab Bạn bè: tin nào cũng của bạn ⇒ không cần nhãn
}) {
  const ten = t.nguoi ? <TenLop n={t.nguoi} /> : <span>Đội {String(t.chi_tiet.doi ?? '')}{t.lop && <span style={NHAN_LOP}>{t.lop}</span>}</span>
  const nhanBan = t.la_ban && !t.cua_toi && !anNhanBan ? <span className="ml-1.5 rounded-full px-1.5 text-[10.5px] font-bold" style={{ border: `1px solid ${MAU.line}`, color: MAU.muted }}>bạn</span> : null
  const menu = t.cua_toi && onAnTin && onMenu && (
    <div className="relative">
      <button onClick={() => onMenu(menuMo ? null : t.khoa)} aria-label="Tuỳ chọn tin của em" className="px-1.5 text-[20px] leading-none" style={{ color: MAU.muted }}>⋯</button>
      {menuMo && (
        <div className="absolute right-0 top-7 z-10 min-w-[170px] overflow-hidden rounded-xl shadow-xl" style={{ background: MAU.bg, border: `1px solid ${MAU.line}` }}>
          <button className="block w-full px-4 py-2.5 text-left text-[13px] font-semibold" onClick={() => { onMenu(null); onAnTin(t, !t.da_an) }}>{t.da_an ? 'Hiện lại tin này' : 'Ẩn tin này'}</button>
        </div>
      )}
    </div>
  )

  if (t.tang === 'B') {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2 text-[13px]" style={{ ...THE, opacity: t.da_an ? 0.55 : 1 }}>
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg" style={{ background: MAU.surface2 }}><Hinh src={anhTin(t.kieu)} emoji={ICON_TIN[t.kieu] ?? '✨'} size={22} /></span>
        <span className="min-w-0 flex-1"><b>{t.nguoi ? <TenLop n={t.nguoi} rutGon /> : null}</b>{nhanBan} {moTaTin(t)}
          <span className="flex items-center gap-1.5 text-[11.5px]" style={{ color: MAU.muted }}>{luc(t.at)}
            {t.khen.tong > 0 && <button onClick={() => p.onMoBl(t, 'tha')} className="inline-flex items-center gap-1">· <IconChong k={t.khen} size={13} /> {t.khen.tong}</button>}
            {t.da_an ? ' · em đã ẩn' : ''}</span></span>
        {menu}
        {!t.cua_toi && <NutThich t={t} p={p} nho canh="phai" />}
        <NutBinhLuan t={t} p={p} nho />
      </div>
    )
  }
  const laS = t.tang === 'S'
  return (
    <article className="relative flex flex-col gap-2.5 p-3 pb-1.5" style={{ ...THE, ...(laS ? { border: `2px solid ${MAU.acc}`, paddingTop: 28 } : {}), opacity: t.da_an ? 0.55 : 1 }}>
      {laS && (anhTG('ruy_bang_s')
        ? <img src={anhTG('ruy_bang_s') as string} alt="" className="pointer-events-none absolute left-1/2 top-0 h-6 -translate-x-1/2" />
        : <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-lg px-4 py-0.5 text-[11.5px] font-bold tracking-[0.06em]" style={{ ...HEAD, background: MAU.acc, color: MAU.accInk }}>CỰC PHẨM</span>)}
      {laS && anhPhaoGiay() && <img src={anhPhaoGiay() as string} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80" />}
      <div className="flex items-center gap-2.5">
        <Avatar n={t.nguoi} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[14px] font-bold">{ten}{nhanBan}</p>
          <p className="text-[11.5px]" style={{ color: MAU.muted }}>{luc(t.at)}{t.ghim ? ' · ghim 24h' : ''}{t.da_an ? ' · em đã ẩn' : ''}</p>
        </div>
        <DauTang tang={t.tang} />
        {menu}
      </div>
      {laS
        ? <div className="flex flex-col items-center gap-1 py-1 text-center"><Hinh src={anhTin(t.kieu)} emoji={ICON_TIN[t.kieu] ?? '✨'} size={64} /><p className="text-[15px] leading-snug">{moTaTin(t)}</p></div>
        : <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg" style={{ background: MAU.surface2 }}><Hinh src={anhTin(t.kieu)} emoji={ICON_TIN[t.kieu] ?? '✨'} size={26} /></span><p className="text-[14.5px] leading-snug">{moTaTin(t)}</p></div>}
      {t.doi?.thanh_vien && t.doi.thanh_vien.length > 0 && (
        <p className="text-[12px]" style={{ color: MAU.muted }}>{t.doi.thanh_vien.map((m, i) => <span key={i}>{i > 0 && ' · '}<TenLop n={m} rutGon /></span>)}{t.doi.so > t.doi.thanh_vien.length ? ` · +${t.doi.so - t.doi.thanh_vien.length}` : ''}</p>
      )}
      <DongTuongTac k={t.khen} onMoTha={() => p.onMoBl(t, 'tha')} onMoBl={() => p.onMoBl(t, 'bl')} />
      <ThanhHanhDong t={t} p={p} />
      <BlXemTruoc t={t} p={p} />
    </article>
  )
}

function TheGop({ g, mo, onMo, p }: { g: GopTG; mo: boolean; onMo: () => void; p: TuongTacProps }) {
  return (
    <article className="flex flex-col gap-2 p-3" style={THE}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg" style={{ background: MAU.surface2 }}><Hinh src={anhTin(g.kieu)} emoji={ICON_TIN[g.kieu] ?? '✨'} size={26} /></span>
        <p className="min-w-0 flex-1 text-[14.5px] leading-snug">{(TIEU_DE_GOP[g.kieu] ?? ((so: number) => <>{so} tin</>))(g.so)}</p>
        <DauTang tang="A" />
      </div>
      {mo
        ? <div className="flex flex-col">{g.ds.map((t) => (
            <div key={t.khoa} className="flex items-center gap-2 py-2" style={{ borderTop: `1px solid ${MAU.line}` }}>
              <Avatar n={t.nguoi} size={32} />
              <span className="min-w-0 flex-1 text-[13px] leading-tight"><b>{t.nguoi ? <TenLop n={t.nguoi} /> : <>Đội {String(t.chi_tiet.doi ?? '')}{t.lop && <span style={NHAN_LOP}>{t.lop}</span>}</>}</b>
                {t.la_ban && !t.cua_toi && <span className="ml-1.5 text-[10.5px]" style={{ color: MAU.muted }}>bạn</span>}
                <span className="block text-[11.5px]" style={{ color: MAU.muted }}>{moTaTin(t)}
                  {t.khen.tong > 0 && <button onClick={() => p.onMoBl(t, 'tha')} className="ml-1 inline-flex items-center gap-1 align-middle">· <IconChong k={t.khen} size={12} /> {t.khen.tong}</button>}</span></span>
              {!t.cua_toi && <NutThich t={t} p={p} nho canh="phai" />}
              <NutBinhLuan t={t} p={p} nho />
            </div>))}
            {g.so > g.ds.length && <p className="text-[12px]" style={{ color: MAU.muted }}>+{g.so - g.ds.length} bạn khác</p>}
          </div>
        : <p className="text-[12.5px]" style={{ color: MAU.muted }}>{g.ds.slice(0, 3).map((t, i) => <span key={t.khoa}>{i > 0 && ' · '}{t.nguoi ? <TenLop n={t.nguoi} rutGon /> : <>Đội {String(t.chi_tiet.doi ?? '')}{t.lop && <span style={NHAN_LOP}>{t.lop}</span>}</>}</span>)}{g.so > 3 ? ` · +${g.so - 3}` : ''}</p>}
      <div className="flex justify-end">
        <button onClick={onMo} className="h-9 rounded-lg px-3.5 text-[13px] font-extrabold" style={{ color: MAU.acc, border: `1.5px solid ${MAU.acc}` }}>{mo ? 'Thu gọn' : 'Xem tất cả · thả tim'}</button>
      </div>
    </article>
  )
}

// ── VIEW chính ──────────────────────────────────────────────────────────────
export type TheGioiViewProps = TuongTacProps & {
  tab: KenhId; onTab: (t: KenhId) => void
  kenh: KenhTG | null; loi: string | null
  banBe: BanBeTG | null
  hien: 'ten' | 'ma'; onHien: (h: 'ten' | 'ma') => void
  moGop: Record<string, boolean>; onMoGop: (kieu: string) => void
  menuKhoa: string | null; onMenu: (khoa: string | null) => void
  onAnTin: (t: TinTG, an: boolean) => void
  onDongY: (id: string) => void; onDeSau: (id: string) => void; onMoKetBan: () => void
  onBack: () => void
  bao?: string | null // thông báo ngắn (lỗi thả/bình luận)
  children?: ReactNode // tấm trượt (bình luận / cảm xúc / kết bạn) đè lên
}
const TABS: { id: KenhId; ten: string; icon: keyof typeof ICON_TG }[] = [
  { id: 'tg', ten: 'Thế giới', icon: 'tab_the_gioi' }, { id: 'ban', ten: 'Bạn bè', icon: 'tab_ban_be' }, { id: 'lop', ten: 'Lớp', icon: 'tab_lop' },
]
export function TheGioiView(p: TheGioiViewProps) {
  const k = p.kenh
  const tinS = k?.tin.filter((t) => t.tang !== 'B') ?? []
  const tinB = k?.tin.filter((t) => t.tang === 'B') ?? []
  const theTin = (t: TinTG) => <TheTin key={t.khoa} t={t} p={p} onAnTin={p.onAnTin} menuMo={p.menuKhoa === t.khoa} onMenu={p.onMenu} anNhanBan={p.tab === 'ban'} />
  return (
    <ManHS rong="hep"> {/* cột tin ~720px giữa màn như bảng tin FB trên máy tính — trải hết 1440px thì mỏi mắt */}
      <style>{KEYFRAMES}</style>
      {p.thanhKhoa && <div className="fixed inset-0 z-20" onClick={() => p.onThanh(null)} onContextMenu={(e) => e.preventDefault()} />}
      <DauTrangHS tieuDe="Thế giới BK" onBack={p.onBack} phai={
        <div className="flex flex-none overflow-hidden rounded-full text-[11px] font-bold" style={{ border: `1px solid ${MAU.line}` }} role="group" aria-label="Em hiện bằng">
          {(['ten', 'ma'] as const).map((h) => <button key={h} onClick={() => p.onHien(h)} aria-pressed={p.hien === h} className="px-2.5 py-1.5"
            style={p.hien === h ? { background: MAU.acc, color: MAU.accInk } : { color: MAU.muted }}>{h === 'ten' ? 'Tên' : 'Mã HS'}</button>)}
        </div>} />
      <div className="grid grid-cols-3 gap-1 rounded-full p-1" style={THE_TRON} role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={p.tab === t.id} onClick={() => p.onTab(t.id)} className="flex items-center justify-center gap-1.5 rounded-full py-2 text-[13px] font-bold"
            style={p.tab === t.id ? { background: MAU.acc, color: MAU.accInk } : { color: MAU.muted }}>
            <Hinh src={anhTG(t.icon)} emoji={ICON_TG[t.icon]} size={16} />{t.ten}
            {t.id === 'ban' && (k?.toi.loi_moi ?? 0) > 0 && <span className="rounded-full px-1.5 text-[10.5px]" style={{ background: MAU.badge, color: MAU.badgeInk }}>{k?.toi.loi_moi}</span>}
          </button>
        ))}
      </div>

      {p.loi && <TrongHS>{p.loi}</TrongHS>}
      {!k && !p.loi && <TrongHS>Đang tải…</TrongHS>}

      {k && p.tab === 'tg' && <>
        {tinS.map(theTin)}
        {k.gop.length > 0 && <NhomHS>Hôm nay ở BK</NhomHS>}
        {k.gop.map((g) => <TheGop key={g.kieu} g={g} mo={!!p.moGop[g.kieu]} onMo={() => p.onMoGop(g.kieu)} p={p} />)}
        {tinS.length === 0 && k.gop.length === 0 && <TrongHS>Hôm nay chưa có tin nổi bật. Làm bài, giành Nhất buổi để lên Thế giới BK nhé!</TrongHS>}
      </>}

      {k && p.tab === 'ban' && <>
        <div className="flex items-center gap-3 px-3 py-2.5" style={THE}>
          <span className="min-w-0 flex-1 leading-tight"><b className="text-[15px]" style={HEAD}>Bạn bè của em</b>
            <span className="block text-[12px]" style={{ color: MAU.muted }}>{p.banBe?.ban.length ?? k.toi.so_ban} bạn · bạn đồng ý mới thành bạn bè</span></span>
          <button onClick={p.onMoKetBan} className="flex h-9 flex-none items-center gap-1 rounded-lg px-3 text-[13px] font-extrabold" style={{ background: MAU.acc, color: MAU.accInk }}>
            <Hinh src={anhTG('ket_ban')} emoji={ICON_TG.ket_ban} size={14} /> Kết bạn</button>
        </div>
        {p.banBe && p.banBe.loi_moi.length > 0 && <>
          <NhomHS>Lời mời kết bạn ({p.banBe.loi_moi.length})</NhomHS>
          {p.banBe.loi_moi.map((m) => (
            <div key={m.id} className="flex items-center gap-2.5 px-3 py-2.5" style={THE}>
              <Avatar n={m.nguoi} size={36} />
              <span className="min-w-0 flex-1 text-[13.5px] leading-tight"><b><TenLop n={m.nguoi} /></b><span className="block text-[11.5px]" style={{ color: MAU.muted }}>{m.ban_chung > 0 ? `${m.ban_chung} bạn chung` : 'Học sinh BK'}</span></span>
              <button onClick={() => p.onDongY(m.id)} className="h-8 rounded-lg px-3 text-[12.5px] font-extrabold" style={{ background: MAU.acc, color: MAU.accInk }}>Đồng ý</button>
              <button onClick={() => p.onDeSau(m.id)} className="h-8 rounded-lg px-2.5 text-[12.5px] font-bold" style={{ color: MAU.muted, border: `1px solid ${MAU.line}` }}>Để sau</button>
            </div>))}
        </>}
        {tinS.length > 0 && <NhomHS>Bạn bè khoe</NhomHS>}
        {tinS.map(theTin)}
        {tinB.length > 0 && <NhomHS>Bạn bè đang cố gắng</NhomHS>}
        {tinB.map(theTin)}
        {(p.banBe?.ban.length ?? k.toi.so_ban) === 0 && <TrongHS>Em chưa có bạn trên Thế giới BK. Bấm "Kết bạn" để tìm bạn cùng lớp nhé.</TrongHS>}
        {(p.banBe?.ban.length ?? k.toi.so_ban) > 0 && k.tin.length === 0 && <TrongHS>7 ngày qua bạn bè của em chưa có tin mới.</TrongHS>}
      </>}

      {k && p.tab === 'lop' && <>
        {tinS.map(theTin)}
        {tinB.length > 0 && <NhomHS>Nỗ lực trong lớp</NhomHS>}
        {tinB.map(theTin)}
        {k.tin.length === 0 && <TrongHS>7 ngày qua lớp em chưa có tin mới.</TrongHS>}
      </>}
      {p.bao && <div className="fixed inset-x-4 bottom-6 z-[60] mx-auto max-w-[520px] rounded-xl px-4 py-3 text-center text-[13.5px] font-semibold shadow-2xl"
        style={{ background: MAU.bg, color: MAU.ink, border: `1px solid ${MAU.line}` }} role="status">{p.bao}</div>}
      {p.children}
    </ManHS>
  )
}

// ── Tấm trượt dùng chung ────────────────────────────────────────────────────
function TamTruot({ tieuDe, phu, onDong, onLui, children, chan }: { tieuDe: string; phu?: ReactNode; onDong: () => void; onLui?: () => void; children: ReactNode; chan?: ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(3,5,14,0.6)' }} onClick={onDong} />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[86dvh] max-w-[560px] flex-col rounded-t-[22px] shadow-2xl"
        style={{ background: MAU.bg, color: MAU.ink, fontFamily: 'var(--sk-font)', borderTop: `1px solid ${MAU.line}` }} role="dialog" aria-label={tieuDe}>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full" style={{ background: MAU.line }} />
        <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-2">
          {onLui && <button onClick={onLui} className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[18px]" style={{ background: MAU.surface2 }} aria-label="Quay lại">‹</button>}
          <div className="min-w-0 flex-1"><p className="text-[15px] font-bold" style={HEAD}>{tieuDe}</p>{phu && <div className="text-[13px]" style={{ color: MAU.muted }}>{phu}</div>}</div>
          <button onClick={onDong} className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[16px]" style={{ background: MAU.surface2 }} aria-label="Đóng">✕</button>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-3">{children}</div>
        {chan && <div className="flex flex-col gap-2 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-2" style={{ borderTop: `1px solid ${MAU.line}` }}>{chan}</div>}
      </div>
    </>
  )
}

// Câu hợp loại tin: câu riêng loại trước, rồi câu dùng chung — tối đa 10 (spec §5). Chủ tin: chỉ câu cảm ơn.
export function cauHop(ds: DanhMucTG[], nhom: string, chuTin = false): DanhMucTG[] {
  const cau = ds.filter((d) => d.loai === 'cau')
  if (chuTin) return cau.filter((d) => d.nhom.includes('cam_on'))
  return [...cau.filter((d) => d.nhom.includes(nhom)), ...cau.filter((d) => d.nhom.includes('chung') && !d.nhom.includes(nhom))].slice(0, 10)
}

export type BanPhim = 'dong' | 'cau' | 'sticker'
// Tấm BÌNH LUẬN kiểu FB: đầu = dòng cảm xúc (bấm ⇒ ai đã thả) · giữa = bình luận · đáy = ô "Viết bình luận…" + 🙂 sticker.
// Không gõ chữ: chạm ô ⇒ bật "bàn phím" câu soạn sẵn / sticker, CHẠM LÀ GỬI (như bấm sticker trên Messenger).
export function TamBinhLuan({ tin, ct, xem, onXem, loc, onLoc, banPhim, onBanPhim, danhMuc, onGui, dangGui, loi, onGo, onAn, onDong }: {
  tin: TinTG; ct: ChiTietTG | null; xem: 'bl' | 'tha'; onXem: (x: 'bl' | 'tha') => void; loc: string | null; onLoc: (ma: string | null) => void
  banPhim: BanPhim; onBanPhim: (b: BanPhim) => void; danhMuc: DanhMucTG[]; onGui: (ma: string) => void; dangGui: boolean; loi: string | null
  onGo: (b: BinhLuanTG) => void; onAn: (b: BinhLuanTG, an: boolean) => void; onDong: () => void
}) {
  const k = ct?.khen ?? tin.khen
  const chuTin = ct?.chu_tin ?? tin.cua_toi
  if (xem === 'tha') {
    const ds = (ct?.tha ?? []).filter((x) => !loc || x.icon_ma === loc)
    const chip = (dang: boolean): CSSProperties => ({ color: dang ? MAU.acc : MAU.muted, borderBottom: `2.5px solid ${dang ? MAU.acc : 'transparent'}` })
    return (
      <TamTruot tieuDe="Người đã bày tỏ cảm xúc" onDong={onDong} onLui={() => onXem('bl')}>
        <div className="-mx-4 flex gap-1 overflow-x-auto px-4" style={{ borderBottom: `1px solid ${MAU.line}` }}>
          <button onClick={() => onLoc(null)} className="flex-none px-2.5 py-2 text-[13.5px] font-bold" style={chip(!loc)}>Tất cả {k.tong}</button>
          {k.dem.map((d) => <button key={d.ma} onClick={() => onLoc(d.ma)} className="flex flex-none items-center gap-1 px-2.5 py-2 text-[13.5px] font-bold" style={chip(loc === d.ma)}>
            <Hinh src={anhTuongTac(d.ma)} emoji={d.icon} size={17} /> {d.so}</button>)}
        </div>
        {!ct && <p className="text-[13px]" style={{ color: MAU.muted }}>Đang tải…</p>}
        {ds.map((x, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="relative"><Avatar n={x.nguoi} size={40} />
              <span className="absolute -bottom-1 -right-1 flex h-[22px] w-[22px] items-center justify-center rounded-full" style={{ background: MAU.bg }}><Hinh src={anhTuongTac(x.icon_ma)} emoji={x.icon} size={16} /></span></span>
            <span className="min-w-0 flex-1 text-[14px] font-bold leading-tight">{x.la_em ? 'Em' : <TenLop n={x.nguoi} />}
              {x.la_ban && !x.la_em && <span className="block text-[11.5px] font-normal" style={{ color: MAU.muted }}>Bạn bè</span>}</span>
          </div>))}
      </TamTruot>
    )
  }
  const caus = cauHop(danhMuc, tin.nhom, chuTin)
  const stickers = danhMuc.filter((d) => d.loai === 'sticker')
  const tabPhim = (b: BanPhim, nhan: string) => <button onClick={() => onBanPhim(b)} className="flex-1 rounded-full py-1.5 text-[13px] font-bold"
    style={banPhim === b ? { background: MAU.acc, color: MAU.accInk } : { color: MAU.muted }}>{nhan}</button>
  return (
    <TamTruot tieuDe="Bình luận" onDong={onDong}
      phu={k.tong > 0 ? <button onClick={() => onXem('tha')} className="flex items-center gap-1.5 pt-0.5"><IconChong k={k} /> <TenNguoiTha k={k} /> ›</button> : <>{tin.nguoi ? <TenLop n={tin.nguoi} rutGon /> : null} {moTaTin(tin)}</>}
      chan={<>
        {loi && <p className="text-[13px] font-semibold" style={{ color: MAU.sai }}>{loi}</p>}
        <div className="flex items-center gap-2">
          <button onClick={() => onBanPhim(banPhim === 'cau' ? 'dong' : 'cau')} className="h-10 min-w-0 flex-1 truncate rounded-full px-4 text-left text-[14px]"
            style={{ background: MAU.surface2, color: MAU.muted, border: `1px solid ${banPhim !== 'dong' ? MAU.acc : 'transparent'}` }}>
            {dangGui ? 'Đang gửi…' : chuTin ? 'Trả lời mọi người…' : 'Viết bình luận…'}</button>
          <button onClick={() => onBanPhim(banPhim === 'sticker' ? 'dong' : 'sticker')} aria-label="Sticker" className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-[21px]"
            style={{ background: banPhim === 'sticker' ? MAU.surface2 : 'transparent' }}>🙂</button>
        </div>
        {banPhim !== 'dong' && <>
          <div className="flex gap-1 rounded-full p-1" style={THE_TRON}>{tabPhim('cau', 'Câu')}{tabPhim('sticker', 'Sticker')}</div>
          <div className="max-h-[34dvh] overflow-y-auto">
            {banPhim === 'cau'
              ? <div className="flex flex-wrap gap-1.5">{caus.map((d) => <button key={d.ma} disabled={dangGui} onClick={() => onGui(d.ma)}
                  className="rounded-full px-3 py-1.5 text-left text-[13.5px] font-semibold active:scale-95 disabled:opacity-50" style={{ background: MAU.surface2, border: `1px solid ${MAU.line}` }}>{d.noi_dung}</button>)}</div>
              : <div className="grid grid-cols-4 gap-1.5">{stickers.map((d) => <button key={d.ma} disabled={dangGui} onClick={() => onGui(d.ma)} aria-label={d.ma}
                  className="flex aspect-square items-center justify-center rounded-xl active:scale-90 disabled:opacity-50"><Hinh src={anhSticker(d.ma)} emoji={d.noi_dung} size={52} /></button>)}</div>}
          </div>
          <p className="text-center text-[11.5px]" style={{ color: MAU.muted }}>Chạm là gửi luôn</p>
        </>}
      </>}>
      {!ct && <p className="text-[13px]" style={{ color: MAU.muted }}>Đang tải bình luận…</p>}
      {ct && ct.bl.length === 0 && <p className="py-6 text-center text-[13.5px]" style={{ color: MAU.muted }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>}
      {ct?.bl.map((b) => (
        <BongBL key={b.id} b={b} duoi={<>
          <span>{luc(b.at)}</span>
          {b.an && <span>Đã ẩn</span>}
          {b.la_em && <button onClick={() => onGo(b)}>Gỡ</button>}
          {chuTin && !b.la_em && <button onClick={() => onAn(b, !b.an)}>{b.an ? 'Hiện lại' : 'Ẩn'}</button>}
        </>} />))}
    </TamTruot>
  )
}

// Bấm ＋ trên dải cảm xúc ⇒ tấm chọn đủ mọi cảm xúc (kèm tên)
export function TamCamXuc({ tin, danhMuc, onChon, onDong }: { tin: TinTG; danhMuc: DanhMucTG[]; onChon: (ma: string | null) => void; onDong: () => void }) {
  const chon = tin.khen.cua_toi?.icon_ma ?? null
  return (
    <TamTruot tieuDe="Chọn cảm xúc" phu={<>{tin.nguoi ? <TenLop n={tin.nguoi} rutGon /> : null} {moTaTin(tin)}</>} onDong={onDong}>
      <div className="grid grid-cols-4 gap-1.5">
        {danhMuc.filter((d) => d.loai === 'icon').map((d) => (
          <button key={d.ma} onClick={() => onChon(chon === d.ma ? null : d.ma)} aria-pressed={chon === d.ma} className="flex flex-col items-center gap-1 rounded-xl py-2 active:scale-95"
            style={{ border: `1.5px solid ${chon === d.ma ? MAU.acc : 'transparent'}`, background: chon === d.ma ? MAU.surface2 : 'transparent' }}>
            <Hinh src={anhTuongTac(d.ma)} emoji={d.noi_dung} size={34} /><span className="text-[11.5px] font-semibold" style={{ color: MAU.muted }}>{d.nhan}</span>
          </button>))}
      </div>
    </TamTruot>
  )
}

export function TamKetBan({ tim, onTim, ds, onGui, onDong }: { tim: string; onTim: (s: string) => void; ds: GoiYTG[] | null; onGui: (id: string) => void; onDong: () => void }) {
  return (
    <TamTruot tieuDe="Kết bạn" phu="Chỉ học sinh BK · bạn đồng ý mới thành bạn bè" onDong={onDong}>
      <input id="tg-tim-ban" value={tim} onChange={(e) => onTim(e.target.value)} placeholder="Tìm tên, mã HS hoặc lớp" autoComplete="off"
        className="w-full rounded-xl px-3 py-2.5 text-[14px] outline-none" style={{ ...THE_TRON, background: MAU.surface }} />
      <NhomHS>{tim.trim() ? 'Kết quả' : 'Gợi ý cho em'}</NhomHS>
      {ds === null && <p className="text-[13px]" style={{ color: MAU.muted }}>Đang tìm…</p>}
      {ds && ds.length === 0 && <p className="text-[13px]" style={{ color: MAU.muted }}>Không thấy bạn nào. Thử gõ tên, mã HS (vd HS0233) hoặc lớp (vd 9A1).</p>}
      {ds?.map((g) => (
        <div key={g.id} className="flex items-center gap-2.5 px-3 py-2.5" style={THE}>
          <Avatar n={g.nguoi} size={36} />
          <span className="min-w-0 flex-1 text-[13.5px] leading-tight"><b><TenLop n={g.nguoi} /></b><span className="block text-[11.5px]" style={{ color: MAU.muted }}>{g.ly_do ?? 'Học sinh BK'}</span></span>
          {g.trang_thai === 'da_gui'
            ? <span className="h-8 rounded-lg px-3 text-[12.5px] font-bold leading-8" style={{ color: MAU.acc, border: `1px solid ${MAU.acc}` }}>Đã gửi</span>
            : <button onClick={() => onGui(g.id)} className="h-8 rounded-lg px-3 text-[12.5px] font-extrabold" style={{ background: MAU.acc, color: MAU.accInk }}>{g.trang_thai === 'cho_em' ? 'Đồng ý' : 'Kết bạn'}</button>}
        </div>))}
    </TamTruot>
  )
}

// ── CONTAINER ───────────────────────────────────────────────────────────────
// Nhớ dữ liệu từng tab tới F5 ⇒ rời màn quay lại không trắng, tải nền rồi thay (CLAUDE §2).
const NHO: { tab: KenhId; kenh: Partial<Record<KenhId, KenhTG>>; banBe: BanBeTG | null; danhMuc: DanhMucTG[] | null } = { tab: 'tg', kenh: {}, banBe: null, danhMuc: null }
const loiText = (e: unknown) => (e as { message?: string })?.message ?? String(e)
type TamBL = { tin: TinTG; ct: ChiTietTG | null; xem: 'bl' | 'tha'; loc: string | null; banPhim: BanPhim; dangGui: boolean; loi: string | null }

export default function TheGioiHS({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<KenhId>(NHO.tab)
  const [kenh, setKenh] = useState<Partial<Record<KenhId, KenhTG>>>(NHO.kenh)
  const [banBe, setBanBe] = useState<BanBeTG | null>(NHO.banBe)
  const [danhMuc, setDanhMuc] = useState<DanhMucTG[]>(NHO.danhMuc ?? [])
  const [loi, setLoi] = useState<string | null>(null)
  const [moGop, setMoGop] = useState<Record<string, boolean>>({})
  const [menuKhoa, setMenuKhoa] = useState<string | null>(null)
  const [thanhKhoa, setThanhKhoa] = useState<string | null>(null)
  const [tamBL, setTamBL] = useState<TamBL | null>(null)
  const [tamCX, setTamCX] = useState<TinTG | null>(null)
  const [tamKetBan, setTamKetBan] = useState<{ tim: string; ds: GoiYTG[] | null } | null>(null)
  const [bao, setBao] = useState<string | null>(null)
  const timRef = useRef(0), baoRef = useRef(0)

  useEffect(() => { NHO.tab = tab; NHO.kenh = kenh; NHO.banBe = banBe }, [tab, kenh, banBe])
  const taiKenh = (k: KenhId) => layKenh(k).then((d) => { setKenh((x) => ({ ...x, [k]: d })); setLoi(null) }).catch((e) => setLoi(`Chưa tải được Thế giới BK — ${loiText(e)}`))
  const taiBan = () => banBeCuaToi().then(setBanBe).catch(() => {})
  useEffect(() => { taiKenh(tab); if (tab === 'ban') taiBan() }, [tab])
  useEffect(() => { if (!NHO.danhMuc) layDanhMuc().then((d) => { NHO.danhMuc = d; setDanhMuc(d) }).catch(() => {}) }, [])
  const baoLoi = (s: string) => { setBao(s); window.clearTimeout(baoRef.current); baoRef.current = window.setTimeout(() => setBao(null), 2800) }

  // Vá tương tác của 1 tin ở MỌI tab + thẻ gộp + tấm đang mở (cùng khoá tự nhiên).
  const vaKhen = (khoa: string, khen: KhenTG) => {
    setKenh((x) => {
      const va = (t: TinTG) => (t.khoa === khoa ? { ...t, khen } : t)
      const moi: Partial<Record<KenhId, KenhTG>> = {}
      for (const [k, v] of Object.entries(x) as [KenhId, KenhTG][]) moi[k] = { ...v, tin: v.tin.map(va), gop: v.gop.map((g) => ({ ...g, ds: g.ds.map(va) })) }
      return moi
    })
    setTamBL((b) => (b && b.tin.khoa === khoa ? { ...b, tin: { ...b.tin, khen }, ct: b.ct && { ...b.ct, khen } } : b))
  }
  const vaAn = (khoa: string, an: boolean) => setKenh((x) => {
    const moi: Partial<Record<KenhId, KenhTG>> = {}
    for (const [k, v] of Object.entries(x) as [KenhId, KenhTG][]) moi[k] = { ...v, tin: v.tin.map((t) => (t.khoa === khoa ? { ...t, da_an: an } : t)) }
    return moi
  })

  // Thả / đổi / bỏ cảm xúc: nút đổi màu NGAY (chỉ phần "của em"), số đếm lấy từ DB trả về.
  const tha = async (t: TinTG, icon: string | null) => {
    const d = icon ? danhMuc.find((x) => x.ma === icon) : null
    vaKhen(t.khoa, { ...t.khen, cua_toi: d ? { icon: d.noi_dung, icon_ma: d.ma, nhan: d.nhan ?? '' } : null })
    try { vaKhen(t.khoa, await thaCamXuc(t.khoa, icon)) }
    catch (e) { vaKhen(t.khoa, t.khen); baoLoi(`Chưa thả được — ${loiText(e)}`) }
  }
  const moBL = (t: TinTG, xem: 'bl' | 'tha') => {
    setTamBL({ tin: t, ct: null, xem, loc: null, banPhim: 'dong', dangGui: false, loi: null })
    layChiTiet(t.khoa).then((ct) => setTamBL((b) => b && b.tin.khoa === t.khoa ? { ...b, ct } : b))
      .catch((e) => setTamBL((b) => b && { ...b, loi: `Chưa tải được — ${loiText(e)}` }))
  }
  const guiBL = async (ma: string) => {
    if (!tamBL || tamBL.dangGui) return
    const khoa = tamBL.tin.khoa
    setTamBL({ ...tamBL, dangGui: true, loi: null })
    try {
      const r = await guiBinhLuan(khoa, ma)
      setTamBL((b) => b && { ...b, dangGui: false, banPhim: b.banPhim === 'sticker' ? 'sticker' : 'dong', ct: b.ct && { ...b.ct, bl: [...b.ct.bl, r.bl] } })
      vaKhen(khoa, r.khen)
    } catch (e) { setTamBL((b) => b && { ...b, dangGui: false, loi: `Chưa gửi được — ${loiText(e)}` }) }
  }
  const goBL = async (bl: BinhLuanTG) => {
    if (!tamBL) return
    const khoa = tamBL.tin.khoa
    setTamBL((b) => b && { ...b, ct: b.ct && { ...b.ct, bl: b.ct.bl.filter((x) => x.id !== bl.id) } })
    try { vaKhen(khoa, await goBinhLuan(bl.id)) } catch (e) { baoLoi(`Chưa gỡ được — ${loiText(e)}`); moBL(tamBL.tin, 'bl') }
  }
  const anBL = async (bl: BinhLuanTG, an: boolean) => {
    if (!tamBL) return
    const khoa = tamBL.tin.khoa
    setTamBL((b) => b && { ...b, ct: b.ct && { ...b.ct, bl: b.ct.bl.map((x) => (x.id === bl.id ? { ...x, an } : x)) } })
    try { vaKhen(khoa, await anBinhLuan(bl.id, an)) } catch (e) { baoLoi(`Chưa ẩn được — ${loiText(e)}`); moBL(tamBL.tin, 'bl') }
  }
  const timBan = (tim: string) => {
    setTamKetBan({ tim, ds: null })
    const lan = ++timRef.current
    window.setTimeout(() => {
      if (lan !== timRef.current) return
      goiYKetBan(tim).then((ds) => { if (lan === timRef.current) setTamKetBan((x) => x && { ...x, ds }) }).catch(() => setTamKetBan((x) => x && { ...x, ds: [] }))
    }, tim.trim() ? 300 : 0)
  }
  const traLoi = async (id: string, dongY: boolean) => {
    setBanBe((b) => b && { ...b, loi_moi: b.loi_moi.filter((m) => m.id !== id) })
    try { await traLoiKetBan(id, dongY); if (dongY) { taiBan(); taiKenh('ban') } } catch { taiBan() }
  }
  const hien = kenh[tab]?.toi.hien ?? 'ten'

  return (
    <TheGioiView tab={tab} onTab={(t) => { setMenuKhoa(null); setThanhKhoa(null); setTab(t) }} kenh={kenh[tab] ?? null} loi={kenh[tab] ? null : loi} banBe={banBe}
      hien={hien} onHien={(h) => { datHien(h).then(() => taiKenh(tab)).catch(() => {}) ; setKenh((x) => ({ ...x, [tab]: x[tab] && { ...x[tab]!, toi: { ...x[tab]!.toi, hien: h } } })) }}
      moGop={moGop} onMoGop={(kieu) => setMoGop((m) => ({ ...m, [kieu]: !m[kieu] }))}
      menuKhoa={menuKhoa} onMenu={setMenuKhoa}
      danhMuc={danhMuc} thanhKhoa={thanhKhoa} onThanh={setThanhKhoa} onTha={tha} onThemCamXuc={setTamCX} onMoBl={moBL}
      onAnTin={(t, an) => { vaAn(t.khoa, an); anTin(t.khoa, an).catch(() => vaAn(t.khoa, !an)) }}
      onDongY={(id) => traLoi(id, true)} onDeSau={(id) => traLoi(id, false)}
      onMoKetBan={() => timBan('')} onBack={onBack} bao={bao}>
      {tamBL && <TamBinhLuan tin={tamBL.tin} ct={tamBL.ct} xem={tamBL.xem} onXem={(xem) => setTamBL((b) => b && { ...b, xem, loc: null })}
        loc={tamBL.loc} onLoc={(loc) => setTamBL((b) => b && { ...b, loc })} banPhim={tamBL.banPhim} onBanPhim={(banPhim) => setTamBL((b) => b && { ...b, banPhim })}
        danhMuc={danhMuc} onGui={guiBL} dangGui={tamBL.dangGui} loi={tamBL.loi} onGo={goBL} onAn={anBL} onDong={() => setTamBL(null)} />}
      {tamCX && <TamCamXuc tin={tamCX} danhMuc={danhMuc} onDong={() => setTamCX(null)} onChon={(ma) => { const t = tamCX; setTamCX(null); tha(t, ma) }} />}
      {tamKetBan && <TamKetBan tim={tamKetBan.tim} onTim={timBan} ds={tamKetBan.ds} onDong={() => setTamKetBan(null)}
        onGui={(id) => { setTamKetBan((x) => x && { ...x, ds: x.ds?.map((g) => (g.id === id ? { ...g, trang_thai: 'da_gui' } : g)) ?? null })
          guiKetBan(id).then((r) => { if (r === 'da_la_ban') { taiBan(); taiKenh('ban') } }).catch(() => timBan(tamKetBan.tim)) }} />}
    </TheGioiView>
  )
}
