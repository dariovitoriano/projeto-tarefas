function formatarTarefa(t) {
  return (t.concluida ? '✔ ' : '') + t.titulo;
}

function filtrarTarefas(tarefas, filtro) {
  if (filtro === 'pendentes') return tarefas.filter((t) => !t.concluida);
  if (filtro === 'concluidas') return tarefas.filter((t) => t.concluida);
  return tarefas;
}

function contarPendentes(tarefas) {
  return tarefas.filter((t) => !t.concluida).length;
}

function textoContador(tarefas) {
  if (tarefas.length === 0) return 'Nenhuma tarefa';
  const n = contarPendentes(tarefas);
  return n === 1 ? '1 tarefa pendente' : `${n} tarefas pendentes`;
}

function renderizarLista(tarefas, ul, acoes = {}) {
  ul.innerHTML = '';
  if (tarefas.length === 0) {
    const vazio = document.createElement('li');
    vazio.textContent = 'Nenhuma tarefa cadastrada';
    ul.appendChild(vazio);
    return;
  }
  tarefas.forEach((t) => {
    const li = document.createElement('li');
    if (t.concluida) li.classList.add('concluida');

    const titulo = document.createElement('span');
    titulo.className = 'titulo';
    titulo.textContent = formatarTarefa(t);
    li.appendChild(titulo);

    if (!t.concluida && acoes.aoConcluir) {
      const btn = document.createElement('button');
      btn.className = 'btn-concluir';
      btn.textContent = 'Concluir';
      btn.addEventListener('click', () => acoes.aoConcluir(t.id));
      li.appendChild(btn);
    }
    if (acoes.aoExcluir) {
      const btn = document.createElement('button');
      btn.className = 'btn-excluir';
      btn.textContent = 'Excluir';
      btn.addEventListener('click', () => acoes.aoExcluir(t.id));
      li.appendChild(btn);
    }
    ul.appendChild(li);
  });
}

let tarefasAtuais = [];
let filtroAtual = 'todas';

function mostrarMensagem(texto) {
  const el = document.getElementById('mensagem');
  if (el) el.textContent = texto;
}

function desenhar() {
  renderizarLista(filtrarTarefas(tarefasAtuais, filtroAtual), document.getElementById('lista'), {
    aoConcluir: concluirTarefa,
    aoExcluir: excluirTarefa,
  });
  const contador = document.getElementById('contador');
  if (contador) contador.textContent = textoContador(tarefasAtuais);
}

async function carregar() {
  const res = await fetch('/api/tarefas');
  tarefasAtuais = await res.json();
  desenhar();
}

async function adicionarTarefa() {
  const input = document.getElementById('titulo');
  const res = await fetch('/api/tarefas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: input.value }),
  });
  if (!res.ok) {
    const dados = await res.json();
    mostrarMensagem(dados.erro);
    return;
  }
  input.value = '';
  mostrarMensagem('');
  await carregar();
}

async function concluirTarefa(id) {
  await fetch(`/api/tarefas/${id}/concluir`, { method: 'PATCH' });
  await carregar();
}

async function excluirTarefa(id) {
  await fetch(`/api/tarefas/${id}`, { method: 'DELETE' });
  await carregar();
}

if (typeof document !== 'undefined' && document.getElementById('btn-add')) {
  document.getElementById('btn-add').addEventListener('click', adicionarTarefa);
  document.getElementById('titulo').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') adicionarTarefa();
  });
  document.querySelectorAll('.filtro').forEach((btn) => {
    btn.addEventListener('click', () => {
      filtroAtual = btn.dataset.filtro;
      document.querySelectorAll('.filtro').forEach((b) => b.classList.toggle('ativo', b === btn));
      desenhar();
    });
  });
  carregar();
}

if (typeof module !== 'undefined') {
  module.exports = {
    formatarTarefa,
    filtrarTarefas,
    contarPendentes,
    textoContador,
    renderizarLista,
    carregar,
  };
}
