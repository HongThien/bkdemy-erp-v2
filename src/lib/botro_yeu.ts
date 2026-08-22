// Data-layer BỔ TRỢ YẾU — case sinh từ ĐO LƯỜNG (dạng ≤0.5 / so-lớp kém), khác hẳn `bo_tro_duoi`
// (HS mới chậm chương trình, mig 202607222255 §0). Đợt (`bo_tro_yeu`, HS×MÔN — không phải HS×lớp)
// mở khi người duyệt chọn "Bổ trợ" ở màn Duyệt — `duyetLevel` (danhgia.ts) và hàm ở đây gọi CÙNG
// LÚC, xem `PLAN-botro-yeu.md`. 1 HS chỉ có 1 đợt "dang_xu"/môn (unique index DB) — dạng mới phát
// hiện khi đã có đợt mở thì GỘP vào đợt đó, không tạo đợt song song.
//
// ⭐ KHÔNG lưu `muc` riêng trên case: mức bổ trợ (1/2/3) = TRỰC TIẾP `hs_level.level` tại thời điểm
//   đọc (PLAN §0 mục 4: L1=mức1 sau giờ TA · L2=mức2 buổi riêng TA · L3=mức2 đổi GV cao cấp) — 2
//   field cùng 1 sự thật là trùng lặp, đọc JOIN thay vì lưu 2 nơi (CLAUDE.md §4: "1 cột trạng thái
//   hiện tại"). Chọn "mức" ở màn Duyệt = chọn thẳng `levelChot` truyền cho `duyetLevel`.
// ⭐ Thái độ THUẦN không qua đây (PLAN §0 mục 10) — chỉ `loai='kien_thuc'` mở case. Caller (UI)
//   chịu trách nhiệm không gọi hàm này cho case thái độ.
import { supabase } from './supabase'
import { khoCuaMon } from './tailieu'
import { RESULT_VALUE } from '../gami/mastery.js'

const LIMIT = 10000

export type NguonBoTroYeu = 'ai_de_xuat' | 'thu_cong' | 'chuong_do' | 'gv_tien_quyet'

// Gộp dạng vào 1 case ĐÃ TỒN TẠI — idempotent (upsert ignoreDuplicates), an toàn gọi lại nhiều lần.
async function themDangVaoCase(boTroYeuId: string, maDangs: string[]): Promise<void> {
  if (!maDangs.length) return
  const { error } = await supabase.from('bo_tro_yeu_dang')
    .upsert(
      maDangs.map((ma) => ({ bo_tro_yeu_id: boTroYeuId, ma_dang: ma })),
      { onConflict: 'bo_tro_yeu_id,ma_dang', ignoreDuplicates: true },
    )
  if (error) throw error
}

// Mở đợt MỚI hoặc GỘP dạng vào đợt đang mở. Gọi SAU khi `duyetLevel` (loai='kien_thuc') chốt
// level_chot ≥ 1 VÀ người duyệt chọn "Bổ trợ" — KHÔNG gọi cho "theo dõi thêm"/"bỏ theo dõi" (2
// quyết định đó chỉ ghi log qua `duyetLevel`, không mở case).
// Idempotent theo dạng: gọi lại với cùng `maDangs` không tạo dòng trùng (upsert ignoreDuplicates) —
// an toàn nếu UI gọi lại do lỗi mạng giữa chừng.
export async function moHoacGopCaseBoTroYeu(input: {
  hocSinhId: string
  mon: string
  maDangs: string[]           // dạng cần bổ trợ — chọn ở bước "duyệt nội dung" (bước riêng, SAU bước này)
  nguon: NguonBoTroYeu
  lyDo?: string | null
}): Promise<{ boTroYeuId: string; moMoi: boolean; caseTruocId: string | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  const actor = user?.id ?? null

  const { data: dangXu, error: eSel } = await supabase.from('bo_tro_yeu')
    .select('id')
    .eq('hoc_sinh_id', input.hocSinhId).eq('mon', input.mon).eq('trang_thai', 'dang_xu')
    .maybeSingle()
  if (eSel) throw eSel

  let boTroYeuId: string
  let moMoi = false
  let caseTruocId: string | null = null

  if (dangXu) {
    boTroYeuId = (dangXu as any).id
  } else {
    // Đợt gần nhất đã hoàn_thành của (HS, môn) — nối chuỗi lịch sử leo thang (mig 202608181007,
    // Thùy 08-18: cần biết "HS này đã bổ trợ mấy lần" ở màn Đánh giá hiệu suất).
    const { data: dotTruoc } = await supabase.from('bo_tro_yeu')
      .select('id')
      .eq('hoc_sinh_id', input.hocSinhId).eq('mon', input.mon).eq('trang_thai', 'hoan_thanh')
      .order('created_at', { ascending: false }).limit(1).maybeSingle()
    caseTruocId = (dotTruoc as any)?.id ?? null

    const { data: created, error: eIns } = await supabase.from('bo_tro_yeu').insert({
      hoc_sinh_id: input.hocSinhId, mon: input.mon, nguon: input.nguon,
      ly_do: input.lyDo ?? null, actor, case_truoc_id: caseTruocId,
    }).select('id').single()
    if (eIns) throw eIns
    boTroYeuId = (created as any).id
    moMoi = true
  }

  await themDangVaoCase(boTroYeuId, input.maDangs)
  return { boTroYeuId, moMoi, caseTruocId }
}

