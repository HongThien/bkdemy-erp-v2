// MÀN ĐẤU (Thùy 02/10 — bản 2): câu hỏi CHIẾM GẦN TRỌN MÀN (đủ chỗ lời giải chi tiết); trên cùng chỉ còn 1 thanh HUD gọn
// (quái đang đấu + máu + đội hình + 3 ô COMBO + tiến độ). Cảnh 3D KHÔNG chiếm chỗ thường trực: nó bung xuống phủ nửa trên đúng lúc
// TUNG CHIÊU rồi thu lại; lúc thu thì ngừng vẽ (đỡ tốn pin/máy).
// COMBO: mỗi 3 câu tung 1 chiêu — 3/3 TUYỆT KỸ · 2/3 chiêu mạnh · 1/3 chiêu nhẹ · 0/3 chiêu xịt (quái hồi 1 máu). Sát thương = số câu đúng
// trong combo (dư thì tràn sang con kế) ⇒ tổng sát thương vẫn = tổng câu đúng như luật "mỗi câu đúng 1 đòn" — chỉ gộp lại cho đẹp.
// Câu cuối lượt mà combo chưa đủ 3 ⇒ tung luôn chiêu theo tỉ lệ đúng. Máu thật của dạng do Postgres tính lại sau lượt (spec-v1-app-hs §4.5).
// Cha CHỈ gọi `tra(dung)` mỗi khi chấm xong 1 câu; `ban` = đang tung chiêu (cha chờ rồi mới cho sang câu kế).
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { HEAD, MAU, NhanHS, THE } from '../skin/KhungHS'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import type { ChangV, LucDiaV } from './kieu'
import { nap3D, useCanh } from './Canh3D'
import { tenQuai2D } from './ban2d/San2D'
import { QuaiTam } from './ban2d/HinhTam'

export type TienDo = 'dung' | 'sai' | null
export type ApiDau = {
  /** cha gọi khi chấm xong 1 câu. Đủ combo (hoặc câu cuối) ⇒ tung chiêu; trả về khi chiêu xong. */
  tra: (dung: boolean) => Promise<void>
  tienDo: TienDo[]
  /** tất cả quái đã ngã (chặng đạt trong lượt này) */
  heT: boolean
  /** đang tung chiêu — cha nên chờ trước khi cho sang câu kế */
  ban: boolean
}

export const CO_COMBO = 3
const TEN_CHIEU = ['Chiêu xịt — quái hồi 1 máu', 'Chiêu nhẹ', 'Chiêu mạnh', 'TUYỆT KỸ!'] as const

