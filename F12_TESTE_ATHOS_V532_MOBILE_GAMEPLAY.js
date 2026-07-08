(async()=>{
'use strict';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results=[], errors=[];
window.addEventListener('error',e=>errors.push(e.message||'Erro JS'));
window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason||'Promise rejeitada')));
const $=s=>document.querySelector(s);
const visible=el=>!!el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0;
function rect(el){const r=el.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),bottom:Math.round(innerHeight-r.bottom),right:Math.round(innerWidth-r.right)}}
function inside(el){const r=el.getBoundingClientRect();return r.left>=-4&&r.top>=-4&&r.right<=innerWidth+4&&r.bottom<=innerHeight+4}
function overlap(a,b){const r1=a.getBoundingClientRect(),r2=b.getBoundingClientRect();return !(r1.right<=r2.left||r2.right<=r1.left||r1.bottom<=r2.top||r2.bottom<=r1.top)}
function add(n,ok,d=''){results.push({teste:n,status:ok?'OK':'FALHOU',detalhe:String(d||'')});console[ok?'log':'warn']((ok?'OK':'FALHOU')+' - '+n,d||'');}
async function head(p){try{const r=await fetch(p+'?v532='+Date.now(),{method:'HEAD',cache:'no-store'});add('Arquivo '+p,r.ok,'HTTP '+r.status)}catch(e){add('Arquivo '+p,false,e.message)}}
async function tap(el,name){if(!el){add('Clique '+name,false,'não encontrado');return false} el.scrollIntoView({block:'center',inline:'center'}); await sleep(80); el.click(); add('Clique '+name,true,el.id||el.textContent||name); return true}
console.log('%cATHOS V53.2 MOBILE + GAMEPLAY','font-size:20px;color:#55ff55;background:#111;padding:8px');
for(const f of ['./index.html','./style.css','./app.js','./athos.glb','./manifest.webmanifest','./sw.js','./assets/render-v48/v48-render-target.js','./assets/render-v48/v48-render-target.css']) await head(f);
add('Título V53.2',/V53\.2/i.test(document.title),document.title);
add('Sem V49 no lobby',!document.body.innerText.includes('V49'),'texto V49 removido');
await tap($('#playBtn')||$('#heroPlayBtn'),'Jogar');
await sleep(4200);
const api=window.ATHOS_TEST_API||{};
add('V53 ativo',api.getV53?.()?.active===true,JSON.stringify(api.getV53?.()||{}));
add('Hotfix V53.2 ativo',!!api.getV532?.(),JSON.stringify(api.getV532?.()||{}));
add('Render Codex preservado',!!api.getV48Render?.(),JSON.stringify(api.getV48Render?.()||{}));
const joy=$('#joystick'), grid=$('.action-grid'), worlds=$('.world-strip'), hud=$('.top-hud'), obj=$('.objective-card');
add('Joystick dentro da tela',visible(joy)&&inside(joy),JSON.stringify(rect(joy)));
add('Botões dentro da tela',visible(grid)&&inside(grid),JSON.stringify(rect(grid)));
add('Mundos dentro da tela',visible(worlds)&&inside(worlds),JSON.stringify(rect(worlds)));
add('HUD dentro da tela',visible(hud)&&inside(hud),JSON.stringify(rect(hud)));
add('Objetivo dentro da tela',visible(obj)&&inside(obj),JSON.stringify(rect(obj)));
add('Joystick não sobrepõe botões',visible(joy)&&visible(grid)&&!overlap(joy,grid),JSON.stringify({joy:rect(joy),grid:rect(grid)}));
let p0=api.getPlayerState?.(); await sleep(450); let p1=api.getPlayerState?.();
add('Athos parado não anda sozinho',p0&&p1&&Math.abs((p1.x-p0.x)||0)<.08&&Math.abs((p1.z-p0.z)||0)<.08,JSON.stringify({antes:p0,depois:p1}));
await tap($('.world-chip[data-world="real"]'),'Real/AR');
await sleep(700);
let p2=api.getPlayerState?.(); await sleep(450); let p3=api.getPlayerState?.();
add('Real não move Athos',p2&&p3&&Math.abs((p3.x-p2.x)||0)<.08&&Math.abs((p3.z-p2.z)||0)<.08,JSON.stringify({antes:p2,depois:p3,ar:api.getARSafety?.()}));
add('Sem erro JS',errors.length===0,errors.slice(-5).join(' | '));
console.table(results);
window.ATHOS_V532_TEST_RESULTS=results;
alert(`Teste V53.2 finalizado.\nOK: ${results.filter(r=>r.status==='OK').length}\nFalhas: ${results.filter(r=>r.status==='FALHOU').length}\nErros JS: ${errors.length}`);
})();