// ── BƯỚC 4 — CHỌN NỘI DUNG (PLAN-botro-yeu.md quyết định 08 + 0.4) ─────────────────
// "Cấu hình đã chọn" = CHÍNH các dòng `bo_tro_yeu_dang` — không có bảng nháp riêng. Sinh tài
// liệu thật (câu, số lượng) là bước KHÁC, sau khi có ngày bổ trợ (bước xếp lịch).

export type CaseBoTroYeuItem = {
  id: string
  hoc_sinh_id: string
  ho_ten: string
  ma_hs: string | null
  khoi: string | null
  mon: string
  nguon: NguonBoTroYeu
  ly_do: string | null
  created_at: string
  soDang: number
}

// Case đang mở (dang_xu) — cho màn "Nội dung bổ trợ yếu" chọn/rà dạng trước khi xếp lịch.
export async function listCaseDangMo(mon?: string): Promise<CaseBoTroYeuItem[]> {
  let q = supabase.from('bo_tro_yeu')
    .select('id, hoc_sinh_id, mon, nguon, ly_do, created_at, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs, khoi), bo_tro_yeu_dang(id)')
    .eq('trang_thai', 'dang_xu').order('created_at', { ascending: true }).limit(LIMIT)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    id: r.id, hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null,
    khoi: r.hoc_sinh?.khoi ?? null, mon: r.mon, nguon: r.nguon, ly_do: r.ly_do, created_at: r.created_at,
    soDang: (r.bo_tro_yeu_dang ?? []).length,
  }))
}

export type DangCuaCase = {
  id: string; ma_dang: string; ten_dang: string; ten_chuyen_de: string
  day_at: string | null; dong_at: string | null
}

// Dạng đã chọn của 1 case, kèm TÊN (join bản đồ ĐÚNG BẢNG theo môn — ma_dang không unique xuyên môn,
// CLAUDE.md bẫy #1 / HANDOFF ②: không được suy tên mà thiếu `mon`).
export async function getDangCuaCase(boTroYeuId: string, mon: string): Promise<DangCuaCase[]> {
  const { data, error } = await supabase.from('bo_tro_yeu_dang')
    .select('id, ma_dang, day_at, dong_at').eq('bo_tro_yeu_id', boTroYeuId).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as any[]
  if (!rows.length) return []
  const K = khoCuaMon(mon)
  const { data: banDo, error: eBanDo } = await supabase.from(K.banDoTbl)
    .select('ma_dang, ten_dang, ten_chuyen_de').in('ma_dang', rows.map((r) => r.ma_dang)).limit(LIMIT)
  if (eBanDo) throw eBanDo
  const ten = new Map((banDo ?? []).map((d: any) => [d.ma_dang, d]))
  return rows.map((r) => ({
    id: r.id, ma_dang: r.ma_dang,
    ten_dang: ten.get(r.ma_dang)?.ten_dang ?? r.ma_dang, // dạng đã xoá khỏi bản đồ → hiện mã, không mất dòng
    ten_chuyen_de: ten.get(r.ma_dang)?.ten_chuyen_de ?? '',
    day_at: r.day_at, dong_at: r.dong_at,
  }))
}

