(async()=>{
'use strict';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results=[], errors=[];
window.addEventListener('error',e=>errors.push(e.message||'Erro JS'));
window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason||'Promise rejeitada')));
const $=s=>document.querySelector(s);
const visible=el=>!!el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0;
function rect(el){if(!el)return null;const r=el.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),bottom:Math.round(innerHeight-r.bottom),right:Math.round(innerWidth-r.right)}}
function inside(el){const r=el.getBoundingClientRect();return r.left>=-4&&r.top>=-4&&r.right<=innerWidth+4&&r.bottom<=innerHeight+4}
function add(n,ok,d=''){results.push({teste:n,status:ok?'OK':'FALHOU',detalhe:String(d||'')});console[ok?'log':'warn']((ok?'OK':'FALHOU')+' - '+n,d||'');}
async function head(p){try{const r=await fetch(p+'?v550='+Date.now(),{method:'HEAD',cache:'no-store'});add('Arquivo '+p,r.ok,'HTTP '+r.status)}catch(e){add('Arquivo '+p,false,e.message)}}
async function tap(el,name){if(!el){add('Clique '+name,false,'não encontrado');return false}el.scrollIntoView({block:'center',inline:'center'});await sleep(80);el.click();add('Clique '+name,true,el.id||el.textContent||name);return true}
console.log('%cATHOS V55 VISUAL LANGUAGE NINTENDO/SEGA','font-size:20px;color:#55ff55;background:#111;padding:8px');
for(const f of ['./index.html','./style.css','./app.js','./sw.js','./assets/render-v54/v54-render-premium.js','./assets/render-v54/v54-render-premium.css','./athos.glb']) await head(f);
add('Título V55',/V55\.0/i.test(document.title),document.title);
await tap($('#playBtn')||$('#heroPlayBtn'),'Jogar');
await sleep(4300);
const api=window.ATHOS_TEST_API||{};
const vl=api.getV55VisualLanguage?.();
add('V55 ativo',!!vl,JSON.stringify(vl||{}));
add('Sem texto flutuante no mundo',vl?.noWorldText===true,JSON.stringify(vl||{}));
add('Render rico preservado',api.getV54Render?.()?.renderRichPreserved===true || api.getV54Render?.()?.visualLanguageV55===true,JSON.stringify(api.getV54Render?.()||{}));
add('Inimigos reais existem',api.getGameplayState?.()?.enemies?.length>=3,JSON.stringify(api.getGameplayState?.()||{}));
add('Powerups reais existem',api.getV53?.()?.powerups>=3,JSON.stringify(api.getV53?.()||{}));
const stage=$('.game.active .three-stage'), joy=$('#joystick'), grid=$('.action-grid'), hud=$('.top-hud'), obj=$('.objective-card');
add('Stage dentro da tela',visible(stage)&&inside(stage),JSON.stringify(rect(stage)));
add('Joystick dentro da tela',visible(joy)&&inside(joy),JSON.stringify(rect(joy)));
add('Botões dentro da tela',visible(grid)&&inside(grid),JSON.stringify(rect(grid)));
add('HUD dentro da tela',visible(hud)&&inside(hud),JSON.stringify(rect(hud)));
add('Objetivo dentro da tela',visible(obj)&&inside(obj),JSON.stringify(rect(obj)));
let p0=api.getPlayerState?.(); await sleep(450); let p1=api.getPlayerState?.();
add('Athos parado não anda sozinho',p0&&p1&&Math.abs((p1.x-p0.x)||0)<.08&&Math.abs((p1.z-p0.z)||0)<.08,JSON.stringify({antes:p0,depois:p1}));
add('Sem erro JS',errors.length===0,errors.slice(-5).join(' | '));
console.table(results);
window.ATHOS_V550_TEST_RESULTS=results;
alert(`Teste V55 finalizado.\nOK: ${results.filter(r=>r.status==='OK').length}\nFalhas: ${results.filter(r=>r.status==='FALHOU').length}\nErros JS: ${errors.length}`);
})();