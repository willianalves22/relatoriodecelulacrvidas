const form = document.getElementById("celula-form");
const button = form.querySelector("button");
const modal = document.getElementById("modal");
const resumoDiv = document.getElementById("resumo");

let dadosGlobais = {};

// Cálculos automáticos para totais
function soma(campos, destino) {
  let total = 0;
  campos.forEach(c => {
    total += Number(form.querySelector(`[name="${c}"]`).value || 0);
  });
  form.querySelector(`[name="${destino}"]`).value = total;
}

form.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", () => {
    soma(["membrosPresentes", "convidadosPresentes", "criancas"], "totalPresentes");
    soma(["ofertaDinheiro", "ofertaPix"], "totalOferta");
  });
});

// Ao clicar em enviar, mostrar resumo para confirmação
form.addEventListener("submit", e => {
  e.preventDefault();

  // Validação visual
  let valido = true;
  form.querySelectorAll("input[required]").forEach(campo => {
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

  // Montar resumo (exibe label amigável)
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
    totalOferta: "Total da Oferta"
  };

  resumoDiv.innerHTML = Object.entries(dadosGlobais)
    .map(([k, v]) => `<p><b>${labels[k] || k}:</b> ${v}</p>`)
    .join("");

  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

// Fechar modal e voltar para o formulário
function fecharModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Confirmar envio - envia para Apps Script, exibe sucesso e links PDF/WhatsApp
async function confirmarEnvio() {
  button.disabled = true;
  button.textContent = "Enviando...";

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyO81fGbtnytY3RqHtJxAzFWy4D-foacOu75gWUYyJfsQ9fvHcTc7LfmUvuC1KQ4OA/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosGlobais)
      }
    );

    if (!response.ok) throw new Error("Erro ao enviar");

    const json = await response.json();

    if (json.status === "ok") {
      resumoDiv.innerHTML = `
        <h2 class="text-xl font-bold mb-4">✅ Relatório enviado com sucesso!</h2>
        <a href="${json.pdf}" target="_blank" class="block bg-orange-500 text-white py-2 rounded mb-2 text-center">
          📄 Baixar PDF
        </a>
        <a href="https://wa.me/?text=${encodeURIComponent(json.pdf)}" target="_blank" class="block bg-green-500 text-white py-2 rounded text-center">
          📲 Enviar no WhatsApp
        </a>
      `;
      button.textContent = "Enviar Relatório";
      button.disabled = false;
    } else {
      alert("Erro no envio: " + (json.msg || "Tente novamente"));
      fecharModal();
      button.textContent = "Enviar Relatório";
      button.disabled = false;
    }
  } catch (error) {
    alert("Erro de conexão. Tente novamente.");
    fecharModal();
    button.textContent = "Enviar Relatório";
    button.disabled = false;
  }
}
