import { useEffect, useState } from 'react'
import { lopHocSinh } from '../mock/fixtures'

const MA_LOI = ['01', '02', '03', '04', '05', '06']

// Mock dạng (KP) cho từng câu — sau lấy từ kho (knowledge_map / grade_details.ma_dang)
const DANG = [
  { ma: 'DG00012', ten: 'Tìm UCLN' },
  { ma: 'DG00031', ten: 'Phân tích ra thừa số nguyên tố' },
  { ma: 'DG00007', ten: 'Quy đồng mẫu số' },
  { ma: 'DG00045', ten: 'Rút gọn phân số' },
  { ma: 'DG00019', ten: 'So sánh phân số' },
  { ma: 'DG00052', ten: 'Cộng trừ phân số' },
  { ma: 'DG00060', ten: 'Tìm x trong đẳng thức' },
  { ma: 'DG00023', ten: 'Dấu hiệu chia hết' },
  { ma: 'DG00038', ten: 'Bội chung nhỏ nhất' },
  { ma: 'DG00041', ten: 'Ước và bội' },
]
const SO_CAU = DANG.length

type CauKQ = { dung: boolean | null; maLoi: string | null }

// Chấm ET: Đúng/Sai = bắt buộc; mã lỗi 01–06 = TÙY CHỌN (chỉ khi Sai). 1-tap. Esc→đóng.
export default function ChamETSheet({
  title,
  lop,
  onClose,
}: {
  title: string
  lop: string
  onClose: () => void
}) {
  const hsList = lopHocSinh[lop] ?? lopHocSinh['6A1']
  const [data, setData] = useState<Record<string, CauKQ[]>>(() =>
    Object.fromEntries(
      hsList.map((h) => [h.maHs, Array.from({ length: SO_CAU }, () => ({ dung: null, maLoi: null }))]),
    ),
  )
  const [sel, setSel] = useState(hsList[0].maHs)

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  // Câu xong = đã chọn Đúng/Sai (mã lỗi KHÔNG bắt buộc)
  const cauDone = (c: CauKQ) => c.dung !== null
  const hsDone = (maHs: string) => data[maHs].every(cauDone)
  const doneCount = hsList.filter((h) => hsDone(h.maHs)).length
  const allDone = doneCount === hsList.length

  const setCau = (i: number, patch: Partial<CauKQ>) =>
    setData((d) => ({ ...d, [sel]: d[sel].map((c, idx) => (idx === i ? { ...c, ...patch } : c)) }))

  const cur = data[sel]
  const curHs = hsList.find((h) => h.maHs === sel)
  const curDoneCau = cur.filter(cauDone).length

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <header className="flex items-center justify-between border-b px-5 py-3">
        <div className="text-sm font-semibold">{title}</div>
        <button onClick={onClose} className="rounded px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">
          ✕ Đóng (Esc)
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Trái: danh sách HS */}
        <aside className="w-60 shrink-0 overflow-auto border-r">
          {hsList.map((h) => {
            const done = hsDone(h.maHs)
            return (
              <button
                key={h.maHs}
                onClick={() => setSel(h.maHs)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${
                  sel === h.maHs ? 'bg-slate-800 text-white' : 'hover:bg-slate-50'
                }`}
              >
                <span>{h.ten}</span>
                <span className={done ? 'text-emerald-500' : 'text-slate-300'}>{done ? '✓' : '•'}</span>
              </button>
            )
          })}
        </aside>

        {/* Phải: từng câu của HS đang chọn */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-sm font-semibold">{curHs?.ten}</span>
            <span className="text-xs text-slate-400">· {curDoneCau}/{SO_CAU} câu</span>
          </div>

          <div className="max-w-4xl">
            {cur.map((c, i) => {
              const dang = DANG[i]
              const isSai = c.dung === false
              return (
                <div key={i} className="flex items-center gap-3 border-t py-2">
                  <div className="w-12 shrink-0 text-sm text-slate-500">Câu {i + 1}</div>
                  <div className="w-64 shrink-0 truncate text-xs text-slate-400" title={`${dang.ma} · ${dang.ten}`}>
                    <span className="text-slate-300">{dang.ma}</span> · {dang.ten}
                  </div>

                  <div className="ml-auto flex items-center gap-1.5">
                    {/* Đúng / Sai — bắt buộc */}
                    <button
                      onClick={() => setCau(i, { dung: true, maLoi: null })}
                      className={`rounded px-4 py-1.5 text-sm ${c.dung === true ? 'bg-emerald-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                    >
                      Đúng
                    </button>
                    <button
                      onClick={() => setCau(i, { dung: false })}
                      className={`rounded px-4 py-1.5 text-sm ${isSai ? 'bg-red-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                    >
                      Sai
                    </button>

                    {/* Mã lỗi — tùy chọn, chỉ bật khi Sai */}
                    <span className="px-1 text-xs text-slate-300">lỗi</span>
                    {MA_LOI.map((m) => {
                      const on = isSai && c.maLoi === m
                      return (
                        <button
                          key={m}
                          disabled={!isSai}
                          onClick={() => setCau(i, { maLoi: c.maLoi === m ? null : m })}
                          title={isSai ? `Lỗi ${m} (tùy chọn)` : 'Chọn Sai trước'}
                          className={`size-9 rounded text-sm ${
                            on
                              ? 'bg-red-500 text-white'
                              : isSai
                                ? 'bg-slate-100 hover:bg-slate-200'
                                : 'cursor-not-allowed bg-slate-50 text-slate-300'
                          }`}
                        >
                          {m}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      {/* Action bar */}
      <footer className="flex items-center justify-between border-t px-5 py-3">
        <div className="text-sm text-slate-500">
          Đã chấm <b>{doneCount}/{hsList.length}</b> HS
          {!allDone && <span> · còn {hsList.length - doneCount}</span>}
        </div>
        <button
          disabled={!allDone}
          onClick={() => {
            console.log('TODO: save ET')
            onClose()
          }}
          className={`rounded px-4 py-2 text-sm font-medium ${
            allDone ? 'bg-slate-800 text-white hover:bg-slate-700' : 'cursor-not-allowed bg-slate-200 text-slate-400'
          }`}
          title={allDone ? '' : 'Còn HS chưa chấm đủ'}
        >
          Xác nhận xong
        </button>
      </footer>
    </div>
  )
}
