# OTTHOS LIFE WORLD V616

## Principais mudanças
- correção do piscar: a qualidade automática não altera mais DPR, sombras ou tamanho do canvas durante a partida;
- resize estabilizado contra oscilações da barra do navegador;
- minimapa em formato de radar centrado no jogador;
- rota A* usando colisores e perigos reais;
- setas no chão seguindo o caminho calculado;
- destinos de casas apontando para as portas;
- desafios diários com sequência, moedas e XP;
- novas ações sociais: acenar, dançar, selfie e seguir;
- multiplayer opcional via Firebase Realtime Database com Auth Anônimo, presença e onDisconnect;
- BroadcastChannel preservado como fallback local.

## Ativação do Firebase
1. Ative Authentication > Anônimo.
2. Crie o Realtime Database.
3. Publique `firebase-database.rules.json`.
4. No jogo, abra Configurações > Multiplayer e cole o firebaseConfig.

O IndexedDB continua no schema 610. O estado do jogo é V616.
