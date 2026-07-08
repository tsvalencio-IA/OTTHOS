# ATHOS V54.8 — Somente arquivos alterados

Correção real do problema de inimigos invisíveis:
- o render V54 escondia o levelGroup original;
- por isso inimigos/itens/obstáculos lógicos podiam existir, mas não aparecer;
- agora existe uma camada independente na scene, fora do levelGroup;
- essa camada mostra ALVO, PEGAR e CUIDADO/BURACO mesmo quando o render esconde os objetos antigos;
- primeiro inimigo vem mais cedo e no centro da pista;
- render rico preservado, sem simplificar o cenário.

Abrir:
?v=548-overlay-real-visivel

Teste:
F12_TESTE_ATHOS_V548_OVERLAY_REAL_VISIVEL.js
