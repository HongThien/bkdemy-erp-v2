// Chạy: node --test scripts/kho/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { khoaGhep, ghepCap, chepVe, sha256Tep } from './t0-cua-vao.mjs'
import { bamNoiDung, tramBatBuoc, xetGoi, laDangCho } from './cong-ghi.mjs'
import { docEnv } from './cau-hinh.mjs'

// ── cấu hình ────────────────────────────────────────────────────────────────
test('docEnv: giữ nguyên chuỗi kết nối, không cắt đuôi', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kho-env-'))
  const tep = join(dir, '.env')
  writeFileSync(tep, '# ghi chú\r\nDATABASE_URL=postgresql://u.ref:p@host.pooler.supabase.com:5432/postgres\r\nTRONG=\r\nCO_NHAY="a b"\r\n')
  const e = docEnv(tep)
  assert.equal(e.DATABASE_URL, 'postgresql://u.ref:p@host.pooler.supabase.com:5432/postgres')
  assert.equal(e.CO_NHAY, 'a b')
  assert.equal(e.TRONG, '')
  rmSync(dir, { recursive: true })
})

// ── T0: khoá ghép ───────────────────────────────────────────────────────────
test('khoaGhep: hậu tố CH / DA của NBV', () => {
  assert.deepEqual(khoaGhep('B. TU LUAN - CH.docx', '12-1. TINH DON DIEU 2026'), { khoa: '12-1. tinh don dieu 2026/b. tu luan', vai: 'de' })
  assert.deepEqual(khoaGhep('B. TU LUAN - DA.docx', '12-1. TINH DON DIEU 2026'), { khoa: '12-1. tinh don dieu 2026/b. tu luan', vai: 'dap_an' })
})

test('khoaGhep: hậu tố _GV / _HS của PNL và -HS của Từ Tâm', () => {
  const gv = khoaGhep('Bài 01_Dạng 02. Tìm tham số m_GV.docx', 'BAI 1')
  const hs = khoaGhep('Bài 01_Dạng 02. Tìm tham số m_HS.docx', 'BAI 1')
  assert.equal(gv.khoa, hs.khoa)
  assert.equal(gv.vai, 'dap_an')
  assert.equal(hs.vai, 'de')
  assert.equal(khoaGhep('C1-B1-TÍNH ĐƠN ĐIỆU-P3-HS.docx').vai, 'de')
  assert.equal(khoaGhep('C1-B1-TÍNH ĐƠN ĐIỆU-P3-GHÉP HS.docx').vai, 'de')
})

test('khoaGhep: thư mục "Đáp án" cho vai đáp án và không tham gia vào khoá', () => {
  const de = khoaGhep('K12_De so 110_lien-truong-nghe-an.pdf', '')
  const da = khoaGhep('K12_De so 110_lien-truong-nghe-an.pdf', 'Đáp án')
  assert.equal(de.khoa, da.khoa)
  assert.equal(de.vai, 'chung')
  assert.equal(da.vai, 'dap_an')
})

test('khoaGhep: tên thường không bị cắt nhầm', () => {
  // "... CHƯƠNG HS" không phải hậu tố vai nếu không đứng sau dấu nối; "de" trong "made" không phải hậu tố
  assert.equal(khoaGhep('Dấu hiệu chia hết 3;9.pdf').vai, 'chung')
  assert.equal(khoaGhep('Biến đổi biểu thức.pdf').khoa, 'biến đổi biểu thức')
  assert.equal(khoaGhep('Đề số 3 made.pdf').vai, 'chung')
})

test('khoaGhep: chuẩn hoá Unicode — cùng tên gõ dựng sẵn và tổ hợp ra cùng khoá', () => {
  assert.equal(khoaGhep('Đề'.normalize('NFD') + ' 1.pdf').khoa, khoaGhep('Đề'.normalize('NFC') + ' 1.pdf').khoa)
})

// ── T0: ghép cặp ────────────────────────────────────────────────────────────
const tep = (duong_dan, thuMuc = '') => ({ duong_dan, ...khoaGhep(duong_dan.split('/').pop(), thuMuc) })

