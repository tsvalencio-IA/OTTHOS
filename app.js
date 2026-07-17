(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpAngle = (a, b, t) => { let d=((b-a+Math.PI)%(Math.PI*2))-Math.PI; if(d<-Math.PI)d+=Math.PI*2; return a+d*t; };
  const distance2D = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const STORAGE_KEY = 'otthos_life_world_roleplay_v624';
  const LEGACY_STORAGE_KEYS = ['otthos_life_world_roleplay_v623','otthos_life_world_roleplay_v622','otthos_life_world_roleplay_v621','otthos_life_world_roleplay_v620','otthos_life_world_roleplay_v619','otthos_life_world_roleplay_v618','otthos_life_world_roleplay_v617','otthos_life_world_roleplay_v616','otthos_life_world_roleplay_v615','otthos_life_world_roleplay_v614','otthos_life_world_roleplay_v613','otthos_life_world_roleplay_v612','otthos_life_world_roleplay_v611','otthos_life_world_roleplay_v610','otthos_life_world_roleplay_v609','otthos_life_world_roleplay_v608','otthos_life_world_roleplay_v607','otthos_life_world_roleplay_v606','otthos_life_world_roleplay_v605','otthos_life_world_roleplay_v604','otthos_life_world_roleplay_v603','otthos_life_world_roleplay_v602','otthos_life_world_roleplay_v601','otthos_life_world_complete_v600'];
  const safeLocalGet = key => { try { return window.localStorage?.getItem(key) ?? null; } catch { return null; } };
  const safeLocalSet = (key, value) => { try { window.localStorage?.setItem(key, value); return true; } catch { return false; } };
  const safeLocalRemove = key => { try { window.localStorage?.removeItem(key); return true; } catch { return false; } };

  const els = {
    lobby: $('#lobby'), game: $('#game'), stage: $('#stage'), screenTint: $('#screenTint'),
    playBtn: $('#playBtn'), continueBtn: $('#continueBtn'), installBtn: $('#installBtn'), installHint: $('#installHint'),
    arBtn: $('#arBtn'), quizBtn: $('#quizBtn'), collectionBtn: $('#collectionBtn'), avatarBtn: $('#avatarBtn'), moldsBtn: $('#moldsBtn'), howBtn: $('#howBtn'), settingsBtn: $('#settingsBtn'),
    lobbyLevel: $('#lobbyLevel'), lobbyCoins: $('#lobbyCoins'), lobbyRep: $('#lobbyRep'), lobbyMedals: $('#lobbyMedals'), lobbyPlayerName: $('#lobbyPlayerName'), profileNameBtn: $('#profileNameBtn'),
    hudLevel: $('#hudLevel'), xpFill: $('#xpFill'), xpText: $('#xpText'), hudCoins: $('#hudCoins'), hudPlayerName: $('#hudPlayerName'),
    needHunger: $('#needHunger'), needEnergy: $('#needEnergy'), needFun: $('#needFun'), needHygiene: $('#needHygiene'),
    missionChapter: $('#missionChapter'), missionTitle: $('#missionTitle'), missionStep: $('#missionStep'), missionFill: $('#missionFill'),
    quickToggleBtn: $('#quickToggleBtn'), quickBar: $('#quickBar'), needsToggleBtn: $('#needsToggleBtn'), missionCard: $('#missionCard'), avatarGameBtn: $('#avatarGameBtn'), inventoryBtn: $('#inventoryBtn'), buildBtn: $('#buildBtn'), mapBtn: $('#mapBtn'), dailyBtn: $('#dailyBtn'), onlineBtn: $('#onlineBtn'), gameSettingsBtn: $('#gameSettingsBtn'), multiplayerBadge: $('#multiplayerBadge'),
    contextPrompt: $('#contextPrompt'), contextIcon: $('#contextIcon'), contextLabel: $('#contextLabel'), contextHint: $('#contextHint'),
    joystick: $('#joystick'), joystickKnob: $('#joystickKnob'), runBtn: $('#runBtn'), specialBtn: $('#specialBtn'), actionBtn: $('#actionBtn'), jumpBtn: $('#jumpBtn'), crouchBtn: $('#crouchBtn'), miniBtn: $('#miniBtn'), normalBtn: $('#normalBtn'), giantBtn: $('#giantBtn'), spinBtn: $('#spinBtn'), skillsToggleBtn: $('#skillsToggleBtn'), secondaryActions: document.querySelector('.secondary-actions'),
    miniNav: $('#miniNav'), miniMapCanvas: $('#miniMapCanvas'), miniNavName: $('#miniNavName'), miniNavDistance: $('#miniNavDistance'), miniNavArrow: $('#miniNavArrow'),
    cameraControls: $('#cameraControls'), cameraNearBtn: $('#cameraNearBtn'), cameraResetBtn: $('#cameraResetBtn'), cameraFarBtn: $('#cameraFarBtn'),
    buildBadge: $('#buildBadge'), buildTypeLabel: $('#buildTypeLabel'), vehicleBadge: $('#vehicleBadge'), raceBadge: $('#raceBadge'), raceTitle: $('#raceTitle'), raceStatus: $('#raceStatus'), toast: $('#toast'),
    modal: $('#modal'), modalTitle: $('#modalTitle'), modalBody: $('#modalBody'), modalClose: $('#modalClose'), challengePrompt: $('#challengePrompt'), challengePromptKicker: $('#challengePromptKicker'), challengePromptTitle: $('#challengePromptTitle'), challengePromptText: $('#challengePromptText'), challengePromptAccept: $('#challengePromptAccept'), challengePromptDecline: $('#challengePromptDecline'),
    nativeViewer: $('#nativeViewer'), viewerShell: $('#viewerShell'), viewerPlaceholder: $('#viewerPlaceholder'), viewerLoadBtn: $('#viewerLoadBtn'), viewerStatus: $('#viewerStatus'), insideArBtn: $('#insideArBtn')
  };

  const defaultState = () => ({
    version: 624,
    profile: { playerId: uid(), name: '', nameConfirmed: false, level: 1, xp: 0, coins: 500, reputation: 0 },
    needs: { hunger: 92, energy: 92, fun: 86, hygiene: 88 },
    inventory: { wood: 0, stone: 0, food: 2, water: 2, crystals: 0, blocks: 4, fences: 2, keys: 0 },
    homeStorage: { wood: 0, stone: 0, food: 0, water: 0, crystals: 0 },
    houses: {
      home: { owned: true, locked: false, home: true },
      blue: { owned: false, locked: true, price: 250 },
      pink: { owned: false, locked: true, price: 420 },
      cabin: { owned: false, locked: false, price: 180 }
    },
    friendship: { nino: 0, luna: 0, teo: 0, bia: 0, maya: 0 },
    avatar: { outfit: 'classic', hat: 'none', accessory: 'none' },
    career: { title: 'Morador da Vila', level: 1, xp: 0, completed: 0, activeJob: null },
    social: { invited: [], gifts: 0, jokes: 0, arguments: 0, chatHiddenBefore:0 },
    abilities: { scaleMode: 'normal', crouched: false },
    races: { wins: 0, losses: 0, coinWins: 0, houseWins: 0, bestTime: 0 },
    waypoint: null,
    ui: { quickOpen: false, needsOpen: false, missionOpen: false, skillsOpen: false },
    flags: {},
    completedChapters: [],
    medals: [],
    builds: [],
    defeated: 0,
    position: { x: 0, y: 0, z: 8, yaw: 0 },
    settings: { sound: true, quality: 'auto', autoTier: 'balanced', vibration: true, cameraZoom: 0, joystickNatural: true },
    stats: { walked:0, driven:0, jumps:0, collected:0, talks:0, cooked:0, races:0, actions:0 },
    daily: { date:'', streak:0, lastDate:'', quests:[] },
    learning: { crowns:0, totalCorrect:0, lessons:{}, lastLesson:'', perfectLessons:0, subjectXP:{math:0,portuguese:0,english:0}, multiplayerWins:0, multiplayerPlayed:0, matchHistory:[] },
    multiplayer: { enabled:true, room:'mundo-publico', displayName:'', cloudUid:'', cloudReady:false },
    npcSociety: { lastEvent:0, houses:{}, friendships:{}, moods:{} },
    lastSaved: Date.now()
  });

  function normalizeState(saved = {}) {
    const fresh = defaultState();
    const oldFriendship = saved.friendship || {};
    const friendship = { ...fresh.friendship, ...oldFriendship };
    if (oldFriendship.otto !== undefined && oldFriendship.nino === undefined) friendship.nino = oldFriendship.otto;
    delete friendship.otto;
    const flags = { ...(saved.flags || {}) };
    if (flags.talkedOtto && !flags.talkedNeighbor) flags.talkedNeighbor = true;
    return {
      ...fresh,
      ...saved,
      version: 624,
      profile: { ...fresh.profile, ...(saved.profile || {}) },
      needs: { ...fresh.needs, ...(saved.needs || {}) },
      inventory: { ...fresh.inventory, ...(saved.inventory || {}) },
      homeStorage: { ...fresh.homeStorage, ...(saved.homeStorage || {}) },
      houses: { ...fresh.houses, ...(saved.houses || {}) },
      friendship,
      flags,
      settings: { ...fresh.settings, ...(saved.settings || {}), quality: Number(saved.version||0)<615 && (saved.settings?.quality||'high')==='high' ? 'auto' : ((saved.settings?.quality)||fresh.settings.quality) },
      stats: { ...fresh.stats, ...(saved.stats || {}) },
      daily: { ...fresh.daily, ...(saved.daily || {}), quests:Array.isArray(saved.daily?.quests)?saved.daily.quests:[] },
      learning: { ...fresh.learning, ...(saved.learning || {}), subjectXP:{...fresh.learning.subjectXP,...(saved.learning?.subjectXP||{})}, lessons:{...fresh.learning.lessons,...(saved.learning?.lessons||{})}, matchHistory:Array.isArray(saved.learning?.matchHistory)?saved.learning.matchHistory:[] },
      multiplayer: { ...fresh.multiplayer, ...(saved.multiplayer || {}), room:'mundo-publico' },
      npcSociety: { ...fresh.npcSociety, ...(saved.npcSociety || {}), houses:{...fresh.npcSociety.houses,...(saved.npcSociety?.houses||{})}, friendships:{...fresh.npcSociety.friendships,...(saved.npcSociety?.friendships||{})}, moods:{...fresh.npcSociety.moods,...(saved.npcSociety?.moods||{})} },
      avatar: { ...fresh.avatar, ...(saved.avatar || {}) },
      career: { ...fresh.career, ...(saved.career || {}) },
      social: { ...fresh.social, ...(saved.social || {}) },
      abilities: { ...fresh.abilities, ...(saved.abilities || {}) },
      races: { ...fresh.races, ...(saved.races || {}) },
      ui: { ...fresh.ui, ...(saved.ui || {}) },
      builds: Array.isArray(saved.builds) ? saved.builds : [],
      medals: Array.isArray(saved.medals) ? saved.medals : [],
      completedChapters: Array.isArray(saved.completedChapters) ? saved.completedChapters : []
    };
  }

  function loadState() {
    const fresh = defaultState();
    try {
      let raw = safeLocalGet(STORAGE_KEY);
      if (!raw) {
        for (const key of LEGACY_STORAGE_KEYS) {
          raw = safeLocalGet(key);
          if (raw) break;
        }
      }
      if (!raw) return fresh;
      const saved = JSON.parse(raw);
      return normalizeState(saved);
    } catch (error) {
      console.warn('Falha ao ler progresso; usando estado novo.', error);
      return fresh;
    }
  }

  let state = loadState();
  if(!state.profile.nameConfirmed){
    const legacyName=String(state.profile.name||'').trim();
    if(legacyName&&legacyName.toLowerCase()!=='otthos'){state.profile.name=legacyName;state.profile.nameConfirmed=true;}
    else{state.profile.name='';state.profile.nameConfirmed=false;}
  }
  state.multiplayer.displayName=state.profile.name||'';state.multiplayer.room='mundo-publico';
  let dbReady = Promise.resolve();
  if (window.OTTHOS_DB) {
    dbReady = window.OTTHOS_DB.load().then(saved => {
      if (saved && saved.profile) {
        state = normalizeState(saved);
        safeLocalSet(STORAGE_KEY, JSON.stringify(state));
      } else {
        window.OTTHOS_DB.save(state).catch(console.warn);
      }
      ensureDailyChallenges();updateLobbyStats();
      updateHUD();updateDailyBadge();
      return state;
    }).catch(error => { console.warn('IndexedDB indisponível; usando armazenamento local.', error); return state; });
    window.OTTHOS_DB.requestPersistentStorage().catch(() => false);
  }
  let saveTimer = 0;
  let lastSavePromise = Promise.resolve(true);
  function commitState() {
    state.version = 621;
    state.lastSaved = Date.now();
    const snapshot = JSON.parse(JSON.stringify(state));
    safeLocalSet(STORAGE_KEY, JSON.stringify(snapshot));
    lastSavePromise = window.OTTHOS_DB
      ? lastSavePromise.catch(()=>true).then(()=>window.OTTHOS_DB.save(snapshot)).catch(error => {
          console.warn('Falha no IndexedDB; cópia local mantida.', error);
          return false;
        })
      : Promise.resolve(true);
    ensureDailyChallenges();updateLobbyStats();updateDailyBadge();
    lastSavePromise.finally(()=>syncCloudProgress(false));
    return lastSavePromise;
  }
  function saveState(immediate = false) {
    state.lastSaved = Date.now();
    clearTimeout(saveTimer);
    if (immediate) return commitState();
    saveTimer = setTimeout(commitState, 140);
    return lastSavePromise;
  }

  function cloudProgressPayload(){
    return {
      version: 624,lastSaved:Number(state.lastSaved||Date.now()),
      profile:{name:state.profile.name||'Jogador',coins:state.profile.coins||0,xp:state.profile.xp||0,level:state.profile.level||1,reputation:state.profile.reputation||0},
      inventory:{...state.inventory},medals:[...(state.medals||[])],flags:{...state.flags},houses:{...state.houses},races:{...state.races},
      avatar:{...state.avatar},abilities:{...state.abilities},builds:[...(state.builds||[])],homeStorage:{...state.homeStorage},
      achievements:{stats:{...state.stats},daily:{...state.daily,quests:[...(state.daily?.quests||[])]},learning:{...state.learning,subjectXP:{...state.learning.subjectXP},lessons:{...state.learning.lessons}}},position:{...state.position}
    };
  }
  function syncCloudProgress(force=false){
    if(!hasValidPlayerName())return false;
    return window.OTTHOS_RTDB?.syncProgress?.(cloudProgressPayload(),force)||false;
  }
  function mergeCloudProgress(remote){
    if(!remote||typeof remote!=='object')return false;
    const remoteSaved=Number(remote.lastSaved||0),localSaved=Number(state.lastSaved||0);
    if(remoteSaved<=localSaved+2500){syncCloudProgress(true);return false;}
    const merged={...state,
      profile:{...state.profile,...(remote.profile||{}),name:state.profile.name||remote.profile?.name||'Jogador',nameConfirmed:true},
      inventory:{...state.inventory,...(remote.inventory||{})},medals:Array.isArray(remote.medals)?remote.medals:state.medals,
      flags:{...state.flags,...(remote.flags||{})},houses:{...state.houses,...(remote.houses||{})},races:{...state.races,...(remote.races||{})},
      avatar:{...state.avatar,...(remote.avatar||{})},abilities:{...state.abilities,...(remote.abilities||{})},
      builds:Array.isArray(remote.builds)?remote.builds:state.builds,homeStorage:{...state.homeStorage,...(remote.homeStorage||{})},
      stats:{...state.stats,...(remote.achievements?.stats||{})},daily:{...state.daily,...(remote.achievements?.daily||{})},learning:{...state.learning,...(remote.achievements?.learning||{}),subjectXP:{...state.learning.subjectXP,...(remote.achievements?.learning?.subjectXP||{})},lessons:{...state.learning.lessons,...(remote.achievements?.learning?.lessons||{})}},
      position:{...state.position,...(remote.position||{})},lastSaved:remoteSaved,version: 624
    };
    state=normalizeState(merged);state.profile.nameConfirmed=true;state.multiplayer.room='mundo-publico';
    safeLocalSet(STORAGE_KEY,JSON.stringify(state));window.OTTHOS_DB?.save?.(state).catch(()=>{});updatePlayerNameUI();updateHUD();updateLobbyStats();toast('Progresso recuperado do Firebase.','good',2300);return true;
  }

  function addXP(amount) {
    state.profile.xp += Math.max(0, Math.round(amount));
    const nextLevel = Math.floor(state.profile.xp / 1000) + 1;
    if (nextLevel > state.profile.level) {
      state.profile.level = nextLevel;
      toast(`Nível ${nextLevel}!`, 'good');
      awardMedal(`Nível ${nextLevel}`);
    }
    saveState();
    updateHUD();
  }
  function addCoins(amount) {
    state.profile.coins = Math.max(0, state.profile.coins + Math.round(amount));
    saveState(); updateHUD();
  }
  function addReputation(amount) {
    state.profile.reputation = Math.max(0, state.profile.reputation + Math.round(amount));
    saveState(); updateHUD();
  }
  function awardMedal(name) {
    if (state.medals.includes(name)) return;
    state.medals.push(name);
    toast(`🏅 ${name}`, 'good');
    saveState();
  }
  function setFlag(flag, value = true) {
    if (state.flags[flag] === value) return;
    state.flags[flag] = value;
    evaluateMissions();
    saveState();
  }

  function showScreen(name) {
    els.lobby.classList.toggle('active', name === 'lobby');
    els.game.classList.toggle('active', name === 'game');
    queueMicrotask(() => typeof updateInstallUI === 'function' && updateInstallUI());
  }
  function toast(text, type = 'good', ms = 1700) {
    els.toast.textContent = text;
    els.toast.className = `toast show ${type}`;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => els.toast.classList.remove('show'), ms);
  }
  function vibrate(pattern = 30) {
    if (state.settings.vibration && navigator.vibrate) navigator.vibrate(pattern);
  }
  function beep(freq = 500, duration = 70, type = 'square') {
    if (!state.settings.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = beep.ctx || (beep.ctx = new Ctx());
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type; osc.frequency.value = freq; gain.gain.value = .025;
      osc.connect(gain); gain.connect(ctx.destination); osc.start();
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration / 1000);
      osc.stop(ctx.currentTime + duration / 1000);
    } catch {}
  }

  function openModal(title, html, onReady) {
    state.ui.quickOpen = false;
    if (els.quickBar) els.quickBar.hidden = true;
    els.quickToggleBtn?.classList.remove('active');
    input.keys?.clear?.();
    input.targetX = input.targetZ = input.x = input.z = 0;
    if (typeof player !== 'undefined' && player.vehicle) player.car.speed *= .7;
    els.modalTitle.textContent = title;
    els.modalBody.innerHTML = html;
    els.modal.hidden = false;
    document.body.classList.add('modal-open');
    els.game?.setAttribute('aria-hidden', 'true');
    if (onReady) onReady(els.modalBody);
  }
  function closeModal() {
    const resumePausedGame = pauseMenuOpen;
    els.modal.hidden = true;
    els.modal.classList.remove('map-modal');
    els.modalBody.innerHTML = '';
    document.body.classList.remove('modal-open');
    els.game?.removeAttribute('aria-hidden');
    input.keys?.clear?.();
    input.targetX = input.targetZ = input.x = input.z = 0;
    if (resumePausedGame) {
      pauseMenuOpen = false;
      paused = false;
      if (running && player.vehicle) startEngineSound();
    }
  }
  function confirmModal(title, text, yesLabel = 'Sim', noLabel = 'Não') {
    return new Promise(resolve => {
      openModal(title, `<p>${text}</p><div class="modal-actions"><button class="btn primary" data-yes>${yesLabel}</button><button class="btn" data-no>${noLabel}</button></div>`, root => {
        $('[data-yes]', root).onclick = () => { closeModal(); resolve(true); };
        $('[data-no]', root).onclick = () => { closeModal(); resolve(false); };
      });
    });
  }
  els.modalClose.onclick = closeModal;
  els.modal.addEventListener('pointerdown', e => { if (e.target === els.modal) closeModal(); });

  /* PWA — instalação aparece somente no lobby e apenas quando realmente disponível */
  let deferredInstallPrompt = null;
  const isStandalone = () => window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true || safeLocalGet('otthos_installed') === '1';
  function updateInstallUI() {
    const installed = isStandalone();
    const canInstall = !installed && !!deferredInstallPrompt;
    if (els.installBtn) els.installBtn.hidden = !canInstall;
    if (els.installHint) {
      els.installHint.hidden = !canInstall;
      els.installHint.textContent = canInstall ? 'Instale uma única vez e continue do ponto salvo.' : '';
    }
    document.documentElement.classList.toggle('app-installed', installed);
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallUI();
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    safeLocalSet('otthos_installed', '1');
    updateInstallUI();
    toast('Aplicativo instalado!', 'good');
  });
  window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change', updateInstallUI);
  async function installApp() {
    if (isStandalone()) { updateInstallUI(); return; }
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      updateInstallUI();
      return;
    }
    const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    openModal('Instalar aplicativo', isiOS
      ? '<p>No iPhone/iPad, toque em <b>Compartilhar</b> e escolha <b>Adicionar à Tela de Início</b>.</p>'
      : '<p>No Chrome, abra o menu ⋮ e escolha <b>Instalar aplicativo</b> ou <b>Adicionar à tela inicial</b>.</p>');
  }
  if (els.installBtn) els.installBtn.onclick = installApp;
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js?v=623').catch(console.warn));
  updateInstallUI();


  const DAILY_QUEST_POOL=[
    {id:'walk',icon:'👟',title:'Explorador da Vila',target:180,reward:90,xp:50,label:n=>`${Math.floor(n)}/180 m caminhando`},
    {id:'drive',icon:'🚗',title:'Piloto da Vila',target:260,reward:120,xp:70,label:n=>`${Math.floor(n)}/260 m dirigindo`},
    {id:'jump',icon:'⬆',title:'Pula-pula',target:12,reward:70,xp:45,label:n=>`${Math.floor(n)}/12 pulos`},
    {id:'collect',icon:'💎',title:'Caçador de Tesouros',target:5,reward:95,xp:60,label:n=>`${Math.floor(n)}/5 itens coletados`},
    {id:'talk',icon:'💬',title:'Amigo da Vizinhança',target:3,reward:80,xp:50,label:n=>`${Math.floor(n)}/3 conversas`},
    {id:'cook',icon:'🍳',title:'Chef da Vila',target:1,reward:75,xp:45,label:n=>`${Math.floor(n)}/1 refeição`},
    {id:'race',icon:'🏁',title:'Competidor',target:1,reward:130,xp:80,label:n=>`${Math.floor(n)}/1 corrida concluída`}
  ];
  function localDateKey(){const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function daysBetween(a,b){if(!a||!b)return 99;return Math.round((new Date(`${b}T12:00:00`)-new Date(`${a}T12:00:00`))/86400000)}
  function ensureDailyChallenges(){const key=localDateKey();if(state.daily.date===key&&state.daily.quests?.length)return;const gap=daysBetween(state.daily.lastDate,key);state.daily.streak=gap===1?(state.daily.streak||0)+1:gap===0?(state.daily.streak||1):1;let seed=Number(key.replaceAll('-',''));const pool=[...DAILY_QUEST_POOL],picked=[];while(picked.length<3&&pool.length){seed=(seed*9301+49297)%233280;const q=pool.splice(Math.floor(seed/233280*pool.length),1)[0];picked.push({id:q.id,progress:0,target:q.target,reward:q.reward,xp:q.xp,claimed:false});}state.daily={date:key,lastDate:key,streak:state.daily.streak||1,quests:picked};saveState();}
  function dailyDefinition(id){return DAILY_QUEST_POOL.find(q=>q.id===id)}
  function trackDaily(type,amount=1){
    ensureDailyChallenges();let changed=false,completedNow=false;
    for(const q of state.daily.quests){if(q.id!==type||q.claimed)continue;const before=q.progress;q.progress=clamp((q.progress||0)+amount,0,q.target);if(q.progress!==before){changed=true;if(before<q.target&&q.progress>=q.target)completedNow=true;}}
    if(!changed)return;updateDailyBadge();const now=performance.now();
    if(completedNow||!trackDaily.lastSave||now-trackDaily.lastSave>6000){trackDaily.lastSave=now;saveState();}
  }
  function updateDailyBadge(){if(!els.dailyBtn)return;ensureDailyChallenges();const ready=state.daily.quests.filter(q=>!q.claimed&&q.progress>=q.target).length;els.dailyBtn.classList.toggle('reward-ready',ready>0);const span=$('span',els.dailyBtn);if(span)span.textContent=ready?`Prêmio ${ready}`:'Desafios';}
  function claimDailyQuest(index){const q=state.daily.quests[index],def=dailyDefinition(q?.id);if(!q||!def||q.claimed||q.progress<q.target)return;q.claimed=true;addCoins(q.reward);addXP(q.xp);addReputation(3);beep(980,90);vibrate(30);toast(`Desafio concluído! +${q.reward} moedas`,'good',2200);saveState(true);openDailyChallenges();}
  const EDUCATION_SUBJECTS={
    math:{id:'math',title:'Matemática Kids',icon:'🔢',color:'#27b36a',description:'Contagem, soma, subtração, padrões e lógica.'},
    portuguese:{id:'portuguese',title:'Português Kids',icon:'📚',color:'#7b5ce6',description:'Letras, sílabas, palavras e frases.'},
    english:{id:'english',title:'English Kids',icon:'🌎',color:'#168de2',description:'Palavras, imagens, sons e expressões.'}
  };
  const WORD_BANK=[
    {pt:'CASA',en:'HOUSE',emoji:'🏠',syllables:['CA','SA']},{pt:'GATO',en:'CAT',emoji:'🐱',syllables:['GA','TO']},{pt:'BOLA',en:'BALL',emoji:'⚽',syllables:['BO','LA']},{pt:'SOL',en:'SUN',emoji:'☀️',syllables:['SOL']},{pt:'LIVRO',en:'BOOK',emoji:'📘',syllables:['LI','VRO']},{pt:'ÁGUA',en:'WATER',emoji:'💧',syllables:['Á','GUA']},{pt:'CARRO',en:'CAR',emoji:'🚗',syllables:['CAR','RO']},{pt:'CACHORRO',en:'DOG',emoji:'🐶',syllables:['CA','CHOR','RO']},{pt:'MAÇÃ',en:'APPLE',emoji:'🍎',syllables:['MA','ÇÃ']},{pt:'PEIXE',en:'FISH',emoji:'🐟',syllables:['PEI','XE']},{pt:'PÁSSARO',en:'BIRD',emoji:'🐦',syllables:['PÁS','SA','RO']},{pt:'LEITE',en:'MILK',emoji:'🥛',syllables:['LEI','TE']}
  ];
  const SUBJECT_LEVELS={
    math:[['Contagem divertida','Conte objetos e escolha o número.'],['Somas rápidas','Junte quantidades.'],['Subtração kids','Descubra quanto sobrou.'],['Complete a sequência','Encontre o número que falta.'],['Compare números','Maior, menor ou igual.'],['Desafio misto','Misture tudo o que aprendeu.']],
    portuguese:[['Primeira letra','Descubra como a palavra começa.'],['Imagem e palavra','Ligue a imagem ao nome.'],['Vogal perdida','Complete a palavra.'],['Monte a palavra','Coloque as sílabas na ordem.'],['Frase correta','Escolha a frase que faz sentido.'],['Desafio de leitura','Misture letras, palavras e frases.']],
    english:[['Picture words','Ligue imagem e palavra em inglês.'],['Português → English','Encontre a tradução.'],['Listen and choose','Ouça e escolha a palavra.'],['Missing letter','Complete a palavra em inglês.'],['Useful phrases','Aprenda frases simples.'],['English challenge','Misture tudo o que aprendeu.']]
  };
  function seeded(seed){let s=(Number(seed)||1)>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296);}
  function shuffled(values,rand=Math.random){return [...values].sort(()=>rand()-.5);}
  function choiceSet(answer,candidates,rand){const pool=shuffled([...new Set(candidates.filter(x=>String(x)!==String(answer)))],rand).slice(0,3);return shuffled([answer,...pool],rand);}
  function mathRound(level,rand,index){
    const emoji=['🍎','⭐','🚗','🐟'][Math.floor(rand()*4)];
    if(level===1){const n=1+Math.floor(rand()*9);return{kind:'choice',visual:emoji.repeat(n),prompt:'Quantos objetos aparecem?',answer:String(n),options:choiceSet(String(n),[n-2,n-1,n+1,n+2].filter(x=>x>0).map(String),rand)};}
    if(level===2){const a=1+Math.floor(rand()*8),b=1+Math.floor(rand()*7),ans=a+b;return{kind:'choice',visual:`${emoji.repeat(a)} + ${emoji.repeat(b)}`,prompt:`Quanto é ${a} + ${b}?`,answer:String(ans),options:choiceSet(String(ans),[ans-2,ans-1,ans+1,ans+2].map(String),rand)};}
    if(level===3){const a=5+Math.floor(rand()*10),b=1+Math.floor(rand()*Math.min(8,a)),ans=a-b;return{kind:'choice',visual:`${a} − ${b}`,prompt:'Quanto sobrou?',answer:String(ans),options:choiceSet(String(ans),[ans-2,ans-1,ans+1,ans+2].filter(x=>x>=0).map(String),rand)};}
    if(level===4){const start=1+Math.floor(rand()*5),step=1+Math.floor(rand()*3),seq=[start,start+step,'?',start+step*3],ans=start+step*2;return{kind:'choice',visual:seq.join('  •  '),prompt:'Qual número completa a sequência?',answer:String(ans),options:choiceSet(String(ans),[ans-step,ans+step,ans+2,ans-1].map(String),rand)};}
    if(level===5){const a=1+Math.floor(rand()*20),b=1+Math.floor(rand()*20),ans=a===b?'=':a>b?'>':'<';return{kind:'choice',visual:`${a}  ?  ${b}`,prompt:'Escolha o sinal correto.',answer:ans,options:['>','<','=']};}
    return mathRound(1+Math.floor(rand()*5),rand,index);
  }
  function portugueseRound(level,rand,index){
    const word=WORD_BANK[Math.floor(rand()*WORD_BANK.length)];
    if(level===1){const ans=word.pt[0];return{kind:'choice',visual:word.emoji,prompt:`Com qual letra começa ${word.pt}?`,answer:ans,options:choiceSet(ans,['A','B','C','G','L','M','P','S','T'],rand)};}
    if(level===2){return{kind:'choice',visual:word.emoji,prompt:'Qual é o nome desta imagem?',answer:word.pt,options:choiceSet(word.pt,WORD_BANK.map(w=>w.pt),rand)};}
    if(level===3){const positions=[...word.pt].map((c,i)=>/[AEIOUÁÉÍÓÚÃÕ]/.test(c)?i:-1).filter(i=>i>=0),pos=positions[Math.floor(rand()*positions.length)]??1,ans=word.pt[pos],masked=[...word.pt];masked[pos]='_';return{kind:'choice',visual:word.emoji,prompt:`Complete: ${masked.join('')}`,answer:ans,options:choiceSet(ans,['A','E','I','O','U'],rand)};}
    if(level===4){return{kind:'sequence',visual:word.emoji,prompt:'Toque nas sílabas para montar a palavra.',answer:word.syllables.join(''),tokens:shuffled(word.syllables,rand),displayAnswer:word.pt};}
    if(level===5){const correct=`O ${word.pt.toLowerCase()} aparece na imagem.`;return{kind:'choice',visual:word.emoji,prompt:'Qual frase está escrita corretamente?',answer:correct,options:shuffled([correct,`A ${word.pt.toLowerCase()} aparecem na imagem.`,`Os ${word.pt.toLowerCase()} aparece na imagem.`],rand)};}
    return portugueseRound(1+Math.floor(rand()*5),rand,index);
  }
  function englishRound(level,rand,index){
    const word=WORD_BANK[Math.floor(rand()*WORD_BANK.length)];
    if(level===1){return{kind:'choice',visual:word.emoji,prompt:'Choose the English word.',answer:word.en,options:choiceSet(word.en,WORD_BANK.map(w=>w.en),rand),speak:word.en};}
    if(level===2){return{kind:'choice',visual:word.pt,prompt:`Como se diz “${word.pt.toLowerCase()}” em inglês?`,answer:word.en,options:choiceSet(word.en,WORD_BANK.map(w=>w.en),rand),speak:word.en};}
    if(level===3){return{kind:'choice',visual:'🔊',prompt:'Ouça e escolha a palavra.',answer:word.en,options:choiceSet(word.en,WORD_BANK.map(w=>w.en),rand),speak:word.en,autoSpeak:true};}
    if(level===4){const pos=Math.floor(rand()*word.en.length),ans=word.en[pos],masked=[...word.en];masked[pos]='_';return{kind:'choice',visual:word.emoji,prompt:`Complete: ${masked.join('')}`,answer:ans,options:choiceSet(ans,'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),rand),speak:word.en};}
    if(level===5){const phrases=[['HELLO','Olá'],['THANK YOU','Obrigado'],['GOOD MORNING','Bom dia'],['PLEASE','Por favor'],['GOODBYE','Tchau']],pair=phrases[Math.floor(rand()*phrases.length)];return{kind:'choice',visual:'💬',prompt:`Qual é o significado de “${pair[0]}”?`,answer:pair[1],options:choiceSet(pair[1],phrases.map(p=>p[1]),rand),speak:pair[0]};}
    return englishRound(1+Math.floor(rand()*5),rand,index);
  }
  function generateEducationRounds(subject,level=1,seed=Date.now(),count=5){const rand=seeded(seed+level*997),maker=subject==='math'?mathRound:subject==='portuguese'?portugueseRound:englishRound;return Array.from({length:count},(_,i)=>maker(level,rand,i));}
  function subjectLevelRecord(subject,level){return state.learning.lessons[`${subject}-${level}`]||{completed:false,stars:0,best:0,attempts:0};}
  function subjectUnlocked(subject,level){return level===1||subjectLevelRecord(subject,level-1).completed;}
  function educationSummary(){let done=0,total=0;for(const id of Object.keys(EDUCATION_SUBJECTS))for(let l=1;l<=6;l++){total++;if(subjectLevelRecord(id,l).completed)done++;}return{done,total,pct:Math.round(done/total*100)};}
  function speakKidWord(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text));u.lang='en-US';u.rate=.78;u.pitch=1.08;speechSynthesis.speak(u);}catch{}}
  function dailyChallengesHtml(){ensureDailyChallenges();return state.daily.quests.map((q,i)=>{const d=dailyDefinition(q.id),pct=clamp(q.progress/q.target*100,0,100),ready=q.progress>=q.target&&!q.claimed;return`<article class="daily-card ${ready?'ready':''} ${q.claimed?'claimed':''}"><div class="daily-icon">${d.icon}</div><div><b>${d.title}</b><span>${d.label(q.progress)}</span><div class="daily-progress"><i style="width:${pct}%"></i></div><small>${q.reward} moedas • ${q.xp} XP</small></div><button data-daily-claim="${i}" ${ready?'':'disabled'}>${q.claimed?'✓':ready?'Receber':'Em andamento'}</button></article>`}).join('');}
  function educationSubjectHtml(subject){const s=EDUCATION_SUBJECTS[subject],levels=SUBJECT_LEVELS[subject];return`<section class="edu-subject" style="--edu:${s.color}"><header><span>${s.icon}</span><div><b>${s.title}</b><small>${s.description}</small></div></header><div class="edu-path">${levels.map((data,i)=>{const level=i+1,rec=subjectLevelRecord(subject,level),unlocked=subjectUnlocked(subject,level);return`<button class="edu-node ${rec.completed?'done':''} ${unlocked?'':'locked'}" data-edu-play="${subject}" data-edu-level="${level}" ${unlocked?'':'disabled'}><i>${rec.completed?'✓':unlocked?s.icon:'🔒'}</i><span><b>${level}. ${data[0]}</b><small>${rec.completed?`${'⭐'.repeat(rec.stars||1)} • recorde ${rec.best}/5`:data[1]}</small></span></button>`}).join('')}</div></section>`;}
  function openEducationHub(tab='math'){
    ensureDailyChallenges();const summary=educationSummary(),valid=(EDUCATION_SUBJECTS[tab]||tab==='multiplayer'||tab==='daily')?tab:'math';
    const tabs=`<div class="edu-tabs"><button data-edu-tab="math" class="${valid==='math'?'active':''}">🔢 Matemática</button><button data-edu-tab="portuguese" class="${valid==='portuguese'?'active':''}">📚 Português</button><button data-edu-tab="english" class="${valid==='english'?'active':''}">🌎 English</button><button data-edu-tab="multiplayer" class="${valid==='multiplayer'?'active':''}">⚔️ Duelo</button><button data-edu-tab="daily" class="${valid==='daily'?'active':''}">🎯 Diários</button></div>`;
    const startCards=`<div class="academy-start"><button data-academy-start="math"><span>🔢</span><b>Jogar Matemática</b><small>Contagem, soma e lógica</small></button><button data-academy-start="portuguese"><span>📚</span><b>Jogar Português</b><small>Letras, sílabas e leitura</small></button><button data-academy-start="english"><span>🌎</span><b>Jogar English</b><small>Imagens, palavras e áudio</small></button></div>`;
    const multi=`<div class="edu-multiplayer-intro"><div>⚔️</div><h3>Duelo educativo em tempo real</h3><p>Escolha um jogador online, envie o convite e os dois recebem a mesma partida. O convite aparece na tela com <b>Aceitar e jogar</b>.</p><button class="btn primary xl" data-open-online>Escolher jogador online</button></div>`;
    const content=valid==='daily'?`<div class="daily-header"><b>Desafios de hoje</b><span>Complete atividades dentro do mundo aberto.</span></div><div class="daily-list">${dailyChallengesHtml()}</div>`:valid==='multiplayer'?multi:`${startCards}${educationSubjectHtml(valid)}`;
    openModal(`Academia Kids de ${playerDisplayName()}`,`<div class="academy-banner"><div>🎓</div><section><b>JOGOS KIDS</b><span>Aprenda jogando dentro do mundo aberto.</span></section></div><div class="learning-top"><div><b>🔥 ${state.daily.streak||1}</b><small>sequência</small></div><div><b>👑 ${state.learning.crowns||0}</b><small>coroas</small></div><div><b>⭐ ${summary.pct}%</b><small>trilha</small></div></div>${tabs}<div class="learning-content">${content}</div>`,root=>{
      root.onclick=e=>{const tabBtn=e.target.closest('[data-edu-tab]'),playBtn=e.target.closest('[data-edu-play]'),startBtn=e.target.closest('[data-academy-start]'),claimBtn=e.target.closest('[data-daily-claim]'),onlineBtn=e.target.closest('[data-open-online]');if(tabBtn){openEducationHub(tabBtn.dataset.eduTab);return;}if(startBtn){startSoloEducationGame(startBtn.dataset.academyStart,1);return;}if(playBtn){startSoloEducationGame(playBtn.dataset.eduPlay,Number(playBtn.dataset.eduLevel));return;}if(claimBtn){claimDailyQuest(Number(claimBtn.dataset.dailyClaim));return;}if(onlineBtn){openSocialHub();}};
    });
  }
  function openChallengeHub(tab='math'){openEducationHub(tab==='path'?'math':tab);}
  function openDailyChallenges(){openEducationHub('daily');}
  function runEducationGame({subject,level=1,seed=Date.now(),rounds=5,multiplayer=false,opponent='',onFinish=null}){
    const def=EDUCATION_SUBJECTS[subject]||EDUCATION_SUBJECTS.math,items=generateEducationRounds(subject,level,seed,rounds);let step=0,hearts=3,score=0,locked=false,sequence=[];const started=performance.now();
    const complete=()=>{const elapsed=Math.round(performance.now()-started),result={score,total:items.length,elapsed,subject,level};if(onFinish)return onFinish(result);finishSoloEducationGame(result);};
    const render=()=>{if(step>=items.length||hearts<=0)return complete();const q=items[step],progress=Math.round(step/items.length*100),speak=q.speak?`<button class="edu-speak" data-edu-speak>🔊 Ouvir</button>`:'';
      const options=q.kind==='sequence'?`<div class="sequence-built" id="sequenceBuilt">${sequence.join('')||'Toque nas sílabas'}</div><div class="sequence-options">${q.tokens.map((t,i)=>`<button data-sequence-token="${i}">${t}</button>`).join('')}</div><div class="sequence-actions"><button data-sequence-clear>Limpar</button><button class="primary" data-sequence-check>Confirmar</button></div>`:`<div class="edu-options">${q.options.map((opt,i)=>`<button data-edu-answer="${escapeHtml(String(opt))}"><span>${String.fromCharCode(65+i)}</span>${escapeHtml(String(opt))}</button>`).join('')}</div>`;
      openModal(multiplayer?`Duelo: ${def.title}`:`${def.title} • Nível ${level}`,`<div class="lesson-hud"><b>❤️ ${hearts}</b><div><i style="width:${progress}%"></i></div><b>${step+1}/${items.length}</b></div>${multiplayer?`<div class="duel-opponent">⚔️ contra <b>${escapeHtml(opponent)}</b></div>`:''}<div class="edu-question" style="--edu:${def.color}"><small>${def.icon} ${def.title}</small><div class="edu-visual">${q.visual}</div><h3>${q.prompt}</h3>${speak}</div>${options}<div id="eduFeedback" class="lesson-feedback" hidden></div>`,root=>{
        if(q.autoSpeak)setTimeout(()=>speakKidWord(q.speak),180);$('[data-edu-speak]',root)?.addEventListener('click',()=>speakKidWord(q.speak));
        const resolveAnswer=(answer,button=null)=>{if(locked)return;locked=true;const correct=String(answer).toUpperCase()===String(q.answer).toUpperCase(),feedback=$('#eduFeedback',root);if(correct){score++;state.learning.totalCorrect++;button?.classList.add('correct');feedback.hidden=false;feedback.className='lesson-feedback good';feedback.innerHTML='<b>Correto!</b><span>Continue assim.</span>';beep(780,80);addXP(5);}else{hearts--;button?.classList.add('wrong');feedback.hidden=false;feedback.className='lesson-feedback bad';feedback.innerHTML=`<b>Quase!</b><span>Resposta: ${escapeHtml(q.displayAnswer||q.answer)}</span>`;beep(180,110,'sawtooth');}setTimeout(()=>{step++;sequence=[];locked=false;render();},780);};
        $$('[data-edu-answer]',root).forEach(btn=>btn.onclick=()=>resolveAnswer(btn.dataset.eduAnswer,btn));
        $$('[data-sequence-token]',root).forEach(btn=>btn.onclick=()=>{if(locked||btn.disabled)return;sequence.push(q.tokens[Number(btn.dataset.sequenceToken)]);btn.disabled=true;$('#sequenceBuilt',root).textContent=sequence.join('');});
        $('[data-sequence-clear]',root)?.addEventListener('click',()=>{sequence=[];render();});$('[data-sequence-check]',root)?.addEventListener('click',()=>resolveAnswer(sequence.join(''),$('[data-sequence-check]',root)));
      });
    };render();
  }
  function startSoloEducationGame(subject,level){try{closeChallengePrompt();runEducationGame({subject,level:Number(level)||1,seed:Date.now()});}catch(error){console.error('Academia Kids:',error);toast('Não foi possível abrir o jogo. Atualize a página.','bad',3000);}}
  function finishSoloEducationGame(result){const passed=result.score>=3,stars=passed?(result.score===result.total?3:result.score>=4?2:1):0,key=`${result.subject}-${result.level}`,old=subjectLevelRecord(result.subject,result.level);state.learning.lessons[key]={completed:old.completed||passed,stars:Math.max(old.stars||0,stars),best:Math.max(old.best||0,result.score),attempts:(old.attempts||0)+1};state.learning.lastLesson=key;state.learning.subjectXP[result.subject]=(state.learning.subjectXP[result.subject]||0)+result.score*10;if(passed){state.learning.crowns+=(old.completed?0:1);if(result.score===result.total)state.learning.perfectLessons++;const coins=30+stars*18;addCoins(coins);addXP(25+stars*12);awardMedal(result.score===result.total?`${EDUCATION_SUBJECTS[result.subject].title} Perfeito`:`Aluno ${EDUCATION_SUBJECTS[result.subject].title}`);saveState(true);openModal('Fase concluída!',`<div class="lesson-result"><div>${result.score===result.total?'🏆':'🎉'}</div><h3>${result.score}/${result.total}</h3><p>${'⭐'.repeat(stars)} Você ganhou ${coins} moedas.</p><button class="btn primary" data-edu-continue>Continuar</button></div>`,root=>$('[data-edu-continue]',root).onclick=()=>openEducationHub(result.subject));}else{saveState(true);openModal('Treine mais um pouco',`<div class="lesson-result"><div>💪</div><h3>${result.score}/${result.total}</h3><p>Você precisa acertar pelo menos 3 atividades.</p><button class="btn primary" data-edu-retry>Tentar novamente</button><button class="btn" data-edu-back>Voltar</button></div>`,root=>{$('[data-edu-retry]',root).onclick=()=>startSoloEducationGame(result.subject,result.level);$('[data-edu-back]',root).onclick=()=>openEducationHub(result.subject);});}}

  function triggerEmote(type,npc=null){player.emoteType=type;player.emoteUntil=performance.now()+(type==='dance'?3200:2400);player.emoteSeq=(player.emoteSeq||0)+1;if(npc){npc.emoteType=type;npc.emoteUntil=performance.now()+(type==='dance'?3200:2400);}if(type==='play')state.needs.fun=clamp(state.needs.fun+8,0,100);const msg={wave:'Acenou!',dance:'Hora da dança!',play:'Começou a brincar!',selfie:'Selfie da amizade!',highfive:'Toca aqui!',hug:'Abraço de amizade!'};toast(msg[type]||'Ação social!','good',1200);beep(type==='highfive'?820:type==='play'?700:620,55);vibrate(15);addXP(3);}

  function openQuiz(){openEducationHub('math');}


  function openCollection() {
    const medals = state.medals.length ? state.medals.map(m => `<div class="inventory-item"><b>🏅</b><span>${m}</span></div>`).join('') : '<p>Nenhuma medalha ainda. Complete missões, quiz e desafios.</p>';
    openModal('Coleção e conquistas', `<div class="inventory-grid">${medals}</div>`);
  }

  const avatarCatalog = {
    outfit: [
      ['classic','Clássico','⬛'], ['blue','Jaqueta azul','🟦'], ['red','Jaqueta vermelha','🟥'], ['explorer','Explorador','🟩']
    ],
    hat: [
      ['none','Sem chapéu','🚫'], ['cap','Boné','🧢'], ['crown','Coroa','👑'], ['helmet','Capacete','⛑️']
    ],
    accessory: [
      ['none','Sem acessório','🚫'], ['backpack','Mochila','🎒'], ['glasses','Óculos','🕶️'], ['cape','Capa','🦸']
    ]
  };
  function avatarChoiceGroup(type, title) {
    return `<section class="avatar-section"><h3>${title}</h3><div class="avatar-grid">${avatarCatalog[type].map(([id,name,icon]) => `<button class="avatar-option ${state.avatar[type]===id?'selected':''}" data-avatar-type="${type}" data-avatar-id="${id}"><b>${icon}</b><span>${name}</span></button>`).join('')}</div></section>`;
  }
  function openAvatarStudio() {
    openModal(`Meu ${playerDisplayName()}`, `<div class="avatar-summary"><div class="avatar-face"><i></i><i></i></div><div><b>Personalize seu personagem</b><span>Roupas e acessórios ficam salvos no celular.</span></div></div>${avatarChoiceGroup('outfit','Roupa')}${avatarChoiceGroup('hat','Chapéu')}${avatarChoiceGroup('accessory','Acessório')}<div class="modal-actions"><button class="btn primary" data-avatar-save>Salvar visual</button></div>`, root => {
      $$('[data-avatar-type]', root).forEach(btn => btn.onclick = () => {
        state.avatar[btn.dataset.avatarType] = btn.dataset.avatarId;
        $$(`[data-avatar-type="${btn.dataset.avatarType}"]`, root).forEach(x => x.classList.toggle('selected', x === btn));
        applyAvatarCustomization();
      });
      $('[data-avatar-save]', root).onclick = () => { setFlag('customizedAvatar'); saveState(true); closeModal(); toast(`Visual de ${playerDisplayName()} salvo!`, 'good'); };
    });
  }
  function openLifePanel() {
    const c = state.career;
    const friendships = Object.entries(state.friendship).sort((a,b)=>b[1]-a[1]).map(([id,value])=>`<div class="friend-row"><span>${({nino:'Nino',luna:'Luna',teo:'Teo',bia:'Bia',maya:'Maya'})[id]||id}</span><b>${value}/100</b></div>`).join('');
    openModal('Minha vida', `<div class="roleplay-card"><small>CARREIRA</small><h3>${c.title}</h3><p>Nível ${c.level} • ${c.xp} XP profissional • ${c.completed} trabalhos</p></div><div class="choice-grid"><button class="choice" data-life-avatar><b>👕 Meu personagem</b><span>Roupas e acessórios</span></button><button class="choice" data-life-jobs><b>💼 Trabalhos</b><span>Ganhe moedas e reputação</span></button></div><h3>Amizades</h3><div class="friend-list">${friendships}</div>`, root => {
      $('[data-life-avatar]', root).onclick = openAvatarStudio;
      $('[data-life-jobs]', root).onclick = openJobCenter;
    });
  }
  const moldFiles = [
    ['athos_moldes_caneta_3d.png','Moldes para caneta 3D'],
    ['modelo-referencia-athos.png','Modelo de referência do personagem']
  ];
  function openMolds() {
    openModal(`Moldes 3D de ${playerDisplayName()}`, `<p>Abra a imagem em tamanho maior para usar como referência.</p><div class="mold-grid">${moldFiles.map(([file, title]) => `<a class="mold-card" href="./assets/moldes/${file}" target="_blank" rel="noopener"><img src="./assets/moldes/${file}" alt="${title}"><b>${title}</b></a>`).join('')}</div>`);
  }
  function openHow() {
    openModal('Como jogar', `<div class="choice-grid">
      <div class="choice"><b>🕹 Andar</b><span>Use o joystick. O movimento acompanha a direção da câmera.</span></div>
      <div class="choice"><b>✋ Ação contextual</b><span>O texto da tela é exatamente a ação executada: cozinhar, abrir, conversar, coletar ou atacar.</span></div>
      <div class="choice"><b>▼ Abaixar</b><span>Use em passagens baixas e túneis.</span></div>
      <div class="choice"><b>◱ Mini</b><span>Entre em espaços pequenos e desafios especiais.</span></div>
      <div class="choice"><b>N Normal</b><span>Volta ao tamanho padrão.</span></div>
      <div class="choice"><b>⬡ Grande</b><span>Abra portões pesados e enfrente desafios fortes.</span></div>
      <div class="choice"><b>↻ Girar</b><span>Executa o giro do personagem.</span></div>
      <div class="choice"><b>⬆ Pular</b><span>Pulo rápido com peso. Use nas plataformas e corridas.</span></div>
      <div class="choice"><b>🔥 Poder</b><span>Lança fogo contra monstros de fantasia.</span></div>
      <div class="choice"><b>🏃 Ginásio</b><span>Dispute corridas e desafios pega-moedas com os vizinhos.</span></div>
      <div class="choice"><b>🧱 Construir</b><span>Escolha um item e coloque em áreas autorizadas.</span></div>
      <div class="choice"><b>💾 Salvar</b><span>O jogo salva automaticamente no celular e também permite exportar backup.</span></div>
    </div>`);
  }


  const missionChapters = [
    {
      id: 'home', title: 'Arrume sua casa', chapter: 'CAPÍTULO 1 — VIDA EM CASA', reward: { coins: 100, medal: 'Minha Primeira Casa' },
      steps: [
        ['enteredHome', 'Entre na sua casa.'],
        ['slept', 'Durma na cama para recuperar energia.'],
        ['ateMeal', 'Prepare e coma uma refeição.'],
        ['talkedNeighbor', 'Converse com Nino na praça.']
      ]
    },
    {
      id: 'neighbors', title: 'Vida de bairro', chapter: 'CAPÍTULO 2 — VIZINHOS', reward: { coins: 160, medal: 'Bom Vizinho' },
      steps: [
        ['metNeighbors', 'Converse com três vizinhos diferentes.'],
        ['boughtHouse', 'Compre uma segunda casa.'],
        ['lockedHouse', 'Tranque uma casa que pertence a você.']
      ]
    },
    {
      id: 'builder', title: 'Construtor do vale', chapter: 'CAPÍTULO 3 — MINECRAFT KIDS', reward: { coins: 220, medal: 'Construtor do Vale' },
      steps: [
        ['hasMaterials', 'Colete 3 madeiras e 2 pedras.'],
        ['bridgeFixed', 'Conserte a ponte quebrada.'],
        ['builtThree', 'Construa três objetos na sua área.']
      ]
    },
    {
      id: 'adventure', title: 'Vale dos Cristais', chapter: 'CAPÍTULO 4 — AVENTURA', reward: { coins: 280, medal: 'Herói dos Cristais' },
      steps: [
        ['fiveCrystals', 'Colete cinco cristais no percurso.'],
        ['threeEnemies', 'Derrote três monstros de fantasia.'],
        ['secretChest', 'Encontre e abra o baú secreto.']
      ]
    },
    {
      id: 'city', title: 'Cidade em movimento', chapter: 'CAPÍTULO 5 — SECOND LIFE KIDS', reward: { coins: 350, medal: 'Estrela da Cidade' },
      steps: [
        ['gotVehicle', 'Pegue o carrinho na garagem.'],
        ['deliveryDone', 'Faça a entrega para Maya.'],
        ['rep50', 'Alcance 50 pontos de reputação.']
      ]
    },
    {
      id: 'roleplay', title: 'Construa sua história', chapter: 'CAPÍTULO 6 — ROLE PLAY', reward: { coins: 500, medal: 'Minha Vida na Vila' },
      steps: [
        ['customizedAvatar', 'Escolha uma roupa e um acessório.'],
        ['completedJob', 'Conclua um trabalho da vila.'],
        ['friend10', 'Alcance amizade 10 com um vizinho.'],
        ['decoratedHome', 'Construa ou decore perto da sua casa.']
      ]
    },
    {
      id: 'sports', title: 'Campeão da Vila', chapter: 'CAPÍTULO 7 — GINÁSIO E DESAFIOS', reward: { coins: 650, medal: 'Campeão do Ginásio' },
      steps: [
        ['wonRace', 'Vença uma corrida de velocidade.'],
        ['wonCoinRace', 'Vença a corrida pega-moedas.'],
        ['wonHouseChallenge', 'Conquiste uma casa em uma disputa.']
      ]
    }
  ];

  let activeMission = null;
  function deriveMissionFlags() {
    const friendCount = Object.values(state.friendship).filter(v => v > 0).length;
    state.flags.metNeighbors = friendCount >= 3;
    state.flags.hasMaterials = state.inventory.wood >= 3 && state.inventory.stone >= 2;
    state.flags.builtThree = state.builds.length >= 3;
    state.flags.fiveCrystals = state.inventory.crystals >= 5;
    state.flags.threeEnemies = state.defeated >= 3;
    state.flags.rep50 = state.profile.reputation >= 50;
    state.flags.friend10 = Object.values(state.friendship).some(v => v >= 10);
    state.flags.completedJob = (state.career?.completed || 0) > 0;
    state.flags.decoratedHome = state.builds.some(b => Math.hypot((b.x||0), (b.z||0)-18) < 12);
  }
  function evaluateMissions() {
    deriveMissionFlags();
    for (const chapter of missionChapters) {
      const complete = chapter.steps.every(([flag]) => !!state.flags[flag]);
      if (complete && !state.completedChapters.includes(chapter.id)) {
        state.completedChapters.push(chapter.id);
        addCoins(chapter.reward.coins);
        awardMedal(chapter.reward.medal);
        toast(`Capítulo concluído: ${chapter.title}`, 'good', 2600);
      }
    }
    const chapter = missionChapters.find(c => !c.steps.every(([flag]) => !!state.flags[flag])) || missionChapters[missionChapters.length - 1];
    const nextIndex = chapter.steps.findIndex(([flag]) => !state.flags[flag]);
    activeMission = { chapter, stepIndex: nextIndex < 0 ? chapter.steps.length : nextIndex };
    updateMissionHUD();
  }
  function updateMissionHUD() {
    const job = state.career?.activeJob;
    if (job) {
      const progress = activeJobProgress(job);
      els.missionChapter.textContent = 'TRABALHO ATIVO';
      els.missionTitle.textContent = `${job.icon || '💼'} ${job.title}`;
      els.missionStep.textContent = `${job.description} — ${progress.label}`;
      els.missionFill.style.width = `${progress.percent}%`;
      return;
    }
    if (!activeMission) return;
    const { chapter, stepIndex } = activeMission;
    els.missionChapter.textContent = chapter.chapter;
    els.missionTitle.textContent = chapter.title;
    els.missionStep.textContent = stepIndex < chapter.steps.length ? playerText(chapter.steps[stepIndex][1]) : 'Capítulo concluído!';
    els.missionFill.style.width = `${Math.round((Math.min(stepIndex, chapter.steps.length) / chapter.steps.length) * 100)}%`;
  }


  function sanitizePlayerName(value){return String(value||'').replace(/[^\p{L}\p{N} _.-]/gu,'').replace(/\s+/g,' ').trim().slice(0,18);}
  function hasValidPlayerName(){const name=sanitizePlayerName(state.profile.name);return !!(state.profile.nameConfirmed&&name.length>=3);}
  function playerDisplayName(){return hasValidPlayerName()?sanitizePlayerName(state.profile.name):'Jogador';}
  function playerText(value=''){return String(value).replaceAll('Casa do Otthos',`Casa de ${playerDisplayName()}`).replaceAll('do Otthos',`de ${playerDisplayName()}`).replaceAll('o Otthos',playerDisplayName()).replaceAll('Otthos',playerDisplayName());}
  function updatePlayerNameUI(){const name=hasValidPlayerName()?state.profile.name:'Escolher nome';if(els.lobbyPlayerName)els.lobbyPlayerName.textContent=name;if(els.hudPlayerName)els.hudPlayerName.textContent=hasValidPlayerName()?state.profile.name:'Jogador';const menu=$('#avatarMenuName'),quick=$('#avatarQuickName');if(menu)menu.textContent=`Meu ${playerDisplayName()}`;if(quick)quick.textContent=playerDisplayName();const homeLoc=MAP_LOCATIONS?.find?.(x=>x.id==='home');if(homeLoc)homeLoc.name=`Casa de ${playerDisplayName()}`;const homeHouse=world?.houses?.find?.(x=>x.id==='home');if(homeHouse)homeHouse.name=`Casa de ${playerDisplayName()}`;updateLocalPlayerNameLabel?.();}
  function applyPlayerName(name){const clean=sanitizePlayerName(name);if(clean.length<3){toast('Digite um nome com pelo menos 3 caracteres.','warn',2200);return false;}state.profile.name=clean;state.profile.nameConfirmed=true;state.multiplayer.displayName=clean;updatePlayerNameUI();saveState(true);window.OTTHOS_RTDB?.setDisplayName?.(clean);if(running)window.OTTHOS_RTDB?.publish?.({name:clean,x:player.x,y:player.y,z:player.z,r:player.facing,vehicle:!!player.vehicle,scaleMode:player.scaleMode,crouched:!!player.crouched,color:0x5ad8ff},true);return true;}
  function openPlayerNameModal(required=false,onSaved=null){
    const current=hasValidPlayerName()?state.profile.name:'';
    openModal(required?'Escolha seu nome de jogador':'Nome do jogador',`<div class="player-name-modal"><div class="player-name-icon">👤</div><p>${required?'Antes de entrar, escolha o nome que aparecerá para os outros jogadores.':'Este nome aparece sobre seu personagem no multiplayer.'}</p><label class="field"><span>Nome público</span><input id="playerNameInput" maxlength="18" autocomplete="nickname" inputmode="text" value="${current.replace(/"/g,'&quot;')}" placeholder="Ex.: Thiago"></label><small>De 3 a 18 caracteres. Não use telefone, endereço ou informação pessoal sensível.</small><button class="btn primary xl" data-save-player-name>Salvar nome</button></div>`,root=>{const input=$('#playerNameInput',root),save=$('[data-save-player-name]',root);setTimeout(()=>input?.focus(),80);const submit=()=>{if(!applyPlayerName(input?.value))return;closeModal();toast(`Nome definido: ${state.profile.name}`,'good',1600);if(typeof onSaved==='function')onSaved();};save.onclick=submit;input?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submit();}});});
  }

  function updateLobbyStats() {
    updatePlayerNameUI();
    els.lobbyLevel.textContent = state.profile.level;
    els.lobbyCoins.textContent = state.profile.coins;
    els.lobbyRep.textContent = state.profile.reputation;
    els.lobbyMedals.textContent = state.medals.length;
  }
  function updateHUD() {
    updatePlayerNameUI();
    els.hudLevel.textContent = state.profile.level;
    const xpBase = (state.profile.level - 1) * 1000;
    const xpInLevel = state.profile.xp - xpBase;
    els.xpFill.style.width = `${clamp(xpInLevel / 1000 * 100, 0, 100)}%`;
    els.xpText.textContent = `${xpInLevel} / 1000`;
    els.hudCoins.textContent = state.profile.coins;
    const needs = [['hunger', els.needHunger], ['energy', els.needEnergy], ['fun', els.needFun], ['hygiene', els.needHygiene]];
    needs.forEach(([key, el]) => el.style.width = `${clamp(state.needs[key], 0, 100)}%`);
    const lowest = Math.min(...Object.values(state.needs));
    if (els.needsToggleBtn) { els.needsToggleBtn.textContent = lowest < 20 ? '⚠️' : lowest < 50 ? '💛' : '❤️'; els.needsToggleBtn.classList.toggle('warning', lowest < 35); }
    updateMissionHUD();
  }

  function openInventory() {
    const inv = state.inventory;
    openModal('Inventário', `<div class="inventory-grid">
      <div class="inventory-item"><b>🪵 ${inv.wood}</b><span>Madeira</span></div>
      <div class="inventory-item"><b>🪨 ${inv.stone}</b><span>Pedra</span></div>
      <div class="inventory-item"><b>🍎 ${inv.food}</b><span>Comida</span></div>
      <div class="inventory-item"><b>💧 ${inv.water}</b><span>Água</span></div>
      <div class="inventory-item"><b>💎 ${inv.crystals}</b><span>Cristais</span></div>
      <div class="inventory-item"><b>🧱 ${inv.blocks}</b><span>Blocos</span></div>
      <div class="inventory-item"><b>🪵 ${inv.fences}</b><span>Cercas</span></div>
      <div class="inventory-item"><b>🪙 ${state.profile.coins}</b><span>Moedas</span></div>
    </div>`);
  }

  const WORLD_MAP_ROADS=[{x:0,z:0,w:18,d:210},{x:0,z:0,w:210,d:18},{x:-55,z:-55,w:9,d:105},{x:55,z:48,w:9,d:92}];
  const NAV_BASE_NODES={
    VS:{x:0,z:-105},V55S:{x:0,z:-55},V18S:{x:0,z:-18},C:{x:0,z:0},V18N:{x:0,z:18},V50N:{x:0,z:50},V78N:{x:0,z:78},VN:{x:0,z:105},
    HW:{x:-105,z:0},H88W:{x:-88,z:0},H55W:{x:-55,z:0},H25W:{x:-25,z:0},H25E:{x:25,z:0},H55E:{x:55,z:0},H88E:{x:88,z:0},HE:{x:105,z:0},
    W105S:{x:-55,z:-105},W55S:{x:-55,z:-55},E48N:{x:55,z:48},E78N:{x:55,z:78},E94N:{x:55,z:94}
  };
  const NAV_BASE_EDGES=[['VS','V55S'],['V55S','V18S'],['V18S','C'],['C','V18N'],['V18N','V50N'],['V50N','V78N'],['V78N','VN'],['HW','H88W'],['H88W','H55W'],['H55W','H25W'],['H25W','C'],['C','H25E'],['H25E','H55E'],['H55E','H88E'],['H88E','HE'],['W105S','W55S'],['W55S','H55W'],['H55E','E48N'],['E48N','E78N'],['E78N','E94N']];
  function routeLength(points){let total=0;for(let i=1;i<points.length;i++)total+=Math.hypot(points[i].x-points[i-1].x,points[i].z-points[i-1].z);return total;}
  function compactRoute(points){const out=[];for(const p of points){if(!p)continue;const last=out[out.length-1];if(!last||Math.hypot(last.x-p.x,last.z-p.z)>.25)out.push({x:+p.x,z:+p.z});}return out;}
  function projectPointToSegment(p,a,b){const dx=b.x-a.x,dz=b.z-a.z,len2=dx*dx+dz*dz||1,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/len2));return{x:a.x+dx*t,z:a.z+dz*t,t};}
  function navBlocked(x,z){for(const h of world.hazards||[]){if(Math.abs(x-h.x)<=h.w/2+.55&&Math.abs(z-h.z)<=h.d/2+.55)return true;}for(const c of world.colliders||[]){if(c.houseId&&currentHouse&&c.houseId===currentHouse.id)continue;if(Math.abs(x-c.x)<=c.w/2+.45&&Math.abs(z-c.z)<=c.d/2+.45)return true;}return false;}
  function segmentClear(a,b){const len=Math.hypot(b.x-a.x,b.z-a.z),steps=Math.max(1,Math.ceil(len/1.8));for(let i=1;i<steps;i++){const t=i/steps;if(navBlocked(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t))return false;}return true;}
  function nearestRoadProjection(pos){let best=null;for(const [aId,bId] of NAV_BASE_EDGES){const a=NAV_BASE_NODES[aId],b=NAV_BASE_NODES[bId],p=projectPointToSegment(pos,a,b),distance=Math.hypot(pos.x-p.x,pos.z-p.z),clear=segmentClear(pos,p);const score=distance+(clear?0:120);if(!best||score<best.score)best={aId,bId,point:p,distance,clear,score};}return best;}
  function graphAdd(adj,a,b,w){if(!adj.has(a))adj.set(a,[]);if(!adj.has(b))adj.set(b,[]);adj.get(a).push({id:b,w});adj.get(b).push({id:a,w});}
  function graphShortest(nodes,adj,startId,endId){const dist=new Map([[startId,0]]),prev=new Map(),open=new Set(nodes.keys());while(open.size){let current=null,best=Infinity;for(const id of open){const d=dist.get(id)??Infinity;if(d<best){best=d;current=id;}}if(current===null||current===endId)break;open.delete(current);for(const e of adj.get(current)||[]){if(!open.has(e.id))continue;const nd=best+e.w;if(nd<(dist.get(e.id)??Infinity)){dist.set(e.id,nd);prev.set(e.id,current);}}}if(!dist.has(endId))return[];const ids=[];let id=endId;while(id){ids.push(id);if(id===startId)break;id=prev.get(id);}return ids.reverse().map(id=>nodes.get(id));}
  function buildRoutePoints(from,to){
    const target={x:Number(to.navX??to.x),z:Number(to.navZ??to.z)},startProjection=nearestRoadProjection(from),targetProjection=nearestRoadProjection(target);
    if(!startProjection||!targetProjection)return compactRoute([from,target]);
    const cacheKey=`${startProjection.aId}:${startProjection.bId}:${Math.round(startProjection.point.x/4)},${Math.round(startProjection.point.z/4)}>${targetProjection.aId}:${targetProjection.bId}:${Math.round(targetProjection.point.x/4)},${Math.round(targetProjection.point.z/4)}`;
    const cached=world.navCache.get(cacheKey);if(cached)return compactRoute([{x:from.x,z:from.z},...cached.slice(1,-1),target]);
    const nodes=new Map(Object.entries(NAV_BASE_NODES).map(([id,p])=>[id,{...p}])),adj=new Map();
    for(const[aId,bId]of NAV_BASE_EDGES){const a=nodes.get(aId),b=nodes.get(bId);graphAdd(adj,aId,bId,Math.hypot(a.x-b.x,a.z-b.z));}
    nodes.set('START',startProjection.point);nodes.set('TARGET',targetProjection.point);
    for(const [id,projection] of [['START',startProjection],['TARGET',targetProjection]]){const a=nodes.get(projection.aId),b=nodes.get(projection.bId),p=nodes.get(id);graphAdd(adj,id,projection.aId,Math.hypot(p.x-a.x,p.z-a.z));graphAdd(adj,id,projection.bId,Math.hypot(p.x-b.x,p.z-b.z));}
    if(startProjection.aId===targetProjection.aId&&startProjection.bId===targetProjection.bId)graphAdd(adj,'START','TARGET',Math.hypot(startProjection.point.x-targetProjection.point.x,startProjection.point.z-targetProjection.point.z));
    const core=graphShortest(nodes,adj,'START','TARGET'),route=compactRoute([{x:from.x,z:from.z},...core,target]);world.navCache.set(cacheKey,route);if(world.navCache.size>60)world.navCache.delete(world.navCache.keys().next().value);return route;
  }
  function routeProgressInfo(route,pos){if(!route?.length)return{remaining:0,distance:Infinity,index:0,point:pos,next:pos,instruction:'sem rota'};let total=routeLength(route),before=0,best={distance:Infinity,index:0,t:0,point:route[0],along:0};for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],p=projectPointToSegment(pos,a,b),d=Math.hypot(pos.x-p.x,pos.z-p.z),seg=Math.hypot(b.x-a.x,b.z-a.z);if(d<best.distance)best={distance:d,index:i-1,t:p.t,point:p,along:before+seg*p.t};before+=seg;}const next=route[Math.min(route.length-1,best.index+1)]||route.at(-1),after=route[Math.min(route.length-1,best.index+2)]||next;const heading=Math.atan2(next.x-best.point.x,next.z-best.point.z),nextHeading=Math.atan2(after.x-next.x,after.z-next.z);let delta=((nextHeading-heading+Math.PI*3)%(Math.PI*2))-Math.PI;const turnDistance=Math.hypot(next.x-best.point.x,next.z-best.point.z);let instruction=turnDistance<4&&after!==next?(delta<-.35?'vire à direita':delta>.35?'vire à esquerda':'siga em frente'):(Math.abs(delta)>.35?`${Math.round(turnDistance)} m até a curva`:'siga em frente');return{...best,total,remaining:Math.max(0,total-best.along),next,after,heading,delta,instruction};}
  function remainingRoute(route,pos){const info=routeProgressInfo(route,pos);return compactRoute([{x:pos.x,z:pos.z},info.point,...route.slice(info.index+1)]);}
  function sampleRoute(points,spacing=3.1){const samples=[];for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz),steps=Math.max(1,Math.floor(len/spacing));for(let s=1;s<=steps;s++){const t=s/steps;samples.push({x:a.x+dx*t,z:a.z+dz*t,angle:Math.atan2(dx,dz)});}}return samples;}
  function createRouteGuide(){if(world.routeGuide)return;world.routeGuide=new THREE.Group();world.routeGuide.name='OTTHOS_ROUTE_GUIDE';worldGroup.add(world.routeGuide);const material=mat(0x42eaff,{emissive:0x087fa0,emissiveIntensity:1.45,roughness:.2,transparent:true,opacity:.94});for(let i=0;i<46;i++){const arrow=new THREE.Mesh(new THREE.ConeGeometry(.34,.8,4),material);arrow.rotation.x=Math.PI/2;arrow.visible=false;arrow.frustumCulled=false;world.routeGuide.add(arrow);world.routeArrows.push(arrow);}}
  function updateRouteGuide(force=false){createRouteGuide();if(!state.waypoint){world.routeArrows.forEach(a=>a.visible=false);world.routePath=[];return;}const routeInfo=routeProgressInfo(world.routePath,player),offRoute=routeInfo.distance>7;if(force||!world.routePath.length||(offRoute&&performance.now()-world.routeLastBuild>1400)){world.routeLastBuild=performance.now();world.routePath=buildRoutePoints(player,state.waypoint);}const visibleRoute=remainingRoute(world.routePath,player),samples=sampleRoute(visibleRoute,3.15).filter((_,i)=>i>0).slice(0,world.routeArrows.length);world.routeArrows.forEach((arrow,i)=>{const p=samples[i];arrow.visible=!!p;if(!p)return;arrow.position.set(p.x,groundHeightAt(p.x,p.z)+.28,p.z);arrow.rotation.z=-p.angle;arrow.scale.setScalar(i<6?1.2:1);});}
  function miniPoint(x,z,scale,w,h){return{x:w/2+(x-player.x)*scale,y:h*.64-(z-player.z)*scale};}
  function drawMiniMap(){const canvas=els.miniMapCanvas;if(!canvas)return;const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,scale=1.12;ctx.clearRect(0,0,w,h);ctx.fillStyle='#67c957';ctx.fillRect(0,0,w,h);ctx.save();ctx.lineCap='round';for(const road of WORLD_MAP_ROADS){const horizontal=road.w>=road.d,a=horizontal?miniPoint(road.x-road.w/2,road.z,scale,w,h):miniPoint(road.x,road.z-road.d/2,scale,w,h),b=horizontal?miniPoint(road.x+road.w/2,road.z,scale,w,h):miniPoint(road.x,road.z+road.d/2,scale,w,h);ctx.strokeStyle='#dce1e6';ctx.lineWidth=(horizontal?road.d:road.w)*scale+4;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.strokeStyle='#424a55';ctx.lineWidth=(horizontal?road.d:road.w)*scale;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}if(state.waypoint&&world.routePath.length){const route=remainingRoute(world.routePath,player);ctx.strokeStyle='#38e9ff';ctx.lineWidth=6;ctx.setLineDash([10,6]);ctx.beginPath();route.forEach((p,i)=>{const q=miniPoint(p.x,p.z,scale,w,h);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.stroke();ctx.setLineDash([]);const target=miniPoint(state.waypoint.navX??state.waypoint.x,state.waypoint.navZ??state.waypoint.z,scale,w,h);if(target.x>-12&&target.x<w+12&&target.y>-12&&target.y<h+12){ctx.fillStyle='#ffe33b';ctx.strokeStyle='#172738';ctx.lineWidth=2;ctx.beginPath();ctx.arc(target.x,target.y,7,0,Math.PI*2);ctx.fill();ctx.stroke();}}ctx.restore();ctx.fillStyle='rgba(5,20,35,.8)';ctx.fillRect(7,7,23,22);ctx.fillStyle='#fff';ctx.font='900 14px system-ui';ctx.fillText('N',13,23);ctx.save();ctx.translate(w/2,h*.64);ctx.rotate(Math.PI-(player.facing||0));ctx.fillStyle='#1979ed';ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(8,8);ctx.lineTo(-8,8);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
  function updateNavigation(dt=0,force=false){updateNavigation.acc=(updateNavigation.acc||0)+dt;if(!force&&updateNavigation.acc<.14)return;updateNavigation.acc=0;updateRouteGuide(force);drawMiniMap();if(!els.miniNav)return;if(state.waypoint){const info=routeProgressInfo(world.routePath,player),dx=info.next.x-player.x,dz=info.next.z-player.z,arrival=Math.hypot((state.waypoint.navX??state.waypoint.x)-player.x,(state.waypoint.navZ??state.waypoint.z)-player.z);els.miniNavName.textContent=`Rota: ${state.waypoint.name}`;els.miniNavDistance.textContent=arrival<4?'Você chegou!':`${Math.round(info.remaining)} m • ${info.instruction}`;els.miniNavArrow.style.transform=`rotate(${player.facing-Math.atan2(dx,dz)}rad)`;els.miniNav.classList.add('active');if(arrival<4&&!state.waypoint.arrived){state.waypoint.arrived=true;toast(`Você chegou: ${state.waypoint.name}`,'good',1800);beep(850,90);saveState();}}else{els.miniNavName.textContent='GPS da Vila';els.miniNavDistance.textContent='Toque para escolher o destino';els.miniNavArrow.style.transform='rotate(0deg)';els.miniNav.classList.remove('active');}}
  function routeSvgMarkup(points){const mapped=points.map(p=>worldToMap(p.x,p.z));return `<svg class="map-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${mapped.map(p=>`${p.left},${p.top}`).join(' ')}"/></svg>`;}

  const MAP_LOCATIONS = [
    { id:'home', name:`Casa de ${playerDisplayName()}`, icon:'🏠', x:0, z:18, navX:0, navZ:23.3, group:'Casa' },
    { id:'village', name:'Praça da Vila', icon:'🏘', x:0, z:0, group:'Vila' },
    { id:'blue', name:'Casa Azul', icon:'🏡', x:-25, z:17, navX:-25, navZ:22.3, group:'Casas' },
    { id:'pink', name:'Casa Rosa', icon:'🏡', x:25, z:17, navX:25, navZ:22.3, group:'Casas' },
    { id:'shop', name:'Mercadinho', icon:'🛒', x:-22, z:-18, navX:-22, navZ:-12.7, group:'Serviços' },
    { id:'workshop', name:'Oficina', icon:'🛠', x:22, z:-18, navX:22, navZ:-12.7, group:'Serviços' },
    { id:'forest', name:'Floresta', icon:'🌲', x:-88, z:-42, navX:-82, navZ:-35, group:'Exploração' },
    { id:'lake', name:'Lago e Ponte', icon:'🌊', x:-22, z:50, navX:-18, navZ:46, group:'Exploração' },
    { id:'crystal', name:'Vale dos Cristais', icon:'💎', x:70, z:-60, group:'Desafios' },
    { id:'garage', name:'Garagem e Fazenda', icon:'🚗', x:52, z:48, navX:48, navZ:43, group:'Trabalho' },
    { id:'gym', name:'Ginásio', icon:'🏃', x:45, z:78, navX:45, navZ:84, group:'Desafios' },
    { id:'castle', name:'Castelo', icon:'🏰', x:88, z:62, group:'Aventura' },
    { id:'mini', name:'Passagem Mini', icon:'◱', x:-38, z:42, group:'Habilidades' },
    { id:'crouch', name:'Túnel Baixo', icon:'▼', x:-53, z:24, group:'Habilidades' },
    { id:'giant', name:'Portão Grande', icon:'⬡', x:36, z:-35, group:'Habilidades' },
    { id:'edu-math', name:'Matemática Kids', icon:'🔢', x:22, z:-32, navX:18, navZ:-32, group:'Academia' },
    { id:'edu-portuguese', name:'Português Kids', icon:'📚', x:22, z:-40, navX:18, navZ:-40, group:'Academia' },
    { id:'edu-english', name:'English Kids', icon:'🌎', x:22, z:-48, navX:18, navZ:-48, group:'Academia' }
  ];
  function worldToMap(x,z){ return { left:clamp((x+116)/232*100,2.5,97.5), top:clamp((116-z)/232*100,2.5,97.5) }; }
  function mapDistance(point){ return Math.round(Math.hypot(player.x-(point.navX??point.x),player.z-(point.navZ??point.z))); }
  function setWaypoint(id){
    const point=MAP_LOCATIONS.find(p=>p.id===id);if(!point)return;
    state.waypoint={id:point.id,name:point.name,x:point.x,z:point.z,navX:point.navX??point.x,navZ:point.navZ??point.z,arrived:false};world.routePath=buildRoutePoints(player,state.waypoint);
    updateWaypointMarker();updateNavigation(0,true);saveState(true);closeModal();toast(`Destino marcado: ${point.name} • siga as setas azuis`,'good',2600);
  }
  function clearWaypoint(){ state.waypoint=null; updateWaypointMarker(); updateNavigation(0,true); saveState(true); closeModal(); toast('Destino removido.','good'); }
  function openMap(){
    const pp=worldToMap(player.x,player.z),angleDeg=(Math.PI-(player.facing||0))*180/Math.PI,activeId=state.waypoint?.id||'',route=state.waypoint?(world.routePath.length?world.routePath:buildRoutePoints(player,state.waypoint)):[],routeInfo=state.waypoint?routeProgressInfo(route,player):null;
    const landmarkIds=new Set(['home','village','shop','garage','gym','castle']);
    const visibleLocations=MAP_LOCATIONS.filter(loc=>landmarkIds.has(loc.id)||loc.id===activeId);
    const markers=visibleLocations.map(loc=>{const pos=worldToMap(loc.navX??loc.x,loc.navZ??loc.z),active=loc.id===activeId?' active':'';return `<button class="map-marker clean${active}" style="left:${pos.left}%;top:${pos.top}%" data-waypoint="${loc.id}" aria-label="${loc.name}" title="${loc.name}"><b>${loc.icon}</b><span>${loc.name}</span></button>`;}).join('');
    const grouped=[...new Set(MAP_LOCATIONS.map(x=>x.group))].map(group=>{const items=MAP_LOCATIONS.filter(x=>x.group===group).sort((a,b)=>mapDistance(a)-mapDistance(b)).map(loc=>`<button class="map-destination ${loc.id===activeId?'active':''}" data-waypoint="${loc.id}"><b>${loc.icon}<em>${loc.name}</em></b><span>${mapDistance(loc)} m</span></button>`).join('');return `<section class="map-destination-group"><h4>${group}</h4><div>${items}</div></section>`;}).join('');
    const current=state.waypoint?`<div class="gps-current"><small>ROTA ATUAL</small><b>${state.waypoint.name}</b><span>${Math.round(routeInfo.remaining)} m • ${routeInfo.instruction}</span><button class="btn danger" data-clear-waypoint>Cancelar</button></div>`:`<div class="gps-current empty"><b>Para onde vamos?</b><span>Escolha um lugar na lista.</span></div>`;
    openModal('Mapa',`<div class="map-layout v624"><div class="map-main"><div class="world-map clean-map"><i class="map-road horizontal"></i><i class="map-road vertical"></i><i class="map-road west"></i><i class="map-road east"></i><i class="map-river"></i><div class="map-region forest">FLORESTA</div><div class="map-region city">VILA</div><div class="map-region adventure">AVENTURA</div>${route.length?routeSvgMarkup(route):''}${markers}<span class="player-dot" style="left:${pp.left}%;top:${pp.top}%;--player-angle:${angleDeg}deg"><i></i><b>VOCÊ</b></span><span class="map-north">N</span></div>${current}</div><aside class="map-sidebar"><h3>Escolha um lugar</h3><div class="map-destinations grouped">${grouped}</div></aside></div>`,root=>{$$('[data-waypoint]',root).forEach(btn=>btn.onclick=()=>setWaypoint(btn.dataset.waypoint));$('[data-clear-waypoint]',root)?.addEventListener('click',clearWaypoint);});els.modal.classList.add('map-modal');
  }



  let deferredSettingsRefresh = null;
  function openSettings(inGame = false) {
    const sound = state.settings.sound, vibration = state.settings.vibration, quality = requestedQuality(), high = quality === 'high';
    const savedAt = state.lastSaved ? new Date(state.lastSaved).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) : 'ainda não salvo';
    const isiOSInstall = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const installOption = !isStandalone() && (!!deferredInstallPrompt || isiOSInstall) ? '<button class="btn" data-install>Instalar aplicativo</button>' : '';
    openModal('Configurações', `<div class="settings-list">
      <div class="settings-row"><div><b>Som</b><small>Interface, coleta e combate</small></div><button class="toggle ${sound ? 'on' : ''}" data-toggle="sound"><i></i></button></div>
      <div class="settings-row"><div><b>Vibração</b><small>Feedback no celular</small></div><button class="toggle ${vibration ? 'on' : ''}" data-toggle="vibration"><i></i></button></div>
      <div class="settings-row"><div><b>Qualidade gráfica</b><small>${qualityLabel()}</small></div><button class="toggle ${quality !== 'low' ? 'on' : ''}" data-toggle="quality"><i></i></button></div><div class="settings-row"><div><b>Desempenho atual</b><small>${Math.round(perf.fps)} FPS • render ${qualityTier()}</small></div><span class="db-status">AUTO</span></div>
      <div class="settings-row"><div><b>Salvamento automático</b><small>IndexedDB no celular + cópia local. Último: ${savedAt}</small></div><span class="db-status">✓ Ativo</span></div>
      <div class="settings-row"><div><b>Nome público</b><small>${hasValidPlayerName()?state.profile.name:'Ainda não definido'}</small></div><button class="btn compact" data-player-name-settings>Editar</button></div><div class="settings-row"><div><b>Multiplayer Firebase</b><small id="mpSettingsStatus">${multiplayerStatusText()}</small></div><button class="btn compact" data-multiplayer-config>Abrir online</button></div>
    </div><div class="modal-actions">
      <button class="btn primary" data-save-now>Salvar agora</button>
      <button class="btn" data-export>Exportar backup</button>
      <button class="btn" data-import>Importar backup</button>
      ${installOption}
      <input data-import-file type="file" accept="application/json" hidden>
      ${inGame ? '<button class="btn" data-home>Voltar para casa</button><button class="btn" data-exit>Sair para o menu</button>' : ''}
      <button class="btn danger" data-reset>Apagar progresso</button>
    </div>`, root => {
      $('[data-player-name-settings]',root)?.addEventListener('click',()=>openPlayerNameModal(false,()=>openSettings(inGame)));$('[data-multiplayer-config]',root)?.addEventListener('click',openMultiplayerConfig);
      $$('[data-toggle]', root).forEach(btn => btn.onclick = () => {
        const key = btn.dataset.toggle;
        if (key === 'quality') state.settings.quality = requestedQuality() === 'auto' ? 'high' : requestedQuality() === 'high' ? 'low' : 'auto';
        else state.settings[key] = !state.settings[key];
        saveState(true); closeModal(); applyQuality(); openSettings(inGame);
      });
      $('[data-save-now]',root).onclick=async()=>{ if(running) savePlayerPosition(true); else await commitState(); toast('Progresso salvo no celular.','good'); closeModal(); };
      $('[data-export]', root).onclick = () => window.OTTHOS_DB?.exportFile(state);
      const install=$('[data-install]',root);if(install)install.onclick=installApp;
      const fileInput = $('[data-import-file]', root);
      $('[data-import]', root).onclick = () => fileInput.click();
      fileInput.onchange = async () => {
        const file = fileInput.files?.[0]; if (!file) return;
        try { state = normalizeState(await window.OTTHOS_DB.importFile(file)); await window.OTTHOS_DB.save(state); safeLocalSet(STORAGE_KEY, JSON.stringify(state)); location.reload(); }
        catch (error) { toast(error.message || 'Backup inválido.', 'bad'); }
      };
      const home = $('[data-home]', root); if (home) home.onclick = () => { closeModal(); returnHome(); };
      const exit = $('[data-exit]', root); if (exit) exit.onclick = () => { closeModal(); stopGame(); };
      $('[data-reset]', root).onclick = async () => {
        if (await confirmModal('Apagar progresso', 'Tem certeza? Casas, moedas, amizade e construções serão apagadas.', 'Apagar', 'Cancelar')) {
          state = defaultState(); safeLocalRemove(STORAGE_KEY); await window.OTTHOS_DB?.clear(); await commitState(); location.reload();
        }
      };
    });
  }


  els.quizBtn.onclick = () => openEducationHub('math');
  els.challengePromptAccept.onclick=()=>{if(promptChallengeId)acceptIncomingChallenge(promptChallengeId);else if(promptSessionId){const s=gameSessions.get(promptSessionId);if(s)launchSessionWithCountdown(s);}};
  els.challengePromptDecline.onclick=()=>{if(promptChallengeId)declineIncomingChallenge(promptChallengeId);else closeChallengePrompt();};
  els.collectionBtn.onclick = openCollection;
  els.avatarBtn.onclick = openAvatarStudio;
  els.moldsBtn.onclick = openMolds;
  els.howBtn.onclick = openHow;
  els.settingsBtn.onclick = () => openSettings(false);els.multiplayerBadge.onclick=openSocialHub;els.profileNameBtn.onclick=()=>openPlayerNameModal(false);
  els.avatarGameBtn.onclick = openLifePanel;
  els.inventoryBtn.onclick = openInventory;
  els.mapBtn.onclick = openMap;
  els.dailyBtn.onclick = () => openEducationHub('math');
  els.onlineBtn.onclick = openSocialHub;
  els.gameSettingsBtn.onclick = () => openSettings(true);
  function syncMobilePanels(){document.body.classList.toggle('skills-open',!!state.ui.skillsOpen);document.body.classList.toggle('quick-open',!!state.ui.quickOpen);els.skillsToggleBtn?.classList.toggle('active',!!state.ui.skillsOpen);els.quickToggleBtn?.classList.toggle('active',!!state.ui.quickOpen);els.quickBar.hidden=!state.ui.quickOpen;}
  els.quickToggleBtn.onclick = () => { state.ui.quickOpen = !state.ui.quickOpen;if(state.ui.quickOpen)state.ui.skillsOpen=false;syncMobilePanels();saveState(); };
  els.skillsToggleBtn.onclick=()=>{state.ui.skillsOpen=!state.ui.skillsOpen;if(state.ui.skillsOpen)state.ui.quickOpen=false;syncMobilePanels();saveState();};
  els.needsToggleBtn.onclick = () => { state.ui.needsOpen = !state.ui.needsOpen; els.game.classList.toggle('needs-expanded', state.ui.needsOpen); saveState(); };
  const toggleMission = () => { state.ui.missionOpen = !state.ui.missionOpen; els.missionCard.classList.toggle('expanded', state.ui.missionOpen); saveState(); };
  els.missionCard.onclick = toggleMission;
  els.missionCard.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMission(); } };
  [els.avatarGameBtn,els.inventoryBtn,els.buildBtn,els.mapBtn,els.dailyBtn,els.onlineBtn,els.gameSettingsBtn].forEach(btn => btn?.addEventListener('click', () => { state.ui.quickOpen=false; els.quickBar.hidden=true; els.quickToggleBtn.classList.remove('active'); }));
  async function ensureModelViewerReady({activateAR=false}={}) {
    if (!els.nativeViewer || !window.loadModelViewerLib) throw new Error('Visualizador indisponível');
    if (els.viewerStatus) els.viewerStatus.textContent = 'Carregando visualizador 3D…';
    if (els.viewerLoadBtn) els.viewerLoadBtn.disabled = true;
    els.nativeViewer.hidden = false;
    try {
      await window.loadModelViewerLib();
      await Promise.race([
        customElements.whenDefined('model-viewer'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Tempo esgotado carregando model-viewer')), 15000))
      ]);
      if (!els.nativeViewer.loaded) {
        await Promise.race([
          new Promise((resolve, reject) => {
            const done = () => { cleanup(); resolve(true); };
            const fail = () => { cleanup(); reject(new Error('Falha carregando athos.glb')); };
            const cleanup = () => { els.nativeViewer.removeEventListener('load', done); els.nativeViewer.removeEventListener('error', fail); };
            els.nativeViewer.addEventListener('load', done, {once:true});
            els.nativeViewer.addEventListener('error', fail, {once:true});
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Tempo esgotado carregando o modelo 3D')), 20000))
        ]);
      }
      if (els.viewerPlaceholder) els.viewerPlaceholder.hidden = true;
      if (els.viewerShell) els.viewerShell.classList.add('viewer-ready');
      if (activateAR) await els.nativeViewer.activateAR();
      return true;
    } catch (error) {
      if (els.viewerPlaceholder) els.viewerPlaceholder.hidden = false;
      if (els.viewerStatus) els.viewerStatus.textContent = 'Não foi possível carregar. Toque para tentar novamente.';
      throw error;
    } finally {
      if (els.viewerLoadBtn) els.viewerLoadBtn.disabled = false;
    }
  }
  if (els.viewerLoadBtn) els.viewerLoadBtn.onclick = () => ensureModelViewerReady().catch(() => toast('Visualizador 3D indisponível agora.','warn',2400));
  els.arBtn.onclick = async () => {
    try { await ensureModelViewerReady({activateAR:true}); }
    catch { openModal('Realidade aumentada', '<p>Não foi possível iniciar o AR agora. Verifique a internet e o suporte do aparelho e tente novamente.</p>'); }
  };

  /* THREE.JS GAME */
  let scene, camera, renderer, clock, worldGroup, playerGroup, playerModel, playerMixer, avatarLayer, contactShadow, vehicleVisual, sunLight;
  let running = false, paused = false, pauseMenuOpen = false, raf = 0, cameraYaw = 0, cameraPitch = .38, cameraZoom = Number(state.settings?.cameraZoom || 0), cameraMode = 'openworld';
  let currentHouse = null, buildMode = null, currentContext = null, lastContextId = '', lastActionSource = 'none', actionLockedUntil = 0, activeRace = null, lastContextScanAt = 0, lastContextScanX = Infinity, lastContextScanZ = Infinity;
  const player = { x: 0, y: 0, z: 8, vx: 0, vy: 0, vz: 0, facing: Math.PI, grounded: true, vehicle: false, sitUntil: 0, lastGrounded: 0, jumpBuffer: 0, attackUntil: 0, damageUntil: 0, scaleMode: state.abilities?.scaleMode || 'normal', crouched: !!state.abilities?.crouched, spinUntil: 0, preVehicleAbilities: null, hornUntil: 0, emoteUntil:0, emoteType:'', emoteSeq:0, car: { heading: Math.PI, speed: 0, steerVisual: 0, drift: 0, _prevSpeed: 0 } };
  const input = {
    x:0,z:0,targetX:0,targetZ:0,
    joyId:null,joyX:0,joyZ:0,
    gamepadX:0,gamepadZ:0,gamepadActive:false,
    virtualX:0,virtualZ:0,virtualActive:false,
    touchSprint:false,gamepadSprint:false,isSprinting:false,
    keys:new Set(),cameraDrag:null,cameraPointers:new Map(),pinchDistance:0
  };
  const world = {
    houses: [], npcs: [], interactables: [], enemies: [], fireballs: [], resources: [], crystals: [], platforms: [], colliders: [], hazards: [], builds: [], ghosts: new Map(),
    bridgeParts: [], secretChest: null, vehicle: null, deliveryPoint: null, raceCoins: [], waypointMarker: null, gym: null, routeGuide: null, routeArrows: [], routeLastBuild: 0, routeLastX: Infinity, routeLastZ: Infinity, routePath: [], navCache: new Map(), landmarks: [], outlines: [], glows: [], criticalSurfaces: []
  };
  const textures = {};
  const materials = {};


  function detectStableAutoTier(){
    const memory=Number(navigator.deviceMemory||4),cores=Number(navigator.hardwareConcurrency||4),mobile=matchMedia('(pointer:coarse)').matches;
    if(memory<=3||cores<=4)return 'low';
    if(!mobile&&memory>=8&&cores>=8)return 'high';
    return 'balanced';
  }
  const initialAutoTier=state.settings?.autoTier||detectStableAutoTier();
  const perf = {
    tier:initialAutoTier, sessionTier:initialAutoTier, fps:60, frameAcc:0, frameCount:0, sampleMs:0, lastNow:performance.now(),
    lowSamples:0, highSamples:0, recommendationSamples:0, aiAcc:0, cloudAcc:0, lodAcc:0, uiAcc:0, mobile:matchMedia('(pointer:coarse)').matches,
    appliedTier:'',appliedDpr:0,recommendation:initialAutoTier,lastRecommendationSaved:0,lastRenderW:0,lastRenderH:0,resizeTimer:0
  };
  function requestedQuality(){return ['high','low','auto'].includes(state.settings.quality)?state.settings.quality:'auto';}
  function qualityLabel(){return requestedQuality()==='high'?'Alta':requestedQuality()==='low'?'Econômica':`Automática fixa nesta partida • ${qualityTier()==='high'?'Alta':qualityTier()==='low'?'Econômica':'Equilibrada'}`;}
  function qualityTier(){const requested=requestedQuality();return requested==='high'?'high':requested==='low'?'low':perf.sessionTier;}
  function targetDpr(){
    const tier=qualityTier(), mobile=perf.mobile;
    if(tier==='high') return mobile?1.22:1.45;
    if(tier==='low') return mobile?.78:1.0;
    return mobile?.96:1.18;
  }
  function applyAdaptiveRenderSettings(force=false){
    if(!renderer)return;
    const tier=qualityTier(),dpr=Math.min(devicePixelRatio||1,targetDpr());
    if(force||!running||Math.abs(perf.appliedDpr-dpr)>.08){renderer.setPixelRatio(dpr);perf.appliedDpr=dpr;}
    renderer.shadowMap.enabled=tier!=='low'&&!perf.mobile;
    renderer.toneMappingExposure=tier==='high'?.98:tier==='balanced'?.94:.9;
    if(sunLight){if(!perf.appliedTier){const size=tier==='high'?(perf.mobile?1024:1536):tier==='balanced'?768:512;sunLight.shadow.mapSize.set(size,size);}sunLight.castShadow=tier!=='low'&&!perf.mobile;}
    perf.appliedTier=tier;document.body.dataset.renderTier=tier;scheduleStableResize(80,true);
  }
  function samplePerformance(dt){
    perf.frameAcc+=dt;perf.frameCount++;perf.sampleMs+=dt;
    if(perf.sampleMs<3)return;
    perf.fps=perf.frameCount/Math.max(.001,perf.frameAcc);perf.frameAcc=0;perf.frameCount=0;perf.sampleMs=0;
    if(requestedQuality()!=='auto')return;
    const recommendation=perf.fps<28?'low':perf.fps>55?'high':'balanced';
    if(recommendation===perf.recommendation)perf.recommendationSamples++;else{perf.recommendation=recommendation;perf.recommendationSamples=1;}
    // Só salva uma recomendação futura depois de várias amostras. O render atual nunca muda.
    if(perf.recommendationSamples>=5&&recommendation!==state.settings.autoTier&&performance.now()-perf.lastRecommendationSaved>30000){
      perf.lastRecommendationSaved=performance.now();state.settings.autoTier=recommendation;saveState();
    }
  }
  function lockStableSceneVisibility(){
    for(const mesh of world.criticalSurfaces){if(!mesh)continue;mesh.visible=true;mesh.frustumCulled=false;}
    for(const line of world.outlines){if(line?.parent)line.visible=true;}
    const glowVisible=qualityTier()!=='low';for(const light of world.glows){if(light?.parent)light.visible=glowVisible;}
    if(world.clouds){const max=qualityTier()==='high'?8:qualityTier()==='balanced'?6:4;world.clouds.forEach((cloud,i)=>cloud.group.visible=i<max);}
  }

  function freezeWorldFrustumCulling(){
    if(!worldGroup)return;
    let count=0;
    worldGroup.traverse(obj=>{
      if(obj.isMesh||obj.isLine||obj.isLineSegments||obj.isSprite){
        obj.frustumCulled=false;count++;
        if(obj.geometry&&!obj.geometry.boundingSphere){try{obj.geometry.computeBoundingSphere();}catch(_){}}
      }
    });
    worldGroup.frustumCulled=false;worldGroup.updateMatrixWorld(true);world.staticRenderObjects=count;
  }
  function updateVisualLOD(dt){
    perf.lodAcc+=dt;if(perf.lodAcc<2)return;perf.lodAcc=0;
    // V618: nenhuma geometria muda de visibilidade conforme o jogador anda.
    // Apenas garantimos que piso, ruas e calçadas críticas permaneçam renderizadas.
    for(const mesh of world.criticalSurfaces){if(mesh&&!mesh.visible)mesh.visible=true;}
  }

  function playerScaleValue(mode = player.scaleMode) { return mode === 'mini' ? .58 : mode === 'giant' ? 1.42 : 1; }
  function syncPlayerRootScale(){
    if(!playerGroup)return;
    if(player.vehicle){
      // O veículo nunca herda Mini/Grande/Abaixar do Otthos.
      playerGroup.scale.set(1,1,1);
      return;
    }
    const scale=playerScaleValue();
    playerGroup.scale.set(scale,scale*(player.crouched?.68:1),scale);
  }
  function setScaleMode(mode) {
    if(!els.modal.hidden||paused||player.vehicle)return;
    if (!['mini','normal','giant'].includes(mode)) return;
    player.scaleMode = mode;
    player.crouched = false;
    state.abilities.scaleMode = mode;
    state.abilities.crouched = false;
    updateAbilityUI(); saveState(true);
    toast(mode === 'mini' ? 'Modo mini: entre em passagens pequenas.' : mode === 'giant' ? 'Modo grande: força para desafios pesados.' : 'Tamanho normal.', 'good');
  }
  function toggleCrouch(force) {
    if(!els.modal.hidden||paused||player.vehicle)return;
    player.crouched = typeof force === 'boolean' ? force : !player.crouched;
    state.abilities.crouched = player.crouched;
    updateAbilityUI(); saveState();
    toast(player.crouched ? `${playerDisplayName()} abaixou.` : `${playerDisplayName()} levantou.`, 'good');
  }
  function spinPlayer(){ if(!els.modal.hidden||paused||player.vehicle)return; player.spinUntil=performance.now()+720; addXP(1); beep(430,50,'sine'); }
  function updateAbilityUI(){
    els.crouchBtn?.classList.toggle('active',player.crouched);
    els.miniBtn?.classList.toggle('active',player.scaleMode==='mini');
    els.normalBtn?.classList.toggle('active',player.scaleMode==='normal');
    els.giantBtn?.classList.toggle('active',player.scaleMode==='giant');
  }

  function canvasTexture(kind, colors) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = colors[0]; ctx.fillRect(0, 0, 128, 128);
    if (kind === 'grass') {
      for (let i = 0; i < 260; i++) { ctx.fillStyle = colors[1 + (i % (colors.length - 1))]; ctx.fillRect(Math.random() * 128, Math.random() * 128, 4 + Math.random() * 7, 4 + Math.random() * 7); }
      ctx.fillStyle='rgba(20,60,15,.10)'; for(let i=0;i<40;i++)ctx.fillRect(Math.random()*128,Math.random()*128,10+Math.random()*16,2);
    } else if (kind === 'road') {
      ctx.fillStyle=colors[0]; ctx.fillRect(0,0,128,128);
      for (let i = 0; i < 70; i++) { ctx.fillStyle = colors[1]; ctx.fillRect(Math.random() * 128, Math.random() * 128, 8 + Math.random() * 14, 3 + Math.random() * 6); }
    } else if (kind === 'wood') {
      ctx.strokeStyle = colors[1]; ctx.lineWidth = 7; for (let x = 0; x < 128; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 128); ctx.stroke(); }
      ctx.strokeStyle='rgba(0,0,0,.12)'; for(let x=14;x<128;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,128);ctx.stroke();}
    } else if (kind === 'brick') {
      ctx.strokeStyle = colors[1]; ctx.lineWidth = 5; for (let y = 0; y < 128; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(128, y); ctx.stroke(); for (let x = (y / 30 % 2) * 30; x < 128; x += 60) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 30); ctx.stroke(); } }
    } else if (kind === 'sidewalk') {
      for (let y=0;y<128;y+=32){ctx.strokeStyle='rgba(0,0,0,.14)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(128,y);ctx.stroke();}
      for (let i=0;i<50;i++){ctx.fillStyle=colors[1];ctx.globalAlpha=.25;ctx.fillRect(Math.random()*128,Math.random()*128,3+Math.random()*4,3+Math.random()*4);ctx.globalAlpha=1;}
    } else if (kind === 'water') {
      ctx.fillStyle=colors[0]; ctx.fillRect(0,0,128,128);
      ctx.strokeStyle=colors[1]; ctx.lineWidth=3; ctx.globalAlpha=.5;
      for(let y=8;y<128;y+=18){ctx.beginPath();ctx.moveTo(0,y+Math.sin(y)*4);for(let x=0;x<=128;x+=16)ctx.lineTo(x,y+Math.sin((x+y)*.15)*5);ctx.stroke();}
      ctx.globalAlpha=1;
    }
    const tex = new THREE.CanvasTexture(c); tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.anisotropy = (renderer && renderer.capabilities) ? renderer.capabilities.getMaxAnisotropy() : 4; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; return tex;
  }
  function initMaterials() {
    textures.grass = canvasTexture('grass', ['#348f32','#62c94e','#28762c','#91df63']); textures.grass.repeat.set(46, 46);
    textures.road = canvasTexture('road', ['#252d38','#3d4652']); textures.road.repeat.set(10, 30);
    textures.sidewalk = canvasTexture('sidewalk', ['#d9dde3','#aeb7c2']); textures.sidewalk.repeat.set(6,14);
    textures.water = canvasTexture('water', ['#2fb8ec','#bdf1ff']); textures.water.repeat.set(5,5);
    textures.wood = canvasTexture('wood', ['#9a5a28','#693819']); textures.wood.repeat.set(2, 2);
    textures.brick = canvasTexture('brick', ['#c38142','#8a4e25']); textures.brick.repeat.set(3, 2);
    materials.grass = new THREE.MeshStandardMaterial({ map: textures.grass, roughness: .88 });
    materials.road = new THREE.MeshStandardMaterial({ map: textures.road, roughness: .82 });
    materials.sidewalk = new THREE.MeshStandardMaterial({ map: textures.sidewalk, roughness: .92 });
    materials.wood = new THREE.MeshStandardMaterial({ map: textures.wood, roughness: .8 });
    materials.brick = new THREE.MeshStandardMaterial({ map: textures.brick, roughness: .82 });
    materials.water = new THREE.MeshStandardMaterial({ map:textures.water, color:0x2fc8f4, emissive:0x087aa7, emissiveIntensity:.18, transparent:true, opacity:.76, roughness:.2, metalness:.1 });
    materials.stone = new THREE.MeshStandardMaterial({ color:0x8795a6, roughness:.9, flatShading:true });
    materials.dark = new THREE.MeshStandardMaterial({ color:0x080b11, roughness:.55, flatShading:true });
  }
  function mat(color, opts = {}) { return new THREE.MeshStandardMaterial({ color, roughness: opts.roughness ?? .72, metalness: opts.metalness ?? .03, emissive: opts.emissive ?? 0x000000, emissiveIntensity: opts.emissiveIntensity ?? 0, transparent: !!opts.transparent, opacity: opts.opacity ?? 1, flatShading: opts.flatShading ?? true }); }

  // V625: cache somente de geometrias e materiais visuais imutáveis.
  // Reduz memória e tempo de criação sem alterar física, colisões ou IDs.
  const sharedGeometryCache={box:new Map(),cylinder:new Map()};
  const immutableVisualMaterials=new Map();
  function geometryKey(...values){return values.map(v=>Number(v).toFixed(3)).join('|');}
  function sharedBoxGeometry(w,h,d){
    const key=geometryKey(w,h,d);
    if(!sharedGeometryCache.box.has(key))sharedGeometryCache.box.set(key,new THREE.BoxGeometry(w,h,d));
    return sharedGeometryCache.box.get(key);
  }
  function sharedCylinderGeometry(r,h,sides=10){
    const key=geometryKey(r,h,sides);
    if(!sharedGeometryCache.cylinder.has(key))sharedGeometryCache.cylinder.set(key,new THREE.CylinderGeometry(r,r,h,sides));
    return sharedGeometryCache.cylinder.get(key);
  }
  function renderMat(color,opts={}){
    const key=[color,opts.roughness??.72,opts.metalness??.03,opts.emissive??0,opts.emissiveIntensity??0,opts.transparent?1:0,opts.opacity??1,opts.flatShading??true].join('|');
    if(!immutableVisualMaterials.has(key))immutableVisualMaterials.set(key,mat(color,opts));
    return immutableVisualMaterials.get(key);
  }
  function tintedBrickMaterial(color){
    const material=new THREE.MeshStandardMaterial({map:textures.brick,color:new THREE.Color(color).lerp(new THREE.Color(0xffffff),.34),roughness:.8,metalness:0,flatShading:true});
    return material;
  }
  function addSoftHighlight(parent,w,h,d,x,y,z,color=0xffffff,opacity=.22){
    const m=new THREE.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,fog:true});
    const highlight=new THREE.Mesh(sharedBoxGeometry(w,h,d),m);highlight.position.set(x,y,z);highlight.renderOrder=4;highlight.frustumCulled=false;parent.add(highlight);return highlight;
  }

  function box(w, h, d, materialOrColor, x = 0, y = 0, z = 0, parent = worldGroup) {
    const material = typeof materialOrColor === 'number' ? mat(materialOrColor) : materialOrColor;
    const mesh = new THREE.Mesh(sharedBoxGeometry(w,h,d), material);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled=false; parent.add(mesh); return mesh;
  }
  function stabilizeSurface(mesh,renderOrder=0){if(!mesh)return mesh;mesh.frustumCulled=false;mesh.castShadow=false;mesh.receiveShadow=false;mesh.renderOrder=renderOrder;mesh.userData.stableSurface=true;world.criticalSurfaces.push(mesh);return mesh;}
  function stableBox(w,h,d,materialOrColor,x=0,y=0,z=0,parent=worldGroup,renderOrder=0){return stabilizeSurface(box(w,h,d,materialOrColor,x,y,z,parent),renderOrder);}
  function cylinder(r, h, color, x, y, z, parent = worldGroup, sides = 10) {
    const material=typeof color==='number'?mat(color):color;
    const mesh = new THREE.Mesh(sharedCylinderGeometry(r,h,sides), material);
    mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled=false; parent.add(mesh); return mesh;
  }
  function addGlow(x, y, z, color = 0x5ae5ff, size = 4) {
    const light = new THREE.PointLight(color, .5, size * 3); light.position.set(x,y,z); light.userData.v615Glow=true; worldGroup.add(light); world.glows.push(light); return light;
  }

  function addVoxelOutline(mesh,color=0x142033,opacity=.36){
    if(!mesh?.geometry||mesh.userData?.voxelOutline)return mesh;
    const lines=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry,22),new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));
    lines.renderOrder=5;lines.userData.v615Outline=true;mesh.add(lines);mesh.userData.voxelOutline=lines;world.outlines.push(lines);return mesh;
  }
  function premiumBox(w,h,d,materialOrColor,x=0,y=0,z=0,parent=worldGroup,outline=0x142033){
    return addVoxelOutline(box(w,h,d,materialOrColor,x,y,z,parent),outline,.34);
  }
  function premiumCylinder(r,h,color,x,y,z,parent=worldGroup,sides=10){
    return addVoxelOutline(cylinder(r,h,color,x,y,z,parent,sides),0x142033,.3);
  }
  function makeWindow(parent,x,y,z,w=1.1,h=.9,frame=0xf7f3ea,glass=0x73d9ff){
    premiumBox(w+.2,h+.2,.16,frame,x,y,z,parent);premiumBox(w,h,.18,mat(glass,{emissive:0x1d739b,emissiveIntensity:.18,roughness:.16}),x,y,z+.02,parent,0x23445e);
    premiumBox(.08,h,.2,frame,x,y,z+.04,parent);premiumBox(w,.07,.2,frame,x,y,z+.04,parent);return parent;
  }
  function makePlanter(parent,x,y,z,color=0xe24f72){
    premiumBox(1.35,.34,.48,0x8a522d,x,y,z,parent);for(const ox of [-.42,0,.42]){premiumBox(.08,.4,.08,0x2f9d46,x+ox,y+.32,z,parent);premiumBox(.28,.16,.28,color,x+ox,y+.55,z,parent);}return parent;
  }

  function createPlayerModel() {
    playerGroup = new THREE.Group();playerGroup.name='OTTHOS_PLAYER';scene.add(playerGroup);
    playerModel = new THREE.Group();playerGroup.add(playerModel);
    const black=renderMat(0x090c12,{roughness:.48}),blackSoft=renderMat(0x151a23,{roughness:.58});
    const blue=renderMat(0x099fe5,{roughness:.46}),blueDark=renderMat(0x0875bd,{roughness:.52}),blueLight=renderMat(0x38c8ff,{roughness:.38});
    const white=renderMat(0xf4f7ff,{roughness:.3}),red=renderMat(0xff2947,{emissive:0x9b0018,emissiveIntensity:.62,roughness:.24});
    const sole=renderMat(0xdfe8f4,{roughness:.42}),parts={};
    parts.body=new THREE.Group();parts.body.position.set(0,1.55,0);playerModel.add(parts.body);
    box(1.02,1.22,.72,blue,0,0,0,parts.body);
    box(1.12,.28,.78,blueDark,0,.62,0,parts.body);
    box(.92,.3,.08,blueLight,0,.28,.39,parts.body);
    box(.9,.12,.08,blueDark,0,-.46,.4,parts.body);
    box(.08,.66,.06,white,-.18,.32,.43,parts.body);box(.08,.66,.06,white,.18,.32,.43,parts.body);
    box(.14,.14,.08,black,-.18,-.02,.46,parts.body);box(.14,.14,.08,black,.18,-.02,.46,parts.body);
    parts.head=box(1.08,1.02,1.02,black,0,2.72,0,playerModel);
    box(1.2,1.08,.28,blueDark,0,2.72,-.55,playerModel);
    box(1.22,.28,1.08,blue,0,3.17,-.04,playerModel);
    box(.26,.2,.05,white,-.27,2.78,.545,playerModel);box(.26,.2,.05,white,.27,2.78,.545,playerModel);
    box(.15,.09,.06,red,-.27,2.76,.575,playerModel);box(.15,.09,.06,red,.27,2.76,.575,playerModel);
    parts.leftArm=new THREE.Group();parts.rightArm=new THREE.Group();parts.leftLeg=new THREE.Group();parts.rightLeg=new THREE.Group();
    parts.leftArm.position.set(-.72,2.0,0);parts.rightArm.position.set(.72,2.0,0);parts.leftLeg.position.set(-.28,.92,0);parts.rightLeg.position.set(.28,.92,0);
    playerModel.add(parts.leftArm,parts.rightArm,parts.leftLeg,parts.rightLeg);
    for(const arm of [parts.leftArm,parts.rightArm]){
      box(.38,.52,.38,blue,0,-.24,0,arm);box(.34,.44,.34,blueDark,0,-.69,0,arm);box(.34,.26,.36,black,0,-1.02,.03,arm);
      addSoftHighlight(arm,.08,.62,.02,-.13,-.42,.2,0xffffff,.18);
    }
    for(const leg of [parts.leftLeg,parts.rightLeg]){
      box(.4,.58,.4,black,0,-.28,0,leg);box(.38,.42,.38,blackSoft,0,-.72,.02,leg);
      box(.43,.29,.52,blue,0,-1.02,.09,leg);box(.44,.11,.54,sole,0,-1.18,.1,leg);box(.22,.08,.55,blueLight,0,-1.08,.13,leg);
    }
    playerModel.userData.parts=parts;playerModel.userData.baseY=.24;playerModel.userData.minFootY=-.23;playerModel.userData.proceduralOtthos=true;
    const shadowMat=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.25,depthWrite:false,side:THREE.DoubleSide});
    contactShadow=new THREE.Mesh(new THREE.CircleGeometry(.88,24),shadowMat);contactShadow.rotation.x=-Math.PI/2;contactShadow.position.y=.025;scene.add(contactShadow);

    vehicleVisual=new THREE.Group();vehicleVisual.visible=false;playerGroup.add(vehicleVisual);
    const chassis=renderMat(0x26384e,{roughness:.5,metalness:.16}),orange=renderMat(0xf28a22,{roughness:.4,metalness:.18}),orangeDark=renderMat(0xc85b16,{roughness:.48});
    const teal=renderMat(0x0aa7b8,{roughness:.38,metalness:.22}),glass=renderMat(0x102338,{roughness:.12,metalness:.38,transparent:true,opacity:.84});
    box(1.84,.36,2.56,chassis,0,.28,0,vehicleVisual);box(1.72,.48,1.35,orange,0,.55,.55,vehicleVisual);
    box(1.48,.46,.92,teal,0,.78,-.48,vehicleVisual);box(1.32,.31,.72,glass,0,.93,-.42,vehicleVisual);
    box(1.94,.18,.28,white,0,.32,1.34,vehicleVisual);box(1.9,.18,.24,orangeDark,0,.34,-1.32,vehicleVisual);
    box(.18,.34,2.2,teal,-.92,.42,0,vehicleVisual);box(.18,.34,2.2,teal,.92,.42,0,vehicleVisual);
    box(.72,.42,.58,blackSoft,0,.72,-.12,vehicleVisual);
    const wheelRing=new THREE.Mesh(new THREE.TorusGeometry(.17,.035,8,14),black);wheelRing.position.set(-.31,.95,.32);wheelRing.rotation.x=Math.PI/2.3;vehicleVisual.add(wheelRing);
    const headlight=renderMat(0xfff1a8,{emissive:0xffd75b,emissiveIntensity:.9,roughness:.2}),taillight=renderMat(0xff334d,{emissive:0xa90018,emissiveIntensity:.8});
    box(.3,.17,.08,headlight,-.58,.5,1.27,vehicleVisual);box(.3,.17,.08,headlight,.58,.5,1.27,vehicleVisual);
    box(.28,.16,.07,taillight,-.59,.45,-1.3,vehicleVisual);box(.28,.16,.07,taillight,.59,.45,-1.3,vehicleVisual);
    vehicleVisual.userData.wheels=[];vehicleVisual.userData.frontWheels=[];
    const wheelMat=renderMat(0x10151d,{roughness:.9}),hubMat=renderMat(0xf5a623,{roughness:.35,metalness:.46});
    [[-.84,.24,-.79,false],[.84,.24,-.79,false],[-.84,.24,.79,true],[.84,.24,.79,true]].forEach(([x,y,z,front])=>{
      const holder=new THREE.Group();holder.position.set(x,y,z);vehicleVisual.add(holder);
      const wheel=new THREE.Mesh(sharedCylinderGeometry(.34,.28,14),wheelMat);wheel.rotation.z=Math.PI/2;wheel.castShadow=true;holder.add(wheel);
      const hub=new THREE.Mesh(sharedCylinderGeometry(.12,.3,10),hubMat);hub.rotation.z=Math.PI/2;holder.add(hub);
      vehicleVisual.userData.wheels.push(wheel);if(front)vehicleVisual.userData.frontWheels.push(holder);
    });
    playerModel.traverse(o=>{if(o.isMesh)addVoxelOutline(o,0x0a1a2d,.4);});
    vehicleVisual.traverse(o=>{if(o.isMesh)addVoxelOutline(o,0x14243a,.3);});
    const ownLabel=new THREE.Sprite(new THREE.SpriteMaterial({map:multiplayerNameTexture(playerDisplayName()),transparent:true,depthWrite:false,depthTest:false}));
    ownLabel.position.set(0,3.65,0);ownLabel.scale.set(2.65,.66,1);ownLabel.renderOrder=1000;playerGroup.add(ownLabel);playerGroup.userData.nameLabel=ownLabel;playerGroup.userData.displayName=playerDisplayName();
  }

  function loadFaithfulAthosModel() {
    // Regra V606 (herdada da V605): athos.glb pertence apenas ao visualizador/AR do lobby.
    // A jogabilidade usa o Otthos procedural animado para preservar física, escala e desempenho.
    return false;
  }

  function clearAvatarLayer() {
    if (avatarLayer && playerGroup) playerGroup.remove(avatarLayer);
    avatarLayer = new THREE.Group();
    avatarLayer.name = 'OTTHOS_AVATAR_ACCESSORIES';
    playerGroup?.add(avatarLayer);
  }
  function applyAvatarCustomization() {
    if (!playerGroup || !window.THREE) return;
    clearAvatarLayer();
    const outfit = state.avatar?.outfit || 'classic', hat = state.avatar?.hat || 'none', accessory = state.avatar?.accessory || 'none';
    const outfitColors = { blue:0x2477d4, red:0xd93645, explorer:0x3f9b4b };
    if (outfit !== 'classic') {
      const vest = box(1.02,1.08,.76,outfitColors[outfit]||0x2477d4,0,1.55,0,avatarLayer);
      vest.material.transparent = true; vest.material.opacity = .86;
    }
    if (hat === 'cap') { box(1.0,.22,1.0,0x2477d4,0,3.28,0,avatarLayer); box(.55,.10,.55,0x2477d4,0,3.18,.58,avatarLayer); }
    else if (hat === 'crown') { box(.92,.25,.92,0xffd84d,0,3.32,0,avatarLayer); [[-.32,.22],[0,.34],[.32,.22]].forEach(([x,h])=>box(.18,h,.18,0xffd84d,x,3.48+h/2,0,avatarLayer)); }
    else if (hat === 'helmet') { const helm = new THREE.Mesh(new THREE.SphereGeometry(.62,12,8,0,Math.PI*2,0,Math.PI*.62),mat(0xf97316,{metalness:.08})); helm.position.set(0,3.08,0); avatarLayer.add(helm); }
    if (accessory === 'backpack') { box(.78,1.05,.42,0x9a5b2b,0,1.65,-.58,avatarLayer); }
    else if (accessory === 'glasses') { box(.38,.18,.08,0x111827,-.26,2.78,.59,avatarLayer); box(.38,.18,.08,0x111827,.26,2.78,.59,avatarLayer); box(.18,.06,.08,0x111827,0,2.78,.59,avatarLayer); }
    else if (accessory === 'cape') { const cape=box(.92,1.35,.08,0x8b5cf6,0,1.58,-.60,avatarLayer); cape.rotation.x=-.08; }
    avatarLayer.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  }


  function registerCollider(x,z,w,d,options={}) { world.colliders.push({x,z,w,d,...options}); }
  function registerPlatform(x,z,w,d,top,options={}) { world.platforms.push({x,z,w,d,top,...options}); }
  function registerInteractable(data) { world.interactables.push({...data}); return data; }
  function worldPos(entry) {
    if (entry.getPos) return entry.getPos();
    return {x:entry.x,z:entry.z,y:entry.y||0};
  }
  function isInteractionAvailable(entry) {
    if (entry.disabled) return false;
    if (currentHouse) return entry.houseId === currentHouse.id || entry.globalInside;
    return !entry.houseId;
  }


  function ensureFlowerBatch(color){
    world.flowerBatches=world.flowerBatches||{stem:null,stemCount:0,petals:new Map()};
    const batch=world.flowerBatches;
    if(!batch.stem){
      batch.stem=new THREE.InstancedMesh(sharedBoxGeometry(.08,.42,.08),renderMat(0x2f9a42,{roughness:.82}),256);
      batch.stem.count=0;batch.stem.frustumCulled=false;batch.stem.castShadow=false;batch.stem.receiveShadow=false;worldGroup.add(batch.stem);
    }
    if(!batch.petals.has(color)){
      const mesh=new THREE.InstancedMesh(sharedBoxGeometry(.35,.18,.35),renderMat(color,{roughness:.62}),128);
      mesh.count=0;mesh.frustumCulled=false;mesh.castShadow=false;mesh.receiveShadow=false;worldGroup.add(mesh);batch.petals.set(color,{mesh,count:0});
    }
    return batch;
  }

  function createTree(x,z,scale=1,resource=true) {
    const group = new THREE.Group(); group.position.set(x,0,z); worldGroup.add(group);
    const seed=Math.abs(Math.round(x*17+z*29)),trunk=renderMat(seed%3===0?0x83502d:0x9a5d31,{roughness:.9});
    const dark=renderMat(seed%4===0?0x237f3c:0x2b9143,{roughness:.86}),mid=renderMat(seed%3===0?0x47b955:0x3fb651,{roughness:.82}),light=renderMat(seed%5===0?0x7bdc64:0x62cf5e,{roughness:.78});
    box(.74*scale,2.35*scale,.74*scale,trunk,0,1.18*scale,0,group);
    box(1.12*scale,.28*scale,.72*scale,trunk,0,.22*scale,0,group);
    box(.72*scale,.28*scale,1.12*scale,trunk,0,.22*scale,0,group);
    box(2.65*scale,1.18*scale,2.5*scale,dark,0,2.55*scale,0,group);
    box(2.05*scale,1.0*scale,2.25*scale,mid,-.45*scale,3.28*scale,.18*scale,group);
    box(1.8*scale,.92*scale,1.8*scale,light,.5*scale,3.55*scale,-.25*scale,group);
    box(1.22*scale,.68*scale,1.22*scale,mid,0,4.12*scale,0,group);
    if(!resource&&scale>.8){box(.34*scale,.18*scale,.34*scale,0xffe26a,.7*scale,3.95*scale,.65*scale,group);}
    if(resource){
      const id=`tree-${x.toFixed(1)}-${z.toFixed(1)}`;
      world.resources.push({id,type:'wood',x,z,mesh:group,collected:false});
      registerInteractable({id,type:'resource',icon:'🪵',label:'Coletar madeira',x,z,radius:2.4,action:()=>collectResource(id)});
    }
    return group;
  }
  function createRock(x,z,scale=1,resource=true) {
    const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(.8*scale,0),materials.stone); mesh.position.set(x,.55*scale,z); mesh.castShadow=true; mesh.receiveShadow=true; worldGroup.add(mesh);
    if(resource){const id=`rock-${x.toFixed(1)}-${z.toFixed(1)}`;world.resources.push({id,type:'stone',x,z,mesh,collected:false});registerInteractable({id,type:'resource',icon:'🪨',label:'Coletar pedra',x,z,radius:2.2,action:()=>collectResource(id)});} return mesh;
  }
  function createFlower(x,z,color=0xff70c8){
    const batch=ensureFlowerBatch(color),matrix=new THREE.Matrix4();
    if(batch.stemCount<256){
      matrix.makeTranslation(x,.21,z);batch.stem.setMatrixAt(batch.stemCount++,matrix);batch.stem.count=batch.stemCount;batch.stem.instanceMatrix.needsUpdate=true;
    }
    const petals=batch.petals.get(color);
    if(petals.count<128){
      matrix.makeTranslation(x,.5,z);petals.mesh.setMatrixAt(petals.count++,matrix);petals.mesh.count=petals.count;petals.mesh.instanceMatrix.needsUpdate=true;
    }
  }
  function createLamp(x,z){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);
    box(.2,2.55,.2,renderMat(0x33485c,{roughness:.65,metalness:.16}),0,1.28,0,g);
    box(.5,.16,.5,0x223244,0,2.52,0,g);
    const glowMat=renderMat(0xffdf75,{emissive:0xffc94d,emissiveIntensity:.78,roughness:.28});
    box(.58,.62,.58,glowMat,0,2.82,0,g);box(.72,.12,.72,0x223244,0,3.15,0,g);
    addGlow(x,2.82,z,0xffd56b,4);return g;
  }
  function createSignpost(x,z,text,rotationY=0){
    const post=box(.16,2.1,.16,materials.wood,x,1.05,z);
    const board=new THREE.Mesh(new THREE.PlaneGeometry(1.9,.6),new THREE.MeshStandardMaterial({map:signTexture(text,'#2a3f2c','#f4ede1'),roughness:.85,side:THREE.DoubleSide}));
    board.position.set(x,1.95,z); board.rotation.y=rotationY; worldGroup.add(board);
    return post;
  }
  function createFenceLine(x1,z1,x2,z2,segments=8){
    for(let i=0;i<=segments;i++){const t=i/segments;box(.18,1.0,.18,materials.wood,lerp(x1,x2,t),.5,lerp(z1,z2,t));}
    const mx=(x1+x2)/2,mz=(z1+z2)/2,w=Math.abs(x2-x1)||.15,d=Math.abs(z2-z1)||.15;box(w+.2,.13,d+.2,materials.wood,mx,.73,mz);
  }
  function createRoad(x,z,w,d){
    stableBox(w,.1,d,materials.road,x,.055,z,worldGroup,1);
    const horizontal=w>=d,curbColor=0xe6e8ec,lineMaterial=renderMat(0xffd83d,{roughness:.68,emissive:0x5d4100,emissiveIntensity:.06}),edgeMaterial=renderMat(0xffffff,{roughness:.74});
    const curbDark=renderMat(0x9ca7b3,{roughness:.88});
    if(horizontal){
      stableBox(w+2.6,.13,1.65,materials.sidewalk,x,.065,z-d/2-1.0,worldGroup,1);stableBox(w+2.6,.13,1.65,materials.sidewalk,x,.065,z+d/2+1.0,worldGroup,1);
      stableBox(w+2.8,.13,.22,curbDark,x,.16,z-d/2-.26,worldGroup,2);stableBox(w+2.8,.13,.22,curbDark,x,.16,z+d/2+.26,worldGroup,2);
      stableBox(w+2.6,.035,.14,curbColor,x,.235,z-d/2-.18,worldGroup,3);stableBox(w+2.6,.035,.14,curbColor,x,.235,z+d/2+.18,worldGroup,3);
      for(let lx=-w/2+3;lx<w/2-1.5;lx+=6)stableBox(2.35,.022,.34,lineMaterial,x+lx,.132,z,worldGroup,3);
      stableBox(w,.02,.13,edgeMaterial,x,.132,z-d/2+.78,worldGroup,3);stableBox(w,.02,.13,edgeMaterial,x,.132,z+d/2-.78,worldGroup,3);
    }else{
      stableBox(1.65,.13,d+2.6,materials.sidewalk,x-w/2-1.0,.065,z,worldGroup,1);stableBox(1.65,.13,d+2.6,materials.sidewalk,x+w/2+1.0,.065,z,worldGroup,1);
      stableBox(.22,.13,d+2.8,curbDark,x-w/2-.26,.16,z,worldGroup,2);stableBox(.22,.13,d+2.8,curbDark,x+w/2+.26,.16,z,worldGroup,2);
      stableBox(.14,.035,d+2.6,curbColor,x-w/2-.18,.235,z,worldGroup,3);stableBox(.14,.035,d+2.6,curbColor,x+w/2+.18,.235,z,worldGroup,3);
      for(let lz=-d/2+3;lz<d/2-1.5;lz+=6)stableBox(.34,.022,2.35,lineMaterial,x,.132,z+lz,worldGroup,3);
      stableBox(.13,.02,d,edgeMaterial,x-w/2+.78,.132,z,worldGroup,3);stableBox(.13,.02,d,edgeMaterial,x+w/2-.78,.132,z,worldGroup,3);
    }
  }
  function createWater(x,z,w,d){const water=stableBox(w,.12,d,materials.water,x,.04,z,worldGroup,1);water.material.depthWrite=false;for(let px=x-w/2+2;px<x+w/2;px+=4){stableBox(3.2,.18,.7,0x9fadb8,px,.09,z-d/2-.35,worldGroup,2);stableBox(3.2,.18,.7,0x9fadb8,px,.09,z+d/2+.35,worldGroup,2);}world.hazards.push({type:'water',x,z,w,d});}
  function createLava(x,z,w,d){const m=stableBox(w,.12,d,mat(0xff3a00,{emissive:0xff2200,emissiveIntensity:.9}),x,.04,z,worldGroup,1);world.hazards.push({type:'lava',x,z,w,d});return m;}

  function createFurniture(house, type, lx, lz, color=0xffffff, label='Usar') {
    const x=house.x+lx,z=house.z+lz,group=new THREE.Group();group.position.set(x,0,z);worldGroup.add(group);
    const wood=materials.wood,dark=renderMat(0x172231,{roughness:.64}),metal=renderMat(0x9ba9b8,{roughness:.4,metalness:.34}),cream=renderMat(0xfff3df,{roughness:.72});
    if(type==='bed'){
      box(2.25,.32,1.25,wood,0,.2,0,group);box(2.08,.32,1.1,renderMat(0x258ed6,{roughness:.68}),0,.54,0,group);
      box(.72,.2,1.02,cream,-.64,.82,0,group);box(.14,1.05,1.25,wood,-1.06,.7,0,group);box(1.85,.08,1.0,renderMat(0x55c9ff,{roughness:.58}),.12,.73,0,group);
    }
    if(type==='sofa'){
      const sofa=renderMat(color,{roughness:.72});box(2.25,.52,.9,sofa,0,.38,0,group);box(2.25,.82,.26,sofa,0,.88,-.36,group);
      box(.3,.72,.95,shadeColor(color,-18),-1.12,.54,0,group);box(.3,.72,.95,shadeColor(color,-18),1.12,.54,0,group);
      box(.86,.13,.66,shadeColor(color,16),-.5,.72,.05,group);box(.86,.13,.66,shadeColor(color,16),.5,.72,.05,group);
    }
    if(type==='tv'){
      box(1.75,.5,.62,wood,0,.3,0,group);box(1.62,1.02,.2,dark,0,1.2,0,group);
      box(1.38,.76,.05,renderMat(0x49cfff,{emissive:0x126b8f,emissiveIntensity:.25,roughness:.18}),0,1.2,.13,group);
      box(.12,.12,.12,0x38d66b,-.48,1.18,.18,group);box(.12,.12,.12,0xffd43b,.48,1.36,.18,group);
    }
    if(type==='fridge'){
      box(.94,1.86,.82,renderMat(0xdff4ff,{roughness:.36,metalness:.1}),0,.93,0,group);box(.88,.05,.84,0xa6c7d9,0,1.16,0,group);
      box(.06,.55,.08,metal,.29,1.38,.43,group);box(.06,.42,.08,metal,.29,.74,.43,group);
    }
    if(type==='stove'){
      box(1.12,.92,.86,renderMat(0xa8b3c0,{roughness:.42,metalness:.2}),0,.46,0,group);box(.88,.44,.06,dark,0,.43,.46,group);
      for(const ox of [-.28,.28])for(const oz of [-.2,.2])cylinder(.13,.045,0x111827,ox,.95,oz,group,12);
      for(const ox of [-.3,0,.3])cylinder(.04,.07,0xe8edf2,ox,.8,.46,group,8);
    }
    if(type==='sink'){
      box(1.25,.84,.78,cream,0,.42,0,group);box(.72,.13,.48,renderMat(0x5bc7e8,{roughness:.24,metalness:.12}),0,.89,0,group);
      box(.08,.5,.08,metal,.2,1.12,-.12,group);box(.34,.08,.08,metal,.03,1.35,-.12,group);
    }
    if(type==='shower'){
      box(1.15,.08,1.15,0x7dd9fa,0,.04,0,group);box(.08,2.2,.08,metal,.46,1.1,-.44,group);box(.7,1.9,.04,renderMat(0xa9ecff,{transparent:true,opacity:.35,roughness:.06}),0,1.05,-.48,group);
      cylinder(.16,.05,0x75879a,.46,2.08,-.44,group,12);
    }
    if(type==='chest'){box(1.25,.72,.82,wood,0,.36,0,group);box(1.3,.2,.87,0xffc629,0,.82,0,group);box(.18,.34,.08,metal,0,.55,.44,group);}
    if(type==='table'){box(1.6,.17,1.05,wood,0,.9,0,group);for(const ox of [-.58,.58])for(const oz of [-.35,.35])box(.13,.82,.13,wood,ox,.42,oz,group);box(.55,.08,.55,0x56c5ff,0,.99,0,group);}
    if(type==='wardrobe'){box(1.55,2.14,.68,renderMat(0x89502b,{roughness:.8}),0,1.07,0,group);box(.06,1.9,.7,0x5e351c,0,1.07,0,group);box(.08,.12,.08,0xffd84d,-.13,1.08,.37,group);box(.08,.12,.08,0xffd84d,.13,1.08,.37,group);}
    house.interiorObjects.push(group);return {group,x,z,type,label};
  }

  function signTexture(text, bg='#f4ede1', fg='#2a2118'){
    const c=document.createElement('canvas'); c.width=512; c.height=192;
    const ctx=c.getContext('2d');
    ctx.fillStyle=bg; ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle='rgba(0,0,0,.18)'; ctx.lineWidth=10; ctx.strokeRect(6,6,c.width-12,c.height-12);
    const words=String(text||'').trim().split(/\s+/).filter(Boolean);
    let lines=[''];
    const maxWidth=438;
    for(const word of words){
      const candidate=(lines[lines.length-1]+' '+word).trim();
      ctx.font='900 68px system-ui, sans-serif';
      if(ctx.measureText(candidate).width<=maxWidth||!lines[lines.length-1]) lines[lines.length-1]=candidate;
      else if(lines.length<2) lines.push(word);
      else lines[1]+=' '+word;
    }
    let fontSize=68;
    while(fontSize>30){
      ctx.font=`900 ${fontSize}px system-ui, sans-serif`;
      if(lines.every(line=>ctx.measureText(line).width<=maxWidth)) break;
      fontSize-=2;
    }
    ctx.fillStyle=fg; ctx.font=`900 ${fontSize}px system-ui, sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
    const lineHeight=fontSize*1.02;
    const startY=c.height/2-(lines.length-1)*lineHeight/2;
    lines.slice(0,2).forEach((line,i)=>ctx.fillText(line, c.width/2, startY+i*lineHeight));
    const tex=new THREE.CanvasTexture(c);
    tex.magFilter=THREE.LinearFilter; tex.minFilter=THREE.LinearMipmapLinearFilter; tex.generateMipmaps=true;
    tex.anisotropy=(renderer&&renderer.capabilities)?Math.min(8,renderer.capabilities.getMaxAnisotropy()):4;
    tex.encoding=THREE.sRGBEncoding;
    return tex;
  }
  function shadeColor(hex,amount){
    const r=Math.max(0,Math.min(255,((hex>>16)&255)+amount));
    const g=Math.max(0,Math.min(255,((hex>>8)&255)+amount));
    const b=Math.max(0,Math.min(255,(hex&255)+amount));
    return (r<<16)|(g<<8)|b;
  }
  function decorateHouseCommercial(house,config){
    const {id,x,z,color,roofColor,publicBuilding}=config,trim=shadeColor(color,38),dark=shadeColor(color,-44);
    premiumBox(9.3,.18,.22,dark,x,2.76,z+3.5,house.front);
    makePlanter(house.front,x-2.45,.88,z+3.68,id==='blue'?0x52c7ff:id==='pink'?0xff6ba7:0xffd34d);makePlanter(house.front,x+2.45,.88,z+3.68,0x75e56e);
    if(publicBuilding){
      const awningColor=id==='shop'?0xe5483e:0x2f7fd8;
      for(let i=-4;i<=4;i++)box(.58,.18,1.25,i%2?0xfff5df:awningColor,x+i*.58,2.44,z+3.92,house.front);
      premiumBox(4.5,.78,.24,0x18334d,x,3.08,z+3.6,house.front);
      premiumBox(.62,.45,.62,trim,x-3.25,3.32,z+3.55,house.front);premiumBox(.62,.45,.62,trim,x+3.25,3.32,z+3.55,house.front);
    }else{
      premiumBox(2.25,.24,1.1,trim,x,2.37,z+3.78,house.front);premiumBox(.18,1.12,.18,trim,x-.9,1.77,z+3.8,house.front);premiumBox(.18,1.12,.18,trim,x+.9,1.77,z+3.8,house.front);
    }
    premiumBox(.45,1.2,.45,shadeColor(roofColor,-35),x+2.8,4.6,z-1.4,house.roof);premiumBox(.65,.18,.65,0xd8dce2,x+2.8,5.22,z-1.4,house.roof);
    house.roof.traverse(o=>{if(o.isMesh&&o.geometry?.type==='BoxGeometry')addVoxelOutline(o,0x182238,.24)});
    house.front.traverse(o=>{if(o.isMesh&&o.geometry?.type==='BoxGeometry')addVoxelOutline(o,0x182238,.25)});
  }

  function createHouse(config) {
    const {id,name,x,z,color,roofColor,price=0,publicBuilding=false}=config;
    const house={id,name,x,z,w:9,d:7,color,roofColor,price,publicBuilding,roof:new THREE.Group(),front:new THREE.Group(),interiorObjects:[],owned:!!state.houses[id]?.owned};
    worldGroup.add(house.roof,house.front);
    const wallMat=tintedBrickMaterial(color),corner=renderMat(new THREE.Color(color).lerp(new THREE.Color(0xffffff),.48).getHex(),{roughness:.78});
    box(9,.25,7,materials.wood,x,.12,z);
    box(9,2.8,.35,wallMat,x,1.5,z-3.32);box(.35,2.8,7,wallMat,x-4.32,1.5,z);box(.35,2.8,7,wallMat,x+4.32,1.5,z);
    box(3.6,2.8,.35,wallMat,x-2.7,1.5,z+3.32,house.front);box(3.6,2.8,.35,wallMat,x+2.7,1.5,z+3.32,house.front);
    for(const cx of [-4.12,4.12]){box(.24,2.82,.4,corner,x+cx,1.5,z-3.28);box(.24,2.82,.4,corner,x+cx,1.5,z+3.28,house.front);}
    box(9.8,.62,7.75,roofColor,x,3.18,z,house.roof);box(8.8,.35,6.8,shadeColor(roofColor,18),x,3.55,z,house.roof);
    box(7.5,.42,7.15,roofColor,x,3.86,z,house.roof);box(5.9,.4,5.85,shadeColor(roofColor,26),x,4.18,z,house.roof);
    const spotMat=renderMat(0xfff2df,{roughness:.52});
    [[-2.5,-1.7],[2.25,-1.45],[-.4,1.8],[1.2,.5],[-1.2,-.1]].forEach(([ox,oz],i)=>box(i%2?.72:.88,.16,i%2?.72:.88,spotMat,x+ox,4.42,z+oz,house.roof));
    const door=box(1.45,2.25,.18,materials.wood,x,1.12,z+3.48);door.userData.houseId=id;
    box(.18,2.0,.2,corner,x-.83,1.16,z+3.46,house.front);box(.18,2.0,.2,corner,x+.83,1.16,z+3.46,house.front);
    makeWindow(house.front,x-2.4,1.45,z+3.52,1.12,.86,0xf6efe1);makeWindow(house.front,x+2.4,1.45,z+3.52,1.12,.86,0xf6efe1);
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.8,.66),new THREE.MeshStandardMaterial({map:signTexture(name,'#18334d','#ffffff'),roughness:.65,side:THREE.DoubleSide}));
    sign.position.set(x,2.36,z+3.58);house.front.add(sign);
    box(.16,.55,.16,materials.wood,x-1.55,.28,z+4.7);box(.36,.25,.24,shadeColor(color,12),x-1.55,.62,z+4.7);
    if(!publicBuilding){createFlower(x-3.1,z+4.7,shadeColor(0xff70c8,(id.charCodeAt(0)%3)*20-20));createFlower(x+3.1,z+4.7,0xffdf55);}
    createLamp(x-3.7,z+4.0);createLamp(x+3.7,z+4.0);
    house.door=door;
    registerCollider(x,z-3.32,9,.35,{houseId:id});registerCollider(x-4.32,z,.35,7,{houseId:id});registerCollider(x+4.32,z,.35,7,{houseId:id});registerCollider(x-2.7,z+3.32,3.6,.35,{houseId:id});registerCollider(x+2.7,z+3.32,3.6,.35,{houseId:id});
    world.houses.push(house);registerInteractable({id:`door-${id}`,type:'door',icon:'🚪',label:`Abrir: ${name}`,x,z:z+4.0,radius:2.5,priority:230,action:()=>handleHouseDoor(house)});
    decorateHouseCommercial(house,config);return house;
  }

  function addHouseInterior(house, type='home') {
    if(type==='home'){
      const bed=createFurniture(house,'bed',-2.85,-1.95,0,'Dormir');
      const sofa=createFurniture(house,'sofa',.85,-1.95,0x8b5cf6,'Sentar no sofá');
      const tv=createFurniture(house,'tv',2.85,-.25,0,'Assistir televisão');
      const fridge=createFurniture(house,'fridge',-3.05,1.55,0,'Abrir geladeira');
      const stove=createFurniture(house,'stove',-1.65,1.55,0,'Cozinhar');
      const sink=createFurniture(house,'sink',-.25,1.55,0,'Beber água');
      const shower=createFurniture(house,'shower',3.1,1.6,0,'Tomar banho');
      const chest=createFurniture(house,'chest',3.15,-2.05,0,'Abrir baú');
      const wardrobe=createFurniture(house,'wardrobe',2.95,.65,0,'Trocar roupa');
      premiumBox(3.5,.04,2.2,0xd6a65d,house.x-1.7,.18,house.z+1.45,worldGroup,0x765228);
      premiumBox(3.2,.04,2.0,0x7057b7,house.x+1.1,.18,house.z-1.85,worldGroup,0x3f2c65);
      premiumBox(8.1,.12,.18,0x63b4e8,house.x,.78,house.z-3.08);premiumBox(.18,2.0,.18,0x63b4e8,house.x-3.9,1.05,house.z-2.95);premiumBox(.18,2.0,.18,0x63b4e8,house.x+3.9,1.05,house.z-2.95);
      const lampA=addGlow(house.x-2.1,2.25,house.z-.1,0xffc66e,5),lampB=addGlow(house.x+2.1,2.25,house.z-.1,0xffc66e,5);house.interiorObjects.push(lampA,lampB);
      registerActivity(house,bed,'bed');registerActivity(house,sofa,'sofa');registerActivity(house,tv,'tv');registerActivity(house,fridge,'fridge');registerActivity(house,stove,'stove');registerActivity(house,sink,'sink');registerActivity(house,shower,'shower');registerActivity(house,chest,'chest');registerActivity(house,wardrobe,'wardrobe');
    } else if(type==='shop'){
      const table=createFurniture(house,'table',0,-1.2,0,'Comprar itens');registerActivity(house,table,'shop');
    } else if(type==='workshop'){
      const table=createFurniture(house,'table',0,-1.0,0,'Usar oficina');registerActivity(house,table,'workshop');
      createFurniture(house,'chest',2.8,-1.8,0,'Baú de ferramentas');
    } else if(type==='neighbor'){
      const sofa=createFurniture(house,'sofa',1,-1.5,0xef6c9d,'Sentar');registerActivity(house,sofa,'sofa');
      const tv=createFurniture(house,'tv',1,.2,0,'Assistir TV');registerActivity(house,tv,'tv');
      createFurniture(house,'bed',-2.5,-1.7,0,'Cama');
    }
    registerInteractable({id:`exit-${house.id}`,type:'exit',icon:'🚪',label:'Sair da casa',x:house.x,z:house.z+2.65,radius:1.5,priority:240,houseId:house.id,action:()=>exitHouse()});
  }
  function registerActivity(house,item,activity){
    const priority=({stove:180,fridge:170,sink:165,bed:160,shower:155,tv:150,sofa:145,wardrobe:140,chest:120,shop:170,workshop:170})[activity]||100;
    registerInteractable({id:`${activity}-${house.id}`,type:'activity',activity,icon:activityIcon(activity),label:item.label,x:item.x,z:item.z,radius:1.75,priority,houseId:house.id,action:()=>useActivity(activity,house)});
  }
  function activityIcon(type){return ({bed:'🛏',sofa:'🛋',tv:'📺',fridge:'🍎',stove:'🍳',sink:'💧',shower:'🚿',chest:'🎁',shop:'🛒',workshop:'🛠',wardrobe:'👕'})[type]||'✋';}

  function createNPC(id,name,x,z,color,pathRadius=3){
    const group=new THREE.Group();group.position.set(x,0,z);worldGroup.add(group);
    const hairPalette=[0x3b2415,0x111214,0xd9b45a,0xa4471f,0x2b3a55,0x8a8f99],skinPalette=[0xffd3a0,0xe7ad7d,0xb97853,0x8e5a3e];
    const hash=String(id).split('').reduce((a,c)=>a+c.charCodeAt(0),0),hairColor=hairPalette[hash%hairPalette.length],skin=skinPalette[hash%skinPalette.length];
    const shirt=renderMat(color,{roughness:.68}),shirtDark=renderMat(shadeColor(color,-28),{roughness:.72}),pants=renderMat(hash%2?0x294b75:0x44356f,{roughness:.76}),shoe=renderMat(hash%3===0?0xffffff:0x1b2635,{roughness:.58});
    const body=box(.82,1.06,.58,shirt,0,1.13,0,group),head=box(.7,.7,.7,skin,0,2.03,0,group);
    box(.76,.18,.64,hairColor,0,2.38,0,group);if(hash%3===0){box(.18,.42,.58,hairColor,-.34,2.15,0,group);box(.18,.42,.58,hairColor,.34,2.15,0,group);}else if(hash%3===1){box(.72,.12,.12,hairColor,0,2.14,.34,group);}
    box(.09,.09,.04,0x111827,-.16,2.08,.37,group);box(.09,.09,.04,0x111827,.16,2.08,.37,group);box(.18,.05,.04,0xa84b4b,0,1.91,.37,group);
    box(.72,.14,.6,shirtDark,0,.66,0,group);
    const leftArm=new THREE.Group(),rightArm=new THREE.Group(),leftLeg=new THREE.Group(),rightLeg=new THREE.Group();
    leftArm.position.set(-.52,1.4,0);rightArm.position.set(.52,1.4,0);leftLeg.position.set(-.21,.74,0);rightLeg.position.set(.21,.74,0);group.add(leftArm,rightArm,leftLeg,rightLeg);
    for(const arm of [leftArm,rightArm]){box(.24,.48,.24,shirt,0,-.22,0,arm);box(.22,.25,.22,skin,0,-.58,0,arm);}
    for(const leg of [leftLeg,rightLeg]){box(.24,.58,.25,pants,0,-.28,0,leg);box(.27,.18,.34,shoe,0,-.65,.06,leg);}
    if(hash%4===0)box(.9,.18,.7,0x2f7ed6,0,2.48,0,group);
    const npc={id,name,x,z,baseX:x,baseZ:z,color,group,pathRadius,phase:Math.random()*6.28,friendship:state.friendship[id]||0,body,head,limbs:{leftArm,rightArm,leftLeg,rightLeg}};
    group.traverse(o=>{if(o.isMesh)addVoxelOutline(o,0x172033,.3);});
    const badge=new THREE.Sprite(new THREE.SpriteMaterial({map:iconTexture(name.charAt(0),'#ffffff','#15314b'),transparent:true,depthWrite:false}));badge.position.set(0,2.95,0);badge.scale.set(.55,.55,.55);badge.visible=false;group.add(badge);npc.badge=badge;
    world.npcs.push(npc);registerInteractable({id:`npc-${id}`,type:'npc',icon:'💬',label:`Conversar com ${name}`,radius:2.7,priority:160,getPos:()=>({x:npc.group.position.x,z:npc.group.position.z}),action:()=>talkToNPC(npc)});return npc;
  }
  function createEnemy(type,x,z){
    const group=new THREE.Group();group.position.set(x,0,z);worldGroup.add(group);
    if(type==='slime'){box(1.35,.85,1.35,0x31c65b,0,.45,0,group);box(.18,.12,.05,0xff2441,-.28,.55,.7,group);box(.18,.12,.05,0xff2441,.28,.55,.7,group);}
    else if(type==='bat'){box(1.0,.75,1.0,0x35165e,0,1.4,0,group);box(.8,.18,.45,0x8c4ddb,-.8,1.4,0,group);box(.8,.18,.45,0x8c4ddb,.8,1.4,0,group);box(.12,.1,.05,0xff31f5,-.22,1.48,.54,group);box(.12,.1,.05,0xff31f5,.22,1.48,.54,group);}
    else {box(1.5,1.8,1.2,0x788495,0,1.0,0,group);box(1.0,.8,1.0,0x647080,0,2.2,0,group);box(.14,.1,.05,0xff293f,-.22,2.25,.52,group);box(.14,.1,.05,0xff293f,.22,2.25,.52,group);}
    const enemy={id:`enemy-${type}-${world.enemies.length}`,type,x,z,baseX:x,baseZ:z,group,hp:type==='golem'?3:1,phase:Math.random()*6.28,dead:false,lastHit:0};world.enemies.push(enemy);return enemy;
  }
  function createCrystal(x,y,z,secret=false){
    const mesh=new THREE.Mesh(new THREE.OctahedronGeometry(.48,0),mat(secret?0xa855f7:0x38d8ff,{emissive:secret?0x7e22ce:0x0a9dc0,emissiveIntensity:.7,metalness:.08,roughness:.22}));mesh.position.set(x,y,z);mesh.castShadow=true;worldGroup.add(mesh);addGlow(x,y,z,secret?0xa855f7:0x38d8ff,3);
    world.crystals.push({id:`crystal-${world.crystals.length}`,x,y,z,mesh,got:false,secret});
  }
  function createChest(id,x,z,secret=false){
    const group=new THREE.Group();group.position.set(x,0,z);worldGroup.add(group);box(1.2,.72,.9,materials.wood,0,.36,0,group);const lid=box(1.25,.22,.95,secret?0xa855f7:0xffd84d,0,.84,0,group);const chest={id,x,z,group,lid,opened:!!state.flags[`chest_${id}`],secret};if(chest.opened)lid.rotation.x=-.6;registerInteractable({id:`chest-${id}`,type:'chest',icon:'🎁',label:secret?'Pegar presente secreto':'Abrir presente/baú',x,z,radius:2,priority:200,action:()=>openChest(chest)});return chest;
  }
  function createPlatform(x,y,z,w=3,d=3,color=0x8b5a2b){box(w,y,d,color,x,y/2,z);registerPlatform(x,z,w,d,y);}
  function createToyCar(x,z){
    const group=new THREE.Group();group.position.set(x,0,z);worldGroup.add(group);
    const chassis=renderMat(0x26384e,{roughness:.5,metalness:.16}),orange=renderMat(0xf28a22,{roughness:.4,metalness:.18}),teal=renderMat(0x0aa7b8,{roughness:.38,metalness:.22}),glass=renderMat(0x102338,{roughness:.12,metalness:.38,transparent:true,opacity:.84});
    box(1.84,.36,2.56,chassis,0,.28,0,group);box(1.72,.48,1.35,orange,0,.55,.55,group);box(1.48,.46,.92,teal,0,.78,-.48,group);box(1.32,.31,.72,glass,0,.93,-.42,group);
    box(1.94,.18,.28,0xf3f5f7,0,.32,1.34,group);box(.18,.34,2.2,teal,-.92,.42,0,group);box(.18,.34,2.2,teal,.92,.42,0,group);
    box(.72,.42,.58,0x151a23,0,.72,-.12,group);
    const headlight=renderMat(0xfff1a8,{emissive:0xffd75b,emissiveIntensity:.9,roughness:.2});box(.3,.17,.08,headlight,-.58,.5,1.27,group);box(.3,.17,.08,headlight,.58,.5,1.27,group);
    for(const p of [[-.84,.24,-.79],[.84,.24,-.79],[-.84,.24,.79],[.84,.24,.79]]){const wheel=cylinder(.34,.28,0x10151d,p[0],p[1],p[2],group,14);wheel.rotation.z=Math.PI/2;const hub=cylinder(.12,.3,0xf5a623,p[0],p[1],p[2],group,10);hub.rotation.z=Math.PI/2;}
    group.traverse(o=>{if(o.isMesh)addVoxelOutline(o,0x14243a,.28);});
    world.vehicle={x,z,group};registerInteractable({id:'toy-car',type:'vehicle',icon:'🚗',label:'Entrar no carro',x,z,radius:2.4,action:()=>enterVehicle()});
  }

  function createWaypointMarker(){
    const group=new THREE.Group();
    const beam=box(.32,6,.32,0x38d8ff,0,3,0,group);beam.material.transparent=true;beam.material.opacity=.48;
    const top=new THREE.Mesh(new THREE.OctahedronGeometry(.65,0),mat(0x6ee94b,{emissive:0x35c728,emissiveIntensity:.75}));top.position.y=6.4;group.add(top);
    group.visible=false;worldGroup.add(group);world.waypointMarker=group;updateWaypointMarker();
  }
  function updateWaypointMarker(){
    if(!world.waypointMarker)return;
    const wp=state.waypoint;world.waypointMarker.visible=!!wp;
    if(wp)world.waypointMarker.position.set(wp.x,0,wp.z);
  }
  function createAthleticsGym(){
    const gym={x:45,z:78,startX:26,finishX:76,lane1Z:73,lane2Z:78};world.gym=gym;
    box(58,.16,15,0xc46a3b,51,.08,75.5);box(54,.06,3.2,0xf4d35e,51,.18,73);box(54,.06,3.2,0x5ad8ff,51,.18,78);
    for(let x=28;x<=76;x+=6){box(.12,.05,14,0xffffff,x,.22,75.5);}
    box(.45,3.2,15,0xffffff,gym.finishX,1.6,75.5);box(12,3.6,6,0x315779,45,1.8,88);box(10,.7,5,0xffd84d,45,3.95,88);
    createLamp(27,67);createLamp(75,67);createLamp(27,84);createLamp(75,84);
    registerInteractable({id:'athletics-gym',type:'race',icon:'🏃',label:'Abrir desafios do ginásio',x:45,z:84,radius:3.2,priority:120,action:()=>openRaceCenter()});
  }
  function createSizeChallenges(){
    // Passagem mini
    box(.7,2.5,5,0x64748b,-41,1.25,42);box(.7,2.5,5,0x64748b,-35,1.25,42);box(6.7,.65,5,0x64748b,-38,2.2,42);
    registerInteractable({id:'mini-tunnel',type:'challenge',icon:'◱',label:'Passagem pequena',x:-38,z:44.5,radius:3,priority:110,action:()=>{
      if(player.scaleMode!=='mini'){toast('Use o botão MINI para passar.','warn',2200);return;}player.z=39.5;setFlag('miniPassage');addXP(25);toast('Passagem mini concluída!','good');
    }});
    // Túnel baixo
    box(.7,1.55,4,0x8b5a2b,-56,.78,24);box(.7,1.55,4,0x8b5a2b,-50,.78,24);box(6.7,.45,4,0x8b5a2b,-53,1.55,24);
    registerInteractable({id:'crouch-tunnel',type:'challenge',icon:'▼',label:'Túnel baixo',x:-53,z:26,radius:3,priority:110,action:()=>{
      if(!player.crouched){toast('Use ABAIXAR para entrar.','warn',2200);return;}player.z=21.5;setFlag('crouchPassage');addXP(25);toast('Túnel baixo concluído!','good');
    }});
    // Portão grande
    box(8,4,.6,0x6b7280,36,2,-35);box(1,5,1,0x94a3b8,31.5,2.5,-35);box(1,5,1,0x94a3b8,40.5,2.5,-35);
    registerInteractable({id:'giant-gate',type:'challenge',icon:'⬡',label:'Abrir portão pesado',x:36,z:-32,radius:3.2,priority:110,action:()=>{
      if(player.scaleMode!=='giant'){toast('Use GRANDE para abrir o portão.','warn',2200);return;}setFlag('giantGate');addXP(35);toast('Portão pesado aberto!','good');
    }});
  }

  function createSkyDome(){
    const c=document.createElement('canvas');c.width=16;c.height=512;const ctx=c.getContext('2d'),g=ctx.createLinearGradient(0,0,0,512);
    g.addColorStop(0,'#087ee8');g.addColorStop(.34,'#42b9ff');g.addColorStop(.67,'#9de2ff');g.addColorStop(.88,'#d9f4ff');g.addColorStop(1,'#fff0bf');ctx.fillStyle=g;ctx.fillRect(0,0,16,512);
    const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.LinearFilter;tex.minFilter=THREE.LinearFilter;
    const sky=new THREE.Mesh(new THREE.SphereGeometry(430,20,18),new THREE.MeshBasicMaterial({map:tex,side:THREE.BackSide,fog:false,depthWrite:false}));scene.add(sky);
    const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const gx=glowCanvas.getContext('2d'),rad=gx.createRadialGradient(64,64,12,64,64,64);rad.addColorStop(0,'rgba(255,250,207,1)');rad.addColorStop(.35,'rgba(255,230,128,.72)');rad.addColorStop(1,'rgba(255,214,88,0)');gx.fillStyle=rad;gx.fillRect(0,0,128,128);
    const sunTex=new THREE.CanvasTexture(glowCanvas),sunGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:sunTex,transparent:true,depthWrite:false,fog:false}));sunGlow.position.set(-145,126,-235);sunGlow.scale.set(72,72,1);scene.add(sunGlow);
    const sun=new THREE.Mesh(new THREE.CircleGeometry(13,24),new THREE.MeshBasicMaterial({color:0xfff4c4,depthWrite:false,fog:false}));sun.position.set(-145,126,-232);sun.lookAt(0,70,0);scene.add(sun);
    const cloudMat=renderMat(0xffffff,{transparent:true,opacity:.9,roughness:.95});world.clouds=[];
    const cloudGeo=sharedBoxGeometry(1,1,1);
    for(let i=0;i<7;i++){
      const cloud=new THREE.Group(),parts=[[0,0,0,7,2.2,2.8],[-5.4,-.35,0,5.3,1.85,2.4],[5.1,-.2,0,5.8,2,2.5],[-.8,1.35,0,4.9,2.35,2.6],[3,1.05,0,3.7,1.8,2.3]];
      parts.forEach(([x,y,z,w,h,d])=>{const p=new THREE.Mesh(cloudGeo,cloudMat);p.scale.set(w,h,d);p.position.set(x,y,z);p.frustumCulled=false;cloud.add(p);});
      cloud.position.set((Math.random()-.5)*360,62+Math.random()*38,(Math.random()-.5)*330);cloud.scale.setScalar(.72+Math.random()*.8);scene.add(cloud);world.clouds.push({group:cloud,speed:.55+Math.random()*.85});
    }
  }
  function updateClouds(dt){
    if(textures.water){textures.water.offset.x=(textures.water.offset.x+dt*.012)%1;textures.water.offset.y=(textures.water.offset.y+dt*.007)%1;}
    if(!world.clouds)return;
    for(const c of world.clouds){c.group.position.x+=c.speed*dt;if(c.group.position.x>210)c.group.position.x=-210;}
  }

  function createVoxelMushroom(x,z,scale=1,color=0xe34242){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);
    const stem=renderMat(0xe5bd82,{roughness:.86}),stemLight=renderMat(0xf2d8a8,{roughness:.78}),cap=renderMat(color,{roughness:.56}),capLight=renderMat(shadeColor(color,22),{roughness:.5}),spot=renderMat(0xfff2df,{roughness:.48});
    box(1.45*scale,3.15*scale,1.45*scale,stem,0,1.58*scale,0,g);box(.55*scale,2.7*scale,.08*scale,stemLight,-.34*scale,1.68*scale,.74*scale,g);
    box(4.5*scale,.82*scale,3.6*scale,cap,0,3.22*scale,0,g);box(3.65*scale,.86*scale,4.45*scale,cap,0,3.34*scale,0,g);
    box(3.2*scale,.74*scale,3.2*scale,capLight,0,3.9*scale,0,g);box(2.25*scale,.5*scale,2.25*scale,cap,0,4.42*scale,0,g);
    [[-1.3,.35,.72],[1.1,.5,.62],[0,-1.2,.75],[.5,1.22,.58],[-.35,.1,.48]].forEach(([sx,sz,s])=>box(s*scale,.17*scale,s*scale,spot,sx*scale,4.7*scale,sz*scale,g));
    if(scale>.95)addVoxelOutline(g.children[0],0x5d3b24,.24);world.landmarks.push(g);return g;
  }
  function iconTexture(symbol,bg='#f5c739',fg='#10263f'){
    const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,256,256);ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=18;ctx.strokeRect(12,12,232,232);ctx.fillStyle=fg;ctx.font='900 150px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(symbol,128,137);const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.LinearMipmapLinearFilter;return tex;
  }
  function createChallengeCube(x,y,z,symbol='◆',color='#ffd33f'){const material=new THREE.MeshStandardMaterial({map:iconTexture(symbol,color),roughness:.5,emissive:0x5c3f00,emissiveIntensity:.16});const cube=box(1.75,1.75,1.75,material,x,y,z);cube.userData.floatBase=y;world.landmarks.push(cube);return cube;}
  function createPortalArch(x,z){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);const stone=mat(0x46546c,{roughness:.55,metalness:.08}),glow=mat(0x28ddff,{emissive:0x00a9d6,emissiveIntensity:1.6,roughness:.15});
    box(1.2,7,1.2,stone,-3,3.5,0,g);box(1.2,7,1.2,stone,3,3.5,0,g);box(7.2,1.2,1.2,stone,0,7,0,g);
    for(let i=0;i<9;i++){const ang=Math.PI*i/8;const p=new THREE.Mesh(new THREE.BoxGeometry(.55,.55,.35),glow);p.position.set(Math.cos(ang)*2.35,3.3+Math.sin(ang)*2.35,.25);p.rotation.z=-ang;g.add(p);}
    addGlow(x,3.4,z,0x2de8ff,14);world.landmarks.push(g);return g;
  }
  function createPlayground(x,z){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);box(8,.18,6,0x64bf49,0,.09,0,g);box(1.2,2.2,1.2,0x3b82f6,-2,1.1,0,g);box(1.2,2.2,1.2,0xf97316,2,1.1,0,g);
    const slide=box(1.35,.22,4.2,0xfacc15,1.7,1.1,1.5,g);slide.rotation.x=-.42;for(const sx of [-2.4,2.4]){box(.18,3.4,.18,materials.wood,sx,1.7,-2,g);box(.18,3.4,.18,materials.wood,sx+1.1,1.7,-2,g);}box(5.3,.18,.18,0xef4444,.55,3.25,-2,g);world.landmarks.push(g);return g;
  }
  function createFountain(x,z){const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);cylinder(3,.32,0x9aa9b8,0,.16,0,g,16);cylinder(2.35,.22,0x31b7e8,0,.36,0,g,16);cylinder(.45,2.3,0xb8c4cf,0,1.35,0,g,12);const orb=new THREE.Mesh(new THREE.OctahedronGeometry(.55,0),mat(0x42e7ff,{emissive:0x05a8cc,emissiveIntensity:1.2,roughness:.2}));orb.position.y=2.8;g.add(orb);addGlow(x,2.8,z,0x42e7ff,7);world.landmarks.push(g);return g;}
  function createAwning(x,z,color=0xef4444,rotation=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rotation;worldGroup.add(g);for(let i=-3;i<=3;i++)box(.55,.18,1.25,i%2?0xfff7e8:color,i*.55,2.15,0,g);world.landmarks.push(g);return g;}
  function createStreetTree(x,z,scale=1){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);
    premiumBox(.54,2.15,.54,0x89512c,0,1.08,0,g);premiumBox(2.3,.86,2.05,0x278f43,0,2.5,0,g);
    premiumBox(1.7,.8,1.9,0x4ebd57,-.38,3.15,.12,g);premiumBox(1.45,.68,1.45,0x70d86a,.42,3.62,-.12,g);
    makePlanter(g,0,.2,0,0xffd24d);return g;
  }
  function createBackdropBuilding(x,z,w,h,d,color,accent=0xffffff){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);
    const main=renderMat(color,{roughness:.78}),dark=renderMat(shadeColor(color,-34),{roughness:.82}),windowMat=renderMat(0x54cfff,{emissive:0x145f82,emissiveIntensity:.13,roughness:.2});
    const building=box(w,h,d,main,0,h/2,0,g);addVoxelOutline(building,0x24354b,.2);box(w+.3,.35,d+.3,dark,0,h+.18,0,g);
    const front=z<0?d/2+.03:-d/2-.03;
    for(let yy=1.25;yy<h-1;yy+=1.65)for(let xx=-w/2+.85;xx<w/2-.35;xx+=1.5)box(.76,.7,.08,windowMat,xx,yy,front,g);
    box(w*.54,.28,.42,renderMat(accent,{roughness:.58}),0,.86,front+(z<0?.18:-.18),g);
    box(w*.7,.22,d*.35,dark,0,h+.47,0,g);world.landmarks.push(g);return g;
  }
  function createFloatingIsland(x,y,z,scale=1){
    const g=new THREE.Group();g.position.set(x,y,z);worldGroup.add(g);premiumBox(8*scale,1.2*scale,7*scale,0x4ba944,0,0,0,g);premiumBox(6.8*scale,.5*scale,6.2*scale,0x7bd45b,0,.82*scale,0,g);
    for(let i=0;i<4;i++){const rock=new THREE.Mesh(new THREE.ConeGeometry((2.7-i*.45)*scale,2.1*scale,4),materials.stone);rock.position.y=-1.3*scale-i*.65*scale;rock.rotation.y=Math.PI/4;g.add(rock);}const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(.65*scale,0),mat(0x4de5ff,{emissive:0x009ac8,emissiveIntensity:1.3,roughness:.15}));crystal.position.y=1.9*scale;g.add(crystal);addVoxelOutline(crystal,0x15334c,.35);world.landmarks.push(g);return g;
  }
  function createCoinTrail(points){
    const coinMat=mat(0xffd52e,{emissive:0xb26b00,emissiveIntensity:.32,metalness:.18,roughness:.3});points.forEach(([x,z],i)=>{const c=new THREE.Mesh(new THREE.TorusGeometry(.34,.11,7,14),coinMat);c.position.set(x,1.15+Math.sin(i*.7)*.18,z);c.rotation.y=Math.PI/2;worldGroup.add(c);world.landmarks.push(c);});
  }
  function createCommercialDistrict(){
    // Peripheral skyline preserves gameplay coordinates while giving a premium city silhouette.
    [[-108,-92,12,12,10,0xe77a32,0xffd75a],[-88,-105,11,17,9,0x35a8e8,0xffffff],[-64,-108,13,14,9,0x8b5cf6,0xf4d35e],[-35,-109,11,18,9,0x46b96a,0xffffff],[38,-109,12,16,9,0xe84a6f,0xffef98],[68,-107,13,20,10,0x2f7fd8,0xffffff],[99,-93,12,14,10,0xf09c35,0x45d7ff]].forEach(v=>createBackdropBuilding(...v));
    [[-104,92,13,16,10,0x4f9fd7,0xffffff],[-74,107,11,19,9,0xe86a3d,0xffed84],[-36,108,12,14,9,0x65b85d,0xffffff],[35,108,12,18,10,0x8a62d4,0x5ee7ff],[69,106,13,15,9,0xe44a4a,0xffffff],[103,88,11,20,10,0x3b91d1,0xffed84]].forEach(v=>createBackdropBuilding(...v));
    createFloatingIsland(-78,36,-138,.75);createFloatingIsland(18,48,-150,.9);createFloatingIsland(96,30,-132,.65);
    [[-17,-8],[-10,-8],[10,-8],[17,-8],[-17,8],[-10,8],[10,8],[17,8]].forEach(p=>createStreetTree(...p,.72));
    createCoinTrail([[34,-28],[39,-31],[44,-34],[49,-37],[54,-40],[59,-43],[64,-46]]);
  }

  function createDistrictVisuals(){
    [[-13,34,1.05,0xe64343],[-37,35,.82,0x4b78e8],[14,-34,.95,0xec4c4c],[40,-5,.78,0x8b5cf6],[-70,-20,1.35,0xdf3f3f],[-82,-76,.9,0x5c7ce2],[72,28,1.1,0xe94d4d],[92,22,.82,0x8b5cf6]].forEach(v=>createVoxelMushroom(...v));
    createPlayground(-8,-38);createFountain(0,-2);createPortalArch(88,51);createChallengeCube(36,1.3,-27,'◆','#ffd43b');createChallengeCube(66,1.3,-50,'★','#53d8ff');createChallengeCube(-43,1.3,35,'◈','#ff756f');createAwning(-22,-14,0xef4444,0);createAwning(22,-14,0x2563eb,0);createCommercialDistrict();
  }

  function createLearningStation(id,subject,x,z,color,icon,label){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);premiumBox(2.5,.35,2.5,0x34485e,0,.18,0,g);premiumBox(1.7,2.1,1.2,color,0,1.35,0,g);const panel=new THREE.Mesh(new THREE.PlaneGeometry(1.25,1.25),new THREE.MeshStandardMaterial({map:iconTexture(icon,color,'#ffffff'),roughness:.35,emissive:new THREE.Color(color),emissiveIntensity:.12,side:THREE.DoubleSide}));panel.position.set(0,1.55,.63);g.add(panel);const beacon=new THREE.Mesh(new THREE.OctahedronGeometry(.34,0),mat(color,{emissive:color,emissiveIntensity:1.1}));beacon.position.y=2.75;g.add(beacon);registerInteractable({id:`learning-${id}`,type:'education',icon,label,x,z,radius:3,priority:130,action:()=>openEducationHub(subject)});world.landmarks.push(g);return g;
  }
  function createLearningPlaza(){createLearningStation('math','math',22,-32,0x27b36a,'＋','Jogar Matemática Kids');createLearningStation('portuguese','portuguese',22,-40,0x7b5ce6,'A','Jogar Português Kids');createLearningStation('english','english',22,-48,0x168de2,'E','Jogar English Kids');createSignpost(22,-27,'Academia Kids',Math.PI/2);}

  function buildWorld(){
    worldGroup=new THREE.Group();scene.add(worldGroup);
    const ground=stableBox(250,.3,250,materials.grass,0,-.15,0,worldGroup,0);ground.receiveShadow=false;
    createSkyDome();
    scene.background=new THREE.Color(0x79cfff);scene.fog=new THREE.Fog(0xbce8ff,235,560);
    // roads
    createRoad(0,0,18,210);createRoad(0,0,210,18);createRoad(-55,-55,9,105);createRoad(55,48,9,92);
    createDistrictVisuals();createLearningPlaza();
    // water, bridge, lava/secret zone
    createWater(-72,52,92,18);createWater(-100,70,38,34);
    // bridge visual and fixed flag
    for(let i=-5;i<=5;i++){const part=box(2.1,.35,5,materials.wood,-12+i*2.15,.25,52);world.bridgeParts.push(part);registerPlatform(-12+i*2.15,52,2.1,5,.43,{bridgePart:i+5});}
    createLava(96,-82,34,26);
    // trees forest
    for(let i=0;i<48;i++){const x=-92+(Math.random()-.5)*68,z=-52+(Math.random()-.5)*84;if(Math.abs(x+68)<10&&Math.abs(z-52)<12)continue;createTree(x,z,.75+Math.random()*.55,true);}
    for(let i=0;i<18;i++)createRock(-44+(Math.random()-.5)*60,-95+(Math.random()-.5)*54,.7+Math.random()*.6,true);
    for(let i=0;i<80;i++)createFlower((Math.random()-.5)*190,(Math.random()-.5)*190,Math.random()>.5?0xff74c9:0xffdf55);
    // village houses
    const home=createHouse({id:'home',name:`Casa de ${playerDisplayName()}`,x:0,z:18,color:0xc4843e,roofColor:0xd93a38});addHouseInterior(home,'home');
    const blue=createHouse({id:'blue',name:'Casa Azul',x:-25,z:17,color:0x4f9fd7,roofColor:0x225fa5,price:250});addHouseInterior(blue,'neighbor');
    const pink=createHouse({id:'pink',name:'Casa Rosa',x:25,z:17,color:0xe58aae,roofColor:0xb63871,price:420});addHouseInterior(pink,'neighbor');
    const cabin=createHouse({id:'cabin',name:'Cabana da Floresta',x:-88,z:-42,color:0x7e4a28,roofColor:0x4d2b1c,price:180});addHouseInterior(cabin,'neighbor');
    const shop=createHouse({id:'shop',name:'Mercadinho',x:-22,z:-18,color:0xf1b83e,roofColor:0xc83a2f,publicBuilding:true});addHouseInterior(shop,'shop');
    const workshop=createHouse({id:'workshop',name:'Oficina',x:22,z:-18,color:0x8c96a4,roofColor:0x3d4a5a,publicBuilding:true});addHouseInterior(workshop,'workshop');
    // yards/fences/lamps
    createFenceLine(-36,26,-14,26,9);createFenceLine(14,26,36,26,9);createFenceLine(-10,29,10,29,8);for(const p of [[-9,9],[9,9],[-33,8],[33,8],[-10,-7],[10,-7]])createLamp(p[0],p[1]);
    // NPCs
    createNPC('nino','Nino',4,3,0xffd84d,4);createNPC('luna','Luna',-22,8,0xff72b6,4);createNPC('teo','Teo',22,7,0x54c7ff,4);createNPC('bia','Bia',-10,-10,0x8ee15c,3);createNPC('maya','Maya',65,54,0xa66bff,3);
    // farm and garage
    createFenceLine(38,22,65,22,10);createFenceLine(65,22,65,43,8);for(let x=42;x<62;x+=4)for(let z=27;z<40;z+=4){box(2.8,.12,2.8,0x75451f,x,.06,z);box(.18,.55,.18,0x54c93e,x,.33,z);}
    createToyCar(52,48);registerInteractable({id:'job-board',type:'job',icon:'📦',label:'Central de trabalhos',x:49,z:45,radius:2.3,action:openJobCenter});world.deliveryPoint={x:65,z:54};
    createAthleticsGym();createSizeChallenges();createWaypointMarker();
    // placas de bairro/orientação (somente decorativas, não alteram colisão nem interação)
    createSignpost(12,4,'Vila do Sol',Math.PI/2); createSignpost(-30,-5,'Mercado e Oficina',Math.PI/2);
    createSignpost(-62,-30,'Floresta',Math.PI*.15); createSignpost(48,26,'Fazenda e Garagem',-Math.PI/2);
    createSignpost(70,40,'Castelo',Math.PI*.7); createSignpost(-58,50,'Lago',Math.PI*.4);
    // platform challenge
    const coords=[[48,0,-48],[53,1.2,-55],[59,2.3,-61],[66,3.5,-67],[74,4.6,-72],[82,5.8,-76]];coords.forEach(([x,y,z],i)=>{createPlatform(x,y+.5,z,3.2,3.2,i%2?0x7a4ed0:0x3e9fd8);createCrystal(x,y+1.7,z,i===coords.length-1);});world.secretChest=createChest('secret',86,-78,true);
    // castle and enemies
    box(32,4,26,0x737f8c,88,2,62);box(36,1.2,3,0x9aa5b1,88,4.8,49);for(const x of [73,103])box(5,8,5,0x647180,x,4,62);
    createEnemy('slime',48,-25);createEnemy('slime',58,-32);createEnemy('bat',72,-43);createEnemy('golem',82,48);createEnemy('slime',96,56);
    // crystals spread
    for(const p of [[12,1,-2],[-14,1,-8],[36,1,-15],[-45,1,18],[-63,1,-35],[78,1,15],[95,1,-20]])createCrystal(...p);
    // public interactables
    registerInteractable({id:'bridge-repair',type:'repair',icon:'🛠',label:'Consertar/inspecionar ponte',x:-12,z:47,radius:3.2,action:repairBridge});
    createChest('village',8,-5,false);createChest('forest',-82,-50,false);
    // restored builds
    state.builds.forEach(data=>spawnBuild(data,false));
    updateBridgeVisual();
    // boundaries mountains
    for(let i=0;i<34;i++){const a=i/34*Math.PI*2,r=118+Math.random()*10,x=Math.cos(a)*r,z=Math.sin(a)*r;box(12,12+Math.random()*16,12,0x6d7d8a,x,6,z);}
  }

  function collectResource(id){
    const resource=world.resources.find(r=>r.id===id);if(!resource||resource.collected)return;
    resource.collected=true;resource.mesh.visible=false;state.inventory[resource.type]=(state.inventory[resource.type]||0)+1;state.stats.collected++;trackDaily('collect',1);
    addXP(8);toast(resource.type==='wood'?'Madeira coletada!':'Pedra coletada!','good');beep(620);vibrate(25);evaluateMissions();checkActiveJob();saveState();
  }
  function openChest(chest){
    if(chest.opened){toast('Este baú já foi aberto.','warn');return;}
    chest.opened=true;chest.lid.rotation.x=-.65;state.flags[`chest_${chest.id}`]=true;
    state.inventory.crystals+=chest.secret?3:1;addCoins(chest.secret?100:25);addXP(chest.secret?80:25);
    if(chest.secret)setFlag('secretChest');toast(chest.secret?'Baú secreto! +3 cristais e 100 moedas':'Baú aberto!','good',2200);evaluateMissions();saveState();
  }

  function cloudHouseRecord(houseId){return cloudHouses.get(houseId)||null;}
  function isMyCloudHouse(record){return !!record&&record.ownerUid===window.OTTHOS_RTDB?.uid;}
  function reconcileCloudHouses(){
    const uid=window.OTTHOS_RTDB?.uid;if(!uid)return;
    for(const h of world.houses||[]){if(h.publicBuilding)continue;const cloud=cloudHouseRecord(h.id);if(cloud){state.houses[h.id]={...(state.houses[h.id]||{}),owned:cloud.ownerUid===uid,locked:!!cloud.locked,ownerUid:cloud.ownerUid,ownerName:cloud.ownerName||'Jogador',price:h.price};}}
    saveState();
  }
  async function claimHouseOnline(house){
    if(!window.OTTHOS_RTDB?.connected?.()){toast('Conecte ao Firebase para comprar uma casa exclusiva.','warn',2600);return false;}
    const result=await window.OTTHOS_RTDB.claimHouse(house.id,{name:house.name,price:house.price,ownerName:state.profile.name||'Jogador'});
    if(!result?.ok){toast(result?.ownerName?`Esta casa já pertence a ${result.ownerName}.`:'Não foi possível comprar a casa.','warn',2600);return false;}
    state.houses[house.id]={...(state.houses[house.id]||{}),owned:true,locked:false,ownerUid:window.OTTHOS_RTDB.uid,ownerName:state.profile.name,price:house.price};return true;
  }
  async function handleHouseDoor(house){
    const uid=window.OTTHOS_RTDB?.uid,cloud=cloudHouseRecord(house.id),mine=isMyCloudHouse(cloud),local=state.houses[house.id]||{};
    if(house.publicBuilding){if(await confirmModal(house.name,'Deseja entrar?','Entrar','Cancelar'))enterHouse(house);return;}
    if(cloud&&!mine){
      if(cloud.locked){toast(`Casa trancada por ${cloud.ownerName||'outro jogador'}.`,'warn',2500);return;}
      if(await confirmModal(house.name,`Casa de ${cloud.ownerName||'outro jogador'}. A porta está aberta. Deseja visitar?`,'Visitar','Cancelar'))enterHouse(house);return;
    }
    if(!cloud&&!local.owned){
      openModal(house.name,`<p>Casa disponível no mundo público por <b>${house.price} moedas</b>. Depois da compra, somente você poderá trancar ou destrancar.</p><div class="modal-actions"><button class="btn primary" data-buy-house>Comprar</button><button class="btn" data-race-house>Disputar em corrida</button><button class="btn" data-cancel>Cancelar</button></div>`,root=>{
        $('[data-buy-house]',root).onclick=async()=>{if(state.profile.coins<house.price){toast('Moedas insuficientes.','warn');return;}const ok=await claimHouseOnline(house);if(!ok)return;addCoins(-house.price);setFlag('boughtHouse');awardMedal('Nova Propriedade');saveState(true);closeModal();handleHouseDoor(house);};
        $('[data-race-house]',root).onclick=()=>{closeModal();startRace('sprint',world.npcs[0],house.id);};$('[data-cancel]',root).onclick=closeModal;
      });return;
    }
    const owned=mine||local.owned;if(owned){const locked=cloud?!!cloud.locked:!!local.locked;openModal(house.name,`<p>Esta casa pertence a <b>${state.profile.name}</b>.</p><div class="modal-actions"><button class="btn primary" data-enter>Entrar</button><button class="btn" data-lock>${locked?'Destrancar':'Trancar'}</button><button class="btn" data-cancel>Cancelar</button></div>`,root=>{
      $('[data-enter]',root).onclick=()=>{closeModal();enterHouse(house);};$('[data-lock]',root).onclick=async()=>{const next=!locked,ok=await window.OTTHOS_RTDB?.setHouseLock?.(house.id,next);if(ok){state.houses[house.id]={...(state.houses[house.id]||{}),owned:true,locked:next};saveState(true);closeModal();toast(next?'Casa trancada.':'Casa destrancada.','good');}else toast('Não foi possível alterar a fechadura.','warn');};$('[data-cancel]',root).onclick=closeModal;
    });return;}
    toast('Sincronizando propriedade da casa...','warn');
  }

  function enterHouse(house){
    currentHouse=house;cameraMode='interior';house.roof.visible=false;house.front.visible=false;house.door.visible=false;
    player.x=house.x;player.z=house.z+1.0;player.y=0;player.vx=player.vz=player.vy=0;player.grounded=true;
    state.position={x:player.x,y:0,z:player.z,yaw:cameraYaw};
    if(house.id==='home')setFlag('enteredHome');
    toast(`Entrou: ${house.name}`,'good');updateContext(true);saveState();
  }
  function exitHouse(){
    if(!currentHouse)return;const h=currentHouse;h.roof.visible=true;h.front.visible=true;h.door.visible=true;currentHouse=null;cameraMode='openworld';player.x=h.x;player.z=h.z+5.3;player.y=0;player.vx=player.vz=player.vy=0;toast('Saiu da casa.','good');saveState();
  }

  function openHomeChest(){
    const keys=[['wood','Madeira','🪵'],['stone','Pedra','🪨'],['food','Comida','🍎'],['water','Água','💧'],['crystals','Cristais','💎']];
    const rows=keys.map(([key,name,icon])=>`<div class="storage-row"><span>${icon} ${name}</span><b>Mochila ${state.inventory[key]||0} • Baú ${state.homeStorage[key]||0}</b><div><button data-store="${key}">Guardar 1</button><button data-take="${key}">Retirar 1</button></div></div>`).join('');
    openModal(`Baú da casa de ${playerDisplayName()}`,`<p>Guarde recursos sem abrir o inventário geral.</p><div class="storage-list">${rows}</div>`,root=>{
      $$('[data-store]',root).forEach(btn=>btn.onclick=()=>{const key=btn.dataset.store;if((state.inventory[key]||0)<=0){toast('Você não tem esse item.','warn');return;}state.inventory[key]--;state.homeStorage[key]=(state.homeStorage[key]||0)+1;saveState(true);openHomeChest();});
      $$('[data-take]',root).forEach(btn=>btn.onclick=()=>{const key=btn.dataset.take;if((state.homeStorage[key]||0)<=0){toast('O baú não tem esse item.','warn');return;}state.homeStorage[key]--;state.inventory[key]=(state.inventory[key]||0)+1;saveState(true);openHomeChest();});
    });
  }

  function useActivity(type,house){
    if(type==='bed'){
      player.sitUntil=performance.now()+1400;state.needs.energy=100;state.needs.hunger=Math.max(0,state.needs.hunger-4);setFlag('slept');addXP(20);toast('Você dormiu e salvou o jogo.','good');saveState(true);
    }else if(type==='sofa'){
      player.sitUntil=performance.now()+2400;state.needs.fun=clamp(state.needs.fun+20,0,100);toast('Sentou no sofá.','good');addXP(5);
    }else if(type==='tv'){
      player.sitUntil=performance.now()+3000;state.needs.fun=clamp(state.needs.fun+34,0,100);state.needs.energy=clamp(state.needs.energy-3,0,100);toast(`Assistindo ao desenho de ${playerDisplayName()}!`,'good');addXP(8);
    }else if(type==='fridge'){
      openModal('Geladeira',`<p>Comida disponível: <b>${state.inventory.food}</b></p><div class="modal-actions"><button class="btn primary" data-eat>Comer lanche</button><button class="btn" data-close>Fechar</button></div>`,root=>{
        $('[data-eat]',root).onclick=()=>{if(state.inventory.food<=0){toast('A geladeira está vazia.','warn');return;}state.inventory.food--;state.needs.hunger=clamp(state.needs.hunger+32,0,100);setFlag('ateMeal');addXP(12);saveState();closeModal();toast('Lanche delicioso!','good');};$('[data-close]',root).onclick=closeModal;
      });
    }else if(type==='stove'){
      openModal('Cozinha',`<p>Cozinhar custa 1 comida e recupera muita fome.</p><div class="modal-actions"><button class="btn primary" data-cook>Cozinhar refeição</button><button class="btn" data-close>Cancelar</button></div>`,root=>{
        $('[data-cook]',root).onclick=()=>{if(state.inventory.food<=0){toast('Você precisa comprar ou colher comida.','warn');return;}state.inventory.food--;state.stats.cooked++;trackDaily('cook',1);state.needs.hunger=100;state.needs.fun=clamp(state.needs.fun+8,0,100);setFlag('ateMeal');addXP(20);saveState();closeModal();toast('Refeição pronta!','good');};$('[data-close]',root).onclick=closeModal;
      });
    }else if(type==='sink'){
      if(state.inventory.water>0)state.inventory.water--;state.needs.hunger=clamp(state.needs.hunger+5,0,100);state.needs.hygiene=clamp(state.needs.hygiene+8,0,100);toast('Bebeu água.','good');saveState();
    }else if(type==='shower'){
      state.needs.hygiene=100;state.needs.energy=clamp(state.needs.energy-2,0,100);player.sitUntil=performance.now()+1800;toast('Banho tomado!','good');addXP(8);saveState();
    }else if(type==='chest')openHomeChest();
    else if(type==='shop')openShop();
    else if(type==='workshop')openWorkshop();
    else if(type==='wardrobe')openAvatarStudio();
    updateHUD();
  }
  function openShop(){
    const items=[['Comida',15,'food',2,'🍎'],['Água',8,'water',2,'💧'],['Blocos',25,'blocks',4,'🧱'],['Cercas',20,'fences',3,'🪵']];
    openModal('Mercadinho da Vila',`<p>Moedas: <b>${state.profile.coins}</b></p><div class="choice-grid">${items.map(([name,price,key,amount,icon],i)=>`<button class="choice" data-buy="${i}"><b>${icon} ${name}</b><span>${price} moedas — +${amount}</span></button>`).join('')}</div>`,root=>{
      $$('[data-buy]',root).forEach(btn=>btn.onclick=()=>{const [name,price,key,amount]=items[Number(btn.dataset.buy)];if(state.profile.coins<price){toast('Moedas insuficientes.','warn');return;}addCoins(-price);state.inventory[key]+=amount;addXP(5);saveState();closeModal();toast(`${name} comprado!`,'good');});
    });
  }
  function openWorkshop(){
    openModal('Oficina do Teo',`<p>Melhore seus equipamentos.</p><div class="choice-grid"><button class="choice" data-sword><b>⚔ Espada</b><span>2 madeiras + 2 pedras</span></button><button class="choice" data-blocks><b>🧱 Kit construção</b><span>1 madeira + 1 pedra</span></button></div>`,root=>{
      $('[data-sword]',root).onclick=()=>{if(state.inventory.wood<2||state.inventory.stone<2){toast('Faltam materiais.','warn');return;}state.inventory.wood-=2;state.inventory.stone-=2;state.flags.swordUpgrade=(state.flags.swordUpgrade||0)+1;addXP(35);saveState();closeModal();toast('Espada melhorada!','good');};
      $('[data-blocks]',root).onclick=()=>{if(state.inventory.wood<1||state.inventory.stone<1){toast('Faltam materiais.','warn');return;}state.inventory.wood--;state.inventory.stone--;state.inventory.blocks+=3;state.inventory.fences+=2;saveState();closeModal();toast('Kit de construção pronto!','good');};
    });
  }

  function friendshipTier(value){ return value>=60?'Melhor amigo':value>=30?'Amigo':value>=10?'Conhecido':'Vizinho'; }
  function changeFriendship(npc, amount, message){
    state.friendship[npc.id]=clamp((state.friendship[npc.id]||0)+amount,0,100);npc.friendship=state.friendship[npc.id];
    if(npc.id==='nino')setFlag('talkedNeighbor');
    if(message)toast(message,'good');addXP(Math.max(2,amount*2));addReputation(Math.max(1,Math.floor(amount/2)));evaluateMissions();saveState();
  }
  function talkToNPC(npc){
    if(npc.id==='maya'&&state.flags.deliveryActive&&player.vehicle&&distance2D(player,npc)<3.5){state.flags.deliveryActive=false;state.inventory.package=0;setFlag('deliveryDone');if(state.career.activeJob?.id==='delivery')completeActiveJob();else{addCoins(120);addReputation(30);}toast('Entrega concluída para Maya!','good',2400);}
    const value=state.friendship[npc.id]||0;
    const greetings={nino:'Sou Nino. A vila tem casas, corridas e desafios esperando por você.',luna:'Quero ver sua casa cheia de estilo! Vamos decorar?',teo:'Trabalho e criatividade transformam materiais em conquistas.',bia:'Há cristais e caminhos secretos esperando por você.',maya:'Na garagem sempre existe um trabalho para quem quer crescer.'};
    openModal(npc.name,`<div class="dialogue-box">${greetings[npc.id]||'Olá, vizinho!'}</div><div class="friend-meter"><span>Amizade — ${friendshipTier(value)}</span><b>${value}/100</b><i style="width:${value}%"></i></div><div class="choice-grid social-actions">
      <button class="choice" data-social="talk"><b>💬 Conversar</b><span>Conhecer melhor</span></button>
      <button class="choice" data-social="joke"><b>😄 Contar piada</b><span>Aumenta diversão</span></button>
      <button class="choice" data-social="gift"><b>🎁 Dar presente</b><span>Usa comida ou cristal</span></button>
      <button class="choice" data-social="argue"><b>😠 Discutir</b><span>Diminui amizade</span></button>
      <button class="choice" data-social="race"><b>🏃 Desafiar corrida</b><span>Corrida de velocidade</span></button>
      <button class="choice" data-social="coinrace"><b>🪙 Pega-moedas</b><span>Quem coleta mais?</span></button>
      <button class="choice" data-social="house"><b>🏠 Disputar casa</b><span>Ganhe uma propriedade</span></button>
      <button class="choice" data-social="job"><b>💼 Perguntar trabalho</b><span>Ganhar moedas</span></button>
      <button class="choice" data-social="invite"><b>🏡 Convidar para casa</b><span>Precisa de amizade 10</span></button>
      <button class="choice" data-social="wave"><b>👋 Acenar</b><span>Animação social rápida</span></button>
      <button class="choice" data-social="dance"><b>🕺 Dançar</b><span>Aumenta diversão</span></button>
      <button class="choice" data-social="play"><b>🎈 Brincar</b><span>Diversão e amizade</span></button>
      <button class="choice" data-social="selfie"><b>📸 Tirar selfie</b><span>Guarde uma lembrança</span></button>
      <button class="choice" data-social="follow"><b>👣 Seguir junto</b><span>O vizinho acompanha você</span></button>
    </div>`,root=>{
      $$('[data-social]',root).forEach(btn=>btn.onclick=()=>{
        const action=btn.dataset.social;
        if(action==='talk'){state.stats.talks++;trackDaily('talk',1);changeFriendship(npc,2,`${npc.name} gostou da conversa.`);closeModal();}
        else if(action==='joke'){state.social.jokes++;state.needs.fun=clamp(state.needs.fun+12,0,100);changeFriendship(npc,3,`${npc.name} riu da piada!`);closeModal();}
        else if(action==='gift'){
          if(state.inventory.food>0){state.inventory.food--;state.social.gifts++;changeFriendship(npc,7,'Presente entregue!');closeModal();}
          else if(state.inventory.crystals>0){state.inventory.crystals--;state.social.gifts++;changeFriendship(npc,10,'Cristal presenteado!');closeModal();}
          else toast('Você não tem comida nem cristal para presentear.','warn');
        } else if(action==='argue'){
          state.social.arguments=(state.social.arguments||0)+1;state.friendship[npc.id]=clamp((state.friendship[npc.id]||0)-5,0,100);state.profile.reputation=Math.max(0,state.profile.reputation-1);state.needs.fun=clamp(state.needs.fun+4,0,100);saveState(true);updateHUD();closeModal();toast(`${npc.name} não gostou da discussão.`,'warn');
        } else if(action==='race'){closeModal();startRace('sprint',npc);}
        else if(action==='coinrace'){closeModal();startRace('coins',npc);}
        else if(action==='house'){closeModal();openHouseChallenge(npc);}
        else if(action==='job'){closeModal();openJobCenter(npc.id);}
        else if(action==='invite'){
          if((state.friendship[npc.id]||0)<10){toast('A amizade precisa chegar a 10.','warn');return;}
          if(!state.social.invited.includes(npc.id))state.social.invited.push(npc.id);changeFriendship(npc,2,`${npc.name} aceitou visitar sua casa!`);closeModal();
        }else if(action==='wave'){triggerEmote('wave',npc);changeFriendship(npc,1);closeModal();}
        else if(action==='dance'){triggerEmote('dance',npc);state.needs.fun=clamp(state.needs.fun+10,0,100);changeFriendship(npc,2);closeModal();}
        else if(action==='play'){triggerEmote('play',npc);state.needs.fun=clamp(state.needs.fun+14,0,100);changeFriendship(npc,3,`${npc.name} adorou brincar!`);closeModal();}
        else if(action==='selfie'){triggerEmote('selfie',npc);state.flags.selfies=(state.flags.selfies||0)+1;changeFriendship(npc,2);closeModal();}
        else if(action==='follow'){npc.following=!npc.following;toast(npc.following?`${npc.name} vai acompanhar você.`:`${npc.name} parou de seguir.`,'good');closeModal();}
      });
    });
  }

  function openHouseChallenge(npc){
    const options=world.houses.filter(h=>!h.publicBuilding&&!state.houses[h.id]?.owned);
    if(!options.length){toast('Você já conquistou todas as casas disponíveis.','good');return;}
    openModal('Disputa de propriedade',`<p>Vença ${npc.name} numa corrida para conquistar a casa escolhida.</p><div class="choice-grid">${options.map(h=>`<button class="choice" data-house-race="${h.id}"><b>🏠 ${h.name}</b><span>Prêmio: propriedade destrancada</span></button>`).join('')}</div>`,root=>{
      $$('[data-house-race]',root).forEach(btn=>btn.onclick=()=>{const id=btn.dataset.houseRace;closeModal();startRace('sprint',npc,id);});
    });
  }
  function openRaceCenter(npc=null){
    const name=npc?.name||'um corredor da vila';
    openModal('Ginásio de Atletismo',`<p>Desafie ${name}. Os controles normais continuam funcionando.</p><div class="choice-grid"><button class="choice" data-race="sprint"><b>🏃 Corrida de velocidade</b><span>Chegue primeiro à linha final</span></button><button class="choice" data-race="coins"><b>🪙 Corrida pega-moedas</b><span>Colete 8 moedas antes do rival</span></button></div>`,root=>{
      $$('[data-race]',root).forEach(btn=>btn.onclick=()=>{closeModal();startRace(btn.dataset.race,npc||world.npcs[0]);});
    });
  }
  function createRaceOpponent(npc){
    const group=new THREE.Group();worldGroup.add(group);box(.78,1.12,.55,npc?.color||0xff72b6,0,1.1,0,group);box(.68,.68,.68,0xffd3a0,0,2.0,0,group);box(.08,.08,.04,0x111827,-.15,2.05,.36,group);box(.08,.08,.04,0x111827,.15,2.05,.36,group);return group;
  }
  function clearRaceObjects(){
    if(activeRace?.opponent)worldGroup.remove(activeRace.opponent);
    for(const coin of world.raceCoins)worldGroup.remove(coin.mesh);
    world.raceCoins=[];
  }
  function spawnRaceCoins(){
    world.raceCoins=[];
    for(let i=0;i<12;i++){
      const x=30+i*3.7,z=i%2?73:78;const mesh=cylinder(.35,.12,0xffd84d,x,.7,z,worldGroup,18);mesh.rotation.x=Math.PI/2;world.raceCoins.push({x,z,mesh,got:false});
    }
  }
  function startRace(type,npc,housePrize=null){
    if(activeRace){toast('Termine o desafio atual.','warn');return;}
    if(currentHouse)exitHouse();
    const gym=world.gym;if(!gym){toast('Ginásio ainda não carregou.','warn');return;}
    const opponent=createRaceOpponent(npc||world.npcs[0]);opponent.position.set(gym.startX,0,gym.lane2Z);
    activeRace={type,npcId:npc?.id||'nino',npcName:npc?.name||'Nino',housePrize,startAt:performance.now()+3000,started:false,opponent,opponentX:gym.startX,opponentScore:0,playerScore:0,timeLimit:type==='coins'?45:30,lastOpponentCoin:0};
    player.x=gym.startX;player.z=gym.lane1Z;player.y=0;player.vx=player.vz=player.vy=0;cameraYaw=Math.PI/2;cameraMode='openworld';state.waypoint={id:'gym',name:'Ginásio',x:gym.x,z:gym.z};updateWaypointMarker();
    if(type==='coins')spawnRaceCoins();
    els.raceBadge.hidden=false;els.raceTitle.textContent=type==='coins'?'Pega-moedas':housePrize?'Corrida pela casa':'Corrida de velocidade';els.raceStatus.textContent='3...';
    toast(`Desafio contra ${activeRace.npcName}!`,'good',2200);saveState(true);
  }
  function finishRace(won){
    if(!activeRace)return;const race=activeRace;state.stats.races++;trackDaily('race',1);clearRaceObjects();activeRace=null;els.raceBadge.hidden=true;
    if(won){
      state.races.wins++;if(race.type==='coins')state.races.coinWins++;
      addCoins(race.type==='coins'?90:120);addReputation(18);addXP(70);setFlag(race.type==='coins'?'wonCoinRace':'wonRace');
      if(race.housePrize){const old=state.houses[race.housePrize]||{};state.houses[race.housePrize]={...old,owned:true,locked:false};state.races.houseWins++;setFlag('wonHouseChallenge');setFlag('boughtHouse');awardMedal('Casa Conquistada');}
      toast(race.housePrize?'Você venceu e conquistou a casa!':'Você venceu o desafio!','good',2600);
    }else{state.races.losses++;toast(`${race.npcName} venceu. Tente novamente!`,'warn',2400);}
    player.x=45;player.z=82;player.y=0;player.vx=player.vz=player.vy=0;state.waypoint=null;updateWaypointMarker();saveState(true);evaluateMissions();
  }
  function updateRace(dt){
    if(!activeRace)return;const race=activeRace,gym=world.gym,now=performance.now();
    if(now<race.startAt){els.raceStatus.textContent=`${Math.max(1,Math.ceil((race.startAt-now)/1000))}...`;return;}
    if(!race.started){race.started=true;race.startedAt=now;els.raceStatus.textContent='VALENDO!';beep(880,100);}
    const elapsed=(now-race.startedAt)/1000;race.timeLeft=Math.max(0,race.timeLimit-elapsed);
    if(race.type==='sprint'){
      race.opponentX+=6.15*dt;race.opponent.position.x=race.opponentX;race.opponent.position.z=gym.lane2Z;race.opponent.rotation.y=Math.PI/2;
      els.raceStatus.textContent=`Chegue em ${gym.finishX}m • ${race.timeLeft.toFixed(1)}s`;
      if(player.x>=gym.finishX)finishRace(true);else if(race.opponentX>=gym.finishX||race.timeLeft<=0)finishRace(false);
    }else{
      race.opponent.position.x=lerp(race.opponent.position.x,gym.startX+Math.min(46,elapsed*1.1),dt*2);race.opponent.position.z=gym.lane2Z;
      if(elapsed-race.lastOpponentCoin>3.2){race.lastOpponentCoin=elapsed;race.opponentScore++;}
      for(const coin of world.raceCoins){if(coin.got)continue;coin.mesh.rotation.y+=dt*5;if(Math.hypot(player.x-coin.x,player.z-coin.z)<1.25){coin.got=true;coin.mesh.visible=false;race.playerScore++;beep(920,45);}}
      els.raceStatus.textContent=`Você ${race.playerScore}/8 • ${race.npcName} ${race.opponentScore}/8 • ${Math.ceil(race.timeLeft)}s`;
      if(race.playerScore>=8)finishRace(true);else if(race.opponentScore>=8)finishRace(false);else if(race.timeLeft<=0)finishRace(race.playerScore>race.opponentScore);
    }
  }


  const JOBS = [
    {id:'delivery',title:'Entregador da Vila',icon:'📦',reward:120,rep:30,description:'Pegue o carrinho e entregue o pacote para Maya.'},
    {id:'gather',title:'Ajudante da Oficina',icon:'🪵',reward:90,rep:18,description:'Colete 3 madeiras e 2 pedras.',target:{wood:3,stone:2}},
    {id:'crystals',title:'Explorador de Cristais',icon:'💎',reward:140,rep:24,description:'Colete 3 novos cristais.',target:{crystals:3}},
    {id:'builder',title:'Decorador do Bairro',icon:'🧱',reward:110,rep:20,description:'Construa 2 objetos perto de uma casa.',target:{builds:2}}
  ];
  function activeJobProgress(job){
    if(!job)return{percent:0,label:'0%'};
    const start=job.start||{};
    if(job.id==='delivery')return{percent:state.flags.deliveryDone?100:(player.vehicle?55:25),label:state.flags.deliveryDone?'concluído':player.vehicle?'Leve o pacote até Maya':'Pegue o carrinho'};
    if(job.id==='gather'){const w=Math.max(0,state.inventory.wood-(start.wood||0)),r=Math.max(0,state.inventory.stone-(start.stone||0));return{percent:clamp((w/3+r/2)*50,0,100),label:`${Math.min(w,3)}/3 madeiras • ${Math.min(r,2)}/2 pedras`};}
    if(job.id==='crystals'){const n=Math.max(0,state.inventory.crystals-(start.crystals||0));return{percent:clamp(n/3*100,0,100),label:`${Math.min(n,3)}/3 cristais`};}
    if(job.id==='builder'){const n=Math.max(0,state.builds.length-(start.builds||0));return{percent:clamp(n/2*100,0,100),label:`${Math.min(n,2)}/2 construções`};}
    return{percent:0,label:'Em andamento'};
  }
  function openJobCenter(){
    const active=state.career.activeJob;
    openModal('Central de Trabalhos',`${active?`<div class="roleplay-card active-job"><small>TRABALHO ATIVO</small><h3>${active.title}</h3><p>${active.description}</p></div>`:'<p>Escolha uma atividade para ganhar moedas, reputação e experiência profissional.</p>'}<div class="choice-grid">${JOBS.map(j=>`<button class="choice" data-job="${j.id}" ${active?'disabled':''}><b>${j.icon} ${j.title}</b><span>${j.description}<br><strong>${j.reward} moedas</strong></span></button>`).join('')}</div>`,root=>{
      $$('[data-job]',root).forEach(btn=>btn.onclick=()=>{const job=JOBS.find(j=>j.id===btn.dataset.job);startJob(job);closeModal();});
    });
  }
  function startJob(job){
    if(!job||state.career.activeJob){toast('Conclua o trabalho atual primeiro.','warn');return;}
    const inv=state.inventory;
    state.career.activeJob={...job,start:{wood:inv.wood,stone:inv.stone,crystals:inv.crystals,builds:state.builds.length}};
    if(job.id==='delivery'){state.flags.deliveryActive=true;state.inventory.package=1;}
    toast(`Trabalho iniciado: ${job.title}`,'good',2200);saveState();updateMissionHUD();
  }
  function completeActiveJob(){
    const job=state.career.activeJob;if(!job)return;
    addCoins(job.reward);addReputation(job.rep);state.career.completed++;state.career.xp+=100;state.career.level=Math.floor(state.career.xp/300)+1;state.career.title=state.career.level>=4?'Profissional da Vila':state.career.level>=2?'Ajudante da Vila':'Morador da Vila';state.career.activeJob=null;setFlag('completedJob');evaluateMissions();updateMissionHUD();toast(`Trabalho concluído! +${job.reward} moedas`,'good',2600);saveState();
  }
  function checkActiveJob(){
    const job=state.career.activeJob;if(!job)return;
    const start=job.start||{};
    if(job.id==='gather'&&state.inventory.wood-(start.wood||0)>=3&&state.inventory.stone-(start.stone||0)>=2)completeActiveJob();
    else if(job.id==='crystals'&&state.inventory.crystals-(start.crystals||0)>=3)completeActiveJob();
    else if(job.id==='builder'&&state.builds.length-(start.builds||0)>=2)completeActiveJob();
  }

  function startDeliveryJob(){
    if(state.flags.deliveryActive){toast('Você já está fazendo uma entrega.','warn');return;}state.flags.deliveryActive=true;state.inventory.package=1;toast('Pacote recebido. Leve até Maya!','good',2200);saveState();
  }
  let fxParticles=[];
  const FX_MAX_PARTICLES=40;
  function spawnDust(x,z,color=0xcfc6a8){
    if(fxParticles.length>=FX_MAX_PARTICLES){const oldest=fxParticles.shift();worldGroup.remove(oldest.mesh);oldest.mesh.geometry.dispose();oldest.mesh.material.dispose();}
    const mesh=new THREE.Mesh(new THREE.CircleGeometry(.2+Math.random()*.12,8),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.5,depthWrite:false}));
    mesh.rotation.x=-Math.PI/2; mesh.position.set(x,.06,z); worldGroup.add(mesh);
    fxParticles.push({mesh,life:.55,vx:(Math.random()-.5)*1.1,vz:(Math.random()-.5)*1.1});
  }
  function updateFX(dt){
    for(let i=fxParticles.length-1;i>=0;i--){
      const p=fxParticles[i]; p.life-=dt;
      p.mesh.position.x+=p.vx*dt; p.mesh.position.z+=p.vz*dt;
      p.mesh.scale.setScalar(1+(.55-p.life)*2.2);
      p.mesh.material.opacity=Math.max(0,p.life/.55*.5);
      if(p.life<=0){worldGroup.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();fxParticles.splice(i,1);}
    }
  }
  let engineAudio=null,driftSoundCooldown=0,vehicleImpactCount=0;
  function startEngineSound(){
    if(!state.settings.sound||engineAudio)return;
    try{
      const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
      const ctx=beep.ctx||(beep.ctx=new Ctx());
      const osc=ctx.createOscillator(),gain=ctx.createGain();
      osc.type='sawtooth';osc.frequency.value=65;gain.gain.value=0;
      osc.connect(gain);gain.connect(ctx.destination);osc.start();
      engineAudio={ctx,osc,gain};gain.gain.linearRampToValueAtTime(.018,ctx.currentTime+.18);
    }catch(_){}
  }
  function stopEngineSound(){
    if(!engineAudio)return;
    try{engineAudio.gain.gain.linearRampToValueAtTime(0,engineAudio.ctx.currentTime+.12);engineAudio.osc.stop(engineAudio.ctx.currentTime+.16);}catch(_){}
    engineAudio=null;
  }
  function updateVehicleFX(dt){
    if(!player.vehicle){if(engineAudio)stopEngineSound();return;}
    const car=player.car,wheels=vehicleVisual.userData.wheels,fronts=vehicleVisual.userData.frontWheels;
    const spin=car.speed*dt*3.4;
    wheels.forEach(w=>w.rotation.x-=spin);
    fronts.forEach(h=>h.rotation.y=lerp(h.rotation.y,car.steerVisual*.5,Math.min(1,dt*10)));
    const speedDelta=car.speed-(car._prevSpeed??car.speed);car._prevSpeed=car.speed;
    const targetTiltX=clamp(-speedDelta*.55,-.13,.13);
    vehicleVisual.rotation.x=lerp(vehicleVisual.rotation.x,targetTiltX,Math.min(1,dt*6));
    vehicleVisual.rotation.z=lerp(vehicleVisual.rotation.z,-car.steerVisual*car.drift*.4,Math.min(1,dt*6));
    if(car.drift>.4&&Math.abs(car.speed)>3){
      updateVehicleFX.acc=(updateVehicleFX.acc||0)+dt;
      if(updateVehicleFX.acc>.045){updateVehicleFX.acc=0;spawnDust(player.x-Math.sin(car.heading)*1.05,player.z-Math.cos(car.heading)*1.05);}
      driftSoundCooldown-=dt;if(driftSoundCooldown<=0){driftSoundCooldown=.5;beep(180,55,'sawtooth');}
    }
    if(els.vehicleBadge)els.vehicleBadge.textContent=`🚗 ${Math.round(Math.abs(car.speed)*6)} km/h${sprintRequested()?' • TURBO':''} — AÇÃO para sair`;
    if(!state.settings.sound&&engineAudio)stopEngineSound();
    else if(state.settings.sound&&!engineAudio)startEngineSound();
    else if(state.settings.sound&&engineAudio){
      const freq=68+Math.abs(car.speed)*11.5;
      try{engineAudio.osc.frequency.setTargetAtTime(freq,engineAudio.ctx.currentTime,.05);}catch(_){}
    }
  }

  function updateVehicleControlsUI(){
    els.secondaryActions?.classList.toggle('vehicle-hidden',player.vehicle);
    els.jumpBtn?.classList.toggle('vehicle-disabled',player.vehicle);
    els.specialBtn?.classList.toggle('vehicle-horn',player.vehicle);
    const specialIcon=$('b',els.specialBtn),specialLabel=$('span',els.specialBtn);
    if(specialIcon)specialIcon.textContent=player.vehicle?'📣':'🔥';
    if(specialLabel)specialLabel.textContent=player.vehicle?'Buzina':'Poder';
    if(els.specialBtn)els.specialBtn.setAttribute('aria-label',player.vehicle?'Buzina do carro':`Poder de ${playerDisplayName()}`);
  }
  function vehicleHorn(){
    if(!player.vehicle||paused||!els.modal.hidden)return;
    const t=performance.now();if(t<player.hornUntil)return;player.hornUntil=t+360;
    beep(410,95,'square');setTimeout(()=>{if(player.vehicle)beep(520,70,'square');},105);vibrate(18);
    vehicleVisual.scale.set(1.015,.99,1.015);setTimeout(()=>vehicleVisual?.scale?.set(1,1,1),120);
  }
  function enterVehicle(){
    if(player.vehicle)return;
    player.preVehicleAbilities={scaleMode:player.scaleMode,crouched:player.crouched};
    // Estados de ações domésticas/personagem não podem congelar a física do carro.
    player.sitUntil=0;player.attackUntil=0;player.spinUntil=0;player.jumpBuffer=0;player.vy=0;player.grounded=true;
    clearMovementInputs();
    player.vehicle=true;player.car.heading=player.facing;player.car.speed=0;player.car.steerVisual=0;player.car.drift=0;player.car._prevSpeed=0;
    player.scaleMode='normal';player.crouched=false; // carro nunca herda escala/agachamento do personagem
    syncPlayerRootScale(); // imediato: não espera o próximo frame para corrigir a raiz
    updateAbilityUI();
    if(playerModel)playerModel.visible=false; if(avatarLayer)avatarLayer.visible=false;
    vehicleVisual.visible=true;vehicleVisual.scale.set(1,1,1);vehicleVisual.rotation.set(0,0,0);
    if(world.vehicle)world.vehicle.group.visible=false;els.vehicleBadge.hidden=false;updateVehicleControlsUI();updateRunUI();setFlag('gotVehicle');toast('Carro ligado! Use o manche para dirigir.','good');startEngineSound();saveState();
  }
  function exitVehicle(silent=false){
    if(!player.vehicle)return;
    player.vehicle=false;player.vx=0;player.vz=0;player.car.speed=0;player.car._prevSpeed=0;clearMovementInputs();
    const prior=player.preVehicleAbilities||state.abilities||{scaleMode:'normal',crouched:false};
    player.scaleMode=['mini','normal','giant'].includes(prior.scaleMode)?prior.scaleMode:'normal';player.crouched=!!prior.crouched;player.preVehicleAbilities=null;
    syncPlayerRootScale(); // restaura imediatamente Mini/Normal/Grande e Abaixar do Otthos
    if(playerModel)playerModel.visible=true; if(avatarLayer)avatarLayer.visible=true;
    vehicleVisual.visible=false;vehicleVisual.rotation.set(0,0,0);els.vehicleBadge.hidden=true;updateVehicleControlsUI();updateRunUI();updateAbilityUI();stopEngineSound();
    if(world.vehicle){world.vehicle.group.visible=true;world.vehicle.group.position.set(player.x,groundHeightAt(player.x,player.z),player.z);world.vehicle.group.rotation.y=player.car.heading;}if(!silent)toast('Saiu do carro.','good');
  }

  function repairBridge(){
    if(state.flags.bridgeFixed){toast('A ponte já está consertada.','good');return;}
    if(state.inventory.wood<3||state.inventory.stone<2){toast('Precisa de 3 madeiras e 2 pedras.','warn');return;}
    state.inventory.wood-=3;state.inventory.stone-=2;setFlag('bridgeFixed');addXP(70);addReputation(20);toast('Ponte consertada!','good',2200);saveState();
  }

  function openBuildMenu(){
    openModal('Construção Minecraft Kids',`<p>Você só pode construir perto das casas que possui e na praça de construção.</p><div class="choice-grid"><button class="choice" data-type="block"><b>🧱 Bloco</b><span>Custa 1 bloco</span></button><button class="choice" data-type="fence"><b>🪵 Cerca</b><span>Custa 1 cerca</span></button><button class="choice" data-type="lamp"><b>💡 Poste</b><span>1 madeira + 1 pedra</span></button><button class="choice" data-type="remove"><b>🧹 Remover</b><span>Remove sua construção mais próxima</span></button></div><div class="modal-actions"><button class="btn" data-cancel>Cancelar construção</button></div>`,root=>{
      $$('[data-type]',root).forEach(btn=>btn.onclick=()=>{const type=btn.dataset.type;if(type==='remove'){removeNearestBuild();closeModal();return;}buildMode=type;els.buildTypeLabel.textContent=({block:'Bloco',fence:'Cerca',lamp:'Poste'})[type];els.buildBadge.hidden=false;closeModal();toast('Modo construção ativo. Use AÇÃO.','good');updateContext(true);});
      $('[data-cancel]',root).onclick=()=>{buildMode=null;els.buildBadge.hidden=true;closeModal();};
    });
  }
  function canBuildAt(x,z){
    if(Math.abs(x)<18&&z>27&&z<48)return true;
    return world.houses.some(h=>state.houses[h.id]?.owned&&Math.abs(x-h.x)<10&&Math.abs(z-h.z)<10);
  }
  function placeBuild(){
    const x=Math.round((player.x+Math.sin(player.facing)*2.2)*2)/2,z=Math.round((player.z+Math.cos(player.facing)*2.2)*2)/2;
    if(!canBuildAt(x,z)){toast('Construa no seu quintal ou na praça de construção.','warn');return;}
    const cost=buildMode==='block'?['blocks',1]:buildMode==='fence'?['fences',1]:['wood',1];
    if((state.inventory[cost[0]]||0)<cost[1]||(buildMode==='lamp'&&state.inventory.stone<1)){toast('Faltam materiais.','warn');return;}
    state.inventory[cost[0]]-=cost[1];if(buildMode==='lamp')state.inventory.stone--;
    const data={id:uid(),type:buildMode,x,z};state.builds.push(data);spawnBuild(data,true);addXP(12);evaluateMissions();checkActiveJob();saveState();toast('Construção colocada!','good');
  }
  function spawnBuild(data,persist){
    let mesh;if(data.type==='block'){mesh=box(1.5,1.5,1.5,0xc07d3e,data.x,.75,data.z);registerPlatform(data.x,data.z,1.5,1.5,1.5,{buildId:data.id});registerCollider(data.x,data.z,1.5,1.5,{buildId:data.id});}
    else if(data.type==='fence'){mesh=box(2.0,1.05,.22,materials.wood,data.x,.52,data.z);registerCollider(data.x,data.z,2,.22,{buildId:data.id});}
    else{mesh=new THREE.Group();mesh.position.set(data.x,0,data.z);worldGroup.add(mesh);box(.22,2.4,.22,materials.wood,0,1.2,0,mesh);box(.65,.65,.65,0xffdc6a,0,2.65,0,mesh);addGlow(data.x,2.65,data.z,0xffd56a,4);}
    world.builds.push({data,mesh});
  }
  function removeNearestBuild(){
    const nearest=world.builds.filter(b=>distance2D(player,b.data)<3).sort((a,b)=>distance2D(player,a.data)-distance2D(player,b.data))[0];if(!nearest){toast('Nenhuma construção sua por perto.','warn');return;}
    worldGroup.remove(nearest.mesh);world.builds=world.builds.filter(b=>b!==nearest);state.builds=state.builds.filter(b=>b.id!==nearest.data.id);saveState();toast('Construção removida.','good');
  }
  els.buildBtn.onclick=openBuildMenu;

  function initThree(){
    if(!window.THREE){openModal('Erro ao carregar 3D','<p>A biblioteca Three.js não carregou. Verifique a internet e recarregue a página.</p>');return false;}
    scene=new THREE.Scene();clock=new THREE.Clock();camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.05,1200);
    renderer=new THREE.WebGLRenderer({antialias:qualityTier()==='high'&&!perf.mobile,alpha:false,powerPreference:'high-performance',precision:'highp',depth:true,stencil:false});renderer.setPixelRatio(Math.min(devicePixelRatio||1,targetDpr()));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=qualityTier()!=='low'&&!perf.mobile;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.94;els.stage.innerHTML='';els.stage.appendChild(renderer.domElement);renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;toast('A placa gráfica reiniciou. Toque no menu para recarregar o jogo.','bad',5000);});renderer.domElement.addEventListener('webglcontextrestored',()=>{toast('Render restaurado.','good',1800);paused=false;});
    initMaterials();
    scene.add(new THREE.HemisphereLight(0xdff4ff,0x28401f,.72));sunLight=new THREE.DirectionalLight(0xffdf9a,1.28);sunLight.position.set(32,46,24);sunLight.castShadow=qualityTier()!=='low'&&!perf.mobile;sunLight.shadow.mapSize.set(qualityTier()==='high'?1024:768,qualityTier()==='high'?1024:768);sunLight.shadow.camera.left=-80;sunLight.shadow.camera.right=80;sunLight.shadow.camera.top=80;sunLight.shadow.camera.bottom=-80;sunLight.shadow.camera.far=160;sunLight.shadow.bias=-.0015;scene.add(sunLight);
    const fill=new THREE.DirectionalLight(0xb9ddff,.16);fill.position.set(-28,20,-18);scene.add(fill); // preenchimento barato (sem sombra) para suavizar o lado escuro dos objetos
    createPlayerModel();playerModel.position.y=playerModel.userData.baseY;applyAvatarCustomization();buildWorld();reconcileCloudHouses();lockStableSceneVisibility();freezeWorldFrustumCulling();restorePosition();initLocalMultiplayer();for(const [remoteUid,data] of remotePresence)remotePlayerEvent({uid:remoteUid,...data});applyQuality();applyAdaptiveRenderSettings(true);resize(true);return true;
  }
  function applyQuality(){ if(!renderer)return;applyAdaptiveRenderSettings(); }
  function resize(force=false){
    if(!renderer||!camera)return;const vv=window.visualViewport,rect=els.stage.getBoundingClientRect();const w=Math.max(280,Math.round(rect.width||vv?.width||innerWidth)),h=Math.max(220,Math.round(rect.height||vv?.height||innerHeight));
    const sizeChanged=Math.abs(w-perf.lastRenderW)>2||Math.abs(h-perf.lastRenderH)>2;const chromeJitter=running&&Math.abs(w-perf.lastRenderW)<=2&&Math.abs(h-perf.lastRenderH)<58;
    if(sizeChanged&&!chromeJitter){camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);perf.lastRenderW=w;perf.lastRenderH=h;}
    const landscape=w>h,portrait=!landscape,short=landscape&&h<560,narrow=portrait&&w<390,tiny=h<620||w<350;
    const orientationChanged=resize._landscape!==undefined&&resize._landscape!==landscape;resize._landscape=landscape;
    if(orientationChanged){state.ui.quickOpen=false;state.ui.skillsOpen=false;state.ui.needsOpen=false;state.ui.missionOpen=false;els.game?.classList.remove('needs-expanded');els.missionCard?.classList.remove('expanded');}
    const action=landscape?clamp(h*(short?.105:.112),42,58):clamp(w*(narrow?.145:.155),50,64);
    const joy=landscape?clamp(h*(short?.205:.22),82,108):clamp(w*(narrow?.265:.28),96,124);
    const skillGap=landscape?clamp(h*.009,4,6):clamp(w*.012,4,6);
    const maxSkillPortrait=(w-36-skillGap*4)/5;const skill=landscape?clamp(h*.086,34,46):clamp(maxSkillPortrait,36,46);
    const uiScale=clamp(Math.min(w/390,h/720),.78,1.04);
    const root=document.documentElement;root.style.setProperty('--action',`${Math.round(action)}px`);root.style.setProperty('--joy',`${Math.round(joy)}px`);root.style.setProperty('--gap',`${landscape?6:8}px`);root.style.setProperty('--skill',`${Math.round(skill)}px`);root.style.setProperty('--skill-gap',`${Math.round(skillGap)}px`);root.style.setProperty('--ui-scale',uiScale.toFixed(3));root.style.setProperty('--vvh',`${h}px`);root.style.setProperty('--vvw',`${w}px`);
    document.body.classList.toggle('ui-landscape',landscape);document.body.classList.toggle('ui-portrait',portrait);document.body.classList.toggle('ui-short',short);document.body.classList.toggle('ui-narrow',narrow);document.body.classList.toggle('ui-tiny',tiny);document.body.classList.toggle('ui-compact',short||narrow||w<700);syncMobilePanels();
  }
  function scheduleStableResize(delay=160,force=false){clearTimeout(perf.resizeTimer);perf.resizeTimer=setTimeout(()=>resize(force),delay);}
  window.addEventListener('resize',()=>scheduleStableResize(160),{passive:true});window.addEventListener('orientationchange',()=>scheduleStableResize(260,true),{passive:true});if(window.visualViewport)window.visualViewport.addEventListener('resize',()=>scheduleStableResize(190),{passive:true});screen.orientation?.addEventListener?.('change',()=>scheduleStableResize(260,true));if(window.ResizeObserver)new ResizeObserver(()=>scheduleStableResize(120)).observe(els.stage);

  function restorePosition(){
    const pos=state.position||{x:0,y:0,z:8,yaw:0};player.x=Number.isFinite(pos.x)?pos.x:0;player.z=Number.isFinite(pos.z)?pos.z:8;player.y=0;cameraYaw=Number.isFinite(pos.yaw)?pos.yaw:0;
    if(Math.abs(player.x)>110||Math.abs(player.z)>110){player.x=0;player.z=8;}
  }
  function returnHome(){
    if(currentHouse)exitHouse();player.x=0;player.z=23;player.y=0;player.vx=player.vz=player.vy=0;cameraYaw=Math.PI;toast('Você voltou para casa.','good');savePlayerPosition(true);
  }
  function savePlayerPosition(immediate=false){state.position={x:+player.x.toFixed(2),y:+player.y.toFixed(2),z:+player.z.toFixed(2),yaw:+cameraYaw.toFixed(3)};saveState(immediate);}
  const autoSaveInterval=setInterval(()=>{if(running){savePlayerPosition(true);}},8000);
  window.addEventListener('pagehide',()=>{if(running)savePlayerPosition(true);else commitState();});
  window.addEventListener('beforeunload',()=>{if(running)savePlayerPosition(true);else commitState();});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){if(running)savePlayerPosition(true);else commitState();}});

  function groundHeightAt(x,z){
    let top=0;for(const p of world.platforms){if(p.bridgePart!==undefined&&!state.flags.bridgeFixed&&p.bridgePart%2===1)continue;if(Math.abs(x-p.x)<=p.w/2+.35&&Math.abs(z-p.z)<=p.d/2+.35&&p.top>top&&player.y>=p.top-.75)top=p.top;}return top;
  }
  function vehicleHitsCollider(x,z){
    const h=player.car.heading,fx=Math.sin(h),fz=Math.cos(h),rx=Math.cos(h),rz=-Math.sin(h);
    const probes=[
      [0,0,.38],[fx*1.12,fz*1.12,.34],[-fx*1.08,-fz*1.08,.34],
      [fx*.88+rx*.72,fz*.88+rz*.72,.30],[fx*.88-rx*.72,fz*.88-rz*.72,.30],
      [-fx*.84+rx*.72,-fz*.84+rz*.72,.30],[-fx*.84-rx*.72,-fz*.84-rz*.72,.30]
    ];
    return world.colliders.some(c=>{
      if(c.houseId&&currentHouse&&c.houseId===currentHouse.id)return false;
      return probes.some(([ox,oz,pad])=>Math.abs(x+ox-c.x)<=c.w/2+pad&&Math.abs(z+oz-c.z)<=c.d/2+pad);
    });
  }
  function registerVehicleImpact(){
    vehicleImpactCount++;player.car.speed*=.08;player.vx*=.1;player.vz*=.1;
    const t=performance.now();if(!registerVehicleImpact._cool||t>registerVehicleImpact._cool){registerVehicleImpact._cool=t+240;vibrate([18,35,18]);beep(135,65,'square');toast('Cuidado com a batida!','warn',900);}
  }
  function resolveCollisions(prevX,prevZ){
    if(player.vehicle){
      if(vehicleHitsCollider(player.x,player.z)){player.x=prevX;player.z=prevZ;registerVehicleImpact();}
      return;
    }
    const radius=.43*playerScaleValue()*(player.crouched?.82:1);
    for(const c of world.colliders){
      if(c.houseId&&currentHouse&&c.houseId===currentHouse.id)continue;
      if(Math.abs(player.x-c.x)>c.w/2+radius||Math.abs(player.z-c.z)>c.d/2+radius)continue;
      const fromLeft=prevX<=c.x-c.w/2-radius,fromRight=prevX>=c.x+c.w/2+radius,fromTop=prevZ<=c.z-c.d/2-radius,fromBottom=prevZ>=c.z+c.d/2+radius;
      if(fromLeft)player.x=c.x-c.w/2-radius;else if(fromRight)player.x=c.x+c.w/2+radius;else if(fromTop)player.z=c.z-c.d/2-radius;else if(fromBottom)player.z=c.z+c.d/2+radius;else{player.x=prevX;player.z=prevZ;}
    }
    if(currentHouse){player.x=clamp(player.x,currentHouse.x-4.0,currentHouse.x+4.0);player.z=clamp(player.z,currentHouse.z-3.02,currentHouse.z+3.02);}
  }
  function resolveMovementInput(){
    const left=input.keys.has('ArrowLeft')||input.keys.has('KeyA');
    const right=input.keys.has('ArrowRight')||input.keys.has('KeyD');
    const up=input.keys.has('ArrowUp')||input.keys.has('KeyW');
    const down=input.keys.has('ArrowDown')||input.keys.has('KeyS');
    const keyboardX=(right?1:0)-(left?1:0);
    const keyboardZ=(up?1:0)-(down?1:0);
    let sourceX=0,sourceZ=0;
    if(input.virtualActive){sourceX=input.virtualX;sourceZ=input.virtualZ;}
    else if(Math.abs(keyboardX)+Math.abs(keyboardZ)>0){sourceX=keyboardX;sourceZ=keyboardZ;}
    else if(input.joyId!==null||Math.abs(input.joyX)+Math.abs(input.joyZ)>.02){sourceX=input.joyX;sourceZ=input.joyZ;}
    else if(input.gamepadActive){sourceX=input.gamepadX;sourceZ=input.gamepadZ;}
    input.targetX=clamp(sourceX,-1,1);input.targetZ=clamp(sourceZ,-1,1);
    return {x:input.targetX,z:input.targetZ};
  }
  function sprintRequested(){return !!(input.touchSprint||input.gamepadSprint||input.keys.has('ShiftLeft')||input.keys.has('ShiftRight'));}
  function updateRunUI(){
    if(!els.runBtn)return;const active=sprintRequested();els.runBtn.classList.toggle('active',active);
    const icon=$('b',els.runBtn),label=$('span',els.runBtn);if(icon)icon.textContent=player.vehicle?'⚡':'🏃';if(label)label.textContent=player.vehicle?'Turbo':'Correr';
  }
  function clearMovementInputs(){
    input.keys.clear();input.joyId=null;input.joyX=0;input.joyZ=0;
    input.gamepadX=0;input.gamepadZ=0;input.gamepadActive=false;
    input.virtualX=0;input.virtualZ=0;input.virtualActive=false;
    input.touchSprint=false;input.gamepadSprint=false;input.isSprinting=false;
    input.x=0;input.z=0;input.targetX=0;input.targetZ=0;updateRunUI();
    if(els.joystickKnob)els.joystickKnob.style.transform='translate(-50%,-50%)';
  }
  function canJump(){return !player.vehicle&&(player.grounded||performance.now()-player.lastGrounded<125);}
  function requestJump(){if(!els.modal.hidden||paused||player.vehicle)return;player.jumpBuffer=performance.now()+150;if(canJump())doJump();}
  function doJump(){if(!canJump())return;state.stats.jumps++;trackDaily('jump',1);player.vy=10.2;player.grounded=false;player.jumpBuffer=0;beep(540);vibrate(18);}
  function updatePlayer(dt){
    // Entrada é atualizada em todos os estados. O veículo tem prioridade absoluta:
    // uma animação anterior de sofá/cama/TV nunca pode bloquear aceleração ou direção.
    resolveMovementInput();
    input.x=lerp(input.x,input.targetX,Math.min(1,dt*34));
    input.z=lerp(input.z,input.targetZ,Math.min(1,dt*34));
    const mag=Math.hypot(input.x,input.z);let ix=input.x,iz=input.z;if(mag>1){ix/=mag;iz/=mag;}

    if(player.vehicle){
      updateVehiclePhysics(dt,ix,iz);
    }else if(performance.now()<player.sitUntil){
      player.vx*=.82;player.vz*=.82;
    }else{
      const forwardX=Math.sin(cameraYaw),forwardZ=-Math.cos(cameraYaw),rightX=Math.cos(cameraYaw),rightZ=Math.sin(cameraYaw);
      const wantsSprint=sprintRequested()&&mag>.14&&!player.crouched&&state.needs.energy>4;input.isSprinting=wantsSprint;
      const needsPenalty=state.needs.energy<15?.72:state.needs.hunger<15?.82:1;const sizeSpeed=player.scaleMode==='mini'?1.12:player.scaleMode==='giant'?.84:1;
      const speed=(wantsSprint?11.4:7.35)*needsPenalty*sizeSpeed*(player.crouched?.54:1);
      const targetVx=(rightX*ix+forwardX*iz)*speed,targetVz=(rightZ*ix+forwardZ*iz)*speed;const accel=player.grounded?(wantsSprint?34:29):10;
      player.vx=lerp(player.vx,targetVx,Math.min(1,dt*accel));player.vz=lerp(player.vz,targetVz,Math.min(1,dt*accel));if(mag<.03){player.vx*=Math.pow(.0008,dt);player.vz*=Math.pow(.0008,dt);}
    }
    const prevX=player.x,prevZ=player.z;player.x+=player.vx*dt;player.z+=player.vz*dt;player.x=clamp(player.x,-116,116);player.z=clamp(player.z,-116,116);resolveCollisions(prevX,prevZ);
    const movedNow=Math.hypot(player.x-prevX,player.z-prevZ);if(movedNow>.001){if(player.vehicle){state.stats.driven+=movedNow;trackDaily('drive',movedNow);}else{state.stats.walked+=movedNow;trackDaily('walk',movedNow);}}
    const ground=groundHeightAt(player.x,player.z);if(!player.grounded)player.vy-=31*dt;player.y+=player.vy*dt;
    if(player.y<=ground&&player.vy<=0){const landed=!player.grounded&&player.vy<-4;player.y=ground;player.vy=0;player.grounded=true;player.lastGrounded=performance.now();if(landed){vibrate(20);beep(180,35,'sine');}}
    else if(player.y>ground+.03)player.grounded=false;
    if(player.jumpBuffer&&player.jumpBuffer>performance.now()&&canJump())doJump();
    if(!player.vehicle&&Math.hypot(player.vx,player.vz)>.15)player.facing=Math.atan2(player.vx,player.vz);
    playerGroup.position.set(player.x,player.y,player.z);playerGroup.rotation.y=performance.now()<player.spinUntil?player.facing+(1-(player.spinUntil-performance.now())/720)*Math.PI*4:player.facing;syncPlayerRootScale();contactShadow.position.set(player.x,ground+.025,player.z);const air=Math.max(0,player.y-ground);const ss=clamp(1-air*.08,.48,1);contactShadow.scale.setScalar(ss);contactShadow.material.opacity=clamp(.27-air*.035,.06,.27);vehicleVisual.visible=player.vehicle;
    animatePlayer(dt);checkHazards();collectNearbyCrystals();updateContext();
  }
  function updateVehiclePhysics(dt,ix,iz){
    const car=player.car;
    const turbo=sprintRequested();const maxSpeed=turbo?29:23.5,maxReverse=-8.5;
    const accelFactor=car.speed>=0?Math.max(.22,1-car.speed/maxSpeed):1;
    const braking=(car.speed>0.2&&iz<0)?2.7:1;
    const throttleAccel=iz>=0?iz*(turbo?23:16.5)*accelFactor:iz*10.5*braking;
    car.speed+=throttleAccel*dt;
    if(Math.abs(iz)<.05)car.speed*=Math.pow(.05,dt);
    car.speed=clamp(car.speed,maxReverse,maxSpeed);
    const speedRatio=clamp(Math.abs(car.speed)/7,0,1);
    const highSpeedDamp=1/(1+Math.abs(car.speed)/20);
    const lowSpeedAssist=.72+speedRatio*.48;const turnRate=3.05*lowSpeedAssist*highSpeedDamp*(car.speed<0?-1:1);
    car.heading+=ix*turnRate*dt;
    const fx=Math.sin(car.heading),fz=Math.cos(car.heading);
    const desiredVx=fx*car.speed,desiredVz=fz*car.speed;
    const turnHarshness=Math.abs(ix)*speedRatio;
    const grip=clamp(1-turnHarshness*.6,.32,1);
    player.vx=lerp(player.vx,desiredVx,Math.min(1,dt*13.5*grip));
    player.vz=lerp(player.vz,desiredVz,Math.min(1,dt*13.5*grip));
    car.drift=clamp((1-grip)*clamp(Math.abs(car.speed)/8,0,1),0,1);
    car.steerVisual=lerp(car.steerVisual,ix,Math.min(1,dt*10));
    player.facing=car.heading;
  }
  let animTime=0;
  function animatePlayer(dt){
    if (!playerModel) return;
    animTime+=dt; playerMixer?.update(dt);
    const parts=playerModel.userData.parts;const speed=Math.hypot(player.vx,player.vz);const walking=speed>.25&&player.grounded&&!player.vehicle;const swing=walking?Math.sin(animTime*(8+speed*.45))*.62:0;
    if(parts){
      parts.leftArm.rotation.x=lerp(parts.leftArm.rotation.x,player.grounded?swing:-.65,.22);parts.rightArm.rotation.x=lerp(parts.rightArm.rotation.x,player.grounded?-swing:-.65,.22);parts.leftLeg.rotation.x=lerp(parts.leftLeg.rotation.x,player.grounded?-swing*.8:.38,.22);parts.rightLeg.rotation.x=lerp(parts.rightLeg.rotation.x,player.grounded?swing*.8:.38,.22);
      if(performance.now()<player.emoteUntil){if(player.emoteType==='wave'){parts.rightArm.rotation.x=-2.25;parts.rightArm.rotation.z=Math.sin(animTime*10)*.55;}else if(player.emoteType==='dance'){parts.leftArm.rotation.z=1.1;parts.rightArm.rotation.z=-1.1;playerModel.rotation.y=Math.sin(animTime*4)*.35;}else if(player.emoteType==='selfie'){parts.leftArm.rotation.x=-1.7;parts.rightArm.rotation.x=-.9;playerModel.rotation.z=.08;}else if(player.emoteType==='highfive'){parts.rightArm.rotation.x=-2.6;}else if(player.emoteType==='play'){parts.leftArm.rotation.x=-1.9;parts.rightArm.rotation.x=-1.9;parts.leftArm.rotation.z=.55;parts.rightArm.rotation.z=-.55;playerModel.position.y+=(Math.sin(animTime*10)+1)*.09;playerModel.rotation.y+=Math.sin(animTime*5)*.08;}else if(player.emoteType==='hug'){parts.leftArm.rotation.x=-1.45;parts.rightArm.rotation.x=-1.45;parts.leftArm.rotation.z=-.48;parts.rightArm.rotation.z=.48;}}else{parts.leftArm.rotation.z=lerp(parts.leftArm.rotation.z,0,.2);parts.rightArm.rotation.z=lerp(parts.rightArm.rotation.z,0,.2);playerModel.rotation.y=lerp(playerModel.rotation.y,0,.18);}
      const breathe=Math.sin(animTime*2.2)*.02;parts.body.scale.y=(player.crouched?.78:1)+breathe;
      const visualBase=playerModel.userData.baseY??.24;
      const walkBob=walking?Math.abs(Math.sin(animTime*10))*.035:0;
      playerModel.position.y=visualBase+walkBob;
      if(performance.now()<player.sitUntil){parts.leftLeg.rotation.x=1.25;parts.rightLeg.rotation.x=1.25;playerModel.position.y=Math.max(.12,visualBase-.10);}
      // Defesa de regressão: nenhuma animação pode empurrar a sola para baixo do chão.
      playerModel.position.y=Math.max((-(playerModel.userData.minFootY??-.23))+.005,playerModel.position.y);
    } else {
      const base=playerModel.userData.baseY||0;
      const bob=walking?Math.abs(Math.sin(animTime*(8+speed*.4)))*.045:Math.sin(animTime*2.1)*.012;
      const jumpTilt=player.grounded?0:clamp(-player.vy*.012,-.12,.10);
      playerModel.position.y=base+bob+(performance.now()<player.sitUntil?-.22:0);
      playerModel.rotation.x=lerp(playerModel.rotation.x,jumpTilt,.18);
      playerModel.rotation.z=lerp(playerModel.rotation.z,walking?Math.sin(animTime*8)*.025:0,.18);
    }
    if(avatarLayer){avatarLayer.position.y=playerModel.position.y;avatarLayer.rotation.x=playerModel.rotation.x;avatarLayer.rotation.z=playerModel.rotation.z;}
  }
  function checkHazards(){
    for(const h of world.hazards){if(Math.abs(player.x-h.x)<=h.w/2&&Math.abs(player.z-h.z)<=h.d/2&&player.y<.6){if(h.type==='water'){player.vx*=.9;player.vz*=.9;}else if(performance.now()>player.damageUntil){player.damageUntil=performance.now()+1200;state.needs.energy=clamp(state.needs.energy-18,0,100);toast('Cuidado com a lava!','bad');returnHome();}}}
  }
  function collectNearbyCrystals(){
    for(const c of world.crystals){if(c.got)continue;c.mesh.rotation.y+=.035;c.mesh.position.y=c.y+Math.sin(animTime*2+c.x)*.12;if(Math.hypot(player.x-c.x,player.z-c.z)<1.25&&Math.abs(player.y-c.mesh.position.y)<2){c.got=true;c.mesh.visible=false;state.inventory.crystals++;state.stats.collected++;trackDaily('collect',1);addXP(15);addCoins(5);toast('Cristal coletado!','good');beep(880);vibrate(20);evaluateMissions();checkActiveJob();saveState();}}
  }

  function npcSpeech(npc,text,type='good'){if(distance2D(player,npc.group.position)<12)toast(`${npc.name}: ${text}`,type,2400);npc.emoteType=type==='warn'?'wave':'dance';npc.emoteUntil=performance.now()+1600;}
  function updateNpcSociety(dt){
    updateNpcSociety.acc=(updateNpcSociety.acc||0)+dt;if(updateNpcSociety.acc<9)return;updateNpcSociety.acc=0;if(!world.npcs.length)return;
    const npc=world.npcs[Math.floor(Math.random()*world.npcs.length)],roll=Math.random();
    if(roll<.22){const gift=Math.random()<.5?'food':'coins';if(gift==='food'){state.inventory.food=(state.inventory.food||0)+1;npcSpeech(npc,'Trouxe uma comida para você!');}else{state.profile.coins+=8;npcSpeech(npc,'Ganhei algumas moedas e dividi com você!');}saveState();updateHUD();}
    else if(roll<.44){npcSpeech(npc,'Quer apostar uma corrida comigo?');npc.userDataChallengeUntil=performance.now()+12000;}
    else if(roll<.66){const other=world.npcs.find(n=>n!==npc);if(other){state.npcSociety.friendships[`${npc.id}-${other.id}`]=(state.npcSociety.friendships[`${npc.id}-${other.id}`]||0)+1;npcSpeech(npc,`Conversei com ${other.name} na praça.`);}}
    else if(roll<.82){npcSpeech(npc,'Hoje eu estou meio bravo. Melhor não discutir comigo!','warn');state.npcSociety.moods[npc.id]='bravo';}
    else{const available=world.houses.find(h=>!h.publicBuilding&&!cloudHouseRecord(h.id)&&!state.npcSociety.houses[h.id]);if(available){state.npcSociety.houses[available.id]=npc.id;npcSpeech(npc,`Estou juntando moedas para morar na ${available.name}.`);saveState();}}
  }

  function updateNPCs(dt){
    for(const npc of world.npcs){
      const near=distance2D(player,npc.group.position)<3.2;
      const oldX=npc.group.position.x,oldZ=npc.group.position.z;
      if(npc.following){
        const backX=player.x-Math.sin(player.facing)*2.2,backZ=player.z-Math.cos(player.facing)*2.2;
        npc.group.position.x=lerp(npc.group.position.x,backX,Math.min(1,dt*2.4));npc.group.position.z=lerp(npc.group.position.z,backZ,Math.min(1,dt*2.4));npc.group.rotation.y=lerpAngle(npc.group.rotation.y,player.facing,Math.min(1,dt*5));
      }else if(near){
        const look=Math.atan2(player.x-npc.group.position.x,player.z-npc.group.position.z);
        npc.group.rotation.y=lerpAngle(npc.group.rotation.y,look,Math.min(1,dt*5.5));
      }else{
        npc.phase+=dt*.45;
        const tx=npc.baseX+Math.sin(npc.phase)*npc.pathRadius,tz=npc.baseZ+Math.cos(npc.phase*.83)*npc.pathRadius;
        npc.group.position.x=lerp(npc.group.position.x,tx,dt*.45);npc.group.position.z=lerp(npc.group.position.z,tz,dt*.45);
        npc.group.rotation.y=lerpAngle(npc.group.rotation.y,Math.atan2(tx-npc.group.position.x,tz-npc.group.position.z),Math.min(1,dt*5));
      }
      const moved=Math.hypot(npc.group.position.x-oldX,npc.group.position.z-oldZ);
      const walk=moved>.001?Math.sin(animTime*8+npc.phase)*.52:0;
      const gesture=near?Math.sin(animTime*2.4+npc.phase)*.12:0,emote=performance.now()<npc.emoteUntil?npc.emoteType:'';
      if(npc.limbs){
        npc.limbs.leftArm.rotation.x=lerp(npc.limbs.leftArm.rotation.x,emote==='dance'?-1.4:walk+gesture,.18);
        npc.limbs.rightArm.rotation.x=lerp(npc.limbs.rightArm.rotation.x,emote==='wave'?-2.2:emote==='dance'?-1.4:-walk-gesture,.18);
        npc.limbs.leftLeg.rotation.x=lerp(npc.limbs.leftLeg.rotation.x,-walk*.78,.18);
        npc.limbs.rightLeg.rotation.x=lerp(npc.limbs.rightLeg.rotation.x,walk*.78,.18);
      }
      npc.body.position.y=1.1+(moved>.001?Math.abs(Math.sin(animTime*8+npc.phase))*.035:Math.sin(animTime*2+npc.phase)*.012);
    }
  }
  function updateEnemies(dt){
    for(const e of world.enemies){
      if(e.dead){if(performance.now()-e.lastHit>18000){e.dead=false;e.hp=e.type==='golem'?3:1;e.group.visible=true;e.group.position.set(e.baseX,0,e.baseZ);}continue;}
      const d=distance2D(player,e);let tx=e.baseX+Math.sin(animTime*.55+e.phase)*4,tz=e.baseZ+Math.cos(animTime*.48+e.phase)*4;
      if(d<9&&!currentHouse){tx=player.x;tz=player.z;}
      const speed=e.type==='bat'?2.1:e.type==='golem'?1.0:1.45;e.group.position.x=lerp(e.group.position.x,tx,dt*speed);e.group.position.z=lerp(e.group.position.z,tz,dt*speed);e.group.position.y=e.type==='bat'?1.2+Math.sin(animTime*3+e.phase)*.35:0;e.group.rotation.y=Math.atan2(tx-e.group.position.x,tz-e.group.position.z);
      if(d<1.45&&performance.now()>player.damageUntil){player.damageUntil=performance.now()+1100;state.needs.energy=clamp(state.needs.energy-12,0,100);state.needs.fun=clamp(state.needs.fun-4,0,100);toast('Monstro acertou!','bad');vibrate([35,40,35]);saveState();}
    }
  }
  function meleeAttack(){
    const target=world.enemies.filter(e=>!e.dead).sort((a,b)=>distance2D(player,a.group.position)-distance2D(player,b.group.position))[0];
    if(!target||distance2D(player,target.group.position)>2.35){toast('Nada para atacar por perto.','warn');return;}
    damageEnemy(target,1);player.attackUntil=performance.now()+280;beep(360,60,'sawtooth');
  }
  function damageEnemy(enemy,amount){
    if(enemy.dead)return;enemy.hp-=amount;enemy.lastHit=performance.now();enemy.group.scale.set(1.18,.82,1.18);setTimeout(()=>enemy.group&&enemy.group.scale.set(1,1,1),130);
    if(enemy.hp<=0){enemy.dead=true;enemy.group.visible=false;state.defeated++;addXP(enemy.type==='golem'?45:20);addCoins(enemy.type==='golem'?35:12);toast('Monstro derrotado!','good');evaluateMissions();saveState();}
  }
  function firePower(){
    if(!els.modal.hidden||paused)return;
    if(player.vehicle){vehicleHorn();return;}
    if(currentHouse){toast('Use o poder do lado de fora.','warn');return;}
    const dir={x:Math.sin(player.facing),z:Math.cos(player.facing)};const mesh=new THREE.Mesh(new THREE.BoxGeometry(.42,.42,.42),mat(0xff5a12,{emissive:0xff2a00,emissiveIntensity:.9}));mesh.position.set(player.x,player.y+1.35,player.z);worldGroup.add(mesh);world.fireballs.push({mesh,x:player.x,y:player.y+1.35,z:player.z,vx:dir.x*12,vz:dir.z*12,life:1.4});beep(220,90,'sawtooth');vibrate(18);
  }
  function updateFireballs(dt){
    for(let i=world.fireballs.length-1;i>=0;i--){const f=world.fireballs[i];f.life-=dt;f.x+=f.vx*dt;f.z+=f.vz*dt;f.mesh.position.set(f.x,f.y,f.z);f.mesh.rotation.x+=dt*7;f.mesh.rotation.y+=dt*9;let hit=false;for(const e of world.enemies){if(!e.dead&&Math.hypot(f.x-e.group.position.x,f.z-e.group.position.z)<1.1){damageEnemy(e,1);hit=true;break;}}if(hit||f.life<=0){worldGroup.remove(f.mesh);world.fireballs.splice(i,1);}}
  }

  function updateCamera(dt){
    let desiredPos,look;
    if(currentHouse&&cameraMode==='interior'){
      const h=currentHouse;const portrait=innerHeight>innerWidth;const orbit=clamp(cameraYaw,-1.18,1.18);const dist=clamp((portrait?8.2:7.2)+cameraZoom,5.2,12.5);const height=clamp((portrait?5.6:4.6)+cameraPitch*2.4+cameraZoom*.18,3.8,8.8);
      desiredPos=new THREE.Vector3(player.x+Math.sin(orbit)*dist,player.y+height,player.z+Math.cos(orbit)*dist);look=new THREE.Vector3(player.x,player.y+1.15,player.z);camera.fov=portrait?54:50;
    }else{
      const portrait=innerHeight>innerWidth;const speed=Math.hypot(player.vx,player.vz);
      if(player.vehicle&&!input.cameraDrag)cameraYaw=lerpAngle(cameraYaw,player.car.heading,Math.min(1,dt*3.2));
      const speedKick=clamp(Math.abs(player.vehicle?player.car.speed:speed)/9,0,1.6);
      const dist=clamp((portrait?12.5:10.2)+(player.vehicle?3.4:0)+speedKick*1.6+cameraZoom,6.5,24);const height=clamp((portrait?6.6:5.4)+(player.vehicle?.4:0)+cameraPitch*2.2+cameraZoom*.16,3.5,12);
      desiredPos=new THREE.Vector3(player.x-Math.sin(cameraYaw)*dist,player.y+height,player.z+Math.cos(cameraYaw)*dist);const visualHeight=1.4*playerScaleValue()*(player.crouched?.72:1);look=new THREE.Vector3(player.x+Math.sin(cameraYaw)*3.5,player.y+visualHeight,player.z-Math.cos(cameraYaw)*3.5);
      camera.fov=(portrait?57:60)+speedKick*(player.vehicle?7:2);
    }
    const t=1-Math.exp(-dt*7.5);camera.position.lerp(desiredPos,t);camera.lookAt(look);camera.updateProjectionMatrix();
  }

  function nearestInteractable(){
    if(activeRace)return null;
    if(player.vehicle)return{id:'exit-vehicle',type:'vehicle',icon:'🚗',label:'Sair do carrinho',radius:999,priority:999,action:exitVehicle};
    if(buildMode)return{id:'place-build',type:'build',icon:'🧱',label:'Colocar construção',radius:999,priority:999,action:placeBuild};
    const remote=nearestRemotePlayer();if(remote)return{id:`remote-${remote.uid}`,type:'remote-player',icon:'🌐',label:`Interagir: ${remote.ghost.userData.displayName||'Jogador'}`,radius:2.8,priority:980,x:remote.ghost.position.x,z:remote.ghost.position.z,action:()=>openRemotePlayerActions(remote.uid,remote.ghost)};
    let nearest=null,best=Infinity;
    for(const it of world.interactables){
      if(!isInteractionAvailable(it))continue;
      const pos=worldPos(it),d=Math.hypot(player.x-pos.x,player.z-pos.z);
      if(d>(it.radius||2))continue;
      const score=d-(it.priority||0)*.006;
      if(score<best){best=score;nearest=it;}
    }
    return nearest;
  }
  function updateContext(force=false){
    const now=performance.now(),moved=Math.hypot(player.x-lastContextScanX,player.z-lastContextScanZ);if(!force&&now-lastContextScanAt<85&&moved<.18)return;lastContextScanAt=now;lastContextScanX=player.x;lastContextScanZ=player.z;
    const next=nearestInteractable();const id=next?.id||'';if(!force&&id===lastContextId)return;lastContextId=id;currentContext=next;els.contextPrompt.hidden=!next;els.actionBtn.classList.toggle('pulse',!!next);els.contextIcon.textContent=next?.icon||'⚔';els.contextLabel.textContent=next?.label||'Atacar';els.contextHint.textContent=next?'Toque em AÇÃO':'Ataque próximo';const span=$('span',els.actionBtn);const icon=$('b',els.actionBtn);if(span)span.textContent=next?'Ação':'Espada';if(icon)icon.textContent=next?.icon||'⚔';
  }
  function doAction(){
    if(paused||!els.modal.hidden||performance.now()<actionLockedUntil)return;
    actionLockedUntil=performance.now()+90;state.stats.actions++;
    if(state.ui.quickOpen){state.ui.quickOpen=false;syncMobilePanels();}
    let target=currentContext;
    if(target&&target.radius!==999){const pos=worldPos(target);if(!isInteractionAvailable(target)||Math.hypot(player.x-pos.x,player.z-pos.z)>(target.radius||2)+.2)target=null;}
    if(!target)target=nearestInteractable();
    currentContext=target;lastActionSource=target?.id||'melee';
    if(target){target.action();updateContext(true);return;}
    meleeAttack();
  }

  function updateNeeds(dt){
    updateNeeds.acc=(updateNeeds.acc||0)+dt;if(updateNeeds.acc<1)return;const sec=updateNeeds.acc;updateNeeds.acc=0;state.needs.hunger=clamp(state.needs.hunger-sec*.065,0,100);state.needs.energy=clamp(state.needs.energy-sec*(player.vehicle?(sprintRequested()?.085:.035):(input.isSprinting?.16:.045)),0,100);state.needs.fun=clamp(state.needs.fun-sec*.025,0,100);state.needs.hygiene=clamp(state.needs.hygiene-sec*.028,0,100);if(state.needs.hunger<8&&Math.random()<.08)toast(`${playerDisplayName()} está com fome.`,'warn');updateHUD();if(!updateNeeds.lastSave||performance.now()-updateNeeds.lastSave>10000){updateNeeds.lastSave=performance.now();saveState();}
  }

  let localChannel=null,lastPublish=0,lastPublishSnapshot=null,lastPublishHeartbeat=0;

  let multiplayerState={mode:'solo',connected:false,count:0,room:'mundo-publico',error:'',players:[]};const remotePresence=new Map();
  const cloudHouses=new Map(),cloudChat=[],incomingChallenges=new Map(),gameSessions=new Map(),shownChallengeToasts=new Set(),shownGameResults=new Set();let activeMultiplayerGameId='',promptChallengeId='',promptSessionId='';
  function multiplayerGameLabel(type){return type==='portuguese'?'Português Kids':type==='english'?'English Kids':'Matemática Kids';}
  function pendingChallenges(){return [...incomingChallenges.values()].filter(c=>c.status==='pending');}
  function readyGameSessions(){const uid=window.OTTHOS_RTDB?.uid;return [...gameSessions.values()].filter(s=>(s.fromUid===uid||s.toUid===uid)&&s.status==='active');}
  function closeChallengePrompt(){if(!els.challengePrompt)return;els.challengePrompt.hidden=true;els.challengePrompt.classList.remove('ready','incoming');promptChallengeId='';promptSessionId='';els.challengePromptAccept.disabled=false;els.challengePromptDecline.disabled=false;}
  function showIncomingChallengePrompt(c){if(!c||c.status!=='pending'||!els.challengePrompt)return;promptChallengeId=c.id;promptSessionId='';els.challengePrompt.classList.add('incoming');els.challengePrompt.classList.remove('ready');els.challengePromptKicker.textContent='NOVO DESAFIO';els.challengePromptTitle.textContent=`${c.fromName||'Jogador'} desafiou você`;els.challengePromptText.textContent=`${multiplayerGameLabel(c.type)} • toque em Aceitar e jogar`;els.challengePromptAccept.textContent='Aceitar e jogar';els.challengePromptDecline.textContent='Recusar';els.challengePrompt.hidden=false;}
  function showReadySessionPrompt(s){if(!s||s.status!=='active'||!els.challengePrompt)return;const uid=window.OTTHOS_RTDB?.uid,mine=s.players?.[uid];if(mine?.finished)return;promptSessionId=s.id;promptChallengeId='';els.challengePrompt.classList.add('ready');els.challengePrompt.classList.remove('incoming');els.challengePromptKicker.textContent='PARTIDA PRONTA';els.challengePromptTitle.textContent=`Duelo de ${multiplayerGameLabel(s.type)}`;els.challengePromptText.textContent=`Contra ${sessionOpponentName(s)} • os dois jogarão as mesmas 5 atividades`;els.challengePromptAccept.textContent='Jogar agora';els.challengePromptDecline.textContent='Depois';els.challengePrompt.hidden=false;}
  async function launchSessionWithCountdown(session){if(!session)return;closeChallengePrompt();closeModal();let count=3;const draw=()=>openModal(`Duelo: ${multiplayerGameLabel(session.type)}`,`<div class="duel-countdown"><small>Contra ${escapeHtml(sessionOpponentName(session))}</small><b>${count}</b><span>Prepare-se!</span></div>`,root=>{});draw();const timer=setInterval(()=>{count--;if(count<=0){clearInterval(timer);closeModal();startMultiplayerEducationGame(session);}else draw();},620);}
  function updateOnlineAttention(){const count=pendingChallenges().length+readyGameSessions().filter(s=>!s.players?.[window.OTTHOS_RTDB?.uid]?.finished).length;els.onlineBtn?.classList.toggle('attention',count>0);if(els.onlineBtn){const span=$('span',els.onlineBtn);if(span)span.textContent=count?`Online ${count}`:'Online';}}
  function challengeInboxHtml(){const list=pendingChallenges();return list.length?`<div class="challenge-inbox">${list.map(c=>`<article class="challenge-card"><div><b>⚔️ ${escapeHtml(c.fromName||'Jogador')}</b><span>Desafio: ${multiplayerGameLabel(c.type)}</span></div><div><button class="accept" data-accept-challenge="${c.id}">Aceitar e jogar</button><button data-decline-challenge="${c.id}">Recusar</button></div></article>`).join('')}</div>`:'<p class="empty-online">Nenhum convite pendente.</p>';}
  function completedGameSessions(){const uid=window.OTTHOS_RTDB?.uid;return [...gameSessions.values()].filter(s=>s.status==='completed'&&s.result&&(s.fromUid===uid||s.toUid===uid)).sort((a,b)=>Number(b.completedAt||b.result?.completedAt||0)-Number(a.completedAt||a.result?.completedAt||0)).slice(0,20);}
  function rememberMatchResult(session){if(!session?.result)return null;const list=state.learning.matchHistory||(state.learning.matchHistory=[]),existing=list.find(x=>x.id===session.id);if(existing)return existing;const uid=window.OTTHOS_RTDB?.uid,r=session.result,mine=session.players?.[uid]||{},other=Object.entries(session.players||{}).find(([id])=>id!==uid)?.[1]||{};const entry={id:session.id,type:session.type,opponent:sessionOpponentName(session),myScore:Number(mine.score||0),otherScore:Number(other.score||0),won:!r.draw&&r.winnerUid===uid,draw:!!r.draw,winnerName:r.winnerName||'',completedAt:Number(session.completedAt||r.completedAt||Date.now()),rewarded:false};list.unshift(entry);state.learning.matchHistory=list.slice(0,20);return entry;}
  function duelHistoryHtml(){const sessions=completedGameSessions();return sessions.length?`<div class="duel-history">${sessions.map(s=>{const r=s.result,uid=window.OTTHOS_RTDB?.uid,mine=s.players?.[uid]||{},other=Object.entries(s.players||{}).find(([id])=>id!==uid)?.[1]||{},won=!r.draw&&r.winnerUid===uid;return`<article class="duel-history-card ${won?'won':r.draw?'draw':'lost'}"><span>${r.draw?'🤝':won?'🏆':'🎮'}</span><div><b>${r.draw?'Empate':`Vencedor: ${escapeHtml(r.winnerName||'Jogador')}`}</b><small>${multiplayerGameLabel(s.type)} • ${Number(mine.score||0)} × ${Number(other.score||0)} contra ${escapeHtml(sessionOpponentName(s))}</small></div></article>`}).join('')}</div>`:'<p class="empty-online">Nenhum duelo concluído ainda.</p>';}
  function activeSessionsHtml(){const uid=window.OTTHOS_RTDB?.uid,list=readyGameSessions();return list.length?`<div class="challenge-inbox">${list.map(s=>{const other=s.fromUid===uid?s.toName||remotePresence.get(s.toUid)?.name||'Adversário':s.fromName||'Adversário',mine=s.players?.[uid];return`<article class="challenge-card ready"><div><b>🎮 ${multiplayerGameLabel(s.type)}</b><span>contra ${escapeHtml(other)}</span></div><button class="accept" data-play-session="${s.id}" ${mine?.finished?'disabled':''}>${mine?.finished?'Concluído':'Jogar agora'}</button></article>`}).join('')}</div>`:'';}
  function bindChallengeCards(root=els.modalBody){$$('[data-accept-challenge]',root).forEach(btn=>btn.onclick=()=>acceptIncomingChallenge(btn.dataset.acceptChallenge));$$('[data-decline-challenge]',root).forEach(btn=>btn.onclick=()=>declineIncomingChallenge(btn.dataset.declineChallenge));$$('[data-play-session]',root).forEach(btn=>btn.onclick=()=>{const s=gameSessions.get(btn.dataset.playSession);if(s)launchSessionWithCountdown(s);});}
  async function acceptIncomingChallenge(id){const c=incomingChallenges.get(id)||window.OTTHOS_RTDB?.getChallenges?.()?.[id];if(!c){toast('Convite não encontrado. Abra Online e tente novamente.','warn');return;}els.challengePromptAccept.disabled=true;els.challengePromptDecline.disabled=true;els.challengePromptAccept.textContent='Conectando...';const result=await window.OTTHOS_RTDB?.respondGameChallenge?.(id,true);if(!result?.ok){els.challengePromptAccept.disabled=false;els.challengePromptDecline.disabled=false;els.challengePromptAccept.textContent='Aceitar e jogar';toast(result?.error||'Não foi possível aceitar.','warn',3000);return;}c.status='accepted';incomingChallenges.set(id,c);const session=result.session||await window.OTTHOS_RTDB?.getGameSession?.(id);if(session){gameSessions.set(id,{id,...session});refreshOpenSocialHub();toast(`Desafio aceito: ${multiplayerGameLabel(c.type)}`,'good');launchSessionWithCountdown({id,...session});}else{closeChallengePrompt();toast('Desafio aceito. Toque em Online > Jogar agora.','good',2600);}updateOnlineAttention();}
  async function declineIncomingChallenge(id){const c=incomingChallenges.get(id);if(!c)return;els.challengePromptAccept.disabled=true;els.challengePromptDecline.disabled=true;await window.OTTHOS_RTDB?.respondGameChallenge?.(id,false);c.status='declined';incomingChallenges.set(id,c);closeChallengePrompt();refreshOpenSocialHub();updateOnlineAttention();}
  function highestUnlockedLevel(subject){let value=1;for(let level=2;level<=6;level++){if(subjectUnlocked(subject,level))value=level;}return value;}
  function openChallengePicker(uid,name){openModal(`Desafiar ${name}`,`<p>Escolha o jogo. O outro jogador receberá um cartão na tela com <b>Aceitar e jogar</b>.</p><div class="challenge-picker"><button data-challenge-type="math"><span>🔢</span><b>Matemática Kids</b><small>Contagem, soma e lógica</small></button><button data-challenge-type="portuguese"><span>📚</span><b>Português Kids</b><small>Letras, sílabas e palavras</small></button><button data-challenge-type="english"><span>🌎</span><b>English Kids</b><small>Imagens, sons e palavras</small></button></div>`,root=>{$$('[data-challenge-type]',root).forEach(btn=>btn.onclick=async()=>{btn.disabled=true;btn.classList.add('sending');const result=await window.OTTHOS_RTDB?.sendGameChallenge?.(uid,btn.dataset.challengeType,highestUnlockedLevel(btn.dataset.challengeType),name);if(result?.ok){toast(`Convite enviado para ${name}. Aguardando resposta.`,'good',2600);closeModal();}else{btn.disabled=false;btn.classList.remove('sending');toast(result?.error||'Falha ao enviar desafio.','warn');}});});}
  function sessionOpponentName(session){const uid=window.OTTHOS_RTDB?.uid;return session.fromUid===uid?(remotePresence.get(session.toUid)?.name||session.toName||'Adversário'):(session.fromName||'Adversário');}
  function startMultiplayerEducationGame(session){if(!session||session.status!=='active'){toast('Esta partida ainda não está pronta.','warn');return;}if(activeMultiplayerGameId&&activeMultiplayerGameId!==session.id){toast('Termine a partida atual.','warn');return;}activeMultiplayerGameId=session.id;closeChallengePrompt();runEducationGame({subject:session.type,level:Number(session.level||1),seed:Number(session.seed)||Date.now(),rounds:Number(session.rounds||5),multiplayer:true,opponent:sessionOpponentName(session),onFinish:async result=>{state.learning.multiplayerPlayed=(state.learning.multiplayerPlayed||0)+1;const ok=await window.OTTHOS_RTDB?.submitGameResult?.(session.id,result);saveState(true);openModal(ok?'Resultado enviado':'Resultado salvo no aparelho',`<div class="lesson-result"><div>${ok?'⏳':'⚠️'}</div><h3>${result.score}/${result.total}</h3><p>${ok?`Aguardando ${escapeHtml(sessionOpponentName(session))} terminar.`:'A conexão caiu. Abra Online para reenviar ou jogar novamente.'}</p><button class="btn primary" data-open-online>Ver partidas online</button></div>`,root=>$('[data-open-online]',root).onclick=openSocialHub);activeMultiplayerGameId='';}});}
  function maybeShowMultiplayerResult(session){const players=Object.values(session.players||{}),uid=window.OTTHOS_RTDB?.uid;if(players.length<2||!players.every(p=>p.finished))return;if(!session.result){window.OTTHOS_RTDB?.finalizeGameSession?.(session.id);return;}const mine=session.players?.[uid],other=Object.entries(session.players||{}).find(([id])=>id!==uid)?.[1],entry=rememberMatchResult(session),won=!session.result.draw&&session.result.winnerUid===uid,draw=!!session.result.draw;if(entry&&!entry.rewarded&&won){entry.rewarded=true;state.learning.multiplayerWins=(state.learning.multiplayerWins||0)+1;addCoins(80);addXP(60);}saveState(true);if(shownGameResults.has(session.id))return;shownGameResults.add(session.id);openModal(draw?'Empate!':won?'Você venceu!':`${session.result.winnerName||'Adversário'} venceu`,`<div class="duel-result"><div>${draw?'🤝':won?'🏆':'🎮'}</div><h3>${mine?.score||0} × ${other?.score||0}</h3><p><b>Vencedor registrado:</b> ${escapeHtml(draw?'Empate':session.result.winnerName||'Jogador')}</p><small>${won?'Você ganhou 80 moedas e 60 XP.':'O resultado ficou salvo no histórico de duelos.'}</small><button class="btn primary" data-duel-close>Continuar no mundo</button><button class="btn" data-duel-history>Ver histórico</button></div>`,root=>{$('[data-duel-close]',root).onclick=closeModal;$('[data-duel-history]',root).onclick=openSocialHub;});}
  function multiplayerStatusText(){if(multiplayerState.connected)return`Mundo público • ${multiplayerState.count||1} online`;if(window.OTTHOS_RTDB?.configured)return multiplayerState.error?`Offline: ${multiplayerState.error}`:'Conectando ao mundo público...';return'Firebase indisponível';}
  function updateMultiplayerBadge(){if(!els.multiplayerBadge)return;els.multiplayerBadge.classList.toggle('online',multiplayerState.connected);els.multiplayerBadge.classList.toggle('offline',!multiplayerState.connected);const label=$('span',els.multiplayerBadge);if(label)label.textContent=multiplayerState.connected?`${multiplayerState.count||1} online`:'Offline';}
  function onlinePlayers(){return [...remotePresence.entries()].map(([uid,data])=>{const ghost=world.ghosts.get(uid);return{uid,name:data.name||ghost?.userData?.displayName||'Jogador',distance:ghost?Math.hypot(player.x-ghost.position.x,player.z-ghost.position.z):Math.hypot(player.x-(data.x||0),player.z-(data.z||0))}}).sort((a,b)=>a.distance-b.distance);}
  function onlinePlayerListHtml(players=onlinePlayers()){return players.length?players.map(p=>`<button class="online-player-card" data-online-player="${p.uid}"><span>👤</span><b>${escapeHtml(p.name)}</b><small>${Math.round(p.distance)} m</small></button>`).join(''):'<p>Nenhum outro jogador apareceu ainda. Abra o jogo em outro celular usando o mesmo Firebase.</p>';}
  function bindOnlinePlayerCards(root=els.modalBody){$$('[data-online-player]',root).forEach(btn=>btn.onclick=()=>{const uid=btn.dataset.onlinePlayer,ghost=world.ghosts.get(uid);if(ghost)openRemotePlayerActions(uid,ghost);});}
  function refreshOpenSocialHub(){updateOnlineAttention();if(els.modal.hidden||els.modalTitle.textContent!=='Mundo Online')return;const players=onlinePlayers(),status=$('#onlineStatusText',els.modalBody),count=$('#onlineCount',els.modalBody),list=$('#onlinePlayerList',els.modalBody),chat=$('#worldChatList',els.modalBody),invites=$('#challengeInbox',els.modalBody),sessions=$('#activeGameSessions',els.modalBody),history=$('#duelHistory',els.modalBody);if(status)status.textContent=multiplayerStatusText();if(count)count.textContent=`${players.length} além de você`;if(list){list.innerHTML=onlinePlayerListHtml(players);bindOnlinePlayerCards(els.modalBody);}if(invites){invites.innerHTML=challengeInboxHtml();bindChallengeCards(els.modalBody);}if(sessions){sessions.innerHTML=activeSessionsHtml();bindChallengeCards(els.modalBody);}if(history)history.innerHTML=duelHistoryHtml();if(chat){chat.innerHTML=cloudChat.slice(-30).map(m=>chatMessageHtml(m)).join('')||'<p>Envie a primeira mensagem.</p>';chat.scrollTop=chat.scrollHeight;}}
  function openSocialHub(){
    const players=onlinePlayers(),messages=cloudChat.slice(-30);
    openModal('Mundo Online',`<div class="online-status-card"><b id="onlineStatusText">${multiplayerStatusText()}</b><span>Todos entram automaticamente no mesmo mundo, sem escolher sala e sem senha.</span></div><div class="social-tabs"><b>Convites de jogos</b><small>${pendingChallenges().length} pendente(s)</small></div><div id="challengeInbox">${challengeInboxHtml()}</div><div id="activeGameSessions">${activeSessionsHtml()}</div><div class="social-tabs"><b>Histórico de duelos</b><small>vencedores registrados</small></div><div id="duelHistory">${duelHistoryHtml()}</div><div class="social-tabs"><b>Jogadores</b><small id="onlineCount">${players.length} além de você</small></div><div id="onlinePlayerList" class="online-player-list">${onlinePlayerListHtml(players)}</div><div class="social-tabs chat-title-row"><b>Chat do mundo</b><small>texto em tempo real</small></div><div id="worldChatList" class="world-chat-list">${messages.map(m=>chatMessageHtml(m)).join('')||'<p>Envie a primeira mensagem.</p>'}</div><div class="chat-compose"><input id="worldChatInput" maxlength="180" placeholder="Escreva uma mensagem..."><button data-send-world-chat>Enviar</button></div><div class="chat-history-actions"><button data-clear-local-chat>Limpar desta tela</button><button class="danger" data-delete-own-chat>Apagar minhas mensagens</button></div>`,root=>{
      bindOnlinePlayerCards(root);bindChallengeCards(root);
      const send=()=>{const input=$('#worldChatInput',root),text=(input?.value||'').trim();if(!text)return;window.OTTHOS_RTDB?.sendChat?.(text);input.value='';};$('[data-send-world-chat]',root).onclick=send;$('#worldChatInput',root)?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();send();}});
      $('[data-clear-local-chat]',root).onclick=()=>{state.social.chatHiddenBefore=Date.now();cloudChat.length=0;saveState(true);refreshOpenSocialHub();toast('Histórico ocultado neste aparelho.','good');};
      $('[data-delete-own-chat]',root).onclick=async()=>{const btn=$('[data-delete-own-chat]',root);btn.disabled=true;btn.textContent='Apagando...';const result=await window.OTTHOS_RTDB?.deleteOwnChatMessages?.();if(result?.ok){for(let i=cloudChat.length-1;i>=0;i--)if(cloudChat[i].senderUid===window.OTTHOS_RTDB?.uid)cloudChat.splice(i,1);refreshOpenSocialHub();toast(`${result.count||0} mensagem(ns) apagada(s).`,'good');}else{btn.disabled=false;btn.textContent='Apagar minhas mensagens';toast(result?.error||'Não foi possível apagar.','warn');}};
    });
  }
  function escapeHtml(value=''){return String(value).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
  function chatMessageHtml(m){return`<article class="world-chat-message"><b>${escapeHtml(m.name||'Jogador')}</b><span>${escapeHtml(m.text||'')}</span></article>`;}
  function openRemotePlayerActions(uid,ghost){const name=ghost.userData.displayName||'Jogador';openModal(name,`<p>Interaja com este jogador em tempo real.</p><div class="choice-grid remote-social-grid"><button class="choice" data-player-action="wave"><b>👋 Acenar</b><span>Enviar saudação</span></button><button class="choice" data-player-action="dance"><b>🕺 Dançar juntos</b><span>Os dois fazem a dança</span></button><button class="choice" data-player-action="play"><b>🎈 Brincar</b><span>Aumenta a diversão</span></button><button class="choice" data-player-action="highfive"><b>🙌 Toca aqui</b><span>Interação social</span></button><button class="choice" data-player-action="hug"><b>🤗 Abraçar</b><span>Gesto de amizade</span></button><button class="choice" data-player-action="selfie"><b>📸 Selfie</b><span>Foto simbólica juntos</span></button><button class="choice" data-player-action="giftCoins"><b>🪙 Dar 10 moedas</b><span>Presente online</span></button><button class="choice" data-player-action="giftCrystal"><b>💎 Dar cristal</b><span>Usa 1 cristal</span></button><button class="choice" data-player-action="challenge"><b>⚔️ Desafiar</b><span>Matemática, Português ou English</span></button><button class="choice" data-player-action="message"><b>💬 Mencionar no chat</b><span>Abrir conversa pública</span></button></div>`,root=>{$$('[data-player-action]',root).forEach(btn=>btn.onclick=async()=>{const action=btn.dataset.playerAction;if(action==='message'){closeModal();openSocialHub();setTimeout(()=>{const input=$('#worldChatInput');if(input){input.value=`@${name} `;input.focus();}},100);return;}if(action==='giftCoins'){if(state.profile.coins<10){toast('Você não tem 10 moedas.','warn');return;}const ok=await window.OTTHOS_RTDB?.sendGift?.(uid,{type:'coins',amount:10});if(ok){addCoins(-10);toast(`Você presenteou ${name}.`,'good');}}else if(action==='giftCrystal'){if(state.inventory.crystals<1){toast('Você não tem cristal.','warn');return;}const ok=await window.OTTHOS_RTDB?.sendGift?.(uid,{type:'crystal',amount:1});if(ok){state.inventory.crystals--;saveState(true);toast(`Cristal enviado para ${name}.`,'good');}}else if(action==='challenge'){openChallengePicker(uid,name);return;}else{const social=['wave','dance','play','highfive','hug','selfie'].includes(action)?action:'wave';const ok=await window.OTTHOS_RTDB?.sendInteraction?.(uid,{type:social});if(ok){triggerEmote(social);if(social==='play')state.needs.fun=clamp(state.needs.fun+10,0,100);saveState();toast(`Ação enviada para ${name}.`,'good');}}closeModal();});});}
  function nearestRemotePlayer(){let found=null,best=Infinity;for(const [uid,g] of world.ghosts){const d=Math.hypot(player.x-g.position.x,player.z-g.position.z);if(d<2.7&&d<best){best=d;found={uid,ghost:g};}}return found;}
  function openMultiplayerConfig(){openSocialHub();}
  function remotePlayerEvent(data){if(!data||data.uid===window.OTTHOS_RTDB?.uid)return;remotePresence.set(data.uid,data);let ghost=world.ghosts.get(data.uid);if(scene&&!ghost){ghost=createGhost(data.color||0x5ad8ff,data.name||'Jogador');world.ghosts.set(data.uid,ghost);}if(ghost){updateGhostName(ghost,data.name);ghost.userData.target=data;}refreshOpenSocialHub();}
  window.addEventListener('otthos:mp-status',e=>{multiplayerState={...multiplayerState,...e.detail};state.multiplayer.cloudReady=!!multiplayerState.connected;if(e.detail?.uid)state.multiplayer.cloudUid=e.detail.uid;if(Array.isArray(e.detail?.players)){remotePresence.clear();e.detail.players.filter(p=>p.uid!==window.OTTHOS_RTDB?.uid).forEach(p=>remotePresence.set(p.uid,p));}updateMultiplayerBadge();refreshOpenSocialHub();});
  window.addEventListener('otthos:mp-player',e=>remotePlayerEvent(e.detail));
  window.addEventListener('otthos:mp-leave',e=>{const id=e.detail?.uid;remotePresence.delete(id);const ghost=world.ghosts.get(id);if(ghost){scene?.remove(ghost);world.ghosts.delete(id);}multiplayerState.count=Math.max(1,remotePresence.size+1);updateMultiplayerBadge();refreshOpenSocialHub();});
  window.addEventListener('otthos:cloud-profile',e=>mergeCloudProgress(e.detail?.progress));
  window.addEventListener('otthos:houses',e=>{cloudHouses.clear();for(const [id,data] of Object.entries(e.detail||{}))cloudHouses.set(id,data);reconcileCloudHouses();});
  window.addEventListener('otthos:chat',e=>{const m=e.detail;if(!m||Number(m.createdAt||0)<=Number(state.social.chatHiddenBefore||0))return;const existing=cloudChat.findIndex(x=>x.id===m.id);if(existing>=0)cloudChat[existing]=m;else cloudChat.push(m);cloudChat.sort((a,b)=>Number(a.createdAt||0)-Number(b.createdAt||0));while(cloudChat.length>60)cloudChat.shift();refreshOpenSocialHub();if(m.senderUid!==window.OTTHOS_RTDB?.uid)toast(`${m.name}: ${m.text}`,'good',2200);});
  window.addEventListener('otthos:chat-removed',e=>{const id=e.detail?.id,index=cloudChat.findIndex(m=>m.id===id);if(index>=0)cloudChat.splice(index,1);refreshOpenSocialHub();});
  window.addEventListener('otthos:gift',e=>{const gift=e.detail;if(!gift)return;if(gift.type==='coins'){state.profile.coins+=Number(gift.amount||0);}else if(gift.type==='crystal'){state.inventory.crystals=(state.inventory.crystals||0)+Number(gift.amount||1);}saveState(true);toast(`🎁 ${gift.senderName||'Jogador'} enviou um presente!`,'good',2600);});
  window.addEventListener('otthos:interaction',e=>{const it=e.detail;if(!it)return;const sender=it.senderName||'Jogador';if(it.type==='challengeAccepted'){toast(`🎮 ${sender} aceitou seu desafio! Abra Online para jogar.`,'good',3400);}else if(it.type==='challengeDeclined'){toast(`${sender} recusou o desafio.`,'warn',2400);}else{const social=['wave','dance','play','highfive','hug','selfie'].includes(it.type)?it.type:'wave',labels={wave:`👋 ${sender} acenou para você.`,dance:`🕺 ${sender} chamou você para dançar!`,play:`🎈 ${sender} começou uma brincadeira!`,highfive:`🙌 ${sender} fez toca aqui!`,hug:`🤗 ${sender} enviou um abraço!`,selfie:`📸 ${sender} tirou uma selfie com você!`};triggerEmote(social);if(social==='play')state.needs.fun=clamp(state.needs.fun+10,0,100);toast(labels[social],'good',2400);}});
  window.addEventListener('otthos:challenge',e=>{const c=e.detail;if(!c)return;incomingChallenges.set(c.id,c);updateOnlineAttention();refreshOpenSocialHub();if(c.status==='pending'){showIncomingChallengePrompt(c);if(!shownChallengeToasts.has(c.id)){shownChallengeToasts.add(c.id);toast(`⚔️ ${c.fromName||'Jogador'} enviou ${multiplayerGameLabel(c.type)}!`,'good',3400);}}});
  window.addEventListener('otthos:challenge-removed',e=>{incomingChallenges.delete(e.detail?.id);updateOnlineAttention();refreshOpenSocialHub();});
  window.addEventListener('otthos:game-session',e=>{const s=e.detail;if(!s)return;gameSessions.set(s.id,s);updateOnlineAttention();refreshOpenSocialHub();if(s.status==='active'){const mine=s.players?.[window.OTTHOS_RTDB?.uid];if(!mine?.finished&&!activeMultiplayerGameId)showReadySessionPrompt(s);}if(s.status==='active'||s.status==='completed')maybeShowMultiplayerResult(s);});
  window.addEventListener('otthos:game-session-removed',e=>{gameSessions.delete(e.detail?.id);updateOnlineAttention();refreshOpenSocialHub();});
  window.addEventListener('otthos:rtdb-ready',()=>{if(running||hasValidPlayerName())window.OTTHOS_RTDB?.connect?.({name:state.profile.name||'Jogador'});});

  function initLocalMultiplayer(){
    if(typeof BroadcastChannel==='function'){localChannel=new BroadcastChannel('otthos-life-world-v623');localChannel.onmessage=e=>{const data=e.data;if(!data||data.id===state.profile.playerId)return;if(data.type==='leave'){const ghost=world.ghosts.get(data.id);if(ghost){scene.remove(ghost);world.ghosts.delete(data.id);}return;}remotePlayerEvent({...data,uid:data.id});};window.addEventListener('beforeunload',()=>localChannel?.postMessage({type:'leave',id:state.profile.playerId}));}
    window.OTTHOS_MULTIPLAYER={version:5,playerId:state.profile.playerId,mode:window.OTTHOS_RTDB?.configured?'firebase-public-world':'local-preview',connect:()=>window.OTTHOS_RTDB?.connect?.({name:state.profile.name||'Jogador'})||true,publish:payload=>{localChannel?.postMessage(payload);window.OTTHOS_RTDB?.publish?.(payload);},adapter:window.OTTHOS_RTDB?.configured?'Firebase Realtime Database':'BroadcastChannel'};updateMultiplayerBadge();if(window.OTTHOS_RTDB?.configured&&hasValidPlayerName())window.OTTHOS_RTDB.connect({name:state.profile.name||'Jogador'});
  }
  function multiplayerNameTexture(name){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='rgba(5,18,34,.88)';ctx.strokeStyle='rgba(255,255,255,.92)';ctx.lineWidth=8;const r=30;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(8,8,c.width-16,c.height-16,r);else ctx.rect(8,8,c.width-16,c.height-16);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 48px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(sanitizePlayerName(name)||'Jogador',c.width/2,c.height/2+2);const tex=new THREE.CanvasTexture(c);tex.minFilter=THREE.LinearFilter;tex.magFilter=THREE.LinearFilter;tex.generateMipmaps=false;return tex;}
  function updateLocalPlayerNameLabel(){if(!playerGroup?.userData?.nameLabel)return;const clean=playerDisplayName();if(playerGroup.userData.displayName===clean)return;const label=playerGroup.userData.nameLabel,old=label.material.map;label.material.map=multiplayerNameTexture(clean);label.material.needsUpdate=true;old?.dispose?.();playerGroup.userData.displayName=clean;}
  function updateGhostName(ghost,name){const clean=sanitizePlayerName(name)||'Jogador';if(ghost.userData.displayName===clean)return;ghost.userData.displayName=clean;if(ghost.userData.nameLabel){const old=ghost.userData.nameLabel.material.map;ghost.userData.nameLabel.material.map=multiplayerNameTexture(clean);ghost.userData.nameLabel.material.needsUpdate=true;old?.dispose?.();}}
  function createGhost(color,name='Jogador'){const g=new THREE.Group();box(.82,1.18,.58,color,0,1.25,0,g);box(.72,.72,.72,0x111217,0,2.24,0,g);const leftArm=box(.22,1,.25,0xff9a24,-.58,1.28,0,g),rightArm=box(.22,1,.25,0xff9a24,.58,1.28,0,g),leftLeg=box(.25,1,.28,0x20242b,-.22,.34,0,g),rightLeg=box(.25,1,.28,0x20242b,.22,.34,0,g);box(.12,.1,.04,0xff3344,-.14,2.27,.38,g);box(.12,.1,.04,0xff3344,.14,2.27,.38,g);const label=new THREE.Sprite(new THREE.SpriteMaterial({map:multiplayerNameTexture(name),transparent:true,depthWrite:false,depthTest:false}));label.position.set(0,3.05,0);label.scale.set(2.75,.69,1);label.renderOrder=999;g.add(label);g.userData.nameLabel=label;g.userData.displayName=sanitizePlayerName(name)||'Jogador';g.userData.limbs={leftArm,rightArm,leftLeg,rightLeg};g.userData.phase=Math.random()*6.28;scene.add(g);return g;}
  function updateMultiplayer(dt){
    const now=performance.now(),payload={type:'position',id:state.profile.playerId,name:state.profile.name||'Jogador',x:+player.x.toFixed(2),y:+player.y.toFixed(2),z:+player.z.toFixed(2),r:+player.facing.toFixed(3),vehicle:!!player.vehicle,scaleMode:player.scaleMode,crouched:!!player.crouched,emoteType:player.emoteType||'',emoteSeq:Number(player.emoteSeq||0),color:0x5ad8ff};
    const changed=!lastPublishSnapshot||Math.hypot(payload.x-lastPublishSnapshot.x,payload.z-lastPublishSnapshot.z)>.06||Math.abs(payload.r-lastPublishSnapshot.r)>.025||payload.vehicle!==lastPublishSnapshot.vehicle||payload.scaleMode!==lastPublishSnapshot.scaleMode||payload.crouched!==lastPublishSnapshot.crouched||payload.emoteSeq!==lastPublishSnapshot.emoteSeq;
    if((changed&&now-lastPublish>240)||now-lastPublishHeartbeat>2200){lastPublish=now;lastPublishHeartbeat=now;lastPublishSnapshot=payload;localChannel?.postMessage(payload);window.OTTHOS_RTDB?.publish?.(payload);}
    for(const ghost of world.ghosts.values()){const t=ghost.userData.target;if(!t)continue;ghost.position.x=lerp(ghost.position.x,t.x,Math.min(1,dt*8));ghost.position.y=lerp(ghost.position.y,t.y,Math.min(1,dt*8));ghost.position.z=lerp(ghost.position.z,t.z,Math.min(1,dt*8));ghost.rotation.y=lerpAngle(ghost.rotation.y,t.r||0,Math.min(1,dt*8));if(Number(t.emoteSeq||0)!==Number(ghost.userData.lastEmoteSeq||0)){ghost.userData.lastEmoteSeq=Number(t.emoteSeq||0);ghost.userData.emoteType=t.emoteType||'';ghost.userData.emoteUntil=performance.now()+2600;}const moving=Math.hypot(ghost.position.x-t.x,ghost.position.z-t.z)>.03,walk=moving?Math.sin(animTime*9+ghost.userData.phase)*.45:0,emote=performance.now()<Number(ghost.userData.emoteUntil||0)?ghost.userData.emoteType:'';if(ghost.userData.limbs){const l=ghost.userData.limbs;l.leftArm.rotation.x=emote==='dance'?-1.35:emote==='play'?-1.9:emote==='hug'?-1.45:walk;l.rightArm.rotation.x=emote==='wave'?-2.2:emote==='highfive'?-2.5:emote==='dance'?-1.35:emote==='play'?-1.9:emote==='hug'?-1.45:-walk;l.leftArm.rotation.z=emote==='dance'?1.0:emote==='play'?.55:emote==='hug'?-.48:0;l.rightArm.rotation.z=emote==='dance'?-1.0:emote==='play'?-.55:emote==='hug'?.48:0;l.leftLeg.rotation.x=-walk*.75;l.rightLeg.rotation.x=walk*.75;}ghost.scale.setScalar(t.scaleMode==='mini'?.58:t.scaleMode==='giant'?1.42:1);}
  }

  function gameLoop(){
    if(!running)return;raf=requestAnimationFrame(gameLoop);const dt=Math.min(.033,clock.getDelta());samplePerformance(dt);
    if(!paused){
      pollGamepad();updatePlayer(dt);updateVehicleFX(dt);updateFX(dt);updateFireballs(dt);updateRace(dt);updateNeeds(dt);updateCamera(dt);updateNavigation(dt);updateVisualLOD(dt);
      perf.aiAcc+=dt;if(perf.aiAcc>=1/30){const step=perf.aiAcc;perf.aiAcc=0;updateNPCs(step);updateNpcSociety(step);updateEnemies(step);updateMultiplayer(step);}
      perf.cloudAcc+=dt;if(perf.cloudAcc>=1/15){const step=perf.cloudAcc;perf.cloudAcc=0;updateClouds(step);}
    }
    renderer.setScissorTest(false);renderer.setViewport(0,0,renderer.domElement.width,renderer.domElement.height);renderer.autoClear=true;renderer.render(scene,camera);
  }

  function setupControls(){
    const resetJoy=()=>{input.joyId=null;input.joyX=0;input.joyZ=0;els.joystickKnob.style.transform='translate(-50%,-50%)';};
    els.joystick.addEventListener('pointerdown',e=>{e.preventDefault();input.joyId=e.pointerId;els.joystick.setPointerCapture(e.pointerId);updateJoy(e);});
    els.joystick.addEventListener('pointermove',e=>{if(e.pointerId===input.joyId)updateJoy(e);});
    els.joystick.addEventListener('pointerup',resetJoy);els.joystick.addEventListener('pointercancel',resetJoy);
    function updateJoy(e){const r=els.joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,max=r.width*.32;let dx=e.clientX-cx,dy=e.clientY-cy;const mag=Math.hypot(dx,dy);if(mag>max){dx=dx/mag*max;dy=dy/mag*max;}input.joyX=dx/max;input.joyZ=-dy/max;els.joystickKnob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;}
    const press=(el,fn)=>el?.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fn();},{passive:false});
    press(els.jumpBtn,requestJump);press(els.actionBtn,doAction);
    const setTouchSprint=active=>{input.touchSprint=!!active;updateRunUI();};
    els.runBtn?.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();setTouchSprint(true);els.runBtn.setPointerCapture?.(e.pointerId);},{passive:false});
    ['pointerup','pointercancel','lostpointercapture'].forEach(type=>els.runBtn?.addEventListener(type,()=>setTouchSprint(false)));
    const adjustCamera=delta=>{cameraZoom=clamp(cameraZoom+delta,-4.5,9);state.settings.cameraZoom=+cameraZoom.toFixed(2);saveState();};
    press(els.cameraNearBtn,()=>adjustCamera(-1.6));press(els.cameraFarBtn,()=>adjustCamera(1.6));press(els.cameraResetBtn,()=>{cameraZoom=0;cameraPitch=.38;cameraYaw=currentHouse?0:player.facing;state.settings.cameraZoom=0;saveState();toast('Câmera centralizada.','good',900);});
    els.miniNav?.addEventListener('click',openMap);press(els.specialBtn,firePower);press(els.crouchBtn,()=>toggleCrouch());press(els.miniBtn,()=>setScaleMode('mini'));press(els.normalBtn,()=>setScaleMode('normal'));press(els.giantBtn,()=>setScaleMode('giant'));press(els.spinBtn,spinPlayer);
    [els.quickBar,els.inventoryBtn,els.buildBtn,els.mapBtn,els.gameSettingsBtn].forEach(el=>el?.addEventListener('pointerdown',e=>e.stopPropagation()));
    window.addEventListener('keydown',e=>{input.keys.add(e.code);if(['Space','KeyE','KeyF','KeyC','Digit1','Digit2','Digit3','KeyR','ShiftLeft','ShiftRight'].includes(e.code))e.preventDefault();updateRunUI();if(e.code==='Space')requestJump();if(e.code==='KeyE')doAction();if(e.code==='KeyF')firePower();if(e.code==='KeyC')toggleCrouch();if(e.code==='Digit1')setScaleMode('mini');if(e.code==='Digit2')setScaleMode('normal');if(e.code==='Digit3')setScaleMode('giant');if(e.code==='KeyR')spinPlayer();if(e.code==='Escape'){e.preventDefault();if(!running)return;if(pauseMenuOpen)closeModal();else if(!els.modal.hidden)closeModal();else openPauseMenu();}});window.addEventListener('keyup',e=>{input.keys.delete(e.code);updateRunUI();});
    els.stage.addEventListener('pointerdown',e=>{if(e.target!==renderer?.domElement)return;input.cameraDrag={id:e.pointerId,x:e.clientX,y:e.clientY};els.stage.setPointerCapture?.(e.pointerId);});
    els.stage.addEventListener('pointermove',e=>{const d=input.cameraDrag;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;cameraYaw-=dx*.006;cameraPitch=clamp(cameraPitch+dy*.003,.05,.9);d.x=e.clientX;d.y=e.clientY;});
    const endDrag=e=>{if(input.cameraDrag?.id===e.pointerId)input.cameraDrag=null;};els.stage.addEventListener('pointerup',endDrag);els.stage.addEventListener('pointercancel',endDrag);
    els.stage.addEventListener('wheel',e=>{if(!running||!els.modal.hidden)return;e.preventDefault();cameraZoom=clamp(cameraZoom+Math.sign(e.deltaY)*.9,-4.5,9);state.settings.cameraZoom=+cameraZoom.toFixed(2);},{passive:false});
  }
  let gamepadJump=false,gamepadAction=false,gamepadPower=false,gamepadCrouch=false,gamepadSize=false;
  function pollGamepad(){
    const gp=[...(navigator.getGamepads?.()||[])].find(Boolean);
    if(!gp){input.gamepadX=0;input.gamepadZ=0;input.gamepadActive=false;input.gamepadSprint=false;updateRunUI();return;}
    const ax=gp.axes[0]||0,az=-(gp.axes[1]||0);
    input.gamepadActive=Math.hypot(ax,az)>.16;input.gamepadX=input.gamepadActive?ax:0;input.gamepadZ=input.gamepadActive?az:0;input.gamepadSprint=!!(gp.buttons[10]?.pressed||gp.buttons[7]?.value>.45);updateRunUI();
    const jump=!!gp.buttons[0]?.pressed,action=!!gp.buttons[2]?.pressed,power=!!gp.buttons[1]?.pressed,crouch=!!gp.buttons[4]?.pressed,size=!!gp.buttons[5]?.pressed;
    if(jump&&!gamepadJump)requestJump();if(action&&!gamepadAction)doAction();if(power&&!gamepadPower)firePower();if(crouch&&!gamepadCrouch)toggleCrouch();if(size&&!gamepadSize)setScaleMode(player.scaleMode==='normal'?'mini':player.scaleMode==='mini'?'giant':'normal');
    gamepadJump=jump;gamepadAction=action;gamepadPower=power;gamepadCrouch=crouch;gamepadSize=size;
    const camX=gp.axes[2]||0;if(Math.abs(camX)>.18)cameraYaw-=camX*.035;const camY=gp.axes[3]||0;if(Math.abs(camY)>.18)cameraPitch=clamp(cameraPitch+camY*.018,.05,.9);
  }

  async function startGame(resetPosition=false){
    await dbReady;if(!hasValidPlayerName()){openPlayerNameModal(true,()=>startGame(resetPosition));return;}closeModal();showScreen('game');
    state.ui.quickOpen=false;state.ui.skillsOpen=false;state.ui.needsOpen=false;state.ui.missionOpen=false;syncMobilePanels();els.game.classList.remove('needs-expanded');els.missionCard.classList.remove('expanded');if(!scene){if(!initThree()){showScreen('lobby');return;}setupControls();}else{applyAvatarCustomization();}
    if(resetPosition){player.x=0;player.z=8;player.y=0;}else restorePosition();player.scaleMode=state.abilities?.scaleMode||'normal';player.crouched=!!state.abilities?.crouched;updateAbilityUI();running=true;paused=false;clock.start();evaluateMissions();updateHUD();updateContext(true);updateNavigation(0,true);resize(true);cancelAnimationFrame(raf);gameLoop();toast('Bem-vindo à Vila do Sol!','good',2200);
  }
  function stopGame(){
    if(player.vehicle)exitVehicle(true);running=false;paused=false;pauseMenuOpen=false;cancelAnimationFrame(raf);stopEngineSound();savePlayerPosition(true);showScreen('lobby');updateLobbyStats();
  }
  els.playBtn.onclick=()=>startGame(true);els.continueBtn.onclick=()=>startGame(false);

  function openPauseMenu(){
    if(!running||pauseMenuOpen)return;
    paused=true;pauseMenuOpen=true;if(engineAudio)stopEngineSound();openModal('Jogo pausado',`<div class="choice-grid"><button class="choice" data-resume><b>▶ Continuar</b><span>Voltar ao mundo</span></button><button class="choice" data-life><b>👤 Minha vida</b><span>Carreira, amizades e visual</span></button><button class="choice" data-home><b>🏠 Casa</b><span>Voltar para minha casa</span></button><button class="choice" data-menu><b>↩ Menu inicial</b><span>Salvar e sair</span></button></div>`,root=>{
      $('[data-resume]',root).onclick=()=>closeModal();
      $('[data-life]',root).onclick=()=>{pauseMenuOpen=false;paused=false;closeModal();if(player.vehicle)startEngineSound();openLifePanel();};
      $('[data-home]',root).onclick=()=>{pauseMenuOpen=false;paused=false;closeModal();returnHome();};
      $('[data-menu]',root).onclick=()=>{pauseMenuOpen=false;paused=false;closeModal();stopGame();};
    });
  }
  els.gameSettingsBtn.addEventListener('contextmenu',e=>e.preventDefault());

  function updateBridgeVisual(){world.bridgeParts.forEach((p,i)=>{p.visible=state.flags.bridgeFixed||i%2===0;});}


  function prepareVehicleTestArea(){
    if(currentHouse){
      const h=currentHouse;h.roof.visible=true;h.front.visible=true;h.door.visible=true;currentHouse=null;cameraMode='openworld';
    }
    if(player.vehicle)exitVehicle(true);
    clearMovementInputs();
    player.x=0;player.z=-70;player.y=groundHeightAt(0,-70);
    player.vx=0;player.vy=0;player.vz=0;player.grounded=true;player.sitUntil=0;
    player.facing=0;player.car.heading=0;player.car.speed=0;player.car.steerVisual=0;player.car.drift=0;player.car._prevSpeed=0;
    vehicleImpactCount=0;
    enterVehicle();
    return {x:player.x,z:player.z,active:player.vehicle,heading:player.car.heading};
  }
  function stepVehicleSimulation(frames=120,steer=.35,throttle=1){
    if(!player.vehicle)prepareVehicleTestArea();
    const count=clamp(Math.round(Number(frames)||120),1,600);
    const sx=clamp(Number(steer)||0,-1,1),sz=clamp(Number(throttle)||0,-1,1);
    const dt=1/60,startX=player.x,startZ=player.z,startImpacts=vehicleImpactCount;
    const wasPaused=paused;paused=true;
    for(let i=0;i<count;i++){
      updateVehiclePhysics(dt,sx,sz);
      const prevX=player.x,prevZ=player.z;
      player.x=clamp(player.x+player.vx*dt,-116,116);
      player.z=clamp(player.z+player.vz*dt,-116,116);
      resolveCollisions(prevX,prevZ);
      const ground=groundHeightAt(player.x,player.z);player.y=ground;player.vy=0;player.grounded=true;
    }
    playerGroup?.position?.set(player.x,player.y,player.z);
    paused=wasPaused;
    return {frames:count,seconds:count*dt,distance:Math.hypot(player.x-startX,player.z-startZ),speed:player.car.speed,x:player.x,z:player.z,impacts:vehicleImpactCount-startImpacts};
  }

  // Public test/audit API
  window.OTTHOS_TEST_API={
    version:'V625_RENDER_VOXEL_PREMIUM_SAFE',
    performance:()=>({fps:+perf.fps.toFixed(1),tier:qualityTier(),requested:requestedQuality(),dpr:renderer?.getPixelRatio?.()||0,drawCalls:renderer?.info?.render?.calls||0,triangles:renderer?.info?.render?.triangles||0}),
    getState:()=>JSON.parse(JSON.stringify(state)),
    getGame:()=>({running,paused,currentHouse:currentHouse?.id||null,cameraMode,player:{...player},objects:{houses:world.houses.length,npcs:world.npcs.length,enemies:world.enemies.length,interactables:world.interactables.length,builds:world.builds.length}}),
    getVisual:()=>{const parts=playerModel?.userData?.parts||{};const modelY=playerModel?.position?.y||0;const minFootY=playerModel?.userData?.minFootY??0;const scaleY=playerGroup?.scale?.y||1;const rootY=playerGroup?.position?.y||0;return {procedural:!!playerModel?.userData?.proceduralOtthos,rootY,modelY,minFootY,scaleY,visualBottom:rootY+(modelY+minFootY)*scaleY,limbs:{leftArm:parts.leftArm?.rotation?.x||0,rightArm:parts.rightArm?.rotation?.x||0,leftLeg:parts.leftLeg?.rotation?.x||0,rightLeg:parts.rightLeg?.rotation?.x||0}};},
    teleport:(x,z)=>{player.x=x;player.z=z;player.y=groundHeightAt(x,z);player.vx=player.vy=player.vz=0;player.grounded=true;updateContext(true);},
    getContext:()=>currentContext?{id:currentContext.id,label:currentContext.label,type:currentContext.type,activity:currentContext.activity||null}:null,
    getLastAction:()=>lastActionSource,
    action:()=>doAction(),
    jump:()=>requestJump(),
    fire:()=>firePower(),
    enterVehicle:()=>{enterVehicle();return player.vehicle;},
    prepareVehicleTest:prepareVehicleTestArea,
    exitVehicle:()=>{exitVehicle();return !player.vehicle;},
    setDriveInput:(steer=0,throttle=0)=>{input.virtualX=clamp(Number(steer)||0,-1,1);input.virtualZ=clamp(Number(throttle)||0,-1,1);input.virtualActive=Math.abs(input.virtualX)+Math.abs(input.virtualZ)>.001;resolveMovementInput();return {active:input.virtualActive,x:input.targetX,z:input.targetZ};},
    clearDriveInput:()=>{input.virtualX=0;input.virtualZ=0;input.virtualActive=false;resolveMovementInput();return {x:input.targetX,z:input.targetZ};},
    refreshInput:()=>resolveMovementInput(),
    stepVehicleSimulation,
    vehicle:()=>({active:player.vehicle,speed:player.car.speed,heading:player.car.heading,drift:player.car.drift,sitUntilRemaining:Math.max(0,player.sitUntil-performance.now()),driveInput:{x:input.x,z:input.z,targetX:input.targetX,targetZ:input.targetZ,virtualActive:input.virtualActive,joyX:input.joyX,joyZ:input.joyZ,gamepadActive:input.gamepadActive},playerVisible:playerModel?.visible!==false,accessoriesVisible:avatarLayer?.visible!==false,vehicleVisible:!!vehicleVisual?.visible,parkedVisible:world.vehicle?.group?.visible!==false,preVehicleAbilities:player.preVehicleAbilities?{...player.preVehicleAbilities}:null,specialLabel:$('span',els.specialBtn)?.textContent||'',fireballs:world.fireballs.length,engineActive:!!engineAudio,wheelCount:vehicleVisual?.userData?.wheels?.length||0,frontWheelCount:vehicleVisual?.userData?.frontWheels?.length||0,impactCount:vehicleImpactCount,rootScale:{x:playerGroup?.scale?.x||0,y:playerGroup?.scale?.y||0,z:playerGroup?.scale?.z||0}}),
    pause:()=>openPauseMenu(),
    crouch:()=>toggleCrouch(),
    setSize:setScaleMode,
    spin:spinPlayer,
    controls:()=>({crouch:!!els.crouchBtn,mini:!!els.miniBtn,normal:!!els.normalBtn,giant:!!els.giantBtn,spin:!!els.spinBtn,action:!!els.actionBtn,jump:!!els.jumpBtn,power:!!els.specialBtn}),
    race:()=>activeRace?{type:activeRace.type,npc:activeRace.npcName,playerScore:activeRace.playerScore,opponentScore:activeRace.opponentScore,timeLeft:activeRace.timeLeft}:null,
    startRace:(type='sprint')=>startRace(type,world.npcs[0]),
    map:()=>({player:{x:player.x,z:player.z},waypoint:state.waypoint,route:state.waypoint?buildRoutePoints(player,state.waypoint):[],locations:MAP_LOCATIONS.map(x=>({...x}))}),
    setWaypoint:id=>{setWaypoint(id);return state.waypoint;},
    clearWaypoint:()=>{state.waypoint=null;updateWaypointMarker();updateNavigation(0,true);return true;},
    camera:()=>({yaw:cameraYaw,pitch:cameraPitch,zoom:cameraZoom,mode:cameraMode}),
    setCameraZoom:value=>{cameraZoom=clamp(Number(value)||0,-4.5,9);state.settings.cameraZoom=cameraZoom;return cameraZoom;},
    sprint:active=>{input.touchSprint=!!active;updateRunUI();return sprintRequested();},
    joystickVector:(dx,dy)=>{input.joyX=clamp(dx,-1,1);input.joyZ=clamp(dy,-1,1);return resolveMovementInput();},
    enterHouseById:(id)=>{const h=world.houses.find(x=>x.id===id);if(!h)return false;enterHouse(h);return true;},
    exitHouse,
    returnHome,
    evaluateMissions,
    installReady:()=>!!deferredInstallPrompt,
    avatar:()=>({...state.avatar}),
    career:()=>({...state.career}),
    openAvatarStudio,
    openJobCenter,
    database:()=>({available:!!window.OTTHOS_DB,name:window.OTTHOS_DB?.name||null,schema:window.OTTHOS_DB?.schema||null,lastSaved:state.lastSaved,autoSaveMs:5000}),
    render:()=>({
      pixelRatio:renderer?.getPixelRatio?.()||0,
      drawCalls:renderer?.info?.render?.calls||0,
      triangles:renderer?.info?.render?.triangles||0,
      textureCount:renderer?.info?.memory?.textures||0,
      geometryCount:renderer?.info?.memory?.geometries||0,
      running,paused,currentHouse:currentHouse?.id||null,vehicleActive:!!player.vehicle,
      shadowMapEnabled:!!renderer?.shadowMap?.enabled,
      cloudCount:world.clouds?.length||0,
      fxParticleCount:(typeof fxParticles!=='undefined'?fxParticles.length:0),
      modelViewerDefined:!!(window.customElements&&customElements.get('model-viewer')),
      wheelFrontCount:vehicleVisual?.userData?.frontWheels?.length||0,
      wheelTotalCount:vehicleVisual?.userData?.wheels?.length||0
    }),
    navigation:()=>({waypoint:state.waypoint,route:world.routePath.map(p=>({...p})),progress:state.waypoint?routeProgressInfo(world.routePath,player):null}),
    sceneStability:()=>({critical:world.criticalSurfaces.length,hiddenCritical:world.criticalSurfaces.filter(m=>m&&!m.visible).length,frustumCulledCritical:world.criticalSurfaces.filter(m=>m?.frustumCulled).length,staticRenderObjects:world.staticRenderObjects||0,frustumEnabledStatic:(()=>{let n=0;worldGroup?.traverse?.(o=>{if((o.isMesh||o.isLine||o.isSprite)&&o.frustumCulled)n++;});return n;})(),mobile:perf.mobile,shadows:!!renderer?.shadowMap?.enabled}),
    mobileLayout:()=>({portrait:document.body.classList.contains('ui-portrait'),landscape:document.body.classList.contains('ui-landscape'),tiny:document.body.classList.contains('ui-tiny'),skillsOpen:!!state.ui.skillsOpen,quickOpen:!!state.ui.quickOpen}),
    playerIdentity:()=>({name:state.profile.name,confirmed:!!state.profile.nameConfirmed}),
    education:()=>({subjects:Object.keys(EDUCATION_SUBJECTS),summary:educationSummary(),learning:JSON.parse(JSON.stringify(state.learning)),stations:MAP_LOCATIONS.filter(x=>x.group==='Academia')}),
    educationRounds:(subject='math',level=1,seed=123)=>generateEducationRounds(subject,Number(level)||1,Number(seed)||123,5),
    multiplayer:()=>({local:window.OTTHOS_MULTIPLAYER||null,cloud:window.OTTHOS_RTDB?.status?.()||multiplayerState,challenges:pendingChallenges(),sessions:[...gameSessions.values()]})
  };

  updateLobbyStats();evaluateMissions();updateInstallUI();
})();
