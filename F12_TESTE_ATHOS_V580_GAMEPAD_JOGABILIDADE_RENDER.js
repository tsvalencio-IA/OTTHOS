(async()=>{
'use strict';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results=[], errors=[];
window.addEventListener('error',e=>errors.push(e.message||'Erro JS'));
window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason||'Promise rejeitada')));
const $=s=>document.querySelector(s);
const visible=el=>!!el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0;
function add(n,ok,d=''){results.push({teste:n,status:ok?'OK':'FALHOU',detalhe:String(d||'')});console[ok?'log':'warn']((ok?'OK':'FALHOU')+' - '+n,d||'');}
function overlap(a,b){const r=a.getBoundingClientRect(),s=b.getBoundingClientRect();return !(r.right<=s.left||s.right<=r.left||r.bottom<=s.top||s.bottom<=r.top)}
async function head(p){try{const r=await fetch(p+'?v580='+Date.now(),{method:'HEAD',cache:'no-store'});add('Arquivo '+p,r.ok,'HTTP '+r.status)}catch(e){add('Arquivo '+p,false,e.message)}}
async function tap(el,name){if(!el){add('Clique '+name,false,'não encontrado');return false}el.scrollIntoView({block:'center',inline:'center'});await sleep(80);el.click();add('Clique '+name,true,el.id||el.textContent||name);return true}
console.log('%cATHOS V58 GAMEPAD JOGABILIDADE RENDER','font-size:20px;color:#55ff55;background:#111;padding:8px');
for(const f of ['./index.html','./app.js','./style.css','./sw.js','./manifest.webmanifest','./assets/render-v54/v54-render-premium.js','./assets/render-v54/v54-render-premium.css']) await head(f);
add('Título V58.0',/V58\.0/i.test(document.title),document.title);
await tap($('#playBtn')||$('#heroPlayBtn'),'Jogar');
await sleep(5200);
const api=window.ATHOS_TEST_API||{};
add('API V58 ativa',!!api.getV580Gamepad?.(),JSON.stringify(api.getV580Gamepad?.()||{}));
const visibleBtns=['#powerBtn','[data-action="interact"]','#jumpBtn'].map(s=>$(s));
const hiddenBtns=['#pauseBtn','#exitBtn','#sizeBtn','#crouchBtn','#normalBtn','[data-action="spin"]'].map(s=>$(s)).filter(Boolean);
add('3 botões principais visíveis',visibleBtns.every(visible),visibleBtns.map(b=>b?.id||b?.dataset?.action).join(','));
add('Botões extras ocultos no gameplay',hiddenBtns.every(b=>!visible(b)),hiddenBtns.map(b=>`${b.id||b.dataset.action}:${visible(b)}`).join(' | '));
add('Botões principais sem sobrepor',!overlap(visibleBtns[0],visibleBtns[1])&&!overlap(visibleBtns[0],visibleBtns[2])&&!overlap(visibleBtns[1],visibleBtns[2]),'3 botões');
add('Joystick visível',visible($('.joy-ring')),JSON.stringify($('.joy-ring')?.getBoundingClientRect()||{}));
add('Ataque disponível',typeof api.getV580Gamepad==='function','interact/swordAttack patched');
add('Sem erro JS',errors.length===0,errors.slice(-5).join(' | '));
console.table(results);
window.ATHOS_V580_TEST_RESULTS=results;
alert(`Teste V58 finalizado.\nOK: ${results.filter(r=>r.status==='OK').length}\nFalhas: ${results.filter(r=>r.status==='FALHOU').length}\nErros JS: ${errors.length}`);
})();