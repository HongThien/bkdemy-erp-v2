// Form khảo sát "Bạn của con ở BK" — TRÒ CHƠI 3 PHÚT cho trẻ trên iPad (spec-khao-sat-hs.md §2, §4).
// Một câu một màn · chữ ≥20px · nút ≥56px · option là thẻ to bấm cả thẻ · chip tên bạn · confetti nhẹ mỗi "Tiếp",
// confetti thật màn cuối. Không scifi HUD — tông sáng, tròn, màu vui (Baloo 2). Dùng chung cho PWA iPad + ERP.
// Luật cứng §0: KHÔNG nhắc phần thưởng ở màn 1–9 (chỉ màn kết thúc). Câu 1–2 bắt buộc, còn lại bỏ qua được.
// Mất mạng giữa chừng: state trong memory, nộp lại được — không mất bài. Chưa nộp = không có dòng nào (§1.5).
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  nopKhaoSat, type CanhPayload, type CoKhong, type DanhSach, type HsLuoi, type KetQuaRu, type LyDoVao, type NoiO, type QuanHe, type QuenTu,
  LY_DO_LABEL, CO_KHONG_LABEL, QUEN_TU_LABEL, QUAN_HE_LABEL, KET_QUA_RU_LABEL,
} from '../../lib/khaosat'

type BanBk = { ten: string; quen_tu: QuenTu | null; quan_he: QuanHe | null }
type DaRu = { ten: string; ket_qua_ru: KetQuaRu | null }
type MuonRu = { ten: string; ghi_chu: string }
type Step = 'truong' | 'noi_o' | 'ban_bk' | 'ly_do' | 'ai_ru' | 'da_ru' | 'ban_ph' | 'chuc_vu' | 'nghe' | 'muon_ru'
const SO_CAU: Record<Step, number> = { truong: 1, noi_o: 2, ban_bk: 3, ly_do: 4, ai_ru: 5, da_ru: 6, ban_ph: 7, chuc_vu: 8, nghe: 8, muon_ru: 9 }
const KHAC = '__khac__'
const FONT = "'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif"
const NEN = 'linear-gradient(180deg, #DDF3FF 0%, #EEF6FF 45%, #FFF4E5 100%)'

// iOS không co layout viewport khi bàn phím hiện → đo visualViewport để nút "Tiếp" luôn nổi trên bàn phím (§4).
function useVisualHeight() {
  const [h, setH] = useState<number | null>(null)
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const f = () => { setH(vv.height); window.scrollTo(0, 0) }
    f(); vv.addEventListener('resize', f); vv.addEventListener('scroll', f)
    return () => { vv.removeEventListener('resize', f); vv.removeEventListener('scroll', f) }
  }, [])
  return h
}

