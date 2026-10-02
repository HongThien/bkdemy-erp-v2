// ============================================================================
// ĐẤU TRƯỜNG 3 TRẬN (Thử thách — spec-thu-thach-dau-truong.md). Đồ họa 2D: nhân vật chibi (Skin.nhanVat) + boss ảnh (Skin.boss, BossAnhHS) + hoạt ảnh CSS.
// Màn CHỈ hiển thị + nhận câu trả lời; thắng/thua thật do server (spec §7) — ở đây `NGUONG` chỉ để vẽ vạch & nhãn. Dựng bằng KhungHS (không gõ màu).
// Luồng: trận t (5 câu) → hoạt cảnh sau trận (thắng: boss gục · thua: dừng luôn) → trận kế → … → kết quả. Nút "Bỏ cuộc" = thua.
// ============================================================================
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { DauTrangHS, HEAD, MAU, ManHS, NhanHS, NutHS, TheHS, THE } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import { BossAnhHS } from '../boss/BossSan'
import type { TuTheBoss } from '../boss/noiDungBoss'
import { NGUONG, NHAN_DO_KHO, SO_CAU_TRAN, SO_TRAN, type CauTT, type KetThucLuot } from './kieu'

const BOSS = 'boss_thuy' // DÙNG TẠM cho cả 3 trận (Thùy 02/10) — đủ quái thì thay qua sổ boss của style
const CHU = ['A', 'B', 'C', 'D', 'E', 'F']
const CO_BOSS = [0.82, 0.94, 1.08] // trận càng sau boss càng to

const CSS = `
@keyframes dt-bay { 0% { opacity: 0; transform: translateY(8px) scale(.6) } 20% { opacity: 1 } 100% { opacity: 0; transform: translateY(-70px) scale(1.25) } }
@keyframes dt-dam { 0%,100% { transform: translateX(0) } 40% { transform: translateX(var(--dt-lao,120px)) scale(1.07) } }
@keyframes dt-giat { 0%,100% { transform: translateX(0) rotate(0) } 20% { transform: translateX(-6%) rotate(-4deg) } 60% { transform: translateX(4%) rotate(2deg) } }
@keyframes dt-tho { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-1.6%) } }
@keyframes dt-nhay { 0%,100% { transform: translateY(0) } 25% { transform: translateY(-9%) } 50% { transform: translateY(0) } 70% { transform: translateY(-4%) } }
@keyframes dt-mo { to { opacity: .45; transform: translateY(3%) rotate(-5deg); filter: grayscale(.6) } }
@keyframes dt-phong { to { transform: scale(1.16) translateX(-4%) } }
@keyframes dt-vang { 0% { opacity: 0; transform: translate(0,0) scale(.3) } 15% { opacity: 1 } 100% { opacity: 0; transform: translate(var(--dx),var(--dy)) scale(1) } }
@keyframes dt-hien { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes dt-nen-toi { to { opacity: .72 } }
@keyframes dt-mau { 0%,100% { box-shadow: 0 0 0 0 transparent } 50% { box-shadow: 0 0 14px 2px var(--sk-acc) } }
.dt-hero { animation: dt-tho 2.6s ease-in-out infinite }
.dt-hero[data-h="dam"] { animation: dt-dam .5s ease-out 1 }
.dt-hero[data-h="giat"] { animation: dt-giat .45s ease-out 1 }
.dt-hero[data-h="nhay"] { animation: dt-nhay 1s ease-in-out infinite }
.dt-hero[data-h="mo"] { animation: dt-mo 1.4s ease-in forwards }
.dt-boss-to { animation: dt-phong 2.2s ease-in forwards; transform-origin: 50% 100% }
.dt-hien { animation: dt-hien .3s ease-out }
.dt-bay { animation: dt-bay .9s ease-out forwards }
.dt-vang { animation: dt-vang 1.6s ease-out forwards }
.dt-mau-chac { animation: dt-mau 1.4s ease-in-out infinite }
@media (prefers-reduced-motion: reduce) { .dt-hero, .dt-hero[data-h], .dt-boss-to, .dt-bay, .dt-vang, .dt-mau-chac, .dt-hien { animation: none !important } .dt-bay, .dt-vang { opacity: 0 } }
`

/** Chiều cao sân (px) theo khung nhìn: đủ chỗ cho thẻ câu hỏi bên dưới; hẹp (điện thoại dọc) thì co theo bề ngang để chibi + boss không chồng nhau. */
function useCaoSan() {
  const tinh = () => (typeof window === 'undefined' ? 280 : Math.round(Math.max(120, Math.min(340, window.innerHeight * 0.33, window.innerWidth * 0.42))))
  const [c, setC] = useState(tinh)
  useEffect(() => { const f = () => setC(tinh()); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f) }, [])
  return c
}

