# OTTHOS LIFE WORLD V606 — NÚCLEO DE JOGABILIDADE RECONSTRUÍDO

Esta é uma versão **completa** para publicar na raiz do repositório GitHub Pages.

A V606 parte da base de roleplay que já possuía casas, vizinhos, missões, trabalhos, construção, corridas, AR, quiz, coleção, moldes e salvamento. O trabalho principal desta versão foi reconstruir o núcleo que estava causando as regressões vistas no vídeo: personagem genérico, pés entrando no chão, deslocamento artificial, mapa pouco útil e conflitos entre HUD, mapa e modo paisagem.

## Principais correções

- Otthos procedural fiel à referência durante a jogabilidade; `athos.glb` permanece apenas no lobby/AR.
- Corpo preto, olhos branco/vermelho e chamas pixeladas nos braços e pernas.
- Animação procedural de braços, pernas, caminhada, repouso, pulo, queda, aterrissagem, abaixar e ações.
- Trava dinâmica da sola dos pés usando os limites reais do modelo visual.
- Física, escala e visual separados para evitar afundamento em Mini, Normal, Grande e Abaixar.
- Movimento com zona morta, aceleração, desaceleração, curva de resposta e rotação suave.
- Superfícies reais para terreno, ruas, interiores, pista e plataformas.
- Transições de entrada e saída de casas com câmera interna.
- Ações visuais para porta, fogão, pia, baú, coleta, conversa, ataque e poder.
- Vizinhos reconstruídos como personagens completos, com braços, pernas, rosto, cabelo, nome e caminhada.
- Mapa GPS baseado nas coordenadas reais do mundo, com posição, direção, distância, seleção e rota.
- Guia de navegação dentro do mundo com seta e distância.
- HUD e controles separados em zonas para retrato e paisagem.
- Ao abrir mapa ou modal, os controles incompatíveis ficam ocultos.
- Todos os controles foram preservados: joystick, Ação, Pular, Poder, Abaixar, Mini, Normal, Grande e Girar.
- Salvamento automático em IndexedDB, backups internos, cópia no localStorage e exportação/importação.
- Instalação PWA exibida apenas quando disponível e quando o aplicativo ainda não está instalado.

## Publicação

1. Apague os arquivos da versão anterior do repositório.
2. Extraia este ZIP.
3. Envie todo o conteúdo extraído para a raiz.
4. Aguarde o GitHub Pages atualizar.
5. Abra uma vez com `?v=606` para evitar cache antigo.

Exemplo:

`https://SEU-USUARIO.github.io/SEU-REPOSITORIO/?v=606`

## Teste F12

Depois de publicar, execute no Console do navegador:

`F12_TESTE_OTTHOS_V606_JOGABILIDADE_COMERCIAL.js`

O script testa o jogo real no navegador: personagem, pés, movimento, pulo, controles, ações contextuais, casas, NPCs, mapa, salvamento, PWA, arquivos e desempenho.

## Observação de validação

Nesta entrega foram executados testes sintáticos, estruturais, de referências, manifest, Service Worker, banco local, integridade e empacotamento. O ambiente de geração não conseguiu iniciar um navegador gráfico funcional, por isso a validação visual final em celular deve ser feita após a publicação usando o arquivo F12 incluído e a jogabilidade no aparelho.