test('ghepCap: đề ở gốc + đáp án trong "Đáp án/" ⇒ 1 cặp', () => {
  const kq = ghepCap([tep('K12_De so 110_x.pdf'), tep('Đáp án/K12_De so 110_x.pdf', 'Đáp án'), tep('K12_De so 111_y.pdf')])
  assert.equal(kq.cap.length, 1)
  assert.deepEqual(kq.cap[0].de, ['K12_De so 110_x.pdf'])
  assert.deepEqual(kq.cap[0].dap_an, ['Đáp án/K12_De so 110_x.pdf'])
  assert.equal(kq.don_le.length, 1)
  assert.equal(kq.mo_ho.length, 0)
})

test('ghepCap: SỐ LƯỢNG khớp nhưng TÊN lệch ⇒ không ghép gì', () => {
  // 2 đề + 2 đáp án, nhưng đáp án là của đề khác. Ghép theo vị trí/số lượng sẽ gắn nhầm âm thầm.
  const kq = ghepCap([tep('A - CH.docx'), tep('B - CH.docx'), tep('C - DA.docx'), tep('D - DA.docx')])
  assert.equal(kq.cap.length, 0)
  assert.equal(kq.don_le.length, 4)
})

test('ghepCap: 2 file cùng khoá, cùng vai, cùng định dạng ⇒ mơ hồ, không ghép', () => {
  const kq = ghepCap([
    { duong_dan: 'x/A - DA.docx', khoa: 'a', vai: 'dap_an' },
    { duong_dan: 'y/A - DA.docx', khoa: 'a', vai: 'dap_an' },
    { duong_dan: 'x/A - CH.docx', khoa: 'a', vai: 'de' },
  ])
  assert.equal(kq.cap.length, 0)
  assert.equal(kq.mo_ho.length, 1)
})

test('ghepCap: cùng tài liệu có cả pdf lẫn docx ⇒ vẫn là 1 cặp, giữ cả hai định dạng', () => {
  const kq = ghepCap([tep('A - CH.docx'), tep('A - CH.pdf'), tep('A - DA.docx')])
  assert.equal(kq.cap.length, 1)
  assert.equal(kq.cap[0].de.length, 2)
})

test('ghepCap: kiểu NBV "X - CH" + "X" ⇒ 1 cặp, ghi rõ là SUY từ tên', () => {
  const kq = ghepCap([tep('B. TU LUAN - CH.docx', '12-4'), tep('B. TU LUAN.docx', '12-4'), tep('A. LY THUYET.docx', '12-4')])
  assert.equal(kq.cap.length, 1)
  assert.deepEqual(kq.cap[0].dap_an, ['B. TU LUAN.docx'])
  assert.match(kq.cap[0].suy_vai, /đối chiếu nội dung/)
  assert.equal(kq.don_le.length, 1)
})

test('ghepCap: có cả CH, DA và bản không hậu tố ⇒ mơ hồ', () => {
  const kq = ghepCap([tep('B - CH.docx'), tep('B - DA.docx'), tep('B.docx')])
  assert.equal(kq.cap.length, 0)
  assert.equal(kq.mo_ho.length, 1)
})

test('khoaGhep + ghepCap: đuôi " (1)" của trình duyệt được bỏ; trùng thật thì thành mơ hồ', () => {
  assert.equal(khoaGhep('K12_De so 12_x (1).pdf', 'Đáp án').khoa, khoaGhep('K12_De so 12_x.pdf').khoa)
  const ghep = ghepCap([tep('K12_De so 12_x.pdf'), tep('Đáp án/K12_De so 12_x (1).pdf', 'Đáp án')])
  assert.equal(ghep.cap.length, 1)
  const trung = ghepCap([tep('K12_De so 12_x.pdf'), tep('Đáp án/K12_De so 12_x (1).pdf', 'Đáp án'), tep('Đáp án/K12_De so 12_x.pdf', 'Đáp án')])
  assert.equal(trung.cap.length, 0)
  assert.equal(trung.mo_ho.length, 1)
})