type Pha = 'dang_danh' | 'sau_tran' | 'cuoi'
type Hero = 'idle' | 'dam' | 'giat' | 'nhay' | 'mo'

export interface DauTruongProps {
  gioi: 'nam' | 'nu'
  /** 3 trận × 5 câu (server sinh một lần lúc bắt đầu lượt) */
  tran: CauTT[][]
  /** hiện vòng gợi ý quanh đáp án đúng (chỉ trang xem thử) */
  goiY?: boolean
  /** Điểm Rank server trả cho lượt (hiển thị trên màn kết quả) */
  diem?: (kq: KetThucLuot) => number
  /** lượt còn lại SAU lượt này (nút "Thử lại" xám khi 0) */
  luotConSau: number
  /** lượt đóng (vượt / thua / bỏ cuộc) — để cha ghi DB */
  onKetThuc: (kq: KetThucLuot) => void
  onThuLai: () => void
  onThoat: () => void
}

export function DauTruongHS({ gioi, tran, goiY, diem, luotConSau, onKetThuc, onThuLai, onThoat }: DauTruongProps) {
  const [t, setT] = useState(0)
  const [c, setC] = useState(0)
  const [chon, setChon] = useState<number | null>(null)
  const [dungTran, setDungTran] = useState(0)
  const [thang, setThang] = useState<boolean[]>([])
  const [pha, setPha] = useState<Pha>('dang_danh')
  const [lyDo, setLyDo] = useState<KetThucLuot['lyDo']>('thua')
  const [hoiBo, setHoiBo] = useState(false)
  const [hero, setHero] = useState<Hero>('idle')
  const [boss, setBoss] = useState<TuTheBoss>('dung')
  const [dmg, setDmg] = useState(0) // id hiệu ứng "-1" (đổi ⇒ phát lại)
  const cao = useCaoSan()
  const daBao = useRef(false)

  const cau = tran[t]?.[c]
  const need = NGUONG[t]
  const conLai = SO_CAU_TRAN - dungTran // số ô máu còn
  const nguongMau = SO_CAU_TRAN - need // chạm ≤ mức này = hạ gục
  const chac = dungTran >= need

  // Về tư thế đứng sau mỗi đòn (không đè tư thế gục / thắng thua).
  useEffect(() => {
    if (pha !== 'dang_danh' || (boss === 'dung' && hero === 'idle')) return
    const id = setTimeout(() => { setBoss('dung'); setHero('idle') }, boss === 'chieu' ? 950 : 700)
    return () => clearTimeout(id)
  }, [boss, hero, dmg, pha])

  const ketThuc = (kq: KetThucLuot) => { if (daBao.current) return; daBao.current = true; onKetThuc(kq) }

  const chonDapAn = (i: number) => {
    if (chon !== null || !cau) return
    setChon(i)
    const dung = i === cau.dung
    if (dung) { setDungTran((n) => n + 1); setHero('dam'); setBoss('trung') } else { setHero('giat'); setBoss('chieu') }
    setDmg((n) => n + 1)
  }

  const tiep = () => {
    if (chon === null) return
    if (c + 1 < SO_CAU_TRAN) { setC(c + 1); setChon(null); return }
    // hết 5 câu ⇒ chấm trận (chuẩn hoá: ở bản thật, server trả thắng/thua)
    const w = dungTran >= need
    const ds = [...thang, w]
    setThang(ds); setChon(null)
    if (!w) { setLyDo('thua'); setPha('cuoi'); setHero('mo'); setBoss('gian'); ketThuc({ thang: ds, lyDo: 'thua' }) }
    else if (t + 1 >= SO_TRAN) { setLyDo('vuot'); setPha('cuoi'); setHero('nhay'); setBoss('ha'); ketThuc({ thang: ds, lyDo: 'vuot' }) }
    else { setPha('sau_tran'); setHero('nhay'); setBoss('ha') }
  }

  const tranKe = () => { setT(t + 1); setC(0); setDungTran(0); setChon(null); setPha('dang_danh'); setHero('idle'); setBoss('dung') }

  const boCuoc = () => {
    setHoiBo(false); setLyDo('bo_cuoc'); setPha('cuoi'); setHero('mo'); setBoss('gian'); setChon(null)
    ketThuc({ thang, lyDo: 'bo_cuoc' })
  }

  const nv = laySkin(null).nhanVat?.[gioi]
  const kqCuoi: KetThucLuot = { thang, lyDo }
  const soThang = thang.filter(Boolean).length

  return (
    <ManHS className="!gap-2.5">
      <style>{CSS}</style>
      <DauTrangHS tieuDe="Đấu trường" phu={`Trận ${t + 1}/${SO_TRAN} · cần đúng ${need}/${SO_CAU_TRAN}`}
        phai={<div className="flex items-center gap-2">
          <Pips thang={thang} t={t} pha={pha} />
          {pha !== 'cuoi' && <NutHS phu className="!h-9 !px-3 !text-[13px]" onClick={() => setHoiBo(true)}>Bỏ cuộc</NutHS>}
        </div>} />

      {/* ── SÂN ĐẤU: chibi trái · boss phải + thanh máu ── */}
      <div className="relative overflow-hidden rounded-[18px]" style={{ ...THE, height: Math.round(cao * Math.max(CO_BOSS[t], 1)) + 52, padding: 0 }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 90% at 70% 100%, var(--sk-surface2) 0%, transparent 70%)' }} />
        {pha === 'cuoi' && lyDo !== 'vuot' && <div className="pointer-events-none absolute inset-0 z-[5]" style={{ background: 'var(--sk-bg)', opacity: 0, animation: 'dt-nen-toi 1.6s ease-in .4s forwards' }} />}
        <div className="absolute bottom-0 z-10 flex items-end" style={{ height: cao, left: pha === 'cuoi' && lyDo === 'vuot' ? '50%' : '4%', transform: pha === 'cuoi' && lyDo === 'vuot' ? 'translateX(-50%)' : undefined, transition: 'left .9s ease-in-out', ['--dt-lao' as string]: `${Math.round(cao * 0.9)}px` } as CSSProperties}>
          <div className="dt-hero h-full" data-h={hero} key={`h-${hero}-${dmg}`}>
            {nv ? <img src={nv} alt="" draggable={false} className="h-full w-auto select-none object-contain" style={{ filter: 'drop-shadow(0 8px 14px var(--sk-bg))' }} />
              : <span className="text-[90px]">🧙</span>}
          </div>
        </div>
        <div className="absolute bottom-0 right-[3%] z-10 flex flex-col items-center" style={{ width: Math.round(cao * CO_BOSS[t]) + 8 }}>
          {pha === 'dang_danh' && <ThanhMau con={conLai} nguong={nguongMau} chac={chac} />}
          <div className={pha === 'cuoi' && lyDo !== 'vuot' ? 'dt-boss-to' : ''} key={`b-${t}`}>
            <BossAnhHS ma={BOSS} tt={boss} cao={Math.round(cao * CO_BOSS[t])} />
          </div>
          {dmg > 0 && pha === 'dang_danh' && chon !== null && cau && chon === cau.dung && (
            <span key={dmg} className="dt-bay pointer-events-none absolute top-[28%] text-[34px] font-extrabold" style={{ ...HEAD, color: MAU.acc, textShadow: '0 2px 10px var(--sk-bg)' }}>−1</span>
          )}
        </div>
        {pha === 'cuoi' && lyDo === 'vuot' && <Vang giua />}
        {pha === 'sau_tran' && <Vang nho />}
      </div>

      {/* ── KHUNG DƯỚI: câu hỏi | kết quả trận | kết quả cuối ── */}
      {pha === 'dang_danh' && cau && (
        <TheHS className="dt-hien flex flex-col gap-3 p-3.5 md:p-4" key={`q-${t}-${c}`}>
          <div className="flex flex-wrap items-center gap-2">
            <NhanHS dac>Câu {c + 1}/{SO_CAU_TRAN}</NhanHS>
            <NhanHS mau={cau.doKho === 'cao' ? MAU.sai : cau.doKho === 'vua' ? MAU.canhBao : MAU.dung}>{NHAN_DO_KHO[cau.doKho]}</NhanHS>
            <span className="flex-1" />
            <span className="text-[12.5px]" style={{ color: MAU.muted }}>Đúng {dungTran} · cần {need}</span>
          </div>
          <p className="text-[18px] font-semibold leading-snug md:text-[20px]" style={{ color: MAU.ink }}>{cau.de}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {cau.dapAn.map((d, i) => {
              const xong = chon !== null
              const laDung = i === cau.dung
              const trang: CSSProperties = !xong
                ? { border: '1.5px solid var(--sk-line)', background: 'var(--sk-surface2)', outline: goiY && laDung ? `2px dashed ${MAU.acc}` : undefined, outlineOffset: 2 }
                : laDung ? { border: `2px solid ${MAU.dung}`, background: `color-mix(in srgb, ${MAU.dung} 24%, transparent)` }
                  : i === chon ? { border: `2px solid ${MAU.sai}`, background: `color-mix(in srgb, ${MAU.sai} 22%, transparent)` }
                    : { border: '1.5px solid var(--sk-line)', background: 'var(--sk-surface2)', opacity: 0.55 }
              return (
                <button key={i} onClick={() => chonDapAn(i)} disabled={xong} className="flex min-h-[52px] items-center gap-3 rounded-[12px] px-3 py-2 text-left text-[16px] font-medium transition active:scale-[0.99]"
                  style={{ ...trang, color: MAU.ink }}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold" style={{ background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)' }}>{CHU[i]}</span>
                  <span className="min-w-0 flex-1">{d}</span>
                  {xong && laDung && <span style={{ color: MAU.dung }}>✓</span>}
                  {xong && i === chon && !laDung && <span style={{ color: MAU.sai }}>✗</span>}
                </button>
              )
            })}
          </div>
          {chon !== null && (
            <div className="flex items-center gap-3">
              <p className="flex-1 text-[14px] font-bold" style={{ color: chon === cau.dung ? MAU.dung : MAU.sai }}>
                {chon === cau.dung ? 'Trúng đòn!' : `Trượt rồi — đáp án ${CHU[cau.dung]}.`}
              </p>
              <NutHS onClick={tiep}>{c + 1 < SO_CAU_TRAN ? 'Câu tiếp ›' : 'Kết thúc trận'}</NutHS>
            </div>
          )}
        </TheHS>
      )}

      {pha === 'sau_tran' && (
        <TheHS className="dt-hien flex flex-col items-center gap-2 p-5 text-center">
          <p className="text-[26px] font-extrabold" style={{ ...HEAD, color: MAU.acc }}>Thắng trận {t + 1}!</p>
          <p className="text-[15px]" style={{ color: MAU.ink }}>Đúng {dungTran}/{SO_CAU_TRAN} (cần {need}). Trận kế khó hơn: cần đúng {NGUONG[t + 1]}/{SO_CAU_TRAN}.</p>
          <NutHS onClick={tranKe} className="mt-1 !px-8">Vào trận {t + 2} ›</NutHS>
        </TheHS>
      )}

      {pha === 'cuoi' && (
        <TheHS className="dt-hien flex flex-col items-center gap-2.5 p-5 text-center" style={{ animationDelay: '.5s', animationFillMode: 'backwards' }}>
          <p className="text-[28px] font-extrabold" style={{ ...HEAD, color: lyDo === 'vuot' ? MAU.acc : MAU.ink }}>
            {lyDo === 'vuot' ? 'Vượt Thử thách!' : lyDo === 'bo_cuoc' ? 'Em đã bỏ cuộc' : `Thua ở trận ${thang.length}`}
          </p>
          <Pips thang={thang} t={thang.length} pha="cuoi" lon />
          <p className="text-[15px]" style={{ color: MAU.ink }}>
            {lyDo === 'vuot' ? 'Boss đã gục. Em thắng cả 3 trận!' : lyDo === 'bo_cuoc' ? 'Bỏ cuộc tính là thua — lượt này vẫn bị trừ.' : 'Boss thắng lần này. Mở lại bài, học kỹ dạng vừa sai rồi quay lại nhé.'}
          </p>
          <p className="text-[14px]" style={{ color: MAU.muted }}>
            Thắng {soThang}/{SO_TRAN} trận{diem ? ` · +${diem(kqCuoi)} Điểm Rank` : ''} · hôm nay còn {luotConSau}/2 lượt
          </p>
          <div className="mt-1 flex flex-wrap justify-center gap-2.5">
            <NutHS onClick={onThuLai} tat={luotConSau <= 0} className="!px-6">{luotConSau > 0 ? 'Thử lại' : 'Mai làm tiếp'}</NutHS>
            <NutHS phu onClick={onThoat} className="!px-6">Về</NutHS>
          </div>
        </TheHS>
      )}

      {hoiBo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'color-mix(in srgb, var(--sk-bg) 72%, transparent)' }}>
          <TheHS className="dt-hien flex w-full max-w-[380px] flex-col gap-3 p-5 text-center" style={{ background: 'var(--sk-bg)' }}>
            <p className="text-[20px] font-bold" style={{ ...HEAD, color: MAU.ink }}>Bỏ cuộc?</p>
            <p className="text-[14px]" style={{ color: MAU.muted }}>Bỏ cuộc tính là thua và vẫn mất 1 lượt hôm nay.</p>
            <div className="flex justify-center gap-2.5">
              <NutHS phu onClick={() => setHoiBo(false)}>Đánh tiếp</NutHS>
              <NutHS onClick={boCuoc}>Bỏ cuộc</NutHS>
            </div>
          </TheHS>
        </div>
      )}
    </ManHS>
  )
}

