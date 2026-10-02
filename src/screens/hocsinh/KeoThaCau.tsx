// CÂU KÉO THẢ (TSA — thể loại giữ đúng như đề PDF): đề có vài ô trống ____, ngân hàng thẻ bên dưới; HS KÉO thẻ vào ô
// (hoặc chạm thẻ rồi chạm ô — iPad/điện thoại). Một thẻ dùng được nhiều lần (đề có câu ghi rõ "một thẻ có thể dùng nhiều lần").
// Dữ liệu từ bai_test_cau: noi_dung (đề, có dòng thẻ + ô ____) · lua_chon (ngân hàng thẻ, mỗi thẻ "$…$") · dap_an_key (mảng thẻ đúng, theo thứ tự ô).
// Chấm ở lib/testonline.ts (gradeKeoTha). Màu theo skin em chọn (skin/KhungHS) — chỉ màu ngữ nghĩa đúng/sai cố định, nền trong suốt.
import { useState, type CSSProperties } from 'react'
import { MathText } from '../kho/ui'
import { MAU } from './skin/KhungHS'

const NEN_DUNG = 'rgba(34,160,107,0.16)', NEN_SAI = 'rgba(229,72,77,0.16)'
const VIEN_DUNG = 'rgba(34,160,107,0.5)', VIEN_SAI = 'rgba(229,72,77,0.5)'
const NEN_ACC = 'color-mix(in srgb, var(--sk-acc) 16%, transparent)'
const R = 'calc(var(--sk-radius) * 0.6)'

const boBold = (s: string) => s.replace(/\*\*/g, '')
// Đoạn CHỈ gồm thẻ (ngân hàng) — không hiện lại trong đề vì đã vẽ thành các thẻ kéo được.
function laDoanNganHang(p: string): boolean {
  if (/_{4,}/.test(p)) return false
  const t = boBold(p).replace(/\$\\quad\$/g, ' ')
  const con = t.replace(/\[\s*(\$[^$]*\$|[^[\]$]+?)\s*\]|\$[^$]+\$/g, ' ').replace(/[[\]|;,\s]|\bvà\b/g, '')
  return con === '' && /\[|\$/.test(t)
}

export function KeoThaCau({ noiDung, nganHang, value, onChange, key_, daCham }: {
  noiDung: string; nganHang: string[]; value: (string | null)[]; onChange: (v: (string | null)[]) => void
  key_?: string[]; daCham: boolean; mon?: string | null   // mon: để dành (môn chữ thường như Anh); TSA là Toán ⇒ luôn MathText
}) {
  const [chonThe, setChonThe] = useState<number | null>(null)       // chỉ số thẻ đang cầm (chạm)
  const doan = noiDung.split('\n\n').filter((p) => !laDoanNganHang(p))
  let o = 0 // chỉ số ô trống chạy qua các đoạn
  const dat = (oi: number, the: string | null) => { if (daCham) return; const nx = [...value]; nx[oi] = the; onChange(nx) }
  const chamO = (oi: number) => {
    if (daCham) return
    if (chonThe != null) { dat(oi, nganHang[chonThe]); setChonThe(null) } else if (value[oi]) dat(oi, null)
  }
  const kieuO = (oi: number): CSSProperties => {
    const v = value[oi]
    const base: CSSProperties = { borderRadius: R, color: MAU.ink, minWidth: 72, minHeight: 36, padding: '2px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle', margin: '2px 4px' }
    if (daCham) {
      const dung = v != null && key_?.[oi] === v
      return { ...base, border: `1.5px solid ${dung ? VIEN_DUNG : VIEN_SAI}`, background: dung ? NEN_DUNG : NEN_SAI }
    }
    return v ? { ...base, border: `2px solid ${MAU.acc}`, background: NEN_ACC } : { ...base, border: `2px dashed ${chonThe != null ? MAU.acc : MAU.line}`, background: MAU.surface2 }
  }
  return (
    <div>
      <div className="mb-3 space-y-2 text-[19px] leading-relaxed" style={{ color: MAU.ink }}>
        {doan.map((p, pi) => {
          if (!/_{4,}/.test(p)) return <div key={pi}><MathText>{p}</MathText></div>
          const manh = p.split(/_{4,}/)
          return (
            <div key={pi} className="flex flex-wrap items-center">
              {manh.map((m, mi) => {
                const oi = o
                const coO = mi < manh.length - 1
                if (coO) o++
                return (
                  <span key={mi} className="inline-flex flex-wrap items-center">
                    {m.trim() !== '' && <MathText>{m}</MathText>}
                    {coO && (
                      <span role="button" tabIndex={0} aria-label={`Ô trống ${oi + 1}`} style={kieuO(oi)}
                        onClick={() => chamO(oi)}
                        onDragOver={(e) => { if (!daCham) e.preventDefault() }}
                        onDrop={(e) => { e.preventDefault(); const k = Number(e.dataTransfer.getData('text/plain')); if (!Number.isNaN(k) && nganHang[k] != null) dat(oi, nganHang[k]) }}>
                        {value[oi] ? <MathText>{value[oi]!}</MathText> : <span style={{ color: MAU.muted, fontSize: 15 }}>ô {oi + 1}</span>}
                      </span>
                    )}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
      {!daCham && (
        <div>
          <p className="mb-1.5 text-[14px]" style={{ color: MAU.muted }}>Kéo thẻ vào ô trống (hoặc chạm thẻ rồi chạm ô):</p>
          <div className="flex flex-wrap gap-2">
            {nganHang.map((the, k) => (
              <span key={k} role="button" tabIndex={0} draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', String(k)); e.dataTransfer.effectAllowed = 'copy' }}
                onClick={() => setChonThe((c) => (c === k ? null : k))}
                className="inline-flex cursor-grab select-none items-center px-3 py-1.5 text-[18px] active:cursor-grabbing"
                style={{ borderRadius: R, color: MAU.ink, border: chonThe === k ? `2px solid ${MAU.acc}` : `1.5px solid ${MAU.line}`, background: chonThe === k ? NEN_ACC : MAU.surface }}>
                <MathText>{the}</MathText>
              </span>
            ))}
          </div>
        </div>
      )}
      {daCham && key_ && value.some((v, i) => v !== key_[i]) && (
        <div className="mt-2 text-[17px]" style={{ color: MAU.muted }}>
          Đáp án đúng:{' '}
          {key_.map((k, i) => (
            <span key={i} className="mr-3 inline-flex items-center gap-1" style={{ color: MAU.dung }}><b>Ô {i + 1}:</b> <MathText>{k}</MathText></span>
          ))}
        </div>
      )}
    </div>
  )
}
