// TẦNG 3 — CHẶNG ĐƯỜNG bản 2D: nền thung lũng nhìn ngang (ảnh nen_chang_<biome> hoặc hình tạm), con đường uốn qua các BỆ ĐÁ — mỗi bệ
// là 1 chặng (dạng) có quái đứng; bệ đã hạ cắm cờ, bệ chưa gặp là bóng đen phủ sương, em đứng ở bệ kế tiếp. Phải: chi tiết chặng + nút
// vào màn đấu (giữ nguyên như bản 3D). Cùng props với ChangView.
import { useMemo, useState } from 'react'
import { DauTrangHS, HEAD, NhanHS, NutHS, THE, THE_TRON, useMedia } from '../../skin/KhungHS'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import type { ChangV, LucDiaV, VungV } from '../kieu'
import { boCucDuong, duongCong } from './boCuc'
import { anhNenChang, anhVat } from './hinh2d'
import { Co, CssBan2D, Hero, Suong, tenQuai2D, useChuyenDong, useKhung2D, viTri } from './San2D'
import { BeDaTam, NenChangTam, QuaiTam } from './HinhTam'

const sao = (n: number) => '★'.repeat(Math.min(5, n)) + '☆'.repeat(Math.max(0, 5 - n))
const moTa = (c: ChangV) => (c.trang_thai === 'dat' ? 'đã hạ' : c.trang_thai === 'yeu' ? (c.hp != null ? `còn ${c.hp} đòn` : 'còn quái') : 'chưa gặp')

