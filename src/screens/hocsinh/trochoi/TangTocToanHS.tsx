// ============================================================================
// TĂNG TỐC BẰNG TOÁN — bảng 3 câu của Nông trại (Thùy 03/11). App vẽ ĐÈ lên khung game vì game (iframe tĩnh) không vẽ được công thức.
// Server phát câu + CHẤM (fn_nt_tang_toc_de / fn_nt_tang_toc_nop, mig 202611031809): dạng em đã làm, mức 2–3, đúng ≥ 2/3 ⇒ đạt.
// Kết quả trả cho game qua onXong (game giảm thời gian máy chế biến theo `giam`). Không xáo câu/phương án (giấy và app giống hệt).
// Màu/khung CHỈ từ skin (KhungHS).
// ============================================================================
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { HEAD, MAU, NutHS, THE_TRON } from '../skin/KhungHS'
import { MathText } from '../../kho/ui'
import { ntTangTocDe, ntTangTocNop, type NtTangTocDe, type NtTangTocNop } from '../../../lib/nt_luu'

export type KqTangToc = { ok: boolean; dat?: boolean; giam?: number; loi?: string }

const LOI: Record<string, string> = {
  het_luot: 'Hôm nay em đã tăng tốc đủ 5 lần rồi, mai làm tiếp nhé.',
  chua_hoc: 'Em chưa có bài nào được chấm nên chưa có câu để làm. Làm bài trên lớp hoặc trên app trước nhé.',
  chua_co_kho: 'Khối của em chưa có kho câu trắc nghiệm cho phần này.',
  thieu_cau: 'Chưa đủ câu trắc nghiệm trong các dạng em đã làm.',
  chua_co_lop: 'Em chưa có lớp Toán nên chưa làm được.',
  het_han: 'Đề này đã quá 10 phút, em xin đề mới nhé.',
}
const CHU = ['A', 'B', 'C', 'D']

export default function TangTocToanHS({ onXong }: { onXong: (kq: KqTangToc) => void }) {
  const [de, setDe] = useState<NtTangTocDe | null>(null)
  const [chon, setChon] = useState<number[]>([-1, -1, -1])
  const [kq, setKq] = useState<NtTangTocNop | null>(null)
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { ntTangTocDe().then(setDe).catch((e) => setLoi('Chưa tải được câu hỏi — ' + ((e as Error).message ?? e))) }, [])

  const nop = async () => {
    if (!de || !de.ok || dang || chon.some((c) => c < 0)) return
    setDang(true); setLoi(null)
    try {
      const r = await ntTangTocNop(de.de_id, chon)
      if (r.ok) setKq(r); else setLoi(LOI[r.loi] ?? 'Chưa nộp được, em thử lại nhé.')
    } catch (e) { setLoi('Chưa nộp được — ' + ((e as Error).message ?? e)) } finally { setDang(false) }
  }
  const dong = () => onXong(kq?.ok ? { ok: true, dat: kq.dat, giam: kq.giam } : { ok: false, loi: 'huy' })

  const baoLoi = de && !de.ok ? (de.loi === 'cho' ? `Lần trước em chưa đạt — chờ ${de.cho_giay ?? 60} giây nữa rồi thử lại nhé.` : LOI[de.loi] ?? 'Chưa lấy được câu hỏi.') : null
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3" role="dialog" aria-modal="true" aria-label="Tăng tốc bằng toán">
      <div className="absolute inset-0" style={{ background: 'color-mix(in srgb, var(--sk-bg) 72%, transparent)' }} />
      <div className="relative flex max-h-[94dvh] w-full max-w-[760px] flex-col gap-3 overflow-y-auto p-4"
        style={{ ...THE_TRON, background: MAU.bg, color: MAU.ink, fontFamily: 'var(--sk-font)', borderRadius: 'var(--sk-radius)' }}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[20px] font-bold" style={HEAD}>⚡ Tăng tốc bằng toán</p>
            <p className="text-[14px]" style={{ color: MAU.muted }}>Đúng ít nhất 2/3 câu ⇒ máy chế biến làm nhanh gấp đôi phần thời gian còn lại.</p>
          </div>
          {!kq && <button onClick={dong} aria-label="Đóng" className="flex h-10 w-10 flex-none items-center justify-center text-[18px]"
            style={{ background: MAU.surface2, color: MAU.muted, borderRadius: 'var(--sk-radius-pill)' }}>✕</button>}
        </div>

        {!de && !loi && <p className="py-6 text-center text-[15px]" style={{ color: MAU.muted }}>Đang lấy câu hỏi…</p>}
        {baoLoi && <><p className="py-4 text-[16px] font-semibold leading-snug">{baoLoi}</p><NutHS onClick={dong}>Về nông trại</NutHS></>}

        {de?.ok && de.cau.map((c, i) => (
          <div key={i} className="flex flex-col gap-2 p-3" style={{ background: MAU.surface, border: `1px solid ${MAU.line}`, borderRadius: 'var(--sk-radius)' }}>
            <p className="text-[13px] font-bold" style={{ color: MAU.muted }}>Câu {i + 1}/{de.cau.length}{c.dang ? ` · ${c.dang}` : ''}</p>
            <div className="text-[16px] leading-relaxed"><MathText>{c.de}</MathText></div>
            {c.anh && <img src={c.anh} alt="Hình của đề" className="max-h-[220px] w-auto self-start object-contain" style={{ background: 'white', borderRadius: 'var(--sk-radius)' }} />}
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {c.opts.map((o, j) => {
                const daChon = chon[i] === j, dung = kq?.ok ? kq.dap_an[i] === j : false, sai = kq?.ok && daChon && !dung
                return (
                  <button key={j} disabled={!!kq || dang} onClick={() => setChon((x) => x.map((v, k) => (k === i ? j : v)))}
                    className="flex items-start gap-2 p-2.5 text-left text-[15.5px]"
                    style={{ background: daChon && !kq ? MAU.surface2 : 'transparent', borderRadius: 'var(--sk-radius)',
                      border: `2px solid ${dung ? MAU.dung : sai ? MAU.sai : daChon ? MAU.acc : MAU.line}` }}>
                    <b className="flex-none" style={{ color: dung ? MAU.dung : sai ? MAU.sai : MAU.acc }}>{CHU[j]}.</b>
                    <span className="min-w-0"><MathText>{o}</MathText></span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {loi && <p className="text-[14.5px]" style={{ color: MAU.sai }}>{loi}</p>}
        {de?.ok && !kq && <NutHS onClick={nop} tat={dang || chon.some((c) => c < 0)}>{dang ? 'Đang chấm…' : 'Nộp bài'}</NutHS>}
        {kq?.ok && (
          <div className="flex flex-col gap-2">
            <p className="text-[18px] font-bold" style={{ color: kq.dat ? MAU.dung : MAU.sai }}>
              {kq.dat ? `Đúng ${kq.so_dung}/3 — máy chế biến chạy nhanh gấp đôi!` : `Đúng ${kq.so_dung}/3 — chưa đạt. Xem đáp án đúng (viền xanh) rồi 60 giây nữa thử lại nhé.`}
            </p>
            <p className="text-[14px]" style={{ color: MAU.muted }}>Hôm nay còn {kq.con_luot} lần tăng tốc.</p>
            <NutHS onClick={dong}>Về nông trại</NutHS>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
