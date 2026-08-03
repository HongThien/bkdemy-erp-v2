// made.ts — sinh 3 MÃ ĐỀ (đề gốc + đề 2 & 3). Mỗi câu GỐC → câu KHÁC cùng DẠNG + cùng FORM. Neo theo
// CÂU GỐC (key = ma_cau gốc, KHÔNG theo vị trí). DÙNG CHUNG ET (1 lớp+ngày) và MT (mẫu nhiều phần) —
// TÁCH khỏi ETScreen để MT tái dùng NGUYÊN LOGIC. Lệch một bản là 3 đề đụng câu nhau (bug ÂM THẦM).
import { etFormOf, canBeETForm, type CauHinh, type ETForm } from './tailieu'
import { listCauByDang, type CauHoi } from './kho/api'

export type BaseItem = { maDang: string; maCau: string }

// Sinh đề 2/3 PURE: base = câu GỐC (đúng thứ tự), baseCh = cấu hình hiện tại. Trả cau_hinh mới (etMaDe +
// etFormByCau bổ sung form cho câu biến thể) + toàn bộ câu đã nạp (để cache/preview). cauCache = câu đã
// có sẵn ở màn soạn (fallback khi pool chưa chứa câu gốc).
// ⭐ BẤT BIẾN (Thùy): mọi câu ở MỌI mã đề của 1 vị trí PHẢI CÙNG DẠNG với câu gốc. Ưu tiên câu KHÁC (chưa
// dùng) cùng dạng+form; nếu dạng KHÔNG đủ câu khác (vd chỉ có 1 câu) thì CHO PHÉP TRÙNG — dùng lại câu
// gốc / câu cùng dạng, KHÔNG để TRỐNG. Nhờ vậy picks luôn được lấp (không còn null từ lần sinh này).
export async function buildMaDe(
  base: BaseItem[],
  baseCh: CauHinh,
  cauTbl: string,
  cauCache: Record<string, CauHoi> = {},
): Promise<{ ch: CauHinh; caus: CauHoi[] }> {
  const pools: Record<string, CauHoi[]> = {}
  for (const md of new Set(base.map((b) => b.maDang))) pools[md] = await listCauByDang(md, cauTbl)
  const allCau = Object.values(pools).flat()
  const byMa = new Map(allCau.map((c) => [c.ma_cau, c]))
  const etFormByCau: Record<string, string> = { ...(baseCh.etFormByCau ?? {}) }
  const etMaDe: Record<string, (string | null)[]> = {}
  const used = new Set<string>(base.map((b) => b.maCau))   // ưu tiên: đề 2/3 khác MỌI câu gốc (khi còn đủ câu)
  for (const b of base) {
    const baseCau = byMa.get(b.maCau) ?? cauCache[b.maCau]
    const form: ETForm = baseCau ? etFormOf(baseCau, baseCh) : 'tra_loi_ngan'
    // Ứng viên = câu CÙNG DẠNG + in được cùng form (gồm cả câu gốc). Các mã đề bắt buộc nằm trong tập này.
    const candidates = (pools[b.maDang] ?? []).filter((c) => canBeETForm(c, form))
    const picks: (string | null)[] = []
    for (let v = 0; v < 2; v++) {
      const fresh = candidates.find((c) => !used.has(c.ma_cau))   // câu KHÁC chưa dùng ở bất kỳ đề nào
      if (fresh) { used.add(fresh.ma_cau); etFormByCau[fresh.ma_cau] = form; picks.push(fresh.ma_cau) }
      else {
        // Không đủ câu khác cùng dạng+form → CHO TRÙNG: câu chưa xuất hiện ở đề NÀY (đề 3 tránh đề 2),
        // rồi câu gốc. KHÔNG thêm vào `used` → câu gốc khác cùng dạng vẫn tái dùng được (đều thiếu câu).
        const dup = candidates.find((c) => !picks.includes(c.ma_cau))?.ma_cau ?? candidates[0]?.ma_cau ?? b.maCau
        etFormByCau[dup] = form; picks.push(dup)
      }
    }
    etMaDe[b.maCau] = picks
  }
  return { ch: { ...baseCh, etFormByCau, etMaDe }, caus: allCau }
}

// Ô TRỐNG (đề 2/3 chưa có câu) theo bộ câu gốc HIỆN TẠI → chặn lưu + cảnh báo. base = câu gốc hiện tại.
export function oTrongMaDe(base: BaseItem[], ch: CauHinh): { maCau: string; v: number }[] {
  const out: { maCau: string; v: number }[] = []
  for (const b of base) { const arr = ch.etMaDe?.[b.maCau]; for (let v = 0; v < 2; v++) if (!arr || !arr[v]) out.push({ maCau: b.maCau, v }) }
  return out
}

// etMaDe đã phủ ĐÚNG bộ câu gốc hiện tại chưa? true = LỆCH (đổi/thêm/bớt câu gốc) → cần sinh lại.
export function maDeStale(base: BaseItem[], ch: CauHinh): boolean {
  const cur = ch.etMaDe ?? {}
  const baseSet = base.map((b) => b.maCau)
  return baseSet.some((m) => !cur[m]) || Object.keys(cur).some((k) => !baseSet.includes(k))
}

// etMaDe phủ ĐỦ (đủ câu gốc + không ô trống) → sẵn sàng in 3 mã đề / gán theo HS.
export function maDeReady(base: BaseItem[], ch: CauHinh): boolean {
  return !!ch.etMaDe && base.length > 0 && !maDeStale(base, ch) && oTrongMaDe(base, ch).length === 0
}

// Câu đã dùng ở BẤT KỲ đề nào (gốc + 2/3) — cấm chọn lại để 3 đề không đụng câu nhau.
export function usedMoiDe(base: BaseItem[], ch: CauHinh): Set<string> {
  const s = new Set<string>(base.map((b) => b.maCau))
  for (const arr of Object.values(ch.etMaDe ?? {})) for (const m of arr) if (m) s.add(m)
  return s
}

// Gán tay 1 ô mã đề (đề 2/3) — ép cùng form với câu gốc. Trả cau_hinh mới (không setState — caller lưu).
export function setVarInCh(ch: CauHinh, baseMaCau: string, v: number, maCau: string, form: ETForm): CauHinh {
  const cur = ch.etMaDe?.[baseMaCau] ?? [null, null]
  const next = [...cur]; next[v] = maCau
  return { ...ch, etMaDe: { ...(ch.etMaDe ?? {}), [baseMaCau]: next }, etFormByCau: { ...(ch.etFormByCau ?? {}), [maCau]: form } }
}