/** 3 chấm tiến độ: thắng ✓ · thua ✗ · đang đánh (viền nhấn) · chưa tới (mờ). */
function Pips({ thang, t, pha, lon }: { thang: boolean[]; t: number; pha: Pha; lon?: boolean }) {
  const s = lon ? 40 : 26
  return (
    <div className="flex items-center gap-1.5" aria-label="Tiến độ 3 trận">
      {Array.from({ length: SO_TRAN }, (_, i) => {
        const xong = i < thang.length
        const w = thang[i]
        const dang = !xong && i === t && pha !== 'cuoi'
        return (
          <span key={i} className="flex items-center justify-center rounded-full font-extrabold" style={{
            width: s, height: s, fontSize: lon ? 18 : 13,
            border: `2px solid ${xong ? (w ? MAU.dung : MAU.sai) : dang ? MAU.acc : 'var(--sk-line)'}`,
            background: xong ? `color-mix(in srgb, ${w ? MAU.dung : MAU.sai} 28%, transparent)` : 'var(--sk-surface2)',
            color: xong ? (w ? MAU.dung : MAU.sai) : MAU.muted, opacity: xong || dang ? 1 : 0.55,
          }}>{xong ? (w ? '✓' : '✗') : i + 1}</span>
        )
      })}
    </div>
  )
}

