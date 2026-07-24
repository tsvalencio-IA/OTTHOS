# OTTHOS Life World V629 — edição definitiva

Base oficial consolidada a partir da V628 funcional, com os melhores recursos visuais e de conteúdo da versão alternativa.

## Publicação

1. Envie todo o conteúdo da pasta `OTTHOS-main` para a raiz do repositório GitHub.
2. No Firebase Authentication, mantenha **Anonymous** e **Email/Password** ativados. A criança usa apenas a tela de nome e senha do próprio jogo; nenhum e-mail real é solicitado.
3. No Firebase Realtime Database, substitua as regras pelo conteúdo completo de `firebase-database.rules.json` e clique em **Publicar**.
4. Feche e reabra a PWA após o deploy para receber o cache V629.

## Segurança e progresso

- A senha é validada pelo Firebase Authentication e nunca é salva em texto aberto.
- O progresso sincronizado permanece criptografado com AES-GCM.
- Cada cópia de conta fica restrita ao UID autenticado.
- A opção de reiniciar fica na Área dos Responsáveis e exige senha quando houver conta, a palavra `APAGAR` e confirmação final.

## Estrutura importante

- `app.js`: mundo, jogabilidade e recursos.
- `assets/js/game-account.js`: criptografia local do progresso.
- `assets/js/multiplayer-rtdb.js`: multiplayer, conta protegida e sincronização.
- `firebase-database.rules.json`: regras completas do Realtime Database.
- `assets/textures/`: texturas profissionais adicionadas à edição definitiva.

Não use arquivos de regras parciais de versões antigas.
