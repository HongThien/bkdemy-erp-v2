// MÀN ĐẤU 2D của "Học theo chủ đề" (Thùy 03/10: "làm chỗ combat ở dạng bài thành dạng 2D") — THAY DauView 3D, GIỮ NGUYÊN hợp đồng (props + `children(api)` + `tra(dung)` + luật combo).
// Bố cục y như bản 3D: câu hỏi chiếm gần trọn màn; trên cùng 1 thanh HUD gọn (quái + máu + đội hình + 3 ô COMBO + tiến độ); SÂN 2D bung xuống phủ nửa trên đúng lúc TUNG CHIÊU rồi thu lại.
// COMBO: mỗi 3 câu tung 1 chiêu — 3/3 TUYỆT KỸ (sét / thiên thạch) · 2/3 chiêu mạnh (cầu lửa / băng lớn) · 1/3 chiêu nhẹ (cầu nhỏ / tia điện) · 0/3 XỊT (quái đánh trả, quái hồi 1 máu).
// Sát thương = số câu đúng trong combo (dư thì tràn sang con kế) ⇒ tổng sát thương vẫn = tổng câu đúng ("mỗi câu đúng 1 đòn"). Câu cuối lượt mà combo chưa đủ 3 ⇒ tung luôn theo tỉ lệ đúng.
// Máu thật của dạng do Postgres tính lại sau lượt (spec-v1-app-hs §4.5). Cha CHỈ gọi `tra(dung)` mỗi khi chấm xong 1 câu; `ban` = đang tung chiêu (cha chờ rồi mới cho sang câu kế).
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { HEAD, MAU, NhanHS, THE } from '../skin/KhungHS'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import type { NvId } from '../skin/nhanVat'
import { chonDon, TEN_DON, type Don } from '../thuthach/hieuUng'
import type { ChangV, LucDiaV } from './kieu'
import type { ApiDau, TienDo } from './DauView'
import { tenQuai2D } from './ban2d/San2D'
import { QuaiTam } from './ban2d/HinhTam'
import { SanDon2D, type SanApi } from './SanDon2D'
import { useLoi } from '../skin/KhungHS'

export type { ApiDau, TienDo }
const CO_COMBO = 3

/** Chia đều máu cả dạng cho đội hình (chưa đo riêng từng cụm). Mỗi con ≥ 1. */
function chiaMau(tong: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => Math.max(1, Math.floor(tong / n) + (i < tong % n ? 1 : 0)))
}
const cho = (ms: number) => new Promise((r) => setTimeout(r, ms))
/** Chiêu theo cấp combo: chọn ngẫu nhiên trong nhóm (thuthach/hieuUng.ts). */
const donTheoCap = (cap: 0 | 1 | 2 | 3): Don => (cap === 0 ? 'boss_ma_thuat' : chonDon(cap === 3 ? 100 : cap === 2 ? 80 : 60))

/** Chiều cao sân (px) theo khung nhìn: nửa trên màn, co theo bề ngang để nhân vật + quái không chồng nhau. */
function useCaoSan() {
  const tinh = () => (typeof window === 'undefined' ? 340 : Math.round(Math.max(240, Math.min(470, window.innerHeight * 0.56, window.innerWidth * 0.62))))
  const [c, setC] = useState(tinh)
  useEffect(() => { const f = () => setC(tinh()); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f) }, [])
  return c
}