// ── T0: chép về ─────────────────────────────────────────────────────────────
test('chepVe: khoá bằng sha nội dung, chạy lại không nhân đôi, không đụng file gốc', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kho-t0-'))
  const goc = join(dir, 'Đề 1 - CH.pdf')
  writeFileSync(goc, 'noi dung gia lap')
  const shaGoc = sha256Tep(goc)
  const lv = join(dir, 'lam-viec')
  const a = chepVe(goc, lv, { vai: 'de' })
  const b = chepVe(goc, lv, { vai: 'de' })
  assert.equal(a.da_co, false)
  assert.equal(b.da_co, true)
  assert.equal(a.tep_local, b.tep_local)
  assert.equal(sha256Tep(a.tep_local), shaGoc)
  assert.equal(sha256Tep(goc), shaGoc)
  assert.ok(existsSync(goc))
  const hs = JSON.parse(readFileSync(join(lv, shaGoc.slice(0, 12), 'ho-so.json'), 'utf8'))
  assert.equal(hs.sha256, shaGoc)
  assert.equal(hs.ten_goc, 'Đề 1 - CH.pdf')
  rmSync(dir, { recursive: true })
})

// ── Cổng ghi ────────────────────────────────────────────────────────────────
const CAU = {
  loai_cau: 'tra_loi_ngan', noi_dung: 'Tìm $x$ biết $x+2=5$.', dap_an: '3', loi_giai: '$x=5-2=3$.',
  dang_chinh: 'T106020203', ma_cum: null, nguon_giai: 'ai',
}
const goiHopLe = (cau = CAU) => ({
  cau,
  vet: {
    lam: { tram: 'gan-giai', lan_chay: 'L1', model: 'claude-x' },
    kiem: [
      { tram: 'kiem-doc', lan_chay: 'K1', cach: 'model_khac', model: 'gemini-y', ket_qua: 'dat', bam_noi_dung: bamNoiDung(cau) },
      { tram: 'kiem-dang', lan_chay: 'K2', cach: 'cung_model_ngu_canh_sach', ket_qua: 'dat', bam_noi_dung: bamNoiDung(cau) },
      { tram: 'kiem-dap-so', lan_chay: 'K3', cach: 'code', ket_qua: 'dat', bam_noi_dung: bamNoiDung(cau) },
    ],
  },
})

test('bamNoiDung: không phụ thuộc thứ tự khoá, CRLF, khoảng trắng đầu cuối', () => {
  const a = bamNoiDung({ noi_dung: 'a\nb', dap_an: '3', loai_cau: 'x' })
  const b = bamNoiDung({ loai_cau: 'x', dap_an: ' 3 ', noi_dung: 'a\r\nb' })
  assert.equal(a, b)
  assert.notEqual(a, bamNoiDung({ noi_dung: 'a\nb', dap_an: '4', loai_cau: 'x' }))
})

test('bamNoiDung: trường không phải nội dung (vd nguon_giai) không đổi băm', () => {
  assert.equal(bamNoiDung({ ...CAU, nguon_giai: 'nguoi' }), bamNoiDung(CAU))
})

test('tramBatBuoc: theo đúng cái AI đã làm', () => {
  assert.deepEqual(tramBatBuoc(CAU), ['kiem-doc', 'kiem-dang', 'kiem-dap-so'])
  assert.deepEqual(tramBatBuoc({ ...CAU, nguon_giai: 'nguoi' }), ['kiem-doc', 'kiem-dang'])
  assert.deepEqual(tramBatBuoc({ ...CAU, dang_chinh: 'T112000000', nguon_giai: 'nguoi' }), ['kiem-doc'])
  assert.ok(laDangCho('T112000000'))
  assert.ok(!laDangCho('T112010101'))
})

test('xetGoi: gói đủ biên bản ⇒ được ghi, kiem_may=khop, da_duyet luôn false', () => {
  const kq = xetGoi(goiHopLe())
  assert.equal(kq.duoc_ghi, true)
  assert.equal(kq.kiem_may, 'khop')
  assert.equal(kq.da_duyet, false)
})

test('xetGoi: KHÔNG có biên bản ⇒ từ chối (lỗ của hangdoi-giai --ghi)', () => {
  const g = goiHopLe(); g.vet.kiem = []
  const kq = xetGoi(g)
  assert.equal(kq.duoc_ghi, false)
  assert.equal(kq.ly_do.length, 3)
})

