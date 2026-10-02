// BOT — chạy cạnh trọng tài. Thông số theo bản gốc: thời gian trả lời + tỉ lệ sai lần đầu/lần hai; từ dài bot chậm hơn,
// thỉnh thoảng "ngập ngừng". Bot nhìn snapshot như người chơi, không đọc đáp án trước khi tới giờ bấm.
import type { MucBot, NguoiTran, Snap, TrongTai } from './trongTai'
import { TU_THEO_ID } from '../data/kho'
import { chon } from './tienich'

export const BOT: Record<MucBot, { ten: string; nhan: string; mau: string; nv: string; min: number; max: number; sai1: number; sai2: number }> = {
  de: { ten: 'Boss Thùy · Tập sự', nhan: 'Dễ', mau: '#22c55e', nv: 'boss_thuy', min: 2400, max: 4200, sai1: 0.4, sai2: 0.24 },
  vua: { ten: 'Boss Thùy · Nhanh trí', nhan: 'Vừa', mau: '#3b82f6', nv: 'boss_thuy', min: 1600, max: 2700, sai1: 0.24, sai2: 0.12 },
  kho: { ten: 'Boss Thùy · Thần tốc', nhan: 'Khó', mau: '#ef4444', nv: 'boss_thuy', min: 900, max: 1650, sai1: 0.07, sai2: 0.03 },
}

export function nguoiBot(muc: MucBot, ten?: string): NguoiTran {
  const b = BOT[muc]
  return { ma: 'bot-' + muc + '-' + Math.random().toString(36).slice(2, 6), ten: ten ?? b.ten, nv: b.nv, bot: muc }
}

const TEN_BOT = ['Bot Lém Lỉnh', 'Bot Mọt Sách', 'Bot Tia Chớp', 'Bot Siêu Tốc', 'Bot Bí Ẩn', 'Bot Chăm Chỉ', 'Bot Nhanh Nhảu']
export function nguoiBotGiai(i: number): NguoiTran {
  const muc: MucBot = (['de', 'vua', 'vua', 'kho'] as const)[i % 4]
  const nv = ['tham_hiem_nam', 'tham_hiem_nu', 'hiep_si_dem', 'phap_su'][i % 4]
  return { ma: 'bot-g' + i + '-' + Math.random().toString(36).slice(2, 6), ten: TEN_BOT[i % TEN_BOT.length], nv, bot: muc }
}

export function ganBot(tai: TrongTai, ghe: 0 | 1, muc: MucBot) {
  const p = BOT[muc]
  let hen: ReturnType<typeof setTimeout> | null = null
  let vongDangChay = -1
  let lan = 0
  const huy = () => { if (hen) clearTimeout(hen); hen = null }

  const thu = (s: Snap) => {
    const cau = s.ds[s.i]
    const tu = TU_THEO_ID.get(cau.id)
    const chu = (cau.dao ? tu?.en : tu?.vi) ?? ''
    const min = lan > 1 ? 480 : lan === 1 ? 650 : p.min
    const max = lan > 1 ? 950 : lan === 1 ? 1350 : p.max
    const dai = Math.min(450, Math.max(0, chu.length - 7) * 28)
    const ngapNgung = lan === 0 && Math.random() < 0.12 ? 500 + Math.random() * 900 : 0
    const tre = Math.floor(min + Math.random() * (max - min) + dai + ngapNgung)
    const xacSuatSai = lan === 0 ? p.sai1 : lan === 1 ? p.sai2 : 0
    hen = setTimeout(() => {
      const hienTai = tai.snap
      if (hienTai.pha !== 'vong' || hienTai.i !== s.i) return
      const conSai = cau.opts.filter((o) => o !== cau.id && !hienTai.sai[ghe].includes(o))
      const opt = Math.random() < xacSuatSai && conSai.length ? chon(conSai) : cau.id
      lan++
      tai.traLoi(ghe, opt)
      if (opt !== cau.id) thu(tai.snap)
    }, tre)
  }

  return tai.dangKy((s) => {
    if (s.pha === 'vong' && s.i !== vongDangChay) {
      huy(); vongDangChay = s.i; lan = 0; thu(s)
    } else if (s.pha === 'vong' && !hen) {
      thu(s) // vừa hết tạm dừng
    } else if (s.pha !== 'vong') {
      huy()
      if (s.pha === 'dung') vongDangChay = s.i
    }
  })
}
