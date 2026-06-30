// pdf.js worker — INLINE (blob base64): KHÔNG fetch file .mjs lúc runtime, nên không dính
// lỗi "Setting up fake worker failed / Failed to fetch dynamically imported module" trên máy
// nhân sự (host deploy serve .mjs sai MIME — Safari/Mac từ chối module; hoặc cache cũ trỏ chunk
// đã đổi hash → 404). Trade: +~1MB vào bundle. Trước dùng ?url → workerSrc nên mới rớt.
// Import side-effect 1 lần; ES-module cache → đúng 1 worker dùng chung.
import * as pdfjsLib from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&inline'

pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker()
