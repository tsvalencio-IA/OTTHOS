# ATHOS V57.2 — Somente arquivos alterados

Base: V57/V57.1.

Correção real dos controles:
- a V57.1 ainda podia perder para CSS antigo;
- agora o app.js aplica inline !important via installV572ControlsFix();
- joystick fica fixo no canto inferior esquerdo;
- botões ficam fixos em grade 3x3 no canto inferior direito;
- botões não ficam sobrescritos, escondidos ou empilhados;
- correção roda no resize, orientationchange e visualViewport;
- mantém render rico, AR e linguagem visual.

Abrir:
?v=572-controles-fix-final

Teste:
F12_TESTE_ATHOS_V572_CONTROLES_FIX_FINAL.js
