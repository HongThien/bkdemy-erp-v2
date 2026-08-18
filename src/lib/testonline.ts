// ============================================================================
// testonline.ts — DATA-LAYER test online (seam: UI KHÔNG gọi supabase trực tiếp).
// Spec: spec-test-online.md. Slice 1 = BTVN + trac_nghiem/tra_loi_ngan.
// 3 tầng: KHO → bai_test (snapshot đề+key) → bai_lam (HS-facing) → đo lường.
// ============================================================================
import { supabase } from './supabase'
import { getBTVNCaus, getETCaus, getGiaoTrinhBuoiCaus, khoCuaMon } from './tailieu'
import { getDeThiCaus } from './dethi'
import { fetchCausByMa } from './ontap'
import { maDeReady, type BaseItem } from './made'
import type { CauHoi } from './kho/api'
import { extractKey, gradeTracNghiem, gradeTraLoiNgan, gradeDungSai, smartNormalize, LETTERS } from '../gami/testgrade'

const LIMIT = 1000
const SUPPORTED = new Set(['trac_nghiem', 'dung_sai', 'tra_loi_ngan']) // auto-chấm được

export type TestLoai = 'et' | 'btvn' | 'giao_trinh' | 'de_thi'
export type BaiTest = {
  id: string; nguon_tai_lieu_id: string | null; lop_id: string; ngay: string
  loai: TestLoai; mon: string; trang_thai: 'mo' | 'dong'; so_cau: number
  deadline: string | null; khoa_reveal: boolean; created_at: string
}
export type BaiTestCau = {
  id: string; bai_test_id: string; thu_tu: number; bien_the: number; ma_cau: string | null; loai_cau: string
  noi_dung: string | null; lua_chon: string[] | null; menh_de: unknown; dap_an_key: unknown
  loi_giai: string | null; anh_de: string | null; anh_dap_an: string | null
  ma_dang: string | null; ly_thuyet: string | null; diem: number
}
export type BaiLam = { id: string; bai_test_id: string; hoc_sinh_id: string; trang_thai: 'dang_lam' | 'da_nop'; nop_at: string | null; bien_the: number }
export type BaiLamCau = { id: string; bai_lam_id: string; bai_test_cau_id: string; dap_an_hs: unknown; verdict: string | null; diem: number | null; cham_boi: string | null }

// HS bấm "💡 Gợi ý" → ghi vết (idempotent — chỉ cần biết ĐÃ xem, không đếm số lần). GV dùng ở màn Xem live.
export async function xemGoiY(baiLamId: string, baiTestCauId: string): Promise<void> {
  const { error } = await supabase.from('bai_lam_goi_y')
    .upsert({ bai_lam_id: baiLamId, bai_test_cau_id: baiTestCauId }, { onConflict: 'bai_lam_id,bai_test_cau_id', ignoreDuplicates: true })
  if (error) throw error
}

// ── PHÁT HÀNH (staff) — snapshot đề + key 1 lần, idempotent (spec §5.1) ──────
export async function getBaiTestByDoc(nguonTaiLieuId: string, lopId: string, ngay: string, loai: TestLoai): Promise<BaiTest | null> {
  const { data, error } = await supabase.from('bai_test').select('*')
    .eq('nguon_tai_lieu_id', nguonTaiLieuId).eq('lop_id', lopId).eq('ngay', ngay).eq('loai', loai)
    .order('created_at', { ascending: false }).limit(1)
  if (error) throw error
  return ((data as BaiTest[])?.[0]) ?? null
}

export type PhatHanhKetQua = { baiTest: BaiTest; added: number; skipped: { ma_cau: string; warn: string }[]; canhBao?: string | null }

// Hết hạn = SUY từ deadline, không có job đóng test (CLAUDE.md §4 — đừng đẻ state chờ).
// `trang_thai='dong'` dành riêng cho staff đóng TAY (có actor). deadline null = không hạn.
export function daHetHan(t: { deadline: string | null; trang_thai?: string }, now = Date.now()): boolean {
  if (t.trang_thai === 'dong') return true
  return !!t.deadline && new Date(t.deadline).getTime() <= now
}

// Doc loai → (câu resolver · loai bai_test · nhãn). ET/đề-thi=THI (giấu key); BTVN/giáo trình=tham khảo reveal-ngay.
const DOC_MAP: Record<string, { getCaus: (id: string) => Promise<CauHoi[]>; testLoai: TestLoai; ten: string }> = {
  btvn: { getCaus: getBTVNCaus, testLoai: 'btvn', ten: 'BTVN' },
  et: { getCaus: getETCaus, testLoai: 'et', ten: 'ET' },
  giao_trinh_buoi: { getCaus: getGiaoTrinhBuoiCaus, testLoai: 'giao_trinh', ten: 'giáo trình (bài tập)' },
  de_thi: { getCaus: getDeThiCaus, testLoai: 'de_thi', ten: 'Đề thi' },
}
export const PHAT_HANH_DUOC = new Set(Object.keys(DOC_MAP))

