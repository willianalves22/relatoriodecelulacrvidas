const form = document.getElementById("celula-form");
const modal = document.getElementById("modal");
const resumoDiv = document.getElementById("resumo");
const button = form.querySelector("button");

let dadosGlobais = {};

// Cálculos automáticos
form.addEventListener("input", () => {
  form.totalPresentes.value =
    Number(form.membrosPresentes.value || 0) +
    Number(form.convidadosPresentes.value || 0) +
    Number(form.criancas.value || 0);

  form.totalOferta.value = (
    Number(form.ofertaDinheiro.value || 0) + Number(form.ofertaPix.value || 0)
  ).toFixed(2);
});

// Submit → modal
form.addEventListener("submit", (e) => {
  e.preventDefault();
  dadosGlobais = Object.fromEntries(new FormData(form));

  resumoDiv.innerHTML = Object.entries(dadosGlobais)
    .map(([k, v]) => `<p><b>${k}:</b> ${v}</p>`)
    .join("");

  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

// Fechar modal
function fecharModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Envio real
async function confirmarEnvio() {
  button.disabled = true;
  button.textContent = "Enviando...";

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxU2ByPgmmQf6WJDJjwE1QMQfCQCdXdddozm5M99puMA8Q2EMKkOTydIxHKw8XGmlc1Bg/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosGlobais),
      }
    );

    if (response.ok) {
      resumoDiv.innerHTML =
        "<h2 class='text-green-600 font-bold text-center'>✅ Relatório enviado com sucesso</h2>";
      setTimeout(() => location.reload(), 1500);
    } else {
      alert("Erro ao enviar");
    }
  } catch {
    alert("Erro de conexão");
  }
}
