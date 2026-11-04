const $ = (selector) => document.querySelector(selector);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const escape = (text) => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function photo(item, eager = false) {
  if (!item.src) return `<div class="photo-placeholder" role="img" aria-label="Photo to be added">🐄<br>PHOTO PENDING. CHAOS CONFIRMED.</div><figcaption>${escape(item.caption)}</figcaption>`;
  return `<img src="${escape(item.src)}" alt="${escape(item.alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" ${eager ? 'fetchpriority="high"' : ''}><figcaption>${escape(item.caption)}</figcaption>`;
}
async function start() {
  const response = await fetch(new URL('./content.json', import.meta.url));
  if (!response.ok) throw new Error('Birthday content could not be loaded.');
  const c = await response.json();
  const headline = $('#hero-title');
  const peaceStart = c.opening.indexOf('world peace');
  if (peaceStart >= 0) headline.innerHTML = `${escape(c.opening.slice(0, peaceStart))}<span class="peace">${escape(c.opening.slice(peaceStart))}</span>`;
  else headline.textContent = c.opening;
  $('#hero-intro').textContent = c.intro;
  $('#hero-photo').innerHTML = photo(c.hero, true);
  $('#specimen').innerHTML = c.specimen.map(s => `<div><dt>${escape(s.label)}</dt><dd>${escape(s.value)}</dd></div>`).join('');
  $('#memory-intro').textContent = c.memoryIntro;
  $('#evidence-grid').innerHTML = c.evidence.map(p => `<article class="evidence-card reveal"><figure class="polaroid">${photo(p)}<span class="tag">${escape(p.tag)}</span></figure><span class="annotation">${escape(p.annotation)}</span></article>`).join('');
  $('#memory-list').innerHTML = c.memories.map((m,i) => `<article class="memory-card"><figure class="polaroid reveal">${photo(m)}</figure><span class="sample-label">${m.sample ? 'SAMPLE MEMORY · REPLACE WITH OUR REAL LORE' : 'FROM THE SHARED ARCHIVES'} / ${String(i+1).padStart(2,'0')}</span><h3>${escape(m.title)}</h3><p>${escape(m.text)}</p></article>`).join('');
  $('#crush-copy').textContent = c.crush;
  $('#letter-photo').innerHTML = `<figure class="polaroid">${photo(c.letterPhoto)}</figure>`;
  $('#letter-text').innerHTML = c.letter.map(p => `<p>${escape(p)}</p>`).join('');
  $('#signature').textContent = c.signature;
  $('#footer-credit').textContent = c.footerCredit;
  $('#birthday-name').textContent = `${c.nickname}!`;
  $('#birthday-message').textContent = c.birthdayMessage;
  document.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
    const placeholder = document.createElement('div');
    placeholder.className = 'photo-placeholder'; placeholder.setAttribute('role','img');
    placeholder.setAttribute('aria-label', img.alt + ' — photo to be added');
    placeholder.textContent = '🐄 PHOTO PENDING. CHAOS CONFIRMED.'; img.replaceWith(placeholder);
  }, {once:true}));
  setupReveals(); setupCow(c.cowBubbles, c.assamBubble, c.assamReaction);
}
function setupReveals() {
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;
  document.body.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);}
  }), {threshold: .13});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
