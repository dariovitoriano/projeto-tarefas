const tarefas = require('../src/tarefas');

beforeEach(() => tarefas.resetar());

describe('adicionar', () => {
  test('adiciona uma tarefa válida', () => {
    const t = tarefas.adicionar('Estudar');
    expect(t).toEqual({ id: 1, titulo: 'Estudar', concluida: false });
    expect(tarefas.listar()).toHaveLength(1);
  });

  test('remove espaços do início e do fim do título', () => {
    expect(tarefas.adicionar('  Estudar  ').titulo).toBe('Estudar');
  });

  test('gera ids crescentes', () => {
    expect(tarefas.adicionar('A').id).toBe(1);
    expect(tarefas.adicionar('B').id).toBe(2);
  });

  test('rejeita título vazio', () => {
    expect(() => tarefas.adicionar('   ')).toThrow('Título inválido');
  });

  test('rejeita título que não é texto', () => {
    expect(() => tarefas.adicionar(123)).toThrow('Título inválido');
    expect(() => tarefas.adicionar(undefined)).toThrow('Título inválido');
  });

  test('rejeita título acima do limite', () => {
    const longo = 'a'.repeat(tarefas.TAMANHO_MAXIMO + 1);
    expect(() => tarefas.adicionar(longo)).toThrow('Título muito longo');
  });

  test('aceita título exatamente no limite', () => {
    const limite = 'a'.repeat(tarefas.TAMANHO_MAXIMO);
    expect(tarefas.adicionar(limite).titulo).toHaveLength(tarefas.TAMANHO_MAXIMO);
  });
});

describe('concluir', () => {
  test('conclui uma tarefa existente', () => {
    const t = tarefas.adicionar('Testar');
    expect(tarefas.concluir(t.id).concluida).toBe(true);
  });

  test('a conclusão fica registrada na lista', () => {
    const t = tarefas.adicionar('Testar');
    tarefas.concluir(t.id);
    expect(tarefas.listar()[0].concluida).toBe(true);
  });

  test('erro ao concluir tarefa inexistente', () => {
    expect(() => tarefas.concluir(99)).toThrow('Tarefa não encontrada');
  });
});

describe('listar', () => {
  test('começa vazia', () => {
    expect(tarefas.listar()).toEqual([]);
  });

  test('alterar a lista retornada não muda os dados internos', () => {
    tarefas.adicionar('A');
    const copia = tarefas.listar();
    copia[0].titulo = 'Alterado';
    copia.push({ id: 99 });
    expect(tarefas.listar()).toHaveLength(1);
    expect(tarefas.listar()[0].titulo).toBe('A');
  });
});

describe('resetar', () => {
  test('limpa as tarefas e reinicia os ids', () => {
    tarefas.adicionar('A');
    tarefas.resetar();
    expect(tarefas.listar()).toEqual([]);
    expect(tarefas.adicionar('B').id).toBe(1);
  });
});
