// ============================================================================
// HomeHS912 — MÀN CHÍNH app HS LỚP 9–12 (có điện thoại riêng) · spec-giao-dien-hs.md (Thùy chốt 28/09/2026).
// Thay Home v4 (pastel + nhân vật + khẩu hiệu + màu gán theo giới tính — HS chê "trẻ con"). Bố cục 1 cho mọi skin:
//   đầu trang (avatar · tên · nút HÌNH NỀN · hòm thư · ⋯) → VIỆC TIẾP THEO → widget đếm ngược kỳ thi (Elo bỏ khỏi Home — Thùy 29/09)
//   → banner kiểm tra lại → lưới ô chức năng (danh sách ô do HocSinhApp truyền, giữ nguyên chức năng từng khối).
// 01/10 (Thùy: "chọn môn Toán, KHTN, Tiếng Anh; chuyển môn là chuyển tính năng học tập, chơi thì không cần"): phần dưới
//   03/10: thẻ Thế giới BK lên CAO NHẤT (dưới lời chào); Giải trí = Nhiệm vụ · Thư viện BK (Rank bên trong) · Thành tựu · May mắn · Ví xu.
//   tách 2 KHỐI — "Học tập" (thanh chọn môn → ca bổ trợ của môn → lưới ô `nhom='hoc'`) và "Giải trí" (thẻ Thế giới BK →
//   lưới ô `nhom='choi'`, chung mọi môn).
// Skin: CHỈ đọc biến CSS `--sk-*` từ skin/registry.ts — không `if (skin === …)` ở đây.
// Nút "Hình nền" mở tấm chọn (skin · sáng/tối · hình nền), Home phía sau đổi ngay để em nhìn thật.
// Lần đầu mở app (chưa có dòng hs_giao_dien): chào → chọn giao diện → khoanh nút "Hình nền" để em biết chỗ đổi → lưu.
// Component chỉ VẼ: Elo/hạng/đếm ngược do fn_hs_home_912 tính ở Postgres; số trên ô do HocSinhApp suy như Home cũ.
// ============================================================================
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import AvatarHS from './AvatarHS'
import ThanhChonMon from './ThanhChonMon'
import type { LopMonHS } from '../../lib/tuluyen'
import type { HomeCard } from './HomeHS'
import { LOAI_BO_TRO_TEN, type LichBoTro } from '../../lib/botro_yeu_ca'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { luuGiaoDien, type Home912 } from '../../lib/giaodien_hs'
import { THE, HEAD, MAU, NhomHS, useHeThongToi, useManDoc, useMedia } from './skin/KhungHS'
import { TamDoHoa } from './phieuluu/DoHoa'
import type { TheGioiHome } from '../../lib/thegioi'
import { TenLop, moTaTin } from './thegioi/TheGioiHS'
import { SKINS, SKIN_MAC_DINH, laySkin, cheDoThat, bienCss, layHinhNen, nenCua, type GiaoDien, type CheDo, type Skin } from './skin/registry'
import { BieuTuongBac, SaoBac } from './gami/HinhGami'

const MAC_DINH: GiaoDien = { skin: SKIN_MAC_DINH, che_do: 'he_thong', hinh_nen: 'mac_dinh' }

// Thẻ/tiêu đề/màu/hook màn hình lấy từ skin/KhungHS — 1 nguồn style cho Home và mọi màn (Thùy 29/09).

function Badge({ n }: { n: number }) {
  return <span className="flex h-5 min-w-5 items-center justify-center px-1.5 text-[11px] font-extrabold" style={{ borderRadius: 'var(--sk-radius-pill)', background: 'var(--sk-badge)', color: 'var(--sk-badge-ink)' }}>{n}</span>
}

// ── Việc tiếp theo: ca bổ trợ gần nhất → ô đang có việc → Tự luyện ──────────
type Viec = { nhan: string; tieuDe: string; phu: string; onClick?: () => void; gap?: boolean; laCa?: boolean }
function viecTiepTheo(lich: LichBoTro[], cards: HomeCard[], onLich: () => void): Viec {
  const c = lich[0]
  if (c) {
    const gio = c.gio_bat_dau ? ` · ${String(c.gio_bat_dau).slice(0, 5)}` : ''
    return {
      nhan: c.vao_ca ? 'Đang tới giờ' : c.hom_nay ? `Hôm nay${gio}` : `${thuCuaNgay(c.ngay)} ${ddmmVN(c.ngay)}${gio}`,
      tieuDe: `${LOAI_BO_TRO_TEN[c.loai]}${c.mon ? ` · ${c.mon}` : ''}`,
      phu: c.vao_ca ? 'Bấm để vào ca ngay' : [c.phong ? `Phòng ${c.phong}` : '', c.nguoi ?? ''].filter(Boolean).join(' · ') || 'Xem lịch bổ trợ',
      onClick: onLich, gap: c.vao_ca, laCa: true,
    }
  }
  const coViec = cards.find((k) => !k.disabled && (k.badge ?? 0) > 0)
  if (coViec) return { nhan: 'Việc cần làm', tieuDe: coViec.ten, phu: coViec.sub, onClick: coViec.onClick }
  const tl = cards.find((k) => k.id === 'tu_luyen' && !k.disabled)
  // Môn đang chọn chưa có kho (ô Tự luyện khoá) ⇒ không rủ luyện 10 câu.
  if (!tl) return { nhan: 'Không có việc gấp', tieuDe: 'Chưa có việc', phu: 'Thầy cô giao bài sẽ hiện ở đây' }
  return { nhan: 'Không có việc gấp', tieuDe: 'Tự luyện 10 câu', phu: 'Luyện theo dạng còn yếu', onClick: tl.onClick }
}

