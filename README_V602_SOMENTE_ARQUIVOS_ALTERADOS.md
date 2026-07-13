# OTTHOS V602 — CORREÇÃO COMPLETA SEM SIMPLIFICAR

Este pacote deve ser aplicado por cima da base **OTTHOS V601 Roleplay**.
Ele contém somente arquivos alterados ou criados.

## Correções críticas

- O botão **AÇÃO** executa exatamente o contexto mostrado na tela.
- Cozinhar não abre mais inventário.
- O baú da casa ganhou armazenamento próprio para guardar e retirar recursos.
- Restaurados os controles:
  - Abaixar;
  - Mini;
  - Normal;
  - Grande;
  - Girar;
  - Ação;
  - Pular;
  - Poder.
- Mantidos joystick, teclado e gamepad.
- O menu rápido fecha antes de uma interação contextual para não capturar o toque.

## Salvamento no celular

- IndexedDB atualizado para schema 602.
- Salvamento automático a cada 5 segundos durante o jogo.
- Salvamento ao fechar, minimizar ou trocar de página.
- Duas cópias de segurança internas rotativas.
- `localStorage` permanece como cópia emergencial.
- Botão **Salvar agora** nas configurações.
- Exportar e importar backup JSON continuam disponíveis.

Os dados ficam no armazenamento privado do navegador/aplicativo no celular. Eles não aparecem como um arquivo comum na pasta Downloads, exceto quando o usuário escolhe **Exportar backup**.

## Instalação PWA

- Removido o banner repetido de instalação.
- O botão de instalação aparece somente no lobby quando o navegador realmente libera a instalação.
- Depois de instalado, o botão fica oculto.
- Em Configurações, a opção aparece somente se o app ainda não estiver instalado.

## Roleplay e mundo vivo

- O personagem principal continua sendo Otthos.
- O antigo NPC “Otto” foi migrado para **Nino**, preservando amizade e progresso antigos.
- Conversas incluem:
  - conversar;
  - contar piada;
  - presentear;
  - discutir;
  - desafiar para corrida;
  - desafiar pega-moedas;
  - disputar uma casa;
  - perguntar sobre trabalho;
  - convidar para casa.
- Novo Ginásio de Atletismo.
- Corrida de velocidade.
- Corrida pega-moedas.
- Disputa de casas por corrida.
- Novo capítulo de missão do ginásio.

## Mapa

- Mapa usa coordenadas reais do mundo.
- Mostra posição do jogador.
- Mostra casas, vila, oficina, mercado, floresta, lago, ginásio, garagem, vale e castelo.
- É possível marcar um destino.
- Um marcador 3D aparece no mundo.

## Desafios de tamanho

- Passagem para modo Mini.
- Túnel para Abaixar.
- Portão pesado para modo Grande.

## Arquivos alterados

- `index.html`
- `app.js`
- `style.css`
- `sw.js`
- `manifest.webmanifest`
- `assets/js/save-db.js`

## Arquivos criados

- `F12_TESTE_OTTHOS_V602_CORRECAO_COMPLETA.js`
- `README_V602_SOMENTE_ARQUIVOS_ALTERADOS.md`

## Atualização

Substitua os arquivos mantendo a mesma estrutura de pastas. Depois abra:

```text
?v=602
```

Em caso de cache antigo, feche o aplicativo completamente e abra novamente.
