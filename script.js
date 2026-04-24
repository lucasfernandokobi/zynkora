let modo = "loja";

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
let codigoGerado = "";
let usuario = null;

/* 🔥 CORREÇÃO DO LOGIN PADRÃO */
if(!usuarios["lucaskobi30@gmail.com"]){
    usuarios["lucaskobi30@gmail.com"] = "Lucas@1927";
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

let listaProdutos = [];
let carrinho = [];

function abrirModal(){
    document.getElementById("modal").style.display = "flex";
}

function fecharModal(){
    document.getElementById("modal").style.display = "none";
}

function salvar(){
    let nome = document.getElementById("nome").value;
    let preco = parseFloat(document.getElementById("preco").value);
    let descricao = document.getElementById("descricao").value;
    let file = document.getElementById("imagensInput").files[0];

    if(!nome || !preco){
        alert("Preencha nome e preço");
        return;
    }

    if(file){
        let reader = new FileReader();

        reader.onload = function(e){
            listaProdutos.push({
                nome,
                preco,
                descricao,
                imagens: [e.target.result]
            });

            fecharModal();
            carregar();
        }

        reader.readAsDataURL(file);

    } else {
        listaProdutos.push({
            nome,
            preco,
            descricao,
            imagens: []
        });

        fecharModal();
        carregar();
    }
}

/* LOGIN */
function loginInicial(){
    let email = document.getElementById("emailInicial").value;
    let senha = document.getElementById("senhaInicial").value;

    if(usuarios[email] && usuarios[email] === senha){
        usuario = email;
        entrarSistema();
    } else {
        alert("Email ou senha inválidos");
    }
}

function cadastroInicial(){
    codigoGerado = Math.floor(100000 + Math.random() * 900000);
    document.getElementById("codigoArea").innerHTML = "Código: " + codigoGerado;
}

function validarCodigoInicial(){
    let email = document.getElementById("emailInicial").value;
    let senha = document.getElementById("senhaInicial").value;

    if(document.getElementById("codigoInput").value == codigoGerado){
        usuarios[email] = senha;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        usuario = email;
        entrarSistema();
    } else {
        alert("Código incorreto");
    }
}

/* LOGIN OK */
function entrarSistema(){
    let tela = document.getElementById("telaInicial");

    if(tela){
        tela.classList.add("oculto");
    }

    if(usuario === "lucaskobi30@gmail.com"){
        document.getElementById("btnPainel").style.display = "block";
    }

    modoLoja();
}

/* MENU */
function toggleMenu(){
    let d = document.getElementById("dropdown");
    d.style.display = d.style.display === "flex" ? "none" : "flex";
}

function modoLoja(){
    modo = "loja";

    btnAdd.style.display = "none";

    btnAdd.style.bottom = "30px";
    btnAdd.style.right = "30px";
    btnAdd.style.transform = "none";

    carregar();
}

function modoPainel(){
    modo = "painel";

    btnAdd.style.display = "flex";

    btnAdd.style.bottom = "30px";
    btnAdd.style.right = "30px";
    btnAdd.style.transform = "none";

    carregar();
}

/* PRODUTOS */
function carregar(){
    let produtos = document.getElementById("produtos");
    produtos.innerHTML = "";

    listaProdutos.forEach((p,i)=>{
        produtos.innerHTML += `
        <div class="produto">
            ${p.imagens ? p.imagens.map(img=>`<img src="${img}">`).join("") : ""}
            <h3>${p.nome}</h3>
            <p>${p.descricao}</p>
            <strong>R$ ${p.preco}</strong><br><br>
            ${modo === "painel"
                ? `<button onclick="excluirProduto(${i})">Excluir</button>`
                : `<button onclick="addCarrinho(${i})">Adicionar</button>`}
        </div>`;
    });
}

function excluirProduto(i){
    listaProdutos.splice(i,1);
    carregar();
}

/* CARRINHO */
function addCarrinho(i){
    carrinho.push(listaProdutos[i]);
    document.getElementById("qtd").innerText = carrinho.length;
}

function finalizarCompra(){
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    window.location.href = "checkout.html";
}


/* 🔥 NOVA FUNÇÃO */
function removerCarrinho(i){
    carrinho.splice(i,1);
    document.getElementById("qtd").innerText = carrinho.length;
    abrirCarrinho(); // atualiza visual
}

function abrirCarrinho(){
    let box = document.getElementById("carrinhoBox");
    box.style.display = "block";

    let total = 0;

    let html = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0;">🛒 Carrinho</h3>
        <span onclick="fecharCarrinho()" style="cursor:pointer; font-size:20px;">✖</span>
    </div>
    <hr>
    `;

    if(carrinho.length === 0){
        html += "<p>Seu carrinho está vazio</p>";
    }

    carrinho.forEach((p,i)=>{
        total += p.preco;

        html += `
        <div style="
            background:#1a0838;
            padding:10px;
            border-radius:10px;
            margin-bottom:10px;
            display:flex;
            justify-content:space-between;
            align-items:center;
        ">
            <div>
                <strong>${p.nome}</strong><br>
                <span>R$ ${p.preco}</span>
            </div>
            <button onclick="removerCarrinho(${i})" style="
                background:red;
                border:none;
                color:white;
                padding:5px 8px;
                border-radius:5px;
                cursor:pointer;
            ">❌</button>
        </div>
        `;
    });

    html += `
    <hr>
    <h3>Total: R$ ${total.toFixed(2)}</h3>

    <button style="width:100%;" onclick="finalizarCompra()">
        Finalizar Compra
    </button>
    `;

    box.innerHTML = html;
}

function fecharCarrinho(){
    document.getElementById("carrinhoBox").style.display = "none";
}

/* DEBUG */
window.onload = function(){
    console.log("Sistema carregado corretamente");
}