// Phát hành 1 doc (BTVN / ET / giáo trình buổi / đề thi) thành test online.
// Đề thi KHÔNG tự bám lớp+ngày (đề dùng lại cho nhiều lớp/lần) → `override` bắt buộc cho loại này;
// các loại còn lại lấy lop_id/ngay sẵn có trên doc (như trước, override optional).
export async function phatHanhTest(taiLieuId: string, override?: { lopId: string; ngay: string }): Promise<PhatHanhKetQua> {
  const { data: tl, error: e0 } = await supabase.from('tai_lieu').select('id, lop_id, ngay, mon, nhanh, loai, cau_hinh').eq('id', taiLieuId).single()
  if (e0) throw e0
  const doc = tl as { id: string; lop_id: string | null; ngay: string | null; mon: string; nhanh: string | null; loai: string; cau_hinh: any }
  const map = DOC_MAP[doc.loai]
  if (!map) throw new Error('Chỉ phát hành online được BTVN, ET, giáo trình buổi hoặc đề thi.')
  const lopId = override?.lopId ?? doc.lop_id
  const ngay = override?.ngay ?? doc.ngay
  if (!lopId || !ngay) throw new Error('Chưa có lớp+ngày — không phát hành được.')

  const existed = await getBaiTestByDoc(doc.id, lopId, ngay, map.testLoai)
  if (existed) throw new Error('Doc này đã phát hành rồi cho lớp+ngày này (1 doc×lớp×ngày = 1 test). Xoá test cũ nếu muốn phát lại.')

  const caus = await map.getCaus(taiLieuId)
  // Snapshot LÝ THUYẾT dạng (HS ko đọc kho) — batch theo môn của doc.
  const dangs = [...new Set(caus.map((c) => c.dang_chinh).filter(Boolean))]
  const ltMap = new Map<string, string>()
  if (dangs.length) {
    const ltTbl = khoCuaMon(doc.mon).ltDangTbl
    const { data: lt } = await supabase.from(ltTbl).select('ma_dang, noi_dung').in('ma_dang', dangs).limit(LIMIT)
    for (const r of (lt ?? []) as { ma_dang: string; noi_dung: string | null }[]) if (r.noi_dung) ltMap.set(r.ma_dang, r.noi_dung)
  }
  const skipped: { ma_cau: string; warn: string }[] = []
  const rows: Omit<BaiTestCau, 'id'>[] = []
  let thu_tu = 0
  // Snapshot 1 câu THẬT ở 1 vị trí+biến thể — dùng lại cho cả mã gốc lẫn mã đề 2/3 (câu khác nhau,
  // cùng cấu trúc). effLoai giữ chung cho mọi biến thể của 1 vị trí (đều cùng dạng câu hỏi khi được
  // sinh bởi buildMaDe — made.ts ép canBeETForm khớp form câu gốc).
  const snap = (c: CauHoi, tt: number, bienThe: number): { row: Omit<BaiTestCau, 'id'> | null; warn?: { ma_cau: string; warn: string } } => {
    const effLoai = c.loai_cau === 'tu_luan' && c.dap_an?.trim() ? 'tra_loi_ngan' : c.loai_cau
    if (!SUPPORTED.has(effLoai)) return { row: null, warn: { ma_cau: c.ma_cau, warn: `loại "${c.loai_cau}" chưa hỗ trợ online` } }
    const k = extractKey({ ...c, loai_cau: effLoai })
    if (!k.ok) return { row: null, warn: { ma_cau: c.ma_cau, warn: k.warn! } }
    return {
      row: {
        bai_test_id: '', thu_tu: tt, bien_the: bienThe, ma_cau: c.ma_cau, loai_cau: effLoai,
        noi_dung: c.noi_dung ?? null, lua_chon: (c.lua_chon as string[] | null) ?? null,
        menh_de: c.menh_de ?? null, dap_an_key: k.key,
        loi_giai: c.loi_giai ?? null, anh_de: c.anh_de ?? null, anh_dap_an: c.anh_dap_an ?? null,
        ma_dang: c.dang_chinh ?? null, ly_thuyet: ltMap.get(c.dang_chinh) ?? null, diem: 1,
      },
    }
  }
  for (const c of caus) {
    ++thu_tu
    const { row, warn } = snap(c, thu_tu, 1)
    if (warn) skipped.push(warn)
    if (row) rows.push(row)
  }
  if (!rows.length) throw new Error(`Không có câu hợp lệ để phát hành${skipped.length ? ` (${skipped.length} câu bị bỏ qua)` : ''}.`)

  // ⭐ 3 MÃ ĐỀ (chỉ ET — hsMaDe/etMaDe là cơ chế riêng của ETScreen/made.ts, BTVN/giáo trình/đề thi
  // trường-sở không dùng). GV đã "Sinh mã đề" ĐỦ (maDeReady) → snapshot LUÔN cả câu mã 2/3, cùng
  // `thu_tu` với câu gốc tương ứng (khác `bien_the`). Chưa sinh/chưa đủ → CHỈ 1 biến thể như cũ —
  // không suy đoán câu thay thế (§1.5 "thà bỏ trống"), tự khớp `bai_test_cau_bien_the` default 1.
  if (map.testLoai === 'et') {
    const ch = doc.cau_hinh ?? {}
    const base: BaseItem[] = caus.map((c) => ({ maDang: c.dang_chinh, maCau: c.ma_cau }))
    if (maDeReady(base, ch)) {
      const maCauByThuTu = new Map(caus.map((c, i) => [i + 1, c.ma_cau]))
      const needMa = new Set<string>()
      for (const arr of Object.values(ch.etMaDe ?? {}) as (string | null)[][]) for (const m of arr) if (m) needMa.add(m)
      const varCaus = await fetchCausByMa([...needMa], khoCuaMon(doc.mon, doc.nhanh).cauTbl)
      const varByMa = new Map(varCaus.map((c) => [c.ma_cau, c]))
      for (let tt = 1; tt <= caus.length; tt++) {
        const baseMaCau = maCauByThuTu.get(tt)
        const variants = baseMaCau ? ch.etMaDe?.[baseMaCau] : null
        if (!variants) continue
        for (let v = 0; v < 2; v++) {
          const maCauV = variants[v]
          const cauV = maCauV ? varByMa.get(maCauV) : null
          // Thiếu câu biến thể (hiếm — dữ liệu made.ts lệch) → BỎ RIÊNG mã đề đó ở vị trí này, KHÔNG
          // chặn cả lượt phát hành: HS lỡ bị gán mã 2/3 sẽ thấy thiếu câu (rõ ràng hơn phát hành sai lặng lẽ).
          if (!cauV) { skipped.push({ ma_cau: maCauV ?? `(vị trí ${tt})`, warn: `thiếu câu mã đề ${v + 2}` }); continue }
          const { row, warn } = snap(cauV, tt, v + 2)
          if (warn) skipped.push(warn)
          if (row) rows.push(row)
        }
      }
    }
  }

  // Hạn nộp tính Ở POSTGRES (mig 202608171359 — luật theo loại, giờ VN, đọc thoi_khoa_bieu).
  // NULL hợp lệ cho de_thi; NULL cho btvn = KHÔNG tìm ra buổi kế ⇒ phải báo người, đừng đoán.
  const { data: hanNop, error: eH } = await supabase.rpc('han_nop_bai_test',
    { p_lop: lopId, p_ngay: ngay, p_loai: map.testLoai })
  if (eH) throw eH
  const deadline = (hanNop as string | null) ?? null

  const { data: bt, error: e1 } = await supabase.from('bai_test').insert({
    nguon_tai_lieu_id: doc.id, lop_id: lopId, ngay, loai: map.testLoai, mon: doc.mon, so_cau: rows.length,
    deadline,
  }).select().single()
  if (e1) throw e1
  const baiTest = bt as BaiTest
  const { error: e2 } = await supabase.from('bai_test_cau').insert(rows.map((r) => ({ ...r, bai_test_id: baiTest.id })))
  if (e2) throw e2
  // Cảnh báo (không chặn): btvn không có hạn ⇒ bài mở vĩnh viễn, staff cần biết để xử tay.
  const canhBao = !deadline && map.testLoai === 'btvn'
    ? 'Không tính được hạn nộp: lớp chưa có thời khoá biểu hiệu lực nên không xác định được buổi kế tiếp. Bài sẽ KHÔNG tự hết hạn.'
    : null
  return { baiTest, added: rows.length, skipped, canhBao }
}
/** @deprecated dùng phatHanhTest */
export const phatHanhBTVN = phatHanhTest