// ── MÀN CHÍNH (chỉ vẽ) ───────────────────────────────────────────────────────
type HomeProps = {
  hoTen: string; maHS: string; lopMon: string | null; anhUrl: string | null; onAnhChanged: (url: string) => void
  mons: LopMonHS[]; mon: string | null; onChonMon: (mon: string) => void
  demMon?: Record<string, number> // số việc đang chờ theo môn (HocSinhApp đếm) ⇒ chấm số trên nút môn khác
  chuaDoc: number; lich: LichBoTro[]; soRetest: number; cards: HomeCard[]; data: Home912 | null
  onHopThu: () => void; onDoiMK: () => void; onThoat: () => void; onLich: () => void; onRetest: () => void
  onGopY?: () => void; gopYMoi?: number // Góp ý & báo lỗi (menu ⋯) + số lời trả lời em chưa đọc ⇒ chấm đỏ trên ⋯
  onHoSo?: () => void // có ⇒ bấm avatar mở HỒ SƠ (DON-HANG-GAMI-HS Đơn 4); đổi ảnh chuyển vào trong Hồ sơ
  gioiTinh?: 'nam' | 'nu' | null // chỉ để chọn NHÂN VẬT của style — không đổi màu theo giới tính
  theGioi?: TheGioiHome | null; onTheGioi?: () => void // thẻ Thế giới BK (thay thẻ "Việc cần làm" — Thùy 29/09)
  rank?: { bac: number; ten: string; sao: number } | null; onRank?: () => void // bậc Rank của MÔN đang chọn — huy hiệu cạnh tên (Thùy 01/10)
}

// ── MÀN CHÍNH khổ DỌC (điện thoại · iPad dọc) — theo hàng dưới ảnh gốc style (RPG: Nền app HS cấp 3_11.png, Thùy 29/09):
// avatar + cụm nút → "Chào tên!" → nhân vật + bong bóng thoại → banner việc / kiểm tra lại → lưới 4 cột ô nhỏ (icon giữa ô).
// Style không có nhân vật ⇒ bỏ khối nhân vật, còn lại giữ nguyên.
function ManChinh({ p, skin, onHinhNen, nutRef }: { p: HomeProps; skin: Skin; onHinhNen: () => void; nutRef: RefObject<HTMLButtonElement> }) {
  const tenNgan = p.hoTen.trim().split(/\s+/).slice(-2).join(' ')
  const { hoc, choi } = tachO(p)
  const viec = viecTiepTheo(p.lich, hoc, p.onLich)
  const widgets = tomTat(p)
  const nv = skin.nhanVat ? (p.gioiTinh === 'nu' ? skin.nhanVat.nu : skin.nhanVat.nam) : null
  const bong = '0 2px 12px var(--sk-bg), 0 0 3px var(--sk-bg)'
  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-[430px] flex-col gap-3 px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-[calc(12px+env(safe-area-inset-top))] md:max-w-[820px] md:gap-4 md:px-8">
      <div className="flex items-center gap-2.5">
        <AnhDaiDien p={p} size={44} />
        <HuyHieuBac p={p} />
        <span className="flex-1" />
        <CumNut p={p} onHinhNen={onHinhNen} nutRef={nutRef} />
      </div>

      <div className="leading-tight">
        <h1 className="text-[34px] font-bold leading-[1.05] md:text-[50px]" style={{ ...HEAD, textShadow: bong }}>Chào<br />{tenNgan}!</h1>
        <p className="mt-1 text-[13px] md:text-[15px]" style={{ color: 'var(--sk-muted)', textShadow: bong }}>{p.maHS.toUpperCase()}{p.lopMon ? ` · ${p.lopMon}` : ''}</p>
      </div>
      {widgets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {widgets.map((w) => (
            <span key={w.nhan} className="flex items-baseline gap-1.5 rounded-full px-3.5 py-1.5" style={{ ...THE, borderRadius: 'var(--sk-radius-pill)', clipPath: 'none' }}>
              <span className="text-[12px] font-semibold" style={{ color: 'var(--sk-muted)' }}>{w.nhan}</span>
              <b className="text-[16px] tabular-nums" style={HEAD}>{w.so}</b>
              <span className="text-[11.5px]" style={{ color: 'var(--sk-muted)' }}>{w.phu}</span>
            </span>
          ))}
        </div>
      )}

      {/* THẾ GIỚI BK cao nhất màn chính (Thùy 03/10) */}
      <TheTheGioi p={p} skin={skin} />

      {nv && (
        <div className="relative -mt-1 h-[230px] md:h-[380px]">
          <img src={nv} alt="" className="pointer-events-none absolute bottom-0 left-0 h-full max-w-none select-none object-contain md:left-[6%]"
            style={{ filter: 'drop-shadow(0 10px 22px var(--sk-bg))', WebkitMaskImage: 'linear-gradient(180deg, black 78%, transparent)', maskImage: 'linear-gradient(180deg, black 78%, transparent)' }} />
          <div className="absolute right-0 top-[14%] max-w-[52%] rounded-[20px] px-3.5 py-2.5 text-[13.5px] font-semibold leading-snug shadow-2xl md:right-[6%] md:max-w-[300px] md:px-5 md:py-3.5 md:text-[16px]"
            style={{ background: 'var(--sk-ink)', color: 'var(--sk-bg)' }}>
            {loiNhanVat(viec)}
            <span className="absolute -left-1.5 top-6 h-4 w-4 rotate-45" style={{ background: 'var(--sk-ink)' }} />
          </div>
        </div>
      )}

      {/* ── GÓC HỌC TẬP của MÔN đang chọn (Thùy 01/10): thanh môn → việc bổ trợ của môn → lưới ô học tập ── */}
      <NhomHS>Học tập</NhomHS>
      <ChonMon p={p} />
      {viec.laCa && <NutViec viec={viec} skin={skin} />}
      {p.soRetest > 0 && <NutRetest p={p} skin={skin} />}
      <LuoiDoc cards={hoc} skin={skin} />

      {/* ── GIẢI TRÍ — chung mọi môn, đổi môn không đổi ── */}
      {choi.length > 0 && <NhomHS>Giải trí</NhomHS>}
      <LuoiDoc cards={choi} skin={skin} />
    </div>
  )
}

// Icon ô: ảnh thường, hoặc MẶT NẠ tô màu chữ khi style đơn sắc (Skin.anhOMask — Tối giản). Ảnh riêng của ô (c.anh, vd bậc Rank) luôn là ảnh thường.
export function IconO({ src, mask, className }: { src: string; mask: boolean; className: string }) {
  if (!mask) return <img src={src} alt="" className={`${className} object-contain`} />
  const m = `url(${src}) center / contain no-repeat`
  return <span aria-hidden className={`block ${className}`} style={{ background: 'var(--sk-ink)', WebkitMask: m, mask: m }} />
}

