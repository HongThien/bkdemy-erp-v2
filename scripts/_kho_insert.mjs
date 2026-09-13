// ============================================================================
// _kho_insert.mjs — helper share giữa nhap_kho.mjs và nhap_de_thi.mjs.
// Insert 1 batch câu vào <subject>_cau_hoi trong 1 transaction.
// Caller CHỊU trách nhiệm BEGIN/COMMIT — helper chỉ chạy INSERT + validate.
//
// 13/09 (CEO): thêm 2 việc
//   (a) LỌC TRÙNG: câu có noi_dung trùng (chuẩn hoá: lower + bỏ mọi khoảng trắng) với câu
//       đã có trong kho (xoa_at null) hoặc trùng trong cùng lô ⇒ KHÔNG insert, trả về ma_cau
//       của bản đã có ở vị trí đó + liệt kê trong `trung`. Đề thi dùng lại ma_cau cũ để nối
//       toan_de_thi_cau. Tắt bằng choTrung=true khi CEO cố ý nhập bản thứ 2.
//   (b) DẠNG CHỜ: câu không xác định được dạng ⇒ để dang_chinh null/'' và ghi `khoi`;
//       script gán dang_chinh = _kho_dang_cho(subject, khoi) (mig 202609131706, mã kết thúc
//       '000000'). Mệnh đề ĐS không có ma_dang cũng vậy (lấy khoi của câu cha). Câu vào kho
//       với da_duyet=false, hiện ở màn Duyệt › "Chưa phân dạng"; DB chặn duyệt khi còn dạng chờ.
// ============================================================================

export const SUBJECTS = ['hgt', 'dai', 'khtn']

const PREFIX = { dai: 'T1', hgt: 'T3', khtn: 'K' }
/** Mã dạng chờ — PHẢI khớp public._kho_dang_cho(p_tbl, p_khoi) trong DB. */
export function maDangCho(subject, khoi) {
  return PREFIX[subject] + String(khoi).padStart(2, '0') + '000000'
}
export const laDangCho = (ma) => typeof ma === 'string' && ma.endsWith('000000')

/** Chuẩn hoá nội dung để so trùng — PHẢI khớp biểu thức SQL trong hàm này (lower + bỏ \s). */
const chuanHoa = (s) => String(s ?? '').toLowerCase().replace(/\s+/g, '')
const SQL_CHUAN = (col) => `regexp_replace(lower(${col}), '\\s+', '', 'g')`

/**
 * Insert 1 batch câu, sinh ma_cau tự động theo convention <dang>+lpad(STT,3,'0').
 * @param {object} p
 * @param {import('pg').Client} p.client  — client đã BEGIN
 * @param {'hgt'|'dai'|'khtn'} p.subject
 * @param {Array<object>} p.cauList        — mỗi câu: { dang_chinh, loai_cau, noi_dung, ... }
 * @param {boolean} [p.choTrung=false]     — true = bỏ lọc trùng (nhập cả bản trùng)
 * @returns {Promise<{maCauList: string[], trung: Array<{idx:number, ma_cau_cu:string, trong_lo?:boolean}>, chua_dang: number[]}>}
 *   maCauList[i] = ma_cau MỚI nếu insert, = ma_cau CŨ nếu trùng (không insert).
 */
