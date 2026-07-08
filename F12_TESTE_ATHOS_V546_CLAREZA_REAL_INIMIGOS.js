(async()=>{
'use strict';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results=[], errors=[];
window.addEventListener('error',e=>errors.push(e.message||'Erro JS'));
window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason||'Promise rejeitada')));
const $=s=>document.querySelector(s);
function add(n,ok,d=''){results.push({teste:n,status:ok?'OK':'FALHOU',detalhe:String(d||'')});console[ok?'log':'warn']((ok?'OK':'FALHOU')+' - '+n,d||'');}
async function head(p){try{const r=await fetch(p+'?v546='+Date.now(),{method:'HEAD',cache:'no-store'});add('Arquivo '+p,r.ok,'HTTP '+r.status)}catch(e){add('Arquivo '+p,false,e.message)}}
async function tap(el,name){if(!el){add('Clique '+name,false,'não encontrado');return false}el.scrollIntoView({block:'center',inline:'center'});await sleep(80);el.click();add('Clique '+name,true,el.id||el.textContent||name);return true}
console.log('%cATHOS V54.6 CLAREZA REAL INIMIGOS','font-size:20px;color:#55ff55;background:#111;padding:8px');
for(const f of ['./index.html','./app.js','./sw.js','./assets/render-v54/v54-render-premium.js','./assets/render-v54/v54-render-premium.css']) await head(f);
add('Título V54.6',/V54\.6/i.test(document.title),document.title);
await tap($('#playBtn')||$('#heroPlayBtn'),'Jogar');
await sleep(4300);
const api=window.ATHOS_TEST_API||{};
add('V54.6 ativo',!!api.getV546?.(),JSON.stringify(api.getV546?.()||{}));
add('Render V54 ativo',!!api.getV54Render?.()?.installed,JSON.stringify(api.getV54Render?.()||{}));
add('Render limpo',api.getV54Render?.()?.v546ClutterReduced===true,JSON.stringify(api.getV54Render?.()||{}));
add('Powerups lógicos existem',api.getV53?.()?.powerups>=3,JSON.stringify(api.getV53?.()||{}));
add('Inimigos lógicos existem',api.getGameplayState?.()?.enemies?.length>=3,JSON.stringify(api.getGameplayState?.()||{}));
add('Sem erro JS',errors.length===0,errors.slice(-5).join(' | '));
console.table(results);
window.ATHOS_V546_TEST_RESULTS=results;
alert(`Teste V54.6 finalizado.\nOK: ${results.filter(r=>r.status==='OK').length}\nFalhas: ${results.filter(r=>r.status==='FALHOU').length}\nErros JS: ${errors.length}`);
})();