// ============================================================================
// HocTuDau — màn PICKER cho "Học từ đầu" (Thùy 19/09, gắn bổ trợ đuổi):
// (1) LoTrinhHTD — lộ trình chuyên đề→dạng TUẦN TỰ (khoá/mở/xong tính sẵn ở RPC
//     htd_lo_trinh, xem migration 202609191521+...1524 — component chỉ vẽ).
// (2) ChiTietDangHTD — 3 chức năng của 1 dạng: Đọc lý thuyết · Luyện tập · Test.
// (3) LyThuyetHTD — đọc lý thuyết (ghi nhận đã đọc ngay khi mở, xem htd_ly_thuyet).
// Phần LÀM BÀI (luyện tập/test) nằm trong HocSinhApp.tsx (component LamHTD) vì cần
// dùng chung LamBai local ở đó — file này KHÔNG đụng bài làm, chỉ điều hướng.
// ============================================================================
import { useEffect, useState } from 'react'
import { htdLoTrinh, htdLyThuyet, type DangHTD } from '../../lib/hoctudau'
import { MathText } from '../kho/ui'

function Khung({ desktop, children }: { desktop?: boolean; children: React.ReactNode }) {
  return (
    <div className={desktop ? 'mx-auto min-h-screen max-w-2xl bg-[#f4f7fb] px-8 py-6' : 'mx-auto flex min-h-screen max-w-md flex-col bg-ios px-4 pb-8 pt-[calc(14px+env(safe-area-inset-top))]'}>
      {children}
    </div>
  )
}
function NutBack({ onBack, desktop }: { onBack: () => void; desktop?: boolean }) {
  return (
    <button onClick={onBack} className={`mb-3 flex items-center gap-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>
      <span aria-hidden>←</span> Quay lại
    </button>
  )
}

export function LoTrinhHTD({ mon, onPick, onBack, desktop }: { mon: string; onPick: (d: { ma_dang: string; ten_dang: string; xong: boolean }) => void; onBack: () => void; desktop?: boolean }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [dangs, setDangs] = useState<DangHTD[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    htdLoTrinh(mon).then((ds) => { setDangs(ds); setState('san_sang') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [mon])

  let lastChuyenDe = ''
  return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[22px]' : 'text-[19px]'}`}>Học từ đầu</h1>
      <p className={`mt-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>Học tuần tự từng dạng trong 1 chuyên đề — xong dạng này mới mở dạng sau. Có thể bỏ qua chuyên đề này, sang chuyên đề khác.</p>

      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px] text-ph-label-2">Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'san_sang' && dangs.length === 0 && (
        <p className="mt-8 text-center text-[13px] text-ph-label-2">Em chưa có lộ trình bổ trợ đuổi nào cần học.</p>
      )}

      {state === 'san_sang' && dangs.length > 0 && (
        <div className="mt-4 flex flex-col gap-2.5">
          {dangs.map((d) => {
            const moiChuyenDe = d.ten_chuyen_de !== lastChuyenDe
            lastChuyenDe = d.ten_chuyen_de
            return (
              <div key={d.ma_dang} className="contents">
                {moiChuyenDe && <div className="mt-2 text-[11px] font-bold uppercase tracking-wide text-ph-label-2 first:mt-0">{d.ten_chuyen_de}</div>}
                <button onClick={() => d.mo && onPick({ ma_dang: d.ma_dang, ten_dang: d.ten_dang, xong: d.xong })}
                  disabled={!d.mo}
                  className={`flex items-center gap-3 rounded-2xl p-3.5 text-left shadow-sm ${d.mo ? 'bg-white active:scale-[0.98]' : 'bg-white/50 opacity-60'}`}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[16px]"
                    style={{ background: d.xong ? '#DFF6EA' : d.mo ? '#E3EEFF' : '#F1F3F8' }}>
                    {d.xong ? '✅' : d.mo ? '📖' : '🔒'}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-ph-label">{d.ten_dang}</span>
                    <span className="mt-0.5 block text-[11.5px] text-ph-label-2">
                      {d.xong ? 'Đã xong — có thể luyện thêm' : d.mo ? (d.doc_ly_thuyet ? 'Đã đọc lý thuyết — chưa test' : 'Chưa học') : 'Khoá — hoàn thành dạng trước đã'}
                    </span>
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </Khung>
  )
}

export function ChiTietDangHTD({ dang, onLyThuyet, onLuyenTap, onTest, onBack, desktop }: {
  dang: { ma_dang: string; ten_dang: string; xong: boolean }
  onLyThuyet: () => void; onLuyenTap: () => void; onTest: () => void; onBack: () => void; desktop?: boolean
}) {
  return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[20px]' : 'text-[17px]'}`}>{dang.ten_dang}</h1>
      {dang.xong && <p className="mt-1 text-[12.5px] font-semibold text-emerald-600">✅ Đã có bài test cho dạng này</p>}
      <div className="mt-5 flex flex-col gap-3">
        <button onClick={onLyThuyet} className="rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.98]">
          <span className="block text-[15px] font-bold text-ph-label">📖 Đọc lý thuyết</span>
          <span className="mt-1 block text-[12.5px] text-ph-label-2">Đọc trước khi luyện cho chắc.</span>
        </button>
        <button onClick={onLuyenTap} className="rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.98]">
          <span className="block text-[15px] font-bold text-ph-label">🎯 Luyện tập</span>
          <span className="mt-1 block text-[12.5px] text-ph-label-2">Luyện thoải mái, không giới hạn — không tính vào kết quả học tập.</span>
        </button>
        <button onClick={onTest} className="rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.98]">
          <span className="block text-[15px] font-bold text-ph-label">📝 Làm bài Test</span>
          <span className="mt-1 block text-[12.5px] text-ph-label-2">10 câu — nộp là xong dạng, tính vào kết quả học tập, mở dạng tiếp theo.</span>
        </button>
      </div>
    </Khung>
  )
}

export function LyThuyetHTD({ mon, dang, onBack, desktop }: { mon: string; dang: { ma_dang: string; ten_dang: string }; onBack: () => void; desktop?: boolean }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [noiDung, setNoiDung] = useState('')
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    htdLyThuyet(mon, dang.ma_dang).then((r) => { setNoiDung(r.noi_dung); setFileUrl(r.file_url); setState('san_sang') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [mon, dang.ma_dang])

  return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[20px]' : 'text-[17px]'}`}>{dang.ten_dang}</h1>
      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px] text-ph-label-2">Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'san_sang' && (
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          {noiDung
            ? <div className="whitespace-pre-line text-[14px] leading-relaxed text-ph-label"><MathText>{noiDung}</MathText></div>
            : <p className="text-[13px] text-ph-label-2">Dạng này chưa có lý thuyết soạn sẵn — em xem qua bài test hoặc hỏi thầy cô nhé.</p>}
          {fileUrl && <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-3 block text-[13px] font-semibold text-brand underline">📎 Xem file đính kèm</a>}
        </div>
      )}
    </Khung>
  )
}
