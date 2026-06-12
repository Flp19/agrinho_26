/* ============================================================
   AGROCODE
   SISTEMA PRINCIPAL
   ============================================================ */

/* ============================================================
   BANCO DE USUÁRIOS
   ============================================================ */

const bancoDeUsuarios = [
  {
    nome: "Felipe",
    email: "felipe.mauricio@escola.pr.gov.br",
    senha: "felipe2026"
  },
  {
    nome: "Agrinho",
    email: "agrinho@escola.pr.gov.br",
    senha: "Agr_2026"
  },
  {
    nome: "Aleatório",
    email: "aleatorio@escola.pr.gov.br",
    senha: "Agr2026"
  },
  {
    nome: "ProfJu",
    email: "juliana@escola.pr.gov.br",
    senha: "agrinho"
  },
  {
    nome: "felipe",
    email: "felipe",
    senha: "felipe"
  }
];

/* ============================================================
   FUNÇÕES AUXILIARES
   ============================================================ */

function $(id) {
  return document.getElementById(id);
}

/* ============================================================
   LOGIN
   ============================================================ */

function fazerLogin() {

  const email = $("email").value.trim();
  const senha = $("senha").value;

  const usuario = bancoDeUsuarios.find(user =>
    user.email === email &&
    user.senha === senha
  );

  if (!usuario) {

    $("erro-login").innerText =
      "⚠️ E-mail ou senha incorretos!";

    const box = document.querySelector(".box-login");

    box.classList.remove("shake");
    void box.offsetWidth;
    box.classList.add("shake");

    $("senha").value = "";
    return;
  }

  $("sidebar").style.display = "flex";
  $("nome-visitante").innerText = usuario.nome;

  abrir("home");
}

function logout() {

  $("sidebar").style.display = "none";

  $("email").value = "";
  $("senha").value = "";

  abrir("login");
}

function toggleSenha() {

  const campo = $("senha");
  const olho = $("olhinho");

  if (campo.type === "password") {
    campo.type = "text";
    olho.innerText = "🔒";
  } else {
    campo.type = "password";
    olho.innerText = "👁️";
  }
}

/* ============================================================
   SIDEBAR
   ============================================================ */

function toggleSidebar() {

  const sidebar = $("sidebar");

  sidebar.classList.toggle("sidebar-fechada");
  sidebar.classList.toggle("sidebar-aberta");
}

/* ============================================================
   NAVEGAÇÃO ENTRE TELAS
   ============================================================ */

function abrir(id) {

  document
    .querySelectorAll(".slide")
    .forEach(secao => secao.classList.remove("ativo"));

  $(id).classList.add("ativo");

  if (id === "relatorio-final") {
    atualizarRelatorio();
  }
}

function voltar() {
  abrir("home");
}

/* ============================================================
   HOME → RELATÓRIO
   ============================================================ */

function atualizarRelatorio() {

  const n = $("val-n").innerText;
  const p = $("val-p").innerText;
  const k = $("val-k").innerText;
  const ph = $("val-ph").innerText;

  $("res-solo").innerText =
    `PH: ${ph} | NPK: ${n}/${p}/${k}`;

  $("res-drone").innerText =
    `${$("val-sinal").innerText} Sinal | ${$("val-bateria").innerText} Bat`;

  const statusSistema =
    document.querySelectorAll(".valor-status")[1];

  if (statusSistema) {
    $("res-irrig").innerText =
      statusSistema.innerText;
  }

  $("res-ia").innerText =
    $("ia-decisao").innerText || "Não Simulado";
}

/* ============================================================
   ANÁLISE DE SOLO
   ============================================================ */

function gerarNovaAnalise() {

  const n = Math.floor(Math.random() * 100);
  const p = Math.floor(Math.random() * 100);
  const k = Math.floor(Math.random() * 100);

  const ph =
    (5.5 + Math.random() * 2).toFixed(1);

  $("barra-n").style.width = n + "%";
  $("barra-p").style.width = p + "%";
  $("barra-k").style.width = k + "%";

  $("val-n").innerText = n + "%";
  $("val-p").innerText = p + "%";
  $("val-k").innerText = k + "%";

  $("val-ph").innerText = ph;

  let diagnostico = "";

  if (ph < 6) {
    diagnostico =
      "Solo ácido. Recomenda-se realizar calagem.";
  }
  else if (n < 40) {
    diagnostico =
      "Nitrogênio abaixo do ideal. Aplicar reforço NPK.";
  }
  else {
    diagnostico =
      "Solo em excelentes condições para plantio.";
  }

  $("texto-diagnostico").innerText =
    diagnostico;
}

/* ============================================================
   TELEMETRIA DO DRONE
   ============================================================ */

function atualizarDadosDrone() {

  const sinal = $("val-sinal");
  const bateria = $("val-bateria");
  const temp = $("val-temp");

  if (!sinal) return;

  const novoSinal =
    94 + Math.floor(Math.random() * 6);

  sinal.innerText = `${novoSinal}%`;

  const novaTemp =
    (23 + Math.random() * 3).toFixed(1);

  temp.innerText = `${novaTemp} ºC`;

  let nivelBateria =
    parseInt(bateria.innerText);

  if (Math.random() > 0.8 && nivelBateria > 5) {

    nivelBateria--;

    bateria.innerText =
      `${nivelBateria}%`;
  }
}

setInterval(atualizarDadosDrone, 3000);

/* ============================================================
   ANIMAÇÃO DO DRONE
   ============================================================ */

document.addEventListener("mousemove", e => {

  const drone =
    document.querySelector(".drone-voando");

  const secao =
    $("drones");

  if (!drone || !secao.classList.contains("ativo"))
    return;

  const x =
    (window.innerWidth / 2 - e.pageX) / 40;

  const y =
    (window.innerHeight / 2 - e.pageY) / 40;

  drone.style.transform =
    `rotateY(${-x}deg)
     rotateX(${y}deg)
     translateY(${y}px)`;
});

