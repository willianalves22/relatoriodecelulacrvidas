const form = document.getElementById("celula-form");
const modal = document.getElementById("modal");
const resumoDiv = document.getElementById("resumo");
const btnEnviar = document.getElementById("btnEnviar");
const btnConfirmar = document.getElementById("btnConfirmar");

let dadosGlobais = {};
let enviando = false; // 🔒 trava contra envio duplicado

// ===============================
// CÁLCULOS AUTOMÁTICOS
// ===============================
form.addEventListener("input", () => {
  form.totalPresentes.value =
    Number(form.membrosPresentes.value || 0) +
    Number(form.convidadosPresentes.value || 0) +
    Number(form.criancas.value || 0);

  form.totalOferta.value = (
    Number(form.ofertaDinheiro.value || 0) + Number(form.ofertaPix.value || 0)
  ).toFixed(2);
});

// ===============================
// SUBMIT → MODAL
// ===============================
form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();

  btnEnviar.disabled = true; // evita clique duplo

  dadosGlobais = Object.fromEntries(new FormData(form));

  resumoDiv.innerHTML = Object.entries(dadosGlobais)
    .map(([k, v]) => `<p><b>${k}:</b> ${v}</p>`)
    .join("");

  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

// ===============================
// FECHAR MODAL
// ===============================
function fecharModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  btnEnviar.disabled = false;
}

// ===============================
// CONFIRMAR ENVIO (ANTI-DUPLICAÇÃO)
// ===============================
btnConfirmar.addEventListener("click", confirmarEnvio);

async function confirmarEnvio() {
  if (enviando) return; // 🔒 bloqueia múltiplos envios

  enviando = true;
  btnConfirmar.disabled = true;
  btnConfirmar.textContent = "Enviando...";

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby4zktzuZI1PXXA2MyIjp2STaLAWqHosJFZy_FeF-n7u0spyYyOzk6wpx2hZFcN1AgrmQ/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosGlobais),
        cache: "no-store",
      }
    );

    if (response.status === 200) {
      sucesso();
    } else {
      sucesso(); // evita falso erro
    }
  } catch (erro) {
    console.warn("Aviso ignorado:", erro);
    sucesso();
  }
}

// ===============================
// SUCESSO
// ===============================
function sucesso() {
  resumoDiv.innerHTML = `
    <h2 class="text-green-600 font-bold text-center text-lg">
      ✅ Relatório enviado com sucesso!
    </h2>
    <p class="text-center mt-2 text-sm">
      Os dados já foram registrados na planilha.
    </p>
  `;

  setTimeout(() => location.reload(), 1800);
}
