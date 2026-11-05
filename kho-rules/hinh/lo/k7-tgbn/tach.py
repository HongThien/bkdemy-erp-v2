# Soát gộp lô K7: (1) thêm "Â nhọn" cho TL2.2 / VN.4 HH00104 (cùng cấu hình TL3.4 — tránh suy biến, tiền lệ HH00111);
# (2) tách mỗi bài thành lop_<bai>.md (TL…, theo thứ tự nhãn) + vn_<bai>.md (VN…) để nhập vào 2 kho.
import io, re, os, glob
K = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(K, 'drafts')

def sua(f, a, b):
    p = os.path.join(D, f); s = io.open(p, encoding='utf-8').read()
    if b in s: return
    assert s.count(a) == 1, (f, a[:60], s.count(a)); io.open(p, 'w', encoding='utf-8').write(s.replace(a, b))

sua('draft_HH00104_A9.md', 'Cho $\\triangle ABC$ cân tại $A$. Kẻ $BD\\perp AC$ tại $D$, $CE\\perp AB$ tại $E$.',
    'Cho $\\triangle ABC$ cân tại $A$ có $\\widehat{A}$ nhọn. Kẻ $BD\\perp AC$ tại $D$, $CE\\perp AB$ tại $E$.')
sua('draft_HH00104_A11.md', 'Cho tam giác $ABC$ cân tại $A$. Kẻ $BD$, $CE$ lần lượt',
    'Cho tam giác $ABC$ cân tại $A$ có $\\widehat{A}$ nhọn. Kẻ $BD$, $CE$ lần lượt')

def khoa(nhan):  # TL1.3 -> (0,1,3) ; VN.2 -> (1,0,2)
    m = re.match(r'(TL|VN)(\d*)\.?(\d+)', nhan)
    return (0 if m.group(1) == 'TL' else 1, int(m.group(2) or 0), int(m.group(3)))

khoi = {}
for f in sorted(glob.glob(os.path.join(D, 'draft_*.md'))):
    s = io.open(f, encoding='utf-8').read().replace('\r\n', '\n')
    for b in re.split(r'\n(?=### )', s):
        m = re.match(r'### (\S+) → (HH\d+)', b)
        if not m: continue
        khoi.setdefault(m.group(2), []).append((khoa(m.group(1)), m.group(1), b.strip() + '\n'))
for bai, ds in khoi.items():
    ds.sort()
    for loai, ten in ((0, 'lop'), (1, 'vn')):
        x = [b for k, n, b in ds if k[0] == loai]
        if x: io.open(os.path.join(K, f'{ten}_{bai}.md'), 'w', encoding='utf-8').write('\n'.join(x))
    print(bai, 'TL:', ' '.join(n for k, n, b in ds if k[0] == 0), '| VN:', ' '.join(n for k, n, b in ds if k[0] == 1))
