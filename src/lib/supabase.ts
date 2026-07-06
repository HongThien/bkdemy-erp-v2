import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined

export const hasEnv = Boolean(url && key)

// Kho v2 nằm ở schema public của project mới → không cần .schema()
export const supabase = createClient(url ?? '', key ?? '')

// ── Khoá "Chỉ xem" (RBAC lớp ①, vai_tro_chuc_nang.chi_xem — xem lib/quyen.ts) ──────
// Chặn NGAY tại 1 điểm seam (KHÔNG sửa từng nút mỗi màn): store đăng ký hàm trả về
// leaf-id đang "chỉ xem" (null = được sửa/không áp dụng) → mọi insert/update/upsert/
// delete qua bảng bất kỳ khi màn đó đang mở tự bị chặn, trả lỗi thân thiện thay vì
// gọi mạng. KHÔNG chặn select (đọc luôn được) — vẫn là gate feature-access ①, không
// phải RLS cứng (RLS DB không đổi).
let readOnlyLeafGetter: () => string | null = () => null
export function setReadOnlyLeafGetter(fn: () => string | null) { readOnlyLeafGetter = fn }

const WRITE_METHODS = ['insert', 'update', 'upsert', 'delete'] as const
const rawFrom = supabase.from.bind(supabase)
;(supabase as any).from = (table: string) => {
  const builder: any = rawFrom(table as any)
  for (const m of WRITE_METHODS) {
    const orig = builder[m].bind(builder)
    builder[m] = (...args: any[]) => {
      const result: any = orig(...args)
      const leaf = readOnlyLeafGetter()
      if (leaf) {
        // Ghi đè .then của CHÍNH builder này (cùng object xuyên suốt .eq()/.select() phía sau,
        // filter-builder trả `this`) → chain vẫn gọi được bình thường, chỉ resolve giả khi await.
        result.then = (onFulfilled?: any, onRejected?: any) =>
          Promise.resolve({
            data: null,
            error: { message: 'Bạn chỉ có quyền XEM ở màn này — không thể lưu/sửa/xoá.', code: 'RBAC_CHI_XEM' },
          }).then(onFulfilled, onRejected)
      }
      return result
    }
  }
  return builder
}
