// ============================================================================
// BangXepHangHS — màn BẢNG XẾP HẠNG (Thùy duyệt 06/10; spec-bang-xep-hang.md §0). Chọn bảng (nhóm → bảng) → phạm vi (Khối mình · Toàn BK) → kỳ → top 20.
// Hạng của CHÍNH em hiện riêng tư (chỉ máy chủ trả cho người gọi). Theo MÔN đang chọn; bảng không gắn môn hiện ở mọi môn. Mọi số do fn_bxh tính — ở đây chỉ vẽ.
// Tách VIEW (BangXepHangView — chỉ vẽ) khỏi container để hs.html?xem=gami vẽ bằng dữ liệu giả. Chữ gốc FORMAL.
// ============================================================================
import { useEffect, useState, type ReactNode } from 'react'
import { bxhDanhMuc, bxhXem, type BxhKetQua, type BxhKy, type BxhLoai, type BxhNhom, type BxhPhamVi } from '../../../lib/bxh'
import { monCuaHS } from '../../../lib/tuluyen'
import { DauTrangHS, MAU, HEAD, ManHS, NhomHS, TheHS, TrongHS, useMonHS } from '../skin/KhungHS'

const TEN_NHOM: Record<BxhNhom, string> = { hoc_tap: 'Học tập', ket_qua_lop: 'Kết quả ở lớp', game: 'Game', suu_tap: 'Sưu tập' }
const TEN_KY: Record<BxhKy, string> = { tuan: 'Tuần này', thang: 'Tháng này', mua: 'Cả mùa', hien_tai: 'Hiện tại' }
const HUY_CHUONG = ['🥇', '🥈', '🥉']
const so = (v: number, dv: string) => (dv === '%' ? `${Number(v)}%` : `${Number(v).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} ${dv}`)

function Chip({ on, children, onClick, tat }: { on: boolean; children: ReactNode; onClick: () => void; tat?: boolean }) {
  return (
    <button onClick={onClick} className="min-h-[36px] px-3 py-1 text-[13px] font-bold transition active:scale-[0.97]"
      style={on ? { background: MAU.acc, color: MAU.accInk, borderRadius: 'var(--sk-radius-pill)' }
        : { background: MAU.surface2, color: tat ? MAU.muted : MAU.ink, border: `1px solid ${MAU.line}`, borderRadius: 'var(--sk-radius-pill)', opacity: tat ? 0.6 : 1 }}>
      {children}
    </button>
  )
}

