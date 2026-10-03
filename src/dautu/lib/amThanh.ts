// Âm thanh tổng hợp bằng WebAudio (không cần file) + giọng đọc tiếng Anh của trình duyệt. Cài đặt lưu ở máy.
import { useEffect, useState } from 'react'
import { docLS, ghiLS, taoKho } from './tienich'

export interface CaiDat { amThanh: boolean; tuDocTu: boolean; giongNu: boolean }
const K = 'dtv_cai_dat'
export const khoCaiDat = taoKho<CaiDat>({ amThanh: true, tuDocTu: true, giongNu: true, ...docLS<Partial<CaiDat>>(K, {}) })
khoCaiDat.nghe((v) => ghiLS(K, v))

export function useCaiDat() {
  const [c, setC] = useState(khoCaiDat.lay())
  useEffect(() => khoCaiDat.nghe(setC), [])
  return c
}

let ctx: AudioContext | null = null
function ac() {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function not(tan: number, bd: number, dai: number, kieu: OscillatorType = 'sine', to = 0.12) {
  const a = ac()
  const o = a.createOscillator()
  const g = a.createGain()
  o.type = kieu
  o.frequency.setValueAtTime(tan, a.currentTime + bd)
  g.gain.setValueAtTime(0.0001, a.currentTime + bd)
  g.gain.exponentialRampToValueAtTime(to, a.currentTime + bd + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + bd + dai)
  o.connect(g).connect(a.destination)
  o.start(a.currentTime + bd)
  o.stop(a.currentTime + bd + dai + 0.02)
}

export type TiengDong = 'click' | 'dung' | 'sai' | 'thang' | 'thua' | 'tich' | 'bat_dau' | 'chem' | 'len_cap' | 'thong_bao'
export function phat(t: TiengDong) {
  if (!khoCaiDat.lay().amThanh) return
  try {
    switch (t) {
      case 'click': not(660, 0, 0.06, 'triangle', 0.06); break
      case 'dung': not(784, 0, 0.1, 'triangle'); not(1175, 0.08, 0.16, 'triangle'); break
      case 'sai': not(220, 0, 0.18, 'sawtooth', 0.06); not(180, 0.1, 0.2, 'sawtooth', 0.05); break
      case 'tich': not(1200, 0, 0.04, 'square', 0.03); break
      case 'chem': not(420, 0, 0.08, 'sawtooth', 0.07); not(140, 0.05, 0.14, 'square', 0.05); break
      case 'bat_dau': [523, 659, 784].forEach((f, i) => not(f, i * 0.12, 0.14, 'triangle')); break
      case 'thang': [523, 659, 784, 1047].forEach((f, i) => not(f, i * 0.13, 0.22, 'triangle', 0.13)); break
      case 'thua': [440, 392, 349, 262].forEach((f, i) => not(f, i * 0.16, 0.24, 'triangle', 0.1)); break
      case 'len_cap': [659, 784, 988, 1319, 1568].forEach((f, i) => not(f, i * 0.09, 0.2, 'triangle', 0.12)); break
      case 'thong_bao': not(880, 0, 0.1, 'sine'); not(1320, 0.12, 0.16, 'sine'); break
    }
  } catch { /* trình duyệt chặn audio trước lần chạm đầu */ }
}

let giong: SpeechSynthesisVoice | null = null
function chonGiong() {
  const ds = window.speechSynthesis?.getVoices() ?? []
  const en = ds.filter((v) => /^en[-_]/i.test(v.lang))
  const nu = khoCaiDat.lay().giongNu
  giong = en.find((v) => /samantha|female|zira|jenny|aria|google us english/i.test(v.name) === nu) ?? en.find((v) => v.lang === 'en-US') ?? en[0] ?? null
}
if (typeof window !== 'undefined' && window.speechSynthesis) {
  chonGiong()
  window.speechSynthesis.onvoiceschanged = chonGiong
}

export function doc(text: string, cham = false) {
  try {
    const s = window.speechSynthesis
    if (!s) return
    s.cancel()
    const u = new SpeechSynthesisUtterance(text)
    if (!giong) chonGiong()
    if (giong) u.voice = giong
    u.lang = giong?.lang ?? 'en-US'
    u.rate = cham ? 0.7 : 0.92
    s.speak(u)
  } catch { /* không có giọng đọc */ }
}
