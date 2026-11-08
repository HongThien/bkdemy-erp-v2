// Khung bắt lỗi cho vùng NỘI DUNG của ERP (Thùy 22/10: "vào phần Tứ giác Hình luyện là trắng màn hình luôn").
// Không có khung này thì một màn con ném lỗi lúc vẽ ⇒ React gỡ CẢ cây ⇒ trắng trang, không biết lỗi gì.
// Có khung: menu bên trái vẫn dùng được, hiện câu lỗi + màn đang mở để chụp gửi, nút Thử lại vẽ lại màn.
// `key` của cha (màn đang mở) đổi ⇒ khung tự xoá lỗi cũ.
import { Component, type ReactNode } from 'react'

type P = { children: ReactNode; ten?: string }
type S = { loi: Error | null; lan: number }

export default class KhungLoi extends Component<P, S> {
  state: S = { loi: null, lan: 0 }
  static getDerivedStateFromError(loi: Error) { return { loi } }
  componentDidCatch(loi: Error, info: { componentStack?: string | null }) {
    console.error('[KhungLoi]', this.props.ten ?? '', loi, info?.componentStack)
  }
  render() {
    const { loi, lan } = this.state
    if (!loi) return <div key={lan} className="contents">{this.props.children}</div>
    return (
      <section className="m-6 max-w-3xl rounded-xl border border-rose-200 bg-rose-50 p-5 text-[13px] text-rose-900">
        <p className="text-[15px] font-semibold">Màn này gặp lỗi khi hiển thị</p>
        <p className="mt-1 text-rose-800">Chụp hộp này gửi Claude để sửa. Các mục khác ở menu bên trái vẫn dùng được.</p>
        <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-2.5 font-mono text-[12px] text-slate-700">
          {[this.props.ten ? `Màn: ${this.props.ten}` : null, `${loi.name}: ${loi.message}`, (loi.stack ?? '').split('\n').slice(1, 4).join('\n')].filter(Boolean).join('\n')}
        </pre>
        <div className="mt-3 flex gap-2">
          <button onClick={() => this.setState({ loi: null, lan: lan + 1 })} className="rounded-lg bg-rose-600 px-3 py-1.5 font-medium text-white hover:bg-rose-500">Thử lại</button>
          <button onClick={() => location.reload()} className="rounded-lg border border-rose-300 px-3 py-1.5 text-rose-700 hover:bg-white">Tải lại trang</button>
        </div>
      </section>
    )
  }
}
