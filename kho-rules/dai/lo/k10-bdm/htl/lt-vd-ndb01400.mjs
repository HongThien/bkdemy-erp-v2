// Lý thuyết + ví dụ cho dạng MỚI NDB01400 "Các tính chất cơ bản của bất phương trình bậc nhất 2 ẩn" (Thùy 22/10).
// Ví dụ lấy từ 3 câu đã xếp vào dạng (đề + lời giải kho). Chỉ ghi vào ô ĐANG RỖNG.   node .../lt-vd-ndb01400.mjs [--ghi]
import fs from 'node:fs'
import pg from 'pg'

const GHI = process.argv.includes('--ghi')
const R = String.raw
const L = (...a) => a.join('\n')
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL }); await c.connect()
await c.query('begin')

const gon = (s) => String(s ?? '').replace(/\r/g, '').replace(/\n\s*\n/g, '\n').trim()
async function vd(ma) {
  const q = (await c.query(`select noi_dung, lua_chon, anh_de, loi_giai from dai_cau_hoi where ma_cau = $1 and xoa_at is null`, [ma])).rows[0]
  if (!q) throw new Error('không có câu ' + ma)
  const lc = Array.isArray(q.lua_chon) && q.lua_chon.length ? q.lua_chon.map((x, i) => `${'ABCD'[i]}. ${gon(x)}`).join(' ') : ''
  return L('##VD', gon(q.noi_dung), q.anh_de ? `![](${q.anh_de})` : null, lc || null, '**Hướng dẫn giải:**', gon(q.loi_giai)).replace(/\n{2,}/g, '\n').replace(/\nnull(?=\n|$)/g, '')
}

const LT = L(
  '##ĐN',
  R`Bất phương trình bậc nhất hai ẩn $x,y$ có dạng $ax+by+c<0$ (hoặc $>0$, $\le 0$, $\ge 0$), trong đó $a,b,c$ là các số cho trước, $a^{2}+b^{2}\ne 0$.`,
  R`Mỗi cặp số $(x_{0};y_{0})$ thoả mãn bất phương trình gọi là một nghiệm của bất phương trình đó.`,
  '',
  '##TC',
  R`Bất phương trình bậc nhất hai ẩn luôn có vô số nghiệm; không bao giờ vô nghiệm và không có nghiệm duy nhất.`,
  R`Tập nghiệm là một nửa mặt phẳng bờ là đường thẳng $ax+by+c=0$ (miền nghiệm), kể cả bờ nếu dấu là $\le$, $\ge$; không kể bờ nếu dấu là $<$, $>$.`,
  R`Tập nghiệm là tập các cặp số $(x;y)$, nên không viết được dưới dạng khoảng, đoạn của $\mathbb{R}$.`,
  '',
  '##PP',
  R`Đối chiếu từng khẳng định với định nghĩa nghiệm và tính chất trên (số nghiệm, dạng của tập nghiệm, điều kiện $a^{2}+b^{2}\ne 0$).`,
  R`Khi cần kiểm tra một cặp số là nghiệm hay không thì thay vào bất phương trình (xem dạng "Xác định nghiệm của bất phương trình").`,
)
const VD = [await vd('T110020102101'), await vd('T110020102076'), await vd('T110020102078')].join('\n\n')

let n = 0
n += (await c.query(`update dai_bdm_dang_bai set ly_thuyet=$1, updated_at=now() where id='NDB01400' and coalesce(ly_thuyet,'')=''`, [LT])).rowCount
n += (await c.query(`update dai_bdm_dang_bai set vi_du=$1, updated_at=now() where id='NDB01400' and coalesce(vi_du,'')=''`, [VD])).rowCount
if ((VD.match(/\$/g) || []).length % 2) throw new Error('lẻ dấu $')
console.log({ truong_ghi: n, ky_vong: 2 })
if (GHI && n === 2) { await c.query('commit'); console.log('ĐÃ GHI') } else { await c.query('rollback'); console.log(GHI ? 'lệch ⇒ chưa ghi' : 'chạy khô (rollback)') }
await c.end()
