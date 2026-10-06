// ============================================================================
// MayManHS — Vòng quay may mắn cho HS cấp 2 (Thùy 11/09).
// Thùy 29/09: khung theo skin (KhungHS) — vòng quay đặt trong thẻ skin để nổi trên nền.
// Server quyết giải (fn_may_man_hs_quay) — client CHỈ chạy animation tới ô server trả về.
// Điều kiện + giải do server quyết theo che_do (lib/maymai_hs.ts): cũ = tự luyện ≥70% · 50/100/150/200;
// mới (từ 01/10/2026) = xong ≥2 nhiệm vụ ngày · 20/30/50/100/200, EXP đổi ra xu. Tối đa 1 lượt/ngày.
// ============================================================================
import { useEffect, useRef, useState } from 'react'
import { mayManHSCuaToi, mayManHSQuay, type MayManHSCuaToi, type MayManHSKetQua } from '../../lib/maymai_hs'
import { ManHS, DauTrangHS, NutHS, NhomHS, MAU, THE, THE_TRON, HEAD } from './skin/KhungHS'

// Thùy 29/09: khung/màu theo STYLE (skin) em chọn — bỏ nền mây, chồng sách, khẩu hiệu, màu theo giới tính.
// Màu các ô vòng quay là màu GAME (cố định mọi skin) ⇒ chữ trên ô luôn tối để đọc được.
const CHU_O = '#16224D'

// 4 ô theo chiều kim đồng hồ, ô đầu ở đỉnh dưới mũi kim. 2 giải hiếm (200/150) đối diện 2 giải
// phổ biến (50/100) để bánh xe cân đối; server chỉ trả `exp`, client tìm index tương ứng.
type O = { exp: number; mau: string; icon: string; nhan: string }
const O_CU: O[] = [
  { exp: 100, mau: '#BFE0FF', icon: '🎁', nhan: '100 EXP' },
  { exp: 200, mau: '#FFD1E1', icon: '💎', nhan: '200 EXP' },
  { exp: 50,  mau: '#FFEAA5', icon: '⭐', nhan: '50 EXP'  },
  { exp: 150, mau: '#D6C8FF', icon: '🎉', nhan: '150 EXP' },
]
// Luật nhiệm vụ (06/10): 6 ô 10/20/30/50/100/200 — giải hiếm 200 và 100 xen giữa các ô phổ biến.
const O_MOI: O[] = [
  { exp: 10,  mau: '#C9F2D5', icon: '🍭', nhan: '10 EXP' },
  { exp: 200, mau: O_CU[1].mau, icon: '💎', nhan: '200 EXP' },
  { exp: 20,  mau: O_CU[2].mau, icon: '⭐', nhan: '20 EXP' },
  { exp: 100, mau: O_CU[3].mau, icon: '🎉', nhan: '100 EXP' },
  { exp: 30,  mau: O_CU[0].mau, icon: '🎁', nhan: '30 EXP' },
  { exp: 50,  mau: O_CU[1].mau, icon: '🍀', nhan: '50 EXP' },
]

function Wheel({ goc, size, O_LIST }: { goc: number; size: number; O_LIST: O[] }) {
  const n = O_LIST.length, g = 360 / n
  const bg = `conic-gradient(from ${-g / 2}deg, ${O_LIST.map((o, i) => `${o.mau} ${i * g}deg ${(i + 1) * g}deg`).join(', ')})`
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* Kim (SVG) chỉ xuống đỉnh bánh xe */}
      <svg viewBox="0 0 48 64" className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 drop-shadow-md" style={{ top: -size * 0.06, width: size * 0.16 }} aria-hidden>
        <path d="M24 62C24 62 4 38 4 22a20 20 0 0 1 40 0c0 16-20 40-20 40z" fill="#FF5D8A" stroke="#C4325E" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 60C24 60 8 38 8 22a16 16 0 0 1 32 0c0 16-16 38-16 38z" fill="#FF7FA8" />
        <circle cx="24" cy="22" r="9" fill="#fff" stroke="#C4325E" strokeWidth="2" />
        <circle cx="21" cy="19" r="2.5" fill="#FFD6E4" />
      </svg>
      {/* Đĩa quay — viền vàng + 4 ô conic + tâm cỏ 4 lá */}
      <div className="h-full w-full rounded-full p-[6px] shadow-[0_8px_24px_rgba(22,34,77,.18)]"
        style={{ background: 'radial-gradient(circle at 50% 30%, #FFE59A, #F5B63A 70%, #D9962A)', transform: `rotate(${goc}deg)`, transition: 'transform 4.2s cubic-bezier(.17,.67,.12,1)' }}>
        <div className="relative h-full w-full rounded-full ring-[3px] ring-white/70" style={{ background: bg }}>
          {O_LIST.map((o, i) => {
            const a = i * g
            const r = size * 0.30
            return (
              <div key={i} className="absolute left-1/2 top-1/2 flex flex-col items-center text-center"
                style={{ width: size * 0.3, transform: `translate(-50%,-50%) rotate(${a}deg) translateY(-${r}px) rotate(${-a}deg)` }}>
                <span className="mb-0.5 text-[26px] leading-none">{o.icon}</span>
                <span className="whitespace-nowrap font-extrabold leading-none" style={{ fontSize: size * 0.045, color: CHU_O }}>{o.nhan}</span>
              </div>
            )
          })}
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-[3px] ring-[#FFE59A]" style={{ width: size * 0.22, height: size * 0.22 }}>
            <span className="text-[28px]">🍀</span>
          </span>
        </div>
      </div>
    </div>
  )
}

