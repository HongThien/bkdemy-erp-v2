// ============================================================================
// THẾ GIỚI BK — mạng xã hội KHOE nội bộ của HS (spec-the-gioi-bk.md · mockup chốt 29/09 https://claude.ai/artifact/QNDbroHiEMNPctHjS5dWTb).
// 3 tab: 🌏 Thế giới (tin S riêng + tin A GỘP theo loại — không ngập) · 🤝 Bạn bè (tin chi tiết của bạn + lời mời + kết bạn) ·
// 🏰 Lớp (tin chi tiết các lớp em học). Không đăng bài, không chat: bạn bè chỉ thả 1 icon + 1 câu chọn sẵn. Tên LUÔN kèm lớp.
// Tách VIEW chỉ vẽ (TheGioiView · TamKhen · TamKetBan — dùng chung app thật + hs.html?xem=gami&man=the_gioi) khỏi container.
// Style: chỉ skin/KhungHS (MAU/THE/HEAD) — design/STYLE-HS.md. Hình: gami/hinh.ts (KIT.the_gioi tắt ⇒ emoji; kit Đơn 5 về ⇒ bật cờ).
// Sau khi khen / ẩn / trả lời lời mời: VÁ đúng tin/dòng đó tại chỗ, không tải lại cả danh sách (CLAUDE §2).
// ============================================================================
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ManHS, DauTrangHS, MAU, THE, THE_TRON, HEAD, NhomHS, TrongHS } from '../skin/KhungHS'
import { ICON_TIN, ICON_TG, anhTG, anhTin, anhTuongTac, anhPhaoGiay } from '../gami/hinh'
import {
  layKenh, guiKhen, anTin, datHien, banBeCuaToi, goiYKetBan, guiKetBan, traLoiKetBan, layDanhMuc,
  type KenhId, type KenhTG, type TinTG, type GopTG, type KhenTG, type NguoiTG, type BanBeTG, type GoiYTG, type DanhMucTG,
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
function moTaTin(t: TinTG): ReactNode {
  const c = t.chi_tiet as Record<string, string | number>
  switch (t.kieu) {
    case 'nhat_buoi': return <><b>Nhất buổi</b> {t.mon} {ddmm(c.ngay)}</>
    case 'game_nhat': return <><b>Nhất {TEN_GAME[String(c.game)] ?? 'game'}</b> buổi {ddmm(c.ngay)}</>
    case 'doi_thang': return <>Đội {c.doi} thắng <b>{TEN_GAME[String(c.game)] ?? 'game'}</b> buổi {ddmm(c.ngay)}</>
    case 'tra_sua': return <>trúng <b>trà sữa 🧋</b> ở {TEN_GAME[String(c.game)] ?? 'game buổi'}</>
    case 'huy_hieu': return <>đạt huy hiệu <b>{c.ten ?? c.key} ★{c.sao}</b> · {t.mon}</>
    case 'giai_thang': return <>nhận giải <b>{TEN_GIAI[String(c.loai_giai)] ?? 'tháng'} tháng {Number(String(c.thang).slice(5, 7))}</b> · {t.mon}</>
    case 'no_luc': return <>xong <b>{c.so_bai} bài</b>{Number(c.so_thu_thach) > 0 ? <> · vượt <b>{c.so_thu_thach} Thử thách</b></> : null} · {t.mon}</>
    default: return <>{t.kieu}</>
  }
}
function luc(at: string): string {
  const phut = Math.round((Date.now() - new Date(at).getTime()) / 60000)
  if (phut < 60) return `${Math.max(1, phut)} phút trước`
  if (phut < 24 * 60) return `${Math.round(phut / 60)} giờ trước`
  if (phut < 48 * 60) return 'hôm qua'
  const d = new Date(at); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}
const TIEU_DE_GOP: Record<string, (so: number) => ReactNode> = {
  nhat_buoi: (so) => <>Hôm nay <b>{so} bạn</b> Nhất buổi</>,
  game_nhat: (so) => <>Hôm nay <b>{so} bạn</b> Nhất game buổi</>,
  doi_thang: (so) => <>Hôm nay <b>{so} đội</b> thắng game buổi</>,
  huy_hieu: (so) => <>Tuần này <b>{so} bạn</b> nhận huy hiệu</>,
}

function DauTang({ tang }: { tang: TinTG['tang'] }) {
  const src = anhTG(tang === 'S' ? 'tang_s' : tang === 'A' ? 'tang_a' : 'tang_b')
  return src ? <img src={src} alt={`Tầng ${tang}`} style={{ width: 18, height: 18 }} />
    : <span title={`Tầng ${tang}`} style={{ width: 18, height: 18, borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800,
        background: tang === 'S' ? MAU.acc : MAU.surface2, color: tang === 'S' ? MAU.accInk : MAU.acc, border: `1px solid ${MAU.line}` }}>{tang}</span>
}

function KhenTom({ k }: { k: KhenTG }) {
  const conLai = Math.max(0, k.tong - k.cau.length)
  return (
    <div className="flex flex-col gap-1.5">
      {k.thay_co.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-bold" style={{ background: MAU.surface2, border: `1px solid ${MAU.acc}`, color: MAU.acc }}>
          <Hinh src={anhTG('thay_co_khen')} emoji={ICON_TG.thay_co_khen} size={20} /> Thầy cô khen · {k.thay_co.join(', ')}
        </div>
      )}
      {k.dem.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {k.dem.map((d) => (
            <span key={d.ma} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12.5px] tabular-nums"
              style={{ background: MAU.surface2, border: `1px solid ${k.cua_toi?.icon_ma === d.ma ? MAU.acc : MAU.line}` }}>
              <Hinh src={anhTuongTac(d.ma)} emoji={d.icon} size={16} /> {d.so}
            </span>
          ))}
        </div>
      )}
      {k.cau.length > 0 && (
        <div className="flex flex-col gap-0.5 text-[12.5px]" style={{ color: MAU.muted }}>
          {k.cau.map((c, i) => <span key={i}><span style={{ color: MAU.ink }}>{c.cau}</span> — {c.la_em ? 'Em' : <TenLop n={c.nguoi} rutGon />}</span>)}
          {conLai > 0 && <span>+{conLai} bạn</span>}
        </div>
      )}
    </div>
  )
}

