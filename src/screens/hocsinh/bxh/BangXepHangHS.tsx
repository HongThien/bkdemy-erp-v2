// ============================================================================
// BangXepHangHS — màn BẢNG XẾP HẠNG (Thùy duyệt 06/10; spec-bang-xep-hang.md §0). UI chốt 07/10: header GỌN + đúng 3 bộ lọc dạng dropdown
// (Bảng · Khối mình/Toàn BK · Tuần/Tháng) + 1 dải hạng riêng tư + DANH SÁCH chiếm phần lớn màn (ngang: 2 cột 1–10 | 11–20). Không phân nhóm.
// Hạng của CHÍNH em chỉ máy chủ trả cho người gọi. Theo MÔN đang chọn; bảng không gắn môn hiện ở mọi môn. Mọi số do fn_bxh tính — ở đây chỉ vẽ.
// Tách VIEW (BangXepHangView — chỉ vẽ) khỏi container để hs.html?xem=gami vẽ bằng dữ liệu giả. Chữ gốc FORMAL.
// Đồ hoạ chibi (khung hàng, huy chương, tiêu đề, icon từng bảng): đang vẽ code + emoji; bộ ảnh thật ở design/DON-HANG-SKIN-HS.md Đơn 15.
// ============================================================================
import { useEffect, useRef, useState } from 'react'
import { bxhDanhMuc, bxhXem, type BxhKetQua, type BxhKy, type BxhLoai, type BxhPhamVi } from '../../../lib/bxh'
import { monCuaHS } from '../../../lib/tuluyen'
import { DauTrangHS, MAU, HEAD, ManHS, THE, THE_TRON, TrongHS, useMonHS } from '../skin/KhungHS'

const TEN_KY: Record<BxhKy, string> = { tuan: 'Tuần này', thang: 'Tháng này', mua: 'Cả mùa', hien_tai: 'Hiện tại' }
const TEN_PV: Record<BxhPhamVi, string> = { khoi: 'Khối mình', toan_bk: 'Toàn BK' }
const HUY_CHUONG = ['🥇', '🥈', '🥉']
const KHIEN = 'polygon(50% 0, 100% 14%, 100% 64%, 50% 100%, 0 64%, 0 14%)'
const so = (v: number, dv: string) => (dv === '%' ? `${Number(v)}%` : `${Number(v).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} ${dv}`)

type TuyChon<T extends string> = { v: T; ten: string; phu?: string; tat?: boolean }

