// ============================================================================
// HomeHS912 — MÀN CHÍNH app HS LỚP 9–12 (có điện thoại riêng) · spec-giao-dien-hs.md (Thùy chốt 28/09/2026).
// Thay Home v4 (pastel + nhân vật + khẩu hiệu + màu gán theo giới tính — HS chê "trẻ con"). Bố cục 1 cho mọi skin:
//   đầu trang (avatar · tên · nút HÌNH NỀN · hòm thư · ⋯) → VIỆC TIẾP THEO → ≤2 widget (đếm ngược kỳ thi · Elo môn)
//   → banner kiểm tra lại → lưới ô chức năng (danh sách ô do HocSinhApp truyền, giữ nguyên chức năng từng khối).
// Skin: CHỈ đọc biến CSS `--sk-*` từ skin/registry.ts — không `if (skin === …)` ở đây.
// Nút "Hình nền" mở tấm chọn (skin · sáng/tối · hình nền), Home phía sau đổi ngay để em nhìn thật.
// Lần đầu mở app (chưa có dòng hs_giao_dien): chào → chọn giao diện → khoanh nút "Hình nền" để em biết chỗ đổi → lưu.
// Component chỉ VẼ: Elo/hạng/đếm ngược do fn_hs_home_912 tính ở Postgres; số trên ô do HocSinhApp suy như Home cũ.
// ============================================================================
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import AvatarHS from './AvatarHS'
import ThanhChonMon from './ThanhChonMon'
import type { LopMonHS } from '../../lib/tuluyen'
import type { HomeCard } from './HomeHS'
import { LOAI_BO_TRO_TEN, type LichBoTro } from '../../lib/botro_yeu_ca'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { luuGiaoDien, type Home912 } from '../../lib/giaodien_hs'
import { SKINS, SKIN_MAC_DINH, laySkin, cheDoThat, bienCss, layHinhNen, nenCua, type GiaoDien, type CheDo, type Skin } from './skin/registry'

const MAC_DINH: GiaoDien = { skin: SKIN_MAC_DINH, che_do: 'he_thong', hinh_nen: 'mac_dinh' }

