const form = document.getElementById("celula-form");
const button = form.querySelector("button");

// 🔢 Cálculos automáticos
function soma(campos, destino) {
  let total = 0;
  campos.forEach(c => {
    total += Number(document.querySelector(`[name="${c}"]`).value || 0);
  });
  document.querySelector(`[name="${destino}"]`).value = total;
}

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", () => {
    soma(["membrosPresentes", "convidadosPresentes", "criancas"], "totalPresentes");
    soma(["ofertaDinheiro", "ofertaPix"], "totalOferta");
  });
});

// 📤 Envio do formulário
form.addEventListener("submit", async e => {
  e.preventDefault();

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

  button.disabled = true;
  button.textContent = "Enviando...";

  const data = Object.fromEntries(new FormData(form));

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxxVQEEyqegOoML7jIALQPu1Zu6tRAWecgmMEzdTcs1qWkgIrmP1QH3AjJhmhbsEzsK/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }
    );

    if (response.ok) {
      document.getElementById("mensagem-sucesso").classList.remove("hidden");
      form.reset();
    } else {
      alert("Erro ao enviar o relatório.");
    }

  } catch {
    alert("Erro de conexão com a internet.");
  }

  button.disabled = false;
  button.textContent = "Enviar Relatório";
});

function validarLogin(lider, senha) {
  const sheet = SpreadsheetApp.getActive()
    .getSheetByName("Usuarios");

  const dados = sheet.getDataRange().getValues();

  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === lider && dados[i][1] === senha) {
      return true;
    }
  }
  return false;
}
