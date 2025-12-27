const cardapio = {
  mais_pedidos: [
    { n: "Frango com Catupiry", p: 13.00, d: "Frango desfiado com Catupiry" },
    { n: "Carne com Queijo", p: 13.00, d: "Carne moída com queijo mussarela" },
    { n: "Queijo", p: 12.00, d: "Queijo mussarela" },
    { n: "Queijo com Milho", p: 13.00, d: "Queijo mussarela com milho" },
    { n: "Frango, Queijo e Milho", p: 14.00, d: "Frango desfiado, queijo mussarela e milho" },
    { n: "Palitinhos de Doce de Leite", p: 20.00, d: "6 palitos empanados com açúcar e canela" }
  ],
  tradicionais: [
    { n: "Calabresa", p: 12.00, d: "Calabresa fatiada" },
    { n: "Carne", p: 12.00, d: "Carne moída" },
    { n: "Frango", p: 12.00, d: "Frango desfiado" },
    { n: "Queijo", p: 12.00, d: "Queijo mussarela" }
  ],
  especiais: [
    { n: "Carne com Catupiry", p: 13.00, d: "Carne moída com Catupiry" },
    { n: "Carne com Cheddar", p: 13.00, d: "Carne moída com Cheddar" },
    { n: "Carne com Milho", p: 13.00, d: "Carne moída com Milho" },
    { n: "Calabresa com Catupiry", p: 13.00, d: "Calabresa com Catupiry" },
    { n: "Frango com Queijo", p: 13.00, d: "Frango desfiado com Queijo mussarela" }
  ],
  combinados: [
    { n: "Queijo, Catupiry e Milho", p: 14.00, d: "Queijo mussarela, Catupiry e Milho" },
    { n: "Carne, Queijo e Presunto", p: 14.00, d: "Carne moída, Queijo mussarela e Presunto" },
    { n: "Calabresa, Queijo e Tomate", p: 14.00, d: "Calabresa, Queijo mussarela e Tomate" },
    { n: "Frango, Catupiry e Queijo", p: 14.00, d: "Frango desfiado, Catupiry e Queijo mussarela" }
  ],
  doces: [
    { n: "Chocolate Misto", p: 15.00, d: "Chocolate ao leite com branco" },
    { n: "Banoffe", p: 15.00, d: "Banana, doce de leite e bolacha (empanado com açúcar e canela)" },
    { n: "Banana com Chocolate", p: 16.00, d: "Banana com chocolate preto" }
  ],
  porcoes: [
    { n: "Mini Pastéis de Carne", p: 25.00, d: "20 unidades com carne moída" },
    { n: "Mini Pastéis de Queijo", p: 25.00, d: "20 unidades com queijo mussarela" },
    { n: "Porção Mista", p: 25.00, d: "10 mini de queijo + 10 mini de carne" }
  ],
  bebidas: [
    { n: "Coca-Cola Lata 350ml", p: 6.00, d: "Gelada" },
    { n: "Coca-Cola 600ml", p: 9.00, d: "Original" },
    { n: "Guaraná Antártica 2L", p: 16.00, d: "Tamanho família" }
  ]
};

let categoriaAtiva = "mais_pedidos";
let itensNoCarrinho = [];
let valorTotalProdutos = 0;
let valorTaxaEntrega = 0;
let modalidadePedido = "retirar";

function selecionar(cat) {
  categoriaAtiva = cat;
  document.querySelectorAll(".btn-nav").forEach(b => b.classList.remove("active"));
  document.getElementById("btn-" + cat).classList.add("active");
  renderizarCardapio();
}

function renderizarCardapio() {
  const container = document.getElementById("sabores");
  container.innerHTML = "";
  cardapio[categoriaAtiva].forEach(item => {
    container.innerHTML += `
      <div class="item-card">
        <h3>${item.n}</h3>
        <p>${item.d}</p>
        <span class="preco">R$ ${item.p.toFixed(2)}</span>
        <button class="btn-add" onclick="adicionarAoCarrinho('${item.n}', ${item.p})">ADICIONAR</button>
      </div>`;
  });
}

function adicionarAoCarrinho(nome, preco) {
  itensNoCarrinho.push({ nome, preco });
  valorTotalProdutos += preco;
  atualizarCarrinhoUI();
  alerta("Pedido", `${nome} adicionado!`);
}

function atualizarCarrinhoUI() {
  document.getElementById("cart-count").innerText = itensNoCarrinho.length;
  const textoResumo = itensNoCarrinho.map(i => `• ${i.nome} - R$ ${i.preco.toFixed(2)}`).join('\n');
  document.getElementById("pedido").value = textoResumo;
  atualizarSomaTotal();
}

function atualizarSomaTotal() {
  const totalGeral = valorTotalProdutos + valorTaxaEntrega;
  document.getElementById("total-valor").innerText = totalGeral.toFixed(2);
}

function mostrarDados(tipo) {
  modalidadePedido = tipo;
  document.getElementById("entregaCampos").style.display = tipo === "delivery" ? "block" : "none";
  document.getElementById("btn-retirar").classList.toggle("active", tipo === "retirar");
  document.getElementById("btn-delivery").classList.toggle("active", tipo === "delivery");
  if (tipo === "retirar") {
    valorTaxaEntrega = 0;
    document.getElementById("bairro").value = "0";
  }
  atualizarSomaTotal();
}

function atualizarFrete() {
  const select = document.getElementById("bairro");
  valorTaxaEntrega = parseFloat(select.value) || 0;
  atualizarSomaTotal();
}

function enviarPedido() {
  if (itensNoCarrinho.length === 0) return alerta("Atenção", "O carrinho está vazio!");
  const obs = document.getElementById("obs").value;
  const pag = document.getElementById("pagamento").value;
  const total = valorTotalProdutos + valorTaxaEntrega;
  
  let msg = `*PASTELARIA PONTO X - PEDIDO*\n\n`;
  msg += `*ITENS:*\n${document.getElementById("pedido").value}\n\n`;
  if(obs) msg += `*OBS:* ${obs}\n`;
  msg += `*TOTAL:* R$ ${total.toFixed(2)}\n`;
  msg += `*PAGAMENTO:* ${pag}\n`;

  if(modalidadePedido === "delivery") {
    const end = document.getElementById("endereco").value;
    const bairro = document.getElementById("bairro").options[document.getElementById("bairro").selectedIndex].text;
    msg += `*ENTREGA:* ${end}\n*BAIRRO:* ${bairro}`;
  } else {
    msg += `*RETIRADA NO LOCAL*`;
  }

  window.open(`https://wa.me/5511920672544?text=${encodeURIComponent(msg)}`);
}

function alerta(t, m) {
  document.getElementById("alert-title").innerText = t;
  document.getElementById("alert-msg").innerText = m;
  document.getElementById("custom-alert-overlay").style.display = "flex";
}

function fecharAlerta() {
  document.getElementById("custom-alert-overlay").style.display = "none";
}

function editarPedido() {
  itensNoCarrinho = [];
  valorTotalProdutos = 0;
  valorTaxaEntrega = 0;
  document.getElementById("obs").value = "";
  atualizarCarrinhoUI();
}

function toggleCarrinho() {
  document.getElementById("carrinho").classList.toggle("open");
}

selecionar("mais_pedidos");
