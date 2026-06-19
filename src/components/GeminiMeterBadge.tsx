// Badge nổi: token + tiền (₫) AI đã dùng trong PHIÊN (reset khi F5 / bấm ↺). Ẩn khi chưa gọi AI lần nào.
// Giá sửa ở GEMINI_GIA/USD_VND (src/lib/kho/api.ts). Subscribe meter → cập nhật realtime sau mỗi call.
import { useEffect, useState } from 'react'
import { getGeminiMeter, onGeminiMeter, resetGeminiMeter, type GeminiMeter } from '../lib/kho/api'

export default function GeminiMeterBadge() {
  const [m, setM] = useState<GeminiMeter>(getGeminiMeter())
  useEffect(() => onGeminiMeter(() => setM({ ...getGeminiMeter() })), [])
  if (!m.calls) return null
  const tok = m.in + m.out + m.think
  return (
    <div className="fixed bottom-3 right-3 z-[70] flex items-center gap-2 rounded-full border border-slate-300 bg-white/95 px-3 py-1.5 text-[12px] shadow-lg backdrop-blur"
      title={`Phiên này: ${m.calls} lần gọi · in ${m.in.toLocaleString('vi-VN')} · out ${m.out.toLocaleString('vi-VN')} · suy luận ${m.think.toLocaleString('vi-VN')} token`}>
      <span className="font-semibold text-slate-700">🤖 AI phiên này</span>
      <span className="text-slate-500">{m.calls} lần · {tok.toLocaleString('vi-VN')} tok</span>
      <span className="font-bold text-emerald-600">≈ {m.vnd.toLocaleString('vi-VN')}₫</span>
      <button onClick={resetGeminiMeter} title="Đặt lại bộ đếm" className="rounded px-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">↺</button>
    </div>
  )
}