// LƯỚI Ô khổ dọc — 4 cột ô nhỏ như ảnh gốc (điện thoại), iPad dọc cùng lưới nhưng ô to
function LuoiDoc({ cards, skin }: { cards: HomeCard[]; skin: Skin }) {
  if (cards.length === 0) return null
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {cards.map((c) => {
        const anh = c.anh ?? skin.anhO?.[c.id]
        return (
          <button key={c.id} disabled={c.disabled} onClick={c.onClick}
            className={`relative flex min-h-[104px] flex-col items-center justify-start gap-1 px-1 pb-2 pt-2.5 text-center transition md:min-h-[168px] md:gap-1.5 md:px-2 md:pt-4 ${c.disabled ? 'opacity-50' : 'active:scale-[0.97]'}`} style={THE}>
            {anh
              ? <IconO src={anh} mask={!c.anh && !!skin.anhOMask} className="h-11 w-11 md:h-[76px] md:w-[76px]" />
              : <span className="text-[24px] leading-none md:text-[36px]" style={skin.dauThayIcon ? { color: 'var(--sk-acc)' } : undefined} aria-hidden>{skin.dauThayIcon ?? c.icon ?? c.emoji ?? '•'}</span>}
            <span className="text-[12px] font-bold leading-tight md:text-[16px]" style={HEAD}>{c.ten}</span>
            <span className="line-clamp-2 text-[10px] leading-snug md:text-[12.5px]" style={{ color: mauPhu(c), fontWeight: c.subMau === 'ton' || c.subMau === 'do' ? 700 : 500 }}>{c.sub}</span>
            {!!c.badge && c.badge > 0 && <span className="absolute right-1 top-1 md:right-2 md:top-2"><Badge n={c.badge} /></span>}
          </button>
        )
      })}
    </div>
  )
}

// Tách ô theo nhóm. Ô Thế giới BK đã có THẺ riêng ở khối Giải trí ⇒ bỏ ô trùng (đứng sát nhau trong cùng khối).
function tachO(p: HomeProps) {
  const choi = p.cards.filter((c) => c.nhom === 'choi' && !(p.onTheGioi && c.id === 'the_gioi'))
  return { hoc: p.cards.filter((c) => c.nhom !== 'choi'), choi }
}

const mauPhu = (c: HomeCard) => c.subMau === 'do' ? MAU.sai : c.subMau === 'xanh' ? MAU.dung : c.subMau === 'ton' ? 'var(--sk-ink)' : 'var(--sk-muted)'
const NUT_TRON: CSSProperties = { ...THE, clipPath: 'none', borderLeft: 'var(--sk-card-border)', borderRadius: 'var(--sk-radius-pill)' }

// Cụm nút đầu trang (Hình nền · hòm thư · ⋯) — chung cho bố cục dọc và ngang.
function CumNut({ p, onHinhNen, nutRef }: { p: HomeProps; onHinhNen: () => void; nutRef: RefObject<HTMLButtonElement> }) {
  const [menu, setMenu] = useState(false)
  const [doHoa, setDoHoa] = useState(false) // chỉnh đồ hoạ bản đồ 3D (spec-v1-app-hs §4.5)
  return (
    <>
        <button ref={nutRef} onClick={onHinhNen} className="flex h-10 shrink-0 items-center gap-1.5 px-3 text-[13px] font-bold active:scale-95"
          style={NUT_TRON} aria-label="Đổi giao diện và hình nền">
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.8-1.9 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z" />
            <circle cx="7.5" cy="11" r="1.2" fill="currentColor" /><circle cx="10" cy="7.3" r="1.2" fill="currentColor" /><circle cx="14.5" cy="7.3" r="1.2" fill="currentColor" />
          </svg>
          Hình nền
        </button>
        <button onClick={p.onHopThu} className="relative flex h-10 w-10 shrink-0 items-center justify-center active:scale-95" style={NUT_TRON} aria-label="Hòm thư">
          <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {p.chuaDoc > 0 && <span className="absolute -right-1 -top-1"><Badge n={p.chuaDoc} /></span>}
        </button>
        <div className="relative shrink-0">
          <button onClick={() => setMenu((m) => !m)} className="flex h-10 w-10 items-center justify-center text-[20px] font-bold leading-none active:scale-95" style={NUT_TRON} aria-label="Thêm">⋯</button>
          {!!p.gopYMoi && <span className="pointer-events-none absolute -right-1 -top-1"><Badge n={p.gopYMoi} /></span>}
          {menu && (
            <div className="absolute right-0 top-12 z-20 flex w-44 flex-col overflow-hidden rounded-2xl text-[14px] shadow-xl" style={{ background: 'var(--sk-bg)', border: '1px solid var(--sk-line)' }}>
              <button className="px-4 py-3 text-left" onClick={() => { setMenu(false); setDoHoa(true) }}>Đồ hoạ</button>
              {p.onGopY && <button className="flex items-center justify-between px-4 py-3 text-left" style={{ borderTop: '1px solid var(--sk-line)' }} onClick={() => { setMenu(false); p.onGopY!() }}>
                Góp ý & báo lỗi {!!p.gopYMoi && <Badge n={p.gopYMoi} />}</button>}
              <button className="px-4 py-3 text-left" style={{ borderTop: '1px solid var(--sk-line)' }} onClick={() => { setMenu(false); p.onDoiMK() }}>Đổi mật khẩu</button>
              <button className="px-4 py-3 text-left" style={{ borderTop: '1px solid var(--sk-line)' }} onClick={() => { setMenu(false); p.onThoat() }}>Thoát</button>
            </div>
          )}
        </div>
        {doHoa && <TamDoHoa onDong={() => setDoHoa(false)} />}
    </>
  )
}

