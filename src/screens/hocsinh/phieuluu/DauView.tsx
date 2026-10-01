// MÀN ĐẤU: cảnh 3D phía trên (hero chém, đội quái lần lượt vào trận), khu trả lời câu hỏi phía dưới (do màn cha đưa vào qua `children`).
// Cha CHỈ việc gọi `tra(dung)` mỗi khi chấm xong 1 câu — cảnh lo hoạt ảnh, máu quái, chuyển quái, thanh tiến độ.
// Máu hiển thị trong lượt là PHẢN HỒI TỨC THÌ (đúng −1, sai +1, hồi tối đa +2); máu thật của dạng do Postgres tính lại sau lượt (spec-v1-app-hs §4.5).
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { DauTrangHS, HEAD, MAU, NhanHS, THE } from '../skin/KhungHS'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import { tenQuai } from '../skin/the3d/nguonQuai'
import type { ChangV, LucDiaV } from './kieu'
import { nap3D, useCanh } from './Canh3D'

export type TienDo = 'dung' | 'sai' | null
export type ApiDau = {
  /** cha gọi khi chấm xong 1 câu: đúng/sai ⇒ hoạt ảnh + cập nhật máu. Trả về khi hoạt ảnh xong. */
  tra: (dung: boolean) => Promise<void>
  tienDo: TienDo[]
  /** tất cả quái đã ngã (chặng đạt trong lượt này) */
  heT: boolean
  /** đang chạy hoạt ảnh — cha nên chờ trước khi cho sang câu kế */
  ban: boolean
}

/** Chia đều máu cả dạng cho đội hình (chưa đo riêng từng cụm). Mỗi con ≥ 1. */
function chiaMau(tong: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => Math.max(1, Math.floor(tong / n) + (i < tong % n ? 1 : 0)))
}

