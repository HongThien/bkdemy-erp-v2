// Mô phỏng TRỌNG TÀI trận chấm ở máy chủ (không cần mạng/đăng nhập): người đúng khi mạng trễ, sai + bỏ trống, bot không biết đáp án. Chạy: npx tsx scripts/thu-tran-cham.ts
import { TrongTai, type NguoiTran } from '../src/dautu/lib/trongTai'
import { ganBot } from '../src/dautu/lib/bot'
import type { Cau } from '../src/dautu/nguon/kieu'

const DAP: number[] = [1, 3, 0, 2, 1]                // đáp án thật (chỉ máy chủ giả biết)
const ds: Cau[] = DAP.map((_, k) => ({ id: 'q' + k, de: 'Đề ' + k, opts: [0, 1, 2, 3].map((i) => ({ id: `q${k}#${i}`, text: 'op' + i })), dung: '', giai: null }))
const log: string[] = []
let goi = 0
const cham = (tre: number) => async (i: number, opt: string | null, ms: number) => {
  goi++
  await new Promise((r) => setTimeout(r, tre))
  const idx = opt == null ? -1 : Number(opt.split('#')[1])
  log.push(`server cham i=${i} chon=${idx} -> ${idx === DAP[i] ? 'ĐÚNG' : 'sai'}`)
  return { dung: idx === DAP[i], dungId: `q${i}#${DAP[i]}`, giai: 'giải ' + i }
}
const nguoi: [NguoiTran, NguoiTran] = [{ ma: 'a', ten: 'Em', nv: 'x' }, { ma: 'b', ten: 'Bot', nv: 'y', bot: 'de' }]

async function chay(ten: string, tre: number, hanhVi: (t: TrongTai, i: number) => void) {
  log.length = 0; goi = 0
  const t = new TrongTai({ mid: ten, nguoi, ds, giayVong: 4, cham: { ghe: [0], goi: cham(tre) } })
  // bot rất chậm (không can thiệp) để kiểm tra riêng đường người chơi
  let lastI = -1
  t.dangKy((s) => {
    if (s.pha === 'vong' && s.i !== lastI) { lastI = s.i; setTimeout(() => hanhVi(t, s.i), 300) }
  })
  t.bat()
  await new Promise<void>((xong) => { const h = setInterval(() => { if (t.snap.ketQua) { clearInterval(h); xong() } }, 100) })
  await t.chamXong()
  const s = t.snap
  console.log(`\n== ${ten} (trễ mạng ${tre}ms) ==\n  đúng của em: ${s.dung[0]} | nk ghế 0: ${s.nk.filter((x) => x.ghe === 0).map((x) => (x.dung ? '✔' : x.chon ? '✗' : '–')).join('')} | số lần gọi máy chủ: ${goi}`)
  console.log('  ' + log.join('\n  '))
  console.log('  ds[i].dung đã lộ:', s.ds.map((c) => c.dung !== '').join(','))
  return s
}

// 1) em trả lời đúng cả 5 câu, mạng trễ 450ms (lớn hơn MS_CHO_BU 220ms) — không được thua oan
const s1 = await chay('ĐÚNG HẾT, mạng trễ', 450, (t, i) => t.traLoi(0, `q${i}#${DAP[i]}`))
console.log(s1.dung[0] === 5 ? '  ✔ 5/5 đúng, không thua oan vì trễ mạng' : '  ✖ SAI: ' + s1.dung[0])
// 2) em sai câu 2, bỏ qua câu 3 (không bấm → hết giờ), còn lại đúng
const s2 = await chay('SAI + BỎ TRỐNG', 100, (t, i) => { if (i === 1) t.traLoi(0, `q${i}#${(DAP[i] + 1) % 4}`); else if (i === 2) { /* không bấm */ } else t.traLoi(0, `q${i}#${DAP[i]}`) })
console.log(s2.dung[0] === 3 && goi >= 5 ? '  ✔ 3 đúng; câu bỏ trống được gửi "bỏ qua" để máy chủ ghi' : '  ✖ SAI')
// 3) có BOT 'kho' (nhanh): em không bấm ⇒ bot ăn câu; mỗi câu em chưa trả lời phải được gửi "bỏ qua"; bot không được biết đáp án
{
  log.length = 0; goi = 0
  const t = new TrongTai({ mid: 'bot', nguoi, ds, giayVong: 4, cham: { ghe: [0], goi: cham(80) } })
  ganBot(t, 1, 'kho')
  t.bat()
  await new Promise<void>((xong) => { const h = setInterval(() => { if (t.snap.ketQua) { clearInterval(h); xong() } }, 100) })
  await t.chamXong()
  const s = t.snap
  console.log(`\n== CÓ BOT (em không bấm) ==\n  bot đúng ${s.dung[1]}/5 · em đúng ${s.dung[0]} · số lần gọi máy chủ ${goi}`)
  console.log('  ' + log.join('\n  '))
  const ok = goi === 5 && log.every((l) => l.includes('chon=-1')) && s.dung[0] === 0 && s.dung[1] >= 3 && s.ketQua?.thang === 1
  console.log(ok ? '  ✔ bot thắng; 5 câu em bỏ trống đều gửi "bỏ qua"; bot chơi không cần đáp án' : '  ✖ SAI')
}
process.exit(0)
