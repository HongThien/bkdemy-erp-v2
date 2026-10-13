// BOX "Việc hôm nay" (Trang chính) — 2 chế độ, nút chuyển qua lại:
//   ⚙ Vận hành  — việc ERP tự đo (chấm BTVN, ET, đánh giá…): là SHORTCUT sang "Việc của tôi". Ô tick do HỆ THỐNG
//                 đánh (hết việc của khâu đó = xong), người dùng không tick tay được.
//   📝 Nhắc việc — việc tôi TỰ GHI cho mình, tick tay, không liên quan hệ thống, reset mỗi ngày (lib/homeViec.ts).
import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { getMyTasks, type MyTask } from '../../lib/gami'
import { homNayVN } from '../../lib/tuan'
import { listNhacViec, themNhacViec, xoaNhacViec, datXongHomNay, type NhacViec } from '../../lib/homeViec'
import ModalFull from './ModalFull'
import { HEAD, THE } from './khung'

type Che = 'van_hanh' | 'nhac'
const KHOA_CHE = 'erp.home.viecHomNay'
const docChe = (): Che => { try { return localStorage.getItem(KHOA_CHE) === 'nhac' ? 'nhac' : 'van_hanh' } catch { return 'van_hanh' } }

const ngayVN = (ts: number) => new Date(ts).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
// BTVN tính theo NGÀY HẠN (hạn nằm ở buổi kế), còn lại theo ngày buổi — cùng luật màn "Việc của tôi".
const ngayCuaViec = (t: MyTask) => (t.tab === 'btvn' && t.deadline != null ? ngayVN(t.deadline) : t.ngay)

const Tick = ({ on, tuDong }: { on: boolean; tuDong?: boolean }) => (
  <span aria-hidden className={`flex size-[18px] shrink-0 items-center justify-center border text-[12px] font-black leading-none ${on ? 'border-[var(--sk-acc)] bg-[var(--sk-acc)] text-[var(--sk-acc-ink)]' : 'border-[var(--sk-line)] bg-[var(--sk-surface2)]'} ${tuDong ? 'opacity-90' : ''}`}
    style={{ borderRadius: 5 }}>{on ? '✓' : ''}</span>
)

function VanHanh({ onMo, gioiHan }: { onMo: () => void; gioiHan?: number }) {
  const [tasks, setTasks] = useState<MyTask[] | null>(null)
  const [loi, setLoi] = useState(false)
  useEffect(() => { getMyTasks().then(setTasks).catch(() => { setLoi(true); setTasks([]) }) }, [])
  const hom = homNayVN()
  // Theo khâu: việc tới hạn hôm nay + việc còn nợ từ ngày trước. Khâu xong khi hết việc chưa làm.
  const nhom = useMemo(() => {
    const m = new Map<string, { label: string; tong: number; xong: number; no: number }>()
    for (const t of tasks ?? []) {
      const ngay = ngayCuaViec(t)
      if (ngay > hom || (t.done && ngay < hom)) continue
      const g = m.get(t.label) ?? { label: t.label, tong: 0, xong: 0, no: 0 }
      g.tong++
      if (t.done) g.xong++
      else if (ngay < hom) g.no++
      m.set(t.label, g)
    }
    return [...m.values()].sort((a, b) => a.label.localeCompare(b.label, 'vi'))
  }, [tasks, hom])

  if (tasks === null) return <p className="text-[12.5px] text-[var(--sk-muted)]">Đang tải…</p>
  if (loi) return <p className="text-[12.5px] text-[var(--sk-muted)]">Chưa tải được việc vận hành.</p>
  if (!nhom.length) return <p className="text-[12.5px] text-[var(--sk-muted)]">Hôm nay không có việc vận hành nào tới hạn. ✓</p>
  const hien = gioiHan ? nhom.slice(0, gioiHan) : nhom
  return (
    <>
    <ul className="space-y-1">
      {hien.map((g) => (
        <li key={g.label}>
          <button onClick={onMo} className="flex w-full items-center gap-2.5 px-1 py-1 text-left hover:bg-[var(--sk-surface2)]" style={{ borderRadius: 8 }}>
            <Tick on={g.xong === g.tong} tuDong />
            <span className={`min-w-0 flex-1 truncate text-[13.5px] font-semibold ${g.xong === g.tong ? 'text-[var(--sk-muted)] line-through' : 'text-[var(--sk-ink)]'}`}>{g.label}</span>
            {g.no > 0 && <span className="shrink-0 text-[11px] font-bold text-rose-500">{g.no} quá hạn</span>}
            <span className="shrink-0 text-[12.5px] font-bold tabular-nums text-[var(--sk-muted)]">{g.xong}/{g.tong}</span>
          </button>
        </li>
      ))}
    </ul>
    {gioiHan && nhom.length > gioiHan && <p className="mt-1 px-1 text-[11.5px] text-[var(--sk-muted)]">… và {nhom.length - gioiHan} việc nữa</p>}
    </>
  )
}

