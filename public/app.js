function formatarTarefa(t) {
  return (t.concluida ? '✔ ' : '') + t.titulo;
}

function renderizarLista(tarefas, ul) {
  ul.innerHTML = '';
  tarefas.forEach((t) => {
    const li = document.createElement('li');
    li.textContent = formatarTarefa(t);
    ul.appendChild(li);
  });
}

async function carregar() {
  const res = await fetch('/api/tarefas');
  renderizarLista(await res.json(), document.getElementById('lista'));
}

if (typeof document !== 'undefined' && document.getElementById('btn-add')) {
  document.getElementById('btn-add').addEventListener('click', async () => {
    const input = document.getElementById('titulo');
    await fetch('/api/tarefas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: input.value }),
    });
    input.value = '';
    carregar();
  });
  carregar();
}

if (typeof module !== 'undefined') {
  module.exports = { formatarTarefa, renderizarLista };
}