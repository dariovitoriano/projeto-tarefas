/** @jest-environment jsdom */
const {
  formatarTarefa,
  filtrarTarefas,
  contarPendentes,
  textoContador,
  renderizarLista,
  carregar,
} = require('../public/app');

const exemplo = [
  { id: 1, titulo: 'A', concluida: false },
  { id: 2, titulo: 'B', concluida: true },
  { id: 3, titulo: 'C', concluida: false },
];

beforeEach(() => {
  document.body.innerHTML = '<ul id="lista"></ul><p id="contador"></p>';
});

describe('formatarTarefa', () => {
  test('tarefa pendente fica sem marcador', () => {
    expect(formatarTarefa({ titulo: 'A', concluida: false })).toBe('A');
  });

  test('tarefa concluída recebe marcador', () => {
    expect(formatarTarefa({ titulo: 'A', concluida: true })).toBe('✔ A');
  });
});

describe('filtrarTarefas', () => {
  test('todas retorna tudo', () => {
    expect(filtrarTarefas(exemplo, 'todas')).toHaveLength(3);
  });

  test('pendentes retorna só as não concluídas', () => {
    expect(filtrarTarefas(exemplo, 'pendentes').map((t) => t.id)).toEqual([1, 3]);
  });

  test('concluídas retorna só as concluídas', () => {
    expect(filtrarTarefas(exemplo, 'concluidas').map((t) => t.id)).toEqual([2]);
  });
});

describe('contador', () => {
  test('conta as pendentes', () => {
    expect(contarPendentes(exemplo)).toBe(2);
  });

  test('texto para lista vazia', () => {
    expect(textoContador([])).toBe('Nenhuma tarefa');
  });

  test('texto no singular', () => {
    expect(textoContador([{ id: 1, titulo: 'A', concluida: false }])).toBe('1 tarefa pendente');
  });

  test('texto no plural', () => {
    expect(textoContador(exemplo)).toBe('2 tarefas pendentes');
  });
});

describe('renderizarLista', () => {
  test('cria um item para cada tarefa', () => {
    const ul = document.getElementById('lista');
    renderizarLista(exemplo, ul);
    expect(ul.children).toHaveLength(3);
    expect(ul.children[1].querySelector('.titulo').textContent).toBe('✔ B');
  });

  test('mostra mensagem quando a lista está vazia', () => {
    const ul = document.getElementById('lista');
    renderizarLista([], ul);
    expect(ul.textContent).toBe('Nenhuma tarefa cadastrada');
  });

  test('botão Concluir chama a função com o id', () => {
    const ul = document.getElementById('lista');
    const aoConcluir = jest.fn();
    renderizarLista([{ id: 5, titulo: 'X', concluida: false }], ul, { aoConcluir });
    ul.querySelector('.btn-concluir').click();
    expect(aoConcluir).toHaveBeenCalledWith(5);
  });

  test('botão Excluir chama a função com o id', () => {
    const ul = document.getElementById('lista');
    const aoExcluir = jest.fn();
    renderizarLista([{ id: 7, titulo: 'X', concluida: false }], ul, { aoExcluir });
    ul.querySelector('.btn-excluir').click();
    expect(aoExcluir).toHaveBeenCalledWith(7);
  });

  test('tarefa concluída não tem botão Concluir, mas tem Excluir', () => {
    const ul = document.getElementById('lista');
    renderizarLista([{ id: 1, titulo: 'X', concluida: true }], ul, {
      aoConcluir: jest.fn(),
      aoExcluir: jest.fn(),
    });
    expect(ul.querySelector('.btn-concluir')).toBeNull();
    expect(ul.querySelector('.btn-excluir')).not.toBeNull();
  });

  test('exibe texto com HTML como texto, sem interpretar', () => {
    const ul = document.getElementById('lista');
    renderizarLista([{ id: 1, titulo: '<b>oi</b>', concluida: false }], ul);
    expect(ul.querySelector('b')).toBeNull();
  });
});

describe('carregar', () => {
  test('busca as tarefas na API e atualiza lista e contador', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: async () => exemplo });
    await carregar();
    expect(fetch).toHaveBeenCalledWith('/api/tarefas');
    expect(document.getElementById('lista').children).toHaveLength(3);
    expect(document.getElementById('contador').textContent).toBe('2 tarefas pendentes');
  });
});
