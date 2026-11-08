// quyet.mjs — khối "Câu cần chị chọn" cho trang HTML duyệt bản đồ: mỗi câu có các lựa chọn bấm được (radio) + ô ghi chú;
// lựa chọn lưu trong trình duyệt (localStorage) và có nút "Sao chép trả lời" để dán lại cho Claude.
//   import { htmlQuyet, cssQuyet } from '../quyet.mjs'
//   cau: { ma: 'H1', tieu_de, mo_ta, chon: [['Giữ ở P2.1', 'giải thích…', true /*đề xuất*/], …] }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const cssQuyet = `
.quyet{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:12px 16px;margin:12px 0}
.quyet h3{font-size:15.5px;margin:0 0 2px}.quyet .ma{margin-right:6px}
.quyet .moq{color:var(--mo);margin:0 0 8px;max-width:75ch}
.quyet label{display:flex;gap:8px;align-items:flex-start;padding:6px 8px;border-radius:8px;cursor:pointer;margin:2px 0}
.quyet label:hover{background:var(--nen-mota)}
.quyet input[type=radio]{margin-top:5px;accent-color:var(--tc)}
.quyet label small{display:block;color:var(--mo);font-size:13px}
.quyet .dx{font-size:12px;border:1px solid var(--moi);color:var(--moi);border-radius:999px;padding:0 8px;margin-left:6px;white-space:nowrap}
.quyet textarea{width:100%;min-height:42px;margin-top:6px;padding:6px 8px;border:1px solid var(--vien);border-radius:8px;background:var(--nen);color:var(--chu);font:inherit;resize:vertical}
.quyet.xong{border-color:var(--moi)}
.thanh-quyet{position:sticky;top:0;z-index:5;background:var(--nen);border-bottom:1px solid var(--vien);padding:8px 0;margin:0 0 8px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.thanh-quyet button{font:inherit;padding:5px 14px;border-radius:8px;border:1px solid var(--tc);background:var(--tc);color:#fff;cursor:pointer}
.thanh-quyet button:focus-visible{outline:2px solid var(--chu);outline-offset:2px}
.thanh-quyet span{color:var(--mo);font-size:13.5px}
`

export function htmlQuyet(cau, khoa) {
  const the = cau.map((c) => `<section class="quyet" id="q-${esc(c.ma)}" data-ma="${esc(c.ma)}">
<h3><span class="ma">${esc(c.ma)}</span>${esc(c.tieu_de)}</h3>
${c.mo_ta ? `<p class="moq">${c.mo_ta}</p>` : ''}
${c.chon.map(([nhan, gt, dx], i) => `<label><input type="radio" name="q-${esc(c.ma)}" value="${i}"><span><strong>${esc(nhan)}</strong>${dx ? '<span class="dx">đề xuất</span>' : ''}${gt ? `<small>${esc(gt)}</small>` : ''}</span></label>`).join('\n')}
<textarea aria-label="Ghi chú cho câu ${esc(c.ma)}" placeholder="Ghi chú (không bắt buộc)"></textarea>
</section>`).join('\n')
  const du_lieu = JSON.stringify(cau.map((c) => ({ ma: c.ma, tieu_de: c.tieu_de, chon: c.chon.map((x) => x[0]) })))
  return `<div class="thanh-quyet"><button type="button" id="sao-chep">Sao chép trả lời</button><span id="dem-quyet"></span></div>
${the}
<script>
(function(){
  var KHOA=${JSON.stringify('quyet:' + khoa)}, CAU=${du_lieu};
  var kho={}; try{kho=JSON.parse(localStorage.getItem(KHOA)||'{}')}catch(e){}
  function luu(){try{localStorage.setItem(KHOA,JSON.stringify(kho))}catch(e){}}
  function dem(){var n=0;CAU.forEach(function(c){if(kho[c.ma]&&kho[c.ma].v!=null)n++});document.getElementById('dem-quyet').textContent='Đã chọn '+n+'/'+CAU.length+' câu';document.querySelectorAll('.quyet').forEach(function(s){var k=kho[s.dataset.ma];s.classList.toggle('xong',!!(k&&k.v!=null))})}
  document.querySelectorAll('.quyet').forEach(function(s){
    var ma=s.dataset.ma,k=kho[ma]||{};
    if(k.v!=null){var r=s.querySelector('input[value="'+k.v+'"]');if(r)r.checked=true}
    if(k.g)s.querySelector('textarea').value=k.g;
    s.addEventListener('change',function(e){if(e.target.type==='radio'){kho[ma]=kho[ma]||{};kho[ma].v=+e.target.value;luu();dem()}});
    s.querySelector('textarea').addEventListener('input',function(e){kho[ma]=kho[ma]||{};kho[ma].g=e.target.value;luu()});
  });
  document.getElementById('sao-chep').addEventListener('click',function(){
    var d=CAU.map(function(c){var k=kho[c.ma]||{};var ch=k.v!=null?c.chon[k.v]:'(chưa chọn)';return c.ma+' · '+c.tieu_de+' → '+ch+(k.g?' — '+k.g:'')}).join('\\n');
    var ok=function(){document.getElementById('dem-quyet').textContent='Đã sao chép — dán vào chat'};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(d).then(ok,function(){prompt('Sao chép:',d)})}else{prompt('Sao chép:',d)}
  });
  dem();
})();
</script>`
}