function NutKhen({ t, onKhen, nho }: { t: TinTG; onKhen: (t: TinTG) => void; nho?: boolean }) {
  if (t.cua_toi) return null // không tự khen tin mình
  const k = t.khen.cua_toi
  return (
    <button onClick={() => onKhen(t)} className={`${nho ? 'h-8 px-2.5 text-[12px]' : 'h-9 px-3.5 text-[13px]'} flex-none rounded-lg font-extrabold active:scale-95`}
      style={k ? { background: 'transparent', color: MAU.acc, border: `1.5px solid ${MAU.acc}` } : { background: MAU.acc, color: MAU.accInk }}>
      {k ? <>Đã khen {k.icon}</> : 'Khen'}
    </button>
  )
}

// ── Thẻ tin ─────────────────────────────────────────────────────────────────
function TheTin({ t, onKhen, onAnTin, menuMo, onMenu, anNhanBan }: {
  t: TinTG; onKhen: (t: TinTG) => void; onAnTin?: (t: TinTG, an: boolean) => void; menuMo?: boolean; onMenu?: (khoa: string | null) => void
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
      <div className="flex items-center gap-2.5 px-3 py-2.5 text-[13px]" style={{ ...THE, opacity: t.da_an ? 0.55 : 1 }}>
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg" style={{ background: MAU.surface2 }}><Hinh src={anhTin(t.kieu)} emoji={ICON_TIN[t.kieu] ?? '✨'} size={22} /></span>
        <span className="min-w-0 flex-1"><b>{t.nguoi ? <TenLop n={t.nguoi} rutGon /> : null}</b>{nhanBan} {moTaTin(t)}
          <span className="block text-[11.5px]" style={{ color: MAU.muted }}>{luc(t.at)}{t.khen.tong > 0 ? ` · ${t.khen.dem.slice(0, 3).map((d) => d.icon).join('')} ${t.khen.tong}` : ''}{t.da_an ? ' · em đã ẩn' : ''}</span></span>
        {menu}
        <NutKhen t={t} onKhen={onKhen} nho />
      </div>
    )
  }
  const laS = t.tang === 'S'
  return (
    <article className="relative flex flex-col gap-2.5 overflow-hidden p-3" style={{ ...THE, ...(laS ? { border: `2px solid ${MAU.acc}`, paddingTop: 28 } : {}), opacity: t.da_an ? 0.55 : 1 }}>
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
      <KhenTom k={t.khen} />
      <div className="flex items-center justify-end"><NutKhen t={t} onKhen={onKhen} /></div>
    </article>
  )
}

