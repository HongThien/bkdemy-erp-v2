// ============================================================================
// ThanhTuuMoiView — màn "Thành tựu mùa này" kiểu game (Thùy 07/10): MỖI THÀNH TỰU = 1 THẺ, chỉ hiện bậc GẦN NHẤT chưa nhận; nhận xong mới hiện bậc kế tiếp.
// Đạt điều kiện ⇒ thẻ SÁNG + nút "Nhận quà". Chỉ VẼ từ TtCuaToi (fn_thanh_tuu_cua_toi) — số liệu/đạt/chưa do Postgres tính; nhận quà qua onNhan.
// + MungThanhTuu: lớp phủ vừa nhận quà. Chữ gốc FORMAL. Thành tựu ẩn chưa đạt: server đã che tên/mô tả.
// ============================================================================
import type { TtCuaToi, TtLoai, TtNhan } from '../../../lib/thanhtuu_moi'
import { HEAD, MAU, NhomHS, NutHS, THE_TRON, TheHS, useSkinHT } from '../skin/KhungHS'
import { MungThanhTuuArt, ThanhTuuViewArt } from './ThanhTuuArt'

const sl = (n: number) => n.toLocaleString('vi-VN')

type Buoc = { l: TtLoai; hien: TtLoai['bac'][number] | null; chua: number }   // hien = bậc chưa nhận gần nhất; chua = số bậc chưa nhận
const buoc = (l: TtLoai): Buoc => {
  const chua = l.bac.filter((b) => !b.dat)
  return { l, hien: chua[0] ?? null, chua: chua.length }
}
const phanTram = (l: TtLoai, b: NonNullable<Buoc['hien']>) => (l.tien_do == null ? 0 : Math.max(0, Math.min(100, Math.round((100 * l.tien_do) / Math.max(1, b.nguong)))))

