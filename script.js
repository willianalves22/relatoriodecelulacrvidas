// ===============================
// ELEMENTOS PRINCIPAIS
// ===============================
const form = document.getElementById("celula-form");
const button = form.querySelector("button");
const modal = document.getElementById("modal");
const resumoDiv = document.getElementById("resumo");

let dadosGlobais = {};

// ===============================
// FUNÇÃO DE SOMA AUTOMÁTICA
// ===============================
function soma(campos, destino) {
  let total = 0;

  campos.forEach((campo) => {
    const valor = form.querySelector(`[name="${campo}"]`).value;
    total += Number(valor || 0);
  });

  if (destino === "totalOferta") {
    form.querySelector(`[name="${destino}"]`).value = total.toFixed(2);
  } else {
    form.querySelector(`[name="${destino}"]`).value = total;
  }
}

// ===============================
// EVENTOS DE INPUT (CÁLCULOS)
// ===============================
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
// SUBMIT DO FORM → ABRE MODAL
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

  // Coleta dados do formulário
  dadosGlobais = Object.fromEntries(new FormData(form));

  // Labels para o resumo
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

  // Monta resumo
  resumoDiv.innerHTML = Object.entries(dadosGlobais)
    .map(([chave, valor]) => {
      return `<p><b>${labels[chave] || chave}:</b> ${valor}</p>`;
    })
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
// CONFIRMAR ENVIO → ENVIO REAL
// ===============================
async function confirmarEnvio() {
  button.disabled = true;
  button.textContent = "Enviando...";

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbw0nrpxdre0wiwNMtsep4gO-wKQFomR9mMR6OJcwXcDmJ4aIZprplz4IoVI6e03Pk-y/exec",
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosGlobais),
      }
    );

    if (response.ok) {
      resumoDiv.innerHTML = `
        <h2 class="text-xl font-bold text-center text-green-600">
          ✅ Relatório enviado com sucesso!
        </h2>
      `;

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      alert("Erro ao enviar o relatório.");
      button.disabled = false;
      button.textContent = "Confirmar";
    }
  } catch (error) {
    console.error("Erro no envio:", error);
    alert("Erro de conexão. Verifique sua internet.");
    button.disabled = false;
    button.textContent = "Confirmar";
  }
}
