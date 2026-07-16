# OTTHOS LIFE WORLD V617 — FLUIDEZ, RENDER ESTÁVEL E GPS FIEL

Base: V616 + vídeo real enviado pelo usuário.

## Diagnóstico corrigido
- O progresso dos desafios estava salvando no IndexedDB durante a caminhada, praticamente a cada frame.
- A rota A* era recalculada repetidamente no thread principal.
- A qualidade automática alterava o nível usado pelo LOD ainda durante a partida, fazendo contornos, luzes e nuvens aparecerem e desaparecerem.
- O minimapa girava todo o cenário e mostrava pontos demais, dificultando a leitura.

## V617
- salvamento de progresso diário limitado a cada 6 segundos ou conclusão;
- GPS leve por malha viária real;
- rota recalculada somente ao marcar destino ou sair da rota;
- setas seguem o trecho restante;
- distância restante calculada pela rota;
- instrução de curva;
- minimapa norte fixo, apenas jogador, ruas, rota e destino;
- mapa completo sem nomes empilhados;
- qualidade gráfica fixa durante a sessão;
- LOD com histerese, sem piscar na fronteira;
- Firebase já configurado com o projeto lerunnersmap;
- transmissão multiplayer somente quando a posição muda e com fila de uma única escrita.

O IndexedDB permanece schema 610. O estado e cache são V617.

## Atenção ao Firebase compartilhado
Não substitua as regras existentes do projeto `lerunnersmap`. Mescle o arquivo `firebase-rules-OTTHOS-TRECHO-PARA-MESCLAR.json` dentro das regras atuais.
