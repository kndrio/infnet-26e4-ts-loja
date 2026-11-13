# Loja do Café · versão BOOTSTRAP (JavaScript → TypeScript)

Ponto de partida do live code: o mesmo domínio da versão completa, **em JavaScript**,
já rodando no Vite e com o TypeScript instalado. A missão é migrar aos poucos.

```bash
npm install
npm run dev     # http://localhost:5173  ·  dados em http://localhost:5173/dados/produtos.json
npm run check   # tsc (por enquanto só existe JS, então passa)
```

## Como o projeto foi criado

```bash
npm create vite@latest loja -- --template vanilla-ts
```
Depois: removido o contador do template, criados `public/dados/*.json`, `.env` e os arquivos `.js` do domínio.

## Roteiro de migração gradual

1. **Tour do `tsconfig.json`**: `strict`, `noEmit` (quem gera JS é o Vite), `moduleResolution: bundler`,
   `erasableSyntaxOnly`, `allowJs` (JS e TS convivem).
2. **Ligar a checagem dos JS**: `"checkJs": true` → `npm run check` lista dezenas de `any` implícitos.
   Volte para `false` e migre um arquivo de cada vez.
3. **Um arquivo com `// @ts-check` + JSDoc**: `src/legado/datas.js` (sem renomear).
4. **Declaração para JS legado**: criar `src/legado/frete-legado.d.ts` (o `.js` continua igual).
5. **Tipos do domínio**: criar `catalogo/tipos.ts` e `pedidos/tipos.ts` (interfaces, uniões, `as const`).
6. **Renomear `.js` → `.ts`** um por vez (comece por `moeda`, `catalogo`, `carrinho`), atualizando os imports.
7. **Dados de fora**: `buscarLista<T>(arquivo, validar)` com `unknown` + type predicate.
8. **`src/tipos/ambiente.d.ts`**: tipar `import.meta.env` (`VITE_URL_DADOS`, `VITE_UF_ENTREGA`).
9. **Source maps**: breakpoint no `.ts` pelo DevTools.

A versão completa (`loja-ts`) é o gabarito de cada passo.

## Grupos

- **Grupo A · Catálogo**: `src/catalogo/` (+ `produtos.json`, `categorias.json`)
- **Grupo B · Pedidos**: `src/pedidos/` (+ `cupons.json`, `pedidos.json`) e `src/legado/frete-legado.js`

## Para o professor: bugs que o TypeScript vai revelar

| Onde | Bug | Sintoma no JS | Quando o TS acusa |
|---|---|---|---|
| `main.js`, clique em "Adicionar" | `buscarPorId(alvo.dataset.id)` passa **string**; o id é number | o botão não faz nada | ao tipar `buscarPorId(id: number)`: TS2345 |
| `pedidos/carrinho.js` | `case "valorfixo"` (f minúsculo) | cupom MENOS20 nunca desconta | com a união `Cupom`: TS2678 |
| `pedidos/status.js` | falta `case "cancelado"` | devolve `undefined` | com `never` no default: TS2322 |
| `legado/datas.js` | `hoje - new Date(iso)` (conta com Date) | funciona no JS | com `// @ts-check`: TS2362 / TS2363 |