/** Thanh máu boss: 5 ô = 5 câu, đúng ⇒ mất 1 ô. Vạch "hạ gục" tại ngưỡng của trận (chạm vạch ⇒ chắc thắng). */
function ThanhMau({ con, nguong, chac }: { con: number; nguong: number; chac: boolean }) {
  return (
    <div className="relative mb-1 w-[88%]" aria-label={`Máu boss ${con}/${SO_CAU_TRAN}`}>
      <div className={`flex gap-1 rounded-full p-1 ${chac ? 'dt-mau-chac' : ''}`} style={{ background: 'var(--sk-bg)', border: '1.5px solid var(--sk-line)' }}>
        {Array.from({ length: SO_CAU_TRAN }, (_, i) => (
          <span key={i} className="h-3 flex-1 rounded-full transition-all duration-500" style={{ background: i < con ? MAU.sai : 'var(--sk-surface2)', opacity: i < con ? 1 : 0.5 }} />
        ))}
      </div>
      {nguong > 0 && <span className="absolute top-[-4px] h-[26px] w-[2px]" style={{ left: `calc(${(nguong / SO_CAU_TRAN) * 100}% + 1px)`, background: MAU.acc }} />}
      <p className="mt-0.5 text-center text-[11px] font-bold" style={{ color: chac ? MAU.acc : MAU.muted }}>{chac ? '✦ Chắc thắng trận này' : nguong > 0 ? `Hạ tới vạch vàng` : 'Phải đúng cả 5 câu'}</p>
    </div>
  )
}

/** Hạt vàng bung quanh boss lúc hạ gục (thuần CSS). */
function Vang({ nho, giua }: { nho?: boolean; giua?: boolean }) {
  const hat = useMemo(() => Array.from({ length: nho ? 14 : 28 }, (_, i) => {
    const a = (i * 137.5) * Math.PI / 180, r = 60 + ((i * 53) % 110)
    return { dx: Math.round(Math.cos(a) * r), dy: Math.round(Math.sin(a) * r * 0.8 - 20), d: (i % 7) * 0.09, s: 5 + (i % 4) * 2 }
  }), [nho])
  return (
    <div className="pointer-events-none absolute z-20" style={giua ? { left: '50%', bottom: '45%' } : { right: '17%', bottom: '38%' }}>
      {hat.map((h, i) => (
        <span key={i} className="dt-vang absolute rounded-full" style={{ width: h.s, height: h.s, background: 'var(--sk-acc)', boxShadow: '0 0 8px var(--sk-acc)', animationDelay: `${h.d}s`, animationIterationCount: giua ? 'infinite' : 1, ['--dx' as string]: `${h.dx}px`, ['--dy' as string]: `${h.dy}px` } as CSSProperties} />
      ))}
    </div>
  )
}