// Ô CHỌN dạng dropdown: nhãn nhỏ + giá trị + tam giác ▾ báo "còn lựa chọn khác". Chỉ 1 lựa chọn ⇒ không mũi tên, không mở.
function Chon<T extends string>({ nhan, v, ds, onChon }: { nhan: string; v: T; ds: TuyChon<T>[]; onChon: (v: T) => void }) {
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
  return (
    <div ref={ref} className="relative min-w-0">
      <button type="button" disabled={!nhieu} onClick={() => setMo((x) => !x)} aria-haspopup="listbox" aria-expanded={mo}
        className="flex h-[50px] w-full items-center gap-1 px-2.5 text-left transition active:scale-[0.99] sm:gap-1.5 sm:px-3"
        style={{ ...THE_TRON, border: `1.5px solid ${mo ? MAU.acc : MAU.line}` }}>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[10px] font-bold uppercase leading-none tracking-[0.06em]" style={{ color: MAU.muted }}>{nhan}</span>
          <span className="mt-1 block truncate text-[14px] font-extrabold leading-tight" style={HEAD}>{cur?.ten ?? '—'}</span>
        </span>
        {nhieu && (
          <svg viewBox="0 0 12 8" className="h-2.5 w-3.5 shrink-0 transition-transform" style={{ transform: mo ? 'rotate(180deg)' : undefined, color: MAU.acc }} aria-hidden>
            <path d="M1 1.2h10L6 7z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {mo && (
        <ul role="listbox" className="absolute left-0 top-full z-40 mt-1 max-h-[60vh] w-max min-w-full max-w-[88vw] overflow-auto p-1"
          style={{ background: MAU.bg, border: `1.5px solid ${MAU.acc}`, borderRadius: 'var(--sk-radius)', boxShadow: '0 10px 28px rgba(0,0,0,.45)' }}>
          {ds.map((o) => (
            <li key={o.v} role="option" aria-selected={o.v === v} aria-disabled={o.tat}>
              <button type="button" disabled={o.tat} onClick={() => { onChon(o.v); setMo(false) }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left"
                style={{ borderRadius: 'calc(var(--sk-radius) * 0.6)', opacity: o.tat ? 0.55 : 1, background: o.v === v ? MAU.surface2 : 'transparent' }}>
                <span className="w-4 shrink-0 text-center text-[13px] font-black" style={{ color: MAU.acc }}>{o.v === v ? '✓' : ''}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold leading-tight">{o.ten}</span>
                  {o.phu && <span className="block text-[11.5px] leading-snug" style={{ color: MAU.muted }}>{o.phu}</span>}
                </span>
                {o.tat && <span className="shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold" style={{ border: `1px solid ${MAU.line}`, color: MAU.muted }}>Sắp có</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Huy hiệu hạng: top 3 = huy chương; còn lại = khiên số
function HangHuy({ hang }: { hang: number }) {
  if (hang <= 3) return <span className="flex w-9 shrink-0 justify-center text-[22px] leading-none" aria-label={`Hạng ${hang}`}>{HUY_CHUONG[hang - 1]}</span>
  return (
    <span className="flex h-[34px] w-9 shrink-0 items-center justify-center pb-1 text-[13px] font-black tabular-nums"
      style={{ background: MAU.surface2, color: MAU.ink, clipPath: KHIEN }} aria-label={`Hạng ${hang}`}>{hang}</span>
  )
}

export function BangXepHangView({ dm, loai, onLoai, pv, onPv, ky, onKy, kq, dangTai, loi, hienMa, onHienMa, mon, onBack }: {
  dm: BxhLoai[]; loai: string; onLoai: (m: string) => void; pv: BxhPhamVi; onPv: (p: BxhPhamVi) => void; ky: BxhKy; onKy: (k: BxhKy) => void
  kq: BxhKetQua | null; dangTai: boolean; loi: string | null; hienMa: boolean; onHienMa: (b: boolean) => void; mon: string | null; onBack?: () => void
}) {
  const cur = dm.find((d) => d.ma === loai)
  const dsLoai: TuyChon<string>[] = dm.map((d) => ({ v: d.ma, ten: d.ten, phu: d.san_sang ? `${d.mo_ta}${d.gan_mon ? '' : ' · mọi môn'}` : undefined, tat: !d.san_sang }))
  const dsPv: TuyChon<BxhPhamVi>[] = (['khoi', 'toan_bk'] as BxhPhamVi[]).map((p) => ({ v: p, ten: TEN_PV[p] }))
  const dsKy: TuyChon<BxhKy>[] = (cur?.ky_cho_phep ?? [ky]).map((k) => ({ v: k, ten: TEN_KY[k] }))
  const dv = kq && kq.san_sang ? kq.don_vi : cur?.don_vi ?? ''
  return (
    <ManHS>
      <DauTrangHS tieuDe="Bảng xếp hạng" onBack={onBack} theoMon />

      {/* 3 bộ lọc — 1 hàng gọn: loại bảng · Khối/Toàn BK · thời gian */}
      <div className="grid grid-cols-[1.25fr_1fr_1fr] gap-1.5 sm:grid-cols-[1.5fr_1fr_1fr] sm:gap-2">
        <Chon nhan="Bảng" v={loai} ds={dsLoai} onChon={onLoai} />
        <Chon nhan="Phạm vi" v={pv} ds={dsPv} onChon={onPv} />
        <Chon nhan="Thời gian" v={ky} ds={dsKy} onChon={onKy} />
      </div>

      {loi && <TrongHS><span style={{ color: MAU.sai }}>{loi}</span></TrongHS>}
      {!loi && cur && !cur.san_sang && <TrongHS>{cur.ghi_chu ?? 'Sắp có'} — bảng này sẽ mở sớm.</TrongHS>}
      {!loi && cur?.san_sang && dangTai && !kq && <TrongHS>Đang tải…</TrongHS>}

      {!loi && kq && kq.san_sang && (
        <>
          {/* Hạng riêng tư của em — 1 dải mỏng */}
          <div className="flex items-center gap-2.5 px-3 py-2" style={{ ...THE, boxShadow: '0 0 10px var(--sk-acc)' }}>
            <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full px-1.5 text-[14px] font-black tabular-nums" style={{ background: MAU.acc, color: MAU.accInk }} aria-hidden>{kq.toi ? `#${kq.toi.hang}` : '–'}</span>
            <span className="min-w-0 flex-1 text-[13.5px] font-bold leading-tight">
              {kq.toi
                ? <>Em hạng {kq.toi.hang}/{kq.tong}{pv === 'khoi' && kq.khoi ? ` khối ${kq.khoi}` : ' toàn BK'} · <span style={{ color: MAU.acc }}>{so(kq.toi.gia_tri, dv)}</span> <span className="font-medium" style={{ color: MAU.muted }}>· chỉ mình em thấy</span></>
                : <span className="font-semibold">Em chưa có hạng — làm vài lượt luyện để có tên trong bảng.</span>}
            </span>
            <label className="flex shrink-0 cursor-pointer items-center gap-1 text-[11.5px]" style={{ color: MAU.muted }}>
              <input type="checkbox" checked={hienMa} onChange={(e) => onHienMa(e.target.checked)} /> Mã HS
            </label>
          </div>

          {/* Danh sách — chiếm phần lớn màn; ngang: 2 cột 1–10 | 11–20 */}
          <div style={THE} className="p-1.5">
            {kq.top.length === 0 ? <p className="px-3 py-8 text-center text-[13px]" style={{ color: MAU.muted }}>Chưa có bạn nào có dữ liệu ở bảng này.</p> : (
              <ol className="grid gap-x-3 gap-y-0.5 md:grid-flow-col md:grid-cols-2" style={{ gridTemplateRows: `repeat(${Math.ceil(kq.top.length / 2)}, minmax(0, auto))` }}>
                {kq.top.map((r) => (
                  <li key={r.hang} className="flex min-h-[46px] items-center gap-2 px-2 py-1"
                    style={r.la_toi ? { background: MAU.surface2, border: `1.5px solid ${MAU.acc}`, borderRadius: 'calc(var(--sk-radius) * 0.7)' } : { borderBottom: `1px solid ${MAU.line}` }}>
                    <HangHuy hang={r.hang} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-bold leading-tight">{hienMa ? (r.ma_hs ?? '—') : r.ten}{r.la_toi ? ' (em)' : ''}</span>
                      {r.lop && <span className="block text-[11px] leading-tight" style={{ color: MAU.muted }}>{r.lop}</span>}
                    </span>
                    <b className="shrink-0 text-[13.5px] tabular-nums" style={{ color: MAU.acc }}>{so(r.gia_tri, dv)}</b>
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
