// ============================================================================
// ĐẤU TRƯỜNG 3 TRẬN (Thử thách — spec-thu-thach-dau-truong.md). Đồ họa 2D: sân (Skin.sanDau) + nhân vật chính 15 tư thế nam/nữ (skin/heroDau.ts — bộ chiến đấu Thùy vẽ 02/10)
// + boss ảnh (Skin.boss) + hiệu ứng đòn bằng canvas (hieuUng.ts, đạn/lớp băng = ảnh FX của bộ chiến đấu).
// Thùy 02/10: KHÔNG có hoạt ảnh theo từng câu — làm xong 5 câu mới phát ĐÒN, mạnh/yếu theo % đúng (60/80/100%): xem hieuUng.ts. Bé gái chibi = NGƯỜI DẪN TRUYỆN (khung lời thoại), không phải nhân vật chính.
// Màn CHỈ hiển thị + nhận câu trả lời; thắng/thua thật do server (spec §7) — `NGUONG` chỉ để vẽ nhãn, thanh máu boss ở đây là hiển thị (server tính thật). Dựng bằng KhungHS (không gõ màu).
// Luồng: trận t (5 câu) → [đòn] → trận kế … → trận 3 thắng = boss gục. Thua trận nào: boss tung ma thuật, dừng luôn. Nút "Bỏ cuộc" = thua.
// ============================================================================
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { DauTrangHS, HEAD, MAU, ManHS, NhanHS, NutHS, TheHS, THE } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import { anhDau, hopDau, HERO_DAU, TU_THE_DAU, type TuTheDau } from '../skin/heroDau'
import { BossAnhHS } from '../boss/BossSan'
import type { TuTheBoss } from '../boss/noiDungBoss'
import { NGUONG, NHAN_DO_KHO, SO_CAU_TRAN, SO_TRAN, type CauTT, type KetThucLuot } from './kieu'
import { AURA, LOC_BOSS, TEN_DON, chonDon, napFx, phatDon, type Don, type Hop, type TtBoss, type TtHero } from './hieuUng'

const BOSS = 'boss_thuy' // DÙNG TẠM cho cả 3 trận (Thùy 02/10) — đủ quái thì thay qua sổ boss của style
const CHU = ['A', 'B', 'C', 'D', 'E', 'F']
/** Nhân vật chính = nhà thám hiểm áo choàng xanh (bộ chiến đấu 15 tư thế, skin/heroDau.ts). Người dẫn truyện = bé gái chibi + cú trắng (Thùy 02/10). */
const DAN: 'nam' | 'nu' = 'nu'
/** Máu boss mất sau mỗi trận thắng, theo % đúng (hiển thị; trận 3 luôn 100% ⇒ đòn kết liễu hạ nốt phần còn lại). */
const MAT_MAU: Record<number, number> = { 60: 18, 80: 28, 100: 34 }

const CSS = `
@keyframes dt-tich { from { filter: drop-shadow(0 0 10px var(--dt-aura)) brightness(1.05) } to { filter: drop-shadow(0 0 22px var(--dt-aura)) drop-shadow(0 0 40px var(--dt-aura)) brightness(1.15) } }
@keyframes dt-bi-danh { 0% { transform: none; filter: brightness(2.2) sepia(1) hue-rotate(-40deg) saturate(5) } 30% { transform: translateX(-9%) } 100% { transform: translateX(-6%); filter: none } }
@keyframes dt-guc { to { filter: grayscale(.75) brightness(.75) } }
@keyframes dt-phong { to { transform: scale(1.16) translateX(-4%) } }
@keyframes dt-vang { 0% { opacity: 0; transform: translate(0,0) scale(.3) } 15% { opacity: 1 } 100% { opacity: 0; transform: translate(var(--dx),var(--dy)) scale(1) } }
@keyframes dt-hien { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes dt-nen-toi { to { opacity: .72 } }
.dt-hero { transform-origin: 50% 100% }
.dt-hero[data-h="tich_nang"] { animation: dt-tich .4s ease-in-out infinite alternate }
.dt-hero[data-h="tung_don"] { filter: drop-shadow(0 0 18px var(--dt-aura)) brightness(1.12) }
.dt-hero[data-h="bi_danh"] { animation: dt-bi-danh .8s ease-out forwards }
.dt-hero[data-h="guc"] { animation: dt-guc 1.4s ease-in forwards }
.dt-boss-to { animation: dt-phong 2.2s ease-in forwards; transform-origin: 50% 100% }
.dt-hien { animation: dt-hien .3s ease-out }
.dt-vang { animation: dt-vang 1.6s ease-out forwards }
@media (prefers-reduced-motion: reduce) { .dt-hero[data-h], .dt-boss-to, .dt-vang, .dt-hien { animation: none !important } .dt-vang { opacity: 0 } }
`