export function DauView({ luc, chang, b, gioi = 'nam', tong, onRut, children }: {
  luc: LucDiaV; chang: ChangV; b: BangMau3D; gioi?: 'nam' | 'nu'; tong: number; onRut: () => void
  children: (api: ApiDau) => ReactNode
}) {
  const doi = chang.quai
  const hp0 = useMemo(() => chiaMau(chang.hp && chang.hp > 0 ? chang.hp : 6, doi.length), [chang, doi.length])
  const [hp, setHp] = useState<number[]>(hp0)
  const [ei, setEi] = useState(0)
  const [tienDo, setTienDo] = useState<TienDo[]>([])
  const [ban, setBan] = useState(false)
  const [popup, setPopup] = useState<{ id: number; chu: string; hoi: boolean } | null>(null)
  const [vao, setVao] = useState<{ id: number; chu: string } | null>(null)
  const nhanPop = useRef<HTMLDivElement>(null)
  const refs = useRef({ hp, ei, ban: false }); refs.current = { hp, ei, ban }

  const { host, canh, loi } = useCanh(async (h) => (await nap3D.dau()).dungDau(h, b, { biome: luc.biome, gioi, maLuc: luc.ma }, doi), [chang.ma, b])
  const popVec = useRef<import('three').Vector3 | null>(null)
  useEffect(() => {
    if (!canh || !nhanPop.current) return
    return canh.sk.gan({ el: nhanPop.current, pos: (popVec.current ??= canh.neoQuai().clone()) })
  }, [canh])

  const heT = hp.every((x) => x === 0)
  const daAn = useRef(false)
  useEffect(() => { if (heT && canh && !daAn.current) { daAn.current = true; canh.anMung() } }, [heT, canh])
  const tra = useCallback(async (dung: boolean) => {
    if (!canh || refs.current.ban) return
    setBan(true)
    const { hp: h, ei: e } = refs.current
    const cap = hp0[e] + 2
    let hpNew = h.slice(), eiNew = e
    if (h.every((x) => x === 0)) { setTienDo((t) => [...t, dung ? 'dung' : 'sai']); setBan(false); return }
    if (popVec.current) popVec.current.copy(canh.neoQuai())
    await canh.tungPhep(dung)
    if (dung) {
      hpNew[e] = Math.max(0, h[e] - 1)
      setPopup({ id: Date.now(), chu: '−1', hoi: false })
      if (hpNew[e] === 0) {
        canh.nga()
        if (e < doi.length - 1) {
          eiNew = e + 1
          setHp(hpNew)
          await new Promise((r) => setTimeout(r, 650))
          canh.vao(eiNew); setEi(eiNew)
          setVao({ id: Date.now(), chu: doi[eiNew].boss ? 'BOSS CUỐI xuất hiện!' : `Elite ${eiNew + 1} xuất hiện!` })
          setTienDo((t) => [...t, 'dung']); setBan(false)
          return
        }
      }
    } else { hpNew[e] = Math.min(cap, h[e] + 1); setPopup({ id: Date.now(), chu: '+1', hoi: true }) }
    setHp(hpNew); setEi(eiNew); setTienDo((t) => [...t, dung ? 'dung' : 'sai']); setBan(false)
  }, [canh, doi, hp0])

  useEffect(() => { if (!vao) return; const t = setTimeout(() => setVao(null), 1700); return () => clearTimeout(t) }, [vao])

  const q = doi[ei], hpMax = hp0[ei] + 2
  const steps = Array.from({ length: tong }, (_, i) => tienDo[i] ?? null)
  const tenQ = tenQuai(q.loai)

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'var(--sk-bg)' }}>
      <div className="relative shrink-0" style={{ height: 'min(46%, 420px)', minHeight: 250 }}>
        <div ref={host} className="absolute inset-0" />
        {loi && <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-[14px]" style={{ color: 'var(--sk-muted)' }}>Máy này chưa vẽ được cảnh 3D — bạn vẫn làm bài bình thường bên dưới.</div>}
        <div className="pointer-events-none absolute inset-0">
          <div ref={nhanPop} className="absolute left-0 top-0" style={{ visibility: 'hidden' }}>
            {popup && <span key={popup.id} className="block text-[34px] font-extrabold" style={{ ...HEAD, color: popup.hoi ? MAU.dung : 'var(--sk-acc)', textShadow: '0 2px 8px var(--sk-bg)', animation: 'phieuluu-bay 1s ease-out forwards' }}>{popup.chu}</span>}
          </div>
        </div>
        <div className="absolute left-0 right-0 top-0 p-3"><DauTrangHS tieuDe={chang.ten} phu={`${luc.ten}`} onBack={onRut} /></div>
        {/* đội hình + máu quái đang đấu */}
        <div className="absolute left-3 top-[70px] flex items-end gap-1.5 px-2.5 py-1.5" style={{ ...THE, borderRadius: 10 }}>
          {doi.map((d, i) => <span key={i} className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold" title={tenQuai(d.loai)}
            style={{ background: hp[i] === 0 ? 'var(--sk-surface2)' : i === ei ? 'var(--sk-acc)' : 'transparent', color: i === ei && hp[i] > 0 ? 'var(--sk-acc-ink)' : 'var(--sk-muted)', border: '1.5px solid var(--sk-line)', textDecoration: hp[i] === 0 ? 'line-through' : 'none' }}>{d.boss ? '♛' : i + 1}</span>)}
        </div>
        <div className="absolute right-3 top-[70px] w-[min(340px,56vw)] p-2.5" style={{ ...THE, borderRadius: 10 }}>
          <div className="flex items-baseline justify-between"><b className="text-[15px]" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{tenQ}</b><span className="text-[11.5px]" style={{ color: 'var(--sk-muted)' }}>{hp[ei] === 0 ? 'Đã bị hạ' : `Còn ${hp[ei]} đòn`}</span></div>
          <div className="mt-1 flex items-center gap-1.5">{q.boss ? <NhanHS mau="var(--sk-acc)" dac>BOSS CUỐI</NhanHS> : <NhanHS>ELITE {ei + 1}/{doi.length - 1}</NhanHS>}</div>
          <div className="mt-1.5 flex gap-1">{Array.from({ length: hpMax }, (_, i) => <i key={i} className="h-3 flex-1 rounded-sm" style={{ background: i < hp[ei] ? MAU.sai : 'var(--sk-surface2)', border: i >= hp0[ei] && i >= hp[ei] ? '1px dashed var(--sk-line)' : 'none' }} />)}</div>
        </div>
        {vao && <div key={vao.id} className="pointer-events-none absolute inset-x-0 top-[34%] text-center text-[40px] font-extrabold" style={{ ...HEAD, color: 'var(--sk-acc)', textShadow: '0 3px 14px var(--sk-bg)', animation: 'phieuluu-vao 1.7s ease-out forwards' }}>{vao.chu}</div>}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">{steps.map((s, i) => <i key={i} className="h-2 w-6 rounded-full" style={{ background: s === 'dung' ? MAU.dung : s === 'sai' ? MAU.sai : i === tienDo.length ? 'var(--sk-acc)' : 'var(--sk-surface2)' }} />)}</div>
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto" style={{ borderTop: 'var(--sk-card-border)', background: 'var(--sk-surface)' }}>
        {children({ tra, tienDo, heT, ban })}
      </div>
      <style>{'@keyframes phieuluu-bay{0%{opacity:0;transform:translateY(10px)}15%{opacity:1}100%{opacity:0;transform:translateY(-60px)}} @keyframes phieuluu-vao{0%{opacity:0;transform:scale(.6)}15%{opacity:1;transform:scale(1.06)}80%{opacity:1}100%{opacity:0;transform:scale(1)}}'}</style>
    </div>
  )
}
