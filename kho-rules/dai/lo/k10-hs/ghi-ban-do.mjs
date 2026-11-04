// Ghi DRAFT bản đồ mới K10 "Hàm số, đồ thị và ứng dụng" (Thùy 04/11 "ghi đi") — nguồn: kho-rules/dai/ban-do-moi-k10-ham-so-de-xuat.md
// Chạy: node kho-rules/dai/lo/k10-hs/ghi-ban-do.mjs        → thử trong ROLLBACK
//       node kho-rules/dai/lo/k10-hs/ghi-ban-do.mjs --ghi  → ghi thật (1 transaction). Không chép câu, không lý thuyết/ví dụ.
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')

const CHU_DE = 'Hàm số, đồ thị và ứng dụng'
// [chuyên đề, mô tả, [nhóm, mô tả, [[dạng, mô tả nhận biết, muc_do], ...]], ...]
const CAY = [
  ['Hàm số và đồ thị', [
    ['Tập xác định', 'Tìm điều kiện để biểu thức xác định.', [
      ['TXĐ của hàm cho bằng công thức', 'Cho công thức (phân thức, căn, kết hợp), tìm tập xác định.', 2],
      ['TXĐ có tham số m', 'Tìm m để hàm xác định trên ℝ / trên khoảng; đếm m nguyên.', 4]]],
    ['Giá trị hàm số', 'Tính f(a), hàm cho bởi nhiều công thức.', [
      ['Tính giá trị / hàm nhiều công thức', 'Tính f(a); hàm khúc; tìm tham số từ hàm khúc.', 2]]],
    ['Đồ thị hàm số', 'Điểm thuộc đồ thị; đọc đồ thị.', [
      ['Điểm thuộc đồ thị, tham số để đồ thị qua điểm', 'M(a;b) thuộc đồ thị ⇔ b = f(a).', 2],
      ['Đọc đồ thị / bảng biến thiên', 'Đọc giá trị, nghiệm, TXĐ, tập giá trị, khoảng đơn điệu từ hình hoặc BBT.', 2]]],
    ['Đồng biến – nghịch biến', 'Tính đơn điệu của hàm số.', [
      ['Xét đơn điệu theo định nghĩa / hàm bậc nhất', 'Chứng minh bằng định nghĩa; hàm bậc nhất; có tham số.', 3]]],
    ['Ứng dụng thực tế của hàm số', 'Mô hình tình huống bằng hàm số.', [
      ['Hàm cho bằng bảng/công thức khúc trong tình huống', 'Cước taxi, điện nước, nhiệt độ C→F…: lập công thức, tính giá trị.', 2]]],
  ]],
  ['Hàm số bậc hai', [
    ['Đồ thị và tính chất parabol', 'Đỉnh, trục, bảng biến thiên, dấu hệ số, vẽ đồ thị.', [
      ['Đỉnh, trục đối xứng, giao với trục', 'Cho hàm bậc hai, tìm đỉnh / trục / giao điểm với trục.', 2],
      ['Bảng biến thiên, khoảng đồng biến – nghịch biến', 'Lập BBT hoặc tìm khoảng đơn điệu của hàm bậc hai.', 2],
      ['Nhận dạng đồ thị parabol', 'Chọn đồ thị đúng; nhận biết hàm bậc hai.', 2],
      ['Đọc dấu a, b, c từ đồ thị', 'Cho parabol, xét dấu a,b,c hoặc mệnh đề về a,b,c.', 3],
      ['Vẽ đồ thị, tịnh tiến', 'Lập bảng giá trị, vẽ parabol, biến đổi đồ thị.', 2]]],
    ['Xác định hàm bậc hai', 'Tìm a,b,c từ điều kiện.', [
      ['Xác định công thức từ điều kiện', 'Qua điểm, đỉnh, trục, BBT, đồ thị → hệ phương trình tìm a,b,c.', 3]]],
    ['GTLN – GTNN', 'Giá trị lớn nhất, nhỏ nhất của hàm bậc hai.', [
      ['GTLN/GTNN trên ℝ hoặc trên đoạn', 'Dùng đỉnh; xét thêm đầu mút khi trên đoạn.', 3]]],
    ['Tương giao và số nghiệm', 'Parabol với đường thẳng; số nghiệm f(x)=m.', [
      ['Parabol cắt đường thẳng, số nghiệm f(x)=m', 'Δ / Viète; biện luận số nghiệm bằng đồ thị (kể cả |x|, |f|).', 4]]],
    ['Tham số m (hàm bậc hai)', 'Điều kiện của m cho hàm bậc hai.', [
      ['m để hàm bậc hai thoả điều kiện', 'Đỉnh, GTLN, đơn điệu trên khoảng, qua điểm… theo m.', 4]]],
    ['Ứng dụng thực tế (hàm bậc hai)', 'Mô hình parabol.', [
      ['Bài toán thực tế hàm bậc hai', 'Cổng parabol, ném vật, doanh thu – lợi nhuận, diện tích lớn nhất.', 3]]],
  ]],
  ['Dấu tam thức bậc hai và bất phương trình bậc hai', [
    ['Dấu tam thức bậc hai', 'Định lí về dấu, bảng xét dấu.', [
      ['Xét dấu tam thức bậc hai', 'Tính Δ, nghiệm, dấu a; lập bảng xét dấu; đọc từ đồ thị.', 2]]],
    ['Giải bất phương trình', 'Tập nghiệm BPT bậc hai và quy về bậc hai.', [
      ['Giải BPT bậc hai', 'Kể cả quy về bậc hai, ẩn phụ.', 2],
      ['BPT tích / thương (nâng cao)', 'Lập bảng xét dấu nhiều thừa số. Ít nguồn.', 3],
      ['Tập nghiệm – số nghiệm nguyên – hệ BPT bậc hai', 'Giao các tập nghiệm; đếm nghiệm nguyên.', 3]]],
    ['Tham số m (tam thức, BPT)', 'Điều kiện của m.', [
      ['m để tam thức / BPT nghiệm đúng ∀x, vô nghiệm, có nghiệm', 'Điều kiện (a, Δ); xét a = 0.', 4],
      ['m để PT bậc hai có nghiệm thoả điều kiện', 'Dấu hai nghiệm, nghiệm trong khoảng, hệ thức Viète.', 4]]],
    ['Ứng dụng thực tế (BPT bậc hai)', 'Mô hình bậc hai dẫn đến BPT.', [
      ['BPT bậc hai trong thực tế', 'Doanh thu, quỹ đạo, hình học → giải BPT.', 3]]],
  ]],
  ['Phương trình quy về phương trình bậc hai', [
    ['Phương trình chứa căn', 'Bình phương hai vế, thử lại nghiệm.', [
      ['√f = √g', 'Bình phương, giải PT bậc hai, thử điều kiện.', 2],
      ['√f = g', 'Điều kiện g ≥ 0, loại nghiệm ngoại lai.', 3],
      ['PT chứa căn khác (nâng cao)', 'Ẩn phụ t=√·, nhân liên hợp, đưa về tích, hiệu hai căn.', 4]]],
    ['Phương trình quy khác', 'Giá trị tuyệt đối, trùng phương.', [
      ['PT chứa dấu giá trị tuyệt đối / trùng phương (nâng cao)', 'Đặt ẩn phụ t=|x−a| hoặc t=x². Ít nguồn.', 3]]],
    ['Tham số và ứng dụng', 'Tham số m; bài toán thực tế.', [
      ['m để PT chứa căn có nghiệm / nghiệm duy nhất / vô nghiệm', 'Biện luận theo m.', 4],
      ['Thực tế / hình học dẫn đến PT căn', 'Pythagore, định lí cos, chuyển động → PT căn.', 3]]],
  ]],
]

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  const dup = await c.query(`select id from dai_bdm_chu_de where khoi='10' and ten=$1`, [CHU_DE])
  if (dup.rowCount) throw new Error('Chủ đề đã có: ' + dup.rows[0].id)
  const tt0 = (await c.query(`select coalesce(max(thu_tu),0)+1 t from dai_bdm_chu_de where khoi='10' and nhanh='toan'`)).rows[0].t
  const cd = (await c.query(`insert into dai_bdm_chu_de (khoi,ten,thu_tu,nhanh) values ('10',$1,$2,'toan') returning id`, [CHU_DE, tt0])).rows[0].id
  let nCh = 0, nN = 0, nD = 0
  for (const [chTen, nhoms] of CAY) {
    const ch = (await c.query(`insert into dai_bdm_chuyen_de (ten) values ($1) returning id`, [chTen])).rows[0].id
    await c.query(`insert into dai_bdm_o (chu_de_id,chuyen_de_id,thu_tu) values ($1,$2,$3)`, [cd, ch, ++nCh])
    let tn = 0
    for (const [nTen, nMo, dangs] of nhoms) {
      const n = (await c.query(`insert into dai_bdm_nhom (chu_de_id,chuyen_de_id,ten,mo_ta,thu_tu) values ($1,$2,$3,$4,$5) returning id`, [cd, ch, nTen, nMo, ++tn])).rows[0].id
      nN++
      let td = 0
      for (const [dTen, dMo, md] of dangs) {
        await c.query(`insert into dai_bdm_dang_bai (nhom_id,ten,mo_ta,thu_tu,muc_do) values ($1,$2,$3,$4,$5)`, [n, dTen, dMo, ++td, md])
        nD++
      }
    }
  }
  console.log(`${cd}: ${nCh} chuyên đề · ${nN} nhóm · ${nD} dạng`)
  if (GHI) { await c.query('commit'); console.log('ĐÃ GHI') } else { await c.query('rollback'); console.log('Thử xong — ROLLBACK (thêm --ghi để ghi thật)') }
} catch (e) { await c.query('rollback'); console.error('LỖI, ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
