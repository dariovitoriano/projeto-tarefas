/** @jest-environment jsdom */
const { formatarTarefa, renderizarLista, carregar } = require('../public/app');

beforeEach(() => {
  document.body.innerHTML = '<ul id="lista"></ul>';
});

describe('formatarTarefa', () => {
  test('tarefa pendente fica sem marcador', () => {
    expect(formatarTarefa({ titulo: 'A', concluida: false })).toBe('A');
  });

  test('tarefa concluída recebe marcador', () => {
    expect(formatarTarefa({ titulo: 'A', concluida: true })).toBe('✔ A');
  });
});

describe('renderizarLista', () => {
  test('cria um item para cada tarefa', () => {
    const ul = document.getElementById('lista');
    renderizarLista(
      [{ id: 1, titulo: 'X', concluida: false }, { id: 2, titulo: 'Y', concluida: true }],
      ul
    );
    expect(ul.children).toHaveLength(2);
    expect(ul.children[1].textContent).toBe('✔ Y');
  });

  test('mostra mensagem quando a lista está vazia', () => {
    const ul = document.getElementById('lista');
    renderizarLista([], ul);
    expect(ul.children).toHaveLength(1);
    expect(ul.textContent).toBe('Nenhuma tarefa cadastrada');
  });

  test('tarefa pendente tem botão Concluir que chama a função com o id', () => {
    const ul = document.getElementById('lista');
    const aoConcluir = jest.fn();
    renderizarLista([{ id: 5, titulo: 'X', concluida: false }], ul, aoConcluir);
    ul.querySelector('button').click();
    expect(aoConcluir).toHaveBeenCalledWith(5);
  });

  test('tarefa concluída não tem botão', () => {
    const ul = document.getElementById('lista');
    renderizarLista([{ id: 1, titulo: 'X', concluida: true }], ul, jest.fn());
    expect(ul.querySelector('button')).toBeNull();
  });

  test('exibe texto com HTML como texto, sem interpretar', () => {
    const ul = document.getElementById('lista');
    renderizarLista([{ id: 1, titulo: '<b>oi</b>', concluida: false }], ul);
    expect(ul.querySelector('b')).toBeNull();
  });
});

describe('carregar', () => {
  test('busca as tarefas na API e mostra na lista', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [{ id: 1, titulo: 'A', concluida: false }],
    });
    await carregar();
    expect(fetch).toHaveBeenCalledWith('/api/tarefas');
    expect(document.getElementById('lista').children).toHaveLength(1);
  });
});