function The({ x, onNhan, dangNhan }: { x: Buoc; onNhan?: (ma: string, bac: number) => void; dangNhan: string | null }) {
  const { l, hien } = x
  const tong = l.bac.length
  const xong = hien === null
  const nhan = !!hien?.co_the_nhan
  const pct = hien ? phanTram(l, hien) : 100
  const key = hien ? `${l.ma}-${hien.bac}` : ''
  return (
    <TheHS className="flex flex-col gap-2 p-3" style={nhan ? { boxShadow: '0 0 16px var(--sk-acc)', border: `1.5px solid ${MAU.acc}` } : xong ? { opacity: 0.75 } : undefined}>
      <div className="flex items-start gap-2.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[24px]" aria-hidden
          style={nhan ? { background: MAU.acc, color: MAU.accInk, boxShadow: '0 0 10px var(--sk-acc)' } : { background: MAU.surface2 }}>{xong ? '🏆' : l.an && l.tien_do == null ? '🔒' : '🏅'}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[16.5px] font-extrabold leading-tight" style={HEAD}>{l.ten}</span>
          <span className="mt-0.5 block text-[13px] leading-snug" style={{ color: MAU.muted }}>{l.mo_ta}</span>
        </span>
        <span className="shrink-0 text-[13px] font-bold tabular-nums" style={{ color: MAU.muted }}>{xong ? `${tong}/${tong}` : `Bậc ${hien!.bac}/${tong}`}</span>
      </div>

      {xong ? (
        <p className="text-[14px] font-bold" style={{ color: MAU.dung }}>✓ Đã nhận hết {tong} bậc của mùa này</p>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full" style={{ background: MAU.surface2, border: `1px solid ${MAU.line}` }}>
              <span className="block h-full rounded-full" style={{ width: `${nhan ? 100 : pct}%`, background: MAU.acc }} />
            </span>
            <span className="shrink-0 text-[13px] font-bold tabular-nums" style={{ color: MAU.ink }}>
              {l.tien_do == null ? `Mục tiêu ${sl(hien!.nguong)} ${l.don_vi}` : `${sl(Math.min(l.tien_do, hien!.nguong))}/${sl(hien!.nguong)} ${l.don_vi}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="min-w-0 flex-1 text-[14px] font-bold" style={{ color: MAU.acc }}>
              Quà: {hien!.xu > 0 ? `+${hien!.xu} xu` : `+${sl(hien!.exp)} EXP`}
              {x.chua > 1 && <span className="font-medium" style={{ color: MAU.muted }}> · còn {x.chua - 1} bậc nữa</span>}
            </span>
            {nhan ? (
              <NutHS onClick={() => onNhan?.(l.ma, hien!.bac)} tat={dangNhan === key} className="!h-10 shrink-0 px-5 !text-[15.5px] animate-pulse motion-reduce:animate-none">{dangNhan === key ? 'Đang nhận…' : 'Nhận quà'}</NutHS>
            ) : (
              <span className="shrink-0 rounded-full px-3 py-1.5 text-[13px] font-bold" style={{ border: `1px solid ${MAU.line}`, color: MAU.muted }}>Chưa đạt</span>
            )}
          </div>
        </>
      )}
    </TheHS>
  )
}

export function ThanhTuuMoiView({ d, onNhan, dangNhan = null }: { d: TtCuaToi; onNhan?: (ma: string, bac: number) => void; dangNhan?: string | null }) {
  const anh = useSkinHT().anhTt
  if (anh) return <ThanhTuuViewArt d={d} a={anh} onNhan={onNhan} dangNhan={dangNhan} />
  const sanSang = d.loai.filter((l) => l.san_sang).map(buoc)
  const sapCo = d.loai.filter((l) => !l.san_sang)
  // Thứ tự: có quà chờ nhận → đang tiến hành (gần xong trước) → đã nhận hết
  const diem = (x: Buoc) => (x.hien === null ? -1 : x.hien.co_the_nhan ? 1000 : phanTram(x.l, x.hien))
  const ds = [...sanSang].sort((a, b) => diem(b) - diem(a))
  return (
    <section className="flex flex-col gap-3">
      <TheHS className="flex items-center gap-3 px-4 py-3" style={d.cho_nhan > 0 ? { boxShadow: '0 0 12px var(--sk-acc)' } : undefined}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[24px]" style={{ background: MAU.acc, color: MAU.accInk }} aria-hidden>🏅</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-bold uppercase tracking-[0.06em]" style={{ color: MAU.muted }}>Thành tựu mùa {d.mua ?? ''}</span>
          <span className="block text-[24px] font-black leading-tight tabular-nums" style={{ ...HEAD, color: MAU.ink }}>{sl(d.tong_exp_mua)} <span className="text-[14.5px] font-bold" style={{ color: MAU.muted }}>EXP đã nhận</span></span>
          <span className="block text-[12.5px] leading-snug" style={{ color: d.cho_nhan > 0 ? MAU.acc : MAU.muted, fontWeight: d.cho_nhan > 0 ? 700 : 400 }}>
            {d.cho_nhan > 0 ? `${d.cho_nhan} thành tựu đang chờ em nhận quà!` : 'Mỗi bậc thưởng một lần trong mùa · mùa mới bắt đầu 01/07'}
          </span>
        </span>
      </TheHS>
      <div className="grid gap-3 md:grid-cols-2">{ds.map((x) => <The key={x.l.ma} x={x} onNhan={onNhan} dangNhan={dangNhan} />)}</div>
      {sapCo.length > 0 && (
        <>
          <NhomHS>Sắp có</NhomHS>
          <div className="grid gap-2 md:grid-cols-2">
            {sapCo.map((l) => (
              <TheHS key={l.ma} className="flex items-center gap-2.5 px-3 py-2.5" style={{ opacity: 0.6 }}>
                <span className="text-[20px]" aria-hidden>🔒</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold" style={HEAD}>{l.ten}</span>
                  <span className="block truncate text-[12.5px]" style={{ color: MAU.muted }}>{l.mo_ta}</span>
                </span>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11.5px] font-bold" style={{ border: `1px solid ${MAU.line}`, color: MAU.muted }}>Sắp có</span>
              </TheHS>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

// Lớp phủ vừa NHẬN quà
export function MungThanhTuu({ nhan, onDong }: { nhan: TtNhan | null; onDong: () => void }) {
  const anh = useSkinHT().anhTt
  if (!nhan) return null
  if (anh) return <MungThanhTuuArt a={anh} nhan={nhan} onDong={onDong} />
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6 sm:items-center" onClick={onDong}>
      <div className="w-full max-w-[400px] p-6 text-center" onClick={(e) => e.stopPropagation()} style={{ ...THE_TRON, background: MAU.bg }}>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-[46px]" style={{ background: MAU.surface2 }} aria-hidden>🏅</div>
        <p className="mt-3 text-[24px] font-extrabold" style={{ ...HEAD, color: MAU.ink }}>Đã nhận quà!</p>
        <p className="mt-1 text-[15.5px] font-bold" style={{ color: MAU.ink }}>{nhan.ten} · bậc {nhan.bac}</p>
        <p className="text-[22px] font-black" style={{ color: MAU.acc }}>{nhan.xu > 0 ? `+${nhan.xu} xu` : `+${sl(nhan.exp)} EXP`}</p>
        {nhan.xu === 0 && <p className="mt-1 text-[14px]" style={{ color: MAU.muted }}>EXP được đổi ra xu ngay trong Ví.</p>}
        <NutHS onClick={onDong} className="mt-4 w-full">Tuyệt! ♡</NutHS>
      </div>
    </div>
  )
}