function TheGop({ g, mo, onMo, onKhen }: { g: GopTG; mo: boolean; onMo: () => void; onKhen: (t: TinTG) => void }) {
  return (
    <article className="flex flex-col gap-2 p-3" style={THE}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg" style={{ background: MAU.surface2 }}><Hinh src={anhTin(g.kieu)} emoji={ICON_TIN[g.kieu] ?? '✨'} size={26} /></span>
        <p className="min-w-0 flex-1 text-[14.5px] leading-snug">{(TIEU_DE_GOP[g.kieu] ?? ((so: number) => <>{so} tin</>))(g.so)}</p>
        <DauTang tang="A" />
      </div>
      {mo
        ? <div className="flex flex-col">{g.ds.map((t) => (
            <div key={t.khoa} className="flex items-center gap-2.5 py-2" style={{ borderTop: `1px solid ${MAU.line}` }}>
              <Avatar n={t.nguoi} size={32} />
              <span className="min-w-0 flex-1 text-[13px] leading-tight"><b>{t.nguoi ? <TenLop n={t.nguoi} /> : <>Đội {String(t.chi_tiet.doi ?? '')}{t.lop && <span style={NHAN_LOP}>{t.lop}</span>}</>}</b>
                {t.la_ban && !t.cua_toi && <span className="ml-1.5 text-[10.5px]" style={{ color: MAU.muted }}>bạn</span>}
                <span className="block text-[11.5px]" style={{ color: MAU.muted }}>{moTaTin(t)}</span></span>
              <NutKhen t={t} onKhen={onKhen} nho />
            </div>))}
            {g.so > g.ds.length && <p className="text-[12px]" style={{ color: MAU.muted }}>+{g.so - g.ds.length} bạn khác</p>}
          </div>
        : <p className="text-[12.5px]" style={{ color: MAU.muted }}>{g.ds.slice(0, 3).map((t, i) => <span key={t.khoa}>{i > 0 && ' · '}{t.nguoi ? <TenLop n={t.nguoi} rutGon /> : <>Đội {String(t.chi_tiet.doi ?? '')}{t.lop && <span style={NHAN_LOP}>{t.lop}</span>}</>}</span>)}{g.so > 3 ? ` · +${g.so - 3}` : ''}</p>}
      <div className="flex justify-end">
        <button onClick={onMo} className="h-9 rounded-lg px-3.5 text-[13px] font-extrabold" style={{ color: MAU.acc, border: `1.5px solid ${MAU.acc}` }}>{mo ? 'Thu gọn' : 'Xem tất cả · khen'}</button>
      </div>
    </article>
  )
}