// Thêm tay — dùng cho "chủ động search dạng bài" (kể cả dạng khối KHÁC, kiến thức năm trước).
// Dùng chung `DangPicker` (TaiLieuBuilder.tsx) truyền `khoi` tự chọn — picker không ép đúng khối HS.
export async function themDangTayVaoCase(boTroYeuId: string, maDangs: string[]): Promise<void> {
  await themDangVaoCase(boTroYeuId, maDangs)
}

// Bỏ 1 dạng khỏi case — CHỈ khi CHƯA dạy (`day_at` null). Dạng đã dạy là bằng chứng vận hành thật
// (GV đã tick "đã dạy"), xoá sẽ mất dấu — chặn cứng, không phải validate mềm ở UI (CLAUDE.md §1.5).
export async function boDangKhoiCase(dangId: string): Promise<void> {
  const { data: row, error: eSel } = await supabase.from('bo_tro_yeu_dang').select('day_at').eq('id', dangId).single()
  if (eSel) throw eSel
  if ((row as any)?.day_at) throw new Error('Dạng này đã dạy — không xoá được (mất dấu vận hành).')
  const { error } = await supabase.from('bo_tro_yeu_dang').delete().eq('id', dangId)
  if (error) throw error
}

// ── BƯỚC 6 — XẾP LỊCH (PLAN §0 mục 3+9) ────────────────────────────────────────────
// Buổi bổ trợ yếu = `buoi_hoc(loai='bo_tro_yeu')`, ĐỐI XỨNG buổi bù (`taoBuoiBu`, botro.ts) —
// TA/GV đứng lớp (nguoi_day_tg) làm cả chấm ET lẫn đánh giá, y hệt buổi bù (Thùy 07-26 nhất quán).
// Phòng: mảng `ROOMS` cứng tạm (TKBScreen.tsx) — KHÔNG check trùng lịch (PLAN mục 9, chờ dự án
// Quản lý phòng học riêng). `case_truoc_id`/mức đọc qua `hs_level`, KHÔNG lưu ở đây.

export type CaseChoXep = CaseBoTroYeuItem & { daXep: boolean }

// Case đã có ≥1 dạng (đã qua bước 4) — CẦN xếp lịch. `daXep` = đã có buổi nào gắn case này chưa
// (kể cả buổi đã huỷ vẫn tính đã-từng-xếp, hiển thị để OPS xếp buổi MỚI, không lặp tay tìm lại).
export async function listCaseChoXepLich(mon?: string): Promise<CaseChoXep[]> {
  const items = (await listCaseDangMo(mon)).filter((c) => c.soDang > 0)
  if (!items.length) return []
  const { data: buoiHs, error } = await supabase.from('buoi_hoc_hs')
    .select('bo_tro_yeu_id').in('bo_tro_yeu_id', items.map((c) => c.id)).limit(LIMIT)
  if (error) throw error
  const daXepSet = new Set((buoiHs ?? []).map((r: any) => r.bo_tro_yeu_id))
  return items.map((c) => ({ ...c, daXep: daXepSet.has(c.id) }))
}

// Tạo buổi bổ trợ yếu MỚI + gắn case + HS. 1 buổi = 1 HS (khác buổi bù có thể gom nhiều lần-nghỉ,
// bổ trợ yếu luôn riêng-1-em dù mức 1 hay mức 2 — PLAN §0 mục 4, không có khái niệm gộp lớp).
export async function taoBuoiBoTroYeu(input: {
  boTroYeuId: string
  hocSinhId: string
  ngay: string
  gio_bat_dau?: string | null
  phong?: string | null
  nguoi_day_tg?: string | null   // TA (mức 1/2) hoặc GV cao cấp (mức 3) — người gọi tự chọn đúng pool
}): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('buoi_hoc').insert({
    loai: 'bo_tro_yeu', lop_id: null, ngay: input.ngay, gio_bat_dau: input.gio_bat_dau ?? null,
    phong: input.phong ?? null, nguoi_day_tg: input.nguoi_day_tg ?? null, trang_thai: 'mo', created_by: user?.id ?? null,
  }).select('id').single()
  if (error) throw error
  const buoiId = (data as any).id
  const { error: eHs } = await supabase.from('buoi_hoc_hs')
    .insert({ buoi_hoc_id: buoiId, hoc_sinh_id: input.hocSinhId, bo_tro_yeu_id: input.boTroYeuId })
  if (eHs) throw eHs
  return buoiId
}

