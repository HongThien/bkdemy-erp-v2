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

// 02/10 (CEO): thêm kho HÌNH HỌC ('hinh_hoc' — hình không gian 11 từ đề giữa kì). Khác 3 kho kia ở 3 chỗ:
//   · dạng = BÀI (`hinh_hoc_bai`, đọc qua view `hinh_hoc_ban_do`) · mã câu do DB cấp (HHC + số chạy), không ghép từ mã dạng
//   · bảng không có các cột ten_de_goc / ai_model / loi_giai_ai / dap_an_ai / ai_de_xuat_at · không có bảng mệnh đề riêng.
export const SUBJECTS = ['hgt', 'dai', 'khtn', 'hinh_hoc']

// ⭐ 26/10 (Thùy "chuyển hẳn sang bản đồ + kho mới"; "chủ yếu là m làm" = Claude chạy các lệnh nhập kho):
// Kho Đại/HGT ở KHỐI CHẠY BẢN ĐỒ MỚI (DB quyết: public._bdm_ds_khoi_chay(), hiện K6–12) — cấp 1 và KHTN/Hình giữ y cũ:
//   · dang_chinh LUÔN = dạng chờ của khối (mã dạng cũ là lưu trữ). Lô truyền mã dạng cũ thật ⇒ đổi sang dạng chờ, mã cũ giữ ở
//     dang_ai_de_xuat làm vết + cảnh báo (stderr). Mệnh đề Đ/S: ma_dang = dạng chờ (ý không gắn dạng — Thùy 26/10).
//   · DẠNG BÀI (mã NDB…) đi qua field `dang_bai` của câu thường ⇒ ĐỀ XUẤT `<kho>_bdm_de_xuat` nguon 'ai'
//     (luật "đề xuất trước, ghi sau"; `dang_bai_chac` 'cao'|'vua', `dang_bai_ly_do`). CHỈ khi người đã chốt (`dang_bai_chot: true`)
//     mới ghi thẳng GÁN `<kho>_bdm_gan_cau` nguon 'nguoi' (qua hàm DB _bdm_nguoi_gan_cau).
//   · Câu Đ/S: field `chu_de` (mã NCD…) ⇒ kho Đ/S của chủ đề `<kho>_bdm_kho_ds` (nguon 'ai'; `chu_de_chot: true` ⇒ 'nguoi').
//   · Mã câu: dạng chờ + STT lớn nhất trên MỌI câu mang tiền tố (kể cả kho rác), khoá CÙNG khoá với RPC fn_bdm_nhap_cau (màn Nhập kho).
//   Khối chưa chạy bản đồ mới mà lô có `dang_bai`/`chu_de` ⇒ báo lỗi (không ghi bừa).

