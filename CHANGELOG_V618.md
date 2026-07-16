# OTTHOS LIFE WORLD V618 — MOBILE ESTÁVEL

Base: V617.

## Correções
- piso, ruas, calçadas, meio-fio, água e lava marcados como superfícies críticas sem frustum culling;
- nenhuma geometria do cenário muda de visibilidade pela distância do jogador;
- sombras dinâmicas desativadas no celular para evitar popping e aliviar GPU;
- renderer em highp;
- minimapa com ícone corrigido: a ponta mostra a mesma direção real do personagem;
- seta do GPS e instruções esquerda/direita corrigidas;
- HUD mobile redesenhada automaticamente em retrato e paisagem;
- habilidades viraram gaveta recolhível, preservando todos os botões;
- minimapa, missão, câmera, joystick e ações ocupam setores diferentes;
- cada jogador precisa definir um nome de 3 a 18 caracteres antes de entrar;
- nome aparece no HUD e completo acima dos jogadores remotos;
- Firebase e chaves já preservados.

## Observação
O IndexedDB continua schema 610. O estado e cache são V618.