function AnhDaiDien({ p, size }: { p: HomeProps; size: number }) {
  const initials = p.hoTen.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className="shrink-0" style={{ borderRadius: 'var(--sk-radius-pill)', boxShadow: '0 0 0 2px var(--sk-acc)' }}>
      {p.onHoSo
        ? <button onClick={p.onHoSo} aria-label="Hồ sơ của em" className="flex items-center justify-center overflow-hidden font-extrabold active:scale-95"
            style={{ width: size, height: size, fontSize: size * 0.36, background: 'var(--sk-surface2)', borderRadius: 'var(--sk-radius-pill)' }}>
            {p.anhUrl ? <img src={p.anhUrl} alt="" className="h-full w-full object-cover" /> : initials}
          </button>
        : <AvatarHS anhUrl={p.anhUrl} initials={initials} size={size} fill="var(--sk-surface2)" badge="var(--sk-acc)" onChanged={p.onAnhChanged} />}
    </div>
  )
}

// HUY HIỆU BẬC RANK cạnh thông tin em (Thùy 01/10) — biểu tượng bậc của MÔN đang chọn + tên bậc + sao; bấm ⇒ màn Rank.
// Môn chưa mở rank / chưa tải xong ⇒ không vẽ (không giữ chỗ trống). trongTam = nằm trong tấm tên khổ ngang (vạch ngăn bên trái).
function HuyHieuBac({ p, trongTam }: { p: HomeProps; trongTam?: boolean }) {
  if (!p.rank) return null
  const r = p.rank
  return (
    <button onClick={p.onRank} disabled={!p.onRank} aria-label={`Rank: ${r.ten}`}
      className={`flex shrink-0 items-center gap-1.5 text-left active:scale-95 ${trongTam ? 'ml-1 border-l pl-3' : 'h-11 pl-1 pr-3'}`}
      style={trongTam ? { borderColor: 'var(--sk-line)' } : NUT_TRON}>
      <BieuTuongBac bac={r.bac} size={trongTam ? 44 : 38} nho />
      <span className="leading-tight">
        <span className="block whitespace-nowrap text-[13.5px] font-bold" style={HEAD}>{r.ten}</span>
        {r.bac < 9 && <SaoBac n={r.sao} size={12} />}
      </span>
    </button>
  )
}

// CHỌN MÔN — bản to, LUÔN hiện (em 1 môn thấy đúng môn của mình = nhãn khối học tập); màu đọc biến skin, không if theo skin
function ChonMon({ p }: { p: HomeProps }) {
  return (
    <ThanhChonMon mons={p.mons} mon={p.mon} onChon={p.onChonMon} dem={p.demMon} to luonHien
      khung={{ ...THE, clipPath: 'none', borderRadius: 'var(--sk-radius-pill)' }}
      nut={(chon) => chon
        ? { background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)', borderRadius: 'var(--sk-radius-pill)' }
        : { background: 'transparent', color: 'var(--sk-ink)', borderRadius: 'var(--sk-radius-pill)' }} />
  )
}

// VIỆC TIẾP THEO
function NutViec({ viec, skin, to }: { viec: Viec; skin: Skin; to?: boolean }) {
  const coAnh = viec.laCa && !!skin.anhBanner?.lich
  return (
    <button onClick={viec.onClick} disabled={!viec.onClick} className={`relative flex flex-col items-start justify-center gap-0.5 overflow-hidden text-left active:scale-[0.99] ${to ? 'min-h-[92px] px-5 py-4' : 'px-4 py-3.5'}`}
      style={{ ...THE, background: 'var(--sk-next-bg)', color: 'var(--sk-next-ink)', border: 'var(--sk-next-border)', borderLeft: 'var(--sk-next-border)' }}>
      {skin.trangTri?.goc && <>
        <img src={skin.trangTri.goc} alt="" className="pointer-events-none absolute left-1 top-1 h-10 w-10 opacity-70" />
        <img src={skin.trangTri.goc} alt="" className="pointer-events-none absolute bottom-1 right-1 h-10 w-10 rotate-180 opacity-70" />
      </>}
      {coAnh && <img src={skin.anhBanner!.lich} alt="" className="pointer-events-none absolute right-3 top-1/2 h-14 w-14 -translate-y-1/2 object-contain" />}
      <span className={`text-[11px] font-bold uppercase tracking-[0.08em] opacity-80 ${coAnh ? 'pr-16' : ''}`}>{viec.nhan}</span>
      <span className={`${to ? 'text-[21px]' : 'text-[19px]'} font-bold leading-snug ${coAnh ? 'pr-16' : ''}`} style={HEAD}>{viec.tieuDe}</span>
      <span className={`text-[13px] opacity-85 ${coAnh ? 'pr-16' : ''}`}>{viec.phu}{viec.gap ? ' →' : ''}</span>
    </button>
  )
}

function NutRetest({ p, skin, to }: { p: HomeProps; skin: Skin; to?: boolean }) {
  return (
    <button onClick={p.onRetest} className={`flex items-center justify-between gap-3 text-left active:scale-[0.99] ${to ? 'min-h-[92px] px-5 py-4' : 'px-4 py-3'}`} style={THE}>
      {skin.anhBanner?.kiemTraLai && <img src={skin.anhBanner.kiemTraLai} alt="" className={`${to ? 'h-14 w-14' : 'h-11 w-11'} shrink-0 object-contain`} />}
      <span className="min-w-0 flex-1">
        <span className={`block ${to ? 'text-[19px]' : 'text-[15px]'} font-bold`} style={HEAD}>Bài kiểm tra lại</span>
        <span className="block text-[12.5px]" style={{ color: 'var(--sk-muted)' }}>{p.soRetest} bài chờ làm sau ET · nộp 1 lần</span>
      </span>
      <Badge n={p.soRetest} />
    </button>
  )
}

