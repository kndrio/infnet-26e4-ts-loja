import "./style.css";
import { Catalogo } from "./catalogo/catalogo.js";
import { buscarLista } from "./compartilhado/api.js";
import { formatarMoeda } from "./compartilhado/moeda.js";
import { Carrinho } from "./pedidos/carrinho.js";
import { proximoStatus, rotuloStatus } from "./pedidos/status.js";
import { diasDesde, formatarData } from "./legado/datas.js";

function elemento(seletor) {
  const achado = document.querySelector(seletor);
  if (!achado) throw new Error(`Elemento ${seletor} não existe no HTML`);
  return achado;
}

const app = elemento("#app");
app.innerHTML = `
  <header><h1>☕ Loja do Café</h1><p>Projeto de exemplo · JavaScript → TypeScript</p></header>
  <main>
    <section>
      <h2>Catálogo <small>(Grupo A)</small></h2>
      <div class="filtros">
        <select id="categoria"><option value="">Todas as categorias</option></select>
        <input id="busca" placeholder="Buscar produto" />
        <label><input id="disponiveis" type="checkbox" /> Só disponíveis</label>
      </div>
      <ul id="produtos" class="lista"></ul>
    </section>
    <section>
      <h2>Carrinho <small>(Grupo B)</small></h2>
      <ul id="itens" class="lista"></ul>
      <select id="cupom"><option value="">Sem cupom</option></select>
      <dl id="resumo"></dl>
      <h2>Pedidos</h2>
      <ul id="pedidos" class="lista"></ul>
    </section>
  </main>
  <p id="erro" class="erro" hidden></p>`;

function mostrarErro(mensagem) {
  const caixa = elemento("#erro");
  caixa.textContent = `⚠️ ${mensagem}`;
  caixa.hidden = false;
}

async function iniciar() {
  // As 4 buscas em paralelo (http://localhost:5173/dados/...)
  let produtos, categorias, cupons, pedidos;
  try {
    [produtos, categorias, cupons, pedidos] = await Promise.all([
      buscarLista("produtos.json"),
      buscarLista("categorias.json"),
      buscarLista("cupons.json"),
      buscarLista("pedidos.json"),
    ]);
  } catch (erro) {
    return mostrarErro(erro.message);
  }

  const catalogo = new Catalogo(produtos);
  const carrinho = new Carrinho(import.meta.env.VITE_UF_ENTREGA);

  const selCategoria = elemento("#categoria");
  const campoBusca = elemento("#busca");
  const chkDisponiveis = elemento("#disponiveis");
  const selCupom = elemento("#cupom");

  for (const categoria of categorias) selCategoria.add(new Option(categoria.nome, categoria.id));
  for (const cupom of cupons) selCupom.add(new Option(cupom.codigo, cupom.codigo));

  function desenharCatalogo() {
    const categoria = selCategoria.value;
    const lista = catalogo.filtrar({ categoria, busca: campoBusca.value, somenteDisponiveis: chkDisponiveis.checked });
    elemento("#produtos").innerHTML = catalogo
      .ordenarPor("preco", lista)
      .map(
        (produto) => `<li>
          <span>${produto.nome}<br><small>${formatarMoeda(produto.preco)} · estoque ${produto.estoque}</small></span>
          <button data-id="${produto.id}" ${produto.estoque === 0 ? "disabled" : ""}>Adicionar</button>
        </li>`,
      )
      .join("");
  }

  function desenharCarrinho() {
    elemento("#itens").innerHTML =
      carrinho
        .listar()
        .map((item) => `<li><span>${item.quantidade}× ${item.produto.nome}</span><button data-remover="${item.produtoId}">Remover</button></li>`)
        .join("") || "<li>Carrinho vazio</li>";
    const resumo = carrinho.resumo();
    elemento("#resumo").innerHTML = `
      <dt>Subtotal</dt><dd>${formatarMoeda(resumo.subtotal)}</dd>
      <dt>Desconto</dt><dd>− ${formatarMoeda(resumo.desconto)}</dd>
      <dt>Frete (${import.meta.env.VITE_UF_ENTREGA})</dt><dd>${formatarMoeda(resumo.frete)}</dd>
      <dt><b>Total</b></dt><dd><b>${formatarMoeda(resumo.total)}</b></dd>`;
  }

  elemento("#pedidos").innerHTML = pedidos
    .map((pedido) => {
      const proximo = proximoStatus(pedido.status);
      return `<li><span>${pedido.id} · ${pedido.cliente}<br><small>${formatarData(pedido.criadoEm)} (há ${diasDesde(pedido.criadoEm)} dias)</small></span>
        <span>${rotuloStatus(pedido.status)}${proximo ? ` → ${rotuloStatus(proximo)}` : ""}</span></li>`;
    })
    .join("");

  // Eventos
  for (const campo of [selCategoria, campoBusca, chkDisponiveis]) campo.addEventListener("input", desenharCatalogo);
  elemento("#produtos").addEventListener("click", (evento) => {
    const alvo = evento.target;
    const produto = catalogo.buscarPorId(alvo.dataset.id);
    if (produto) {
      carrinho.adicionar(1, produto);
      desenharCarrinho();
    }
  });
  elemento("#itens").addEventListener("click", (evento) => {
    const alvo = evento.target;
    if (alvo.dataset.remover) {
      carrinho.remover(Number(alvo.dataset.remover));
      desenharCarrinho();
    }
  });
  selCupom.addEventListener("change", () => {
    carrinho.aplicarCupom(cupons.find((cupom) => cupom.codigo === selCupom.value) ?? null);
    desenharCarrinho();
  });

  desenharCatalogo();
  desenharCarrinho();
}

void iniciar();