function useMedia(q: string): boolean {
  const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null
  const [khop, setKhop] = useState(!!mq?.matches)
  useEffect(() => {
    if (!mq) return
    const f = (e: MediaQueryListEvent) => setKhop(e.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [mq])
  return khop
}
const useHeThongToi = () => useMedia('(prefers-color-scheme: dark)')
const useManDoc = () => useMedia('(orientation: portrait)') // chọn bản tranh nền dọc/ngang

// ── Khung dùng chung (thẻ theo skin) ────────────────────────────────────────
const THE: CSSProperties = {
  background: 'var(--sk-surface)', border: 'var(--sk-card-border)', borderLeft: 'var(--sk-card-left)',
  borderRadius: 'var(--sk-radius)', boxShadow: 'var(--sk-card-shadow)', clipPath: 'var(--sk-card-clip)',
  backdropFilter: 'var(--sk-blur)', WebkitBackdropFilter: 'var(--sk-blur)',
}
const HEAD: CSSProperties = { fontFamily: 'var(--sk-font-head)', textTransform: 'var(--sk-head-case)' as CSSProperties['textTransform'], letterSpacing: 'var(--sk-head-track)' }

function Badge({ n }: { n: number }) {
  return <span className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold" style={{ background: 'var(--sk-badge)', color: 'var(--sk-badge-ink)' }}>{n}</span>
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
  const tl = cards.find((k) => k.id === 'tu_luyen')
  return { nhan: 'Không có việc gấp', tieuDe: 'Tự luyện 10 câu', phu: 'Luyện theo dạng còn yếu', onClick: tl?.onClick }
}

// ── MÀN CHÍNH (chỉ vẽ) ───────────────────────────────────────────────────────
type HomeProps = {
  hoTen: string; maHS: string; lopMon: string | null; anhUrl: string | null; onAnhChanged: (url: string) => void
  mons: LopMonHS[]; mon: string | null; onChonMon: (mon: string) => void
  chuaDoc: number; lich: LichBoTro[]; soRetest: number; cards: HomeCard[]; data: Home912 | null
  onHopThu: () => void; onDoiMK: () => void; onThoat: () => void; onLich: () => void; onRetest: () => void
}

function ManChinh({ p, skin, onHinhNen, nutRef }: { p: HomeProps; skin: Skin; onHinhNen: () => void; nutRef: RefObject<HTMLButtonElement> }) {
  const [menu, setMenu] = useState(false)
  const tu = p.hoTen.trim().split(/\s+/)
  const initials = tu.slice(-2).map((w) => w[0]).join('').toUpperCase()
  const tenNgan = tu.slice(-2).join(' ')
  const viec = viecTiepTheo(p.lich, p.cards, p.onLich)
  const widgets: { nhan: string; so: string; phu: string }[] = [
    ...(p.data?.thi ?? []).slice(0, 1).map((t) => ({ nhan: t.ten, so: String(t.con_ngay), phu: t.con_ngay === 0 ? 'Hôm nay thi!' : `ngày nữa · ${ddmmVN(t.ngay)}` })),
    ...(p.data?.elo ?? []).map((e) => ({ nhan: `Elo ${e.mon}`, so: String(e.elo), phu: e.hang && e.so_hs ? `Hạng ${e.hang}/${e.so_hs} lớp` : 'Chưa xếp hạng lớp' })),
  ].slice(0, 2)

  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-[430px] flex-col gap-3 px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-[calc(12px+env(safe-area-inset-top))] md:max-w-[820px] lg:max-w-[1100px]">
      {/* ĐẦU TRANG */}
      <div className="flex items-center gap-2.5">
        <div className="shrink-0 rounded-full" style={{ boxShadow: '0 0 0 2px var(--sk-acc)' }}>
          <AvatarHS anhUrl={p.anhUrl} initials={initials} size={44} fill="var(--sk-surface2)" badge="var(--sk-acc)" onChanged={p.onAnhChanged} />
        </div>
        <span className="flex-1" />
        <button ref={nutRef} onClick={onHinhNen} className="flex h-10 shrink-0 items-center gap-1.5 px-3 text-[13px] font-bold active:scale-95"
          style={{ ...THE, clipPath: 'none', borderLeft: 'var(--sk-card-border)', borderRadius: '999px' }} aria-label="Đổi giao diện và hình nền">
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.8-1.9 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z" />
            <circle cx="7.5" cy="11" r="1.2" fill="currentColor" /><circle cx="10" cy="7.3" r="1.2" fill="currentColor" /><circle cx="14.5" cy="7.3" r="1.2" fill="currentColor" />
          </svg>
          Hình nền
        </button>
        <button onClick={p.onHopThu} className="relative flex h-10 w-10 shrink-0 items-center justify-center active:scale-95" style={{ ...THE, clipPath: 'none', borderLeft: 'var(--sk-card-border)', borderRadius: '999px' }} aria-label="Hòm thư">
          <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {p.chuaDoc > 0 && <span className="absolute -right-1 -top-1"><Badge n={p.chuaDoc} /></span>}
        </button>
        <div className="relative shrink-0">
          <button onClick={() => setMenu((m) => !m)} className="flex h-10 w-10 items-center justify-center text-[20px] font-bold leading-none active:scale-95" style={{ ...THE, clipPath: 'none', borderLeft: 'var(--sk-card-border)', borderRadius: '999px' }} aria-label="Thêm">⋯</button>
          {menu && (
            <div className="absolute right-0 top-12 z-20 flex w-44 flex-col overflow-hidden rounded-2xl text-[14px] shadow-xl" style={{ background: 'var(--sk-bg)', border: '1px solid var(--sk-line)' }}>
              <button className="px-4 py-3 text-left" onClick={() => { setMenu(false); p.onDoiMK() }}>Đổi mật khẩu</button>
              <button className="px-4 py-3 text-left" style={{ borderTop: '1px solid var(--sk-line)' }} onClick={() => { setMenu(false); p.onThoat() }}>Thoát</button>
            </div>
          )}
        </div>
      </div>
      {/* Tên riêng 1 hàng — chung hàng với 3 nút thì màn 375px chỉ còn "M.." */}
      <div className="min-w-0 self-start rounded-2xl leading-tight" style={{ background: 'var(--sk-name-plate)', padding: '6px 10px 6px 0', boxShadow: '-10px 0 0 var(--sk-name-plate)' }}>
        <p className="truncate text-[24px] font-bold" style={{ ...HEAD, textShadow: '0 1px 10px var(--sk-bg), 0 0 2px var(--sk-bg)' }}>{tenNgan}</p>
        <p className="truncate text-[13px]" style={{ color: 'var(--sk-muted)', textShadow: '0 1px 8px var(--sk-bg), 0 0 2px var(--sk-bg)' }}>{p.maHS.toUpperCase()}{p.lopMon ? ` · ${p.lopMon}` : ''}</p>
      </div>
      {/* CHỌN MÔN — chỉ hiện khi em học ≥2 môn; màu đọc biến skin, không if theo skin */}
      <ThanhChonMon mons={p.mons} mon={p.mon} onChon={p.onChonMon}
        nut={(chon) => chon
          ? { background: 'var(--sk-acc)', color: 'var(--sk-badge-ink)', border: '1px solid var(--sk-acc)' }
          : { background: 'var(--sk-surface)', color: 'var(--sk-ink)', border: '1px solid var(--sk-line)', backdropFilter: 'var(--sk-blur)', WebkitBackdropFilter: 'var(--sk-blur)' }} />
      {skin.trangTri?.gach && <img src={skin.trangTri.gach} alt="" className="pointer-events-none mx-auto -my-1 h-6 w-auto opacity-90" />}

      {/* VIỆC TIẾP THEO */}
      <button onClick={viec.onClick} disabled={!viec.onClick} className="relative flex flex-col items-start gap-0.5 overflow-hidden px-4 py-3.5 text-left active:scale-[0.99]"
        style={{ ...THE, background: 'var(--sk-next-bg)', color: 'var(--sk-next-ink)', border: 'var(--sk-next-border)', borderLeft: 'var(--sk-next-border)' }}>
        {skin.trangTri?.goc && <>
          <img src={skin.trangTri.goc} alt="" className="pointer-events-none absolute left-1 top-1 h-10 w-10 opacity-70" />
          <img src={skin.trangTri.goc} alt="" className="pointer-events-none absolute bottom-1 right-1 h-10 w-10 rotate-180 opacity-70" />
        </>}
        {viec.laCa && skin.anhBanner?.lich && <img src={skin.anhBanner.lich} alt="" className="pointer-events-none absolute right-3 top-1/2 h-14 w-14 -translate-y-1/2 object-contain" />}
        <span className={`text-[11px] font-bold uppercase tracking-[0.08em] opacity-80 ${viec.laCa && skin.anhBanner?.lich ? 'pr-16' : ''}`}>{viec.nhan}</span>
        <span className={`text-[19px] font-bold leading-snug ${viec.laCa && skin.anhBanner?.lich ? 'pr-16' : ''}`} style={HEAD}>{viec.tieuDe}</span>
        <span className={`text-[13px] opacity-85 ${viec.laCa && skin.anhBanner?.lich ? 'pr-16' : ''}`}>{viec.phu}{viec.gap ? ' →' : ''}</span>
      </button>

      {/* WIDGET — chỉ hiện cái có dữ liệu thật (§1.5: không có kỳ thi thì không vẽ ô "0 ngày") */}
      {widgets.length > 0 && (
        <div className={`grid grid-cols-2 gap-2.5 md:grid-cols-3`}>
          {widgets.map((w) => (
            <div key={w.nhan} className="flex min-w-0 flex-col px-3.5 py-3" style={THE}>
              <span className="truncate text-[11px] font-bold uppercase tracking-[0.07em]" style={{ color: 'var(--sk-muted)' }}>{w.nhan}</span>
              <span className="text-[26px] font-bold leading-tight tabular-nums" style={HEAD}>{w.so}</span>
              <span className="truncate text-[12px]" style={{ color: 'var(--sk-muted)' }}>{w.phu}</span>
            </div>
          ))}
        </div>
      )}

      {p.soRetest > 0 && (
        <button onClick={p.onRetest} className="flex items-center justify-between gap-3 px-4 py-3 text-left active:scale-[0.99]" style={THE}>
          {skin.anhBanner?.kiemTraLai && <img src={skin.anhBanner.kiemTraLai} alt="" className="h-11 w-11 shrink-0 object-contain" />}
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold" style={HEAD}>Bài kiểm tra lại</span>
            <span className="block text-[12.5px]" style={{ color: 'var(--sk-muted)' }}>{p.soRetest} bài chờ làm sau ET · nộp 1 lần</span>
          </span>
          <Badge n={p.soRetest} />
        </button>
      )}

      {/* LƯỚI Ô */}
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:gap-4">
        {p.cards.map((c) => {
          const anh = skin.anhO?.[c.id]
          const mauPhu = c.subMau === 'do' ? '#ef4444' : c.subMau === 'xanh' ? '#22a06b' : c.subMau === 'ton' ? 'var(--sk-ink)' : 'var(--sk-muted)'
          return (
            <button key={c.id} disabled={c.disabled} onClick={c.onClick}
              className={`relative flex min-h-[92px] flex-col items-start gap-1.5 p-3 text-left transition lg:min-h-[120px] lg:p-4 ${c.disabled ? 'opacity-50' : 'active:scale-[0.98]'}`} style={THE}>
              {anh
                ? <img src={anh} alt="" className="h-12 w-12 object-contain lg:h-14 lg:w-14" />
                : <span className="text-[24px] leading-none lg:text-[30px]" style={skin.dauThayIcon ? { color: 'var(--sk-acc)' } : undefined} aria-hidden>{skin.dauThayIcon ?? c.icon ?? c.emoji ?? '•'}</span>}
              <span className="pr-6 text-[14px] font-bold leading-tight lg:text-[17px]" style={HEAD}>{c.ten}</span>
              <span className="text-[11.5px] leading-snug lg:text-[13px]" style={{ color: mauPhu, fontWeight: c.subMau === 'ton' || c.subMau === 'do' ? 700 : 500 }}>{c.sub}</span>
              {!!c.badge && c.badge > 0 && <span className="absolute right-2.5 top-2.5"><Badge n={c.badge} /></span>}
            </button>
          )
        })}
      </div>
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
  const chonSkin = (s: Skin) => setGd({ skin: s.id, che_do: gd.che_do, hinh_nen: s.hinhNen.some((h) => h.id === gd.hinh_nen) ? gd.hinh_nen : s.hinhNen[0].id })
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
        {loi && <p className="text-[13px] font-semibold text-[#ef4444]">{loi}</p>}
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
      <div className="absolute w-[300px] rounded-2xl bg-white p-4 text-[#16161d] shadow-2xl" style={{ left: trai, top: r.bottom + 16, fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>
        <span className="absolute -top-2 h-4 w-4 rotate-45 bg-white" style={{ left: Math.min(Math.max(r.left + r.width / 2 - trai - 8, 16), 268) }} />
        <p className="text-[16px] font-bold">Đổi giao diện ở đây</p>
        <p className="mt-1 text-[14px] leading-snug text-[#4a4d5a]">Bấm nút <b>Hình nền</b> bất cứ lúc nào để đổi phong cách, chế độ sáng/tối và hình nền.</p>
        {loi && <p className="mt-2 text-[13px] font-semibold text-[#d23c3c]">{loi}</p>}
        <button onClick={onXong} disabled={dangLuu} className="mt-3 h-11 w-full rounded-xl bg-[#16161d] text-[15px] font-bold text-white">{dangLuu ? 'Đang lưu…' : loi ? 'Thử lại' : 'Đã hiểu'}</button>
      </div>
    </div>
  )
}

// ── VỎ: giữ lựa chọn đã lưu + bản đang xem thử, lo lưu ──────────────────────
export default function HomeHS912({ giaoDien, onDaLuu, ...p }: HomeProps & { giaoDien: GiaoDien | null; onDaLuu: (g: GiaoDien) => void }) {
  const heThongToi = useHeThongToi()
  const manDoc = useManDoc()
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
      <ManChinh p={p} skin={skin} nutRef={nutRef} onHinhNen={() => { setXem(daLuu); setLoi(null); setMo(true) }} />

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
          <div className="w-full max-w-[360px] rounded-3xl bg-white p-6 text-[#16161d] shadow-2xl" style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#2f5bea]">Mới</p>
            <p className="mt-1 text-[22px] font-extrabold leading-tight">App có giao diện mới, {p.hoTen.trim().split(/\s+/).slice(-2).join(' ')} tự chọn nhé</p>
            <p className="mt-2 text-[14.5px] leading-snug text-[#4a4d5a]">Có {SKINS.length} phong cách, mỗi cái có nhiều hình nền và chế độ sáng/tối. Chọn xong vẫn đổi lại được bất cứ lúc nào.</p>
            <button onClick={() => setBuoc('chon')} className="mt-5 h-12 w-full rounded-xl bg-[#16161d] text-[15px] font-bold text-white">Chọn giao diện</button>
            <button onClick={() => setBuoc('chi_nut')} className="mt-2 h-11 w-full rounded-xl text-[14px] font-semibold text-[#4a4d5a]">Để sau, dùng {laySkin(SKIN_MAC_DINH).ten}</button>
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
