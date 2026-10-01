// Server dev app HS qua HTTPS (chứng chỉ tự ký) để thử trên iPad/điện thoại cùng Wi-Fi khi Safari đòi kết nối bảo mật.
// Chạy: npm run dev:hs:https  → mở https://<IP máy>:5443/hs.html?xem=phieu_luu (Safari sẽ báo "không riêng tư" → Hiện chi tiết → Truy cập trang web).
// Chỉ dùng khi dev; KHÔNG ảnh hưởng bản build/deploy (build dùng vite.config.hs.ts).
import { mergeConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import base from './vite.config.hs'

export default mergeConfig(base, {
  plugins: [basicSsl()],
  server: { host: true, port: 5443, strictPort: true },
})
