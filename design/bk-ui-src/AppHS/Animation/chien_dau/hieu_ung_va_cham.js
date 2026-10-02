/* Canvas FX dùng chung cho Nam/Nữ. Không sửa PNG nhân vật hay boss. */
window.battleImpact=(()=>{
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
  let mask=document.createElement('canvas'),shakeCanvas=document.createElement('canvas');
  function line(c,pts,width,color){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();}
  function glow(c,x,y,r,color,a=1){c.save();c.globalAlpha=a;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#fffef1');g.addColorStop(.18,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.restore();}
  function ring(c,x,y,r,a,color){c.save();c.globalAlpha=a;c.strokeStyle=color;c.lineWidth=7*(1-a)+3;c.beginPath();c.ellipse(x,y,r,r*.30,0,0,Math.PI*2);c.stroke();c.restore();}
  function skeleton(c,x,ground,boss,age){
    const h=357.58,w=boss?h*boss.width/boss.height:190;
    c.save();c.translate(x+Math.sin(age*.09)*9,ground+Math.cos(age*.067)*4);c.rotate(Math.sin(age*.062)*.028);
    if(boss){mask.width=Math.ceil(w);mask.height=Math.ceil(h);const m=mask.getContext('2d');m.clearRect(0,0,w,h);m.save();m.translate(w,0);m.scale(-1,1);m.drawImage(boss,0,0,w,h);m.restore();m.globalCompositeOperation='source-in';m.fillStyle='#070512';m.fillRect(0,0,w,h);m.globalCompositeOperation='source-over';c.drawImage(mask,-w/2,-h,w,h);}
    else{c.fillStyle='#080615';c.beginPath();c.ellipse(0,-h*.79,w*.31,h*.20,0,0,Math.PI*2);c.fill();line(c,[[0,-h*.58],[0,-h*.31]],w*.50,'#080615');line(c,[[-w*.16,-h*.53],[-w*.37,-h*.38],[-w*.45,-h*.56]],w*.18,'#080615');line(c,[[w*.16,-h*.53],[w*.37,-h*.38],[w*.44,-h*.56]],w*.18,'#080615');line(c,[[-w*.12,-h*.29],[-w*.19,-h*.15],[-w*.23,-5]],w*.22,'#080615');line(c,[[w*.12,-h*.29],[w*.19,-h*.15],[w*.24,-5]],w*.22,'#080615');}
    // Cartoon X-ray: sọ chibi, cột sống, xương sườn, chậu, chi trắng.
    c.shadowColor='#bdedff';c.shadowBlur=9;c.fillStyle='#fff';c.beginPath();c.ellipse(0,-h*.79,w*.22,h*.145,0,0,Math.PI*2);c.fill();c.fillStyle='#080615';for(const s of [-1,1]){c.beginPath();c.ellipse(s*w*.085,-h*.80,w*.055,h*.04,0,0,Math.PI*2);c.fill();}c.beginPath();c.moveTo(0,-h*.755);c.lineTo(-w*.03,-h*.72);c.lineTo(w*.03,-h*.72);c.fill();line(c,[[-w*.12,-h*.68],[w*.12,-h*.68]],7,'#fff');
    line(c,[[0,-h*.62],[0,-h*.31]],9,'#fff');for(let i=0;i<4;i++){const y=-h*(.57-i*.052);c.strokeStyle='#fff';c.lineWidth=5;c.beginPath();c.ellipse(0,y,w*(.18-i*.012),h*.037,0,0,Math.PI);c.stroke();}line(c,[[-w*.14,-h*.32],[0,-h*.28],[w*.14,-h*.32]],9,'#fff');
    for(const s of [-1,1]){line(c,[[s*w*.06,-h*.58],[s*w*.20,-h*.55],[s*w*.34,-h*.40],[s*w*.42,-h*.55]],8,'#fff');line(c,[[s*w*.10,-h*.30],[s*w*.18,-h*.16],[s*w*.23,-h*.025]],9,'#fff');for(const y of [.55,.4,.3,.16]){c.fillStyle='#fff';c.beginPath();c.arc(s*w*(y>.3?.25:.16),-h*y,5,0,Math.PI*2);c.fill();}}
    c.restore();
  }
  function lightning(c,q,x,floor,boss){
    const age=q*1600,hit=180,after=age-hit;
    if(age<450){const k=Math.floor(age/55),points=[[x+30,0]];for(let i=1;i<=7;i++)points.push([x+(noise(k*20+i)-.5)*100,i*(floor-65)/7]);line(c,points,26,'rgba(98,150,255,.48)');line(c,points,12,'#aee9ff');line(c,points,5,'#fff');for(let i=2;i<6;i++){const p=points[i];line(c,[p,[p[0]-60,p[1]+28],[p[0]-95,p[1]+80]],3,'#c9eaff');}}
    if(after>=0&&after<220){glow(c,x,floor-165,280,'#a0dbff',1-after/220);ring(c,x,floor-8,40+after*1.8,1-after/220,'#e8faff');}
    if(after>=0&&after<820){const pulse=Math.floor(after/145)%2;if(pulse===0||after<170)skeleton(c,x,floor,boss,after);for(let i=0;i<14;i++){const a=i*Math.PI*2/14,r=60+after*.27,px=x+Math.cos(a)*r,py=floor-190+Math.sin(a)*r*.9;line(c,[[px,py],[px+Math.cos(a)*16,py+Math.sin(a)*16]],3,'#c7f7ff');}for(let i=0;i<5;i++){const y=floor-320+i*60;line(c,[[x-90,y],[x-65,y-15],[x+80,y+8],[x+105,y-11]],2,'#9cdbff');}}
    return{shake:after>=0&&after<480?12*(1-after/480):0,flash:after>=0&&after<100?.88*(1-after/100):0};
  }
  function meteor(c,q,x,floor){
    const after=q*1600-560;if(after<0)return{shake:0,flash:0};const u=after/1000;
    if(after<330)glow(c,x,floor-55,290+after*1.25,'#ff8c28',1-after/350);
    if(after<760){ring(c,x,floor-5,65+after*.83,1-after/760,'#ffdd9a');if(after>70)ring(c,x,floor-5,40+(after-70)*.65,1-after/760,'#ffb568');}
    // Các tia nổ ngắn và đá vụn có vận tốc / trọng lực riêng, ổn định khi seek.

    if(after<260)for(let i=0;i<18;i++){const a=i*Math.PI/9,r=65+after*1.05;line(c,[[x+Math.cos(a)*r*.45,floor-35+Math.sin(a)*r*.4],[x+Math.cos(a)*r,floor-35+Math.sin(a)*r*.8]],6*(1-after/260),'#ffe3a8');}
    // Ba lớp bụi lan rộng, bốc lên rồi tan; không phủ khung câu hỏi.
    for(let i=0;i<28;i++){const delay=noise(i+220)*150,dt=Math.max(0,after-delay),a=noise(i+350)*Math.PI*2,r=34+dt*(.09+noise(i+270)*.075),px=x+Math.cos(a)*(45+dt*.28),py=floor-30-Math.abs(Math.sin(a))*(25+dt*.18),opacity=clamp(dt/90)*clamp(1-dt/1150)*.56;c.save();c.globalAlpha=opacity;const g=c.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,i%2?'#b4a299':'#716170');g.addColorStop(.7,'#847582');g.addColorStop(1,'transparent');c.fillStyle=g;c.beginPath();c.arc(px,py,r,0,Math.PI*2);c.fill();c.restore();}
    for(let i=0;i<48;i++){const a=Math.PI+noise(i+9)*Math.PI,v=240+noise(i+80)*490,dt=after/1000,px=x+Math.cos(a)*v*dt,py=floor-25+Math.sin(a)*v*dt+260*dt*dt,r=7+noise(i+140)*19;c.save();c.globalAlpha=clamp(1-u*.88);c.translate(px,py);c.rotate(dt*(noise(i+12)-.5)*16);c.fillStyle=i%3?'#5c4035':'#ffb353';c.beginPath();c.moveTo(-r,-r*.4);c.lineTo(r*.4,-r);c.lineTo(r,r*.6);c.lineTo(-r*.5,r);c.closePath();c.fill();c.restore();}
    // Đất đá tiền cảnh vẽ sau bụi để không bị che: các cục đất lớn, vụn nhỏ văng ra quanh điểm nổ.
    for(let i=0;i<20;i++){const dt=after/1000,a=Math.PI+noise(i+610)*Math.PI,v=190+noise(i+640)*540,px=x+Math.cos(a)*v*dt,py=floor-18+Math.sin(a)*v*dt+310*dt*dt,r=3+noise(i+670)*9;c.save();c.globalAlpha=clamp(1-dt*.75);c.fillStyle=i%2?'#8b6248':'#3e2a29';c.translate(px,py);c.rotate(dt*9+i);c.fillRect(-r,-r*.55,r*2,r*1.1);c.restore();}
    return{shake:after<350?17*(1-after/350):0,flash:after<90?.7*(1-after/90):0};
  }
  function draw(c,frame,boss,x,floor,W,H){if(frame.pose!=='niem_troi_2')return;c.save();c.beginPath();c.rect(0,0,W,H);c.clip();let f=frame.action==='lightning'?lightning(c,frame.progress,x,floor,boss):meteor(c,frame.progress,x,floor);if(f.shake){shakeCanvas.width=W;shakeCanvas.height=H;const s=shakeCanvas.getContext('2d');s.drawImage(c.canvas,0,0,W,H,0,0,W,H);c.fillStyle='#211b36';c.fillRect(0,0,W,H);c.drawImage(shakeCanvas,Math.sin(frame.local*.079)*f.shake,Math.cos(frame.local*.103)*f.shake*.55);}if(f.flash){c.globalAlpha=f.flash;c.fillStyle=frame.action==='lightning'?'#e6f7ff':'#fff1cc';c.fillRect(0,0,W,H);}c.restore();}
  return{draw,timing:{lightningHit:180,meteorHit:560,releaseDuration:1600}};
})();