export async function xoaBaiTest(id: string): Promise<void> {
  const { error } = await supabase.from('bai_test').delete().eq('id', id) // cascade cau/lam
  if (error) throw error
}

// ── HS-FACING ───────────────────────────────────────────────────────────────
export async function getMyHocSinhId(): Promise<string | null> {
  const { data, error } = await supabase.rpc('my_hoc_sinh_id')
  if (error) throw error
  return (data as string | null) ?? null
}

export type BaiTestCuaHS = BaiTest & { lop_ten: string; bai_lam: BaiLam | null; so_cau: number }

// List test của các lớp HS đang ghi danh (RLS bai_test_hs_read tự lọc) + trạng thái bài làm.
export async function listBaiTestCuaHS(): Promise<BaiTestCuaHS[]> {
  const { data, error } = await supabase.from('bai_test')
    .select('*, lop:lop_id(ten_lop)')
    .eq('trang_thai', 'mo').order('ngay', { ascending: false }).limit(LIMIT)
  if (error) throw error
  const tests = (data ?? []) as (BaiTest & { lop: { ten_lop: string } | null })[]
  if (!tests.length) return []
  const ids = tests.map((t) => t.id)
  const { data: lams } = await supabase.from('bai_lam').select('*').in('bai_test_id', ids).limit(LIMIT)
  const lamMap = new Map((lams ?? []).map((l: any) => [l.bai_test_id, l as BaiLam]))
  // so_cau denormalize trên bai_test (HS ko đếm được bai_test_cau của ET do RLS).
  return tests.map((t) => ({ ...t, lop_ten: t.lop?.ten_lop ?? '?', bai_lam: lamMap.get(t.id) ?? null }))
}

export type BaiTestFull = { baiTest: BaiTest; caus: BaiTestCau[]; baiLam: BaiLam | null; daLam: Record<string, BaiLamCau> }

