(function(){
  var top=document.getElementById('top'),burger=document.getElementById('burger'),nav=document.getElementById('nav');
  function tlo(){top.classList.toggle('na-bialym',window.scrollY>40)}
  tlo();window.addEventListener('scroll',tlo,{passive:true});
  burger.addEventListener('click',function(){var o=top.classList.toggle('menu-otwarte');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){top.classList.remove('menu-otwarte');burger.setAttribute('aria-expanded','false')})});
  // galeria: przeciąganie myszą + strzałki
  var g=document.getElementById('galeria-pas'),przesuniecie=0;
  if(g){
    var start=0,sl=0,ciag=false;
    g.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;ciag=true;przesuniecie=0;start=e.clientX;sl=g.scrollLeft;g.classList.add('ciagnie')});
    window.addEventListener('pointermove',function(e){if(ciag){przesuniecie=Math.max(przesuniecie,Math.abs(e.clientX-start));g.scrollLeft=sl-(e.clientX-start)}});
    window.addEventListener('pointerup',function(){if(ciag){ciag=false;g.classList.remove('ciagnie')}});
    g.addEventListener('click',function(e){if(przesuniecie>6){e.preventDefault();e.stopPropagation();przesuniecie=0}},true);
    document.querySelectorAll('.strzalki button').forEach(function(b){b.addEventListener('click',function(){g.scrollBy({left:+b.dataset.kier*g.clientWidth*.7,behavior:'smooth'})})});
  }
  // powiększanie zdjęć (lightbox)
  var zd=[].slice.call(document.querySelectorAll('img[data-lb]'));
  if(zd.length){
    var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Powiększone zdjęcie');
    lb.innerHTML='<figure><img alt=""><figcaption></figcaption></figure><button type="button" class="lb-x" aria-label="Zamknij"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 4l12 12M16 4L4 16"/></svg></button><button type="button" class="lb-p" aria-label="Poprzednie zdjęcie"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M13 3l-7 7 7 7"/></svg></button><button type="button" class="lb-n" aria-label="Następne zdjęcie"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 3l7 7-7 7"/></svg></button>';
    document.body.appendChild(lb);
    var lbImg=lb.querySelector('img'),lbCap=lb.querySelector('figcaption'),nr=0,ostatni=null;
    function pokaz(i){nr=(i+zd.length)%zd.length;lbImg.src=zd[nr].currentSrc||zd[nr].src;lbImg.alt=zd[nr].alt;lbCap.textContent=zd[nr].alt}
    function otworz(i){ostatni=document.activeElement;pokaz(i);lb.classList.add('pokaz');document.body.classList.add('lb-otwarty');lb.querySelector('.lb-x').focus()}
    function zamknij(){lb.classList.remove('pokaz');document.body.classList.remove('lb-otwarty');if(ostatni)ostatni.focus()}
    var jedno=zd.length<2;lb.querySelector('.lb-p').hidden=jedno;lb.querySelector('.lb-n').hidden=jedno;
    zd.forEach(function(im,i){im.tabIndex=0;im.setAttribute('role','button');im.addEventListener('click',function(){otworz(i)});im.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();otworz(i)}})});
    lb.querySelector('.lb-x').addEventListener('click',zamknij);
    lb.querySelector('.lb-p').addEventListener('click',function(){pokaz(nr-1)});
    lb.querySelector('.lb-n').addEventListener('click',function(){pokaz(nr+1)});
    lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='FIGURE')zamknij()});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('pokaz'))return;if(e.key==='Escape')zamknij();if(e.key==='ArrowLeft'&&!jedno)pokaz(nr-1);if(e.key==='ArrowRight'&&!jedno)pokaz(nr+1)});
    var tx=null;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){if(tx===null||jedno)return;var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)pokaz(nr+(d<0?1:-1));tx=null});
  }
  // formularz pokazowy
  var f=document.getElementById('formularz');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();document.getElementById('komunikat').textContent='To podgląd projektu. Na gotowej stronie zapytanie trafi od razu na Twoją skrzynkę e-mail.'});
  var r=document.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
  // cookies
  var c=document.getElementById('cookies'),z=null;
  try{z=localStorage.getItem('zgoda-cookies')}catch(e){}
  if(!z)setTimeout(function(){c.classList.add('pokaz')},600);
  c.querySelectorAll('[data-zgoda]').forEach(function(b){b.addEventListener('click',function(){try{localStorage.setItem('zgoda-cookies',b.dataset.zgoda)}catch(e){}c.classList.remove('pokaz')})});
})();