// Confetti canvas nhẹ, không thư viện.
type Hat = { x: number; y: number; vx: number; vy: number; c: string; s: number; r: number; vr: number; t: number }
const MAU = ['#FF5D78', '#FFC53D', '#4DC47A', '#2F73F6', '#8B6BEF', '#FF8A3D', '#39C6D6']
function useConfetti() {
  const ref = useRef<HTMLCanvasElement>(null)
  const hats = useRef<Hat[]>([])
  const raf = useRef(0)
  const tick = () => {
    const cv = ref.current; if (!cv) return
    const g = cv.getContext('2d'); if (!g) return
    g.clearRect(0, 0, cv.width, cv.height)
    hats.current = hats.current.filter((h) => h.t > 0 && h.y < cv.height + 20)
    for (const h of hats.current) {
      h.x += h.vx; h.y += h.vy; h.vy += 0.18; h.vx *= 0.99; h.r += h.vr; h.t -= 1
      g.save(); g.translate(h.x, h.y); g.rotate(h.r); g.fillStyle = h.c; g.globalAlpha = Math.min(1, h.t / 30)
      g.fillRect(-h.s / 2, -h.s / 2, h.s, h.s * 0.6); g.restore()
    }
    if (hats.current.length) raf.current = requestAnimationFrame(tick)
  }
  const burst = (n: number, big = false) => {
    const cv = ref.current; if (!cv) return
    cv.width = cv.clientWidth; cv.height = cv.clientHeight
    const cx = cv.width / 2, cy = big ? cv.height * 0.45 : cv.height - 90
    for (let i = 0; i < n; i++) {
      const a = (big ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * 1.6), v = (big ? 4 : 5) + Math.random() * (big ? 9 : 6)
      hats.current.push({ x: cx + (Math.random() - 0.5) * (big ? 200 : 120), y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: MAU[i % MAU.length], s: 7 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, t: big ? 170 : 70 })
    }
    cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(tick)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  return { ref, burst }
}

// ── Primitives cho trẻ: thẻ to, pill, chip ──────────────────────────────────────────────────────
function The({ on, onClick, children, small }: { on: boolean; onClick: () => void; children: ReactNode; small?: boolean }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full rounded-2xl border-[3px] text-left font-bold transition active:scale-[0.98] ${small ? 'min-h-[52px] px-4 py-2.5 text-[18px]' : 'min-h-[64px] px-5 py-4 text-[21px]'} ${on ? 'border-[#8B6BEF] bg-[#EFE9FF] text-[#4B3AA8] shadow-md' : 'border-white bg-white/90 text-slate-700 shadow-sm'}`}>
      <span className="flex items-center gap-3">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[3px] text-[15px] ${on ? 'border-[#8B6BEF] bg-[#8B6BEF] text-white' : 'border-slate-300 bg-white text-transparent'}`}>✓</span>
        <span className="flex-1">{children}</span>
      </span>
    </button>
  )
}
function Pill<T extends string>({ value, onChange, options, label }: { value: T | null; onChange: (v: T) => void; options: Record<T, string>; label: string }) {
  return (
    <div className="mt-2">
      <div className="mb-1 text-[15px] font-semibold text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(options) as T[]).map((k) => (
          <button key={k} type="button" onClick={() => onChange(k)}
            className={`min-h-[44px] rounded-full border-2 px-4 text-[16px] font-bold transition active:scale-95 ${value === k ? 'border-[#2F73F6] bg-[#2F73F6] text-white' : 'border-slate-200 bg-white text-slate-600'}`}>{options[k]}</button>
        ))}
      </div>
    </div>
  )
}
function ONhap({ value, onChange, placeholder, onEnter, type = 'text', inputMode, autoFocus, className = '' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; onEnter?: () => void; type?: string; inputMode?: 'text' | 'numeric'; autoFocus?: boolean; className?: string
}) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} inputMode={inputMode} autoFocus={autoFocus}
      onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) { e.preventDefault(); onEnter() } }}
      className={`h-[60px] w-full rounded-2xl border-[3px] border-white bg-white px-5 text-[21px] font-bold text-slate-800 shadow-sm outline-none placeholder:font-semibold placeholder:text-slate-300 focus:border-[#8B6BEF] ${className}`} />
  )
}
// Ô thêm tên: gõ + Enter hoặc bấm "+ Thêm bạn" → chip.
function ThemTen({ onAdd, placeholder = 'Gõ tên bạn…' }: { onAdd: (ten: string) => void; placeholder?: string }) {
  const [v, setV] = useState('')
  const add = () => { const t = v.trim(); if (!t) return; onAdd(t); setV('') }
  return (
    <div className="flex gap-2">
      <ONhap value={v} onChange={setV} placeholder={placeholder} onEnter={add} className="flex-1" />
      <button type="button" onClick={add} disabled={!v.trim()} className="h-[60px] shrink-0 rounded-2xl bg-[#4DC47A] px-5 text-[19px] font-extrabold text-white shadow-md active:scale-95 disabled:opacity-40">+ Thêm bạn</button>
    </div>
  )
}
function Chip({ ten, onXoa, children }: { ten: string; onXoa: () => void; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border-[3px] border-[#CFE5FF] bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FFC53D] to-[#FF8A3D] text-[17px] font-extrabold text-white">{ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase()}</span>
        <span className="flex-1 text-[20px] font-extrabold text-slate-800">{ten}</span>
        <button type="button" onClick={onXoa} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[18px] font-bold text-slate-400 active:bg-rose-100 active:text-rose-500" aria-label="Xoá">✕</button>
      </div>
      {children}
    </div>
  )
}
function CauHoi({ children, phu }: { children: ReactNode; phu?: ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-[26px] font-extrabold leading-tight text-slate-800 sm:text-[30px]">{children}</h2>
      {phu && <p className="mt-1 text-[16px] font-semibold text-slate-500">{phu}</p>}
    </div>
  )
}

export default function KhaoSatForm({ hs, taBamHo, danhSach, onDone, onCancel }: {
  hs: HsLuoi; taBamHo: boolean; danhSach: DanhSach; onDone: () => void; onCancel: () => void
}) {
  const vh = useVisualHeight()
  const { ref: cvRef, burst } = useConfetti()
  // Điền sẵn từ hồ sơ HS (nếu đã có) — trẻ chỉ xác nhận. Giá trị ngoài danh sách → "Khác" + ô gõ.
  const [truong, setTruong] = useState<string>(() => (hs.truong_hoc ? (danhSach.truong.includes(hs.truong_hoc) ? hs.truong_hoc : KHAC) : ''))
  const [truongKhac, setTruongKhac] = useState(hs.truong_hoc && !danhSach.truong.includes(hs.truong_hoc) ? hs.truong_hoc : '')
  const [lopTruong, setLopTruong] = useState(hs.lop_truong ?? '')
  const [noiO, setNoiO] = useState<NoiO | null>(hs.noi_o_loai)
  const [toa, setToa] = useState<string>(() => (hs.toa ? (danhSach.toa.includes(hs.toa) ? hs.toa : KHAC) : ''))
  const [toaKhac, setToaKhac] = useState(hs.toa && !danhSach.toa.includes(hs.toa) ? hs.toa : '')
  const [tang, setTang] = useState(hs.tang != null ? String(hs.tang) : '')
  const [khu, setKhu] = useState(hs.khu ?? '')
  const [banBk, setBanBk] = useState<BanBk[]>([])
  const [lyDo, setLyDo] = useState<LyDoVao | null>(null)
  const [aiRu, setAiRu] = useState<string[]>([])
  const [daRu, setDaRu] = useState<'chua' | 'roi' | null>(null)
  const [daRuList, setDaRuList] = useState<DaRu[]>([])
  const [banPh, setBanPh] = useState<CoKhong | null>(null)
  const [chucVu, setChucVu] = useState<CoKhong | null>(null)
  const [nghe, setNghe] = useState('')
  const [muonRu, setMuonRu] = useState<'chua' | 'co' | null>(null)
  const [muonRuList, setMuonRuList] = useState<MuonRu[]>([])
  const [i, setI] = useState(0)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [xong, setXong] = useState(false)

  const steps = useMemo<Step[]>(() => ['truong', 'noi_o', 'ban_bk', 'ly_do', ...(lyDo === 'ban_ru' ? (['ai_ru'] as Step[]) : []), 'da_ru', 'ban_ph', 'chuc_vu', 'nghe', 'muon_ru'], [lyDo])
  const step = steps[Math.min(i, steps.length - 1)]
  const cuoi = i >= steps.length - 1
  const truongVal = truong === KHAC ? truongKhac.trim() : truong
  const toaVal = toa === KHAC ? toaKhac.trim() : toa
  const okTiep =
    step === 'truong' ? !!truongVal && !!lopTruong.trim()
    : step === 'noi_o' ? !!noiO && (noiO === 'nha_dat' || (!!toaVal && /^\d{1,3}$/.test(tang.trim())))
    : true

  // Cuộn lên đầu mỗi khi đổi câu (câu dài như "bạn BK" có thể cuộn xuống dưới).
  const mainRef = useRef<HTMLDivElement>(null)
  useEffect(() => { mainRef.current?.scrollTo({ top: 0 }) }, [i])
  // Màn kết thúc: tự quay về lưới lớp sau 3s (§1 luồng TA).
  useEffect(() => { if (!xong) return; const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [xong]) // eslint-disable-line

  async function tiep() {
    if (!okTiep || busy) return
    if (!cuoi) { burst(26); setI(i + 1); return }
    setBusy(true); setLoi(null)
    try {
      const quan_he: CanhPayload[] = [
        ...banBk.map((b): CanhPayload => ({ loai: 'biet', ten: b.ten, quen_tu: b.quen_tu, quan_he: b.quan_he })),
        ...(lyDo === 'ban_ru' ? aiRu.map((t): CanhPayload => ({ loai: 'duoc_ru_boi', ten: t })) : []),
        ...(daRu === 'roi' ? daRuList.map((d): CanhPayload => ({ loai: 'da_ru', ten: d.ten, ket_qua_ru: d.ket_qua_ru })) : []),
        ...(muonRu === 'co' ? muonRuList.map((m): CanhPayload => ({ loai: 'muon_ru', ten: m.ten, ghi_chu: m.ghi_chu })) : []),
      ]
      await nopKhaoSat({
        hoc_sinh_id: hs.hoc_sinh_id, ta_bam_ho: taBamHo,
        truong: truongVal, lop_truong: lopTruong.trim(), noi_o_loai: noiO!,
        toa: noiO === 'chung_cu' ? toaVal : undefined, tang: noiO === 'chung_cu' ? tang.trim() : undefined, khu: noiO === 'nha_dat' ? khu.trim() : undefined,
        ly_do_vao: lyDo, bo_me_ban_ph_lop: banPh, bo_me_chuc_vu_toa: chucVu, nghe_bo_me: nghe.trim() || undefined, quan_he,
      })
      setXong(true); setTimeout(() => burst(160, true), 50)
    } catch (e: any) {
      // Mất mạng / lỗi server: giữ nguyên state, cho bấm nộp lại (§4).
      setLoi(e?.message?.includes('Failed to fetch') ? 'Mất mạng rồi — kiểm tra wifi rồi bấm Nộp lại nhé' : (e?.message ?? String(e)))
    } finally { setBusy(false) }
  }

  const tenNgan = hs.ho_ten.trim().split(/\s+/).slice(-2).join(' ')
  const daLam = steps.slice(0, i).map((s) => SO_CAU[s])
  const dots = Array.from({ length: 9 }, (_, k) => k + 1).map((n) => ({ n, on: daLam.includes(n) || xong, hienTai: !xong && SO_CAU[step] === n }))

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden text-slate-800" style={{ height: vh ?? '100dvh', background: NEN, fontFamily: FONT }}>
      <canvas ref={cvRef} className="pointer-events-none absolute inset-0 z-[60] h-full w-full" />
      {xong ? (
        // Màn kết thúc — nơi DUY NHẤT nhắc quà (§0.1).
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <img src="/bk-ui/mascot_cheer.png" alt="" className="mb-4 h-44 w-44 object-contain drop-shadow-lg sm:h-56 sm:w-56" />
          <h1 className="text-[36px] font-extrabold leading-tight text-[#4B3AA8] sm:text-[44px]">🎉 Xong rồi! Cảm ơn {tenNgan}.</h1>
          <p className="mt-3 max-w-[560px] text-[20px] font-semibold text-slate-600 sm:text-[22px]">Rủ được bạn vào học, cả con và bạn đều có quà nhé.</p>
          <button type="button" onClick={onDone} className="mt-8 h-14 rounded-2xl bg-white px-8 text-[18px] font-extrabold text-[#4B3AA8] shadow-md active:scale-95">Về lưới lớp</button>
        </div>
      ) : (
        <>
          <header className="flex items-center gap-3 px-4 pt-[max(10px,env(safe-area-inset-top))] pb-2">
            <button type="button" onClick={() => (i === 0 ? onCancel() : setI(i - 1))} className="h-11 shrink-0 rounded-full bg-white/80 px-4 text-[15px] font-bold text-slate-500 active:bg-white">‹ {i === 0 ? 'Thoát' : 'Quay lại'}</button>
            <div className="flex flex-1 items-center justify-center gap-1.5">
              {dots.map((d) => <span key={d.n} className={`h-3 rounded-full transition-all ${d.hienTai ? 'w-7 bg-[#8B6BEF]' : d.on ? 'w-3 bg-[#4DC47A]' : 'w-3 bg-white'}`} />)}
            </div>
            <span className="max-w-[40%] shrink-0 truncate rounded-full bg-white/80 px-4 py-2 text-[15px] font-bold text-[#2F73F6]">{taBamHo ? '🧑‍🏫 ' : '🙋 '}{tenNgan}</span>
          </header>

          <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-8">
            <div className="mx-auto w-full max-w-[720px]">
              {step === 'truong' && (
                <>
                  <CauHoi>Con học <span className="text-[#2F73F6]">trường</span> nào, <span className="text-[#2F73F6]">lớp</span> nào?</CauHoi>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {danhSach.truong.map((t) => <The key={t} small on={truong === t} onClick={() => setTruong(t)}>{t}</The>)}
                    <The small on={truong === KHAC} onClick={() => setTruong(KHAC)}>Trường khác…</The>
                  </div>
                  {truong === KHAC && <div className="mt-3"><ONhap value={truongKhac} onChange={setTruongKhac} placeholder="Gõ tên trường của con" autoFocus /></div>}
                  <div className="mt-4 text-[17px] font-bold text-slate-500">Lớp mấy ở trường? (vd 7A3)</div>
                  <div className="mt-1 max-w-[280px]"><ONhap value={lopTruong} onChange={setLopTruong} placeholder="7A3" /></div>
                </>
              )}

              {step === 'noi_o' && (
                <>
                  <CauHoi>Con ở <span className="text-[#2F73F6]">đâu</span>?</CauHoi>
                  <div className="grid grid-cols-2 gap-2">
                    <The on={noiO === 'chung_cu'} onClick={() => setNoiO('chung_cu')}>🏢 Chung cư</The>
                    <The on={noiO === 'nha_dat'} onClick={() => setNoiO('nha_dat')}>🏡 Nhà đất</The>
                  </div>
                  {noiO === 'chung_cu' && (
                    <>
                      <div className="mt-4 text-[17px] font-bold text-slate-500">Toà nào?</div>
                      <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {danhSach.toa.map((t) => <The key={t} small on={toa === t} onClick={() => setToa(t)}>{t}</The>)}
                        <The small on={toa === KHAC} onClick={() => setToa(KHAC)}>Toà khác…</The>
                      </div>
                      {toa === KHAC && <div className="mt-3"><ONhap value={toaKhac} onChange={setToaKhac} placeholder="Gõ tên toà" autoFocus /></div>}
                      <div className="mt-4 text-[17px] font-bold text-slate-500">Tầng mấy?</div>
                      <div className="mt-1 max-w-[200px]"><ONhap value={tang} onChange={(v) => setTang(v.replace(/\D/g, '').slice(0, 3))} placeholder="12" inputMode="numeric" /></div>
                    </>
                  )}
                  {noiO === 'nha_dat' && (
                    <>
                      <div className="mt-4 text-[17px] font-bold text-slate-500">Khu nào? (không nhớ thì bỏ qua)</div>
                      <div className="mt-1"><ONhap value={khu} onChange={setKhu} placeholder="vd: An Thọ, Lại Yên…" /></div>
                    </>
                  )}
                </>
              )}

              {step === 'ban_bk' && (
                <>
                  <CauHoi phu="Không biết bạn nào cũng không sao — bấm Tiếp.">Kể tên <span className="text-[#2F73F6]">các bạn đang học BK</span> mà con biết</CauHoi>
                  <ThemTen onAdd={(t) => setBanBk([...banBk, { ten: t, quen_tu: null, quan_he: null }])} />
                  <div className="mt-3 flex flex-col gap-2">
                    {banBk.map((b, k) => (
                      <Chip key={k} ten={b.ten} onXoa={() => setBanBk(banBk.filter((_, j) => j !== k))}>
                        <Pill label="Quen từ đâu?" value={b.quen_tu} options={QUEN_TU_LABEL} onChange={(v) => setBanBk(banBk.map((x, j) => (j === k ? { ...x, quen_tu: v } : x)))} />
                        <Pill label="Ai chơi với ai?" value={b.quan_he} options={QUAN_HE_LABEL} onChange={(v) => setBanBk(banBk.map((x, j) => (j === k ? { ...x, quan_he: v } : x)))} />
                      </Chip>
                    ))}
                  </div>
                </>
              )}

              {step === 'ly_do' && (
                <>
                  <CauHoi>Con vào BK <span className="text-[#2F73F6]">vì sao</span>?</CauHoi>
                  <div className="flex flex-col gap-2">
                    {(Object.keys(LY_DO_LABEL) as LyDoVao[]).map((k) => <The key={k} on={lyDo === k} onClick={() => setLyDo(k)}>{LY_DO_LABEL[k]}</The>)}
                  </div>
                </>
              )}

              {step === 'ai_ru' && (
                <>
                  <CauHoi><span className="text-[#2F73F6]">Bạn nào</span> rủ con?</CauHoi>
                  <ThemTen onAdd={(t) => setAiRu([...aiRu, t])} />
                  <div className="mt-3 flex flex-col gap-2">{aiRu.map((t, k) => <Chip key={k} ten={t} onXoa={() => setAiRu(aiRu.filter((_, j) => j !== k))} />)}</div>
                </>
              )}

              {step === 'da_ru' && (
                <>
                  <CauHoi>Con đã <span className="text-[#2F73F6]">rủ bạn nào</span> vào BK chưa?</CauHoi>
                  <div className="grid grid-cols-2 gap-2">
                    <The on={daRu === 'chua'} onClick={() => setDaRu('chua')}>Chưa</The>
                    <The on={daRu === 'roi'} onClick={() => setDaRu('roi')}>Rồi</The>
                  </div>
                  {daRu === 'roi' && (
                    <div className="mt-4">
                      <ThemTen onAdd={(t) => setDaRuList([...daRuList, { ten: t, ket_qua_ru: null }])} />
                      <div className="mt-3 flex flex-col gap-2">
                        {daRuList.map((d, k) => (
                          <Chip key={k} ten={d.ten} onXoa={() => setDaRuList(daRuList.filter((_, j) => j !== k))}>
                            <Pill label="Bạn có vào học không?" value={d.ket_qua_ru} options={KET_QUA_RU_LABEL} onChange={(v) => setDaRuList(daRuList.map((x, j) => (j === k ? { ...x, ket_qua_ru: v } : x)))} />
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 'ban_ph' && (
                <>
                  <CauHoi>Mẹ/bố con có <span className="text-[#2F73F6]">công tác trong ban phụ huynh lớp</span> không?</CauHoi>
                  <div className="flex flex-col gap-2">{(Object.keys(CO_KHONG_LABEL) as CoKhong[]).map((k) => <The key={k} on={banPh === k} onClick={() => setBanPh(k)}>{CO_KHONG_LABEL[k]}</The>)}</div>
                </>
              )}

              {step === 'chuc_vu' && (
                <>
                  <CauHoi>Mẹ/bố con có <span className="text-[#2F73F6]">chức vụ gì trong toà nhà</span> không?</CauHoi>
                  <div className="flex flex-col gap-2">{(Object.keys(CO_KHONG_LABEL) as CoKhong[]).map((k) => <The key={k} on={chucVu === k} onClick={() => setChucVu(k)}>{CO_KHONG_LABEL[k]}</The>)}</div>
                </>
              )}

              {step === 'nghe' && (
                <>
                  <CauHoi phu="Không biết thì bỏ qua nhé.">Bố mẹ con <span className="text-[#2F73F6]">làm nghề gì</span>?</CauHoi>
                  <ONhap value={nghe} onChange={setNghe} placeholder="vd: bác sĩ, kỹ sư, bán hàng…" />
                </>
              )}

              {step === 'muon_ru' && (
                <>
                  <CauHoi>Con có đang <span className="text-[#2F73F6]">muốn rủ bạn nào</span> vào học cùng không?</CauHoi>
                  <div className="grid grid-cols-2 gap-2">
                    <The on={muonRu === 'chua'} onClick={() => setMuonRu('chua')}>Chưa</The>
                    <The on={muonRu === 'co'} onClick={() => setMuonRu('co')}>Có</The>
                  </div>
                  {muonRu === 'co' && (
                    <div className="mt-4">
                      <ThemTen onAdd={(t) => setMuonRuList([...muonRuList, { ten: t, ghi_chu: '' }])} />
                      <div className="mt-3 flex flex-col gap-2">
                        {muonRuList.map((m, k) => (
                          <Chip key={k} ten={m.ten} onXoa={() => setMuonRuList(muonRuList.filter((_, j) => j !== k))}>
                            <div className="mt-2">
                              <div className="mb-1 text-[15px] font-semibold text-slate-500">Bạn học lớp nào / ở toà nào?</div>
                              <input value={m.ghi_chu} onChange={(e) => setMuonRuList(muonRuList.map((x, j) => (j === k ? { ...x, ghi_chu: e.target.value } : x)))} placeholder="vd: 7A3 · Gemek 2"
                                className="h-[48px] w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-[18px] font-bold text-slate-800 outline-none focus:border-[#8B6BEF]" />
                            </div>
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>

          <footer className="px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-2 sm:px-8">
            <div className="mx-auto w-full max-w-[720px]">
              {loi && <div className="mb-2 rounded-xl bg-rose-100 px-4 py-2 text-[15px] font-bold text-rose-600">{loi}</div>}
              <button type="button" onClick={tiep} disabled={!okTiep || busy}
                className={`h-[64px] w-full rounded-2xl text-[22px] font-extrabold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-40 ${cuoi ? 'bg-gradient-to-r from-[#4DC47A] to-[#39C6D6]' : 'bg-gradient-to-r from-[#8B6BEF] to-[#2F73F6]'}`}>
                {busy ? 'Đang nộp…' : loi ? 'Nộp lại' : cuoi ? 'Xong! 🎉' : 'Tiếp →'}
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