// ── TRẠNG THÁI CA BỔ TRỢ (PLAN §2 "vòng đời — PURE-DERIVE") ─────────────────────────
// KHÔNG thêm cột trạng-thái-con nào — giai đoạn suy TỪ dữ liệu con (buổi + dạng day_at/dong_at),
// đúng CLAUDE.md §4 "1 cột trạng thái hiện tại, không đẻ state ảo".
export type TienDoCase = {
  id: string; hoc_sinh_id: string; ho_ten: string; mon: string
  soDang: number; soDaDay: number; soDaDong: number
  buoiGanNhat: { ngay: string; trang_thai: string; danh_gia_xong_at: string | null } | null
  giaiDoan: 'cho_noi_dung' | 'cho_xep_lich' | 'da_xep' | 'cho_retest' | 'hoan_thanh'
}

export async function layTienDoCa(mon?: string): Promise<TienDoCase[]> {
  let q = supabase.from('bo_tro_yeu')
    .select('id, hoc_sinh_id, mon, hoc_sinh:hoc_sinh_id(ho_ten), bo_tro_yeu_dang(id, day_at, dong_at)')
    .eq('trang_thai', 'dang_xu').limit(LIMIT)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q
  if (error) throw error
  const rows = (data ?? []) as any[]
  if (!rows.length) return []

  const ids = rows.map((r) => r.id)
  const { data: buoiHs, error: eBh } = await supabase.from('buoi_hoc_hs')
    .select('bo_tro_yeu_id, buoi:buoi_hoc_id(ngay, trang_thai, danh_gia_xong_at)')
    .in('bo_tro_yeu_id', ids).limit(LIMIT)
  if (eBh) throw eBh
  const buoiMap = new Map<string, { ngay: string; trang_thai: string; danh_gia_xong_at: string | null }[]>()
  for (const r of (buoiHs ?? []) as any[]) {
    if (!r.buoi) continue
    const arr = buoiMap.get(r.bo_tro_yeu_id) ?? []
    arr.push(r.buoi)
    buoiMap.set(r.bo_tro_yeu_id, arr)
  }

  return rows.map((r) => {
    const dangs = (r.bo_tro_yeu_dang ?? []) as { id: string; day_at: string | null; dong_at: string | null }[]
    const soDang = dangs.length
    const soDaDay = dangs.filter((d) => d.day_at).length
    const soDaDong = dangs.filter((d) => d.dong_at).length
    const buois = (buoiMap.get(r.id) ?? []).sort((a, b) => Date.parse(b.ngay) - Date.parse(a.ngay))
    const buoiGanNhat = buois[0] ?? null

    let giaiDoan: TienDoCase['giaiDoan']
    if (soDang === 0) giaiDoan = 'cho_noi_dung'
    else if (!buoiGanNhat) giaiDoan = 'cho_xep_lich'
    else if (soDang > 0 && soDaDong === soDang) giaiDoan = 'hoan_thanh'
    else if (soDaDay < soDang) giaiDoan = 'da_xep'
    else giaiDoan = 'cho_retest'

    return { id: r.id, hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', mon: r.mon, soDang, soDaDay, soDaDong, buoiGanNhat, giaiDoan }
  })
}

// Buổi bổ trợ yếu ĐÃ XẾP của 1 case — cho màn Xếp lịch hiện lại giờ/phòng/người dạy đã chốt.
export type BuoiBoTroYeuDaXep = {
  id: string; ngay: string; gio_bat_dau: string | null; phong: string | null
  nguoi_day_tg: string | null; trang_thai: string
}
export async function listBuoiCuaCase(boTroYeuId: string): Promise<BuoiBoTroYeuDaXep[]> {
  const { data, error } = await supabase.from('buoi_hoc_hs')
    .select('buoi:buoi_hoc_id(id, ngay, gio_bat_dau, phong, nguoi_day_tg, trang_thai)')
    .eq('bo_tro_yeu_id', boTroYeuId).limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => r.buoi).filter(Boolean)
    .sort((a, b) => Date.parse(b.ngay) - Date.parse(a.ngay))
}

