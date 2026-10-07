// ============================================================================
// BangXepHangHS — màn BẢNG XẾP HẠNG (Thùy duyệt 06/10; spec-bang-xep-hang.md §0). UI chốt 07/10: header GỌN + đúng 3 bộ lọc dạng dropdown
// (Bảng · Khối mình/Toàn BK · Thời gian) + 1 dải hạng riêng tư + DANH SÁCH chiếm phần lớn màn (ngang: 2 cột 1–10 | 11–20). Không phân nhóm.
// Hạng của CHÍNH em chỉ máy chủ trả cho người gọi. Theo MÔN đang chọn; bảng không gắn môn hiện ở mọi môn. Mọi số do fn_bxh tính — ở đây chỉ vẽ.
// ĐỒ HOẠ (Đơn 15 + 16, 07/10): style nào khai `anhBxh` (RPG) ⇒ khung 9-slice, huy chương/khiên, icon bảng, nền trời đêm; style không khai ⇒ vẽ bằng code (khung đơn sắc).
// Tách VIEW (BangXepHangView — chỉ vẽ) khỏi container để hs.html?xem=gami vẽ bằng dữ liệu giả. Chữ gốc FORMAL.
// ============================================================================
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { bxhDanhMuc, bxhXem, type BxhKetQua, type BxhKy, type BxhLoai, type BxhPhamVi } from '../../../lib/bxh'
import { monCuaHS } from '../../../lib/tuluyen'
import type { AnhBxh, Khung9 } from '../skin/kieu'
import { DauTrangHS, MAU, HEAD, ManHS, THE, THE_TRON, TrongHS, useMonHS, useSkinHT } from '../skin/KhungHS'

const TEN_KY: Record<BxhKy, string> = { hom_nay: 'Hôm nay', tuan: 'Tuần này', thang: 'Tháng này', mua: 'Cả mùa', hien_tai: 'Kỷ lục / hiện tại' }
const TEN_PV: Record<BxhPhamVi, string> = { khoi: 'Khối mình', toan_bk: 'Toàn BK' }
const HUY_CHUONG = ['🥇', '🥈', '🥉']
const KHIEN = 'polygon(50% 0, 100% 14%, 100% 64%, 50% 100%, 0 64%, 0 14%)'
const so = (v: number, dv: string) => (dv === '%' ? `${Number(v)}%` : `${Number(v).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} ${dv}`)

type TuyChon<T extends string> = { v: T; ten: string; phu?: string; tat?: boolean; icon?: string }

/** Khung 9-slice bằng border-image: hien = chiều cao hiển thị (px) ⇒ hệ số co s = hien/h; góc co theo s để không méo. */
function kieuKhung(k: Khung9, hien: number, them?: CSSProperties): CSSProperties {
  const cat = +(k.cat * (hien / k.h)).toFixed(1)
  return { borderStyle: 'solid', borderWidth: cat, borderImage: `url(${k.src}) ${k.cat} fill / ${cat}px / 0 stretch`, ...them }
}