const luc = (iso: string) => {
  const ph = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  return ph < 1 ? 'vừa xong' : ph < 60 ? `${ph} phút trước` : ph < 1440 ? `${Math.floor(ph / 60)} giờ trước` : `${Math.floor(ph / 1440)} ngày trước`
}

export default function MayManHS({ onXong, onNhiemVu }: { gioiTinh: 'nam' | 'nu' | null; onXong: () => void; onNhiemVu?: () => void }) {
  const [d, setD] = useState<MayManHSCuaToi | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [goc, setGoc] = useState(0)
  const [dangQuay, setDangQuay] = useState(false)
  const [kq, setKq] = useState<MayManHSKetQua | null>(null)
  const vong = useRef(0)

  const O_LIST = d?.che_do === 'nhiem_vu' ? O_MOI : O_CU
  const oCua = (exp: number) => O_LIST.findIndex((o) => o.exp === exp)
  const load = () => mayManHSCuaToi().then(setD).catch((e) => setErr(e?.message ?? String(e)))
  useEffect(() => { load() }, [])

  async function quay() {
    if (dangQuay || !d || d.hom_nay || !d.du_dieu_kien.du || !d.active) return
    setDangQuay(true); setErr(null)
    try {
      const r = await mayManHSQuay()
      const idx = Math.max(0, oCua(r.exp))
      vong.current += 5
      setGoc(vong.current * 360 - idx * (360 / O_LIST.length))  // ô i ở góc i·g → xoay -i·g để kim trỏ vào ô i
      setTimeout(() => { setKq(r); setDangQuay(false); load() }, 4400)
    } catch (e: any) { setErr(e?.message ?? String(e)); setDangQuay(false) }
  }

  const daQuay = !!d?.hom_nay
  const du = !!d?.du_dieu_kien.du
  const conLuot = d ? !daQuay && du && d.active : false

  return (
    <ManHS>
      <DauTrangHS tieuDe="May mắn hôm nay" onBack={onXong}
        phu={d?.che_do === 'nhiem_vu' ? 'Mỗi ngày 1 lượt — có 1 lượt Luyện dạng yếu đạt để mở khoá' : 'Mỗi ngày 1 lượt — luyện chăm để mở khoá'} />

      {/* Trạng thái điều kiện — pill mềm (màu ngữ nghĩa: đủ = xanh, chưa = cam) */}
      <div className="px-3.5 py-2.5" style={{ ...THE_TRON, background: du ? 'rgba(34,160,107,0.16)' : 'rgba(224,144,30,0.16)', border: `1.5px solid ${du ? MAU.dung : MAU.canhBao}` }}>
        {!d ? <p className="text-[12px] font-semibold" style={{ color: MAU.muted }}>Đang tải…</p>
          : d.che_do === 'nhiem_vu' ? (
            <div className="flex items-center gap-2">
              <p className="min-w-0 flex-1 text-[12.5px] font-extrabold" style={{ color: du ? MAU.dung : MAU.canhBao }}>
                {du ? `✓ Hôm nay em đã có ${d.du_dieu_kien.so_nv} lượt Luyện dạng yếu đạt${daQuay ? ' · đã quay hôm nay' : ' · quay ngay!'}`
                    : '🎯 Làm 1 lượt Luyện dạng yếu đạt (đúng từ 7/10 câu) để mở khoá quay.'}
              </p>
              {onNhiemVu && <button onClick={onNhiemVu} className="shrink-0 rounded-full px-3 py-1 text-[12px] font-extrabold" style={{ background: MAU.acc, color: MAU.accInk }}>Nhiệm vụ →</button>}
            </div>
          ) : du ? (
            <p className="text-[12.5px] font-extrabold" style={{ color: MAU.dung }}>
              ✓ Đủ điều kiện — {d.du_dieu_kien.so_dung}/{d.du_dieu_kien.so_cau} câu đúng ({d.du_dieu_kien.mon})
              {daQuay ? ' · đã quay hôm nay' : ' · quay ngay!'}
            </p>
          ) : (
            <p className="text-[12.5px] font-extrabold" style={{ color: MAU.canhBao }}>
              🎯 Chưa đủ — làm 1 lượt tự luyện 10 câu đúng ≥{d.du_dieu_kien.nguong_pct ?? 70}% để mở khoá quay.
            </p>
          )}
      </div>

      {/* Thẻ trung tâm chứa vòng quay + nút */}
      <div className="p-5" style={THE}>
        <div className="relative flex items-center justify-center pt-2">
          <Wheel goc={goc} size={280} O_LIST={O_LIST} />
        </div>
        <NutHS tat={!conLuot || dangQuay} onClick={quay} className="mt-4 block w-full !h-12 !text-[16px]">
          {dangQuay ? 'Đang quay…' : daQuay ? 'Mai quay tiếp ♡' : conLuot ? 'Quay ngay ▶' : du ? 'Vòng quay tạm đóng' : 'Chưa đủ điều kiện'}
        </NutHS>
        {err && <p className="mt-2 rounded-2xl px-3 py-1.5 text-center text-[11.5px] font-semibold" style={{ background: 'rgba(229,72,77,0.16)', color: MAU.sai }}>⚠ {err}</p>}
      </div>

      {/* Bảng tỉ lệ — pill nhỏ theo màu ô vòng quay (màu game) */}
      {d && (
        <div className="p-3" style={THE}>
          <NhomHS>Cơ hội trúng thưởng</NhomHS>
          <div className="mt-1.5 grid gap-2" style={{ gridTemplateColumns: `repeat(${O_LIST.length}, minmax(0, 1fr))` }}>
            {O_LIST.slice().sort((a, b) => a.exp - b.exp).map((o) => {
              const pct = d.ti_le[`ti_le_${o.exp}`] ?? 0
              return (
                <div key={o.exp} className="rounded-[14px] p-2 text-center" style={{ background: o.mau }}>
                  <span className="text-[20px]">{o.icon}</span>
                  <p className="mt-0.5 text-[11.5px] font-extrabold leading-none" style={{ color: CHU_O }}>{o.exp} EXP</p>
                  <p className="mt-1 text-[10.5px] font-bold leading-none" style={{ color: CHU_O, opacity: .7 }}>{pct}%</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tổng tháng — dải màu nhấn của skin */}
      {d && (
        <div className="flex items-center justify-between px-4 py-3" style={{ ...THE, background: MAU.acc, color: MAU.accInk }}>
          <p className="text-[12.5px] font-bold" style={{ opacity: .85 }}>Tháng này em đã trúng</p>
          <p className="text-[24px] font-black" style={HEAD}>{d.exp_thang} EXP</p>
        </div>
      )}

      {/* Lịch sử quay gần đây */}
      {d && (
        <div className="p-3" style={THE}>
          <NhomHS>Lịch sử quay gần đây</NhomHS>
          {!d.lich_su.length ? (
            <p className="py-2 text-center text-[11.5px] font-semibold" style={{ color: MAU.muted }}>🍀 Chưa có lượt quay nào — mở hàng nhé!</p>
          ) : (
            <div className="mt-1.5 flex flex-col gap-1.5">
              {d.lich_su.map((l) => (
                <div key={l.created_at} className="flex items-center justify-between gap-2 rounded-[12px] px-2.5 py-1.5" style={{ background: MAU.surface2 }}>
                  <span className="text-[11.5px] font-extrabold" style={{ color: MAU.ink }}>{l.ngay}</span>
                  <span className="text-[11px] font-medium" style={{ color: MAU.muted }}>{luc(l.created_at)}</span>
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold" style={{ background: MAU.badge, color: MAU.badgeInk }}>+{l.exp} EXP</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sheet kết quả — bottom sheet trên nền tối (nền đặc --sk-bg để không trong suốt lên lớp đen) */}
      {kq && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6" onClick={() => setKq(null)}>
          <div className="w-full max-w-[430px] p-6 text-center" onClick={(e) => e.stopPropagation()} style={{ ...THE_TRON, background: MAU.bg }}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-[42px]" style={{ background: MAU.surface2 }}>
              {kq.exp >= 200 ? '💎' : kq.exp >= 150 ? '🎉' : kq.exp >= 100 ? '🎁' : '⭐'}
            </div>
            <p className="mt-3 text-[22px] font-extrabold" style={{ ...HEAD, color: MAU.ink }}>Chúc mừng!</p>
            <p className="text-[18px] font-black" style={{ color: MAU.acc }}>+{kq.exp} EXP May Mắn</p>
            <p className="mt-2 text-[12.5px]" style={{ color: MAU.muted }}>{d?.che_do === 'nhiem_vu' ? 'EXP này đã được đổi ra xu trong Ví (tối đa 10 xu mỗi tháng từ vòng quay). Mai luyện tiếp để quay nhé!' : 'Mai luyện tiếp để có thêm 1 lượt quay nhé!'}</p>
            <NutHS onClick={() => setKq(null)} className="mt-4 w-full">Tuyệt! ♡</NutHS>
          </div>
        </div>
      )}
    </ManHS>
  )
}