/** Chia đều máu cả dạng cho đội hình (chưa đo riêng từng cụm). Mỗi con ≥ 1. */
function chiaMau(tong: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => Math.max(1, Math.floor(tong / n) + (i < tong % n ? 1 : 0)))
}
const cho = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function DauView({ luc, chang, b, gioi = 'nam', tong, daLam = 0, onRut, children }: {
  luc: LucDiaV; chang: ChangV; b: BangMau3D; gioi?: 'nam' | 'nu'; tong: number
  /** số câu đã làm từ trước (mở lại lượt dở) — để biết câu nào là câu cuối */
  daLam?: number
  onRut: () => void
  children: (api: ApiDau) => ReactNode
}) {
  const doi = chang.quai
  const hp0 = useMemo(() => chiaMau(chang.hp && chang.hp > 0 ? chang.hp : 6, doi.length), [chang, doi.length])
  const [hp, setHp] = useState<number[]>(hp0)
  const [ei, setEi] = useState(0)
  const [tienDo, setTienDo] = useState<TienDo[]>([])
  const [combo, setCombo] = useState<boolean[]>([])
  const [ban, setBan] = useState(false)
  const [mo, setMo] = useState(false) // cảnh đang bung
  const [chu, setChu] = useState<{ id: number; to: string; nho?: string; mau: string } | null>(null)
  const refs = useRef({ hp, ei, ban: false, combo, n: 0 }); refs.current = { ...refs.current, hp, ei, ban, combo }

  const { host, canh, loi } = useCanh(async (h) => (await nap3D.dau()).dungDau(h, b, { biome: luc.biome, gioi, maLuc: luc.ma }, doi), [chang.ma, b])

  // mở màn: bung cảnh cho thấy quái xuất hiện ~1,6s rồi thu lại
  const daChao = useRef(false)
  useEffect(() => {
    if (!canh || daChao.current) return
    daChao.current = true
    setMo(true); setChu({ id: Date.now(), to: `${tenQuai2D(doi[0].loai)} xuất hiện!`, nho: `Mỗi ${CO_COMBO} câu tung 1 chiêu — đúng cả ${CO_COMBO} là TUYỆT KỸ`, mau: 'var(--sk-acc)' })
    const t = setTimeout(() => { setMo(false); setChu(null) }, 2000)
    return () => clearTimeout(t)
  }, [canh, doi])
  // cảnh thu lại thì ngừng vẽ (sau khi hiệu ứng thu xong)
  useEffect(() => { if (!canh) return; if (mo) { canh.sk.nghi(false); return } const t = setTimeout(() => canh.sk.nghi(true), 320); return () => clearTimeout(t) }, [canh, mo])

  const heT = hp.every((x) => x === 0)
  const daAn = useRef(false)
  useEffect(() => {
    if (!heT || daAn.current) return
    daAn.current = true
    setMo(true); setChu({ id: Date.now(), to: 'Hạ hết đội hình!', mau: 'var(--sk-acc)' }); canh?.anMung()
    const t = setTimeout(() => { setMo(false); setChu(null) }, 2400)
    return () => clearTimeout(t)
  }, [heT, canh])

  const tungChieu = useCallback(async (cb: boolean[]) => {
    const soDung = cb.filter(Boolean).length // đếm ô combo đang vẽ (3 ô) — hiển thị, không phải số liệu nghiệp vụ
    const cap = (soDung === 0 ? 0 : Math.max(1, Math.min(3, Math.round((soDung / cb.length) * 3)))) as 0 | 1 | 2 | 3
    if (canh) { setMo(true); await cho(330) }
    setChu({ id: Date.now(), to: TEN_CHIEU[cap], nho: soDung ? `${soDung}/${cb.length} câu đúng · −${soDung} máu` : `${soDung}/${cb.length} câu đúng`, mau: cap === 0 ? MAU.sai : cap === 3 ? 'var(--sk-acc)' : MAU.ink })
    // hoạt ảnh chạy theo khung hình: máy hãm khung / app chạy nền thì có thể rất chậm ⇒ chốt 4 giây, không bao giờ kẹt nút "Đòn kế tiếp"
    if (canh) await Promise.race([canh.tungChieu(cap), cho(4000)])
    let h = refs.current.hp.slice(), e = refs.current.ei
    if (soDung === 0) h[e] = Math.min(hp0[e] + 2, h[e] + 1)
    else {
      let con = soDung
      while (con > 0 && e < doi.length) {
        const an = Math.min(con, h[e]); h[e] -= an; con -= an
        if (h[e] === 0) {
          setHp(h.slice()); canh?.nga()
          if (e < doi.length - 1) {
            await cho(650); e += 1; canh?.vao(e); setEi(e)
            setChu({ id: Date.now(), to: doi[e].boss ? 'BOSS CUỐI xuất hiện!' : `Elite ${e + 1} xuất hiện!`, mau: 'var(--sk-acc)' })
            await cho(900)
          } else break
        }
      }
    }
    setHp(h); setEi(e)
    await cho(canh ? 450 : 900)
    setMo(false); setChu(null)
  }, [canh, doi, hp0])

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

  const q = doi[Math.min(ei, doi.length - 1)], hpMax = hp0[ei] + 2
  const o = Array.from({ length: CO_COMBO }, (_, i) => combo[i])

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'var(--sk-bg)' }}>
      {/* HUD gọn */}
      <div className="relative z-40 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2" style={{ ...THE, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <button onClick={onRut} aria-label="Rút lui về chặng đường" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[20px]" style={{ border: '1.5px solid var(--sk-line)', color: MAU.ink }}>‹</button>
        <span className="h-11 w-11 shrink-0"><QuaiTam b={b} loai={q.loai} boss={q.boss && doi.length > 1} co={44} /></span>
        <div className="min-w-[160px] flex-1">
          <div className="flex items-baseline gap-2">
            <b className="truncate text-[16.5px]" style={{ ...HEAD, color: MAU.ink }}>{tenQuai2D(q.loai)}</b>
            {q.boss ? <NhanHS mau="var(--sk-acc)" dac>BOSS</NhanHS> : <NhanHS>ELITE {ei + 1}/{Math.max(1, doi.length - 1)}</NhanHS>}
            <span className="ml-auto whitespace-nowrap text-[13px]" style={{ color: MAU.muted }}>{hp[ei] === 0 ? 'Đã bị hạ' : `Còn ${hp[ei]} đòn`}</span>
          </div>
          <div className="mt-1 flex gap-0.5">{Array.from({ length: hpMax }, (_, i) => <i key={i} className="h-2.5 flex-1 rounded-sm" style={{ background: i < hp[ei] ? MAU.sai : 'var(--sk-surface2)', border: i >= hp0[ei] && i >= hp[ei] ? '1px dashed var(--sk-line)' : 'none' }} />)}</div>
        </div>
        <div className="flex items-center gap-1" aria-label="Đội hình">
          {doi.map((d, i) => <span key={i} className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold" title={tenQuai2D(d.loai)}
            style={{ background: hp[i] === 0 ? 'var(--sk-surface2)' : i === ei ? 'var(--sk-acc)' : 'transparent', color: i === ei && hp[i] > 0 ? 'var(--sk-acc-ink)' : 'var(--sk-muted)', border: '1.5px solid var(--sk-line)', textDecoration: hp[i] === 0 ? 'line-through' : 'none' }}>{d.boss ? '♛' : i + 1}</span>)}
        </div>
        <div className="flex items-center gap-1.5" aria-label={`Combo ${combo.length}/${CO_COMBO}`}>
          <span className="text-[13px] font-bold" style={{ ...HEAD, color: MAU.muted }}>Chiêu</span>
          {o.map((v, i) => <span key={i} className="inline-block h-4 w-4 rotate-45 rounded-[3px]" style={{ background: v === true ? MAU.dung : v === false ? MAU.sai : 'transparent', border: `1.5px solid ${v === undefined ? 'var(--sk-acc)' : v ? MAU.dung : MAU.sai}`, boxShadow: v === true ? `0 0 8px ${MAU.dung}` : undefined }} />)}
        </div>
        <span className="whitespace-nowrap text-[14px] font-semibold" style={{ color: MAU.muted }}>Câu {Math.min(tong, daLam + tienDo.length + 1)}/{tong}</span>
      </div>

      {/* câu hỏi: gần trọn màn */}
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {children({ tra, tienDo, heT, ban })}
      </div>

      {/* cảnh 3D: chỉ bung lúc tung chiêu / quái mới vào / hạ hết */}
      {!loi && (
        <div className="absolute inset-x-0 z-30 overflow-hidden transition-[opacity,transform] duration-300 ease-out"
          style={{ top: 0, height: 'min(66%, 560px)', opacity: mo ? 1 : 0, transform: mo ? 'translateY(0)' : 'translateY(-24px)', pointerEvents: mo ? 'auto' : 'none', borderBottom: 'var(--sk-card-border)', boxShadow: '0 12px 30px var(--sk-bg)' }}
          aria-hidden={!mo}>
          <div ref={host} className="absolute inset-0" />
          {chu && (
            <div key={chu.id} className="pointer-events-none absolute inset-x-0 top-[38%] text-center" style={{ animation: 'dau-chu .5s ease-out both' }}>
              <p className="text-[clamp(28px,5vw,46px)] font-extrabold leading-tight" style={{ ...HEAD, color: chu.mau, textShadow: '0 3px 14px var(--sk-bg), 0 0 2px var(--sk-bg)' }}>{chu.to}</p>
              {chu.nho && <p className="mt-1 text-[17.5px] font-semibold" style={{ color: MAU.ink, textShadow: '0 2px 8px var(--sk-bg)' }}>{chu.nho}</p>}
            </div>
          )}
        </div>
      )}
      {loi && chu && <div className="pointer-events-none absolute inset-x-0 top-24 z-30 text-center text-[26.5px] font-extrabold" style={{ ...HEAD, color: chu.mau }}>{chu.to}</div>}
      <style>{'@keyframes dau-chu{0%{opacity:0;transform:scale(.7)}60%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}'}</style>
    </div>
  )
}
