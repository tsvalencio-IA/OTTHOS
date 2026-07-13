(() => {
  'use strict';
  const api = window.OTTHOS_TEST_API;
  const checks = [];
  const check = (name, condition, detail = '') => checks.push({ teste: name, status: condition ? 'OK' : 'FALHOU', detalhe: detail });

  check('API V601 disponível', !!api, api?.version || 'sem API');
  check('Versão Roleplay', api?.version === 'V601_ROLEPLAY_LIFE_SIM', api?.version);
  check('Banco IndexedDB', !!window.OTTHOS_DB, window.OTTHOS_DB?.name || 'indisponível');
  check('Schema 601', window.OTTHOS_DB?.schema === 601, String(window.OTTHOS_DB?.schema));
  check('Estúdio do Otthos', typeof api?.openAvatarStudio === 'function');
  check('Central de trabalhos', typeof api?.openJobCenter === 'function');
  check('Estado de avatar', !!api?.avatar?.(), JSON.stringify(api?.avatar?.() || {}));
  check('Estado de carreira', !!api?.career?.(), JSON.stringify(api?.career?.() || {}));
  check('Athos GLB referenciado', !!document.querySelector('model-viewer[src="./athos.glb"]'));
  check('Botão Meu Otthos', !!document.querySelector('#avatarBtn'));
  check('Menu rápido recolhível', !!document.querySelector('#quickToggleBtn') && !!document.querySelector('#quickBar'));
  check('Necessidades recolhíveis', !!document.querySelector('#needsToggleBtn'));
  check('Instalação apenas no lobby', !document.querySelector('#game [data-install]'));
  check('Moldes preservados', !!document.querySelector('#moldsBtn'));
  check('AR preservado', !!document.querySelector('#arBtn') && !!document.querySelector('#nativeViewer'));
  check('Quiz preservado', !!document.querySelector('#quizBtn'));
  check('Conversar preservado', !!document.querySelector('#talkBtn'));

  console.table(checks);
  window.OTTHOS_V601_TEST_RESULTS = checks;
  const failed = checks.filter(x => x.status !== 'OK');
  alert(`OTTHOS V601 ROLEPLAY\nOK: ${checks.length - failed.length}\nFalhas: ${failed.length}`);
})();