// ── ĐÁNH GIÁ CA BỔ TRỢ (PLAN §12) — chỉ case đã "hoàn thành" theo derive (mọi dạng đã dong_at) ────
// ⚠ Không lọc theo `trang_thai='hoan_thanh'` — CHƯA có code nào set cột đó (chờ bước điểm danh/retest,
// PLAN §6 mục 5 chưa build). Lọc bằng `layTienDoCa().giaiDoan==='hoan_thanh'` (derive), rồi mới đóng
// case thật khi người duyệt bấm 1 trong 5 hành vi tiếp theo — xem `dongCase`.
export type CaseHoanThanh = { id: string; hoc_sinh_id: string; ho_ten: string; mon: string; created_at: string; caseTruocId: string | null }
export async function listCaseChoDanhGia(mon?: string): Promise<CaseHoanThanh[]> {
  const tienDo = await layTienDoCa(mon)
  const xong = tienDo.filter((c) => c.giaiDoan === 'hoan_thanh')
  if (!xong.length) return []
  const { data, error } = await supabase.from('bo_tro_yeu')
    .select('id, hoc_sinh_id, mon, created_at, case_truoc_id, hoc_sinh:hoc_sinh_id(ho_ten)')
    .in('id', xong.map((c) => c.id)).limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({
    id: r.id, hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', mon: r.mon,
    created_at: r.created_at, caseTruocId: r.case_truoc_id,
  }))
}

// So sánh điểm TRƯỚC (mọi lần đo trước `day_at`) và SAU (mọi lần đo từ `day_at` trở đi, gồm cả buổi
// dạy lẫn retest — không tách riêng vì cả 2 đều là "sau khi dạy") — cho popup detail bước đánh giá.
export type DangDanhGia = { ma_dang: string; ten_dang: string; truoc: number | null; nTruoc: number; sau: number | null; nSau: number; dayAt: string | null }
export async function getDanhGiaCase(boTroYeuId: string, hocSinhId: string, mon: string): Promise<DangDanhGia[]> {
  const { data: dangs, error } = await supabase.from('bo_tro_yeu_dang').select('ma_dang, day_at').eq('bo_tro_yeu_id', boTroYeuId).limit(LIMIT)
  if (error) throw error
  const rows = (dangs ?? []) as { ma_dang: string; day_at: string | null }[]
  if (!rows.length) return []
  const maDangs = rows.map((r) => r.ma_dang)

  const { data: grades, error: eG } = await supabase.from('gami_grades')
    .select('result, graded_at, prob:problem_id(ma_dang)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  if (eG) throw eG
  const K = khoCuaMon(mon)
  const { data: banDo } = await supabase.from(K.banDoTbl).select('ma_dang, ten_dang').in('ma_dang', maDangs).limit(LIMIT)
  const ten = new Map((banDo ?? []).map((d: any) => [d.ma_dang, d.ten_dang]))
  const avg = (arr: number[]) => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null

  return rows.map((r) => {
    const vals = ((grades ?? []) as any[])
      .filter((g) => g.prob?.ma_dang === r.ma_dang)
      .map((g) => ({ value: (RESULT_VALUE as Record<string, number>)[g.result], t: g.graded_at }))
      .filter((e) => e.value !== undefined)
    const cutoff = r.day_at ? Date.parse(r.day_at) : null
    const truoc = cutoff ? vals.filter((e) => Date.parse(e.t) < cutoff) : vals
    const sau = cutoff ? vals.filter((e) => Date.parse(e.t) >= cutoff) : []
    return {
      ma_dang: r.ma_dang, ten_dang: ten.get(r.ma_dang) ?? r.ma_dang,
      truoc: avg(truoc.map((e) => e.value)), nTruoc: truoc.length,
      sau: avg(sau.map((e) => e.value)), nSau: sau.length, dayAt: r.day_at,
    }
  })
}

// Đóng case (kết thúc pipeline). KHÔNG tự "chốt level" — người duyệt vẫn gọi `duyetLevel` riêng nếu
// hành vi tiếp theo cần đổi level (giữ nguyên nguyên tắc "máy/luồng derive, người quyết level").
export async function dongCase(boTroYeuId: string): Promise<void> {
  const { error } = await supabase.from('bo_tro_yeu')
    .update({ trang_thai: 'hoan_thanh', hoan_thanh_at: new Date().toISOString() }).eq('id', boTroYeuId)
  if (error) throw error
}
