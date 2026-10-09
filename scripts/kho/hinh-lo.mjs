// hinh-lo.mjs — chạy một LÔ câu Hình dựng bằng toạ độ (vd kho-rules/hgt/lo/k9-lo1.mjs):
//   1) máy KIỂM mọi mệnh đề / đáp số ở mọi cấu hình (cauHinh) — lệch một dòng ⇒ báo, exit 1;
//   2) VẼ hình: <ra>/<khối>-<lô>-<so>-de.png (hình đề, không lộ đường phụ) + -lg.png (hình lời giải, có nét đứt) nếu có phần tử phụ;
//   3) ghi <lô>.json: hàng sẵn ghi DB (noi_dung, lua_chon, dap_an, loi_giai = Phần 1 + Phần 2, ten_de_goc, file hình) — CHƯA ghi DB.
//   node scripts/kho/hinh-lo.mjs kho-rules/hgt/lo/k9-lo1.mjs --ra kho-rules/hgt/hinh [--khong-ve]
import { writeFileSync } from 'node:fs'
import { resolve, basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import { kiem, veNhieu, svgHinh } from './hinh-toado.mjs'

const args = process.argv.slice(2)
const fileLo = args[0], ra = args[args.indexOf('--ra') + 1], khongVe = args.includes('--khong-ve')
if (!fileLo || !args.includes('--ra')) { console.error('Dùng: node scripts/kho/hinh-lo.mjs <lo.mjs> --ra <thư mục hình> [--khong-ve]'); process.exit(2) }
const lo = await import(pathToFileURL(resolve(fileLo)).href)
const tenLo = basename(fileLo).replace(/\.mjs$/, '')

let loi = 0
const ve = [], hang = []
for (const c of lo.CAU) {
  const dsCH = c.cauHinh ?? [undefined]
  let hinhChinh = null
  for (const ch of dsCH) {
    if (!c.hinh) break
    const h = c.hinh(ch)
    hinhChinh ??= h
    const kq = kiem(h.kiem || [])
    for (const d of kq.dong) if (!d.dat) { loi++; console.log(`✗ câu ${c.so} [${ch ?? '-'}] ${d.ten} ${d.chiTiet}`) }
    if (kq.ok) console.log(`✓ câu ${c.so} [${ch ?? '-'}] ${kq.dong.length} mệnh đề`)
  }
  if (!c.hinh) console.log(`· câu ${c.so} không có phần kiểm bằng toạ độ (lý thuyết thuần)`)
  const goc = `${tenLo}-${String(c.so).padStart(2, '0')}`
  let anhDe = null, anhLg = null
  if (hinhChinh?.spec) {
    const sp = hinhChinh.spec
    const coPhu = svgHinh(sp, { phu: true }).svg !== svgHinh(sp, { phu: false }).svg
    if (c.hinhDe !== false) { anhDe = `${goc}-de.png`; ve.push({ file: `${ra}/${goc}-de`, spec: sp }) }
    if (c.hinhLG !== false && (coPhu || c.hinhDe === false)) { anhLg = `${goc}-lg.png`; ve.push({ file: `${ra}/${goc}-lg`, spec: sp, phu: true }) }
  }
  hang.push({
    so: c.so, nguon: `${c.sach} ${c.ma}`, dang_sach: c.dang, loai_cau: c.loai,
    ten_de_goc: `${lo.SACH[c.sach]} · ${c.ma}`,
    noi_dung: c.de, lua_chon: c.lc ?? null, dap_an: c.da ?? null,
    loi_giai: `**Phần 1. Hướng dẫn**\n${c.p1}\n\n**Phần 2. Trình bày**\n${c.p2}`,
    anh_de: anhDe, anh_dap_an: anhLg ?? anhDe, nghi: c.nghi ?? null,
  })
}
if (!khongVe && ve.length) { await veNhieu(ve); console.log(`vẽ ${ve.length} hình → ${ra}`) }
writeFileSync(fileLo.replace(/\.mjs$/, '.json'), JSON.stringify({ khoi: lo.KHOI, lo: tenLo, cau: hang }, null, 1))
// bản XEM cho CEO duyệt trong chat/editor: mỗi dòng của DB in thành một dòng markdown (thêm 2 dấu cách cuối dòng = xuống dòng)
if (args.includes('--md')) {
  const fileMd = args[args.indexOf('--md') + 1]
  const tuong = (s) => s.replace(/\n(?!\n)/g, '  \n')
  const relHinh = (f) => `${ra.replace(/^.*kho-rules\/hgt\//, '')}/${f}`
  const md = hang.map((h) => [
    `## Câu ${h.so} — ${h.nguon} · ${h.dang_sach}`,
    `*Loại: ${h.loai_cau}${h.dap_an ? ` · Đáp án: ${h.dap_an}` : ''}*`,
    `**Đề.** ${tuong(h.noi_dung)}`,
    h.lua_chon ? h.lua_chon.map((x, i) => `${'ABCD'[i]}. ${x}`).join('  \n') : '',
    h.anh_de ? `![hình đề](${relHinh(h.anh_de)})` : '',
    tuong(h.loi_giai),
    h.anh_dap_an && h.anh_dap_an !== h.anh_de ? `![hình lời giải](${relHinh(h.anh_dap_an)})` : '',
    h.nghi ? `> ❓ ${h.nghi}` : '',
  ].filter(Boolean).join('\n\n')).join('\n\n---\n\n')
  writeFileSync(fileMd, md + '\n')
  console.log(`bản xem → ${fileMd}`)
}
console.log(`${hang.length} câu · ${loi ? `✗ ${loi} mệnh đề LỆCH` : 'mọi mệnh đề khớp'} → ${fileLo.replace(/\.mjs$/, '.json')}`)
process.exit(loi ? 1 : 0)