function NhacViecCuaToi({ gioiHan, onMoRong }: { gioiHan?: number; onMoRong?: () => void }) {
  const nhanSuId = useStore((s) => s.me?.nhanSu.id)
  const [ds, setDs] = useState<NhacViec[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [moi, setMoi] = useState('')
  useEffect(() => {
    listNhacViec().then(setDs).catch((e) => { setLoi(e?.message ?? String(e)); setDs([]) })
  }, [])

  if (!nhanSuId) return <p className="text-[12.5px] text-[var(--sk-muted)]">Tài khoản chưa gắn hồ sơ nhân sự nên chưa lưu được nhắc việc.</p>
  const vaDong = (id: string, p: Partial<NhacViec>) => setDs((c) => (c ?? []).map((x) => (x.id === id ? { ...x, ...p } : x)))
  const tick = (v: NhacViec) => {
    vaDong(v.id, { xong: !v.xong })
    datXongHomNay(v.id, !v.xong).catch((e) => { vaDong(v.id, { xong: v.xong }); alert(`Chưa lưu được: ${e?.message ?? e}`) })
  }
  const them = async () => {
    const nd = moi.trim()
    if (!nd) return
    setMoi('')
    try {
      const v = await themNhacViec(nhanSuId, nd, (ds ?? []).reduce((m, x) => Math.max(m, x.thu_tu), 0) + 1)
      setDs((c) => [...(c ?? []), v])
    } catch (e: any) { setMoi(nd); alert(`Chưa thêm được: ${e?.message ?? e}`) }
  }
  const xoa = (v: NhacViec) => {
    const cu = ds
    setDs((c) => (c ?? []).filter((x) => x.id !== v.id))
    xoaNhacViec(v.id).catch((e) => { setDs(cu); alert(`Chưa xoá được: ${e?.message ?? e}`) })
  }
  return (
    <div>
      {loi && <p className="mb-1.5 text-[12px] text-rose-500">Chưa đọc được sổ nhắc việc ({loi}).</p>}
      {ds === null ? <p className="text-[12.5px] text-[var(--sk-muted)]">Đang tải…</p> : (
        <ul className="space-y-0.5">
          {(gioiHan ? ds.slice(0, gioiHan) : ds).map((v) => (
            <li key={v.id} className="group flex items-center gap-2.5 px-1 py-1 hover:bg-[var(--sk-surface2)]" style={{ borderRadius: 8 }}>
              <button onClick={() => tick(v)} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
                <Tick on={v.xong} />
                <span className={`min-w-0 flex-1 truncate text-[13.5px] font-semibold ${v.xong ? 'text-[var(--sk-muted)] line-through' : 'text-[var(--sk-ink)]'}`}>{v.noi_dung}</span>
              </button>
              <button onClick={() => xoa(v)} title="Xoá khỏi danh sách nhắc" className="shrink-0 px-1 text-[16px] leading-none text-[var(--sk-muted)] opacity-0 hover:text-rose-500 group-hover:opacity-100">×</button>
            </li>
          ))}
        </ul>
      )}
      {gioiHan ? (
        <button onClick={onMoRong} className="mt-1.5 px-1 text-[12px] font-semibold text-[var(--sk-acc)] hover:underline">
          {ds && ds.length > gioiHan ? `… và ${ds.length - gioiHan} việc nữa · ` : ''}＋ Thêm / xem tất cả ›
        </button>
      ) : (
      <form onSubmit={(e) => { e.preventDefault(); them() }} className="mt-2 flex gap-2">
        <input value={moi} onChange={(e) => setMoi(e.target.value)} maxLength={200} placeholder="Thêm việc nhắc mình… (lặp lại mỗi ngày)"
          className="min-w-0 flex-1 border border-[var(--sk-line)] bg-[var(--sk-surface2)] px-2.5 py-1.5 text-[13px] text-[var(--sk-ink)] outline-none focus:border-[var(--sk-acc)]" style={{ borderRadius: 8 }} />
        <button type="submit" disabled={!moi.trim()} className="shrink-0 bg-[var(--sk-acc)] px-3 text-[13px] font-bold text-[var(--sk-acc-ink)] disabled:opacity-40" style={{ borderRadius: 8 }}>Thêm</button>
      </form>
      )}
      {!gioiHan && <p className="mt-1.5 text-[11px] text-[var(--sk-muted)]">Chỉ mình bạn thấy · ô tick tự về trống mỗi ngày mới.</p>}
    </div>
  )
}

// compact = bảng nhỏ ở góc trên trái Trang chính: chỉ 5 việc đầu; bấm vào ⇒ mở popup đầy đủ (chính component này, không thu gọn).
const SO_DONG_NHO = 5

export default function ViecHangNgay({ onMoVietCuaToi, compact = false }: { onMoVietCuaToi: () => void; compact?: boolean }) {
  const [che, setChe] = useState<Che>(docChe)
  const [mo, setMo] = useState(false)
  const doi = (c: Che) => { setChe(c); try { localStorage.setItem(KHOA_CHE, c) } catch { /* không lưu được thì thôi */ } }
  const nut = (c: Che, ten: string) => (
    <button onClick={() => doi(c)}
      className={`px-3 py-1 text-[12.5px] font-bold ${che === c ? 'bg-[var(--sk-acc)] text-[var(--sk-acc-ink)]' : 'text-[var(--sk-muted)] hover:text-[var(--sk-ink)]'}`}
      style={{ borderRadius: 'var(--sk-radius-pill)' }}>{ten}</button>
  )
  const khung = (
    <div style={THE} className="p-3.5">
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <h3 className="text-[15px] font-bold text-[var(--sk-ink)]" style={HEAD}>☑ Việc hôm nay</h3>
        <div className="ml-auto inline-flex gap-0.5 border border-[var(--sk-line)] p-0.5" style={{ borderRadius: 'var(--sk-radius-pill)' }}>
          {nut('van_hanh', '⚙ Vận hành')}{nut('nhac', '📝 Nhắc việc')}
        </div>
      </div>
      {che === 'van_hanh'
        ? <VanHanh onMo={compact ? () => setMo(true) : onMoVietCuaToi} gioiHan={compact ? SO_DONG_NHO : undefined} />
        : <NhacViecCuaToi gioiHan={compact ? SO_DONG_NHO : undefined} onMoRong={() => setMo(true)} />}
      {compact && (
        <button onClick={() => setMo(true)} className="mt-2 w-full text-right text-[12px] font-semibold text-[var(--sk-acc)] hover:underline">Xem chi tiết ›</button>
      )}
    </div>
  )
  if (!compact) return khung
  return (
    <>
      {khung}
      {mo && (
        <ModalFull tieuDe="☑ Việc hôm nay" onDong={() => setMo(false)} cao="auto">
          <div className="mx-auto max-w-[760px] p-5"><ViecHangNgay onMoVietCuaToi={() => { setMo(false); onMoVietCuaToi() }} /></div>
        </ModalFull>
      )}
    </>
  )
}
