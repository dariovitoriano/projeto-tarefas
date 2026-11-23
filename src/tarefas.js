let tarefas = [];
let proximoId = 1;

function resetar() {
  tarefas = [];
  proximoId = 1;
}

function listar() {
  return [...tarefas];
}

function adicionar(titulo) {
  if (typeof titulo !== 'string' || titulo.trim() === '') {
    throw new Error('Título inválido');
  }
  const tarefa = { id: proximoId++, titulo: titulo.trim(), concluida: false };
  tarefas.push(tarefa);
  return tarefa;
}

function concluir(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) throw new Error('Tarefa não encontrada');
  tarefa.concluida = true;
  return tarefa;
}

module.exports = { resetar, listar, adicionar, concluir };