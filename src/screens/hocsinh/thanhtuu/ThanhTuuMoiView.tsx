// ============================================================================
// ThanhTuuMoiView — khối "Thành tựu mùa này" (15 loại; Thùy chốt 06/10). Chỉ VẼ từ 1 object TtCuaToi (fn_thanh_tuu_cua_toi) — số liệu do Postgres tính.
// + MungThanhTuu: lớp phủ chúc mừng các bậc vừa ghi sổ (fn_thanh_tuu_chot trả về). Chữ gốc FORMAL. Thành tựu ẩn chưa đạt: server đã che tên/mô tả.
// ============================================================================
import type { TtCuaToi, TtLoai, TtMoi } from '../../../lib/thanhtuu_moi'
import { HEAD, MAU, NhomHS, NutHS, THE_TRON, TheHS } from '../skin/KhungHS'

const sl = (n: number) => n.toLocaleString('vi-VN')

function Bac({ b, dv, xu }: { b: TtLoai['bac'][number]; dv: string; xu: boolean }) {
  const thuong = b.xu > 0 && xu ? `+${b.xu} xu` : `+${sl(b.exp)} EXP`
  return (
    <span className="flex min-w-[72px] flex-col items-center px-2 py-1.5 text-center leading-tight"
      style={b.dat ? { background: MAU.acc, color: MAU.accInk, borderRadius: 'calc(var(--sk-radius) * 0.6)', boxShadow: '0 0 8px var(--sk-acc)' }
        : { background: MAU.surface2, border: `1px solid ${MAU.line}`, color: MAU.muted, borderRadius: 'calc(var(--sk-radius) * 0.6)' }}>
      <b className="text-[13px] tabular-nums">{b.dat ? '✓ ' : ''}{sl(b.nguong)}</b>
      <span className="text-[10.5px]">{dv}</span>
      <span className="text-[11px] font-bold">{thuong}</span>
    </span>
  )
}

function The({ l }: { l: TtLoai }) {
  const tienDo = l.tien_do
  const daDat = l.bac.filter((b) => b.dat).length
  return (
    <TheHS className="flex flex-col gap-2 p-3" style={l.san_sang ? undefined : { opacity: 0.6 }}>
      <div className="flex items-start gap-2">
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-extrabold leading-tight" style={HEAD}>{l.ten}{l.an && daDat === 0 ? ' 🔒' : ''}</span>
          <span className="mt-0.5 block text-[12px] leading-snug" style={{ color: MAU.muted }}>{l.mo_ta}</span>
        </span>
        {!l.san_sang
          ? <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ border: `1px solid ${MAU.line}`, color: MAU.muted }}>Sắp có</span>
          : <span className="shrink-0 text-[12px] font-bold tabular-nums" style={{ color: MAU.acc }}>{daDat}/{l.bac.length}</span>}
      </div>
      {l.san_sang && tienDo != null && (
        <p className="text-[12px]" style={{ color: MAU.muted }}>Hiện tại: <b style={{ color: MAU.ink }}>{sl(tienDo)}</b> {l.don_vi}</p>
      )}
      {l.san_sang && !l.an && l.bac.length > 0 && (
        <div className="flex flex-wrap gap-1.5">{l.bac.map((b) => <Bac key={b.bac} b={b} dv={l.don_vi} xu={l.ma === 'TT14'} />)}</div>
      )}
      {l.san_sang && l.an && daDat > 0 && (
        <div className="flex flex-wrap gap-1.5">{l.bac.filter((b) => b.dat).map((b) => <Bac key={b.bac} b={b} dv={l.don_vi} xu={false} />)}</div>
      )}
    </TheHS>
  )
}

export function ThanhTuuMoiView({ d }: { d: TtCuaToi }) {
  const sanSang = d.loai.filter((l) => l.san_sang)
  const sapCo = d.loai.filter((l) => !l.san_sang)
  return (
    <section className="flex flex-col gap-3">
      <TheHS className="flex items-center gap-3 px-4 py-3" style={{ boxShadow: '0 0 12px var(--sk-acc)' }}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[22px]" style={{ background: MAU.acc, color: MAU.accInk }} aria-hidden>🏅</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: MAU.muted }}>Thành tựu mùa {d.mua ?? ''}</span>
          <span className="block text-[22px] font-black leading-tight tabular-nums" style={{ ...HEAD, color: MAU.ink }}>{sl(d.tong_exp_mua)} <span className="text-[13px] font-bold" style={{ color: MAU.muted }}>EXP đã nhận</span></span>
          <span className="block text-[11.5px] leading-snug" style={{ color: MAU.muted }}>Mỗi bậc thưởng một lần trong mùa · mùa mới bắt đầu 01/07</span>
        </span>
      </TheHS>
      <div className="grid gap-3 md:grid-cols-2">{sanSang.map((l) => <The key={l.ma} l={l} />)}</div>
      {sapCo.length > 0 && (
        <>
          <NhomHS>Sắp có</NhomHS>
          <div className="grid gap-3 md:grid-cols-2">{sapCo.map((l) => <The key={l.ma} l={l} />)}</div>
        </>
      )}
    </section>
  )
}

// Lớp phủ chúc mừng — hiện khi vừa có bậc mới được ghi sổ (mỗi bậc chỉ báo đúng 1 lần vì server chỉ trả bậc MỚI)
export function MungThanhTuu({ moi, onDong }: { moi: TtMoi[]; onDong: () => void }) {
  if (moi.length === 0) return null
  const tong = moi.reduce((a, x) => a + x.exp, 0)
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6 sm:items-center" onClick={onDong}>
      <div className="w-full max-w-[400px] p-6 text-center" onClick={(e) => e.stopPropagation()} style={{ ...THE_TRON, background: MAU.bg }}>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-[42px]" style={{ background: MAU.surface2 }} aria-hidden>🏅</div>
        <p className="mt-3 text-[22px] font-extrabold" style={{ ...HEAD, color: MAU.ink }}>Thành tựu mới!</p>
        <ul className="mt-2 flex flex-col gap-1 text-[14px]" style={{ color: MAU.ink }}>
          {moi.map((x) => (
            <li key={`${x.ma}-${x.bac}-${x.mon}`} className="flex items-center justify-between gap-2 px-3 py-1.5" style={{ background: MAU.surface2, borderRadius: 'calc(var(--sk-radius) * 0.6)' }}>
              <span className="min-w-0 truncate font-bold">{x.ten} · bậc {x.bac}</span>
              <b className="shrink-0 tabular-nums" style={{ color: MAU.acc }}>{x.xu > 0 ? `+${x.xu} xu` : `+${x.exp.toLocaleString('vi-VN')} EXP`}</b>
            </li>
          ))}
        </ul>
        {tong > 0 && <p className="mt-2 text-[12.5px]" style={{ color: MAU.muted }}>Tổng +{tong.toLocaleString('vi-VN')} EXP — đổi ra xu ngay trong Ví.</p>}
        <NutHS onClick={onDong} className="mt-4 w-full">Tuyệt! ♡</NutHS>
      </div>
    </div>
  )
}
