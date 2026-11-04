import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

// Exercise the real event handlers with a minimal DOM, without browser packages.
const source=await readFile('app.js','utf8');
function pasture({touch=false,reduced=false}={}){
  const timers=new Map(), events=new Map(), elements=new Map();let timerId=0;
  class Element {
    constructor(){this.handlers=new Map();this.classes=new Set();this.style={};this.textContent='';this.keyboardFocus=false;this.image={src:'./assets/cow.svg'};this.classList={toggle:(key,on)=>on?this.classes.add(key):this.classes.delete(key),add:key=>this.classes.add(key),remove:key=>this.classes.delete(key)};}
    addEventListener(type,handler){this.handlers.set(type,handler);}
    fire(type,event={}){this.handlers.get(type)?.(event);}
    querySelector(){return this.image;}
    matches(){return this.keyboardFocus;}
    getBoundingClientRect(){return {left:100,right:194,top:100,bottom:184};}
  }
  const get=key=>{if(!elements.has(key))elements.set(key,new Element());return elements.get(key);};
  const root=new Element();
  const context=vm.createContext({console,URL,Math,innerWidth:500,innerHeight:700,
    document:{querySelector:get,documentElement:root,hidden:false},
    matchMedia:query=>({matches:query.includes('reduced')?reduced:touch,addEventListener(){}}),
    addEventListener:(type,handler)=>events.set(type,handler),
    requestAnimationFrame:()=>1,cancelAnimationFrame(){},
    setTimeout:handler=>{timers.set(++timerId,handler);return timerId;},clearTimeout:id=>timers.delete(id),
    fetch:()=>new Promise(()=>{})});
  vm.runInContext(source.replaceAll('import.meta.url', "'https://example.test/cowforsale/app.js'"),context);
  vm.runInContext("setupCow(['grass?'], 'act normal.', 'Pashu is blushing.')",context);
  return {get,move:(x,y)=>events.get('pointermove')({clientX:x,clientY:y}),root,expire:()=>{for(const callback of [...timers.values()])callback();timers.clear();}};
}
const p=pasture(), cow=p.get('#cow-follower'), map=p.get('#assam-sticker');
p.move(90,140);assert.ok(cow.classes.has('is-blushing'));assert.equal(cow.image.src,'./assets/cow-blush.svg');assert.equal(p.get('#cow-bubble').textContent,'act normal.');
p.move(0,0);assert.ok(!cow.classes.has('is-blushing'));assert.equal(cow.image.src,'./assets/cow.svg');
p.move(90,140);p.root.fire('pointerleave');assert.ok(!cow.classes.has('is-blushing'));
map.keyboardFocus=true;map.fire('focus');assert.ok(cow.classes.has('is-blushing'));map.fire('blur');assert.ok(!cow.classes.has('is-blushing'));
map.keyboardFocus=false;map.fire('focus');assert.ok(!cow.classes.has('is-blushing'),'Mouse focus must not leave the cow permanently blushing');
const phone=pasture({touch:true});phone.get('#assam-sticker').fire('click');assert.ok(phone.get('#cow-follower').classes.has('is-blushing'));phone.expire();assert.ok(!phone.get('#cow-follower').classes.has('is-blushing'));
const quiet=pasture({reduced:true});quiet.move(90,140);assert.equal(quiet.get('#cow-follower').style.visibility,'visible');assert.equal(quiet.get('#cow-follower').style.transform,'translate(30px,124px)');
console.log('Passed: Assam proximity entry/exit, pointer leave, keyboard focus, mouse focus, timed touch blush and stationary reduced-motion reaction.');
