// ============================================================================
// testonline.ts — DATA-LAYER test online (seam: UI KHÔNG gọi supabase trực tiếp).
// Spec: spec-test-online.md. Slice 1 = BTVN + trac_nghiem/tra_loi_ngan.
// 3 tầng: KHO → bai_test (snapshot đề+key) → bai_lam (HS-facing) → đo lường.
// ============================================================================
import { supabase } from './supabase'
import { getBTVNCaus } from './tailieu'
import { extractKey, gradeTracNghiem, gradeTraLoiNgan, LETTERS } from '../gami/testgrade'

const LIMIT = 1000
const SUPPORTED = new Set(['trac_nghiem', 'tra_loi_ngan']) // slice 1

export type BaiTest = {
  id: string; nguon_tai_lieu_id: string | null; lop_id: string; ngay: string
  loai: 'et' | 'btvn'; mon: string; trang_thai: 'mo' | 'dong'
  deadline: string | null; khoa_reveal: boolean; created_at: string
}
export type BaiTestCau = {
  id: string; bai_test_id: string; thu_tu: number; ma_cau: string | null; loai_cau: string
  noi_dung: string | null; lua_chon: string[] | null; menh_de: unknown; dap_an_key: unknown
  loi_giai: string | null; anh_dap_an: string | null; diem: number
}
export type BaiLam = { id: string; bai_test_id: string; hoc_sinh_id: string; trang_thai: 'dang_lam' | 'da_nop'; nop_at: string | null }
export type BaiLamCau = { id: string; bai_lam_id: string; bai_test_cau_id: string; dap_an_hs: unknown; verdict: string | null; diem: number | null; cham_boi: string | null }

// ── PHÁT HÀNH (staff) — snapshot đề + key 1 lần, idempotent (spec §5.1) ──────
export async function getBaiTestByDoc(nguonTaiLieuId: string, lopId: string, ngay: string, loai: 'et' | 'btvn'): Promise<BaiTest | null> {
  const { data, error } = await supabase.from('bai_test').select('*')
    .eq('nguon_tai_lieu_id', nguonTaiLieuId).eq('lop_id', lopId).eq('ngay', ngay).eq('loai', loai)
    .order('created_at', { ascending: false }).limit(1)
  if (error) throw error
  return ((data as BaiTest[])?.[0]) ?? null
}

export type PhatHanhKetQua = { baiTest: BaiTest; added: number; skipped: { ma_cau: string; warn: string }[] }

