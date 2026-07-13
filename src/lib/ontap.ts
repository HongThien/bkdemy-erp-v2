// ============================================================================
// ontap.ts — ENGINE GỢI Ý + CRUD config khối "Ôn TẬP" trong BTVN (spec-btvn-ontap.md,
// Thùy chốt 07-13). Seam: UI không gọi supabase trực tiếp.
// Tầng LỚP (chống quên cho cả lớp — chữa yếu cá nhân là pipeline bổ trợ yếu, KHÔNG ở đây).
// Cap CỐ ĐỊNH đợt này: 2 câu/phiếu thuộc 2 dạng (1 câu/dạng).
// ============================================================================
import { supabase } from './supabase'
import { loadMasteryCells } from './mastery'
import type { CauHoi } from './kho/api'
import { khoCuaMon, cauUsage } from './tailieu'

const LIMIT = 10000

// ── Config (bảng btvn_ontap_config, mig 0100) — sống sót re-trích (trichXuatBuoi xoá-rồi-tạo doc) ──
export type OnTapDangConfig = { ma_dang: string; cau_ids: string[]; linesByCau?: Record<string, number> }
export type OnTapConfig = { dangs: OnTapDangConfig[]; skipped?: boolean }

export async function getOnTapConfig(nguonId: string, nguonBuoi: string, lopId: string): Promise<OnTapConfig | null> {
  const { data, error } = await supabase.from('btvn_ontap_config').select('config')
    .eq('nguon_id', nguonId).eq('nguon_buoi', nguonBuoi).eq('lop_id', lopId).limit(1)
  if (error) throw error
  return ((data as any[])?.[0]?.config as OnTapConfig) ?? null
}
export async function saveOnTapConfig(nguonId: string, nguonBuoi: string, lopId: string, config: OnTapConfig): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('btvn_ontap_config').upsert(
    { nguon_id: nguonId, nguon_buoi: nguonBuoi, lop_id: lopId, config, updated_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'nguon_id,nguon_buoi,lop_id' })
  if (error) throw error
}

// ── Dựng khối ôn tập vào doc BTVN (gọi SAU trichXuatBuoi ở TrichPanel, và ở modal ✎ rebuild) ──
// Đặt ở đây (không nhét vào trichXuatBuoi) vì tailieu.ts ← ontap.ts đã import 1 chiều — nhét vào
// tailieu.ts sẽ tạo vòng import. Mọi đường sinh/sửa doc BTVN đều đi qua TrichPanel/modal nên tương đương.
// Idempotent: XOÁ phan 'ontap' cũ của doc rồi dựng lại từ config (config là nguồn sự thật).
// Trả về mã câu CHẾT (đã bị xoá khỏi kho) để UI toast — câu chết bị bỏ, không chặn cả khối.
export async function appendOnTapVaoBTVN(docId: string): Promise<{ added: number; missing: string[] }> {
  const { data: doc, error: eDoc } = await supabase.from('tai_lieu').select('mon, nguon_id, nguon_buoi, lop_id, cau_hinh').eq('id', docId).single()
  if (eDoc) throw eDoc
  const d = doc as any
  if (!d.nguon_id || !d.nguon_buoi || !d.lop_id) return { added: 0, missing: [] }
  const config = await getOnTapConfig(d.nguon_id, d.nguon_buoi, d.lop_id)
  // dọn phan ontap cũ (rebuild) — tai_lieu_cau cascade theo phan
  const { data: oldPhans } = await supabase.from('tai_lieu_phan').select('id').eq('tai_lieu_id', docId).eq('loai_phan', 'ontap').limit(LIMIT)
  const oldIds = ((oldPhans ?? []) as any[]).map((p) => p.id)
  if (oldIds.length) await supabase.from('tai_lieu_phan').delete().in('id', oldIds)
  if (!config || config.skipped || !config.dangs?.length) return { added: 0, missing: [] }

  const K = khoCuaMon(d.mon)
  const allIds = config.dangs.flatMap((x) => x.cau_ids)
  if (!allIds.length) return { added: 0, missing: [] }
  // revalidate: câu còn tồn tại trong kho không (câu bị xoá/đổi mã sau khi GV cấu hình)
  const { data: song } = await supabase.from(K.cauTbl).select('ma_cau').in('ma_cau', allIds).limit(LIMIT)
  const songSet = new Set(((song ?? []) as any[]).map((r) => r.ma_cau))
  const missing = allIds.filter((id) => !songSet.has(id))
  // tên dạng cho tiêu đề phan (PrintView hiện tên dạng của khối)
  const maDangs = config.dangs.map((x) => x.ma_dang)
  const { data: bd } = await supabase.from(K.banDoTbl).select('ma_dang, ten_dang').in('ma_dang', maDangs).limit(LIMIT)
  const tenDang = new Map(((bd ?? []) as any[]).map((r) => [r.ma_dang, r.ten_dang]))

  const { data: maxRow } = await supabase.from('tai_lieu_phan').select('thu_tu').eq('tai_lieu_id', docId).order('thu_tu', { ascending: false }).limit(1)
  let thuTu = (((maxRow ?? []) as any[])[0]?.thu_tu ?? -1) + 1
  let added = 0
  const linesMerge: Record<string, number> = {}
  for (const dang of config.dangs) {
    const causSong = dang.cau_ids.filter((id) => songSet.has(id))
    if (!causSong.length) continue
    const { data: phan, error: ePhan } = await supabase.from('tai_lieu_phan')
      .insert({ tai_lieu_id: docId, thu_tu: thuTu++, loai_phan: 'ontap', ref_ma: dang.ma_dang, tieu_de: tenDang.get(dang.ma_dang) ?? dang.ma_dang, noi_dung: null })
      .select('id').single()
    if (ePhan) throw ePhan
    const rows = causSong.map((ma_cau, i) => ({ phan_id: (phan as any).id, ma_cau, thu_tu: i }))
    const { error: eCau } = await supabase.from('tai_lieu_cau').insert(rows)
    if (eCau) throw eCau
    added += rows.length
    for (const [ma, n] of Object.entries(dang.linesByCau ?? {})) if (songSet.has(ma)) linesMerge[ma] = n
  }
  if (Object.keys(linesMerge).length) {
    const ch = (d.cau_hinh ?? {}) as Record<string, unknown>
    const cur = (ch.btvnLinesByCau ?? {}) as Record<string, number>
    await supabase.from('tai_lieu').update({ cau_hinh: { ...ch, btvnLinesByCau: { ...cur, ...linesMerge } } }).eq('id', docId)
  }
  return { added, missing }
}