// ── VIEW chính ──────────────────────────────────────────────────────────────
export type TheGioiViewProps = {
  tab: KenhId; onTab: (t: KenhId) => void
  kenh: KenhTG | null; loi: string | null
  banBe: BanBeTG | null
  hien: 'ten' | 'ma'; onHien: (h: 'ten' | 'ma') => void
  moGop: Record<string, boolean>; onMoGop: (kieu: string) => void
  menuKhoa: string | null; onMenu: (khoa: string | null) => void
  onKhen: (t: TinTG) => void; onAnTin: (t: TinTG, an: boolean) => void
  onDongY: (id: string) => void; onDeSau: (id: string) => void; onMoKetBan: () => void
  onBack: () => void
  children?: ReactNode // tấm trượt (khen / kết bạn) đè lên
}
const TABS: { id: KenhId; ten: string; icon: keyof typeof ICON_TG }[] = [
  { id: 'tg', ten: 'Thế giới', icon: 'tab_the_gioi' }, { id: 'ban', ten: 'Bạn bè', icon: 'tab_ban_be' }, { id: 'lop', ten: 'Lớp', icon: 'tab_lop' },
]
export function TheGioiView(p: TheGioiViewProps) {
  const k = p.kenh
  const tinS = k?.tin.filter((t) => t.tang !== 'B') ?? []
  const tinB = k?.tin.filter((t) => t.tang === 'B') ?? []
  const theTin = (t: TinTG) => <TheTin key={t.khoa} t={t} onKhen={p.onKhen} onAnTin={p.onAnTin} menuMo={p.menuKhoa === t.khoa} onMenu={p.onMenu} anNhanBan={p.tab === 'ban'} />
  return (
    <ManHS>
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
        {k.gop.map((g) => <TheGop key={g.kieu} g={g} mo={!!p.moGop[g.kieu]} onMo={() => p.onMoGop(g.kieu)} onKhen={p.onKhen} />)}
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
      {p.children}
    </ManHS>
  )
}

// ── Tấm trượt dùng chung ────────────────────────────────────────────────────
function TamTruot({ tieuDe, phu, onDong, children, chan }: { tieuDe: string; phu?: ReactNode; onDong: () => void; children: ReactNode; chan?: ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(3,5,14,0.6)' }} onClick={onDong} />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[84dvh] max-w-[560px] flex-col rounded-t-[22px] shadow-2xl"
        style={{ background: MAU.bg, color: MAU.ink, fontFamily: 'var(--sk-font)', borderTop: `1px solid ${MAU.line}` }} role="dialog" aria-label={tieuDe}>
        <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-4">
          <div className="min-w-0"><p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: MAU.muted }}>{tieuDe}</p>{phu && <p className="text-[13.5px]">{phu}</p>}</div>
          <button onClick={onDong} className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[16px]" style={{ background: MAU.surface2 }} aria-label="Đóng">✕</button>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-3">{children}</div>
        {chan && <div className="flex flex-col gap-2 px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-2" style={{ borderTop: `1px solid ${MAU.line}` }}>{chan}</div>}
      </div>
    </>
  )
}

// Câu hợp loại tin: câu riêng loại trước, rồi câu dùng chung — tối đa 10 (spec §5).
export function cauHop(ds: DanhMucTG[], nhom: string): DanhMucTG[] {
  const cau = ds.filter((d) => d.loai === 'cau')
  return [...cau.filter((d) => d.nhom.includes(nhom)), ...cau.filter((d) => d.nhom.includes('chung') && !d.nhom.includes(nhom))].slice(0, 10)
}