// THẺ THẾ GIỚI BK trên màn chính (Thùy 29/09: bỏ "Việc cần làm" — HS ít việc, từng ô đã có chấm đỏ; chỗ đó để thông báo Thế giới BK).
// Dòng: tương tác mới 24h trên tin của em → lời mời kết bạn → tin nổi bật. Mọi số từ fn_the_gioi_home.
function TheTheGioi({ p, skin, to }: { p: HomeProps; skin: Skin; to?: boolean }) {
  if (!p.onTheGioi) return null
  const g = p.theGioi, tt = g?.tuong_tac
  const anh = skin.anhO?.the_gioi
  const dong: ReactNode[] = []
  const choKhoe = g?.cho_khoe?.tin.length ?? 0
  if (choKhoe > 0) dong.push(<>🎉 <b>Em có {choKhoe} thành tích</b> chưa khoe — khoe ngay!</>)
  if (tt && tt.so > 0) dong.push(<>🔥 <b>{tt.nguoi ? <TenLop n={tt.nguoi} rutGon /> : 'Bạn bè'}</b>{tt.so_nguoi > 1 ? ` và ${tt.so_nguoi - 1} bạn` : ''} vừa thả tim, bình luận tin của em</>)
  if (g && g.loi_moi > 0) dong.push(<>💌 <b>{g.loi_moi} lời mời</b> kết bạn đang chờ em</>)
  for (const t of g?.tin ?? []) dong.push(<><b>{t.nguoi ? <TenLop n={t.nguoi} rutGon /> : `Đội ${String(t.chi_tiet.doi ?? '')}`}</b> {moTaTin(t)}</>)
  // lời dẫn cố định dưới tiêu đề (Thùy 29/09) — thông báo nối sau
  const so = (tt?.so ?? 0) + (g?.loi_moi ?? 0) + choKhoe
  return (
    <button onClick={p.onTheGioi} className={`relative flex w-full items-center gap-3 text-left active:scale-[0.99] ${to ? 'min-h-[92px] px-5 py-3.5' : 'px-3.5 py-3'}`} style={THE}>
      {anh ? <IconO src={anh} mask={!!skin.anhOMask} className={`${to ? 'h-14 w-14' : 'h-12 w-12'} shrink-0`} /> : <span className="text-[30px] leading-none" aria-hidden>🌏</span>}
      <span className="min-w-0 flex-1">
        <span className={`block font-bold ${to ? 'text-[19px]' : 'text-[16px]'}`} style={HEAD}>Thế giới BK</span>
        <span className="block truncate text-[12px] italic leading-snug" style={{ color: 'var(--sk-acc)' }}>Xem học sinh BK đang khoe gì nào!</span>
        {dong.slice(0, to ? 3 : 2).map((d, i) => <span key={i} className="block truncate text-[12.5px] leading-snug" style={{ color: i === 0 && so > 0 ? 'var(--sk-ink)' : 'var(--sk-muted)' }}>{d}</span>)}
      </span>
      {so > 0 && <Badge n={so} />}
      <span className="shrink-0 text-[20px] leading-none" style={{ color: 'var(--sk-muted)' }} aria-hidden>›</span>
    </button>
  )
}

const tomTat = (p: HomeProps) => [
  ...(p.data?.thi ?? []).slice(0, 1).map((t) => ({ nhan: t.ten, so: String(t.con_ngay), phu: t.con_ngay === 0 ? 'Hôm nay thi!' : `ngày nữa · ${ddmmVN(t.ngay)}` })),
  // Thùy 29/09: KHÔNG hiện Elo ở màn chính (fn_hs_home_912 vẫn trả elo — chỗ khác dùng được).
].slice(0, 2)

// Lời nhân vật nói (bong bóng thoại) — suy từ đúng "việc tiếp theo" đang hiện, không bịa số.
function loiNhanVat(v: Viec): string {
  if (v.laCa) return v.gap ? `Đến giờ ${v.tieuDe} rồi! Vào ca ngay nhé!` : `${v.nhan} có ${v.tieuDe} đó, nhớ đến nhé!`
  if (v.nhan === 'Việc cần làm') return `${v.tieuDe} đang chờ em đó!`
  if (!v.onClick) return 'Môn này chưa có việc gì, em nghỉ chút nhé!'
  return 'Hôm nay luyện 10 câu cùng tớ nhé!'
}

// ── MÀN CHÍNH khổ NGANG (PC / iPad ngang) — theo ảnh gốc style (RPG: design/bk-ui-src/Nền app HS cấp 3_11.png, Thùy 29/09):
// đầu trang (avatar + tên · nút) → nửa TRÁI nhân vật đứng + bong bóng thoại · nửa PHẢI "Chào …!" + số liệu → banner việc/kiểm tra lại
// → lưới ô 4 cột (icon to giữa ô). Style không có nhân vật ⇒ cột trái bỏ, nội dung trải hết bề ngang.
function ManNgang({ p, skin, onHinhNen, nutRef }: { p: HomeProps; skin: Skin; onHinhNen: () => void; nutRef: RefObject<HTMLButtonElement> }) {
  const tenNgan = p.hoTen.trim().split(/\s+/).slice(-2).join(' ')
  const { hoc, choi } = tachO(p)
  const viec = viecTiepTheo(p.lich, hoc, p.onLich)
  const widgets = tomTat(p)
  const nv = skin.nhanVat ? (p.gioiTinh === 'nu' ? skin.nhanVat.nu : skin.nhanVat.nam) : null
  const bong = '0 2px 14px var(--sk-bg), 0 0 3px var(--sk-bg)'
  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col px-8 pb-8 pt-5 xl:px-12">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 items-center gap-3 py-1 pl-1 pr-5" style={{ background: 'var(--sk-name-plate)', borderRadius: 'var(--sk-radius-pill)' }}>
          <AnhDaiDien p={p} size={52} />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[17px] font-bold" style={HEAD}>{p.hoTen}</span>
            <span className="block truncate text-[12.5px]" style={{ color: 'var(--sk-muted)' }}>{p.maHS.toUpperCase()}{p.lopMon ? ` · ${p.lopMon}` : ''}</span>
          </span>
          <HuyHieuBac p={p} trongTam />
        </div>
        <span className="flex-1" />
        <CumNut p={p} onHinhNen={onHinhNen} nutRef={nutRef} />
      </div>

      <div className={`mt-2 grid flex-1 gap-8 ${nv ? 'grid-cols-[minmax(280px,32%)_1fr]' : 'grid-cols-1'}`}>
        {nv && (
          <div className="relative min-h-[520px]">
            <img src={nv} alt="" className="pointer-events-none absolute bottom-0 left-1/2 h-[min(80vh,780px)] max-w-none -translate-x-1/2 select-none object-contain"
              style={{ filter: 'drop-shadow(0 12px 28px var(--sk-bg))' }} />
            <div className="absolute left-0 max-w-[220px] rounded-[22px] px-4 py-3 text-[14.5px] font-semibold leading-snug shadow-2xl"
              style={{ background: 'var(--sk-ink)', color: 'var(--sk-bg)', bottom: 'calc(min(80vh, 780px) * 0.8)' }}>
              {loiNhanVat(viec)}
              <span className="absolute -bottom-2 right-8 h-4 w-4 rotate-45" style={{ background: 'var(--sk-ink)' }} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-4 pb-2 pt-4">
          <h1 className="text-[46px] font-bold leading-[1.05] xl:text-[54px]" style={{ ...HEAD, textShadow: bong }}>Chào<br />{tenNgan}!</h1>
          {widgets.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              {widgets.map((w) => (
                <span key={w.nhan} className="flex items-baseline gap-2 rounded-full px-4 py-2" style={{ ...THE, borderRadius: 'var(--sk-radius-pill)', clipPath: 'none' }}>
                  <span className="text-[12.5px] font-semibold" style={{ color: 'var(--sk-muted)' }}>{w.nhan}</span>
                  <b className="text-[18px] tabular-nums" style={HEAD}>{w.so}</b>
                  <span className="text-[12px]" style={{ color: 'var(--sk-muted)' }}>{w.phu}</span>
                </span>
              ))}
            </div>
          )}

          {/* THẾ GIỚI BK cao nhất (Thùy 03/10) */}
          {p.onTheGioi && <div className="flex min-w-0"><TheTheGioi p={p} skin={skin} to /></div>}

          {/* ── GÓC HỌC TẬP của MÔN đang chọn (Thùy 01/10) ── */}
          <NhomHS>Học tập</NhomHS>
          <ChonMon p={p} />
          {(() => {
            const khoi = [viec.laCa ? <NutViec viec={viec} skin={skin} to /> : null, p.soRetest > 0 ? <NutRetest p={p} skin={skin} to /> : null].filter(Boolean)
            return khoi.length > 0 && (
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 xl:gap-4">
                {khoi.map((k, i) => <div key={i} className={`flex min-w-0 ${khoi.length === 1 ? 'col-span-2' : ''}`}>{k}</div>)}
              </div>
            )
          })()}
          <LuoiNgang cards={hoc} skin={skin} />

          {/* ── GIẢI TRÍ — chung mọi môn ── */}
          {choi.length > 0 && <NhomHS>Giải trí</NhomHS>}
          <LuoiNgang cards={choi} skin={skin} />
        </div>
      </div>
    </div>
  )
}

