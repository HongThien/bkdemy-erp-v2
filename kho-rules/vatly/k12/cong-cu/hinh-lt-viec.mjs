// Lập danh sách việc làm hình minh hoạ lý thuyết Vật lý 12 — Thùy 12/11 chọn "theo đề xuất":
//   Tập 1 (Nhiệt + Khí): cắt hình từ sách (hình nét) — giữ đề xuất từng khối (1 cắt / 2 ảnh mạng / 3 vẽ).
//   Tập 2 (Từ trường + Hạt nhân): hình sách phần lớn "tạm" ⇒ khối đề xuất 1 mà vẽ lại được (co_the có 3) chuyển sang 3 (vẽ, lấy hình sách làm mẫu).
//   Ảnh thật (đề xuất 2) lấy trên mạng, giấy phép tự do.
// Ra: ../hinh-lt/viec.json [{ma:"H001", phan, nhom, k, tieu_de, noi (nhóm|LDB..), cach:1|2|3, so_hinh, hinh_sach[], ly_do, noi_dung}]
import fs from 'node:fs'
import path from 'node:path'
const D = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..')
const N = JSON.parse(fs.readFileSync(path.join(D, 'tach-lt', 'khoi.json'), 'utf8'))
const X = { ...JSON.parse(fs.readFileSync(path.join(D, 'tach-lt', 'xep-nhiet-khi.json'), 'utf8')).xep, ...JSON.parse(fs.readFileSync(path.join(D, 'tach-lt', 'xep-tu-hn.json'), 'utf8')).xep }
const viec = []; let i = 0
for (const p of ['p1', 'p2', 'p3']) for (const k of JSON.parse(fs.readFileSync(path.join(D, 'hinh-lt', `do-${p}.json`), 'utf8')).khoi) {
  if (!k.de_xuat) continue
  let cach = k.de_xuat
  if (p !== 'p1' && cach === 1 && (k.co_the || []).includes(3)) cach = 3
  const n = N.find(x => x.id === k.nhom); const idx = +k.k.slice(1); const v = X[k.nhom][k.k]
  viec.push({ ma: 'H' + String(++i).padStart(3, '0'), phan: p, nhom: k.nhom, k: k.k, tieu_de: k.tieu_de, noi: v === 'N' ? ['nhom'] : v,
    cach, so_hinh: k.so_hinh || 1, can_hinh: k.can_hinh, hinh_sach: k.hinh_sach || [], ly_do: k.ly_do, noi_dung: n.khoi[idx] })
}
fs.writeFileSync(path.join(D, 'hinh-lt', 'viec.json'), JSON.stringify(viec, null, 1))
const dem = {}; for (const v of viec) { const key = v.phan + ' cách ' + v.cach; dem[key] ||= [0, 0]; dem[key][0]++; dem[key][1] += v.so_hinh }
console.log(viec.length, 'khối', dem)