/** Chiều cao SÂN (px) theo khung nhìn — chừa ≥55% màn cho câu hỏi; hẹp (điện thoại dọc) thì co theo bề ngang để nhân vật + boss không chồng nhau. */
function useCaoSan() {
  const tinh = () => (typeof window === 'undefined' ? 360 : Math.round(Math.max(190, Math.min(420, window.innerHeight * 0.44, window.innerWidth * 0.5))))
  const [c, setC] = useState(tinh)
  useEffect(() => { const f = () => setC(tinh()); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f) }, [])
  return c
}
/** Mặt đất của sân (tỉ lệ từ trên xuống) — chân nhân vật + boss đứng ở đây (nền kit: điểm đứng y≈78% của khung 1672×600, cắt bớt trời). */
const DAT = 0.9

type Buoc = { p: TuTheDau; ms?: number } // không ms = giữ tới khi đổi trạng thái
/** Chuỗi tư thế theo trạng thái + đòn (bảng "Chuỗi động tác" của DESIGN.md bộ chiến đấu). `lap` = lặp cả chuỗi. */
function chuoi(tt: TtHero, don: Don | null): { b: Buoc[]; lap?: boolean } {
  switch (tt) {
    case 'nghi': return { b: [{ p: 'dung_1', ms: 900 }, { p: 'dung_2', ms: 900 }], lap: true }
    case 'tich_nang': return { b: [{ p: 'tich_nang_1', ms: 325 }, { p: 'tich_nang_2', ms: 325 }], lap: true }
    case 'tung_don': return don === 'set' || don === 'thien_thach' ? { b: [{ p: 'niem_troi_1', ms: 120 }, { p: 'niem_troi_2' }] }
      : don === 'cau_lua_lon' || don === 'cau_bang_lon' ? { b: [{ p: 'nem_truoc_1', ms: 150 }, { p: 'nem_truoc_2' }] } : { b: [{ p: 'phat_nho' }] }
    case 'bi_danh': return { b: [{ p: 'bi_danh_1', ms: 250 }, { p: 'bi_danh_2' }] }
    case 'guc': return { b: [{ p: 'guc' }] }
    case 'thang': return { b: [{ p: 'thang_1', ms: 550 }, { p: 'thang_2', ms: 550 }], lap: true }
  }
}
/** Tư thế đang hiện — chạy chuỗi bằng setTimeout (mỗi bước ≥120ms, không cần rAF). Giảm chuyển động ⇒ đứng ở bước cuối. */
function useTuThe(tt: TtHero, don: Don | null): TuTheDau {
  const { b, lap } = chuoi(tt, don)
  const [i, setI] = useState(0)
  const khoa = `${tt}|${don}`
  useEffect(() => {
    setI(0)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setI(lap ? 0 : b.length - 1); return }
    let k = 0, h = 0
    const buoc = () => { const ms = b[k].ms; if (ms === undefined) return; h = window.setTimeout(() => { k = k + 1 < b.length ? k + 1 : lap ? 0 : k; setI(k); buoc() }, ms) }
    buoc()
    return () => clearTimeout(h)
  }, [khoa]) // eslint-disable-line react-hooks/exhaustive-deps
  return b[Math.min(i, b.length - 1)].p
}
/** Nạp + giải mã trước 15 tư thế của giới này (đổi tư thế = đổi src, không nháy) + ảnh FX. */
function useNapTruoc(gioi: 'nam' | 'nu') {
  useEffect(() => {
    for (const p of TU_THE_DAU) { const im = new Image(); im.src = anhDau(gioi, p); im.decode?.().catch(() => undefined) }
    void napFx()
  }, [gioi])
}

