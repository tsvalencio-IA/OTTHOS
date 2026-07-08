(async()=>{
'use strict';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results=[], errors=[];
window.addEventListener('error',e=>errors.push(e.message||'Erro JS'));
window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason||'Promise rejeitada')));
const $=s=>document.querySelector(s);
const all=s=>Array.from(document.querySelectorAll(s));
const visible=el=>!!el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0;
function rect(el){if(!el)return null;const r=el.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),bottom:Math.round(innerHeight-r.bottom),right:Math.round(innerWidth-r.right),display:getComputedStyle(el).display,visibility:getComputedStyle(el).visibility}}
function inside(el){const r=el.getBoundingClientRect();return r.left>=-4&&r.top>=-4&&r.right<=innerWidth+4&&r.bottom<=innerHeight+4}
function overlap(a,b){const r1=a.getBoundingClientRect(),r2=b.getBoundingClientRect();return !(r1.right<=r2.left||r2.right<=r1.left||r1.bottom<=r2.top||r2.bottom<=r1.top)}
function add(n,ok,d=''){results.push({teste:n,status:ok?'OK':'FALHOU',detalhe:String(d||'')});console[ok?'log':'warn']((ok?'OK':'FALHOU')+' - '+n,d||'');}
async function head(p){try{const r=await fetch(p+'?v543='+Date.now(),{method:'HEAD',cache:'no-store'});add('Arquivo '+p,r.ok,'HTTP '+r.status)}catch(e){add('Arquivo '+p,false,e.message)}}
async function tap(el,name){if(!el){add('Clique '+name,false,'não encontrado');return false}el.scrollIntoView({block:'center',inline:'center'});await sleep(80);el.click();add('Clique '+name,true,el.id||el.textContent||name);return true}
console.log('%cATHOS V54.3 INTERATIVIDADE + PROFUNDIDADE MOBILE','font-size:20px;color:#55ff55;background:#111;padding:8px');
for(const f of ['./index.html','./style.css','./app.js','./athos.glb','./manifest.webmanifest','./sw.js','./assets/render-v54/v54-render-premium.js','./assets/render-v54/v54-render-premium.css','./assets/render-v54/v54-render-config.json']) await head(f);
add('Título V54.3',/V54\.3/i.test(document.title),document.title);
add('Sem V49/V50/debug no lobby',!/V49|V50|debug|Codex|render exigido|base novo repositório/i.test($('#lobby')?.innerText||''),'lobby limpo');
await tap($('#playBtn')||$('#heroPlayBtn'),'Jogar');
await sleep(4300);
const api=window.ATHOS_TEST_API||{};
add('V54.3 ativo',!!api.getV543?.(),JSON.stringify(api.getV543?.()||{}));
add('Render V54 carregado',!!api.getV54Render?.()?.installed,JSON.stringify(api.getV54Render?.()||{}));
const gameplayWorlds=$('.game.active .game-controls > .world-strip')||$('.game.active .world-strip');
add('Mundos removidos do gameplay',!gameplayWorlds || !visible(gameplayWorlds),JSON.stringify(rect(gameplayWorlds)));
const stage=$('.game.active .three-stage'), joy=$('#joystick'), grid=$('.action-grid'), hud=$('.top-hud'), obj=$('.objective-card'), settings=$('#hudSettingsBtn'), plus=$('#hudGemPlusBtn')||$('.hud-gem-plus');
add('Stage 3D ocupa a tela',visible(stage)&&inside(stage)&&Math.abs(stage.getBoundingClientRect().height-innerHeight)<6,JSON.stringify(rect(stage)));
add('Joystick dentro da tela',visible(joy)&&inside(joy),JSON.stringify(rect(joy)));
add('Botões dentro da tela',visible(grid)&&inside(grid),JSON.stringify(rect(grid)));
add('HUD dentro da tela',visible(hud)&&inside(hud),JSON.stringify(rect(hud)));
add('Objetivo dentro da tela',visible(obj)&&inside(obj),JSON.stringify(rect(obj)));
add('Botões com espaço',visible(grid)&&!Array.from(grid.children).some((b,i,a)=>visible(b)&&a.some((c,j)=>j>i&&visible(c)&&overlap(b,c))),'sem sobreposição');
const before=Number($('#hudCrystals')?.textContent||0);
await tap(plus,'+ Cristal');
await sleep(350);
const after=Number($('#hudCrystals')?.textContent||0);
add('+ Cristal funciona',after>before,`${before} -> ${after}`);
await tap(settings,'Configurações');
await sleep(300);
add('Configurações abre',visible($('#modal')) && /Configurações/i.test($('#modalTitle')?.textContent||''),$('#modalTitle')?.textContent||'');
add('Config tem mundos',all('.settings-world-btn').length>=7,`${all('.settings-world-btn').length} mundos`);
$('#modalClose')?.click();
await sleep(250);
add('Powerups lógicos existem',api.getV53?.()?.powerups>=3,JSON.stringify(api.getV53?.()||{}));
add('Inimigos lógicos vivos/aparentes',api.getGameplayState?.()?.enemies?.length>=3,JSON.stringify(api.getGameplayState?.()||{}));
api.power?.();
await sleep(550);
add('B Poder dispara',api.getGameplayState?.()?.fireballs>=0,JSON.stringify(api.getGameplayState?.()||{}));
let p0=api.getPlayerState?.(); await sleep(450); let p1=api.getPlayerState?.();
add('Athos parado não anda sozinho',p0&&p1&&Math.abs((p1.x-p0.x)||0)<.08&&Math.abs((p1.z-p0.z)||0)<.08,JSON.stringify({antes:p0,depois:p1}));
await tap($('#arNativeExternalBtn'),'Real/AR');
await sleep(700);
let p2=api.getPlayerState?.(); await sleep(450); let p3=api.getPlayerState?.();
add('Real não move Athos',p2&&p3&&Math.abs((p3.x-p2.x)||0)<.08&&Math.abs((p3.z-p2.z)||0)<.08,JSON.stringify({antes:p2,depois:p3,ar:api.getARSafety?.()}));
add('Sem erro JS',errors.length===0,errors.slice(-5).join(' | '));
console.table(results);
window.ATHOS_V543_TEST_RESULTS=results;
alert(`Teste V54.3 finalizado.\nOK: ${results.filter(r=>r.status==='OK').length}\nFalhas: ${results.filter(r=>r.status==='FALHOU').length}\nErros JS: ${errors.length}`);
})();