/* ============================================================
   IRRIGAÇÃO INTELIGENTE
   ============================================================ */

function Smart() {

  const status = $("status-smart");
  const botao =
    document.querySelector(".btn-smart-irrigacao");

  const campos =
    document.querySelectorAll(".valor-status");

  status.style.display = "block";

  status.innerHTML =
    "🔄 <strong>AGROCODE AI:</strong> Analisando sensores...";

  botao.disabled = true;
  botao.innerText = "⏳ PROCESSANDO...";

  setTimeout(() => {

    status.innerHTML =
      "✅ <strong>SISTEMA ATIVO:</strong> Umidade detectada. Iniciando irrigação.";

    status.classList.add("visivel");

    campos[1].innerText =
      "ATIVO / IRRIGANDO";

    campos[1].classList.add("status-irrigando");

    campos[2].innerText =
      "EM 12 HORAS";

    botao.innerText =
      "SISTEMA EM OPERAÇÃO";

  }, 2500);
}

/* ============================================================
   SIMULAÇÃO DE CONSUMO
   ============================================================ */

function simularIA() {

  const umidade =
    Number($("umidade").value);

  if (isNaN(umidade)) {
    alert("Informe a umidade.");
    return;
  }

  const economia = umidade;
  const consumo = 100 - umidade;

  $("status-agua").innerText =
    "✅ Analisado";

  $("resultado-agua").innerHTML =
    `🌿 Economia: ${economia}%<br>
     📊 Uso Smart: ${consumo}%`;
}

/* ============================================================
   CÁLCULO DE VAZÃO
   ============================================================ */

function simularIrrigacaoIA() {

  const umidade =
    Number($("umidade2").value);

  if (isNaN(umidade)) {
    alert("Informe a umidade.");
    return;
  }

  const volumeBase = 100000;

  const volume =
    volumeBase *
    ((100 - umidade) / 100);

  $("status-vazao").innerText =
    "💧 Calculado";

  $("resultado-vazao").innerHTML =
    `${volume.toLocaleString()} L/ha`;
}

/* ============================================================
   AGROCODE AI
   ============================================================ */

function executarAgroIA() {

  const umidade =
    parseInt($("inputUmidade").value);

  const chuva =
    parseInt($("inputChuva").value);

  const status =
    $("ia-status");

  const decisao =
    $("ia-decisao");

  if (
    isNaN(umidade) ||
    isNaN(chuva)
  ) {
    alert("Preencha todos os dados.");
    return;
  }

  status.innerText =
    "🔄 Analisando cenário...";

  setTimeout(() => {

    let resposta = "";

    if (chuva > 80) {

      resposta =
        "🌧️ SUSPENDER IRRIGAÇÃO - Chuva intensa prevista.";

    }
    else if (umidade < 30) {

      resposta =
        "💧 IRRIGAÇÃO MÁXIMA - Solo crítico.";

    }
    else {

      resposta =
        "🌱 ECONOMIA ATIVA - Umidade adequada.";

    }

    status.innerText =
      "✅ Análise concluída";

    decisao.innerText =
      resposta;

  }, 2000);
}

/* ============================================================
   RELATÓRIO FINAL
   ============================================================ */

function enviarRelatorioManual() {

  const botao =
    document.querySelector(".box-envio-final button");

  const usuario =
    $("nome-visitante").innerText;

  botao.disabled = true;
  botao.innerText =
    "⏳ Enviando Relatório...";

  const relatorio = `
=============================
RELATÓRIO AGROCODE
=============================

OPERADOR:
${usuario}

SINAL:
${$("val-sinal").innerText}

BATERIA:
${$("val-bateria").innerText}

PH:
${$("val-ph").innerText}

NPK:
${$("val-n").innerText}
${$("val-p").innerText}
${$("val-k").innerText}

IA:
${$("ia-decisao").innerText}
`;

  setTimeout(() => {

    console.log(relatorio);

    botao.innerText =
      "✅ Relatório Enviado";

    botao.style.background =
      "#4caf50";

    setTimeout(() => {

      botao.innerText =
        "Despachar Relatório";

      botao.style.background =
        "#2e7d32";

      botao.disabled = false;

    }, 3000);

  }, 2500);
}

/* ============================================================
   EFEITOS SONOROS
   ============================================================ */

window.addEventListener("mouseover", e => {

  const card =
    e.target.closest(".guia-card");

  const sidebar =
    e.target.closest(".links-sidebar div");

  const botao =
    e.target.tagName === "BUTTON";

  if (card || sidebar || botao) {
    tocarBip();
  }
});

function tocarBip() {

  const som =
    $("som-bip");

  if (!som) return;

  som.currentTime = 0;
  som.volume = 0.15;

  som.play().catch(() => { });
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

window.addEventListener("load", () => {

  console.log(
    "🌱 AgroCode iniciado com sucesso!"
  );

});

/* ============================================================
   SISTEMA DE ACESSIBILIDADE VIA JAVASCRIPT PURO
   ============================================================ */

let escalaFonteGlobal = 100; 

function mudarFonte(direcao) {
  if (direcao === 1 && escalaFonteGlobal < 135) {
    escalaFonteGlobal += 5; // Aumenta de 5 em 5%
  } else if (direcao === -1 && escalaFonteGlobal > 80) {
    escalaFonteGlobal -= 5; // Diminui de 5 em 5%
  }

    document.documentElement.style.setProperty('font-size', escalaFonteGlobal + '%', 'important');
  
  console.log("Escala de texto ajustada para:", escalaFonteGlobal + "%");
}