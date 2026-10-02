// Entry RIÊNG cho game BK ĐẤU TỪ (PWA) — không import ERP/App HS.
import { Component, StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import 'katex/dist/katex.min.css'
import App from './App'

registerSW({ immediate: true })

/** Lỗi bất ngờ ⇒ hiện nút về sảnh thay vì trắng màn. */
class BatLoi extends Component<{ children: ReactNode }, { loi: string | null }> {
  state = { loi: null as string | null }
  static getDerivedStateFromError(e: Error) { return { loi: e.message } }
  render() {
    if (!this.state.loi) return this.props.children
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#fff', fontFamily: 'Nunito, sans-serif', padding: 16, textAlign: 'center' }}>
        <h2>Ối, có lỗi rồi 😵</h2>
        <small style={{ opacity: 0.7 }}>{this.state.loi}</small>
        <button onClick={() => location.assign(location.pathname)} style={{ padding: '12px 22px', borderRadius: 14, border: 'none', background: '#35b86b', color: '#fff', fontWeight: 900 }}>VỀ SẢNH</button>
      </div>
    )
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BatLoi><App /></BatLoi>
  </StrictMode>,
)
