const tarefas = require('../src/tarefas');

beforeEach(() => tarefas.resetar());

test('adiciona uma tarefa válida', () => {
  const t = tarefas.adicionar('Estudar');
  expect(t).toEqual({ id: 1, titulo: 'Estudar', concluida: false });
  expect(tarefas.listar()).toHaveLength(1);
});

test('rejeita título vazio', () => {
  expect(() => tarefas.adicionar('   ')).toThrow('Título inválido');
});

test('conclui uma tarefa existente', () => {
  const t = tarefas.adicionar('Testar');
  expect(tarefas.concluir(t.id).concluida).toBe(true);
});

test('erro ao concluir tarefa inexistente', () => {
  expect(() => tarefas.concluir(99)).toThrow('Tarefa não encontrada');
});