// Ô CHỌN dạng dropdown. Có art ⇒ khung ảnh + icon bảng + mũi tên ảnh; không ⇒ khung đơn sắc + tam giác SVG. Chỉ 1 lựa chọn ⇒ không mũi tên, không mở.
function Chon<T extends string>({ nhan, v, ds, onChon, art }: { nhan: string; v: T; ds: TuyChon<T>[]; onChon: (v: T) => void; art?: AnhBxh }) {
  const [mo, setMo] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!mo) return
    const dong = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setMo(false) }
    document.addEventListener('pointerdown', dong)
    return () => document.removeEventListener('pointerdown', dong)
  }, [mo])
  const cur = ds.find((x) => x.v === v)
  const nhieu = ds.length > 1
  const H = 50
  return (
    <div ref={ref} className="relative min-w-0">
      <button type="button" disabled={!nhieu} onClick={() => setMo((x) => !x)} aria-haspopup="listbox" aria-expanded={mo} aria-label={nhan} title={nhan}
        className="flex w-full items-center gap-1.5 text-left transition active:scale-[0.98]"
        style={art
          ? { height: H, paddingLeft: 4, paddingRight: 16, ...kieuKhung(mo ? art.khungChonMo : art.khungChon, H), filter: mo ? undefined : 'brightness(0.78)', background: 'rgba(17,23,47,0.4)', borderRadius: 14 }
          : { height: H, padding: '0 12px', ...THE_TRON, border: `1.5px solid ${mo ? MAU.acc : MAU.line}` }}>
        {art && cur?.icon && <img src={cur.icon} alt="" draggable={false} className="h-7 w-7 shrink-0 object-contain" />}
        <span className="min-w-0 flex-1">
          {!art && <span className="block truncate text-[10px] font-bold uppercase leading-none tracking-[0.06em]" style={{ color: MAU.muted }}>{nhan}</span>}
          <span className={`block truncate font-extrabold leading-tight ${art ? 'text-[15px]' : 'mt-1 text-[14px]'}`} style={HEAD}>{cur?.ten ?? '—'}</span>
        </span>
        {nhieu && (art
          ? <img src={art.muiTen} alt="" draggable={false} className="h-3 w-[18px] shrink-0 object-contain transition-transform" style={{ transform: mo ? 'rotate(180deg)' : undefined }} />
          : (
            <svg viewBox="0 0 12 8" className="h-2.5 w-3.5 shrink-0 transition-transform" style={{ transform: mo ? 'rotate(180deg)' : undefined, color: MAU.acc }} aria-hidden>
              <path d="M1 1.2h10L6 7z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          ))}
      </button>
      {mo && (
        <ul role="listbox" className="absolute left-0 top-full z-40 mt-1 max-h-[60vh] w-max min-w-full max-w-[88vw] overflow-auto"
          style={art
            ? { ...kieuKhung(art.khungMenu, 240, { padding: 6 }), background: MAU.bg, boxShadow: '0 10px 28px rgba(0,0,0,.5)' }
            : { padding: 4, background: MAU.bg, border: `1.5px solid ${MAU.acc}`, borderRadius: 'var(--sk-radius)', boxShadow: '0 10px 28px rgba(0,0,0,.45)' }}>
          {ds.map((o) => (
            <li key={o.v} role="option" aria-selected={o.v === v} aria-disabled={o.tat}>
              <button type="button" disabled={o.tat} onClick={() => { onChon(o.v); setMo(false) }}
                className="flex min-h-[44px] w-full items-center gap-2 px-2.5 py-1.5 text-left"
                style={{ borderRadius: 10, opacity: o.tat ? 0.55 : 1, background: o.v === v ? MAU.surface2 : 'transparent' }}>
                {art && o.icon
                  ? <img src={o.icon} alt="" draggable={false} className="h-8 w-8 shrink-0 object-contain" />
                  : <span className="w-4 shrink-0 text-center text-[13px] font-black" style={{ color: MAU.acc }}>{o.v === v ? '✓' : ''}</span>}
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold leading-tight">{o.ten}</span>
                  {o.phu && <span className="block text-[11.5px] leading-snug" style={{ color: MAU.muted }}>{o.phu}</span>}
                </span>
                {o.tat && <span className="shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold" style={{ border: `1px solid ${MAU.line}`, color: MAU.muted }}>Sắp có</span>}
                {art && !o.tat && o.v === v && <span className="shrink-0 text-[13px] font-black" style={{ color: MAU.acc }}>✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Huy hiệu hạng: có art ⇒ huy chương PNG (top 3) / khiên PNG (còn lại) + SỐ do code đè lên (PNG trống); không art ⇒ emoji / khiên CSS
function HangHuy({ hang, art }: { hang: number; art?: AnhBxh }) {
  if (art) {
    const top = hang <= 3
    const w = top ? 44 : 34, h = top ? 44 : 40
    return (
      <span className="relative -my-1.5 flex shrink-0 items-center justify-center" style={{ width: 46, height: 46 }} aria-label={`Hạng ${hang}`}>
        <img src={top ? art.huyChuong[hang - 1] : art.khien} alt="" draggable={false} style={{ width: w, height: h }} className="object-contain" />
        <b className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 font-black tabular-nums leading-none" style={{ top: top ? '60%' : '53%', fontSize: top ? 17 : 14, color: top ? MAU.accInk : MAU.acc }}>{hang}</b>
      </span>
    )
  }
  if (hang <= 3) return <span className="flex w-9 shrink-0 justify-center text-[22px] leading-none" aria-label={`Hạng ${hang}`}>{HUY_CHUONG[hang - 1]}</span>
  return (
    <span className="flex h-[34px] w-9 shrink-0 items-center justify-center pb-1 text-[13px] font-black tabular-nums"
      style={{ background: MAU.surface2, color: MAU.ink, clipPath: KHIEN }} aria-label={`Hạng ${hang}`}>{hang}</span>
  )
}

function Dai({ art, children }: { art?: AnhBxh; children: ReactNode }) {
  return art
    ? <div className="flex items-center gap-2.5" style={{ minHeight: 58, ...kieuKhung(art.khungDai, 58, { background: 'rgba(17,23,47,0.4)', borderRadius: 16 }), paddingInline: 6 }}>{children}</div>
    : <div className="flex items-center gap-2.5 px-3 py-2" style={{ ...THE, boxShadow: '0 0 10px var(--sk-acc)' }}>{children}</div>
}

export function BangXepHangView({ dm, loai, onLoai, pv, onPv, ky, onKy, kq, dangTai, loi, hienMa, onHienMa, mon, onBack }: {
  dm: BxhLoai[]; loai: string; onLoai: (m: string) => void; pv: BxhPhamVi; onPv: (p: BxhPhamVi) => void; ky: BxhKy; onKy: (k: BxhKy) => void
  kq: BxhKetQua | null; dangTai: boolean; loi: string | null; hienMa: boolean; onHienMa: (b: boolean) => void; mon: string | null; onBack?: () => void
}) {
  const art = useSkinHT().anhBxh
  const cur = dm.find((d) => d.ma === loai)
  const dsLoai: TuyChon<string>[] = dm.map((d) => ({ v: d.ma, ten: d.ten, icon: art?.iconBang[d.ma], phu: d.san_sang ? `${d.mo_ta}${d.gan_mon ? '' : ' · mọi môn'}` : undefined, tat: !d.san_sang }))
  const dsPv: TuyChon<BxhPhamVi>[] = (['khoi', 'toan_bk'] as BxhPhamVi[]).map((p) => ({ v: p, ten: TEN_PV[p] }))
  const dsKy: TuyChon<BxhKy>[] = (cur?.ky_cho_phep ?? [ky]).map((k) => ({ v: k, ten: TEN_KY[k] }))
  const dv = kq && kq.san_sang ? kq.don_vi : cur?.don_vi ?? ''
  const locBang = (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-[1.5fr_1fr_1fr] sm:gap-2">
      <div className="col-span-2 sm:col-span-1"><Chon nhan="Bảng" v={loai} ds={dsLoai} onChon={onLoai} art={art} /></div>
      <Chon nhan="Phạm vi" v={pv} ds={dsPv} onChon={onPv} art={art} />
      <Chon nhan="Thời gian" v={ky} ds={dsKy} onChon={onKy} art={art} />
    </div>
  )
  const rowH = 52
  return (
    <ManHS nenAnh="bxh">
      {art ? (
        // Header gọn kiểu game: ‹ · huy hiệu · tên màn (trái) — 3 dropdown (phải, cùng hàng ở màn rộng)
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex min-w-0 items-center gap-2.5">
            {onBack && <button onClick={onBack} aria-label="Quay lại" className="flex h-11 w-11 shrink-0 items-center justify-center text-[22px] font-bold active:scale-95" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius-pill)', border: `2px solid ${MAU.acc}`, color: MAU.acc }}>‹</button>}
            <img src={art.huyHieu} alt="" draggable={false} className="h-12 w-12 shrink-0 object-contain md:h-16 md:w-16" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[22px] font-extrabold md:text-[26px]" style={HEAD}>Bảng xếp hạng</span>
              {mon && <span className="block text-[12px]" style={{ color: MAU.muted }}>{mon}</span>}
            </span>
          </div>
          <div className="w-full md:ml-auto md:w-[min(640px,58%)]">{locBang}</div>
        </div>
      ) : (
        <>
          <DauTrangHS tieuDe="Bảng xếp hạng" onBack={onBack} theoMon />
          {locBang}
        </>
      )}

      {loi && <TrongHS><span style={{ color: MAU.sai }}>{loi}</span></TrongHS>}
      {!loi && cur && !cur.san_sang && <TrongHS>{cur.ghi_chu ?? 'Sắp có'} — bảng này sẽ mở sớm.</TrongHS>}
      {!loi && cur?.san_sang && dangTai && !kq && <TrongHS>Đang tải…</TrongHS>}

      {!loi && kq && kq.san_sang && (
        <>
          {/* Hạng riêng tư của em — 1 dải */}
          <Dai art={art}>
            {art
              ? <span className="ml-3 flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full px-1.5 text-[15px] font-black tabular-nums" style={{ background: 'rgba(17,23,47,0.85)', border: `2px solid ${MAU.acc}`, color: MAU.acc }} aria-hidden>{kq.toi ? `#${kq.toi.hang}` : '–'}</span>
              : <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full px-1.5 text-[14px] font-black tabular-nums" style={{ background: MAU.acc, color: MAU.accInk }} aria-hidden>{kq.toi ? `#${kq.toi.hang}` : '–'}</span>}
            <span className="min-w-0 flex-1 text-[13.5px] font-bold leading-tight">
              {kq.toi
                ? <>Em hạng {kq.toi.hang}/{kq.tong}{pv === 'khoi' && kq.khoi ? ` khối ${kq.khoi}` : ' toàn BK'} · <span style={{ color: MAU.acc }}>{so(kq.toi.gia_tri, dv)}</span> <span className="font-medium" style={{ color: MAU.muted }}>· chỉ mình em thấy</span></>
                : <span className="font-semibold">Em chưa có hạng — làm vài lượt luyện để có tên trong bảng.</span>}
            </span>
            {art && !kq.toi && <img src={art.trong} alt="" draggable={false} className="hidden h-[52px] shrink-0 object-contain sm:block" />}
            <label className="mr-3 flex shrink-0 cursor-pointer items-center gap-1 text-[11.5px]" style={{ color: MAU.muted }}>
              <input type="checkbox" checked={hienMa} onChange={(e) => onHienMa(e.target.checked)} /> Mã HS
            </label>
          </Dai>

          {/* Danh sách — chiếm phần lớn màn; ngang: 2 cột 1–10 | 11–20 */}
          <div style={art ? undefined : THE} className={art ? '' : 'p-1.5'}>
            {kq.top.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
                {art && <img src={art.trong} alt="" draggable={false} className="max-h-[220px] max-w-[300px] object-contain" />}
                <p className="text-[13px]" style={{ color: MAU.muted }}>Chưa có bạn nào có dữ liệu ở bảng này.</p>
              </div>
            ) : (
              <ol className="grid grid-cols-[minmax(0,1fr)] gap-x-3 gap-y-[3px] md:grid-flow-col md:grid-cols-2" style={{ gridTemplateRows: `repeat(${Math.ceil(kq.top.length / 2)}, minmax(0, auto))` }}>
                {kq.top.map((r) => (
                  <li key={r.hang} className="flex min-w-0 items-center gap-2"
                    style={art
                      ? { minHeight: rowH, ...kieuKhung(r.la_toi ? art.khungHangEm : art.khungHang, rowH, { background: 'rgba(17,23,47,0.4)', borderRadius: 12 }), paddingInline: 4 }
                      : { minHeight: 46, padding: '4px 8px', ...(r.la_toi ? { background: MAU.surface2, border: `1.5px solid ${MAU.acc}`, borderRadius: 'calc(var(--sk-radius) * 0.7)' } : { borderBottom: `1px solid ${MAU.line}` }) }}>
                    <HangHuy hang={r.hang} art={art} />
                    <span className="min-w-0 flex-1 truncate text-[14.5px] font-bold leading-tight">{hienMa ? (r.ma_hs ?? '—') : r.ten}{r.la_toi ? ' (em)' : ''}</span>
                    {r.lop && <span className="w-12 shrink-0 text-center text-[12px] leading-tight sm:w-16" style={{ color: MAU.muted }}>{r.lop}</span>}
                    <b className="w-[74px] shrink-0 text-right text-[14px] tabular-nums sm:w-[90px]" style={{ color: MAU.acc }}>{so(r.gia_tri, dv)}</b>
                  </li>
                ))}
              </ol>
            )}
          </div>
          {mon && cur?.gan_mon && <p className="text-center text-[11px]" style={{ color: MAU.muted }}>Bảng theo môn {mon} · hiện 20 bạn đứng đầu</p>}
        </>
      )}
    </ManHS>
  )
}

export default function BangXepHangHS({ onBack }: { onBack: () => void }) {
  const monCtx = useMonHS()
  const [mon, setMon] = useState<string | null>(monCtx)
  const [dm, setDm] = useState<BxhLoai[]>([])
  const [loai, setLoai] = useState('A1')
  const [pv, setPv] = useState<BxhPhamVi>('khoi')
  const [ky, setKy] = useState<BxhKy>('thang')
  const [kq, setKq] = useState<BxhKetQua | null>(null)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [hienMa, setHienMa] = useState(false)

  useEffect(() => { if (monCtx) setMon(monCtx); else monCuaHS().then((m) => setMon(m)).catch(() => undefined) }, [monCtx])
  useEffect(() => { bxhDanhMuc().then((d) => { setDm(d); if (d.length && !d.some((x) => x.ma === 'A1')) setLoai(d[0].ma) }).catch((e) => setLoi(e?.message ?? String(e))) }, [])

  const doiLoai = (m: string) => { const d = dm.find((x) => x.ma === m); setLoai(m); if (d) setKy(d.ky_cho_phep.includes(ky) ? ky : d.ky_mac_dinh); setKq(null) }
  // Đổi ngữ cảnh (bảng / phạm vi / kỳ / môn) ⇒ xoá kết quả cũ rồi tải lại (khác "mutation cùng ngữ cảnh" ở CLAUDE §2)
  useEffect(() => {
    const d = dm.find((x) => x.ma === loai)
    if (!d || !d.san_sang || !mon) { setKq(null); return }
    let bo = false
    setDangTai(true); setLoi(null); setKq(null)
    bxhXem(loai, mon, pv, d.ky_cho_phep.includes(ky) ? ky : d.ky_mac_dinh)
      .then((r) => { if (!bo) setKq(r) })
      .catch((e) => { if (!bo) setLoi(e?.message ?? String(e)) })
      .finally(() => { if (!bo) setDangTai(false) })
    return () => { bo = true }
  }, [dm, loai, pv, ky, mon])

  return <BangXepHangView dm={dm} loai={loai} onLoai={doiLoai} pv={pv} onPv={setPv} ky={ky} onKy={setKy} kq={kq} dangTai={dangTai} loi={loi} hienMa={hienMa} onHienMa={setHienMa} mon={mon} onBack={onBack} />
}
