// ============================================================================
// NhiemVuHS — màn NHIỆM VỤ của HS theo môn (Thùy chốt 06/10; spec-kinh-te-nhiem-vu.md §1–§9, mig 202610061915).
// Một điều kiện duy nhất: lượt LUYỆN DẠNG YẾU đạt (đúng ≥70%). Hôm nay (tối đa 4 lượt) · Tuần (2 nhiệm vụ) · Tháng (1 nhiệm vụ) · vòng quay.
// Mọi con số lấy nguyên từ fn_hs_nhiem_vu_cua_toi — ở đây chỉ trình bày. Chữ gốc FORMAL (không câu game cố định trong màn).
// Tách VIEW (NhiemVuView — chỉ vẽ từ 1 object) khỏi container để hs.html?xem=gami vẽ mọi trạng thái bằng dữ liệu giả.
// ============================================================================
import { useEffect, useState, type ReactNode } from 'react'
import { nhiemVuCuaToi, type NhiemVuCuaToi } from '../../lib/nhiemvu'
import { monCuaHS } from '../../lib/tuluyen'
import { Khung, NutBack } from './TuLuyenChuDe'
import { MAU, THE, HEAD } from './skin/KhungHS'
import { IconNV } from './gami/HinhGami'

const O_CON = { background: MAU.surface2, border: `1px solid ${MAU.line}`, borderRadius: 'calc(var(--sk-radius) * 0.75)' }
const sl = (n: number) => n.toLocaleString('vi-VN')

function Tick({ xong, size = 24 }: { xong: boolean; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full font-black" aria-label={xong ? 'Đã xong' : 'Chưa xong'}
      style={{ width: size, height: size, fontSize: size * 0.55, ...(xong ? { border: `2px solid ${MAU.dung}`, color: MAU.dung, boxShadow: `0 0 8px ${MAU.dung}` } : { border: `1.5px solid ${MAU.line}`, background: MAU.surface }) }}>
      {xong ? '✓' : ''}
    </span>
  )
}
// Thưởng của 1 nhiệm vụ: "+100 EXP · +50 ĐHT"
function Thuong({ exp, dht, nho }: { exp: number; dht: number; nho?: boolean }) {
  return (
    <span className="flex shrink-0 flex-col items-end font-extrabold leading-tight tabular-nums" style={{ fontSize: nho ? 12 : 13 }}>
      <span style={{ color: MAU.acc }}>+{exp} EXP</span>
      <span style={{ color: MAU.muted }}>+{dht} ĐHT</span>
    </span>
  )
}
function Thanh({ hien, can }: { hien: number; can: number }) {
  const pct = Math.min(100, Math.round((100 * hien) / Math.max(1, can)))
  return (
    <span className="mt-1.5 flex items-center gap-2">
      <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full" style={{ background: MAU.surface, border: `1px solid ${MAU.line}` }}>
        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: MAU.acc }} />
      </span>
      <span className="shrink-0 text-[11.5px] font-bold tabular-nums" style={{ color: MAU.muted }}>{Math.min(hien, can)}/{can}</span>
    </span>
  )
}
function Khoi({ icon, tieuDe, phai, children }: { icon: ReactNode; tieuDe: string; phai?: ReactNode; children: ReactNode }) {
  return (
    <section className="px-3 pb-3 pt-2.5" style={THE}>
      <div className="flex items-center gap-2.5 pb-2.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ border: `2px solid ${MAU.acc}`, background: MAU.surface2, boxShadow: '0 0 10px var(--sk-acc)' }}>{icon}</span>
        <h2 className="min-w-0 flex-1 truncate text-[19px] font-bold uppercase leading-tight tracking-[0.03em]" style={{ ...HEAD, textTransform: 'uppercase', color: MAU.acc }}>{tieuDe}</h2>
        {phai && <span className="shrink-0 text-right text-[12.5px] font-semibold leading-tight" style={{ color: MAU.muted }}>{phai}</span>}
      </div>
      <div style={{ color: MAU.ink }}>{children}</div>
    </section>
  )
}
function Dong({ ten, mota, xong, hien, can, exp, dht }: { ten: string; mota: string; xong: boolean; hien: number; can: number; exp: number; dht: number }) {
  return (
    <div className="mt-2 flex items-center gap-2.5 px-3 py-2.5 first:mt-0" style={O_CON}>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-bold leading-tight">{ten}</span>
        <span className="mt-0.5 block text-[12px] leading-snug" style={{ color: MAU.muted }}>{mota}</span>
        <Thanh hien={xong ? can : hien} can={can} />
      </span>
      <Thuong exp={exp} dht={dht} />
      <Tick xong={xong} />
    </div>
  )
}