// ── Engine gợi ý ─────────────────────────────────────────────────────────────
export type GoiYOnTap = {
  ma_dang: string; ten_dang: string
  score: number       // (yếu×1 + cần_luyện×0.5) / đã_đo
  daDo: number; siSo: number
  ngayHoc: string     // ngày gần nhất LỚP học dạng này (max ngay của giao_trinh_buoi chứa dạng)
  uuTien: 1 | 2       // cửa sổ 0–21 / 22–42 ngày (Thùy 07-13)
  cau: CauHoi | null  // 1 câu đề xuất (ưu tiên tự luận, né trùng, least-used) — null = pool cạn
}

const truNgay = (iso: string, n: number) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d - n)).toISOString().slice(0, 10)
}

// Gợi ý ≤2 dạng ôn tập cho (buổi master đang gán → lớp, ngày gán).
// Bước 1 ứng viên: dạng lớp ĐÃ HỌC (doc giao_trinh_buoi của lớp) trong cửa sổ 42 ngày, LOẠI dạng
// thuộc chính buổi đang gán. Bước 2: đủ tin khi ≥80% sĩ số đã đo. Bước 3: cửa sổ ưu tiên 1 (0–21
// ngày) trước, trong cửa sổ xếp theo score yếu giảm dần. Bước 4: 1 câu/dạng (tự luận trước, né câu
// buổi này + câu lớp gặp trong 60 ngày, least-used).
export async function goiYOnTap(nguonId: string, buoiPhanId: string, lopId: string, mon: string, ngayGan: string): Promise<GoiYOnTap[]> {
  // dạng thuộc CHÍNH buổi đang gán (khối dang + btvn trong master) — luật cứng: không ôn cái vừa học
  const { data: masterPhans } = await supabase.from('tai_lieu_phan').select('id, loai_phan, ref_ma, thu_tu').eq('tai_lieu_id', nguonId).order('thu_tu').limit(LIMIT)
  const phans = (masterPhans ?? []) as { id: string; loai_phan: string; ref_ma: string | null; thu_tu: number }[]
  const i = phans.findIndex((p) => p.id === buoiPhanId)
  const dangBuoiNay = new Set<string>()
  const phanIdsBuoiNay: string[] = []
  if (i >= 0) for (let j = i + 1; j < phans.length && phans[j].loai_phan !== 'buoi'; j++) {
    if (phans[j].ref_ma) dangBuoiNay.add(phans[j].ref_ma!)
    phanIdsBuoiNay.push(phans[j].id)
  }

  // lịch sử lớp học dạng nào ngày nào — từ doc giao_trinh_buoi CỦA LỚP trong 42 ngày (ngày học thật)
  const cut42 = truNgay(ngayGan, 42)
  const { data: docs } = await supabase.from('tai_lieu').select('id, ngay').eq('lop_id', lopId).eq('loai', 'giao_trinh_buoi')
    .gte('ngay', cut42).lt('ngay', ngayGan).limit(LIMIT)
  const docIds = (docs ?? []).map((d: any) => d.id)
  if (!docIds.length) return []
  const ngayOfDoc = new Map((docs ?? []).map((d: any) => [d.id, d.ngay as string]))
  const { data: dangPhans } = await supabase.from('tai_lieu_phan').select('tai_lieu_id, ref_ma').in('tai_lieu_id', docIds).eq('loai_phan', 'dang').not('ref_ma', 'is', null).limit(LIMIT)
  const ngayHocByDang = new Map<string, string>() // ma_dang -> max ngay
  for (const p of (dangPhans ?? []) as any[]) {
    const ngay = ngayOfDoc.get(p.tai_lieu_id); if (!ngay) continue
    if (dangBuoiNay.has(p.ref_ma)) continue
    const cur = ngayHocByDang.get(p.ref_ma)
    if (!cur || ngay > cur) ngayHocByDang.set(p.ref_ma, ngay)
  }
  if (!ngayHocByDang.size) return []

  // mastery rollup cả lớp (tái dùng loadMasteryCells — KHÔNG viết lại pivot)
  const cells = await loadMasteryCells({ mon, lopId })
  const siSo = cells.hsIds.length
  if (!siSo) return []
  const nguongDo = Math.ceil(0.8 * siSo) // Thùy 07-13: 80% số bạn đã làm mới tính
  const cut21 = truNgay(ngayGan, 21)

  const ungVien: Omit<GoiYOnTap, 'cau'>[] = []
  for (const [maDang, ngayHoc] of ngayHocByDang) {
    let daDo = 0, yeu = 0, canLuyen = 0
    for (const hsId of cells.hsIds) {
      const m = cells.byHS.get(hsId)?.get(maDang)
      if (!m) continue
      daDo++
      if (m.muc === 'yeu') yeu++
      else if (m.muc === 'can_luyen') canLuyen++
    }
    if (daDo < nguongDo) continue
    ungVien.push({
      ma_dang: maDang, ten_dang: cells.dangInfo.get(maDang)?.ten_dang ?? maDang,
      score: (yeu * 1 + canLuyen * 0.5) / daDo, daDo, siSo, ngayHoc,
      uuTien: ngayHoc >= cut21 ? 1 : 2,
    })
  }
  // cửa sổ ưu tiên 1 trước; trong cửa sổ: yếu nhiều nhất trước (Thùy 07-13)
  ungVien.sort((a, b) => a.uuTien - b.uuTien || b.score - a.score)
  const top = ungVien.slice(0, 2)
  if (!top.length) return []

  // né câu: (cứng) câu thuộc CHÍNH buổi đang gán · (mềm) câu lớp đã gặp trong 60 ngày
  const cut60 = truNgay(ngayGan, 60)
  const [{ data: cauBuoiNay }, { data: docs60 }] = await Promise.all([
    phanIdsBuoiNay.length ? supabase.from('tai_lieu_cau').select('ma_cau').in('phan_id', phanIdsBuoiNay).limit(LIMIT) : Promise.resolve({ data: [] as any[] }),
    supabase.from('tai_lieu').select('id').eq('lop_id', lopId).gte('ngay', cut60).limit(LIMIT),
  ])
  const ne = new Set(((cauBuoiNay ?? []) as any[]).map((r) => r.ma_cau as string))
  const doc60Ids = ((docs60 ?? []) as any[]).map((d) => d.id)
  if (doc60Ids.length) {
    const { data: phan60 } = await supabase.from('tai_lieu_phan').select('id').in('tai_lieu_id', doc60Ids).limit(LIMIT)
    const phan60Ids = ((phan60 ?? []) as any[]).map((p) => p.id)
    if (phan60Ids.length) {
      const { data: cau60 } = await supabase.from('tai_lieu_cau').select('ma_cau').in('phan_id', phan60Ids).limit(LIMIT)
      for (const r of (cau60 ?? []) as any[]) ne.add(r.ma_cau)
    }
  }

  // chọn 1 câu/dạng: tự luận trước (không phương án, không mệnh đề — cấp 1-2 cần trình bày), least-used
  const K = khoCuaMon(mon)
  const out: GoiYOnTap[] = []
  for (const uv of top) {
    const { data: pool } = await supabase.from(K.cauTbl).select('*').eq('dang_chinh', uv.ma_dang).limit(LIMIT)
    const caus = ((pool ?? []) as CauHoi[]).filter((c) => !ne.has(c.ma_cau))
    const u = await cauUsage(caus.map((c) => c.ma_cau))
    const laTrinhBay = (c: CauHoi) => !(c.lua_chon?.length) && !(c.menh_de?.length)
    caus.sort((a, b) => (laTrinhBay(b) ? 1 : 0) - (laTrinhBay(a) ? 1 : 0) || (u.get(a.ma_cau) ?? 0) - (u.get(b.ma_cau) ?? 0) || (a.nguon === 'le' ? 0 : 1) - (b.nguon === 'le' ? 0 : 1))
    out.push({ ...uv, cau: caus[0] ?? null })
  }
  return out
}
