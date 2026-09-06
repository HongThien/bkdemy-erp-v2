// AppSoan — bundle RIÊNG của tool soạn thảo (soan.html / vite.config.soan.ts). Toàn bộ màn nằm ở soan/SoanWorkspace
// (dùng chung với SoanModal nhúng trong ERP). Ở đây: Lưu = lưu nháp máy này (bản thử — chưa đăng nhập, chưa ghi kho).
import { useState } from 'react'
import { SoanWorkspace } from './soan/SoanWorkspace'
import { loadDraft, saveDraft } from './soan/cum'

export default function AppSoan() {
  const [draft] = useState(() => loadDraft())
  return (
    <div className="h-screen">
      <SoanWorkspace initial={draft} onSave={(raw) => {
        saveDraft(raw)
        // Bản thử: chuỗi kho chỉ ghi ra console cho CTO đối chiếu — người soạn không thấy.
        console.log('[soan] chuỗi kho:', raw)
      }} />
    </div>
  )
}