// LƯỚI Ô khổ ngang — 4 cột (5 khi nhiều ô), icon to giữa ô
function LuoiNgang({ cards, skin }: { cards: HomeCard[]; skin: Skin }) {
  if (cards.length === 0) return null
  return (
    <div className={`grid gap-3 xl:gap-4 ${cards.length > 8 ? 'grid-cols-5' : 'grid-cols-4'}`}>
      {cards.map((c) => {
        const anh = c.anh ?? skin.anhO?.[c.id]
        return (
          <button key={c.id} disabled={c.disabled} onClick={c.onClick}
            className={`relative flex min-h-[148px] flex-col items-center justify-center gap-1 px-2 py-3 text-center transition xl:min-h-[176px] xl:gap-1.5 xl:px-3 xl:py-4 ${c.disabled ? 'opacity-50' : 'hover:-translate-y-0.5 active:scale-[0.98]'}`} style={THE}>
            {anh
              ? <IconO src={anh} mask={!c.anh && !!skin.anhOMask} className="h-16 w-16 xl:h-[84px] xl:w-[84px]" />
              : <span className="text-[40px] leading-none" style={skin.dauThayIcon ? { color: 'var(--sk-acc)' } : undefined} aria-hidden>{skin.dauThayIcon ?? c.icon ?? c.emoji ?? '•'}</span>}
            <span className="text-[15px] font-bold leading-tight xl:text-[17px]" style={HEAD}>{c.ten}</span>
            <span className="text-[12px] leading-snug xl:text-[13px]" style={{ color: mauPhu(c), fontWeight: c.subMau === 'ton' || c.subMau === 'do' ? 700 : 500 }}>{c.sub}</span>
            {!!c.badge && c.badge > 0 && <span className="absolute right-2.5 top-2.5"><Badge n={c.badge} /></span>}
          </button>
        )
      })}
    </div>
  )
}

