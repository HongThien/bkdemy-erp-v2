// Bổ trợ › Lịch phòng (Thùy 24/09, spec-xep-bo-tro-chung.md §4): ngày → ca trực → popup 3 tab Đuổi · Bù · Yếu → xếp theo ĐƠN VỊ.
// ĐANG XÂY theo thứ tự §10: bước 1 (gom lá) xong · bước 2 DB ca_bo_tro + đơn vị · bước 3 màn này. Mockup: mockups/xep-bo-tro-chung.html.
export default function LichPhongScreen() {
  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-6">
          <h1 className="text-[22px] font-bold text-slate-800">Lịch phòng</h1>
          <p className="mt-1 text-[13px] text-slate-500">Xếp chung 3 loại bổ trợ theo đơn vị của ca trực (Đuổi 4 · Bù 4 · Yếu L2 4 · Yếu L1 2).</p>
        </header>
        <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
          <p className="text-[14px] font-semibold text-slate-700">Đang xây (bước 2–3 của spec-xep-bo-tro-chung.md §10)</p>
          <p className="mt-1 text-[12.5px] text-slate-500">Tạm thời vẫn xếp ở từng lá: Đuổi · Bù · Yếu (tab "Ca bổ trợ" của Yếu = tự ghép theo lịch trực).</p>
        </div>
      </div>
    </section>
  )
}
