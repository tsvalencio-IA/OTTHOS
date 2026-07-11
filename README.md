# ATHOS OPEN WORLD COMPLETO LIMPO V590

Base limpa para novo repositório.

## O que esta versão preserva

- Jogo 3D completo.
- Mundo aberto V590.
- AR / model-viewer com `athos.glb`.
- Quiz.
- Conversa / falar com Athos.
- Coleção.
- Progresso local.
- HUD.
- Joystick.
- Gamepad.
- Botões de ação.
- Pulo, poder, espada/interação, agachar, tamanho, girar, pausa e sair.
- Render premium V54.
- Responsividade mobile em retrato e paisagem.
- Service Worker limpo para evitar cache fantasma.

## Estrutura limpa

```text
index.html
app.js
style.css
sw.js
manifest.webmanifest
athos.glb
404.html
.nojekyll
icons/
assets/render-v54/
F12_TESTE_ATHOS_V590_OPEN_WORLD_FOUNDATION.js
```

## Arquivos antigos removidos

Foram removidos testes antigos V48, V52, V53, V541, V543, V544, V545, V546, V547, V548, V550, imagens de alvo antigas, moldes antigos e renderizadores antigos não usados.

## Como publicar

Suba todos os arquivos desta pasta na raiz de um novo repositório GitHub Pages ou Vercel.

Depois de publicar, abra com:

```text
index.html?v=590-open-world-foundation-clean
```

## Teste

No navegador, abra o jogo e rode no console:

```js
// cole o conteúdo de:
F12_TESTE_ATHOS_V590_OPEN_WORLD_FOUNDATION.js
```

## Importante

Esta limpeza não removeu funções principais do jogo. O objetivo foi remover histórico antigo, arquivos duplicados, testes obsoletos e assets de referência que não são necessários para o novo repositório.