// Phát hành 1 doc BTVN đã bám (lớp+ngày) thành test online. Chỉ snapshot câu trắc-nghiệm/trả-lời-ngắn.
export async function phatHanhBTVN(taiLieuId: string): Promise<PhatHanhKetQua> {
  const { data: tl, error: e0 } = await supabase.from('tai_lieu').select('id, lop_id, ngay, mon, loai').eq('id', taiLieuId).single()
  if (e0) throw e0
  const doc = tl as { id: string; lop_id: string | null; ngay: string | null; mon: string; loai: string }
  if (doc.loai !== 'btvn') throw new Error('Chỉ phát hành được doc BTVN ở slice này.')
  if (!doc.lop_id || !doc.ngay) throw new Error('Doc BTVN chưa bám lớp+ngày — không phát hành được.')

  const existed = await getBaiTestByDoc(doc.id, doc.lop_id, doc.ngay, 'btvn')
  if (existed) throw new Error('Doc này đã phát hành rồi (1 doc×lớp×ngày = 1 test). Xoá test cũ nếu muốn phát lại.')

  const caus = await getBTVNCaus(taiLieuId)
  const skipped: { ma_cau: string; warn: string }[] = []
  const rows: Omit<BaiTestCau, 'id'>[] = []
  let thu_tu = 0
  for (const c of caus) {
    if (!SUPPORTED.has(c.loai_cau)) { skipped.push({ ma_cau: c.ma_cau, warn: `loại "${c.loai_cau}" chưa hỗ trợ online` }); continue }
    const k = extractKey(c)
    if (!k.ok) { skipped.push({ ma_cau: c.ma_cau, warn: k.warn! }); continue }
    rows.push({
      bai_test_id: '', thu_tu: ++thu_tu, ma_cau: c.ma_cau, loai_cau: c.loai_cau,
      noi_dung: c.noi_dung ?? null, lua_chon: (c.lua_chon as string[] | null) ?? null,
      menh_de: c.menh_de ?? null, dap_an_key: k.key,
      loi_giai: c.loi_giai ?? null, anh_dap_an: c.anh_dap_an ?? null, diem: 1,
    })
  }
  if (!rows.length) throw new Error('Không có câu trắc nghiệm / trả lời ngắn hợp lệ để phát hành.' + (skipped.length ? ` (${skipped.length} câu bị bỏ qua)` : ''))

  const { data: bt, error: e1 } = await supabase.from('bai_test').insert({
    nguon_tai_lieu_id: doc.id, lop_id: doc.lop_id, ngay: doc.ngay, loai: 'btvn', mon: doc.mon,
  }).select().single()
  if (e1) throw e1
  const baiTest = bt as BaiTest
  const { error: e2 } = await supabase.from('bai_test_cau').insert(rows.map((r) => ({ ...r, bai_test_id: baiTest.id })))
  if (e2) throw e2
  return { baiTest, added: rows.length, skipped }
}

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
  const [{ data: lams }, { data: counts }] = await Promise.all([
    supabase.from('bai_lam').select('*').in('bai_test_id', ids).limit(LIMIT),
    supabase.from('bai_test_cau').select('bai_test_id').in('bai_test_id', ids).limit(LIMIT * 10),
  ])
  const lamMap = new Map((lams ?? []).map((l: any) => [l.bai_test_id, l as BaiLam]))
  const cntMap = new Map<string, number>()
  for (const c of (counts ?? []) as any[]) cntMap.set(c.bai_test_id, (cntMap.get(c.bai_test_id) ?? 0) + 1)
  return tests.map((t) => ({ ...t, lop_ten: t.lop?.ten_lop ?? '?', bai_lam: lamMap.get(t.id) ?? null, so_cau: cntMap.get(t.id) ?? 0 }))
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

// HS mở bài → tạo SLOT bai_lam (idempotent — StrictMode/đua). Cần hoc_sinh_id (RLS chặn HS khác).
export async function moBaiLam(baiTestId: string, hocSinhId: string): Promise<BaiLam> {
  const { error } = await supabase.from('bai_lam')
    .upsert({ bai_test_id: baiTestId, hoc_sinh_id: hocSinhId }, { onConflict: 'bai_test_id,hoc_sinh_id', ignoreDuplicates: true })
  if (error) throw error
  const { data, error: e2 } = await supabase.from('bai_lam').select('*').eq('bai_test_id', baiTestId).eq('hoc_sinh_id', hocSinhId).single()
  if (e2) throw e2
  return data as BaiLam
}

export type ChamKetQua = { verdict: string; cham_boi: string; key: unknown; baiLamCauId: string }

// HS xác nhận 1 câu → auto-chấm exact + lưu (upsert). BTVN reveal ngay → trả cả key + id (để báo sai).
export async function traLoiCau(baiLamId: string, cau: BaiTestCau, dapAnHs: unknown): Promise<ChamKetQua> {
  const g = cau.loai_cau === 'trac_nghiem'
    ? gradeTracNghiem(dapAnHs as number, cau.dap_an_key as string)
    : gradeTraLoiNgan(dapAnHs as string, cau.dap_an_key as string)
  const diem = g.verdict === 'correct' ? cau.diem : g.verdict === 'partial' ? cau.diem * 0.5 : 0
  const { data, error } = await supabase.from('bai_lam_cau').upsert({
    bai_lam_id: baiLamId, bai_test_cau_id: cau.id, dap_an_hs: dapAnHs as any,
    verdict: g.verdict, diem, cham_boi: g.cham_boi, cham_at: new Date().toISOString(),
  }, { onConflict: 'bai_lam_id,bai_test_cau_id' }).select('id').single()
  if (error) throw error
  return { verdict: g.verdict, cham_boi: g.cham_boi, key: cau.dap_an_key, baiLamCauId: (data as { id: string }).id }
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