// ── TẤM CHỌN GIAO DIỆN (skin · sáng/tối · hình nền) ─────────────────────────
function ChonGiaoDien({ gd, setGd, heThongToi, nutChinh, onNutChinh, onDong, dangLuu, loi }: {
  gd: GiaoDien; setGd: (g: GiaoDien) => void; heThongToi: boolean
  nutChinh: string; onNutChinh: () => void; onDong?: () => void; dangLuu: boolean; loi: string | null
}) {
  const skin = laySkin(gd.skin)
  const cd = cheDoThat(skin, gd.che_do, heThongToi)
  const khoaCheDo = skin.cheDo.length === 1
  const chonSkin = (s: Skin) => setGd({ ...gd, skin: s.id, hinh_nen: s.hinhNen.some((h) => h.id === gd.hinh_nen) ? gd.hinh_nen : s.hinhNen[0].id })
  const CHE_DO: { id: CheDo; ten: string }[] = [{ id: 'sang', ten: 'Sáng' }, { id: 'toi', ten: 'Tối' }, { id: 'he_thong', ten: 'Theo máy' }]
  const nut = (chon: boolean): CSSProperties => ({ border: `2px solid ${chon ? 'var(--sk-acc)' : 'var(--sk-line)'}`, background: chon ? 'var(--sk-surface2)' : 'transparent' })

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-h-[74dvh] max-w-[560px] flex-col rounded-t-[24px] shadow-[0_-12px_40px_rgba(0,0,0,0.35)]"
      style={{ background: 'var(--sk-bg)', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)', borderTop: '1px solid var(--sk-line)' }} role="dialog" aria-label="Chọn giao diện">
      <div className="flex items-center justify-between px-5 pb-2 pt-4">
        <p className="text-[18px] font-bold" style={HEAD}>Giao diện</p>
        {onDong && <button onClick={onDong} className="flex h-9 w-9 items-center justify-center rounded-full text-[18px]" style={{ background: 'var(--sk-surface2)' }} aria-label="Đóng, không lưu">✕</button>}
      </div>
      <div className="flex flex-col gap-5 overflow-y-auto px-5 pb-4">
        <section className="flex flex-col gap-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--sk-muted)' }}>Phong cách</p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {SKINS.map((s) => {
              const v = bienCss(s, cheDoThat(s, gd.che_do, heThongToi), s.hinhNen[0].id) as CSSProperties
              const chon = s.id === gd.skin
              return (
                <button key={s.id} onClick={() => chonSkin(s)} className="flex flex-col gap-1.5 rounded-2xl p-1.5 text-left" style={nut(chon)} aria-pressed={chon}>
                  <span className="flex h-[72px] flex-col gap-1.5 overflow-hidden rounded-xl p-2" style={{ ...v, background: 'var(--sk-page)' }}>
                    <span className="h-4 w-3/4" style={{ background: 'var(--sk-acc)', borderRadius: 'var(--sk-radius)', clipPath: 'var(--sk-card-clip)' }} />
                    <span className="flex flex-1 gap-1.5">
                      <span className="flex-1" style={{ ...THE, borderRadius: 'calc(var(--sk-radius) / 2)' }} />
                      <span className="flex-1" style={{ ...THE, borderRadius: 'calc(var(--sk-radius) / 2)' }} />
                    </span>
                  </span>
                  <span className="px-1 leading-tight">
                    <span className="block text-[13.5px] font-bold">{s.ten}</span>
                    <span className="block text-[11px]" style={{ color: 'var(--sk-muted)' }}>{s.giongGi}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--sk-muted)' }}>Chế độ</p>
          {khoaCheDo
            ? <p className="text-[13px]" style={{ color: 'var(--sk-muted)' }}>Skin {skin.ten} chỉ có nền {skin.cheDo[0] === 'toi' ? 'tối' : 'sáng'}.</p>
            : <div className="flex gap-2">
                {CHE_DO.map((c) => (
                  <button key={c.id} onClick={() => setGd({ ...gd, che_do: c.id })} className="flex-1 rounded-xl px-2 py-2 text-[13.5px] font-semibold" style={nut(gd.che_do === c.id)} aria-pressed={gd.che_do === c.id}>{c.ten}</button>
                ))}
              </div>}
        </section>

        <section className="flex flex-col gap-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--sk-muted)' }}>Hiệu ứng game</p>
          <div className="flex gap-2">
            {([[true, 'Bật', 'Bản đồ phiêu lưu, đánh quái'], [false, 'Tắt', 'Làm bài dạng thường, gọn']] as const).map(([b, ten, mo]) => {
              const chon = (gd.hieu_ung_game ?? true) === b
              return (
                <button key={ten} onClick={() => setGd({ ...gd, hieu_ung_game: b })} className="flex-1 rounded-xl px-3 py-2 text-left" style={nut(chon)} aria-pressed={chon}>
                  <span className="block text-[13.5px] font-semibold">{ten}</span>
                  <span className="block text-[11.5px] leading-tight" style={{ color: 'var(--sk-muted)' }}>{mo}</span>
                </button>
              )
            })}
          </div>
          {!skin.the3d && <p className="text-[12px]" style={{ color: 'var(--sk-muted)' }}>Phong cách {skin.ten} không có bản đồ phiêu lưu — Tự luyện luôn là bài dạng thường.</p>}
        </section>

        <section className="flex flex-col gap-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--sk-muted)' }}>Hình nền</p>
          <div className="grid grid-cols-4 gap-2">
            {skin.hinhNen.map((h) => {
              const chon = layHinhNen(skin, gd.hinh_nen).id === h.id
              return (
                <button key={h.id} onClick={() => setGd({ ...gd, hinh_nen: h.id })} className="flex flex-col items-center gap-1 rounded-xl p-1" style={nut(chon)} aria-pressed={chon}>
                  <span className="block aspect-[3/4] w-full rounded-lg" style={{ background: nenCua(h, cd, true), border: '1px solid var(--sk-line)' }} />
                  <span className="text-[11px] font-semibold leading-tight">{h.ten}</span>
                </button>
              )
            })}
          </div>
        </section>
      </div>
      <div className="flex flex-col gap-2 px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-2" style={{ borderTop: '1px solid var(--sk-line)' }}>
        {loi && <p className="text-[13px] font-semibold" style={{ color: MAU.sai }}>{loi}</p>}
        <button onClick={onNutChinh} disabled={dangLuu} className="h-12 w-full text-[15px] font-bold active:scale-[0.99]"
          style={{ background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)', borderRadius: 'var(--sk-radius)', clipPath: 'var(--sk-card-clip)', fontFamily: 'var(--sk-font-head)', opacity: dangLuu ? 0.7 : 1 }}>
          {dangLuu ? 'Đang lưu…' : nutChinh}
        </button>
      </div>
    </div>
  )
}

// ── HƯỚNG DẪN LẦN ĐẦU ────────────────────────────────────────────────────────
function Lop({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`fixed inset-0 z-50 flex items-center justify-center p-5 ${className}`} style={{ background: 'rgba(0,0,0,0.55)' }}>{children}</div>
}

// Khoanh sáng đúng nút "Hình nền" (đo vị trí thật, đo lại khi xoay/đổi cỡ) + lời nhắc bên dưới.
function ChiNut({ nutRef, onXong, dangLuu, loi }: { nutRef: RefObject<HTMLButtonElement>; onXong: () => void; dangLuu: boolean; loi: string | null }) {
  const [r, setR] = useState<DOMRect | null>(null)
  useLayoutEffect(() => {
    const do_ = () => setR(nutRef.current?.getBoundingClientRect() ?? null)
    do_()
    window.addEventListener('resize', do_); window.addEventListener('scroll', do_, true)
    return () => { window.removeEventListener('resize', do_); window.removeEventListener('scroll', do_, true) }
  }, [nutRef])
  if (!r) return null
  const pad = 6
  const trai = Math.max(12, Math.min(r.left + r.width / 2 - 150, window.innerWidth - 312))
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="Chỗ đổi hình nền">
      <div className="pointer-events-none absolute rounded-full" style={{ left: r.left - pad, top: r.top - pad, width: r.width + pad * 2, height: r.height + pad * 2, boxShadow: '0 0 0 9999px rgba(0,0,0,0.62), 0 0 0 3px #fff' }} />
      <div className="absolute w-[300px] rounded-2xl p-4 shadow-2xl" style={{ left: trai, top: r.bottom + 16, background: MAU.bg, color: MAU.ink, border: '1px solid var(--sk-line)' }}>
        <span className="absolute -top-2 h-4 w-4 rotate-45" style={{ background: MAU.bg, borderLeft: '1px solid var(--sk-line)', borderTop: '1px solid var(--sk-line)', left: Math.min(Math.max(r.left + r.width / 2 - trai - 8, 16), 268) }} />
        <p className="text-[16px] font-bold">Đổi giao diện ở đây</p>
        <p className="mt-1 text-[14px] leading-snug" style={{ color: MAU.muted }}>Bấm nút <b>Hình nền</b> bất cứ lúc nào để đổi phong cách và hình nền.</p>
        {loi && <p className="mt-2 text-[13px] font-semibold" style={{ color: MAU.sai }}>{loi}</p>}
        <button onClick={onXong} disabled={dangLuu} className="mt-3 h-11 w-full rounded-xl text-[15px] font-bold" style={{ background: MAU.acc, color: MAU.accInk }}>{dangLuu ? 'Đang lưu…' : loi ? 'Thử lại' : 'Đã hiểu'}</button>
      </div>
    </div>
  )
}