export async function insertCauBatch({ client, subject, cauList, choTrung = false }) {
  if (!SUBJECTS.includes(subject)) throw new Error(`subject không hợp lệ: ${subject}`)
  if (!Array.isArray(cauList) || cauList.length === 0) throw new Error('cauList rỗng')

  const chuaDang = []
  for (let i = 0; i < cauList.length; i++) {
    const q = cauList[i]
    // (b) Không có dạng ⇒ dạng chờ theo khối
    if (!q.dang_chinh || q.dang_chinh === 'CHUA') {
      if (!q.khoi) throw new Error(`câu #${i}: thiếu dang_chinh — muốn đưa vào "Chưa phân dạng" thì phải ghi "khoi"`)
      q.dang_chinh = maDangCho(subject, q.khoi)
      chuaDang.push(i)
    }
    if (typeof q.dang_chinh !== 'string') throw new Error(`câu #${i}: dang_chinh phải là string`)
    if (!q.loai_cau) throw new Error(`câu #${i}: thiếu loai_cau`)
    if (!q.noi_dung || typeof q.noi_dung !== 'string') throw new Error(`câu #${i}: thiếu noi_dung (phải là string)`)
    // lua_chon PHẢI là mảng CHUỖI ("$A. ...$"). 11/09 một câu lưu [{key,text}] ⇒ MathText nhận object ⇒ màn Duyệt K12 trắng xoá.
    if (q.lua_chon != null) {
      if (!Array.isArray(q.lua_chon) || q.lua_chon.some(o => typeof o !== 'string'))
        throw new Error(`câu #${i}: lua_chon phải là mảng chuỗi (được ${JSON.stringify(q.lua_chon).slice(0, 80)})`)
    }
    for (const f of ['dap_an', 'loi_giai']) if (q[f] != null && typeof q[f] !== 'string') throw new Error(`câu #${i}: ${f} phải là string`)

    // Câu Đúng-Sai: mỗi mệnh đề 1 dạng RIÊNG (dùng field ma_dang, không dang_chinh).
    // Trigger DB tự sync xuống <mon>_cau_menh_de, chặn ma_dang không hợp lệ.
    // KHTN chưa hỗ trợ (memory `[doi-xung-cap-mon-vs-nhanh]` — chờ tách Lý/Hoá/Sinh).
    if (q.loai_cau === 'dung_sai') {
      if (subject === 'khtn')
        throw new Error(`câu #${i}: KHTN chưa hỗ trợ câu Đúng-Sai (chờ tách Lý/Hoá/Sinh)`)
      if (!Array.isArray(q.menh_de) || q.menh_de.length < 2)
        throw new Error(`câu #${i}: câu Đúng-Sai cần menh_de array >= 2 phần tử`)
      q.menh_de.forEach((m, j) => {
        if (!m.ma_dang || m.ma_dang === 'CHUA') {
          if (!q.khoi) throw new Error(`câu #${i} mệnh đề #${j}: thiếu ma_dang — muốn để "Chưa phân dạng" thì câu cha phải ghi "khoi"`)
          m.ma_dang = maDangCho(subject, q.khoi)
          if (!chuaDang.includes(i)) chuaDang.push(i)
        }
        if (!m.noi_dung) throw new Error(`câu #${i} mệnh đề #${j}: thiếu noi_dung`)
        if (m.dap_an !== 'D' && m.dap_an !== 'S')
          throw new Error(`câu #${i} mệnh đề #${j}: dap_an phải là 'D' hoặc 'S' (được ${JSON.stringify(m.dap_an)})`)
      })
    }
  }

  const table = `${subject}_cau_hoi`
  const banDo = `${subject}_ban_do`

  // Verify dang_chinh có trong bản đồ
  const dangSet = [...new Set(cauList.map(q => q.dang_chinh))]
  const { rows: bdRows } = await client.query(
    `select ma_dang from ${banDo} where ma_dang = any($1::text[])`, [dangSet])
  const bdSet = new Set(bdRows.map(r => r.ma_dang))
  const thieu = dangSet.filter(d => !bdSet.has(d))
  if (thieu.length) throw new Error(`dang_chinh không có trong ${banDo}: ${thieu.join(', ')}`)

  // (a) Lọc trùng: khoá = noi_dung + lua_chon + menh_de (chuẩn hoá lower + bỏ \s). Chỉ so noi_dung
  //     là SAI với trắc nghiệm: 2 câu "phương trình nào là phương trình mặt cầu?" cùng đề, khác phương
  //     án (đã bắt nhầm Mặt cầu 1 câu 14/16 ngày 13/09). Chuẩn hoá làm HOÀN TOÀN trong SQL (jsonb::text
  //     canonical) để 2 bên so cùng một cách; trong lô so bằng khoá SQL trả về.
  const trung = []
  const skip = new Set()
  if (!choTrung) {
    const batch = cauList.map(q => ({ noi_dung: q.noi_dung, lua_chon: q.lua_chon ?? null, menh_de: q.menh_de ?? null }))
    const { rows: tr } = await client.query(
      `with b as (
         select o.ord::int - 1 as idx,
                ${SQL_CHUAN(`o.e->>'noi_dung' || coalesce(nullif((o.e->'lua_chon')::text, 'null'), '') || coalesce(nullif((o.e->'menh_de')::text, 'null'), '')`)} as k
           from jsonb_array_elements($1::jsonb) with ordinality as o(e, ord)
       )
       select b.idx, b.k,
              (select min(c.ma_cau) from ${table} c
                where c.xoa_at is null
                  and ${SQL_CHUAN(`c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')`)} = b.k) as ma_cau_cu
         from b order by b.idx`,
      [JSON.stringify(batch)]
    )
    const seen = new Map()   // khoá → idx đầu tiên trong lô
    for (const r of tr) {
      if (r.ma_cau_cu) { skip.add(r.idx); trung.push({ idx: r.idx, ma_cau_cu: r.ma_cau_cu }); continue }
      if (seen.has(r.k)) { skip.add(r.idx); trung.push({ idx: r.idx, ma_cau_cu: null, trong_lo: true, idx_goc: seen.get(r.k) }) }
      else seen.set(r.k, r.idx)
    }
  }

  // Group theo dang → cấp STT tuần tự với advisory lock (chỉ câu KHÔNG bị skip)
  const groups = new Map()
  for (let i = 0; i < cauList.length; i++) {
    if (skip.has(i)) continue
    const d = cauList[i].dang_chinh
    if (!groups.has(d)) groups.set(d, [])
    groups.get(d).push(i)
  }

  const maCauByIdx = new Array(cauList.length).fill(null)
  for (const [dang, idxs] of groups) {
    await client.query(
      `select pg_advisory_xact_lock(hashtextextended($1, 0))`,
      [`macau:${subject}:${dang}`]
    )
    const { rows: [{ nxt }] } = await client.query(
      `select coalesce(max(
           nullif(substring(ma_cau from ${dang.length + 1}), '')::int
         ), 0) + 1 as nxt
         from ${table}
        where ma_cau like $1 || '%'
          and substring(ma_cau from ${dang.length + 1}) ~ '^[0-9]+$'`,
      [dang]
    )
    let stt = Number(nxt)
    for (const i of idxs) {
      maCauByIdx[i] = dang + String(stt).padStart(3, '0')
      stt++
    }
  }

  // INSERT từng câu (bỏ câu trùng)
  for (let i = 0; i < cauList.length; i++) {
    if (skip.has(i)) continue
    const q = cauList[i]
    const maCau = maCauByIdx[i]
    const isAi = q.nguon_giai === 'ai'
    const ai = isAi ? {
      giai_method: q.giai_method ?? 'ai_extract_solve',
      ai_model:    q.ai_model    ?? null,
      loi_giai_ai: q.loi_giai_ai ?? q.loi_giai ?? null,
      dap_an_ai:   q.dap_an_ai   ?? q.dap_an   ?? null,
    } : { giai_method: null, ai_model: null, loi_giai_ai: null, dap_an_ai: null }
    const lc = (v) => (v === undefined ? null : v)
    const jsonOrNull = (v) => (v == null ? null : JSON.stringify(v))
    await client.query(
      `insert into ${table} (
         ma_cau, dang_chinh, loai_cau, noi_dung,
         lua_chon, menh_de, dap_an, loi_giai,
         anh_de, anh_dap_an,
         nguon, nguon_giai, ma_cum, ten_de_goc,
         da_duyet, dang_ai_de_xuat,
         giai_method, ai_model, loi_giai_ai, dap_an_ai,
         ai_de_xuat_at
       ) values (
         $1, $2, $3, $4,
         $5::jsonb, $6::jsonb, $7, $8,
         $9, $10,
         $11, $12, $13, $14,
         false, $2,
         $15, $16, $17, $18,
         ${isAi ? 'now()' : 'null'}
       )`,
      [
        maCau, q.dang_chinh, q.loai_cau, q.noi_dung,
        jsonOrNull(q.lua_chon), jsonOrNull(q.menh_de),
        lc(q.dap_an), lc(q.loi_giai),
        lc(q.anh_de), lc(q.anh_dap_an),
        q.nguon || 'de_thi', q.nguon_giai || 'nguoi',
        lc(q.ma_cum), lc(q.ten_de_goc),
        ai.giai_method, ai.ai_model, ai.loi_giai_ai, ai.dap_an_ai,
      ]
    )
  }

  // Câu trùng với kho: trả ma_cau cũ ở đúng vị trí (đề thi nối được); trùng trong lô: trỏ về ma_cau của bản đầu.
  for (const t of trung) {
    if (t.ma_cau_cu) maCauByIdx[t.idx] = t.ma_cau_cu
    else if (t.trong_lo) { maCauByIdx[t.idx] = maCauByIdx[t.idx_goc]; t.ma_cau_cu = maCauByIdx[t.idx_goc] }
  }

  return { maCauList: maCauByIdx, trung, chua_dang: chuaDang }
}