export function DauView2D({ luc: _luc, chang, b, gioi = 'nam', tong, daLam = 0, onRut, children }: {
  luc: LucDiaV; chang: ChangV; b: BangMau3D; /** NHÂN VẬT CHÍNH của em (skin/nhanVat.ts) hoặc 'nam'/'nu' khi chưa chọn */ gioi?: NvId; tong: number
  /** số câu đã làm từ trước (mở lại lượt dở) — để biết câu nào là câu cuối */
  daLam?: number
  onRut: () => void
  children: (api: ApiDau) => ReactNode
}) {
  const doi = chang.quai
  const hp0 = useMemo(() => chiaMau(chang.hp && chang.hp > 0 ? chang.hp : 6, doi.length), [chang, doi.length])
  const [hp, setHp] = useState<number[]>(hp0)
  const [ei, setEi] = useState(0)
  const [ha, setHa] = useState(false) // quái đang ngã
  const [tienDo, setTienDo] = useState<TienDo[]>([])
  const [combo, setCombo] = useState<boolean[]>([])
  const [ban, setBan] = useState(false)
  const [mo, setMo] = useState(false) // sân đang bung
  const [chu, setChu] = useState<{ id: number; to: string; nho?: string; mau: string } | null>(null)
  const refs = useRef({ hp, ei, ban: false, combo, n: 0 }); refs.current = { ...refs.current, hp, ei, ban, combo }
  const san = useRef<SanApi>(null)
  useEffect(() => { if (import.meta.env.DEV) (window as unknown as { __san?: SanApi | null }).__san = san.current }) // chỉ dev: soi từng đòn từ console (window.__san.phat('boss_ma_thuat'))
  const sanCao = useCaoSan()
  const loi = useLoi()
  // Sân bung xuống DƯỚI thanh HUD (điện thoại dọc: HUD xuống 2 hàng ~100px, nếu sân bắt đầu từ y=0 thì bị HUD che mất gần nửa sân + tiêu đề chiêu)
  const hudRef = useRef<HTMLDivElement>(null)
  const [hud, setHud] = useState(56)
  useLayoutEffect(() => {
    const el = hudRef.current; if (!el) return
    const f = () => setHud(el.offsetHeight); f()
    const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect()
  }, [])

  // mở màn: bung sân cho thấy quái xuất hiện ~2s rồi thu lại
  const daChao = useRef(false)
  useEffect(() => {
    if (daChao.current) return
    daChao.current = true
    setMo(true); setChu({ id: Date.now(), to: loi.moMan(tenQuai2D(doi[0].loai)), nho: loi.huongDan(CO_COMBO), mau: 'var(--sk-acc)' })
    const t = setTimeout(() => { setMo(false); setChu(null) }, 2000)
    return () => { clearTimeout(t); daChao.current = false } // StrictMode (dev) chạy effect 2 lần: cleanup xoá hẹn giờ thì phải mở khoá cho lần chạy thứ hai, không thì sân kẹt mở
  }, [doi]) // eslint-disable-line react-hooks/exhaustive-deps -- lời chỉ đọc lúc mở màn

  const heT = hp.every((x) => x === 0)
  const daAn = useRef(false)
  useEffect(() => {
    if (!heT || daAn.current) return
    daAn.current = true
    setMo(true); setChu({ id: Date.now(), to: loi.hetDoiHinh, mau: 'var(--sk-acc)' }); san.current?.thang()
    const t = setTimeout(() => { setMo(false); setChu(null) }, 2600)
    return () => { clearTimeout(t); daAn.current = false }
  }, [heT])

  const tungChieu = useCallback(async (cb: boolean[]) => {
    const soDung = cb.filter(Boolean).length // đếm ô combo đang vẽ (3 ô) — hiển thị, không phải số liệu nghiệp vụ
    const cap = (soDung === 0 ? 0 : Math.max(1, Math.min(3, Math.round((soDung / cb.length) * 3)))) as 0 | 1 | 2 | 3
    const d = donTheoCap(cap)
    setMo(true); await cho(360)
    setChu({ id: Date.now(), to: loi.chieu[cap], nho: loi.chieuChiTiet(soDung, cb.length, TEN_DON[d]), mau: cap === 0 ? MAU.sai : cap === 3 ? 'var(--sk-acc)' : MAU.ink })
    // hoạt ảnh canvas chạy theo khung hình: tab ẩn / máy hãm khung có thể rất chậm ⇒ chốt 5 giây, không bao giờ kẹt nút "Đòn kế tiếp"
    await Promise.race([san.current?.phat(d) ?? cho(300), cho(5000)])
    let h = refs.current.hp.slice(), e = refs.current.ei
    if (soDung === 0) h[e] = Math.min(hp0[e] + 2, h[e] + 1)
    else {
      let con = soDung
      while (con > 0 && e < doi.length) {
        const an = Math.min(con, h[e]); h[e] -= an; con -= an
        if (h[e] === 0) {
          setHp(h.slice()); setHa(true)
          if (e < doi.length - 1) {
            await cho(850); e += 1; setEi(e); setHa(false)
            setChu({ id: Date.now(), to: doi[e].boss ? 'BOSS CUỐI xuất hiện!' : `Elite ${e + 1} xuất hiện!`, mau: 'var(--sk-acc)' })
            await cho(900)
          } else break
        }
      }
    }
    setHp(h); setEi(e)
    await cho(450)
    setMo(false); setChu(null)
  }, [doi, hp0, loi])

  const tra = useCallback(async (dung: boolean) => {
    if (refs.current.ban) return
    refs.current.n += 1
    setTienDo((t) => [...t, dung ? 'dung' : 'sai'])
    if (refs.current.hp.every((x) => x === 0)) return
    const cb = [...refs.current.combo, dung], cuoi = daLam + refs.current.n >= tong
    if (cb.length < CO_COMBO && !cuoi) { setCombo(cb); return }
    setCombo(cb); setBan(true); refs.current.ban = true
    try { await tungChieu(cb) } finally { setCombo([]); setBan(false); refs.current.ban = false }
  }, [daLam, tong, tungChieu])

  const eiHien = Math.min(ei, doi.length - 1)
  const q = doi[eiHien], hpMax = hp0[eiHien] + 2
  const o = Array.from({ length: CO_COMBO }, (_, i) => combo[i])

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'var(--sk-bg)' }}>
      {/* HUD gọn */}
      <div ref={hudRef} className="relative z-40 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2" style={{ ...THE, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <button onClick={onRut} aria-label="Rút lui về chặng đường" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[18px]" style={{ border: '1.5px solid var(--sk-line)', color: MAU.ink }}>‹</button>
        <span className="h-11 w-11 shrink-0"><QuaiTam b={b} loai={q.loai} boss={q.boss && doi.length > 1} co={44} /></span>
        <div className="min-w-[160px] flex-1">
          <div className="flex items-baseline gap-2">
            <b className="truncate text-[15px]" style={{ ...HEAD, color: MAU.ink }}>{tenQuai2D(q.loai)}</b>
            {q.boss ? <NhanHS mau="var(--sk-acc)" dac>{loi.nhanBoss}</NhanHS> : <NhanHS>{loi.nhanThuong(eiHien + 1, Math.max(1, doi.length - 1))}</NhanHS>}
            <span className="ml-auto whitespace-nowrap text-[12px]" style={{ color: MAU.muted }}>{hp[eiHien] === 0 ? loi.daXong : loi.con(hp[eiHien])}</span>
          </div>
          <div className="mt-1 flex gap-0.5">{Array.from({ length: hpMax }, (_, i) => <i key={i} className="h-2.5 flex-1 rounded-sm" style={{ background: i < hp[eiHien] ? MAU.sai : 'var(--sk-surface2)', border: i >= hp0[eiHien] && i >= hp[eiHien] ? '1px dashed var(--sk-line)' : 'none' }} />)}</div>
        </div>
        <div className="flex items-center gap-1" aria-label={loi.doiHinh}>
          {doi.map((d, i) => <span key={i} className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold" title={tenQuai2D(d.loai)}
            style={{ background: hp[i] === 0 ? 'var(--sk-surface2)' : i === eiHien ? 'var(--sk-acc)' : 'transparent', color: i === eiHien && hp[i] > 0 ? 'var(--sk-acc-ink)' : 'var(--sk-muted)', border: '1.5px solid var(--sk-line)', textDecoration: hp[i] === 0 ? 'line-through' : 'none' }}>{d.boss ? '♛' : i + 1}</span>)}
        </div>
        <div className="flex items-center gap-1.5" aria-label={`Combo ${combo.length}/${CO_COMBO}`}>
          <span className="text-[12px] font-bold" style={{ ...HEAD, color: MAU.muted }}>{loi.nhanCombo}</span>
          {o.map((v, i) => <span key={i} className="inline-block h-4 w-4 rotate-45 rounded-[3px]" style={{ background: v === true ? MAU.dung : v === false ? MAU.sai : 'transparent', border: `1.5px solid ${v === undefined ? 'var(--sk-acc)' : v ? MAU.dung : MAU.sai}`, boxShadow: v === true ? `0 0 8px ${MAU.dung}` : undefined }} />)}
        </div>
        <span className="whitespace-nowrap text-[12.5px] font-semibold" style={{ color: MAU.muted }}>Câu {Math.min(tong, daLam + tienDo.length + 1)}/{tong}</span>
      </div>

      {/* câu hỏi: gần trọn màn */}
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {children({ tra, tienDo, heT, ban })}
      </div>

      {/* sân 2D: chỉ bung lúc tung chiêu / quái mới vào / hạ hết — luôn nằm trong DOM (canvas + ảnh đã nạp) chỉ ẩn bằng opacity */}
      <div className="absolute inset-x-0 z-30 overflow-hidden transition-[opacity,transform] duration-300 ease-out"
        style={{ top: hud, height: sanCao, opacity: mo ? 1 : 0, transform: mo ? 'translateY(0)' : 'translateY(-24px)', pointerEvents: mo ? 'auto' : 'none', borderBottom: 'var(--sk-card-border)', boxShadow: '0 12px 30px var(--sk-bg)' }}
        aria-hidden={!mo}>
        <SanDon2D ref={san} nv={gioi} sanCao={sanCao} ke={q} keId={eiHien} ha={ha} b={b} />
        {chu && (
          <div key={chu.id} className="pointer-events-none absolute inset-x-0 top-[16%] z-40 text-center" style={{ animation: 'dau-chu .5s ease-out both' }}>
            <p className="text-[clamp(26px,5vw,44px)] font-extrabold leading-tight" style={{ ...HEAD, color: chu.mau, textShadow: '0 3px 14px var(--sk-bg), 0 0 2px var(--sk-bg), 0 0 18px var(--sk-bg)' }}>{chu.to}</p>
            {chu.nho && <p className="mt-1 text-[16px] font-semibold" style={{ color: MAU.ink, textShadow: '0 2px 8px var(--sk-bg), 0 0 10px var(--sk-bg)' }}>{chu.nho}</p>}
          </div>
        )}
      </div>
      <style>{'@keyframes dau-chu{0%{opacity:0;transform:scale(.7)}60%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}'}</style>
    </div>
  )
}