const homNay = () => new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Ho_Chi_Minh' })

// ── VIEW: chỉ vẽ ──
export function NhiemVuView({ d, onLuyenYeu, onVongQuay }: { d: NhiemVuCuaToi; onLuyenYeu?: () => void; onVongQuay?: () => void }) {
  if (!d.mo) {
    return (
      <div className="mx-auto mt-10 flex w-full max-w-[420px] flex-col items-center px-5 py-6 text-center" style={{ ...THE, boxShadow: '0 0 22px var(--sk-acc)' }}>
        <span className="relative flex h-[120px] w-[120px] items-center justify-center">
          <IconNV ma="tuan" size={88} />
          <span aria-hidden className="absolute bottom-1 right-1 text-[30px]">🔒</span>
        </span>
        <p className="mt-3 text-[22px] font-bold leading-snug" style={{ ...HEAD, color: MAU.acc }}>
          Nhiệm vụ mở từ ngày {d.bat_dau.split('-').reverse().slice(0, 2).join('/')} — hẹn em nhé!
        </p>
      </div>
    )
  }
  const c = d.cau_hinh
  const nut = 'flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[14px] font-bold active:scale-[0.98]'
  const nayDay = d.ngay.luot_hom_nay >= c.lan_ngay
  const dht = d.dht

  const vi = (
    <section className="flex items-center gap-3 px-4 py-3" style={{ ...THE, boxShadow: '0 0 14px var(--sk-acc)' }}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[22px] font-black" style={{ background: MAU.acc, color: MAU.accInk }} aria-hidden>Đ</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: MAU.muted }}>Điểm học tập (ĐHT)</span>
        <span className="block text-[28px] font-black leading-none tabular-nums" style={{ ...HEAD, color: MAU.ink }}>{sl(dht.so_du)}<span className="text-[14px] font-bold" style={{ color: MAU.muted }}> / {sl(dht.tran)}</span></span>
        <span className="mt-1 block text-[11.5px] leading-snug" style={{ color: MAU.muted }}>Dùng để chơi game · tháng này +{sl(dht.kiem_thang)}{dht.mat_do_vuot_tran > 0 ? ` · đã đầy kho, ${sl(dht.mat_do_vuot_tran)} điểm không cộng thêm được` : ''}</span>
      </span>
      <span className="shrink-0 text-right text-[11.5px] leading-snug" style={{ color: MAU.muted }}>EXP nhiệm vụ tháng<br /><b className="text-[18px]" style={{ ...HEAD, color: MAU.acc }}>{sl(d.exp_thang)}</b><span>/{sl(c.tran_exp)}</span></span>
    </section>
  )

  const ngay = (
    <Khoi icon={<IconNV ma="ngay" size={22} />} tieuDe="Hôm nay" phai={<span className="first-letter:uppercase">{homNay()}</span>}>
      <div className="px-3 py-2.5" style={O_CON}>
        <div className="flex items-start gap-2.5">
          <span className="min-w-0 flex-1">
            <span className="block text-[14.5px] font-bold leading-tight">Luyện dạng yếu</span>
            <span className="mt-0.5 block text-[12px] leading-snug" style={{ color: MAU.muted }}>
              Mỗi lượt đúng từ {Math.round(c.dat_ti_le * 10)}/10 câu trở lên được thưởng · tối đa {c.lan_ngay} lượt mỗi ngày
            </span>
          </span>
          <Thuong exp={c.exp_luot} dht={c.dht_luot} />
        </div>
        <div className="mt-2.5 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${c.lan_ngay}, minmax(0, 1fr))` }}>
          {Array.from({ length: c.lan_ngay }, (_, i) => {
            const xong = i < d.ngay.luot_hom_nay
            return (
              <span key={i} className="flex h-9 items-center justify-center rounded-lg text-[13px] font-extrabold"
                style={xong ? { background: MAU.acc, color: MAU.accInk, boxShadow: '0 0 8px var(--sk-acc)' } : { background: MAU.surface, border: `1px dashed ${MAU.line}`, color: MAU.muted }}>
                {xong ? '✓' : i + 1}
              </span>
            )
          })}
        </div>
        <p className="mt-1.5 text-[12px] font-semibold" style={{ color: nayDay ? MAU.dung : MAU.muted }}>
          {nayDay ? 'Đã đủ thưởng hôm nay — luyện thêm vẫn tốt cho em nhé!' : `Hôm nay đã đạt ${d.ngay.luot_hom_nay}/${c.lan_ngay} lượt`}
        </p>
      </div>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {onLuyenYeu
          ? <button onClick={onLuyenYeu} className={nut} style={{ background: MAU.acc, color: MAU.accInk, boxShadow: '0 0 12px var(--sk-acc)' }}><IconNV ma="tu_luyen" size={20} /> Luyện dạng yếu ›</button>
          : <span />}
        <button onClick={onVongQuay} disabled={!onVongQuay || !d.vong_quay.du || d.vong_quay.da_quay} className={nut}
          style={d.vong_quay.du && !d.vong_quay.da_quay ? { background: MAU.acc, color: MAU.accInk, boxShadow: '0 0 12px var(--sk-acc)' } : { background: MAU.surface2, color: MAU.muted, border: `1px dashed ${MAU.line}` }}>
          <span className="shrink-0" style={{ opacity: d.vong_quay.du && !d.vong_quay.da_quay ? 1 : 0.5 }}><IconNV ma="vong_quay" size={22} /></span>
          <span className="text-[12.5px] leading-tight">{d.vong_quay.da_quay ? 'Hôm nay đã quay' : d.vong_quay.du ? 'Quay may mắn ›' : 'Có 1 lượt đạt để quay may mắn'}</span>
        </button>
      </div>
    </Khoi>
  )

  const tuan = (
    <Khoi icon={<IconNV ma="tuan" size={22} />} tieuDe="Nhiệm vụ tuần" phai={<b className="text-[16px]" style={{ ...HEAD, color: MAU.ink }}>Tuần {d.tuan_so}</b>}>
      <Dong ten="Chăm đều" mota={`Có lượt đạt ở ${c.w1_ngay} ngày khác nhau trong tuần`} xong={d.tuan.w1_xong} hien={d.tuan.ngay_co_luot} can={c.w1_ngay} exp={c.w1_exp} dht={c.w1_dht} />
      <Dong ten="Luyện nhiều" mota={`Tổng ${c.w2_luot} lượt đạt trong tuần`} xong={d.tuan.w2_xong} hien={d.tuan.luot} can={c.w2_luot} exp={c.w2_exp} dht={c.w2_dht} />
      <p className="mt-2 text-[11.5px] leading-snug" style={{ color: MAU.muted }}>Tuần tính theo 4 khối ngày của tháng: 1–7 · 8–14 · 15–21 · 22 đến hết tháng.</p>
    </Khoi>
  )

  const thang = (
    <Khoi icon={<IconNV ma="thang" size={22} />} tieuDe="Nhiệm vụ tháng">
      <Dong ten="Bền bỉ cả tháng" mota={`Có lượt đạt ở ${c.m1_ngay} ngày trong tháng`} xong={d.thang.m1_xong} hien={d.thang.ngay_co_luot} can={c.m1_ngay} exp={c.m1_exp} dht={c.m1_dht} />
    </Khoi>
  )

  return (
    <div className="mt-4 grid gap-3">
      {vi}
      <div className="grid items-start gap-3 md:grid-cols-2">
        <div className="grid gap-3">{ngay}</div>
        <div className="grid gap-3">{tuan}{thang}</div>
      </div>
    </div>
  )
}

export default function NhiemVuHS({ gioiTinh, onBack, onLuyenYeu, onVongQuay }: {
  gioiTinh: 'nam' | 'nu' | null; onBack: () => void; onLuyenYeu?: () => void; onVongQuay?: () => void
}) {
  const [d, setD] = useState<NhiemVuCuaToi | null>(null)
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'trong' | 'loi'>('dang_tai')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    monCuaHS().then((m) => (m ? nhiemVuCuaToi(m) : null))
      .then((r) => { setD(r); setState(r ? 'san_sang' : 'trong') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[28px] font-bold leading-tight" style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>Nhiệm vụ {d?.mon ?? ''}</h1>
      <p className="mt-1 text-[13px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>Luyện dạng yếu mỗi ngày → nhận EXP (đổi ra xu) và điểm học tập (để chơi game).</p>

      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'trong' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Nhiệm vụ chưa mở cho môn của em.</p>}
      {state === 'san_sang' && d && <NhiemVuView d={d} onLuyenYeu={onLuyenYeu} onVongQuay={onVongQuay} />}
    </Khung>
  )
}
