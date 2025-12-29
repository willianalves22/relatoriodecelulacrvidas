const form = document.getElementById("celula-form");
const button = form.querySelector("button");
const modal = document.getElementById("modal");
const resumoDiv = document.getElementById("resumo");

let dadosGlobais = {};

// ===============================
// CÁLCULOS AUTOMÁTICOS
// ===============================
function soma(campos, destino) {
  let total = 0;
  campos.forEach((campo) => {
    total += Number(form.querySelector(`[name="${campo}"]`).value || 0);
  });

  if (destino === "totalOferta") {
    form.querySelector(`[name="${destino}"]`).value = total.toFixed(2);
  } else {
    form.querySelector(`[name="${destino}"]`).value = total;
  }
}

form.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    soma(
      ["membrosPresentes", "convidadosPresentes", "criancas"],
      "totalPresentes"
    );
    soma(["ofertaDinheiro", "ofertaPix"], "totalOferta");
  });
});

// ===============================
// SUBMIT → MOSTRA MODAL
// ===============================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let valido = true;

  form.querySelectorAll("input[required]").forEach((campo) => {
    campo.classList.remove("border-red-500");
    if (!campo.value) {
      campo.classList.add("border-red-500");
      valido = false;
    }
  });

  if (!valido) {
    alert("⚠️ Preencha TODOS os campos obrigatórios.");
    return;
  }

  dadosGlobais = Object.fromEntries(new FormData(form));

  const labels = {
    lider: "Líder",
    nomeCelula: "Nome da Célula",
    dataReuniao: "Data da Reunião",
    membrosPresentes: "Membros Presentes",
    convidadosPresentes: "Convidados Presentes",
    criancas: "Crianças (0 a 12)",
    totalPresentes: "Total Presentes",
    membrosEfetivos: "Membros Efetivos",
    membrosDiscipulados: "Membros Discipulados",
    cursoStartRestart: "Curso START / RESTART",
    cursoCrescendo: "Curso Crescendo na Fé / Unção",
    cursoAguia1: "Academia das Águias 1",
    cursoAguia2: "Academia das Águias 2",
    cursoSupervisores: "Curso de Supervisores",
    cursoFormacaoPastoral: "Formação Pastoral",
    cultoCelebracao: "Culto de Celebração",
    rhema: "Rhema",
    corArea: "Cor da Área",
    supervisor: "Supervisor",
    ofertaDinheiro: "Oferta em Dinheiro",
    ofertaPix: "Oferta via Pix",
    totalOferta: "Total da Oferta",
  };

  resumoDiv.innerHTML = Object.entries(dadosGlobais)
    .map(([k, v]) => `<p><b>${labels[k] || k}:</b> ${v}</p>`)
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
// CONFIRMAR ENVIO (SIMULADO)
// ===============================
function confirmarEnvio() {
  button.disabled = true;
  button.textContent = "Enviando...";

  // Simula envio
  setTimeout(() => {
    resumoDiv.innerHTML = `
      <h2 class="text-xl font-bold text-center text-green-600">
        ✅ Relatório enviado com sucesso!
      </h2>
    `;

    // SOMENTE AQUI a página é atualizada
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }, 800);
}