test('xetGoi: thiếu 1 trạm bắt buộc ⇒ từ chối, nêu đúng trạm thiếu', () => {
  const g = goiHopLe(); g.vet.kiem = g.vet.kiem.filter((k) => k.tram !== 'kiem-dap-so')
  const kq = xetGoi(g)
  assert.equal(kq.duoc_ghi, false)
  assert.match(kq.ly_do.join('|'), /kiem-dap-so/)
})

test('xetGoi: câu bị sửa SAU khi kiểm ⇒ từ chối', () => {
  const g = goiHopLe()
  g.cau = { ...g.cau, dap_an: '4' }   // biên bản vẫn mang băm của đáp số 3
  const kq = xetGoi(g)
  assert.equal(kq.duoc_ghi, false)
  assert.match(kq.ly_do.join('|'), /NỘI DUNG KHÁC/)
})

test('xetGoi: người kiểm cùng lượt chạy với người làm ⇒ từ chối', () => {
  const g = goiHopLe(); g.vet.kiem[2].lan_chay = 'L1'
  const kq = xetGoi(g)
  assert.equal(kq.duoc_ghi, false)
  assert.match(kq.ly_do.join('|'), /CÙNG lượt chạy/)
})

test('xetGoi: khai "model_khac" mà cùng model ⇒ từ chối', () => {
  const g = goiHopLe(); g.vet.kiem[0].model = 'claude-x'
  assert.equal(xetGoi(g).duoc_ghi, false)
})

test('xetGoi: cách kiểm tự bịa ⇒ từ chối', () => {
  const g = goiHopLe(); g.vet.kiem[1].cach = 'tu_tin'
  assert.equal(xetGoi(g).duoc_ghi, false)
})

test('xetGoi: một trạm KHÔNG ĐẠT ⇒ vẫn được ghi nhưng mang cờ nghi', () => {
  const g = goiHopLe(); g.vet.kiem[2].ket_qua = 'khong_dat'; g.vet.kiem[2].ghi_chu = 'code tính ra 4'
  const kq = xetGoi(g)
  assert.equal(kq.duoc_ghi, true)
  assert.equal(kq.kiem_may, 'nghi')
  assert.match(kq.kiem_may_ghi, /code tính ra 4/)
})

test('xetGoi: không kiểm được ⇒ khong_kiem_duoc; vừa không đạt vừa không kiểm được ⇒ nghi thắng', () => {
  const g = goiHopLe(); g.vet.kiem[2].ket_qua = 'khong_kiem_duoc'
  assert.equal(xetGoi(g).kiem_may, 'khong_kiem_duoc')
  g.vet.kiem[1].ket_qua = 'khong_dat'
  assert.equal(xetGoi(g).kiem_may, 'nghi')
})

test('xetGoi: AI tự điền kiem_may vào câu cũng vô ích — cổng không đọc trường đó', () => {
  const g = goiHopLe({ ...CAU, kiem_may: 'khop', da_duyet: true }); g.vet.kiem = []
  assert.equal(xetGoi(g).duoc_ghi, false)
})

test('xetGoi: hình máy vẽ cần đủ 2 lượt, lượt A phải là code', () => {
  const cau = { ...CAU, hinh_do_may_ve: true }
  const g = goiHopLe(cau)
  assert.equal(xetGoi(g).duoc_ghi, false)
  const bam = bamNoiDung(cau)
  g.vet.kiem.push({ tram: 'kiem-hinh-a', lan_chay: 'K4', cach: 'model_khac', model: 'gemini-y', ket_qua: 'dat', bam_noi_dung: bam })
  g.vet.kiem.push({ tram: 'kiem-hinh-b', lan_chay: 'K5', cach: 'model_khac', model: 'gemini-y', ket_qua: 'dat', bam_noi_dung: bam })
  assert.equal(xetGoi(g).duoc_ghi, false)
  g.vet.kiem[3].cach = 'code'; delete g.vet.kiem[3].model
  assert.equal(xetGoi(g).duoc_ghi, true)
})
