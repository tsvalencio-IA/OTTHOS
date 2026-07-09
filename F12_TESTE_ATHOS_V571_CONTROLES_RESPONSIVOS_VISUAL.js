(async()=>{
'use strict';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results=[], errors=[];
window.addEventListener('error',e=>errors.push(e.message||'Erro JS'));
window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason||'Promise rejeitada')));
const $=s=>document.querySelector(s);
const visible=el=>!!el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0;
function add(n,ok,d=''){results.push({teste:n,status:ok?'OK':'FALHOU',detalhe:String(d||'')});console[ok?'log':'warn']((ok?'OK':'FALHOU')+' - '+n,d||'');}
async function head(p){try{const r=await fetch(p+'?v571='+Date.now(),{method:'HEAD',cache:'no-store'});add('Arquivo '+p,r.ok,'HTTP '+r.status)}catch(e){add('Arquivo '+p,false,e.message)}}
async function tap(el,name){if(!el){add('Clique '+name,false,'não encontrado');return false}el.scrollIntoView({block:'center',inline:'center'});await sleep(80);el.click();add('Clique '+name,true,el.id||el.textContent||name);return true}
function overlaps(a,b){if(!a||!b)return false;const r=a.getBoundingClientRect(),s=b.getBoundingClientRect();return !(r.right<=s.left||s.right<=r.left||r.bottom<=s.top||s.bottom<=r.top)}
console.log('%cATHOS V57.1 CONTROLES RESPONSIVOS VISUAL','font-size:20px;color:#55ff55;background:#111;padding:8px');
for(const f of ['./index.html','./app.js','./style.css','./sw.js','./manifest.webmanifest','./assets/render-v54/v54-render-premium.js','./assets/render-v54/v54-render-premium.css']) await head(f);
add('Título V57.1',/V57\.1/i.test(document.title),document.title);
await tap($('#playBtn')||$('#heroPlayBtn'),'Jogar');
await sleep(4300);
const api=window.ATHOS_TEST_API||{};
add('API V57.1 ativa',!!api.getV571Controls?.(),JSON.stringify(api.getV571Controls?.()||{}));
const btns=['#pauseBtn','[data-action="spin"]','#exitBtn','#sizeBtn','#crouchBtn','#powerBtn','#normalBtn','[data-action="interact"]','#jumpBtn'].map(s=>$(s)).filter(Boolean);
add('Botões visíveis',btns.length>=8,btns.map(b=>b.id||b.dataset.action).join(', '));
let anyOverlap=false;
for(let i=0;i<btns.length;i++)for(let j=i+1;j<btns.length;j++)if(overlaps(btns[i],btns[j])) anyOverlap=true;
add('Botões sem sobrescrever',!anyOverlap,anyOverlap?'há sobreposição':'ok');
add('Joystick visível',visible($('.joy-ring')),JSON.stringify($('.joy-ring')?.getBoundingClientRect()||{}));
add('Render preservado',!!api.getV54Render?.()?.installed,JSON.stringify(api.getV54Render?.()||{}));
add('Sem erro JS',errors.length===0,errors.slice(-5).join(' | '));
console.table(results);
window.ATHOS_V571_TEST_RESULTS=results;
alert(`Teste V57.1 finalizado.\nOK: ${results.filter(r=>r.status==='OK').length}\nFalhas: ${results.filter(r=>r.status==='FALHOU').length}\nErros JS: ${errors.length}`);
})();