export async function getBaiTestFull(baiTestId: string): Promise<BaiTestFull> {
  const { data: bt, error } = await supabase.from('bai_test').select('*').eq('id', baiTestId).single()
  if (error) throw error
  const { data: caus } = await supabase.from('bai_test_cau').select('*').eq('bai_test_id', baiTestId).order('thu_tu').limit(LIMIT)
  const { data: lams } = await supabase.from('bai_lam').select('*').eq('bai_test_id', baiTestId).order('bat_dau_at', { ascending: false }).limit(1)
  const baiLam = ((lams as BaiLam[])?.[0]) ?? null
  let daLam: Record<string, BaiLamCau> = {}
  if (baiLam) {
    const { data: blc } = await supabase.from('bai_lam_cau').select('*').eq('bai_lam_id', baiLam.id).limit(LIMIT)
    for (const r of (blc ?? []) as BaiLamCau[]) daLam[r.bai_test_cau_id] = r
  }
  return { baiTest: bt as BaiTest, caus: (caus ?? []) as BaiTestCau[], baiLam, daLam }
}

export async function getBaiTestCaus(baiTestId: string): Promise<BaiTestCau[]> {
  const { data, error } = await supabase.from('bai_test_cau').select('*').eq('bai_test_id', baiTestId).order('thu_tu').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as BaiTestCau[]
}

// ── XEM LIVE (staff, buổi học) — giáo trình online CHỈ (reveal-ngay nên verdict có NGAY lúc HS trả
// lời, không cần chấm-ngầm như ET). Poll định kỳ 5-10s đủ dùng (Thùy 07-07: "dùng được ngay trên lớp
// thôi", không cần realtime). ────────────────────────────────────────────────────────────────────
export type LiveAnswer = { hocSinhId: string; baiTestCauId: string; verdict: string | null; xemGoiY: boolean }
export type LiveSnapshot = { baiLam: Record<string, BaiLam>; answers: LiveAnswer[] } // baiLam keyed theo hoc_sinh_id

export async function getLiveSnapshot(baiTestId: string): Promise<LiveSnapshot> {
  const { data: lams, error } = await supabase.from('bai_lam').select('*').eq('bai_test_id', baiTestId).limit(LIMIT)
  if (error) throw error
  const baiLam: Record<string, BaiLam> = {}
  for (const l of (lams ?? []) as BaiLam[]) baiLam[l.hoc_sinh_id] = l
  const lamIds = (lams ?? []).map((l: any) => l.id)
  if (!lamIds.length) return { baiLam, answers: [] }
  const lamToHs = new Map((lams ?? []).map((l: any) => [l.id, l.hoc_sinh_id as string]))
  const [{ data: caus, error: e2 }, { data: goiY, error: e3 }] = await Promise.all([
    supabase.from('bai_lam_cau').select('bai_lam_id, bai_test_cau_id, verdict').in('bai_lam_id', lamIds).limit(LIMIT),
    supabase.from('bai_lam_goi_y').select('bai_lam_id, bai_test_cau_id').in('bai_lam_id', lamIds).limit(LIMIT),
  ])
  if (e2) throw e2
  if (e3) throw e3
  const goiYSet = new Set(((goiY ?? []) as any[]).map((g) => `${g.bai_lam_id}:${g.bai_test_cau_id}`))
  const answers: LiveAnswer[] = ((caus ?? []) as any[]).map((c) => ({
    hocSinhId: lamToHs.get(c.bai_lam_id)!, baiTestCauId: c.bai_test_cau_id, verdict: c.verdict,
    xemGoiY: goiYSet.has(`${c.bai_lam_id}:${c.bai_test_cau_id}`),
  }))
  return { baiLam, answers }
}

// HS mở bài → tạo SLOT bai_lam (idempotent — StrictMode/đua). Cần hoc_sinh_id (RLS chặn HS khác).
export async function moBaiLam(baiTestId: string, hocSinhId: string): Promise<BaiLam> {
  // Mã đề (1/2/3, ET có gán riêng HS chống liếc) — ĐÔNG CỨNG lúc mở lần đầu (upsert ignoreDuplicates
  // dưới không đè bản đã có). RPC vì `tai_lieu` staff-only (HS SELECT thẳng → 0 dòng, không lỗi —
  // đã verify; đọc thẳng client sẽ luôn ra mặc định 1 mà không ai biết là RLS chặn, không phải "chưa gán").
  const { data: bienThe } = await supabase.rpc('resolve_bien_the', { p_bai_test: baiTestId })
  const { error } = await supabase.from('bai_lam')
    .upsert({ bai_test_id: baiTestId, hoc_sinh_id: hocSinhId, bien_the: bienThe ?? 1 }, { onConflict: 'bai_test_id,hoc_sinh_id', ignoreDuplicates: true })
  if (error) throw error
  const { data, error: e2 } = await supabase.from('bai_lam').select('*').eq('bai_test_id', baiTestId).eq('hoc_sinh_id', hocSinhId).single()
  if (e2) throw e2
  return data as BaiLam
}

export type ChamKetQua = { verdict: string; cham_boi: string; key: unknown; baiLamCauId: string }

