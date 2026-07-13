# OTTHOS V601 — ROLEPLAY LIFE SIM

Este pacote contém **somente os arquivos alterados ou criados** sobre a base:

`OTTHOS_LIFE_WORLD_V600_COMPLETE.zip`

## Aplicação

Copie os arquivos do ZIP para a raiz do repositório atual e aceite a substituição dos arquivos existentes.

## Arquivos alterados

- `index.html`
- `app.js`
- `style.css`
- `sw.js`
- `manifest.webmanifest`

## Arquivos criados

- `assets/js/save-db.js`
- `F12_TESTE_OTTHOS_V601_ROLEPLAY.js`
- `README_V601_ARQUIVOS_ALTERADOS.md`

## Principais evoluções

- Usa `athos.glb` como personagem principal dentro do jogo, mantendo fallback somente para falha de carregamento.
- Estúdio **Meu Otthos** com roupas, chapéus e acessórios.
- Guarda-roupa interativo dentro da Casa do Otthos.
- Conversas com opções: conversar, contar piada, presentear, pedir trabalho e convidar para casa.
- Sistema de amizade com níveis.
- Central de trabalhos com entrega, coleta, cristais e decoração.
- Carreira, nível profissional, trabalhos concluídos, moedas e reputação.
- Novo capítulo de missão Roleplay.
- HUD reduzido: necessidades, missão e atalhos ficam recolhidos.
- Instalação PWA aparece somente no lobby e somente quando o navegador liberar.
- Removida a instalação repetida das configurações e do menu de pausa.
- IndexedDB para salvar progresso no celular, com `localStorage` como cópia de segurança.
- Exportação e importação de progresso em JSON.
- Estrutura multiplayer local preservada e versionada.

## Cache

Abra após publicar usando:

`?v=601`

## Teste

Cole no console o conteúdo de:

`F12_TESTE_OTTHOS_V601_ROLEPLAY.js`
