import { smartNormalize as N, smartCheckTLN as T, gradeTracNghiem as TN, gradeTraLoiNgan as TLN, gradeDungSai as DS, extractKey as EK } from '../src/gami/testgrade.js'
let pass = 0, fail = 0
const eq = (a, b, msg) => { const ok = JSON.stringify(a) === JSON.stringify(b); if (ok) pass++; else { fail++; console.log('❌', msg, '→ got', JSON.stringify(a), 'want', JSON.stringify(b)) } }

// smartNormalize
eq(N('1,5'), '1.5', 'decimal VN')
eq(N('30 kg'), '30', 'bỏ đơn vị ASCII')
eq(N('1/2'), '0.5', 'phân số')
eq(N('0.50'), '0.5', 'trailing zero')
eq(N('+7'), '7', 'dấu +')
eq(N('1.000'), '1000', 'nghìn')

// smartCheckTLN
eq(T('60; 30', '30; 60'), true, 'hoán vị')
eq(T('30km/h', '30'), true, 'khác đơn vị (parseFloat cứu)')
eq(T('0.5', '1/2'), true, 'thập phân chấm == phân số')
eq(T('0,5', '1/2'), true, 'giá trị bằng')
eq(T('5', '6'), false, 'sai số')
eq(T('', '6'), false, 'trống')

// gradeTracNghiem (index → chữ cái)
eq(TN(1, 'B'), { verdict: 'correct', cham_boi: 'exact' }, 'TN đúng B')
eq(TN(0, 'B'), { verdict: 'wrong', cham_boi: 'exact' }, 'TN sai A vs B')
eq(TN(3, 'd'), { verdict: 'correct', cham_boi: 'exact' }, 'TN key thường d==D')
eq(TN(null, 'A'), { verdict: 'wrong', cham_boi: 'exact' }, 'TN bỏ trống')

// gradeTraLoiNgan
eq(TLN('60;30', '30;60'), { verdict: 'correct', cham_boi: 'exact' }, 'TLN hoán vị đúng')
eq(TLN('7', '6'), { verdict: 'wrong', cham_boi: 'exact' }, 'TLN sai')

// gradeDungSai (thang THPT 2025)
eq(DS(['D', 'S', 'D', 'S'], ['D', 'S', 'D', 'S']), { verdict: 'correct', cham_boi: 'exact', dung: 4, tong: 4, diemTho: 1.0 }, 'ĐS 4/4')
eq(DS(['D', 'S', 'D', 'D'], ['D', 'S', 'D', 'S']).diemTho, 0.5, 'ĐS 3/4 = 0.5')
eq(DS(['D', 'D', 'D', 'D'], ['D', 'S', 'S', 'S']).diemTho, 0.1, 'ĐS 1/4 = 0.1')
eq(DS(['S', 'D', 'S', 'D'], ['D', 'S', 'D', 'S']), { verdict: 'wrong', cham_boi: 'exact', dung: 0, tong: 4, diemTho: 0 }, 'ĐS 0/4')
eq(DS(['D', null, 'D', 'S'], ['D', 'S', 'D', 'S']).verdict, 'partial', 'ĐS bỏ trống 1 ý = partial')

// extractKey
eq(EK({ loai_cau: 'dung_sai', menh_de: [{ dap_an: 'D' }, { dap_an: 'S' }, { dap_an: 'D' }, { dap_an: 'S' }] }), { ok: true, key: ['D', 'S', 'D', 'S'] }, 'EK ĐS ok')
eq(EK({ loai_cau: 'dung_sai', menh_de: null }).ok, false, 'EK ĐS chưa cấu trúc')
eq(EK({ loai_cau: 'trac_nghiem', lua_chon: ['a', 'b', 'c', 'd'], dap_an: 'B' }), { ok: true, key: 'B' }, 'EK TN ok')
eq(EK({ loai_cau: 'trac_nghiem', lua_chon: null, dap_an: 'B' }).ok, false, 'EK TN thiếu lựa chọn')
eq(EK({ loai_cau: 'trac_nghiem', lua_chon: ['a', 'b'], dap_an: '' }).ok, false, 'EK TN thiếu đáp án')
eq(EK({ loai_cau: 'tra_loi_ngan', dap_an: '6' }), { ok: true, key: '6' }, 'EK TLN ok')
eq(EK({ loai_cau: 'dung_sai', menh_de: [] }).ok, false, 'EK ĐS chưa hỗ trợ')

console.log(`\n${pass} pass, ${fail} fail`)
process.exit(fail ? 1 : 0)