export function Chang2D({ luc, vung, b, onVe, onVao, gioi = 'nam' }: { luc: LucDiaV; vung: VungV; b: BangMau3D; onVe: () => void; onVao: (c: ChangV) => void; gioi?: 'nam' | 'nu' }) {
  const dai = useMedia('(min-width:1024px)')
  const dong = useChuyenDong()
  const { ref, khung } = useKhung2D(true)
  const [sel, setSel] = useState<string>(() => (vung.chang.find((c) => c.trang_thai === 'yeu') ?? vung.chang.find((c) => c.trang_thai !== 'dat') ?? vung.chang[0]).ma)
  const [hov, setHov] = useState<string | null>(null)
  // chừa chỗ panel phải (màn rộng) / panel dưới (màn hẹp) để bệ không nằm dưới panel
  const vungVe = dai && khung.w ? { x0: 0.08, x1: Math.max(0.4, 1 - 420 / khung.w), y0: 0.46, y1: 0.8 } : { x0: 0.1, x1: 0.9, y0: 0.3, y1: 0.5 }
  const diem = useMemo(() => boCucDuong(vung.chang.map((c) => c.ma), vungVe), [vung, vungVe.x0, vungVe.x1, vungVe.y0, vungVe.y1]) // eslint-disable-line react-hooks/exhaustive-deps
  const toi = vung.chang.findIndex((c) => c.trang_thai !== 'dat')
  const coBe = Math.min(120, Math.max(54, Math.min(khung.w * 0.075, khung.h * 0.13)))
  const anhNen = anhNenChang(luc.biome)
  const c = vung.chang.find((x) => x.ma === sel) ?? vung.chang[0]
  const m = b.biome[luc.biome] ?? Object.values(b.biome)[0]

  return (
    <div className="absolute inset-0" style={{ background: 'var(--sk-bg)' }}>
      <CssBan2D />
      <div className="ban2d absolute inset-0 overflow-hidden" data-dong={dong ? '1' : '0'}>
        {anhNen ? <img src={anhNen} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} /> : <NenChangTam b={b} biome={luc.biome} />}
        <div ref={ref} className="absolute inset-0">
          {khung.w > 0 && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${khung.w} ${khung.h}`} aria-hidden>
              <path d={duongCong(diem, khung.w, khung.h)} fill="none" stroke={b.duongVien} strokeWidth={coBe * 0.42} strokeLinecap="round" opacity={0.5} />
              <path d={duongCong(diem, khung.w, khung.h)} fill="none" stroke={b.duong} strokeWidth={coBe * 0.32} strokeLinecap="round" />
              {toi > 0 && <path d={duongCong(diem.slice(0, toi + 1), khung.w, khung.h)} fill="none" stroke={b.vang} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 10" />}
            </svg>
          )}
          {khung.w > 0 && vung.chang.map((x, i) => {
            const p = viTri(diem[i], khung), cuoi = x.quai[x.quai.length - 1], chon = sel === x.ma
            return (
              <div key={x.ma} className="absolute" style={{ left: p.x, top: p.y, width: coBe, height: coBe, transform: 'translate(-50%,-78%)' }}>
                <button onClick={() => setSel(x.ma)} onPointerEnter={() => setHov(x.ma)} onPointerLeave={() => setHov(null)} aria-pressed={chon}
                  aria-label={`${x.ten}: ${moTa(x)}`} className="ban2d-o absolute left-1/2 top-1/2 h-full w-full" style={{ transform: 'translate(-50%,-50%)' }}>
                  {chon && <span className="ban2d-sang pointer-events-none absolute left-1/2 rounded-full" style={{ top: '88%', width: coBe * 1.3, height: coBe * 0.5, transform: 'translate(-50%,-50%)', background: `radial-gradient(closest-side, ${b.vang}cc, transparent)` }} />}
                  <span className="absolute bottom-0 left-0 block w-full" style={{ height: coBe * 0.4 }}>
                    {anhVat('be_da') ? <img src={anhVat('be_da')!} alt="" className="h-full w-full object-contain" draggable={false} /> : <BeDaTam b={b} />}
                  </span>
                  {x.trang_thai !== 'dat' && cuoi && (
                    <span className="absolute left-1/2 -translate-x-1/2" style={{ bottom: coBe * 0.22, width: coBe * (cuoi.boss ? 0.78 : 0.64), height: coBe * (cuoi.boss ? 0.78 : 0.64) }}>
                      <QuaiTam b={b} loai={cuoi.loai} boss={cuoi.boss && x.quai.length > 1} bong={x.trang_thai === 'chua_do'} co={coBe * 0.7} />
                    </span>
                  )}
                </button>
                {x.trang_thai === 'dat' && <span className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ bottom: coBe * 0.22 }}><Co mau={m.diem} anh={anhVat('co_chinh_phuc')} cao={coBe * 0.6} /></span>}
                {x.trang_thai === 'chua_do' && <Suong mau={b.bot} anh={anhVat('may_suong')} style={{ left: '-15%', top: '10%', width: '130%', height: '70%' }} />}
                {x.quai.length > 1 && x.trang_thai !== 'dat' && <span className="pointer-events-none absolute right-0 top-0 rounded-full px-1.5 text-[11px] font-extrabold" style={{ ...HEAD, background: 'var(--sk-surface)', color: 'var(--sk-ink)', border: 'var(--sk-card-border)' }}>×{x.quai.length}</span>}
                {i === toi && <span className="pointer-events-none absolute flex flex-col items-center" style={{ right: '100%', bottom: coBe * 0.1 }}>
                  <span className="mb-0.5 whitespace-nowrap rounded-full px-2 text-[11px] font-bold" style={{ background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)' }}>Em ở đây</span>
                  <Hero gioi={gioi} cao={coBe * 0.85} mau={b.troi} />
                </span>}
                <span className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-center"
                  style={{ ...THE_TRON, top: '100%', marginTop: 4, borderRadius: dai ? 10 : 999, width: dai ? 'max-content' : 26, height: dai ? undefined : 26, maxWidth: 150, justifyContent: 'center', padding: dai ? '2px 8px' : 0, background: 'var(--sk-surface)', borderColor: chon || hov === x.ma ? 'var(--sk-acc)' : undefined }}>
                  {dai ? <>
                    <span className="line-clamp-2 text-[11.5px] font-bold leading-tight" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{x.ten}</span>
                    <span className="text-[10.5px]" style={{ color: 'var(--sk-muted)' }}>{x.quai.length} quái · {moTa(x)}</span>
                  </> : <span className="text-[12px] font-extrabold" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{i + 1}</span>}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="absolute left-0 right-0 top-0 p-3"><DauTrangHS tieuDe={vung.ten} phu={luc.ten} onBack={onVe} /></div>
      <aside className={`absolute flex flex-col gap-2.5 p-4 ${dai ? 'bottom-4 right-4 top-[72px] w-[300px]' : 'bottom-3 left-3 right-3 max-h-[46%] overflow-y-auto'}`} style={THE}>
        <div className="flex flex-wrap gap-1.5">
          <NhanHS mau={c.trang_thai === 'dat' ? 'var(--sk-acc)' : 'var(--sk-muted)'}>{c.trang_thai === 'dat' ? 'Đã chinh phục' : c.trang_thai === 'yeu' ? 'Quái còn máu' : 'Phủ sương · vào được'}</NhanHS>
          <NhanHS>{c.quai.length} quái</NhanHS>
        </div>
        <h3 className="text-[18px] font-bold leading-tight" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{c.ten}</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[12.5px]">
          <dt style={{ color: 'var(--sk-muted)' }}>Mức độ</dt><dd className="text-right">{sao(c.muc_do)}</dd>
          <dt style={{ color: 'var(--sk-muted)' }}>Độ nắm dạng</dt><dd className="text-right">{c.mastery == null ? 'chưa đo' : `${Math.round(c.mastery * 100)}%`}</dd>
          <dt style={{ color: 'var(--sk-muted)' }}>Một lượt</dt><dd className="text-right">{c.so_cau_luot != null ? `${c.so_cau_luot} câu` : '5–10 câu'}</dd>
        </dl>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <p className="mb-1 text-[11.5px]" style={{ color: 'var(--sk-muted)' }}>Đội hình · đánh lần lượt, hạ hết cả đội</p>
          <div className="flex flex-col gap-1">
            {c.quai.map((q, i) => (
              <div key={i} className="flex items-center gap-2 px-2.5 py-1 text-[12.5px]" style={{ ...THE_TRON, borderRadius: 8, opacity: c.trang_thai === 'chua_do' ? 0.65 : 1 }}>
                <span className="inline-block h-6 w-6 flex-none"><QuaiTam b={b} loai={q.loai} bong={c.trang_thai === 'chua_do'} co={24} /></span>
                <span><b style={{ ...HEAD, color: 'var(--sk-ink)' }}>{tenQuai2D(q.loai)}</b> <span style={{ color: 'var(--sk-muted)' }}>· {q.boss ? 'Boss cuối' : `Elite ${i + 1}`}</span></span>
              </div>
            ))}
          </div>
        </div>
        <NutHS onClick={() => onVao(c)}>{c.trang_thai === 'dat' ? 'Ôn lại chặng' : 'Vào màn đấu'}</NutHS>
      </aside>
    </div>
  )
}
