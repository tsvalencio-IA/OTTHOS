# OTTHOS LIFE WORLD V605 — BASE COMPLETA ESTÁVEL

Esta entrega é um ZIP completo para publicar na raiz de um repositório GitHub Pages.

## Base usada

- Estrutura completa V600.
- Evoluções válidas da V601.
- Correções localizadas de regressão, sem importar a física e o layout quebrados das versões posteriores.

## Regras preservadas

- O arquivo `athos.glb` é usado apenas no lobby/visualizador/AR.
- Durante o jogo, o personagem é o Otthos procedural animado.
- Ação, Pular, Poder, Abaixar, Mini, Normal, Grande e Girar permanecem disponíveis.
- AR, quiz, coleção, moldes, casas, interiores, construção, missões e PWA foram preservados.

## Correções principais

- Sola dos pés ancorada à raiz física do jogador.
- Braços e pernas animados durante a caminhada.
- Pulo, queda e aterrissagem preservados.
- Ação contextual prioriza fogão, geladeira, cama, baú, porta, NPC e outros objetos próximos.
- Mapa GPS usa as coordenadas reais do mundo, mostra jogador, direção, distâncias, destinos e rota.
- Controles não ficam sobre o mapa ou outros modais.
- Layout validado em retrato e paisagem, inclusive com menu Vida expandido.
- IndexedDB principal, cópia no localStorage, salvamento automático, backups e importação/exportação.
- Instalação aparece no lobby somente quando o navegador oferece a instalação e desaparece após instalar.

## Publicação no GitHub

1. Exclua os arquivos da versão quebrada no repositório.
2. Envie todo o conteúdo deste pacote para a raiz.
3. Ative GitHub Pages na branch principal e pasta raiz.
4. No primeiro teste, abra `index.html?v=605`.
5. Aguarde o 3D carregar antes de entrar no mundo.

## Auditoria pelo F12

Use `F12_TESTE_OTTHOS_V605_JOGABILIDADE_COMERCIAL.js` no Console do navegador depois que o jogo estiver publicado.

Leia também `RELATORIO_VALIDACAO_V605.txt`.