export function TamKhen({ tin, danhMuc, icon, cau, onIcon, onCau, onGui, dangGui, loi, onDong }: {
  tin: TinTG; danhMuc: DanhMucTG[]; icon: string | null; cau: string | null
  onIcon: (ma: string) => void; onCau: (ma: string) => void; onGui: () => void; dangGui: boolean; loi: string | null; onDong: () => void
}) {
  const icons = danhMuc.filter((d) => d.loai === 'icon')
  const caus = cauHop(danhMuc, tin.nhom)
  const iconChon = icons.find((d) => d.ma === icon)
  const cauChon = caus.find((d) => d.ma === cau) ?? danhMuc.find((d) => d.ma === cau)
  const chon = (dang: boolean): CSSProperties => ({ border: `1.5px solid ${dang ? MAU.acc : MAU.line}`, background: dang ? MAU.surface2 : MAU.surface })
  return (
    <TamTruot tieuDe="Khen" onDong={onDong} phu={<>{tin.nguoi ? <b><TenLop n={tin.nguoi} rutGon /></b> : null} {moTaTin(tin)}</>} chan={<>
      <p className="min-h-[1.4em] text-[13px]" style={{ color: MAU.muted }}>{iconChon || cauChon ? <b style={{ color: MAU.ink }}>{iconChon?.noi_dung ?? '·'} {cauChon?.noi_dung ?? '…'}</b> : 'Chọn 1 icon và 1 câu để gửi.'}</p>
      {loi && <p className="text-[13px] font-semibold" style={{ color: MAU.sai }}>{loi}</p>}
      <button onClick={onGui} disabled={!icon || !cau || dangGui} className="h-12 rounded-xl text-[15px] font-extrabold disabled:opacity-45" style={{ background: MAU.acc, color: MAU.accInk }}>
        {dangGui ? 'Đang gửi…' : tin.khen.cua_toi ? 'Đổi lời khen' : 'Gửi'}</button>
    </>}>
      <NhomHS>Chọn 1 icon</NhomHS>
      <div className="grid grid-cols-5 gap-1.5">
        {icons.map((d) => <button key={d.ma} onClick={() => onIcon(d.ma)} aria-pressed={icon === d.ma} aria-label={d.ma} className="flex aspect-square items-center justify-center rounded-xl" style={chon(icon === d.ma)}>
          <Hinh src={anhTuongTac(d.ma)} emoji={d.noi_dung} size={30} /></button>)}
      </div>
      <NhomHS>Chọn 1 câu</NhomHS>
      <div className="flex flex-col gap-1.5">
        {caus.map((d) => <button key={d.ma} onClick={() => onCau(d.ma)} aria-pressed={cau === d.ma} className="rounded-xl px-3 py-2 text-left text-[13.5px] font-semibold" style={chon(cau === d.ma)}>{d.noi_dung}</button>)}
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

export default function TheGioiHS({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<KenhId>(NHO.tab)
  const [kenh, setKenh] = useState<Partial<Record<KenhId, KenhTG>>>(NHO.kenh)
  const [banBe, setBanBe] = useState<BanBeTG | null>(NHO.banBe)
  const [danhMuc, setDanhMuc] = useState<DanhMucTG[]>(NHO.danhMuc ?? [])
  const [loi, setLoi] = useState<string | null>(null)
  const [moGop, setMoGop] = useState<Record<string, boolean>>({})
  const [menuKhoa, setMenuKhoa] = useState<string | null>(null)
  const [tamKhen, setTamKhen] = useState<{ tin: TinTG; icon: string | null; cau: string | null; dangGui: boolean; loi: string | null } | null>(null)
  const [tamKetBan, setTamKetBan] = useState<{ tim: string; ds: GoiYTG[] | null } | null>(null)
  const timRef = useRef(0)

  useEffect(() => { NHO.tab = tab; NHO.kenh = kenh; NHO.banBe = banBe }, [tab, kenh, banBe])
  const taiKenh = (k: KenhId) => layKenh(k).then((d) => { setKenh((x) => ({ ...x, [k]: d })); setLoi(null) }).catch((e) => setLoi(`Chưa tải được Thế giới BK — ${loiText(e)}`))
  const taiBan = () => banBeCuaToi().then(setBanBe).catch(() => {})
  useEffect(() => { taiKenh(tab); if (tab === 'ban') taiBan() }, [tab])
  useEffect(() => { if (!NHO.danhMuc) layDanhMuc().then((d) => { NHO.danhMuc = d; setDanhMuc(d) }).catch(() => {}) }, [])

  // Vá lượt khen của 1 tin ở MỌI tab + thẻ gộp (cùng khoá tự nhiên).
  const vaKhen = (khoa: string, khen: KhenTG) => setKenh((x) => {
    const va = (t: TinTG) => (t.khoa === khoa ? { ...t, khen } : t)
    const moi: Partial<Record<KenhId, KenhTG>> = {}
    for (const [k, v] of Object.entries(x) as [KenhId, KenhTG][]) moi[k] = { ...v, tin: v.tin.map(va), gop: v.gop.map((g) => ({ ...g, ds: g.ds.map(va) })) }
    return moi
  })
  const vaAn = (khoa: string, an: boolean) => setKenh((x) => {
    const moi: Partial<Record<KenhId, KenhTG>> = {}
    for (const [k, v] of Object.entries(x) as [KenhId, KenhTG][]) moi[k] = { ...v, tin: v.tin.map((t) => (t.khoa === khoa ? { ...t, da_an: an } : t)) }
    return moi
  })

  const guiTamKhen = async () => {
    if (!tamKhen?.icon || !tamKhen.cau) return
    setTamKhen({ ...tamKhen, dangGui: true, loi: null })
    try { const k = await guiKhen(tamKhen.tin.khoa, tamKhen.icon, tamKhen.cau); vaKhen(tamKhen.tin.khoa, k); setTamKhen(null) }
    catch (e) { setTamKhen((x) => x && { ...x, dangGui: false, loi: `Chưa gửi được — ${loiText(e)}` }) }
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
    <TheGioiView tab={tab} onTab={(t) => { setMenuKhoa(null); setTab(t) }} kenh={kenh[tab] ?? null} loi={kenh[tab] ? null : loi} banBe={banBe}
      hien={hien} onHien={(h) => { datHien(h).then(() => taiKenh(tab)).catch(() => {}) ; setKenh((x) => ({ ...x, [tab]: x[tab] && { ...x[tab]!, toi: { ...x[tab]!.toi, hien: h } } })) }}
      moGop={moGop} onMoGop={(kieu) => setMoGop((m) => ({ ...m, [kieu]: !m[kieu] }))}
      menuKhoa={menuKhoa} onMenu={setMenuKhoa}
      onKhen={(t) => setTamKhen({ tin: t, icon: t.khen.cua_toi?.icon_ma ?? null, cau: t.khen.cua_toi?.cau_ma ?? null, dangGui: false, loi: null })}
      onAnTin={(t, an) => { vaAn(t.khoa, an); anTin(t.khoa, an).catch(() => vaAn(t.khoa, !an)) }}
      onDongY={(id) => traLoi(id, true)} onDeSau={(id) => traLoi(id, false)}
      onMoKetBan={() => timBan('')} onBack={onBack}>
      {tamKhen && <TamKhen tin={tamKhen.tin} danhMuc={danhMuc} icon={tamKhen.icon} cau={tamKhen.cau} dangGui={tamKhen.dangGui} loi={tamKhen.loi}
        onIcon={(ma) => setTamKhen((x) => x && { ...x, icon: ma })} onCau={(ma) => setTamKhen((x) => x && { ...x, cau: ma })}
        onGui={guiTamKhen} onDong={() => setTamKhen(null)} />}
      {tamKetBan && <TamKetBan tim={tamKetBan.tim} onTim={timBan} ds={tamKetBan.ds} onDong={() => setTamKetBan(null)}
        onGui={(id) => { setTamKetBan((x) => x && { ...x, ds: x.ds?.map((g) => (g.id === id ? { ...g, trang_thai: 'da_gui' } : g)) ?? null })
          guiKetBan(id).then((r) => { if (r === 'da_la_ban') { taiBan(); taiKenh('ban') } }).catch(() => timBan(tamKetBan.tim)) }} />}
    </TheGioiView>
  )
}
