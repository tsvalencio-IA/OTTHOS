# OTTHOS LIFE WORLD V619 — MUNDO SOCIAL PERSISTENTE

Base: V618.

## Implementado
- todos os jogadores entram automaticamente no mesmo mundo público;
- autenticação anônima sem senha;
- nome salvo localmente e no Firebase;
- progresso, moedas, XP, conquistas, inventário, casas, avatar e construções sincronizados;
- presença e personagens remotos em tempo real;
- chat público de texto;
- acenar, toca-aqui, desafio e presentes entre jogadores;
- casas exclusivas no Firebase, com compra transacional e porta trancada/destrancada;
- sociedade de NPCs com conversas, presentes, humor, brigas e desafios locais;
- frustum culling desativado em todo o cenário estático para impedir ruas/prédios desaparecendo ao caminhar;
- câmera ampliada e viewport estabilizado.

## Limitações honestas
- voz ainda não foi incluída: precisa de Firebase Storage/Cloudinary e regras de upload;
- autenticação anônima preserva o usuário no mesmo navegador/app. Se limpar os dados ou trocar de aparelho, o UID muda;
- economia ainda é controlada pelo cliente. Para impedir trapaça comercialmente, será necessário backend/Cloud Functions.

## Firebase
Ative Authentication Anônimo e mescle `firebase-rules-OTTHOS-TRECHO-PARA-MESCLAR.json` nas regras existentes sem apagar outros sistemas.
