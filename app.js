(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpAngle = (a, b, t) => { let d=((b-a+Math.PI)%(Math.PI*2))-Math.PI; if(d<-Math.PI)d+=Math.PI*2; return a+d*t; };
  const distance2D = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const APP_VERSION = 629;
  const STORAGE_KEY = 'otthos_life_world_roleplay_v629';
  const LEGACY_STORAGE_KEYS = ['otthos_life_world_roleplay_v628','otthos_life_world_roleplay_v627','otthos_life_world_roleplay_v626','otthos_life_world_roleplay_v625','otthos_life_world_roleplay_v624','otthos_life_world_roleplay_v623','otthos_life_world_roleplay_v622','otthos_life_world_roleplay_v621','otthos_life_world_roleplay_v620','otthos_life_world_roleplay_v619','otthos_life_world_roleplay_v618','otthos_life_world_roleplay_v617','otthos_life_world_roleplay_v616','otthos_life_world_roleplay_v615','otthos_life_world_roleplay_v614','otthos_life_world_roleplay_v613','otthos_life_world_roleplay_v612','otthos_life_world_roleplay_v611','otthos_life_world_roleplay_v610','otthos_life_world_roleplay_v609','otthos_life_world_roleplay_v608','otthos_life_world_roleplay_v607','otthos_life_world_roleplay_v606','otthos_life_world_roleplay_v605','otthos_life_world_roleplay_v604','otthos_life_world_roleplay_v603','otthos_life_world_roleplay_v602','otthos_life_world_roleplay_v601','otthos_life_world_complete_v600'];
  const safeLocalGet = key => { try { return window.localStorage?.getItem(key) ?? null; } catch { return null; } };
  const safeLocalSet = (key, value) => { try { window.localStorage?.setItem(key, value); return true; } catch { return false; } };
  const safeLocalRemove = key => { try { window.localStorage?.removeItem(key); return true; } catch { return false; } };

  const els = {
    lobby: $('#lobby'), game: $('#game'), stage: $('#stage'), screenTint: $('#screenTint'),
    playBtn: $('#playBtn'), continueBtn: $('#continueBtn'), installBtn: $('#installBtn'), installHint: $('#installHint'),
    arBtn: $('#arBtn'), quizBtn: $('#quizBtn'), collectionBtn: $('#collectionBtn'), avatarBtn: $('#avatarBtn'), accountBtn: $('#accountBtn'), moldsBtn: $('#moldsBtn'), howBtn: $('#howBtn'), settingsBtn: $('#settingsBtn'),
    lobbyLevel: $('#lobbyLevel'), lobbyCoins: $('#lobbyCoins'), lobbyRep: $('#lobbyRep'), lobbyMedals: $('#lobbyMedals'), lobbyPlayerName: $('#lobbyPlayerName'), profileNameBtn: $('#profileNameBtn'), accountStatusLabel: $('#accountStatusLabel'),
    hudLevel: $('#hudLevel'), xpFill: $('#xpFill'), xpText: $('#xpText'), hudCoins: $('#hudCoins'), hudPlayerName: $('#hudPlayerName'),
    needHunger: $('#needHunger'), needEnergy: $('#needEnergy'), needFun: $('#needFun'), needHygiene: $('#needHygiene'),
    missionChapter: $('#missionChapter'), missionTitle: $('#missionTitle'), missionStep: $('#missionStep'), missionFill: $('#missionFill'),
    quickToggleBtn: $('#quickToggleBtn'), quickBar: $('#quickBar'), needsToggleBtn: $('#needsToggleBtn'), missionCard: $('#missionCard'), avatarGameBtn: $('#avatarGameBtn'), inventoryBtn: $('#inventoryBtn'), buildBtn: $('#buildBtn'), toolsBtn: $('#toolsBtn'), mapBtn: $('#mapBtn'), dailyBtn: $('#dailyBtn'), onlineBtn: $('#onlineBtn'), gameSettingsBtn: $('#gameSettingsBtn'), multiplayerBadge: $('#multiplayerBadge'),
    contextPrompt: $('#contextPrompt'), contextIcon: $('#contextIcon'), contextLabel: $('#contextLabel'), contextHint: $('#contextHint'),
    joystick: $('#joystick'), joystickKnob: $('#joystickKnob'), runBtn: $('#runBtn'), specialBtn: $('#specialBtn'), actionBtn: $('#actionBtn'), jumpBtn: $('#jumpBtn'), crouchBtn: $('#crouchBtn'), miniBtn: $('#miniBtn'), normalBtn: $('#normalBtn'), giantBtn: $('#giantBtn'), spinBtn: $('#spinBtn'), skillsToggleBtn: $('#skillsToggleBtn'), secondaryActions: document.querySelector('.secondary-actions'),
    miniNav: $('#miniNav'), miniMapCanvas: $('#miniMapCanvas'), miniNavName: $('#miniNavName'), miniNavDistance: $('#miniNavDistance'), miniNavArrow: $('#miniNavArrow'),
    cameraControls: $('#cameraControls'), cameraNearBtn: $('#cameraNearBtn'), cameraResetBtn: $('#cameraResetBtn'), cameraFarBtn: $('#cameraFarBtn'),
    buildBadge: $('#buildBadge'), buildTypeLabel: $('#buildTypeLabel'), vehicleBadge: $('#vehicleBadge'), safetyPanel: $('#safetyPanel'), safetyStatus: $('#safetyStatus'), raceBadge: $('#raceBadge'), raceTitle: $('#raceTitle'), raceStatus: $('#raceStatus'), toast: $('#toast'),
    modal: $('#modal'), modalTitle: $('#modalTitle'), modalBody: $('#modalBody'), modalClose: $('#modalClose'), challengePrompt: $('#challengePrompt'), challengePromptKicker: $('#challengePromptKicker'), challengePromptTitle: $('#challengePromptTitle'), challengePromptText: $('#challengePromptText'), challengePromptAccept: $('#challengePromptAccept'), challengePromptDecline: $('#challengePromptDecline'),
    nativeViewer: $('#nativeViewer'), viewerShell: $('#viewerShell'), viewerPlaceholder: $('#viewerPlaceholder'), viewerLoadBtn: $('#viewerLoadBtn'), viewerStatus: $('#viewerStatus'), insideArBtn: $('#insideArBtn')
  };

  const defaultState = () => ({
    version: APP_VERSION,
    profile: { playerId: uid(), name: '', nameConfirmed: false, level: 1, xp: 0, coins: 500, reputation: 0 },
    needs: { hunger: 92, energy: 92, fun: 86, hygiene: 88 },
    inventory: { wood: 0, stone: 0, goldOre: 0, goldBar: 0, food: 2, water: 2, crystals: 0, blocks: 4, fences: 2, keys: 0, fishingRod: 1, bait: 5, rawFish: 0, cookedFish: 0, forestResources: 0 },
    homeStorage: { wood: 0, stone: 0, goldOre: 0, goldBar: 0, food: 0, water: 0, crystals: 0 },
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
    abilities: { scaleMode: 'normal', crouched: false, mastery: { miniDash:0, superJump:0, giantSlam:0, stealth:0, magnetSpin:0 } },
    tools: { owned: ['axe','pickaxe','bucket'], equipped: 'axe', harvested: { wood:0, stone:0, gold:0, water:0 } },
    account: { linked:false, accountId:'', username:'', lastCloudSync:0 },
    safety: { incidents:0, safeStops:0, lessons:0, lastIncident:0 },
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
    stats: { walked:0, driven:0, jumps:0, collected:0, talks:0, cooked:0, races:0, actions:0, metroTrips:0, busStops:0, skillCombos:0 },
    daily: { date:'', streak:0, lastDate:'', quests:[] },
    learning: { crowns:0, totalCorrect:0, lessons:{}, lastLesson:'', perfectLessons:0, subjectXP:{math:0,portuguese:0,english:0}, multiplayerWins:0, multiplayerPlayed:0, matchHistory:[] },
    multiplayer: { enabled:true, room:'mundo-publico', displayName:'', cloudUid:'', cloudReady:false },
    fishing: { catches: [], species: {}, lastAttempt: 0, cooperativeRewards: [] },
    campfires: [],
    boats: { activeBoatId: '', passengerOf: '', lastPosition: { x:-38, z:52, heading:0 } },
    transport: { metroTrips:0, metroDestinations:[], busStops:[], busTrips:0 },
    adventures: { completed:[], bestTimes:{}, active:null },
    hunting: { lastAttempt: 0, tracksFound: 0, successful: 0, failed: 0, cooperativeRewards: [] },
    houseExtensions: [],
    multiplayerRequests: { lastSentAt: 0, completed: [] },
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
      version: APP_VERSION,
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
      fishing: { ...fresh.fishing, ...(saved.fishing || {}), catches:Array.isArray(saved.fishing?.catches)?saved.fishing.catches:[], species:{...fresh.fishing.species,...(saved.fishing?.species||{})}, cooperativeRewards:Array.isArray(saved.fishing?.cooperativeRewards)?saved.fishing.cooperativeRewards:[] },
      campfires: Array.isArray(saved.campfires) ? saved.campfires : [],
      boats: { ...fresh.boats, ...(saved.boats || {}), lastPosition:{...fresh.boats.lastPosition,...(saved.boats?.lastPosition||{})} },
      hunting: { ...fresh.hunting, ...(saved.hunting || {}), cooperativeRewards:Array.isArray(saved.hunting?.cooperativeRewards)?saved.hunting.cooperativeRewards:[] },
      houseExtensions: Array.isArray(saved.houseExtensions) ? saved.houseExtensions : [],
      multiplayerRequests: { ...fresh.multiplayerRequests, ...(saved.multiplayerRequests || {}), completed:Array.isArray(saved.multiplayerRequests?.completed)?saved.multiplayerRequests.completed:[] },
      npcSociety: { ...fresh.npcSociety, ...(saved.npcSociety || {}), houses:{...fresh.npcSociety.houses,...(saved.npcSociety?.houses||{})}, friendships:{...fresh.npcSociety.friendships,...(saved.npcSociety?.friendships||{})}, moods:{...fresh.npcSociety.moods,...(saved.npcSociety?.moods||{})} },
      avatar: { ...fresh.avatar, ...(saved.avatar || {}) },
      career: { ...fresh.career, ...(saved.career || {}) },
      social: { ...fresh.social, ...(saved.social || {}) },
      abilities: { ...fresh.abilities, ...(saved.abilities || {}), mastery:{...fresh.abilities.mastery,...(saved.abilities?.mastery||{})} },
      tools: { ...fresh.tools, ...(saved.tools || {}), owned:Array.isArray(saved.tools?.owned)?saved.tools.owned:fresh.tools.owned, harvested:{...fresh.tools.harvested,...(saved.tools?.harvested||{})} },
      account: { ...fresh.account, ...(saved.account || {}) },
      safety: { ...fresh.safety, ...(saved.safety || {}) },
      transport: { ...fresh.transport, ...(saved.transport || {}), metroDestinations:Array.isArray(saved.transport?.metroDestinations)?saved.transport.metroDestinations:[], busStops:Array.isArray(saved.transport?.busStops)?saved.transport.busStops:[] },
      adventures: { ...fresh.adventures, ...(saved.adventures || {}), active:null, completed:Array.isArray(saved.adventures?.completed)?saved.adventures.completed:[], bestTimes:{...fresh.adventures.bestTimes,...(saved.adventures?.bestTimes||{})} },
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
  let accountSession = window.OTTHOS_ACCOUNT?.getSession?.() || null;
  if(accountSession){
    state.account={...(state.account||{}),linked:true,accountId:accountSession.accountId,username:accountSession.username||state.account?.username||''};
  }
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
        if(accountSession)state.account={...(state.account||{}),linked:true,accountId:accountSession.accountId,username:accountSession.username||state.account?.username||''};
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
    state.version = APP_VERSION;
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
    lastSavePromise.finally(()=>{syncCloudProgress(false);syncGameAccount(false);});
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
      version: APP_VERSION,lastSaved:Number(state.lastSaved||Date.now()),
      profile:{name:state.profile.name||'Jogador',coins:state.profile.coins||0,xp:state.profile.xp||0,level:state.profile.level||1,reputation:state.profile.reputation||0},
      inventory:{...state.inventory},medals:[...(state.medals||[])],flags:{...state.flags},houses:{...state.houses},races:{...state.races},
      avatar:{...state.avatar},abilities:{...state.abilities,mastery:{...(state.abilities?.mastery||{})}},tools:{...state.tools,owned:[...(state.tools?.owned||[])],harvested:{...(state.tools?.harvested||{})}},safety:{...state.safety},builds:[...(state.builds||[])],homeStorage:{...state.homeStorage},fishing:{...state.fishing,catches:[...(state.fishing?.catches||[])],species:{...(state.fishing?.species||{})}},campfires:[...(state.campfires||[])],boats:{...state.boats,lastPosition:{...(state.boats?.lastPosition||{})}},transport:{...state.transport,metroDestinations:[...(state.transport?.metroDestinations||[])],busStops:[...(state.transport?.busStops||[])]},adventures:{...state.adventures,completed:[...(state.adventures?.completed||[])],bestTimes:{...(state.adventures?.bestTimes||{})}},hunting:{...state.hunting},houseExtensions:[...(state.houseExtensions||[])],
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
      avatar:{...state.avatar,...(remote.avatar||{})},abilities:{...state.abilities,...(remote.abilities||{}),mastery:{...state.abilities.mastery,...(remote.abilities?.mastery||{})}},tools:{...state.tools,...(remote.tools||{}),owned:Array.isArray(remote.tools?.owned)?remote.tools.owned:state.tools.owned,harvested:{...state.tools.harvested,...(remote.tools?.harvested||{})}},safety:{...state.safety,...(remote.safety||{})},
      builds:Array.isArray(remote.builds)?remote.builds:state.builds,homeStorage:{...state.homeStorage,...(remote.homeStorage||{})},fishing:{...state.fishing,...(remote.fishing||{}),catches:Array.isArray(remote.fishing?.catches)?remote.fishing.catches:state.fishing.catches,species:{...state.fishing.species,...(remote.fishing?.species||{})}},campfires:Array.isArray(remote.campfires)?remote.campfires:state.campfires,boats:{...state.boats,...(remote.boats||{}),lastPosition:{...state.boats.lastPosition,...(remote.boats?.lastPosition||{})}},transport:{...state.transport,...(remote.transport||{}),metroDestinations:Array.isArray(remote.transport?.metroDestinations)?remote.transport.metroDestinations:state.transport.metroDestinations,busStops:Array.isArray(remote.transport?.busStops)?remote.transport.busStops:state.transport.busStops},adventures:{...state.adventures,...(remote.adventures||{}),completed:Array.isArray(remote.adventures?.completed)?remote.adventures.completed:state.adventures.completed,bestTimes:{...state.adventures.bestTimes,...(remote.adventures?.bestTimes||{})}},hunting:{...state.hunting,...(remote.hunting||{})},houseExtensions:Array.isArray(remote.houseExtensions)?remote.houseExtensions:state.houseExtensions,
      stats:{...state.stats,...(remote.achievements?.stats||{})},daily:{...state.daily,...(remote.achievements?.daily||{})},learning:{...state.learning,...(remote.achievements?.learning||{}),subjectXP:{...state.learning.subjectXP,...(remote.achievements?.learning?.subjectXP||{})},lessons:{...state.learning.lessons,...(remote.achievements?.learning?.lessons||{})}},
      position:{...state.position,...(remote.position||{})},lastSaved:remoteSaved,version: APP_VERSION
    };
    state=normalizeState(merged);state.profile.nameConfirmed=true;state.multiplayer.room='mundo-publico';
    safeLocalSet(STORAGE_KEY,JSON.stringify(state));window.OTTHOS_DB?.save?.(state).catch(()=>{});updatePlayerNameUI();updateHUD();updateLobbyStats();toast('Progresso recuperado do Firebase.','good',2300);return true;
  }

  let accountSaveTimer=0,accountSyncing=false;
  function accountLinked(){return!!(accountSession&&state.account?.linked&&state.account.accountId===accountSession.accountId);}
  function accountStatusText(){return accountLinked()?`Conta: ${state.account.username||accountSession.username}`:state.account?.linked?'Entrar novamente':'Conta local';}
  async function waitForAccountBackend(timeout=6500){
    if(window.OTTHOS_RTDB)return window.OTTHOS_RTDB;
    return new Promise(resolve=>{
      let done=false;
      const finish=value=>{if(done)return;done=true;clearTimeout(timer);window.removeEventListener('otthos:rtdb-ready',ready);resolve(value);};
      const ready=()=>finish(window.OTTHOS_RTDB||null),timer=setTimeout(()=>finish(window.OTTHOS_RTDB||null),timeout);
      window.addEventListener('otthos:rtdb-ready',ready,{once:true});
    });
  }
  async function ensureAccountConnection(){
    const backend=await waitForAccountBackend();
    if(!backend?.configured)return{ok:false,error:'A nuvem do jogo ainda não está configurada.'};
    if(backend.connected?.())return{ok:true,backend};
    const ok=await backend.connect?.({name:state.profile.name||'Jogador'});
    return ok?{ok:true,backend}:{ok:false,error:'Sem conexão. O progresso local continua protegido neste aparelho.'};
  }
  function syncGameAccount(force=false){
    clearTimeout(accountSaveTimer);
    if(!accountLinked()||accountSyncing)return false;
    const run=async()=>{
      if(!accountLinked()||accountSyncing)return false;
      const connection=await ensureAccountConnection();if(!connection.ok)return false;
      const cloudAccount=connection.backend.accountStatus?.();
      if(!cloudAccount||cloudAccount.anonymous||cloudAccount.username!==accountSession.username)return false;
      accountSyncing=true;
      try{
        const snapshot=JSON.parse(JSON.stringify(state));
        snapshot.account={...snapshot.account,linked:true,accountId:accountSession.accountId,username:accountSession.username};
        const encrypted=await window.OTTHOS_ACCOUNT.encryptState(snapshot,accountSession);
        const result=await connection.backend.saveGameAccount(accountSession.accountId,encrypted);
        if(result?.ok)state.account.lastCloudSync=Date.now();
        return!!result?.ok;
      }catch(error){console.warn('Conta do jogo:',error);return false}
      finally{accountSyncing=false}
    };
    if(force)return run();
    accountSaveTimer=setTimeout(run,2400);return true;
  }
  async function createGameAccount(displayName,username,password){
    if(!window.OTTHOS_ACCOUNT)throw new Error('Proteção de conta indisponível neste navegador.');
    const cleanName=sanitizePlayerName(displayName);if(cleanName.length<3)throw new Error('Escolha um nome de jogador com pelo menos 3 caracteres.');
    const credentials=await window.OTTHOS_ACCOUNT.deriveCredentials(username,password),connection=await ensureAccountConnection();
    if(!connection.ok)throw new Error(connection.error);
    const authResult=await connection.backend.createPlayerAccount?.(credentials.username,password,cleanName);
    if(!authResult?.ok)throw new Error(authResult?.error||'Não foi possível criar a conta protegida.');
    applyPlayerName(cleanName);accountSession=window.OTTHOS_ACCOUNT.rememberSession(credentials);
    state.account={linked:true,accountId:credentials.accountId,username:credentials.username,lastCloudSync:0};
    await commitState();const saved=await syncGameAccount(true);if(!saved)throw new Error('A conta foi criada, mas a primeira cópia online não terminou. Tente sincronizar novamente.');
    updatePlayerNameUI();return true;
  }
  async function loginGameAccount(username,password){
    if(!window.OTTHOS_ACCOUNT)throw new Error('Proteção de conta indisponível neste navegador.');
    const credentials=await window.OTTHOS_ACCOUNT.deriveCredentials(username,password),connection=await ensureAccountConnection();
    if(!connection.ok)throw new Error(connection.error);
    const authResult=await connection.backend.signInPlayerAccount?.(credentials.username,password,state.profile.name||credentials.username);
    if(!authResult?.ok)throw new Error(authResult?.error||'Nome ou senha incorretos.');
    const result=await connection.backend.loadGameAccount(credentials.accountId);
    if(!result?.ok)throw new Error(result?.error||'Não foi possível consultar a conta.');
    if(!result.exists)throw new Error('A conta existe, mas ainda não possui uma cópia de progresso. Entre no aparelho onde ela foi criada e toque em “Sincronizar agora”.');
    const recovered=await window.OTTHOS_ACCOUNT.decryptState(result.record,credentials);
    accountSession=window.OTTHOS_ACCOUNT.rememberSession(credentials);
    state=normalizeState(recovered);state.account={...(state.account||{}),linked:true,accountId:credentials.accountId,username:credentials.username,lastCloudSync:Date.now()};
    state.profile.nameConfirmed=!!sanitizePlayerName(state.profile.name);
    safeLocalSet(STORAGE_KEY,JSON.stringify(state));await window.OTTHOS_DB?.save?.(state);window.OTTHOS_RTDB?.setDisplayName?.(state.profile.name||'Jogador');
    updatePlayerNameUI();updateHUD();updateLobbyStats();return true;
  }
  async function unlinkGameAccount(){
    await window.OTTHOS_RTDB?.signOutPlayerAccount?.().catch?.(()=>{});
    window.OTTHOS_ACCOUNT?.clearSession?.();accountSession=null;state.account={linked:false,accountId:'',username:'',lastCloudSync:0};saveState(true);updatePlayerNameUI();
  }
  function openAccountForm(mode='create',required=false,onReady=null){
    const creating=mode==='create';
    openModal(creating?'Criar conta do jogo':'Entrar na conta',`<div class="account-form"><div class="account-shield">🔐</div><p>${creating?'Um responsável pode ajudar. A senha não é gravada; ela protege o progresso antes de enviá-lo.':'Use o mesmo usuário e senha cadastrados no outro aparelho.'}</p>${creating?'<label class="field"><span>Nome que aparece no jogo</span><input data-account-display maxlength="18" autocomplete="nickname" value="'+escapeHtml(state.profile.name||'')+'" placeholder="Ex.: Luna"></label>':''}<label class="field"><span>Usuário da conta</span><input data-account-user maxlength="20" autocapitalize="none" autocomplete="username" spellcheck="false" placeholder="Ex.: luna_azul"></label><label class="field"><span>Senha</span><input data-account-password type="password" maxlength="64" autocomplete="${creating?'new-password':'current-password'}" placeholder="Mínimo de 6 caracteres"></label>${creating?'<label class="field"><span>Repita a senha</span><input data-account-confirm type="password" maxlength="64" autocomplete="new-password"></label>':''}<p class="account-error" data-account-error hidden></p><button class="btn primary xl" data-account-submit>${creating?'Criar e proteger progresso':'Entrar e recuperar progresso'}</button><button class="btn" data-account-back>Voltar</button></div>`,root=>{
      const submit=$('[data-account-submit]',root),error=$('[data-account-error]',root),user=$('[data-account-user]',root),password=$('[data-account-password]',root);
      const showError=message=>{error.textContent=message;error.hidden=false;submit.disabled=false;submit.textContent=creating?'Criar e proteger progresso':'Entrar e recuperar progresso';};
      submit.onclick=async()=>{error.hidden=true;const pass=password.value;if(creating&&pass!==$('[data-account-confirm]',root).value){showError('As duas senhas precisam ser iguais.');return;}submit.disabled=true;submit.textContent=creating?'Criando conta...':'Recuperando...';try{if(creating)await createGameAccount($('[data-account-display]',root).value,user.value,pass);else await loginGameAccount(user.value,pass);closeModal();toast(creating?'Conta criada e progresso protegido.':'Progresso recuperado com sucesso.','good',2600);if(typeof onReady==='function')onReady();else if(!creating)setTimeout(()=>location.reload(),550);}catch(e){showError(e.message||'Não foi possível concluir.');}};
      $('[data-account-back]',root).onclick=()=>openAccountCenter(required,onReady);setTimeout(()=>user.focus(),80);
    });
  }
  function openAccountCenter(required=false,onReady=null){
    const linked=accountLinked(),last=Number(state.account?.lastCloudSync||0),lastText=last?new Date(last).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'aguardando primeira cópia';
    openModal(linked?'Minha conta':'Proteja seu progresso',linked?`<div class="account-card linked"><span>✓</span><div><b>${escapeHtml(state.account.username||accountSession.username)}</b><small>Progresso criptografado • última cópia ${lastText}</small></div></div><div class="modal-actions"><button class="btn primary" data-account-sync>Sincronizar agora</button><button class="btn" data-account-logout>Sair da conta neste aparelho</button></div>`:`<div class="account-intro"><span>☁️</span><h3>Continue em qualquer celular</h3><p>Crie uma conta do jogo ou entre com a combinação cadastrada. Não informe telefone, endereço, escola ou nome completo.</p></div><div class="choice-grid"><button class="choice" data-account-create><b>🔐 Criar conta</b><span>Protege o progresso atual</span></button><button class="choice" data-account-login><b>🔑 Entrar</b><span>Recupera conquistas antigas</span></button>${required?'<button class="choice muted" data-account-offline><b>📱 Jogar neste aparelho</b><span>O progresso continuará salvo localmente</span></button>':''}</div>`,root=>{
      $('[data-account-create]',root)?.addEventListener('click',()=>openAccountForm('create',required,onReady));$('[data-account-login]',root)?.addEventListener('click',()=>openAccountForm('login',required,onReady));
      $('[data-account-sync]',root)?.addEventListener('click',async e=>{e.currentTarget.disabled=true;e.currentTarget.textContent='Sincronizando...';const ok=await syncGameAccount(true);closeModal();toast(ok?'Progresso sincronizado.':'Sem conexão agora; a cópia local foi preservada.',ok?'good':'warn',2400);});
      $('[data-account-logout]',root)?.addEventListener('click',async()=>{if(await confirmModal('Sair da conta','O progresso continuará neste aparelho e na cópia protegida.','Sair','Cancelar')){await unlinkGameAccount();toast('Conta desconectada deste aparelho.','good');}});
      $('[data-account-offline]',root)?.addEventListener('click',()=>openPlayerNameModal(true,()=>{state.flags.accountPromptedV629=true;saveState(true);if(typeof onReady==='function')onReady();}));
    });
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
    clearExtensionPreview();
    if (typeof fishingSession !== 'undefined' && fishingSession) cancelFishingSession();
    else if (typeof fishingVisual !== 'undefined' && fishingVisual?.active) stopFishingVisual();
    const resumePausedGame = pauseMenuOpen;
    els.modal.hidden = true;
    els.modal.classList.remove('map-modal','fishing-modal');
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
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js?v=629').catch(console.warn));
  updateInstallUI();


  const DAILY_QUEST_POOL=[
    {id:'walk',icon:'👟',title:'Explorador da Vila',target:180,reward:90,xp:50,label:n=>`${Math.floor(n)}/180 m caminhando`},
    {id:'drive',icon:'🚗',title:'Piloto da Vila',target:260,reward:120,xp:70,label:n=>`${Math.floor(n)}/260 m dirigindo`},
    {id:'jump',icon:'⬆',title:'Pula-pula',target:12,reward:70,xp:45,label:n=>`${Math.floor(n)}/12 pulos`},
    {id:'collect',icon:'💎',title:'Caçador de Tesouros',target:5,reward:95,xp:60,label:n=>`${Math.floor(n)}/5 itens coletados`},
    {id:'talk',icon:'💬',title:'Amigo da Vizinhança',target:3,reward:80,xp:50,label:n=>`${Math.floor(n)}/3 conversas`},
    {id:'cook',icon:'🍳',title:'Chef da Vila',target:1,reward:75,xp:45,label:n=>`${Math.floor(n)}/1 refeição`},
    {id:'race',icon:'🏁',title:'Competidor',target:1,reward:130,xp:80,label:n=>`${Math.floor(n)}/1 corrida concluída`},
    {id:'metro',icon:'Ⓜ️',title:'Rede Metropolitana',target:2,reward:110,xp:65,label:n=>`${Math.floor(n)}/2 viagens de metrô`},
    {id:'bus',icon:'🚌',title:'Passageiro da Cidade',target:3,reward:105,xp:60,label:n=>`${Math.floor(n)}/3 paradas de ônibus`},
    {id:'skill',icon:'✨',title:'Mestre das Skills',target:3,reward:120,xp:75,label:n=>`${Math.floor(n)}/3 skills avançadas`}
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

  let cinematicEmoteTimer=0;
  function startCinematicEmote(type,duration=2800){
    if(!['dance','play','selfie','highfive','hug'].includes(type))return;clearTimeout(cinematicEmoteTimer);document.body.classList.add('cinematic-emote');cinematicEmoteTimer=setTimeout(()=>document.body.classList.remove('cinematic-emote'),Math.max(900,duration));
  }
  function triggerEmote(type,npc=null){
    const duration=type==='selfie'?5200:type==='dance'?3200:2400;startCinematicEmote(type,duration);player.emoteType=type;player.emoteUntil=performance.now()+duration;player.emoteSeq=(player.emoteSeq||0)+1;
    if(npc){npc.emoteType=type;npc.emoteUntil=performance.now()+duration;}
    if(['dance','play','selfie','highfive','hug'].includes(type)){
      const token=String(performance.now());triggerEmote.cinemaToken=token;document.body.classList.add('social-moment');
      setTimeout(()=>{if(triggerEmote.cinemaToken===token)document.body.classList.remove('social-moment');},duration+180);
    }
    if(type==='play')state.needs.fun=clamp(state.needs.fun+8,0,100);
    const msg={wave:'Acenou!',dance:'Hora da dança!',play:'Hora de brincar!',selfie:'Selfie da amizade!',highfive:'Toca aqui!',hug:'Abraço de amizade!'};toast(msg[type]||'Ação social!','good',1100);beep(type==='highfive'?820:type==='play'?700:620,55);vibrate(15);addXP(3);
  }

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
    openModal('Minha vida', `<div class="roleplay-card"><small>CARREIRA</small><h3>${c.title}</h3><p>Nível ${c.level} • ${c.xp} XP profissional • ${c.completed} trabalhos</p></div><div class="choice-grid"><button class="choice" data-life-avatar><b>👕 Meu personagem</b><span>Roupas e acessórios</span></button><button class="choice" data-life-jobs><b>💼 Trabalhos</b><span>Ganhe moedas e reputação</span></button><button class="choice" data-life-adventures><b>🏰 Desafios da cidade</b><span>Castelo, metrô, ônibus e skills</span></button><button class="choice" data-life-transit><b>Ⓜ️ Rede de transporte</b><span>Estações, linhas e progresso</span></button></div><h3>Amizades</h3><div class="friend-list">${friendships}</div>`, root => {
      $('[data-life-avatar]', root).onclick = openAvatarStudio;
      $('[data-life-jobs]', root).onclick = openJobCenter;
      $('[data-life-adventures]', root).onclick = openAdventureHub;
      $('[data-life-transit]', root).onclick = openTransitGuide;
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
      <div class="choice"><b>◱ Mini</b><span>Entre em espaços pequenos; toque novamente para usar o Dash Mini.</span></div>
      <div class="choice"><b>N Normal</b><span>Volta ao tamanho padrão; toque novamente para o Super Pulo.</span></div>
      <div class="choice"><b>⬡ Grande</b><span>Abra portões; toque novamente para o Impacto Gigante.</span></div>
      <div class="choice"><b>↻ Giro Ímã</b><span>Atrai cristais e afasta monstros próximos.</span></div>
      <div class="choice"><b>⬆ Pular</b><span>Pulo rápido com peso. Use nas plataformas e corridas.</span></div>
      <div class="choice"><b>🔥 Poder</b><span>Lança fogo contra monstros de fantasia.</span></div>
      <div class="choice"><b>🏃 Ginásio</b><span>Dispute corridas e desafios pega-moedas com os vizinhos.</span></div>
      <div class="choice"><b>Ⓜ️ Metrô</b><span>Entre em uma estação e escolha qualquer destino do mapa.</span></div>
      <div class="choice"><b>🚌 Ônibus</b><span>Embarque nas paradas, percorra a linha e peça a próxima parada.</span></div>
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
    },
    {
      id: 'transit', title: 'Cidade conectada', chapter: 'CAPÍTULO 8 — TRANSPORTE E CASTELO', reward: { coins: 720, medal: 'Guardião da Cidade' },
      steps: [
        ['usedMetro', 'Viaje de metrô para um ponto do mapa.'],
        ['rodeBus', 'Embarque e desembarque em uma linha de ônibus.'],
        ['castleChallenge', 'Conclua um desafio no castelo.']
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
  function updatePlayerNameUI(){const name=hasValidPlayerName()?state.profile.name:'Escolher nome';if(els.lobbyPlayerName)els.lobbyPlayerName.textContent=name;if(els.hudPlayerName)els.hudPlayerName.textContent=hasValidPlayerName()?state.profile.name:'Jogador';if(els.accountStatusLabel)els.accountStatusLabel.textContent=accountStatusText();const menu=$('#avatarMenuName'),quick=$('#avatarQuickName');if(menu)menu.textContent=`Meu ${playerDisplayName()}`;if(quick)quick.textContent=playerDisplayName();const homeLoc=MAP_LOCATIONS?.find?.(x=>x.id==='home');if(homeLoc)homeLoc.name=`Casa de ${playerDisplayName()}`;const homeHouse=world?.houses?.find?.(x=>x.id==='home');if(homeHouse)homeHouse.name=`Casa de ${playerDisplayName()}`;updateLocalPlayerNameLabel?.();}
  function applyPlayerName(name){const clean=sanitizePlayerName(name);if(clean.length<3){toast('Digite um nome com pelo menos 3 caracteres.','warn',2200);return false;}state.profile.name=clean;state.profile.nameConfirmed=true;state.multiplayer.displayName=clean;updatePlayerNameUI();saveState(true);window.OTTHOS_RTDB?.setDisplayName?.(clean);if(running)window.OTTHOS_RTDB?.publish?.({name:clean,x:player.x,y:player.y,z:player.z,r:player.facing,vehicle:!!player.vehicle,vehicleId:player.car.id||'',vehicleRole:player.vehicle?(player.car.passengerOf?'passenger':'driver'):'',vehiclePassengerOf:player.car.passengerOf||'',vehiclePassengerUid:player.car.passengerUid||'',vehiclePassengerBotId:player.car.passengerBotId||'',boating:!!player.boating,boatId:state.boats.activeBoatId||'',boatRole:player.boating?(player.boat.passengerOf?'passenger':'driver'):'',passengerOf:player.boat.passengerOf||'',boatPassengerUid:player.boat.passengerUid||'',boatPassengerBotId:player.boat.passengerBotId||'',scaleMode:player.scaleMode,crouched:!!player.crouched,color:0x5ad8ff},true);return true;}
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
      <div class="inventory-item"><b>🪵 ${inv.wood}</b><span>Madeira</span></div><div class="inventory-item"><b>🪨 ${inv.stone}</b><span>Pedra</span></div><div class="inventory-item"><b>🟨 ${inv.goldOre||0}</b><span>Minério de ouro</span></div><div class="inventory-item"><b>🏅 ${inv.goldBar||0}</b><span>Barra de ouro</span></div><div class="inventory-item"><b>🍎 ${inv.food}</b><span>Comida</span></div><div class="inventory-item"><b>💧 ${inv.water}</b><span>Água</span></div><div class="inventory-item"><b>💎 ${inv.crystals}</b><span>Cristais</span></div><div class="inventory-item"><b>🧱 ${inv.blocks}</b><span>Blocos</span></div><div class="inventory-item"><b>🪵 ${inv.fences}</b><span>Cercas</span></div><div class="inventory-item"><b>🪙 ${state.profile.coins}</b><span>Moedas</span></div>
      <div class="inventory-item"><b>🎣 ${inv.fishingRod||0}</b><span>Vara de pesca</span></div><div class="inventory-item"><b>🪱 ${inv.bait||0}</b><span>Iscas</span></div><div class="inventory-item"><b>🐟 ${inv.rawFish||0}</b><span>Peixe cru</span></div><div class="inventory-item"><b>🍽️ ${inv.cookedFish||0}</b><span>Peixe assado</span></div><div class="inventory-item"><b>🌿 ${inv.forestResources||0}</b><span>Recursos da floresta</span></div>
    </div><div class="modal-actions"><button class="btn primary" data-open-tools>Ferramentas</button>${inv.cookedFish>0?'<button class="btn" data-eat-cooked>Comer peixe assado</button>':''}</div>`,root=>{$('[data-open-tools]',root)?.addEventListener('click',openToolbelt);$('[data-eat-cooked]',root)?.addEventListener('click',()=>{if((state.inventory.cookedFish||0)<1)return;state.inventory.cookedFish--;state.needs.hunger=clamp(state.needs.hunger+32,0,100);state.needs.energy=clamp(state.needs.energy+6,0,100);saveState(true);updateHUD();toast('Peixe assado consumido.','good');openInventory();});});
  }

  const TOOL_DEFS={
    axe:{icon:'🪓',name:'Machado',description:'Corta árvores e coleta madeira.'},
    pickaxe:{icon:'⛏️',name:'Picareta',description:'Extrai pedra e minério de ouro.'},
    bucket:{icon:'🪣',name:'Balde',description:'Retira água limpa do poço.'}
  };
  function equippedTool(){return TOOL_DEFS[state.tools?.equipped]||TOOL_DEFS.axe;}
  function equipTool(id){
    if(!TOOL_DEFS[id]||!state.tools.owned.includes(id))return false;state.tools.equipped=id;saveState(true);refreshEquippedToolVisual();if(els.toolsBtn){els.toolsBtn.firstChild.textContent=TOOL_DEFS[id].icon;$('span',els.toolsBtn).textContent=TOOL_DEFS[id].name;}toast(`${TOOL_DEFS[id].name} equipado.`,'good',1200);return true;
  }
  function openToolbelt(){
    openModal('Ferramentas',`<div class="tool-grid">${Object.entries(TOOL_DEFS).map(([id,tool])=>`<button class="tool-card ${state.tools.equipped===id?'active':''}" data-equip-tool="${id}"><span>${tool.icon}</span><b>${tool.name}</b><small>${tool.description}</small><em>${state.tools.equipped===id?'Em uso':'Equipar'}</em></button>`).join('')}</div><div class="resource-summary"><span>🪵 ${state.tools.harvested.wood||0}</span><span>🪨 ${state.tools.harvested.stone||0}</span><span>🟨 ${state.tools.harvested.gold||0}</span><span>💧 ${state.tools.harvested.water||0}</span></div>`,root=>{$$('[data-equip-tool]',root).forEach(btn=>btn.onclick=()=>{equipTool(btn.dataset.equipTool);closeModal();});});
  }
  function refreshEquippedToolVisual(){
    if(!playerModel?.userData?.parts?.rightArm)return;
    const arm=playerModel.userData.parts.rightArm;if(toolVisual){arm.remove(toolVisual);toolVisual=null;}
    toolVisual=new THREE.Group();toolVisual.position.set(0,-1.12,.14);toolVisual.rotation.z=-.18;arm.add(toolVisual);
    const type=state.tools?.equipped||'axe',wood=materials.wood||0x8c542c,metal=materials.metal||0x8d9aa6;
    if(type==='bucket'){
      const bucket=new THREE.Mesh(new THREE.CylinderGeometry(.24,.18,.38,10,1,true),metal);bucket.position.y=-.16;toolVisual.add(bucket);const handle=new THREE.Mesh(new THREE.TorusGeometry(.24,.025,6,12,Math.PI),renderMat(0x53606c,{metalness:.5,roughness:.35}));handle.position.y=.05;handle.rotation.z=Math.PI;toolVisual.add(handle);
    }else{
      box(.11,.92,.11,wood,0,-.16,0,toolVisual);
      if(type==='axe'){box(.48,.3,.14,metal,.17,.25,0,toolVisual);box(.18,.18,.17,metal,-.13,.25,0,toolVisual);}
      else{box(.72,.16,.16,metal,0,.25,0,toolVisual);box(.16,.28,.16,metal,-.3,.14,0,toolVisual);box(.16,.28,.16,metal,.3,.14,0,toolVisual);}
    }
    toolVisual.visible=!player.vehicle&&!player.boating&&!player.transit.mode;
  }
  function playToolAnimation(){player.emoteType='tool';player.emoteUntil=performance.now()+620;player.emoteSeq=(player.emoteSeq||0)+1;beep(state.tools.equipped==='pickaxe'?180:260,55,'triangle');vibrate(16);}

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

  const METRO_STATIONS = [
    { id:'central', name:'Estação Central', x:-12, z:5, navX:-12, navZ:11, line:'Linha Solar' },
    { id:'academia', name:'Estação Academia', x:13, z:-40, navX:13, navZ:-40, line:'Linha Solar' },
    { id:'floresta', name:'Estação Floresta', x:-62, z:-34, navX:-62, navZ:-34, line:'Linha Verde' },
    { id:'lago', name:'Estação Lago', x:-25, z:59, navX:-25, navZ:59, line:'Linha Verde' },
    { id:'castelo', name:'Estação Castelo', x:71, z:49, navX:71, navZ:49, line:'Linha Real' },
    { id:'ginásio', name:'Estação Ginásio', x:63, z:80, navX:63, navZ:80, line:'Linha Real' }
  ];
  const MAP_LOCATIONS = [
    { id:'home', name:`Casa de ${playerDisplayName()}`, icon:'🏠', x:0, z:18, navX:0, navZ:23.3, group:'Casa' },
    { id:'village', name:'Praça da Vila', icon:'🏘', x:0, z:0, group:'Vila' },
    { id:'blue', name:'Casa Azul', icon:'🏡', x:-25, z:17, navX:-25, navZ:22.3, group:'Casas' },
    { id:'pink', name:'Casa Rosa', icon:'🏡', x:25, z:17, navX:25, navZ:22.3, group:'Casas' },
    { id:'shop', name:'Mercadinho', icon:'🛒', x:-22, z:-18, navX:-22, navZ:-12.7, group:'Serviços' },
    { id:'workshop', name:'Oficina', icon:'🛠', x:22, z:-18, navX:22, navZ:-12.7, group:'Serviços' },
    { id:'school', name:'Escola Vila do Sol', icon:'🏫', x:-68, z:-18, navX:-60, navZ:-12, group:'Serviços' },
    { id:'school-east', name:'Escola Horizonte', icon:'🏫', x:78, z:24, navX:68, navZ:18, group:'Serviços' },
    { id:'police', name:'Posto de Segurança', icon:'🛡️', x:68, z:-18, navX:60, navZ:-12, group:'Serviços' },
    { id:'well', name:'Poço da Vila', icon:'🪣', x:38, z:10, navX:38, navZ:10, group:'Recursos' },
    { id:'mine', name:'Mina Dourada', icon:'⛏️', x:-92, z:-92, navX:-84, navZ:-86, group:'Recursos' },
    { id:'forest', name:'Floresta', icon:'🌲', x:-88, z:-42, navX:-82, navZ:-35, group:'Exploração' },
    { id:'lake', name:'Represa / Lago', icon:'🌊', x:-36, z:52, navX:-27, navZ:52, group:'Água e Natureza' },
    { id:'pier', name:'Píer do Lago', icon:'🛶', x:-29, z:52, navX:-25, navZ:52, group:'Água e Natureza' },
    { id:'fishing', name:'Área de Pesca', icon:'🎣', x:-31, z:45, navX:-25, navZ:45, group:'Água e Natureza' },
    { id:'camp', name:'Acampamento', icon:'🔥', x:-70, z:-62, navX:-62, navZ:-55, group:'Floresta e Campo' },
    { id:'hunt', name:'Área de Rastreamento', icon:'🐾', x:-98, z:-72, navX:-88, navZ:-65, group:'Floresta e Campo' },
    { id:'cabin', name:'Cabana da Floresta', icon:'🛖', x:-88, z:-42, navX:-82, navZ:-35, group:'Floresta e Campo' },
    { id:'home-extension', name:'Ampliação da Casa', icon:'🧰', x:9, z:24, navX:7, navZ:26, group:'Casa' },
    { id:'crystal', name:'Vale dos Cristais', icon:'💎', x:70, z:-60, group:'Desafios' },
    { id:'garage', name:'Garagem e Fazenda', icon:'🚗', x:52, z:48, navX:48, navZ:43, group:'Trabalho' },
    ...METRO_STATIONS.map(s=>({id:`metro-${s.id}`,name:s.name,icon:'Ⓜ️',x:s.x,z:s.z,navX:s.navX,navZ:s.navZ,group:'Transporte'})),
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
  let mapSelectedId='';
  function mapMarkerPlacements(locations,playerPoint,mapWidth=0,mapHeight=0){
    const portrait=window.matchMedia?.('(orientation: portrait)')?.matches??(innerHeight>=innerWidth);
    const lowLandscape=!portrait&&innerHeight<=600;
    const width=Math.max(220,Number(mapWidth)||Math.min(760,Math.max(280,innerWidth-(portrait?24:300))));
    const height=Math.max(150,Number(mapHeight)||Math.min(620,Math.max(180,innerHeight-(portrait?430:110))));
    // Usa o maior diâmetro visual (selecionado/ativo), evitando colisão também após o toque.
    const markerDiameter=portrait?36:(lowLandscape?34:38),safeGapPx=markerDiameter+4;
    const gapX=safeGapPx/width*100,gapY=safeGapPx/height*100;
    const playerGapX=(markerDiameter+15)/width*100,playerGapY=(markerDiameter+15)/height*100;
    const edgeX=(markerDiameter/2+5)/width*100,edgeY=(markerDiameter/2+5)/height*100;
    const minLeft=clamp(edgeX,3.5,11),maxLeft=100-minLeft,minTop=clamp(edgeY,4.5,16),maxTop=100-minTop;
    const points=locations.map((loc,index)=>{const pos=worldToMap(loc.navX??loc.x,loc.navZ??loc.z);return{loc,index,originLeft:pos.left,originTop:pos.top,left:clamp(pos.left,minLeft,maxLeft),top:clamp(pos.top,minTop,maxTop)};});
    const separate=(a,b,requiredX,requiredY,pushBoth=true)=>{
      let dx=b.left-a.left,dy=b.top-a.top,nx=dx/requiredX,ny=dy/requiredY,d=Math.hypot(nx,ny);
      if(d>=1)return false;
      if(d<.001){const angle=((a.index+1)*2.399963229728653+(b.index+1)*.731);nx=Math.cos(angle);ny=Math.sin(angle);d=1;}
      else{nx/=d;ny/=d;}
      const force=(1-d)+(pushBoth?.018:.035),mx=nx*requiredX*force,my=ny*requiredY*force;
      if(pushBoth){a.left-=mx*.5;a.top-=my*.5;b.left+=mx*.5;b.top+=my*.5;}
      else{b.left+=mx;b.top+=my;}
      return true;
    };
    const playerAnchor={index:-7,left:playerPoint.left,top:playerPoint.top};
    for(let pass=0;pass<72;pass++){
      let moved=false;
      for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)moved=separate(points[i],points[j],gapX,gapY,true)||moved;
      for(const point of points){
        moved=separate(playerAnchor,point,playerGapX,playerGapY,false)||moved;
        // Atrai suavemente para a posição real, sem desfazer a separação obtida.
        if(pass>38){point.left+=(point.originLeft-point.left)*.006;point.top+=(point.originTop-point.top)*.006;}
        point.left=clamp(point.left,minLeft,maxLeft);point.top=clamp(point.top,minTop,maxTop);
      }
      if(!moved&&pass>10)break;
    }
    return points;
  }
  function applyMapMarkerPlacements(root,placements){
    placements.forEach(({loc,left,top})=>{
      const marker=$(`[data-map-marker="${loc.id}"]`,root);if(!marker)return;
      marker.style.left=`${left.toFixed(2)}%`;marker.style.top=`${top.toFixed(2)}%`;
      marker.dataset.labelX=left<18?'left':left>82?'right':'center';
      marker.dataset.labelY=top>80?'above':'below';
    });
  }
  function mapSelectionMarkup(id){
    const loc=MAP_LOCATIONS.find(x=>x.id===id);if(!loc)return'<div class="map-selection empty"><b>Toque em um ícone</b><span>O nome aparecerá aqui antes de iniciar a rota.</span></div>';
    return`<div class="map-selection"><b>${loc.icon} ${loc.name}</b><span>${mapDistance(loc)} m de distância</span><button class="btn primary compact" data-route-selected="${loc.id}">Ir para este local</button></div>`;
  }
  function setWaypoint(id){
    const point=MAP_LOCATIONS.find(p=>p.id===id);if(!point)return;
    state.waypoint={id:point.id,name:point.name,x:point.x,z:point.z,navX:point.navX??point.x,navZ:point.navZ??point.z,arrived:false};world.routePath=buildRoutePoints(player,state.waypoint);
    updateWaypointMarker();updateNavigation(0,true);saveState(true);closeModal();toast(`Destino marcado: ${point.name} • siga as setas azuis`,'good',2600);
  }
  function clearWaypoint(){ state.waypoint=null; updateWaypointMarker(); updateNavigation(0,true); saveState(true); closeModal(); toast('Destino removido.','good'); }
  function openMap(){
    const pp=worldToMap(player.x,player.z),angleDeg=(Math.PI-(player.facing||0))*180/Math.PI,activeId=state.waypoint?.id||'',route=state.waypoint?(world.routePath.length?world.routePath:buildRoutePoints(player,state.waypoint)):[],routeInfo=state.waypoint?routeProgressInfo(route,player):null;
    if(!mapSelectedId||!MAP_LOCATIONS.some(x=>x.id===mapSelectedId))mapSelectedId=activeId||'home';
    const placements=mapMarkerPlacements(MAP_LOCATIONS,pp);
    const markers=placements.map(({loc,left,top})=>{const active=loc.id===activeId?' active':'',selected=loc.id===mapSelectedId?' selected':'';return `<button class="map-marker clean${active}${selected}" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%" data-map-marker="${loc.id}" aria-label="${loc.name}" title="${loc.name}"><b>${loc.icon}</b><span>${loc.name}</span></button>`;}).join('');
    const grouped=[...new Set(MAP_LOCATIONS.map(x=>x.group))].map(group=>{const items=MAP_LOCATIONS.filter(x=>x.group===group).sort((a,b)=>mapDistance(a)-mapDistance(b)).map(loc=>`<button class="map-destination ${loc.id===activeId?'active':''}" data-waypoint="${loc.id}"><b>${loc.icon}<em>${loc.name}</em></b><span>${mapDistance(loc)} m</span></button>`).join('');return `<section class="map-destination-group"><h4>${group}</h4><div>${items}</div></section>`;}).join('');
    const current=state.waypoint?`<div class="gps-current"><small>ROTA ATUAL</small><b>${state.waypoint.name}</b><span>${Math.round(routeInfo.remaining)} m • ${routeInfo.instruction}</span><button class="btn danger" data-clear-waypoint>Cancelar</button></div>`:`<div class="gps-current empty"><b>Para onde vamos?</b><span>Escolha um lugar no mapa ou na lista.</span></div>`;
    openModal('Mapa',`<div class="map-layout v626"><div class="map-main"><div class="world-map clean-map"><i class="map-road horizontal"></i><i class="map-road vertical"></i><i class="map-road west"></i><i class="map-road east"></i><i class="map-river"></i><div class="map-region forest">FLORESTA</div><div class="map-region city">VILA</div><div class="map-region adventure">AVENTURA</div>${route.length?routeSvgMarkup(route):''}${markers}<span class="player-dot" style="left:${pp.left}%;top:${pp.top}%;--player-angle:${angleDeg}deg"><i></i><b>VOCÊ</b></span><span class="map-north">N</span></div>${current}<div id="mapSelection">${mapSelectionMarkup(mapSelectedId)}</div></div><aside class="map-sidebar"><h3>Escolha um lugar</h3><div class="map-destinations grouped">${grouped}</div></aside></div>`,root=>{
      const refitMarkers=()=>{const map=$('.clean-map',root);if(!map)return;const rect=map.getBoundingClientRect();applyMapMarkerPlacements(root,mapMarkerPlacements(MAP_LOCATIONS,pp,rect.width,rect.height));};
      requestAnimationFrame(()=>{refitMarkers();requestAnimationFrame(refitMarkers);});
      $$('[data-waypoint]',root).forEach(btn=>btn.onclick=()=>setWaypoint(btn.dataset.waypoint));
      $('[data-clear-waypoint]',root)?.addEventListener('click',clearWaypoint);
      const selection=$('#mapSelection',root);
      const bindRoute=()=>{$('[data-route-selected]',selection)?.addEventListener('click',e=>setWaypoint(e.currentTarget.dataset.routeSelected));};bindRoute();
      $$('[data-map-marker]',root).forEach(btn=>btn.onclick=()=>{mapSelectedId=btn.dataset.mapMarker;$$('[data-map-marker]',root).forEach(x=>x.classList.toggle('selected',x.dataset.mapMarker===mapSelectedId));selection.innerHTML=mapSelectionMarkup(mapSelectedId);bindRoute();});
    });els.modal.classList.add('map-modal');
  }
  let mapResizeTimer=0;
  function refreshOpenMapAfterResize(){if(els.modal.hidden||!els.modal.classList.contains('map-modal'))return;clearTimeout(mapResizeTimer);mapResizeTimer=setTimeout(()=>{if(!els.modal.hidden&&els.modal.classList.contains('map-modal'))openMap();},180);}
  window.addEventListener('resize',refreshOpenMapAfterResize,{passive:true});window.addEventListener('orientationchange',refreshOpenMapAfterResize,{passive:true});

  function performLocalReset(){
    window.OTTHOS_ACCOUNT?.clearSession?.();accountSession=null;safeLocalRemove(STORAGE_KEY);LEGACY_STORAGE_KEYS.forEach(safeLocalRemove);return window.OTTHOS_DB?.clear?.();
  }
  function openFinalResetConfirmation(inGame=false){
    openModal('Confirmação final',`<div class="parent-gate"><span>⚠️</span><h3>Esta ação reinicia somente este aparelho</h3><p>Uma conta sincronizada poderá recuperar o progresso. Para continuar, digite <b>APAGAR</b>.</p><label class="field"><span>Confirmação</span><input data-reset-word maxlength="6" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="APAGAR"></label><p data-reset-error class="account-error" hidden>Digite APAGAR exatamente.</p><button class="btn danger" data-reset-confirm>Recomeçar neste aparelho</button><button class="btn" data-reset-cancel>Cancelar</button></div>`,root=>{
      const input=$('[data-reset-word]',root),confirm=async()=>{if(String(input.value||'').trim().toUpperCase()!=='APAGAR'){$('[data-reset-error]',root).hidden=false;input.select();return;}if(!(await confirmModal('Última confirmação','Tem certeza de que deseja reiniciar os dados locais deste aparelho?','Sim, recomeçar','Cancelar')))return;await performLocalReset();state=defaultState();await commitState();location.reload();};
      $('[data-reset-confirm]',root).onclick=confirm;$('[data-reset-cancel]',root).onclick=()=>openParentTools(inGame);input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();confirm();}};setTimeout(()=>input.focus(),80);
    });
  }
  function openParentTools(inGame=false){
    openModal('Área dos responsáveis',`<div class="parent-area"><div class="parent-area-heading"><span>🛡️</span><div><b>Backup e dados do jogo</b><small>Área protegida e fora da interface infantil.</small></div></div><div class="choice-grid"><button class="choice" data-parent-export><b>📤 Exportar backup</b><span>Baixar uma cópia do progresso</span></button><button class="choice" data-parent-import><b>📥 Importar backup</b><span>Substitui os dados deste aparelho</span></button><button class="choice danger-zone" data-parent-reset><b>🗑️ Recomeçar neste aparelho</b><span>Exige senha, palavra APAGAR e confirmação final</span></button></div><input data-parent-import-file type="file" accept="application/json" hidden><div class="modal-actions"><button class="btn" data-parent-back>Voltar às configurações</button></div></div>`,root=>{
      $('[data-parent-export]',root).onclick=()=>window.OTTHOS_DB?.exportFile(state);
      const fileInput=$('[data-parent-import-file]',root);$('[data-parent-import]',root).onclick=()=>fileInput.click();
      fileInput.onchange=async()=>{const file=fileInput.files?.[0];if(!file)return;try{const imported=normalizeState(await window.OTTHOS_DB.importFile(file));if(!(await confirmModal('Importar backup','O progresso atual deste aparelho será substituído pelo arquivo escolhido. Continuar?','Importar','Cancelar')))return;state=imported;await window.OTTHOS_DB.save(state);safeLocalSet(STORAGE_KEY,JSON.stringify(state));location.reload();}catch(error){toast(error.message||'Backup inválido.','bad');}};
      $('[data-parent-reset]',root).onclick=()=>openFinalResetConfirmation(inGame);$('[data-parent-back]',root).onclick=()=>openSettings(inGame);
    });
  }
  function openParentGate(inGame=false){
    if(accountLinked()){
      openModal('Acesso de responsável',`<div class="parent-gate"><span>🛡️</span><h3>Confirme a senha da conta</h3><p>Esta área contém backup e reinício do aparelho.</p><label class="field"><span>Senha da conta</span><input data-parent-password type="password" maxlength="64" autocomplete="current-password"></label><p data-parent-gate-error class="account-error" hidden></p><button class="btn primary xl" data-parent-unlock>Continuar</button><button class="btn" data-parent-cancel>Cancelar</button></div>`,root=>{
        const input=$('[data-parent-password]',root),error=$('[data-parent-gate-error]',root),unlock=async()=>{const btn=$('[data-parent-unlock]',root);btn.disabled=true;btn.textContent='Confirmando...';const result=await window.OTTHOS_RTDB?.reauthenticateAccount?.(input.value);if(!result?.ok){error.textContent=result?.error||'Senha incorreta.';error.hidden=false;btn.disabled=false;btn.textContent='Continuar';input.select();return;}openParentTools(inGame);};
        $('[data-parent-unlock]',root).onclick=unlock;$('[data-parent-cancel]',root).onclick=()=>openSettings(inGame);input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();unlock();}};setTimeout(()=>input.focus(),80);
      });return;
    }
    const a=7+Math.floor(Math.random()*5),b=5+Math.floor(Math.random()*4),answer=a*b;
    openModal('Acesso de responsável',`<div class="parent-gate"><span>🛡️</span><h3>Peça ajuda a um adulto</h3><p>Para abrir backup e reinício, responda:</p><label class="field"><span>Quanto é ${a} × ${b}?</span><input data-parent-answer inputmode="numeric" pattern="[0-9]*" maxlength="3" autocomplete="off"></label><p data-parent-gate-error class="account-error" hidden>Resposta incorreta.</p><button class="btn primary xl" data-parent-unlock>Continuar</button><button class="btn" data-parent-cancel>Cancelar</button></div>`,root=>{const input=$('[data-parent-answer]',root),unlock=()=>{if(Number(input.value)!==answer){$('[data-parent-gate-error]',root).hidden=false;input.select();return;}openParentTools(inGame);};$('[data-parent-unlock]',root).onclick=unlock;$('[data-parent-cancel]',root).onclick=()=>openSettings(inGame);input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();unlock();}};setTimeout(()=>input.focus(),80);});
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
      <div class="settings-row"><div><b>Nome público</b><small>${hasValidPlayerName()?state.profile.name:'Ainda não definido'}</small></div><button class="btn compact" data-player-name-settings>Editar</button></div>
      <div class="settings-row"><div><b>Conta do jogo</b><small>${accountStatusText()}</small></div><button class="btn compact" data-account-settings>Abrir</button></div>
      <div class="settings-row"><div><b>Mundo online</b><small id="mpSettingsStatus">${multiplayerStatusText()}</small></div><button class="btn compact" data-multiplayer-config>Abrir online</button></div>
    </div><div class="modal-actions">
      <button class="btn primary" data-save-now>Salvar agora</button>
      ${installOption}
      ${inGame ? '<button class="btn" data-home>Voltar para casa</button><button class="btn" data-exit>Sair para o menu</button>' : ''}
      <button class="btn subtle parent-access-btn" data-parent-area>🛡️ Área dos responsáveis</button>
    </div>`, root => {
      $('[data-player-name-settings]',root)?.addEventListener('click',()=>openPlayerNameModal(false,()=>openSettings(inGame)));$('[data-account-settings]',root)?.addEventListener('click',()=>openAccountCenter(false));$('[data-multiplayer-config]',root)?.addEventListener('click',openMultiplayerConfig);
      $$('[data-toggle]', root).forEach(btn => btn.onclick = () => {
        const key = btn.dataset.toggle;
        if (key === 'quality') state.settings.quality = requestedQuality() === 'auto' ? 'high' : requestedQuality() === 'high' ? 'low' : 'auto';
        else state.settings[key] = !state.settings[key];
        saveState(true); closeModal(); applyQuality(); openSettings(inGame);
      });
      $('[data-save-now]',root).onclick=async()=>{ if(running) savePlayerPosition(true); else await commitState(); toast('Progresso salvo no celular.','good'); closeModal(); };
      const install=$('[data-install]',root);if(install)install.onclick=installApp;
      const home = $('[data-home]', root); if (home) home.onclick = () => { closeModal(); returnHome(); };
      const exit = $('[data-exit]', root); if (exit) exit.onclick = () => { closeModal(); stopGame(); };
      $('[data-parent-area]',root).onclick=()=>openParentGate(inGame);
    });
  }


  els.quizBtn.onclick = () => openEducationHub('math');
  els.challengePromptAccept.onclick=()=>{if(promptSocialRequestId)acceptIncomingSocialRequest(promptSocialRequestId);else if(promptChallengeId)acceptIncomingChallenge(promptChallengeId);else if(promptSessionId){const s=gameSessions.get(promptSessionId);if(s)launchSessionWithCountdown(s);}};
  els.challengePromptDecline.onclick=()=>{if(promptSocialRequestId)declineIncomingSocialRequest(promptSocialRequestId);else if(promptChallengeId)declineIncomingChallenge(promptChallengeId);else closeChallengePrompt();};
  els.collectionBtn.onclick = openCollection;
  els.avatarBtn.onclick = openAvatarStudio;
  els.accountBtn.onclick = () => openAccountCenter(false);
  els.moldsBtn.onclick = openMolds;
  els.howBtn.onclick = openHow;
  els.settingsBtn.onclick = () => openSettings(false);els.multiplayerBadge.onclick=openSocialHub;els.profileNameBtn.onclick=()=>openPlayerNameModal(false);
  els.avatarGameBtn.onclick = openLifePanel;
  els.inventoryBtn.onclick = openInventory;
  els.toolsBtn.onclick = openToolbelt;
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
  [els.avatarGameBtn,els.inventoryBtn,els.buildBtn,els.toolsBtn,els.mapBtn,els.dailyBtn,els.onlineBtn,els.gameSettingsBtn].forEach(btn => btn?.addEventListener('click', () => { state.ui.quickOpen=false; els.quickBar.hidden=true; els.quickToggleBtn.classList.remove('active'); }));
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
  let scene, camera, renderer, clock, worldGroup, playerGroup, playerModel, playerMixer, avatarLayer, contactShadow, vehicleVisual, toolVisual, sunLight;
  let running = false, paused = false, pauseMenuOpen = false, raf = 0, cameraYaw = 0, cameraPitch = .38, cameraZoom = Number(state.settings?.cameraZoom || 0), cameraMode = 'openworld';
  let currentHouse = null, buildMode = null, currentContext = null, lastContextId = '', lastActionSource = 'none', actionLockedUntil = 0, activeRace = null, lastContextScanAt = 0, lastContextScanX = Infinity, lastContextScanZ = Infinity;
  const player = { x: 0, y: 0, z: 8, vx: 0, vy: 0, vz: 0, facing: Math.PI, grounded: true, vehicle: false, sitUntil: 0, lastGrounded: 0, jumpBuffer: 0, attackUntil: 0, damageUntil: 0, shieldUntil:0, skillDashUntil:0, scaleMode: state.abilities?.scaleMode || 'normal', crouched: !!state.abilities?.crouched, spinUntil: 0, preVehicleAbilities: null, hornUntil: 0, emoteUntil:0, emoteType:'', emoteSeq:0, boating:false, transit:{mode:'',busId:'',requestStop:false,metroUntil:0}, boat:{heading:0,speed:0,steerVisual:0,passengerOf:'',passengerUid:'',passengerBotId:'',hostMissingAt:0}, car: { id:'', kind:'car', label:'Carro', heading: Math.PI, speed: 0, steerVisual: 0, drift: 0, _prevSpeed: 0, passengerOf:'', passengerUid:'', passengerBotId:'', hostMissingAt:0 } };
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
    bridgeParts: [], secretChest: null, vehicle: null, vehicles:[], buses:[], busStops:[], metroStations:[], policeCars:[], policeAlert:null, school:null, policeStation:null, mine:null, well:null, deliveryPoint: null, raceCoins: [], waypointMarker: null, gym: null, routeGuide: null, routeArrows: [], routeLastBuild: 0, routeLastX: Infinity, routeLastZ: Infinity, routePath: [], navCache: new Map(), landmarks: [], outlines: [], glows: [], criticalSurfaces: [], boat:null, campfires:[], animals:[], houseExtensions:[], remoteCampfires:new Map(), remoteExtensions:new Map(), challengeTokens:[], activeChallenge:null, activityAcc:0
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
  const skillCooldowns={miniDash:0,superJump:0,giantSlam:0,stealth:0,magnetSpin:0};
  const skillButtons={miniDash:()=>els.miniBtn,superJump:()=>els.normalBtn,giantSlam:()=>els.giantBtn,stealth:()=>els.crouchBtn,magnetSpin:()=>els.spinBtn};
  function skillReady(id){const left=Math.max(0,Number(skillCooldowns[id]||0)-performance.now());if(left>0){toast(`Skill recarregando: ${Math.ceil(left/1000)} s.`,'warn',1200);return false;}return true;}
  function recordAdvancedSkill(id,cooldownMs){
    skillCooldowns[id]=performance.now()+cooldownMs;
    state.abilities.mastery[id]=(state.abilities.mastery[id]||0)+1;
    state.stats.skillCombos=(state.stats.skillCombos||0)+1;trackDaily('skill',1);advanceAdventure('skills',id);saveState();updateAbilityUI();
    for(let elapsed=1000;elapsed<=cooldownMs+50;elapsed+=1000)setTimeout(updateAbilityUI,elapsed);setTimeout(updateAbilityUI,cooldownMs+60);
  }
  function collectCrystal(c,message='Cristal coletado!'){
    if(!c||c.got)return false;c.got=true;c.mesh.visible=false;state.inventory.crystals++;state.stats.collected++;trackDaily('collect',1);addXP(15);addCoins(5);toast(message,'good');beep(880);vibrate(20);evaluateMissions();checkActiveJob();saveState();return true;
  }
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
    if(!els.modal.hidden||paused||player.vehicle||player.boating||player.transit.mode)return;
    if (!['mini','normal','giant'].includes(mode)) return;
    if(mode===player.scaleMode){
      if(mode==='mini'){
        if(!skillReady('miniDash'))return;player.skillDashUntil=performance.now()+1250;recordAdvancedSkill('miniDash',4200);toast('Dash Mini ativado!','good',1400);beep(760,70,'sine');
      }else if(mode==='normal'){
        if(!player.grounded){toast('Pouse antes de usar o Super Pulo.','warn');return;}if(!skillReady('superJump'))return;state.stats.jumps++;trackDaily('jump',1);player.vy=15;player.grounded=false;recordAdvancedSkill('superJump',4600);toast('Super Pulo!','good',1300);beep(820,80,'sine');vibrate(24);
      }else{
        if(!skillReady('giantSlam'))return;player.damageUntil=performance.now()+900;for(const enemy of world.enemies)if(!enemy.dead&&distance2D(player,enemy.group.position)<5.4)damageEnemy(enemy,2);for(let i=0;i<9;i++){const a=i/9*Math.PI*2;spawnDust(player.x+Math.sin(a)*1.8,player.z+Math.cos(a)*1.8);}recordAdvancedSkill('giantSlam',6000);toast('Impacto Gigante!','good',1500);beep(125,130,'sawtooth');vibrate([45,25,60]);
      }
      return;
    }
    player.scaleMode = mode;
    player.crouched = false;
    state.abilities.scaleMode = mode;
    state.abilities.crouched = false;
    updateAbilityUI(); saveState(true);
    toast(mode === 'mini' ? 'Modo mini: entre em passagens pequenas.' : mode === 'giant' ? 'Modo grande: força para desafios pesados.' : 'Tamanho normal.', 'good');
  }
  function toggleCrouch(force) {
    if(!els.modal.hidden||paused||player.vehicle||player.boating||player.transit.mode)return;
    if(typeof force!=='boolean'&&player.crouched){
      if(!skillReady('stealth')){player.crouched=false;state.abilities.crouched=false;updateAbilityUI();saveState();return;}player.crouched=false;state.abilities.crouched=false;player.shieldUntil=performance.now()+5000;recordAdvancedSkill('stealth',8000);toast('Escudo Furtivo: protegido por 5 s.','good',1800);beep(610,90,'sine');return;
    }
    player.crouched = typeof force === 'boolean' ? force : !player.crouched;
    state.abilities.crouched = player.crouched;
    updateAbilityUI(); saveState();
    toast(player.crouched ? `${playerDisplayName()} abaixou.` : `${playerDisplayName()} levantou.`, 'good');
  }
  function spinPlayer(){
    if(!els.modal.hidden||paused||player.vehicle||player.boating||player.transit.mode||!skillReady('magnetSpin'))return;
    player.spinUntil=performance.now()+980;let pulled=0;
    for(const c of world.crystals)if(!c.got&&Math.hypot(player.x-c.x,player.z-c.z)<6){collectCrystal(c,'Cristal atraído pelo Giro Ímã!');pulled++;}
    for(const enemy of world.enemies)if(!enemy.dead&&distance2D(player,enemy.group.position)<4.6){damageEnemy(enemy,1);const a=Math.atan2(enemy.group.position.x-player.x,enemy.group.position.z-player.z);enemy.group.position.x+=Math.sin(a)*1.4;enemy.group.position.z+=Math.cos(a)*1.4;}
    recordAdvancedSkill('magnetSpin',5200);addXP(3+pulled);beep(430,80,'sine');toast(pulled?`Giro Ímã: ${pulled} cristal(is)!`:'Giro Ímã ativado!','good',1500);
  }
  function updateAbilityUI(){
    els.crouchBtn?.classList.toggle('active',player.crouched);
    els.miniBtn?.classList.toggle('active',player.scaleMode==='mini');
    els.normalBtn?.classList.toggle('active',player.scaleMode==='normal');
    els.giantBtn?.classList.toggle('active',player.scaleMode==='giant');
    for(const [id,getButton] of Object.entries(skillButtons)){const btn=getButton(),left=Math.max(0,skillCooldowns[id]-performance.now());btn?.classList.toggle('cooldown',left>0);if(btn)btn.dataset.cooldown=left>0?String(Math.ceil(left/1000)):'';}
    els.crouchBtn?.classList.toggle('shielded',performance.now()<player.shieldUntil);
  }

  function canvasTexture(kind, colors) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const ctx = c.getContext('2d');
    let seed=[kind,...colors].join('|').split('').reduce((value,char)=>(value*31+char.charCodeAt(0))>>>0,2166136261);
    const rand=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
    const pick=()=>colors[1+Math.floor(rand()*Math.max(1,colors.length-1))]||colors[0];
    ctx.imageSmoothingEnabled=false;ctx.fillStyle = colors[0]; ctx.fillRect(0, 0, 256, 256);
    if (kind === 'grass') {
      for (let i = 0; i < 720; i++) { ctx.fillStyle=pick();const x=rand()*256,y=rand()*256;ctx.fillRect(x,y,2+rand()*7,2+rand()*7);if(i%9===0)ctx.fillRect(x+2,y-5,2,8); }
      ctx.fillStyle='rgba(15,65,22,.14)';for(let i=0;i<95;i++)ctx.fillRect(rand()*256,rand()*256,12+rand()*26,2);
    } else if (kind === 'road') {
      for (let i=0;i<260;i++){ctx.fillStyle=pick();ctx.globalAlpha=.18+rand()*.2;ctx.fillRect(rand()*256,rand()*256,2+rand()*7,1+rand()*4);}ctx.globalAlpha=1;
      ctx.strokeStyle='rgba(10,16,23,.22)';ctx.lineWidth=2;for(let i=0;i<8;i++){const x=rand()*256,y=rand()*256;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+10+rand()*22,y-5+rand()*10);ctx.lineTo(x+18+rand()*28,y+rand()*20);ctx.stroke();}
    } else if (kind === 'wood') {
      for(let x=0;x<256;x+=48){ctx.fillStyle=x%96?colors[0]:pick();ctx.fillRect(x,0,47,256);ctx.fillStyle='rgba(255,238,190,.12)';ctx.fillRect(x+3,0,3,256);ctx.fillStyle='rgba(50,22,8,.25)';ctx.fillRect(x+45,0,3,256);}
      ctx.strokeStyle='rgba(66,31,13,.28)';ctx.lineWidth=2;for(let i=0;i<28;i++){const x=rand()*256;ctx.beginPath();ctx.moveTo(x,0);ctx.bezierCurveTo(x+8,65,x-7,150,x+4,256);ctx.stroke();}
      for(let i=0;i<9;i++){ctx.strokeStyle='rgba(58,28,13,.35)';ctx.strokeRect(rand()*245,rand()*245,5+rand()*9,3+rand()*6);}
    } else if (kind === 'brick') {
      ctx.fillStyle=colors[1];ctx.fillRect(0,0,256,256);for(let y=0;y<256;y+=42){const offset=(y/42)%2?32:0;for(let x=-64+offset;x<256;x+=64){ctx.fillStyle=rand()>.5?colors[0]:pick();ctx.fillRect(x+3,y+3,58,36);ctx.fillStyle='rgba(255,255,255,.10)';ctx.fillRect(x+5,y+5,54,3);}}
    } else if (kind === 'sidewalk') {
      ctx.strokeStyle='rgba(54,66,80,.22)';ctx.lineWidth=4;for(let y=0;y<=256;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke();}for(let x=0;x<=256;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,256);ctx.stroke();}
      for(let i=0;i<150;i++){ctx.fillStyle=pick();ctx.globalAlpha=.16;ctx.fillRect(rand()*256,rand()*256,2+rand()*5,2+rand()*5);}ctx.globalAlpha=1;
    } else if (kind === 'water') {
      ctx.strokeStyle=colors[1]; ctx.lineWidth=3; ctx.globalAlpha=.5;
      for(let y=10;y<256;y+=24){ctx.beginPath();ctx.moveTo(0,y+Math.sin(y)*4);for(let x=0;x<=256;x+=12)ctx.lineTo(x,y+Math.sin((x+y)*.09)*5);ctx.stroke();}
      ctx.globalAlpha=1;
    } else if(kind==='stone'){
      ctx.fillStyle=colors[1];ctx.fillRect(0,0,256,256);for(let y=0;y<256;y+=50){for(let x=((y/50)%2?-28:0);x<256;x+=58){ctx.fillStyle=rand()>.45?colors[0]:pick();ctx.fillRect(x+3,y+3,52,44);ctx.fillStyle='rgba(255,255,255,.09)';ctx.fillRect(x+5,y+5,48,4);}}
    } else if(kind==='tile'){
      ctx.strokeStyle=colors[1];ctx.lineWidth=7;for(let p=0;p<=256;p+=64){ctx.beginPath();ctx.moveTo(p,0);ctx.lineTo(p,256);ctx.stroke();ctx.beginPath();ctx.moveTo(0,p);ctx.lineTo(256,p);ctx.stroke();}ctx.fillStyle='rgba(255,255,255,.18)';for(let y=7;y<256;y+=64)for(let x=7;x<256;x+=64)ctx.fillRect(x,y,48,5);
    } else if(kind==='fabric'){
      for(let y=0;y<256;y+=12)for(let x=0;x<256;x+=12){ctx.fillStyle=(x/12+y/12)%2?colors[0]:colors[1];ctx.globalAlpha=.62;ctx.fillRect(x,y,12,12);}ctx.globalAlpha=1;
    } else if(kind==='metal'){
      for(let y=0;y<256;y+=32){ctx.fillStyle=y%64?colors[0]:colors[1];ctx.fillRect(0,y,256,32);ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(0,y,256,3);}for(const x of [10,246])for(let y=14;y<256;y+=42){ctx.fillStyle='#6c7b88';ctx.fillRect(x-3,y-3,6,6);}
    }
    const tex = new THREE.CanvasTexture(c); tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.anisotropy = (renderer && renderer.capabilities) ? Math.min(12,renderer.capabilities.getMaxAnisotropy()) : 4; tex.wrapS = tex.wrapT = THREE.RepeatWrapping;tex.encoding=THREE.sRGBEncoding; return tex;
  }
  function professionalTexture(path,kind,colors,repeatX=1,repeatY=1){
    const texture=canvasTexture(kind,colors);texture.repeat.set(repeatX,repeatY);
    const loader=new THREE.TextureLoader();
    loader.load(path,loaded=>{
      texture.image=loaded.image;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(repeatX,repeatY);
      texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;
      texture.anisotropy=(renderer&&renderer.capabilities)?Math.min(12,renderer.capabilities.getMaxAnisotropy()):4;texture.encoding=THREE.sRGBEncoding;texture.needsUpdate=true;
    },undefined,()=>console.warn('Textura profissional opcional não carregada:',path));
    return texture;
  }
  function initMaterials() {
    textures.grass = professionalTexture('./assets/textures/grass-v628.png','grass',['#348f32','#62c94e','#28762c','#91df63'],46,46);
    textures.road = professionalTexture('./assets/textures/asphalt-v628.png','road',['#252d38','#3d4652'],10,30);
    textures.sidewalk = canvasTexture('sidewalk', ['#d9dde3','#aeb7c2']); textures.sidewalk.repeat.set(6,14);
    textures.water = canvasTexture('water', ['#2fb8ec','#bdf1ff']); textures.water.repeat.set(5,5);
    textures.wood = professionalTexture('./assets/textures/wood-v628.png','wood',['#9a5a28','#693819'],2,2);
    textures.brick = professionalTexture('./assets/textures/brick-v628.png','brick',['#c38142','#8a4e25'],3,2);
    textures.stone = professionalTexture('./assets/textures/stone-v628.png','stone',['#8795a6','#677482','#aab5bf'],4,3);
    textures.roof = professionalTexture('./assets/textures/roof-v628.png','brick',['#7c3030','#481d22'],3,3);
    textures.busSeat = professionalTexture('./assets/textures/bus-seat-v628.png','fabric',['#2e6db2','#173c69'],4,4);
    textures.schoolWall = professionalTexture('./assets/textures/school-wall-v628.png','brick',['#ead89a','#c49b58'],3,2);
    textures.policeWall = professionalTexture('./assets/textures/police-wall-v628.png','brick',['#dce8ef','#1f5c9d'],3,2);
    textures.goldOre = professionalTexture('./assets/textures/gold-ore-v628.png','stone',['#565c64','#f0c230'],2,2);
    textures.interiorFloor = professionalTexture('./assets/textures/interior-floor-v628.png','wood',['#a4703e','#67411f'],4,4);
    textures.tile = canvasTexture('tile', ['#e8f3f6','#78b8c9']); textures.tile.repeat.set(4,4);
    textures.fabric = textures.busSeat;
    textures.metal = canvasTexture('metal', ['#8c9dab','#657481']); textures.metal.repeat.set(2,3);
    materials.grass = new THREE.MeshStandardMaterial({ map: textures.grass, roughness: .88 });
    materials.road = new THREE.MeshStandardMaterial({ map: textures.road, roughness: .82 });
    materials.sidewalk = new THREE.MeshStandardMaterial({ map: textures.sidewalk, roughness: .92 });
    materials.wood = new THREE.MeshStandardMaterial({ map: textures.wood, roughness: .8 });
    materials.brick = new THREE.MeshStandardMaterial({ map: textures.brick, roughness: .82 });
    materials.tile = new THREE.MeshStandardMaterial({ map:textures.tile,roughness:.42,metalness:.03 });
    materials.fabric = new THREE.MeshStandardMaterial({ map:textures.fabric,roughness:.86 });
    materials.metal = new THREE.MeshStandardMaterial({ map:textures.metal,roughness:.38,metalness:.48 });
    materials.water = new THREE.MeshStandardMaterial({ map:textures.water, color:0x2fc8f4, emissive:0x087aa7, emissiveIntensity:.18, transparent:true, opacity:.76, roughness:.2, metalness:.1 });
    materials.stone = new THREE.MeshStandardMaterial({ map:textures.stone,color:0xaab2bb,roughness:.88,flatShading:true });
    materials.goldOre = new THREE.MeshStandardMaterial({ map:textures.goldOre,color:0xffffff,emissive:0x6b3f00,emissiveIntensity:.22,roughness:.62,metalness:.28,flatShading:true });
    materials.dark = new THREE.MeshStandardMaterial({ color:0x080b11, roughness:.55, flatShading:true });
  }
  function mat(color, opts = {}) { return new THREE.MeshStandardMaterial({ color, roughness: opts.roughness ?? .72, metalness: opts.metalness ?? .03, emissive: opts.emissive ?? 0x000000, emissiveIntensity: opts.emissiveIntensity ?? 0, transparent: !!opts.transparent, opacity: opts.opacity ?? 1, flatShading: opts.flatShading ?? true }); }

  // V626: cache somente de geometrias e materiais visuais imutáveis.
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
  const roofMaterialCache=new Map();
  function tintedBrickMaterial(color,texture=textures.brick){
    return new THREE.MeshStandardMaterial({map:texture||textures.brick,color:new THREE.Color(color).lerp(new THREE.Color(0xffffff),.34),roughness:.8,metalness:0,flatShading:true});
  }
  function texturedRoofMaterial(color){
    const key=Number(color);if(!roofMaterialCache.has(key))roofMaterialCache.set(key,new THREE.MeshStandardMaterial({map:textures.roof,color:new THREE.Color(color).lerp(new THREE.Color(0xffffff),.12),roughness:.76,metalness:0,flatShading:true}));return roofMaterialCache.get(key);
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
    ownLabel.position.set(0,3.65,0);ownLabel.scale.set(2.65,.66,1);ownLabel.renderOrder=1000;ownLabel.visible=false;playerGroup.add(ownLabel);playerGroup.userData.nameLabel=ownLabel;playerGroup.userData.displayName=playerDisplayName();
    refreshEquippedToolVisual();
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
      world.resources.push({id,type:'wood',x,z,mesh:group,collected:false,hits:0,hitsNeeded:2});
      registerInteractable({id,type:'resource',icon:'🪓',label:'Cortar árvore com machado',x,z,radius:2.4,priority:135,action:()=>collectResource(id)});
    }
    return group;
  }
  function createRock(x,z,scale=1,resource=true) {
    const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(.8*scale,0),materials.stone); mesh.position.set(x,.55*scale,z); mesh.castShadow=true; mesh.receiveShadow=true; worldGroup.add(mesh);
    if(resource){const id=`rock-${x.toFixed(1)}-${z.toFixed(1)}`;world.resources.push({id,type:'stone',x,z,mesh,collected:false,hits:0,hitsNeeded:2});registerInteractable({id,type:'resource',icon:'⛏️',label:'Extrair pedra com picareta',x,z,radius:2.2,priority:135,action:()=>collectResource(id)});} return mesh;
  }
  function createGoldFoundry(x=34,z=-35){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);
    premiumBox(7.4,.24,5.8,materials.stone,0,.12,0,g);premiumBox(6.6,3.2,5.1,0x8a5c3a,0,1.72,0,g);premiumBox(6.9,.42,5.4,texturedRoofMaterial(0x3d4652),0,3.45,0,g);
    premiumBox(1.15,3.4,1.15,0x59616a,2.25,4.65,-1.25,g);premiumBox(1.42,.35,1.42,0x343b42,2.25,6.36,-1.25,g);
    const furnace=renderMat(0x303842,{roughness:.42,metalness:.32}),glow=renderMat(0xffb33e,{emissive:0xff5a00,emissiveIntensity:1.25,roughness:.25});premiumBox(2.4,1.7,1.7,furnace,0,1.05,2.55,g);premiumBox(1.15,.82,.12,glow,0,1.05,3.43,g);
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(3.6,.9),new THREE.MeshStandardMaterial({map:signTexture('FUNDIÇÃO DE OURO','#3a2a16','#ffe691'),side:THREE.DoubleSide,roughness:.7}));sign.position.set(0,2.75,2.62);g.add(sign);
    registerCollider(x,z,7.4,5.8,{landmark:'foundry'});registerInteractable({id:'gold-foundry',type:'workshop',icon:'🏅',label:'Usar fundição de ouro',x,z:z+3.7,radius:3.1,priority:190,action:openWorkshop});world.landmarks.push(g);return g;
  }
  function createGoldMine(x=-92,z=-92){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);world.mine={x,z,group:g};
    premiumBox(18,.3,13,materials.stone,0,.15,0,g);premiumBox(15,.18,10,renderMat(0x2e3540,{roughness:.94}),0,.34,0,g);
    for(const [ox,oz,s] of [[-7,-4,2.4],[7,-4,2.4],[-7,4,2.6],[7,4,2.6],[-4,-5,2],[4,-5,2]]){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),materials.stone);rock.position.set(ox,s*.48,oz);rock.scale.y=1.35;g.add(rock);}
    premiumBox(7.4,5.5,1.4,materials.stone,0,2.75,-5.1,g);premiumBox(5.3,4.2,1.55,0x141923,0,2.05,-5.35,g);premiumBox(7.8,.55,2.2,materials.wood,0,.45,-3.9,g);
    for(const ox of [-2.5,2.5]){premiumBox(.35,4.7,.35,materials.wood,ox,2.4,-4.3,g);premiumBox(3.1,.35,.35,materials.wood,ox/2,4.65,-4.3,g);}
    const orePositions=[[-4,-1],[-1.2,2],[3.2,.8],[-3.8,3.6],[4.4,-2.4],[.8,-2.2]];
    orePositions.forEach(([ox,oz],index)=>{
      const mesh=new THREE.Mesh(new THREE.DodecahedronGeometry(.78+(index%2)*.12,0),materials.goldOre);mesh.position.set(x+ox,.65,z+oz);mesh.castShadow=true;worldGroup.add(mesh);
      const id=`gold-${index}`;world.resources.push({id,type:'gold',x:x+ox,z:z+oz,mesh,collected:false,hits:0,hitsNeeded:3});
      registerInteractable({id,type:'resource',icon:'⛏️',label:'Extrair minério de ouro',x:x+ox,z:z+oz,radius:2.3,priority:145,action:()=>collectResource(id)});
    });
    createSignpost(x+7,z-6,'Mina Dourada',Math.PI*.1);createLamp(x-6,z-3);createLamp(x+6,z-3);return g;
  }
  function createVillageWell(x=38,z=10){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);world.well={x,z,group:g,lastDrawAt:0};
    premiumCylinder(2.05,.55,materials.stone,0,.28,0,g,14);premiumCylinder(1.42,.7,0x122637,0,.52,0,g,14);
    for(const ox of [-1.65,1.65])premiumBox(.28,3.6,.28,materials.wood,ox,2.0,0,g);
    premiumBox(4.2,.28,1.6,0xb24b35,0,4.0,0,g);premiumBox(3.5,.22,1.3,0xe16a42,0,4.28,0,g);
    const axle=premiumCylinder(.16,3.6,materials.metal,0,2.8,0,g,12);axle.rotation.z=Math.PI/2;
    premiumBox(.06,1.9,.06,0x70513b,0,1.85,0,g);const bucket=premiumCylinder(.35,.48,materials.metal,0,.82,0,g,10);bucket.userData.wellBucket=true;
    registerInteractable({id:'village-well',type:'well',icon:'🪣',label:'Retirar água com o balde',x,z,radius:3.2,priority:170,action:drawWaterFromWell});createSignpost(x+3,z+1.5,'Poço da Vila',Math.PI/2);return g;
  }
  function drawWaterFromWell(){
    if(state.tools.equipped!=='bucket'){toast('Equipe o balde no menu Ferramentas.','warn',1800);return;}
    const now=performance.now();if(world.well&&now-world.well.lastDrawAt<2500){toast('O balde ainda está subindo.','warn',1100);return;}if(world.well)world.well.lastDrawAt=now;
    playToolAnimation();state.inventory.water=(state.inventory.water||0)+2;state.tools.harvested.water=(state.tools.harvested.water||0)+2;state.needs.hygiene=clamp(state.needs.hygiene+2,0,100);advanceAdventure('resources','water');addXP(6);saveState(true);updateHUD();toast('+2 água limpa','good',1300);
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
    if(type==='desk'){
      box(1.75,.16,.88,wood,0,.83,0,group);for(const ox of [-.65,.65])for(const oz of [-.28,.28])box(.12,.76,.12,wood,ox,.4,oz,group);
      box(1.18,.1,.5,materials.tile,0,.94,0,group);box(.72,.14,.14,0xffd45e,-.15,1.07,.06,group);
      box(1.05,.14,.34,materials.fabric,0,.5,.72,group);box(1.05,.72,.14,materials.fabric,0,.83,.86,group);for(const ox of [-.42,.42])box(.1,.47,.1,metal,ox,.24,.72,group);
    }
    if(type==='bookshelf'){
      box(1.72,2.25,.4,wood,0,1.12,0,group);for(const y of [.2,.75,1.3,1.85,2.22])box(1.68,.1,.46,shadeColor(0x89502b,-16),0,y,0,group);
      const colors=[0xe34e52,0x3f8fd5,0xf0c441,0x55ad67,0x8d65c5];for(let row=0;row<4;row++)for(let i=0;i<7;i++)box(.16,.38,.3,colors[(i+row)%colors.length],-.62+i*.205,.43+row*.55,.04,group);
    }
    if(type==='board'){
      box(3.25,1.75,.12,0x244f47,0,1.55,0,group);box(3.5,.12,.2,wood,0,.65,0,group);box(3.5,.12,.2,wood,0,2.45,0,group);
      for(const ox of [-1.2,-.45,.35,1.05])box(.42,.06,.025,0xf1f5d5,ox,1.6,.075,group);
    }
    if(type==='bench'){box(2.25,.22,.62,materials.fabric,0,.62,0,group);box(2.25,.74,.18,materials.fabric,0,1.0,-.24,group);for(const ox of [-.82,.82])box(.14,.55,.14,metal,ox,.28,0,group);}
    if(type==='radio'){
      box(1.35,.88,.65,materials.metal,0,.7,0,group);box(.72,.42,.05,dark,-.18,.72,.35,group);for(let i=0;i<4;i++)box(.06,.32,.04,0x9aaaba,-.46+i*.14,.72,.39,group);
      cylinder(.13,.1,0xffd24a,.42,.86,.36,group,12);box(.06,.85,.06,metal,.45,1.55,0,group);
    }
    if(type==='plant'){
      premiumCylinder(.46,.58,0xd8733f,0,.3,0,group,10);box(.18,1.15,.18,0x4f8332,0,1.0,0,group);
      for(const [ox,oy,oz] of [[-.34,1.25,0],[.34,1.08,.08],[0,1.48,-.15],[-.15,1.05,.28]])premiumBox(.62,.22,.4,0x55b94b,ox,oy,oz,group);
    }
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
    const wallTexture=id.startsWith('school')?textures.schoolWall:id==='police'?textures.policeWall:textures.brick,wallMat=tintedBrickMaterial(color,wallTexture),roofMat=texturedRoofMaterial(roofColor),roofLight=texturedRoofMaterial(shadeColor(roofColor,18)),corner=renderMat(new THREE.Color(color).lerp(new THREE.Color(0xffffff),.48).getHex(),{roughness:.78});
    box(9,.25,7,materials.wood,x,.12,z);
    box(9,2.8,.35,wallMat,x,1.5,z-3.32);box(.35,2.8,7,wallMat,x-4.32,1.5,z);box(.35,2.8,7,wallMat,x+4.32,1.5,z);
    box(3.6,2.8,.35,wallMat,x-2.7,1.5,z+3.32,house.front);box(3.6,2.8,.35,wallMat,x+2.7,1.5,z+3.32,house.front);
    for(const cx of [-4.12,4.12]){box(.24,2.82,.4,corner,x+cx,1.5,z-3.28);box(.24,2.82,.4,corner,x+cx,1.5,z+3.28,house.front);}
    box(9.8,.62,7.75,roofMat,x,3.18,z,house.roof);box(8.8,.35,6.8,roofLight,x,3.55,z,house.roof);
    box(7.5,.42,7.15,roofMat,x,3.86,z,house.roof);box(5.9,.4,5.85,texturedRoofMaterial(shadeColor(roofColor,26)),x,4.18,z,house.roof);
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
      createFurniture(house,'table',-1.6,.15,0,'Mesa de refeições');createFurniture(house,'plant',1.65,.55,0,'Planta da casa');
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
    } else if(type==='school'){
      premiumBox(8.2,.08,6.2,new THREE.MeshStandardMaterial({map:textures.interiorFloor,roughness:.74}),house.x,.16,house.z);
      const board=createFurniture(house,'board',0,-2.75,0,'Começar aula');registerActivity(house,board,'school');
      for(const [x,z] of [[-2.6,-1.2],[0,-1.2],[2.6,-1.2],[-2.6,.65],[0,.65],[2.6,.65]])createFurniture(house,'desk',x,z,0,'Carteira escolar');
      createFurniture(house,'bookshelf',3.25,2.15,0,'Biblioteca');createFurniture(house,'plant',-3.3,2.1,0,'Horta da turma');
    } else if(type==='police'){
      premiumBox(8.2,.08,6.2,new THREE.MeshStandardMaterial({map:textures.interiorFloor,roughness:.74}),house.x,.16,house.z);
      const radio=createFurniture(house,'radio',-2.7,-1.4,0,'Central de segurança');registerActivity(house,radio,'police');
      createFurniture(house,'desk',0,-1.1,0,'Mesa da patrulha');createFurniture(house,'bench',2.5,1.8,0,'Banco de espera');
      createFurniture(house,'board',0,2.7,0,'Regras de trânsito');createFurniture(house,'bookshelf',-3.25,1.7,0,'Guias de segurança');
    } else if(type==='neighbor'){
      const sofa=createFurniture(house,'sofa',1,-1.5,0xef6c9d,'Sentar');registerActivity(house,sofa,'sofa');
      const tv=createFurniture(house,'tv',1,.2,0,'Assistir TV');registerActivity(house,tv,'tv');
      createFurniture(house,'bed',-2.5,-1.7,0,'Cama');
    }
    registerInteractable({id:`exit-${house.id}`,type:'exit',icon:'🚪',label:'Sair da casa',x:house.x,z:house.z+2.65,radius:1.5,priority:240,houseId:house.id,action:()=>exitHouse()});
  }
  function registerActivity(house,item,activity){
    const priority=({stove:180,fridge:170,sink:165,bed:160,shower:155,tv:150,sofa:145,wardrobe:140,chest:120,shop:170,workshop:170,school:185,police:185})[activity]||100;
    registerInteractable({id:`${activity}-${house.id}`,type:'activity',activity,icon:activityIcon(activity),label:item.label,x:item.x,z:item.z,radius:1.75,priority,houseId:house.id,action:()=>useActivity(activity,house)});
  }
  function activityIcon(type){return ({bed:'🛏',sofa:'🛋',tv:'📺',fridge:'🍎',stove:'🍳',sink:'💧',shower:'🚿',chest:'🎁',shop:'🛒',workshop:'🛠',wardrobe:'👕',school:'🏫',police:'🛡️'})[type]||'✋';}

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
  function createNpcMobility(npc,type,route,speed){
    if(!npc||!Array.isArray(route)||route.length<2)return npc;const ride=new THREE.Group();npc.group.add(ride);const wheels=[];
    if(type==='car'){
      premiumBox(1.72,.34,2.45,0x24364d,0,.35,0,ride);premiumBox(1.55,.45,1.12,npc.color,0,.62,.43,ride);premiumBox(1.3,.4,.78,0x163049,0,.82,-.45,ride);
      for(const p of [[-.78,.28,-.72],[.78,.28,-.72],[-.78,.28,.72],[.78,.28,.72]]){const wheel=premiumCylinder(.28,.24,0x121821,p[0],p[1],p[2],ride,10);wheel.rotation.z=Math.PI/2;wheels.push(wheel);}
    }else if(type==='moto'){
      for(const z of [-.72,.72]){const wheel=premiumCylinder(.34,.13,0x111822,0,.36,z,ride,12);wheel.rotation.z=Math.PI/2;wheels.push(wheel);}premiumBox(.28,.26,1.15,npc.color,0,.58,0,ride);premiumBox(.56,.15,.42,0x202c3b,0,.76,-.12,ride);premiumBox(.7,.06,.08,0xd7e2eb,0,1.05,.53,ride);
    }else if(type==='bike'){
      for(const z of [-.72,.72]){const wheel=premiumCylinder(.34,.07,0x17202b,0,.36,z,ride,14);wheel.rotation.z=Math.PI/2;wheels.push(wheel);}premiumBox(.08,.65,1.2,npc.color,0,.62,0,ride);premiumBox(.58,.07,.08,0xe8eef3,0,1.05,.62,ride);premiumBox(.45,.12,.34,0x25364a,0,.84,-.2,ride);
    }else{
      premiumBox(.62,.1,1.2,npc.color,0,.12,0,ride);for(const p of [[-.25,.08,-.42],[.25,.08,-.42],[-.25,.08,.42],[.25,.08,.42]]){const wheel=premiumCylinder(.09,.08,0x1c2633,p[0],p[1],p[2],ride,8);wheel.rotation.z=Math.PI/2;wheels.push(wheel);}
    }
    ride.traverse(o=>{if(o.isMesh)addVoxelOutline(o,0x132238,.22);});npc.mobility={type,route:route.map(p=>({x:p[0],z:p[1]})),index:1,speed:speed||({car:4.4,moto:4.8,bike:3.2,skate:2.8})[type]||3,ride,wheels};return npc;
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
  function createToyCar(x,z,options={}){
    const id=options.id||`city-car-${world.vehicles.length+1}`,heading=Number(options.heading||0),group=new THREE.Group();group.position.set(x,0,z);group.rotation.y=heading;worldGroup.add(group);
    const chassis=renderMat(0x26384e,{roughness:.5,metalness:.16}),orange=renderMat(options.primary??0xf28a22,{roughness:.4,metalness:.18}),teal=renderMat(options.secondary??0x0aa7b8,{roughness:.38,metalness:.22}),glass=renderMat(0x102338,{roughness:.12,metalness:.38,transparent:true,opacity:.84});
    box(1.84,.36,2.56,chassis,0,.28,0,group);box(1.72,.48,1.35,orange,0,.55,.55,group);box(1.48,.46,.92,teal,0,.78,-.48,group);box(1.32,.31,.72,glass,0,.93,-.42,group);
    box(1.94,.18,.28,0xf3f5f7,0,.32,1.34,group);box(.18,.34,2.2,teal,-.92,.42,0,group);box(.18,.34,2.2,teal,.92,.42,0,group);
    box(.72,.42,.58,0x151a23,0,.72,-.12,group);
    const headlight=renderMat(0xfff1a8,{emissive:0xffd75b,emissiveIntensity:.9,roughness:.2});box(.3,.17,.08,headlight,-.58,.5,1.27,group);box(.3,.17,.08,headlight,.58,.5,1.27,group);
    for(const p of [[-.84,.24,-.79],[.84,.24,-.79],[-.84,.24,.79],[.84,.24,.79]]){const wheel=cylinder(.34,.28,0x10151d,p[0],p[1],p[2],group,14);wheel.rotation.z=Math.PI/2;const hub=cylinder(.12,.3,0xf5a623,p[0],p[1],p[2],group,10);hub.rotation.z=Math.PI/2;}
    group.traverse(o=>{if(o.isMesh)addVoxelOutline(o,0x14243a,.28);});
    const vehicle={id,x,z,heading,group,label:options.label||'Carro da cidade',occupied:false};world.vehicles.push(vehicle);if(!world.vehicle)world.vehicle=vehicle;
    registerInteractable({id:`vehicle-${id}`,type:'vehicle',icon:'🚗',label:`Entrar: ${vehicle.label}`,radius:2.5,priority:155,getPos:()=>({x:vehicle.group.position.x,z:vehicle.group.position.z}),action:()=>enterVehicle(vehicle)});return vehicle;
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

  const BUS_ROUTES=[
    {id:'solar',name:'Linha Solar',number:'101',color:0x168de2,speed:7.2,copies:2,points:[
      {x:0,z:10,stopId:'central-norte',stopName:'Central Norte'},{x:7,z:11},{x:7,z:27},{x:0,z:34},{x:0,z:55},{x:0,z:94,stopId:'bairro-norte',stopName:'Bairro Norte'},{x:0,z:55},{x:0,z:34},{x:7,z:27},{x:7,z:11},{x:0,z:0},{x:55,z:0,stopId:'fazenda',stopName:'Fazenda'},{x:72,z:0,stopId:'seguranca',stopName:'Posto de Segurança'},{x:55,z:0},{x:55,z:48,stopId:'castelo',stopName:'Castelo'},{x:55,z:88,stopId:'ginasio',stopName:'Ginásio'},{x:55,z:48},{x:55,z:0},{x:0,z:0}
    ]},
    {id:'verde',name:'Linha Verde',number:'202',color:0x27b36a,speed:6.8,copies:2,points:[
      {x:0,z:-10,stopId:'central-sul',stopName:'Central Sul'},{x:0,z:-55,stopId:'academia',stopName:'Academia'},{x:0,z:-94,stopId:'vale',stopName:'Vale dos Cristais'},{x:0,z:-55},{x:-55,z:-55,stopId:'floresta',stopName:'Floresta'},{x:-55,z:-10,stopId:'mercado',stopName:'Mercado'},{x:-55,z:0},{x:-70,z:0,stopId:'escola',stopName:'Escola Vila do Sol'},{x:-55,z:0},{x:0,z:0}
    ]},
    {id:'escolar',name:'Circular Escolar',number:'E10',color:0xf0b62d,speed:6.4,copies:1,schoolBus:true,points:[
      {x:-70,z:0,stopId:'escola',stopName:'Escola Vila do Sol'},{x:-55,z:0},{x:0,z:0,stopId:'central-escolar',stopName:'Praça Central'},{x:55,z:0},{x:68,z:18,stopId:'escola-horizonte',stopName:'Escola Horizonte'},{x:55,z:0},{x:0,z:0},{x:-55,z:0}
    ]}
  ];
  const ADVENTURE_DEFS={
    castle:{icon:'👑',name:'Coroas do Castelo',description:'Encontre 6 coroas reais em 75 segundos.',target:6,reward:180,xp:130},
    metro:{icon:'Ⓜ️',name:'Explorador do Metrô',description:'Visite 3 destinos diferentes pela rede.',target:3,reward:150,xp:105},
    bus:{icon:'🚌',name:'Volta pela Cidade',description:'Desembarque em 3 paradas diferentes.',target:3,reward:145,xp:100},
    skills:{icon:'✨',name:'Combo de Skills',description:'Use as 5 skills avançadas diferentes.',target:5,reward:175,xp:125},
    resources:{icon:'🧰',name:'Mestre das Ferramentas',description:'Colete madeira, pedra/minério e água com as ferramentas certas.',target:3,reward:155,xp:115}
  };
  let transitPanel=null,metroOverlay=null;

  function createMetroEntrance(station){
    const g=new THREE.Group();g.position.set(station.x,0,station.z);worldGroup.add(g);
    premiumBox(4.3,.24,4.6,0x27384a,0,.12,0,g);premiumBox(3.65,.24,3.9,0xc9d6df,0,.3,0,g);
    for(let i=0;i<5;i++)premiumBox(2.8,.16,.58,0x718291,0,.35-i*.02,.6+i*.5,g);
    premiumBox(.25,3.3,.25,0x1c2c42,-1.82,1.75,-1.62,g);premiumBox(.25,3.3,.25,0x1c2c42,1.82,1.75,-1.62,g);premiumBox(4.1,.32,1.2,0x168de2,0,3.38,-1.62,g);
    const panel=new THREE.Mesh(new THREE.PlaneGeometry(1.15,1.15),new THREE.MeshStandardMaterial({map:iconTexture('M','#168de2','#ffffff'),emissive:0x0a4d86,emissiveIntensity:.35,side:THREE.DoubleSide}));panel.position.set(0,3.42,-2.25);panel.rotation.y=Math.PI;g.add(panel);
    premiumBox(3.45,2.5,.12,0x13283d,0,1.45,1.82,g);for(const x of [-1.18,0,1.18])premiumBox(.08,2.35,.14,0x64d8ff,x,1.45,1.75,g);
    station.group=g;world.metroStations.push(station);registerInteractable({id:`metro-entry-${station.id}`,type:'metro',icon:'Ⓜ️',label:`Entrar: ${station.name}`,x:station.x,z:station.z,radius:3.5,priority:205,action:()=>openMetroStation(station)});return station;
  }
  function ensureMetroOverlay(){
    if(metroOverlay)return metroOverlay;metroOverlay=document.createElement('div');metroOverlay.id='metroTravelOverlay';metroOverlay.className='metro-travel-overlay';metroOverlay.hidden=true;metroOverlay.innerHTML='<div class="metro-tunnel"><i></i><i></i><i></i></div><div class="metro-train"><b>M</b><span></span><span></span><span></span></div><strong data-metro-trip>Próxima estação</strong>';document.body.appendChild(metroOverlay);return metroOverlay;
  }
  function openMetroStation(station){
    if(player.vehicle||player.boating||player.transit.mode){toast('Desembarque antes de entrar no metrô.','warn');return;}
    const groups=[...new Set(MAP_LOCATIONS.map(x=>x.group))].map(group=>`<section class="metro-destination-group"><h4>${group}</h4><div>${MAP_LOCATIONS.filter(x=>x.group===group).map(loc=>`<button class="metro-destination" data-metro-destination="${loc.id}"><b>${loc.icon} ${loc.name}</b><span>${Math.round(Math.hypot((loc.navX??loc.x)-station.x,(loc.navZ??loc.z)-station.z))} m</span></button>`).join('')}</div></section>`).join('');
    openModal(station.name,`<div class="transit-heading"><b>Ⓜ️ ${station.line}</b><span>Escolha qualquer ponto conhecido do mapa.</span></div><div class="metro-destination-list">${groups}</div>`,root=>{$$('[data-metro-destination]',root).forEach(btn=>btn.onclick=()=>{const destination=MAP_LOCATIONS.find(x=>x.id===btn.dataset.metroDestination);if(destination)rideMetroTo(station,destination);});});
  }
  function rideMetroTo(station,destination){
    if(!destination||player.transit.mode)return;closeModal();clearMovementInputs();player.transit.mode='metro';player.transit.metroUntil=performance.now()+1900;player.vx=player.vz=0;if(playerModel)playerModel.visible=false;if(avatarLayer)avatarLayer.visible=false;if(contactShadow)contactShadow.visible=false;
    const overlay=ensureMetroOverlay();overlay.querySelector('[data-metro-trip]').textContent=`${station.name} → ${destination.name}`;overlay.hidden=false;overlay.classList.remove('arriving');requestAnimationFrame(()=>overlay.classList.add('travelling'));
    const token=player.transit.metroUntil;setTimeout(()=>{if(player.transit.mode!=='metro'||player.transit.metroUntil!==token)return;overlay.classList.add('arriving');player.x=Number(destination.navX??destination.x);player.z=Number(destination.navZ??destination.z);player.y=groundHeightAt(player.x,player.z);player.vx=player.vy=player.vz=0;player.grounded=true;player.facing=Math.PI;state.position={x:player.x,y:player.y,z:player.z,yaw:player.facing};state.transport.metroTrips=(state.transport.metroTrips||0)+1;state.stats.metroTrips=(state.stats.metroTrips||0)+1;if(!state.transport.metroDestinations.includes(destination.id))state.transport.metroDestinations.push(destination.id);state.transport.metroDestinations=state.transport.metroDestinations.slice(-60);trackDaily('metro',1);advanceAdventure('metro',destination.id);setFlag('usedMetro');state.waypoint=null;world.routePath=[];player.transit.mode='';if(playerModel)playerModel.visible=true;if(avatarLayer)avatarLayer.visible=true;if(contactShadow)contactShadow.visible=true;playerGroup?.position?.set(player.x,player.y,player.z);updateNavigation(0,true);updateContext(true);saveState(true);setTimeout(()=>{overlay.hidden=true;overlay.classList.remove('travelling','arriving');},260);toast(`Metrô: chegada em ${destination.name}.`,'good',2100);},1900);
  }

  function ensureBusStop(route,point){
    let stop=world.busStops.find(s=>s.id===point.stopId);if(stop){if(!stop.routes.includes(route.id))stop.routes.push(route.id);return stop;}
    stop={id:point.stopId,name:point.stopName,x:point.x,z:point.z,roadX:point.x,roadZ:point.z,routes:[route.id]};world.busStops.push(stop);const g=new THREE.Group();const sideX=Math.abs(point.x)<9?4.8:point.x<0?4.8:-4.8;g.position.set(point.x+sideX,0,point.z);worldGroup.add(g);premiumBox(.18,2.7,.18,0x23364b,0,1.35,0,g);premiumBox(1.5,.92,.16,route.color,0,2.35,0,g);const sign=new THREE.Mesh(new THREE.PlaneGeometry(.72,.72),new THREE.MeshStandardMaterial({map:iconTexture('🚌','#ffffff','#17324d'),transparent:true,side:THREE.DoubleSide}));sign.position.set(0,2.38,.1);g.add(sign);premiumBox(2.8,.18,.82,0xd3dce3,0,.1,0,g);stop.sign=g;stop.x=point.x+sideX;registerInteractable({id:`bus-stop-${stop.id}`,type:'bus-stop',icon:'🚌',label:`Parada: ${stop.name}`,x:stop.x,z:stop.z,radius:3.3,priority:190,action:()=>openBusStop(stop)});return stop;
  }
  function createBusModel(route,copy=0){
    const g=new THREE.Group(),body=renderMat(route.color,{roughness:.4,metalness:.14}),dark=renderMat(0x11263a,{roughness:.08,metalness:.28,transparent:true,opacity:.42}),light=renderMat(0xf5f7fa,{roughness:.46}),rail=renderMat(0xf6c934,{roughness:.34,metalness:.32}),seat=materials.fabric;
    premiumBox(3.08,.48,7.0,0x26384b,0,.4,0,g);premiumBox(2.92,.2,6.65,materials.tile,0,.72,0,g);
    premiumBox(3.02,.62,6.82,body,0,1.02,0,g);premiumBox(3.06,.24,6.9,light,0,3.26,0,g);
    for(const side of [-1,1]){
      premiumBox(.16,2.05,6.74,body,side*1.49,1.95,0,g);
      for(const z of [-2.72,-1.38,0,1.38,2.72])premiumBox(.22,2.0,.18,light,side*1.51,2.03,z,g);
      for(const z of [-2.08,-.68,.68,2.08])premiumBox(.035,1.25,1.08,dark,side*1.595,2.1,z,g);
    }
    premiumBox(2.95,2.25,.2,body,0,2.0,-3.4,g);premiumBox(2.48,1.25,.04,dark,0,2.24,-3.52,g);
    premiumBox(2.95,.72,.2,body,0,1.08,3.4,g);premiumBox(2.75,.42,.16,light,0,3.05,3.42,g);
    const windshield=premiumBox(2.48,1.15,.045,dark,0,2.18,3.515,g);windshield.material.opacity=.5;
    premiumBox(.16,2.15,.22,light,-1.36,2.03,3.42,g);premiumBox(.16,2.15,.22,light,1.36,2.03,3.42,g);
    const routeBoard=new THREE.Mesh(new THREE.PlaneGeometry(1.95,.46),new THREE.MeshStandardMaterial({map:signTexture(`${route.number} ${route.name}`,route.schoolBus?'#f0b62d':'#12273b',route.schoolBus?'#1b2835':'#ffffff'),roughness:.5,side:THREE.DoubleSide}));routeBoard.position.set(0,2.92,3.535);g.add(routeBoard);if(route.schoolBus){const schoolSign=new THREE.Mesh(new THREE.PlaneGeometry(1.15,.45),new THREE.MeshStandardMaterial({map:signTexture('ESCOLAR','#fff4c8','#24364a'),side:THREE.DoubleSide,roughness:.6}));schoolSign.position.set(0,2.35,-3.54);schoolSign.rotation.y=Math.PI;g.add(schoolSign);}
    for(const z of [-2.25,-.85,.55,1.95])for(const x of [-.72,.72]){premiumBox(.72,.18,.62,seat,x,1.08,z,g);premiumBox(.72,.74,.16,seat,x,1.42,z-.26,g);premiumBox(.08,.48,.08,rail,x-.26,1.0,z,g);premiumBox(.08,.48,.08,rail,x+.26,1.0,z,g);}
    for(const x of [-1.15,1.15])premiumBox(.07,2.2,.07,rail,x,1.82,2.55,g);premiumBox(2.35,.07,.07,rail,0,2.72,2.55,g);
    premiumBox(.68,1.9,.08,renderMat(0x98e7ff,{transparent:true,opacity:.22,roughness:.08}),1.54,1.7,2.52,g);premiumBox(.12,2.08,.12,rail,1.5,1.78,1.84,g);
    const wheels=[];for(const p of [[-1.48,.47,-2.3],[1.48,.47,-2.3],[-1.48,.47,2.25],[1.48,.47,2.25]]){const wheel=premiumCylinder(.48,.28,0x111720,p[0],p[1],p[2],g,14);wheel.rotation.z=Math.PI/2;wheels.push(wheel);}
    const start=route.points[(copy*3)%route.points.length],bus={id:`bus-${route.id}-${copy+1}`,route,group:g,pointIndex:((copy*3)+1)%route.points.length,stopUntil:performance.now()+800,lastStopId:start.stopId||'',lastStopName:start.stopName||'',wheels,speed:route.speed,seatOffset:new THREE.Vector3(-.72,.94,.55),interiorSeats:8};g.position.set(start.x,.02,start.z);worldGroup.add(g);world.buses.push(bus);
    registerInteractable({id:`board-${bus.id}`,type:'bus',icon:'🚌',label:`Embarcar • ${route.number} ${route.name}`,radius:4.6,priority:210,getPos:()=>({x:bus.group.position.x,z:bus.group.position.z}),action:()=>enterBus(bus)});
    for(const point of route.points)if(point.stopId)ensureBusStop(route,point);return bus;
  }
  function createTransitWorld(){METRO_STATIONS.forEach(createMetroEntrance);BUS_ROUTES.forEach(route=>{for(let copy=0;copy<Math.max(1,Number(route.copies||2));copy++)createBusModel(route,copy);});}
  function busAtStop(bus){return performance.now()<Number(bus.stopUntil||0)&&!!bus.lastStopId;}
  function openBusStop(stop){
    const buses=world.buses.filter(b=>stop.routes.includes(b.route.id)).sort((a,b)=>Math.hypot(a.group.position.x-stop.roadX,a.group.position.z-stop.roadZ)-Math.hypot(b.group.position.x-stop.roadX,b.group.position.z-stop.roadZ));const ready=buses.find(b=>busAtStop(b)&&Math.hypot(b.group.position.x-stop.roadX,b.group.position.z-stop.roadZ)<1.2);
    openModal(`Parada ${stop.name}`,`<div class="transit-heading"><b>🚌 ${stop.routes.map(id=>BUS_ROUTES.find(r=>r.id===id)?.number).join(' • ')}</b><span>${ready?'Ônibus na parada. Embarque agora.':'Os ônibus continuam circulando em tempo real.'}</span></div><div class="bus-live-list">${buses.map(bus=>`<article><b>${bus.route.number} • ${bus.route.name}</b><span>${busAtStop(bus)?`Parado em ${bus.lastStopName}`:`Indo para ${bus.route.points[bus.pointIndex]?.stopName||'próximo trecho'}`}</span></article>`).join('')}</div><div class="modal-actions">${ready?`<button class="btn primary" data-board-ready="${ready.id}">Embarcar</button>`:`<button class="btn primary" data-wait-bus>Esperar nesta parada</button>`}</div>`,root=>{const board=$('[data-board-ready]',root);if(board)board.onclick=()=>{closeModal();enterBus(ready);};const wait=$('[data-wait-bus]',root);if(wait)wait.onclick=()=>{world.waitingForBus=stop.id;closeModal();toast(`Esperando na parada ${stop.name}.`,'good',1800);};});
  }
  function ensureTransitPanel(){
    if(transitPanel)return transitPanel;transitPanel=document.createElement('div');transitPanel.id='transitActivityPanel';transitPanel.className='transit-activity-panel';transitPanel.hidden=true;transitPanel.innerHTML='<div><b data-bus-line>Ônibus</b><span data-bus-next>Próxima parada</span></div><button type="button" data-bus-request>🔔<span>Pedir parada</span></button>';document.body.appendChild(transitPanel);transitPanel.querySelector('[data-bus-request]').onclick=()=>{if(player.transit.mode!=='bus')return;player.transit.requestStop=true;updateTransitPanel();toast('Parada solicitada.','good',1200);};return transitPanel;
  }
  function updateTransitPanel(){
    const panel=ensureTransitPanel(),bus=world.buses.find(b=>b.id===player.transit.busId);document.body.classList.toggle('bus-passenger',player.transit.mode==='bus'&&!!bus);panel.hidden=player.transit.mode!=='bus'||!bus;if(!bus)return;panel.querySelector('[data-bus-line]').textContent=`${bus.route.number} • ${bus.route.name}`;panel.querySelector('[data-bus-next]').textContent=`Próxima: ${bus.route.points.slice(bus.pointIndex).find(p=>p.stopId)?.stopName||'Terminal'}`;const button=panel.querySelector('[data-bus-request]');button.disabled=player.transit.requestStop;button.querySelector('span').textContent=player.transit.requestStop?'Solicitada':'Pedir parada';
  }
  function enterBus(bus){
    if(!bus||player.transit.mode||player.vehicle||player.boating){toast('Desembarque do transporte atual primeiro.','warn');return false;}if(!busAtStop(bus)){toast('Embarque somente quando o ônibus estiver parado.','warn');return false;}if(Math.hypot(player.x-bus.group.position.x,player.z-bus.group.position.z)>6.2){toast('Chegue mais perto da porta do ônibus.','warn');return false;}
    closeModal();clearMovementInputs();player.transit.mode='bus';player.transit.busId=bus.id;player.transit.requestStop=false;player.x=bus.group.position.x;player.z=bus.group.position.z;player.y=.94;player.vx=player.vz=0;player.sitUntil=Number.MAX_SAFE_INTEGER;if(playerModel)playerModel.visible=false;if(avatarLayer)avatarLayer.visible=false;if(contactShadow)contactShadow.visible=false;if(toolVisual)toolVisual.visible=false;
    bus.group.updateMatrixWorld(true);const cameraPos=bus.group.localToWorld(new THREE.Vector3(.28,2.28,-2.56)),cameraLook=bus.group.localToWorld(new THREE.Vector3(-.18,1.55,1.75));camera.position.copy(cameraPos);camera.fov=68;camera.lookAt(cameraLook);camera.updateProjectionMatrix();
    world.waitingForBus='';state.transport.busTrips=(state.transport.busTrips||0)+1;updateTransitPanel();toast(`Embarcou na linha ${bus.route.number}.`,'good',1800);saveState();return true;
  }
  function exitBusAtStop(bus,stop){
    if(player.transit.mode!=='bus')return false;const heading=bus.group.rotation.y;player.transit.mode='';player.transit.busId='';player.transit.requestStop=false;player.sitUntil=0;player.x=clamp(bus.group.position.x+Math.cos(heading)*3.6,-115,115);player.z=clamp(bus.group.position.z-Math.sin(heading)*3.6,-115,115);player.y=groundHeightAt(player.x,player.z);player.vx=player.vy=player.vz=0;player.grounded=true;if(playerModel)playerModel.visible=true;if(avatarLayer)avatarLayer.visible=true;if(contactShadow)contactShadow.visible=true;if(toolVisual)toolVisual.visible=true;const stopId=stop?.stopId||bus.lastStopId||'terminal';if(!state.transport.busStops.includes(stopId))state.transport.busStops.push(stopId);state.transport.busStops=state.transport.busStops.slice(-40);state.stats.busStops=(state.stats.busStops||0)+1;trackDaily('bus',1);advanceAdventure('bus',stopId);setFlag('rodeBus');updateTransitPanel();updateContext(true);saveState(true);toast(`Desembarcou: ${stop?.stopName||bus.lastStopName||'parada'}.`,'good',1900);return true;
  }
  function updateTransitWorld(dt){
    const now=performance.now();for(const bus of world.buses){
      if(now>=Number(bus.stopUntil||0)){const target=bus.route.points[bus.pointIndex],dx=target.x-bus.group.position.x,dz=target.z-bus.group.position.z,d=Math.hypot(dx,dz);if(d<=bus.speed*dt+.08){bus.group.position.set(target.x,.02,target.z);bus.pointIndex=(bus.pointIndex+1)%bus.route.points.length;if(target.stopId){bus.lastStopId=target.stopId;bus.lastStopName=target.stopName;bus.stopUntil=now+1900;if(world.waitingForBus===target.stopId&&Math.hypot(player.x-bus.group.position.x,player.z-bus.group.position.z)<7)enterBus(bus);if(player.transit.mode==='bus'&&player.transit.busId===bus.id&&player.transit.requestStop)exitBusAtStop(bus,target);}}else{const move=Math.min(d,bus.speed*dt),heading=Math.atan2(dx,dz);bus.group.position.x+=dx/d*move;bus.group.position.z+=dz/d*move;bus.group.rotation.y=lerpAngle(bus.group.rotation.y,heading,Math.min(1,dt*5));for(const wheel of bus.wheels)wheel.rotation.x-=move*2.2;}}
      if(player.transit.mode==='bus'&&player.transit.busId===bus.id){bus.group.updateMatrixWorld?.(true);const seat=bus.group.localToWorld(bus.seatOffset.clone());player.x=seat.x;player.z=seat.z;player.y=seat.y;player.facing=bus.group.rotation.y;player.vx=player.vz=0;}
    }updateTransitPanel();
  }
  function createPoliceCar(id,route,routeIndex=0){
    const g=new THREE.Group(),white=renderMat(0xf4f7fb,{roughness:.38,metalness:.16}),blue=renderMat(0x215ea8,{roughness:.34,metalness:.25}),dark=renderMat(0x13253a,{roughness:.14,metalness:.35,transparent:true,opacity:.78});
    premiumBox(2.0,.4,3.0,0x26384e,0,.32,0,g);premiumBox(1.9,.5,1.65,white,0,.66,.46,g);premiumBox(1.58,.48,1.1,blue,0,.86,-.42,g);premiumBox(1.38,.32,.88,dark,0,1.02,-.36,g);
    premiumBox(2.02,.34,.24,blue,0,.56,.88,g);premiumBox(2.02,.34,.24,blue,0,.56,-.88,g);premiumBox(.12,.36,1.7,blue,-.96,.58,0,g);premiumBox(.12,.36,1.7,blue,.96,.58,0,g);
    const lightBar=new THREE.Group();lightBar.position.set(0,1.36,-.2);g.add(lightBar);const red=premiumBox(.62,.18,.34,renderMat(0xe9404a,{emissive:0xb10e22,emissiveIntensity:.9}),-.34,0,0,lightBar),cyan=premiumBox(.62,.18,.34,renderMat(0x35bfff,{emissive:0x087db4,emissiveIntensity:.9}),.34,0,0,lightBar);
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(.72,.72),new THREE.MeshStandardMaterial({map:iconTexture('★','#ffffff','#215ea8'),transparent:true,side:THREE.DoubleSide}));sign.position.set(1.02,.72,.2);sign.rotation.y=Math.PI/2;g.add(sign);
    const wheels=[];for(const p of [[-.94,.28,-.88],[.94,.28,-.88],[-.94,.28,.88],[.94,.28,.88]]){const wheel=premiumCylinder(.36,.25,0x10151d,p[0],p[1],p[2],g,14);wheel.rotation.z=Math.PI/2;wheels.push(wheel);}
    g.traverse(o=>{if(o.isMesh)addVoxelOutline(o,0x132238,.22);});const start=route[routeIndex%route.length],car={id,group:g,route,routeIndex:(routeIndex+1)%route.length,speed:8.1,wheels,red,cyan,npcTarget:'',npcChaseUntil:0};g.position.set(start.x,.02,start.z);worldGroup.add(g);world.policeCars.push(car);return car;
  }
  function createPoliceSystem(){
    createPoliceCar('patrol-1',[{x:68,z:-12},{x:68,z:0},{x:100,z:0},{x:0,z:0},{x:-100,z:0},{x:0,z:0},{x:68,z:0}],0);
    createPoliceCar('patrol-2',[{x:55,z:0},{x:55,z:88},{x:55,z:0},{x:0,z:0},{x:0,z:-94},{x:0,z:0}],2);
  }
  function movePoliceToward(car,target,dt,speed=car.speed){
    const dx=target.x-car.group.position.x,dz=target.z-car.group.position.z,d=Math.hypot(dx,dz);if(d<.08)return d;const move=Math.min(d,speed*dt),heading=Math.atan2(dx,dz);car.group.position.x+=dx/d*move;car.group.position.z+=dz/d*move;car.group.rotation.y=lerpAngle(car.group.rotation.y,heading,Math.min(1,dt*6));for(const wheel of car.wheels)wheel.rotation.x-=move*2.8;return d;
  }
  function updatePolicePatrol(car,dt){
    const target=car.route[car.routeIndex],distance=movePoliceToward(car,target,dt);if(distance<.28)car.routeIndex=(car.routeIndex+1)%car.route.length;
  }
  function updateSafetyPanel(message=''){
    if(!els.safetyPanel)return;els.safetyPanel.hidden=!message;if(els.safetyStatus)els.safetyStatus.textContent=message;
  }
  function startPoliceAlert(car){
    if(world.policeAlert||!player.vehicle||player.car.passengerOf)return false;const now=performance.now();
    if(Date.now()-Number(state.safety.lastIncident||0)<5000)return false;
    state.safety.incidents=(state.safety.incidents||0)+1;state.safety.lastIncident=Date.now();world.policeAlert={carId:car.id,startedAt:now,slowSince:0};car.npcTarget='';saveState(true);updateSafetyPanel('Encoste com calma • solte o acelerador');toast('Patrulha de segurança: encoste com calma.','warn',2200);return true;
  }
  function finishSafetyStop(){
    const alert=world.policeAlert;if(!alert)return;world.policeAlert=null;state.safety.safeStops=(state.safety.safeStops||0)+1;
    if(player.vehicle)exitVehicle(true);clearMovementInputs();player.x=68;player.z=-12.2;player.y=groundHeightAt(player.x,player.z);player.vx=player.vy=player.vz=0;player.grounded=true;playerGroup?.position?.set(player.x,player.y,player.z);updateSafetyPanel('');saveState(true);setTimeout(()=>openSafetyLesson('incident'),120);
  }
  function openSafetyLesson(source='station'){
    const incident=source==='incident',questions=[
      {q:'Antes de dirigir, qual é a primeira atitude segura?',answers:['Colocar o cinto e observar ao redor','Acelerar para sair rápido','Olhar somente para a buzina'],correct:0},
      {q:'Ao ver outro veículo perto, o que devemos fazer?',answers:['Reduzir e manter distância','Fechar os olhos','Correr para chegar primeiro'],correct:0},
      {q:'Se acontecer uma batida no jogo, qual é a melhor escolha?',answers:['Parar, respirar e aprender','Bater novamente','Culpar alguém sem conversar'],correct:0}
    ],lesson=questions[(state.safety.lessons||0)%questions.length];
    openModal(incident?'Parada educativa':'Clube de Segurança',`<div class="safety-lesson"><span>🛡️</span><h3>${incident?'Todo mundo está bem!':'Vamos aprender trânsito seguro'}</h3><p>${incident?'A patrulha trouxe você ao posto para uma atividade rápida, sem violência e sem perda de conquistas.':'Treine escolhas seguras para pedestres, bicicletas e veículos.'}</p><b>${lesson.q}</b><div class="choice-grid">${lesson.answers.map((answer,index)=>`<button class="choice" data-safety-answer="${index}"><span>${answer}</span></button>`).join('')}</div><small>Ninguém perde moedas, itens ou progresso nesta atividade.</small></div>`,root=>{
      $$('[data-safety-answer]',root).forEach(button=>button.onclick=()=>{const correct=Number(button.dataset.safetyAnswer)===lesson.correct;state.safety.lessons=(state.safety.lessons||0)+1;if(correct){addXP(18);addReputation(3);awardMedal('Direção Segura');}saveState(true);closeModal();toast(correct?'Boa escolha! Segurança vem primeiro.':'Vamos lembrar: reduza, observe e cuide de todos.',correct?'good':'warn',2600);});
    });
  }
  function updatePoliceSystem(dt){
    const now=performance.now(),alert=world.policeAlert,alertCar=alert&&world.policeCars.find(car=>car.id===alert.carId);
    for(const car of world.policeCars){
      const active=alert&&car===alertCar;
      car.red.material.emissiveIntensity=(active||car.npcTarget)?(.45+Math.sin(now*.018)*.45):.16;car.cyan.material.emissiveIntensity=(active||car.npcTarget)?(.45+Math.sin(now*.018+Math.PI)*.45):.16;
      if(active){
        const distance=movePoliceToward(car,player,dt,12.8);const stopped=Math.abs(player.car.speed)<1.15;
        alert.slowSince=stopped?(alert.slowSince||now):0;updateSafetyPanel(stopped?'Muito bem • aguarde a patrulha':'Encoste com calma • solte o acelerador');
        if(!player.vehicle||distance<2.15||(alert.slowSince&&now-alert.slowSince>1100)||now-alert.startedAt>15000)finishSafetyStop();
      }else if(car.npcTarget){
        const npc=world.npcs.find(item=>item.id===car.npcTarget);if(!npc||now>car.npcChaseUntil){if(npc)npcSpeech(npc,'Vou reduzir a velocidade e dirigir com cuidado.');car.npcTarget='';}
        else if(movePoliceToward(car,npc.group.position,dt,10.2)<2.25){npc.policeCooldown=now+45000;npcSpeech(npc,'Entendi, patrulha! Segurança primeiro.');car.npcTarget='';}
      }else updatePolicePatrol(car,dt);
    }
    if(!alert&&player.vehicle&&!player.car.passengerOf&&Math.abs(player.car.speed)>1.4){
      const hit=world.policeCars.find(car=>Math.hypot(player.x-car.group.position.x,player.z-car.group.position.z)<2.45);if(hit)startPoliceAlert(hit);
    }
    if(!alert){
      for(const car of world.policeCars){if(car.npcTarget)continue;const npc=world.npcs.find(item=>item.mobility&&['car','moto'].includes(item.mobility.type)&&now>Number(item.policeCooldown||0)&&Math.hypot(item.group.position.x-car.group.position.x,item.group.position.z-car.group.position.z)<2.0);if(npc){car.npcTarget=npc.id;car.npcChaseUntil=now+6500;npc.policeCooldown=now+45000;break;}}
    }
  }
  function openTransitGuide(){
    openModal('Rede de transporte',`<div class="transport-summary"><article><b>${state.transport.metroTrips||0}</b><span>viagens de metrô</span></article><article><b>${state.transport.busTrips||0}</b><span>viagens de ônibus</span></article><article><b>${state.transport.busStops.length}</b><span>paradas visitadas</span></article></div><h3>Estações de metrô</h3><div class="transit-directory">${METRO_STATIONS.map(s=>`<button data-transit-waypoint="metro-${s.id}"><b>Ⓜ️ ${s.name}</b><span>${s.line}</span></button>`).join('')}</div><h3>Linhas de ônibus</h3><div class="transit-directory">${BUS_ROUTES.map(r=>`<article><b>🚌 ${r.number} • ${r.name}</b><span>${[...new Set(r.points.filter(p=>p.stopName).map(p=>p.stopName))].join(' → ')}</span></article>`).join('')}</div>`,root=>{$$('[data-transit-waypoint]',root).forEach(btn=>btn.onclick=()=>setWaypoint(btn.dataset.transitWaypoint));});
  }

  function createRoyalCastle(x,z){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);const stone=0x8996a5,dark=0x657587,trim=0xc9d0d8,roof=0x315aa8,gold=0xf5c846;
    const moatA=premiumBox(8.2,.18,2.5,materials.water,-8.1,.08,-13.8,g),moatB=premiumBox(8.2,.18,2.5,materials.water,8.1,.08,-13.8,g),moatBack=premiumBox(27,.18,2.2,materials.water,0,.08,13.5,g);for(const water of [moatA,moatB,moatBack])water.material.depthWrite=false;
    premiumBox(31,.7,25,dark,0,.35,0,g);premiumBox(27,.45,21,0xb5bac1,0,.82,0,g);
    premiumBox(10,6.4,2.1,stone,-8.5,4, -10,g);premiumBox(10,6.4,2.1,stone,8.5,4,-10,g);premiumBox(27,6.4,2.1,stone,0,4,10,g);premiumBox(2.1,6.4,18,stone,-13.5,4,0,g);premiumBox(2.1,6.4,18,stone,13.5,4,0,g);
    premiumBox(10,8.5,8.5,dark,0,5.1,3.5,g);premiumBox(8.6,7.5,7.2,stone,0,5.4,2.8,g);premiumBox(4.2,4.8,.8,0x20364f,0,3.2,-1.05,g);
    for(const [tx,tz] of [[-13,-10],[13,-10],[-13,10],[13,10]]){premiumCylinder(3.6,10,stone,tx,5.5,tz,g,12);premiumCylinder(4,1.1,trim,tx,10.2,tz,g,12);const cone=new THREE.Mesh(new THREE.ConeGeometry(4.25,4.8,12),renderMat(roof,{roughness:.55,metalness:.08}));cone.position.set(tx,13.05,tz);cone.castShadow=true;g.add(cone);premiumBox(.16,2,.16,gold,tx,16.2,tz,g);const flag=premiumBox(1.8,.8,.08,0xe43d4c,tx+.9,16.7,tz,g);flag.rotation.y=.15;}
    const battlement=(px,pz,alongX,count)=>{for(let i=0;i<count;i++){const offset=(i-(count-1)/2)*2.15;premiumBox(1.25,1.15,1.25,trim,px+(alongX?offset:0),7.75,pz+(alongX?0:offset),g);}};battlement(-8.3,-10,true,4);battlement(8.3,-10,true,4);battlement(0,10,true,11);battlement(-13.5,0,false,7);battlement(13.5,0,false,7);
    for(const wx of [-4.8,0,4.8]){premiumBox(1.2,1.9,.18,0x5ee7ff,wx,6.7,-1.05,g);premiumBox(.12,1.9,.2,trim,wx,6.7,-1.15,g);}premiumBox(5.2,.35,5.8,materials.wood,0,.34,-12.3,g);
    for(const px of [-9,-5,5,9]){premiumCylinder(.48,.56,0xc88a45,px,1.1,4.8,g,10);premiumBox(.82,.3,.82,px<0?0xff6fa8:0xffd34d,px,1.55,4.8,g);}
    for(const a of [-1,1]){const chain=premiumCylinder(.08,5.5,0x333b45,a*2.2,2.8,-11.4,g,8);chain.rotation.x=Math.PI/2;chain.rotation.z=.1*a;}const crown=new THREE.Mesh(new THREE.OctahedronGeometry(.85,0),mat(gold,{emissive:0xb87900,emissiveIntensity:.7}));crown.position.set(0,10.7,2.5);g.add(crown);addGlow(x,10.7,z+2.5,gold,5);
    createSignpost(x-8,z-13,'Castelo Real',0);registerInteractable({id:'castle-adventures',type:'adventure',icon:'🏰',label:'Desafios do Castelo',x,z:z-11.5,radius:5.2,priority:195,action:openAdventureHub});world.castle=g;createCastleChallengeTokens();return g;
  }
  function createCastleChallengeTokens(){
    const coords=[[-10,-7],[10,-7],[-10,7],[10,7],[0,5],[-6,1]];world.challengeTokens=coords.map(([dx,dz],i)=>{const mesh=new THREE.Mesh(new THREE.OctahedronGeometry(.62,0),mat(0xffd34d,{emissive:0xc68400,emissiveIntensity:1.1,metalness:.22,roughness:.25}));mesh.position.set(88+dx,1.5,62+dz);mesh.visible=false;worldGroup.add(mesh);return{id:`crown-${i}`,x:88+dx,z:62+dz,mesh,got:false};});
  }
  function openAdventureHub(){
    const active=world.activeChallenge,completed=new Set(state.adventures.completed||[]);openModal('Desafios da cidade',`${active?`<div class="active-adventure"><b>${ADVENTURE_DEFS[active.type]?.icon} Em andamento: ${ADVENTURE_DEFS[active.type]?.name}</b><span>${active.progress.size}/${active.target}</span></div>`:''}<div class="adventure-grid">${Object.entries(ADVENTURE_DEFS).map(([id,d])=>`<button class="adventure-card ${completed.has(id)?'completed':''}" data-adventure="${id}" ${active?'disabled':''}><span>${d.icon}</span><b>${d.name}</b><small>${d.description}</small><em>${completed.has(id)?'✓ Concluído':`${d.reward} moedas • ${d.xp} XP`}</em></button>`).join('')}</div>`,root=>{$$('[data-adventure]',root).forEach(btn=>btn.onclick=()=>startAdventure(btn.dataset.adventure));});
  }
  function startAdventure(type){
    const def=ADVENTURE_DEFS[type];if(!def||world.activeChallenge||activeRace)return;if(type==='castle'&&Math.hypot(player.x-88,player.z-52)>15){setWaypoint('castle');toast('Siga a rota até o Castelo para começar.','good',2200);return;}closeModal();world.activeChallenge={type,target:def.target,progress:new Set(),startedAt:performance.now(),endsAt:type==='castle'?performance.now()+75000:0};state.adventures.active={type,startedAt:Date.now()};if(type==='castle')for(const token of world.challengeTokens){token.got=false;token.mesh.visible=true;}els.raceBadge.hidden=false;els.raceTitle.textContent=`${def.icon} ${def.name}`;els.raceStatus.textContent=`0/${def.target}`;toast(`${def.name} começou!`,'good',1900);saveState();
  }
  function advanceAdventure(type,key){
    const active=world.activeChallenge;if(!active||active.type!==type||active.progress.has(key))return false;active.progress.add(key);els.raceStatus.textContent=`${active.progress.size}/${active.target}`;beep(780,55,'sine');if(active.progress.size>=active.target)finishAdventure(true);return true;
  }
  function finishAdventure(success){
    const active=world.activeChallenge;if(!active)return;const def=ADVENTURE_DEFS[active.type];for(const token of world.challengeTokens)token.mesh.visible=false;world.activeChallenge=null;state.adventures.active=null;els.raceBadge.hidden=true;if(success){if(!state.adventures.completed.includes(active.type))state.adventures.completed.push(active.type);const elapsed=(performance.now()-active.startedAt)/1000,stateBest=Number(state.adventures.bestTimes[active.type]||Infinity);state.adventures.bestTimes[active.type]=Math.min(stateBest,elapsed);addCoins(def.reward);addXP(def.xp);addReputation(8);awardMedal(def.name);if(active.type==='castle')setFlag('castleChallenge');toast(`Desafio concluído! +${def.reward} moedas`,'good',2600);}else toast('Tempo esgotado. Tente novamente!','warn',2200);saveState(true);
  }
  function updateAdventure(){
    const active=world.activeChallenge;if(!active)return;if(active.type==='castle'){if(performance.now()>=active.endsAt){finishAdventure(false);return;}for(const token of world.challengeTokens){if(token.got)continue;token.mesh.rotation.y+=.08;token.mesh.position.y=1.45+Math.sin(animTime*3+token.x)*.18;if(Math.hypot(player.x-token.x,player.z-token.z)<1.5){token.got=true;token.mesh.visible=false;advanceAdventure('castle',token.id);}}if(world.activeChallenge)els.raceStatus.textContent=`${active.progress.size}/${active.target} • ${Math.ceil((active.endsAt-performance.now())/1000)} s`;}}

  function createLearningStation(id,subject,x,z,color,icon,label){
    const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);premiumBox(2.5,.35,2.5,0x34485e,0,.18,0,g);premiumBox(1.7,2.1,1.2,color,0,1.35,0,g);const panel=new THREE.Mesh(new THREE.PlaneGeometry(1.25,1.25),new THREE.MeshStandardMaterial({map:iconTexture(icon,color,'#ffffff'),roughness:.35,emissive:new THREE.Color(color),emissiveIntensity:.12,side:THREE.DoubleSide}));panel.position.set(0,1.55,.63);g.add(panel);const beacon=new THREE.Mesh(new THREE.OctahedronGeometry(.34,0),mat(color,{emissive:color,emissiveIntensity:1.1}));beacon.position.y=2.75;g.add(beacon);registerInteractable({id:`learning-${id}`,type:'education',icon,label,x,z,radius:3,priority:130,action:()=>openEducationHub(subject)});world.landmarks.push(g);return g;
  }
  function createLearningPlaza(){createLearningStation('math','math',22,-32,0x27b36a,'＋','Jogar Matemática Kids');createLearningStation('portuguese','portuguese',22,-40,0x7b5ce6,'A','Jogar Português Kids');createLearningStation('english','english',22,-48,0x168de2,'E','Jogar English Kids');createSignpost(22,-27,'Academia Kids',Math.PI/2);}

  const FISH_SPECIES=[
    {name:'Tilápia',rarity:'comum',weight:44,min:.25,max:1.8,xp:16,coins:5},{name:'Lambari',rarity:'comum',weight:30,min:.08,max:.35,xp:10,coins:3},{name:'Traíra',rarity:'incomum',weight:16,min:.5,max:2.8,xp:28,coins:9},{name:'Pacu',rarity:'raro',weight:8,min:1.1,max:4.8,xp:44,coins:16},{name:'Dourado',rarity:'lendário',weight:2,min:2.0,max:7.2,xp:90,coins:35}
  ];
  let fishingSession=null,fishingVisual=null,waterWarningAt=0,boatPanel=null,extensionPreview=null,extensionDraft=null;
  const ROOM_SPECS={bedroom:{name:'Quarto',icon:'🛏️',color:0x4f8ed7,cost:{wood:8,stone:4,blocks:4}},living:{name:'Sala',icon:'🛋️',color:0xe4a044,cost:{wood:7,stone:4,blocks:5}},kitchen:{name:'Cozinha',icon:'🍳',color:0xe8d7bd,cost:{wood:7,stone:6,blocks:4}},bathroom:{name:'Banheiro',icon:'🚿',color:0x65c7df,cost:{wood:5,stone:8,blocks:4}},workroom:{name:'Oficina',icon:'🛠️',color:0x7f8c98,cost:{wood:8,stone:8,blocks:6}},porch:{name:'Varanda',icon:'🌤️',color:0xb77942,cost:{wood:10,stone:2,blocks:2}},storage:{name:'Depósito',icon:'📦',color:0x94633b,cost:{wood:9,stone:5,blocks:4}}};
  function rectOverlap(a,b,pad=0){return Math.abs(a.x-b.x)<(a.w+b.w)/2+pad&&Math.abs(a.z-b.z)<(a.d+b.d)/2+pad;}
  function insideWater(x,z,h){return Math.abs(x-h.x)<=h.w/2&&Math.abs(z-h.z)<=h.d/2;}
  function waterAt(x,z){return(world.hazards||[]).find(h=>h.type==='water'&&insideWater(x,z,h));}
  function isInsideLakeNavigable(x,z){return (x>=-113&&x<=-29&&z>=44&&z<=60)||(x>=-116&&x<=-82&&z>=55&&z<=84);}
  function isNearFishingArea(){return player.boating||Math.hypot(player.x+28,player.z-45)<9||Math.hypot(player.x+27,player.z-57)<9;}
  function resolveWaterWalking(prevX,prevZ){if(player.boating||player.vehicle||currentHouse)return;const h=waterAt(player.x,player.z);if(!h||groundHeightAt(player.x,player.z)>.24)return;player.x=prevX;player.z=prevZ;player.vx=player.vz=0;if(performance.now()-waterWarningAt>1700){waterWarningAt=performance.now();toast('A água é funda. Use o píer e o barco.','warn',1900);}}

  const BOAT_DOCK={minX:-36,maxX:-24,minZ:50.5,maxZ:53.5,exitX:-23.25,touchDistance:4.4};
  function distanceToBoatDock(x=player.x,z=player.z){const nx=clamp(x,BOAT_DOCK.minX,BOAT_DOCK.maxX),nz=clamp(z,BOAT_DOCK.minZ,BOAT_DOCK.maxZ);return Math.hypot(x-nx,z-nz);}
  function validBoatExit(){return distanceToBoatDock()<=BOAT_DOCK.touchDistance;}
  function safeBoatExitPoint(){return{x:BOAT_DOCK.exitX,z:clamp(player.z,BOAT_DOCK.minZ+.25,BOAT_DOCK.maxZ-.25)};}

  function ensureFishingVisual(){
    if(fishingVisual||!playerGroup||!worldGroup)return fishingVisual;
    const rodRoot=new THREE.Group();rodRoot.visible=false;rodRoot.position.set(.56,1.34,.05);playerGroup.add(rodRoot);
    const rod=new THREE.Mesh(new THREE.CylinderGeometry(.035,.06,2.3,8),renderMat(0x7b4a20,{roughness:.68}));rod.rotation.x=Math.PI/2;rod.position.z=1.08;rod.castShadow=false;rodRoot.add(rod);
    const handle=new THREE.Mesh(new THREE.CylinderGeometry(.065,.075,.38,8),renderMat(0x202833,{roughness:.58}));handle.rotation.x=Math.PI/2;handle.position.z=-.12;rodRoot.add(handle);
    const reel=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.12,10),renderMat(0x4ba7d8,{metalness:.25,roughness:.35}));reel.rotation.z=Math.PI/2;reel.position.set(.1,-.08,.15);rodRoot.add(reel);
    const tip=new THREE.Object3D();tip.position.set(0,0,2.25);rodRoot.add(tip);
    const lineGeometry=new THREE.BufferGeometry();lineGeometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3).setUsage(THREE.DynamicDrawUsage));
    const line=new THREE.Line(lineGeometry,new THREE.LineBasicMaterial({color:0xeaf8ff,transparent:true,opacity:.88,depthWrite:false}));line.visible=false;line.frustumCulled=false;worldGroup.add(line);
    const bobber=new THREE.Group();const floatBall=new THREE.Mesh(new THREE.SphereGeometry(.11,10,8),renderMat(0xfff3d0,{emissive:0xffd95a,emissiveIntensity:.45,roughness:.35}));floatBall.scale.y=.8;bobber.add(floatBall);const floatTop=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.22,7),renderMat(0xff3d46,{roughness:.4}));floatTop.position.y=.14;bobber.add(floatTop);bobber.visible=false;worldGroup.add(bobber);
    const fish=new THREE.Group();const fishBody=new THREE.Mesh(new THREE.SphereGeometry(.28,12,8),renderMat(0x45b7cf,{roughness:.45,metalness:.08}));fishBody.scale.set(1.25,.58,.48);fish.add(fishBody);const tail=new THREE.Mesh(new THREE.ConeGeometry(.24,.48,4),renderMat(0x2a8fa8,{roughness:.5}));tail.rotation.z=-Math.PI/2;tail.position.x=-.48;fish.add(tail);const eye=new THREE.Mesh(new THREE.SphereGeometry(.035,7,6),renderMat(0x111827,{roughness:.3}));eye.position.set(.27,.08,.13);fish.add(eye);fish.visible=false;worldGroup.add(fish);
    fishingVisual={active:false,phase:'idle',source:'shore',rodRoot,tip,line,bobber,fish,target:new THREE.Vector3(),castStart:new THREE.Vector3(),phaseAt:0,hideToken:0,fishSize:1};
    return fishingVisual;
  }
  function setFishingLine(a,b){const v=fishingVisual;if(!v)return;const attr=v.line.geometry.getAttribute('position'),arr=attr.array;arr[0]=a.x;arr[1]=a.y;arr[2]=a.z;arr[3]=b.x;arr[4]=b.y;arr[5]=b.z;attr.needsUpdate=true;}
  function fishingCastTarget(source){
    let dx,dz,dist=source==='boat'?5.4:5.0;
    if(source==='boat'){const heading=player.boat.heading;dx=Math.sin(heading);dz=Math.cos(heading);}else{dx=-45-player.x;dz=52-player.z;const m=Math.hypot(dx,dz)||1;dx/=m;dz/=m;}
    let x=player.x+dx*dist,z=player.z+dz*dist;
    if(!isInsideLakeNavigable(x,z)){dx=-72-player.x;dz=52-player.z;const m=Math.hypot(dx,dz)||1;x=player.x+dx/m*dist;z=player.z+dz/m*dist;}
    return new THREE.Vector3(x,.16,z);
  }
  function beginFishingVisual(source){
    const v=ensureFishingVisual();if(!v)return;v.hideToken++;v.active=true;v.phase='ready';v.source=source;v.phaseAt=performance.now();v.rodRoot.visible=true;v.line.visible=true;v.bobber.visible=true;v.fish.visible=false;v.rodRoot.rotation.set(-.48,0,-.08);player.emoteType='fishing';player.emoteUntil=performance.now()+600000;player.emoteSeq=(player.emoteSeq||0)+1;const tip=new THREE.Vector3();v.tip.getWorldPosition(tip);v.bobber.position.copy(tip);setFishingLine(tip,v.bobber.position);
  }
  function castFishingVisual(){const v=ensureFishingVisual();if(!v?.active)return;v.tip.getWorldPosition(v.castStart);v.target.copy(fishingCastTarget(v.source));v.phase='casting';v.phaseAt=performance.now();beep(420,55,'sine');}
  function hookFishingVisual(){const v=fishingVisual;if(!v?.active)return;v.phase='hooked';v.phaseAt=performance.now();v.bobber.scale.setScalar(1.28);}
  function pullFishingVisual(success,fishData){const v=fishingVisual;if(!v?.active)return;v.phase=success?'pulling':'escaping';v.phaseAt=performance.now();v.fishSize=clamp(.8+Number(fishData?.size||.5)*.08,.82,1.35);v.fish.scale.setScalar(v.fishSize);v.fish.visible=!!success;}
  function stopFishingVisual(delay=0){
    const v=fishingVisual;if(!v)return;const token=++v.hideToken;const hide=()=>{if(token!==v.hideToken)return;v.active=false;v.phase='idle';v.rodRoot.visible=false;v.line.visible=false;v.bobber.visible=false;v.fish.visible=false;v.bobber.scale.setScalar(1);if(player.emoteType==='fishing'){player.emoteType='';player.emoteUntil=0;player.emoteSeq=(player.emoteSeq||0)+1;}};if(delay>0)setTimeout(hide,delay);else hide();
  }
  function clearFishingTimers(session=fishingSession){if(!session)return;clearTimeout(session.hookTimer);clearTimeout(session.escapeTimer);clearTimeout(session.finishTimer);}
  function cancelFishingSession(){clearFishingTimers();fishingSession=null;stopFishingVisual();}
  function ensureFishingModalStyle(){
    if(document.getElementById('otthosFishingModalStyle'))return;const style=document.createElement('style');style.id='otthosFishingModalStyle';style.textContent=`
      .modal.fishing-modal{background:transparent!important;backdrop-filter:none!important;pointer-events:none!important;align-items:flex-start!important;justify-content:center!important;padding-top:clamp(155px,31dvh,285px)!important}
      .modal.fishing-modal .modal-card{pointer-events:auto!important;width:min(360px,calc(100vw - 18px))!important;max-height:none!important;border-radius:18px!important;background:rgba(5,22,38,.92)!important;box-shadow:0 12px 32px rgba(0,0,0,.42)!important}
      .modal.fishing-modal .modal-card>header{position:absolute!important;right:4px!important;top:3px!important;z-index:3!important;padding:0!important;min-height:0!important;border:0!important}.modal.fishing-modal .modal-card>header h2{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip-path:inset(50%)!important}.modal.fishing-modal .modal-card>header button{width:32px!important;height:32px!important;background:rgba(255,255,255,.12)!important}
      .modal.fishing-modal .modal-body{padding:10px 42px 10px 10px!important;max-height:none!important;overflow:visible!important}.modal.fishing-modal .activity-card{padding:0!important}.modal.fishing-modal .fishing-compact-status{min-height:24px;display:flex;align-items:center;font-size:14px;font-weight:900;color:#fff}.modal.fishing-modal .activity-meter{margin:6px 0!important;height:7px!important}.modal.fishing-modal .btn.xl{min-height:38px!important;padding:7px 11px!important;font-size:13px!important}
      @media (orientation:landscape) and (max-height:560px){.modal.fishing-modal{align-items:flex-start!important;justify-content:flex-start!important;padding:72px 0 0 max(12px,env(safe-area-inset-left))!important}.modal.fishing-modal .modal-card{width:min(330px,45vw)!important}}
    `;document.head.appendChild(style);
  }
  function updateFishingVisual(){
    const v=fishingVisual;if(!v?.active)return;const now=performance.now(),tip=new THREE.Vector3();v.tip.getWorldPosition(tip);let lineEnd=v.bobber.position;
    if(v.phase==='ready'){v.bobber.position.copy(tip);v.rodRoot.rotation.x=lerp(v.rodRoot.rotation.x,-.48,.18);}
    else if(v.phase==='casting'){const t=clamp((now-v.phaseAt)/620,0,1),ease=1-Math.pow(1-t,3);v.bobber.position.lerpVectors(v.castStart,v.target,ease);v.bobber.position.y+=Math.sin(Math.PI*t)*2.35;v.rodRoot.rotation.x=lerp(-.18,-.72,ease);if(t>=1){v.phase='waiting';v.phaseAt=now;v.bobber.position.copy(v.target);}}
    else if(v.phase==='waiting'){v.bobber.position.set(v.target.x,.15+Math.sin(now*.007)*.035,v.target.z);v.rodRoot.rotation.x=lerp(v.rodRoot.rotation.x,-.62,.08);}
    else if(v.phase==='hooked'){v.bobber.position.set(v.target.x,.09+Math.sin(now*.026)*.11,v.target.z);v.bobber.scale.setScalar(1.12+Math.sin(now*.03)*.12);v.rodRoot.rotation.x=lerp(v.rodRoot.rotation.x,-.82,.12);}
    else if(v.phase==='pulling'){const t=clamp((now-v.phaseAt)/820,0,1),ease=1-Math.pow(1-t,3);v.bobber.position.lerpVectors(v.target,tip,ease);v.bobber.position.y+=Math.sin(Math.PI*t)*1.3;v.fish.position.copy(v.bobber.position);v.fish.position.y-=.18;v.fish.rotation.y+=.16;v.fish.rotation.z=Math.sin(now*.025)*.35;v.rodRoot.rotation.x=lerp(v.rodRoot.rotation.x,-1.02,.15);if(t>=1){v.phase='caught';v.phaseAt=now;v.bobber.visible=false;}}
    else if(v.phase==='caught'){v.fish.position.copy(tip);v.fish.position.y-=.35;v.fish.position.x+=Math.sin(now*.02)*.08;v.fish.rotation.z=Math.sin(now*.028)*.42;lineEnd=tip;}
    else if(v.phase==='escaping'){const t=clamp((now-v.phaseAt)/760,0,1);v.bobber.position.set(v.target.x,.12-t*.5,v.target.z);v.bobber.scale.setScalar(1-t*.65);if(t>=1)stopFishingVisual();}
    setFishingLine(tip,lineEnd);
  }
  function createBoatModel(){
    const g=new THREE.Group();const hull=renderMat(0x7b3f20,{roughness:.72}),edge=renderMat(0xe3ad55,{roughness:.62}),seat=renderMat(0x374151,{roughness:.72});
    premiumBox(2.4,.42,4.4,hull,0,.38,0,g);premiumBox(2.75,.25,3.85,edge,0,.67,0,g);premiumBox(1.85,.23,3.15,renderMat(0x2d6f8d,{roughness:.48}),0,.83,0,g);premiumBox(1.75,.25,.55,seat,0,1.02,-.65,g);premiumBox(1.75,.25,.55,seat,0,1.02,.72,g);premiumBox(.12,1.8,.12,0xd8c28d,.95,1.35,.1,g);premiumBox(1.45,.05,.72,0xf5f1df,.25,2.05,.1,g);g.position.set(-38,.1,52);worldGroup.add(g);world.boat={id:'lake-boat',group:g,x:-38,z:52,heading:0,driverUid:'',passengerUid:''};
    registerInteractable({id:'lake-boat-entry',type:'boat',icon:'🛶',label:'Entrar no barco',radius:3.1,priority:180,getPos:()=>({x:world.boat?.group.position.x||-38,z:world.boat?.group.position.z||52}),action:enterBoat});
  }
  function ensureBoatPanel(){
    if(boatPanel)return boatPanel;boatPanel=document.createElement('div');boatPanel.id='boatActivityPanel';boatPanel.className='boat-activity-panel';boatPanel.innerHTML='<button type="button" data-boat-fish>🎣<span>Pescar</span></button><button type="button" data-boat-exit>🏝️<span>Sair</span></button>';document.body.appendChild(boatPanel);boatPanel.querySelector('[data-boat-fish]').onclick=()=>startFishing('boat');boatPanel.querySelector('[data-boat-exit]').onclick=()=>exitBoat();return boatPanel;
  }
  function updateBoatPanel(){const panel=ensureBoatPanel();panel.hidden=!player.boating;if(player.boating){const passenger=!!player.boat.passengerOf;panel.querySelector('[data-boat-fish]').disabled=passenger;panel.querySelector('[data-boat-fish] span').textContent=passenger?'Passageiro':'Pescar';}}
  async function enterBoat(){
    if(player.boating)return;if(player.vehicle)exitVehicle(true);if(player.transit.mode)return;if(!world.boat)return;const p=world.boat.group.position;if(Math.hypot(player.x-p.x,player.z-p.z)>3.6){toast('Chegue perto do barco pelo píer.','warn');return;}const lock=await window.OTTHOS_RTDB?.claimBoat?.(world.boat.id);if(lock&&lock.ok===false){toast(lock.error||'O barco já está sendo usado por outro jogador.','warn',2800);return;}player.boating=true;player.boat.passengerOf='';player.boat.passengerUid='';player.boat.passengerBotId='';player.boat.heading=world.boat.heading||0;player.boat.speed=0;player.boat.steerVisual=0;player.x=p.x;player.z=p.z;player.y=.18;player.vx=player.vz=0;state.boats.activeBoatId=world.boat.id;state.boats.passengerOf='';const companion=nearestRideCompanion(9);if(companion)boardNpcPassenger(companion,'boat');updateBoatPanel();toast('Barco pronto. Use o manche para navegar.','good',2300);saveState(true);
  }
  function enterBoatAsPassenger(hostUid){
    const ghost=world.ghosts.get(hostUid);if(!ghost){toast('O barco do jogador não está mais disponível.','warn');return false;}if(player.vehicle)exitVehicle(true);if(player.transit.mode)return false;player.boating=true;player.boat.passengerOf=hostUid;player.boat.passengerBotId='';player.boat.speed=0;player.x=ghost.position.x;player.z=ghost.position.z;state.boats.activeBoatId='lake-boat';state.boats.passengerOf=hostUid;updateBoatPanel();toast('Você entrou como passageiro. O motorista controla o barco.','good',2600);saveState(true);return true;
  }
  function exitBoat(silent=false){
    if(!player.boating)return false;if(!silent&&!validBoatExit()){toast('Encoste a lateral do barco no píer para sair com segurança.','warn',2500);return false;}const passengerHost=player.boat.passengerOf,hostedPassenger=player.boat.passengerUid,wasPassenger=!!passengerHost;if(passengerHost)window.OTTHOS_RTDB?.sendInteraction?.(passengerHost,{type:'boatPassengerLeft'});else if(hostedPassenger)window.OTTHOS_RTDB?.sendInteraction?.(hostedPassenger,{type:'boatEnded'});releaseNpcPassenger('boat');player.boating=false;player.boat.passengerOf='';player.boat.passengerUid='';player.boat.speed=0;player.boat.steerVisual=0;state.boats.passengerOf='';state.boats.activeBoatId='';if(!wasPassenger&&world.boat)window.OTTHOS_RTDB?.releaseBoat?.(world.boat.id);if(world.boat&&!wasPassenger){world.boat.group.position.set(player.x,.1,player.z);world.boat.heading=player.boat.heading;world.boat.group.rotation.y=player.boat.heading;}const safe=safeBoatExitPoint();player.x=safe.x;player.z=safe.z;player.y=groundHeightAt(safe.x,safe.z);player.vx=player.vz=0;updateBoatPanel();if(!silent)toast('Você desembarcou no píer.','good');saveState(true);return true;
  }
  function updateBoatPhysics(dt,ix,iz){
    const boat=player.boat;if(boat.passengerOf){const ghost=world.ghosts.get(boat.passengerOf),target=ghost?.userData?.target;if(!ghost||!target){boat.hostMissingAt=boat.hostMissingAt||performance.now();if(performance.now()-boat.hostMissingAt>3500){toast('O motorista saiu. Você voltou ao píer.','warn');player.x=-24.7;player.z=52;exitBoat(true);}player.vx=player.vz=0;return;}boat.hostMissingAt=0;const tx=Number(target.x||ghost.position.x),tz=Number(target.z||ghost.position.z);player.vx=clamp((tx-player.x)*8,-18,18);player.vz=clamp((tz-player.z)*8,-18,18);boat.heading=Number(target.r||boat.heading);player.facing=boat.heading;return;}
    const throttle=Math.abs(iz)<.06?0:iz,steer=Math.abs(ix)<.07?0:ix;const braking=boat.speed*throttle<-.08?1.7:1;boat.speed+=throttle*8.2*braking*dt;if(!throttle)boat.speed*=Math.pow(.12,dt);boat.speed=clamp(boat.speed,-3.2,8.4);boat.steerVisual=lerp(boat.steerVisual||0,steer,Math.min(1,dt*6.5));const authority=clamp(Math.abs(boat.speed)/2.8,0,1);const turnRate=1.45/(1+Math.abs(boat.speed)*.075);boat.heading+=boat.steerVisual*turnRate*authority*dt*(boat.speed<-.08?-1:1);player.vx=Math.sin(boat.heading)*boat.speed;player.vz=Math.cos(boat.heading)*boat.speed;player.facing=boat.heading;
  }
  function constrainBoat(prevX,prevZ){if(!player.boating)return;if(!isInsideLakeNavigable(player.x,player.z)){player.x=prevX;player.z=prevZ;player.boat.speed*=-.18;player.vx=player.vz=0;}if(world.boat){world.boat.group.position.set(player.x,.1,player.z);world.boat.group.rotation.y=player.boat.heading;world.boat.heading=player.boat.heading;}state.boats.lastPosition={x:+player.x.toFixed(2),z:+player.z.toFixed(2),heading:+player.boat.heading.toFixed(3)};}
  function weightedFish(){let r=Math.random()*100;for(const fish of FISH_SPECIES){r-=fish.weight;if(r<=0)return fish;}return FISH_SPECIES[0];}
  function startFishing(source='shore',options={}){
    if(fishingSession){toast('Finalize a pesca atual primeiro.','warn');return;}if((state.inventory.fishingRod||0)<1){toast('Você precisa de uma vara de pesca.','warn');return;}if((state.inventory.bait||0)<1){toast('Você ficou sem isca.','warn');return;}if(source==='boat'&&!player.boating){toast('Entre no barco primeiro.','warn');return;}if(source!=='boat'&&!isNearFishingArea()){toast('Pesque somente nos pontos marcados da margem.','warn');return;}const wait=Math.max(0,6500-(Date.now()-Number(state.fishing.lastAttempt||0)));if(wait>0){toast(`Aguarde ${Math.ceil(wait/1000)} s para tentar novamente.`,'warn');return;}
    const token=uid();fishingSession={token,source,options,hookTimer:0,escapeTimer:0,finishTimer:0};beginFishingVisual(source);ensureFishingModalStyle();openModal(options.cooperative?'Pesca com amigo':'Pesca',`<div class="activity-card fishing-card"><div class="fishing-compact-status" data-fishing-status>🎣 Pronto</div><div class="activity-meter"><i data-fishing-meter></i></div><button class="btn primary xl" data-cast>Lançar</button><button class="btn good xl" data-pull hidden>PUXAR!</button></div>`,root=>{
      els.modal.classList.add('fishing-modal');
      const status=$('[data-fishing-status]',root),cast=$('[data-cast]',root),pull=$('[data-pull]',root),meter=$('[data-fishing-meter]',root);
      cast.onclick=()=>{if(!fishingSession||fishingSession.token!==token)return;cast.disabled=true;state.inventory.bait--;state.fishing.lastAttempt=Date.now();saveState(true);status.textContent='🎣 Aguarde…';meter.style.animation='fishingWait 2.4s linear forwards';castFishingVisual();const hookDelay=1400+Math.random()*1700;fishingSession.hookTimer=setTimeout(()=>{if(!fishingSession||fishingSession.token!==token||els.modal.hidden){cancelFishingSession();return;}status.textContent='⚡ Fisgou!';pull.hidden=false;hookFishingVisual();beep(880,100,'sine');vibrate([35,35,55]);fishingSession.hookedAt=performance.now();fishingSession.escapeTimer=setTimeout(()=>{if(!fishingSession||fishingSession.token!==token)return;status.textContent='💨 Escapou';pull.hidden=true;pullFishingVisual(false);fishingSession.finishTimer=setTimeout(()=>{if(fishingSession?.token===token)fishingSession=null;stopFishingVisual();},800);},2700);},hookDelay);};
      pull.onclick=()=>{if(!fishingSession||fishingSession.token!==token)return;clearTimeout(fishingSession.escapeTimer);const reaction=performance.now()-Number(fishingSession.hookedAt||performance.now()),success=reaction<2400&&Math.random()<.88;pull.hidden=true;if(!success){status.textContent='💨 Escapou';pullFishingVisual(false);saveState();fishingSession.finishTimer=setTimeout(()=>{if(fishingSession?.token===token)fishingSession=null;stopFishingVisual();},800);return;}const fish=weightedFish(),size=+(fish.min+Math.random()*(fish.max-fish.min)).toFixed(2),catchId=uid();state.inventory.rawFish=(state.inventory.rawFish||0)+1;state.fishing.catches.push({id:catchId,species:fish.name,size,rarity:fish.rarity,caughtAt:Date.now(),source,cooperative:!!options.cooperative});state.fishing.catches=state.fishing.catches.slice(-200);state.fishing.species[fish.name]=(state.fishing.species[fish.name]||0)+1;let xp=fish.xp,coins=fish.coins;if(options.cooperative&&options.requestId&&!state.fishing.cooperativeRewards.includes(options.requestId)){state.fishing.cooperativeRewards.push(options.requestId);state.fishing.cooperativeRewards=state.fishing.cooperativeRewards.slice(-80);xp+=6;coins+=3;}addXP(xp);addCoins(coins);status.textContent=`🐟 ${fish.name} • ${size} kg • ${fish.rarity}`;pullFishingVisual(true,{...fish,size});beep(1040,130,'sine');vibrate([40,35,70]);clearFishingTimers(fishingSession);fishingSession=null;stopFishingVisual(1800);saveState(true);};
    });
  }
  function campfireAllowed(x,z){if(Math.hypot(x+70,z+62)>14)return false;if(waterAt(x,z))return false;if(WORLD_MAP_ROADS.some(r=>rectOverlap({x,z,w:3,d:3},r,.5)))return false;if(world.houses.some(h=>Math.hypot(x-h.x,z-h.z)<10))return false;return true;}
  function spawnCampfire(data,remote=false){
    if(!data?.id||world.campfires.some(x=>x.data.id===data.id))return;const g=new THREE.Group();g.position.set(data.x,0,data.z);worldGroup.add(g);for(const a of [-.55,.55]){const log=premiumCylinder(.18,1.6,0x76502d,a,.2,0,g,8);log.rotation.z=Math.PI/2;log.rotation.y=a>0?Math.PI/4:-Math.PI/4;}const flame=new THREE.Mesh(new THREE.ConeGeometry(.42,1.15,7),mat(0xff7a18,{emissive:0xff4a00,emissiveIntensity:1.4,transparent:true,opacity:.9}));flame.position.y=.9;g.add(flame);const record={data:{...data,remote},group:g,flame,interactable:null};record.interactable=registerInteractable({id:`campfire-${data.id}`,type:'campfire',icon:'🔥',label:'Usar fogueira',x:data.x,z:data.z,radius:3.2,priority:150,action:()=>openCampfire(data.id)});world.campfires.push(record);
  }
  function nearestActiveCampfire(radius=999){return world.campfires.filter(c=>!c.data.expired&&Number(c.data.expiresAt||0)>Date.now()).sort((a,b)=>distance2D(player,a.data)-distance2D(player,b.data)).find(c=>distance2D(player,c.data)<=radius)||null;}
  async function buildCampfire(){const x=Math.round(player.x*2)/2,z=Math.round(player.z*2)/2;if(!campfireAllowed(x,z)){toast('Use a área demarcada do acampamento.','warn');return;}if((state.inventory.wood||0)<3){toast('Você precisa de 3 madeiras.','warn');return;}if(!(await confirmModal('Construir fogueira','Gastar 3 madeiras para montar a fogueira?','Construir','Cancelar')))return;state.inventory.wood-=3;const data={id:uid(),ownerId:state.profile.playerId,x,z,createdAt:Date.now(),expiresAt:Date.now()+10*60*1000,cooking:null};state.campfires.push(data);spawnCampfire(data);saveState(true);window.OTTHOS_RTDB?.syncCampfires?.(state.campfires);toast('Fogueira acesa com segurança.','good');}
  function finishCampfireCooking(data,cookingId){if(!data?.cooking||data.cooking.id!==cookingId||data.cooking.collected)return;data.cooking.collected=true;data.cooking=null;state.inventory.cookedFish=(state.inventory.cookedFish||0)+1;saveState(true);window.OTTHOS_RTDB?.syncCampfires?.(state.campfires);toast('O peixe ficou assado!','good',2200);beep(740,100,'sine');}
  function openCampfire(id){const record=world.campfires.find(c=>c.data.id===id),data=record?.data;if(!data||Number(data.expiresAt||0)<=Date.now()){toast('Esta fogueira já apagou.','warn');return;}const mine=!data.remote;openModal('Fogueira',`<div class="activity-card"><div class="activity-icon">🔥</div><h3>Fogueira do acampamento</h3><p>${data.cooking?'Peixe assando...':'Sente-se, cozinhe seu peixe ou convide um amigo.'}</p><div class="modal-actions"><button class="btn primary" data-cook ${!mine||data.cooking||state.inventory.rawFish<1?'disabled':''}>Assar 1 peixe cru</button><button class="btn" data-sit>Sentar ao redor</button><button class="btn good" data-eat ${state.inventory.cookedFish<1?'disabled':''}>Comer peixe assado</button></div></div>`,root=>{
      $('[data-sit]',root).onclick=()=>{player.sitUntil=performance.now()+4500;state.needs.fun=clamp(state.needs.fun+8,0,100);closeModal();toast('Você descansou perto da fogueira.','good');};$('[data-eat]',root).onclick=()=>{if(state.inventory.cookedFish<1)return;state.inventory.cookedFish--;state.needs.hunger=clamp(state.needs.hunger+32,0,100);saveState(true);updateHUD();openCampfire(id);};$('[data-cook]',root).onclick=async()=>{if(!mine||data.cooking||state.inventory.rawFish<1)return;if(!(await confirmModal('Assar peixe','Usar 1 peixe cru nesta fogueira?','Assar','Cancelar')))return;state.inventory.rawFish--;const cookingId=uid();data.cooking={id:cookingId,startedAt:Date.now(),endsAt:Date.now()+5000,collected:false};saveState(true);window.OTTHOS_RTDB?.syncCampfires?.(state.campfires);toast('Peixe na grelha. Aguarde alguns segundos.','good');setTimeout(()=>finishCampfireCooking(data,cookingId),5100);};
    });}
  function openNearestCampfire(){const c=nearestActiveCampfire(12);if(c)openCampfire(c.data.id);else toast('A fogueira do amigo não está próxima ou já apagou.','warn');}
  function openCampfireZone(){const c=nearestActiveCampfire(8);if(c)openCampfire(c.data.id);else openModal('Acampamento','<p>Esta é uma área segura para montar fogueira. Ela usa madeira real do inventário e apaga automaticamente.</p><div class="modal-actions"><button class="btn primary" data-build-fire>Construir fogueira</button></div>',root=>$('[data-build-fire]',root).onclick=()=>{closeModal();buildCampfire();});}
  function createCampfireZone(){for(let i=0;i<9;i++){const a=i/9*Math.PI*2;premiumBox(.75,.3,.5,0x8b765e,-70+Math.cos(a)*2,.15,-62+Math.sin(a)*2);}createSignpost(-65,-57,'Acampamento',Math.PI*.25);registerInteractable({id:'campfire-zone',type:'campfire-zone',icon:'🔥',label:'Área de fogueira',x:-70,z:-62,radius:5,priority:145,action:openCampfireZone});}
  function createForestAnimal(id,type,x,z,color){const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);premiumBox(1.25,.72,.55,color,0,.72,0,g);premiumBox(.55,.55,.5,color,0,1.25,.38,g);for(const ox of [-.42,.42])for(const oz of [-.18,.18])premiumBox(.16,.55,.16,0x5e432b,ox,.28,oz,g);if(type==='deer'){premiumBox(.08,.5,.08,0x5e432b,-.18,1.68,.4,g);premiumBox(.08,.5,.08,0x5e432b,.18,1.68,.4,g);}const animal={id,type,group:g,x,z,available:true,respawnAt:0};world.animals.push(animal);return animal;}
  function startHunting(options={}){const cooldown=Math.max(0,20000-(Date.now()-Number(state.hunting.lastAttempt||0)));if(cooldown>0){toast(`A floresta precisa descansar por ${Math.ceil(cooldown/1000)} s.`,'warn');return;}if(Math.hypot(player.x+96,player.z+72)>28){toast('Siga as pegadas até a área de rastreamento.','warn');return;}state.hunting.lastAttempt=Date.now();state.hunting.tracksFound++;const trail=['Pegadas perto das pedras','Galhos mexidos à esquerda','Folhas amassadas perto da árvore'],correct=Math.floor(Math.random()*3);openModal(options.cooperative?'Rastreamento com amigo':'Rastreamento na floresta',`<div class="activity-card hunting-card"><div class="activity-icon">🐾</div><h3>Encontre o caminho do animal</h3><p>${trail[correct]}. Qual direção você seguirá?</p><div class="choice-grid"><button class="choice" data-track="0"><b>⬅️ Esquerda</b><span>Seguir pistas</span></button><button class="choice" data-track="1"><b>⬆️ Em frente</b><span>Seguir pistas</span></button><button class="choice" data-track="2"><b>➡️ Direita</b><span>Seguir pistas</span></button></div><small>Atividade infantil: sem sangue, sem atacar pessoas ou NPCs.</small></div>`,root=>{$$('[data-track]',root).forEach(btn=>btn.onclick=()=>{const picked=Number(btn.dataset.track),success=picked===correct&&Math.random()<.78;closeModal();if(success){state.hunting.successful++;state.inventory.forestResources=(state.inventory.forestResources||0)+1;state.inventory.food=(state.inventory.food||0)+1;let xp=26;if(options.cooperative&&options.requestId&&!state.hunting.cooperativeRewards.includes(options.requestId)){state.hunting.cooperativeRewards.push(options.requestId);state.hunting.cooperativeRewards=state.hunting.cooperativeRewards.slice(-80);xp+=7;}addXP(xp);toast('Rastreamento concluído! Recurso da floresta coletado sem violência.','good',2800);const animal=world.animals.find(a=>a.available);if(animal){animal.available=false;animal.group.visible=false;animal.respawnAt=Date.now()+45000;}}else{state.hunting.failed++;toast('As pistas terminaram. O animal escapou em segurança.','warn',2400);}saveState(true);});});}
  function createHuntingArea(){createSignpost(-89,-65,'Rastreamento infantil',Math.PI*.3);for(const p of [[-93,-70],[-97,-73],[-101,-75],[-104,-70]]){const mark=premiumBox(.45,.05,.7,0x634b32,p[0],.04,p[1]);mark.rotation.y=Math.random()*Math.PI;}createForestAnimal('deer-1','deer',-105,-78,0xb67945);createForestAnimal('rabbit-1','rabbit',-88,-82,0xc8b7a3);registerInteractable({id:'hunting-trail',type:'hunting',icon:'🐾',label:'Seguir rastros',x:-96,z:-72,radius:6,priority:140,action:()=>startHunting()});}
  function nearestOwnedHouseForExtension(){return world.houses.filter(h=>state.houses[h.id]?.owned&&!h.publicBuilding).sort((a,b)=>distance2D(player,a)-distance2D(player,b))[0];}
  function extensionPlacement(house,side){const off=7.1;return side===0?{x:house.x+off,z:house.z,rotation:0}:side===1?{x:house.x,z:house.z+off,rotation:Math.PI/2}:side===2?{x:house.x-off,z:house.z,rotation:Math.PI}: {x:house.x,z:house.z-off,rotation:-Math.PI/2};}
  function extensionValid(draft){const rect={x:draft.x,z:draft.z,w:5.4,d:5.4};if(Math.abs(draft.x)>111||Math.abs(draft.z)>111)return false;if(world.hazards.some(h=>rectOverlap(rect,h,.5)))return false;if(WORLD_MAP_ROADS.some(r=>rectOverlap(rect,r,.4)))return false;if(world.houseExtensions.some(e=>rectOverlap(rect,{x:e.data.x,z:e.data.z,w:5.4,d:5.4},.35)))return false;for(const h of world.houses){if(h.id===draft.houseId)continue;if(rectOverlap(rect,{x:h.x,z:h.z,w:9,d:7},.6))return false;}return true;}
  function clearExtensionPreview(){if(extensionPreview&&worldGroup){worldGroup.remove(extensionPreview);extensionPreview.traverse?.(o=>{o.geometry?.dispose?.();if(o.material&&!Array.isArray(o.material))o.material.dispose?.();});}extensionPreview=null;extensionDraft=null;}
  function renderExtensionPreview(){if(!extensionDraft)return;const d={...extensionDraft};if(extensionPreview&&worldGroup){worldGroup.remove(extensionPreview);extensionPreview.traverse?.(o=>{o.geometry?.dispose?.();if(o.material&&!Array.isArray(o.material))o.material.dispose?.();});}extensionPreview=null;extensionDraft=d;const spec=ROOM_SPECS[d.type]||ROOM_SPECS.storage,g=new THREE.Group();g.position.set(Number(d.x||0),0,Number(d.z||0));g.rotation.y=Number(d.rotation||0);worldGroup.add(g);const m=new THREE.MeshStandardMaterial({color:extensionValid(d)?0x62e58a:0xff5263,transparent:true,opacity:.4,roughness:.5});const floor=new THREE.Mesh(new THREE.BoxGeometry(5.2,.18,5.2),m);floor.position.y=.09;g.add(floor);for(const [x,z,w,dd]of [[0,-2.5,5.2,.16],[-2.5,0,.16,5.2],[2.5,0,.16,5.2]]){const wall=new THREE.Mesh(new THREE.BoxGeometry(w,2.8,dd),m);wall.position.set(x,1.4,z);g.add(wall);}extensionPreview=g;}
  function spawnHouseExtension(data,remote=false){if(!data?.id||world.houseExtensions.some(x=>x.data.id===data.id))return;const spec=ROOM_SPECS[data.type]||ROOM_SPECS.storage,g=new THREE.Group();g.position.set(data.x,0,data.z);g.rotation.y=Number(data.rotation||0);worldGroup.add(g);premiumBox(5.2,.22,5.2,spec.color,0,.11,0,g);premiumBox(5.25,.32,.18,0xf1eadb,0,1.55,-2.51,g);premiumBox(.18,3.0,5.2,0xf1eadb,-2.51,1.5,0,g);premiumBox(.18,3.0,5.2,0xf1eadb,2.51,1.5,0,g);premiumBox(5.5,.35,5.5,shadeColor(spec.color,-20),0,3.12,0,g);premiumBox(1.35,2.25,.12,0x684329,0,1.12,2.53,g);registerPlatform(data.x,data.z,5.2,5.2,.23,{extensionId:data.id});const record={data:{...data,remote},group:g};world.houseExtensions.push(record);registerInteractable({id:`extension-${data.id}`,type:'house-extension',icon:spec.icon,label:`Usar ${spec.name}`,x:data.x,z:data.z,radius:3.3,priority:125,action:()=>{state.needs.fun=clamp(state.needs.fun+5,0,100);toast(`${spec.name} de ${data.ownerName||playerDisplayName()}.`,'good');}});}
  function resourcesEnough(cost){return Object.entries(cost).every(([k,v])=>Number(state.inventory[k]||0)>=v);}
  function costText(cost){return Object.entries(cost).map(([k,v])=>`${v} ${k==='wood'?'madeiras':k==='stone'?'pedras':'blocos'}`).join(' + ');}
  function openHouseExtensionPlanner(type){const house=nearestOwnedHouseForExtension();if(!house||distance2D(player,house)>16){toast('Chegue perto de uma casa que você possui.','warn');return;}let side=0;const spec=ROOM_SPECS[type];const place=extensionPlacement(house,side);extensionDraft={id:uid(),houseId:house.id,type,side,...place,ownerId:state.profile.playerId,ownerName:playerDisplayName()};renderExtensionPreview();openModal(`Ampliar: ${spec.name}`,`<p>A prévia transparente aparece ao lado da casa. Ajuste o lado e a rotação antes de confirmar.</p><div class="extension-status" data-extension-status></div><div class="modal-actions"><button class="btn" data-side>Próximo lado</button><button class="btn" data-rotate>Girar</button><button class="btn primary" data-confirm-extension>Confirmar • ${costText(spec.cost)}</button><button class="btn danger" data-cancel-extension>Cancelar</button></div>`,root=>{const status=$('[data-extension-status]',root),update=()=>{const p=extensionPlacement(house,side);extensionDraft={...extensionDraft,side,x:p.x,z:p.z};renderExtensionPreview();status.textContent=extensionValid(extensionDraft)?'✓ Terreno válido':'⚠ Este local está bloqueado';status.className=`extension-status ${extensionValid(extensionDraft)?'good':'bad'}`;};update();$('[data-side]',root).onclick=()=>{side=(side+1)%4;update();};$('[data-rotate]',root).onclick=()=>{extensionDraft.rotation=(Number(extensionDraft.rotation||0)+Math.PI/2)%(Math.PI*2);renderExtensionPreview();};$('[data-cancel-extension]',root).onclick=closeModal;$('[data-confirm-extension]',root).onclick=()=>{if(!extensionValid(extensionDraft)){toast('Escolha um lado livre da casa.','warn');return;}if(!resourcesEnough(spec.cost)){toast(`Faltam recursos: ${costText(spec.cost)}.`,'warn',2600);return;}for(const[k,v]of Object.entries(spec.cost))state.inventory[k]-=v;const data={...extensionDraft,createdAt:Date.now()};state.houseExtensions.push(data);clearExtensionPreview();closeModal();spawnHouseExtension(data);saveState(true);window.OTTHOS_RTDB?.syncHouseExtensions?.(state.houseExtensions);toast(`${spec.name} construído sem alterar os cômodos antigos.`,'good',2800);};});}
  function openHouseExtensionMenu(){openModal('Ampliação modular da casa',`<p>Escolha o novo cômodo. Os interiores e móveis existentes serão preservados.</p><div class="choice-grid">${Object.entries(ROOM_SPECS).map(([id,r])=>`<button class="choice" data-room="${id}"><b>${r.icon} ${r.name}</b><span>${costText(r.cost)}</span></button>`).join('')}</div>`,root=>{$$('[data-room]',root).forEach(btn=>btn.onclick=()=>{closeModal();openHouseExtensionPlanner(btn.dataset.room);});});}
  function createLakeExpansion(){premiumBox(12,.32,3,materials.wood,-30,.34,52);registerPlatform(-30,52,12,3,.5,{pier:true});for(const z of [44.8,59.2])premiumBox(2.2,.35,.35,0xd7c7a0,-25.5,.25,z);createSignpost(-22,47,'Píer e Pesca',Math.PI/2);registerInteractable({id:'shore-fishing',type:'fishing',icon:'🎣',label:'Pescar na margem',x:-25.5,z:45,radius:3.2,priority:160,action:()=>startFishing('shore')});createBoatModel();}
  function restoreLifeExpansion(){for(const c of state.campfires){if(Number(c.expiresAt||0)>Date.now())spawnCampfire(c);if(c.cooking&&Number(c.cooking.endsAt||0)<=Date.now())finishCampfireCooking(c,c.cooking.id);}for(const e of state.houseExtensions)spawnHouseExtension(e);}
  function updateLifeActivities(dt){world.activityAcc+=dt;if(world.activityAcc<.5)return;world.activityAcc=0;const now=Date.now();for(const c of [...world.campfires]){if(c.flame)c.flame.scale.y=.85+Math.sin(performance.now()*.009+c.data.x)*.18;if(c.data.cooking&&Number(c.data.cooking.endsAt||0)<=now)finishCampfireCooking(c.data,c.data.cooking.id);if(Number(c.data.expiresAt||0)<=now){c.data.expired=true;c.interactable.disabled=true;worldGroup.remove(c.group);world.campfires=world.campfires.filter(x=>x!==c);if(!c.data.remote)state.campfires=state.campfires.filter(x=>x.id!==c.data.id);}}
    for(const a of world.animals){if(!a.available&&a.respawnAt<=now){a.available=true;a.group.visible=true;}if(a.available){a.group.rotation.y+=Math.sin(performance.now()*.0005+a.x)*.004;}}
    if(Math.random()<.08&&state.campfires.length!==world.campfires.filter(c=>!c.data.remote).length){saveState();window.OTTHOS_RTDB?.syncCampfires?.(state.campfires);}
  }
  function createLifeExpansionWorld(){createLakeExpansion();createCampfireZone();createHuntingArea();restoreLifeExpansion();applyCloudWorldObjects();}
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
    for(let i=0;i<48;i++){const x=-92+(Math.random()-.5)*68,z=-52+(Math.random()-.5)*84;if(Math.abs(x+68)<10&&Math.abs(z-52)<12)continue;if(Math.abs(x+68)<11&&Math.abs(z+18)<11)continue;if(Math.abs(x+92)<14&&Math.abs(z+92)<13)continue;createTree(x,z,.75+Math.random()*.55,true);}
    for(let i=0;i<18;i++)createRock(-44+(Math.random()-.5)*60,-95+(Math.random()-.5)*54,.7+Math.random()*.6,true);
    for(let i=0;i<80;i++)createFlower((Math.random()-.5)*190,(Math.random()-.5)*190,Math.random()>.5?0xff74c9:0xffdf55);
    // village houses
    const home=createHouse({id:'home',name:`Casa de ${playerDisplayName()}`,x:0,z:18,color:0xc4843e,roofColor:0xd93a38});addHouseInterior(home,'home');
    const blue=createHouse({id:'blue',name:'Casa Azul',x:-25,z:17,color:0x4f9fd7,roofColor:0x225fa5,price:250});addHouseInterior(blue,'neighbor');
    const pink=createHouse({id:'pink',name:'Casa Rosa',x:25,z:17,color:0xe58aae,roofColor:0xb63871,price:420});addHouseInterior(pink,'neighbor');
    const cabin=createHouse({id:'cabin',name:'Cabana da Floresta',x:-88,z:-42,color:0x7e4a28,roofColor:0x4d2b1c,price:180});addHouseInterior(cabin,'neighbor');
    const shop=createHouse({id:'shop',name:'Mercadinho',x:-22,z:-18,color:0xf1b83e,roofColor:0xc83a2f,publicBuilding:true});addHouseInterior(shop,'shop');
    const workshop=createHouse({id:'workshop',name:'Oficina',x:22,z:-18,color:0x8c96a4,roofColor:0x3d4a5a,publicBuilding:true});addHouseInterior(workshop,'workshop');
    const school=createHouse({id:'school',name:'Escola Vila do Sol',x:-68,z:-18,color:0xf2c64e,roofColor:0x2f7fd8,publicBuilding:true});addHouseInterior(school,'school');world.school=school;
    const schoolEast=createHouse({id:'school-east',name:'Escola Horizonte',x:78,z:24,color:0xe9d68f,roofColor:0x2f7fd8,publicBuilding:true});addHouseInterior(schoolEast,'school');world.schools=[school,schoolEast];
    const policeStation=createHouse({id:'police',name:'Posto de Segurança',x:68,z:-18,color:0xe8edf3,roofColor:0x245da8,publicBuilding:true});addHouseInterior(policeStation,'police');world.policeStation=policeStation;
    createGoldMine();createVillageWell();createGoldFoundry();
    // yards/fences/lamps
    createFenceLine(-36,26,-14,26,9);createFenceLine(14,26,36,26,9);createFenceLine(-10,29,10,29,8);for(const p of [[-9,9],[9,9],[-33,8],[33,8],[-10,-7],[10,-7]])createLamp(p[0],p[1]);
    // NPCs com mobilidade própria
    const nino=createNPC('nino','Nino',4,3,0xffd84d,4),luna=createNPC('luna','Luna',-22,8,0xff72b6,4),teo=createNPC('teo','Teo',22,7,0x54c7ff,4),bia=createNPC('bia','Bia',-10,-10,0x8ee15c,3),maya=createNPC('maya','Maya',65,54,0xa66bff,3);
    createNpcMobility(nino,'bike',[[4,3],[4,10],[-18,10],[-18,0],[4,0]],3.2);createNpcMobility(luna,'skate',[[-22,8],[-34,8],[-34,0],[-12,0],[-12,8]],2.8);createNpcMobility(teo,'moto',[[22,7],[8,7],[8,-12],[35,-12],[35,7]],4.7);createNpcMobility(bia,'bike',[[-10,-10],[-10,0],[-48,0],[-48,-10]],3.4);createNpcMobility(maya,'car',[[65,54],[55,54],[55,8],[68,8],[68,54]],4.5);
    // farm and garage
    createFenceLine(38,22,65,22,10);createFenceLine(65,22,65,43,8);for(let x=42;x<62;x+=4)for(let z=27;z<40;z+=4){box(2.8,.12,2.8,0x75451f,x,.06,z);box(.18,.55,.18,0x54c93e,x,.33,z);}
    createToyCar(52,48,{id:'garage-orange',label:'Carro da Garagem',primary:0xf28a22,secondary:0x0aa7b8});createToyCar(-31,-11,{id:'market-blue',label:'Compacto Azul',primary:0x2787d8,secondary:0x43c6e8,heading:Math.PI/2});createToyCar(31,-11,{id:'workshop-red',label:'Esportivo Vermelho',primary:0xe5484d,secondary:0xf3b33d,heading:-Math.PI/2});createToyCar(12,35,{id:'home-green',label:'Carro Verde',primary:0x31a76a,secondary:0x8edb65,heading:Math.PI});createToyCar(66,40,{id:'royal-purple',label:'Carro Real',primary:0x7d58c9,secondary:0xf1c94d});createToyCar(47,84,{id:'gym-yellow',label:'Carro do Ginásio',primary:0xf1c943,secondary:0xef6c3d,heading:Math.PI});createToyCar(-78,-5,{id:'forest-teal',label:'Carro da Floresta',primary:0x138d83,secondary:0x6bc08b,heading:Math.PI/2});
    registerInteractable({id:'job-board',type:'job',icon:'📦',label:'Central de trabalhos',x:49,z:45,radius:2.3,action:openJobCenter});world.deliveryPoint={x:65,z:54};
    createLifeExpansionWorld();
    createAthleticsGym();createSizeChallenges();createTransitWorld();createPoliceSystem();createWaypointMarker();
    // placas de bairro/orientação (somente decorativas, não alteram colisão nem interação)
    createSignpost(12,4,'Vila do Sol',Math.PI/2); createSignpost(-30,-5,'Mercado e Oficina',Math.PI/2);
    createSignpost(-62,-30,'Floresta',Math.PI*.15); createSignpost(48,26,'Fazenda e Garagem',-Math.PI/2);
    createSignpost(70,40,'Castelo',Math.PI*.7); createSignpost(-58,50,'Lago',Math.PI*.4);
    // platform challenge
    const coords=[[48,0,-48],[53,1.2,-55],[59,2.3,-61],[66,3.5,-67],[74,4.6,-72],[82,5.8,-76]];coords.forEach(([x,y,z],i)=>{createPlatform(x,y+.5,z,3.2,3.2,i%2?0x7a4ed0:0x3e9fd8);createCrystal(x,y+1.7,z,i===coords.length-1);});world.secretChest=createChest('secret',86,-78,true);
    // castelo real e inimigos
    createRoyalCastle(88,62);
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
    const needed=resource.type==='wood'?'axe':'pickaxe';if(state.tools.equipped!==needed){toast(`Equipe ${needed==='axe'?'o machado':'a picareta'} em Ferramentas.`,'warn',1700);return;}
    resource.hits=(resource.hits||0)+1;playToolAnimation();resource.mesh.rotation.y+=(resource.hits%2?.08:-.08);
    if(resource.hits<Number(resource.hitsNeeded||1)){toast(`${resource.type==='wood'?'Árvore':'Rocha'}: ${resource.hits}/${resource.hitsNeeded}`,'good',850);return;}
    resource.collected=true;resource.mesh.visible=false;const inventoryKey=resource.type==='gold'?'goldOre':resource.type,amount=resource.type==='wood'?2:1;
    state.inventory[inventoryKey]=(state.inventory[inventoryKey]||0)+amount;state.tools.harvested[resource.type]=(state.tools.harvested[resource.type]||0)+amount;state.stats.collected++;trackDaily('collect',1);
    advanceAdventure('resources',resource.type==='gold'?'stone':resource.type);addXP(resource.type==='gold'?18:10);toast(resource.type==='wood'?'+2 madeira':resource.type==='gold'?'+1 minério de ouro':'+1 pedra','good',1300);beep(resource.type==='gold'?850:620);vibrate(25);evaluateMissions();checkActiveJob();saveState();
    setTimeout(()=>{resource.collected=false;resource.hits=0;resource.mesh.visible=true;resource.mesh.rotation.y=0;},90000);
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
    enterHouse.outdoorYaw=cameraYaw;cameraYaw=0;clearMovementInputs();
    currentHouse=house;cameraMode='interior';house.roof.visible=false;house.front.visible=false;house.door.visible=false;
    for(const bus of world.buses)bus.group.visible=false;
    for(const car of world.policeCars)car.group.visible=false;
    player.x=house.x;player.z=house.z+1.0;player.y=0;player.vx=player.vz=player.vy=0;player.grounded=true;
    state.position={x:player.x,y:0,z:player.z,yaw:cameraYaw};
    updateCamera(1);
    if(house.id==='home')setFlag('enteredHome');
    toast(`Entrou: ${house.name}`,'good');updateContext(true);saveState();
  }
  function exitHouse(){
    if(!currentHouse)return;const h=currentHouse;h.roof.visible=true;h.front.visible=true;h.door.visible=true;
    for(const bus of world.buses)bus.group.visible=true;
    for(const car of world.policeCars)car.group.visible=true;
    currentHouse=null;cameraMode='openworld';cameraYaw=Number.isFinite(enterHouse.outdoorYaw)?enterHouse.outdoorYaw:0;clearMovementInputs();player.x=h.x;player.z=h.z+5.3;player.y=0;player.vx=player.vz=player.vy=0;toast('Saiu da casa.','good');saveState();
  }

  function openHomeChest(){
    const keys=[['wood','Madeira','🪵'],['stone','Pedra','🪨'],['goldOre','Minério de ouro','🟨'],['goldBar','Barra de ouro','🏅'],['food','Comida','🍎'],['water','Água','💧'],['crystals','Cristais','💎']];
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
    else if(type==='school')openEducationHub(String(state.learning.lastLesson||'math').split('-')[0]);
    else if(type==='police')openSafetyLesson('station');
    updateHUD();
  }
  function openShop(){
    const items=[['Comida',15,'food',2,'🍎'],['Água',8,'water',2,'💧'],['Blocos',25,'blocks',4,'🧱'],['Cercas',20,'fences',3,'🪵']];
    openModal('Mercadinho da Vila',`<p>Moedas: <b>${state.profile.coins}</b></p><div class="choice-grid">${items.map(([name,price,key,amount,icon],i)=>`<button class="choice" data-buy="${i}"><b>${icon} ${name}</b><span>${price} moedas — +${amount}</span></button>`).join('')}</div>`,root=>{
      $$('[data-buy]',root).forEach(btn=>btn.onclick=()=>{const [name,price,key,amount]=items[Number(btn.dataset.buy)];if(state.profile.coins<price){toast('Moedas insuficientes.','warn');return;}addCoins(-price);state.inventory[key]+=amount;addXP(5);saveState();closeModal();toast(`${name} comprado!`,'good');});
    });
  }
  function openWorkshop(){
    const inv=state.inventory;
    openModal('Oficina e Fundição',`<div class="workshop-header"><div>🛠️</div><section><h3>Ferramentas, construção e ouro</h3><p>Escolha uma melhoria. Os materiais só são consumidos depois do toque.</p></section></div><div class="resource-summary"><span>🪵 ${inv.wood}</span><span>🪨 ${inv.stone}</span><span>🟨 ${inv.goldOre||0}</span><span>🏅 ${inv.goldBar||0}</span></div><div class="choice-grid workshop-grid"><button class="choice" data-sword><b>✨ Ferramenta de aventura</b><span>2 madeiras + 2 pedras</span></button><button class="choice" data-blocks><b>🧱 Kit construção</b><span>1 madeira + 1 pedra</span></button><button class="choice" data-smelt><b>🏅 Fundir ouro</b><span>3 minérios → 1 barra</span></button></div>`,root=>{
      $('[data-sword]',root).onclick=()=>{if(inv.wood<2||inv.stone<2){toast('Faltam materiais.','warn');return;}inv.wood-=2;inv.stone-=2;state.flags.swordUpgrade=(state.flags.swordUpgrade||0)+1;addXP(35);saveState();closeModal();toast('Ferramenta de aventura melhorada!','good');};
      $('[data-blocks]',root).onclick=()=>{if(inv.wood<1||inv.stone<1){toast('Faltam materiais.','warn');return;}inv.wood--;inv.stone--;inv.blocks+=3;inv.fences+=2;saveState();closeModal();toast('Kit de construção pronto!','good');};
      $('[data-smelt]',root).onclick=()=>{if((inv.goldOre||0)<3){toast('Você precisa de 3 minérios de ouro.','warn');return;}inv.goldOre-=3;inv.goldBar=(inv.goldBar||0)+1;addCoins(60);addXP(35);saveState(true);closeModal();toast('Barra de ouro criada: +60 moedas.','good',2200);};
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
      <button class="choice" data-social="argue"><b>🤝 Resolver desacordo</b><span>Conversar com calma e respeito</span></button>
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
      <button class="choice" data-social="ride"><b>🚗 Passear junto</b><span>Entra no próximo carro ou barco</span></button>
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
          state.social.arguments=(state.social.arguments||0)+1;state.friendship[npc.id]=clamp((state.friendship[npc.id]||0)+2,0,100);state.profile.reputation+=1;saveState(true);updateHUD();closeModal();toast(`${npc.name} e você resolveram tudo conversando.`,'good');
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
        else if(action==='ride'){npc.pendingRide=true;npc.following=true;toast(`${npc.name} vai entrar no próximo carro ou barco com você.`,'good',2400);closeModal();}
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
    if(player.car.passengerOf){if(engineAudio)stopEngineSound();if(els.vehicleBadge)els.vehicleBadge.textContent='🚗 Passageiro — AÇÃO para sair';return;}
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
    if(!player.vehicle||player.car.passengerOf||paused||!els.modal.hidden)return;
    const t=performance.now();if(t<player.hornUntil)return;player.hornUntil=t+360;
    beep(410,95,'square');setTimeout(()=>{if(player.vehicle)beep(520,70,'square');},105);vibrate(18);
    vehicleVisual.scale.set(1.015,.99,1.015);setTimeout(()=>vehicleVisual?.scale?.set(1,1,1),120);
  }
  function enterVehicle(vehicle=world.vehicle){
    if(player.vehicle||player.boating||player.transit.mode||!vehicle)return false;world.vehicle=vehicle;
    player.preVehicleAbilities={scaleMode:player.scaleMode,crouched:player.crouched};
    // Estados de ações domésticas/personagem não podem congelar a física do carro.
    player.sitUntil=0;player.attackUntil=0;player.spinUntil=0;player.jumpBuffer=0;player.vy=0;player.grounded=true;
    clearMovementInputs();
    player.vehicle=true;player.car.id=vehicle.id;player.car.passengerOf='';player.car.passengerUid='';player.car.passengerBotId='';player.car.heading=vehicle.group.rotation.y||player.facing;player.car.speed=0;player.car.steerVisual=0;player.car.drift=0;player.car._prevSpeed=0;player.x=vehicle.group.position.x;player.z=vehicle.group.position.z;player.y=groundHeightAt(player.x,player.z);player.facing=player.car.heading;vehicle.occupied=true;
    player.scaleMode='normal';player.crouched=false; // carro nunca herda escala/agachamento do personagem
    syncPlayerRootScale(); // imediato: não espera o próximo frame para corrigir a raiz
    updateAbilityUI();
    if(playerModel)playerModel.visible=false; if(avatarLayer)avatarLayer.visible=false;
    vehicleVisual.visible=true;vehicleVisual.scale.set(1,1,1);vehicleVisual.rotation.set(0,0,0);
    vehicle.group.visible=false;els.vehicleBadge.hidden=false;updateVehicleControlsUI();updateRunUI();setFlag('gotVehicle');const companion=nearestRideCompanion();if(companion)boardNpcPassenger(companion,'car');toast(`${vehicle.label} ligado! Use o manche para dirigir.`,'good');startEngineSound();saveState();return true;
  }
  function enterVehicleAsPassenger(hostUid,vehicleId=''){
    const ghost=world.ghosts.get(hostUid),target=ghost?.userData?.target;if(!ghost||!target?.vehicle){toast('O carro do jogador não está mais disponível.','warn');return false;}if(player.boating)exitBoat(true);if(player.transit.mode)return false;player.preVehicleAbilities={scaleMode:player.scaleMode,crouched:player.crouched};clearMovementInputs();player.vehicle=true;player.car.id=vehicleId||target.vehicleId||'online-car';player.car.passengerOf=hostUid;player.car.passengerUid='';player.car.passengerBotId='';player.car.hostMissingAt=0;player.car.speed=0;player.scaleMode='normal';player.crouched=false;if(playerModel)playerModel.visible=false;if(avatarLayer)avatarLayer.visible=false;vehicleVisual.visible=false;els.vehicleBadge.hidden=false;updateVehicleControlsUI();updateRunUI();updateAbilityUI();toast('Você entrou como passageiro. O motorista controla o carro.','good',2500);saveState();return true;
  }
  function exitVehicle(silent=false){
    if(!player.vehicle)return;
    const passengerHost=player.car.passengerOf,hostedPassenger=player.car.passengerUid,wasPassenger=!!passengerHost;if(passengerHost)window.OTTHOS_RTDB?.sendInteraction?.(passengerHost,{type:'vehiclePassengerLeft'});else if(hostedPassenger)window.OTTHOS_RTDB?.sendInteraction?.(hostedPassenger,{type:'vehicleEnded'});releaseNpcPassenger('car');player.vehicle=false;player.vx=0;player.vz=0;player.car.speed=0;player.car._prevSpeed=0;player.car.passengerOf='';player.car.passengerUid='';player.car.hostMissingAt=0;clearMovementInputs();
    const prior=player.preVehicleAbilities||state.abilities||{scaleMode:'normal',crouched:false};
    player.scaleMode=['mini','normal','giant'].includes(prior.scaleMode)?prior.scaleMode:'normal';player.crouched=!!prior.crouched;player.preVehicleAbilities=null;
    syncPlayerRootScale(); // restaura imediatamente Mini/Normal/Grande e Abaixar do Otthos
    if(playerModel)playerModel.visible=true; if(avatarLayer)avatarLayer.visible=true;
    vehicleVisual.visible=false;vehicleVisual.rotation.set(0,0,0);els.vehicleBadge.hidden=true;updateVehicleControlsUI();updateRunUI();updateAbilityUI();stopEngineSound();
    if(world.vehicle&&!wasPassenger){world.vehicle.occupied=false;world.vehicle.group.visible=true;world.vehicle.group.position.set(player.x,groundHeightAt(player.x,player.z),player.z);world.vehicle.group.rotation.y=player.car.heading;world.vehicle.x=player.x;world.vehicle.z=player.z;world.vehicle.heading=player.car.heading;}player.car.id='';if(!silent)toast('Saiu do carro.','good');saveState();
  }

  function repairBridge(){
    if(state.flags.bridgeFixed){toast('A ponte já está consertada.','good');return;}
    if(state.inventory.wood<3||state.inventory.stone<2){toast('Precisa de 3 madeiras e 2 pedras.','warn');return;}
    state.inventory.wood-=3;state.inventory.stone-=2;setFlag('bridgeFixed');addXP(70);addReputation(20);toast('Ponte consertada!','good',2200);saveState();
  }

  const BUILD_RECIPES={
    block:{name:'Bloco',icon:'🧱',cost:{blocks:1},description:'Bloco empilhável'},
    wall:{name:'Parede',icon:'🧱',cost:{stone:2,blocks:1},description:'Parede de pedra'},
    floor:{name:'Piso de madeira',icon:'🪵',cost:{wood:2},description:'Plataforma para o quintal'},
    fence:{name:'Cerca',icon:'🚧',cost:{fences:1},description:'Cerca orientada para a direção do personagem'},
    lamp:{name:'Poste',icon:'💡',cost:{wood:1,stone:1},description:'Iluminação para sua construção'},
    bench:{name:'Banco',icon:'🪑',cost:{wood:3},description:'Móvel externo para a vila'},
    planter:{name:'Jardineira',icon:'🌻',cost:{wood:2,stone:1},description:'Flores vivas para o terreno'}
  };
  function buildCostText(cost){const names={wood:'madeira',stone:'pedra',blocks:'bloco',fences:'cerca'};return Object.entries(cost).map(([key,value])=>`${value} ${names[key]||key}${value>1?'s':''}`).join(' + ');}
  function openBuildMenu(){
    openModal('Construção Minecraft Kids',`<p>Construa na praça ou perto das casas que você possui. Nenhuma construção antiga será removida.</p><div class="choice-grid build-catalog">${Object.entries(BUILD_RECIPES).map(([type,item])=>`<button class="choice" data-type="${type}"><b>${item.icon} ${item.name}</b><span>${item.description}<br><strong>${buildCostText(item.cost)}</strong></span></button>`).join('')}<button class="choice" data-type="extension"><b>🏠 Ampliar casa</b><span>Adicionar um cômodo modular</span></button><button class="choice" data-type="remove"><b>🧹 Remover</b><span>Remove somente sua construção mais próxima</span></button></div><div class="modal-actions"><button class="btn" data-cancel>Cancelar construção</button></div>`,root=>{
      $$('[data-type]',root).forEach(btn=>btn.onclick=()=>{const type=btn.dataset.type;if(type==='remove'){removeNearestBuild();closeModal();return;}if(type==='extension'){openHouseExtensionMenu();return;}buildMode=type;els.buildTypeLabel.textContent=BUILD_RECIPES[type].name;els.buildBadge.hidden=false;closeModal();toast(`${BUILD_RECIPES[type].name}: use AÇÃO para colocar.`,'good');updateContext(true);});
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
    const recipe=BUILD_RECIPES[buildMode];if(!recipe)return;if(!resourcesEnough(recipe.cost)){toast(`Faltam materiais: ${buildCostText(recipe.cost)}.`,'warn');return;}
    for(const[key,value]of Object.entries(recipe.cost))state.inventory[key]-=value;
    const data={id:uid(),type:buildMode,x,z,rotation:Math.round(player.facing/(Math.PI/2))*(Math.PI/2)};state.builds.push(data);spawnBuild(data,true);addXP(12);evaluateMissions();checkActiveJob();saveState();toast(`${recipe.name} colocado!`,'good');
  }
  function spawnBuild(data,persist){
    let mesh;const rotation=Number(data.rotation||0),quarter=Math.abs(Math.sin(rotation))>.7,oriented=(w,d)=>quarter?{w:d,d:w}:{w,d};
    if(data.type==='block'){mesh=box(1.5,1.5,1.5,materials.brick,data.x,.75,data.z);registerPlatform(data.x,data.z,1.5,1.5,1.5,{buildId:data.id});registerCollider(data.x,data.z,1.5,1.5,{buildId:data.id});}
    else if(data.type==='fence'){mesh=box(2.4,1.05,.22,materials.wood,data.x,.52,data.z);mesh.rotation.y=rotation;const size=oriented(2.4,.22);registerCollider(data.x,data.z,size.w,size.d,{buildId:data.id});}
    else if(data.type==='wall'){mesh=box(3.0,2.4,.32,materials.stone,data.x,1.2,data.z);mesh.rotation.y=rotation;const size=oriented(3,.32);registerCollider(data.x,data.z,size.w,size.d,{buildId:data.id});}
    else if(data.type==='floor'){mesh=box(3.0,.28,3.0,materials.wood,data.x,.14,data.z);mesh.rotation.y=rotation;registerPlatform(data.x,data.z,3,3,.28,{buildId:data.id});}
    else if(data.type==='bench'){mesh=new THREE.Group();mesh.position.set(data.x,0,data.z);mesh.rotation.y=rotation;worldGroup.add(mesh);premiumBox(2.2,.22,.65,materials.fabric,0,.62,0,mesh);premiumBox(2.2,.74,.18,materials.fabric,0,1.02,-.27,mesh);for(const ox of [-.8,.8])premiumBox(.14,.55,.14,materials.metal,ox,.28,0,mesh);}
    else if(data.type==='planter'){mesh=new THREE.Group();mesh.position.set(data.x,0,data.z);mesh.rotation.y=rotation;worldGroup.add(mesh);premiumBox(2.2,.55,.86,materials.brick,0,.28,0,mesh);premiumBox(1.82,.18,.58,0x5f371f,0,.58,0,mesh);for(const p of [[-.65,0xff6fa8],[0,0xffd74a],[.65,0x67d965]]){premiumBox(.09,.5,.09,0x3d8c3f,p[0],.92,0,mesh);premiumBox(.46,.18,.46,p[1],p[0],1.15,0,mesh);}}
    else{mesh=new THREE.Group();mesh.position.set(data.x,0,data.z);worldGroup.add(mesh);box(.22,2.4,.22,materials.wood,0,1.2,0,mesh);box(.65,.65,.65,0xffdc6a,0,2.65,0,mesh);addGlow(data.x,2.65,data.z,0xffd56a,4);}
    world.builds.push({data,mesh});
  }
  function removeNearestBuild(){
    const nearest=world.builds.filter(b=>distance2D(player,b.data)<3).sort((a,b)=>distance2D(player,a.data)-distance2D(player,b.data))[0];if(!nearest){toast('Nenhuma construção sua por perto.','warn');return;}
    worldGroup.remove(nearest.mesh);world.colliders=world.colliders.filter(c=>c.buildId!==nearest.data.id);world.platforms=world.platforms.filter(p=>p.buildId!==nearest.data.id);world.builds=world.builds.filter(b=>b!==nearest);state.builds=state.builds.filter(b=>b.id!==nearest.data.id);saveState();toast('Construção removida.','good');
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
    if(isInsideLakeNavigable(player.x,player.z)){player.x=-24.7;player.z=52;state.boats.activeBoatId='';state.boats.passengerOf='';}
  }
  function returnHome(){
    if(player.boating){player.x=-24.7;player.z=52;exitBoat(true);}
    if(player.vehicle)exitVehicle(true);
    if(player.transit.mode==='bus'){const bus=world.buses.find(b=>b.id===player.transit.busId);if(bus)exitBusAtStop(bus,{stopId:bus.lastStopId,stopName:bus.lastStopName});}
    if(player.transit.mode==='metro'){player.transit.mode='';player.transit.metroUntil=0;if(metroOverlay){metroOverlay.hidden=true;metroOverlay.classList.remove('travelling','arriving');}if(playerModel)playerModel.visible=true;if(avatarLayer)avatarLayer.visible=true;if(contactShadow)contactShadow.visible=true;}
    if(currentHouse)exitHouse();player.x=0;player.z=23;player.y=0;player.vx=player.vz=player.vy=0;cameraYaw=Math.PI;toast('Você voltou para casa.','good');savePlayerPosition(true);
  }
  function savePlayerPosition(immediate=false){if(player.boating)state.boats.lastPosition={x:+player.x.toFixed(2),z:+player.z.toFixed(2),heading:+player.boat.heading.toFixed(3)};state.position={x:+player.x.toFixed(2),y:+player.y.toFixed(2),z:+player.z.toFixed(2),yaw:+cameraYaw.toFixed(3)};saveState(immediate);}
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
  function canJump(){return !player.vehicle&&!player.boating&&!player.transit.mode&&(player.grounded||performance.now()-player.lastGrounded<125);}
  function requestJump(){if(!els.modal.hidden||paused||player.vehicle||player.boating||player.transit.mode)return;player.jumpBuffer=performance.now()+150;if(canJump())doJump();}
  function doJump(){if(!canJump())return;state.stats.jumps++;trackDaily('jump',1);player.vy=10.2;player.grounded=false;player.jumpBuffer=0;beep(540);vibrate(18);}
  function updatePlayer(dt){
    // Entrada é atualizada em todos os estados. O veículo tem prioridade absoluta:
    // uma animação anterior de sofá/cama/TV nunca pode bloquear aceleração ou direção.
    resolveMovementInput();
    input.x=lerp(input.x,input.targetX,Math.min(1,dt*34));
    input.z=lerp(input.z,input.targetZ,Math.min(1,dt*34));
    const mag=Math.hypot(input.x,input.z);let ix=input.x,iz=input.z;if(mag>1){ix/=mag;iz/=mag;}if(fishingSession){ix=0;iz=0;input.x=input.z=input.targetX=input.targetZ=0;}
    if(player.transit.mode){player.vx=player.vz=0;input.x=input.z=input.targetX=input.targetZ=0;playerGroup.position.set(player.x,player.y,player.z);playerGroup.rotation.y=player.facing;contactShadow.position.set(player.x,groundHeightAt(player.x,player.z)+.025,player.z);if(player.transit.mode==='bus')animatePlayer(dt);updateContext();return;}

    if(player.boating){
      updateBoatPhysics(dt,ix,iz);
    }else if(player.vehicle){
      updateVehiclePhysics(dt,ix,iz);
    }else if(performance.now()<player.sitUntil){
      player.vx*=.82;player.vz*=.82;
    }else{
      const movementYaw=currentHouse?clamp(cameraYaw,-1.18,1.18):cameraYaw,forwardX=Math.sin(movementYaw),forwardZ=-Math.cos(movementYaw),rightX=Math.cos(movementYaw),rightZ=Math.sin(movementYaw);
      const wantsSprint=sprintRequested()&&mag>.14&&!player.crouched&&state.needs.energy>4;input.isSprinting=wantsSprint;
      const needsPenalty=state.needs.energy<15?.72:state.needs.hunger<15?.82:1;const sizeSpeed=player.scaleMode==='mini'?1.12:player.scaleMode==='giant'?.84:1;
      const skillBoost=performance.now()<player.skillDashUntil?1.82:1;
      const speed=(wantsSprint?11.4:7.35)*needsPenalty*sizeSpeed*(player.crouched?.54:1)*skillBoost;
      const targetVx=(rightX*ix+forwardX*iz)*speed,targetVz=(rightZ*ix+forwardZ*iz)*speed;const accel=player.grounded?(wantsSprint?34:29):10;
      player.vx=lerp(player.vx,targetVx,Math.min(1,dt*accel));player.vz=lerp(player.vz,targetVz,Math.min(1,dt*accel));if(mag<.03){player.vx*=Math.pow(.0008,dt);player.vz*=Math.pow(.0008,dt);}
    }
    const prevX=player.x,prevZ=player.z;player.x+=player.vx*dt;player.z+=player.vz*dt;player.x=clamp(player.x,-116,116);player.z=clamp(player.z,-116,116);if(player.boating)constrainBoat(prevX,prevZ);else if(!(player.vehicle&&player.car.passengerOf)){resolveCollisions(prevX,prevZ);resolveWaterWalking(prevX,prevZ);}
    const movedNow=Math.hypot(player.x-prevX,player.z-prevZ);if(movedNow>.001){if(player.vehicle||player.boating){state.stats.driven+=movedNow;trackDaily('drive',movedNow);}else{state.stats.walked+=movedNow;trackDaily('walk',movedNow);}}
    const ground=player.boating?.78:groundHeightAt(player.x,player.z);if(!player.grounded)player.vy-=31*dt;player.y+=player.vy*dt;
    if(player.y<=ground&&player.vy<=0){const landed=!player.grounded&&player.vy<-4;player.y=ground;player.vy=0;player.grounded=true;player.lastGrounded=performance.now();if(landed){vibrate(20);beep(180,35,'sine');}}
    else if(player.y>ground+.03)player.grounded=false;
    if(player.jumpBuffer&&player.jumpBuffer>performance.now()&&canJump())doJump();
    if(!player.vehicle&&!player.boating&&Math.hypot(player.vx,player.vz)>.15)player.facing=Math.atan2(player.vx,player.vz);
    playerGroup.position.set(player.x,player.y,player.z);playerGroup.rotation.y=performance.now()<player.spinUntil?player.facing+(1-(player.spinUntil-performance.now())/980)*Math.PI*4:player.facing;syncPlayerRootScale();contactShadow.position.set(player.x,ground+.025,player.z);const air=Math.max(0,player.y-ground);const ss=clamp(1-air*.08,.48,1);contactShadow.scale.setScalar(ss);contactShadow.material.opacity=clamp(.27-air*.035,.06,.27);vehicleVisual.visible=player.vehicle&&!player.car.passengerOf;if(world.boat)world.boat.group.visible=true;updateBoatPanel();
    animatePlayer(dt);checkHazards();collectNearbyCrystals();updateContext();
  }
  function updateVehiclePhysics(dt,ix,iz){
    const car=player.car,steer=Math.abs(ix)<.06?0:ix,throttle=Math.abs(iz)<.05?0:iz;
    if(car.passengerOf){const ghost=world.ghosts.get(car.passengerOf),target=ghost?.userData?.target;if(!ghost||!target?.vehicle){car.hostMissingAt=car.hostMissingAt||performance.now();if(performance.now()-car.hostMissingAt>3500){toast('O motorista saiu. Você deixou o carro.','warn');exitVehicle(true);}player.vx=player.vz=0;return;}car.hostMissingAt=0;const heading=Number(target.r||ghost.rotation.y||car.heading),tx=Number(target.x??ghost.position.x)+Math.cos(heading)*.62-Math.sin(heading)*.12,tz=Number(target.z??ghost.position.z)-Math.sin(heading)*.62-Math.cos(heading)*.12;player.vx=clamp((tx-player.x)*10,-26,26);player.vz=clamp((tz-player.z)*10,-26,26);car.heading=heading;player.facing=heading;return;}
    const turbo=sprintRequested();const maxSpeed=turbo?29:23.5,maxReverse=-8.5;
    const accelFactor=car.speed>=0?Math.max(.22,1-car.speed/maxSpeed):1;
    const braking=(car.speed>0.2&&throttle<0)||(car.speed<-.2&&throttle>0)?2.75:1;
    const throttleAccel=throttle>=0?throttle*(turbo?23:16.5)*accelFactor:throttle*10.5*braking;
    car.speed+=throttleAccel*dt;if(!throttle)car.speed*=Math.pow(.05,dt);car.speed=clamp(car.speed,maxReverse,maxSpeed);
    const speedRatio=clamp(Math.abs(car.speed)/7,0,1),highSpeedDamp=1/(1+Math.abs(car.speed)/20);car.steerVisual=lerp(car.steerVisual,steer,Math.min(1,dt*9));
    const steeringAuthority=Math.max(clamp(Math.abs(car.speed)/1.5,0,1),Math.abs(throttle)>.1?.2:0);const lowSpeedAssist=.72+speedRatio*.48,turnRate=3.05*lowSpeedAssist*highSpeedDamp*(car.speed<-.08?-1:1);car.heading+=car.steerVisual*turnRate*steeringAuthority*dt;
    const fx=Math.sin(car.heading),fz=Math.cos(car.heading),desiredVx=fx*car.speed,desiredVz=fz*car.speed;const turnHarshness=Math.abs(car.steerVisual)*speedRatio,grip=clamp(1-turnHarshness*.56,.38,1);
    player.vx=lerp(player.vx,desiredVx,Math.min(1,dt*13.5*grip));player.vz=lerp(player.vz,desiredVz,Math.min(1,dt*13.5*grip));car.drift=clamp((1-grip)*clamp(Math.abs(car.speed)/8,0,1),0,1);player.facing=car.heading;
  }
  let animTime=0;
  function animatePlayer(dt){
    if (!playerModel) return;
    animTime+=dt; playerMixer?.update(dt);
    const parts=playerModel.userData.parts;const speed=Math.hypot(player.vx,player.vz);const walking=speed>.25&&player.grounded&&!player.vehicle;const swing=walking?Math.sin(animTime*(8+speed*.45))*.62:0;
    if(parts){
      parts.leftArm.rotation.x=lerp(parts.leftArm.rotation.x,player.grounded?swing:-.65,.22);parts.rightArm.rotation.x=lerp(parts.rightArm.rotation.x,player.grounded?-swing:-.65,.22);parts.leftLeg.rotation.x=lerp(parts.leftLeg.rotation.x,player.grounded?-swing*.8:.38,.22);parts.rightLeg.rotation.x=lerp(parts.rightLeg.rotation.x,player.grounded?swing*.8:.38,.22);
      if(performance.now()<player.emoteUntil){if(player.emoteType==='wave'){parts.rightArm.rotation.x=-2.25;parts.rightArm.rotation.z=Math.sin(animTime*10)*.55;}else if(player.emoteType==='dance'){parts.leftArm.rotation.z=1.1;parts.rightArm.rotation.z=-1.1;playerModel.rotation.y=Math.sin(animTime*4)*.35;}else if(player.emoteType==='selfie'){parts.leftArm.rotation.x=-1.7;parts.rightArm.rotation.x=-.9;playerModel.rotation.z=.08;}else if(player.emoteType==='highfive'){parts.rightArm.rotation.x=-2.6;}else if(player.emoteType==='play'){parts.leftArm.rotation.x=-1.9;parts.rightArm.rotation.x=-1.9;parts.leftArm.rotation.z=.55;parts.rightArm.rotation.z=-.55;playerModel.position.y+=(Math.sin(animTime*10)+1)*.09;playerModel.rotation.y+=Math.sin(animTime*5)*.08;}else if(player.emoteType==='hug'){parts.leftArm.rotation.x=-1.45;parts.rightArm.rotation.x=-1.45;parts.leftArm.rotation.z=-.48;parts.rightArm.rotation.z=.48;}else if(player.emoteType==='tool'){parts.rightArm.rotation.x=-1.25-Math.sin(animTime*18)*1.0;parts.rightArm.rotation.z=-.22;parts.leftArm.rotation.x=-.45;}}else{parts.leftArm.rotation.z=lerp(parts.leftArm.rotation.z,0,.2);parts.rightArm.rotation.z=lerp(parts.rightArm.rotation.z,0,.2);playerModel.rotation.y=lerp(playerModel.rotation.y,0,.18);}
      if(fishingVisual?.active){const phase=fishingVisual.phase,cast=phase==='casting',pull=phase==='hooked'||phase==='pulling'||phase==='caught';parts.rightArm.rotation.x=lerp(parts.rightArm.rotation.x,pull?-2.35:cast?-1.95:-1.45,.38);parts.leftArm.rotation.x=lerp(parts.leftArm.rotation.x,pull?-1.85:cast?-1.35:-1.1,.38);parts.rightArm.rotation.z=lerp(parts.rightArm.rotation.z,-.22,.3);parts.leftArm.rotation.z=lerp(parts.leftArm.rotation.z,.28,.3);playerModel.rotation.z=lerp(playerModel.rotation.z,pull?-.08:.03,.2);}
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
    for(const h of world.hazards){if(Math.abs(player.x-h.x)<=h.w/2&&Math.abs(player.z-h.z)<=h.d/2&&player.y<.6){if(h.type==='water'){if(!player.boating){player.vx*=.9;player.vz*=.9;}}else if(performance.now()>player.damageUntil){player.damageUntil=performance.now()+1200;state.needs.energy=clamp(state.needs.energy-18,0,100);toast('Cuidado com a lava!','bad');returnHome();}}}
  }
  function collectNearbyCrystals(){
    for(const c of world.crystals){if(c.got)continue;c.mesh.rotation.y+=.035;c.mesh.position.y=c.y+Math.sin(animTime*2+c.x)*.12;if(Math.hypot(player.x-c.x,player.z-c.z)<1.25&&Math.abs(player.y-c.mesh.position.y)<2)collectCrystal(c);}
  }

  function npcSpeech(npc,text,type='good'){if(distance2D(player,npc.group.position)<12)toast(`${npc.name}: ${text}`,type,2400);npc.emoteType=type==='warn'?'wave':'dance';npc.emoteUntil=performance.now()+1600;}
  function nearestRideCompanion(radius=7){
    return world.npcs.filter(n=>!n.passengerMode&&(n.pendingRide||n.following)).sort((a,b)=>distance2D(player,a.group.position)-distance2D(player,b.group.position)).find(n=>distance2D(player,n.group.position)<=radius)||null;
  }
  function nearestBoardableNpc(radius=4.8){
    return world.npcs.filter(n=>!n.passengerMode).sort((a,b)=>distance2D(player,a.group.position)-distance2D(player,b.group.position)).find(n=>distance2D(player,n.group.position)<=radius)||null;
  }
  function boardNpcPassenger(npc,kind){
    if(!npc)return false;const current=kind==='boat'?player.boat:player.car;if(current.passengerUid||current.passengerBotId)return false;current.passengerBotId=npc.id;npc.passengerMode=kind;npc.pendingRide=false;npc.following=false;if(npc.mobility?.ride)npc.mobility.ride.visible=false;toast(`${npc.name} entrou como passageiro no ${kind==='boat'?'barco':'carro'}.`,'good',2300);saveState();return true;
  }
  function releaseNpcPassenger(kind){
    const current=kind==='boat'?player.boat:player.car,id=current.passengerBotId;if(!id)return;const npc=world.npcs.find(n=>n.id===id);if(npc){const exitX=kind==='boat'?BOAT_DOCK.exitX+1.2:player.x+1.8,exitZ=kind==='boat'?clamp(player.z,BOAT_DOCK.minZ+.25,BOAT_DOCK.maxZ-.25):player.z;npc.passengerMode='';npc.group.position.set(exitX,groundHeightAt(exitX,exitZ),exitZ);npc.baseX=npc.group.position.x;npc.baseZ=npc.group.position.z;if(npc.mobility?.ride)npc.mobility.ride.visible=true;}current.passengerBotId='';
  }
  function updateNpcSociety(dt){
    updateNpcSociety.acc=(updateNpcSociety.acc||0)+dt;if(updateNpcSociety.acc<9)return;updateNpcSociety.acc=0;if(!world.npcs.length)return;
    const npc=world.npcs[Math.floor(Math.random()*world.npcs.length)],roll=Math.random();
    if(roll<.22){const gift=Math.random()<.5?'food':'coins';if(gift==='food'){state.inventory.food=(state.inventory.food||0)+1;npcSpeech(npc,'Trouxe uma comida para você!');}else{state.profile.coins+=8;npcSpeech(npc,'Ganhei algumas moedas e dividi com você!');}saveState();updateHUD();}
    else if(roll<.44){npcSpeech(npc,'Quer apostar uma corrida comigo?');npc.userDataChallengeUntil=performance.now()+12000;}
    else if(roll<.66){const other=world.npcs.find(n=>n!==npc);if(other){state.npcSociety.friendships[`${npc.id}-${other.id}`]=(state.npcSociety.friendships[`${npc.id}-${other.id}`]||0)+1;npcSpeech(npc,`Conversei com ${other.name} na praça.`);}}
    else if(roll<.82){npcSpeech(npc,'Hoje estou chateado. Podemos conversar com calma?','warn');state.npcSociety.moods[npc.id]='chateado';}
    else{const available=world.houses.find(h=>!h.publicBuilding&&!cloudHouseRecord(h.id)&&!state.npcSociety.houses[h.id]);if(available){state.npcSociety.houses[available.id]=npc.id;npcSpeech(npc,`Estou juntando moedas para morar na ${available.name}.`);saveState();}}
  }

  function updateNPCs(dt){
    for(const npc of world.npcs){
      const near=distance2D(player,npc.group.position)<3.2;
      const oldX=npc.group.position.x,oldZ=npc.group.position.z;
      if(npc.passengerMode){
        const heading=npc.passengerMode==='boat'?player.boat.heading:player.car.heading,lx=.65,lz=npc.passengerMode==='boat'?.62:-.18;npc.group.position.x=player.x+Math.cos(heading)*lx+Math.sin(heading)*lz;npc.group.position.z=player.z-Math.sin(heading)*lx+Math.cos(heading)*lz;npc.group.position.y=npc.passengerMode==='boat'?.75:.3;npc.group.rotation.y=heading;
      }else if(npc.following){
        const backX=player.x-Math.sin(player.facing)*2.2,backZ=player.z-Math.cos(player.facing)*2.2;
        npc.group.position.x=lerp(npc.group.position.x,backX,Math.min(1,dt*2.4));npc.group.position.z=lerp(npc.group.position.z,backZ,Math.min(1,dt*2.4));npc.group.rotation.y=lerpAngle(npc.group.rotation.y,player.facing,Math.min(1,dt*5));
      }else if(near){
        const look=Math.atan2(player.x-npc.group.position.x,player.z-npc.group.position.z);
        npc.group.rotation.y=lerpAngle(npc.group.rotation.y,look,Math.min(1,dt*5.5));
      }else if(npc.mobility){
        const route=npc.mobility.route,target=route[npc.mobility.index],dx=target.x-npc.group.position.x,dz=target.z-npc.group.position.z,d=Math.hypot(dx,dz);if(d<.2)npc.mobility.index=(npc.mobility.index+1)%route.length;else{const step=Math.min(d,npc.mobility.speed*dt);npc.group.position.x+=dx/d*step;npc.group.position.z+=dz/d*step;npc.group.rotation.y=lerpAngle(npc.group.rotation.y,Math.atan2(dx,dz),Math.min(1,dt*5));for(const wheel of npc.mobility.wheels)wheel.rotation.x-=step*3;}
      }else{
        npc.phase+=dt*.45;
        const tx=npc.baseX+Math.sin(npc.phase)*npc.pathRadius,tz=npc.baseZ+Math.cos(npc.phase*.83)*npc.pathRadius;
        npc.group.position.x=lerp(npc.group.position.x,tx,dt*.45);npc.group.position.z=lerp(npc.group.position.z,tz,dt*.45);
        npc.group.rotation.y=lerpAngle(npc.group.rotation.y,Math.atan2(tx-npc.group.position.x,tz-npc.group.position.z),Math.min(1,dt*5));
      }
      if(!npc.passengerMode)npc.group.position.y=lerp(npc.group.position.y,0,Math.min(1,dt*8));
      const moved=Math.hypot(npc.group.position.x-oldX,npc.group.position.z-oldZ);
      const riding=!!npc.mobility&&!npc.passengerMode&&!npc.following,walk=moved>.001&&!riding?Math.sin(animTime*8+npc.phase)*.52:0;
      const gesture=near?Math.sin(animTime*2.4+npc.phase)*.12:0,emote=performance.now()<npc.emoteUntil?npc.emoteType:'';
      if(npc.limbs){
        npc.limbs.leftArm.rotation.x=lerp(npc.limbs.leftArm.rotation.x,riding?-1.2:emote==='dance'?-1.4:walk+gesture,.18);
        npc.limbs.rightArm.rotation.x=lerp(npc.limbs.rightArm.rotation.x,riding?-1.2:emote==='wave'?-2.2:emote==='dance'?-1.4:-walk-gesture,.18);
        npc.limbs.leftLeg.rotation.x=lerp(npc.limbs.leftLeg.rotation.x,riding?1.05:-walk*.78,.18);
        npc.limbs.rightLeg.rotation.x=lerp(npc.limbs.rightLeg.rotation.x,riding?1.05:walk*.78,.18);
      }
      npc.body.position.y=(riding?1.42:1.1)+(moved>.001?Math.abs(Math.sin(animTime*8+npc.phase))*.035:Math.sin(animTime*2+npc.phase)*.012);
    }
  }
  function updateEnemies(dt){
    for(const e of world.enemies){
      if(e.dead){if(performance.now()-e.lastHit>18000){e.dead=false;e.hp=e.type==='golem'?3:1;e.group.visible=true;e.group.position.set(e.baseX,0,e.baseZ);}continue;}
      const d=distance2D(player,e);let tx=e.baseX+Math.sin(animTime*.55+e.phase)*4,tz=e.baseZ+Math.cos(animTime*.48+e.phase)*4;
      if(d<9&&!currentHouse){tx=player.x;tz=player.z;}
      const speed=e.type==='bat'?2.1:e.type==='golem'?1.0:1.45;e.group.position.x=lerp(e.group.position.x,tx,dt*speed);e.group.position.z=lerp(e.group.position.z,tz,dt*speed);e.group.position.y=e.type==='bat'?1.2+Math.sin(animTime*3+e.phase)*.35:0;e.group.rotation.y=Math.atan2(tx-e.group.position.x,tz-e.group.position.z);
      if(d<1.45&&performance.now()>player.damageUntil){player.damageUntil=performance.now()+1100;if(performance.now()<player.shieldUntil){toast('O Escudo Furtivo bloqueou o ataque!','good',1300);beep(690,60,'sine');continue;}state.needs.energy=clamp(state.needs.energy-12,0,100);state.needs.fun=clamp(state.needs.fun-4,0,100);toast('Monstro acertou!','bad');vibrate([35,40,35]);saveState();}
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
    if(!els.modal.hidden||paused||player.transit.mode)return;
    if(player.vehicle){vehicleHorn();return;}
    if(currentHouse){toast('Use o poder do lado de fora.','warn');return;}
    const dir={x:Math.sin(player.facing),z:Math.cos(player.facing)};const mesh=new THREE.Mesh(new THREE.BoxGeometry(.42,.42,.42),mat(0xff5a12,{emissive:0xff2a00,emissiveIntensity:.9}));mesh.position.set(player.x,player.y+1.35,player.z);worldGroup.add(mesh);world.fireballs.push({mesh,x:player.x,y:player.y+1.35,z:player.z,vx:dir.x*12,vz:dir.z*12,life:1.4});beep(220,90,'sawtooth');vibrate(18);
  }
  function updateFireballs(dt){
    for(let i=world.fireballs.length-1;i>=0;i--){const f=world.fireballs[i];f.life-=dt;f.x+=f.vx*dt;f.z+=f.vz*dt;f.mesh.position.set(f.x,f.y,f.z);f.mesh.rotation.x+=dt*7;f.mesh.rotation.y+=dt*9;let hit=false;for(const e of world.enemies){if(!e.dead&&Math.hypot(f.x-e.group.position.x,f.z-e.group.position.z)<1.1){damageEnemy(e,1);hit=true;break;}}if(hit||f.life<=0){worldGroup.remove(f.mesh);world.fireballs.splice(i,1);}}
  }

  function updateCamera(dt){
    let desiredPos,look;
    if(player.transit.mode==='bus'){
      const bus=world.buses.find(item=>item.id===player.transit.busId);
      if(bus){
        bus.group.updateMatrixWorld(true);
        desiredPos=bus.group.localToWorld(new THREE.Vector3(.28,2.28,-2.56));
        look=bus.group.localToWorld(new THREE.Vector3(-.18,1.55,1.75));
        camera.fov=68;
      }
    }
    if(!desiredPos&&currentHouse&&cameraMode==='interior'){
      const h=currentHouse;const portrait=innerHeight>innerWidth;const orbit=clamp(cameraYaw,-1.18,1.18);const dist=clamp((portrait?8.2:7.2)+cameraZoom,5.2,12.5);const height=clamp((portrait?5.6:4.6)+cameraPitch*2.4+cameraZoom*.18,3.8,8.8);
      desiredPos=new THREE.Vector3(player.x-Math.sin(orbit)*dist,player.y+height,player.z+Math.cos(orbit)*dist);look=new THREE.Vector3(player.x,player.y+1.15,player.z);camera.fov=portrait?54:50;
    }else if(!desiredPos){
      const portrait=innerHeight>innerWidth;const speed=Math.hypot(player.vx,player.vz);
      if((player.vehicle||player.boating)&&!input.cameraDrag){const heading=player.vehicle?player.car.heading:player.boat.heading;cameraYaw=lerpAngle(cameraYaw,Math.PI-heading,Math.min(1,dt*3.2));}
      const speedKick=clamp(Math.abs(player.vehicle?player.car.speed:speed)/9,0,1.6);
      const dist=clamp((portrait?12.5:10.2)+(player.vehicle?3.4:player.boating?2.2:0)+speedKick*1.6+cameraZoom,6.5,24);const height=clamp((portrait?6.6:5.4)+(player.vehicle?.4:player.boating?.25:0)+cameraPitch*2.2+cameraZoom*.16,3.5,12);
      desiredPos=new THREE.Vector3(player.x-Math.sin(cameraYaw)*dist,player.y+height,player.z+Math.cos(cameraYaw)*dist);const visualHeight=1.4*playerScaleValue()*(player.crouched?.72:1);look=new THREE.Vector3(player.x+Math.sin(cameraYaw)*3.5,player.y+visualHeight,player.z-Math.cos(cameraYaw)*3.5);
      camera.fov=(portrait?57:60)+speedKick*(player.vehicle?7:player.boating?4:2);
    }
    const t=1-Math.exp(-dt*7.5);camera.position.lerp(desiredPos,t);camera.lookAt(look);camera.updateProjectionMatrix();
  }

  function nearestInteractable(){
    if(activeRace)return null;
    if(player.transit.mode==='metro')return null;
    if(player.transit.mode==='bus')return{id:'request-bus-stop',type:'bus',icon:'🔔',label:player.transit.requestStop?'Parada já solicitada':'Pedir próxima parada',radius:999,priority:999,action:()=>{player.transit.requestStop=true;updateTransitPanel();toast('Parada solicitada.','good',1200);}};
    if(player.boating){const free=!player.boat.passengerOf&&!player.boat.passengerUid&&!player.boat.passengerBotId,remote=free?nearestRemotePlayer():null,npc=free?nearestBoardableNpc():null;if(remote)return{id:`boat-remote-${remote.uid}`,type:'remote-player',icon:'🌐',label:`Convidar ${remote.ghost.userData.displayName||'Jogador'} para o barco`,radius:999,priority:1001,action:()=>openRemotePlayerActions(remote.uid,remote.ghost)};if(npc)return{id:`boat-invite-${npc.id}`,type:'boat',icon:'🛶',label:`Convidar ${npc.name} para o barco`,radius:999,priority:1000,action:()=>boardNpcPassenger(npc,'boat')};return{id:'exit-boat',type:'boat',icon:'🛶',label:'Sair do barco no píer',radius:999,priority:999,action:exitBoat};}
    if(player.vehicle){const free=!player.car.passengerOf&&!player.car.passengerUid&&!player.car.passengerBotId,remote=free?nearestRemotePlayer():null,npc=free?nearestBoardableNpc():null;if(remote)return{id:`car-remote-${remote.uid}`,type:'remote-player',icon:'🌐',label:`Convidar ${remote.ghost.userData.displayName||'Jogador'} para o carro`,radius:999,priority:1001,action:()=>openRemotePlayerActions(remote.uid,remote.ghost)};if(npc)return{id:`car-invite-${npc.id}`,type:'vehicle',icon:'🚗',label:`Convidar ${npc.name} para o carro`,radius:999,priority:1000,action:()=>boardNpcPassenger(npc,'car')};return{id:'exit-vehicle',type:'vehicle',icon:'🚗',label:'Sair do carro',radius:999,priority:999,action:exitVehicle};}
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
    updateNeeds.acc=(updateNeeds.acc||0)+dt;if(updateNeeds.acc<1)return;const sec=updateNeeds.acc;updateNeeds.acc=0;state.needs.hunger=clamp(state.needs.hunger-sec*.065,0,100);state.needs.energy=clamp(state.needs.energy-sec*((player.vehicle||player.boating)?(sprintRequested()?.085:.035):(input.isSprinting?.16:.045)),0,100);state.needs.fun=clamp(state.needs.fun-sec*.025,0,100);state.needs.hygiene=clamp(state.needs.hygiene-sec*.028,0,100);if(state.needs.hunger<8&&Math.random()<.08)toast(`${playerDisplayName()} está com fome.`,'warn');updateHUD();if(!updateNeeds.lastSave||performance.now()-updateNeeds.lastSave>10000){updateNeeds.lastSave=performance.now();saveState();}
  }

  let localChannel=null,lastPublish=0,lastPublishSnapshot=null,lastPublishHeartbeat=0;

  let multiplayerState={mode:'solo',connected:false,count:0,room:'mundo-publico',error:'',players:[]};const remotePresence=new Map();let pendingCloudCampfires={},pendingCloudExtensions={};
  const cloudHouses=new Map(),cloudChat=[],incomingChallenges=new Map(),incomingSocialRequests=new Map(),gameSessions=new Map(),shownChallengeToasts=new Set(),shownSocialToasts=new Set(),shownGameResults=new Set();let activeMultiplayerGameId='',promptChallengeId='',promptSessionId='',promptSocialRequestId='';
  function multiplayerGameLabel(type){return type==='portuguese'?'Português Kids':type==='english'?'English Kids':'Matemática Kids';}
  function pendingChallenges(){return [...incomingChallenges.values()].filter(c=>c.status==='pending');}
  function readyGameSessions(){const uid=window.OTTHOS_RTDB?.uid;return [...gameSessions.values()].filter(s=>(s.fromUid===uid||s.toUid===uid)&&s.status==='active');}
  function closeChallengePrompt(){if(!els.challengePrompt)return;document.body.classList.remove('social-prompt-open');els.challengePrompt.hidden=true;els.challengePrompt.classList.remove('ready','incoming','social');promptChallengeId='';promptSessionId='';promptSocialRequestId='';els.challengePromptAccept.disabled=false;els.challengePromptDecline.disabled=false;}
  function showIncomingChallengePrompt(c){if(!c||c.status!=='pending'||!els.challengePrompt)return;document.body.classList.add('social-prompt-open');promptChallengeId=c.id;promptSessionId='';els.challengePrompt.classList.add('incoming');els.challengePrompt.classList.remove('ready','social');els.challengePromptKicker.textContent='NOVO DESAFIO';els.challengePromptTitle.textContent=`${c.fromName||'Jogador'} desafiou você`;els.challengePromptText.textContent=`${multiplayerGameLabel(c.type)} • toque em Aceitar e jogar`;els.challengePromptAccept.textContent='Aceitar e jogar';els.challengePromptDecline.textContent='Recusar';els.challengePrompt.hidden=false;}
  function showReadySessionPrompt(s){if(!s||s.status!=='active'||!els.challengePrompt)return;document.body.classList.add('social-prompt-open');const uid=window.OTTHOS_RTDB?.uid,mine=s.players?.[uid];if(mine?.finished)return;promptSessionId=s.id;promptChallengeId='';els.challengePrompt.classList.add('ready');els.challengePrompt.classList.remove('incoming','social');els.challengePromptKicker.textContent='PARTIDA PRONTA';els.challengePromptTitle.textContent=`Duelo de ${multiplayerGameLabel(s.type)}`;els.challengePromptText.textContent=`Contra ${sessionOpponentName(s)} • os dois jogarão as mesmas 5 atividades`;els.challengePromptAccept.textContent='Jogar agora';els.challengePromptDecline.textContent='Depois';els.challengePrompt.hidden=false;}
  const SOCIAL_ACTION_LABELS={dance:'dançar',play:'brincar',highfive:'fazer toca aqui',hug:'dar um abraço',selfie:'tirar uma selfie',vehiclePassenger:'entrar no carro como passageiro',boatPassenger:'entrar no barco como passageiro',fishTogether:'pescar junto',campfireJoin:'participar da fogueira',huntTogether:'rastrear animais junto'};
  function socialActionLabel(type){return SOCIAL_ACTION_LABELS[type]||'interagir';}
  function socialRequestPending(){return[...incomingSocialRequests.values()].filter(r=>r.status==='pending'&&Number(r.expiresAt||0)>Date.now());}
  function showIncomingSocialRequest(request){document.body.classList.add('social-prompt-open');
    if(!request||request.status!=='pending'||Number(request.expiresAt||0)<=Date.now()||!els.challengePrompt)return;
    promptSocialRequestId=request.id;promptChallengeId='';promptSessionId='';els.challengePrompt.classList.add('incoming','social');els.challengePrompt.classList.remove('ready');els.challengePromptKicker.textContent='CONVITE MULTIPLAYER';els.challengePromptTitle.textContent=`${request.fromName||'Jogador'} quer ${socialActionLabel(request.actionType)}`;els.challengePromptText.textContent='Nada será executado antes da sua confirmação.';els.challengePromptAccept.textContent='Aceitar';els.challengePromptDecline.textContent='Recusar';els.challengePrompt.hidden=false;
  }
  async function sendSocialActionRequest(targetUid,targetName,actionType,extra={}){
    if(actionType==='boatPassenger'&&(!player.boating||player.boat.passengerOf)){toast('Somente o motorista do barco pode convidar um passageiro.','warn',2500);return false;}
    if(actionType==='boatPassenger'&&(player.boat.passengerUid||player.boat.passengerBotId)){toast('Este barco já tem um passageiro.','warn',2300);return false;}
    if(actionType==='vehiclePassenger'&&(!player.vehicle||player.car.passengerOf)){toast('Somente o motorista do carro pode convidar um passageiro.','warn',2500);return false;}
    if(actionType==='vehiclePassenger'&&(player.car.passengerUid||player.car.passengerBotId)){toast('Este carro já tem um passageiro.','warn',2300);return false;}
    const result=await window.OTTHOS_RTDB?.sendSocialRequest?.(targetUid,actionType,targetName,extra);if(result?.ok){state.multiplayerRequests.lastSentAt=Date.now();saveState();toast(`Convite enviado para ${targetName}.`,'good',2300);return true;}toast(result?.error||'Não foi possível enviar o convite.','warn',2600);return false;
  }
  function applyAcceptedSocialAction(actionType,context={}){
    const rewardKey=String(context.requestId||'');if(rewardKey&&state.multiplayerRequests.completed.includes(rewardKey))return;
    if(['dance','play','highfive','hug','selfie'].includes(actionType)){triggerEmote(actionType);if(actionType==='play')state.needs.fun=clamp(state.needs.fun+10,0,100);}
    else if(actionType==='vehiclePassenger'){if(context.role==='passenger'||context.incoming)enterVehicleAsPassenger(context.fromUid||context.partnerUid,context.vehicleId||'');else{player.car.passengerUid=context.partnerUid||'';toast(`${context.partnerName||'Seu amigo'} entrou como passageiro.`,'good',2600);}}
    else if(actionType==='boatPassenger'){if(context.role==='passenger'||context.incoming)enterBoatAsPassenger(context.fromUid||context.partnerUid);else{player.boat.passengerUid=context.partnerUid||'';toast(`${context.partnerName||'Seu amigo'} entrou como passageiro.`,'good',2600);}}
    else if(actionType==='fishTogether'){startFishing(player.boating?'boat':'shore',{cooperative:true,requestId:rewardKey,partnerName:context.partnerName||context.fromName||'amigo'});}
    else if(actionType==='campfireJoin'){openNearestCampfire();}
    else if(actionType==='huntTogether'){startHunting({cooperative:true,requestId:rewardKey,partnerName:context.partnerName||context.fromName||'amigo'});}
    if(rewardKey){state.multiplayerRequests.completed.push(rewardKey);state.multiplayerRequests.completed=state.multiplayerRequests.completed.slice(-80);}saveState();
  }
  async function acceptIncomingSocialRequest(id){
    const request=incomingSocialRequests.get(id);if(!request)return;els.challengePromptAccept.disabled=true;els.challengePromptDecline.disabled=true;const result=await window.OTTHOS_RTDB?.respondSocialRequest?.(id,'accepted');
    if(result?.ok){closeChallengePrompt();applyAcceptedSocialAction(request.actionType,{incoming:true,role:['boatPassenger','vehiclePassenger'].includes(request.actionType)?'passenger':'participant',requestId:id,fromUid:request.fromUid,fromName:request.fromName,partnerName:request.fromName,vehicleId:request.vehicleId||request.extra?.vehicleId||''});toast(`Convite de ${request.fromName||'Jogador'} aceito.`,'good',2200);setTimeout(()=>window.OTTHOS_RTDB?.completeSocialRequest?.(id),1800);}else{closeChallengePrompt();toast(result?.reason||result?.error||'O convite não pôde ser aceito.','warn',2600);}
  }
  async function declineIncomingSocialRequest(id){
    const request=incomingSocialRequests.get(id);els.challengePromptAccept.disabled=true;els.challengePromptDecline.disabled=true;const result=await window.OTTHOS_RTDB?.respondSocialRequest?.(id,'declined');closeChallengePrompt();toast(request?`Convite de ${request.fromName||'Jogador'} recusado.`:(result?.error||'Convite recusado.'),'warn',1900);
  }
  async function launchSessionWithCountdown(session){if(!session)return;closeChallengePrompt();closeModal();let count=3;const draw=()=>openModal(`Duelo: ${multiplayerGameLabel(session.type)}`,`<div class="duel-countdown"><small>Contra ${escapeHtml(sessionOpponentName(session))}</small><b>${count}</b><span>Prepare-se!</span></div>`,root=>{});draw();const timer=setInterval(()=>{count--;if(count<=0){clearInterval(timer);closeModal();startMultiplayerEducationGame(session);}else draw();},620);}
  function updateOnlineAttention(){const count=pendingChallenges().length+socialRequestPending().length+readyGameSessions().filter(s=>!s.players?.[window.OTTHOS_RTDB?.uid]?.finished).length;els.onlineBtn?.classList.toggle('attention',count>0);if(els.onlineBtn){const span=$('span',els.onlineBtn);if(span)span.textContent=count?`Online ${count}`:'Online';}}
  function challengeInboxHtml(){const list=pendingChallenges();return list.length?`<div class="challenge-inbox">${list.map(c=>`<article class="challenge-card"><div><b>⚔️ ${escapeHtml(c.fromName||'Jogador')}</b><span>Desafio: ${multiplayerGameLabel(c.type)}</span></div><div><button class="accept" data-accept-challenge="${c.id}">Aceitar e jogar</button><button data-decline-challenge="${c.id}">Recusar</button></div></article>`).join('')}</div>`:'<p class="empty-online">Nenhum convite educativo pendente.</p>';}
  function socialRequestInboxHtml(){const list=socialRequestPending();return list.length?`<div class="challenge-inbox social-inbox">${list.map(r=>`<article class="challenge-card social"><div><b>🤝 ${escapeHtml(r.fromName||'Jogador')}</b><span>Quer ${escapeHtml(socialActionLabel(r.actionType))}</span></div><div><button class="accept" data-accept-social="${r.id}">Aceitar</button><button data-decline-social="${r.id}">Recusar</button></div></article>`).join('')}</div>`:'<p class="empty-online">Nenhuma solicitação social pendente.</p>';}
  function completedGameSessions(){const uid=window.OTTHOS_RTDB?.uid;return [...gameSessions.values()].filter(s=>s.status==='completed'&&s.result&&(s.fromUid===uid||s.toUid===uid)).sort((a,b)=>Number(b.completedAt||b.result?.completedAt||0)-Number(a.completedAt||a.result?.completedAt||0)).slice(0,20);}
  function rememberMatchResult(session){if(!session?.result)return null;const list=state.learning.matchHistory||(state.learning.matchHistory=[]),existing=list.find(x=>x.id===session.id);if(existing)return existing;const uid=window.OTTHOS_RTDB?.uid,r=session.result,mine=session.players?.[uid]||{},other=Object.entries(session.players||{}).find(([id])=>id!==uid)?.[1]||{};const entry={id:session.id,type:session.type,opponent:sessionOpponentName(session),myScore:Number(mine.score||0),otherScore:Number(other.score||0),won:!r.draw&&r.winnerUid===uid,draw:!!r.draw,winnerName:r.winnerName||'',completedAt:Number(session.completedAt||r.completedAt||Date.now()),rewarded:false};list.unshift(entry);state.learning.matchHistory=list.slice(0,20);return entry;}
  function duelHistoryHtml(){const sessions=completedGameSessions();return sessions.length?`<div class="duel-history">${sessions.map(s=>{const r=s.result,uid=window.OTTHOS_RTDB?.uid,mine=s.players?.[uid]||{},other=Object.entries(s.players||{}).find(([id])=>id!==uid)?.[1]||{},won=!r.draw&&r.winnerUid===uid;return`<article class="duel-history-card ${won?'won':r.draw?'draw':'lost'}"><span>${r.draw?'🤝':won?'🏆':'🎮'}</span><div><b>${r.draw?'Empate':`Vencedor: ${escapeHtml(r.winnerName||'Jogador')}`}</b><small>${multiplayerGameLabel(s.type)} • ${Number(mine.score||0)} × ${Number(other.score||0)} contra ${escapeHtml(sessionOpponentName(s))}</small></div></article>`}).join('')}</div>`:'<p class="empty-online">Nenhum duelo concluído ainda.</p>';}
  function activeSessionsHtml(){const uid=window.OTTHOS_RTDB?.uid,list=readyGameSessions();return list.length?`<div class="challenge-inbox">${list.map(s=>{const other=s.fromUid===uid?s.toName||remotePresence.get(s.toUid)?.name||'Adversário':s.fromName||'Adversário',mine=s.players?.[uid];return`<article class="challenge-card ready"><div><b>🎮 ${multiplayerGameLabel(s.type)}</b><span>contra ${escapeHtml(other)}</span></div><button class="accept" data-play-session="${s.id}" ${mine?.finished?'disabled':''}>${mine?.finished?'Concluído':'Jogar agora'}</button></article>`}).join('')}</div>`:'';}
  function bindChallengeCards(root=els.modalBody){$$('[data-accept-challenge]',root).forEach(btn=>btn.onclick=()=>acceptIncomingChallenge(btn.dataset.acceptChallenge));$$('[data-decline-challenge]',root).forEach(btn=>btn.onclick=()=>declineIncomingChallenge(btn.dataset.declineChallenge));$$('[data-accept-social]',root).forEach(btn=>btn.onclick=()=>acceptIncomingSocialRequest(btn.dataset.acceptSocial));$$('[data-decline-social]',root).forEach(btn=>btn.onclick=()=>declineIncomingSocialRequest(btn.dataset.declineSocial));$$('[data-play-session]',root).forEach(btn=>btn.onclick=()=>{const s=gameSessions.get(btn.dataset.playSession);if(s)launchSessionWithCountdown(s);});}
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
  function refreshOpenSocialHub(){updateOnlineAttention();if(els.modal.hidden||els.modalTitle.textContent!=='Mundo Online')return;const players=onlinePlayers(),status=$('#onlineStatusText',els.modalBody),count=$('#onlineCount',els.modalBody),list=$('#onlinePlayerList',els.modalBody),chat=$('#worldChatList',els.modalBody),socialInvites=$('#socialRequestInbox',els.modalBody),invites=$('#challengeInbox',els.modalBody),sessions=$('#activeGameSessions',els.modalBody),history=$('#duelHistory',els.modalBody);if(status)status.textContent=multiplayerStatusText();if(count)count.textContent=`${players.length} além de você`;if(list){list.innerHTML=onlinePlayerListHtml(players);bindOnlinePlayerCards(els.modalBody);}if(socialInvites){socialInvites.innerHTML=socialRequestInboxHtml();bindChallengeCards(els.modalBody);}if(invites){invites.innerHTML=challengeInboxHtml();bindChallengeCards(els.modalBody);}if(sessions){sessions.innerHTML=activeSessionsHtml();bindChallengeCards(els.modalBody);}if(history)history.innerHTML=duelHistoryHtml();if(chat){chat.innerHTML=cloudChat.slice(-30).map(m=>chatMessageHtml(m)).join('')||'<p>Envie a primeira mensagem.</p>';chat.scrollTop=chat.scrollHeight;}}
  function openSocialHub(){
    const players=onlinePlayers(),messages=cloudChat.slice(-30);
    openModal('Mundo Online',`<div class="online-status-card"><b id="onlineStatusText">${multiplayerStatusText()}</b><span>Todos entram automaticamente no mesmo mundo, sem escolher sala e sem senha.</span></div><div class="social-tabs"><b>Solicitações sociais</b><small>${socialRequestPending().length} pendente(s)</small></div><div id="socialRequestInbox">${socialRequestInboxHtml()}</div><div class="social-tabs"><b>Convites de jogos</b><small>${pendingChallenges().length} pendente(s)</small></div><div id="challengeInbox">${challengeInboxHtml()}</div><div id="activeGameSessions">${activeSessionsHtml()}</div><div class="social-tabs"><b>Histórico de duelos</b><small>vencedores registrados</small></div><div id="duelHistory">${duelHistoryHtml()}</div><div class="social-tabs"><b>Jogadores</b><small id="onlineCount">${players.length} além de você</small></div><div id="onlinePlayerList" class="online-player-list">${onlinePlayerListHtml(players)}</div><div class="social-tabs chat-title-row"><b>Chat do mundo</b><small>texto em tempo real</small></div><div id="worldChatList" class="world-chat-list">${messages.map(m=>chatMessageHtml(m)).join('')||'<p>Envie a primeira mensagem.</p>'}</div><div class="chat-compose"><input id="worldChatInput" maxlength="180" placeholder="Escreva uma mensagem..."><button data-send-world-chat>Enviar</button></div><div class="chat-history-actions"><button data-clear-local-chat>Ocultar conversa neste aparelho</button></div>`,root=>{
      bindOnlinePlayerCards(root);bindChallengeCards(root);
      const send=()=>{const input=$('#worldChatInput',root),text=(input?.value||'').trim();if(!text)return;window.OTTHOS_RTDB?.sendChat?.(text);input.value='';};$('[data-send-world-chat]',root).onclick=send;$('#worldChatInput',root)?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();send();}});
      $('[data-clear-local-chat]',root).onclick=()=>{state.social.chatHiddenBefore=Date.now();cloudChat.length=0;saveState(true);refreshOpenSocialHub();toast('Histórico ocultado neste aparelho.','good');};
    });
  }
  function escapeHtml(value=''){return String(value).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
  function chatMessageHtml(m){return`<article class="world-chat-message"><b>${escapeHtml(m.name||'Jogador')}</b><span>${escapeHtml(m.text||'')}</span></article>`;}
  function openRemotePlayerActions(uid,ghost){
    const name=ghost.userData.displayName||'Jogador',nearLake=isNearFishingArea()||player.boating,nearCamp=nearestActiveCampfire(8),nearHunt=Math.hypot(player.x+96,player.z+72)<25;
    const cooperative=`${player.vehicle&&!player.car.passengerOf&&!player.car.passengerUid&&!player.car.passengerBotId?'<button class="choice" data-player-action="vehiclePassenger"><b>🚗 Passageiro</b><span>Convidar para o seu carro</span></button>':''}${player.boating&&!player.boat.passengerOf&&!player.boat.passengerUid&&!player.boat.passengerBotId?'<button class="choice" data-player-action="boatPassenger"><b>🛶 Passageiro</b><span>Convidar para o seu barco</span></button>':''}${nearLake?'<button class="choice" data-player-action="fishTogether"><b>🎣 Pescar juntos</b><span>Cada jogador recebe o próprio peixe</span></button>':''}${nearCamp?'<button class="choice" data-player-action="campfireJoin"><b>🔥 Fogueira</b><span>Convidar para sentar e cozinhar</span></button>':''}${nearHunt?'<button class="choice" data-player-action="huntTogether"><b>🐾 Rastrear juntos</b><span>Atividade infantil sem violência</span></button>':''}`;
    openModal(name,`<p>Interaja com este jogador em tempo real. Ações conjuntas só começam depois que ele aceitar.</p><div class="choice-grid remote-social-grid"><button class="choice" data-player-action="wave"><b>👋 Acenar</b><span>Saudação imediata</span></button><button class="choice" data-player-action="dance"><b>🕺 Dançar juntos</b><span>Requer aceite</span></button><button class="choice" data-player-action="play"><b>🎈 Brincar</b><span>Requer aceite</span></button><button class="choice" data-player-action="highfive"><b>🙌 Toca aqui</b><span>Requer aceite</span></button><button class="choice" data-player-action="hug"><b>🤗 Abraçar</b><span>Requer aceite</span></button><button class="choice" data-player-action="selfie"><b>📸 Selfie</b><span>Requer aceite</span></button>${cooperative}<button class="choice" data-player-action="giftCoins"><b>🪙 Dar 10 moedas</b><span>Presente online</span></button><button class="choice" data-player-action="giftCrystal"><b>💎 Dar cristal</b><span>Usa 1 cristal</span></button><button class="choice" data-player-action="challenge"><b>⚔️ Desafiar</b><span>Matemática, Português ou English</span></button><button class="choice" data-player-action="message"><b>💬 Mencionar no chat</b><span>Abrir conversa pública</span></button></div>`,root=>{$$('[data-player-action]',root).forEach(btn=>btn.onclick=async()=>{
      const action=btn.dataset.playerAction;if(action==='message'){closeModal();openSocialHub();setTimeout(()=>{const input=$('#worldChatInput');if(input){input.value=`@${name} `;input.focus();}},100);return;}
      if(action==='giftCoins'){if(state.profile.coins<10){toast('Você não tem 10 moedas.','warn');return;}const ok=await window.OTTHOS_RTDB?.sendGift?.(uid,{type:'coins',amount:10});if(ok){addCoins(-10);toast(`Você presenteou ${name}.`,'good');}}
      else if(action==='giftCrystal'){if(state.inventory.crystals<1){toast('Você não tem cristal.','warn');return;}const ok=await window.OTTHOS_RTDB?.sendGift?.(uid,{type:'crystal',amount:1});if(ok){state.inventory.crystals--;saveState(true);toast(`Cristal enviado para ${name}.`,'good');}}
      else if(action==='challenge'){openChallengePicker(uid,name);return;}
      else if(action==='wave'){const ok=await window.OTTHOS_RTDB?.sendInteraction?.(uid,{type:'wave'});if(ok){triggerEmote('wave');toast(`Você acenou para ${name}.`,'good');}}
      else{await sendSocialActionRequest(uid,name,action,{boatId:state.boats.activeBoatId||'',vehicleId:player.car.id||'',campfireId:nearCamp?.data?.id||''});}
      closeModal();
    });});
  }
  function nearestRemotePlayer(){let found=null,best=Infinity;for(const [uid,g] of world.ghosts){const d=Math.hypot(player.x-g.position.x,player.z-g.position.z);if(d<2.7&&d<best){best=d;found={uid,ghost:g};}}return found;}
  function openMultiplayerConfig(){openSocialHub();}
  function applyCloudWorldObjects(){
    if(!worldGroup)return;const me=window.OTTHOS_RTDB?.uid||'';
    const fireItems=[];for(const[ownerUid,items]of Object.entries(pendingCloudCampfires||{}))if(ownerUid!==me)for(const item of Object.values(items||{}))if(item&&Number(item.expiresAt||0)>Date.now())fireItems.push({...item,ownerUid});
    const fireKeys=new Set(fireItems.map(x=>x.id));for(const c of [...world.campfires])if(c.data.remote&&!fireKeys.has(c.data.id)){c.interactable.disabled=true;worldGroup.remove(c.group);world.campfires=world.campfires.filter(x=>x!==c);}fireItems.forEach(item=>spawnCampfire(item,true));
    const extensionItems=[];for(const[ownerUid,items]of Object.entries(pendingCloudExtensions||{}))if(ownerUid!==me)for(const item of Object.values(items||{}))if(item)extensionItems.push({...item,ownerUid});
    const extensionKeys=new Set(extensionItems.map(x=>x.id));for(const e of [...world.houseExtensions])if(e.data.remote&&!extensionKeys.has(e.data.id)){worldGroup.remove(e.group);world.houseExtensions=world.houseExtensions.filter(x=>x!==e);const it=world.interactables.find(x=>x.id===`extension-${e.data.id}`);if(it)it.disabled=true;}extensionItems.forEach(item=>spawnHouseExtension(item,true));
  }
  function remotePlayerEvent(data){if(!data||data.uid===window.OTTHOS_RTDB?.uid)return;remotePresence.set(data.uid,data);let ghost=world.ghosts.get(data.uid);if(scene&&!ghost){ghost=createGhost(data.color||0x5ad8ff,data.name||'Jogador');world.ghosts.set(data.uid,ghost);}if(ghost){updateGhostName(ghost,data.name);ghost.userData.target=data;}refreshOpenSocialHub();}
  window.addEventListener('otthos:mp-status',e=>{multiplayerState={...multiplayerState,...e.detail};state.multiplayer.cloudReady=!!multiplayerState.connected;if(e.detail?.uid)state.multiplayer.cloudUid=e.detail.uid;if(Array.isArray(e.detail?.players)){remotePresence.clear();e.detail.players.filter(p=>p.uid!==window.OTTHOS_RTDB?.uid).forEach(p=>remotePresence.set(p.uid,p));}updateMultiplayerBadge();refreshOpenSocialHub();});
  window.addEventListener('otthos:mp-player',e=>remotePlayerEvent(e.detail));
  window.addEventListener('otthos:mp-leave',e=>{const id=e.detail?.uid;remotePresence.delete(id);if(player.boat.passengerUid===id)player.boat.passengerUid='';if(player.car.passengerUid===id)player.car.passengerUid='';const ghost=world.ghosts.get(id);if(ghost){scene?.remove(ghost);world.ghosts.delete(id);}multiplayerState.count=Math.max(1,remotePresence.size+1);updateMultiplayerBadge();refreshOpenSocialHub();});
  window.addEventListener('otthos:cloud-profile',e=>mergeCloudProgress(e.detail?.progress));
  window.addEventListener('otthos:campfires-cloud',e=>{pendingCloudCampfires=e.detail||{};applyCloudWorldObjects();});
  window.addEventListener('otthos:extensions-cloud',e=>{pendingCloudExtensions=e.detail||{};applyCloudWorldObjects();});
  window.addEventListener('otthos:houses',e=>{cloudHouses.clear();for(const [id,data] of Object.entries(e.detail||{}))cloudHouses.set(id,data);reconcileCloudHouses();});
  window.addEventListener('otthos:chat',e=>{const m=e.detail;if(!m||Number(m.createdAt||0)<=Number(state.social.chatHiddenBefore||0))return;const existing=cloudChat.findIndex(x=>x.id===m.id);if(existing>=0)cloudChat[existing]=m;else cloudChat.push(m);cloudChat.sort((a,b)=>Number(a.createdAt||0)-Number(b.createdAt||0));while(cloudChat.length>60)cloudChat.shift();refreshOpenSocialHub();if(m.senderUid!==window.OTTHOS_RTDB?.uid)toast(`${m.name}: ${m.text}`,'good',2200);});
  window.addEventListener('otthos:chat-removed',e=>{const id=e.detail?.id,index=cloudChat.findIndex(m=>m.id===id);if(index>=0)cloudChat.splice(index,1);refreshOpenSocialHub();});
  window.addEventListener('otthos:gift',e=>{const gift=e.detail;if(!gift)return;if(gift.type==='coins'){state.profile.coins+=Number(gift.amount||0);}else if(gift.type==='crystal'){state.inventory.crystals=(state.inventory.crystals||0)+Number(gift.amount||1);}saveState(true);toast(`🎁 ${gift.senderName||'Jogador'} enviou um presente!`,'good',2600);});
  window.addEventListener('otthos:interaction',e=>{const it=e.detail;if(!it)return;const sender=it.senderName||'Jogador';
    if(it.type==='boatPassengerLeft'){player.boat.passengerUid='';toast(`${sender} saiu do barco.`,'warn',1900);}
    else if(it.type==='boatEnded'){if(player.boating&&player.boat.passengerOf===it.senderUid)exitBoat(true);toast('O motorista encerrou o passeio de barco.','warn',2300);}
    else if(it.type==='vehiclePassengerLeft'){player.car.passengerUid='';toast(`${sender} saiu do carro.`,'warn',1900);}
    else if(it.type==='vehicleEnded'){if(player.vehicle&&player.car.passengerOf===it.senderUid)exitVehicle(true);toast('O motorista encerrou o passeio de carro.','warn',2300);}
    else if(it.type==='challengeAccepted')toast(`🎮 ${sender} aceitou seu desafio! Abra Online para jogar.`,'good',3400);
    else if(it.type==='challengeDeclined')toast(`${sender} recusou o desafio.`,'warn',2400);
    else if(it.type==='socialRequestResult'){
      const status=it.status||'',action=it.actionType||'';if(status==='accepted'){toast(`✅ ${sender} aceitou ${socialActionLabel(action)}.`,'good',2600);applyAcceptedSocialAction(action,{requestId:it.requestId,partnerName:sender,partnerUid:it.senderUid,role:'host'});}else if(status==='declined')toast(`${sender} recusou o convite.`,'warn',2300);else toast(it.extra?.reason||'O convite foi cancelado ou expirou.','warn',2500);
    }else{const social=it.type==='wave'?'wave':'wave';triggerEmote(social);toast(`👋 ${sender} acenou para você.`,'good',2200);}
  });
  window.addEventListener('otthos:social-request',e=>{const r=e.detail;if(!r)return;incomingSocialRequests.set(r.id,r);updateOnlineAttention();refreshOpenSocialHub();if(r.status==='pending'&&Number(r.expiresAt||0)>Date.now()){showIncomingSocialRequest(r);if(!shownSocialToasts.has(r.id)){shownSocialToasts.add(r.id);toast(`🤝 ${r.fromName||'Jogador'} quer ${socialActionLabel(r.actionType)}.`,'good',3000);}}else if(promptSocialRequestId===r.id)closeChallengePrompt();});
  window.addEventListener('otthos:social-request-removed',e=>{incomingSocialRequests.delete(e.detail?.id);if(promptSocialRequestId===e.detail?.id)closeChallengePrompt();updateOnlineAttention();refreshOpenSocialHub();});
  setInterval(()=>window.OTTHOS_RTDB?.expireSocialRequests?.(),10000);
  window.addEventListener('otthos:challenge',e=>{const c=e.detail;if(!c)return;incomingChallenges.set(c.id,c);updateOnlineAttention();refreshOpenSocialHub();if(c.status==='pending'){showIncomingChallengePrompt(c);if(!shownChallengeToasts.has(c.id)){shownChallengeToasts.add(c.id);toast(`⚔️ ${c.fromName||'Jogador'} enviou ${multiplayerGameLabel(c.type)}!`,'good',3400);}}});
  window.addEventListener('otthos:challenge-removed',e=>{incomingChallenges.delete(e.detail?.id);updateOnlineAttention();refreshOpenSocialHub();});
  window.addEventListener('otthos:game-session',e=>{const s=e.detail;if(!s)return;gameSessions.set(s.id,s);updateOnlineAttention();refreshOpenSocialHub();if(s.status==='active'){const mine=s.players?.[window.OTTHOS_RTDB?.uid];if(!mine?.finished&&!activeMultiplayerGameId)showReadySessionPrompt(s);}if(s.status==='active'||s.status==='completed')maybeShowMultiplayerResult(s);});
  window.addEventListener('otthos:game-session-removed',e=>{gameSessions.delete(e.detail?.id);updateOnlineAttention();refreshOpenSocialHub();});
  window.addEventListener('otthos:rtdb-ready',async()=>{if(running||hasValidPlayerName()){const ok=await window.OTTHOS_RTDB?.connect?.({name:state.profile.name||'Jogador'});if(ok){window.OTTHOS_RTDB?.syncCampfires?.(state.campfires);window.OTTHOS_RTDB?.syncHouseExtensions?.(state.houseExtensions);}}});

  function initLocalMultiplayer(){
    if(typeof BroadcastChannel==='function'){localChannel=new BroadcastChannel('otthos-life-world-v629');localChannel.onmessage=e=>{const data=e.data;if(!data||data.id===state.profile.playerId)return;if(data.type==='leave'){const ghost=world.ghosts.get(data.id);if(ghost){scene.remove(ghost);world.ghosts.delete(data.id);}return;}remotePlayerEvent({...data,uid:data.id});};window.addEventListener('beforeunload',()=>localChannel?.postMessage({type:'leave',id:state.profile.playerId}));}
    window.OTTHOS_MULTIPLAYER={version:6,playerId:state.profile.playerId,mode:window.OTTHOS_RTDB?.configured?'firebase-public-world':'local-preview',connect:()=>window.OTTHOS_RTDB?.connect?.({name:state.profile.name||'Jogador'})||true,publish:payload=>{localChannel?.postMessage(payload);window.OTTHOS_RTDB?.publish?.(payload);},adapter:window.OTTHOS_RTDB?.configured?'Firebase Realtime Database':'BroadcastChannel'};updateMultiplayerBadge();if(window.OTTHOS_RTDB?.configured&&hasValidPlayerName())window.OTTHOS_RTDB.connect({name:state.profile.name||'Jogador'});
  }
  function multiplayerNameTexture(name){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='rgba(5,18,34,.88)';ctx.strokeStyle='rgba(255,255,255,.92)';ctx.lineWidth=8;const r=30;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(8,8,c.width-16,c.height-16,r);else ctx.rect(8,8,c.width-16,c.height-16);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 48px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(sanitizePlayerName(name)||'Jogador',c.width/2,c.height/2+2);const tex=new THREE.CanvasTexture(c);tex.minFilter=THREE.LinearFilter;tex.magFilter=THREE.LinearFilter;tex.generateMipmaps=false;return tex;}
  function updateLocalPlayerNameLabel(){if(!playerGroup?.userData?.nameLabel)return;const clean=playerDisplayName();if(playerGroup.userData.displayName===clean)return;const label=playerGroup.userData.nameLabel,old=label.material.map;label.material.map=multiplayerNameTexture(clean);label.material.needsUpdate=true;old?.dispose?.();playerGroup.userData.displayName=clean;}
  function updateGhostName(ghost,name){const clean=sanitizePlayerName(name)||'Jogador';if(ghost.userData.displayName===clean)return;ghost.userData.displayName=clean;if(ghost.userData.nameLabel){const old=ghost.userData.nameLabel.material.map;ghost.userData.nameLabel.material.map=multiplayerNameTexture(clean);ghost.userData.nameLabel.material.needsUpdate=true;old?.dispose?.();}}
  function createGhost(color,name='Jogador'){
    const g=new THREE.Group(),avatar=new THREE.Group();g.add(avatar);box(.82,1.18,.58,color,0,1.25,0,avatar);box(.72,.72,.72,0x111217,0,2.24,0,avatar);const leftArm=box(.22,1,.25,0xff9a24,-.58,1.28,0,avatar),rightArm=box(.22,1,.25,0xff9a24,.58,1.28,0,avatar),leftLeg=box(.25,1,.28,0x20242b,-.22,.34,0,avatar),rightLeg=box(.25,1,.28,0x20242b,.22,.34,0,avatar);box(.12,.1,.04,0xff3344,-.14,2.27,.38,avatar);box(.12,.1,.04,0xff3344,.14,2.27,.38,avatar);
    const car=new THREE.Group();car.visible=false;g.add(car);box(1.9,.42,2.8,0x26384e,0,.35,0,car);box(1.72,.6,1.45,color,0,.7,.25,car);box(1.46,.45,.9,0x173149,0,.92,-.48,car);for(const p of [[-.9,.3,-.85],[.9,.3,-.85],[-.9,.3,.85],[.9,.3,.85]]){const wheel=cylinder(.34,.24,0x10151d,p[0],p[1],p[2],car,10);wheel.rotation.z=Math.PI/2;}
    const boat=new THREE.Group();boat.visible=false;boat.position.y=-.68;g.add(boat);box(2.4,.42,4.4,0x7b3f20,0,.38,0,boat);box(2.72,.24,3.82,0xe3ad55,0,.67,0,boat);box(1.85,.23,3.15,0x2d6f8d,0,.83,0,boat);box(1.75,.25,.55,0x374151,0,1.02,-.65,boat);box(1.75,.25,.55,0x374151,0,1.02,.72,boat);
    const label=new THREE.Sprite(new THREE.SpriteMaterial({map:multiplayerNameTexture(name),transparent:true,depthWrite:false,depthTest:false}));label.position.set(0,3.05,0);label.scale.set(2.75,.69,1);label.renderOrder=999;g.add(label);g.userData.nameLabel=label;g.userData.displayName=sanitizePlayerName(name)||'Jogador';g.userData.avatar=avatar;g.userData.carVisual=car;g.userData.boatVisual=boat;g.userData.limbs={leftArm,rightArm,leftLeg,rightLeg};g.userData.phase=Math.random()*6.28;scene.add(g);return g;
  }
  function updateMultiplayer(dt){
    const now=performance.now(),payload={type:'position',id:state.profile.playerId,name:state.profile.name||'Jogador',x:+player.x.toFixed(2),y:+player.y.toFixed(2),z:+player.z.toFixed(2),r:+player.facing.toFixed(3),vehicle:!!player.vehicle,vehicleId:player.car.id||'',vehicleRole:player.vehicle?(player.car.passengerOf?'passenger':'driver'):'',vehiclePassengerOf:player.car.passengerOf||'',vehiclePassengerUid:player.car.passengerUid||'',vehiclePassengerBotId:player.car.passengerBotId||'',boating:!!player.boating,boatId:state.boats.activeBoatId||'',boatRole:player.boating?(player.boat.passengerOf?'passenger':'driver'):'',passengerOf:player.boat.passengerOf||'',boatPassengerUid:player.boat.passengerUid||'',boatPassengerBotId:player.boat.passengerBotId||'',transitMode:player.transit.mode||'',scaleMode:player.scaleMode,crouched:!!player.crouched,emoteType:player.emoteType||'',emoteSeq:Number(player.emoteSeq||0),color:0x5ad8ff};
    const changed=!lastPublishSnapshot||Math.hypot(payload.x-lastPublishSnapshot.x,payload.z-lastPublishSnapshot.z)>.06||Math.abs(payload.r-lastPublishSnapshot.r)>.025||payload.vehicle!==lastPublishSnapshot.vehicle||payload.vehicleRole!==lastPublishSnapshot.vehicleRole||payload.vehiclePassengerUid!==lastPublishSnapshot.vehiclePassengerUid||payload.boating!==lastPublishSnapshot.boating||payload.boatRole!==lastPublishSnapshot.boatRole||payload.boatPassengerUid!==lastPublishSnapshot.boatPassengerUid||payload.transitMode!==lastPublishSnapshot.transitMode||payload.scaleMode!==lastPublishSnapshot.scaleMode||payload.crouched!==lastPublishSnapshot.crouched||payload.emoteSeq!==lastPublishSnapshot.emoteSeq;
    if((changed&&now-lastPublish>240)||now-lastPublishHeartbeat>2200){lastPublish=now;lastPublishHeartbeat=now;lastPublishSnapshot=payload;localChannel?.postMessage(payload);window.OTTHOS_RTDB?.publish?.(payload);}
    for(const ghost of world.ghosts.values()){
      const t=ghost.userData.target;if(!t)continue;const beforeX=ghost.position.x,beforeZ=ghost.position.z;ghost.position.x=lerp(ghost.position.x,Number(t.x||0),Math.min(1,dt*8));ghost.position.y=lerp(ghost.position.y,Number(t.y||0),Math.min(1,dt*8));ghost.position.z=lerp(ghost.position.z,Number(t.z||0),Math.min(1,dt*8));ghost.rotation.y=lerpAngle(ghost.rotation.y,Number(t.r||0),Math.min(1,dt*8));
      if(Number(t.emoteSeq||0)!==Number(ghost.userData.lastEmoteSeq||0)){ghost.userData.lastEmoteSeq=Number(t.emoteSeq||0);ghost.userData.emoteType=t.emoteType||'';ghost.userData.emoteUntil=performance.now()+2600;}
      const carDriver=!!t.vehicle&&t.vehicleRole!=='passenger',boatDriver=!!t.boating&&t.boatRole!=='passenger',avatar=ghost.userData.avatar;avatar.visible=!carDriver&&!boatDriver&&t.transitMode!=='metro';ghost.userData.carVisual.visible=carDriver;ghost.userData.boatVisual.visible=boatDriver;avatar.scale.setScalar(t.scaleMode==='mini'?.58:t.scaleMode==='giant'?1.42:1);ghost.userData.nameLabel.position.y=carDriver?3.15:boatDriver?3.45:3.05;
      const moving=Math.hypot(ghost.position.x-beforeX,ghost.position.z-beforeZ)>.01,walk=moving?Math.sin(animTime*9+ghost.userData.phase)*.45:0,emote=performance.now()<Number(ghost.userData.emoteUntil||0)?ghost.userData.emoteType:'';if(ghost.userData.limbs){const l=ghost.userData.limbs;l.leftArm.rotation.x=emote==='dance'?-1.35:emote==='play'?-1.9:emote==='hug'?-1.45:walk;l.rightArm.rotation.x=emote==='wave'?-2.2:emote==='highfive'?-2.5:emote==='dance'?-1.35:emote==='play'?-1.9:emote==='hug'?-1.45:-walk;l.leftArm.rotation.z=emote==='dance'?1.0:emote==='play'?.55:emote==='hug'?-.48:0;l.rightArm.rotation.z=emote==='dance'?-1.0:emote==='play'?-.55:emote==='hug'?.48:0;l.leftLeg.rotation.x=-walk*.75;l.rightLeg.rotation.x=walk*.75;}
    }
  }

  function gameLoop(){
    if(!running)return;raf=requestAnimationFrame(gameLoop);const dt=Math.min(.033,clock.getDelta());samplePerformance(dt);
    if(!paused){
      pollGamepad();updateTransitWorld(dt);updatePoliceSystem(dt);updatePlayer(dt);updateFishingVisual(dt);updateVehicleFX(dt);updateFX(dt);updateFireballs(dt);updateRace(dt);updateNeeds(dt);updateCamera(dt);updateNavigation(dt);updateVisualLOD(dt);
      perf.aiAcc+=dt;if(perf.aiAcc>=1/30){const step=perf.aiAcc;perf.aiAcc=0;updateNPCs(step);updateNpcSociety(step);updateEnemies(step);updateMultiplayer(step);updateLifeActivities(step);updateAdventure(step);}
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
    await dbReady;
    if((!hasValidPlayerName()||!accountLinked())&&!(state.flags.accountPromptedV629||state.flags.accountPromptedV628)){openAccountCenter(true,()=>{state.flags.accountPromptedV629=true;saveState(true);startGame(resetPosition);});return;}
    if(!hasValidPlayerName()){openPlayerNameModal(true,()=>startGame(resetPosition));return;}
    closeModal();showScreen('game');
    state.ui.quickOpen=false;state.ui.skillsOpen=false;state.ui.needsOpen=false;state.ui.missionOpen=false;syncMobilePanels();els.game.classList.remove('needs-expanded');els.missionCard.classList.remove('expanded');if(!scene){if(!initThree()){showScreen('lobby');return;}setupControls();}else{applyAvatarCustomization();}
    if(els.toolsBtn){els.toolsBtn.firstChild.textContent=equippedTool().icon;$('span',els.toolsBtn).textContent=equippedTool().name;}
    if(resetPosition){player.x=0;player.z=8;player.y=0;}else restorePosition();player.scaleMode=state.abilities?.scaleMode||'normal';player.crouched=!!state.abilities?.crouched;updateAbilityUI();running=true;paused=false;clock.start();evaluateMissions();updateHUD();updateContext(true);updateNavigation(0,true);resize(true);cancelAnimationFrame(raf);gameLoop();toast('Bem-vindo à Vila do Sol!','good',2200);
  }
  function stopGame(){
    world.policeAlert=null;updateSafetyPanel('');if(player.boating){player.x=-24.7;player.z=52;exitBoat(true);}if(player.vehicle)exitVehicle(true);if(player.transit.mode==='bus'){const bus=world.buses.find(b=>b.id===player.transit.busId);if(bus)exitBusAtStop(bus,{stopId:bus.lastStopId,stopName:bus.lastStopName});}if(player.transit.mode==='metro'){player.transit.mode='';if(metroOverlay)metroOverlay.hidden=true;if(playerModel)playerModel.visible=true;if(avatarLayer)avatarLayer.visible=true;if(contactShadow)contactShadow.visible=true;}running=false;paused=false;pauseMenuOpen=false;cancelAnimationFrame(raf);stopEngineSound();savePlayerPosition(true);showScreen('lobby');updateLobbyStats();
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
    version:'V629_DEFINITIVE_COMMERCIAL_KIDS_WORLD',
    performance:()=>({fps:+perf.fps.toFixed(1),tier:qualityTier(),requested:requestedQuality(),dpr:renderer?.getPixelRatio?.()||0,drawCalls:renderer?.info?.render?.calls||0,triangles:renderer?.info?.render?.triangles||0}),
    getState:()=>JSON.parse(JSON.stringify(state)),
    getGame:()=>({running,paused,currentHouse:currentHouse?.id||null,cameraMode,player:{...player},objects:{houses:world.houses.length,npcs:world.npcs.length,enemies:world.enemies.length,interactables:world.interactables.length,builds:world.builds.length,vehicles:world.vehicles.length,buses:world.buses.length,metroStations:world.metroStations.length,policeCars:world.policeCars.length,resources:world.resources.length,school:!!world.school,policeStation:!!world.policeStation,mine:!!world.mine,well:!!world.well}}),
    getVisual:()=>{const parts=playerModel?.userData?.parts||{};const modelY=playerModel?.position?.y||0;const minFootY=playerModel?.userData?.minFootY??0;const scaleY=playerGroup?.scale?.y||1;const rootY=playerGroup?.position?.y||0;return {procedural:!!playerModel?.userData?.proceduralOtthos,rendered:playerModel?.visible!==false,ownNameLabelVisible:playerGroup?.userData?.nameLabel?.visible!==false,rootY,modelY,minFootY,scaleY,visualBottom:rootY+(modelY+minFootY)*scaleY,limbs:{leftArm:parts.leftArm?.rotation?.x||0,rightArm:parts.rightArm?.rotation?.x||0,leftLeg:parts.leftLeg?.rotation?.x||0,rightLeg:parts.rightLeg?.rotation?.x||0}};},
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
    camera:()=>({yaw:cameraYaw,pitch:cameraPitch,zoom:cameraZoom,mode:cameraMode,position:camera?{x:camera.position.x,y:camera.position.y,z:camera.position.z}:null,fov:camera?.fov||0}),
    setCameraZoom:value=>{cameraZoom=clamp(Number(value)||0,-4.5,9);state.settings.cameraZoom=cameraZoom;return cameraZoom;},
    sprint:active=>{input.touchSprint=!!active;updateRunUI();return sprintRequested();},
    joystickVector:(dx,dy)=>{input.joyX=clamp(dx,-1,1);input.joyZ=clamp(dy,-1,1);return resolveMovementInput();},
    stepPlayer:(frames=1,dt=1/60)=>{const n=clamp(Math.round(Number(frames)||1),1,600),step=clamp(Number(dt)||1/60,.001,.1);for(let i=0;i<n;i++)updatePlayer(step);return{x:player.x,y:player.y,z:player.z,facing:player.facing};},
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
    lifeExpansion:()=>({boating:player.boating,boat:{...player.boat,dockDistance:+distanceToBoatDock().toFixed(2),canExit:validBoatExit()},fishing:JSON.parse(JSON.stringify(state.fishing)),fishingVisual:fishingVisual?{active:fishingVisual.active,phase:fishingVisual.phase,source:fishingVisual.source}:null,campfires:JSON.parse(JSON.stringify(state.campfires)),hunting:JSON.parse(JSON.stringify(state.hunting)),houseExtensions:JSON.parse(JSON.stringify(state.houseExtensions)),animals:world.animals.map(a=>({id:a.id,type:a.type,available:a.available}))}),
    transport:()=>({state:JSON.parse(JSON.stringify(state.transport)),mode:player.transit.mode,stations:METRO_STATIONS.map(s=>({...s,group:undefined})),stops:world.busStops.map(s=>({id:s.id,name:s.name,routes:[...s.routes],x:s.x,z:s.z})),buses:world.buses.map(b=>({id:b.id,route:b.route.id,line:b.route.number,x:b.group.position.x,z:b.group.position.z,visible:b.group.visible!==false,stopped:busAtStop(b),lastStopId:b.lastStopId,interiorSeats:b.interiorSeats||0}))}),
    rideMetro:(destinationId='village',stationId='central')=>{const destination=MAP_LOCATIONS.find(x=>x.id===destinationId),station=METRO_STATIONS.find(x=>x.id===stationId)||METRO_STATIONS[0];if(!destination)return false;rideMetroTo(station,destination);return true;},
    boardBus:id=>{const bus=world.buses.find(b=>b.id===id)||world.buses[0];if(!bus)return false;player.x=bus.group.position.x;player.z=bus.group.position.z;bus.stopUntil=performance.now()+2000;bus.lastStopId=bus.lastStopId||'test-stop';bus.lastStopName=bus.lastStopName||'Parada de teste';return enterBus(bus);},
    exitBus:()=>{const bus=world.buses.find(b=>b.id===player.transit.busId);return bus?exitBusAtStop(bus,{stopId:'test-stop',stopName:'Parada de teste'}):false;},
    stepTransit:(frames=60,dt=1/60)=>{const n=clamp(Math.round(Number(frames)||60),1,1200),step=clamp(Number(dt)||1/60,.001,.1);for(let i=0;i<n;i++)updateTransitWorld(step);return world.buses.map(b=>({id:b.id,x:b.group.position.x,z:b.group.position.z,stopped:busAtStop(b)}));},
    fleet:()=>world.vehicles.map(v=>({id:v.id,label:v.label,x:v.group.position.x,z:v.group.position.z,visible:v.group.visible,occupied:v.occupied})),
    npcMobility:()=>world.npcs.map(n=>({id:n.id,name:n.name,type:n.mobility?.type||'walk',passengerMode:n.passengerMode||'',pendingRide:!!n.pendingRide,x:n.group.position.x,z:n.group.position.z})),
    setNpcRideCompanion:(id='nino')=>{const npc=world.npcs.find(n=>n.id===id);if(!npc)return false;npc.pendingRide=true;npc.following=true;npc.group.position.set(player.x+1,0,player.z);return true;},
    tools:()=>({equipped:state.tools.equipped,owned:[...state.tools.owned],harvested:{...state.tools.harvested},resources:world.resources.map(resource=>({id:resource.id,type:resource.type,hits:resource.hits,hitsNeeded:resource.hitsNeeded,collected:resource.collected}))}),
    equipTool,
    collectResource,
    drawWaterFromWell,
    police:()=>({alert:world.policeAlert?{...world.policeAlert}:null,cars:world.policeCars.map(car=>({id:car.id,x:car.group.position.x,z:car.group.position.z,npcTarget:car.npcTarget||''})),safety:{...state.safety},panelHidden:els.safetyPanel?.hidden!==false}),
    startPoliceAlert:()=>startPoliceAlert(world.policeCars[0]),
    finishSafetyStop,
    openSafetyLesson,
    openSettings,
    openAccountCenter,
    triggerEmote,
    adventures:()=>({completed:[...state.adventures.completed],active:world.activeChallenge?{type:world.activeChallenge.type,progress:world.activeChallenge.progress.size,target:world.activeChallenge.target}:null,definitions:JSON.parse(JSON.stringify(ADVENTURE_DEFS))}),
    startAdventure,
    stepAdventure:()=>{updateAdventure();return world.activeChallenge?{type:world.activeChallenge.type,progress:world.activeChallenge.progress.size}:null;},
    startFishing:(source='shore')=>startFishing(source),
    enterBoat:()=>enterBoat(),
    boatDock:()=>({distance:distanceToBoatDock(),canExit:validBoatExit(),dock:{...BOAT_DOCK}}),
    forceBoatState:(x=-38,z=52,heading=0)=>{player.boating=true;player.boat.passengerOf='';player.boat.heading=Number(heading)||0;player.boat.speed=0;player.boat.steerVisual=0;player.x=Number(x);player.z=Number(z);player.y=.78;state.boats.activeBoatId='lake-boat';if(world.boat){world.boat.group.position.set(player.x,.1,player.z);world.boat.heading=player.boat.heading;world.boat.group.rotation.y=player.boat.heading;}updateBoatPanel();return{canExit:validBoatExit(),distance:distanceToBoatDock()};},
    exitBoat:()=>exitBoat(),
    stepBoat:(steer=0,throttle=0,frames=60)=>{const n=clamp(Math.round(Number(frames)||60),1,600),dt=1/60,start={x:player.x,z:player.z,heading:player.boat.heading};for(let i=0;i<n;i++){updateBoatPhysics(dt,clamp(Number(steer)||0,-1,1),clamp(Number(throttle)||0,-1,1));const px=player.x,pz=player.z;player.x+=player.vx*dt;player.z+=player.vz*dt;constrainBoat(px,pz);}return{x:player.x,z:player.z,heading:player.boat.heading,speed:player.boat.speed,deltaHeading:player.boat.heading-start.heading,distance:Math.hypot(player.x-start.x,player.z-start.z)};},
    buildCampfire,
    startHunting:()=>startHunting(),
    openHouseExtensionMenu,
    multiplayer:()=>({local:window.OTTHOS_MULTIPLAYER||null,cloud:window.OTTHOS_RTDB?.status?.()||multiplayerState,challenges:pendingChallenges(),socialRequests:socialRequestPending(),sessions:[...gameSessions.values()],ghosts:[...world.ghosts.entries()].map(([id,g])=>({id,vehicle:!!g.userData.carVisual?.visible,boat:!!g.userData.boatVisual?.visible,target:{...(g.userData.target||{})}}))}),
    simulateRemotePresence:(data={})=>{const remote={uid:data.uid||'remote-test',name:data.name||'Jogador Teste',x:Number(data.x??player.x+2),y:Number(data.y??player.y),z:Number(data.z??player.z),r:Number(data.r??player.facing),vehicle:!!data.vehicle,vehicleId:data.vehicleId||'remote-car',vehicleRole:data.vehicleRole||'',boating:!!data.boating,boatId:data.boatId||'',boatRole:data.boatRole||'',scaleMode:data.scaleMode||'normal',color:data.color||0x5ad8ff};remotePlayerEvent(remote);updateMultiplayer(.1);return remote.uid;},
    enterVehiclePassenger:(uid='remote-test')=>enterVehicleAsPassenger(uid),
    enterBoatPassenger:(uid='remote-test')=>enterBoatAsPassenger(uid)
  };

  updateLobbyStats();evaluateMissions();updateInstallUI();
})();
