const TAMANHO_MAXIMO = 100;

let tarefas = [];
let proximoId = 1;

function resetar() {
  tarefas = [];
  proximoId = 1;
}

function listar() {
  return tarefas.map((t) => ({ ...t }));
}

function adicionar(titulo) {
  if (typeof titulo !== 'string' || titulo.trim() === '') {
    throw new Error('Título inválido');
  }
  if (titulo.trim().length > TAMANHO_MAXIMO) {
    throw new Error('Título muito longo');
  }
  const tarefa = { id: proximoId++, titulo: titulo.trim(), concluida: false };
  tarefas.push(tarefa);
  return { ...tarefa };
}

function concluir(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) throw new Error('Tarefa não encontrada');
  tarefa.concluida = true;
  return { ...tarefa };
}

function remover(id) {
  const indice = tarefas.findIndex((t) => t.id === id);
  if (indice === -1) throw new Error('Tarefa não encontrada');
  const [removida] = tarefas.splice(indice, 1);
  return { ...removida };
}

module.exports = { resetar, listar, adicionar, concluir, remover, TAMANHO_MAXIMO };
