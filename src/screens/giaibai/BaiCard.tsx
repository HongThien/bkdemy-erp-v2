// Thẻ 1 BÀI (đề + ảnh + phương án/mệnh đề + đáp án gợi ý) — dùng chung cho Kho bài / Bài của tôi / Duyệt.
import type { ReactNode } from 'react'
import { MathText, mucDoTone } from '../kho/ui'
import { LOAI_CAU_LABEL, NHANH_LABEL, laHinh, type GiaiBaiNhanh } from '../../lib/giaibai'
import type { MenhDe } from '../../lib/kho/api'

export type BaiView = {
  nhanh: GiaiBaiNhanh; ma: string; khoi: string; loai_cau: string; muc_do: number | null
  nhom_truoc: string; nhom_ten: string; nhom_ma: string
  de_bai: string; gia_thiet: string | null; anh: string | null; lua_chon: string[] | null; menh_de: MenhDe[] | null; dap_an: string | null
}

export function MucDo({ m }: { m: number | null }) {
  if (m == null) return <span className="rounded px-1.5 py-0.5 text-[11px] text-slate-400 ring-1 ring-slate-200" title="Nhánh Hình chưa có độ khó">độ khó —</span>
  return <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ring-1 ${mucDoTone(m).chip}`} title={`Độ khó ${m}/5`}>{'●'.repeat(m)}{'○'.repeat(5 - m)}</span>
}

export function BaiHead({ b, right }: { b: BaiView; right?: ReactNode }) {
  return (
    <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">{b.ma}</code>
      <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${laHinh(b.nhanh) ? 'bg-sky-50 text-sky-700' : 'bg-violet-50 text-violet-700'}`}>{NHANH_LABEL[b.nhanh]}</span>
      <span>{LOAI_CAU_LABEL[b.loai_cau] ?? b.loai_cau}</span>
      <span>· Khối {b.khoi}</span>
      <MucDo m={b.muc_do} />
      {right && <div className="ml-auto flex items-center gap-1.5">{right}</div>}
    </div>
  )
}

export function BaiBody({ b, compact }: { b: BaiView; compact?: boolean }) {
  return (
    <div className={`text-[14px] leading-relaxed text-slate-800 ${b.anh ? 'grid grid-cols-[1fr_auto] gap-4' : ''}`}>
      <div className="min-w-0">
        {b.gia_thiet && <div className="mb-1 whitespace-pre-line text-[13px] text-slate-600"><span className="font-medium text-slate-500">Giả thiết: </span><MathText>{b.gia_thiet}</MathText></div>}
        <MathText>{b.de_bai}</MathText>
        {b.lua_chon && (
          <ul className="mt-1.5 space-y-0.5 text-[13px] text-slate-600">
            {b.lua_chon.map((o, i) => <li key={i}>{String.fromCharCode(65 + i)}. <MathText>{o}</MathText></li>)}
          </ul>
        )}
        {b.menh_de && (
          <ul className="mt-1.5 space-y-0.5 text-[13px] text-slate-600">
            {b.menh_de.map((m, i) => <li key={i}>{String.fromCharCode(97 + i)}) <MathText>{m.noi_dung}</MathText> <span className="text-slate-400">[{m.dap_an}]</span></li>)}
          </ul>
        )}
        {b.dap_an && <div className="mt-1.5 text-[13px]"><span className="font-medium text-slate-500">Đáp án có sẵn: </span><MathText>{b.dap_an}</MathText></div>}
      </div>
      {b.anh && <img src={b.anh} alt="hình" className={`${compact ? 'max-h-36 max-w-[200px]' : 'max-h-56 max-w-[280px]'} w-auto self-start rounded-lg border border-slate-200 bg-white`} />}
    </div>
  )
}

export function NhomHead({ b, soBai }: { b: BaiView; soBai: number }) {
  return (
    <div className="mb-2 flex items-center gap-2 text-[12px] text-slate-500">
      <span className="text-slate-400">{b.nhom_truoc} ›</span>
      <span className="font-semibold text-slate-700">{b.nhom_ten}</span>
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">{b.nhom_ma}</code>
      <span className="text-slate-400">· {soBai} bài</span>
    </div>
  )
}
