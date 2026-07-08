(async()=>{
'use strict';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results=[], errors=[];
window.addEventListener('error',e=>errors.push(e.message||'Erro JS'));
window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason||'Promise rejeitada')));
const $=s=>document.querySelector(s);
const visible=el=>!!el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0;
function add(n,ok,d=''){results.push({teste:n,status:ok?'OK':'FALHOU',detalhe:String(d||'')});console[ok?'log':'warn']((ok?'OK':'FALHOU')+' - '+n,d||'');}
async function head(p){try{const r=await fetch(p+'?v52='+Date.now(),{method:'HEAD',cache:'no-store'});add('Arquivo '+p,r.ok,'HTTP '+r.status)}catch(e){add('Arquivo '+p,false,e.message)}}
async function tap(el,name){if(!el){add('Clique '+name,false,'não encontrado');return false} el.scrollIntoView({block:'center',inline:'center'}); await sleep(80); el.click(); add('Clique '+name,true,el.id||el.textContent||name); return true}
function rect(el){const r=el.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}}
console.log('%cATHOS V52 PROFISSIONAL','font-size:20px;color:#55ff55;background:#111;padding:8px');
for(const f of ['./index.html','./style.css','./app.js','./athos.glb','./manifest.webmanifest','./sw.js','./assets/render-v52/referencia-render-absoluto.jpg']) await head(f);
add('Título V52',/V52|PROFISSIONAL/i.test(document.title),document.title);
add('B Poder correto',!!$('#powerBtn[data-action="power"]'),'#powerBtn');
add('Real existe',!!$('.world-chip[data-world="real"]'),'Real');
await tap($('#playBtn')||$('#heroPlayBtn'),'Jogar');
await sleep(4200);
const api=window.ATHOS_TEST_API||{};
const st=api.getV52?.();
add('V52 ativo',st&&st.active===true,JSON.stringify(st||{}));
add('Powerups existem',st&&st.powerups>=3,JSON.stringify(st||{}));
add('Mecânicas declaradas',st&&Array.isArray(st.mechanics)&&st.mechanics.includes('sword')&&st.mechanics.includes('star'),JSON.stringify(st||{}));
add('Joystick visível',visible($('#joystick')),JSON.stringify(rect($('#joystick'))));
add('Botões visíveis',visible($('.action-grid')),JSON.stringify(rect($('.action-grid'))));
let p0=api.getPlayerState?.(); await sleep(450); let p1=api.getPlayerState?.();
add('Athos parado não anda sozinho',p0&&p1&&Math.abs((p1.x-p0.x)||0)<.08&&Math.abs((p1.z-p0.z)||0)<.08,JSON.stringify({antes:p0,depois:p1}));
await tap($('.world-chip[data-world="real"]'),'Real/AR');
await sleep(700);
let p2=api.getPlayerState?.(); await sleep(450); let p3=api.getPlayerState?.();
add('Real não move Athos',p2&&p3&&Math.abs((p3.x-p2.x)||0)<.08&&Math.abs((p3.z-p2.z)||0)<.08,JSON.stringify({antes:p2,depois:p3,ar:api.getARSafety?.()}));
add('Sem erro JS',errors.length===0,errors.slice(-5).join(' | '));
console.table(results);
window.ATHOS_V52_TEST_RESULTS=results;
alert(`Teste V52 finalizado.\nOK: ${results.filter(r=>r.status==='OK').length}\nFalhas: ${results.filter(r=>r.status==='FALHOU').length}\nErros JS: ${errors.length}`);
})();