// ── VỎ: giữ lựa chọn đã lưu + bản đang xem thử, lo lưu ──────────────────────
export default function HomeHS912({ giaoDien, onDaLuu, ...p }: HomeProps & { giaoDien: GiaoDien | null; onDaLuu: (g: GiaoDien) => void }) {
  const heThongToi = useHeThongToi()
  const manDoc = useManDoc()
  const ngang = useMedia('(min-width: 1024px) and (orientation: landscape)') // PC / iPad ngang ⇒ bố cục theo ảnh gốc
  const daLuu = giaoDien ?? MAC_DINH
  const [xem, setXem] = useState<GiaoDien>(daLuu)           // bản đang vẽ (xem thử khi tấm chọn mở)
  const [buoc, setBuoc] = useState<'chao' | 'chon' | 'chi_nut' | null>(giaoDien ? null : 'chao')
  const [mo, setMo] = useState(false)                       // tấm chọn mở từ nút (không phải hướng dẫn)
  const [dangLuu, setDangLuu] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [daLuuXong, setDaLuuXong] = useState(false)
  const nutRef = useRef<HTMLButtonElement>(null)

  const skin = laySkin(xem.skin)
  const v = bienCss(skin, cheDoThat(skin, xem.che_do, heThongToi), xem.hinh_nen, manDoc) as CSSProperties

  async function luu(sau: () => void) {
    setDangLuu(true); setLoi(null)
    try { const g = await luuGiaoDien(xem); onDaLuu(g); sau() }
    catch { setLoi('Chưa lưu được — kiểm tra mạng rồi bấm lại.') }
    finally { setDangLuu(false) }
  }

  return (
    <div className="min-h-[100dvh]" style={{ ...v, background: 'var(--sk-page)', backgroundAttachment: 'fixed', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      {ngang
        ? <ManNgang p={p} skin={skin} nutRef={nutRef} onHinhNen={() => { setXem(daLuu); setLoi(null); setMo(true) }} />
        : <ManChinh p={p} skin={skin} nutRef={nutRef} onHinhNen={() => { setXem(daLuu); setLoi(null); setMo(true) }} />}

      {mo && !buoc && (
        <ChonGiaoDien gd={xem} setGd={setXem} heThongToi={heThongToi} nutChinh="Lưu" dangLuu={dangLuu} loi={loi}
          onDong={() => { setXem(daLuu); setMo(false) }}
          onNutChinh={() => luu(() => { setMo(false); setDaLuuXong(true); setTimeout(() => setDaLuuXong(false), 2000) })} />
      )}
      {daLuuXong && (
        <div className="fixed inset-x-0 bottom-6 z-40 mx-auto w-fit rounded-full px-4 py-2 text-[14px] font-bold shadow-lg" style={{ background: 'var(--sk-ink)', color: 'var(--sk-bg)' }}>Đã lưu giao diện</div>
      )}

      {buoc === 'chao' && (
        <Lop>
          <div className="w-full max-w-[360px] rounded-3xl p-6 shadow-2xl" style={{ background: MAU.bg, color: MAU.ink, border: '1px solid var(--sk-line)', fontFamily: 'var(--sk-font)' }}>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: MAU.acc }}>Mới</p>
            <p className="mt-1 text-[22px] font-extrabold leading-tight">App có giao diện mới, {p.hoTen.trim().split(/\s+/).slice(-2).join(' ')} tự chọn nhé</p>
            <p className="mt-2 text-[14.5px] leading-snug" style={{ color: MAU.muted }}>Chọn phong cách và hình nền em thích. Chọn xong vẫn đổi lại được bất cứ lúc nào.</p>
            <button onClick={() => setBuoc('chon')} className="mt-5 h-12 w-full rounded-xl text-[15px] font-bold" style={{ background: MAU.acc, color: MAU.accInk }}>Chọn giao diện</button>
            <button onClick={() => setBuoc('chi_nut')} className="mt-2 h-11 w-full rounded-xl text-[14px] font-semibold" style={{ color: MAU.muted }}>Để sau, dùng {laySkin(SKIN_MAC_DINH).ten}</button>
          </div>
        </Lop>
      )}
      {buoc === 'chon' && (
        <ChonGiaoDien gd={xem} setGd={setXem} heThongToi={heThongToi} nutChinh="Xong" dangLuu={false} loi={null}
          onNutChinh={() => setBuoc('chi_nut')} />
      )}
      {buoc === 'chi_nut' && <ChiNut nutRef={nutRef} dangLuu={dangLuu} loi={loi} onXong={() => luu(() => setBuoc(null))} />}
    </div>
  )
}
