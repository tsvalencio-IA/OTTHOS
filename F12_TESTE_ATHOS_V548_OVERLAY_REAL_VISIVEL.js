(async()=>{
'use strict';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results=[], errors=[];
window.addEventListener('error',e=>errors.push(e.message||'Erro JS'));
window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason||'Promise rejeitada')));
const $=s=>document.querySelector(s);
function add(n,ok,d=''){results.push({teste:n,status:ok?'OK':'FALHOU',detalhe:String(d||'')});console[ok?'log':'warn']((ok?'OK':'FALHOU')+' - '+n,d||'');}
async function head(p){try{const r=await fetch(p+'?v548='+Date.now(),{method:'HEAD',cache:'no-store'});add('Arquivo '+p,r.ok,'HTTP '+r.status)}catch(e){add('Arquivo '+p,false,e.message)}}
async function tap(el,name){if(!el){add('Clique '+name,false,'não encontrado');return false}el.scrollIntoView({block:'center',inline:'center'});await sleep(80);el.click();add('Clique '+name,true,el.id||el.textContent||name);return true}
console.log('%cATHOS V54.8 OVERLAY REAL VISÍVEL','font-size:20px;color:#55ff55;background:#111;padding:8px');
for(const f of ['./index.html','./app.js','./sw.js','./assets/render-v54/v54-render-premium.js','./assets/render-v54/v54-render-premium.css']) await head(f);
add('Título V54.8',/V54\.8/i.test(document.title),document.title);
await tap($('#playBtn')||$('#heroPlayBtn'),'Jogar');
await sleep(4300);
const api=window.ATHOS_TEST_API||{};
add('V54.8 ativo',!!api.getV548?.(),JSON.stringify(api.getV548?.()||{}));
add('Overlay independente',api.getV548?.()?.independentOverlay===true,JSON.stringify(api.getV548?.()||{}));
add('Inimigos reais existem',api.getGameplayState?.()?.enemies?.length>=3,JSON.stringify(api.getGameplayState?.()||{}));
add('Powerups reais existem',api.getV53?.()?.powerups>=3,JSON.stringify(api.getV53?.()||{}));
add('Sem erro JS',errors.length===0,errors.slice(-5).join(' | '));
console.table(results);
window.ATHOS_V548_TEST_RESULTS=results;
alert(`Teste V54.8 finalizado.\nOK: ${results.filter(r=>r.status==='OK').length}\nFalhas: ${results.filter(r=>r.status==='FALHOU').length}\nErros JS: ${errors.length}`);
})();