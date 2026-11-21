import sys
from PIL import Image
# usage: cat.py src out x0 y0 x1 y1 (display coords) scale
src, out = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = [float(v) for v in sys.argv[3:7]]
s = float(sys.argv[7])
im = Image.open(src)
c = im.crop((int(x0*s), int(y0*s), int(x1*s), int(y1*s)))
c.save(out)
print(c.size)
