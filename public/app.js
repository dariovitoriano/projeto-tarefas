function formatarTarefa(t) {
  return (t.concluida ? '✔ ' : '') + t.titulo;
}

function renderizarLista(tarefas, ul, aoConcluir) {
  ul.innerHTML = '';
  if (tarefas.length === 0) {
    const vazio = document.createElement('li');
    vazio.textContent = 'Nenhuma tarefa cadastrada';
    ul.appendChild(vazio);
    return;
  }
  tarefas.forEach((t) => {
    const li = document.createElement('li');
    li.textContent = formatarTarefa(t);
    if (!t.concluida && aoConcluir) {
      const btn = document.createElement('button');
      btn.textContent = 'Concluir';
      btn.addEventListener('click', () => aoConcluir(t.id));
      li.appendChild(btn);
    }
    ul.appendChild(li);
  });
}

async function carregar() {
  const res = await fetch('/api/tarefas');
  renderizarLista(await res.json(), document.getElementById('lista'), concluirTarefa);
}

async function concluirTarefa(id) {
  await fetch(`/api/tarefas/${id}/concluir`, { method: 'PATCH' });
  await carregar();
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
  module.exports = { formatarTarefa, renderizarLista, carregar };
}
