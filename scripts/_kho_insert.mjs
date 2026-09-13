// ============================================================================
// _kho_insert.mjs — helper share giữa nhap_kho.mjs và nhap_de_thi.mjs.
// Insert 1 batch câu vào <subject>_cau_hoi trong 1 transaction.
// Caller CHỊU trách nhiệm BEGIN/COMMIT — helper chỉ chạy INSERT + validate.
// ============================================================================

export const SUBJECTS = ['hgt', 'dai', 'khtn']

/**
 * Insert 1 batch câu, sinh ma_cau tự động theo convention <dang>+lpad(STT,3,'0').
 * @param {object} p
 * @param {import('pg').Client} p.client  — client đã BEGIN
 * @param {'hgt'|'dai'|'khtn'} p.subject
 * @param {Array<object>} p.cauList        — mỗi câu: { dang_chinh, loai_cau, noi_dung, ... }
 * @returns {Promise<{maCauList: string[]}>}
 */
export async function insertCauBatch({ client, subject, cauList }) {
  if (!SUBJECTS.includes(subject)) throw new Error(`subject không hợp lệ: ${subject}`)
  if (!Array.isArray(cauList) || cauList.length === 0) throw new Error('cauList rỗng')

  for (let i = 0; i < cauList.length; i++) {
    const q = cauList[i]
    if (!q.dang_chinh || typeof q.dang_chinh !== 'string')
      throw new Error(`câu #${i}: thiếu dang_chinh`)
    if (!q.loai_cau) throw new Error(`câu #${i}: thiếu loai_cau`)
    if (!q.noi_dung) throw new Error(`câu #${i}: thiếu noi_dung`)

    // Câu Đúng-Sai: mỗi mệnh đề 1 dạng RIÊNG (dùng field ma_dang, không dang_chinh).
    // Trigger DB tự sync xuống <mon>_cau_menh_de, chặn ma_dang không hợp lệ.
    // KHTN chưa hỗ trợ (memory `[doi-xung-cap-mon-vs-nhanh]` — chờ tách Lý/Hoá/Sinh).
    if (q.loai_cau === 'dung_sai') {
      if (subject === 'khtn')
        throw new Error(`câu #${i}: KHTN chưa hỗ trợ câu Đúng-Sai (chờ tách Lý/Hoá/Sinh)`)
      if (!Array.isArray(q.menh_de) || q.menh_de.length < 2)
        throw new Error(`câu #${i}: câu Đúng-Sai cần menh_de array >= 2 phần tử`)
      q.menh_de.forEach((m, j) => {
        if (!m.ma_dang) throw new Error(`câu #${i} mệnh đề #${j}: thiếu ma_dang (dạng RIÊNG của mệnh đề, không phải câu cha)`)
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

  // Group theo dang → cấp STT tuần tự với advisory lock
  const groups = new Map()
  for (let i = 0; i < cauList.length; i++) {
    const d = cauList[i].dang_chinh
    if (!groups.has(d)) groups.set(d, [])
    groups.get(d).push(i)
  }

  const maCauByIdx = new Array(cauList.length)
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

  // INSERT từng câu
  for (let i = 0; i < cauList.length; i++) {
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

  return { maCauList: maCauByIdx }
}
