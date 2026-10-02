from pathlib import Path
from PIL import Image
import zipfile

root=Path(__file__).resolve().parent
for p in root.glob('*_2d.png'):
    im=Image.open(p)
    assert im.n_frames==27
    for i in range(im.n_frames):
        im.seek(i)
        im.load()
        assert im.info.get('duration')==100
    print(p.name,im.size,im.n_frames,'frames OK')
for name,folders in [('chien_dau_nam_v3.zip',[root/'nam']),('chien_dau_nu_v3.zip',[root/'nu']),('chien_dau_nam_nu_v3.zip',[root])]:
    with zipfile.ZipFile(root.parent/name,'w',zipfile.ZIP_DEFLATED) as z:
        for folder in folders:
            for f in folder.rglob('*'):
                if f.is_file():z.write(f,f.relative_to(root.parent))
        if len(folders)==1 and folders[0]!=root:
            sex=folders[0].name
            for f in [root/'HIEU_UNG_VA_CHAM.md',root/'hieu_ung_va_cham.js',root/f'{sex}_set_dien_giat_2d.png',root/f'{sex}_thien_thach_va_cham_2d.png']:
                z.write(f,f.relative_to(root.parent))
    with zipfile.ZipFile(root.parent/name) as z:
        assert z.testzip() is None
        print(name,len(z.namelist()),'files; archive OK')

