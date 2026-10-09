(function(){
  var D=document,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  D.documentElement.classList.add("js");

  /* drawer */
  var b=D.getElementById("burger"),dr=D.getElementById("drawer");
  if(b&&dr){b.addEventListener("click",function(){dr.hidden=!dr.hidden;b.setAttribute("aria-expanded",String(!dr.hidden))});
    dr.addEventListener("click",function(e){if(e.target.tagName==="A"){dr.hidden=true;b.setAttribute("aria-expanded","false")}})}

  /* marquee */
  D.querySelectorAll(".marq .tr").forEach(function(t){t.innerHTML+=t.innerHTML});

  /* reveal */
  var rvs=[].slice.call(D.querySelectorAll(".rv"));
  if("IntersectionObserver" in window&&!reduce){
    rvs.forEach(function(el){if(el.getBoundingClientRect().top>innerHeight)el.classList.add("pre")});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove("pre");io.unobserve(e.target)}})},{rootMargin:"0px 0px -6% 0px"});
    rvs.forEach(function(el){io.observe(el)});
  }

  /* pointer glow */
  D.addEventListener("pointermove",function(e){var c=e.target.closest&&e.target.closest(".card");if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")},{passive:true});

  /* counters */
  if("IntersectionObserver" in window&&!reduce){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var el=e.target,to=+el.dataset.count,t0=0;el.textContent="0";
      (function f(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/1600);el.textContent=Math.round(to*(1-Math.pow(1-k,4)));if(k<1)requestAnimationFrame(f)})(performance.now()) })},{threshold:.6});
    D.querySelectorAll("[data-count]").forEach(function(c){co.observe(c)});
  }

  /* hero waves: generate flowing lines */
  D.querySelectorAll(".waves").forEach(function(svg){
    var NS="http://www.w3.org/2000/svg",h="";
    for(var i=0;i<7;i++){var y=80+i*70,a=30+i*8;
      h+='<path class="'+(i%2?"w2":"")+'" d="M-50 '+y+' C 250 '+(y-a)+', 450 '+(y+a)+', 750 '+y+' S 1250 '+(y-a)+', 1550 '+y+'"/>'}
    svg.innerHTML=h;
  });

  /* branch map */
  var map=D.getElementById("gulfmap");
  if(map){
    var NS="http://www.w3.org/2000/svg";
    function X(lon){return 60+(lon-46)/10.5*880}function Y(lat){return 40+(30-lat)/6.8*540}
    var g=map.querySelector("#grid"),s="";
    for(var lo=47;lo<=56;lo++){s+='<line class="mgrid" x1="'+X(lo)+'" x2="'+X(lo)+'" y1="20" y2="600"/>';if(lo%2===0)s+='<text class="mdeg" x="'+(X(lo)+4)+'" y="612">'+lo+'°E</text>'}
    for(var la=24;la<=30;la++){s+='<line class="mgrid" y1="'+Y(la)+'" y2="'+Y(la)+'" x1="20" x2="990"/><text class="mdeg" x="24" y="'+(Y(la)-6)+'">'+la+'°N</text>'}
    g.innerHTML=s;
    var SKY="#f3d98e",BL="#ffffff",KW="#c9a24e";
    var C=[{id:"kwi",n:"الكويت",lat:29.37,lon:47.98,c:KW,dx:16,dy:-14,a:"e"},{id:"dmm",n:"الدمام",lat:26.43,lon:50.10,c:BL,dx:16,dy:-12,a:"e"},{id:"hof",n:"الأحساء",lat:25.38,lon:49.59,c:BL,dx:16,dy:26,a:"e"},{id:"ruh",n:"الرياض",lat:24.71,lon:46.68,c:BL,dx:16,dy:6,a:"e"},{id:"shj",n:"الشارقة",lat:25.36,lon:55.42,c:SKY,dx:14,dy:-14,a:"e"},{id:"dxb",n:"دبي",lat:25.20,lon:55.27,c:SKY,dx:-14,dy:-12,a:"s"},{id:"auh",n:"أبوظبي",lat:24.45,lon:54.38,c:SKY,dx:-14,dy:6,a:"s"},{id:"ain",n:"العين",lat:24.21,lon:55.74,c:SKY,dx:14,dy:22,a:"e"}];
    var by={};C.forEach(function(c){c.x=X(c.lon);c.y=Y(c.lat);by[c.id]=c});
    var L=[["kwi","dmm"],["dmm","hof"],["hof","ruh"],["dmm","ruh"],["hof","auh"],["auh","dxb"],["dxb","shj"],["auh","ain"],["dxb","ain"]],ls="";
    L.forEach(function(p){var a=by[p[0]],z=by[p[1]],mx=(a.x+z.x)/2,my=(a.y+z.y)/2-Math.hypot(z.x-a.x,z.y-a.y)*.18;ls+='<path class="flow" d="M'+a.x+','+a.y+' Q'+mx+','+my+' '+z.x+','+z.y+'" fill="none" stroke="rgba(243,217,142,.45)" stroke-width="1.6"/>'});
    map.querySelector("#links").innerHTML=ls;
    var ns="";C.forEach(function(c){ns+='<g class="mnode" data-city="'+c.id+'"><circle cx="'+c.x+'" cy="'+c.y+'" r="26" fill="url(#glow)"/><circle class="node-pulse" cx="'+c.x+'" cy="'+c.y+'" r="8" fill="none" stroke="'+c.c+'" stroke-width="1.5" style="animation-delay:'+(Math.random()*2).toFixed(2)+'s"/><circle class="core" cx="'+c.x+'" cy="'+c.y+'" r="6.5" fill="'+c.c+'" stroke="#061a3d" stroke-width="2"/><text class="mlabel" x="'+(c.x+c.dx)+'" y="'+(c.y+c.dy)+'" text-anchor="'+(c.a==="e"?"end":"start")+'">'+c.n+'</text></g>'});
    map.querySelector("#nodes").innerHTML=ns;
    function hl(id,on){D.querySelectorAll('[data-city="'+id+'"]').forEach(function(el){el.classList.toggle("hot",on);var k=el.querySelector&&el.querySelector(".core");if(k)k.setAttribute("r",on?10:6.5)})}
    D.querySelectorAll("[data-city]").forEach(function(el){var id=el.dataset.city;el.addEventListener("mouseenter",function(){hl(id,true)});el.addEventListener("mouseleave",function(){hl(id,false)})});
  }

  /* elevator COP floor counter */
  var cop=D.getElementById("cop");
  if(cop&&!reduce){var d=cop.querySelector(".d"),ar=cop.querySelector(".a"),btns=cop.querySelectorAll(".bt i"),f=0,target=0;
    setInterval(function(){if(f===target){target=Math.floor(Math.random()*8);btns.forEach(function(x,i){x.classList.toggle("on",i===target)})}
      if(f<target){f++;ar.textContent="▲"}else if(f>target){f--;ar.textContent="▼"}else{ar.textContent="•"}
      d.textContent=f===0?"G":f},900)}

  /* AC airflow canvas */
  var cv=D.getElementById("airflow");
  if(cv&&!reduce&&cv.getContext){
    var ctx=cv.getContext("2d"),P=[],W,H;
    function rs(){var r=cv.getBoundingClientRect(),dp=Math.min(2,devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*dp;cv.height=H*dp;ctx.setTransform(dp,0,0,dp,0,0)}
    rs();addEventListener("resize",rs);
    for(var i=0;i<70;i++)P.push({x:Math.random(),y:Math.random(),v:.0006+Math.random()*.0012,l:20+Math.random()*60,a:.15+Math.random()*.35,ph:Math.random()*6});
    (function tick(t){ctx.clearRect(0,0,W,H);ctx.lineCap="round";
      P.forEach(function(p){p.x-=p.v;if(p.x<-.1){p.x=1.1;p.y=Math.random()}
        var x=p.x*W,y=p.y*H+Math.sin(t/900+p.ph)*10,gr=ctx.createLinearGradient(x,y,x+p.l,y);
        gr.addColorStop(0,"rgba(255,244,214,"+p.a+")");gr.addColorStop(1,"rgba(255,244,214,0)");
        ctx.strokeStyle=gr;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+p.l/2,y-6,x+p.l,y);ctx.stroke()});
      requestAnimationFrame(tick)})(0);
  }

  /* smart scenes */
  var room=D.getElementById("room");
  if(room){
    var S={
      morning:{t:"صباح الخير",log:"> scene: MORNING\n> curtains: open 100%\n> lights: 40% warm\n> AC: 23°C eco"},
      away:{t:"مغادرة المنزل",log:"> scene: AWAY\n> lights: off\n> doors: locked\n> cameras: armed · AC: standby"},
      cinema:{t:"وضع السينما",log:"> scene: CINEMA\n> curtains: closed\n> lights: 10% blue\n> audio: on · AC: 22°C"},
      night:{t:"وقت النوم",log:"> scene: NIGHT\n> lights: path 5%\n> doors: locked\n> AC: 24°C sleep"}
    };
    var log=D.getElementById("slog"),lbl=room.querySelector(".lbl");
    function set(k){room.dataset.s=k;lbl.textContent=S[k].t;log.textContent=S[k].log;
      D.querySelectorAll(".sbtn").forEach(function(x){x.setAttribute("aria-pressed",String(x.dataset.s===k))});
      var on={morning:{lamp:.5,curt:0,tv:0,ac:1,lock:0,cam:0},away:{lamp:0,curt:.5,tv:0,ac:.3,lock:1,cam:1},cinema:{lamp:.15,curt:1,tv:1,ac:1,lock:0,cam:0},night:{lamp:.06,curt:1,tv:0,ac:1,lock:1,cam:1}}[k];
      room.querySelectorAll("[data-el]").forEach(function(el){var v=on[el.dataset.el];el.style.opacity=el.dataset.el==="curt"?1:(.25+.75*v);if(el.dataset.el==="curt")el.setAttribute("transform","scale("+(0.08+0.92*v)+",1)")});
      room.querySelector("#glowLamp").style.opacity=on.lamp;room.querySelector("#sun").style.opacity=k==="morning"?1:0;room.querySelector("#moon").style.opacity=k==="morning"?0:1;room.querySelector("#tvglow").style.opacity=on.tv}
    D.querySelectorAll(".sbtn").forEach(function(x){x.addEventListener("click",function(){set(x.dataset.s)})});
    set("morning");
  }

  /* form → whatsapp */
  var fm=D.getElementById("qform"),note=D.getElementById("fnote");
  if(fm)fm.addEventListener("submit",function(e){e.preventDefault();
    var miss=[].slice.call(fm.querySelectorAll("[required]")).filter(function(x){return !x.value.trim()});
    if(miss.length){miss[0].focus();note.textContent="أكمل الحقول المطلوبة: "+miss.map(function(x){return fm.querySelector('label[for="'+x.id+'"]').textContent}).join("، ");return}
    var m="طلب عرض سعر — مجموعة سمو\nالاسم: "+fm.name.value+"\nالهاتف: "+fm.phone.value+"\nالفرع: "+fm.branch.value+"\nالخدمة: "+fm.service.value+(fm.msg.value.trim()?"\nالتفاصيل: "+fm.msg.value:"");
    note.innerHTML='طلبك جاهز. <a href="https://wa.me/971501035499?text='+encodeURIComponent(m)+'" target="_blank" rel="noopener">افتح واتساب لإرساله</a> أو أرسل البيانات إلى info@smou.ae.'});

  /* scroll progress */
  var pr=D.querySelector(".progress");
  if(pr){var up=function(){var h=D.documentElement.scrollHeight-innerHeight;pr.style.setProperty("--p",h>0?(scrollY/h).toFixed(4):0)};addEventListener("scroll",up,{passive:true});up()}

  /* hero spotlight follows pointer */
  D.querySelectorAll(".sky").forEach(function(s){s.addEventListener("pointermove",function(e){var r=s.getBoundingClientRect();s.style.setProperty("--sx",(e.clientX-r.left)+"px");s.style.setProperty("--sy",(e.clientY-r.top)+"px")},{passive:true})});

  /* gold dust */
  if(!reduce)D.querySelectorAll(".sky").forEach(function(sec){
    var c=D.createElement("canvas");c.className="dust";c.setAttribute("aria-hidden","true");sec.insertBefore(c,sec.firstChild);
    var x=c.getContext("2d");if(!x)return;var W=0,H=0,P=[],vis=true,mx=-999,my=-999,N=matchMedia("(max-width:760px)").matches?40:90;
    function rs(){var r=sec.getBoundingClientRect(),dp=Math.min(2,devicePixelRatio||1);W=r.width;H=r.height;c.width=W*dp;c.height=H*dp;x.setTransform(dp,0,0,dp,0,0)}
    rs();addEventListener("resize",rs);
    for(var i=0;i<N;i++)P.push({x:Math.random(),y:Math.random(),r:.4+Math.random()*1.8,v:.00015+Math.random()*.0005,tw:Math.random()*6,dx:(Math.random()-.5)*.0002});
    sec.addEventListener("pointermove",function(e){var r=sec.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
    sec.addEventListener("pointerleave",function(){mx=my=-999});
    if("IntersectionObserver" in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(sec);
    (function loop(t){if(vis){x.clearRect(0,0,W,H);
      P.forEach(function(p){p.y-=p.v;p.x+=p.dx;if(p.y<-.02){p.y=1.02;p.x=Math.random()}
        var px=p.x*W,py=p.y*H,dx=px-mx,dy=py-my,d=Math.hypot(dx,dy);
        if(d<110){px+=dx/d*(110-d)*.35;py+=dy/d*(110-d)*.35}
        var a=.35+.65*Math.abs(Math.sin(t/900+p.tw));
        x.beginPath();x.arc(px,py,p.r,0,6.283);x.fillStyle="rgba(243,217,142,"+(a*.85)+")";x.shadowColor="rgba(243,217,142,.9)";x.shadowBlur=p.r*6;x.fill()});}
      requestAnimationFrame(loop)})(0);
  });

  /* 3D tilt (desktop pointers) */
  if(!reduce&&matchMedia("(hover:hover) and (pointer:fine)").matches)D.querySelectorAll(".tilt").forEach(function(el){
    el.addEventListener("pointermove",function(e){var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.style.transform="perspective(900px) rotateY("+(px*8)+"deg) rotateX("+(-py*8)+"deg) translateY(-4px)"});
    el.addEventListener("pointerleave",function(){el.style.transform=""});
  });

  /* parallax hero images */
  if(!reduce){var pimgs=[].slice.call(D.querySelectorAll(".phero-vis img,.portal img"));
    addEventListener("scroll",function(){var y=scrollY;if(y>innerHeight*1.2)return;pimgs.forEach(function(im){im.style.translate="0 "+(y*.06).toFixed(1)+"px"})},{passive:true})}

  /* beams in heroes */
  D.querySelectorAll(".hero,.phero").forEach(function(s){var b=D.createElement("div");b.className="beams";b.setAttribute("aria-hidden","true");s.insertBefore(b,s.firstChild)});
  /* headline word rise */
  if(!reduce)D.querySelectorAll(".hero h1,.phero h1").forEach(function(h){
    var i=0;function walk(n){[].slice.call(n.childNodes).forEach(function(c){
      if(c.nodeType===3){var parts=c.textContent.split(/(\s+)/),f=D.createDocumentFragment();parts.forEach(function(p){if(!p.trim()){f.appendChild(D.createTextNode(p));return}var s=D.createElement("span");s.className="w";s.textContent=p;s.style.animationDelay=(1.15+i++*0.12)+"s";f.appendChild(s)});c.replaceWith(f)}
      else if(c.nodeType===1&&c.tagName!=="BR"){if(c.classList.contains("grad-txt")){c.classList.add("w");c.style.animationDelay=(1.15+i++*0.12)+"s"}else walk(c)}})}
    walk(h);h.classList.add("words")});
  /* cursor aura + sparks */
  if(!reduce&&matchMedia("(hover:hover) and (pointer:fine)").matches){
    var au=D.createElement("div");au.className="aura";D.body.appendChild(au);var ax=0,ay=0,tx=0,ty=0,last=0;
    D.addEventListener("pointermove",function(e){tx=e.clientX;ty=e.clientY;au.classList.add("on");
      var now=performance.now();if(now-last>45&&e.target.closest&&e.target.closest(".sky,.btn-pri,.portal")){last=now;var s=D.createElement("i");s.className="spark";s.style.left=tx+"px";s.style.top=ty+"px";s.style.setProperty("--dx",(Math.random()*40-20)+"px");s.style.setProperty("--dy",(Math.random()*30+10)+"px");D.body.appendChild(s);setTimeout(function(){s.remove()},850)}},{passive:true});
    D.addEventListener("pointerleave",function(){au.classList.remove("on")});
    (function f(){ax+=(tx-ax)*.12;ay+=(ty-ay)*.12;au.style.transform="translate("+ax+"px,"+ay+"px)";requestAnimationFrame(f)})();
    /* magnetic buttons */
    D.querySelectorAll(".btn").forEach(function(b){b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect();b.style.transform="translate("+((e.clientX-r.left-r.width/2)*.18)+"px,"+((e.clientY-r.top-r.height/2)*.3)+"px)"});b.addEventListener("pointerleave",function(){b.style.transform=""})});
  }
})();
