(() => {
  'use strict';
  const api = window.OTTHOS_TEST_API;
  const out = [];
  const check = (teste, ok, detalhe='') => out.push({ teste, status: ok ? 'OK' : 'FALHOU', detalhe });
  const qs = s => document.querySelector(s);

  check('API V602 carregada', api?.version === 'V602_ROLEPLAY_RESTORED_CONTROLS', api?.version || 'sem API');
  const controls = api?.controls?.() || {};
  ['crouch','mini','normal','giant','spin','action','jump','power'].forEach(key => check(`Controle ${key}`, controls[key] === true, String(controls[key])));
  check('Banner de instalação removido', !qs('#installBanner'), qs('#installBanner') ? 'ainda existe' : 'removido');
  check('Instalação somente no lobby', !!qs('#installBtn') && qs('#installBtn')?.closest?.('#lobby'), 'botão do lobby');
  check('Banco IndexedDB V602', api?.database?.().schema === 602, JSON.stringify(api?.database?.()));
  check('Mapa com coordenadas reais', Array.isArray(api?.map?.().locations) && api.map().locations.length >= 9, JSON.stringify(api?.map?.()));
  check('NPC principal não se chama Otto', !Object.prototype.hasOwnProperty.call(api?.getState?.().friendship || {}, 'otto'), JSON.stringify(api?.getState?.().friendship));

  try {
    api?.enterHouseById?.('home');
    api?.teleport?.(-1.7, 19.25);
    const kitchen = api?.getContext?.();
    check('Contexto da cozinha é Cozinhar', kitchen?.id === 'stove-home' && kitchen?.activity === 'stove', JSON.stringify(kitchen));
    api?.teleport?.(3.0, 16.2);
    const chest = api?.getContext?.();
    check('Baú da casa não é inventário genérico', chest?.id === 'chest-home' && chest?.activity === 'chest', JSON.stringify(chest));
    api?.exitHouse?.();
  } catch (error) {
    check('Teste de contexto interno', false, error.message);
  }

  console.table(out);
  window.OTTHOS_V602_TEST_RESULTS = out;
  const failed = out.filter(x => x.status !== 'OK');
  alert(`OTTHOS V602\nOK: ${out.length - failed.length}\nFalhas: ${failed.length}`);
})();
