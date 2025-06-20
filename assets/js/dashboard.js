
function salvarConfig(index) {
  const valor = document.getElementById("input-" + index).value;
  localStorage.setItem("config-" + index, valor);
  alert("Configuração " + index + " salva!");
}