type Pha = 'dang_danh' | 'dien' | 'sau_tran' | 'cuoi'

export interface DauTruongProps {
  /** 3 trận × 5 câu (server sinh một lần lúc bắt đầu lượt) */
  tran: CauTT[][]
  /** giới của nhân vật chính (học sinh nam/nữ) */
  gioi?: 'nam' | 'nu'
  /** hiện vòng gợi ý quanh đáp án đúng (chỉ trang xem thử) */
  goiY?: boolean
  /** ép đòn khi thắng (chỉ trang xem thử, để soi từng hiệu ứng) */
  epDon?: Don
  /** Điểm Rank server trả cho lượt (hiển thị trên màn kết quả) */
  diem?: (kq: KetThucLuot) => number
  /** lượt còn lại SAU lượt này (nút "Thử lại" xám khi 0) */
  luotConSau: number
  /** lượt đóng (vượt / thua / bỏ cuộc) — để cha ghi DB */
  onKetThuc: (kq: KetThucLuot) => void
  onThuLai: () => void
  onThoat: () => void
}

export function DauTruongHS({ tran, gioi = 'nam', goiY, epDon, diem, luotConSau, onKetThuc, onThuLai, onThoat }: DauTruongProps) {
  const [t, setT] = useState(0)
  const [c, setC] = useState(0)
  const [chon, setChon] = useState<number | null>(null)
  const [dungTran, setDungTran] = useState(0)
  const [thang, setThang] = useState<boolean[]>([])
  const [pha, setPha] = useState<Pha>('dang_danh')
  const [lyDo, setLyDo] = useState<KetThucLuot['lyDo']>('thua')
  const [hoiBo, setHoiBo] = useState(false)
  const [hero, setHero] = useState<TtHero>('nghi')
  const [boss, setBoss] = useState<TuTheBoss>('dung')
  const [mau, setMau] = useState(100)
  const [don, setDon] = useState<Don | null>(null)
  const [donCuoi, setDonCuoi] = useState<{ don: Don; muc: number } | null>(null)
  const sanCao = useCaoSan()
  const cao = Math.round(sanCao * 0.5) // cao THÂN nhân vật đứng (kit: 34% cảnh ≈ 53% vùng sân)
  const pose = useTuThe(hero, don)
  useNapTruoc(gioi)
  const skin = laySkin(null)
  const anhBoss = useRef<HTMLImageElement | null>(null)
  useEffect(() => { const src = skin.boss?.[BOSS]?.trung; if (src) { const im = new Image(); im.src = src; anhBoss.current = im } }, [skin])
  const daBao = useRef(false)
  const dangDien = useRef(false)
  const sanRef = useRef<HTMLDivElement>(null)
  const chuyenRef = useRef<HTMLDivElement>(null)
  const cvRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const bossRef = useRef<HTMLDivElement>(null)
  const loc = useRef<HTMLDivElement>(null)
  const poseBoss = useRef<'dung' | 'trung'>('dung')
  const rungRaf = useRef(0)

  const cau = tran[t]?.[c]
  const need = NGUONG[t]

  useEffect(() => () => cancelAnimationFrame(rungRaf.current), [])

  const ketThuc = (kq: KetThucLuot) => { if (daBao.current) return; daBao.current = true; onKetThuc(kq) }

  const chonDapAn = (i: number) => { if (chon === null && cau) { setChon(i); if (i === cau.dung) setDungTran((n) => n + 1) } }

  /** Rung cả sân (biên độ giảm dần) — thao tác thẳng DOM, không render lại theo khung hình. */
  const rung = useCallback((bien: number, ms: number) => {
    const el = chuyenRef.current; if (!el) return
    cancelAnimationFrame(rungRaf.current)
    const t0 = performance.now()
    const f = (now: number) => {
      const k = (now - t0) / ms
      if (k >= 1) { el.style.transform = ''; return }
      const a = bien * (1 - k)
      el.style.transform = `translate(${(Math.random() - 0.5) * 2 * a}px, ${(Math.random() - 0.5) * 2 * a}px)`
      rungRaf.current = requestAnimationFrame(f)
    }
    rungRaf.current = requestAnimationFrame(f)
  }, [])

  const hop = (el: HTMLElement | null): Hop => {
    const s = sanRef.current!.getBoundingClientRect(), r = el!.getBoundingClientRect()
    return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height }
  }

  /** Phát đòn lên sân; trả về khi xong (canvas dọn sạch, boss/nhân vật về tư thế đứng). */
  const dien = (d: Don): Promise<void> => {
    if (!sanRef.current || !cvRef.current || !heroRef.current || !bossRef.current) return Promise.resolve()
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return new Promise((r) => setTimeout(r, 500))
    const s = sanRef.current.getBoundingClientRect()
    const h = hop(heroRef.current), b = hop(bossRef.current)
    // điểm tay theo ảnh tư thế (combat-data.json): tích năng = tâm cầu giữa 2 tay · tung = tay đẩy ra của tư thế phóng của đòn này
    const tayCua = (p: TuTheDau) => { const v = hopDau(gioi, p, cao, h.w / 2, h.h), [tx, ty] = HERO_DAU[gioi][p].tay[0]; return { x: h.x + v.left + tx * v.width, y: h.y + v.top + ty * v.height } }
    const pPhong: TuTheDau = d === 'cau_lua_lon' || d === 'cau_bang_lon' ? 'nem_truoc_2' : 'phat_nho'
    return phatDon(cvRef.current, d, { W: s.width, H: s.height, hero: h, boss: b, tay: tayCua('tich_nang_2'), phong: tayCua(pPhong), bossAnh: anhBoss.current }, {
      rung,
      hero: setHero,
      boss: (tt: TtBoss) => {
        if (loc.current) loc.current.style.filter = LOC_BOSS[tt]
        const muon = tt === 'dung' ? 'dung' : 'trung'
        if (poseBoss.current !== muon) { poseBoss.current = muon; setBoss(muon) }
      },
    })
  }

  const tiep = async () => {
    if (chon === null || dangDien.current) return
    if (c + 1 < SO_CAU_TRAN) { setC(c + 1); setChon(null); return }
    // Hết 5 câu ⇒ chấm trận (bản thật: server trả thắng/thua) rồi phát ĐÒN theo % đúng.
    dangDien.current = true
    const w = dungTran >= need
    const muc = Math.round((dungTran / SO_CAU_TRAN) * 100)
    const d: Don = w ? (epDon ?? chonDon(muc)) : 'boss_ma_thuat'
    const ds = [...thang, w]
    setThang(ds); setChon(null); setDon(d); setDonCuoi({ don: d, muc }); setPha('dien')
    if (!w) setBoss('chieu')
    await new Promise((r) => setTimeout(r, 60)) // chờ DOM sân cập nhật
    await dien(d)
    dangDien.current = false
    if (loc.current) loc.current.style.filter = ''
    poseBoss.current = 'dung'
    if (!w) { setLyDo('thua'); setPha('cuoi'); setHero('guc'); setBoss('gian'); ketThuc({ thang: ds, lyDo: 'thua' }) }
    else if (t + 1 >= SO_TRAN) { setLyDo('vuot'); setMau(0); setBoss('ha'); setHero('thang'); setPha('cuoi'); ketThuc({ thang: ds, lyDo: 'vuot' }) }
    else { setMau((m) => Math.max(8, m - (MAT_MAU[muc] ?? 18))); setBoss('dung'); setHero('nghi'); setPha('sau_tran') }
  }

  const tranKe = () => { setT(t + 1); setC(0); setDungTran(0); setChon(null); setPha('dang_danh'); setHero('nghi'); setBoss('dung'); setDon(null) }

  const boCuoc = () => {
    setHoiBo(false); setLyDo('bo_cuoc'); setPha('cuoi'); setHero('guc'); setBoss('gian'); setChon(null)
    ketThuc({ thang, lyDo: 'bo_cuoc' })
  }

  const heroW = Math.round(cao * 0.62)
  const hv = hopDau(gioi, pose, cao, heroW / 2, cao) // THÂN đứng cao đúng `cao`, chân tư thế hiện tại chạm đáy hộp
  const kqCuoi: KetThucLuot = { thang, lyDo }
  const soThang = thang.filter(Boolean).length
  const bossCao = Math.round(cao * 1.2)
  const day = Math.round(sanCao * (1 - DAT))
  const vuot = pha === 'cuoi' && lyDo === 'vuot'
  const thua = pha === 'cuoi' && lyDo !== 'vuot'

  const loiDan = pha === 'dang_danh'
    ? [`Trận đầu — khởi động nào! Cần đúng ${NGUONG[0]}/${SO_CAU_TRAN}.`, `Trận 2 khó hơn rồi, cần đúng ${NGUONG[1]}/${SO_CAU_TRAN}!`, 'Trận cuối! Phải đúng cả 5 câu — em làm được!'][t]
    : pha === 'dien' ? 'Xem đòn của em nào…'
      : pha === 'sau_tran' ? (donCuoi && donCuoi.muc >= 100 ? 'Hoàn hảo! Đòn tuyệt đỉnh luôn!' : donCuoi && donCuoi.muc >= 80 ? 'Rất tốt! Boss loạng choạng rồi.' : 'Vừa đủ thắng. Trận sau cẩn thận hơn nhé.')
        : vuot ? 'Em đã hạ được boss! Giỏi quá!' : lyDo === 'bo_cuoc' ? 'Không sao, lần sau mình thử lại nhé.' : 'Đừng nản. Ôn lại dạng vừa sai rồi quay lại nhé!'

  return (
    <ManHS className="!gap-2.5">
      <style>{CSS}</style>
      <DauTrangHS tieuDe="Đấu trường" phu={`Trận ${t + 1}/${SO_TRAN} · cần đúng ${need}/${SO_CAU_TRAN}`}
        phai={<div className="flex items-center gap-2">
          <Pips thang={thang} t={t} pha={pha} />
          {(pha === 'dang_danh' || pha === 'sau_tran') && <NutHS phu className="!h-9 !px-3 !text-[13px]" onClick={() => setHoiBo(true)}>Bỏ cuộc</NutHS>}
        </div>} />

      {/* ── SÂN ĐẤU: nhân vật chính trái · boss phải + thanh máu · canvas hiệu ứng phủ lên ── */}
      <div ref={sanRef} className="relative overflow-hidden rounded-[18px]" style={{ ...THE, height: sanCao, padding: 0 }}>
        <div ref={chuyenRef} className="absolute inset-0">
          {skin.sanDau
            ? <img src={skin.sanDau} alt="" draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" style={{ objectPosition: '50% 72%' }} />
            : <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 90% at 70% 100%, var(--sk-surface2) 0%, transparent 70%)' }} />}
          {thua && <div className="pointer-events-none absolute inset-0 z-[5]" style={{ background: 'var(--sk-bg)', opacity: 0, animation: 'dt-nen-toi 1.6s ease-in .4s forwards' }} />}
          <div ref={heroRef} className="absolute z-10" style={{
            bottom: day, height: cao, width: heroW, left: vuot ? '50%' : '9%', transform: vuot ? 'translateX(-50%)' : undefined, transition: 'left .9s ease-in-out',
            ['--dt-aura' as string]: don ? AURA[don] : 'transparent',
          } as CSSProperties}>
            <span className="pointer-events-none absolute left-1/2 rounded-[50%]" style={{ bottom: -cao * 0.03, width: cao * 0.5, height: cao * 0.08, transform: 'translateX(-50%)', background: 'radial-gradient(closest-side, rgba(0,0,0,.45), transparent)' }} />
            <div className="dt-hero relative h-full w-full" data-h={hero} key={`h-${hero}`}>
              <img src={anhDau(gioi, pose)} alt="" draggable={false} className="absolute max-w-none select-none" style={{ left: hv.left, top: hv.top, width: hv.width, height: hv.height }} />
            </div>
          </div>
          <div className="absolute right-[5%] z-10 flex flex-col items-center" style={{ bottom: day, width: bossCao + 8 }}>
            <ThanhMau pct={mau} />
            <div ref={bossRef} className={thua ? 'dt-boss-to' : ''} style={{ width: bossCao, height: bossCao }}>
              <div ref={loc} style={{ transition: 'filter .08s' }}><BossAnhHS ma={BOSS} tt={boss} cao={bossCao} /></div>
            </div>
          </div>
          {vuot && <Vang />}
        </div>
        <canvas ref={cvRef} className="pointer-events-none absolute inset-0 z-30 h-full w-full" />
      </div>

      {/* ── KHUNG DƯỚI: câu hỏi | đang diễn đòn | kết quả trận | kết quả cuối ── */}
      {pha === 'dang_danh' && cau && (
        <TheHS className="dt-hien flex flex-col gap-3 p-3.5 md:p-4" key={`q-${t}-${c}`}>
          <div className="flex flex-wrap items-center gap-2">
            <NhanHS dac>Câu {c + 1}/{SO_CAU_TRAN}</NhanHS>
            <NhanHS mau={cau.doKho === 'cao' ? MAU.sai : cau.doKho === 'vua' ? MAU.canhBao : MAU.dung}>{NHAN_DO_KHO[cau.doKho]}</NhanHS>
            <span className="flex-1" />
            <span className="text-[12.5px]" style={{ color: MAU.muted }}>Cần đúng {need}/{SO_CAU_TRAN}</span>
          </div>
          {c === 0 && <NguoiDan loi={loiDan} />}
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
                {chon === cau.dung ? 'Đúng rồi!' : `Chưa đúng — đáp án ${CHU[cau.dung]}.`}
              </p>
              <NutHS onClick={tiep}>{c + 1 < SO_CAU_TRAN ? 'Câu tiếp ›' : 'Kết thúc trận'}</NutHS>
            </div>
          )}
        </TheHS>
      )}

      {pha === 'dien' && (
        <TheHS className="dt-hien flex flex-col items-center gap-1.5 p-5 text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em]" style={{ color: MAU.muted }}>
            {donCuoi && thang[thang.length - 1] ? `Đúng ${donCuoi.muc}% — tung đòn` : 'Chưa đủ số câu đúng…'}
          </p>
          <p className="text-[26px] font-extrabold" style={{ ...HEAD, color: MAU.acc }}>{don ? TEN_DON[don] : ''}</p>
        </TheHS>
      )}

      {pha === 'sau_tran' && (
        <TheHS className="dt-hien flex flex-col items-center gap-2 p-5 text-center">
          <p className="text-[26px] font-extrabold" style={{ ...HEAD, color: MAU.acc }}>Thắng trận {t + 1}!</p>
          <p className="text-[15px]" style={{ color: MAU.ink }}>
            Đúng {dungTran}/{SO_CAU_TRAN} ({donCuoi?.muc}%) · đòn: {donCuoi ? TEN_DON[donCuoi.don] : ''}. Trận kế cần đúng {NGUONG[t + 1]}/{SO_CAU_TRAN}.
          </p>
          <NguoiDan loi={loiDan} />
          <NutHS onClick={tranKe} className="mt-1 !px-8">Vào trận {t + 2} ›</NutHS>
        </TheHS>
      )}

      {pha === 'cuoi' && (
        <TheHS className="dt-hien flex flex-col items-center gap-2.5 p-5 text-center" style={{ animationDelay: '.5s', animationFillMode: 'backwards' }}>
          <p className="text-[28px] font-extrabold" style={{ ...HEAD, color: vuot ? MAU.acc : MAU.ink }}>
            {vuot ? 'Vượt Thử thách!' : lyDo === 'bo_cuoc' ? 'Em đã bỏ cuộc' : `Thua ở trận ${thang.length}`}
          </p>
          <Pips thang={thang} t={thang.length} pha="cuoi" lon />
          <NguoiDan loi={loiDan} />
          <p className="text-[14px]" style={{ color: MAU.muted }}>
            Thắng {soThang}/{SO_TRAN} trận{diem ? ` · +${diem(kqCuoi)} Điểm Rank` : ''} · hôm nay còn {luotConSau}/2 lượt{lyDo === 'bo_cuoc' ? ' · bỏ cuộc vẫn bị trừ lượt' : ''}
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

/** Người dẫn truyện (bé gái chibi, cắt vùng mặt) + lời thoại ngắn. Không phải nhân vật chính. */
function NguoiDan({ loi }: { loi: string }) {
  const a = laySkin(null).nhanVat?.[DAN]
  const S = 44
  return (
    <div className="flex items-center gap-2.5 text-left">
      <span className="relative block shrink-0 overflow-hidden rounded-full" style={{ width: S, height: S, border: '2px solid var(--sk-acc)', background: 'var(--sk-surface2)' }}>
        {a && <img src={a} alt="" draggable={false} className="absolute max-w-none select-none" style={{ width: S * 3, left: -S * 1.36, top: -S * 0.28 }} />}
      </span>
      <p className="rounded-[12px] px-3 py-1.5 text-[13.5px] font-semibold leading-snug" style={{ background: 'var(--sk-surface2)', border: '1px solid var(--sk-line)', color: MAU.ink }}>{loi}</p>
    </div>
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

/** Thanh máu boss (0–100): chỉ tụt khi trúng đòn sau mỗi trận, không nhảy theo từng câu. */
function ThanhMau({ pct }: { pct: number }) {
  return (
    <div className="relative mb-1 w-[88%]" aria-label={`Máu boss ${pct}%`}>
      <div className="rounded-full p-1" style={{ background: 'var(--sk-bg)', border: '1.5px solid var(--sk-line)' }}>
        <div className="h-3 rounded-full" style={{ width: `${pct}%`, background: MAU.sai, transition: 'width 1s ease-out' }} />
      </div>
    </div>
  )
}

/** Hạt vàng bung quanh nhân vật lúc hạ gục boss (thuần CSS, lặp). */
function Vang() {
  const hat = Array.from({ length: 28 }, (_, i) => {
    const a = (i * 137.5) * Math.PI / 180, r = 60 + ((i * 53) % 110)
    return { dx: Math.round(Math.cos(a) * r), dy: Math.round(Math.sin(a) * r * 0.8 - 20), d: (i % 7) * 0.09, s: 5 + (i % 4) * 2 }
  })
  return (
    <div className="pointer-events-none absolute z-20" style={{ left: '50%', bottom: '45%' }}>
      {hat.map((h, i) => (
        <span key={i} className="dt-vang absolute rounded-full" style={{ width: h.s, height: h.s, background: 'var(--sk-acc)', boxShadow: '0 0 8px var(--sk-acc)', animationDelay: `${h.d}s`, animationIterationCount: 'infinite', ['--dx' as string]: `${h.dx}px`, ['--dy' as string]: `${h.dy}px` } as CSSProperties} />
      ))}
    </div>
  )
}
