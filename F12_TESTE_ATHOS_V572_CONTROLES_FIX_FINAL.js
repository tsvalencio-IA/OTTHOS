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
async function head(p){try{const r=await fetch(p+'?v572='+Date.now(),{method:'HEAD',cache:'no-store'});add('Arquivo '+p,r.ok,'HTTP '+r.status)}catch(e){add('Arquivo '+p,false,e.message)}}
async function tap(el,name){if(!el){add('Clique '+name,false,'não encontrado');return false}el.scrollIntoView({block:'center',inline:'center'});await sleep(80);el.click();add('Clique '+name,true,el.id||el.textContent||name);return true}
console.log('%cATHOS V57.2 CONTROLES FIX FINAL','font-size:20px;color:#55ff55;background:#111;padding:8px');
for(const f of ['./index.html','./app.js','./style.css','./sw.js','./manifest.webmanifest','./assets/render-v54/v54-render-premium.js','./assets/render-v54/v54-render-premium.css']) await head(f);
add('Título V57.2',/V57\.2/i.test(document.title),document.title);
await tap($('#playBtn')||$('#heroPlayBtn'),'Jogar');
await sleep(5200);
const api=window.ATHOS_TEST_API||{};
add('API V57.2 ativa',!!api.getV572Controls?.(),JSON.stringify(api.getV572Controls?.()||{}));
add('Body class V57.2',document.body.classList.contains('athos-v572-controls'),document.body.className);
const selectors=['#pauseBtn','[data-action="spin"]','#exitBtn','#sizeBtn','#crouchBtn','#powerBtn','#normalBtn','[data-action="interact"]','#jumpBtn'];
const btns=selectors.map(s=>$(s)).filter(Boolean);
add('9 botões encontrados',btns.length===9,btns.map(b=>b.id||b.dataset.action).join(','));
add('9 botões visíveis',btns.every(visible),btns.map(b=>`${b.id||b.dataset.action}:${visible(b)}`).join(' | '));
let bad=[];
for(let i=0;i<btns.length;i++)for(let j=i+1;j<btns.length;j++)if(overlap(btns[i],btns[j]))bad.push(`${btns[i].id||btns[i].dataset.action} x ${btns[j].id||btns[j].dataset.action}`);
add('Botões sem sobreposição',bad.length===0,bad.join(', ')||'ok');
add('Joystick visível',visible($('.joy-ring')),JSON.stringify($('.joy-ring')?.getBoundingClientRect()||{}));
add('Joystick não cobre HUD',!overlap($('.joy-ring'),$('.top-hud')), 'joy x hud');
add('Sem erro JS',errors.length===0,errors.slice(-5).join(' | '));
console.table(results);
window.ATHOS_V572_TEST_RESULTS=results;
alert(`Teste V57.2 finalizado.\nOK: ${results.filter(r=>r.status==='OK').length}\nFalhas: ${results.filter(r=>r.status==='FALHOU').length}\nErros JS: ${errors.length}`);
})();