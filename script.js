const form = document.getElementById("celula-form");
const modal = document.getElementById("modal");
const resumoDiv = document.getElementById("resumo");
const button = form.querySelector("button");

let dadosGlobais = {};

// ===============================
// CÁLCULOS AUTOMÁTICOS
// ===============================
function soma(campos, destino) {
  let total = 0;
  campos.forEach((campo) => {
    total += Number(form[campo].value || 0);
  });

  if (destino === "totalOferta") {
    form[destino].value = total.toFixed(2);
  } else {
    form[destino].value = total;
  }
}

form.querySelectorAll("input").forEach(() => {
  form.addEventListener("input", () => {
    soma(
      ["membrosPresentes", "convidadosPresentes", "criancas"],
      "totalPresentes"
    );
    soma(["ofertaDinheiro", "ofertaPix"], "totalOferta");
  });
});

// ===============================
// SUBMIT → MODAL
// ===============================
form.addEventListener("submit", (e) => {
  e.preventDefault();

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
}

// ===============================
// ENVIO REAL PARA GOOGLE APPS SCRIPT
// ===============================
async function confirmarEnvio() {
  button.disabled = true;
  button.textContent = "Enviando...";

  try {
    const response = await fetch("COLE_AQUI_A_URL_DO_WEB_APP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosGlobais),
    });

    if (response.ok) {
      resumoDiv.innerHTML =
        "<h2 class='text-green-600 font-bold text-center'>✅ Enviado com sucesso</h2>";
      setTimeout(() => location.reload(), 1500);
    } else {
      alert("Erro ao enviar");
    }
  } catch (e) {
    alert("Erro de conexão");
  }
}
