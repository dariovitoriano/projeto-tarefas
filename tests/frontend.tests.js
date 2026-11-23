
const { formatarTarefa, renderizarLista } = require('../public/app');

test('formata tarefa pendente', () => {
  expect(formatarTarefa({ titulo: 'A', concluida: false })).toBe('A');
});

test('formata tarefa concluída com marcador', () => {
  expect(formatarTarefa({ titulo: 'A', concluida: true })).toBe('✔ A');
});

test('renderiza itens na lista', () => {
  document.body.innerHTML = '<ul id="lista"></ul>';
  const ul = document.getElementById('lista');
  renderizarLista([{ titulo: 'X', concluida: false }, { titulo: 'Y', concluida: true }], ul);
  expect(ul.children).toHaveLength(2);
  expect(ul.children[1].textContent).toBe('✔ Y');
});