// Chuẩn hoá LaTeX dùng CHUNG cho render (KaTeX, kho/ui.tsx) và lưu (MathLive, mathfield.ts) — file này KHÔNG import
// gì (ui.tsx không được kéo MathLive vào bundle ERP).
//
// Dấu mũ trên 1 chữ có chỉ số: `\widehat{A_2}` (Thùy 08/09: "dấu góc hiển thị quá tệ, bé tý và lệch hẳn — làm như
// MathType"). Cả KaTeX lẫn MathLive căn dấu mũ theo BỀ RỘNG CẢ THÂN (A + chỉ số 2) → mũ lệch sang phải, thu nhỏ.
// MathType/sách giáo khoa viết góc A₂ là mũ TRÊN A, chỉ số đứng NGOÀI: `\widehat{A}_2`. Chỉ áp cho thân = 1 chữ (+ phẩy)
// + chỉ số; `\widehat{ABC}` / `\widehat{A_1B_1C_1}` (mũ phủ nhiều chữ) giữ nguyên. Bỏ \overline: gạch đoạn thẳng
// `\overline{AB}` là nhiều chữ, không thuộc ca này.
const ACCENT_SCRIPT = /\\(widehat|hat|vec|overrightarrow|bar|tilde|widetilde|dot|ddot)\s*\{([A-Za-z]'*)((?:[_^](?:\{[^{}]*\}|[A-Za-z0-9]))+)\}/g
export const fixAccentScript = (latex: string) => latex.replace(ACCENT_SCRIPT, (_m, cmd: string, letter: string, script: string) => `\\${cmd}{${letter}}${script}`)

// CHỈ LÚC RENDER (KaTeX), KHÔNG lưu: KaTeX chọn cỡ dấu \widehat theo SỐ PHẦN TỬ trong thân (1 → cỡ nhỏ nhất, 2–3 → cỡ 2…),
// nên `\widehat{A}` ra mũ 8.7×4.4px lệch phải 2.5px trên chữ rộng 13.8px (đo 08/09) — "bé tý và lệch". Đệm 2 nhóm rỗng
// `{}` hai bên → thân 3 phần tử → cỡ 2: mũ 13.8×5.5px phủ ĐÚNG bề rộng chữ, không lệch, không thêm khoảng trắng
// (`\,`/`\;` cũng lên cỡ 2 nhưng nới rộng 6–10px). Chỉ áp cho thân 1 chữ (+ phẩy); nhiều chữ KaTeX tự chọn cỡ đúng.
export const widenSingleHat = (latex: string) => latex.replace(/\\widehat\s*\{([A-Za-z]'*)\}/g, '\\widehat{{}$1{}}')