export function BangXepHangView({ dm, loai, onLoai, pv, onPv, ky, onKy, kq, dangTai, loi, hienMa, onHienMa, mon, onBack }: {
  dm: BxhLoai[]; loai: string; onLoai: (m: string) => void; pv: BxhPhamVi; onPv: (p: BxhPhamVi) => void; ky: BxhKy; onKy: (k: BxhKy) => void
  kq: BxhKetQua | null; dangTai: boolean; loi: string | null; hienMa: boolean; onHienMa: (b: boolean) => void; mon: string | null; onBack?: () => void
}) {
  const cur = dm.find((d) => d.ma === loai)
  const nhoms = (['hoc_tap', 'ket_qua_lop', 'game', 'suu_tap'] as BxhNhom[]).filter((n) => dm.some((d) => d.nhom === n))
  return (
    <ManHS>
      <DauTrangHS tieuDe="Bảng xếp hạng" phu={mon ?? undefined} onBack={onBack} theoMon />
      <p className="text-[12.5px] leading-snug" style={{ color: MAU.muted }}>Chỉ mình em thấy thứ hạng của chính em. Danh sách hiện 20 bạn đứng đầu.</p>

      {nhoms.map((n) => (
        <div key={n} className="flex flex-col gap-1.5">
          <NhomHS>{TEN_NHOM[n]}</NhomHS>
          <div className="flex flex-wrap gap-1.5">
            {dm.filter((d) => d.nhom === n).map((d) => <Chip key={d.ma} on={d.ma === loai} tat={!d.san_sang} onClick={() => onLoai(d.ma)}>{d.ten}{!d.san_sang ? ' · sắp có' : ''}</Chip>)}
          </div>
        </div>
      ))}

      {cur && (
        <TheHS className="flex flex-col gap-2.5 p-3.5">
          <div>
            <p className="text-[18px] font-extrabold leading-tight" style={HEAD}>{cur.ten}</p>
            <p className="mt-0.5 text-[12.5px] leading-snug" style={{ color: MAU.muted }}>{cur.mo_ta}{cur.gan_mon && mon ? ` · môn ${mon}` : cur.gan_mon ? '' : ' · mọi môn'}</p>
          </div>
          {cur.san_sang && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Chip on={pv === 'khoi'} onClick={() => onPv('khoi')}>Khối mình</Chip>
              <Chip on={pv === 'toan_bk'} onClick={() => onPv('toan_bk')}>Toàn BK</Chip>
              {cur.ky_cho_phep.length > 1 && <span className="mx-1 h-5 w-px" style={{ background: MAU.line }} />}
              {cur.ky_cho_phep.length > 1 && cur.ky_cho_phep.map((k) => <Chip key={k} on={ky === k} onClick={() => onKy(k)}>{TEN_KY[k]}</Chip>)}
            </div>
          )}
        </TheHS>
      )}

      {loi && <TrongHS><span style={{ color: MAU.sai }}>{loi}</span></TrongHS>}
      {!loi && cur && !cur.san_sang && <TrongHS>{cur.ghi_chu ?? 'Sắp có'} — bảng này sẽ mở sớm.</TrongHS>}
      {!loi && cur?.san_sang && dangTai && !kq && <TrongHS>Đang tải…</TrongHS>}

      {!loi && kq && kq.san_sang && (
        <>
          <TheHS className="flex items-center gap-3 px-4 py-3" style={{ boxShadow: '0 0 12px var(--sk-acc)' }}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[18px] font-black" style={{ background: MAU.acc, color: MAU.accInk }} aria-hidden>
              {kq.toi ? `#${kq.toi.hang}` : '–'}
            </span>
            <span className="min-w-0 flex-1">
              {kq.toi ? (
                <>
                  <span className="block text-[15px] font-bold leading-tight">Em đứng hạng {kq.toi.hang}/{kq.tong}{pv === 'khoi' && kq.khoi ? ` khối ${kq.khoi}` : ' toàn BK'}</span>
                  <span className="block text-[12.5px]" style={{ color: MAU.muted }}>{so(kq.toi.gia_tri, kq.don_vi)} · chỉ mình em thấy</span>
                </>
              ) : (
                <span className="block text-[14px] font-semibold leading-snug">Em chưa có hạng ở bảng này — làm vài lượt luyện để có mặt trong bảng.</span>
              )}
            </span>
          </TheHS>

          <TheHS className="p-2.5">
            <div className="mb-1 flex items-center justify-between px-1.5">
              <NhomHS>Top {Math.min(20, kq.top.length)}{kq.tong > 20 ? ` / ${kq.tong} bạn` : ''}</NhomHS>
              <label className="flex cursor-pointer items-center gap-1.5 text-[12px]" style={{ color: MAU.muted }}>
                <input type="checkbox" checked={hienMa} onChange={(e) => onHienMa(e.target.checked)} /> Hiện mã HS
              </label>
            </div>
            {kq.top.length === 0 ? <p className="px-3 py-5 text-center text-[13px]" style={{ color: MAU.muted }}>Chưa có bạn nào có dữ liệu ở bảng này.</p> : (
              <ol className="flex flex-col gap-1">
                {kq.top.map((r) => (
                  <li key={r.hang} className="flex items-center gap-2.5 px-2.5 py-2"
                    style={r.la_toi ? { background: MAU.surface2, border: `1.5px solid ${MAU.acc}`, borderRadius: 'calc(var(--sk-radius) * 0.75)' } : { borderBottom: `1px solid ${MAU.line}` }}>
                    <span className="w-8 shrink-0 text-center text-[15px] font-black tabular-nums">{r.hang <= 3 ? HUY_CHUONG[r.hang - 1] : r.hang}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-bold leading-tight">{hienMa ? (r.ma_hs ?? '—') : r.ten}{r.la_toi ? ' (em)' : ''}</span>
                      {r.lop && <span className="block text-[11.5px]" style={{ color: MAU.muted }}>{r.lop}</span>}
                    </span>
                    <b className="shrink-0 text-[14px] tabular-nums" style={{ color: MAU.acc }}>{so(r.gia_tri, kq.don_vi)}</b>
                  </li>
                ))}
              </ol>
            )}
          </TheHS>
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

  const doiLoai = (m: string) => { const d = dm.find((x) => x.ma === m); setLoai(m); if (d) setKy(d.ky_mac_dinh); setKq(null) }
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
