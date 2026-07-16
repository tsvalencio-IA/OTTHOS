# OTTHOS LIFE WORLD V620 — ONLINE + ACADEMIA OTTHOS

## Correções
- botões Online e Desafios agora possuem handlers reais;
- regras permitem leitura no nó pai `presence`, necessária para listar todos os usuários;
- removido o `count: 1` fixo que sobrescrevia a contagem;
- presença mantém cache de jogadores e atualiza o painel ao vivo;
- erros dos listeners Firebase passam a aparecer no status;
- jogadores recebidos antes da cena 3D são materializados quando o mundo inicia.

## Academia Otthos
- trilha com 4 unidades e 12 lições;
- 5 perguntas por lição;
- 3 corações;
- estrelas, coroas, sequência, XP e moedas;
- bloqueio progressivo das lições;
- desafios diários preservados em aba separada;
- progresso salvo localmente, IndexedDB e Firebase.

## Firebase
Como o projeto está exclusivo para o jogo, publique o arquivo completo `firebase-database.rules.json`. A leitura de `presence` precisa ficar no nó pai.
