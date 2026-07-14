# CHANGELOG — Passe de melhoria "Mundo aberto / Veículos" (Claude)

Base: OTTHOS LIFE WORLD V605 (recebida em
`OTTHOS_LIFE_WORLD_V605_COMPLETO_BASE_ESTAVEL.zip`). Nenhum sistema de vida
(NPCs, casas, necessidades, construção, quiz, IndexedDB) foi tocado — a
mudança foi cirúrgica, focada em **1) visual geral** e **2) dirigir o carro**,
como combinamos.

## Por que o jogo parecia "sem graça" (causa raiz, não falta de arte)

1. **Bug real de textura**: o chão usava uma textura de 64×64px repetida
   28×28 vezes com `NearestMipMapNearestFilter` sem anisotropia. A uma
   distância normal de câmera, isso faz o mipmap "lavar" a textura para uma
   cor quase sólida — por isso o chão parecia liso e sem grama no vídeo,
   mesmo o código já desenhando grama.
2. **O "carro" era só um multiplicador de velocidade**: ao entrar no
   carrinho, o jogador continuava se movendo exatamente como a pé (mesmo
   joystick de 8 direções, sem inércia, sem curva, virando instantaneamente
   pra qualquer lado) — só que mais rápido. Não existia física de veículo
   nenhuma, por isso "dirigir" não tinha graça nenhuma.
3. Céu era uma cor sólida chapada, sem gradiente, sem sol, sem nuvens.

## O que foi mudado

### Visual (chão, céu, estrada)
- Textura procedural em 128×128 (antes 64×64), com `LinearMipmapLinearFilter`
  + anisotropia máxima da GPU — a grama, a estrada, a madeira e o tijolo não
  "lavam" mais para cor sólida à distância.
- Estrada agora é **asfalto cinza-escuro com faixa amarela central tracejada
  e calçada com meio-fio**, em vez do caminho marrom-terra anterior — lê como
  rua de verdade, não trilha de terra.
- Céu com gradiente (azul no topo → quase branco no horizonte), sol visível e
  nuvens simples flutuando, no lugar da cor sólida chapada.

### Dirigir o carro (o pilar pedido)
- **Física real de carro** em `updateVehiclePhysics()`: aceleração e frenagem
  com curva (acelera mais forte a baixa velocidade, perde força perto da
  velocidade máxima; frear é mais forte que dar ré), direção com raio de
  curva dependente da velocidade (quase não vira parado, vira melhor em
  velocidade média, fica mais "pesado" para virar em alta velocidade) e
  **derrapagem real**: em curva fechada e velocidade alta, a velocidade do
  carro atrasa em relação para onde ele está apontando — o carro escorrega de
  lado, com poeira saindo dos pneus e um som de derrapagem.
- **Carro com carroceria de verdade**: para-brisa, faróis e lanternas
  emissivos, spoiler inferior, e 4 rodas independentes que giram de verdade
  conforme a velocidade e viram para os lados ao curvar.
- **Suspensão simples**: o carro inclina de leve para trás ao acelerar e para
  frente ao frear (efeito de "squat/dive"), e inclina de lado ao derrapar.
- **Som de motor contínuo** (não só um "beep"): o tom sobe com a velocidade,
  liga ao entrar no carro e desliga ao sair.
- **Câmera de perseguição estilo GTA**: no carro, a câmera se reposiciona
  sozinha atrás da direção do carro (em vez de ficar presa ao ângulo livre de
  quando você estava a pé), recua e ganha campo de visão (FOV) conforme a
  velocidade aumenta, para dar sensação de velocidade.
- O carro estacionado no mundo (antes de entrar) usa a mesma carroceria nova,
  para não haver troca brusca de visual ao entrar.

## O que **não** foi mexido (por escolha, para não desestabilizar o resto)

- Sistemas de casas, interiores, NPCs, diálogos, necessidades (fome/energia/
  higiene/diversão), construção, quiz, corridas a pé, mapa GPS, salvamento em
  IndexedDB, multiplayer-ready — tudo isso continua exatamente como estava.
- O layout de ruas (posições) não mudou, só o material/visual delas — não
  quis arriscar reposicionar casas/NPCs que dependem das coordenadas atuais.

## Limitações conhecidas desta passada

- É uma melhoria de **profundidade média** ("os dois, mas mais raso"), como
  você pediu — não é um motor de física de carro completo (sem suspensão por
  roda independente, sem dano de colisão, sem múltiplos veículos ainda).
- Colisão do carro contra paredes/casas continua simples (para na parede),
  sem ricochete — igual já era para o personagem a pé.
- Não há tráfego de outros carros nem semáforos — a "cidade viva" de GTA
  (NPCs dirigindo, trânsito) fica para uma próxima leva, se for essa a
  prioridade depois.
- Testes executados foram estáticos (sintaxe via esbuild, checagem de chaves
  balanceadas, revisão de código) — não há navegador neste ambiente para
  gravar um vídeo de teste real; recomendo testar no celular e me mandar
  feedback específico do que ainda incomoda na direção.

## Próximos passos sugeridos (se quiser continuar nessa pilar)

1. Adicionar 1-2 veículos diferentes (moto ágil / caminhão pesado) com curvas
   de física distintas.
2. Trânsito simples: 2-3 carros de NPC andando em loop pelas ruas existentes.
3. Dano visual leve ao bater (arranhado/fumaça) sem mexer no sistema de vida.
4. Rampas/obstáculos de manobra para curtir a derrapagem (parte divertida do
   GTA/arcade racing).