function setupCow(bubbles, assamBubble, assamReaction) {
  const cow = $('#cow-follower'), bubble = $('#cow-bubble');
  const sticker = $('#assam-sticker'), cowImage = cow.querySelector('img');
  const reaction = $('#assam-reaction');
  const touch = matchMedia('(pointer: coarse)');
  let x = innerWidth - 85, y = innerHeight - 75, targetX = x, targetY = y, frame, last = 0, speechAt = 0, count = 0;
  let active = false;
  let nearAssam = false, focusedAssam = false, tappedAssam = false, blushing = false;
  let bubbleTimer, blushTimer;
  const showBubble = () => {if(blushing)return;clearTimeout(bubbleTimer);bubble.textContent = bubbles[count++ % bubbles.length];bubble.classList.add('show');bubbleTimer=setTimeout(()=>bubble.classList.remove('show'),2000);};
  function updateBlush() {
    const next = nearAssam || focusedAssam || tappedAssam;
    if (next === blushing) return;
    blushing = next;
    cow.classList.toggle('is-blushing', blushing);
    sticker.classList.toggle('is-near', blushing);
    cowImage.src = blushing ? './assets/cow-blush.svg' : './assets/cow.svg';
    clearTimeout(bubbleTimer);
    bubble.textContent = blushing ? assamBubble : '';
    bubble.classList.toggle('show', blushing);
    reaction.textContent = blushing ? assamReaction : '';
    if(blushing){
      active=true;
      // A stationary reaction remains available for keyboard/reduced-motion users.
      if(reduceMotion.matches || focusedAssam || touch.matches){
        const rect=sticker.getBoundingClientRect();
        x=targetX=Math.max(12,rect.left-70);y=targetY=Math.max(45,rect.bottom-60);
        cow.style.transform=`translate(${x}px,${y}px)`;
        cow.style.visibility='visible';
      }
    }
  }
  function checkProximity(event) {
    const rect=sticker.getBoundingClientRect();
    const dx=Math.max(rect.left-event.clientX,0,event.clientX-rect.right);
    const dy=Math.max(rect.top-event.clientY,0,event.clientY-rect.bottom);
    nearAssam=Math.hypot(dx,dy)<55;
    updateBlush();
  }
  sticker.addEventListener('focus',()=>{focusedAssam=sticker.matches(':focus-visible');updateBlush();});
  sticker.addEventListener('blur',()=>{focusedAssam=false;updateBlush();});
  sticker.addEventListener('click',()=>{
    tappedAssam=true;updateBlush();clearTimeout(blushTimer);
    blushTimer=setTimeout(()=>{tappedAssam=false;if(touch.matches){nearAssam=false;focusedAssam=false;}updateBlush();},3200);
  });
  document.documentElement.addEventListener('pointerleave',()=>{nearAssam=false;updateBlush();});
  function move(event) {if (touch.matches) {targetX = Math.min(innerWidth-65, Math.max(20,event.clientX));showBubble();} else {targetX=event.clientX+25;targetY=event.clientY+25;checkProximity(event);} active=true;}
  addEventListener('pointermove', e => {if (!touch.matches) move(e);}, {passive:true});
  addEventListener('pointerdown', move, {passive:true});
  function loop(time) {
    if (document.hidden || reduceMotion.matches) {frame=undefined;return;}
    const dt = Math.min((time-last)||16, 40); last=time;
    if(touch.matches){active=true;targetY=innerHeight-58;if(time % 6500 < 60) targetX=30+Math.random()*(innerWidth-100);}
    if(active){const factor=1-Math.exp(-dt/150);x+=(Math.min(innerWidth-62,Math.max(12,targetX))-x)*factor;y+=(Math.min(innerHeight-60,Math.max(45,targetY))-y)*factor;
      const moving=Math.abs(x-targetX)+Math.abs(y-targetY)>6;
      const bounce=moving?Math.sin(time/95)*3:0;const angle=moving?Math.sin(time/130)*7:0;
      cow.style.transform=`translate(${x}px,${y+bounce}px) rotate(${angle}deg)`;cow.style.visibility='visible';
      if(time-speechAt>9500){showBubble();speechAt=time;}
    }
    frame=requestAnimationFrame(loop);
  }
  const resume=()=>{if(!reduceMotion.matches&&!document.hidden&&!frame)frame=requestAnimationFrame(loop);};
  addEventListener('visibilitychange',resume);reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches){cancelAnimationFrame(frame);frame=undefined;}else resume();});resume();
}
let partyTimer;
function celebrate() {
  clearTimeout(partyTimer); $('#confetti').replaceChildren();
  $('#party-status').textContent = 'Moo wishes granted. You are ridiculously loved. ♡';
  if(reduceMotion.matches) return;
  const frag=document.createDocumentFragment();
  for(let i=0;i<60;i++){const el=document.createElement('span');el.className=`confetto ${i%4 ? 'spot' : ''} ${i%3===0?'pink':''}`;if(i%4===0)el.textContent=i%8===0?'🐄':'♡';el.style.cssText=`left:${Math.random()*100}%;--duration:${3+Math.random()*2}s;--drift:${Math.random()*220-110}px;--spin:${Math.random()*700-350}deg;animation-delay:${Math.random()*.7}s`;frag.append(el);}
  $('#confetti').append(frag);partyTimer=setTimeout(()=>$('#confetti').replaceChildren(),6000);
}
$('#celebrate').addEventListener('click',celebrate);
$('#replay').addEventListener('click',()=>{$('#party-status').textContent='';$('#confetti').replaceChildren();});
start().catch(error=>{console.error(error);$('#hero-title').textContent='The pasture is taking a moment.';$('#hero-intro').textContent='Please refresh, or open this site through the local preview server described in README.md.';});