// HS xác nhận 1 câu → auto-chấm exact + lưu (upsert). BTVN reveal ngay → trả cả key + id (để báo sai).
// TLN sai theo key → tầng CACHE (đáp án người-đã-duyệt, rpc — HS không SELECT được bảng cache).
export async function traLoiCau(baiLamId: string, cau: BaiTestCau, dapAnHs: unknown): Promise<ChamKetQua> {
  let g: { verdict: string; cham_boi: string } = cau.loai_cau === 'trac_nghiem'
    ? gradeTracNghiem(dapAnHs as number, cau.dap_an_key as string)
    : cau.loai_cau === 'dung_sai'
      ? gradeDungSai(dapAnHs as string[], cau.dap_an_key as string[])
      : gradeTraLoiNgan(dapAnHs as string, cau.dap_an_key as string)
  if (cau.loai_cau === 'tra_loi_ngan' && g.verdict === 'wrong' && cau.ma_cau) {
    const { data: hit } = await supabase.rpc('tln_cache_check', { p_ma_cau: cau.ma_cau, p_norm: smartNormalize(dapAnHs as string) })
    if (hit === true) g = { verdict: 'correct', cham_boi: 'cache' }
  }
  // dung_sai: lưu điểm thô THPT (0/0.1/0.25/0.5/1); loại khác: theo verdict × trọng số câu.
  const diem = 'diemTho' in g ? (g as any).diemTho * cau.diem
    : g.verdict === 'correct' ? cau.diem : g.verdict === 'partial' ? cau.diem * 0.5 : 0
  const { data, error } = await supabase.from('bai_lam_cau').upsert({
    bai_lam_id: baiLamId, bai_test_cau_id: cau.id, dap_an_hs: dapAnHs as any,
    verdict: g.verdict, diem, cham_boi: g.cham_boi, cham_at: new Date().toISOString(),
  }, { onConflict: 'bai_lam_id,bai_test_cau_id' }).select('id').single()
  if (error) throw error
  return { verdict: g.verdict, cham_boi: g.cham_boi, key: cau.dap_an_key, baiLamCauId: (data as { id: string }).id }
}

// ── ET chế độ THI (giấu key) ─────────────────────────────────────────────────
// Đề ET đã LỌC key (rpc security-definer). Câu: id/thu_tu/loai_cau/noi_dung/lua_chon/menh_de(chỉ noi_dung)/ma_dang/ly_thuyet/diem.
export type ETCauDe = { id: string; thu_tu: number; loai_cau: string; noi_dung: string | null; lua_chon: string[] | null; anh_de: string | null; menh_de: { noi_dung: string }[] | null; ma_dang: string | null; ly_thuyet: string | null; diem: number }
export async function getETDe(baiTestId: string): Promise<ETCauDe[]> {
  const { data, error } = await supabase.rpc('et_de', { p_bai_test: baiTestId })
  if (error) throw error
  return (data as ETCauDe[]) ?? []
}
// HS lưu đáp án ET (KHÔNG chấm — verdict để server làm lúc nộp). Sửa được tới khi nộp.
export async function luuDapAnET(baiLamId: string, baiTestCauId: string, dapAnHs: unknown): Promise<void> {
  const { error } = await supabase.from('bai_lam_cau').upsert(
    { bai_lam_id: baiLamId, bai_test_cau_id: baiTestCauId, dap_an_hs: dapAnHs as any, cham_at: new Date().toISOString() },
    { onConflict: 'bai_lam_id,bai_test_cau_id' })
  if (error) throw error
}
// Đáp án ET HS đã lưu (khôi phục khi mở lại bài đang làm).
export async function getETDapAnDaLuu(baiLamId: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.from('bai_lam_cau').select('bai_test_cau_id, dap_an_hs').eq('bai_lam_id', baiLamId).limit(LIMIT)
  if (error) throw error
  const m: Record<string, unknown> = {}
  for (const r of (data ?? []) as { bai_test_cau_id: string; dap_an_hs: unknown }[]) m[r.bai_test_cau_id] = r.dap_an_hs
  return m
}
export type ETReveal = { bai_test_cau_id: string; verdict: string | null; dap_an_key: unknown; loi_giai: string | null; anh_dap_an: string | null; menh_de: unknown }
// Nộp ET → server chấm (đọc key) + đông cứng + trả reveal (key/lời giải/verdict). Idempotent claim.
export async function nopET(baiLamId: string): Promise<ETReveal[]> {
  const { data, error } = await supabase.rpc('et_nop', { p_bai_lam: baiLamId })
  if (error) throw error
  return (data as ETReveal[]) ?? []
}

// HS báo sai (chủ yếu tra_loi_ngan wrong mà HS tin mình đúng) — spec §7.
export async function baoSai(baiLamCauId: string, hocSinhId: string, yKien: string): Promise<void> {
  const { error } = await supabase.from('bai_test_report').insert({ bai_lam_cau_id: baiLamCauId, hoc_sinh_id: hocSinhId, y_kien: yKien })
  if (error) throw error
}

// HS nộp (ET nộp-1-lần khoá; BTVN không bắt buộc). Claim atomic (spec §10).
export async function nopBai(baiLamId: string): Promise<boolean> {
  const { data, error } = await supabase.from('bai_lam')
    .update({ trang_thai: 'da_nop', nop_at: new Date().toISOString() })
    .eq('id', baiLamId).eq('trang_thai', 'dang_lam').select('id')
  if (error) throw error
  return ((data as unknown[])?.length ?? 0) > 0
}

