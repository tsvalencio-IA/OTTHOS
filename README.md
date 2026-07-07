# ATHOS: Guardião dos Portais — V50

## Status: RENDER FIEL À IMAGEM DE REFERÊNCIA

### Alterações V49 → V50

**Fix crítico — Script de Teste:**
- `F12_TESTE_ATHOS_V48_RENDER_ALVO_10.js` linha 35: 
  `Number(st.textureSamplers||99)` → `Number(st.textureSamplers??99)`
  Root cause: operador `||` com valor falsy `0` produzia `99` em vez de `0`.

**HUD Visual fiel à imagem de referência:**
- Badge nível + barra XP no canto esquerdo
- 5 corações individuais (❤️ vivos / 🖤 vazios) no centro
- Contador de gemas (💎) + botão + + engrenagem ⚙ no canto direito
- Badge de missão redesenhado com ícone 🔷

**Preservado sem alteração:**
- `v48-render-target.js` — cenário 3D 100% intacto (22 testes OK)
- `athos.glb` — modelo 3D do Athos
- `app.js` — lógica de jogo (cirurgia mínima apenas em updateHud)
- `style.css` — CSS base
- `F12_TESTE_ATHOS_GAMEPLAY_ENGINE_10.js` — script de teste gameplay

### Resultados de Teste Esperados (V50)
- Engine 10: 22/22 ✅ OK
- V48 Render Alvo: 33/33 ✅ OK (incluindo "V48 sem textura pesada" agora corrigido)

---
*Powered by thIAguinho Soluções Digitais*
