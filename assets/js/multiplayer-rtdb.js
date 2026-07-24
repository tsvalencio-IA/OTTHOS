const SDK='10.14.1',CONFIG_KEY='otthos_firebase_config_v1',ROOT='otthosWorld',WORLD='publicWorld';
let api=null,app=null,auth=null,db=null,user=null,connected=false,connecting=null,refs={},unsubs=[],lastPresence=null,presenceWrite=0,progressTimer=0,pendingProgress=null,housesCache={},presenceCache={},challengeCache={},sessionCache={},requestCache={},requestCooldown=new Map(),campfireCache={},extensionCache={},boatCache={},activeBoatLock='',boatTouchAt=0;
const dispatch=(name,detail)=>window.dispatchEvent(new CustomEvent(name,{detail}));
function storedConfig(){try{return JSON.parse(localStorage.getItem(CONFIG_KEY)||'null')}catch{return null}}
function getConfig(){const base=window.OTTHOS_FIREBASE_CONFIG||{},saved=storedConfig();return saved?.apiKey?{...base,...saved}:{...base}}
function validConfig(c){return!!(c?.enabled&&c.apiKey&&c.authDomain&&c.databaseURL&&c.projectId&&c.appId)}
function status(extra={}){return{configured:validConfig(getConfig()),connected,uid:user?.uid||'',room:'mundo-publico',count:Object.keys(presenceCache).length,players:Object.entries(presenceCache).map(([uid,data])=>({uid,...data})),...extra}}
function configure(c){const clean={...c,enabled:true,room:'mundo-publico'};localStorage.setItem(CONFIG_KEY,JSON.stringify(clean));window.OTTHOS_FIREBASE_CONFIG=clean;window.OTTHOS_RTDB.configured=true;return clean}
function disable(){localStorage.removeItem(CONFIG_KEY);disconnect()}
async function loadSdk(){if(api)return api;const[a,u,d]=await Promise.all([import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-app.js`),import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-auth.js`),import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-database.js`)]);api={...a,...u,...d};return api}
async function ensureServices(){
  const cfg=getConfig();if(!validConfig(cfg))throw new Error('Firebase não configurado');
  const f=await loadSdk();app=f.getApps().find(x=>x.options?.projectId===cfg.projectId)||f.initializeApp(cfg,'otthos-world');auth=f.getAuth(app);if(typeof auth.authStateReady==='function')await auth.authStateReady();db=f.getDatabase(app);return f;
}
function normalizeUsername(value=''){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9._-]/g,'').replace(/\.+/g,'.').replace(/^[._-]+|[._-]+$/g,'').slice(0,20)}
function accountEmail(username=''){const clean=normalizeUsername(username);return clean?`${clean}@players.otthos.game`:''}
function accountStatus(){const current=user||auth?.currentUser;const email=String(current?.email||'');const suffix='@players.otthos.game';const username=email.endsWith(suffix)?email.slice(0,-suffix.length):'';return{uid:current?.uid||'',anonymous:current?!!current.isAnonymous:true,username,displayName:current?.displayName||username||'',email:username?email:''}}
function friendlyAuthError(error){const code=String(error?.code||'');if(code.includes('email-already-in-use')||code.includes('credential-already-in-use'))return'Esse nome de jogador já possui uma conta.';if(code.includes('invalid-credential')||code.includes('wrong-password')||code.includes('user-not-found')||code.includes('invalid-login-credentials'))return'Nome ou senha incorretos.';if(code.includes('weak-password'))return'A senha precisa ter pelo menos 6 caracteres.';if(code.includes('too-many-requests'))return'Muitas tentativas. Aguarde um pouco e tente novamente.';if(code.includes('network-request-failed'))return'Sem conexão com a internet.';if(code.includes('requires-recent-login'))return'Confirme sua senha novamente.';return error?.message||'Não foi possível acessar a conta.'}
function dispatchAccount(){const detail=accountStatus();window.OTTHOS_RTDB.uid=detail.uid;dispatch('otthos:account',detail);return detail}
async function createPlayerAccount(username,password,displayName=''){
  const clean=normalizeUsername(username),secret=String(password||'');if(clean.length<3)return{ok:false,error:'Use um nome de conta com 3 a 20 letras ou números.'};if(secret.length<6)return{ok:false,error:'A senha precisa ter pelo menos 6 caracteres.'};
  try{const f=await ensureServices(),email=accountEmail(clean);let credentialUser;
    if(auth.currentUser?.isAnonymous){credentialUser=(await f.linkWithCredential(auth.currentUser,f.EmailAuthProvider.credential(email,secret))).user;}
    else if(auth.currentUser?.email===email){credentialUser=auth.currentUser;}
    else{await disconnect();credentialUser=(await f.createUserWithEmailAndPassword(auth,email,secret)).user;}
    user=credentialUser;await f.updateProfile(user,{displayName:String(displayName||clean).slice(0,24)}).catch(()=>{});await f.update(f.ref(db,`${ROOT}/users/${user.uid}/profile`),{name:String(displayName||clean).slice(0,24),username:clean,accountLinked:true,updatedAt:f.serverTimestamp()});dispatchAccount();return{ok:true,...accountStatus()};
  }catch(error){return{ok:false,error:friendlyAuthError(error)}}
}
async function signInPlayerAccount(username,password,displayName=''){
  const clean=normalizeUsername(username),secret=String(password||'');if(clean.length<3||secret.length<6)return{ok:false,error:'Confira o nome da conta e a senha.'};
  try{const f=await ensureServices();await disconnect();user=(await f.signInWithEmailAndPassword(auth,accountEmail(clean),secret)).user;await f.updateProfile(user,{displayName:String(displayName||user.displayName||clean).slice(0,24)}).catch(()=>{});dispatchAccount();await connect({name:String(displayName||user.displayName||clean).slice(0,24)});return{ok:true,...accountStatus()};}
  catch(error){return{ok:false,error:friendlyAuthError(error)}}
}
async function reauthenticateAccount(password){try{const f=await ensureServices(),current=auth.currentUser;if(!current||current.isAnonymous||!current.email)return{ok:false,error:'Vincule uma conta antes de abrir a área dos responsáveis.'};await f.reauthenticateWithCredential(current,f.EmailAuthProvider.credential(current.email,String(password||'')));return{ok:true}}catch(error){return{ok:false,error:friendlyAuthError(error)}}}
async function signOutPlayerAccount(){try{const f=await ensureServices();await disconnect();await f.signOut(auth);user=(await f.signInAnonymously(auth)).user;dispatchAccount();await connect({name:lastPresence?.name||'Jogador'});return{ok:true,...accountStatus()}}catch(error){return{ok:false,error:friendlyAuthError(error)}}}
function ownName(){return String(lastPresence?.name||'Jogador').slice(0,24)}
function listenerError(scope){return error=>{console.warn(`Firebase ${scope}:`,error);dispatch('otthos:mp-status',status({mode:'offline',error:error?.message||String(error)}))}}
async function connect(options={}){if(connected&&user)return true;if(connecting)return connecting;connecting=(async()=>{const cfg=getConfig();if(!validConfig(cfg)){dispatch('otthos:mp-status',status({mode:'offline',error:'Firebase não configurado'}));return false}try{const f=await ensureServices();user=auth.currentUser||(await f.signInAnonymously(auth)).user;window.OTTHOS_RTDB.uid=user.uid;dispatchAccount();refs.presence=f.ref(db,`${ROOT}/${WORLD}/presence/${user.uid}`);refs.presences=f.ref(db,`${ROOT}/${WORLD}/presence`);refs.profile=f.ref(db,`${ROOT}/users/${user.uid}/profile`);refs.progress=f.ref(db,`${ROOT}/users/${user.uid}/progress`);refs.houses=f.ref(db,`${ROOT}/${WORLD}/houses`);refs.campfires=f.ref(db,`${ROOT}/${WORLD}/campfires`);refs.extensions=f.ref(db,`${ROOT}/${WORLD}/houseExtensions`);refs.boats=f.ref(db,`${ROOT}/${WORLD}/boats`);refs.chat=f.ref(db,`${ROOT}/${WORLD}/chat`);refs.gifts=f.ref(db,`${ROOT}/users/${user.uid}/inbox`);refs.interactions=f.ref(db,`${ROOT}/users/${user.uid}/interactions`);refs.challenges=f.ref(db,`${ROOT}/users/${user.uid}/challenges`);refs.socialRequests=f.ref(db,`${ROOT}/users/${user.uid}/socialRequests`);refs.sessions=f.ref(db,`${ROOT}/${WORLD}/gameSessions`);lastPresence={name:String(options.name||'Jogador').slice(0,24),room:'mundo-publico',x:0,y:0,z:0,r:0,color:0x5ad8ff};
  unsubs.push(f.onValue(f.ref(db,'.info/connected'),async s=>{connected=s.val()===true;if(connected){await f.onDisconnect(refs.presence).remove().catch(()=>{});await f.update(refs.profile,{name:ownName(),updatedAt:f.serverTimestamp()});await publish(lastPresence,true)}dispatch('otthos:mp-status',status({mode:connected?'firebase-public':'offline',error:connected?'':'Sem conexão'}))},listenerError('conexão')));
  const emit=s=>{if(s.key===user.uid)return;const value=s.val()||{};presenceCache[s.key]=value;dispatch('otthos:mp-player',{uid:s.key,...value})};
  unsubs.push(f.onChildAdded(refs.presences,emit,listenerError('presença')));unsubs.push(f.onChildChanged(refs.presences,emit,listenerError('presença')));unsubs.push(f.onChildRemoved(refs.presences,s=>{delete presenceCache[s.key];dispatch('otthos:mp-leave',{uid:s.key})},listenerError('presença')));
  unsubs.push(f.onValue(refs.presences,s=>{presenceCache=s.val()||{};dispatch('otthos:mp-status',status({mode:'firebase-public',count:s.size||0}))},listenerError('lista de presença')));
  unsubs.push(f.onValue(refs.houses,s=>{housesCache=s.val()||{};dispatch('otthos:houses',housesCache)},listenerError('casas')));
  unsubs.push(f.onValue(refs.campfires,s=>{campfireCache=s.val()||{};dispatch('otthos:campfires-cloud',campfireCache)},listenerError('fogueiras')));
  unsubs.push(f.onValue(refs.extensions,s=>{extensionCache=s.val()||{};dispatch('otthos:extensions-cloud',extensionCache)},listenerError('ampliações')));
  unsubs.push(f.onValue(refs.boats,s=>{boatCache=s.val()||{};dispatch('otthos:boats-cloud',boatCache)},listenerError('barcos')));
  const recentChat=f.query(refs.chat,f.limitToLast(40));unsubs.push(f.onChildAdded(recentChat,s=>dispatch('otthos:chat',{id:s.key,...(s.val()||{})}),listenerError('chat')));unsubs.push(f.onChildRemoved(recentChat,s=>dispatch('otthos:chat-removed',{id:s.key}),listenerError('chat')));
  unsubs.push(f.onChildAdded(refs.gifts,async s=>{const value=s.val();dispatch('otthos:gift',{id:s.key,...value});await f.remove(s.ref).catch(()=>{})},listenerError('presentes')));
  unsubs.push(f.onChildAdded(refs.interactions,async s=>{dispatch('otthos:interaction',{id:s.key,...(s.val()||{})});await f.remove(s.ref).catch(()=>{})},listenerError('interações')));
  const emitChallenge=s=>{const value=s.val()||{};challengeCache[s.key]=value;dispatch('otthos:challenge',{id:s.key,...value})};
  unsubs.push(f.onChildAdded(refs.challenges,emitChallenge,listenerError('convites')));unsubs.push(f.onChildChanged(refs.challenges,emitChallenge,listenerError('convites')));unsubs.push(f.onChildRemoved(refs.challenges,s=>{delete challengeCache[s.key];dispatch('otthos:challenge-removed',{id:s.key})},listenerError('convites')));
  const emitSocialRequest=s=>{const value=s.val()||{};requestCache[s.key]=value;dispatch('otthos:social-request',{id:s.key,...value})};
  unsubs.push(f.onChildAdded(refs.socialRequests,emitSocialRequest,listenerError('solicitações sociais')));unsubs.push(f.onChildChanged(refs.socialRequests,emitSocialRequest,listenerError('solicitações sociais')));unsubs.push(f.onChildRemoved(refs.socialRequests,s=>{delete requestCache[s.key];dispatch('otthos:social-request-removed',{id:s.key})},listenerError('solicitações sociais')));
  const emitSession=s=>{const value=s.val()||{};if(value.fromUid!==user.uid&&value.toUid!==user.uid)return;sessionCache[s.key]=value;dispatch('otthos:game-session',{id:s.key,...value})};
  const recentSessions=f.query(refs.sessions,f.limitToLast(60));unsubs.push(f.onChildAdded(recentSessions,emitSession,listenerError('partidas')));unsubs.push(f.onChildChanged(recentSessions,emitSession,listenerError('partidas')));unsubs.push(f.onChildRemoved(recentSessions,s=>{delete sessionCache[s.key];dispatch('otthos:game-session-removed',{id:s.key})},listenerError('partidas')));
  const remoteProgress=(await f.get(refs.progress)).val();dispatch('otthos:cloud-profile',{progress:remoteProgress});dispatch('otthos:mp-status',status({mode:'firebase-public'}));return true
}catch(error){connected=false;dispatch('otthos:mp-status',status({mode:'offline',error:error?.message||String(error)}));console.warn('Firebase multiplayer:',error);return false}finally{connecting=null}})();return connecting}
async function publish(payload,force=false){lastPresence={...lastPresence,...payload,name:String(payload.name||lastPresence?.name||'Jogador').slice(0,24),emoteType:String(payload.emoteType||lastPresence?.emoteType||'').slice(0,16),emoteSeq:Number(payload.emoteSeq??lastPresence?.emoteSeq??0)};if(!connected||!refs.presence||!api)return false;const nowPerf=performance.now();if(!force&&nowPerf-presenceWrite<200)return false;presenceWrite=nowPerf;try{await api.update(refs.presence,{...lastPresence,updatedAt:api.serverTimestamp()});if(activeBoatLock&&lastPresence.boating&&lastPresence.boatRole==='driver'&&(force||nowPerf-boatTouchAt>5000)){boatTouchAt=nowPerf;await api.update(api.ref(db,`${ROOT}/${WORLD}/boats/${activeBoatLock}`),{driverName:ownName(),room:'mundo-publico',updatedAt:api.serverTimestamp(),updatedAtClient:Date.now()}).catch(()=>{});}return true}catch(error){listenerError('publicação')(error);return false}}
function syncProgress(progress,force=false){pendingProgress=progress;clearTimeout(progressTimer);const run=async()=>{if(!connected||!refs.progress||!pendingProgress||!api)return false;const data=pendingProgress;pendingProgress=null;try{await api.set(refs.progress,{...data,lastSaved:Number(data.lastSaved||Date.now())});await api.update(refs.profile,{name:String(data.profile?.name||ownName()).slice(0,24),level:Number(data.profile?.level||1),reputation:Number(data.profile?.reputation||0),updatedAt:api.serverTimestamp()});return true}catch(e){console.warn('Cloud save:',e);return false}};if(force)return run();progressTimer=setTimeout(run,1800);return true}
function validAccountId(accountId){return/^[a-f0-9]{64}$/.test(String(accountId||''))}
function accountReadyFor(accountId){const current=accountStatus();return!!(current.uid&&!current.anonymous&&validAccountId(accountId))}
async function loadGameAccount(accountId){
  if(!connected||!api||!db)return{ok:false,error:'Conecte-se para recuperar a conta'};if(!accountReadyFor(accountId))return{ok:false,error:'Entre na conta protegida antes de recuperar o progresso'};
  try{const current=accountStatus(),snap=await api.get(api.ref(db,`${ROOT}/gameAccounts/${current.uid}`));if(!snap.exists())return{ok:true,exists:false,record:null};const record=snap.val()||{};if(record.accountId!==accountId)return{ok:false,error:'Esta conta não corresponde ao progresso protegido.'};return{ok:true,exists:true,record};}catch(error){listenerError('conta do jogo')(error);return{ok:false,error:error?.message||'Não foi possível abrir a conta'}}
}
async function saveGameAccount(accountId,payload){
  if(!connected||!api||!db)return{ok:false,error:'Conecte-se para salvar a conta'};if(!accountReadyFor(accountId))return{ok:false,error:'Entre na conta protegida antes de salvar'};
  const iv=String(payload?.iv||''),ciphertext=String(payload?.ciphertext||'');if(!iv||!ciphertext||ciphertext.length>450000)return{ok:false,error:'Progresso inválido'};
  try{const current=accountStatus();await api.set(api.ref(db,`${ROOT}/gameAccounts/${current.uid}`),{schema:2,ownerUid:current.uid,accountId,username:current.username,iv:iv.slice(0,64),ciphertext,updatedAt:api.serverTimestamp(),updatedAtClient:Number(payload?.updatedAtClient||Date.now())});return{ok:true}}catch(error){listenerError('salvamento da conta')(error);return{ok:false,error:error?.message||'Não foi possível salvar a conta'}}
}
async function sendChat(text){text=String(text||'').trim().slice(0,180);if(!connected||!text)return false;const r=api.push(refs.chat);await api.set(r,{senderUid:user.uid,name:ownName(),text,createdAt:api.serverTimestamp()});return true}
async function deleteOwnChatMessages(){if(!connected||!refs.chat||!user)return{ok:false,error:'Você está offline'};try{const q=api.query(refs.chat,api.orderByChild('senderUid'),api.equalTo(user.uid)),snap=await api.get(q),updates={};snap.forEach(child=>{updates[child.key]=null});const count=Object.keys(updates).length;if(count)await api.update(refs.chat,updates);return{ok:true,count}}catch(error){listenerError('exclusão do chat')(error);return{ok:false,error:error?.message||String(error)}}}
async function sendGift(targetUid,gift){if(!connected||!targetUid||targetUid===user.uid)return false;const r=api.push(api.ref(db,`${ROOT}/users/${targetUid}/inbox`));await api.set(r,{senderUid:user.uid,senderName:ownName(),type:gift.type,amount:Number(gift.amount||1),createdAt:api.serverTimestamp()});return true}
async function sendInteraction(targetUid,event){if(!connected||!targetUid||targetUid===user.uid)return false;const r=api.push(api.ref(db,`${ROOT}/users/${targetUid}/interactions`));await api.set(r,{senderUid:user.uid,senderName:ownName(),type:String(event.type||'wave').slice(0,32),requestId:String(event.requestId||'').slice(0,80),actionType:String(event.actionType||'').slice(0,32),status:String(event.status||'').slice(0,16),extra:event.extra&&typeof event.extra==='object'?event.extra:{},createdAt:api.serverTimestamp()});return true}
const SOCIAL_ACTIONS=['dance','play','highfive','hug','selfie','vehiclePassenger','boatPassenger','fishTogether','campfireJoin','huntTogether'];
const SOCIAL_STATUSES=['pending','accepted','declined','expired','cancelled','completed'];
function socialDistanceRequired(type){return['dance','play','highfive','hug','selfie','vehiclePassenger','boatPassenger','fishTogether','campfireJoin','huntTogether'].includes(type)}
async function sendSocialRequest(targetUid,actionType,targetName='Jogador',extra={}){
  if(!connected||!targetUid||targetUid===user.uid)return{ok:false,error:'Jogador indisponível'};
  actionType=String(actionType||'').slice(0,32);if(!SOCIAL_ACTIONS.includes(actionType))return{ok:false,error:'Ação inválida'};
  const cooldownKey=`${targetUid}:${actionType}`,now=Date.now(),last=Number(requestCooldown.get(cooldownKey)||0);if(now-last<4500)return{ok:false,error:'Espere alguns segundos antes de repetir o convite'};
  const target=presenceCache[targetUid];if(!target)return{ok:false,error:'O jogador não está mais online'};
  if(String(target.room||'mundo-publico')!==String(lastPresence?.room||'mundo-publico'))return{ok:false,error:'O jogador está em outra sala'};
  if(socialDistanceRequired(actionType)&&Math.hypot(Number(target.x||0)-Number(lastPresence?.x||0),Number(target.z||0)-Number(lastPresence?.z||0))>6.5)return{ok:false,error:'Chegue mais perto do jogador'};
  if(actionType==='boatPassenger'&&(!lastPresence?.boating||lastPresence?.boatRole!=='driver'||!lastPresence?.boatId))return{ok:false,error:'Entre no barco como motorista antes de convidar'};
  if(actionType==='boatPassenger'&&(target.boating||target.vehicle||target.transitMode))return{ok:false,error:'O jogador já está em outro transporte'};
  if(actionType==='vehiclePassenger'&&(!lastPresence?.vehicle||lastPresence?.vehicleRole!=='driver'||!lastPresence?.vehicleId))return{ok:false,error:'Entre no carro como motorista antes de convidar'};
  if(actionType==='vehiclePassenger'&&(target.vehicle||target.boating||target.transitMode))return{ok:false,error:'O jogador já está em outro transporte'};
  try{
    const inbox=api.ref(db,`${ROOT}/users/${targetUid}/socialRequests`),bucket=Math.floor(now/30000),safeUid=String(user.uid).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,64),id=`req_${safeUid}_${actionType}_${bucket}`,r=api.child(inbox,id);
    const safeExtra={boatId:String(extra?.boatId||'').slice(0,40),vehicleId:String(extra?.vehicleId||'').slice(0,40),campfireId:String(extra?.campfireId||'').slice(0,80),fromX:Number(lastPresence?.x||0),fromZ:Number(lastPresence?.z||0)};
    const request={fromUid:user.uid,fromName:ownName(),toUid:targetUid,toName:String(targetName||'Jogador').slice(0,24),actionType,room:String(lastPresence?.room||'mundo-publico').slice(0,32),status:'pending',createdAt:api.serverTimestamp(),createdAtClient:now,expiresAt:now+30000,extra:safeExtra};
    await api.set(r,request);requestCooldown.set(cooldownKey,now);return{ok:true,id,...request};
  }catch(error){listenerError('envio de solicitação social')(error);const message=String(error?.message||error||'');return{ok:false,error:/permission|denied/i.test(message)?'Este convite já está pendente ou foi enviado há poucos segundos':message}}
}
async function respondSocialRequest(requestId,decision){
  if(!connected||!requestId)return{ok:false,error:'Solicitação inválida'};const ref=api.ref(db,`${ROOT}/users/${user.uid}/socialRequests/${requestId}`);
  try{
    const snap=await api.get(ref),request=snap.val();if(!request)return{ok:false,error:'Convite não encontrado'};if(request.toUid!==user.uid)return{ok:false,error:'Convite não pertence a este jogador'};if(request.status!=='pending')return{ok:false,error:'Este convite já foi respondido'};
    const now=Date.now(),sender=presenceCache[request.fromUid],sameRoom=sender&&String(sender.room||'mundo-publico')===String(request.room||'mundo-publico'),distance=sender?Math.hypot(Number(sender.x||0)-Number(lastPresence?.x||0),Number(sender.z||0)-Number(lastPresence?.z||0)):Infinity;
    let status=decision==='accepted'?'accepted':'declined',reason='';
    if(now>Number(request.expiresAt||0)){status='expired';reason='O convite expirou.'}
    else if(status==='accepted'&&!sender){status='cancelled';reason='O jogador saiu.'}
    else if(status==='accepted'&&!sameRoom){status='cancelled';reason='O jogador mudou de sala.'}
    else if(status==='accepted'&&socialDistanceRequired(request.actionType)&&distance>7){status='cancelled';reason='Os jogadores estão longe demais.'}
    else if(status==='accepted'&&request.actionType==='boatPassenger'&&(!sender.boating||sender.boatRole!=='driver'||sender.boatId!==request.extra?.boatId)){status='cancelled';reason='O barco não está mais disponível.'}
    else if(status==='accepted'&&request.actionType==='boatPassenger'&&(sender.boatPassengerUid||sender.boatPassengerBotId)){status='cancelled';reason='O barco já tem um passageiro.'}
    else if(status==='accepted'&&request.actionType==='boatPassenger'&&(lastPresence?.boating||lastPresence?.vehicle||lastPresence?.transitMode)){status='cancelled';reason='Você já está em outro transporte.'}
    else if(status==='accepted'&&request.actionType==='vehiclePassenger'&&(!sender.vehicle||sender.vehicleRole!=='driver'||sender.vehicleId!==request.extra?.vehicleId)){status='cancelled';reason='O carro não está mais disponível.'}
    else if(status==='accepted'&&request.actionType==='vehiclePassenger'&&(sender.vehiclePassengerUid||sender.vehiclePassengerBotId)){status='cancelled';reason='O carro já tem um passageiro.'}
    else if(status==='accepted'&&request.actionType==='vehiclePassenger'&&(lastPresence?.vehicle||lastPresence?.boating||lastPresence?.transitMode)){status='cancelled';reason='Você já está em outro transporte.'}
    await api.update(ref,{status,respondedAt:api.serverTimestamp(),respondedAtClient:now});requestCache[requestId]={...request,status,respondedAtClient:now};await sendInteraction(request.fromUid,{type:'socialRequestResult',requestId,actionType:request.actionType,status,extra:{reason,responderName:ownName(),requestExtra:request.extra||{}}});
    return{ok:status==='accepted',status,reason,id:requestId,...request};
  }catch(error){listenerError('resposta social')(error);return{ok:false,error:error?.message||String(error)}}
}
async function completeSocialRequest(requestId){if(!connected||!requestId)return false;const ref=api.ref(db,`${ROOT}/users/${user.uid}/socialRequests/${requestId}`);try{const snap=await api.get(ref),v=snap.val();if(!v||v.toUid!==user.uid)return false;await api.update(ref,{status:'completed',completedAt:api.serverTimestamp(),respondedAtClient:Date.now()});setTimeout(()=>api.remove(ref).catch(()=>{}),1200);return true}catch{return false}}
async function expireSocialRequests(){
  if(!connected||!refs.socialRequests)return false;const now=Date.now();
  for(const[id,v]of Object.entries(requestCache)){
    if(v.status==='pending'){
      const sender=presenceCache[v.fromUid],oldEnough=Number(v.createdAtClient||0)<now-5000;let status='',reason='';
      if(Number(v.expiresAt||0)<now){status='expired';reason='O convite expirou.'}
      else if(oldEnough&&(!sender||String(sender.room||'mundo-publico')!==String(v.room||'mundo-publico'))){status='cancelled';reason='O jogador saiu ou mudou de sala.'}
      if(status){v.status=status;v.respondedAtClient=now;const ref=api.ref(db,`${ROOT}/users/${user.uid}/socialRequests/${id}`);await api.update(ref,{status,respondedAt:api.serverTimestamp(),respondedAtClient:now}).catch(()=>{});await sendInteraction(v.fromUid,{type:'socialRequestResult',requestId:id,actionType:v.actionType,status,extra:{reason,responderName:ownName()}}).catch(()=>{});}
    }else if(Number(v.respondedAtClient||v.expiresAt||0)<now-120000){await api.remove(api.ref(db,`${ROOT}/users/${user.uid}/socialRequests/${id}`)).catch(()=>{});}
  }
  return true;
}
async function claimBoat(boatId='lake-boat'){
  boatId=String(boatId||'lake-boat').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40)||'lake-boat';
  if(!connected||!user||!api)return{ok:true,offline:true,boatId};
  const ref=api.ref(db,`${ROOT}/${WORLD}/boats/${boatId}`),nowClient=Date.now();
  try{
    const result=await api.runTransaction(ref,current=>{
      const stale=!current||current.driverUid===user.uid||Number(current.updatedAtClient||0)<nowClient-20000;
      if(!stale)return;
      return{boatId,driverUid:user.uid,driverName:ownName(),room:'mundo-publico',claimedAt:current?.driverUid===user.uid?(current.claimedAt||api.serverTimestamp()):api.serverTimestamp(),updatedAt:api.serverTimestamp(),updatedAtClient:nowClient};
    },{applyLocally:false});
    if(!result.committed)return{ok:false,error:`O barco já está sendo usado por ${String(result.snapshot?.val()?.driverName||'outro jogador').slice(0,24)}.`};
    activeBoatLock=boatId;boatTouchAt=performance.now();await api.onDisconnect(ref).remove().catch(()=>{});boatCache[boatId]=result.snapshot.val()||{};return{ok:true,boatId,lock:boatCache[boatId]};
  }catch(error){listenerError('reserva do barco')(error);return{ok:false,error:error?.message||'Não foi possível reservar o barco'}}
}
async function releaseBoat(boatId=activeBoatLock||'lake-boat'){
  boatId=String(boatId||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40);if(!boatId)return false;
  if(!connected||!user||!api){if(activeBoatLock===boatId)activeBoatLock='';return true;}
  const ref=api.ref(db,`${ROOT}/${WORLD}/boats/${boatId}`);
  try{const result=await api.runTransaction(ref,current=>current?.driverUid===user.uid?null:undefined,{applyLocally:false});if(activeBoatLock===boatId)activeBoatLock='';delete boatCache[boatId];return!!result.committed}catch{return false}
}
async function sendGameChallenge(targetUid,gameType='math',level=1,targetName='Jogador'){
  if(!connected||!targetUid||targetUid===user.uid)return{ok:false,error:'Jogador indisponível'};
  const allowed=['math','portuguese','english'];if(!allowed.includes(gameType))gameType='math';
  const challengeRef=api.push(api.ref(db,`${ROOT}/users/${targetUid}/challenges`)),id=challengeRef.key,seed=(Date.now()+Math.floor(Math.random()*999999))%2147483647;
  level=Math.max(1,Math.min(6,Number(level)||1));const challenge={fromUid:user.uid,fromName:ownName(),toUid:targetUid,toName:String(targetName||'Jogador').slice(0,24),type:gameType,level,seed,rounds:5,status:'pending',createdAt:api.serverTimestamp()};
  const session={fromUid:user.uid,fromName:ownName(),toUid:targetUid,toName:String(targetName||'Jogador').slice(0,24),type:gameType,level,seed,rounds:5,status:'pending',createdAt:api.serverTimestamp(),players:{[user.uid]:{name:ownName(),score:0,total:5,finished:false,updatedAt:api.serverTimestamp()}}};
  try{const updates={};updates[`${ROOT}/users/${targetUid}/challenges/${id}`]=challenge;updates[`${ROOT}/${WORLD}/gameSessions/${id}`]=session;await api.update(api.ref(db),updates);return{ok:true,id,...challenge}}catch(error){listenerError('desafio')(error);return{ok:false,error:error?.message||String(error)}}
}
async function respondGameChallenge(challengeId,accepted){
  if(!connected||!challengeId)return{ok:false};const chRef=api.ref(db,`${ROOT}/users/${user.uid}/challenges/${challengeId}`),snap=await api.get(chRef),challenge=snap.val();if(!challenge)return{ok:false,error:'Convite não encontrado'};
  const status=accepted?'active':'declined',sessionRef=api.ref(db,`${ROOT}/${WORLD}/gameSessions/${challengeId}`),updates={};updates[`${ROOT}/users/${user.uid}/challenges/${challengeId}/status`]=accepted?'accepted':'declined';updates[`${ROOT}/users/${user.uid}/challenges/${challengeId}/respondedAt`]=api.serverTimestamp();updates[`${ROOT}/${WORLD}/gameSessions/${challengeId}/status`]=status;updates[`${ROOT}/${WORLD}/gameSessions/${challengeId}/players/${user.uid}`]={name:ownName(),score:0,total:5,finished:false,updatedAt:api.serverTimestamp()};
  try{await api.update(api.ref(db),updates);await sendInteraction(challenge.fromUid,{type:accepted?'challengeAccepted':'challengeDeclined',challengeId,gameType:challenge.type});const sessionSnap=await api.get(sessionRef),session={id:challengeId,...(sessionSnap.val()||{})};sessionCache[challengeId]=session;dispatch('otthos:game-session',session);return{ok:true,id:challengeId,...challenge,status,session}}catch(error){listenerError('resposta ao desafio')(error);return{ok:false,error:error?.message||String(error)}}
}
async function finalizeGameSession(sessionId){
  if(!connected||!sessionId)return{ok:false};const ref=api.ref(db,`${ROOT}/${WORLD}/gameSessions/${sessionId}`);
  try{const tx=await api.runTransaction(ref,current=>{if(!current||(current.fromUid!==user.uid&&current.toUid!==user.uid))return;const entries=Object.entries(current.players||{});if(entries.length<2||!entries.every(([,p])=>p?.finished))return current;if(current.result?.finalized)return current;const sorted=entries.sort((a,b)=>Number(b[1].score||0)-Number(a[1].score||0)||Number(a[1].elapsed||0)-Number(b[1].elapsed||0)),a=sorted[0],b=sorted[1],draw=Number(a[1].score||0)===Number(b[1].score||0)&&Number(a[1].elapsed||0)===Number(b[1].elapsed||0);return{...current,status:'completed',completedAt:api.serverTimestamp(),result:{finalized:true,draw,winnerUid:draw?'':a[0],winnerName:draw?'Empate':String(a[1].name||'Jogador').slice(0,24),loserUid:draw?'':b[0],loserName:draw?'':String(b[1].name||'Jogador').slice(0,24),winnerScore:Number(a[1].score||0),loserScore:Number(b[1].score||0),winnerElapsed:Number(a[1].elapsed||0),loserElapsed:Number(b[1].elapsed||0),type:current.type,completedAt:api.serverTimestamp()}}},{applyLocally:true});const value=tx.snapshot.val();if(value){sessionCache[sessionId]=value;dispatch('otthos:game-session',{id:sessionId,...value})}return{ok:tx.committed,session:value}}catch(error){listenerError('finalização da partida')(error);return{ok:false,error:error?.message||String(error)}}
}
async function submitGameResult(sessionId,result){
  if(!connected||!sessionId)return false;const path=`${ROOT}/${WORLD}/gameSessions/${sessionId}/players/${user.uid}`;try{await api.update(api.ref(db,path),{name:ownName(),score:Number(result.score||0),total:Number(result.total||5),elapsed:Number(result.elapsed||0),finished:true,updatedAt:api.serverTimestamp()});await finalizeGameSession(sessionId);return true}catch(error){listenerError('resultado')(error);return false}
}
async function getGameSession(sessionId){if(!db||!api||!sessionId)return null;try{const s=await api.get(api.ref(db,`${ROOT}/${WORLD}/gameSessions/${sessionId}`));return s.exists()?{id:sessionId,...(s.val()||{})}:null}catch{return null}}
async function closeGameSession(sessionId){const result=await finalizeGameSession(sessionId);return!!result?.ok}

function sanitizePublicItems(items,kind){const out={};for(const item of Array.isArray(items)?items:[]){if(!item?.id)continue;const id=String(item.id).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80);if(!id)continue;if(kind==='campfire')out[id]={id,ownerUid:user.uid,ownerName:ownName(),x:Number(item.x||0),z:Number(item.z||0),createdAt:Number(item.createdAt||Date.now()),expiresAt:Number(item.expiresAt||Date.now()),cooking:item.cooking?{id:String(item.cooking.id||'').slice(0,80),endsAt:Number(item.cooking.endsAt||0)}:null,updatedAt:api.serverTimestamp()};else out[id]={id,ownerUid:user.uid,ownerName:ownName(),houseId:String(item.houseId||'home').slice(0,40),type:String(item.type||'storage').slice(0,24),x:Number(item.x||0),z:Number(item.z||0),rotation:Number(item.rotation||0),createdAt:Number(item.createdAt||Date.now()),updatedAt:api.serverTimestamp()};}return out}
async function syncCampfires(items){if(!connected||!user)return false;try{await api.set(api.ref(db,`${ROOT}/${WORLD}/campfires/${user.uid}`),sanitizePublicItems(items,'campfire'));return true}catch(error){listenerError('sincronização de fogueiras')(error);return false}}
async function syncHouseExtensions(items){if(!connected||!user)return false;try{await api.set(api.ref(db,`${ROOT}/${WORLD}/houseExtensions/${user.uid}`),sanitizePublicItems(items,'extension'));return true}catch(error){listenerError('sincronização de ampliações')(error);return false}}
async function claimHouse(houseId,data){if(!connected)return{ok:false};const ref=api.ref(db,`${ROOT}/${WORLD}/houses/${houseId}`);const result=await api.runTransaction(ref,current=>{if(current?.ownerUid&&current.ownerUid!==user.uid)return;return{...(current||{}),houseId,ownerUid:user.uid,ownerName:ownName(),name:data.name||houseId,price:Number(data.price||0),locked:false,updatedAt:api.serverTimestamp()}});const value=result.snapshot.val();return{ok:result.committed&&value?.ownerUid===user.uid,ownerName:value?.ownerName||''}}
async function setHouseLock(houseId,locked){const current=housesCache[houseId];if(!connected||!current||current.ownerUid!==user.uid)return false;await api.update(api.ref(db,`${ROOT}/${WORLD}/houses/${houseId}`),{locked:!!locked,updatedAt:api.serverTimestamp()});return true}
function setDisplayName(name){lastPresence={...(lastPresence||{}),name:String(name||'Jogador').slice(0,24)};if(connected){api.update(refs.profile,{name:lastPresence.name,updatedAt:api.serverTimestamp()});publish(lastPresence,true)}return true}
async function disconnect(){if(activeBoatLock)await releaseBoat(activeBoatLock).catch(()=>{});for(const u of unsubs.splice(0)){try{u()}catch{}}if(refs.presence&&api)await api.remove(refs.presence).catch(()=>{});connected=false;refs={};presenceCache={};challengeCache={};sessionCache={};requestCache={};campfireCache={};extensionCache={};boatCache={};activeBoatLock='';dispatch('otthos:mp-status',status({mode:'offline'}))}
window.OTTHOS_RTDB={configured:validConfig(getConfig()),uid:'',getConfig,configure,disable,connect,publish,syncProgress,loadGameAccount,saveGameAccount,accountStatus,createPlayerAccount,signInPlayerAccount,reauthenticateAccount,signOutPlayerAccount,normalizeUsername,sendChat,deleteOwnChatMessages,sendGift,sendInteraction,sendSocialRequest,respondSocialRequest,completeSocialRequest,expireSocialRequests,syncCampfires,syncHouseExtensions,claimBoat,releaseBoat,sendGameChallenge,respondGameChallenge,submitGameResult,finalizeGameSession,getGameSession,closeGameSession,claimHouse,setHouseLock,setDisplayName,disconnect,status,connected:()=>connected,getHouses:()=>({...housesCache}),getChallenges:()=>({...challengeCache}),getSessions:()=>({...sessionCache}),getSocialRequests:()=>({...requestCache}),getPresence:uid=>uid?presenceCache[uid]||null:{...presenceCache},getCampfires:()=>({...campfireCache}),getHouseExtensions:()=>({...extensionCache}),getBoats:()=>({...boatCache})};dispatch('otthos:rtdb-ready',status());