// Nhãn chữ cái A/B/C/D cho vị trí lựa chọn (UI + kho mất nhãn "A." ở phần tử [0]).
export function chuCaiChon(i: number): string { return LETTERS[i] ?? String(i + 1) }
// Chiều ngược: chữ cái đáp án đúng (dap_an_key) → chỉ số GỐC trong lua_chon (để so với orig sau khi xáo hiển thị).
export function chiSoCuaChu(letter: unknown): number { return LETTERS.indexOf(String(letter ?? '').trim().toUpperCase()) }

// ══ REVIEW TRẢ LỜI NGẮN (staff) — spec §7: hệ chấm sai → người duyệt → đúng thì ══
// ══ thêm vào question_accepted_answers + BACKFILL mọi bài làm cùng câu+đáp án.  ══
export type TLNSaiRow = {
  blcId: string; dapAnHs: string; chamAt: string
  hocSinh: { id: string; ho_ten: string; ma_hs: string | null }
  test: { loai: string; ngay: string; lopTen: string }
  cau: { id: string; ma_cau: string | null; noi_dung: string | null; dapAnKey: string; loi_giai: string | null }
  reports: { id: string; y_kien: string | null; trang_thai: string }[]
}

// Mọi câu TLN đang verdict='wrong' (mọi test) + report của chúng (join client — bảng report nhỏ).
export async function listTLNSai(): Promise<TLNSaiRow[]> {
  const { data, error } = await supabase.from('bai_lam_cau')
    .select('id, dap_an_hs, cham_at, cau:bai_test_cau_id!inner(id, ma_cau, noi_dung, dap_an_key, loi_giai, loai_cau, test:bai_test_id(loai, ngay, lop:lop_id(ten_lop))), lam:bai_lam_id(hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs))')
    .eq('verdict', 'wrong').eq('cau.loai_cau', 'tra_loi_ngan')
    .order('cham_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as any[]
  const { data: reps } = await supabase.from('bai_test_report').select('id, bai_lam_cau_id, y_kien, trang_thai').limit(LIMIT)
  const repMap = new Map<string, { id: string; y_kien: string | null; trang_thai: string }[]>()
  for (const r of (reps ?? []) as any[]) {
    const arr = repMap.get(r.bai_lam_cau_id) ?? []
    arr.push({ id: r.id, y_kien: r.y_kien, trang_thai: r.trang_thai })
    repMap.set(r.bai_lam_cau_id, arr)
  }
  return rows.map((r) => ({
    blcId: r.id, dapAnHs: String(r.dap_an_hs ?? ''), chamAt: r.cham_at,
    hocSinh: { id: r.lam?.hoc_sinh?.id, ho_ten: r.lam?.hoc_sinh?.ho_ten ?? '?', ma_hs: r.lam?.hoc_sinh?.ma_hs ?? null },
    test: { loai: r.cau?.test?.loai ?? '?', ngay: r.cau?.test?.ngay ?? '', lopTen: r.cau?.test?.lop?.ten_lop ?? '?' },
    cau: { id: r.cau?.id, ma_cau: r.cau?.ma_cau ?? null, noi_dung: r.cau?.noi_dung ?? null, dapAnKey: String(r.cau?.dap_an_key ?? ''), loi_giai: r.cau?.loi_giai ?? null },
    reports: repMap.get(r.id) ?? [],
  }))
}

// Đáp án đã được duyệt chấp nhận của 1 loạt câu (hiện chip trên màn review).
export async function listAcceptedAnswers(maCaus: string[]): Promise<Map<string, string[]>> {
  const out = new Map<string, string[]>()
  if (!maCaus.length) return out
  const { data } = await supabase.from('question_accepted_answers').select('ma_cau, answer_raw, answer_normalized').in('ma_cau', maCaus).limit(LIMIT)
  for (const r of (data ?? []) as any[]) {
    const arr = out.get(r.ma_cau) ?? []
    arr.push(r.answer_raw || r.answer_normalized)
    out.set(r.ma_cau, arr)
  }
  return out
}

// TA duyệt "HS đúng": ① đáp án vào cache (lần sau auto đúng) ② BACKFILL mọi bai_lam_cau
// cùng ma_cau + cùng đáp-án-chuẩn-hoá đang wrong → correct (cham_boi='manual', diem theo câu)
// ③ resolve report 'moi' của các dòng đó → 'dung'. Trả số bài đã sửa.
// Mastery đọc bai_lam_cau LIVE (suy động) → tự đúng theo, không phải sync gì thêm.
export async function chapNhanDapAn(maCau: string, dapAnRaw: string): Promise<{ backfilled: number }> {
  const norm = smartNormalize(dapAnRaw)
  if (!norm) throw new Error('Đáp án rỗng sau chuẩn hoá — không chấp nhận được.')
  // ① cache (idempotent — unique ma_cau+answer_normalized)
  const { error: e1 } = await supabase.from('question_accepted_answers')
    .upsert({ ma_cau: maCau, answer_normalized: norm, answer_raw: dapAnRaw, source: 'manual' },
      { onConflict: 'ma_cau,answer_normalized', ignoreDuplicates: true })
  if (e1) throw e1
  // ② backfill: mọi dòng wrong cùng câu → lọc client theo normalize (smartNormalize là JS, DB không có)
  const { data: wrongs, error: e2 } = await supabase.from('bai_lam_cau')
    .select('id, dap_an_hs, cau:bai_test_cau_id!inner(ma_cau, diem)')
    .eq('verdict', 'wrong').eq('cau.ma_cau', maCau).limit(LIMIT)
  if (e2) throw e2
  const targets = ((wrongs ?? []) as any[]).filter((r) => smartNormalize(String(r.dap_an_hs ?? '')) === norm)
  if (!targets.length) return { backfilled: 0 }
  // update theo nhóm diem (thường đồng nhất =1) — verdict correct, đường 'manual' (người duyệt)
  const byDiem = new Map<number, string[]>()
  for (const t of targets) {
    const d = Number(t.cau?.diem ?? 1)
    const arr = byDiem.get(d) ?? []; arr.push(t.id); byDiem.set(d, arr)
  }
  for (const [d, ids] of byDiem) {
    const { error } = await supabase.from('bai_lam_cau')
      .update({ verdict: 'correct', diem: d, cham_boi: 'manual', cham_at: new Date().toISOString() })
      .in('id', ids)
    if (error) throw error
  }
  // ③ resolve report của các dòng vừa sửa
  const uid = (await supabase.auth.getUser()).data.user?.id ?? null
  await supabase.from('bai_test_report')
    .update({ trang_thai: 'dung', duyet_boi: uid, duyet_at: new Date().toISOString() })
    .in('bai_lam_cau_id', targets.map((t) => t.id)).eq('trang_thai', 'moi')
  return { backfilled: targets.length }
}

// ══ SỬA KEY SAI + CHẤM LẠI CẢ LỚP (spec §7) ═══════════════════════════════════
// KHÁC hẳn luồng accepted-answer ở trên. Trên kia = "key ĐÚNG, HS viết cách khác cũng
// đúng" → nới bộ đáp án. Dưới này = "KEY SAI" → cả lớp bị chấm oan, phải sửa key rồi
// chấm lại. Hai đường không được trộn: nhét đáp án đúng vào cache khi key sai thì kho
// vẫn sai và lần phát hành sau lại sai tiếp.

export type CauNghiSaiKey = {
  cauId: string; baiTestId: string; thuTu: number; loaiCau: string
  maCau: string | null; noiDung: string | null; dapAnKey: unknown
  test: { loai: string; ngay: string; lopTen: string; mon: string }
  daTraLoi: number; sai: number; tiLeSai: number
  lanChamLai: number
}

// Câu mà TỈ LỆ SAI CAO — dấu hiệu key sai (cả lớp cùng sai 1 câu thì nghi key trước, nghi HS sau).
// Ngưỡng mặc định: ≥3 HS đã trả lời và ≥70% sai. Trả mọi loại câu (key sai không riêng TLN).
export async function listCauNghiSaiKey(nguongTiLe = 0.7, toiThieuHS = 3): Promise<CauNghiSaiKey[]> {
  const { data, error } = await supabase.from('bai_lam_cau')
    .select('verdict, cau:bai_test_cau_id!inner(id, bai_test_id, thu_tu, loai_cau, ma_cau, noi_dung, dap_an_key, test:bai_test_id(loai, ngay, mon, lop:lop_id(ten_lop)))')
    .not('verdict', 'is', null).limit(LIMIT)
  if (error) throw error
  const byCau = new Map<string, CauNghiSaiKey>()
  for (const r of (data ?? []) as any[]) {
    const c = r.cau
    if (!c) continue
    let g = byCau.get(c.id)
    if (!g) {
      g = {
        cauId: c.id, baiTestId: c.bai_test_id, thuTu: c.thu_tu, loaiCau: c.loai_cau,
        maCau: c.ma_cau ?? null, noiDung: c.noi_dung ?? null, dapAnKey: c.dap_an_key,
        test: { loai: c.test?.loai ?? '?', ngay: c.test?.ngay ?? '', lopTen: c.test?.lop?.ten_lop ?? '?', mon: c.test?.mon ?? '' },
        daTraLoi: 0, sai: 0, tiLeSai: 0, lanChamLai: 0,
      }
      byCau.set(c.id, g)
    }
    g.daTraLoi++
    if (r.verdict === 'wrong') g.sai++
  }
  const out = [...byCau.values()]
    .map((g) => ({ ...g, tiLeSai: g.daTraLoi ? g.sai / g.daTraLoi : 0 }))
    .filter((g) => g.daTraLoi >= toiThieuHS && g.tiLeSai >= nguongTiLe)
  if (!out.length) return []
  // Đã chấm lại lần nào chưa (hiện lên UI để không chấm lại chồng chéo mà không biết).
  const { data: logs } = await supabase.from('bai_test_cham_lai_log')
    .select('bai_test_cau_id').in('bai_test_cau_id', out.map((g) => g.cauId)).limit(LIMIT)
  for (const l of (logs ?? []) as any[]) {
    const g = out.find((x) => x.cauId === l.bai_test_cau_id)
    if (g) g.lanChamLai++
  }
  return out.sort((a, b) => b.tiLeSai - a.tiLeSai || b.daTraLoi - a.daTraLoi)
}

export type ChamLaiKetQua = { soBai: number; saiThanhDung: number; dungThanhSai: number; khongDoi: number }

// Sửa `dap_an_key` của 1 câu SNAPSHOT rồi chấm lại MỌI bài làm của ĐÚNG câu đó.
// Scope CỨNG theo bai_test_cau_id (spec §7) — không lan sang test khác dù cùng ma_cau:
// mỗi lần phát hành là một phép đo riêng, sửa nhầm sang test cũ là ghi đè điểm đã chốt.
// Mastery đọc bai_lam_cau LIVE ⇒ tự đúng theo, KHÔNG resync gì (et_nop không ghi gami_grades).
export async function suaKeyVaChamLai(baiTestCauId: string, keyMoi: unknown, lyDo: string): Promise<ChamLaiKetQua> {
  const { data: cauRow, error: e0 } = await supabase.from('bai_test_cau')
    .select('id, loai_cau, dap_an_key, diem, ma_cau').eq('id', baiTestCauId).single()
  if (e0) throw e0
  const cau = cauRow as { id: string; loai_cau: string; dap_an_key: unknown; diem: number; ma_cau: string | null }
  const keyCu = cau.dap_an_key

  const { data: blcRows, error: e1 } = await supabase.from('bai_lam_cau')
    .select('id, dap_an_hs, verdict').eq('bai_test_cau_id', baiTestCauId).limit(LIMIT)
  if (e1) throw e1
  const rows = (blcRows ?? []) as { id: string; dap_an_hs: unknown; verdict: string | null }[]

  // ① Ghi key mới TRƯỚC — nếu bước chấm lại chết giữa chừng thì key vẫn đúng cho lần sau,
  //    và log ở ③ sẽ không có ⇒ nhìn là biết "đã sửa key nhưng chưa chấm lại xong".
  const { error: e2 } = await supabase.from('bai_test_cau').update({ dap_an_key: keyMoi as any }).eq('id', baiTestCauId)
  if (e2) throw e2

  // ② Chấm lại từng bài bằng ĐÚNG engine thuần đang dùng lúc HS làm (không chép lại công thức).
  const kq: ChamLaiKetQua = { soBai: rows.length, saiThanhDung: 0, dungThanhSai: 0, khongDoi: 0 }
  for (const r of rows) {
    let g: { verdict: string; cham_boi: string; diemTho?: number } = cau.loai_cau === 'trac_nghiem'
      ? gradeTracNghiem(r.dap_an_hs as number, keyMoi as string)
      : cau.loai_cau === 'dung_sai'
        ? gradeDungSai(r.dap_an_hs as string[], keyMoi as string[])
        : gradeTraLoiNgan(r.dap_an_hs as string, keyMoi as string)
    if (cau.loai_cau === 'tra_loi_ngan' && g.verdict === 'wrong' && cau.ma_cau) {
      const { data: hit } = await supabase.rpc('tln_cache_check', { p_ma_cau: cau.ma_cau, p_norm: smartNormalize(r.dap_an_hs as string) })
      if (hit === true) g = { verdict: 'correct', cham_boi: 'cache' }
    }
    const diem = g.diemTho != null ? g.diemTho * cau.diem
      : g.verdict === 'correct' ? cau.diem : g.verdict === 'partial' ? cau.diem * 0.5 : 0
    const { error } = await supabase.from('bai_lam_cau')
      .update({ verdict: g.verdict, diem, cham_boi: g.cham_boi, cham_at: new Date().toISOString() })
      .eq('id', r.id)
    if (error) throw error
    const cuDung = r.verdict === 'correct'
    const moiDung = g.verdict === 'correct'
    if (!cuDung && moiDung) kq.saiThanhDung++
    else if (cuDung && !moiDung) kq.dungThanhSai++
    else kq.khongDoi++
  }

  // ③ Vết (spec §7 — "in before/after + log")
  const uid = (await supabase.auth.getUser()).data.user?.id ?? null
  const { error: e3 } = await supabase.from('bai_test_cham_lai_log').insert({
    bai_test_cau_id: baiTestCauId, key_cu: keyCu as any, key_moi: keyMoi as any,
    so_bai: kq.soBai, sai_thanh_dung: kq.saiThanhDung, dung_thanh_sai: kq.dungThanhSai,
    ly_do: lyDo || null, nguoi: uid,
  })
  if (e3) throw e3
  return kq
}

// TA giữ nguyên "HS sai" cho các report của 1 đáp án (đóng 🚩, verdict giữ wrong).
export async function tuChoiReports(reportIds: string[]): Promise<void> {
  if (!reportIds.length) return
  const uid = (await supabase.auth.getUser()).data.user?.id ?? null
  const { error } = await supabase.from('bai_test_report')
    .update({ trang_thai: 'sai', duyet_boi: uid, duyet_at: new Date().toISOString() })
    .in('id', reportIds)
  if (error) throw error
}