const PREFIX = { dai: 'T1', hgt: 'T3', khtn: 'K', hinh_hoc: 'HH' }
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
 * @returns {Promise<{maCauList: string[], trung: Array<{idx:number, ma_cau_cu:string, trong_lo?:boolean}>, chua_dang: number[], bdm: {khoi: string[], de_xuat: number, gan: number, kho_ds: number, doi_dang_cu: Array<{idx:number, ma_dang_cu:string}>}}>}
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

  // ── Bản đồ mới (xem đầu file): đổi dạng cũ → dạng chờ ở khối mới, gom dạng bài / chủ đề để ghi sau khi chèn câu ──
  const bdm = { khoi: new Set(), de_xuat: 0, gan: 0, kho_ds: 0, doi_dang_cu: [] }
  if (subject === 'dai' || subject === 'hgt') {
    const { rows: [{ k }] } = await client.query(`select public._bdm_ds_khoi_chay() k`)
    const khoiMoi = new Set(k ?? [])
    const { rows: kr } = await client.query(`select ma_dang, khoi from ${banDo} where ma_dang = any($1::text[])`, [[...new Set(cauList.map((q) => q.dang_chinh))]])
    const khoiCua = new Map(kr.map((r) => [r.ma_dang, r.khoi]))
    for (let i = 0; i < cauList.length; i++) {
      const q = cauList[i]
      const kh = q.khoi != null ? String(q.khoi) : khoiCua.get(q.dang_chinh)
      const moi = kh != null && khoiMoi.has(kh)
      q._bdm = moi
      if (!moi) {
        if (q.dang_bai || q.chu_de) throw new Error(`câu #${i}: khối ${kh ?? '?'} chưa chạy bản đồ mới — không nhận dang_bai/chu_de`)
        continue
      }
      bdm.khoi.add(kh)
      const cho = maDangCho(subject, kh)
      if (q.dang_chinh !== cho) {
        bdm.doi_dang_cu.push({ idx: i, ma_dang_cu: q.dang_chinh })
        q.dang_ai_de_xuat = q.dang_ai_de_xuat ?? q.dang_chinh
        q.dang_chinh = cho
      }
      if (q.loai_cau === 'dung_sai') {
        if (q.dang_bai) throw new Error(`câu #${i}: câu Đúng/Sai không gán dạng bài — dùng chu_de (kho Đ/S của chủ đề)`)
        for (const m of q.menh_de ?? []) m.ma_dang = cho
      } else if (q.chu_de) throw new Error(`câu #${i}: chu_de chỉ dành cho câu Đúng/Sai — câu thường dùng dang_bai`)
    }
    if (bdm.doi_dang_cu.length) console.error(`⚠ bản đồ mới: ${bdm.doi_dang_cu.length} câu khối ${[...bdm.khoi].join(',')} truyền mã dạng CŨ ⇒ vào dạng chờ (mã cũ giữ ở dang_ai_de_xuat); dạng bài đi qua field dang_bai`)
    // dạng bài / chủ đề phải thuộc đúng nhánh của kho (Đại = 'toan', HGT = 'hgt')
    const nhanh = subject === 'dai' ? 'toan' : 'hgt'
    const dbs = [...new Set(cauList.filter((q) => q._bdm && q.dang_bai).map((q) => q.dang_bai))]
    if (dbs.length) {
      const { rows } = await client.query(`select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
         where d.id = any($1::text[]) and cd.nhanh = $2`, [dbs, nhanh])
      const co = new Set(rows.map((r) => r.id)); const sai = dbs.filter((x) => !co.has(x))
      if (sai.length) throw new Error(`dang_bai không có / không thuộc nhánh ${nhanh} của bản đồ mới: ${sai.join(', ')}`)
    }
    const cds = [...new Set(cauList.filter((q) => q._bdm && q.chu_de).map((q) => q.chu_de))]
    if (cds.length) {
      const { rows } = await client.query(`select id from dai_bdm_chu_de where id = any($1::text[]) and nhanh = $2`, [cds, nhanh])
      const co = new Set(rows.map((r) => r.id)); const sai = cds.filter((x) => !co.has(x))
      if (sai.length) throw new Error(`chu_de không có / không thuộc nhánh ${nhanh} của bản đồ mới: ${sai.join(', ')}`)
    }
  }

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
       -- 02/10: trước là subquery tương quan ⇒ quét + chuẩn hoá CẢ KHO một lần cho MỖI câu của lô (đo: >13 giây / lô, 61 đề chạy hơn
       -- 20 phút chưa xong). Giờ chuẩn hoá kho MỘT lần rồi ghép theo khoá — cùng kết quả (min(ma_cau) của câu trùng khoá).
       , kho as (
         select ${SQL_CHUAN(`c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')`)} as k, min(c.ma_cau) as ma_cau_cu
           from ${table} c where c.xoa_at is null group by 1
       )
       select b.idx, b.k, kho.ma_cau_cu
         from b left join kho on kho.k = b.k order by b.idx`,
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

  // Kho Hình học: mã câu do DB cấp (default HHC + hinh_hoc_cau_seq) ⇒ chèn rồi lấy mã về, không tự tính STT theo dạng.
  if (subject === 'hinh_hoc') {
    const jn = (v) => (v == null ? null : JSON.stringify(v))
    for (let i = 0; i < cauList.length; i++) {
      if (skip.has(i)) continue
      const q = cauList[i]
      const { rows: [r] } = await client.query(
        `insert into hinh_hoc_cau_hoi (dang_chinh, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an,
                                       nguon, nguon_giai, ma_cum, da_duyet, dang_ai_de_xuat)
         values ($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7, $8, $9, $10, $11, $12, false, $1) returning ma_cau`,
        [q.dang_chinh, q.loai_cau, q.noi_dung, jn(q.lua_chon), jn(q.menh_de), q.dap_an ?? null, q.loi_giai ?? null,
         q.anh_de ?? null, q.anh_dap_an ?? null, q.nguon || 'de_thi', q.nguon_giai || 'nguoi', q.ma_cum ?? null])
      maCauByIdx[i] = r.ma_cau
    }
    for (const t of trung) {
      if (t.ma_cau_cu) maCauByIdx[t.idx] = t.ma_cau_cu
      else if (t.trong_lo) { maCauByIdx[t.idx] = maCauByIdx[t.idx_goc]; t.ma_cau_cu = maCauByIdx[t.idx_goc] }
    }
    return { maCauList: maCauByIdx, trung, chua_dang: chuaDang, bdm }
  }

  for (const [dang, idxs] of groups) {
    await client.query(
      `select pg_advisory_xact_lock(hashtextextended($1, 0))`,
      [`macau:${subject}:${dang}`]
    )
    // cùng khoá với RPC fn_bdm_nhap_cau (màn Nhập kho cấp mã dạng chờ) — 2 đường cấp mã không giẫm nhau
    if (laDangCho(dang)) await client.query(`select pg_advisory_xact_lock(hashtext($1))`, [`${table}:${dang}`])
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
         false, $19,
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
        q.dang_ai_de_xuat ?? q.dang_chinh,
      ]
    )
    // Bản đồ mới: dạng bài (đề xuất AI / gán người đã chốt) · chủ đề kho Đ/S — chỉ câu MỚI chèn
    if (q._bdm && q.dang_bai) {
      if (q.dang_bai_chot) { await client.query(`select public._bdm_nguoi_gan_cau($1, $2, $3)`, [subject, maCau, q.dang_bai]); bdm.gan++ }
      else {
        await client.query(`insert into ${subject}_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1, $2, $3, $4, 'ai') on conflict (ma_cau) do nothing`,
          [maCau, q.dang_bai, q.dang_bai_chac === 'cao' ? 'cao' : 'vua', String(q.dang_bai_ly_do ?? '')])
        bdm.de_xuat++
      }
    }
    if (q._bdm && q.chu_de) {
      await client.query(`insert into ${subject}_bdm_kho_ds (ma_cau, chu_de_id, nguon) values ($1, $2, $3) on conflict (ma_cau) do nothing`,
        [maCau, q.chu_de, q.chu_de_chot ? 'nguoi' : 'ai'])
      bdm.kho_ds++
    }
  }

  // Câu trùng với kho: trả ma_cau cũ ở đúng vị trí (đề thi nối được); trùng trong lô: trỏ về ma_cau của bản đầu.
  for (const t of trung) {
    if (t.ma_cau_cu) maCauByIdx[t.idx] = t.ma_cau_cu
    else if (t.trong_lo) { maCauByIdx[t.idx] = maCauByIdx[t.idx_goc]; t.ma_cau_cu = maCauByIdx[t.idx_goc] }
  }

  return { maCauList: maCauByIdx, trung, chua_dang: chuaDang, bdm: { ...bdm, khoi: [...bdm.khoi] } }
}
