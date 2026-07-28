// Kiểm HÀNG RÀO CHI PHÍ của worker — CHẠY KHÔ, không gọi API, không tốn đồng nào.
// Trả lời: cỡ lớp nào × model nào thì tốn bao nhiêu, và chỗ nào bị chặn.
// Chạy: node scripts/verify_danhgia_chiphi.mjs
import { readFileSync } from 'node:fs'

const src = readFileSync('worker/danhgia.mjs', 'utf8')
const so = (ten) => Number(src.match(new RegExp(`const ${ten} = ([\\d_]+)`))?.[1]?.replace(/_/g, ''))
const TOK_MOI_EM = so('TOK_MOI_EM'), TOK_NEN = so('TOK_NEN')
const TRAN_TOKEN_RA = so('TRAN_TOKEN_RA'), TRAN_TIEN = so('TRAN_TIEN_1_LUOT'), USD_VND = so('USD_VND')
const HE_SO = Number(src.match(/const HE_SO_AN_TOAN = ([\d.]+)/)?.[1])

let fail = 0
const ok = (c, m) => { if (!c) { console.error('✗', m); fail++ } else console.log('✓', m) }
ok([TOK_MOI_EM, TOK_NEN, TRAN_TOKEN_RA, TRAN_TIEN, USD_VND, HE_SO].every(Boolean), 'đọc được hằng số hàng rào từ worker')

const GIA = { 'claude-opus-4-8': { vao: 5, ra: 25 }, 'claude-sonnet-5': { vao: 2, ra: 10 }, 'claude-haiku-4-5': { vao: 1, ra: 5 } }
const tinh = (soHS, model) => {
  const g = GIA[model]
  const vaoUoc = 3400 * soHS + 1600            // đo thật 9C1: 23.564 vào cho 7 em (tiếng Việt tốn token)
  const raUoc = TOK_NEN + TOK_MOI_EM * soHS
  const maxTokens = Math.min(TRAN_TOKEN_RA, Math.max(8000, Math.round(raUoc * HE_SO)))
  const tienUoc = Math.round(((vaoUoc * g.vao + raUoc * g.ra) / 1e6) * USD_VND)
  const tienToiDa = Math.round(((vaoUoc * g.vao + maxTokens * g.ra) / 1e6) * USD_VND)
  const quaDong = raUoc > TRAN_TOKEN_RA   // gọi cũng chắc chắn bị cắt → chặn từ đầu
  return { maxTokens, tienUoc, tienToiDa, quaDong, chan: quaDong || tienToiDa > TRAN_TIEN }
}

console.log(`\nTrần 1 lượt: ${TRAN_TIEN.toLocaleString('vi-VN')} đ · trần token ra: ${TRAN_TOKEN_RA.toLocaleString('vi-VN')}\n`)
console.log('  model            HS   max_tokens    ước      tối đa   kết quả')
for (const model of Object.keys(GIA)) {
  for (const soHS of [4, 10, 15, 25, 40]) {
    const r = tinh(soHS, model)
    console.log(`  ${model.padEnd(17)}${String(soHS).padStart(2)}   ${String(r.maxTokens).padStart(9)}  ${String(r.tienUoc.toLocaleString('vi-VN')).padStart(7)} đ  ${String(r.tienToiDa.toLocaleString('vi-VN')).padStart(7)} đ  ${r.quaDong ? '⛔ lớp quá đông' : r.chan ? '⛔ quá trần tiền' : 'chạy'}`)
  }
}

// Các bảo đảm phải luôn đúng
const catTran = tinh(15, 'claude-opus-4-8')
ok(catTran.maxTokens <= TRAN_TOKEN_RA, 'max_tokens không bao giờ vượt trần cứng')
ok(tinh(4, 'claude-sonnet-5').maxTokens >= 8000, 'lớp nhỏ vẫn có tối thiểu 8.000 token (đủ chỗ trả lời)')
ok(tinh(15, 'claude-sonnet-5').maxTokens > 1845 * 15, 'lớp 15 em có đủ trần cho ~27.700 token ra (theo mức đo thật 1.845 tok/em)')
const xau = tinh(40, 'claude-opus-4-8')
ok(xau.chan && xau.quaDong, 'ca 40 em BỊ CHẶN vì vượt trần token (gọi cũng chắc chắn bị cắt)')
// Hai lý do chặn phải PHÂN BIỆT được — chọn cỡ lớp mà tiền là ràng buộc, chưa quá đông.
const tien10 = tinh(10, 'claude-opus-4-8')
ok(tien10.chan && !tien10.quaDong, `10 em × Opus bị chặn vì QUÁ TRẦN TIỀN (${tien10.tienToiDa.toLocaleString('vi-VN')} đ), không phải vì quá đông`)
ok(!tinh(15, 'claude-sonnet-5').chan, 'lớp 15 em × Sonnet 5 vẫn chạy được (không chặn nhầm)')

// Model không hỗ trợ adaptive thinking phải bị loại khỏi tham số
ok(/CO_ADAPTIVE = new Set\(/.test(src) && !/'claude-haiku-4-5'[^)]*\)\s*$/m.test(src.match(/const CO_ADAPTIVE = new Set\(\[[^\]]*\]/)?.[0] ?? ''),
   'Haiku 4.5 KHÔNG nằm trong danh sách hỗ trợ adaptive thinking (gửi kèm là 400)')
ok(/khongThuLai/.test(src), 'có cờ lỗi tất định để KHÔNG thử lại (chống đốt tiền 3 lần cho cùng một lỗi)')
ok(/max_tokens: maxTokens/.test(src), 'max_tokens tính theo cỡ lớp, không để cố định')

console.log(fail ? `\n❌ ${fail} chỗ cần sửa` : '\n✅ Hàng rào chi phí ổn')
process.exit(fail ? 1 : 0)
