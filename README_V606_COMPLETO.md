# V606 — ALTERAÇÕES TÉCNICAS

## Núcleo do personagem

- Modelo procedural próprio do Otthos, fiel à imagem de referência.
- Nenhum GLB é carregado no mundo jogável.
- Hierarquia separada entre raiz física e raiz visual.
- Correção da sola recalculada durante a animação com `THREE.Box3`.
- Roupas e acessórios agora são sobreposições; não substituem a identidade preta do personagem.

## Jogabilidade

- Movimento refeito com resposta progressiva e parada controlada.
- Ciclo de caminhada baseado na distância realmente percorrida.
- Rotação suave na direção do movimento.
- Animações para interação e atividades domésticas.
- Altura do terreno calculada por superfícies registradas.

## Mundo e NPCs

- NPCs completos e visualmente diferentes.
- Identificação no mundo por placas discretas.
- Contraste de terreno, ruas e iluminação revisado.
- Entrada e saída de interiores com transição visual.

## Navegação

- Mapa convertido para coordenadas do mundo.
- Marcadores menores e selecionáveis.
- Posição e direção do jogador.
- Destino, distância, rota e guia no cenário.

## Responsividade

- HUD, missão, navegação, menu Vida e controles ocupam zonas separadas.
- Mapa/modal ocultam controles do jogo enquanto abertos.
- Regras específicas para paisagem baixa e retrato estreito.

## Persistência e compatibilidade

- Schema V606.
- Migração das chaves V600–V605.
- IndexedDB + dois backups + localStorage de emergência.
- Cache e manifest V606.
