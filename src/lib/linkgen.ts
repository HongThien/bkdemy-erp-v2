// Hàng đợi gen-link PDF phía SERVER (07-12, thay hẳn hàng đợi client-side cũ) — client CHỈ ghi 1 dòng
// 'pending' vào `linkgen_jobs` rồi đi tiếp (fire-and-forget, không render, không overlay, không chờ gì
// cả — Thùy: "t ko muốn phải chờ bất kì chỗ nào... hệ thống phải tự chạy ẩn"). Worker (worker/index.mjs,
// service role) tự quét bảng này, in PDF chữ thật bằng Chrome, upload, ghi tai_lieu.file_url.
import { supabase } from './supabase'

export type LinkGenJobRow = {
  tai_lieu_id: string
  loai: string
  status: 'pending' | 'processing' | 'done' | 'failed'
  attempt: number
  error: string | null
  updated_at: string
}

// Enqueue lại 1 tài liệu = ghi đè dòng cũ về 'pending' (PK = tai_lieu_id nên tự dedupe; job failed cũ
// được reset). KHÔNG await ở call site — lỗi mạng hiếm hoi chỉ log, không chặn luồng đóng editor.
export function enqueueLinkGenJob(taiLieuId: string, loai: string): void {
  supabase.from('linkgen_jobs')
    .upsert({ tai_lieu_id: taiLieuId, loai, status: 'pending', attempt: 0, error: null, updated_at: new Date().toISOString() }, { onConflict: 'tai_lieu_id' })
    .then(({ error }) => { if (error) console.error('enqueueLinkGenJob:', error.message); else baoCoJobMoi() })
}

// Màn Kho chỉ đọc nhanh (10 s) khi CÓ job đang chờ; rảnh thì 5 phút/lần (audit 11/11: poll 8 s liên tục = 54k lượt).
// Vừa xếp job mới ⇒ báo màn Kho (nếu đang mở) đọc ngay, khỏi chờ lượt 5 phút.
export const SU_KIEN_JOB_MOI = 'bk:linkgen-job-moi'
export function baoCoJobMoi(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SU_KIEN_JOB_MOI))
}

// Màn Kho đọc trạng thái job để hiện nhãn đúng dòng ("⏳ đang tạo…" / "⚠ lỗi") — chỉ lấy các dòng
// CHƯA xong (done thì tai_lieu.file_url tự nói lên điều đó rồi, không cần job row nữa).
export async function listLinkGenJobs(): Promise<LinkGenJobRow[]> {
  // = status <> 'done' (CHECK chỉ có 4 giá trị) nhưng viết dạng IN để dùng được index (status) — mig toi_uu_erp 11/11
  const { data, error } = await supabase.from('linkgen_jobs').select('*').in('status', ['pending', 'processing', 'failed']).limit(2000)
  if (error) throw error
  return (data ?? []) as LinkGenJobRow[]
}
